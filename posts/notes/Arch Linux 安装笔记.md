---
title: Arch Linux 安装笔记
desc: 全盘加密
date: 2025-04-08 20:51
tags:
  - Linux
  - Arch_Linux
  - Installation_Guide
path: install_arch_linux_process
---

## 1 制作启动 U 盘

- 下载 Arch Linux 的最新 ISO 文件（假设为 `archlinux-2025.04.01-x86_64.iso`）。

### 1.1 Linux 系统

- 插入 U 盘，使用`lsblk`检查设备名称（例如 `/dev/sdb`）。
- 使用 `dd` 命令将 ISO 写入 U 盘：

  ```bash
  sudo dd if=/path/to/archlinux-2025.04.01-x86_64.iso of=/dev/sdb bs=4M conv=fsync oflag=direct status=progress
  ```

### 1.2 Windows 系统

- 下载启动 Rufus
- 写入 ISO 文件到 U 盘

## 2 进入安装系统

插入启动 U 盘到电脑，设置好 BIOS 启动顺序。

### 2.1 设置终端字体

- `setfont -d` 修改字体大小。

### 2.2 联网

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

## 3 安装

使用官方安装脚本 `archinstall` 安装，傻瓜式配置完各种信息直接安装即可。

```sh
archinstall
```
