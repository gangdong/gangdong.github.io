---
layout: post
title:  "利用Microsoft WDK工具生成数字签名"
date:   2020-07-23 18:24:12 +0800
categories: Others
Published: true
---
看过我这一篇文章 [「浅谈数字签名」]({{site.baseurl}}/others/2020/07/06/Others-signature.html) 的读者应该记得，在这篇文章的末尾遗留了一个问题 --- **在windows平台下如何利用Microsoft提供的工具来生成数字签名**。我在这篇文章中会对这个问题做一个说明，并引用一个例子来介绍签名的过程。

---

## 目录

1. [相关工具](#5)
2. [签名流程](#6)
3. [举例](#7)
    + [3.1 生成目录文件](#8)
    + [3.2 生成数字证书](#9)
    + [3.3 将公钥证书格式转换成SPC文件](#10)
    + [3.4 将公钥证书和私钥合并成一个PFX格式的证书文件](#11)
    + [3.5 生成签名](#12)
    + [3.6 验证签名](#15)
4. [常见问题](#13)
5. [附录](#14)
    + [5.1 makecert.exe 命令格式](#1)
        + [5.1.1 基本选项](#5.1.1)
        + [5.1.2 扩展选项](#5.1.2)
    + [5.2 cert2spc.exe 命令格式](#2)
        + [5.2.1 语法格式](#5.2.1)
        + [5.2.2 参数](#5.2.2)
        + [5.2.3 选项](#5.2.3)
    + [5.3 pvk2pfx.exe 命令格式](#3)
        + [5.3.1 参数](#5.3.1)
    + [5.4 signtool.exe 命令格式](#4)
        + [5.4.1 语法格式](#5.4.1)
        + [5.4.2 参数](#5.4.2)
        + [5.4.3 catdb 命令选项](#5.4.3)
        + [5.4.4 sign 命令选项](#5.4.4)
        + [5.4.5 TimeStamp 命令选项](#5.4.5)
        + [5.4.6 Verify 命令选项](#5.4.6)
        + [5.4.7 返回值](#5.4.7)
        + [5.4.8 示例](#5.4.8)

---
## <span id ="5">1. 相关工具</span>
这里我先把和签名相关的工具罗列出来。

|工具|说明|
|---|---|
|makecert.exe|使用这个工具来生成测试用的证书|
|cert2spc.exe|使用 cert2spc.exe 将公钥证书转换为软件发布者证书，即spc文件|
|pvk2pfx.exe|使用 pvk2pfx.exe 将公钥证书和私钥证书合并成一个PFX格式的证书文件|
|inf2cat.exe|驱动开发会用到，该工具确定驱动程序包的 INF 文件是否可以针对指定的 Windows 版本列表进行数字签名。如果可以，那么 Inf2Cat.exe 会生成适用于指定 Windows 版本的未签名的目录文件|
|signtool.exe|数字签名制作工具,制作数字签名和验证|

## <span id ="6">2. 制作流程</span>

1. 使用 Inf2Cat.exe 将INF转成CAT 目录文件（针对驱动开发，非驱动程序可跳过这步）
2. 使用 makecert.exe 制作自己的根证书
3. 使用 cert2spc.exe 将公钥证书转换为软件发布者证书，即spc文件
4. 使用 pvk2pfx.exe 将公钥证书和私钥证书合并成一个PFX格式的证书文件
5. 使用 signtool.exe 签名
6. 使用 signtool.exe 验证签名

## <span id ="7">3. 举例</span>

下面我就以一个例子来演示一下整个过程。

### <span id ="8">3.1 生成目录文件（*.cat）</span>
利用 Inf2Cat.exe 将INF 转换为 CAT 目录文件这部分内容，我在这一篇文章 [Inf2Cat 工具使用]({{site.baseurl}}/others/2020/07/09/Others-inf2cat.html) 中已经做过介绍。这里不在进行说明。

### <span id ="9">3.2 生成数字证书</span>
makecert.exe 是一种证书创建工具，生成仅用于测试目的的 [X.509]({{site.baseurl}}/others/2020/07/06/Others-signature.html#11) 证书。此工具将密钥对与指定发行者的名称相关联，并创建一个 X.509 证书，该证书将用户指定的名称绑定到密钥对的公共部分。

**makecert.exe 的存放路径** 
```c
C:\Program Files (x86)\Windows Kits\10\bin\10.0.17763.0\x86
```
如果没有设置该路径的环境变量的话，使用时要先切换到该路径下。或者直接使用Visual Studio 的 [开发人员命令提示](https://docs.microsoft.com/zh-cn/dotnet/framework/tools/developer-command-prompt-for-vs) `Developer Command Prompt` 执行命令。

关于 makecert.exe 的命令格式和参数，请见附录 [「makecert.exe 命令格式」](#1)。

执行下列命令创建一个创建自签署证书 `RootDavid`。
```console
makecert -n "CN=RootDavid" -r -sv testsk.pvk testpk.cer
```
运行这个命令后，会弹出提示框，首先给 `testsk.pvk` 文件设置私钥保护口令。

![makecert01]({{site.baseurl}}/assets/image/others-make-sign-01.png){: .center-image }

然后，再次输入这个口令用私钥(testsk.pvk文件中）来给公钥（`testpk.cer`文件中）签名（自签名）。

![makecert01]({{site.baseurl}}/assets/image/others-make-sign-02.png){: .center-image }

输入正确的私钥口令后，控制台会返回 Succeeded.

![makecert01]({{site.baseurl}}/assets/image/others-make-sign-03.png){: .center-image }

并在当前目录下生成两个文件

![makecert01]({{site.baseurl}}/assets/image/others-make-sign-04.png){: .center-image }

其中
1. 私钥证书 - `testsk.pvk`
2. 公钥证书 - `testpk.cer`

如果你需要用这个根证书签发其他子证书的话，可以运行如下命令签发。
```console
makecert -n "CN=SubCertDavid" -iv testsk.pvk -ic testpk.cer -sv subsk.pvk subpk.cer
```
### <span id ="10">3.3 将公钥证书格式转换成SPC（软件发布者证书）</span>
 
使用 cert2spc.exe 这个工具将刚才生成的公钥证书（testpk.cer）转换为 SPC 文件。    
**cert2spc.exe 的存放路径** 
```c
C:\Program Files (x86)\Windows Kits\10\bin\10.0.17763.0\x86
```
关于 cert2spc.exe 的用法，请见附录 [「cert2spc.exe 命令格式」](#2)。  
 
运行如下命令   

![makecert01]({{site.baseurl}}/assets/image/others-make-sign-05.png){: .center-image }

执行成功后在当前目录下生成

![makecert01]({{site.baseurl}}/assets/image/others-make-sign-06.png){: .center-image }

### <span id ="11">3.4 将公钥证书和私钥合并成一个PFX格式的证书文件</span>
使用 pvk2pfx .exe 这个工具将公钥证书（testpk.spc）和私钥证书(testsk.pvk)合并成一个`PFX`格式的证书文件。      
**pvk2pfx.exe 的存放路径** 
```console
C:\Program Files (x86)\Windows Kits\10\bin\10.0.17763.0\x86
```
关于 pvk2pfx.exe 的用法，请见附录 [「pvk2pfx.exe 命令格式」](#3)。

执行如下命令

![makecert01]({{site.baseurl}}/assets/image/others-make-sign-07.png){: .center-image }

合并时会要求输入私钥testsk.pvk的保护口令来合并.pvk和.spc文件。输入之前设定的口令，就可在当前目录下得到生成的pfx文件。

![makecert01]({{site.baseurl}}/assets/image/others-make-sign-08.png){: .center-image }


### <span id ="12">3.5 生成签名</span>
使用signtool命令签名。

**signtool.exe 的存放路径** 
```c
C:\Program Files (x86)\Windows Kits\10\bin\10.0.17763.0\x86
```
关于signtool的用法，请见附录 [「signtool.exe 命令格式」](#4)。

执行下列命令。
```c
signtool sign /v /f testpfx.pfx /tr http://timestamp.digicert.com MXT_ENC2Array_Converter.exe
```
如果成功，会返回

![makecert01]({{site.baseurl}}/assets/image/others-make-sign-10.png){: .center-image }

这时签名已经成功了。我们打开被签名的应用程序的属性标签，找到数字签名那一栏，可以看到签名的信息。

![makecert01]({{site.baseurl}}/assets/image/others-make-sign-11.png){: .center-image }

点开 `详细信息`-> `高级`，可以看详细的签名信息。

![makecert01]({{site.baseurl}}/assets/image/others-make-sign-12.png){: .center-image }

X.509 格式证书信息。

![makecert01]({{site.baseurl}}/assets/image/others-make-sign-13.png){: .center-image }

证书颁发路径为根证书。

![makecert01]({{site.baseurl}}/assets/image/others-make-sign-14.png){: .center-image }

我们看到当前的证书是不授信的，需要将其添加导入证书库中。   
Microsoft规定应使用证书存储区来安全地存储证书（证书存储区是系统中一个特殊区域，专门用来保存X.509数字证书）。

![makecert01]({{site.baseurl}}/assets/image/others-make-sign-15.png){: .center-image }

Windows 预设了以下存储区： 

|存储区|说明|
|---|---|
|AddressBook|其他用户的 X.509 证书存储区。|
|AuthRoot|第三方证书颁发机构 (CA) 的 X.509 证书存储区。|
|CertificateAuthority|中间证书颁发机构 (CA) 的 X.509 证书存储区。|
|Disallowed|吊销的证书的 X.509 证书存储区。|
|My|个人证书的 X.509 证书存储区。|
|Root|受信任的根证书颁发机构 (CA) 的 X.509 证书存储区。|
|TrustedPeople|直接受信任的人和资源的 X.509 证书存储区。|
|TrustedPublisher|直接受信任的发行者的 X.509 证书存储区。|

下面我们就将证书添加到存储区，选择 `安装证书`，然后一路 `Next`。

![makecert01]({{site.baseurl}}/assets/image/others-make-sign-16.png){: .center-image }                     

直到 `证书存储` 步骤，选择 `将所有的证书放入下列存储`：点击 `浏览`，在弹出的对话框中选择 `个人`-> `确定`。
                          
![makecert01]({{site.baseurl}}/assets/image/others-make-sign-17.png){: .center-image } 
                                        
为什么要选择 `个人` 呢？可以参见 signtool 的 [sign 子命令的/s](#sign) 选项的说明：「指定要在搜索证书时打开的存储区。 如果未指定该选项，则打开`My`存储」这里的 `My` 就是 `个人`。然后就可以一路 `下一步` 到导入完成了。我们可以到计算机的管理控制台确认。在开始菜单中搜索并运行`mmc`。在mmc界面中，选择 `文件`-> `添加删除管理单元`。在弹出的 `添加删除管理单元` 对话框中，在左边的 `可用的管理单元` 中选择 `证书`。

![makecert01]({{site.baseurl}}/assets/image/others-make-sign-18.png){: .center-image } 
                                               
点击中间的 `添加` 按钮，在弹出的对话框中选择 `我的用户帐户` 或 `计算机用户帐户`，再点击 `完成`：

![makecert01]({{site.baseurl}}/assets/image/others-make-sign-19.png){: .center-image } 

就将 `证书` 节点添加到 `所选管理节点` 中了：

点击 `确定`，回到管理控制台主界面中，在左边的树控件中展开 `证书` -> `当前用户`-> `个人`，选择 `证书` 节点，就可以看见已经导入的RootDavid证书。

![makecert01]({{site.baseurl}}/assets/image/others-make-sign-20.png){: .center-image } 
双击RootDavid，可以看见证书对话框里写着“您有一个与该证书对应的私钥”。对话框里还写着“此CA根目录证书不受信任。要启用信任，请将该证书安装到 `受信任的根证书颁发机构` 存储区”。后面会讲到这一点。

![makecert01]({{site.baseurl}}/assets/image/others-make-sign-21.png){: .center-image }

### <span id = "15">3.6 验证签名</span>

接下来就是要验证exe的签名。

执行下列命令
```c
signtool verify /pa MXT_ENC2Array_Converter.exe
```
此时返回了如下的结果，显示

![makecert01]({{site.baseurl}}/assets/image/others-make-sign-22.png){: .center-image }

这是因为目前还没有将RootDavid的公钥证书添加到之前提到的 `受信任的根证书颁发机构`。要做这一步的话，需要找到公钥证书 `testpk.cer`，然后双击该cer文件，在弹出的证书对话框中选择 `安装证书`。接下来和之前的导入证书操作一样，只是在 `证书存储` 这一步，需要选择将证书存储在 `受信任的根证书颁发机构` 存储区，而不是之前的 `个人` 存储区中。

![makecert01]({{site.baseurl}}/assets/image/others-make-sign-23.png){: .center-image }
此时会弹出一个警告提示，让你确认是否要安装此证书到授信存储区，点击确认后，成功安装。回到管理控制台主界面中，在左边的树控件中展开 `证书` -> `当前用户` -> `受信任的根证书颁发机构`，选择 `证书` 节点，就可以看见已经导入的 `testpk.cer` 公钥证书。   
此时在进行验证，验证成功！:100:

![makecert01]({{site.baseurl}}/assets/image/others-make-sign-24.png){: .center-image }

此时再打开被签名的应用程序属性页，可以看到签名已经是授信的了。

![makecert01]({{site.baseurl}}/assets/image/others-make-sign-25.png){: .center-image }

<br/>
## <span id ="13">4. 常见问题</span>

1. 执行 makecert.exe 时出现如下错误
```console
'makecert' is not recognized as an internal or external command,
operable program or batch file.
```
原因：这是因为没有在 makecert.exe 的路径下执行该命令，解决方法时切换到工具所在的目录下执行。
```console
cd C:\Program Files (x86)\Windows Kits\10\bin\10.0.17763.0\x86
```
或者直接使用Visual Studio 的 [开发人员命令提示](https://docs.microsoft.com/zh-cn/dotnet/framework/tools/developer-command-prompt-for-vs) `Developer Command Prompt` 运行命令。

2. 我在执行 makecert.exe 时失败，返回如下提示
```console
Error: File already exists for the subject ('testsk.pvk')
Error: Can't create the key of the subject ('testsk.pvk')
Failed
```
原因：这是因为没有在管理员权限下执行 makecert.exe 命令，解决方法是用管理员权限打开 CMD，运行命令。

3. 我的需要签名的文件名里有空格，执行签名的操作后失败。
```console
signtool sign /v /f testpfx.pfx /tr http://timestamp.wosign.com/rfc3161 my file name.exe
```
原因：文件名不能包含空格，重命名后再次签名可以成功。

4. 执行 `signtool verify` 时提示
![makecert01]({{site.baseurl}}/assets/image/others-make-sign-26.png){: .center-image }
原因：这是因为公钥文件xx.cer没有被添加到受信任的根证书颁发机构。解决方法 [如上](#15)。


## <span id ="14">5. 附录</span>
### <span id = "1">5.1 makecert.exe 命令格式</span>
makecert.exe 命令格式
```console
MakeCert [/b DateStart] [/e DateEnd] [/len KeyLength] [/m nMonths] [/n "Name"] [/pe] [/r] [/sc SubjectCertFile] [/sk SubjectKey] [/sr SubjectCertStoreLocation] [/ss SubjectCertStoreName] [/sv SubjectKeyFile]OutputFile
```

<span id="5.1.1">**5.1.1 基本选项**</span>     

|选项|说明|
|---|---|
|`-n` x.509name|指定主题的证书名称。在双引号中指定此名称，并加上前缀 CN=；例如，"CN=myName"。|
|`-pe`|将所生成的私钥标记为可导出。这样可将私钥包括在证书中。|
|`-sk` keyname|指定主题的密钥容器位置，该位置包含私钥。如果密钥容器不存在，系统将创建一个。|
|`-sr` location|指定主题的证书存储位置。Location 可以是 currentuser（默认值）或 localmachine。|
|`-ss` store|指定主题的证书存储名称，输出证书即存储在那里。|
|`-#` number|指定一个介于 1 和 2,147,483,647 之间的序列号。默认值是由 Makecert.exe 生成的唯一值。|
|`-$` authority|指定证书的签名权限，必须设置为 commercial（对于商业软件发行者使用的证书）或 individual（对于个人软件发行者使用的证书）。|

<span id="5.1.1">**5.1.2 扩展选项**</span>      

|选项|说明|
|---|---|
|`-a` algorithm|指定签名算法。必须是 `md5`（默认值）或 `sha1`。|
|`-b` mm/dd/yyyy|指定有效期的开始时间。默认为证书的创建日期。|
|`-e` mm/dd/yyyy|指定有效期的结束时间。默认为 `12/31/2039 11:59:59 GMT`。|
|`-m` number|以月为单位指定证书有效期的持续时间。|
|`-cy` certType|指定证书类型。有效值是 `end`（对于最终实体）和 `authority`（对于证书颁发机构）。|
|`-d` name|显示主题的名称|
|`-eku` oid[,oid]|将用逗号分隔的增强型密钥用法对象标识符 (OID) 列表插入到证书中。|
|`-h` number|指定此证书下面的树的最大高度。|
|`-ic` file|指定颁发者的证书文件。|
|`-ik` keyName|指定颁发者的密钥容器名称。|
|`-iky` keytype|指定颁发者的密钥类型，必须是 exchange、signature 或一个表示提供程序类型的整数。默认情况下，可传入 1 表示交换密钥，传入 2 表示签名密钥。|
|`-in` name|指定颁发者的证书公用名称。|
|`-ip` provider|指定颁发者的 CryptoAPI 提供程序名称。|
|`-ir` location|指定颁发者的证书存储位置。Location 可以是 currentuser（默认值）或 localmachine。|
|`-is` store|指定颁发者的证书存储名称。|
|`-iv` pvkFile|指定颁发者的 .pvk 私钥文件。|
|`-iy` pvkFile|指定颁发者的 CryptoAPI 提供程序类型。|
|`-l` link|到策略信息的链接（例如，一个 URL）。|
|`-r`|创建自签署证书。|
|`-sc` file|指定主题的证书文件。|
|`-sky` keytype|指定主题的密钥类型，必须是exchange、 signature或一个表示提供程序类型的整数。默认情况下，可传入 1 表示交换密钥，传入 2 表示签名密钥。|
|`-sp` provider|指定主题的 CryptoAPI 提供程序名称。|
|`-sv` pvkFile|指定主题的 .pvk 私钥文件。如果该文件不存在，系统将创建一个。|
|`-sy` type|指定主题的 CryptoAPI 提供程序类型。|

### <span id = "2">5.2 cert2spc.exe 命令格式</span>
软件发行者证书测试工具 cert2spc.exe 从一个或多个X.509证书创建软件发行者证书（SPC）。cert2spc.exe 仅用于测试目的。商业目的的SPC可以从证书颁发机构（如VeriSign或Thawte）获取。

<span id = "5.2.1">**5.2.1 语法格式**</span>  
```console
cert2spc cert1.cer | crl1.crl [... certN.cer | crlN.crl] outputSPCfile.spc
```
<span id = "5.2.2">**5.2.2 参数**</span>

|参数|说明|
|---|---|
|`certN.cer`|要包含在 SPC 文件中的 X.509 证书的名称。 可以指定用空格分隔的多个名称。|
|`crlN.crl`|要包含在 SPC 文件中的证书吊销列表的名称。 可以指定用空格分隔的多个名称。|
|`outputSPCfile.spc`|将包含 X.509 证书的 PKCS #7 对象的名称。|

<span id = "5.2.3">**5.2.3 选项**</span>

|选项|说明|
|---|---|
|/?|显示该工具的命令语法和选项。|

### <span id = "3">5.3 pvk2pfx.exe 命令格式</span>
Pvk2Pfx.exe 是一个命令行工具，它将.spc、.cer和.pvk文件中包含的公钥和私钥信息复制到个人信息交换（.pfx）文件中。
命令格式
```console
pvk2pfx /pvk pvkfilename.pvk [/pi pvkpassword] /spc spcfilename.ext [/pfx pfxfilename.pfx [/po pfxpassword] [/f]]
```
<span id = "5.3.1">**5.3.1 参数**</span>

|参数|说明|
|---|---|
|`/pvk` pvkfilename.pvk|指定一个.pvk 文件的名称。|
|`/spc` spcfilename.ext|指定的名称和扩展名软件发布者证书 (SPC)包含证书的文件。 该文件可以是.spc 文件或 `.cer` 文件。|
|`/pfx` pfxfilename.pfx|指定.pfx 文件的名称。|
|`/pi` pvkpassword|指定.pvk 文件的密码。|
|`/po` pfxpassword|指定.pfx 文件的密码。 如果未指定.pfx 文件的密码，.pfx 文件的密码将作为.pvk 文件的密码相同。|
|`/f`|配置 Pvk2Pfx 覆盖.pfx 文件，如果存在与指定的同名 -pfx切换。|

若要使用 SignTool 工具来签署驱动程序符合的方式使用 SPC内核模式代码签署策略，必须将 SPC 信息添加到对进行签名的驱动程序在本地计算机上个人证书存储。有关如何将 SPC 信息添加到个人证书存储区的信息，请参阅[「Microsoft Docs - 软件发布者证书」](https://docs.microsoft.com/zh-cn/windows-hardware/drivers/install/software-publisher-certificate)。

### <span id = "4">5.4 signtool.exe 命令格式</span>
签名工具是一个命令行工具，用于对文件进行数字签名，以及验证文件和时间戳文件中的签名。 

<span id = "5.4.1">**5.4.1 语法格式**</span>   
在命令提示符处，键入以下内容：

```console  
signtool [command] [options] [file_name | ...]  
```  

<span id = "5.4.2">**5.4.2 参数**</span>  
  
|参数|描述|  
|--------------|-----------------|  
|`command`|指定要对文件执行的操作的四个命令（`catdb`、`sign`、`Timestamp` 或 `Verify`）之一。 有关每个命令的说明，请参见下一个表。|  
|`options`|用于修改命令的选项。 除全局 `/q` 和 `/v` 选项之外，每个命令均支持一组唯一选项。|  
|`file_name`|要进行签名的文件的路径。|  
  
 签名工具支持下列命令。 每个命令均与不同的选项集结合使用，这些选项集已在其各自的节中列出。  
  
|命令|描述|  
|-------------|-----------------|  
|`catdb`|在目录数据库中添加或移除目录文件。 目录数据库用于自动查找目录文件，并由 GUID 标识。 有关 `catdb` 命令支持的选项列表，请参阅 [catdb 命令选项](#catdb)。|  
|`sign`|对文件进行数字签名。 数字签名可以阻止文件被篡改，并且使用户能够基于签名证书验证签名者。 有关 `sign` 命令支持的选项列表，请参阅 [sign 命令选项](#sign)。|  
|`Timestamp`|为文件添加时间戳。 有关 `TimeStamp` 命令支持的选项列表，请参阅 [TimeStamp 命令选项](#TimeStamp)。|  
|`Verify`|通过确定签名证书是否由受信任的颁发机构颁发、是否已撤消签名证书，以及签名证书对于特定策略是否有效（可选）来验证文件的数字签名。 有关 `Verify` 命令支持的选项列表，请参阅 [Verify 命令选项](#Verify)。|  
  
 下列选项适用于所有签名工具命令。  
  
|全局选项|描述|  
|-------------------|-----------------|  
|**/q**|如果命令运行成功，则不显示输出；如果命令运行失败，则显示最小输出。|  
|**/v**|无论命令是否运行成功，都显示详细输出，并显示警告消息。|  
|**/debug**|显示调试信息。|  
  
<a name="catdb"></a>
<span id="5.4.3">**5.4.3 catdb 命令选项**</span>  
 下表列出了可与 `catdb` 命令一起使用的选项。  
  
|Catdb 选项|描述|  
|------------------|-----------------|  
|`/d`|指定更新默认目录数据库。 如果 `/d` 和 `/g` 选项都未使用，则签名工具会更新系统组件和驱动程序数据库。|  
|`/g` GUID|指定由全局唯一标识符 GUID 标识的目录数据库已更新。|  
|`/r`|从目录数据库中移除指定的目录。 如果未指定该选项，签名工具将向目录数据库添加指定目录。|  
|`/u`|指定自动为添加的目录文件生成唯一名称。 如有必要，重命名目录文件以阻止与现有目录文件发生名称冲突。 如果未指定该选项，签名工具将覆盖与所添加的目录同名的任何现有目录。|  
  
<a name="sign"></a>
<span id = "5.4.4">**5.4.4 sign 命令选项**</span>  
 下表列出了可与 `sign` 命令一起使用的选项。  
  
|Sign 命令选项|描述|  
|-------------------------|-----------------|  
|`/a`|自动选择最佳签名证书。 签名工具将查找满足所有指定条件的所有有效证书，并选择有效时间最长的证书。 如果未提供该选项，签名工具仅查找一个有效的签名证书。|  
|`/ac`  file|将 file 中的其他证书添加到签名块。|  
|`/as`|追加此签名。 如果不存在主签名，则改为使此签名成为主签名。|  
|`/c`  CertTemplateName|指定用于对证书进行签名的证书模板名（一个 Microsoft 扩展）。|  
|`/csp`  CSPName|指定包含私钥容器的加密服务提供程序 (CSP)。|  
|`/d`  Desc|指定已签名内容的说明。|  
|`/du`  URL|为已签名内容的详细说明指定统一资源定位器 (URL)。|  
|`/f`  SignCertFile|指定文件中的签名证书。 如果文件采用个人信息交换 (PFX) 格式且受密码保护，则使用 `/p` 选项指定密码。 如果文件不包含私钥，则使用 `/csp` 和 `/kc` 选项指定 CSP 和私钥容器名。|  
|`/fd`|指定要用于创建文件签名的文件摘要算法。 默认值为 SHA1。|  
|`/i`  IssuerName|指定签名证书的颁发者的名称。 该值可以是整个颁发者名称的子字符串。|  
|`/kc`  PrivKeyContainerName|指定私钥容器名。|  
|`/n`  SubjectName|指定签名证书的主题的名称。 该值可以是整个主题名称的子字符串。|  
|`/nph`|如果支持，则取消可执行文件的页面哈希。 默认值由 SIGNTOOL_PAGE_HASHES 环境变量和 wintrust.dll 版本决定。 对于非 PE 文件，忽略此选项。|  
|`/p`  Password|指定打开 PFX 文件时要使用的密码。 （使用 `/f` 选项指定 PFX 文件。）|  
|`/p7` *路径*|指定为每个指定的内容文件生成的公钥加密标准 (PKCS) #7 文件。 PKCS #7 文件命名为 path\\filename.p7。|  
|`/p7ce` Value|为已签名的 PKCS #7 内容指定选项。 将 Value 设置为“嵌入的”，可将已签名内容嵌入到 PKCS #7 文件中；如果设置为“DetachedSignedData”，则可生成分离的 PKCS #7 文件的已签名数据部分。 如果未使用 `/p7ce` 选项，默认情况下将嵌入已签名的内容。|  
|`/p7co` \<OID>|指定标识已签名的 PKCS #7 内容的对象标识符 (OID)。|  
|`/ph`|如果支持，则生成可执行文件的页面哈希。|  
|`/r`  RootSubjectName|指定签名证书必须链接到的根证书的主题名称。 该值可以是根证书的整个主题名称的子字符串。|  
|`/s`  StoreName|指定要在搜索证书时打开的存储。 如果未指定该选项，则打开 `My` 存储。|  
|`/sha1`  Hash|指定签名证书的 SHA1 哈希。 当多个证书满足剩余开关指定的条件时，通常会指定 SHA1 哈希。|  
|`/sm`|指定使用计算机存储，而不是用户存储。|  
|`/t`  URL|指定时间戳服务器的 URL。 如果该选项（或 `/tr`）不存在，将不会对签名文件执行时间戳操作。 如果时间戳操作失败，将生成一个警告。 此选项不能与 `/tr` 选项一起使用。|  
|`/td`  alg|将此选项与 `/tr` 选项一起使用可请求 RFC 3161 时间戳服务器使用的摘要算法。|  
|`/tr`  URL|指定 RFC 3161 时间戳服务器的 URL。 如果该选项（或 `/t`）不存在，将不会对签名文件执行时间戳操作。 如果时间戳操作失败，将生成一个警告。 此选项不能与 `/t` 选项一起使用。|  
|`/u`  Usage|指定签名证书中必须存在的增强型密钥用法 (EKU)。 可以通过 OID 或字符串指定该用法的值。 默认用法为“代码签名”(1.3.6.1.5.5.7.3.3)。|  
|`/uw`|指定“Windows 系统组件验证”(1.3.6.1.4.1.311.10.3.6) 的用法。|  
  
 有关用法示例，请参阅 [「Microsoft Docs - Using SignTool to Sign a File」](https://docs.microsoft.com/zh-cn/windows/win32/seccrypto/using-signtool-to-sign-a-file)（使用 SignTool 为文件签名）。  
  
<a name="TimeStamp"></a>
<span id = "5.4.5">**5.4.5 TimeStamp 命令选项**</span> 
 下表列出了可与 `TimeStamp` 命令一起使用的选项。  
  
|TimeStamp 选项|描述|  
|----------------------|-----------------|  
|`/p7`|对 PKCS #7 文件执行时间戳操作。|  
|`/t`  URL|指定时间戳服务器的 URL。 要执行时间戳操作的文件必须在以前已进行签名。 需要 `/t` 或 `/tr` 选项。|  
|`/td`  alg|请求 RFC 3161 时间戳服务器使用的摘要算法。 `/td` 与 `/tr` 选项一起使用。|  
|`/tp` index|对 index 处的签名进行时间戳操作。|  
|`/tr`  URL|指定 RFC 3161 时间戳服务器的 URL。 要执行时间戳操作的文件必须在以前已进行签名。 需要 `/tr` 或 `/t` 选项。|  
  
 有关使用示例，请参阅 [「Microsoft Docs - Adding Time Stamps to Previously Signed Files」](https://docs.microsoft.com/zh-cn/windows/win32/seccrypto/adding-time-stamps-to-previously-signed-files)（向之前已签名的文件添加时间戳）。  
  
<a name="Verify"></a>
<span id = "5.4.6">**5.4.6 Verify 命令选项**</span> 
  
|Verify 选项|描述|  
|-------------------|-----------------|  
|`/a`|指定可以使用所有方法来验证文件。 首先，搜索目录数据库以确定是否在目录中对文件进行签名。 如果未在任何目录中对文件进行签名，签名工具将尝试验证文件的嵌入签名。 验证可以或不能在目录中进行签名的文件时，建议使用该选项。 这些文件的示例包括 Windows 文件或驱动程序。|  
|`/ad`|使用默认的目录数据库查找目录。|  
|`/ag` CatDBGUID|在由 CatDBGUID 标识的目录数据库中查找目录。|  
|`/all`|验证包含多个签名的文件中的所有签名。|  
|`/as`|使用系统组件（驱动程序）目录数据库查找目录。|  
|`/c` CatFile|通过名称指定目录文件。|  
|`/d`|指定签名工具应打印描述和描述 URL。|  
|`/ds`  Index|验证指定位置的签名。|  
|`/hash` (`SHA1`&#124;`SHA256`)|指定在目录中搜索文件时要使用的可选哈希算法。|  
|`/kp`|指定应使用内核模式驱动程序签名策略执行验证。|  
|`/ms`|使用多个验证语义。 这是 Windows 8 和更高版本上的 [「Microsoft Docs - WinVerifyTrust」](https://docs.microsoft.com/zh-cn/windows/win32/seccrypto/using-signtool-to-verify-a-file-signature) 调用的默认行为。|  
|`/o` Version|按操作系统版本验证文件。 版本具有以下格式：PlatformID：VerMajor.VerMinor.BuildNumber。 PlatformID 表示 <xref:System.PlatformID> 枚举成员的基础值。 **重要提示：** 建议使用 `/o` 开关。 如果未指定 `/o`，SignTool.exe 可能会返回意外的结果。 例如，如果你未将 `/o` 开关包含在内，则能在旧版操作系统上正确验证的系统目录可能在新版操作系统上无法正确验证。|  
|`/p7`|验证 PKCS #7 文件。 无现有策略用于 PKCS #7 验证。 该签名处于选中状态，并为签名证书生成了链。|  
|`/pa`|指定应使用默认认证码验证策略。 如果未指定 `/pa` 选项，签名工具将使用 Windows 驱动程序验证策略。 此选项不能与 `catdb` 选项一起使用。|  
|`/pg` PolicyGUID|通过 GUID 指定验证策略。 PolicyGUID 相当于验证策略的 ActionID。 此选项不能与 `catdb` 选项一起使用。|  
|`/ph`|指定签名工具应打印并验证页面哈希值。|  
|`/r` RootSubjectName|指定签名证书必须链接到的根证书的主题名称。 该值可以是根证书的整个主题名称的子字符串。|  
|`/tw`|指定在未对签名进行时间戳操作时应生成警告。|  

<span id = "5.4.7">**5.4.7 返回值**</span>    
 当其终止时，签名工具将返回下列退出代码之一。  
  
|退出代码|描述|  
|---------------|-----------------|  
|0|执行成功。|  
|1|执行失败。|  
|2|执行完成，但出现警告。|  
  
<span id = "5.4.8">**5.4.8 示例**</span>     
 以下命令将目录文件 MyCatalogFileName.cat 添加到系统组件和驱动程序数据库中。 如有必要阻止替换名为 `/u` 的现有目录文件，`MyCatalogFileName.cat` 选项会生成唯一名称。  
  
```console  
signtool catdb /v /u MyCatalogFileName.cat  
```  
  
 以下命令通过使用最佳证书对文件进行自动签名。  
  
```console  
signtool sign /a MyFile.exe  
```  
  
 以下命令使用存储在受密码保护的 PFX 文件中的证书对文件进行数字签名。  
  
```console  
signtool sign /f MyCert.pfx /p MyPassword MyFile.exe  
```  
  
 以下命令对文件进行数字签名并加盖时间戳。 用于对文件进行签名的证书存储在 PFX 文件中。  
  
```console  
signtool sign /f MyCert.pfx /t http://timestamp.digicert.com MyFile.exe  
```  
  
 以下命令通过使用位于 `My` 存储中的证书对文件进行签名，该证书的主题名为 `My Company Certificate`。  
  
```console  
signtool sign /n "My Company Certificate" MyFile.exe  
```  
  
 以下命令对 ActiveX 控件进行签名，并提供在系统提示用户安装此控件时由 Internet Explorer 显示的信息。  
  
```console  
Signtool sign /f MyCert.pfx /d: "MyControl" /du http://www.example.com/MyControl/info.html MyControl.exe  
```  
  
 以下命令对已进行数字签名的文件加盖时间戳。  
  
```console  
signtool timestamp /t http://timestamp.digicert.com MyFile.exe  
```  
  
 以下命令确认文件已签名。  
  
```console  
signtool verify MyFile.exe  
```  
  
 以下命令验证可能已在目录中签名的系统文件。  
  
```console  
signtool verify /a SystemFile.dll  
```  
  
 以下命令验证已在名为 `MyCatalog.cat` 目录中签名的系统文件。  
  
```console  
signtool verify /c MyCatalog.cat SystemFile.dll  
```  