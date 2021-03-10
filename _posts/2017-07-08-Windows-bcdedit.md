---
layout: post
title:  "Use bcdedit.exe in Windows"
date:   2017-07-08 21:11:09 +0800
categories: Windows
---
**BCDEDIT** - Boot Configuration Data Store Editor.  
`Bcdedit.exe` is a command line tool for managing boot configuration data (BCD). To use this tool, it needs the administrator permission to start a command line window.

The Bcdedit.exe command-line tool modifies the boot configuration data store. The boot configuration data store contains boot configuration parameters and controls how the operating system is booted. These parameters were previously in the Boot.ini file (in BIOS-based operating systems) or in the nonvolatile RAM entries (in Extensible Firmware Interface-based operating systems). You can use Bcdedit.exe to add, delete, edit, and append entries in the boot configuration data store.  
  
In the command line, enter the command `bcdedit /?` to view all bcdedit related operations.

The command parameters is as below.  
{% highlight console %}
Commands that operate on a store
================================
/store          Used to specify a BCD store other than the current system default.
/createstore    Creates a new and empty boot configuration data store.
/export         Exports the contents of the system store to a file. This file
                can be used later to restore the state of the system store.
/import         Restores the state of the system store using a backup file
                created with the /export command.
/sysstore       Sets the system store device (only affects EFI systems, does
                not persist across reboots, and is only used in cases where
                the system store device is ambiguous).

Commands that operate on entries in a store
===========================================
/copy           Makes copies of entries in the store.
/create         Creates new entries in the store.
/delete         Deletes entries from the store.
/mirror         Creates mirror of entries in the store.

Run bcdedit /? ID for information about identifiers used by these commands.

Commands that operate on entry options
======================================
/deletevalue    Deletes entry options from the store.
/set            Sets entry option values in the store.

Run bcdedit /? TYPES for a list of datatypes used by these commands.
Run bcdedit /? FORMATS for a list of valid data formats.

Commands that control output
============================
/enum           Lists entries in the store.
/v              Command-line option that displays entry identifiers in full,
                rather than using names for well-known identifiers.
                Use /v by itself as a command to display entry identifiers
                in full for the ACTIVE type.

Running "bcdedit" by itself is equivalent to running "bcdedit /enum ACTIVE".

Commands that control the boot manager
======================================
/bootsequence   Sets the one-time boot sequence for the boot manager.
/default        Sets the default entry that the boot manager will use.
/displayorder   Sets the order in which the boot manager displays the
                multiboot menu.
/timeout        Sets the boot manager time-out value.
/toolsdisplayorder  Sets the order in which the boot manager displays
                    the tools menu.

Commands that control Emergency Management Services for a boot application
==========================================================================
/bootems        Enables or disables Emergency Management Services
                for a boot application.
/ems            Enables or disables Emergency Management Services for an
                operating system entry.
/emssettings    Sets the global Emergency Management Services parameters.

Command that control debugging
==============================
/bootdebug      Enables or disables boot debugging for a boot application.
/dbgsettings    Sets the global debugger parameters.
/debug          Enables or disables kernel debugging for an operating system
                entry.
/hypervisorsettings  Sets the hypervisor parameters.

Command that control remote event logging
=========================================
/eventsettings  Sets the global remote event logging parameters.
/event          Enables or disables remote event logging for an     
                operating system entry.
{% endhighlight %}

Normally I use below commands in the development.

+ turn off digital signature.
{% highlight console %}
bcdedit /set nointegritychecks on
{% endhighlight %}
+ turn on digital signature
{% highlight console %}
bcdedit /set nointegritychecks off
{% endhighlight %}
+ enable kernel debug
{% highlight console %}
bcdedit /set {default} DEBUG YES
{% endhighlight %}
+ enable/disable test signature
{% highlight console %}
bcdedit /set TESTSIGNING ON | OFF
{% endhighlight %}
+ set a serial debug 
{% highlight console %}
bcdedit /dbgsettings serial baudrate:115200 debugport:1
{% endhighlight %}
+ set network debug
{% highlight console %}
bcdedit /dbgsettings net hostip:192.168.xx.xx port:50000 key:1.2.3.4
{% endhighlight %}
hostip: host IP address, port: host port,key: password.
+ copy a entry
{% highlight console %}
bcdedit /copy {current} /d “your name”
{% endhighlight %}