---
layout: post
title:  Getting started with Jekyll (2)
date:   2018-04-13 23:21:15 +0800
categories: Blog
tags: Blog
published: true
toc: true
sidebar: true
---
This page will continue to give a brief introduction of the Jekyll grammar. 

After reading [last article]({{site.baseurl}}/blog/2018/03/27/Web-jekyll-installation.html) you should complete the installation of Jekyll and download a Jekyll theme on your computer. 

Let's start this article from the source code of the theme you downloaded. 

{% include toc.html %}

## Jekyll directory structure
Unzip the package you downloaded and check the directory structure. The Jekyll directory structure mainly includes the following directories.

![directory]({{site.cdn_baseurl}}/assets/image/web-jekyll-2-directory.png)

The description of each folder.

![directory]({{site.cdn_baseurl}}/assets/image/web-jekyll-2-directory-description.png)

Every file or directory beginning with the following characters: ., _ , # or ~ in the source directory will not be included in the destination folder. Such paths will have to be explicitly specified via the config file in the include directive to make sure they’re copied over.

## Liquid
Jekyll uses the Liquid templating language to process templates.
Generally in Liquid, you output content using two curly braces and perform logic statements by surrounding them in a curly brace percentage sign. 

To learn more about Liquid, check out the [official Liquid Documentation](https://shopify.github.io/liquid/).

## Variables

Jekyll traverses your site looking for files to process. Any files with front matter are subject to processing. For each of these files, Jekyll makes a variety of data available via Liquid. The following is a reference to the available data.

### global variables
![directory]({{site.cdn_baseurl}}/assets/image/web-jekyll-2-variables-global.png)

### site variables
![directory]({{site.cdn_baseurl}}/assets/image/web-jekyll-2-variables-site.png)

### page variables
![directory]({{site.cdn_baseurl}}/assets/image/web-jekyll-2-variables-page.png)

### paginator variables
![directory]({{site.cdn_baseurl}}/assets/image/web-jekyll-2-variables-paginator.png)

above is the description from the official docs. talk is always easy, next I will write some code to demonstrate the usage. 
below shows the variables value of my blog.
{% highlight console %}
This page's title is {{page.title}}
This page's name is {{page.name}}
This page's url is {{page.url}}
This page's id is {{page.id}}
This page's date is {{page.date}}
This page's categories is {{page.categories}}
This page's collection is {{page.collection}}
This page's tags is {{page.tags}}
This page's dir is {{page.dir}}
This page's path is {{page.path}}
This site's url is {{site.url}}
{% endhighlight %}

### Jekyll command
Jekyll has below commands

`Jekyll new PATH:` Create a new site in the specified directory using the gem-based default theme. <br>
`Jekyll new PATH --blank:`Create a new blank site in the specified directory.<br>
`Jekyll build or Jekyll b:`Perform a build and output the generated site to the. / site (default) directory.<br>
`Jekyll serve or Jekyll s:`Build site and provide local access service when source file changes.<br>
`Jekyll doctor:`Output any deprecated features or configuration issues.<br>
`Jekyll clean:`Delete all generated files: destination folder, metadata file, sass, and Jekyll caches.<br>
`Jekyll help:`Display help information or display help information for specific subcommands, such as Jekyll help build.<br>
`Jekyll new-theme:`Creates a new Jekyll theme scaffold.<br>

above contents are not include all of Jekyll's grammar, there are some other parts, such as 
+ Jekyll configuration
+ Includes
+ Layouts
+ Permalinks
+ Themes
+ Pagination 

Due to the blog's length limitation, I cannot list all of the contents, if you are interested in the other part, please find more details at the below website [Jekyll Tutorial](https://jekyll.zcopy.site/docs/).