---
layout: post
title:  "Fixing the issue: Communication error with Jack server (35) when building AOSP"
date:   2021-05-09 07:14:11 +0800
categories: Android Linux
tags: Android Linux
Published: true
toc: true
sidebar: true
about: true
author: david.dong
description: This article may help you when you build AOSP and encounter the jack server issue "SSL error when connecting to the Jack server". 
keywords: Android/jack/SSL error
---
I met an issue `Communication error with Jack server (35)` when built the AOSP yesterday. I can build the AOSP successfully before this issue popped up. I spent hours figuring out why and solved the problem.

## Issue 
My build environment of the AOSP is
+ Ubuntu 16.04 LTS server;
+ Android AOSP 8.0;
+ OpenJDK 8;

It works well until the below issue occurred yesterday. I remembered that I didn't do anything unusual before that. 

{% highlight shell %}
[  0% 1/20573] Ensuring Jack server is installed and started
FAILED: setup-jack-server 
/bin/bash -c "(prebuilts/sdk/tools/jack-admin install-server prebuilts/sdk/tools/jack-launcher.jar prebuilts/sdk/tools/jack-server-4.11.ALPHA.jar  2>&1 || (exit 0) ) && (JACK_SERVER_VM_ARGUMENTS=\"-Dfile.encoding=UTF-8 -XX:+TieredCompilation\" prebuilts/sdk/tools/jack-admin start-server 2>&1 || exit 0 ) && (prebuilts/sdk/tools/jack-admin update server prebuilts/sdk/tools/jack-server-4.11.ALPHA.jar 4.11.ALPHA 2>&1 || exit 0 ) && (prebuilts/sdk/tools/jack-admin update jack prebuilts/sdk/tools/jacks/jack-4.31.CANDIDATE.jar 4.31.CANDIDATE || exit 47 )"
Jack server already installed in "/home/david/.jack-server"
Communication error with Jack server (35), try 'jack-diagnose' or see Jack server log
SSL error when connecting to the Jack server. Try 'jack-diagnose'
SSL error when connecting to the Jack server. Try 'jack-diagnose'
ninja: build stopped: subcommand failed.
06:38:55 ninja failed with: exit status 1
build/core/main.mk:21: recipe for target 'run_soong_ui' failed
make: *** [run_soong_ui] Error 1
make: Leaving directory '/home/david/code/androidSrc'

#### make failed to build some targets (21 seconds) ####
{% endhighlight %}

## Analysis
First, I tried to debug it by following the information in the logs. I ran the `jack-diagnose` command and it returned the below message.
{% highlight shell %}
error: process ID list syntax error

Usage:
 ps [options]

 Try 'ps --help <simple|list|output|threads|misc|all>'
  or 'ps --help <s|l|o|t|m|a>'
 for additional help text.

For more details see ps(1).
Port 8077 is used by another process (pid=), please ensure to free the port or change port configuration in '/home/david/.jack-settings' and '/home/david/.jack-server/config.properties'
error: process ID list syntax error

Usage:
 ps [options]

 Try 'ps --help <simple|list|output|threads|misc|all>'
  or 'ps --help <s|l|o|t|m|a>'
 for additional help text.

For more details see ps(1).
Port 8076 is used by another process (pid=), please ensure to free the port or change port configuration in '/home/david/.jack-settings' and '/home/david/.jack-server/config.properties
{% endhighlight %}

The log indicated the port has been used by another process, so I changed the port to another one by modifying the port number in the `~/.jack-settings` and `~/.jack-server/config.properties`. 

However, it didn't work. The issue was still existing.

Then I tried to restart the jack server by commands:
{% highlight shell %}
./prebuilts/sdk/tools/jack-admin kill-server
./prebuilts/sdk/tools/jack-admin start-server
{% endhighlight %}

The issue was still there!

<div class = "post-note info">
  <div class = "header"></div>
  	<div class = "body">
		<p>There are some articles on the internet talking about this error, they pointed that the issue was caused by the <span>multiple users</span> doing the build process simultaneously, which is not supported by jack and will bring the issue. The solution is to change the port number to another one to keep jack working. But I don't think it is my case. And the result confirmed my idea.
		</p>
  	</div>
</div>

OK! I kept investigating to get more information. 

I checked the log in the file - `~/.jack-server/log/xxxx-0-0.log`. It has nothing about the error. 

I ran command `./prebuilts/sdk/tools/jack-admin dump-report` and this time I got some useful information in the error report.

{% highlight shell %}
gnutls_handshake() failed: The TLS connection was non-properly terminated.
{% endhighlight %}

Looks like it is related to the TLS connection, so I ran more commands to check.
{% highlight shell %}
curl https://127.0.0.1:8076/jack
curl: (35) gnutls_handshake() failed: The TLS connection was non-properly terminated.
{% endhighlight %}

It verified that the issue is because of the TLS connection failure. 

## Fixing

Follow this clue, I searched Google to check if anyone has met the same issue with me. I finally found the post in [stackoverflow](https://stackoverflow.com/questions/67330554/is-openjdk-upgrading-to-8u292-break-my-AOSP-build-system) that discussed this issue and provided the solution.

The reason for this issue is that I upgraded my OpenJDK to 8u292, but OpenJDK disabled the support for TLS 1.0 and 1.1, starting in `8u291`. They think TLS 1.0/1.1 are old, insecure, and deprecated. Unfortunately, I was using TLS1.1 on my build system, therefore, the connection was broken for this reason. 

I have two ways to solve this problem. 

1. I can turn on the support of TLS1.0/1.1 manually by removing the `TLSv1, TLSv1.1` declaring in `jdk.tls.disabledAlgorithms` configuration in file `/etc/java-8-openjdk/security/java.security`. 
2. Switch to use TLS1.2 for the build system.

Solution 1 is relatively quick so I tried this way. 

I enabled the support to TLS1.0/1.1, restart the jack server, and ran the build again.
{% highlight shell %}
Jack server already installed in "/home/david/.jack-server"
Server is already running
[100% 696/696] Install: out/target/product/bullhead/vendor/app/SensorTestTool/SensorTestTool.apk
make: Leaving directory '/home/david/code/androidSrc'

#### make completed successfully (03:51 (mm:ss)) ####
{% endhighlight %}

It worked this time! 

If you're in trouble with this issue like me, hope my experience and study can help you a little bit!