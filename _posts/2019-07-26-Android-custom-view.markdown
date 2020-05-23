---
layout: post
title:  "Error: This custom view should extend android.support.v7.widget..."
date:   2019-07-26 23:45:19 +0800
categories: Android
---
Today I met one error when trying to customize the android.widget.Button Class. <br>The error information is "This custom view should extend android.support.v7.widget.AppCompatButton instead."<br>
The temporary solution is as below.

```java
import android.annotation.SuppressLint;
@SuppressLint("AppCompatCustomView")
``` 

