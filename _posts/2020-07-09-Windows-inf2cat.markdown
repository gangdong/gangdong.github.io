---
layout: post
title:  "Inf2Cat 工具"
date:   2020-07-09 18:24:12 +0800
categories: Windows
tags: Windows
Published: true
toc: false
sidebar: true
language: chinese
about: true
author: david.dong
description: 想知道 Inf2Cat 工具使用的同学可以进来！
keywords: Inf2Cat/
---
Windows 驱动开发中经常会用到 Windows WDK 自带的 Inf2Cat.exe 工具将驱动程序的 INF 文件转成待签名的 CAT 格式的目录文件。Windows 7 64位系统以上的版本，如果没有对cat或者sys文件进行数字签名，驱动安装会出现问题，或者驱动使用过程也会出现异常。因此，对驱动程序的签名已经是一项必须的操作，这里就介绍一下 Inf2Cat.exe 这个工具。这个工具本身并不能生成签名，但是却是驱动程序签名的必要的一步。

{% if page.toc == false %}
<div class = "separator"></div>
<h2 class="no_toc">Table of content</h2>
* TOC
{: toc }
<div class = "separator"></div>
{% endif %}

## Inf2Cat
MSDN里对这个工具的说明如下：
> Inf2Cat (Inf2Cat.exe) is a command-line tool that determines whether a driver package's INF file can be digitally-signed for a specified list of Windows versions. If so, Inf2Cat generates the unsigned catalog files that apply to the specified Windows versions.

Inf2Cat 工具检查驱动程序包的 INF 文件，了解是否存在结构错误，并且是否可以对验证驱动程序包进行数字签名。仅当 INF 文件中引用的所有文件都存在且源文件位于正确的位置时，才能对驱动程序包进行签名。

### 工具路径
{% highlight ruby %}
c:\Program Files (x86)\Windows Kits\10\bin\x86 
{% endhighlight %}   
### 使用方法
{% highlight ruby %}
Inf2Cat /driver:PackagePath /os:WindowsVersionList [/nocat] [/verbose] [/?] [other switches]
{% endhighlight %}
### 参数说明   

|参数|说明|
|---|---|
|/driver:PackagePath|指定包含驱动程序包的 INF 文件的目录路径。如果指定的目录包含多个驱动程序包的 INF 文件，那么 Inf2Cat 会为每个驱动程序包创建目录文件|
|/nocat|将 Inf2Cat 配置为验证驱动程序包是否符合指定的 Windows 版本的签名要求，而不生成目录文件|
|/os:WindowsVersionList|将 Inf2Cat 配置为验证驱动程序包的 INF 文件是否符合由 WindowsVersionList 指定的 Windows 版本的签名要求。WindowsVersionList 是一个逗号分隔列表，其中可以包含 [一个或多个版本标识符](#windows version)|
|/verbose|将 Inf2Cat 配置为在命令窗口中显示详细信息|
|/?|将 Inf2Cat 配置为在命令窗口中显示帮助信息|
|/uselocaltime|运行驱动程序时间戳验证测试时使用本地时区|

### Windows 版本标识符

|Windows 版本|版本标识符|
|--- |--- |
|Windows 10 x86 19H1 Edition|10_19H1_X86|
|Windows 10 x64 19H1 Edition|10_19H1_X64|
|Windows 10 ARM64 19H1 Edition|10_19H1_ARM64|
|Windows 10 x86 RS5 Edition|10_RS5_X86|
|Windows 10 x64 RS5 Edition|10_RS5_X64|
|Windows 10 ARM64 RS5 Edition|10_RS5_ARM64|
|Windows Server RS5 x64 Edition|ServerRS5_X64|
|Windows Server RS5 ARM64 Edition|ServerRS5_ARM64|
|Windows 10 x86 RS4 Edition|10_RS4_X86|
|Windows 10 x64 RS4 Edition|10_RS4_X64|
|Windows 10 ARM64 RS4 Edition|10_RS4_ARM64|
|Windows 10 x86 RS3 Edition|10_RS3_X86|
|Windows 10 x64 RS3 Edition|10_RS3_X64|
|Windows 10 ARM64 RS3 Edition|10_RS3_ARM64|
|Windows 10 x86 RS2 Edition|10_RS2_X86|
|Windows 10 x64 RS2 Edition|10_RS2_X64|
|Windows 10 x86 RS1 Edition|10_AU_X86|
|Windows 10 x64 RS1 Edition|10_AU_X64|
|Windows Server 2016 x64 Edition|SERVER2016_X64|
|Windows 10 x86 Edition|10_X86|
|Windows 10 x64 Edition|10_X64|
|Windows Server 2016|Server10_X64|
|Windows Server 2016 on ARM|Server10_ARM64|
|Windows 8.1 x86 Edition|6_3_X86|
|Windows 8.1 x64 Edition|6_3_X64|
|Windows 8.1 ARM Edition|6_3_ARM|
|Windows Server 2012 R2|Server6_3_X64|
|Windows 8 x64 Edition|8_X64|
|Windows 8 x86 Edition|8_X86|
|Windows 8 ARM Edition|8_ARM|
|Windows Server 2012|Server8_X64|
|Windows Server 2008 R2 x64 Edition|Server2008R2_X64|
|Windows Server 2008 R2 Itanium Edition|Server2008R2_IA64|
|Windows 7 x64 Edition|7_X64|
|Windows 7 x86 Edition|7_X86|
|Windows Server 2008 x64 Edition|Server2008_X64|
|Windows Server 2008 Itanium Edition|Server2008_IA64|
|Windows Server 2008 x86 Edition|Server2008_X86|
|Windows Vista x64 Edition|Vista_X64|
|Windows Vista x86 Edition|Vista_X86|
|Windows XP x64 Edition|XP_X64|
|Windows XP x86 Edition|XP_X86|
|Windows Server 2003 x64 Edition|Server2003_X64|
|Windows Server 2003 Itanium Edition|Server2003_IA64|
|Windows Server 2003 x86 Edition|Server2003_X86|

Inf2Cat 忽略版本标识符字符串的字母字符的大小写。例如，vista_x64 和 Vista_X64 对于 Windows Vista x64 版本来说都是有效的标识符。

只有在驱动程序包的INF文件中指定了目录文件并且目录文件适用于一个或多个指定的Windows版本时，Inf2Cat才会生成目录文件。如果INF文件的`[INF Version section]`部分只提供一个目录文件=文件名.cat指令，则该目录文件将应用于整个驱动程序包。

## 应用示例
在以下示例中，c:\MyDriver 包含一个驱动程序包，该程序包的 INF 文件为 MyInfFile.inf 并且 INF 文件中的 INF 版本部分仅包含以下 CatalogFile 指令：
{% highlight ruby %}
[Version]
...
CatalogFile=MyCatalogFile.cat
...
{% endhighlight %}
对于该示例，以下 Inf2Cat 命令将验证是否可以针对 Windows 2000 和 x86 版本的 Windows Vista、Windows Server 2003 和 Windows XP 对驱动程序包进行签名。如果可以针对这些版本对程序包进行签名，那么 Inf2Cat 将创建未签名的目录文件 MyCatalogFile.cat。
{% highlight ruby %}
Inf2Cat /driver:C:\MyDriver /os:2000,XP_X86,Server2003_X86,Vista_X86
{% endhighlight %}

在以下示例中，c:\MyDriver 包含一个驱动程序包，该程序包的 INF 文件为 MyInfFile.inf，并且 INF 文件中的 INF Version 部分仅包含以下两个具有平台扩展的CatalogFile 指令：
{% highlight ruby %}
[Version]
...
CatalogFile.ntx86=MyCatalogFileX86.cat
CatalogFile.ntamd64=MyCatalogFileX64.cat
...
{% endhighlight %}
对于该示例，以下 Inf2Cat 命令将验证是否可以针对 Windows 2000 和 x86 版本的 Windows Vista、Windows Server 2003 和 Windows XP 对驱动程序包进行签名。此外，该命令还将验证是否可以针对 x64 版本的 Windows Vista、Windows Server 2003 和 Windows XP 对驱动程序包进行签名。如果可以针对所有这些版本对程序包进行签名，那么 Inf2Cat 将创建未签名的目录文件 MyCatalogFileX86.cat 和 MyCatalogFileX64.cat。

{% highlight ruby %}
Inf2Cat /driver:C:\MyDriver /os:2000,XP_X86,XP_X64,Server2003_X86,Server2003_X64,Vista_X86,Vista_X64
{% endhighlight %}
