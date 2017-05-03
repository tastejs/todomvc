requirejs(["rAppid"], function (rAppid) {
    rAppid.defineClass("js.core.Router", ["js.core.Component"],

        function (Component) {

            return Component.inherit({
                ctor: function () {

                    this.$routes = [];

                    this.callBase();
                },

                initialize: function () {
                    this.callBase();

                    if (this.$.history) {
                        this.history = this.$.history;
                    } else {
                        this.history = this.$systemManager.$application.history;
                    }

                    this.history.addRouter(this);
                },

                _childrenInitialized: function () {
                    this.callBase();

                    for (var c = 0; c < this.$configurations.length; c++) {
                        var config = this.$configurations[c];

                        if (config.className == "js.conf.Route") {
                            this.addRoute(config.$);
                        }
                    }
                },


                /**
                 *
                 * @param {Regexp|Object} route
                 * @param {Function} [fn]
                 */
                addRoute: function () {

                    var route;
                    if (arguments.length == 2) {
                        route = {
                            route: arguments[0],
                            fn: arguments[1]
                        }
                    } else {
                        route = arguments[0];
                    }

                    if (route.onexec) {
                        route.fn = this.$rootScope[route.onexec];
                    }

                    rAppid._.defaults(route, {
                        name: null,
                        route: null,
                        fn: null
                    });

                    if (route.route && !(route.route instanceof RegExp)) {
                        // build regex from string
                        route.route = new RegExp(route.route);
                    }

                    if (!(route.fn && route.route)) {
                        throw "fn and route required"
                    }

                    this.$routes.push(route);
                },

                executeRoute: function (fragment, callback) {
                    // Test routes and call callback
                    for (var i = 0; i < this.$routes.length; i++) {
                        var route = this.$routes[i];
                        var params = route.route.exec(fragment);
                        if (params) {

                            var cb = function(err, data) {
                                if (callback) {
                                    callback(err, data);
                                }
                            };

                            params.shift();

                            var routeContext = {
                                callback: cb,
                                router: this,
                                params: params
                            };

                            params.unshift(routeContext);

                            var thisArg = this.$rootScope;

                            if (route.fn._async) {
                                route.fn.apply(thisArg, params);
                            } else {
                                // exec route sync, call callback after execution
                                try {
                                    cb(null, route.fn.apply(thisArg, params));
                                } catch (e) {
                                    cb(e);
                                }
                            }

                            return true;
                        }
                    }

                    return false;
                },

                /**
                 * shortcut to history.navigate
                 * @param to
                 * @param createHistoryEntry
                 * @param triggerRoute
                 */
                navigate: function (to, createHistoryEntry, triggerRoute, callback) {
                    return this.history.navigate(to, createHistoryEntry, triggerRoute, callback);
                }
            });
        });
});