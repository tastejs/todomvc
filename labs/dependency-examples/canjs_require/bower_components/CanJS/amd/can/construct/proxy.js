/*!
* CanJS - 1.1.5 (2013-03-27)
* http://canjs.us/
* Copyright (c) 2013 Bitovi
* Licensed MIT
*/
define(['can/util/library', 'can/construct'], function (can, Construct) {
    var isFunction = can.isFunction,
        isArray = can.isArray,
        makeArray = can.makeArray,

        proxy = function (funcs) {

            //args that should be curried
            var args = makeArray(arguments),
                self;

            // get the functions to callback
            funcs = args.shift();

            // if there is only one function, make funcs into an array
            if (!isArray(funcs)) {
                funcs = [funcs];
            }

            // keep a reference to us in self
            self = this;


            return function class_cb() {
                // add the arguments after the curried args
                var cur = args.concat(makeArray(arguments)),
                    isString, length = funcs.length,
                    f = 0,
                    func;

                // go through each function to call back
                for (; f < length; f++) {
                    func = funcs[f];
                    if (!func) {
                        continue;
                    }

                    // set called with the name of the function on self (this is how this.view works)
                    isString = typeof func == "string";

                    // call the function
                    cur = (isString ? self[func] : func).apply(self, cur || []);

                    // pass the result to the next function (if there is a next function)
                    if (f < length - 1) {
                        cur = !isArray(cur) || cur._use_call ? [cur] : cur
                    }
                }
                return cur;
            }
        }
        can.Construct.proxy = can.Construct.prototype.proxy = proxy;
    // this corrects the case where can/control loads after can/construct/proxy, so static props don't have proxy
    var correctedClasses = [can.Observe, can.Control, can.Model],
        i = 0;
    for (; i < correctedClasses.length; i++) {
        if (correctedClasses[i]) {
            correctedClasses[i].proxy = proxy;
        }
    }
    return can;
});