/*
* Kendo UI Web v2013.3.1119 (http://kendoui.com)
* Copyright 2013 Telerik AD. All rights reserved.
*
* Kendo UI Web commercial licenses may be obtained at
* https://www.kendoui.com/purchase/license-agreement/kendo-ui-web-commercial.aspx
* If you do not own a commercial license, this file shall be governed by the
* GNU General Public License (GPL) version 3.
* For GPL requirements, please review: http://www.gnu.org/copyleft/gpl.html
*/
kendo_module({
    id: "router",
    name: "Router",
    category: "framework",
    description: "The Router class is responsible for tracking the application state and navigating between the application states.",
    depends: [ "core" ],
    hidden: false
});

(function($, undefined) {
    var kendo = window.kendo,
        CHANGE = "change",
        BACK = "back",
        support = kendo.support,
        location = window.location,
        history = window.history,
        CHECK_URL_INTERVAL = 50,
        hashStrip = /^#*/,
        document = window.document;

    function absoluteURL(path, pathPrefix) {
        if (!pathPrefix) {
            return path;
        }

        if (path + "/" === pathPrefix) {
            path = pathPrefix;
        }

        var regEx = new RegExp("^" + pathPrefix, "i");

        if (!regEx.test(path)) {
            path = pathPrefix + "/" + path;
        }

        return location.protocol + '//' + (location.host + "/" + path).replace(/\/\/+/g, '/');
    }

    function stripRoot(root, url) {
        if (url.indexOf(root) === 0) {
            return (url.substr(root.length)).replace(/\/\//g, '/');
        } else {
            return root;
        }
    }

    var PushStateAdapter = kendo.Class.extend({
        init: function(root) {
            this.root = root;
        },

        navigate: function(to) {
            history.pushState({}, document.title, absoluteURL(to, this.root));
            return this.current();
        },

        current: function() {
            var current = location.pathname;

            if (location.search) {
                current += location.search;
            }

            return stripRoot(this.root, current);
        },

        change: function(callback) {
            $(window).bind("popstate.kendo", callback);
        },

        stop: function() {
            $(window).unbind("popstate.kendo");
        }
    });

    var HashAdapter = kendo.Class.extend({
        navigate: function(to) {
            location.hash = to;
            return to;
        },

        change: function(callback) {
            if (support.hashChange) {
                $(window).bind("hashchange.kendo", callback);
            } else {
                this._interval = setInterval(callback, CHECK_URL_INTERVAL);
            }
        },

        stop: function() {
            $(window).unbind("popstate.kendo");
            clearInterval(this._interval);
        },

        current: function() {
            return location.hash.replace(hashStrip, '');
        }
    });

    var History = kendo.Observable.extend({
        start: function(options) {
            options = options || {};

            this.bind([CHANGE, BACK], options);

            if (this._started) {
                return;
            }

            this._started = true;

            var pathname = location.pathname,
                hash = location.hash,
                pushState = support.pushState && options.pushState,
                root = options.root || "/",
                atRoot = root === pathname;

            this.adapter = pushState ? new PushStateAdapter(root) : new HashAdapter();

            if (options.pushState && !support.pushState && !atRoot) {
                location.replace(root + '#' + stripRoot(root, pathname));
                return true; // browser will reload at this point.
            }

            if (pushState) {
                var fixedUrl;
                if (root === pathname + "/") {
                    fixedUrl = root;
                }

                if (atRoot && hash) {
                    fixedUrl = absoluteURL(hash.replace(hashStrip, ''), root);
                }

                if (fixedUrl) {
                    history.replaceState({}, document.title, fixedUrl);
                }
            }

            this.root = root;
            this.current = this.adapter.current();
            this.locations = [this.current];
            this.adapter.change($.proxy(this, "_checkUrl"));
        },

        stop: function() {
            if (!this._started) {
                return;
            }
            this.adapter.stop();
            this.unbind(CHANGE);
            this._started = false;
        },

        change: function(callback) {
            this.bind(CHANGE, callback);
        },

        navigate: function(to, silent) {
            if (to === "#:back") {
                history.back();
                return;
            }

            to = to.replace(hashStrip, '');

            if (this.current === to || this.current === decodeURIComponent(to)) {
                return;
            }

            if (!silent) {
                if (this.trigger(CHANGE, { url: to })) {
                    return;
                }
            }

            this.current = this.adapter.navigate(to);

            this.locations.push(this.current);
        },

        _checkUrl: function() {
            var current = this.adapter.current(),
                back = current === this.locations[this.locations.length - 2],
                prev = this.current;

            if (this.current === current || this.current === decodeURIComponent(current)) {
                return;
            }

            this.current = current;

            if (back && this.trigger("back", { url: prev, to: current })) {
                history.forward();
                this.current = prev;
                return;
            }

            if (this.trigger(CHANGE, { url: current })) {
                if (back) {
                    history.forward();
                } else {
                    history.back();
                }
                this.current = prev;
                return;
            }

            if (back) {
                this.locations.pop();
            } else {
                this.locations.push(current);
            }
        }
    });

    kendo.absoluteURL = absoluteURL;
    kendo.history = new History();
})(window.kendo.jQuery);

(function() {
    var kendo = window.kendo,
        history = kendo.history,
        Observable = kendo.Observable,
        INIT = "init",
        ROUTE_MISSING = "routeMissing",
        CHANGE = "change",
        BACK = "back",
        optionalParam = /\((.*?)\)/g,
        namedParam = /(\(\?)?:\w+/g,
        splatParam = /\*\w+/g,
        escapeRegExp = /[\-{}\[\]+?.,\\\^$|#\s]/g;

    function namedParamReplace(match, optional) {
        return optional ? match : '([^\/]+)';
    }

    function routeToRegExp(route) {
        return new RegExp('^' + route
            .replace(escapeRegExp, '\\$&')
            .replace(optionalParam, '(?:$1)?')
            .replace(namedParam, namedParamReplace)
            .replace(splatParam, '(.*?)') + '$');
    }

    function stripUrl(url) {
        return url.replace(/(\?.*)|(#.*)/g, "");
    }

    var Route = kendo.Class.extend({
        init: function(route, callback) {
            if (!(route instanceof RegExp)) {
                route = routeToRegExp(route);
            }

            this.route = route;
            this._callback = callback;
        },

        callback: function(url) {
            var params,
                idx = 0,
                length,
                queryStringParams = kendo.parseQueryStringParams(url);

            url = stripUrl(url);
            params = this.route.exec(url).slice(1);
            length = params.length;

            for (; idx < length; idx ++) {
                if (typeof params[idx] !== 'undefined') {
                    params[idx] = decodeURIComponent(params[idx]);
                }
            }

            params.push(queryStringParams);

            this._callback.apply(null, params);
        },

        worksWith: function(url) {
            if (this.route.test(url)) {
                this.callback(url);
                return true;
            } else {
                return false;
            }
        }
    });

    var Router = Observable.extend({
        init: function(options) {
            Observable.fn.init.call(this);
            this.routes = [];
            this.pushState = options ? options.pushState : false;
            if (options && options.root) {
                this.root = options.root;
            }
            this.bind([INIT, ROUTE_MISSING, CHANGE], options);
        },

        destroy: function() {
            history.unbind(CHANGE, this._urlChangedProxy);
            history.unbind(BACK, this._backProxy);
            this.unbind();
        },

        start: function() {
            var that = this,
                backProxy = function(e) { that._back(e); },
                urlChangedProxy = function(e) { that._urlChanged(e); };

            history.start({
                change: urlChangedProxy,
                back: backProxy,
                pushState: that.pushState,
                root: that.root
            });

            var initEventObject = { url: history.current || "/" };

            if (!that.trigger(INIT, initEventObject)) {
                that._urlChanged(initEventObject);
            }

            this._urlChangedProxy = urlChangedProxy;
            this._backProxy = backProxy;
        },

        route: function(route, callback) {
            this.routes.push(new Route(route, callback));
        },

        navigate: function(url, silent) {
            kendo.history.navigate(url, silent);
        },

        _back: function(e) {
            if (this.trigger(BACK, { url: e.url, to: e.to })) {
                e.preventDefault();
            }
        },

        _urlChanged: function(e) {
            var url = e.url;

            if (!url) {
                url = "/";
            }

            if (this.trigger(CHANGE, { url: e.url, params: kendo.parseQueryStringParams(e.url) })) {
                e.preventDefault();
                return;
            }

            var idx = 0,
                routes = this.routes,
                route,
                length = routes.length;

            for (; idx < length; idx ++) {
                 route = routes[idx];

                 if (route.worksWith(url)) {
                    return;
                 }
            }

            if (this.trigger(ROUTE_MISSING, { url: url, params: kendo.parseQueryStringParams(url) })) {
                e.preventDefault();
            }
        }
    });

    kendo.Router = Router;
})();
