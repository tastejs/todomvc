/*!
* CanJS - 1.1.5 (2013-03-27)
* http://canjs.us/
* Copyright (c) 2013 Bitovi
* Licensed MIT
*/
define(['can/util/library', 'can/observe'], function (can) {

    // ## model.js  
    // `can.Model`  
    // _A `can.Observe` that connects to a RESTful interface._
    // Generic deferred piping function
    var pipe = function (def, model, func) {
        var d = new can.Deferred();
        def.then(function () {
            var args = can.makeArray(arguments);
            args[0] = model[func](args[0]);
            d.resolveWith(d, args);
        }, function () {
            d.rejectWith(this, arguments);
        });

        if (typeof def.abort === 'function') {
            d.abort = function () {
                return def.abort();
            }
        }

        return d;
    },
        modelNum = 0,
        ignoreHookup = /change.observe\d+/,
        getId = function (inst) {
            // Instead of using attr, use __get for performance.
            // Need to set reading
            can.Observe.__reading && can.Observe.__reading(inst, inst.constructor.id)
            return inst.__get(inst.constructor.id);
        },
        // Ajax `options` generator function
        ajax = function (ajaxOb, data, type, dataType, success, error) {

            var params = {};

            // If we get a string, handle it.
            if (typeof ajaxOb == "string") {
                // If there's a space, it's probably the type.
                var parts = ajaxOb.split(/\s+/);
                params.url = parts.pop();
                if (parts.length) {
                    params.type = parts.pop();
                }
            } else {
                can.extend(params, ajaxOb);
            }

            // If we are a non-array object, copy to a new attrs.
            params.data = typeof data == "object" && !can.isArray(data) ? can.extend(params.data || {}, data) : data;

            // Get the url with any templated values filled out.
            params.url = can.sub(params.url, params.data, true);

            return can.ajax(can.extend({
                type: type || "post",
                dataType: dataType || "json",
                success: success,
                error: error
            }, params));
        },
        makeRequest = function (self, type, success, error, method) {
            var args;
            // if we pass an array as `self` it it means we are coming from
            // the queued request, and we're passing already serialized data
            // self's signature will be: [self, serializedData]
            if (can.isArray(self)) {
                args = self[1];
                self = self[0];
            } else {
                args = self.serialize();
            }
            args = [args];
            var deferred,
            // The model.
            model = self.constructor,
                jqXHR;

            // `destroy` does not need data.
            if (type == 'destroy') {
                args.shift();
            }
            // `update` and `destroy` need the `id`.
            if (type !== 'create') {
                args.unshift(getId(self));
            }


            jqXHR = model[type].apply(model, args);

            deferred = jqXHR.pipe(function (data) {
                self[method || type + "d"](data, jqXHR);
                return self;
            });

            // Hook up `abort`
            if (jqXHR.abort) {
                deferred.abort = function () {
                    jqXHR.abort();
                };
            }

            deferred.then(success, error);
            return deferred;
        },

        // This object describes how to make an ajax request for each ajax method.  
        // The available properties are:
        //		`url` - The default url to use as indicated as a property on the model.
        //		`type` - The default http request type
        //		`data` - A method that takes the `arguments` and returns `data` used for ajax.
        ajaxMethods = {

            create: {
                url: "_shortName",
                type: "post"
            },

            update: {
                data: function (id, attrs) {
                    attrs = attrs || {};
                    var identity = this.id;
                    if (attrs[identity] && attrs[identity] !== id) {
                        attrs["new" + can.capitalize(id)] = attrs[identity];
                        delete attrs[identity];
                    }
                    attrs[identity] = id;
                    return attrs;
                },
                type: "put"
            },

            destroy: {
                type: "delete",
                data: function (id) {
                    var args = {};
                    args.id = args[this.id] = id;
                    return args;
                }
            },

            findAll: {
                url: "_shortName"
            },

            findOne: {}
        },
        // Makes an ajax request `function` from a string.
        //		`ajaxMethod` - The `ajaxMethod` object defined above.
        //		`str` - The string the user provided. Ex: `findAll: "/recipes.json"`.
        ajaxMaker = function (ajaxMethod, str) {
            // Return a `function` that serves as the ajax method.
            return function (data) {
                // If the ajax method has it's own way of getting `data`, use that.
                data = ajaxMethod.data ? ajaxMethod.data.apply(this, arguments) :
                // Otherwise use the data passed in.
                data;
                // Return the ajax method with `data` and the `type` provided.
                return ajax(str || this[ajaxMethod.url || "_url"], data, ajaxMethod.type || "get")
            }
        }



        can.Model = can.Observe({
            fullName: "can.Model",
            setup: function (base) {
                // create store here if someone wants to use model without inheriting from it
                this.store = {};
                can.Observe.setup.apply(this, arguments);
                // Set default list as model list
                if (!can.Model) {
                    return;
                }
                this.List = ML({
                    Observe: this
                }, {});
                var self = this,
                    clean = can.proxy(this._clean, self);


                // go through ajax methods and set them up
                can.each(ajaxMethods, function (method, name) {
                    // if an ajax method is not a function, it's either
                    // a string url like findAll: "/recipes" or an
                    // ajax options object like {url: "/recipes"}
                    if (!can.isFunction(self[name])) {
                        // use ajaxMaker to convert that into a function
                        // that returns a deferred with the data
                        self[name] = ajaxMaker(method, self[name]);
                    }
                    // check if there's a make function like makeFindAll
                    // these take deferred function and can do special
                    // behavior with it (like look up data in a store)
                    if (self["make" + can.capitalize(name)]) {
                        // pass the deferred method to the make method to get back
                        // the "findAll" method.
                        var newMethod = self["make" + can.capitalize(name)](self[name]);
                        can.Construct._overwrite(self, base, name, function () {
                            // increment the numer of requests
                            this._reqs++;
                            var def = newMethod.apply(this, arguments);
                            var then = def.then(clean, clean);
                            then.abort = def.abort;

                            // attach abort to our then and return it
                            return then;
                        })
                    }
                });

                if (self.fullName == "can.Model" || !self.fullName) {
                    self.fullName = "Model" + (++modelNum);
                }
                // Add ajax converters.
                this._reqs = 0;
                this._url = this._shortName + "/{" + this.id + "}"
            },
            _ajax: ajaxMaker,
            _makeRequest: makeRequest,
            _clean: function () {
                this._reqs--;
                if (!this._reqs) {
                    for (var id in this.store) {
                        if (!this.store[id]._bindings) {
                            delete this.store[id];
                        }
                    }
                }
                return arguments[0];
            },

            models: function (instancesRawData, oldList) {

                if (!instancesRawData) {
                    return;
                }

                if (instancesRawData instanceof this.List) {
                    return instancesRawData;
                }

                // Get the list type.
                var self = this,
                    tmp = [],
                    res = oldList instanceof can.Observe.List ? oldList : new(self.List || ML),
                    // Did we get an `array`?
                    arr = can.isArray(instancesRawData),

                    // Did we get a model list?
                    ml = (instancesRawData instanceof ML),

                    // Get the raw `array` of objects.
                    raw = arr ?

                    // If an `array`, return the `array`.
                    instancesRawData :

                    // Otherwise if a model list.
                    (ml ?

                    // Get the raw objects from the list.
                    instancesRawData.serialize() :

                    // Get the object's data.
                    instancesRawData.data),
                    i = 0;



                if (res.length) {
                    res.splice(0);
                }

                can.each(raw, function (rawPart) {
                    tmp.push(self.model(rawPart));
                });

                // We only want one change event so push everything at once
                res.push.apply(res, tmp);

                if (!arr) { // Push other stuff onto `array`.
                    can.each(instancesRawData, function (val, prop) {
                        if (prop !== 'data') {
                            res.attr(prop, val);
                        }
                    })
                }
                return res;
            },

            model: function (attributes) {
                if (!attributes) {
                    return;
                }
                if (attributes instanceof this) {
                    attributes = attributes.serialize();
                }
                var id = attributes[this.id],
                    model = (id || id === 0) && this.store[id] ? this.store[id].attr(attributes, this.removeAttr || false) : new this(attributes);
                if (this._reqs) {
                    this.store[attributes[this.id]] = model;
                }
                return model;
            }
        },

        {

            isNew: function () {
                var id = getId(this);
                return !(id || id === 0); // If `null` or `undefined`
            },

            save: function (success, error) {
                return makeRequest(this, this.isNew() ? 'create' : 'update', success, error);
            },

            destroy: function (success, error) {
                if (this.isNew()) {
                    var self = this;
                    return can.Deferred().done(function (data) {
                        self.destroyed(data)
                    }).resolve(self);
                }
                return makeRequest(this, 'destroy', success, error, 'destroyed');
            },

            bind: function (eventName) {
                if (!ignoreHookup.test(eventName)) {
                    if (!this._bindings) {
                        this.constructor.store[this.__get(this.constructor.id)] = this;
                        this._bindings = 0;
                    }
                    this._bindings++;
                }

                return can.Observe.prototype.bind.apply(this, arguments);
            },

            unbind: function (eventName) {
                if (!ignoreHookup.test(eventName)) {
                    this._bindings--;
                    if (!this._bindings) {
                        delete this.constructor.store[getId(this)];
                    }
                }
                return can.Observe.prototype.unbind.apply(this, arguments);
            },
            // Change `id`.
            ___set: function (prop, val) {
                can.Observe.prototype.___set.call(this, prop, val)
                // If we add an `id`, move it to the store.
                if (prop === this.constructor.id && this._bindings) {
                    this.constructor.store[getId(this)] = this;
                }
            }
        });

    can.each({
        makeFindAll: "models",
        makeFindOne: "model"
    }, function (method, name) {
        can.Model[name] = function (oldFind) {
            return function (params, success, error) {
                var def = pipe(oldFind.call(this, params), this, method);
                def.then(success, error);
                // return the original promise
                return def;
            };
        };
    });

    can.each([

    "created",

    "updated",

    "destroyed"], function (funcName) {
        can.Model.prototype[funcName] = function (attrs) {
            var stub, constructor = this.constructor;

            // Update attributes if attributes have been passed
            stub = attrs && typeof attrs == 'object' && this.attr(attrs.attr ? attrs.attr() : attrs);

            // Call event on the instance
            can.trigger(this, funcName);

            // triggers change event that bubble's like
            // handler( 'change','1.destroyed' ). This is used
            // to remove items on destroyed from Model Lists.
            // but there should be a better way.
            can.trigger(this, "change", funcName)


            // Call event on the instance's Class
            can.trigger(constructor, funcName, this);
        };
    });

    // Model lists are just like `Observe.List` except that when their items are 
    // destroyed, it automatically gets removed from the list.
    var ML = can.Model.List = can.Observe.List({
        setup: function () {
            can.Observe.List.prototype.setup.apply(this, arguments);
            // Send destroy events.
            var self = this;
            this.bind('change', function (ev, how) {
                if (/\w+\.destroyed/.test(how)) {
                    var index = self.indexOf(ev.target);
                    if (index != -1) {
                        self.splice(index, 1);
                    }
                }
            })
        }
    })

    return can.Model;
});