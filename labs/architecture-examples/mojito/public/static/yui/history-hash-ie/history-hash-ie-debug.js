/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('history-hash-ie', function (Y, NAME) {

/**
 * Improves IE6/7 support in history-hash by using a hidden iframe to create
 * entries in IE's browser history. This module is only needed if IE6/7 support
 * is necessary; it's not needed for any other browser.
 *
 * @module history
 * @submodule history-hash-ie
 * @since 3.2.0
 */

// Combination of a UA sniff to ensure this is IE (or a browser that wants us to
// treat it like IE) and feature detection for native hashchange support (false
// for IE < 8 or IE8/9 in IE7 mode).
if (Y.UA.ie && !Y.HistoryBase.nativeHashChange) {
    var Do          = Y.Do,
        GlobalEnv   = YUI.namespace('Env.HistoryHash'),
        HistoryHash = Y.HistoryHash,

        iframe = GlobalEnv._iframe,
        win    = Y.config.win;

    /**
     * Gets the raw (not decoded) current location hash from the IE iframe,
     * minus the preceding '#' character and the hashPrefix (if one is set).
     *
     * @method getIframeHash
     * @return {String} current iframe hash
     * @static
     */
    HistoryHash.getIframeHash = function () {
        if (!iframe || !iframe.contentWindow) {
            return '';
        }

        var prefix = HistoryHash.hashPrefix,
            hash   = iframe.contentWindow.location.hash.substr(1);

        return prefix && hash.indexOf(prefix) === 0 ?
                    hash.replace(prefix, '') : hash;
    };

    /**
     * Updates the history iframe with the specified hash.
     *
     * @method _updateIframe
     * @param {String} hash location hash
     * @param {Boolean} replace (optional) if <code>true</code>, the current
     *   history state will be replaced without adding a new history entry
     * @protected
     * @static
     * @for HistoryHash
     */
    HistoryHash._updateIframe = function (hash, replace) {
        var iframeDoc      = iframe && iframe.contentWindow && iframe.contentWindow.document,
            iframeLocation = iframeDoc && iframeDoc.location;

        if (!iframeDoc || !iframeLocation) {
            return;
        }

        Y.log('updating history iframe: ' + hash + ', replace: ' + !!replace, 'info', 'history');

        if (replace) {
            iframeLocation.replace(hash.charAt(0) === '#' ? hash : '#' + hash);
        } else {
            iframeDoc.open().close();
            iframeLocation.hash = hash;
        }
    };

    Do.before(HistoryHash._updateIframe, HistoryHash, 'replaceHash', HistoryHash, true);

    if (!iframe) {
        Y.on('domready', function () {
            var lastUrlHash = HistoryHash.getHash();

            // Create a hidden iframe to store history state, following the
            // iframe-hiding recommendations from
            // http://www.paciellogroup.com/blog/?p=604.
            //
            // This iframe will allow history navigation within the current page
            // context. After navigating to another page, all but the most
            // recent history state will be lost.
            //
            // Earlier versions of the YUI History Utility attempted to work
            // around this limitation by having the iframe load a static
            // resource. This workaround was extremely fragile and tended to
            // break frequently (and silently) since it was entirely dependent
            // on IE's inconsistent handling of iframe history.
            //
            // Since this workaround didn't work much of the time anyway and
            // added significant complexity, it has been removed, and IE6 and 7
            // now get slightly degraded history support.
            Y.log('creating dynamic history iframe', 'info', 'history');

            iframe = GlobalEnv._iframe = Y.Node.getDOMNode(Y.Node.create(
                '<iframe src="javascript:0" style="display:none" height="0" width="0" tabindex="-1" title="empty"/>'
            ));

            // Append the iframe to the documentElement rather than the body.
            // Keeping it outside the body prevents scrolling on the initial
            // page load (hat tip to Ben Alman and jQuery BBQ for this
            // technique).
            Y.config.doc.documentElement.appendChild(iframe);

            // Update the iframe with the initial location hash, if any. This
            // will create an initial history entry that the user can return to
            // after the state has changed.
            HistoryHash._updateIframe(lastUrlHash || '#');

            // Listen for hashchange events and keep the iframe's hash in sync
            // with the parent frame's hash.
            Y.on('hashchange', function (e) {
                lastUrlHash = e.newHash;

                if (HistoryHash.getIframeHash() !== lastUrlHash) {
                    Y.log('updating iframe hash to match URL hash', 'info', 'history');
                    HistoryHash._updateIframe(lastUrlHash);
                }
            }, win);

            // Watch the iframe hash in order to detect back/forward navigation.
            Y.later(50, null, function () {
                var iframeHash = HistoryHash.getIframeHash();

                if (iframeHash !== lastUrlHash) {
                    Y.log('updating URL hash to match iframe hash', 'info', 'history');
                    HistoryHash.setHash(iframeHash);
                }
            }, null, true);
        });
    }
}


}, '3.7.3', {"requires": ["history-hash", "node-base"]});
