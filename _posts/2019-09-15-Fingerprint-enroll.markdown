---
layout: post
title:  "Fingerprint enrollment in Android"
date:   2019-09-15 22:14:47 +0800
categories: Android Fingerprint
tags: Android Fingerprint
Published: true
toc: true
sidebar: false
---
![cover]({{site.baseurl}}/assets/image/fingerprint-enroll-cover.jpeg)    
When we do fingerprint enrollment in android device, it will generate a fingerprint template that contains the user's fingerprint information in a specified directory (for example, /data/vendor_de/0/fpdata/user.db), which depends on the system configuration.

During the template is being generated, there is a series of APIs calling in android system internally. Let's have a look at this process. 

{% include toc.html %}

Android sets some standard APIs in HAL layer for fingerprint event handling. Refer to Android P source code at [BiometricsFingerprint.h](https://www.androidos.net.cn/android/10.0.0_r6/xref/hardware/interfaces/biometrics/fingerprint/2.1/default/BiometricsFingerprint.h) and [BiometricsFingerprint.cpp](https://www.androidos.net.cn/android/10.0.0_r6/xref/hardware/interfaces/biometrics/fingerprint/2.1/default/BiometricsFingerprint.cpp).

The fingerprint APIs definition in Android BiometricsFingerprint.h.<br>
{% highlight ruby %}
Return<uint64_t> setNotify(const sp<IBiometricsFingerprintClientCallback>& clientCallback) override;
Return<uint64_t> preEnroll() override;
Return<RequestStatus> enroll(const hidl_array<uint8_t, 69>& hat, uint32_t gid, uint32_t timeoutSec) override;
Return<RequestStatus> postEnroll() override;
Return<uint64_t> getAuthenticatorId() override;
Return<RequestStatus> cancel() override;
Return<RequestStatus> enumerate() override;
Return<RequestStatus> remove(uint32_t gid, uint32_t fid) override;
Return<RequestStatus> setActiveGroup(uint32_t gid, const hidl_string& storePath) override;
Return<RequestStatus> authenticate(uint64_t operationId, uint32_t gid) override;
{% endhighlight %}

## preEnroll()

When user starts to enroll the fingerprint, the method `preEnroll()` will be called firstly, the fingerprint IC vendor needs to override this method to complete below task. 

+ generates and saves a 64 bit random number (challenge) in the fingerprint TA. 
This random number has two uses:
1. Return to the REE upper layer to fill in the authenticated token challenge in the enroll.
2. TA will use it to preliminarily verify the next enroll to ensure that the enroll has not been tampered by a third party.

## enroll()
If the `preEnroll()` is proper returned, `enroll()` will be following called.<br> 
Let's see the definition of `enroll()`.
{% highlight c %}
int (*enroll)(struct fingerprint_device *dev, const hw_auth_token_t *hat,
          uint32_t gid, uint32_t timeout_sec);
{% endhighlight %}
parameters:
+ hw_auth_token_t: this struct encloses the tokens of enrollment. <br>

{% highlight c %}
/**
 * Data format for an authentication record used to prove successful authentication.
 */
typedef struct __attribute__((__packed__))
{
    uint8_t version;  // Current version is 0
    uint64_t challenge;
    uint64_t user_id;             // secure user ID, not Android user ID
    uint64_t authenticator_id;    // secure authenticator ID
    uint32_t authenticator_type;  // hw_authenticator_type_t, in network order
    uint64_t timestamp;           // in network order
    uint8_t hmac[32];
} hw_auth_token_t;
{% endhighlight %}
**version**: version number of this token.<br>
**challenge**: it is the 64 bit random number to which preenroll was previously called to prevent the enroll from being counterfeited by a third party this time.<br>
**user_id**: Security ID, not Android user ID.<br>
**authenticator_id**: used to indicate different authentication permissions.Normally it indicates the fingerprint database ID.<br>
**authenticator_type**: 0x00 for gatekeeper, 0x01 for fingerprint.<br>
**timestamp**: last boot time stamp.<br>
**hmac**: a special key and SHA-256 algorithm are used to calculate the previous batch of parameters, and a HMAC value is obtained to ensure the legitimacy and security of the previous parameters.<br>

+ gid: Indicate which user enroll fingerprint (Anroid supports multiple users). The gid is used to set the store path of the fingerprint template in REE side.
+ timeout_sec: timeout /second.

The upper layer calls `enroll()` method and pass the parameters to fingerprint TA, fingerprint TA receives the token and authorize the token. There will be some works.

1. check if the received token->challenge same with the previous preEnroll phase challenge.
2. check if the token version is same.
3. check if authenticator_type is same.
4. retrieve the data of hw_auth_token_t struct and calucate the HMAC, check if the calculated value is same with original.

Once the token is authorized then the fingerprint TA switches the fingerprint sensor status to ready for enrollment and the fingerprint sensor will wait for the finger down event.

If the fingerprint sensor detects the finger down occurs, it will trigger the interrupt to inform the fingerprint TA capture the image. Fingerprint TA will capture the image and do a verification to check if the image is qualified. Uses `on_acquired()` callback method to notify the REE upper layer the result. If the image is not good, it will repeat the image capture for a pre-setted times. If the image is qualified, then fingerprint TA will start the enrollment in ALGO and call `on_enroll_result()` to notify the upper layer the remained sample times. Waiting for the finger up and do the next round image capture. This loop will be repeated until the required count of images are all achieved. 

## postEnroll()

Once the enroll() is returned, `postEnroll()` will be called to finish one time enroll process.
the work of `postEnroll()` is to update the challenge of TA.

A simplest diagram of the whole enrollment process is 

enrollment APIs calling.
{% highlight ruby %}
preEnroll()->enroll()->preEnroll()
{% endhighlight %}
enroll() execute flow.
{% highlight ruby %}
enroll()->authorize token->wait_for_finger_down->capture_image->algo_enroll->notify->repeat->remain sample times?->update_template->end_ernoll
{% endhighlight %}