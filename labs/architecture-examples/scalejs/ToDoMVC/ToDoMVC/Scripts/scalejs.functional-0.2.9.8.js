
/*global define,console,document*/
/*jslint nomen: true*/
/**
 * Based on Oliver Steele "Functional Javascript" (http://osteele.com/sources/javascript/functional/)
 **/
define('scalejs.functional/functional',[],function () {
    

    var _ = {},
        curry;

    function compose() {
        /// <summary>
        /// Returns a function that applies the last argument of this
        /// function to its input, and the penultimate argument to the
        /// result of the application, and so on.
        /// == compose(f1, f2, f3..., fn)(args) == f1(f2(f3(...(fn(args...)))))
        /// :: (a2 -> a1) (a3 -> a2)... (a... -> a_{n}) -> a... -> a1
        /// >> compose('1+', '2*')(2) -> 5
        /// </summary>
        var fns = Array.prototype.slice.call(arguments, 0).reverse();

        return function () {
            var args = fns.reduce(function (args, fn) {
                return [fn.apply(undefined, args)];
            }, Array.prototype.slice.call(arguments));

            return args[0];
        };
    }

    function sequence() {
        /// <summary>
        /// Same as `compose`, except applies the functions in argument-list order.
        /// == sequence(f1, f2, f3..., fn)(args...) == fn(...(f3(f2(f1(args...)))))
        /// :: (a... -> a1) (a1 -> a2) (a2 -> a3)... (a_{n-1} -> a_{n})  -> a... -> a_{n}
        /// >> sequence('1+', '2*')(2) -> 6
        /// </summary>
        var fns = Array.prototype.slice.call(arguments, 0);

        return function () {
            var args = fns.reduce(function (args, fn) {
                return [fn.apply(undefined, args)];
            }, Array.prototype.slice.call(arguments, 0));

            return args[0];
        };
    }

    function bind(object, fn) {
        /// <summary>
        /// Returns a bound method on `object`, optionally currying `args`.
        /// == f.bind(obj, args...)(args2...) == f.apply(obj, [args..., args2...])
        /// </summary>
        /// <param name="object"></param>
        var args = Array.prototype.slice.call(arguments, 2);
        return function () {
            return fn.apply(object, args.concat(Array.prototype.slice.call(arguments, 0)));
        };
    }

    function aritize(fn, n) {
        /// <summary>
        /// Invoking the function returned by this function only passes `n`
        /// arguments to the underlying function.  If the underlying function
        /// is not saturated, the result is a function that passes all its
        /// arguments to the underlying function.  (That is, `aritize` only
        /// affects its immediate caller, and not subsequent calls.)
        /// >> '[a,b]'.lambda()(1,2) -> [1, 2]
        /// >> '[a,b]'.lambda().aritize(1)(1,2) -> [1, undefined]
        /// >> '+'.lambda()(1,2)(3) -> error
        /// >> '+'.lambda().ncurry(2).aritize(1)(1,2)(3) -> 4
        ///
        /// `aritize` is useful to remove optional arguments from a function that
        /// is passed to a higher-order function that supplies *different* optional
        /// arguments.
        ///
        /// For example, many implementations of `map` and other collection
        /// functions, call the function argument with both the collection element
        /// and its position.  This is convenient when expected, but can wreak
        /// havoc when the function argument is a curried function that expects
        /// a single argument from `map` and the remaining arguments from when
        /// the result of `map` is applied.
        /// </summary>
        /// <param name="fn"></param>
        /// <param name="n"></param>
        return function () {
            return fn.apply(undefined, Array.prototype.slice.call(arguments, 0, n));
        };
    }

    // partial itself is partial, e.g. partial(_, a, _)(f) = partial(f, a, _)
    function partial() {
        var args = Array.prototype.slice.call(arguments, 0),
            subpos = args.reduce(function (blanks, arg, i) {
                return arg === _ ? blanks.concat([i]) : blanks;
            }, []);

        if (subpos.length === 0) {
            return args[0].apply(undefined, args.slice(1));
        }

        return function () {
            var //specialized = args.concat(Array.prototype.slice.call(arguments, subpos.length)),
                i;

            for (i = 0; i < Math.min(subpos.length, arguments.length); i += 1) {
                args[subpos[i]] = arguments[i];
            }

            return partial.apply(undefined, args);
        };
    }

    curry = function (fn, n) {
        if (arguments.length === 1) {
            return curry(fn, fn.length);
        }

        var largs = Array.prototype.slice.call(arguments, 2);

        if (largs.length >= n) {
            return fn.apply(this, largs);
        }

        return function () {
            var args = largs.concat(Array.prototype.slice.call(arguments, 0));
            args.unshift(fn, n);
            return curry.apply(this, args);
        };
    };


    return {
        _: _,
        compose: compose,
        sequence: sequence,
        bind: bind,
        aritize: aritize,
        curry: curry,
        partial: partial
    };
});

/*global define,console,document*/
/*jslint nomen: true*/
/**
 * Based on F# computation expressions http://msdn.microsoft.com/en-us/library/dd233182.aspx
 **/
define('scalejs.functional/builder',[],function () {
    

    function builder(opts) {
        var build,
            self,
            callExpr,
            combine;

        callExpr = function (expr) {
            if (!expr || expr.kind !== '$') {
                return expr;
            }

            if (typeof expr.expr === 'function') {
                return expr.expr.call(this);
            }

            if (typeof expr.expr === 'string') {
                return this[expr.expr];
            }

            throw new Error('Parameter in $(...) must be either a function or a string referencing a binding.');
        };

        combine = function (method, expr, cexpr) {
            function isReturnLikeMethod(method) {
                return method === '$return' ||
                        method === '$RETURN' ||
                        method === '$yield' ||
                        method === '$YIELD';
            }

            if (typeof self[method] !== 'function' &&
                    method !== '$then' &&
                    method !== '$else') {
                throw new Error('This control construct may only be used if the computation expression builder ' +
                                'defines a `' + method + '` method.');
            }

            var e = callExpr(expr),
                //contextCopy,
                cexprCopy;

            if (cexpr.length > 0 && typeof self.combine !== 'function') {
                throw new Error('This control construct may only be used if the computation expression builder ' +
                                'defines a `combine` method.');
            }

            // if it's return then simply return
            if (isReturnLikeMethod(method)) {
                if (cexpr.length === 0) {
                    return self[method](e);
                }

                if (typeof self.delay !== 'function') {
                    throw new Error('This control construct may only be used if the computation expression builder ' +
                                    'defines a `delay` method.');
                }

                // combine with delay
                return self.combine(self[method](e), self.delay(function () {
                    return build(cexpr);
                }));
            }

            // if it's not a return then simply combine the operations (e.g. no `delay` needed)
            if (method === '$for') {
                return self.combine(self.$for(expr.items, function (item) {
                    var cexpr = Array.prototype.slice.call(expr.cexpr);
                    //ctx = merge(context);
                    this[expr.name] = item;
                    return build(cexpr);
                }), build(cexpr));
            }

            if (method === '$while') {
                if (typeof self.delay !== 'function') {
                    throw new Error('This control construct may only be used if the computation expression builder ' +
                                    'defines a `delay` method.');
                }

                e = self.$while(expr.condition.bind(this), self.delay(function () {
                    var //contextCopy = clone(context),
                        cexprCopy = Array.prototype.slice.call(expr.cexpr);
                    return build(cexprCopy);
                }));

                if (cexpr.length > 0) {
                    return self.combine(e, build(cexpr));
                }

                return e;
            }

            if (method === '$then' || method === '$else') {
                //contextCopy = clone(context);
                cexprCopy = Array.prototype.slice.call(expr.cexpr);
                return self.combine(build(cexprCopy), cexpr);
            }

            return self.combine(self[method](e), build(cexpr));
        };

        if (!opts.missing) {
            opts.missing = function (expr) {
                if (expr.kind) {
                    throw new Error('Unknown operation "' + expr.kind + '". ' +
                                    'Either define `missing` method on the builder or fix the spelling of the operation.');
                }

                throw new Error('Expression ' + JSON.stringify(expr) + ' cannot be processed. ' +
                                'Either define `missing` method on the builder or convert expression to a function.');
            };
        }

        build = function (cexpr) {
            var expr;

            cexpr = Array.prototype.slice.call(cexpr);

            if (cexpr.length === 0) {
                if (self.zero) {
                    return self.zero();
                }

                throw new Error('Computation expression builder must define `zero` method.');
            }

            expr = cexpr.shift();

            if (expr.kind === 'let') {
                this[expr.name] = callExpr(expr.expr);
                return build.call(this, cexpr);
            }

            if (expr.kind === 'do') {
                expr.expr.call(this);
                return build.call(this, cexpr);
            }

            if (expr.kind === 'letBind') {
                return self.bind(expr.expr.bind(this), function (bound) {
                    this[expr.name] = bound;
                    return build.call(this, cexpr);
                }.bind(this));
            }

            if (expr.kind === 'doBind' || expr.kind === '$') {
                if (cexpr.length > 0) {
                    return self.bind(expr.expr.bind(this), function () {
                        return build.call(this, cexpr);
                    }.bind(this));
                }

                if (typeof self.$return !== 'function') {
                    throw new Error('This control construct may only be used if the computation expression builder ' +
                                    'defines a `$return` method.');
                }

                return self.bind(expr.expr.bind(this), function (x) {
                    return self.$return(x);
                });
            }

            if (expr.kind === '$return' ||
                    expr.kind === '$RETURN' ||
                    expr.kind === '$yield' ||
                    expr.kind === '$YIELD') {
                return combine(expr.kind, expr.expr, cexpr);
            }

            if (expr.kind === '$for' ||
                    expr.kind === '$while') {
                return combine(expr.kind, expr, cexpr);
            }

            if (expr.kind === '$if') {
                if (expr.condition.call(this)) {
                    return combine('$then', expr.thenExpr, cexpr);
                }

                if (expr.elseExpr) {
                    return combine('$else', expr.elseExpr, cexpr);
                }

                return combine(build([]), cexpr);
            }

            if (typeof expr === 'function' && self.call) {
                self.call(this);
                return build.call(this, cexpr);
            }

            if (typeof expr === 'function') {
                expr.call(this);
                return build.call(this, cexpr);
            }

            return combine('missing', expr, cexpr);
        };

        return function () {
            var args = Array.prototype.slice.call(arguments),
                expression = function () {
                    var operations = Array.prototype.slice.call(arguments, 0),
                        result,
                        delayed,
                        //run,
                        built;


                    // Copy all opts to `self`. Nothing special (e.g. recursion, etc.) is required since opts
                    // must be a flat object with builder methods
                    self = {};
                    Object.keys(opts).forEach(function (key) {
                        self[key] = opts[key];
                    });

                    if (this.mixins) {
                        this.mixins.forEach(function (mixin) {
                            if (mixin.beforeBuild) {
                                mixin.beforeBuild(operations);
                            }
                        });
                    }

                    built = function () {
                        // pass the execution context of the caller
                        return build.call(this, operations);
                    };

                    if (!self.run && !self.delay) {
                        result = built();
                    } else {
                        if (self.delay) {
                            delayed = built;
                            built = function () {
                                return self.delay(delayed);
                            };
                        }

                        result = built();

                        if (self.run) {
                            result = self.run.apply(self, [result].concat(args));
                        }
                    }

                    if (this.mixins) {
                        this.mixins.forEach(function (mixin) {
                            if (mixin.afterBuild) {
                                result = mixin.afterBuild(result);
                            }
                        });
                    }

                    return result;
                };

            function mixin() {
                var context = { mixins: Array.prototype.slice.call(arguments, 0) },
                    bound = expression.bind(context);
                bound.mixin = function () {
                    Array.prototype.push.apply(context.mixins, arguments);
                    return bound;
                };

                return bound;
            }

            expression.mixin = mixin;

            return expression;
        };
    }

    builder.$let = function (name, expr) {
        return {
            kind: 'let',
            name: name,
            expr: expr
        };
    };

    builder.$LET = function (name, expr) {
        return {
            kind: 'letBind',
            name: name,
            expr: expr
        };
    };

    builder.$do = function (expr) {
        return {
            kind: 'do',
            expr: expr
        };
    };

    builder.$DO = function (expr) {
        return {
            kind: 'doBind',
            expr: expr
        };
    };

    builder.$return = function (expr) {
        return {
            kind: '$return',
            expr: expr
        };
    };

    builder.$RETURN = function (expr) {
        return {
            kind: '$RETURN',
            expr: expr
        };
    };

    builder.$yield = function (expr) {
        return {
            kind: '$yield',
            expr: expr
        };
    };

    builder.$YIELD = function (expr) {
        return {
            kind: '$YIELD',
            expr: expr
        };
    };

    builder.$for = function (name, items) {
        var cexpr = Array.prototype.slice.call(arguments, 2);

        return {
            kind: '$for',
            name: name,
            items: items,
            cexpr: cexpr
        };
    };

    builder.$while = function (condition) {
        if (arguments.length < 2) {
            throw new Error('Incomplete `while`. Expected "$while(<condition>, <expr>)".');
        }

        var cexpr = Array.prototype.slice.call(arguments, 1);

        return {
            kind: '$while',
            condition: condition,
            cexpr: cexpr
        };
    };

    builder.$if = function (condition, thenExpr, elseExpr) {
        if (arguments.length < 2) {
            throw new Error('Incomplete conditional. Expected "$if(<expr>, $then(expr))" or ' +
                            '"$if(<expr>, $then(<expr>), $else(<expr>)"');
        }

        if (typeof condition !== 'function') {
            throw new Error('First argument must be a function that defines the condition of $if.');
        }

        if (thenExpr.kind !== '$then') {
            throw new Error('Unexpected "' + thenExpr.kind + '" in the place of "$then"');
        }

        if (elseExpr) {
            if (elseExpr.kind !== '$else') {
                throw new Error('Unexpected "' + elseExpr.kind + '" in the place of "$else"');
            }
        }

        return {
            kind: '$if',
            condition: condition,
            thenExpr: thenExpr,
            elseExpr: elseExpr
        };
    };

    builder.$then = function () {
        var cexpr = Array.prototype.slice.call(arguments, 0);

        if (cexpr.length === 0) {
            throw new Error('$then should contain at least one expression.');
        }

        return {
            kind: '$then',
            cexpr: cexpr
        };
    };

    builder.$else = function () {
        var cexpr = Array.prototype.slice.call(arguments, 0);

        if (cexpr.length === 0) {
            throw new Error('$else should contain at least one expression.');
        }

        return {
            kind: '$else',
            cexpr: cexpr
        };
    };

    builder.$ = function (expr) {
        return {
            kind: '$',
            expr: expr
        };
    };

    return builder;
});

/*global define,console,document*/
/*jslint nomen: true*/
define('scalejs.functional/completeBuilder',[
    './builder'
], function (
    builder
) {
    

    var completeBuilder,
        complete;

    completeBuilder = builder({
        bind: function (f, g) {
            // `f` is a function that would invoke a callback once they are completed.
            // E.g.:
            // f: function (completed) { 
            //        ...
            //        completed(result); 
            //    }
            // 
            // `g` is a function that needs to be bound to result of `f` and its result should have the same signature as `f`
            // 
            // To bind them we should return a function `h` with same signature such as `f`
            return function (completed) {
                f(function (fResult) {
                    var rest = g(fResult);
                    return rest(completed);
                });
            };
        },

        $return: function (x) {
            return function (completed) {
                if (completed) {
                    if (typeof x === 'function') {
                        x = x();
                    }
                    completed(x);
                }
            };
        },

        delay: function (f) {
            return f;
        },

        run: function (f) {
            return function (completed) {
                var delayed = f.call(this);
                delayed.call(this, completed);
            };
        }
    });

    complete = completeBuilder().mixin({
        beforeBuild: function (ops) {
            //console.log('--->INTERCEPTED!', ops);
            ops.forEach(function (op, i) {
                if (typeof op === 'function') {
                    ops[i] = builder.$DO(op);
                }
            });
        }
    });

    return complete;
});

/*global define*/
define('scalejs.functional',[
    'scalejs!core',
    './scalejs.functional/functional',
    './scalejs.functional/builder',
    './scalejs.functional/completeBuilder'
], function (
    core,
    functional,
    builder,
    complete
) {
    

    var merge = core.object.merge;

    core.registerExtension({
        functional: merge(functional, {
            builder: builder,
            builders: {
                complete: complete
            }
        })
    });
});

