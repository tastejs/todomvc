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
_yuitest_coverage["build/history-hash-ie/history-hash-ie.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/history-hash-ie/history-hash-ie.js",
    code: []
};
_yuitest_coverage["build/history-hash-ie/history-hash-ie.js"].code=["YUI.add('history-hash-ie', function (Y, NAME) {","","/**"," * Improves IE6/7 support in history-hash by using a hidden iframe to create"," * entries in IE's browser history. This module is only needed if IE6/7 support"," * is necessary; it's not needed for any other browser."," *"," * @module history"," * @submodule history-hash-ie"," * @since 3.2.0"," */","","// Combination of a UA sniff to ensure this is IE (or a browser that wants us to","// treat it like IE) and feature detection for native hashchange support (false","// for IE < 8 or IE8/9 in IE7 mode).","if (Y.UA.ie && !Y.HistoryBase.nativeHashChange) {","    var Do          = Y.Do,","        GlobalEnv   = YUI.namespace('Env.HistoryHash'),","        HistoryHash = Y.HistoryHash,","","        iframe = GlobalEnv._iframe,","        win    = Y.config.win;","","    /**","     * Gets the raw (not decoded) current location hash from the IE iframe,","     * minus the preceding '#' character and the hashPrefix (if one is set).","     *","     * @method getIframeHash","     * @return {String} current iframe hash","     * @static","     */","    HistoryHash.getIframeHash = function () {","        if (!iframe || !iframe.contentWindow) {","            return '';","        }","","        var prefix = HistoryHash.hashPrefix,","            hash   = iframe.contentWindow.location.hash.substr(1);","","        return prefix && hash.indexOf(prefix) === 0 ?","                    hash.replace(prefix, '') : hash;","    };","","    /**","     * Updates the history iframe with the specified hash.","     *","     * @method _updateIframe","     * @param {String} hash location hash","     * @param {Boolean} replace (optional) if <code>true</code>, the current","     *   history state will be replaced without adding a new history entry","     * @protected","     * @static","     * @for HistoryHash","     */","    HistoryHash._updateIframe = function (hash, replace) {","        var iframeDoc      = iframe && iframe.contentWindow && iframe.contentWindow.document,","            iframeLocation = iframeDoc && iframeDoc.location;","","        if (!iframeDoc || !iframeLocation) {","            return;","        }","","","        if (replace) {","            iframeLocation.replace(hash.charAt(0) === '#' ? hash : '#' + hash);","        } else {","            iframeDoc.open().close();","            iframeLocation.hash = hash;","        }","    };","","    Do.before(HistoryHash._updateIframe, HistoryHash, 'replaceHash', HistoryHash, true);","","    if (!iframe) {","        Y.on('domready', function () {","            var lastUrlHash = HistoryHash.getHash();","","            // Create a hidden iframe to store history state, following the","            // iframe-hiding recommendations from","            // http://www.paciellogroup.com/blog/?p=604.","            //","            // This iframe will allow history navigation within the current page","            // context. After navigating to another page, all but the most","            // recent history state will be lost.","            //","            // Earlier versions of the YUI History Utility attempted to work","            // around this limitation by having the iframe load a static","            // resource. This workaround was extremely fragile and tended to","            // break frequently (and silently) since it was entirely dependent","            // on IE's inconsistent handling of iframe history.","            //","            // Since this workaround didn't work much of the time anyway and","            // added significant complexity, it has been removed, and IE6 and 7","            // now get slightly degraded history support.","","            iframe = GlobalEnv._iframe = Y.Node.getDOMNode(Y.Node.create(","                '<iframe src=\"javascript:0\" style=\"display:none\" height=\"0\" width=\"0\" tabindex=\"-1\" title=\"empty\"/>'","            ));","","            // Append the iframe to the documentElement rather than the body.","            // Keeping it outside the body prevents scrolling on the initial","            // page load (hat tip to Ben Alman and jQuery BBQ for this","            // technique).","            Y.config.doc.documentElement.appendChild(iframe);","","            // Update the iframe with the initial location hash, if any. This","            // will create an initial history entry that the user can return to","            // after the state has changed.","            HistoryHash._updateIframe(lastUrlHash || '#');","","            // Listen for hashchange events and keep the iframe's hash in sync","            // with the parent frame's hash.","            Y.on('hashchange', function (e) {","                lastUrlHash = e.newHash;","","                if (HistoryHash.getIframeHash() !== lastUrlHash) {","                    HistoryHash._updateIframe(lastUrlHash);","                }","            }, win);","","            // Watch the iframe hash in order to detect back/forward navigation.","            Y.later(50, null, function () {","                var iframeHash = HistoryHash.getIframeHash();","","                if (iframeHash !== lastUrlHash) {","                    HistoryHash.setHash(iframeHash);","                }","            }, null, true);","        });","    }","}","","","}, '3.7.3', {\"requires\": [\"history-hash\", \"node-base\"]});"];
_yuitest_coverage["build/history-hash-ie/history-hash-ie.js"].lines = {"1":0,"16":0,"17":0,"32":0,"33":0,"34":0,"37":0,"40":0,"55":0,"56":0,"59":0,"60":0,"64":0,"65":0,"67":0,"68":0,"72":0,"74":0,"75":0,"76":0,"96":0,"104":0,"109":0,"113":0,"114":0,"116":0,"117":0,"122":0,"123":0,"125":0,"126":0};
_yuitest_coverage["build/history-hash-ie/history-hash-ie.js"].functions = {"getIframeHash:32":0,"_updateIframe:55":0,"(anonymous 3):113":0,"(anonymous 4):122":0,"(anonymous 2):75":0,"(anonymous 1):1":0};
_yuitest_coverage["build/history-hash-ie/history-hash-ie.js"].coveredLines = 31;
_yuitest_coverage["build/history-hash-ie/history-hash-ie.js"].coveredFunctions = 6;
_yuitest_coverline("build/history-hash-ie/history-hash-ie.js", 1);
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
_yuitest_coverfunc("build/history-hash-ie/history-hash-ie.js", "(anonymous 1)", 1);
_yuitest_coverline("build/history-hash-ie/history-hash-ie.js", 16);
if (Y.UA.ie && !Y.HistoryBase.nativeHashChange) {
    _yuitest_coverline("build/history-hash-ie/history-hash-ie.js", 17);
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
    _yuitest_coverline("build/history-hash-ie/history-hash-ie.js", 32);
HistoryHash.getIframeHash = function () {
        _yuitest_coverfunc("build/history-hash-ie/history-hash-ie.js", "getIframeHash", 32);
_yuitest_coverline("build/history-hash-ie/history-hash-ie.js", 33);
if (!iframe || !iframe.contentWindow) {
            _yuitest_coverline("build/history-hash-ie/history-hash-ie.js", 34);
return '';
        }

        _yuitest_coverline("build/history-hash-ie/history-hash-ie.js", 37);
var prefix = HistoryHash.hashPrefix,
            hash   = iframe.contentWindow.location.hash.substr(1);

        _yuitest_coverline("build/history-hash-ie/history-hash-ie.js", 40);
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
    _yuitest_coverline("build/history-hash-ie/history-hash-ie.js", 55);
HistoryHash._updateIframe = function (hash, replace) {
        _yuitest_coverfunc("build/history-hash-ie/history-hash-ie.js", "_updateIframe", 55);
_yuitest_coverline("build/history-hash-ie/history-hash-ie.js", 56);
var iframeDoc      = iframe && iframe.contentWindow && iframe.contentWindow.document,
            iframeLocation = iframeDoc && iframeDoc.location;

        _yuitest_coverline("build/history-hash-ie/history-hash-ie.js", 59);
if (!iframeDoc || !iframeLocation) {
            _yuitest_coverline("build/history-hash-ie/history-hash-ie.js", 60);
return;
        }


        _yuitest_coverline("build/history-hash-ie/history-hash-ie.js", 64);
if (replace) {
            _yuitest_coverline("build/history-hash-ie/history-hash-ie.js", 65);
iframeLocation.replace(hash.charAt(0) === '#' ? hash : '#' + hash);
        } else {
            _yuitest_coverline("build/history-hash-ie/history-hash-ie.js", 67);
iframeDoc.open().close();
            _yuitest_coverline("build/history-hash-ie/history-hash-ie.js", 68);
iframeLocation.hash = hash;
        }
    };

    _yuitest_coverline("build/history-hash-ie/history-hash-ie.js", 72);
Do.before(HistoryHash._updateIframe, HistoryHash, 'replaceHash', HistoryHash, true);

    _yuitest_coverline("build/history-hash-ie/history-hash-ie.js", 74);
if (!iframe) {
        _yuitest_coverline("build/history-hash-ie/history-hash-ie.js", 75);
Y.on('domready', function () {
            _yuitest_coverfunc("build/history-hash-ie/history-hash-ie.js", "(anonymous 2)", 75);
_yuitest_coverline("build/history-hash-ie/history-hash-ie.js", 76);
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

            _yuitest_coverline("build/history-hash-ie/history-hash-ie.js", 96);
iframe = GlobalEnv._iframe = Y.Node.getDOMNode(Y.Node.create(
                '<iframe src="javascript:0" style="display:none" height="0" width="0" tabindex="-1" title="empty"/>'
            ));

            // Append the iframe to the documentElement rather than the body.
            // Keeping it outside the body prevents scrolling on the initial
            // page load (hat tip to Ben Alman and jQuery BBQ for this
            // technique).
            _yuitest_coverline("build/history-hash-ie/history-hash-ie.js", 104);
Y.config.doc.documentElement.appendChild(iframe);

            // Update the iframe with the initial location hash, if any. This
            // will create an initial history entry that the user can return to
            // after the state has changed.
            _yuitest_coverline("build/history-hash-ie/history-hash-ie.js", 109);
HistoryHash._updateIframe(lastUrlHash || '#');

            // Listen for hashchange events and keep the iframe's hash in sync
            // with the parent frame's hash.
            _yuitest_coverline("build/history-hash-ie/history-hash-ie.js", 113);
Y.on('hashchange', function (e) {
                _yuitest_coverfunc("build/history-hash-ie/history-hash-ie.js", "(anonymous 3)", 113);
_yuitest_coverline("build/history-hash-ie/history-hash-ie.js", 114);
lastUrlHash = e.newHash;

                _yuitest_coverline("build/history-hash-ie/history-hash-ie.js", 116);
if (HistoryHash.getIframeHash() !== lastUrlHash) {
                    _yuitest_coverline("build/history-hash-ie/history-hash-ie.js", 117);
HistoryHash._updateIframe(lastUrlHash);
                }
            }, win);

            // Watch the iframe hash in order to detect back/forward navigation.
            _yuitest_coverline("build/history-hash-ie/history-hash-ie.js", 122);
Y.later(50, null, function () {
                _yuitest_coverfunc("build/history-hash-ie/history-hash-ie.js", "(anonymous 4)", 122);
_yuitest_coverline("build/history-hash-ie/history-hash-ie.js", 123);
var iframeHash = HistoryHash.getIframeHash();

                _yuitest_coverline("build/history-hash-ie/history-hash-ie.js", 125);
if (iframeHash !== lastUrlHash) {
                    _yuitest_coverline("build/history-hash-ie/history-hash-ie.js", 126);
HistoryHash.setHash(iframeHash);
                }
            }, null, true);
        });
    }
}


}, '3.7.3', {"requires": ["history-hash", "node-base"]});
