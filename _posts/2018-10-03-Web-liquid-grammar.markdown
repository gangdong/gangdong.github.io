---
layout: post
title:  "Liquid grammar"
date:   2018-10-03 23:33:19 +0800
categories: Web
published: true
---
I recently used Liquid language to design my blog website. My blog website was constructed by Jekyll, Jekyll uses Liquid as its template language and adds many objects, tags and filters. The new content includes objects representing content pages, tags to introduce content fragments into the page, and filters to manipulate strings and URLs.
Liquid is an open source template language written in Ruby. I have no knowledge about this language previous, so I spent some time in learning it. This article is a short study note and recorded some main knowledge points.

The liquid code consists of **objects**, **tags**, and **filters**.

<div class = "separator"></div>
## Index 
* TOC
{:toc}
<div class = "separator"></div>

## objects
Object tells liquid where to display content on the page. Object and variable names are identified by double curly braces: {% raw %}{{ }}{%  endraw %}
{% highlight liquid %}
{% raw %}
{{post.name}}
{% endraw %}
{% endhighlight %}
## tags
Tags create the logic and control flow of templates. They are identified by a single bracket with a percent sign: {% raw %}{% and%}{% endraw %}.
Tags do not produce any visible text output. This means that you can use them to assign values to variables, create conditions and loop logic, and do not display any liquid logic code on the page.

Tags are divided into three categories:
+ [control flow](https://liquid.bootcss.com/tags/control-flow/)
+ [iteration](https://liquid.bootcss.com/tags/iteration/)
+ [Variable assignment](https://liquid.bootcss.com/tags/variable/)

## filters 
The filter changes the output of the liquid object. They are used for output, separated by a | symbol.

The keywords includes:<br>
{% highlight ruby %}
abs
append
at_least 
at_most 
capitalize 
ceil
compact 
concat 
date
default 
divided_by
downcase
escape
escape_once
first
floor
join
last
lstrip 
map
minus 
modulo
newline_to_br 
plus
prepend
remove
remove_first 
replace
replace_first
reverse
round
rstrip
size
slice
sort
sort_natural 
split
strip
strip_html
strip_newlines
times
truncate
truncatewords 
uniq
upcase
url_decode
url_encode
{% endhighlight %}

## Operator
Except the 3 basic elements, Liquid contains the logical and comparison operators. <br>
They are 
{% highlight liquid %}
"=",">","<",">=","<=","!=","or","and".
{% endhighlight %}
The syntax is similar to other language, like C. 

## Object Type
There are five types of Liquid objects.
+ String
+ Number
+ Boolean
+ Nil
+ Array

Actually, except Nil (Nil type represents a null object.), others you can find the same type at other language (for example C), the usage is quite similar. 

## Liquid in Jekyll

In Jekyll, Jekyll adds a few handy filters and tags of its own.

Below are some of useful tags and filters, which I have used on my blog website.

### filters
+ relative_url
+ date_to_string 
+ group_by
+ where
+ number_of_words
 
### tags
{% raw %}
+ {% highlight ruby linenos  %}<br>
{% endhighlight %}<br>
This tag support for syntax highlighting of over 100 languages, in addition, it can also output the line numbers of the code. Check this page [Rouge wiki](https://github.com/rouge-ruby/rouge/wiki/List-of-supported-languages-and-lexers) to find the appropriate identifier to use for the language you want to highlight.
{% endraw %}
{% raw %} 
+ {% link url.md %}<br>
The link tag will generate the correct permalink URL for the path you specify, you must include the file’s original extension when using the link tag. This tag can also be used to create a link in Markdown.   
+ {% post_url post_name %} <br>
The post_url tag will generate the correct permalink URL for the post you specify. Unlike {% link %} tag, there is no need to include the file extension when using the post_url tag. This tag can also be used on Markdown.
{% endraw %}

The [Jekeyll page](https://jekyll.zcopy.site/docs/liquid/) gives more details.

The above elements constitutes the main Liquid grammar, I am trying to avoid writing excessive long article, so I decide to quit here. For more contents, you can find at [liquid website](https://liquid.bootcss.com/).