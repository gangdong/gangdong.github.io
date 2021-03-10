---
layout: post
title:  "Build TA images on different TrustZone"
date:   2021-02-04 12:21:47 +0800
categories: Android Fingerprint
Published: true
---
This article will give a introduction on how to build TA images on different TrustZone.

<div class = "separator"></div>

## Index

1. [About TEE](#1)
2. [QSEE5](#2)
    + [2.1 SDK](#2.1)
    + [2.2 TA code ](#2.2)
    + [2.3 Build command](#2.3)
    + [2.4 Generated TA image](#2.4)
3. [ISEE](#3)
    + [3.1 SDK](#3.1)
    + [3.2 TA code ](#3.2)
    + [3.3 Build command](#3.3)
    + [3.4 Generated TA image](#3.4)
4. [Trusty](#4)
    + [4.1 SDK](#4.1)
    + [4.2 TA code ](#4.2)
    + [4.3 Build command](#4.3)
    + [4.4 Generated TA image](#4.4)
    
<div class = "separator"></div>

## <span id ="1">1. About TEE</span>
Nowadays, any security related application must run on the TEE. TEE (Trusted Execution Environment) is able to provide a absolute-safe environment for any user security requirement. Fingerprint application as one kind of biometric authentication, it is a trusted application and must run on the TEE. Here I will take Fingerprint application as an example to introduce how to build the trusted application (TA) image.

Before start, I want to use below diagram for presenting a short description on how TEE works on fingerprint application. 
![fingerprint-tee]({{site.baseurl}}/assets/image/fingerprint-build-ta-01.png){: .center-image }

The main control flow, handling the various use cases, is implemented in REE (Fingerprint HAL). Images from the sensor are captured on the TEE side and managed by fingerprint library, which also coordinates data flow towards the submodules implementing various algorithms for image processing and biometric processing. Enrolled fingerprint templates are managed in a RAM database in Fingerprint TA, and encrypted before passed to REE side for persistent storage. when authentication occurred, the matcher algorithm in the TEE side will work and give the matching result to REE. The communication channel - SPI transmission is physical in TEE and normally works by calling TEE API.

The software module working on TEE side are normally built into a binary file, which runs on the TEE OS as an executable application (Trusted Application). Different TEE OS can support different number of Trusted Application (TA). 
 
There are multiple commercial TEE OS on the Android platform supported by the third-part companies, some popular ones among them are QSEE, ISEE, Trusty. The following content will introduce how the fingerprint TA image is built out on these TEE OS.  

## <span id ="2">2. QSEE 5</span>
QSEE is one TEE OS supported by Qualcomm. In android market, system running with Qualcomm platform uses the QSEE Trustzone. QSEE provides a set of SDK that help the developer to develop the TEE application and generate the image file (TA image). 

### <span id ="2.1">2.1 SDK </span>
To build the TA image, we need to use QSEE SDK, which can be got from Qualcomm or ODMs. Here I use QSEE5 SDK and put it to below location in my unbuntu.

` /home/david/devtools/tz_qsee5 `
### <span id ="2.2">2.2 Fingerprint_TA code </span>
Next we need to put the source code of Fingerprint TA into place that the SDK can find it and make.
In QSEE, normally there is specific location in the SDK file tree for storing the TA code.    
It is at 
`/home/david/devtools/tz_qsee5/ssg/securemsm/trustzone/qsapps/`

### <span id ="2.3">2.3 Build command </span>
We executes the build command to make the TA code and generate the TA image.
{% highlight ruby %}
 cd /home/david/devtools/tz_qsee5/build/ms/
 python build_all.py -b TZ.XF.5.0.1 CHIPSET=sdm845 --cbt="$(FPC_CONFIG_TZ_IMAGE_NAME)" $(build_flags)
{% endhighlight %}

Build process
![fingerprint-tee]({{site.baseurl}}/assets/image/fingerprint-build-ta-02.png){: .center-image }

### <span id ="2.4">2.4 TA image </span>
TA images are generated at 
`/home/david/devtools/tz_qsee5/build/ms/bin/PIL_IMAGES/SPLITBINS_WAXAANAA/` 


The TA images are
{% highlight ruby %}
fpctzappfingerprint.b00
fpctzappfingerprint.b01
fpctzappfingerprint.b02
fpctzappfingerprint.b03
fpctzappfingerprint.b04
fpctzappfingerprint.b05
fpctzappfingerprint.b06
fpctzappfingerprint.b07
fpctzappfingerprint.mdt
{% endhighlight %}

## <span id ="3">3. ISEE </span>
There is no property TEE OS under MTK platform. It adopts the way of integrating the TEE environment of a third party. The common TEE manufacturers ISEE.

### <span id ="2.1">3.1 SDK </span>

For ISEE SDK, it can find more details on this link [「ISEE SDK」](https://www.beanpodtech.com/%e4%b8%bb%e8%a6%81%e4%ba%a7%e5%93%81/isee-sdk/)
I put the SDK into below location.
`/home/david/devtools/isee_sdk_270`
### <span id ="3.2">3.2 Fingerprint_TA code </span>
Put the TA source code to below path 
`/home/david/devtools/platforms/mt6797/vendor/fingerprints/` 
### <span id ="3.3">3.3 Build command </span>
Run command
{% highlight ruby %}
 cd /home/david/devtools/isee_sdk_270
 source setenv.sh 
 cd /home/david/devtools/platforms/mt6797/vendor/fingerprints/fingerprint_ta/secure/platform/isee
 make
{% endhighlight %}
Build process
![fingerprint-tee]({{site.baseurl}}/assets/image/fingerprint-build-ta-03.png){: .center-image }
### <span id ="3.4">3.4 TA image </span>
TA image is generated at path
{% highlight ruby %}
 /home/david/devtools/platforms/mt6797/vendor/fingerprints/fingerprint_ta/secure/platform/isee/obj/7778c03fc30c4dd0a319ea29643d4d4b.ta
{% endhighlight %}
It uses the UUID of the TA as the TA name, which is UUID.ta

## <span id ="4">4. Trusty </span>

Trusty TEE is originated and supported by Google, which is integrated into the android as a secure Operating System (OS) that provides a Trusted Execution Environment (TEE).
For more details about Trusty, please refer to  [「Trusty TEE」](https://source.android.com/security/trusty)
### <span id ="4.1">4.1 SDK </span>
Find a location in your local device.
For example, I put the trusty SDK here.
`/home/david/devtools/trusty_sdk`
### <span id ="4.2">4.2 Fingerprint_TA code </span>
Copy the TA source code to the SDK folder.
`/home/david/devtools/trusty_sdk/app/demo/`
### <span id ="4.3">4.3 Build command </span>
Run command
{% highlight ruby %}
 cd /home/david/devtools/trusty_sdk
 make M="app/demo/fpctzapp:TA"
{% endhighlight %}
Build process
![fingerprint-tee]({{site.baseurl}}/assets/image/fingerprint-build-ta-04.png){: .center-image }
### <span id ="4.4">4.4 TA image </span>
The TA image is generated at below location after compiling completed.
{% highlight ruby %}
/home/david/devtools/trusty_sdk/build/user_tasks/app/demo/fpctzapp/fpctzapp.elf
/home/david/devtools/trusty_sdk/build/user_tasks/app/demo/fpctzapp/fpctzapp.elf/fpctzapp.syms.elf (带符号表，用于debug)
{% endhighlight %}
It uses the TA name that defined at the configuration as the image name, which is TA_Name.elf. 
Such as fpctzapp.elf. The TA_Name.syms.elf is the image file that containing the symbols table which can be used for debugging purpose.

