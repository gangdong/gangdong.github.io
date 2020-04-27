---
layout: post
title:  "Bundle 在android中的应用"
date:   2014-04-14 21:03:36 +0800
categories: Android
---
Android中Bundle类的作用，根据google [官方文档](http://developer.android.com/reference/android/os/Bundle.html)<br>Bundle类用作携带数据，它类似于Map，用于存放key-value名值对形式的值.<br>

Bundle经常使用在Activity之间或者线程间传递数据，传递的数据可以是***boolean、byte、int、long、float、double、string***等基本类型或它们对应的数组，也可以是对象或对象数组。
当Bundle传递的是对象或对象数组时，必须实现Serializable 或Parcelable接口。
Bundle提供了各种常用类型的putXxx()/getXxx()方法，用于读写基本类型的数据。（各种方法可以查看API）<br>
参考代码如下：<br>
```java
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

```
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
   id: 'android/2014/04/14/Android-bundle.html',
   title: 'comments'
    });
   gitalk.render('gitalk-container');
</script>
<!-- Gitalk end -->

<br><br><br>

<font size="2" color="#aaa">作者：David Dong<br></font>
<font size="2" color="#aaa">来源：https://gangdong.github.io/daviddong.github.io/android/2014/04/14/Android-bundle.html</font>
<font size="2" color="#aaa">转载请注明出处。</font>
<span id="busuanzi_container_page_pv" ></span><font size="2" color="#aaa">
本文总阅读量</font><font size="2" color="#aaa"><span id="busuanzi_value_page_pv"></font></span><font size="2" color="#aaa">次</font>