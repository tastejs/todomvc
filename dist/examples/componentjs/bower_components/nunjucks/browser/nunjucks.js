// Browser bundle of nunjucks 1.0.0

(function() {
var modules = {};
(function() {

// A simple class system, more documentation to come

function extend(cls, name, props) {
    // This does that same thing as Object.create, but with support for IE8
    var F = function() {};
    F.prototype = cls.prototype;
    var prototype = new F();

    var fnTest = /xyz/.test(function(){ xyz; }) ? /\bparent\b/ : /.*/;
    props = props || {};

    for(var k in props) {
        var src = props[k];
        var parent = prototype[k];

        if(typeof parent == "function" &&
           typeof src == "function" &&
           fnTest.test(src)) {
            prototype[k] = (function (src, parent) {
                return function() {
                    // Save the current parent method
                    var tmp = this.parent;

                    // Set parent to the previous method, call, and restore
                    this.parent = parent;
                    var res = src.apply(this, arguments);
                    this.parent = tmp;

                    return res;
                };
            })(src, parent);
        }
        else {
            prototype[k] = src;
        }
    }

    prototype.typename = name;

    var new_cls = function() {
        if(prototype.init) {
            prototype.init.apply(this, arguments);
        }
    };

    new_cls.prototype = prototype;
    new_cls.prototype.constructor = new_cls;

    new_cls.extend = function(name, props) {
        if(typeof name == "object") {
            props = name;
            name = "anonymous";
        }
        return extend(new_cls, name, props);
    };

    return new_cls;
}

modules['object'] = extend(Object, "Object", {});
})();
(function() {
var ArrayProto = Array.prototype;
var ObjProto = Object.prototype;

var escapeMap = {
    '&': '&amp;',
    '"': '&quot;',
    "'": '&#39;',
    "<": '&lt;',
    ">": '&gt;'
};

var lookupEscape = function(ch) {
    return escapeMap[ch];
};

var exports = modules['lib'] = {};

exports.withPrettyErrors = function(path, withInternals, func) {
    try {
        return func();
    } catch (e) {
        if (!e.Update) {
            // not one of ours, cast it
            e = new exports.TemplateError(e);
        }
        e.Update(path);

        // Unless they marked the dev flag, show them a trace from here
        if (!withInternals) {
            var old = e;
            e = new Error(old.message);
            e.name = old.name;
        }

        throw e;
    }
};

exports.TemplateError = function(message, lineno, colno) {
    var err = this;

    if (message instanceof Error) { // for casting regular js errors
        err = message;
        message = message.name + ": " + message.message;
    } else {
        if(Error.captureStackTrace) {
            Error.captureStackTrace(err);
        }
    }

    err.name = 'Template render error';
    err.message = message;
    err.lineno = lineno;
    err.colno = colno;
    err.firstUpdate = true;

    err.Update = function(path) {
        var message = "(" + (path || "unknown path") + ")";

        // only show lineno + colno next to path of template
        // where error occurred
        if (this.firstUpdate) {
            if(this.lineno && this.colno) {
                message += ' [Line ' + this.lineno + ', Column ' + this.colno + ']';
            }
            else if(this.lineno) {
                message += ' [Line ' + this.lineno + ']';
            }
        }

        message += '\n ';
        if (this.firstUpdate) {
            message += ' ';
        }

        this.message = message + (this.message || '');
        this.firstUpdate = false;
        return this;
    };

    return err;
};

exports.TemplateError.prototype = Error.prototype;

exports.escape = function(val) {
    return val.replace(/[&"'<>]/g, lookupEscape);
};

exports.isFunction = function(obj) {
    return ObjProto.toString.call(obj) == '[object Function]';
};

exports.isArray = Array.isArray || function(obj) {
    return ObjProto.toString.call(obj) == '[object Array]';
};

exports.isString = function(obj) {
    return ObjProto.toString.call(obj) == '[object String]';
};

exports.isObject = function(obj) {
    return obj === Object(obj);
};

exports.groupBy = function(obj, val) {
    var result = {};
    var iterator = exports.isFunction(val) ? val : function(obj) { return obj[val]; };
    for(var i=0; i<obj.length; i++) {
        var value = obj[i];
        var key = iterator(value, i);
        (result[key] || (result[key] = [])).push(value);
    }
    return result;
};

exports.toArray = function(obj) {
    return Array.prototype.slice.call(obj);
};

exports.without = function(array) {
    var result = [];
    if (!array) {
        return result;
    }
    var index = -1,
    length = array.length,
    contains = exports.toArray(arguments).slice(1);

    while(++index < length) {
        if(contains.indexOf(array[index]) === -1) {
            result.push(array[index]);
        }
    }
    return result;
};

exports.extend = function(obj, obj2) {
    for(var k in obj2) {
        obj[k] = obj2[k];
    }
    return obj;
};

exports.repeat = function(char_, n) {
    var str = '';
    for(var i=0; i<n; i++) {
        str += char_;
    }
    return str;
};

exports.each = function(obj, func, context) {
    if(obj == null) {
        return;
    }

    if(ArrayProto.each && obj.each == ArrayProto.each) {
        obj.forEach(func, context);
    }
    else if(obj.length === +obj.length) {
        for(var i=0, l=obj.length; i<l; i++) {
            func.call(context, obj[i], i, obj);
        }
    }
};

exports.map = function(obj, func) {
    var results = [];
    if(obj == null) {
        return results;
    }

    if(ArrayProto.map && obj.map === ArrayProto.map) {
        return obj.map(func);
    }

    for(var i=0; i<obj.length; i++) {
        results[results.length] = func(obj[i], i);
    }

    if(obj.length === +obj.length) {
        results.length = obj.length;
    }

    return results;
};

exports.asyncParallel = function(funcs, done) {
    var count = funcs.length,
        result = new Array(count),
        current = 0;

    var makeNext = function(i) {
        return function(res) {
            result[i] = res;
            current += 1;

            if (current === count) {
                done(result);
            }
        };
    };

    for (var i = 0; i < count; i++) {
        funcs[i](makeNext(i));
    }
};

exports.asyncIter = function(arr, iter, cb) {
    var i = -1;

    function next() {
        i++;

        if(i < arr.length) {
            iter(arr[i], i, next, cb);
        }
        else {
            cb();
        }
    }

    next();
};

exports.asyncFor = function(obj, iter, cb) {
    var keys = exports.keys(obj);
    var len = keys.length;
    var i = -1;

    function next() {
        i++;
        var k = keys[i];

        if(i < len) {
            iter(k, obj[k], i, len, next);
        }
        else {
            cb();
        }
    }

    next();
};

if(!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(array, searchElement /*, fromIndex */) {
        if (array == null) {
            throw new TypeError();
        }
        var t = Object(array);
        var len = t.length >>> 0;
        if (len === 0) {
            return -1;
        }
        var n = 0;
        if (arguments.length > 2) {
            n = Number(arguments[2]);
            if (n != n) { // shortcut for verifying if it's NaN
                n = 0;
            } else if (n != 0 && n != Infinity && n != -Infinity) {
                n = (n > 0 || -1) * Math.floor(Math.abs(n));
            }
        }
        if (n >= len) {
            return -1;
        }
        var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
        for (; k < len; k++) {
            if (k in t && t[k] === searchElement) {
                return k;
            }
        }
        return -1;
    };
}

if(!Array.prototype.map) {
    Array.prototype.map = function() {
        throw new Error("map is unimplemented for this js engine");
    };
}

exports.keys = function(obj) {
    if(Object.prototype.keys) {
        return obj.keys();
    }
    else {
        var keys = [];
        for(var k in obj) {
            if(obj.hasOwnProperty(k)) {
                keys.push(k);
            }
        }
        return keys;
    }
}
})();
(function() {
var util = modules["util"];
var lib = modules["lib"];
var Object = modules["object"];

function traverseAndCheck(obj, type, results) {
    if(obj instanceof type) {
        results.push(obj);
    }

    if(obj instanceof Node) {
        obj.findAll(type, results);
    }
}

var Node = Object.extend("Node", {
    init: function(lineno, colno) {
        this.lineno = lineno;
        this.colno = colno;

        var fields = this.fields;
        for(var i=0, l=fields.length; i<l; i++) {
            var field = fields[i];

            // The first two args are line/col numbers, so offset by 2
            var val = arguments[i + 2];

            // Fields should never be undefined, but null. It makes
            // testing easier to normalize values.
            if(val === undefined) {
                val = null;
            }

            this[field] = val;
        }
    },

    findAll: function(type, results) {
        results = results || [];

        if(this instanceof NodeList) {
            var children = this.children;

            for(var i=0, l=children.length; i<l; i++) {
                traverseAndCheck(children[i], type, results);
            }
        }
        else {
            var fields = this.fields;

            for(var i=0, l=fields.length; i<l; i++) {
                traverseAndCheck(this[fields[i]], type, results);
            }
        }

        return results;
    },

    iterFields: function(func) {
        lib.each(this.fields, function(field) {
            func(this[field], field);
        }, this);
    }
});

// Abstract nodes
var Value = Node.extend("Value", { fields: ['value'] });

// Concrete nodes
var NodeList = Node.extend("NodeList", {
    fields: ['children'],

    init: function(lineno, colno, nodes) {
        this.parent(lineno, colno, nodes || []);
    },

    addChild: function(node) {
        this.children.push(node);
    }
});

var Root = NodeList.extend("Root");
var Literal = Value.extend("Literal");
var Symbol = Value.extend("Symbol");
var Group = NodeList.extend("Group");
var Array = NodeList.extend("Array");
var Pair = Node.extend("Pair", { fields: ['key', 'value'] });
var Dict = NodeList.extend("Dict");
var LookupVal = Node.extend("LookupVal", { fields: ['target', 'val'] });
var If = Node.extend("If", { fields: ['cond', 'body', 'else_'] });
var IfAsync = If.extend("IfAsync");
var InlineIf = Node.extend("InlineIf", { fields: ['cond', 'body', 'else_'] });
var For = Node.extend("For", { fields: ['arr', 'name', 'body'] });
var AsyncEach = For.extend("AsyncEach");
var AsyncAll = For.extend("AsyncAll");
var Macro = Node.extend("Macro", { fields: ['name', 'args', 'body'] });
var Import = Node.extend("Import", { fields: ['template', 'target'] });
var FromImport = Node.extend("FromImport", {
    fields: ['template', 'names'],

    init: function(lineno, colno, template, names) {
        this.parent(lineno, colno,
                    template,
                    names || new NodeList());
    }
});
var FunCall = Node.extend("FunCall", { fields: ['name', 'args'] });
var Filter = FunCall.extend("Filter");
var FilterAsync = Filter.extend("FilterAsync", {
    fields: ['name', 'args', 'symbol']
});
var KeywordArgs = Dict.extend("KeywordArgs");
var Block = Node.extend("Block", { fields: ['name', 'body'] });
var Super = Node.extend("Super", { fields: ['blockName', 'symbol'] });
var TemplateRef = Node.extend("TemplateRef", { fields: ['template'] });
var Extends = TemplateRef.extend("Extends");
var Include = TemplateRef.extend("Include");
var Set = Node.extend("Set", { fields: ['targets', 'value'] });
var Output = NodeList.extend("Output");
var TemplateData = Literal.extend("TemplateData");
var UnaryOp = Node.extend("UnaryOp", { fields: ['target'] });
var BinOp = Node.extend("BinOp", { fields: ['left', 'right'] });
var Or = BinOp.extend("Or");
var And = BinOp.extend("And");
var Not = UnaryOp.extend("Not");
var Add = BinOp.extend("Add");
var Sub = BinOp.extend("Sub");
var Mul = BinOp.extend("Mul");
var Div = BinOp.extend("Div");
var FloorDiv = BinOp.extend("FloorDiv");
var Mod = BinOp.extend("Mod");
var Pow = BinOp.extend("Pow");
var Neg = UnaryOp.extend("Neg");
var Pos = UnaryOp.extend("Pos");
var Compare = Node.extend("Compare", { fields: ['expr', 'ops'] });
var CompareOperand = Node.extend("CompareOperand", {
    fields: ['expr', 'type']
});

var CustomTag = Node.extend("CustomTag", {
    init: function(lineno, colno, name) {
        this.lineno = lineno;
        this.colno = colno;
        this.name = name;
    }
});

var CallExtension = Node.extend("CallExtension", {
    fields: ['extName', 'prop', 'args', 'contentArgs'],

    init: function(ext, prop, args, contentArgs) {
        this.extName = ext._name || ext;
        this.prop = prop;
        this.args = args || new NodeList();
        this.contentArgs = contentArgs || [];
    }
});

var CallExtensionAsync = CallExtension.extend("CallExtensionAsync");

// Print the AST in a nicely formatted tree format for debuggin
function printNodes(node, indent) {
    indent = indent || 0;

    // This is hacky, but this is just a debugging function anyway
    function print(str, indent, inline) {
        var lines = str.split("\n");

        for(var i=0; i<lines.length; i++) {
            if(lines[i]) {
                if((inline && i > 0) || !inline) {
                    for(var j=0; j<indent; j++) {
                        util.print(" ");
                    }
                }
            }

            if(i === lines.length-1) {
                util.print(lines[i]);
            }
            else {
                util.puts(lines[i]);
            }
        }
    }

    print(node.typename + ": ", indent);

    if(node instanceof NodeList) {
        print('\n');
        lib.each(node.children, function(n) {
            printNodes(n, indent + 2);
        });
    }
    else if(node instanceof CallExtension) {
        print(node.extName + '.' + node.prop);
        print('\n');

        if(node.args) {
            printNodes(node.args, indent + 2);
        }

        if(node.contentArgs) {
            lib.each(node.contentArgs, function(n) {
                printNodes(n, indent + 2);
            });
        }
    }
    else {
        var nodes = null;
        var props = null;

        node.iterFields(function(val, field) {
            if(val instanceof Node) {
                nodes = nodes || {};
                nodes[field] = val;
            }
            else {
                props = props || {};
                props[field] = val;
            }
        });

        if(props) {
            print(util.inspect(props, true, null) + '\n', null, true);
        }
        else {
            print('\n');
        }

        if(nodes) {
            for(var k in nodes) {
                printNodes(nodes[k], indent + 2);
            }
        }

    }
}

// var t = new NodeList(0, 0,
//                      [new Value(0, 0, 3),
//                       new Value(0, 0, 10),
//                       new Pair(0, 0,
//                                new Value(0, 0, 'key'),
//                                new Value(0, 0, 'value'))]);
// printNodes(t);

modules['nodes'] = {
    Node: Node,
    Root: Root,
    NodeList: NodeList,
    Value: Value,
    Literal: Literal,
    Symbol: Symbol,
    Group: Group,
    Array: Array,
    Pair: Pair,
    Dict: Dict,
    Output: Output,
    TemplateData: TemplateData,
    If: If,
    IfAsync: IfAsync,
    InlineIf: InlineIf,
    For: For,
    AsyncEach: AsyncEach,
    AsyncAll: AsyncAll,
    Macro: Macro,
    Import: Import,
    FromImport: FromImport,
    FunCall: FunCall,
    Filter: Filter,
    FilterAsync: FilterAsync,
    KeywordArgs: KeywordArgs,
    Block: Block,
    Super: Super,
    Extends: Extends,
    Include: Include,
    Set: Set,
    LookupVal: LookupVal,
    BinOp: BinOp,
    Or: Or,
    And: And,
    Not: Not,
    Add: Add,
    Sub: Sub,
    Mul: Mul,
    Div: Div,
    FloorDiv: FloorDiv,
    Mod: Mod,
    Pow: Pow,
    Neg: Neg,
    Pos: Pos,
    Compare: Compare,
    CompareOperand: CompareOperand,

    CallExtension: CallExtension,
    CallExtensionAsync: CallExtensionAsync,

    printNodes: printNodes
};
})();
(function() {

var lib = modules["lib"];
var Object = modules["object"];

// Frames keep track of scoping both at compile-time and run-time so
// we know how to access variables. Block tags can introduce special
// variables, for example.
var Frame = Object.extend({
    init: function(parent) {
        this.variables = {};
        this.parent = parent;
    },

    set: function(name, val) {
        // Allow variables with dots by automatically creating the
        // nested structure
        var parts = name.split('.');
        var obj = this.variables;

        for(var i=0; i<parts.length - 1; i++) {
            var id = parts[i];

            if(!obj[id]) {
                obj[id] = {};
            }
            obj = obj[id];
        }

        obj[parts[parts.length - 1]] = val;
    },

    get: function(name) {
        var val = this.variables[name];
        if(val !== undefined && val !== null) {
            return val;
        }
        return null;
    },

    lookup: function(name) {
        var p = this.parent;
        var val = this.variables[name];
        if(val !== undefined && val !== null) {
            return val;
        }
        return p && p.lookup(name);
    },

    push: function() {
        return new Frame(this);
    },

    pop: function() {
        return this.parent;
    }
});

function makeMacro(argNames, kwargNames, func) {
    return function() {
        var argCount = numArgs(arguments);
        var args;
        var kwargs = getKeywordArgs(arguments);

        if(argCount > argNames.length) {
            args = Array.prototype.slice.call(arguments, 0, argNames.length);

            // Positional arguments that should be passed in as
            // keyword arguments (essentially default values)
            var vals = Array.prototype.slice.call(arguments, args.length, argCount);
            for(var i=0; i<vals.length; i++) {
                if(i < kwargNames.length) {
                    kwargs[kwargNames[i]] = vals[i];
                }
            }

            args.push(kwargs);
        }
        else if(argCount < argNames.length) {
            args = Array.prototype.slice.call(arguments, 0, argCount);

            for(var i=argCount; i<argNames.length; i++) {
                var arg = argNames[i];

                // Keyword arguments that should be passed as
                // positional arguments, i.e. the caller explicitly
                // used the name of a positional arg
                args.push(kwargs[arg]);
                delete kwargs[arg];
            }

            args.push(kwargs);
        }
        else {
            args = arguments;
        }

        return func.apply(this, args);
    };
}

function makeKeywordArgs(obj) {
    obj.__keywords = true;
    return obj;
}

function getKeywordArgs(args) {
    var len = args.length;
    if(len) {
        var lastArg = args[len - 1];
        if(lastArg && lastArg.hasOwnProperty('__keywords')) {
            return lastArg;
        }
    }
    return {};
}

function numArgs(args) {
    var len = args.length;
    if(len === 0) {
        return 0;
    }

    var lastArg = args[len - 1];
    if(lastArg && lastArg.hasOwnProperty('__keywords')) {
        return len - 1;
    }
    else {
        return len;
    }
}

// A SafeString object indicates that the string should not be
// autoescaped. This happens magically because autoescaping only
// occurs on primitive string objects.
function SafeString(val) {
    if(typeof val != 'string') {
        return val;
    }

    this.toString = function() {
        return val;
    };

    this.length = val.length;

    var methods = [
        'charAt', 'charCodeAt', 'concat', 'contains',
        'endsWith', 'fromCharCode', 'indexOf', 'lastIndexOf',
        'length', 'localeCompare', 'match', 'quote', 'replace',
        'search', 'slice', 'split', 'startsWith', 'substr',
        'substring', 'toLocaleLowerCase', 'toLocaleUpperCase',
        'toLowerCase', 'toUpperCase', 'trim', 'trimLeft', 'trimRight'
    ];

    for(var i=0; i<methods.length; i++) {
        this[methods[i]] = markSafe(val[methods[i]]);
    }
}

function copySafeness(dest, target) {
    if(dest instanceof SafeString) {
        return new SafeString(target);
    }
    return target.toString();
}

function markSafe(val) {
    var type = typeof val;

    if(type === 'string') {
        return new SafeString(val);
    }
    else if(type !== 'function') {
        return val;
    }
    else {
        return function() {
            var ret = val.apply(this, arguments);

            if(typeof ret === 'string') {
                return new SafeString(ret);
            }

            return ret;
        };
    }
}

function suppressValue(val, autoescape) {
    val = (val !== undefined && val !== null) ? val : "";

    if(autoescape && typeof val === "string") {
        val = lib.escape(val);
    }

    return val;
}

function memberLookup(obj, val) {
    obj = obj || {};

    if(typeof obj[val] === 'function') {
        return function() {
            return obj[val].apply(obj, arguments);
        };
    }

    return obj[val];
}

function callWrap(obj, name, args) {
    if(!obj) {
        throw new Error('Unable to call `' + name + '`, which is undefined or falsey');
    }
    else if(typeof obj !== 'function') {
        throw new Error('Unable to call `' + name + '`, which is not a function');
    }

    return obj.apply(this, args);
}

function contextOrFrameLookup(context, frame, name) {
    var val = frame.lookup(name);
    return (val !== undefined && val !== null) ?
        val :
        context.lookup(name);
}

function handleError(error, lineno, colno) {
    if(error.lineno) {
        return error;
    }
    else {
        return new lib.TemplateError(error, lineno, colno);
    }
}

function asyncEach(arr, dimen, iter, cb) {
    if(lib.isArray(arr)) {
        var len = arr.length;

        lib.asyncIter(arr, function(item, i, next) {
            switch(dimen) {
            case 1: iter(item, i, len, next); break;
            case 2: iter(item[0], item[1], i, len, next); break;
            case 3: iter(item[0], item[1], item[2], i, len, next); break;
            default:
                item.push(i, next);
                iter.apply(this, item);
            }
        }, cb);
    }
    else {
        lib.asyncFor(arr, function(key, val, i, len, next) {
            iter(key, val, i, len, next);
        }, cb);
    }
}

function asyncAll(arr, dimen, func, cb) {
    var finished = 0;
    var len;
    var outputArr;

    function done(i, output) {
        finished++;
        outputArr[i] = output;

        if(finished == len) {
            cb(null, outputArr.join(''));
        }
    }

    if(lib.isArray(arr)) {
        len = arr.length;
        outputArr = new Array(len);

        if(len == 0) {
            cb(null, '');
        }
        else {
            for(var i=0; i<arr.length; i++) {
                var item = arr[i];

                switch(dimen) {
                case 1: func(item, i, len, done); break;
                case 2: func(item[0], item[1], i, len, done); break;
                case 3: func(item[0], item[1], item[2], i, len, done); break;
                default:
                    item.push(i, done);
                    func.apply(this, item);
                }
            }
        }
    }
    else {
        var keys = lib.keys(arr);
        len = keys.length;
        outputArr = new Array(len);

        if(len == 0) {
            cb(null, '');
        }
        else {
            for(var i=0; i<keys.length; i++) {
                var k = keys[i];
                func(k, arr[k], i, len, done);
            }
        }
    }
}

modules['runtime'] = {
    Frame: Frame,
    makeMacro: makeMacro,
    makeKeywordArgs: makeKeywordArgs,
    numArgs: numArgs,
    suppressValue: suppressValue,
    memberLookup: memberLookup,
    contextOrFrameLookup: contextOrFrameLookup,
    callWrap: callWrap,
    handleError: handleError,
    isArray: lib.isArray,
    asyncEach: lib.asyncEach,
    keys: lib.keys,
    SafeString: SafeString,
    copySafeness: copySafeness,
    markSafe: markSafe,
    asyncEach: asyncEach,
    asyncAll: asyncAll
};
})();
(function() {
var lib = modules["lib"];

var whitespaceChars = " \n\t\r";
var delimChars = "()[]{}%*-+/#,:|.<>=!";
var intChars = "0123456789";

var BLOCK_START = "{%";
var BLOCK_END = "%}";
var VARIABLE_START = "{{";
var VARIABLE_END = "}}";
var COMMENT_START = "{#";
var COMMENT_END = "#}";

var TOKEN_STRING = "string";
var TOKEN_WHITESPACE = "whitespace";
var TOKEN_DATA = "data";
var TOKEN_BLOCK_START = "block-start";
var TOKEN_BLOCK_END = "block-end";
var TOKEN_VARIABLE_START = "variable-start";
var TOKEN_VARIABLE_END = "variable-end";
var TOKEN_COMMENT = "comment";
var TOKEN_LEFT_PAREN = "left-paren";
var TOKEN_RIGHT_PAREN = "right-paren";
var TOKEN_LEFT_BRACKET = "left-bracket";
var TOKEN_RIGHT_BRACKET = "right-bracket";
var TOKEN_LEFT_CURLY = "left-curly";
var TOKEN_RIGHT_CURLY = "right-curly";
var TOKEN_OPERATOR = "operator";
var TOKEN_COMMA = "comma";
var TOKEN_COLON = "colon";
var TOKEN_PIPE = "pipe";
var TOKEN_INT = "int";
var TOKEN_FLOAT = "float";
var TOKEN_BOOLEAN = "boolean";
var TOKEN_SYMBOL = "symbol";
var TOKEN_SPECIAL = "special";

function token(type, value, lineno, colno) {
    return {
        type: type,
        value: value,
        lineno: lineno,
        colno: colno
    };
}

function Tokenizer(str) {
    this.str = str;
    this.index = 0;
    this.len = str.length;
    this.lineno = 0;
    this.colno = 0;

    this.in_code = false;
}

Tokenizer.prototype.nextToken = function() {
    var lineno = this.lineno;
    var colno = this.colno;

    if(this.in_code) {
        // Otherwise, if we are in a block parse it as code
        var cur = this.current();
        var tok;

        if(this.is_finished()) {
            // We have nothing else to parse
            return null;
        }
        else if(cur == "\"" || cur == "'") {
            // We've hit a string
            return token(TOKEN_STRING, this.parseString(cur), lineno, colno);
        }
        else if((tok = this._extract(whitespaceChars))) {
            // We hit some whitespace
            return token(TOKEN_WHITESPACE, tok, lineno, colno);
        }
        else if((tok = this._extractString(BLOCK_END)) ||
                (tok = this._extractString('-' + BLOCK_END))) {
            // Special check for the block end tag
            //
            // It is a requirement that start and end tags are composed of
            // delimiter characters (%{}[] etc), and our code always
            // breaks on delimiters so we can assume the token parsing
            // doesn't consume these elsewhere
            this.in_code = false;
            return token(TOKEN_BLOCK_END, tok, lineno, colno);
        }
        else if((tok = this._extractString(VARIABLE_END))) {
            // Special check for variable end tag (see above)
            this.in_code = false;
            return token(TOKEN_VARIABLE_END, tok, lineno, colno);
        }
        else if(delimChars.indexOf(cur) != -1) {
            // We've hit a delimiter (a special char like a bracket)
            this.forward();
            var complexOps = ['==', '!=', '<=', '>=', '//', '**'];
            var curComplex = cur + this.current();
            var type;

            if(complexOps.indexOf(curComplex) !== -1) {
                this.forward();
                cur = curComplex;
            }

            switch(cur) {
            case "(": type = TOKEN_LEFT_PAREN; break;
            case ")": type = TOKEN_RIGHT_PAREN; break;
            case "[": type = TOKEN_LEFT_BRACKET; break;
            case "]": type = TOKEN_RIGHT_BRACKET; break;
            case "{": type = TOKEN_LEFT_CURLY; break;
            case "}": type = TOKEN_RIGHT_CURLY; break;
            case ",": type = TOKEN_COMMA; break;
            case ":": type = TOKEN_COLON; break;
            case "|": type = TOKEN_PIPE; break;
            default: type = TOKEN_OPERATOR;
            }

            return token(type, cur, lineno, colno);
        }
        else {
            // We are not at whitespace or a delimiter, so extract the
            // text and parse it
            tok = this._extractUntil(whitespaceChars + delimChars);

            if(tok.match(/^[-+]?[0-9]+$/)) {
                if(this.current() == '.') {
                    this.forward();
                    var dec = this._extract(intChars);
                    return token(TOKEN_FLOAT, tok + '.' + dec, lineno, colno);
                }
                else {
                    return token(TOKEN_INT, tok, lineno, colno);
                }
            }
            else if(tok.match(/^(true|false)$/)) {
                return token(TOKEN_BOOLEAN, tok, lineno, colno);
            }
            else if(tok) {
                return token(TOKEN_SYMBOL, tok, lineno, colno);
            }
            else {
                throw new Error("Unexpected value while parsing: " + tok);
            }
        }
    }
    else {
        // Parse out the template text, breaking on tag
        // delimiters because we need to look for block/variable start
        // tags (don't use the full delimChars for optimization)
        var beginChars = (BLOCK_START.charAt(0) +
                          VARIABLE_START.charAt(0) +
                          COMMENT_START.charAt(0) +
                          COMMENT_END.charAt(0));
        var tok;

        if(this.is_finished()) {
            return null;
        }
        else if((tok = this._extractString(BLOCK_START + '-')) ||
                (tok = this._extractString(BLOCK_START))) {
            this.in_code = true;
            return token(TOKEN_BLOCK_START, tok, lineno, colno);
        }
        else if((tok = this._extractString(VARIABLE_START))) {
            this.in_code = true;
            return token(TOKEN_VARIABLE_START, tok, lineno, colno);
        }
        else {
            tok = '';
            var data;
            var in_comment = false;

            if(this._matches(COMMENT_START)) {
                in_comment = true;
                tok = this._extractString(COMMENT_START);
            }

            // Continually consume text, breaking on the tag delimiter
            // characters and checking to see if it's a start tag.
            //
            // We could hit the end of the template in the middle of
            // our looping, so check for the null return value from
            // _extractUntil
            while((data = this._extractUntil(beginChars)) !== null) {
                tok += data;

                if((this._matches(BLOCK_START) ||
                    this._matches(VARIABLE_START) ||
                    this._matches(COMMENT_START)) &&
                  !in_comment) {
                    // If it is a start tag, stop looping
                    break;
                }
                else if(this._matches(COMMENT_END)) {
                    if(!in_comment) {
                        throw new Error("unexpected end of comment");
                    }
                    tok += this._extractString(COMMENT_END);
                    break;
                }
                else {
                    // It does not match any tag, so add the character and
                    // carry on
                    tok += this.current();
                    this.forward();
                }
            }

            if(data === null && in_comment) {
                throw new Error("expected end of comment, got end of file");
            }

            return token(in_comment ? TOKEN_COMMENT : TOKEN_DATA,
                         tok,
                         lineno,
                         colno);
        }
    }

    throw new Error("Could not parse text");
};

Tokenizer.prototype.parseString = function(delimiter) {
    this.forward();

    var lineno = this.lineno;
    var colno = this.colno;
    var str = "";

    while(!this.is_finished() && this.current() != delimiter) {
        var cur = this.current();

        if(cur == "\\") {
            this.forward();
            switch(this.current()) {
            case "n": str += "\n"; break;
            case "t": str += "\t"; break;
            case "r": str += "\r"; break;
            default:
                str += this.current();
            }
            this.forward();
        }
        else {
            str += cur;
            this.forward();
        }
    }

    this.forward();
    return str;
};

Tokenizer.prototype._matches = function(str) {
    if(this.index + str.length > this.length) {
        return null;
    }

    var m = this.str.slice(this.index, this.index + str.length);
    return m == str;
};

Tokenizer.prototype._extractString = function(str) {
    if(this._matches(str)) {
        this.index += str.length;
        return str;
    }
    return null;
};

Tokenizer.prototype._extractUntil = function(charString) {
    // Extract all non-matching chars, with the default matching set
    // to everything
    return this._extractMatching(true, charString || "");
};

Tokenizer.prototype._extract = function(charString) {
    // Extract all matching chars (no default, so charString must be
    // explicit)
    return this._extractMatching(false, charString);
};

Tokenizer.prototype._extractMatching = function (breakOnMatch, charString) {
    // Pull out characters until a breaking char is hit.
    // If breakOnMatch is false, a non-matching char stops it.
    // If breakOnMatch is true, a matching char stops it.

    if(this.is_finished()) {
        return null;
    }

    var first = charString.indexOf(this.current());

    // Only proceed if the first character doesn't meet our condition
    if((breakOnMatch && first == -1) ||
       (!breakOnMatch && first != -1)) {
        var t = this.current();
        this.forward();

        // And pull out all the chars one at a time until we hit a
        // breaking char
        var idx = charString.indexOf(this.current());

        while(((breakOnMatch && idx == -1) ||
               (!breakOnMatch && idx != -1)) && !this.is_finished()) {
            t += this.current();
            this.forward();

            idx = charString.indexOf(this.current());
        }

        return t;
    }

    return "";
};

Tokenizer.prototype.is_finished = function() {
    return this.index >= this.len;
};

Tokenizer.prototype.forwardN = function(n) {
    for(var i=0; i<n; i++) {
        this.forward();
    }
};

Tokenizer.prototype.forward = function() {
    this.index++;

    if(this.previous() == "\n") {
        this.lineno++;
        this.colno = 0;
    }
    else {
        this.colno++;
    }
};

Tokenizer.prototype.backN = function(n) {
    for(var i=0; i<n; i++) {
        self.back();
    }
};

Tokenizer.prototype.back = function() {
    this.index--;

    if(this.current() == "\n") {
        this.lineno--;

        var idx = this.src.lastIndexOf("\n", this.index-1);
        if(idx == -1) {
            this.colno = this.index;
        }
        else {
            this.colno = this.index - idx;
        }
    }
    else {
        this.colno--;
    }
};

Tokenizer.prototype.current = function() {
    if(!this.is_finished()) {
        return this.str.charAt(this.index);
    }
    return "";
};

Tokenizer.prototype.previous = function() {
    return this.str.charAt(this.index-1);
};

modules['lexer'] = {
    lex: function(src) {
        return new Tokenizer(src);
    },

    setTags: function(tags) {
        BLOCK_START = tags.blockStart || BLOCK_START;
        BLOCK_END = tags.blockEnd || BLOCK_END;
        VARIABLE_START = tags.variableStart || VARIABLE_START;
        VARIABLE_END = tags.variableEnd || VARIABLE_END;
        COMMENT_START = tags.commentStart || COMMENT_START;
        COMMENT_END = tags.commentEnd || COMMENT_END;
    },

    TOKEN_STRING: TOKEN_STRING,
    TOKEN_WHITESPACE: TOKEN_WHITESPACE,
    TOKEN_DATA: TOKEN_DATA,
    TOKEN_BLOCK_START: TOKEN_BLOCK_START,
    TOKEN_BLOCK_END: TOKEN_BLOCK_END,
    TOKEN_VARIABLE_START: TOKEN_VARIABLE_START,
    TOKEN_VARIABLE_END: TOKEN_VARIABLE_END,
    TOKEN_COMMENT: TOKEN_COMMENT,
    TOKEN_LEFT_PAREN: TOKEN_LEFT_PAREN,
    TOKEN_RIGHT_PAREN: TOKEN_RIGHT_PAREN,
    TOKEN_LEFT_BRACKET: TOKEN_LEFT_BRACKET,
    TOKEN_RIGHT_BRACKET: TOKEN_RIGHT_BRACKET,
    TOKEN_LEFT_CURLY: TOKEN_LEFT_CURLY,
    TOKEN_RIGHT_CURLY: TOKEN_RIGHT_CURLY,
    TOKEN_OPERATOR: TOKEN_OPERATOR,
    TOKEN_COMMA: TOKEN_COMMA,
    TOKEN_COLON: TOKEN_COLON,
    TOKEN_PIPE: TOKEN_PIPE,
    TOKEN_INT: TOKEN_INT,
    TOKEN_FLOAT: TOKEN_FLOAT,
    TOKEN_BOOLEAN: TOKEN_BOOLEAN,
    TOKEN_SYMBOL: TOKEN_SYMBOL,
    TOKEN_SPECIAL: TOKEN_SPECIAL
};
})();
(function() {
var lexer = modules["lexer"];
var nodes = modules["nodes"];
var Object = modules["object"];
var lib = modules["lib"];

var Parser = Object.extend({
    init: function (tokens) {
        this.tokens = tokens;
        this.peeked = null;
        this.breakOnBlocks = null;
        this.dropLeadingWhitespace = false;

        this.extensions = [];
    },

    nextToken: function (withWhitespace) {
        var tok;

        if(this.peeked) {
            if(!withWhitespace && this.peeked.type == lexer.TOKEN_WHITESPACE) {
                this.peeked = null;
            }
            else {
                tok = this.peeked;
                this.peeked = null;
                return tok;
            }
        }

        tok = this.tokens.nextToken();

        if(!withWhitespace) {
            while(tok && tok.type == lexer.TOKEN_WHITESPACE) {
                tok = this.tokens.nextToken();
            }
        }

        return tok;
    },

    peekToken: function () {
        this.peeked = this.peeked || this.nextToken();
        return this.peeked;
    },

    pushToken: function(tok) {
        if(this.peeked) {
            throw new Error("pushToken: can only push one token on between reads");
        }
        this.peeked = tok;
    },

    fail: function (msg, lineno, colno) {
        if((lineno === undefined || colno === undefined) && this.peekToken()) {
            var tok = this.peekToken();
            lineno = tok.lineno;
            colno = tok.colno;
        }
        if (lineno !== undefined) lineno += 1;
        if (colno !== undefined) colno += 1;

        throw new lib.TemplateError(msg, lineno, colno);
    },

    skip: function(type) {
        var tok = this.nextToken();
        if(!tok || tok.type != type) {
            this.pushToken(tok);
            return false;
        }
        return true;
    },

    expect: function(type) {
        var tok = this.nextToken();
        if(!tok.type == type) {
            this.fail('expected ' + type + ', got ' + tok.type,
                      tok.lineno,
                      tok.colno);
        }
        return tok;
    },

    skipValue: function(type, val) {
        var tok = this.nextToken();
        if(!tok || tok.type != type || tok.value != val) {
            this.pushToken(tok);
            return false;
        }
        return true;
    },

    skipWhitespace: function () {
        return this.skip(lexer.TOKEN_WHITESPACE);
    },

    skipSymbol: function(val) {
        return this.skipValue(lexer.TOKEN_SYMBOL, val);
    },

    advanceAfterBlockEnd: function(name) {
        if(!name) {
            var tok = this.peekToken();

            if(!tok) {
                this.fail('unexpected end of file');
            }

            if(tok.type != lexer.TOKEN_SYMBOL) {
                this.fail("advanceAfterBlockEnd: expected symbol token or " +
                          "explicit name to be passed");
            }

            name = this.nextToken().value;
        }

        var tok = this.nextToken();

        if(tok && tok.type == lexer.TOKEN_BLOCK_END) {
            if(tok.value.charAt(0) === '-') {
                this.dropLeadingWhitespace = true;
            }
        }
        else {
            this.fail("expected block end in " + name + " statement");
        }
    },

    advanceAfterVariableEnd: function() {
        if(!this.skip(lexer.TOKEN_VARIABLE_END)) {
            this.fail("expected variable end");
        }
    },

    parseFor: function() {
        var forTok = this.peekToken();
        var node;
        var endBlock;

        if(this.skipSymbol('for')) {
            node = new nodes.For(forTok.lineno, forTok.colno);
            endBlock = 'endfor';
        }
        else if(this.skipSymbol('asyncEach')) {
            node = new nodes.AsyncEach(forTok.lineno, forTok.colno);
            endBlock = 'endeach';
        }
        else if(this.skipSymbol('asyncAll')) {
            node = new nodes.AsyncAll(forTok.lineno, forTok.colno);
            endBlock = 'endall';
        }
        else {
            this.fail("parseFor: expected for{Async}", forTok.lineno, forTok.colno);
        }

        node.name = this.parsePrimary();

        if(!(node.name instanceof nodes.Symbol)) {
            this.fail('parseFor: variable name expected for loop');
        }

        var type = this.peekToken().type;
        if(type == lexer.TOKEN_COMMA) {
            // key/value iteration
            var key = node.name;
            node.name = new nodes.Array(key.lineno, key.colno);
            node.name.addChild(key);

            while(this.skip(lexer.TOKEN_COMMA)) {
                var prim = this.parsePrimary();
                node.name.addChild(prim);
            }
        }

        if(!this.skipSymbol('in')) {
            this.fail('parseFor: expected "in" keyword for loop',
                      forTok.lineno,
                      forTok.colno);
        }

        node.arr = this.parseExpression();
        this.advanceAfterBlockEnd(forTok.value);

        node.body = this.parseUntilBlocks(endBlock);
        this.advanceAfterBlockEnd();

        return node;
    },

    parseMacro: function() {
        var macroTok = this.peekToken();
        if(!this.skipSymbol('macro')) {
            this.fail("expected macro");
        }

        var name = this.parsePrimary(true);
        var args = this.parseSignature();
        var node = new nodes.Macro(macroTok.lineno,
                                   macroTok.colno,
                                   name,
                                   args);

        this.advanceAfterBlockEnd(macroTok.value);
        node.body = this.parseUntilBlocks('endmacro');
        this.advanceAfterBlockEnd();

        return node;
    },

    parseImport: function() {
        var importTok = this.peekToken();
        if(!this.skipSymbol('import')) {
            this.fail("parseImport: expected import",
                      importTok.lineno,
                      importTok.colno);
        }

        var template = this.parsePrimary();

        if(!this.skipSymbol('as')) {
            this.fail('parseImport: expected "as" keyword',
                            importTok.lineno,
                            importTok.colno);
        }

        var target = this.parsePrimary();
        var node = new nodes.Import(importTok.lineno,
                                    importTok.colno,
                                    template,
                                    target);
        this.advanceAfterBlockEnd(importTok.value);

        return node;
    },

    parseFrom: function() {
        var fromTok = this.peekToken();
        if(!this.skipSymbol('from')) {
            this.fail("parseFrom: expected from");
        }

        var template = this.parsePrimary();
        var node = new nodes.FromImport(fromTok.lineno,
                                        fromTok.colno,
                                        template,
                                        new nodes.NodeList());

        if(!this.skipSymbol('import')) {
            this.fail("parseFrom: expected import",
                            fromTok.lineno,
                            fromTok.colno);
        }

        var names = node.names;

        while(1) {
            var nextTok = this.peekToken();
            if(nextTok.type == lexer.TOKEN_BLOCK_END) {
                if(!names.children.length) {
                    this.fail('parseFrom: Expected at least one import name',
                              fromTok.lineno,
                              fromTok.colno);
                }

                // Since we are manually advancing past the block end,
                // need to keep track of whitespace control (normally
                // this is done in `advanceAfterBlockEnd`
                if(nextTok.value.charAt(0) == '-') {
                    this.dropLeadingWhitespace = true;
                }

                this.nextToken();
                break;
            }

            if(names.children.length > 0 && !this.skip(lexer.TOKEN_COMMA)) {
                this.fail('parseFrom: expected comma',
                                fromTok.lineno,
                                fromTok.colno);
            }

            var name = this.parsePrimary();
            if(name.value.charAt(0) == '_') {
                this.fail('parseFrom: names starting with an underscore ' +
                          'cannot be imported',
                          name.lineno,
                          name.colno);
            }

            if(this.skipSymbol('as')) {
                var alias = this.parsePrimary();
                names.addChild(new nodes.Pair(name.lineno,
                                              name.colno,
                                              name,
                                              alias));
            }
            else {
                names.addChild(name);
            }
        }

        return node;
    },

    parseBlock: function() {
        var tag = this.peekToken();
        if(!this.skipSymbol('block')) {
            this.fail('parseBlock: expected block', tag.lineno, tag.colno);
        }

        var node = new nodes.Block(tag.lineno, tag.colno);

        node.name = this.parsePrimary();
        if(!(node.name instanceof nodes.Symbol)) {
            this.fail('parseBlock: variable name expected',
                      tag.lineno,
                      tag.colno);
        }

        this.advanceAfterBlockEnd(tag.value);

        node.body = this.parseUntilBlocks('endblock');

        if(!this.peekToken()) {
            this.fail('parseBlock: expected endblock, got end of file');
        }

        this.advanceAfterBlockEnd();

        return node;
    },

    parseTemplateRef: function(tagName, nodeType) {
        var tag = this.peekToken();
        if(!this.skipSymbol(tagName)) {
            this.fail('parseTemplateRef: expected '+ tagName);
        }

        var node = new nodeType(tag.lineno, tag.colno);
        node.template = this.parsePrimary();

        this.advanceAfterBlockEnd(tag.value);
        return node;
    },

    parseExtends: function() {
        return this.parseTemplateRef('extends', nodes.Extends);
    },

    parseInclude: function() {
        return this.parseTemplateRef('include', nodes.Include);
    },

    parseIf: function() {
        var tag = this.peekToken();
        var node;

        if(this.skipSymbol('if') || this.skipSymbol('elif')) {
            node = new nodes.If(tag.lineno, tag.colno);
        }
        else if(this.skipSymbol('ifAsync')) {
            node = new nodes.IfAsync(tag.lineno, tag.colno);
        }
        else {
            this.fail("parseIf: expected if or elif",
                      tag.lineno,
                      tag.colno);
        }

        node.cond = this.parseExpression();
        this.advanceAfterBlockEnd(tag.value);

        node.body = this.parseUntilBlocks('elif', 'else', 'endif');
        var tok = this.peekToken();

        switch(tok && tok.value) {
        case "elif":
            node.else_ = this.parseIf();
            break;
        case "else":
            this.advanceAfterBlockEnd();
            node.else_ = this.parseUntilBlocks("endif");
            this.advanceAfterBlockEnd();
            break;
        case "endif":
            node.else_ = null;
            this.advanceAfterBlockEnd();
            break;
        default:
            this.fail('parseIf: expected endif, else, or endif, ' +
                      'got end of file');
        }

        return node;
    },

    parseSet: function() {
        var tag = this.peekToken();
        if(!this.skipSymbol('set')) {
            this.fail('parseSet: expected set', tag.lineno, tag.colno);
        }

        var node = new nodes.Set(tag.lineno, tag.colno, []);

        var target;
        while((target = this.parsePrimary())) {
            node.targets.push(target);

            if(!this.skip(lexer.TOKEN_COMMA)) {
                break;
            }
        }

        if(!this.skipValue(lexer.TOKEN_OPERATOR, '=')) {
            this.fail('parseSet: expected = in set tag',
                      tag.lineno,
                      tag.colno);
        }

        node.value = this.parseExpression();
        this.advanceAfterBlockEnd(tag.value);

        return node;
    },

    parseStatement: function () {
        var tok = this.peekToken();
        var node;

        if(tok.type != lexer.TOKEN_SYMBOL) {
            this.fail('tag name expected', tok.lineno, tok.colno);
        }

        if(this.breakOnBlocks &&
           this.breakOnBlocks.indexOf(tok.value) !== -1) {
            return null;
        }

        switch(tok.value) {
        case 'raw': return this.parseRaw();
        case 'if':
        case 'ifAsync':
            return this.parseIf();
        case 'for':
        case 'asyncEach':
        case 'asyncAll':
            return this.parseFor();
        case 'block': return this.parseBlock();
        case 'extends': return this.parseExtends();
        case 'include': return this.parseInclude();
        case 'set': return this.parseSet();
        case 'macro': return this.parseMacro();
        case 'import': return this.parseImport();
        case 'from': return this.parseFrom();
        default:
            if (this.extensions.length) {
                for (var i = 0; i < this.extensions.length; i++) {
                    var ext = this.extensions[i];
                    if ((ext.tags || []).indexOf(tok.value) !== -1) {
                        return ext.parse(this, nodes, lexer);
                    }
                }
            }
            this.fail('unknown block tag: ' + tok.value, tok.lineno, tok.colno);
        }

        return node;
    },

    parseRaw: function() {
        this.advanceAfterBlockEnd();
        var str = '';
        var begun = this.peekToken();

        while(1) {
            // Passing true gives us all the whitespace tokens as
            // well, which are usually ignored.
            var tok = this.nextToken(true);

            if(!tok) {
                this.fail("expected endraw, got end of file");
            }

            if(tok.type == lexer.TOKEN_BLOCK_START) {
                // We need to look for the `endraw` block statement,
                // which involves a lookahead so carefully keep track
                // of whitespace
                var ws = null;
                var name = this.nextToken(true);

                if(name.type == lexer.TOKEN_WHITESPACE) {
                    ws = name;
                    name = this.nextToken();
                }

                if(name.type == lexer.TOKEN_SYMBOL &&
                   name.value == 'endraw') {
                    this.advanceAfterBlockEnd(name.value);
                    break;
                }
                else {
                    str += tok.value;
                    if(ws) {
                        str += ws.value;
                    }
                    str += name.value;
                }
            }
            else {
                str += tok.value;
            }
        }


        var output = new nodes.Output(
            begun.lineno,
            begun.colno,
            [new nodes.TemplateData(begun.lineno, begun.colno, str)]
        );

        return output;
    },

    parsePostfix: function(node) {
        var tok = this.peekToken();

        while(tok) {
            if(tok.type == lexer.TOKEN_LEFT_PAREN) {
                // Function call
                node = new nodes.FunCall(tok.lineno,
                                         tok.colno,
                                         node,
                                         this.parseSignature());
            }
            else if(tok.type == lexer.TOKEN_LEFT_BRACKET) {
                // Reference
                var lookup = this.parseAggregate();
                if(lookup.children.length > 1) {
                    this.fail('invalid index');
                }

                node =  new nodes.LookupVal(tok.lineno,
                                            tok.colno,
                                            node,
                                            lookup.children[0]);
            }
            else if(tok.type == lexer.TOKEN_OPERATOR && tok.value == '.') {
                // Reference
                this.nextToken();
                var val = this.nextToken();

                if(val.type != lexer.TOKEN_SYMBOL) {
                    this.fail('expected name as lookup value, got ' + val.value,
                              val.lineno,
                              val.colno);
                }

                // Make a literal string because it's not a variable
                // reference
                var lookup = new nodes.Literal(val.lineno,
                                               val.colno,
                                               val.value);

                node =  new nodes.LookupVal(tok.lineno,
                                            tok.colno,
                                            node,
                                            lookup);
            }
            else {
                break;
            }

            tok = this.peekToken();
        }

        return node;
    },

    parseExpression: function() {
        var node = this.parseInlineIf();
        return node;
    },

    parseInlineIf: function() {
        var node = this.parseOr();
        if(this.skipSymbol('if')) {
            var cond_node = this.parseOr();
            var body_node = node;
            node = new nodes.InlineIf(node.lineno, node.colno);
            node.body = body_node;
            node.cond = cond_node;
            if(this.skipSymbol('else')) {
                node.else_ = this.parseOr();
            } else {
                node.else_ = null;
            }
        }

        return node;
    },

    parseOr: function() {
        var node = this.parseAnd();
        while(this.skipSymbol('or')) {
            var node2 = this.parseAnd();
            node = new nodes.Or(node.lineno,
                                node.colno,
                                node,
                                node2);
        }
        return node;
    },

    parseAnd: function() {
        var node = this.parseNot();
        while(this.skipSymbol('and')) {
            var node2 = this.parseNot();
            node = new nodes.And(node.lineno,
                                 node.colno,
                                 node,
                                 node2);
        }
        return node;
    },

    parseNot: function() {
        var tok = this.peekToken();
        if(this.skipSymbol('not')) {
            return new nodes.Not(tok.lineno,
                                 tok.colno,
                                 this.parseNot());
        }
        return this.parseCompare();
    },

    parseCompare: function() {
        var compareOps = ['==', '!=', '<', '>', '<=', '>='];
        var expr = this.parseAdd();
        var ops = [];

        while(1) {
            var tok = this.nextToken();

            if(!tok) {
                break;
            }
            else if(compareOps.indexOf(tok.value) !== -1) {
                ops.push(new nodes.CompareOperand(tok.lineno,
                                                  tok.colno,
                                                  this.parseAdd(),
                                                  tok.value));
            }
            else if(tok.type == lexer.TOKEN_SYMBOL &&
                    tok.value == 'in') {
                ops.push(new nodes.CompareOperand(tok.lineno,
                                                  tok.colno,
                                                  this.parseAdd(),
                                                  'in'));
            }
            else if(tok.type == lexer.TOKEN_SYMBOL &&
                    tok.value == 'not' &&
                    this.skipSymbol('in')) {
                ops.push(new nodes.CompareOperand(tok.lineno,
                                                  tok.colno,
                                                  this.parseAdd(),
                                                  'notin'));
            }
            else {
                this.pushToken(tok);
                break;
            }
        }

        if(ops.length) {
            return new nodes.Compare(ops[0].lineno,
                                     ops[0].colno,
                                     expr,
                                     ops);
        }
        else {
            return expr;
        }
    },

    parseAdd: function() {
        var node = this.parseSub();
        while(this.skipValue(lexer.TOKEN_OPERATOR, '+')) {
            var node2 = this.parseSub();
            node = new nodes.Add(node.lineno,
                                 node.colno,
                                 node,
                                 node2);
        }
        return node;
    },

    parseSub: function() {
        var node = this.parseMul();
        while(this.skipValue(lexer.TOKEN_OPERATOR, '-')) {
            var node2 = this.parseMul();
            node = new nodes.Sub(node.lineno,
                                 node.colno,
                                 node,
                                 node2);
        }
        return node;
    },

    parseMul: function() {
        var node = this.parseDiv();
        while(this.skipValue(lexer.TOKEN_OPERATOR, '*')) {
            var node2 = this.parseDiv();
            node = new nodes.Mul(node.lineno,
                                 node.colno,
                                 node,
                                 node2);
        }
        return node;
    },

    parseDiv: function() {
        var node = this.parseFloorDiv();
        while(this.skipValue(lexer.TOKEN_OPERATOR, '/')) {
            var node2 = this.parseFloorDiv();
            node = new nodes.Div(node.lineno,
                                 node.colno,
                                 node,
                                 node2);
        }
        return node;
    },

    parseFloorDiv: function() {
        var node = this.parseMod();
        while(this.skipValue(lexer.TOKEN_OPERATOR, '//')) {
            var node2 = this.parseMod();
            node = new nodes.FloorDiv(node.lineno,
                                      node.colno,
                                      node,
                                      node2);
        }
        return node;
    },

    parseMod: function() {
        var node = this.parsePow();
        while(this.skipValue(lexer.TOKEN_OPERATOR, '%')) {
            var node2 = this.parsePow();
            node = new nodes.Mod(node.lineno,
                                 node.colno,
                                 node,
                                 node2);
        }
        return node;
    },

    parsePow: function() {
        var node = this.parseUnary();
        while(this.skipValue(lexer.TOKEN_OPERATOR, '**')) {
            var node2 = this.parseUnary();
            node = new nodes.Pow(node.lineno,
                                 node.colno,
                                 node,
                                 node2);
        }
        return node;
    },

    parseUnary: function(noFilters) {
        var tok = this.peekToken();
        var node;

        if(this.skipValue(lexer.TOKEN_OPERATOR, '-')) {
            node = new nodes.Neg(tok.lineno,
                                 tok.colno,
                                 this.parseUnary(true));
        }
        else if(this.skipValue(lexer.TOKEN_OPERATOR, '+')) {
            node = new nodes.Pos(tok.lineno,
                                 tok.colno,
                                 this.parseUnary(true));
        }
        else {
            node = this.parsePrimary();
        }

        if(!noFilters) {
            node = this.parseFilter(node);
        }

        return node;
    },

    parsePrimary: function (noPostfix) {
        var tok = this.nextToken();
        var val = null;
        var node = null;

        if(!tok) {
            this.fail('expected expression, got end of file');
        }
        else if(tok.type == lexer.TOKEN_STRING) {
            val = tok.value;
        }
        else if(tok.type == lexer.TOKEN_INT) {
            val = parseInt(tok.value, 10);
        }
        else if(tok.type == lexer.TOKEN_FLOAT) {
            val = parseFloat(tok.value);
        }
        else if(tok.type == lexer.TOKEN_BOOLEAN) {
            if(tok.value == "true") {
                val = true;
            }
            else if(tok.value == "false") {
                val = false;
            }
            else {
                this.fail("invalid boolean: " + tok.val,
                          tok.lineno,
                          tok.colno);
            }
        }

        if(val !== null) {
            node = new nodes.Literal(tok.lineno, tok.colno, val);
        }
        else if(tok.type == lexer.TOKEN_SYMBOL) {
            node = new nodes.Symbol(tok.lineno, tok.colno, tok.value);

            if(!noPostfix) {
                node = this.parsePostfix(node);
            }
        }
        else {
            // See if it's an aggregate type, we need to push the
            // current delimiter token back on
            this.pushToken(tok);
            node = this.parseAggregate();
        }

        if(node) {
            return node;
        }
        else {
            this.fail('unexpected token: ' + tok.value,
                      tok.lineno,
                      tok.colno);
        }
    },

    parseFilter: function(node) {
        while(this.skip(lexer.TOKEN_PIPE)) {
            var tok = this.expect(lexer.TOKEN_SYMBOL);
            var name = tok.value;

            while(this.skipValue(lexer.TOKEN_OPERATOR, '.')) {
                name += '.' + this.expect(lexer.TOKEN_SYMBOL).value;
            }

            node = new nodes.Filter(
                tok.lineno,
                tok.colno,
                new nodes.Symbol(tok.lineno,
                                 tok.colno,
                                 name),
                new nodes.NodeList(
                    tok.lineno,
                    tok.colno,
                    [node])
            );

            if(this.peekToken().type == lexer.TOKEN_LEFT_PAREN) {
                // Get a FunCall node and add the parameters to the
                // filter
                var call = this.parsePostfix(node);
                node.args.children = node.args.children.concat(call.args.children);
            }
        }

        return node;
    },

    parseAggregate: function() {
        var tok = this.nextToken();
        var node;

        switch(tok.type) {
        case lexer.TOKEN_LEFT_PAREN:
            node = new nodes.Group(tok.lineno, tok.colno); break;
        case lexer.TOKEN_LEFT_BRACKET:
            node = new nodes.Array(tok.lineno, tok.colno); break;
        case lexer.TOKEN_LEFT_CURLY:
            node = new nodes.Dict(tok.lineno, tok.colno); break;
        default:
            return null;
        }

        while(1) {
            var type = this.peekToken().type;
            if(type == lexer.TOKEN_RIGHT_PAREN ||
               type == lexer.TOKEN_RIGHT_BRACKET ||
               type == lexer.TOKEN_RIGHT_CURLY) {
                this.nextToken();
                break;
            }

            if(node.children.length > 0) {
                if(!this.skip(lexer.TOKEN_COMMA)) {
                    this.fail("parseAggregate: expected comma after expression",
                              tok.lineno,
                              tok.colno);
                }
            }

            if(node instanceof nodes.Dict) {
                // TODO: check for errors
                var key = this.parsePrimary();

                // We expect a key/value pair for dicts, separated by a
                // colon
                if(!this.skip(lexer.TOKEN_COLON)) {
                    this.fail("parseAggregate: expected colon after dict key",
                        tok.lineno,
                        tok.colno);
                }

                // TODO: check for errors
                var value = this.parseExpression();
                node.addChild(new nodes.Pair(key.lineno,
                                             key.colno,
                                             key,
                                             value));
            }
            else {
                // TODO: check for errors
                var expr = this.parseExpression();
                node.addChild(expr);
            }
        }

        return node;
    },

    parseSignature: function(tolerant, noParens) {
        var tok = this.peekToken();
        if(!noParens && tok.type != lexer.TOKEN_LEFT_PAREN) {
            if(tolerant) {
                return null;
            }
            else {
                this.fail('expected arguments', tok.lineno, tok.colno);
            }
        }

        if(tok.type == lexer.TOKEN_LEFT_PAREN) {
            tok = this.nextToken();
        }

        var args = new nodes.NodeList(tok.lineno, tok.colno);
        var kwargs = new nodes.KeywordArgs(tok.lineno, tok.colno);
        var kwnames = [];
        var checkComma = false;

        while(1) {
            tok = this.peekToken();
            if(!noParens && tok.type == lexer.TOKEN_RIGHT_PAREN) {
                this.nextToken();
                break;
            }
            else if(noParens && tok.type == lexer.TOKEN_BLOCK_END) {
                break;
            }

            if(checkComma && !this.skip(lexer.TOKEN_COMMA)) {
                this.fail("parseSignature: expected comma after expression",
                          tok.lineno,
                          tok.colno);
            }
            else {
                var arg = this.parseExpression();

                if(this.skipValue(lexer.TOKEN_OPERATOR, '=')) {
                    kwargs.addChild(
                        new nodes.Pair(arg.lineno,
                                       arg.colno,
                                       arg,
                                       this.parseExpression())
                    );
                }
                else {
                    args.addChild(arg);
                }
            }

            checkComma = true;
        }

        if(kwargs.children.length) {
            args.addChild(kwargs);
        }

        return args;
    },

    parseUntilBlocks: function(/* blockNames */) {
        var prev = this.breakOnBlocks;
        this.breakOnBlocks = lib.toArray(arguments);

        var ret = this.parse();

        this.breakOnBlocks = prev;
        return ret;
    },

    parseNodes: function () {
        var tok;
        var buf = [];

        while((tok = this.nextToken())) {
            if(tok.type == lexer.TOKEN_DATA) {
                var data = tok.value;
                var nextToken = this.peekToken();
                var nextVal = nextToken && nextToken.value;

                // If the last token has "-" we need to trim the
                // leading whitespace of the data. This is marked with
                // the `dropLeadingWhitespace` variable.
                if(this.dropLeadingWhitespace) {
                    // TODO: this could be optimized (don't use regex)
                    data = data.replace(/^\s*/, '');
                    this.dropLeadingWhitespace = false;
                }

                // Same for the succeding block start token
                if(nextToken &&
                   nextToken.type == lexer.TOKEN_BLOCK_START &&
                   nextVal.charAt(nextVal.length - 1) == '-') {
                    // TODO: this could be optimized (don't use regex)
                    data = data.replace(/\s*$/, '');
                }

                buf.push(new nodes.Output(tok.lineno,
                                          tok.colno,
                                          [new nodes.TemplateData(tok.lineno,
                                                                  tok.colno,
                                                                  data)]));
            }
            else if(tok.type == lexer.TOKEN_BLOCK_START) {
                var n = this.parseStatement();
                if(!n) {
                    break;
                }
                buf.push(n);
            }
            else if(tok.type == lexer.TOKEN_VARIABLE_START) {
                var e = this.parseExpression();
                this.advanceAfterVariableEnd();
                buf.push(new nodes.Output(tok.lineno, tok.colno, [e]));
            }
            else if(tok.type != lexer.TOKEN_COMMENT) {
                // Ignore comments, otherwise this should be an error
                this.fail("Unexpected token at top-level: " +
                                tok.type, tok.lineno, tok.colno);
            }
        }

        return buf;
    },

    parse: function() {
        return new nodes.NodeList(0, 0, this.parseNodes());
    },

    parseAsRoot: function() {
        return new nodes.Root(0, 0, this.parseNodes());
    }
});

// var util = modules["util"];

// var l = lexer.lex('{%- if x -%}\n hello {% endif %}');
// var t;
// while((t = l.nextToken())) {
//     console.log(util.inspect(t));
// }

// var p = new Parser(lexer.lex('hello {% foo %} {{ "hi" | bar }} {% endfoo %} end'));
// p.extensions = [new FooExtension()];
// var n = p.parseAsRoot();
// nodes.printNodes(n);

modules['parser'] = {
    parse: function(src, extensions) {
        var p = new Parser(lexer.lex(src));
        if (extensions !== undefined) {
            p.extensions = extensions;
        }
        return p.parseAsRoot();
    }
};
})();
(function() {
var nodes = modules["nodes"];

var sym = 0;
function gensym() {
    return 'hole_' + sym++;
}

// copy-on-write version of map
function mapCOW(arr, func) {
    var res = null;

    for(var i=0; i<arr.length; i++) {
        var item = func(arr[i]);

        if(item !== arr[i]) {
            if(!res) {
                res = arr.slice();
            }

            res[i] = item;
        }
    }

    return res || arr;
}

function walk(ast, func, depthFirst) {
    if(!(ast instanceof nodes.Node)) {
        return ast;
    }

    if(!depthFirst) {
        var astT = func(ast);

        if(astT && astT !== ast) {
            return astT;
        }
    }

    if(ast instanceof nodes.NodeList) {
        var children = mapCOW(ast.children, function(node) {
            return walk(node, func, depthFirst);
        });

        if(children !== ast.children) {
            ast = new nodes[ast.typename](ast.lineno, ast.colno, children);
        }
    }
    else if(ast instanceof nodes.CallExtension) {
        var args = walk(ast.args, func, depthFirst);

        var contentArgs = mapCOW(ast.contentArgs, function(node) {
            return walk(node, func, depthFirst);
        });

        if(args !== ast.args || contentArgs !== ast.contentArgs) {
            ast = new nodes[ast.typename](ast.extName,
                                          ast.prop,
                                          args,
                                          contentArgs);
        }
    }
    else {
        var props = ast.fields.map(function(field) {
            return ast[field];
        });

        var propsT = mapCOW(props, function(prop) {
            return walk(prop, func, depthFirst);
        });

        if(propsT !== props) {
            ast = new nodes[ast.typename](ast.lineno, ast.colno);

            propsT.forEach(function(prop, i) {
                ast[ast.fields[i]] = prop;
            });
        }
    }

    return depthFirst ? (func(ast) || ast) : ast;
}

function depthWalk(ast, func) {
    return walk(ast, func, true);
}

function _liftFilters(node, asyncFilters, prop) {
    var children = [];

    var walked = depthWalk(prop ? node[prop] : node, function(node) {
        if(node instanceof nodes.Block) {
            return node;
        }
        else if((node instanceof nodes.Filter &&
                 asyncFilters.indexOf(node.name.value) !== -1) ||
                node instanceof nodes.CallExtensionAsync) {
            var symbol = new nodes.Symbol(node.lineno,
                                          node.colno,
                                          gensym());

            children.push(new nodes.FilterAsync(node.lineno,
                                                node.colno,
                                                node.name,
                                                node.args,
                                                symbol));
            return symbol;
        }
    });

    if(prop) {
        node[prop] = walked;
    }
    else {
        node = walked;
    }

    if(children.length) {
        children.push(node);

        return new nodes.NodeList(
            node.lineno,
            node.colno,
            children
        );
    }
    else {
        return node;
    }
}

function liftFilters(ast, asyncFilters) {
    return depthWalk(ast, function(node) {
        if(node instanceof nodes.Output) {
            return _liftFilters(node, asyncFilters);
        }
        else if(node instanceof nodes.For) {
            return _liftFilters(node, asyncFilters, 'arr');
        }
        else if(node instanceof nodes.If) {
            return _liftFilters(node, asyncFilters, 'cond');
        }
        else if(node instanceof nodes.CallExtension) {
            return _liftFilters(node, asyncFilters, 'args');
        }
    });
}

function liftSuper(ast) {
    return walk(ast, function(blockNode) {
        if(!(blockNode instanceof nodes.Block)) {
            return;
        }

        var hasSuper = false;
        var symbol = gensym();

        blockNode.body = walk(blockNode.body, function(node) {
            if(node instanceof nodes.FunCall &&
               node.name.value == 'super') {
                hasSuper = true;
                return new nodes.Symbol(node.lineno, node.colno, symbol);
            }
        });

        if(hasSuper) {
            blockNode.body.children.unshift(new nodes.Super(
                0, 0, blockNode.name, new nodes.Symbol(0, 0, symbol)
            ));
        }
    });
}

function convertStatements(ast) {
    return depthWalk(ast, function(node) {
        if(!(node instanceof nodes.If) &&
           !(node instanceof nodes.For)) {
            return;
        }

        var async = false;
        walk(node, function(node) {
            if(node instanceof nodes.FilterAsync ||
               node instanceof nodes.IfAsync ||
               node instanceof nodes.AsyncEach ||
               node instanceof nodes.AsyncAll) {
                async = true;
                // Stop iterating by returning the node
                return node;
            }
        });

        if(async) {
	        if(node instanceof nodes.If) {
                return new nodes.IfAsync(
                    node.lineno,
                    node.colno,
                    node.cond,
                    node.body,
                    node.else_
                );
            }
            else if(node instanceof nodes.For) {
                return new nodes.AsyncEach(
                    node.lineno,
                    node.colno,
                    node.arr,
                    node.name,
                    node.body
                );
            }
        }
    });
}

function cps(ast, asyncFilters) {
    return convertStatements(liftSuper(liftFilters(ast, asyncFilters)));
}

function transform(ast, asyncFilters, name) {
    return cps(ast, asyncFilters || []);
}

// var parser = modules["parser"];
// var src = 'hello {% foo %}{% endfoo %} end';
// var ast = transform(parser.parse(src, [new FooExtension()]), ['bar']);
// nodes.printNodes(ast);

modules['transformer'] = {
    transform: transform
};
})();
(function() {
var lib = modules["lib"];
var parser = modules["parser"];
var transformer = modules["transformer"];
var nodes = modules["nodes"];
var Object = modules["object"];
var Frame = modules["runtime"].Frame;

// These are all the same for now, but shouldn't be passed straight
// through
var compareOps = {
    '==': '==',
    '!=': '!=',
    '<': '<',
    '>': '>',
    '<=': '<=',
    '>=': '>='
};

// A common pattern is to emit binary operators
function binOpEmitter(str) {
    return function(node, frame) {
        this.compile(node.left, frame);
        this.emit(str);
        this.compile(node.right, frame);
    };
}

// Generate an array of strings
function quotedArray(arr) {
    return '[' +
        lib.map(arr, function(x) { return '"' + x + '"'; }) +
        ']';
}

var Compiler = Object.extend({
    init: function() {
        this.codebuf = [];
        this.lastId = 0;
        this.buffer = null;
        this.bufferStack = [];
        this.isChild = false;
        this.scopeClosers = '';
    },

    fail: function (msg, lineno, colno) {
        if (lineno !== undefined) lineno += 1;
        if (colno !== undefined) colno += 1;

        throw new lib.TemplateError(msg, lineno, colno);
    },

    pushBufferId: function(id) {
        this.bufferStack.push(this.buffer);
        this.buffer = id;
        this.emit('var ' + this.buffer + ' = "";');
    },

    popBufferId: function() {
        this.buffer = this.bufferStack.pop();
    },

    emit: function(code) {
        this.codebuf.push(code);
    },

    emitLine: function(code) {
        this.emit(code + "\n");
    },

    emitLines: function() {
        lib.each(lib.toArray(arguments), function(line) {
            this.emitLine(line);
        }, this);
    },

    emitFuncBegin: function(name) {
        this.buffer = 'output';
        this.scopeClosers = '';
        this.emitLine('function ' + name + '(env, context, frame, runtime, cb) {');
        this.emitLine('var lineno = null;');
        this.emitLine('var colno = null;');
        this.emitLine('var ' + this.buffer + ' = "";');
        this.emitLine('try {');
    },

    emitFuncEnd: function(noReturn) {
        if(!noReturn) {
            this.emitLine('cb(null, ' + this.buffer +');');
        }

        this.closeScopeLevels();
        this.emitLine('} catch (e) {');
        this.emitLine('  cb(runtime.handleError(e, lineno, colno));');
        this.emitLine('}');
        this.emitLine('}');
        this.buffer = null;
    },

    addScopeLevel: function(closingDelim) {
        this.scopeClosers += closingDelim || '})';
    },

    closeScopeLevels: function() {
        this.emitLine(this.scopeClosers + ';');
        this.scopeClosers = '';
    },

    withScopedSyntax: function(func) {
        var scopeClosers = this.scopeClosers;
        this.scopeClosers = '';

        func.call(this);

        this.closeScopeLevels();
        this.scopeClosers = scopeClosers;
    },

    makeCallback: function(res) {
        var err = this.tmpid();

        return 'function(' + err + (res ? ',' + res : '') + ') {\n' +
            'if(' + err + ') { cb(' + err + '); return; }';
    },

    tmpid: function() {
        this.lastId++;
        return 't_' + this.lastId;
    },

    _bufferAppend: function(func) {
        this.emit(this.buffer + ' += runtime.suppressValue(');
        func.call(this);
        this.emit(', env.autoesc);\n');
    },

    _compileChildren: function(node, frame) {
        var children = node.children;
        for(var i=0, l=children.length; i<l; i++) {
            this.compile(children[i], frame);
        }
    },

    _compileAggregate: function(node, frame, startChar, endChar) {
        if(startChar) {
            this.emit(startChar);
        }

        for(var i=0; i<node.children.length; i++) {
            if(i > 0) {
                this.emit(',');
            }

            this.compile(node.children[i], frame);
        }

        if(endChar) {
            this.emit(endChar);
        }
    },

    _compileExpression: function(node, frame) {
        // TODO: I'm not really sure if this type check is worth it or
        // not.
        this.assertType(
            node,
            nodes.Literal,
            nodes.Symbol,
            nodes.Group,
            nodes.Array,
            nodes.Dict,
            nodes.FunCall,
            nodes.Filter,
            nodes.LookupVal,
            nodes.Compare,
            nodes.InlineIf,
            nodes.And,
            nodes.Or,
            nodes.Not,
            nodes.Add,
            nodes.Sub,
            nodes.Mul,
            nodes.Div,
            nodes.FloorDiv,
            nodes.Mod,
            nodes.Pow,
            nodes.Neg,
            nodes.Pos,
            nodes.Compare,
            nodes.NodeList
        );
        this.compile(node, frame);
    },

    assertType: function(node /*, types */) {
        var types = lib.toArray(arguments).slice(1);
        var success = false;

        for(var i=0; i<types.length; i++) {
            if(node instanceof types[i]) {
                success = true;
            }
        }

        if(!success) {
            this.fail("assertType: invalid type: " + node.typename,
                      node.lineno,
                      node.colno);
        }
    },

    compileCallExtension: function(node, frame, async) {
        var name = node.extName;
        var args = node.args;
        var contentArgs = node.contentArgs;
        var transformedArgs = [];

        if(!async) {
            this.emit(this.buffer + ' += runtime.suppressValue(');
        }

        this.emit('env.getExtension("' + node.extName + '")["' + node.prop + '"](');
        this.emit('context');

        if(args || contentArgs) {
            this.emit(',');
        }

        if(args) {
            if(!(args instanceof nodes.NodeList)) {
                this.fail('compileCallExtension: arguments must be a NodeList, ' +
                          'use `parser.parseSignature`');
            }

            lib.each(args.children, function(arg, i) {
                // Tag arguments are passed normally to the call. Note
                // that keyword arguments are turned into a single js
                // object as the last argument, if they exist.
                this._compileExpression(arg, frame);

                if(i != args.children.length - 1 || contentArgs.length) {
                    this.emit(',');
                }
            }, this);
        }

        if(contentArgs.length) {
            lib.each(contentArgs, function(arg, i) {
                if(i > 0) {
                    this.emit(',');
                }

                if(arg) {
                    var id = this.tmpid();

                    this.emitLine('function(cb) {');
                    this.emitLine('if(!cb) { cb = function(err) { if(err) { throw err; }}}');
                    this.pushBufferId(id);

                    this.withScopedSyntax(function() {
                        this.compile(arg, frame);
                        this.emitLine('cb(null, ' + id + ');');
                    });

                    this.popBufferId();
                    this.emitLine('return ' + id + ';');
                    this.emitLine('}');
                }
                else {
                    this.emit('null');
                }
            }, this);
        }

        if(async) {
            var res = this.tmpid();
            this.emitLine(', ' + this.makeCallback(res));
            this.emitLine(this.buffer + ' += runtime.suppressValue(' + res + ', env.autoesc);');
            this.addScopeLevel();
        }
        else {
            this.emit(')');
            this.emit(', env.autoesc);\n');
        }
    },

    compileCallExtensionAsync: function(node, frame) {
        this.compileCallExtension(node, frame, true);
    },

    compileNodeList: function(node, frame) {
        this._compileChildren(node, frame);
    },

    compileLiteral: function(node, frame) {
        if(typeof node.value == "string") {
            var val = node.value.replace(/\\/g, '\\\\');
            val = val.replace(/"/g, '\\"');
            val = val.replace(/\n/g, "\\n");
            val = val.replace(/\r/g, "\\r");
            val = val.replace(/\t/g, "\\t");
            this.emit('"' + val  + '"');
        }
        else {
            this.emit(node.value.toString());
        }
    },

    compileSymbol: function(node, frame) {
        var name = node.value;
        var v;

        if((v = frame.lookup(name))) {
            this.emit(v);
        }
        else {
            this.emit('runtime.contextOrFrameLookup(' +
                      'context, frame, "' + name + '")');
        }
    },

    compileGroup: function(node, frame) {
        this._compileAggregate(node, frame, '(', ')');
    },

    compileArray: function(node, frame) {
        this._compileAggregate(node, frame, '[', ']');
    },

    compileDict: function(node, frame) {
        this._compileAggregate(node, frame, '{', '}');
    },

    compilePair: function(node, frame) {
        var key = node.key;
        var val = node.value;

        if(key instanceof nodes.Symbol) {
            key = new nodes.Literal(key.lineno, key.colno, key.value);
        }
        else if(!(key instanceof nodes.Literal &&
                  typeof key.value == "string")) {
            this.fail("compilePair: Dict keys must be strings or names",
                      key.lineno,
                      key.colno);
        }

        this.compile(key, frame);
        this.emit(': ');
        this._compileExpression(val, frame);
    },

    compileInlineIf: function(node, frame) {
        this.emit('(');
        this.compile(node.cond, frame);
        this.emit('?');
        this.compile(node.body, frame);
        this.emit(':');
        if(node.else_ !== null)
            this.compile(node.else_, frame);
        else
            this.emit('""');
        this.emit(')');
    },

    compileOr: binOpEmitter(' || '),
    compileAnd: binOpEmitter(' && '),
    compileAdd: binOpEmitter(' + '),
    compileSub: binOpEmitter(' - '),
    compileMul: binOpEmitter(' * '),
    compileDiv: binOpEmitter(' / '),
    compileMod: binOpEmitter(' % '),

    compileNot: function(node, frame) {
        this.emit('!');
        this.compile(node.target, frame);
    },

    compileFloorDiv: function(node, frame) {
        this.emit('Math.floor(');
        this.compile(node.left, frame);
        this.emit(' / ');
        this.compile(node.right, frame);
        this.emit(')');
    },

    compilePow: function(node, frame) {
        this.emit('Math.pow(');
        this.compile(node.left, frame);
        this.emit(', ');
        this.compile(node.right, frame);
        this.emit(')');
    },

    compileNeg: function(node, frame) {
        this.emit('-');
        this.compile(node.target, frame);
    },

    compilePos: function(node, frame) {
        this.emit('+');
        this.compile(node.target, frame);
    },

    compileCompare: function(node, frame) {
        this.compile(node.expr, frame);

        for(var i=0; i<node.ops.length; i++) {
            var n = node.ops[i];
            this.emit(' ' + compareOps[n.type] + ' ');
            this.compile(n.expr, frame);
        }
    },

    compileLookupVal: function(node, frame) {
        this.emit('runtime.memberLookup((');
        this._compileExpression(node.target, frame);
        this.emit('),');
        this._compileExpression(node.val, frame);
        this.emit(', env.autoesc)');
    },

    _getNodeName: function(node) {
        switch (node.typename) {
            case 'Symbol':
                return node.value;
            case 'FunCall':
                return 'the return value of (' + this._getNodeName(node.name) + ')';
            case 'LookupVal':
                return this._getNodeName(node.target) + '["' +
                       this._getNodeName(node.val) + '"]';
            case 'Literal':
                return node.value.toString().substr(0, 10);
            default:
                return '--expression--';
        }
    },

    compileFunCall: function(node, frame) {
        // Keep track of line/col info at runtime by settings
        // variables within an expression. An expression in javascript
        // like (x, y, z) returns the last value, and x and y can be
        // anything
        this.emit('(lineno = ' + node.lineno +
                  ', colno = ' + node.colno + ', ');

        this.emit('runtime.callWrap(');
        // Compile it as normal.
        this._compileExpression(node.name, frame);

        // Output the name of what we're calling so we can get friendly errors
        // if the lookup fails.
        this.emit(', "' + this._getNodeName(node.name).replace(/"/g, '\\"') + '", ');

        this._compileAggregate(node.args, frame, '[', '])');

        this.emit(')');
    },

    compileFilter: function(node, frame) {
        var name = node.name;
        this.assertType(name, nodes.Symbol);

        this.emit('env.getFilter("' + name.value + '").call(context, ');
        this._compileAggregate(node.args, frame);
        this.emit(')');
    },

    compileFilterAsync: function(node, frame) {
        var name = node.name;
        this.assertType(name, nodes.Symbol);

        var symbol = node.symbol.value;
        frame.set(symbol, symbol);

        this.emit('env.getFilter("' + name.value + '").call(context, ');
        this._compileAggregate(node.args, frame);
        this.emitLine(', ' + this.makeCallback(symbol));

        this.addScopeLevel();
    },

    compileKeywordArgs: function(node, frame) {
        var names = [];

        lib.each(node.children, function(pair) {
            names.push(pair.key.value);
        });

        this.emit('runtime.makeKeywordArgs(');
        this.compileDict(node, frame);
        this.emit(')');
    },

    compileSet: function(node, frame) {
        var ids = [];

        // Lookup the variable names for each identifier and create
        // new ones if necessary
        lib.each(node.targets, function(target) {
            var name = target.value;
            var id = frame.get(name);

            if (id === null) {
                id = this.tmpid();

                // Note: This relies on js allowing scope across
                // blocks, in case this is created inside an `if`
                this.emitLine('var ' + id + ';');
            }

            ids.push(id);
        }, this);

        this.emit(ids.join(' = ') + ' = ');
        this._compileExpression(node.value, frame);
        this.emitLine(';');

        lib.each(node.targets, function(target, i) {
            var id = ids[i];
            var name = target.value;

            this.emitLine('frame.set("' + name + '", ' + id + ');');
            if (frame.get(name) === null) {
                frame.set(name, id);
            }

            // We are running this for every var, but it's very
            // uncommon to assign to multiple vars anyway
            this.emitLine('if(!frame.parent) {');
            this.emitLine('context.setVariable("' + name + '", ' + id + ');');
            if(name.charAt(0) != '_') {
                this.emitLine('context.addExport("' + name + '");');
            }
            this.emitLine('}');
        }, this);
    },

    compileIf: function(node, frame, async) {
        this.emit('if(');
        this._compileExpression(node.cond, frame);
        this.emitLine(') {');

        this.withScopedSyntax(function() {
            this.compile(node.body, frame);

            if(async) {
                this.emit('cb()');
            }
        });

        if(node.else_) {
            this.emitLine('}\nelse {');

            this.withScopedSyntax(function() {
                this.compile(node.else_, frame);

                if(async) {
                    this.emit('cb()');
                }
            });
        }

        this.emitLine('}');
    },

    compileIfAsync: function(node, frame) {
        this.emit('(function(cb) {');
        this.compileIf(node, frame, true);
        this.emit('})(function() {');
        this.addScopeLevel();
    },

    scanLoop: function(node) {
        var loopUses = {};

        node.iterFields(function(field) {
            var lookups = field.findAll(nodes.LookupVal);

            lib.each(lookups, function(lookup) {
                if (lookup.target instanceof nodes.Symbol &&
                    lookup.target.value == 'loop' &&
                    lookup.val instanceof nodes.Literal) {
                    loopUses[lookup.val.value] = true;
                }
            });
        });

        return loopUses;
    },

    emitLoopBindings: function(node, loopUses, arr, i, len) {
        len = len || arr + '.length';

        var bindings = {
            index: i + ' + 1',
            index0: i,
            revindex: len + ' - ' + i,
            revindex0: len + ' - ' + i + ' - 1',
            first: i + ' === 0',
            last: i + ' === ' + len + ' - 1',
            length: len
        };

        for(var name in bindings) {
            if(name in loopUses) {
                this.emitLine('frame.set("loop.' + name + '", ' + bindings[name] + ');');
            }
        }
    },

    compileFor: function(node, frame) {
        // Some of this code is ugly, but it keeps the generated code
        // as fast as possible. ForAsync also shares some of this, but
        // not much.

        var i = this.tmpid();
        var len = this.tmpid();
        var arr = this.tmpid();
        var loopUses = this.scanLoop(node);
        frame = frame.push();

        this.emitLine('frame = frame.push();');

        this.emit('var ' + arr + ' = ');
        this._compileExpression(node.arr, frame);
        this.emitLine(';');

        this.emit('if(' + arr + ') {');

        // If multiple names are passed, we need to bind them
        // appropriately
        if(node.name instanceof nodes.Array) {
            this.emitLine('var ' + i + ';');

            // The object could be an arroy or object. Note that the
            // body of the loop is duplicated for each condition, but
            // we are optimizing for speed over size.
            this.emitLine('if(runtime.isArray(' + arr + ')) {'); {
                this.emitLine('for(' + i + '=0; ' + i + ' < ' + arr + '.length; '
                              + i + '++) {');

                // Bind each declared var
                for (var u=0; u < node.name.children.length; u++) {
                    var tid = this.tmpid();
                    this.emitLine('var ' + tid + ' = ' + arr + '[' + i + '][' + u + ']');
                    this.emitLine('frame.set("' + node.name.children[u].value
                                  + '", ' + arr + '[' + i + '][' + u + ']' + ');');
                    frame.set(node.name.children[u].value, tid);
                }

                this.emitLoopBindings(node, loopUses, arr, i);
                this.compile(node.body, frame);
                this.emitLine('}');
            }

            this.emitLine('} else {'); {
                // Iterate over the key/values of an object
                var key = node.name.children[0];
                var val = node.name.children[1];
                var k = this.tmpid();
                var v = this.tmpid();
                frame.set(key.value, k);
                frame.set(val.value, v);

                this.emitLine(i + ' = -1;');

                if(loopUses['revindex'] || loopUses['revindex0'] ||
                   loopUses['last'] || loopUses['length']) {
                    this.emitLine('var ' + len + ' = runtime.keys(' + arr + ').length;');
                }

                this.emitLine('for(var ' + k + ' in ' + arr + ') {');
                this.emitLine(i + '++;');
                this.emitLine('var ' + v + ' = ' + arr + '[' + k + '];');
                this.emitLine('frame.set("' + key.value + '", ' + k + ');');
                this.emitLine('frame.set("' + val.value + '", ' + v + ');');

                this.emitLoopBindings(node, loopUses, arr, i, len);
                this.compile(node.body, frame);
                this.emitLine('}');
            }

            this.emitLine('}');
        }
        else {
            // Generate a typical array iteration
            var v = this.tmpid();
            frame.set(node.name.value, v);

            this.emitLine('for(var ' + i + '=0; ' + i + ' < ' + arr + '.length; ' +
                          i + '++) {');
            this.emitLine('var ' + v + ' = ' + arr + '[' + i + '];');
            this.emitLine('frame.set("' + node.name.value + '", ' + v + ');');

            this.emitLoopBindings(node, loopUses, arr, i);

            this.withScopedSyntax(function() {
                this.compile(node.body, frame);
            });

            this.emitLine('}');
        }

        this.emitLine('}');
        this.emitLine('frame = frame.pop();');
    },

    _compileAsyncLoop: function(node, frame, parallel) {
        // This shares some code with the For tag, but not enough to
        // worry about. This iterates across an object asynchronously,
        // but not in parallel.

        var i = this.tmpid();
        var len = this.tmpid();
        var arr = this.tmpid();
        var loopUses = this.scanLoop(node);
        var asyncMethod = parallel ? 'asyncAll' : 'asyncEach';
        frame = frame.push();

        this.emitLine('frame = frame.push();');

        this.emit('var ' + arr + ' = ');
        this._compileExpression(node.arr, frame);
        this.emitLine(';');

        if(node.name instanceof nodes.Array) {
            this.emit('runtime.' + asyncMethod + '(' + arr + ', ' +
                      node.name.children.length + ', function(');

            lib.each(node.name.children, function(name) {
                this.emit(name.value + ',');
            }, this);

            this.emit(i + ',' + len + ',next) {');

            lib.each(node.name.children, function(name) {
                var id = name.value;
                frame.set(id, id);
                this.emitLine('frame.set("' + id + '", ' + id + ');');
            }, this);
        }
        else {
            var id = node.name.value;
            this.emitLine('runtime.' + asyncMethod + '(' + arr + ', 1, function(' + id + ', ' + i + ', ' + len + ',next) {');
            this.emitLine('frame.set("' + id + '", ' + id + ');');
            frame.set(id, id);
        }

        this.emitLoopBindings(node, loopUses, arr, i, len);

        this.withScopedSyntax(function() {
            var buf;
            if(parallel) {
                buf = this.tmpid();
                this.pushBufferId(buf);
            }

            this.compile(node.body, frame);
            this.emitLine('next(' + i + (buf ? ',' + buf : '') + ');');

            if(parallel) {
                this.popBufferId();
            }
        });

        var output = this.tmpid();
        this.emitLine('}, ' + this.makeCallback(output));
        this.addScopeLevel();

        if(parallel) {
            this.emitLine(this.buffer + ' += ' + output + ';');
        }

        this.emitLine('frame = frame.pop();');
    },

    compileAsyncEach: function(node, frame) {
        this._compileAsyncLoop(node, frame);
    },

    compileAsyncAll: function(node, frame) {
        this._compileAsyncLoop(node, frame, true);
    },

    _emitMacroBegin: function(node, frame) {
        var args = [];
        var kwargs = null;
        var funcId = 'macro_' + this.tmpid();

        // Type check the definition of the args
        lib.each(node.args.children, function(arg, i) {
            if(i === node.args.children.length - 1 &&
               arg instanceof nodes.Dict) {
                kwargs = arg;
            }
            else {
                this.assertType(arg, nodes.Symbol);
                args.push(arg);
            }
        }, this);

        var realNames = lib.map(args, function(n) { return 'l_' + n.value; });
        realNames.push('kwargs');

        // Quoted argument names
        var argNames = lib.map(args, function(n) { return '"' + n.value + '"'; });
        var kwargNames = lib.map((kwargs && kwargs.children) || [],
                                 function(n) { return '"' + n.key.value + '"'; });

        // We pass a function to makeMacro which destructures the
        // arguments so support setting positional args with keywords
        // args and passing keyword args as positional args
        // (essentially default values). See runtime.js.
        this.emitLines(
            'var ' + funcId + ' = runtime.makeMacro(',
            '[' + argNames.join(', ') + '], ',
            '[' + kwargNames.join(', ') + '], ',
            'function (' + realNames.join(', ') + ') {',
            'frame = frame.push();',
            'kwargs = kwargs || {};'
        );

        // Expose the arguments to the template. Don't need to use
        // random names because the function
        // will create a new run-time scope for us
        lib.each(args, function(arg) {
            this.emitLine('frame.set("' + arg.value + '", ' +
                          'l_' + arg.value + ');');
            frame.set(arg.value, 'l_' + arg.value);
        }, this);

        // Expose the keyword arguments
        if(kwargs) {
            lib.each(kwargs.children, function(pair) {
                var name = pair.key.value;
                this.emit('frame.set("' + name + '", ' +
                          'kwargs.hasOwnProperty("' + name + '") ? ' +
                          'kwargs["' + name + '"] : ');
                this._compileExpression(pair.value, frame);
                this.emitLine(');');
            }, this);
        }

        return funcId;
    },

    _emitMacroEnd: function() {
        this.emitLine('frame = frame.pop();');
        this.emitLine('return new runtime.SafeString(' + this.buffer + ');');
        this.emitLine('});');
    },

    compileMacro: function(node, frame) {
        frame = frame.push();
        var funcId = this._emitMacroBegin(node, frame);

        // Start a new output buffer, and set the old one back after
        // we're done
        var prevBuffer = this.buffer;
        this.buffer = 'output';
        this.emitLine('var ' + this.buffer + '= "";');

        this.compile(node.body, frame);

        this._emitMacroEnd();
        this.buffer = prevBuffer;

        // Expose the macro to the templates
        var name = node.name.value;
        frame = frame.pop();
        frame.set(name, funcId);

        if(frame.parent) {
            this.emitLine('frame.set("' + name + '", ' + funcId + ');');
        }
        else {
            if(node.name.value.charAt(0) != '_') {
                this.emitLine('context.addExport("' + name + '");');
            }
            this.emitLine('context.setVariable("' + name + '", ' + funcId + ');');
        }
    },

    compileImport: function(node, frame) {
        var id = this.tmpid();
        var target = node.target.value;

        this.emit('env.getTemplate(');
        this._compileExpression(node.template, frame);
        this.emitLine(', ' + this.makeCallback(id));
        this.addScopeLevel();

        this.emitLine(id + '.getExported(' + this.makeCallback(id));
        this.addScopeLevel();

        frame.set(target, id);

        if(frame.parent) {
            this.emitLine('frame.set("' + target + '", ' + id + ');');
        }
        else {
            this.emitLine('context.setVariable("' + target + '", ' + id + ');');
        }
    },

    compileFromImport: function(node, frame) {
        var importedId = this.tmpid();

        this.emit('env.getTemplate(');
        this._compileExpression(node.template, frame);
        this.emitLine(', ' + this.makeCallback(importedId));
        this.addScopeLevel();

        this.emitLine(importedId + '.getExported(' + this.makeCallback(importedId));
        this.addScopeLevel();

        lib.each(node.names.children, function(nameNode) {
            var name;
            var alias;
            var id = this.tmpid();

            if(nameNode instanceof nodes.Pair) {
                name = nameNode.key.value;
                alias = nameNode.value.value;
            }
            else {
                name = nameNode.value;
                alias = name;
            }

            this.emitLine('if(' + importedId + '.hasOwnProperty("' + name + '")) {');
            this.emitLine('var ' + id + ' = ' + importedId + '.' + name + ';');
            this.emitLine('} else {');
            this.emitLine('cb(new Error("cannot import \'' + name + '\'")); return;');
            this.emitLine('}');

            frame.set(alias, id);

            if(frame.parent) {
                this.emitLine('frame.set("' + alias + '", ' + id + ');');
            }
            else {
                this.emitLine('context.setVariable("' + alias + '", ' + id + ');');
            }
        }, this);
    },

    compileBlock: function(node, frame) {
        if(!this.isChild) {
            var id = this.tmpid();

            this.emitLine('context.getBlock("' + node.name.value + '")' +
                          '(env, context, frame, runtime, ' + this.makeCallback(id));
            this.emitLine(this.buffer + ' += ' + id + ';');
            this.addScopeLevel();
        }
    },

    compileSuper: function(node, frame) {
        var name = node.blockName.value;
        var id = node.symbol.value;

        this.emitLine('context.getSuper(env, ' +
                      '"' + name + '", ' +
                      'b_' + name + ', ' +
                      'frame, runtime, '+
                      this.makeCallback(id));
        this.emitLine(id + ' = runtime.markSafe(' + id + ');');
        this.addScopeLevel();
        frame.set(id, id);
    },

    compileExtends: function(node, frame) {
        if(this.isChild) {
            this.fail('compileExtends: cannot extend multiple times',
                      node.template.lineno,
                      node.template.colno);
        }

        var k = this.tmpid();

        this.emit('env.getTemplate(');
        this._compileExpression(node.template, frame);
        this.emitLine(', true, ' + this.makeCallback('parentTemplate'));

        this.emitLine('for(var ' + k + ' in parentTemplate.blocks) {');
        this.emitLine('context.addBlock(' + k +
                      ', parentTemplate.blocks[' + k + ']);');
        this.emitLine('}');

        this.addScopeLevel();
        this.isChild = true;
    },

    compileInclude: function(node, frame) {
        var id = this.tmpid();
        var id2 = this.tmpid();

        this.emit('env.getTemplate(');
        this._compileExpression(node.template, frame);
        this.emitLine(', ' + this.makeCallback(id));
        this.addScopeLevel();

        this.emitLine(id + '.render(' +
                      'context.getVariables(), frame.push(), ' + this.makeCallback(id2));
        this.emitLine(this.buffer + ' += ' + id2);
        this.addScopeLevel();
    },

    compileTemplateData: function(node, frame) {
        this.compileLiteral(node, frame);
    },

    compileOutput: function(node, frame) {
        var children = node.children;
        for(var i=0, l=children.length; i<l; i++) {
            // TemplateData is a special case because it is never
            // autoescaped, so simply output it for optimization
            if(children[i] instanceof nodes.TemplateData) {
                if(children[i].value) {
                    this.emit(this.buffer + ' += ');
                    this.compileLiteral(children[i], frame);
                    this.emitLine(';');
                }
            }
            else {
                this.emit(this.buffer + ' += runtime.suppressValue(');
                this.compile(children[i], frame);
                this.emit(', env.autoesc);\n');
            }
        }
    },

    compileRoot: function(node, frame) {
        if(frame) {
            this.fail("compileRoot: root node can't have frame");
        }

        frame = new Frame();

        this.emitFuncBegin('root');
        this._compileChildren(node, frame);
        if(this.isChild) {
            this.emitLine('parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);');
        }
        this.emitFuncEnd(this.isChild);

        // When compiling the blocks, they should all act as top-level code
        this.isChild = false;

        var blocks = node.findAll(nodes.Block);
        for(var i=0; i<blocks.length; i++) {
            var block = blocks[i];
            var name = block.name.value;

            this.emitFuncBegin('b_' + name);

            var tmpFrame = new Frame();
            this.compile(block.body, tmpFrame);
            this.emitFuncEnd();
        }

        this.emitLine('return {');
        for(var i=0; i<blocks.length; i++) {
            var block = blocks[i];
            var name = 'b_' + block.name.value;
            this.emitLine(name + ': ' + name + ',');
        }
        this.emitLine('root: root\n};');
    },

    compile: function (node, frame) {
        var _compile = this["compile" + node.typename];
        if(_compile) {
            _compile.call(this, node, frame);
        }
        else {
            this.fail("compile: Cannot compile node: " + node.typename,
                      node.lineno,
                      node.colno);
        }
    },

    getCode: function() {
        return this.codebuf.join('');
    }
});

// var c = new Compiler();
// var src = 'hello {% foo %}bar{% endfoo %} end';
// var ast = transformer.transform(parser.parse(src));
// nodes.printNodes(ast);
// c.compile(ast);
// var tmpl = c.getCode();
// console.log(tmpl);

modules['compiler'] = {
    compile: function(src, asyncFilters, extensions, name) {
        var c = new Compiler();

        // Run the extension preprocessors against the source.
        if(extensions && extensions.length) {
            for(var i=0; i<extensions.length; i++) {
                if('preprocess' in extensions[i]) {
                    src = extensions[i].preprocess(src, name);
                }
            }
        }

        c.compile(transformer.transform(parser.parse(src, extensions),
                                        asyncFilters,
                                        name));
        return c.getCode();
    },

    Compiler: Compiler
};
})();
(function() {

var lib = modules["lib"];
var r = modules["runtime"];

var filters = {
    abs: function(n) {
        return Math.abs(n);
    },

    batch: function(arr, linecount, fill_with) {
        var res = [];
        var tmp = [];

        for(var i=0; i<arr.length; i++) {
            if(i % linecount === 0 && tmp.length) {
                res.push(tmp);
                tmp = [];
            }

            tmp.push(arr[i]);
        }

        if(tmp.length) {
            if(fill_with) {
                for(var i=tmp.length; i<linecount; i++) {
                    tmp.push(fill_with);
                }
            }

            res.push(tmp);
        }

        return res;
    },

    capitalize: function(str) {
        var ret = str.toLowerCase();
        return r.copySafeness(str, ret.charAt(0).toUpperCase() + ret.slice(1));
    },

    center: function(str, width) {
        width = width || 80;

        if(str.length >= width) {
            return str;
        }

        var spaces = width - str.length;
        var pre = lib.repeat(" ", spaces/2 - spaces % 2);
        var post = lib.repeat(" ", spaces/2);
        return r.copySafeness(str, pre + str + post);
    },

    'default': function(val, def) {
        return val ? val : def;
    },

    dictsort: function(val, case_sensitive, by) {
        if (!lib.isObject(val)) {
            throw new lib.TemplateError("dictsort filter: val must be an object");
        }

        var array = [];
        for (var k in val) {
            // deliberately include properties from the object's prototype
            array.push([k,val[k]]);
        }

        var si;
        if (by === undefined || by === "key") {
            si = 0;
        } else if (by === "value") {
            si = 1;
        } else {
            throw new lib.TemplateError(
                "dictsort filter: You can only sort by either key or value");
        }

        array.sort(function(t1, t2) {
            var a = t1[si];
            var b = t2[si];

            if (!case_sensitive) {
                if (lib.isString(a)) {
                    a = a.toUpperCase();
                }
                if (lib.isString(b)) {
                    b = b.toUpperCase();
                }
            }

            return a > b ? 1 : (a == b ? 0 : -1);
        });

        return array;
    },

    escape: function(str) {
        if(typeof str == 'string' ||
           str instanceof r.SafeString) {
            return lib.escape(str);
        }
        return str;
    },

    safe: function(str) {
        return r.markSafe(str);
    },

    first: function(arr) {
        return arr[0];
    },

    groupby: function(arr, attr) {
        return lib.groupBy(arr, attr);
    },

    indent: function(str, width, indentfirst) {
        width = width || 4;
        var res = '';
        var lines = str.split('\n');
        var sp = lib.repeat(' ', width);

        for(var i=0; i<lines.length; i++) {
            if(i == 0 && !indentfirst) {
                res += lines[i] + '\n';
            }
            else {
                res += sp + lines[i] + '\n';
            }
        }

        return r.copySafeness(str, res);
    },

    join: function(arr, del, attr) {
        del = del || '';

        if(attr) {
            arr = lib.map(arr, function(v) {
                return v[attr];
            });
        }

        return arr.join(del);
    },

    last: function(arr) {
        return arr[arr.length-1];
    },

    length: function(arr) {
        return arr.length;
    },

    list: function(val) {
        if(lib.isString(val)) {
            return val.split('');
        }
        else if(lib.isObject(val)) {
            var keys = [];

            if(Object.keys) {
                keys = Object.keys(val);
            }
            else {
                for(var k in val) {
                    keys.push(k);
                }
            }

            return lib.map(keys, function(k) {
                return { key: k,
                         value: val[k] };
            });
        }
        else {
            throw new lib.TemplateError("list filter: type not iterable");
        }
    },

    lower: function(str) {
        return str.toLowerCase();
    },

    random: function(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    },

    replace: function(str, old, new_, maxCount) {
        var res = str;
        var last = res;
        var count = 1;
        res = res.replace(old, new_);

        while(last != res) {
            if(count >= maxCount) {
                break;
            }

            last = res;
            res = res.replace(old, new_);
            count++;
        }

        return r.copySafeness(str, res);
    },

    reverse: function(val) {
        var arr;
        if(lib.isString(val)) {
            arr = filters.list(val);
        }
        else {
            // Copy it
            arr = lib.map(val, function(v) { return v; });
        }

        arr.reverse();

        if(lib.isString(val)) {
            return r.copySafeness(val, arr.join(''));
        }
        return arr;
    },

    round: function(val, precision, method) {
        precision = precision || 0;
        var factor = Math.pow(10, precision);
        var rounder;

        if(method == 'ceil') {
            rounder = Math.ceil;
        }
        else if(method == 'floor') {
            rounder = Math.floor;
        }
        else {
            rounder = Math.round;
        }

        return rounder(val * factor) / factor;
    },

    slice: function(arr, slices, fillWith) {
        var sliceLength = Math.floor(arr.length / slices);
        var extra = arr.length % slices;
        var offset = 0;
        var res = [];

        for(var i=0; i<slices; i++) {
            var start = offset + i * sliceLength;
            if(i < extra) {
                offset++;
            }
            var end = offset + (i + 1) * sliceLength;

            var slice = arr.slice(start, end);
            if(fillWith && i >= extra) {
                slice.push(fillWith);
            }
            res.push(slice);
        }

        return res;
    },

    sort: function(arr, reverse, caseSens, attr) {
        // Copy it
        arr = lib.map(arr, function(v) { return v; });

        arr.sort(function(a, b) {
            var x, y;

            if(attr) {
                x = a[attr];
                y = b[attr];
            }
            else {
                x = a;
                y = b;
            }

            if(!caseSens && lib.isString(x) && lib.isString(y)) {
                x = x.toLowerCase();
                y = y.toLowerCase();
            }

            if(x < y) {
                return reverse ? 1 : -1;
            }
            else if(x > y) {
                return reverse ? -1: 1;
            }
            else {
                return 0;
            }
        });

        return arr;
    },

    string: function(obj) {
        return r.copySafeness(obj, obj);
    },

    title: function(str) {
        var words = str.split(' ');
        for(var i = 0; i < words.length; i++) {
            words[i] = filters.capitalize(words[i]);
        }
        return r.copySafeness(str, words.join(' '));
    },

    trim: function(str) {
        return r.copySafeness(str, str.replace(/^\s*|\s*$/g, ''));
    },

    truncate: function(input, length, killwords, end) {
        var orig = input;
        length = length || 255;

        if (input.length <= length)
            return input;

        if (killwords) {
            input = input.substring(0, length);
        } else {
            var idx = input.lastIndexOf(' ', length);
            if(idx === -1) {
                idx = length;
            }

            input = input.substring(0, idx);
        }

        input += (end !== undefined && end !== null) ? end : '...';
        return r.copySafeness(orig, input);
    },

    upper: function(str) {
        return str.toUpperCase();
    },

    urlencode: function(obj) {
        var enc = encodeURIComponent;
        if (lib.isString(obj)) {
            return enc(obj);
        } else {
            var parts;
            if (lib.isArray(obj)) {
                parts = obj.map(function(item) {
                    return enc(item[0]) + '=' + enc(item[1]);
                })
            } else {
                parts = [];
                for (var k in obj) {
                    if (obj.hasOwnProperty(k)) {
                        parts.push(enc(k) + '=' + enc(obj[k]));
                    }
                }
            }
            return parts.join('&');
        }
    },

    wordcount: function(str) {
        return str.match(/\w+/g).length;
    },

    'float': function(val, def) {
        var res = parseFloat(val);
        return isNaN(res) ? def : res;
    },

    'int': function(val, def) {
        var res = parseInt(val, 10);
        return isNaN(res) ? def : res;
    }
};

// Aliases
filters.d = filters['default'];
filters.e = filters.escape;

modules['filters'] = filters;
})();
(function() {

function cycler(items) {
    var index = -1;
    var current = null;

    return {
        reset: function() {
            index = -1;
            current = null;
        },

        next: function() {
            index++;
            if(index >= items.length) {
                index = 0;
            }

            current = items[index];
            return current;
        }
    };

}

function joiner(sep) {
    sep = sep || ',';
    var first = true;

    return function() {
        var val = first ? '' : sep;
        first = false;
        return val;
    };
}

var globals = {
    range: function(start, stop, step) {
        if(!stop) {
            stop = start;
            start = 0;
            step = 1;
        }
        else if(!step) {
            step = 1;
        }

        var arr = [];
        for(var i=start; i<stop; i+=step) {
            arr.push(i);
        }
        return arr;
    },

    // lipsum: function(n, html, min, max) {
    // },

    cycler: function() {
        return cycler(Array.prototype.slice.call(arguments));
    },

    joiner: function(sep) {
        return joiner(sep);
    }
}

modules['globals'] = globals;
})();
(function() {
var Obj = modules["object"];
var lib = modules["lib"];

var Loader = Obj.extend({
    on: function(name, func) {
        this.listeners = this.listeners || {};
        this.listeners[name] = this.listeners[name] || [];
        this.listeners[name].push(func);
    },

    emit: function(name /*, arg1, arg2, ...*/) {
        var args = Array.prototype.slice.call(arguments, 1);

        if(this.listeners && this.listeners[name]) {
            lib.each(this.listeners[name], function(listener) {
                listener.apply(null, args);
            });
        }
    }
});

modules['loader'] = Loader;
})();
(function() {
var Loader = modules["loader"];

var WebLoader = Loader.extend({
    init: function(baseURL, neverUpdate) {
        // It's easy to use precompiled templates: just include them
        // before you configure nunjucks and this will automatically
        // pick it up and use it
        this.precompiled = window.nunjucksPrecompiled || {};

        this.baseURL = baseURL || '';
        this.neverUpdate = neverUpdate;
    },

    getSource: function(name) {
        if(this.precompiled[name]) {
            return {
                src: { type: "code",
                       obj: this.precompiled[name] },
                path: name
            };
        }
        else {
            var src = this.fetch(this.baseURL + '/' + name);
            if(!src) {
                return null;
            }

            return { src: src,
                     path: name,
                     noCache: this.neverUpdate };
        }
    },

    fetch: function(url, callback) {
        // Only in the browser please
        var ajax;
        var loading = true;
        var src;

        if(window.XMLHttpRequest) { // Mozilla, Safari, ...
            ajax = new XMLHttpRequest();
        }
        else if(window.ActiveXObject) { // IE 8 and older
            ajax = new ActiveXObject("Microsoft.XMLHTTP");
        }

        ajax.onreadystatechange = function() {
            if(ajax.readyState == 4 && ajax.status == 200 && loading) {
                loading = false;
                src = ajax.responseText;
            }
        };

        url += (url.indexOf('?') === -1 ? '?' : '&') + 's=' +
               (new Date().getTime());

        // Synchronous because this API shouldn't be used in
        // production (pre-load compiled templates instead)
        ajax.open('GET', url, false);
        ajax.send();

        return src;
    }
});

modules['web-loaders'] = {
    WebLoader: WebLoader
};
})();
(function() {
if(typeof window === 'undefined') {
    modules['loaders'] = modules["node-loaders"];
}
else {
    modules['loaders'] = modules["web-loaders"];
}
})();
(function() {
var lib = modules["lib"];
var Obj = modules["object"];
var lexer = modules["lexer"];
var compiler = modules["compiler"];
var builtin_filters = modules["filters"];
var builtin_loaders = modules["loaders"];
var runtime = modules["runtime"];
var globals = modules["globals"];
var Frame = runtime.Frame;

var Environment = Obj.extend({
    init: function(loaders, opts) {
        // The dev flag determines the trace that'll be shown on errors.
        // If set to true, returns the full trace from the error point,
        // otherwise will return trace starting from Template.render
        // (the full trace from within nunjucks may confuse developers using
        //  the library)
        // defaults to false
        opts = opts || {};
        this.dev = !!opts.dev;

        // The autoescape flag sets global autoescaping. If true,
        // every string variable will be escaped by default.
        // If false, strings can be manually escaped using the `escape` filter.
        // defaults to false
        this.autoesc = !!opts.autoescape;

        if(!loaders) {
            // The filesystem loader is only available client-side
            if(builtin_loaders.FileSystemLoader) {
                this.loaders = [new builtin_loaders.FileSystemLoader('views')];
            }
            else {
                this.loaders = [new builtin_loaders.WebLoader('/views')];
            }
        }
        else {
            this.loaders = lib.isArray(loaders) ? loaders : [loaders];
        }

        this.initCache();
        this.filters = {};
        this.asyncFilters = [];
        this.extensions = {};
        this.extensionsList = [];

        if(opts.tags) {
            lexer.setTags(opts.tags);
        }

        for(var name in builtin_filters) {
            this.addFilter(name, builtin_filters[name]);
        }
    },

    initCache: function() {
        // Caching and cache busting
        var cache = {};

        lib.each(this.loaders, function(loader) {
            loader.on('update', function(template) {
                cache[template] = null;
            });
        });

        this.cache = cache;
    },

    addExtension: function(name, extension) {
        extension._name = name;
        this.extensions[name] = extension;
        this.extensionsList.push(extension);
    },

    getExtension: function(name) {
        return this.extensions[name];
    },

    addFilter: function(name, func, async) {
        var wrapped = func;

        if(async) {
            this.asyncFilters.push(name);
        }
        this.filters[name] = wrapped;
    },

    getFilter: function(name) {
        if(!this.filters[name]) {
            throw new Error('filter not found: ' + name);
        }
        return this.filters[name];
    },

    getTemplate: function(name, eagerCompile, cb) {
        if(name && name.raw) {
            // this fixes autoescape for templates referenced in symbols
            name = name.raw;
        }

        if(lib.isFunction(eagerCompile)) {
            cb = eagerCompile;
            eagerCompile = false;
        }

        if(typeof name !== 'string') {
            throw new Error('template names must be a string: ' + name);
        }

        var tmpl = this.cache[name];

        if(tmpl) {
            if(eagerCompile) {
                tmpl.compile();
            }

            if(cb) {
                cb(null, tmpl);
            }
            else {
                return tmpl;
            }
        } else {
            var syncResult;

            lib.asyncIter(this.loaders, function(loader, i, next, done) {
                function handle(src) {
                    if(src) {
                        done(src);
                    }
                    else {
                        next();
                    }
                }

                if(loader.async) {
                    loader.getSource(name, function(err, src) {
                        if(err) { throw err; }
                        handle(src);
                    });
                }
                else {
                    handle(loader.getSource(name));
                }
            }, function(info) {
                if(!info) {
                    var err = new Error('template not found: ' + name);
                    if(cb) {
                        cb(err);
                    }
                    else {
                        throw err;
                    }
                }
                else {
                    var tmpl = new Template(info.src, this,
                                            info.path, eagerCompile);

                    if(!info.noCache) {
                        this.cache[name] = tmpl;
                    }

                    if(cb) {
                        cb(null, tmpl);
                    }
                    else {
                        syncResult = tmpl;
                    }
                }
            }.bind(this));

            return syncResult;
        }
    },

    express: function(app) {
        var env = this;

        function NunjucksView(name, opts) {
            this.name = name;
            this.path = name;
        }

        NunjucksView.prototype.render = function(opts, cb) {
          env.render(this.name, opts, cb);
        };

        app.set('view', NunjucksView);
    },

    render: function(name, ctx, cb) {
        if(lib.isFunction(ctx)) {
            cb = ctx;
            ctx = null;
        }

        // We support a synchronous API to make it easier to migrate
        // existing code to async. This works because if you don't do
        // anything async work, the whole thing is actually run
        // synchronously.
        var syncResult = null;

        this.getTemplate(name, function(err, tmpl) {
            if(err && cb) {
                cb(err);
            }
            else if(err) {
                throw err;
            }
            else {
                tmpl.render(ctx, cb || function(err, res) {
                    if(err) { throw err; }
                    syncResult = res;
                });
            }
        });

        return syncResult;
    },

    renderString: function(src, ctx, cb) {
        var tmpl = new Template(src, this);
        return tmpl.render(ctx, cb);
    }
});

var Context = Obj.extend({
    init: function(ctx, blocks) {
        this.ctx = ctx;
        this.blocks = {};
        this.exported = [];

        for(var name in blocks) {
            this.addBlock(name, blocks[name]);
        }
    },

    lookup: function(name) {
        // This is one of the most called functions, so optimize for
        // the typical case where the name isn't in the globals
        if(name in globals && !(name in this.ctx)) {
            return globals[name];
        }
        else {
            return this.ctx[name];
        }
    },

    setVariable: function(name, val) {
        this.ctx[name] = val;
    },

    getVariables: function() {
        return this.ctx;
    },

    addBlock: function(name, block) {
        this.blocks[name] = this.blocks[name] || [];
        this.blocks[name].push(block);
    },

    getBlock: function(name) {
        if(!this.blocks[name]) {
            throw new Error('unknown block "' + name + '"');
        }

        return this.blocks[name][0];
    },

    getSuper: function(env, name, block, frame, runtime, cb) {
        var idx = (this.blocks[name] || []).indexOf(block);
        var blk = this.blocks[name][idx + 1];
        var context = this;

        if(idx == -1 || !blk) {
            throw new Error('no super block available for "' + name + '"');
        }

        blk(env, context, frame, runtime, cb);
    },

    addExport: function(name) {
        this.exported.push(name);
    },

    getExported: function() {
        var exported = {};
        for(var i=0; i<this.exported.length; i++) {
            var name = this.exported[i];
            exported[name] = this.ctx[name];
        }
        return exported;
    }
});

var Template = Obj.extend({
    init: function (src, env, path, eagerCompile) {
        this.env = env || new Environment();

        if(lib.isObject(src)) {
            switch(src.type) {
            case 'code': this.tmplProps = src.obj; break;
            case 'string': this.tmplStr = src.obj; break;
            }
        }
        else if(lib.isString(src)) {
            this.tmplStr = src;
        }
        else {
            throw new Error("src must be a string or an object describing " +
                            "the source");
        }

        this.path = path;

        if(eagerCompile) {
            lib.withPrettyErrors(this.path,
                                 this.env.dev,
                                 this._compile.bind(this));
        }
        else {
            this.compiled = false;
        }
    },

    render: function(ctx, frame, cb) {
        if (typeof ctx === 'function') {
            cb = ctx;
            ctx = {};
        }
        else if (typeof frame === 'function') {
            cb = frame;
            frame = null;
        }

        return lib.withPrettyErrors(this.path, this.env.dev, function() {
            this.compile();

            var context = new Context(ctx || {}, this.blocks);
            var syncResult = null;

            this.rootRenderFunc(this.env,
                                context,
                                frame || new Frame(),
                                runtime,
                                cb || function(err, res) {
                                    if(err) { throw err; }
                                    syncResult = res;
                                });

            return syncResult;
        }.bind(this));
    },

    getExported: function(cb) {
        this.compile();

        // Run the rootRenderFunc to populate the context with exported vars
        var context = new Context({}, this.blocks);
        this.rootRenderFunc(this.env,
                            context,
                            new Frame(),
                            runtime,
                            function() {
                                cb(null, context.getExported());
                            });
    },

    compile: function() {
        if(!this.compiled) {
            this._compile();
        }
    },

    _compile: function() {
        var props;

        if(this.tmplProps) {
            props = this.tmplProps;
        }
        else {
            var source = compiler.compile(this.tmplStr,
                                          this.env.asyncFilters,
                                          this.env.extensionsList,
                                          this.path);
            var func = new Function(source);
            props = func();
        }

        this.blocks = this._getBlocks(props);
        this.rootRenderFunc = props.root;
        this.compiled = true;
    },

    _getBlocks: function(props) {
        var blocks = {};

        for(var k in props) {
            if(k.slice(0, 2) == 'b_') {
                blocks[k.slice(2)] = props[k];
            }
        }

        return blocks;
    }
});

// test code
// var src = 'hello {% foo baz | bar %}hi{% endfoo %} end';
// var env = new Environment(new builtin_loaders.FileSystemLoader('tests/templates', true), { dev: true });

// function FooExtension() {
//     this.tags = ['foo'];
//     this._name = 'FooExtension';

//     this.parse = function(parser, nodes) {
//         var tok = parser.nextToken();
//         var args = parser.parseSignature(null, true);
//         parser.advanceAfterBlockEnd(tok.value);

//         var body = parser.parseUntilBlocks('endfoo');
//         parser.advanceAfterBlockEnd();

//         return new nodes.CallExtensionAsync(this, 'run', args, [body]);
//     };

//     this.run = function(context, baz, body, cb) {
//         cb(null, baz + '--' + body());
//     };
// }

// env.addExtension('FooExtension', new FooExtension());
// env.addFilter('bar', function(val, cb) {
//     cb(null, val + '22222');
// }, true);

// var ctx = {};
// var tmpl = new Template(src, env, null, null, true);
// console.log("OUTPUT ---");

// tmpl.render(ctx, function(err, res) {
//     if(err) {
//         throw err;
//     }
//     console.log(res);
// });

modules['environment'] = {
    Environment: Environment,
    Template: Template
};
})();
var nunjucks;

var lib = modules["lib"];
var env = modules["environment"];
var compiler = modules["compiler"];
var parser = modules["parser"];
var lexer = modules["lexer"];
var runtime = modules["runtime"];
var Loader = modules["loader"];
var loaders = modules["loaders"];
var precompile = modules["precompile"];

nunjucks = {};
nunjucks.Environment = env.Environment;
nunjucks.Template = env.Template;

nunjucks.Loader = env.Loader;
nunjucks.FileSystemLoader = loaders.FileSystemLoader;
nunjucks.WebLoader = loaders.WebLoader;

nunjucks.compiler = compiler;
nunjucks.parser = parser;
nunjucks.lexer = lexer;
nunjucks.runtime = runtime;

// A single instance of an environment, since this is so commonly used

var e;
nunjucks.configure = function(templatesPath, opts) {
    opts = opts || {};
    if(lib.isObject(templatesPath)) {
        opts = templatesPath;
        templatesPath = null;
    }

    var loader = loaders.FileSystemLoader || loaders.WebLoader;
    e = new env.Environment(new loader(templatesPath, opts.watch), opts);

    if(opts && opts.express) {
        e.express(opts.express);
    }

    return e;
};

nunjucks.render = function(name, ctx, cb) {
    if(!e) {
        nunjucks.configure();
    }

    return e.render(name, ctx, cb);
};

nunjucks.renderString = function(src, ctx, cb) {
    if(!e) {
        nunjucks.configure();
    }

    return e.renderString(src, ctx, cb);
};

if(precompile) {
    nunjucks.precompile = precompile.precompile;
    nunjucks.precompileString = precompile.precompileString;
}

nunjucks.require = function(name) { return modules[name]; };

if(typeof define === 'function' && define.amd) {
    define(function() { return nunjucks; });
}
else {
    window.nunjucks = nunjucks;
}

})();
