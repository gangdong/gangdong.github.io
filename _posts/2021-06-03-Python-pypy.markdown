---
layout: post
title:  "Use Pypy to make Python run faster"
date:   2021-06-03 07:04:44 +0800
categories: Python
tags: Python
Published: true
excerpt_separator: <!--more-->
toc: true
sidebar: true
about: true
author: david.dong
description: This article introduced Pypy. 
keywords: Python/Pypy
---
*"If you want your code to run faster, you should use Pypy."* - Guido van Rossum, the father of Python.<br>
To understand why Pypy is faster, we should know what makes Python slower.<!--more-->

## What does make Python slower? 
Python is a dynamic programming language, as we all know, unlike the static programming language *(C/C++/Rust...) - which are usually compiled ahead of time (AOT compilation)*, the dynamic programming language uses the interpreter to translate the source code line by line and runs it when executing. Therefore, The performance of the program interpreter determines the execution speed of Python.

<div class = "post-note info">
  <div class = "header"></div>
  	<div class = "body">
		<p>For static programming language, the compiler will convert the source code into machine code readable by a specific computer architecture. In other words, when executing the program, the execution is not the source code, but the machine code.<br>

		Because of the lack of translation process, the static programming language is usually faster than a dynamic programming language.
		</p>
  	</div>
</div>

Here are some common Python interpreters:

|Interpreter|Description|
|---|---|
|CPython |interpreter implemented by C language|
|Jython |interpreter implemented by Java language|
|IronPython |interpreter implemented by .Net|
|Pypy|interpreter implemented by RPython - a subset of Python|

## What is Pypy?
We can think Pypy is a Python interpreter implemented in Python. Pypy is a very compatible Python interpreter, which is an alternative to CPython 2.7, 3.6, and the upcoming 3.7. It can significantly increase the speed when running an application with it.

> Historically, Pypy has been used to mean two things. The first is the RPython translation toolchain for generating interpreters for dynamic programming languages. And the second is one particular implementation of Python produced with it. Because RPython uses the same syntax as Python, this generated version became known as Python interpreter written in Python. It is designed to be flexible and easy to experiment with.

Above is the introduction of the Pypy in the [Pypy Documents website](https://doc.Pypy.org/en/latest/introduction.html), this website presents a lot of technical details of the Pypy. 

## Why is Pypy faster?
The secret that the Pypy runs fast is that it uses JIT (Just-In-Time) compilation. JIT compilation is a combination of interpretation and pre-compilation. It can improve performance by using pre-compiling and improve the flexibility and cross-platform availability of interpretative language. That's why Pypy can make Python perform so fast.

Here are the steps JIT compilation takes to provide faster performance:
1. Identify the most common components in code, such as functions in loops.
2. The runtime converts these components into machine code.
3. Optimize the generated machine code.
4. Replace the previous implementation with an optimized machine code version.

However, JIT isn't all-powerful for everything. There are some limitations when using JIT.

+ It doesn't work with C extensions, Pypy is best for pure Python applications. Whenever using the C extension module, it runs much slower than in CPython. The reason is that Pypy cannot optimize C extension modules because they are not fully supported. In this case, the Pypy team recommends removing the CPython extension and replacing it with a pure Python version. If not, CPython must be used.
+ It only works for long-running programs.
+ It does not perform precompilation. Pypy is not a fully compiled Python implementation. It compiles Python code, but it's not a compiler for Python code. Python cannot be compiled into a separate binary and reused because of some inherent features of Python. 

## Use Pypy
The Pypy needs to be installed before using it. 

The [http://Pypy.org/](http://Pypy.org/) offered the installation ZIPs for running on the different platforms. It can be downloaded and installed.

To install Pypy under Ubuntu, another method is using the command line. 

{% highlight shell %}
sudo add-apt-repository ppa:Pypy/ppa
sudo apt-get update
sudo apt-get install Pypy Pypy-dev
{% endhighlight %}
If the installation is successful, open the terminal and enter Pypy, there will be the following similar prompts.
![installation]({{site.cdn_baseurl}}/assets/image/python-pypy-01.PNG){: .center-image }

## Performance  
To check the performance, I did an experiment, I wrote the below code and ran it with Pypy and CPython. 

{% highlight python %}
import time
t = time.time()
for i in range(10**8):
    continue
print (time.time() - t)
{% endhighlight %}

when using Pypy to run the code.
{% highlight python %}
david@david-VirtualBox:~/Study/python$ Pypy test.py
0.148446083069
{% endhighlight %}

when using CPython to run the code.
{% highlight python %}
david@david-VirtualBox:~/Study/python$ python3 test.py
19.179446935653687
{% endhighlight %}

The Pypy really made the python run faster!