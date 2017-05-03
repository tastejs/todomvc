requirejs(["rAppid"], function (rAppid) {
    rAppid.defineClass("js.core.History", ["js.core.Bindable"], function (Bindable) {


        var routeStripper = /^#\/?/,
            undef,
            emptyCallback = function () {};

        return Bindable.inherit({

            ctor: function () {
                this.callBase();
                this.$routers = [];
                this.processUrl = true;

                this.$history = [];
            },

            defaults: {
                interval: 50
            },

            getFragment: function () {
                var fragment;

                if (this.runsInBrowser()) {
                    fragment = decodeURIComponent(window.location.hash);
                } else {
                    fragment = this.$history[this.$history.length-1] || "";
                }

                return fragment.replace(routeStripper, '');
            },

            start: function (callback, initialHash) {

                var self = this;
                this.$checkUrlFn = function () {
                    self.checkUrl.apply(self, arguments);
                };


                if (this.runsInBrowser()) {
                    // we're on a browser
                    if ("onhashchange" in window) {
                        if (window.addEventListener) {
                            window.addEventListener('hashchange',
                                this.$checkUrlFn, false);
                        } else {
                            window.attachEvent('onhashchange', this.$checkUrlFn);
                        }
                    } else {
                        // polling
                        this.$checkUrlInterval = setInterval(this.$checkUrlFn, this.$.interval);
                    }
                } else {
                    // rendering on node
                    this.$history.push(initialHash || "");
                }

                this.fragment = this.getFragment();
                this.navigate(this.fragment, true, true, callback);
                this.processUrl = true;

            },

            stop: function () {
                if (typeof window !== "undefined") {
                    if ("onhashchange" in window) {
                        if (window.removeEventListener) {
                            window.removeEventListener('hashchange',
                                this.$checkUrlFn, false);
                        } else {
                            window.detachEvent('onhashchange', this.$checkUrlFn);
                        }
                    } else {
                        // polling
                        clearInterval(this.$checkUrlInterval);
                    }
                }
            },

            addRouter: function (router) {
                this.$routers.push(router);
            },

            checkUrl: function (e) {

                if (this.processUrl) {
                    var currentFragment = this.getFragment();
                    if (currentFragment == this.fragment) {
                        return false;
                    }

                    this.navigate(currentFragment, true, true, emptyCallback);
                }

                this.processUrl = true;

            },

            triggerRoute: function (fragment, callback) {

                for (var i = 0; i < this.$routers.length; i++) {
                    if (this.$routers[i].executeRoute(fragment, callback)) {
                        return true;
                    }
                }

                console.log("no route for '" + fragment + "' found.");
            },

            navigate: function (fragment, createHistoryEntry, triggerRoute, callback) {

                if (!callback && createHistoryEntry instanceof Function) {
                    callback = createHistoryEntry;
                    createHistoryEntry = null;
                }

                if (!callback && triggerRoute instanceof Function) {
                    callback = triggerRoute;
                    triggerRoute = null;
                }

                if (createHistoryEntry == undef || createHistoryEntry == null) {
                    createHistoryEntry = true;
                }

                if (triggerRoute == undef || triggerRoute == null) {
                    triggerRoute = true;
                }

                this.processUrl = false;

                if (createHistoryEntry) {
                    if (this.runsInBrowser()) {
                        window.location.hash = "/" + fragment;
                    } else {
                        this.$history.push(fragment);
                        this.checkUrl(null);
                    }
                } else {
                    if (this.runsInBrowser()) {
                        // replace hash
                        window.location.replace("#/" + fragment);
                    } else {
                        this.$history[this.$history.length-1] = fragment;
                    }

                }

                this.fragment = fragment;

                if (triggerRoute) {
                    return this.triggerRoute(fragment, callback);
                }

            }
        });
    });
});