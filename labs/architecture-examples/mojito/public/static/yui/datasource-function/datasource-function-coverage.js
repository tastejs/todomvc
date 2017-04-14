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
_yuitest_coverage["build/datasource-function/datasource-function.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/datasource-function/datasource-function.js",
    code: []
};
_yuitest_coverage["build/datasource-function/datasource-function.js"].code=["YUI.add('datasource-function', function (Y, NAME) {","","/**"," * Provides a DataSource implementation which can be used to retrieve data from"," * a custom function."," *"," * @module datasource"," * @submodule datasource-function"," */","","/**"," * Function subclass for the DataSource Utility."," * @class DataSource.Function"," * @extends DataSource.Local"," * @constructor"," */    ","var LANG = Y.Lang,","","    DSFn = function() {","        DSFn.superclass.constructor.apply(this, arguments);","    };","    ","","    /////////////////////////////////////////////////////////////////////////////","    //","    // DataSource.Function static properties","    //","    /////////////////////////////////////////////////////////////////////////////","Y.mix(DSFn, {","    /**","     * Class name.","     *","     * @property NAME","     * @type String","     * @static     ","     * @final","     * @value \"dataSourceFunction\"","     */","    NAME: \"dataSourceFunction\",","","","    /////////////////////////////////////////////////////////////////////////////","    //","    // DataSource.Function Attributes","    //","    /////////////////////////////////////////////////////////////////////////////","","    ATTRS: {","        /**","        * Stores the function that will serve the response data.","        *","        * @attribute source","        * @type {Any}","        * @default null","        */","        source: {","            validator: LANG.isFunction","        }","    }","});","    ","Y.extend(DSFn, Y.DataSource.Local, {","    /**","     * Passes query data to the source function. Fires <code>response</code>","     * event with the function results (synchronously).","     *","     * @method _defRequestFn","     * @param e {Event.Facade} Event Facade with the following properties:","     * <dl>","     * <dt>tId (Number)</dt> <dd>Unique transaction ID.</dd>","     * <dt>request (Object)</dt> <dd>The request.</dd>","     * <dt>callback (Object)</dt> <dd>The callback object with the following","     * properties:","     *     <dl>","     *         <dt>success (Function)</dt> <dd>Success handler.</dd>","     *         <dt>failure (Function)</dt> <dd>Failure handler.</dd>","     *     </dl>","     * </dd>","     * <dt>cfg (Object)</dt> <dd>Configuration object.</dd>","     * </dl>","     * @protected","     */","    _defRequestFn: function(e) {","        var fn = this.get(\"source\"),","            payload = e.details[0];","            ","        if (fn) {","            try {","                payload.data = fn(e.request, this, e);","            } catch (ex) {","                payload.error = ex;","            }","        } else {","            payload.error = new Error(\"Function data failure\");","        }","","        this.fire(\"data\", payload);","            ","        return e.tId;","    }","});","  ","Y.DataSource.Function = DSFn;","","","}, '3.7.3', {\"requires\": [\"datasource-local\"]});"];
_yuitest_coverage["build/datasource-function/datasource-function.js"].lines = {"1":0,"17":0,"20":0,"29":0,"62":0,"84":0,"87":0,"88":0,"89":0,"91":0,"94":0,"97":0,"99":0,"103":0};
_yuitest_coverage["build/datasource-function/datasource-function.js"].functions = {"DSFn:19":0,"_defRequestFn:83":0,"(anonymous 1):1":0};
_yuitest_coverage["build/datasource-function/datasource-function.js"].coveredLines = 14;
_yuitest_coverage["build/datasource-function/datasource-function.js"].coveredFunctions = 3;
_yuitest_coverline("build/datasource-function/datasource-function.js", 1);
YUI.add('datasource-function', function (Y, NAME) {

/**
 * Provides a DataSource implementation which can be used to retrieve data from
 * a custom function.
 *
 * @module datasource
 * @submodule datasource-function
 */

/**
 * Function subclass for the DataSource Utility.
 * @class DataSource.Function
 * @extends DataSource.Local
 * @constructor
 */    
_yuitest_coverfunc("build/datasource-function/datasource-function.js", "(anonymous 1)", 1);
_yuitest_coverline("build/datasource-function/datasource-function.js", 17);
var LANG = Y.Lang,

    DSFn = function() {
        _yuitest_coverfunc("build/datasource-function/datasource-function.js", "DSFn", 19);
_yuitest_coverline("build/datasource-function/datasource-function.js", 20);
DSFn.superclass.constructor.apply(this, arguments);
    };
    

    /////////////////////////////////////////////////////////////////////////////
    //
    // DataSource.Function static properties
    //
    /////////////////////////////////////////////////////////////////////////////
_yuitest_coverline("build/datasource-function/datasource-function.js", 29);
Y.mix(DSFn, {
    /**
     * Class name.
     *
     * @property NAME
     * @type String
     * @static     
     * @final
     * @value "dataSourceFunction"
     */
    NAME: "dataSourceFunction",


    /////////////////////////////////////////////////////////////////////////////
    //
    // DataSource.Function Attributes
    //
    /////////////////////////////////////////////////////////////////////////////

    ATTRS: {
        /**
        * Stores the function that will serve the response data.
        *
        * @attribute source
        * @type {Any}
        * @default null
        */
        source: {
            validator: LANG.isFunction
        }
    }
});
    
_yuitest_coverline("build/datasource-function/datasource-function.js", 62);
Y.extend(DSFn, Y.DataSource.Local, {
    /**
     * Passes query data to the source function. Fires <code>response</code>
     * event with the function results (synchronously).
     *
     * @method _defRequestFn
     * @param e {Event.Facade} Event Facade with the following properties:
     * <dl>
     * <dt>tId (Number)</dt> <dd>Unique transaction ID.</dd>
     * <dt>request (Object)</dt> <dd>The request.</dd>
     * <dt>callback (Object)</dt> <dd>The callback object with the following
     * properties:
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
        _yuitest_coverfunc("build/datasource-function/datasource-function.js", "_defRequestFn", 83);
_yuitest_coverline("build/datasource-function/datasource-function.js", 84);
var fn = this.get("source"),
            payload = e.details[0];
            
        _yuitest_coverline("build/datasource-function/datasource-function.js", 87);
if (fn) {
            _yuitest_coverline("build/datasource-function/datasource-function.js", 88);
try {
                _yuitest_coverline("build/datasource-function/datasource-function.js", 89);
payload.data = fn(e.request, this, e);
            } catch (ex) {
                _yuitest_coverline("build/datasource-function/datasource-function.js", 91);
payload.error = ex;
            }
        } else {
            _yuitest_coverline("build/datasource-function/datasource-function.js", 94);
payload.error = new Error("Function data failure");
        }

        _yuitest_coverline("build/datasource-function/datasource-function.js", 97);
this.fire("data", payload);
            
        _yuitest_coverline("build/datasource-function/datasource-function.js", 99);
return e.tId;
    }
});
  
_yuitest_coverline("build/datasource-function/datasource-function.js", 103);
Y.DataSource.Function = DSFn;


}, '3.7.3', {"requires": ["datasource-local"]});
