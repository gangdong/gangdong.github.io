---
layout: post
title: C# 的 IntPtr 类型
date:  2021-12-10 20:29:33 +0800
categories: C#
tags: C#
Published: true
toc: true
language: chinese
sidebar: true
about: true
author: david.dong
description: C# 中的 Intptr 类型的学习。
keywords: IntPtr 
---

C# 中，IntPtr 是一个代表内存位置指针的类型。它被用来存储一个变量或一个对象在内存中的地址。IntPtr 是一个整数类型，但它的大小与平台有关。在 32 位系统中，IntPtr 的大小为 32 比特（4字节），在 64 位系统中，它的大小为 64 比特（8字节）。

IntPtr 通常在处理非托管代码或与其他使用指针的语言相互操作时使用。例如，如果你从动态链接库（DLL）中调用一个以指针为参数的函数，你可以使用IntPtr将一个变量的地址传递给该函数。C# 中主要用它**调用 C++\C 封装的 DLL 库**；

下面主要介绍 IntPtr 的常见用法。

### 1 .int 类型与 IntPtr 类型之间的转换

```csharp
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;

namespace MyIntPtr
{
    class Program
    {
        static void Main(string[] args)
        {
            int nValue1 = 10;
            int nValue2 = 20;
            //AllocHGlobal(int cb):通过使用指定的字节数，从进程的非托管内存中分配内存。
            IntPtr ptr1 = Marshal.AllocHGlobal(sizeof(int));
            IntPtr ptr2 = Marshal.AllocHGlobal(sizeof(int));
            //WriteInt32(IntPtr ptr, int val):将 32 位有符号整数值写入非托管内存。
            //int->IntPtr
            Marshal.WriteInt32(ptr1, nValue1);
            Marshal.WriteInt32(ptr2, nValue2);
            // ReadInt32(IntPtr ptr, int ofs):从非托管内存按给定的偏移量读取一个 32 位带符号整数
            //IntPtr->int
            int nVal1 = Marshal.ReadInt32(ptr1, 0);
            int nVal2 = Marshal.ReadInt32(ptr2, 0);
            //FreeHGlobal(IntPtr hglobal):释放以前从进程的非托管内存中分配的内存。
            Marshal.FreeHGlobal(ptr1);
            Marshal.FreeHGlobal(ptr2);
        }
    }
}
```

### 2.string 类型与 IntPtr 之间的转换

```csharp
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;

namespace MyIntPtr
{
    class Program
    {
        static void Main(string[] args)
        {
            string str = "aa";
            IntPtr strPtr = Marshal.StringToHGlobalAnsi(str);
            string ss = Marshal.PtrToStringAnsi(strPtr);
            Marshal.FreeHGlobal(strPtr);  
        }
    }
}
```

### 3. 结构体与 IntPtr 之间的转换

```csharp
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;

namespace MyIntPtr
{
    class Program
    {
        public struct stuInfo
        {
            public string Name;
            public string Gender;
            public int Age;
            public int Height;
        }
        static void Main(string[] args)
        {
            stuInfo stu = new stuInfo()
            {
                Name = "张三",
                Gender = "男",
                Age = 23,
                Height = 172,
            };

            //获取结构体占用空间的大小
            int nSize = Marshal.SizeOf(stu);
            //声明一个相同大小的内存空间
            IntPtr intPtr = Marshal.AllocHGlobal(nSize);
            //IntPtr->Struct
            Marshal.StructureToPtr(stu, intPtr,true);
            //Struct->IntPtr
            stuInfo Info =(stuInfo)Marshal.PtrToStructure(intPtr, typeof(stuInfo));

            Console.ReadKey();

        }
    }
}
```

### 4.  调用 C++\C 封装的 DLL 库

```csharp
Copy codeusing System;
using System.Runtime.InteropServices;

namespace IntPtrExample
{
    class Program
    {
        // Import the DLL function that takes an IntPtr argument
        [DllImport("mylibrary.dll")]
        static extern void MyFunction(IntPtr ptr);

        static void Main(string[] args)
        {
            // Create an integer variable
            int x = 10;

            // Allocate memory for the variable and get a pointer to it
            IntPtr ptr = Marshal.AllocHGlobal(Marshal.SizeOf(x));
            Marshal.StructureToPtr(x, ptr, false);

            // Call the DLL function and pass the pointer to the variable
            MyFunction(ptr);

            // Free the allocated memory
            Marshal.FreeHGlobal(ptr);
        }
    }
}
```

在这个例子中，`MyFunction()` 函数从一个DLL中导入，并接受一个 IntPtr 参数。`Main()` 方法使用 `Marshal.AllocHGlobal()` 方法为一个整数变量分配内存，然后使用一个 IntPtr 变量将该变量的地址传递给 `MyFunction()`。

注意，当使用 IntPtr 时，正确管理被分配的内存是很重要的。在上面的例子中，内存是用 `Marshal.AllocHGlobal()` 分配的，然后在不再需要时用 `Marshal.FreeHGlobal()` 释放。未能正确管理内存会导致内存泄漏或其他问题。
