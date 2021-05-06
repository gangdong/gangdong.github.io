---
layout: post
title:  "Speeding up my blog loadtime"
date:   2021-04-10 22:14:11 +0800
categories: Blog Github Web
tags: Blog Github Web
Published: true
toc: true
sidebar: true
about: true
author: david.dong
description: This is the story on how I speed up my blog load time. In this post I’ll show how I improved my blog load time in about 80%.
keywords: jsDelivr/CDN
---
![示例图片]({{site.cdn_baseurl}}/assets/image/others-blog-01.jpg "example")    
This is the story of how I speed up my blog website load time...

{% include toc.html %}

I’ve been adding some features to my blog which powered the website a lot. It is great! But, lately, the load time of website started to bother me. I was not happy with the website load time. 

## Current State
Today, I decided to go and figure out why. The first step was to gather data on why it was so slow. I will use Google Chrome Browser for the test and use DevTools to see what’s taking too much time to load. In order not to make this too extensive, I’ll keep only the top factors and the final time.

Let’s see how much time it takes right now:

![without optimizing]({{site.cdn_baseurl}}/assets/image/blog-loadingtime-01.PNG){: .center-image }

approximate 25 seconds for the first-time connection. Let’s try to improve that.

As we can see, the top items that delay the response time are: 

|Factors|Duration|Percentage|
|---|:---:|:---:|
|Time for loading images|~19.7s|75%|
|Addthis_widgets.js|~19.54s|75%|
|Google Fonts|~3s|12%|
|Other JS/CSS files|~3.2s|13%|

I will go to improve through them one by one.

## Image Loading Time
I tried to adopt two methods to fast the image loading time.

+ Resize images to improve page load time:
   
   The current solution is compressing the image size with the tool [imagine](https://imagine.en.softonic.com/), which can significantly compress the size of the image (up to more than 70%).
 
   ![imagine]({{site.cdn_baseurl}}/assets/image/blog-loadingtime-10.PNG){: .center-image }

   The future plan is to serve images in next-gen formats. Image formats like JPEG 2000, JPEG XR, and WebP often provide better compression than PNG or JPEG, which means faster downloads and less data consumption. The only concern is browser compatibility, not all of the browsers can support these formats so far.
<div class = "post-note info">
  <div class = "header"></div>
  	<div class = "body">
		<p>If you want to know detailed information about the browser compatibility, <br>please view the below website: 
		  <ul >
			<li><a href = "https://caniuse.com/webp">WebP</a></li>
			<li><a href = "https://caniuse.com/jpeg2000">JPEG 2000</a></li>
			<li><a href = "https://caniuse.com/jpegxr">JPEG XR</a></li>
		  </ul>
		</p>
  	</div>
</div>
+ Use image CDNs to optimize images:

   Image content delivery networks (CDNs) are excellent at optimizing images.

   The below contents replies to the question of ***What's an image CDN?*** 
   > Image CDNs specialize in the transformation, optimization, and delivery of images. You can also think of them as APIs for accessing and manipulating the images used on your site. 
   
   I chose a Third-party image CDN [jsdelivr](https://www.jsdelivr.com/) to do this work for me. It is free for open-source projects and has very good support to Github as they introduced in their official statement. 

   > jsDelivr is a free CDN for open source files. We are tightly integrated with Github and npm allowing us to automatically provide a reliable CDN service to almost every open source project out there.

   ***Especially In China:***
   > jsDelivr has partnered up with multiple Chinese companies to provide fast and reliable file delivery in China mainland and the whole Asian continent. We have servers inside China that improve the delivery speeds and latency significantly. We also have a valid ICP license issued by the Chinese government that protects us from bans and slow downloads.<br>
   > jsDelivr works perfectly inside China!
   
<br>
   The usage of jsdelivr CDN is simple, I inserted the URL of jsdelivr service in the front of my local `assets/images` URL in the `_config.yml` by following [Usage](https://www.jsdelivr.com/features#gh). 
   
<div class = "post-note info">
  <div class = "header"></div>
  <div class = "body">
  	<p> For more details of jsdelivr, refer to <a href = "https://github.com/jsdelivr/jsdelivr">jsdelivr @Github</a>. </p>
  </div>
</div>

   OK, Let's see the result with the above optimization.

   ![imagine]({{site.cdn_baseurl}}/assets/image/blog-loadingtime-11.PNG){: .center-image }
   
   Total ~ 160ms with two images loading! A good improvement I think! You may also find the image source has changed to jsdelivr CDN instead of my local Github Repos. 
   
   I am happy with the result and it is acceptable.

## Addthis_widgets.js
I use `Addthis widgets` for the social media sharing of my posts. It is handy in functionality, I don't want to delete it!

I decided to lazy load it at first, make sure a load of Addthis_widgets resource would not block the rendering of the `index` page. 

The total load time reduced up to ~10s, but still, it takes too much time! Can I improve it even more?

After analysis, I found I introduced the `Addthis_widgets.js` in the `default.html`, which lead the `Addthis_widgets.js` is loaded at the first paint of the `index` page. However, the widgets weren't used on the `index` page. If I move the calling of the JavaScript file to `post.html` where it displays the share button for the post, I will be able to eliminate the load time of `Addthis_widgets.js` completely! It will not affect the function.

I relocated the below code snippet into the bottom of `post.html` and lazy load it. 
{% highlight html %}
{% if site.rawposts.share_media %}
<!-- Go to www.addthis.com/dashboard to customize your tools -->
<script async type="text/javascript" src="//s7.addthis.com/js/300/addthis_widget.js#pubid=ra-604f502a8198c9c9&domready=1"></script>
{% endif %}
{% endhighlight %}
Readers will not use the share button until they complete the reading of the article. I think it has a negligible negative effect on user experience. 

![imagine]({{site.cdn_baseurl}}/assets/image/blog-loadingtime-14.PNG){: .center-image }

The test result showed Addthis_widgets.js is gone in the load phase, and the time went to 2.56s now! 

That improved a lot. But I wanted more.

## Google Fonts

Google Fonts is beautiful! I was using four fonts in my blog. I introduced them in the `head.html`, the load of fonts slows the page speed more or less.

However, after some works, I haven't been able to find a good way to accelerate the acquisition of the fonts. I will keep my eyes on it!

## Ohter JS/CSS

I reviewed all of the JS/CSS that block the page rendering. 

+ I removed the unnecessary ones. 
+ For the remained, I also use the jsdelivr CDN to speed up the acquiring. 
+ Delivering critical JS/CSS inline and deferring all non-critical JS/styles. 

***Wow!*** After all of the above works, the load time is 1.84s finally! I can live with that.

![imagine]({{site.cdn_baseurl}}/assets/image/blog-loadingtime-12.PNG){: .center-image }

## The Last Test

I used some other tools to verify the final performance. 

+ [dotcom-monitor](https://www.dotcom-tools.com/)

  I tested the load time from locations scattered on different continents worldwide. The test browser I chose Chrome.
  ![imagine]({{site.cdn_baseurl}}/assets/image/blog-loadingtime-15.PNG){: .center-image }

  The result is 
  ![imagine]({{site.cdn_baseurl}}/assets/image/blog-loadingtime-16.PNG){: .center-image }

  The average time is about ~3s, exclude Buenos Aries, which is much slower (~6.7s).

  I am more interested in the speed of the city I live in. The result is 2.6s. 

  ![imagine]({{site.cdn_baseurl}}/assets/image/blog-loadingtime-17.PNG){: .center-image }

+ [Pingdom Website Speed Test](https://tools.pingdom.com/)

    + Asia-Tokyo
     ![imagine]({{site.cdn_baseurl}}/assets/image/blog-loadingtime-18.PNG){: .center-image }
    + Europe-Frankfurt
     ![imagine]({{site.cdn_baseurl}}/assets/image/blog-loadingtime-19.PNG){: .center-image }
    + North America - USA-Washtington D.C
     ![imagine]({{site.cdn_baseurl}}/assets/image/blog-loadingtime-20.PNG){: .center-image }

## The Future Plan

Well, my further improvement plan is:
<div class = "separator"></div>
1. Try to use the new image format WebP/JPEG 2000. I will get extra 0.2s savings estimated with that.
2. Find equivalent of Google Font or load them locally.
3. Use [CloudFlare CDN](https://www.cloudflare.com/) to speed up my page.
   Cloudflare has several neat features. It can minify files, improve image sizes, bundle js files, and so forth. By taking advantage of CloudFlare’s global network, I can utilize its CDN service to improve my site's performance and security. 
4. If considering the China local visiting I will perhaps change the NS to [dnspod](https://www.dnspod.cn/)...
<div class = "separator"></div>

## Reference

I would recommend some articles which are helpful for website load time optimization. I read and referred them during my optimization.

+ [4 ways to improve your website load time and performance in 2020](https://www.impactplus.com/blog/website-load-time)
+ [How to Speed Up Your Website: 20+ Practical Tips for a Faster Site](https://websitesetup.org/how-to-speed-up-your-website/)
+ [12 Techniques of Website Speed Optimization: Performance Testing and Improvement Practices](https://www.altexsoft.com/blog/engineering/12-techniques-of-website-speed-optimization-performance-testing-and-improvement-practices/)