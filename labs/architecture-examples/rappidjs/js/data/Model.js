var requirejs = (typeof requirejs === "undefined" ? require("requirejs") : requirejs);

requirejs(["rAppid"], function (rAppid) {
    rAppid.defineClass("js.data.Model", ["js.core.Bindable", "js.core.List", "flow"], function (Bindable, List, flow) {

        var cid = 0;

        var State = {
            CREATED: 0,
            LOADING: 1,
            LOADED: 2,
            ERROR: -1
        };

        var Model = Bindable.inherit({
            ctor: function (attributes) {
                this.callBase(attributes);
                this.$cid = ++cid;

                // stores the current fetch state
                this._fetch = {
                    callbacks: [],
                    state: State.CREATED
                }
            },
            save: function (options, callback) {
                this.$context.$datasource.save(options, callback);
            },

            /**
             * @param options
             * @param options.fetchSubModels
             *
             *
             * @param {Function} callback - function(err, model, options)
             */
            fetch: function (options, callback) {
                options = options || {};

                var self = this;

                if (this._fetch.state === State.LOADING) {
                    // currently fetching -> register callback
                    this._fetch.callbacks.push(function(err, model) {
                        modelFetchedComplete(err, model, options, callback);
                    });
                } else if (this._fetch.state == State.LOADED) {
                    // completed loaded -> execute
                    modelFetchedComplete(null, this, options, callback);
                } else {
                    // set state and start loading
                    self._fetch.state = State.LOADING;

                    this.$context.$datasource.loadModel(this, options, function(err, model) {
                        self._fetch.state = err ? State.ERROR : State.LOADED;

                        // execute callbacks
                        modelFetchedComplete(err, model, options, callback);

                        rAppid._.each(self._fetch.callbacks, function(cb) {
                            cb(err, model);
                        });

                    });
                }


            },
            remove: function (options, callback) {
                this.$context.$datasource.remove(options, callback);
            },
            /**
             * prepares the data for serialisation
             * @return {Object} all data that should be serialized
             */
            prepare: function() {
                var ret = {};

                for (var key in this.$) {
                    if (this.$.hasOwnProperty(key)) {
                        var value = this.$[key];
                        if (!rAppid._.isFunction(value)) {
                            ret[key] = value;
                        }
                    }
                }

                return ret;
            },

            /**
             * parse the deserializied data
             * @param data
             */
            parse: function(data) {

                // convert all arrays to List
                function convertArrayToList(obj) {

                    for (var prop in obj) {
                        if (obj.hasOwnProperty(prop)) {
                            var value = obj[prop];

                            if (rAppid._.isArray(value)) {
                                // convert array to js.core.List
                                obj[prop] = new List(value);

                                for (var i = 0; i < value.length; i++) {
                                    convertArrayToList(value[i]);
                                }

                            } else if (value instanceof Object) {
                                convertArrayToList(value);
                            }

                        }
                    }
                }

                convertArrayToList(data);

                return data;
            },



            status: function() {
                if (this.$.id === false) {
                    return "DELETED";
                } else {
                    return this.$.id ? "CREATED" : "NEW";
                }
            }.on("id")

        });

        function fetchSubModels(attributes, subModelTypes, delegates) {
            rAppid._.each(attributes, function (value) {
                if (value instanceof Model) {
                    // check if the model is required
                    var subModelTypeEntry = subModelTypes[value.className];

                    if (subModelTypeEntry) {
                        // model required -> create delegate
                        subModelTypeEntry.found = true;

                        delegates.push(function (cb) {
                            value.fetch({
                                fetchSubModels: subModelTypeEntry.subModels
                            }, cb);
                        });
                    }
                } else if (value instanceof Object) {
                    fetchSubModels(value, subModelTypes, delegates);
                }
            });
        }

        function modelFetchedComplete(err, model, options, originalCallback) {

            var callback = function (err, model) {
                if (originalCallback) {
                    originalCallback(err, model, options)
                }
            };

            if (err) {
                callback(err, model);
            } else {

                var delegates = [];

                if (options.fetchSubModels && options.fetchSubModels.length > 0) {

                    // for example fetch an article with ["currency", "product/design", "product/productType"]
                    var subModelTypes = createSubModelLoadingChain(model, options.fetchSubModels);

                    fetchSubModels(model.$, subModelTypes, delegates);

                    // check that all subResources where found
                    var missingSubModels = rAppid._.filter(subModelTypes, function (subModel) {
                        return !subModel.found;
                    });

                    if (missingSubModels.length > 0) {
                        // TODO load again with fullData=true if not laoded with fullData=false
                        console.log(["requested submodel missing", missingSubModels]);

                        callback("requested submodel missing", model);
                        return;
                    }
                }

                // execute all delegates in parallel and then execute callback
                flow()
                    .par(delegates)
                    .exec(function (err) {
                        callback(err, model);
                    });
            }
        }

        function createSubModelLoadingChain(model, subModels) {
            var ret = {},
                subModelParser = /^([\w][\w.]*)(?:\/([\w][\w.]*))?$/;

            rAppid._.each(subModels, function (item) {
                var parts = subModelParser.exec(item);
                if (parts) {
                    var subModelType = model.$context.$datasource.getModelClassNameForAlias(parts[1]);
                    var subModelSubType = parts[2];

                    var subModelTypeEntry = ret[subModelType];
                    if (!subModelTypeEntry) {
                        // create an entry
                        subModelTypeEntry = {
                            type: subModelType,
                            found: false,
                            subModels: []
                        };
                    }

                    // add required subModelTypeStrings
                    if (subModelSubType) {
                        subModelTypeEntry.subModels.push(subModelSubType);
                    }
                    ret[subModelType] = subModelTypeEntry;
                }
            });

            return ret;
        }

        return Model;
    });
});