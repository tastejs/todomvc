/*
 * Copyright (c) 2011-2012, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */


/*jslint anon:true, sloppy:true, nomen:true*/
/*global YUI*/


YUI.add('response-processor', function(Y) {

    var NAME = 'responseProcessor',
        OK = 'ok',
        Lang = Y.Lang,
        isUndefined = Lang.isUndefined,
        ERROR = 'error',

        //error types
        E_BROWSER = 'browser',
        E_CRUMB = 'crumb',
        //result detail types
        E_RESULT_NOCOOKIES = 'nocookies',
        E_RESULT_BADCRUMB = 'badcrumb',

        // beans
        _responseFormatter,
        _errorReporter,
        _configProvider,
        ResponseProcessor;


    /**
     * creates a mimic of the yui response object
     * for use in web service calls
     * @param {DaliResponseWs} response the response from the daliProxy.
     * @return {Object} formated response object.
     * @private
     */
    function _createWebServiceResponseObject(response) {

        // Y.log('Building web service response object', 'info', NAME);

        var myData = Y.Object(response.data),
            headerHash = false, // cache the header lookup for later after
                                // first time
            respHeaderFlag = false; //save string replace until needed


        myData.getResponseHeader = function(header) {
            var headerList,
                len,
                i,
                tmparr;

            // don't bother processing this unless someone wants it.
            if (!headerHash) {
                // to comply with yui io docs.
                this.responseHeader =
                    myData.responseHeader.replace('\r\n', '\n');
                respHeaderFlag = true;
                headerList = myData.responseHeader.split('\n');
                len = headerList.length;
                headerHash = {};
                for (i = 0; i < len; i += 1) {
                    tmparr = headerList[i].split(': ');
                    headerHash[tmparr[0]] = tmparr[1];
                }
            }

            return headerHash[header];
        };


        myData.getAllResponseHeaders = function() {
            if (!respHeaderFlag) {
                // to comply with yui io docs.
                this.responseHeader =
                    myData.responseHeader.replace('\r\n', '\n');
            }
            return this.responseHeader;
        };

        return Y.mix(response, myData);
    }


    ResponseProcessor = function() {
        var inst = {

            setConfigProvider: function(provider) {
                _configProvider = provider;
            },


            setRespFormatter: function(formatter) {
                _responseFormatter = formatter;
            },


            setErrorReporter: function(reporter) {
                _errorReporter = reporter;
            },


            replaceResponseFormatter: function(formatter) {
                _responseFormatter.replaceResponseFormatter(formatter);
            },


            processResponse: function(o, metaData, badcookie) {
                var txId = o.txId,
                    fail = true,
                    response,
                    result,
                    resultDetail,
                    errorType,
                    message;

                if (isUndefined(metaData)) {
                    // this will happen if the request was aborted before it was
                    // sent
                    return;
                }

                response = {
                    data: o.data
                };

                response.cb = metaData.cb;
                // TODO: replace with a "wasSuccessful()" call. Need to support
                // 304 etc.
                if (o.status === 200 || o.status === 201) {
                    response.status = OK;
                    response.result = OK;
                    result = OK;
                    fail = false;
                } else {
                    response.status = ERROR;
                    response.result = ERROR;
                    if (o.status === 400) {
                        errorType = E_CRUMB;
                        message = 'Invalid crumb.';
                        resultDetail = E_RESULT_BADCRUMB;
                        result = ERROR;

                        if (!window.navigator.cookieEnabled ||
                                badcookie === 'badcookie') {
                            errorType = E_BROWSER;
                            resultDetail = E_RESULT_NOCOOKIES;
                            message = 'Cookies are disabled';
                        }

                        _errorReporter.error(errorType, message);
                    }
                }

                this.fire('responseProcessed', {
                    type: 'responseProcessed',
                    txId: txId,
                    response: response,
                    method: (fail ? 'failure' : 'success'),
                    result: result,
                    resultDetail: resultDetail
                }, NAME);
            },


            createResponseObject: function(response, platform) {
                // Y.log('Building response object', 'debug', NAME);

                if (response.data && response.data.responseText) {
                    // this will only happen for webservice responses...sure...
                    // Y.log('This looks like a proxied web service request,' +
                    //     ' passing to WS formatter', 'debug', NAME);
                    return _createWebServiceResponseObject(response);
                } else {
                    // support a wrong implementation in old daliTransport
                    // porting the mistake forward.
                    if (response.data) {
                        if (response.data.mods) {
                            // this is for backwards compatibility
                            response.mods = response.data.mods;
                            // this is the correct format
                            response.mod = response.mods[0];
                            delete response.data.mods;
                        }

                        if (response.data.html) {
                            response.html = response.data.html;
                            delete response.data.html;
                        }

                        if (response.data.res) {
                            response.res = response.data.res;
                            delete response.data.res;
                        }
                    }

                    response = _responseFormatter.formatResponse(response);
                    // no op.
                    return response;
                }
            }
        };
        return new Y.Dali.Bean(inst);
    };

    ResponseProcessor.NAME = NAME;

    Y.Dali.beanRegistry.registerBean(NAME, ResponseProcessor);

}, '1.6.3', {requires: [
    'dali-bean',
    'breg'
]});
