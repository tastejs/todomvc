//     (c) 2012 Rhys Brett-Bowen, Catch.com
//     goog.mvc may be freely distributed under the MIT license.
//     For all details and documentation:
//     https://github.com/rhysbrettbowen/goog.mvc
goog.provide('mvc.LocalSync');

goog.require('goog.storage.Storage');
goog.require('goog.storage.mechanism.HTML5LocalStorage');
goog.require('mvc.Sync');


/**
 * @constructor
 * @implements {mvc.Sync}
 */
mvc.LocalSync = function() {
  this.store_ = new goog.storage.Storage(
      new goog.storage.mechanism.HTML5LocalStorage());
};


/**
 * @return {string} uid for object.
 */
mvc.LocalSync.prototype.getUID = function() {
  this.counter_ = this.counter_ || 0;
  return (this.counter_++) + '|' + parseInt((new Date()).getTime(), 36);
};


/**
 * @inheritDoc
 */
mvc.LocalSync.prototype.create = function(model, opt_callback) {
  var id = this.getUID();
  model.set('id', id);
};


/**
 * @inheritDoc
 */
mvc.LocalSync.prototype.read = function(model, opt_callback) {
  model.set(/** @type {Object} */(this.store_.get(
      /** @type {string} */(model.get('id')))));
};


/**
 * @inheritDoc
 */
mvc.LocalSync.prototype.update = function(model, opt_callback) {
  this.store_.set(/** @type {string} */(model.get('id')), model.toJson());
};


/**
 * @inheritDoc
 */
mvc.LocalSync.prototype.del = function(model, opt_callback) {
  this.store_.remove(/** @type {string} */(model.get('id')));
};
