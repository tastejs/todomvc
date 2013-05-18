/*!
* CanJS - 1.1.5 (2013-03-27)
* http://canjs.us/
* Copyright (c) 2013 Bitovi
* Licensed MIT
*/
define(['can/util/can'], function (can) {

    // deferred.js
    // ---------
    // _Lightweight, jQuery style deferreds._
    // extend is usually provided by the wrapper but to avoid steal.then calls
    // we define a simple extend here as well
    var extend = function (target, src) {
        for (var key in src) {
            if (src.hasOwnProperty(key)) {
                target[key] = src[key];
            }
        }
    },
        Deferred = function (func) {
            if (!(this instanceof Deferred)) return new Deferred();

            this._doneFuncs = [];
            this._failFuncs = [];
            this._resultArgs = null;
            this._status = "";

            // Check for option `function` -- call it with this as context and as first
            // parameter, as specified in jQuery API.
            func && func.call(this, this);
        };

    can.Deferred = Deferred;
    can.when = Deferred.when = function () {
        var args = can.makeArray(arguments);
        if (args.length < 2) {
            var obj = args[0];
            if (obj && (can.isFunction(obj.isResolved) && can.isFunction(obj.isRejected))) {
                return obj;
            } else {
                return Deferred().resolve(obj);
            }
        } else {

            var df = Deferred(),
                done = 0,
                // Resolve params -- params of each resolve, we need to track them down 
                // to be able to pass them in the correct order if the master 
                // needs to be resolved.
                rp = [];

            can.each(args, function (arg, j) {
                arg.done(function () {
                    rp[j] = (arguments.length < 2) ? arguments[0] : arguments;
                    if (++done == args.length) {
                        df.resolve.apply(df, rp);
                    }
                }).fail(function () {
                    df.reject((arguments.length === 1) ? arguments[0] : arguments);
                });
            });

            return df;

        }
    }

    var resolveFunc = function (type, _status) {
        return function (context) {
            var args = this._resultArgs = (arguments.length > 1) ? arguments[1] : [];
            return this.exec(context, this[type], args, _status);
        }
    },
        doneFunc = function (type, _status) {
            return function () {
                var self = this;
                // In Safari, the properties of the `arguments` object are not enumerable, 
                // so we have to convert arguments to an `Array` that allows `can.each` to loop over them.
                can.each(Array.prototype.slice.call(arguments), function (v, i, args) {
                    if (!v) return;
                    if (v.constructor === Array) {
                        args.callee.apply(self, v)
                    } else {
                        // Immediately call the `function` if the deferred has been resolved.
                        if (self._status === _status) v.apply(self, self._resultArgs || []);

                        self[type].push(v);
                    }
                });
                return this;
            }
        };

    extend(Deferred.prototype, {
        pipe: function (done, fail) {
            var d = can.Deferred();
            this.done(function () {
                d.resolve(done.apply(this, arguments));
            });

            this.fail(function () {
                if (fail) {
                    d.reject(fail.apply(this, arguments));
                } else {
                    d.reject.apply(d, arguments);
                }
            });
            return d;
        },
        resolveWith: resolveFunc("_doneFuncs", "rs"),
        rejectWith: resolveFunc("_failFuncs", "rj"),
        done: doneFunc("_doneFuncs", "rs"),
        fail: doneFunc("_failFuncs", "rj"),
        always: function () {
            var args = can.makeArray(arguments);
            if (args.length && args[0]) this.done(args[0]).fail(args[0]);

            return this;
        },

        then: function () {
            var args = can.makeArray(arguments);
            // Fail `function`(s)
            if (args.length > 1 && args[1]) this.fail(args[1]);

            // Done `function`(s)
            if (args.length && args[0]) this.done(args[0]);

            return this;
        },

        state: function () {
            switch (this._status) {
            case 'rs':
                return 'resolved';
            case 'rj':
                return 'rejected';
            default:
                return 'pending';
            }
        },

        isResolved: function () {
            return this._status === "rs";
        },

        isRejected: function () {
            return this._status === "rj";
        },

        reject: function () {
            return this.rejectWith(this, arguments);
        },

        resolve: function () {
            return this.resolveWith(this, arguments);
        },

        exec: function (context, dst, args, st) {
            if (this._status !== "") return this;

            this._status = st;

            can.each(dst, function (d) {
                d.apply(context, args);
            });

            return this;
        }
    });

    return can;
});