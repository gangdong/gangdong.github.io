---
layout: post
title:  "Java 的序列化(Serializable)"
date:   2011-02-12 20:02:36 +0800
categories: Java
---
Java的序列化提供了一种保存对象状态的机制，之所以要用到序列化是因为有时我们会在对象的生命期结束后需要把对象状态保存下来，通常是存放到外部的媒介上，比如文件，磁盘或网络上。并且在需要时能够通过一种机制来恢复。序列化能够在不同的JVM之间共享数据。<br>

实现类的序列化在语法上非常简单，只需要实现Serializable接口即可。Serializable接口没有需要实现的方法（这是一个"标记接口-tagging interface")，只是标明该类的对象需要序列化。

通常我们在构建javabean的时候，定义Bean时要实现这个接口，因为Bean的属性状态一般都是需要保存的。<br>
## 关于序列化
需要注意以下几点：<br>
1. 序列化保存的是对象的状态。状态包括对象的非静态成员变量（包括声明为private的变量），不能保存任何的**成员方法**和**静态的成员变量**。
2. 当一个父类实现序列化时,**子类自动序列化**,不需要显式实现Serializable接口。
3. 当一个对象的实例变量引用其他对象,序列化该对象时也把**引用对象序列化**。
4. 序列化的对象包括基本数据类型，所有集合类以及其他许多东西，还有对象。但是**并非所有的对象都可以序列化**。
5. 对象序列化不仅保存了对象的状态，而且还能**保存对象内包含的所有引用的对象状态**，一直追踪知道所有的引用的对象被保存。
6. 使用***transient***关键字修饰的的变量，在序列化对象的过程中，该属性不会被序列化。常用于当某些变量不想被序列化，同是又不适合使用static关键字声明时。   

## 关于 serialVersionUID
序列化运行时使用一个称为serialVersionUID的版本号与每个可序列化类相关联，该序列号在反序列化过程中用于验证序列化对象的发送者和接收者是否为该对象加载了与序列化兼容的类。如果接收者加载的该对象的类的serialVersionUID与对应的发送者的类的版本号不同，则反序列化将会导致InvalidClassException。可序列化类可以通过声明名为 `serialVersionUID`的字段（该字段必须定义为 **static final long**）显式声明其自己的serialVersionUID.建议在一个可序列化类中显示的定义serialVersionUID。因为serialVersionUID的取值是Java运行时环境根据类的内部细节自动生成的。如果对类的源代码作了修改，再重新编译，新生成的类文件的serialVersionUID的取值有可能也会发生变化。而且不同的Java编译器之间会有差异。
可以用在如下的场合:<br>
1. 在某些场合，希望类的不同版本对序列化兼容，因此需要确保类的不同版本具有相同的serialVersionUID； 
2. 在某些场合，不希望类的不同版本对序列化兼容，因此需要确保类的不同版本具有不同的serialVersionUID<br>

参考代码如下，改代码演示了如何序列化和反序列化一个对象：<br>
首先定义一个类实现Serializable接口。<br>
DemoInstance.java<br>
{% highlight java %}
package Serializable;
import java.io.Serializable;
public class DemoInstance implements Serializable{

   /**
    * 定义一个明确的 serialVersionUID 而不是由系统自动产生, 声明为 static final long 类型 
   */
    private static final long serialVersionUID = 1L;

    private String a;
    public String b;
    protected String c;

    public String getA() {
        return a;
    }

    public void setA(String a) {
        this.a = a;
    }

    public String getB() {
        return b;
    }

    public void setB(String b) {
        this.b = b;
    }

    public String getC() {
        return c;
    }

    public void setC(String c) {
        this.c = c;
    }

}
{% endhighlight %}
在main()中实现该类对象的序列化和反序列化。<br>
App.java<br>
{% highlight java %}
package Serializable;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;

/**
 * example of serializable
 *
 */
public class App {
    public static void main(String[] args) {

        /* 声明一个对象，该对象实现了serializable接口 */
        DemoInstance demoObj = new DemoInstance();
        DemoInstance demoReadObj = new DemoInstance();

        demoObj.setA("I am private member.");
        demoObj.setB("I am protected member.");
        demoObj.setC("I am public member.");

        demoReadObj.setA("I am null!");
        demoReadObj.setB("I am null!");
        demoReadObj.setC("I am null!");

        try {
            /*首先声明一个FileOutputStream的对象，用于操作要写入的文件*/
            FileOutputStream fos = new FileOutputStream("example_Serializable.txt");
            /* 声明一个ObjectOutputStream 对象，将要写入的文件流与要存的对象关联 */
            ObjectOutputStream oos = new ObjectOutputStream(fos);
            /* 写入要保存的对象 */
            oos.writeObject(demoObj);
            oos.close();

            /* 首先声明一个FileInputStream的对象，用于操作要写入的文件 */
            FileInputStream fis = new FileInputStream("example_Serializable.txt");
            /* 声明一个ObjectInputStream 对象，将要读入的文件流与要存的对象关联 */
            ObjectInputStream ois = new ObjectInputStream(fis);
            demoReadObj = (DemoInstance) ois.readObject();
            ois.close();    

            System.out.println("A:"+demoReadObj.getA()
            +"\nB:"+demoReadObj.getB()+"\nC:"+demoReadObj.getC());


        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } catch (ClassNotFoundException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }

    }
}
{% endhighlight %}
以上代码实现了对象的序列化，注意此时如果将保存的文件用文本编辑器打开会看到乱码。<br>
这是因为序列化和反序列化都是基于二进制流的，将对象保存的信息转化为二进制存储在了文件中，那么用文本编辑器打开查看的话当然是会出现乱码的。只有通过反序列化才能将存储的二进制读取出来。<br>

反序列化读取的代码如下。<br>
{% highlight java %}
            /* 首先声明一个FileInputStream的对象，用于操作要写入的文件 */
            FileInputStream fis = new FileInputStream("example_Serializable.txt");
            /* 声明一个ObjectInputStream 对象，将要读入的文件流与要存的对象关联 */
            ObjectInputStream ois = new ObjectInputStream(fis);
            demoReadObj = (DemoInstance) ois.readObject();
            ois.close();   
{% endhighlight %}
结果如下所示。<br>
{% highlight java %}
A:I am private member.
B:I am protected member.
C:I am public member.
{% endhighlight %}
以上是序列化的基本步骤，下面我们再定义一个DemoInstance的子类，该类没有直接实现Serializable接口，同时在该类中还引用了另外一个没有实现Serializable接口的实体类。<br>
SubDemoInstance.java <br>
{% highlight java %}
package Serializable;

public class SubDemoInstance extends DemoInstance {

    /**
     * 定义一个明确的 serialVersionUID 而不是由系统自动产生, 声明为 static final long 类型
     */
    private static final long serialVersionUID = 2L;

    private String state;
    /* 引用一个没有序列化的对象 */
    private ClassWithoutSerial obj = new ClassWithoutSerial();

    public void setPara(String state) {

        this.obj.setState(state);
    }

    public void setPara(ClassWithoutSerial obj, String state) {

        obj.setState(state);
    }

    public String getDeclare() {
        return state;
    }

    public void setDeclare(String state) {
        this.state = state;
    }

    public ClassWithoutSerial getObj() {
        return obj;
    }

    public void setObj(ClassWithoutSerial obj) {
        this.obj = obj;
    }
    
}
{% endhighlight %}
ClassWithoutSerial.java <br>
{% highlight java %}
package Serializable;

/* 类没有实现Serializale接口 */
public class ClassWithoutSerial {

    private String state;

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public ClassWithoutSerial(String state) {
        this.state = state;
    }

    public ClassWithoutSerial() {
    }

}
{% endhighlight %}
实现序列化和发序列化的代码。 <br>

{% highlight java %}
            SubDemoInstance subDemoInstance = new SubDemoInstance();

            subDemoInstance.setA("I am private member in subclass.");
            subDemoInstance.setB("I am protected member in subclass.");
            subDemoInstance.setC("I am public member in subclass.");
            subDemoInstance.setDeclare("I am member in subclass");
            subDemoInstance.setPara(cws,"I am be called by subclass.");
            
            /*Serialize
             首先声明一个FileOutputStream的对象，用于操作要写入的文件 */
            FileOutputStream fosi = new FileOutputStream("example_Serializable.txt");
            /* 声明一个ObjectOutputStream 对象，将要写入的文件流与要存的对象关联 */
            ObjectOutputStream oosi = new ObjectOutputStream(fosi);
            /* 写入要保存的对象 */
            oosi.writeObject(subDemoInstance);
            oosi.close();

            /*de-serialize
              首先声明一个FileInputStream的对象，用于操作要写入的文件 */
            FileInputStream fisi = new FileInputStream("example_Serializable.txt");
            /* 声明一个ObjectInputStream 对象，将要读入的文件流与要存的对象关联 */
            ObjectInputStream oisi = new ObjectInputStream(fisi);
            SubDemoInstance readSubDemo =  new SubDemoInstance();
            readSubDemo = (SubDemoInstance) oisi.readObject();
            oisi.close();

            System.out.println("A:" + readSubDemo.getA() + "\nB:" + 
            readSubDemo.getB() + "\nC:" + readSubDemo.getC()
            +"\nSubClass:"+readSubDemo.getDeclare()
            +"others:"+readSubDemo.getObj().getState());
{% endhighlight %}
执行后会出现如下错误。<br>

{% highlight console %}
A:I am private member.
B:I am protected member.
C:I am public member.
java.io.NotSerializableException: Serializable.ClassWithoutSerial
    at java.io.ObjectOutputStream.writeObject0(ObjectOutputStream.java:1184)
    at java.io.ObjectOutputStream.defaultWriteFields(ObjectOutputStream.java:1548)
    at java.io.ObjectOutputStream.writeSerialData(ObjectOutputStream.java:1509)
    at java.io.ObjectOutputStream.writeOrdinaryObject(ObjectOutputStream.java:1432)
    at java.io.ObjectOutputStream.writeObject0(ObjectOutputStream.java:1178)
    at java.io.ObjectOutputStream.writeObject(ObjectOutputStream.java:348)
    at Serializable.App.main(App.java:61)
{% endhighlight %}
可以看到错误为ClassWithoutSerial没有序列化却没执行了序列化的操作。稍作修改使得类ClassWithoutSerial实现Serializable接口，结果如下。<br>
{% highlight console %}
A:I am private member in subclass.
B:I am protected member in subclass.
C:I am public member in subclass.
SubClass:I am member in subclass
others:I am be called by subclass.
{% endhighlight %}
由此可见，序列化类的子类可以不必实现序列化，但是其内部引用的类对象必须实现序列化。
