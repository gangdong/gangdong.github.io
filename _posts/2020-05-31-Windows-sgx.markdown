---
layout: post
title:  "Configure Intel SGX on Win10"
date:   2020-05-31 22:42:44 +0800
categories: Windows
tags: Windows
Published: true
toc: true
sidebar: true
---
The first step we should know if the hardware support SGX.<br>
Which include:
+ BIOS support?
+ CPU support?
+ Software packages installed?

Now let us go through above one by one.

{% if page.sidebar == false %}
<div class = "separator"></div>
<h2 class="no_toc">Table of content</h2>
* TOC
{:toc}
<div class = "separator"></div>
{% endif %}

## CPU Query 
1. Get the CPU model of your hardware.
   By device manager -> processors 
![CPU]({{site.baseurl}}/assets/image/others-sgx-01.PNG){: .center_image}
2. Find the corresponding model on the [Intel official website](https://ark.intel.com/content/www/us/en/ark/products/88185/intel-core-i5-6400-processor-6m-cache-up-to-3-30-ghz.html), which will indicate whether it supports SGX.  
![CPU]({{site.baseurl}}/assets/image/others-sgx-02.PNG){: .center_image}
Oh! My laptop's CPU supports but need install IME software.  
Ok, remember this requirement and do it later. 😎

## BIOS Query

There are 3 kind of settings on the system BIOS for SGX.

+ **Enable**
+ **Software controlled** - enabled through software applications. If Intel SGX is set to software controlled, Intel SGX is initially disabled. You need to make the following calls in the SDK through software application to set it to enabled state:
{% highlight ruby %}
sgx_enable_device()
sgx_cap_enable_device()
{% endhighlight %}
Set softwar control mode is helpful to reduce consumption of system resources otherwise the SGX is always on and occupies a larger amount of RAMs which affects other programs and processes.
+ **Disable** 

## Support software package

1. Intel SGX software package list 
![packages]({{site.baseurl}}/assets/image/others-sgx-03.PNG){: .center_image}
Download SGX software packages at [here](https://software.intel.com/content/www/us/en/develop/topics/software-guard-extensions/sdk.html).

2. Install IME (Intel Management Engine)
Download IME package at [here](https://downloadcenter.intel.com/download/29352/Intel-Management-Engine-Interface-Driver-NUC8v7PN-NUC8v5PN).
Run SetupME.exe<br>
![packages]({{site.baseurl}}/assets/image/others-sgx-09.PNG){: .center-image }  

3. Microsoft Visual Studio 2015/2017<br>
Should install Microsoft Visual Studio 2015/2017 before install SGX SDK/PSW, it is important here for the installation sequence. The SGX SDK will install plug-in on Visual Studio, if SGX SDK is installed firstly, Visual Studio will lose the plug-in.<br>
The Visual Studio install package is at [here](https://visualstudio.microsoft.com/vs/older-downloads/).  

4. Install SGX SDK<br><br>
![packages]({{site.baseurl}}/assets/image/others-sgx-10.PNG){: .center-image }
Run `Intel(R)_SGX_Windows_SDK_2.7.101.2.exe`.   
 
5. Install PSW<br>
Run `Intel SGX PSW for Windows v2.7.101.2.exe` and unzip.<br>
You will get a folder
![psw]({{site.baseurl}}/assets/image/others-sgx-05.PNG){: .center-image }
Check the build number of operating system by `winver` command.<br>
![psw]({{site.baseurl}}/assets/image/others-sgx-08.PNG){: .center-image }
+ If the system is **windows 10 fall creators update (version 1709)** or later, enter `PSW_INF_RS3_and_above` folder, run windows PowerShell as administrator to open command line window, and then enter `PSW_INF_RS3_and_above device` directory, keep going down until find `sgx_base.inf` file, input the following command:<br>
{% highlight ruby %}
pnputil /add-driver sgx_base.inf  /install
{% endhighlight %}
Go back to `PSW_INF_RS3_and_above component` directory, go down until `find sgx_psw.inf` file, input the following command:<br>
{% highlight ruby %}
pnputil /add-driver sgx_psw.inf  /install
{% endhighlight %}
+ If it is the previous version, choose `PSW_EXE_RS2_and_before` folder and run<br>
`Intel(R)_SGX_Windows_x64_PSW_2.7.101.2.exe` to install.   
Open the Visual Studio 2015 and create a new VC++ project, if the `Intel SGX Enclave project` can be found in the template window, it means the SDK and Visual Studio plug-in has been installed successfully.
![psw]({{site.baseurl}}/assets/image/others-sgx-11.PNG){: .center-image }

