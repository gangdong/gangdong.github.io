---
layout: post
title:  "Display mathematics formula in blog with MathJax"
date:   2019-03-20 11:11:12 +0800
categories: Blog
tags: Blog
Published: true
toc: true
sidebar: true
about: true
author: david.dong
description: This article introduced what MathJax is and how to use MathJax.
keywords: MathJax/Jekyll
---
When writing posts, I need to display mathematics formulas sometimes. I write posts with Markdown, I don't want to save the formula into an image and load the image in markdown. It is better to write the Latex formula in the markdown file directly. MathJax helped me. This article will introduce what MathJax is and how to use MathJax.

![price]({{site.cdn_baseurl}}/assets/image/blog-mathjax-01.png){: .center-image }

{% include toc.html %}

## What is MathJax?

This is the definition of the MathJax in [MathJax official website](https://www.mathjax.org/). 

> MathJax is an open-source JavaScript display engine for LaTeX, MathML, and AsciiMath notation that works in all modern browsers.

In short, MathJax is a simple, yet powerful, way of including Tex/LaTex/MathML based mathematics in HTML webpages.

To me, it brought some benefits when writing a blog.

- No need for plugin support in Jekyll. I don't have to worry that it cannot be used when deploying my website at Github Pages for the reason of security checking. (*Github Pages uses the Jekyll `--safe` flag*) 
- Unlike using bitmaps image to display, it is text editing and transforms the mathematics formula to HTML or SVG, so it is workable for zoom scale and is suitable to display under different size screen.
- I can write the mathematics formula in markdown with plain text just by following the syntax of LaTex/TeX.
- Simple to use, I can quickly use it even I don't have much knowledge about it. 

Moreover, looks MathJax has become into the most popular solution for rendering the Latex mathematics formula in web applications. 

At least, I think so.

## How to use?

### Including MathJax in a webpage
As I said, one of the benefits of MathJax is that it doesn't need to install any plugin to use, just introducing a piece of JavaScript code into the webpage's HTML.

{% highlight html %}
<script type="text/javascript" async src="//cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-MML-AM_CHTML">
</script>
{% endhighlight %}

I added the above snippet into my `default.html`, it can also be placed into the `head.html` or any page's HTML where you want to use MathJax.


### Configuration

Here `TeX-MML-AM_CHTML` is the configuration for common user cases.

<div class = "post-note info">
  <div class = "header"></div>
  	<div class = "body">
		<p>For more information of configuration, read at <a href = "https://docs.mathjax.org/en/latest/web/configuration.html">here</a>.
		</p>
  	</div>
</div>

MathJax offers a global object named `MathJax` that contains configuration data for the various components.

For TeX or LaTeX input component, it has two types. One is `in-line mathematics`(*display in paragraph*) and the other is `displayed mathematics`(*display as a single paragraph*).

It uses the double dollar sign `$$` as the default math delimiters for `displayed mathematics`, uses the `(\...\)` as the math delimiters for `in-line mathematics`.

The math delimiters can be customized as well.
 
Here is an example, I wrote below code to add single dollar `$` signs as in-line math delimiters.

{% highlight html %}
<script type="text/x-mathjax-config">
  MathJax.Hub.Config({tex2jax: {inlineMath: [['$','$'], ['\\(','\\)']]}});
</script>
{% endhighlight %}

It is better to place the MathJax object in a `<script>` tag just before the script that loads MathJax itself. 

My last code is 

{% highlight html %}
<script type="text/x-mathjax-config">
  MathJax.Hub.Config({tex2jax: {inlineMath: [['$','$'], ['\\(','\\)']]}});
</script>
<script type="text/javascript" async src="//cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-MML-AM_CHTML">
</script>
{% endhighlight %}


### Examples

I wrote the below words as a startup.

> Hi, there,     
> This is my first MathJax equation.    
> When $a \ne 0$, there are two solutions to    
> <div>$$ax^2 + bx + c = 0$$</div>     
> and they are    
> <div>$$x = {-b \pm \sqrt{b^2-4ac} \over 2a}.$$</div>

<br>

## Write at the last

+ I found introducing the MathJax javascript code snippet will slow the website's loading speed. So I re-located the loading code of MathJax to the post's markdown file, only load it when the post needs a mathematics expression.  
+ I am not familiar with Latex syntax and I will spend some time learning. It is not a problem!  😛

<script type="text/javascript" async src="//cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-MML-AM_CHTML">
</script>
<script type="text/x-mathjax-config">
  MathJax.Hub.Config({tex2jax: {
			skipTags: ['script', 'noscript', 'style', 'textarea', 'pre'],
			inlineMath: [['$','$'], ['\\(','\\)']]
		}
	});
</script>