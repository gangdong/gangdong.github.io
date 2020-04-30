---
layout: post
title:  Getting started with Jekyll(1)
date:   2019-03-27 20:56:30 +0800
categories: Web
published: true
---
In my last article, I have introduced how to create a blog based on Github pages, open it [here](https://gangdong.github.io/daviddong.github.io/web/github/2019/03/23/Others-how-to-build-blog-on-github-en.html) if you haven't read it.<br>
Following this page will give a brief introduction about Jekyll and its installation.

### Jekyll
Jekyll is a simple and free blog generation tool, similar to WordPress. But it's very different from WordPress because Jekyll is just a tool for generating static web pages and does not need database support. But it can work with third-party services, such as Disqus. The key is that Jekyll can be deployed on GitHub free of charge and can bind its own domain name.

As a static site generator, Jekyll provides many advantages, for example, a website constructed by Jekyll will get a faster page speed over a dynamic, database driven site.

Jekyll also offers a way of storing data in a more human readable format, such as yaml or JSON. This means you can store data that is used in multiple places across your site in one file and reference it in many places.

Others are Jekyll gives the developer more freedom to design and build the site. It is freely to write your own html and text onto the page in the format you want it.

Let's turn to how to build the website by Jekyll, I suggests you construct your website on Github pages because Jekyll is well deployed on Github and there are many Jekyll theme templates for you powering your website. More important is all of these are totally free of charge. If you like, you can even bind your domain on it. you can view my previous blog for how to create blog on Gitgub pages. [blog](https://gangdong.github.io/daviddong.github.io/web/github/2019/03/23/Others-how-to-build-blog-on-github-en.html)
### Installation
The first step is installing the Jekyll tools on your PC, here I just introduce the installation on windows platform.

1. download Ruby at [here](https://rubyinstaller.org/) and install. You can skip it if you have already had.
2. download RubyGems at [here](https://rubygems.org/pages/download). Again, skip this step if you have done.
3. unzip the RubyGems folder and enter the directory. Execute below command.
```
ruby setup.rb
``` 
4. execute command install Jekyll.
```
gem install jekyll
```
After the installation, check it by creating a Jekyll template.
```
cd d:
d:
jekyll new testblog
cd testblog
jekyll server
```
if you see below output message, the Jekyll is working on your PC now.
```
  Generating...
                    done in 1.684 seconds.
  Please add the following to your Gemfile to avoid polling for changes:
    gem 'wdm', '>= 0.1.0' if Gem.win_platform?
 Auto-regeneration: enabled for 'D:/Study/backup/daviddong.github.io'
    Server address: http://127.0.0.1:4000
  Server running... press ctrl-c to stop.
```
So far you can input http://127.0.0.1:4000/ in the browser to browse the blog you just created.
### Jekyll theme
Jekyll provides a lot of beautiful theme templates, you can easy use them to power your website.<br> 
you can view the demo and download the source code to use it on your own website.

Now go and choose one you like [Jekyll theme](http://jekyllthemes.org/).

Next article, I will introduce the Jekyll grammar.
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
   id: 'web/2019/03/27/Web-jekyll-installation.html',
   title: 'comments'
    });
   gitalk.render('gitalk-container');
</script>
<!-- Gitalk end -->

<br><br><br>

<font size="2" color="#aaa">作者：David Dong<br></font>
<font size="2" color="#aaa">来源：https://gangdong.github.io/daviddong.github.io/web/2019/03/27/Web-jekyll-installation.html</font>
<font size="2" color="#aaa">转载请注明出处。</font>
<span id="busuanzi_container_page_pv" ></span><font size="2" color="#aaa">
本文总阅读量</font><font size="2" color="#aaa"><span id="busuanzi_value_page_pv"></font></span><font size="2" color="#aaa">次</font>
