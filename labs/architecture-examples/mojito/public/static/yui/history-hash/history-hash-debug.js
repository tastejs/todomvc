/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('history-hash', function (Y, NAME) {

/**
 * Provides browser history management backed by
 * <code>window.location.hash</code>, as well as convenience methods for working
 * with the location hash and a synthetic <code>hashchange</code> event that
 * normalizes differences across browsers.
 *
 * @module history
 * @submodule history-hash
 * @since 3.2.0
 * @class HistoryHash
 * @extends HistoryBase
 * @constructor
 * @param {Object} config (optional) Configuration object. See the HistoryBase
 *   documentation for details.
 */

var HistoryBase = Y.HistoryBase,
    Lang        = Y.Lang,
    YArray      = Y.Array,
    YObject     = Y.Object,
    GlobalEnv   = YUI.namespace('Env.HistoryHash'),

    SRC_HASH    = 'hash',

    hashNotifiers,
    oldHash,
    oldUrl,
    win             = Y.config.win,
    useHistoryHTML5 = Y.config.useHistoryHTML5;

function HistoryHash() {
    HistoryHash.superclass.constructor.apply(this, arguments);
}

Y.extend(HistoryHash, HistoryBase, {
    // -- Initialization -------------------------------------------------------
    _init: function (config) {
        var bookmarkedState = HistoryHash.parseHash();

        // If an initialState was provided, merge the bookmarked state into it
        // (the bookmarked state wins).
        config = config || {};

        this._initialState = config.initialState ?
                Y.merge(config.initialState, bookmarkedState) : bookmarkedState;

        // Subscribe to the synthetic hashchange event (defined below) to handle
        // changes.
        Y.after('hashchange', Y.bind(this._afterHashChange, this), win);

        HistoryHash.superclass._init.apply(this, arguments);
    },

    // -- Protected Methods ----------------------------------------------------
    _change: function (src, state, options) {
        // Stringify all values to ensure that comparisons don't fail after
        // they're coerced to strings in the location hash.
        YObject.each(state, function (value, key) {
            if (Lang.isValue(value)) {
                state[key] = value.toString();
            }
        });

        return HistoryHash.superclass._change.call(this, src, state, options);
    },

    _storeState: function (src, newState) {
        var decode  = HistoryHash.decode,
            newHash = HistoryHash.createHash(newState);

        HistoryHash.superclass._storeState.apply(this, arguments);

        // Update the location hash with the changes, but only if the new hash
        // actually differs from the current hash (this avoids creating multiple
        // history entries for a single state).
        //
        // We always compare decoded hashes, since it's possible that the hash
        // could be set incorrectly to a non-encoded value outside of
        // HistoryHash.
        if (src !== SRC_HASH && decode(HistoryHash.getHash()) !== decode(newHash)) {
            HistoryHash[src === HistoryBase.SRC_REPLACE ? 'replaceHash' : 'setHash'](newHash);
        }
    },

    // -- Protected Event Handlers ---------------------------------------------

    /**
     * Handler for hashchange events.
     *
     * @method _afterHashChange
     * @param {Event} e
     * @protected
     */
    _afterHashChange: function (e) {
        this._resolveChanges(SRC_HASH, HistoryHash.parseHash(e.newHash), {});
    }
}, {
    // -- Public Static Properties ---------------------------------------------
    NAME: 'historyHash',

    /**
     * Constant used to identify state changes originating from
     * <code>hashchange</code> events.
     *
     * @property SRC_HASH
     * @type String
     * @static
     * @final
     */
    SRC_HASH: SRC_HASH,

    /**
     * <p>
     * Prefix to prepend when setting the hash fragment. For example, if the
     * prefix is <code>!</code> and the hash fragment is set to
     * <code>#foo=bar&baz=quux</code>, the final hash fragment in the URL will
     * become <code>#!foo=bar&baz=quux</code>. This can be used to help make an
     * Ajax application crawlable in accordance with Google's guidelines at
     * <a href="http://code.google.com/web/ajaxcrawling/">http://code.google.com/web/ajaxcrawling/</a>.
     * </p>
     *
     * <p>
     * Note that this prefix applies to all HistoryHash instances. It's not
     * possible for individual instances to use their own prefixes since they
     * all operate on the same URL.
     * </p>
     *
     * @property hashPrefix
     * @type String
     * @default ''
     * @static
     */
    hashPrefix: '',

    // -- Protected Static Properties ------------------------------------------

    /**
     * Regular expression used to parse location hash/query strings.
     *
     * @property _REGEX_HASH
     * @type RegExp
     * @protected
     * @static
     * @final
     */
    _REGEX_HASH: /([^\?#&]+)=([^&]+)/g,

    // -- Public Static Methods ------------------------------------------------

    /**
     * Creates a location hash string from the specified object of key/value
     * pairs.
     *
     * @method createHash
     * @param {Object} params object of key/value parameter pairs
     * @return {String} location hash string
     * @static
     */
    createHash: function (params) {
        var encode = HistoryHash.encode,
            hash   = [];

        YObject.each(params, function (value, key) {
            if (Lang.isValue(value)) {
                hash.push(encode(key) + '=' + encode(value));
            }
        });

        return hash.join('&');
    },

    /**
     * Wrapper around <code>decodeURIComponent()</code> that also converts +
     * chars into spaces.
     *
     * @method decode
     * @param {String} string string to decode
     * @return {String} decoded string
     * @static
     */
    decode: function (string) {
        return decodeURIComponent(string.replace(/\+/g, ' '));
    },

    /**
     * Wrapper around <code>encodeURIComponent()</code> that converts spaces to
     * + chars.
     *
     * @method encode
     * @param {String} string string to encode
     * @return {String} encoded string
     * @static
     */
    encode: function (string) {
        return encodeURIComponent(string).replace(/%20/g, '+');
    },

    /**
     * Gets the raw (not decoded) current location hash, minus the preceding '#'
     * character and the hashPrefix (if one is set).
     *
     * @method getHash
     * @return {String} current location hash
     * @static
     */
    getHash: (Y.UA.gecko ? function () {
        // Gecko's window.location.hash returns a decoded string and we want all
        // encoding untouched, so we need to get the hash value from
        // window.location.href instead. We have to use UA sniffing rather than
        // feature detection, since the only way to detect this would be to
        // actually change the hash.
        var location = Y.getLocation(),
            matches  = /#(.*)$/.exec(location.href),
            hash     = matches && matches[1] || '',
            prefix   = HistoryHash.hashPrefix;

        return prefix && hash.indexOf(prefix) === 0 ?
                    hash.replace(prefix, '') : hash;
    } : function () {
        var location = Y.getLocation(),
            hash     = location.hash.substring(1),
            prefix   = HistoryHash.hashPrefix;

        // Slight code duplication here, but execution speed is of the essence
        // since getHash() is called every 50ms to poll for changes in browsers
        // that don't support native onhashchange. An additional function call
        // would add unnecessary overhead.
        return prefix && hash.indexOf(prefix) === 0 ?
                    hash.replace(prefix, '') : hash;
    }),

    /**
     * Gets the current bookmarkable URL.
     *
     * @method getUrl
     * @return {String} current bookmarkable URL
     * @static
     */
    getUrl: function () {
        return location.href;
    },

    /**
     * Parses a location hash string into an object of key/value parameter
     * pairs. If <i>hash</i> is not specified, the current location hash will
     * be used.
     *
     * @method parseHash
     * @param {String} hash (optional) location hash string
     * @return {Object} object of parsed key/value parameter pairs
     * @static
     */
    parseHash: function (hash) {
        var decode = HistoryHash.decode,
            i,
            len,
            matches,
            param,
            params = {},
            prefix = HistoryHash.hashPrefix,
            prefixIndex;

        hash = Lang.isValue(hash) ? hash : HistoryHash.getHash();

        if (prefix) {
            prefixIndex = hash.indexOf(prefix);

            if (prefixIndex === 0 || (prefixIndex === 1 && hash.charAt(0) === '#')) {
                hash = hash.replace(prefix, '');
            }
        }

        matches = hash.match(HistoryHash._REGEX_HASH) || [];

        for (i = 0, len = matches.length; i < len; ++i) {
            param = matches[i].split('=');
            params[decode(param[0])] = decode(param[1]);
        }

        return params;
    },

    /**
     * Replaces the browser's current location hash with the specified hash
     * and removes all forward navigation states, without creating a new browser
     * history entry. Automatically prepends the <code>hashPrefix</code> if one
     * is set.
     *
     * @method replaceHash
     * @param {String} hash new location hash
     * @static
     */
    replaceHash: function (hash) {
        var location = Y.getLocation(),
            base     = location.href.replace(/#.*$/, '');

        if (hash.charAt(0) === '#') {
            hash = hash.substring(1);
        }

        location.replace(base + '#' + (HistoryHash.hashPrefix || '') + hash);
    },

    /**
     * Sets the browser's location hash to the specified string. Automatically
     * prepends the <code>hashPrefix</code> if one is set.
     *
     * @method setHash
     * @param {String} hash new location hash
     * @static
     */
    setHash: function (hash) {
        var location = Y.getLocation();

        if (hash.charAt(0) === '#') {
            hash = hash.substring(1);
        }

        location.hash = (HistoryHash.hashPrefix || '') + hash;
    }
});

// -- Synthetic hashchange Event -----------------------------------------------

// TODO: YUIDoc currently doesn't provide a good way to document synthetic DOM
// events. For now, we're just documenting the hashchange event on the YUI
// object, which is about the best we can do until enhancements are made to
// YUIDoc.

/**
Synthetic <code>window.onhashchange</code> event that normalizes differences
across browsers and provides support for browsers that don't natively support
<code>onhashchange</code>.

This event is provided by the <code>history-hash</code> module.

@example

    YUI().use('history-hash', function (Y) {
      Y.on('hashchange', function (e) {
        // Handle hashchange events on the current window.
      }, Y.config.win);
    });

@event hashchange
@param {EventFacade} e Event facade with the following additional
  properties:

<dl>
  <dt>oldHash</dt>
  <dd>
    Previous hash fragment value before the change.
  </dd>

  <dt>oldUrl</dt>
  <dd>
    Previous URL (including the hash fragment) before the change.
  </dd>

  <dt>newHash</dt>
  <dd>
    New hash fragment value after the change.
  </dd>

  <dt>newUrl</dt>
  <dd>
    New URL (including the hash fragment) after the change.
  </dd>
</dl>
@for YUI
@since 3.2.0
**/

hashNotifiers = GlobalEnv._notifiers;

if (!hashNotifiers) {
    hashNotifiers = GlobalEnv._notifiers = [];
}

Y.Event.define('hashchange', {
    on: function (node, subscriber, notifier) {
        // Ignore this subscription if the node is anything other than the
        // window or document body, since those are the only elements that
        // should support the hashchange event. Note that the body could also be
        // a frameset, but that's okay since framesets support hashchange too.
        if (node.compareTo(win) || node.compareTo(Y.config.doc.body)) {
            hashNotifiers.push(notifier);
        }
    },

    detach: function (node, subscriber, notifier) {
        var index = YArray.indexOf(hashNotifiers, notifier);

        if (index !== -1) {
            hashNotifiers.splice(index, 1);
        }
    }
});

oldHash = HistoryHash.getHash();
oldUrl  = HistoryHash.getUrl();

if (HistoryBase.nativeHashChange) {
    // Wrap the browser's native hashchange event if there's not already a
    // global listener.
    if (!GlobalEnv._hashHandle) {
        GlobalEnv._hashHandle = Y.Event.attach('hashchange', function (e) {
            var newHash = HistoryHash.getHash(),
                newUrl  = HistoryHash.getUrl();

            // Iterate over a copy of the hashNotifiers array since a subscriber
            // could detach during iteration and cause the array to be re-indexed.
            YArray.each(hashNotifiers.concat(), function (notifier) {
                notifier.fire({
                    _event : e,
                    oldHash: oldHash,
                    oldUrl : oldUrl,
                    newHash: newHash,
                    newUrl : newUrl
                });
            });

            oldHash = newHash;
            oldUrl  = newUrl;
        }, win);
    }
} else {
    // Begin polling for location hash changes if there's not already a global
    // poll running.
    if (!GlobalEnv._hashPoll) {
        GlobalEnv._hashPoll = Y.later(50, null, function () {
            var newHash = HistoryHash.getHash(),
                facade, newUrl;

            if (oldHash !== newHash) {
                newUrl = HistoryHash.getUrl();

                facade = {
                    oldHash: oldHash,
                    oldUrl : oldUrl,
                    newHash: newHash,
                    newUrl : newUrl
                };

                oldHash = newHash;
                oldUrl  = newUrl;

                YArray.each(hashNotifiers.concat(), function (notifier) {
                    notifier.fire(facade);
                });
            }
        }, null, true);
    }
}

Y.HistoryHash = HistoryHash;

// HistoryHash will never win over HistoryHTML5 unless useHistoryHTML5 is false.
if (useHistoryHTML5 === false || (!Y.History && useHistoryHTML5 !== true &&
        (!HistoryBase.html5 || !Y.HistoryHTML5))) {
    Y.History = HistoryHash;
}


}, '3.7.3', {"requires": ["event-synthetic", "history-base", "yui-later"]});
