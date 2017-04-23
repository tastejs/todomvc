/*
 * Copyright (c) 2011-2012, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */


/*jslint anon:true, sloppy:true*/
/*global YUI*/


YUI.add('transport-utils', function(Y) {

    var NAME = 'transportUtils';

    function TransportUtils() {
        return {
            formatUrl: function(url, data) {
                return url + ((url.indexOf('?') === -1) ? '?' : '&') + data;
            }
        };
    }

    TransportUtils.NAME = NAME;

    Y.Dali.beanRegistry.registerBean(NAME, TransportUtils);

}, '1.6.3', {requires: [
    'breg'
]});
