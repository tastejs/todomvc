/*istanbul ignore next*/"use strict";

exports.__esModule = true;

exports.default = function (whitelist) {
  /*istanbul ignore next*/var outputType = arguments.length <= 1 || arguments[1] === undefined ? "global" : arguments[1];

  var namespace = t.identifier("babelHelpers");

  var builder = function builder(body) {
    return buildHelpers(body, namespace, whitelist);
  };

  var tree = /*istanbul ignore next*/void 0;

  var build = {
    global: buildGlobal,
    umd: buildUmd,
    var: buildVar
  }[outputType];

  if (build) {
    tree = build(namespace, builder);
  } else {
    throw new Error(messages.get("unsupportedOutputType", outputType));
  }

  return (/*istanbul ignore next*/(0, _babelGenerator2.default)(tree).code
  );
};

var /*istanbul ignore next*/_babelHelpers = require("babel-helpers");

/*istanbul ignore next*/
var helpers = _interopRequireWildcard(_babelHelpers);

var /*istanbul ignore next*/_babelGenerator = require("babel-generator");

/*istanbul ignore next*/
var _babelGenerator2 = _interopRequireDefault(_babelGenerator);

var /*istanbul ignore next*/_babelMessages = require("babel-messages");

/*istanbul ignore next*/
var messages = _interopRequireWildcard(_babelMessages);

var /*istanbul ignore next*/_babelTemplate = require("babel-template");

/*istanbul ignore next*/
var _babelTemplate2 = _interopRequireDefault(_babelTemplate);

var /*istanbul ignore next*/_each = require("lodash/each");

/*istanbul ignore next*/
var _each2 = _interopRequireDefault(_each);

var /*istanbul ignore next*/_babelTypes = require("babel-types");

/*istanbul ignore next*/
var t = _interopRequireWildcard(_babelTypes);

/*istanbul ignore next*/
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/* eslint max-len: 0 */

var buildUmdWrapper = /*istanbul ignore next*/(0, _babelTemplate2.default)( /*istanbul ignore next*/"\n  (function (root, factory) {\n    if (typeof define === \"function\" && define.amd) {\n      define(AMD_ARGUMENTS, factory);\n    } else if (typeof exports === \"object\") {\n      factory(COMMON_ARGUMENTS);\n    } else {\n      factory(BROWSER_ARGUMENTS);\n    }\n  })(UMD_ROOT, function (FACTORY_PARAMETERS) {\n    FACTORY_BODY\n  });\n");

function buildGlobal(namespace, builder) {
  var body = [];
  var container = t.functionExpression(null, [t.identifier("global")], t.blockStatement(body));
  var tree = t.program([t.expressionStatement(t.callExpression(container, [helpers.get("selfGlobal")]))]);

  body.push(t.variableDeclaration("var", [t.variableDeclarator(namespace, t.assignmentExpression("=", t.memberExpression(t.identifier("global"), namespace), t.objectExpression([])))]));

  builder(body);

  return tree;
}

function buildUmd(namespace, builder) {
  var body = [];
  body.push(t.variableDeclaration("var", [t.variableDeclarator(namespace, t.identifier("global"))]));

  builder(body);

  return t.program([buildUmdWrapper({
    FACTORY_PARAMETERS: t.identifier("global"),
    BROWSER_ARGUMENTS: t.assignmentExpression("=", t.memberExpression(t.identifier("root"), namespace), t.objectExpression([])),
    COMMON_ARGUMENTS: t.identifier("exports"),
    AMD_ARGUMENTS: t.arrayExpression([t.stringLiteral("exports")]),
    FACTORY_BODY: body,
    UMD_ROOT: t.identifier("this")
  })]);
}

function buildVar(namespace, builder) {
  var body = [];
  body.push(t.variableDeclaration("var", [t.variableDeclarator(namespace, t.objectExpression([]))]));
  builder(body);
  body.push(t.expressionStatement(namespace));
  return t.program(body);
}

function buildHelpers(body, namespace, whitelist) {
  /*istanbul ignore next*/(0, _each2.default)(helpers.list, function (name) {
    if (whitelist && whitelist.indexOf(name) < 0) return;

    var key = t.identifier(name);
    body.push(t.expressionStatement(t.assignmentExpression("=", t.memberExpression(namespace, key), helpers.get(name))));
  });
}
/*istanbul ignore next*/module.exports = exports["default"];