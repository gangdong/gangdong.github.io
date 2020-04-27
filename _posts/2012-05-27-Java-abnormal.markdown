---
layout: post
title:  "Java 的异常处理"
date:   2012-05-27 20:02:36 +0800
categories: Java
---
想要理解Java的异常处理机制，只要掌握好这五个keywords 就可以了。<br>
#### **try**, **catch**, **finally**, **throw** 和 **throws** <br>

一个常用的异常捕获流程如下图所示，
```java
try{
    需要监听异常的代码;
}catch(Exception e){
    异常处理代码;   
}finally{
    资源释放代码; //此段代码无论有无异常发生都会执行。
}
```
此外还有try-catch,try-finally的用法，是try-catch-finally的不同功能的组合。
我们也可以在try的后面跟若干个catch，用于捕获多个异常。
值得注意的是，无论有无执行到catch语句(捕获异常)**finally里面的代码一定会被执行**,执行的时间点是在try或者catch的return或者throw语句之前。也就是说在程序退出前会执行到finally包括的语句，然后回来执行try或者catch块中的return或者throw语句。如果finally中使用了return或者throw等终止方法的语句，则就不会跳回执行，直接停止。
如果finally块中抛出异常则会覆盖前面try或者catch块中的异常。

**throw** 用来主动抛出异常。<br>
**throws** 用在方法的声明当中，如果该方法声明throws一个异常，则表明该方法里可以不处理该异常，有JVM将异常传递里上层调用者处理。
throw通常和throws联合使用，抛出的是程序中已经产生的异常类实例。

#### **JAVA 异常分类**<br>
看完了异常处理的流程，我们再来看看Java异常的分类。
Java的异常都来源于一个接口throwable，throwable是java.lang包里的一个接口。继承java.lang.Object.其中有两个直接子类**ERROR**和**EXCEPTION**，有兴趣可以参考 [Java 官方文档](https://docs.oracle.com/javase/8/docs/api/)<br>
Throwable 主要提供了如下的一些方法。<br>
**Throwable getCause()**<br>
**String    getMessage()**<br>
**void      printStackTrace()**<br>
**String    toString()**<br>
<br>
**ERROR**是指的系统的错误，用户无法处理，比如内存溢出等，只有通过修改程序来更正，因此遇到此类错误会让程序终止运行。<br>
ERROR和子类的关系如下图所示。<br>
![Error/subclass](https://gangdong.github.io/daviddong.github.io/assets/image/java-throwable-error.png)<br>
**EXCEPTION**指的是运行时的异常，是用户可以进行处理的异常。<br>
EXCEPTION类和子类的关系如下。<br>
![Exception/subclass](https://gangdong.github.io/daviddong.github.io/assets/image/java-throwable-exception.png)<br>
#### **Exception** 和 **RuntimeException**<br>
可以看到RuntimeException是Exception的子类，实际上RuntimeException对应的是非检查性异常，用户可以处理也可以不处理，而如何继承的是exception,则为检查性异常，用户必须用try-catch来处理异常。<br>
一个简单的例子。
```java
/**
 * example of java exception
 *
 */
public class App 
{
    public static void main( String[] args )
    {
        runTimeExFun();
    }

    private static void runTimeExFun() throws RuntimeException{

        throw new RuntimeException("new runtime exception!");
        
    }
}
```
运行结果
```
Exception in thread "main" java.lang.RuntimeException: new runtime exception!
        at daviddong.example.exception.App.runTimeExFun(App.java:16)
        at daviddong.example.exception.App.main(App.java:11)
```
可以看出如果函数声明的是抛出一个RuntimeException异常，则主调函数可以选择不用try-catch来处理。我们将throws的异常改为Exception,
```java
/**
 * example of java exception
 *
 */
public class App 
{
    public static void main( String[] args )
    {
        runTimeExFun();
    }

    private static void runTimeExFun() throws Exception{
        throw new RuntimeException("new runtime exception!");
    }
}
```
则会报语法错误“Unhandled exception type ExceptionJava(16777384)”，需要用try-catch来处理异常。<br>
正确代码如下。
```java
/**
 * example of java exception
 *
 */
public class App {
    public static void main(String[] args) {
        try {
            runTimeExFun();
        } catch (Exception e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
    }

    private static void runTimeExFun() throws Exception{
        throw new RuntimeException("new runtime exception!");
    }
}
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
   id: 'java/2012/05/27/Java-abnormal.html',
   title: 'comments'
    });
   gitalk.render('gitalk-container');
</script>
<!-- Gitalk end -->

<br><br><br>

<font size="2" color="#aaa">作者：David Dong<br></font>
<font size="2" color="#aaa">来源：https://gangdong.github.io/daviddong.github.io/java/2012/05/27/Java-abnormal.html</font>
<font size="2" color="#aaa">转载请注明出处。</font>
<span id="busuanzi_container_page_pv" ></span><font size="2" color="#aaa">
本文总阅读量</font><font size="2" color="#aaa"><span id="busuanzi_value_page_pv"></font></span><font size="2" color="#aaa">次</font>