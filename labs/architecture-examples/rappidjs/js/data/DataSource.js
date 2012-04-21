var requirejs = (typeof requirejs === "undefined" ? require("requirejs") : requirejs);

requirejs(["rAppid"], function (rAppid) {
    rAppid.defineClass("js.data.DataSource",
        ["js.core.Component", "js.core.Base", "js.data.Collection"],
        function (Component, Base, Collection) {

            var Context = Base.inherit({
                ctor: function (datasource, properties, parentContext) {
                    this.callBase();

                    this.$datasource = datasource;
                    this.$properties = properties;
                    this.$parent = parentContext;
                    this.$cache = {};
                },

                addModelToCache: function (model) {
                    this.$cache[Context.generateCacheIdFromModel(model)] = model;
                },

                addCollectionToCache: function (collection) {
                    this.$cache[Context.generateCacheIdFromCollection(collection)] = collection;
                },

                getInstanceByCacheId: function (cacheId) {
                    return this.$cache[cacheId];
                },

                createModel: function (factory, id, type) {

                    if (rAppid._.isFunction(factory)) {

                        type = type || factory.prototype.constructor.name;

                        var cachedItem = this.getInstanceByCacheId(Context.generateCacheId(type));

                        if (!cachedItem) {
                            // create new Collection
                            cachedItem = new factory({
                                id: id
                            });
                            // set context
                            cachedItem.$context = this;
                            cachedItem.className = type;

                            // and add it to the cache
                            this.addModelToCache(cachedItem);
                        }

                        return cachedItem;

                    } else {
                        throw "Factory has to be a function";
                    }
                },

                createCollection: function (factory, options, type) {
                    options = options || {};

                    if (rAppid._.isFunction(factory)) {
                        type = type || factory.prototype.constructor.name;

                        rAppid._.defaults(options, {
                            factory: factory,
                            type: type
                        });

                        var cachedCollection = this.getInstanceByCacheId(Context.generateCacheId(type));

                        if (!cachedCollection) {
                            // create new Collection
                            cachedCollection = new Collection(null, options);
                            // set context
                            cachedCollection.$context = this;
                            cachedCollection.className = type;

                            // and add it to the cache
                            this.addCollectionToCache(cachedCollection);
                        }

                        return cachedCollection;

                    } else {
                        throw "Factory has to be a function";
                    }
                }
            });

            Context.generateCacheId = function (type, id) {
                if (id) {
                    return type + "_" + id;
                } else {
                    return type;
                }
            };

            Context.generateCacheIdFromModel = function (model) {
                return Context.generateCacheId(model.className, model.$.id);
            };

            Context.generateCacheIdFromCollection = function (collection) {
                return Context.generateCacheId(collection.className);
            };

            var DataSource = Component.inherit({

                ctor: function () {
                    this.callBase();

                    this.$configuredTypes = [];
                    this.$contextCache = {};
                },

                _childrenInitialized: function () {
                    this.callBase();

                    for (var c = 0; c < this.$configurations.length; c++) {
                        var config = this.$configurations[c];

                        if (config.className == "js.conf.Type") {
                            this.addTypeConfiguration(config);
                        }
                    }
                },

                addTypeConfiguration: function (configuration) {

                    if (!configuration.$.className && !configuration.$.alias) {
                        throw "neither className nor alias defined";
                    }

                    if (configuration.$.className && !configuration.$.alias) {
                        configuration.$.alias = configuration.$.className.split(".").pop();
                    }

                    if (!configuration.$.className) {
                        configuration.$.className = "js.data.Model";
                    }

                    this.$configuredTypes.push(configuration);
                },

                getFqClassName: function (alias) {

                    for (var i = 0; i < this.$configuredTypes.length; i++) {
                        var typeConfig = this.$configuredTypes[i];

                        if (typeConfig.$.alias == alias) {
                            return typeConfig.$.className;
                        }
                    }
                },

                getModelClassNameForAlias: function (alias) {
                    var fqClassname = this.getFqClassName(alias) || alias;

                    if (fqClassname == "js.data.Model") {
                        return alias;
                    }

                    return fqClassname;
                },


                getContext: function (properties, parentContext) {

                    var cacheId = this.createContextCacheId(properties, parentContext ? parentContext.$properties : null);

                    if (!this.$contextCache.hasOwnProperty(cacheId)) {
                        this.$contextCache[cacheId] = this.createContext(properties, parentContext);
                    }

                    return this.$contextCache[cacheId];
                },

                /**
                 * returns the root context
                 */
                root: function () {
                    return this.getContext();
                },

                createContext: function (properties, parentContext) {
                    return new Context(this, properties, parentContext)
                },

                createContextCacheId: function (properties, parentProperties) {
                    var ret = [];
                    rAppid._.each(rAppid._.extend({}, parentProperties, properties), function (value, key) {
                        ret.push(key + "=" + value);
                    });

                    rAppid._.sortBy(ret, function (value) {
                        return value;
                    });

                    if (ret.length == 0) {
                        return "root";
                    }

                    return ret.join("&");
                },

                createModel: function (factory, id, type, context) {
                    context = context || this.getContext();

                    return context.createModel(factory, id, type);
                },

                createCollection: function (factory, options, type, context) {
                    context = context || this.getContext();

                    return context.createCollection(factory, options, type);
                },

                /**
                 * resolve references to models and collections
                 * @param {js.data.Model} model
                 * @param {JSON} data deserialized, parsed data
                 * @param {Object} options
                 * @param {Function} callback - function (err, resolvedData)
                 */
                resolveReferences: function (model, data, options, callback) {
                    if (callback) {
                        callback("Abstract method", data);
                    }
                },

                loadModel: function (model, options, callback) {
                    if (callback) {
                        callback("Abstract method", model);
                    }
                },

                update: function (data, callback) {
                },
                remove: function (data, callback) {
                },
                find: function (data, callback) {
                }
            });

            DataSource.Context = Context;

            return DataSource;
        });
})
;