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
_yuitest_coverage["build/cache-offline/cache-offline.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/cache-offline/cache-offline.js",
    code: []
};
_yuitest_coverage["build/cache-offline/cache-offline.js"].code=["YUI.add('cache-offline', function (Y, NAME) {","","/**"," * Provides a Cache subclass which uses HTML5 `localStorage` for persistence."," * "," * @module cache"," * @submodule cache-offline"," */","","/**"," * Extends Cache utility with offline functionality."," * @class CacheOffline"," * @extends Cache"," * @constructor"," */","function CacheOffline() {","    CacheOffline.superclass.constructor.apply(this, arguments);","}","","var localStorage = null,","    JSON = Y.JSON;","","// Bug 2529572","try {","    localStorage = Y.config.win.localStorage;","}","catch(e) {","}","","/////////////////////////////////////////////////////////////////////////////","//","// CacheOffline events","//","/////////////////////////////////////////////////////////////////////////////","","/**","* @event error","* @description Fired when an entry could not be added, most likely due to","* exceeded browser quota.","* <dl>","* <dt>error (Object)</dt> <dd>The error object.</dd>","* </dl>","*/","","/////////////////////////////////////////////////////////////////////////////","//","// CacheOffline static","//","/////////////////////////////////////////////////////////////////////////////","Y.mix(CacheOffline, {","    /**","     * Class name.","     *","     * @property NAME","     * @type String","     * @static","     * @final","     * @value \"cacheOffline\"","     */","    NAME: \"cacheOffline\",","","    ATTRS: {","        /////////////////////////////////////////////////////////////////////////////","        //","        // CacheOffline Attributes","        //","        /////////////////////////////////////////////////////////////////////////////","","        /**","        * @attribute sandbox","        * @description A string that must be passed in via the constructor.","        * This identifier is used to sandbox one cache instance's entries","        * from another. Calling the cache instance's flush and length methods","        * or get(\"entries\") will apply to only these sandboxed entries.","        * @type String","        * @default \"default\"","        * @initOnly","        */","        sandbox: {","            value: \"default\",","            writeOnce: \"initOnly\"","        },","","        /**","        * @attribute expires","        * @description Absolute Date when data expires or","        * relative number of milliseconds. Zero disables expiration.","        * @type Date | Number","        * @default 86400000 (one day)","        */","        expires: {","            value: 86400000","        },","","        /**","        * @attribute max","        * @description Disabled.","        * @readOnly","        * @default null","        */","        max: {","            value: null,","            readOnly: true","        },","","        /**","        * @attribute uniqueKeys","        * @description Always true for CacheOffline.","        * @readOnly","        * @default true","        */","        uniqueKeys: {","            value: true,","            readOnly: true,","            setter: function() {","                return true;","            }","        }","    },","","    /**","     * Removes all items from all sandboxes. Useful if localStorage has","     * exceeded quota. Only supported on browsers that implement HTML 5","     * localStorage.","     *","     * @method flushAll","     * @static","     */","    flushAll: function() {","        var store = localStorage, key;","        if(store) {","            if(store.clear) {","                store.clear();","            }","            // FF2.x and FF3.0.x","            else {","                for (key in store) {","                    if (store.hasOwnProperty(key)) {","                        store.removeItem(key);","                        delete store[key];","                    }","                }","            }","        }","        else {","        }","    }","});","","Y.extend(CacheOffline, Y.Cache, localStorage ? {","/////////////////////////////////////////////////////////////////////////////","//","// Offline is supported","//","/////////////////////////////////////////////////////////////////////////////","","    /////////////////////////////////////////////////////////////////////////////","    //","    // CacheOffline protected methods","    //","    /////////////////////////////////////////////////////////////////////////////","    /**","     * Always return null.","     *","     * @method _setMax","     * @protected","     */","    _setMax: function(value) {","        return null;","    },","","    /**","     * Gets size.","     *","     * @method _getSize","     * @protected","     */","    _getSize: function() {","        var count = 0,","            i=0,","            l=localStorage.length;","        for(; i<l; ++i) {","            // Match sandbox id","            if(localStorage.key(i).indexOf(this.get(\"sandbox\")) === 0) {","                count++;","            }","        }","        return count;","    },","","    /**","     * Gets all entries.","     *","     * @method _getEntries","     * @protected","     */","    _getEntries: function() {","        var entries = [],","            i=0,","            l=localStorage.length,","            sandbox = this.get(\"sandbox\");","        for(; i<l; ++i) {","            // Match sandbox id","            if(localStorage.key(i).indexOf(sandbox) === 0) {","                entries[i] = JSON.parse(localStorage.key(i).substring(sandbox.length));","            }","        }","        return entries;","    },","","    /**","     * Adds entry to cache.","     *","     * @method _defAddFn","     * @param e {Event.Facade} Event Facade with the following properties:","     * <dl>","     * <dt>entry (Object)</dt> <dd>The cached entry.</dd>","     * </dl>","     * @protected","     */","    _defAddFn: function(e) {","        var entry = e.entry,","            request = entry.request,","            cached = entry.cached,","            expires = entry.expires;","","        // Convert Dates to msecs on the way into localStorage","        entry.cached = cached.getTime();","        entry.expires = expires ? expires.getTime() : expires;","","        try {","            localStorage.setItem(this.get(\"sandbox\")+JSON.stringify({\"request\":request}), JSON.stringify(entry));","        }","        catch(error) {","            this.fire(\"error\", {error:error});","        }","    },","","    /**","     * Flushes cache.","     *","     * @method _defFlushFn","     * @param e {Event.Facade} Event Facade object.","     * @protected","     */","    _defFlushFn: function(e) {","        var key,","            i=localStorage.length-1;","        for(; i>-1; --i) {","            // Match sandbox id","            key = localStorage.key(i);","            if(key.indexOf(this.get(\"sandbox\")) === 0) {","                localStorage.removeItem(key);","            }","        }","    },","","    /////////////////////////////////////////////////////////////////////////////","    //","    // CacheOffline public methods","    //","    /////////////////////////////////////////////////////////////////////////////","    /**","     * Adds a new entry to the cache of the format","     * {request:request, response:response, cached:cached, expires: expires}.","     *","     * @method add","     * @param request {Object} Request value must be a String or JSON.","     * @param response {Object} Response value must be a String or JSON.","     */","","    /**","     * Retrieves cached object for given request, if available.","     * Returns null if there is no cache match.","     *","     * @method retrieve","     * @param request {Object} Request object.","     * @return {Object} Cached object with the properties request, response,","     * and expires, or null.","     */","    retrieve: function(request) {","        this.fire(\"request\", {request: request});","","        var entry, expires, sandboxedrequest;","","        try {","            sandboxedrequest = this.get(\"sandbox\")+JSON.stringify({\"request\":request});","            try {","                entry = JSON.parse(localStorage.getItem(sandboxedrequest));","            }","            catch(e) {","            }","        }","        catch(e2) {","        }","","        if(entry) {","            // Convert msecs to Dates on the way out of localStorage","            entry.cached = new Date(entry.cached);","            expires = entry.expires;","            expires = !expires ? null : new Date(expires);","            entry.expires = expires;","","            if(this._isMatch(request, entry)) {","                this.fire(\"retrieve\", {entry: entry});","                return entry;","            }","        }","        return null;","    }","} :","/////////////////////////////////////////////////////////////////////////////","//","// Offline is not supported","//","/////////////////////////////////////////////////////////////////////////////","{","    /**","     * Always return null.","     *","     * @method _setMax","     * @protected","     */","    _setMax: function(value) {","        return null;","    }","});","","","Y.CacheOffline = CacheOffline;","","","}, '3.7.3', {\"requires\": [\"cache-base\", \"json\"]});"];
_yuitest_coverage["build/cache-offline/cache-offline.js"].lines = {"1":0,"16":0,"17":0,"20":0,"24":0,"25":0,"50":0,"116":0,"130":0,"131":0,"132":0,"133":0,"137":0,"138":0,"139":0,"140":0,"150":0,"169":0,"179":0,"182":0,"184":0,"185":0,"188":0,"198":0,"202":0,"204":0,"205":0,"208":0,"222":0,"228":0,"229":0,"231":0,"232":0,"235":0,"247":0,"249":0,"251":0,"252":0,"253":0,"282":0,"284":0,"286":0,"287":0,"288":0,"289":0,"297":0,"299":0,"300":0,"301":0,"302":0,"304":0,"305":0,"306":0,"309":0,"325":0,"330":0};
_yuitest_coverage["build/cache-offline/cache-offline.js"].functions = {"CacheOffline:16":0,"setter:115":0,"flushAll:129":0,"_setMax:168":0,"_getSize:178":0,"_getEntries:197":0,"_defAddFn:221":0,"_defFlushFn:246":0,"retrieve:281":0,"_setMax:324":0,"(anonymous 1):1":0};
_yuitest_coverage["build/cache-offline/cache-offline.js"].coveredLines = 56;
_yuitest_coverage["build/cache-offline/cache-offline.js"].coveredFunctions = 11;
_yuitest_coverline("build/cache-offline/cache-offline.js", 1);
YUI.add('cache-offline', function (Y, NAME) {

/**
 * Provides a Cache subclass which uses HTML5 `localStorage` for persistence.
 * 
 * @module cache
 * @submodule cache-offline
 */

/**
 * Extends Cache utility with offline functionality.
 * @class CacheOffline
 * @extends Cache
 * @constructor
 */
_yuitest_coverfunc("build/cache-offline/cache-offline.js", "(anonymous 1)", 1);
_yuitest_coverline("build/cache-offline/cache-offline.js", 16);
function CacheOffline() {
    _yuitest_coverfunc("build/cache-offline/cache-offline.js", "CacheOffline", 16);
_yuitest_coverline("build/cache-offline/cache-offline.js", 17);
CacheOffline.superclass.constructor.apply(this, arguments);
}

_yuitest_coverline("build/cache-offline/cache-offline.js", 20);
var localStorage = null,
    JSON = Y.JSON;

// Bug 2529572
_yuitest_coverline("build/cache-offline/cache-offline.js", 24);
try {
    _yuitest_coverline("build/cache-offline/cache-offline.js", 25);
localStorage = Y.config.win.localStorage;
}
catch(e) {
}

/////////////////////////////////////////////////////////////////////////////
//
// CacheOffline events
//
/////////////////////////////////////////////////////////////////////////////

/**
* @event error
* @description Fired when an entry could not be added, most likely due to
* exceeded browser quota.
* <dl>
* <dt>error (Object)</dt> <dd>The error object.</dd>
* </dl>
*/

/////////////////////////////////////////////////////////////////////////////
//
// CacheOffline static
//
/////////////////////////////////////////////////////////////////////////////
_yuitest_coverline("build/cache-offline/cache-offline.js", 50);
Y.mix(CacheOffline, {
    /**
     * Class name.
     *
     * @property NAME
     * @type String
     * @static
     * @final
     * @value "cacheOffline"
     */
    NAME: "cacheOffline",

    ATTRS: {
        /////////////////////////////////////////////////////////////////////////////
        //
        // CacheOffline Attributes
        //
        /////////////////////////////////////////////////////////////////////////////

        /**
        * @attribute sandbox
        * @description A string that must be passed in via the constructor.
        * This identifier is used to sandbox one cache instance's entries
        * from another. Calling the cache instance's flush and length methods
        * or get("entries") will apply to only these sandboxed entries.
        * @type String
        * @default "default"
        * @initOnly
        */
        sandbox: {
            value: "default",
            writeOnce: "initOnly"
        },

        /**
        * @attribute expires
        * @description Absolute Date when data expires or
        * relative number of milliseconds. Zero disables expiration.
        * @type Date | Number
        * @default 86400000 (one day)
        */
        expires: {
            value: 86400000
        },

        /**
        * @attribute max
        * @description Disabled.
        * @readOnly
        * @default null
        */
        max: {
            value: null,
            readOnly: true
        },

        /**
        * @attribute uniqueKeys
        * @description Always true for CacheOffline.
        * @readOnly
        * @default true
        */
        uniqueKeys: {
            value: true,
            readOnly: true,
            setter: function() {
                _yuitest_coverfunc("build/cache-offline/cache-offline.js", "setter", 115);
_yuitest_coverline("build/cache-offline/cache-offline.js", 116);
return true;
            }
        }
    },

    /**
     * Removes all items from all sandboxes. Useful if localStorage has
     * exceeded quota. Only supported on browsers that implement HTML 5
     * localStorage.
     *
     * @method flushAll
     * @static
     */
    flushAll: function() {
        _yuitest_coverfunc("build/cache-offline/cache-offline.js", "flushAll", 129);
_yuitest_coverline("build/cache-offline/cache-offline.js", 130);
var store = localStorage, key;
        _yuitest_coverline("build/cache-offline/cache-offline.js", 131);
if(store) {
            _yuitest_coverline("build/cache-offline/cache-offline.js", 132);
if(store.clear) {
                _yuitest_coverline("build/cache-offline/cache-offline.js", 133);
store.clear();
            }
            // FF2.x and FF3.0.x
            else {
                _yuitest_coverline("build/cache-offline/cache-offline.js", 137);
for (key in store) {
                    _yuitest_coverline("build/cache-offline/cache-offline.js", 138);
if (store.hasOwnProperty(key)) {
                        _yuitest_coverline("build/cache-offline/cache-offline.js", 139);
store.removeItem(key);
                        _yuitest_coverline("build/cache-offline/cache-offline.js", 140);
delete store[key];
                    }
                }
            }
        }
        else {
        }
    }
});

_yuitest_coverline("build/cache-offline/cache-offline.js", 150);
Y.extend(CacheOffline, Y.Cache, localStorage ? {
/////////////////////////////////////////////////////////////////////////////
//
// Offline is supported
//
/////////////////////////////////////////////////////////////////////////////

    /////////////////////////////////////////////////////////////////////////////
    //
    // CacheOffline protected methods
    //
    /////////////////////////////////////////////////////////////////////////////
    /**
     * Always return null.
     *
     * @method _setMax
     * @protected
     */
    _setMax: function(value) {
        _yuitest_coverfunc("build/cache-offline/cache-offline.js", "_setMax", 168);
_yuitest_coverline("build/cache-offline/cache-offline.js", 169);
return null;
    },

    /**
     * Gets size.
     *
     * @method _getSize
     * @protected
     */
    _getSize: function() {
        _yuitest_coverfunc("build/cache-offline/cache-offline.js", "_getSize", 178);
_yuitest_coverline("build/cache-offline/cache-offline.js", 179);
var count = 0,
            i=0,
            l=localStorage.length;
        _yuitest_coverline("build/cache-offline/cache-offline.js", 182);
for(; i<l; ++i) {
            // Match sandbox id
            _yuitest_coverline("build/cache-offline/cache-offline.js", 184);
if(localStorage.key(i).indexOf(this.get("sandbox")) === 0) {
                _yuitest_coverline("build/cache-offline/cache-offline.js", 185);
count++;
            }
        }
        _yuitest_coverline("build/cache-offline/cache-offline.js", 188);
return count;
    },

    /**
     * Gets all entries.
     *
     * @method _getEntries
     * @protected
     */
    _getEntries: function() {
        _yuitest_coverfunc("build/cache-offline/cache-offline.js", "_getEntries", 197);
_yuitest_coverline("build/cache-offline/cache-offline.js", 198);
var entries = [],
            i=0,
            l=localStorage.length,
            sandbox = this.get("sandbox");
        _yuitest_coverline("build/cache-offline/cache-offline.js", 202);
for(; i<l; ++i) {
            // Match sandbox id
            _yuitest_coverline("build/cache-offline/cache-offline.js", 204);
if(localStorage.key(i).indexOf(sandbox) === 0) {
                _yuitest_coverline("build/cache-offline/cache-offline.js", 205);
entries[i] = JSON.parse(localStorage.key(i).substring(sandbox.length));
            }
        }
        _yuitest_coverline("build/cache-offline/cache-offline.js", 208);
return entries;
    },

    /**
     * Adds entry to cache.
     *
     * @method _defAddFn
     * @param e {Event.Facade} Event Facade with the following properties:
     * <dl>
     * <dt>entry (Object)</dt> <dd>The cached entry.</dd>
     * </dl>
     * @protected
     */
    _defAddFn: function(e) {
        _yuitest_coverfunc("build/cache-offline/cache-offline.js", "_defAddFn", 221);
_yuitest_coverline("build/cache-offline/cache-offline.js", 222);
var entry = e.entry,
            request = entry.request,
            cached = entry.cached,
            expires = entry.expires;

        // Convert Dates to msecs on the way into localStorage
        _yuitest_coverline("build/cache-offline/cache-offline.js", 228);
entry.cached = cached.getTime();
        _yuitest_coverline("build/cache-offline/cache-offline.js", 229);
entry.expires = expires ? expires.getTime() : expires;

        _yuitest_coverline("build/cache-offline/cache-offline.js", 231);
try {
            _yuitest_coverline("build/cache-offline/cache-offline.js", 232);
localStorage.setItem(this.get("sandbox")+JSON.stringify({"request":request}), JSON.stringify(entry));
        }
        catch(error) {
            _yuitest_coverline("build/cache-offline/cache-offline.js", 235);
this.fire("error", {error:error});
        }
    },

    /**
     * Flushes cache.
     *
     * @method _defFlushFn
     * @param e {Event.Facade} Event Facade object.
     * @protected
     */
    _defFlushFn: function(e) {
        _yuitest_coverfunc("build/cache-offline/cache-offline.js", "_defFlushFn", 246);
_yuitest_coverline("build/cache-offline/cache-offline.js", 247);
var key,
            i=localStorage.length-1;
        _yuitest_coverline("build/cache-offline/cache-offline.js", 249);
for(; i>-1; --i) {
            // Match sandbox id
            _yuitest_coverline("build/cache-offline/cache-offline.js", 251);
key = localStorage.key(i);
            _yuitest_coverline("build/cache-offline/cache-offline.js", 252);
if(key.indexOf(this.get("sandbox")) === 0) {
                _yuitest_coverline("build/cache-offline/cache-offline.js", 253);
localStorage.removeItem(key);
            }
        }
    },

    /////////////////////////////////////////////////////////////////////////////
    //
    // CacheOffline public methods
    //
    /////////////////////////////////////////////////////////////////////////////
    /**
     * Adds a new entry to the cache of the format
     * {request:request, response:response, cached:cached, expires: expires}.
     *
     * @method add
     * @param request {Object} Request value must be a String or JSON.
     * @param response {Object} Response value must be a String or JSON.
     */

    /**
     * Retrieves cached object for given request, if available.
     * Returns null if there is no cache match.
     *
     * @method retrieve
     * @param request {Object} Request object.
     * @return {Object} Cached object with the properties request, response,
     * and expires, or null.
     */
    retrieve: function(request) {
        _yuitest_coverfunc("build/cache-offline/cache-offline.js", "retrieve", 281);
_yuitest_coverline("build/cache-offline/cache-offline.js", 282);
this.fire("request", {request: request});

        _yuitest_coverline("build/cache-offline/cache-offline.js", 284);
var entry, expires, sandboxedrequest;

        _yuitest_coverline("build/cache-offline/cache-offline.js", 286);
try {
            _yuitest_coverline("build/cache-offline/cache-offline.js", 287);
sandboxedrequest = this.get("sandbox")+JSON.stringify({"request":request});
            _yuitest_coverline("build/cache-offline/cache-offline.js", 288);
try {
                _yuitest_coverline("build/cache-offline/cache-offline.js", 289);
entry = JSON.parse(localStorage.getItem(sandboxedrequest));
            }
            catch(e) {
            }
        }
        catch(e2) {
        }

        _yuitest_coverline("build/cache-offline/cache-offline.js", 297);
if(entry) {
            // Convert msecs to Dates on the way out of localStorage
            _yuitest_coverline("build/cache-offline/cache-offline.js", 299);
entry.cached = new Date(entry.cached);
            _yuitest_coverline("build/cache-offline/cache-offline.js", 300);
expires = entry.expires;
            _yuitest_coverline("build/cache-offline/cache-offline.js", 301);
expires = !expires ? null : new Date(expires);
            _yuitest_coverline("build/cache-offline/cache-offline.js", 302);
entry.expires = expires;

            _yuitest_coverline("build/cache-offline/cache-offline.js", 304);
if(this._isMatch(request, entry)) {
                _yuitest_coverline("build/cache-offline/cache-offline.js", 305);
this.fire("retrieve", {entry: entry});
                _yuitest_coverline("build/cache-offline/cache-offline.js", 306);
return entry;
            }
        }
        _yuitest_coverline("build/cache-offline/cache-offline.js", 309);
return null;
    }
} :
/////////////////////////////////////////////////////////////////////////////
//
// Offline is not supported
//
/////////////////////////////////////////////////////////////////////////////
{
    /**
     * Always return null.
     *
     * @method _setMax
     * @protected
     */
    _setMax: function(value) {
        _yuitest_coverfunc("build/cache-offline/cache-offline.js", "_setMax", 324);
_yuitest_coverline("build/cache-offline/cache-offline.js", 325);
return null;
    }
});


_yuitest_coverline("build/cache-offline/cache-offline.js", 330);
Y.CacheOffline = CacheOffline;


}, '3.7.3', {"requires": ["cache-base", "json"]});
