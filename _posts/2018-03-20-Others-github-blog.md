---
layout: post
title:  "How to build your personal blog on github"
date:   2018-03-23 21:03:36 +0800
categories: Web Github
---
I have constructed my personal website by jekyll on github pages, I thought I would write a little blog post about how to make your own website by jekyll on GitHub Pages.<br>
I would separate the contents into short blogs, reading long articles are always easy to make people feel weary.<br>
This page will introduce how to create your personal blog based on github pages. Next pages I will introduce Jekyll and how to use it to enrich your blog.<br>

Because I have much work on the github and github also provides the personal homepage service. It is possible to build your personal website on it. To me, it is a good idea to move my personal blog to github in the benefit of saving lots of time on the maintenance of the blog contents on different sites. That's why I'd like to do this thing. The way of hosting your website on GitHub is static access, but it can fully meet my needs. So here comes the question, how do we build it on github? The procedure is simple, just need to create a new repository and upload your website code onto it. After then you can access it at any time and anywhere.
To learn how to build your website on the github, a quick way is referring to the official help document.
[Link](https://pages.github.com)<br>
Here is a short summary，<br>
1. apply a github account, you can skip this step if you already have.<br>
2. create a new repository as below. <br>
![create]({{site.baseurl}}/assets/image/others-blog-create-repository.png)
fill the name of repository，please note the name must be your website's url and ending with github.io!
![create2]({{site.baseurl}}/assets/image/others-blog-create-repository2.png)
3. click create repository button，the repository will be created。<br>
4. open the settings page of your new repository, find your website url and record it. Input your website url into the web browser and then you will see your website's homepage. It is an empty page at the beginning. To add content, you need to create a index.html file in your repository directory. Write what you want into it and submit the modification, you we will see the contents you added.<br>
![create3]({{site.baseurl}}/assets/image/others-blog-create-repository4.png)
For now, all work are done! you've got your personal website with some simple elements. If you want to enrich your website, You need to do some extra work. A fast way is to use github template. GitHub provides many beautiful theme templates. You can use them directly to create your own. The theme templates on GitHub are mostly built based on jekyll, so it is necessary to understand jekyll. However the introduction of jekyll is not discussed in this paper. I'll write a separate article for jekyll.<br>
See you soon.<br>
