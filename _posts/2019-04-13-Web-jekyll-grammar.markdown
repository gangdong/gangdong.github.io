---
layout: post
title:  Getting started with Jekyll (2)
date:   2019-04-13 23:21:15 +0800
categories: Web
published: false
---
After read [last article](https://gangdong.github.io/daviddong.github.io/web/2019/03/27/Web-jekyll-installation.html) you should complete the installation of Jekyll and download a Jekyll theme on your computer. 

Let's start this article from the source code of the theme you downloaded. 

### Jekyll directory structure
Unzip the package you downloaded and check the directory structure.The Jekyll directory structure mainly includes the following directories.


```
_posts blog contents
_pages 其他需要生成的网页，如About页
_layouts 网页排版模板
_includes 被模板包含的HTML片段，可在_config.yml中修改位置
assets 辅助资源 css布局 js脚本 图片等
_data 动态数据
_sites 最终生成的静态网页
_config.yml 网站的一些配置信息
index.html 网站的入口


作者：leach_chen
链接：https://www.jianshu.com/p/9f71e260925d
来源：简书
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
```




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
