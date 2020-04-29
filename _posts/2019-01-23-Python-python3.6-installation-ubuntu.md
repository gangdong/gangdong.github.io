---
layout: post
title:  "Install python 3.6 on ubuntu 16.04"
date:   2019-01-23 23:07:49 +0800
categories: Python
published: true
---
Today I spent some time installing the python3.6 on my ubuntu16.04.
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
Like this.
```
sudo update-alternatives --list python
sudo update-alternatives --config python
```
If you find below message, represents the alternatives cannot recognize python and you will need to install python into your alternatives list firstly.
```
update-alternatives：error：no alternatives for python
```
install your python as below command.
```
sudo update-alternatives --install /usr/bin/python python /home/david/Python-3.6.0 3
sudo update-alternatives --install /usr/bin/python python /usr/bin/python3.5 2
sudo update-alternatives --install /usr/bin/python python /usr/bin/python2.7 1 
```
The last character of above each command sets the priority of your python version on the system. The big the higer priority. 
After installment, check again. you will see all your python on your system are in the alternatives.
```
david@david-VirtualBox:~$ sudo update-alternatives --list python
/home/david/Python-3.6.0
/usr/bin/python2.7
/usr/bin/python3.5
```
Then switch to root user and execute the last command to choose which python you are going to set as default.
```
sudo su
update-alternatives --config python
```
you will see below menu and select the one you want.
```
有 3 个候选项可用于替换 python (提供 /usr/bin/python)。

  选择       路径                    优先级  状态
------------------------------------------------------------
* 0            /home/david/Python-3.6.0   3         自动模式
  1            /home/david/Python-3.6.0   3         手动模式
  2            /usr/bin/python2.7         1         手动模式
  3            /usr/bin/python3.5         2         手动模式

要维持当前值[*]请按<回车键>，或者键入选择的编号：
```
We have done all the job for now. Hope this short article is able to give you some help if you have the same requirement as me. 
If you have any question, please ask at below comment box.
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