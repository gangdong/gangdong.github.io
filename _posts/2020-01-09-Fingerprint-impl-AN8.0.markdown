---
layout: post
title:  "Fingerprint implementation in android 8.0 and later"
date:   2020-01-09 20:59:29 +0800
categories: Android Fingerprint
Published: true
toc: true
sidebar: true
---
Since Android 8.0, Android has fully introduced HIDL layer into the framework. The purpose is to separate vendor partition from system partition, so that Android is capable to upgrade framework through OTA without recompiling HAL. Correspondingly, the framework of fingerprint has also been reconstructed. 
This page will give a introduction about the difference of the fingerprint framework between android 7.0 (and early version) and android 8.0 (and later version).

After the study of the previous three articles, <br>
[Android Fingerprint Framework (1)]({{site.baseurl}}/android/fingerprint/2019/10/03/Fingerprint-frmk1.html)<br>
[Android Fingerprint Framework (2)]({{site.baseurl}}/android/fingerprint/2019/12/07/Fingerprint-frmk2.html)<br>
[Android Fingerprint Framework (3)]({{site.baseurl}}/android/fingerprint/2019/12/21/Fingerprint-frmk3.html)<br>

we have had a discussion of the fingerprint framework on the android 7.0 in previous blogs, here give a short summary for anyone who has not read these articles yet. <br>

{% if page.sidebar == false %}
<div class = "separator"></div>
## Index 
* TOC
{:toc}
<div class = "separator"></div>
{% endif %}

## fingerprint framework in Android 7.0
This diagram is the fingerprint framework on the android platform, I have presented in other article and copied here.        


![framework]({{site.baseurl}}/assets/image/android-fingerprint-framework-framework.png){: .center-image }



From the top layer, the fingerprint application will start the work flow and this is the fingerprint management entry defined by Android system layer.
In the framework internal, some tasks will be done to handle the request from application.

1. `init.rc` starts up the `Fingerprintd` process during the system boot up. `Fingerpringd` then register `IFingerprintDaemon` remote service to `ServiceManager`.

2. System Server will start fingerprint system service `FingerprintService`.<br>
**SystemServer.java**
{% highlight cpp %}
mSystemServiceManager.startService(FingerprintService.class);
{% endhighlight %}

3. `FingerprintService` calls the interface of `Fingerprintd` to communicate with Fingerprint HAL layer.<br>
**FingerprintService.java**
{% highlight cpp %}
public IFingerprintDaemon getFingerprintDaemon() {
        if (mDaemon == null) {
            mDaemon = IFingerprintDaemon.Stub.
            asInterface(ServiceManager.getService(FINGERPRINTD));
            if (mDaemon != null) {
                try {
                    mDaemon.asBinder().linkToDeath(this, 0);
                    mDaemon.init(mDaemonCallback);
                    mHalDeviceId = mDaemon.openHal();
                    if (mHalDeviceId != 0) {
                        updateActiveGroup(ActivityManager.getCurrentUser(), null);
                    } else {
                        Slog.w(TAG, "Failed to open Fingerprint HAL!");
                        MetricsLogger.count(mContext,
                        "fingerprintd_openhal_error", 1);
                        mDaemon = null;
                    }
                } catch (RemoteException e) {
                    Slog.e(TAG, "Failed to open fingeprintd HAL", e);
                    mDaemon = null; // try again later!
                }
            } else {
                Slog.w(TAG, "fingerprint service not available");
            }
        }
        return mDaemon;
    }
{% endhighlight %}
4. `Fingerprintd` calls `FingerprintDaemonProxy` function to open HAL.<br>
**FingerprintDaemonProxy.cpp**
{% highlight cpp %}
int64_t FingerprintDaemonProxy::openHal() {
    ALOG(LOG_VERBOSE, LOG_TAG, "nativeOpenHal()\n");
    int err;
    const hw_module_t *hw_module = NULL;
    if (0 != (err = hw_get_module(FINGERPRINT_HARDWARE_MODULE_ID, &hw_module))) {
        ALOGE("Can't open fingerprint HW Module, error: %d", err);
        return 0;
    }
    if (NULL == hw_module) {
        ALOGE("No valid fingerprint module");
        return 0;
    }

    mModule = reinterpret_cast<const fingerprint_module_t*>(hw_module);

    if (mModule->common.methods->open == NULL) {
        ALOGE("No valid open method");
        return 0;
    }

    hw_device_t *device = NULL;

    if (0 != (err = mModule->common.methods->open(hw_module, NULL, &device))) {
        ALOGE("Can't open fingerprint methods, error: %d", err);
        return 0;
    }

    if (kVersion != device->version) {
        ALOGE("Wrong fp version. Expected %d, got %d", kVersion, device->version);
        // return 0; // FIXME
    }

    mDevice = reinterpret_cast<fingerprint_device_t*>(device);
    err = mDevice->set_notify(mDevice, hal_notify_callback);
    if (err < 0) {
        ALOGE("Failed in call to set_notify(), err=%d", err);
        return 0;
    }

    // Sanity check - remove
    if (mDevice->notify != hal_notify_callback) {
        ALOGE("NOTIFY not set properly: %p != %p", mDevice->notify, 
        hal_notify_callback);
    }

    ALOG(LOG_VERBOSE, LOG_TAG, "fingerprint HAL successfully initialized");
    return reinterpret_cast<int64_t>(mDevice); // This is just a handle
}
{% endhighlight %}

5. The HAL code is at below android path normally.<br>
{% highlight ruby %}
/hardware/libhardware/include/hardware/fingerprint.h
/hardware/libhardware/modules/fingerprint.c
{% endhighlight %}
I drew a flow chart to help understand the whole flow more clearly.

![workflow]({{site.baseurl}}/assets/image/android-fingerprint-android8-workflow.png)

The related source code and android path can be found at below table. Android 7.0 (NOUGAT)<br>

File|Android Path|
:--|:--|
[init.rc](https://www.androidos.net.cn/android/7.0.0_r31/xref/system/core/rootdir/init.rc)|root/system/core/rootdir/init.rc|
[fingerprintd.cpp](https://www.androidos.net.cn/android/7.0.0_r31/xref/system/core/fingerprintd/fingerprintd.cpp)|root/system/core/fingerprintd/fingerprintd.cpp|
[FingerprintDaemonProxy.h](https://www.androidos.net.cn/android/7.0.0_r31/xref/system/core/fingerprintd/FingerprintDaemonProxy.h)|root/system/core/fingerprintd/
[fingerprintdaemonproxy.cpp](https://www.androidos.net.cn/android/7.0.0_r31/xref/system/core/fingerprintd/FingerprintDaemonProxy.cpp)|root/system/core/fingerprintd/fingerprintdaemonproxy.cpp
[SystemServer.java](https://www.androidos.net.cn/android/7.0.0_r31/xref/frameworks/base/services/java/com/android/server/SystemServer.java)|root/frameworks/base/services/java/com/android/server/SystemServer.java
[FingerprintService.java](https://www.androidos.net.cn/android/7.0.0_r31/xref/frameworks/base/services/core/java/com/android/server/fingerprint/FingerprintService.java)|root/frameworks/base/services/core/<BR>java/com/android/server/fingerprint/FingerprintService.java
[hardware.h](https://www.androidos.net.cn/android/7.0.0_r31/xref/hardware/libhardware/include/hardware/hardware.h)|root/hardware/libhardware/include/hardware/hardware.h
[hardware.c](https://www.androidos.net.cn/android/7.0.0_r31/xref/hardware/libhardware/hardware.c)|root/hardware/libhardware/hardware.c

## fingerprint framework in Android 8.0
Above is the fingerprint framework of Android 7.0, however in Android 8.0 and later versions, Android has updated the framework and introduced a set of language called HIDL to define the interface between framework and HAL.

Let's see the difference.

![hidl]({{site.baseurl}}/assets/image/android-fingerprint-framework-android8-diff.png){: .center-image }

Android 8.0 add a sub-directory `/interface` in the `/hardware` directory, which includes all HIDL files for hardware module. 

Android 8.0 removed `Fingerprintd`, instead, `FingerprintService` accesses HAL by calling HIDL.

We can find the change in `getFingerprintDaemon()` method.

In Android 7.0<br>
**FingerprintService.java**
{% highlight cpp %}
mDaemon = IFingerprintDaemon.Stub.asInterface(ServiceManager.
getService(FINGERPRINTD));
{% endhighlight %}
While in Android 8.0, mDaemon is achieved from the service of `IBiometricsFingerprint`.<br>
**FingerprintService.java**
{% highlight cpp %}
mDaemon = IBiometricsFingerprint.getService();
{% endhighlight %}

`IBiometricsFingerprint` is a new fingerprint HIDL interface which was introduced at Android 8.0. <br>
[IBiometricsFingerprint.hal](https://www.androidos.net.cn/android/8.0.0_r4/xref/hardware/interfaces/biometrics/fingerprint/2.1/IBiometricsFingerprint.hal)
use HIDL language format defined a series standard fingerprint operation interfaces. 
And [biometricsfingerprint.cpp](https://www.androidos.net.cn/android/8.0.0_r4/xref/hardware/interfaces/biometrics/fingerprint/2.1/default/BiometricsFingerprint.cpp) class realized the `IBiometricsFingerprint` interface.

We may notice that the `IBiometricsFingerprint` returns a service for caller, actually there is a  file in the HIDL sub-directory: <br>
[android.hardware.biometrics.fingerprint@2.1-service.rc](https://www.androidos.net.cn/android/8.0.0_r4/xref/hardware/interfaces/biometrics/fingerprint/2.1/default/android.hardware.biometrics.fingerprint@2.1-service.rc), which will start fps_hal service.<br>
**fingerprint@2.1-service.rc**
{% highlight cpp %}
 service fps_hal /vendor/bin/hw/android.hardware.biometrics.fingerprint@2.1-service
    # "class hal" causes a race condition on some devices due to files created
    # in /data. As a workaround, postpone startup until later in boot once
    # /data is mounted.
    class late_start
    user system
    group system input
{% endhighlight %}
The files of the fingerprint HIDL related.
![hidl file]({{site.baseurl}}/assets/image/android-fingerprint-android8-hidl.png)

If we look at the **Service.cpp**, we will find the service actually will create a `BiometricsFingerprint` instance and register as service.
{% highlight cpp %}
int main() {
    android::sp<IBiometricsFingerprint> bio = BiometricsFingerprint::getInstance();

    configureRpcThreadpool(1, true /*callerWillJoin*/);

    if (bio != nullptr) {
        bio->registerAsService();
    } else {
        ALOGE("Can't create instance of BiometricsFingerprint, nullptr");
    }

    joinRpcThreadpool();

    return 0; // should never get here
}
{% endhighlight %}
In the constructor of `BiometricsFingerprint` class, it calls `openHal()` to open HAL module. <br>
**BiometricsFingerprint.cpp**
{% highlight cpp %}
BiometricsFingerprint::BiometricsFingerprint() : mClientCallback(nullptr), 
mDevice(nullptr) {
    sInstance = this; // keep track of the most recent instance
    mDevice = openHal();
    if (!mDevice) {
        ALOGE("Can't open HAL module");
    }
}
{% endhighlight %}
Let's check the `openHal()` function.<br>
**BiometricsFingerprint.cpp**
{% highlight cpp %}
fingerprint_device_t* BiometricsFingerprint::openHal() {
    int err;
    const hw_module_t *hw_mdl = nullptr;
    ALOGD("Opening fingerprint hal library...");
    if (0 != (err = hw_get_module(FINGERPRINT_HARDWARE_MODULE_ID, &hw_mdl))) {
        ALOGE("Can't open fingerprint HW Module, error: %d", err);
        return nullptr;
    }

    if (hw_mdl == nullptr) {
        ALOGE("No valid fingerprint module");
        return nullptr;
    }

    fingerprint_module_t const *module =
        reinterpret_cast<const fingerprint_module_t*>(hw_mdl);
    if (module->common.methods->open == nullptr) {
        ALOGE("No valid open method");
        return nullptr;
    }

    hw_device_t *device = nullptr;

    if (0 != (err = module->common.methods->open(hw_mdl, nullptr, &device))) {
        ALOGE("Can't open fingerprint methods, error: %d", err);
        return nullptr;
    }

    if (kVersion != device->version) {
        // enforce version on new devices because of HIDL@2.1 translation layer
        ALOGE("Wrong fp version. Expected %d, got %d", kVersion, device->version);
        return nullptr;
    }

    fingerprint_device_t* fp_device =
        reinterpret_cast<fingerprint_device_t*>(device);

    if (0 != (err =
            fp_device->set_notify(fp_device, BiometricsFingerprint::notify))) {
        ALOGE("Can't register fingerprint module callback, error: %d", err);
        return nullptr;
    }

    return fp_device;
}
{% endhighlight %}
Have you found that the function realization is similiar to the `FingerprintDaemonProxy::openHal()`? The native method is called and HAL module is opened here. After access to the HAL, others are all same under the HAL layer.

So far, we can change the fingerprint framework of Android 8.0 as below.

![fingerprint framework android8.0]({{site.baseurl}}/assets/image/android-fingerprint-android8-workflow2.png){: .center-image }

Compare this flowchart carefully with last flowchart above, we can find the difference clearly.

The related source code and android path can be found at below table<br>

File|Android Path|
:--|:--|
[fingerprint@2.1-service](https://www.androidos.net.cn/android/8.0.0_r4/xref/hardware/interfaces/biometrics/fingerprint/2.1/default/android.hardware.biometrics.fingerprint@2.1-service.rc)|root/hardware/interfaces/biometrics/fingerprint/2.1/default|
[service.cpp](https://www.androidos.net.cn/android/8.0.0_r4/xref/hardware/interfaces/biometrics/fingerprint/2.1/default/service.cpp)|root/hardware/interfaces/biometrics/fingerprint/2.1/default|
[BiometricsFingerprint.h](https://www.androidos.net.cn/android/8.0.0_r4/xref/hardware/interfaces/biometrics/fingerprint/2.1/default/BiometricsFingerprint.h)|root/hardware/interfaces/biometrics/fingerprint/2.1/default|
[BiometricsFingerprint.cpp](https://www.androidos.net.cn/android/8.0.0_r4/xref/hardware/interfaces/biometrics/fingerprint/2.1/default/BiometricsFingerprint.cpp)|root/hardware/interfaces/biometrics/fingerprint/2.1/default|
[IBiometricsFingerprint.hal](https://www.androidos.net.cn/android/8.0.0_r4/xref/hardware/interfaces/biometrics/fingerprint/2.1/IBiometricsFingerprint.hal)|root/hardware/interfaces/biometrics/fingerprint/2.1|
[IBiometricsFingerprintClientCallback.hal](https://www.androidos.net.cn/android/8.0.0_r4/xref/hardware/interfaces/biometrics/fingerprint/2.1/IBiometricsFingerprintClientCallback.hal)|root/hardware/interfaces/biometrics/fingerprint/2.1|

Now, I think the main difference of the fingerprint framework on Android 8.0 has been introduced and if you have further questions, you can ask at comment box, I will reply to you as soon as I can.  