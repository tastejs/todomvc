/*! dustjs-helpers - v1.6.1
* https://github.com/linkedin/dustjs-helpers
* Copyright (c) 2015 Aleksander Williams; Released under the MIT License */
(function(root, factory) {
  if (typeof define === 'function' && define.amd && define.amd.dust === true) {
    define(['dust.core'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('dustjs-linkedin'));
  } else {
    factory(root.dust);
  }
}(this, function(dust) {

// Use dust's built-in logging when available
var _log = dust.log ? function(msg, level) {
  level = level || "INFO";
  dust.log(msg, level);
} : function() {};

var _deprecatedCache = {};
function _deprecated(target) {
  if(_deprecatedCache[target]) { return; }
  _log("Deprecation warning: " + target + " is deprecated and will be removed in a future version of dustjs-helpers", "WARN");
  _log("For help and a deprecation timeline, see https://github.com/linkedin/dustjs-helpers/wiki/Deprecated-Features#" + target.replace(/\W+/g, ""), "WARN");
  _deprecatedCache[target] = true;
}

function isSelect(context) {
  return context.stack.tail &&
         typeof context.stack.tail.head.__select__ !== "undefined";
}

function getSelectState(context) {
  return context.get('__select__');
}

function addSelectState(context, key) {
  var head = context.stack.head,
      newContext = context.rebase();

  if(context.stack && context.stack.tail) {
    newContext.stack = context.stack.tail;
  }

  return newContext
  .push({ "__select__": {
      isResolved: false,
      isDefaulted: false,
      isDeferredComplete: false,
      deferreds: [],
      key: key
    }
  })
  .push(head, context.stack.index, context.stack.of);
}

// Utility method : toString() equivalent for functions
function jsonFilter(key, value) {
  if (typeof value === "function") {
    //to make sure all environments format functions the same way
    return value.toString()
      //remove all leading and trailing whitespace
      .replace(/(^\s+|\s+$)/mg, '')
      //remove new line characters
      .replace(/\n/mg, '')
      //replace , and 0 or more spaces with ", "
      .replace(/,\s*/mg, ', ')
      //insert space between ){
      .replace(/\)\{/mg, ') {')
    ;
  }
  return value;
}

// Utility method: to invoke the given filter operation such as eq/gt etc
function filter(chunk, context, bodies, params, filterOp) {
  params = params || {};
  var body = bodies.block,
      actualKey,
      expectedValue,
      selectState,
      filterOpType = params.filterOpType || '';

  // Currently we first check for a key on the helper itself, then fall back to
  // looking for a key on the {@select} that contains it. This is undocumented
  // behavior that we may or may not support in the future. (If we stop supporting
  // it, just switch the order of the test below to check the {@select} first.)
  if (params.hasOwnProperty("key")) {
    actualKey = dust.helpers.tap(params.key, chunk, context);
  } else if (isSelect(context)) {
    selectState = getSelectState(context);
    actualKey = selectState.key;
    // Once one truth test in a select passes, short-circuit the rest of the tests
    if (selectState.isResolved) {
      filterOp = function() { return false; };
    }
  } else {
    _log("No key specified for filter in {@" + filterOpType + "}");
    return chunk;
  }
  expectedValue = dust.helpers.tap(params.value, chunk, context);
  // coerce both the actualKey and expectedValue to the same type for equality and non-equality compares
  if (filterOp(coerce(expectedValue, params.type, context), coerce(actualKey, params.type, context))) {
    if (isSelect(context)) {
      if(filterOpType === 'default') {
        selectState.isDefaulted = true;
      }
      selectState.isResolved = true;
    }
    // Helpers without bodies are valid due to the use of {@any} blocks
    if(body) {
      return chunk.render(body, context);
    } else {
      return chunk;
    }
  } else if (bodies['else']) {
    return chunk.render(bodies['else'], context);
  }
  return chunk;
}

function coerce(value, type, context) {
  if (typeof value !== "undefined") {
    switch (type || typeof value) {
      case 'number': return +value;
      case 'string': return String(value);
      case 'boolean':
        value = (value === 'false' ? false : value);
        return Boolean(value);
      case 'date': return new Date(value);
      case 'context': return context.get(value);
    }
  }

  return value;
}

var helpers = {

  // Utility helping to resolve dust references in the given chunk
  // uses the Chunk.render method to resolve value
  /*
   Reference resolution rules:
   if value exists in JSON:
    "" or '' will evaluate to false, boolean false, null, or undefined will evaluate to false,
    numeric 0 evaluates to true, so does, string "0", string "null", string "undefined" and string "false".
    Also note that empty array -> [] is evaluated to false and empty object -> {} and non-empty object are evaluated to true
    The type of the return value is string ( since we concatenate to support interpolated references

   if value does not exist in JSON and the input is a single reference: {x}
     dust render emits empty string, and we then return false

   if values does not exist in JSON and the input is interpolated references : {x} < {y}
     dust render emits <  and we return the partial output

  */
  "tap": function(input, chunk, context) {
    // return given input if there is no dust reference to resolve
    // dust compiles a string/reference such as {foo} to a function
    if (typeof input !== "function") {
      return input;
    }

    var dustBodyOutput = '',
      returnValue;

    //use chunk render to evaluate output. For simple functions result will be returned from render call,
    //for dust body functions result will be output via callback function
    returnValue = chunk.tap(function(data) {
      dustBodyOutput += data;
      return '';
    }).render(input, context);

    chunk.untap();

    //assume it's a simple function call if return result is not a chunk
    if (returnValue.constructor !== chunk.constructor) {
      //use returnValue as a result of tap
      return returnValue;
    } else if (dustBodyOutput === '') {
      return false;
    } else {
      return dustBodyOutput;
    }
  },

  "sep": function(chunk, context, bodies) {
    var body = bodies.block;
    if (context.stack.index === context.stack.of - 1) {
      return chunk;
    }
    if (body) {
      return body(chunk, context);
    } else {
      return chunk;
    }
  },

  "first": function(chunk, context, bodies) {
    if (context.stack.index === 0) {
      return bodies.block(chunk, context);
    }
    return chunk;
  },

  "last": function(chunk, context, bodies) {
    if (context.stack.index === context.stack.of - 1) {
      return bodies.block(chunk, context);
    }
    return chunk;
  },

  /**
   * contextDump helper
   * @param key specifies how much to dump.
   * "current" dumps current context. "full" dumps the full context stack.
   * @param to specifies where to write dump output.
   * Values can be "console" or "output". Default is output.
   */
  "contextDump": function(chunk, context, bodies, params) {
    var p = params || {},
      to = p.to || 'output',
      key = p.key || 'current',
      dump;
    to = dust.helpers.tap(to, chunk, context);
    key = dust.helpers.tap(key, chunk, context);
    if (key === 'full') {
      dump = JSON.stringify(context.stack, jsonFilter, 2);
    }
    else {
      dump = JSON.stringify(context.stack.head, jsonFilter, 2);
    }
    if (to === 'console') {
      _log(dump);
      return chunk;
    }
    else {
      // encode opening brackets when outputting to html
      dump = dump.replace(/</g, '\\u003c');

      return chunk.write(dump);
    }
  },
  /**
   if helper for complex evaluation complex logic expressions.
   Note : #1 if helper fails gracefully when there is no body block nor else block
          #2 Undefined values and false values in the JSON need to be handled specially with .length check
             for e.g @if cond=" '{a}'.length && '{b}'.length" is advised when there are chances of the a and b been
             undefined or false in the context
          #3 Use only when the default ? and ^ dust operators and the select fall short in addressing the given logic,
             since eval executes in the global scope
          #4 All dust references are default escaped as they are resolved, hence eval will block malicious scripts in the context
             Be mindful of evaluating a expression that is passed through the unescape filter -> |s
   @param cond, either a string literal value or a dust reference
                a string literal value, is enclosed in double quotes, e.g. cond="2>3"
                a dust reference is also enclosed in double quotes, e.g. cond="'{val}'' > 3"
    cond argument should evaluate to a valid javascript expression
   **/

  /**
   * math helper
   * @param key is the value to perform math against
   * @param method is the math method,  is a valid string supported by math helper like mod, add, subtract
   * @param operand is the second value needed for operations like mod, add, subtract, etc.
   * @param round is a flag to assure that an integer is returned
   */
  "math": function ( chunk, context, bodies, params ) {
    //key and method are required for further processing
    if( params && typeof params.key !== "undefined" && params.method ){
      var key  = params.key,
          method = params.method,
          // operand can be null for "abs", ceil and floor
          operand = params.operand,
          round = params.round,
          mathOut = null;

      key = parseFloat(dust.helpers.tap(key, chunk, context));
      operand = parseFloat(dust.helpers.tap(operand, chunk, context));
      //  TODO: handle  and tests for negatives and floats in all math operations
      switch(method) {
        case "mod":
          if(operand === 0 || operand === -0) {
            _log("Division by 0 in {@math} helper", "WARN");
          }
          mathOut = key % operand;
          break;
        case "add":
          mathOut = key + operand;
          break;
        case "subtract":
          mathOut = key - operand;
          break;
        case "multiply":
          mathOut = key * operand;
          break;
        case "divide":
          if(operand === 0 || operand === -0) {
            _log("Division by 0 in {@math} helper", "WARN");
          }
          mathOut = key / operand;
          break;
        case "ceil":
          mathOut = Math.ceil(key);
          break;
        case "floor":
          mathOut = Math.floor(key);
          break;
        case "round":
          mathOut = Math.round(key);
          break;
        case "abs":
          mathOut = Math.abs(key);
          break;
        case "toint":
          mathOut = parseInt(key, 10);
          break;
        default:
          _log("{@math}: method " + method + " not supported");
     }

      if (mathOut !== null){
        if (round) {
          mathOut = Math.round(mathOut);
        }
        if (bodies && bodies.block) {
          // with bodies act like the select helper with mathOut as the key
          // like the select helper bodies['else'] is meaningless and is ignored
          context = addSelectState(context, mathOut);
          return chunk.render(bodies.block, context);
        } else {
          // self closing math helper will return the calculated output
          return chunk.write(mathOut);
        }
       } else {
        return chunk;
      }
    }
    // no key parameter and no method
    else {
      _log("Key is a required parameter for math helper along with method/operand!");
    }
    return chunk;
  },
   /**
   select helper works with one of the eq/ne/gt/gte/lt/lte/default providing the functionality
   of branching conditions
   @param key,  ( required ) either a string literal value or a dust reference
                a string literal value, is enclosed in double quotes, e.g. key="foo"
                a dust reference may or may not be enclosed in double quotes, e.g. key="{val}" and key=val are both valid
   @param type (optional), supported types are  number, boolean, string, date, context, defaults to string
   **/
  "select": function(chunk, context, bodies, params) {
    var body = bodies.block,
        state, key, len, x;

    if (params.hasOwnProperty("key")) {
      key = dust.helpers.tap(params.key, chunk, context);
      // bodies['else'] is meaningless and is ignored
      if (body) {
        context = addSelectState(context, key);
        state = getSelectState(context);
        chunk = chunk.render(body, context);
        // Resolve any deferred blocks (currently just {@any} blocks)
        if(state.deferreds.length) {
          state.isDeferredComplete = true;
          for(x=0, len=state.deferreds.length; x<len; x++) {
            state.deferreds[x]();
          }
        }
      } else {
        _log("Missing body block in {@select}");
      }
    } else {
      _log("No key provided for {@select}", "WARN");
    }
    return chunk;
  },

  /**
   eq helper compares the given key is same as the expected value
   It can be used standalone or in conjunction with select for multiple branching
   @param key,  The actual key to be compared ( optional when helper used in conjunction with select)
                either a string literal value or a dust reference
                a string literal value, is enclosed in double quotes, e.g. key="foo"
                a dust reference may or may not be enclosed in double quotes, e.g. key="{val}" and key=val are both valid
   @param value, The expected value to compare to, when helper is used standalone or in conjunction with select
   @param type (optional), supported types are  number, boolean, string, date, context, defaults to string
   Note : use type="number" when comparing numeric
   **/
  "eq": function(chunk, context, bodies, params) {
    params.filterOpType = "eq";
    return filter(chunk, context, bodies, params, function(expected, actual) { return actual === expected; });
  },

  /**
   ne helper compares the given key is not the same as the expected value
   It can be used standalone or in conjunction with select for multiple branching
   @param key,  The actual key to be compared ( optional when helper used in conjunction with select)
                either a string literal value or a dust reference
                a string literal value, is enclosed in double quotes, e.g. key="foo"
                a dust reference may or may not be enclosed in double quotes, e.g. key="{val}" and key=val are both valid
   @param value, The expected value to compare to, when helper is used standalone or in conjunction with select
   @param type (optional), supported types are  number, boolean, string, date, context, defaults to string
   Note : use type="number" when comparing numeric
   **/
  "ne": function(chunk, context, bodies, params) {
    params.filterOpType = "ne";
    return filter(chunk, context, bodies, params, function(expected, actual) { return actual !== expected; });
  },

  /**
   lt helper compares the given key is less than the expected value
   It can be used standalone or in conjunction with select for multiple branching
   @param key,  The actual key to be compared ( optional when helper used in conjunction with select)
                either a string literal value or a dust reference
                a string literal value, is enclosed in double quotes, e.g. key="foo"
                a dust reference may or may not be enclosed in double quotes, e.g. key="{val}" and key=val are both valid
   @param value, The expected value to compare to, when helper is used standalone  or in conjunction with select
   @param type (optional), supported types are  number, boolean, string, date, context, defaults to string
   Note : use type="number" when comparing numeric
   **/
  "lt": function(chunk, context, bodies, params) {
    params.filterOpType = "lt";
    return filter(chunk, context, bodies, params, function(expected, actual) { return actual < expected; });
  },

  /**
   lte helper compares the given key is less or equal to the expected value
   It can be used standalone or in conjunction with select for multiple branching
   @param key,  The actual key to be compared ( optional when helper used in conjunction with select)
                either a string literal value or a dust reference
                a string literal value, is enclosed in double quotes, e.g. key="foo"
                a dust reference may or may not be enclosed in double quotes, e.g. key="{val}" and key=val are both valid
   @param value, The expected value to compare to, when helper is used standalone or in conjunction with select
   @param type (optional), supported types are  number, boolean, string, date, context, defaults to string
   Note : use type="number" when comparing numeric
  **/
  "lte": function(chunk, context, bodies, params) {
    params.filterOpType = "lte";
    return filter(chunk, context, bodies, params, function(expected, actual) { return actual <= expected; });
  },

  /**
   gt helper compares the given key is greater than the expected value
   It can be used standalone or in conjunction with select for multiple branching
   @param key,  The actual key to be compared ( optional when helper used in conjunction with select)
                either a string literal value or a dust reference
                a string literal value, is enclosed in double quotes, e.g. key="foo"
                a dust reference may or may not be enclosed in double quotes, e.g. key="{val}" and key=val are both valid
   @param value, The expected value to compare to, when helper is used standalone  or in conjunction with select
   @param type (optional), supported types are  number, boolean, string, date, context, defaults to string
   Note : use type="number" when comparing numeric
   **/
  "gt": function(chunk, context, bodies, params) {
    params.filterOpType = "gt";
    return filter(chunk, context, bodies, params, function(expected, actual) { return actual > expected; });
  },

 /**
   gte helper, compares the given key is greater than or equal to the expected value
   It can be used standalone or in conjunction with select for multiple branching
   @param key,  The actual key to be compared ( optional when helper used in conjunction with select)
                either a string literal value or a dust reference
                a string literal value, is enclosed in double quotes, e.g. key="foo"
                a dust reference may or may not be enclosed in double quotes, e.g. key="{val}" and key=val are both valid
   @param value, The expected value to compare to, when helper is used standalone or in conjunction with select
   @param type (optional), supported types are  number, boolean, string, date, context, defaults to string
   Note : use type="number" when comparing numeric
  **/
  "gte": function(chunk, context, bodies, params) {
    params.filterOpType = "gte";
    return filter(chunk, context, bodies, params, function(expected, actual) { return actual >= expected; });
  },

  /**
   * {@any}
   * Outputs as long as at least one truth test inside a {@select} has passed.
   * Must be contained inside a {@select} block.
   * The passing truth test can be before or after the {@any} block.
   */
  "any": function(chunk, context, bodies, params) {
    var selectState;

    if(!isSelect(context)) {
      _log("{@any} used outside of a {@select} block", "WARN");
    } else {
      selectState = getSelectState(context);
      if(selectState.isDeferredComplete) {
        _log("{@any} nested inside {@any} or {@none} block. It needs its own {@select} block", "WARN");
      } else {
        chunk = chunk.map(function(chunk) {
          selectState.deferreds.push(function() {
            if(selectState.isResolved && !selectState.isDefaulted) {
              chunk = chunk.render(bodies.block, context);
            }
            chunk.end();
          });
        });
      }
    }
    return chunk;
  },

  /**
   * {@none}
   * Outputs if no truth tests inside a {@select} pass.
   * Must be contained inside a {@select} block.
   * The position of the helper does not matter.
   */
  "none": function(chunk, context, bodies, params) {
    var selectState;

    if(!isSelect(context)) {
      _log("{@none} used outside of a {@select} block", "WARN");
    } else {
      selectState = getSelectState(context);
      if(selectState.isDeferredComplete) {
        _log("{@none} nested inside {@any} or {@none} block. It needs its own {@select} block", "WARN");
      } else {
        chunk = chunk.map(function(chunk) {
          selectState.deferreds.push(function() {
            if(!selectState.isResolved) {
              chunk = chunk.render(bodies.block, context);
            }
            chunk.end();
          });
        });
      }
    }
    return chunk;
  },

  /**
   * {@default}
   * Outputs if no truth test inside a {@select} has passed.
   * Must be contained inside a {@select} block.
   */
  "default": function(chunk, context, bodies, params) {
    params.filterOpType = "default";
    // Deprecated for removal in 1.7
    _deprecated("{@default}");
    if(!isSelect(context)) {
      _log("{@default} used outside of a {@select} block", "WARN");
      return chunk;
    }
    return filter(chunk, context, bodies, params, function() { return true; });
  },

  /**
  * size helper prints the size of the given key
  * Note : size helper is self closing and does not support bodies
  * @param key, the element whose size is returned
  */
  "size": function( chunk, context, bodies, params ) {
    var key, value=0, nr, k;
    params = params || {};
    key = params.key;
    if (!key || key === true) { //undefined, null, "", 0
      value = 0;
    }
    else if(dust.isArray(key)) { //array
      value = key.length;
    }
    else if (!isNaN(parseFloat(key)) && isFinite(key)) { //numeric values
      value = key;
    }
    else if (typeof key  === "object") { //object test
      //objects, null and array all have typeof ojbect...
      //null and array are already tested so typeof is sufficient http://jsperf.com/isobject-tests
      nr = 0;
      for(k in key){
        if(Object.hasOwnProperty.call(key,k)){
          nr++;
        }
      }
      value = nr;
    } else {
      value = (key + '').length; //any other value (strings etc.)
    }
    return chunk.write(value);
  }


};

  for(var key in helpers) {
    dust.helpers[key] = helpers[key];
  }

  return dust;

}));
