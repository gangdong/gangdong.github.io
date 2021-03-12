---
layout: post
title:  "聊一聊开源协议那些事"
date:   2016-06-25 15:34:40 +0800
categories: Others
Published: true
---
![cover]({{site.baseurl}}/assets/image/others-license-cover.jpeg)     
说到开源代码，有些人认为既然都已经开源了，那自然不需要声明任何软件的许可协议。有意思的是，事实正好相反，如果你想把代码分享出来，最好还是选择一个合适的开源协议，这样别人才可以放心的使用。让我们先看一看什么是开源协议。

## 什么是开源协议
我们讲的开源协议通常指的是软件的许可协议(License)，主要内容其实就是界定了软件授权人和被授权人的权利和义务。打个比方，作为软件开发者的你，想开放哪些授权给软件的使用者？后续是否会对软件提供相应的维护以及对于该软件造成的不良后果承担相应的责任？而作为软件的使用者，在使用软件的过程中哪些事情可以做，哪些事情不可以做，哪些事情必须做？软件的许可协议正是用来处理此类问题的法律文书，具有法律效力。

以下是开源协议在维基百科的定义。
> 开源许可是一种计算机软件和其他产品的许可类型，允许使用、修改或在定义的条款和条件下使用、修改或共享的源代码、蓝图和设计。这允许终端用户和商业公司对源代码、图纸或设计进行审查和修改，以满足自己的定制、好奇心或故障排除的需要。开源许可的软件大多是免费的，尽管这并不一定是必须的。许可证只允许非商业的重新分配或修改个人使用的源代码，通常不被认为是开源许可。然而,开源许可可能会有一些限制,尤其是对软件的起源的表达,比如要求保留作者的名字和代码中的版权声明,或要求重新分配授权软件只有在相同的许可(如copyleft许可证)。一组流行的开源软件许可证是由开源计划(OSI)根据其开源定义(OSD)批准的。

而有些人会说，如果我不申明任何许可协议会怎么样？法律上规定，不声明任何许可协议的话等同于保留所有的权利和义务，也就是版权保留(copyright)。这种情况下别人拿到你的代码后基本上什么也做不了，不能复制，修改，发布以及再授权甚至销售等。除非得到你的'特殊'的授权。这个就和软件开源的初衷南辕北辙了。所以说如果想要分享你的软件的话最好还是声明一个许可协议。

现在有很多比较流行的开源许可协议，比如 `GPL`、`BSD`、`LGPL`、`MIT`、`Apache` 等等。这些协议界定的权利和义务有所不同，你可以仔细研究选择一个适合你的来使用。当然如果你不嫌麻烦的话自己写一个许可协议也是可以的，同样具有法律效力。:smirk:  很多知名的大公司都有自己的软件授权许可协议。

## 不同的开源许可协议
刚才讲过，目前流行的开源许可协议对于授权和责任上的界定是有所不同的。下面我们就分析一下它们之间都有哪些差异。

对比这些协议的差异其实是一件很耗费时间和精力的事情，幸运的是我从网上找来了一张图片，可以很清楚简明的把这件事讲清楚，也能节省我不少的时间，好让我有时间喝杯 :coffee:。   
图片来源：[http://www.ruanyifeng.com/blog/2011/05/how_to_choose_free_software_licenses.html](http://www.ruanyifeng.com/blog/2011/05/how_to_choose_free_software_licenses.html)

![licenses]({{site.baseurl}}/assets/image/others-license-01.png){: .center-image }

以上所有的协议都是免费的，选择时根据自身的需要选择即可。

网上看到过有人专门做过分析，目前Github上使用率最高的许可证是`MIT`，后面依次是`Apache 2.0`、`GPL 2.0`、`GPL 3.0`和`bsd-3-clause`。对以上的分析结果不做置评，不过就我自身的体会，在Github上见到使用最多的许可协议确实是`MIT`。多数个人的作品和代码用`MIT`的比较多，我自己在Github上的[几个项目](https://github.com/gangdong?tab=repositories)也都是使用了`MIT`的许可协议。

## MIT 协议
既然讲到了`MIT`协议，那我们就再来看一下这个协议的内容。   
下面以我自己的一个项目的`MIT`协议为例。这份协议基于Github的`MIT`协议模板生成，内容为一份标准的官方协议，只是权利人和时间是填写的我的。   
原文如下：   
> MIT License<br/><br/>
Copyright (c) 2016 David Dong<br/><br/>
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:<br/><br/>
The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.<br/><br/>
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

简单来讲，就是这份协议明确的划定了我作为软件的权利所有人授予了软件的使用者哪些授权和我应该承担的责任。下面我们就来划一下重点。

+ 权利人
> Copyright (c) 2016 David Dong<br/>

这一行声明了该软件的权利人和发布时间。这也是`MIT`协议中唯一需要填写的地方。如果只包含一个年份，说明这是首次发布的年份。如果包含时间段，则第一个年份为第一次发布的年份，第二个是当前版本发布的年份。
+ 授予的软件使用者权利
> including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software.
<br/>

也就是说使用`MIT`协议我授权给软件的使用者可以使用，复制，修改，发布，分发，再授权以及销售软件copy的权利。
+ 免责声明
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY

这一段声明了作为软件的拥有者，本软件不提供任何保证（包括但不限于适销性保证、适用性保证、非侵权性保证）。在任何情况下， (对于任何的权益追索、损失赔偿或者任何追责) ， 作者或者版权所有人都不会负责。

## 使用 MIT
好了，最好再来说一下如何使用`MIT`协议，基本上`MIT`是最宽松的协议，如果你fork了一份代码，作者声明了`MIT`许可，那你只需要做一件事，即`保留作者的版权和许可证信息`。其余的你可以随便使用，修改，分发该代码。

保留作者的版权和许可证信息意味着：
1. 你发布的代码中要包含原作者的`LICENSE`文件，这个文件有完整的`MIT`许可证，其中也会有作者的版权信息。
2. 保留源码里面的版权和许可信息头。
3. 如果你发行的是二进制文件（可执行软件），那就要在软件的某个界面上说明或者`Readme`文件里声明原作者的`MIT`许可。