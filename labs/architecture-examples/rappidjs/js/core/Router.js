var requirejs = (typeof requirejs === "undefined" ? require("requirejs") : requirejs);

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
                        this.history = rAppid.systemManager.application.history;
                    }

                    this.history.addRouter(this);
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
                            regex: arguments[0],
                            fn: arguments[1]
                        }
                    } else {
                        route = arguments[0];
                    }

                    rAppid._.defaults(route, {
                        name: null,
                        regex: null,
                        fn: null
                    });

                    if (!(route.fn && route.regex)) {
                        throw "fn and regex required"
                    }

                    this.$routes.push(route);
                },

                executeRoute: function (fragment) {
                    // Test routes and call callback
                    for (var i = 0; i < this.$routes.length; i++) {
                        var route = this.$routes[i];
                        var params = route.regex.exec(fragment);
                        if (params) {
                            params.shift();
                            route.fn.apply(this, params);

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
                navigate: function (to, createHistoryEntry, triggerRoute) {
                    return this.history.navigate(to, createHistoryEntry, triggerRoute);
                }
            });
        });
});