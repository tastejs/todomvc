/**
 * URLKit
 * A lightweight implementation of routing and URL manager
 * Automatic switch between html5 History API and IE's hashbang
 *
 * using AMD (Asynchronous Module Definition) API with OzJS
 * see http://ozjs.org for details
 *
 * Copyright (C) 2010-2012, Dexter.Yy, MIT License
 * vim: et:ts=4:sw=4:sts=4
 */
define("urlkit", [
   "mo/lang"
], function(_){

    var encode = encodeURIComponent,
        decode = decodeURIComponent,
        doc = document,
        _has_pushState,
        RE_URLROOT,
        RE_HASHBANG,
        RE_KVRULE = /([^&=\?]+)(=[^&=]*)/g,
        RE_GETHASH = /.+#!?\/?/,
        _default_config = {
            win: window,
            baseUrl: '/',
            autotidy: true
        },
        _default_nav_opt = {
            replace: false,
            route: true
        };

    function URLKit(opt){
        var self = this;
        this._route_config = [];
        this._hash_cache = false;
        this.handler = function(){
            var current_hash = self.getHash();
            if (current_hash === self._hash_cache) {
                return;
            }
            self._hash_cache = current_hash;
            if (self.autotidy) {
                tidy_url.call(self, self);
            }
            var succ = self.checkRules(current_hash, self._route_config);
            if (!succ) {
                self._defaultHandler.apply(self, parse(self.getHash()));
            }
        };
        this.set(opt);
    }

    URLKit.prototype = {

        set: function(opt){
            _.config(this, opt || {}, _default_config);
            var loc = this.location = this.win.location;
            var base = /^\//.test(this.baseUrl) && loc.protocol + '//' + loc.host
                || !/^http/.test(this.baseUrl) 
                    && loc.href.replace(/#.*/, '').replace(/[^\/]*$/, '') 
                || '';
            this.baseUrl = (base + this.baseUrl).replace(/\/$/, '');
            return this;
        },

        listen: function(){
            var w = this.win,
                docmode = doc.documentMode;
            if (_has_pushState) {
                w.addEventListener("popstate", this.handler, false);
                setTimeout(this.handler, 0);
            } else if ('onhashchange' in w  && (docmode === undefined || docmode > 7)) {
                if ('addEventListener' in w) {
                    w.addEventListener("hashchange", this.handler, false);
                } else {
                    w.attachEvent("onhashchange", this.handler);
                }
                setTimeout(this.handler, 0);
            } else {
                this.timer = setInterval(this.handler, 50);
            }
            return this;
        },

        stop: function(){
            this.win.removeEventListener("hashchange");
            clearInterval(this.timer);
            return this;
        },

        route: function(route, handler){
            if (route === "default") {
                this._defaultHandler = handler;
            } else {
                this._route_config.push([route, handler]);
            }
            return this;
        },

        nav: function(name, value, opt){
            var params, data, n,
                isMuti = typeof name === 'object',
                loc = this.location,
                loc_hash = this.getHash(),
                hash = parse(loc_hash);
            if (isMuti) {
                data = name;
                opt = value;
            } else {
                data = {};
                data[name] = value;
            }
            if (isMuti || value !== undefined) {
                params = hash[0];
                var isEmpty = true;
                for (var i in data) {
                    if (!data.hasOwnProperty(i)) {
                        continue;
                    }
                    isEmpty = false;
                    name = i;
                    value = data[i];
                    n = parseInt(name, 10);
                    if (n != name) {
                        if (false === value) {
                            delete params[name];
                        } else {
                            params[name] = value;
                        }
                    } else if (n >= 0) {
                        if (false === value) {
                            if (hash.length > n + 1) {
                                hash.length = n + 1;
                            }
                        } else {
                            hash[n + 1] = value;
                        }
                    }
                }
                if (isEmpty) {
                    return;
                }
                var hashstr;
                if (_has_pushState) {
                    hashstr = '/' + param(hash, { ending: true }) + loc.hash;
                } else {
                    hashstr = /#!?\/?/.exec(loc_hash)[0] + param(hash);
                }
                this.load(hashstr, opt);
            } else {
                n = parseInt(name, 10);
                if (n != name) {
                    var v = hash[0][name];
                    return v && decode(v);
                } else if (n >= 0) {
                    return hash[n + 1] && decode(hash[n + 1]);
                }
            }
        },

        load: function(url, opt){
            opt = _.config({}, opt || {}, _default_nav_opt);
            if (_has_pushState) {
                if (opt.replace) {
                    history.replaceState({}, doc.title, this.baseUrl + url);
                } else {
                    history.pushState({}, doc.title, this.baseUrl + url);
                }
                if (opt.route) {
                    setTimeout(this.handler, 0);
                } else {
                    this._hash_cache = url;
                }
            } else {
                var loc = this.location, base = '/';
                if (/^\//.test(url)) {
                    url = url.replace(/^\//, '');
                } else {
                    base = loc.href.replace(/#.*/, "");
                }
                if (!opt.route) {
                    this._hash_cache = url;
                }
                if (opt.replace) {
                    loc.replace(base + url);
                } else {
                    loc.href = base + url;
                }
            }
        },

        checkRules: function(url, rules){
            var succ;
            rules.forEach(function(args){
                if (!succ) {
                    succ = route_match.apply(this, [url].concat(args));
                }
            });
            return succ;
        },

        getBaseUrl: function(){
            return this.baseUrl;
        }

    };

    function route_match(url, route, handler){
        var rule = Array.isArray(route) ? route[0] : route;
        if (typeof rule === "object") {
            for (var r in route) {
                route_match(url, r, route[r]);
            }
        }
        if (typeof rule !== "string") {
            return false;
        }
        var re_route = (_has_pushState ? "^" : "^#!?") 
                        + (rule && rule.replace(/\/?$/, '/?').replace(/:\w+/g, '([^\/#\\?]+)') || "") + "(\\?.*|$)",
            args = url.match(new RegExp(re_route));
        if (!args) {
            if (url !== rule) {
                return rule !== route && route_match(url, route.slice(1), handler) || false;
            } else {
                args = [""];
            }
        }
        var params = {},
            kv = args.pop().replace(/^\?/, '').split(/&/);
        for (var i = 0, a, l = kv.length; i < l; i++) {
            a = kv[i].split("=");
            if (a[0]) {
                params[a[0]] = a[1];
            }
        }
        args[0] = params;
        handler.apply(this, args);
        return true;
    }

    /**
     * @return {array}  例如"http://10.0.2.172:9253/page/2/#!/page/1/?name=yy&no=3"
     *                  在ie10-里返回值为[{ "name": "yy", "no": "3" }, "page", "1"]
     *                  在支持pushState的浏览器里返回[{}, "page", "2"]
     */
    function parse(s){
        s = s.replace(RE_URLROOT, '').replace(RE_HASHBANG, '');
        if (!s)
            return [{}];
        s = s.split('/');
        var kv, p = {},
            o = s.pop(),
            prule = /\?.*/;
        if (o) {
            var end = o.replace(prule, '');
            if (/\=/.test(o)) {
                if (end && prule.test(o)) {
                    s.push(end);
                }
                while (kv = RE_KVRULE.exec(o)) {
                    p[kv[1]] = kv[2].substr(1);
                }
            } else {
                s.push(end);
                p = {};
            }
        } else {
            p = {};
        }
        s.unshift(p);
        return s;
    }

    function param(obj, opt){
        obj = Array.isArray(obj) ? obj.slice() : [obj];
        var s = obj.shift(), o = [];
        obj = obj.filter(function(a){ return a !== ""; });
        for (var k in s) {
            if (k) {
                o.push(encode(k) + '=' + encode(s[k]));
            }
        }
        var params = o.length ? '?' + o.join("&") : '';
        if (opt && opt.ending) {
            obj.push(params);
            return obj.join('/');
        } else {
            return obj.join('/') + params;
        }
    }

    function tidy_url(){
        var loc = this.location;
        if (_has_pushState) {
            if (/#/.test(loc.href)) {
                var hash_url = loc.href.replace(/.*?#/, '#');
                if (/#.*#/.test(hash_url)) {
                    hash_url = hash_url.replace(/(.*?#.*?)#.*/, '$1');
                }
                hash_url = hash_url.replace(/^\/?#!?\/?/, '/');
                if (this.checkRules(hash_url, this._route_config)) {
                    loc.replace(this.baseUrl + hash_url);
                } else {
                    loc.replace(loc.href.replace(/#.*/, ''));
                }
            }
        } else {
            var key_url = '#!' + get_key_url.apply(this);
            if (this.checkRules(key_url, this._route_config)) {
                this.load('/' + key_url, { replace: true });
            } else if (/#.*#/.test(loc.href)) {
                loc.replace(loc.href.replace(/(.*?#.*?)#.*/, '$1'));
            }
        }
    }

    function get_key_url(){
        return this.location.href.replace(this.baseUrl, '').replace(/#.*/, '');
    }

    function use_pushState(isEnable){
        _has_pushState = exports.SUPPORT_PUSHSTATE = isEnable;
        RE_URLROOT = _has_pushState ? /(https?:\/\/.+?|^)\// : /.*?(?=#|$)/;
        RE_HASHBANG = _has_pushState ? /#.*/ : /#!?\/?/;
        if (_has_pushState) {
            URLKit.prototype.getHash = get_key_url;
        } else {
            URLKit.prototype.getHash = function(){
                return (/#/.test(this.location.href)) ? this.location.href.replace(RE_GETHASH, '#!/') : '#!/';
            };
        }
    }

    function exports(opt){
        return new exports.URLKit(opt);
    }

    exports.URLKit = URLKit;

    exports.config = function(opt){
        if (opt.disablePushState) {
            use_pushState(false);
        }
    };

    exports.parse = parse;
    exports.param = param;
    exports.VERSION = '1.0.2';

    use_pushState(!!history.pushState);

    return exports;

});
