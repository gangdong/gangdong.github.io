---
layout: post
title:  "Linux fork()函数"
date:   2015-03-22 20:12:01 +0530
categories: linux
---
在Linux中每个进程拥有独立的地址空间,地址空间包括代码段、数据段和堆栈段。<br>
**代码段**：存储程序的代码<br>
**数据段**：存储程序的全局变量和动态分配的内存<br>
**堆栈段**：存储函数运行时的局部变量<br>
进程之间的地址空间是隔离的。

fork()函数的作用是新建立一个进程。这个进程是从父进程COPY过来，因此和父进程几乎完全相同。
fork()函数的原型如下,需要注意的是函数的返回值。
```c
pid_t fork(void);
```
函数返回值:
```
0:子进程返回0
-1:出错返回
其它：父进程返回子进程ID
```
**注意，fork被调用后，是要返回两次，也就是有两个返回值，**
**分别代表了父进程和子进程，这点和一般的函数调用不同。**

看代码。
```
#include <unistd.h>  
#include <stdio.h>   
int main ()   
{   
    pid_t fpid; 
    int mCnt=0; 
    //调用fork()
    fpid=fork();
 
    //fpid 返回0 代表error
    if (fpid < 0){   
        printf("error in fork!"); 
    }  
    // fpid 等于0代表执行的子进程
    else if (fpid == 0) {  
        printf("子进程：id is %4d, pid is %4d, ppid is %4d,/n",fpid,getpid(),getppid());   
        mCnt++;  
    }  
    // 代表父进程执行
    else {  
        printf("父进程：id is %4d, pid is %4d, ppid is %4d,/n",fpid,getpid(),getppid());   
        mCnt++;  
    }  
    printf("执行了: %d/n 次",mCnt);  
    return 0;     
} 
```
执行结果如下。

```
子进程：id is    0, pid is 2621, ppid is 1158,执行了: 1 次
父进程：id is 2621, pid is 2620, ppid is 2019,执行了: 1 次

```
我们可以看到相同的代码段被执行了两次。这是因为调用fork()函数后，就变成两个进程在执行了，这两个进程的执行逻辑完全相同，在子进程中，fork函数返回0，在父进程中，fork返回新创建子进程的进程ID。我们可以通过fork返回的值来判断当前进程是子进程还是父进程。如果把代码稍作修改。
```
    else if (fpid ！= 0) {  
        printf("父进程：id is %4d, pid is %4d, ppid is %4d,/n",fpid,getpid(),getppid());   
        mCnt++;  
    }  
    else {  
        printf("子进程：id is %4d, pid is %4d, ppid is %4d,/n",fpid,getpid(),getppid());   
        mCnt++;  
    } 
```
结果如下，可以看出到是子进程先执行，父进程后执行，与程序的执行顺序无关。
```
子进程：id is    0, pid is 2621, ppid is 1158,执行了: 1 次
父进程：id is 2621, pid is 2620, ppid is 2019,执行了: 1 次
```
关于fork()函数的执行原理，用到了“写时复制”的技术，参考以下的博文，讲的比较清楚。<br>
[https://www.cnblogs.com/zhangchaoyang/articles/2317420.html](https://www.cnblogs.com/zhangchaoyang/articles/2317420.html)

```
fork（）会产生一个和父进程完全相同的子进程，但子进程在此后多会exec系统调用，出于效率考虑，
linux中引入了“写时复制“技术，也就是只有进程空间的各段的内容要发生变化时，才会将父进程的内容
复制一份给子进程。在fork之后exec之前两个进程用的是相同的物理空间（内存区），子进程的代码段、
数据段、堆栈都是指向父进程的物理空间，也就是说，两者的虚拟空间不同，但其对应的物理空间是同一个。
当父子进程中有更改相应段的行为发生时，再为子进程相应的段分配物理空间，如果不是因为exec，内核会
给子进程的数据段、堆栈段分配相应的物理空间（至此两者有各自的进程空间，互不影响），而代码段继续共
享父进程的物理空间（两者的代码完全相同）。而如果是因为exec，由于两者执行的代码不同，子进程的代码
段也会分配单独的物理空间。
fork之后内核会通过将子进程放在队列的前面，以让子进程先执行，以免父进程执行导致写时复制，而后子进程执
行exec系统调用，因无意义的复制而造成效率的下降。

fork时子进程获得父进程数据空间、堆和栈的复制，所以变量的地址（当然是虚拟地址）也是一样的。
```

<br>
<br>
参考：<br>
[https://www.cnblogs.com/zhangchaoyang/articles/2317420.html](https://www.cnblogs.com/zhangchaoyang/articles/2317420.html)
[https://blog.csdn.net/zhangxiao93/article/details/72811700](https://blog.csdn.net/zhangxiao93/article/details/72811700)
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
   id: 'linux/2015/03/22/Linux-fork.html',
   title: 'comments'
    });
   gitalk.render('gitalk-container');
</script>
<!-- Gitalk end -->

<br><br><br>

<font size="2" color="#aaa">作者：David Dong<br></font>
<font size="2" color="#aaa">来源：https://gangdong.github.io/daviddong.github.io/linux/2015/03/22/Linux-fork.html</font>
<font size="2" color="#aaa">转载请注明出处。</font>
<span id="busuanzi_container_page_pv" ></span><font size="2" color="#aaa">
本文总阅读量</font><font size="2" color="#aaa"><span id="busuanzi_value_page_pv"></font></span><font size="2" color="#aaa">次</font>