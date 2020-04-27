---
layout: post
title:  "poll(),pipe()函数使用说明"
date:   2015-03-02 20:12:01 +0800
categories: Linux
---
这篇文章对Linux的poll()函数的使用做一个总结。

#### poll()函数
Linux 中 poll() 函数用来监听并等待多个文件描述符的属性变化。<br>
原型
```c
int poll(struct pollfd *fds, nfds_t nfds, int timeout);
```
其中fds：指向一个结构体数组的第0个元素的指针，每个数组元素都是一个struct pollfd结构，用于指定测试某个给定的fd的条件。

```
struct pollfd{
	int fd;			//文件描述符
	short events;	//等待的事件
	short revents;	//实际发生的事件
};
```
fds结构体参数说明：

fd：每一个 pollfd 结构体指定了一个被监视的文件描述符，可以传递多个结构体，指示 poll() 监视多个文件描述符。

events：指定监测fd的事件（输入、输出、错误），每一个事件有多个取值，如下

revents：revents 域是文件描述符的操作结果事件，内核在调用返回时设置这个域。events 域中请求的任何事件都可能在 revents 域中返回.

注意：每个结构体的 events 域是由用户来设置，告诉内核我们关注的是什么，而 revents 域是返回时内核设置的，以说明对该描述符发生了什么事件

nfds：用来指定第一个参数数组元素个数

timeout：指定等待的毫秒数，无论 I/O 是否准备好，poll() 都会返回.

返回值：

成功时，poll() 返回结构体中 revents 域不为 0 的文件描述符个数；如果在超时前没有任何事件发生，poll()返回 0；

失败时，poll() 返回 -1，并设置 errno 为下列值之一：

EBADF：一个或多个结构体中指定的文件描述符无效。
EFAULT：fds 指针指向的地址超出进程的地址空间。
EINTR：请求的事件之前产生一个信号，调用可以重新发起。
EINVAL：nfds 参数超出 PLIMIT_NOFILE 值。
ENOMEM：可用内存不足，无法完成请求。<br>

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
   id: 'linux/2015/03/02/Linux-epoll.html',
   title: 'comments'
    });
   gitalk.render('gitalk-container');
</script>
<!-- Gitalk end -->

<br><br><br>

<font size="2" color="#aaa">作者：David Dong<br></font>
<font size="2" color="#aaa">来源：https://gangdong.github.io/daviddong.github.io/linux/2015/03/02/Linux-epoll.html</font>
<font size="2" color="#aaa">转载请注明出处。</font>
<span id="busuanzi_container_page_pv" ></span><font size="2" color="#aaa">
本文总阅读量</font><font size="2" color="#aaa"><span id="busuanzi_value_page_pv"></font></span><font size="2" color="#aaa">次</font>
