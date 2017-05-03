var inherit;

(function (global, exports) {

    /**
     *
     * @param {Object} classDefinition The definition for the prototype methods
     * @param {Function} [baseClass] The prototype to inherit from
     *
     * @return {Function} returns a constructor function describing the class
     */
    inherit = function (classDefinition, baseClass) {
        baseClass = baseClass || Object;

        var newClass = function () {
            if (this.ctor) {
                return this.ctor.apply(this, arguments);
            }
        };
        
        if (baseClass.constructor == Function) {

            function Inheritance() {
            }

            Inheritance.prototype = baseClass.prototype;

            newClass.prototype = new Inheritance();
            newClass.prototype.constructor = classDefinition;
            newClass.prototype.base = baseClass.prototype;

        } else {
            newClass.prototype = baseClass;
            newClass.prototype.constructor = classDefinition;
            newClass.prototype.base = baseClass;
        }

        for (var publicMethod in classDefinition) {
            if (classDefinition.hasOwnProperty(publicMethod)) {
                var baseFunction = newClass.prototype[publicMethod];
                newClass.prototype[publicMethod] = classDefinition[publicMethod];

                if (baseFunction instanceof Function) {
                    newClass.prototype[publicMethod].baseImplementation = baseFunction;
                }
            }
        }

        newClass.prototype.callBase = inherit.callBase;

        return newClass;

    };

    inherit.callBase = function () {
        // get arguments
        var args = Array.prototype.slice.call(arguments);

        if (args.length == 0) {
            // use arguments from call
            args = Array.prototype.slice.call(arguments.callee.caller.arguments);
        }

        return arguments.callee.caller.baseImplementation.apply(this, args);
    };

    /**
     *
     * @param classDefinition The definition for the prototype methods
     *
     * @return {Function} returns a constructor function describing the class
     */
    Function.prototype.inherit = function (classDefinition) {
        return inherit(classDefinition, this);
    };

    Function.prototype.callBase = function () {
        var args = Array.prototype.slice.call(arguments);
        var that = args.shift();

        if (that && that.base) {
            var caller = arguments.callee.caller;

            if (this == caller) {
                return this.baseImplementation.apply(that, args);
            } else {
                return this.apply(that, args);
            }
        } else {
            throw "base not definied";
        }
    };

    /**
     * @property {Function} base class
     */
    inherit.Base = inherit({
        ctor: function () {
        }
    });

    exports.inherit = inherit;

})(this, typeof exports === "undefined" ? this : exports);

