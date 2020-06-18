---
layout: post
title:  "HelloWorld: my first SGX application"
date:   2020-06-01 22:04:51 +0800
categories: Others
Published: true
---
A simple sample code to get start with the SGX application development.

1. New create VC++ `Win32 Console Application`.
![project]({{site.baseurl}}/assets/image/others-sgx-start-01.PNG){: .center-image }
The project name is 'HelloWorld'.
2. Create new VC++ `Intel SGX Enclave project`.
![psw]({{site.baseurl}}/assets/image/others-sgx-11.PNG){: .center-image }
Use default project name 'Enclave1'.  
3. Edit `Enclave1.edl` file with below code.
![project]({{site.baseurl}}/assets/image/others-sgx-start-02.PNG){: .center-image }
This piece of code declares the `foo()` method as a trusted method and executes at trusted zone.  
```cpp
enclave {
    from "sgx_tstdc.edl" import *;

    trusted {
        /* define ECALLs here. */
		public void foo([out,size=len] char* buf,size_t len);
    };

    untrusted {
        /* define OCALLs here. */

    };
};
```
Edit `Enclave1.cpp`. Realize the `foo()` method.
```cpp
#include "sgx_trts.h"
#include "Enclave1_t.h"
#include "sgx_trts.h"
#include <string.h>
void foo(char *buf, size_t len)
{
	const char *secret = "Hello App!";
	if (len > strlen(secret))
	{
		memcpy(buf, secret, strlen(secret) + 1);
	}
}
```
4. Set the 'Enclave1' project configuration as below.
![project]({{site.baseurl}}/assets/image/others-sgx-start-03.PNG){: .center-image }
5. Build the 'Enclave1' project.
![project]({{site.baseurl}}/assets/image/others-sgx-start-04.PNG){: .center-image }
Above result shows the 'Enclave1' project has been build successfully. Next I need to add it into the 'HelloWorld' project and call the `foo()` methods.
6. Edit the `main()` method of `HelloWorld.cpp` file. 
```cpp
#include "stdafx.h"
#include <stdio.h>
#include <tchar.h>
#include "sgx_urts.h"
#include <string.h>
#include "Enclave1_u.h"
#define ENCLAVE_FILE _T("Enclave1.signed.dll")
#define MAX_BUF_LEN 100
int main()
{
	sgx_enclave_id_t	eid;
	sgx_status_t		ret = SGX_SUCCESS;
	sgx_launch_token_t	token = { 0 };
	int updated = 0;
	char buffer[MAX_BUF_LEN] = "Hello World!";
	//create a enclave container
	ret = sgx_create_enclave(ENCLAVE_FILE, SGX_DEBUG_FLAG, &token, 
    &updated, &eid, NULL);
	if (ret != SGX_SUCCESS)
	{
		printf("APP:error %#x ,failed to create enclave .\n", ret);
		return -1;
	}
	//Enclave CALL(ECALL) 
	foo(eid, buffer, MAX_BUF_LEN);
	printf("%s\n", buffer);
	getchar();
	//distory enclave container
	if (SGX_SUCCESS != sgx_destroy_enclave(eid))
		return -1;
	system("pause");
	getchar();
	return 0;
}
```
7. Set the 'HelloWorld' project configuration.
![project]({{site.baseurl}}/assets/image/others-sgx-start-06.PNG){: .center-image }
8. Add 'Enclave1' project into the 'HelloWorld' project.
Right click 'Solution HelloWorld' -> add -> existing project and select 'Enclave1' project. Now there are two projects under the 'Solution HelloWorld'.
![project]({{site.baseurl}}/assets/image/others-sgx-start-15.PNG){: .center-image }
right click 'HelloWorld' project -> Intel SGX Configuration -> Import Enclave
![project]({{site.baseurl}}/assets/image/others-sgx-start-07.PNG){: .center-image }
Select `Enclave1.edl`.
![project]({{site.baseurl}}/assets/image/others-sgx-start-08.PNG){: .center-image }<br>{: .center-image }
The `Enclave1.edl` file will be envoloved into the source of 'HelloWorld' project.
![project]({{site.baseurl}}/assets/image/others-sgx-start-09.PNG){: .center-image }
9. Since the 'HelloWorld' project is the main project, I need to add the dependency of 'Enclave1' project.
Set the main project.
![project]({{site.baseurl}}/assets/image/others-sgx-start-10.PNG){: .center-image }
Set the dependency.
![project]({{site.baseurl}}/assets/image/others-sgx-start-11.PNG){: .center-image }
10. The configuration is done!    
Build the main project and start to run. 
11. Unfortunately, the trying is failed with the below error.
![project]({{site.baseurl}}/assets/image/others-sgx-start-12.PNG){: .center-image }
That is because my CPU cannot support SGX at present. I have to change the running mode to Simulation.
![project]({{site.baseurl}}/assets/image/others-sgx-start-13.PNG){: .center-image }
I got below result, which means my first app was runing well.:v:  
![project]({{site.baseurl}}/assets/image/others-sgx-start-14.PNG){: .center-image }