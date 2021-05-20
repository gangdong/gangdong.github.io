---
layout: post
title:  "RawPosts - A theme for Jekyll"
date:   2019-02-23 12:21:47 +0800
categories: Pinned
tags: Pinned
Published: true
toc: true
sidebar: true
about: true
author: david.dong
description: About RawPosts theme.
keywords: RawPosts/Jekyll Theme 
---
[RawPosts](https://github.com/gangdong/jekyll-theme-rawposts/) is a simple, elegant, and clean [Jekyll](https://jekyllrb.com/) theme. It is born from the creation of my blog website. It is designed with a fully responsive feature and can be deployed on Github Pages. I open-sourced this theme on Github with an MIT license, so it is free for use.

After a while using [WordPress](https://wordpress.com/), I just realized that it was so much bloated. So, I decided to work on my layout, and then, RawPosts was born. It is two columns layout with portfolio-style, I tried to make this theme with minimal size and easy to customize. It is suitable for creating blog website or is built as a foundation for building more meaningful themes.

The latest release is [v2.1](https://github.com/gangdong/jekyll-theme-rawposts/releases), I will keep developing this theme. I've pinned this post, if any update is available I will update it here.


## Preview
![screenshot](https://cdn.jsdelivr.net/gh/gangdong/gangdong.github.io@dev/assets/screenshot.png){: .center-image }

## Features List
+ Fully responsive, optimized for tablets & mobiles
+ Portfolio style
+ Sidebar for auto TOC
+ Customized social link (Github,facebook,twitter,linkedin...)
+ Social Media sharing for posts
+ Chinese/English support
+ Rouge syntax highlighter
+ Pagination
+ Search for all site keywords 
+ Archive by date/category
+ Post Excerpts
+ Related Posts 
+ CI support: Travis CI / Github Actions
+ Comments: Gittalk / Disqus
+ Statistics: Google analytics / busuanzi 
+ SEO optimization
+ jemoji for emoji
+ Light/Dark mode selectable
+ Reading time statistics
+ post words count statistics

## Plugins
+ jekyll-seo-tag
+ jemoji
+ kramdown
+ jekyll-archives
+ jekyll-paginate
+ jekyll-toc
+ rouge
+ jekyll-tagging-related_posts

## Installation
1. Fork the theme at [here](https://github.com/gangdong/jekyll-theme-rawposts).
2. If you don't have Jekyll installed, install it on your local machine. If you don't know how to install, please refer to [Getting started with Jekyll (1)](https://gangdong.github.io/daviddong.github.io/web/2018/03/27/Web-jekyll-installation.html).
3. Run the command `bundle install` in the root of the theme's folder to install the theme and its dependencies.
4. Run `bundle exec jekyll server` to build and serve your site.
5. The theme is installed successfully here, next you can customize your own website through the `_config.yml`

## Customization & Configuration
You can use the `_config.yml` file to configure the theme with your preferences.

+ `site personal settings:`
You'll need to change the `description`, `title` and `url` to match with your personal information. You'll also need to replace the `logo`, default `social link` and default offline `images` in the `/assets/` directory with your owns.The email needs to be changed to the email you want to receive contact form enquirers with. 
The default configuration of this theme is my personal information and just replace with yours.
+ `show_excerpts:`
set to *true* to show excerpts on the homepage.
+ `paginate:`
set the number of posts of each pages.
+ `paginate_path:`
set the path of pages in your site.
+ `sitemap:`
set to *true* to generate sitemap.xml content.
+ `dark_mode:`
set to *true* to add dark mode toggle.
+ `reading_time:`
set to *true* to add reading time statistics.
+ `archives:`
set to *true* to generate archives page. 
+ `categories:`
set to *true* to generate categories page.
+ `gittalk:`
set to *true* to add gittalk. 
+ `show_statistics:`
set to *true* to show statistics of site visitors number.
+ `rss:`
set to *true* to add rss.
+ `source_code:` 
set to *true* to add link to source code.

## Include Files
There are some necessary `.html` files for utilizing the site's features and they are in different folders.

+ `index.html:`
index.html is the entry of homepage and is in the `/blog` folder.
+ `archive.html:`
archive.html is for the archives function and is in the `/archive` folder.
+ `category.html:`
category.html is used for category of the posts and is in the `/category` folder.
+ `about.html:`
For *about* page contents display and is in the `/about` folder.
+ `pagination.html:`
For paginate the pages and is in the `_includes` folder.
+ `reading_time.html:`
reading_time.html is used for statistic the reading time of posts and display. It is in `_includes` folder.
+ `menu.html:`
Used for setting the menu bar of the homepage, is in the `_includes` folder.

## Development
To set up your environment to develop this theme:

1. Clone this repo
2. cd into the root directory of your repo and run `bundle install`.

To test the theme locally as you make changes to it:

1. cd into the root directory of the repo (e.g. jekyll-theme-rawposts).
2. Run `jekyll server` to preview and open your browser to `http://localhost:4000/your_baserul/`.

This starts a Jekyll server using the theme's files and contents of the / directory. As modifications are made, refresh your browser to see any changes.

## Pull Requests
When submitting a pull request:

1. Clone the repo.
2. Create a branch off of master and give it a meaningful name (e.g. my-awesome-new-feature) and describe the feature or fix.
3. Open a pull request on GitHub.

Welcome to submitting pull requests to me, for each request, I will review as soon as possible and merge any good submits.

## Version
2.1.0

## Q & A
Welcome raise issues if you have any questions about this theme, not limited for any usage, bug fix, new features requirements... :smile:   

## License
The theme is available as open source under the terms of the `MIT` License. 
<br><br>
[中文 ->](https://dqdongg.com/blog/web/github/2019/02/22/Blog-Template.html)