/*
 *  Copyright 2013 Alexey Andreev.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
"use strict";
var $rt_global = this;
var $rt_lastObjectId = 1;
function $rt_nextId() {
    var current = $rt_lastObjectId;
    var next = (current + 1) | 0;
    if (next === 0) {
        next = (next + 1) | 0;
    }
    $rt_lastObjectId = next;
    return current;
}
function $rt_compare(a, b) {
    return a > b ? 1 : a < b ? -1 : 0;
}
function $rt_isInstance(obj, cls) {
    return obj !== null && !!obj.constructor.$meta && $rt_isAssignable(obj.constructor, cls);
}
function $rt_isAssignable(from, to) {
    if (from === to) {
        return true;
    }
    var supertypes = from.$meta.supertypes;
    for (var i = 0; i < supertypes.length; i = (i + 1) | 0) {
        if ($rt_isAssignable(supertypes[i], to)) {
            return true;
        }
    }
    return false;
}
function $rt_createArray(cls, sz) {
    var data = new Array(sz);
    var arr = new ($rt_arraycls(cls))(data);
    if (sz > 0) {
        var i = 0;
        do {
            data[i] = null;
            i = (i + 1) | 0;
        } while (i < sz);
    }
    return arr;
}
function $rt_wrapArray(cls, data) {
    return new ($rt_arraycls(cls))(data);
}
function $rt_createUnfilledArray(cls, sz) {
    return new ($rt_arraycls(cls))(new Array(sz));
}
function $rt_createLongArray(sz) {
    var data = new Array(sz);
    var arr = new ($rt_arraycls($rt_longcls()))(data);
    for (var i = 0; i < sz; i = (i + 1) | 0) {
        data[i] = Long_ZERO;
    }
    return arr;
}
var $rt_createNumericArray;
var $rt_createCharArray;
var $rt_createByteArray;
var $rt_createShortArray;
var $rt_createIntArray;
var $rt_createBooleanArray;
var $rt_createFloatArray;
var $rt_createDoubleArray;
if (typeof 'ArrayBuffer' !== 'undefined') {
    $rt_createNumericArray = function(cls, nativeArray) {
        return new ($rt_arraycls(cls))(nativeArray);
    };
    $rt_createCharArray = function(sz) {
        return $rt_createNumericArray($rt_charcls(), new Uint16Array(sz));
    };
    $rt_createByteArray = function(sz) {
        return $rt_createNumericArray($rt_bytecls(), new Int8Array(sz));
    };
    $rt_createShortArray = function(sz) {
        return $rt_createNumericArray($rt_shortcls(), new Int16Array(sz));
    };
    $rt_createIntArray = function(sz) {
        return $rt_createNumericArray($rt_intcls(), new Int32Array(sz));
    };
    $rt_createBooleanArray = function(sz) {
        return $rt_createNumericArray($rt_booleancls(), new Int8Array(sz));
    };
    $rt_createFloatArray = function(sz) {
        return $rt_createNumericArray($rt_floatcls(), new Float32Array(sz));
    };
    $rt_createDoubleArray = function(sz) {
        return $rt_createNumericArray($rt_doublecls(), new Float64Array(sz));
    };
} else {
    $rt_createNumericArray = function(cls, sz) {
      var data = new Array(sz);
      var arr = new ($rt_arraycls(cls))(data);
      for (var i = 0; i < sz; i = (i + 1) | 0) {
          data[i] = 0;
      }
      return arr;
    };
    $rt_createByteArray = function(sz) { return $rt_createNumericArray($rt_bytecls(), sz); };
    $rt_createShortArray = function(sz) { return $rt_createNumericArray($rt_shortcls(), sz); };
    $rt_createIntArray = function(sz) { return $rt_createNumericArray($rt_intcls(), sz); };
    $rt_createBooleanArray = function(sz) { return $rt_createNumericArray($rt_booleancls(), sz); };
    $rt_createFloatArray = function(sz) { return $rt_createNumericArray($rt_floatcls(), sz); };
    $rt_createDoubleArray = function(sz) { return $rt_createNumericArray($rt_doublecls(), sz); };
    $rt_createCharArray = function(sz) { return $rt_createNumericArray($rt_charcls(), sz); }
}
function $rt_arraycls(cls) {
    var result = cls.$array;
    if (result === null) {
        var arraycls = function(data) {
            this.data = data;
            this.$id$ = 0;
        };
        arraycls.prototype = new ($rt_objcls())();
        arraycls.prototype.constructor = arraycls;
        arraycls.prototype.toString = function() {
            var str = "[";
            for (var i = 0; i < this.data.length; ++i) {
                if (i > 0) {
                    str += ", ";
                }
                str += this.data[i].toString();
            }
            str += "]";
            return str;
        };
        var name = "[" + cls.$meta.binaryName;
        arraycls.$meta = { item : cls, supertypes : [$rt_objcls()], primitive : false, superclass : $rt_objcls(),
                name : name, binaryName : name, enum : false };
        arraycls.classObject = null;
        arraycls.$array = null;
        result = arraycls;
        cls.$array = arraycls;
    }
    return result;
}
function $rt_createcls() {
    return {
        $array : null,
        classObject : null,
        $meta : {
            supertypes : [],
            superclass : null
        }
    };
}
function $rt_createPrimitiveCls(name, binaryName) {
    var cls = $rt_createcls();
    cls.$meta.primitive = true;
    cls.$meta.name = name;
    cls.$meta.binaryName = binaryName;
    cls.$meta.enum = false;
    cls.$meta.item = null;
    return cls;
}
var $rt_booleanclsCache = null;
function $rt_booleancls() {
    if ($rt_booleanclsCache === null) {
        $rt_booleanclsCache = $rt_createPrimitiveCls("boolean", "Z");
    }
    return $rt_booleanclsCache;
}
var $rt_charclsCache = null;
function $rt_charcls() {
    if ($rt_charclsCache === null) {
        $rt_charclsCache = $rt_createPrimitiveCls("char", "C");
    }
    return $rt_charclsCache;
}
var $rt_byteclsCache = null;
function $rt_bytecls() {
    if ($rt_byteclsCache === null) {
        $rt_byteclsCache = $rt_createPrimitiveCls("byte", "B");
    }
    return $rt_byteclsCache;
}
var $rt_shortclsCache = null;
function $rt_shortcls() {
    if ($rt_shortclsCache === null) {
        $rt_shortclsCache = $rt_createPrimitiveCls("short", "S");
    }
    return $rt_shortclsCache;
}
var $rt_intclsCache = null;
function $rt_intcls() {
    if ($rt_intclsCache === null) {
        $rt_intclsCache = $rt_createPrimitiveCls("int", "I");
    }
    return $rt_intclsCache;
}
var $rt_longclsCache = null;
function $rt_longcls() {
    if ($rt_longclsCache === null) {
        $rt_longclsCache = $rt_createPrimitiveCls("long", "J");
    }
    return $rt_longclsCache;
}
var $rt_floatclsCache = null;
function $rt_floatcls() {
    if ($rt_floatclsCache === null) {
        $rt_floatclsCache = $rt_createPrimitiveCls("float", "F");
    }
    return $rt_floatclsCache;
}
var $rt_doubleclsCache = null;
function $rt_doublecls() {
    if ($rt_doubleclsCache === null) {
        $rt_doubleclsCache = $rt_createPrimitiveCls("double", "D");
    }
    return $rt_doubleclsCache;
}
var $rt_voidclsCache = null;
function $rt_voidcls() {
    if ($rt_voidclsCache === null) {
        $rt_voidclsCache = $rt_createPrimitiveCls("void", "V");
    }
    return $rt_voidclsCache;
}
function $rt_init(cls, constructor, args) {
    var obj = new cls();
    cls.prototype[constructor].apply(obj, args);
    return obj;
}
function $rt_throw(ex) {
    throw $rt_exception(ex);
}
function $rt_exception(ex) {
    var err = ex.$jsException;
    if (!err) {
        err = new Error("Java exception thrown");
        err.$javaException = ex;
        ex.$jsException = err;
    }
    return err;
}
function $rt_createMultiArray(cls, dimensions) {
    var first = 0;
    for (var i = dimensions.length - 1; i >= 0; i = (i - 1) | 0) {
        if (dimensions[i] == 0) {
            first = i;
            break;
        }
    }
    if (first > 0) {
        for (i = 0; i < first; i = (i + 1) | 0) {
            cls = $rt_arraycls(cls);
        }
        if (first == dimensions.length - 1) {
            return $rt_createArray(cls, dimensions[first]);
        }
    }
    var arrays = new Array($rt_primitiveArrayCount(dimensions, first));
    var firstDim = dimensions[first] | 0;
    for (i = 0; i < arrays.length; i = (i + 1) | 0) {
        arrays[i] = $rt_createArray(cls, firstDim);
    }
    return $rt_createMultiArrayImpl(cls, arrays, dimensions, first);
}
function $rt_createByteMultiArray(dimensions) {
    var arrays = new Array($rt_primitiveArrayCount(dimensions, 0));
    if (arrays.length == 0) {
        return $rt_createMultiArray($rt_bytecls(), dimensions);
    }
    var firstDim = dimensions[0] | 0;
    for (var i = 0; i < arrays.length; i = (i + 1) | 0) {
        arrays[i] = $rt_createByteArray(firstDim);
    }
    return $rt_createMultiArrayImpl($rt_bytecls(), arrays, dimensions);
}
function $rt_createCharMultiArray(dimensions) {
    var arrays = new Array($rt_primitiveArrayCount(dimensions, 0));
    if (arrays.length == 0) {
        return $rt_createMultiArray($rt_charcls(), dimensions);
    }
    var firstDim = dimensions[0] | 0;
    for (var i = 0; i < arrays.length; i = (i + 1) | 0) {
        arrays[i] = $rt_createCharArray(firstDim);
    }
    return $rt_createMultiArrayImpl($rt_charcls(), arrays, dimensions, 0);
}
function $rt_createBooleanMultiArray(dimensions) {
    var arrays = new Array($rt_primitiveArrayCount(dimensions, 0));
    if (arrays.length == 0) {
        return $rt_createMultiArray($rt_booleancls(), dimensions);
    }
    var firstDim = dimensions[0] | 0;
    for (var i = 0; i < arrays.length; i = (i + 1) | 0) {
        arrays[i] = $rt_createBooleanArray(firstDim);
    }
    return $rt_createMultiArrayImpl($rt_booleancls(), arrays, dimensions, 0);
}
function $rt_createShortMultiArray(dimensions) {
    var arrays = new Array($rt_primitiveArrayCount(dimensions, 0));
    if (arrays.length == 0) {
        return $rt_createMultiArray($rt_shortcls(), dimensions);
    }
    var firstDim = dimensions[0] | 0;
    for (var i = 0; i < arrays.length; i = (i + 1) | 0) {
        arrays[i] = $rt_createShortArray(firstDim);
    }
    return $rt_createMultiArrayImpl($rt_shortcls(), arrays, dimensions, 0);
}
function $rt_createIntMultiArray(dimensions) {
    var arrays = new Array($rt_primitiveArrayCount(dimensions, 0));
    if (arrays.length == 0) {
        return $rt_createMultiArray($rt_intcls(), dimensions);
    }
    var firstDim = dimensions[0] | 0;
    for (var i = 0; i < arrays.length; i = (i + 1) | 0) {
        arrays[i] = $rt_createIntArray(firstDim);
    }
    return $rt_createMultiArrayImpl($rt_intcls(), arrays, dimensions, 0);
}
function $rt_createLongMultiArray(dimensions) {
    var arrays = new Array($rt_primitiveArrayCount(dimensions, 0));
    if (arrays.length == 0) {
        return $rt_createMultiArray($rt_longcls(), dimensions);
    }
    var firstDim = dimensions[0] | 0;
    for (var i = 0; i < arrays.length; i = (i + 1) | 0) {
        arrays[i] = $rt_createLongArray(firstDim);
    }
    return $rt_createMultiArrayImpl($rt_longcls(), arrays, dimensions, 0);
}
function $rt_createFloatMultiArray(dimensions) {
    var arrays = new Array($rt_primitiveArrayCount(dimensions, 0));
    if (arrays.length == 0) {
        return $rt_createMultiArray($rt_floatcls(), dimensions);
    }
    var firstDim = dimensions[0] | 0;
    for (var i = 0; i < arrays.length; i = (i + 1) | 0) {
        arrays[i] = $rt_createFloatArray(firstDim);
    }
    return $rt_createMultiArrayImpl($rt_floatcls(), arrays, dimensions, 0);
}
function $rt_createDoubleMultiArray(dimensions) {
    var arrays = new Array($rt_primitiveArrayCount(dimensions, 0));
    if (arrays.length == 0) {
        return $rt_createMultiArray($rt_doublecls(), dimensions);
    }
    var firstDim = dimensions[0] | 0;
    for (var i = 0; i < arrays.length; i = (i + 1) | 0) {
        arrays[i] = $rt_createDoubleArray(firstDim);
    }
    return $rt_createMultiArrayImpl($rt_doublecls(), arrays, dimensions, 0);
}
function $rt_primitiveArrayCount(dimensions, start) {
    var val = dimensions[start + 1] | 0;
    for (var i = start + 2; i < dimensions.length; i = (i + 1) | 0) {
        val = (val * (dimensions[i] | 0)) | 0;
        if (val == 0) {
            break;
        }
    }
    return val;
}
function $rt_createMultiArrayImpl(cls, arrays, dimensions, start) {
    var limit = arrays.length;
    for (var i = (start + 1) | 0; i < dimensions.length; i = (i + 1) | 0) {
        cls = $rt_arraycls(cls);
        var dim = dimensions[i];
        var index = 0;
        var packedIndex = 0;
        while (index < limit) {
            var arr = $rt_createUnfilledArray(cls, dim);
            for (var j = 0; j < dim; j = (j + 1) | 0) {
                arr.data[j] = arrays[index];
                index = (index + 1) | 0;
            }
            arrays[packedIndex] = arr;
            packedIndex = (packedIndex + 1) | 0;
        }
        limit = packedIndex;
    }
    return arrays[0];
}
function $rt_assertNotNaN(value) {
    if (typeof value === 'number' && isNaN(value)) {
        throw "NaN";
    }
    return value;
}
var $rt_stdoutBuffer = "";
function $rt_putStdout(ch) {
    if (ch == 0xA) {
        if (console) {
            console.info($rt_stdoutBuffer);
        }
        $rt_stdoutBuffer = "";
    } else {
        $rt_stdoutBuffer += String.fromCharCode(ch);
    }
}
var $rt_stderrBuffer = "";
function $rt_putStderr(ch) {
    if (ch == 0xA) {
        if (console) {
            console.info($rt_stderrBuffer);
        }
        $rt_stderrBuffer = "";
    } else {
        $rt_stderrBuffer += String.fromCharCode(ch);
    }
}
function $rt_metadata(data) {
    for (var i = 0; i < data.length; i += 7) {
        var cls = data[i];
        cls.$meta = {};
        var m = cls.$meta;
        m.name = data[i + 1];
        m.binaryName = "L" + m.name + ";";
        var superclass = data[i + 2];
        m.superclass = superclass !== 0 ? superclass : null;
        m.supertypes = data[i + 3];
        if (m.superclass) {
            m.supertypes.push(m.superclass);
            cls.prototype = new m.superclass();
        } else {
            cls.prototype = {};
        }
        var flags = data[i + 4];
        m.enum = (flags & 1) != 0;
        m.primitive = false;
        m.item = null;
        cls.prototype.constructor = cls;
        cls.classObject = null;
        var clinit = data[i + 5];
        cls.$clinit = clinit !== 0 ? clinit : function() {};

        var virtualMethods = data[i + 6];
        for (var j = 0; j < virtualMethods.length; j += 2) {
            var name = virtualMethods[j];
            var func = virtualMethods[j + 1];
            if (typeof name === 'string') {
                name = [name];
            }
            for (var k = 0; k < name.length; ++k) {
                cls.prototype[name[k]] = func;
            }
        }

        cls.$array = null;
    }
}
function $rt_threadStarter(f) {
    return function() {
        var args = Array.prototype.slice.apply(arguments);
        $rt_startThread(function() {
            f.apply(this, args);
        });
    }
}
function $rt_mainStarter(f) {
    return function(args) {
        if (!args) {
            args = [];
        }
        var javaArgs = $rt_createArray($rt_objcls(), args.length);
        for (var i = 0; i < args.length; ++i) {
            javaArgs.data[i] = $rt_str(args[i]);
        }
        $rt_threadStarter(f)(javaArgs);
    };
}
var $rt_stringPool_instance;
function $rt_stringPool(strings) {
    $rt_stringPool_instance = new Array(strings.length);
    for (var i = 0; i < strings.length; ++i) {
        $rt_stringPool_instance[i] = $rt_intern($rt_str(strings[i]));
    }
}
function $rt_s(index) {
    return $rt_stringPool_instance[index];
}
function TeaVMThread(runner) {
    this.status = 3;
    this.stack = [];
    this.suspendCallback = null;
    this.runner = runner;
    this.attribute = null;
    this.completeCallback = null;
}
TeaVMThread.prototype.push = function() {
    for (var i = 0; i < arguments.length; ++i) {
        this.stack.push(arguments[i]);
    }
    return this;
};
TeaVMThread.prototype.s = TeaVMThread.prototype.push;
TeaVMThread.prototype.pop = function() {
    return this.stack.pop();
};
TeaVMThread.prototype.l = TeaVMThread.prototype.pop;
TeaVMThread.prototype.isResuming = function() {
    return this.status == 2;
};
TeaVMThread.prototype.isSuspending = function() {
    return this.status == 1;
};
TeaVMThread.prototype.suspend = function(callback) {
    this.suspendCallback = callback;
    this.status = 1;
};
TeaVMThread.prototype.start = function(callback) {
    if (this.status != 3) {
        throw new Error("Thread already started");
    }
    if ($rt_currentNativeThread !== null) {
        throw new Error("Another thread is running");
    }
    this.status = 0;
    this.completeCallback = callback ? callback : function(result) {
        if (result instanceof Error) {
            throw result;
        }
    };
    this.run();
};
TeaVMThread.prototype.resume = function() {
    if ($rt_currentNativeThread !== null) {
        throw new Error("Another thread is running");
    }
    this.status = 2;
    this.run();
};
TeaVMThread.prototype.run = function() {
    $rt_currentNativeThread = this;
    var result;
    try {
        result = this.runner();
    } catch (e) {
        result = e;
    } finally {
        $rt_currentNativeThread = null;
    }
    if (this.suspendCallback !== null) {
        var self = this;
        var callback = this.suspendCallback;
        this.suspendCallback = null;
        callback(function() {
            self.resume();
        });
    } else if (this.status === 0) {
        this.completeCallback(result);
    }
};
function $rt_suspending() {
    var thread = $rt_nativeThread();
    return thread != null && thread.isSuspending();
}
function $rt_resuming() {
    var thread = $rt_nativeThread();
    return thread != null && thread.isResuming();
}
function $rt_suspend(callback) {
    return $rt_nativeThread().suspend(callback);
}
function $rt_startThread(runner, callback) {
    new TeaVMThread(runner).start(callback);
}
var $rt_currentNativeThread = null;
function $rt_nativeThread() {
    return $rt_currentNativeThread;
}
function $rt_invalidPointer() {
    throw new Error("Invalid recorded state");
}

function $dbg_repr(obj) {
    return obj.toString ? obj.toString() : "";
}
function $dbg_class(obj) {
    if (obj instanceof Long) {
        return "long";
    }
    var cls = obj.constructor;
    var arrayDegree = 0;
    while (cls.$meta && cls.$meta.item) {
        ++arrayDegree;
        cls = cls.$meta.item;
    }
    var clsName = "";
    if (cls === $rt_booleancls()) {
        clsName = "boolean";
    } else if (cls === $rt_bytecls()) {
        clsName = "byte";
    } else if (cls === $rt_shortcls()) {
        clsName = "short";
    } else if (cls === $rt_charcls()) {
        clsName = "char";
    } else if (cls === $rt_intcls()) {
        clsName = "int";
    } else if (cls === $rt_longcls()) {
        clsName = "long";
    } else if (cls === $rt_floatcls()) {
        clsName = "float";
    } else if (cls === $rt_doublecls()) {
        clsName = "double";
    } else {
        clsName = cls.$meta ? cls.$meta.name : "@" + cls.name;
    }
    while (arrayDegree-- > 0) {
        clsName += "[]";
    }
    return clsName;
}

function Long(lo, hi) {
    this.lo = lo | 0;
    this.hi = hi | 0;
}
Long.prototype.toString = function() {
    var result = [];
    var n = this;
    var positive = Long_isPositive(n);
    if (!positive) {
        n = Long_neg(n);
    }
    var radix = new Long(10, 0);
    do {
        var divRem = Long_divRem(n, radix);
        result.push(String.fromCharCode(48 + divRem[1].lo));
        n = divRem[0];
    } while (n.lo != 0 || n.hi != 0);
    result = result.reverse().join('');
    return positive ? result : "-" + result;
};
var Long_ZERO = new Long(0, 0);
var Long_MAX_NORMAL = 1 << 18;
function Long_fromInt(val) {
    return val >= 0 ? new Long(val, 0) : new Long(val, -1);
}
function Long_fromNumber(val) {
    if (val >= 0) {
        return new Long(val | 0, (val / 0x100000000) | 0);
    } else {
        return Long_neg(new Long(-val | 0, (-val / 0x100000000) | 0));
    }
}
function Long_toNumber(val) {
    var lo = val.lo;
    var hi = val.hi;
    if (lo < 0) {
        lo += 0x100000000;
    }
    return 0x100000000 * hi + lo;
}
function Long_eq(a, b) {
    return a.hi === b.hi && a.lo === b.lo;
}
function Long_ne(a, b) {
    return a.hi !== b.hi || a.lo !== b.lo;
}
function Long_gt(a, b) {
    if (a.hi < b.hi) {
        return false;
    }
    if (a.hi > b.hi) {
        return true;
    }
    var x = a.lo >>> 1;
    var y = b.lo >>> 1;
    if (x != y) {
        return x > y;
    }
    return (a.lo & 1) > (b.lo & 1);
}
function Long_ge(a, b) {
    if (a.hi < b.hi) {
        return false;
    }
    if (a.hi > b.hi) {
        return true;
    }
    var x = a.lo >>> 1;
    var y = b.lo >>> 1;
    if (x != y) {
        return x >= y;
    }
    return (a.lo & 1) >= (b.lo & 1);
}
function Long_lt(a, b) {
    if (a.hi > b.hi) {
        return false;
    }
    if (a.hi < b.hi) {
        return true;
    }
    var x = a.lo >>> 1;
    var y = b.lo >>> 1;
    if (x != y) {
        return x < y;
    }
    return (a.lo & 1) < (b.lo & 1);
}
function Long_le(a, b) {
    if (a.hi > b.hi) {
        return false;
    }
    if (a.hi < b.hi) {
        return true;
    }
    var x = a.lo >>> 1;
    var y = b.lo >>> 1;
    if (x != y) {
        return x <= y;
    }
    return (a.lo & 1) <= (b.lo & 1);
}

function Long_add(a, b) {
    if (a.hi === (a.lo >> 31) && b.hi === (b.lo >> 31)) {
        return Long_fromNumber(a.lo + b.lo);
    } else if (Math.abs(a.hi) < Long_MAX_NORMAL && Math.abs(b.hi) < Long_MAX_NORMAL) {
        return Long_fromNumber(Long_toNumber(a) + Long_toNumber(b));
    }
    var a_lolo = a.lo & 0xFFFF;
    var a_lohi = a.lo >>> 16;
    var a_hilo = a.hi & 0xFFFF;
    var a_hihi = a.hi >>> 16;
    var b_lolo = b.lo & 0xFFFF;
    var b_lohi = b.lo >>> 16;
    var b_hilo = b.hi & 0xFFFF;
    var b_hihi = b.hi >>> 16;

    var lolo = (a_lolo + b_lolo) | 0;
    var lohi = (a_lohi + b_lohi + (lolo >> 16)) | 0;
    var hilo = (a_hilo + b_hilo + (lohi >> 16)) | 0;
    var hihi = (a_hihi + b_hihi + (hilo >> 16)) | 0;
    return new Long((lolo & 0xFFFF) | ((lohi & 0xFFFF) << 16), (hilo & 0xFFFF) | ((hihi & 0xFFFF) << 16));
}
function Long_inc(a) {
    var lo = (a.lo + 1) | 0;
    var hi = a.hi;
    if (lo === 0) {
        hi = (hi + 1) | 0;
    }
    return new Long(lo, hi);
}
function Long_dec(a) {
    var lo = (a.lo - 1) | 0;
    var hi = a.hi;
    if (lo === -1) {
        hi = (hi - 1) | 0;
    }
    return new Long(lo, hi);
}
function Long_neg(a) {
    return Long_inc(new Long(a.lo ^ 0xFFFFFFFF, a.hi ^ 0xFFFFFFFF));
}
function Long_sub(a, b) {
    if (a.hi === (a.lo >> 31) && b.hi === (b.lo >> 31)) {
        return Long_fromNumber(a.lo - b.lo);
    }
    var a_lolo = a.lo & 0xFFFF;
    var a_lohi = a.lo >>> 16;
    var a_hilo = a.hi & 0xFFFF;
    var a_hihi = a.hi >>> 16;
    var b_lolo = b.lo & 0xFFFF;
    var b_lohi = b.lo >>> 16;
    var b_hilo = b.hi & 0xFFFF;
    var b_hihi = b.hi >>> 16;

    var lolo = (a_lolo - b_lolo) | 0;
    var lohi = (a_lohi - b_lohi + (lolo >> 16)) | 0;
    var hilo = (a_hilo - b_hilo + (lohi >> 16)) | 0;
    var hihi = (a_hihi - b_hihi + (hilo >> 16)) | 0;
    return new Long((lolo & 0xFFFF) | ((lohi & 0xFFFF) << 16), (hilo & 0xFFFF) | ((hihi & 0xFFFF) << 16));
}
function Long_compare(a, b) {
    var r = a.hi - b.hi;
    if (r !== 0) {
        return r;
    }
    r = (a.lo >>> 1) - (b.lo >>> 1);
    if (r !== 0) {
        return r;
    }
    return (a.lo & 1) - (b.lo & 1);
}
function Long_isPositive(a) {
    return (a.hi & 0x80000000) === 0;
}
function Long_isNegative(a) {
    return (a.hi & 0x80000000) !== 0;
}
function Long_mul(a, b) {
    var positive = Long_isNegative(a) === Long_isNegative(b);
    if (Long_isNegative(a)) {
        a = Long_neg(a);
    }
    if (Long_isNegative(b)) {
        b = Long_neg(b);
    }
    var a_lolo = a.lo & 0xFFFF;
    var a_lohi = a.lo >>> 16;
    var a_hilo = a.hi & 0xFFFF;
    var a_hihi = a.hi >>> 16;
    var b_lolo = b.lo & 0xFFFF;
    var b_lohi = b.lo >>> 16;
    var b_hilo = b.hi & 0xFFFF;
    var b_hihi = b.hi >>> 16;

    var lolo = 0;
    var lohi = 0;
    var hilo = 0;
    var hihi = 0;
    lolo = (a_lolo * b_lolo) | 0;
    lohi = lolo >>> 16;
    lohi = ((lohi & 0xFFFF) + a_lohi * b_lolo) | 0;
    hilo = (hilo + (lohi >>> 16)) | 0;
    lohi = ((lohi & 0xFFFF) + a_lolo * b_lohi) | 0;
    hilo = (hilo + (lohi >>> 16)) | 0;
    hihi = hilo >>> 16;
    hilo = ((hilo & 0xFFFF) + a_hilo * b_lolo) | 0;
    hihi = (hihi + (hilo >>> 16)) | 0;
    hilo = ((hilo & 0xFFFF) + a_lohi * b_lohi) | 0;
    hihi = (hihi + (hilo >>> 16)) | 0;
    hilo = ((hilo & 0xFFFF) + a_lolo * b_hilo) | 0;
    hihi = (hihi + (hilo >>> 16)) | 0;
    hihi = (hihi + a_hihi * b_lolo + a_hilo * b_lohi + a_lohi * b_hilo + a_lolo * b_hihi) | 0;
    var result = new Long((lolo & 0xFFFF) | (lohi << 16), (hilo & 0xFFFF) | (hihi << 16));
    return positive ? result : Long_neg(result);
}
function Long_div(a, b) {
    if (Math.abs(a.hi) < Long_MAX_NORMAL && Math.abs(b.hi) < Long_MAX_NORMAL) {
        return Long_fromNumber(Long_toNumber(a) / Long_toNumber(b));
    }
    return Long_divRem(a, b)[0];
}
function Long_rem(a, b) {
    if (Math.abs(a.hi) < Long_MAX_NORMAL && Math.abs(b.hi) < Long_MAX_NORMAL) {
        return Long_fromNumber(Long_toNumber(a) % Long_toNumber(b));
    }
    return Long_divRem(a, b)[1];
}
function Long_divRem(a, b) {
    if (b.lo == 0 && b.hi == 0) {
        throw new Error("Division by zero");
    }
    var positive = Long_isNegative(a) === Long_isNegative(b);
    if (Long_isNegative(a)) {
        a = Long_neg(a);
    }
    if (Long_isNegative(b)) {
        b = Long_neg(b);
    }
    a = new LongInt(a.lo, a.hi, 0);
    b = new LongInt(b.lo, b.hi, 0);
    var q = LongInt_div(a, b);
    a = new Long(a.lo, a.hi);
    q = new Long(q.lo, q.hi);
    return positive ? [q, a] : [Long_neg(q), Long_neg(a)];
}
function Long_shiftLeft16(a) {
    return new Long(a.lo << 16, (a.lo >>> 16) | (a.hi << 16));
}
function Long_shiftRight16(a) {
    return new Long((a.lo >>> 16) | (a.hi << 16), a.hi >>> 16);
}
function Long_and(a, b) {
    return new Long(a.lo & b.lo, a.hi & b.hi);
}
function Long_or(a, b) {
    return new Long(a.lo | b.lo, a.hi | b.hi);
}
function Long_xor(a, b) {
    return new Long(a.lo ^ b.lo, a.hi ^ b.hi);
}
function Long_shl(a, b) {
    b &= 63;
    if (b == 0) {
        return a;
    } else if (b < 32) {
        return new Long(a.lo << b, (a.lo >>> (32 - b)) | (a.hi << b));
    } else if (b == 32) {
        return new Long(0, a.lo);
    } else {
        return new Long(0, a.lo << (b - 32));
    }
}
function Long_shr(a, b) {
    b &= 63;
    if (b == 0) {
        return a;
    } else if (b < 32) {
        return new Long((a.lo >>> b) | (a.hi << (32 - b)), a.hi >> b);
    } else if (b == 32) {
        return new Long(a.hi, a.hi >> 31);
    } else {
        return new Long((a.hi >> (b - 32)), a.hi >> 31);
    }
}
function Long_shru(a, b) {
    b &= 63;
    if (b == 0) {
        return a;
    } else if (b < 32) {
        return new Long((a.lo >>> b) | (a.hi << (32 - b)), a.hi >>> b);
    } else if (b == 32) {
        return new Long(a.hi, 0);
    } else {
        return new Long((a.hi >>> (b - 32)), 0);
    }
}

// Represents a mutable 80-bit unsigned integer
function LongInt(lo, hi, sup) {
    this.lo = lo;
    this.hi = hi;
    this.sup = sup;
}
function LongInt_mul(a, b) {
    var a_lolo = ((a.lo & 0xFFFF) * b) | 0;
    var a_lohi = ((a.lo >>> 16) * b) | 0;
    var a_hilo = ((a.hi & 0xFFFF) * b) | 0;
    var a_hihi = ((a.hi >>> 16) * b) | 0;
    var sup = (a.sup * b) | 0;

    a_lohi = (a_lohi + (a_lolo >>> 16)) | 0;
    a_hilo = (a_hilo + (a_lohi >>> 16)) | 0;
    a_hihi = (a_hihi + (a_hilo >>> 16)) | 0;
    sup = (sup + (a_hihi >>> 16)) | 0;
    a.lo = (a_lolo & 0xFFFF) | (a_lohi << 16);
    a.hi = (a_hilo & 0xFFFF) | (a_hihi << 16);
    a.sup = sup & 0xFFFF;
}
function LongInt_sub(a, b) {
    var a_lolo = a.lo & 0xFFFF;
    var a_lohi = a.lo >>> 16;
    var a_hilo = a.hi & 0xFFFF;
    var a_hihi = a.hi >>> 16;
    var b_lolo = b.lo & 0xFFFF;
    var b_lohi = b.lo >>> 16;
    var b_hilo = b.hi & 0xFFFF;
    var b_hihi = b.hi >>> 16;

    a_lolo = (a_lolo - b_lolo) | 0;
    a_lohi = (a_lohi - b_lohi + (a_lolo >> 16)) | 0;
    a_hilo = (a_hilo - b_hilo + (a_lohi >> 16)) | 0;
    a_hihi = (a_hihi - b_hihi + (a_hilo >> 16)) | 0;
    var sup = (a.sup - b.sup + (a_hihi >> 16)) | 0;
    a.lo = (a_lolo & 0xFFFF) | (a_lohi << 16);
    a.hi = (a_hilo & 0xFFFF) | (a_hihi << 16);
    a.sup = sup;
}
function LongInt_add(a, b) {
    var a_lolo = a.lo & 0xFFFF;
    var a_lohi = a.lo >>> 16;
    var a_hilo = a.hi & 0xFFFF;
    var a_hihi = a.hi >>> 16;
    var b_lolo = b.lo & 0xFFFF;
    var b_lohi = b.lo >>> 16;
    var b_hilo = b.hi & 0xFFFF;
    var b_hihi = b.hi >>> 16;

    a_lolo = (a_lolo + b_lolo) | 0;
    a_lohi = (a_lohi + b_lohi + (a_lolo >> 16)) | 0;
    a_hilo = (a_hilo + b_hilo + (a_lohi >> 16)) | 0;
    a_hihi = (a_hihi + b_hihi + (a_hilo >> 16)) | 0;
    var sup = (a.sup + b.sup + (a_hihi >> 16)) | 0;
    a.lo = (a_lolo & 0xFFFF) | (a_lohi << 16);
    a.hi = (a_hilo & 0xFFFF) | (a_hihi << 16);
    a.sup = sup;
}
function LongInt_inc(a) {
    a.lo = (a.lo + 1) | 0;
    if (a.lo == 0) {
        a.hi = (a.hi + 1) | 0;
        if (a.hi == 0) {
            a.sup = (a.sup + 1) & 0xFFFF;
        }
    }
}
function LongInt_dec(a) {
    a.lo = (a.lo - 1) | 0;
    if (a.lo == -1) {
        a.hi = (a.hi - 1) | 0;
        if (a.hi == -1) {
            a.sup = (a.sup - 1) & 0xFFFF;
        }
    }
}
function LongInt_ucompare(a, b) {
    var r = (a.sup - b.sup);
    if (r != 0) {
        return r;
    }
    r = (a.hi >>> 1) - (b.hi >>> 1);
    if (r != 0) {
        return r;
    }
    r = (a.hi & 1) - (b.hi & 1);
    if (r != 0) {
        return r;
    }
    r = (a.lo >>> 1) - (b.lo >>> 1);
    if (r != 0) {
        return r;
    }
    return (a.lo & 1) - (b.lo & 1);
}
function LongInt_numOfLeadingZeroBits(a) {
    var n = 0;
    var d = 16;
    while (d > 0) {
        if ((a >>> d) !== 0) {
            a >>>= d;
            n = (n + d) | 0;
        }
        d = (d / 2) | 0;
    }
    return 31 - n;
}
function LongInt_shl(a, b) {
    if (b == 0) {
        return;
    }
    if (b < 32) {
        a.sup = ((a.hi >>> (32 - b)) | (a.sup << b)) & 0xFFFF;
        a.hi = (a.lo >>> (32 - b)) | (a.hi << b);
        a.lo <<= b;
    } else if (b == 32) {
        a.sup = a.hi & 0xFFFF;
        a.hi = a.lo;
        a.lo = 0;
    } else if (b < 64) {
        a.sup = ((a.lo >>> (64 - b)) | (a.hi << (b - 32))) & 0xFFFF;
        a.hi = a.lo << b;
        a.lo = 0;
    } else if (b == 64) {
        a.sup = a.lo & 0xFFFF;
        a.hi = 0;
        a.lo = 0;
    } else {
        a.sup = (a.lo << (b - 64)) & 0xFFFF;
        a.hi = 0;
        a.lo = 0;
    }
}
function LongInt_shr(a, b) {
    if (b == 0) {
        return;
    }
    if (b == 32) {
        a.lo = a.hi;
        a.hi = a.sup;
        a.sup = 0;
    } else if (b < 32) {
        a.lo = (a.lo >>> b) | (a.hi << (32 - b));
        a.hi = (a.hi >>> b) | (a.sup << (32 - b));
        a.sup >>>= b;
    } else if (b == 64) {
        a.lo = a.sup;
        a.hi = 0;
        a.sup = 0;
    } else if (b < 64) {
        a.lo = (a.hi >>> (b - 32)) | (a.sup << (64 - b));
        a.hi = a.sup >>> (b - 32);
        a.sup = 0;
    } else {
        a.lo = a.sup >>> (b - 64);
        a.hi = 0;
        a.sup = 0;
    }
}
function LongInt_copy(a) {
    return new LongInt(a.lo, a.hi, a.sup);
}
function LongInt_div(a, b) {
    // Normalize divisor
    var bits = b.hi !== 0 ? LongInt_numOfLeadingZeroBits(b.hi) : LongInt_numOfLeadingZeroBits(b.lo) + 32;
    var sz = 1 + ((bits / 16) | 0);
    var dividentBits = bits % 16;
    LongInt_shl(b, bits);
    LongInt_shl(a, dividentBits);
    var q = new LongInt(0, 0, 0);
    while (sz-- > 0) {
        LongInt_shl(q, 16);
        // Calculate approximate q
        var digitA = (a.hi >>> 16) + (0x10000 * a.sup);
        var digitB = b.hi >>> 16;
        var digit = (digitA / digitB) | 0;
        var t = LongInt_copy(b);
        LongInt_mul(t, digit);
        // Adjust q either down or up
        if (LongInt_ucompare(t, a) >= 0) {
            while (LongInt_ucompare(t, a) > 0) {
                LongInt_sub(t, b);
                --digit;
            }
        } else {
            while (true) {
                var nextT = LongInt_copy(t);
                LongInt_add(nextT, b);
                if (LongInt_ucompare(nextT, a) > 0) {
                    break;
                }
                t = nextT;
                ++digit;
            }
        }
        LongInt_sub(a, t);
        q.lo |= digit;
        LongInt_shl(a, 16);
    }
    LongInt_shr(a, bits + 16);
    return q;
}
