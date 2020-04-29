---
layout: post
title:  "Install python 3.6 on ubuntu 16.04"
date:   2019-01-23 23:07:49 +0800
categories: Python
published: true
---
Today I spent hours in installing the python3.6 on my ubuntu16.04.
Here is a short note for the whole process, which might be useful for anyone who want to do the same thing.

The first thing before you start to install the python3.6, you need to know which version of python is running on your system. On ubuntu16.04 you can use below command to check your python version.
```shell
ls /usr/local/lib/
```
before the installation, I have python2.7 and python3.5 on my ubuntu system. They are actually default installed by ubuntu16.04 build.
```
david@david-VirtualBox:/$ ls /usr/local/lib/
python2.7  python3.5  
david@david-VirtualBox:/$ 
```
then input 
```
python --version
```
to check which version python is your default python application. If you want to switch to python3.5, input below command
```
echo alias python=python3 >> ~/.bashrc
source ~/.bashrc
python --version
```
But python3.5 is still not the right one, what I need to python3.6. To install python3.6, there are usually two ways. one is using apt-get install. The command is as below.
```
sudo add-apt-repository ppa:jonathonf/python-3.6
sudo apt-get update
sudo apt-get install python3.6
```
but it doesn't work on my installation for PPA has been removed. so I turned to the second way to download the source code and compile install.
The command as below.
```
wget https://www.python.org/ftp/python/3.6.0/Python-3.6.0.tar.xz
xz -d Python-3.6.0.tar.xz
tar -xvf  Python-3.6.0.tar
cd Python-3.6.0
./configure
make
sudo make install
```
Waiting for the installation complete. Then check the python version, if you see the "Python 3.6.x", python3.6 has been installed successfully on your ubuntu16.04.
```
david@david-VirtualBox:~$ python --version
Python 3.6.0
```
If you don't see the Python3.6.0, instead, you see Python3.5.0, which means your system's default python APP is python3.5. You need to use "update-alternatives --config python" command to switch it to python3.6. 




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
   id: 'python/2019/01/23/Python-python3.6-installation-ubuntu.html',
   title: 'comments'
    });
   gitalk.render('gitalk-container');
</script>
<!-- Gitalk end -->

<br><br><br>

<font size="2" color="#aaa">作者：David Dong<br></font>
<font size="2" color="#aaa">来源：https://gangdong.github.io/daviddong.github.io/python/2019/01/23/Python-python3.6-installation-ubuntu.html</font>
<font size="2" color="#aaa">转载请注明出处。</font>
<span id="busuanzi_container_page_pv" ></span><font size="2" color="#aaa">
本文总阅读量</font><font size="2" color="#aaa"><span id="busuanzi_value_page_pv"></font></span><font size="2" color="#aaa">次</font>