/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
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
function CacheOffline() {
    CacheOffline.superclass.constructor.apply(this, arguments);
}

var localStorage = null,
    JSON = Y.JSON;

// Bug 2529572
try {
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
        var store = localStorage, key;
        if(store) {
            if(store.clear) {
                store.clear();
            }
            // FF2.x and FF3.0.x
            else {
                for (key in store) {
                    if (store.hasOwnProperty(key)) {
                        store.removeItem(key);
                        delete store[key];
                    }
                }
            }
        }
        else {
        }
    }
});

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
        return null;
    },

    /**
     * Gets size.
     *
     * @method _getSize
     * @protected
     */
    _getSize: function() {
        var count = 0,
            i=0,
            l=localStorage.length;
        for(; i<l; ++i) {
            // Match sandbox id
            if(localStorage.key(i).indexOf(this.get("sandbox")) === 0) {
                count++;
            }
        }
        return count;
    },

    /**
     * Gets all entries.
     *
     * @method _getEntries
     * @protected
     */
    _getEntries: function() {
        var entries = [],
            i=0,
            l=localStorage.length,
            sandbox = this.get("sandbox");
        for(; i<l; ++i) {
            // Match sandbox id
            if(localStorage.key(i).indexOf(sandbox) === 0) {
                entries[i] = JSON.parse(localStorage.key(i).substring(sandbox.length));
            }
        }
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
        var entry = e.entry,
            request = entry.request,
            cached = entry.cached,
            expires = entry.expires;

        // Convert Dates to msecs on the way into localStorage
        entry.cached = cached.getTime();
        entry.expires = expires ? expires.getTime() : expires;

        try {
            localStorage.setItem(this.get("sandbox")+JSON.stringify({"request":request}), JSON.stringify(entry));
        }
        catch(error) {
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
        var key,
            i=localStorage.length-1;
        for(; i>-1; --i) {
            // Match sandbox id
            key = localStorage.key(i);
            if(key.indexOf(this.get("sandbox")) === 0) {
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
        this.fire("request", {request: request});

        var entry, expires, sandboxedrequest;

        try {
            sandboxedrequest = this.get("sandbox")+JSON.stringify({"request":request});
            try {
                entry = JSON.parse(localStorage.getItem(sandboxedrequest));
            }
            catch(e) {
            }
        }
        catch(e2) {
        }

        if(entry) {
            // Convert msecs to Dates on the way out of localStorage
            entry.cached = new Date(entry.cached);
            expires = entry.expires;
            expires = !expires ? null : new Date(expires);
            entry.expires = expires;

            if(this._isMatch(request, entry)) {
                this.fire("retrieve", {entry: entry});
                return entry;
            }
        }
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
        return null;
    }
});


Y.CacheOffline = CacheOffline;


}, '3.7.3', {"requires": ["cache-base", "json"]});
