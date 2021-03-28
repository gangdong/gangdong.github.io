---
layout: post
title:  "Java 串口编程"
date:   2012-10-21 18:55:59 +0800
categories: Java
tags: Java
language: chinese
toc: false
sidebar: true
about: true
author: david.dong
description: 有关 Java 串口编程的内容。作者给出了实现的代码。
keywords: 串口/Java/comm.jar
---
前些天工作中用到了串口编程。Java 上位机 UI 需要通过串行端口访问外部的设备，Java 对串口设备的访问有提供库支持，使用起来比较容易，这里简单总结一下。

首先先下载`javacomm20-win32`的package。<br>
[下载链接](http://code.google.com/p/smslib/downloads/detail?name=javacomm20-win32.zip&can=2&q=)<br>
从解压包中有三个重要的文件,

|文件|说明|
---|:--:|
comm.jar|提供了通讯用的java API
win32com.dll|提供了供comm.jar调用的本地驱动接口
javax.comm.properties|是这个驱动的类配置文件

然后把这三个文件放到如下目录中：<br>
1. `comm.jar`可以放在JDK中的`jre\lib\ext`目录下,比如JAVA SDK装在C:\jdk1.6中，COMM.JAR放到C:\jdk1.6\jre\lib\ext;
2. `win32com.dll`可以直接放在JDK中的bin目录下，C:\jdk1.6\bin;
3. `javax.comm.properties`放在JDK中的`jre\lib`目录下，C:\jdk1.6\jre\lib;

使用上可以参考我写的如下代码。<br>
CommBean.java 实现了一个针对串口的通用操作类，封装了串口设备的打开,配置,关闭，读写操作。
{% highlight java %}
/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.dong.serialcom;

import com.dong.factory.ConstantFactory;
import java.io.DataInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.Enumeration;
import java.util.TooManyListenersException;
import java.util.Vector;
import javax.comm.CommPortIdentifier;
import javax.comm.NoSuchPortException;
import javax.comm.PortInUseException;
import javax.comm.SerialPort;
import javax.comm.SerialPortEvent;
import javax.comm.SerialPortEventListener;
import javax.comm.UnsupportedCommOperationException;
/**
 *
 * @author Dong Gang
 */
public class ComBean implements SerialPortEventListener {

    static String portName;
    static int baudrate;
    static int dataBit;
    static int stopBit;
    static int parityBit;
    CommPortIdentifier portId;
    SerialPort serialPort;
    static OutputStream out;
    static InputStream in;
    private static ComBean serialComInstance = new ComBean();
    ReadThread readThread = new ReadThread();
    private byte[] dataPool = new byte[1024];
    private int[] b = new int[10240];
    private static int readBufferIndex = 0;
    private boolean readDataEnd = false;
    SerialBuffer RB;
    ReadSerial RT;
    private boolean isComProOver = false;
    private boolean isConfigureAndStart = false;
    private boolean isComTestOk = false;
    private boolean isComOpen = false;

    private ComBean() {

        portName = "";
        baudrate = 2000000;
        dataBit = SerialPort.DATABITS_8;
        parityBit = SerialPort.PARITY_NONE;
        stopBit = SerialPort.STOPBITS_1;

    }

    public static ComBean getInstances() {
        return serialComInstance;
    }

    public boolean closePort() {
        boolean rst = true;
        String infoStr = "端口关闭";
        if (isComOpen) {
            try {
                in.close();
                out.close();
                RT.stop();
                serialPort.notifyOnDataAvailable(false);
                serialPort.removeEventListener();
                serialPort.close();
                isComProOver = false;
                isConfigureAndStart = false;
                isComTestOk = false;

                if (ConstantFactory.timerRun != 0) {
                    ConstantFactory.timerRun = (int) 0;
                    ConstantFactory.timer.cancel();
                } else {
                }
            } catch (IOException e) {
                rst = false;
            }
        } else {
            rst = false;
        }

        return rst;
    }

    public String getPortName() {
        return portName;
    }

    public void setPortName(String portName) {
        ComBean.portName = portName;
    }

    public int getBaudrate() {
        return baudrate;
    }

    public void setBaudrate(int baudrate) {
        switch (baudrate) {
            case 0:
                ComBean.baudrate = 300;
                break;
            case 1:
                ComBean.baudrate = 600;
                break;
            case 2:
                ComBean.baudrate = 1200;
                break;
            case 3:
                ComBean.baudrate = 2400;
                break;
            case 4:
                ComBean.baudrate = 4800;
                break;
            case 5:
                ComBean.baudrate = 9600;
                break;
            case 6:
                ComBean.baudrate = 19200;
                break;
            case 7:
                ComBean.baudrate = 38400;
                break;
            case 8:
                ComBean.baudrate = 43000;
                break;
            case 9:
                ComBean.baudrate = 56000;
                break;
            case 10:
                ComBean.baudrate = 57600;
                break;
            case 11:
                ComBean.baudrate = 115200;
                break;
            case 12:
                ComBean.baudrate = 2000000;
            default:
                break;
        }
    }

    public int getDataBit() {
        return dataBit;
    }

    public void setDataBit(int dataBit) {
        switch (dataBit) {
            case 0:
                ComBean.dataBit = SerialPort.DATABITS_5;
                break;
            case 1:
                ComBean.dataBit = SerialPort.DATABITS_6;
                break;
            case 2:
                ComBean.dataBit = SerialPort.DATABITS_7;
                break;
            case 3:
                ComBean.dataBit = SerialPort.DATABITS_8;
                break;
            default:
                break;
        }
    }

    public int getParityBit() {
        return parityBit;
    }

    public void setParityBit(int parityBit) {
        switch (parityBit) {
            case 0:
                ComBean.parityBit = SerialPort.PARITY_NONE;
                break;
            case 1:
                ComBean.parityBit = SerialPort.PARITY_ODD;
                break;
            case 2:
                ComBean.parityBit = SerialPort.PARITY_EVEN;
                break;
            default:
                break;
        }
    }

    public int getStopBit() {
        return stopBit;
    }

    public void setStopBit(int stopBit) {
        switch (stopBit) {
            case 0:
                ComBean.stopBit = SerialPort.STOPBITS_1;
                break;
            case 1:
                ComBean.stopBit = SerialPort.STOPBITS_1_5;
                break;
            case 2:
                ComBean.stopBit = SerialPort.STOPBITS_2;
                break;
            default:
                break;
        }
    }

    public Vector getComId() {

        Vector comIdList = new Vector();
        Enumeration commId = CommPortIdentifier.getPortIdentifiers();
        CommPortIdentifier portId;

        while (commId.hasMoreElements()) {
            portId = (CommPortIdentifier) commId.nextElement();

            if (portId.getPortType() == CommPortIdentifier.PORT_SERIAL) {
                comIdList.add(portId.getName());
            }
        }
        return comIdList;
    }

    public boolean initCom() {

        ConstantFactory.infoStr = "";
        ConstantFactory.comProRun = false;
        isComOpen = false;
        try {
            portId = CommPortIdentifier.getPortIdentifier(portName);
            try {
                serialPort = (SerialPort) portId.open("Serial_Communication", 2000);
            } catch (PortInUseException e) {
                ConstantFactory.infoStr = "端口已经被占用！";
                return false;
            }
            try {
                in = new DataInputStream(serialPort.getInputStream());
                out = serialPort.getOutputStream();
            } catch (IOException e) {
                ConstantFactory.infoStr = "IO 错误！";
                return false;
            }
            try {
                serialPort.setSerialPortParams(baudrate, dataBit, stopBit, parityBit);
            } catch (UnsupportedCommOperationException e) {
                ConstantFactory.infoStr = "参数设置错误！";
                return false;
            }

            if (false) {
                try {
                    serialPort.addEventListener(this);
                } catch (TooManyListenersException e) {
                    serialPort.close();
                    ConstantFactory.infoStr = "监听错误！";
                    return false;
                }
                serialPort.notifyOnDataAvailable(true);
            }

            RB = new SerialBuffer(serialComInstance);
            RT = new ReadSerial(in, RB);
            RT.setPriority(Thread.MAX_PRIORITY);
            RT.start();

        } catch (NoSuchPortException e) {
            ConstantFactory.infoStr = "端口未找到！";
            return false;
        }
        isComOpen = true;
        return isComOpen;
        
    }

    public void serialEvent(SerialPortEvent e) {
        switch (e.getEventType()) {
            case SerialPortEvent.BI:
            case SerialPortEvent.OE:
            case SerialPortEvent.FE:
            case SerialPortEvent.PE:
            case SerialPortEvent.CD:
            case SerialPortEvent.CTS:
            case SerialPortEvent.DSR:
            case SerialPortEvent.RI:
            case SerialPortEvent.OUTPUT_BUFFER_EMPTY:
                break;
            case SerialPortEvent.DATA_AVAILABLE:
                readComm();
                break;
            default:
                break;
        }
    }

    void readComm() {
        dataAnalysis();
    }

    public void receiveData() {
        int k = 0, f = 0, s = 0, l = 0, y = 0;
        readDataEnd = false;
        try {
            b[readBufferIndex] = in.read();
            if (b[readBufferIndex] == 170) {
                readBufferIndex = 0;
                readDataEnd = true;
            } else {
                readBufferIndex++;
            }
  }
           
        } catch (IOException e) {
        }
    }

    public void dataAnalysis() {
        int c;
        try {
            c = in.read();
            b[readBufferIndex] = c;
            readBufferIndex++;
            if (c == 170) {
                int n = 0;
            }
            if (readBufferIndex == 6) {
                int m = 0;
            }
        } catch (IOException e) {
        }
    }

    class ReadThread extends Thread {

        public ReadThread() {
        }

        public void run() {
            while (!ConstantFactory.comProRun) {
                readCom();
            }
        }

        public void stopRun() {
            ConstantFactory.comProRun = false;
        }

        public void readCom() {
            byte[] dataByte = new byte[1024];
            try {
                while (in.available() > 0) {
                    int readnum = in.read(dataByte);
                }

            } catch (IOException e) {
            }
        }
    }

    public void writeCom(String wrtStr) {
        try {
            for (int i = 0; i < wrtStr.length(); i++) {
                out.write(wrtStr.charAt(i));
            }
        } catch (IOException e) {
        }
    }

    public void writeCom(byte[] wrtByte, int length) {
        try {
            for (int i = 0; i < length; i++) {
                out.write(wrtByte[i]);
            }
        } catch (IOException e) {
        }
    }

    public void writeCom(byte[] b) {
        try {
            out.write(b);

        } catch (IOException e) {
        }
    }

    public boolean getIsComProOver() {
        return isComProOver;
    }

    public void setIsComProOver(boolean isComProOver) {
        this.isComProOver = isComProOver;
    }

    public boolean getIsConfigureAndStart() {
        return isConfigureAndStart;
    }

    public void setIsConfigureAndStart(boolean isConfigureAndStart) {
        this.isConfigureAndStart = isConfigureAndStart;
    }

    public boolean getIsComTestOk() {
        return isComTestOk;
    }

    public void setIsComTestOk(boolean isComTestOk) {
        this.isComTestOk = isComTestOk;
    }
}
{% endhighlight %}
ReadSerial.java 读取类，使用CommBean的对象进行串口的数据读取。<br>
{% highlight java %}
/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.dong.serialcom;

import java.io.IOException;
import java.io.InputStream;

/**
 *
 * @author Dong Gang
 */
public class ReadSerial extends Thread {

    private InputStream ComPort;
    private SerialBuffer Buffer;
 

    public ReadSerial(InputStream ComPort,SerialBuffer buffer) {
        this.ComPort = ComPort;
        this.Buffer = buffer;
    }

    public void run() {
        int c;
        try {
            while (true) {
               if(0<ComPort.available()){
                     c = ComPort.read();
                     Buffer.putByte(c);
                }
               
            }
        } catch (IOException e) {
        }
    }
}
{% endhighlight %}

我的Github上的项目链接如下
[Github 项目](https://github.com/gangdong/BLDC)
