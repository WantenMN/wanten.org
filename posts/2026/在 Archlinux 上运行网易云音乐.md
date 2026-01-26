---
title: 在 Archlinux 上运行网易云音乐
desc: 在 Arch Linux 环境下通过 Wine 运行网易云音乐的完整流程，包括安装 Wine 及相关组件、下载 Windows 版网易云音乐安装包、使用 winetricks 配置字体和运行依赖，以及安装完成后的具体启动方式
date: 2026-01-26 19:19
tags:
  - Linux
  - Arch_Linux
  - Wine
  - NetEase_Cloud_Music
path: run_netease_music_on_archlinux
---

安装必要的软件：

```sh
sudo pacman -S wine wine-mono winetricks
```

在官网下载网易云音乐的安装包：

- [https://music.163.com/#/download](https://music.163.com/#/download)

使用 winetricks 安装必要的字体和依赖：

```sh
WINEPREFIX=~/wine/netease-music winetricks arial courier cjkfonts allcodecs d3dx9 dxvk winhttp wininet

```

安装网易云：

```sh
WINEPREFIX=~/wine/netease-music wine ~/Downloads/NeteaseCloudMusic_Music_official_3.1.26.204919_32.exe
```

之后的启动方式：

```sh
WINEPREFIX=~/wine/netease-music wine "/home/wanten/wine/netease-music/drive_c/Program Files (x86)/NetEase/CloudMusic/cloudmusic.exe"
```
