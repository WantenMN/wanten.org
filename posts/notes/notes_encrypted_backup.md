---
title: 笔记的加密和备份
desc: 我如何加密和备份私密文字
cat: notes
time: 2025-07-11 09:55
tags:
  - note
  - encrypt
  - backup
---

我的笔记使用 [git](https://git-scm.com/) 进行版本控制，备份时使用 `git bundle` 打包，加密使用 [age](https://github.com/FiloSottile/age)。

系统是 [NixOS](https://nixos.org/)，同步工具是 [onedrive](https://github.com/abraunegg/onedrive)。

## 加密和备份

### 简要流程

1. 检查是否有未 commit 的更改，如果有，则先创建临时 commit。
2. 创建一个 Git bundle 文件，包含仓库的所有分支和引用。
3. 撤销临时 commit（soft reset）。
4. 使用 age 加密工具，根据 recipients 文件里的公钥对 Git bundle 文件进行加密，并移动到备份目录。
5. 检查备份目录中文件数量，如果超过 30 个，则删除最旧的多余文件，仅保留最新的 30 个。
6. 调用 onedrive 同步命令将备份目录与 OneDrive 云盘进行同步。

### 脚本内容

```sh
#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Configuration
REPO_DIR="/home/wanten/repos/vault" # Directory of the local Git repository
BACKUP_DIR="/home/wanten/onedrive/Backups/Vault" # Directory where backups are stored
HOSTNAME=$(hostname) # Get the hostname
TIMESTAMP=$(date +"%Y-%m%d-%H%M%S") # Current timestamp for naming the bundle file
BUNDLE="vault-$HOSTNAME-$TIMESTAMP.bundle" # Name of the git bundle file
RECIPIENTS="/home/wanten/repos/nix-config/secrets/recipients.txt" # File containing age encryption recipients

# Change to the repository directory, exit with an error message if it fails
cd "$REPO_DIR" || { echo "Repository directory not found"; exit 1; }

# Check for uncommitted changes in the repository
if [ -n "$(git status --porcelain)" ]; then
  echo "Uncommitted changes found. Creating temporary commit."
  git add -A # Add all changes to the staging area
  git commit -m "Temporary backup commit on $TIMESTAMP" # Create a temporary commit
fi

# Create a git bundle containing all branches and refs
echo "Creating git bundle..."
mkdir -p "$BACKUP_DIR" # Create the backup directory if it doesn't exist
git bundle create "$BUNDLE" --all # Create the git bundle file

# If a temporary commit was created, remove it
if git log -1 --pretty=%B | grep -q "Temporary backup commit on $TIMESTAMP"; then
  echo "Removing temporary commit."
  git reset --soft HEAD~1 # Remove the temporary commit without affecting the working directory
  git stash clear # Remove all stashes
  echo "Cleared all git stashes"
fi

# Verify the integrity of the created git bundle
echo "Verifying the git bundle..."
git bundle verify "$BUNDLE"

# Encrypt the bundle file using age
age -e -R "$RECIPIENTS" -o "$BUNDLE.age" "$BUNDLE"
mv "$BUNDLE.age" "$BACKUP_DIR" # Move the encrypted bundle to the backup directory
rm "$BUNDLE" # Remove the original unencrypted bundle file

# Output the completion message
echo "Encrypted backup created: $BACKUP_DIR/$BUNDLE.age"
echo "Backup completed: $BACKUP_DIR/$BUNDLE.age"
echo ""
echo "$BUNDLE.age"
echo ""
ls -lh "$BACKUP_DIR/$BUNDLE.age"
echo ""

# Get the number of files in the folder
FILE_COUNT=$(ls -1q "$BACKUP_DIR" | wc -l)

# Echo the file count
echo "File count: $FILE_COUNT"

# Check if the file count is greater than 30
if [ "$FILE_COUNT" -gt 30 ]; then
 # Files to delete (all except the 30 newest)
 FILES_TO_DELETE=$(ls -t1 "$BACKUP_DIR" | tail -n +31)

 echo "Deleting the following files:"
 echo "$FILES_TO_DELETE"

 # Change to the backup directory and remove the files
 (cd "$BACKUP_DIR" && echo "$FILES_TO_DELETE" | xargs rm)

 echo "Old files deleted."
else
 echo "File count is within the limit (30)."
fi

# Synchronize the backup directory with OneDrive
onedrive --synchronize
```

## 解密和恢复

通常只在其他设备中执行恢复 (合并) 操作。

### 简要流程

1. 从备份目录中列出所有备份文件，使用 fzf 交互式选择一个备份文件
2. 使用 age 和本地私钥解密选中的备份文件，生成一个临时 Git bundle 文件
3. 如果本地仓库已存在则进入仓库，否则用解密的 bundle 文件克隆出一个新仓库
4. 在仓库中添加解密的 bundle 作为临时远程，拉取并获取更新
5. stash 本地改动后合并备份中的 main 分支，并移除临时远程
6. 软重置临时 commit，恢复原本工作区状态

### 脚本内容

```sh
#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Configuration
REPO_DIR="/home/wanten/repos/vault" # Directory of the local Git repository
REPOS_BASE="/home/wanten/repos" # Base directory for repositories
BACKUP_DIR="/home/wanten/onedrive/Backups/Vault" # Directory where backups are stored
BUNDLE_PATH="/home/wanten/Downloads/vault.bundle" # Path to the temporary Git bundle file
AGE_KEY_PATH="" # Path to the age decryption key

# Ensure cleanup on exit
cleanup() {
    rm -f "$BUNDLE_PATH"
}
trap cleanup EXIT

# Function to select a file from a directory and return its path
select_file_from_directory() {
    # Define the directory to search
    local DIRECTORY="$1"

    # Check if the directory exists
    if [ ! -d "$DIRECTORY" ]; then
        echo "Directory not found: $DIRECTORY"
        return 1
    fi

    # Get all files in the directory sorted by modification date
    local FILES
    FILES=$(find "$DIRECTORY" -type f -printf '%T@ %p\n' | sort -n | awk '{print $2}')

    # Check if there are any files
    if [ -z "$FILES" ]; then
        echo "No files found in directory: $DIRECTORY"
        return 1
    fi

    # Create a list of file names and full paths
    local FILE_LIST
    FILE_LIST=$(echo "$FILES" | while read -r FILE; do
        BASENAME=$(basename "$FILE")
        echo "$BASENAME:$FILE"
    done)

    # Use fzf to create a selector, showing only file names
    local SELECTED_FILE
    SELECTED_FILE=$(echo "$FILE_LIST" | fzf --tac --height 15 --reverse --preview 'cat {2}' --preview-window down:3:wrap --delimiter=':' --with-nth=1)

    # Extract the full path of the selected file
    local SELECTED_PATH
    SELECTED_PATH=$(echo "$SELECTED_FILE" | awk -F':' '{print $2}')

    # Check if a file was selected
    if [ -z "$SELECTED_PATH" ]; then
        echo "No file selected."
        return 1
    fi

    # Return the selected file path
    echo "$SELECTED_PATH"
}

# Function to decrypt the selected backup file using age and save it to BUNDLE_PATH
decrypt_selected_backup() {
    local SELECTED_FILE
    echo "Please select a backup file"
    SELECTED_FILE=$(select_file_from_directory "$BACKUP_DIR")

    if [ $? -ne 0 ]; then
        echo "File selection failed."
        exit 1
    fi

    sudo age -d -i "$AGE_KEY_PATH" -o "$BUNDLE_PATH" "$SELECTED_FILE"

    if [ ! -f "$BUNDLE_PATH" ]; then
        echo "Decryption failed or no bundle file found"
        exit 1
    fi
}

# Remove the remote if it exists
remove_remote_if_exists() {
    if git remote | grep -q "b"; then
        git remote remove b
        echo "Removed remote: b"
    fi
}

# Add the decrypted bundle as a temporary remote and fetch updates
add_and_fetch_remote() {
    git remote add b "$BUNDLE_PATH"
    git fetch b
}

# Stash changes and merge fetched changes
stash_and_merge() {
    git stash
    git merge b/main
}

# Remove the temporary remote
remove_temporary_remote() {
    git remote remove b
}

# Reset the last commit without changing the working directory
soft_reset_last_commit() {
    git reset --soft HEAD~1
}

# Change to a directory, exit with an error message if it fails
change_directory() {
    local DIR=$1
    cd "$DIR" || { echo "Directory not found: $DIR"; exit 1; }
}

# Check and setup repository
setup_repository() {
    if [ -d "$REPO_DIR" ]; then
        change_directory "$REPO_DIR"
    else
        # Ensure base directory exists
        change_directory "$REPOS_BASE"
        git clone "$BUNDLE_PATH" vault
        change_directory "$REPO_DIR"
        soft_reset_last_commit
        git remote remove origin
    fi
}

# Main script execution
main() {
    change_directory "$BACKUP_DIR"
    decrypt_selected_backup
    setup_repository
    remove_remote_if_exists
    add_and_fetch_remote
    stash_and_merge
    remove_temporary_remote
    soft_reset_last_commit
}

main

```
