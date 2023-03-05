---
layout: post
title:  "C# 线程"
date:   2021-03-09 21:55:22 +0800
categories: C#
tags: C#
Published: true
toc: true
language: chinese
sidebar: true
about: true
author: david.dong
description: 文章简单总结了 C# 中的线程用法。
keywords: Thread 
---

在.NET 应用程序中，都是以 `Main ()` 方法作为入口的，**当调用此方法时系统就会自动创建一个主线程**。

线程主要是由 CPU 寄存器、调用栈和线程本地存储器（Thread Local Storage，TLS）组成的。CPU 寄存器主要记录当前所执行线程的状态，调用栈主要用于维护线程所调用到的内存与数据，TLS 主要用于存放线程的状态信息。
多线程的优点：可以同时完成多个任务；可以使程序的响应速度更快；可以让占用大量处理时间的任务或当前没有进行处理的任务定期将处理时间让给别的任务；可以随时停止任务；

可以设置每个任务的优先级以优化程序性能。那么可能有人会问：为什么可以多线程执行呢？总结起来有下面两方面的原因：

- CPU 运行速度太快，硬件处理速度跟不上，所以操作系统进行分时间片管理。这样，从宏观角度来说是多线程并发的，因为 CPU 速度太快，察觉不到，看起来是同一时刻执行了不同的操作。
  但是从微观角度来讲，同一时刻只能有一个线程在处理。

- 目前电脑都是多核多 CPU 的，一个 CPU 在同一时刻只能运行一个线程，但是多个 CPU 在同一时刻就可以运行多个线程。

然而，多线程虽然有很多优点，但是也必须认识到多线程可能存在影响系统性能的不利方面，才能正确使用线程。不利方面主要有如下几点：

- 线程也是程序，所以线程需要占用内存，线程越多，占用内存也越多。

- 多线程需要协调和管理，所以需要占用 CPU 时间以便跟踪线程。

- 线程之间对共享资源的访问会相互影响，必须解决争用共享资源的问题。

- 线程太多会导致控制太复杂，最终可能造成很多程序缺陷。

### C# 中创建线程

在 C# 中，线程是使用 Thread 类处理的，该类在 `System.Threading` 命名空间中。使用 Thread 类创建线程时，只需要提供线程入口，线程入口告诉程序让这个线程做什么。通过实例化一个 Thread 类的对象就可以创建一个线程。
创建线程示例：

```csharp
using System;  
using System.Threading;  

namespace MultithreadingApplication  
{  
    class ThreadCreationProgram  
    {  
        //编写线程要执行的方法
        public static void CallToChildThread()  
        {  
            Console.WriteLine("Child thread starts");  
        }  
         
        static void Main(string[] args)  
        {  
            //实例化一个线程对象，并传入一个指向线程所要执行方法的委托
            ThreadStart childref = new ThreadStart(CallToChildThread);  
            Console.WriteLine("In Main: Creating the Child thread");  
            Thread childThread = new Thread(childref); 
            //start线程 
            childThread.Start();  
            Console.ReadKey();  
        }  
    }  
}
```

上面代码实例化了一个 `Thread` 对象，并指明将要调用的方法 `method ()`，然后启动线程。
`ThreadStart` 是一个无参的、返回值为 void 的委托。

委托定义如下：

```csharp
public delegate void ThreadStart()
```

通过 `ThreadStart` 委托创建并运行一个线程，`ThreadStart` 委托中作为参数的方法**不需要参数，并且没有返回值**。

**创建多线程的步骤**：  
1、编写线程所要执行的方法；
2、实例化 Thread 类，并传入一个指向线程所要执行方法的委托。（这时线程已经产生，但还没有运行）;  
3、调用 Thread 实例的 Start 方法，标记该线程可以被 CPU 执行了，但具体执行时间由 CPU 决定；

### 线程的同步

所谓同步：**是指在某一时刻只有一个线程可以访问被保护的变量**。
如果不能确保对变量的访问是同步的，就会产生错误。
C# 为同步访问变量提供了一个非常简单的方式，即使用 C# 语言的关键字 `Lock` ，**它可以把一段代码定义为互斥段，互斥段在一个时刻内只允许一个线程进入执行，而其他线程必须等待**。
在 C# 中，关键字 `Lock` 定义如下：

```csharp
class Program
{
    static void Main(string[] args)
    {
        BookShop book = new BookShop();
        /创建两个线程同时访问saLe方法
        Thread t1 = new Thread(new Threadstart(book.Sale));
        Thread t2 = new Thread(new Threadstart(book.Sale));
        //启动线程
        t1.start();
        t2.Start();
        Console.ReadKey();
    }
}

class BookShop
{
    //剩余图书数量
    public int num = 1;
    public void Sale()
    {
        //使用Lock关键字解决线程同步问题
        lock (this)
        {
            int tmp = num;
            if(tmp>o)//判断是否有书，如果有就可以卖
            {
                Thread.sleep(1000);
                num -= 1;
                Console.WriteLine("售出一本图书，还剩余{e}本"，num);
            }
            else
            {
                Console.WriteLine("没有了")；
            }
        }
    }
}
```

### C# 跨线程访问

假设我在一个新的子线程 mythread 上访问**主线程的窗体控件** textBox, 会报错误 "线程间访问无效"，原因是 textBox 是由主线程创建的，mythread 线程是另外创建的一个线程，在.NET 上执行的是托管代码，C# 强制要求这些代码必须是线程安全的，**即不允许跨线程访问 Windows 窗体的控件**。

解决方案：
使用回调函数。C# 的回调机制，实质上是委托的一种应用。

```csharp
namespace MultiThreadDemo
{
    public partial class Form1 : Form;
    public Form1()
    {
        InitializeComponent();
    }
    //定义回调
    private delegate void setTextValueCallBack(int value);
    //声明回调
    private setTextValueCallBack setCallBack;
    private void btn_Test_click(object sender,EventArgs e)
    {
        //实例化回调
        setCallBack = new setTextValueCallBack(SetValue);
        //创建一个线程去执行这个方法：创建的线程默认是前台线程
        Thread thread = new Thread(new ThreadStart(Test));
        //Start,方法标记这个线程就绪了，可以随时被执行，具体什么时候执行这个线程，日
        //将线程设置为后台线程
        thread.IsBackground = true;
        thread.Start();
        private void Test()
        {
            for(int i=0；i<10000;i++)
            {
                //使用回调
                textBox1.Invoke(setCallBack,i);
            }
        }
    }
        ///<summary>
        ///定义回调使用的方法
        ///</summary>
        //<param name="vaLue"></param>
        private void Setvalue(int value)
        {
            this.textBox1.Text = value.ToString();
        }
    }
}
```

使用回调的步骤如下：

1. 定义、声明回调方法。
   
   ```csharp
   //定义回调
   private delegate void DoSomeCallBack(Type para);
   //声明回调
   DoSomeCallBack doSomaCallBack;
   ```

2. 初始化回调方法，所谓“初始化回调方法”实际上就是实例化刚刚定义了的委托，这里作为参数的 `DoSomeMethod` 称为“回调方法”，**它封装了对另一个线程中目标对象（窗体控件或其他类）的操作代码**。
   
   ```csharp
   doSomeCallBack=new DoSomeCallBack(DoSomeMethod);
   ```

3. 触发对象动作.
   
   ```csharp
   object Control.Invoke(Delegate method,params object[] args);
   ```

### 前台线程和后台线程

前台线程：只有所有的前台线程都结束，应用程序才能结束。默认情况下创建的线程都是前台线程。
后台线程：只要所有的前台线程结束，后台线程自动结束。通过 `Thread.IsBackground` 设置后台线程。必须在调用 Start 方法之前设置线程的类型，否则一旦线程运行，将无法改变其类型。后台线程一般用于处理不重要的事情，应用程序结束时，后台线程是否执行完成对整个应用程序没有影响。如果要执行的事情很重要，需要将线程设置为前台线程。

### 线程常用的方法

Thread 中包括了多个方法来控制线程的创建、挂起、停止、销毁，以后来的例子中会经常使用。

| 方法           | 作用                         |
| ------------ | -------------------------- |
| Abort ()     | 终止本线程                      |
| Interrupt () | 中断处于 WaitSleepJoin 线程状态的线程 |
| Join ()      | 阻塞调用线程，直到某个线程终止时为止         |
| Resume ()    | 继续运行已挂起的线程                 |
| Start ()     | 执行本线程                      |
| Suspend ()   | 挂起当前线程，如果当前线程已属于挂起状态则此不起作用 |
| Sleep ()     | 把正在运行的线程挂起一段时间             |

### 线程的常用属性值

| 属性值             | 说明             |
| --------------- | -------------- |
| CurrentContext  | 获取当前线程的上下文     |
| CurrentThread   | 获取当前正在运行的线程    |
| isActive        | 获取当前线程的执行状态    |
| isBackground    | 获取当前线程是否为后台线程  |
| name            | 获取或者设置线程的名称    |
| Priority        | 获取或者设置线程的优先级   |
| ThreadState     | 获取线程的状态        |
| ManagedThreadId | 获取当前托管线程的唯一标识符 |

`ManagedThreadId` 是确认线程的唯一标识符，程序在大部分情况下都是通过 `Thread.ManagedThreadId` 来辨别线程的。开发人员可以通过程序设置线程的名称，但这只是一个辅助功能。

### 线程的优先级别

当线程之间争夺 CPU 时间时，CPU 按照线程的优先级给予服务。高优先级的线程可以完全阻止低优先级的线程执行。.NET 为线程设置了 Priority 属性来定义线程执行的优先级别，

里面包含 5 个选项，其中 Normal 是默认值。

- Lowest: 可以将 Thread 安排在具有任何其他优先级的线程之后。
- BelowNormal: 可以将 Thread 安排在具有 Normal 优先级的线程之后，在具有 Lowest 优先级的线程之前。
- Normal: 默认选择。可以将 Thread 安排在具有 AboveNormal 优先级的线程之后，在具有 BelowNormal 优先级的线程之前。
- AboveNormal: 可以将 Thread 安排在具有 Highest 优先级的线程之后，在具有 Normal 优先级的线程之前。
- Highest: 可以将 Thread 安排在具有任何其他优先级的线程之前。

### C# 中这条语句什么意思 ？

```csharp
new Action(() => { this.comboBox1.SelectedItem.ToString(); })
```

这条语句是创建一个新的 `Action` 委托，**它表示一个没有参数和返回值的方法**。这个方法的内容是获取 comboBox1 控件中选中的项，并将其转换为字符串。这个委托可以用于 `Invoke` 或 `BeginInvoke` 方法，以便在其他线程上执行 UI 操作。
例如

```csharp
Invoke(new Action(() => { this.comboBox1.SelectedItem.ToString(); }))
```

### new Action 的用法是什么？如果我想表示一个 string 类型的返回值，没有参数的方法该如何实现？

`new Action` 的用法是创建一个委托类型，它可以表示一个没有返回值的方法。如果你想表示一个 `string` 类型的返回值，没有参数的方法，你可以使用 `Func<string>` 委托。
例如：

```csharp
// 创建一个Action委托，它表示一个打印Hello World的方法
Action action = new Action(() => {Console.WriteLine("Hello World");});
// 调用这个委托
action();

// 创建一个Func<string>委托，它表示一个返回当前日期字符串的方法
Func<string> func = new Func<string>(() => {return DateTime.Now.ToString();});
// 调用这个委托，并打印返回值
Console.WriteLine(func());
```
