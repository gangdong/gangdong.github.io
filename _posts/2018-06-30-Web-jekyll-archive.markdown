---
layout: post
title:  "Archive in Jekyll"
date:   2018-06-30 15:44:56 +0800
categories: Blog
tags: Blog
toc: true
sidebar: true
---
After setting up the pagination, the next thing I wanted to add to my blog was a 'proper' archive by both date and category rather than just the reverse chronological list of posts. Although this wasn't as straightforward as setting up pagination, a bit of searching turned up some sites that helped me get everything running.

{% include toc.html %}

## Archive by date
Because a list of posts in reverse chronological order can be readily accessed in Jekyll through `site.posts`, all that's needed is to use some clever Liquid markup to process it. 
I used below code to group my archives by year.
{% highlight liquid %}
{% raw %}
{% comment %}Calucate the post count for each year{% endcomment %}
{% assign count = 1 %}
{% assign year_cnt = "" %}
{% for post in site.posts reversed %}
    {% assign year = post.date | date: '%Y' %}
    {% assign nyear = post.next.date | date: '%Y' %}
    {% if year != nyear %}
        {% assign count = count | append: ', ' %}
        {% assign counts = counts | append: count %}
		{% assign year_cnt = year_cnt | append: year | append: ', ' %}
		{% assign years = years | append: year_cnt %}
		{% assign year_cnt = "" %}
        {% assign count = 1 %}
    {% else %}
        {% assign count = count | plus: 1 %}
    {% endif %}
{% endfor %}

{% comment %}show navigation tag here{% endcomment %}
<div class="archive-label-meta" style ="margin-top:25px">
{% assign i = 0 %}
{% comment %} remove the separator. {% endcomment %}
{% assign counts_year = counts | split: ', ' | reverse %}
{% assign years = years | split: ', ' %}
{% for year in years reversed %}
<ul class="post-categories">       
     <a href = "#{{year}}" style = "font-family: Raleway,Arial,sans-
      serif; font-size:14px">{{ year }} ( {{counts_year[i]}} )</a>
</ul>
{% assign i = i | plus: 1 %}
{% endfor %}
</div>

{% comment %}list post link for each year{% endcomment %}
{% assign counts = counts | split: ', ' | reverse %}
{% assign i = 0 %}
{% for post in site.posts %}
    {% capture year %}{{ post.date | date: '%Y' }}{% endcapture %}
    {% capture nyear %}{{ post.next.date | date: '%Y' }}{% endcapture %}
      {% if year != nyear %}
        <h3 id = "{{year}}" class="archive-title">{{ post.date | date: '%B %Y' }}</h3>
	  {% assign i = i | plus: 1 %}
      {% endif %}
	<div class="archive-meta" style="margin-left:15px;line-height:16px">
	 <div class="post-date" style="margin-right:30px; font-size:16px; 
          width:180px"><i class="icon-calendar"></i>{{ post.date | date:
          "%e %B %Y" }}</div>
     <a class="post-link" href="{{ post.url | relative_url }}">
     <h2 class="archive-link">{{ post.title | escape }}</h2>
     </a>
   </div>
{% endfor %}
{% endraw %}
{% endhighlight %}
I added a group of tags for statistics the posts count of every year and afforded the navigation to the the posts group.
So the first loop will calculate the post count of every year and return two arrays. One is for recording the year index and the other gets the count of the year. With these two arrays, I can add the tags in front of the lists grouped by years. 

The second loop uses the{% raw %} `{% capture %}` {% endraw %}tag to get the year of each post and the one that follows it before comparing them. If they're different, the year is inserted before a link to the post while if they're the same, the post is simply added to the list for that year. 

## Archive by category
Jekyll provides variable on the front matter for user grouping the posts by category or tags.

The variable `site.categories.CATEGORY` and `site.tags.TAG` return the list of all posts in category CATEGORY or tag TAG. What we do is reading the categories field of each article in the post directory and listing the articles under each category.

I used category attribute to group my posts so I took `site.categories.CATEGORY` as a example for interpretation.

`site.categories` returns a array of object. Every object of this array contains a CATEGORY name in your front matter and all the posts belong to this CATEGORY. For every element, the index[0] stores the CATEGORY name and index[1] is a list or array we can also consider as which is a collection of posts that is attached to this CATEGORY. 

So the method is simple, we can loop the index[1] of every CATEGORY to get every post and group them by index[0], that is the name of CATEGORY.

Use below code, I grouped the posts by the CATEGORY of theirs. Similar to archive by date, I added the tags for every CATEGORY to statistic the count of them and navigation.
{% highlight liquid %}
{% raw %} 
{% comment %}calculate the post count for each category{% endcomment %}
{% assign count = "" %}
{% assign counts = "" %}
{% for tag in site.categories reversed %}
  {% for post in tag[1] %}
	{% assign count = count | plus: 1 %}
  {% endfor %}
  {% assign counts = counts | append: count | append: ', ' %}
  {% assign count = "" %}
{% endfor %}

{% comment %}show navigation label here{% endcomment %}
<div class="archive-label-meta" style ="margin-top:25px">
{% assign i = 0 %}
{% assign counts = counts | split: ', ' %}
{% for tag in site.categories reversed  %}
<ul class="post-categories">       
     <a href="#{{tag[0]}}" style = "font-family: Raleway,Arial,sans-
      serif; font-size:14px">{{ tag[0] }} ( {{counts[i]}} )</a>
</ul>
{% assign i = i | plus: 1 %}
{% endfor %}
</div>

{% comment %}list post link for each category{% endcomment %}
{% for tag in site.categories reversed %}
<div>
<h3 id = "{{tag[0]}}" class="archive-title">{{tag[0]}}</h3>
{% for post in tag[1] %}
{%- assign date_format = site.minimal.date_format | default: "%b %-d, %Y" -%}
    <div class="category-meta" style="margin-left:15px; line-height: 16px">
      <a class="post-link" href="{{ post.url | relative_url }}">
		<h2 class="archive-link" >&bull; {{ post.title | escape }}</h2>
      </a>
        <div class="post-date">
          <span class="icon-calendar" style = "font-size:16px">
            {{ post.date | date: date_format }}</span>
		</div>
    </div>
{% endfor %}
</div>
{% endfor %}
{% endraw %}
{% endhighlight %}

The last work is to create archive.html and category.html files to well organize the codes and display with desired layout, add a hyperlink to the HTML files on the website homepage.

That's about it! Hopefully this is a useful reference for anyone that's looking to make their Jekyll archives a bit more accessible. The code is in my [github repository](https://github.com/gangdong/daviddong.github.io), if you are interesting, you can fork it. :grinning: