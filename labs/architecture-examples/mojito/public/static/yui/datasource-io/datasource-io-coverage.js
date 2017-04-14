/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
if (typeof _yuitest_coverage == "undefined"){
    _yuitest_coverage = {};
    _yuitest_coverline = function(src, line){
        var coverage = _yuitest_coverage[src];
        if (!coverage.lines[line]){
            coverage.calledLines++;
        }
        coverage.lines[line]++;
    };
    _yuitest_coverfunc = function(src, name, line){
        var coverage = _yuitest_coverage[src],
            funcId = name + ":" + line;
        if (!coverage.functions[funcId]){
            coverage.calledFunctions++;
        }
        coverage.functions[funcId]++;
    };
}
_yuitest_coverage["build/datasource-io/datasource-io.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/datasource-io/datasource-io.js",
    code: []
};
_yuitest_coverage["build/datasource-io/datasource-io.js"].code=["YUI.add('datasource-io', function (Y, NAME) {","","/**"," * Provides a DataSource implementation which can be used to retrieve data via the IO Utility."," *"," * @module datasource"," * @submodule datasource-io"," */","","/**"," * IO subclass for the DataSource Utility."," * @class DataSource.IO"," * @extends DataSource.Local"," * @constructor"," */    ","var DSIO = function() {","    DSIO.superclass.constructor.apply(this, arguments);","};","    ","","    /////////////////////////////////////////////////////////////////////////////","    //","    // DataSource.IO static properties","    //","    /////////////////////////////////////////////////////////////////////////////","Y.mix(DSIO, {","    /**","     * Class name.","     *","     * @property NAME","     * @type String","     * @static     ","     * @final","     * @value \"dataSourceIO\"","     */","    NAME: \"dataSourceIO\",","","","    /////////////////////////////////////////////////////////////////////////////","    //","    // DataSource.IO Attributes","    //","    /////////////////////////////////////////////////////////////////////////////","","    ATTRS: {","        /**","         * Pointer to IO Utility.","         *","         * @attribute io","         * @type Y.io","         * @default Y.io","         */","        io: {","            value: Y.io,","            cloneDefaultValue: false","        },","        ","        /**","         * Default IO Config.","         *","         * @attribute ioConfig","         * @type Object","         * @default null","         */","         ioConfig: {","            value: null","         }","    }","});","    ","Y.extend(DSIO, Y.DataSource.Local, {","    /**","    * Internal init() handler.","    *","    * @method initializer","    * @param config {Object} Config object.","    * @private","    */","    initializer: function(config) {","        this._queue = {interval:null, conn:null, requests:[]};","    },","","    /**","    * IO success callback.","    *","    * @method successHandler","    * @param id {String} Transaction ID.","    * @param response {String} Response.","    * @param e {Event.Facade} Event facade.","    * @private","    */","    successHandler: function (id, response, e) {","        var defIOConfig = this.get(\"ioConfig\"),","            payload = e.details[0];","","        delete Y.DataSource.Local.transactions[e.tId];","","        payload.data = response;","        this.fire(\"data\", payload);","","","        if (defIOConfig && defIOConfig.on && defIOConfig.on.success) {","            defIOConfig.on.success.apply(defIOConfig.context || Y, arguments);","        }","    },","","    /**","    * IO failure callback.","    *","    * @method failureHandler","    * @param id {String} Transaction ID.","    * @param response {String} Response.","    * @param e {Event.Facade} Event facade.","    * @private","    */","    failureHandler: function (id, response, e) {","        var defIOConfig = this.get(\"ioConfig\"),","            payload = e.details[0];","        ","        delete Y.DataSource.Local.transactions[e.tId];","","        payload.error = new Error(\"IO data failure\");","","        payload.data = response;","        this.fire(\"data\", payload);","","","        if (defIOConfig && defIOConfig.on && defIOConfig.on.failure) {","            defIOConfig.on.failure.apply(defIOConfig.context || Y, arguments);","        }","    },","    ","    /**","    * @property _queue","    * @description Object literal to manage asynchronous request/response","    * cycles enabled if queue needs to be managed (asyncMode/ioConnMode):","    * <dl>","    *     <dt>interval {Number}</dt>","    *         <dd>Interval ID of in-progress queue.</dd>","    *     <dt>conn</dt>","    *         <dd>In-progress connection identifier (if applicable).</dd>","    *     <dt>requests {Object[]}</dt>","    *         <dd>Array of queued request objects: {request:request, callback:callback}.</dd>","    * </dl>","    * @type Object","    * @default {interval:null, conn:null, requests:[]}","    * @private","    */","    _queue: null,","","    /**","     * Passes query string to IO. Fires <code>response</code> event when","     * response is received asynchronously.","     *","     * @method _defRequestFn","     * @param e {Event.Facade} Event Facade with the following properties:","     * <dl>","     * <dt>tId (Number)</dt> <dd>Unique transaction ID.</dd>","     * <dt>request (Object)</dt> <dd>The request.</dd>","     * <dt>callback (Object)</dt> <dd>The callback object with the following properties:","     *     <dl>","     *         <dt>success (Function)</dt> <dd>Success handler.</dd>","     *         <dt>failure (Function)</dt> <dd>Failure handler.</dd>","     *     </dl>","     * </dd>","     * <dt>cfg (Object)</dt> <dd>Configuration object.</dd>","     * </dl>","     * @protected","     */","    _defRequestFn: function(e) {","        var uri = this.get(\"source\"),","            io = this.get(\"io\"),","            defIOConfig = this.get(\"ioConfig\"),","            request = e.request,","            cfg = Y.merge(defIOConfig, e.cfg, {","                on: Y.merge(defIOConfig, {","                    success: this.successHandler,","                    failure: this.failureHandler","                }),","                context: this,","                \"arguments\": e","            });","        ","        // Support for POST transactions","        if(Y.Lang.isString(request)) {","            if(cfg.method && (cfg.method.toUpperCase() === \"POST\")) {","                cfg.data = cfg.data ? cfg.data+request : request;","            }","            else {","                uri += request;","            }","        }","        Y.DataSource.Local.transactions[e.tId] = io(uri, cfg);","        return e.tId;","    }","});","  ","Y.DataSource.IO = DSIO;","","","}, '3.7.3', {\"requires\": [\"datasource-local\", \"io-base\"]});"];
_yuitest_coverage["build/datasource-io/datasource-io.js"].lines = {"1":0,"16":0,"17":0,"26":0,"71":0,"80":0,"93":0,"96":0,"98":0,"99":0,"102":0,"103":0,"117":0,"120":0,"122":0,"124":0,"125":0,"128":0,"129":0,"171":0,"185":0,"186":0,"187":0,"190":0,"193":0,"194":0,"198":0};
_yuitest_coverage["build/datasource-io/datasource-io.js"].functions = {"DSIO:16":0,"initializer:79":0,"successHandler:92":0,"failureHandler:116":0,"_defRequestFn:170":0,"(anonymous 1):1":0};
_yuitest_coverage["build/datasource-io/datasource-io.js"].coveredLines = 27;
_yuitest_coverage["build/datasource-io/datasource-io.js"].coveredFunctions = 6;
_yuitest_coverline("build/datasource-io/datasource-io.js", 1);
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
_yuitest_coverfunc("build/datasource-io/datasource-io.js", "(anonymous 1)", 1);
_yuitest_coverline("build/datasource-io/datasource-io.js", 16);
var DSIO = function() {
    _yuitest_coverfunc("build/datasource-io/datasource-io.js", "DSIO", 16);
_yuitest_coverline("build/datasource-io/datasource-io.js", 17);
DSIO.superclass.constructor.apply(this, arguments);
};
    

    /////////////////////////////////////////////////////////////////////////////
    //
    // DataSource.IO static properties
    //
    /////////////////////////////////////////////////////////////////////////////
_yuitest_coverline("build/datasource-io/datasource-io.js", 26);
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
    
_yuitest_coverline("build/datasource-io/datasource-io.js", 71);
Y.extend(DSIO, Y.DataSource.Local, {
    /**
    * Internal init() handler.
    *
    * @method initializer
    * @param config {Object} Config object.
    * @private
    */
    initializer: function(config) {
        _yuitest_coverfunc("build/datasource-io/datasource-io.js", "initializer", 79);
_yuitest_coverline("build/datasource-io/datasource-io.js", 80);
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
        _yuitest_coverfunc("build/datasource-io/datasource-io.js", "successHandler", 92);
_yuitest_coverline("build/datasource-io/datasource-io.js", 93);
var defIOConfig = this.get("ioConfig"),
            payload = e.details[0];

        _yuitest_coverline("build/datasource-io/datasource-io.js", 96);
delete Y.DataSource.Local.transactions[e.tId];

        _yuitest_coverline("build/datasource-io/datasource-io.js", 98);
payload.data = response;
        _yuitest_coverline("build/datasource-io/datasource-io.js", 99);
this.fire("data", payload);


        _yuitest_coverline("build/datasource-io/datasource-io.js", 102);
if (defIOConfig && defIOConfig.on && defIOConfig.on.success) {
            _yuitest_coverline("build/datasource-io/datasource-io.js", 103);
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
        _yuitest_coverfunc("build/datasource-io/datasource-io.js", "failureHandler", 116);
_yuitest_coverline("build/datasource-io/datasource-io.js", 117);
var defIOConfig = this.get("ioConfig"),
            payload = e.details[0];
        
        _yuitest_coverline("build/datasource-io/datasource-io.js", 120);
delete Y.DataSource.Local.transactions[e.tId];

        _yuitest_coverline("build/datasource-io/datasource-io.js", 122);
payload.error = new Error("IO data failure");

        _yuitest_coverline("build/datasource-io/datasource-io.js", 124);
payload.data = response;
        _yuitest_coverline("build/datasource-io/datasource-io.js", 125);
this.fire("data", payload);


        _yuitest_coverline("build/datasource-io/datasource-io.js", 128);
if (defIOConfig && defIOConfig.on && defIOConfig.on.failure) {
            _yuitest_coverline("build/datasource-io/datasource-io.js", 129);
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
        _yuitest_coverfunc("build/datasource-io/datasource-io.js", "_defRequestFn", 170);
_yuitest_coverline("build/datasource-io/datasource-io.js", 171);
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
        _yuitest_coverline("build/datasource-io/datasource-io.js", 185);
if(Y.Lang.isString(request)) {
            _yuitest_coverline("build/datasource-io/datasource-io.js", 186);
if(cfg.method && (cfg.method.toUpperCase() === "POST")) {
                _yuitest_coverline("build/datasource-io/datasource-io.js", 187);
cfg.data = cfg.data ? cfg.data+request : request;
            }
            else {
                _yuitest_coverline("build/datasource-io/datasource-io.js", 190);
uri += request;
            }
        }
        _yuitest_coverline("build/datasource-io/datasource-io.js", 193);
Y.DataSource.Local.transactions[e.tId] = io(uri, cfg);
        _yuitest_coverline("build/datasource-io/datasource-io.js", 194);
return e.tId;
    }
});
  
_yuitest_coverline("build/datasource-io/datasource-io.js", 198);
Y.DataSource.IO = DSIO;


}, '3.7.3', {"requires": ["datasource-local", "io-base"]});
