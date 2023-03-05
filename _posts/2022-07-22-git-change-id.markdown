---
layout: post
title:  "Keep old change-id when do git commit"
date:   2022-07-22 22:45:56 +0800
categories: Git
tags: Git
Published: true
excerpt_separator: <!--more-->
toc: true
sidebar: true
language: english
about: true
author: david.dong
description: Learn how to keep old change-id when git commit. 
keywords: Git
---

When I use `git commit --amend` command, it will generate a new change-id. But I want to use the previous change-id and don't want to generate a new one. How should I keep the old change-id and keep only one change-id?<!--more-->



When you use `git commit --amend`, it creates a new commit that replaces the previous commit. **This new commit will have a new commit hash and will be treated as a completely separate commit by Git**, even though it may contain the same changes as the previous commit.

To keep the old change-id and have only one change-id, you can use the `git commit --amend --no-edit` command. This will allow you to amend the previous commit without creating a new commit or changing the commit message. The change-id will remain the same and you will only have one change-id for that commit.

It's important to note that using `git commit --amend` can be a powerful tool, but it should be used with caution, as it can cause confusion if used improperly. If you have already pushed the commit to a remote repository, you should be careful when using `git commit --amend`, as it can cause problems when working with other collaborators. It's generally a good idea to communicate with your team before using `git commit --amend` on a commit that has been pushed to a remote repository.