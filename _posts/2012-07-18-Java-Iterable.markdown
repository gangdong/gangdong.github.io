---
layout: post
title:  "Java 的Iterable接口使用"
date:   2012-07-18 13:27:23 +0800
categories: Java
published: false
---

Iterable<>是Java.lang包中定义的一个接口, Java 文档 [Iterable Java 文档](https://docs.oracle.com/javase/8/docs/api/)
从以下可以看出该接口主要声明了一个iterator()方法，该方法返回一个iterator<>接口。
![Iterable](/assets/image/java-iterable-function.png)
那我们接下来看一看iterator<>接口主要内容，iterator<>接口的Java 文档里说明
iterator<>接口主要声明了三个方法。
+ boolean hasNext()
+ E next()
+ default void remove()

看到这里就很清楚了，实现了iterator<>接口的类可以进行迭代遍历，iterator<>接口通过对以上3个方法的封装实现了对遍历访问的支持。Java里的集合类都实现了iterator<>接口。

有一个问题，为什么不直接将hasNext()，next()方法放在Iterable接口中，其他类直接实现就可以了？

原因是有些集合类可能不止一种遍历方式，实现了Iterable的类可以再实现多个Iterator内部类，通过返回不同的Iterator实现不同的遍历方式，这样更加灵活。如果把两个接口合并，就没法返回不同的Iterator实现类了。

<br>
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
   id: 'c/touch/linux/2014/06/25/Touch-driver.html',
   title: 'comments'
    });
   gitalk.render('gitalk-container');
</script>
<!-- Gitalk end -->

<br><br><br>

<font size="2" color="#aaa">作者：David Dong<br></font>
<font size="2" color="#aaa">来源：https://gangdong.github.io/daviddong.github.io/c/touch/linux/2014/06/25/Touch-driver.html</font>
<font size="2" color="#aaa">转载请注明出处。</font>
<span id="busuanzi_container_page_pv" ></span><font size="2" color="#aaa">
本文总阅读量</font><font size="2" color="#aaa"><span id="busuanzi_value_page_pv"></font></span><font size="2" color="#aaa">次</font>