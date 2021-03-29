---
layout: default
title: About
permalink: /about
---

{% include title.html %}

<div class ="post-container">
  <li class="posts-labelgroup" id="posts-labelgroup">
	<h1 id="posts-label">{{page.title}}</h1>
  </li> 

  <div class = "image-container">
  <img src="{{site.baseurl}}/assets/image/home-bg-o.jpg" />
  </div>

  {% include language-box.html %}

  <div class = "footer" style="margin-top:80px">Copyright © {{ site.time | date: "%Y" }} {{ site.title }}  |  <a href = "https://github.com/gangdong/daviddong.github.io"> Github Project </a> powered by Jekyll</div>
  <br>
</div>
  
