/*
  backbone-modelref.js 0.1.0
  (c) 2011 Kevin Malakoff.
  Backbone-ModelRef.js is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/backbone-modelref/blob/master/LICENSE
  Dependencies: Backbone.js and Underscore.js.
*/
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
if (!this.Backbone || !this.Backbone.Model) {
  throw new Error('Backbone.ModelRef: Dependency alert! Backbone.js must be included before this file');
}
Backbone.ModelRef = (function() {
  var MODEL_EVENTS_WHEN_LOADED, MODEL_EVENTS_WHEN_UNLOADED;
  MODEL_EVENTS_WHEN_LOADED = ['reset', 'remove'];
  MODEL_EVENTS_WHEN_UNLOADED = ['reset', 'add'];
  function ModelRef(collection, model_id, cached_model) {
    var event, _i, _j, _len, _len2;
    this.collection = collection;
    this.model_id = model_id;
    this.cached_model = cached_model != null ? cached_model : null;
    _.bindAll(this, '_checkForLoad', '_checkForUnload');
    if (!this.collection) {
      throw new Error("Backbone.ModelRef: collection is missing");
    }
    if (!(this.model_id || this.cached_model)) {
      throw new Error("Backbone.ModelRef: model_id and cached_model missing");
    }
    if (this.collection.retain) {
      this.collection.retain();
    }
    this.cached_model = this.cached_model || this.collection.get(this.model_id);
    if (this.cached_model) {
      for (_i = 0, _len = MODEL_EVENTS_WHEN_LOADED.length; _i < _len; _i++) {
        event = MODEL_EVENTS_WHEN_LOADED[_i];
        this.collection.bind(event, this._checkForUnload);
      }
    } else {
      for (_j = 0, _len2 = MODEL_EVENTS_WHEN_UNLOADED.length; _j < _len2; _j++) {
        event = MODEL_EVENTS_WHEN_UNLOADED[_j];
        this.collection.bind(event, this._checkForLoad);
      }
    }
    this.ref_count = 1;
  }
  ModelRef.prototype.retain = function() {
    this.ref_count++;
    return this;
  };
  ModelRef.prototype.release = function() {
    var event, _i, _j, _len, _len2;
    if (this.ref_count <= 0) {
      throw new Error("Backbone.ModelRef.release(): ref count is corrupt");
    }
    this.ref_count--;
    if (this.ref_count > 0) {
      return;
    }
    if (this.cached_model) {
      for (_i = 0, _len = MODEL_EVENTS_WHEN_LOADED.length; _i < _len; _i++) {
        event = MODEL_EVENTS_WHEN_LOADED[_i];
        this.collection.unbind(event, this._checkForUnload);
      }
    } else {
      for (_j = 0, _len2 = MODEL_EVENTS_WHEN_UNLOADED.length; _j < _len2; _j++) {
        event = MODEL_EVENTS_WHEN_UNLOADED[_j];
        this.collection.unbind(event, this._checkForLoad);
      }
    }
    if (this.collection.release) {
      this.collection.release();
    }
    this.collection = null;
    return this;
  };
  ModelRef.prototype.get = function(attribute_name) {
    if (attribute_name !== 'id') {
      throw new Error("Backbone.ModelRef.get(): only id is permitted");
    }
    if (this.cached_model && !this.cached_model.isNew()) {
      this.model_id = this.cached_model.id;
    }
    return this.model_id;
  };
  ModelRef.prototype.getModel = function() {
    if (this.cached_model && !this.cached_model.isNew()) {
      this.model_id = this.cached_model.id;
    }
    if (this.cached_model) {
      return this.cached_model;
    }
    return this.cached_model = this.collection.get(this.model_id);
  };
  ModelRef.prototype.isLoaded = function() {
    var model;
    model = this.getModel();
    if (!model) {
      return false;
    }
    if (model.isLoaded) {
      return model.isLoaded();
    } else {
      return true;
    }
  };
  ModelRef.prototype._checkForLoad = function() {
    var event, model, _i, _j, _len, _len2;
    model = this.collection.get(this.model_id);
    if (!model) {
      return;
    }
    if (this.cached_model) {
      return;
    }
    for (_i = 0, _len = MODEL_EVENTS_WHEN_UNLOADED.length; _i < _len; _i++) {
      event = MODEL_EVENTS_WHEN_UNLOADED[_i];
      this.collection.unbind(event, this._checkForLoad);
    }
    for (_j = 0, _len2 = MODEL_EVENTS_WHEN_LOADED.length; _j < _len2; _j++) {
      event = MODEL_EVENTS_WHEN_LOADED[_j];
      this.collection.bind(event, this._checkForUnload);
    }
    this.cached_model = model;
    return this.trigger('loaded', this.cached_model);
  };
  ModelRef.prototype._checkForUnload = function() {
    var event, model, _i, _j, _len, _len2;
    model = this.collection.get(this.model_id);
    if (model) {
      return;
    }
    if (!this.cached_model) {
      return;
    }
    for (_i = 0, _len = MODEL_EVENTS_WHEN_LOADED.length; _i < _len; _i++) {
      event = MODEL_EVENTS_WHEN_LOADED[_i];
      this.collection.unbind(event, this._checkForUnload);
    }
    for (_j = 0, _len2 = MODEL_EVENTS_WHEN_UNLOADED.length; _j < _len2; _j++) {
      event = MODEL_EVENTS_WHEN_UNLOADED[_j];
      this.collection.bind(event, this._checkForLoad);
    }
    model = this.cached_model;
    this.cached_model = null;
    return this.trigger('unloaded', model);
  };
  return ModelRef;
})();
Backbone.ModelRef.VERSION = '0.1.0';
__extends(Backbone.ModelRef.prototype, Backbone.Events);