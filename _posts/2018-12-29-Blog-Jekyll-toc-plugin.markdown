---
layout: post
title:  "Use jekyll-toc plugin on Github Pages"
date:   2018-12-29 21:11:16 +0800
categories: Blog Github
tags: Blog Github
Published: true
toc: true
sidebar: true
about: true
author: david.dong
description: This article introduced how to use jekyll-toc plugin on Github Pages.
keywords: jekyll-toc/Github Pages
---
Today I want to add an auto TOC (*Table of Contents*) function to my blog. I used to write TOC manually and it is really boring. I found a good plugin [jekyll-toc](https://Github.com/toshimaru/jekyll-toc) in Github, which can fully meet my requirement. 

{% include toc.html %}

## Start

The installation is simple, I forked and installed the plugin successfully in 5 minutes. 

After then, I was going to separate the TOC and post contents. I designed a sidebar to show the TOC independently by placing the `{% raw %}{% toc %}{% endraw %}` tag into the sidebar.

{% highlight html %}
{% raw %}
<!-- put sidebar! -->
<div class="post-index-container">
	{% if page.language == 'chinese' %}
		<li class = "post-index">文章目录</li>
	{% else %}
		<li class = "post-index">On this page</li>
	{% endif %}
		<li>{% toc %}</li>
</div>
{% endraw %}
{% endhighlight %}


I built the code locally by Jekyll and reloaded the page. 

Cheers! 

The TOC appeared, this was exactly what I want!

## I got a trouble

Things are going well so far, it is so easy?

No, I got into trouble when I committed the change to the Github repository. The site was built failed by the Github Pages Generator. 

{% highlight shell %}
The tag `toc` on line 32 in `/_layouts/post.html` is not a recognized Liquid tag.
{% endhighlight %}

I realized immediately that this plugin wasn't in the [whitelist](https://pages.Github.com/versions/) of Github Pages. I forgot that!

![notification]({{site.cdn_baseurl}}/assets/image/blog-jekyll-toc-01.PNG){: .center-image }

I have to use a trick way to skip the restriction. As the above bulletin showed, I need to build the site locally and push the generated static files to my Github repository.

<div class = "post-note warning"> 
	<div class = "header"></div>
	<div class = "body">
	<p>Don't use Github Pages Generator build.</p>
	</div>
</div>


## Use Master branch

Followed the above information I checked the root path of my blog project in Github, it was `master` branch. 

So I added the site file `_site/` to the master branch and pushed it to the origin repository. 

I referred to two articles[^1] here.

[^1]:[https://mccxj.Github.io/blog/20130127_jekyll-plugin-with-git-branch.html]() [https://www.cnblogs.com/ihardcoder/p/4479356.html]()

{% highlight shell %}
git add _site/*
git commit -m "add static site file"
git push origin master
{% endhighlight %}

**However, it didn't work!** 

## Use gh-pages branch

There should be something wrong with the above procedure.

I went back to google to search for another solution. 

Thanks to these two articles[^2]. 

[^2]:[https://www.it1352.com/798173.html](https://www.it1352.com/798173.html) [https://www.cnblogs.com/pengshuo/p/5368035.html](https://www.it1352.com/798173.html), 

I made it clear when I build the website by Github Pages Generator, it actually creates a new branch `gh-pages` under master branch, where it stores the static site files for access. Therefore I need to create the `gh-pages` branch and place the generated static HTML there.

I changed the command as below.

{% highlight shell %}
cp -r _site /tmp/
git checkout -b gh-pages
rm -rf *
cp -r /tmp/_site/* ./
git add -A
git commit -m "add site files"
git push origin gh-pages
{% endhighlight %}

![master-root]({{site.cdn_baseurl}}/assets/image/blog-jekyll-toc-02.PNG)

**It worked this time!** 

![toc@sidebar]({{site.cdn_baseurl}}/assets/image/blog-jekyll-toc-04.PNG)

## Conclusion

If you want to deploy your website on Github Pages with the unsupported plugins, you will need to build your site locally and create `gh-pages` branch and upload your site file to this branch. One important point is that you should use the branch as the `root`, which means placing the site file into the directory directly instead of a sub-directory.

![master-root]({{site.cdn_baseurl}}/assets/image/blog-jekyll-toc-03.PNG)