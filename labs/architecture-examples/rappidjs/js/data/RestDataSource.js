var requirejs = (typeof requirejs === "undefined" ? require("requirejs") : requirejs);

requirejs(["rAppid"], function (rAppid) {
    rAppid.defineClass("js.data.RestDataSource",
        ["js.data.DataSource", "js.core.Base", "js.core.List"], function (DataSource, Base, List) {

        var RestContext = DataSource.Context.inherit({

            createCollection: function(factory, options, type) {
                options = options || {};
                rAppid._.defaults(options, {
                    chunkSize: 1000
                });

                return this.callBase(factory, options, type);
            },

            getPathComponents: function() {
                return [];
            },
            getQueryParameter: function() {
                return {};
            }
        });

        var referenceCollectionTypeExtractor = /^.*\/([^/]+)$/i,
            referenceModelTypeExtractor = /^.*\/([^/]+)\/(\w+)$/i;

        var RestDataSource = DataSource.inherit({
            ctor: function() {
                this.callBase();

                this.$processors = [];
                this.initializeProcessors();
            },

            initializeProcessors: function () {
                this.$processors.push({
                    regex: /json/,
                    processor: new RestDataSource.JsonProcessor()
                });
            },

            defaults: {
                endPoint: null,
                gateway: null,
                identifierProperty: "id",
                referenceProperty: "href"
            },

            initialize: function () {

                if (!this.$.endPoint) {
                    console.warn("No end-point for RestDataSource defined");
                }

                if (!this.$.gateway) {
                    this.$.gateway = this.$.endPoint;
                }

            },

            getClass: function (type) {
                if (rAppid._.isFunction(type)) {
                    return type;
                } else {
                    return rAppid.getDefinition(this.getFqClassName(type));
                }
            },

            createContext: function (properties, parentContext) {
                return new RestContext(this, properties, parentContext);
            },

            loadClass: function (type, callback) {
                if (rAppid._.isFunction(type)) {
                    callback(null, type);
                } else {
                    var className = this.getFqClassName(type);
                    if (className) {
                        rAppid.require(className, function (klass) {
                            callback(null, klass);
                        });
                    } else {
                        callback("className not found for type '" + type + "'");
                    }
                }
            },

            getRestPathForModel: function(fqClassname) {

                var typeConfig,
                    i;

                // first search via className
                for (i = 0; i < this.$configuredTypes.length; i++) {
                    typeConfig = this.$configuredTypes[i];
                    if (typeConfig.$.className == fqClassname) {
                        return typeConfig.$.path;
                    }
                }

                // search via alias
                for (i = 0; i < this.$configuredTypes.length; i++) {
                    typeConfig = this.$configuredTypes[i];
                    if (typeConfig.$.alias == fqClassname) {
                        return typeConfig.$.path;
                    }
                }

                return null;
            },

            getPathComponentsForModel: function(model) {
                var path = this.getRestPathForModel(model.className);

                if (path) {
                    var ret = [path];

                    if (model.status() == "CREATED"){
                        ret.push(model.$.id);
                    }

                    return ret;
                }

                return null;
            },


            /**
             * serialize the data
             * @param data
             */
            serialize: function (data) {
                return JSON.stringify(data);
            },

            /**
             * deserialize
             * @param input
             */
            deserialize: function (input) {
                // TODO: enable IE7 and FF3 support? Or should the user add json2.js lib
                return JSON.parse(input);
            },

            getQueryParameter: function() {
                return {};
            },

            /**
             *
             * @param obj
             */
            isReferencedModel: function(obj) {
                return obj[this.$.identifierProperty] && obj[this.$.referenceProperty] &&
                    rAppid._.keys(obj).length == 2;
            },

            isReferencedCollection: function(obj) {
                return obj[this.$.referenceProperty] && rAppid._.keys(obj).length == 1;
            },

            getContextPropertiesFromReference: function(reference) {
                return null;
            },

            getReferenceInformation: function(reference, id) {
                // url is something like
                // http://example.com/api/context/resourceType/id

                var extractor = id ? referenceModelTypeExtractor : referenceCollectionTypeExtractor;

                var match = extractor.exec(reference);
                if (match) {
                    var path = match[1];

                    for (var i = 0; i < this.$configuredTypes.length; i++) {
                        var config = this.$configuredTypes[i];

                        if (config.$.path == path) {
                            return {
                                context: this.getContextPropertiesFromReference(reference),
                                className: config.$.className,
                                requireClassName: config.$.className.replace(/\./g, "/"),
                                type: config.$.alias,
                                id: id
                            }
                        }
                    }
                }

                // could not retrieve reference information
                return null;
            },

            resolveReferences: function(model, data, options, callback) {
                // in REST models and collections will be referenced by href

                // first identify all needed model classes
                var referenceInformation = [],
                    self = this;

                function findReferences(obj, api) {

                    for (var prop in obj) {
                        if (obj.hasOwnProperty(prop)) {
                            var value = obj[prop];

                            // TODO: test if we need also go through array value and convert them
                            // or if this is actually done

                            if (value instanceof List) {
                                value.each(function(item) {
                                    findReferences(item, api);
                                });
                            } else if (value instanceof Object) {
                                // value is object and could contain sub objects with references
                                // first resolve references

                                findReferences(value, api);

                                if (self.isReferencedModel(value) || self.isReferencedCollection(value)) {
                                    var info = self.getReferenceInformation(value[self.$.referenceProperty], value[self.$.identifierProperty]);
                                    if (info) {
                                        info.referenceObject = obj;
                                        info.propertyName = prop;
                                        referenceInformation.push(info);
                                    } else {
                                        throw "Cannot determinate referenceInformation for reference '" + value[self.$.referenceProperty] + "'.";
                                    }
                                }
                            }
                        }
                    }
                }

                findReferences(data);

                var requiredClasses = [];
                for (var i = 0; i < referenceInformation.length; i++) {
                    var info = referenceInformation[i];
                    var requiredClassname = info.requireClassName;

                    if (rAppid._.indexOf(requiredClasses, requiredClassname) == -1) {
                        requiredClasses.push(requiredClassname);
                    }
                }

                // require model classes

                // TODO: how to handle errors here? require.onError?
                // some unique hash and extending of requirejs required
                rAppid.require(requiredClasses, function () {
                    var factories = Array.prototype.slice.call(arguments);

                    for (var i = 0; i < referenceInformation.length; i++) {
                        var info = referenceInformation[i];
                        var factory = factories[rAppid._.indexOf(requiredClasses, info.requireClassName)];

                        if (factory) {
                            // create instance in correct context

                            var context = self.getContext(info.context, model.$context);

                            var isModel = info.id;

                            var referenceInstance = isModel ?
                                self.createModel(factory, info.id, info.type, context) :
                                self.createCollection(factory, null, info.type, context);

                            if (referenceInstance) {
                                var value = info.referenceObject[info.propertyName];
                                info.referenceObject[info.propertyName] = referenceInstance;

                                if (isModel) {
                                    referenceInstance.set(value);
                                } else {
                                    // TODO: set loaded data for collection, if available in payload
                                }

                            } else {
                                callback("Instance for model '" + info.className + "' couldn't be created");
                            }

                        } else {
                            callback("Factory for class '" + info.className + "' missing");
                        }

                    }

                    callback(null, data);
                });
            },

            /**
             *
             * @param model
             * @param options
             * @param callback function(err, model, options)
             */
            loadModel: function (model, options, callback) {
                // map model to url
                var modelPathComponents = this.getPathComponentsForModel(model);

                if (!modelPathComponents) {
                    callback("path for model unknown", null, options);
                    return;
                }

                // build uri
                var uri = [this.$.gateway];
                uri = uri.concat(model.$context.getPathComponents());
                uri = uri.concat(modelPathComponents);

                // get queryParameter
                var params = rAppid._.defaults(model.$context.getQueryParameter(),this.getQueryParameter());

                // create url
                var url = uri.join("/");

                var self = this;

                // send request
                rAppid.ajax(url, {
                    type: "GET",
                    queryParameter: params
                }, function (err, xhr) {
                    if (!err && (xhr.status == 200 || xhr.status == 304)) {
                        // find processor that matches the content-type
                        var processor,
                            contentType = xhr.getResponseHeader("Content-Type");
                        for (var i = 0; i < self.$processors.length; i++) {
                            var processorEntry = self.$processors[i];
                            if (processorEntry.regex.test(contentType)) {
                                processor = processorEntry.processor;
                                break;
                            }
                        }

                        if (!processor) {
                            callback("No processor for content type '" + contentType + "' found", null, options);
                            return;
                        }

                        try {
                            // deserialize data with processor
                            var data = processor.deserialize(xhr.responses);

                            // parse data inside model
                            data = model.parse(data);

                            self.resolveReferences(model, data, options, function(err, resolvedData) {
                                // set data
                                model.set(resolvedData);

                                // and return
                                callback(null, model, options);
                            });

                        } catch (e) {
                            callback(e, null, options);
                        }

                    } else {
                        // TODO: better error handling
                        err = err || "wrong status code";
                        callback(err, null, options);
                    }
                });

            }
        });

        RestDataSource.RestContext = RestContext;

        RestDataSource.Processor = Base.inherit({
            serialize: function(data) {
                throw "abstract method";
            },
            deserialize: function(responses) {
                throw "abstract method";
            }
        });

        RestDataSource.JsonProcessor = RestDataSource.Processor.inherit({
            serialize: function (data) {
                return JSON.stringify(data);
            },
            deserialize: function (responses) {
                return JSON.parse(responses.text);
            }
        });

        return RestDataSource;

    });
});