/*!
* CanJS - 1.1.5 (2013-03-27)
* http://canjs.us/
* Copyright (c) 2013 Bitovi
* Licensed MIT
*/
define(['can/util/string'], function (can) {

    // ## construct.js
    // `can.Construct`  
    // _This is a modified version of
    // [John Resig's class](http://ejohn.org/blog/simple-javascript-inheritance/).  
    // It provides class level inheritance and callbacks._
    // A private flag used to initialize a new class instance without
    // initializing it's bindings.
    var initializing = 0;


    can.Construct = function () {
        if (arguments.length) {
            return can.Construct.extend.apply(can.Construct, arguments);
        }
    };


    can.extend(can.Construct, {

        newInstance: function () {
            // Get a raw instance object (`init` is not called).
            var inst = this.instance(),
                arg = arguments,
                args;

            // Call `setup` if there is a `setup`
            if (inst.setup) {
                args = inst.setup.apply(inst, arguments);
            }

            // Call `init` if there is an `init`  
            // If `setup` returned `args`, use those as the arguments
            if (inst.init) {
                inst.init.apply(inst, args || arguments);
            }

            return inst;
        },
        // Overwrites an object with methods. Used in the `super` plugin.
        // `newProps` - New properties to add.  
        // `oldProps` - Where the old properties might be (used with `super`).  
        // `addTo` - What we are adding to.
        _inherit: function (newProps, oldProps, addTo) {
            can.extend(addTo || newProps, newProps || {})
        },
        // used for overwriting a single property.
        // this should be used for patching other objects
        // the super plugin overwrites this
        _overwrite: function (what, oldProps, propName, val) {
            what[propName] = val;
        },
        // Set `defaults` as the merger of the parent `defaults` and this 
        // object's `defaults`. If you overwrite this method, make sure to
        // include option merging logic.
        setup: function (base, fullName) {
            this.defaults = can.extend(true, {}, base.defaults, this.defaults);
        },
        // Create's a new `class` instance without initializing by setting the
        // `initializing` flag.
        instance: function () {

            // Prevents running `init`.
            initializing = 1;

            var inst = new this();

            // Allow running `init`.
            initializing = 0;

            return inst;
        },
        // Extends classes.
        extend: function (fullName, klass, proto) {
            // Figure out what was passed and normalize it.
            if (typeof fullName != 'string') {
                proto = klass;
                klass = fullName;
                fullName = null;
            }

            if (!proto) {
                proto = klass;
                klass = null;
            }
            proto = proto || {};

            var _super_class = this,
                _super = this.prototype,
                name, shortName, namespace, prototype;

            // Instantiate a base class (but only create the instance,
            // don't run the init constructor).
            prototype = this.instance();

            // Copy the properties over onto the new prototype.
            can.Construct._inherit(proto, _super, prototype);

            // The dummy class constructor.


            function Constructor() {
                // All construction is actually done in the init method.
                if (!initializing) {
                    return this.constructor !== Constructor && arguments.length ?
                    // We are being called without `new` or we are extending.
                    arguments.callee.extend.apply(arguments.callee, arguments) :
                    // We are being called with `new`.
                    this.constructor.newInstance.apply(this.constructor, arguments);
                }
            }

            // Copy old stuff onto class (can probably be merged w/ inherit)
            for (name in _super_class) {
                if (_super_class.hasOwnProperty(name)) {
                    Constructor[name] = _super_class[name];
                }
            }

            // Copy new static properties on class.
            can.Construct._inherit(klass, _super_class, Constructor);

            // Setup namespaces.
            if (fullName) {

                var parts = fullName.split('.'),
                    shortName = parts.pop(),
                    current = can.getObject(parts.join('.'), window, true),
                    namespace = current,
                    _fullName = can.underscore(fullName.replace(/\./g, "_")),
                    _shortName = can.underscore(shortName);



                current[shortName] = Constructor;
            }

            // Set things that shouldn't be overwritten.
            can.extend(Constructor, {
                constructor: Constructor,
                prototype: prototype,

                namespace: namespace,

                shortName: shortName,
                _shortName: _shortName,

                fullName: fullName,
                _fullName: _fullName
            });

            // Make sure our prototype looks nice.
            Constructor.prototype.constructor = Constructor;


            // Call the class `setup` and `init`
            var t = [_super_class].concat(can.makeArray(arguments)),
                args = Constructor.setup.apply(Constructor, t);

            if (Constructor.init) {
                Constructor.init.apply(Constructor, args || t);
            }


            return Constructor;

        }

    });
    return can.Construct;
});