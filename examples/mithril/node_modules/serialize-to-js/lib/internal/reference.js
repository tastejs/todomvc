/*
 * @copyright 2015- commenthol
 * @license MIT
 */
'use strict';

var utils = require('./utils');

var KEY = /^[a-zA-Z$_][a-zA-Z$_0-9]*$/;
/**
 * handle references
 * @constructor
 * @param {Object} references
 * @param {boolean} opts.unsafe
 */

function Ref(references, opts) {
  this.keys = [];
  this.refs = [];
  this.key = [];
  this.references = references || [];
  this._opts = opts || {};
}
/**
 * wrap an object key
 * @api private
 * @param {String} key - objects key
 * @return {String} wrapped key in quotes if necessary
 */


Ref.wrapkey = function (key, opts) {
  return KEY.test(key) ? key : utils.quote(key, opts);
};

Ref.prototype = {
  /**
   * push `key` to interal array
   * @param {String} key
   */
  push: function push(key) {
    this.key.push(key);
  },

  /**
   * remove the last key from internal array
   */
  pop: function pop() {
    this.key.pop();
  },

  /**
   * join the keys
   */
  join: function join(key) {
    var _this = this;

    var out = '';
    key = key || this.key;

    if (typeof key === 'string') {
      key = [key];
    }

    key.forEach(function (k) {
      if (KEY.test(k)) {
        out += '.' + k;
      } else {
        out += '[' + Ref.wrapkey(k, _this._opts) + ']';
      }
    });
    return out;
  },

  /**
   * check if object `source` has an already known reference.
   * If so then origin and source are stored in `opts.reference`
   * @param {Object} source - object to compare
   * @return {Boolean}
   */
  hasReference: function hasReference(source) {
    var idx;

    if (~(idx = this.refs.indexOf(source))) {
      this.references.push([this.join(), this.keys[idx]]);
      return true;
    } else {
      this.refs.push(source);
      this.keys.push(this.join());
    }
  },

  /**
   * get the references array
   * @return {Array} references array
   */
  getReferences: function getReferences() {
    return this.references;
  }
};
module.exports = Ref;