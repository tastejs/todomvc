/*
 * Copyright (c) 2011-2012, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */


/*jslint anon:true, sloppy:true, nomen:true*/
/*global YUI*/


YUI.add('simple-request-formatter', function(Y) {

    var NAME = 'reqFormatter',
        Lang = Y.Lang,
        isString = Lang.isString,
        isUndefined = Lang.isUndefined,
        POST = 'POST',
        GET = 'GET',
        WEB_SERVICE_HANDLER = 'cfg.dali.handler.ws',
        // required beans
        _errorReporter,
        _transportUtils,
        // the request formatter itself
        SimpleRequestFormatter,
        _wsRequestFormatter,
        _requestTypes = {}; // TODO: Added during JSLint pass...verify.


    /**
     * Format web service requests using var foo = function() format
     * so that reset is easier.
     * @method _wsRequestFormatter
     * @return {Object} the formatted request.
     * @private
     */
    _wsRequestFormatter = function(reqData) {
        var handler = WEB_SERVICE_HANDLER,
            batchable = reqData.batchable || false,
            forcePost = false,
            myData;

        if (isUndefined(reqData.method)) {
            //if no method is set for WS_TYPE default to GET
            reqData.method = GET;
        }

        switch (reqData.method.toUpperCase()) {
        case POST:
            // Y.log('Formating POST data', 'info', NAME);
            forcePost = true;
            myData = reqData.data;

            if (!isString(myData)) {
                _errorReporter.error(SimpleRequestFormatter.NAME,
                    'data must be a string');
            } else {
                reqData.data = myData;
            }
            break;
        case (GET || 'DELETE'):
            // Y.log('Formating query string for GET data', 'info', NAME);
            if (reqData.data !== undefined && isString(reqData.data)) {
                reqData.url = _transportUtils.formatUrl(reqData.url,
                    reqData.data);
            }
            break;
        default:
            // Y.log('passing' + reqData.method + ' request unmodified',
            //     'warn', NAME);
        }

        return {
            handler: handler,
            data: reqData,
            batchable: batchable,
            forcepost: forcePost,
            targetId: reqData.url
        };
    };


    SimpleRequestFormatter = function() {
        return {

            setErrorReporter: function(it) {
                _errorReporter = it;
            },


            setTransportUtils: function(utils) {
                _transportUtils = utils;
            },


            replaceRequestFormatter: function(requestType, formatter) {
                // Y.log('Replacing request formatter to ' + formatter,
                //     'info', NAME);
                _requestTypes[requestType] = formatter;
            },


            formatRequest: function(txId, req) {
                var reqObj = req.requestObject;

                reqObj = _wsRequestFormatter(reqObj, req.moduleId);
                reqObj.txId = txId;

                if (isUndefined(req.targetId)) {
                    req.targetId = reqObj.targetId;
                }

                reqObj.handler = WEB_SERVICE_HANDLER;
                return reqObj;
            }
        };
    };

    SimpleRequestFormatter.NAME = NAME;

    Y.Dali.beanRegistry.registerBean(NAME, SimpleRequestFormatter);

}, '1.6.3', {requires: [
    'breg'
]});
