---
layout: post
title:  "Android 触摸事件处理机制(1)"
date:   2014-09-06 20:36:41 +0530
categories: android
published: false
---
最近在做touch screen的相关开发工作，对touch event如何在android中进行处理的整个流程有了些了解和体会。在这里把相关的知识点做一个总结归纳。

目前的智能手机都标配触摸屏，使用手指触摸来和手机系统交互，那大家有没有思考过，当手指触摸到屏幕上，会发生什么事情，而手机的操作系统如何得知手指的触摸事件的？

这个简单的问题其实设计到很多技术方面，要想讲清楚，我个人总结起来需要分为3大部分来阐述。
1. 首先touch controller IC 是如何检测到手指的触摸，并把这个触摸的动作转化为一个外部的Input事件输入到android中去？这个涉及到touch 的检测原理以及touch ic的设计。这部分内容请参考我之前写的另外一篇文章 [电容式触摸屏检测原理]()。
2. touch IC 上报的Input事件是如何在android中被读取和分发的？
3. android 系统在拿到事件后是如何处理的？如何将事件发放到对应的控件中？

这里其实设计到了android的Input子系统的设计和android event的传递机制。我会分两篇文章详细的介绍这两方面的内容。<br>

我们先来介绍Input事件是如何在android中被读取和分发的？
从android的架构入手，我们可以看到整个流程可以分成4个部分。

1. touch event 事件生成（IC识别用户的操作产生InputEvent，硬件产生中断将事件交给驱动，驱动交给内核，内核交给framework），这一部分主要是在linux kernal内进行，使用的是native code, c代码。
2. 事件监听部分（这里就很像设计一个服务器，为了及时响应来自客户端的请求，则需要启动一个线程监听）
3. 事件读取部分
4. 事件分发部分



<br>
<br>
作者：David Dong<br>
来源：https://gangdong.github.io/daviddong-blog.github.io/java/android/2019/04/14/bundle.html<br>
转载请注明出处。