---
layout: post
title:  "Git 命令及使用技巧总结"
date:   2022-03-29 23:17:03 +0800
categories: Github
tags: Git
Published: true
excerpt_separator: <!--more-->
toc: true
sidebar: true
language: chinese
about: true
author: david.dong
description: 记录 Git  的常用命令和使用技巧. 
keywords: Git
---

<img src="\assets\image\github-git-command-01.jpg" alt="git-command-01" style="zoom:100%;" />

Git is a powerful version control tool. I would even say it's one of the best. However, being powerful sometimes means being complex in terms of functionality. Git has a lot of commands. The good thing is that you can do everything you want with them, the bad thing is that you need to remember them. Here, I'll write down the commands that I'll use often to keep better track of them and make them easier to search.😉 <!--more-->

## 推送到远程分支

### 用法：git push <远程主机名> <本地分支名>:<远程分支名>

#### 1. 将本地的 master 分支推送到远程 master 分支 
{% highlight c %}
git push origin master
{% endhighlight %}

#### 2. 将本地的 dev 分支推送到远程 master 分支
{% highlight c %}
git push origin dev:master
{% endhighlight %}

#### 3. 删除远程 master 分支
{% highlight c %}
git push origin :master
git push origin --delete master
{% endhighlight %}

#### 4. 添加远程主分支和本地 master 分支的绑定关系
{% highlight c %}
git push -u origin master
{% endhighlight %}

绑定后可以直接将当前分支推送到origin主机的对应分支
{% highlight c %}
git push origin
{% endhighlight %}

#### 5. 强制推送本地dev分支到远程master分支
{% highlight c %}
git push --force origin dev:master
{% endhighlight %}

#### 6. 推送本地当前分支到远程 master分支
{% highlight c %}
git push origin HEAD:master
{% endhighlight %}

## 拉取远程分支到本地

### 用法：git pull <远程主机名> <远程分支名>:<本地分支名>

####  1. 拉取远程 master 分支到本地 dev 分支
{% highlight c %}
git pull origin master:dev
{% endhighlight %}

#### 2. 拉取远程 master 分支到本地当前分支
{% highlight c %}
git pull origin master
{% endhighlight %}

#### 3. 建立本地分支与远程分支的追踪关系
{% highlight c %}
git branch --set-upstream master origin/next
{% endhighlight %}

建立追踪后可以直接省略远程分支名
{% highlight c %}
git pull origin
{% endhighlight %}

####  4. git pull origin master:dev 等于
{% highlight c %}
git fetch origin master:dev
git diff dev
git merge dev
{% endhighlight %}

#### 5. 采用 rebase 的方式合并本地分支
{% highlight c %}
git pull --rebase origin master:dev
{% endhighlight %}

## 创建新分支

### 1. 创建 newbranch 分支
{% highlight c %}
git checkout -b newbranch
{% endhighlight %}

或者

{% highlight c %}
git branch newbranch
git checkout newbranch
{% endhighlight %}

### 2. 创建新分支并与远程分支关联

{% highlight c %}
git checkout -b tempbarch --track origin/testdevelop
{% endhighlight %}

## 删除分支

### 1. 删除本地分支
{% highlight c %}
git branch -b newbranch
{% endhighlight %}

### 2. 强制删除本地分支
{% highlight c %}
git branch -D newbranch
{% endhighlight %}

### 3. 删除远程 master 分支
{% highlight c %}
git push origin :master
git push origin --delete master
{% endhighlight %}

## 重命名分支
{% highlight c %}
git branch -m oldbranch newbranch
git branch -M oldbranch newbranch
{% endhighlight %}

## 添加远程分支

### git remote add 
{% highlight c %}
git remote add origin https://github.com/gangdong/git_learn.git
{% endhighlight %}

## 克隆远程分支
### git clone
{% highlight c %}
git clone https://github.com/gangdong/git_learn.git
{% endhighlight %}

## 查看远程提交记录
{% highlight c %}
git log remotes/origin/dev
{% endhighlight %}

## 添加 Github Token 到本地仓库
{% highlight c %}
git remote set-url origin https://<your_token>@github.com/<USERNAME>/<REPO>.git
git remote set-url origin https://ghp_YIKL6G9C5oWxxxxxxssssKsoYg@github.com/gangdong/git_learn.git
{% endhighlight %}

## git stash
### 应用场景

+ 当正在dev分支上开发某个项目，这时项目中出现一个bug，需要紧急修复，但是正在开发的内容只是完成一半，还不想提交，这时可以用git stash命令将修改的内容保存至堆栈区，然后顺利切换到hotfix分支进行bug修复，修复完成后，再次切回到dev分支，从堆栈中恢复刚刚保存的内容。
+ 本应该在dev分支开发的内容，却在master上进行了开发，需要重新切回到dev分支上进行开发，可以用git stash将内容保存至堆栈中，切回到dev分支后，再次恢复内容即可。
+ git stash命令的作用就是将目前还不想提交的但是已经修改的内容进行保存至堆栈中，后续可以在某个分支上恢复出堆栈中的内容。这也就是说，stash中的内容不仅仅可以恢复到原先开发的分支，也可以恢复到其他任意指定的分支上
{% highlight c %}
git stash
git stash save "stash 01"
# 恢复
git stash pop 
# 不自动删除堆栈内的内容
git stash apply stash@{n}
# 堆栈中移除某个指定记录
git stash drop
git stash clear
git stash list
# 查看某条 stash 的更改 
git stash show stash@{n}
{% endhighlight %}

## 合并分支
### git merge 
#### 1. merge dev 分支和 dev2 分支
{% highlight c %}
git checkout dev
git merge dev2
git mergetool
{% endhighlight %}

{% highlight c %}
git checkout dev
git fetch origin dev2
git diff origin/dev2
git merge origin/dev2
{% endhighlight %}
#### 2. 手动提交
{% highlight c %}
git checkout dev
git merge --no-commit dev2
{% endhighlight %}
#### 3. 如果有冲突，处理冲突
{% highlight c %}
git checkout dev
git merge --no-commit dev2
git ls-files -s
git show :1:filename
git mergetool
git add .
git commit
{% endhighlight %}

## git cherry-pick
### 1. 复制 dev2 的 aa3b6ca2  b821c4f7e1c 提交到 dev 分支
{% highlight c %}
git checkout dev
git cherry-pick aa3b6ca2 b821c4f7e1c
{% endhighlight %}

注意cherry-pick 多个提交时注意顺序，否则会出现冲突。

git-cherry-pick 只是复制其他分支提交的内容到本地分支，复制后的commit id 和之前 pick的不同。这一点和 git merge/git rebase 有区别。git merge/git rebase 合并的是分支，之前原分支的commit id会带到本地分支。

## git rebase
### 用法：
{% highlight c %}
git rebase   [startpoint]   [endpoint]  --onto  [branchName]
git rebase -i  [startpoint]  [endpoint]
{% endhighlight %}
注意：[startpoint] [endpoint]指定了一个编辑区间，如果不指定[endpoint]，则该区间的终点默认是当前分支HEAD所指向的commit (注：该区间指定的是一个前开后闭的区间)。
### 1. 合并当前分支的多个提交记录
{% highlight c %}
7f66117d96ac6db8661c66c55c5476c9be82622e modify readme.md
6af9edd695f3f51120b888d724eea4d254fe5bb3 master commit 02
3ce944b8cf3b35121936ae0fe59ca7ff76ed81d3 master commit 01
3f901ec367853b7852b30f0023af4398ee48235d my_dev work done.
86624b76ac8a6f16334605e0ee44f64305c4d8c3 my_dev first commit
{% endhighlight %}

#### 合并3ce944b8c..7f66117d96ac6 三条提交记录
{% highlight c %}
git rebase -i 3f901ec367853 7f66117d96ac6db
{% endhighlight %}
或者
{% highlight c %}
git rebase -i HEAD~3
{% endhighlight %}
### 2. 复制一段提交记录到dev2分支
{% highlight c %}
git rebase -i 3f901ec367853 7f66117d96ac6db onto dev2
git checkout dev2
git reset --hard  HEAD
{% endhighlight %}
### 3. 合并分支
dev 分支rebase master 分支
{% highlight c %}
git checkout dev
git rebase master
{% endhighlight %}
### 4. 冲突处理
如果有冲突，解决掉冲突后，执行
{% highlight c %}
git add .
git rebase --continue
{% endhighlight %}
<div class = "post-note warning">
  <div class = "header"></div>
  	<div class = "body">
		<p>rebase会改变原来的commit ID, 一旦对历史提交做出改变，那么从变基开始的那个提交往后所有的提交的commit ID 都会发生改变。<br>
		因此rebase命令使用要遵循以下原则:<br>
		1. “从来不要对任何已经提交到公共分支的提交记录做rebase操作，rebase操作会使得公共分支的提交记录变更，导致其他共用该分支的人的代码产生冲突。<br>
		2. 不基于rebase分支切换新分支。<br>
		3. 不对已经合入远程分支的本地分支做rebase。
		</p>
  	</div>
</div>

## git fetch
### 1. fetch 远程 dev 分支并merge
{% highlight c %}
git fetch origin dev
git diff origin/dev
git merge origin/dev
{% endhighlight %}

## Git log
### 1. 显示提交的差异
{% highlight c %}
git log -p 
{% endhighlight %}
### 2.  显示 2 个提交信息
{% highlight c %}
git log -2
{% endhighlight %}
### 3. 显示统计信息，包括哪些文件被改动
{% highlight c %}
git log --stat
{% endhighlight %}
### 4. 显示格式，一行显示
{% highlight c %}
git log --pretty=oneline
{% endhighlight %}
### 5. 格式化输出
{% highlight c %}
git log --pretty=format:"%h - %an, %ar-%cr : %s"
{% endhighlight %}
按照 **哈希值-作者，修改时间-提交时间：提交说明** 显示
### 6. 图形化输出
{% highlight c %}
git log --graph
{% endhighlight %}
通常比较有用的是 
{% highlight c %}
git log --pretty=formate:"%h - %an, %ar:%s" --graph
git log --pretty=format:"%Cred%h%Creset -%C(yellow)%d%Cblue %s %Cgreen(%cd) %C(cyan)%ar %C(bold blue)<%an>"
{% endhighlight %}
### 7. 按照作者查找提交
{% highlight c %}
git log --author="david.dong" 
{% endhighlight %}
通常比较常用
{% highlight c %}
git log --author="david.dong" --pretty=oneline
{% endhighlight %}
### 8. 按照内容匹配指定字符串的提交
{% highlight c %}
git log -S
{% endhighlight %}
通常比较常用
{% highlight c %}
git log -S "function_name" -p
{% endhighlight %}
### 9.  按照时间范围查找提交
{% highlight c %}
git log --since --until
{% endhighlight %}
{% highlight c %}
git log --since="2020-01-01" --until="2020-02-01"
git log --since="3 weeks ago" --until="2 days ago"
{% endhighlight %}
### 10. 限定查找 path/filename 的提交
{% highlight c %}
git log -p --path/filename
{% endhighlight %}
{% highlight c %}
git log --author="david" --pretty=oneline -- my_interface
查找 david 对 fpc_bio_interface 的提交
git log --author="Andy" -- my_db.c
{% endhighlight %}
### 11. 查找提交说明中包含指定字符串的提交
{% highlight c %}
git log --grep 
{% endhighlight %}
{% highlight c %}
git log --pretty=oneline --grep="Minor refinement"
git log -p --grep="ISEE"
{% endhighlight %}
### 12. 仅显示merge的提交
{% highlight c %}
git log --merges 
{% endhighlight %}
### 13. 不显示merge 提交
{% highlight c %}
git log --no-merges 
{% endhighlight %}
### 14. 只打印主线提交
{% highlight c %}
git log --first-parent 
{% endhighlight %}
### 15. 只打印某两个提交之间的记录
{% highlight c %}
git log cd50063c9a625..ad3d6ae40d271778ae6
{% endhighlight %}
### 16. 显示某一个分支的提交记录
#### 1. 显示 远程 dev 分支记录中有关 README.md 的提交
{% highlight bash%}
git log --pretty=oneline origin/dev -- README.md
{% endhighlight %}
#### 2. 显示 master 分支记录
{% highlight c %}
git log --pretty=oneline master
{% endhighlight %}
### 16. 查看只在一个分支中的提交 
查看只在 master 中的提交记录
{% highlight c %}
git log --pretty=oneline --right-only --no-merges --cherry-pick my_dev...master
{% endhighlight %}
查看只在 my_dev 中的提交记录
{% highlight c %}
git log --pretty=oneline --left-only --no-merges --cherry-pick my_dev...master
{% endhighlight %}
查看只在 master 有， my_dev 没有的提交记录
{% highlight c %}
git log master ^my_dev --pretty=oneline    或者
git log my_dev..master --pretty=oneline
{% endhighlight %}
查看只在 my_dev 有， master 没有的提交记录
{% highlight c %}
git log my_dev ^master --pretty=oneline    或者
git log master..my_dev --pretty=oneline
{% endhighlight %}
<div class = "post-note info">
  <div class = "header"></div>
  	<div class = "body">
		<p>说明：<br>
... 是列出两个分支不同的提交，等于 master..dev + dev..master, 如果加上 --left-only/--right-only 就等于 .. <br>
.. 是列出一个分支有，另一个分支没有的提交。 <br>
因此：<br>
git log --pretty=oneline --right-only --no-merges --cherry-pick my_dev...master <br>
相当于 git log --pretty=oneline master ^my_dev <br>
和 git log --pretty=oneline my_dev..master 
		</p>
  	</div>
</div>
### 17. 不显示 cherry-pick 的提交
{% highlight c %}
git log --cherry-pick 
{% endhighlight %}

## git grep 
### 在某个提交中查找字符串
{% highlight c %}
git grep "ISEE" cd5000634: 
{% endhighlight %}

## git archive 
### 打包某个提交的代码
{% highlight c %}
git archive --format tar.gz --output "linux.5.9.tar.gz" 856deb866d16e29bd659
{% endhighlight %}

## git show
### 查看某个提交的内容
{% highlight c %}
git show 856deb866d16e29bd659
{% endhighlight %}

