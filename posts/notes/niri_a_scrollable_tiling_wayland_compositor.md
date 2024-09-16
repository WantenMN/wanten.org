---
title: niri：可滚动平铺窗口管理器
desc: niri 是一个基于 Wayland 的**可滚动**平铺窗口管理器
cat: notes
time: 2024-09-16 08:31
tags:
  - niri
  - 分享
  - 介绍
---

**niri** 是一个基于 Wayland 的**可滚动**平铺窗口管理器，其独特之处在于提供了**无限**水平滚动的窗口排列方式。

![niri screenshot](https://github.com/YaLTeR/niri/assets/1794388/52c799a1-77ec-455f-b4aa-f3236a144964)

用铁轨和车厢做一个类比（我可能是第一个使用这个类比的）：

一个 workspace 就像是一条长度无限的铁轨，你可以在铁轨上：

- 放置无限数量的车厢（应用窗口）
- 交换两车厢的位置
- 在任意位置插入新的车厢
- 随意改变车厢长度、宽度（无上限）

以及，将车厢移动到其他铁轨（workspace）上。

是的，铁轨并不止一条，workspaces 是动态的，无上限的，可以想象成是无数条水平排列的铁轨集群。

当你将一个车厢移动到下一条铁轨时，如果那条铁轨不存在，niri 将会动态创建那条铁轨（动态铁轨）。

你可以给铁轨命名，那么它将会一直存在，且会排列在『动态铁轨』之前。通过按键绑定，实现随意切换铁轨、将车厢转移到指定铁轨。

- 视频演示：[https://github.com/YaLTeR/niri/assets/1794388/bce834b0-f205-434e-a027-b373495f9729](https://github.com/YaLTeR/niri/assets/1794388/bce834b0-f205-434e-a027-b373495f9729)

## 核心特点

1. **使用 Rust 编写**
2. **可滚动平铺**：所有窗口在一个无限横向延展的条带上排列，打开新窗口**不会**影响现有窗口的大小。
3. **动态工作区**：每个显示器有独立的动态工作区，工作区可纵向排列并且支持自动调整。
4. **监视器智能管理**：断开或重新连接显示器时，工作区会根据需要自动迁移并复位。
5. **内置功能**：支持内置截图工具、监视器和窗口录屏支持(xdg-desktop-portal-gnome)，并提供触控板和鼠标手势。
6. **高级自定义**：可配置窗口布局、间隙、边框、窗口尺寸，支持渐变边框与动画效果。

## 使用

niri 目前已实现了大部分核心功能，适合尝试。详细的安装和配置指南请参阅 [niri 的 Wiki 页面](https://github.com/YaLTeR/niri/wiki/Getting-Started)。

## 存在的问题

- 不支持 electron 类应用输入法（text-input-v1），chromium、vscode、obsidian 等应用可能无法输入中文
- 不支持 floating window
- 无内置 Xwayland 支持

## 个人体验

我使用 NixOS，安装起来比较[便捷](https://github.com/sodiboo/niri-flake)，从 tty 启动，体验了一天，相当流畅丝滑，非常适合我的工作流，然后果断将 Hyprland (Hyprbug) 删除了。

## 链接

- 仓库地址：[https://github.com/YaLTeR/niri](https://github.com/YaLTeR/niri)
