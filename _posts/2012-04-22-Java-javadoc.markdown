---
layout: post
title:  "Javadoc 使用"
date:   2012-04-22 22:44:19 +0800
categories: Java
published: true
language: chinese
---
相信很多有经验的程序员都知道写注释的重要性，程序注释不仅仅是对代码进行说明，它其实也是代码本身组成的一部分。对于Java程序的开发者来说，更是如此。

注释已经变成了代码API接口文档的一部分。这是因为Java提供了一个工具Javadoc，能够从注释中抽取信息，直接生成API的帮助文档。文档的格式就同Java SDK官方API文档保持一致。这对于善于写代码却头疼写API文档的人来说简直是一款神器。

下面就简单的对Javadoc的使用做一个说明。使用Javadoc工具生成API文档时需要按照Java SDK的规定使用一系列的标签来完成，需要使用标签的地方有，

+ 类（接口）的注释
+ 构造函数的注释
+ 方法的注释
+ 全局变量的注释
+ 字段/属性的注释
+ 对外提供的接口注释
+ 在循环和逻辑分支组成的代码中的注释
+ 需要特殊说明的地方的注释


## 标签
Java SDK规定按照如下的顺序添加标签。

{% highlight ruby %}
@author (classes and interfaces only, required)
@version (classes and interfaces only, required. See footnote 1)
@param (methods and constructors only)
@return (methods only)
@exception (@throws is a synonym added in Javadoc 1.2)
@see
@since
@serial (or @serialField or @serialData)
@deprecated (see How and When To Deprecate APIs)
{% endhighlight %}
其中，

#### @author name-text
使用@Author选项时，将具有指定名称文本的`Author`条目添加到生成的文档中。文档注释可以包含多个@author标记。可以为每个@author标记指定一个名称，也可以为每个标记指定多个名称。
#### @deprecated deprecated-text
从JDK 5.0开始，可以使用@Deprecated指示不应再使用此API（即使它可能继续工作）。Javadoc工具将不推荐的文本移到主描述前面，将其放在斜体中，并在其前面加上一个粗体警告：“不推荐”。此标记在所有文档注释中都有效：`overview`、`package`、`class`、`interface`、`constructor`、`method`和`field`。 
#### @version
对类的说明 ，标明该类模块的版本。默认为1.0
#### {@code  text}
等同于<code>{@literal}</code>. 将文本标记为代码样式的文本，一般在Javadoc中只要涉及到类名或者方法名，都需要使用@code进行标记。
#### {@docRoot}
表示从任何生成的页到生成的文档（目标）根目录的相对路径。
#### @exception  class-name  description
按照官方文档解释：是@throws同义词，没有任何区分。具体说明在@throws里再讲。
#### {@link  package.class#member  label}
插入带有可见文本标签的内联链接，该链接指向引用类的指定包、类或成员名称的文档。此标记在所有文档注释中都有效。这个标记非常类似于@see–两者都需要相同的引用，并且接受完全相同的语法包类成员和标签。主要的区别是{@link}生成一个内联链接，而不是将链接放在“See Also”部分。
#### @value value-text
用于标注在常量上，{@value} 用于表示常量的值。
#### @param  parameter-name description
后面跟参数名，再跟参数描述，对方法参数的描述。只对方法的注释有效。
#### @return  description
该标签标记方法的返回值，只对方法的注释有效。
#### @see  reference
@see 一般用于标记该类相关联的类,@see即可以用在类上，也可以用在方法上。
#### @serial  field-description | include | exclude
用于默认可序列化字段的文档注释中。可选字段描述应解释字段的含义并列出可接受的值。
#### @serialData  data-description
data-description数据描述以序列化形式记录数据的类型和顺序。这个标签很少使用，目前我基本上没有用到过。
#### @since  since-text
根据官方文档解释，@since 表达的是被标记元素是哪个发布版本引入的，一般后面跟版本号，也可以跟是一个时间，表示文件当前创建的时间。该标签对所有Javadoc注释类型有效。
#### @throws  class-name  description
异常描述 , 用于描述方法内部可能抛出的异常。@throws和@exception标记是同义词。在生成的文档中添加一个`Throws`标签，其中包含类名和说明文本。类名是该方法可能引发的异常的名称。此标签仅在方法或构造函数的文档注释中有效。对于相同或不同的异常，可以在给定的文档注释中使用多个@throws标记。
为了确保记录所有选中的异常，如果throws子句中的异常不存在@throws标记，Javadoc工具会自动将该异常添加到HTML输出中（没有描述），就好像它是用@throws标记记录的一样。

更多详情可以参考[How to Write Doc Comments for the Javadoc Tool](https://www.oracle.com/technical-resources/articles/java/javadoc-tool.html)和[The Java API Documentation Generator](https://docs.oracle.com/javase/7/docs/technotes/tools/windows/javadoc.html#author).

## 命令
Javadoc的命令行语法如下：
{% highlight ruby %}
    javadoc [ options ] [ packagenames ] [ sourcefiles ] [ @files ]
{% endhighlight %}
参数可以按照任意顺序排列。下面分别就这些参数和相关的一些内容进行说明：
+ Packagenames 包列表。这个选项可以是一系列的包名（用空格隔开），例如`java.lang java.lang.reflect java.awt`。不过，因为javadoc不递归作用于子包，不允许对包名使用通配符；所以你必须显示地列出希望建立文档的每一个包。
+ Sourcefiles 源文件列表。这个选项可以是一系列的源文件名（用空格隔开），可以使用通配符。javadoc允许四种源文件：类源代码文件、包描述文件、总体概述文件、其他杂文件。
+ 类源代码文件：类或者接口的源代码文件。
+ 包描述文件：每一个包都可以有自己的包描述文件。包描述文件的名称必须是`package.html`，与包的.java文件放置在一起。包描述文件的内 容通常是使用HTML标记写的文档。javadoc执行时将自动寻找包描述文件。如果找到，javadoc将首先对描述文件中<body> </body>之间的内容进行处理，然后把处理结果放到该包的Package Summary页面中，最后把包描述文件的第一句（紧靠<body>）放到输出的Overview summary页面中，并在语句前面加上该包的包名。
+  总体概述文件：javadoc可以创建一个总体概述文件描述整个应用或者所有包。总体概述文件可以被任意命名，也可以放置到任意位置。
+  其他文件：这些文件通常是指与javadoc输出的HTML文件相关的一些图片文件、Java源代码文件（.java）、Java程序 （.class）、Java小程序（Applets）、HTML文件。这些文件必须放在`doc-file`目录中。