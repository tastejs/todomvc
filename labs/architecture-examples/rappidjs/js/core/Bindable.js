var requirejs = (typeof requirejs === "undefined" ? require("requirejs") : requirejs);

requirejs(["rAppid"], function (rAppid) {

    rAppid.defineClass("js.core.Bindable", ["js.core.EventDispatcher"],
        /**
         * @export js.core.Bindable
         */
            function (EventDispatcher) {

            /**
             * @class js.core.Bindable
             * @extends js.core.EventDispatcher
             */

            var Bindable = EventDispatcher.inherit({
                ctor: function (attributes) {
                    // call the base class constructor
                    this.callBase(null);

                    this.$ = {};

                    rAppid._.extend(this._eventAttributes, this.base._eventAttributes || {});

                    attributes = attributes || {};

                    rAppid._.defaults(attributes, this._defaultAttributes());

                    this.$ = attributes;
                    this.$previousAttributes = rAppid._.clone(attributes);


                    var self = this, fnc;

                    var bind = function(key, targetKey, method){
                        self.bind('change:' + key, function () {
                            self.set(targetKey, method.call(self));
                        });
                    };
                },

                defaults: {
                },

                _defaultAttributes: function () {
                    return this._generateDefaultsChain("defaults");
                },

                _generateDefaultsChain: function (property) {
                    var ret = this[property],
                        base = this.base;

                    while (base) {
                        rAppid._.defaults(ret, base[property]);
                        base = base.base;
                    }
                    // clone all attributes
                    for(var k in ret){
                        if(ret.hasOwnProperty(k) && !rAppid._.isFunction(ret[k])){
                            ret[k] = rAppid._.clone(ret[k]);
                        }
                    }

                    return ret;
                },

                /**
                 *
                 * @param key
                 * @param value
                 * @param options
                 */
                set: function (key, value, options) {
                    var attributes = {};

                    if (rAppid._.isString(key)) {
                        // check for path
                        var path = key.split(".");
                        if (path.length > 1) {
                            var scope = this.get(path.shift());
                            if (scope && scope.set) {
                                scope.set(path.join("."), value, options);
                                return this;
                            }

                        }

                        attributes[key] = value;
                    } else {
                        options = value;
                        attributes = key;
                    }

                    options = options || {silent: false, unset: false};

                    // for unsetting attributes
                    if (options.unset) {
                        for (key in attributes) {
                            attributes[key] = void 0;
                        }
                    }

                    var changedAttributes = {},
                        equal = true,
                        now = this.$,
                        val;

                    for (key in attributes) {
                        if (attributes.hasOwnProperty(key)) {
                            // get the value
                            val = attributes[key];
                            // unset attribute or change it ...
                            if (options.unset === true) {
                                delete now[key];
                            } else {
                                if (!rAppid._.isEqual(now[key], attributes[key])) {
                                    this.$previousAttributes[key] = now[key];

                                    now[key] = attributes[key];
                                    changedAttributes[key] = now[key];
                                }
                            }
                            // if attribute has changed and there is no async changing process in the background, fire the event

                        }
                    }
                    this._commitChangedAttributes(changedAttributes);

                    if (options.silent === false && rAppid._.size(changedAttributes) > 0) {
                        for (key in changedAttributes) {
                            if (changedAttributes.hasOwnProperty(key)) {
                                this.trigger('change:' + key, changedAttributes[key], this);
                            }
                        }
                        this.trigger('change', changedAttributes, this);

                    }

                    return this;
                },
                get: function (key) {
                    //var path = key.split(".");
                    return this.$[key];
                    /*
                    var key;
                    while (path.length > 0 && prop != null) {
                        key = path.shift();
                        if (prop instanceof Bindable) {
                            prop = prop.get(key);
                        } else if (typeof(prop[key]) !== "undefined") {
                            prop = prop[key];
                        } else {
                            return null;
                        }
                    }  */
                },
                has: function(key){
                    return typeof(this.$[key]) !== "undefined" && this.$[key] !== null;
                },
                _commitChangedAttributes: function (attributes) {

                },
                unset: function (key, options) {
                    (options || (options = {})).unset = true;
                    return this.set(key, null, options);
                },
                clear: function () {
                    return this.set(this.$, {unset: true});
                }
            });

            return Bindable;

        });
});