---
layout: post
title:  "A way to fix .gitignore doesn't work"
date:   2015-06-06 21:41:29 +0800
categories: Github 
tags: Github
published: true
toc: false
sidebar: true
about: true
author: david.dong
description: This article addressed the issue that gitignore doesn't work and give the solution.
keywords: gitignore/
---
You may have run into situations where `.gitignore` doesn't work.😕    
During the project development, you want to add some directors or files into the ignore rule and you specified them at the `.gitignore`. You committed and checked the status, unfortunately, you found they were still being tracked. 

That is because the `.gitignore` can only ignore those files that were not originally tracked. If some files have been submitted before and have been included in version management, modifying `.gitignore` is invalid. The solution is to delete the local cache (change it to untrack) and resubmit `.gitignore` file.

The git command is like this.
{% highlight ruby %}
git rm -r --cached .
git add .
git commit -m "refresh .gitnore"
git push -u origin master
{% endhighlight %}
In short, `.gitignore` just ignores files that are not staged (cached).
For the files that have been staged, when adding `.gitignore`, they must be removed from the staged before they can be ignored.