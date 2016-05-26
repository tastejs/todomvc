/*istanbul ignore next*/"use strict";

exports.__esModule = true;
exports.visitor = undefined;

var _getIterator2 = require("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

var /*istanbul ignore next*/_babelTemplate = require("babel-template");

/*istanbul ignore next*/
var _babelTemplate2 = _interopRequireDefault(_babelTemplate);

var /*istanbul ignore next*/_babelTypes = require("babel-types");

/*istanbul ignore next*/
var t = _interopRequireWildcard(_babelTypes);

/*istanbul ignore next*/
function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint indent: 0 */

var buildRest = /*istanbul ignore next*/(0, _babelTemplate2.default)( /*istanbul ignore next*/"\n  for (var LEN = ARGUMENTS.length,\n           ARRAY = Array(ARRAY_LEN),\n           KEY = START;\n       KEY < LEN;\n       KEY++) {\n    ARRAY[ARRAY_KEY] = ARGUMENTS[KEY];\n  }\n");

var loadRest = /*istanbul ignore next*/(0, _babelTemplate2.default)( /*istanbul ignore next*/"\n  ARGUMENTS.length <= INDEX ? undefined : ARGUMENTS[INDEX]\n");

var memberExpressionOptimisationVisitor = { /*istanbul ignore next*/
  Scope: function Scope(path, state) {
    // check if this scope has a local binding that will shadow the rest parameter
    if (!path.scope.bindingIdentifierEquals(state.name, state.outerBinding)) {
      path.skip();
    }
  },
  /*istanbul ignore next*/Flow: function Flow(path) {
    // don't touch reference in type annotations
    path.skip();
  },


  "Function|ClassProperty": function /*istanbul ignore next*/FunctionClassProperty(path, state) {
    // Detect whether any reference to rest is contained in nested functions to
    // determine if deopt is necessary.
    var oldNoOptimise = state.noOptimise;
    state.noOptimise = true;
    path.traverse(memberExpressionOptimisationVisitor, state);
    state.noOptimise = oldNoOptimise;

    // Skip because optimizing references to rest would refer to the `arguments`
    // of the nested function.
    path.skip();
  },

  /*istanbul ignore next*/ReferencedIdentifier: function ReferencedIdentifier(path, state) {
    /*istanbul ignore next*/var node = path.node;

    // we can't guarantee the purity of arguments

    if (node.name === "arguments") {
      state.deopted = true;
    }

    // is this a referenced identifier and is it referencing the rest parameter?
    if (node.name !== state.name) return;

    if (state.noOptimise) {
      state.deopted = true;
    } else {
      /*istanbul ignore next*/var parentPath = path.parentPath;

      // ex: `args[0]`
      // ex: `args.whatever`

      if (parentPath.isMemberExpression({ object: node })) {
        var grandparentPath = parentPath.parentPath;

        var argsOptEligible = !state.deopted && !(
        // ex: `args[0] = "whatever"`
        grandparentPath.isAssignmentExpression() && parentPath.node === grandparentPath.node.left ||

        // ex: `[args[0]] = ["whatever"]`
        grandparentPath.isLVal() ||

        // ex: `for (rest[0] in this)`
        // ex: `for (rest[0] of this)`
        grandparentPath.isForXStatement() ||

        // ex: `++args[0]`
        // ex: `args[0]--`
        grandparentPath.isUpdateExpression() ||

        // ex: `delete args[0]`
        grandparentPath.isUnaryExpression({ operator: "delete" }) ||

        // ex: `args[0]()`
        // ex: `new args[0]()`
        // ex: `new args[0]`
        (grandparentPath.isCallExpression() || grandparentPath.isNewExpression()) && parentPath.node === grandparentPath.node.callee);

        if (argsOptEligible) {
          if (parentPath.node.computed) {
            // if we know that this member expression is referencing a number then
            // we can safely optimise it
            if (parentPath.get("property").isBaseType("number")) {
              state.candidates.push({ cause: "indexGetter", path: path });
              return;
            }
          }
          // args.length
          else if (parentPath.node.property.name === "length") {
              state.candidates.push({ cause: "lengthGetter", path: path });
              return;
            }
        }
      }

      // we can only do these optimizations if the rest variable would match
      // the arguments exactly
      // optimise single spread args in calls
      // ex: fn(...args)
      if (state.offset === 0 && parentPath.isSpreadElement()) {
        var call = parentPath.parentPath;
        if (call.isCallExpression() && call.node.arguments.length === 1) {
          state.candidates.push({ cause: "argSpread", path: path });
          return;
        }
      }

      state.references.push(path);
    }
  },
  /*istanbul ignore next*/

  /**
   * Deopt on use of a binding identifier with the same name as our rest param.
   *
   * See https://github.com/babel/babel/issues/2091
   */

  BindingIdentifier: function BindingIdentifier(_ref, state) {
    /*istanbul ignore next*/var node = _ref.node;

    if (node.name === state.name) {
      state.deopted = true;
    }
  }
};
function hasRest(node) {
  return t.isRestElement(node.params[node.params.length - 1]);
}

function optimiseIndexGetter(path, argsId, offset) {
  var index = /*istanbul ignore next*/void 0;

  if (t.isNumericLiteral(path.parent.property)) {
    index = t.numericLiteral(path.parent.property.value + offset);
  } else {
    index = t.binaryExpression("+", path.parent.property, t.numericLiteral(offset));
  }

  path.parentPath.replaceWith(loadRest({
    ARGUMENTS: argsId,
    INDEX: index
  }));
}

function optimiseLengthGetter(path, argsLengthExpression, argsId, offset) {
  if (offset) {
    path.parentPath.replaceWith(t.binaryExpression("-", argsLengthExpression, t.numericLiteral(offset)));
  } else {
    path.replaceWith(argsId);
  }
}

var visitor = /*istanbul ignore next*/exports.visitor = { /*istanbul ignore next*/
  Function: function Function(path) {
    /*istanbul ignore next*/var node = path.node;
    /*istanbul ignore next*/var scope = path.scope;

    if (!hasRest(node)) return;

    var rest = node.params.pop().argument;

    var argsId = t.identifier("arguments");
    var argsLengthExpression = t.memberExpression(argsId, t.identifier("length"));

    // otherwise `arguments` will be remapped in arrow functions
    argsId._shadowedFunctionLiteral = path;

    // check and optimise for extremely common cases
    var state = {
      references: [],
      offset: node.params.length,

      argumentsNode: argsId,
      outerBinding: scope.getBindingIdentifier(rest.name),

      // candidate member expressions we could optimise if there are no other references
      candidates: [],

      // local rest binding name
      name: rest.name,

      /*
      It may be possible to optimize the output code in certain ways, such as
      not generating code to initialize an array (perhaps substituting direct
      references to arguments[i] or arguments.length for reads of the
      corresponding rest parameter property) or positioning the initialization
      code so that it may not have to execute depending on runtime conditions.
       This property tracks eligibility for optimization. "deopted" means give up
      and don't perform optimization. For example, when any of rest's elements /
      properties is assigned to at the top level, or referenced at all in a
      nested function.
      */
      deopted: false
    };

    path.traverse(memberExpressionOptimisationVisitor, state);

    // There are only "shorthand" references
    if (!state.deopted && !state.references.length) {
      for ( /*istanbul ignore next*/var _iterator = state.candidates, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : (0, _getIterator3.default)(_iterator);;) {
        /*istanbul ignore next*/
        var _ref2;

        if (_isArray) {
          if (_i >= _iterator.length) break;
          _ref2 = _iterator[_i++];
        } else {
          _i = _iterator.next();
          if (_i.done) break;
          _ref2 = _i.value;
        }

        var _ref3 = _ref2;
        var _path = _ref3.path;
        /*istanbul ignore next*/var cause = _ref3.cause;

        switch (cause) {
          case "indexGetter":
            optimiseIndexGetter(_path, argsId, state.offset);
            break;
          case "lengthGetter":
            optimiseLengthGetter(_path, argsLengthExpression, argsId, state.offset);
            break;
          default:
            _path.replaceWith(argsId);
        }
      }
      return;
    }

    state.references = state.references.concat(state.candidates.map(function ( /*istanbul ignore next*/_ref4) /*istanbul ignore next*/{
      var path = _ref4.path;
      return path;
    }));

    // deopt shadowed functions as transforms like regenerator may try touch the allocation loop
    state.deopted = state.deopted || !!node.shadow;

    var start = t.numericLiteral(node.params.length);
    var key = scope.generateUidIdentifier("key");
    var len = scope.generateUidIdentifier("len");

    var arrKey = key;
    var arrLen = len;
    if (node.params.length) {
      // this method has additional params, so we need to subtract
      // the index of the current argument position from the
      // position in the array that we want to populate
      arrKey = t.binaryExpression("-", key, start);

      // we need to work out the size of the array that we're
      // going to store all the rest parameters
      //
      // we need to add a check to avoid constructing the array
      // with <0 if there are less arguments than params as it'll
      // cause an error
      arrLen = t.conditionalExpression(t.binaryExpression(">", len, start), t.binaryExpression("-", len, start), t.numericLiteral(0));
    }

    var loop = buildRest({
      ARGUMENTS: argsId,
      ARRAY_KEY: arrKey,
      ARRAY_LEN: arrLen,
      START: start,
      ARRAY: rest,
      KEY: key,
      LEN: len
    });

    if (state.deopted) {
      loop._blockHoist = node.params.length + 1;
      node.body.body.unshift(loop);
    } else {
      // perform allocation at the lowest common ancestor of all references
      loop._blockHoist = 1;

      var target = path.getEarliestCommonAncestorFrom(state.references).getStatementParent();

      // don't perform the allocation inside a loop
      target.findParent(function (path) {
        if (path.isLoop()) {
          target = path;
        } else {
          // Stop crawling up if this is a function.
          return path.isFunction();
        }
      });

      target.insertBefore(loop);
    }
  }
};