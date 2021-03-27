---
layout: post
title:  "Java 的异常处理"
date:   2011-07-27 20:02:36 +0800
categories: Java
tags: Java
language: chinese
toc: true
sidebar: true
about: true
author: david.dong
description: 本文对 Java 的异常处理机制进行了阐述。
keywords: Java/异常处理机制/
---
想要理解Java的异常处理机制，只要掌握好这五个keywords 就可以了。   
**try**, **catch**, **finally**, **throw** 和 **throws** <br>

## 异常捕获
一个常用的异常捕获流程如下图所示，
{% highlight java %}
try{
    需要监听异常的代码;
}catch(Exception e){
    异常处理代码;   
}finally{
    资源释放代码; //此段代码无论有无异常发生都会执行。
}
{% endhighlight %}
此外还有`try-catch`,`try-finally`的用法，是`try-catch-finally`的不同功能的组合。
我们也可以在`tr`y的后面跟若干个`catch`，用于捕获多个异常。
值得注意的是，无论有无执行到`catch`语句 (捕获异常) **finally里面的代码一定会被执行**, 执行的时间点是在`try`或者`catch`的`return`或者`throw`语句之前。也就是说在程序退出前会执行到`finally`包括的语句，然后回来执行`try`或者`catch`块中的`return`或者`throw`语句。如果`finally`中使用了`return`或者`throw`等终止方法的语句，则就不会跳回执行，直接停止。
如果`finally`块中抛出异常则会覆盖前面`try`或者`catch`块中的异常。

`throw` 用来主动抛出异常。<br>
`throws` 用在方法的声明当中，如果该方法声明throws一个异常，则表明该方法里可以不处理该异常，有JVM将异常传递里上层调用者处理。
throw通常和throws联合使用，抛出的是程序中已经产生的异常类实例。

## 异常分类
看完了异常处理的流程，我们再来看看Java异常的分类。
Java的异常都来源于一个接口`throwable`，`throwable`是java.lang包里的一个接口。继承`java.lang.Object`.其中有两个直接子类`ERROR`和`EXCEPTION`，有兴趣可以参考 [Java 官方文档](https://docs.oracle.com/javase/8/docs/api/)<br>
`Throwable` 主要提供了如下的一些方法。<br>
`Throwable getCause()`<br>
`String    getMessage()`<br>
`void      printStackTrace()`<br>
`String    toString()`<br>
<br>
`ERROR`是指的系统的错误，用户无法处理，比如内存溢出等，只有通过修改程序来更正，因此遇到此类错误会让程序终止运行。<br>
ERROR和子类的关系如下图所示。<br>

![Error/subclass]({{site.baseurl}}/assets/image/java-throwable-error.png){: .center-image }<br>
`EXCEPTION`指的是运行时的异常，是用户可以进行处理的异常。<br>
EXCEPTION类和子类的关系如下。<br>

![Exception/subclass]({{site.baseurl}}/assets/image/java-throwable-exception.png){: .center-image }<br>
## Exception 和 RuntimeException
可以看到`RuntimeException`是`Exception`的子类，实际上`RuntimeException`对应的是非检查性异常，用户可以处理也可以不处理，而如何继承的是`exception`,则为检查性异常，用户必须用`try-catch`来处理异常。<br>
一个简单的例子。
{% highlight java %}
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
{% endhighlight %}
运行结果
{% highlight java %}
Exception in thread "main" java.lang.RuntimeException: new runtime exception!
        at daviddong.example.exception.App.runTimeExFun(App.java:16)
        at daviddong.example.exception.App.main(App.java:11)
{% endhighlight %}
可以看出如果函数声明的是抛出一个`RuntimeException`异常，则主调函数可以选择不用`try-catch`来处理。我们将`throws`的异常改为`Exception`,
{% highlight java %}
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
{% endhighlight %}
则会报语法错误`“Unhandled exception type ExceptionJava(16777384)”`，需要用`try-catch`来处理异常。<br>
正确代码如下。
{% highlight java %}
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
{% endhighlight %}
