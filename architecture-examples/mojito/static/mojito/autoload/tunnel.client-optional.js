/*
 * Copyright (c) 2011-2012, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */


/*jslint anon:true, sloppy:true, nomen:true*/
/*global YUI*/


YUI.add('mojito-tunnel-client', function(Y, NAME) {

    function TunnelClient(appConfig) {
        this._appConfig = appConfig;

        var errorReporter = {
            error: function(type, msg) {
                throw new Error('TRANSPORT ERROR: ' + type + ' : ' + msg);
            }
        },
            configProvider = {

                getProxyUrl: function() {
                    return appConfig.tunnelPrefix;
                },

                getDaliProperties: function() {
                    return {};
                },

                getProxyTimeout: function() {
                    return 10000;
                }
            };

        Y.Dali.beanRegistry.registerBean('errorReporter', errorReporter);
        Y.Dali.beanRegistry.registerBean('configProvider', configProvider);
        Y.Dali.beanRegistry.doInjection();
        this._transport = Y.Dali.beanRegistry.getBean('transport');
    }


    TunnelClient.prototype = {

        rpc: function(command, adapter) {

            // the RPC tunnel always sends JSON POST data
            command.forcepost = true;

            this._transport.makeRequest(command, {

                success: function(resp) {
                    Y.log('rpc success', 'debug', NAME);
                    adapter.done(resp.html, resp.data.meta);
                },

                failure: function(resp) {
                    Y.log('rpc failure!', 'warn', NAME);
                    adapter.error(resp.html);
                }
            });
        }
    };

    Y.namespace('mojito').TunnelClient = TunnelClient;

}, '0.1.0', {requires: [
    'breg',
    'querystring-stringify-simple',
    'mojito',
    'dali-transport-base',
    'request-handler',
    'simple-request-formatter',
    'requestor',
    'io-facade',
    'response-formatter',
    'response-processor'
]});
