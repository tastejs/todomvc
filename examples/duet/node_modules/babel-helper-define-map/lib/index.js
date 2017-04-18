/*istanbul ignore next*/"use strict";

exports.__esModule = true;
exports.push = push;
/*istanbul ignore next*/exports.hasComputed = hasComputed;
/*istanbul ignore next*/exports.toComputedObjectFromClass = toComputedObjectFromClass;
/*istanbul ignore next*/exports.toClassObject = toClassObject;
/*istanbul ignore next*/exports.toDefineObject = toDefineObject;

var /*istanbul ignore next*/_babelHelperFunctionName = require("babel-helper-function-name");

/*istanbul ignore next*/
var _babelHelperFunctionName2 = _interopRequireDefault(_babelHelperFunctionName);

var /*istanbul ignore next*/_each = require("lodash/each");

/*istanbul ignore next*/
var _each2 = _interopRequireDefault(_each);

var /*istanbul ignore next*/_has = require("lodash/has");

/*istanbul ignore next*/
var _has2 = _interopRequireDefault(_has);

var /*istanbul ignore next*/_babelTypes = require("babel-types");

/*istanbul ignore next*/
var t = _interopRequireWildcard(_babelTypes);

/*istanbul ignore next*/
function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint max-len: 0 */

function toKind(node) {
  if (t.isClassMethod(node) || t.isObjectMethod(node)) {
    if (node.kind === "get" || node.kind === "set") {
      return node.kind;
    }
  }

  return "value";
}

function push(mutatorMap, node, kind, file, scope) {
  var alias = t.toKeyAlias(node);

  //

  var map = {};
  if ( /*istanbul ignore next*/(0, _has2.default)(mutatorMap, alias)) map = mutatorMap[alias];
  mutatorMap[alias] = map;

  //

  map._inherits = map._inherits || [];
  map._inherits.push(node);

  map._key = node.key;

  if (node.computed) {
    map._computed = true;
  }

  if (node.decorators) {
    var decorators = map.decorators = map.decorators || t.arrayExpression([]);
    decorators.elements = decorators.elements.concat(node.decorators.map(function (dec) /*istanbul ignore next*/{
      return dec.expression;
    }).reverse());
  }

  if (map.value || map.initializer) {
    throw file.buildCodeFrameError(node, "Key conflict with sibling node");
  }

  var key = /*istanbul ignore next*/void 0,
      value = /*istanbul ignore next*/void 0;

  // save the key so we can possibly do function name inferences
  if (t.isObjectProperty(node) || t.isObjectMethod(node) || t.isClassMethod(node)) {
    key = t.toComputedKey(node, node.key);
  }

  if (t.isObjectProperty(node) || t.isClassProperty(node)) {
    value = node.value;
  } else if (t.isObjectMethod(node) || t.isClassMethod(node)) {
    value = t.functionExpression(null, node.params, node.body, node.generator, node.async);
  }

  var inheritedKind = toKind(node);
  if (!kind || inheritedKind !== "value") {
    kind = inheritedKind;
  }

  // infer function name
  if (scope && t.isStringLiteral(key) && (kind === "value" || kind === "initializer") && t.isFunctionExpression(value)) {
    value = /*istanbul ignore next*/(0, _babelHelperFunctionName2.default)({ id: key, node: value, scope: scope });
  }

  if (value) {
    t.inheritsComments(value, node);
    map[kind] = value;
  }

  return map;
}

function hasComputed(mutatorMap) {
  for (var key in mutatorMap) {
    if (mutatorMap[key]._computed) {
      return true;
    }
  }
  return false;
}

function toComputedObjectFromClass(obj) {
  var objExpr = t.arrayExpression([]);

  for (var i = 0; i < obj.properties.length; i++) {
    var prop = obj.properties[i];
    var val = prop.value;
    val.properties.unshift(t.objectProperty(t.identifier("key"), t.toComputedKey(prop)));
    objExpr.elements.push(val);
  }

  return objExpr;
}

function toClassObject(mutatorMap) {
  var objExpr = t.objectExpression([]);

  /*istanbul ignore next*/(0, _each2.default)(mutatorMap, function (map) {
    var mapNode = t.objectExpression([]);

    var propNode = t.objectProperty(map._key, mapNode, map._computed);

    /*istanbul ignore next*/(0, _each2.default)(map, function (node, key) {
      if (key[0] === "_") return;

      var inheritNode = node;
      if (t.isClassMethod(node) || t.isClassProperty(node)) node = node.value;

      var prop = t.objectProperty(t.identifier(key), node);
      t.inheritsComments(prop, inheritNode);
      t.removeComments(inheritNode);

      mapNode.properties.push(prop);
    });

    objExpr.properties.push(propNode);
  });

  return objExpr;
}

function toDefineObject(mutatorMap) {
  /*istanbul ignore next*/(0, _each2.default)(mutatorMap, function (map) {
    if (map.value) map.writable = t.booleanLiteral(true);
    map.configurable = t.booleanLiteral(true);
    map.enumerable = t.booleanLiteral(true);
  });

  return toClassObject(mutatorMap);
}