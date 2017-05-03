requirejs(["rAppid"], function (rAppid) {
    rAppid.defineClass("js.data.Collection", ["js.core.List", "js.data.Model", "flow"], function (List, Model, flow) {

        var cid = 0;

        var State = {
            CREATED: 0,
            LOADING: 1,
            LOADED: 2,
            ERROR: -1
        };

        var Collection = List.inherit({

            ctor: function(items, options) {
                options = options || {};

                this.callBase(items);
                this.$cid = ++cid;

                rAppid._.defaults(options, {
                    rootCollection: null,
                    pageSize: null,
                    queryParameters: {},
                    factory: Model,
                    type: null
                });

                this.$itemsCount = null;
                this.$queryCollectionsCache = {};
                this.$pageCache = [];
                this.$pageOrderForItems = [];
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

                var self = this;

                function fetchPages(pageCount) {
                    var delegates = [];

                    function addFetchPageDelegate(pageIndex) {
                        delegates.push(function (cb) {
                            self.fetchPage(pageIndex, options, cb);
                        });
                    }

                    for (var i = 0; i < pageCount; i++) {
                        addFetchPageDelegate(i);
                    }

                    // execute loading parallel
                    flow()
                        .par(delegates)
                        .exec(function(err) {
                            if (callback) {
                                callback(err, self);
                            }
                        });
                }

                if (!this.$options.pageSize) {
                    // unlimited pageSize -> create one and only page and fetch
                    this.fetchPage(0, options, callback);
                } else {
                    // determinate pages
                    var pageCount = this.pageCount();

                    if (!isNaN(pageCount)) {
                        // we know how many page are there
                        fetchPages(pageCount);
                    } else {
                        // load first page in order to get the available itemCount
                        // to calculate the pageCount
                        this.fetchPage(0, options, function(err) {
                            if (!err) {
                                // we now should calculate a page count
                                pageCount = self.pageCount();

                                if (isNaN(pageCount)) {
                                    if (callback) {
                                        callback("Count for collection couldn't be fetched.", self);
                                    }
                                } else {
                                    fetchPages(pageCount);
                                }
                            } else {
                                if (callback) {
                                    callback(err, self);
                                }
                            }
                        })
                    }
                }

            },

            pageCount: function() {
                if (this.$itemsCount) {
                    return Math.ceil(this.$itemsCount / this.$options.pageSize);
                } else {
                    // we actually don't know how many pages there will be
                    return NaN;
                }
            },

            fetchPage: function (pageIndex, options, callback) {

                if (pageIndex < 0) {
                    throw "pageIndex must be >= 0";
                }

                var page = this.$pageCache[pageIndex];
                if (!page) {
                    page = this.$pageCache[pageIndex] = new Page(null, this, pageIndex);
                }

                var self = this;
                page.fetch(options, function(err, page) {

                    // insert data into items if not already inserted
                    if (!err && !page.itemsInsertedIntoCollection) {
                        page.itemsInsertedIntoCollection = true;

                        for (var pageIndex = 0; pageIndex < self.$pageOrderForItems.length; pageIndex++) {
                            var pageAtIndex = self.$pageOrderForItems[pageIndex];
                            if (page.$pageIndex < pageAtIndex.$pageIndex) {
                                // found the gab
                                pageIndex++;
                                break;
                            }
                        }

                        // insert the page in the pageOrder
                        self.$pageOrderForItems.splice(pageAtIndex, 0, page);

                        // add items to collection
                        self.add(page.$items, pageAtIndex * self.$options.pageSize);

                    }

                    if (callback) {
                        callback(err, page);
                    }
                });
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

        var Page = Collection.Page = List.inherit({

            ctor: function (items, collection, pageIndex) {
                if (!collection.$options.pageSize && pageIndex !== 0) {
                    throw "Cannot create page for index '" + pageIndex + "' with pageSize '" + collection.options.pageSize + "'";
                }

                var options = collection.$options;

                if (options.pageSize) {
                    this.$offset = pageIndex * options.pageSize;
                    this.$limit = options.pageSize;
                }

                this.$pageIndex = pageIndex;
                this.$collection = collection;

                this.callBase(items);

                // stores the current fetch state
                this._fetch = {
                    callbacks: [],
                    state: State.CREATED
                };

            },

            /***
             *
             * @param options
             * @param [Boolean] [options.fetchModels=false] fetch models inside collection
             * @param [Array] [options.fetchSubModels] fetch sub models
             * @param callback
             */
            fetch: function(options, callback) {
                options = options || {};

                var self = this;

                function pageFetchedComplete(err, page, originalCallback) {
                    var callback = function (err, page) {
                        if (originalCallback) {
                            originalCallback(err, page, options)
                        }
                    };


                    if (options.fetchModels || options.fetchSubModels) {

                        // TODO: replace with flow.parEach
                        // TODO: introduce poolsize parameter for par, and parEach

                        var delegates = [];

                        function addToDelegate(model) {
                            delegates.push(function(cb){
                                model.fetch({
                                    fetchSubModels: options.fetchSubModels
                                }, cb);
                            });
                        }

                        for (var i = 0; i < page.$items.length; i++) {
                            addToDelegate(page.$items[i]);
                        }

                        flow()
                            .par(delegates)
                            .exec(function(err) {
                                callback(err, page);
                            });

                    } else {
                        callback(err, page);
                    }

                }

                if (this._fetch.state === State.LOADING) {
                    // currently fetching -> register callback
                    this._fetch.callbacks.push(function (err, page) {
                        pageFetchedComplete(err, page, callback);
                    });
                } else if (this._fetch.state == State.LOADED) {
                    // completed loaded -> execute
                    pageFetchedComplete(null, this, callback);
                } else {
                    // set state and start loading
                    self._fetch.state = State.LOADING;

                    this.$collection.$context.$datasource.loadCollectionPage(this, options, function (err, page) {
                        self._fetch.state = err ? State.ERROR : State.LOADED;

                        // execute callbacks
                        pageFetchedComplete(err, page, callback);

                        rAppid._.each(self._fetch.callbacks, function (cb) {
                            cb(err, page);
                        });
                    });
                }
            }
        });

        return Collection;
    });
});