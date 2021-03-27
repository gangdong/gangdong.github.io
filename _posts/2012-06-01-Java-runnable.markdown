---
layout: post
title:  "Java 的线程和Runnable接口"
date:   2012-06-01 13:27:23 +0800
categories: Java
tags: Java
published: true
language: chinese
toc: true
sidebar: true
about: true
author: david.dong
description: 本文详细说明了 Java 里实现多线程的方式。
keywords: Java/线程/Runnable/ 
---
Java 实现多线程编程的方式有两种，一种是继承 Thread 类，另一种是实现 Runnable 接口。<br>
下面的内容会分别介绍这两种用法以及使用上的区别。

## Thread 类
Java 通过Thread类来实现多线程，关于Thread类的介绍，可以查阅 [Java文档 Thread](https://docs.oracle.com/javase/8/docs/api/)。<br>
Thread类继承自java.lang.Object，实现了Runnable接口。<br>
Thread类的用法如下。<br>
MyThreadClass.java 
{% highlight java %}
package com.daviddong;

public class MyThreadClass extends Thread {

    private int cnt = 0;

    @Override
    public void run() {
        // TODO Auto-generated method stub
        cnt++;
        System.out.println("线程" + Thread.currentThread().getName() + 
        " 被调用 " + cnt + "次");
    }
}
{% endhighlight %}
App.java
{% highlight java %}
package com.daviddong;
import java.util.ArrayList;

public class App 
{
    
    public static void main( String[] args )
    {
        ArrayList<MyThreadClass> lists = new ArrayList<MyThreadClass>();
        for(int i=0; i<10; i++){
            MyThreadClass tmp = new MyThreadClass(mR);
            lists.add(tmp);
        }
        for(MyThreadClass tmp:lists){
            tmp.start();
        }
    }
}

{% endhighlight %}
运行结果
{% highlight plaintext %}
线程Thread-0 被调用 1次
线程Thread-9 被调用 1次
线程Thread-8 被调用 1次
线程Thread-7 被调用 1次
线程Thread-5 被调用 1次
线程Thread-6 被调用 1次
线程Thread-3 被调用 1次
线程Thread-4 被调用 1次
线程Thread-2 被调用 1次
线程Thread-1 被调用 1次
{% endhighlight %}
由以上结果可以看出，线程的运行结果与执行顺序无关，并且10个线程分别被执行一次，线程内资源无法共享。

## Runnable 接口
Runnable接口的Java文档的介绍。[Runnable]()
Runnable接口内只声明一个方法`Run()`的方法，同Thread内的`Run()`方法一样，该方法内定义了线程的执行体。<br>
Runnable接口的用法如下。<br>
MyRunnable.java
{% highlight java %}
package com.daviddong;

public class MyRunnable implements Runnable{

    private int cnt = 0;
    @Override
    public void run() {
        // TODO Auto-generated method stub
        cnt++;
        System.out.println("线程" + Thread.currentThread().getName() + 
        " 被调用 " + cnt + "次");
    }
}
{% endhighlight %}
App.java
{% highlight java %}
package com.daviddong;
import java.util.ArrayList;

public class App 
{
    
    public static void main( String[] args )
    {
        MyRunnable mR = new MyRunnable();
        ArrayList<Thread> lists = new ArrayList<Thread>();
        for(int i=0; i<10; i++){
            Thread tmp = new Thread(mR);
            lists.add(tmp);
        }
        for(Thread tmp:lists){
            tmp.start();
        }   
    }
}
{% endhighlight %}
运行结果
{% highlight plaintext %}
线程Thread-1 被调用 2次
线程Thread-2 被调用 3次
线程Thread-0 被调用 2次
线程Thread-7 被调用 7次
线程Thread-6 被调用 6次
线程Thread-5 被调用 5次
线程Thread-4 被调用 4次
线程Thread-8 被调用 9次
线程Thread-9 被调用 9次
线程Thread-3 被调用 10次
{% endhighlight %}
同Thread的例子一样，看的出线程的执行顺序与调用顺序无关。但是因为不同的线程中传入的是同一个实现了Runnable接口的对象，因此内部的变量被共享。
由以上两个例子，可以看出使用Thread类和Runnable接口创建线程的不同主要是有2点。
+ 因为Java只能实现单继承，但可以实现多个接口，所以使用继承Thread类的方法就会导致无法继承其他的类，而Runnable接口就可以避免继承的局限。
+ 使用Runnable接口适合于资源的共享。

上面的程序还有一个问题，我们看到使用Runable接口时，虽然资源是被共享的，但是顺序不对，而且有重复出现的情况，正常应该是每个线程被调用时，调用次数加一，且应该顺序增加。造成这个问题的原因是因为不同的线程在执行都会访问共享的资源，而这些线程没有实现同步，共享资源会在一个线程调用的过程中被另外的线程改变。
解决这个问题的话就要用到`synchronized`，使线程之间同步运行。
我们修改一下代码。<br>
MyRunnale.java
{% highlight java %}
package com.daviddong;

public class MyRunnable implements Runnable{

    private int cnt = 0;
    @Override
    public synchronized void run() {
        // TODO Auto-generated method stub
        cnt++;
        System.out.println("线程" + Thread.currentThread().getName() + 
        " 被调用 " + cnt + "次");
    }
}
{% endhighlight %}
使用`synchronized`修饰`run()`方法，使得其在执行时与其他的线程同步。经过synchronized修饰后线程在执行run()方法时会确认是否有其他线程正在执行，如果有的话就加入队列等待，知道可以获得执行权。
执行结果如下。
{% highlight plaintext %}
线程Thread-1 被调用 1次
线程Thread-3 被调用 2次
线程Thread-2 被调用 3次
线程Thread-7 被调用 4次
线程Thread-0 被调用 5次
线程Thread-9 被调用 6次
线程Thread-8 被调用 7次
线程Thread-6 被调用 8次
线程Thread-5 被调用 9次
线程Thread-4 被调用 10次
{% endhighlight %}
现在我们看到共享资源是按顺序被调用且没有重复。<br>
最后在介绍一些Thread类的常用方法。<br>

**Return**|**Function**|**Description**
---|---|---
Thread|currentThread|返回代码段当前被调用的线程
void|sleep()|在指定的毫秒数内让当前"正在执行的线程"休眠（暂停执行）
void|start()|启动当前线程
boolean|isAlive()|当前线程是否处于激活状态
String|getName()|返回当前线程的名字
long|getID()|返回当前线程的ID
void|setPriority()|设置优先级
boolean|isDaemon()|是否为守护进程
