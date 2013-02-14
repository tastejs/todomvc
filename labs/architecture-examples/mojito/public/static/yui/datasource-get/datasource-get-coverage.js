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
_yuitest_coverage["build/datasource-get/datasource-get.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/datasource-get/datasource-get.js",
    code: []
};
_yuitest_coverage["build/datasource-get/datasource-get.js"].code=["YUI.add('datasource-get', function (Y, NAME) {","","/**"," * Provides a DataSource implementation which can be used to retrieve data via the Get Utility."," *"," * @module datasource"," * @submodule datasource-get"," */","","/**"," * Get Utility subclass for the DataSource Utility."," * @class DataSource.Get"," * @extends DataSource.Local"," * @constructor"," */    ","var DSGet = function() {","    DSGet.superclass.constructor.apply(this, arguments);","};","    ","    ","Y.DataSource.Get = Y.extend(DSGet, Y.DataSource.Local, {","    /**","     * Passes query string to Get Utility. Fires <code>response</code> event when","     * response is received asynchronously.","     *","     * @method _defRequestFn","     * @param e {Event.Facade} Event Facade with the following properties:","     * <dl>","     * <dt>tId (Number)</dt> <dd>Unique transaction ID.</dd>","     * <dt>request (Object)</dt> <dd>The request.</dd>","     * <dt>callback (Object)</dt> <dd>The callback object with the following properties:","     *     <dl>","     *         <dt>success (Function)</dt> <dd>Success handler.</dd>","     *         <dt>failure (Function)</dt> <dd>Failure handler.</dd>","     *     </dl>","     * </dd>","     * <dt>cfg (Object)</dt> <dd>Configuration object.</dd>","     * </dl>","     * @protected","     */","    _defRequestFn: function(e) {","        var uri  = this.get(\"source\"),","            get  = this.get(\"get\"),","            guid = Y.guid().replace(/\\-/g, '_'),","            generateRequest = this.get( \"generateRequestCallback\" ),","            payload = e.details[0],","            self = this;","","        /**","         * Stores the most recent request id for validation against stale","         * response handling.","         *","         * @property _last","         * @type {String}","         * @protected","         */","        this._last = guid;","","        // Dynamically add handler function with a closure to the callback stack","        // for access to guid","        YUI.Env.DataSource.callbacks[guid] = function(response) {","            delete YUI.Env.DataSource.callbacks[guid];","            delete Y.DataSource.Local.transactions[e.tId];","","            var process = self.get('asyncMode') !== \"ignoreStaleResponses\" ||","                          self._last === guid;","","            if (process) {","                payload.data = response;","","                self.fire(\"data\", payload);","            } else {","            }","","        };","","        // Add the callback param to the request url","        uri += e.request + generateRequest.call( this, guid );","","","        Y.DataSource.Local.transactions[e.tId] = get.script(uri, {","            autopurge: true,","            // Works in Firefox only....","            onFailure: function (o) {","                delete YUI.Env.DataSource.callbacks[guid];","                delete Y.DataSource.Local.transactions[e.tId];","","                payload.error = new Error(o.msg || \"Script node data failure\");","","","                self.fire(\"data\", payload);","            },","            onTimeout: function(o) {","                delete YUI.Env.DataSource.callbacks[guid];","                delete Y.DataSource.Local.transactions[e.tId];","","                payload.error = new Error(o.msg || \"Script node data timeout\");","","","                self.fire(\"data\", payload);","            }","        });","","        return e.tId;","    },","","","    /**","     * Default method for adding callback param to url.  See","     * generateRequestCallback attribute.","     *","     * @method _generateRequest","     * @param guid {String} unique identifier for callback function wrapper","     * @protected","     */","     _generateRequest: function (guid) {","        return \"&\" + this.get(\"scriptCallbackParam\") +","                \"=YUI.Env.DataSource.callbacks.\" + guid;","    }","","}, {","","    /**","     * Class name.","     *","     * @property NAME","     * @type String","     * @static     ","     * @final","     * @value \"dataSourceGet\"","     */","    NAME: \"dataSourceGet\",","","","    ////////////////////////////////////////////////////////////////////////////","    //","    // DataSource.Get Attributes","    //","    ////////////////////////////////////////////////////////////////////////////","    ATTRS: {","        /**","         * Pointer to Get Utility.","         *","         * @attribute get","         * @type Y.Get","         * @default Y.Get","         */","        get: {","            value: Y.Get,","            cloneDefaultValue: false","        },","","        /**","         * Defines request/response management in the following manner:","         * <dl>","         *     <!--<dt>queueRequests</dt>","         *     <dd>If a request is already in progress, wait until response is","         *     returned before sending the next request.</dd>","         *     <dt>cancelStaleRequests</dt>","         *     <dd>If a request is already in progress, cancel it before","         *     sending the next request.</dd>-->","         *     <dt>ignoreStaleResponses</dt>","         *     <dd>Send all requests, but handle only the response for the most","         *     recently sent request.</dd>","         *     <dt>allowAll</dt>","         *     <dd>Send all requests and handle all responses.</dd>","         * </dl>","         *","         * @attribute asyncMode","         * @type String","         * @default \"allowAll\"","         */","        asyncMode: {","            value: \"allowAll\"","        },","","        /**","         * Callback string parameter name sent to the remote script. By default,","         * requests are sent to","         * &#60;URI&#62;?&#60;scriptCallbackParam&#62;=callbackFunction","         *","         * @attribute scriptCallbackParam","         * @type String","         * @default \"callback\"","         */","        scriptCallbackParam : {","            value: \"callback\"","        },","","        /**","         * Accepts the DataSource instance and a callback ID, and returns a callback","         * param/value string that gets appended to the script URI. Implementers","         * can customize this string to match their server's query syntax.","         *","         * @attribute generateRequestCallback","         * @type Function","         */","        generateRequestCallback : {","            value: function () {","                return this._generateRequest.apply(this, arguments);","            }","        }","    }","});","  ","YUI.namespace(\"Env.DataSource.callbacks\");","","","}, '3.7.3', {\"requires\": [\"datasource-local\", \"get\"]});"];
_yuitest_coverage["build/datasource-get/datasource-get.js"].lines = {"1":0,"16":0,"17":0,"21":0,"42":0,"57":0,"61":0,"62":0,"63":0,"65":0,"68":0,"69":0,"71":0,"78":0,"81":0,"85":0,"86":0,"88":0,"91":0,"94":0,"95":0,"97":0,"100":0,"104":0,"117":0,"200":0,"206":0};
_yuitest_coverage["build/datasource-get/datasource-get.js"].functions = {"DSGet:16":0,"]:61":0,"onFailure:84":0,"onTimeout:93":0,"_defRequestFn:41":0,"_generateRequest:116":0,"value:199":0,"(anonymous 1):1":0};
_yuitest_coverage["build/datasource-get/datasource-get.js"].coveredLines = 27;
_yuitest_coverage["build/datasource-get/datasource-get.js"].coveredFunctions = 8;
_yuitest_coverline("build/datasource-get/datasource-get.js", 1);
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
_yuitest_coverfunc("build/datasource-get/datasource-get.js", "(anonymous 1)", 1);
_yuitest_coverline("build/datasource-get/datasource-get.js", 16);
var DSGet = function() {
    _yuitest_coverfunc("build/datasource-get/datasource-get.js", "DSGet", 16);
_yuitest_coverline("build/datasource-get/datasource-get.js", 17);
DSGet.superclass.constructor.apply(this, arguments);
};
    
    
_yuitest_coverline("build/datasource-get/datasource-get.js", 21);
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
        _yuitest_coverfunc("build/datasource-get/datasource-get.js", "_defRequestFn", 41);
_yuitest_coverline("build/datasource-get/datasource-get.js", 42);
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
        _yuitest_coverline("build/datasource-get/datasource-get.js", 57);
this._last = guid;

        // Dynamically add handler function with a closure to the callback stack
        // for access to guid
        _yuitest_coverline("build/datasource-get/datasource-get.js", 61);
YUI.Env.DataSource.callbacks[guid] = function(response) {
            _yuitest_coverfunc("build/datasource-get/datasource-get.js", "]", 61);
_yuitest_coverline("build/datasource-get/datasource-get.js", 62);
delete YUI.Env.DataSource.callbacks[guid];
            _yuitest_coverline("build/datasource-get/datasource-get.js", 63);
delete Y.DataSource.Local.transactions[e.tId];

            _yuitest_coverline("build/datasource-get/datasource-get.js", 65);
var process = self.get('asyncMode') !== "ignoreStaleResponses" ||
                          self._last === guid;

            _yuitest_coverline("build/datasource-get/datasource-get.js", 68);
if (process) {
                _yuitest_coverline("build/datasource-get/datasource-get.js", 69);
payload.data = response;

                _yuitest_coverline("build/datasource-get/datasource-get.js", 71);
self.fire("data", payload);
            } else {
            }

        };

        // Add the callback param to the request url
        _yuitest_coverline("build/datasource-get/datasource-get.js", 78);
uri += e.request + generateRequest.call( this, guid );


        _yuitest_coverline("build/datasource-get/datasource-get.js", 81);
Y.DataSource.Local.transactions[e.tId] = get.script(uri, {
            autopurge: true,
            // Works in Firefox only....
            onFailure: function (o) {
                _yuitest_coverfunc("build/datasource-get/datasource-get.js", "onFailure", 84);
_yuitest_coverline("build/datasource-get/datasource-get.js", 85);
delete YUI.Env.DataSource.callbacks[guid];
                _yuitest_coverline("build/datasource-get/datasource-get.js", 86);
delete Y.DataSource.Local.transactions[e.tId];

                _yuitest_coverline("build/datasource-get/datasource-get.js", 88);
payload.error = new Error(o.msg || "Script node data failure");


                _yuitest_coverline("build/datasource-get/datasource-get.js", 91);
self.fire("data", payload);
            },
            onTimeout: function(o) {
                _yuitest_coverfunc("build/datasource-get/datasource-get.js", "onTimeout", 93);
_yuitest_coverline("build/datasource-get/datasource-get.js", 94);
delete YUI.Env.DataSource.callbacks[guid];
                _yuitest_coverline("build/datasource-get/datasource-get.js", 95);
delete Y.DataSource.Local.transactions[e.tId];

                _yuitest_coverline("build/datasource-get/datasource-get.js", 97);
payload.error = new Error(o.msg || "Script node data timeout");


                _yuitest_coverline("build/datasource-get/datasource-get.js", 100);
self.fire("data", payload);
            }
        });

        _yuitest_coverline("build/datasource-get/datasource-get.js", 104);
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
        _yuitest_coverfunc("build/datasource-get/datasource-get.js", "_generateRequest", 116);
_yuitest_coverline("build/datasource-get/datasource-get.js", 117);
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
                _yuitest_coverfunc("build/datasource-get/datasource-get.js", "value", 199);
_yuitest_coverline("build/datasource-get/datasource-get.js", 200);
return this._generateRequest.apply(this, arguments);
            }
        }
    }
});
  
_yuitest_coverline("build/datasource-get/datasource-get.js", 206);
YUI.namespace("Env.DataSource.callbacks");


}, '3.7.3', {"requires": ["datasource-local", "get"]});
