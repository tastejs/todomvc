/**
 * An easing library supports jquery.js, standalone module and CSS timing functions
 *
 * using AMD (Asynchronous Module Definition) API with OzJS
 * see http://ozjs.org for details
 *
 * Copyright (C) 2010-2012, Dexter.Yy, MIT License
 * vim: et:ts=4:sw=4:sts=4
 */
define("mo/easing", [
    "./lang/mix",
    "./easing/base",
    "./easing/timing",
    "./easing/functions",
    "./easing/bezier"
], function(_, base, timing, functions, bezier){

    return _.mix(_.copy(base), timing, {
        functions: functions,
        bezier: bezier 
    });

});
