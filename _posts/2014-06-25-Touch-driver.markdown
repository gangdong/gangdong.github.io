---
layout: post
title:  "触控IC驱动代码分析"
date:   2014-06-25 17:18:35 +0800
categories: touch
published: true
---
今天来讲一下touch controller IC 在android上的驱动代码。<br>
Touch Screen 作为一个input device,驱动代码当然要符合 android 对输入设备的一般性要求。<br>
实际上驱动代码完成的工作相对简单，主要有这么几个内容。<br>
+ 初始化设备
+ 完成Input device在 andorid 的注册
+ 注册中断
+ 初始化相关的文件节点
+ 上报input event给上层EventHub
+ 提供一些调试接口

下面就以ATMEL MAXTOUCH IC 的驱动代码为例，分析相关的实现。源码请参考 github 的项目主页 [github 源码]()


首先Touch IC 是一个I2C的设备，因此需要在内核里注册I2C的设备并和驱动代码匹配。
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


<br>
<br>
作者：David Dong<br>
来源：https://gangdong.github.io/daviddong-blog.github.io/java/android/2019/04/14/bundle.html<br>
转载请注明出处。