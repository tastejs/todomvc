/*
**  ComponentJS -- Component System for JavaScript <http://componentjs.com>
**  Copyright (c) 2009-2013 Ralf S. Engelschall <http://engelschall.com>
**
**  This Source Code Form is subject to the terms of the Mozilla Public
**  License, v. 2.0. If a copy of the MPL was not distributed with this
**  file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

(function (GLOBAL, EXPORTS, DEFINE) {

    /*
    **  GLOBAL LIBRARY NAMESPACING
    */

    /*  internal API  */
    var _cs = function () {};

    /*  external API  */
    var $cs = function () {
        /*  under run-time just pass through to lookup functionality  */
        return _cs.hook("ComponentJS:lookup", "pass", _cs.lookup.apply(GLOBAL, arguments));
    };

    /*  pattern sub-namespace  */
    $cs.pattern = {};

    /*  top-level API method: change symbol of external API  */
    $cs.symbol = (function () {
        /*  internal state  */
        var value_original; value_original = undefined;
        var symbol_current = null;

        /*  top-level API method  */
        return function (symbol) {
            /*  release old occupation  */
            if (symbol_current !== null)
                GLOBAL[symbol_current] = value_original;

            /*  perform new occupation  */
            if (typeof symbol === "undefined" || symbol === "")
                /*  occupy no global slot at all  */
                symbol_current = null;
            else {
                /*  occupy new global slot  */
                symbol_current = symbol;
                value_original = GLOBAL[symbol_current];
                GLOBAL[symbol_current] = $cs;
            }

            /*  return the global API  */
            return $cs;
        };
    })();

    /*  top-level API method: create a global namespace
        and optionally assign a value to the leaf object  */
    $cs.ns = function (name, value) {
        /*  sanity check name argument  */
        if (typeof name !== "string" || name === "")
            throw "invalid namespace path";

        /*  determine path  */
        var path = name.split(".");
        var len = path.length;
        if (typeof value !== "undefined")
            len--;

        /*  iterate over the path and create missing objects  */
        var i = 0;
        var ctx = GLOBAL;
        while (i < len) {
            if (typeof ctx[path[i]] === "undefined")
                ctx[path[i]] = {};
            ctx = ctx[path[i++]];
        }

        /*  optionally assign a value to the leaf object  */
        if (typeof value !== "undefined") {
            ctx[path[i]] = value;
            ctx = value;
        }

        /*  return the leaf object  */
        return ctx;
    };

    /*  API version  */
    $cs.version = {
        major: 1,
        minor: 0,
        micro: 1,
        date:  20131009
    };


    /*
    **  COMMON UTILITY FUNCTIONALITIES
    */

    /*  utility function: create an exception string for throwing  */
    _cs.exception = function (method, error) {
        var trace;

        /*  optionally log stack trace to console  */
        if ($cs.debug() > 0) {
            if (typeof GLOBAL.console === "object") {
                if (typeof GLOBAL.console.trace === "function")
                    GLOBAL.console.trace();
                else if (   typeof GLOBAL.printStackTrace !== "undefined" &&
                            typeof GLOBAL.console.log === "function") {
                    trace = GLOBAL.printStackTrace();
                    GLOBAL.console.log(trace.join("\n"));
                }
            }
        }

        /*  return Error exception object  */
        return new Error("[ComponentJS]: ERROR: " + method + ": " + error);
    };

    /*  utility function: logging via environment console  */
    _cs.log = function (msg) {
        /*  try ComponentJS debugger  */
        if (_cs.hook("ComponentJS:log", "or", msg))
            {} /*  do nothing, as plugins have already logged the message  */

        /*  try Firebug-style console (in regular browser or Node)  */
        else if (   typeof GLOBAL.console     !== "undefined" &&
                    typeof GLOBAL.console.log !== "undefined")
            GLOBAL.console.log("[ComponentJS]: " + msg);

        /*  try API of Appcelerator Titanium  */
        else if (   typeof GLOBAL.Titanium         !== "undefined" &&
                    typeof GLOBAL.Titanium.API     !== "undefined" &&
                    typeof GLOBAL.Titanium.API.log === "function")
            GLOBAL.Titanium.API.log("[ComponentJS]: " + msg);
    };

    /*  utility function: debugging  */
    $cs.debug = (function () {
        var debug_level = 9;
        return function (level, msg) {
            if (arguments.length === 0)
                /*  return old debug level  */
                return debug_level;
            else if (arguments.length === 1)
                /*  configure new debug level  */
                debug_level = level;
            else {
                /*  perform runtime logging  */
                if (level <= debug_level) {
                    /*  determine indentation based on debug level  */
                    var indent = "";
                    for (var i = 1; i < level; i++)
                        indent += "    ";

                    /*  display debug message  */
                    _cs.log("DEBUG[" + level + "]: " + indent + msg);
                }
            }
        };
    })();

    /*  utility function: no operation (for passing as dummy callback)  */
    $cs.nop = function () {};

    /*  utility function: annotate an object  */
    _cs.annotation = function (obj, name, value) {
        var result = null;
        var __name__ = "__ComponentJS_" + name + "__";
        if (typeof obj !== "undefined" && obj !== null) {
            /*  get annotation value  */
            if (typeof obj[__name__] !== "undefined")
                result = obj[__name__];
            if (typeof value !== "undefined") {
                /*  set annotation value  */
                if (value !== null)
                    obj[__name__] = value;
                else
                    delete obj[__name__];
            }
        }
        return result;
    };

    /*  utility function: conveniently check for defined variable  */
    _cs.isdefined = function (obj) {
        return (typeof obj !== "undefined");
    };

    /*  utility function: check whether a field is directly owned by object
        (instead of implicitly resolved through the constructor's prototype object)  */
    _cs.isown = function (obj, field) {
        var isown = Object.hasOwnProperty.call(obj, field);
        if (field === "constructor" || field === "prototype") {
            isown = isown && Object.propertyIsEnumerable.call(obj, field);
            if (obj[field].toString().indexOf("[native code]") !== -1)
                isown = false;
        }
        return isown;
    };

    /*  utility function: determine type of anything,
        an improved version of the built-in "typeof" operator  */
    _cs.istypeof = function (obj) {
        var type = typeof obj;
        if (type === "object") {
            if (obj === null)
                /*  JavaScript nasty special case: null object  */
                type = "null";
            else if (Object.prototype.toString.call(obj) === "[object String]")
                /*  JavaScript nasty special case: String object  */
                type = "string";
            else if (Object.prototype.toString.call(obj) === "[object Number]")
                /*  JavaScript nasty special case: Number object  */
                type = "number";
            else if (Object.prototype.toString.call(obj) === "[object Boolean]")
                /*  JavaScript nasty special case: Boolean object  */
                type = "boolean";
            else if (Object.prototype.toString.call(obj) === "[object Function]")
                /*  JavaScript nasty special case: Function object  */
                type = "function";
            else if (Object.prototype.toString.call(obj) === "[object Array]")
                /*  JavaScript nasty special case: Array object  */
                type = "array";
            else if (_cs.annotation(obj, "type") !== null)
                /*  ComponentJS special case: "component"  */
                type = _cs.annotation(obj, "type");
        }
        else if (type === "function") {
            /*  ComponentJS special case: "{clazz,trait}"  */
            if (_cs.annotation(obj, "type") !== null)
                type = _cs.annotation(obj, "type");
        }
        return type;
    };

    /*  utility function: retrieve keys of object  */
    _cs.keysof = function (obj) {
        var keys = [];
        for (var key in obj) {
            if (obj.hasOwnProperty(key))
                keys.push(key);
        }
        return keys;
    };

    /*  utility function: JSON encoding of object  */
    _cs.json = (function () {
        var escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
        var meta = { "\b": "\\b", "\t": "\\t", "\n": "\\n", "\f": "\\f", "\r": "\\r", "\"": "\\\"", "\\": "\\\\" };
        var quote = function (string) {
            escapable.lastIndex = 0;
            return (
                escapable.test(string) ?
                  "\"" + string.replace(escapable, function (a) {
                      var c = meta[a];
                      return typeof c === "string" ?
                            c :
                            "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
                  }) + "\"" :
                  "\"" + string + "\""
            );
        };
        var encode = function (value, seen) {
            if (typeof value !== "boolean" && typeof value !== "number" && typeof value !== "string") {
                if (typeof seen[value] !== "undefined")
                    return "null /* CYCLE! */";
                else
                    seen[value] = true;
            }
            switch (typeof value) {
                case "boolean":  value = String(value); break;
                case "number":   value = (isFinite(value) ? String(value) : "NaN"); break;
                case "string":   value = quote(value); break;
                case "function":
                    if (_cs.annotation(value, "type") !== null)
                        value = "<" + _cs.annotation(value, "type") + ">";
                    else
                        value = "<function>";
                    break;
                case "object":
                    var a = [];
                    if (value === null)
                        value = "null";
                    else if (_cs.annotation(value, "type") !== null)
                        value = "<" + _cs.annotation(value, "type") + ">";
                    else if (Object.prototype.toString.call(value) === "[object Function]")
                        value = "<function>";
                    else if (   Object.prototype.toString.call(value) === "[object Array]" ||
                                value instanceof Array) {
                        for (var i = 0; i < value.length; i++)
                            a[i] = arguments.callee(value[i], seen); /* RECURSION */
                        value = (a.length === 0 ? "[]" : "[" + a.join(",") + "]");
                    }
                    else {
                        for (var k in value) {
                            if (Object.hasOwnProperty.call(value, k)) {
                                var v = arguments.callee(value[k], seen); /* RECURSION */
                                a.push(quote(k) + ":" + v);
                            }
                        }
                        value = (a.length === 0 ? "{}" : "{" + a.join(",") + "}");
                    }
                    break;
                default:
                    value = "<unknown>";
            }
            return value;
        };
        return function (value) {
            return encode(value, {});
        };
    })();

    /*  utility function: deep cloning of arbitrary data-structure  */
    _cs.clone = function (source, continue_recursion) {
        /*  allow recursive cloning to be controlled  */
        if (typeof continue_recursion === "undefined")
            continue_recursion = function (/* name, value */) { return true; };
        else if (typeof continue_recursion === "string") {
            var pattern = continue_recursion;
            continue_recursion = function (name /*, value */) { return name.match(pattern); };
        }

        /*  helper functions  */
        var myself = arguments.callee;
        var clone_func = function (f, continue_recursion) {
            var g = function ComponentJS_function_clone () {
                return f.apply(this, arguments);
            };
            g.prototype = f.prototype;
            for (var prop in f) {
                if (_cs.isown(f, prop)) {
                    if (continue_recursion(prop, f))
                        g[prop] = myself(f[prop], continue_recursion); /* RECURSION */
                    else
                        g[prop] = f[prop];
                }
            }
            _cs.annotation(g, "clone", true);
            return g;
        };

        var target; target = undefined;
        if (typeof source === "function")
            /*  special case: primitive function  */
            target = clone_func(source, continue_recursion);
        else if (typeof source === "object") {
            if (source === null)
                /*  special case: null object  */
                target = null;
            else if (Object.prototype.toString.call(source) === "[object String]")
                /*  special case: String object  */
                target = "" + source.valueOf();
            else if (Object.prototype.toString.call(source) === "[object Number]")
                /*  special case: Number object  */
                target = 0 + source.valueOf();
            else if (Object.prototype.toString.call(source) === "[object Boolean]")
                /*  special case: Boolean object  */
                target = !!source.valueOf();
            else if (Object.prototype.toString.call(source) === "[object Function]")
                /*  special case: Function object  */
                target = clone_func(source, continue_recursion);
            else if (Object.prototype.toString.call(source) === "[object Date]")
                /*  special case: Date object  */
                target = new Date(source.getTime());
            else if (Object.prototype.toString.call(source) === "[object RegExp]")
                /*  special case: RegExp object  */
                target = new RegExp(source.source);
            else if (Object.prototype.toString.call(source) === "[object Array]") {
                /*  special case: array object  */
                var len = source.length;
                target = [];
                for (var i = 0; i < len; i++)
                    target.push(myself(source[i], continue_recursion)); /* RECURSION */
            }
            else {
                /*  special case: hash object  */
                target = {};
                for (var key in source) {
                    if (key !== "constructor" && _cs.isown(source, key)) {
                        if (continue_recursion(key, source))
                            target[key] = myself(source[key], continue_recursion); /* RECURSION */
                        else
                            target[key] = source[key];
                    }
                }
                if (typeof source.constructor === "function")
                    target.constructor = source.constructor;
                if (typeof source.prototype === "object")
                    target.prototype = source.prototype;
            }
        }
        else
            /*  regular case: anything else
                (just primitive data types and undefined value)  */
            target = source;
        return target;
    };

    /*  utility function: extend an object with other object(s)  */
    _cs.extend = function (target, source, filter) {
        if (typeof filter === "undefined")
            filter = function (/* name, value */) { return true; };
        else if (typeof filter === "string") {
            var pattern = filter;
            filter = function (name /*, value */) { return name.match(pattern); };
        }
        for (var key in source)
            if (_cs.isown(source, key))
                if (filter(key, source[key]))
                    target[key] = source[key];
        return target;
    };

    /*  utility function: mixin objects into another object by chaining methods  */
    _cs.mixin = function (target, source, filter) {
        if (typeof filter === "undefined")
            filter = function (/* name, value */) { return true; };
        else if (typeof filter === "string") {
            var pattern = filter;
            filter = function (name /*, value */) { return name.match(pattern); };
        }
        for (var key in source) {
            if (_cs.isown(source, key)) {
                if (filter(key, source[key])) {
                    if (_cs.istypeof(source[key]) === "function") {
                        /*  method/function  */
                        var src = _cs.clone(source[key], filter);
                        _cs.annotation(src, "name", key);
                        if (   _cs.istypeof(target[key]) === "function" &&
                               _cs.isown(target, key)                  )
                            _cs.annotation(src, "base", target[key]);
                        target[key] = src;
                    }
                    else {
                        /*  property/field  */
                        target[key] = source[key];
                    }
                }
            }
        }
        return target;
    };

    /*  utility function: concatenate array values  */
    _cs.concat = function () {
        var target = [];
        for (var i = 0; i < arguments.length; i++) {
            var source = arguments[i];
            for (var j = 0; j < source.length; j++)
                target.push(source[j]);
        }
        return target;
    };

    /*  utility function: slice array values  */
    _cs.slice = function (source, start, len) {
        var target = [];
        if (typeof len === "undefined")
            len = source.length;
        for (var i = start; i < len; i++)
            target.push(source[i]);
        return target;
    };

    /*  utility function: map array values  */
    _cs.map = function (source, mapper) {
        var target = [];
        for (var i = 0; i < source.length; i++)
            target.push(mapper(source[i], i));
        return target;
    };

    /*  utility function: filter array values  */
    _cs.filter = function (source, filter) {
        var target = [];
        for (var i = 0; i < source.length; i++)
            if (filter(source[i], i))
                target.push(source[i]);
        return target;
    };

    /*  utility function: iterate over values  */
    _cs.foreach = function (source, callback) {
        for (var i = 0; i < source.length; i++)
            callback(source[i], i);
    };

    /*  custom Token class  */
    _cs.token = function () {
        this.text   = "";
        this.tokens = [];
        this.pos    = 0;
        this.len    = 0;
    };
    _cs.token.prototype = {
        /*  setter for plain-text input  */
        setText: function (text) {
            this.text = text;
        },

        /*  setter for additional token symbols  */
        addToken: function (b1, b2, e2, e1, symbol) {
            this.tokens.push({ b1: b1, b2: b2, e2: e2, e1: e1, symbol: symbol });
            this.len++;
        },

        /*  peek at the next token or token at particular offset  */
        peek: function (offset) {
            if (typeof offset === "undefined")
                offset = 0;
            if (offset >= this.len)
                throw new Error("parse error: not enough tokens");
            return this.tokens[this.pos + offset].symbol;
        },

        /*  skip one or more tokens  */
        skip: function (len) {
            if (typeof len === "undefined")
                len = 1;
            if (len > this.len)
                throw new Error("parse error: not enough tokens available to skip: " + this.ctx());
            this.pos += len;
            this.len -= len;
        },

        /*  consume the current token (by expecting it to be a particular symbol)  */
        consume: function (symbol) {
            if (this.len <= 0)
                throw new Error("parse error: no more tokens available to consume: " + this.ctx());
            if (this.tokens[this.pos].symbol !== symbol)
                throw new Error("parse error: expected token symbol \"" + symbol + "\": " + this.ctx());
            this.pos++;
            this.len--;
        },

        /*  return a textual description of the token parsing context  */
        ctx: function (width) {
            if (typeof width === "undefined")
                width = 78;
            var tok = this.tokens[this.pos];

            /*  the current token itself  */
            var ctx = "<" + this.text.substr(tok.b2, tok.e2 - tok.b2 + 1) + ">";
            ctx = this.text.substr(tok.b1, tok.b2 - tok.b1) + ctx;
            ctx = ctx + this.text.substr(tok.e2, tok.e1 - tok.e2);

            /*  the previous and following token(s)  */
            var k = (width - ctx.length);
            if (k > 0) {
                k = Math.floor(k / 2);
                var i, str;
                if (this.pos > 0) {
                    /*  previous token(s)  */
                    var k1 = 0;
                    for (i = this.pos - 1; i >= 0; i--) {
                        tok = this.tokens[i];
                        str = this.text.substr(tok.b1, tok.e1 - tok.b1 + 1);
                        k1 += str.length;
                        if (k1 > k)
                            break;
                        ctx = str + ctx;
                    }
                    if (i > 0)
                        ctx = "[...]" + ctx;
                }
                if (this.len > 1) {
                    /*  following token(s)  */
                    var k2 = 0;
                    for (i = this.pos + 1; i < this.pos + this.len; i++) {
                        tok = this.tokens[i];
                        str = this.text.substr(tok.b1, tok.e1 - tok.b1 + 1);
                        k2 += str.length;
                        if (k2 > k)
                            break;
                        ctx = ctx + str;
                    }
                    if (i < this.pos + this.len)
                        ctx = ctx + "[...]";
                }
            }

            /*  place everything on a single line through escape sequences  */
            ctx = ctx.replace(/\r/, "\\r")
                     .replace(/\n/, "\\n")
                     .replace(/\t/, "\\t");
            return ctx;
        }
    };

    /*  API function: validate an arbitrary value against a type specification  */
    $cs.validate = function (value, spec, non_cache) {
        /*  compile validation AST from specification
            or reuse cached pre-compiled validation AST  */
        var ast;
        if (!non_cache)
            ast = _cs.validate_cache[spec];
        if (typeof ast === "undefined")
            ast = _cs.validate_compile(spec);
        if (!non_cache)
            _cs.validate_cache[spec] = ast;

        /*  execute validation AST against the value  */
        return _cs.validate_executor.exec_spec(value, ast);
    };

    /*  the internal compile cache  */
    _cs.validate_cache = {};

    /*
     *  VALIDATION SPECIFICATION COMPILER
     */

    /*  compile validation specification into validation AST  */
    _cs.validate_compile = function (spec) {
        /*  tokenize the specification string into a token stream */
        var token = _cs.validate_tokenize(spec);

        /*  parse the token stream into an AST  */
        return _cs.validate_parser.parse_spec(token);
    };

    /*  tokenize the validation specification  */
    _cs.validate_tokenize = function (spec) {
        /*  create new Token abstraction  */
        var token = new _cs.token();
        token.setText(spec);

        /*  determine individual token symbols  */
        var m;
        var b = 0;
        while (spec !== "") {
            m = spec.match(/^(\s*)([^{}\[\]:,?*+()!|\s]+|[{}\[\]:,?*+()!|])(\s*)/);
            if (m === null)
                throw new Error("parse error: cannot further canonicalize: \"" + spec + "\"");
            token.addToken(
                b,
                b + m[1].length,
                b + m[1].length + m[2].length - 1,
                b + m[0].length - 1,
                m[2]
            );
            spec = spec.substr(m[0].length);
            b += m[0].length;
        }
        return token;
    };

    /*  parse specification  */
    _cs.validate_parser = {
        parse_spec: function (token) {
            if (token.len <= 0)
                return null;
            var ast;
            var symbol = token.peek();
            if (symbol === "!")
                ast = this.parse_not(token);
            else if (symbol === "(")
                ast = this.parse_group(token);
            else if (symbol === "{")
                ast = this.parse_hash(token);
            else if (symbol === "[")
                ast = this.parse_array(token);
            else if (symbol.match(/^(?:null|undefined|boolean|number|string|function|object)$/))
                ast = this.parse_primary(token);
            else if (symbol.match(/^(?:clazz|trait|component)$/))
                ast = this.parse_special(token);
            else if (symbol === "any")
                ast = this.parse_any(token);
            else if (symbol.match(/^[A-Z][_a-zA-Z$0-9]*$/))
                ast = this.parse_class(token);
            else
                throw new Error("parse error: invalid token symbol: \"" + token.ctx() + "\"");
            return ast;
        },

        /*  parse boolean "not" operation  */
        parse_not: function (token) {
            token.consume("!");
            var ast = this.parse_spec(token); /*  RECURSION  */
            ast = { type: "not", op: ast };
            return ast;
        },

        /*  parse group (for boolean "or" operation)  */
        parse_group: function (token) {
            token.consume("(");
            var ast = this.parse_spec(token);
            while (token.peek() === "|") {
                token.consume("|");
                var child = this.parse_spec(token); /*  RECURSION  */
                ast = { type: "or", op1: ast, op2: child };
            }
            token.consume(")");
            return ast;
        },

        /*  parse hash type specification  */
        parse_hash: function (token) {
            token.consume("{");
            var elements = [];
            while (token.peek() !== "}") {
                var key = this.parse_key(token);
                var arity = this.parse_arity(token, "?");
                token.consume(":");
                var spec = this.parse_spec(token);  /*  RECURSION  */
                elements.push({ type: "element", key: key, arity: arity, element: spec });
                if (token.peek() === ",")
                    token.skip();
                else
                    break;
            }
            var ast = { type: "hash", elements: elements };
            token.consume("}");
            return ast;
        },

        /*  parse array type specification  */
        parse_array: function (token) {
            token.consume("[");
            var elements = [];
            while (token.peek() !== "]") {
                var spec = this.parse_spec(token);  /*  RECURSION  */
                var arity = this.parse_arity(token, "?*+");
                elements.push({ type: "element", element: spec, arity: arity });
                if (token.peek() === ",")
                    token.skip();
                else
                    break;
            }
            var ast = { type: "array", elements: elements };
            token.consume("]");
            return ast;
        },

        /*  parse primary type specification  */
        parse_primary: function (token) {
            var primary = token.peek();
            if (!primary.match(/^(?:null|undefined|boolean|number|string|function|object)$/))
                throw new Error("parse error: invalid primary type \"" + primary + "\"");
            token.skip();
            return { type: "primary", name: primary };
        },

        /*  parse special ComponentJS type specification  */
        parse_special: function (token) {
            var special = token.peek();
            if (!special.match(/^(?:clazz|trait|component)$/))
                throw new Error("parse error: invalid special type \"" + special + "\"");
            token.skip();
            return { type: "special", name: special };
        },

        /*  parse special "any" type specification  */
        parse_any: function (token) {
            var any = token.peek();
            if (any !== "any")
                throw new Error("parse error: invalid any type \"" + any + "\"");
            token.skip();
            return { type: "any" };
        },

        /*  parse JavaScript class specification  */
        parse_class: function (token) {
            var clazz = token.peek();
            if (!clazz.match(/^[A-Z][_a-zA-Z$0-9]*$/))
                throw new Error("parse error: invalid class type \"" + clazz + "\"");
            token.skip();
            return { type: "class", name: clazz };
        },

        /*  parse arity specification  */
        parse_arity: function (token, charset) {
            var arity = [ 1, 1 ];
            if (   token.len >= 5 &&
                   token.peek(0) === "{" &&
                   token.peek(1).match(/^[0-9]+$/) &&
                   token.peek(2) === "," &&
                   token.peek(3).match(/^(?:[0-9]+|oo)$/) &&
                   token.peek(4) === "}"          ) {
                arity = [
                    parseInt(token.peek(1), 10),
                    (  token.peek(3) === "oo" ?
                       Number.MAX_VALUE :
                       parseInt(token.peek(3), 10))
                ];
                token.skip(5);
            }
            else if (
                   token.len >= 1 &&
                   token.peek().length === 1 &&
                   charset.indexOf(token.peek()) >= 0) {
                var c = token.peek();
                switch (c) {
                    case "?": arity = [ 0, 1 ];                break;
                    case "*": arity = [ 0, Number.MAX_VALUE ]; break;
                    case "+": arity = [ 1, Number.MAX_VALUE ]; break;
                }
                token.skip();
            }
            return arity;
        },

        /*  parse hash key specification  */
        parse_key: function (token) {
            var key = token.peek();
            if (!key.match(/^[_a-zA-Z$][_a-zA-Z$0-9]*$/))
                throw new Error("parse error: invalid key \"" + key + "\"");
            token.skip();
            return key;
        }
    };

    /*
     *  VALIDATION AST EXECUTOR
     */

    _cs.validate_executor = {
        /*  validate specification (top-level)  */
        exec_spec: function (value, node) {
            var valid = false;
            if (node !== null) {
                switch (node.type) {
                    case "not":     valid = this.exec_not    (value, node); break;
                    case "or":      valid = this.exec_or     (value, node); break;
                    case "hash":    valid = this.exec_hash   (value, node); break;
                    case "array":   valid = this.exec_array  (value, node); break;
                    case "primary": valid = this.exec_primary(value, node); break;
                    case "special": valid = this.exec_special(value, node); break;
                    case "class":   valid = this.exec_class  (value, node); break;
                    case "any":     valid = true;                           break;
                    default:
                        throw new Error("validation error: invalid validation AST: " +
                            "node has unknown type \"" + node.type + "\"");
                }
            }
            return valid;
        },

        /*  validate through boolean "not" operation  */
        exec_not: function (value, node) {
            return !this.exec_spec(value, node.op);  /*  RECURSION  */
        },

        /*  validate through boolean "or" operation  */
        exec_or: function (value, node) {
            return (
                   this.exec_spec(value, node.op1)  /*  RECURSION  */ ||
                   this.exec_spec(value, node.op2)  /*  RECURSION  */
            );
        },

        /*  validate hash type  */
        exec_hash: function (value, node) {
            var i, el;
            var valid = (typeof value === "object");
            var fields = {};
            if (valid) {
                /*  pass 1: ensure that all mandatory fields exist
                    and determine map of valid fields for pass 2  */
                for (i = 0; i < node.elements.length; i++) {
                    el = node.elements[i];
                    fields[el.key] = el.element;
                    if (el.arity[0] > 0 && typeof value[el.key] === "undefined") {
                        valid = false;
                        break;
                    }
                }
            }
            if (valid) {
                /*  pass 2: ensure that no unknown fields exist
                    and that all existing fields are valid  */
                for (var field in value) {
                    if (   !Object.hasOwnProperty.call(value, field) ||
                           !Object.propertyIsEnumerable.call(value, field) ||
                           (field === "constructor" || field === "prototype"))
                        continue;
                    if (   typeof fields[field] === "undefined" ||
                           !this.exec_spec(value[field], fields[field])) {  /*  RECURSION  */
                        valid = false;
                        break;
                    }
                }
            }
            return valid;
        },

        /*  validate array type  */
        exec_array: function (value, node) {
            var i, el;
            var valid = (typeof value === "object" && value instanceof Array);
            if (valid) {
                var pos = 0;
                for (i = 0; i < node.elements.length; i++) {
                    el = node.elements[i];
                    var found = 0;
                    while (found < el.arity[1] && pos < value.length) {
                        if (!this.exec_spec(value[pos], el.element))  /*  RECURSION  */
                            break;
                        found++;
                        pos++;
                    }
                    if (found < el.arity[0]) {
                        valid = false;
                        break;
                    }
                }
                if (pos < value.length)
                    valid = false;
            }
            return valid;
        },

        /*  validate standard JavaScript type  */
        exec_primary: function (value, node) {
            return (node.name === "null" && value === null) || (typeof value === node.name);
        },

        /*  validate custom JavaScript type  */
        exec_class: function (value, node) {
            /* jshint evil:true */
            return (   typeof value === "object" &&
                      (   Object.prototype.toString.call(value) === "[object " + node.name + "]") ||
                          eval("value instanceof " + node.name)                                  );
        },

        /*  validate special ComponentJS type  */
        exec_special: function (value, node) {
            var valid = false;
            if (typeof value === (node.name === "component" ? "object" : "function"))
                valid = (_cs.annotation(value, "type") === node.name);
            return valid;
        }
    };

    /*  utility function: flexible parameter handling  */
    $cs.params = function (func_name, func_args, spec) {
        /*  provide parameter processing hook  */
        _cs.hook("ComponentJS:params:" + func_name + ":enter", "none", { args: func_args, spec: spec });

        /*  start with a fresh parameter object  */
        var params = {};

        /*  1. determine number of total    positional parameters,
            2. determine number of required positional parameters,
            3. set default values  */
        var positional = 0;
        var required   = 0;
        var pos2name   = {};
        var name;
        for (name in spec) {
            if (_cs.isown(spec, name)) {
                /*  process parameter position  */
                if (typeof spec[name].pos !== "undefined") {
                    pos2name[spec[name].pos] = name;
                    if (typeof spec[name].pos === "number")
                        positional++;
                    if (typeof spec[name].req !== "undefined" && spec[name].req)
                        required++;
                }

                /*  process default value  */
                if (typeof spec[name].def !== "undefined")
                    params[name] = spec[name].def;
            }
        }

        /*  determine or at least guess whether we were called with
            positional or name-based parameters  */
        var name_based = false;
        if (   func_args.length === 1 &&
               _cs.istypeof(func_args[0]) === "object") {
            /*  ok, looks like a regular call like
                "foo({ foo: ..., bar: ...})"  */
            name_based = true;

            /*  ...but do not be mislead by a positional use like
                "foo(bar)" where "bar" is an arbitrary object!  */
            for (name in func_args[0]) {
                if (_cs.isown(func_args[0], name)) {
                    if (typeof spec[name] === "undefined")
                        name_based = false;
                }
            }
        }

        /*  common value validity checking  */
        var check_validity = function (func, name, value, valid) {
            if (typeof valid === "string") {
                if (!$cs.validate(value, valid))
                    throw _cs.exception(func, "value of parameter \"" + name + "\" not valid");
            }
            else if (typeof valid === "object" && valid instanceof RegExp) {
                if (!(typeof value === "string" && value.match(valid)))
                    throw _cs.exception(func, "value of parameter \"" + name + "\" not valid (regexp)");
            }
            else if (typeof valid === "function") {
                if (!valid(value))
                    throw _cs.exception(func, "value of parameter \"" + name + "\" not valid (callback)");
            }
        };

        /*  set actual values  */
        var i;
        var args;
        if (name_based) {
            /*  case 1: name-based parameter specification  */
            args = func_args[0];
            for (name in args) {
                if (_cs.isown(args, name)) {
                    if (typeof spec[name] === "undefined")
                        throw _cs.exception(func_name, "unknown parameter \"" + name + "\"");
                    check_validity(func_name, name, args[name], spec[name].valid);
                    params[name] = args[name];
                }
            }
            for (name in spec) {
                if (_cs.isown(spec, name)) {
                    if (   typeof spec[name].req !== "undefined" &&
                           spec[name].req &&
                           typeof args[name] === "undefined")
                        throw _cs.exception(func_name, "required parameter \"" + name + "\" missing");
                }
            }
        }
        else {
            /*  case 2: positional parameter specification  */
            if (func_args.length < required)
                throw _cs.exception(func_name, "invalid number of arguments " +
                    "(at least " + required + " required)");
            for (i = 0; i < positional && i < func_args.length; i++) {
                check_validity(func_name, pos2name[i], func_args[i], spec[pos2name[i]].valid);
                params[pos2name[i]] = func_args[i];
            }
            if (i < func_args.length) {
                if (typeof pos2name["..."] === "undefined")
                    throw _cs.exception(func_name, "too many arguments provided");
                args = [];
                for (; i < func_args.length; i++) {
                    check_validity(func_name, pos2name["..."], func_args[i], spec[pos2name["..."]].valid);
                    args.push(func_args[i]);
                }
                params[pos2name["..."]] = args;
            }
        }

        /*  provide parameter processing hook  */
        _cs.hook("ComponentJS:params:" + func_name + ":leave", "none", { args: func_args, spec: spec, params: params });

        /*  return prepared parameter object  */
        return params;
    };

    /*  Base16 encoding (number)  */
    _cs.base16_number = function (num, min, uppercase) {
        var base16 = "";
        if (typeof min === "undefined")
            min = 0;
        if (typeof uppercase === "undefined")
            uppercase = false;
        var charset = uppercase ? "0123456789ABCDEF" : "0123456789abcdef";
        while (num > 0 || min > 0) {
            base16 = charset.charAt(Math.floor(num % 16)) + base16;
            num = Math.floor(num / 16);
            if (min > 0)
                min--;
        }
        return base16;
    };

    /*  advanced: 128-bit Counter-ID generation  */
    _cs.cid = (function () {
        /*  128-bit emulated via 4 x 32-bit JavaScript 64-bit-floating-point-based "number"  */
        var counter = [ 0, 0, 0, 0 ];
        var base    = 4294967296; /* = 2^32 */

        /*  generate the next Counter-ID  */
        return function () {
            /*  increase counter  */
            counter[3]++;
            var carry = 0;
            for (var i = 3; i >= 0; i--) {
                carry     += counter[i];
                counter[i] = Math.floor(carry % base);
                carry      = Math.floor(carry / base);
            }

            /*  return counter  */
            return (
                  _cs.base16_number(counter[0], 8, true) +
                  _cs.base16_number(counter[1], 8, true) +
                  _cs.base16_number(counter[2], 8, true) +
                  _cs.base16_number(counter[3], 8, true)
            );
        };
    })();

    /*  for passing a function as a callback parameter,
        wrap the function into a proxy function which
        has a particular excecution scope. Also supports
        optional cloning which allows to carry a private
        context which will be cloned together with function  */
    _cs.proxy = function (ctx, func, clonable) {
        /*  support plain method name  */
        if (_cs.istypeof(func) === "string")
            if (_cs.istypeof(ctx) === "object")
                if (_cs.istypeof(ctx[func]) === "function")
                    func = ctx[func];

        /*  fallback for clonable parameter  */
        if (!_cs.isdefined(clonable))
            clonable = false;

        /*  define the generator  */
        var generator = function () {
            /*  generate new wrapper function  */
            var proxy = function () {
                /*  if context is an object, annotate it with
                    the real "this" pointer of this method call  */
                if (_cs.istypeof(arguments.callee.__ctx__) === "object")
                    arguments.callee.__ctx__.__this__ = this;

                /*  just pass execution through to wrapped function
                    with our attached store as its execution context object  */
                return func.apply(arguments.callee.__ctx__, arguments);
            };

            /*  create the attached store object
                (either with fresh or cloned context)  */
            proxy.__ctx__ = (clonable ? _cs.clone(_cs.isdefined(this.__ctx__) ? this.__ctx__ : ctx) : ctx);

            /*  add ourself as the cloning function  */
            if (clonable)
                proxy.clone = generator;

            /*  set "guid" property to the same of original function,
                so it is garbage collected correctly  */
            proxy.guid = func.guid = (func.guid || proxy.guid || _cs.cid());

            /*  return the new wrapper function  */
            return proxy;
        };

        /*  run the generator once  */
        return generator.call({});
    };

    /*  generate a proxy function which memoizes/caches the result of an
        idempotent function (a function without side-effects which always
        returns the same output value on the same input parameters)  */
    _cs.memoize = function (func) {
        var f = function () {
            var key = _cs.json(_cs.slice(arguments, 0));
            var val; val = undefined;
            if (typeof arguments.callee.cache[key] !== "undefined") {
                /*  take memoized/cached value  */
                val = arguments.callee.cache[key];
            }
            else {
                /*  calculate new value and memoize/cache it  */
                val = func.apply(this, arguments);
                arguments.callee.cache[key] = val;
            }
            return val;
        };
        f.cache = {};
        return f;
    };

    /*  generate a proxy function which uses "currying"
        to remember its initially supplied arguments  */
    _cs.curry = function (func) {
        var args_stored = _cs.slice(arguments, 1);
        return function () {
            var args_supplied = _cs.slice(arguments, 0);
            var args = _cs.concat(args_stored, args_supplied);
            return func.apply(this, args);
        };
    };

    /*  for defining getter/setter style attributes  */
    $cs.attribute = function () {
        /*  determine parameters  */
        var params = $cs.params("attribute", arguments, {
            name:     { pos: 0, req: true  },
            def:      { pos: 1, req: true  },
            validate: { pos: 2, def: null  }
        });

        /*  return closure-based getter/setter method  */
        return _cs.proxy({ value: params.def }, function (value_new, validate_only) {
            /*  remember old value  */
            var value_old = this.value;

            /*  act on new value if given  */
            if (arguments.length > 0) {
                /*  check whether new value is valid  */
                var is_valid = true;
                if (params.validate !== null) {
                    /*  case 1: plain type comparison  */
                    if (   typeof params.validate === "string" ||
                           typeof params.validate === "boolean" ||
                           typeof params.validate === "number" )
                        is_valid = (value_new === params.validate);

                    /*  case 2: regular expression string match  */
                    else if (   typeof params.validate === "object" &&
                                params.validate instanceof RegExp  )
                        is_valid = params.validate.test(value_new);

                    /*  case 3: flexible callback function check  */
                    else if (typeof params.validate === "function")
                        is_valid = params.validate(value_new, value_old, validate_only, params.name);

                    /*  otherwise: error  */
                    else
                        throw _cs.exception("attribute",
                            "validation value \"" + params.validate + "\" " +
                            "for attribute \"" + params.name + "\" " +
                            "is of unsupported type \"" + (typeof params.validate) + "\"");
                }

                /*  either return validation result...  */
                if (typeof validate_only !== "undefined" && validate_only)
                    return is_valid;

                /*  ...or set new valid value...  */
                else if (is_valid) {
                    /*  set new value  */
                    this.value = value_new;

                    /*  optionally notify observers  */
                    var obj = this.__this__;
                    if (   typeof obj !== "undefined" &&
                           typeof obj.notify === "function")
                        obj.notify.call(obj, "attribute:set:" + params.name, value_new, value_old, params.name);
                }

                /*  ...or throw an exception  */
                else
                    throw _cs.exception("attribute",
                        "invalid value \"" + value_new + "\" " +
                        "for attribute \"" + params.name + "\"");
            }

            /*  return old value  */
            return value_old;
        }, true);
    };

    /*  internal hook registry  */
    _cs.hooks = {};

    /*  internal hook processing  */
    _cs.hook_proc = {
        "none":   { init: undefined,                     step: function (    ) {                          } },
        "pass":   { init: function (a) { return a[0]; }, step: function (a, b) { return b;                } },
        "or":     { init: false,                         step: function (a, b) { return a || b;           } },
        "and":    { init: true,                          step: function (a, b) { return a && b;           } },
        "mult":   { init: 1,                             step: function (a, b) { return a * b;            } },
        "add":    { init: 0,                             step: function (a, b) { return a + b;            } },
        "append": { init: "",                            step: function (a, b) { return a + b;            } },
        "push":   { init: [],                            step: function (a, b) { a.push(b); return a;     } },
        "concat": { init: [],                            step: function (a, b) { return _cs.concat(a, b); } },
        "insert": { init: {},                            step: function (a, b) { a[b] = true; return a;   } },
        "extend": { init: {},                            step: function (a, b) { return _cs.extend(a, b); } }
    };

    /*  latch into internal ComponentJS hook  */
    _cs.latch = function (name, cb) {
        /*  sanity check arguments  */
        if (arguments.length < 2)
            throw _cs.exception("latch(internal)", "missing arguments");

        /*  on-the-fly create hook callback registry  */
        if (typeof _cs.hooks[name] === "undefined")
            _cs.hooks[name] = [];

        /*  store callback in hook callback registry  */
        var args = _cs.slice(arguments, 2);
        var id = _cs.cid();
        _cs.hooks[name].push({ id: id, cb: cb, args: args });
        return id;
    };

    /*  unlatch from internal ComponentJS hook  */
    _cs.unlatch = function (name, id) {
        /*  sanity check arguments  */
        if (arguments.length !== 2)
            throw _cs.exception("unlatch(internal)", "invalid number of arguments");
        if (typeof _cs.hooks[name] === "undefined")
            throw _cs.exception("unlatch(internal)", "no such hook");

        /*  search for callback in hook callback registry  */
        var k = -1;
        for (var i = 0; i < _cs.hooks[name].length; i++) {
            if (_cs.hooks[name][i].id === id) {
                k = i;
                break;
            }
        }
        if (k === -1)
            throw _cs.exception("unlatch(internal)", "no such latched callback");

        /*  remove callback from hook callback registry  */
        _cs.hooks[name] = _cs.hooks[name].splice(k, 1);
        return;
    };

    /*  provide internal ComponentJS hook  */
    _cs.hook = function (name, proc) {
        /*  sanity check arguments  */
        if (arguments.length < 2)
            throw _cs.exception("hook(internal)", "missing argument");
        if (typeof _cs.hook_proc[proc] === "undefined")
            throw _cs.exception("hook(internal)", "no such result processing defined");

        /*  start result with the initial value  */
        var result = _cs.hook_proc[proc].init;
        var args = null;
        if (typeof result === "function") {
            args = _cs.slice(arguments, 2);
            result = result.call(null, args);
        }

        /*  give all registered callbacks a chance to
            execute and modify the current result  */
        if (typeof _cs.hooks[name] !== "undefined") {
            if (args === null)
                args = _cs.slice(arguments, 2);
            _cs.foreach(_cs.hooks[name], function (l) {
                /*  call latched callback  */
                var r = l.cb.apply({
                    args:   l.args,                 /*  latch arguments  */
                    result: result,                 /*  current result   */
                    hooks:  _cs.hooks[name].length, /*  total number of hooks latched  */
                    _cs:    _cs,                    /*  internal ComponentJS API  */
                    $cs:    $cs                     /*  external ComponentJS API  */
                }, args);                           /*  hook arguments  */

                /*  process/merge results  */
                result = _cs.hook_proc[proc].step.call(null, result, r);
            });
        }

        /*  return the final result  */
        return result;
    };


    /*
    **  CLASS SYSTEM
    */

    /*  utility function: define a JavaScript "class"  */
    _cs.clazz_or_trait = function (params, is_clazz) {
        /*
         *  STEP 1: CREATE NEW CLASS
         */

        /*  create technical class constructor  */
        var clazz = function () {
            /*  remember information  */
            var obj = this;
            var clz = arguments.callee;
            var arg = arguments;

            /*  support also calls like "foo()" instead of "new foo()"  */
            if (!(obj instanceof clz))
                return new clz(); /* RECURSION */

            /*  initialize all mixin traits and this class (or trait)  */
            var init = function (obj, clz, arg, exec_cons) {
                /*  depth-first visit of parent class  */
                var extend = _cs.annotation(clz, "extend");
                if (extend !== null)
                    arguments.callee(obj, extend, arg, false); /* RECURSION */

                /*  depth-first visit of mixin traits  */
                var mixin = _cs.annotation(clz, "mixin");
                if (mixin !== null)
                    for (var i = 0; i < mixin.length; i++)
                        arguments.callee(obj, mixin[i], arg, true); /* RECURSION */

                /*  establish clones of all own dynamic fields  */
                var dynamics = _cs.annotation(clz, "dynamics");
                if (dynamics !== null) {
                    for (var field in dynamics) {
                        if (_cs.isown(dynamics, field)) {
                            if (   _cs.istypeof(dynamics[field]) !== "null" &&
                                   _cs.istypeof(dynamics[field].clone) === "function")
                                obj[field] = dynamics[field].clone();
                            else
                                obj[field] = _cs.clone(dynamics[field]);
                        }
                    }
                }

                /*  explicitly call optional constructor function
                    NOTICE: a clazz gets supplied the original constructor
                    parameters (we assume that it knows what to do with
                    all or at least the N initial parameters as it is a
                    real parent/base/super class) and has to call its own
                    parent/base/super constructor itself via this.base(),
                    but a trait intentionally gets no constructor parameters
                    passed-through (as it cannot know where it gets mixed
                    into, so it cannot know what to do with the parameters)  */
                if (exec_cons) {
                    var cons = _cs.annotation(clz, "cons");
                    if (cons !== null) {
                        if (_cs.istypeof(clz) === "clazz")
                            cons.apply(obj, arg);
                        else
                            cons.call(obj);
                    }
                }
            };
            init(obj, clz, arg, true);

            return;
        };

        /*
         *  STEP 2: OPTIONALLY IMPLICITLY INHERIT FROM PARENT CLASS
         */

        var no_internals = function (name /*, value */) {
            return !name.match("^(?:base|__ComponentJS_[A-Za-z]+__)$");
        };

        if (_cs.isdefined(params.extend)) {
            /*  inherit all static fields  */
            _cs.extend(clazz, params.extend, no_internals);

            /*  set the prototype chain to inherit from parent class,
                but WITHOUT calling the parent class's constructor function  */
            var ctor = function () {
                this.constructor = clazz;
            };
            ctor.prototype = params.extend.prototype;
            clazz.prototype = new ctor();

            /*  remember parent class  */
            _cs.annotation(clazz, "extend", params.extend);
        }

        /*
         *  STEP 3: OPTIONALLY EXPLICITLY INHERIT FROM MIXIN CLASSES
         */

        if (_cs.isdefined(params.mixin)) {
            /*  inherit from mixin classes  */
            for (var i = 0; i < params.mixin.length; i++) {
                /*  inherit all static fields  */
                _cs.extend(clazz, params.mixin[i], no_internals);

                /*  inherit prototype methods  */
                _cs.mixin(clazz.prototype, params.mixin[i].prototype, no_internals);
            }

            /*  remember mixin classes  */
            _cs.annotation(clazz, "mixin", params.mixin);
        }

        /*
         *  STEP 4: OPTIONALLY SET OWN FIELDS/METHODS
         */

        /*  remember user-supplied constructor function
            (and provide fallback implementation)  */
        var cons = $cs.nop;
        if (_cs.isdefined(params.cons))
            cons = params.cons;
        else if (_cs.isdefined(params.extend))
            cons = function () { this.base(); };
        _cs.annotation(clazz, "cons", cons);

        /*  provide name for underlying implementation of "base()" for constructor  */
        _cs.annotation(cons, "name", "cons");
        if (_cs.isdefined(params.extend))
            _cs.annotation(cons, "base", _cs.annotation(params.extend, "cons"));

        /*  remember user-supplied setup function  */
        if (_cs.isdefined(params.setup))
            _cs.annotation(clazz, "setup", params.setup);

        /*  extend class with own properties and methods  */
        if (_cs.isdefined(params.statics))
            _cs.extend(clazz, params.statics);
        if (_cs.isdefined(params.protos))
            _cs.mixin(clazz.prototype, params.protos);

        /*  remember dynamics for per-object initialization  */
        if (_cs.isdefined(params.dynamics))
            _cs.annotation(clazz, "dynamics", params.dynamics);

        /*  internal utility method for resolving an annotation on a
            possibly cloned function (just for the following "base" method).
            Notice: for a cloned function the clone is a wrapper annotated
            with the annoation "clone" set to "true"!  */
        var resolve = function (func, name) {
            var result = _cs.annotation(func, name);
            while (result === null && _cs.annotation(func.caller, "clone") === true) {
                result = _cs.annotation(func.caller, name);
                func = func.caller;
            }
            return result;
        };

        /*  explicitly add "base()" utility method for calling
            the base/super/parent function in the inheritance/mixin chain  */
        clazz.prototype.base = function () {
            /*  NOTICE: arguments.callee are we just ourself (this function), while
                        arguments.callee.caller is the function calling this.base()!
                        and because our cs.clone() creates wrapper functions we
                        optionally have to take those into account during resolving, too!  */
            var name = resolve(arguments.callee.caller, "name");
            var base = resolve(arguments.callee.caller, "base");
            var extend = _cs.annotation(this.constructor, "extend");

            /*  attempt 1: call base/super/parent function in mixin chain  */
            if (_cs.istypeof(base) === "function")
                return base.apply(this, arguments);

            /*  attempt 2: call base/super/parent function in inheritance chain (directly on object)  */
            else if (   _cs.istypeof(name) === "string" &&
                        _cs.istypeof(extend) === "clazz" &&
                        _cs.istypeof(extend[name]) === "function")
                return extend[name].apply(this, arguments);

            /*  attempt 3: call base/super/parent function in inheritance chain (via prototype object)  */
            else if (   _cs.istypeof(name) === "string" &&
                        _cs.istypeof(extend) === "clazz" &&
                        _cs.istypeof(extend.prototype) === "object" &&
                        _cs.istypeof(extend.prototype[name]) === "function")
                return extend.prototype[name].apply(this, arguments);

            /*  else just give up and throw an exception  */
            else
                throw _cs.exception("base", "no base method found for method \"" +
                    name + "\" in inheritance/mixin chain");
        };

        /*
         * STEP 5: ALLOW TRAITS TO POST-ADJUST/SETUP DEFINED CLASS
         */

        /*  only classes execute trait setups...  */
        if (is_clazz) {
            var setup = function (clazz, trait) {
                /*  depth-first traversal  */
                if (_cs.istypeof(_cs.annotation(trait, "mixin")) === "array") {
                    var mixin = _cs.annotation(trait, "mixin");
                    for (var i = 0; i < mixin.length; i++)
                        arguments.callee(clazz, mixin[i]); /* RECURSION */
                }

                /*  execute optionally existing setup function  */
                if (_cs.istypeof(_cs.annotation(trait, "setup")) === "function")
                    _cs.annotation(trait, "setup").call(clazz);
            };
            setup(clazz, clazz);
        }

        /*
         * STEP 6: PROVIDE RESULTS
         */

        /*  optionally insert class into global namespace ourself  */
        if (typeof params.name === "string")
            $cs.ns(params.name, clazz);

        /*  return created class  */
        return clazz;
    };

    /*  API function: define a usual JavaScript "class"  */
    $cs.clazz = function () {
        /*  determine parameters  */
        var params = $cs.params("clazz", arguments, {
            name:        { def: undefined, valid: "string"       },
            extend:      { def: undefined, valid: "clazz"        },
            mixin:       { def: undefined, valid: "[trait*]"     },
            cons:        { def: undefined, valid: "function"     },
            dynamics:    { def: undefined, valid: "object"       },
            protos:      { def: undefined, valid: "object"       },
            statics:     { def: undefined, valid: "object"       }
        });

        /*  just pass through definition  */
        var clazz = _cs.clazz_or_trait(params, true);

        /*  mark object as a logical ComponentJS "class"  */
        _cs.annotation(clazz, "type", "clazz");

        /*  return created class  */
        return clazz;
    };

    /*  API function: define a Scala-inspired "trait"  */
    $cs.trait = function () {
        /*  determine parameters  */
        var params = $cs.params("trait", arguments, {
            name:        { def: undefined, valid: "string"       },
            mixin:       { def: undefined, valid: "[trait*]"     },
            cons:        { def: undefined, valid: "function"     },
            setup:       { def: undefined, valid: "function"     },
            dynamics:    { def: undefined, valid: "object"       },
            protos:      { def: undefined, valid: "object"       },
            statics:     { def: undefined, valid: "object"       }
        });

        /*  just pass through definition  */
        var trait = _cs.clazz_or_trait(params, false);

        /*  mark object as a logical ComponentJS "trait"  */
        _cs.annotation(trait, "type", "trait");

        /*  return created trait  */
        return trait;
    };


    /*
    **  GENERIC PATTERN TRAITS
    */

    /*  generic pattern: id  */
    $cs.pattern.id = $cs.trait({
        dynamics: {
            id: $cs.attribute("id", null)
        }
    });

    /*  generic pattern: name  */
    $cs.pattern.name = $cs.trait({
        dynamics: {
            name: $cs.attribute("name", "")
        }
    });

    /*  generic pattern: tree  */
    $cs.pattern.tree = $cs.trait({
        mixin: [
            $cs.pattern.name
        ],
        dynamics: {
            parent:   $cs.attribute("parent", null),
            children: $cs.attribute("children", [])
        },
        protos: {
            /*  method: path to (and including) node as either object array or name string  */
            path: function (separator) {
                var path, node;
                if (typeof separator === "undefined") {
                    /*  return path as object array  */
                    path = [];
                    for (node = this; node !== null; node = node.parent())
                        path.push(node);
                }
                else {
                    /*  return path as name string  */
                    path = "";
                    if (this.parent() === null)
                        path = separator;
                    else {
                        for (node = this; node.parent() !== null; node = node.parent())
                            path = separator + node.name() + path;
                    }
                }
                return path;
            },

            /*  method: attach node to tree  */
            attach: function (theparent) {
                if (this.parent() !== null)
                    this.detach();
                var children = theparent.children();
                children.push(this);
                theparent.children(children);
                this.parent(theparent);
            },

            /*  method: detach node from tree  */
            detach: function () {
                if (this.parent() !== null) {
                    var self = this;
                    this.parent().children(_cs.filter(this.parent().children(), function (x) {
                        return x !== self;
                    }));
                    this.parent(null);
                }
            },

            /*  method: walk tree up  */
            walk_up: function (callback, ctx) {
                var depth, node;
                for (depth = 0, node = this; node !== null; node = node.parent(), depth++)
                    ctx = callback(depth, node, ctx);
                return ctx;
            },

            /*  method: walk tree downward */
            walk_down: function (callback, ctx) {
                var _walk = function (depth, node, ctx) {
                    if (typeof callback === "function")
                        ctx = callback(depth, node, ctx, false);
                    var children = node.children();
                    for (var i = 0; i < children.length; i++)
                        ctx = _walk(depth + 1, children[i], ctx);
                    if (typeof callback === "function")
                        ctx = callback(depth, node, ctx, true);
                    return ctx;
                };
                ctx = _walk(0, this, ctx);
                return ctx;
            },

            /*  method: dump tree as indented string representation  */
            _tree_dump: function (callback) {
                return this.walk_down(function (depth, node, output, depth_first) {
                    if (!depth_first) {
                        for (var n = 0; n < depth; n++)
                            output += "    ";
                        output += "\"" + node.name() + "\"";
                        if (typeof callback === "function")
                            output += ": " + callback(node);
                        output += "\n";
                    }
                    return output;
                }, "");
            }
        }
    });

    /*  generic pattern: configuration  */
    $cs.pattern.config = $cs.trait({
        dynamics: {
            /*  attributes  */
            __config: {}
        },
        protos: {
            /*  method: get/set particular configuration item  */
            cfg: function (name, value) {
                var result;
                if (arguments.length === 0) {
                    /*  return list of keys  */
                    result = [];
                    for (var key in this.__config)
                        if (_cs.isown(this.__config, key))
                            result.push(key);
                }
                else if (arguments.length === 1 && typeof name === "string") {
                    /*  retrieve value  */
                    result = this.__config[name];
                }
                else if (arguments.length === 2 && value !== null) {
                    /*  set value  */
                    result = this.__config[name];
                    this.__config[name] = value;
                }
                else if (arguments.length === 2) {
                    /*  remove key/value pair  */
                    result = this.__config[name];
                    delete this.__config[name];
                }
                else
                    throw _cs.exception("cfg", "invalid arguments");
                return result;
            }
        }
    });

    /*  generic pattern: spool  */
    $cs.pattern.spool = $cs.trait({
        dynamics: {
            /*  attributes  */
            __spool: {}
        },
        protos: {
            /*  spool an action for grouped execution  */
            spool: function () {
                /*  determine parameters  */
                var params = $cs.params("spool", arguments, {
                    name:  { pos: 0,     req: true },
                    ctx:   { pos: 1,     req: true },
                    func:  { pos: 2,     req: true },
                    args:  { pos: "...", def: []   }
                });

                /*  sanity check parameters  */
                if (!_cs.istypeof(params.func).match(/^(string|function)$/))
                    throw _cs.exception("spool", "invalid function parameter (neither function object nor method name)");
                if (_cs.istypeof(params.func) === "string") {
                    if (_cs.istypeof(params.ctx[params.func]) !== "function")
                        throw _cs.exception("spool", "invalid method name: \"" + params.func + "\"");
                    params.func = params.ctx[params.func];
                }

                /*  spool cleanup action  */
                if (!_cs.isdefined(this.__spool[params.name]))
                    this.__spool[params.name] = [];
                this.__spool[params.name].push(params);
                return;
            },

            /*  return number of actions which are spooled  */
            spooled: function () {
                /*  determine parameters  */
                var params = $cs.params("spooled", arguments, {
                    name: { pos: 0, req: true }
                });

                /*  return number of actions which are spooled  */
                return (
                    _cs.isdefined(this.__spool[params.name]) ?
                    this.__spool[params.name].length : 0
                );
            },

            /*  execute spooled actions  */
            unspool: function () {
                /*  determine parameters  */
                var params = $cs.params("unspool", arguments, {
                    name: { pos: 0, req: true }
                });

                /*  execute spooled actions (in reverse spooling order)  */
                var actions = this.__spool[params.name];
                if (!_cs.isdefined(actions))
                    throw _cs.exception("unspool", "no such spool: \"" + params.name + "\"");
                for (var i = actions.length - 1; i >= 0; i--)
                    actions[i].func.apply(actions[i].ctx, actions[i].args);

                /*  destroy spool of now executed cleanup actions  */
                delete this.__spool[params.name];
                return;
            }
        }
    });

    /*  internal utility function: split "[path:]name"
        specification into a component object and a spool name  */
    _cs.spool_spec_parse = function (comp, spec) {
        var info = {};
        info.comp = comp;
        info.name = spec;
        var m = info.name.match(/^([^:]+):(.+)$/);
        if (m !== null) {
            info.comp = $cs(comp, m[1]);
            info.name = m[2];
        }
        return info;
    };

    /*  generic pattern: tree property  */
    $cs.pattern.property = $cs.trait({
        mixin: [
            $cs.pattern.tree,
            $cs.pattern.config
        ],
        protos: {
            /*  get/set a property  */
            property: function () {
                /*  determine parameters  */
                var params = $cs.params("property", arguments, {
                    name:        { pos: 0, req: true      },
                    value:       { pos: 1, def: undefined },
                    scope:       {         def: undefined },
                    bubbling:    {         def: true      },
                    targeting:   {         def: true      },
                    returnowner: {         def: false     }
                });

                /*  sanity check usage  */
                if (!params.targeting && !params.bubbling)
                    throw _cs.exception("property", "disabling both targeting and bubbling makes no sense");

                /*  start resolving with an undefined value  */
                var result; result = undefined;

                /*  get old configuration value
                    (on current node or on any parent node)  */
                var v;
                for (var scope = [], node = this;
                     node !== null;
                     scope.unshift(node.name()), node = node.parent()) {

                    /*  optionally skip the target component
                        (usually if a property on the parent components
                        should be resolved only, but the scoping for the
                        target component should be still taken into account
                        on the parent) */
                    if (scope.length === 0 && !params.targeting)
                        continue;

                    /*  first try: child-scoped property  */
                    if (scope.length > 0) {
                        for (var i = scope.length - 1; i >= 0; i--) {
                            var probePath = scope.slice(0, i + 1).join("/");
                            v = node.cfg("ComponentJS:property:" + params.name + "@" + probePath);
                            if (typeof v !== "undefined")
                                break;
                        }
                        if (typeof v !== "undefined") {
                            result = (params.returnowner ? node : v);
                            break;
                        }
                    }

                    /*  second try: unscoped property  */
                    v = node.cfg("ComponentJS:property:" + params.name);
                    if (typeof v !== "undefined") {
                        result = (params.returnowner ? node : v);
                        break;
                    }

                    /*  if we should not bubble, stop immediately  */
                    if (!params.bubbling)
                        break;
                }

                /*  optionally set new configuration value
                    (on current node only)  */
                if (typeof params.value !== "undefined")
                    if (typeof params.scope !== "undefined")
                        this.cfg("ComponentJS:property:" + params.name + "@" + params.scope, params.value);
                    else
                        this.cfg("ComponentJS:property:" + params.name, params.value);

                /*  return result (either the old configuration
                    value or the owning component)  */
                return result;
            }
        }
    });

    /*  generic pattern: specification  */
    $cs.pattern.spec = $cs.trait({
        mixin: [
            /*  name-based identification (mandatory)  */
            $cs.pattern.name
        ],
        dynamics: {
            /*  key/value-based specification (optional)  */
            __spec: {}
        },
        protos: {
            /*  method: configure specification  */
            spec: function () {
                var spec = this.__spec;
                if (arguments.length === 0)
                    return spec;
                else if (arguments.length === 1 && typeof arguments[0] === "string")
                    return spec[arguments[0]];
                else {
                    for (var i = 0; i < arguments.length; i++) {
                        if (typeof arguments[i] === "string") {
                            spec[arguments[i]] = arguments[i + 1];
                            i++;
                        }
                        else if (typeof arguments[i] === "object") {
                            for (var key in arguments[i])
                                if (_cs.isown(arguments[i], key))
                                    spec[key] = arguments[i][key];
                        }
                    }
                }
                return;
            },

            /*  method: determine whether this object matches the name/spec patterns  */
            matches: function (name_pattern, spec_pattern) {
                /*  step 1: match mandatory name  */
                if (typeof name_pattern === "string") {
                    if (this.name() !== name_pattern)
                        return false;
                }
                else if (   typeof name_pattern === "object" &&
                            name_pattern instanceof RegExp) {
                    if (!(this.name().match(name_pattern)))
                        return false;
                }
                else
                    throw _cs.exception("matches", "invalid name pattern");

                /*  step 2: match optional specification  */
                var spec = this.__spec;
                for (var key in spec_pattern) {
                    if (!_cs.isown(spec_pattern, key))
                        continue;
                    if (!_cs.isdefined(spec[key]))
                        return false;
                    var value = spec_pattern[key];
                    switch (typeof spec[key]) {
                        case "number":
                        case "boolean":
                            if (spec[key] !== value)
                                return false;
                            break;
                        case "string":
                            if (!(   (   typeof value === "string" &&
                                         spec[key] === value) ||
                                     (   typeof value === "object" &&
                                         value instanceof RegExp &&
                                         !(spec[key].match(value)))))
                                return false;
                            break;
                    }
                }
                return true;
            }
        }
    });

    /*  generic pattern: observable  */
    $cs.pattern.observable = $cs.trait({
        dynamics: {
            /*  internal state  */
            __listener: {}
        },
        protos: {
            /*  attach a listener  */
            listen: function () {
                /*  determine parameters  */
                var params = $cs.params("listen", arguments, {
                    name:    { pos: 0,     req: true },
                    ctx:     {             def: this },
                    func:    { pos: 1,     req: true },
                    args:    { pos: "...", def: []   },
                    spec:    {             def: null } /* customized matching */
                });

                /*  attach listener information  */
                var id = _cs.cid();
                this.__listener[id] = params;
                return id;
            },

            /*  check for an attached listener  */
            listening: function () {
                /*  determine parameters  */
                var params = $cs.params("listening", arguments, {
                    id: { pos: 0, req: true }
                });

                /*  check whether listener is attached  */
                return (typeof this.__listener[params.id] !== "undefined");
            },

            /*  detach a listener  */
            unlisten: function () {
                /*  determine parameters  */
                var params = $cs.params("unlisten", arguments, {
                    id: { pos: 0, req: true }
                });

                /*  detach parameters from component  */
                if (typeof this.__listener[params.id] === "undefined")
                    throw _cs.exception("unlisten", "listener not found");
                var listener = this.__listener[params.id];
                delete this.__listener[params.id];
                return listener;
            },

            /*  notify all listeners  */
            notify: function () {
                /*  determine parameters  */
                var params = $cs.params("notify", arguments, {
                    name:    { pos: 0,     req: true                                          },
                    args:    { pos: "...", def: []                                            },
                    matches: {             def: function (p, l) { return p.name === l.name; } } /* customized matching */
                });

                /*  notify all listeners  */
                for (var id in this.__listener) {
                    if (_cs.isown(this.__listener, id)) {
                        var listener = this.__listener[id];
                        if (params.matches(params, listener)) {
                            var args = _cs.concat(listener.args, params.args);
                            listener.func.apply(listener.ctx, args);
                        }
                    }
                }
            }
        }
    });

    /*  generic pattern: event  */
    $cs.pattern.event = $cs.clazz({
        mixin: [
            $cs.pattern.spec
        ],
        dynamics: {
            /*  attributes  */
            target:      $cs.attribute("target",      null),        /*  target object the event is send to  */
            propagation: $cs.attribute("propagation", true),        /*  whether event propagation should continue  */
            processing:  $cs.attribute("processing",  true),        /*  whether final default event processing should be performed  */
            dispatched:  $cs.attribute("dispatched",  false),       /*  whether event was dispatched at least once to a subscriber  */
            decline:     $cs.attribute("decline",     false),       /*  whether event was declined by subscriber  */
            state:       $cs.attribute("state",       "targeting"), /*  state of dispatching: capturing, targeting, spreading, bubbling */
            result:      $cs.attribute("result",      undefined),   /*  optional result value event subscribers can provide  */
            async:       $cs.attribute("async",       false)        /*  whether event is dispatched asynchronously  */
        }
    });

    /*  event factory  */
    $cs.event = function () {
        /*  determine parameters  */
        var params = $cs.params("event", arguments, {
            name:        { pos: 0,     req: true        },
            spec:        {             def: {}          },
            target:      { pos: 1,     req: true        },
            propagation: { pos: 2,     def: true        },
            processing:  { pos: 3,     def: true        },
            dispatched:  { pos: 4,     def: false       },
            decline:     { pos: 5,     def: false       },
            state:       { pos: 6,     def: "targeting" },
            result:      { pos: 7,     def: undefined   },
            async:       { pos: 8,     def: false       }
        });

        /*  create new event  */
        var ev = new $cs.pattern.event();

        /*  configure event  */
        ev.name       (params.name);
        ev.target     (params.target);
        ev.propagation(params.propagation);
        ev.processing (params.processing);
        ev.dispatched (params.dispatched);
        ev.decline    (params.decline);
        ev.state      (params.state);
        ev.result     (params.result);
        ev.spec       (params.spec);
        ev.async      (params.async);

        return ev;
    };

    /*  generic pattern: eventing  */
    $cs.pattern.eventing = $cs.trait({
        dynamics: {
            __subscription: {}
        },
        protos: {
            /*  subscribe on an event  */
            subscribe: function () {
                /*  determine parameters  */
                var params = $cs.params("subscribe", arguments, {
                    name:      { pos: 0,     req: true  },
                    spec:      {             def: {}    },
                    ctx:       {             def: this  },
                    func:      { pos: 1,     req: true  },
                    args:      { pos: "...", def: []    },
                    capturing: {             def: false },
                    spreading: {             def: false },
                    bubbling:  {             def: true  },
                    noevent:   {             def: false },
                    exclusive: {             def: false },
                    spool:     {             def: null  }
                });

                /*  honor exclusive request  */
                var subscriptions = this._subscriptions(params.name, params.spec);
                if (subscriptions.length === 1 && subscriptions[0].exclusive)
                    throw _cs.exception("subscribe", "existing exclusive subscription prevents additional one");
                if (params.exclusive && subscriptions.length > 0)
                    throw _cs.exception("subscribe", "non-exclusive subscription(s) prevent exclusive one");

                /*  attach parameters to component  */
                var id = _cs.cid();
                this.__subscription[id] = params;

                /*  optionally spool reverse operation  */
                if (params.spool !== null) {
                    var info = _cs.spool_spec_parse(this, params.spool);
                    info.comp.spool(info.name, this, "unsubscribe", id);
                }

                return id;
            },

            /*  unsubscribe from an event  */
            unsubscribe: function () {
                /*  determine parameters  */
                var params = $cs.params("unsubscribe", arguments, {
                    id: { pos: 0, req: true }
                });

                /*  detach parameters from component  */
                if (typeof this.__subscription[params.id] === "undefined")
                    throw _cs.exception("unsubscribe", "subscription not found");
                delete this.__subscription[params.id];
                return;
            },

            /*  determine subscription existence  */
            subscription: function () {
                /*  determine parameters  */
                var params = $cs.params("subscription", arguments, {
                    id: { pos: 0, req: true }
                });

                /*  determine whether subscription exists  */
                return (typeof this.__subscription[params.id] !== "undefined");
            },

            /*  determine subscriptions (internal)  */
            _subscriptions: function () {
                /*  determine parameters  */
                var params = $cs.params("subscriptions", arguments, {
                    name:  { pos: 0, req: true },
                    spec:  { pos: 1, def: {}   }
                });

                /*  make an event for matching only  */
                var ev = $cs.event({
                    name:   params.name,
                    spec:   params.spec,
                    target: $cs.nop
                });

                /*  find and return all matching subscriptions  */
                var subscriptions = [];
                for (var id in this.__subscription) {
                    if (!_cs.isown(this.__subscription, id))
                        continue;
                    var s = this.__subscription[id];
                    if (ev.matches(s.name, s.spec))
                        subscriptions.push(s);
                }
                return subscriptions;
            },

            /*  publish an event */
            publish: function () {
                var i;
                var self = this;

                /*  determine parameters  */
                var params = $cs.params("publish", arguments, {
                    name:         { pos: 0,     req: true            },
                    spec:         {             def: {}              },
                    async:        {             def: false           },
                    capturing:    {             def: true            },
                    spreading:    {             def: false           },
                    bubbling:     {             def: true            },
                    completed:    {             def: $cs.nop         },
                    resultinit:   {             def: undefined       },
                    resultstep:   {             def: function (a, b) { return b; } },
                    directresult: {             def: false           },
                    noresult:     {             def: false           },
                    firstonly:    {             def: false           },
                    silent:       {             def: false           },
                    args:         { pos: "...", def: []              }
                });

                /*  short-circuit processing (1/2) to speed up cases
                    where no subscribers exist for a local event  */
                var short_circuit = false;
                if (!params.capturing && !params.spreading && !params.bubbling) {
                    var subscribers = false;
                    for (var id in this.__subscription) {
                        if (!_cs.isown(this.__subscription, id))
                            continue;
                        subscribers = true;
                        break;
                    }
                    if (!subscribers) {
                        if (params.noresult)
                            return;
                        else if (params.directresult)
                            return params.resultinit;
                        else
                            short_circuit = true;
                    }
                }

                /*  create event  */
                var ev = $cs.event({
                    name:        params.name,
                    spec:        params.spec,
                    async:       params.async,
                    result:      params.resultinit,
                    target:      self,
                    propagation: true,
                    processing:  true,
                    dispatched:  false
                });

                /*  short-circuit processing (2/2)  */
                if (short_circuit)
                    return ev;

                /*  tracing  */
                if (!params.silent) {
                    $cs.debug(1, "event:" +
                        " " + ev.target().path("/") + ": publish:" +
                        " name=" + ev.name() +
                        " async=" + ev.async() +
                        " capturing=" + params.capturing +
                        " spreading=" + params.spreading +
                        " bubbling=" + params.bubbling +
                        " directresult=" + params.directresult +
                        " noresult=" + params.noresult +
                        " firstonly=" + params.firstonly
                    );
                }

                /*  helper function for dispatching event to single component  */
                var event_dispatch_single = function (ev, comp, params, state) {
                    for (var id in comp.__subscription) {
                        if (!_cs.isown(comp.__subscription, id))
                            continue;
                        var s = comp.__subscription[id];
                        if (   (   (state === "capturing" && s.capturing) ||
                                   (state === "targeting"               ) ||
                                   (state === "spreading" && s.spreading) ||
                                   (state === "bubbling"  && s.bubbling )) &&
                               ev.matches(s.name, s.spec)                 ) {

                            /*  verbosity  */
                            if (!params.silent)
                                $cs.debug(1, "event: " + comp.path("/") + ": dispatch on " + state);

                            /*  further annotate event object  */
                            ev.state(state);
                            ev.decline(false);

                            /*  call subscription method  */
                            var args = _cs.concat(
                                s.noevent ? [] : [ ev ],
                                s.args,
                                params.args
                            );
                            var result = s.func.apply(s.ctx, args);

                            /*  process return value  */
                            if (s.noevent && _cs.isdefined(result))
                                ev.result(params.resultstep(ev.result(), result));

                            /*  control the further dispatching  */
                            if (!ev.decline()) {
                                ev.dispatched(true);
                                if (params.firstonly)
                                    ev.propagation(false);
                            }
                        }
                    }
                };

                /*  helper function for dispatching event to all components on hierarchy path  */
                var event_dispatch_all = function (ev, comp, params) {
                    /*  determine component tree path  */
                    var comp_path;
                    if (params.capturing || params.bubbling)
                        comp_path = comp.path();

                    /*  phase 1: CAPTURING
                        optionally dispatch event downwards from root component
                        towards target component for capturing subscribers  */
                    if (params.capturing) {
                        for (i = comp_path.length - 1; i >= 1; i--) {
                            event_dispatch_single(ev, comp_path[i], params, "capturing");
                            if (!ev.propagation())
                                break;
                        }
                    }

                    /*  phase 2: TARGETING
                        dispatch event to target component  */
                    if (ev.propagation())
                        event_dispatch_single(ev, comp, params, "targeting");

                    /*  phase 3: SPREADING
                        dispatch event to all descendant components  */
                    if (params.spreading && ev.propagation()) {
                        var visit = function (comp, isTarget) {
                            var cont = true;
                            if (!isTarget) {
                                /*  dispatch on non-target component  */
                                event_dispatch_single(ev, comp, params, "spreading");
                                if (!ev.propagation()) {
                                    /*  if propagation should stop, reset the flag again
                                        as in the spreading phase propagation stops only(!)
                                        for the particular sub-tree, not the propagation
                                        process as a whole!  */
                                    ev.propagation(true);
                                    cont = false;
                                }
                            }
                            if (cont) {
                                /*  dispatch onto all direct child components  */
                                var children = comp.children();
                                for (var i = 0; i < children.length; i++)
                                    visit(children[i], false);
                            }
                        };
                        visit(comp, true);
                    }

                    /*  phase 4: BUBBLING
                        dispatch event upwards from target component towards
                        root component for bubbling (regular) subscribers  */
                    if (params.bubbling && ev.propagation()) {
                        for (i = 1; i < comp_path.length; i++) {
                            event_dispatch_single(ev, comp_path[i], params, "bubbling");
                            if (!ev.propagation())
                                break;
                        }
                    }

                    /*  notify publisher on dispatch completion  */
                    params.completed.call(comp, ev);
                };

                /*  perform event publishing,
                    either asynchronous or synchronous  */
                if (ev.async())
                    /* global setTimeout:false */
                    setTimeout(_cs.hook("ComponentJS:settimeout:func", "pass", function () {
                        event_dispatch_all(ev, self, params);
                    }), 0);
                else
                    event_dispatch_all(ev, self, params);

                /*  return the event, directly the result value or no result value at all  */
                if (params.noresult)
                    return;
                else if (params.directresult)
                    return ev.result();
                else
                    return ev;
            }
        }
    });

    /*  generic pattern: command  */
    $cs.pattern.command = $cs.clazz({
        mixin: [
            $cs.pattern.observable
        ],
        dynamics: {
            /*  standard attributes  */
            ctx:   $cs.attribute("ctx",   null),
            func:  $cs.attribute("func",  $cs.nop),
            args:  $cs.attribute("args",  []),
            async: $cs.attribute("async", false),

            /*  usually observed attribute  */
            enabled: $cs.attribute({
                name:     "enabled",
                def:      true,
                validate: function (v) { return typeof v === "boolean"; }
            })
        },
        protos: {
            /*  method: execute the command  */
            execute: function (caller_args, caller_result) {
                if (!this.enabled())
                    return;
                var args = [];
                if (this.async()) {
                    args.push(function (value) {
                        if (typeof caller_result === "function")
                            caller_result(value);
                    });
                }
                args = _cs.concat(args, this.args(), caller_args);
                return this.func().apply(this.ctx(), args);
            }
        }
    });

    /*  command factory  */
    $cs.command = function () {
        /*  determine parameters  */
        var params = $cs.params("command", arguments, {
            ctx:      {             def: null  },
            func:     { pos: 0,     req: true  },
            args:     { pos: "...", def: []    },
            async:    {             def: false },
            enabled:  {             def: true  },
            wrap:     {             def: false }
        });

        /*  create new command  */
        var cmd = new $cs.pattern.command();

        /*  configure command  */
        cmd.ctx    (params.ctx);
        cmd.func   (params.func);
        cmd.args   (params.args);
        cmd.async  (params.async);
        cmd.enabled(params.enabled);

        /*  optionally wrap into convenient "execute" closure  */
        var result = cmd;
        if (params.wrap) {
            result = function () {
                var args = _cs.concat(arguments);
                var cb = null;
                if (arguments.callee.command.async())
                    cb = args.pop();
                return arguments.callee.command.execute.call(arguments.callee.command, args, cb);
            };
            result.command = cmd;
        }

        return result;
    };

    /*  component states  */
    _cs.states = [
        { /* component is not existing (bootstrapping state transitions only) */
          enter: null,
          leave: null,
          state: "dead",
          color: "#000000"
        }
    ];

    /*  clear all state transitions (except for "dead" state)  */
    _cs.states_clear = function () {
        _cs.states = _cs.slice(_cs.states, 0, 1);
        return;
    };

    /*  add a state transition  */
    _cs.states_add = function (target, enter, leave, color, source) {
        /*  create new state configuration  */
        var state = {
            enter: enter,
            leave: leave,
            state: target,
            color: color
        };

        /*  determine storage position  */
        var pos = 1;
        while (pos < _cs.states.length) {
            if (   source !== null &&
                   _cs.states[pos].state === source)
                break;
            pos++;
        }

        /*  store state  */
        _cs.states.splice(pos, 0, state);
    };

    /*  determine state index via state name  */
    _cs.state_name2idx = function (name) {
        var idx = -1;
        var i;
        for (i = 0; i < _cs.states.length; i++) {
            if (_cs.states[i].state === name) {
                idx = i;
                break;
            }
        }
        return idx;
    };

    /*  perform a state enter/leave method call  */
    _cs.state_method_call = function (type, comp, method) {
        var result = true;
        var obj = comp.obj();
        if (obj !== null && typeof obj[method] === "function") {
            var info = { type: type, comp: comp, method: method, ctx: obj, func: obj[method] };
            _cs.hook("ComponentJS:state-method-call", "none", info);
            result = info.func.call(info.ctx);
        }
        return result;
    };

    /*  set of current state transition requests
        (modeled via a map to the components)  */
    _cs.state_requests = {};

    /*  spawn all progression runs (asynchronously)  */
    _cs.state_progression = function () {
        /* global setTimeout:false */
        setTimeout(_cs.hook("ComponentJS:settimeout:func", "pass", function () {
            /*  try to process the transition requests  */
            var remove = [];
            for (var cid in _cs.state_requests) {
                if (!_cs.isown(_cs.state_requests, cid))
                    continue;
                var req = _cs.state_requests[cid];
                if (_cs.state_progression_single(req))
                    remove.push(cid);
            }

            /*  perform deferred removal of original fields  */
            _cs.foreach(remove, function (cid) {
                delete _cs.state_requests[cid];
            });

            /*  give plugins a chance to react  */
            _cs.hook("ComponentJS:state-change", "none");
        }), 0);
    };

    /*  execute single progression run  */
    _cs.state_progression_single = function (req) {
        var done = false;
        _cs.state_progression_run(req.comp, req.state);
        if (_cs.states[req.comp.__state].state === req.state) {
            if (typeof req.callback === "function")
                req.callback.call(req.comp, req.state);
            done = true;
        }
        return done;
    };

    /*  perform a single synchronous progression run for a particular component  */
    _cs.state_progression_run = function (comp, arg, _direction) {
        var i, children;
        var state, enter, leave, spooled;

        /*  handle optional argument (USED INTERNALLY ONLY)  */
        if (typeof _direction === "undefined")
            _direction = "upward-and-downward";

        /*  determine index of state by name  */
        var state_new = _cs.state_name2idx(arg);
        if (state_new === -1)
            throw _cs.exception("state", "invalid argument \"" + arg + "\"");

        /*  perform upward/downward state transition(s)  */
        if (comp.__state < state_new) {
            /*  transition to higher state  */
            while (comp.__state < state_new) {
                /*  determine names of state and enter method  */
                state = _cs.states[comp.__state + 1].state;
                enter = _cs.states[comp.__state + 1].enter;

                /*  mandatory transition parent component to higher state first  */
                if (comp.parent() !== null) {
                    if (comp.parent().state_compare(state) < 0) {
                        _cs.state_progression_run(comp.parent(), state, "upward"); /*  RECURSION  */
                        if (comp.parent().state_compare(state) < 0) {
                            $cs.debug(1,
                                "state: " + comp.path("/") + ": transition (increase) " +
                                "REJECTED BY PARENT COMPONENT (" + comp.parent().path("/") + "): " +
                                "@" + _cs.states[comp.__state].state + " --(" + enter + ")--> " +
                                "@" + _cs.states[comp.__state + 1].state + ": SUSPENDING CURRENT TRANSITION RUN"
                            );
                            return;
                        }
                    }
                }

                /*  transition current component to higher state second  */
                if (_cs.isdefined(comp.__state_guards[enter])) {
                    $cs.debug(1,
                        "state: " + comp.path("/") + ": transition (increase) REJECTED BY ENTER GUARD: " +
                        "@" + _cs.states[comp.__state].state + " --(" + enter + ")--> " +
                        "@" + _cs.states[comp.__state + 1].state + ": SUSPENDING CURRENT TRANSITION RUN"
                    );
                    return;
                }
                comp.__state++;
                $cs.debug(1,
                    "state: " + comp.path("/") + ": transition (increase): " +
                    "@" + _cs.states[comp.__state - 1].state + " --(" + enter + ")--> " +
                    "@" + _cs.states[comp.__state].state
                );
                _cs.hook("ComponentJS:state-invalidate", "none", "states");
                _cs.hook("ComponentJS:state-change", "none");

                /*  execute enter method  */
                if (_cs.state_method_call("enter", comp, enter) === false) {
                    /*  FULL STOP: state enter method rejected state transition  */
                    $cs.debug(1,
                        "state: " + comp.path("/") + ": transition (increase) REJECTED BY ENTER METHOD: " +
                        "@" + _cs.states[comp.__state - 1].state + " --(" + enter + ")--> " +
                        "@" + _cs.states[comp.__state].state + ": SUSPENDING CURRENT TRANSITION RUN"
                    );
                    comp.__state--;
                    return;
                }

                /*  notify subscribers about new state  */
                comp.publish({
                    name:         "ComponentJS:state:" + _cs.states[comp.__state].state,
                    noresult:     true,
                    capturing:    false,
                    spreading:    false,
                    bubbling:     false,
                    async:        true,
                    silent:       true
                });

                /*  optionally automatically transition
                    child component(s) to higher state third  */
                if (_direction === "upward-and-downward" || _direction === "downward") {
                    children = comp.children();
                    for (i = 0; i < children.length; i++) {
                        if (children[i].state_compare(state) < 0) {
                            if (   children[i].state_auto_increase() ||
                                   children[i].property("ComponentJS:state-auto-increase") === true) {
                                _cs.state_progression_run(children[i], state, "downward"); /*  RECURSION  */
                                if (children[i].state_compare(state) < 0) {
                                    /*  enqueue state transition for child  */
                                    _cs.state_requests[children[i].id()] =
                                        { comp: children[i], state: state };
                                    _cs.hook("ComponentJS:state-invalidate", "none", "requests");
                                    _cs.hook("ComponentJS:state-change", "none");
                                }
                            }
                        }
                    }
                }
            }
        }
        else if (comp.__state > state_new) {
            /*  transition to lower state  */
            while (comp.__state > state_new) {
                /*  determine names of state and leave method  */
                state = _cs.states[comp.__state].state;
                leave = _cs.states[comp.__state].leave;
                var state_lower = _cs.states[comp.__state - 1].state;

                /*  mandatory transition children component(s) to lower state first  */
                children = comp.children();
                for (i = 0; i < children.length; i++) {
                    if (children[i].state_compare(state_lower) > 0) {
                        _cs.state_progression_run(children[i], state_lower, "downward"); /*  RECURSION  */
                        if (children[i].state_compare(state_lower) > 0) {
                            $cs.debug(1,
                                "state: " + comp.path("/") + ": transition (decrease) " +
                                "REJECTED BY CHILD COMPONENT (" + children[i].path("/") + "): " +
                                "@" + _cs.states[comp.__state - 1].state + " <--(" + leave + ")-- " +
                                "@" + _cs.states[comp.__state].state + ": SUSPENDING CURRENT TRANSITION RUN"
                            );
                            return;
                        }
                    }
                }

                /*  transition current component to lower state second  */
                if (_cs.isdefined(comp.__state_guards[leave])) {
                    $cs.debug(1,
                        "state: " + comp.path("/") + ": transition (decrease) REJECTED BY LEAVE GUARD: " +
                        "@" + _cs.states[comp.__state - 1].state + " <--(" + leave + ")-- " +
                        "@" + _cs.states[comp.__state].state + ": SUSPENDING CURRENT TRANSITION RUN"
                    );
                    return;
                }
                comp.__state--;
                $cs.debug(1,
                    "state: " + comp.path("/") + ": transition (decrease): " +
                    "@" + _cs.states[comp.__state].state + " <--(" + leave + ")-- " +
                    "@" + _cs.states[comp.__state + 1].state
                );
                _cs.hook("ComponentJS:state-invalidate", "none", "states");
                _cs.hook("ComponentJS:state-change", "none");

                /*  execute leave method  */
                if (_cs.state_method_call("leave", comp, leave) === false) {
                    /*  FULL STOP: state leave method rejected state transition  */
                    $cs.debug(1,
                        "state: " + comp.path("/") + ": transition (decrease) REJECTED BY LEAVE METHOD: " +
                        "@" + _cs.states[comp.__state].state + " <--(" + leave + ")-- " +
                        "@" + _cs.states[comp.__state + 1].state + ": SUSPENDING CURRENT TRANSITION RUN"
                    );
                    comp.__state++;
                    return;
                }
                else {
                    /*  in case leave method successful or not present
                        automatically unspool still pending actions
                        on spool named exactly like the left state  */
                    spooled = comp.spooled(state);
                    if (spooled > 0) {
                        $cs.debug(1, "state: " + comp.path("/") + ": auto-unspooling " + spooled + " operation(s)");
                        comp.unspool(state);
                    }
                }

                /*  notify subscribers about new state  */
                comp.publish({
                    name:         "ComponentJS:state:" + _cs.states[comp.__state].state,
                    noresult:     true,
                    capturing:    false,
                    spreading:    false,
                    bubbling:     false,
                    async:        true,
                    silent:       true
                });

                /*  optionally automatically transition
                    parent component to lower state third  */
                if (_direction === "upward-and-downward" || _direction === "upward") {
                    if (comp.parent() !== null) {
                        if (comp.parent().state_compare(state_lower) > 0) {
                            if (   comp.parent().state_auto_decrease() ||
                                   comp.parent().property("ComponentJS:state-auto-decrease") === true) {
                                _cs.state_progression_run(comp.parent(), state_lower, "upward"); /*  RECURSION  */
                                if (comp.parent().state_compare(state_lower) > 0) {
                                    /*  enqueue state transition for parent  */
                                    _cs.state_requests[comp.parent().id()] =
                                        { comp: comp.parent(), state: state_lower };
                                    _cs.hook("ComponentJS:state-invalidate", "none", "requests");
                                    _cs.hook("ComponentJS:state-change", "none");
                                }
                            }
                        }
                    }
                }
            }
        }
    };

    /*  generic pattern for state management  */
    $cs.pattern.state = $cs.trait({
        mixin: [
            $cs.pattern.tree
        ],
        dynamics: {
            /*  attributes  */
            __state: 0, /* = dead */
            __state_guards: {},
            state_auto_increase: $cs.attribute("state_auto_increase", false),
            state_auto_decrease: $cs.attribute("state_auto_decrease", false)
        },
        protos: {
            /*  get state or set state (or at least trigger transition)  */
            state: function () {
                /*  special case: just retrieve current state  */
                var state_old = _cs.states[this.__state].state;
                if (arguments.length === 0)
                    return state_old;

                /*  determine parameters  */
                var params = $cs.params("state", arguments, {
                    state:    { pos: 0, req: true,
                                valid: function (s) { return _cs.state_name2idx(s) !== -1; } },
                    callback: { pos: 1, def: undefined },
                    sync:     {         def: false     }
                });

                /*  if requested state is still not reached...  */
                if (_cs.states[this.__state].state !== params.state) {
                    var enqueue = true;
                    var request = {
                        comp:     this,
                        state:    params.state,
                        callback: params.callback
                    };
                    if (params.sync) {
                        /*  perform new state transition request (synchronously)  */
                        if (_cs.state_progression_single(request))
                            enqueue = false;
                    }
                    if (enqueue) {
                        /*  enqueue new state transition request and trigger
                            state transition progression (asynchronously)  */
                        _cs.state_requests[this.id()] = request;
                        _cs.hook("ComponentJS:state-invalidate", "none", "requests");
                        _cs.state_progression();
                    }
                }
                else {
                    /*  still run its optional callback function  */
                    if (typeof params.callback === "function")
                        params.callback.call(this, params.state);
                }

                /*  return old (and perhaps still current) state  */
                return state_old;
            },

            /*  compare state of component  */
            state_compare: function () {
                /*  determine parameters  */
                var params = $cs.params("state", arguments, {
                    state: { pos: 0, req: true,
                             valid: function (s) { return _cs.state_name2idx(s) !== -1; } }
                });

                /*  determine index of state by name  */
                var state = _cs.state_name2idx(params.state);

                /*  compare given state against state of component  */
                return (this.__state - state);
            },

            /*  guard a state enter/leave method  */
            guard: function () {
                /*  determine parameters  */
                var params = $cs.params("guard", arguments, {
                    method: { pos: 0, valid: "string", req: true },
                    level:  { pos: 1, valid: "number", req: true }
                });

                /*  sanity check enter/leave method name  */
                var valid = false;
                var i;
                for (i = 0; i < _cs.states.length; i++) {
                    if (   _cs.states[i].enter === params.method ||
                           _cs.states[i].leave === params.method) {
                        valid = true;
                        break;
                    }
                }
                if (!valid)
                    throw _cs.exception("guard", "no such declared enter/leave method: \"" +
                          params.method + "\"");

                /*  ensure the guard slot exists  */
                if (!_cs.isdefined(this.__state_guards[params.method]))
                    this.__state_guards[params.method] = 0;

                /*  activate/deactivate guard  */
                var deactivate = false;
                if (params.level > 0)
                    /*  increase guard level  */
                    this.__state_guards[params.method] += params.level;
                else  if (params.level < 0) {
                    /*  decrease guard level  */
                    if (this.__state_guards[params.method] < (-params.level))
                        throw _cs.exception("guard", "guard level decrease request too large");
                    this.__state_guards[params.method] += params.level;
                    if (this.__state_guards[params.method] === 0)
                        deactivate = true;
                }
                else {
                    /*  reset guard level  */
                    this.__state_guards[params.method] = 0;
                    deactivate = true;
                }
                if (deactivate) {
                    /*  finally deactivate guard  */
                    delete this.__state_guards[params.method];

                    /*  give all pending state transitions
                        (which now might proceed) a chance  */
                    _cs.state_progression();
                }
            }
        }
    });

    /*  generic pattern: service  */
    $cs.pattern.service = $cs.trait({
        mixin: [
            $cs.pattern.eventing
        ],
        protos: {
            /*  register a service  */
            register: function () {
                /*  determine parameters  */
                var params = $cs.params("register", arguments, {
                    name:      { pos: 0,     req: true  },
                    ctx:       {             def: this  },
                    func:      { pos: 1,     req: true  },
                    args:      { pos: "...", def: []    },
                    spool:     {             def: null  },
                    capturing: {             def: false },
                    spreading: {             def: false },
                    bubbling:  {             def: true  }
                });

                /*  create command object to wrap service  */
                var cmd = $cs.command({
                    ctx:   params.ctx,
                    func:  params.func,
                    args:  params.args,
                    wrap:  true
                });

                /*  publish changes to command's callable status  */
                cmd.command.listen({
                    name: "attribute:set:enabled",
                    args: [ this, params.name ],
                    func: function (comp, name, value_new, value_old) {
                        comp.publish({
                            name:      "ComponentJS:service:" + name + ":callable",
                            args:      [ value_new, value_old ],
                            capturing: false,
                            spreading: false,
                            bubbling:  false,
                            async:     true,
                            noresult:  true
                        });
                    }
                });

                /*  subscribe to service event  */
                var id = this.subscribe({
                    name:      "ComponentJS:service:" + params.name,
                    ctx:       params.ctx,
                    func:      cmd,
                    noevent:   true,
                    capturing: params.capturing,
                    spreading: params.spreading,
                    bubbling:  params.bubbling,
                    exclusive: true
                });

                /*  optionally spool reverse operation  */
                if (params.spool !== null) {
                    var info = _cs.spool_spec_parse(this, params.spool);
                    info.comp.spool(info.name, this, "unregister", id);
                }

                return id;
            },

            /*  determine registration existence  */
            registration: function () {
                /*  determine parameters  */
                var params = $cs.params("registration", arguments, {
                    id: { pos: 0, req: true }
                });

                /*  determine whether registration exists  */
                return this.subscription(params.id);
            },

            /*  unregister a service  */
            unregister: function () {
                /*  determine parameters  */
                var params = $cs.params("unregister", arguments, {
                    id: { pos: 0, req: true }
                });

                /*  unsubscribe from service event  */
                this.unsubscribe(params.id);
                return;
            },

            /*  make a service callable (enable/disable it)  */
            callable: function () {
                /*  determine parameters  */
                var params = $cs.params("callable", arguments, {
                    name:  { pos: 0, req: true      },
                    value: { pos: 1, def: undefined }
                });

                /*  find service command  */
                var subscriptions = this._subscriptions(params.name);
                if (subscriptions.length !== 1)
                    return undefined;
                var cmd = subscriptions[0].func().command;

                /*  get or set "enabled" attribute  */
                return cmd.enabled(params.value);
            },

            /*  call a service  */
            call: function () {
                /*  determine parameters  */
                var params = $cs.params("call", arguments, {
                    name:      { pos: 0,     req: true   },
                    args:      { pos: "...", def: []     },
                    capturing: {             def: false  },
                    spreading: {             def: false  },
                    bubbling:  {             def: true   }
                });

                /*  dispatch service event onto target component  */
                var ev = this.publish({
                    name:         "ComponentJS:service:" + params.name,
                    args:         params.args,
                    capturing:    params.capturing,
                    spreading:    params.spreading,
                    bubbling:     params.bubbling,
                    firstonly:    true,
                    async:        false
                });

                /*  ensure that the service event was successfully dispatched
                    at least once (or our result value would have no meaning)  */
                if (!ev.dispatched())
                    throw _cs.exception("call", "no such registered service found:" +
                        " \"" + params.name + "\"");

                /*  return the result value  */
                return ev.result();
            }
        }
    });

    /*  generic pattern: shadow object  */
    $cs.pattern.shadow = $cs.trait({
        dynamics: {
            __obj: null
        },
        protos: {
            /*  get/set corresponding object  */
            obj: function (obj) {
                if (typeof obj === "undefined")
                    /*  get current object  */
                    return this.__obj;
                else if (typeof obj === "object") {
                    /*  set new object  */
                    if (obj !== null) {
                        _cs.annotation(obj, "comp", this);
                        this.__obj = obj;
                    }
                    else {
                        if (this.__obj !== null)
                            _cs.annotation(this.__obj, "comp", null);
                        this.__obj = null;
                    }
                }
                else
                    throw _cs.exception("obj", "invalid argument");
                return this;
            },

            /*  get/set attribute in corresponding object  */
            access: function (name, value) {
                /*  sanity check scenario  */
                if (typeof name === "undefined")
                    throw _cs.exception("access", "no attribute name given");
                var obj = this.obj();
                if (obj === null)
                    throw _cs.exception("access", "still no object attached");
                if (typeof obj[name] === "undefined")
                    throw _cs.exception("access", "invalid attribute \"" + name + "\"");

                /*  access the attribute  */
                var value_old = obj[name];
                if (typeof value !== "undefined")
                    obj[name] = value;
                return value_old;
            },

            /*  invoke method on corresponding object  */
            invoke: function (name) {
                /*  sanity check scenario  */
                if (typeof name === "undefined")
                    throw _cs.exception("invoke", "no method name given");
                var obj = this.obj();
                if (obj === null)
                    throw _cs.exception("invoke", "still no object attached");
                if (typeof obj[name] === "undefined")
                    throw _cs.exception("invoke", "invalid method \"" + name + "\"");
                if (_cs.istypeof(obj[name]) !== "function")
                    throw _cs.exception("invoke", "anything named \"" + name + "\" existing, but not a function");

                /*  call method  */
                var args = _cs.slice(arguments, 1);
                return obj[name].apply(obj, args);
            }
        }
    });

    /*  generic pattern: socket  */
    $cs.pattern.socket = $cs.trait({
        mixin: [
            $cs.pattern.tree,
            $cs.pattern.property
        ],
        dynamics: {
            __sockets: {},
            __plugs: {}
        },
        protos: {
            /*  define a socket  */
            socket: function () {
                /*  determine parameters  */
                var params = $cs.params("socket", arguments, {
                    name:   {         def: "default" },
                    scope:  {         def: null      },
                    ctx:    { pos: 0, req: true      },
                    plug:   { pos: 1, req: true      },
                    unplug: { pos: 2, req: true      },
                    spool:  {         def: null      }
                });

                /*  sanity check parameters  */
                if (   _cs.istypeof(params.plug) === "string" &&
                       _cs.istypeof(params.ctx[params.plug]) !== "function")
                    throw _cs.exception("socket", "no plug method named \"" + params.plug + "\" found on context object");
                else if (   _cs.istypeof(params.plug) !== "string" &&
                            _cs.istypeof(params.plug) !== "function")
                    throw _cs.exception("socket", "plug operation neither method name nor function");
                if (   _cs.istypeof(params.unplug) === "string" &&
                       _cs.istypeof(params.ctx[params.unplug]) !== "function")
                    throw _cs.exception("socket", "no unplug method named \"" + params.unplug + "\" found on context object");
                else if (   _cs.istypeof(params.unplug) !== "string" &&
                            _cs.istypeof(params.unplug) !== "function")
                    throw _cs.exception("socket", "unplug operation neither method name nor function");

                /*  remember parameters as (optionally scoped) component property  */
                var name = "ComponentJS:socket:" + params.name;
                if (params.scope !== null)
                    name += "@" + params.scope;
                $cs(this).property(name, params);

                /*  remember socket under an id  */
                var id = _cs.cid();
                this.__sockets[id] = name;

                /*  optionally spool reverse operation  */
                if (params.spool !== null) {
                    var info = _cs.spool_spec_parse(this, params.spool);
                    info.comp.spool(info.name, this, "unsocket", id);
                }

                return id;
            },

            /*  destroy a socket  */
            unsocket: function () {
                /*  determine parameters  */
                var params = $cs.params("unsocket", arguments, {
                    id: { pos: 0, req: true }
                });

                /*  remove  parameters from component  */
                if (typeof this.__sockets[params.id] === "undefined")
                    throw _cs.exception("unsocket", "socket not found");

                /*  remove corresponding property  */
                var name = this.__sockets[params.id];
                $cs(this).property(name, null);

                /*  remove socket information  */
                delete this.__sockets[params.id];
                return;
            },

            /*  create a linking/pass-through socket  */
            link: function () {
                /*  determine parameters  */
                var params = $cs.params("link", arguments, {
                    name:   {         def: "default" },
                    scope:  {         def: null      },
                    target: { pos: 0, req: true      },
                    socket: { pos: 1, req: true      },
                    spool:  {         def: null      }
                });

                /*  create a socket and pass-through the
                    plug/unplug operations to the target  */
                return this.socket({
                    name:   params.name,
                    scope:  params.scope,
                    spool:  params.spool,
                    ctx:    {},
                    plug:   function (obj) {
                        var id = _cs.annotation(obj, "link");
                        if (id !== null)
                            throw _cs.exception("link:plug: cannot plug, you have to unplug first");
                        id = $cs(params.target).plug({
                            name:      params.socket,
                            object:    obj,
                            targeting: true
                        });
                        _cs.annotation(obj, "link", id);
                    },
                    unplug: function (obj) {
                        var id = _cs.annotation(obj, "link");
                        if (id === null)
                            throw _cs.exception("link:unplug: cannot unplug, you have to plug first");
                        $cs(params.target).unplug({
                            id: id,
                            targeting: true
                        });
                        _cs.annotation(obj, "link", null);
                    }
                });
            },

            /*  destroy a link  */
            unlink: function () {
                /*  determine parameters  */
                var params = $cs.params("unlink", arguments, {
                    id: { pos: 0, req: true }
                });

                return this.unsocket(params.id);
            },

            /*  plug into a defined socket  */
            plug: function () {
                /*  determine parameters  */
                var params = $cs.params("plug", arguments, {
                    name:      {         def: "default" },
                    object:    { pos: 0, req: true      },
                    spool:     {         def: null      },
                    targeting: {         def: false     }
                });

                /*  remember plug operation  */
                var id = _cs.cid();
                this.__plugs[id] = params;

                /*  pass-though operation to common helper function  */
                _cs.plugger("plug", this, params.name, params.object, params.targeting);

                /*  optionally spool reverse operation  */
                if (params.spool !== null) {
                    var info = _cs.spool_spec_parse(this, params.spool);
                    info.comp.spool(info.name, this, "unplug", id);
                }

                return id;
            },

            /*  unplug from a defined socket  */
            unplug: function () {
                /*  determine parameters  */
                var params = $cs.params("unplug", arguments, {
                    id:        { pos: 0, req: true  },
                    targeting: {         def: false }
                });

                /*  determine plugging information  */
                if (typeof this.__plugs[params.id] === "undefined")
                    throw _cs.exception("unplug", "plugging not found");
                var name   = this.__plugs[params.id].name;
                var object = this.__plugs[params.id].object;

                /*  pass-though operation to common helper function  */
                _cs.plugger("unplug", this, name, object, params.targeting);

                /*  remove plugging  */
                delete this.__plugs[params.id];
                return;
            }
        }
    });

    /*  internal "plug/unplug to socket" helper functionality  */
    _cs.plugger = function (op, origin, name, object, targeting) {
        /*  resolve the socket property on the parents components
            NOTICE 1: we explicitly skip the origin component here as
                      resolving the socket property also on the origin
                      component might otherwise return the potentially existing
                      socket for the child components of the orgin component.
            NOTICE 2: we intentionally skip the origin and do not directly
                      resolve on the parent component as we want to take
                      scoped sockets (on the parent component) into account!  */
        var property = "ComponentJS:socket:" + name;
        var socket = origin.property({ name: property, targeting: targeting });
        if (!_cs.isdefined(socket))
            throw _cs.exception(op, "no socket found on parent component(s)");

        /*  determine the actual component owning the socket (for logging purposes only)  */
        var owner = origin.property({ name: property, targeting: targeting, returnowner: true });
        $cs.debug(1, "socket: " + owner.path("/") + ": " + name +
            " <--(" + op + ")-- " + origin.path("/"));

        /*  perform plug/unplug operation  */
        if (_cs.istypeof(socket[op]) === "string")
            socket.ctx[socket[op]].call(socket.ctx, object, origin);
        else if (_cs.istypeof(socket[op]) === "function")
            socket[op].call(socket.ctx, object, origin);
        else
            throw _cs.exception(op, "failed to perform \"" + op + "\" operation");
    };

    /*  utility function: mark a component  */
    $cs.mark = function (obj, name) {
        var marker = _cs.annotation(obj, "marker");
        if (marker === null)
            marker = {};
        marker[name] = true;
        _cs.annotation(obj, "marker", marker);
    };

    /*  utility function: determine whether a component is marked  */
    $cs.marked = function (obj, name) {
        var marker = _cs.annotation(obj, "marker");
        if (marker === null)
            marker = {};
        return (marker[name] === true);
    };

    /*  generic pattern for marking components  */
    $cs.pattern.marker = $cs.trait({
        protos: {
            mark: function (name) {
                $cs.mark(this.obj(), name);
            },
            marked: function (name) {
                return $cs.marked(this.obj(), name);
            }
        }
    });

    /*  convenient marker traits  */
    $cs.marker = {
        service:    $cs.trait({ cons: function () { $cs.mark(this, "service");    } }),
        controller: $cs.trait({ cons: function () { $cs.mark(this, "controller"); } }),
        model:      $cs.trait({ cons: function () { $cs.mark(this, "model");      } }),
        view:       $cs.trait({ cons: function () { $cs.mark(this, "view");       } })
    };

    /*  load store via optional plugin  */
    _cs.store_load = function (comp) {
        if (comp.__store === null) {
            _cs.hook("ComponentJS:store-load", "none", comp);
            if (   comp.__store === null ||
                   typeof comp.__store !== "object")
                comp.__store = {};
        }
    };

    /*  save store via optional plugin  */
    _cs.store_save = function (comp) {
        if (comp.__store !== null)
            _cs.hook("ComponentJS:store-save", "none", comp);
    };

    /*  generic pattern for store management  */
    $cs.pattern.store = $cs.trait({
        dynamics: {
            __store: null
        },
        protos: {
            store: function () {
                var key, val;
                if (arguments.length === 0) {
                    /*  get all keys  */
                    _cs.store_load(this);
                    var keys = [];
                    for (key in this.__store)
                        keys.push(key);
                    return keys;
                }
                else if (arguments.length === 1 && arguments[0] === null) {
                    /*  clear store  */
                    this.__store = {};
                    _cs.store_save(this);
                    return null;
                }
                else if (arguments.length === 1 && typeof arguments[0] === "string") {
                    /*  get value  */
                    _cs.store_load(this);
                    key = arguments[0];
                    if (typeof this.__store[key] === "undefined")
                        return null;
                    else
                        return this.__store[key];
                }
                else if (arguments.length === 2 && arguments[1] === null) {
                    /*  delete value  */
                    _cs.store_load(this);
                    key = arguments[0];
                    delete this.__store[key];
                    _cs.store_save(this);
                    return null;
                }
                else if (arguments.length === 2) {
                    /*  set value  */
                    _cs.store_load(this);
                    key = arguments[0];
                    val = arguments[1];
                    this.__store[key] = val;
                    _cs.store_save(this);
                    return val;
                }
                else
                     throw _cs.exception("store", "invalid argument(s)");
            }
        }
    });

    /*  generic pattern for model management  */
    $cs.pattern.model = $cs.trait({
        protos: {
            /*  define model  */
            model: function () {
                /*  determine parameters  */
                var params = $cs.params("model", arguments, {
                    model: { pos: 0, def: null }
                });

                /*  simplify further processing  */
                var model = params.model;
                if (model === null)
                    model = undefined;

                /*  sanity check model  */
                var name;
                if (_cs.isdefined(model)) {
                    for (name in model) {
                        if (typeof model[name].value === "undefined")
                            model[name].value = "";
                        if (typeof model[name].valid === "undefined")
                            model[name].valid = "string";
                        if (typeof model[name].autoreset === "undefined")
                            model[name].autoreset = false;
                        if (typeof model[name].store === "undefined")
                            model[name].store = false;
                        for (var key in model[name]) {
                            if (key !== "value" && key !== "valid" && key !== "autoreset" && key !== "store")
                                throw _cs.exception("model", "invalid specification key \"" +
                                    key + "\" in specification of model field \"" + name + "\"");
                        }
                        if (!$cs.validate(model[name].value, model[name].valid))
                            throw _cs.exception("model", "model field \"" + name + "\" has " +
                                "default value " + _cs.json(model[name].value) + ", which does not validate " +
                                "against validation \"" + model[name].valid + "\"");
                    }
                }

                /*  try to load stored model values  */
                var store = this.store("model");
                if (store !== null) {
                    if (_cs.isdefined(model)) {
                        for (name in model) {
                            if (model[name].store) {
                                if (_cs.isdefined(store[name]))
                                    model[name].value = store[name];
                            }
                        }
                    }
                }

                /*  retrieve old model  */
                var model_old = this.property({ name: "ComponentJS:model", bubbling: false });

                /*  store model  */
                if (_cs.isdefined(model)) {
                    if (_cs.isdefined(model_old)) {
                        /*  merge model into existing one  */
                        var model_new = {};
                        _cs.extend(model_new, model_old);
                        _cs.extend(model_new, model);
                        this.property("ComponentJS:model", model_new);
                        model = model_new;
                    }
                    else {
                        /*  set initial model  */
                        this.property("ComponentJS:model", model);
                    }

                    /*  optionally save stored model values  */
                    store = {};
                    var save = false;
                    for (name in model) {
                        if (model[name].store) {
                            store[name] = model[name].value;
                            save = true;
                        }
                    }
                    if (save)
                        this.store("model", store);
                }

                /*  return old model  */
                return model_old;
            },

            /*  get/set model value  */
            value: function () {
                /*  determine parameters  */
                var params = $cs.params("value", arguments, {
                    name:        { pos: 0, req: true      },
                    value:       { pos: 1, def: undefined },
                    force:       { pos: 2, def: false     },
                    returnowner: {         def: false     }
                });

                /*  determine component owning model with requested value  */
                var owner = null;
                var model = null;
                var comp = this;
                while (comp !== null) {
                    owner = comp.property({ name: "ComponentJS:model", returnowner: true });
                    if (!_cs.isdefined(owner))
                        throw _cs.exception("value", "no model found containing value \"" + params.name + "\"");
                    model = owner.property("ComponentJS:model");
                    if (_cs.isdefined(model[params.name]))
                        break;
                    comp = owner.parent();
                }
                if (comp === null)
                    throw _cs.exception("value", "no model found containing value \"" + params.name + "\"");

                /*  get new model value  */
                var value_new = params.value;

                /*  get old model value  */
                var ev;
                var value_old = model[params.name].value;
                var result;
                if (typeof value_new === "undefined") {
                    if (owner.property({ name: "ComponentJS:model:subscribers:get", bubbling: false }) === true) {
                        /*  send event to observers for value get and allow observers
                            to reject value get operation and/or change old value to get  */
                        ev = owner.publish({
                            name:      "ComponentJS:model:" + params.name + ":get",
                            args:      [ value_old ],
                            capturing: false,
                            spreading: false,
                            bubbling:  false,
                            async:     false
                        });
                        if (ev.processing()) {
                            /*  re-fetch value from model
                                (in case the callback set a new value directly)  */
                            value_old = model[params.name].value;

                            /*  allow value to be overridden by event result  */
                            result = ev.result();
                            if (typeof result !== "undefined")
                                value_old = result;
                        }
                    }
                }

                /*  optionally set new model value  */
                if (   typeof value_new !== "undefined" &&
                       (params.force || value_old !== value_new)) {

                    /*  check validity of new value  */
                    if (!$cs.validate(value_new, model[params.name].valid))
                        throw _cs.exception("value", "model field \"" + params.name + "\" receives " +
                            "new value " + _cs.json(value_new) + ", which does not validate " +
                            "against validation \"" + model[params.name].valid + "\"");

                    /*  send event to observers for value set operation and allow observers
                        to reject value set operation and/or change new value to set  */
                    var cont = true;
                    if (owner.property({ name: "ComponentJS:model:subscribers:set", bubbling: false }) === true) {
                        ev = owner.publish({
                            name:      "ComponentJS:model:" + params.name + ":set",
                            args:      [ value_new, value_old ],
                            capturing: false,
                            spreading: false,
                            bubbling:  false,
                            async:     false
                        });
                        if (!ev.processing())
                            cont = false;
                        else {
                            /*  allow value to be overridden  */
                            result = ev.result();
                            if (typeof result !== "undefined")
                                value_new = result;
                        }
                    }
                    if (cont && !model[params.name].autoreset) {
                        /*  set value in model  */
                        model[params.name].value = value_new;

                        /*  synchronize model with underlying store  */
                        if (model[params.name].store) {
                            var store = owner.store("model");
                            store[params.name] = model[params.name].value;
                            owner.store("model", store);
                        }

                        /*  send event to observers after value finally changed  */
                        if (owner.property({ name: "ComponentJS:model:subscribers:changed", bubbling: false }) === true) {
                            owner.publish({
                                name:      "ComponentJS:model:" + params.name + ":changed",
                                args:      [ value_new, value_old ],
                                noresult:  true,
                                capturing: false,
                                spreading: false,
                                bubbling:  false,
                                async:     true
                            });
                        }
                    }
                }

                /*  return old model value  */
                return (params.returnowner ? owner : value_old);
            },

            /*  touch a model value and trigger event  */
            touch: function () {
                /*  determine parameters  */
                var params = $cs.params("touch", arguments, {
                    name: { pos: 0, req: true }
                });

                /*  simply force value to same value in order to trigger event  */
                this.value({
                    name: params.name,
                    value: this.value(params.name),
                    force: true
                });
            },

            /*  start observing model value change  */
            observe: function () {
                /*  determine parameters  */
                var params = $cs.params("observe", arguments, {
                    name:      { pos: 0, req: true  },
                    func:      { pos: 1, req: true  },
                    touch:     {         def: false },
                    operation: {         def: "set" },
                    spool:     {         def: null  }
                });

                /*  determine the actual component owning the model
                    as we want to subscribe the change event there only  */
                var owner = null;
                var model = null;
                var comp = this;
                while (comp !== null) {
                    owner = comp.property({ name: "ComponentJS:model", returnowner: true });
                    if (!_cs.isdefined(owner))
                        throw _cs.exception("observe", "no model found containing value \"" + params.name + "\"");
                    model = owner.property("ComponentJS:model");
                    if (_cs.isdefined(model[params.name]))
                        break;
                    comp = owner.parent();
                }
                if (comp === null)
                    throw _cs.exception("observe", "no model found containing value \"" + params.name + "\"");

                /*  subscribe to model value change event  */
                var id = owner.subscribe({
                    name:      "ComponentJS:model:" + params.name + ":" + params.operation,
                    capturing: false,
                    spreading: false,
                    bubbling:  false,
                    func:      params.func
                });

                /*  mark component for having subscribers of operation
                    (for performance optimization reasons)  */
                owner.property("ComponentJS:model:subscribers:" + params.operation, true);

                /*  optionally spool reverse operation  */
                if (params.spool !== null) {
                    var info = _cs.spool_spec_parse(this, params.spool);
                    info.comp.spool(info.name, this, "unobserve", id);
                }

                /*  if requested, touch the model value once (for an initial observer run)  */
                if (params.touch)
                    this.touch(params.name);

                return id;
            },

            /*  stop observing model value change  */
            unobserve: function () {
                /*  determine parameters  */
                var params = $cs.params("unobserve", arguments, {
                    id: { pos: 0, req: true }
                });

                /*  determine the actual component owning the model
                    as we want to unsubscribe the change event there only  */
                var owner = null;
                var comp = this;
                while (comp !== null) {
                    owner = comp.property({ name: "ComponentJS:model", returnowner: true });
                    if (!_cs.isdefined(owner))
                        throw _cs.exception("unobserve", "no model subscription found");
                    if (owner.subscription(params.id))
                        break;
                    comp = owner.parent();
                }
                if (comp === null)
                    throw _cs.exception("unobserve", "no model subscription found");

                /*  subscribe to model value change event  */
                owner.unsubscribe(params.id);
            }
        }
    });


    /*
    **  COMPONENT API
    */

    /*  component class definition (placeholder)  */
    _cs.comp = null;

    /*  singleton component instances (placeholder)  */
    _cs.none = null;
    _cs.root = null;

    /*  component mixins (default)  */
    _cs.comp_mixins = [
        $cs.pattern.id,
        $cs.pattern.name,
        $cs.pattern.tree,
        $cs.pattern.config,
        $cs.pattern.spool,
        $cs.pattern.state,
        $cs.pattern.service,
        $cs.pattern.eventing,
        $cs.pattern.property,
        $cs.pattern.shadow,
        $cs.pattern.socket,
        $cs.pattern.model,
        $cs.pattern.store,
        $cs.pattern.marker
    ];

    /*  component constructor  */
    _cs.comp_cons = function (name, parent, children) {
        /*  component marking  */
        _cs.annotation(this, "type", "component");
        if (_cs.istypeof(name) !== "string")
            name = "<unknown>";
        this.name(name);

        /*  component tree and object attachment  */
        this.parent(_cs.istypeof(parent) === "object" ? parent : null);
        this.children(_cs.istypeof(children) === "array" ? children : []);
    };

    /*  component prototype methods  */
    _cs.comp_protos = {
        /*  create a sub-component  */
        create: function () {
            return $cs.create.apply(this, _cs.concat([ this ], arguments));
        },

        /*  destroy sub-component (or just this component) */
        destroy: function () {
            return $cs.destroy.apply(this, _cs.concat([ this ], arguments));
        },

        /*  check for existance of a component  */
        exists: function () {
            return (this.name() !== "<none>");
        }
    };

    /*  internal bootstrapping flag  */
    _cs.bootstrapped = false;

    /*  initialize library  */
    $cs.bootstrap = function () {
        /*  sanity check environment  */
        if (_cs.bootstrapped)
            throw _cs.exception("bootstrap", "library already bootstrapped");

        /*  give plugins a chance to modify the component class definition  */
        _cs.hook("ComponentJS:bootstrap:comp:mixin",  "none", _cs.comp_mixins);
        _cs.hook("ComponentJS:bootstrap:comp:protos", "none", _cs.comp_protos);

        /*  lazy define component class
            (to give plugins a chance to have added mixins)  */
        _cs.comp = $cs.clazz({
            mixin:   _cs.comp_mixins,
            cons:    _cs.comp_cons,
            protos:  _cs.comp_protos
        });

        /*  create singleton component: root of the tree */
        _cs.root = new _cs.comp("<root>", null, []);

        /*  create singleton component: special return value on lookups */
        _cs.none = new _cs.comp("<none>", null, []);

        /*  reasonable error catching for _cs.none usage
            ATTENTION: method "exists" intentionally is missing here,
                       because it is required to be called on _cs.none, of course!  */
        var methods = [
            "call", "callable", "create", "destroy", "guard", "hook", "invoke",
            "latch", "link", "model", "observe", "plug", "property",
            "publish", "register", "registration", "socket", "spool",
            "spooled", "state", "state_compare", "store", "subscribe",
            "subscription", "touch", "unlatch", "unobserve", "unplug",
            "unregister", "unspool", "unsubscribe", "value"
        ];
        _cs.foreach(methods, function (method) {
            _cs.none[method] = function () {
                throw _cs.exception(method, "no such component " +
                    "(you are calling method \"" + method + "\" on component \"<none>\")");
            };
        });

        /*  give plugins a chance to bootstrap, too  */
        _cs.hook("ComponentJS:bootstrap", "none");

        /*  set new state  */
        _cs.bootstrapped = true;

        return;
    };

    /*  shutdown library  */
    $cs.shutdown = function () {
        /*  sanity check environment  */
        if (!_cs.bootstrapped)
            throw _cs.exception("shutdown", "library still not bootstrapped");

        /*  give plugins a chance to shutdown, too  */
        _cs.hook("ComponentJS:shutdown", "none");

        /*  tear down the whole component tree  */
        _cs.foreach(_cs.root.children(), function (child) {
            child.destroy();
        });
        _cs.root.state({ state: "dead", sync: true });

        /*  destroy singleton "<none>" component  */
        _cs.none = null;

        /*  destroy singleton "<root>" component  */
        _cs.root = null;

        /*  destroy component class  */
        _cs.comp = null;

        /*  set new state  */
        _cs.bootstrapped = false;

        return;
    };

    /*  lookup component by path  */
    _cs.lookup = function (base, path) {
        /*  handle special calling conventions  */
        if (arguments.length === 1) {
            if (_cs.istypeof(arguments[0]) === "string") {
                /*  special calling via path only: $cs("foo") -> $cs(_cs.root, "foo") */
                path = base;
                base = _cs.root;
            }
            else
                /*  special calling via base only: $cs(this) -> $cs(this, "") */
                path = "";
        }

        /*  handle special cases for path in advance  */
        if (typeof path !== "string")
            return _cs.none;
        else if (path === "<root>")
            return _cs.root;
        else if (path === "<none>")
            return _cs.none;

        /*  bootstrap component matching  */
        var comp;
        if (path.substr(0, 1) === "/") {
            /*  ignore base  */
            comp = _cs.root;
            path = path.substring(1);
        }
        else {
            /*  use base  */
            var base_type = _cs.istypeof(base);
            var base_comp = _cs.annotation(base, "comp");
            if (base_type !== "component" && base_comp !== null)
                /*  success: found component object via shadow object  */
                comp = base_comp;
            else if (base_type !== "component")
                /*  failure: found other object which is not already component  */
                throw _cs.exception("lookup", "invalid base component (type is \"" + base_type + "\")");
            else
                /*  success: found component object  */
                comp = base;
        }

        if (path !== "") {
            /*  lookup components  */
            var comps = [];
            _cs.lookup_step(comps, comp, path.split("/"), 0);

            /*  post-process component result set  */
            if (comps.length === 0)
                /*  no component found  */
                comp = _cs.none;
            else if (comps.length === 1)
                /*  single and hence unambitous component found  */
                comp = comps[0];
            else {
                /*  more than one result found: try to reduce duplicates first  */
                var seen = {};
                comps = _cs.filter(comps, function (comp) {
                    var id = comp.id();
                    var take = (typeof seen[id] === "undefined");
                    seen[id] = true;
                    return take;
                });
                if (comps.length === 1)
                    /*  after de-duplication now only a single component found  */
                    comp = comps[0];
                else {
                    /*  error: still more than one component found  */
                    var components = "";
                    for (var i = 0; i < comps.length; i++)
                        components += " " + comps[i].path("/");
                    throw _cs.exception("lookup",
                        "ambiguous component path \"" + path + "\" at " + comp.path("/") + ": " +
                        "expected only 1 component, but found " + comps.length + " components:" +
                        components
                    );
                }
            }
        }

        /*  return component  */
        return comp;
    };

    /*  lookup component(s) at "comp", reachable via path segment "path[i]"  */
    _cs.lookup_step = function (result, comp, path, i) {
        var j, children, nodes;
        if (i >= path.length)
            /*  stop recursion  */
            result.push(comp);
        else if (path[i] === ".")
            /*  CASE 1: current component (= no-op)  */
            _cs.lookup_step(result, comp, path, i + 1);                /* RECURSION */
        else if (path[i] === "..") {
            /*  CASE 2: parent component  */
            if (comp.parent() !== null)
                _cs.lookup_step(result, comp.parent(), path, i + 1);   /* RECURSION */
        }
        else if (path[i] === "*") {
            /*  CASE 3: all child components  */
            children = comp.children();
            for (j = 0; j < children.length; j++)
                _cs.lookup_step(result, children[j], path, i + 1);     /* RECURSION */
        }
        else if (path[i] === "") {
            /*  CASE 4: all descendent components  */
            nodes = comp.walk_down(function (depth, node, nodes, depth_first) {
                if (!depth_first)
                    nodes.push(node);
                return nodes;
            }, []);
            for (j = 0; j < nodes.length; j++)
                _cs.lookup_step(result, nodes[j], path, i + 1);        /* RECURSION */
        }
        else {
            /*  CASE 5: a specific child component  */
            children = comp.children();
            for (j = 0; j < children.length; j++) {
                if (children[j].name() === path[i]) {
                    _cs.lookup_step(result, children[j], path, i + 1); /* RECURSION */
                    break;
                }
            }
        }
    };

    /*  top-level API: create one or more components  */
    $cs.create = function () {
        /*  sanity check environment  */
        if (!_cs.bootstrapped) {
            /*  give warning but still be backward compatible  */
            var msg = "ComponentJS: WARNING: component system still not bootstrapped " +
                "(please call \"bootstrap\" method before first \"create\" method call!)";
            /* global alert:false */
            if (typeof alert === "function")
                alert(msg);
            /* global console:false */
            else if (typeof console !== "undefined" && typeof console.log === "function")
                console.log(msg);
            $cs.bootstrap();
        }

        /*  sanity check arguments  */
        if (arguments.length < 2)
            throw _cs.exception("create", "invalid number of arguments");

        /*  initialize processing state  */
        var k = 0;
        var comp = null;
        var base = null;
        var base_stack = [];

        /*  determine base component  */
        if (_cs.istypeof(arguments[k]) === "string") {
            if (arguments[k].substr(0, 1) !== "/")
                throw _cs.exception("create", "either base component has to be given " +
                     "or the tree specification has to start with the root component (\"/\")");
            comp = _cs.root;
        }
        else {
            base = arguments[k++];
            if (_cs.istypeof(base) !== "component") {
                base = _cs.annotation(base, "comp");
                if (base === null)
                    throw _cs.exception("create", "invalid base argument " +
                        "(not an object attached to a component)");
            }
        }

        /*  tokenize the tree specification  */
        var token = [];
        var spec = arguments[k++];
        var m;
        while (spec !== "") {
            m = spec.match(/^\s*([^\/{},]+|[\/{},])/);
            if (m === null)
                break;
            token.push(m[1]);
            spec = spec.substr(m[1].length);
        }

        /*  return the tree specification, marked at token k  */
        var at_pos = function (token, k) {
            var str = "";
            for (var i = 0; i < k && i < token.length; i++)
                str += token[i];
            if (i < token.length) {
                str += "<";
                str += token[i++];
                str += ">";
                for (; i < token.length; i++)
                    str += token[i];
            }
            return str;
        };

        /*  iterate over all tokens...  */
        for (var i = 0; i < token.length; i++) {
            if (token[i] === "/") {
                /*  switch base  */
                if (comp === null)
                    throw _cs.exception("create", "no parent component for step-down at " + at_pos(token, i));
                base = comp;
            }
            else if (token[i] === "{") {
                /*  save base  */
                base_stack.push(base);
            }
            else if (token[i] === ",") {
                /*  reset base  */
                if (base_stack.length === 0)
                    throw _cs.exception("create", "no open brace section for parallelism at " + at_pos(token, i));
                base = base_stack[base_stack.length - 1];
            }
            else if (token[i] === "}") {
                /*  restore base  */
                if (base_stack.length === 0)
                    throw _cs.exception("create", "no more open brace section for closing at " + at_pos(token, i));
                base = base_stack.pop();
                comp = null;
            }
            else {
                /*  create new component  */
                if (base === null)
                    throw _cs.exception("create", "no base component at " + at_pos(token, i));
                comp = _cs.create_single(base, token[i], arguments[k++]);
            }
        }
        if (base_stack.length > 0)
            throw _cs.exception("create", "still open brace sections at end of tree specification");

        /*  return (last created) component  */
        return comp;
    };

    /*  internal: create a single component  */
    _cs.create_single = function (base, path, clazz) {
        /*  sanity check parameters  */
        if (typeof path !== "string")
            throw _cs.exception("create", "invalid path argument (not a string)");

        /*  split path into existing tree and the not existing component leaf node  */
        var m = path.match(/^(.*?)\/?([^\/]+)$/);
        if (!m[0])
            throw _cs.exception("create", "invalid path \"" + path + "\"");
        var path_tree = m[1];
        var path_leaf = m[2];

        /*  create new component id  */
        var id = _cs.cid();

        /*  substitute special "{id}" constructs in leaf path  */
        path_leaf = path_leaf.replace(/\{id\}/g, id);

        /*  lookup parent component (has to be existing)  */
        var comp_parent = _cs.lookup(base, path_tree);
        if (comp_parent === _cs.none)
            throw _cs.exception("create", "parent component path \"" +
                path_tree + "\" not already existing (please create first)");

        /*  attempt to lookup leaf component (has to be not existing)  */
        var comp = _cs.lookup(comp_parent, path_leaf);
        if (comp !== _cs.none)
            throw _cs.exception("create", "leaf component path \"" +
                path_leaf + "\" already existing (please destroy first)");

        /*  instanciate class  */
        var obj = null;
        switch (_cs.istypeof(clazz)) {
            case "clazz":
            case "trait":
            case "function":
                /*  standard case: $cs.create(..., MyClass)
                    ComponentJS clazz/trait or foreign "class"  */
                obj = new clazz();
                break;
            case "object":
                /*  special case: $cs.create(..., new MyClass(arg1, arg2))
                    manual instanciation because of parameter passing  */
                obj = clazz;
                break;
            case "null":
                /*  special case: $cs.create(..., null)
                    early component create & late object attachment  */
                break;
            default:
                throw _cs.exception("create", "invalid class argument");
        }

        /*  create new corresponding component object in tree  */
        comp = new _cs.comp(path_leaf);

        /*  mark with component id  */
        comp.id(id);

        /*  attach to tree  */
        comp.attach(comp_parent);

        /*  remember bi-directional relationship between component and object  */
        comp.obj(obj);

        /*  debug hint  */
        $cs.debug(1, "component: " + comp.path("/") + ": created component [" + comp.id() + "]");

        /*  give plugins a chance to react (before creation of a component)  */
        _cs.hook("ComponentJS:comp-created", "none", comp);

        /*  switch state from "dead" to "created"
            (here synchronously as one expects that after a creation of a
            component, the state is really already "created", of course)  */
        comp.state({ state: "created", sync: true });

        /*  give plugins a chance to react (after creation of a component)  */
        _cs.hook("ComponentJS:state-invalidate", "none", "components");
        _cs.hook("ComponentJS:state-change", "none");

        /*  return new component  */
        return comp;
    };

    /*  top-level API: destroy a component  */
    $cs.destroy = function () {
        /*  sanity check arguments  */
        if (arguments.length !== 1 && arguments.length !== 2)
            throw _cs.exception("destroy", "invalid number of arguments");

        /*  determine component  */
        var comp = _cs.lookup.apply(this, arguments);
        if (comp === _cs.none)
            throw _cs.exception("destroy", "no such component found to destroy");
        else if (comp === _cs.root)
            throw _cs.exception("destroy", "root component cannot be destroyed");
        var path = comp.path("/");
        var id   = comp.id();

        /*  switch component state to "dead"
            (here synchronously as one expects that after a destruction of a
            component, the state is really already "dead", of course)  */
        comp.state({ state: "dead", sync: true });

        /*  give plugins a chance to react (before final destruction of a component)  */
        _cs.hook("ComponentJS:comp-destroyed", "none", comp);

        /*  detach component from component tree  */
        comp.detach();

        /*  remove bi-directional relationship between component and object  */
        comp.obj(null);

        /*  debug hint  */
        $cs.debug(1, "component: " + path + ": destroyed component [" + id + "]");

        /*  give plugins a chance to react (after final destruction of a component)  */
        _cs.hook("ComponentJS:state-invalidate", "none", "components");
        _cs.hook("ComponentJS:state-change", "none");

        return;
    };

    /*  define a state transition  */
    $cs.transition = function () {
        /*  special case  */
        if (arguments.length === 1 && arguments[0] === null) {
            /*  remove all user-defined transitions  */
            _cs.states_clear();
            return;
        }

        /*  determine parameters  */
        var params = $cs.params("transition", arguments, {
            target: { pos: 0, req: true      },
            enter:  { pos: 1, req: true      },
            leave:  { pos: 2, req: true      },
            color:  { pos: 3, def: "#000000" },
            source: {         def: null      }
        });

        /*  add new state  */
        _cs.states_add(
            params.target,
            params.enter,
            params.leave,
            params.color,
            params.source
        );
    };

    /*  initialize state transition set with a reasonable default  */
    $cs.transition("created",      "create",  "destroy",  "#cc3333"); /* created and attached to component tree */
    $cs.transition("configured",   "setup",   "teardown", "#eabc43"); /* configured and wired */
    $cs.transition("prepared",     "prepare", "cleanup",  "#f2ec00"); /* prepared and ready for rendering */
    $cs.transition("materialized", "render",  "release",  "#6699cc"); /* rendered onto the DOM tree */
    $cs.transition("visible",      "show",    "hide",     "#669933"); /* visible to the user */
    $cs.transition("enabled",      "enable",  "disable",  "#336600"); /* enabled for interaction */


    /*
    **  GLOBAL LIBRARY EXPORTING
    */

    /*  export our global API...  */
    if (   (   typeof EXPORTS === "object" &&
               typeof GLOBAL.ComponentJS_export === "undefined") ||
           (   typeof GLOBAL.ComponentJS_export !== "undefined" &&
               GLOBAL.ComponentJS_export === "CommonJS"        ))
        /*  ...to scoped CommonJS environment  */
        EXPORTS.ComponentJS = $cs;
    else if (   (   typeof DEFINE === "function" &&
                    typeof DEFINE.amd === "object" &&
                    typeof GLOBAL.ComponentJS_export === "undefined") ||
                (   typeof GLOBAL.ComponentJS_export !== "undefined" &&
                    GLOBAL.ComponentJS_export === "AMD"             ))
        /*  ...to scoped AMD environment  */
        DEFINE("ComponentJS", function () {
            return $cs;
        });
    else {
        /*  ...to regular global environment  */
        $cs.symbol("ComponentJS");
    }

    /*  internal plugin registry  */
    _cs.plugins = {};

    /*  external plugin API  */
    $cs.plugin = function (name, callback) {
        if (arguments.length === 0) {
            /*  use case 1: return list of registered plugins  */
            var plugins = [];
            for (name in _cs.plugins) {
                if (!_cs.isown(_cs.plugins, name))
                    continue;
                plugins.push(name);
            }
            return plugins;
        }
        else if (arguments.length === 1) {
            /*  use case 2: check whether particular plugin was registered  */
            if (typeof name !== "string")
                throw _cs.exception("plugin", "invalid plugin name parameter");
            return (typeof _cs.plugins[name] !== "undefined");
        }
        else if (arguments.length === 2) {
            /*  use case 3: register a new plugin  */
            if (typeof name !== "string")
                throw _cs.exception("plugin", "invalid plugin name parameter");
            if (typeof _cs.plugins[name] !== "undefined")
                throw _cs.exception("plugin", "plugin named \"" + name + "\" already registered");
            callback.call(this, _cs, $cs, GLOBAL);
            _cs.plugins[name] = true;
        }
        else
            throw _cs.exception("plugin", "invalid number of parameters");
    };


})(
    /* global window:false */
    /* global global:false */
    /* global exports:false */
    /* global define:false */
    ( typeof window   !== "undefined" ?
          window :
          ( typeof global !== "undefined" ?
              global :
              ( typeof this !== "undefined" ?
                  this :
                  {} ))),
    ( typeof exports === "object" ?
          exports :
          undefined ),
    ( typeof define === "function" ?
          define :
          undefined )
);
