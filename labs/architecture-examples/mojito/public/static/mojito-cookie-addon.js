/*
 * Copyright (c) 2011-2013, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */


/*jslint anon:true, sloppy:true*/
/*global YUI*/


/**
 * @module ActionContextAddon
 */
YUI.add('mojito-cookie-addon', function(Y, NAME) {

    /**
     * <strong>Access point:</strong> <em>ac.cookie.*</em>
     * This client-side cookie add-on allows you to easily use cookies. This API
     * matches the YUI Cookie API exactly.
     * http://developer.yahoo.com/yui/3/api/Cookie.html
     * @class Cookie.client
     */
    function Addon(command, adapter, ac) {
        var cookieFns = [
            'exists',
            'get',
            'getSub',
            'getSubs',
            'remove',
            'removeSub',
            'set',
            'setSub',
            'setSubs'
        ];

        Y.Array.each(cookieFns, function(fn) {
            this[fn] = function() {
                return Y.Cookie[fn].apply(Y.Cookie, arguments);
            };
        }, this);
    }


    Addon.prototype = {
        namespace: 'cookie'
    };

    Y.namespace('mojito.addons.ac').cookie = Addon;

}, '0.1.0', {requires: [
    'cookie',
    'mojito',
    'mojito-meta-addon'
]});
