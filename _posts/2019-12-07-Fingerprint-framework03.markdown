---
layout: post
title:  "Android Fingerprint Framework (3)"
date:   2019-12-21 22:24:43 +0800
categories: Android Fingerprint
Published: true
---
We have talked in [last article]() the android fingerprint work flow   
1. Init.rc, start fingerprintd and register the remote service fingerprintdaemon with servicemanager
2. The system loads systemserver and starts fingerprint service.
3. Fingerservice gets the object of the remote service fingerprintdaemon, and calls the related methods to access the HAL.
fingerprintDaemoProxy::openHal() will call the native library xx.so to access native code.  

The hardware abstract layer (HAL) of Android system runs in user space. It shields the implementation details of hardware driver module downward and provides hardware access service (JNI or binder) upward. Through the hardware abstraction layer, Android system is divided into two layers to support hardware devices, one layer is implemented in user space, the other is implemented in kernel space. In traditional Linux system, the support for hardware is completely implemented in kernel space, that is, the support for hardware is completely implemented in hardware driver module.

The hardware abstraction layer of Android system manages various hardware access interfaces in the form of modules. Each hardware module has a dynamic link library .So file. The compilation of these dynamic link libraries needs to conform to certain specifications. In Android system, each hardware abstraction layer module is described by HW]hw_module_t, and the hardware device is described by hw_device_t.

These definition of these two struct is defined at [hardware.h]({{site.url}}/daviddong.github.io/assets/docs/hardware.h})<br>
android path: rot/hardware/libhardware/include/hardware/hardware.h

```c
typedef struct hw_module_t {
    /** tag must be initialized to HARDWARE_MODULE_TAG */
    uint32_t tag;

    /**
     * The API version of the implemented module. The module owner is
     * responsible for updating the version when a module interface has
     * changed.
     *
     * The derived modules such as gralloc and audio own and manage this field.
     * The module user must interpret the version field to decide whether or
     * not to inter-operate with the supplied module implementation.
     * For example, SurfaceFlinger is responsible for making sure that
     * it knows how to manage different versions of the gralloc-module API,
     * and AudioFlinger must know how to do the same for audio-module API.
     *
     * The module API version should include a major and a minor component.
     * For example, version 1.0 could be represented as 0x0100. This format
     * implies that versions 0x0100-0x01ff are all API-compatible.
     *
     * In the future, libhardware will expose a hw_get_module_version()
     * (or equivalent) function that will take minimum/maximum supported
     * versions as arguments and would be able to reject modules with
     * versions outside of the supplied range.
     */
    uint16_t module_api_version;
#define version_major module_api_version
    /**
     * version_major/version_minor defines are supplied here for temporary
     * source code compatibility. They will be removed in the next version.
     * ALL clients must convert to the new version format.
     */

    /**
     * The API version of the HAL module interface. This is meant to
     * version the hw_module_t, hw_module_methods_t, and hw_device_t
     * structures and definitions.
     *
     * The HAL interface owns this field. Module users/implementations
     * must NOT rely on this value for version information.
     *
     * Presently, 0 is the only valid value.
     */
    uint16_t hal_api_version;
#define version_minor hal_api_version

    /** Identifier of module */
    const char *id;

    /** Name of this module */
    const char *name;

    /** Author/owner/implementor of the module */
    const char *author;

    /** Modules methods */
    struct hw_module_methods_t* methods;

    /** module's dso */
    void* dso;

#ifdef __LP64__
    uint64_t reserved[32-7];
#else
    /** padding to 128 bytes, reserved for future use */
    uint32_t reserved[32-7];
#endif

} hw_module_t;

/**
 * Every device data structure must begin with hw_device_t
 * followed by module specific public methods and attributes.
 */
typedef struct hw_device_t {
    /** tag must be initialized to HARDWARE_DEVICE_TAG */
    uint32_t tag;

    /**
     * Version of the module-specific device API. This value is used by
     * the derived-module user to manage different device implementations.
     *
     * The module user is responsible for checking the module_api_version
     * and device version fields to ensure that the user is capable of
     * communicating with the specific module implementation.
     *
     * One module can support multiple devices with different versions. This
     * can be useful when a device interface changes in an incompatible way
     * but it is still necessary to support older implementations at the same
     * time. One such example is the Camera 2.0 API.
     *
     * This field is interpreted by the module user and is ignored by the
     * HAL interface itself.
     */
    uint32_t version;

    /** reference to the module this device belongs to */
    struct hw_module_t* module;

    /** padding reserved for future use */
#ifdef __LP64__
    uint64_t reserved[12];
#else
    uint32_t reserved[12];
#endif

    /** Close this device */
    int (*close)(struct hw_device_t* device);

} hw_device_t;
```
except that, this header file also declares the module name and two important functions.
```c
/**
 * Name of the hal_module_info
 */
#define HAL_MODULE_INFO_SYM         HMI

/**
 * Get the module info associated with a module by id.
 *
 * @return: 0 == success, <0 == error and *module == NULL
 */
int hw_get_module(const char *id, const struct hw_module_t **module);

/**
 * Get the module info associated with a module instance by class 'class_id'
 * and instance 'inst'.
 *
 * Some modules types necessitate multiple instances. For example audio supports
 * multiple concurrent interfaces and thus 'audio' is the module class
 * and 'primary' or 'a2dp' are module interfaces. This implies that the files
 * providing these modules would be named audio.primary.<variant>.so and
 * audio.a2dp.<variant>.so
 *
 * @return: 0 == success, <0 == error and *module == NULL
 */
int hw_get_module_by_class(const char *class_id, const char *inst,
                           const struct hw_module_t **module);
```
these two functions are realized at [hardware.c]({{site.url}}/daviddong.github.io/assets/docs/hardware.c)<br>
android path: root/hardware/libhardware/hardware.c 
from the file, we can find the module search path is as below.
```
/** Base path of the hal modules */
#if defined(__LP64__)
#define HAL_LIBRARY_PATH1 "/system/lib64/hw"
#define HAL_LIBRARY_PATH2 "/vendor/lib64/hw"
#define HAL_LIBRARY_PATH3 "/odm/lib64/hw"
#else
#define HAL_LIBRARY_PATH1 "/system/lib/hw"
#define HAL_LIBRARY_PATH2 "/vendor/lib/hw"
#define HAL_LIBRARY_PATH3 "/odm/lib/hw"
#endif

static const char *variant_keys[] = {
    "ro.hardware",  /* This goes first so that it can pick up a different
                       file on the emulator. */
    "ro.product.board",
    "ro.board.platform",
    "ro.arch"
};

static const int HAL_VARIANT_KEYS_COUNT =
    (sizeof(variant_keys)/sizeof(variant_keys[0]));

/**
 * Load the file defined by the variant and if successful
 * return the dlopen handle and the hmi.
 * @return 0 = success, !0 = failure.
 */
static int load(const char *id,
        const char *path,
        const struct hw_module_t **pHmi)
{
    int status = -EINVAL;
    void *handle = NULL;
    struct hw_module_t *hmi = NULL;

    /*
     * load the symbols resolving undefined symbols before
     * dlopen returns. Since RTLD_GLOBAL is not or'd in with
     * RTLD_NOW the external symbols will not be global
     */
    handle = dlopen(path, RTLD_NOW);
    if (handle == NULL) {
        char const *err_str = dlerror();
        ALOGE("load: module=%s\n%s", path, err_str?err_str:"unknown");
        status = -EINVAL;
        goto done;
    }

    /* Get the address of the struct hal_module_info. */
    const char *sym = HAL_MODULE_INFO_SYM_AS_STR;
    hmi = (struct hw_module_t *)dlsym(handle, sym);
    if (hmi == NULL) {
        ALOGE("load: couldn't find symbol %s", sym);
        status = -EINVAL;
        goto done;
    }

    /* Check that the id matches */
    if (strcmp(id, hmi->id) != 0) {
        ALOGE("load: id=%s != hmi->id=%s", id, hmi->id);
        status = -EINVAL;
        goto done;
    }

    hmi->dso = handle;

    /* success */
    status = 0;

    done:
    if (status != 0) {
        hmi = NULL;
        if (handle != NULL) {
            dlclose(handle);
            handle = NULL;
        }
    } else {
        ALOGV("loaded HAL id=%s path=%s hmi=%p handle=%p",
                id, path, *pHmi, handle);
    }

    *pHmi = hmi;

    return status;
}

/*
 * Check if a HAL with given name and subname exists, if so return 0, otherwise
 * otherwise return negative.  On success path will contain the path to the HAL.
 */
static int hw_module_exists(char *path, size_t path_len, const char *name,
                            const char *subname)
{
    snprintf(path, path_len, "%s/%s.%s.so",
             HAL_LIBRARY_PATH3, name, subname);
    if (access(path, R_OK) == 0)
        return 0;

    snprintf(path, path_len, "%s/%s.%s.so",
             HAL_LIBRARY_PATH2, name, subname);
    if (access(path, R_OK) == 0)
        return 0;

    snprintf(path, path_len, "%s/%s.%s.so",
             HAL_LIBRARY_PATH1, name, subname);
    if (access(path, R_OK) == 0)
        return 0;

    return -ENOENT;
}

int hw_get_module_by_class(const char *class_id, const char *inst,
                           const struct hw_module_t **module)
{
    int i = 0;
    char prop[PATH_MAX] = {0};
    char path[PATH_MAX] = {0};
    char name[PATH_MAX] = {0};
    char prop_name[PATH_MAX] = {0};


    if (inst)
        snprintf(name, PATH_MAX, "%s.%s", class_id, inst);
    else
        strlcpy(name, class_id, PATH_MAX);

    /*
     * Here we rely on the fact that calling dlopen multiple times on
     * the same .so will simply increment a refcount (and not load
     * a new copy of the library).
     * We also assume that dlopen() is thread-safe.
     */

    /* First try a property specific to the class and possibly instance */
    snprintf(prop_name, sizeof(prop_name), "ro.hardware.%s", name);
    if (property_get(prop_name, prop, NULL) > 0) {
        if (hw_module_exists(path, sizeof(path), name, prop) == 0) {
            goto found;
        }
    }

    /* Loop through the configuration variants looking for a module */
    for (i=0 ; i<HAL_VARIANT_KEYS_COUNT; i++) {
        if (property_get(variant_keys[i], prop, NULL) == 0) {
            continue;
        }
        if (hw_module_exists(path, sizeof(path), name, prop) == 0) {
            goto found;
        }
    }

    /* Nothing found, try the default */
    if (hw_module_exists(path, sizeof(path), name, "default") == 0) {
        goto found;
    }

    return -ENOENT;

found:
    /* load the module, if this fails, we're doomed, and we should not try
     * to load a different variant. */
    return load(class_id, path, module);
}

int hw_get_module(const char *id, const struct hw_module_t **module)
{
    return hw_get_module_by_class(id, NULL, module);
}

```
hw_get_module() will call the hw_get_module_by_class function. First, it will read the system property "ro. Hardware" through the property_get function. If it is found, use the hw_module_exists function to check whether the .So file exists. If it exists, load it directly else if it does not exist, continue to search for the variant_keys array. Checking system attribute values. If it exists, load it directly. If it does not exist still, load the default.

Let's turn back to the FingerprintDaemonProxy::openHal() to see how it call the hw_get_module() function.

```c++
int64_t FingerprintDaemonProxy::openHal() {

    ALOG(LOG_VERBOSE, LOG_TAG, "nativeOpenHal()\n");

    int err;

    const hw_module_t *hw_module = NULL;

    if (0 != (err = hw_get_module(FINGERPRINT_HARDWARE_MODULE_ID, &hw_module))) {

        ALOGE("Can't open fingerprint HW Module, error: %d", err);

        return 0;

    }

    if (NULL == hw_module) {

     ALOGE("No valid fingerprint module");

        return 0;

    }

    ......

}
```

