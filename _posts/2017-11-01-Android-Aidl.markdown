---
layout: post
title:  "Android Aidl 开发"
date:   2017-11-01 17:13:44 +0800
categories: Android
tags: Android
Published: true
excerpt_separator: <!--more-->
toc: true
sidebar: true
about: true
author: david.dong
description: Android Aidl 介绍. 
keywords: Android/Aidl
---
犹豫了几天，觉得还是把这部分内容写一下吧。虽然在网上已经一大堆了，但是写作本身也是一个查漏补缺的过程。通过对知识的总结归纳可以进一步加深理解。<!--more-->

## 什么是AIDL? 
如果你仔细研读过Android的源码，你会发现其中有大量的.aidl类型的文件。这些文件在android 中起到什么样的作用？

要理解.aidl, 需要从跨进程通信（IPC）说起，我们知道，在Android系统中，每个进程都有自己独立的地址空间，所有的资源分配都是在独立的内存空间内完成的。因此每个进程都和其他进程分隔了开来，每个APP都是一个独立的进程。有时候我们有应用间进行互动的需求，比如两个APP之间传递数据或者APP与系统服务进程之间的交互，任务委托等。

Android中有很多种跨进程通信的方式，比如使用 Bundle, ContentProvider，Socket和BroadcastReceiver等。 AIDL也是其中的一种实现方式。通过AIDL，可以在一个进程中获取另一个进程的数据和调用其释放出来的方法，从而满足进程间通信的需求。

AIDL 全称是 Android Interface Description Lanuage, 即Android接口描述语言。从名字上可以看出 AIDL 主要是定义了接口。AIDL接口定义语言的语法十分简单，和Java很相似，仅存在以下几点差异：
1. AIDL文件以 .aidl 为后缀名
2. AIDL支持的数据类型分为如下几种：
   + 基本数据类型：byte、char、short、int、long、float、double、boolean
String，CharSequence
   + 自定义的数据类型必须实现Parcelable接口
   + List 类型。List承载的数据必须是AIDL支持的类型，或者是其它声明的AIDL对象
   + Map类型。Map承载的数据必须是AIDL支持的类型，或者是其它声明的AIDL对象
3. 除了基本类型数据外，其他的数据类型全部需要显式导包，即使在同一个包内也需要导包。

熟悉Java语法的开发者在使用AIDL接口时应该没有任何障碍。

## 如何使用AIDL
AIDL 使用起来并不复杂，编程人员只需要在.aidl文件定义好接口，Android plafrom-tools会自动生成基于接口的实现类，该类为一个静态抽象类（后面会详细介绍），服务端代码只需要实现接口的业务即可。因此我们也可以将.aidl 理解为一个模板，通过这个模板生成一些跨进程通信必要的代码，开发者只需要关注实现业务内容即可，而无需花精力在实现IPC通信上面。

下面来具体说明如何实现AIDL编程。

1. 首先AIDL文件分为两类，一类用来声明实现了Parcelable接口的数据类型，以供其他AIDL文件使用那些非默认支持的数据类型。还有一类是用来定义接口方法，声明要暴露哪些接口给客户端调用。这两种的AIDL文件编写方法是不同的。

2. 方向TAG，对于非基本数据类型，在声明AIDL接口的时候需要使用方向TAG来声明数据的流动方向，其中
+ in 表示数据只能由客户端流向服务端
+ out 表示数据由服务端流向客户端
+ inout 表示数据可以在服务端和客户端之间双向流动

### 服务端编程
服务端编程步骤如下：
1. 生成一个.aidl文件，文件里声明自定义的对象类型，该数据类一定要实现 parcelable接口 （非8种一般数据类型）。
![01]({{site.cdn_baseurl}}/assets/image/android-aidl-01.PNG){: .center-image }
编写的 AIDL文件示例如下
![01]({{site.cdn_baseurl}}/assets/image/android-aidl-02.PNG){: .center-image }
<div class = "post-note info">
  <div class = "header"></div>
  	<div class = "body">
		<p>关于该文件创建，需要注意以下几点：<br>
           a. 右键点击包名，New->AIDL文件<br>
           b .aidl文件的名字要和后续定义的数据类名一致才可以。不然会报 cannot find the import xxx.class。 <br>
           c. 在Android Studio中要先创建AIDL文件然后创建数据类文件，否则会提示命名重复错误。<br>
           d. parcelable 注意首字母P要小写，这里和要实现的Parcelable接口不同，不然会报 interface declaration, parcelable declaration, AidlTokenType.import or AidlTokenType.package 5
		</p>
  	</div>
</div>
2. 编写自定义的数据类，该类一定要实现 Parcelable 接口（注意大写P）。
3. 为自定义的接口编写 AIDL 文件，文件名随便定。
4. 如果使用了非一般数据类型，接口要加 In/out/inout
5. 一定要引用使用的数据类的包路径进来（导包），即使在一个大包下也要导包。
![01]({{site.cdn_baseurl}}/assets/image/android-aidl-03.PNG){: .center-image }
6. make project 后生成 AIDL的Java文件，路径在 build/generated/下，
![01]({{site.cdn_baseurl}}/assets/image/android-aidl-04.PNG){: .center-image }
观察生成的Java文件发现生成了两个类，其中静态抽象类.Stub继承了Binder类并实现了AIDL接口的方法，注意`asBinder()`方法。
![01]({{site.cdn_baseurl}}/assets/image/android-aidl-05.PNG){: .center-image }
7. AIDL/自定义数据类 完成后，编写 service 类，类内部定义一个 IBinder/.Stub类型的成员mBinder，实现其内部的方法，并且在service的onBind方法内返回该mBinder。


### 客户端程序
1. 拷贝服务端的 .aidl目录到client项目相同目录下，包名保持不变。
2. 拷贝服务端的数据类型类到 client相同目录下，包名保持不变。
![01]({{site.cdn_baseurl}}/assets/image/android-aidl-06.PNG){: .center-image }
3. 编写业务代码，代码中需要生成一个 AIDL接口的对象和一个ServiceConnection 对象。
4. 将本地的AIDL接口对象通过onServiceConnected方法绑定到远端的Binder对象。
5. 通过bindService方法启动远端服务，远端服务启动后，本地的AIDL对象会绑定到远端的Binder对象。
6. 绑定后就可以通过本地Binder对象来调用远端的接口方法了。
 
以上步骤可以看出AIDL接口实际上是远端服务提供的一个钩子，本地应用端要访问远端的服务，首先要先绑定远端服务的钩子（也就是Stub静态类提供的asInterface方法IBookInterface.Stub.asInterface(iBinder)），绑定后即可调用远端的服务。
