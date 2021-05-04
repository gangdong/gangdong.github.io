---
layout: post
title:  "Liquid grammar"
date:   2018-10-03 23:33:19 +0800
categories: Blog
tags: Blog
published: true
toc: true
sidebar: true
---
I recently used Liquid language to design my blog website. The Liquid is an open-source template language written in Ruby. This article is a short study note of Liquid and presented some main knowledge.

My blog website was constructed by Jekyll, Jekyll uses Liquid as its template language and adds many objects, tags, and filters. The new content includes objects representing content pages, tags to introduce content fragments into the page, and filters to manipulate strings and URLs.

I do not know this language previously, so I spent some time learning it. 

The Liquid code consists of `objects`, `tags`, and `filters`.

{% include toc.html %}

## objects
Object tells Liquid where to display content on the page. Object and variable names are identified by double curly braces: `{% raw %}{{ }}{%  endraw %}`
{% highlight Liquid %}
{% raw %}
{{post.name}}
{% endraw %}
{% endhighlight %}
## tags
Tags create the logic and control flow of templates. They are identified by a single bracket with a percent sign: `{% raw %}{%{% endraw %}` and `{% raw %}%}{% endraw %}`.
Tags do not produce any visible text output. This means that you can use them to assign values to variables, create conditions and loop logic, and do not display any Liquid logic code on the page.

Tags are divided into three categories:
+ [control flow](https://Liquid.bootcss.com/tags/control-flow/)
+ [iteration](https://Liquid.bootcss.com/tags/iteration/)
+ [Variable assignment](https://Liquid.bootcss.com/tags/variable/)

## filters 
The filter changes the output of the Liquid object. They are used for output, separated by a `|` symbol.

The keywords include :<br>
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
{% highlight Liquid %}
"=",">","<",">=","<=","!=","or","and".
{% endhighlight %}
The syntax is similar to other languages, like `C`. 

## Object Type
There are five types of Liquid objects.
+ String
+ Number
+ Boolean
+ Nil
+ Array

Actually, except `Nil` (Nil type represents a null object.), others you can find the same type in other languages (for example C), the usage is quite similar. 

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

+ `{% raw %}{% highlight ruby linenos  %}{% endraw %}`<br>
`{% raw %}{% endhighlight %}{% endraw %}`<br>
This tag supports syntax highlighting of over 100 languages, in addition, it can also output the line numbers of the code. Check this page [Rouge wiki](https://github.com/rouge-ruby/rouge/wiki/List-of-supported-languages-and-lexers) to find the appropriate identifier to use for the language you want to highlight.
+ `{% raw %}{% link url.md %}{% endraw %}`<br>
The link tag will generate the correct permalink URL for the path you specify, you must include the file’s original extension when using the link tag. This tag can also be used to create a link in Markdown.   
+ `{% raw %}{% post_url post_name %}{% endraw %}` <br>
The post_url tag will generate the correct permalink URL for the post you specify. Unlike `{% raw %}{% link %}{% endraw %}` tag, there is no need to include the file extension when using the `post_url` tag. This tag can also be used on Markdown.

The [Jekeyll page](https://jekyll.zcopy.site/docs/Liquid/) gives more details.

The above elements constitute the main Liquid grammar, I am trying to avoid writing an excessively long article, so I decided to quit here. For more content, you can find it at [Liquid website](https://Liquid.bootcss.com/).