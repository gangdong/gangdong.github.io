---
layout: post
title:  "Use Travis CI to build and deploy project automatically on Github"
date:   2021-04-01 13:02:34 +0800
categories: Blog Github
tags: Blog Github
Published: true
toc: true
sidebar: true
about: true
author: david.dong
description: This article is about Travis CI. <br><br>Travis CI is a Continuous Integration (CI) tool that can help you build, test and deploy your software project automatically. <br><br>This article will introduce how to use Travis CI.
keywords: Travis CI/Github
---
This article will introduce how to use Travis CI to build, test and deploy Github project automatically. I will take my personal blog project on Github as an example to explain.

{% include toc.html %}

## Why do I use Travis CI ?

If you've looked at my previous article, you may know my blog was deployed on Github Pages and was built by Jekyll static site generator.

Github Pages are a great approach to build websites. Using a Github repository and with the Jekyll static site generator we can build a static websites easily. It is suitable for building personal blog.

Although Github Pages can automatically generate a website from a repository containing a Jekyll project (*you just need to commit your source code to Github repo and don't pay any effort on the building and deployment. Github Pages will do it for you!*), it has some limitations.     
One of them is 

+ *we can't use jekyll plugins*

I need to use plugins to extend the function of my website, e.g. for implementation of toc and markdown function enrichment.

It is understandable that Github Pages doesn't allow the plugin for security reasons (*it uses the Jekyll `--safe` flag*). The workaround is to generate the site locally and then to push the generated HTML to Github (*I've interpreted how to do in my previous [article]({{site.baseurl}}/blog/github/2021/03/14/Blog-Jekyll-toc-plugin.html)*). However, I usually use the different branch for source code and output static HTMLs. The `dev` branch accommodates the source code and `gh-pages` branch, which is as a window of website visiting, stores the static website files.

So my current workflow is 

+ modify the source code at dev branch and use jekyll build locally.
+ commit the change to dev branch.
+ copy the output static website files which is in `_site` folder to \tmp folder.
+ switch to local gh-pages branch.
+ add copied static website file in `_site` folder to gh_pages branch.
+ git add & commit.
+ push to remote gh-pages branch.

or I can push the files in `_site` to remote gh-pages branch forcely from dev branch although it is not a ideal way of routine operation.

You see it! ☹️ Really tedious, isn't it? 

I think it is a poor efficiency and should be improved. 

The main motivation for me is to be able to get a tool that help me do above works automatically. What I want to do is just committing the code to remote dev branch (*this is the necessary work*) and others leave to tool. 

The basic idea is to use the [Travis CI continuous integration (CI)](https://docs.travis-ci.com/user/for-beginners/) service. The function of Travis CI service fully meets my expectation. And the most important point is that it is *FREE* for open source project in Github. 

## Prerequisites 
To start using Travis CI, make sure you have:

+ Github account 
+ Adding authentication methods to your Github account. You can do it by creating a personal access token (PATs) or connecting to GitHub with SSH Key. If you don't know how to do, please refer to   
 
	+ [Creating a personal access token (PATs)](https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token)    
	+ [Connecting to GitHub with SSH](https://docs.github.com/en/github/authenticating-to-github/connecting-to-github-with-ssh)    
	<br>
+ Travis CI account and [sign up](https://docs.travis-ci.com/user/migrate/open-source-on-travis-ci-com/), you can use your Github account ID to login directly.
+ Authorize the Travis CI (*you will be requested to do it when you sign in to Travis CI for the first time*), active your Github repositories that you want to use Travis CI service. Please refer to 

	+ [To get started with Travis CI using GitHub](https://docs.travis-ci.com/user/tutorial#travis-ci-github-oauth-app-access-rights)    
	<br>
+ One local git repository for your project. 

## Workflow

The workflow of Travis CI building and deployment is as follows:

+ git push to the Github repo triggers Travis CI
+ Travis CI starts up a virtual machine and installs all required software (*mostly Ruby gems*)
+ I use a custom rake task to tell travis CI how to build the Jekyll site and push the updated content back to Github
+ Travis CI clones a different branch (*either dev or master, depending on the kind of Github repo*) that holds the website's source code.
+ Travis CI runs jekyll build with the destination in the other branch (*gh-pages*)
+ Travis CI does a git push of the other branch (*gh-pages*)
+ Github Pages starts serving the updates site

Depending on the required software that needs to be installed, the whole process takes anywhere between 1 and 5 min and is fully automated.

### .travis.yml
Basically, Travis CI uses the .travis.yml file to describes the build process. Create a .travis.yml into your project's repo and edit it.

Don't forget commit it and push to the remote repo once you finished editing!

### Lifecycle
The whole job's life cycle can be divided into several phases.

The main phases are:

1. `install` - install any dependencies required
2. `script` - run the build script

You can complete a basic work with above minimal life cycle. Besides, Travis CI affords some phases that allow users to insert custom commands. 

To get to know the details and learn how to write `.travis.yml` file, please read 

+ [Travis CI Job Lifecycle](https://docs.travis-ci.com/user/job-lifecycle/).

### Sensitive Data

It is inevitable that Travis CI will use the sensitive data (*for example, SSH private key or Github personal access token*) to access the Github. Of course we cannot expose the data without any  protection. Travis CI provides [encryption scheme](https://docs.travis-ci.com/user/encryption-keys/) to protect your secret information.

Travis CI offers commands that is able to encrypt the private key or any files. You can also save your sensitive data to [environment variables](https://docs.travis-ci.com/user/environment-variables/), in where the data is invisible and can be accessed from any stage in your build process.

To my project, I've tried two methods as below:

+ use SSH scheme access Github with RSA key pairs
+ access with encrypted Github PATs (*personal access tokens*)

#### SSH

For SSH accessing, I assume you have create a SSH key pairs and it is workable for your Github. If you don't have, do it by following 

+ [Generating a new SSH key and adding it to the ssh-agent](https://docs.github.com/en/github/authenticating-to-github/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent#generating-a-new-ssh-key)

you can test the connection status by inputting command.
{% highlight shell %}
ssh -T git@github.com
{% endhighlight %}

If you get message like this, you are accessing the Github successfully.
{% highlight shell %}
"Hi [secure]/your repo name ! You have successfully authenticated, but GitHub does not provide shell access."
{% endhighlight %}

Then use below command that Travis CI provides to encrypt the private key. 
{% highlight shell %}
# Sign in travis-ci.com
travis login --com  --github-token "your github personal access keys (*PATs*)" 
# encrypt the SSH private key
travis encrypt-file "your private key" --add
{% endhighlight %}

Above commands sign in travis CI (*for applying the APIs*), encrypt the private key and generate a code snippet (*as below*) into your `.travis.yml` file to decrypt the private key during building process.

{% highlight shell %}
openssl aes-256-cbc -K $encrypted_70fbe34e406c_key -iv $encrypted_70fbe34e406c_iv -in blog_id_rsa.enc -out blog_id_rsa -d
{% endhighlight %}

then add your SSH private key to the ssh-agent.
{% highlight shell %}
# start the ssh-agent in the background
eval `ssh-agent -s`
ssh-add blog_id_rsa
{% endhighlight %}

After generated the encrypted key leave it into your repo and do not forget `REMOVE YOUR PRIVATE KEY` before you commit!

#### PATs

If using PATs, you should follow below steps:

+ acquire a PATs, refer to 

	+ [Creating a personal access token (PATs)](https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token)  
	
	remember to keep this token's value carefully since it is only visible for the first time generated.
+ encrypt the PATs by inputting command
{% highlight shell %}
travis encrypt -r <user name>/<repo name> GH_TOKEN= "value of PATs"
{% endhighlight %}

This will output a string looking something like:
{% highlight shell %}
secure: ".... encrypted data ...."
{% endhighlight %}

Now you can place it in the `.travis.yml` file.

You can also skip the above, and add it automatically by running:

{% highlight shell %}
travis encrypt -r <user name>/<repo name> GH_TOKEN=PAT --add
{% endhighlight %}

`GH_TOKEN` is the environment variable, which can be accessed in the `.travis.yml` file.

`GH_REF` environment variable can be set to "github.com/`user-name`/`repo-name`.git".

Please note that the name of the environment variable and its value are both encoded in the string produced by “travis encrypt.” You must add the entry to your `.travis.yml` with key `secure` (*underneath the `env` key*). This makes the environment variable `GH_TOKEN` with value of PATs available to your program.

Once you got the personal access token and encrypted, you can access the Github repo by below method:

{% highlight shell %}
https://${GH_TOKEN}@${GH_REF}" travis:gh-pages
{% endhighlight %}

With this method, you are able to avoid being request passphrase when accessing.

### Example
I attached my blog project's [.travis.yml](https://github.com/gangdong/daviddong.github.io/blob/master/.travis.yml) file here as an example.

{% highlight yml %}
language: ruby
rvm:
- 2.6.6
before_install:
# decrypt private key
- openssl aes-256-cbc -K $encrypted_70fbe34e406c_key -iv $encrypted_70fbe34e406c_iv -in blog_id_rsa.enc -out blog_id_rsa -d
# add permission 
- chmod 600 blog_id_rsa

# kick off ssh-agent
- eval "$(ssh-agent -s)"
- ssh-add blog_id_rsa
# remove
- rm blog_id_rsa
install: gem install jekyll

script:
- bundle install
- bundle exec jekyll build

#deploy:
#  provider: script
#  skip_cleanup: true
#  script: bash scripts/deploy.sh
#  on:
#    branch: dev
after_success:
# check the connection to host
- ssh -T git@github.com

# add user account
- git config user.name "${USER}"
- git config user.email "${EMAIL}"

# copy _site to tmp
- cp -r /home/travis/build/${USER}/daviddong.github.io/_site  /tmp/
# create new branch
- git checkout -b travis
# clean 
- rm -rf *
# copy _site 
- cp -r /tmp/_site/* ./
- ls -la
# git add & commit
- git add -A
- git commit -m "travis_ci update gh-pages dev -> 3457aec"
# push remote 
- git push --force "https://${GH_TOKEN}@${GH_REF}" travis:gh-pages

# branch whitelist, 
branches:
  only:
  - master     # monitor master branch
  - dev        # monitor dev branch
addons: ssh_known_hosts:daviddong.github.io
# caching bundler gem packages will speed up b
cache: bundler
# Optional: enable email notifications about the outcome of your builds
notifications:
  email: true
env:
  global:
  - secure: NiBbDRjSP7+KRko5wT0uOfSiS4GqdyLzEBFa/95OdN8mCrEslnAPS2aMWNdm5FBqMh4sotR31KCXtgnvQUk0NhxCEdNLYLvv6lK9MA2oLRhhQaeYMQjeGvCGmZyScew3cLNRdo9rn/9wXVNtZM0YUZ+CTJbpZS+jyC3KfndganTE4PPpkel/BS1BnDt8HGaioeyik805CK3bAmXClYjD/+sPaxAL6dS4BJEZzge16JK3IcJepYY+wCgzWtqhsSmHfqxJ8mFodKh8hNSQRNyOiT7G+kX8GiA7Hl5kZdd4Qia7V8ct/ovOhxL/QkVWQYp7uukjg8ugQgq02SYcMdMs86SodSmdSD6cYez5CCnmpDqfFh8SXOcNyAfqQf7MGmItI9WraTNPWPfkv5pUp/7go/ZnfGNUobnDdZh5B5cVr5xogif+B4UI2vpesZmf6IXH+XntlHlfh2x/DG6hSwywUJEEQLGJjsfiAkdQ2jbQZ9WylbNNFovT0Px2jZaetOQ9cD3ekVCjyPHfW4/vfqx6cfr2kdGjxEiQghfyfQ5bV05gJXKNfDenWFNMI4X+L0ELITjJb+q+l1L8CKF0KLjfh7lJsqWMV61qU7QCM7siU1f7KvUZCKjtNu4Wot4A11O+a5HaCzSjf7zQTuIrRwFb4srLf39rRIqU5agtxzBxAOA=
{% endhighlight %}

OK, everything is done here! 

Let's see what happens!

I modify code and push to remote dev branch, open my Travis CI web page to view the building process.

Yes, my commit event to `dev` branch triggers Travis CI to work for building.

![startup]({{site.baseurl}}/assets/image/blog-travisci-01.PNG){: .center-image }

Booting virtual machine ...

![startup]({{site.baseurl}}/assets/image/blog-travisci-02.PNG){: .center-image }

Setting environment variable...
![startup]({{site.baseurl}}/assets/image/blog-travisci-03.PNG){: .center-image }

Continue waiting..., oh! start to decryption and install toolchain...
![startup]({{site.baseurl}}/assets/image/blog-travisci-04.PNG){: .center-image }

Installation completed, building now...
![startup]({{site.baseurl}}/assets/image/blog-travisci-05.PNG){: .center-image }

Building succeed! The last step, deploy...
![startup]({{site.baseurl}}/assets/image/blog-travisci-06.PNG){: .center-image }

It's done! Looks the whole process completed successfully! 👍

Let me go to the Github gh-pages repo to check the result.

GREAT! 😄 

The repo was updated successfully with the new contents. 

The Travis CI works well, which means I can get back to the normal workflow to develop my personal blog without extra git operation between different branch. 

The workflow is not only valid for blog project deployed on Github Pages but any open source projects on Github.  

The last thing is don't forget to add a Travis CI logo/link to your README.

[![Build Status](https://travis-ci.com/gangdong/daviddong.github.io.svg?branch=dev)](https://travis-ci.com/gangdong/daviddong.github.io)

## Troubleshooting

Building Errors: 

+ Error: `iv undefined` when executing `openssl` command.<br><br>
Possible Reason:
	+ check the Travis CI website address, it should be `https://travis-ci.com` rather than `https://travis-ci.org`.
	+ run `travis login --com` instead of `travis login --org` to login Travis CI.
	+ check the config file `~/.travis/config.yml`, the value of endpoint should be `https://api.travis-ci.com/`.
{% highlight yml %}
repos:
	endpoint: https://api.travis-ci.com/
{% endhighlight %}


+ Error: Being asked for entering passphrase for key '/root/.ssh/id_rsa' when executing `openssl` command to do decryption of the SSH private key.<br>  
It is because you set the passphrase when generating the SSH key, use `ssh-keygen -p` command to reset the passphrase to none.
Then replace the private key with the new one and re-encrypt the private key.

+ Error: report `the encrypted_xxx file size is incorrect` when decryption. <br><br>
Probably you are using the wrong format encryption file, the Travis CI host are running on Ubuntu OS. So the file format should be UNIX, if you generate encryption file with DOS format, you will encounter this issue. <br><br>
The solution is to use `dos2unix` or `fromdos` command to convert the format to UNIX.

+ Error: you got ***repository not known to https://api.travis-ci.org/: user-name/repo-name*** when you execute command
{% highlight yml %}
travis encrypt -r 'user-name'/'repo-name' DEPLOY_TOKEN = 'your PATs'
{% endhighlight %}

It is because your current repo is not in the Repos list in the config.yml, add your repos name into the config.yml and indicate the endpoint to  `https://api.travis-ci.com/` manually.
{% highlight yml %}
repos:
  gangdong/daviddong.github.io:
    endpoint: https://api.travis-ci.com/
  gangdong/sort-algos:
    endpoint: https://api.travis-ci.com/
{% endhighlight %}

## Reference

+ [Travis CI](https://jekyllrb.com/docs/continuous-integration/travis-ci/#troubleshooting)
+ [publishing-github-pages-with-travis-ci](https://notes.iissnan.com/2016/publishing-github-pages-with-travis-ci/)
+ [jekyll-blog-+-travis-ci-auto-deploy](https://mritd.com/2017/02/25/jekyll-blog-+-travis-ci-auto-deploy/)