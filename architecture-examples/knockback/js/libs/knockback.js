/*
  knockback.js 0.14.0
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
Knockback.VERSION = '0.14.0';
Knockback.locale_manager;
Knockback.wrappedObservable = function(instance) {
  if (!instance._kb_observable) {
    throw new Error('Knockback: _kb_observable missing from your instance');
  }
  return instance._kb_observable;
};
Knockback.setToDefault = function(observable) {
  if (observable && observable.setToDefault) {
    return observable.setToDefault();
  }
};
Knockback.vmSetToDefault = function(view_model) {
  var key, observable, _results;
  _results = [];
  for (key in view_model) {
    observable = view_model[key];
    _results.push(kb.setToDefault(observable));
  }
  return _results;
};
Knockback.vmRelease = function(view_model) {
  if (view_model instanceof kb.ViewModel_RCBase) {
    view_model.release();
    return;
  }
  return Knockback.vmReleaseObservables(view_model);
};
Knockback.vmReleaseObservables = function(view_model, keys) {
  var key, value, _results;
  _results = [];
  for (key in view_model) {
    value = view_model[key];
    if (!value) {
      continue;
    }
    if (!(ko.isObservable(value) || (value instanceof kb.Observables) || (value instanceof kb.ViewModel_RCBase))) {
      continue;
    }
    if (keys && !_.contains(keys, key)) {
      continue;
    }
    view_model[key] = null;
    _results.push(kb.vmReleaseObservable(value));
  }
  return _results;
};
Knockback.vmReleaseObservable = function(observable) {
  if (!(ko.isObservable(observable) || (observable instanceof kb.Observables) || (observable instanceof kb.ViewModel_RCBase))) {
    return;
  }
  if (observable.destroy) {
    return observable.destroy();
  } else if (observable.dispose) {
    return observable.dispose();
  } else if (observable.release) {
    return observable.release();
  }
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
    var defer, event, _i, _j, _len, _len2, _ref, _ref2;
    this.vm_observable_array = vm_observable_array;
    if (options == null) {
      options = {};
    }
    if (!collection) {
      throw new Error('CollectionObservable: collection is missing');
    }
    if (options.hasOwnProperty('view_model')) {
      options.view_model_constructor = options['view_model'];
      delete options['view_model'];
    }
    if (this.vm_observable_array || options.view_model_create || options.view_model_constructor) {
      if (!this.vm_observable_array) {
        throw new Error('CollectionObservable: vm_observable_array is missing');
      }
    }
    if (options.hasOwnProperty('defer')) {
      defer = options.defer;
      delete options['defer'];
    }
    this.options = _.clone(options);
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
    this.sortedIndex(this.options.sorted_index, this.options.sort_attribute, {
      silent: true,
      defer: defer
    });
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
  CollectionObservable.prototype.sortedIndex = function(sorted_index, sort_attribute, options) {
    var _resync;
    if (options == null) {
      options = {};
    }
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
    _resync = __bind(function() {
      if ((this._kb_collection.models.length === 0) && (this._kb_value_observable().length === 0)) {
        return;
      }
      this._collectionResync(true);
      if (!options.silent) {
        return this.trigger('resort', this.vm_observable_array());
      }
    }, this);
    if (options.defer) {
      _.defer(_resync);
    } else {
      _resync();
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
    var add_index, model, models, view_models, _i, _j, _len, _len2, _ref;
    this._clearViewModels(silent);
    this._kb_value_observable.removeAll();
    if (this.options.sorted_index) {
      models = [];
      _ref = this._kb_collection.models;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        model = _ref[_i];
        add_index = this.options.sorted_index(models, model);
        models.splice(add_index, 0, model);
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
    if (this.options.view_model_create) {
      view_model = this.options.view_model_create(model);
    } else if (this.options.view_model_constructor) {
      view_model = new this.options.view_model_constructor(model);
    } else {
      view_model = kb.viewModel(model);
    }
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
Knockback.sortedIndexWrapAttr = Knockback.siwa = function(attribute_name, wrapper_constructor) {
  return function(models, model) {
    return _.sortedIndex(models, model, function(test) {
      return new wrapper_constructor(test.get(attribute_name));
    });
  };
};
/*
  knockback_default_wrapper.js
  (c) 2011 Kevin Malakoff.
  Knockback.DefaultWrapper is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
*/
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
if (!this.Knockback) {
  throw new Error('Knockback: Dependency alert! knockback_core.js must be included before this file');
}
Knockback.DefaultWrapper = (function() {
  function DefaultWrapper(observable, default_value) {
    this.default_value = default_value;
    _.bindAll(this, 'destroy', 'setToDefault');
    this._kb_observable = ko.dependentObservable({
      read: __bind(function() {
        var value;
        value = ko.utils.unwrapObservable(observable());
        if (!value) {
          return ko.utils.unwrapObservable(this.default_value);
        } else {
          return value;
        }
      }, this),
      write: function(value) {
        return observable(value);
      },
      owner: {}
    });
    this._kb_observable.destroy = this.destroy;
    this._kb_observable.setToDefault = this.setToDefault;
    return kb.wrappedObservable(this);
  }
  DefaultWrapper.prototype.destroy = function() {
    this._kb_observable = null;
    return this.default_value = null;
  };
  DefaultWrapper.prototype.setToDefault = function() {
    return this._kb_observable(this.default_value);
  };
  return DefaultWrapper;
})();
Knockback.defaultWrapper = function(observable, default_value) {
  return new Knockback.DefaultWrapper(observable, default_value);
};
/*
  knockback_formatted_observable.js
  (c) 2011 Kevin Malakoff.
  Knockback.FormattedObservable is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
*/if (!this.Knockback) {
  throw new Error('Knockback: Dependency alert! knockback_core.js must be included before this file');
}
Knockback.toFormattedString = function(format) {
  var arg, args, index, parameter_index, result, value;
  result = format.slice();
  args = Array.prototype.slice.call(arguments, 1);
  for (index in args) {
    arg = args[index];
    value = ko.utils.unwrapObservable(arg);
    if (!value) {
      value = '';
    }
    parameter_index = format.indexOf("\{" + index + "\}");
    while (parameter_index >= 0) {
      result = result.replace("{" + index + "}", value);
      parameter_index = format.indexOf("\{" + index + "\}", parameter_index + 1);
    }
  }
  return result;
};
Knockback.parseFormattedString = function(string, format) {
  var count, format_indices_to_matched_indices, index, match_index, matches, parameter_count, parameter_index, positions, regex, regex_string, results, sorted_positions, _i, _results;
  regex_string = format.slice();
  index = 0;
  parameter_count = 0;
  positions = {};
  while (regex_string.search("\\{" + index + "\\}") >= 0) {
    parameter_index = format.indexOf("\{" + index + "\}");
    while (parameter_index >= 0) {
      regex_string = regex_string.replace("\{" + index + "\}", '(.*)');
      positions[parameter_index] = index;
      parameter_count++;
      parameter_index = format.indexOf("\{" + index + "\}", parameter_index + 1);
    }
    index++;
  }
  count = index;
  regex = new RegExp(regex_string);
  matches = regex.exec(string);
  if (matches) {
    matches.shift();
  }
  if (!matches || (matches.length !== parameter_count)) {
    return _.map((function() {
      _results = [];
      for (var _i = 1; 1 <= count ? _i <= count : _i >= count; 1 <= count ? _i++ : _i--){ _results.push(_i); }
      return _results;
    }).apply(this), function() {
      return '';
    });
  }
  sorted_positions = _.sortBy(_.keys(positions), function(parameter_index, format_index) {
    return parseInt(parameter_index, 10);
  });
  format_indices_to_matched_indices = {};
  for (match_index in sorted_positions) {
    parameter_index = sorted_positions[match_index];
    index = positions[parameter_index];
    if (format_indices_to_matched_indices.hasOwnProperty(index)) {
      continue;
    }
    format_indices_to_matched_indices[index] = match_index;
  }
  results = [];
  index = 0;
  while (index < count) {
    results.push(matches[format_indices_to_matched_indices[index]]);
    index++;
  }
  return results;
};
Knockback.formattedObservable = function(format, args) {
  var observable_args, result;
  observable_args = Array.prototype.slice.call(arguments, 1);
  result = ko.dependentObservable({
    read: function() {
      var arg, _i, _len;
      args = [ko.utils.unwrapObservable(format)];
      for (_i = 0, _len = observable_args.length; _i < _len; _i++) {
        arg = observable_args[_i];
        args.push(ko.utils.unwrapObservable(arg));
      }
      return kb.toFormattedString.apply(null, args);
    },
    write: function(value) {
      var index, matches, max_count, _results;
      matches = kb.parseFormattedString(value, ko.utils.unwrapObservable(format));
      max_count = Math.min(observable_args.length, matches.length);
      index = 0;
      _results = [];
      while (index < max_count) {
        observable_args[index](matches[index]);
        _results.push(index++);
      }
      return _results;
    },
    owner: {}
  });
  return result;
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
    if (this.value) {
      value = ko.utils.unwrapObservable(this.value);
    }
    this._kb_value_observable = ko.observable(!value ? this._getDefaultValue() : this._kb_read.call(this, value, null));
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
    if (!this._kb_default) {
      return;
    }
    default_value = this._getDefaultValue();
    current_value = this._kb_value_observable();
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
    return this._kb_read.call(this, ko.utils.unwrapObservable(this.value), this._kb_observable);
  };
  LocalizedObservable.prototype._onGetValue = function() {
    if (this.value) {
      ko.utils.unwrapObservable(this.value);
    }
    return this._kb_value_observable();
  };
  LocalizedObservable.prototype._onSetValue = function(value) {
    this._kb_write.call(this, value, ko.utils.unwrapObservable(this.value), this._kb_observable);
    value = this._kb_read.call(this, ko.utils.unwrapObservable(this.value), this._kb_observable);
    this._kb_value_observable(value);
    if (this.options.onChange) {
      return this.options.onChange(value);
    }
  };
  LocalizedObservable.prototype._onLocaleChange = function() {
    var value;
    value = this._kb_read.call(this, ko.utils.unwrapObservable(this.value), this._kb_observable);
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
    if (_.isString(this.options) || ko.isObservable(this.options)) {
      this.options = {
        key: this.options
      };
    }
    if (!this.options.key) {
      throw new Error('Observable: options.key is missing');
    }
    _.bindAll(this, 'destroy', 'setToDefault', '_onGetValue', '_onSetValue', '_onModelChange', '_onModelLoaded', '_onModelUnloaded');
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
      this.model.bind('change', this._onModelChange);
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
    var arg, args, key, _i, _len, _ref;
    if (!this.model) {
      return this._getDefaultValue();
    }
    key = ko.utils.unwrapObservable(this.options.key);
    args = [key];
    if (!_.isUndefined(this.options.args)) {
      if (_.isArray(this.options.args)) {
        _ref = this.options.args;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          arg = _ref[_i];
          args.push(ko.utils.unwrapObservable(arg));
        }
      } else {
        args.push(ko.utils.unwrapObservable(this.options.args));
      }
    }
    if (this.options.read) {
      return this.options.read.apply(this.view_model, args);
    } else {
      return this.model.get.apply(this.model, args);
    }
  };
  Observable.prototype._onGetValue = function() {
    var arg, value, _i, _len, _ref;
    this._kb_value_observable();
    ko.utils.unwrapObservable(this.options.key);
    if (!_.isUndefined(this.options.args)) {
      if (_.isArray(this.options.args)) {
        _ref = this.options.args;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          arg = _ref[_i];
          ko.utils.unwrapObservable(arg);
        }
      } else {
        ko.utils.unwrapObservable(this.options.args);
      }
    }
    value = this._getCurrentValue();
    if (this._kb_localizer) {
      this._kb_localizer.observedValue(value);
      value = this._kb_localizer();
    }
    return value;
  };
  Observable.prototype._onSetValue = function(value) {
    var arg, args, set_info, _i, _len, _ref;
    if (this._kb_localizer) {
      this._kb_localizer(value);
      value = this._kb_localizer.observedValue();
    }
    if (this.model) {
      set_info = {};
      set_info[ko.utils.unwrapObservable(this.options.key)] = value;
      args = _.isFunction(this.options.write) ? [value] : [set_info];
      if (!_.isUndefined(this.options.args)) {
        if (_.isArray(this.options.args)) {
          _ref = this.options.args;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            arg = _ref[_i];
            args.push(ko.utils.unwrapObservable(arg));
          }
        } else {
          args.push(ko.utils.unwrapObservable(this.options.args));
        }
      }
      if (_.isFunction(this.options.write)) {
        this.options.write.apply(this.view_model, args);
      } else {
        this.model.set.apply(this.model, args);
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
    this.model.bind('change', this._onModelChange);
    return this._updateValue();
  };
  Observable.prototype._onModelUnloaded = function(model) {
    if (this._kb_localizer && this._kb_localizer.destroy) {
      this._kb_localizer.destroy();
      this._kb_localizer = null;
    }
    this.model.unbind('change', this._onModelChange);
    return this.model = null;
  };
  Observable.prototype._onModelChange = function() {
    if ((this.model && this.model.hasChanged) && !this.model.hasChanged(ko.utils.unwrapObservable(this.options.key))) {
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
*/if (!this.Knockback) {
  throw new Error('Knockback: Dependency alert! knockback_core.js must be included before this file');
}
Knockback.Observables = (function() {
  function Observables(model, mappings_info, view_model, options_or_writeable) {
    var is_string, mapping_info, view_model_property_name, write, _ref, _ref2;
    this.model = model;
    this.mappings_info = mappings_info;
    this.view_model = view_model;
    if (!this.model) {
      throw new Error('Observables: model is missing');
    }
    if (!this.mappings_info) {
      throw new Error('Observables: mappings_info is missing');
    }
    if (!!options_or_writeable && ((_.isBoolean(options_or_writeable) && options_or_writeable) || !!options_or_writeable.write)) {
      write = _.isBoolean(options_or_writeable) ? options_or_writeable : !!options_or_writeable.write;
      _ref = this.mappings_info;
      for (view_model_property_name in _ref) {
        mapping_info = _ref[view_model_property_name];
        is_string = _.isString(mapping_info);
        if (is_string || !mapping_info.hasOwnProperty(write)) {
          mapping_info = is_string ? {
            key: mapping_info,
            write: write
          } : _.extend({
            write: write
          }, mapping_info);
        }
        this.view_model[view_model_property_name] = kb.observable(this.model, mapping_info, this.view_model);
      }
    } else {
      _ref2 = this.mappings_info;
      for (view_model_property_name in _ref2) {
        mapping_info = _ref2[view_model_property_name];
        this.view_model[view_model_property_name] = kb.observable(this.model, mapping_info, this.view_model);
      }
    }
  }
  Observables.prototype.destroy = function() {
    var mapping_info, view_model_property_name, _ref;
    _ref = this.mappings_info;
    for (view_model_property_name in _ref) {
      mapping_info = _ref[view_model_property_name];
      if (this.view_model[view_model_property_name]) {
        this.view_model[view_model_property_name].destroy();
      }
      this.view_model[view_model_property_name] = null;
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
Knockback.observables = function(model, mappings_info, view_model, options) {
  return new Knockback.Observables(model, mappings_info, view_model, options);
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
*/
var AttributeConnector;
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
AttributeConnector = (function() {
  function AttributeConnector(model, key, read_only) {
    this.key = key;
    this.read_only = read_only;
    _.bindAll(this, 'destroy', 'setModel');
    this._kb_observable = ko.observable();
    this._kb_observable.subscription = this._kb_observable.subscribe(__bind(function(value) {
      var set_info;
      if (this.read_only) {
        if (this.model) {
          value = this.model.get(this.key);
          if (this._kb_observable() === value) {
            return;
          }
          this._kb_observable(value);
        }
        throw "Cannot write a value to a dependentObservable unless you specify a 'write' option. If you wish to read the current value, don't pass any parameters.";
      } else if (this.model) {
        set_info = {};
        set_info[this.key] = value;
        return this.model.set(set_info);
      }
    }, this));
    this._kb_observable.destroy = this.destroy;
    this._kb_observable.setModel = this.setModel;
    if (model) {
      this.setModel(model);
    }
    return kb.wrappedObservable(this);
  }
  AttributeConnector.prototype.destroy = function() {
    this.model = null;
    return this._kb_observable = null;
  };
  AttributeConnector.prototype.setModel = function(model) {
    if (model) {
      this.model = model;
      return this._kb_observable(this.model.get(this.key));
    } else {
      return this.model = null;
    }
  };
  return AttributeConnector;
})();
Knockback.ViewModel_RCBase = (function() {
  function ViewModel_RCBase() {
    this._kb_vm = {};
    this._kb_vm.ref_count = 1;
  }
  ViewModel_RCBase.prototype.__destroy = function() {
    return kb.vmReleaseObservables(this);
  };
  ViewModel_RCBase.prototype.retain = function() {
    if (this._kb_vm.ref_count <= 0) {
      throw new Error("ViewModel: ref_count is corrupt: " + this._kb_vm.ref_count);
    }
    this._kb_vm.ref_count++;
    return this;
  };
  ViewModel_RCBase.prototype.release = function() {
    if (this._kb_vm.ref_count <= 0) {
      throw new Error("ViewModel: ref_count is corrupt: " + this._kb_vm.ref_count);
    }
    this._kb_vm.ref_count--;
    if (!this._kb_vm.ref_count) {
      this.__destroy();
    }
    return this;
  };
  ViewModel_RCBase.prototype.refCount = function() {
    return this._kb_vm.ref_count;
  };
  return ViewModel_RCBase;
})();
Knockback.ViewModel = (function() {
  __extends(ViewModel, kb.ViewModel_RCBase);
  function ViewModel(model, options, view_model) {
    var key, missing, _i, _len;
    if (options == null) {
      options = {};
    }
    ViewModel.__super__.constructor.apply(this, arguments);
    this._kb_vm.model = model;
    this._kb_vm.options = options;
    this._kb_vm.view_model = view_model;
    if (!this._kb_vm.model) {
      throw new Error('ViewModel: model is missing');
    }
    _.bindAll(this, '_kb_vm_onModelChange', '_kb_vm_onModelLoaded', '_kb_vm_onModelUnloaded');
    if (!this._kb_vm.view_model) {
      this._kb_vm.view_model = this;
    } else {
      this._kb_vm.observables = [];
    }
    if (Backbone.ModelRef && (this._kb_vm.model instanceof Backbone.ModelRef)) {
      this._kb_vm.model_ref = this._kb_vm.model;
      this._kb_vm.model_ref.retain();
      this._kb_vm.model_ref.bind('loaded', this._kb_vm_onModelLoaded);
      this._kb_vm.model_ref.bind('unloaded', this._kb_vm_onModelUnloaded);
      this._kb_vm.model = this._kb_vm.model_ref.getModel();
    }
    if (!this._kb_vm.model_ref || this._kb_vm.model_ref.isLoaded()) {
      this._kb_vm_onModelLoaded(this._kb_vm.model);
    }
    if (!this._kb_vm.options.internals && !this._kb_vm.options.requires) {
      return this;
    }
    missing = _.union((this._kb_vm.options.internals ? this._kb_vm.options.internals : []), (this._kb_vm.options.requires ? this._kb_vm.options.requires : []));
    if (!this._kb_vm.model_ref || this._kb_vm.model_ref.isLoaded()) {
      missing = _.difference(missing, _.keys(this._kb_vm.model.attributes));
    }
    for (_i = 0, _len = missing.length; _i < _len; _i++) {
      key = missing[_i];
      this._updateAttributeObservor(this._kb_vm.model, key);
    }
  }
  ViewModel.prototype.__destroy = function() {
    var view_model;
    if (this._kb_vm.model) {
      this._kb_vm.model.unbind('change', this._kb_vm_onModelChange);
      this._kb_vm.model = null;
    }
    view_model = this._kb_vm.view_model;
    this._kb_vm.view_model = null;
    kb.vmReleaseObservables(view_model, this._kb_vm.observables);
    if (this._kb_vm.observables) {
      return this._kb_vm.observables = null;
    }
  };
  ViewModel.prototype._kb_vm_onModelLoaded = function(model) {
    var key, _results;
    this._kb_vm.model = model;
    this._kb_vm.model.bind('change', this._kb_vm_onModelChange);
    _results = [];
    for (key in this._kb_vm.model.attributes) {
      _results.push(this._updateAttributeObservor(this._kb_vm.model, key));
    }
    return _results;
  };
  ViewModel.prototype._kb_vm_onModelUnloaded = function(model) {
    var key, _results;
    this._kb_vm.model.unbind('change', this._kb_vm_onModelChange);
    model = this._kb_vm.model;
    this._kb_vm.model = null;
    _results = [];
    for (key in model.attributes) {
      _results.push(this._updateAttributeObservor(this._kb_vm.model, key));
    }
    return _results;
  };
  ViewModel.prototype._kb_vm_onModelChange = function() {
    var key, _results, _results2;
    if (this._kb_vm.model._changed) {
      _results = [];
      for (key in this._kb_vm.model.attributes) {
        _results.push((this._kb_vm.model.hasChanged(key) ? this._updateAttributeObservor(this._kb_vm.model, key) : void 0));
      }
      return _results;
    } else if (this._kb_vm.model.changed) {
      _results2 = [];
      for (key in this._kb_vm.model.changed) {
        _results2.push(this._updateAttributeObservor(this._kb_vm.model, key));
      }
      return _results2;
    }
  };
  ViewModel.prototype._updateAttributeObservor = function(model, key) {
    var vm_key;
    vm_key = this._kb_vm.options.internals && _.contains(this._kb_vm.options.internals, key) ? '_' + key : key;
    if (this._kb_vm.view_model.hasOwnProperty(vm_key)) {
      if (this._kb_vm.view_model[vm_key]) {
        return this._kb_vm.view_model[vm_key].setModel(model);
      }
    } else {
      if (this._kb_vm.observables) {
        this._kb_vm.observables.push(vm_key);
      }
      return this._kb_vm.view_model[vm_key] = new AttributeConnector(model, key, this._kb_vm.options.read_only);
    }
  };
  return ViewModel;
})();
Knockback.viewModel = function(model, options, view_model) {
  return new Knockback.ViewModel(model, options, view_model);
};