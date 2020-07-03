---
layout: post
title:  "Use of .PHONY in makefile"
date:   2014-11-11 23:55:17 +0800
categories: Others 
published: true
---
You may have run into the situation where the name of makefile command conflicts with the file name under the same directory.  

For example, I have below code.
```c
B_TARGET:=testapp
clean:
  rm -f $(B_TARGET)   
```
I execute `make clean`, everything is ok. The target folder is removed as expected. However if there is a file named `clean` in the directory. I will get a result when I execute the `make clean` command. 
```c
make: 'clean' is up to date.
```
To avoid this issue happen, use `.PHONY` command. The main function of `.PHONY` configuration item is to avoid the conflict between the specified command and the file with the same name under the project, and to optimize the performance. `.PHONY [command name]` explicitly specifies a command name instead of the actual file name, so that the `make [command name]` command can be parsed and executed correctly. You don't have to worry about if the same name file existing or not. 

I change the code as this.
```c
.PHONY clean
B_TARGET:=testapp
clean:
  rm -f $(B_TARGET)   
```
I execute `make clean` and the command works this time.  

