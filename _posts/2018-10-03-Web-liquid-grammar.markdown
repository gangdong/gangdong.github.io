---
layout: post
title:  "Liquid grammar"
date:   2018-10-03 23:33:19 +0800
categories: Web
published: true
---
I recently used Liquid language to design my blog website. My blog website was constructed by Jekyll, Jekyll uses Liquid as its template language and adds many objects, tags and filters. The new content includes objects representing content pages, tags to introduce content fragments into the page, and filters to manipulate strings and URLs.
Liquid is an open source template language written in Ruby. I have no knowledge about this language and have spent some time in learning it. This article is a study note and recorded some main knowledge points.

The liquid code consists of objects, tags, and filters.

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
control flow
iteration
Variable assignment

#### control flow
control flow is able to change the information output by Liquid according to the programming logic. 
Include: 

**if**
```
{% raw %}
{% if 'conditions' %}
...
{% else %}
...
{% endif %}
{% endraw %}
```
**unless** 
```
{% raw %}
{% unless 'conditions' %}
...
{% endunless %}
{% endraw %}
```

**case/when** 

```
{% raw %}
{% case 'variable' %}
  {% when 'case1' %}
...
  {% when 'case2' %}
...
  {% else %}
...
{% endif %}
{% endraw %}

```
#### iteration

#### variable assignment


[Liquid](https://liquid.bootcss.com/)