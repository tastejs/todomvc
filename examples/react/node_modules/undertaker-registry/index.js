'use strict';

function DefaultRegistry() {
  if (this instanceof DefaultRegistry === false) {
    return new DefaultRegistry();
  }

  this._tasks = {};
}

DefaultRegistry.prototype.init = function init(taker) {};

DefaultRegistry.prototype.get = function get(name) {
  return this._tasks[name];
};

DefaultRegistry.prototype.set = function set(name, fn) {
  return this._tasks[name] = fn;
};

DefaultRegistry.prototype.tasks = function tasks() {
  var self = this;

  return Object.keys(this._tasks).reduce(function(tasks, name) {
    tasks[name] = self.get(name);
    return tasks;
  }, {});
};

module.exports = DefaultRegistry;
