---
title: Arch Linux 安装笔记
desc: 全盘加密
cat: notes
time: 2025-04-08 20:51
tags:
  - note
  - linux
  - arch
  - encrypt
---

## 制作启动盘

- 下载 Arch Linux 的最新 ISO 文件（假设为 `archlinux-2025.04.01-x86_64.iso`）。
- 插入 U 盘，使用`lsblk`检查设备名称（例如 `/dev/sdb`）。
- 使用 `dd` 命令将 ISO 写入 U 盘：

  ```bash
  sudo dd if=/path/to/archlinux-2025.04.01-x86_64.iso of=/dev/sdb bs=4M conv=fsync oflag=direct status=progress
  ```

## 启动并准备分区

- 进入 Arch Linux 安装环境后，`setfont -d` 修改字体大小。

- 检查磁盘（假设目标磁盘为 `/dev/nvme0n1`）：

  ```bash
  lsblk
  ```

- 使用`cfdisk` 分区（如果提示`Select label type`，选择 `gpt`）：
  - 创建 512M 的 `/boot` 分区（例如 `/dev/nvme0n1p1`），默认 Size Type。
  - 剩余空间分配给另一个分区（例如 `/dev/nvme0n1p2`），用于加密根分区，默认 Size Type。

## 加密根分区

- 对根分区（`/dev/nvme0n1p2`）使用 `cryptsetup` 进行加密，设置别名为 `cryptroot`：

  ```bash
  cryptsetup luksFormat /dev/nvme0n1p2
  ```

- 输入并确认加密密码。
- 打开加密分区：

  ```bash
  cryptsetup open /dev/nvme0n1p2 cryptroot
  ```

- 加密分区将被映射到 `/dev/mapper/cryptroot`。

## 格式化和挂载分区

- 格式化 `/boot` 分区：

  ```bash
  mkfs.fat -F32 /dev/nvme0n1p1
  ```

- 格式化加密根分区为 `ext4`：

  ```bash
  mkfs.ext4 /dev/mapper/cryptroot
  ```

- 挂载分区：

  ```bash
  mount /dev/mapper/cryptroot /mnt
  mkdir /mnt/boot
  mount /dev/nvme0n1p1 /mnt/boot
  ```

## 联网

- 使用 `iwctl` 连接 Wi-Fi：

  ```bash
  iwctl
  ```

- 在 `iwctl` 交互模式下：

  ```bash
  device list
  station wlan0 scan
  station wlan0 get-networks
  station wlan0 connect "SSID"
  ```

- 输入 Wi-Fi 密码，连接成功后退出：

  ```
  exit
  ```

- 测试网络连接：

  ```bash
  ping baidu.com
  ```

## 配置清华大学镜像源

- 编辑 `/etc/pacman.d/mirrorlist`，添加清华大学镜像在最顶部：

  ```bash
  vim /etc/pacman.d/mirrorlist
  ```

  ```txt
  Server = https://mirrors.ustc.edu.cn/archlinux/$repo/os/$arch
  Server = https://mirrors.tuna.tsinghua.edu.cn/archlinux/$repo/os/$arch
  ```

- 更新 `pacman` 数据库：

  ```bash
  pacman -Syy
  ```

## 安装基础系统和必要应用

- 安装基本系统和工具：

  ```bash
  pacstrap /mnt base linux linux-firmware vim base-devel networkmanager lvm2 cryptsetup grub efibootmgr dhcpcd iwctl sudo intel-ucode
  ```

- 生成 `fstab` 文件：

  ```bash
  genfstab -U /mnt >> /mnt/etc/fstab
  ```

## 切换到新系统环境

- 使用 `arch-chroot` 进入新系统：

  ```bash
  arch-chroot /mnt
  ```

## 系统配置

- 启动 NetworkManager 和 dhcpcd

  ```bash
  systemctl enable NetworkManager
  systemctl enable dhcpcd
  ```

- 设置时区

  ```bash
  ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
  ```

- 将当前系统时间写入硬件时钟

  ```bash
  hwclock --systohc
  ```

- 设置主机名（例如 `archlinux`）：

  ```bash
  echo "archlinux" > /etc/hostname
  ```

- 设置 root 密码：

  ```bash
  passwd
  ```

- 创建普通用户（例如 `user`）并启用 `sudo`：

  ```bash
  useradd -m -G wheel -s /bin/bash user
  passwd user
  pacman -S sudo
  visudo  # 取消注释 %wheel ALL=(ALL) ALL
  ```

## 配置 `initramfs`

- 编辑 `/etc/mkinitcpio.conf`，在 `HOOKS` 中添加 `encrypt lvm2`（在 `block` 和 `filesystems` 之间）：

  ```bash
  vim /etc/mkinitcpio.conf
  ```

  ```
  HOOKS=(base udev autodetect modconf block encrypt lvm2 filesystems keyboard fsck)
  ```

- 重新生成 `initramfs`：

  ```bash
  mkinitcpio -P
  ```

## 配置 GRUB

- 编辑 `/etc/default/grub`，添加加密分区参数（使用 `cryptroot` 的 UUID）：

  - 查看 UUID：

    ```bash
    # cryptdevice
    blkid -o value -s UUID /dev/nvme0n1p2 >> /etc/default/grub

    # root
    blkid -o value -s UUID /dev/mapper/cryptroot >> /etc/default/grub
    ```

    ```bash
    vim /etc/default/grub
    # 翻到最底部，有两行 UUID，第一行是 cryptdevice，第二行是 root
    ```

  - 修改 `GRUB_CMDLINE_LINUX_DEFAULT`，例如：
    ```
    GRUB_CMDLINE_LINUX_DEFAULT="loglevel=3 quiet cryptdevice=UUID=your-uuid:cryptroot root=UUID=your-uuid"
    ```

- 安装 GRUB 到 EFI 分区：

  ```bash
  grub-install --efi-directory=/boot --bootloader-id=ArchLinux /dev/nvme0n1p1
  ```

- 生成 GRUB 配置文件：
  ```bash
  grub-mkconfig -o /boot/grub/grub.cfg
  ```

## 完成安装

- 退出 `chroot` 环境：

  ```bash
  exit
  ```

- 关机：

  ```bash
  shutdown now
  ```

- 拔掉 U 盘，启动新系统，输入加密密码，登录。

## 安装 niri

```bash
sudo pacman -S niri alacritty fuzzel xdg-desktop-portal-gtk
```
