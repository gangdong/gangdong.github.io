---
layout: post
title:  "Java 里的引用和C++指针的区别"
date:   2011-04-23 23:18:23 +0800
categories: Java
tags: Java
language: chinese
toc: false
sidebar: true
about: true
author: david.dong
description: 本文阐述了 Java 语言里引用的概念。
keywords: Java/引用 
---
本文对Java里的引用的概念做一个简单的总结，不做过多的阐述。

Java里面除了基本数据类型外,其他所有对象的引用都是指针引用.基本数据类型也可以用对象来引用。 所谓指针引用就是传递的是对象的地址,而不是该对象值的拷贝。<br>

因此从这一点上来说Java的引用和C++里面的指针的作用是一致的。<br>
Java 里的引用和c++的区别是 c++里的指针类型变量可以做运算,强制类型转换。 Java里面的引用避免了这个问题.<br>
Java 语言的安全性高 一方面是所有的引用都是对象引用,没有指针的概念。 另一个方面自动垃圾回收机制,避免了内存泄露。
<br>
Java的基本数据类型及其封装类如下。

数据类型|封装类|
---|---|
byte|Byte|
char|Character|
double|Double|
float|Float|
int|Integer|
long|Long|
short|Short|
boolean|Boolean|

这些基本类型的封装类提供了一些方法，例如toString(),和包括与其他类型之间的相互转换等。<br>
