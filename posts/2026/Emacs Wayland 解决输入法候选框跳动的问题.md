---
desc:
date: 2026-04-28 12:20
tags:
  - Emacs
  - Wayland
  - Input_Method
  - fcitx5
path: emacs_wayland_fix_input_method_candidate_box_flicker
status:
  - P5
---

# Emacs Wayland 解决输入法候选框跳动的问题

## 一、问题描述

使用 Emacs Wayland v30.2 版本，搭配 fcitx5 输入中文时，会出现一个影响使用体验的问题：输入法候选框会跟随 preedit（汉字未上屏时的拼音显示）不断跳动，输入过程中候选框位置不稳定，影响输入流畅度。

## 二、快速解决方案

无需修改 Emacs 源码、无需重新编译，只需在 Emacs 配置文件中添加以下 Lisp 代码，即可直接解决候选框跳动问题：

```lisp
;; Emacs Wayland 避免候选框跟随 preedit 跳动
(with-eval-after-load 'pgtk-win
  (advice-add
   'pgtk-preedit-text :filter-return
   (lambda (_)
     (when pgtk-preedit-overlay
       (overlay-put
        pgtk-preedit-overlay
        'before-string
        (propertize
         (overlay-get pgtk-preedit-overlay 'before-string)
         'cursor 1))))))
```

## 三、原理分析

要理解问题的根源和解决方案的逻辑，我们先从 Emacs Wayland 下的输入渲染机制说起。

### 3.1 Emacs Wayland 输入渲染基础

Emacs 在 Wayland 环境下，通过 PGTK（Pure GTK）后端进行界面渲染和输入处理。当我们使用输入法输入中文时，会经历一个 `preedit` 状态——即拼音已输入、但汉字尚未上屏的阶段，此时输入法会向 Emacs 发送 `preedit-text` 事件，告知 Emacs 需显示的拼音内容及样式。

这个事件的处理逻辑，定义在 Emacs 源码的 `emacs/lisp/term/pgtk-win.el` 文件中，核心函数是 `pgtk-preedit-text`。

### 3.2 原始函数工作流程

以下是 `pgtk-preedit-text` 函数的完整源码，我们拆解其工作流程，找到问题关键：

```lisp
(defun pgtk-preedit-text (event)
  "An internal function to display preedit text from input method.

EVENT is a `preedit-text' event."
  (interactive "e")
  (when pgtk-preedit-overlay
    (delete-overlay pgtk-preedit-overlay))
  (setq pgtk-preedit-overlay nil)

  (let ((ovstr "")
        (idx 0)
        atts ov str color face-name)
    (dolist (part (nth 1 event))
      (setq str (car part))
      (setq face-name (intern (format "pgtk-im-%d" idx)))
      (eval
       `(defface ,face-name nil "face of input method preedit"))
      (setq atts nil)
      (when (setq color (cdr-safe (assq 'fg (cdr part))))
        (setq atts (append atts `(:foreground ,color))))
      (when (setq color (cdr-safe (assq 'bg (cdr part))))
        (setq atts (append atts `(:background ,color))))
      (when (setq color (cdr-safe (assq 'ul (cdr part))))
        (setq atts (append atts `(:underline ,color))))
      (face-spec-set face-name `((t . ,atts)))
      (add-text-properties 0 (length str) `(face ,face-name) str)
      (setq ovstr (concat ovstr str))
      (setq idx (1+ idx)))

    (setq ov (make-overlay (point) (point)))
    (overlay-put ov 'before-string ovstr)
    (setq pgtk-preedit-overlay ov)))
```

其工作步骤可概括为 3 步：

1. **清空旧状态**：删除上一次生成的 Overlay（覆盖层），避免残留内容干扰。
2. **构造拼音字符串**：遍历输入法传来的事件数据，将拼音内容（ovstr）根据输入法指定的样式（前景色、背景色、下划线）进行着色处理。
3. **创建并渲染 Overlay**：在当前光标位置（point）创建一个长度为 0 的 Overlay，将着色后的拼音字符串作为 `before-string` 渲染——简单说，就是“在光标位置之前显示这段拼音”。

### 3.3 候选框跳动的核心原因

问题就出在 `before-string` 的渲染逻辑上：

当 `before-string` 插入拼音文本后，Emacs 的物理光标会被自动推到这段拼音的后面；而 GTK 后端会将光标所在的实时位置告知输入法，输入法则会根据光标位置调整候选框的显示坐标。

这样一来，每输入一个拼音字符，`before-string` 的长度就会增加，光标就会向后移动，候选框也会跟着向后“跳动”，形成我们遇到的问题。

### 3.4 解决方案的核心逻辑

解决问题的关键，是固定光标的位置——让光标始终停留在 preedit 拼音的起始位置，这样输入法获取到的光标坐标就不会变化，候选框自然也就不会跳动。

在 Emacs 中，`cursor` 文本属性可以控制物理光标在 Overlay 字符串上的停留位置。我们只需给 `before-string` 增加 `'cursor 1` 属性，就能让光标固定在拼音字符串的第一个字符位置，修改逻辑如下（对比原始代码）：

```lisp
-    (overlay-put ov 'before-string ovstr)
+    (overlay-put ov 'before-string (propertize ovstr 'cursor 1))
```

## 四、解决方案补充说明

我们使用 Emacs 强大的 Advice 机制（类似面向切面编程 AOP），在不修改源码的前提下，动态注入上述修改逻辑，这也是我们开头给出的配置代码的核心原理。下面拆解这段配置的关键细节：

```lisp
;; 解决 Wayland 环境下 PGTK 版本 Emacs 候选框跳动问题
(with-eval-after-load 'pgtk-win
  (advice-add
   'pgtk-preedit-text :filter-return
   (lambda (_)
     (when pgtk-preedit-overlay
       (let ((ovstr (overlay-get pgtk-preedit-overlay 'before-string)))
         (overlay-put
          pgtk-preedit-overlay
          'before-string
          (propertize ovstr 'cursor 1))))))
```

- `with-eval-after-load 'pgtk-win`：延迟加载保护。因为 `pgtk-preedit-text` 函数定义在 `pgtk-win.el` 模块中，只有在 Wayland 环境下加载该模块后，`advice-add` 才能找到目标函数，避免启动报错。
- `:filter-return`：Advice 的类型，意为“在原始函数执行完毕后，对其返回值进行过滤/修改”。这里我们不需要修改返回值，只是利用其“执行时机”，在原始函数创建完 Overlay 后，追加光标位置的设置。
- `overlay-put ... 'cursor 1`：核心操作。原始函数执行后，`pgtk-preedit-overlay` 已创建并渲染，我们获取其 `before-string`，添加 `'cursor 1` 属性后重新赋值，从而固定光标位置，解决候选框跳动问题。
