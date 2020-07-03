---
layout: post
title:  "Linux 系统下的多点触摸协议"
date:   2014-02-12 21:33:10 +0800
categories: Touch Linux
published: true
---
这篇文章讲一下Linux下的多点触控的协议。<br>
为了支持多点触控的设备，Linux制定了多点触摸协议（multi-touch，MT）。
Linux 下的触摸协议分为协议A(protocol A)和协议B(protocol B)。
作为都支持多点触摸的协议，那么协议A和协议B有什么区别？我们以下的篇幅里会做详细的说明。

## 协议A
主要应用于早期处理触点的设备，该类设备无法跟踪并识别每个触摸点，因此协议A里无法区分上报的信息都是由哪些触摸点触发的。内核驱动应该根据设备表面上全部有效触控进行列举并生成事件。每个触控点数据包在这次事件流中的顺序并不重要。事件过滤和手指跟踪的工作留给用户空间来实现。
内核的代码上主要是用`input_mt_sync()`函数在每个数据包的结尾对多个触控包进行分割，每一个`input_mt_sync()`都在内核引入一个SYN_MT_REPORT事件。这个事件通常表示该组数据包的结束。`input_sync()`函数表示这次传送数据帧的结束（会有多包数据），上层接收到`input_sync()`的通知后，会将之前接收的多包数据（由SYN_MT_REPORT分割）一起处理。用户层在接收到全部的数据后，根据和先前同步的触点的数据对比，运行相关的算法来进行数据触摸点的识别和追踪。<br>
一个典型的协议A的数据传输过程如下。
```c
    ABS_MT_POSITION_X x[0]
    ABS_MT_POSITION_Y y[0]
    SYN_MT_REPORT
    ABS_MT_POSITION_X x[1]
    ABS_MT_POSITION_Y y[1]
    SYN_MT_REPORT
    SYN_REPORT
```
其中SYN_MT_REPORT表示一包数据的结束，SYN_REPORT代表这次传输的结束，在SYN_REPORT之前的数据会被上层统一处理。

## 协议B
协议B针对的设备有能力鉴别并追踪触摸点。因此在上报每个点的坐标信息以外会附带上触摸点的信息（例如代表是由哪个手指触摸）。
比如ATMEL mxTouch IC 的上报信息格式。<br>
![maXTouch message]({{site.baseurl}}/assets/image/touch-protocol-b-reportid.png)

这就要求协议B里需要能够上报触摸点的信息，并能够根据不同的触摸点来打包发送数据。这样做的好处是大量的工作由底层的硬件来完成，无需上层运行算法来过滤和追踪触摸点的轨迹。
与协议A不同，协议B在每个数据包的开头以slot为参数调用`input_mt_slot()`来分离触点数据包。这会产生一个ABS_MT_SLOT事件，从而通知接收者准备所给的slot的更新。而在传送的结尾和协议A相同，都是由`input_sync()`来通知本次传送的结束。
一次协议B的数据传送过程如下。
```c
   ABS_MT_SLOT 0
   ABS_MT_TRACKING_ID 45
   ABS_MT_POSITION_X x[0]
   ABS_MT_POSITION_Y y[0]
   ABS_MT_SLOT 1
   ABS_MT_TRACKING_ID 46
   ABS_MT_POSITION_X x[1]
   ABS_MT_POSITION_Y y[1]
   SYN_REPORT
```
可以看到这次传输有两个触摸点的数据，每包数据以ABS_MT_SLOT起始，每个slot都会被分配一个ABS_MT_TRACKING_ID，不同的可识别的触摸点被打包成不同的slot数据。利用这个slot来传递对应触点的变化，触点的创建、替换和销毁是通过修改相关联slot的ABS_MT_TRACTKING_ID完成的。一个无符号的追踪id代表一个触点，值-1表示一个未使用的slot。一个未出现的过的追踪id被认为是新的，而一个不在出现的追踪id考虑被移除。因为只传递了变化的信息，每个触点的全部信息需要保存在接收端。当接收到MT事件时，简单地更新当前slot的对应属性。
当移动其中一个触摸点时，会看到如下的数据被传输。
```c
   ABS_MT_SLOT 0
   ABS_MT_POSITION_X x[0]
   SYN_REPORT
```
可见只有变化的数据被传输，而不像协议A那样，每次传输需要发送所有的数据给上层。这就显著的减少了数据的传送量。

因此协议A和协议B的区别在于协议B可以支持由硬件设备来识别和追踪触摸点并提供ABS_MT_TRACKING_ID，这样可以减少数据传输量以及上层的运算量。

此外协议还定义了触摸事件的属性，一个触摸事件最少应该包括

事件类型|含义|
---|---|
ABS_MT_POSITION_X|接触面的形心的Ｘ坐标值|
ABS_MT_POSITION_Y|接触面的形心的Ｙ坐标值|
ABS_MT_TOUCH_MAJOR|触点主轴长度|
ABS_MT_TOUCH_MINOR|触点的短轴长度|
ABS_MT_PRESSURE|接触区域上的压力|
ABS_MT_TOOL_TYPE|接触工具类型（比如手指和笔）|
ABS_MT_TRACKING_ID|为接触点分配的ID|


以上为多点触摸协议的基本内容，目前触控设备大多具备硬件识别并区分触摸点的能力，因此协议A基本上已经很少使用了。
基于协议B的驱动代码应该是基于如下的传输步骤。
```c++
//设定slot
input_mt_slot(para = ABS_MT_TRACKING_ID); 
//设定slot的状态，slot 由input_mt_slot()函数指定
input_mt_report_slot_state(para = ABS_MT_TOOL_TYPE, para = STATUS)
//发送坐标信息 
input_report_abs(para = ABS_MT_POSITION_X) 
input_report_abs(para = ABS_MT_POSITION_Y)
//传输结束
input_sync(input_dev) 
```
以下是ATMEL maXTouch IC 驱动的数据发送部分代码。
```c++
static void mxt_input_report(struct mxt_data *data, int single_id)
{
	struct mxt_finger *finger = data->finger;
	struct input_dev *input_dev = data->input_dev;
	int status = finger[single_id].status;
	int finger_num = 0;
	int id;

	for (id = 0; id < MXT_MAX_FINGER; id++) {
		if (!finger[id].status)
			continue;
		input_mt_slot(input_dev, id);
		input_mt_report_slot_state(input_dev, MT_TOOL_FINGER,
				finger[id].status != MXT_RELEASE);

		if (finger[id].status != MXT_RELEASE) {
			finger_num++;
			input_report_abs(input_dev, ABS_MT_TOUCH_MAJOR,
					finger[id].area);
			input_report_abs(input_dev, ABS_MT_POSITION_X,
					finger[id].x);
			input_report_abs(input_dev, ABS_MT_POSITION_Y,
					finger[id].y);
			input_report_abs(input_dev, ABS_MT_PRESSURE,
					finger[id].pressure);
		} else {
			finger[id].status = 0;
		}
	}

	input_report_key(input_dev, BTN_TOUCH, finger_num > 0);

	if (status != MXT_RELEASE) {
		input_report_abs(input_dev, ABS_X, finger[single_id].x);
		input_report_abs(input_dev, ABS_Y, finger[single_id].y);
		input_report_abs(input_dev,
				 ABS_PRESSURE, finger[single_id].pressure);
	}

	input_sync(input_dev);
}
```
以上代码很好的示范了我们这篇文章所讲的内容。
