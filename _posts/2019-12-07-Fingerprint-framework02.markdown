---
layout: post
title:  "Android Fingerprint Framework (2)"
date:   2019-12-07 23:52:01 +0800
categories: Android Fingerprint
Published: true
---
This blog will follow the last article to introduce the android fingerprint framework from the source code inspecting.

1. Step one - startup fingerprintd service
looking at the init.rc file, this task is assigned at init.rc when the android system boots up, start the fingerprint daemon service.
```
service fingerprintd /system/bin/fingerprintd
class late_start
user root
group root sdcard_r sdcard_rw
``` 
let's check the fingerprintd program.<br> 
Here recommend a useful website for your view/investigate the android source code. [Android Community](https://www.androidos.net.cn/android/10.0.0_r6/xref)

we can see the path is system/core/fingerprintd/ and the directory structure is as below.
![fingerprintd directory structure](https://gangdong.github.io/daviddong.github.io/assets/image/android-fingerprint-framework2-fingerprintd-directory.png)
read the Android.mk
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
This package is built as a executable programm.
open the [fingerprintd.cpp](https://www.androidos.net.cn/android/7.1.1_r28/xref/system/core/fingerprintd/fingerprintd.cpp)
the task of the main() is very simple, just create a FingerprintDaemonProxy object and add it into the service queue. 
```c++
#include "FingerprintDaemonProxy.h"

int main() {
    ALOGI("Starting " LOG_TAG);
    android::sp<android::IServiceManager> serviceManager = android::defaultServiceManager();
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
from the FingerprintDaemonProxy.h, we find the remote service is fingerprint daemon. Fingerprinted registers the remote service to the servcemanager for the customer to call.
The protocol interface is IFingerprintdaemon. Fingerprintservice in the framework will eventually call the remote service, that is, the method in fingerprintdaemonproxy.cpp.
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
        virtual int32_t enroll(const uint8_t* token, ssize_t tokenLength, int32_t groupId, int32_t timeout);
        virtual uint64_t preEnroll();
        virtual int32_t postEnroll();
        virtual int32_t stopEnrollment();
        virtual int32_t authenticate(uint64_t sessionId, uint32_t groupId);
        virtual int32_t stopAuthentication();
        virtual int32_t remove(int32_t fingerId, int32_t groupId);
        virtual int32_t enumerate();
        virtual uint64_t getAuthenticatorId();
        virtual int32_t setActiveGroup(int32_t groupId, const uint8_t* path, ssize_t pathLen);
        virtual int64_t openHal();
        virtual int32_t closeHal();

    private:
        FingerprintDaemonProxy();
        virtual ~FingerprintDaemonProxy();
        void binderDied(const wp<IBinder>& who);
        void notifyKeystore(const uint8_t *auth_token, const size_t auth_token_length);
        static void hal_notify_callback(const fingerprint_msg_t *msg);

        static FingerprintDaemonProxy* sInstance;
        fingerprint_module_t const* mModule;
        fingerprint_device_t* mDevice;
        sp<IFingerprintDaemonCallback> mCallback;
};

} // namespace android

#endif // FINGERPRINT_DAEMON_PROXY_H_
```
2. Step two - Startup FingerprintService
Next, we will move to framework layer to find how the fingerprint service start up. 
open the SystemServer.java file at /frameworks/base/services/java/com/android/server/SystemServer.java  
this class is incharge of the system service operation, include start up the necessary service.
When Android system loads system server, start fingerprint service.

```
import com.android.server.fingerprint.FingerprintService;

if (mPackageManager.hasSystemFeature(PackageManager.FEATURE_FINGERPRINT)) {
                traceBeginAndSlog("StartFingerprintSensor");
                mSystemServiceManager.startService(FingerprintService.class);
                traceEnd();
            }
```

keep finding the [FingerprintService.java](https://gangdong.github.io/daviddong.github.io/assets/docs/FingerprintService.java).
the path is /frameworks/base/services/core/java/com/android/server/fingerprint/FingerprintService.java
FingerprintService is a subclass of SystemService class and implements the IHwbinder interface.

```
public class FingerprintService extends SystemService implements IHwBinder.DeathRecipient {


}
```