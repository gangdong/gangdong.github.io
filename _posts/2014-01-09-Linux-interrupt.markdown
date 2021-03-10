---
layout: post
title:  "Linux 添加中断处理"
date:   2014-01-09 23:54:06 +0800
categories: Linux
published: true
---
Linux 中断子系统的内部实现机制比较复杂，如果想讲清楚需要较长的篇幅才行，本文只从应用的角度介绍如何注册中断并添加中断处理函数到代码中，不对其内部的实现机制做太多阐述。

下面以我自己的代码为例，说明一下如何添加中断的处理。

---
## 目录

1. [中断](#1)
2. [中断初始化](#2)
    + [2.1 申请GPIO做为中断源](#2.1)
    + [2.2 设定中断属性](#2.2)
    + [2.3 注册中断，并绑定到中断服务程序](#2.3)
    + [2.4 使能中断](#2.4)
3. [中断处理程序](#3)

---

## <span id="1">1. 中断</span>
中断是指在CPU正常运行期间，由于内外部事件或由程序预先安排的事件引起的CPU暂时停止正在运行的程序，转而为该内部或外部事件或预先安排的事件服务的程序中去，服务完毕后再返回去继续运行被暂时中断的程序。

## <span id="2">2. 中断初始化</span>
以下代码实现了注册一个中断处理到Linux系统中，省略了无关部分。

{% highlight c %}
static int dev_probe(struct platform_device *pdev)
{
	struct device *dev = &pdev->dev;
	struct dev_ctl_data *dev_ctl = devm_kzalloc(dev, sizeof(*dev_ctl),
	GFP_KERNEL);
	int rc;

	...
	mutex_lock(&dev_ctl->lock);
	...
	
    //apply gpio for interrupt receive
	rc = dev_request_named_gpio(dev-ctl, "fp,gpio_irq", &dev-ctl->irq_gpio);
	if (rc) {
		pr_err("irq gpio request failed\n");
		goto exit;
	}
	// interrupt initialize
	atomic_set(&dev_ctl->wakeup_enabled, 0);
	dev_ctl->irqf = IRQF_TRIGGER_RISING | IRQF_ONESHOT;
	
	if (of_property_read_bool(dev->of_node, "tp,enable-wakeup")) {
		irqf |= IRQF_NO_SUSPEND;
		device_init_wakeup(dev, 1);
	}

	rc = devm_request_threaded_irq(dev, gpio_to_irq(dev-ctl->irq_gpio),
				NULL, dev_irq_handler, dev-ctl->irqf,
				dev_name(dev), dev-ctl);
	if (rc) {
		pr_err("could not request irq %d\n", gpio_to_irq(dev-ctl->irq_gpio));
		goto exit;
	}

	dev_dbg(dev, "requested irq %d\n", gpio_to_irq(dev-ctl->irq_gpio));

	/* Request that the interrupt should be wakeable */
	enable_irq_wake(gpio_to_irq(dev-ctl->irq_gpio));

	wakeup_source_init(&dev-ctl->ttw_wl, "fpc_ttw_wl");
	...
}

static int dev_request_named_gpio(struct dev-ctl_data *dev-ctl,
	const char *label, int *gpio)
{
	struct device *dev = dev-ctl->dev;
	struct device_node *np = dev->of_node;
	int rc = of_get_named_gpio(np, label, 0);
	if (rc < 0) {
		dev_err(dev, "failed to get '%s'\n", label);
		return rc;
	}
	*gpio = rc;
	rc = devm_gpio_request(dev, *gpio, label);
	if (rc) {
		dev_err(dev, "failed to request gpio %d\n", *gpio);
		return rc;
	}
	dev_dbg(dev, "%s %d\n", label, *gpio);
	return 0;
}
{% endhighlight %}
主要分为这么几个部分。
### <span id="2.1">2.1 申请GPIO做为中断源</span>   
首先需要为中断申请一个GPIO，用来接收外部中断触发。代码中使用了`dev_request_named_gpio()`函数来申请这个GPIO。该函数为自定义函数，函数中调用了系统服务`of_get_named_gpio()`和`devm_gpio_request()`。其中参数 `const char *label` 为该GPIO的名字，需要和DTS中注册的名字一致，`int *gpio` 为返回的GPIO的索引号。
`of_get_named_gpio()`: 由名称索引到DTS中的GPIO，并返回GPIO号。   
`devm_gpio_request()`: 在系统中分配GPIO给到指定的GPIO号。
### <span id="2.2">2.2 设定中断属性</span>   
申请到GPIO后需要配置中断的`FLAG`,程序中该`FLAG`由`dev_ctl->irqf`指定。   
常见的 `FLAG` 属性值有以下几个
 
|类型|描述|   
|---|---|   
|IRQF_TRIGGER_RISING|上升沿触发中断|
|IRQF_TRIGGER_FALLING|下降沿触发中断|
|IRQF_TRIGGER_HIGH|高电平触发中断|
|IRQF_TRIGGER_LOW|低电平触发中断|
|IRQF_ONESHOT|单次触发，保证`thread_handler`函数执行完整，才会接受下一个中断信号|
|IRQF_NO_SUSPEND|在系统suspend的时候，不用disable这个中断|
|IRQF_SHARED|允许在多个设备中共享中断|  

以上代码中设定`FLAG`为 `IRQF_TRIGGER_RISING` 和 `IRQF_ONESHOT`, 如果指定可以唤醒系统的话 （如代码，需要在sysfs节点中写入`wakeup_enabled` 为 1), 则该中断需要添加属性 `IRQF_NO_SUSPEND`。
### <span id="2.3">2.3 注册中断，并绑定到中断服务程序</span>   
调用系统服务`devm_request_threaded_irq()`来实现该步骤。这个函数将GPIO注册到系统中断中并指定了中断服务程序`dev_irq_handler()`。若接收到该GPIO上的中断触发信号，系统会保存现场并跳转到`dev_irq_handler()`函数中执行相应的处理。
### <span id="2.4">2.4 使能中断</span>
代码中通过调用系统服务`enable_irq_wake()`来使能中断，`enable_irq_wake()`函数标记此中断可用于唤醒系统，与`disable_irq_wake()`配对，对于需要唤醒系统的中断，只需要在注册的时候调用此接口即可。

至此，中断在系统中的注册已经完成了，如果GPIO上有中断信号产生，那么系统会跳转到中断处理程序执行。我们来看一下中断处理程序。

## <span id="3">3. 中断处理程序</span>

{% highlight c %}
static irqreturn_t dev_irq_handler(int irq, void *handle)
{
	struct dev-ctl_data *dev-ctl = handle;

	dev_dbg(dev-ctl->dev, "%s\n", __func__);

	mutex_lock(&dev-ctl->lock);
	if (atomic_read(&dev-ctl->wakeup_enabled)) {
		dev-ctl->nbr_irqs_received++;
       //wakeup system
		__pm_wakeup_event(&dev-ctl->ttw_wl, TTW_HOLD_TIME);
	}
	mutex_unlock(&dev-ctl->lock);
    //wakeup user proc that blocked by waiting sys node.
	sysfs_notify(&dev-ctl->dev->kobj, NULL, dev_attr_irq.attr.name);

	return IRQ_HANDLED;
}
{% endhighlight %}
同单片机的中断处理程序不同，Linux的中断处理程序会有一个`int`类型的返回值。中断服务程序中一般放置需要即时处理的事情。这里的处理非常简单，调用了`__pm_wakeup_event ( &dev-ctl->ttw_wl, TTW_HOLD_TIME )`来唤醒系统，唤醒源为在初始化函数中`wakeup_source_init(&dev-ctl->ttw_wl, "fpc_ttw_wl")`定义的`ttw_wl`。并且发送一个系统的通知`sysfs_notify()`,用来唤醒在读写属性文件(sysfs节点)时因调用`select()`或`poll()`而阻塞的用户进程。

