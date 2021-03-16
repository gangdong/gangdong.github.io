---
layout: post
title:  "Powershell and CMD"
date:   2017-12-09 20:44:05 +0800
categories: Windows
tags: Windows
---
Although both of them are command line console of Windows system, and they have the similar outlook and Powershell can be treated as a update version of CMD, the intrinsic design model of them is totally different. 

Powershell is based on Microsoft .NET architect and re-design the shell command. The biggest difference is that PowerShell is built on the basis of the. Net framework common language runtime (CLR) and. Net framework, which accepts and returns. Net framework objects. In other words, PowerShell's pipe passes a. Net object instead of a raw string. That brings compatibility and convenience for Powershell.

Below I lists some points of the difference.

+ **object-oriented:** Powershell support OOP.
+ **compatibility:** based on .NET framework, be compatible with other Windows platform application, such as executable (exe), batch bat and VB script.
+ **good programming experience:** can use .NET library, syntax is very similar to advanced programming languages.
+ **scalability:** Powershell has became a platform. In addition to Microsoft, Amazon's cloud platform management and Dell's out of hand management also provide PowerShell based management components. PowerShell has become a standard, a specification.
 
all above advantages that CMD doesn't have one. If you are familiar with .NET, you can use Powershell do anything that .NET does. 