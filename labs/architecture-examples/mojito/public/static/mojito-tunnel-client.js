/*
 * Copyright (c) 2011-2013, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */


/*jslint anon:true, sloppy:true, nomen:true*/
/*global YUI*/


YUI.add('mojito-tunnel-client', function(Y, NAME) {

    function TunnelClient(appConfig) {
        this._appConfig = appConfig;
    }


    TunnelClient.prototype = {

        rpc: function(command, adapter) {
            var url,
                cfg,
                req;

            url = this._appConfig.tunnelPrefix;

            cfg = {
                method: 'POST',
                data: Y.JSON.stringify(command),
                on: {
                    success: function (id, resp, args) {
                        Y.log('rpc success', 'debug', NAME);
                        try {
                            resp = Y.JSON.parse(resp.responseText);
                            adapter.done(resp.data.html, resp.data.meta);
                        } catch (e) {
                            adapter.error(e.message);
                        }
                    },
                    failure: function (id, resp, args) {
                        Y.log('rpc failure!', 'warn', NAME);
                        try {
                            resp = Y.JSON.parse(resp.responseText);
                            adapter.error(resp.data.html);
                        } catch (e) {
                            adapter.error(e.message);
                        }
                    },
                    scope: this
                },
                context: this,
                timeout: this._appConfig.tunnelTimeout || 10000,
                headers: {'Content-Type' : 'application/json'}
            };

            req = this._makeRequest(url, cfg);

            return req;
        },

        _makeRequest: function (url, cfg) {
            return Y.io(url, cfg);
        }
    };

    Y.namespace('mojito').TunnelClient = TunnelClient;

}, '0.1.0', {requires: [
    'mojito',
    'io-base',
    'json-stringify',
    'json-parse'
]});
