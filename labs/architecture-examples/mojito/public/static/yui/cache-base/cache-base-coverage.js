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
_yuitest_coverage["build/cache-base/cache-base.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/cache-base/cache-base.js",
    code: []
};
_yuitest_coverage["build/cache-base/cache-base.js"].code=["YUI.add('cache-base', function (Y, NAME) {","","/**"," * The Cache utility provides a common configurable interface for components to"," * cache and retrieve data from a local JavaScript struct."," *"," * @module cache"," * @main"," */","","/**"," * Provides the base class for the YUI Cache utility."," *"," * @submodule cache-base"," */","var LANG = Y.Lang,","    isDate = Y.Lang.isDate,","","/**"," * Base class for the YUI Cache utility."," * @class Cache"," * @extends Base"," * @constructor"," */","Cache = function() {","    Cache.superclass.constructor.apply(this, arguments);","};","","    /////////////////////////////////////////////////////////////////////////////","    //","    // Cache static properties","    //","    /////////////////////////////////////////////////////////////////////////////","Y.mix(Cache, {","    /**","     * Class name.","     *","     * @property NAME","     * @type String","     * @static","     * @final","     * @value \"cache\"","     */","    NAME: \"cache\",","","","    ATTRS: {","        /////////////////////////////////////////////////////////////////////////////","        //","        // Cache Attributes","        //","        /////////////////////////////////////////////////////////////////////////////","","        /**","        * @attribute max","        * @description Maximum number of entries the Cache can hold.","        * Set to 0 to turn off caching.","        * @type Number","        * @default 0","        */","        max: {","            value: 0,","            setter: \"_setMax\"","        },","","        /**","        * @attribute size","        * @description Number of entries currently cached.","        * @type Number","        */","        size: {","            readOnly: true,","            getter: \"_getSize\"","        },","","        /**","        * @attribute uniqueKeys","        * @description Validate uniqueness of stored keys. Default is false and","        * is more performant.","        * @type Boolean","        */","        uniqueKeys: {","            value: false","        },","","        /**","        * @attribute expires","        * @description Absolute Date when data expires or","        * relative number of milliseconds. Zero disables expiration.","        * @type Date | Number","        * @default 0","        */","        expires: {","            value: 0,","            validator: function(v) {","                return Y.Lang.isDate(v) || (Y.Lang.isNumber(v) && v >= 0);","            }","        },","","        /**","         * @attribute entries","         * @description Cached entries.","         * @type Array","         */","        entries: {","            readOnly: true,","            getter: \"_getEntries\"","        }","    }","});","","Y.extend(Cache, Y.Base, {","    /////////////////////////////////////////////////////////////////////////////","    //","    // Cache private properties","    //","    /////////////////////////////////////////////////////////////////////////////","","    /**","     * Array of request/response objects indexed chronologically.","     *","     * @property _entries","     * @type Object[]","     * @private","     */","    _entries: null,","","    /////////////////////////////////////////////////////////////////////////////","    //","    // Cache private methods","    //","    /////////////////////////////////////////////////////////////////////////////","","    /**","    * @method initializer","    * @description Internal init() handler.","    * @param config {Object} Config object.","    * @private","    */","    initializer: function(config) {","","        /**","        * @event add","        * @description Fired when an entry is added.","        * @param e {Event.Facade} Event Facade with the following properties:","         * <dl>","         * <dt>entry (Object)</dt> <dd>The cached entry.</dd>","         * </dl>","        * @preventable _defAddFn","        */","        this.publish(\"add\", {defaultFn: this._defAddFn});","","        /**","        * @event flush","        * @description Fired when the cache is flushed.","        * @param e {Event.Facade} Event Facade object.","        * @preventable _defFlushFn","        */","        this.publish(\"flush\", {defaultFn: this._defFlushFn});","","        /**","        * @event request","        * @description Fired when an entry is requested from the cache.","        * @param e {Event.Facade} Event Facade with the following properties:","        * <dl>","        * <dt>request (Object)</dt> <dd>The request object.</dd>","        * </dl>","        */","","        /**","        * @event retrieve","        * @description Fired when an entry is retrieved from the cache.","        * @param e {Event.Facade} Event Facade with the following properties:","        * <dl>","        * <dt>entry (Object)</dt> <dd>The retrieved entry.</dd>","        * </dl>","        */","","        // Initialize internal values","        this._entries = [];","    },","","    /**","    * @method destructor","    * @description Internal destroy() handler.","    * @private","    */","    destructor: function() {","        this._entries = [];","    },","","    /////////////////////////////////////////////////////////////////////////////","    //","    // Cache protected methods","    //","    /////////////////////////////////////////////////////////////////////////////","","    /**","     * Sets max.","     *","     * @method _setMax","     * @protected","     */","    _setMax: function(value) {","        // If the cache is full, make room by removing stalest element (index=0)","        var entries = this._entries;","        if(value > 0) {","            if(entries) {","                while(entries.length > value) {","                    entries.shift();","                }","            }","        }","        else {","            value = 0;","            this._entries = [];","        }","        return value;","    },","","    /**","     * Gets size.","     *","     * @method _getSize","     * @protected","     */","    _getSize: function() {","        return this._entries.length;","    },","","    /**","     * Gets all entries.","     *","     * @method _getEntries","     * @protected","     */","    _getEntries: function() {","        return this._entries;","    },","","","    /**","     * Adds entry to cache.","     *","     * @method _defAddFn","     * @param e {Event.Facade} Event Facade with the following properties:","     * <dl>","     * <dt>entry (Object)</dt> <dd>The cached entry.</dd>","     * </dl>","     * @protected","     */","    _defAddFn: function(e) {","        var entries = this._entries,","            entry   = e.entry,","            max     = this.get(\"max\"),","            pos;","","        // If uniqueKeys is true and item exists with this key, then remove it.","        if (this.get(\"uniqueKeys\")) {","            pos = this._position(e.entry.request);","            if (LANG.isValue(pos)) {","                entries.splice(pos, 1);","            }","        }","","        // If the cache at or over capacity, make room by removing stalest","        // element(s) starting at index-0.","        while (max && entries.length >= max) {","            entries.shift();","        }","","        // Add entry to cache in the newest position, at the end of the array","        entries[entries.length] = entry;","    },","","    /**","     * Flushes cache.","     *","     * @method _defFlushFn","     * @param e {Event.Facade} Event Facade object.","     * @protected","     */","    _defFlushFn: function(e) {","        var entries = this._entries,","            details = e.details[0],","            pos;","","        //passed an item, flush only that","        if(details && LANG.isValue(details.request)) {","            pos = this._position(details.request);","","            if(LANG.isValue(pos)) {","                entries.splice(pos,1);","","            }","        }","        //no item, flush everything","        else {","            this._entries = [];","        }","    },","","    /**","     * Default overridable method compares current request with given cache entry.","     * Returns true if current request matches the cached request, otherwise","     * false. Implementers should override this method to customize the","     * cache-matching algorithm.","     *","     * @method _isMatch","     * @param request {Object} Request object.","     * @param entry {Object} Cached entry.","     * @return {Boolean} True if current request matches given cached request, false otherwise.","     * @protected","     */","    _isMatch: function(request, entry) {","        if(!entry.expires || new Date() < entry.expires) {","            return (request === entry.request);","        }","        return false;","    },","","    /**","     * Returns position of a request in the entries array, otherwise null.","     *","     * @method _position","     * @param request {Object} Request object.","     * @return {Number} Array position if found, null otherwise.","     * @protected","     */","    _position: function(request) {","        // If cache is enabled...","        var entries = this._entries,","            length = entries.length,","            i = length-1;","","        if((this.get(\"max\") === null) || this.get(\"max\") > 0) {","            // Loop through each cached entry starting from the newest","            for(; i >= 0; i--) {","                // Execute matching function","                if(this._isMatch(request, entries[i])) {","                    return i;","                }","            }","        }","","        return null;","    },","","    /////////////////////////////////////////////////////////////////////////////","    //","    // Cache public methods","    //","    /////////////////////////////////////////////////////////////////////////////","","    /**","     * Adds a new entry to the cache of the format","     * {request:request, response:response, cached:cached, expires:expires}.","     * If cache is full, evicts the stalest entry before adding the new one.","     *","     * @method add","     * @param request {Object} Request value.","     * @param response {Object} Response value.","     */","    add: function(request, response) {","        var expires = this.get(\"expires\");","        if(this.get(\"initialized\") && ((this.get(\"max\") === null) || this.get(\"max\") > 0) &&","                (LANG.isValue(request) || LANG.isNull(request) || LANG.isUndefined(request))) {","            this.fire(\"add\", {entry: {","                request:request,","                response:response,","                cached: new Date(),","                expires: isDate(expires) ? expires :","            (expires ? new Date(new Date().getTime() + this.get(\"expires\")) : null)","            }});","        }","        else {","        }","    },","","    /**","     * Flushes cache.","     *","     * @method flush","     */","    flush: function(request) {","        this.fire(\"flush\", { request: (LANG.isValue(request) ? request : null) });","    },","","    /**","     * Retrieves cached object for given request, if available, and refreshes","     * entry in the cache. Returns null if there is no cache match.","     *","     * @method retrieve","     * @param request {Object} Request object.","     * @return {Object} Cached object with the properties request and response, or null.","     */","    retrieve: function(request) {","        // If cache is enabled...","        var entries = this._entries,","            length = entries.length,","            entry = null,","            pos;","","        if((length > 0) && ((this.get(\"max\") === null) || (this.get(\"max\") > 0))) {","            this.fire(\"request\", {request: request});","","            pos = this._position(request);","","            if(LANG.isValue(pos)) {","                entry = entries[pos];","","                this.fire(\"retrieve\", {entry: entry});","","                // Refresh the position of the cache hit","                if(pos < length-1) {","                    // Remove element from its original location","                    entries.splice(pos,1);","                    // Add as newest","                    entries[entries.length] = entry;","                }","","                return entry;","            }","        }","        return null;","    }","});","","Y.Cache = Cache;","","","}, '3.7.3', {\"requires\": [\"base\"]});"];
_yuitest_coverage["build/cache-base/cache-base.js"].lines = {"1":0,"16":0,"26":0,"34":0,"96":0,"112":0,"151":0,"159":0,"180":0,"189":0,"206":0,"207":0,"208":0,"209":0,"210":0,"215":0,"216":0,"218":0,"228":0,"238":0,"253":0,"259":0,"260":0,"261":0,"262":0,"268":0,"269":0,"273":0,"284":0,"289":0,"290":0,"292":0,"293":0,"299":0,"316":0,"317":0,"319":0,"332":0,"336":0,"338":0,"340":0,"341":0,"346":0,"365":0,"366":0,"368":0,"386":0,"399":0,"404":0,"405":0,"407":0,"409":0,"410":0,"412":0,"415":0,"417":0,"419":0,"422":0,"425":0,"429":0};
_yuitest_coverage["build/cache-base/cache-base.js"].functions = {"Cache:25":0,"validator:95":0,"initializer:140":0,"destructor:188":0,"_setMax:204":0,"_getSize:227":0,"_getEntries:237":0,"_defAddFn:252":0,"_defFlushFn:283":0,"_isMatch:315":0,"_position:330":0,"add:364":0,"flush:385":0,"retrieve:397":0,"(anonymous 1):1":0};
_yuitest_coverage["build/cache-base/cache-base.js"].coveredLines = 60;
_yuitest_coverage["build/cache-base/cache-base.js"].coveredFunctions = 15;
_yuitest_coverline("build/cache-base/cache-base.js", 1);
YUI.add('cache-base', function (Y, NAME) {

/**
 * The Cache utility provides a common configurable interface for components to
 * cache and retrieve data from a local JavaScript struct.
 *
 * @module cache
 * @main
 */

/**
 * Provides the base class for the YUI Cache utility.
 *
 * @submodule cache-base
 */
_yuitest_coverfunc("build/cache-base/cache-base.js", "(anonymous 1)", 1);
_yuitest_coverline("build/cache-base/cache-base.js", 16);
var LANG = Y.Lang,
    isDate = Y.Lang.isDate,

/**
 * Base class for the YUI Cache utility.
 * @class Cache
 * @extends Base
 * @constructor
 */
Cache = function() {
    _yuitest_coverfunc("build/cache-base/cache-base.js", "Cache", 25);
_yuitest_coverline("build/cache-base/cache-base.js", 26);
Cache.superclass.constructor.apply(this, arguments);
};

    /////////////////////////////////////////////////////////////////////////////
    //
    // Cache static properties
    //
    /////////////////////////////////////////////////////////////////////////////
_yuitest_coverline("build/cache-base/cache-base.js", 34);
Y.mix(Cache, {
    /**
     * Class name.
     *
     * @property NAME
     * @type String
     * @static
     * @final
     * @value "cache"
     */
    NAME: "cache",


    ATTRS: {
        /////////////////////////////////////////////////////////////////////////////
        //
        // Cache Attributes
        //
        /////////////////////////////////////////////////////////////////////////////

        /**
        * @attribute max
        * @description Maximum number of entries the Cache can hold.
        * Set to 0 to turn off caching.
        * @type Number
        * @default 0
        */
        max: {
            value: 0,
            setter: "_setMax"
        },

        /**
        * @attribute size
        * @description Number of entries currently cached.
        * @type Number
        */
        size: {
            readOnly: true,
            getter: "_getSize"
        },

        /**
        * @attribute uniqueKeys
        * @description Validate uniqueness of stored keys. Default is false and
        * is more performant.
        * @type Boolean
        */
        uniqueKeys: {
            value: false
        },

        /**
        * @attribute expires
        * @description Absolute Date when data expires or
        * relative number of milliseconds. Zero disables expiration.
        * @type Date | Number
        * @default 0
        */
        expires: {
            value: 0,
            validator: function(v) {
                _yuitest_coverfunc("build/cache-base/cache-base.js", "validator", 95);
_yuitest_coverline("build/cache-base/cache-base.js", 96);
return Y.Lang.isDate(v) || (Y.Lang.isNumber(v) && v >= 0);
            }
        },

        /**
         * @attribute entries
         * @description Cached entries.
         * @type Array
         */
        entries: {
            readOnly: true,
            getter: "_getEntries"
        }
    }
});

_yuitest_coverline("build/cache-base/cache-base.js", 112);
Y.extend(Cache, Y.Base, {
    /////////////////////////////////////////////////////////////////////////////
    //
    // Cache private properties
    //
    /////////////////////////////////////////////////////////////////////////////

    /**
     * Array of request/response objects indexed chronologically.
     *
     * @property _entries
     * @type Object[]
     * @private
     */
    _entries: null,

    /////////////////////////////////////////////////////////////////////////////
    //
    // Cache private methods
    //
    /////////////////////////////////////////////////////////////////////////////

    /**
    * @method initializer
    * @description Internal init() handler.
    * @param config {Object} Config object.
    * @private
    */
    initializer: function(config) {

        /**
        * @event add
        * @description Fired when an entry is added.
        * @param e {Event.Facade} Event Facade with the following properties:
         * <dl>
         * <dt>entry (Object)</dt> <dd>The cached entry.</dd>
         * </dl>
        * @preventable _defAddFn
        */
        _yuitest_coverfunc("build/cache-base/cache-base.js", "initializer", 140);
_yuitest_coverline("build/cache-base/cache-base.js", 151);
this.publish("add", {defaultFn: this._defAddFn});

        /**
        * @event flush
        * @description Fired when the cache is flushed.
        * @param e {Event.Facade} Event Facade object.
        * @preventable _defFlushFn
        */
        _yuitest_coverline("build/cache-base/cache-base.js", 159);
this.publish("flush", {defaultFn: this._defFlushFn});

        /**
        * @event request
        * @description Fired when an entry is requested from the cache.
        * @param e {Event.Facade} Event Facade with the following properties:
        * <dl>
        * <dt>request (Object)</dt> <dd>The request object.</dd>
        * </dl>
        */

        /**
        * @event retrieve
        * @description Fired when an entry is retrieved from the cache.
        * @param e {Event.Facade} Event Facade with the following properties:
        * <dl>
        * <dt>entry (Object)</dt> <dd>The retrieved entry.</dd>
        * </dl>
        */

        // Initialize internal values
        _yuitest_coverline("build/cache-base/cache-base.js", 180);
this._entries = [];
    },

    /**
    * @method destructor
    * @description Internal destroy() handler.
    * @private
    */
    destructor: function() {
        _yuitest_coverfunc("build/cache-base/cache-base.js", "destructor", 188);
_yuitest_coverline("build/cache-base/cache-base.js", 189);
this._entries = [];
    },

    /////////////////////////////////////////////////////////////////////////////
    //
    // Cache protected methods
    //
    /////////////////////////////////////////////////////////////////////////////

    /**
     * Sets max.
     *
     * @method _setMax
     * @protected
     */
    _setMax: function(value) {
        // If the cache is full, make room by removing stalest element (index=0)
        _yuitest_coverfunc("build/cache-base/cache-base.js", "_setMax", 204);
_yuitest_coverline("build/cache-base/cache-base.js", 206);
var entries = this._entries;
        _yuitest_coverline("build/cache-base/cache-base.js", 207);
if(value > 0) {
            _yuitest_coverline("build/cache-base/cache-base.js", 208);
if(entries) {
                _yuitest_coverline("build/cache-base/cache-base.js", 209);
while(entries.length > value) {
                    _yuitest_coverline("build/cache-base/cache-base.js", 210);
entries.shift();
                }
            }
        }
        else {
            _yuitest_coverline("build/cache-base/cache-base.js", 215);
value = 0;
            _yuitest_coverline("build/cache-base/cache-base.js", 216);
this._entries = [];
        }
        _yuitest_coverline("build/cache-base/cache-base.js", 218);
return value;
    },

    /**
     * Gets size.
     *
     * @method _getSize
     * @protected
     */
    _getSize: function() {
        _yuitest_coverfunc("build/cache-base/cache-base.js", "_getSize", 227);
_yuitest_coverline("build/cache-base/cache-base.js", 228);
return this._entries.length;
    },

    /**
     * Gets all entries.
     *
     * @method _getEntries
     * @protected
     */
    _getEntries: function() {
        _yuitest_coverfunc("build/cache-base/cache-base.js", "_getEntries", 237);
_yuitest_coverline("build/cache-base/cache-base.js", 238);
return this._entries;
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
        _yuitest_coverfunc("build/cache-base/cache-base.js", "_defAddFn", 252);
_yuitest_coverline("build/cache-base/cache-base.js", 253);
var entries = this._entries,
            entry   = e.entry,
            max     = this.get("max"),
            pos;

        // If uniqueKeys is true and item exists with this key, then remove it.
        _yuitest_coverline("build/cache-base/cache-base.js", 259);
if (this.get("uniqueKeys")) {
            _yuitest_coverline("build/cache-base/cache-base.js", 260);
pos = this._position(e.entry.request);
            _yuitest_coverline("build/cache-base/cache-base.js", 261);
if (LANG.isValue(pos)) {
                _yuitest_coverline("build/cache-base/cache-base.js", 262);
entries.splice(pos, 1);
            }
        }

        // If the cache at or over capacity, make room by removing stalest
        // element(s) starting at index-0.
        _yuitest_coverline("build/cache-base/cache-base.js", 268);
while (max && entries.length >= max) {
            _yuitest_coverline("build/cache-base/cache-base.js", 269);
entries.shift();
        }

        // Add entry to cache in the newest position, at the end of the array
        _yuitest_coverline("build/cache-base/cache-base.js", 273);
entries[entries.length] = entry;
    },

    /**
     * Flushes cache.
     *
     * @method _defFlushFn
     * @param e {Event.Facade} Event Facade object.
     * @protected
     */
    _defFlushFn: function(e) {
        _yuitest_coverfunc("build/cache-base/cache-base.js", "_defFlushFn", 283);
_yuitest_coverline("build/cache-base/cache-base.js", 284);
var entries = this._entries,
            details = e.details[0],
            pos;

        //passed an item, flush only that
        _yuitest_coverline("build/cache-base/cache-base.js", 289);
if(details && LANG.isValue(details.request)) {
            _yuitest_coverline("build/cache-base/cache-base.js", 290);
pos = this._position(details.request);

            _yuitest_coverline("build/cache-base/cache-base.js", 292);
if(LANG.isValue(pos)) {
                _yuitest_coverline("build/cache-base/cache-base.js", 293);
entries.splice(pos,1);

            }
        }
        //no item, flush everything
        else {
            _yuitest_coverline("build/cache-base/cache-base.js", 299);
this._entries = [];
        }
    },

    /**
     * Default overridable method compares current request with given cache entry.
     * Returns true if current request matches the cached request, otherwise
     * false. Implementers should override this method to customize the
     * cache-matching algorithm.
     *
     * @method _isMatch
     * @param request {Object} Request object.
     * @param entry {Object} Cached entry.
     * @return {Boolean} True if current request matches given cached request, false otherwise.
     * @protected
     */
    _isMatch: function(request, entry) {
        _yuitest_coverfunc("build/cache-base/cache-base.js", "_isMatch", 315);
_yuitest_coverline("build/cache-base/cache-base.js", 316);
if(!entry.expires || new Date() < entry.expires) {
            _yuitest_coverline("build/cache-base/cache-base.js", 317);
return (request === entry.request);
        }
        _yuitest_coverline("build/cache-base/cache-base.js", 319);
return false;
    },

    /**
     * Returns position of a request in the entries array, otherwise null.
     *
     * @method _position
     * @param request {Object} Request object.
     * @return {Number} Array position if found, null otherwise.
     * @protected
     */
    _position: function(request) {
        // If cache is enabled...
        _yuitest_coverfunc("build/cache-base/cache-base.js", "_position", 330);
_yuitest_coverline("build/cache-base/cache-base.js", 332);
var entries = this._entries,
            length = entries.length,
            i = length-1;

        _yuitest_coverline("build/cache-base/cache-base.js", 336);
if((this.get("max") === null) || this.get("max") > 0) {
            // Loop through each cached entry starting from the newest
            _yuitest_coverline("build/cache-base/cache-base.js", 338);
for(; i >= 0; i--) {
                // Execute matching function
                _yuitest_coverline("build/cache-base/cache-base.js", 340);
if(this._isMatch(request, entries[i])) {
                    _yuitest_coverline("build/cache-base/cache-base.js", 341);
return i;
                }
            }
        }

        _yuitest_coverline("build/cache-base/cache-base.js", 346);
return null;
    },

    /////////////////////////////////////////////////////////////////////////////
    //
    // Cache public methods
    //
    /////////////////////////////////////////////////////////////////////////////

    /**
     * Adds a new entry to the cache of the format
     * {request:request, response:response, cached:cached, expires:expires}.
     * If cache is full, evicts the stalest entry before adding the new one.
     *
     * @method add
     * @param request {Object} Request value.
     * @param response {Object} Response value.
     */
    add: function(request, response) {
        _yuitest_coverfunc("build/cache-base/cache-base.js", "add", 364);
_yuitest_coverline("build/cache-base/cache-base.js", 365);
var expires = this.get("expires");
        _yuitest_coverline("build/cache-base/cache-base.js", 366);
if(this.get("initialized") && ((this.get("max") === null) || this.get("max") > 0) &&
                (LANG.isValue(request) || LANG.isNull(request) || LANG.isUndefined(request))) {
            _yuitest_coverline("build/cache-base/cache-base.js", 368);
this.fire("add", {entry: {
                request:request,
                response:response,
                cached: new Date(),
                expires: isDate(expires) ? expires :
            (expires ? new Date(new Date().getTime() + this.get("expires")) : null)
            }});
        }
        else {
        }
    },

    /**
     * Flushes cache.
     *
     * @method flush
     */
    flush: function(request) {
        _yuitest_coverfunc("build/cache-base/cache-base.js", "flush", 385);
_yuitest_coverline("build/cache-base/cache-base.js", 386);
this.fire("flush", { request: (LANG.isValue(request) ? request : null) });
    },

    /**
     * Retrieves cached object for given request, if available, and refreshes
     * entry in the cache. Returns null if there is no cache match.
     *
     * @method retrieve
     * @param request {Object} Request object.
     * @return {Object} Cached object with the properties request and response, or null.
     */
    retrieve: function(request) {
        // If cache is enabled...
        _yuitest_coverfunc("build/cache-base/cache-base.js", "retrieve", 397);
_yuitest_coverline("build/cache-base/cache-base.js", 399);
var entries = this._entries,
            length = entries.length,
            entry = null,
            pos;

        _yuitest_coverline("build/cache-base/cache-base.js", 404);
if((length > 0) && ((this.get("max") === null) || (this.get("max") > 0))) {
            _yuitest_coverline("build/cache-base/cache-base.js", 405);
this.fire("request", {request: request});

            _yuitest_coverline("build/cache-base/cache-base.js", 407);
pos = this._position(request);

            _yuitest_coverline("build/cache-base/cache-base.js", 409);
if(LANG.isValue(pos)) {
                _yuitest_coverline("build/cache-base/cache-base.js", 410);
entry = entries[pos];

                _yuitest_coverline("build/cache-base/cache-base.js", 412);
this.fire("retrieve", {entry: entry});

                // Refresh the position of the cache hit
                _yuitest_coverline("build/cache-base/cache-base.js", 415);
if(pos < length-1) {
                    // Remove element from its original location
                    _yuitest_coverline("build/cache-base/cache-base.js", 417);
entries.splice(pos,1);
                    // Add as newest
                    _yuitest_coverline("build/cache-base/cache-base.js", 419);
entries[entries.length] = entry;
                }

                _yuitest_coverline("build/cache-base/cache-base.js", 422);
return entry;
            }
        }
        _yuitest_coverline("build/cache-base/cache-base.js", 425);
return null;
    }
});

_yuitest_coverline("build/cache-base/cache-base.js", 429);
Y.Cache = Cache;


}, '3.7.3', {"requires": ["base"]});
