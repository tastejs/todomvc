/*istanbul ignore next*/"use strict";

exports.__esModule = true;

exports.default = function (path) {
  /*istanbul ignore next*/var scope = arguments.length <= 1 || arguments[1] === undefined ? path.scope : arguments[1];
  /*istanbul ignore next*/var node = path.node;

  var container = t.functionExpression(null, [], node.body, node.generator, node.async);

  var callee = container;
  var args = [];

  // todo: only hoist if necessary
  /*istanbul ignore next*/(0, _babelHelperHoistVariables2.default)(path, function (id) /*istanbul ignore next*/{
    return scope.push({ id: id });
  });

  var state = {
    foundThis: false,
    foundArguments: false
  };

  path.traverse(visitor, state);

  if (state.foundArguments) {
    callee = t.memberExpression(container, t.identifier("apply"));
    args = [];

    if (state.foundThis) {
      args.push(t.thisExpression());
    }

    if (state.foundArguments) {
      if (!state.foundThis) args.push(t.nullLiteral());
      args.push(t.identifier("arguments"));
    }
  }

  var call = t.callExpression(callee, args);
  if (node.generator) call = t.yieldExpression(call, true);

  return t.returnStatement(call);
};

var /*istanbul ignore next*/_babelHelperHoistVariables = require("babel-helper-hoist-variables");

/*istanbul ignore next*/
var _babelHelperHoistVariables2 = _interopRequireDefault(_babelHelperHoistVariables);

var /*istanbul ignore next*/_babelTypes = require("babel-types");

/*istanbul ignore next*/
var t = _interopRequireWildcard(_babelTypes);

/*istanbul ignore next*/
function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var visitor = { /*istanbul ignore next*/
  enter: function enter(path, state) {
    if (path.isThisExpression()) {
      state.foundThis = true;
    }

    if (path.isReferencedIdentifier({ name: "arguments" })) {
      state.foundArguments = true;
    }
  },
  /*istanbul ignore next*/Function: function Function(path) {
    path.skip();
  }
};

/*istanbul ignore next*/module.exports = exports["default"];