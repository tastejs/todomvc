/*istanbul ignore next*/"use strict";

exports.__esModule = true;

var _symbol = require("babel-runtime/core-js/symbol");

var _symbol2 = _interopRequireDefault(_symbol);

var /*istanbul ignore next*/_plugin = require("../plugin");

/*istanbul ignore next*/
var _plugin2 = _interopRequireDefault(_plugin);

var /*istanbul ignore next*/_babelTypes = require("babel-types");

/*istanbul ignore next*/
var t = _interopRequireWildcard(_babelTypes);

/*istanbul ignore next*/
function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SUPER_THIS_BOUND = /*istanbul ignore next*/(0, _symbol2.default)("super this bound");

var superVisitor = { /*istanbul ignore next*/
  CallExpression: function CallExpression(path) {
    if (!path.get("callee").isSuper()) return;

    /*istanbul ignore next*/var node = path.node;

    if (node[SUPER_THIS_BOUND]) return;
    node[SUPER_THIS_BOUND] = true;

    path.replaceWith(t.assignmentExpression("=", this.id, node));
  }
};

/*istanbul ignore next*/exports.default = new /*istanbul ignore next*/_plugin2.default({
  visitor: { /*istanbul ignore next*/
    ThisExpression: function ThisExpression(path) {
      remap(path, "this");
    },
    /*istanbul ignore next*/ReferencedIdentifier: function ReferencedIdentifier(path) {
      if (path.node.name === "arguments") {
        remap(path, "arguments");
      }
    }
  }
});


function shouldShadow(path, shadowPath) {
  if (path.is("_forceShadow")) {
    return true;
  } else {
    return shadowPath;
  }
}

function remap(path, key) {
  // ensure that we're shadowed
  var shadowPath = path.inShadow(key);
  if (!shouldShadow(path, shadowPath)) return;

  var shadowFunction = path.node._shadowedFunctionLiteral;

  var currentFunction = /*istanbul ignore next*/void 0;
  var passedShadowFunction = false;

  var fnPath = path.findParent(function (path) {
    if (path.isProgram() || path.isFunction()) {
      // catch current function in case this is the shadowed one and we can ignore it
      currentFunction = currentFunction || path;
    }

    if (path.isProgram()) {
      passedShadowFunction = true;

      return true;
    } else if (path.isFunction() && !path.isArrowFunctionExpression()) {
      if (shadowFunction) {
        if (path === shadowFunction || path.node === shadowFunction.node) return true;
      } else {
        if (!path.is("shadow")) return true;
      }

      passedShadowFunction = true;
      return false;
    }

    return false;
  });

  if (shadowFunction && fnPath.isProgram() && !shadowFunction.isProgram()) {
    // If the shadow wasn't found, take the closest function as a backup.
    // This is a bit of a hack, but it will allow the parameter transforms to work properly
    // without introducing yet another shadow-controlling flag.
    fnPath = path.findParent(function (p) /*istanbul ignore next*/{
      return p.isProgram() || p.isFunction();
    });
  }

  // no point in realiasing if we're in this function
  if (fnPath === currentFunction) return;

  // If the only functions that were encountered are arrow functions, skip remapping the
  // binding since arrow function syntax already does that.
  if (!passedShadowFunction) return;

  var cached = fnPath.getData(key);
  if (cached) return path.replaceWith(cached);

  var id = path.scope.generateUidIdentifier(key);

  fnPath.setData(key, id);

  if (key === "this" && fnPath.isMethod({ kind: "constructor" })) {
    fnPath.scope.push({ id: id });

    fnPath.traverse(superVisitor, { id: id });
  } else {
    var init = key === "this" ? t.thisExpression() : t.identifier(key);

    fnPath.scope.push({ id: id, init: init });
  }

  return path.replaceWith(id);
}
/*istanbul ignore next*/module.exports = exports["default"];