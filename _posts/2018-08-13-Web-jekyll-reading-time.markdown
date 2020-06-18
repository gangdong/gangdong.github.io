---
layout: post
title:  "Calculate reading time in Jekyll"
date:   2018-08-13 19:12:43 +0800
categories: Web
---
I believe it is a good idea to estimate the reading time of every post and display it to readers following the post excerpts. 

There are plenty of Jekyll plugins that support realizing this feature, but I don't suggest to use them if you want to deploy your blog on Github pages. (GitHub may block the working of these plugins by running with the `--safe` flag).

So I tried to write below trick code to realize this feature. 

```html
{% raw %}
{% assign words = post.content | strip_html | strip_newlines | remove: " " | size %}
{% assign time = post.content | strip_html | strip_newlines | remove: " " | size 
| divided_by: 400 | plus: 1 %}

<footer>
<div style="margin-top:25px">
          <a class="post-link" href="{{ post.url | relative_url }}">
          <span class="icon-clock morebox" >Reading time: {{ time }} 
          {%if time > 1 %} mins
          {% else %}min{% endif %}, {{words}} words.<br>      Continue read...</span>
          </a>
</div>
</footer> 
{% endraw %}
```
The method is straightforward, 
+ Statistics the words count of every post. Actually a more simple and pure Liquid code is like this.

```html
{% raw %}
{% assign words = content | number_of_words %}
{% endraw %}
```
But Jekyll built in filter `number_of_words` cannot accurately count the number of Chinese words. If you have Chinese words to calculate, you can use Liquid's size filter to avoid this problem. In order to make statistics more accurate, it is better to ignore all HTML tags and blank lines before calculation.
+ Get a number of WPM (word per minute), by google the WPM value, an person can read 300-500 words per minute in a computer monitor. I read fast and I think it can be a bigger value, but I set an median 400 here for my blog. 
+ The rest work is easy, we only need calculating the reading time by dividing words count with WPM.

Next, I create a **read_time.html** in my _includes folder and put all this code into it to well orgianze them. 

I just include the **read_time.html** in my post layout.

```html
{% raw %}
{% include reading_time.html %}
{% endraw %}
```
That's all. If you want to get all code, fork it [here](https://github.com/gangdong/daviddong.github.io).