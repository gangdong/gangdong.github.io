---
layout: post
title:  "How did I implement related posts function in my blog"
date:   2018-11-14 10:51:56 +0800
categories: Blog
tags: Blog
Published: true
toc: true
sidebar: true
about: true
author: david.dong
description: This article will help you implement the related posts function in your blog. <br><br>It presents necessary knowledge and attach code-snippet. If you want to add this feature to your blog, just follow it!
keywords: Related posts/Blog
---
What will you learn in this post?     
This post introduced how to implement the `related posts` function with Jekyll. 

## Jekyll’s Native Support
My blog was constructed with Jekyll, Jekyll has native support for related posts function, which can be used with Liquid as `site.related_posts`. 

However, when I used it, I found this function has some points not as good as I expected.

### problem
+ This function collects the related posts and group them by searching the same tags among them. But if there aren’t enough posts sharing the same tags. It will return ten most recent posts as default.<br>   
This behavior doesn't make sense to me!<br>         
Why should a post be related to another post that they have nothing to do with the contents just because they are close in release time and no other related posts are existing?

+ This function lists posts with mutual tags without ordering by how many mutual tags they share. In this way, if A post is tagged with `a`, `b` and `c`, B post is tagged with `a` and C post is tagged with `a` and `c`, There is no problem if you do not limit the count of the related posts. It will return B and C as A's related posts. But if you set the limit to 1, A’s related posts may contain only B instead of C. Apparently, C should be the right one under this case since it is more related to A.

+  To achieve this function, need to run the Jekyll command with the `--lsi` (`latent semantic indexing`) option when building.<br>   
Unfortunately, GitHub Pages does not support the `lsi` option when generating sites.

{% highlight ruby %}
jekyll server --lsi
{% endhighlight %}


## Use plugins
So I decided not to use this function and turned to find other support. 

I found two plugins that can support the related posts function.    

[toshimaru/jekyll-tagging-related_posts](https://github.com/toshimaru/jekyll-tagging-related_posts)    
[lawrencewoodman/related_posts-jekyll_plugin](https://github.com/LawrenceWoodman/related_posts-jekyll_plugin)  

By reading the readme file, both of them have the same feature that overrides the built-in related_posts function to calculate related posts based on a posts' tag. And the algorithm is identical, from [related_posts-jekyll_plugin](https://github.com/LawrenceWoodman/related_posts-jekyll_plugin) by @[LawrenceWoodman](https://github.com/LawrenceWoodman).

So I chose one of them to try the function. 

I installed the plugin and inserted the below code to my post.html

{% highlight html %}
{% raw %}
{% if site.related_posts.size >= 1 %}
<div>
  <h3>Related Posts</h3>
  <ul>
  {% for related_post in site.related_posts limit: 5 %}
    <li><a href="{{ related_post.url }}">{{ related_post.title }}</a></li>
  {% endfor %}
  </ul>
</div>
{% endif %}
{% endraw %}
{% endhighlight %}

I tested and the above problem was fixed!

The plugin will return nothing if no related posts are found instead of recent posts and look also adding the ordering of the searched tags count. 

Only one problem, the Github Pages cannot support these two plugins since they are not in the [whitelist](https://pages.github.com/versions/) and will be blocked to build for security reasons.