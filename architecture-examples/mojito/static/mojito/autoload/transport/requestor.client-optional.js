/*
 * Copyright (c) 2011-2012, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */


/*jslint anon:true, sloppy:true, nomen:true*/
/*global YUI*/


YUI.add('requestor', function(Y) {

    var NAME = 'requestor',
        POST = 'POST',
        GET = 'GET',
        MAXIMUM_GET_LENGTH = 1500,

        //YUI method shortcuts
        Lang = Y.Lang,
        isNull = Lang.isNull,
        isArray = Lang.isArray,

        _requestProps = null,
        _pendingTransactions = {},

        // bean dependencies
        _ioFacade,
        _configProvider;


    /**
     * finally prepares the request (stringify) and sends it
     * to ioFacade to be sent to the server
     * @private
     * @param {Array} request the request or requests to be sent to the server.
     * @param {Boolean} forcepost if true the request will be sent as a post,
     *                            regardless of length.
     * @return {Object} the transactionObject from io.
     */
    function doRequest(opts) {
        var url = _configProvider.getProxyUrl(),
            request = opts.request,
            cb = opts.callback,
            forcepost = opts.forcepost,
            immediate = opts.immediate,
            req,
            rString,
            m;

        if (typeof forcepost === 'undefined') {
            forcepost = false;
        }
        if (typeof immediate === 'undefined') {
            immediate = false;
        }

        if (isNull(_requestProps)) {
            _requestProps = {};
            _requestProps.dali = _configProvider.getDaliProperties() || {};
        }

        if (!isArray(request)) {
            m = request.method || GET;
            request = [request];
        } else {
            m = GET;
        }

        rString = Y.JSON.stringify({reqs: request, props: _requestProps});

        if ((encodeURIComponent(rString).length > MAXIMUM_GET_LENGTH) ||
                forcepost) {
            m = POST;
        }

        if (immediate) {
            _ioFacade.execute(request[0].txId, url, rString, m, cb);
        } else {
            req = _ioFacade.execute(request[0].txId, url, rString, m);
            _pendingTransactions[req.id] = {
                ioObj: req,
                cfg: request,
                forcepost: forcepost
            };
            return req;
        }
    }


    function Requestor() {
        return {

            setIoFacade: function(facade) {
                _ioFacade = facade;
            },


            setConfigProvider: function(provider) {
                _configProvider = provider;
            },


            setDaliCrumb: function(crumb) {
                _requestProps.dali.crumb = crumb;
            },


            deletePending: function(txId) {
                delete _pendingTransactions[txId];
            },


            getPending: function(txId) {
                return _pendingTransactions[txId];
            },


            doRequest: doRequest
        };
    }

    Requestor.NAME = NAME;

    Y.Dali.beanRegistry.registerBean(NAME, Requestor);

}, '1.6.3', {requires: [
    'json',
    'breg'
]});
