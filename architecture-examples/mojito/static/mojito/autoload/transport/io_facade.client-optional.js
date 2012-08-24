/*
 * Copyright (c) 2011-2012, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */


/*jslint anon:true, sloppy:true, nomen:true*/
/*global YUI*/


YUI.add('io-facade', function(Y) {

    var NAME = 'ioFacade',
        Lang = Y.Lang,
        isUndefined = Lang.isUndefined,
        GET = 'GET',
        PROXY_DATA_PARAM = 'post',
        DEFAULT_PROXY_TIMEOUT = 15000,
        _proxyTimeout = null,
        txTimes = {},
        cbs = {},   // keyed by txid
        // dependencies
        _configProvider,
        _transportUtils,
        DefaultIoFacade;


    function _startClock(o) {
        txTimes[o] = new Date();
        // Y.log('Beginning request timer.', 'debug', NAME);
    }


    DefaultIoFacade = function() {
        var inst = {

            setTransportUtils: function(utils) {
                _transportUtils = utils;
            },


            setConfigProvider: function(cfgProvider) {
                _configProvider = cfgProvider;
            },


            /**
             * Executes an io request.
             * @method execute
             * @param {String} url Url to access.
             * @param {Object} data The data to send.
             * @param {String} method GET or POST.
             * @private
             */
            execute: function(txid, url, data, method, cb) {
                var cfg,
                    start,
                    req;

                cbs[txid] = cb;
                data.txid = txid;

                if (!_proxyTimeout) {
                    _proxyTimeout = _configProvider.getProxyTimeout() ||
                        DEFAULT_PROXY_TIMEOUT;
                }

                // TODO: Don't assign to a parameter.
                url = (method === GET) ?
                        _transportUtils.formatUrl(url, '&__r=' +
                            new Date().getTime()) :
                        url;

                cfg = {
                    method: method,
                    data: data,
                    on: {
                        success: this.handleResponse,
                        failure: this.handleResponse,
                        start: _startClock,
                        scope: this
                    },
                    context: this,
                    timeout: _proxyTimeout,

                    // TODO: Refactor Dali to pass through the params instead
                    // of doing this here.
                    headers: {'Content-Type' : 'application/json'}
                };

                // Y.log('Handing off request to YUI io.', 'info', NAME);
                // start = timer();

                req = Y.io(url, cfg);

                //save start time for profiling.
                return req;
            },


            /**
             * Simulate a server response
             * @method _simulateResponse
             * @param {Number} id the id of the transaction.
             * @param {Object} details the details of the response.
             * @param {Boolean} badcookie Optional. If true simulate cookies
             *     turned off.
             * @private
             */
            _simulateResponse: function(id, details, badcookie) {
                //this is needed, because this method should always be present,
                //testing for it will fail in IE6 because of the COM+ bridge
                details.getResponseHeader = function() { return ''; };

                if (badcookie) {
                    this.handleResponse(id, details, true);
                } else {
                    this.handleResponse(id, details, false);
                }
            },


            handleResponse: function(id, o, badcookie) {
                var time = (new Date()) - txTimes[id],
                    respData,
                    txId,
                    callback;

                try {
                    respData = Y.JSON.parse(o.responseText);
                    txId = respData.resps[0].txId,
                    callback = cbs[txId];
                } catch (e) {
                    respData = e.message;
                    txId = null;
                    callback = null;
                }

                delete cbs[txId];
                this.fire('transactionResponse', {
                    type: 'transactionResponse',
                    id: id,
                    resp: o,
                    responseData: respData,
                    badcookie: badcookie,
                    cb: callback,
                    time: time
                },
                    NAME);
                // Y.log('Request success received, stopping timer. Length: ' +
                //     time + 'ms', 'debug', NAME);
            }
        };

        return new Y.Dali.Bean(inst);
    };

    DefaultIoFacade.NAME = NAME;

    Y.Dali.beanRegistry.registerBean(NAME, DefaultIoFacade);

}, '1.6.3', {requires: [
    'breg',
    'dali-bean'
]});
