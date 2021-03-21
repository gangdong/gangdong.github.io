---
layout: post
title:  "Syntax Highlighting your code in Jekyll with Rouge"
date:   2018-12-22 23:09:12 +0800
categories: Blog
tags: Blog
Published: true
toc: true
sidebar: true
---
Syntax highlighting is important (especially for programming blogs) because it improves the readability of posts. This article will introduce a syntax highlighter - [Rouge](https://rubygems.org/gems/rouge).

I think everyone who attach a code snippet into the blog wants to get a beautiful syntax highlighting style, like does by some famous IDE, Visual Code, Eceplise, Atom... 

I also like that, so I decided to add syntax highlighter into my blog.

My blog was constructed by Jekyll, Jekyll has built in support for syntax highlighting and Rouge is the default highlighter in Jekyll 3 and above. It's also supported by Github Pages, you can use it when you deploy your site on Github Pages.

## Install Rouge
There is nothing special about the installation method, like a ordinary plugin installation.

{% highlight ruby %}
gem install rouge
{% endhighlight %}

and declare in the `_config.yml`
{% highlight yaml %}
highlighter: rouge
{% endhighlight %}

If you use kramdown, add this
{% highlight yaml %}
markdown: kramdown
kramdown:
input: GFM
syntax_highlighter: rouge
{% endhighlight %}

## Use Rouge

Rouge can support syntax highlighting of over 100 languages, find the them [here](https://github.com/rouge-ruby/rouge/wiki/List-of-supported-languages-and-lexers).    

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
[Rouge Themes](https://rouge-ruby.github.io/docs/Rouge/Themes.html) / [Rouge themes](https://github.com/mzlogin/rouge-themes)

Rouge comes built-in with rougify, a command-line tool that converts a style theme to a css file.

Use below command to view the themes that rouge supports.
{% highlight ruby %}
rougify help style
{% endhighlight %}
As of rouge 1.11.1, the available themes are:  
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

Use below command to generate CSS file for the highlighting style you want.
{% highlight ruby %}
rougify style monokai.sublime > syntax_monokai.css
{% endhighlight %}

Copy the generated style CSS file to your site's style folder and don't forget include the stylesheet file into your head.html.

{% highlight ruby %}
<link href="{{site.baseurl}}/assets/css/syntax_monokai.css" rel="stylesheet"/>
{% endhighlight %}

And that’s all you need to start having syntax highlighting on your Jekyll site using Rouge.