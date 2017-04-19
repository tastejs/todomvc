!function() {
  'use strict';
  function moduleFactory() {
    function getType(item) {
      return null === item ? 'null' : item instanceof Array ? 'array' : typeof item;
    }
    function getSolverFunction(val) {
      return 'function' === getType(val) ? val : SOLVERS[val];
    }
    function extend(target, source, onConflict, defaultOnConflict) {
      if (true) {
        if ('object' != typeof target) {
          throw '"target" argument must be an object';
        }
        if ('object' != typeof source) {
          throw '"source" argument must be an object';
        }
        if (arguments.length > 2 && -1 === [ 'object', 'function', 'string' ].indexOf(typeof onConflict)) {
          throw '"onConflict" argument must be an string (' + Object.keys(SOLVERS).join(', ') + '), object or function';
        }
        if (arguments.length > 3) {
          if ('object' != typeof onConflict) {
            throw 'There is no point in specifying a defaultOnConflict of onConflict is not an object';
          }
          if (-1 === [ 'function', 'string' ].indexOf(typeof defaultOnConflict)) {
            throw '"defaultOnConflict" argument must be a string (' + Object.keys(SOLVERS).join(', ') + '), or function';
          }
        }
      }
      var isOnConflictObject = 'object' === getType(onConflict);
      defaultOnConflict = getSolverFunction(isOnConflictObject ? defaultOnConflict : onConflict) || SOLVERS.crash;
      isOnConflictObject || (onConflict = {});
      var solverFunctions = {};
      TYPES.forEach(function(type) {
        solverFunctions[type] = getSolverFunction(onConflict[type]) || defaultOnConflict;
      });
      for (var prop in source) {
        if (target.hasOwnProperty(prop)) {
          solverFunctions[getType(target[prop])](target, source, prop, onConflict, defaultOnConflict);
        } else {
          target[prop] = source[prop];
        }
      }
      return target;
    }
    var TYPES = [ 'object', 'array', 'function', 'string', 'number', 'boolean', 'null', 'undefined' ];
    var SOLVERS;
    SOLVERS = {
      useTarget: function() {},
      useSource: function(target, source, prop) {
        target[prop] = source[prop];
      },
      crash: function(target, source, prop) {
        throw 'Extend target already has property ' + prop;
      },
      merge: function(target, source, prop, onConflict, defaultOnConflict) {
        var sourceProp = source[prop];
        var sourcePropType = getType(sourceProp);
        var targetProp = target[prop];
        var targetPropType = getType(targetProp);
        if (targetPropType !== sourcePropType) {
          target[prop] = source[prop];
          return;
        }
        switch (targetPropType) {
         case 'object':
          extend(targetProp, sourceProp, onConflict, defaultOnConflict);
          break;

         case 'array':
          target[prop] = targetProp.concat(sourceProp);
          break;

         case 'function':
          target[prop] = function() {
            targetProp.apply(this, arguments);
            sourceProp.apply(this, arguments);
          };
          break;

         case 'string':
         case 'number':
          target[prop] = targetProp + sourceProp;
          break;

         case 'boolean':
          target[prop] = targetProp || sourceProp;
        }
      }
    };
    return extend;
  }
  if ('function' == typeof define && define.amd) {
    define(moduleFactory);
  } else {
    if ('object' == typeof exports) {
      module.exports = moduleFactory();
    } else {
      var bff = window.bff = window.bff || {};
      bff.extend = moduleFactory();
    }
  }
}();