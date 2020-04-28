---
layout: post
title:  "Android Fingerprint Framework (1)"
date:   2019-10-03 15:17:47 +0800
categories: Android Fingerprint
Published: true
---
This page is trying to present a brief introduction to android fingerprint framework, aimed at helping anyone who want to learn android fingerprint related knowledge, created by referring some materials and android source code. 

There are many articles throughout the internet to teach the fingerprint technology on android platform. However, from my point of view, some of them are too complicated and some are simple. I wrote this article  by referring android source code and according to my personal working experiences, try to make the contents generally, easy to understand. 

From android6.0(API23),android added fingerprint API interface, that is FingerprintManager to support fingerprint identification. While at androidP(API28), it is deprecated and replaced by BiometricPrompt API interface.

Below part is official description about fingerprint from android docs.
#### Architecture

The Fingerprint HAL interacts with the following components.

+ **BiometricManager** interacts directly with an app in an app process. Each app has an instance of IBiometricsFingerprint.hal
+ **FingerprintService** operates in the system process, which handles communication with fingerprint HAL.
+ **Fingerprint HAL** is a C/C++ implementation of the IBiometricsFingerprint HIDL interface. This contains the vendor-specific library that communicates with the device-specific hardware.
+ **Keystore API** and Keymaster components provide hardware-backed cryptography for secure key storage in a secure environment, such as the Trusted Execution Environment (TEE).
![framework](/assets/image/android-fingerprint-framework-framework.png)
A vendor-specific HAL implementation must use the communication protocol required by a TEE. Raw images and processed fingerprint features must not be passed in untrusted memory. All such biometric data needs to be stored in the secure hardware such as the TEE. Rooting must not be able to compromise biometric data.

FingerprintService and fingerprintd make calls through the Fingerprint HAL to the vendor-specific library to enroll fingerprints and perform other operations.
![tee](/assets/image/android-fingerprint-framework-tee.png)
#### Implementation guidelines

The following Fingerprint HAL guidelines are designed to ensure that fingerprint data is not leaked and is removed when a user is removed from a device:

+ Raw fingerprint data or derivatives (for example, templates) must never be accessible from outside the sensor driver or TEE. If the hardware supports a TEE, hardware access must be limited to the TEE and protected by an SELinux policy. The Serial Peripheral Interface (SPI) channel must be accessible only to the TEE and there must be an explicit SELinux policy on all device files.
+ Fingerprint acquisition, enrollment, and recognition must occur inside the TEE.
+ Only the encrypted form of the fingerprint data can be stored on the file system, even if the file system itself is encrypted.
+ Fingerprint templates must be signed with a private, device-specific key. For Advanced Encryption Standard (AES), at a minimum a template must be signed with the absolute file-system path, group, and finger ID such that template files are inoperable on another device or for anyone other than the user that enrolled them on the same device. For example, copying fingerprint data from a different user on the same device or from another device must not work.
Implementations must either use the file-system path provided by the 
+ setActiveGroup() function or provide a way to erase all user template data when the user is removed. It's strongly recommended that fingerprint template files be stored as encrypted and stored in the path provided. If this is infeasible due to TEE storage requirements, the implementer must add hooks to ensure removal of the data when the user is removed.

#### working process
1. Start the fingerprint daemons in init.rc            
2. System server will start fingerprint system service fingerprint service
3. Fingerprint Setvice calls the interface of fingerprint to communicate with the fingerprint Hal layer 
4. Fingerprint Hal interacts with fingerprint hardware through fingerprint manufacturer's driver 
5. For the sake of security, the hardware spi of fingerprint is mounted in the tee environment. The data collection of fingerprint image and the related processing of algorithm are all carried out in the tee environment. The REE side only gets the result of the tee side












<br>
<!-- Gitalk 评论 start  -->
<!-- Link Gitalk 的支持文件  -->
<link rel="stylesheet" href="https://unpkg.com/gitalk/dist/gitalk.css">
<script src="https://unpkg.com/gitalk/dist/gitalk.min.js"></script>
<div id="gitalk-container"></div>
<script type="text/javascript">
   var gitalk = new Gitalk({

   // gitalk的主要参数
   clientID: '5e24fc307693a6df3bc5',
   clientSecret: '28c9c17e1174c705c42e9bdc92f87cadcc4ec8b8',
   repo: 'daviddong.github.io',
   owner: 'gangdong',
   admin: ['gangdong'],
   id: 'others/2019/05/12/Others-gitalk.html',
   title: 'comments'
    });
   gitalk.render('gitalk-container');
</script>
<!-- Gitalk end -->

<br><br><br>

<font size="2" color="#aaa">作者：David Dong<br></font>
<font size="2" color="#aaa">来源：https://gangdong.github.io/daviddong.github.io/others/2019/05/12/Others-gitalk.html</font>
<font size="2" color="#aaa">转载请注明出处。</font>
<span id="busuanzi_container_page_pv" ></span><font size="2" color="#aaa">
本文总阅读量</font><font size="2" color="#aaa"><span id="busuanzi_value_page_pv"></font></span><font size="2" color="#aaa">次</font>