---
layout: post
title:  "Gitalk Usage"
date:   2018-05-12 12:22:01 +0800
categories: Blog
tags: Blog
Published: true
toc: false
sidebar: true
about: true
author: david.dong
description: This article introduced how to use Gitalk on the blog, it is useful to someone who wants to add a comment function into the blog.
keywords: Gitalk/
---
If you are looking for a quick solution about how to add a comment function on your blog, this article probably can help you.

I have been trying to add a comment function under my blog for the past few days. My blog was built on Github by Jekyll, Jekyll is just a tool for generating static web pages, and does not provide database support, which means, I need help with the third-party software tool. <br>

Of course, `disqus` is the first choice that you can think out however it is not a good option for china users for some known reasons. After reviewed some popular third-party tools, I decided to use `Gitalk` to construct my comment function.

Remember *Github is all-powerful, you can find everything on it*. I found Gitalk on Github. Gitalk is a comment component based on the Github issue and preact. Actually, it is a Github project, designed for Github users and easy to be applied on the Github pages. Gitalk stores the comments into your repository issues and doesn't need any extra database.<br>

The official Github page link of Gitalk is [Here](https://Github.com/gitalk/gitalk#install). <br>

It is amazingly easy to use and no need for database support in the background. Moreover, it can support multiple languages includes Chinese.

The installation is simple, just need to refer to the below procedure.

1. Register a Github application, as a Github application you need to get authorization before using it. The path to open the OAuth Apps page is 
    + Github homepage->Settings->Developer Settings->OAuth Apps.<br>    
2.  <br>

![oAuth Apps]({{site.cdn_baseurl}}/assets/image/others-gitalk-oauth-apps.png){: .center-image }


You must specify the website domain URL in the Authorization callback URL field.
After registration, you will get a `Client ID` and `Client Secret`, remember these two numbers, you will need to fill them in the following step.    

![oAuth Apps]({{site.cdn_baseurl}}/assets/image/others-gitalk-oauth-apps-clientID.png){: .center-image }


Please note, the user number is zero at this moment when you haven't authenticated the application. You need to do it later.
Now you have registered Github application for Gitalk. <br>

Next, copy the below code snippet into the page where you want to use Gitalk or add it to the post's page, it depends on your website's structure. <br>

![code]({{site.cdn_baseurl}}/assets/image/others-gitalk-code.png){: .center-image }

Below are the setting options.<br>

----------
+ `clientID` - Github Application Client ID. <br/>
   **type:** String. <br/>
	**Required.** <br/>
+ `clientSecret` -  Github Application Client Secret.<br/>
	**type:** String <br/>
	**Required.** <br/>
+ `repo` - Github repository. <br/>
   **type:** String <br/>
	**Required.** <br/>
+ `owner` - Github repository owner. Can be personal user or organization.<br>
   **type:** String <br/>
	**Required.** <br/>   
+ `admin` - Github repository owner and collaborators. (Users who having write access to this repository)<br/>
   **type:** Array <br/>
    **Required.** <br/> 
+ `id` - The unique id of the page. Length must `less than 50`.      
  **type:** String <br/>
  **Default:** location.href.<br/>
+ `number` - The issue ID of the page, if the number attribute is not defined, issue will be located using id.<br/>
  **type:** Number <br/>
  **Default:** -1. <br/>
+ `labels` - Github issue labels. Array<br/>
  **type:** Array <br/>
  **Default:** ['Gitalk'].<br/>
+ `title` - Github issue title.<br/>
  **type:** String <br/>
  **Default:** document.title.<br/>
+ `body` - Github issue body. <br/>
  **type:** String <br/>
  **Default:** location.href + header.meta[description].<br/>
+ `language` - Localization language key, en, zh-CN and zh-TW are currently available.<br/>
  **type:** String <br/>
  **Default:** navigator.language || navigator.userLanguage.<br/>
+ `perPage` - Pagination size, with maximum 100.<br/>
  **type:** Number <br/>
  **Default:** 10. <br/>
+ `distractionFreeMode` - Facebook-like distraction free mode. Boolean<br/>
  **type:** Boolean <br/>
  **Default:** false.<br/>
+ `pagerDirection` - Comment sorting direction, available values are last and first.<br/>
  **type:** String <br/>
  **Default:** 'last' <br/>
+ `createIssueManually` - By default, Gitalk will create a corresponding Github issue for your every single page automatically when the logined user is belong to the admin users. You can create it manually by setting this option to true.<br/>
  **type:** Boolean <br/>
  **Default:** false.<br/>
+ `proxy` - Github oauth request reverse proxy for CORS. Why need this? <br/>
  **type:** String <br/>
  **Default:** [https://cors-anywhere.herokuapp.com/](https://cors-anywhere.herokuapp.com/) [https://github.com/login/oauth/access_token](https://Github.com/login/oauth/access_token).<br/>
+ `flipMoveOptions` - Comment list animation. [Reference](https://github.com/joshwcomeau/react-flip-move/blob/master/documentation/enter_leave_animations.md)<br/>
  **type:** Object<br/>
  **Default:**
{% highlight ruby %}
{
      staggerDelayBy: 150,
      appearAnimation: 'accordionVertical',
      enterAnimation: 'accordionVertical',
      leaveAnimation: 'accordionVertical',
}
{% endhighlight %}
+ `enableHotKey` - Enable hot key (cmd|ctrl + enter) submit comment. <br/>
  **type:** Boolean <br/>
  **Default:** true.<br/>

Since Gitalk uses the repository issues to store the comments, so don't forget to enable your repository issue function.

<div class = "post-note info">
  <div class = "header"></div>
  <div class = "body">
    <p>The default setting is <span>enabled</span>.
    </p>
  </div>
</div>

For now, the Gitalk comment component has been added into your website successfully.<br>
The appearance is like this.<br>

![effect]({{site.cdn_baseurl}}/assets/image/others-gitalk-effect.png)

When first loading, you will be requested to sign in your Github account to active the comment function.<br>

![firstload]({{site.cdn_baseurl}}/assets/image/others-gitalk-first-loading.png){: .center-image }<br>

Active it then you can use it now!<br>
If you like this page or you have anything would like to share, comment below! 🙂 <br>