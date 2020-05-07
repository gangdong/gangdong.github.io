---
layout: post
title:  "Fingerprint implementation in android 8.0 and later"
date:   2020-01-09 20:59:29 +0800
categories: Android Fingerprint
Published: true
---
Since version 8.0, Android has fully introduced HIDL mode to separate vendor partition from sysem partition, so that Android can upgrade framework OTA without recompiling HAL. Correspondingly, the implementation of fingerprint has also been changed. 
This page I will give a introduction about the difference of the fingerprint implementation on android between android 7.0 (or early version) and android 8.0 (later version).

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
---|:--:|
[init.rc]({{site.url}}/daviddong.github.io/assets/docs/init.rc)|root/system/core/rootdir/init.rc|
[fingerprintd.cpp]({{site.url}}/daviddong.github.io/assets/docs/fingerprintd.cpp)|root/system/core/fingerprintd/fingerprintd.cpp|
[FingerprintDaemonProxy.h]({{site.url}}/daviddong.github.io/assets/docs/FingerprintDaemonProxy.h)|root/system/core/fingerprintd/|