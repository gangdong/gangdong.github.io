---
layout: post
title:  "mbedtls 使用说明"
date:   2020-07-10 10:24:12 +0800
categories: Security
Published: true
toc: true
sidebar: true
language: chinese
---
最近的工作中使用到了mbedtls，这里做一个简单的总结。

{% if page.sidebar == false %}
<div class = "separator"></div>
## 目录

1. [什么是 mbedtls](#1)
    + [1.1 SSL](#1.1)
    + [1.2 mbedtls 特点](#1.2)
    + [1.3 mbedtls 模块](#1.3)
2. [mbedtls 安装与配置](#2)
    + [2.1 工具链支持](#2.1)
    + [2.2 GNU Make](#2.2)
    + [2.3 CMake](#2.3)
    + [2.4 Microsoft Visual Studio](#2.4)
3. [mbedtls 使用](#3)
    + [3.1 例子](#3.1)
    + [3.2 SSL/TLS 部分功能](#3.2)
    + [3.3 数据结构](#3.3)
    + [3.4 Init 阶段](#3.4)
    + [3.5 Connect 阶段](#3.5)
    
<div class = "separator"></div>
{% endif %}

## <span id="1">1. 什么是 mbedtls</span>
mbedtls 一句话来概况的话就是它是一个开源的SSL/TLS库。   
[--项目源码地址](https://github.com/ARMmbed/mbedtls#readme-for-mbed-tls)   
[--项目API文档](https://tls.mbed.org/api/)


### <span id="1.1">1.1 SSL</span>
关于SSL(Secure Sockets Layer 安全套接字协议)，百度百科的解释如下
> SSL协议位于TCP/IP协议与各种应用层协议之间，为数据通讯提供安全支持。SSL协议可分为两层： 
> + SSL记录协议（SSL Record Protocol）：它建立在可靠的传输协议（如TCP）之上，为高层协议提供数据封装、压缩、加密等基本功能的支持。 
> + SSL握手协议（SSL Handshake Protocol）：它建立在SSL记录协议之上，用于在实际的数据传输开始前，通讯双方进行身份认证、协商加密算法、交换加密密钥等。
> 
> TLS与SSL在传输层与应用层之间对网络连接进行加密。

### <span id="1.2">1.2 mbedtls 特点</span>
mbedtls 有以下的特点：
+ 简洁的API
+ 开源代码库
+ 功能模块化，松耦合。
+ 模块可单独配置，编译
+ C 语言编写，针对嵌入式应用

从功能角度来看，mbedtls可以分为三个主要部分： 

- SSL/TLS 协议库（`libmbedtls.a`）
- 加密库（`libmbedcrypto.a`）
- X.509 证书处理库（`libmbedx509.a`）

**注意：这三个库在生成的时候的依赖关系，libmbedtls.a 依赖 libmbedx509.a 而 libmbedx509.a 依赖 libmbedcrypto.a。** 因此在生成时要注意顺序问题。

### <span id="1.3">1.3 mbedtls 模块</span>
mbedtls库包含以下的模块。

|模块|说明|
|---|---|
|Encryption/decryption module|加解密模块|
|Hashing module|The Message Digest (MD)提供了hash 功能|
|Random number generator (RNG) module|提供了随机数产生功能，see [mbedtls_ctr_drbg_random()](https://tls.mbed.org/api/ctr__drbg_8h.html#af6e4dd295ae790a33128562dd01c79ab)|
|SSL/TLS communication module|提供了方式建立SSL/TLS通讯通道|
|TCP/IP communication module|provides for a channel of communication for the SSL/TLS communication module to use|
|X.509 module|提供了X.509的支持，用于证书的读写和认证|
|Asn1_module||    


## <span id="2">2. mbedtls 安装与配置</span>
mbedtls支持3种 build 方式，
+ GNU Make
+ CMake
+ Microsoft Visual Studio (Microsoft Visual Studio 2013 or later)

### <span id="2.1">2.1 工具链支持</span>
+ GNU Make 或者 CMake build 工具.
+ C99 工具链 (compiler, linker, achiever). 目前支持 `GCC5.4`, `Clang 3.8`, `IAR8` 和 `Visual Studio 2013` 以后的版本. 
+ Python 3 用于产生测试代码.
+ Perl 用于运行测试.

### <span id="2.2">2.2 GNU Make</span>
run build    
{% highlight ruby %}
make
{% endhighlight %}
build with test   
{% highlight ruby %}
make check
{% endhighlight %}
build without test    
{% highlight ruby %}
make no_test
{% endhighlight %}
### <span id="2.3">2.3 CMake</span>
run build   
{% highlight ruby %}
mkdir /path/to/build_dir && cd /path/to/build_dir
cmake /path/to/mbedtls_source
cmake --build .
{% endhighlight %}
run test   
{% highlight ruby %}
ctest
{% endhighlight %}
build without test
{% highlight ruby %}
cmake -DENABLE_TESTING=Off /path/to/mbedtls_source
{% endhighlight %}
make shared library   
{% highlight ruby %}
cmake -DUSE_SHARED_MBEDTLS_LIBRARY=On /path/to/mbedtls_source
{% endhighlight %}
### <span id="2.4">2.4 Microsoft Visual Studio</span>
工程文件`mbedTLS.sln` 包含了所有必需的项目和程序. 编译该工程文件可以生成库文件。

关于更多的相关信息，可以参阅 [GitHub README for Mbed TLS](https://github.com/ARMmbed/mbedtls#readme-for-mbed-tls)。

## <span id="3">3. mbedtls 使用</span>

mbedtls通过提供以下功能支持`SSLv3`到`TLSv1.2`版本的通信：
+ TCP/IP通信功能：监听、连接、接受、读/写
+ SSL/TLS通信功能：初始化、握手、读/写
+ X.509功能：CRT、CRL和按键处理
+ 随机数生成
+ 散列
+ 加密/解密

上面的功能被整齐地设计成逻辑接口。它们可以单独用于提供上述任何功能，或者混合和匹配到使用X.509 PKI的SSL服务器/客户端解决方案中。

### <span id="3.1">3.1 例子</span>
服务器端的设定:   
**先决条件**
+ X.509证书和私钥
+ 会话处理函数
**设定步骤**
+ 加载证书和私钥（X.509接口）
+ 设置侦听TCP套接字（TCP/IP接口）
+ 接受传入客户端连接（TCP/IP接口）
+ 初始化为SSL服务器（SSL/TLS接口）
+ 设置参数，例如身份验证、密码、CA链、密钥交换
+ 设置回调函数RNG、IO、会话处理
+ 执行SSL握手（SSL/TLS接口）
+ 读/写数据（SSL/TLS接口）
+ 关闭和清理（所有接口）

客户端的设定:   
**先决条件**
+ X.509证书和私钥
+ X.509可信CA证书
**设定步骤**
+ 加载受信任的CA证书（X.509接口）
+ 加载证书和私钥（X.509接口）
+ 设置TCP/IP连接（TCP/IP接口）
+ 初始化为SSL客户端（SSL/TLS接口）
+ 设置参数，例如身份验证模式、密码、CA链、会话
+ 设置回调函数RNG，IO
+ 执行SSL握手（SSL/TLS接口）
+ 验证服务器证书（SSL/TLS接口）
+ 写入/读取数据（SSL/TLS接口）
+ 关闭和清理（所有接口）

### <span id="3.2">3.2 SSL/TLS 部分功能</span>
mbed tls的ssl/tls部分提供了使用ssl/tls通过安全通信通道建立和通信方法。

其基本规定是:   
+ 初始化一个SSL/TLS context
+ 执行一个SSL/TLS握手(handshake)
+ 发送/接收数据
+ 通知对方一个连接正在关闭

一个通道很多方面都是通过参数和回调函数来设置的 >>>    
+ 端点角色(endpoint role),客户端和服务器
+ 身份验证模式: 是否应该进行证书验证
+ 主机到主机通信通道: 发送和接收功能
+ 随机数生成器(RNG)功能
+ 用于加密/解密的密码
+ 证书验证功能
+ 会话控制: 会话获取和设置功能
+ 证书处理和密钥交换的X.509参数

mbed 通过创建一个SSL/TLS服务器和客户端,通过提供一个框架来建立和通过SSL/TLS通信通道进行通信.SSL/TLS部分直接依赖于库的证书解析,对称和非对称和哈希模块.

### <span id="3.3">3.3 数据结构</span>
{% highlight console %}
mbedtls_net_context：目前只有文件描述符，可以用于适配异步I/O库
mbedtls_ssl_context：保存SSL基本数据
mbedtls_ssl_config: SSL 配置数据
mbedtls_ctr_drbg_context
mbedtls_entropy_context：保存熵配置
mbedtls_x509_crt：保存认证信息
{% endhighlight %}
### <span id="3.4">3.4 Init 阶段</span>
下面时init阶段需要调用的函数与传统 socket 的对比。传统的socket-based的程序，依照顺序，作为client要做以下的函数调用：   
{% highlight ruby %}
gethostbyname()
socket()
connect()
write()
read()
{% endhighlight %}
改成SSL之后，mbedTLS对应上述函数，分别对应为：   
{% highlight ruby %}
gethostbyname()   \ 
socket()          -+--> mbedtls_net_connect() + mbedtls_ssl_handshake()
connect()         /
write()           ----> mbedtls_ssl_write()
read()            ----> mbedtls_ssl_read()
{% endhighlight %}
当然，实际情况下，会使用更多的其他函数。

下面是init阶段需要调用的各函数。函数的参数，在调用的时候按照上面的函数类型一个一个传入就行了。
{% highlight ruby %}
mbedtls_net_init()
mbedtld_ssl_init()
mbedtld_ssl_config_init()
mbedtls_ctr_drbg_init()
mbedtld_x509_crt_init()
mbedtls_entropy_init()
mebdtls_ctr_drbg_seed()
{% endhighlight %}
其中[mebdtls_ctr_drbg_seed()](https://tls.mbed.org/api/ctr__drbg_8h.html#af6e4dd295ae790a33128562dd01c79ab)可以指定熵函数。如果回调使用默认的mbedtls_entropy_func的话，可以传入一个初始的熵seed，也可以NULL。

### <span id="3.5">3.5 Connect 阶段</span>
[mbedtls_net_connect()](https://tls.mbed.org/api/ctr__drbg_8h.html#af6e4dd295ae790a33128562dd01c79ab)：参数是server和端口，均为字符串。server可以使域名或者IP字符串。最后一个参数使用`MBEDTLS_NET_PROTO_TCP`即可。端口号不仅仅可以传入数字字符串，也可以类似于get_addrinfo函数的protocol参数那样，传入类似于`HTTPS`这样的可读化字符串。
