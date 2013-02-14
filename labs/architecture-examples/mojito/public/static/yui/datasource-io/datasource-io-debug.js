/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('datasource-io', function (Y, NAME) {

/**
 * Provides a DataSource implementation which can be used to retrieve data via the IO Utility.
 *
 * @module datasource
 * @submodule datasource-io
 */

/**
 * IO subclass for the DataSource Utility.
 * @class DataSource.IO
 * @extends DataSource.Local
 * @constructor
 */    
var DSIO = function() {
    DSIO.superclass.constructor.apply(this, arguments);
};
    

    /////////////////////////////////////////////////////////////////////////////
    //
    // DataSource.IO static properties
    //
    /////////////////////////////////////////////////////////////////////////////
Y.mix(DSIO, {
    /**
     * Class name.
     *
     * @property NAME
     * @type String
     * @static     
     * @final
     * @value "dataSourceIO"
     */
    NAME: "dataSourceIO",


    /////////////////////////////////////////////////////////////////////////////
    //
    // DataSource.IO Attributes
    //
    /////////////////////////////////////////////////////////////////////////////

    ATTRS: {
        /**
         * Pointer to IO Utility.
         *
         * @attribute io
         * @type Y.io
         * @default Y.io
         */
        io: {
            value: Y.io,
            cloneDefaultValue: false
        },
        
        /**
         * Default IO Config.
         *
         * @attribute ioConfig
         * @type Object
         * @default null
         */
         ioConfig: {
            value: null
         }
    }
});
    
Y.extend(DSIO, Y.DataSource.Local, {
    /**
    * Internal init() handler.
    *
    * @method initializer
    * @param config {Object} Config object.
    * @private
    */
    initializer: function(config) {
        this._queue = {interval:null, conn:null, requests:[]};
    },

    /**
    * IO success callback.
    *
    * @method successHandler
    * @param id {String} Transaction ID.
    * @param response {String} Response.
    * @param e {Event.Facade} Event facade.
    * @private
    */
    successHandler: function (id, response, e) {
        var defIOConfig = this.get("ioConfig"),
            payload = e.details[0];

        delete Y.DataSource.Local.transactions[e.tId];

        payload.data = response;
        this.fire("data", payload);

        Y.log("Received IO data response for \"" + e.request + "\"", "info", "datasource-io");

        if (defIOConfig && defIOConfig.on && defIOConfig.on.success) {
            defIOConfig.on.success.apply(defIOConfig.context || Y, arguments);
        }
    },

    /**
    * IO failure callback.
    *
    * @method failureHandler
    * @param id {String} Transaction ID.
    * @param response {String} Response.
    * @param e {Event.Facade} Event facade.
    * @private
    */
    failureHandler: function (id, response, e) {
        var defIOConfig = this.get("ioConfig"),
            payload = e.details[0];
        
        delete Y.DataSource.Local.transactions[e.tId];

        payload.error = new Error("IO data failure");
        Y.log("IO data failure", "error", "datasource-io");

        payload.data = response;
        this.fire("data", payload);

        Y.log("Received IO data failure for \"" + e.request + "\"", "info", "datasource-io");

        if (defIOConfig && defIOConfig.on && defIOConfig.on.failure) {
            defIOConfig.on.failure.apply(defIOConfig.context || Y, arguments);
        }
    },
    
    /**
    * @property _queue
    * @description Object literal to manage asynchronous request/response
    * cycles enabled if queue needs to be managed (asyncMode/ioConnMode):
    * <dl>
    *     <dt>interval {Number}</dt>
    *         <dd>Interval ID of in-progress queue.</dd>
    *     <dt>conn</dt>
    *         <dd>In-progress connection identifier (if applicable).</dd>
    *     <dt>requests {Object[]}</dt>
    *         <dd>Array of queued request objects: {request:request, callback:callback}.</dd>
    * </dl>
    * @type Object
    * @default {interval:null, conn:null, requests:[]}
    * @private
    */
    _queue: null,

    /**
     * Passes query string to IO. Fires <code>response</code> event when
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
        var uri = this.get("source"),
            io = this.get("io"),
            defIOConfig = this.get("ioConfig"),
            request = e.request,
            cfg = Y.merge(defIOConfig, e.cfg, {
                on: Y.merge(defIOConfig, {
                    success: this.successHandler,
                    failure: this.failureHandler
                }),
                context: this,
                "arguments": e
            });
        
        // Support for POST transactions
        if(Y.Lang.isString(request)) {
            if(cfg.method && (cfg.method.toUpperCase() === "POST")) {
                cfg.data = cfg.data ? cfg.data+request : request;
            }
            else {
                uri += request;
            }
        }
        Y.DataSource.Local.transactions[e.tId] = io(uri, cfg);
        return e.tId;
    }
});
  
Y.DataSource.IO = DSIO;


}, '3.7.3', {"requires": ["datasource-local", "io-base"]});
