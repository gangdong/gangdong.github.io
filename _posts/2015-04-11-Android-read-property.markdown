---
layout: post
title:  "Read/Write system property in Android APP"
date:   2015-04-11 23:48:12 +0800
categories: Android  
tags: Android
published: true
---
Recently I need to read system property in my Android apk development. I checked the Android documents and found that Android has a `Systemproperties` class to handle this kind of requirement. However `Systemproperties` class isn't a public class of SDK, which means it is invisible to the apk developer. My understanding is that google wants this class to be used for Android source developer rather than application developer.

If I use this class as a source developer, I have to raise my program with root permission and re-build the whole system. 

So I applied a trick way to access the `Systemproperties` method with the help of Java reflect mechanism.

I studied the source code of [SystemProperties.java](https://www.androidos.net.cn/android/9.0.0_r8/xref/frameworks/base/core/java/android/os/SystemProperties.java) and found the methods it implemented.

SystemProperties.java
{% highlight java %}
private static native String native_get(String key);
private static native String native_get(String key, String def);
private static native int native_get_int(String key, int def);
private static native long native_get_long(String key, long def);
private static native boolean native_get_boolean(String key, boolean def);
private static native void native_set(String key, String def);
private static native void native_add_change_callback();
private static native void native_report_sysprop_change();
{% endhighlight %}
This class defined the set/get methods for different data type. What I need is the get() method of return a String type.

The rest work is straightforward, I wrote below codes and inserted into my class.

{% highlight java %}
...
import java.lang.reflect.Method;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
...

public class MainActivity extends DisabledNavigationActivity {
     private Logger mLogger = new Logger(getClass().getSimpleName());
     private static final long VIBRATE_MS_IMAGE = 50;
     private Handler mHandler = new Handler(Looper.getMainLooper());
 
     ...

	 private final String vendorKey = "my_property";

     ...

	private interface PropertiesKeys {
        String VENDOR = "persist.vendor.sys.fp.vendor";
    }

	private String getStringProperty(
            @Nullable Method systemPropertiesGetString,
            @NonNull String propertyKey) {
        final String defaultValue = "";
        if (null == systemPropertiesGetString) {
            return defaultValue;
        }
        try {
            return (String) systemPropertiesGetString.invoke(
                    null, // No object when calling a static method.
                    propertyKey,
                    defaultValue);

        } catch (Exception e) {
            mLogger.e(Logger.format(
                  "Failed to read system property (%s): %s",
                  propertyKey,
                 e.getMessage()));
        }
        return defaultValue;
    }

    ....

     @Override
     protected void onCreate(Bundle savedInstanceState) {
         super.onCreate(savedInstanceState);
         mLogger.enter("onCreate");
         setContentView(R.layout.activity_main);
 
		Method sysPropGetString = null;
		try {
            // The SystemProperties class is not public in the SDK - access via reflection.
            final Class systemProperties = Class.forName("android.os.SystemProperties");
            sysPropGetString = systemProperties.getMethod("get",String.class,String.class);
        } catch (Exception e) {
            mLogger.e(Logger.format(
                    "Failed to get method system properties: %s",
                    e.getMessage()));
        }

		String propStr = getStringProperty(sysPropGetString, PropertiesKeys.VENDOR);

		mLogger.d("the vendor is " + propStr);

		if(!propStr.equal(vendorKey)){
			...
		}
	
		...

{% endhighlight %}