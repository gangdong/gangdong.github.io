---
layout: post
title:  "Archive in Jekyll"
date:   2018-06-30 15:44:56 +0800
categories: Web
---
After setting up the pagination, the next thing I wanted to add to my blog was a 'proper' archive by both date and category rather than just the reverse chronological list of posts. Although this wasn't as straightforward as setting up pagination, a bit of searching turned up some sites that helped me get everything running.

### Archive by date
Because a list of posts in reverse chronological order can be readily accessed in Jekyll through site.posts, all that's needed is to use some clever Liquid markup to process it. 
I used below code to group my archives by year.

```html
{% raw %}
<div class ="archive">	
{% for post in site.posts %}
    {% capture year %}{{ post.date | date: '%Y' }}{% endcapture %}
    {% capture nyear %}{{ post.next.date | date: '%Y' }}{% endcapture %}
        {% if year != nyear %}
            {% if forloop.index != 1 %}</ul>{% endif %}
            <h3 class="archive-title">{{ post.date | date: '%B %Y' }}</h3><ul>
        {% endif %}
	 <div class="post-date"><i class="icon-calendar"></i>{{ post.date | date: "%e %B %Y" }}</div>
     <a class="post-link" href="{{ post.url | relative_url }}">
     <h2 class="archive-link">{{ post.title | escape }}</h2>
     </a>
{% endfor %}
</div>

{% endraw %}


```

The above code uses the{% raw %} {% capture %} {% endraw %}tag to get the year of each post and the one that follows it before comparing them. If they're different, the year is inserted before a link to the post while if they're the same, the post is simply added to the list for that year. 

### Archive by category
Jekyll provides variable on the front matter for user grouping the posts by category or tags.

The variable "site.categories.CATEGORY" and "site.tags.TAG" return the list of all posts in category CATEGORY or tag TAG. What we do is reading the categories field of each article in the post directory and listing the articles under each category.

Use below code, I list all links of article belong to the "Android" category. 
```html
<div>
<h3 class="archive-title">Android</h3><ul>
{% for post in site.categories.Android %}
{%- assign date_format = site.minimal.date_format | default: "%b %-d, %Y" -%}
    <div class="category-meta">
      <a class="post-link" href="{{ post.url | relative_url }}">
		<h2 class="archive-link" >{{ post.title | escape }}</h2>
      </a>
        <div class="post-date">
          <span class="icon-calendar" style = "font-size:90%">
            {{ post.date | date: date_format }}</span>
		</div>
    </div>
{% endfor %}
</div>
```
The last work is to create a category.html file to display the category name and the links with your desired layout, add a hyperlink to the category.html on your homepage.  

That's about it! Hopefully this is a useful reference for anyone that's looking to make their Jekyll archives a bit more accessible.