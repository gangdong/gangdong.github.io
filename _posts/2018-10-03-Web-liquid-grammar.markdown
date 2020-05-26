---
layout: post
title:  "Liquid grammar"
date:   2018-10-03 23:33:19 +0800
categories: Web
published: true
---
I recently used Liquid language to design my blog website. My blog website was constructed by Jekyll, Jekyll uses Liquid as its template language and adds many objects, tags and filters. The new content includes objects representing content pages, tags to introduce content fragments into the page, and filters to manipulate strings and URLs.
Liquid is an open source template language written in Ruby. I have no knowledge about this language, so I have spent some time in learning it. This article is a study note and recorded some main knowledge points.

The liquid code consists of **objects**, **tags**, and **filters**.

### objects
Object tells liquid where to display content on the page. Object and variable names are identified by double curly braces: {% raw %}{{ }}{%  endraw %}
```Liquid
{% raw %}
{{post.name}}
{% endraw %}
```
### tag
Tags create the logic and control flow of templates. They are identified by a single bracket with a percent sign: {% raw %}{% and%}{% endraw %}.
Tags do not produce any visible text output. This means that you can use them to assign values to variables, create conditions and loop logic, and do not display any liquid logic code on the page.

Tags are divided into three categories:
+ [control flow](https://liquid.bootcss.com/tags/control-flow/)
+ [iteration](https://liquid.bootcss.com/tags/iteration/)
+ [Variable assignment](https://liquid.bootcss.com/tags/variable/)

### Filters 
The filter changes the output of the liquid object. They are used for output, separated by a | symbol.

The keywords includes:<br>
```
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
```

### Operator
Except the 3 basic elements, Liquid contains the logical and comparison operators. 
They are 
```
"=",">","<",">=","<=","!=","or","and".
```
The syntax is similar to other language, like C. 

### Object Type
There are five types of Liquid objects.
+ String
+ Number
+ Boolean
+ Nil
+ Array

Actually, except Nil, others you can find at other language, the usage is quite similar. Nil type represents a null object.

The above constitutes the main Liquid grammar, in order to avoid excessive long article, I decide to quit here. For more details, can find at [liquid website](https://liquid.bootcss.com/).