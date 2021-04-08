---
layout: post
title:  "Java 的Iterable接口使用"
date:   2012-03-18 13:27:23 +0800
categories: Java
tags: Java
published: true
language: chinese
toc: false
sidebar: true
about: true
author: david.dong
description: Iterable 是 Java 的一个接口，本文主要对 Iterable 接口及其使用方法做了说明，给出了应用举例。
keywords: Java/Iterable
---
`Iterable<>` 是 `Java.lang` 包中定义的一个接口, 
根据Java文档的介绍该接口主要声明了一个`Iterator()`方法，该方法返回一个`Iterator<>`接口。   

[Java 文档 - Iterable](https://docs.oracle.com/javase/8/docs/api/)<br>

![Iterable]({{site.baseurl}}/assets/image/java-iterable-function.png){: .center-image }
<br>

那我们接下来看一看`Iterator<>`接口主要内容，`Iterator<>`接口的Java 文档里说明
`Iterator<>`接口主要声明了三个方法。   

[Java 文档 - Iterator](https://docs.oracle.com/javase/8/docs/api/)

+ `hasNext()`
+ `next()`
+ `remove()`

看到这里就很清楚了，实现了`Iterator<>`接口的类可以进行迭代遍历，`Iterator<>`接口通过对以上3个方法的封装实现了对遍历访问的支持。Java里的集合类都实现了`Iterator<>`接口。

一个简单的应用例子。   
Student.java - 基本的数据类
{% highlight java %}
package com.daviddong.example.Iterator

public class Student {

    private String name;
    private int age;
    private String gender;

    public Student(String name, int age, String male) {
        this.name = name;
        this.age = age;
        this.gender = male;
    }

    public Student() {
        
        try {
            
        } catch (Exception e) { 
            //TODO: handle exception
        }

    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

}
{% endhighlight %}
MyIterableClass.java - 实现了Iterator接口
{% highlight java %}
package com.daviddong.example.Iterator;
import java.util.ArrayList;
import java.util.Iterator;

public class MyIterableClass implements Iterator {

    private ArrayList<Student> am = new ArrayList<>();
    private int length;
    private int index;

    @Override
    public boolean hasNext() {
        // TODO Auto-generated method stub
        if(index<length){
            return true;
        }
        return false;
    }

    @Override
    public Student next() {
        // TODO Auto-generated method stub
        return am.get(index++);
    }

    public MyIterableClass(ArrayList<Student> am, int length, int index) {
        this.am = am;
        this.length = length;
        this.index = index;
    }

}
{% endhighlight %}
APP.java
{% highlight java %}
package com.daviddong.example.Iterator

import java.util.ArrayList;
import java.util.Random;

public class App {
    
    public static void main(String[] args) {

        ArrayList<Student> list = new ArrayList<Student>();
        ArrayList<String> names = new ArrayList<String>();
        names.add("男");
        names.add("女");
        String gender;
        for (int i = 0; i < 10; i++) {
            int r = new Random().nextInt(100);
            gender = names.get(r%2);
            Student student = new Student("学生—" +i, (int)(Math.random()*10)+10, gender);
            list.add(student);
        }

        MyIterableClass myClass = new MyIterableClass(list, list.size(), 0);

        while (myClass.hasNext()) {
            Student stu = myClass.next();
            System.out.println(stu.getName() + " 年龄:" + stu.getAge() + " 性别:" + stu.getGender());
        }
    }
}
{% endhighlight %}
运行结果如下。
{% highlight plaintext %}
学生—0 年龄:19 性别:女
学生—1 年龄:11 性别:男
学生—2 年龄:19 性别:女
学生—3 年龄:19 性别:女
学生—4 年龄:18 性别:女
学生—5 年龄:13 性别:男
学生—6 年龄:17 性别:女
学生—7 年龄:19 性别:女
学生—8 年龄:12 性别:男
学生—9 年龄:14 性别:女
{% endhighlight %}
有人可能会问，为什么不直接将`hasNext()`，`next()`方法放在Iterable接口中，其他类直接实现就可以了？

原因是有些集合类可能不止一种遍历方式，实现了Iterable的类可以再实现多个Iterator内部类，通过返回不同的Iterator实现不同的遍历方式，这样更加灵活。如果把两个接口合并，就没法返回不同的Iterator实现类了。
<br>