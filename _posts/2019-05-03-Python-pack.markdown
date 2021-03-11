---
layout: post
title:  "Python struct.pack()"
date:   2019-05-03 14:07:05 +0800
categories: Python
Published: true
---
Python uses `struct.pack()` to pack python data type into binary data (byte stream), which means convert a value to a string based on the format. Because there is no byte type in Python, here the string is actually equivalent to byte stream, or byte array.

### struct.pack()

The function prototype:
{% highlight python %}
struck.pack(format, data1, data2,...)
{% endhighlight %}

format: define the convert format.
data1,data2,...: the data needs to be packed.

The format includes


**Format**|**C Type**|**Python Type**|**Standard Size**|
:---:|:--:|:---:|:---:|
x|pad byte|||
c|char|string of length 1|1
b|signed char|integer|1
B|unsigned char|integer|1
?|_bool|bool|1
h|short|integer|2
H|unsigned short|integer|2
i|int|integer|4
I|unsigned int|integer|4
l|long|integer|4
L|unsigned long|integer|4
q|long long|integer|8
Q|unsigned long long|integer|8
f|float|float|4
d|double|float|8
s|char[]|string||
p|char[]string||
P|void *|integer|

In order to exchange data with the structure in C, it is also necessary to consider that some C or C + + compilers use byte alignment, usually a 32-bit system with 4 bytes as the unit. Therefore, struct can be converted according to the byte order of the local machine. The alignment can be changed by the first character in the format. The definition is as follows:

**Format**|**Byte Order**|**Size**|**alignment**|
:---:|:--:|:---:|:---:|
@|native byte|native|native|
=|native|standard|none
<|little-endian char|standard|none
>|big-endian char|standard|none
!|network (= big-endian)|standard|none

Use it in the first place of format.

for example.
{% highlight python %}
import struct

a = 11
b = 12

print(len(struct.pack("ii",a,b)))
8
print(struct.pack("ii",a,b))
b'\x0b\x00\x00\x00\x0c\x00\x00\x00'
{% endhighlight %}

### struct.unpack()

`struct.unpack()` unpacks the byte stream into Python data type.<br>
The function prototype:
{% highlight python %}
struct.unpack(fmt, string)
{% endhighlight %}
This function return a tuple.

For example.
{% highlight python %}
a = 11
b = 12
packdata = struct.pack("ii",a,b)
c,d = struct.unpack("1i1i",packdata)
print((c,d))
(11,12)
{% endhighlight %}

### struct.calcsize()

`Struct.calcsize()` is used to calculate the length of the result corresponding to the format string.

For example.<br>
{% highlight python %}
print(struct.calcsize("c"))
1
print(struct.calcsize("H"))
2
print(struct.calcsize("L"))
4
print(struct.calcsize("Q"))
8
{% endhighlight %}