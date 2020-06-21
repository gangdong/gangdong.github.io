---
layout: post
title:  "Pagination in Jekyll"
date:   2018-06-28 19:43:17 +0800
categories: Web
---
If you don't have pagination for your personal blog and you want to do it, this page is probably helpful to you.

My personal blog is constructed by Jekyll, so I will only write down how to paginate the blog that powered by Jekyll. Actually below part are some experiences when I paginated my blog. 

When you have a long post list, to break them into smaller lists and display them over multiple pages will become a common requirements. 
Fortunately, Jekyll offers a pagination plugin, which can automatically generate the appropriate files and folders you need for paginated listings.

### STEPS
#### Installation plugin
Add the **jekyll-paginate** into your website's Gemfile and declare it at your configuration file `_config.yml` under plugins.
like below Gemfile.

```ruby
gemspec
group :jekyll_plugins do
    gem 'jekyll-feed'
    gem 'jekyll-sitemap'
    gem 'jekyll-paginate'
end
```

#### Enable pagination
Add a line to the `_config.yml` file that specifies how many items should be displayed per page:
```ruby
paginate: 12
```
The number should be the maximum number of Posts you’d like to be displayed per-page in the generated site.

Because Jekyll can only support pagination for HTML file so far, does not work from within Markdown files from your Jekyll site. Pagination works when called from the HTML file, named `index.html`, which optionally may reside in and produce pagination from within a subdirectory, via the paginate_path configuration value. <br>
You can specify the destination of the pagination pages:
```ruby
paginate_path: "/blog/page:num/"
```
Jekyll will search the /blog/ directory and read in `blog/index.html`, send it each pagination page and write the output to `blog/page:num/`, where `:num` is the pagination page number, starting with 2. For example, if you output 3 pages, if you look at the _site directory, you will find a /blog folder with two subfolders /page2 and /page3 in it. Each folder has a `index.html` file, which contains the contents that need to be displayed.

**Note:** because the pages starts with 2, which means no page1 exists. That will require a special handling for the first page when rendering the pages. Actually the page1 contents is displayed on the `index.html` of /blog directory. 

For me, I tried to set the path as below, but failed to load the `index.html`. After I change to `/blog/page:num`, it started to work. Who can tell what the reason is here?
```ruby
paginate_path: "/page:num/" 
```
#### Attributes
The pagination plugin exposes the paginator liquid object. <br>
You can find the attributes in my another blog [Getting started with Jekyll (2)]({{site.baseurl}}/web/2018/04/13/Web-jekyll-grammar.html)

#### Render the pages
You have enabled the pagination so far, next thing is to display your posts in a list using the paginator variable that will now be available to you.
Below code is an example from my blog's `pagination.html` file. This pieces of code render a list of each page with links to all but the current page.
```markdown
{% raw %}
<!-- Pagination links -->
{% if paginator.total_pages > 1 %}
<div class="pagination">
  {% if paginator.previous_page %}
    <a href="{{ paginator.previous_page_path | prepend: site.baseurl | replace: '//', '/' }}">&laquo; Prev</a>
  {% else %}
    <span>&laquo; Prev</span>
  {% endif %}

  {% for page in (1..paginator.total_pages) %}
    {% if page == paginator.page %}
      <span class="active">{{ page }}</span>
    {% elsif page == 1 %}
      <a href="{{ '/blog/index.html' | prepend: site.baseurl | replace: '//', '/' }}">{{ page }}</a>
    {% else %}
      <a href="{{ site.paginate_path | prepend: site.baseurl | replace: '//', '/' | replace: ':num', page }}">{{ page }}</a>
    {% endif %}
{% endfor %}
  
  {% if paginator.next_page %}
    <a href="{{ paginator.next_page_path | prepend: site.baseurl | replace: '//', '/' }}">Next &raquo;</a>
  {% else %}
    <span>Next &raquo;</span>
  {% endif %}
</div>
{% endif %}
{% endraw %}
```
Besides, you still need to change your `page.html` or `home.html` where displays the every pages. <br>
I removed these code to `/blog/index.html` from `page.html` and chage the loop from site.posts to paginator.posts.<br>
Below code loops through the paginated posts.
```html
{% raw %}
{%- for post in paginator.posts -%}
      <li>
        {%- assign date_format = site.minimal.date_format | default: "%b %-d, %Y" -%}
        <a class="post-link" href="{{ post.url | relative_url }}">
          <h2 class="post-title">{{ post.title | escape }}</h2>
        </a>
        <div class="post-meta">
          <ul class="post-categories">
            {%- for tag in post.categories -%}
              <li>{{ tag }}</li>
            {%- endfor -%}
          </ul>
          <div class="post-date">
            <i class="icon-calendar"></i>
            {{ post.date | date: date_format }}</div>
        </div>
        <div class="post">
          {%- if site.show_excerpts -%}
            {{ post.excerpt }}
          {%- endif -%}
        </div>
		<footer>
          <a class="post-link" href="{{ post.url | relative_url }}">
          <h5 class="morebox">Read More...</h5>
        </a>
        </footer>
      </li>
    {%- endfor -%}
{% endraw %}
```
#### About others
Currently jekyll-paginate plugin doesn't allow paging over groups of posts linked by a common tag or category. 
The more recent [jekyll-paginate-v2](https://github.com/sverrirs/jekyll-paginate-v2) plugin can support the pagination for categories, tags and collections. See the pagination examples in the repository.<br> **This plugin is not supported by GitHub Pages. I haven't tried it!** :worried: