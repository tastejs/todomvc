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
_yuitest_coverage["build/datasource-local/datasource-local.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/datasource-local/datasource-local.js",
    code: []
};
_yuitest_coverage["build/datasource-local/datasource-local.js"].code=["YUI.add('datasource-local', function (Y, NAME) {","","/**"," * The DataSource utility provides a common configurable interface for widgets to"," * access a variety of data, from JavaScript arrays to online database servers."," *"," * @module datasource"," * @main datasource"," */","    ","/**"," * Provides the base DataSource implementation, which can be extended to"," * create DataSources for specific data protocols, such as the IO Utility, the"," * Get Utility, or custom functions."," *"," * @module datasource"," * @submodule datasource-local"," */","","/**"," * Base class for the DataSource Utility."," * @class DataSource.Local"," * @extends Base"," * @constructor"," */    ","var LANG = Y.Lang,","","DSLocal = function() {","    DSLocal.superclass.constructor.apply(this, arguments);","};","    ","    /////////////////////////////////////////////////////////////////////////////","    //","    // DataSource static properties","    //","    /////////////////////////////////////////////////////////////////////////////","Y.mix(DSLocal, {","    /**","     * Class name.","     *","     * @property NAME","     * @type String","     * @static     ","     * @final","     * @value \"dataSourceLocal\"","     */","    NAME: \"dataSourceLocal\",","","    /////////////////////////////////////////////////////////////////////////////","    //","    // DataSource Attributes","    //","    /////////////////////////////////////////////////////////////////////////////","","    ATTRS: {","        /**","        * @attribute source","        * @description Pointer to live data.","        * @type MIXED","        * @default null        ","        */","        source: {","            value: null","        }","    },","","    /**","     * Global transaction counter.","     *","     * @property _tId","     * @type Number","     * @static","     * @private","     * @default 0","     */","    _tId: 0,","","    /**","     * Global in-progress transaction objects.","     *","     * @property transactions","     * @type Object","     * @static","     */","    transactions: {},","","    /**","     * Returns data to callback.","     *","     * @method issueCallback","     * @param e {EventFacade} Event Facade.","     * @param caller {DataSource} Calling DataSource instance.","     * @static","     */","    issueCallback: function (e, caller) {","        var callbacks = e.on || e.callback,","            callback = callbacks && callbacks.success,","            payload = e.details[0];","","        payload.error = (e.error || e.response.error);","","        if (payload.error) {","            caller.fire(\"error\", payload);","            callback = callbacks && callbacks.failure;","        }","","        if (callback) {","            //TODO: this should be executed from a specific context","            callback(payload);","        }","    }","});","    ","Y.extend(DSLocal, Y.Base, {","    /**","    * Internal init() handler.","    *","    * @method initializer","    * @param config {Object} Config object.","    * @private        ","    */","    initializer: function(config) {","        this._initEvents();","    },","","    /**","    * This method creates all the events for this module.","    * @method _initEvents","    * @private        ","    */","    _initEvents: function() {","        /**","         * Fired when a data request is received.","         *","         * @event request","         * @param e {Event.Facade} Event Facade with the following properties:","         * <dl>                          ","         * <dt>tId (Number)</dt> <dd>Unique transaction ID.</dd>","         * <dt>request (Object)</dt> <dd>The request.</dd>","         * <dt>callback (Object)</dt> <dd>The callback object","         *   (deprecated, refer to <strong>on</strong></dd>","         * <dt>on (Object)</dt> <dd>The map of configured callback","         *   functions.</dd>","         * <dt>cfg (Object)</dt> <dd>Configuration object.</dd>","         * </dl>","         * @preventable _defRequestFn","         */","        this.publish(\"request\", {defaultFn: Y.bind(\"_defRequestFn\", this), queuable:true});","         ","        /**","         * Fired when raw data is received.","         *","         * @event data","         * @param e {Event.Facade} Event Facade with the following properties:","         * <dl>","         * <dt>tId (Number)</dt> <dd>Unique transaction ID.</dd>","         * <dt>request (Object)</dt> <dd>The request.</dd>","         * <dt>callback (Object)</dt> <dd>Deprecated alias for the","         *   <strong>on</strong> property</dd>","         * <dt>on (Object)</dt> <dd>The map of configured transaction","         *   callbacks.  An object with the following properties:","         *     <dl>","         *         <dt>success (Function)</dt> <dd>Success handler.</dd>","         *         <dt>failure (Function)</dt> <dd>Failure handler.</dd>","         *     </dl>","         * </dd>","         * <dt>cfg (Object)</dt> <dd>Configuration object.</dd>","         * <dt>data (Object)</dt> <dd>Raw data.</dd>","         * </dl>","         * @preventable _defDataFn","         */","        this.publish(\"data\", {defaultFn: Y.bind(\"_defDataFn\", this), queuable:true});","","        /**","         * Fired when response is returned.","         *","         * @event response","         * @param e {Event.Facade} Event Facade with the following properties:","         * <dl>","         * <dt>tId (Number)</dt> <dd>Unique transaction ID.</dd>","         * <dt>request (Object)</dt> <dd>The request.</dd>","         * <dt>callback (Object)</dt> <dd>Deprecated alias for the","         *   <strong>on</strong> property</dd>","         * <dt>on (Object)</dt> <dd>The map of configured transaction","         *   callbacks.  An object with the following properties:","         *     <dl>","         *         <dt>success (Function)</dt> <dd>Success handler.</dd>","         *         <dt>failure (Function)</dt> <dd>Failure handler.</dd>","         *     </dl>","         * </dd>","         * <dt>cfg (Object)</dt> <dd>Configuration object.</dd>","         * <dt>data (Object)</dt> <dd>Raw data.</dd>","         * <dt>response (Object)</dt>","         *     <dd>Normalized response object with the following properties:","         *         <dl>","         *             <dt>results (Object)</dt> <dd>Parsed results.</dd>","         *             <dt>meta (Object)</dt> <dd>Parsed meta data.</dd>","         *             <dt>error (Boolean)</dt> <dd>Error flag.</dd>","         *         </dl>","         *     </dd>","         * <dt>error</dt>","         *     <dd>Any error that occurred along the transaction lifecycle.</dd>","         * </dl>","         * @preventable _defResponseFn","         */","         this.publish(\"response\", {defaultFn: Y.bind(\"_defResponseFn\", this), queuable:true});","","        /**","         * Fired when an error is encountered.","         *","         * @event error","         * @param e {Event.Facade} Event Facade with the following properties:","         * <dl>","         * <dt>tId (Number)</dt> <dd>Unique transaction ID.</dd>","         * <dt>request (Object)</dt> <dd>The request.</dd>","         * <dt>callback (Object)</dt> <dd>Deprecated alias for the","         *   <strong>on</strong> property</dd>","         * <dt>on (Object)</dt> <dd>The map of configured transaction","         *   callbacks.  An object with the following properties:","         *     <dl>","         *         <dt>success (Function)</dt> <dd>Success handler.</dd>","         *         <dt>failure (Function)</dt> <dd>Failure handler.</dd>","         *     </dl>","         * </dd>","         * <dt>cfg (Object)</dt> <dd>Configuration object.</dd>","         * <dt>data (Object)</dt> <dd>Raw data.</dd>","         * <dt>response (Object)</dt>","         *     <dd>Normalized response object with the following properties:","         *         <dl>","         *             <dt>results (Object)</dt> <dd>Parsed results.</dd>","         *             <dt>meta (Object)</dt> <dd>Parsed meta data.</dd>","         *             <dt>error (Object)</dt> <dd>Error object.</dd>","         *         </dl>","         *     </dd>","         * <dt>error</dt>","         *     <dd>Any error that occurred along the transaction lifecycle.</dd>","         * </dl>","         */","","    },","","    /**","     * Manages request/response transaction. Must fire <code>response</code>","     * event when response is received. This method should be implemented by","     * subclasses to achieve more complex behavior such as accessing remote data.","     *","     * @method _defRequestFn","     * @param e {Event.Facade} Event Facadewith the following properties:","     * <dl>","     * <dt>tId (Number)</dt> <dd>Unique transaction ID.</dd>","     * <dt>request (Object)</dt> <dd>The request.</dd>","     * <dt>callback (Object)</dt> <dd>Deprecated alias for the","     *   <strong>on</strong> property</dd>","     * <dt>on (Object)</dt> <dd>The map of configured transaction","     *   callbacks.  An object with the following properties:","     *     <dl>","     *         <dt>success (Function)</dt> <dd>Success handler.</dd>","     *         <dt>failure (Function)</dt> <dd>Failure handler.</dd>","     *     </dl>","     * </dd>","     * <dt>cfg (Object)</dt> <dd>Configuration object.</dd>","     * </dl>","     * @protected","     */","    _defRequestFn: function(e) {","        var data = this.get(\"source\"),","            payload = e.details[0];","        ","        // Problematic data","        if(LANG.isUndefined(data)) {","            payload.error = new Error(\"Local source undefined\");","        }","","        payload.data = data;","        this.fire(\"data\", payload);","    },","","    /**","     * Normalizes raw data into a response that includes results and meta properties.","     *","     * @method _defDataFn","     * @param e {Event.Facade} Event Facade with the following properties:","     * <dl>","     * <dt>tId (Number)</dt> <dd>Unique transaction ID.</dd>","     * <dt>request (Object)</dt> <dd>The request.</dd>","     * <dt>callback (Object)</dt> <dd>Deprecated alias for the","     *   <strong>on</strong> property</dd>","     * <dt>on (Object)</dt> <dd>The map of configured transaction","     *   callbacks.  An object with the following properties:","     *     <dl>","     *         <dt>success (Function)</dt> <dd>Success handler.</dd>","     *         <dt>failure (Function)</dt> <dd>Failure handler.</dd>","     *     </dl>","     * </dd>","     * <dt>cfg (Object)</dt> <dd>Configuration object.</dd>","     * <dt>data (Object)</dt> <dd>Raw data.</dd>","     * </dl>","     * @protected","     */","    _defDataFn: function(e) {","        var data = e.data,","            meta = e.meta,","            response = {","                results: (LANG.isArray(data)) ? data : [data],","                meta: (meta) ? meta : {}","            },","            payload = e.details[0];","","        payload.response = response;","        this.fire(\"response\", payload);","    },","","    /**","     * Sends data as a normalized response to callback.","     *","     * @method _defResponseFn","     * @param e {Event.Facade} Event Facade with the following properties:","     * <dl>","     * <dt>tId (Number)</dt> <dd>Unique transaction ID.</dd>","     * <dt>request (Object)</dt> <dd>The request.</dd>","     * <dt>callback (Object)</dt> <dd>Deprecated alias for the","     *   <strong>on</strong> property</dd>","     * <dt>on (Object)</dt> <dd>The map of configured transaction","     *   callbacks.  An object with the following properties:","     *     <dl>","     *         <dt>success (Function)</dt> <dd>Success handler.</dd>","     *         <dt>failure (Function)</dt> <dd>Failure handler.</dd>","     *     </dl>","     * </dd>","     * <dt>cfg (Object)</dt> <dd>Configuration object.</dd>","     * <dt>data (Object)</dt> <dd>Raw data.</dd>","     * <dt>response (Object)</dt> <dd>Normalized response object with the following properties:","     *     <dl>","     *         <dt>results (Object)</dt> <dd>Parsed results.</dd>","     *         <dt>meta (Object)</dt> <dd>Parsed meta data.</dd>","     *         <dt>error (Boolean)</dt> <dd>Error flag.</dd>","     *     </dl>","     * </dd>","     * </dl>","     * @protected","     */","    _defResponseFn: function(e) {","        // Send the response back to the callback","        DSLocal.issueCallback(e, this);","    },","    ","    /**","     * Generates a unique transaction ID and fires <code>request</code> event.","     * <strong>Note</strong>: the property <code>callback</code> is a","     * deprecated alias for the <code>on</code> transaction configuration","     * property described below.","     *","     * @method sendRequest","     * @param [request] {Object} An object literal with the following properties:","     *     <dl>","     *     <dt><code>request</code></dt>","     *     <dd>The request to send to the live data source, if any.</dd>","     *     <dt><code>on</code></dt>","     *     <dd>An object literal with the following properties:","     *         <dl>","     *         <dt><code>success</code></dt>","     *         <dd>The function to call when the data is ready.</dd>","     *         <dt><code>failure</code></dt>","     *         <dd>The function to call upon a response failure condition.</dd>","     *         <dt><code>argument</code></dt>","     *         <dd>Arbitrary data payload that will be passed back to the success and failure handlers.</dd>","     *         </dl>","     *     </dd>","     *     <dt><code>cfg</code></dt>","     *     <dd>Configuration object, if any.</dd>","     *     </dl>","     * @return {Number} Transaction ID.","     */","    sendRequest: function(request) {","        var tId = DSLocal._tId++,","            callbacks;","","        request = request || {};","","        callbacks = request.on || request.callback;","","        this.fire(\"request\", {","            tId: tId,","            request: request.request,","            on: callbacks,","            callback: callbacks,","            cfg: request.cfg || {}","        });","","","        return tId;","    }","});","    ","Y.namespace(\"DataSource\").Local = DSLocal;","","","}, '3.7.3', {\"requires\": [\"base\"]});"];
_yuitest_coverage["build/datasource-local/datasource-local.js"].lines = {"1":0,"26":0,"29":0,"37":0,"96":0,"100":0,"102":0,"103":0,"104":0,"107":0,"109":0,"114":0,"123":0,"148":0,"172":0,"206":0,"266":0,"270":0,"271":0,"274":0,"275":0,"301":0,"309":0,"310":0,"344":0,"375":0,"378":0,"380":0,"382":0,"391":0,"395":0};
_yuitest_coverage["build/datasource-local/datasource-local.js"].functions = {"DSLocal:28":0,"issueCallback:95":0,"initializer:122":0,"_initEvents:131":0,"_defRequestFn:265":0,"_defDataFn:300":0,"_defResponseFn:342":0,"sendRequest:374":0,"(anonymous 1):1":0};
_yuitest_coverage["build/datasource-local/datasource-local.js"].coveredLines = 31;
_yuitest_coverage["build/datasource-local/datasource-local.js"].coveredFunctions = 9;
_yuitest_coverline("build/datasource-local/datasource-local.js", 1);
YUI.add('datasource-local', function (Y, NAME) {

/**
 * The DataSource utility provides a common configurable interface for widgets to
 * access a variety of data, from JavaScript arrays to online database servers.
 *
 * @module datasource
 * @main datasource
 */
    
/**
 * Provides the base DataSource implementation, which can be extended to
 * create DataSources for specific data protocols, such as the IO Utility, the
 * Get Utility, or custom functions.
 *
 * @module datasource
 * @submodule datasource-local
 */

/**
 * Base class for the DataSource Utility.
 * @class DataSource.Local
 * @extends Base
 * @constructor
 */    
_yuitest_coverfunc("build/datasource-local/datasource-local.js", "(anonymous 1)", 1);
_yuitest_coverline("build/datasource-local/datasource-local.js", 26);
var LANG = Y.Lang,

DSLocal = function() {
    _yuitest_coverfunc("build/datasource-local/datasource-local.js", "DSLocal", 28);
_yuitest_coverline("build/datasource-local/datasource-local.js", 29);
DSLocal.superclass.constructor.apply(this, arguments);
};
    
    /////////////////////////////////////////////////////////////////////////////
    //
    // DataSource static properties
    //
    /////////////////////////////////////////////////////////////////////////////
_yuitest_coverline("build/datasource-local/datasource-local.js", 37);
Y.mix(DSLocal, {
    /**
     * Class name.
     *
     * @property NAME
     * @type String
     * @static     
     * @final
     * @value "dataSourceLocal"
     */
    NAME: "dataSourceLocal",

    /////////////////////////////////////////////////////////////////////////////
    //
    // DataSource Attributes
    //
    /////////////////////////////////////////////////////////////////////////////

    ATTRS: {
        /**
        * @attribute source
        * @description Pointer to live data.
        * @type MIXED
        * @default null        
        */
        source: {
            value: null
        }
    },

    /**
     * Global transaction counter.
     *
     * @property _tId
     * @type Number
     * @static
     * @private
     * @default 0
     */
    _tId: 0,

    /**
     * Global in-progress transaction objects.
     *
     * @property transactions
     * @type Object
     * @static
     */
    transactions: {},

    /**
     * Returns data to callback.
     *
     * @method issueCallback
     * @param e {EventFacade} Event Facade.
     * @param caller {DataSource} Calling DataSource instance.
     * @static
     */
    issueCallback: function (e, caller) {
        _yuitest_coverfunc("build/datasource-local/datasource-local.js", "issueCallback", 95);
_yuitest_coverline("build/datasource-local/datasource-local.js", 96);
var callbacks = e.on || e.callback,
            callback = callbacks && callbacks.success,
            payload = e.details[0];

        _yuitest_coverline("build/datasource-local/datasource-local.js", 100);
payload.error = (e.error || e.response.error);

        _yuitest_coverline("build/datasource-local/datasource-local.js", 102);
if (payload.error) {
            _yuitest_coverline("build/datasource-local/datasource-local.js", 103);
caller.fire("error", payload);
            _yuitest_coverline("build/datasource-local/datasource-local.js", 104);
callback = callbacks && callbacks.failure;
        }

        _yuitest_coverline("build/datasource-local/datasource-local.js", 107);
if (callback) {
            //TODO: this should be executed from a specific context
            _yuitest_coverline("build/datasource-local/datasource-local.js", 109);
callback(payload);
        }
    }
});
    
_yuitest_coverline("build/datasource-local/datasource-local.js", 114);
Y.extend(DSLocal, Y.Base, {
    /**
    * Internal init() handler.
    *
    * @method initializer
    * @param config {Object} Config object.
    * @private        
    */
    initializer: function(config) {
        _yuitest_coverfunc("build/datasource-local/datasource-local.js", "initializer", 122);
_yuitest_coverline("build/datasource-local/datasource-local.js", 123);
this._initEvents();
    },

    /**
    * This method creates all the events for this module.
    * @method _initEvents
    * @private        
    */
    _initEvents: function() {
        /**
         * Fired when a data request is received.
         *
         * @event request
         * @param e {Event.Facade} Event Facade with the following properties:
         * <dl>                          
         * <dt>tId (Number)</dt> <dd>Unique transaction ID.</dd>
         * <dt>request (Object)</dt> <dd>The request.</dd>
         * <dt>callback (Object)</dt> <dd>The callback object
         *   (deprecated, refer to <strong>on</strong></dd>
         * <dt>on (Object)</dt> <dd>The map of configured callback
         *   functions.</dd>
         * <dt>cfg (Object)</dt> <dd>Configuration object.</dd>
         * </dl>
         * @preventable _defRequestFn
         */
        _yuitest_coverfunc("build/datasource-local/datasource-local.js", "_initEvents", 131);
_yuitest_coverline("build/datasource-local/datasource-local.js", 148);
this.publish("request", {defaultFn: Y.bind("_defRequestFn", this), queuable:true});
         
        /**
         * Fired when raw data is received.
         *
         * @event data
         * @param e {Event.Facade} Event Facade with the following properties:
         * <dl>
         * <dt>tId (Number)</dt> <dd>Unique transaction ID.</dd>
         * <dt>request (Object)</dt> <dd>The request.</dd>
         * <dt>callback (Object)</dt> <dd>Deprecated alias for the
         *   <strong>on</strong> property</dd>
         * <dt>on (Object)</dt> <dd>The map of configured transaction
         *   callbacks.  An object with the following properties:
         *     <dl>
         *         <dt>success (Function)</dt> <dd>Success handler.</dd>
         *         <dt>failure (Function)</dt> <dd>Failure handler.</dd>
         *     </dl>
         * </dd>
         * <dt>cfg (Object)</dt> <dd>Configuration object.</dd>
         * <dt>data (Object)</dt> <dd>Raw data.</dd>
         * </dl>
         * @preventable _defDataFn
         */
        _yuitest_coverline("build/datasource-local/datasource-local.js", 172);
this.publish("data", {defaultFn: Y.bind("_defDataFn", this), queuable:true});

        /**
         * Fired when response is returned.
         *
         * @event response
         * @param e {Event.Facade} Event Facade with the following properties:
         * <dl>
         * <dt>tId (Number)</dt> <dd>Unique transaction ID.</dd>
         * <dt>request (Object)</dt> <dd>The request.</dd>
         * <dt>callback (Object)</dt> <dd>Deprecated alias for the
         *   <strong>on</strong> property</dd>
         * <dt>on (Object)</dt> <dd>The map of configured transaction
         *   callbacks.  An object with the following properties:
         *     <dl>
         *         <dt>success (Function)</dt> <dd>Success handler.</dd>
         *         <dt>failure (Function)</dt> <dd>Failure handler.</dd>
         *     </dl>
         * </dd>
         * <dt>cfg (Object)</dt> <dd>Configuration object.</dd>
         * <dt>data (Object)</dt> <dd>Raw data.</dd>
         * <dt>response (Object)</dt>
         *     <dd>Normalized response object with the following properties:
         *         <dl>
         *             <dt>results (Object)</dt> <dd>Parsed results.</dd>
         *             <dt>meta (Object)</dt> <dd>Parsed meta data.</dd>
         *             <dt>error (Boolean)</dt> <dd>Error flag.</dd>
         *         </dl>
         *     </dd>
         * <dt>error</dt>
         *     <dd>Any error that occurred along the transaction lifecycle.</dd>
         * </dl>
         * @preventable _defResponseFn
         */
         _yuitest_coverline("build/datasource-local/datasource-local.js", 206);
this.publish("response", {defaultFn: Y.bind("_defResponseFn", this), queuable:true});

        /**
         * Fired when an error is encountered.
         *
         * @event error
         * @param e {Event.Facade} Event Facade with the following properties:
         * <dl>
         * <dt>tId (Number)</dt> <dd>Unique transaction ID.</dd>
         * <dt>request (Object)</dt> <dd>The request.</dd>
         * <dt>callback (Object)</dt> <dd>Deprecated alias for the
         *   <strong>on</strong> property</dd>
         * <dt>on (Object)</dt> <dd>The map of configured transaction
         *   callbacks.  An object with the following properties:
         *     <dl>
         *         <dt>success (Function)</dt> <dd>Success handler.</dd>
         *         <dt>failure (Function)</dt> <dd>Failure handler.</dd>
         *     </dl>
         * </dd>
         * <dt>cfg (Object)</dt> <dd>Configuration object.</dd>
         * <dt>data (Object)</dt> <dd>Raw data.</dd>
         * <dt>response (Object)</dt>
         *     <dd>Normalized response object with the following properties:
         *         <dl>
         *             <dt>results (Object)</dt> <dd>Parsed results.</dd>
         *             <dt>meta (Object)</dt> <dd>Parsed meta data.</dd>
         *             <dt>error (Object)</dt> <dd>Error object.</dd>
         *         </dl>
         *     </dd>
         * <dt>error</dt>
         *     <dd>Any error that occurred along the transaction lifecycle.</dd>
         * </dl>
         */

    },

    /**
     * Manages request/response transaction. Must fire <code>response</code>
     * event when response is received. This method should be implemented by
     * subclasses to achieve more complex behavior such as accessing remote data.
     *
     * @method _defRequestFn
     * @param e {Event.Facade} Event Facadewith the following properties:
     * <dl>
     * <dt>tId (Number)</dt> <dd>Unique transaction ID.</dd>
     * <dt>request (Object)</dt> <dd>The request.</dd>
     * <dt>callback (Object)</dt> <dd>Deprecated alias for the
     *   <strong>on</strong> property</dd>
     * <dt>on (Object)</dt> <dd>The map of configured transaction
     *   callbacks.  An object with the following properties:
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
        _yuitest_coverfunc("build/datasource-local/datasource-local.js", "_defRequestFn", 265);
_yuitest_coverline("build/datasource-local/datasource-local.js", 266);
var data = this.get("source"),
            payload = e.details[0];
        
        // Problematic data
        _yuitest_coverline("build/datasource-local/datasource-local.js", 270);
if(LANG.isUndefined(data)) {
            _yuitest_coverline("build/datasource-local/datasource-local.js", 271);
payload.error = new Error("Local source undefined");
        }

        _yuitest_coverline("build/datasource-local/datasource-local.js", 274);
payload.data = data;
        _yuitest_coverline("build/datasource-local/datasource-local.js", 275);
this.fire("data", payload);
    },

    /**
     * Normalizes raw data into a response that includes results and meta properties.
     *
     * @method _defDataFn
     * @param e {Event.Facade} Event Facade with the following properties:
     * <dl>
     * <dt>tId (Number)</dt> <dd>Unique transaction ID.</dd>
     * <dt>request (Object)</dt> <dd>The request.</dd>
     * <dt>callback (Object)</dt> <dd>Deprecated alias for the
     *   <strong>on</strong> property</dd>
     * <dt>on (Object)</dt> <dd>The map of configured transaction
     *   callbacks.  An object with the following properties:
     *     <dl>
     *         <dt>success (Function)</dt> <dd>Success handler.</dd>
     *         <dt>failure (Function)</dt> <dd>Failure handler.</dd>
     *     </dl>
     * </dd>
     * <dt>cfg (Object)</dt> <dd>Configuration object.</dd>
     * <dt>data (Object)</dt> <dd>Raw data.</dd>
     * </dl>
     * @protected
     */
    _defDataFn: function(e) {
        _yuitest_coverfunc("build/datasource-local/datasource-local.js", "_defDataFn", 300);
_yuitest_coverline("build/datasource-local/datasource-local.js", 301);
var data = e.data,
            meta = e.meta,
            response = {
                results: (LANG.isArray(data)) ? data : [data],
                meta: (meta) ? meta : {}
            },
            payload = e.details[0];

        _yuitest_coverline("build/datasource-local/datasource-local.js", 309);
payload.response = response;
        _yuitest_coverline("build/datasource-local/datasource-local.js", 310);
this.fire("response", payload);
    },

    /**
     * Sends data as a normalized response to callback.
     *
     * @method _defResponseFn
     * @param e {Event.Facade} Event Facade with the following properties:
     * <dl>
     * <dt>tId (Number)</dt> <dd>Unique transaction ID.</dd>
     * <dt>request (Object)</dt> <dd>The request.</dd>
     * <dt>callback (Object)</dt> <dd>Deprecated alias for the
     *   <strong>on</strong> property</dd>
     * <dt>on (Object)</dt> <dd>The map of configured transaction
     *   callbacks.  An object with the following properties:
     *     <dl>
     *         <dt>success (Function)</dt> <dd>Success handler.</dd>
     *         <dt>failure (Function)</dt> <dd>Failure handler.</dd>
     *     </dl>
     * </dd>
     * <dt>cfg (Object)</dt> <dd>Configuration object.</dd>
     * <dt>data (Object)</dt> <dd>Raw data.</dd>
     * <dt>response (Object)</dt> <dd>Normalized response object with the following properties:
     *     <dl>
     *         <dt>results (Object)</dt> <dd>Parsed results.</dd>
     *         <dt>meta (Object)</dt> <dd>Parsed meta data.</dd>
     *         <dt>error (Boolean)</dt> <dd>Error flag.</dd>
     *     </dl>
     * </dd>
     * </dl>
     * @protected
     */
    _defResponseFn: function(e) {
        // Send the response back to the callback
        _yuitest_coverfunc("build/datasource-local/datasource-local.js", "_defResponseFn", 342);
_yuitest_coverline("build/datasource-local/datasource-local.js", 344);
DSLocal.issueCallback(e, this);
    },
    
    /**
     * Generates a unique transaction ID and fires <code>request</code> event.
     * <strong>Note</strong>: the property <code>callback</code> is a
     * deprecated alias for the <code>on</code> transaction configuration
     * property described below.
     *
     * @method sendRequest
     * @param [request] {Object} An object literal with the following properties:
     *     <dl>
     *     <dt><code>request</code></dt>
     *     <dd>The request to send to the live data source, if any.</dd>
     *     <dt><code>on</code></dt>
     *     <dd>An object literal with the following properties:
     *         <dl>
     *         <dt><code>success</code></dt>
     *         <dd>The function to call when the data is ready.</dd>
     *         <dt><code>failure</code></dt>
     *         <dd>The function to call upon a response failure condition.</dd>
     *         <dt><code>argument</code></dt>
     *         <dd>Arbitrary data payload that will be passed back to the success and failure handlers.</dd>
     *         </dl>
     *     </dd>
     *     <dt><code>cfg</code></dt>
     *     <dd>Configuration object, if any.</dd>
     *     </dl>
     * @return {Number} Transaction ID.
     */
    sendRequest: function(request) {
        _yuitest_coverfunc("build/datasource-local/datasource-local.js", "sendRequest", 374);
_yuitest_coverline("build/datasource-local/datasource-local.js", 375);
var tId = DSLocal._tId++,
            callbacks;

        _yuitest_coverline("build/datasource-local/datasource-local.js", 378);
request = request || {};

        _yuitest_coverline("build/datasource-local/datasource-local.js", 380);
callbacks = request.on || request.callback;

        _yuitest_coverline("build/datasource-local/datasource-local.js", 382);
this.fire("request", {
            tId: tId,
            request: request.request,
            on: callbacks,
            callback: callbacks,
            cfg: request.cfg || {}
        });


        _yuitest_coverline("build/datasource-local/datasource-local.js", 391);
return tId;
    }
});
    
_yuitest_coverline("build/datasource-local/datasource-local.js", 395);
Y.namespace("DataSource").Local = DSLocal;


}, '3.7.3', {"requires": ["base"]});
