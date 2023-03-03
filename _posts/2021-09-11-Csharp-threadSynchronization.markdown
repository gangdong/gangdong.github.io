---

layout: post
title:  "浅析 C# 中的线程同步 "
date:   2021-09-11 22:14:11 +0800
categories: C#
tags: C#
Published: true
toc: true
language: chinese
sidebar: true
about: true
author: david.dong
description: 文章对 C# 中的线程同步技术做了些总结和讨论。
keywords: Thread Synchronization 

---

线程间同步是指在多线程环境下，保证共享资源的安全和一致性的机制。
C# 中提供了多种方式实现线程间同步。例如：
- lock 语句：使用一个对象作为锁，保证一次只有一个线程可以进入临界区；
- Interlocked 类：提供了原子操作，如递增、递减、交换和读取值；
- Monitor 类：提供了锁定对象、等待信号和通知信号的方法；
- Mutex 类：提供了**跨进程**的互斥锁，可以用来同步**不同进程中**的线程；
- Semaphore 类：提供了一个计数器，限制同时访问共享资源的线程数；
- AutoResetEvent 和 ManualResetEvent 类：提供了信号量，可以用来通知或等待其他线程的状态变化；

## lock 语句

C# 中的 `lock` 语句是用来同步多个线程对共享资源的访问的。`lock` 语句需要一个对象作为锁，当一个线程进入 `lock` 语句块时，它会获取该对象的互斥锁，执行语句块，然后释放锁。在持有锁的期间，其他线程无法获取该锁，只能等待释放。

`lock` 语句的一般用法如下：

```csharp
using System;
using System.Threading;

class Program
{
    static int counter = 0;
    static object locker = new object();

    static void Main(string[] args)
    {
        Thread t1 = new Thread(Increment);
        Thread t2 = new Thread(Increment);

        t1.Start();
        t2.Start();

        t1.Join();
        t2.Join();

        Console.WriteLine("Counter: " + counter);
    }

    static void Increment()
    {
        for (int i = 0; i < 100000; i++)
        {
            lock (locker)
            {
                counter++;
            }
        }
    }
}
```

## interlocked 类

C# 中的 `Interlocked` 类是用来提供原子操作的，即一次只能有一个线程执行的操作。`Interlocked` 类可以保证对共享变量的读取、修改和写入是线程安全的。` Interlocked ` 类提供了一些静态方法，如：

- Increment：将一个整数变量递增并返回新值。
- Decrement：将一个整数变量递减并返回新值。
- Add：将一个整数变量增加指定的值并返回新值。
- Exchange：将两个变量交换并返回原始值。
- CompareExchange：比较两个变量是否相等，如果相等则交换它们，并返回原始值。

下面是一个使用 Interlocked 类实现线程间同步的例子：

```csharp
using System;
using System.Threading;

class Program
{
    static int counter = 0;

    static void Main(string[] args)
    {
        Thread t1 = new Thread(Increment);
        Thread t2 = new Thread(Increment);

        t1.Start();
        t2.Start();

        t1.Join();
        t2.Join();

        Console.WriteLine("Counter: " + counter);
    }

    static void Increment()
    {
        for (int i = 0; i < 100000; i++)
        {
            Interlocked.Increment(ref counter);
        }
    }
}
```

## Monitor 类

Monitor 类是 C# 中用于提供多线程环境下的线程安全的一个类。它可以确保一次只有一个线程能够访问临界区代码，避免线程之间的**竞争条件**。Monitor 类包含了一些静态方法，它们操作一个控制对临界区访问的对象。`Monitor.Enter` 和 `Monitor.Exit` 方法用于锁定和释放对象或资源。
这里有一个简单的例子，它演示了如何使用 Monitor 类来保护一个共享资源（一个计数器）免受并发访问的影响。请注意，**我们需要在 `try` 和 `finally` 块中使用 `Monitor.Enter` 和 `Monitor.Exit` 方法**。

```csharp
using System;
using System.Threading;

namespace MonitorExample
{
    class Program
    {
        static int counter = 0; //shared resource
        static object lockObject = new object(); //object to lock

        static void Main(string[] args)
        {
            Thread t1 = new Thread(IncrementCounter);
            Thread t2 = new Thread(IncrementCounter);

            t1.Start();
            t2.Start();

            t1.Join();
            t2.Join();

            Console.WriteLine("Final Counter Value: " + counter);
        }

        static void IncrementCounter()
        {
            bool isLockTaken = false;
            try
            {
                Monitor.Enter(lockObject, ref isLockTaken); //lock
                for (int i = 0; i < 100000; i++)
                {
                    counter++;
                }
            }
            finally
            {
                if (isLockTaken)
                    Monitor.Exit(lockObject); //release
            }
        }
    }
}
```

这个例子程序的目的是演示如何使用 Monitor 类来保护一个共享资源（一个计数器）免受并发访问的影响。程序中创建了两个线程 t1 和 t2，它们都调用了同一个方法 `IncrementCounter`，该方法用于对计数器进行递增操作。为了避免两个线程同时修改计数器的值，造成数据不一致的问题，我们需要使用 Monitor 类来锁定一个对象（lockObject），这样一次只有一个线程能够进入临界区（for 循环）。在 try 块中，我们使用 `Monitor.Enter` 方法来尝试获取锁，并将 `isLockTaken` 参数设置为 true。如果获取成功，我们就可以对计数器进行递增操作。在 finally 块中，我们检查 `isLockTaken` 参数是否为 true，如果是，则说明我们已经获取了锁，那么我们就需要使用 `Monitor.Exit` 方法来释放锁，以便其他线程可以访问临界区。最后，在主线程中，我们等待两个子线程执行完毕，并打印出最终的计数器值。

[参考]：

- [C# Monitor class in multithreading with examples - Shekh Ali's Blog](https://www.shekhali.com/c-monitor-class-in-multithreading-with-examples/)
- [Monitor Class (System.Threading) \| Microsoft Learn](https://learn.microsoft.com/en-us/dotnet/api/system.threading.monitor?view=net-7.0)

`Monitor.Enter ()` 方法是用于锁定一个对象或资源，以便一次只有一个线程能够访问临界区。它有两个重载版本，一个只接受一个 object 参数，另一个接受一个 object 参数和一个 ref bool 参数。第一个版本会尝试获取锁，如果成功，则返回，如果失败，则阻塞当前线程，直到获取锁为止。第二个版本会尝试获取锁，并将 `ref bool` 参数设置为 true 或 false，**表示是否获取成功**。这个版本可以指定超时时间或取消令牌。

[参考]：

- [Monitor.Enter Method (System.Threading) \| Microsoft Learn](https://learn.microsoft.com/en-us/dotnet/api/system.threading.monitor.enter?view=net-7.0)

## Mutex 类

Mutex 类是一个同步原语，用于在多线程环境中保护共享资源的访问。Mutex 类提供了 `WaitOne` 和 `ReleaseMutex` 方法，分别用于请求和释放互斥锁的所有权。Mutex 类具有线程关联性，即只有拥有互斥锁的线程才能释放它。

一个简单的例子是，假设有两个线程 A 和 B，需要对一个共享变量 count 进行增加操作。为了避免数据竞争，可以使用一个 Mutex 对象来同步对 count 的访问，如下所示：

```csharp
using System;
using System.Threading;

public class MySharedMutexCounter
{
    public static int count = 0;
    public static Mutex ObjMutex = new Mutex();
}

public class MyThreadA
{
    public Thread Thrd;

    public MyThreadA(string name)
    {
        Thrd = new Thread(this.Run);
        Thrd.Name = name;
        Thrd.Start();
    }

    void Run()
    {
        for (int i = 0; i < 5; i++)
        {
            // Request ownership of the mutex.
            MySharedMutexCounter.ObjMutex.WaitOne();

            // Increment the shared variable.
            Console.WriteLine(Thrd.Name + " is incrementing count.");
            MySharedMutexCounter.count++;
            Console.WriteLine("Count is now " + MySharedMutexCounter.count);

            // Release ownership of the mutex.
            MySharedMutexCounter.ObjMutex.ReleaseMutex();
        }
    }
}

public class MyThreadB
{
    public Thread Thrd;

    public MyThreadB(string name)
    {
        Thrd = new Thread(this.Run);
        Thrd.Name = name;
        Thrd.Start();
    }

    void Run()
    {
        for (int i = 0; i < 5; i++)
        {
            // Request ownership of the mutex.
            MySharedMutexCounter.ObjMutex.WaitOne();

            // Increment the shared variable.
            Console.WriteLine(Thrd.Name + " is incrementing count.");
            MySharedMutexCounter.count++;
            Console.WriteLine("Count is now " + MySharedMutexCounter.count);

            // Release ownership of the mutex.
            MySharedMutexCounter.ObjMutex.ReleaseMutex();
        }
    }
}

class Program
{
   static void Main()
   {
      Console.WriteLine("Main thread starting.");

      // Construct two threads.
      var mt1 = new MyThreadA("Child #1");
      var mt2 = new MyThreadB("Child #2");

      mt1.Thrd.Join();
      mt2.Thrd.Join();

      Console.WriteLine("Main thread ending.");
   }
}
```

[参考]：

- [Mutexes \| Microsoft Learn](https://learn.microsoft.com/en-us/dotnet/standard/threading/mutexes)
- [Mutex Class (System.Threading) \| Microsoft Learn](https://learn.microsoft.com/en-us/dotnet/api/system.threading.mutex?view=net-7.0)
- [How to use C# Mutex for Thread Lock Synchronization - Chubby Developer](https://www.chubbydeveloper.com/csharp-mutex/)

## Semaphore 类

Semaphore 类是一个同步原语，用于控制对一组资源的并发访问。Semaphore 类可以表示一个命名的（系统范围的）或本地的信号量。它是对 Win32 信号量对象的一个薄封装。Win32 信号量是计数信号量，可以用于控制对一个资源池的访问。

Semaphore 类提供了构造函数，用于指定初始和最大的并发访问数，以及可选的系统信号量对象的名称。它还提供了 `WaitOne` 和 `Release` 方法，分别用于请求和释放信号量的计数。

一个简单的例子是，假设有三个线程 A、B、C，需要对三个共享资源 X、Y、Z 进行操作。为了避免同时有多个线程操作同一个资源，可以使用一个 Semaphore 对象来限制最多只能有三个线程同时访问资源池，如下所示：

```csharp
using System;
using System.Threading;

public class MySharedResource
{
    public static string[] resources = new string[] { "X", "Y", "Z" };
    public static Semaphore ObjSemaphore = new Semaphore(3, 3);
}

public class MyThread
{
    public Thread Thrd;

    public MyThread(string name)
    {
        Thrd = new Thread(this.Run);
        Thrd.Name = name;
        Thrd.Start();
    }

    void Run()
    {
        for (int i = 0; i < 5; i++)
        {
            // Request a resource from the pool.
            MySharedResource.ObjSemaphore.WaitOne();

            // Get a random resource index.
            Random rnd = new Random();
            int index = rnd.Next(0, 3);

            // Operate on the resource.
            Console.WriteLine(Thrd.Name + " is operating on resource " + MySharedResource.resources[index]);
            Thread.Sleep(1000);

            // Release the resource to the pool.
            MySharedResource.ObjSemaphore.Release();
        }
    }
}

class Program
{
   static void Main()
   {
      Console.WriteLine("Main thread starting.");

      // Construct three threads.
      var mt1 = new MyThread("Child #1");
      var mt2 = new MyThread("Child #2");
      var mt3 = new MyThread("Child #3");

      mt1.Thrd.Join();
      mt2.Thrd.Join();
      mt3.Thrd.Join();

      Console.WriteLine("Main thread ending.");
   }
}
```

[参考]：

- [Semaphore Class (System.Threading) \| Microsoft Learn](https://learn.microsoft.com/en-us/dotnet/api/system.threading.semaphore?view=net-7.0)
- [Semaphore and SemaphoreSlim \| Microsoft Learn](https://learn.microsoft.com/en-us/dotnet/standard/threading/semaphore-and-semaphoreslim)
- [C# semaphore的使用 - legion - 博客园 (cnblogs.com)](https://www.cnblogs.com/legion/p/6934363.html)

## AutoResetEvent 和 ManualResetEvent 类

AutoResetEvent 和 ManualResetEvent 类是两种同步原语，用于通过信号来管理线程之间的同步。它们
都继承自 `EventWaitHandle` 类，表示一个事件对象。

- AutoResetEvent 类的特点是，当一个线程调用 `WaitOne` 方法等待信号时，如果信号量为终止状态
  (true)，则该线程被允许继续执行，并且信号量自动重置为非终止状态 (false)。这样，每次只能有一个线程通过 WaitOne 方法。
- ManualResetEvent 类的特点是，当一个线程调用 `WaitOne` 方法等待信号时，如果信号量为终止状态
  (true)，则该线程被允许继续执行，并且信号量不会自动重置为非终止状态 (false)。这样，除非手动调用 `Reset` 方法将信号量设置为非终止状态 (false), 否则所有等待的线程都可以通过 `WaitOne` 方法。

一个简单的例子是，假设有三个工作线程 A、B、C 和一个主线程 M。主线程 M 需要在所有工作线程完成后才能结束。为了实现这个目的，可以使用一个 AutoResetEvent 对象和一个 ManualResetEvent 对象来同步主线程和工作线程之间的通知，如下所示：

```csharp
using System;
using System.Threading;

public class MyWorkerThread
{
    public Thread Thrd;
    public AutoResetEvent ObjAuto;
    public ManualResetEvent ObjManual;

    public MyWorkerThread(string name, AutoResetEvent are, ManualResetEvent mre)
    {
        Thrd = new Thread(this.Run);
        Thrd.Name = name;
        ObjAuto = are;
        ObjManual = mre;
        Thrd.Start();
    }

    void Run()
    {
        Console.WriteLine("Inside thread " + Thrd.Name);

        for (int i = 0; i < 5; i++)
        {
            Console.WriteLine(Thrd.Name + " is doing some work.");
            Thread.Sleep(1000);
        }

        Console.WriteLine(Thrd.Name + " is signaling the main thread.");

        // Signal the main thread that this thread is done.
        ObjAuto.Set();

        // Wait for a signal from the main thread to continue.
        ObjManual.WaitOne();

        Console.WriteLine("Resuming thread " + Thrd.Name);

        for (int i = 0; i < 5; i++)
        {
            Console.WriteLine(Thrd.Name + " is doing some more work.");
            Thread.Sleep(1000);
        }

         Console.WriteLine(Thrd.Name + " is finished.");

         // Signal the main thread that this thread is done.
         ObjAuto.Set();
    }
}

class Program
{
   static void Main()
   {
      Console.WriteLine("Main thread starting.");

      // Construct an AutoResetEvent object and a ManualResetEvent object.
      var autoEvt = new AutoResetEvent(false);
      var manualEvt = new ManualResetEvent(false);

      // Construct three worker threads.
      var mt1 = new MyWorkerThread("Child #1", autoEvt, manualEvt);
      var mt2 = new MyWorkerThread("Child #2", autoEvt, manualEvt);
      var mt3 = new MyWorkerThread("Child #3", autoEvt, manualEvt);

      // Wait for all worker threads to finish their first phase of work.
      for (int i = 0; i < 3; i++)
      {
          Console.WriteLine("Main thread waiting for a signal.");
          autoEvt.WaitOne();
          Console.WriteLine("Main thread received a signal.");
      }

      // Signal all worker threads to resume their second phase of work.
      Console.WriteLine("Main thread signaling all worker threads to continue.");
      manualEvt.Set();

       // Wait for all worker threads to finish their second phase of work.
       for (int i = 0; i < 3; i++)
       {
           Console.WriteLine("Main thread waiting for another signal.");
           autoEvt.WaitOne();
           Console.WriteLine("Main thread received another signal.");
       }

       //
```

[参考]：

- [AutoResetEvent and ManualResetEvent in C# (c-sharpcorner.com)](https://www.c-sharpcorner.com/UploadFile/ff0d0f/autoresetevent-and-manualresetevent-in-C-Sharp/)
- [AutoResetEvent Class (System.Threading) \| Microsoft Learn](https://learn.microsoft.com/en-us/dotnet/api/system.threading.autoresetevent?view=net-7.0)
- [c# - What is the difference between ManualResetEvent and AutoResetEvent in .NET? - Stack Overflow](https://stackoverflow.com/questions/153877/what-is-the-difference-between-manualresetevent-and-autoresetevent-in-net)