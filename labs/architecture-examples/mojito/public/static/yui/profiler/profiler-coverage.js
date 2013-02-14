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
_yuitest_coverage["build/profiler/profiler.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/profiler/profiler.js",
    code: []
};
_yuitest_coverage["build/profiler/profiler.js"].code=["YUI.add('profiler', function (Y, NAME) {","","    /**","     * The YUI JavaScript profiler.","     * @module profiler","     */","     ","    //-------------------------------------------------------------------------","    // Private Variables and Functions","    //-------------------------------------------------------------------------","    ","    var container   = {},   //Container object on which to put the original unprofiled methods.","        report      = {},   //Profiling information for functions","        stopwatches = {},   //Additional stopwatch information","        ","        WATCH_STARTED   = 0,","        WATCH_STOPPED   = 1,","        WATCH_PAUSED    = 2,    ","        ","        //shortcuts","        L   = Y.Lang;","","    /* (intentionally not documented)","     * Creates a report object with the given name.","     * @param {String} name The name to store for the report object.","     * @return {Void}","     * @method createReport","     * @private","     */","    function createReport(name){","        report[name] = {","            calls: 0,","            max: 0,","            min: 0,","            avg: 0,","            points: []","        };","        return report[name];","    }","    ","    /* (intentionally not documented)","     * Called when a method ends execution. Marks the start and end time of the ","     * method so it can calculate how long the function took to execute. Also ","     * updates min/max/avg calculations for the function.","     * @param {String} name The name of the function to mark as stopped.","     * @param {int} duration The number of milliseconds it took the function to","     *      execute.","     * @return {Void}","     * @method saveDataPoint","     * @private","     * @static","     */","    function saveDataPoint(name, duration){","","        //get the function data","        var functionData /*:Object*/ = report[name];","        ","        //just in case clear() was called","        if (!functionData){","            functionData = createReport(name);","        }","    ","        //increment the calls","        functionData.calls++;","        functionData.points.push(duration);","","        //if it's already been called at least once, do more complex calculations","        if (functionData.calls > 1) {","            functionData.avg = ((functionData.avg*(functionData.calls-1))+duration)/functionData.calls;","            functionData.min = Math.min(functionData.min, duration);","            functionData.max = Math.max(functionData.max, duration);","        } else {","            functionData.avg = duration;","            functionData.min = duration;","            functionData.max = duration;","        }                             ","    ","    }","    ","    //-------------------------------------------------------------------------","    // Public Interface","    //-------------------------------------------------------------------------","    ","    /**","     * Profiles functions in JavaScript.","     * @class Profiler","     * @static","     */","    Y.Profiler = {","    ","        //-------------------------------------------------------------------------","        // Utility Methods","        //-------------------------------------------------------------------------        ","        ","        /**","         * Removes all report data from the profiler.","         * @param {String} name (Optional) The name of the report to clear. If","         *      omitted, then all report data is cleared.","         * @return {Void}","         * @method clear","         * @static","         */","        clear: function(name){","            if (L.isString(name)){","                delete report[name];","                delete stopwatches[name];","            } else {","                report = {};","                stopwatches = {};","            }","        },","","        /**","         * Returns the uninstrumented version of a function/object.","         * @param {String} name The name of the function/object to retrieve.","         * @return {Function|Object} The uninstrumented version of a function/object.","         * @method getOriginal","         * @static","         */    ","        getOriginal: function(name){","            return container[name];","        },","    ","        /**","         * Instruments a method to have profiling calls.","         * @param {String} name The name of the report for the function.","         * @param {Function} method The function to instrument.","         * @return {Function} An instrumented version of the function.","         * @method instrument","         * @static","         */","        instrument: function(name, method){","        ","            //create instrumented version of function","            var newMethod = function () {","    ","                var start = new Date(),","                    retval = method.apply(this, arguments),","                    stop = new Date();","                ","                saveDataPoint(name, stop-start);","                ","                return retval;                ","            ","            };     ","","            //copy the function properties over","            Y.mix(newMethod, method);","            ","            //assign prototype and flag as being profiled","            newMethod.__yuiProfiled = true;","            newMethod.prototype = method.prototype;","            ","            //store original method","            container[name] = method;","            container[name].__yuiFuncName = name;","            ","            //create the report","            createReport(name);","","            //return the new method","            return newMethod;","        },    ","        ","        //-------------------------------------------------------------------------","        // Stopwatch Methods","        //-------------------------------------------------------------------------        ","        ","        /**","         * Pauses profiling information for a given name.","         * @param {String} name The name of the data point.","         * @return {Void}","         * @method pause","         * @static","         */        ","        pause: function(name){","            var now = new Date(),","                stopwatch = stopwatches[name];","                ","            if (stopwatch && stopwatch.state == WATCH_STARTED){","                stopwatch.total += (now - stopwatch.start);","                stopwatch.start = 0;","                stopwatch.state = WATCH_PAUSED;","            }","        ","        },","        ","        /**","         * Start profiling information for a given name. The name cannot be the name","         * of a registered function or object. This is used to start timing for a","         * particular block of code rather than instrumenting the entire function.","         * @param {String} name The name of the data point.","         * @return {Void}","         * @method start","         * @static","         */","        start: function(name){","            if(container[name]){","                throw new Error(\"Cannot use '\" + name + \"' for profiling through start(), name is already in use.\");","            } else {","            ","                //create report if necessary","                if (!report[name]){","                    createReport(name);","                }","                ","                //create stopwatch object if necessary","                if (!stopwatches[name]){             ","                    stopwatches[name] = {","                        state: WATCH_STOPPED,","                        start: 0,","                        total: 0","                    };","                }","                ","                if (stopwatches[name].state == WATCH_STOPPED){","                    stopwatches[name].state = WATCH_STARTED;","                    stopwatches[name].start = new Date();                    ","                }","","            }","        },","        ","        /**","         * Stops profiling information for a given name.","         * @param {String} name The name of the data point.","         * @return {Void}","         * @method stop","         * @static","         */","        stop: function(name){","            var now = new Date(),","                stopwatch = stopwatches[name];","                ","            if (stopwatch){","                if (stopwatch.state == WATCH_STARTED){","                    saveDataPoint(name, stopwatch.total + (now - stopwatch.start));                    ","                } else if (stopwatch.state == WATCH_PAUSED){","                    saveDataPoint(name, stopwatch.total);","                }","                ","                //reset stopwatch information","                stopwatch.start = 0;","                stopwatch.total = 0;","                stopwatch.state = WATCH_STOPPED;                ","            }","        },","    ","        //-------------------------------------------------------------------------","        // Reporting Methods","        //-------------------------------------------------------------------------    ","        ","        /**","         * Returns the average amount of time (in milliseconds) that the function","         * with the given name takes to execute.","         * @param {String} name The name of the function whose data should be returned.","         *      If an object type method, it should be 'constructor.prototype.methodName';","         *      a normal object method would just be 'object.methodName'.","         * @return {float} The average time it takes the function to execute.","         * @method getAverage","         * @static","         */","        getAverage : function (name /*:String*/) /*:float*/ {","            return report[name].avg;","        },","    ","        /**","         * Returns the number of times that the given function has been called.","         * @param {String} name The name of the function whose data should be returned.","         * @return {int} The number of times the function was called.","         * @method getCallCount","         * @static","         */","        getCallCount : function (name /*:String*/) /*:int*/ {","            return report[name].calls;    ","        },","        ","        /**","         * Returns the maximum amount of time (in milliseconds) that the function","         * with the given name takes to execute.","         * @param {String} name The name of the function whose data should be returned.","         *      If an object type method, it should be 'constructor.prototype.methodName';","         *      a normal object method would just be 'object.methodName'.","         * @return {float} The maximum time it takes the function to execute.","         * @method getMax","         * @static","         */","        getMax : function (name /*:String*/) /*:int*/ {","            return report[name].max;","        },","        ","        /**","         * Returns the minimum amount of time (in milliseconds) that the function","         * with the given name takes to execute.","         * @param {String} name The name of the function whose data should be returned.","         *      If an object type method, it should be 'constructor.prototype.methodName';","         *      a normal object method would just be 'object.methodName'.","         * @return {float} The minimum time it takes the function to execute.","         * @method getMin","         * @static","         */","        getMin : function (name /*:String*/) /*:int*/ {","            return report[name].min;","        },","    ","        /**","         * Returns an object containing profiling data for a single function.","         * The object has an entry for min, max, avg, calls, and points).","         * @return {Object} An object containing profile data for a given function.","         * @method getFunctionReport","         * @static","         * @deprecated Use getReport() instead.","         */","        getFunctionReport : function (name /*:String*/) /*:Object*/ {","            return report[name];","        },","    ","        /**","         * Returns an object containing profiling data for a single function.","         * The object has an entry for min, max, avg, calls, and points).","         * @return {Object} An object containing profile data for a given function.","         * @method getReport","         * @static","         */","        getReport : function (name /*:String*/) /*:Object*/ {","            return report[name];","        },","    ","        /**","         * Returns an object containing profiling data for all of the functions ","         * that were profiled. The object has an entry for each function and ","         * returns all information (min, max, average, calls, etc.) for each","         * function.","         * @return {Object} An object containing all profile data.","         * @method getFullReport","         * @static","         */","        getFullReport : function (filter /*:Function*/) /*:Object*/ {","            filter = filter || function(){return true;};","        ","            if (L.isFunction(filter)) {","                var fullReport = {};","                ","                for (var name in report){","                    if (filter(report[name])){","                        fullReport[name] = report[name];    ","                    }","                }","                ","                return fullReport;","            }","        },","    ","        //-------------------------------------------------------------------------","        // Profiling Methods","        //-------------------------------------------------------------------------   ","        ","        /**","         * Sets up a constructor for profiling, including all properties and methods on the prototype.","         * @param {string} name The fully-qualified name of the function including namespace information.","         * @param {Object} owner (Optional) The object that owns the function (namespace or containing object).","         * @return {Void}","         * @method registerConstructor","         * @static","         */","        registerConstructor : function (name /*:String*/, owner /*:Object*/) /*:Void*/ {    ","            this.registerFunction(name, owner, true);","        },","    ","        /**","         * Sets up a function for profiling. It essentially overwrites the function with one","         * that has instrumentation data. This method also creates an entry for the function","         * in the profile report. The original function is stored on the container object.","         * @param {String} name The full name of the function including namespacing. This","         *      is the name of the function that is stored in the report.","         * @param {Object} owner (Optional) The object that owns the function. If the function","         *      isn't global then this argument is required. This could be the namespace that","         *      the function belongs to or the object on which it's","         *      a method.","         * @param {Boolean} registerPrototype (Optional) Indicates that the prototype should","         *      also be instrumented. Setting to true has the same effect as calling","         *      registerConstructor().","         * @return {Void}","         * @method registerFunction","         * @static","         */     ","        registerFunction : function(name /*:String*/, owner /*:Object*/, registerPrototype /*:Boolean*/) /*:Void*/{","        ","            //figure out the function name without namespacing","            var funcName = (name.indexOf(\".\") > -1 ? ","                    name.substring(name.lastIndexOf(\".\")+1) : name),","                method,","                prototype;","                ","            //if owner isn't an object, try to find it from the name","            if (!L.isObject(owner)){","                owner = eval(name.substring(0, name.lastIndexOf(\".\")));","            }","            ","            //get the method and prototype","            method = owner[funcName];","            prototype = method.prototype;","            ","            //see if the method has already been registered","            if (L.isFunction(method) && !method.__yuiProfiled){","                ","                //replace the function with the profiling one","                owner[funcName] = this.instrument(name, method);","                        ","                /*","                 * Store original function information. We store the actual","                 * function as well as the owner and the name used to identify","                 * the function so it can be restored later.","                 */","                container[name].__yuiOwner = owner;","                container[name].__yuiFuncName = funcName;  //overwrite with less-specific name","                 ","                //register prototype if necessary","                if (registerPrototype) {            ","                    this.registerObject(name + \".prototype\", prototype);          ","                }","    ","            }","        ","        },","            ","        ","        /**","         * Sets up an object for profiling. It takes the object and looks for functions.","         * When a function is found, registerMethod() is called on it. If set to recrusive","         * mode, it will also setup objects found inside of this object for profiling, ","         * using the same methodology.","         * @param {String} name The name of the object to profile (shows up in report).","         * @param {Object} owner (Optional) The object represented by the name.","         * @param {Boolean} recurse (Optional) Determines if subobject methods are also profiled.","         * @return {Void}","         * @method registerObject","         * @static","         */","        registerObject : function (name /*:String*/, object /*:Object*/, recurse /*:Boolean*/) /*:Void*/{","        ","            //get the object","            object = (L.isObject(object) ? object : eval(name));","        ","            //save the object","            container[name] = object;","        ","            for (var prop in object) {","                if (typeof object[prop] == \"function\"){","                    if (prop != \"constructor\" && prop != \"superclass\"){ //don't do constructor or superclass, it's recursive","                        this.registerFunction(name + \".\" + prop, object);","                    }","                } else if (typeof object[prop] == \"object\" && recurse){","                    this.registerObject(name + \".\" + prop, object[prop], recurse);","                }","            }","        ","        },    ","        ","        /**","         * Removes a constructor function from profiling. Reverses the registerConstructor() method.","         * @param {String} name The full name of the function including namespacing. This","         *      is the name of the function that is stored in the report.","         * @return {Void}","         * @method unregisterFunction","         * @static","         */     ","        unregisterConstructor : function(name /*:String*/) /*:Void*/{","                ","            //see if the method has been registered","            if (L.isFunction(container[name])){","                this.unregisterFunction(name, true);","            }    ","        },","        ","        /**","         * Removes function from profiling. Reverses the registerFunction() method.","         * @param {String} name The full name of the function including namespacing. This","         *      is the name of the function that is stored in the report.","         * @return {Void}","         * @method unregisterFunction","         * @static","         */     ","        unregisterFunction : function(name /*:String*/, unregisterPrototype /*:Boolean*/) /*:Void*/{","                ","            //see if the method has been registered","            if (L.isFunction(container[name])){","            ","                //check to see if you should unregister the prototype","                if (unregisterPrototype){","                    this.unregisterObject(name + \".prototype\", container[name].prototype);","                }","                    ","                //get original data","                var owner /*:Object*/ = container[name].__yuiOwner,","                    funcName /*:String*/ = container[name].__yuiFuncName;","                    ","                //delete extra information","                delete container[name].__yuiOwner;","                delete container[name].__yuiFuncName;","                ","                //replace instrumented function","                owner[funcName] = container[name];","                ","                //delete supporting information","                delete container[name];          ","            }","                ","        ","        },","        ","        /**","         * Unregisters an object for profiling. It takes the object and looks for functions.","         * When a function is found, unregisterMethod() is called on it. If set to recrusive","         * mode, it will also unregister objects found inside of this object, ","         * using the same methodology.","         * @param {String} name The name of the object to unregister.","         * @param {Boolean} recurse (Optional) Determines if subobject methods should also be","         *      unregistered.","         * @return {Void}","         * @method unregisterObject","         * @static","         */","        unregisterObject : function (name /*:String*/, recurse /*:Boolean*/) /*:Void*/{","        ","            //get the object","            if (L.isObject(container[name])){            ","                var object = container[name];    ","            ","                for (var prop in object) {","                    if (typeof object[prop] == \"function\"){","                        this.unregisterFunction(name + \".\" + prop);","                    } else if (typeof object[prop] == \"object\" && recurse){","                        this.unregisterObject(name + \".\" + prop, recurse);","                    }","                }","                ","                delete container[name];","            }","        ","        }","             ","    ","    };","","}, '3.7.3', {\"requires\": [\"yui-base\"]});"];
_yuitest_coverage["build/profiler/profiler.js"].lines = {"1":0,"12":0,"30":0,"31":0,"38":0,"53":0,"56":0,"59":0,"60":0,"64":0,"65":0,"68":0,"69":0,"70":0,"71":0,"73":0,"74":0,"75":0,"89":0,"104":0,"105":0,"106":0,"108":0,"109":0,"121":0,"135":0,"137":0,"141":0,"143":0,"148":0,"151":0,"152":0,"155":0,"156":0,"159":0,"162":0,"177":0,"180":0,"181":0,"182":0,"183":0,"198":0,"199":0,"203":0,"204":0,"208":0,"209":0,"216":0,"217":0,"218":0,"232":0,"235":0,"236":0,"237":0,"238":0,"239":0,"243":0,"244":0,"245":0,"264":0,"275":0,"289":0,"303":0,"315":0,"326":0,"339":0,"341":0,"342":0,"344":0,"345":0,"346":0,"350":0,"367":0,"390":0,"396":0,"397":0,"401":0,"402":0,"405":0,"408":0,"415":0,"416":0,"419":0,"420":0,"443":0,"446":0,"448":0,"449":0,"450":0,"451":0,"453":0,"454":0,"471":0,"472":0,"487":0,"490":0,"491":0,"495":0,"499":0,"500":0,"503":0,"506":0,"527":0,"528":0,"530":0,"531":0,"532":0,"533":0,"534":0,"538":0};
_yuitest_coverage["build/profiler/profiler.js"].functions = {"createReport:30":0,"saveDataPoint:53":0,"clear:103":0,"getOriginal:120":0,"newMethod:135":0,"instrument:132":0,"pause:176":0,"start:197":0,"stop:231":0,"getAverage:263":0,"getCallCount:274":0,"getMax:288":0,"getMin:302":0,"getFunctionReport:314":0,"getReport:325":0,"(anonymous 2):339":0,"getFullReport:338":0,"registerConstructor:366":0,"registerFunction:387":0,"registerObject:440":0,"unregisterConstructor:468":0,"unregisterFunction:484":0,"unregisterObject:524":0,"(anonymous 1):1":0};
_yuitest_coverage["build/profiler/profiler.js"].coveredLines = 110;
_yuitest_coverage["build/profiler/profiler.js"].coveredFunctions = 24;
_yuitest_coverline("build/profiler/profiler.js", 1);
YUI.add('profiler', function (Y, NAME) {

    /**
     * The YUI JavaScript profiler.
     * @module profiler
     */
     
    //-------------------------------------------------------------------------
    // Private Variables and Functions
    //-------------------------------------------------------------------------
    
    _yuitest_coverfunc("build/profiler/profiler.js", "(anonymous 1)", 1);
_yuitest_coverline("build/profiler/profiler.js", 12);
var container   = {},   //Container object on which to put the original unprofiled methods.
        report      = {},   //Profiling information for functions
        stopwatches = {},   //Additional stopwatch information
        
        WATCH_STARTED   = 0,
        WATCH_STOPPED   = 1,
        WATCH_PAUSED    = 2,    
        
        //shortcuts
        L   = Y.Lang;

    /* (intentionally not documented)
     * Creates a report object with the given name.
     * @param {String} name The name to store for the report object.
     * @return {Void}
     * @method createReport
     * @private
     */
    _yuitest_coverline("build/profiler/profiler.js", 30);
function createReport(name){
        _yuitest_coverfunc("build/profiler/profiler.js", "createReport", 30);
_yuitest_coverline("build/profiler/profiler.js", 31);
report[name] = {
            calls: 0,
            max: 0,
            min: 0,
            avg: 0,
            points: []
        };
        _yuitest_coverline("build/profiler/profiler.js", 38);
return report[name];
    }
    
    /* (intentionally not documented)
     * Called when a method ends execution. Marks the start and end time of the 
     * method so it can calculate how long the function took to execute. Also 
     * updates min/max/avg calculations for the function.
     * @param {String} name The name of the function to mark as stopped.
     * @param {int} duration The number of milliseconds it took the function to
     *      execute.
     * @return {Void}
     * @method saveDataPoint
     * @private
     * @static
     */
    _yuitest_coverline("build/profiler/profiler.js", 53);
function saveDataPoint(name, duration){

        //get the function data
        _yuitest_coverfunc("build/profiler/profiler.js", "saveDataPoint", 53);
_yuitest_coverline("build/profiler/profiler.js", 56);
var functionData /*:Object*/ = report[name];
        
        //just in case clear() was called
        _yuitest_coverline("build/profiler/profiler.js", 59);
if (!functionData){
            _yuitest_coverline("build/profiler/profiler.js", 60);
functionData = createReport(name);
        }
    
        //increment the calls
        _yuitest_coverline("build/profiler/profiler.js", 64);
functionData.calls++;
        _yuitest_coverline("build/profiler/profiler.js", 65);
functionData.points.push(duration);

        //if it's already been called at least once, do more complex calculations
        _yuitest_coverline("build/profiler/profiler.js", 68);
if (functionData.calls > 1) {
            _yuitest_coverline("build/profiler/profiler.js", 69);
functionData.avg = ((functionData.avg*(functionData.calls-1))+duration)/functionData.calls;
            _yuitest_coverline("build/profiler/profiler.js", 70);
functionData.min = Math.min(functionData.min, duration);
            _yuitest_coverline("build/profiler/profiler.js", 71);
functionData.max = Math.max(functionData.max, duration);
        } else {
            _yuitest_coverline("build/profiler/profiler.js", 73);
functionData.avg = duration;
            _yuitest_coverline("build/profiler/profiler.js", 74);
functionData.min = duration;
            _yuitest_coverline("build/profiler/profiler.js", 75);
functionData.max = duration;
        }                             
    
    }
    
    //-------------------------------------------------------------------------
    // Public Interface
    //-------------------------------------------------------------------------
    
    /**
     * Profiles functions in JavaScript.
     * @class Profiler
     * @static
     */
    _yuitest_coverline("build/profiler/profiler.js", 89);
Y.Profiler = {
    
        //-------------------------------------------------------------------------
        // Utility Methods
        //-------------------------------------------------------------------------        
        
        /**
         * Removes all report data from the profiler.
         * @param {String} name (Optional) The name of the report to clear. If
         *      omitted, then all report data is cleared.
         * @return {Void}
         * @method clear
         * @static
         */
        clear: function(name){
            _yuitest_coverfunc("build/profiler/profiler.js", "clear", 103);
_yuitest_coverline("build/profiler/profiler.js", 104);
if (L.isString(name)){
                _yuitest_coverline("build/profiler/profiler.js", 105);
delete report[name];
                _yuitest_coverline("build/profiler/profiler.js", 106);
delete stopwatches[name];
            } else {
                _yuitest_coverline("build/profiler/profiler.js", 108);
report = {};
                _yuitest_coverline("build/profiler/profiler.js", 109);
stopwatches = {};
            }
        },

        /**
         * Returns the uninstrumented version of a function/object.
         * @param {String} name The name of the function/object to retrieve.
         * @return {Function|Object} The uninstrumented version of a function/object.
         * @method getOriginal
         * @static
         */    
        getOriginal: function(name){
            _yuitest_coverfunc("build/profiler/profiler.js", "getOriginal", 120);
_yuitest_coverline("build/profiler/profiler.js", 121);
return container[name];
        },
    
        /**
         * Instruments a method to have profiling calls.
         * @param {String} name The name of the report for the function.
         * @param {Function} method The function to instrument.
         * @return {Function} An instrumented version of the function.
         * @method instrument
         * @static
         */
        instrument: function(name, method){
        
            //create instrumented version of function
            _yuitest_coverfunc("build/profiler/profiler.js", "instrument", 132);
_yuitest_coverline("build/profiler/profiler.js", 135);
var newMethod = function () {
    
                _yuitest_coverfunc("build/profiler/profiler.js", "newMethod", 135);
_yuitest_coverline("build/profiler/profiler.js", 137);
var start = new Date(),
                    retval = method.apply(this, arguments),
                    stop = new Date();
                
                _yuitest_coverline("build/profiler/profiler.js", 141);
saveDataPoint(name, stop-start);
                
                _yuitest_coverline("build/profiler/profiler.js", 143);
return retval;                
            
            };     

            //copy the function properties over
            _yuitest_coverline("build/profiler/profiler.js", 148);
Y.mix(newMethod, method);
            
            //assign prototype and flag as being profiled
            _yuitest_coverline("build/profiler/profiler.js", 151);
newMethod.__yuiProfiled = true;
            _yuitest_coverline("build/profiler/profiler.js", 152);
newMethod.prototype = method.prototype;
            
            //store original method
            _yuitest_coverline("build/profiler/profiler.js", 155);
container[name] = method;
            _yuitest_coverline("build/profiler/profiler.js", 156);
container[name].__yuiFuncName = name;
            
            //create the report
            _yuitest_coverline("build/profiler/profiler.js", 159);
createReport(name);

            //return the new method
            _yuitest_coverline("build/profiler/profiler.js", 162);
return newMethod;
        },    
        
        //-------------------------------------------------------------------------
        // Stopwatch Methods
        //-------------------------------------------------------------------------        
        
        /**
         * Pauses profiling information for a given name.
         * @param {String} name The name of the data point.
         * @return {Void}
         * @method pause
         * @static
         */        
        pause: function(name){
            _yuitest_coverfunc("build/profiler/profiler.js", "pause", 176);
_yuitest_coverline("build/profiler/profiler.js", 177);
var now = new Date(),
                stopwatch = stopwatches[name];
                
            _yuitest_coverline("build/profiler/profiler.js", 180);
if (stopwatch && stopwatch.state == WATCH_STARTED){
                _yuitest_coverline("build/profiler/profiler.js", 181);
stopwatch.total += (now - stopwatch.start);
                _yuitest_coverline("build/profiler/profiler.js", 182);
stopwatch.start = 0;
                _yuitest_coverline("build/profiler/profiler.js", 183);
stopwatch.state = WATCH_PAUSED;
            }
        
        },
        
        /**
         * Start profiling information for a given name. The name cannot be the name
         * of a registered function or object. This is used to start timing for a
         * particular block of code rather than instrumenting the entire function.
         * @param {String} name The name of the data point.
         * @return {Void}
         * @method start
         * @static
         */
        start: function(name){
            _yuitest_coverfunc("build/profiler/profiler.js", "start", 197);
_yuitest_coverline("build/profiler/profiler.js", 198);
if(container[name]){
                _yuitest_coverline("build/profiler/profiler.js", 199);
throw new Error("Cannot use '" + name + "' for profiling through start(), name is already in use.");
            } else {
            
                //create report if necessary
                _yuitest_coverline("build/profiler/profiler.js", 203);
if (!report[name]){
                    _yuitest_coverline("build/profiler/profiler.js", 204);
createReport(name);
                }
                
                //create stopwatch object if necessary
                _yuitest_coverline("build/profiler/profiler.js", 208);
if (!stopwatches[name]){             
                    _yuitest_coverline("build/profiler/profiler.js", 209);
stopwatches[name] = {
                        state: WATCH_STOPPED,
                        start: 0,
                        total: 0
                    };
                }
                
                _yuitest_coverline("build/profiler/profiler.js", 216);
if (stopwatches[name].state == WATCH_STOPPED){
                    _yuitest_coverline("build/profiler/profiler.js", 217);
stopwatches[name].state = WATCH_STARTED;
                    _yuitest_coverline("build/profiler/profiler.js", 218);
stopwatches[name].start = new Date();                    
                }

            }
        },
        
        /**
         * Stops profiling information for a given name.
         * @param {String} name The name of the data point.
         * @return {Void}
         * @method stop
         * @static
         */
        stop: function(name){
            _yuitest_coverfunc("build/profiler/profiler.js", "stop", 231);
_yuitest_coverline("build/profiler/profiler.js", 232);
var now = new Date(),
                stopwatch = stopwatches[name];
                
            _yuitest_coverline("build/profiler/profiler.js", 235);
if (stopwatch){
                _yuitest_coverline("build/profiler/profiler.js", 236);
if (stopwatch.state == WATCH_STARTED){
                    _yuitest_coverline("build/profiler/profiler.js", 237);
saveDataPoint(name, stopwatch.total + (now - stopwatch.start));                    
                } else {_yuitest_coverline("build/profiler/profiler.js", 238);
if (stopwatch.state == WATCH_PAUSED){
                    _yuitest_coverline("build/profiler/profiler.js", 239);
saveDataPoint(name, stopwatch.total);
                }}
                
                //reset stopwatch information
                _yuitest_coverline("build/profiler/profiler.js", 243);
stopwatch.start = 0;
                _yuitest_coverline("build/profiler/profiler.js", 244);
stopwatch.total = 0;
                _yuitest_coverline("build/profiler/profiler.js", 245);
stopwatch.state = WATCH_STOPPED;                
            }
        },
    
        //-------------------------------------------------------------------------
        // Reporting Methods
        //-------------------------------------------------------------------------    
        
        /**
         * Returns the average amount of time (in milliseconds) that the function
         * with the given name takes to execute.
         * @param {String} name The name of the function whose data should be returned.
         *      If an object type method, it should be 'constructor.prototype.methodName';
         *      a normal object method would just be 'object.methodName'.
         * @return {float} The average time it takes the function to execute.
         * @method getAverage
         * @static
         */
        getAverage : function (name /*:String*/) /*:float*/ {
            _yuitest_coverfunc("build/profiler/profiler.js", "getAverage", 263);
_yuitest_coverline("build/profiler/profiler.js", 264);
return report[name].avg;
        },
    
        /**
         * Returns the number of times that the given function has been called.
         * @param {String} name The name of the function whose data should be returned.
         * @return {int} The number of times the function was called.
         * @method getCallCount
         * @static
         */
        getCallCount : function (name /*:String*/) /*:int*/ {
            _yuitest_coverfunc("build/profiler/profiler.js", "getCallCount", 274);
_yuitest_coverline("build/profiler/profiler.js", 275);
return report[name].calls;    
        },
        
        /**
         * Returns the maximum amount of time (in milliseconds) that the function
         * with the given name takes to execute.
         * @param {String} name The name of the function whose data should be returned.
         *      If an object type method, it should be 'constructor.prototype.methodName';
         *      a normal object method would just be 'object.methodName'.
         * @return {float} The maximum time it takes the function to execute.
         * @method getMax
         * @static
         */
        getMax : function (name /*:String*/) /*:int*/ {
            _yuitest_coverfunc("build/profiler/profiler.js", "getMax", 288);
_yuitest_coverline("build/profiler/profiler.js", 289);
return report[name].max;
        },
        
        /**
         * Returns the minimum amount of time (in milliseconds) that the function
         * with the given name takes to execute.
         * @param {String} name The name of the function whose data should be returned.
         *      If an object type method, it should be 'constructor.prototype.methodName';
         *      a normal object method would just be 'object.methodName'.
         * @return {float} The minimum time it takes the function to execute.
         * @method getMin
         * @static
         */
        getMin : function (name /*:String*/) /*:int*/ {
            _yuitest_coverfunc("build/profiler/profiler.js", "getMin", 302);
_yuitest_coverline("build/profiler/profiler.js", 303);
return report[name].min;
        },
    
        /**
         * Returns an object containing profiling data for a single function.
         * The object has an entry for min, max, avg, calls, and points).
         * @return {Object} An object containing profile data for a given function.
         * @method getFunctionReport
         * @static
         * @deprecated Use getReport() instead.
         */
        getFunctionReport : function (name /*:String*/) /*:Object*/ {
            _yuitest_coverfunc("build/profiler/profiler.js", "getFunctionReport", 314);
_yuitest_coverline("build/profiler/profiler.js", 315);
return report[name];
        },
    
        /**
         * Returns an object containing profiling data for a single function.
         * The object has an entry for min, max, avg, calls, and points).
         * @return {Object} An object containing profile data for a given function.
         * @method getReport
         * @static
         */
        getReport : function (name /*:String*/) /*:Object*/ {
            _yuitest_coverfunc("build/profiler/profiler.js", "getReport", 325);
_yuitest_coverline("build/profiler/profiler.js", 326);
return report[name];
        },
    
        /**
         * Returns an object containing profiling data for all of the functions 
         * that were profiled. The object has an entry for each function and 
         * returns all information (min, max, average, calls, etc.) for each
         * function.
         * @return {Object} An object containing all profile data.
         * @method getFullReport
         * @static
         */
        getFullReport : function (filter /*:Function*/) /*:Object*/ {
            _yuitest_coverfunc("build/profiler/profiler.js", "getFullReport", 338);
_yuitest_coverline("build/profiler/profiler.js", 339);
filter = filter || function(){_yuitest_coverfunc("build/profiler/profiler.js", "(anonymous 2)", 339);
return true;};
        
            _yuitest_coverline("build/profiler/profiler.js", 341);
if (L.isFunction(filter)) {
                _yuitest_coverline("build/profiler/profiler.js", 342);
var fullReport = {};
                
                _yuitest_coverline("build/profiler/profiler.js", 344);
for (var name in report){
                    _yuitest_coverline("build/profiler/profiler.js", 345);
if (filter(report[name])){
                        _yuitest_coverline("build/profiler/profiler.js", 346);
fullReport[name] = report[name];    
                    }
                }
                
                _yuitest_coverline("build/profiler/profiler.js", 350);
return fullReport;
            }
        },
    
        //-------------------------------------------------------------------------
        // Profiling Methods
        //-------------------------------------------------------------------------   
        
        /**
         * Sets up a constructor for profiling, including all properties and methods on the prototype.
         * @param {string} name The fully-qualified name of the function including namespace information.
         * @param {Object} owner (Optional) The object that owns the function (namespace or containing object).
         * @return {Void}
         * @method registerConstructor
         * @static
         */
        registerConstructor : function (name /*:String*/, owner /*:Object*/) /*:Void*/ {    
            _yuitest_coverfunc("build/profiler/profiler.js", "registerConstructor", 366);
_yuitest_coverline("build/profiler/profiler.js", 367);
this.registerFunction(name, owner, true);
        },
    
        /**
         * Sets up a function for profiling. It essentially overwrites the function with one
         * that has instrumentation data. This method also creates an entry for the function
         * in the profile report. The original function is stored on the container object.
         * @param {String} name The full name of the function including namespacing. This
         *      is the name of the function that is stored in the report.
         * @param {Object} owner (Optional) The object that owns the function. If the function
         *      isn't global then this argument is required. This could be the namespace that
         *      the function belongs to or the object on which it's
         *      a method.
         * @param {Boolean} registerPrototype (Optional) Indicates that the prototype should
         *      also be instrumented. Setting to true has the same effect as calling
         *      registerConstructor().
         * @return {Void}
         * @method registerFunction
         * @static
         */     
        registerFunction : function(name /*:String*/, owner /*:Object*/, registerPrototype /*:Boolean*/) /*:Void*/{
        
            //figure out the function name without namespacing
            _yuitest_coverfunc("build/profiler/profiler.js", "registerFunction", 387);
_yuitest_coverline("build/profiler/profiler.js", 390);
var funcName = (name.indexOf(".") > -1 ? 
                    name.substring(name.lastIndexOf(".")+1) : name),
                method,
                prototype;
                
            //if owner isn't an object, try to find it from the name
            _yuitest_coverline("build/profiler/profiler.js", 396);
if (!L.isObject(owner)){
                _yuitest_coverline("build/profiler/profiler.js", 397);
owner = eval(name.substring(0, name.lastIndexOf(".")));
            }
            
            //get the method and prototype
            _yuitest_coverline("build/profiler/profiler.js", 401);
method = owner[funcName];
            _yuitest_coverline("build/profiler/profiler.js", 402);
prototype = method.prototype;
            
            //see if the method has already been registered
            _yuitest_coverline("build/profiler/profiler.js", 405);
if (L.isFunction(method) && !method.__yuiProfiled){
                
                //replace the function with the profiling one
                _yuitest_coverline("build/profiler/profiler.js", 408);
owner[funcName] = this.instrument(name, method);
                        
                /*
                 * Store original function information. We store the actual
                 * function as well as the owner and the name used to identify
                 * the function so it can be restored later.
                 */
                _yuitest_coverline("build/profiler/profiler.js", 415);
container[name].__yuiOwner = owner;
                _yuitest_coverline("build/profiler/profiler.js", 416);
container[name].__yuiFuncName = funcName;  //overwrite with less-specific name
                 
                //register prototype if necessary
                _yuitest_coverline("build/profiler/profiler.js", 419);
if (registerPrototype) {            
                    _yuitest_coverline("build/profiler/profiler.js", 420);
this.registerObject(name + ".prototype", prototype);          
                }
    
            }
        
        },
            
        
        /**
         * Sets up an object for profiling. It takes the object and looks for functions.
         * When a function is found, registerMethod() is called on it. If set to recrusive
         * mode, it will also setup objects found inside of this object for profiling, 
         * using the same methodology.
         * @param {String} name The name of the object to profile (shows up in report).
         * @param {Object} owner (Optional) The object represented by the name.
         * @param {Boolean} recurse (Optional) Determines if subobject methods are also profiled.
         * @return {Void}
         * @method registerObject
         * @static
         */
        registerObject : function (name /*:String*/, object /*:Object*/, recurse /*:Boolean*/) /*:Void*/{
        
            //get the object
            _yuitest_coverfunc("build/profiler/profiler.js", "registerObject", 440);
_yuitest_coverline("build/profiler/profiler.js", 443);
object = (L.isObject(object) ? object : eval(name));
        
            //save the object
            _yuitest_coverline("build/profiler/profiler.js", 446);
container[name] = object;
        
            _yuitest_coverline("build/profiler/profiler.js", 448);
for (var prop in object) {
                _yuitest_coverline("build/profiler/profiler.js", 449);
if (typeof object[prop] == "function"){
                    _yuitest_coverline("build/profiler/profiler.js", 450);
if (prop != "constructor" && prop != "superclass"){ //don't do constructor or superclass, it's recursive
                        _yuitest_coverline("build/profiler/profiler.js", 451);
this.registerFunction(name + "." + prop, object);
                    }
                } else {_yuitest_coverline("build/profiler/profiler.js", 453);
if (typeof object[prop] == "object" && recurse){
                    _yuitest_coverline("build/profiler/profiler.js", 454);
this.registerObject(name + "." + prop, object[prop], recurse);
                }}
            }
        
        },    
        
        /**
         * Removes a constructor function from profiling. Reverses the registerConstructor() method.
         * @param {String} name The full name of the function including namespacing. This
         *      is the name of the function that is stored in the report.
         * @return {Void}
         * @method unregisterFunction
         * @static
         */     
        unregisterConstructor : function(name /*:String*/) /*:Void*/{
                
            //see if the method has been registered
            _yuitest_coverfunc("build/profiler/profiler.js", "unregisterConstructor", 468);
_yuitest_coverline("build/profiler/profiler.js", 471);
if (L.isFunction(container[name])){
                _yuitest_coverline("build/profiler/profiler.js", 472);
this.unregisterFunction(name, true);
            }    
        },
        
        /**
         * Removes function from profiling. Reverses the registerFunction() method.
         * @param {String} name The full name of the function including namespacing. This
         *      is the name of the function that is stored in the report.
         * @return {Void}
         * @method unregisterFunction
         * @static
         */     
        unregisterFunction : function(name /*:String*/, unregisterPrototype /*:Boolean*/) /*:Void*/{
                
            //see if the method has been registered
            _yuitest_coverfunc("build/profiler/profiler.js", "unregisterFunction", 484);
_yuitest_coverline("build/profiler/profiler.js", 487);
if (L.isFunction(container[name])){
            
                //check to see if you should unregister the prototype
                _yuitest_coverline("build/profiler/profiler.js", 490);
if (unregisterPrototype){
                    _yuitest_coverline("build/profiler/profiler.js", 491);
this.unregisterObject(name + ".prototype", container[name].prototype);
                }
                    
                //get original data
                _yuitest_coverline("build/profiler/profiler.js", 495);
var owner /*:Object*/ = container[name].__yuiOwner,
                    funcName /*:String*/ = container[name].__yuiFuncName;
                    
                //delete extra information
                _yuitest_coverline("build/profiler/profiler.js", 499);
delete container[name].__yuiOwner;
                _yuitest_coverline("build/profiler/profiler.js", 500);
delete container[name].__yuiFuncName;
                
                //replace instrumented function
                _yuitest_coverline("build/profiler/profiler.js", 503);
owner[funcName] = container[name];
                
                //delete supporting information
                _yuitest_coverline("build/profiler/profiler.js", 506);
delete container[name];          
            }
                
        
        },
        
        /**
         * Unregisters an object for profiling. It takes the object and looks for functions.
         * When a function is found, unregisterMethod() is called on it. If set to recrusive
         * mode, it will also unregister objects found inside of this object, 
         * using the same methodology.
         * @param {String} name The name of the object to unregister.
         * @param {Boolean} recurse (Optional) Determines if subobject methods should also be
         *      unregistered.
         * @return {Void}
         * @method unregisterObject
         * @static
         */
        unregisterObject : function (name /*:String*/, recurse /*:Boolean*/) /*:Void*/{
        
            //get the object
            _yuitest_coverfunc("build/profiler/profiler.js", "unregisterObject", 524);
_yuitest_coverline("build/profiler/profiler.js", 527);
if (L.isObject(container[name])){            
                _yuitest_coverline("build/profiler/profiler.js", 528);
var object = container[name];    
            
                _yuitest_coverline("build/profiler/profiler.js", 530);
for (var prop in object) {
                    _yuitest_coverline("build/profiler/profiler.js", 531);
if (typeof object[prop] == "function"){
                        _yuitest_coverline("build/profiler/profiler.js", 532);
this.unregisterFunction(name + "." + prop);
                    } else {_yuitest_coverline("build/profiler/profiler.js", 533);
if (typeof object[prop] == "object" && recurse){
                        _yuitest_coverline("build/profiler/profiler.js", 534);
this.unregisterObject(name + "." + prop, recurse);
                    }}
                }
                
                _yuitest_coverline("build/profiler/profiler.js", 538);
delete container[name];
            }
        
        }
             
    
    };

}, '3.7.3', {"requires": ["yui-base"]});
