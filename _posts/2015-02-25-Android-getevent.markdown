---
layout: post
title:  "Getevent command usage"
date:   2015-02-25 20:33:04 +0800
categories: Android  
published: true
---
Android provides an ADB command `getevent` to obtain input events, such as obtaining key reporting event, obtaining touch screen reporting event, etc.

User can use this command under adb console. 

## Usage
The usage of this command is 
{% highlight shell %}
adb shell getevent [options] [device]
{% endhighlight %}
We input `adb shell getevent -h` on the CMD command line and will get the help information about this command.

{% highlight shell %}
Usage: getevent [-t] [-n] [-s switchmask] [-S] [-v [mask]] [-d] [-p] [-i] [-l] [-q]
[-c count] [-r] [device]
  -t: show time stamps
  -n: don't print newlines
  -s: print switch states for given bits
  -S: print all switch states
  -v: verbosity mask (errs=1, dev=2, name=4, info=8, vers=16, pos. events=32, 
      props=64)
  -d: show HID descriptor, if available
  -p: show possible events (errs, dev, name, pos. events)
  -i: show all device info and possible events
  -l: label event types and names in plain text
  -q: quiet (clear verbosity mask)
  -c: print given number of events then exit
  -r: print rate events are received
{% endhighlight %}

To display which input devices are on the system, use 
{% highlight shell %}
adb shell getevent 
{% endhighlight %}
the command will return all of the input devices that the system used. For below my example, there are 7 input devices that registered at dev/input. 
{% highlight shell %}
add device 1: /dev/input/event6
  name:     "sdm670-mtp-snd-card Button Jack"
add device 2: /dev/input/event5
  name:     "sdm670-mtp-snd-card Headset Jack"
add device 3: /dev/input/event4
  name:     "capsense_bottom"
add device 4: /dev/input/event3
  name:     "capsense_top"
add device 5: /dev/input/event2
  name:     "himax-touchscreen"
add device 6: /dev/input/event0
  name:     "qpnp_pon"
add device 7: /dev/input/event1
  name:     "gpio-keys"
{% endhighlight %}
Below are some examples, we can find the touchscreen input event is registered at /dev/input/event2, so we use touchscreen as a input device for the interpretion.

+ non-parameter: 
{% highlight shell %}
C:\WINDOWS\System32>adb shell getevent /dev/input/event2
0003 0030 0000000f
0003 0032 0000000f
0003 003a 0000000f
0003 0035 00000154
{% endhighlight %}
Here the first column represents the `EVENT_TYPE`, the second column displays the `EVENT_CODE` and the third column is `EVENT_VALUE`.

+ -t: display timestamp
{% highlight shell %}
C:\WINDOWS\System32>adb shell getevent -t /dev/input/event2
[    1564.568377] 0003 0030 0000000f
[    1564.568377] 0003 0032 0000000f
[    1564.568377] 0003 003a 0000000f
{% endhighlight %}
+ -r: print report rate
{% highlight shell %}
C:\WINDOWS\System32>adb shell getevent -r /dev/input/event2
0003 0032 00000027
0003 003a 00000027
0000 0000 00000000 rate 135
{% endhighlight %}
+ -p: print the event informaiton supported by the device.
{% highlight shell %}
C:\WINDOWS\System32>adb shell getevent -p /dev/input/event2
add device 1: /dev/input/event2
  name:     "himax-touchscreen"
  events:
    KEY (0001): 0066  008b  009e  00d9  014a  0244
    ABS (0003): 002f  : value 0, min 0, max 9, fuzz 0, flat 0, resolution 0
                0030  : value 0, min 0, max 200, fuzz 0, flat 0, resolution 0
                0032  : value 0, min 0, max 200, fuzz 0, flat 0, resolution 0
                0035  : value 0, min 0, max 719, fuzz 0, flat 0, resolution 0
                0036  : value 0, min 0, max 1599, fuzz 0, flat 0, resolution 0
                0039  : value 0, min 0, max 65535, fuzz 0, flat 0, resolution 0
                003a  : value 0, min 0, max 200, fuzz 0, flat 0, resolution 0
  input props:
    INPUT_PROP_DIRECT
{% endhighlight %}
+ -i: similar to -p, but will contain more information.
{% highlight shell %}
C:\WINDOWS\System32>adb shell getevent -i /dev/input/event2
add device 1: /dev/input/event2
  bus:      0000
  vendor    0000
  product   0000
  version   0000
  name:     "himax-touchscreen"
  location: ""
  id:       ""
  version:  1.0.1
  events:
    KEY (0001): 0066  008b  009e  00d9  014a  0244
    ABS (0003): 002f  : value 0, min 0, max 9, fuzz 0, flat 0, resolution 0
                0030  : value 0, min 0, max 200, fuzz 0, flat 0, resolution 0
                0032  : value 0, min 0, max 200, fuzz 0, flat 0, resolution 0
                0035  : value 0, min 0, max 719, fuzz 0, flat 0, resolution 0
                0036  : value 0, min 0, max 1599, fuzz 0, flat 0, resolution 0
                0039  : value 0, min 0, max 65535, fuzz 0, flat 0, resolution 0
                003a  : value 0, min 0, max 200, fuzz 0, flat 0, resolution 0
  input props:
    INPUT_PROP_DIRECT
{% endhighlight %}

+ -l: print the event type/event code by plain text.
{% highlight shell %}
C:\WINDOWS\System32>adb shell getevent -l /dev/input/event2
EV_ABS       ABS_MT_TOUCH_MAJOR   0000000f
EV_ABS       ABS_MT_WIDTH_MAJOR   0000000f
EV_ABS       ABS_MT_PRESSURE      0000000f
{% endhighlight %}
Compare with the default output, the `-l` output use the plain text replace the raw code of `EVENT_TYPE/EVENT_CODE/EVENT_VALUE` which is more intuitive.
+ -c: print given number of events then exit
{% highlight shell %}
C:\WINDOWS\System32>adb shell getevent -c 10  /dev/input/event2
0003 0030 0000000f
0003 0032 0000000f
0003 003a 0000000f
0003 0035 0000016d
0003 0036 00000459
0003 0039 00000025
0001 014a 00000001
0000 0000 00000000
0003 0030 00000031
0003 0032 00000031
{% endhighlight %}

normal when we debug the touchscreen, we usually use below command to obtain the input event. This command will give all information with plain text output, which is useful for obtain the image of which input event is occurring.
{% highlight shell %}
C:\WINDOWS\System32>adb shell getevent -ltr  /dev/input/event2
[    2311.461360] EV_ABS       ABS_MT_TOUCH_MAJOR   0000000f
[    2311.461360] EV_ABS       ABS_MT_WIDTH_MAJOR   0000000f
[    2311.461360] EV_ABS       ABS_MT_PRESSURE      0000000f
[    2311.461360] EV_ABS       ABS_MT_POSITION_X    0000013f
[    2311.461360] EV_ABS       ABS_MT_POSITION_Y    000003e6
[    2311.461360] EV_ABS       ABS_MT_TRACKING_ID   00000026
[    2311.461360] EV_KEY       BTN_TOUCH            DOWN
[    2311.461360] EV_SYN       SYN_REPORT           00000000
{% endhighlight %}

The source code is at [getevent.c](https://www.androidos.net.cn/android/9.0.0_r8/xref/system/core/toolbox/getevent.c).
