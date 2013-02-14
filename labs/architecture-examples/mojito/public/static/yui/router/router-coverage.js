/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
if (typeof _yuitest_coverage == "undefined"){
    _yuitest_coverage = {};
    _yuitest_coverline = function(src, line){
        var coverage = _yuitest_coverage[src];
        if (!coverage.lines[line]){
            coverage.calledLines++;
        }
        coverage.lines[line]++;
    };
    _yuitest_coverfunc = function(src, name, line){
        var coverage = _yuitest_coverage[src],
            funcId = name + ":" + line;
        if (!coverage.functions[funcId]){
            coverage.calledFunctions++;
        }
        coverage.functions[funcId]++;
    };
}
_yuitest_coverage["build/router/router.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/router/router.js",
    code: []
};
_yuitest_coverage["build/router/router.js"].code=["YUI.add('router', function (Y, NAME) {","","/**","Provides URL-based routing using HTML5 `pushState()` or the location hash.","","@module app","@submodule router","@since 3.4.0","**/","","var HistoryHash = Y.HistoryHash,","    QS          = Y.QueryString,","    YArray      = Y.Array,","    YLang       = Y.Lang,","","    win = Y.config.win,","","    // Holds all the active router instances. This supports the static","    // `dispatch()` method which causes all routers to dispatch.","    instances = [],","","    // We have to queue up pushState calls to avoid race conditions, since the","    // popstate event doesn't actually provide any info on what URL it's","    // associated with.","    saveQueue = [],","","    /**","    Fired when the router is ready to begin dispatching to route handlers.","","    You shouldn't need to wait for this event unless you plan to implement some","    kind of custom dispatching logic. It's used internally in order to avoid","    dispatching to an initial route if a browser history change occurs first.","","    @event ready","    @param {Boolean} dispatched `true` if routes have already been dispatched","      (most likely due to a history change).","    @fireOnce","    **/","    EVT_READY = 'ready';","","/**","Provides URL-based routing using HTML5 `pushState()` or the location hash.","","This makes it easy to wire up route handlers for different application states","while providing full back/forward navigation support and bookmarkable, shareable","URLs.","","@class Router","@param {Object} [config] Config properties.","    @param {Boolean} [config.html5] Overrides the default capability detection","        and forces this router to use (`true`) or not use (`false`) HTML5","        history.","    @param {String} [config.root=''] Root path from which all routes should be","        evaluated.","    @param {Array} [config.routes=[]] Array of route definition objects.","@constructor","@extends Base","@since 3.4.0","**/","function Router() {","    Router.superclass.constructor.apply(this, arguments);","}","","Y.Router = Y.extend(Router, Y.Base, {","    // -- Protected Properties -------------------------------------------------","","    /**","    Whether or not `_dispatch()` has been called since this router was","    instantiated.","","    @property _dispatched","    @type Boolean","    @default undefined","    @protected","    **/","","    /**","    Whether or not we're currently in the process of dispatching to routes.","","    @property _dispatching","    @type Boolean","    @default undefined","    @protected","    **/","","    /**","    History event handle for the `history:change` or `hashchange` event","    subscription.","","    @property _historyEvents","    @type EventHandle","    @protected","    **/","","    /**","    Cached copy of the `html5` attribute for internal use.","","    @property _html5","    @type Boolean","    @protected","    **/","","    /**","    Whether or not the `ready` event has fired yet.","","    @property _ready","    @type Boolean","    @default undefined","    @protected","    **/","","    /**","    Regex used to match parameter placeholders in route paths.","","    Subpattern captures:","","      1. Parameter prefix character. Either a `:` for subpath parameters that","         should only match a single level of a path, or `*` for splat parameters","         that should match any number of path levels.","","      2. Parameter name, if specified, otherwise it is a wildcard match.","","    @property _regexPathParam","    @type RegExp","    @protected","    **/","    _regexPathParam: /([:*])([\\w\\-]+)?/g,","","    /**","    Regex that matches and captures the query portion of a URL, minus the","    preceding `?` character, and discarding the hash portion of the URL if any.","","    @property _regexUrlQuery","    @type RegExp","    @protected","    **/","    _regexUrlQuery: /\\?([^#]*).*$/,","","    /**","    Regex that matches everything before the path portion of a URL (the origin).","    This will be used to strip this part of the URL from a string when we","    only want the path.","","    @property _regexUrlOrigin","    @type RegExp","    @protected","    **/","    _regexUrlOrigin: /^(?:[^\\/#?:]+:\\/\\/|\\/\\/)[^\\/]*/,","","    // -- Lifecycle Methods ----------------------------------------------------","    initializer: function (config) {","        var self = this;","","        self._html5  = self.get('html5');","        self._routes = [];","        self._url    = self._getURL();","","        // Necessary because setters don't run on init.","        self._setRoutes(config && config.routes ? config.routes :","                self.get('routes'));","","        // Set up a history instance or hashchange listener.","        if (self._html5) {","            self._history       = new Y.HistoryHTML5({force: true});","            self._historyEvents =","                    Y.after('history:change', self._afterHistoryChange, self);","        } else {","            self._historyEvents =","                    Y.on('hashchange', self._afterHistoryChange, win, self);","        }","","        // Fire a `ready` event once we're ready to route. We wait first for all","        // subclass initializers to finish, then for window.onload, and then an","        // additional 20ms to allow the browser to fire a useless initial","        // `popstate` event if it wants to (and Chrome always wants to).","        self.publish(EVT_READY, {","            defaultFn  : self._defReadyFn,","            fireOnce   : true,","            preventable: false","        });","","        self.once('initializedChange', function () {","            Y.once('load', function () {","                setTimeout(function () {","                    self.fire(EVT_READY, {dispatched: !!self._dispatched});","                }, 20);","            });","        });","","        // Store this router in the collection of all active router instances.","        instances.push(this);","    },","","    destructor: function () {","        var instanceIndex = YArray.indexOf(instances, this);","","        // Remove this router from the collection of active router instances.","        if (instanceIndex > -1) {","            instances.splice(instanceIndex, 1);","        }","","        this._historyEvents && this._historyEvents.detach();","    },","","    // -- Public Methods -------------------------------------------------------","","    /**","    Dispatches to the first route handler that matches the current URL, if any.","","    If `dispatch()` is called before the `ready` event has fired, it will","    automatically wait for the `ready` event before dispatching. Otherwise it","    will dispatch immediately.","","    @method dispatch","    @chainable","    **/","    dispatch: function () {","        this.once(EVT_READY, function () {","            this._ready = true;","","            if (this._html5 && this.upgrade()) {","                return;","            } else {","                this._dispatch(this._getPath(), this._getURL());","            }","        });","","        return this;","    },","","    /**","    Gets the current route path, relative to the `root` (if any).","","    @method getPath","    @return {String} Current route path.","    **/","    getPath: function () {","        return this._getPath();","    },","","    /**","    Returns `true` if this router has at least one route that matches the","    specified URL, `false` otherwise.","","    This method enforces the same-origin security constraint on the specified","    `url`; any URL which is not from the same origin as the current URL will","    always return `false`.","","    @method hasRoute","    @param {String} url URL to match.","    @return {Boolean} `true` if there's at least one matching route, `false`","      otherwise.","    **/","    hasRoute: function (url) {","        var path;","","        if (!this._hasSameOrigin(url)) {","            return false;","        }","","        if (!this._html5) {","            url = this._upgradeURL(url);","        }","","        path = this.removeQuery(this.removeRoot(url));","","        return !!this.match(path).length;","    },","","    /**","    Returns an array of route objects that match the specified URL path.","","    This method is called internally to determine which routes match the current","    path whenever the URL changes. You may override it if you want to customize","    the route matching logic, although this usually shouldn't be necessary.","","    Each returned route object has the following properties:","","      * `callback`: A function or a string representing the name of a function","        this router that should be executed when the route is triggered.","","      * `keys`: An array of strings representing the named parameters defined in","        the route's path specification, if any.","","      * `path`: The route's path specification, which may be either a string or","        a regex.","","      * `regex`: A regular expression version of the route's path specification.","        This regex is used to determine whether the route matches a given path.","","    @example","        router.route('/foo', function () {});","        router.match('/foo');","        // => [{callback: ..., keys: [], path: '/foo', regex: ...}]","","    @method match","    @param {String} path URL path to match.","    @return {Object[]} Array of route objects that match the specified path.","    **/","    match: function (path) {","        return YArray.filter(this._routes, function (route) {","            return path.search(route.regex) > -1;","        });","    },","","    /**","    Removes the `root` URL from the front of _url_ (if it's there) and returns","    the result. The returned path will always have a leading `/`.","","    @method removeRoot","    @param {String} url URL.","    @return {String} Rootless path.","    **/","    removeRoot: function (url) {","        var root = this.get('root');","","        // Strip out the non-path part of the URL, if any (e.g.","        // \"http://foo.com\"), so that we're left with just the path.","        url = url.replace(this._regexUrlOrigin, '');","","        if (root && url.indexOf(root) === 0) {","            url = url.substring(root.length);","        }","","        return url.charAt(0) === '/' ? url : '/' + url;","    },","","    /**","    Removes a query string from the end of the _url_ (if one exists) and returns","    the result.","","    @method removeQuery","    @param {String} url URL.","    @return {String} Queryless path.","    **/","    removeQuery: function (url) {","        return url.replace(/\\?.*$/, '');","    },","","    /**","    Replaces the current browser history entry with a new one, and dispatches to","    the first matching route handler, if any.","","    Behind the scenes, this method uses HTML5 `pushState()` in browsers that","    support it (or the location hash in older browsers and IE) to change the","    URL.","","    The specified URL must share the same origin (i.e., protocol, host, and","    port) as the current page, or an error will occur.","","    @example","        // Starting URL: http://example.com/","","        router.replace('/path/');","        // New URL: http://example.com/path/","","        router.replace('/path?foo=bar');","        // New URL: http://example.com/path?foo=bar","","        router.replace('/');","        // New URL: http://example.com/","","    @method replace","    @param {String} [url] URL to set. This URL needs to be of the same origin as","      the current URL. This can be a URL relative to the router's `root`","      attribute. If no URL is specified, the page's current URL will be used.","    @chainable","    @see save()","    **/","    replace: function (url) {","        return this._queue(url, true);","    },","","    /**","    Adds a route handler for the specified URL _path_.","","    The _path_ parameter may be either a string or a regular expression. If it's","    a string, it may contain named parameters: `:param` will match any single","    part of a URL path (not including `/` characters), and `*param` will match","    any number of parts of a URL path (including `/` characters). These named","    parameters will be made available as keys on the `req.params` object that's","    passed to route handlers.","","    If the _path_ parameter is a regex, all pattern matches will be made","    available as numbered keys on `req.params`, starting with `0` for the full","    match, then `1` for the first subpattern match, and so on.","","    Here's a set of sample routes along with URL paths that they match:","","      * Route: `/photos/:tag/:page`","        * URL: `/photos/kittens/1`, params: `{tag: 'kittens', page: '1'}`","        * URL: `/photos/puppies/2`, params: `{tag: 'puppies', page: '2'}`","","      * Route: `/file/*path`","        * URL: `/file/foo/bar/baz.txt`, params: `{path: 'foo/bar/baz.txt'}`","        * URL: `/file/foo`, params: `{path: 'foo'}`","","    **Middleware**: Routes also support an arbitrary number of callback","    functions. This allows you to easily reuse parts of your route-handling code","    with different route. This method is liberal in how it processes the","    specified `callbacks`, you can specify them as separate arguments, or as","    arrays, or both.","","    If multiple route match a given URL, they will be executed in the order they","    were added. The first route that was added will be the first to be executed.","","    **Passing Control**: Invoking the `next()` function within a route callback","    will pass control to the next callback function (if any) or route handler","    (if any). If a value is passed to `next()`, it's assumed to be an error,","    therefore stopping the dispatch chain, unless that value is: `\"route\"`,","    which is special case and dispatching will skip to the next route handler.","    This allows middleware to skip any remaining middleware for a particular","    route.","","    @example","        router.route('/photos/:tag/:page', function (req, res, next) {","        });","","        // Using middleware.","","        router.findUser = function (req, res, next) {","            req.user = this.get('users').findById(req.params.user);","            next();","        };","","        router.route('/users/:user', 'findUser', function (req, res, next) {","            // The `findUser` middleware puts the `user` object on the `req`.","        });","","    @method route","    @param {String|RegExp} path Path to match. May be a string or a regular","      expression.","    @param {Array|Function|String} callbacks* Callback functions to call","        whenever this route is triggered. These can be specified as separate","        arguments, or in arrays, or both. If a callback is specified as a","        string, the named function will be called on this router instance.","","      @param {Object} callbacks.req Request object containing information about","          the request. It contains the following properties.","","        @param {Array|Object} callbacks.req.params Captured parameters matched by","          the route path specification. If a string path was used and contained","          named parameters, then this will be a key/value hash mapping parameter","          names to their matched values. If a regex path was used, this will be","          an array of subpattern matches starting at index 0 for the full match,","          then 1 for the first subpattern match, and so on.","        @param {String} callbacks.req.path The current URL path.","        @param {Number} callbacks.req.pendingCallbacks Number of remaining","          callbacks the route handler has after this one in the dispatch chain.","        @param {Number} callbacks.req.pendingRoutes Number of matching routes","          after this one in the dispatch chain.","        @param {Object} callbacks.req.query Query hash representing the URL","          query string, if any. Parameter names are keys, and are mapped to","          parameter values.","        @param {String} callbacks.req.url The full URL.","        @param {String} callbacks.req.src What initiated the dispatch. In an","          HTML5 browser, when the back/forward buttons are used, this property","          will have a value of \"popstate\".","","      @param {Object} callbacks.res Response object containing methods and","          information that relate to responding to a request. It contains the","          following properties.","        @param {Object} callbacks.res.req Reference to the request object.","","      @param {Function} callbacks.next Function to pass control to the next","          callback or the next matching route if no more callbacks (middleware)","          exist for the current route handler. If you don't call this function,","          then no further callbacks or route handlers will be executed, even if","          there are more that match. If you do call this function, then the next","          callback (if any) or matching route handler (if any) will be called.","          All of these functions will receive the same `req` and `res` objects","          that were passed to this route (so you can use these objects to pass","          data along to subsequent callbacks and routes).","        @param {String} [callbacks.next.err] Optional error which will stop the","          dispatch chaining for this `req`, unless the value is `\"route\"`, which","          is special cased to jump skip past any callbacks for the current route","          and pass control the next route handler.","    @chainable","    **/","    route: function (path, callbacks) {","        callbacks = YArray.flatten(YArray(arguments, 1, true));","","        var keys = [];","","        this._routes.push({","            callbacks: callbacks,","            keys     : keys,","            path     : path,","            regex    : this._getRegex(path, keys),","","            // For back-compat.","            callback: callbacks[0]","        });","","        return this;","    },","","    /**","    Saves a new browser history entry and dispatches to the first matching route","    handler, if any.","","    Behind the scenes, this method uses HTML5 `pushState()` in browsers that","    support it (or the location hash in older browsers and IE) to change the","    URL and create a history entry.","","    The specified URL must share the same origin (i.e., protocol, host, and","    port) as the current page, or an error will occur.","","    @example","        // Starting URL: http://example.com/","","        router.save('/path/');","        // New URL: http://example.com/path/","","        router.save('/path?foo=bar');","        // New URL: http://example.com/path?foo=bar","","        router.save('/');","        // New URL: http://example.com/","","    @method save","    @param {String} [url] URL to set. This URL needs to be of the same origin as","      the current URL. This can be a URL relative to the router's `root`","      attribute. If no URL is specified, the page's current URL will be used.","    @chainable","    @see replace()","    **/","    save: function (url) {","        return this._queue(url);","    },","","    /**","    Upgrades a hash-based URL to an HTML5 URL if necessary. In non-HTML5","    browsers, this method is a noop.","","    @method upgrade","    @return {Boolean} `true` if the URL was upgraded, `false` otherwise.","    **/","    upgrade: function () {","        if (!this._html5) {","            return false;","        }","","        // Get the resolve hash path.","        var hashPath = this._getHashPath();","","        if (hashPath) {","            // This is an HTML5 browser and we have a hash-based path in the","            // URL, so we need to upgrade the URL to a non-hash URL. This","            // will trigger a `history:change` event, which will in turn","            // trigger a dispatch.","            this.once(EVT_READY, function () {","                this.replace(hashPath);","            });","","            return true;","        }","","        return false;","    },","","    // -- Protected Methods ----------------------------------------------------","","    /**","    Wrapper around `decodeURIComponent` that also converts `+` chars into","    spaces.","","    @method _decode","    @param {String} string String to decode.","    @return {String} Decoded string.","    @protected","    **/","    _decode: function (string) {","        return decodeURIComponent(string.replace(/\\+/g, ' '));","    },","","    /**","    Shifts the topmost `_save()` call off the queue and executes it. Does","    nothing if the queue is empty.","","    @method _dequeue","    @chainable","    @see _queue","    @protected","    **/","    _dequeue: function () {","        var self = this,","            fn;","","        // If window.onload hasn't yet fired, wait until it has before","        // dequeueing. This will ensure that we don't call pushState() before an","        // initial popstate event has fired.","        if (!YUI.Env.windowLoaded) {","            Y.once('load', function () {","                self._dequeue();","            });","","            return this;","        }","","        fn = saveQueue.shift();","        return fn ? fn() : this;","    },","","    /**","    Dispatches to the first route handler that matches the specified _path_.","","    If called before the `ready` event has fired, the dispatch will be aborted.","    This ensures normalized behavior between Chrome (which fires a `popstate`","    event on every pageview) and other browsers (which do not).","","    @method _dispatch","    @param {String} path URL path.","    @param {String} url Full URL.","    @param {String} src What initiated the dispatch.","    @chainable","    @protected","    **/","    _dispatch: function (path, url, src) {","        var self      = this,","            routes    = self.match(path),","            callbacks = [],","            matches, req, res;","","        self._dispatching = self._dispatched = true;","","        if (!routes || !routes.length) {","            self._dispatching = false;","            return self;","        }","","        req = self._getRequest(path, url, src);","        res = self._getResponse(req);","","        req.next = function (err) {","            var callback, route;","","            if (err) {","                // Special case \"route\" to skip to the next route handler","                // avoiding any additional callbacks for the current route.","                if (err === 'route') {","                    callbacks = [];","                    req.next();","                } else {","                    Y.error(err);","                }","","            } else if ((callback = callbacks.shift())) {","                if (typeof callback === 'string') {","                    callback = self[callback];","                }","","                // Allow access to the num or remaining callbacks for the route.","                req.pendingCallbacks = callbacks.length;","","                callback.call(self, req, res, req.next);","","            } else if ((route = routes.shift())) {","                // Make a copy of this route's `callbacks` and find its matches.","                callbacks = route.callbacks.concat();","                matches   = route.regex.exec(path);","","                // Use named keys for parameter names if the route path contains","                // named keys. Otherwise, use numerical match indices.","                if (matches.length === route.keys.length + 1) {","                    req.params = YArray.hash(route.keys, matches.slice(1));","                } else {","                    req.params = matches.concat();","                }","","                // Allow access tot he num of remaining routes for this request.","                req.pendingRoutes = routes.length;","","                // Execute this route's `callbacks`.","                req.next();","            }","        };","","        req.next();","","        self._dispatching = false;","        return self._dequeue();","    },","","    /**","    Returns the resolved path from the hash fragment, or an empty string if the","    hash is not path-like.","","    @method _getHashPath","    @param {String} [hash] Hash fragment to resolve into a path. By default this","        will be the hash from the current URL.","    @return {String} Current hash path, or an empty string if the hash is empty.","    @protected","    **/","    _getHashPath: function (hash) {","        hash || (hash = HistoryHash.getHash());","","        // Make sure the `hash` is path-like.","        if (hash && hash.charAt(0) === '/') {","            return this._joinURL(hash);","        }","","        return '';","    },","","    /**","    Gets the location origin (i.e., protocol, host, and port) as a URL.","","    @example","        http://example.com","","    @method _getOrigin","    @return {String} Location origin (i.e., protocol, host, and port).","    @protected","    **/","    _getOrigin: function () {","        var location = Y.getLocation();","        return location.origin || (location.protocol + '//' + location.host);","    },","","    /**","    Gets the current route path, relative to the `root` (if any).","","    @method _getPath","    @return {String} Current route path.","    @protected","    **/","    _getPath: function () {","        var path = (!this._html5 && this._getHashPath()) ||","                Y.getLocation().pathname;","","        return this.removeQuery(this.removeRoot(path));","    },","","    /**","    Returns the current path root after popping off the last path segment,","    making it useful for resolving other URL paths against.","","    The path root will always begin and end with a '/'.","","    @method _getPathRoot","    @return {String} The URL's path root.","    @protected","    @since 3.5.0","    **/","    _getPathRoot: function () {","        var slash = '/',","            path  = Y.getLocation().pathname,","            segments;","","        if (path.charAt(path.length - 1) === slash) {","            return path;","        }","","        segments = path.split(slash);","        segments.pop();","","        return segments.join(slash) + slash;","    },","","    /**","    Gets the current route query string.","","    @method _getQuery","    @return {String} Current route query string.","    @protected","    **/","    _getQuery: function () {","        var location = Y.getLocation(),","            hash, matches;","","        if (this._html5) {","            return location.search.substring(1);","        }","","        hash    = HistoryHash.getHash();","        matches = hash.match(this._regexUrlQuery);","","        return hash && matches ? matches[1] : location.search.substring(1);","    },","","    /**","    Creates a regular expression from the given route specification. If _path_","    is already a regex, it will be returned unmodified.","","    @method _getRegex","    @param {String|RegExp} path Route path specification.","    @param {Array} keys Array reference to which route parameter names will be","      added.","    @return {RegExp} Route regex.","    @protected","    **/","    _getRegex: function (path, keys) {","        if (path instanceof RegExp) {","            return path;","        }","","        // Special case for catchall paths.","        if (path === '*') {","            return (/.*/);","        }","","        path = path.replace(this._regexPathParam, function (match, operator, key) {","            // Only `*` operators are supported for key-less matches to allowing","            // in-path wildcards like: '/foo/*'.","            if (!key) {","                return operator === '*' ? '.*' : match;","            }","","            keys.push(key);","            return operator === '*' ? '(.*?)' : '([^/#?]*)';","        });","","        return new RegExp('^' + path + '$');","    },","","    /**","    Gets a request object that can be passed to a route handler.","","    @method _getRequest","    @param {String} path Current path being dispatched.","    @param {String} url Current full URL being dispatched.","    @param {String} src What initiated the dispatch.","    @return {Object} Request object.","    @protected","    **/","    _getRequest: function (path, url, src) {","        return {","            path : path,","            query: this._parseQuery(this._getQuery()),","            url  : url,","            src  : src","        };","    },","","    /**","    Gets a response object that can be passed to a route handler.","","    @method _getResponse","    @param {Object} req Request object.","    @return {Object} Response Object.","    @protected","    **/","    _getResponse: function (req) {","        // For backwards compatibility, the response object is a function that","        // calls `next()` on the request object and returns the result.","        var res = function () {","            return req.next.apply(this, arguments);","        };","","        res.req = req;","        return res;","    },","","    /**","    Getter for the `routes` attribute.","","    @method _getRoutes","    @return {Object[]} Array of route objects.","    @protected","    **/","    _getRoutes: function () {","        return this._routes.concat();","    },","","    /**","    Gets the current full URL.","","    @method _getURL","    @return {String} URL.","    @protected","    **/","    _getURL: function () {","        var url = Y.getLocation().toString();","","        if (!this._html5) {","            url = this._upgradeURL(url);","        }","","        return url;","    },","","    /**","    Returns `true` when the specified `url` is from the same origin as the","    current URL; i.e., the protocol, host, and port of the URLs are the same.","","    All host or path relative URLs are of the same origin. A scheme-relative URL","    is first prefixed with the current scheme before being evaluated.","","    @method _hasSameOrigin","    @param {String} url URL to compare origin with the current URL.","    @return {Boolean} Whether the URL has the same origin of the current URL.","    @protected","    **/","    _hasSameOrigin: function (url) {","        var origin = ((url && url.match(this._regexUrlOrigin)) || [])[0];","","        // Prepend current scheme to scheme-relative URLs.","        if (origin && origin.indexOf('//') === 0) {","            origin = Y.getLocation().protocol + origin;","        }","","        return !origin || origin === this._getOrigin();","    },","","    /**","    Joins the `root` URL to the specified _url_, normalizing leading/trailing","    `/` characters.","","    @example","        router.set('root', '/foo');","        router._joinURL('bar');  // => '/foo/bar'","        router._joinURL('/bar'); // => '/foo/bar'","","        router.set('root', '/foo/');","        router._joinURL('bar');  // => '/foo/bar'","        router._joinURL('/bar'); // => '/foo/bar'","","    @method _joinURL","    @param {String} url URL to append to the `root` URL.","    @return {String} Joined URL.","    @protected","    **/","    _joinURL: function (url) {","        var root = this.get('root');","","        // Causes `url` to _always_ begin with a \"/\".","        url = this.removeRoot(url);","","        if (url.charAt(0) === '/') {","            url = url.substring(1);","        }","","        return root && root.charAt(root.length - 1) === '/' ?","                root + url :","                root + '/' + url;","    },","","    /**","    Returns a normalized path, ridding it of any '..' segments and properly","    handling leading and trailing slashes.","","    @method _normalizePath","    @param {String} path URL path to normalize.","    @return {String} Normalized path.","    @protected","    @since 3.5.0","    **/","    _normalizePath: function (path) {","        var dots  = '..',","            slash = '/',","            i, len, normalized, segments, segment, stack;","","        if (!path || path === slash) {","            return slash;","        }","","        segments = path.split(slash);","        stack    = [];","","        for (i = 0, len = segments.length; i < len; ++i) {","            segment = segments[i];","","            if (segment === dots) {","                stack.pop();","            } else if (segment) {","                stack.push(segment);","            }","        }","","        normalized = slash + stack.join(slash);","","        // Append trailing slash if necessary.","        if (normalized !== slash && path.charAt(path.length - 1) === slash) {","            normalized += slash;","        }","","        return normalized;","    },","","    /**","    Parses a URL query string into a key/value hash. If `Y.QueryString.parse` is","    available, this method will be an alias to that.","","    @method _parseQuery","    @param {String} query Query string to parse.","    @return {Object} Hash of key/value pairs for query parameters.","    @protected","    **/","    _parseQuery: QS && QS.parse ? QS.parse : function (query) {","        var decode = this._decode,","            params = query.split('&'),","            i      = 0,","            len    = params.length,","            result = {},","            param;","","        for (; i < len; ++i) {","            param = params[i].split('=');","","            if (param[0]) {","                result[decode(param[0])] = decode(param[1] || '');","            }","        }","","        return result;","    },","","    /**","    Queues up a `_save()` call to run after all previously-queued calls have","    finished.","","    This is necessary because if we make multiple `_save()` calls before the","    first call gets dispatched, then both calls will dispatch to the last call's","    URL.","","    All arguments passed to `_queue()` will be passed on to `_save()` when the","    queued function is executed.","","    @method _queue","    @chainable","    @see _dequeue","    @protected","    **/","    _queue: function () {","        var args = arguments,","            self = this;","","        saveQueue.push(function () {","            if (self._html5) {","                if (Y.UA.ios && Y.UA.ios < 5) {","                    // iOS <5 has buggy HTML5 history support, and needs to be","                    // synchronous.","                    self._save.apply(self, args);","                } else {","                    // Wrapped in a timeout to ensure that _save() calls are","                    // always processed asynchronously. This ensures consistency","                    // between HTML5- and hash-based history.","                    setTimeout(function () {","                        self._save.apply(self, args);","                    }, 1);","                }","            } else {","                self._dispatching = true; // otherwise we'll dequeue too quickly","                self._save.apply(self, args);","            }","","            return self;","        });","","        return !this._dispatching ? this._dequeue() : this;","    },","","    /**","    Returns the normalized result of resolving the `path` against the current","    path. Falsy values for `path` will return just the current path.","","    @method _resolvePath","    @param {String} path URL path to resolve.","    @return {String} Resolved path.","    @protected","    @since 3.5.0","    **/","    _resolvePath: function (path) {","        if (!path) {","            return Y.getLocation().pathname;","        }","","        if (path.charAt(0) !== '/') {","            path = this._getPathRoot() + path;","        }","","        return this._normalizePath(path);","    },","","    /**","    Resolves the specified URL against the current URL.","","    This method resolves URLs like a browser does and will always return an","    absolute URL. When the specified URL is already absolute, it is assumed to","    be fully resolved and is simply returned as is. Scheme-relative URLs are","    prefixed with the current protocol. Relative URLs are giving the current","    URL's origin and are resolved and normalized against the current path root.","","    @method _resolveURL","    @param {String} url URL to resolve.","    @return {String} Resolved URL.","    @protected","    @since 3.5.0","    **/","    _resolveURL: function (url) {","        var parts    = url && url.match(this._regexURL),","            origin, path, query, hash, resolved;","","        if (!parts) {","            return Y.getLocation().toString();","        }","","        origin = parts[1];","        path   = parts[2];","        query  = parts[3];","        hash   = parts[4];","","        // Absolute and scheme-relative URLs are assumed to be fully-resolved.","        if (origin) {","            // Prepend the current scheme for scheme-relative URLs.","            if (origin.indexOf('//') === 0) {","                origin = Y.getLocation().protocol + origin;","            }","","            return origin + (path || '/') + (query || '') + (hash || '');","        }","","        // Will default to the current origin and current path.","        resolved = this._getOrigin() + this._resolvePath(path);","","        // A path or query for the specified URL trumps the current URL's.","        if (path || query) {","            return resolved + (query || '') + (hash || '');","        }","","        query = this._getQuery();","","        return resolved + (query ? ('?' + query) : '') + (hash || '');","    },","","    /**","    Saves a history entry using either `pushState()` or the location hash.","","    This method enforces the same-origin security constraint; attempting to save","    a `url` that is not from the same origin as the current URL will result in","    an error.","","    @method _save","    @param {String} [url] URL for the history entry.","    @param {Boolean} [replace=false] If `true`, the current history entry will","      be replaced instead of a new one being added.","    @chainable","    @protected","    **/","    _save: function (url, replace) {","        var urlIsString = typeof url === 'string',","            currentPath, root;","","        // Perform same-origin check on the specified URL.","        if (urlIsString && !this._hasSameOrigin(url)) {","            Y.error('Security error: The new URL must be of the same origin as the current URL.');","            return this;","        }","","        // Joins the `url` with the `root`.","        urlIsString && (url = this._joinURL(url));","","        // Force _ready to true to ensure that the history change is handled","        // even if _save is called before the `ready` event fires.","        this._ready = true;","","        if (this._html5) {","            this._history[replace ? 'replace' : 'add'](null, {url: url});","        } else {","            currentPath = Y.getLocation().pathname;","            root        = this.get('root');","","            // Determine if the `root` already exists in the current location's","            // `pathname`, and if it does then we can exclude it from the","            // hash-based path. No need to duplicate the info in the URL.","            if (root === currentPath || root === this._getPathRoot()) {","                url = this.removeRoot(url);","            }","","            // The `hashchange` event only fires when the new hash is actually","            // different. This makes sure we'll always dequeue and dispatch","            // _all_ router instances, mimicking the HTML5 behavior.","            if (url === HistoryHash.getHash()) {","                Y.Router.dispatch();","            } else {","                HistoryHash[replace ? 'replaceHash' : 'setHash'](url);","            }","        }","","        return this;","    },","","    /**","    Setter for the `routes` attribute.","","    @method _setRoutes","    @param {Object[]} routes Array of route objects.","    @return {Object[]} Array of route objects.","    @protected","    **/","    _setRoutes: function (routes) {","        this._routes = [];","","        YArray.each(routes, function (route) {","            // Makes sure to check `callback` for back-compat.","            var callbacks = route.callbacks || route.callback;","","            this.route(route.path, callbacks);","        }, this);","","        return this._routes.concat();","    },","","    /**","    Upgrades a hash-based URL to a full-path URL, if necessary.","","    The specified `url` will be upgraded if its of the same origin as the","    current URL and has a path-like hash. URLs that don't need upgrading will be","    returned as-is.","","    @example","        app._upgradeURL('http://example.com/#/foo/'); // => 'http://example.com/foo/';","","    @method _upgradeURL","    @param {String} url The URL to upgrade from hash-based to full-path.","    @return {String} The upgraded URL, or the specified URL untouched.","    @protected","    @since 3.5.0","    **/","    _upgradeURL: function (url) {","        // We should not try to upgrade paths for external URLs.","        if (!this._hasSameOrigin(url)) {","            return url;","        }","","        var hash       = (url.match(/#(.*)$/) || [])[1] || '',","            hashPrefix = Y.HistoryHash.hashPrefix,","            hashPath;","","        // Strip any hash prefix, like hash-bangs.","        if (hashPrefix && hash.indexOf(hashPrefix) === 0) {","            hash = hash.replace(hashPrefix, '');","        }","","        hash && (hashPath = this._getHashPath(hash));","","        // If the hash looks like a URL path, assume it is, and upgrade it!","        if (hashPath) {","            return this._resolveURL(hashPath);","        }","","        return url;","    },","","    // -- Protected Event Handlers ---------------------------------------------","","    /**","    Handles `history:change` and `hashchange` events.","","    @method _afterHistoryChange","    @param {EventFacade} e","    @protected","    **/","    _afterHistoryChange: function (e) {","        var self       = this,","            src        = e.src,","            prevURL    = self._url,","            currentURL = self._getURL();","","        self._url = currentURL;","","        // Handles the awkwardness that is the `popstate` event. HTML5 browsers","        // fire `popstate` right before they fire `hashchange`, and Chrome fires","        // `popstate` on page load. If this router is not ready or the previous","        // and current URLs only differ by their hash, then we want to ignore","        // this `popstate` event.","        if (src === 'popstate' &&","                (!self._ready || prevURL.replace(/#.*$/, '') === currentURL.replace(/#.*$/, ''))) {","","            return;","        }","","        self._dispatch(self._getPath(), currentURL, src);","    },","","    // -- Default Event Handlers -----------------------------------------------","","    /**","    Default handler for the `ready` event.","","    @method _defReadyFn","    @param {EventFacade} e","    @protected","    **/","    _defReadyFn: function (e) {","        this._ready = true;","    }","}, {","    // -- Static Properties ----------------------------------------------------","    NAME: 'router',","","    ATTRS: {","        /**","        Whether or not this browser is capable of using HTML5 history.","","        Setting this to `false` will force the use of hash-based history even on","        HTML5 browsers, but please don't do this unless you understand the","        consequences.","","        @attribute html5","        @type Boolean","        @initOnly","        **/","        html5: {","            // Android versions lower than 3.0 are buggy and don't update","            // window.location after a pushState() call, so we fall back to","            // hash-based history for them.","            //","            // See http://code.google.com/p/android/issues/detail?id=17471","            valueFn: function () { return Y.Router.html5; },","            writeOnce: 'initOnly'","        },","","        /**","        Absolute root path from which all routes should be evaluated.","","        For example, if your router is running on a page at","        `http://example.com/myapp/` and you add a route with the path `/`, your","        route will never execute, because the path will always be preceded by","        `/myapp`. Setting `root` to `/myapp` would cause all routes to be","        evaluated relative to that root URL, so the `/` route would then execute","        when the user browses to `http://example.com/myapp/`.","","        @attribute root","        @type String","        @default `''`","        **/","        root: {","            value: ''","        },","","        /**","        Array of route objects.","","        Each item in the array must be an object with the following properties:","","          * `path`: String or regex representing the path to match. See the docs","            for the `route()` method for more details.","","          * `callbacks`: Function or a string representing the name of a","            function on this router instance that should be called when the","            route is triggered. An array of functions and/or strings may also be","            provided. See the docs for the `route()` method for more details.","","        This attribute is intended to be used to set routes at init time, or to","        completely reset all routes after init. To add routes after init without","        resetting all existing routes, use the `route()` method.","","        @attribute routes","        @type Object[]","        @default `[]`","        @see route","        **/","        routes: {","            value : [],","            getter: '_getRoutes',","            setter: '_setRoutes'","        }","    },","","    // Used as the default value for the `html5` attribute, and for testing.","    html5: Y.HistoryBase.html5 && (!Y.UA.android || Y.UA.android >= 3),","","    // To make this testable.","    _instances: instances,","","    /**","    Dispatches to the first route handler that matches the specified `path` for","    all active router instances.","","    This provides a mechanism to cause all active router instances to dispatch","    to their route handlers without needing to change the URL or fire the","    `history:change` or `hashchange` event.","","    @method dispatch","    @static","    @since 3.6.0","    **/","    dispatch: function () {","        var i, len, router;","","        for (i = 0, len = instances.length; i < len; i += 1) {","            router = instances[i];","","            if (router) {","                router._dispatch(router._getPath(), router._getURL());","            }","        }","    }","});","","/**","The `Controller` class was deprecated in YUI 3.5.0 and is now an alias for the","`Router` class. Use that class instead. This alias will be removed in a future","version of YUI.","","@class Controller","@constructor","@extends Base","@deprecated Use `Router` instead.","@see Router","**/","Y.Controller = Y.Router;","","","}, '3.7.3', {\"optional\": [\"querystring-parse\"], \"requires\": [\"array-extras\", \"base-build\", \"history\"]});"];
_yuitest_coverage["build/router/router.js"].lines = {"1":0,"11":0,"60":0,"61":0,"64":0,"152":0,"154":0,"155":0,"156":0,"159":0,"163":0,"164":0,"165":0,"168":0,"176":0,"182":0,"183":0,"184":0,"185":0,"191":0,"195":0,"198":0,"199":0,"202":0,"218":0,"219":0,"221":0,"222":0,"224":0,"228":0,"238":0,"255":0,"257":0,"258":0,"261":0,"262":0,"265":0,"267":0,"301":0,"302":0,"315":0,"319":0,"321":0,"322":0,"325":0,"337":0,"371":0,"481":0,"483":0,"485":0,"495":0,"529":0,"540":0,"541":0,"545":0,"547":0,"552":0,"553":0,"556":0,"559":0,"574":0,"587":0,"593":0,"594":0,"595":0,"598":0,"601":0,"602":0,"620":0,"625":0,"627":0,"628":0,"629":0,"632":0,"633":0,"635":0,"636":0,"638":0,"641":0,"642":0,"643":0,"645":0,"648":0,"649":0,"650":0,"654":0,"656":0,"658":0,"660":0,"661":0,"665":0,"666":0,"668":0,"672":0,"675":0,"679":0,"681":0,"682":0,"696":0,"699":0,"700":0,"703":0,"717":0,"718":0,"729":0,"732":0,"747":0,"751":0,"752":0,"755":0,"756":0,"758":0,"769":0,"772":0,"773":0,"776":0,"777":0,"779":0,"794":0,"795":0,"799":0,"800":0,"803":0,"806":0,"807":0,"810":0,"811":0,"814":0,"828":0,"847":0,"848":0,"851":0,"852":0,"863":0,"874":0,"876":0,"877":0,"880":0,"896":0,"899":0,"900":0,"903":0,"925":0,"928":0,"930":0,"931":0,"934":0,"950":0,"954":0,"955":0,"958":0,"959":0,"961":0,"962":0,"964":0,"965":0,"966":0,"967":0,"971":0,"974":0,"975":0,"978":0,"991":0,"998":0,"999":0,"1001":0,"1002":0,"1006":0,"1026":0,"1029":0,"1030":0,"1031":0,"1034":0,"1039":0,"1040":0,"1044":0,"1045":0,"1048":0,"1051":0,"1065":0,"1066":0,"1069":0,"1070":0,"1073":0,"1092":0,"1095":0,"1096":0,"1099":0,"1100":0,"1101":0,"1102":0,"1105":0,"1107":0,"1108":0,"1111":0,"1115":0,"1118":0,"1119":0,"1122":0,"1124":0,"1142":0,"1146":0,"1147":0,"1148":0,"1152":0,"1156":0,"1158":0,"1159":0,"1161":0,"1162":0,"1167":0,"1168":0,"1174":0,"1175":0,"1177":0,"1181":0,"1193":0,"1195":0,"1197":0,"1199":0,"1202":0,"1223":0,"1224":0,"1227":0,"1232":0,"1233":0,"1236":0,"1239":0,"1240":0,"1243":0,"1256":0,"1261":0,"1268":0,"1271":0,"1274":0,"1287":0,"1311":0,"1381":0,"1383":0,"1384":0,"1386":0,"1387":0,"1404":0};
_yuitest_coverage["build/router/router.js"].functions = {"Router:60":0,"(anonymous 4):184":0,"(anonymous 3):183":0,"(anonymous 2):182":0,"initializer:151":0,"destructor:194":0,"(anonymous 5):218":0,"dispatch:217":0,"getPath:237":0,"hasRoute:254":0,"(anonymous 6):301":0,"match:300":0,"removeRoot:314":0,"removeQuery:336":0,"replace:370":0,"route:480":0,"save:528":0,"(anonymous 7):552":0,"upgrade:539":0,"_decode:573":0,"(anonymous 8):594":0,"_dequeue:586":0,"next:635":0,"_dispatch:619":0,"_getHashPath:695":0,"_getOrigin:716":0,"_getPath:728":0,"_getPathRoot:746":0,"_getQuery:768":0,"(anonymous 9):803":0,"_getRegex:793":0,"_getRequest:827":0,"res:847":0,"_getResponse:844":0,"_getRoutes:862":0,"_getURL:873":0,"_hasSameOrigin:895":0,"_joinURL:924":0,"_normalizePath:949":0,"parse:990":0,"(anonymous 11):1039":0,"(anonymous 10):1029":0,"_queue:1025":0,"_resolvePath:1064":0,"_resolveURL:1091":0,"_save:1141":0,"(anonymous 12):1195":0,"_setRoutes:1192":0,"_upgradeURL:1221":0,"_afterHistoryChange:1255":0,"_defReadyFn:1286":0,"valueFn:1311":0,"dispatch:1380":0,"(anonymous 1):1":0};
_yuitest_coverage["build/router/router.js"].coveredLines = 243;
_yuitest_coverage["build/router/router.js"].coveredFunctions = 54;
_yuitest_coverline("build/router/router.js", 1);
YUI.add('router', function (Y, NAME) {

/**
Provides URL-based routing using HTML5 `pushState()` or the location hash.

@module app
@submodule router
@since 3.4.0
**/

_yuitest_coverfunc("build/router/router.js", "(anonymous 1)", 1);
_yuitest_coverline("build/router/router.js", 11);
var HistoryHash = Y.HistoryHash,
    QS          = Y.QueryString,
    YArray      = Y.Array,
    YLang       = Y.Lang,

    win = Y.config.win,

    // Holds all the active router instances. This supports the static
    // `dispatch()` method which causes all routers to dispatch.
    instances = [],

    // We have to queue up pushState calls to avoid race conditions, since the
    // popstate event doesn't actually provide any info on what URL it's
    // associated with.
    saveQueue = [],

    /**
    Fired when the router is ready to begin dispatching to route handlers.

    You shouldn't need to wait for this event unless you plan to implement some
    kind of custom dispatching logic. It's used internally in order to avoid
    dispatching to an initial route if a browser history change occurs first.

    @event ready
    @param {Boolean} dispatched `true` if routes have already been dispatched
      (most likely due to a history change).
    @fireOnce
    **/
    EVT_READY = 'ready';

/**
Provides URL-based routing using HTML5 `pushState()` or the location hash.

This makes it easy to wire up route handlers for different application states
while providing full back/forward navigation support and bookmarkable, shareable
URLs.

@class Router
@param {Object} [config] Config properties.
    @param {Boolean} [config.html5] Overrides the default capability detection
        and forces this router to use (`true`) or not use (`false`) HTML5
        history.
    @param {String} [config.root=''] Root path from which all routes should be
        evaluated.
    @param {Array} [config.routes=[]] Array of route definition objects.
@constructor
@extends Base
@since 3.4.0
**/
_yuitest_coverline("build/router/router.js", 60);
function Router() {
    _yuitest_coverfunc("build/router/router.js", "Router", 60);
_yuitest_coverline("build/router/router.js", 61);
Router.superclass.constructor.apply(this, arguments);
}

_yuitest_coverline("build/router/router.js", 64);
Y.Router = Y.extend(Router, Y.Base, {
    // -- Protected Properties -------------------------------------------------

    /**
    Whether or not `_dispatch()` has been called since this router was
    instantiated.

    @property _dispatched
    @type Boolean
    @default undefined
    @protected
    **/

    /**
    Whether or not we're currently in the process of dispatching to routes.

    @property _dispatching
    @type Boolean
    @default undefined
    @protected
    **/

    /**
    History event handle for the `history:change` or `hashchange` event
    subscription.

    @property _historyEvents
    @type EventHandle
    @protected
    **/

    /**
    Cached copy of the `html5` attribute for internal use.

    @property _html5
    @type Boolean
    @protected
    **/

    /**
    Whether or not the `ready` event has fired yet.

    @property _ready
    @type Boolean
    @default undefined
    @protected
    **/

    /**
    Regex used to match parameter placeholders in route paths.

    Subpattern captures:

      1. Parameter prefix character. Either a `:` for subpath parameters that
         should only match a single level of a path, or `*` for splat parameters
         that should match any number of path levels.

      2. Parameter name, if specified, otherwise it is a wildcard match.

    @property _regexPathParam
    @type RegExp
    @protected
    **/
    _regexPathParam: /([:*])([\w\-]+)?/g,

    /**
    Regex that matches and captures the query portion of a URL, minus the
    preceding `?` character, and discarding the hash portion of the URL if any.

    @property _regexUrlQuery
    @type RegExp
    @protected
    **/
    _regexUrlQuery: /\?([^#]*).*$/,

    /**
    Regex that matches everything before the path portion of a URL (the origin).
    This will be used to strip this part of the URL from a string when we
    only want the path.

    @property _regexUrlOrigin
    @type RegExp
    @protected
    **/
    _regexUrlOrigin: /^(?:[^\/#?:]+:\/\/|\/\/)[^\/]*/,

    // -- Lifecycle Methods ----------------------------------------------------
    initializer: function (config) {
        _yuitest_coverfunc("build/router/router.js", "initializer", 151);
_yuitest_coverline("build/router/router.js", 152);
var self = this;

        _yuitest_coverline("build/router/router.js", 154);
self._html5  = self.get('html5');
        _yuitest_coverline("build/router/router.js", 155);
self._routes = [];
        _yuitest_coverline("build/router/router.js", 156);
self._url    = self._getURL();

        // Necessary because setters don't run on init.
        _yuitest_coverline("build/router/router.js", 159);
self._setRoutes(config && config.routes ? config.routes :
                self.get('routes'));

        // Set up a history instance or hashchange listener.
        _yuitest_coverline("build/router/router.js", 163);
if (self._html5) {
            _yuitest_coverline("build/router/router.js", 164);
self._history       = new Y.HistoryHTML5({force: true});
            _yuitest_coverline("build/router/router.js", 165);
self._historyEvents =
                    Y.after('history:change', self._afterHistoryChange, self);
        } else {
            _yuitest_coverline("build/router/router.js", 168);
self._historyEvents =
                    Y.on('hashchange', self._afterHistoryChange, win, self);
        }

        // Fire a `ready` event once we're ready to route. We wait first for all
        // subclass initializers to finish, then for window.onload, and then an
        // additional 20ms to allow the browser to fire a useless initial
        // `popstate` event if it wants to (and Chrome always wants to).
        _yuitest_coverline("build/router/router.js", 176);
self.publish(EVT_READY, {
            defaultFn  : self._defReadyFn,
            fireOnce   : true,
            preventable: false
        });

        _yuitest_coverline("build/router/router.js", 182);
self.once('initializedChange', function () {
            _yuitest_coverfunc("build/router/router.js", "(anonymous 2)", 182);
_yuitest_coverline("build/router/router.js", 183);
Y.once('load', function () {
                _yuitest_coverfunc("build/router/router.js", "(anonymous 3)", 183);
_yuitest_coverline("build/router/router.js", 184);
setTimeout(function () {
                    _yuitest_coverfunc("build/router/router.js", "(anonymous 4)", 184);
_yuitest_coverline("build/router/router.js", 185);
self.fire(EVT_READY, {dispatched: !!self._dispatched});
                }, 20);
            });
        });

        // Store this router in the collection of all active router instances.
        _yuitest_coverline("build/router/router.js", 191);
instances.push(this);
    },

    destructor: function () {
        _yuitest_coverfunc("build/router/router.js", "destructor", 194);
_yuitest_coverline("build/router/router.js", 195);
var instanceIndex = YArray.indexOf(instances, this);

        // Remove this router from the collection of active router instances.
        _yuitest_coverline("build/router/router.js", 198);
if (instanceIndex > -1) {
            _yuitest_coverline("build/router/router.js", 199);
instances.splice(instanceIndex, 1);
        }

        _yuitest_coverline("build/router/router.js", 202);
this._historyEvents && this._historyEvents.detach();
    },

    // -- Public Methods -------------------------------------------------------

    /**
    Dispatches to the first route handler that matches the current URL, if any.

    If `dispatch()` is called before the `ready` event has fired, it will
    automatically wait for the `ready` event before dispatching. Otherwise it
    will dispatch immediately.

    @method dispatch
    @chainable
    **/
    dispatch: function () {
        _yuitest_coverfunc("build/router/router.js", "dispatch", 217);
_yuitest_coverline("build/router/router.js", 218);
this.once(EVT_READY, function () {
            _yuitest_coverfunc("build/router/router.js", "(anonymous 5)", 218);
_yuitest_coverline("build/router/router.js", 219);
this._ready = true;

            _yuitest_coverline("build/router/router.js", 221);
if (this._html5 && this.upgrade()) {
                _yuitest_coverline("build/router/router.js", 222);
return;
            } else {
                _yuitest_coverline("build/router/router.js", 224);
this._dispatch(this._getPath(), this._getURL());
            }
        });

        _yuitest_coverline("build/router/router.js", 228);
return this;
    },

    /**
    Gets the current route path, relative to the `root` (if any).

    @method getPath
    @return {String} Current route path.
    **/
    getPath: function () {
        _yuitest_coverfunc("build/router/router.js", "getPath", 237);
_yuitest_coverline("build/router/router.js", 238);
return this._getPath();
    },

    /**
    Returns `true` if this router has at least one route that matches the
    specified URL, `false` otherwise.

    This method enforces the same-origin security constraint on the specified
    `url`; any URL which is not from the same origin as the current URL will
    always return `false`.

    @method hasRoute
    @param {String} url URL to match.
    @return {Boolean} `true` if there's at least one matching route, `false`
      otherwise.
    **/
    hasRoute: function (url) {
        _yuitest_coverfunc("build/router/router.js", "hasRoute", 254);
_yuitest_coverline("build/router/router.js", 255);
var path;

        _yuitest_coverline("build/router/router.js", 257);
if (!this._hasSameOrigin(url)) {
            _yuitest_coverline("build/router/router.js", 258);
return false;
        }

        _yuitest_coverline("build/router/router.js", 261);
if (!this._html5) {
            _yuitest_coverline("build/router/router.js", 262);
url = this._upgradeURL(url);
        }

        _yuitest_coverline("build/router/router.js", 265);
path = this.removeQuery(this.removeRoot(url));

        _yuitest_coverline("build/router/router.js", 267);
return !!this.match(path).length;
    },

    /**
    Returns an array of route objects that match the specified URL path.

    This method is called internally to determine which routes match the current
    path whenever the URL changes. You may override it if you want to customize
    the route matching logic, although this usually shouldn't be necessary.

    Each returned route object has the following properties:

      * `callback`: A function or a string representing the name of a function
        this router that should be executed when the route is triggered.

      * `keys`: An array of strings representing the named parameters defined in
        the route's path specification, if any.

      * `path`: The route's path specification, which may be either a string or
        a regex.

      * `regex`: A regular expression version of the route's path specification.
        This regex is used to determine whether the route matches a given path.

    @example
        router.route('/foo', function () {});
        router.match('/foo');
        // => [{callback: ..., keys: [], path: '/foo', regex: ...}]

    @method match
    @param {String} path URL path to match.
    @return {Object[]} Array of route objects that match the specified path.
    **/
    match: function (path) {
        _yuitest_coverfunc("build/router/router.js", "match", 300);
_yuitest_coverline("build/router/router.js", 301);
return YArray.filter(this._routes, function (route) {
            _yuitest_coverfunc("build/router/router.js", "(anonymous 6)", 301);
_yuitest_coverline("build/router/router.js", 302);
return path.search(route.regex) > -1;
        });
    },

    /**
    Removes the `root` URL from the front of _url_ (if it's there) and returns
    the result. The returned path will always have a leading `/`.

    @method removeRoot
    @param {String} url URL.
    @return {String} Rootless path.
    **/
    removeRoot: function (url) {
        _yuitest_coverfunc("build/router/router.js", "removeRoot", 314);
_yuitest_coverline("build/router/router.js", 315);
var root = this.get('root');

        // Strip out the non-path part of the URL, if any (e.g.
        // "http://foo.com"), so that we're left with just the path.
        _yuitest_coverline("build/router/router.js", 319);
url = url.replace(this._regexUrlOrigin, '');

        _yuitest_coverline("build/router/router.js", 321);
if (root && url.indexOf(root) === 0) {
            _yuitest_coverline("build/router/router.js", 322);
url = url.substring(root.length);
        }

        _yuitest_coverline("build/router/router.js", 325);
return url.charAt(0) === '/' ? url : '/' + url;
    },

    /**
    Removes a query string from the end of the _url_ (if one exists) and returns
    the result.

    @method removeQuery
    @param {String} url URL.
    @return {String} Queryless path.
    **/
    removeQuery: function (url) {
        _yuitest_coverfunc("build/router/router.js", "removeQuery", 336);
_yuitest_coverline("build/router/router.js", 337);
return url.replace(/\?.*$/, '');
    },

    /**
    Replaces the current browser history entry with a new one, and dispatches to
    the first matching route handler, if any.

    Behind the scenes, this method uses HTML5 `pushState()` in browsers that
    support it (or the location hash in older browsers and IE) to change the
    URL.

    The specified URL must share the same origin (i.e., protocol, host, and
    port) as the current page, or an error will occur.

    @example
        // Starting URL: http://example.com/

        router.replace('/path/');
        // New URL: http://example.com/path/

        router.replace('/path?foo=bar');
        // New URL: http://example.com/path?foo=bar

        router.replace('/');
        // New URL: http://example.com/

    @method replace
    @param {String} [url] URL to set. This URL needs to be of the same origin as
      the current URL. This can be a URL relative to the router's `root`
      attribute. If no URL is specified, the page's current URL will be used.
    @chainable
    @see save()
    **/
    replace: function (url) {
        _yuitest_coverfunc("build/router/router.js", "replace", 370);
_yuitest_coverline("build/router/router.js", 371);
return this._queue(url, true);
    },

    /**
    Adds a route handler for the specified URL _path_.

    The _path_ parameter may be either a string or a regular expression. If it's
    a string, it may contain named parameters: `:param` will match any single
    part of a URL path (not including `/` characters), and `*param` will match
    any number of parts of a URL path (including `/` characters). These named
    parameters will be made available as keys on the `req.params` object that's
    passed to route handlers.

    If the _path_ parameter is a regex, all pattern matches will be made
    available as numbered keys on `req.params`, starting with `0` for the full
    match, then `1` for the first subpattern match, and so on.

    Here's a set of sample routes along with URL paths that they match:

      * Route: `/photos/:tag/:page`
        * URL: `/photos/kittens/1`, params: `{tag: 'kittens', page: '1'}`
        * URL: `/photos/puppies/2`, params: `{tag: 'puppies', page: '2'}`

      * Route: `/file/*path`
        * URL: `/file/foo/bar/baz.txt`, params: `{path: 'foo/bar/baz.txt'}`
        * URL: `/file/foo`, params: `{path: 'foo'}`

    **Middleware**: Routes also support an arbitrary number of callback
    functions. This allows you to easily reuse parts of your route-handling code
    with different route. This method is liberal in how it processes the
    specified `callbacks`, you can specify them as separate arguments, or as
    arrays, or both.

    If multiple route match a given URL, they will be executed in the order they
    were added. The first route that was added will be the first to be executed.

    **Passing Control**: Invoking the `next()` function within a route callback
    will pass control to the next callback function (if any) or route handler
    (if any). If a value is passed to `next()`, it's assumed to be an error,
    therefore stopping the dispatch chain, unless that value is: `"route"`,
    which is special case and dispatching will skip to the next route handler.
    This allows middleware to skip any remaining middleware for a particular
    route.

    @example
        router.route('/photos/:tag/:page', function (req, res, next) {
        });

        // Using middleware.

        router.findUser = function (req, res, next) {
            req.user = this.get('users').findById(req.params.user);
            next();
        };

        router.route('/users/:user', 'findUser', function (req, res, next) {
            // The `findUser` middleware puts the `user` object on the `req`.
        });

    @method route
    @param {String|RegExp} path Path to match. May be a string or a regular
      expression.
    @param {Array|Function|String} callbacks* Callback functions to call
        whenever this route is triggered. These can be specified as separate
        arguments, or in arrays, or both. If a callback is specified as a
        string, the named function will be called on this router instance.

      @param {Object} callbacks.req Request object containing information about
          the request. It contains the following properties.

        @param {Array|Object} callbacks.req.params Captured parameters matched by
          the route path specification. If a string path was used and contained
          named parameters, then this will be a key/value hash mapping parameter
          names to their matched values. If a regex path was used, this will be
          an array of subpattern matches starting at index 0 for the full match,
          then 1 for the first subpattern match, and so on.
        @param {String} callbacks.req.path The current URL path.
        @param {Number} callbacks.req.pendingCallbacks Number of remaining
          callbacks the route handler has after this one in the dispatch chain.
        @param {Number} callbacks.req.pendingRoutes Number of matching routes
          after this one in the dispatch chain.
        @param {Object} callbacks.req.query Query hash representing the URL
          query string, if any. Parameter names are keys, and are mapped to
          parameter values.
        @param {String} callbacks.req.url The full URL.
        @param {String} callbacks.req.src What initiated the dispatch. In an
          HTML5 browser, when the back/forward buttons are used, this property
          will have a value of "popstate".

      @param {Object} callbacks.res Response object containing methods and
          information that relate to responding to a request. It contains the
          following properties.
        @param {Object} callbacks.res.req Reference to the request object.

      @param {Function} callbacks.next Function to pass control to the next
          callback or the next matching route if no more callbacks (middleware)
          exist for the current route handler. If you don't call this function,
          then no further callbacks or route handlers will be executed, even if
          there are more that match. If you do call this function, then the next
          callback (if any) or matching route handler (if any) will be called.
          All of these functions will receive the same `req` and `res` objects
          that were passed to this route (so you can use these objects to pass
          data along to subsequent callbacks and routes).
        @param {String} [callbacks.next.err] Optional error which will stop the
          dispatch chaining for this `req`, unless the value is `"route"`, which
          is special cased to jump skip past any callbacks for the current route
          and pass control the next route handler.
    @chainable
    **/
    route: function (path, callbacks) {
        _yuitest_coverfunc("build/router/router.js", "route", 480);
_yuitest_coverline("build/router/router.js", 481);
callbacks = YArray.flatten(YArray(arguments, 1, true));

        _yuitest_coverline("build/router/router.js", 483);
var keys = [];

        _yuitest_coverline("build/router/router.js", 485);
this._routes.push({
            callbacks: callbacks,
            keys     : keys,
            path     : path,
            regex    : this._getRegex(path, keys),

            // For back-compat.
            callback: callbacks[0]
        });

        _yuitest_coverline("build/router/router.js", 495);
return this;
    },

    /**
    Saves a new browser history entry and dispatches to the first matching route
    handler, if any.

    Behind the scenes, this method uses HTML5 `pushState()` in browsers that
    support it (or the location hash in older browsers and IE) to change the
    URL and create a history entry.

    The specified URL must share the same origin (i.e., protocol, host, and
    port) as the current page, or an error will occur.

    @example
        // Starting URL: http://example.com/

        router.save('/path/');
        // New URL: http://example.com/path/

        router.save('/path?foo=bar');
        // New URL: http://example.com/path?foo=bar

        router.save('/');
        // New URL: http://example.com/

    @method save
    @param {String} [url] URL to set. This URL needs to be of the same origin as
      the current URL. This can be a URL relative to the router's `root`
      attribute. If no URL is specified, the page's current URL will be used.
    @chainable
    @see replace()
    **/
    save: function (url) {
        _yuitest_coverfunc("build/router/router.js", "save", 528);
_yuitest_coverline("build/router/router.js", 529);
return this._queue(url);
    },

    /**
    Upgrades a hash-based URL to an HTML5 URL if necessary. In non-HTML5
    browsers, this method is a noop.

    @method upgrade
    @return {Boolean} `true` if the URL was upgraded, `false` otherwise.
    **/
    upgrade: function () {
        _yuitest_coverfunc("build/router/router.js", "upgrade", 539);
_yuitest_coverline("build/router/router.js", 540);
if (!this._html5) {
            _yuitest_coverline("build/router/router.js", 541);
return false;
        }

        // Get the resolve hash path.
        _yuitest_coverline("build/router/router.js", 545);
var hashPath = this._getHashPath();

        _yuitest_coverline("build/router/router.js", 547);
if (hashPath) {
            // This is an HTML5 browser and we have a hash-based path in the
            // URL, so we need to upgrade the URL to a non-hash URL. This
            // will trigger a `history:change` event, which will in turn
            // trigger a dispatch.
            _yuitest_coverline("build/router/router.js", 552);
this.once(EVT_READY, function () {
                _yuitest_coverfunc("build/router/router.js", "(anonymous 7)", 552);
_yuitest_coverline("build/router/router.js", 553);
this.replace(hashPath);
            });

            _yuitest_coverline("build/router/router.js", 556);
return true;
        }

        _yuitest_coverline("build/router/router.js", 559);
return false;
    },

    // -- Protected Methods ----------------------------------------------------

    /**
    Wrapper around `decodeURIComponent` that also converts `+` chars into
    spaces.

    @method _decode
    @param {String} string String to decode.
    @return {String} Decoded string.
    @protected
    **/
    _decode: function (string) {
        _yuitest_coverfunc("build/router/router.js", "_decode", 573);
_yuitest_coverline("build/router/router.js", 574);
return decodeURIComponent(string.replace(/\+/g, ' '));
    },

    /**
    Shifts the topmost `_save()` call off the queue and executes it. Does
    nothing if the queue is empty.

    @method _dequeue
    @chainable
    @see _queue
    @protected
    **/
    _dequeue: function () {
        _yuitest_coverfunc("build/router/router.js", "_dequeue", 586);
_yuitest_coverline("build/router/router.js", 587);
var self = this,
            fn;

        // If window.onload hasn't yet fired, wait until it has before
        // dequeueing. This will ensure that we don't call pushState() before an
        // initial popstate event has fired.
        _yuitest_coverline("build/router/router.js", 593);
if (!YUI.Env.windowLoaded) {
            _yuitest_coverline("build/router/router.js", 594);
Y.once('load', function () {
                _yuitest_coverfunc("build/router/router.js", "(anonymous 8)", 594);
_yuitest_coverline("build/router/router.js", 595);
self._dequeue();
            });

            _yuitest_coverline("build/router/router.js", 598);
return this;
        }

        _yuitest_coverline("build/router/router.js", 601);
fn = saveQueue.shift();
        _yuitest_coverline("build/router/router.js", 602);
return fn ? fn() : this;
    },

    /**
    Dispatches to the first route handler that matches the specified _path_.

    If called before the `ready` event has fired, the dispatch will be aborted.
    This ensures normalized behavior between Chrome (which fires a `popstate`
    event on every pageview) and other browsers (which do not).

    @method _dispatch
    @param {String} path URL path.
    @param {String} url Full URL.
    @param {String} src What initiated the dispatch.
    @chainable
    @protected
    **/
    _dispatch: function (path, url, src) {
        _yuitest_coverfunc("build/router/router.js", "_dispatch", 619);
_yuitest_coverline("build/router/router.js", 620);
var self      = this,
            routes    = self.match(path),
            callbacks = [],
            matches, req, res;

        _yuitest_coverline("build/router/router.js", 625);
self._dispatching = self._dispatched = true;

        _yuitest_coverline("build/router/router.js", 627);
if (!routes || !routes.length) {
            _yuitest_coverline("build/router/router.js", 628);
self._dispatching = false;
            _yuitest_coverline("build/router/router.js", 629);
return self;
        }

        _yuitest_coverline("build/router/router.js", 632);
req = self._getRequest(path, url, src);
        _yuitest_coverline("build/router/router.js", 633);
res = self._getResponse(req);

        _yuitest_coverline("build/router/router.js", 635);
req.next = function (err) {
            _yuitest_coverfunc("build/router/router.js", "next", 635);
_yuitest_coverline("build/router/router.js", 636);
var callback, route;

            _yuitest_coverline("build/router/router.js", 638);
if (err) {
                // Special case "route" to skip to the next route handler
                // avoiding any additional callbacks for the current route.
                _yuitest_coverline("build/router/router.js", 641);
if (err === 'route') {
                    _yuitest_coverline("build/router/router.js", 642);
callbacks = [];
                    _yuitest_coverline("build/router/router.js", 643);
req.next();
                } else {
                    _yuitest_coverline("build/router/router.js", 645);
Y.error(err);
                }

            } else {_yuitest_coverline("build/router/router.js", 648);
if ((callback = callbacks.shift())) {
                _yuitest_coverline("build/router/router.js", 649);
if (typeof callback === 'string') {
                    _yuitest_coverline("build/router/router.js", 650);
callback = self[callback];
                }

                // Allow access to the num or remaining callbacks for the route.
                _yuitest_coverline("build/router/router.js", 654);
req.pendingCallbacks = callbacks.length;

                _yuitest_coverline("build/router/router.js", 656);
callback.call(self, req, res, req.next);

            } else {_yuitest_coverline("build/router/router.js", 658);
if ((route = routes.shift())) {
                // Make a copy of this route's `callbacks` and find its matches.
                _yuitest_coverline("build/router/router.js", 660);
callbacks = route.callbacks.concat();
                _yuitest_coverline("build/router/router.js", 661);
matches   = route.regex.exec(path);

                // Use named keys for parameter names if the route path contains
                // named keys. Otherwise, use numerical match indices.
                _yuitest_coverline("build/router/router.js", 665);
if (matches.length === route.keys.length + 1) {
                    _yuitest_coverline("build/router/router.js", 666);
req.params = YArray.hash(route.keys, matches.slice(1));
                } else {
                    _yuitest_coverline("build/router/router.js", 668);
req.params = matches.concat();
                }

                // Allow access tot he num of remaining routes for this request.
                _yuitest_coverline("build/router/router.js", 672);
req.pendingRoutes = routes.length;

                // Execute this route's `callbacks`.
                _yuitest_coverline("build/router/router.js", 675);
req.next();
            }}}
        };

        _yuitest_coverline("build/router/router.js", 679);
req.next();

        _yuitest_coverline("build/router/router.js", 681);
self._dispatching = false;
        _yuitest_coverline("build/router/router.js", 682);
return self._dequeue();
    },

    /**
    Returns the resolved path from the hash fragment, or an empty string if the
    hash is not path-like.

    @method _getHashPath
    @param {String} [hash] Hash fragment to resolve into a path. By default this
        will be the hash from the current URL.
    @return {String} Current hash path, or an empty string if the hash is empty.
    @protected
    **/
    _getHashPath: function (hash) {
        _yuitest_coverfunc("build/router/router.js", "_getHashPath", 695);
_yuitest_coverline("build/router/router.js", 696);
hash || (hash = HistoryHash.getHash());

        // Make sure the `hash` is path-like.
        _yuitest_coverline("build/router/router.js", 699);
if (hash && hash.charAt(0) === '/') {
            _yuitest_coverline("build/router/router.js", 700);
return this._joinURL(hash);
        }

        _yuitest_coverline("build/router/router.js", 703);
return '';
    },

    /**
    Gets the location origin (i.e., protocol, host, and port) as a URL.

    @example
        http://example.com

    @method _getOrigin
    @return {String} Location origin (i.e., protocol, host, and port).
    @protected
    **/
    _getOrigin: function () {
        _yuitest_coverfunc("build/router/router.js", "_getOrigin", 716);
_yuitest_coverline("build/router/router.js", 717);
var location = Y.getLocation();
        _yuitest_coverline("build/router/router.js", 718);
return location.origin || (location.protocol + '//' + location.host);
    },

    /**
    Gets the current route path, relative to the `root` (if any).

    @method _getPath
    @return {String} Current route path.
    @protected
    **/
    _getPath: function () {
        _yuitest_coverfunc("build/router/router.js", "_getPath", 728);
_yuitest_coverline("build/router/router.js", 729);
var path = (!this._html5 && this._getHashPath()) ||
                Y.getLocation().pathname;

        _yuitest_coverline("build/router/router.js", 732);
return this.removeQuery(this.removeRoot(path));
    },

    /**
    Returns the current path root after popping off the last path segment,
    making it useful for resolving other URL paths against.

    The path root will always begin and end with a '/'.

    @method _getPathRoot
    @return {String} The URL's path root.
    @protected
    @since 3.5.0
    **/
    _getPathRoot: function () {
        _yuitest_coverfunc("build/router/router.js", "_getPathRoot", 746);
_yuitest_coverline("build/router/router.js", 747);
var slash = '/',
            path  = Y.getLocation().pathname,
            segments;

        _yuitest_coverline("build/router/router.js", 751);
if (path.charAt(path.length - 1) === slash) {
            _yuitest_coverline("build/router/router.js", 752);
return path;
        }

        _yuitest_coverline("build/router/router.js", 755);
segments = path.split(slash);
        _yuitest_coverline("build/router/router.js", 756);
segments.pop();

        _yuitest_coverline("build/router/router.js", 758);
return segments.join(slash) + slash;
    },

    /**
    Gets the current route query string.

    @method _getQuery
    @return {String} Current route query string.
    @protected
    **/
    _getQuery: function () {
        _yuitest_coverfunc("build/router/router.js", "_getQuery", 768);
_yuitest_coverline("build/router/router.js", 769);
var location = Y.getLocation(),
            hash, matches;

        _yuitest_coverline("build/router/router.js", 772);
if (this._html5) {
            _yuitest_coverline("build/router/router.js", 773);
return location.search.substring(1);
        }

        _yuitest_coverline("build/router/router.js", 776);
hash    = HistoryHash.getHash();
        _yuitest_coverline("build/router/router.js", 777);
matches = hash.match(this._regexUrlQuery);

        _yuitest_coverline("build/router/router.js", 779);
return hash && matches ? matches[1] : location.search.substring(1);
    },

    /**
    Creates a regular expression from the given route specification. If _path_
    is already a regex, it will be returned unmodified.

    @method _getRegex
    @param {String|RegExp} path Route path specification.
    @param {Array} keys Array reference to which route parameter names will be
      added.
    @return {RegExp} Route regex.
    @protected
    **/
    _getRegex: function (path, keys) {
        _yuitest_coverfunc("build/router/router.js", "_getRegex", 793);
_yuitest_coverline("build/router/router.js", 794);
if (path instanceof RegExp) {
            _yuitest_coverline("build/router/router.js", 795);
return path;
        }

        // Special case for catchall paths.
        _yuitest_coverline("build/router/router.js", 799);
if (path === '*') {
            _yuitest_coverline("build/router/router.js", 800);
return (/.*/);
        }

        _yuitest_coverline("build/router/router.js", 803);
path = path.replace(this._regexPathParam, function (match, operator, key) {
            // Only `*` operators are supported for key-less matches to allowing
            // in-path wildcards like: '/foo/*'.
            _yuitest_coverfunc("build/router/router.js", "(anonymous 9)", 803);
_yuitest_coverline("build/router/router.js", 806);
if (!key) {
                _yuitest_coverline("build/router/router.js", 807);
return operator === '*' ? '.*' : match;
            }

            _yuitest_coverline("build/router/router.js", 810);
keys.push(key);
            _yuitest_coverline("build/router/router.js", 811);
return operator === '*' ? '(.*?)' : '([^/#?]*)';
        });

        _yuitest_coverline("build/router/router.js", 814);
return new RegExp('^' + path + '$');
    },

    /**
    Gets a request object that can be passed to a route handler.

    @method _getRequest
    @param {String} path Current path being dispatched.
    @param {String} url Current full URL being dispatched.
    @param {String} src What initiated the dispatch.
    @return {Object} Request object.
    @protected
    **/
    _getRequest: function (path, url, src) {
        _yuitest_coverfunc("build/router/router.js", "_getRequest", 827);
_yuitest_coverline("build/router/router.js", 828);
return {
            path : path,
            query: this._parseQuery(this._getQuery()),
            url  : url,
            src  : src
        };
    },

    /**
    Gets a response object that can be passed to a route handler.

    @method _getResponse
    @param {Object} req Request object.
    @return {Object} Response Object.
    @protected
    **/
    _getResponse: function (req) {
        // For backwards compatibility, the response object is a function that
        // calls `next()` on the request object and returns the result.
        _yuitest_coverfunc("build/router/router.js", "_getResponse", 844);
_yuitest_coverline("build/router/router.js", 847);
var res = function () {
            _yuitest_coverfunc("build/router/router.js", "res", 847);
_yuitest_coverline("build/router/router.js", 848);
return req.next.apply(this, arguments);
        };

        _yuitest_coverline("build/router/router.js", 851);
res.req = req;
        _yuitest_coverline("build/router/router.js", 852);
return res;
    },

    /**
    Getter for the `routes` attribute.

    @method _getRoutes
    @return {Object[]} Array of route objects.
    @protected
    **/
    _getRoutes: function () {
        _yuitest_coverfunc("build/router/router.js", "_getRoutes", 862);
_yuitest_coverline("build/router/router.js", 863);
return this._routes.concat();
    },

    /**
    Gets the current full URL.

    @method _getURL
    @return {String} URL.
    @protected
    **/
    _getURL: function () {
        _yuitest_coverfunc("build/router/router.js", "_getURL", 873);
_yuitest_coverline("build/router/router.js", 874);
var url = Y.getLocation().toString();

        _yuitest_coverline("build/router/router.js", 876);
if (!this._html5) {
            _yuitest_coverline("build/router/router.js", 877);
url = this._upgradeURL(url);
        }

        _yuitest_coverline("build/router/router.js", 880);
return url;
    },

    /**
    Returns `true` when the specified `url` is from the same origin as the
    current URL; i.e., the protocol, host, and port of the URLs are the same.

    All host or path relative URLs are of the same origin. A scheme-relative URL
    is first prefixed with the current scheme before being evaluated.

    @method _hasSameOrigin
    @param {String} url URL to compare origin with the current URL.
    @return {Boolean} Whether the URL has the same origin of the current URL.
    @protected
    **/
    _hasSameOrigin: function (url) {
        _yuitest_coverfunc("build/router/router.js", "_hasSameOrigin", 895);
_yuitest_coverline("build/router/router.js", 896);
var origin = ((url && url.match(this._regexUrlOrigin)) || [])[0];

        // Prepend current scheme to scheme-relative URLs.
        _yuitest_coverline("build/router/router.js", 899);
if (origin && origin.indexOf('//') === 0) {
            _yuitest_coverline("build/router/router.js", 900);
origin = Y.getLocation().protocol + origin;
        }

        _yuitest_coverline("build/router/router.js", 903);
return !origin || origin === this._getOrigin();
    },

    /**
    Joins the `root` URL to the specified _url_, normalizing leading/trailing
    `/` characters.

    @example
        router.set('root', '/foo');
        router._joinURL('bar');  // => '/foo/bar'
        router._joinURL('/bar'); // => '/foo/bar'

        router.set('root', '/foo/');
        router._joinURL('bar');  // => '/foo/bar'
        router._joinURL('/bar'); // => '/foo/bar'

    @method _joinURL
    @param {String} url URL to append to the `root` URL.
    @return {String} Joined URL.
    @protected
    **/
    _joinURL: function (url) {
        _yuitest_coverfunc("build/router/router.js", "_joinURL", 924);
_yuitest_coverline("build/router/router.js", 925);
var root = this.get('root');

        // Causes `url` to _always_ begin with a "/".
        _yuitest_coverline("build/router/router.js", 928);
url = this.removeRoot(url);

        _yuitest_coverline("build/router/router.js", 930);
if (url.charAt(0) === '/') {
            _yuitest_coverline("build/router/router.js", 931);
url = url.substring(1);
        }

        _yuitest_coverline("build/router/router.js", 934);
return root && root.charAt(root.length - 1) === '/' ?
                root + url :
                root + '/' + url;
    },

    /**
    Returns a normalized path, ridding it of any '..' segments and properly
    handling leading and trailing slashes.

    @method _normalizePath
    @param {String} path URL path to normalize.
    @return {String} Normalized path.
    @protected
    @since 3.5.0
    **/
    _normalizePath: function (path) {
        _yuitest_coverfunc("build/router/router.js", "_normalizePath", 949);
_yuitest_coverline("build/router/router.js", 950);
var dots  = '..',
            slash = '/',
            i, len, normalized, segments, segment, stack;

        _yuitest_coverline("build/router/router.js", 954);
if (!path || path === slash) {
            _yuitest_coverline("build/router/router.js", 955);
return slash;
        }

        _yuitest_coverline("build/router/router.js", 958);
segments = path.split(slash);
        _yuitest_coverline("build/router/router.js", 959);
stack    = [];

        _yuitest_coverline("build/router/router.js", 961);
for (i = 0, len = segments.length; i < len; ++i) {
            _yuitest_coverline("build/router/router.js", 962);
segment = segments[i];

            _yuitest_coverline("build/router/router.js", 964);
if (segment === dots) {
                _yuitest_coverline("build/router/router.js", 965);
stack.pop();
            } else {_yuitest_coverline("build/router/router.js", 966);
if (segment) {
                _yuitest_coverline("build/router/router.js", 967);
stack.push(segment);
            }}
        }

        _yuitest_coverline("build/router/router.js", 971);
normalized = slash + stack.join(slash);

        // Append trailing slash if necessary.
        _yuitest_coverline("build/router/router.js", 974);
if (normalized !== slash && path.charAt(path.length - 1) === slash) {
            _yuitest_coverline("build/router/router.js", 975);
normalized += slash;
        }

        _yuitest_coverline("build/router/router.js", 978);
return normalized;
    },

    /**
    Parses a URL query string into a key/value hash. If `Y.QueryString.parse` is
    available, this method will be an alias to that.

    @method _parseQuery
    @param {String} query Query string to parse.
    @return {Object} Hash of key/value pairs for query parameters.
    @protected
    **/
    _parseQuery: QS && QS.parse ? QS.parse : function (query) {
        _yuitest_coverfunc("build/router/router.js", "parse", 990);
_yuitest_coverline("build/router/router.js", 991);
var decode = this._decode,
            params = query.split('&'),
            i      = 0,
            len    = params.length,
            result = {},
            param;

        _yuitest_coverline("build/router/router.js", 998);
for (; i < len; ++i) {
            _yuitest_coverline("build/router/router.js", 999);
param = params[i].split('=');

            _yuitest_coverline("build/router/router.js", 1001);
if (param[0]) {
                _yuitest_coverline("build/router/router.js", 1002);
result[decode(param[0])] = decode(param[1] || '');
            }
        }

        _yuitest_coverline("build/router/router.js", 1006);
return result;
    },

    /**
    Queues up a `_save()` call to run after all previously-queued calls have
    finished.

    This is necessary because if we make multiple `_save()` calls before the
    first call gets dispatched, then both calls will dispatch to the last call's
    URL.

    All arguments passed to `_queue()` will be passed on to `_save()` when the
    queued function is executed.

    @method _queue
    @chainable
    @see _dequeue
    @protected
    **/
    _queue: function () {
        _yuitest_coverfunc("build/router/router.js", "_queue", 1025);
_yuitest_coverline("build/router/router.js", 1026);
var args = arguments,
            self = this;

        _yuitest_coverline("build/router/router.js", 1029);
saveQueue.push(function () {
            _yuitest_coverfunc("build/router/router.js", "(anonymous 10)", 1029);
_yuitest_coverline("build/router/router.js", 1030);
if (self._html5) {
                _yuitest_coverline("build/router/router.js", 1031);
if (Y.UA.ios && Y.UA.ios < 5) {
                    // iOS <5 has buggy HTML5 history support, and needs to be
                    // synchronous.
                    _yuitest_coverline("build/router/router.js", 1034);
self._save.apply(self, args);
                } else {
                    // Wrapped in a timeout to ensure that _save() calls are
                    // always processed asynchronously. This ensures consistency
                    // between HTML5- and hash-based history.
                    _yuitest_coverline("build/router/router.js", 1039);
setTimeout(function () {
                        _yuitest_coverfunc("build/router/router.js", "(anonymous 11)", 1039);
_yuitest_coverline("build/router/router.js", 1040);
self._save.apply(self, args);
                    }, 1);
                }
            } else {
                _yuitest_coverline("build/router/router.js", 1044);
self._dispatching = true; // otherwise we'll dequeue too quickly
                _yuitest_coverline("build/router/router.js", 1045);
self._save.apply(self, args);
            }

            _yuitest_coverline("build/router/router.js", 1048);
return self;
        });

        _yuitest_coverline("build/router/router.js", 1051);
return !this._dispatching ? this._dequeue() : this;
    },

    /**
    Returns the normalized result of resolving the `path` against the current
    path. Falsy values for `path` will return just the current path.

    @method _resolvePath
    @param {String} path URL path to resolve.
    @return {String} Resolved path.
    @protected
    @since 3.5.0
    **/
    _resolvePath: function (path) {
        _yuitest_coverfunc("build/router/router.js", "_resolvePath", 1064);
_yuitest_coverline("build/router/router.js", 1065);
if (!path) {
            _yuitest_coverline("build/router/router.js", 1066);
return Y.getLocation().pathname;
        }

        _yuitest_coverline("build/router/router.js", 1069);
if (path.charAt(0) !== '/') {
            _yuitest_coverline("build/router/router.js", 1070);
path = this._getPathRoot() + path;
        }

        _yuitest_coverline("build/router/router.js", 1073);
return this._normalizePath(path);
    },

    /**
    Resolves the specified URL against the current URL.

    This method resolves URLs like a browser does and will always return an
    absolute URL. When the specified URL is already absolute, it is assumed to
    be fully resolved and is simply returned as is. Scheme-relative URLs are
    prefixed with the current protocol. Relative URLs are giving the current
    URL's origin and are resolved and normalized against the current path root.

    @method _resolveURL
    @param {String} url URL to resolve.
    @return {String} Resolved URL.
    @protected
    @since 3.5.0
    **/
    _resolveURL: function (url) {
        _yuitest_coverfunc("build/router/router.js", "_resolveURL", 1091);
_yuitest_coverline("build/router/router.js", 1092);
var parts    = url && url.match(this._regexURL),
            origin, path, query, hash, resolved;

        _yuitest_coverline("build/router/router.js", 1095);
if (!parts) {
            _yuitest_coverline("build/router/router.js", 1096);
return Y.getLocation().toString();
        }

        _yuitest_coverline("build/router/router.js", 1099);
origin = parts[1];
        _yuitest_coverline("build/router/router.js", 1100);
path   = parts[2];
        _yuitest_coverline("build/router/router.js", 1101);
query  = parts[3];
        _yuitest_coverline("build/router/router.js", 1102);
hash   = parts[4];

        // Absolute and scheme-relative URLs are assumed to be fully-resolved.
        _yuitest_coverline("build/router/router.js", 1105);
if (origin) {
            // Prepend the current scheme for scheme-relative URLs.
            _yuitest_coverline("build/router/router.js", 1107);
if (origin.indexOf('//') === 0) {
                _yuitest_coverline("build/router/router.js", 1108);
origin = Y.getLocation().protocol + origin;
            }

            _yuitest_coverline("build/router/router.js", 1111);
return origin + (path || '/') + (query || '') + (hash || '');
        }

        // Will default to the current origin and current path.
        _yuitest_coverline("build/router/router.js", 1115);
resolved = this._getOrigin() + this._resolvePath(path);

        // A path or query for the specified URL trumps the current URL's.
        _yuitest_coverline("build/router/router.js", 1118);
if (path || query) {
            _yuitest_coverline("build/router/router.js", 1119);
return resolved + (query || '') + (hash || '');
        }

        _yuitest_coverline("build/router/router.js", 1122);
query = this._getQuery();

        _yuitest_coverline("build/router/router.js", 1124);
return resolved + (query ? ('?' + query) : '') + (hash || '');
    },

    /**
    Saves a history entry using either `pushState()` or the location hash.

    This method enforces the same-origin security constraint; attempting to save
    a `url` that is not from the same origin as the current URL will result in
    an error.

    @method _save
    @param {String} [url] URL for the history entry.
    @param {Boolean} [replace=false] If `true`, the current history entry will
      be replaced instead of a new one being added.
    @chainable
    @protected
    **/
    _save: function (url, replace) {
        _yuitest_coverfunc("build/router/router.js", "_save", 1141);
_yuitest_coverline("build/router/router.js", 1142);
var urlIsString = typeof url === 'string',
            currentPath, root;

        // Perform same-origin check on the specified URL.
        _yuitest_coverline("build/router/router.js", 1146);
if (urlIsString && !this._hasSameOrigin(url)) {
            _yuitest_coverline("build/router/router.js", 1147);
Y.error('Security error: The new URL must be of the same origin as the current URL.');
            _yuitest_coverline("build/router/router.js", 1148);
return this;
        }

        // Joins the `url` with the `root`.
        _yuitest_coverline("build/router/router.js", 1152);
urlIsString && (url = this._joinURL(url));

        // Force _ready to true to ensure that the history change is handled
        // even if _save is called before the `ready` event fires.
        _yuitest_coverline("build/router/router.js", 1156);
this._ready = true;

        _yuitest_coverline("build/router/router.js", 1158);
if (this._html5) {
            _yuitest_coverline("build/router/router.js", 1159);
this._history[replace ? 'replace' : 'add'](null, {url: url});
        } else {
            _yuitest_coverline("build/router/router.js", 1161);
currentPath = Y.getLocation().pathname;
            _yuitest_coverline("build/router/router.js", 1162);
root        = this.get('root');

            // Determine if the `root` already exists in the current location's
            // `pathname`, and if it does then we can exclude it from the
            // hash-based path. No need to duplicate the info in the URL.
            _yuitest_coverline("build/router/router.js", 1167);
if (root === currentPath || root === this._getPathRoot()) {
                _yuitest_coverline("build/router/router.js", 1168);
url = this.removeRoot(url);
            }

            // The `hashchange` event only fires when the new hash is actually
            // different. This makes sure we'll always dequeue and dispatch
            // _all_ router instances, mimicking the HTML5 behavior.
            _yuitest_coverline("build/router/router.js", 1174);
if (url === HistoryHash.getHash()) {
                _yuitest_coverline("build/router/router.js", 1175);
Y.Router.dispatch();
            } else {
                _yuitest_coverline("build/router/router.js", 1177);
HistoryHash[replace ? 'replaceHash' : 'setHash'](url);
            }
        }

        _yuitest_coverline("build/router/router.js", 1181);
return this;
    },

    /**
    Setter for the `routes` attribute.

    @method _setRoutes
    @param {Object[]} routes Array of route objects.
    @return {Object[]} Array of route objects.
    @protected
    **/
    _setRoutes: function (routes) {
        _yuitest_coverfunc("build/router/router.js", "_setRoutes", 1192);
_yuitest_coverline("build/router/router.js", 1193);
this._routes = [];

        _yuitest_coverline("build/router/router.js", 1195);
YArray.each(routes, function (route) {
            // Makes sure to check `callback` for back-compat.
            _yuitest_coverfunc("build/router/router.js", "(anonymous 12)", 1195);
_yuitest_coverline("build/router/router.js", 1197);
var callbacks = route.callbacks || route.callback;

            _yuitest_coverline("build/router/router.js", 1199);
this.route(route.path, callbacks);
        }, this);

        _yuitest_coverline("build/router/router.js", 1202);
return this._routes.concat();
    },

    /**
    Upgrades a hash-based URL to a full-path URL, if necessary.

    The specified `url` will be upgraded if its of the same origin as the
    current URL and has a path-like hash. URLs that don't need upgrading will be
    returned as-is.

    @example
        app._upgradeURL('http://example.com/#/foo/'); // => 'http://example.com/foo/';

    @method _upgradeURL
    @param {String} url The URL to upgrade from hash-based to full-path.
    @return {String} The upgraded URL, or the specified URL untouched.
    @protected
    @since 3.5.0
    **/
    _upgradeURL: function (url) {
        // We should not try to upgrade paths for external URLs.
        _yuitest_coverfunc("build/router/router.js", "_upgradeURL", 1221);
_yuitest_coverline("build/router/router.js", 1223);
if (!this._hasSameOrigin(url)) {
            _yuitest_coverline("build/router/router.js", 1224);
return url;
        }

        _yuitest_coverline("build/router/router.js", 1227);
var hash       = (url.match(/#(.*)$/) || [])[1] || '',
            hashPrefix = Y.HistoryHash.hashPrefix,
            hashPath;

        // Strip any hash prefix, like hash-bangs.
        _yuitest_coverline("build/router/router.js", 1232);
if (hashPrefix && hash.indexOf(hashPrefix) === 0) {
            _yuitest_coverline("build/router/router.js", 1233);
hash = hash.replace(hashPrefix, '');
        }

        _yuitest_coverline("build/router/router.js", 1236);
hash && (hashPath = this._getHashPath(hash));

        // If the hash looks like a URL path, assume it is, and upgrade it!
        _yuitest_coverline("build/router/router.js", 1239);
if (hashPath) {
            _yuitest_coverline("build/router/router.js", 1240);
return this._resolveURL(hashPath);
        }

        _yuitest_coverline("build/router/router.js", 1243);
return url;
    },

    // -- Protected Event Handlers ---------------------------------------------

    /**
    Handles `history:change` and `hashchange` events.

    @method _afterHistoryChange
    @param {EventFacade} e
    @protected
    **/
    _afterHistoryChange: function (e) {
        _yuitest_coverfunc("build/router/router.js", "_afterHistoryChange", 1255);
_yuitest_coverline("build/router/router.js", 1256);
var self       = this,
            src        = e.src,
            prevURL    = self._url,
            currentURL = self._getURL();

        _yuitest_coverline("build/router/router.js", 1261);
self._url = currentURL;

        // Handles the awkwardness that is the `popstate` event. HTML5 browsers
        // fire `popstate` right before they fire `hashchange`, and Chrome fires
        // `popstate` on page load. If this router is not ready or the previous
        // and current URLs only differ by their hash, then we want to ignore
        // this `popstate` event.
        _yuitest_coverline("build/router/router.js", 1268);
if (src === 'popstate' &&
                (!self._ready || prevURL.replace(/#.*$/, '') === currentURL.replace(/#.*$/, ''))) {

            _yuitest_coverline("build/router/router.js", 1271);
return;
        }

        _yuitest_coverline("build/router/router.js", 1274);
self._dispatch(self._getPath(), currentURL, src);
    },

    // -- Default Event Handlers -----------------------------------------------

    /**
    Default handler for the `ready` event.

    @method _defReadyFn
    @param {EventFacade} e
    @protected
    **/
    _defReadyFn: function (e) {
        _yuitest_coverfunc("build/router/router.js", "_defReadyFn", 1286);
_yuitest_coverline("build/router/router.js", 1287);
this._ready = true;
    }
}, {
    // -- Static Properties ----------------------------------------------------
    NAME: 'router',

    ATTRS: {
        /**
        Whether or not this browser is capable of using HTML5 history.

        Setting this to `false` will force the use of hash-based history even on
        HTML5 browsers, but please don't do this unless you understand the
        consequences.

        @attribute html5
        @type Boolean
        @initOnly
        **/
        html5: {
            // Android versions lower than 3.0 are buggy and don't update
            // window.location after a pushState() call, so we fall back to
            // hash-based history for them.
            //
            // See http://code.google.com/p/android/issues/detail?id=17471
            valueFn: function () { _yuitest_coverfunc("build/router/router.js", "valueFn", 1311);
_yuitest_coverline("build/router/router.js", 1311);
return Y.Router.html5; },
            writeOnce: 'initOnly'
        },

        /**
        Absolute root path from which all routes should be evaluated.

        For example, if your router is running on a page at
        `http://example.com/myapp/` and you add a route with the path `/`, your
        route will never execute, because the path will always be preceded by
        `/myapp`. Setting `root` to `/myapp` would cause all routes to be
        evaluated relative to that root URL, so the `/` route would then execute
        when the user browses to `http://example.com/myapp/`.

        @attribute root
        @type String
        @default `''`
        **/
        root: {
            value: ''
        },

        /**
        Array of route objects.

        Each item in the array must be an object with the following properties:

          * `path`: String or regex representing the path to match. See the docs
            for the `route()` method for more details.

          * `callbacks`: Function or a string representing the name of a
            function on this router instance that should be called when the
            route is triggered. An array of functions and/or strings may also be
            provided. See the docs for the `route()` method for more details.

        This attribute is intended to be used to set routes at init time, or to
        completely reset all routes after init. To add routes after init without
        resetting all existing routes, use the `route()` method.

        @attribute routes
        @type Object[]
        @default `[]`
        @see route
        **/
        routes: {
            value : [],
            getter: '_getRoutes',
            setter: '_setRoutes'
        }
    },

    // Used as the default value for the `html5` attribute, and for testing.
    html5: Y.HistoryBase.html5 && (!Y.UA.android || Y.UA.android >= 3),

    // To make this testable.
    _instances: instances,

    /**
    Dispatches to the first route handler that matches the specified `path` for
    all active router instances.

    This provides a mechanism to cause all active router instances to dispatch
    to their route handlers without needing to change the URL or fire the
    `history:change` or `hashchange` event.

    @method dispatch
    @static
    @since 3.6.0
    **/
    dispatch: function () {
        _yuitest_coverfunc("build/router/router.js", "dispatch", 1380);
_yuitest_coverline("build/router/router.js", 1381);
var i, len, router;

        _yuitest_coverline("build/router/router.js", 1383);
for (i = 0, len = instances.length; i < len; i += 1) {
            _yuitest_coverline("build/router/router.js", 1384);
router = instances[i];

            _yuitest_coverline("build/router/router.js", 1386);
if (router) {
                _yuitest_coverline("build/router/router.js", 1387);
router._dispatch(router._getPath(), router._getURL());
            }
        }
    }
});

/**
The `Controller` class was deprecated in YUI 3.5.0 and is now an alias for the
`Router` class. Use that class instead. This alias will be removed in a future
version of YUI.

@class Controller
@constructor
@extends Base
@deprecated Use `Router` instead.
@see Router
**/
_yuitest_coverline("build/router/router.js", 1404);
Y.Controller = Y.Router;


}, '3.7.3', {"optional": ["querystring-parse"], "requires": ["array-extras", "base-build", "history"]});
