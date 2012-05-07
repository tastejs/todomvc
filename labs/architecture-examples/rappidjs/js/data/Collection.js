var requirejs = (typeof requirejs === "undefined" ? require("requirejs") : requirejs);

requirejs(["rAppid"], function (rAppid) {
    rAppid.defineClass("js.data.Collection", ["js.core.List", "js.data.Model"], function (List, Model) {

        var Collection = List.inherit({

            ctor: function(items, options) {
                this.callBase(items);

                rAppid._.defaults(options, {
                    rootCollection: null,
                    chunkSize: null,
                    queryParameters: {},
                    factory: Model,
                    type: null
                });

                this.$queryCollectionsCache = {};
                this.$options = options;
            },

            getRootCollection: function() {
                return this.$options.rootCollection ? this.$options.rootCollection : this;
            },

            createQueryCacheKey: function(queryParameters) {
                queryParameters = queryParameters || {};
                var ret = [];

                for (var key in queryParameters) {
                    if (queryParameters.hasOwnProperty(key)) {
                        ret.push(key + "=" + queryParameters[key]);
                    }
                }

                ret.sort();

                if (ret.length == 0) {
                    return "root";
                }

                return ret.join("&");
            },

            createQueryCollection: function(queryParameter) {

                var options = {
                    queryParameter: queryParameter,
                    rootCollection: this.getRootCollection
                };

                // different queryParameter, same options
                rAppid._.defaults(options, this.$options);

                return new Collection(null, options);
            },

            // fetches the complete list
            fetch: function(options, callback) {
                options = options || {};
            },

            // returns a new collections
            find: function(parameters) {
                var queryKey = this.createQueryCacheKey(parameters);

                if (!this.$queryCollectionsCache.hasOwnProperty(queryKey)) {
                    this.$queryCollectionsCache[queryKey] = this.createQueryCollection(parameters);
                }

                return this.$queryCollectionsCache[queryKey];
            }

        });

        return Collection;
    });
});