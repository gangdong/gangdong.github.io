---
layout: post
title:  "Gitalk Usage"
date:   2019-05-12 12:22:01 +0800
categories: Others
---
I has been trying to add comment function under my personal website during the past few days. My personal website was built on the github by jekyII, Jekyll is just a tool for generating static web pages, and does not need database support which means,  I need the help with the third-party software tool. <br>
Of course, disqus is the first candidate that you can think about however it is not a good option for china users as some known reason. After searched some popular third-party tools, I decided to use gitalk to construct the comment function.

Remember "Github is all-powerful, you can find everything on it". I found Gitalk on the Github. Gitalk is a comment component based on Github issue and preact. Actually it is a github project, designed for serving the github users and easy to be applied on the github pages. Gitalk stores the comments into your repositories issues and doesn't need any extra database.<br>

The official web page link of Gitalk is [Gitalk](https://github.com/gitalk/gitalk#install) <br>

It is amazing easy to use and no need the database support in background. Moreover it can support multiple languages includes Chinese among them.

The installation is simple, just refer to below procedure.

1. register a github application,as a GitHub application you need to get an authorization before use it. The path to open OAuth Apps page is github homepage->Settings->Developer Settings->OAuth Apps.<br> 
![oAuth Apps](https://gangdong.github.io/daviddong.github.io/assets/image/others-gitalk-oauth-apps.png)
You must specify the website domain url in the Authorization callback URL field.
After registration, you will get a 'Client ID' and 'Client Secret', remember these two numbers, you will need to fill them in the following step.
![oAuth Apps](https://gangdong.github.io/daviddong.github.io/assets/image/others-gitalk-oauth-apps-clientID.png)
Please note, the user number is zero at this moment in where you haven't authenticate the application. You need to do it later.
Now you have registered github application for Gitalk. <br>
2. Next,copy below code into the page where you want to use Gitalk or add it into the posts page, it depends on your website's structure. <br>
![code](https://gangdong.github.io/daviddong.github.io/assets/image/others-gitalk-code.png)
Below are the setting options.<br>
----------
+ **clientID** String<br>
*Required. GitHub Application Client ID.*
+ **clientSecret** String<br>
*Required. GitHub Application Client Secret.*
+ **repo** String<br>
*Required. GitHub repository.*
+ **owner** String<br>
*Required. GitHub repository owner. Can be personal user or organization.*
+ **admin** Array<br>
*Required. GitHub repository owner and collaborators. (Users who having write access to this repository)*
+ **id** String<br>
*Default: location.href.The unique id of the page. Length must less than 50.*
+ **number** Number<br>
*Default: -1.
The issue ID of the page, if the number attribute is not defined, issue will be located using id.*
+ **labels** Array<br>
*Default: ['Gitalk'].
GitHub issue labels.*
+ **title** String<br>
*Default: document.title.GitHub issue title.*
+ **body** String<br>
*Default: location.href + header.meta[description].GitHub issue body.*
+ **language** String<br>
*Default: navigator.language || navigator.userLanguage.
Localization language key, en, zh-CN and zh-TW are currently available.*
+ **perPage** Number<br>
*Default: 10.
Pagination size, with maximum 100.*
+ **distractionFreeMode** Boolean<br>
*Default: false.
Facebook-like distraction free mode.*
+ **pagerDirection** String<br>
*Default: 'last'
Comment sorting direction, available values are last and first.*
+ **createIssueManually** Boolean<br>
*Default: false.
By default, Gitalk will create a corresponding github issue for your every single page automatically when the logined user is belong to the admin users. You can create it manually by setting this option to true.*
+ **proxy** String<br>
*Default: [https://cors-anywhere.herokuapp.com/](https://cors-anywhere.herokuapp.com/) [https://github.com/login/oauth/access_token](https://github.com/login/oauth/access_token).
GitHub oauth request reverse proxy for CORS. Why need this?*
+ **flipMoveOptions** Object<br>
*Default:
```
{
    staggerDelayBy: 150,
    appearAnimation: 'accordionVertical',
    enterAnimation: 'accordionVertical',
    leaveAnimation: 'accordionVertical',
}
```
Comment list animation. [Reference](https://github.com/joshwcomeau/react-flip-move/blob/master/documentation/enter_leave_animations.md)*
+ **enableHotKey** Boolean<br>
*Default: true.
Enable hot key (cmd|ctrl + enter) submit comment.*<br><br>
Since the Gitalk uses the issues to store the comments, so don't forget to enable your repositories issue function (default is enable).<br>
For now, the Gitalk comment component has been added into your website successfully.<br>
The appearance is like this.<br>
![effect](https://gangdong.github.io/daviddong.github.io/assets/image/others-gitalk-effect.png)
When the first loading, you will be requested to sign in your github account to active the comment function. Active it then you can use it now!<br>
If you like this paragraph or you have anything would like to share, comment  at below! :) <br>

<!-- Gitalk 评论 start  -->
<!-- Link Gitalk 的支持文件  -->
<link rel="stylesheet" href="https://unpkg.com/gitalk/dist/gitalk.css">
<script src="https://unpkg.com/gitalk/dist/gitalk.min.js"></script>
<div id="gitalk-container"></div>
<script type="text/javascript">
   var gitalk = new Gitalk({

   // gitalk的主要参数
   clientID: '5e24fc307693a6df3bc5',
   clientSecret: '28c9c17e1174c705c42e9bdc92f87cadcc4ec8b8',
   repo: 'daviddong.github.io',
   owner: 'gangdong',
   admin: ['gangdong'],
   id: 'others/2019/05/12/Others-gitalk.html',
   title: 'comments'
    });
   gitalk.render('gitalk-container');
</script>
<!-- Gitalk end -->

<br><br><br>

<font size="2" color="#aaa">作者：David Dong<br></font>
<font size="2" color="#aaa">来源：https://gangdong.github.io/daviddong.github.io/others/2019/05/12/Others-gitalk.html</font>
<font size="2" color="#aaa">转载请注明出处。</font>
<span id="busuanzi_container_page_pv" ></span><font size="2" color="#aaa">
本文总阅读量</font><font size="2" color="#aaa"><span id="busuanzi_value_page_pv"></font></span><font size="2" color="#aaa">次</font>