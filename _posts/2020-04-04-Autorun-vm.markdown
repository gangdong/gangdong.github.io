---
layout: post
title:  "Run virtual machine automatically at windows10 startup"
date:   2020-04-04 10:45:40 +0800
categories: Linux
tags: ubuntu
Published: true
excerpt_separator: <!--more-->
toc: true
sidebar: true
language: english
about: true
author: david.dong
description: Sharing a method of running virtual machine automatically when Windows boots on.
keywords: Rust

---

I prefer working under Ubuntu because it is a programmer-friendly operating system and helps me develop more efficiently. However, there are times when I need to use Windows because it has more software options available. To address this, I used to install a virtual machine on my Windows 10 computer. But, there is a downside to this method. I had to manually start the virtual machine every time, which was a bit inconvenient. Therefore, I found a way to make the virtual machine start automatically when my Windows 10 boots up.<!--more-->

### Step 1

I used VMware workstation,  to set up boot auto-start using VMware Workstation, we need to understand the command line tool called "vmrun" provided by the software. "vmrun" is a command line tool that starts a virtual machine by command. 

```c
vmrun [AUTHENTICATION-FLAGS] COMMAND [PARAMETERS]
```

For example, starting a virtual machine with Workstation on a Windows host

```c
vmrun -T ws start "c:\my_VMs_folder\myVM.vmx"
```

here the `-T ws` means  use VMware Workstation 

```c
-T <hostType> (ws|fusion||player)
```

so the firsty step is to add the `vmrun` path in the the windows envrionments variable.

It is easy ! 

### Step 2

Now I have added the `vmrun` into the Windows environments since I have verified by inputting `vmrun` command in the CMD and received the output of the command.

```c
C:\Users\HP>vmrun
vmrun version 1.17.0 build-18811642
Usage: vmrun [AUTHENTICATION-FLAGS] COMMAND [PARAMETERS]
...
```

Next, I will need to write a batch script to start my Ubuntu by the `vmrun` command. The script is simple just as below.

```c
@echo off
vmrun -T ws start "D:\Virtual_Machine\VM_Ubuntu20.04\UbuntuVM20.04.vmx"
```

I saved the script as  vm-autorun.bat.

### Step 3

I need to make the script auto-run when Windows 10 starts. In Windows, adding an autorun task is not a complicated work. Just put the script into the Windows startup directory. So I pressed `win+r` and input `shell:startup`. This operation helped me to navigate to the Windows startup directory, after that I copied the vm-autorun.bat to this directory.
I rebooted the windows10 and after waiting some seconds, the virtual machine started to run and my Ubuntu was booting! It was working!

### Step 4

But there was a small problem which made the solution not perfect. That was during the startup there was a command prompt window (CMD) displayed and it was a little annoying. So I need a bitter more optimized.
I used a small tweak to hide the command prompt window, making it invisible.
I used the VBScript to execute the batch file. This approach allows me to hide the command prompt window.
I replaced the vm-autorun.bat file with the vm-autorun.vbs and wrote the below command into the vbs file.

```c
Set ws = CreateObject("Wscript.Shell")
ws.run "cmd /c D:\Virtual_Machine\vm-autorun.bat", vbhide
```

 In the command, `D:\Virtual_Machine\vm-autorun.bat` was my bat file path and `vbhide` meant **hide** mode -  do not show command prompt window.

Save the file and reboot.

It was perfect this time, executed just as I expected.
