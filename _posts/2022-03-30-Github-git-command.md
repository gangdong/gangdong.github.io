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

Git 功能十分强大，命令也非常的多，平时使用的时候总是会有想不起来需要去网络上查找的情况。最近有时间整理了一下平时常用的命令和一些有用的使用技巧。记录到博客里，以后需要查找的时候就很方便快捷了😉 <!--more-->

## Git push

### git push <远程主机名> <本地分支名>:<远程分支名>

#### 1. 将本地的 master 分支推送到远程 master 分支 

{% highlight c %}

git push origin master

{% endhighlight %}

#### 2. 将本地的 dev 分支推送到远程 master 分支

{% highlight c %}

git push origin dev:master

{% endhighlight %}

#### 3. 删除远程 master 分支



```
git push origin :master
git push origin --delete master
```

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

## Git pull

### git pull <远程主机名> <远程分支名>:<本地分支名>

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

```
git fetch origin master:dev
git diff dev
git merge dev
```

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

```
git branch newbranch
git checkout newbranch
```

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

```
git push origin :master
git push origin --delete master
```

## 重命名分支

```
git branch -m oldbranch newbranch
git branch -M oldbranch newbranch (强制)
```

## git remote add 

### 添加远程分支

{% highlight c %}

git remote add origin https://github.com/gangdong/git_learn.git

{% endhighlight %}

## Git clone

{% highlight c %}

git clone https://github.com/gangdong/git_learn.git

{% endhighlight %}

## 查看远程提交记录

{% highlight c %}

git log remotes/origin/dev

{% endhighlight %}

## 添加 Github Token 到本地仓库,无需每次输入

```
git remote set-url origin https://<your_token>@github.com/<USERNAME>/<REPO>.git
git remote set-url origin https://ghp_YIKL6G9C5oWxxxxxxssssKsoYg@github.com/gangdong/git_learn.git
```

## git stash

### git stash 

#### 应用场景

+ 当正在dev分支上开发某个项目，这时项目中出现一个bug，需要紧急修复，但是正在开发的内容只是完成一半，还不想提交，这时可以用git stash命令将修改的内容保存至堆栈区，然后顺利切换到hotfix分支进行bug修复，修复完成后，再次切回到dev分支，从堆栈中恢复刚刚保存的内容。
+ 本应该在dev分支开发的内容，却在master上进行了开发，需要重新切回到dev分支上进行开发，可以用git stash将内容保存至堆栈中，切回到dev分支后，再次恢复内容即可。
+ git stash命令的作用就是将目前还不想提交的但是已经修改的内容进行保存至堆栈中，后续可以在某个分支上恢复出堆栈中的内容。这也就是说，stash中的内容不仅仅可以恢复到原先开发的分支，也可以恢复到其他任意指定的分支上

```
git stash
git stash save "stash 01"
git stash pop (恢复)
git stash apply n（不自动删除堆栈内的内容）
git stash drop（堆栈中移除某个指定记录）
git stash clear
git stash list
git stash show 
```

## git merge

### 1. merge dev 分支和 dev2 分支

```
git checkout dev
git merge dev2
git mergetool
```

```
git checkout dev
git fetch
git diff origin/dev2
git merge origin/dev2
git mergetool
```

## git cherry-pick

### 复制 dev2 的 aa3b6ca2  b821c4f7e1c 提交到 dev 分支

```
git checkout dev
git cherry-pick aa3b6ca2 b821c4f7e1c
```

注意cherry-pick 多个提交时注意顺序，否则会出现冲突。

git-cherry-pick 只是复制其他分支提交的内容到本地分支，复制后的commit id 和之前 pick的不同。这一点和 git merge/git rebase 有区别。git merge/git rebase 合并的是分支，之前原分支的commit id会带到本地分支。

## Git log

### 1. git log -p : 显示提交的差异

### 2. git log -2: 显示 2 个提交信息

### 3. git log --stat: 显示统计信息，包括那些文件被改动

### 4. git log --pretty=oneline: 显示格式，一行显示

### 5. git log --pretty=format:"%h - %an, %ar-%cr : %s"

按照 **哈希值-作者，修改时间-提交时间：提交说明** 显示

### 6. git log --graph: 

通常比较有用的是 

```
git log --pretty=formate:"%h - %an, %ar:%s" --graph
```

### 7. git log --author="david.dong" : 按照作者查找提交

通常比较常用

```
git log --author="david.dong" --pretty=oneline
```

### 8. git log -S: 仅显示添加或删除内容匹配指定字符串的提交

通常比较常用

```
git log -S "function_name" -p
```

### 9. git log --since --until: 按照时间范围显示

```
git log --since="2020-01-01" --until="2020-02-01"
git log --since="3 weeks ago" --until="2 days ago"
```

### 10. git log -p --path/filename: 限定查找 path/filename 的提交

```
git log --author="david" --pretty=oneline -- fpc_bio_interface
查找 david 对 fpc_bio_interface 的提交
git log --author="Andy Hong" -- fpc_db.c
```

### 11. git log --grep : 仅显示提交说明中包含指定字符串的提交

```
git log --pretty=oneline --grep="Minor refinement"
git log -p --grep="ISEE"
```

### 12. git log --merges : 仅显示merge的提交

### 13. git log --no-merges : 不显示merge 提交

### 14. git log --first-parent : 只打印主线提交

### 15. git log cd50063c9a625..ad3d6ae40d271778ae6: 只打印这两个提交之间的记录

### 16. 查看只在一个分支中的提交 

```
查看只在 master 中的提交记录
git log --pretty=oneline --right-only --no-merges --cherry-pick my_dev...master
查看只在 my_dev 中的提交记录
git log --pretty=oneline --left-only --no-merges --cherry-pick my_dev...master

查看只在 master 有， my_dev 没有的提交记录
git log master ^my_dev --pretty=oneline    或者
git log my_dev..master --pretty=oneline
查看只在 my_dev 有， master 没有的提交记录
git log my_dev ^master --pretty=oneline    或者
git log master..my_dev --pretty=oneline

说明：
... 是列出两个分支不同的提交，等于 master..dev + dev..master, 如果加上 --left-only/--right-only 就等于 ..
.. 是列出一个分支有，另一个分支没有的提交
因此：
git log --pretty=oneline --right-only --no-merges --cherry-pick my_dev...master 
=
git log --pretty=oneline master ^my_dev
=
git log --pretty=oneline my_dev..master
```

### 17. git log --cherry-pick : 不显示 cherry-pick 的提交

## git grep 

```
git grep "ISEE" cd5000634: 在 cd5000634 提交中查找字符串 ISEE
```

## git archive 

```
git archive --format tar.gz --output "linux.5.9.tar.gz" 856deb866d16e29bd659
```

