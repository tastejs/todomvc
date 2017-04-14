/*--------------------------------------------------------------------------
 * linq.js - LINQ for JavaScript
 * ver 3.0.3-Beta4 (Oct. 9th, 2012)
 *
 * created and maintained by neuecc <ils@neue.cc>
 * licensed under MIT License
 * http://linqjs.codeplex.com/
 *------------------------------------------------------------------------*/

(function (root, undefined) {
    // ReadOnly Function
    var Functions = {
        Identity: function (x) { return x; },
        True: function () { return true; },
        Blank: function () { }
    };

    // const Type
    var Types = {
        Boolean: typeof true,
        Number: typeof 0,
        String: typeof "",
        Object: typeof {},
        Undefined: typeof undefined,
        Function: typeof function () { }
    };

    // private utility methods
    var Utils = {
        // Create anonymous function from lambda expression string
        createLambda: function (expression) {
            if (expression == null) return Functions.Identity;
            if (typeof expression == Types.String) {
                if (expression == "") {
                    return Functions.Identity;
                }
                else if (expression.indexOf("=>") == -1) {
                    var regexp = new RegExp("[$]+", "g");

                    var maxLength = 0;
                    var match;
                    while (match = regexp.exec(expression)) {
                        var paramNumber = match[0].length;
                        if (paramNumber > maxLength) {
                            maxLength = paramNumber;
                        }
                    }

                    var argArray = [];
                    for (var i = 1; i <= maxLength; i++) {
                        var dollar = "";
                        for (var j = 0; j < i; j++) {
                            dollar += "$";
                        }
                        argArray.push(dollar);
                    }

                    var args = Array.prototype.join.call(argArray, ",");

                    return new Function(args, "return " + expression);
                }
                else {
                    var expr = expression.match(/^[(\s]*([^()]*?)[)\s]*=>(.*)/);
                    return new Function(expr[1], "return " + expr[2]);
                }
            }
            return expression;
        },

        isIEnumerable: function (obj) {
            if (typeof Enumerator !== Types.Undefined) {
                try {
                    new Enumerator(obj); // check JScript(IE)'s Enumerator
                    return true;
                }
                catch (e) { }
            }

            return false;
        },

        // IE8's defineProperty is defined but cannot use, therefore check defineProperties
        defineProperty: (Object.defineProperties != null)
            ? function (target, methodName, value) {
                Object.defineProperty(target, methodName, {
                    enumerable: false,
                    configurable: true,
                    writable: true,
                    value: value
                })
            }
            : function (target, methodName, value) {
                target[methodName] = value;
            },

        compare: function (a, b) {
            return (a === b) ? 0
                 : (a > b) ? 1
                 : -1;
        },

        dispose: function (obj) {
            if (obj != null) obj.dispose();
        }
    };

    // IEnumerator State
    var State = { Before: 0, Running: 1, After: 2 };

    // "Enumerator" is conflict JScript's "Enumerator"
    var IEnumerator = function (initialize, tryGetNext, dispose) {
        var yielder = new Yielder();
        var state = State.Before;

        this.current = yielder.current;

        this.moveNext = function () {
            /// <summary>Advances the enumerator to the next element of the collection.</summary>
            /// <returns type="Boolean"></returns>
            try {
                switch (state) {
                    case State.Before:
                        state = State.Running;
                        initialize();
                        // fall through
                    case State.Running:
                        if (tryGetNext.apply(yielder)) {
                            return true;
                        }
                        else {
                            this.dispose();
                            return false;
                        }
                    case State.After:
                        return false;
                }
            }
            catch (e) {
                this.dispose();
                throw e;
            }
        };

        this.dispose = function () {
            /// <summary>Performs application-defined tasks associated with freeing, releasing, or resetting unmanaged resources.</summary>
            /// <returns type="void"></returns>
            if (state != State.Running) return;

            try {
                dispose();
            }
            finally {
                state = State.After;
            }
        };
    };

    // for tryGetNext
    var Yielder = function () {
        var current = null;
        this.current = function () {
            /// <summary>Gets the element in the collection at the current position of the enumerator.</summary>
            /// <returns type="T"></returns>
            return current;
        };
        this.yieldReturn = function (value) {
            /// <summary>Set the value to enumerator and return true.</summary>
            /// <returns type="Boolean"></returns>
            current = value;
            return true;
        };
        this.yieldBreak = function () {
            /// <summary>return false.</summary>
            /// <returns type="Boolean"></returns>
            return false;
        };
    };

    // Enumerable constuctor
    var Enumerable = function (getEnumerator) {
        /// <summary>Entry point of linq.js all methods.</summary>
        /// <field name="getEnumerator" type="Function">Returns an enumerator that iterates through the collection.</field>
        this.getEnumerator = getEnumerator;

        if (intellisense) this.firstOrDefault(); // for intellisense
    };

    // Utility

    Enumerable.Utils = {}; // container

    Enumerable.Utils.createLambda = function (expression) {
        /// <signature>
        ///   <summary>Returns the identity function such as function(x){ return x; }</summary>
        ///   <param name="expression">null or undefined</param>
        ///   <returns type="Function"></returns>
        /// </signature>
        /// <signature>
        ///   <summary>Returns the same function.</summary>
        ///   <param name="expression" type="Function">function</param>
        ///   <returns type="Function"></returns>
        /// </signature>
        /// <signature>
        ///   <summary>
        ///    Make function from string.
        ///    &#10;1. "" as function(x) { return x; }
        ///    &#10;2. "arg1, arg2,...,=> body" as lambda expression
        ///    &#10;3. "$ $$ $$$..." as lambda expression($ is default iterator variable)
        ///   </summary>
        ///   <param name="expression" type="String">lambda expression</param>
        ///   <returns type="Function"></returns>
        /// </signature>
        /// <summary>
        /// Make function from string.
        /// &#10;1. null = function(x){ return x; }.
        /// &#10;2. Function = Function.
        /// &#10;3. "" = function(x){ return x; }.
        /// &#10;4. "arg1, arg2,...,=> body" as lambda expression
        /// &#10;5. "$ $$ $$$..." as lambda expression($ is default iterator variable)
        /// </summary>
        /// <param name="expression" type="String">lambda expression</param>
        /// <returns type="Function"></returns>

        return Utils.createLambda(expression);
    };

    Enumerable.Utils.createEnumerable = function (getEnumerator) {
        /// <summary>
        /// Create anonymous enumerable.
        /// </summary>
        /// <param name="getEnumerator" type="Func&lt;IEnumerator>">getEnumerator factory</param>
        /// <returns type="Enumerable"></returns>
        return new Enumerable(getEnumerator);
    };

    Enumerable.Utils.createEnumerator = function (initialize, tryGetNext, dispose) {
        /// <summary>
        /// Create anonymous enumerator.
        /// </summary>
        /// <param name="initialize" type="Action">Invoke when enumerator called moveNext at first.</param>
        /// <param name="tryGetNext" type="Action">
        /// Invoke when enumerator called moveNext.
        /// &#10;return this.yieldReturn(x); then moveNext success and set current() on x.
        /// &#10;return this.yieldBreak(); then moveNext fail.
        /// &#10;Usage: return (enumerator.moveNext()) ? this.yieldReturn(enumerator.current()) : this.yieldBreak();
        /// </param>
        /// <param name="dispose" type="Action">Invoke when enumerator called dispose.</param>
        /// <returns type="IEnumerator"></returns>
        return new IEnumerator(initialize, tryGetNext, dispose);
    };

    Enumerable.Utils.extendTo = function (type) {
        /// <summary>
        /// Extend all enumerable methods to prototype of type.
        /// &#10;If execution environment(e.g. browser) supports Object.defineProperty then use defineProperty and option "enumerable:false".
        /// &#10;Otherwise extends type.prototype directly.
        /// &#10;Usage: Enumerable.Utils.extendTo(Array);
        /// </summary>
        /// <param name="type" type="Constructor">Type Constructor.</param>
        /// <returns type="void"></returns>
        var typeProto = type.prototype;
        var enumerableProto;

        if (type === Array) {
            enumerableProto = ArrayEnumerable.prototype;
            Utils.defineProperty(typeProto, "getSource", function () {
                return this;
            });
        }
        else {
            enumerableProto = Enumerable.prototype;
            Utils.defineProperty(typeProto, "getEnumerator", function () {
                return Enumerable.from(this).getEnumerator();
            });
        }

        for (var methodName in enumerableProto) {
            var func = enumerableProto[methodName];

            // already extended
            if (typeProto[methodName] == func) continue;

            // already defined(example Array#reverse/join/forEach...)
            if (typeProto[methodName] != null) {
                methodName = methodName + "ByLinq";
                if (typeProto[methodName] == func) continue; // recheck
            }

            if (func instanceof Function) {
                Utils.defineProperty(typeProto, methodName, func);
            }
        }
    };

    // Generator

    Enumerable.choice = function (elements) // variable argument
    {
        /// <signature>
        ///   <summary>
        ///   Random choice from arguments.
        ///   &#10;Usage: choice(1,2,3) => 1,3,2,3,3,2,1...
        ///   &#10;Usage: choice([1,2,3]) => 1,3,2,3,3,2,1...
        ///   </summary>
        ///   <param type="params T[]" name="elements">Array or variable elements</param>
        ///   <returns type="Enumerable"></returns>
        /// </signature>
        /// <signature>
        ///   <summary>
        ///   Random choice from arguments.
        ///   &#10;Usage: choice(Enumerable.range(1,3)) => 1,3,2,3,3,2,1...
        ///   </summary>
        ///   <param type="Enumerable" name="elements">Enumerable elements</param>
        ///   <returns type="Enumerable"></returns>
        /// </signature>
        /// <summary>
        /// Random choice from arguments.
        /// &#10;Usage: choice(1,2,3) => 1,3,2,3,3,2,1...
        /// &#10;Usage: choice([1,2,3]) => 1,3,2,3,3,2,1...
        /// </summary>
        /// <param type="params T[]" name="elements">Array or Enumerable or variable elements</param>
        /// <returns type="Enumerable"></returns>
        var args = arguments;

        return new Enumerable(function () {
            return new IEnumerator(
                function () {
                    args = (args[0] instanceof Array) ? args[0]
                        : (args[0].getEnumerator != null) ? args[0].toArray()
                        : args;
                },
                function () {
                    return this.yieldReturn(args[Math.floor(Math.random() * args.length)]);
                },
                Functions.Blank);
        });
    };

    Enumerable.cycle = function (elements) // variable argument
    {
        /// <signature>
        ///   <summary>
        ///   Cycle repeat from arguments.
        ///   &#10;Usage: cycle(1,2,3) => 1,2,3,1,2,3,1,2,3...
        ///   &#10;Usage: cycle([1,2,3]) => 1,2,3,1,2,3,1,2,3...
        ///   </summary>
        ///   <param type="params T[]" name="elements">Array or variable elements</param>
        ///   <returns type="Enumerable"></returns>
        /// </signature>
        /// <signature>
        ///   <summary>
        ///   Cycle repeat from arguments.
        ///   &#10;Usage: cycle(Enumerable.range(1,3)) => 1,2,3,1,2,3,1,2,3...
        ///   </summary>
        ///   <param type="Enumerable" name="elements">Enumerable elements</param>
        ///   <returns type="Enumerable"></returns>
        /// </signature>
        /// <summary>
        /// Cycle repeat from arguments.
        /// &#10;Usage: cycle(1,2,3) => 1,2,3,1,2,3,1,2,3...
        /// &#10;Usage: cycle([1,2,3]) => 1,2,3,1,2,3,1,2,3...
        /// </summary>
        /// <param type="params T[]" name="elements">Array or Enumerable or variable elements</param>
        /// <returns type="Enumerable"></returns>
        var args = arguments;

        return new Enumerable(function () {
            var index = 0;
            return new IEnumerator(
                function () {
                    args = (args[0] instanceof Array) ? args[0]
                        : (args[0].getEnumerator != null) ? args[0].toArray()
                        : args;
                },
                function () {
                    if (index >= args.length) index = 0;
                    return this.yieldReturn(args[index++]);
                },
                Functions.Blank);
        });
    };

    Enumerable.empty = function () {
        /// <summary>Returns an empty Enumerable.</summary>
        /// <returns type="Enumerable"></returns>
        return new Enumerable(function () {
            return new IEnumerator(
                Functions.Blank,
                function () { return false; },
                Functions.Blank);
        });
    };

    Enumerable.from = function (obj) {
        /// <signature>
        ///   <summary>Make empty enumerable from null or undefined.</summary>
        ///   <param name="blankObject">null or undefined</param>
        ///   <returns type="Enumerable"></returns>
        /// </signature>
        /// <signature>
        ///   <summary>Returns the same object.</summary>
        ///   <param name="enumerable" type="Enumerable">Enumerable object</param>
        ///   <returns type="Enumerable"></returns>
        /// </signature>
        /// <signature>
        ///   <summary>Make the single enumerable.</summary>
        ///   <param name="number" type="Number">Number primitive</param>
        ///   <returns type="Enumerable"></returns>
        /// </signature>
        /// <signature>
        ///   <summary>Make the single enumerable.</summary>
        ///   <param name="boolean" type="Boolean">Boolean primitive</param>
        ///   <returns type="Enumerable"></returns>
        /// </signature>
        /// <signature>
        ///   <summary>
        ///   Make charactor sequence.
        ///   &#10;Usage: "abc" => "a", "b", "c"
        ///   </summary>
        ///   <param name="str" type="String">String primitive</param>
        ///   <returns type="Enumerable"></returns>
        /// </signature>
        /// <signature>
        ///   <summary>
        ///   Make own property to KeyValuePair sequence.
        ///   &#10;Usage: "{a:0}" => (.key = "a", .value = 0).
        ///   </summary>
        ///   <param name="obj" type="Object">JavaScript object</param>
        ///   <returns type="Enumerable"></returns>
        /// </signature>
        /// <signature>
        ///   <summary>Make Enumerable sequence.</summary>
        ///   <param name="array" type="Array">Array or ArrayLikeObject(has length)</param>
        ///   <returns type="Enumerable"></returns>
        /// </signature>
        /// <signature>
        ///   <summary>Make Enumerable using JScript's Enumerator.</summary>
        ///   <param name="ienumerable">JScript's IEnumerable</param>
        ///   <returns type="Enumerable"></returns>
        /// </signature>
        /// <signature>
        ///   <summary>Make Enumerable using IIterator&lt;T&gt;.</summary>
        ///   <param name="iiterable">WinMD's IIterable&lt;T&gt;</param>
        ///   <returns type="Enumerable"></returns>
        /// </signature>
        /// <summary>
        /// Make Enumerable from obj.
        /// &#10;1. null = Enumerable.empty().
        /// &#10;2. Enumerable = Enumerable.
        /// &#10;3. Number/Boolean = Enumerable.repeat(obj, 1).
        /// &#10;4. String = to CharArray. Usage: "abc" => "a","b","c").
        /// &#10;5. Object/Function = own property to KeyValuePairs. Usage: "{a:0}" => (.key = "a", .value = 0).
        /// &#10;6. Array or ArrayLikeObject(has length) = to Enumerable.
        /// &#10;7. JScript's IEnumerable = to Enumerable(using Enumerator).
        /// &#10;8. WinMD's IIterable&lt;T&gt; = to Enumerable(using IIterator&lt;T&gt;).
        /// </summary>
        /// <param name="obj">object</param>
        /// <returns type="Enumerable"></returns>

        if (obj == null) {
            return Enumerable.empty();
        }
        if (obj instanceof Enumerable) {
            return obj;
        }
        if (typeof obj == Types.Number || typeof obj == Types.Boolean) {
            return Enumerable.repeat(obj, 1);
        }
        if (typeof obj == Types.String) {
            return new Enumerable(function () {
                var index = 0;
                return new IEnumerator(
                    Functions.Blank,
                    function () {
                        return (index < obj.length) ? this.yieldReturn(obj.charAt(index++)) : false;
                    },
                    Functions.Blank);
            });
        }
        if (typeof obj != Types.Function) {
            // array or array like object
            if (typeof obj.length == Types.Number) {
                return new ArrayEnumerable(obj);
            }

            // JScript's IEnumerable
            if (!(obj instanceof Object) && Utils.isIEnumerable(obj)) {
                return new Enumerable(function () {
                    var isFirst = true;
                    var enumerator;
                    return new IEnumerator(
                        function () { enumerator = new Enumerator(obj); },
                        function () {
                            if (isFirst) isFirst = false;
                            else enumerator.moveNext();

                            return (enumerator.atEnd()) ? false : this.yieldReturn(enumerator.item());
                        },
                        Functions.Blank);
                });
            }

            // WinMD IIterable<T>
            if (typeof Windows === Types.Object && typeof obj.first === Types.Function) {
                return new Enumerable(function () {
                    var isFirst = true;
                    var enumerator;
                    return new IEnumerator(
                        function () { enumerator = obj.first(); },
                        function () {
                            if (isFirst) isFirst = false;
                            else enumerator.moveNext();

                            return (enumerator.hasCurrent) ? this.yieldReturn(enumerator.current) : this.yieldBreak();
                        },
                        Functions.Blank);
                });
            }
        }

        // case function/object : Create keyValuePair[]
        return new Enumerable(function () {
            var array = [];
            var index = 0;

            return new IEnumerator(
                function () {
                    for (var key in obj) {
                        var value = obj[key];
                        if (!(value instanceof Function) && Object.prototype.hasOwnProperty.call(obj, key)) {
                            array.push({ key: key, value: value });
                        }
                    }
                },
                function () {
                    return (index < array.length)
                        ? this.yieldReturn(array[index++])
                        : false;
                },
                Functions.Blank);
        });
    },

    Enumerable.make = function (element) {
        /// <summary>Make one sequence. This equals repeat(element, 1)</summary>
        /// <param name="element" type="T">element</param>
        /// <returns type="Enumerable"></returns>
        return Enumerable.repeat(element, 1);
    };

    Enumerable.matches = function (input, pattern, flags) {
        /// <summary>
        /// Global regex match and send regexp object.
        /// &#10;Usage: matches((.)z,"0z1z2z") => $[1] = 0,1,2
        /// </summary>
        /// <param type="String" name="input">input string</param>
        /// <param type="RegExp/String" name="pattern">RegExp or Pattern string</param>
        /// <param type="String" name="flags" optional="true">If pattern is String then can use regexp flags "i"(ignoreCase) or "m"(multiLine) or "im"(both)</param>
        /// <returns type="Enumerable"></returns>
        if (flags == null) flags = "";
        if (pattern instanceof RegExp) {
            flags += (pattern.ignoreCase) ? "i" : "";
            flags += (pattern.multiline) ? "m" : "";
            pattern = pattern.source;
        }
        if (flags.indexOf("g") === -1) flags += "g";

        return new Enumerable(function () {
            var regex;
            return new IEnumerator(
                function () { regex = new RegExp(pattern, flags); },
                function () {
                    var match = regex.exec(input);
                    return (match) ? this.yieldReturn(match) : false;
                },
                Functions.Blank);
        });
    };

    Enumerable.range = function (start, count, step) {
        /// <summary>
        /// Generates a sequence of integral numbers within a specified range.
        /// &#10;Usage: range(1,5) => 1,2,3,4,5
        /// </summary>
        /// <param type="Number" integer="true" name="start">The value of the first integer in the sequence.</param>
        /// <param type="Number" integer="true" name="count">The number of sequential integers to generate.</param>
        /// <param type="Number" integer="true" name="step" optional="true">Step of generate number. Usage: range(0,3,5) => 0,5,10</param>
        /// <returns type="Enumerable"></returns>
        if (step == null) step = 1;

        return new Enumerable(function () {
            var value;
            var index = 0;

            return new IEnumerator(
                function () { value = start - step; },
                function () {
                    return (index++ < count)
                        ? this.yieldReturn(value += step)
                        : this.yieldBreak();
                },
                Functions.Blank);
        });
    };

    Enumerable.rangeDown = function (start, count, step) {
        /// <summary>
        /// Generates a sequence of integral numbers within a specified range.
        /// &#10;Usage: rangeDown(5,5) => 5,4,3,2,1
        /// </summary>
        /// <param type="Number" integer="true" name="start">The value of the first integer in the sequence.</param>
        /// <param type="Number" integer="true" name="count">The number of sequential integers to generate.</param>
        /// <param type="Number" integer="true" name="step" optional="true">Step of generate number. Usage: rangeDown(0,3,5) => 0,-5,-10</param>
        /// <returns type="Enumerable"></returns>
        if (step == null) step = 1;

        return new Enumerable(function () {
            var value;
            var index = 0;

            return new IEnumerator(
                function () { value = start + step; },
                function () {
                    return (index++ < count)
                        ? this.yieldReturn(value -= step)
                        : this.yieldBreak();
                },
                Functions.Blank);
        });
    };

    Enumerable.rangeTo = function (start, to, step) {
        /// <summary>Generates a sequence of integral numbers.
        /// &#10;Usage: rangeTo(10, 12) => 10,11,12 | rangeTo(0, -2) => 0, -1, -2</summary>
        /// <param type="Number" integer="true" name="start">start integer</param>
        /// <param type="Number" integer="true" name="to">to integer</param>
        /// <param type="Number" integer="true" name="step" optional="true">Step of generate number. Usage: rangeTo(0, 7, 3) => 0,3,6</param>
        /// <returns type="Enumerable"></returns>

        if (step == null) step = 1;

        if (start < to) {
            return new Enumerable(function () {
                var value;

                return new IEnumerator(
                function () { value = start - step; },
                function () {
                    var next = value += step;
                    return (next <= to)
                        ? this.yieldReturn(next)
                        : this.yieldBreak();
                },
                Functions.Blank);
            });
        }
        else {
            return new Enumerable(function () {
                var value;

                return new IEnumerator(
                function () { value = start + step; },
                function () {
                    var next = value -= step;
                    return (next >= to)
                        ? this.yieldReturn(next)
                        : this.yieldBreak();
                },
                Functions.Blank);
            });
        }
    };

    Enumerable.repeat = function (element, count) {
        /// <summary>
        /// Generates a sequence that contains one repeated value.
        /// &#10;If omit count then generate to infinity.
        /// &#10;Usage: repeat("foo", 3) => "foo","foo","foo"
        /// </summary>
        /// <param type="T" name="element">The value to be repeated.</param>
        /// <param type="Number" integer="true" name="count" optional="true">The number of times to repeat the value in the generated sequence.</param>
        /// <returns type="Enumerable"></returns>
        if (count != null) return Enumerable.repeat(element).take(count);

        return new Enumerable(function () {
            return new IEnumerator(
                Functions.Blank,
                function () { return this.yieldReturn(element); },
                Functions.Blank);
        });
    };

    Enumerable.repeatWithFinalize = function (initializer, finalizer) {
        /// <summary>Lazy Generates one value by initializer's result and do finalize when enumerate end.</summary>
        /// <param type="Func&lt;T>" name="initializer">value factory.</param>
        /// <param type="Action&lt;T>" name="finalizer">execute when finalize.</param>
        /// <returns type="Enumerable"></returns>
        initializer = Utils.createLambda(initializer);
        finalizer = Utils.createLambda(finalizer);

        return new Enumerable(function () {
            var element;
            return new IEnumerator(
                function () { element = initializer(); },
                function () { return this.yieldReturn(element); },
                function () {
                    if (element != null) {
                        finalizer(element);
                        element = null;
                    }
                });
        });
    };

    Enumerable.generate = function (func, count) {
        /// <summary>
        /// Generates a sequence that execute func value.
        /// &#10;If omit count then generate to infinity.
        /// &#10;Usage: generate("Math.random()", 5) => 0.131341,0.95425252,...
        /// </summary>
        /// <param type="Func&lt;T>" name="func">The value of execute func to be repeated.</param>
        /// <param type="Number" integer="true" name="count" optional="true">The number of times to repeat the value in the generated sequence.</param>
        /// <returns type="Enumerable"></returns>
        if (count != null) return Enumerable.generate(func).take(count);
        func = Utils.createLambda(func);

        return new Enumerable(function () {
            return new IEnumerator(
                Functions.Blank,
                function () { return this.yieldReturn(func()); },
                Functions.Blank);
        });
    };

    Enumerable.toInfinity = function (start, step) {
        /// <summary>
        /// Generates a sequence of integral numbers to infinity.
        /// &#10;Usage: toInfinity() => 0,1,2,3...
        /// </summary>
        /// <param type="Number" integer="true" name="start" optional="true">start integer.</param>
        /// <param type="Number" integer="true" name="step" optional="true">Step of generate number. Usage: toInfinity(10,3) => 10,13,16,19,...</param>
        /// <returns type="Enumerable"></returns>
        if (start == null) start = 0;
        if (step == null) step = 1;

        return new Enumerable(function () {
            var value;
            return new IEnumerator(
                function () { value = start - step; },
                function () { return this.yieldReturn(value += step); },
                Functions.Blank);
        });
    };

    Enumerable.toNegativeInfinity = function (start, step) {
        /// <summary>
        /// Generates a sequence of integral numbers to negative infinity.
        /// &#10;Usage: toNegativeInfinity() => 0,-1,-2,-3...
        /// </summary>
        /// <param type="Number" integer="true" name="start" optional="true">start integer.</param>
        /// <param type="Number" integer="true" name="step" optional="true">Step of generate number. Usage: toNegativeInfinity(10,3) => 10,7,4,1,...</param>
        /// <returns type="Enumerable"></returns>
        if (start == null) start = 0;
        if (step == null) step = 1;

        return new Enumerable(function () {
            var value;
            return new IEnumerator(
                function () { value = start + step; },
                function () { return this.yieldReturn(value -= step); },
                Functions.Blank);
        });
    };

    Enumerable.unfold = function (seed, func) {
        /// <summary>
        /// Applies function and generates a infinity sequence.
        /// &#10;Usage: unfold(3, "$+10") => 3,13,23,...</summary>
        /// <param type="T" name="seed">The initial accumulator value.</param>
        /// <param type="Func&lt;T,T>" name="func">An accumulator function to be invoked on each element.</param>
        /// <returns type="Enumerable"></returns>
        func = Utils.createLambda(func);

        return new Enumerable(function () {
            var isFirst = true;
            var value;
            return new IEnumerator(
                Functions.Blank,
                function () {
                    if (isFirst) {
                        isFirst = false;
                        value = seed;
                        return this.yieldReturn(value);
                    }
                    value = func(value);
                    return this.yieldReturn(value);
                },
                Functions.Blank);
        });
    };

    Enumerable.defer = function (enumerableFactory) {
        /// <summary>
        /// Make enumerable enumerableFactory as need.
        /// &#10;Usage: defer(function(){ return [1,2,3] })</summary>
        /// <param type="Function" name="enumerableFactory">Enumerable factory, function returns array or enumerable.</param>
        /// <returns type="Enumerable"></returns>

        return new Enumerable(function () {
            var enumerator;

            return new IEnumerator(
                function () { enumerator = Enumerable.from(enumerableFactory()).getEnumerator(); },
                function () {
                    return (enumerator.moveNext())
                        ? this.yieldReturn(enumerator.current())
                        : this.yieldBreak();
                },
                function () {
                    Utils.dispose(enumerator);
                });
        });
    };

    // Extension Methods

    /* Projection and Filtering Methods */

    Enumerable.prototype.traverseBreadthFirst = function (func, resultSelector) {
        /// <summary>Projects each element of sequence and flattens the resulting sequences into one sequence use breadth first search.</summary>
        /// <param name="func" type="Func&lt;TSource,Enumerable&lt;TCollection>>">Select child sequence.</param>
        /// <param name="resultSelector" type="Func&lt;TCollection,int,TResult>" optional="true">A transform function to apply to each element of the intermediate sequence.; Optional:the second parameter of the function represents the nestlevel of the source element.</param>
        /// <returns type="Enumerable"></returns>
        var source = this;
        func = Utils.createLambda(func);
        resultSelector = Utils.createLambda(resultSelector);

        return new Enumerable(function () {
            var enumerator;
            var nestLevel = 0;
            var buffer = [];

            return new IEnumerator(
                function () { enumerator = source.getEnumerator(); },
                function () {
                    while (true) {
                        if (enumerator.moveNext()) {
                            buffer.push(enumerator.current());
                            return this.yieldReturn(resultSelector(enumerator.current(), nestLevel));
                        }

                        var next = Enumerable.from(buffer).selectMany(function (x) { return func(x); });
                        if (!next.any()) {
                            return false;
                        }
                        else {
                            nestLevel++;
                            buffer = [];
                            Utils.dispose(enumerator);
                            enumerator = next.getEnumerator();
                        }
                    }
                },
                function () { Utils.dispose(enumerator); });
        });
    };

    Enumerable.prototype.traverseDepthFirst = function (func, resultSelector) {
        /// <summary>Projects each element of sequence and flattens the resulting sequences into one sequence use depth first search.</summary>
        /// <param name="func" type="Func&lt;TSource,Enumerable&lt;TCollection>>">Select child sequence.</param>
        /// <param name="resultSelector" type="Func&lt;TCollection,int,TResult>" optional="true">A transform function to apply to each element of the intermediate sequence.; Optional:the second parameter of the function represents the nestlevel of the source element.</param>
        /// <returns type="Enumerable"></returns>
        var source = this;
        func = Utils.createLambda(func);
        resultSelector = Utils.createLambda(resultSelector);

        return new Enumerable(function () {
            var enumeratorStack = [];
            var enumerator;

            return new IEnumerator(
                function () { enumerator = source.getEnumerator(); },
                function () {
                    while (true) {
                        if (enumerator.moveNext()) {
                            var value = resultSelector(enumerator.current(), enumeratorStack.length);
                            enumeratorStack.push(enumerator);
                            enumerator = Enumerable.from(func(enumerator.current())).getEnumerator();
                            return this.yieldReturn(value);
                        }

                        if (enumeratorStack.length <= 0) return false;
                        Utils.dispose(enumerator);
                        enumerator = enumeratorStack.pop();
                    }
                },
                function () {
                    try {
                        Utils.dispose(enumerator);
                    }
                    finally {
                        Enumerable.from(enumeratorStack).forEach(function (s) { s.dispose(); });
                    }
                });
        });
    };

    Enumerable.prototype.flatten = function () {
        /// <summary>Flatten sequences into one sequence.</summary>
        /// <returns type="Enumerable"></returns>
        var source = this;

        return new Enumerable(function () {
            var enumerator;
            var middleEnumerator = null;

            return new IEnumerator(
                function () { enumerator = source.getEnumerator(); },
                function () {
                    while (true) {
                        if (middleEnumerator != null) {
                            if (middleEnumerator.moveNext()) {
                                return this.yieldReturn(middleEnumerator.current());
                            }
                            else {
                                middleEnumerator = null;
                            }
                        }

                        if (enumerator.moveNext()) {
                            if (enumerator.current() instanceof Array) {
                                Utils.dispose(middleEnumerator);
                                middleEnumerator = Enumerable.from(enumerator.current())
                                    .selectMany(Functions.Identity)
                                    .flatten()
                                    .getEnumerator();
                                continue;
                            }
                            else {
                                return this.yieldReturn(enumerator.current());
                            }
                        }

                        return false;
                    }
                },
                function () {
                    try {
                        Utils.dispose(enumerator);
                    }
                    finally {
                        Utils.dispose(middleEnumerator);
                    }
                });
        });
    };

    Enumerable.prototype.pairwise = function (selector) {
        /// <summary>Projects current and next element of a sequence into a new form.</summary>
        /// <param type="Func&lt;TSource,TSource,TResult>" name="selector">A transform function to apply to current and next element.</param>
        /// <returns type="Enumerable"></returns>
        var source = this;
        selector = Utils.createLambda(selector);

        return new Enumerable(function () {
            var enumerator;

            return new IEnumerator(
                function () {
                    enumerator = source.getEnumerator();
                    enumerator.moveNext();
                },
                function () {
                    var prev = enumerator.current();
                    return (enumerator.moveNext())
                        ? this.yieldReturn(selector(prev, enumerator.current()))
                        : false;
                },
                function () { Utils.dispose(enumerator); });
        });
    };

    Enumerable.prototype.scan = function (seed, func) {
        /// <signature>
        ///   <summary>Applies an accumulator function over a sequence.</summary>
        ///   <param name="func" type="Func&lt;TSource,TSource,TSource>">An accumulator function to be invoked on each element.</param>
        ///   <returns type="Enumerable"></returns>
        /// </signature>
        /// <signature>
        ///   <summary>Applies an accumulator function over a sequence.</summary>
        ///   <param name="seed" type="TAccumulate">the initial accumulator value.</param>
        ///   <param name="func" type="Func&lt;TAccumulate,TSource,TAccumulate>">An accumulator function to be invoked on each element.</param>
        ///   <returns type="Enumerable"></returns>
        /// </signature>
        /// <summary>Applies an accumulator function over a sequence.</summary>
        /// <param name="seed" type="Func&lt;T,T,T>_or_TAccumulate">Func is an accumulator function to be invoked on each element. Seed is the initial accumulator value.</param>
        /// <param name="func" type="Optional:Func&lt;TAccumulate,T,TAccumulate>" optional="true">An accumulator function to be invoked on each element.</param>
        /// <returns type="Enumerable"></returns>
        var isUseSeed;
        if (func == null) {
            func = Utils.createLambda(seed); // arguments[0]
            isUseSeed = false;
        }
        else {
            func = Utils.createLambda(func);
            isUseSeed = true;
        }
        var source = this;

        return new Enumerable(function () {
            var enumerator;
            var value;
            var isFirst = true;

            return new IEnumerator(
                function () { enumerator = source.getEnumerator(); },
                function () {
                    if (isFirst) {
                        isFirst = false;
                        if (!isUseSeed) {
                            if (enumerator.moveNext()) {
                                return this.yieldReturn(value = enumerator.current());
                            }
                        }
                        else {
                            return this.yieldReturn(value = seed);
                        }
                    }

                    return (enumerator.moveNext())
                        ? this.yieldReturn(value = func(value, enumerator.current()))
                        : false;
                },
                function () { Utils.dispose(enumerator); });
        });
    };

    // Overload:function(selector<element>)
    // Overload:function(selector<element,index>)
    Enumerable.prototype.select = function (selector) {
        /// <summary>Projects each element of a sequence into a new form.</summary>
        /// <param name="selector" type="Func&lt;T,int,T>">A transform function to apply to each source element; Optional:the second parameter of the function represents the index of the source element.</param>
        /// <returns type="Enumerable"></returns>
        selector = Utils.createLambda(selector);

        if (selector.length <= 1) {
            return new WhereSelectEnumerable(this, null, selector);
        }
        else {
            var source = this;

            return new Enumerable(function () {
                var enumerator;
                var index = 0;

                return new IEnumerator(
                    function () { enumerator = source.getEnumerator(); },
                    function () {
                        return (enumerator.moveNext())
                            ? this.yieldReturn(selector(enumerator.current(), index++))
                            : false;
                    },
                    function () { Utils.dispose(enumerator); });
            });
        }
    };

    // Overload:function(collectionSelector<element>)
    // Overload:function(collectionSelector<element,index>)
    // Overload:function(collectionSelector<element>,resultSelector)
    // Overload:function(collectionSelector<element,index>,resultSelector)
    Enumerable.prototype.selectMany = function (collectionSelector, resultSelector) {
        /// <summary>Projects each element of a sequence and flattens the resulting sequences into one sequence.</summary>
        /// <param name="collectionSelector" type="Func&lt;T,int,TCollection[]>">A transform function to apply to each source element; Optional:the second parameter of the function represents the index of the source element.</param>
        /// <param name="resultSelector" type="Func&lt;T,TCollection,TResult>" optional="true">A transform function to apply to each element of the intermediate sequence.</param>
        /// <returns type="Enumerable"></returns>
        var source = this;
        collectionSelector = Utils.createLambda(collectionSelector);
        if (resultSelector == null) resultSelector = function (a, b) { return b; };
        resultSelector = Utils.createLambda(resultSelector);

        return new Enumerable(function () {
            var enumerator;
            var middleEnumerator = undefined;
            var index = 0;

            return new IEnumerator(
                function () { enumerator = source.getEnumerator(); },
                function () {
                    if (middleEnumerator === undefined) {
                        if (!enumerator.moveNext()) return false;
                    }
                    do {
                        if (middleEnumerator == null) {
                            var middleSeq = collectionSelector(enumerator.current(), index++);
                            middleEnumerator = Enumerable.from(middleSeq).getEnumerator();
                        }
                        if (middleEnumerator.moveNext()) {
                            return this.yieldReturn(resultSelector(enumerator.current(), middleEnumerator.current()));
                        }
                        Utils.dispose(middleEnumerator);
                        middleEnumerator = null;
                    } while (enumerator.moveNext());
                    return false;
                },
                function () {
                    try {
                        Utils.dispose(enumerator);
                    }
                    finally {
                        Utils.dispose(middleEnumerator);
                    }
                });
        });
    };

    // Overload:function(predicate<element>)
    // Overload:function(predicate<element,index>)
    Enumerable.prototype.where = function (predicate) {
        /// <summary>Filters a sequence of values based on a predicate.</summary>
        /// <param name="predicate" type="Func&lt;T,int,bool>">A function to test each source element for a condition; Optional:the second parameter of the function represents the index of the source element.</param>
        /// <returns type="Enumerable"></returns>
        predicate = Utils.createLambda(predicate);

        if (predicate.length <= 1) {
            return new WhereEnumerable(this, predicate);
        }
        else {
            var source = this;

            return new Enumerable(function () {
                var enumerator;
                var index = 0;

                return new IEnumerator(
                    function () { enumerator = source.getEnumerator(); },
                    function () {
                        while (enumerator.moveNext()) {
                            if (predicate(enumerator.current(), index++)) {
                                return this.yieldReturn(enumerator.current());
                            }
                        }
                        return false;
                    },
                    function () { Utils.dispose(enumerator); });
            });
        }
    };

    // Overload:function(selector<element>)
    // Overload:function(selector<element,index>)
    Enumerable.prototype.choose = function (selector) {
        /// <summary>Projection and filter if projected value is null or undefined.</summary>
        /// <param name="selector" type="Func&lt;T,int,TR>">A transform function; Optional:the second parameter of the function represents the index of the source element.</param>
        /// <returns type="Enumerable"></returns>
        selector = Utils.createLambda(selector);
        var source = this;

        return new Enumerable(function () {
            var enumerator;
            var index = 0;

            return new IEnumerator(
                function () { enumerator = source.getEnumerator(); },
                function () {
                    while (enumerator.moveNext()) {
                        var result = selector(enumerator.current(), index++);
                        if (result != null) {
                            return this.yieldReturn(result);
                        }
                    }
                    return this.yieldBreak();
                },
                function () { Utils.dispose(enumerator); });
        });
    };

    Enumerable.prototype.ofType = function (type) {
        /// <summary>Filters the elements based on a specified type.</summary>
        /// <param name="type" type="T">The type to filter the elements of the sequence on.</param>
        /// <returns type="Enumerable"></returns>
        var typeName;
        switch (type) {
            case Number:
                typeName = Types.Number;
                break;
            case String:
                typeName = Types.String;
                break;
            case Boolean:
                typeName = Types.Boolean;
                break;
            case Function:
                typeName = Types.Function;
                break;
            default:
                typeName = null;
                break;
        }
        return (typeName === null)
            ? this.where(function (x) { return x instanceof type; })
            : this.where(function (x) { return typeof x === typeName; });
    };

    // mutiple arguments, last one is selector, others are enumerable
    Enumerable.prototype.zip = function (_elements, _selector) {
        /// <signature>
        ///   <summary>Merges many sequences by using the specified selector. The last argument is selector.</summary>
        ///   <param type="params Enumerable&lt;T>[]" name="elements">The multiple sequence to merge.</param>
        ///   <param name="selector" type="Func&lt;TFirst,TSecond,TThird,...,int,TResult>">A function that specifies how to merge the elements from the many sequences. Optional:the last parameter of the function represents the index of the source element.</param>
        ///   <returns type="Enumerable"></returns>
        /// </signature>
        /// <summary>Merges many sequences by using the specified selector. The last argument is selector.</summary>
        /// <param type="params_Enumerable&lt;T>" name="_elements">The multiple sequence to merge.</param>
        /// <param name="_selector" type="Func&lt;TFirst,TSecond,TThird,...,int,TResult>">A function that specifies how to merge the elements from the many sequences. Optional:the last parameter of the function represents the index of the source element.</param>
        /// <returns type="Enumerable"></returns>
        var args = arguments;
        var selector = Utils.createLambda(arguments[arguments.length - 1]);

        var source = this;
        // optimized case:argument is 2
        if (arguments.length == 2) {
            var second = arguments[0];

            return new Enumerable(function () {
                var firstEnumerator;
                var secondEnumerator;
                var index = 0;

                return new IEnumerator(
                function () {
                    firstEnumerator = source.getEnumerator();
                    secondEnumerator = Enumerable.from(second).getEnumerator();
                },
                function () {
                    if (firstEnumerator.moveNext() && secondEnumerator.moveNext()) {
                        return this.yieldReturn(selector(firstEnumerator.current(), secondEnumerator.current(), index++));
                    }
                    return false;
                },
                function () {
                    try {
                        Utils.dispose(firstEnumerator);
                    } finally {
                        Utils.dispose(secondEnumerator);
                    }
                });
            });
        }
        else {
            return new Enumerable(function () {
                var enumerators;
                var index = 0;

                return new IEnumerator(
                function () {
                    var array = Enumerable.make(source)
                        .concat(Enumerable.from(args).takeExceptLast().select(Enumerable.from))
                        .select(function (x) { return x.getEnumerator() })
                        .toArray();
                    enumerators = Enumerable.from(array);
                },
                function () {
                    if (enumerators.all(function (x) { return x.moveNext() })) {
                        var array = enumerators
                            .select(function (x) { return x.current() })
                            .toArray();
                        array.push(index++);
                        return this.yieldReturn(selector.apply(null, array));
                    }
                    else {
                        return this.yieldBreak();
                    }
                },
                function () {
                    Enumerable.from(enumerators).forEach(Utils.dispose);
                });
            });
        }
    };

    // mutiple arguments
    Enumerable.prototype.merge = function (_elements) {
        /// <signature>
        ///   <summary>
        ///   Merges many sequences in turn. Target sequence is variable.
        ///   &#10;Usage: seqX.merge(seqY, seqZ) => [x, y, z, x, y, z, x, y,....]
        ///   </summary>
        ///   <param type="params Enumerable&lt;T>[]" name="elements">The multiple sequence to merge.</param>
        ///   <returns type="Enumerable"></returns>
        /// </signature>
        /// <summary>
        /// Merges many sequences in turn. Target sequence is variable.
        /// &#10;Usage: seqX.merge(seqY, seqZ) => [x, y, z, x, y, z, x, y,....]
        /// </summary>
        /// <param type="params_Enumerable&lt;T>" name="_elements">The multiple sequence to merge.</param>
        /// <returns type="Enumerable"></returns>
        var args = arguments;
        var source = this;

        return new Enumerable(function () {
            var enumerators;
            var index = -1;

            return new IEnumerator(
                function () {
                    enumerators = Enumerable.make(source)
                        .concat(Enumerable.from(args).select(Enumerable.from))
                        .select(function (x) { return x.getEnumerator() })
                        .toArray();
                },
                function () {
                    while (enumerators.length > 0) {
                        index = (index >= enumerators.length - 1) ? 0 : index + 1;
                        var enumerator = enumerators[index];

                        if (enumerator.moveNext()) {
                            return this.yieldReturn(enumerator.current());
                        }
                        else {
                            enumerator.dispose();
                            enumerators.splice(index--, 1);
                        }
                    }
                    return this.yieldBreak();
                },
                function () {
                    Enumerable.from(enumerators).forEach(Utils.dispose);
                });
        });
    };

    /* Join Methods */

    // Overload:function (inner, outerKeySelector, innerKeySelector, resultSelector)
    // Overload:function (inner, outerKeySelector, innerKeySelector, resultSelector, compareSelector)
    Enumerable.prototype.join = function (inner, outerKeySelector, innerKeySelector, resultSelector, compareSelector) {
        /// <summary>Correlates the elements of two sequences based on matching keys.</summary>
        /// <param name="inner" type="Enumerable&lt;T>">The sequence to join to the first sequence.</param>
        /// <param name="outerKeySelector" type="Func&lt;TOuter,TKey>">A function to extract the join key from each element of the first sequence.</param>
        /// <param name="innerKeySelector" type="Func&lt;TInner,TKey>">A function to extract the join key from each element of the second sequence.</param>
        /// <param name="resultSelector" type="Func&lt;TOuter,TInner,TResult>">A function to create a result element from two matching elements.</param>
        /// <param name="compareSelector" type="Func&lt;TKey,TCompare>" optional="true">An equality comparer to compare values.</param>
        /// <returns type="Enumerable"></returns>
        outerKeySelector = Utils.createLambda(outerKeySelector);
        innerKeySelector = Utils.createLambda(innerKeySelector);
        resultSelector = Utils.createLambda(resultSelector);
        compareSelector = Utils.createLambda(compareSelector);
        var source = this;

        return new Enumerable(function () {
            var outerEnumerator;
            var lookup;
            var innerElements = null;
            var innerCount = 0;

            return new IEnumerator(
                function () {
                    outerEnumerator = source.getEnumerator();
                    lookup = Enumerable.from(inner).toLookup(innerKeySelector, Functions.Identity, compareSelector);
                },
                function () {
                    while (true) {
                        if (innerElements != null) {
                            var innerElement = innerElements[innerCount++];
                            if (innerElement !== undefined) {
                                return this.yieldReturn(resultSelector(outerEnumerator.current(), innerElement));
                            }

                            innerElement = null;
                            innerCount = 0;
                        }

                        if (outerEnumerator.moveNext()) {
                            var key = outerKeySelector(outerEnumerator.current());
                            innerElements = lookup.get(key).toArray();
                        } else {
                            return false;
                        }
                    }
                },
                function () { Utils.dispose(outerEnumerator); });
        });
    };

    // Overload:function (inner, outerKeySelector, innerKeySelector, resultSelector)
    // Overload:function (inner, outerKeySelector, innerKeySelector, resultSelector, compareSelector)
    Enumerable.prototype.groupJoin = function (inner, outerKeySelector, innerKeySelector, resultSelector, compareSelector) {
        /// <summary>Correlates the elements of two sequences based on equality of keys and groups the results.</summary>
        /// <param name="inner" type="T[]">The sequence to join to the first sequence.</param>
        /// <param name="outerKeySelector" type="Func&lt;TOuter>">A function to extract the join key from each element of the first sequence.</param>
        /// <param name="innerKeySelector" type="Func&lt;TInner>">A function to extract the join key from each element of the second sequence.</param>
        /// <param name="resultSelector" type="Func&lt;TOuter,Enumerable&lt;TInner>,TResult">A function to create a result element from an element from the first sequence and a collection of matching elements from the second sequence.</param>
        /// <param name="compareSelector" type="Func&lt;TKey,TCompare>" optional="true">An equality comparer to compare values.</param>
        /// <returns type="Enumerable"></returns>
        outerKeySelector = Utils.createLambda(outerKeySelector);
        innerKeySelector = Utils.createLambda(innerKeySelector);
        resultSelector = Utils.createLambda(resultSelector);
        compareSelector = Utils.createLambda(compareSelector);
        var source = this;

        return new Enumerable(function () {
            var enumerator = source.getEnumerator();
            var lookup = null;

            return new IEnumerator(
                function () {
                    enumerator = source.getEnumerator();
                    lookup = Enumerable.from(inner).toLookup(innerKeySelector, Functions.Identity, compareSelector);
                },
                function () {
                    if (enumerator.moveNext()) {
                        var innerElement = lookup.get(outerKeySelector(enumerator.current()));
                        return this.yieldReturn(resultSelector(enumerator.current(), innerElement));
                    }
                    return false;
                },
                function () { Utils.dispose(enumerator); });
        });
    };

    /* Set Methods */

    Enumerable.prototype.all = function (predicate) {
        /// <summary>Determines whether all elements of a sequence satisfy a condition.</summary>
        /// <param type="Func&lt;T,bool>" name="predicate">A function to test each element for a condition.</param>
        /// <returns type="Boolean"></returns>
        predicate = Utils.createLambda(predicate);

        var result = true;
        this.forEach(function (x) {
            if (!predicate(x)) {
                result = false;
                return false; // break
            }
        });
        return result;
    };

    // Overload:function()
    // Overload:function(predicate)
    Enumerable.prototype.any = function (predicate) {
        /// <summary>Determines whether a sequence contains any elements or any element of a sequence satisfies a condition.</summary>
        /// <param name="predicate" type="Func&lt;T,bool>" optional="true">A function to test each element for a condition.</param>
        /// <returns type="Boolean"></returns>
        predicate = Utils.createLambda(predicate);

        var enumerator = this.getEnumerator();
        try {
            if (arguments.length == 0) return enumerator.moveNext(); // case:function()

            while (enumerator.moveNext()) // case:function(predicate)
            {
                if (predicate(enumerator.current())) return true;
            }
            return false;
        }
        finally {
            Utils.dispose(enumerator);
        }
    };

    Enumerable.prototype.isEmpty = function () {
        /// <summary>Check the Sequence is empty.</summary>
        /// <returns type="Boolean"></returns>
        return !this.any();
    };

    // multiple arguments
    Enumerable.prototype.concat = function (_elements) {
        /// <signature>
        ///   <summary>Concatenates many sequences.</summary>
        ///   <param name="elements" type="params Enumerable&lt;T>[]">The sequences to concatenate to the first sequence.</param>
        ///   <returns type="Enumerable"></returns>
        /// </signature>
        /// <summary>Concatenates many sequences.</summary>
        /// <param name="_elements" type="params_Enumerable&lt;T>[]">The sequences to concatenate to the first sequence.</param>
        /// <returns type="Enumerable"></returns>
        var source = this;

        if (arguments.length == 1) {
            var second = arguments[0];

            return new Enumerable(function () {
                var firstEnumerator;
                var secondEnumerator;

                return new IEnumerator(
                function () { firstEnumerator = source.getEnumerator(); },
                function () {
                    if (secondEnumerator == null) {
                        if (firstEnumerator.moveNext()) return this.yieldReturn(firstEnumerator.current());
                        secondEnumerator = Enumerable.from(second).getEnumerator();
                    }
                    if (secondEnumerator.moveNext()) return this.yieldReturn(secondEnumerator.current());
                    return false;
                },
                function () {
                    try {
                        Utils.dispose(firstEnumerator);
                    }
                    finally {
                        Utils.dispose(secondEnumerator);
                    }
                });
            });
        }
        else {
            var args = arguments;

            return new Enumerable(function () {
                var enumerators;

                return new IEnumerator(
                    function () {
                        enumerators = Enumerable.make(source)
                            .concat(Enumerable.from(args).select(Enumerable.from))
                            .select(function (x) { return x.getEnumerator() })
                            .toArray();
                    },
                    function () {
                        while (enumerators.length > 0) {
                            var enumerator = enumerators[0];

                            if (enumerator.moveNext()) {
                                return this.yieldReturn(enumerator.current());
                            }
                            else {
                                enumerator.dispose();
                                enumerators.splice(0, 1);
                            }
                        }
                        return this.yieldBreak();
                    },
                    function () {
                        Enumerable.from(enumerators).forEach(Utils.dispose);
                    });
            });
        }
    };

    Enumerable.prototype.insert = function (index, second) {
        /// <summary>Merge two sequences.</summary>
        /// <param name="index" type="Number" integer="true">The index of insert start position.</param>
        /// <param name="second" type="Enumerable&lt;T>">The sequence to concatenate to the first sequence.</param>
        /// <returns type="Enumerable"></returns>
        var source = this;

        return new Enumerable(function () {
            var firstEnumerator;
            var secondEnumerator;
            var count = 0;
            var isEnumerated = false;

            return new IEnumerator(
                function () {
                    firstEnumerator = source.getEnumerator();
                    secondEnumerator = Enumerable.from(second).getEnumerator();
                },
                function () {
                    if (count == index && secondEnumerator.moveNext()) {
                        isEnumerated = true;
                        return this.yieldReturn(secondEnumerator.current());
                    }
                    if (firstEnumerator.moveNext()) {
                        count++;
                        return this.yieldReturn(firstEnumerator.current());
                    }
                    if (!isEnumerated && secondEnumerator.moveNext()) {
                        return this.yieldReturn(secondEnumerator.current());
                    }
                    return false;
                },
                function () {
                    try {
                        Utils.dispose(firstEnumerator);
                    }
                    finally {
                        Utils.dispose(secondEnumerator);
                    }
                });
        });
    };

    Enumerable.prototype.alternate = function (alternateValueOrSequence) {
        /// <signature>
        ///   <summary>
        ///   Insert value to between sequence.
        ///   &#10;Usage: [1,2,3].alternate(0) => 1,0,2,0,3
        ///   </summary>
        ///   <param name="alternateValue" type="T">The value of insert.</param>
        ///   <returns type="Enumerable"></returns>
        /// </signature>
        /// <signature>
        ///   <summary>
        ///   Insert value to between sequence.
        ///   &#10;Usage: [1,2,3].alternate([-1,-2]) => 1,-1,-2,2,-1,-2,3
        ///   </summary>
        ///   <param name="alternateSequence" type="Enumerable&lt;T>">The values of insert.</param>
        ///   <returns type="Enumerable"></returns>
        /// </signature>
        /// <summary>
        /// Insert value to between sequence.
        /// &#10;Usage: [1,2,3].alternate(0) => 1,0,2,0,3
        /// &#10;Usage: [1,2,3].alternate([-1,-2]) => 1,-1,-2,2,-1,-2,3
        /// </summary>
        /// <param name="alternateValueOrSequence" type="T_or_Enumerable&lt;T>">The value(or values) of insert.</param>
        /// <returns type="Enumerable"></returns>
        var source = this;

        return new Enumerable(function () {
            var buffer;
            var enumerator;
            var alternateSequence;
            var alternateEnumerator;

            return new IEnumerator(
                function () {
                    if (alternateValueOrSequence instanceof Array || alternateValueOrSequence.getEnumerator != null) {
                        alternateSequence = Enumerable.from(Enumerable.from(alternateValueOrSequence).toArray()); // freeze
                    }
                    else {
                        alternateSequence = Enumerable.make(alternateValueOrSequence);
                    }
                    enumerator = source.getEnumerator();
                    if (enumerator.moveNext()) buffer = enumerator.current();
                },
                function () {
                    while (true) {
                        if (alternateEnumerator != null) {
                            if (alternateEnumerator.moveNext()) {
                                return this.yieldReturn(alternateEnumerator.current());
                            }
                            else {
                                alternateEnumerator = null;
                            }
                        }

                        if (buffer == null && enumerator.moveNext()) {
                            buffer = enumerator.current(); // hasNext
                            alternateEnumerator = alternateSequence.getEnumerator();
                            continue; // GOTO
                        }
                        else if (buffer != null) {
                            var retVal = buffer;
                            buffer = null;
                            return this.yieldReturn(retVal);
                        }

                        return this.yieldBreak();
                    }
                },
                function () {
                    try {
                        Utils.dispose(enumerator);
                    }
                    finally {
                        Utils.dispose(alternateEnumerator);
                    }
                });
        });
    };

    // Overload:function(value)
    // Overload:function(value, compareSelector)
    Enumerable.prototype.contains = function (value, compareSelector) {
        /// <summary>Determines whether a sequence contains a specified element.</summary>
        /// <param name="value" type="T">The value to locate in the sequence.</param>
        /// <param name="compareSelector" type="Func&lt;T,TKey>" optional="true">An equality comparer to compare values.</param>
        /// <returns type="Boolean"></returns>
        compareSelector = Utils.createLambda(compareSelector);
        var enumerator = this.getEnumerator();
        try {
            while (enumerator.moveNext()) {
                if (compareSelector(enumerator.current()) === value) return true;
            }
            return false;
        }
        finally {
            Utils.dispose(enumerator);
        }
    };

    Enumerable.prototype.defaultIfEmpty = function (defaultValue) {
        /// <summary>Returns the elements of the specified sequence or the specified value in a singleton collection if the sequence is empty.
        /// &#10;default of defautValue is null.</summary>
        /// <param name="defaultValue" type="T" optional="true">The value to return if the sequence is empty.</param>
        /// <returns type="Enumerable"></returns>
        var source = this;
        if (defaultValue === undefined) defaultValue = null;

        return new Enumerable(function () {
            var enumerator;
            var isFirst = true;

            return new IEnumerator(
                function () { enumerator = source.getEnumerator(); },
                function () {
                    if (enumerator.moveNext()) {
                        isFirst = false;
                        return this.yieldReturn(enumerator.current());
                    }
                    else if (isFirst) {
                        isFirst = false;
                        return this.yieldReturn(defaultValue);
                    }
                    return false;
                },
                function () { Utils.dispose(enumerator); });
        });
    };

    // Overload:function()
    // Overload:function(compareSelector)
    Enumerable.prototype.distinct = function (compareSelector) {
        /// <summary>Returns distinct elements from a sequence.</summary>
        /// <param name="compareSelector" type="Func&lt;T,TKey>" optional="true">An equality comparer to compare values.</param>
        /// <returns type="Enumerable"></returns>
        return this.except(Enumerable.empty(), compareSelector);
    };

    Enumerable.prototype.distinctUntilChanged = function (compareSelector) {
        /// <summary>Returns distinct continuous elements from a sequence.</summary>
        /// <param name="compareSelector" type="Func&lt;T,TKey>" optional="true">An equality comparer to compare values.</param>
        /// <returns type="Enumerable"></returns>
        compareSelector = Utils.createLambda(compareSelector);
        var source = this;

        return new Enumerable(function () {
            var enumerator;
            var compareKey;
            var initial;

            return new IEnumerator(
                function () {
                    enumerator = source.getEnumerator();
                },
                function () {
                    while (enumerator.moveNext()) {
                        var key = compareSelector(enumerator.current());

                        if (initial) {
                            initial = false;
                            compareKey = key;
                            return this.yieldReturn(enumerator.current());
                        }

                        if (compareKey === key) {
                            continue;
                        }

                        compareKey = key;
                        return this.yieldReturn(enumerator.current());
                    }
                    return this.yieldBreak();
                },
                function () { Utils.dispose(enumerator); });
        });
    };

    // Overload:function(second)
    // Overload:function(second, compareSelector)
    Enumerable.prototype.except = function (second, compareSelector) {
        /// <summary>Produces the set difference of two sequences.</summary>
        /// <param name="second" type="Enumerable&lt;T>">An Enumerable&lt;T> whose Elements that also occur in the first sequence will cause those elements to be removed from the returned sequence.</param>
        /// <param name="compareSelector" type="Func&lt;T,TKey>" optional="true">An equality comparer to compare values.</param>
        /// <returns type="Enumerable"></returns>
        compareSelector = Utils.createLambda(compareSelector);
        var source = this;

        return new Enumerable(function () {
            var enumerator;
            var keys;

            return new IEnumerator(
                function () {
                    enumerator = source.getEnumerator();
                    keys = new Dictionary(compareSelector);
                    Enumerable.from(second).forEach(function (key) { keys.add(key); });
                },
                function () {
                    while (enumerator.moveNext()) {
                        var current = enumerator.current();
                        if (!keys.contains(current)) {
                            keys.add(current);
                            return this.yieldReturn(current);
                        }
                    }
                    return false;
                },
                function () { Utils.dispose(enumerator); });
        });
    };

    // Overload:function(second)
    // Overload:function(second, compareSelector)
    Enumerable.prototype.intersect = function (second, compareSelector) {
        /// <summary>Produces the set difference of two sequences.</summary>
        /// <param name="second" type="Enumerable&lt;T>">An Enumerable&lt;T> whose distinct elements that also appear in the first sequence will be returned.</param>
        /// <param name="compareSelector" type="Func&lt;T,TKey>" optional="true">An equality comparer to compare values.</param>
        /// <returns type="Enumerable"></returns>
        compareSelector = Utils.createLambda(compareSelector);
        var source = this;

        return new Enumerable(function () {
            var enumerator;
            var keys;
            var outs;

            return new IEnumerator(
                function () {
                    enumerator = source.getEnumerator();

                    keys = new Dictionary(compareSelector);
                    Enumerable.from(second).forEach(function (key) { keys.add(key); });
                    outs = new Dictionary(compareSelector);
                },
                function () {
                    while (enumerator.moveNext()) {
                        var current = enumerator.current();
                        if (!outs.contains(current) && keys.contains(current)) {
                            outs.add(current);
                            return this.yieldReturn(current);
                        }
                    }
                    return false;
                },
                function () { Utils.dispose(enumerator); });
        });
    };

    // Overload:function(second)
    // Overload:function(second, compareSelector)
    Enumerable.prototype.sequenceEqual = function (second, compareSelector) {
        /// <summary>Determines whether two sequences are equal by comparing the elements.</summary>
        /// <param name="second" type="Enumerable&lt;T>">An Enumerable&lt;T> to compare to the first sequence.</param>
        /// <param name="compareSelector" type="Func&lt;T,TKey>" optional="true">An equality comparer to compare values.</param>
        /// <returns type="Enumerable"></returns>
        compareSelector = Utils.createLambda(compareSelector);

        var firstEnumerator = this.getEnumerator();
        try {
            var secondEnumerator = Enumerable.from(second).getEnumerator();
            try {
                while (firstEnumerator.moveNext()) {
                    if (!secondEnumerator.moveNext()
                    || compareSelector(firstEnumerator.current()) !== compareSelector(secondEnumerator.current())) {
                        return false;
                    }
                }

                if (secondEnumerator.moveNext()) return false;
                return true;
            }
            finally {
                Utils.dispose(secondEnumerator);
            }
        }
        finally {
            Utils.dispose(firstEnumerator);
        }
    };

    Enumerable.prototype.union = function (second, compareSelector) {
        /// <summary>Produces the union of two sequences.</summary>
        /// <param name="second" type="Enumerable&lt;T>">An Enumerable&lt;T> whose distinct elements form the second set for the union.</param>
        /// <param name="compareSelector" type="Func&lt;T,TKey>" optional="true">An equality comparer to compare values.</param>
        /// <returns type="Enumerable"></returns>
        compareSelector = Utils.createLambda(compareSelector);
        var source = this;

        return new Enumerable(function () {
            var firstEnumerator;
            var secondEnumerator;
            var keys;

            return new IEnumerator(
                function () {
                    firstEnumerator = source.getEnumerator();
                    keys = new Dictionary(compareSelector);
                },
                function () {
                    var current;
                    if (secondEnumerator === undefined) {
                        while (firstEnumerator.moveNext()) {
                            current = firstEnumerator.current();
                            if (!keys.contains(current)) {
                                keys.add(current);
                                return this.yieldReturn(current);
                            }
                        }
                        secondEnumerator = Enumerable.from(second).getEnumerator();
                    }
                    while (secondEnumerator.moveNext()) {
                        current = secondEnumerator.current();
                        if (!keys.contains(current)) {
                            keys.add(current);
                            return this.yieldReturn(current);
                        }
                    }
                    return false;
                },
                function () {
                    try {
                        Utils.dispose(firstEnumerator);
                    }
                    finally {
                        Utils.dispose(secondEnumerator);
                    }
                });
        });
    };

    /* Ordering Methods */

    Enumerable.prototype.orderBy = function (keySelector) {
        /// <signature>
        /// <summary>Sorts the elements of a sequence in ascending order according to a key.</summary>
        /// <param name="keySelector" type="Func&lt;T,TKey>" optional="true">A function to extract a key from an element.</param>
        /// <returns type="OrderedEnumerable"></returns>
        /// </signature>
        /// <summary>Sorts the elements of a sequence in ascending order according to a key.</summary>
        /// <param name="keySelector" type="Func&lt;T,TKey>" optional="true">A function to extract a key from an element.</param>
        return new OrderedEnumerable(this, keySelector, false);
    };

    Enumerable.prototype.orderByDescending = function (keySelector) {
        /// <signature>
        /// <summary>Sorts the elements of a sequence in descending order according to a key.</summary>
        /// <param name="keySelector" type="Func&lt;T,TKey>" optional="true">A function to extract a key from an element.</param>
        /// <returns type="OrderedEnumerable"></returns>
        /// </signature>
        /// <summary>Sorts the elements of a sequence in descending order according to a key.</summary>
        /// <param name="keySelector" type="Func&lt;T,TKey>" optional="true">A function to extract a key from an element.</param>
        return new OrderedEnumerable(this, keySelector, true);
    };

    Enumerable.prototype.reverse = function () {
        /// <summary>Inverts the order of the elements in a sequence.</summary>
        /// <returns type="Enumerable"></returns>
        var source = this;

        return new Enumerable(function () {
            var buffer;
            var index;

            return new IEnumerator(
                function () {
                    buffer = source.toArray();
                    index = buffer.length;
                },
                function () {
                    return (index > 0)
                        ? this.yieldReturn(buffer[--index])
                        : false;
                },
                Functions.Blank);
        });
    };

    Enumerable.prototype.shuffle = function () {
        /// <summary>Shuffle sequence.</summary>
        /// <returns type="Enumerable"></returns>
        var source = this;

        return new Enumerable(function () {
            var buffer;

            return new IEnumerator(
                function () { buffer = source.toArray(); },
                function () {
                    if (buffer.length > 0) {
                        var i = Math.floor(Math.random() * buffer.length);
                        return this.yieldReturn(buffer.splice(i, 1)[0]);
                    }
                    return false;
                },
                Functions.Blank);
        });
    };

    Enumerable.prototype.weightedSample = function (weightSelector) {
        /// <summary>Weighted sampling sequence by weightSelector. The result is infinite sequence.</summary>
        /// <param name="weightSelector" type="Func&lt;T,TKey>" optional="true">A function to select a weight from an element.</param>
        /// <returns type="Enumerable"></returns>
        weightSelector = Utils.createLambda(weightSelector);
        var source = this;

        return new Enumerable(function () {
            var sortedByBound;
            var totalWeight = 0;

            return new IEnumerator(
                function () {
                    sortedByBound = source
                        .choose(function (x) {
                            var weight = weightSelector(x);
                            if (weight <= 0) return null; // ignore 0

                            totalWeight += weight;
                            return { value: x, bound: totalWeight };
                        })
                        .toArray();
                },
                function () {
                    if (sortedByBound.length > 0) {
                        var draw = Math.floor(Math.random() * totalWeight) + 1;

                        var lower = -1;
                        var upper = sortedByBound.length;
                        while (upper - lower > 1) {
                            var index = Math.floor((lower + upper) / 2);
                            if (sortedByBound[index].bound >= draw) {
                                upper = index;
                            }
                            else {
                                lower = index;
                            }
                        }

                        return this.yieldReturn(sortedByBound[upper].value);
                    }

                    return this.yieldBreak();
                },
                Functions.Blank);
        });
    };

    /* Grouping Methods */

    // Overload:function(keySelector)
    // Overload:function(keySelector,elementSelector)
    // Overload:function(keySelector,elementSelector,resultSelector)
    // Overload:function(keySelector,elementSelector,resultSelector,compareSelector)
    Enumerable.prototype.groupBy = function (keySelector, elementSelector, resultSelector, compareSelector) {
        /// <summary>Groups the elements of a sequence according to a specified key selector function.</summary>
        /// <param name="keySelector" type="Func&lt;T,TKey>" optional="true">A function to extract the key for each element.</param>
        /// <param name="elementSelector" type="Func&lt;T,TElement>" optional="true">A function to map each source element to an element in an Grouping&lt;TKey, TElement>.</param>
        /// <param name="resultSelector" type="Func&lt;TKey,Enumerable&lt;TElement>,TResult>" optional="true">A function to create a result value from each group.</param>
        /// <param name="compareSelector" type="Func&lt;TKey,TCompare>" optional="true">An equality comparer to compare values.</param>
        /// <returns type="Enumerable"></returns>
        var source = this;
        keySelector = Utils.createLambda(keySelector);
        elementSelector = Utils.createLambda(elementSelector);
        if (resultSelector != null) resultSelector = Utils.createLambda(resultSelector);
        compareSelector = Utils.createLambda(compareSelector);

        return new Enumerable(function () {
            var enumerator;

            return new IEnumerator(
                function () {
                    enumerator = source.toLookup(keySelector, elementSelector, compareSelector)
                        .toEnumerable()
                        .getEnumerator();
                },
                function () {
                    while (enumerator.moveNext()) {
                        return (resultSelector == null)
                            ? this.yieldReturn(enumerator.current())
                            : this.yieldReturn(resultSelector(enumerator.current().key(), enumerator.current()));
                    }
                    return false;
                },
                function () { Utils.dispose(enumerator); });
        });
    };

    // Overload:function(keySelector)
    // Overload:function(keySelector,elementSelector)
    // Overload:function(keySelector,elementSelector,resultSelector)
    // Overload:function(keySelector,elementSelector,resultSelector,compareSelector)
    Enumerable.prototype.partitionBy = function (keySelector, elementSelector, resultSelector, compareSelector) {
        /// <summary>Create Group by continuation key.</summary>
        /// <param name="keySelector" type="Func&lt;T,TKey>" optional="true">A function to extract the key for each element.</param>
        /// <param name="elementSelector" type="Func&lt;T,TElement>" optional="true">A function to map each source element to an element in an Grouping&lt;TKey, TElement>.</param>
        /// <param name="resultSelector" type="Func&lt;TKey,Enumerable&lt;TElement>,TResult>" optional="true">A function to create a result value from each group.</param>
        /// <param name="compareSelector" type="Func&lt;TKey,TCompare>" optional="true">An equality comparer to compare values.</param>
        /// <returns type="Enumerable"></returns>
        var source = this;
        keySelector = Utils.createLambda(keySelector);
        elementSelector = Utils.createLambda(elementSelector);
        compareSelector = Utils.createLambda(compareSelector);
        var hasResultSelector;
        if (resultSelector == null) {
            hasResultSelector = false;
            resultSelector = function (key, group) { return new Grouping(key, group); };
        }
        else {
            hasResultSelector = true;
            resultSelector = Utils.createLambda(resultSelector);
        }

        return new Enumerable(function () {
            var enumerator;
            var key;
            var compareKey;
            var group = [];

            return new IEnumerator(
                function () {
                    enumerator = source.getEnumerator();
                    if (enumerator.moveNext()) {
                        key = keySelector(enumerator.current());
                        compareKey = compareSelector(key);
                        group.push(elementSelector(enumerator.current()));
                    }
                },
                function () {
                    var hasNext;
                    while ((hasNext = enumerator.moveNext()) == true) {
                        if (compareKey === compareSelector(keySelector(enumerator.current()))) {
                            group.push(elementSelector(enumerator.current()));
                        }
                        else break;
                    }

                    if (group.length > 0) {
                        var result = (hasResultSelector)
                            ? resultSelector(key, Enumerable.from(group))
                            : resultSelector(key, group);
                        if (hasNext) {
                            key = keySelector(enumerator.current());
                            compareKey = compareSelector(key);
                            group = [elementSelector(enumerator.current())];
                        }
                        else group = [];

                        return this.yieldReturn(result);
                    }

                    return false;
                },
                function () { Utils.dispose(enumerator); });
        });
    };

    Enumerable.prototype.buffer = function (count) {
        /// <summary>Divide by count</summary>
        /// <param name="count" type="Number" integer="true">integer</param>
        /// <returns type="Enumerable"></returns>
        var source = this;

        return new Enumerable(function () {
            var enumerator;

            return new IEnumerator(
                function () { enumerator = source.getEnumerator(); },
                function () {
                    var array = [];
                    var index = 0;
                    while (enumerator.moveNext()) {
                        array.push(enumerator.current());
                        if (++index >= count) return this.yieldReturn(array);
                    }
                    if (array.length > 0) return this.yieldReturn(array);
                    return false;
                },
                function () { Utils.dispose(enumerator); });
        });
    };

    /* Aggregate Methods */

    // Overload:function(func)
    // Overload:function(seed,func)
    // Overload:function(seed,func,resultSelector)
    Enumerable.prototype.aggregate = function (seed, func, resultSelector) {
        /// <signature>
        ///   <summary>Applies an accumulator function over a sequence.</summary>
        ///   <param name="func" type="Func&lt;TSource,TSource,TSource>">An accumulator function to be invoked on each element.</param>
        ///   <returns type="TAccumulate"></returns>
        /// </signature>
        /// <signature>
        ///   <summary>Applies an accumulator function over a sequence.</summary>
        ///   <param name="seed" type="TAccumulate">the initial accumulator value.</param>
        ///   <param name="func" type="Func&lt;TAccumulate,TSource,TAccumulate>">An accumulator function to be invoked on each element.</param>
        ///   <param name="resultSelector" type="Func&lt;TAccumulate,TResult>" optional="true">A function to transform the final accumulator value into the result value.</param>
        ///   <returns type="TResult"></returns>
        /// </signature>
        /// <summary>Applies an accumulator function over a sequence.</summary>
        /// <param name="seed" type="Func&lt;T,T,T>_or_TAccumulate">Func is an accumulator function to be invoked on each element. Seed is the initial accumulator value.</param>
        /// <param name="func" type="Optional:Func&lt;TAccumulate,T,TAccumulate>" optional="true">An accumulator function to be invoked on each element.</param>
        /// <param name="resultSelector" type="Optional:Func&lt;TAccumulate,TResult>" optional="true">A function to transform the final accumulator value into the result value.</param>
        resultSelector = Utils.createLambda(resultSelector);
        return resultSelector(this.scan(seed, func, resultSelector).last());
    };

    // Overload:function()
    // Overload:function(selector)
    Enumerable.prototype.average = function (selector) {
        /// <summary>Computes the average of a sequence.</summary>
        /// <param name="selector" type="Func&lt;T,Number>" optional="true">A transform function to apply to each element.</param>
        /// <returns type="Number"></returns>
        selector = Utils.createLambda(selector);

        var sum = 0;
        var count = 0;
        this.forEach(function (x) {
            sum += selector(x);
            ++count;
        });

        return sum / count;
    };

    // Overload:function()
    // Overload:function(predicate)
    Enumerable.prototype.count = function (predicate) {
        /// <summary>Returns the number of elements in a sequence.</summary>
        /// <param name="predicate" type="Func&lt;T,Boolean>" optional="true">A function to test each element for a condition.</param>
        /// <returns type="Number"></returns>
        predicate = (predicate == null) ? Functions.True : Utils.createLambda(predicate);

        var count = 0;
        this.forEach(function (x, i) {
            if (predicate(x, i))++count;
        });
        return count;
    };

    // Overload:function()
    // Overload:function(selector)
    Enumerable.prototype.max = function (selector) {
        /// <summary>Returns the maximum value in a sequence</summary>
        /// <param name="selector" type="Func&lt;T,TKey>" optional="true">A transform function to apply to each element.</param>
        /// <returns type="Number"></returns>
        if (selector == null) selector = Functions.Identity;
        return this.select(selector).aggregate(function (a, b) { return (a > b) ? a : b; });
    };

    // Overload:function()
    // Overload:function(selector)
    Enumerable.prototype.min = function (selector) {
        /// <summary>Returns the minimum value in a sequence</summary>
        /// <param name="selector" type="Func&lt;T,TKey>" optional="true">A transform function to apply to each element.</param>
        /// <returns type="Number"></returns>
        if (selector == null) selector = Functions.Identity;
        return this.select(selector).aggregate(function (a, b) { return (a < b) ? a : b; });
    };

    Enumerable.prototype.maxBy = function (keySelector) {
        /// <summary>Returns the maximum value in a sequence by keySelector</summary>
        /// <param name="keySelector" type="Func&lt;T,TKey>">A compare selector of element.</param>
        /// <returns type="T"></returns>
        keySelector = Utils.createLambda(keySelector);
        return this.aggregate(function (a, b) { return (keySelector(a) > keySelector(b)) ? a : b; });
    };

    Enumerable.prototype.minBy = function (keySelector) {
        /// <summary>Returns the minimum value in a sequence by keySelector</summary>
        /// <param name="keySelector" type="Func&lt;T,TKey>">A compare selector of element.</param>
        /// <returns type="T"></returns>
        keySelector = Utils.createLambda(keySelector);
        return this.aggregate(function (a, b) { return (keySelector(a) < keySelector(b)) ? a : b; });
    };

    // Overload:function()
    // Overload:function(selector)
    Enumerable.prototype.sum = function (selector) {
        /// <summary>Computes the sum of a sequence of values.</summary>
        /// <param name="selector" type="Func&lt;T,TKey>" optional="true">A transform function to apply to each element.</param>
        /// <returns type="Number"></returns>
        if (selector == null) selector = Functions.Identity;
        return this.select(selector).aggregate(0, function (a, b) { return a + b; });
    };

    /* Paging Methods */

    Enumerable.prototype.elementAt = function (index) {
        /// <summary>Returns the element at a specified index in a sequence.</summary>
        /// <param name="index" type="Number" integer="true">The zero-based index of the element to retrieve.</param>
        /// <returns type="T"></returns>
        var value;
        var found = false;
        this.forEach(function (x, i) {
            if (i == index) {
                value = x;
                found = true;
                return false;
            }
        });

        if (!found) throw new Error("index is less than 0 or greater than or equal to the number of elements in source.");
        return value;
    };

    Enumerable.prototype.elementAtOrDefault = function (index, defaultValue) {
        /// <summary>Returns the element at a specified index in a sequence or a default value if the index is out of range.
        /// &#10;default of defautValue is null.</summary>
        /// <param name="index" type="Number" integer="true">The zero-based index of the element to retrieve.</param>
        /// <param name="defaultValue" type="T" optional="true">The value if the index is outside the bounds then send.</param>
        /// <returns type="T"></returns>
        if (defaultValue === undefined) defaultValue = null;
        var value;
        var found = false;
        this.forEach(function (x, i) {
            if (i == index) {
                value = x;
                found = true;
                return false;
            }
        });

        return (!found) ? defaultValue : value;
    };

    // Overload:function()
    // Overload:function(predicate)
    Enumerable.prototype.first = function (predicate) {
        /// <summary>Returns the first element of a sequence.</summary>
        /// <param name="predicate" type="Func&lt;T,Boolean>" optional="true">A function to test each element for a condition.</param>
        /// <returns type="T"></returns>
        if (predicate != null) return this.where(predicate).first();

        var value;
        var found = false;
        this.forEach(function (x) {
            value = x;
            found = true;
            return false;
        });

        if (!found) throw new Error("first:No element satisfies the condition.");
        return value;
    };

    Enumerable.prototype.firstOrDefault = function (predicate, defaultValue) {
        /// <summary>Returns the first element of a sequence, or a default value.
        /// &#10;default of defautValue is null.</summary>
        /// <param name="predicate" type="Func&lt;T,Boolean>" optional="true">A function to test each element for a condition. If null then no use predicate.</param>
        /// <param name="defaultValue" type="T" optional="true">The value if not found then send.</param>
        /// <returns type="T"></returns>
        if (defaultValue === undefined) defaultValue = null;
        if (predicate != null) return this.where(predicate).firstOrDefault(null, defaultValue);

        var value;
        var found = false;
        this.forEach(function (x) {
            value = x;
            found = true;
            return false;
        });
        return (!found) ? defaultValue : value;
    };

    // Overload:function()
    // Overload:function(predicate)
    Enumerable.prototype.last = function (predicate) {
        /// <summary>Returns the last element of a sequence.</summary>
        /// <param name="predicate" type="Func&lt;T,Boolean>" optional="true">A function to test each element for a condition.</param>
        /// <returns type="T"></returns>
        if (predicate != null) return this.where(predicate).last();

        var value;
        var found = false;
        this.forEach(function (x) {
            found = true;
            value = x;
        });

        if (!found) throw new Error("last:No element satisfies the condition.");
        return value;
    };

    Enumerable.prototype.lastOrDefault = function (predicate, defaultValue) {
        /// <summary>Returns the last element of a sequence, or a default value.
        /// &#10;default of defautValue is null.</summary>
        /// <param name="predicate" type="Func&lt;T,Boolean>" optional="true">A function to test each element for a condition. If null then no use predicate.</param>
        /// <param name="defaultValue" type="T" optional="true">The value if not found then send.</param>
        /// <returns type="T"></returns>
        if (defaultValue === undefined) defaultValue = null;
        if (predicate != null) return this.where(predicate).lastOrDefault(null, defaultValue);

        var value;
        var found = false;
        this.forEach(function (x) {
            found = true;
            value = x;
        });
        return (!found) ? defaultValue : value;
    };

    // Overload:function()
    // Overload:function(predicate)
    Enumerable.prototype.single = function (predicate) {
        /// <summary>Returns the only element of a sequence that satisfies a specified condition, and throws an exception if more than one such element exists.</summary>
        /// <param name="predicate" type="Func&lt;T,Boolean>" optional="true">A function to test each element for a condition.</param>
        /// <returns type="T"></returns>
        if (predicate != null) return this.where(predicate).single();

        var value;
        var found = false;
        this.forEach(function (x) {
            if (!found) {
                found = true;
                value = x;
            } else throw new Error("single:sequence contains more than one element.");
        });

        if (!found) throw new Error("single:No element satisfies the condition.");
        return value;
    };

    // Overload:function(defaultValue)
    // Overload:function(defaultValue,predicate)
    Enumerable.prototype.singleOrDefault = function (predicate, defaultValue) {
        /// <summary>Returns a single, specific element of a sequence of values, or a default value if no such element is found.
        /// &#10;default of defautValue is null.</summary>
        /// <param name="predicate" type="Func&lt;T,Boolean>" optional="true">A function to test each element for a condition. If null then no use predicate.</param>
        /// <param name="defaultValue" type="T" optional="true">The value if not found then send.</param>
        /// <returns type="T"></returns>
        if (defaultValue === undefined) defaultValue = null;
        if (predicate != null) return this.where(predicate).singleOrDefault(null, defaultValue);

        var value;
        var found = false;
        this.forEach(function (x) {
            if (!found) {
                found = true;
                value = x;
            } else throw new Error("single:sequence contains more than one element.");
        });

        return (!found) ? defaultValue : value;
    };

    Enumerable.prototype.skip = function (count) {
        /// <summary>Bypasses a specified number of elements in a sequence and then returns the remaining elements.</summary>
        /// <param name="count" type="Number" integer="true">The number of elements to skip before returning the remaining elements.</param>
        /// <returns type="Enumerable"></returns>
        var source = this;

        return new Enumerable(function () {
            var enumerator;
            var index = 0;

            return new IEnumerator(
                function () {
                    enumerator = source.getEnumerator();
                    while (index++ < count && enumerator.moveNext()) {
                    }
                    ;
                },
                function () {
                    return (enumerator.moveNext())
                        ? this.yieldReturn(enumerator.current())
                        : false;
                },
                function () { Utils.dispose(enumerator); });
        });
    };

    // Overload:function(predicate<element>)
    // Overload:function(predicate<element,index>)
    Enumerable.prototype.skipWhile = function (predicate) {
        /// <summary>Bypasses elements in a sequence as long as a specified condition is true and then returns the remaining elements.</summary>
        /// <param name="predicate" type="Func&lt;T,int,Boolean>">A function to test each source element for a condition; Optional:the second parameter of the function represents the index of the source element.</param>
        /// <returns type="Enumerable"></returns>
        predicate = Utils.createLambda(predicate);
        var source = this;

        return new Enumerable(function () {
            var enumerator;
            var index = 0;
            var isSkipEnd = false;

            return new IEnumerator(
                function () { enumerator = source.getEnumerator(); },
                function () {
                    while (!isSkipEnd) {
                        if (enumerator.moveNext()) {
                            if (!predicate(enumerator.current(), index++)) {
                                isSkipEnd = true;
                                return this.yieldReturn(enumerator.current());
                            }
                            continue;
                        } else return false;
                    }

                    return (enumerator.moveNext())
                        ? this.yieldReturn(enumerator.current())
                        : false;

                },
                function () { Utils.dispose(enumerator); });
        });
    };

    Enumerable.prototype.take = function (count) {
        /// <summary>Returns a specified number of contiguous elements from the start of a sequence.</summary>
        /// <param name="count" type="Number" integer="true">The number of elements to return.</param>
        /// <returns type="Enumerable"></returns>
        var source = this;

        return new Enumerable(function () {
            var enumerator;
            var index = 0;

            return new IEnumerator(
                function () { enumerator = source.getEnumerator(); },
                function () {
                    return (index++ < count && enumerator.moveNext())
                        ? this.yieldReturn(enumerator.current())
                        : false;
                },
                function () { Utils.dispose(enumerator); }
            );
        });
    };

    // Overload:function(predicate<element>)
    // Overload:function(predicate<element,index>)
    Enumerable.prototype.takeWhile = function (predicate) {
        /// <summary>Returns elements from a sequence as long as a specified condition is true, and then skips the remaining elements.</summary>
        /// <param name="predicate" type="Func&lt;T,int,Boolean>">A function to test each source element for a condition; Optional:the second parameter of the function represents the index of the source element.</param>
        /// <returns type="Enumerable"></returns>
        predicate = Utils.createLambda(predicate);
        var source = this;

        return new Enumerable(function () {
            var enumerator;
            var index = 0;

            return new IEnumerator(
                function () { enumerator = source.getEnumerator(); },
                function () {
                    return (enumerator.moveNext() && predicate(enumerator.current(), index++))
                        ? this.yieldReturn(enumerator.current())
                        : false;
                },
                function () { Utils.dispose(enumerator); });
        });
    };

    // Overload:function()
    // Overload:function(count)
    Enumerable.prototype.takeExceptLast = function (count) {
        /// <summary>Take a sequence except last count. The default count is 1.</summary>
        /// <param name="count" type="Number" integer="true" optional="true">The number of skip count.</param>
        /// <returns type="Enumerable"></returns>
        if (count == null) count = 1;
        var source = this;

        return new Enumerable(function () {
            if (count <= 0) return source.getEnumerator(); // do nothing

            var enumerator;
            var q = [];

            return new IEnumerator(
                function () { enumerator = source.getEnumerator(); },
                function () {
                    while (enumerator.moveNext()) {
                        if (q.length == count) {
                            q.push(enumerator.current());
                            return this.yieldReturn(q.shift());
                        }
                        q.push(enumerator.current());
                    }
                    return false;
                },
                function () { Utils.dispose(enumerator); });
        });
    };

    Enumerable.prototype.takeFromLast = function (count) {
        /// <summary>Take a sequence from last count.</summary>
        /// <param name="count" type="Number" integer="true">The number of take count.</param>
        /// <returns type="Enumerable"></returns>
        if (count <= 0 || count == null) return Enumerable.empty();
        var source = this;

        return new Enumerable(function () {
            var sourceEnumerator;
            var enumerator;
            var q = [];

            return new IEnumerator(
                function () { sourceEnumerator = source.getEnumerator(); },
                function () {
                    while (sourceEnumerator.moveNext()) {
                        if (q.length == count) q.shift();
                        q.push(sourceEnumerator.current());
                    }
                    if (enumerator == null) {
                        enumerator = Enumerable.from(q).getEnumerator();
                    }
                    return (enumerator.moveNext())
                        ? this.yieldReturn(enumerator.current())
                        : false;
                },
                function () { Utils.dispose(enumerator); });
        });
    };

    Enumerable.prototype.indexOf = function (item) {
        /// <summary>Returns the zero-based index of the flrst occurrence of a value.</summary>
        /// <param name="item" type="T">The zero-based starting index of the search.</param>
        /// <returns type="Number" integer="true"></returns>
        var found = null;

        // item as predicate
        if (typeof (item) === Types.Function) {
            this.forEach(function (x, i) {
                if (item(x, i)) {
                    found = i;
                    return false;
                }
            });
        }
        else {
            this.forEach(function (x, i) {
                if (x === item) {
                    found = i;
                    return false;
                }
            });
        }

        return (found !== null) ? found : -1;
    };

    Enumerable.prototype.lastIndexOf = function (item) {
        /// <summary>Returns the zero-based index of the last occurrence of a value.</summary>
        /// <param name="item" type="T">The zero-based starting index of the search.</param>
        /// <returns type="Number" integer="true"></returns>
        var result = -1;

        // item as predicate
        if (typeof (item) === Types.Function) {
            this.forEach(function (x, i) {
                if (item(x, i)) result = i;
            });
        }
        else {
            this.forEach(function (x, i) {
                if (x === item) result = i;
            });
        }

        return result;
    };

    /* Convert Methods */

    Enumerable.prototype.asEnumerable = function () {
        /// <summary>Convert sequence as enumerable. This same as Enumerable.from(seq).</summary>
        /// <returns type="Enumerable"></returns>
        return Enumerable.from(this);
    };

    Enumerable.prototype.toArray = function () {
        /// <summary>Creates an array from this sequence.</summary>
        /// <returns type="Array"></returns>
        var array = [];
        this.forEach(function (x) { array.push(x); });
        return array;
    };

    // Overload:function(keySelector)
    // Overload:function(keySelector, elementSelector)
    // Overload:function(keySelector, elementSelector, compareSelector)
    Enumerable.prototype.toLookup = function (keySelector, elementSelector, compareSelector) {
        /// <summary>Creates a Lookup from this sequence.</summary>
        /// <param name="keySelector" type="Func&lt;T,TKey>" optional="true">A function to extract a key from each element.</param>
        /// <param name="elementSelector" type="Func&lt;T,TElement>" optional="true">A transform function to produce a result element value from each element.</param>
        /// <param name="compareSelector" type="Func&lt;TKey,TCompare>" optional="true">An equality comparer to compare values.</param>
        keySelector = Utils.createLambda(keySelector);
        elementSelector = Utils.createLambda(elementSelector);
        compareSelector = Utils.createLambda(compareSelector);

        var dict = new Dictionary(compareSelector);
        this.forEach(function (x) {
            var key = keySelector(x);
            var element = elementSelector(x);

            var array = dict.get(key);
            if (array !== undefined) array.push(element);
            else dict.add(key, [element]);
        });
        return new Lookup(dict);
    };

    Enumerable.prototype.toObject = function (keySelector, elementSelector) {
        /// <summary>Creates a Object from this sequence.</summary>
        /// <param name="keySelector" type="Func&lt;T,String>" optional="true">A function to extract a key from each element.</param>
        /// <param name="elementSelector" type="Func&lt;T,TElement>" optional="true">A transform function to produce a result element value from each element.</param>
        /// <returns type="Object"></returns>
        keySelector = Utils.createLambda(keySelector);
        elementSelector = Utils.createLambda(elementSelector);

        var obj = {};
        this.forEach(function (x) {
            obj[keySelector(x)] = elementSelector(x);
        });
        return obj;
    };

    // Overload:function(keySelector, elementSelector)
    // Overload:function(keySelector, elementSelector, compareSelector)
    Enumerable.prototype.toDictionary = function (keySelector, elementSelector, compareSelector) {
        /// <summary>Creates a Dictionary from this sequence.</summary>
        /// <param name="keySelector" type="Func&lt;T,TKey>" optional="true">A function to extract a key from each element.</param>
        /// <param name="elementSelector" type="Func&lt;T,TElement>" optional="true">A transform function to produce a result element value from each element.</param>
        /// <param name="compareSelector" type="Func&lt;TKey,TCompare>" optional="true">An equality comparer to compare values.</param>
        keySelector = Utils.createLambda(keySelector);
        elementSelector = Utils.createLambda(elementSelector);
        compareSelector = Utils.createLambda(compareSelector);

        var dict = new Dictionary(compareSelector);
        this.forEach(function (x) {
            dict.add(keySelector(x), elementSelector(x));
        });
        return dict;
    };

    // Overload:function()
    // Overload:function(replacer)
    // Overload:function(replacer, space)
    Enumerable.prototype.toJSONString = function (replacer, space) {
        /// <summary>Creates a JSON String from sequence, performed only native JSON support browser or included json2.js.</summary>
        /// <param name="replacer" type="Function" optional="true">a replacer.</param>
        /// <param name="space" type="Number" optional="true">indent spaces.</param>
        /// <returns type="String"></returns>
        if (typeof JSON === Types.Undefined || JSON.stringify == null) {
            throw new Error("toJSONString can't find JSON.stringify. This works native JSON support Browser or include json2.js");
        }
        return JSON.stringify(this.toArray(), replacer, space);
    };

    // Overload:function()
    // Overload:function(separator)
    // Overload:function(separator,selector)
    Enumerable.prototype.toJoinedString = function (separator, selector) {
        /// <summary>Creates Joined string from this sequence. The default separator is "".</summary>
        /// <param name="separator" type="String" optional="true">A String.</param>
        /// <param name="selector" type="Func&lt;T,String>" optional="true">A transform function to apply to each source element.</param>
        /// <returns type="String"></returns>
        if (separator == null) separator = "";
        if (selector == null) selector = Functions.Identity;

        return this.select(selector).toArray().join(separator);
    };


    /* Action Methods */

    // Overload:function(action<element>)
    // Overload:function(action<element,index>)
    Enumerable.prototype.doAction = function (action) {
        /// <summary>Performs the specified action on each element of the sequence.</summary>
        /// <param name="action" type="Action&lt;T,int>">action on each element. Optional:the second parameter of the function represents the index of the source element.</param>
        /// <returns type="Enumerable"></returns>
        var source = this;
        action = Utils.createLambda(action);

        return new Enumerable(function () {
            var enumerator;
            var index = 0;

            return new IEnumerator(
                function () { enumerator = source.getEnumerator(); },
                function () {
                    if (enumerator.moveNext()) {
                        action(enumerator.current(), index++);
                        return this.yieldReturn(enumerator.current());
                    }
                    return false;
                },
                function () { Utils.dispose(enumerator); });
        });
    };

    // Overload:function(action<element>)
    // Overload:function(action<element,index>)
    // Overload:function(func<element,bool>)
    // Overload:function(func<element,index,bool>)
    Enumerable.prototype.forEach = function (action) {
        /// <summary>Performs the specified action on each element of the sequence.</summary>
        /// <param name="action" type="Action&lt;T,int>">[return true;]continue iteration.[return false;]break iteration. Optional:the second parameter of the function represents the index of the source element.</param>
        /// <returns type="void"></returns>
        action = Utils.createLambda(action);

        var index = 0;
        var enumerator = this.getEnumerator();
        try {
            while (enumerator.moveNext()) {
                if (action(enumerator.current(), index++) === false) break;
            }
        } finally {
            Utils.dispose(enumerator);
        }
    };

    // Overload:function()
    // Overload:function(separator)
    // Overload:function(separator,selector)
    Enumerable.prototype.write = function (separator, selector) {
        /// <summary>Do document.write.</summary>
        /// <param name="separator" type="String" optional="true">A String.</param>
        /// <param name="selector" type="Func&lt;T,String>" optional="true">A transform function to apply to each source element.</param>
        /// <returns type="void"></returns>
        if (separator == null) separator = "";
        selector = Utils.createLambda(selector);

        var isFirst = true;
        this.forEach(function (item) {
            if (isFirst) isFirst = false;
            else document.write(separator);
            document.write(selector(item));
        });
    };

    // Overload:function()
    // Overload:function(selector)
    Enumerable.prototype.writeLine = function (selector) {
        /// <summary>Do document.writeln + br.</summary>
        /// <param name="selector" type="Func&lt;T,String>" optional="true">A transform function to apply to each source element.</param>
        /// <returns type="void"></returns>
        selector = Utils.createLambda(selector);

        this.forEach(function (item) {
            document.writeln(selector(item) + "<br />");
        });
    };

    Enumerable.prototype.force = function () {
        /// <summary>Execute enumerate.</summary>
        /// <returns type="void"></returns>
        var enumerator = this.getEnumerator();

        try {
            while (enumerator.moveNext()) {
            }
        }
        finally {
            Utils.dispose(enumerator);
        }
    };

    /* Functional Methods */

    Enumerable.prototype.letBind = function (func) {
        /// <summary>Bind the source to the parameter so that it can be used multiple times.</summary>
        /// <param name="func" type="Func&lt;Enumerable&lt;T>,Enumerable&lt;TR>>">apply function.</param>
        /// <returns type="Enumerable"></returns>
        func = Utils.createLambda(func);
        var source = this;

        return new Enumerable(function () {
            var enumerator;

            return new IEnumerator(
                function () {
                    enumerator = Enumerable.from(func(source)).getEnumerator();
                },
                function () {
                    return (enumerator.moveNext())
                        ? this.yieldReturn(enumerator.current())
                        : false;
                },
                function () { Utils.dispose(enumerator); });
        });
    };

    Enumerable.prototype.share = function () {
        /// <signature>
        /// <summary>Shares cursor of all enumerators to the sequence.</summary>
        /// <returns type="DisposableEnumerable"></returns>
        /// </signature>
        /// <summary>Shares cursor of all enumerators to the sequence.</summary>
        /// <returns type="Enumerable"></returns>
        var source = this;
        var sharedEnumerator;
        var disposed = false;

        return new DisposableEnumerable(function () {
            return new IEnumerator(
                function () {
                    if (sharedEnumerator == null) {
                        sharedEnumerator = source.getEnumerator();
                    }
                },
                function () {
                    if (disposed) throw new Error("enumerator is disposed");

                    return (sharedEnumerator.moveNext())
                        ? this.yieldReturn(sharedEnumerator.current())
                        : false;
                },
                Functions.Blank
            );
        }, function () {
            disposed = true;
            Utils.dispose(sharedEnumerator);
        });
    };

    Enumerable.prototype.memoize = function () {
        /// <signature>
        /// <summary>Creates an enumerable that enumerates the original enumerable only once and caches its results.</summary>
        /// <returns type="DisposableEnumerable"></returns>
        /// </signature>
        /// <summary>Creates an enumerable that enumerates the original enumerable only once and caches its results.</summary>
        /// <returns type="Enumerable"></returns>
        var source = this;
        var cache;
        var enumerator;
        var disposed = false;

        return new DisposableEnumerable(function () {
            var index = -1;

            return new IEnumerator(
                function () {
                    if (enumerator == null) {
                        enumerator = source.getEnumerator();
                        cache = [];
                    }
                },
                function () {
                    if (disposed) throw new Error("enumerator is disposed");

                    index++;
                    if (cache.length <= index) {
                        return (enumerator.moveNext())
                            ? this.yieldReturn(cache[index] = enumerator.current())
                            : false;
                    }

                    return this.yieldReturn(cache[index]);
                },
                Functions.Blank
            );
        }, function () {
            disposed = true;
            Utils.dispose(enumerator);
            cache = null;
        });
    };

    /* Error Handling Methods */

    Enumerable.prototype.catchError = function (handler) {
        /// <summary>catch error and do handler.</summary>
        /// <param name="handler" type="Action&lt;Error>">execute if error occured.</param>
        /// <returns type="Enumerable"></returns>
        handler = Utils.createLambda(handler);
        var source = this;

        return new Enumerable(function () {
            var enumerator;

            return new IEnumerator(
                function () { enumerator = source.getEnumerator(); },
                function () {
                    try {
                        return (enumerator.moveNext())
                            ? this.yieldReturn(enumerator.current())
                            : false;
                    } catch (e) {
                        handler(e);
                        return false;
                    }
                },
                function () { Utils.dispose(enumerator); });
        });
    };

    Enumerable.prototype.finallyAction = function (finallyAction) {
        /// <summary>do action if enumerate end or disposed or error occured.</summary>
        /// <param name="finallyAction" type="Action">finally execute.</param>
        /// <returns type="Enumerable"></returns>
        finallyAction = Utils.createLambda(finallyAction);
        var source = this;

        return new Enumerable(function () {
            var enumerator;

            return new IEnumerator(
                function () { enumerator = source.getEnumerator(); },
                function () {
                    return (enumerator.moveNext())
                        ? this.yieldReturn(enumerator.current())
                        : false;
                },
                function () {
                    try {
                        Utils.dispose(enumerator);
                    } finally {
                        finallyAction();
                    }
                });
        });
    };

    /* For Debug Methods */

    // Overload:function()
    // Overload:function(selector)
    Enumerable.prototype.log = function (selector) {
        /// <summary>log object use console.log.</summary>
        /// <param name="selector" type="Func&lt;T,String>" optional="true">A transform function to apply to each source element.</param>
        /// <returns type="Enumerable"></returns>
        selector = Utils.createLambda(selector);

        return this.doAction(function (item) {
            if (typeof console !== Types.Undefined) {
                console.log(selector(item));
            }
        });
    };

    // Overload:function()
    // Overload:function(message)
    // Overload:function(message,selector)
    Enumerable.prototype.trace = function (message, selector) {
        /// <summary>Trace object use console.log.</summary>
        /// <param name="message" type="String" optional="true">Default is 'Trace'.</param>
        /// <param name="selector" type="Func&lt;T,String>" optional="true">A transform function to apply to each source element.</param>
        /// <returns type="Enumerable"></returns>
        if (message == null) message = "Trace";
        selector = Utils.createLambda(selector);

        return this.doAction(function (item) {
            if (typeof console !== Types.Undefined) {
                console.log(message, selector(item));
            }
        });
    };

    // private

    var OrderedEnumerable = function (source, keySelector, descending, parent) {
        this.source = source;
        this.keySelector = Utils.createLambda(keySelector);
        this.descending = descending;
        this.parent = parent;

        if (intellisense) this.firstOrDefault(); // for intellisense
    };
    OrderedEnumerable.prototype = new Enumerable();

    OrderedEnumerable.prototype.createOrderedEnumerable = function (keySelector, descending) {
        return new OrderedEnumerable(this.source, keySelector, descending, this);
    };
    OrderedEnumerable.prototype.thenBy = function (keySelector) {
        /// <signature>
        /// <summary>Performs a subsequent ordering of the elements in a sequence in ascending order according to a key.</summary>
        /// <param name="keySelector" type="Func&lt;T,TKey>">A function to extract a key from each element.</param>
        /// <returns type="OrderedEnumerable"></returns>
        /// </signature>
        /// <summary>Performs a subsequent ordering of the elements in a sequence in ascending order according to a key.</summary>
        /// <param name="keySelector" type="Func&lt;T,TKey>">A function to extract a key from each element.</param>
        return this.createOrderedEnumerable(keySelector, false);
    };
    OrderedEnumerable.prototype.thenByDescending = function (keySelector) {
        /// <signature>
        /// <summary>Performs a subsequent ordering of the elements in a sequence in descending order, according to a key.</summary>
        /// <param name="keySelector" type="Func&lt;T,TKey>">A function to extract a key from each element.</param>
        /// <returns type="OrderedEnumerable"></returns>
        /// </signature>
        /// <summary>Performs a subsequent ordering of the elements in a sequence in descending order, according to a key.</summary>
        /// <param name="keySelector" type="Func&lt;T,TKey>">A function to extract a key from each element.</param>
        return this.createOrderedEnumerable(keySelector, true);
    };
    OrderedEnumerable.prototype.getEnumerator = function () {
        /// <summary>Returns an enumerator that iterates through the collection.</summary>
        /// <returns type="IEnumerator"></returns>
        var self = this;
        var buffer;
        var indexes;
        var index = 0;

        return new IEnumerator(
            function () {
                buffer = [];
                indexes = [];
                self.source.forEach(function (item, index) {
                    buffer.push(item);
                    indexes.push(index);
                });
                var sortContext = SortContext.create(self, null);
                sortContext.GenerateKeys(buffer);

                indexes.sort(function (a, b) { return sortContext.compare(a, b); });
            },
            function () {
                return (index < indexes.length)
                    ? this.yieldReturn(buffer[indexes[index++]])
                    : false;
            },
            Functions.Blank
        );
    };

    var SortContext = function (keySelector, descending, child) {
        this.keySelector = keySelector;
        this.descending = descending;
        this.child = child;
        this.keys = null;
    };
    SortContext.create = function (orderedEnumerable, currentContext) {
        var context = new SortContext(orderedEnumerable.keySelector, orderedEnumerable.descending, currentContext);
        if (orderedEnumerable.parent != null) return SortContext.create(orderedEnumerable.parent, context);
        return context;
    };
    SortContext.prototype.GenerateKeys = function (source) {
        var len = source.length;
        var keySelector = this.keySelector;
        var keys = new Array(len);
        for (var i = 0; i < len; i++) keys[i] = keySelector(source[i]);
        this.keys = keys;

        if (this.child != null) this.child.GenerateKeys(source);
    };
    SortContext.prototype.compare = function (index1, index2) {
        var comparison = Utils.compare(this.keys[index1], this.keys[index2]);

        if (comparison == 0) {
            if (this.child != null) return this.child.compare(index1, index2);
            comparison = Utils.compare(index1, index2);
        }

        return (this.descending) ? -comparison : comparison;
    };

    var DisposableEnumerable = function (getEnumerator, dispose) {
        /// <field name="dispose" type="Function">Performs application-defined tasks associated with freeing, releasing, or resetting unmanaged resources.</field>
        this.dispose = dispose;
        Enumerable.call(this, getEnumerator);

        if (intellisense) this.firstOrDefault(); // for intellisense
    };
    DisposableEnumerable.prototype = new Enumerable();

    // optimize array or arraylike object

    var ArrayEnumerable = function (source) {
        this.getSource = function () { return source; };

        if (intellisense) this.firstOrDefault(); // for intellisense
    };
    ArrayEnumerable.prototype = new Enumerable();

    ArrayEnumerable.prototype.any = function (predicate) {
        return (predicate == null)
            ? (this.getSource().length > 0)
            : Enumerable.prototype.any.apply(this, arguments);
    };

    ArrayEnumerable.prototype.count = function (predicate) {
        return (predicate == null)
            ? this.getSource().length
            : Enumerable.prototype.count.apply(this, arguments);
    };

    ArrayEnumerable.prototype.elementAt = function (index) {
        var source = this.getSource();
        return (0 <= index && index < source.length)
            ? source[index]
            : Enumerable.prototype.elementAt.apply(this, arguments);
    };

    ArrayEnumerable.prototype.elementAtOrDefault = function (index, defaultValue) {
        if (defaultValue === undefined) defaultValue = null;
        var source = this.getSource();
        return (0 <= index && index < source.length)
            ? source[index]
            : defaultValue;
    };

    ArrayEnumerable.prototype.first = function (predicate) {
        var source = this.getSource();
        return (predicate == null && source.length > 0)
            ? source[0]
            : Enumerable.prototype.first.apply(this, arguments);
    };

    ArrayEnumerable.prototype.firstOrDefault = function (predicate, defaultValue) {
        if (defaultValue === undefined) defaultValue = null;
        if (predicate != null) {
            return Enumerable.prototype.firstOrDefault.apply(this, arguments);
        }

        var source = this.getSource();
        return source.length > 0 ? source[0] : defaultValue;
    };

    ArrayEnumerable.prototype.last = function (predicate) {
        var source = this.getSource();
        return (predicate == null && source.length > 0)
            ? source[source.length - 1]
            : Enumerable.prototype.last.apply(this, arguments);
    };

    ArrayEnumerable.prototype.lastOrDefault = function (predicate, defaultValue) {
        if (defaultValue === undefined) defaultValue = null;
        if (predicate != null) {
            return Enumerable.prototype.lastOrDefault.apply(this, arguments);
        }

        var source = this.getSource();
        return source.length > 0 ? source[source.length - 1] : defaultValue;
    };

    ArrayEnumerable.prototype.skip = function (count) {
        var source = this.getSource();

        return new Enumerable(function () {
            var index;

            return new IEnumerator(
                function () { index = (count < 0) ? 0 : count; },
                function () {
                    return (index < source.length)
                        ? this.yieldReturn(source[index++])
                        : false;
                },
                Functions.Blank);
        });
    };

    ArrayEnumerable.prototype.takeExceptLast = function (count) {
        if (count == null) count = 1;
        return this.take(this.getSource().length - count);
    };

    ArrayEnumerable.prototype.takeFromLast = function (count) {
        return this.skip(this.getSource().length - count);
    };

    ArrayEnumerable.prototype.reverse = function () {
        var source = this.getSource();

        return new Enumerable(function () {
            var index;

            return new IEnumerator(
                function () {
                    index = source.length;
                },
                function () {
                    return (index > 0)
                        ? this.yieldReturn(source[--index])
                        : false;
                },
                Functions.Blank);
        });
    };

    ArrayEnumerable.prototype.sequenceEqual = function (second, compareSelector) {
        if ((second instanceof ArrayEnumerable || second instanceof Array)
            && compareSelector == null
            && Enumerable.from(second).count() != this.count()) {
            return false;
        }

        return Enumerable.prototype.sequenceEqual.apply(this, arguments);
    };

    ArrayEnumerable.prototype.toJoinedString = function (separator, selector) {
        var source = this.getSource();
        if (selector != null || !(source instanceof Array)) {
            return Enumerable.prototype.toJoinedString.apply(this, arguments);
        }

        if (separator == null) separator = "";
        return source.join(separator);
    };

    ArrayEnumerable.prototype.getEnumerator = function () {
        var source = this.getSource();
        var index = -1;

        // fast and simple enumerator
        return {
            current: function () { return source[index]; },
            moveNext: function () {
                return ++index < source.length;
            },
            dispose: Functions.Blank
        };
    };

    // optimization for multiple where and multiple select and whereselect

    var WhereEnumerable = function (source, predicate) {
        this.prevSource = source;
        this.prevPredicate = predicate; // predicate.length always <= 1

        if (intellisense) this.firstOrDefault(); // for intellisense
    };
    WhereEnumerable.prototype = new Enumerable();

    WhereEnumerable.prototype.where = function (predicate) {
        predicate = Utils.createLambda(predicate);

        if (predicate.length <= 1) {
            var prevPredicate = this.prevPredicate;
            var composedPredicate = function (x) { return prevPredicate(x) && predicate(x); };
            return new WhereEnumerable(this.prevSource, composedPredicate);
        }
        else {
            // if predicate use index, can't compose
            return Enumerable.prototype.where.call(this, predicate);
        }
    };

    WhereEnumerable.prototype.select = function (selector) {
        selector = Utils.createLambda(selector);

        return (selector.length <= 1)
            ? new WhereSelectEnumerable(this.prevSource, this.prevPredicate, selector)
            : Enumerable.prototype.select.call(this, selector);
    };

    WhereEnumerable.prototype.getEnumerator = function () {
        var predicate = this.prevPredicate;
        var source = this.prevSource;
        var enumerator;

        return new IEnumerator(
            function () { enumerator = source.getEnumerator(); },
            function () {
                while (enumerator.moveNext()) {
                    if (predicate(enumerator.current())) {
                        return this.yieldReturn(enumerator.current());
                    }
                }
                return false;
            },
            function () { Utils.dispose(enumerator); });
    };

    var WhereSelectEnumerable = function (source, predicate, selector) {
        this.prevSource = source;
        this.prevPredicate = predicate; // predicate.length always <= 1 or null
        this.prevSelector = selector; // selector.length always <= 1

        if (intellisense) this.firstOrDefault(); // for intellisense
    };
    WhereSelectEnumerable.prototype = new Enumerable();

    WhereSelectEnumerable.prototype.where = function (predicate) {
        predicate = Utils.createLambda(predicate);

        return (predicate.length <= 1)
            ? new WhereEnumerable(this, predicate)
            : Enumerable.prototype.where.call(this, predicate);
    };

    WhereSelectEnumerable.prototype.select = function (selector) {
        selector = Utils.createLambda(selector);

        if (selector.length <= 1) {
            var prevSelector = this.prevSelector;
            var composedSelector = function (x) { return selector(prevSelector(x)); };
            return new WhereSelectEnumerable(this.prevSource, this.prevPredicate, composedSelector);
        }
        else {
            // if selector use index, can't compose
            return Enumerable.prototype.select.call(this, selector);
        }
    };

    WhereSelectEnumerable.prototype.getEnumerator = function () {
        var predicate = this.prevPredicate;
        var selector = this.prevSelector;
        var source = this.prevSource;
        var enumerator;

        return new IEnumerator(
            function () { enumerator = source.getEnumerator(); },
            function () {
                while (enumerator.moveNext()) {
                    if (predicate == null || predicate(enumerator.current())) {
                        return this.yieldReturn(selector(enumerator.current()));
                    }
                }
                return false;
            },
            function () { Utils.dispose(enumerator); });
    };

    // Collections

    var Dictionary = (function () {
        // static utility methods
        var callHasOwnProperty = function (target, key) {
            return Object.prototype.hasOwnProperty.call(target, key);
        };

        var computeHashCode = function (obj) {
            if (obj === null) return "null";
            if (obj === undefined) return "undefined";

            return (typeof obj.toString === Types.Function)
                ? obj.toString()
                : Object.prototype.toString.call(obj);
        };

        // LinkedList for Dictionary
        var HashEntry = function (key, value) {
            this.key = key;
            this.value = value;
            this.prev = null;
            this.next = null;
        };

        var EntryList = function () {
            this.first = null;
            this.last = null;
        };
        EntryList.prototype =
        {
            addLast: function (entry) {
                if (this.last != null) {
                    this.last.next = entry;
                    entry.prev = this.last;
                    this.last = entry;
                } else this.first = this.last = entry;
            },

            replace: function (entry, newEntry) {
                if (entry.prev != null) {
                    entry.prev.next = newEntry;
                    newEntry.prev = entry.prev;
                } else this.first = newEntry;

                if (entry.next != null) {
                    entry.next.prev = newEntry;
                    newEntry.next = entry.next;
                } else this.last = newEntry;

            },

            remove: function (entry) {
                if (entry.prev != null) entry.prev.next = entry.next;
                else this.first = entry.next;

                if (entry.next != null) entry.next.prev = entry.prev;
                else this.last = entry.prev;
            }
        };

        // Overload:function()
        // Overload:function(compareSelector)
        var Dictionary = function (compareSelector) {
            this.countField = 0;
            this.entryList = new EntryList();
            this.buckets = {}; // as Dictionary<string,List<object>>
            this.compareSelector = (compareSelector == null) ? Functions.Identity : compareSelector;
        };
        Dictionary.prototype =
        {
            add: function (key, value) {
                /// <summary>add new pair. if duplicate key then overwrite new value.</summary>
                /// <returns type="Void"></returns>
                var compareKey = this.compareSelector(key);
                var hash = computeHashCode(compareKey);
                var entry = new HashEntry(key, value);
                if (callHasOwnProperty(this.buckets, hash)) {
                    var array = this.buckets[hash];
                    for (var i = 0; i < array.length; i++) {
                        if (this.compareSelector(array[i].key) === compareKey) {
                            this.entryList.replace(array[i], entry);
                            array[i] = entry;
                            return;
                        }
                    }
                    array.push(entry);
                } else {
                    this.buckets[hash] = [entry];
                }
                this.countField++;
                this.entryList.addLast(entry);
            },

            get: function (key) {
                /// <summary>get value. if not find key then return undefined.</summary>
                /// <returns type="T"></returns>
                var compareKey = this.compareSelector(key);
                var hash = computeHashCode(compareKey);
                if (!callHasOwnProperty(this.buckets, hash)) return undefined;

                var array = this.buckets[hash];
                for (var i = 0; i < array.length; i++) {
                    var entry = array[i];
                    if (this.compareSelector(entry.key) === compareKey) return entry.value;
                }
                return undefined;
            },

            set: function (key, value) {
                /// <summary>set value. if complete set value then return true, not find key then return false.</summary>
                /// <returns type="Boolean"></returns>
                var compareKey = this.compareSelector(key);
                var hash = computeHashCode(compareKey);
                if (callHasOwnProperty(this.buckets, hash)) {
                    var array = this.buckets[hash];
                    for (var i = 0; i < array.length; i++) {
                        if (this.compareSelector(array[i].key) === compareKey) {
                            var newEntry = new HashEntry(key, value);
                            this.entryList.replace(array[i], newEntry);
                            array[i] = newEntry;
                            return true;
                        }
                    }
                }
                return false;
            },

            contains: function (key) {
                /// <summary>check contains key.</summary>
                /// <returns type="Boolean"></returns>
                var compareKey = this.compareSelector(key);
                var hash = computeHashCode(compareKey);
                if (!callHasOwnProperty(this.buckets, hash)) return false;

                var array = this.buckets[hash];
                for (var i = 0; i < array.length; i++) {
                    if (this.compareSelector(array[i].key) === compareKey) return true;
                }
                return false;
            },

            clear: function () {
                /// <summary>clear dictionary.</summary>
                /// <returns type="Void"></returns>
                this.countField = 0;
                this.buckets = {};
                this.entryList = new EntryList();
            },

            remove: function (key) {
                /// <summary>remove key and value.</summary>
                /// <returns type="Void"></returns>
                var compareKey = this.compareSelector(key);
                var hash = computeHashCode(compareKey);
                if (!callHasOwnProperty(this.buckets, hash)) return;

                var array = this.buckets[hash];
                for (var i = 0; i < array.length; i++) {
                    if (this.compareSelector(array[i].key) === compareKey) {
                        this.entryList.remove(array[i]);
                        array.splice(i, 1);
                        if (array.length == 0) delete this.buckets[hash];
                        this.countField--;
                        return;
                    }
                }
            },

            count: function () {
                /// <summary>contains value's count.</summary>
                /// <returns type="Number"></returns>
                return this.countField;
            },

            toEnumerable: function () {
                /// <summary>Convert to Enumerable&lt;{key:, value:}&gt;.</summary>
                /// <returns type="Enumerable"></returns>
                var self = this;
                return new Enumerable(function () {
                    var currentEntry;

                    return new IEnumerator(
                        function () { currentEntry = self.entryList.first; },
                        function () {
                            if (currentEntry != null) {
                                var result = { key: currentEntry.key, value: currentEntry.value };
                                currentEntry = currentEntry.next;
                                return this.yieldReturn(result);
                            }
                            return false;
                        },
                        Functions.Blank);
                });
            }
        };

        return Dictionary;
    })();

    // dictionary = Dictionary<TKey, TValue[]>
    var Lookup = function (dictionary) {
        this.count = function () {
            /// <summary>contains value's count.</summary>
            /// <returns type="Number"></returns>
            return dictionary.count();
        };
        this.get = function (key) {
            /// <summary>get grouped enumerable.</summary>
            /// <returns type="Enumerable"></returns>
            return Enumerable.from(dictionary.get(key));
        };
        this.contains = function (key) {
            /// <summary>check contains key.</summary>
            /// <returns type="Boolean"></returns>
            return dictionary.contains(key);
        };
        this.toEnumerable = function () {
            /// <summary>Convert to Enumerable&lt;Grouping&gt;.</summary>
            /// <returns type="Enumerable"></returns>
            return dictionary.toEnumerable().select(function (kvp) {
                return new Grouping(kvp.key, kvp.value);
            });
        };
    };

    var Grouping = function (groupKey, elements) {
        this.key = function () {
            /// <summary>get grouping key.</summary>
            /// <returns type="T"></returns>
            return groupKey;
        };
        ArrayEnumerable.call(this, elements);
    };
    Grouping.prototype = new ArrayEnumerable();

    // module export
    if (typeof define === Types.Function && define.amd) { // AMD
        define("linqjs", [], function () { return Enumerable; });
    }
    else if (typeof module !== Types.Undefined && module.exports) { // Node
        module.exports = Enumerable;
    }
    else {
        root.Enumerable = Enumerable;
    }

    // vsdoc helper for VS2012
    var redirectDefinition;
    if(intellisense){
        redirectDefinition = function (from, redirectTo) {
            for (var methodName in from) {
                if (redirectTo[methodName] !== undefined) {
                    intellisense.redirectDefinition(from[methodName], redirectTo[methodName]);
                }
            }
        };
    }
    else{
        redirectDefinition = Functions.Identity;
    }
        
    redirectDefinition(ArrayEnumerable.prototype, Enumerable.prototype);
    redirectDefinition(WhereEnumerable.prototype, Enumerable.prototype);
    redirectDefinition(WhereSelectEnumerable.prototype, Enumerable.prototype);

})(this);