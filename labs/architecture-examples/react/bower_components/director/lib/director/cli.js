
var util = require('util'),
    director = require('../director');

var Router = exports.Router = function (routes) {
  director.Router.call(this, routes);
  this.recurse = false;
};

//
// Inherit from `director.Router`.
//
util.inherits(Router, director.Router);

//
// ### function configure (options)
// #### @options {Object} **Optional** Options to configure this instance with
// Configures this instance with the specified `options`.
//
Router.prototype.configure = function (options) {
  options = options || {};
  director.Router.prototype.configure.call(this, options);

  //
  // Delimiter must always be `\s` in CLI routing.
  // e.g. `jitsu users create`
  //
  this.delimiter = '\\s';
  return this;
};

//
// ### function dispatch (method, path)
// #### @method {string} Method to dispatch
// #### @path {string} Path to dispatch
// Finds a set of functions on the traversal towards
// `method` and `path` in the core routing table then
// invokes them based on settings in this instance.
//
Router.prototype.dispatch = function (method, path, tty, callback) {
  //
  // Prepend a single space onto the path so that the traversal
  // algorithm will recognize it. This is because we always assume
  // that the `path` begins with `this.delimiter`.
  //
  path = ' ' + path;
  var fns = this.traverse(method, path, this.routes, '');
  if (!fns || fns.length === 0) {
    if (typeof this.notfound === 'function') {
      this.notfound.call({ tty: tty, cmd: path }, callback);
    }
    else if (callback) {
      callback(new Error('Could not find path: ' + path));
    }

    return false;
  }

  if (this.recurse === 'forward') {
    fns = fns.reverse();
  }

  this.invoke(this.runlist(fns), { tty: tty, cmd: path }, callback);
  return true;
};
