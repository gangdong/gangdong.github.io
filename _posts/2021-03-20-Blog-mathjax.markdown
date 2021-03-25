---
layout: post
title:  "Display mathematics formula in blog with MathJax"
date:   2021-03-20 11:11:12 +0800
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
When writing posts, I need to display mathematics formula sometimes. I write posts with Markdown, I don't want to save the formula into an image and load the image in markdown. It is better write the Latex formula in markdown file directly. MathJax helped me do it. This article will introduce what MathJax is and how to use MathJax.

{% include toc.html %}

## What is MathJax?

> MathJax is an open-source JavaScript display engine for LaTeX, MathML, and AsciiMath notation that works in all modern browsers.

This is the definition of the [MathJax official website](https://www.mathjax.org/), more information can be found from there.

To me, it has some benefits when writing blog.

- No need plugin support in Jekyll. I don't have to worry about that it cannot be implemented when deploying the site at Github Pages for security checking. 
- Unlike using bitmaps image to display, it is text editing and transforms the mathematics formula to HTML or SVG, so it is workable for zoom scale and is suitable to display under different size screen.
- I can write the mathematics formula in markdown with plain text just by following the syntax of LaTex/TeX.
- Friendly to new user, you can quickly use it even you have no any knowledge about it. 

Moreover, looks MathJax has become into the most popular solution for rendering the Latex mathematics formula in the web application. 

At least, I think so.

## How to implement?

### Including MathJax in a web page
As I said, one of the benefit of MathJax is that you don't need to install any plugin to implement it, just introduce a piece of JavaScript code into your page's HTML.

{% highlight html %}
<script type="text/javascript" async src="//cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-MML-AM_CHTML">
</script>
{% endhighlight %}

I added above snippet into my `default.html`, you can insert it into `head.html` or any page's HTML where you want to use MathJax.


### Configuration

Here `TeX-MML-AM_CHTML` is the configuration for common user case.
For more configuration, can find at [here](https://docs.mathjax.org/en/latest/web/configuration.html).

MathJax offers a global object named MathJax that contains configuration data for the various components of MathJax.

For TeX or LaTeX input component , it has two types. One is `in-line mathematics`(display in paragraph) and the other is `displayed mathematics`(display as a single paragraph).

It uses double dollar sign `$$` as the default math delimiters for `displayed mathematics`, uses the `(\...\)` as the math delimiters for `in-line mathematics`.

Here as an example, I inserted below code snippet to add single dollar `$` signs as in-line math delimiters.

{% highlight html %}
<script type="text/x-mathjax-config">
  MathJax.Hub.Config({tex2jax: {inlineMath: [['$','$'], ['\\(','\\)']]}});
</script>
{% endhighlight %}

It is better place the MathJax object in a `<script>` tag just before the script that loads MathJax itself. 

So my last code is 

{% highlight html %}
<script type="text/x-mathjax-config">
  MathJax.Hub.Config({tex2jax: {inlineMath: [['$','$'], ['\\(','\\)']]}});
</script>
<script type="text/javascript" async src="//cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-MML-AM_CHTML">
</script>
{% endhighlight %}


### Mathematics expression with MathJax

I wrote below words as startup.

> Hi, there,     
> This is my first MathJax equation.    
> When $a \ne 0$, there are two solutions to    
> <div>$$ax^2 + bx + c = 0$$</div>     
> and they are    
> <div>$$x = {-b \pm \sqrt{b^2-4ac} \over 2a}.$$</div>

## Write at the last

+ I found importing the MathJax snippet will slow the site's loading speed. So I moved the MathJax snippet to the post's markdown file from `default.html`, only use it when the post need a mathematics expression. 
+ I am not familiar with Latex syntax and I will spend some time in learning. It is not a problem! 😛

<script type="text/javascript" async src="//cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-MML-AM_CHTML">
</script>
<script type="text/x-mathjax-config">
  MathJax.Hub.Config({tex2jax: {
			skipTags: ['script', 'noscript', 'style', 'textarea', 'pre'],
			inlineMath: [['$','$'], ['\\(','\\)']]
		}
	});
</script>