/*!
* CanJS - 1.1.5 (2013-03-27)
* http://canjs.us/
* Copyright (c) 2013 Bitovi
* Licensed MIT
*/
define(['can/util/library', 'can/observe'], function (can, Observe) {

    can.each([can.Observe, can.Model], function (clss) {
        // in some cases model might not be defined quite yet.
        if (clss === undefined) {
            return;
        }
        var isObject = function (obj) {
            return typeof obj === 'object' && obj !== null && obj;
        };

        can.extend(clss, {

            attributes: {},


            convert: {
                "date": function (str) {
                    var type = typeof str;
                    if (type === "string") {
                        return isNaN(Date.parse(str)) ? null : Date.parse(str)
                    } else if (type === 'number') {
                        return new Date(str)
                    } else {
                        return str
                    }
                },
                "number": function (val) {
                    return parseFloat(val);
                },
                "boolean": function (val) {
                    if (val === 'false' || val === '0' || !val) {
                        return false;
                    }
                    return true;
                },
                "default": function (val, oldVal, error, type) {
                    var construct = can.getObject(type),
                        context = window,
                        realType;
                    // if type has a . we need to look it up
                    if (type.indexOf(".") >= 0) {
                        // get everything before the last .
                        realType = type.substring(0, type.lastIndexOf("."));
                        // get the object before the last .
                        context = can.getObject(realType);
                    }
                    return typeof construct == "function" ? construct.call(context, val, oldVal) : val;
                }
            },

            serialize: {
                "default": function (val, type) {
                    return isObject(val) && val.serialize ? val.serialize() : val;
                },
                "date": function (val) {
                    return val && val.getTime()
                }
            }
        });

        // overwrite setup to do this stuff
        var oldSetup = clss.setup;


        clss.setup = function (superClass, stat, proto) {
            var self = this;
            oldSetup.call(self, superClass, stat, proto);

            can.each(["attributes"], function (name) {
                if (!self[name] || superClass[name] === self[name]) {
                    self[name] = {};
                }
            });

            can.each(["convert", "serialize"], function (name) {
                if (superClass[name] != self[name]) {
                    self[name] = can.extend({}, superClass[name], self[name]);
                }
            });
        };
    });

    var oldSetup = can.Observe.prototype.setup;

    can.Observe.prototype.setup = function (obj) {

        var diff = {};

        oldSetup.call(this, obj);

        can.each(this.constructor.defaults, function (value, key) {
            if (!this.hasOwnProperty(key)) {
                diff[key] = value;
            }
        }, this);

        this._init = 1;
        this.attr(diff);
        delete this._init;
    };

    can.Observe.prototype.__convert = function (prop, value) {
        // check if there is a
        var Class = this.constructor,
            oldVal = this.attr(prop),
            type, converter;

        if (Class.attributes) {
            // the type of the attribute
            type = Class.attributes[prop];
            converter = Class.convert[type] || Class.convert['default'];
        }

        return value === null || !type ?
        // just use the value
        value :
        // otherwise, pass to the converter
        converter.call(Class, value, oldVal, function () {}, type);
    };

    can.Observe.prototype.serialize = function (attrName) {
        var where = {},
            Class = this.constructor,
            attrs = {};

        if (attrName != undefined) {
            attrs[attrName] = this[attrName];
        } else {
            attrs = this.__get();
        }

        can.each(attrs, function (val, name) {
            var type, converter;

            type = Class.attributes ? Class.attributes[name] : 0;
            converter = Class.serialize ? Class.serialize[type] : 0;

            // if the value is an object, and has a attrs or serialize function
            where[name] = val && typeof val.serialize == 'function' ?
            // call attrs or serialize to get the original data back
            val.serialize() :
            // otherwise if we have  a converter
            converter ?
            // use the converter
            converter(val, type) :
            // or return the val
            val
        });

        return attrName != undefined ? where[attrName] : where;
    };
    return can.Observe;
});