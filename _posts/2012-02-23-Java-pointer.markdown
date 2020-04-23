---
layout: post
title:  "Java 里的引用和C++指针的区别"
date:   2012-02-23 23:18:23 +0800
categories: Java
---
对Java里的引用的概念做一个简单的总结，不做过多的阐述。
Java里面除了基本数据类型外,其他所有对象的引用都是指针引用.基本数据类型也可以用对象来引用。 所谓指针引用就是传递的是对象的地址,而不是该对象值的拷贝。<br>
因此从这一点上来说Java的引用和C++里面的指针的作用是一致的。<br>
Java 里的引用和c++的区别是 c++里的指针类型变量可以做运算,强制类型转换。 Java里面的引用避免了这个问题.<br>
Java 语言的安全性高 一方面是所有的引用都是对象引用,没有指针的概念。 另一个方面自动垃圾回收机制,避免了内存泄露。
<br>
Java的基本数据类型及其封装类如下。

数据类型|封装类|
---|:---|
byte|Byte|
char|Character|
double|Double|
float|Float|
int|Integer|
long|Long|
short|Short|
boolean|Boolean|


这些基本类型的封装类提供了一些方法，例如toString(),和包括与其他类型之间的相互转换等。<br>


<!-- Gitalk 评论 start  -->
<!-- Link Gitalk 的支持文件  -->
<link rel="stylesheet" href="https://unpkg.com/gitalk/dist/gitalk.css">
<script src="https://unpkg.com/gitalk/dist/gitalk.min.js"></script>
<div id="gitalk-container"></div>
<script type="text/javascript">
   var gitalk = new Gitalk({

   // gitalk的主要参数
   clientID: '5e24fc307693a6df3bc5',
   clientSecret: '28c9c17e1174c705c42e9bdc92f87cadcc4ec8b8',
   repo: 'daviddong.github.io',
   owner: 'gangdong',
   admin: ['gangdong'],
   id: 'java/2012/02/23/Java-pointer.html',
   title: 'comments'
    });
   gitalk.render('gitalk-container');
</script>
<!-- Gitalk end -->

<br><br><br>

<font size="2" color="#aaa">作者：David Dong<br></font>
<font size="2" color="#aaa">来源：https://gangdong.github.io/daviddong.github.io/java/2012/02/23/Java-pointer.html</font><font size="2" color="#aaa">转载请注明出处。</font>
<span id="busuanzi_container_page_pv" ></span><font size="2" color="#aaa">
本文总阅读量</font><font size="2" color="#aaa"><span id="busuanzi_value_page_pv"></font></span><font size="2" color="#aaa">次</font>