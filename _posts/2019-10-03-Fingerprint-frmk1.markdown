---
layout: post
title:  "Android Fingerprint Framework (1)"
date:   2019-10-03 15:17:47 +0800
categories: Android Fingerprint
Published: true
---
This page is trying to present a brief introduction on android fingerprint framework, aimed at helping anyone who want to learn android fingerprint related knowledge, created by referring some documents and android source code. 

There are some articles throughout the internet to share the android fingerprint related knowledge. However, from my point of view, part of them are too complicated to understand and some aren't very distinct. I wrote this article  by referring android source code and according to my personal working experiences, tried to make the contents simple and easy to understand. 

From android 6.0 (API23),android introduced fingerprint API interface, that is FingerprintManager to support fingerprint identification. While at android 8.0 (API26), it is deprecated and replaced by BiometricPrompt API interface.

Below description is from android official document about fingerprint framework.
### *Architecture*
*The Fingerprint HAL interacts with the following components.*

+ ***BiometricManager*** *interacts directly with an app in an app process. Each app has an instance of IBiometricsFingerprint.hal*
+ ***FingerprintService*** *operates in the system process, which handles communication with fingerprint HAL.*
+ ***Fingerprint HAL*** *is a C/C++ implementation of the IBiometricsFingerprint HIDL interface. This contains the vendor-specific library that communicates with the device-specific hardware.*
+ ***Keystore API and Keymaster*** *components provide hardware-backed cryptography for secure key storage in a secure environment, such as the Trusted Execution Environment (TEE).*
![framework](https://gangdong.github.io/daviddong.github.io/assets/image/android-fingerprint-framework-framework.png)
*A vendor-specific HAL implementation must use the communication protocol required by a TEE. Raw images and processed fingerprint features must not be passed in untrusted memory. All such biometric data needs to be stored in the secure hardware such as the TEE. Rooting must not be able to compromise biometric data.*

*FingerprintService and fingerprintd make calls through the Fingerprint HAL to the vendor-specific library to enroll fingerprints and perform other operations.*
![tee](https://gangdong.github.io/daviddong.github.io/assets/image/android-fingerprint-framework-tee.png)
### *Implementation guidelines*
*The following Fingerprint HAL guidelines are designed to ensure that fingerprint data is not leaked and is removed when a user is removed from a device:*

+ *Raw fingerprint data or derivatives (for example, templates) must never be accessible from outside the sensor driver or TEE. If the hardware supports a TEE, hardware access must be limited to the TEE and protected by an SELinux policy. The Serial Peripheral Interface (SPI) channel must be accessible only to the TEE and there must be an explicit SELinux policy on all device files.*
+ *Fingerprint acquisition, enrollment, and recognition must occur inside the TEE.*
+ *Only the encrypted form of the fingerprint data can be stored on the file system, even if the file system itself is encrypted.*
+ *Fingerprint templates must be signed with a private, device-specific key. For Advanced Encryption Standard (AES), at a minimum a template must be signed with the absolute file-system path, group, and finger ID such that template files are inoperable on another device or for anyone other than the user that enrolled them on the same device. For example, copying fingerprint data from a different user on the same device or from another device must not work.*
+ *Implementations must either use the file-system path provided by the 
setActiveGroup() function or provide a way to erase all user template data when the user is removed. It's strongly recommended that fingerprint template files be stored as encrypted and stored in the path provided. If this is infeasible due to TEE storage requirements, the implementer must add hooks to ensure removal of the data when the user is removed.*

### working process
By referring to official introduce, here I summarized the work flow according to my own understanding.

1. Android starts the fingerprint daemons process-**Fingerprintd** during boot up in init.rc.            
2. System server will start fingerprint system service **Fingerprint Service**.
3. **Fingerprint Service** calls the interface of **Fingerprintd** to communicate with the fingerprint HAL code. 
4. Fingerprint HAL interacts with TA program and the latter undertakes the communication with fingerprint hardware through SPI. 
5. For the sake of security, the hardware SPI is mounted in the **TEE** environment. The data collection of fingerprint image and the related processing of algorithm are all carried out within the **TEE** environment. The **REE** side only obtains the result of the **TEE** side.

In the next article, I will make a detailed introduction for the work process by inspecting to the android source code.

To be continued...
