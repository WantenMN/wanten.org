---
title: Git Bash 的 ln -s 无法创建软链接
desc: 在 Windows 系统中，使用 PowerShell 的 New-Item 命令创建软链接虽可行，但命令冗长且参数顺序不直观；转而尝试 Git Bash 的 ln -s 命令时，发现该命令未真正创建软链接，仅复制源文件，调研后得知需改用 mklink、配置 core.symlinks 或开启 Developer Mode，最终因操作繁琐选择继续使用 PowerShell 命令
date: 2026-01-16 12:43
tags:
  - Windows
  - Git_Bash
  - Symbolic_Link
  - PowerShell
path: windows_git_bash_ln_s_create_symbolic_link_issue
---

在 Windows 中创建软链接，我一般都是在 PowerShell 中执行这个命令：

```sh
New-Item -ItemType SymbolicLink -Path "Path to target" -Target "Path to source" -Force
```

但这个命令太长了，而且先写目标，再写源的这个命令顺序非常不自然。

于是我尝试在 Git Bash 中用 `ln -s`命令，这个命令很简短，先源再到目标的这个顺序也让我感到舒服：

```sh
ln -s /path/to/source /path/to/target
```

我运行这个命令，成功了。但没过多久，我感到不对劲，因为我偶然发现对源文件的修改，没有同步到目标文件中，两者就好像毫无关联一般。

针对这个问题，我认真测试了`ln -s`命令，运行之后，分别对源文件和目标文件进行修改，对照着观察变化。结果就是，它没有创建软链接，而是直接复制了一份源文件。

这个结果让我感到意外，我猜测可能是兼容性问题。

在网上调研后发现，这是一个常见的坑。Git Bash 中创建软链接要用 `mklink` 替代，或配置 `core.symlinks`或开启`Developer Mode`……我觉得这个也好麻烦啊，干脆继续使用 PowerShell 命令。
