/*
 * Copyright (c) 2011-2012, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */


/*jslint anon:true, sloppy:true, nomen:true*/
/*global YUI*/


YUI.add('dali-transport-base', function(Y) {

    var NAME = 'transport',

        //YUI method shortcuts
        Lang = Y.Lang,
        isArray = Lang.isArray,

        // events
        INJECTION_COMPLETE = 'injd',

        // beans
        _requestHandler,
        Transport;


    Transport = function() {

        var inst = {

            name: NAME,


            setRequestHandler: function(handler) {
                if (_requestHandler) {
                    _requestHandler.removeTarget(this);
                    _requestHandler.detach();
                }
                _requestHandler = handler;
                // bubble up request events
                _requestHandler.addTarget(this);
            },


            getRequestHandler: function() {
                return _requestHandler;
            },


            /**
             * Disables all Ajax requests for the application.
             * @method disable
             * @param {Boolean} queue (Optional) When set to true, queues all
             *     requests while disabled.
             */
            disable: function(queue) {
                _requestHandler.disable(queue);
            },


            /**
             * Enables sending of requests.
             * @method enable
             */
            enable: function() {
                _requestHandler.enable();
            },


            isEnabled: function() {
                return _requestHandler.isEnabled();
            },


            makeRequest: function(data, callback, id) {
                var i,
                    len;

                // Y.log('Making request...', 'info', NAME);
                if (_requestHandler.isEnabled()) {
                    if (isArray(data) && data.length > 1) {
                        for (i = 0, len = data.length; i < len; i += 1) {
                            // all arrays of requests are assumed to be
                            // batchable by default
                            if (data[i].batchable === undefined) {
                                data[i].batchable = true;
                            }
                            _requestHandler.processRequest(data[i], callback,
                                id);
                        }
                        return null; //no trackable id for an array
                    } else {
                        return _requestHandler.processRequest(
                            (isArray(data) ?
                                    data[0] :
                                    data),
                            callback,
                            id
                        );
                    }
                } else {
                    // Y.log('Transport is disabled!', 'warn', NAME);
                    return false;
                }
            },


            getMetrics: function(requestId) {
                return _requestHandler.getMetrics(requestId);
            },


            clearMetrics: function(requestId) {
                _requestHandler.clearMetrics(requestId);
            },


            abortRequest: function(requestId, moduleId) {
                return _requestHandler.abortRequest(requestId, moduleId);
            },


            abortModuleRequests: function(moduleId) {
                return _requestHandler.abortModuleRequests(moduleId);
            },


            isRequestPending: function(requestId, moduleId) {
                return _requestHandler.isRequestPending(requestId, moduleId);
            },


            /**
             * Sets the request formatter function for a given request type.
             * @method setRequestFormatter
             * @param {String} requestType The type of request that the
             *     formatter should handle.
             * @param {Function} formatter The function to call to format the
             *     request.
             */
            setRequestFormatter: function(requestType, formatter) {
                _requestHandler.replaceRequestFormatter(requestType, formatter);
            },


            /**
             * Sets the response formatter function for all responses.
             * @method setResponseFormatter
             * @param {Function} formatter The function to call to format the
             *     response object.
             */
            setResponseFormatter: function(formatter) {
                _requestHandler.replaceResponseFormatter(formatter);
            },


            /**
             * Called by the bean registry whenever this bean is reinitialized
             * @method destroy
             */
            destroy: function() {
                return true;
            }
        };

        // this will make the transport available globally if there is no Module
        // Platform once all beans have been injected
        Y.Dali.beanRegistry.on(INJECTION_COMPLETE, function() {
            if (!Y.Dali && !Y.Dali.Platform) {
                Y.namespace('Dali');
                Y.Dali.transport = new Transport();
            }
        });

        return new Y.Dali.Bean(inst);
    };

    Transport.NAME = NAME;

    Y.Dali.beanRegistry.registerBean(NAME, Transport);

}, '1.6.3', {requires: [
    'event-custom',
    'breg',
    'dali-bean'
]});
