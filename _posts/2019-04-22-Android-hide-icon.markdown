---
layout: post
title:  "A quick way to hide app icon on andorid desktop"
date:   2019-04-22 19:11:12 +0800
categories: Android
tags: Android
Published: true
excerpt_separator: <!--more-->
toc: true
sidebar: true
about: true
author: david.dong
description: Introduce a way to hide the android app icon on the desktop. 
keywords: Android
---
Here introduces a quick way to hide the android app icon on the desktop. Although it isn't a common case on the development or usage of android app, it deserves pay a little bit time reading for anyone who want to realize it.<!--more-->

## The code implementation
The method is to add a `<data></data>` property on your app's `AndroidManifest.xml`.    
Below is a example.
{% highlight java %}
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    package="com.example.hideapplication02">

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.HideApplication02">
        <activity
            android:name=".MainActivity"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
				<!-- hide application icon start -->
                <data android:host="mainactivity" android:scheme="com.example.hideapplication02"/>
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>

</manifest>
{% endhighlight %}

## Comments
The key points are:

1. App's entry activity is declared to be started by receiving implicit intent, so the icon will not be displayed naturally.
2. For the `data` property declaring, the `android: scheme` must have been defined explicitly. 
3. Property value needs to start with a lowercase letter.
4. To call the app, need to use URI, the formate is `scheme://host: port/path`.</br>
Therefore, for above example, the URI is `com.example.hideapplication02://mainactivity`.
5. The caller needs to add below code: 
{% highlight java %}
  Uri uri = Uri.parse("com.example.hideapplication02://mainactivity");
  Intent intent = new Intent(null, uri);
  startActivity(intent);
{% endhighlight %}