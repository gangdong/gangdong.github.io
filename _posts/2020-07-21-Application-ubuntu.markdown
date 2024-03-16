---

layout: post
title:  "Install and remove application with command line in Ubuntu"
date:   2020-07-19 11:06:44+0800
categories: Linux
tags: Linux
Published: true
toc: true
sidebar: true
language: english
about: true
author: david.dong
description: This guide shows you how to use apt commands in Linux
keywords: apt dpkg ubuntu

---

How to install and remove software in Ubuntu? Don't worry, Ubuntu provides many ways to assist you in this task. Some of them are graphical tools like the built-in "Ubuntu Software Center," or well-known tools such as "Synaptic" and "gdebi." In this post, I want to discuss apt, a command-line tool. Because I prefer command-line tools, they are fast and straightforward.



## what is APT?

[APT](https://wiki.debian.org/Apt?ref=itsfoss.com) (Advanced Package Tool) is the command line tool to interact with the packaging system in Debian-based Linux distributions. There is already dpkg commands to manage it. But APT is a more friendly way to handle packaging. You can use it to find and install new packages, upgrade packages, remove the packages etc. You may heard about `apt-get`, but `apt`  is new.  what is the difference between `apt` and `apt-get`? In a short, apt is a subset of  `apt-get` and `apt-cache` commands providing necessary commands for package management. apt is more friendly to users because  it is easier to use with its fewer but easy to remember options.



## Using APT commands to manage packages

### some location need to know

+ the location to store the software (.deb package) that APT download from the PPA `/var/cache/apt/archives`

+ the location to store the softwae after install by APT
  
  `/usr/share/packagename`

+ the path of the sources.list
  
  `/etc/apt/sources.list`

+ the location to store the executable bin file
  
  `/usr/bin`

+ the location to store the libs
  
  `/usr/lib`

### add software ppa

APT uses PPA to install software, But what is PPA? Why is it used? Is it safe to use PPA? How to properly use PPA? How to delete a PPA?

Here I would not discuss too much about it, PPA means Personal Package Archive. You can unserstand it as a URL of software repository where allows application developers and Linux users to create their own repositories to distribute software. 

suggest to read [PPA in Ubuntu Linux [Definitive Guide]](https://itsfoss.com/ppa-guide/) for more details.

```bash
# add ppa into sources.list
sudo add-apt-repository ppa:khurshid-alam/nautilus-git
# remove ppa
sudo add-apt-repository --remove ppa:khurshid-alam/nautilus-git
```

### update package databas with APT

```bash
sudo apt update
```

APT uses the database to manager the package version, updating the repository should be the first thing to do before the installation of package. elsewise, APT won't know if there are any newer packages available. this command won't upgrade the real package but just refresh the package version information in the database.

### install software package

```bash
sudo apt install nautilus-compare
# install specific version package
sudo apt install nautilus-compare=0.0.6~bionic3
```

apt install command will install the latest version of the package in the repository. normally the repository will not contain the older version. If you have already installed the package, running the command will upgrade the package to the latest version. If you want to install the package without upgrading, try this command

```bash
sudo apt install nautilus-compare --no-upgrade
```

If you only want to upgrade a package but don't want to install it (if 
it's not already installed), you can do that with the following command:

```bash
sudo apt install nautilus-compare --only-upgrade
```

### remove software package

```bash
# remove installed package
sudo apt remove nautilus-compare
# remove installed package and related configure file
sudo purge nautilus-compare
# remove package and it's dependency
sudo apt autoremove nautilus-compare
```

What is the difference between apt remove and apt purge?

- `apt remove` just removes the binaries of a package. It leaves residue configuration files.
- `apt purge` removes everything related to a package including the configuration files.

If you used `apt remove` to a get rid of a particular software and then install it again, your software will have the same configuration files.

### search for package

```bash
sudo apt search nautilus-compare
```

another way to search the available package is using [Launchpad](https://launchpad.net/?ref=itsfoss.com) website, the official platform for hosting PPA. You can go to Launchpad and search for the required package directly there.

### See the content of a package

```bash
sudo apt show nautilus-compare
```

This will show information about the given package(s) like its dependencies, installation and download size, different sources the package is available from, the description of the content of the package among other things.

```bash
sudo apt policy nautilus-compare
# show package info and dependency
sudo apt-cache showpkg rsync
sudo apt-cache depends rsync
# show the 
sudo apt-cache rdenpends rsync
```

### List upgradable and installed versions

```bash
sudo apt list --installed
sudo apt list --upgradable
sudo apt list --all-version
```

### Clean the system

```bash
sudo apt autoremove
sudo apt autoremove --purge
```

this command removes the unnecessary libs or packages that are once as the dependency by some applications and didn't used.

When you install a package using apt-get or [apt command](https://itsfoss.com/apt-command-guide/) (or DEB packages in the software center), the apt [package manager](https://itsfoss.com/package-manager/) downloads the package and its dependencies in .deb format and keeps it in `/var/cache/apt/archives` folder.

Once the deb files for the package and its dependencies are downloaded, your system installs the package from these deb files.

if you want to clean the cache of download package in the `/var/cache/apt/archieve`

```bash
sudo apt-get clean
sudo apt-get autoclean
```

### upgrade package

```bash
#auto upgrade all package
sudo apt upgrade
#upgrade os
sudo apt dist-upgrade
# only upgrade specific package
sudo apt install --only-upgrade rsync
# or run insall command to upgrade to latest version
sudo apt install rsync
```

## Hold the package and prevent upgrade

If you manage to install a specific program version, you may want to avoid accidentally upgrading to the newer version. It’s not too complicated to achieve this.

```bash
# lock package version, don't upgrade by apt upgrade command
sudo apt-mark hold rsync
```

You can remove the hold so that it can be upgraded later:

```bash
sudo apt-mark unhold rsync
```

set manual install

```bash
sudo apt-mark manual rsync
```

```bash
sudo apt-mark showhold
sudo apt-mark showauto
sudo apt-mark showmanual
```

### fix the install

```bash
sudo apt -f install
```

this command will fix the dependency broken error durring the installtion. 

### standalone .deb package install and remove

```bash
# download deb package
sudo apt download nautilus-compare
# install by dpkg
sudo dpkg -i nautilus-compare_1.0.0~focal1_all.deb

#remove 
sudo dpkg -r nautilus-compare_1.0.0~focal1_all.deb
sudo dpkg --remove --purge nautilus-compare_1.0.0~focal1_all.deb

#list
sudo dpkg -l rsync
# show the deb package contents
sudo dpkg -c nautilus-compare_1.0.0~focal1_all.deb
# show the package installed files in the system
sudo dpkg -L copyq
# find the file belongs to which package
sudo dpkg -S /usr/bin/rsync
```

### apt-key manager GPG key

You can see the GPG keys added by various repositories in your system using the `apt-key list` command.

```bash
# show key 
sudo apt-key list
```

add key

```bash
sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys E298A3A825C0D65DFD57CBB651716619E084DAB9
```

delete key

```bash
sudo apt-key del 12345
```

### apt lock

you may encounter the issue when you use APT tool install package, as below

`you cannot acquire the lock /var/lib/dpkg/lock-fronted`.

There are 3 lock files in the ubuntu that used for apt/dpkg 

+  /var/lib/dpkg/lock-frontend

+ /var/cache/apt/archieve/lock

+ /var/lib/dpkg/lock

one way to fix the lock issue is running the command to remove the lock file.

```bash
sudo rm -rf /var/lib/dpkg/lock-frontend /var/cache/apt/archieve/lock /var/lib/dpkg/lock
```

you may not have to remove all of them, just find which lock file cannot be acquired and delete it!
