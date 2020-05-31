---
layout: post
title:  "Android Fingerprint Framework (2)"
date:   2019-12-07 23:52:01 +0800
categories: Android Fingerprint
Published: true
---
This page will follow the [last article]({{site.baseurl}}/android/fingerprint/2019/10/03/Fingerprint-frmk1.html) to continue introducing the android fingerprint framework knowledge. The content is focus on android source code inspecting and analysis.

### Step one - startup fingerprintd service
Looking at the init.rc file, a task is assigned at init.rc when the android system boots up - start the fingerprint daemon service.
```
service fingerprintd /system/bin/fingerprintd
class late_start
user root
group root sdcard_r sdcard_rw
``` 
Let's go on to check the fingerprintd program.<br> 
Here I would recommend a useful website for you viewing the android source code.<br> 
[Android Community](https://www.androidos.net.cn/android/10.0.0_r6/xref)

We can see the android path of the [fingerprintd.cpp](https://www.androidos.net.cn/android/7.1.1_r28/xref/system/core/fingerprintd/fingerprintd.cpp) is system/core/fingerprintd/ and the directory structure is as below.
![fingerprintd directory structure]({{site.baseurl}}/assets/image/android-fingerprint-framework2-fingerprintd-directory.png)
read the 
[Android.mk](https://www.androidos.net.cn/android/7.1.1_r28/xref/system/core/fingerprintd/Android.mk)<br>
androdi path: root/system/core/fingerprintd/Android.mk <br>
we can know that this package is built as a executable program.<br>
```android
LOCAL_PATH := $(call my-dir)
include $(CLEAR_VARS)
LOCAL_CFLAGS := -Wall -Wextra -Werror -Wunused
LOCAL_SRC_FILES := \
	FingerprintDaemonProxy.cpp \
	IFingerprintDaemon.cpp \
	IFingerprintDaemonCallback.cpp \
	fingerprintd.cpp
LOCAL_MODULE := fingerprintd
LOCAL_SHARED_LIBRARIES := \
	libbinder \
	liblog \
	libhardware \
	libutils \
	libkeystore_binder
include $(BUILD_EXECUTABLE)
```
next open the 
[fingerprintd.cpp](https://www.androidos.net.cn/android/7.1.1_r28/xref/system/core/fingerprintd/fingerprintd.cpp)<br>
android path: root/system/core/fingerprintd/fingerprintd.cpp<br>
The task of the main() function is very simple, just create a FingerprintDaemonProxy object and add it into the service queue. 
```cpp
#include "FingerprintDaemonProxy.h"

int main() {
    ALOGI("Starting " LOG_TAG);
    android::sp<android::IServiceManager> serviceManager 
    = android::defaultServiceManager();
    android::sp<android::FingerprintDaemonProxy> proxy =
            android::FingerprintDaemonProxy::getInstance();
    android::status_t ret = serviceManager->addService(
            android::FingerprintDaemonProxy::descriptor, proxy);
    if (ret != android::OK) {
        ALOGE("Couldn't register " LOG_TAG " binder service!");
        return -1;
    }

    /*
     * We're the only thread in existence, so we're just going to process
     * Binder transaction as a single-threaded program.
     */
    android::IPCThreadState::self()->joinThreadPool();
    ALOGI("Done");
    return 0;
}
```
From the 
[FingerprintDaemonProxy.h](https://www.androidos.net.cn/android/7.1.1_r28/xref/system/core/fingerprintd/FingerprintDaemonProxy.h)<br>
android path: root/system/core/fingerprintd/FingerprintDaemonProxy.h<br>
We find the remote service is fingerprint daemon. Fingerprinted registers the remote service to the servcemanager for the client to use.
The protocol interface is IFingerprintdaemon. FingerprintService in the framework will eventually call the remote service, that is, the method in 
[fingerprintdaemonproxy.cpp](https://www.androidos.net.cn/android/7.1.1_r28/xref/system/core/fingerprintd/FingerprintDaemonProxy.cpp).<br>
android path: root/system/core/fingerprintd/fingerprintdaemonproxy.cpp<br>
```c++
#ifndef FINGERPRINT_DAEMON_PROXY_H_
#define FINGERPRINT_DAEMON_PROXY_H_

#include "IFingerprintDaemon.h"
#include "IFingerprintDaemonCallback.h"

namespace android {

class FingerprintDaemonProxy : public BnFingerprintDaemon {
    public:
        static FingerprintDaemonProxy* getInstance() {
            if (sInstance == NULL) {
                sInstance = new FingerprintDaemonProxy();
            }
            return sInstance;
        }

        // These reflect binder methods.
        virtual void init(const sp<IFingerprintDaemonCallback>& callback);
        virtual int32_t enroll(const uint8_t* token, ssize_t 
        tokenLength, int32_t groupId, int32_t timeout);
        virtual uint64_t preEnroll();
        virtual int32_t postEnroll();
        virtual int32_t stopEnrollment();
        virtual int32_t authenticate(uint64_t sessionId, uint32_t 
        groupId);
        virtual int32_t stopAuthentication();
        virtual int32_t remove(int32_t fingerId, int32_t groupId);
        virtual int32_t enumerate();
        virtual uint64_t getAuthenticatorId();
        virtual int32_t setActiveGroup(int32_t groupId, 
        const uint8_t* path, ssize_t pathLen);
        virtual int64_t openHal();
        virtual int32_t closeHal();

    private:
        FingerprintDaemonProxy();
        virtual ~FingerprintDaemonProxy();
        void binderDied(const wp<IBinder>& who);
        void notifyKeystore(const uint8_t *auth_token, const size_t
        auth_token_length);
        static void hal_notify_callback(const fingerprint_msg_t *msg);

        static FingerprintDaemonProxy* sInstance;
        fingerprint_module_t const* mModule;
        fingerprint_device_t* mDevice;
        sp<IFingerprintDaemonCallback> mCallback;
};

} // namespace android

#endif // FINGERPRINT_DAEMON_PROXY_H_
```
### Step two - Startup FingerprintService
Next, we will move to framework layer to find how the Fingerprint Service start up. 
open the 
[SystemServer.java](https://www.androidos.net.cn/android/7.1.1_r28/xref/frameworks/base/services/java/com/android/server/SystemServer.java)<br>
android path: root/frameworks/base/services/java/com/android/server/SystemServer.java  <br>
This class is in charge of the system service managerment, include start up the necessary service.
When Android system loads system server, starts Fingerprint Service.

```java
import com.android.server.fingerprint.FingerprintService;

if (mPackageManager.hasSystemFeature(PackageManager.FEATURE_FINGERPRINT)) {
                traceBeginAndSlog("StartFingerprintSensor");
                mSystemServiceManager.startService(FingerprintService.class);
                traceEnd();
            }
```

Keep looking into the 
[FingerprintService.java](https://www.androidos.net.cn/android/7.1.1_r28/xref/frameworks/base/services/core/java/com/android/server/fingerprint/FingerprintService.java).<br>
android path: root/frameworks/base/services/core/java/com/android/server/fingerprint/FingerprintService.java <br>
FingerprintService is a subclass of SystemService class and implements the IHwbinder interface.

```java
public class FingerprintService extends SystemService implements
IHwBinder.DeathRecipient {

    public synchronized IBiometricsFingerprint getFingerprintDaemon() {
        if (mDaemon == null) {
            Slog.v(TAG, "mDaemon was null, reconnect to fingerprint");
            try {
                mDaemon = IBiometricsFingerprint.getService();
            } catch (java.util.NoSuchElementException e) {
                // Service doesn't exist or cannot be opened. Logged below.
            } catch (RemoteException e) {
                Slog.e(TAG, "Failed to get biometric interface", e);
            }
            if (mDaemon == null) {
                Slog.w(TAG, "fingerprint HIDL not available");
                return null;
            }

            mDaemon.asBinder().linkToDeath(this, 0);

            try {
                mHalDeviceId = mDaemon.setNotify(mDaemonCallback);
            } catch (RemoteException e) {
                Slog.e(TAG, "Failed to open fingerprint HAL", e);
                mDaemon = null; // try again later!
            }

            if (DEBUG) Slog.v(TAG, "Fingerprint HAL id: " + mHalDeviceId);
            if (mHalDeviceId != 0) {
                loadAuthenticatorIds();
                updateActiveGroup(ActivityManager.getCurrentUser(), null);
                doFingerprintCleanupForUser(ActivityManager.getCurrentUser());
            } else {
                Slog.w(TAG, "Failed to open Fingerprint HAL!");
                MetricsLogger.count(mContext, "fingerprintd_openhal_error", 1);
                mDaemon = null;
            }
        }
        return mDaemon;
    }

}
```
Let's see the mehtod **getFingerprintDaemon()**, this method will acquire the fingerprint remote service object, that is, the object of fingerprint daemon (system/core/fingerprintd), which has been registered in the init.rc. Then initialize the remote service fingerprintdaemon and set the callback mDaemonCallback.

It can be seen from the above that the fingerprint service in the framework calls the fingerprint remote service of the native layer fingerprint daemon (related to the hardware), which can be regarded as the client of the fingerprint remote service fingerprint daemon.

Ok, we have already went through the working process of framework layer and how they register the system service and access the HAL code by calling the remote Fingerprint Service through Binder. Let's move to native layer in next article.