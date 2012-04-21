var requirejs = (typeof requirejs === "undefined" ? require("requirejs") : requirejs);

requirejs(["rAppid"], function (rAppid) {
    rAppid.defineClass("js.core.History", ["js.core.Bindable"], function (Bindable) {


        var routeStripper = /^#\/?/,
            undef;

        return Bindable.inherit({

            ctor: function () {
                this.callBase();
                this.$routers = [];
                this.processUrl = true;
            },

            defaults: {
                interval: 50
            },

            getFragment: function (fragment) {
                fragment = decodeURIComponent(fragment || window.location.hash);
                return fragment.replace(routeStripper, '');
            },

            start: function () {

                var self = this;
                this.$checkUrlFn = function () {
                    self.checkUrl.apply(self, arguments);
                };

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

                this.fragment = this.getFragment();
                this.navigate(this.fragment);

            },

            stop: function () {
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
                }

                this.processUrl = true;

            },

            triggerRoute: function (fragment) {

                for (var i = 0; i < this.$routers.length; i++) {
                    if (this.$routers[i].executeRoute(fragment)) {
                        return true;
                    }
                }

                console.log("no route for '" + fragment + "' found.");
            },

            navigate: function (fragment, createHistoryEntry, triggerRoute) {
                if (createHistoryEntry == undef || createHistoryEntry == null) {
                    createHistoryEntry = true;
                }

                if (triggerRoute == undef || triggerRoute == null) {
                    triggerRoute = true;
                }

                this.processUrl = false;

                if (createHistoryEntry) {
                    window.location.hash = "/" + fragment;
                } else {
                    // replace hash
                    window.location.replace("#/" + fragment);
                }

                this.fragment = fragment;

                if (triggerRoute) {
                    return this.triggerRoute(fragment);
                }

            }
        });
    });
});