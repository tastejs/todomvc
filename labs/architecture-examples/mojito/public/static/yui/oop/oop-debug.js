/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('oop', function (Y, NAME) {

/**
Adds object inheritance and manipulation utilities to the YUI instance. This
module is required by most YUI components.

@module oop
**/

var L            = Y.Lang,
    A            = Y.Array,
    OP           = Object.prototype,
    CLONE_MARKER = '_~yuim~_',

    hasOwn   = OP.hasOwnProperty,
    toString = OP.toString;

function dispatch(o, f, c, proto, action) {
    if (o && o[action] && o !== Y) {
        return o[action].call(o, f, c);
    } else {
        switch (A.test(o)) {
            case 1:
                return A[action](o, f, c);
            case 2:
                return A[action](Y.Array(o, 0, true), f, c);
            default:
                return Y.Object[action](o, f, c, proto);
        }
    }
}

/**
Augments the _receiver_ with prototype properties from the _supplier_. The
receiver may be a constructor function or an object. The supplier must be a
constructor function.

If the _receiver_ is an object, then the _supplier_ constructor will be called
immediately after _receiver_ is augmented, with _receiver_ as the `this` object.

If the _receiver_ is a constructor function, then all prototype methods of
_supplier_ that are copied to _receiver_ will be sequestered, and the
_supplier_ constructor will not be called immediately. The first time any
sequestered method is called on the _receiver_'s prototype, all sequestered
methods will be immediately copied to the _receiver_'s prototype, the
_supplier_'s constructor will be executed, and finally the newly unsequestered
method that was called will be executed.

This sequestering logic sounds like a bunch of complicated voodoo, but it makes
it cheap to perform frequent augmentation by ensuring that suppliers'
constructors are only called if a supplied method is actually used. If none of
the supplied methods is ever used, then there's no need to take the performance
hit of calling the _supplier_'s constructor.

@method augment
@param {Function|Object} receiver Object or function to be augmented.
@param {Function} supplier Function that supplies the prototype properties with
  which to augment the _receiver_.
@param {Boolean} [overwrite=false] If `true`, properties already on the receiver
  will be overwritten if found on the supplier's prototype.
@param {String[]} [whitelist] An array of property names. If specified,
  only the whitelisted prototype properties will be applied to the receiver, and
  all others will be ignored.
@param {Array|any} [args] Argument or array of arguments to pass to the
  supplier's constructor when initializing.
@return {Function} Augmented object.
@for YUI
**/
Y.augment = function (receiver, supplier, overwrite, whitelist, args) {
    var rProto    = receiver.prototype,
        sequester = rProto && supplier,
        sProto    = supplier.prototype,
        to        = rProto || receiver,

        copy,
        newPrototype,
        replacements,
        sequestered,
        unsequester;

    args = args ? Y.Array(args) : [];

    if (sequester) {
        newPrototype = {};
        replacements = {};
        sequestered  = {};

        copy = function (value, key) {
            if (overwrite || !(key in rProto)) {
                if (toString.call(value) === '[object Function]') {
                    sequestered[key] = value;

                    newPrototype[key] = replacements[key] = function () {
                        return unsequester(this, value, arguments);
                    };
                } else {
                    newPrototype[key] = value;
                }
            }
        };

        unsequester = function (instance, fn, fnArgs) {
            // Unsequester all sequestered functions.
            for (var key in sequestered) {
                if (hasOwn.call(sequestered, key)
                        && instance[key] === replacements[key]) {

                    instance[key] = sequestered[key];
                }
            }

            // Execute the supplier constructor.
            supplier.apply(instance, args);

            // Finally, execute the original sequestered function.
            return fn.apply(instance, fnArgs);
        };

        if (whitelist) {
            Y.Array.each(whitelist, function (name) {
                if (name in sProto) {
                    copy(sProto[name], name);
                }
            });
        } else {
            Y.Object.each(sProto, copy, null, true);
        }
    }

    Y.mix(to, newPrototype || sProto, overwrite, whitelist);

    if (!sequester) {
        supplier.apply(to, args);
    }

    return receiver;
};

/**
 * Copies object properties from the supplier to the receiver. If the target has
 * the property, and the property is an object, the target object will be
 * augmented with the supplier's value.
 *
 * @method aggregate
 * @param {Object} receiver Object to receive the augmentation.
 * @param {Object} supplier Object that supplies the properties with which to
 *     augment the receiver.
 * @param {Boolean} [overwrite=false] If `true`, properties already on the receiver
 *     will be overwritten if found on the supplier.
 * @param {String[]} [whitelist] Whitelist. If supplied, only properties in this
 *     list will be applied to the receiver.
 * @return {Object} Augmented object.
 */
Y.aggregate = function(r, s, ov, wl) {
    return Y.mix(r, s, ov, wl, 0, true);
};

/**
 * Utility to set up the prototype, constructor and superclass properties to
 * support an inheritance strategy that can chain constructors and methods.
 * Static members will not be inherited.
 *
 * @method extend
 * @param {function} r   the object to modify.
 * @param {function} s the object to inherit.
 * @param {object} px prototype properties to add/override.
 * @param {object} sx static properties to add/override.
 * @return {object} the extended object.
 */
Y.extend = function(r, s, px, sx) {
    if (!s || !r) {
        Y.error('extend failed, verify dependencies');
    }

    var sp = s.prototype, rp = Y.Object(sp);
    r.prototype = rp;

    rp.constructor = r;
    r.superclass = sp;

    // assign constructor property
    if (s != Object && sp.constructor == OP.constructor) {
        sp.constructor = s;
    }

    // add prototype overrides
    if (px) {
        Y.mix(rp, px, true);
    }

    // add object overrides
    if (sx) {
        Y.mix(r, sx, true);
    }

    return r;
};

/**
 * Executes the supplied function for each item in
 * a collection.  Supports arrays, objects, and
 * NodeLists
 * @method each
 * @param {object} o the object to iterate.
 * @param {function} f the function to execute.  This function
 * receives the value, key, and object as parameters.
 * @param {object} c the execution context for the function.
 * @param {boolean} proto if true, prototype properties are
 * iterated on objects.
 * @return {YUI} the YUI instance.
 */
Y.each = function(o, f, c, proto) {
    return dispatch(o, f, c, proto, 'each');
};

/**
 * Executes the supplied function for each item in
 * a collection.  The operation stops if the function
 * returns true. Supports arrays, objects, and
 * NodeLists.
 * @method some
 * @param {object} o the object to iterate.
 * @param {function} f the function to execute.  This function
 * receives the value, key, and object as parameters.
 * @param {object} c the execution context for the function.
 * @param {boolean} proto if true, prototype properties are
 * iterated on objects.
 * @return {boolean} true if the function ever returns true,
 * false otherwise.
 */
Y.some = function(o, f, c, proto) {
    return dispatch(o, f, c, proto, 'some');
};

/**
 * Deep object/array copy.  Function clones are actually
 * wrappers around the original function.
 * Array-like objects are treated as arrays.
 * Primitives are returned untouched.  Optionally, a
 * function can be provided to handle other data types,
 * filter keys, validate values, etc.
 *
 * NOTE: Cloning a non-trivial object is a reasonably heavy operation, due to
 * the need to recurrsively iterate down non-primitive properties. Clone
 * should be used only when a deep clone down to leaf level properties
 * is explicitly required.
 *
 * In many cases (for example, when trying to isolate objects used as 
 * hashes for configuration properties), a shallow copy, using Y.merge is 
 * normally sufficient. If more than one level of isolation is required, 
 * Y.merge can be used selectively at each level which needs to be 
 * isolated from the original without going all the way to leaf properties.
 *
 * @method clone
 * @param {object} o what to clone.
 * @param {boolean} safe if true, objects will not have prototype
 * items from the source.  If false, they will.  In this case, the
 * original is initially protected, but the clone is not completely
 * immune from changes to the source object prototype.  Also, cloned
 * prototype items that are deleted from the clone will result
 * in the value of the source prototype being exposed.  If operating
 * on a non-safe clone, items should be nulled out rather than deleted.
 * @param {function} f optional function to apply to each item in a
 * collection; it will be executed prior to applying the value to
 * the new object.  Return false to prevent the copy.
 * @param {object} c optional execution context for f.
 * @param {object} owner Owner object passed when clone is iterating
 * an object.  Used to set up context for cloned functions.
 * @param {object} cloned hash of previously cloned objects to avoid
 * multiple clones.
 * @return {Array|Object} the cloned object.
 */
Y.clone = function(o, safe, f, c, owner, cloned) {

    if (!L.isObject(o)) {
        return o;
    }

    // @todo cloning YUI instances doesn't currently work
    if (Y.instanceOf(o, YUI)) {
        return o;
    }

    var o2, marked = cloned || {}, stamp,
        yeach = Y.each;

    switch (L.type(o)) {
        case 'date':
            return new Date(o);
        case 'regexp':
            // if we do this we need to set the flags too
            // return new RegExp(o.source);
            return o;
        case 'function':
            // o2 = Y.bind(o, owner);
            // break;
            return o;
        case 'array':
            o2 = [];
            break;
        default:

            // #2528250 only one clone of a given object should be created.
            if (o[CLONE_MARKER]) {
                return marked[o[CLONE_MARKER]];
            }

            stamp = Y.guid();

            o2 = (safe) ? {} : Y.Object(o);

            o[CLONE_MARKER] = stamp;
            marked[stamp] = o;
    }

    // #2528250 don't try to clone element properties
    if (!o.addEventListener && !o.attachEvent) {
        yeach(o, function(v, k) {
if ((k || k === 0) && (!f || (f.call(c || this, v, k, this, o) !== false))) {
                if (k !== CLONE_MARKER) {
                    if (k == 'prototype') {
                        // skip the prototype
                    // } else if (o[k] === o) {
                    //     this[k] = this;
                    } else {
                        this[k] =
                            Y.clone(v, safe, f, c, owner || o, marked);
                    }
                }
            }
        }, o2);
    }

    if (!cloned) {
        Y.Object.each(marked, function(v, k) {
            if (v[CLONE_MARKER]) {
                try {
                    delete v[CLONE_MARKER];
                } catch (e) {
                    v[CLONE_MARKER] = null;
                }
            }
        }, this);
        marked = null;
    }

    return o2;
};


/**
 * Returns a function that will execute the supplied function in the
 * supplied object's context, optionally adding any additional
 * supplied parameters to the beginning of the arguments collection the
 * supplied to the function.
 *
 * @method bind
 * @param {Function|String} f the function to bind, or a function name
 * to execute on the context object.
 * @param {object} c the execution context.
 * @param {any} args* 0..n arguments to include before the arguments the
 * function is executed with.
 * @return {function} the wrapped function.
 */
Y.bind = function(f, c) {
    var xargs = arguments.length > 2 ?
            Y.Array(arguments, 2, true) : null;
    return function() {
        var fn = L.isString(f) ? c[f] : f,
            args = (xargs) ?
                xargs.concat(Y.Array(arguments, 0, true)) : arguments;
        return fn.apply(c || fn, args);
    };
};

/**
 * Returns a function that will execute the supplied function in the
 * supplied object's context, optionally adding any additional
 * supplied parameters to the end of the arguments the function
 * is executed with.
 *
 * @method rbind
 * @param {Function|String} f the function to bind, or a function name
 * to execute on the context object.
 * @param {object} c the execution context.
 * @param {any} args* 0..n arguments to append to the end of
 * arguments collection supplied to the function.
 * @return {function} the wrapped function.
 */
Y.rbind = function(f, c) {
    var xargs = arguments.length > 2 ? Y.Array(arguments, 2, true) : null;
    return function() {
        var fn = L.isString(f) ? c[f] : f,
            args = (xargs) ?
                Y.Array(arguments, 0, true).concat(xargs) : arguments;
        return fn.apply(c || fn, args);
    };
};


}, '3.7.3', {"requires": ["yui-base"]});
