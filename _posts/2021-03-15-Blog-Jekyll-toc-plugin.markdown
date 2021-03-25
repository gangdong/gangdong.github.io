---
layout: post
title:  "Use jekyll-toc plugin on Github Pages"
date:   2021-03-14 21:11:16 +0800
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
Today I want to add a auto TOC function to my blog. I used to write TOC manually and it is really boring. I found a good plugin [jekyll-toc](https://Github.com/toshimaru/jekyll-toc) in the Github, which can fully meet my requirement. 

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

The TOC appeared, this was just what I want!

## I got a trouble

Things are going really well so far, it is so easy?

No, I got a trouble when I committed the change to Github repository. The site was built failed by Github Pages generator. 

{% highlight shell %}
The tag `toc` on line 32 in `/_layouts/post.html` is not a recognized Liquid tag.
{% endhighlight %}

I realized immediately that this plugin wasn't in the [whitelist](https://pages.Github.com/versions/) of Github Pages. I forgot that!

![notification]({{site.baseurl}}/assets/image/blog-jekyll-toc-01.PNG){: .center-image }

I have to use a trick way to skip the restriction. As above bulletin showed, I need to build the site locally and push the generated static files to my Github repository ( **Don't use Github Pages generator build**).

## Use Master branch

Followed above information I checked the root path in my Github Pages, it was `master` branch. 

So I added the site file `_site/` to the master branch and pushed to origin repository. 

I referred two articles[^1] here.

[^1]:[https://mccxj.Github.io/blog/20130127_jekyll-plugin-with-git-branch.html]() [https://www.cnblogs.com/ihardcoder/p/4479356.html]()

{% highlight shell %}
git add _site/
git commit -m "add static site file"
git push origin master
{% endhighlight %}

**However, it didn't work!** 

## Use gh-pages branch

There should be something wrong with above procedure.

I went back to google search for another solution. 

Thanks to these two articles[^2]. 

[^2]:[https://www.it1352.com/798173.html](https://www.it1352.com/798173.html) [https://www.cnblogs.com/pengshuo/p/5368035.html](https://www.it1352.com/798173.html), 

I made it clear when I build the site by Github Pages generator, it actually creates a new branch `gh-pages` under master branch, in where it stores the static site files for external accessing. Therefore I need to create the `gh-pages` branch and place my `_site\` to there.

I changed the command as below.

{% highlight shell %}
git checkout -b gh-pages
cp -r _site/* .
git add _site
git commit -m "add site files"
git push origin gh-pages
{% endhighlight %}

![master-root]({{site.baseurl}}/assets/image/blog-jekyll-toc-02.PNG)

**It worked this time!** 

![toc@sidebar]({{site.baseurl}}/assets/image/blog-jekyll-toc-04.PNG)

## Conclusion

If you want to deploy your personal website on Github Pages with the unsupported plugins, you will need to build you site locally and create `gh-pages` branch and upload your site file to this branch. One important point is that you should use the branch as the root, which means placing the site file into the directory directly instead of a sub-directory.

![master-root]({{site.baseurl}}/assets/image/blog-jekyll-toc-03.PNG)