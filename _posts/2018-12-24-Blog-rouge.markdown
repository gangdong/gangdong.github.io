---
layout: post
title:  "Syntax Highlighting your code in Jekyll with Rouge"
date:   2018-12-22 23:09:12 +0800
categories: Blog
tags: Blog
Published: true
toc: true
sidebar: true
about: true
author: david.dong
description: Do you want to add a syntax highlighting function into your code block? <br><br>You can get help from this article.
keywords: Rouge/Syntax highlighting
---
Syntax highlighting is important (*especially for programming blogs*) because it improves the readability of posts. This article will introduce a syntax highlighter - [Rouge](https://rubygems.org/gems/rouge).

{% include toc.html %}

I think maybe someone who attaches a code snippet into the blog wants to get a beautiful syntax highlighting style, just like we see in some popular IDEs, Visual Code, Eceplise, Atom... 

I also like that, so I decided to add a syntax highlighter to my blog.

My blog was constructed by Jekyll, Jekyll has built-in support for syntax highlighting and Rouge is the default highlighter in Jekyll 3 and above. It's also supported by Github Pages, you can use it when you deploy your site on Github Pages.

## Install Rouge
There is nothing special about the installation, like an ordinary Jekyll plugin installation.

{% highlight ruby %}
gem install rouge
{% endhighlight %}

and declare in the `_config.yml`
{% highlight yaml %}
highlighter: rouge
{% endhighlight %}

If you use `kramdown`, add this
{% highlight yaml %}
markdown: kramdown
kramdown:
input: GFM
syntax_highlighter: rouge
{% endhighlight %}

## Syntax highlighting with Rouge

Rouge can support syntax highlighting of over 100 languages, find them [here](https://github.com/rouge-ruby/rouge/wiki/List-of-supported-languages-and-lexers).    

To render a code block with syntax highlighting, surround your code as

{% highlight ruby %}
{% raw %}
{% highlight ruby %}
def foo
  puts 'foo'
end
{% endhighlight %}
{% endraw %}
{% endhighlight %}

Including the `linenos` argument will force the highlighted code to include line numbers. 

## Stylesheet

There are some syntax highlighting style themes available in Rouge, you can look for them at     
+ [Rouge Themes Doc](https://rouge-ruby.github.io/docs/Rouge/Themes.html) / [Rouge themes](https://github.com/mzlogin/rouge-themes)

Rouge comes built-in with `rougify`, a command-line tool that converts a style theme to a `CSS` file.

Use below command to view the themes that Rouge supports.
{% highlight ruby %}
rougify help style
{% endhighlight %}
As of Rouge 1.11.1, the available themes are:  
{% highlight ruby %}
base16, 
base16.dark, 
base16.monokai, 
base16.monokai.light, 
base16.solarized, 
base16.solarized.dark, 
colorful, 
github, 
gruvbox, 
gruvbox.light, 
molokai, 
monokai, 
monokai.sublime, 
thankful_eyes
{% endhighlight %}

Use below command to generate `CSS` file for the syntax highlighting style you want.
{% highlight ruby %}
rougify style monokai.sublime > syntax_monokai.css
{% endhighlight %}

Copy the generated style CSS file to your site's style folder and don't forget to include the stylesheet file into your `head.html`.

{% highlight ruby %}
<link href="{{site.cdn_baseurl}}/assets/css/syntax_monokai.css" rel="stylesheet"/>
{% endhighlight %}

And that’s all you need to start having syntax highlighting on your Jekyll site using Rouge.

Hope that’s somehow useful for you! 🙂