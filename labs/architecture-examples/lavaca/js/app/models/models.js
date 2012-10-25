/*
Lavaca 1.0.4
Copyright (c) 2012 Mutual Mobile

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
/**
 * @class app.models
 *  Application models cache
 */
(function(ns) {

var _modelsCache,
    _flags = {};

/** 
 * @field {String} SENSITIVE
 * @static
 * @default "sensitive"
 * The sensitive flag
 */
ns.SENSITIVE = 'sensitive';

/**
 * @method get
 * @static
 * Gets a model by name
 *
 * @param {String} name  The name under which the model is stored
 * @return {Object} The model stored under that name
 */
ns.get = function(name) {
  return _modelsCache.get(name);
};

/**
 * @method set
 * @static
 * Sets a model
 *
 * @sig
 * @param {String} name  The name under which to store the value
 * @param {Object} value  The value to store
 *
 * @sig
 * @param {String} name  The name under which to store the value
 * @param {Object} value  The value to store
 * @param {String} flag  A meta data flag to assign to the data
 */
ns.set = function(name, value, flag) {
  _modelsCache.set(name, value);
  if (flag) {
    var keys = _flags[flag];
    if (!keys) {
      keys = _flags[flag] = [];
    }
    keys.push(name);
  }
};

/**
 * @method clear
 * @static
 *
 * @sig
 * Removes all cached model data
 *
 * @sig
 * Removes all flagged cached model data
 * @param {String} flag  The meta data flag assigned to the data
 */
ns.clear = function(flag) {
  if (flag) {
    var keys = _flags[flag] || [],
        i = -1,
        key,
        item;
    while (key = keys[++i]) {
      item = _modelsCache.get(key);
      if (item && item instanceof Lavaca.utils.Disposable) {
        item.dispose();
      }
      _modelsCache.remove(key);
    }
    _flags[flag] = [];
  } else {
    ns.init();
  }
};

/**
 * @method init
 * @static
 * Readies the models cache for use
 */
ns.init = function() {
  ns.dispose();
  _modelsCache = new Lavaca.util.Cache();
};

/**
 * @method dispose
 * @static
 * Destroys the models cache
 */
ns.dispose = function() {
  if (_modelsCache) {
    _modelsCache.dispose();
    _modelsCache = null;
  }
};

})(Lavaca.resolve('app.models', true));