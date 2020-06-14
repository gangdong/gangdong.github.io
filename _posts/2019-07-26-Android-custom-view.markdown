---
layout: post
title:  "Some tips for android development errors"
date:   2019-07-26 23:45:19 +0800
categories: Android
---
Today I met a error when I was trying to customize the android.widget.Button Class.:confused: <br>The error information is 
```android
"This custom view should extend android.support.v7.widget.AppCompatButton instead."
```

The temporary solution that I used is as below.

```java
import android.annotation.SuppressLint;
@SuppressLint("AppCompatCustomView")
``` 
Besides, I had met 
```android
"I/hwservicemanager: getTransport: Cannot find entry" 
```
when running application. That's because the application used HIDL interface which should register at the vintf/manifest.xml but hasn't done. This feature is introduced at Android O. Obviously, the solution is registering all of the HIDL interfaces that will be used at manifest.xml.

Another issue is 
```android
"avc: denied { read } for name="u:object_r:vendor_default_prop:s0" dev="tmpfs" ino=27157 
scontext=u:r:platform_app:s0:c512,c768 tcontext=u:object_r:vendor_default_prop:s0 
tclass=file permissive=1"
```
which is related to selinux, the selinux policy is missing that cause the permission is rejected. Need to add the permission to selinux. 