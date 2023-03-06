---
layout: post
title: "Windows消息处理机制"
date: 2022-06-18 19:43:52 +0800
categories: Windows
tags: Windows
Published: true
toc: true
sidebar: true
language: chinese
about: true
author: david.dong
description: 记录 Windows 消息处理原理的学习内容
keywords: Windows message processing
---

Windows32 程序是由消息事件驱动的。一个消息，是系统定义的一个 32 位的值，它唯一的定义了一个事件，向 Windows 发出一个通知，告诉应用程序某个事情发生了。

## 消息队列

- Windows 有两种消息队列，**系统消息队列**和**应用程序消息队列**。消息在队列中先入先出。
- **系统消息队列**-由系统维护的消息队列，处理系统事件。例如鼠标、键盘等。
- **程序消息队列**-属于每一个应用程序（线程）的消息队列。由应用程序（线程）维护。系统都会为每个 GUI 线程创建一个消息队列，这个消息队列用来存放该应用程序所创建的窗口的消息。
- 应用程序则通过一个消息循环（消息泵）不断的从消息队列中读取消息，并做出响应。

## 流程如下

- 当鼠标、键盘事件被触发后，相应的鼠标或键盘驱动程序就会把这些事件转换成相应的消息，然后发送到**系统消息队列**，由 Windows 系统去进行处理。

- Windows 从系统消息队列中取出一个消息，根据 MSG 消息结构（消息结构体中的窗口句柄 `hwnd`）确定消息是要被送往那个窗口，然后把取出的消息送往**创建窗口的线程的相应队列**（Windows 会为每个 GUI 线程创建一个消息队列，该线程中的所有窗体共享这个消息队列）。

- 线程看到自己的消息队列中有消息，就从队列中取出来，通过操作系统发送到合适的窗口过程去处理。

- 线程的消息队列的读取和处理消息的部分如下
  
  ```csharp
  while(GetMessage(&msg,NULL,0,0)){
      if(!TranslateAccelerator(msg.hWnd,hAccelTable,&msg))
        {
            TranslateMessage(&msg);
            DispatchMessage(&msg);
        }
  }
  ```
  
  说明：首先，`GetMessage` 从进程的主线程的消息队列中获取一个消息并将它复制到 MSG 结构，如果队列中没有消息，则 `GetMessage` 函数将等待一个消息的到来以后才返回。

> 注意:
> `GetMessage` 会一直等待，直到有接收到消息才返回。

`DispatchMessage` 函数将把此消息发送给该消息指定的窗口中已设定的回调函数。即用户自定义的处理函数 `WndProc`。

- 用户自定义的消息处理函数 `WndProc` 处理消息。处理消息代码如下。
  
  ```csharp
  LRESULT CALLBACK WndProc(HWND hWnd, UINT message, WPARAM wParam, LPARAM lParam){
        switch (message) 
        {
              case WM_COMMAND:
                ...
              case case IDM_EXIT:
                ...
                ...
              default:
                return DefWindowProc(hWnd, message, wParam, lParam);
        }
    return 0
  }
  ```

说明：
用户自定义的窗体处理函数也即 `"窗口过程"`, 窗口过程是一个用于处理所有发送到这个窗口的消息的函数。任何一个窗口类都有一个窗口过程。**同一个类的窗口使用同样的窗口过程来响应消息**。系统发送消息给窗口过程将消息数据作为参数传递给他，消息到来之后，按照消息类型排序进行处理，其中的参数则用来区分不同的消息，窗口过程使用参数产生合适行为。

![windows-message-handling]({{site.cdn_baseurl}}/assets/image/windows-message-handling-01.png){: .center-image }

## 消息结构体

```csharp
typedef struct tagMsg {
    HWND hwnd; //接受该消息的窗口句柄
    UINT message; //消息常量标识符，也就是我们通常所说的消息号
    WPARAM wParam; //32位消息的特定附加信息，确切含义依赖于消息值
    LPARAM lParam; //32位消息的特定附加信息，确切含义依赖于消息值
    DWORD time; //消息创建时的时间
    POINT pt; //消息创建时的鼠标/光标在屏幕坐标系中的位置
}MSG;
```

## 发送消息函数 SendMessage () 和 PostMessage () 的区别

- `SendMessage` 这个函数主要是向一个或多个窗口发送一条消息，**这个函数是异步函数。一直等到消息被处理之后才会返回**。
- `PostMessage` 该函数把一条消息放置到创建 hWnd 窗口的线程的消息队列中，**该函数不等消息被处理就马上将控制返回**。
- 被**发送**的消息（`SendMessage`）会被立即处理，处理完毕后函数才会返回；被**寄送**的 (`PostMessage`) 消息不会被立即处理，他被放到一个先进先出的队列中，一直等到应用程序空线的时候才会被处理，不过函数放置消息后立即返回。

## 读取消息函数 GetMessage () 和 WaitMessage (), PeekMessage ()

- 都是读取消息的函数
- `GetMessage` 会一直等到接收到消息才返回。
- `PeekMessage` 函数不会等到有消息放入队列时才返回.
- `WaitMessage` 当一个应用程序无事可做时，该函数就将控制权交给另外的应用程序，同时将该应用程序挂起，直到一个新的消息被放入应用程序的队列之中才返回。