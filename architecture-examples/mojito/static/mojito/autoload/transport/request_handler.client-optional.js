/*
 * Copyright (c) 2011-2012, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */


/*jslint anon:true, sloppy:true, nomen:true*/
/*global YUI*/


YUI.add('request-handler', function(Y) {

    var NAME = 'requestHandler',
        OK = 'ok',
        E_ABORT = 'abort',
        E_TIMEOUT = 'timeout',
        //disable types
        E_DISABLED_WITH_QUEUE = 2,
        E_DISABLED_WITHOUT_QUEUE = 1,
        E_ENABLED = 0,
        //error types
        E_SERVER = 'server',
        E_RESULT_BADFORMAT = 'badformat',
        E_UNSUPPORTED = 'unsupported',
        E_GATEWAY_TIMEOUT = 'Gateway Timeout',
        //events
        REQUEST_EV = 'request',
        RESPONSE_EV = 'response',
        //callback names
        FAILURE_CB = 'failure',
        ERROR = 'error',
        //YUI method shortcuts
        Lang = Y.Lang,
        isFunction = Lang.isFunction,
        isObject = Lang.isObject,
        isUndefined = Lang.isUndefined,
        isNull = Lang.isNull,
        _disabled = E_ENABLED,
        _requestProps = null,
        txId = 0,
        // dependencies
        _requestor,
        _modulePlatform,
        _requestFormatter,
        _serviceRegistry,
        _registrationProvider,
        _responseProcessor,
        _ioFacade,
        _errorReporter,
        _configProvider,
        RequestHandler;


    function reportUnsupportedOperation(name) {
        _errorReporter.error(E_UNSUPPORTED, '"' + NAME +
            '" does not support operation: ' + name);
    }


    /**
     * Adds the request to the queue for processing
     * @param {Object} requestObject the request Id.
     * @param {Object} cb callback object.
     * @param {Number} id the id of the module making the request.
     * @return {Number} the id of the request for tracking.
     * @private
     */
    function _processRequest(requestObject, cb, id) {
        var r,
            request = {
                requestObject: requestObject,
                moduleId: id,
                originId: id
            };

        if (requestObject.moduleId) {
            request.targetId = requestObject.moduleId;
        }

        // so the transport bean can fire through YUI3
        this.fire(REQUEST_EV, {
            type: REQUEST_EV,
            request: request.requestObject,
            originId: request.originId
        }, NAME);

        r = _requestFormatter.formatRequest(txId += 1, request);

        _requestor.doRequest({
            request: r,
            callback: cb,
            immediate: true,
            forcepost: requestObject.forcepost
        });
    }


    /**
      * once a request has been finished (either complete or aborted)
      * this method handles the final tasks of firing events, formatting
      * responses registering any modules found, and calling callbacks
      * @private
      */
    function completeRequest(arg0) {
        var response = arg0.response || {},
            method = arg0.method,
            result = arg0.result,
            cb = arg0.cb,
            resultDetail = arg0.resultDetail,
            mods = null,
            res = null,
            arg,
            j,
            defaultCallbackWrapper,
            failureCallbackWrapper,
            mgr,
            mlen;

        response.result = result || OK;
        response.resultDetail = resultDetail || '';

        // Y.log('Firing response event.', 'debug', NAME);

        this.fire(RESPONSE_EV, {type: RESPONSE_EV, response: response}, NAME);

        if (isObject(response.data)) {
            res = response.data.res;
            mods = response.data.mods;
        }

        if (isObject(mods)) {
            // Y.log('Module found in response.', 'debug', NAME);

            if (mods[0].state && mods[0].state.defer) {
                // this is a multiple retry situation
                // Y.log('Module is marked defered, but this request handler ' +
                //     ' does not handle defers.', 'warn', NAME);

                // gave up on retries, this is a timeout.
                response.status = 504;
                response.statusText = E_GATEWAY_TIMEOUT;
                method = FAILURE_CB;
            }

            for (j = 0, mlen = mods.length; j < mlen; j) {
                if (mods[j].props && mods[j].props.id) {
                    // make sure its a real module config
                    // Y.log('Registering module with platform. Not starting',
                    //     'debug', NAME);
                    _modulePlatform.registerModule(mods[j]);
                }
            }
        }

        response = _responseProcessor.createResponseObject(response);

        cb = response.cb || cb;

        if (!isUndefined(cb.argument)) {
            response.argument = cb.argument; // this is to support existing code
            arg = cb.argument;
        }

        if (isFunction(cb[method])) {
            // Y.log('Dispatching callbacks', 'debug', NAME);
            defaultCallbackWrapper =
                Y.bind(cb[method], cb.scope || this, response, arg);
            failureCallbackWrapper =
                Y.bind(cb[FAILURE_CB], cb.scope || this, response, arg);

            if (isObject(res)) {
                mgr = _serviceRegistry.getService('resourcemgr');
                mgr.load(res, {
                    success: defaultCallbackWrapper,
                    failure: failureCallbackWrapper
                }, _configProvider.getProxyTimeout());
            } else {
                defaultCallbackWrapper();
            }
        }
    }


    /**
     * Process a complete transaction.
     * @private
     */
    function processTransactionResponse(arg0) {

        var bc = arg0.badcookie || false,
            ioResponseObj = arg0.resp,
            responseData = arg0.responseData,
            cb = arg0.cb,
            txId = arg0.id,
            status = ioResponseObj.status,
            rd = '',
            r = ERROR,
            responseText,
            contentType;

        // TODO: What about 304 (Not changed) ?
        if (status !== 200 && status !== 201 && status !== OK) {

            // Y.log('Error response received from server.', 'warn', NAME);
            // this is an error case
            // server failure single '=' just in case we get a '200' string
            if (status === 0) {
                r = (ioResponseObj.statusText === E_TIMEOUT) ?
                        E_TIMEOUT :
                        E_ABORT;
            } else {
                rd = E_SERVER;
                _errorReporter.error(E_SERVER, 'A server error occurred: ',
                    { responseObject: ioResponseObj });
            }

            completeRequest.call(this, {
                txId: txId,
                method: FAILURE_CB,
                result: r,
                resultDetail: rd + ' ' + status,
                cb: cb
            });
        } else {
            //not an error
            // Y.log('Valid response received, processing...', 'warn', NAME);

            responseText = ioResponseObj.responseText;
            contentType = ioResponseObj.getResponseHeader('Content-Type');

            // Test here is faster than regex.
            if (contentType.indexOf('Multipart/Related') !== -1) {
                reportUnsupportedOperation('multi-part response');
                completeRequest.call(this, {
                    cb: cb,
                    method: FAILURE_CB,
                    result: ERROR,
                    resultDetail: E_RESULT_BADFORMAT
                });
                return;
            }

            _responseProcessor.processResponse(responseData.resps[0],
                { cb: cb }, bc);
        }
    }


    RequestHandler = function() {
        var inst = {

            setRequestor: function(requestor) {
                _requestor = requestor;
            },


            setModulePlatform: function(platform) {
                _modulePlatform = platform;
            },


            setReqFormatter: function(formatter) {
                _requestFormatter = formatter;
            },


            getRequestFormatter: function() {
                return _requestFormatter;
            },


            setServiceRegistry: function(provider) {
                _serviceRegistry = provider;
            },


            setRegistrationProvider: function(provider) {
                _registrationProvider = provider;
            },


            setResponseProcessor: function(processor) {
                if (_responseProcessor) { _responseProcessor.detach(); }
                _responseProcessor = processor;
                _responseProcessor.on('responseProcessed', completeRequest,
                    this);
            },


            getResponseProcessor: function() {
                return _responseProcessor;
            },


            setIoFacade: function(facade) {
                if (_ioFacade) { _ioFacade.detach(); }
                _ioFacade = facade;
                _ioFacade.on('transactionResponse', processTransactionResponse,
                    this);
            },


            getIoFacade: function() {
                return _ioFacade;
            },


            setConfigProvider: function(provider) {
                _configProvider = provider;
            },


            getConfigProvider: function() {
                return _configProvider;
            },


            setErrorReporter: function(reporter) {
                _errorReporter = reporter;
            },


            replaceRequestFormatter: function(requestType, formatter) {
                _requestFormatter.replaceRequestFormatter(requestType,
                    formatter);
            },


            replaceResponseFormatter: function(formatter) {
                _responseProcessor.replaceResponseFormatter(formatter);
            },


            disable: function(queue) {
                // Y.log('Disabling transport. Queue state: '+ queue, 'debug',
                //     NAME);
                _disabled = queue ?
                        E_DISABLED_WITH_QUEUE :
                        E_DISABLED_WITHOUT_QUEUE;
            },


            enable: function(queue) {
                // Y.log('Enabling transport', 'debug', NAME);
                _disabled = E_ENABLED;
            },


            isEnabled: function() {
                return _disabled !== E_DISABLED_WITHOUT_QUEUE;
            },


            processRequest: _processRequest,


            abortRequest: function(requestId, moduleId) {
                reportUnsupportedOperation('abortRequest');
            },


            abortModuleRequests: function(moduleId) {
                reportUnsupportedOperation('abortModuleRequests');
            },


            isRequestPending: function(requestId, moduleId) {
                reportUnsupportedOperation('isRequestPending');
            }
        };

        return new Y.Dali.Bean(inst);
    };

    RequestHandler.NAME = NAME;

    Y.Dali.beanRegistry.registerBean(NAME, RequestHandler);

}, '1.6.3', {requires: [
    'dali-bean',
    'breg'
]});
