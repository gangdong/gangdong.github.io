---
layout: post
title:  "ATMEL maXTouch IC驱动代码分析"
date:   2014-06-25 17:18:35 +0800
categories: C Touch Linux
published: true
---
今天来讲一下touch controller IC 在android上的驱动代码。<br>
Touch Screen 作为一个input device, 驱动代码当然要符合 android 对输入设备的一般性要求。<br>
实际上驱动代码完成的工作相对简单，主要有以下这么几个内容。<br>

+ 初始化设备
+ 完成Input device在 andorid 的注册
+ 注册中断
+ 初始化相关的系统文件节点
+ 上报input event给上层EventHub
+ 提供一些调试接口

下面就以ATMEL maXTouch IC 的驱动代码为例，分析相关的实现过程。 源码请参考 github 的项目主页<br> 
[github 源码](https://github.com/atmel-maxtouch/maXTouch_linux)

首先Touch IC 是一个I2C的设备，因此需要在内核里注册I2C的设备并和驱动代码匹配。有关内核搜索设备驱动并和注册设备匹配的内容可以去参考相关的文档，这里需要注意的是 i2c_device_id 里的ID名称一定要和设备树里面注册的ID名称一致。才能保证内核会加载到正确的驱动代码。
```c
static const struct i2c_device_id mxt_id[] = {
	{ "qt602240_ts", 0 },
	{ "atmel_mxt_ts", 0 },
	{ "mXT224", 0 },
	{ }
};
MODULE_DEVICE_TABLE(i2c, mxt_id);

static struct i2c_driver mxt_driver = {
	.driver = {
		.name	= "atmel_mxt_ts",
		.owner	= THIS_MODULE,
#ifdef CONFIG_PM
		.pm	= &mxt_pm_ops,
#endif
	},
	.probe		= mxt_probe,
	.remove		= __devexit_p(mxt_remove),
	.id_table	= mxt_id,
};

static int __init mxt_init(void)
{
	return i2c_add_driver(&mxt_driver);
}

static void __exit mxt_exit(void)
{
	i2c_del_driver(&mxt_driver);
}

module_init(mxt_init);
module_exit(mxt_exit);
```
内核在加载到该设备的驱动后会执行Probe()函数对设备进行初始化。在probe()函数中驱动主要完成的内容有
```c
static int __devinit mxt_probe(struct i2c_client *client,
		const struct i2c_device_id *id)
{
	const struct mxt_platform_data *pdata = client->dev.platform_data;
	struct mxt_data *data;
	struct input_dev *input_dev;
	int error;

	if (!pdata)
		return -EINVAL;

	data = kzalloc(sizeof(struct mxt_data), GFP_KERNEL);
	input_dev = input_allocate_device();
	if (!data || !input_dev) {
		dev_err(&client->dev, "Failed to allocate memory\n");
		error = -ENOMEM;
		goto err_free_mem;
	}
```
这里面结构体input_dev用于描述一个输入子系统设备，何驱动设备如果想标明自己是输入设备，都应该通过初始化这样的结构体。input_allocate_device()这个函数会为input_dev这个结构体申请内存并完成这个结构体在内核中的注册。关于这个函数的说明请参考我的另一篇文章 [另一篇文章]()
```c
/* Initialize i2c device */
	error = mxt_initialize(data);
```
接下来要执行mxt_initialize()这个函数来做设备的硬件初始化。我们来看看硬件初始化里面都做了哪些事情。
```c
static int mxt_initialize(struct mxt_data *data)
{
	struct i2c_client *client = data->client;
	struct mxt_info *info = &data->info;
	int error;

	error = mxt_get_info(data);
	if (error) {
		error = mxt_probe_bootloader(data);

		if (error) {
			return error;
		} else {
			data->state = BOOTLOADER;
			return 0;
		}
	}

	dev_info(&client->dev,
		"Family ID: %d Variant ID: %d Version: %d.%d "
		"Build: 0x%02X Object Num: %d\n",
		info->family_id, info->variant_id,
		info->version >> 4, info->version & 0xf,
		info->build, info->object_num);

	data->state = APPMODE;

	data->object_table = kcalloc(info->object_num,
				     sizeof(struct mxt_object),
				     GFP_KERNEL);
	if (!data->object_table) {
		dev_err(&client->dev, "Failed to allocate memory\n");
		return -ENOMEM;
	}

	/* Get object table information */
	error = mxt_get_object_table(data);
	if (error) {
		dev_err(&client->dev, "Error %d reading object table\n", error);
		return error;
	}

	error = mxt_check_message_length(data);
	if (error)
		return error;

	error = mxt_probe_power_cfg(data);
	if (error) {
		dev_err(&client->dev, "Failed to initialize power cfg\n");
		return error;
	}

	/* Check register init values */
	error = mxt_check_reg_init(data);
	if (error) {
		dev_err(&client->dev, "Failed to initialize config\n");
		return error;
	}

	error = mxt_read_resolution(data);
	if (error) {
		dev_err(&client->dev, "Failed to initialize screen size\n");
		return error;
	}

	return 0;
}
```
我们看到首先要从芯片内部读取相关的设备信息(芯片型号，版本信息等)，这些信息是存储在芯片内部memeory的固定的地址。调用的函数mxt_get_info()，该函数的返回值表示读取的结果，如果不为零说明读取失败，芯片状态异常，这时要通过发送命令让芯片进入bootloader模式(mxt_probe_bootloader()函数)，重新复位。
```c
error = mxt_get_info(data);
```
如果读取正确，设置芯片状态为APP_MODE，这时会读取object_table，ATMEL的Touch IC内部维护了一个寄存器的地址列表，不同型号的IC，该地址列表内容有所不同。通过读取该列表来初始化寄存器的地址。从而可以正确读写内部寄存器。具体的内容需要参考芯片的技术手册。
```c
error = mxt_get_object_table(data);
```
拿到寄存器的地址后，要读取一些寄存器的值来获取相关的状态（寄存器在芯片出厂厂测时会被写入初始的值）。
```c
error = mxt_check_message_length(data);
	if (error)
		return error;

	error = mxt_probe_power_cfg(data);
	if (error) {
		dev_err(&client->dev, "Failed to initialize power cfg\n");
		return error;
	}

	/* Check register init values */
	error = mxt_check_reg_init(data);
	if (error) {
		dev_err(&client->dev, "Failed to initialize config\n");
		return error;
	}
```
最后一步是读取寄存器内部配置的显示屏的分辨率信息，为以后上报touch event的坐标数据做准备。
```c
error = mxt_read_resolution(data);
```
到这里，刚才提到的第一步针对芯片硬件的初始化就完成了。
接下来要完成
+ 完成Input device在 andorid 的注册
+ 注册中断
+ 初始化相关的文件节点

```c
/* Initialize input device */
	input_dev->name = "Atmel maXTouch Touchscreen";
	input_dev->id.bustype = BUS_I2C;
	input_dev->dev.parent = &client->dev;
	input_dev->open = mxt_input_open;
	input_dev->close = mxt_input_close;

	__set_bit(EV_ABS, input_dev->evbit);
	__set_bit(EV_KEY, input_dev->evbit);
	__set_bit(BTN_TOUCH, input_dev->keybit);

	/* For single touch */
	input_set_abs_params(input_dev, ABS_X,
			     0, data->max_x, 0, 0);
	input_set_abs_params(input_dev, ABS_Y,
			     0, data->max_y, 0, 0);
	input_set_abs_params(input_dev, ABS_PRESSURE,
			     0, 255, 0, 0);

	/* For multi touch */
	input_mt_init_slots(input_dev, MXT_MAX_FINGER);
	input_set_abs_params(input_dev, ABS_MT_TOUCH_MAJOR,
			     0, MXT_MAX_AREA, 0, 0);
	input_set_abs_params(input_dev, ABS_MT_POSITION_X,
			     0, data->max_x, 0, 0);
	input_set_abs_params(input_dev, ABS_MT_POSITION_Y,
			     0, data->max_y, 0, 0);
	input_set_abs_params(input_dev, ABS_MT_PRESSURE,
			     0, 255, 0, 0);

	input_set_drvdata(input_dev, data);

	error = input_register_device(input_dev);
	if (error) {
		dev_err(&client->dev, "Error %d registering input device\n",
			error);
		goto err_free_irq;
	}
```
以上为注册Input device的代码，这里涉及到Linux input 设备的初始化，需要调用__set_bit(), input_set_abs_params()函数来完成输入设备的一些必要的配置，比如多少个手指，分辨率是多少等，具体可以参考相关的文档。<br>
最后调用input_register_device()函数来将刚才配置好的Input device注册到kernel中去。
关于申请中断就比较简单，需要调用request_threaded_irq()函数，该函数的参数中需要传入 
1. 该设备申请的中断号，这个在DTS中定义。 
2. 中断处理函数名 
3. 中断的类型 
4. 驱动的名字

```c
error = request_threaded_irq(client->irq, NULL, mxt_interrupt,
			pdata->irqflags, client->dev.driver->name, data);
	if (error) {
		dev_err(&client->dev, "Error %d registering irq\n", error);
		goto err_free_object;
	}
```
最后的步骤是注册sys文件节点，后期通过读写这些文件节点可以完成对芯片的特定操作，比如升级固件，配置文件等。
```c
error = sysfs_create_group(&client->dev.kobj, &mxt_attr_group);
	if (error) {
		dev_err(&client->dev, "Failure %d creating sysfs group\n",
			error);
		goto err_unregister_device;
	}
```
sysfs_create_group()这个函数需要传入一个 attribute_group 结构体的地址。这个地址实际上指向了一个文件属性 attribute 类型的指针数组，通过该数组可以引用到文件节点操作的函数。

```c
static struct attribute *mxt_attrs[] = {
	&dev_attr_update_fw.attr,
	&dev_attr_debug_enable.attr,
	&dev_attr_pause_driver.attr,
	NULL
};
```
至此，驱动的加载已经完成，该驱动支持的设备已经可以正常使用。当然驱动代码还有其他的一些任务，比如定义系统休眠，唤醒时的操作。实际上就是设备上下电相关的一些操作。如果需要更改设备上下电时的策略，则要对mxt_start()和mxt_stop()两个函数内容进行修改。
```c
static int mxt_suspend(struct device *dev)
{
	struct i2c_client *client = to_i2c_client(dev);
	struct mxt_data *data = i2c_get_clientdata(client);
	struct input_dev *input_dev = data->input_dev;

	mutex_lock(&input_dev->mutex);

	if (input_dev->users)
		mxt_stop(data);

	mutex_unlock(&input_dev->mutex);

	return 0;
}

static int mxt_resume(struct device *dev)
{
	struct i2c_client *client = to_i2c_client(dev);
	struct mxt_data *data = i2c_get_clientdata(client);
	struct input_dev *input_dev = data->input_dev;

	/* Soft reset */
	mxt_soft_reset(data, MXT_RESET_VALUE);

	mutex_lock(&input_dev->mutex);

	if (input_dev->users)
		mxt_start(data);

	mutex_unlock(&input_dev->mutex);

	return 0;
}

```
最后也是最重要的就是中断处理程序了，驱动代码要在中断处理程序中将触摸事件转成input_event_message类型的数据帧，发给内核的EVENT_HUB来处理。
```c
static irqreturn_t mxt_interrupt(int irq, void *dev_id)
{
	struct mxt_data *data = dev_id;
	struct mxt_message message;
	struct mxt_object *object;
	struct device *dev = &data->client->dev;
	int touchid;
	u8 reportid;

	do {
		if (mxt_read_message(data, &message)) {
			dev_err(dev, "Failed to read message\n");
			goto end;
		}

		reportid = message.reportid;

		object = mxt_get_object(data, MXT_TOUCH_MULTI_T9);
		if (!object)
			goto end;

		if (reportid >= object->min_reportid
			&& reportid <= object->max_reportid) {
			touchid = reportid - object->min_reportid;
			mxt_input_touchevent(data, &message, touchid);
		} else {
			object = mxt_get_object(data, MXT_GEN_COMMAND_T6);
			if (!object)
				goto end;

			if ((reportid == object->max_reportid)
				&& (message.message[0] & MXT_STATUS_CFGERROR))
				dev_err(dev, "Configuration error\n");
		}
	} while (reportid != MXT_RPTID_NOMSG);

end:
	return IRQ_HANDLED;
}
```
可以看到，在中断处理函数中使用了轮询的方法，通过mxt_read_message()函数来读取IC准备好的数据，直到所有数据都被读取，然后调用mxt_input_touchevent()函数将读取的数据打包发送。
mxt_input_touchevent()函数的实现如下。
```c
static void mxt_input_touchevent(struct mxt_data *data,
				      struct mxt_message *message, int id)
{
	struct mxt_finger *finger = data->finger;
	struct device *dev = &data->client->dev;
	u8 status = message->message[0];
	int x;
	int y;
	int area;
	int pressure;

	if (data->driver_paused)
		return;

	if (id > MXT_MAX_FINGER) {
		dev_err(dev, "MXT_MAX_FINGER exceeded!\n");
		return;
	}

	/* Check the touch is present on the screen */
	if (!(status & MXT_DETECT)) {
		if (status & MXT_SUPPRESS) {
			dev_dbg(dev, "[%d] suppressed\n", id);

			finger[id].status = MXT_RELEASE;
			mxt_input_report(data, id);
		} else if (status & MXT_RELEASE) {
			dev_dbg(dev, "[%d] released\n", id);

			finger[id].status = MXT_RELEASE;
			mxt_input_report(data, id);
		}
		return;
	}

	/* Check only AMP detection */
	if (!(status & (MXT_PRESS | MXT_MOVE)))
		return;

	x = (message->message[1] << 4) | ((message->message[3] >> 4) & 0xf);
	y = (message->message[2] << 4) | ((message->message[3] & 0xf));
	if (data->max_x < 1024)
		x = x >> 2;
	if (data->max_y < 1024)
		y = y >> 2;

	area = message->message[4];
	pressure = message->message[5];

	dev_dbg(dev, "[%d] %s x: %d, y: %d, area: %d\n", id,
		status & MXT_MOVE ? "moved" : "pressed",
		x, y, area);

	finger[id].status = status & MXT_MOVE ?
				MXT_MOVE : MXT_PRESS;
	finger[id].x = x;
	finger[id].y = y;
	finger[id].area = area;
	finger[id].pressure = pressure;

	mxt_input_report(data, id);
}
```
mxt_input_touchevent()是十分重要的函数，在这个函数里会根据读取到的数据判断当前touch的状态，比如手指是抬起，抑制还是按压，移动。针对不同的状态会发送不同的消息类型给上层。具体的传送通过mxt_input_report()函数执行。
mxt_input_report()的函数体如下。
```c
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
mxt_input_report()主要调用了如下的Linux kernel函数来上报消息。<br>
+ input_mt_slot()
+ input_mt_report_slot_state()
+ input_report_abs()
+ input_report_key()
+ input_sync()

其中 input_mt_slot() 是指明当前上报的slot号，目前的代码使用的是protocol B协议来处理touch事件，protocol B 会为每个手指分配一个slot，不同手指的数据会被封装到不同的slot中，这样可以保证不同的手指消息被区分开来传送。可以更好的支持多指触控(不同于协议A，触控IC 的firmware可以计算划分不同的手指信息，无需上层的算法参与，可以提高响应速度)，详细的内容可以参考。
input_mt_report_slot_state()是设定当前slot的状态，比如按下，抬起等。
如果是按下状态，还要调用input_report_abs()函数来上报当前的坐标信息。
如果是按键事件，调用input_report_key()来上报当前的按键信息。
最后input_sync()来将所有的信息打包成一个数据帧来发送，注意如果不执行这个函数，之前的信息无效，不会被发送给上层。

好了，到这里整个驱动代码所要完成的主要任务都已经完成了。从整个流程来看虽然比较简单，但是触控IC的驱动程序作为硬件设备和Linux kernel的接口，还是起到了非常重要的作用。对于设备的驱动代码，还是要十分重视。<br>
<!-- Gitalk 评论 start  -->
<!-- Link Gitalk 的支持文件  -->
<link rel="stylesheet" href="https://unpkg.com/gitalk/dist/gitalk.css">
<script src="https://unpkg.com/gitalk/dist/gitalk.min.js"></script>
<div id="gitalk-container"></div>
<script type="text/javascript">
   var gitalk = new Gitalk({

   // gitalk的主要参数
   clientID: '5e24fc307693a6df3bc5',
   clientSecret: '28c9c17e1174c705c42e9bdc92f87cadcc4ec8b8',
   repo: 'daviddong.github.io',
   owner: 'gangdong',
   admin: ['gangdong'],
   id: 'c/touch/linux/2014/06/25/Touch-driver.html',
   title: 'comments'
    });
   gitalk.render('gitalk-container');
</script>
<!-- Gitalk end -->

<br><br><br>

<font size="2" color="#aaa">作者：David Dong<br></font>
<font size="2" color="#aaa">来源：https://gangdong.github.io/daviddong.github.io/c/touch/linux/2014/06/25/Touch-driver.html</font>
<font size="2" color="#aaa">转载请注明出处。</font>
<span id="busuanzi_container_page_pv" ></span><font size="2" color="#aaa">
本文总阅读量</font><font size="2" color="#aaa"><span id="busuanzi_value_page_pv"></font></span><font size="2" color="#aaa">次</font>