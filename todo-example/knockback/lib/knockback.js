/*
  knockback.js 0.11.0
  (c) 2011 Kevin Malakoff.
  Knockback.js is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
  Dependencies: Knockout.js, Backbone.js, and Underscore.js.
    Optional dependency: Backbone.ModelRef.js.
*/if (!this.ko) {
  throw new Error('Knockback: Dependency alert! Knockout.js must be included before this file');
}
if (!this.Backbone) {
  throw new Error('Knockback: Dependency alert! Backbone.js must be included before this file');
}
if (!this._ || !this._.VERSION) {
  throw new Error('Knockback: Dependency alert! Underscore.js must be included before this file');
}
this.Knockback || (this.Knockback = {});
this.kb || (this.kb = this.Knockback);
Knockback.VERSION = '0.11.0';
Knockback.locale_manager;
Knockback.wrappedObservable = function(instance) {
  if (!instance._kb_observable) {
    throw new Error('Knockback: _kb_observable missing from your instance');
  }
  return instance._kb_observable;
};
Knockback.vmRelease = function(view_model) {
  if (view_model instanceof kb.ViewModel) {
    view_model.release();
    return;
  }
  return Knockback.vmReleaseObservables(view_model);
};
Knockback.vmReleaseObservables = function(view_model, keys) {
  var key, observable, _results;
  _results = [];
  for (key in view_model) {
    observable = view_model[key];
    _results.push((function(key, observable) {
      if (keys && !_.contains(keys, key)) {
        return;
      }
      if (!observable || !(ko.isObservable(observable) || (observable instanceof kb.Observables))) {
        return;
      }
      if (observable.destroy) {
        observable.destroy();
      } else if (observable.dispose) {
        observable.dispose();
      }
      return view_model[key] = null;
    })(key, observable));
  }
  return _results;
};
Knockback.attributeConnector = function(model, key, read_only) {
  var result;
  result = ko.observable(model.get(key));
  result.subscription = result.subscribe(function(value) {
    var set_info;
    if (read_only) {
      value = model.get(key);
      if (result() === value) {
        return;
      }
      result(value);
      throw "Cannot write a value to a dependentObservable unless you specify a 'write' option. If you wish to read the current value, don't pass any parameters.";
    }
    set_info = {};
    set_info[key] = value;
    return model.set(set_info);
  });
  return result;
};
/*
  knockback_collection_observable.js
  (c) 2011 Kevin Malakoff.
  Knockback.CollectionObservable is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
*/
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
if (!this.Knockback) {
  throw new Error('Knockback: Dependency alert! knockback_core.js must be included before this file');
}
Knockback.CollectionObservable = (function() {
  function CollectionObservable(collection, vm_observable_array, options) {
    var event, _i, _j, _len, _len2, _ref, _ref2;
    this.vm_observable_array = vm_observable_array;
    this.options = options ? _.clone(options) : {};
    if (!collection) {
      throw new Error('CollectionObservable: collection is missing');
    }
    if (this.vm_observable_array || this.options.view_model) {
      if (!this.vm_observable_array) {
        throw new Error('CollectionObservable: vm_observable_array is missing');
      }
      if (!this.options) {
        throw new Error('CollectionObservable: options is missing');
      }
    }
    _.bindAll(this, 'destroy', 'collection', 'sortedIndex', 'sortAttribute', 'viewModelByModel', 'eachViewModel', 'bind', 'unbind', 'trigger');
    _.bindAll(this, '_onGetValue', '_onCollectionReset', '_onCollectionResort', '_onModelAdd', '_onModelRemove', '_onModelChanged');
    this._kb_collection = collection;
    if (this._kb_collection.retain) {
      this._kb_collection.retain();
    }
    this._kb_collection.bind('reset', this._onCollectionReset);
    if (!this.options.sorted_index) {
      this._kb_collection.bind('resort', this._onCollectionResort);
    }
    _ref = ['new', 'add'];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      event = _ref[_i];
      this._kb_collection.bind(event, this._onModelAdd);
    }
    _ref2 = ['remove', 'destroy'];
    for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
      event = _ref2[_j];
      this._kb_collection.bind(event, this._onModelRemove);
    }
    this._kb_collection.bind('change', this._onModelChanged);
    this._kb_value_observable = ko.observableArray([]);
    this._kb_observable = ko.dependentObservable(this._onGetValue);
    this._kb_observable.destroy = this.destroy;
    this._kb_observable.collection = this.collection;
    this._kb_observable.viewModelByModel = this.viewModelByModel;
    this._kb_observable.eachViewModel = this.eachViewModel;
    this._kb_observable.sortedIndex = this.sortedIndex;
    this._kb_observable.sortAttribute = this.sortAttribute;
    this._kb_observable.bind = this.bind;
    this._kb_observable.unbind = this.unbind;
    this._kb_observable.trigger = this.trigger;
    this.sortedIndex(this.options.sorted_index, this.options.sort_attribute, true);
    return kb.wrappedObservable(this);
  }
  CollectionObservable.prototype.destroy = function() {
    var event, _i, _j, _len, _len2, _ref, _ref2;
    this._clearViewModels();
    this._kb_collection.unbind('reset', this._onCollectionReset);
    if (!this.options.sorted_index) {
      this._kb_collection.unbind('resort', this._onCollectionResort);
    }
    _ref = ['new', 'add'];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      event = _ref[_i];
      this._kb_collection.unbind(event, this._onModelAdd);
    }
    _ref2 = ['remove', 'destroy'];
    for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
      event = _ref2[_j];
      this._kb_collection.unbind(event, this._onModelRemove);
    }
    this._kb_collection.unbind('change', this._onModelChanged);
    if (this._kb_collection.release) {
      this._kb_collection.release();
    }
    this._kb_collection = null;
    this._kb_value_observable = null;
    this._kb_observable.dispose();
    this._kb_observable = null;
    return this.options = null;
  };
  CollectionObservable.prototype.collection = function() {
    this._kb_value_observable();
    return this._kb_collection;
  };
  CollectionObservable.prototype.sortedIndex = function(sorted_index, sort_attribute, silent) {
    if (sorted_index) {
      this.options.sorted_index = sorted_index;
      this.options.sort_attribute = sort_attribute;
    } else if (sort_attribute) {
      this.options.sort_attribute = sort_attribute;
      this.options.sorted_index = this._sortAttributeFn(sort_attribute);
    } else {
      this.options.sort_attribute = null;
      this.options.sorted_index = null;
    }
    this._collectionResync(true);
    if (!silent) {
      this.trigger('resort', this.vm_observable_array());
    }
    return this;
  };
  CollectionObservable.prototype.sortAttribute = function(sort_attribute, sorted_index, silent) {
    return this.sortedIndex(sorted_index, sort_attribute, silent);
  };
  CollectionObservable.prototype._sortAttributeFn = function(sort_attribute) {
    return function(models, model) {
      return _.sortedIndex(models, model, function(test) {
        return test.get(sort_attribute);
      });
    };
  };
  CollectionObservable.prototype.viewModelByModel = function(model) {
    var id_attribute;
    if (!this.vm_observable_array) {
      throw new Error("CollectionObservable: cannot get a view model if vm_observable_array was not supplied");
    }
    id_attribute = model.hasOwnProperty(model.idAttribute) ? model.idAttribute : 'cid';
    return _.find(this.vm_observable_array(), function(test) {
      return test.__kb_model[id_attribute] === model[id_attribute];
    });
  };
  CollectionObservable.prototype.eachViewModel = function(iterator) {
    var view_model, _i, _len, _ref, _results;
    _ref = this.vm_observable_array();
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      view_model = _ref[_i];
      _results.push(iterator(view_model));
    }
    return _results;
  };
  CollectionObservable.prototype._onGetValue = function() {
    return this._kb_value_observable();
  };
  CollectionObservable.prototype._onCollectionReset = function() {
    return this._collectionResync();
  };
  CollectionObservable.prototype._onCollectionResort = function(model_or_models) {
    if (this.options.sorted_index) {
      throw new Error("CollectionObservable: collection sorted_index unexpected");
    }
    if (_.isArray(model_or_models)) {
      this._collectionResync(true);
      return this.trigger('resort', this.vm_observable_array());
    } else {
      return this._onModelResort(model_or_models);
    }
  };
  CollectionObservable.prototype._onModelAdd = function(model) {
    var add_index, sorted_models, view_model;
    if (this.options.sorted_index) {
      sorted_models = _.pluck(this.vm_observable_array(), '__kb_model');
      add_index = this.options.sorted_index(sorted_models, model);
    } else {
      add_index = this._kb_collection.indexOf(model);
    }
    if (this.vm_observable_array) {
      view_model = this._viewModelCreate(model);
      this.vm_observable_array.splice(add_index, 0, view_model);
    }
    this._kb_value_observable.splice(add_index, 0, model);
    if (this.vm_observable_array) {
      return this.trigger('add', view_model, this.vm_observable_array());
    }
  };
  CollectionObservable.prototype._onModelRemove = function(model) {
    var view_model;
    this._kb_value_observable.remove(model);
    if (this.vm_observable_array) {
      view_model = this.viewModelByModel(model);
      if (!view_model) {
        return;
      }
      this.vm_observable_array.remove(view_model);
      this.trigger('remove', view_model, this.vm_observable_array());
      kb.vmRelease(view_model);
      return view_model.__kb_model = null;
    }
  };
  CollectionObservable.prototype._onModelChanged = function(model) {
    if (this.options.sorted_index && (!this.options.sort_attribute || model.hasChanged(this.options.sort_attribute))) {
      this._onModelResort(model);
    }
    return this._kb_value_observable.valueHasMutated();
  };
  CollectionObservable.prototype._onModelResort = function(model) {
    var new_index, previous_index, sorted_models, view_model;
    previous_index = this._kb_value_observable.indexOf(model);
    if (this.options.sorted_index) {
      sorted_models = _.clone(this._kb_value_observable());
      sorted_models.splice(previous_index, 1);
      new_index = this.options.sorted_index(sorted_models, model);
    } else {
      new_index = this._kb_collection.indexOf(model);
    }
    if (previous_index === new_index) {
      return;
    }
    if (this.vm_observable_array) {
      view_model = this.viewModelByModel(model);
      this.vm_observable_array.splice(previous_index, 1);
      this.vm_observable_array.splice(new_index, 0, view_model);
    }
    this._kb_value_observable.splice(previous_index, 1);
    this._kb_value_observable.splice(new_index, 0, model);
    if (this.vm_observable_array) {
      return this.trigger('resort', view_model, this.vm_observable_array(), new_index);
    }
  };
  CollectionObservable.prototype._clearViewModels = function(silent) {
    var view_model, view_models, _i, _len, _results;
    if (this.vm_observable_array) {
      if (!silent) {
        this.trigger('remove', this.vm_observable_array());
      }
      view_models = this.vm_observable_array.removeAll();
      _results = [];
      for (_i = 0, _len = view_models.length; _i < _len; _i++) {
        view_model = view_models[_i];
        _results.push(kb.vmRelease(view_model));
      }
      return _results;
    }
  };
  CollectionObservable.prototype._collectionResync = function(silent) {
    var model, models, view_models, _fn, _i, _j, _len, _len2, _ref;
    this._clearViewModels(silent);
    this._kb_value_observable.removeAll();
    if (this.options.sorted_index) {
      models = [];
      _ref = this._kb_collection.models;
      _fn = __bind(function(model) {
        var add_index;
        add_index = this.options.sorted_index(models, model);
        return models.splice(add_index, 0, model);
      }, this);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        model = _ref[_i];
        _fn(model);
      }
    } else {
      models = _.clone(this._kb_collection.models);
    }
    if (this.vm_observable_array) {
      view_models = [];
      for (_j = 0, _len2 = models.length; _j < _len2; _j++) {
        model = models[_j];
        view_models.push(this._viewModelCreate(model));
      }
      this.vm_observable_array(view_models);
    }
    this._kb_value_observable(models);
    if (this.vm_observable_array) {
      if (!silent) {
        return this.trigger('add', this.vm_observable_array());
      }
    }
  };
  CollectionObservable.prototype._viewModelCreate = function(model) {
    var view_model;
    view_model = this.options.view_model ? new this.options.view_model(model) : kb.viewModel(model);
    view_model.__kb_model = model;
    return view_model;
  };
  return CollectionObservable;
})();
__extends(Knockback.CollectionObservable.prototype, Backbone.Events);
Knockback.collectionObservable = function(collection, vm_observable_array, options) {
  return new Knockback.CollectionObservable(collection, vm_observable_array, options);
};
Knockback.viewModelGetModel = Knockback.vmModel = function(view_model) {
  return view_model.__kb_model;
};
/*
  knockback_localized_observable.js
  (c) 2011 Kevin Malakoff.
  Knockback.LocalizedObservable is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
*/if (!this.Knockback) {
  throw new Error('Knockback: Dependency alert! knockback_core.js must be included before this file');
}
Knockback.LocalizedObservable = (function() {
  function LocalizedObservable(value, options, view_model) {
    this.value = value;
    this.options = options != null ? options : {};
    this.view_model = view_model;
    if (!(this.options.read || this.read)) {
      throw new Error('LocalizedObservable: options.read is missing');
    }
    if (this.options.read && this.read) {
      throw new Error('LocalizedObservable: options.read and read class function exist. You need to choose one.');
    }
    if (this.options.write && this.write) {
      throw new Error('LocalizedObservable: options.write and write class function exist. You need to choose one.');
    }
    if (!kb.locale_manager) {
      throw new Error('LocalizedObservable: Knockback.locale_manager is not defined');
    }
    _.bindAll(this, 'destroy', 'setToDefault', 'resetToCurrent', 'observedValue', '_onGetValue', '_onSetValue', '_onLocaleChange');
    this._kb_read = this.options.read ? this.options.read : this.read;
    this._kb_write = this.options.write ? this.options.write : this.write;
    this._kb_default = this.options["default"] ? this.options["default"] : this["default"];
    this._kb_value_observable = ko.observable();
    if (this._kb_write) {
      if (!this.view_model) {
        this.view_model = {};
      }
      if (!_.isFunction(this._kb_write)) {
        throw new Error('LocalizedObservable: options.write is not a function for read_write model attribute');
      }
      this._kb_observable = ko.dependentObservable({
        read: this._onGetValue,
        write: this._onSetValue,
        owner: this.view_model
      });
    } else {
      this._kb_observable = ko.dependentObservable(this._onGetValue);
    }
    this._kb_observable.destroy = this.destroy;
    this._kb_observable.observedValue = this.observedValue;
    this._kb_observable.setToDefault = this.setToDefault;
    this._kb_observable.resetToCurrent = this.resetToCurrent;
    kb.locale_manager.bind('change', this._onLocaleChange);
    this._onLocaleChange();
    return kb.wrappedObservable(this);
  }
  LocalizedObservable.prototype.destroy = function() {
    kb.locale_manager.unbind('change', this._onLocaleChange);
    this._kb_value_observable = null;
    this._kb_observable.dispose();
    this._kb_observable = null;
    this.options = {};
    return this.view_model = null;
  };
  LocalizedObservable.prototype.setToDefault = function() {
    var current_value, default_value;
    current_value = this._kb_value_observable();
    default_value = this._getDefaultValue();
    if (current_value !== default_value) {
      return this._onSetValue(default_value);
    } else {
      return this._kb_value_observable.valueHasMutated();
    }
  };
  LocalizedObservable.prototype.resetToCurrent = function() {
    this._kb_value_observable(null);
    return this._onSetValue(this._getCurrentValue());
  };
  LocalizedObservable.prototype.observedValue = function(value) {
    if (arguments.length === 0) {
      return this.value;
    }
    this.value = value;
    this._onLocaleChange();
    return this;
  };
  LocalizedObservable.prototype._getDefaultValue = function() {
    if (!this._kb_default) {
      return '';
    }
    if (_.isFunction(this._kb_default)) {
      return this._kb_default();
    } else {
      return this._kb_default;
    }
  };
  LocalizedObservable.prototype._getCurrentValue = function() {
    if (!(this.value && this._kb_observable)) {
      return this._getDefaultValue();
    }
    return this._kb_read.call(this, this.value, this._kb_observable);
  };
  LocalizedObservable.prototype._onGetValue = function() {
    return this._kb_value_observable();
  };
  LocalizedObservable.prototype._onSetValue = function(value) {
    this._kb_write.call(this, value, this.value, this._kb_observable);
    value = this._kb_read.call(this, this.value, this._kb_observable);
    this._kb_value_observable(value);
    if (this.options.onChange) {
      return this.options.onChange(value);
    }
  };
  LocalizedObservable.prototype._onLocaleChange = function() {
    var value;
    value = this._kb_read.call(this, this.value, this._kb_observable);
    this._kb_value_observable(value);
    if (this.options.onChange) {
      return this.options.onChange(value);
    }
  };
  return LocalizedObservable;
})();
Knockback.localizedObservable = function(value, options, view_model) {
  return new Knockback.LocalizedObservable(value, options, view_model);
};
/*
  knockback_observable.js
  (c) 2011 Kevin Malakoff.
  Knockback.Observable is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
*/if (!this.Knockback) {
  throw new Error('Knockback: Dependency alert! knockback_core.js must be included before this file');
}
Knockback.Observable = (function() {
  function Observable(model, options, view_model) {
    this.model = model;
    this.options = options;
    this.view_model = view_model;
    if (!this.model) {
      throw new Error('Observable: model is missing');
    }
    if (!this.options) {
      throw new Error('Observable: options is missing');
    }
    if (!this.options.key) {
      throw new Error('Observable: options.key is missing');
    }
    _.bindAll(this, 'destroy', 'setToDefault', '_onGetValue', '_onSetValue', '_onValueChange', '_onModelLoaded', '_onModelUnloaded');
    if (Backbone.ModelRef && (this.model instanceof Backbone.ModelRef)) {
      this.model_ref = this.model;
      this.model_ref.retain();
      this.model_ref.bind('loaded', this._onModelLoaded);
      this.model_ref.bind('unloaded', this._onModelUnloaded);
      this.model = this.model_ref.getModel();
    }
    this._kb_value_observable = ko.observable();
    if (this.options.localizer) {
      this._kb_localizer = new this.options.localizer(this._getCurrentValue());
    }
    if (this.options.write) {
      if (!this.view_model) {
        throw new Error('Observable: view_model is missing for read_write model attribute');
      }
      this._kb_observable = ko.dependentObservable({
        read: this._onGetValue,
        write: this._onSetValue,
        owner: this.view_model
      });
    } else {
      this._kb_observable = ko.dependentObservable(this._onGetValue);
    }
    this._kb_observable.destroy = this.destroy;
    this._kb_observable.setToDefault = this.setToDefault;
    if (!this.model_ref || this.model_ref.isLoaded()) {
      this._onModelLoaded(this.model);
    }
    return kb.wrappedObservable(this);
  }
  Observable.prototype.destroy = function() {
    this._kb_value_observable = null;
    this._kb_observable.dispose();
    this._kb_observable = null;
    if (this.model) {
      this._onModelUnloaded(this.model);
    }
    if (this.model_ref) {
      this.model_ref.unbind('loaded', this._onModelLoaded);
      this.model_ref.unbind('unloaded', this._onModelUnloaded);
      this.model_ref.release();
      this.model_ref = null;
    }
    this.options = null;
    return this.view_model = null;
  };
  Observable.prototype.setToDefault = function() {
    var value;
    value = this._getDefaultValue();
    if (this._kb_localizer) {
      this._kb_localizer.observedValue(value);
      value = this._kb_localizer();
    }
    return this._kb_value_observable(value);
  };
  Observable.prototype._getDefaultValue = function() {
    if (!this.options.hasOwnProperty('default')) {
      return '';
    }
    if (_.isFunction(this.options["default"])) {
      return this.options["default"]();
    } else {
      return this.options["default"];
    }
  };
  Observable.prototype._getCurrentValue = function() {
    if (!this.model) {
      return this._getDefaultValue();
    }
    if (this.options.read) {
      return this.options.read.apply(this.view_model, [this.model, this.options.key]);
    } else {
      return this.model.get(this.options.key);
    }
  };
  Observable.prototype._onGetValue = function() {
    var value;
    this._kb_value_observable();
    value = this._getCurrentValue();
    if (!this.model) {
      return value;
    }
    if (this._kb_localizer) {
      return this._kb_localizer();
    } else {
      return value;
    }
  };
  Observable.prototype._onSetValue = function(value) {
    var set_info;
    if (this._kb_localizer) {
      this._kb_localizer(value);
      value = this._kb_localizer.observedValue();
    }
    if (this.model) {
      set_info = {};
      set_info[this.options.key] = value;
      if (_.isFunction(this.options.write)) {
        this.options.write.apply(this.view_model, [value, this.model, set_info]);
      } else {
        this.model.set(set_info);
      }
    }
    if (this._kb_localizer) {
      return this._kb_value_observable(this._kb_localizer());
    } else {
      return this._kb_value_observable(value);
    }
  };
  Observable.prototype._onModelLoaded = function(model) {
    this.model = model;
    this.model.bind('change', this._onValueChange);
    return this._updateValue();
  };
  Observable.prototype._onModelUnloaded = function(model) {
    if (this._kb_localizer && this._kb_localizer.destroy) {
      this._kb_localizer.destroy();
      this._kb_localizer = null;
    }
    this.model.unbind('change', this._onValueChange);
    return this.model = null;
  };
  Observable.prototype._onValueChange = function() {
    if ((this.model && this.model.hasChanged) && !this.model.hasChanged(this.options.key)) {
      return;
    }
    return this._updateValue();
  };
  Observable.prototype._updateValue = function() {
    var value;
    value = this._getCurrentValue();
    if (this._kb_localizer) {
      this._kb_localizer.observedValue(value);
      value = this._kb_localizer();
    }
    return this._kb_value_observable(value);
  };
  return Observable;
})();
Knockback.observable = function(model, options, view_model) {
  return new Knockback.Observable(model, options, view_model);
};
/*
  knockback_observables.js
  (c) 2011 Kevin Malakoff.
  Knockback.Observables is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
*/
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
if (!this.Knockback) {
  throw new Error('Knockback: Dependency alert! knockback_core.js must be included before this file');
}
Knockback.Observables = (function() {
  function Observables(model, mappings_info, view_model) {
    var mapping_info, view_model_property_name, _ref;
    this.model = model;
    this.mappings_info = mappings_info;
    this.view_model = view_model;
    if (!this.model) {
      throw new Error('Observables: model is missing');
    }
    if (!this.mappings_info) {
      throw new Error('Observables: mappings_info is missing');
    }
    _ref = this.mappings_info;
    for (view_model_property_name in _ref) {
      mapping_info = _ref[view_model_property_name];
      this.view_model[view_model_property_name] = kb.observable(this.model, mapping_info, this.view_model);
    }
    return this;
  }
  Observables.prototype.destroy = function() {
    var mapping_info, view_model_property_name, _fn, _ref;
    _ref = this.mappings_info;
    _fn = __bind(function(view_model_property_name, mapping_info) {
      if (this.view_model[view_model_property_name]) {
        this.view_model[view_model_property_name].destroy();
      }
      return this.view_model[view_model_property_name] = null;
    }, this);
    for (view_model_property_name in _ref) {
      mapping_info = _ref[view_model_property_name];
      _fn(view_model_property_name, mapping_info);
    }
    this.view_model = null;
    this.mappings_info = null;
    return this.model = null;
  };
  Observables.prototype.setToDefault = function() {
    var mapping_info, view_model_property_name, _ref, _results;
    _ref = this.mappings_info;
    _results = [];
    for (view_model_property_name in _ref) {
      mapping_info = _ref[view_model_property_name];
      _results.push(this.view_model[view_model_property_name].setToDefault());
    }
    return _results;
  };
  return Observables;
})();
Knockback.observables = function(model, mappings_info, view_model) {
  return new Knockback.Observables(model, mappings_info, view_model);
};
/*
  knockback_triggered_observable.js
  (c) 2011 Kevin Malakoff.
  Knockback.Observable is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
*/if (!this.Knockback) {
  throw new Error('Knockback: Dependency alert! knockback_core.js must be included before this file');
}
Knockback.TriggeredObservable = (function() {
  function TriggeredObservable(model, event_name) {
    this.model = model;
    this.event_name = event_name;
    if (!this.model) {
      throw new Error('Observable: model is missing');
    }
    if (!this.event_name) {
      throw new Error('Observable: event_name is missing');
    }
    _.bindAll(this, 'destroy', '_onGetValue', '_onValueChange', '_onModelLoaded', '_onModelUnloaded');
    if (Backbone.ModelRef && (this.model instanceof Backbone.ModelRef)) {
      this.model_ref = this.model;
      this.model_ref.retain();
      this.model_ref.bind('loaded', this._onModelLoaded);
      this.model_ref.bind('unloaded', this._onModelUnloaded);
      this.model = this.model_ref.getModel();
    }
    this._kb_value_observable = ko.observable();
    this._kb_observable = ko.dependentObservable(this._onGetValue);
    this._kb_observable.destroy = this.destroy;
    if (!this.model_ref || this.model_ref.isLoaded()) {
      this._onModelLoaded(this.model);
    }
    return kb.wrappedObservable(this);
  }
  TriggeredObservable.prototype.destroy = function() {
    this._kb_observable.dispose();
    this._kb_observable = null;
    this._kb_value_observable = null;
    if (this.model) {
      this._onModelUnloaded(this.model);
    }
    if (this.model_ref) {
      this.model_ref.unbind('loaded', this._onModelLoaded);
      this.model_ref.unbind('unloaded', this._onModelUnloaded);
      this.model_ref.release();
      this.model_ref = null;
    }
    this.options = null;
    return this.view_model = null;
  };
  TriggeredObservable.prototype._onGetValue = function() {
    return this._kb_value_observable();
  };
  TriggeredObservable.prototype._onModelLoaded = function(model) {
    this.model = model;
    this.model.bind(this.event_name, this._onValueChange);
    return this._onValueChange();
  };
  TriggeredObservable.prototype._onModelUnloaded = function() {
    if (this._kb_localizer && this._kb_localizer.destroy) {
      this._kb_localizer.destroy();
      this._kb_localizer = null;
    }
    this.model.unbind(this.event_name, this._onValueChange);
    return this.model = null;
  };
  TriggeredObservable.prototype._onValueChange = function() {
    var current_value;
    current_value = this._kb_value_observable();
    if (current_value !== this.model) {
      return this._kb_value_observable(this.model);
    } else {
      return this._kb_value_observable.valueHasMutated();
    }
  };
  return TriggeredObservable;
})();
Knockback.triggeredObservable = function(model, event_name) {
  return new Knockback.TriggeredObservable(model, event_name);
};
/*
  knockback_view_model.js
  (c) 2011 Kevin Malakoff.
  Knockback.Observable is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
*/if (!this.Knockback) {
  throw new Error('Knockback: Dependency alert! knockback_core.js must be included before this file');
}
Knockback.ViewModel = (function() {
  function ViewModel(model, options, view_model) {
    var key;
    this.model = model;
    this.options = options != null ? options : {};
    this.view_model = view_model;
    this.ref_count = 1;
    if (!this.model) {
      throw new Error('ViewModel: model is missing');
    }
    if (Backbone.ModelRef && (this.model instanceof Backbone.ModelRef)) {
      throw new Error('ViewModel: model cannot be a Backbone.ModelRef because the atrributes may not be laoded');
    }
    _.bindAll(this, '_onModelChange');
    this.model.bind('change', this._onModelChange);
    if (!this.view_model) {
      this.view_model = this;
    }
    for (key in this.model.attributes) {
      this._updateAttributeObservor(this.model, key);
    }
  }
  ViewModel.prototype._destroy = function() {
    kb.vmReleaseObservables(this.view_model, this.view_model !== this ? _.keys(this.model.attributes) : void 0);
    this.view_model = null;
    this.model.unbind('change', this._onModelChange);
    return this.model = null;
  };
  ViewModel.prototype.retain = function() {
    if (this.ref_count <= 0) {
      throw new Error("ViewModel: ref_count is corrupt: " + this.ref_count);
    }
    this.ref_count++;
    return this;
  };
  ViewModel.prototype.release = function() {
    if (this.ref_count <= 0) {
      throw new Error("ViewModel: ref_count is corrupt: " + this.ref_count);
    }
    this.ref_count--;
    if (this.ref_count === 0) {
      this._destroy(this);
    }
    return this;
  };
  ViewModel.prototype.refCount = function() {
    return this.ref_count;
  };
  ViewModel.prototype._onModelChange = function() {
    var key, _results;
    if (!this.model._changed) {
      return;
    }
    _results = [];
    for (key in this.model.attributes) {
      _results.push((this.model.hasChanged(key) ? this._updateAttributeObservor(this.model, key) : void 0));
    }
    return _results;
  };
  ViewModel.prototype._updateAttributeObservor = function(model, key) {
    if (this.view_model.hasOwnProperty(key)) {
      return this.view_model[key](model.get(key));
    } else {
      return this.view_model[key] = kb.attributeConnector(model, key, this.options.read_only);
    }
  };
  return ViewModel;
})();
Knockback.viewModel = function(model, options, view_model) {
  return new Knockback.ViewModel(model, options, view_model);
};