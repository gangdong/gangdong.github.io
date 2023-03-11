---

layout: post
title:  "Bundle 在 android 中的应用"
date:   2014-04-14 21:03:36 +0800
categories: Android
tags: Android
language: chinese
toc: false
sidebar: true
about: true
author: david.dong
description: 这篇文章主要讨论了 Bundle 类在 Android 中的作用.
keywords: Bundle/Android

---

Android中Bundle类的作用，根据google [官方文档](http://developer.android.com/reference/android/os/Bundle.html)<br>Bundle类用作携带数据，它类似于Map，用于存放key-value名值对形式的值。<br>

Bundle经常使用在Activity之间或者线程间传递数据，传递的数据可以是 **boolean、byte、int、long、float、double、string** 等基本类型或它们对应的数组，也可以是对象或对象数组。
当Bundle传递的是对象或对象数组时，必须实现`Serializable` 或`Parcelable`接口。
Bundle提供了各种常用类型的`putXxx()/getXxx()`方法，用于读写基本类型的数据。（各种方法可以查看API）<br>
参考代码如下：<br>
{% highlight java %}
//Student 类应该实现Serializable接口
Student student = new student();

//声明一个Bundle的对象
Bundle bundle = new Bundle();

//将student对象装入bundle中，同时声明key值
bundle.putSerializable("student",student);

//声明一个Intent 对象
Intent intent = new Intent(MainActivity.this,DisplayActivity.class);
//intent.setAction("android.intent.action.DISPLAY");

//通过intent发送bundle到目标activity中，实现activity之间的对象传递
intent.putExtras(bundle);

startActivityForResult(intent,2);

{% endhighlight %}