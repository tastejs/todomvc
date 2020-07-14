'use strict';

exports.__esModule = true;

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

exports.simple = simple;
exports.ancestor = ancestor;
exports.recursive = recursive;

var _babelTypes = require('babel-types');

var t = _interopRequireWildcard(_babelTypes);

var _explode = require('./explode.js');

var _explode2 = _interopRequireDefault(_explode);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function simple(node, visitors, state) {
  if (!node) return;

  visitors = (0, _explode2.default)(visitors);

  (function c(node) {
    if (!node) return;

    var _ref = visitors[node.type] || {};

    var enter = _ref.enter;
    var exit = _ref.exit;


    if (enter) {
      for (var _iterator = enter, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : (0, _getIterator3.default)(_iterator);;) {
        var _ref2;

        if (_isArray) {
          if (_i >= _iterator.length) break;
          _ref2 = _iterator[_i++];
        } else {
          _i = _iterator.next();
          if (_i.done) break;
          _ref2 = _i.value;
        }

        var visitor = _ref2;

        visitor(node, state);
      }
    }

    for (var _iterator2 = t.VISITOR_KEYS[node.type] || [], _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : (0, _getIterator3.default)(_iterator2);;) {
      var _ref3;

      if (_isArray2) {
        if (_i2 >= _iterator2.length) break;
        _ref3 = _iterator2[_i2++];
      } else {
        _i2 = _iterator2.next();
        if (_i2.done) break;
        _ref3 = _i2.value;
      }

      var key = _ref3;

      var subNode = node[key];
      if (Array.isArray(subNode)) {
        for (var _iterator4 = subNode, _isArray4 = Array.isArray(_iterator4), _i4 = 0, _iterator4 = _isArray4 ? _iterator4 : (0, _getIterator3.default)(_iterator4);;) {
          var _ref5;

          if (_isArray4) {
            if (_i4 >= _iterator4.length) break;
            _ref5 = _iterator4[_i4++];
          } else {
            _i4 = _iterator4.next();
            if (_i4.done) break;
            _ref5 = _i4.value;
          }

          var subSubNode = _ref5;

          c(subSubNode);
        }
      } else {
        c(subNode);
      }
    }

    if (exit) {
      for (var _iterator3 = exit, _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : (0, _getIterator3.default)(_iterator3);;) {
        var _ref4;

        if (_isArray3) {
          if (_i3 >= _iterator3.length) break;
          _ref4 = _iterator3[_i3++];
        } else {
          _i3 = _iterator3.next();
          if (_i3.done) break;
          _ref4 = _i3.value;
        }

        var _visitor = _ref4;

        _visitor(node, state);
      }
    }
  })(node);
}

function ancestor(node, visitors, state) {
  if (!node) return;

  visitors = (0, _explode2.default)(visitors);
  var ancestors = [];

  (function c(node) {
    if (!node) return;

    var _ref6 = visitors[node.type] || {};

    var enter = _ref6.enter;
    var exit = _ref6.exit;


    var isNew = node != ancestors[ancestors.length - 1];
    if (isNew) ancestors.push(node);

    if (enter) {
      for (var _iterator5 = enter, _isArray5 = Array.isArray(_iterator5), _i5 = 0, _iterator5 = _isArray5 ? _iterator5 : (0, _getIterator3.default)(_iterator5);;) {
        var _ref7;

        if (_isArray5) {
          if (_i5 >= _iterator5.length) break;
          _ref7 = _iterator5[_i5++];
        } else {
          _i5 = _iterator5.next();
          if (_i5.done) break;
          _ref7 = _i5.value;
        }

        var visitor = _ref7;

        visitor(node, state || ancestors, ancestors);
      }
    }

    for (var _iterator6 = t.VISITOR_KEYS[node.type] || [], _isArray6 = Array.isArray(_iterator6), _i6 = 0, _iterator6 = _isArray6 ? _iterator6 : (0, _getIterator3.default)(_iterator6);;) {
      var _ref8;

      if (_isArray6) {
        if (_i6 >= _iterator6.length) break;
        _ref8 = _iterator6[_i6++];
      } else {
        _i6 = _iterator6.next();
        if (_i6.done) break;
        _ref8 = _i6.value;
      }

      var key = _ref8;

      var subNode = node[key];
      if (Array.isArray(subNode)) {
        for (var _iterator8 = subNode, _isArray8 = Array.isArray(_iterator8), _i8 = 0, _iterator8 = _isArray8 ? _iterator8 : (0, _getIterator3.default)(_iterator8);;) {
          var _ref10;

          if (_isArray8) {
            if (_i8 >= _iterator8.length) break;
            _ref10 = _iterator8[_i8++];
          } else {
            _i8 = _iterator8.next();
            if (_i8.done) break;
            _ref10 = _i8.value;
          }

          var subSubNode = _ref10;

          c(subSubNode);
        }
      } else {
        c(subNode);
      }
    }

    if (exit) {
      for (var _iterator7 = exit, _isArray7 = Array.isArray(_iterator7), _i7 = 0, _iterator7 = _isArray7 ? _iterator7 : (0, _getIterator3.default)(_iterator7);;) {
        var _ref9;

        if (_isArray7) {
          if (_i7 >= _iterator7.length) break;
          _ref9 = _iterator7[_i7++];
        } else {
          _i7 = _iterator7.next();
          if (_i7.done) break;
          _ref9 = _i7.value;
        }

        var _visitor2 = _ref9;

        _visitor2(node, state || ancestors, ancestors);
      }
    }

    if (isNew) ancestors.pop();
  })(node);
}

function recursive(node, visitors, state) {
  if (!node) return;

  visitors = (0, _explode2.default)(visitors);

  (function c(node) {
    if (!node) return;

    var _ref11 = visitors[node.type] || {};

    var enter = _ref11.enter;


    if (enter && enter.length) {
      for (var _iterator9 = enter, _isArray9 = Array.isArray(_iterator9), _i9 = 0, _iterator9 = _isArray9 ? _iterator9 : (0, _getIterator3.default)(_iterator9);;) {
        var _ref12;

        if (_isArray9) {
          if (_i9 >= _iterator9.length) break;
          _ref12 = _iterator9[_i9++];
        } else {
          _i9 = _iterator9.next();
          if (_i9.done) break;
          _ref12 = _i9.value;
        }

        var visitor = _ref12;

        visitor(node, state, c);
      }
    } else {
      for (var _iterator10 = t.VISITOR_KEYS[node.type] || [], _isArray10 = Array.isArray(_iterator10), _i10 = 0, _iterator10 = _isArray10 ? _iterator10 : (0, _getIterator3.default)(_iterator10);;) {
        var _ref13;

        if (_isArray10) {
          if (_i10 >= _iterator10.length) break;
          _ref13 = _iterator10[_i10++];
        } else {
          _i10 = _iterator10.next();
          if (_i10.done) break;
          _ref13 = _i10.value;
        }

        var key = _ref13;

        var subNode = node[key];
        if (Array.isArray(subNode)) {
          for (var _iterator11 = subNode, _isArray11 = Array.isArray(_iterator11), _i11 = 0, _iterator11 = _isArray11 ? _iterator11 : (0, _getIterator3.default)(_iterator11);;) {
            var _ref14;

            if (_isArray11) {
              if (_i11 >= _iterator11.length) break;
              _ref14 = _iterator11[_i11++];
            } else {
              _i11 = _iterator11.next();
              if (_i11.done) break;
              _ref14 = _i11.value;
            }

            var subSubNode = _ref14;

            c(subSubNode);
          }
        } else {
          c(subNode);
        }
      }
    }
  })(node);
}