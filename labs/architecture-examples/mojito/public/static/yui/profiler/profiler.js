/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add('profiler', function (Y, NAME) {

    /**
     * The YUI JavaScript profiler.
     * @module profiler
     */
     
    //-------------------------------------------------------------------------
    // Private Variables and Functions
    //-------------------------------------------------------------------------
    
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
    function createReport(name){
        report[name] = {
            calls: 0,
            max: 0,
            min: 0,
            avg: 0,
            points: []
        };
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
    function saveDataPoint(name, duration){

        //get the function data
        var functionData /*:Object*/ = report[name];
        
        //just in case clear() was called
        if (!functionData){
            functionData = createReport(name);
        }
    
        //increment the calls
        functionData.calls++;
        functionData.points.push(duration);

        //if it's already been called at least once, do more complex calculations
        if (functionData.calls > 1) {
            functionData.avg = ((functionData.avg*(functionData.calls-1))+duration)/functionData.calls;
            functionData.min = Math.min(functionData.min, duration);
            functionData.max = Math.max(functionData.max, duration);
        } else {
            functionData.avg = duration;
            functionData.min = duration;
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
            if (L.isString(name)){
                delete report[name];
                delete stopwatches[name];
            } else {
                report = {};
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
            var newMethod = function () {
    
                var start = new Date(),
                    retval = method.apply(this, arguments),
                    stop = new Date();
                
                saveDataPoint(name, stop-start);
                
                return retval;                
            
            };     

            //copy the function properties over
            Y.mix(newMethod, method);
            
            //assign prototype and flag as being profiled
            newMethod.__yuiProfiled = true;
            newMethod.prototype = method.prototype;
            
            //store original method
            container[name] = method;
            container[name].__yuiFuncName = name;
            
            //create the report
            createReport(name);

            //return the new method
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
            var now = new Date(),
                stopwatch = stopwatches[name];
                
            if (stopwatch && stopwatch.state == WATCH_STARTED){
                stopwatch.total += (now - stopwatch.start);
                stopwatch.start = 0;
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
            if(container[name]){
                throw new Error("Cannot use '" + name + "' for profiling through start(), name is already in use.");
            } else {
            
                //create report if necessary
                if (!report[name]){
                    createReport(name);
                }
                
                //create stopwatch object if necessary
                if (!stopwatches[name]){             
                    stopwatches[name] = {
                        state: WATCH_STOPPED,
                        start: 0,
                        total: 0
                    };
                }
                
                if (stopwatches[name].state == WATCH_STOPPED){
                    stopwatches[name].state = WATCH_STARTED;
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
            var now = new Date(),
                stopwatch = stopwatches[name];
                
            if (stopwatch){
                if (stopwatch.state == WATCH_STARTED){
                    saveDataPoint(name, stopwatch.total + (now - stopwatch.start));                    
                } else if (stopwatch.state == WATCH_PAUSED){
                    saveDataPoint(name, stopwatch.total);
                }
                
                //reset stopwatch information
                stopwatch.start = 0;
                stopwatch.total = 0;
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
            filter = filter || function(){return true;};
        
            if (L.isFunction(filter)) {
                var fullReport = {};
                
                for (var name in report){
                    if (filter(report[name])){
                        fullReport[name] = report[name];    
                    }
                }
                
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
            var funcName = (name.indexOf(".") > -1 ? 
                    name.substring(name.lastIndexOf(".")+1) : name),
                method,
                prototype;
                
            //if owner isn't an object, try to find it from the name
            if (!L.isObject(owner)){
                owner = eval(name.substring(0, name.lastIndexOf(".")));
            }
            
            //get the method and prototype
            method = owner[funcName];
            prototype = method.prototype;
            
            //see if the method has already been registered
            if (L.isFunction(method) && !method.__yuiProfiled){
                
                //replace the function with the profiling one
                owner[funcName] = this.instrument(name, method);
                        
                /*
                 * Store original function information. We store the actual
                 * function as well as the owner and the name used to identify
                 * the function so it can be restored later.
                 */
                container[name].__yuiOwner = owner;
                container[name].__yuiFuncName = funcName;  //overwrite with less-specific name
                 
                //register prototype if necessary
                if (registerPrototype) {            
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
            object = (L.isObject(object) ? object : eval(name));
        
            //save the object
            container[name] = object;
        
            for (var prop in object) {
                if (typeof object[prop] == "function"){
                    if (prop != "constructor" && prop != "superclass"){ //don't do constructor or superclass, it's recursive
                        this.registerFunction(name + "." + prop, object);
                    }
                } else if (typeof object[prop] == "object" && recurse){
                    this.registerObject(name + "." + prop, object[prop], recurse);
                }
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
            if (L.isFunction(container[name])){
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
            if (L.isFunction(container[name])){
            
                //check to see if you should unregister the prototype
                if (unregisterPrototype){
                    this.unregisterObject(name + ".prototype", container[name].prototype);
                }
                    
                //get original data
                var owner /*:Object*/ = container[name].__yuiOwner,
                    funcName /*:String*/ = container[name].__yuiFuncName;
                    
                //delete extra information
                delete container[name].__yuiOwner;
                delete container[name].__yuiFuncName;
                
                //replace instrumented function
                owner[funcName] = container[name];
                
                //delete supporting information
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
            if (L.isObject(container[name])){            
                var object = container[name];    
            
                for (var prop in object) {
                    if (typeof object[prop] == "function"){
                        this.unregisterFunction(name + "." + prop);
                    } else if (typeof object[prop] == "object" && recurse){
                        this.unregisterObject(name + "." + prop, recurse);
                    }
                }
                
                delete container[name];
            }
        
        }
             
    
    };

}, '3.7.3', {"requires": ["yui-base"]});
