/*
 * Copyright (c) 2011-2012, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */


/*jslint anon:true, sloppy:true, nomen:true*/
/*global YUI*/


YUI.add('response-formatter', function(Y) {

    var NAME = 'respFormatter';


    function _defaultFormatter(resp) {
        return resp;
    }


    function ResponseFormatter() {
        return {

            formatResponse: _defaultFormatter,

            replaceResponseFormatter: function(formatter) {
                this.formatResponse = formatter;
            }
        };
    }

    ResponseFormatter.NAME = NAME;

    Y.Dali.beanRegistry.registerBean(NAME, ResponseFormatter);

}, '1.6.3', {requires: [
    'breg'
]});
