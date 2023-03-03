---

layout: post
title:  "浅谈 Java 线程同步技术"
date:   2022-04-22 22:44:19 +0800
categories: Java
tags: Java
published: true
language: chinese
toc: true
sidebar: true
about: true
author: david.dong
description: 本文内容对 Java 中用到的线程间同步的技术做了些讨论和总结。
keywords: Thread Synchronization

---

Java 里实现线程间的同步有多种方法，比如使用 `synchronized` 关键字，`wait` 和 `notify`，`volatile` 变量，重入锁，局部变量，阻塞队列或者原子类型变量等。

## synchronized

使用 `synchronized` 关键字：这是最常用的一种方法，它可以修饰代码块或者方法，使得同一时刻只有一个线程能够访问被修饰的代码。例如 ：

```java
public class SynchronizedDemo {
    public static void main(String[] args) {
        //创建两个线程
        Thread t1 = new Thread(new Runnable() {
            @Override
            public void run() {
                //调用同步方法
                syncMethod();
            }
        }, "t1");

        Thread t2 = new Thread(new Runnable() {
            @Override
            public void run() {
                //调用同步方法
                syncMethod();
            }
        }, "t2");

        //启动两个线程
        t1.start();
        t2.start();
    }

    //定义一个同步方法
    public static synchronized void syncMethod() {
        System.out.println(Thread.currentThread().getName() + "开始执行");
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        System.out.println(Thread.currentThread().getName() + "结束执行");
    }
}
```

## wait 和 notify

使用 `wait` 和 `notify` ：这是一种基于对象监视器的机制，它可以让一个线程等待另一个线程的通知，从而实现协作。例如：

```java
public class WaitNotifyDemo {

    private static Object lock = new Object(); //定义一个锁对象

    public static void main(String[] args) {

        //创建两个线程
        Thread t1 = new Thread(new Runnable() {
            @Override
            public void run() {
                synchronized (lock) { //获取锁对象
                    System.out.println("t1开始执行");
                    try {
                        lock.wait(); //释放锁并等待通知
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                    System.out.println("t1收到通知");
                    System.out.println("t1结束执行");
                }
            }
        }, "t1");

        Thread t2 = new Thread(new Runnable() {
            @Override
            public void run() {
                synchronized (lock) { //获取锁对象
                    System.out.println("t2开始执行");
                    try {
                        Thread.sleep(2000); //模拟耗时操作
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                    lock.notify(); //唤醒等待的线程
                    System.out.println("t2发送通知");
                    System.out.println("t2结束执行");
                }
            }
        }, "t2");

        //启动两个线程
        t1.start();
        t2.start();

    }

}
```

## volatile

`Volatile` 变量是一种特殊的变量，它可以保证变量在多个线程之间的可见性，也就是说当一个线程修改了 `volatile` 变量的值后，其他线程能够立即看到最新的值。` Volatile ` 变量还可以防止编译器或者运行时对其进行重排序，从而保证其操作的顺序性。

`Volatile` 变量适合用于以下几种场景：

状态标志：例如一个开关变量，用来控制其他线程的执行流程。
单例模式：例如双重检查锁定（double-checked locking）模式，用来保证对象的唯一性和及时性。
原子操作：例如 long 或 double 类型的赋值操作，在 Java 中不是原子性的，但是定义为 volatile 后可以保证原子性。

假设有一个 `volatile` 变量叫做 stop，它用来控制一个线程的执行流程。当 stop 为 false 时，线程继续运行；当 stop 为 true 时，线程停止运行。代码如下:

```java
public class VolatileExample {
    private static volatile boolean stop = false;

    public static void main(String[] args) throws InterruptedException {
        Thread thread = new Thread(new Runnable() {
            @Override
            public void run() {
                int i = 0;
                while (!stop) { // 如果stop为true，跳出循环
                    i++;
                }
                System.out.println("i=" + i);
            }
        });
        thread.start();
        Thread.sleep(1000); // 主线程休眠1秒
        stop = true; // 修改stop的值为true
    }
}
```

这个例子中，如果不使用 `volatile` 修饰 `stop` 变量，那么可能会出现这样的情况：主线程修改了 stop 的值为 true，但是子线程没有看到最新的值，仍然认为 stop 是 false，导致子线程无法停止。这是因为每个线程都有自己的工作内存（缓存），它们会从主内存中复制共享变量的值，并在工作内存中操作共享变量。如果不使用 `volatile` 修饰共享变量，那么就不能保证其他线程能够及时看到最新的值。

但是如果使用了 `volatile` 修饰 `stop` 变量，那么就可以保证当主线程修改了 stop 的值后，其他线程能够立即看到最新的值，并根据最新的值来执行相应的操作。这是因为 volatile 关键字可以强制让编译器每次都从主内存中读取共享变量的值，并且禁止对其进行重排序。

## 重入锁

重入锁是一种可以被同一个线程多次获取的锁，也就是说当一个线程已经持有了锁，它可以再次请求获取锁而不会被阻塞。重入锁可以避免死锁的发生，也可以提高代码的可读性和可维护性。

Java 中提供了一个重入锁的实现类：`ReentrantLock`，它实现了 `Lock` 接口，提供了加锁和释放锁的方法。使用 `ReentrantLock` 时，需要在 try-finally 块中手动调用 `lock ()` 和 `unlock ()` 方法来保证锁的正确获取和释放。

举个例子吧，假设有一个银行账户类 Account，它有一个余额属性 balance 和一个转账方法 transfer ()，为了保证转账操作的原子性和线程安全性，我们可以使用 `ReentrantLock` 来对 `transfer ()` 方法进行同步控制。
代码如下：

```java
import java.util.concurrent.locks.ReentrantLock;

public class Account {
    private int balance; // 余额
    private final ReentrantLock lock = new ReentrantLock(); // 重入锁

    public Account(int balance) {
        this.balance = balance;
    }

    public void transfer(Account target, int amount) {
        lock.lock(); // 获取锁
        try {
            if (balance >= amount) { // 如果余额足够
                balance -= amount; // 扣除转出金额
                target.balance += amount; // 增加转入金额
            }
        } finally {
            lock.unlock(); // 释放锁
        }
    }
}
```

这个例子中，如果不使用 `ReentrantLock` 来对 `transfer ()` 方法进行同步控制，那么可能会出现这样的情况：当两个线程同时对同一个账户对象执行转账操作时，可能会导致余额不正确或者数据不一致的问题。这是因为转账操作涉及到多个共享变量（balance 和 target.balance）的读写操作，并且这些操作不是原子性的。

但是如果使用了 `ReentrantLock` 来对 `transfer ()` 方法进行同步控制，那么就可以保证当一个线程执行转账操作时，其他线程不能同时执行该操作，并且该操作能够完整地执行而不会被打断。这是因为 `ReentrantLock` 可以实现互斥访问共享资源，并且保证操作的顺序性和原子性。

## 原子类型变量

Java 里的原子类型变量是一种可以在多线程环境下保证原子性操作的变量类，它们使用了 CAS（Compare And Swap）算法来实现无锁的并发控制。

原子类型变量有以下几种分类：

- 标量原子变量类：支持对 int，long 和 boolean 等基本数据类型的操作，例如 AtomicInteger，AtomicLong 和 AtomicBoolean。
- 原子数组类：支持对 int，long 和引用类型的数组元素进行原子性更新，例如 AtomicIntegerArray，AtomicLongArray 和 AtomicReferenceArray。
- 原子字段更新程序类：支持使用反射以原子方式更新类的易失性字段，例如 AtomicLongFieldUpdater，AtomicIntegerFieldUpdater 和 AtomicReferenceFieldUpdater。
- 原子复合变量类：支持对多个变量进行原子性更新，例如 AtomicStampedReference 和 AtomicMarkableReference。
  下面是一个使用 AtomicInteger 的例子：

```java
import java.util.concurrent.atomic.AtomicInteger;

public class AtomicCounter {
    private AtomicInteger value = new AtomicInteger(0);

    public int increment() {
        return value.incrementAndGet();
    }

    public int decrement() {
        return value.decrementAndGet();
    }

    public int get() {
        return value.get();
    }
}
```