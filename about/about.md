---
layout: default
title: About
permalink: /about
---

{% include title.html %}

<div class ="post-container">
  <h1 id="posts-label">{{page.title}}</h1>   
  <div class = "about-page"> Hello! My name is David Dong and this is my website.<br><br>

  I live and work on the Peking city of China :cn: . Here I write about what ever is on my mind, which tends to be related to designing and programming, since that’s what I do and I really enjoy helping people discover new skills and ideas.<br><br>
  
  Outside of work, my main interest is travel. I love to explore all kinds of landscape and experience different custom around the world. I had some interesting stories about my travel and :camera: some beautiful photos, which has been collected into my <a href = "https://rainbow-ux.github.io/traveler-blog.github.io/">Album</a>.<br><br>

  If you're interested in contacting me, feel free to send an <a href = "mailto:dqdongg@hotmail.com"> Email</a> to me. You can also find me on <a href = "https://www.linkedin.com/in/刚-董-25208ba0/">Linkin</a> or <a href = "https://github.com/gangdong">Github</a>, which I check often as well.</div>
  <br>
  <h1 id="posts-label-chinese">关于我</h1>
  <div class = "about-page">
  Hi, 我是董刚，一名软件行业从业者。长居于帝都，混迹于半导体圈，致力于为中国伟大的半导体事业添砖加瓦。:smile: <br><br>
  <font color="#FF0000">我喜欢折腾新事物，热爱编程，也热爱旅游。</font> <br><br>
  这个博客浓缩了我工作中的点滴积累，通过博客，我可以记录下自己的生活和成长的轨迹。更重要的是可以将这些知识分享给更多的人，同时也能够激励我不断的学习和提高。<br><br>

  工作之外，我最大的爱好是旅游，<font color="#436EEE" face="Verdana"><i><strong>“行千里路，阅尽世间风土人情，方能真正的理解这个世界，认清自我”</strong></i></font>，一些路途中发生的有趣故事和精彩的照片我全部都收录在<a href = "https://rainbow-ux.github.io/traveler-blog.github.io/">「我的相册」</a>中。<br><br>

  相遇即是缘分，如果你恰好看到这个博客，如果你有兴趣与我建立联系，可以通过以下方式：<br>
  <br>
  <strong>▪ Github:</strong> <a href = "https://github.com/gangdong">@daviddong</a><br>
  <strong>▪ Email:</strong>  <a href = "mailto:dqdongg@hotmail.com"> @daviddong</a><br>
  <strong>▪ LinkedIn:</strong> <a href = "https://www.linkedin.com/in/刚-董-25208ba0/">@davidong</a>
  </div>
  <br>
  <h1 id="posts-label-chinese">关于本站</h1>
  <div class = "about-page">
  这个博客通过 <a href = "https://jekyllrb.com/">Jekyll</a> 生成，部署在 <a href = "https://pages.github.com/">Github</a>，基于 <a href = "https://github.com/gangdong/jekyll-theme-rawposts">rawposts</a> 主题。<br><br>
  
  本博客的源码托管在 Github 上，欢迎 <a href = "https://github.com/gangdong/daviddong.github.io">fork</a> 并提出改进意见。
  </div>

  {%- if site.rawposts.gittalk -%}
  <!-- Gitalk start  -->
  <!-- Link Gitalk support file  -->
  <section class="gitalk">
  <div id="gitalk_thread"></div>
  <link rel="stylesheet" href="https://unpkg.com/gitalk/dist/gitalk.css">
  <script src="https://unpkg.com/gitalk/dist/gitalk.min.js"></script>
  <div id="gitalk-container"></div>
  <script type="text/javascript">
   var gitalk = new Gitalk({
   // gitalk parameters
   clientID: '5e24fc307693a6df3bc5',
   clientSecret: '28c9c17e1174c705c42e9bdc92f87cadcc4ec8b8',
   repo: 'daviddong.github.io',
   owner: 'gangdong',
   admin: ['gangdong'],
   id: '{{page.url}}',
   title: 'comments'
    });
   gitalk.render('gitalk-container');
  </script>
  </section>
  <!-- Gitalk end -->
  <br/><br/><br/>
  {%- endif -%}
  {%- if site.rawposts.gittalk -%}
  <div class = "footer">Copyright © {{ site.time | date: "%Y" }} {{ site.title }}  |  <a href = "https://github.com/gangdong/daviddong.github.io"> Github Project </a> powered by Jekyll</div>
  {% else %}
  <div class = "footer" style="margin-top:50px">Copyright © {{ site.time | date: "%Y" }} {{ site.title }}  |  <a href = "https://github.com/gangdong/daviddong.github.io"> Github Project </a> powered by Jekyll</div>
  {% endif %}
</div>
  
