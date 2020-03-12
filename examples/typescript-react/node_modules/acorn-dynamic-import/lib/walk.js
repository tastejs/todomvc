'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = inject;

var _index = require('./index');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function inject(injectableWalk) {
  return Object.assign({}, injectableWalk, {
    base: Object.assign({}, injectableWalk.base, _defineProperty({}, _index.DynamicImportKey, function () {}))
  });
}