---
layout: post
title:  "Some useful knowledge for Fingerprint Application on Trusty TEE"
date:   2020-12-02 22:24:12 +0800
categories: Android Fingerprint
Published: true
toc: true
sidebar: true
---
I have completed a Android platform fingerprint implementation on Trusty TEE recently for working requirement. This page will try to give some useful information, which is a summary of my work and might be helpful for somebody who want to bring up fingerprint application on Trusty TEE.

{% if page.sidebar == false %}
<div class = "separator"></div>
## Index

1. [About Trusty TEE](#1)
2. [Memory Restriction of Trusty TEE](#2)
    + [2.1 Max Memory](#2.1)
    + [2.2 Max buffer size for communication between CA and TA](#2.2)
3. [TEE Communication](#3)
4. [About SPI usage](#4)
5. [Others](#5)
    + [5.1  How to build Trusty TEE image](#5.1)
        + [5.1.1 Toolchain](#5.1.1)
        + [5.1.2 Build](#5.1.2)
        + [5.1.3 Output Image](#5.1.2)
    + [5.2 Useful Tools](#5.2)
        + [5.2.1 uuidgen ](#5.2.1)
        + [5.2.2 addr2line](#5.2.2)
        + [5.2.3 signta.py](#5.2.3)
    + [5.3 Log Indication](#5.3)
        + [5.3.1 TA load successfully](#5.3.1)
        + [5.3.2 Failure with TA wasn't signed or signatue wasn't match](#5.3.2)
        + [5.3.3 TA APP wasn't running properly, CA lost communication](#5.3.2)

<div class = "separator"></div>
{% endif %}
## <span id ="1">1. Trusty TEE</span>
As one of the biometric authentication on Android platform, fingerprint implementation must meet android security specifications. Android uses a separated secure Operating System (OS) to guarantee the security of biometric application - we call it TEE (Trusted Execution Environment), Which runs on the same processor as the Android OS and is isolated from the rest of the system by both hardware and software. They run parallel to each other but secure OS has access to the full power of a device’s main processor and memory but is completely isolated. 

There are multiple commercial TEE OS on the Android platform supported by the third-part companies, Such as QSEE, ISEE, TBase and so on. Trusty is one of them and unlike them Trusty TEE is supported by Google. Trusty TEE is trying to provide the users a reliable and free open source alternative for their Trusted Execution Environment.

Google official documents provides more information about
[「Trusty TEE」](https://source.android.com/security/trusty).
## <span id ="2">2. Memory Restriction of Trusty TEE</span>
### <span id ="2.1">2.1 Max available memory</span>
The total memory that Trusty TEE can provide is 32M, suggests allocate 10M memory (heap + stack + ta image self) for fingerprint to use. For example, using 6M heap and 3M stack.
### <span id ="2.2">2.2 Max buffer size for communication between CA and TA</span>
+ a. The communication between CA and TA is limited in size, and the overall size is limited to 128KB, including message header. Therefore, the buffer size `TAC_SHARED_BUFFER_SIZE` should be less than 128K.
{% highlight console %}
#define TAC_SHARED_BUFFER_SIZE 1024 * 120 //should not be greater than 128k
{% endhighlight %}
+ b. Accordingly, the actual data size that can be used for effective transmission between CA and TA is limited to 
{% highlight ruby %}
1024 x 128 - sizeof(union ta_target_commands) - sizeof(int32_t)
{% endhighlight %}
{% highlight console %}
/* ISEE may need extra room for their own header */
#if defined(ISEE)
#define MAX_CHUNK ((SECURE_BUFFER_MAX_SIZE) - (MAX_COMMAND_SIZE) - 64)
#elif defined(TOS)
#define MAX_CHUNK ((SECURE_BUFFER_MAX_SIZE) - (MAX_COMMAND_SIZE) - 4)
#else
#define MAX_CHUNK ((SECURE_BUFFER_MAX_SIZE) - (MAX_COMMAND_SIZE))
#endif
{% endhighlight %}
+ c. When the data to be transferred is greater than the maximum limit, consider transferring in batches.
+ d. Change the size of heap and stack in the manifest file.
{% highlight c %}
trusty_app_manifest_t TRUSTY_APP_MANIFEST_ATTRS trusty_app_manifest =
   {
 
        /* UUID : {4304bef6-36e5-4d90-94b0-1ea4cd51d40b} */
       /* { 0x4304bef6, 0x36e5, 0x4d90,
        { 0x94, 0xb0, 0x1e, 0xa4, 0xcd, 0x51, 0xd4, 0x0b } }, */
      { 0x4304bef6, 0x36e5, 0x4d91,
        { 0x94, 0xb0, 0x1e, 0xa4, 0xcd, 0x51, 0xd4, 0x0c } },
 
     /* optional configuration options here */
    {
        /*apply 6M heap and 3M stack*/
       TRUSTY_APP_CONFIG_MIN_HEAP_SIZE(6*1024*1024),
       TRUSTY_APP_CONFIG_MIN_STACK_SIZE(3 * 1024 * 1024),
      },
    };
{% endhighlight %}

## <span id ="3">3. TEE Communication</span>
+ a. Adopt the dynamic TA mechanism which will load TA and run TA's main function when CA calls function `connect()`. When CA calls `disconnect()` the TA process exits. Therefore, in a life cycle, there is no  need to connect or disconnect each IPC communication.<br>
+ b. There are many IPC communications between CA and TA. Every time IPC communication, the buffer received and sent by CA needs to be reallocated. The same buffer should not be used by IPC multiple times. In our code this method has already been implemented.<br>
+ c. Trusty TEE provides 2 ports for communication, `secure port` and `non-secure port`. <br>
   **Secure port** - for other TA app access.<br>
   **Non secure port** - for CA access TA app.<br>
   For fingerprint, it needs to use `non-secure port` and if has payment requirement, needs to use `secure port`.<br>
+ d. Should define the same port name between CA and TA, An example that we are using "com.android.trusty.fpctzapp".<br>
+ e. Should use unique uuid to differentiate with other fingerprint vendor.<br>
+ f. About IPC: the Trusty APIs use 
{% highlight c %}
send_msg()
get_msg()
read_msg()
put_msg()
{% endhighlight %}
to send/retrieve message between CA and TA, the calling sequence should be correct. One lesson learn in my software bring up is that the communication was failed after executed one time successful communication. The communication was hang up after then and TA wasn't able to get the message from CA. The failure was due to missing the `put_msg()` calling after executed `read_msg()`.

{% highlight c %}
static long handle_msg(tzapp_chan_ctx_t* ctx)
{
handle_t chan = ctx->chan;
 
/* get message info */
ipc_msg_info_t msg_inf;
uint8_t* msg_buf = NULL;
long rc = get_msg(chan, &msg_inf);
if (rc == ERR_NO_MSG)
return NO_ERROR; /* no new messages */
 
// fatal error
if (rc != NO_ERROR) {
LOGE("Trusty: failed (%ld) to get_msg for chan (%d), closing connection", rc, chan);
return rc;
}
 
//MessageDeleter md(chan, msg_inf.id);
 
// allocate msg_buf, with one extra byte for null-terminator
msg_buf = (uint8_t*) malloc(msg_inf.len + 1);
LOGD("Trusty: handle_msg msg_inf.len = %d", msg_inf.len);
if (!msg_buf) {
LOGE("Trusty: msg_buf failed to malloc");
return ERR_NO_MEMORY;
}
 
/* read msg content */
struct iovec iov = {msg_buf, msg_inf.len};
ipc_msg_t msg = {1, &iov, 0, NULL};
 
memset(msg_buf, 0, msg_inf.len + 1);
rc = read_msg(chan, msg_inf.id, 0, &msg);
 
int rc_ = put_msg(chan, msg_inf.id); // change to put_msg more early
 
// fatal error
if (rc < 0) {
LOGE("Trusty: failed to read msg (%ld)", rc);
goto out;
}
 
if (((unsigned long)rc) < msg_inf.len) {
LOGE("Trusty: invalid message of size (%ld)", rc);
rc = ERR_NOT_VALID;
goto out;
}
 
if (rc_ != NO_ERROR)
{
LOGE("Trusty: failed (%d) to put_msg for chan (%d)\n", rc, chan);
return rc_;
}
 
int32_t rsp;
void* addr = (void *)msg_buf;
rsp = ctx->dispatch(ctx, addr, msg_inf.len);
 
rc = send_response(chan, addr, msg_inf.len, &rsp);
out:
if (msg_buf) {
free(msg_buf);
}
return rc;
}
{% endhighlight %}

## <span id ="4">4. About SPI usage</span>
It is related to hardware platform, on Spreadtrum SC9863, it doesn't need to configure SPI and will only use `ioctl()` for transmission.

## <span id ="5">5. Others</span>

### <span id ="5.1">5.1 How to build Trusty TEE image</span>
<span id = "5.1.1">**5.1.1 Toolchain**</span> <br>
It is recommended to use the arm-eabi-4.8 tool chain of Android code package:<br>
{% highlight shell %}
export PATH=$PATH:<AOSP>/prebuilts/gcc/linux-x86/arm/arm-eabi-4.8/bin
{% endhighlight %}

<span id = "5.1.2">**5.1.2 Build**</span>    
put the TA code fpctzapp into SDK app/demo/ folder.<br>
run command <br>
{% highlight c %}
make M="app/demo/fpctzapp:TA"
{% endhighlight %}

<span id = "5.1.3">**5.1.3 Output Image**</span><br>
output two image files fpctzapp.elf and fpctzapp.syms.elf (which contains symbol table for debug purpose)

### <span id = "5.2">5.2 Useful Tools</span>
<span id = "5.2.1">**5.2.1 uuidgen**</span><br>
Output two image files `fpctzapp.elf` and `fpctzapp.syms.elf` (which contains symbol table for debug purpose)<br>
<span id = "5.2.2">**5.2.2 addr2line**</span>   
To find the line number of error occurrence from symbol table. In the bsp/toolchain/prebuilts/gcc/linux-x86/arm/arm-eabi-4.8/bin/ folder<br>
<span id = "5.2.3">**5.2.3 signta.py**</span>  
Signature tool for signing the TA image. In the "vendor/sprd/proprietories-source/packimage_scripts/signimage/dynamicTA/" direction.<br>
{% highlight console %}
python signta.py --uuid {UUID} --key “privatekey.pem” --in “TA image name without signed” --out “signed TA image name”.
{% endhighlight %}

command for signature.
{% highlight console %}
python signta.py --uuid {UUID} --key “privatekey.pem” --in “TA image name without signed” --out “signed TA image name”
{% endhighlight %}
### <span id = "5.3">5.3 Logs Indication</span>
<span id="5.3.1">**5.3.1 TA load successfully**</span>  
{% highlight c %}
 [ 68.183207] c4 246 trusty: ta_manager_wait_load:382: ta_manager_wait_load com.android.trusty.fpctzapp 
 [ 68.185949] c4 246 trusty: ta_manager_write_ta:485: ta_manager_write_ta: new ta! 
 [ 68.188528] c0 181 trusty: ta_manager_write_ta:573: ta_manager_write_ta, load com.android.trusty.fpctzapp accomplished!
{% endhighlight %}

<span id = "5.3.2">**5.3.2 Failure with TA wasn't signed or signatue wasn't match**</span>  
{% highlight c %}
 [ 30.866766] c1 trusty: ta_manager_write_ta:538: ta_manager_write_ta: new ta! 
 [ 30.999062] c0 trusty: ta_manager_handle_msg:760: ta_manager_handle_request failed -17!
{% endhighlight %}

<span id = "5.3.3">**5.3.3 TA APP wasn't running properly, CA lost communication**</span> 
{% highlight console %}
 libtrusty: tipc_connect: can't connect to tipc service "com.android.trusty.fpctzapp" (err=107)
{% endhighlight %}
  
