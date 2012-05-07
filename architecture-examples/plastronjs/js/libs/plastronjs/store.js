//     (c) 2012 Rhys Brett-Bowen, Catch.com
//     goog.mvc may be freely distributed under the MIT license.
//     For all details and documentation:
//     https://github.com/rhysbrettbowen/goog.mvc

goog.provide('mvc.Store');

goog.require('goog.events');
goog.require('goog.object');
goog.require('mvc.Model');



/**
 * @constructor
 * @param {function(new:mvc.Model)=} opt_defaultModel type to return if
 * a model is not found in get.
 */
mvc.Store = function(opt_defaultModel) {
  this.cache_ = {};
  this.default_ = opt_defaultModel || mvc.Model;
};


/**
 * takes two arguments. The model's id (or leave out to create a new model)
 * and the type of model to create if none found in cache
 *
 * @param {string=} opt_input the model's id.
 * @param {function(new:mvc.Model)=} opt_model type of model to create.
 * @return {mvc.Model} model from the store or new model.
 */
mvc.Store.prototype.get = function(opt_input, opt_model) {
  if (this.cache_[opt_input])
    return this.cache_[opt_input];
  var modelConstructor = opt_model || this.default_;
  var model = new modelConstructor();
  if (opt_input)
    model.set('id', opt_input, true);
  this.cache_[opt_input || model.cid_] = model;
  var list = goog.events.listen(model, goog.events.EventType.CHANGE,
      function() {
        var id = model.get('id');
        if (id) {
          this.cache_[id] = model;
          delete this.cache_[model.cid_];
          goog.events.unlistenByKey(list);
        }
      }, false, this);
  return model;
};


/**
 * this is used to setup the store from cache
 *
 * @param {mvc.Model|Array.<mvc.Model>} models to set in store.
 */
mvc.Store.prototype.set = function(models) {
  if (!goog.isArrayLike(models)) {
    models = [models];
  }
  goog.array.forEach(/** @type {Array} */(models), function(model) {
    this.cache_[model.get('id') || model.getCid()] = model;
  }, this);
};

