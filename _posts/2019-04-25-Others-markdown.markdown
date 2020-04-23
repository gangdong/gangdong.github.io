---
layout: post
title:  "Mark一下 Markdown 语言的基本语法"
date:   2019-04-25 11:03:36 +0530
categories: Others
---
最近在写博客的时候用到了Markdown语言，做为一个学习总结，有必要把常用的语法mark一下。
Markdown 是一种轻量级的「标记语言」，它允许人们使用易读易写的纯文本格式编写文档。
Markdown 的语法十分简单。常用的标记符号也不超过十个，Markdown编写的文档可以导出 HTML 、Word、图像、PDF、Epub 等多种格式的文档。
Markdown 的语法学习归纳起来可以从下面几个方面来学习。
1. 字体 2. 标题 3. 图片 4. 链接 5. 分割线 6. 列表 7. 表格 8. 代码 

### 字体
**语法**

- 斜体：文字两边用 * 包起来
- 粗体：文字两边用 ** 包起来
- 粗斜体：文字两边用 *** 包起来
- 删除线：文字两边用 ~~ 包起来<br>

示列如下：<br>
```
   *斜体*
   **粗体**
   ***粗斜体***
   ~~删除线~~
```
效果如下：<br>
*斜体* 
**粗体**
***粗斜体***
~~删除线~~<br>
### 标题

**语法** 
共分为6级标题，分别在前面加 # ，同时在井号后加一个空格。
示列：<br>

```
# 一级标题
## 二级标题
### 三级标题
```
效果如下：<br>
# 一级标题
## 二级标题
### 三级标题
#### 四级标题
依次论推...

### 图片
**语法**
```
![picname](图片地址''图片title'')
```
<br>效果如下：<br>
![示例图片](https://gangdong.github.io/daviddong-blog.github.io/assets/portfolio.png "example")

### 链接
**语法**
和图片的语法很类似，只是前面缺少一个!。<br>
```
[名称](地址''title'')
```
<br>效果如下：<br>

[David的博客](https://gangdong.github.io/daviddong-blog.github.io/ "welcome")<br>
### 分割线
**语法**
三个或者更多的 --- 或者 *** <br>
```
我是分割线 ---
```
<br>
效果如下:<br>
##### 我是分割线 
---
<br>
### 列表
##### 无序列表
**语法**
在内容前使用* - + 都可以。<br>
```
- 名称
- 年龄
- 性别
```
<br>
效果如下:<br>

- 名称
- 年龄
- 性别

##### 有序列表
**语法**
在内容前使用数字。<br>
```
1. 名称
2. 年龄
3. 性别
```
<br>
效果如下:<br>

1. 名称
2. 年龄
3. 性别
<br>
### 表格
**语法**
语法如下，其中第二行的 ---: 表示了对齐方式，默认**左对齐**，还有**右对齐（右边加：）** 和**居中（两边加：）**
```
表头|表头|表头
---|:--:|---:
内容|内容|内容
内容|内容|内容
```
效果如下:<br>

语言|面向对象|动态语言
---|:--:|---:
Java|是|否
C|否|否
Python|是|是

### 代码
**语法**<br>
对于码农来说是非常有用的，方便打印代码在博客里。
对于单条语句用''包裹语句即可。
对于代码块，用'''包裹即可。<br>
<br>
效果如下:<br>

``` C
int void main(){
	printf("just show how to print me!");
	return 1;
}
```
<br>
到这里**markdown**一些基本的命令就讲完了，用**markdown**写文档还是很方便的。
最后再介绍几款好用的**markdown**的编辑器，方便网友使用。<br>
目前比较主流的支持**markdown**语言的编辑有markdownpad,typora,sublime,Mou,atom,Cmd Markdown 等，这些软件大部分都能支持windows/liunx和ios(Mou只支持ios)的平台。而且大部分是免费使用。功能上大同小异，都支持实时预览和HTML/PDF输出，有些还能够自定义语法的高亮显示等。我目前使用的是markdownpad,编辑起来还是很方便的。

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
   id: '/others/2019/04/25/Others-markdown.html',
   title: 'comments'
    });
   gitalk.render('gitalk-container');
</script>
<!-- Gitalk end -->





###### 作者：David Dong<br>
###### 来源：https://gangdong.github.io/daviddong-blog.github.io/###### others/2019/04/25/markdown.html<br>
###### 转载请注明出处。
