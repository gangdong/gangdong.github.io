---
layout: post
title:  "How to build your personal blog on Github Pages"
date:   2018-03-23 21:03:36 +0800
categories: Blog Github
tags: Blog Github
Published: true
toc: true
sidebar: true
about: true
author: david.dong
description: Do you want to build your blog on Github Pages? <br><br>Take a look at this article if you want, hope it can help you!
keywords: Github Pages/blog
---
I have constructed my blog by Jekyll on Github Pages, I thought I should write an article to introduce how to make your own blog website by Jekyll on Github Pages.<br>

I would separate the contents into short blogs, reading long article is always easy to make people feel weary. 😴<br>

This article will introduce how to create your blog based on Github Pages. Next article I will introduce Jekyll and how to use it to enrich your blog.<br>

## Why is Github Pages?

As an open-source code platform and worldwide developer community, Github has more than millions of users now. As one of them, I have much time spent on Github and Github also provides the personal homepage service (*Github Pages*). It is possible to build your blog on it. To me, it is a good idea to move my blog to Github Pages with the benefit of saving lots of time on the maintenance of the blogs on different websites. That's why I'd like to do this thing. 

## How to do?

The way of hosting your website on Github Pages is static access, but it can fully meet my needs. So here comes the question, how do we build blog on Github Pages? Fortunately, the procedure is simple, just need to create a new repository and upload your website code onto it. After then you can access it at any time and anywhere.

<div class = "post-note info">
  <div class = "header"></div>
  <div class = "body">
  <p>To learn how to build your website on Github, a quick way is to refer to the official help document.
	<ul >
	  <li><a href = "https://pages.Github.com">Github Pages</a></li>
	</ul>
  </p>
  </div>
</div>

Here is a short summary:<br>
1. apply for a Github account, you can skip this step if you already have.<br>
2. create a new repository as below. <br>
![create]({{site.cdn_baseurl}}/assets/image/others-blog-create-repository.png){: .center-image }
fill the name of repository，please note the name must be your website's `URL` and ending with `Github.io`!
![create2]({{site.cdn_baseurl}}/assets/image/others-blog-create-repository2.png){: .center-image }
3. click create repository button，the repository will be created.<br>
4. open the settings page of your new repository, find your website URL, and record it. Input your website URL into the web browser and then you will see your website's homepage. It is an empty page at the beginning. To add content, you need to create an `index.html` file in your repository directory. Write what you want into it and submit the modification, you will see the contents you added.<br>
![create3]({{site.cdn_baseurl}}/assets/image/others-blog-create-repository4.png){: .center-image }

For now, all work is done! you've got your website with some simple elements. If you want to enrich your website, You need to do some extra works. A fast way is to use the Github Pages theme. Github Pages provides many beautiful theme templates. You can use them directly to create your own. The theme templates on Github are mostly built based on `Jekyll`, so it is necessary to understand Jekyll. However, the introduction of Jekyll is not discussed in this paper. I'll write another article for the introduction of Jekyll.<br>

See you soon. 🙂 <br>