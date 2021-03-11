---
layout: post
title:  "A quick way to fix the Gitalk Error: Validation Failed"
date:   2021-03-08 10:27:13 +0800
categories: Web
Published: true
toc: true
sidebar: false
---
I've met an error `Validation Failed (422)` when using Gitalk in my blog. I added a new post in my blog and found the Gitalk report such issue. My Gitalk works normally for a long time before this issue appears. I've checked that the Gitalk for my other posts works normal and only the new post has issue, which means the issue should be a standalone problem that related to the post self. 

By searching google [gitalk issue #102](https://github.com/gitalk/gitalk/issues/102) I understood the problem is that the length of my new post URL is excessive long and beyond the 50 characters limit. For every post, the Gitalk will create an issue under your blog project repository in Github. The issue id is used to form the issue's label and Gitalk uses the label to identify the post for comments. 

![example]({{site.baseurl}}/assets/image/web-gitalk-fix-01.PNG "example"){: .center-image }

However the problem here is that label length is restricted to maximum 50 characters ( Not sure if it is a BUG here :confused: ).

In my Gitalk configuration, the issue id is set to 
{% highlight ruby %}
id: { {page.url} },
{% endhighlight %}

So if the `page.url` is too long and is beyond the restriction, the issue's label cannot be created and the `Validation Failed` error will be threw out.

Since limitation is clear now, let's fix it.    <br> 

The straightforward way is to use a shorter URL to avoid this issue. But I don't like this restriction that blocking I write post. To convert the URL to a fixed length string looks like a better solution. Why not try hash function? The interesting thing is that I found there has already been a same solution online [-> issue fix](https://blog.csdn.net/death05/article/details/83618887), which use the **MD5** method. This method not only unifies the URL length but also differentiates them.

It is good! 

There is workable [JavaScript-MD5](https://github.com/blueimp/JavaScript-MD5) lib on the Github, I folk it and the rest thing is quite simple.

I added the **MD5 JS** calling in my `comments.html` and reset the Gitalk id to 
{% highlight ruby %}
id: md5(location.pathname),
{% endhighlight %}

Commit the change. 

I reopen the page and the error is gone, by checking the Gitalk issue label, it has been converted to MD5 code. 

![example]({{site.baseurl}}/assets/image/web-gitalk-fix-02.PNG "example"){: .center-image }

Which means the solution is working now! :smiley:



 