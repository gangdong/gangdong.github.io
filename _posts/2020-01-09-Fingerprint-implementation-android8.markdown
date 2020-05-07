---
layout: post
title:  "Fingerprint implementation in android 8.0 and later"
date:   2020-01-09 20:59:29 +0800
categories: Android Fingerprint
Published: true
---
Since version 8.0, Android has fully introduced HIDL to separate vendor partition from sysem partition, so that Android is able to upgrade framework through OTA without recompiling HAL. Correspondingly, the framework of fingerprint has also been changed. 
This page will give a introduction about the difference of the fingerprint framework between android 7.0 (and early version) and android 8.0 (and later version).

After the study of the previous three articles, we have learned the fingerprint framework on the android, here give a short summary for anyone who has not read these article yet. <br>
![framework](https://gangdong.github.io/daviddong.github.io/assets/image/android-fingerprint-framework-framework.png)

The fingerprint application kicks off the work flow and this is the fingerprint management entry defined by Android system layer.

1. init.rc starts up the Fingerprintd process during the system boot up.Fingerpringd then register Ifingerprintdaemon remote service to servcemanager.
2. System server will start fingerprint system service fingerprintservice.<br>
```java
mSystemServiceManager.startService(FingerprintService.class);
```
3. Fingerprint Service calls the interface of fingerprintd to communicate with fingerprint Hal layer. 
```java
private static final String FINGERPRINTD = "android.hardware.fingerprint.IFingerprintDaemon";

mDaemon = IFingerprintDaemon.Stub.asInterface(ServiceManager.getService(FINGERPRINTD));

mDaemon.asBinder().linkToDeath(this, 0);
mDaemon.init(mDaemonCallback);
mHalDeviceId = mDaemon.openHal();
```
4. fingerprintd calls FingerprintDaemonProxy function to open HAL.
```
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
        ALOGE("NOTIFY not set properly: %p != %p", mDevice->notify, hal_notify_callback);
    }

    ALOG(LOG_VERBOSE, LOG_TAG, "fingerprint HAL successfully initialized");
    return reinterpret_cast<int64_t>(mDevice); // This is just a handle
}
```

5. The HAL code is on below path.<br>
　　/hardware/libhardware/include/hardware/fingerprint.h
　　/hardware/libhardware/modules/fingerprint

so the whole work flow is following below chart.
![workflow](https://gangdong.github.io/daviddong.github.io/assets/image/android-fingerprint-android8-workflow.png)
The related source code and android path can be found at below <br>

file|android path|
-|:--|
[init.rc]({{site.url}}/daviddong.github.io/assets/docs/init.rc)|root/system/core/rootdir/init.rc|
[fingerprintd.cpp]({{site.url}}/daviddong.github.io/assets/docs/fingerprintd.cpp)|root/system/core/fingerprintd/fingerprintd.cpp|
[FingerprintDaemonProxy.h]({{site.url}}/daviddong.github.io/assets/docs/FingerprintDaemonProxy.h)|root/system/core/fingerprintd/|fingerprintdaemonproxy.h
[fingerprintdaemonproxy.cpp]({{site.url}}/daviddong.github.io/assets/docs/fingerprintdaemonproxy.cpp)|root/system/core/fingerprintd/fingerprintdaemonproxy.cpp
[SystemServer.java]({{site.url}}/daviddong.github.io/assets/docs/SystemServer.java)|root/frameworks/base/services/java/com/android/server/SystemServer.java
[FingerprintService.java](https://gangdong.github.io/daviddong.github.io/assets/docs/FingerprintService.java)|root/frameworks/base/services/core/java/com/android/server/fingerprint/FingerprintService.java
[hardware.h]({{site.url}}/daviddong.github.io/assets/docs/hardware.h})|root/hardware/libhardware/include/hardware/hardware.h
[hardware.c]({{site.url}}/daviddong.github.io/assets/docs/hardware.c)|root/hardware/libhardware/hardware.c

Above is the fingerprint framework of android 7.0, but in Android 8.0 and later versions, Android has updated the framework and introduced a set of language called HIDL to define the interface between framework and HAL.
Let's see the difference.
![hidl](https://gangdong.github.io/daviddong.github.io/assets/image/android-fingerprint-framework-android8-diff.png)

android 8.0 add a interface folder in the hardware directory, which includes all HIDL related files for all hardware module. 

Android 8.0 removed fingerprintd, instead, fingerprintService accesses HAL by calling HIDL.

we can see the change from the getFingerprintDaemon() method realization.

in Android 7.0 
```java
mDaemon = IFingerprintDaemon.Stub.asInterface(ServiceManager.getService(FINGERPRINTD));
```
while in Android 8.0, mDaemon is achieved from the service of IBiometricsFingerprint.
```java
mDaemon = IBiometricsFingerprint.getService();
```
IBiometricsFingerprint is a new HIDL interface which was added at Android 8.0. <br>
[IBiometricsFingerprint.hal]({{site.url}}/daviddong.github.io/assets/docs/IBiometricsFingerprint.hal)
use HIDL language format defined a series standard fingerprint operation interface. 
And [biometricsfingerprint.cpp]({{site.url}}/daviddong.github.io/assets/docs/BiometricsFingerprint.cpp) class realized the ibiometricsfingerprint interface.

we may notice that the IBiometricsFingerprint returns a service for caller, actually there is a  file in the HIDL folder android.hardware.biometrics.fingerprint@2.1-service.rc, which will start
```
 service fps_hal /vendor/bin/hw/android.hardware.biometrics.fingerprint@2.1-service
    # "class hal" causes a race condition on some devices due to files created
    # in /data. As a workaround, postpone startup until later in boot once
    # /data is mounted.
    class late_start
    user system
    group system input
```
The files of the fingerprint HIDL related.
![hidl file]({{site.url}}/daviddong.github.io/assets/docs/android-fingerprint-android8-hidl.png)

```
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
```
In the constructor of BiometricsFingerprint, it calls openHal() to open HAL module. 
```
BiometricsFingerprint::BiometricsFingerprint() : mClientCallback(nullptr), mDevice(nullptr) {
    sInstance = this; // keep track of the most recent instance
    mDevice = openHal();
    if (!mDevice) {
        ALOGE("Can't open HAL module");
    }
}

```
Let's the openHal() realization.
```
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

```
so far, have you found that the function realization is similiar to the FingerprintDaemonProxy::openHal()? The native method is called and HAL module is opened here. After access to the HAL, others are all same under the HAL layer.

so we chage the fingerprint framework of Android 8.0 as below.
![fingerprint framework android8.0]({{site.url}}/daviddong.github.io/assets/image/android-fingerprint-android8-workflow2.png) 

The related source code and android path can be found at below <br>

file|android path|
-|:--|
[fingerprint@2.1-service.rc]({{site.url}}/daviddong.github.io/assets/docs/android.hardware.biometrics.fingerprint@2.1-service.rc)|root/hardware/interfaces/biometrics/fingerprint/2.1/default/|
[service.cpp]({{site.url}}/daviddong.github.io/assets/docs/service.cpp)|root/hardware/interfaces/biometrics/fingerprint/2.1/default/|
[BiometricsFingerprint.cpp]({{site.url}}/daviddong.github.io/assets/docs/BiometricsFingerprint.cpp)|root/hardware/interfaces/biometrics/fingerprint/2.1/default/|
[BiometricsFingerprint.h]({{site.url}}/daviddong.github.io/assets/docs/BiometricsFingerprint.h)|root/hardware/interfaces/biometrics/fingerprint/2.1/default/
[BiometricsFingerprint.h]({{site.url}}/daviddong.github.io/assets/docs/
IBiometricsFingerprint.hal)|root/hardware/iIBiometricsFingerprint.halnterfaces/biometrics/fingerprint/2.1
[BiometricsFingerprint.h]({{site.url}}/daviddong.github.io/assets/docs/IBiometricsFingerprintClientCallback.hal)|root/hardware/iIBiometricsFingerprint.halnterfaces/biometrics/fingerprint/2.1