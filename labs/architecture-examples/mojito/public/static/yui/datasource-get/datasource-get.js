/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('datasource-get', function (Y, NAME) {

/**
 * Provides a DataSource implementation which can be used to retrieve data via the Get Utility.
 *
 * @module datasource
 * @submodule datasource-get
 */

/**
 * Get Utility subclass for the DataSource Utility.
 * @class DataSource.Get
 * @extends DataSource.Local
 * @constructor
 */    
var DSGet = function() {
    DSGet.superclass.constructor.apply(this, arguments);
};
    
    
Y.DataSource.Get = Y.extend(DSGet, Y.DataSource.Local, {
    /**
     * Passes query string to Get Utility. Fires <code>response</code> event when
     * response is received asynchronously.
     *
     * @method _defRequestFn
     * @param e {Event.Facade} Event Facade with the following properties:
     * <dl>
     * <dt>tId (Number)</dt> <dd>Unique transaction ID.</dd>
     * <dt>request (Object)</dt> <dd>The request.</dd>
     * <dt>callback (Object)</dt> <dd>The callback object with the following properties:
     *     <dl>
     *         <dt>success (Function)</dt> <dd>Success handler.</dd>
     *         <dt>failure (Function)</dt> <dd>Failure handler.</dd>
     *     </dl>
     * </dd>
     * <dt>cfg (Object)</dt> <dd>Configuration object.</dd>
     * </dl>
     * @protected
     */
    _defRequestFn: function(e) {
        var uri  = this.get("source"),
            get  = this.get("get"),
            guid = Y.guid().replace(/\-/g, '_'),
            generateRequest = this.get( "generateRequestCallback" ),
            payload = e.details[0],
            self = this;

        /**
         * Stores the most recent request id for validation against stale
         * response handling.
         *
         * @property _last
         * @type {String}
         * @protected
         */
        this._last = guid;

        // Dynamically add handler function with a closure to the callback stack
        // for access to guid
        YUI.Env.DataSource.callbacks[guid] = function(response) {
            delete YUI.Env.DataSource.callbacks[guid];
            delete Y.DataSource.Local.transactions[e.tId];

            var process = self.get('asyncMode') !== "ignoreStaleResponses" ||
                          self._last === guid;

            if (process) {
                payload.data = response;

                self.fire("data", payload);
            } else {
            }

        };

        // Add the callback param to the request url
        uri += e.request + generateRequest.call( this, guid );


        Y.DataSource.Local.transactions[e.tId] = get.script(uri, {
            autopurge: true,
            // Works in Firefox only....
            onFailure: function (o) {
                delete YUI.Env.DataSource.callbacks[guid];
                delete Y.DataSource.Local.transactions[e.tId];

                payload.error = new Error(o.msg || "Script node data failure");


                self.fire("data", payload);
            },
            onTimeout: function(o) {
                delete YUI.Env.DataSource.callbacks[guid];
                delete Y.DataSource.Local.transactions[e.tId];

                payload.error = new Error(o.msg || "Script node data timeout");


                self.fire("data", payload);
            }
        });

        return e.tId;
    },


    /**
     * Default method for adding callback param to url.  See
     * generateRequestCallback attribute.
     *
     * @method _generateRequest
     * @param guid {String} unique identifier for callback function wrapper
     * @protected
     */
     _generateRequest: function (guid) {
        return "&" + this.get("scriptCallbackParam") +
                "=YUI.Env.DataSource.callbacks." + guid;
    }

}, {

    /**
     * Class name.
     *
     * @property NAME
     * @type String
     * @static     
     * @final
     * @value "dataSourceGet"
     */
    NAME: "dataSourceGet",


    ////////////////////////////////////////////////////////////////////////////
    //
    // DataSource.Get Attributes
    //
    ////////////////////////////////////////////////////////////////////////////
    ATTRS: {
        /**
         * Pointer to Get Utility.
         *
         * @attribute get
         * @type Y.Get
         * @default Y.Get
         */
        get: {
            value: Y.Get,
            cloneDefaultValue: false
        },

        /**
         * Defines request/response management in the following manner:
         * <dl>
         *     <!--<dt>queueRequests</dt>
         *     <dd>If a request is already in progress, wait until response is
         *     returned before sending the next request.</dd>
         *     <dt>cancelStaleRequests</dt>
         *     <dd>If a request is already in progress, cancel it before
         *     sending the next request.</dd>-->
         *     <dt>ignoreStaleResponses</dt>
         *     <dd>Send all requests, but handle only the response for the most
         *     recently sent request.</dd>
         *     <dt>allowAll</dt>
         *     <dd>Send all requests and handle all responses.</dd>
         * </dl>
         *
         * @attribute asyncMode
         * @type String
         * @default "allowAll"
         */
        asyncMode: {
            value: "allowAll"
        },

        /**
         * Callback string parameter name sent to the remote script. By default,
         * requests are sent to
         * &#60;URI&#62;?&#60;scriptCallbackParam&#62;=callbackFunction
         *
         * @attribute scriptCallbackParam
         * @type String
         * @default "callback"
         */
        scriptCallbackParam : {
            value: "callback"
        },

        /**
         * Accepts the DataSource instance and a callback ID, and returns a callback
         * param/value string that gets appended to the script URI. Implementers
         * can customize this string to match their server's query syntax.
         *
         * @attribute generateRequestCallback
         * @type Function
         */
        generateRequestCallback : {
            value: function () {
                return this._generateRequest.apply(this, arguments);
            }
        }
    }
});
  
YUI.namespace("Env.DataSource.callbacks");


}, '3.7.3', {"requires": ["datasource-local", "get"]});
