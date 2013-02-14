/*
 * Copyright (c) 2011-2013, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

/*global YUI*/

/**
 * View engines.
 *
 * Please see the [documentation](http://developer.yahoo.com/cocktails/mojito/docs/topics/mojito_extensions.html#view-engines).
 *
 * @module ViewEngines
 */


/**
 * @Module ViewEngines
 */
YUI.add('mojito-mu', function (Y, NAME) {

    'use strict';

    Y.mojito.addons.viewEngines.mu = Y.mojito.addons.viewEngines.hb;

}, '0.2.0', {requires: [
    'mojito-hb'
]});
