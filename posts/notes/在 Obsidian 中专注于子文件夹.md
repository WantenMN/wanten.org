---
title: 在 Obsidian 中专注于子文件夹
desc: 
date: 2026-01-15 12:13
tags:
  - Obsidian
  - Folder_Focus
  - Symlink
  - Feature_Requests
path: focusing_on_a_subfolder_in_obsidian
---

我的 Vault 中很多文件夹，其中有一些文件夹有很深的子文件夹，例如 `vault/a/b/c/d/e`。某些时候我想专注于文件夹`e`进行编辑，而不想在`Files`中看到这个文件夹之外的内容。

我想到的解决方案是将文件夹`e`作为一个 vault 打开，用另一个 obsidian 窗口去编辑它，但这样做的问题是，它会在文件夹`e`之下创建新的配置文件夹`.obsidian`，这有些烦人。

我要么重新配置，要么把原 vault 中的配置复制过来。这导致的情况是我要用额外的空间去存储多出一份的配置文件。

我想到了另一个解决方案，用软连接将原 vault 中的配置文件链接到子目录`e`中，这样几乎不占多余的空间，并且完全继承了原 vault 的各种配置。

```sh
ln -s /path/to/vault/.obsidian /path/to/vault/a/b/c/d/e/.obsidian
```

现在的坏消息是，模板功能没法正常使用了，因为它们的配置是基于目录的，除非我把目录文件夹也软链接到子目录中。

这样做确实有效。

```sh
ln -s /path/to/vault/templates /path/to/vault/a/b/c/d/e/templates
```

我写了一个脚本，只需输入目标路径，就能自动将原 vault 的配置和模板自动链接过去。

最终我达成了我的目的：**在 Obsidian 中专注于子目录**。

我认为这是一个实用的功能，希望官方能够实现它，比如点击某个按钮后，`Files`只显示我想要专注的目录。
