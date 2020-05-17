---
layout: post
title:  "Gitalk Usage"
date:   2018-05-12 12:22:01 +0800
categories: Web
---
If you are looking for a quick solution about how to add comment function on your personal blog, this article probably can help you.

I has been trying to add comment function under my personal blogs during the past few days. My personal blog was built on the Github by Jekyll, Jekyll is just a tool for generating static web pages, and does not provide database support, which means, I need the help with the third-party software tool. <br>

Of course, disqus is the first choice that you can think out however it is not a good option for china users as some known reasons. After reviewed some popular third-party tools, I decided to use Gitalk to construct my comment function.

Remember "Github is all-powerful, you can find everything on it". I found Gitalk on the Github. Gitalk is a comment component based on Github issue and preact. Actually it is a Github project, designed for Github users and easy to be applied on the Github pages. Gitalk stores the comments into your repository issues and doesn't need any extra database.<br>

The official Github page link of Gitalk is [Here](https://Github.com/gitalk/gitalk#install) <br>

It is amazing easy to use and no need the database support in background. Moreover it can support multiple languages includes Chinese among them.

The installation is simple, just need to refer below procedure.

1. Register a Github application,as a Github application you need to get an authorization before use it. The path to open OAuth Apps page is Github homepage->Settings->Developer Settings->OAuth Apps.<br> 
![oAuth Apps]({{site.baseurl}}/assets/image/others-gitalk-oauth-apps.png)
You must specify the website domain url in the Authorization callback URL field.
After registration, you will get a 'Client ID' and 'Client Secret', remember these two numbers, you will need to fill them in the following step.
![oAuth Apps]({{site.baseurl}}/assets/image/others-gitalk-oauth-apps-clientID.png)
Please note, the user number is zero at this moment when you haven't authenticated the application. You need to do it later.
Now you have registered Github application for Gitalk. <br>

2. Next,copy below code into the page where you want to use Gitalk or add it into the posts page, it depends on your website's structure. <br>
![code]({{site.baseurl}}/assets/image/others-gitalk-code.png)
Below are the setting options.<br>
----------
+ **clientID** String<br>
*Required. Github Application Client ID.*
+ **clientSecret** String<br>
*Required. Github Application Client Secret.*
+ **repo** String<br>
*Required. Github repository.*
+ **owner** String<br>
*Required. Github repository owner. Can be personal user or organization.*
+ **admin** Array<br>
*Required. Github repository owner and collaborators. (Users who having write access to this repository)*
+ **id** String<br>
*Default: location.href.The unique id of the page. Length must less than 50.*
+ **number** Number<br>
*Default: -1.
The issue ID of the page, if the number attribute is not defined, issue will be located using id.*
+ **labels** Array<br>
*Default: ['Gitalk'].
Github issue labels.*
+ **title** String<br>
*Default: document.title.Github issue title.*
+ **body** String<br>
*Default: location.href + header.meta[description].Github issue body.*
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
By default, Gitalk will create a corresponding Github issue for your every single page automatically when the logined user is belong to the admin users. You can create it manually by setting this option to true.*
+ **proxy** String<br>
*Default: [https://cors-anywhere.herokuapp.com/](https://cors-anywhere.herokuapp.com/) [https://github.com/login/oauth/access_token](https://Github.com/login/oauth/access_token).
Github oauth request reverse proxy for CORS. Why need this?*
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
Since the Gitalk uses the repository issues to store the comments, so don't forget to enable your repository issue function (default is enable).<br>

For now, the Gitalk comment component has been added into your website successfully.<br>
The appearance is like this.<br>
![effect]({{site.baseurl}}/assets/image/others-gitalk-effect.png)
When first loading, you will be requested to sign in your Github account to active the comment function.<br>
![firstload]({{site.baseurl}}/assets/image/others-gitalk-first-loading.png)
<br>
Active it then you can use it now!<br>
If you like this page or you have anything would like to share, comment  at below! :) <br>