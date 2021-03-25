---
layout: post
title:  "关于本博客模板使用上的一些问题"
date:   2019-02-23 12:21:47 +0800
categories: Pinned
Published: true
toc: true
sidebar: true
language: chinese
about: true
author: david.dong
description: 关于 rawpost 模板的介绍, 使用方法及 (Q & A)
keywords: rawposts/模板 
---
本博客使用了 [rawposts](https://github.com/gangdong/jekyll-theme-rawposts) 主题模板，不时有网友在 fork 使用该主题的时候提出了一些问题，这里我将该主题的使用方法汇总成一篇帖子，方便大家参考。

{% include toc.html %}

## <span id ="1">1.关于该主题</span>
`rawposts` 是一款轻量级,风格简洁清新的Jekyll主题。 该主题配置简单并支持丰富的特性,你可以将它用于Jekeyll网站或者个人博客的构建。该主题可以被用于部署在`Github page`上。

[作者]：[DavidDong](https://github.com/gangdong)       
[协议]：MIT 


### 预览
![screenshot]({{site.baseurl}}/assets/screenshot.png)

## <span id ="2">2.功能</span>
+ 响应式设计
+ 针对平板&手机屏幕设计优化
+ portfolio 主题图片设置
+ 个性化社交链接（支持电子邮件，Github，Facebook，Twitter，领英等）
+ 社交媒体分享 （Linkedin, Facebook, Twitter, Weixin...,180+）
+ 中英文双语支持
+ 分页功能
+ 归档
+ 文章分类
+ 摘要
+ 优化Github风格的代码样式
+ Rouge 语法高亮
+ 评论模块：Gittalk / Disqus    
  中国大陆用户推荐使用 Gittalk.
+ 阅读量统计：busuanzi
+ 站点统计：busuanzi / google analytics   
  中国大陆用户推荐使用 busuanzi analytics
+ RSS
+ Sitemap
+ jemoji emoji表情支持
+ 两种皮肤可切换：浅色/深色
+ 文章字数统计
+ 阅读时间统计

## <span id ="3">3.应用插件</span>
+ jekyll-seo-tag
+ jemoji
+ kramdown
+ jekyll-archives
+ jekyll-paginate
+ jekyll-toc
+ rouge

## <span id ="4">4.主题安装</span>
1. fork [主题](https://github.com/gangdong/jekyll-theme-rawposts) 到你的github仓库。
2. 复制该主题的仓库到本地。
3. 如果你还没有安装Jekell，请先安装Jekyll。如果你不知道如何安装Jekyll，可以参考 [Getting started with Jekyll (1)](https://gangdong.github.io/daviddong.github.io/web/2018/03/27/Web-jekyll-installation.html)。
4. 在本地项目的根目录下运行命令 `bundle install` 来安装主题以及该主题的依赖。
5. 运行 `bundle exec jekyll server` 构建项目并生成网站。
6. 至此安装完成! :v: 下一步你需要通过配置 _config.yml来定制你自己的网站。

## <span id ="5">5.客制化 & 配置</span>
你可以通过配置 _config.yml 文件来客制化该主题。

### <span id ="5.1">5.1 客制化设定</span>
你需要更改`描述`、`标题`和`url`以便与个人信息匹配。你还需要将/assets/目录中的`logo`、`默认社交链接`和`默认avatar图像`替换为您自己的图片，并需要将`电子邮件`更改为您要接收的联系人表单查询的电子邮件。
当前此主题的模板中的默认配置为我个人的信息，将该部分替换为你自己的信息。
#### `show_excerpts`
_config.yml中设置该字段为 `true` 将会启用目录的摘要功能。
#### `paginate`
_config.yml中通过设置该字段来设定每页最大的文章数量。
#### `paginate_path`
_config.yml中设置该字段为你需要放置子页的路径。
#### `sitemap`
_config.yml中设置该字段为 `true` 将生成 sitemap.html 文件。
#### `dark_mode`
_config.yml中设置该字段为 `true` 将会启用网站的深色模式切换功能。
#### `reading_time`
_config.yml中设置该字段为 `true` 将会增加文章的阅读时间和字数统计，并显示。
#### `archives`
_config.yml中设置该字段为 `true` 将会启用文章的时间归档功能。 
#### `categories`
_config.yml中设置该字段为 `true` 将会启用文章的归类功能。
#### `gittalk`
_config.yml中设置该字段为 `true` 将会增加gittalk评论模块。 
#### `show_statistics`
_config.yml中设置该字段为 `true` 将会启用网站访客统计功能，默认busuanzi引擎。
#### `rss`
_config.yml中设置该字段为 `true` 将会启用rss生成功能。 
#### `source_code` 
_config.yml中设置该字段为 `true` 将会增加源代码导引。

### <span id ="5.2">5.2 包含文件</span>
该主题有一些必要的 「.html」文件来实现网站的功能，它们位于不同的文件夹中。

#### `index.html`
index.html 是主页的入口文件，生成在项目根目录 `/blog` 文件夹中。

#### `archive.html`
archive.html 实现文章的归档功能，生成在根目录 `/archive` 文件夹中。

#### `category.html`
category.html 实现文章的分类功能，生成在根目录 `/category` 文件夹中。

#### `about.html`
about.html 文件内容对应网站的「关于」页面，里面的内容多为个人相关，将它们替换成你自己的信息，存在于根目录 `/about` 文件夹中。

#### `pagination.html`
pagination.html 实现网站的分页功能，存放在根目录 `_includes` 文件夹中。

#### `reading_time.html`
reading_time.html 统计文章的字数和阅读时间并显示. 存放在根目录 `_includes` 文件夹中。

#### `title.html`
生成主页的功能菜单项, 存放在根目录 `_includes` 文件夹中。

## <span id ="6">6.开发</span>
### <span id = "6.1">6.1 搭建开发环境</span>
以下用于配置该主题的开发环境:

1. 复制该主题的仓库到本地；
2. 进入到该主题项目的根目录并执行`bundle install`。

在你对该主题做了修改后可以在本地测试然后再推送到远端:

1. 进入到该主题本地的根目录 (比如 jekyll-theme-rawposts)；
2. 运行 `jekyll server` 构建该项目并生成网站，在浏览器中打开http://localhost:4000/你设定的baseurl 来预览网站。再度修改后可以通过刷新网页来预览效果。

### <span id = "6.2">6.2 Pull Requests</span>
当你需要提交一个 pull request时，可以：

1. 复制该项目；
2. 创建一个分支并对该分支起一个容易辨认的名字并填写好`问题`或者`需求描述`，`更改记录`；
3. 在Github上提交该分支到一个 pull request。

我平时的编程主要应用在移动端和嵌入式设备上面，偶尔写写前端，纯属个人爱好。因此该主题模板目前看写的还比较粗糙，需要持续改进。欢迎大家提 pull requests 给我, 对于每一个pull request, 我都会尽快review，对于好的建议我都会merge进该主题的代码中，包括但不限于提交问题或需求，修复代码等。

## <span id = "7">7.其他信息</span>
### <span id = "7.1">7.1 版本</span>
1.0.0

### <span id = "7.2">7.2 贡献</span>
主题起始于 [plainwhite](https://github.com/samarsault/plainwhite-jekyll) 模板，在此基础上做了大量的修改，添加了功能。

### <span id = "7.3">7.3 协议</span>
该主题为开源软件，基于`MIT`协议。

## <span id = "8">8.问题和回答 (Q&A)</span>
如果你有针对该主题的任何问题，欢迎在下面评论区留言，每个问题我都会认真回复。:smile: 