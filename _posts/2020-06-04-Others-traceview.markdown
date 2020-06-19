---
layout: post
title:  "Use TraceView to trace windows driver log"
date:   2020-06-04 20:14:41 +0800
categories: Others
Published: true
---
### What is TraceView?
For the windows driver development as what I am doing these days, Microsoft provides a log printing and log viewing mechanism, which can view the logs of specified driver files, filter the logs according to `LEVEL` and `FLAG`, or save them as files. This mechanism is WPP and  `TraceView.exe`.

The usage is simple, WDF framework has built in the function and enclosed the WPP into the `trace.h`.
The driver program imports the header file and add `TraceEvents()` method to the place where needs to print log. Use the `TraceView.exe` application to capture and view the logs when the driver program running.  
```c
TraceEvents(TRACE_LEVEL_INFORMATION, DBG_INIT, "log_name");
```
The first two parameters of this method represents the `LEVEL` and `FLAG` which will be used to control the logs output level and type.

### How to use?
+ In Windows10, the `TraceView.exe` is putted into the folder at `WDK install path`, normally the default installation path is `C:\Program Files (x86)\Windows Kits\10\Tools\x64`. 

+ Run the `TraceView.exe` application and create a new log section. 
![traceview]({{site.baseurl}}/assets/image/others-traceview-01.PNG){: .center-image }

+ Click `Add Provider` and select the PDB file of your driver program. 
![traceview]({{site.baseurl}}/assets/image/others-traceview-02.PNG){: .center-image }
The trace provider will generate trace event messages.

+ Click `Next` button and choose `Set Flag and Level`, in the pop window right click `Level` and select the `print level` of the log. Suggest to select `verbose` to print the logs as much as possible in the debug phase.  
![traceview]({{site.baseurl}}/assets/image/others-traceview-03.PNG){: .center-image }
Click 'OK' button to complete the configuration. 

+ Start running the driver program and the TraceView will output the logs that printed by TraceEvents() in the code.
![traceview]({{site.baseurl}}/assets/image/others-traceview-04.PNG){: .center-image }

Recommend some articles for the WPP/TraceView introduction.
[https://blog.csdn.net/xiangbaohui/article/details/106424665](https://blog.csdn.net/xiangbaohui/article/details/106424665)  
[https://blog.csdn.net/u012308586/article/details/94429941](https://blog.csdn.net/u012308586/article/details/94429941)  
[https://docs.microsoft.com/zh-cn/windows-hardware/drivers/devtest/enabling-wpp-tracing-through-windows-event-log](https://docs.microsoft.com/zh-cn/windows-hardware/drivers/devtest/enabling-wpp-tracing-through-windows-event-log)