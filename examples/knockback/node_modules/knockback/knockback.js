/*
  knockback.js 1.0.0
  Copyright (c)  2011-2015 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("knockout"), require("backbone"), require("underscore"), (function webpackLoadOptionalExternalModule() { try { return require("jquery"); } catch(e) {} }()));
	else if(typeof define === 'function' && define.amd)
		define(["knockout", "backbone", "underscore"], function webpackLoadOptionalExternalModuleAmd(__WEBPACK_EXTERNAL_MODULE_3__, __WEBPACK_EXTERNAL_MODULE_5__, __WEBPACK_EXTERNAL_MODULE_6__) {
			return factory(__WEBPACK_EXTERNAL_MODULE_3__, __WEBPACK_EXTERNAL_MODULE_5__, __WEBPACK_EXTERNAL_MODULE_6__, root["jQuery"]);
		});
	else if(typeof exports === 'object')
		exports["kb"] = factory(require("knockout"), require("backbone"), require("underscore"), (function webpackLoadOptionalExternalModule() { try { return require("jquery"); } catch(e) {} }()));
	else
		root["kb"] = factory(root["ko"], root["Backbone"], root["_"], root["jQuery"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_3__, __WEBPACK_EXTERNAL_MODULE_5__, __WEBPACK_EXTERNAL_MODULE_6__, __WEBPACK_EXTERNAL_MODULE_7__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(1);
	__webpack_require__(8);
	__webpack_require__(12);
	__webpack_require__(13);
	__webpack_require__(14);
	__webpack_require__(2);
	__webpack_require__(15);
	__webpack_require__(16);
	__webpack_require__(18);
	__webpack_require__(19);
	__webpack_require__(17);
	__webpack_require__(20);
	__webpack_require__(24);
	__webpack_require__(25);
	__webpack_require__(27);
	__webpack_require__(28);
	__webpack_require__(29);
	__webpack_require__(30);
	module.exports = __webpack_require__(32);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	
	/*
	  knockback.js 1.0.0
	  Copyright (c)  2011-2014 Kevin Malakoff.
	  License: MIT (http://www.opensource.org/licenses/mit-license.php)
	  Source: https://github.com/kmalakoff/knockback
	  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
	  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
	 */
	var COMPARE_ASCENDING, COMPARE_DESCENDING, COMPARE_EQUAL, KEYS_PUBLISH, _, kb, ko, ref,
	  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
	  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

	ref = kb = __webpack_require__(2), _ = ref._, ko = ref.ko;

	COMPARE_EQUAL = 0;

	COMPARE_ASCENDING = -1;

	COMPARE_DESCENDING = 1;

	KEYS_PUBLISH = ['destroy', 'shareOptions', 'filters', 'comparator', 'sortAttribute', 'viewModelByModel', 'hasViewModels'];

	kb.compare = function(value_a, value_b) {
	  if (_.isString(value_a)) {
	    return value_a.localeCompare("" + value_b);
	  }
	  if (_.isString(value_b)) {
	    return value_b.localeCompare("" + value_a);
	  }
	  if (value_a === value_b) {
	    return COMPARE_EQUAL;
	  } else {
	    if (value_a < value_b) {
	      return COMPARE_ASCENDING;
	    } else {
	      return COMPARE_DESCENDING;
	    }
	  }
	};

	kb.CollectionObservable = (function() {
	  CollectionObservable.extend = kb.extend;

	  function CollectionObservable(collection, view_model, options) {
	    this._onCollectionChange = bind(this._onCollectionChange, this);
	    var args;
	    args = Array.prototype.slice.call(_.isArguments(collection) ? collection : arguments);
	    return kb.ignore((function(_this) {
	      return function() {
	        var arg, create_options, i, len, observable;
	        collection = args[0] instanceof kb.Collection ? args.shift() : (_.isArray(args[0]) ? new kb.Collection(args.shift()) : new kb.Collection());
	        if (_.isFunction(args[0])) {
	          args[0] = {
	            view_model: args[0]
	          };
	        }
	        options = {};
	        for (i = 0, len = args.length; i < len; i++) {
	          arg = args[i];
	          _.extend(options, arg);
	        }
	        observable = kb.utils.wrappedObservable(_this, ko.observableArray([]));
	        observable.__kb_is_co = true;
	        _this.in_edit = 0;
	        _this.__kb || (_this.__kb = {});
	        options = kb.utils.collapseOptions(options);
	        if (options.auto_compact) {
	          _this.auto_compact = true;
	        }
	        if (options.sort_attribute) {
	          _this._comparator = ko.observable(_this._attributeComparator(options.sort_attribute));
	        } else {
	          _this._comparator = ko.observable(options.comparator);
	        }
	        if (options.filters) {
	          _this._filters = ko.observableArray(_.isArray(options.filters) ? options.filters : options.filters ? [options.filters] : void 0);
	        } else {
	          _this._filters = ko.observableArray([]);
	        }
	        create_options = _this.create_options = {
	          store: kb.Store.useOptionsOrCreate(options, collection, observable)
	        };
	        kb.utils.wrappedObject(observable, collection);
	        _this.path = options.path;
	        create_options.factory = kb.utils.wrappedFactory(observable, _this._shareOrCreateFactory(options));
	        create_options.path = kb.utils.pathJoin(options.path, 'models');
	        create_options.creator = create_options.factory.creatorForPath(null, create_options.path);
	        if (create_options.creator) {
	          _this.models_only = create_options.creator.models_only;
	        }
	        kb.publishMethods(observable, _this, KEYS_PUBLISH);
	        _this._collection = ko.observable(collection);
	        observable.collection = _this.collection = ko.computed({
	          read: function() {
	            return _this._collection();
	          },
	          write: function(new_collection) {
	            return kb.ignore(function() {
	              var previous_collection;
	              if ((previous_collection = _this._collection()) === new_collection) {
	                return;
	              }
	              kb.utils.wrappedObject(observable, new_collection);
	              if (previous_collection) {
	                previous_collection.unbind('all', _this._onCollectionChange);
	              }
	              if (new_collection) {
	                new_collection.bind('all', _this._onCollectionChange);
	              }
	              return _this._collection(new_collection);
	            });
	          }
	        });
	        if (collection) {
	          collection.bind('all', _this._onCollectionChange);
	        }
	        _this._mapper = ko.computed(function() {
	          var comparator, current_collection, filter, filters, j, len1, models, previous_view_models, view_models;
	          comparator = _this._comparator();
	          filters = _this._filters();
	          if (filters) {
	            for (j = 0, len1 = filters.length; j < len1; j++) {
	              filter = filters[j];
	              ko.utils.unwrapObservable(filter);
	            }
	          }
	          current_collection = _this._collection();
	          if (_this.in_edit) {
	            return;
	          }
	          observable = kb.utils.wrappedObservable(_this);
	          previous_view_models = kb.peek(observable);
	          if (current_collection) {
	            models = current_collection.models;
	          }
	          if (!models || (current_collection.models.length === 0)) {
	            view_models = [];
	          } else {
	            models = _.filter(models, function(model) {
	              return !filters.length || _this._selectModel(model);
	            });
	            if (comparator) {
	              view_models = _.map(models, function(model) {
	                return _this._createViewModel(model);
	              }).sort(comparator);
	            } else {
	              if (_this.models_only) {
	                view_models = filters.length ? models : models.slice();
	              } else {
	                view_models = _.map(models, function(model) {
	                  return _this._createViewModel(model);
	                });
	              }
	            }
	          }
	          _this.in_edit++;
	          observable(view_models);
	          _this.in_edit--;
	        });
	        observable.subscribe(_.bind(_this._onObservableArrayChange, _this));
	        !kb.statistics || kb.statistics.register('CollectionObservable', _this);
	        return observable;
	      };
	    })(this));
	  }

	  CollectionObservable.prototype.destroy = function() {
	    var array, collection, observable;
	    this.__kb_released = true;
	    observable = kb.utils.wrappedObservable(this);
	    collection = kb.peek(this._collection);
	    kb.utils.wrappedObject(observable, null);
	    if (collection) {
	      collection.unbind('all', this._onCollectionChange);
	      array = kb.peek(observable);
	      array.splice(0, array.length);
	    }
	    this.collection.dispose();
	    this._collection = observable.collection = this.collection = null;
	    this._mapper.dispose();
	    this._mapper = null;
	    kb.release(this._filters);
	    this._filters = null;
	    this._comparator(null);
	    this._comparator = null;
	    this.create_options = null;
	    observable.collection = null;
	    kb.utils.wrappedDestroy(this);
	    return !kb.statistics || kb.statistics.unregister('CollectionObservable', this);
	  };

	  CollectionObservable.prototype.shareOptions = function() {
	    var observable;
	    observable = kb.utils.wrappedObservable(this);
	    return {
	      store: kb.utils.wrappedStore(observable),
	      factory: kb.utils.wrappedFactory(observable)
	    };
	  };

	  CollectionObservable.prototype.filters = function(filters) {
	    if (filters) {
	      return this._filters(_.isArray(filters) ? filters : [filters]);
	    } else {
	      return this._filters([]);
	    }
	  };

	  CollectionObservable.prototype.comparator = function(comparator) {
	    return this._comparator(comparator);
	  };

	  CollectionObservable.prototype.sortAttribute = function(sort_attribute) {
	    return this._comparator(sort_attribute ? this._attributeComparator(sort_attribute) : null);
	  };

	  CollectionObservable.prototype.viewModelByModel = function(model) {
	    var id_attribute;
	    if (this.models_only) {
	      return null;
	    }
	    id_attribute = model.hasOwnProperty(model.idAttribute) ? model.idAttribute : 'cid';
	    return _.find(kb.peek(kb.utils.wrappedObservable(this)), function(test) {
	      var ref1;
	      if (test != null ? (ref1 = test.__kb) != null ? ref1.object : void 0 : void 0) {
	        return test.__kb.object[id_attribute] === model[id_attribute];
	      } else {
	        return false;
	      }
	    });
	  };

	  CollectionObservable.prototype.hasViewModels = function() {
	    return !this.models_only;
	  };

	  CollectionObservable.prototype.compact = function() {
	    return kb.ignore((function(_this) {
	      return function() {
	        var observable;
	        observable = kb.utils.wrappedObservable(_this);
	        if (!kb.utils.wrappedStoreIsOwned(observable)) {
	          return;
	        }
	        kb.utils.wrappedStore(observable).clear();
	        return _this._collection.notifySubscribers(_this._collection());
	      };
	    })(this));
	  };

	  CollectionObservable.prototype._shareOrCreateFactory = function(options) {
	    var absolute_models_path, existing_creator, factories, factory;
	    absolute_models_path = kb.utils.pathJoin(options.path, 'models');
	    factories = options.factories;
	    if ((factory = options.factory)) {
	      if ((existing_creator = factory.creatorForPath(null, absolute_models_path)) && (!factories || (factories['models'] === existing_creator))) {
	        if (!factories) {
	          return factory;
	        }
	        if (factory.hasPathMappings(factories, options.path)) {
	          return factory;
	        }
	      }
	    }
	    factory = new kb.Factory(options.factory);
	    if (factories) {
	      factory.addPathMappings(factories, options.path);
	    }
	    if (!factory.creatorForPath(null, absolute_models_path)) {
	      if (options.hasOwnProperty('models_only')) {
	        if (options.models_only) {
	          factory.addPathMapping(absolute_models_path, {
	            models_only: true
	          });
	        } else {
	          factory.addPathMapping(absolute_models_path, kb.ViewModel);
	        }
	      } else if (options.view_model) {
	        factory.addPathMapping(absolute_models_path, options.view_model);
	      } else if (options.create) {
	        factory.addPathMapping(absolute_models_path, {
	          create: options.create
	        });
	      } else {
	        factory.addPathMapping(absolute_models_path, kb.ViewModel);
	      }
	    }
	    return factory;
	  };

	  CollectionObservable.prototype._onCollectionChange = function(event, arg) {
	    return kb.ignore((function(_this) {
	      return function() {
	        var collection, comparator, observable, view_model;
	        if (_this.in_edit || kb.wasReleased(_this)) {
	          return;
	        }
	        switch (event) {
	          case 'reset':
	            if (_this.auto_compact) {
	              _this.compact();
	            } else {
	              _this._collection.notifySubscribers(_this._collection());
	            }
	            break;
	          case 'sort':
	          case 'resort':
	            _this._collection.notifySubscribers(_this._collection());
	            break;
	          case 'new':
	          case 'add':
	            if (!_this._selectModel(arg)) {
	              return;
	            }
	            observable = kb.utils.wrappedObservable(_this);
	            collection = _this._collection();
	            if (collection.indexOf(arg) === -1) {
	              return;
	            }
	            if ((view_model = _this.viewModelByModel(arg))) {
	              return;
	            }
	            _this.in_edit++;
	            if ((comparator = _this._comparator())) {
	              observable().push(_this._createViewModel(arg));
	              observable.sort(comparator);
	            } else {
	              observable.splice(collection.indexOf(arg), 0, _this._createViewModel(arg));
	            }
	            _this.in_edit--;
	            break;
	          case 'remove':
	          case 'destroy':
	            _this._onModelRemove(arg);
	            break;
	          case 'change':
	            if (!_this._selectModel(arg)) {
	              return _this._onModelRemove(arg);
	            }
	            view_model = _this.models_only ? arg : _this.viewModelByModel(arg);
	            if (!view_model) {
	              return _this._onCollectionChange('add', arg);
	            }
	            if (!(comparator = _this._comparator())) {
	              return;
	            }
	            _this.in_edit++;
	            kb.utils.wrappedObservable(_this).sort(comparator);
	            _this.in_edit--;
	        }
	      };
	    })(this));
	  };

	  CollectionObservable.prototype._onModelRemove = function(model) {
	    var observable, view_model;
	    view_model = this.models_only ? model : this.viewModelByModel(model);
	    if (!view_model) {
	      return;
	    }
	    observable = kb.utils.wrappedObservable(this);
	    this.in_edit++;
	    observable.remove(view_model);
	    return this.in_edit--;
	  };

	  CollectionObservable.prototype._onObservableArrayChange = function(models_or_view_models) {
	    return kb.ignore((function(_this) {
	      return function() {
	        var collection, current_view_model, has_filters, i, len, model, models, observable, view_model, view_models;
	        if (_this.in_edit) {
	          return;
	        }
	        (_this.models_only && (!models_or_view_models.length || kb.isModel(models_or_view_models[0]))) || (!_this.models_only && (!models_or_view_models.length || (_.isObject(models_or_view_models[0]) && !kb.isModel(models_or_view_models[0])))) || kb._throwUnexpected(_this, 'incorrect type passed');
	        observable = kb.utils.wrappedObservable(_this);
	        collection = kb.peek(_this._collection);
	        has_filters = kb.peek(_this._filters).length;
	        if (!collection) {
	          return;
	        }
	        view_models = models_or_view_models;
	        if (_this.models_only) {
	          models = _.filter(models_or_view_models, function(model) {
	            return !has_filters || _this._selectModel(model);
	          });
	        } else {
	          !has_filters || (view_models = []);
	          models = [];
	          for (i = 0, len = models_or_view_models.length; i < len; i++) {
	            view_model = models_or_view_models[i];
	            model = kb.utils.wrappedObject(view_model);
	            if (has_filters) {
	              if (!_this._selectModel(model)) {
	                continue;
	              }
	              view_models.push(view_model);
	            }
	            if (current_view_model = _this.create_options.store.find(model, _this.create_options.creator)) {
	              (current_view_model.constructor === view_model.constructor) || kb._throwUnexpected(_this, 'replacing different type of view model');
	            }
	            _this.create_options.store.retain(view_model, model, _this.create_options.creator);
	            models.push(model);
	          }
	        }
	        _this.in_edit++;
	        (models_or_view_models.length === view_models.length) || observable(view_models);
	        _.isEqual(collection.models, models) || collection.reset(models);
	        _this.in_edit--;
	      };
	    })(this));
	  };

	  CollectionObservable.prototype._attributeComparator = function(sort_attribute) {
	    var modelAttributeCompare;
	    modelAttributeCompare = function(model_a, model_b) {
	      var attribute_name;
	      attribute_name = ko.utils.unwrapObservable(sort_attribute);
	      return kb.compare(model_a.get(attribute_name), model_b.get(attribute_name));
	    };
	    return (this.models_only ? modelAttributeCompare : function(model_a, model_b) {
	      return modelAttributeCompare(kb.utils.wrappedModel(model_a), kb.utils.wrappedModel(model_b));
	    });
	  };

	  CollectionObservable.prototype._createViewModel = function(model) {
	    if (this.models_only) {
	      return model;
	    }
	    return this.create_options.store.retainOrCreate(model, this.create_options);
	  };

	  CollectionObservable.prototype._selectModel = function(model) {
	    var filter, filters, i, len, ref1;
	    filters = kb.peek(this._filters);
	    for (i = 0, len = filters.length; i < len; i++) {
	      filter = filters[i];
	      filter = kb.peek(filter);
	      if (_.isFunction(filter)) {
	        if (!filter(model)) {
	          return false;
	        }
	      } else if (_.isArray(filter)) {
	        if (ref1 = model.id, indexOf.call(filter, ref1) < 0) {
	          return false;
	        }
	      } else {
	        if (model.id !== filter) {
	          return false;
	        }
	      }
	    }
	    return true;
	  };

	  return CollectionObservable;

	})();

	kb.collectionObservable = function(collection, view_model, options) {
	  return new kb.CollectionObservable(arguments);
	};

	kb.observableCollection = kb.collectionObservable;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {
	/*
	  knockback.js 1.0.0
	  Copyright (c)  2011-2014 Kevin Malakoff.
	  License: MIT (http://www.opensource.org/licenses/mit-license.php)
	  Source: https://github.com/kmalakoff/knockback
	  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
	  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
	 */
	var Backbone, LIFECYCLE_METHODS, _, kb, ko, window;

	window = window != null ? window : global;

	ko = __webpack_require__(3);

	LIFECYCLE_METHODS = ['release', 'destroy', 'dispose'];

	module.exports = kb = (function() {
	  var ref;

	  function kb() {}

	  kb.VERSION = '1.0.0';

	  kb.TYPE_UNKNOWN = 0;

	  kb.TYPE_SIMPLE = 1;

	  kb.TYPE_ARRAY = 2;

	  kb.TYPE_MODEL = 3;

	  kb.TYPE_COLLECTION = 4;

	  kb.wasReleased = function(obj) {
	    return !obj || obj.__kb_released;
	  };

	  kb.isReleaseable = function(obj, depth) {
	    var i, key, len, method, value;
	    if (depth == null) {
	      depth = 0;
	    }
	    if ((!obj || (obj !== Object(obj))) || obj.__kb_released) {
	      return false;
	    }
	    if (ko.isObservable(obj) || (obj instanceof kb.ViewModel)) {
	      return true;
	    }
	    if ((typeof obj === 'function') || kb.isModel(obj) || kb.isCollection(obj)) {
	      return false;
	    }
	    for (i = 0, len = LIFECYCLE_METHODS.length; i < len; i++) {
	      method = LIFECYCLE_METHODS[i];
	      if (typeof obj[method] === 'function') {
	        return true;
	      }
	    }
	    if (depth > 0) {
	      return false;
	    }
	    for (key in obj) {
	      value = obj[key];
	      if ((key !== '__kb') && kb.isReleaseable(value, depth + 1)) {
	        return true;
	      }
	    }
	    return false;
	  };

	  kb.release = function(obj) {
	    var array, i, index, len, method, value;
	    if (!kb.isReleaseable(obj)) {
	      return;
	    }
	    obj.__kb_released = true;
	    if (_.isArray(obj)) {
	      for (index in obj) {
	        value = obj[index];
	        if (kb.isReleaseable(value)) {
	          obj[index] = null;
	          kb.release(value);
	        }
	      }
	      return;
	    }
	    if (ko.isObservable(obj) && _.isArray(array = kb.peek(obj))) {
	      if (obj.__kb_is_co || (obj.__kb_is_o && (obj.valueType() === kb.TYPE_COLLECTION))) {
	        return typeof obj.destroy === "function" ? obj.destroy() : void 0;
	      }
	      for (index in array) {
	        value = array[index];
	        if (kb.isReleaseable(value)) {
	          array[index] = null;
	          kb.release(value);
	        }
	      }
	      if (typeof obj.dispose === 'function') {
	        obj.dispose();
	      }
	      return;
	    }
	    for (i = 0, len = LIFECYCLE_METHODS.length; i < len; i++) {
	      method = LIFECYCLE_METHODS[i];
	      if (typeof obj[method] === 'function') {
	        return obj[method].call(obj);
	      }
	    }
	    if (!ko.isObservable(obj)) {
	      return this.releaseKeys(obj);
	    }
	  };

	  kb.releaseKeys = function(obj) {
	    var key, value;
	    for (key in obj) {
	      value = obj[key];
	      if (key !== '__kb' && kb.isReleaseable(value)) {
	        obj[key] = null;
	        kb.release(value);
	      }
	    }
	  };

	  kb.releaseOnNodeRemove = function(view_model, node) {
	    view_model || kb._throwUnexpected(this, 'missing view model');
	    node || kb._throwUnexpected(this, 'missing node');
	    return ko.utils.domNodeDisposal.addDisposeCallback(node, function() {
	      return kb.release(view_model);
	    });
	  };

	  kb.renderTemplate = function(template, view_model, options) {
	    var document, el, observable;
	    if (options == null) {
	      options = {};
	    }
	    if (!(document = window != null ? window.document : void 0)) {
	      return typeof console !== "undefined" && console !== null ? console.log('renderTemplate: document is undefined') : void 0;
	    }
	    el = document.createElement('div');
	    observable = ko.renderTemplate(template, view_model, options, el, 'replaceChildren');
	    if (el.childNodes.length === 1) {
	      el = el.childNodes[0];
	    } else if (el.childNodes.length) {
	      ko.storedBindingContextForNode(el, ko.contextFor(el.childNodes[0]));
	    }
	    kb.releaseOnNodeRemove(view_model, el);
	    observable.dispose();
	    if (view_model.afterRender && !options.afterRender) {
	      view_model.afterRender(el);
	    }
	    return el;
	  };

	  kb.applyBindings = function(view_model, node) {
	    var child, children, i, len, ref;
	    if (node.length) {
	      ref = [document.createElement('div'), node], node = ref[0], children = ref[1];
	      for (i = 0, len = children.length; i < len; i++) {
	        child = children[i];
	        node.appendChild(child);
	      }
	    }
	    ko.applyBindings(view_model, node);
	    kb.releaseOnNodeRemove(view_model, node);
	    return node;
	  };

	  kb.getValue = function(model, key, args) {
	    var ref;
	    if (!model) {
	      return;
	    }
	    if (_.isFunction(model[key]) && ((ref = kb.orm) != null ? ref.useFunction(model, key) : void 0)) {
	      return model[key]();
	    }
	    if (!args) {
	      return model.get(key);
	    }
	    return model.get.apply(model, _.map([key].concat(args), function(value) {
	      return kb.peek(value);
	    }));
	  };

	  kb.setValue = function(model, key, value) {
	    var attributes, ref;
	    if (!model) {
	      return;
	    }
	    if (_.isFunction(model[key]) && ((ref = kb.orm) != null ? ref.useFunction(model, key) : void 0)) {
	      return model[key](value);
	    }
	    (attributes = {})[key] = value;
	    return model.set(attributes);
	  };

	  kb.ignore = ((ref = ko.dependencyDetection) != null ? ref.ignore : void 0) || function(callback, callbackTarget, callbackArgs) {
	    var value;
	    value = null;
	    ko.computed(function() {
	      return value = callback.apply(callbackTarget, callbackArgs || []);
	    }).dispose();
	    return value;
	  };

	  kb.extend = __webpack_require__(4);

	  kb._throwMissing = function(instance, message) {
	    throw (_.isString(instance) ? instance : instance.constructor.name) + ": " + message + " is missing";
	  };

	  kb._throwUnexpected = function(instance, message) {
	    throw (_.isString(instance) ? instance : instance.constructor.name) + ": " + message + " is unexpected";
	  };

	  kb.publishMethods = function(observable, instance, methods) {
	    var fn, i, len;
	    for (i = 0, len = methods.length; i < len; i++) {
	      fn = methods[i];
	      observable[fn] = kb._.bind(instance[fn], instance);
	    }
	  };

	  kb.peek = function(obs) {
	    if (!ko.isObservable(obs)) {
	      return obs;
	    }
	    if (obs.peek) {
	      return obs.peek();
	    }
	    return kb.ignore(function() {
	      return obs();
	    });
	  };

	  kb.isModel = function(obj) {
	    return obj && ((obj instanceof kb.Model) || ((typeof obj.get === 'function') && (typeof obj.bind === 'function')));
	  };

	  kb.isCollection = function(obj) {
	    return obj && (obj instanceof kb.Collection);
	  };

	  return kb;

	})();

	if (window.Parse) {
	  Backbone = kb.Parse = window.Parse;
	  _ = kb._ = window.Parse._;
	} else {
	  Backbone = kb.Backbone = __webpack_require__(5);
	  _ = kb._ = __webpack_require__(6);
	}

	kb.ko = ko;

	kb.Collection = Backbone.Collection;

	kb.Model = Backbone.Object || Backbone.Model;

	kb.Events = Backbone.Events;

	kb.$ = window.jQuery || window.$;

	try {
	  kb.$ || (kb.$ = __webpack_require__(7));
	} catch (undefined) {}

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ },
/* 4 */
/***/ function(module, exports) {

	
	/*
	  knockback.js 1.0.0
	  Copyright (c)  2011-2014 Kevin Malakoff.
	  License: MIT (http://www.opensource.org/licenses/mit-license.php)
	  Source: https://github.com/kmalakoff/knockback
	  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
	  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
	 */
	var copyProps;

	copyProps = function(dest, source) {
	  var key, value;
	  for (key in source) {
	    value = source[key];
	    dest[key] = value;
	  }
	  return dest;
	};

	// Shared empty constructor function to aid in prototype-chain creation.
	var ctor = function(){};

	// Helper function to correctly set up the prototype chain, for subclasses.
	// Similar to 'goog.inherits', but uses a hash of prototype properties and
	// class properties to be extended.
	var inherits = function(parent, protoProps, staticProps) {
	  var child;

	  // The constructor function for the new subclass is either defined by you
	  // (the "constructor" property in your extend definition), or defaulted
	  // by us to simply call the parent's constructor.
	  if (protoProps && protoProps.hasOwnProperty('constructor')) {
	    child = protoProps.constructor;
	  } else {
	    child = function(){ parent.apply(this, arguments); };
	  }

	  // Inherit class (static) properties from parent.
	  copyProps(child, parent);

	  // Set the prototype chain to inherit from parent, without calling
	  // parent's constructor function.
	  ctor.prototype = parent.prototype;
	  child.prototype = new ctor();

	  // Add prototype properties (instance properties) to the subclass,
	  // if supplied.
	  if (protoProps) copyProps(child.prototype, protoProps);

	  // Add static properties to the constructor function, if supplied.
	  if (staticProps) copyProps(child, staticProps);

	  // Correctly set child's 'prototype.constructor'.
	  child.prototype.constructor = child;

	  // Set a convenience property in case the parent's prototype is needed later.
	  child.__super__ = parent.prototype;

	  return child;
	};

	// The self-propagating extend function that BacLCone classes use.
	var extend = function (protoProps, classProps) {
	  var child = inherits(this, protoProps, classProps);
	  child.extend = this.extend;
	  return child;
	};
	;

	module.exports = extend;


/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_5__;

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_6__;

/***/ },
/* 7 */
/***/ function(module, exports) {

	if(typeof __WEBPACK_EXTERNAL_MODULE_7__ === 'undefined') {var e = new Error("Cannot find module \"undefined\""); e.code = 'MODULE_NOT_FOUND'; throw e;}
	module.exports = __WEBPACK_EXTERNAL_MODULE_7__;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var ALL_ORMS, _, kb, key, ko, ref, value;

	ref = kb = __webpack_require__(2), _ = ref._, ko = ref.ko;

	ALL_ORMS = {
	  "default": null,
	  'backbone-orm': null,
	  'backbone-associations': __webpack_require__(9),
	  'backbone-relational': __webpack_require__(10),
	  supermodel: __webpack_require__(11)
	};

	kb.orm = ALL_ORMS["default"];

	for (key in ALL_ORMS) {
	  value = ALL_ORMS[key];
	  if (value && value.isAvailable()) {
	    kb.orm = value;
	    break;
	  }
	}

	module.exports = function(options) {
	  var orm;
	  if (options == null) {
	    options = {};
	  }
	  for (key in options) {
	    value = options[key];
	    switch (key) {
	      case 'orm':
	        if (_.isString(value)) {
	          if (!ALL_ORMS.hasOwnProperty(value)) {
	            console.log("Knockback configure: could not find orm: " + value + ". Available: " + (_.keys(ALL_ORMS).join(', ')));
	            continue;
	          }
	          if ((orm = ALL_ORMS[value]) && !orm.isAvailable()) {
	            console.log("Knockback configure: could not enable orm " + value + ". Make sure it is included before Knockback");
	            continue;
	          }
	          kb.orm = orm;
	          continue;
	        } else {
	          kb.orm = value;
	        }
	        break;
	      default:
	        kb[key] = value;
	    }
	  }
	};


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	
	/*
	  knockback.js 1.0.0
	  Copyright (c)  2011-2014 Kevin Malakoff.
	  License: MIT (http://www.opensource.org/licenses/mit-license.php)
	  Source: https://github.com/kmalakoff/knockback
	  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
	  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
	 */
	var AssociatedModel, Backbone, BackboneAssociations, _, kb, ref;

	ref = kb = __webpack_require__(2), _ = ref._, Backbone = ref.Backbone;

	AssociatedModel = null;

	module.exports = BackboneAssociations = (function() {
	  function BackboneAssociations() {}

	  BackboneAssociations.isAvailable = function() {
	    return !!(AssociatedModel = Backbone != null ? Backbone.AssociatedModel : void 0);
	  };

	  BackboneAssociations.keys = function(model) {
	    if (!(model instanceof AssociatedModel)) {
	      return null;
	    }
	    return _.map(model.relations, function(test) {
	      return test.key;
	    });
	  };

	  BackboneAssociations.relationType = function(model, key) {
	    var relation;
	    if (!(model instanceof AssociatedModel)) {
	      return null;
	    }
	    if (!(relation = _.find(model.relations, function(test) {
	      return test.key === key;
	    }))) {
	      return null;
	    }
	    if (relation.type === 'Many') {
	      return kb.TYPE_COLLECTION;
	    } else {
	      return kb.TYPE_MODEL;
	    }
	  };

	  BackboneAssociations.useFunction = function() {
	    return false;
	  };

	  return BackboneAssociations;

	})();


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	
	/*
	  knockback.js 1.0.0
	  Copyright (c)  2011-2014 Kevin Malakoff.
	  License: MIT (http://www.opensource.org/licenses/mit-license.php)
	  Source: https://github.com/kmalakoff/knockback
	  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
	  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
	 */
	var Backbone, BackboneRelational, RelationalModel, _, kb, ref;

	ref = kb = __webpack_require__(2), _ = ref._, Backbone = ref.Backbone;

	RelationalModel = null;

	module.exports = BackboneRelational = (function() {
	  function BackboneRelational() {}

	  BackboneRelational.isAvailable = function() {
	    return !!(RelationalModel = Backbone != null ? Backbone.RelationalModel : void 0);
	  };

	  BackboneRelational.relationType = function(model, key) {
	    var relation;
	    if (!(model instanceof RelationalModel)) {
	      return null;
	    }
	    if (!(relation = _.find(model.getRelations(), function(test) {
	      return test.key === key;
	    }))) {
	      return null;
	    }
	    if (relation.collectionType || _.isArray(relation.keyContents)) {
	      return kb.TYPE_COLLECTION;
	    } else {
	      return kb.TYPE_MODEL;
	    }
	  };

	  BackboneRelational.bind = function(model, key, update, path) {
	    var event, events, i, len, rel_fn, type;
	    if (!(type = this.relationType(model, key))) {
	      return null;
	    }
	    rel_fn = function(model) {
	      !kb.statistics || kb.statistics.addModelEvent({
	        name: 'update (relational)',
	        model: model,
	        key: key,
	        path: path
	      });
	      return update();
	    };
	    events = kb.Backbone.Relation.prototype.sanitizeOptions ? ['update', 'add', 'remove'] : ['change', 'add', 'remove'];
	    if (type === kb.TYPE_COLLECTION) {
	      for (i = 0, len = events.length; i < len; i++) {
	        event = events[i];
	        model.bind(event + ":" + key, rel_fn);
	      }
	    } else {
	      model.bind(events[0] + ":" + key, rel_fn);
	    }
	    return function() {
	      var j, len1;
	      if (type === kb.TYPE_COLLECTION) {
	        for (j = 0, len1 = events.length; j < len1; j++) {
	          event = events[j];
	          model.unbind(event + ":" + key, rel_fn);
	        }
	      } else {
	        model.unbind(events[0] + ":" + key, rel_fn);
	      }
	    };
	  };

	  BackboneRelational.useFunction = function() {
	    return false;
	  };

	  return BackboneRelational;

	})();


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {
	/*
	  knockback.js 1.0.0
	  Copyright (c)  2011-2014 Kevin Malakoff.
	  License: MIT (http://www.opensource.org/licenses/mit-license.php)
	  Source: https://github.com/kmalakoff/knockback
	  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
	  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
	 */
	var Supermodel, _, kb, root;

	root = typeof window !== "undefined" && window !== null ? window : global;

	_ = (kb = __webpack_require__(2))._;

	Supermodel = null;

	module.exports = Supermodel = (function() {
	  function Supermodel() {}

	  Supermodel.isAvailable = function() {
	    return !!(Supermodel = root.Supermodel);
	  };

	  Supermodel.keys = function(model) {
	    if (!(model instanceof Supermodel.Model)) {
	      return null;
	    }
	    return _.keys(model.constructor.associations());
	  };

	  Supermodel.relationType = function(model, key) {
	    var relation;
	    if (!(model instanceof Supermodel.Model)) {
	      return null;
	    }
	    if (!(relation = model.constructor.associations()[key])) {
	      return null;
	    }
	    if (relation.add) {
	      return kb.TYPE_COLLECTION;
	    } else {
	      return kb.TYPE_MODEL;
	    }
	  };

	  Supermodel.bind = function(model, key, update, path) {
	    var rel_fn, type;
	    if (!(type = this.relationType(model, key))) {
	      return null;
	    }
	    rel_fn = function(model, other) {
	      var previous, relation;
	      !kb.statistics || kb.statistics.addModelEvent({
	        name: 'update (supermodel)',
	        model: model,
	        key: key,
	        path: path
	      });
	      relation = model.constructor.associations()[key];
	      previous = model[relation.store];
	      model[relation.store] = other;
	      update(other);
	      return model[relation.store] = previous;
	    };
	    if (type === kb.TYPE_MODEL) {
	      model.bind("associate:" + key, rel_fn);
	      return function() {
	        return model.unbind("associate:" + key, rel_fn);
	      };
	    }
	  };

	  Supermodel.useFunction = function(model, key) {
	    return !!this.relationType(model, key);
	  };

	  return Supermodel;

	})();

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	
	/*
	  knockback.js 1.0.0
	  Copyright (c)  2011-2014 Kevin Malakoff.
	  License: MIT (http://www.opensource.org/licenses/mit-license.php)
	  Source: https://github.com/kmalakoff/knockback
	  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
	  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
	 */
	var _, kb, ko, ref,
	  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

	ref = kb = __webpack_require__(2), _ = ref._, ko = ref.ko;

	kb.EventWatcher = (function() {
	  EventWatcher.useOptionsOrCreate = function(options, emitter, obj, callback_options) {
	    if (options.event_watcher) {
	      if (!(options.event_watcher.emitter() === emitter || (options.event_watcher.model_ref === emitter))) {
	        kb._throwUnexpected(this, 'emitter not matching');
	      }
	      return kb.utils.wrappedEventWatcher(obj, options.event_watcher).registerCallbacks(obj, callback_options);
	    } else {
	      kb.utils.wrappedEventWatcherIsOwned(obj, true);
	      return kb.utils.wrappedEventWatcher(obj, new kb.EventWatcher(emitter)).registerCallbacks(obj, callback_options);
	    }
	  };

	  function EventWatcher(emitter, obj, callback_options) {
	    this._unbindCallbacks = bind(this._unbindCallbacks, this);
	    this._onModelUnloaded = bind(this._onModelUnloaded, this);
	    this._onModelLoaded = bind(this._onModelLoaded, this);
	    this.__kb || (this.__kb = {});
	    this.__kb.callbacks = {};
	    this.ee = null;
	    if (callback_options) {
	      this.registerCallbacks(obj, callback_options);
	    }
	    if (emitter) {
	      this.emitter(emitter);
	    }
	  }

	  EventWatcher.prototype.destroy = function() {
	    this.emitter(null);
	    this.__kb.callbacks = null;
	    return kb.utils.wrappedDestroy(this);
	  };

	  EventWatcher.prototype.emitter = function(new_emitter) {
	    if ((arguments.length === 0) || (this.ee === new_emitter)) {
	      return this.ee;
	    }
	    if (this.model_ref) {
	      this.model_ref.unbind('loaded', this._onModelLoaded);
	      this.model_ref.unbind('unloaded', this._onModelUnloaded);
	      this.model_ref.release();
	      this.model_ref = null;
	    }
	    if (kb.Backbone && kb.Backbone.ModelRef && (new_emitter instanceof kb.Backbone.ModelRef)) {
	      this.model_ref = new_emitter;
	      this.model_ref.retain();
	      this.model_ref.bind('loaded', this._onModelLoaded);
	      this.model_ref.bind('unloaded', this._onModelUnloaded);
	      new_emitter = this.model_ref.model() || null;
	    } else {
	      delete this.model_ref;
	    }
	    if (this.ee !== new_emitter) {
	      if (new_emitter) {
	        this._onModelLoaded(new_emitter);
	      } else {
	        this._onModelUnloaded(this.ee);
	      }
	    }
	    return new_emitter;
	  };

	  EventWatcher.prototype.registerCallbacks = function(obj, callback_info) {
	    var event_name, event_names, fn, i, len, model;
	    obj || kb._throwMissing(this, 'obj');
	    callback_info || kb._throwMissing(this, 'callback_info');
	    event_names = callback_info.event_selector ? callback_info.event_selector.split(' ') : ['change'];
	    model = this.ee;
	    fn = (function(_this) {
	      return function(event_name) {
	        var callbacks, info;
	        if (!(callbacks = _this.__kb.callbacks[event_name])) {
	          callbacks = _this.__kb.callbacks[event_name] = {
	            model: null,
	            list: [],
	            fn: function(model) {
	              var info, j, len1, ref1;
	              ref1 = callbacks.list;
	              for (j = 0, len1 = ref1.length; j < len1; j++) {
	                info = ref1[j];
	                if (!info.update) {
	                  continue;
	                }
	                if (model && info.key && (model.hasChanged && !model.hasChanged(ko.utils.unwrapObservable(info.key)))) {
	                  continue;
	                }
	                !kb.statistics || kb.statistics.addModelEvent({
	                  name: event_name,
	                  model: model,
	                  key: info.key,
	                  path: info.path
	                });
	                info.update();
	              }
	              return null;
	            }
	          };
	        }
	        callbacks.list.push(info = _.defaults({
	          obj: obj
	        }, callback_info));
	        if (model) {
	          return _this._onModelLoaded(model);
	        }
	      };
	    })(this);
	    for (i = 0, len = event_names.length; i < len; i++) {
	      event_name = event_names[i];
	      if (!event_name) {
	        continue;
	      }
	      fn(event_name);
	    }
	    return this;
	  };

	  EventWatcher.prototype.releaseCallbacks = function(obj) {
	    var callbacks, event_name, ref1;
	    this.ee = null;
	    ref1 = this.__kb.callbacks;
	    for (event_name in ref1) {
	      callbacks = ref1[event_name];
	      this._unbindCallbacks(event_name, callbacks, kb.wasReleased(obj));
	    }
	    return delete this.__kb.callbacks;
	  };

	  EventWatcher.prototype._onModelLoaded = function(model) {
	    var callbacks, event_name, i, info, len, ref1, ref2, ref3;
	    this.ee = model;
	    ref1 = this.__kb.callbacks;
	    for (event_name in ref1) {
	      callbacks = ref1[event_name];
	      if (callbacks.model && (callbacks.model !== model)) {
	        this._unbindCallbacks(event_name, callbacks, true);
	      }
	      if (!callbacks.model) {
	        callbacks.model = model;
	        model.bind(event_name, callbacks.fn);
	      }
	      ref2 = callbacks.list;
	      for (i = 0, len = ref2.length; i < len; i++) {
	        info = ref2[i];
	        info.unbind_fn || (info.unbind_fn = (ref3 = kb.orm) != null ? ref3.bind(model, info.key, info.update, info.path) : void 0);
	        if (info.emitter) {
	          info.emitter(model);
	        }
	      }
	    }
	  };

	  EventWatcher.prototype._onModelUnloaded = function(model) {
	    var callbacks, event_name, ref1;
	    if (this.ee !== model) {
	      return;
	    }
	    this.ee = null;
	    ref1 = this.__kb.callbacks;
	    for (event_name in ref1) {
	      callbacks = ref1[event_name];
	      this._unbindCallbacks(event_name, callbacks);
	    }
	  };

	  EventWatcher.prototype._unbindCallbacks = function(event_name, callbacks, skip_emitter) {
	    var i, info, len, ref1;
	    if (callbacks.model) {
	      callbacks.model.unbind(event_name, callbacks.fn);
	      callbacks.model = null;
	    }
	    ref1 = callbacks.list;
	    for (i = 0, len = ref1.length; i < len; i++) {
	      info = ref1[i];
	      if (info.unbind_fn) {
	        info.unbind_fn();
	        info.unbind_fn = null;
	      }
	      if (info.emitter && !skip_emitter && !kb.wasReleased(info.obj)) {
	        info.emitter(null);
	      }
	    }
	  };

	  return EventWatcher;

	})();

	kb.emitterObservable = function(emitter, observable) {
	  return new kb.EventWatcher(emitter, observable);
	};


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	
	/*
	  knockback.js 1.0.0
	  Copyright (c)  2011-2014 Kevin Malakoff.
	  License: MIT (http://www.opensource.org/licenses/mit-license.php)
	  Source: https://github.com/kmalakoff/knockback
	  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
	  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
	 */
	var _, kb;

	_ = (kb = __webpack_require__(2))._;

	kb.Factory = (function() {
	  Factory.useOptionsOrCreate = function(options, obj, owner_path) {
	    var factory;
	    if (options.factory && (!options.factories || (options.factories && options.factory.hasPathMappings(options.factories, owner_path)))) {
	      return kb.utils.wrappedFactory(obj, options.factory);
	    }
	    factory = kb.utils.wrappedFactory(obj, new kb.Factory(options.factory));
	    if (options.factories) {
	      factory.addPathMappings(options.factories, owner_path);
	    }
	    return factory;
	  };

	  function Factory(parent_factory) {
	    this.paths = {};
	    if (parent_factory) {
	      this.parent_factory = parent_factory;
	    }
	  }

	  Factory.prototype.hasPath = function(path) {
	    var ref;
	    return this.paths.hasOwnProperty(path) || ((ref = this.parent_factory) != null ? ref.hasPath(path) : void 0);
	  };

	  Factory.prototype.addPathMapping = function(path, create_info) {
	    return this.paths[path] = create_info;
	  };

	  Factory.prototype.addPathMappings = function(factories, owner_path) {
	    var create_info, path;
	    for (path in factories) {
	      create_info = factories[path];
	      this.paths[kb.utils.pathJoin(owner_path, path)] = create_info;
	    }
	  };

	  Factory.prototype.hasPathMappings = function(factories, owner_path) {
	    var all_exist, creator, existing_creator, path;
	    all_exist = true;
	    for (path in factories) {
	      creator = factories[path];
	      all_exist &= (existing_creator = this.creatorForPath(null, kb.utils.pathJoin(owner_path, path))) && (creator === existing_creator);
	    }
	    return all_exist;
	  };

	  Factory.prototype.creatorForPath = function(obj, path) {
	    var creator, ref;
	    if (creator = this.paths[path]) {
	      return (creator.view_model ? creator.view_model : creator);
	    }
	    if (creator = (ref = this.parent_factory) != null ? ref.creatorForPath(obj, path) : void 0) {
	      return creator;
	    }
	    return null;
	  };

	  return Factory;

	})();


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {
	/*
	  knockback.js 1.0.0
	  Copyright (c)  2011-2014 Kevin Malakoff.
	  License: MIT (http://www.opensource.org/licenses/mit-license.php)
	  Source: https://github.com/kmalakoff/knockback
	  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
	  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
	 */
	var $, _, _ko_applyBindings, kb, ko, onReady, ref, window;

	window = window != null ? window : global;

	ref = kb = __webpack_require__(2), _ = ref._, ko = ref.ko, $ = ref.$;

	kb.RECUSIVE_AUTO_INJECT = true;

	ko.bindingHandlers['inject'] = {
	  'init': function(element, value_accessor, all_bindings_accessor, view_model) {
	    return kb.Inject.inject(ko.utils.unwrapObservable(value_accessor()), view_model, element, value_accessor, all_bindings_accessor);
	  }
	};

	kb.Inject = (function() {
	  function Inject() {}

	  Inject.inject = function(data, view_model, element, value_accessor, all_bindings_accessor, nested) {
	    var inject;
	    inject = function(data) {
	      var key, target, value;
	      if (_.isFunction(data)) {
	        view_model = new data(view_model, element, value_accessor, all_bindings_accessor);
	        kb.releaseOnNodeRemove(view_model, element);
	      } else {
	        if (data.view_model) {
	          view_model = new data.view_model(view_model, element, value_accessor, all_bindings_accessor);
	          kb.releaseOnNodeRemove(view_model, element);
	        }
	        for (key in data) {
	          value = data[key];
	          if (key === 'view_model') {
	            continue;
	          }
	          if (key === 'create') {
	            value(view_model, element, value_accessor, all_bindings_accessor);
	          } else if (_.isObject(value) && !_.isFunction(value)) {
	            target = nested || (value && value.create) ? {} : view_model;
	            view_model[key] = kb.Inject.inject(value, target, element, value_accessor, all_bindings_accessor, true);
	          } else {
	            view_model[key] = value;
	          }
	        }
	      }
	      return view_model;
	    };
	    if (nested) {
	      return inject(data);
	    } else {
	      return kb.ignore(function() {
	        return inject(data);
	      });
	    }
	  };

	  Inject.injectViewModels = function(root) {
	    var afterBinding, app, beforeBinding, data, expression, findElements, i, len, options, results;
	    results = [];
	    findElements = function(el) {
	      var attr, child_el, i, len, ref1;
	      if (!el.__kb_injected) {
	        if (el.attributes && (attr = _.find(el.attributes, function(attr) {
	          return attr.name === 'kb-inject';
	        }))) {
	          el.__kb_injected = true;
	          results.push({
	            el: el,
	            view_model: {},
	            binding: attr.value
	          });
	        }
	      }
	      ref1 = el.childNodes;
	      for (i = 0, len = ref1.length; i < len; i++) {
	        child_el = ref1[i];
	        findElements(child_el);
	      }
	    };
	    if (!root && (window != null ? window.document : void 0)) {
	      root = window.document;
	    }
	    findElements(root);
	    for (i = 0, len = results.length; i < len; i++) {
	      app = results[i];
	      if (expression = app.binding) {
	        (expression.search(/[:]/) < 0) || (expression = "{" + expression + "}");
	        data = (new Function("", "return ( " + expression + " )"))();
	        data || (data = {});
	        (!data.options) || (options = data.options, delete data.options);
	        options || (options = {});
	        app.view_model = kb.Inject.inject(data, app.view_model, app.el, null, null, true);
	        afterBinding = app.view_model.afterBinding || options.afterBinding;
	        beforeBinding = app.view_model.beforeBinding || options.beforeBinding;
	      }
	      if (beforeBinding) {
	        beforeBinding.call(app.view_model, app.view_model, app.el, options);
	      }
	      kb.applyBindings(app.view_model, app.el, options);
	      if (afterBinding) {
	        afterBinding.call(app.view_model, app.view_model, app.el, options);
	      }
	    }
	    return results;
	  };

	  return Inject;

	})();

	_ko_applyBindings = ko.applyBindings;

	ko.applyBindings = function(context, element) {
	  var results;
	  results = kb.RECUSIVE_AUTO_INJECT ? kb.injectViewModels(element) : [];
	  if (!results.length) {
	    return _ko_applyBindings.apply(this, arguments);
	  }
	};

	kb.injectViewModels = kb.Inject.injectViewModels;

	if (typeof document !== "undefined" && document !== null) {
	  if ($) {
	    $(function() {
	      return kb.injectViewModels();
	    });
	  } else {
	    (onReady = function() {
	      if (document.readyState !== 'complete') {
	        return setTimeout(onReady, 0);
	      }
	      return kb.injectViewModels();
	    })();
	  }
	}

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	
	/*
	  knockback.js 1.0.0
	  Copyright (c)  2011-2014 Kevin Malakoff.
	  License: MIT (http://www.opensource.org/licenses/mit-license.php)
	  Source: https://github.com/kmalakoff/knockback
	  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
	  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
	 */
	var _extend, kb, ko, ref, ref1;

	ko = (kb = __webpack_require__(2)).ko;

	if ((ref = ko.subscribable) != null ? (ref1 = ref.fn) != null ? ref1.extend : void 0 : void 0) {
	  _extend = ko.subscribable.fn.extend;
	  ko.subscribable.fn.extend = function() {
	    var _dispose, target;
	    target = _extend.apply(this, arguments);
	    if (target !== this && kb.isReleaseable(this)) {
	      _dispose = target.dispose;
	      target.dispose = (function(_this) {
	        return function() {
	          if (_dispose != null) {
	            _dispose.apply(target, arguments);
	          }
	          return kb.release(_this);
	        };
	      })(this);
	    }
	    return target;
	  };
	}


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	
	/*
	  knockback.js 1.0.0
	  Copyright (c)  2011-2014 Kevin Malakoff.
	  License: MIT (http://www.opensource.org/licenses/mit-license.php)
	  Source: https://github.com/kmalakoff/knockback
	  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
	  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
	 */
	var KEYS_INFO, KEYS_PUBLISH, TypedValue, _, kb, ko, ref;

	ref = kb = __webpack_require__(2), _ = ref._, ko = ref.ko;

	TypedValue = __webpack_require__(17);

	KEYS_PUBLISH = ['value', 'valueType', 'destroy'];

	KEYS_INFO = ['args', 'read', 'write'];

	kb.Observable = (function() {
	  function Observable(model, key_or_info, options, _vm) {
	    this._vm = _vm != null ? _vm : {};
	    return kb.ignore((function(_this) {
	      return function() {
	        var create_options, event_watcher, i, key, len, observable;
	        key_or_info || kb._throwMissing(_this, 'key_or_info');
	        _this.key = key_or_info.key || key_or_info;
	        for (i = 0, len = KEYS_INFO.length; i < len; i++) {
	          key = KEYS_INFO[i];
	          if (key_or_info[key]) {
	            _this[key] = key_or_info[key];
	          }
	        }
	        create_options = kb.utils.collapseOptions(options);
	        event_watcher = create_options.event_watcher;
	        delete create_options.event_watcher;
	        _this._value = new TypedValue(create_options);
	        _this._model = ko.observable();
	        observable = kb.utils.wrappedObservable(_this, ko.computed({
	          read: function() {
	            var _model, arg, args, j, len1, ref1, ref2;
	            _model = _this._model();
	            ref1 = args = [_this.key].concat(_this.args || []);
	            for (j = 0, len1 = ref1.length; j < len1; j++) {
	              arg = ref1[j];
	              ko.utils.unwrapObservable(arg);
	            }
	            if ((ref2 = kb.utils.wrappedEventWatcher(_this)) != null) {
	              ref2.emitter(_model || null);
	            }
	            if (_this.read) {
	              _this.update(_this.read.apply(_this._vm, args));
	            } else if (!_.isUndefined(_model)) {
	              kb.ignore(function() {
	                return _this.update(kb.getValue(_model, kb.peek(_this.key), _this.args));
	              });
	            }
	            return _this._value.value();
	          },
	          write: function(new_value) {
	            return kb.ignore(function() {
	              var _model, unwrapped_new_value;
	              unwrapped_new_value = kb.utils.unwrapModels(new_value);
	              _model = kb.peek(_this._model);
	              if (_this.write) {
	                _this.write.call(_this._vm, unwrapped_new_value);
	                new_value = kb.getValue(_model, kb.peek(_this.key), _this.args);
	              } else if (_model) {
	                kb.setValue(_model, kb.peek(_this.key), unwrapped_new_value);
	              }
	              return _this.update(new_value);
	            });
	          },
	          owner: _this._vm
	        }));
	        observable.__kb_is_o = true;
	        create_options.store = kb.utils.wrappedStore(observable, create_options.store);
	        create_options.path = kb.utils.pathJoin(create_options.path, _this.key);
	        if (create_options.factories && ((typeof create_options.factories === 'function') || create_options.factories.create)) {
	          create_options.factory = kb.utils.wrappedFactory(observable, new kb.Factory(create_options.factory));
	          create_options.factory.addPathMapping(create_options.path, create_options.factories);
	        } else {
	          create_options.factory = kb.Factory.useOptionsOrCreate(create_options, observable, create_options.path);
	        }
	        delete create_options.factories;
	        kb.publishMethods(observable, _this, KEYS_PUBLISH);
	        observable.model = _this.model = ko.computed({
	          read: function() {
	            return ko.utils.unwrapObservable(_this._model);
	          },
	          write: function(new_model) {
	            return kb.ignore(function() {
	              var new_value;
	              if (_this.__kb_released || (kb.peek(_this._model) === new_model)) {
	                return;
	              }
	              new_value = kb.getValue(new_model, kb.peek(_this.key), _this.args);
	              _this._model(new_model);
	              if (!new_model) {
	                return _this.update(null);
	              } else if (!_.isUndefined(new_value)) {
	                return _this.update(new_value);
	              }
	            });
	          }
	        });
	        kb.EventWatcher.useOptionsOrCreate({
	          event_watcher: event_watcher
	        }, model || null, _this, {
	          emitter: _this.model,
	          update: (function() {
	            return kb.ignore(function() {
	              return _this.update();
	            });
	          }),
	          key: _this.key,
	          path: create_options.path
	        });
	        _this._value.rawValue() || _this._value.update();
	        if (kb.LocalizedObservable && key_or_info.localizer) {
	          observable = new key_or_info.localizer(observable);
	        }
	        if (kb.DefaultObservable && key_or_info.hasOwnProperty('default')) {
	          observable = kb.defaultObservable(observable, key_or_info["default"]);
	        }
	        return observable;
	      };
	    })(this));
	  }

	  Observable.prototype.destroy = function() {
	    var observable;
	    observable = kb.utils.wrappedObservable(this);
	    this.__kb_released = true;
	    this._value.destroy();
	    this._value = null;
	    this.model.dispose();
	    this.model = observable.model = null;
	    return kb.utils.wrappedDestroy(this);
	  };

	  Observable.prototype.value = function() {
	    return this._value.rawValue();
	  };

	  Observable.prototype.valueType = function() {
	    return this._value.valueType(kb.peek(this._model), kb.peek(this.key));
	  };

	  Observable.prototype.update = function(new_value) {
	    if (this.__kb_released) {
	      return;
	    }
	    if (!arguments.length) {
	      new_value = kb.getValue(kb.peek(this._model), kb.peek(this.key));
	    }
	    return this._value.update(new_value);
	  };

	  return Observable;

	})();

	kb.observable = function(model, key, options, view_model) {
	  return new kb.Observable(model, key, options, view_model);
	};


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var TypedValue, _, kb, ko, ref;

	ref = kb = __webpack_require__(2), _ = ref._, ko = ref.ko;

	module.exports = TypedValue = (function() {
	  function TypedValue(create_options1) {
	    this.create_options = create_options1;
	    this._vo = ko.observable(null);
	  }

	  TypedValue.prototype.destroy = function() {
	    var previous_value;
	    this.__kb_released = true;
	    if (previous_value = this.__kb_value) {
	      this.__kb_value = null;
	      if (this.create_options.store && kb.utils.wrappedCreator(previous_value)) {
	        this.create_options.store.release(previous_value);
	      } else {
	        kb.release(previous_value);
	      }
	    }
	    return this.create_options = null;
	  };

	  TypedValue.prototype.value = function() {
	    return ko.utils.unwrapObservable(this._vo());
	  };

	  TypedValue.prototype.rawValue = function() {
	    return this.__kb_value;
	  };

	  TypedValue.prototype.valueType = function(model, key) {
	    var new_value;
	    new_value = kb.getValue(model, key);
	    this.value_type || this._updateValueObservable(new_value);
	    return this.value_type;
	  };

	  TypedValue.prototype.update = function(new_value) {
	    var new_type, ref1, value;
	    if (this.__kb_released) {
	      return;
	    }
	    (new_value !== void 0) || (new_value = null);
	    new_type = kb.utils.valueType(new_value);
	    if ((ref1 = this.__kb_value) != null ? ref1.__kb_released : void 0) {
	      this.__kb_value = this.value_type = void 0;
	    }
	    value = this.__kb_value;
	    switch (this.value_type) {
	      case kb.TYPE_COLLECTION:
	        if (this.value_type === kb.TYPE_COLLECTION && new_type === kb.TYPE_ARRAY) {
	          return value(new_value);
	        }
	        if (new_type === kb.TYPE_COLLECTION || _.isNull(new_value)) {
	          if (new_value && new_value instanceof kb.CollectionObservable) {
	            this._updateValueObservable(kb.utils.wrappedObject(new_value), new_value);
	          } else {
	            if (kb.peek(value.collection) !== new_value) {
	              value.collection(new_value);
	            }
	          }
	          return;
	        }
	        break;
	      case kb.TYPE_MODEL:
	        if (new_type === kb.TYPE_MODEL || _.isNull(new_value)) {
	          if (new_value && !kb.isModel(new_value)) {
	            this._updateValueObservable(kb.utils.wrappedObject(new_value), new_value);
	          } else {
	            if (kb.utils.wrappedObject(value) !== kb.utils.resolveModel(new_value)) {
	              this._updateValueObservable(new_value);
	            }
	          }
	          return;
	        }
	    }
	    if (this.value_type === new_type && !_.isUndefined(this.value_type)) {
	      if (kb.peek(value) !== new_value) {
	        return value(new_value);
	      }
	    } else {
	      if (kb.peek(value) !== new_value) {
	        return this._updateValueObservable(new_value);
	      }
	    }
	  };

	  TypedValue.prototype._updateValueObservable = function(new_value, new_observable) {
	    var create_options, creator, previous_value, ref1, value, value_type;
	    create_options = this.create_options;
	    creator = kb.utils.inferCreator(new_value, create_options.factory, create_options.path);
	    if ((new_value === null) && !creator) {
	      if (this.value_type === kb.TYPE_MODEL) {
	        creator = kb.ViewModel;
	      } else if (this.value_type === kb.TYPE_COLLECTION) {
	        creator = kb.CollectionObservable;
	      }
	    }
	    create_options.creator = creator;
	    value_type = kb.TYPE_UNKNOWN;
	    ref1 = [this.__kb_value, void 0], previous_value = ref1[0], this.__kb_value = ref1[1];
	    if (new_observable) {
	      value = new_observable;
	      if (create_options.store) {
	        create_options.store.retain(new_observable, new_value, creator);
	      }
	    } else if (creator) {
	      if (create_options.store) {
	        value = create_options.store.retainOrCreate(new_value, create_options);
	      } else {
	        if (creator.models_only) {
	          value = new_value;
	          value_type = kb.TYPE_SIMPLE;
	        } else if (creator.create) {
	          value = creator.create(new_value, create_options);
	        } else {
	          value = new creator(new_value, create_options);
	        }
	      }
	    } else {
	      if (_.isArray(new_value)) {
	        value_type = kb.TYPE_ARRAY;
	        value = ko.observableArray(new_value);
	      } else {
	        value_type = kb.TYPE_SIMPLE;
	        value = ko.observable(new_value);
	      }
	    }
	    if ((this.value_type = value_type) === kb.TYPE_UNKNOWN) {
	      if (!ko.isObservable(value)) {
	        this.value_type = kb.TYPE_MODEL;
	        kb.utils.wrappedObject(value, kb.utils.resolveModel(new_value));
	      } else if (value.__kb_is_co) {
	        this.value_type = kb.TYPE_COLLECTION;
	        kb.utils.wrappedObject(value, new_value);
	      } else if (!this.value_type) {
	        this.value_type = kb.TYPE_SIMPLE;
	      }
	    }
	    if (previous_value) {
	      if (this.create_options.store) {
	        this.create_options.store.release(previous_value);
	      } else {
	        kb.release(previous_value);
	      }
	    }
	    this.__kb_value = value;
	    return this._vo(value);
	  };

	  TypedValue.prototype._inferType = function(value) {};

	  return TypedValue;

	})();


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	
	/*
	  knockback.js 1.0.0
	  Copyright (c)  2011-2014 Kevin Malakoff.
	  License: MIT (http://www.opensource.org/licenses/mit-license.php)
	  Source: https://github.com/kmalakoff/knockback
	  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
	  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
	 */
	var _, kb;

	_ = (kb = __webpack_require__(2))._;

	module.exports = kb.Statistics = (function() {
	  function Statistics() {
	    this.model_events_tracker = [];
	    this.registered_tracker = {};
	  }

	  Statistics.prototype.clear = function() {
	    return this.model_events_tracker = [];
	  };

	  Statistics.prototype.addModelEvent = function(event) {
	    return this.model_events_tracker.push(event);
	  };

	  Statistics.prototype.modelEventsStatsString = function() {
	    var event_groups, key, stats_string, value;
	    stats_string = '';
	    stats_string += "Total Count: " + this.model_events_tracker.length;
	    event_groups = _.groupBy(this.model_events_tracker, function(test) {
	      return "event name: '" + test.name + "', attribute name: '" + test.key + "'";
	    });
	    for (key in event_groups) {
	      value = event_groups[key];
	      stats_string += "\n " + key + ", count: " + value.length;
	    }
	    return stats_string;
	  };

	  Statistics.prototype.register = function(key, obj) {
	    return this.registeredTracker(key).push(obj);
	  };

	  Statistics.prototype.unregister = function(key, obj) {
	    var index, type_tracker;
	    type_tracker = this.registeredTracker(key);
	    if ((index = _.indexOf(type_tracker, obj)) < 0) {
	      return typeof console !== "undefined" && console !== null ? console.log("kb.Statistics: failed to unregister type: " + key) : void 0;
	    }
	    return type_tracker.splice(index, 1);
	  };

	  Statistics.prototype.registeredCount = function(type) {
	    var count, ref, type_tracker;
	    if (type) {
	      return this.registeredTracker(type).length;
	    }
	    count = 0;
	    ref = this.registered_tracker[type];
	    for (type in ref) {
	      type_tracker = ref[type];
	      count += type_tracker.length;
	    }
	    return count;
	  };

	  Statistics.prototype.registeredStatsString = function(success_message) {
	    var ref, stats_string, type, type_tracker, written;
	    stats_string = '';
	    ref = this.registered_tracker;
	    for (type in ref) {
	      type_tracker = ref[type];
	      if (!type_tracker.length) {
	        continue;
	      }
	      if (written) {
	        stats_string += '\n ';
	      }
	      stats_string += (type ? type : 'No Name') + ": " + type_tracker.length;
	      written = true;
	    }
	    if (stats_string) {
	      return stats_string;
	    } else {
	      return success_message;
	    }
	  };

	  Statistics.prototype.registeredTracker = function(key) {
	    var type_tracker;
	    if (this.registered_tracker.hasOwnProperty(key)) {
	      return this.registered_tracker[key];
	    }
	    type_tracker = [];
	    this.registered_tracker[key] = type_tracker;
	    return type_tracker;
	  };

	  Statistics.eventsStats = function(obj, key) {
	    var events, i, len, node, ref, stats, tail;
	    stats = {
	      count: 0
	    };
	    events = obj._events || obj._callbacks || {};
	    ref = (key ? [key] : _.keys(events));
	    for (i = 0, len = ref.length; i < len; i++) {
	      key = ref[i];
	      if (!(node = events[key])) {
	        continue;
	      }
	      if (_.isArray(node)) {
	        stats[key] = _.compact(node).length;
	      } else {
	        stats[key] = 0;
	        tail = node.tail;
	        while ((node = node.next) !== tail) {
	          stats[key]++;
	        }
	      }
	      stats.count += stats[key];
	    }
	    return stats;
	  };

	  return Statistics;

	})();


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	
	/*
	  knockback.js 1.0.0
	  Copyright (c)  2011-2014 Kevin Malakoff.
	  License: MIT (http://www.opensource.org/licenses/mit-license.php)
	  Source: https://github.com/kmalakoff/knockback
	  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
	  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
	 */
	var _, kb, ko, ref;

	ref = kb = __webpack_require__(2), _ = ref._, ko = ref.ko;

	module.exports = kb.Store = (function() {
	  Store.instances = [];

	  Store.useOptionsOrCreate = function(options, obj, observable) {
	    var store;
	    if (!options.store) {
	      kb.utils.wrappedStoreIsOwned(observable, true);
	    }
	    store = kb.utils.wrappedStore(observable, options.store || new kb.Store());
	    store.retain(observable, obj, options.creator);
	    return store;
	  };

	  function Store() {
	    this.observable_records = {};
	    this.replaced_observables = [];
	    kb.Store.instances.push(this);
	  }

	  Store.prototype.destroy = function() {
	    var index;
	    this.__kb_released = true;
	    this.clear();
	    if ((index = _.indexOf(kb.Store.instances, this)) >= 0) {
	      return kb.Store.instances.splice(index, 1);
	    }
	  };

	  Store.prototype.clear = function() {
	    var cid, creator_id, i, len, observable, observable_records, records, ref1, ref2, replaced_observables;
	    ref1 = [this.observable_records, {}], observable_records = ref1[0], this.observable_records = ref1[1];
	    for (creator_id in observable_records) {
	      records = observable_records[creator_id];
	      for (cid in records) {
	        observable = records[cid];
	        this.release(observable, true);
	      }
	    }
	    ref2 = [this.replaced_observables, []], replaced_observables = ref2[0], this.replaced_observables = ref2[1];
	    for (i = 0, len = replaced_observables.length; i < len; i++) {
	      observable = replaced_observables[i];
	      if (!observable.__kb_released) {
	        this.release(observable, true);
	      }
	    }
	  };

	  Store.prototype.compact = function() {
	    var cid, creator_id, observable, records, ref1;
	    ref1 = this.observable_records;
	    for (creator_id in ref1) {
	      records = ref1[creator_id];
	      for (cid in records) {
	        observable = records[cid];
	        if (observable.__kb_released) {
	          delete records[cid];
	        }
	      }
	    }
	  };

	  Store.prototype.retain = function(observable, obj, creator) {
	    var current_observable;
	    if (!this._canRegister(observable)) {
	      return;
	    }
	    creator || (creator = observable.constructor);
	    if (current_observable = this.find(obj, creator)) {
	      if (current_observable === observable) {
	        this._getOrCreateStoreReferences(observable).ref_count++;
	        return observable;
	      }
	      this._retire(current_observable);
	    }
	    this._add(observable, obj, creator);
	    this._getOrCreateStoreReferences(observable).ref_count++;
	    return observable;
	  };

	  Store.prototype.retainOrCreate = function(obj, options) {
	    var creator, observable;
	    if (!(creator = this._creator(obj, options))) {
	      return kb.utils.createFromDefaultCreator(obj, options);
	    }
	    if (creator.models_only) {
	      return obj;
	    }
	    if (observable = this.find(obj, creator)) {
	      return observable;
	    }
	    if (!_.isFunction(creator.create || creator)) {
	      throw new Error("Invalid factory for \"" + options.path + "\"");
	    }
	    observable = kb.ignore((function(_this) {
	      return function() {
	        options = _.defaults({
	          store: _this,
	          creator: creator
	        }, options);
	        observable = creator.create ? creator.create(obj, options) : new creator(obj, options);
	        return observable || ko.observable(null);
	      };
	    })(this));
	    this.retain(observable, obj, creator);
	    return observable;
	  };

	  Store.prototype.reuse = function(observable, obj) {
	    var creator, current_obj, current_observable;
	    if ((current_obj = kb.utils.wrappedObject(observable)) === obj) {
	      return;
	    }
	    if (!this._canRegister(observable)) {
	      throw new Error('Cannot reuse a simple observable');
	    }
	    if (this._refCount(observable) !== 1) {
	      throw new Error("Trying to change a shared view model. Ref count: " + (this._refCount(observable)));
	    }
	    creator = kb.utils.wrappedCreator(observable) || observable.constructor;
	    if (!_.isUndefined(current_obj)) {
	      current_observable = this.find(current_obj, creator);
	    }
	    this.retain(observable, obj, creator);
	    if (current_observable) {
	      this.release(current_observable);
	    }
	  };

	  Store.prototype.release = function(observable, force) {
	    var store_references;
	    if (!this._canRegister(observable)) {
	      return kb.release(observable);
	    }
	    if (store_references = this._storeReferences(observable)) {
	      if (!force && --store_references.ref_count > 0) {
	        return;
	      }
	      this._clearStoreReferences(observable);
	    }
	    this._remove(observable);
	    if (observable.__kb_released) {
	      return;
	    }
	    if (force || this._refCount(observable) <= 1) {
	      return kb.release(observable);
	    }
	  };

	  Store.prototype.find = function(obj, creator) {
	    var observable, records, ref1;
	    if (!(records = this.observable_records[this._creatorId(creator)])) {
	      return null;
	    }
	    if ((ref1 = (observable = records[this._cid(obj)])) != null ? ref1.__kb_released : void 0) {
	      delete records[this._cid(obj)];
	      return null;
	    }
	    return observable;
	  };

	  Store.prototype._refCount = function(observable) {
	    var stores_references;
	    if (observable.__kb_released) {
	      if (typeof console !== "undefined" && console !== null) {
	        console.log('Observable already released');
	      }
	      return 0;
	    }
	    if (!(stores_references = kb.utils.get(observable, 'stores_references'))) {
	      return 1;
	    }
	    return _.reduce(stores_references, (function(memo, store_references) {
	      return memo + store_references.ref_count;
	    }), 0);
	  };

	  Store.prototype._canRegister = function(observable) {
	    return observable && !ko.isObservable(observable) && !observable.__kb_is_co;
	  };

	  Store.prototype._cid = function(obj) {
	    var cid;
	    return cid = obj ? obj.cid || (obj.cid = _.uniqueId('c')) : 'null';
	  };

	  Store.prototype._creatorId = function(creator) {
	    var create, i, item, len, ref1;
	    create = creator.create || creator;
	    create.__kb_cids || (create.__kb_cids = []);
	    ref1 = create.__kb_cids;
	    for (i = 0, len = ref1.length; i < len; i++) {
	      item = ref1[i];
	      if (item.create === create) {
	        return item.cid;
	      }
	    }
	    create.__kb_cids.push(item = {
	      create: create,
	      cid: _.uniqueId('kb')
	    });
	    return item.cid;
	  };

	  Store.prototype._storeReferences = function(observable) {
	    var stores_references;
	    if (!(stores_references = kb.utils.get(observable, 'stores_references'))) {
	      return;
	    }
	    return _.find(stores_references, (function(_this) {
	      return function(store_references) {
	        return store_references.store === _this;
	      };
	    })(this));
	  };

	  Store.prototype._getOrCreateStoreReferences = function(observable) {
	    var store_references, stores_references;
	    stores_references = kb.utils.orSet(observable, 'stores_references', []);
	    if (!(store_references = _.find(stores_references, (function(_this) {
	      return function(store_references) {
	        return store_references.store === _this;
	      };
	    })(this)))) {
	      stores_references.push(store_references = {
	        store: this,
	        ref_count: 0,
	        release: (function(_this) {
	          return function() {
	            return _this.release(observable);
	          };
	        })(this)
	      });
	    }
	    return store_references;
	  };

	  Store.prototype._clearStoreReferences = function(observable) {
	    var index, ref1, store_references, stores_references;
	    if (stores_references = kb.utils.get(observable, 'stores_references')) {
	      ref1 = observable.__kb.stores_references;
	      for (index in ref1) {
	        store_references = ref1[index];
	        if (store_references.store === this) {
	          observable.__kb.stores_references.splice(index, 1);
	          break;
	        }
	      }
	    }
	  };

	  Store.prototype._retire = function(observable) {
	    this._clearStoreReferences(observable);
	    this.replaced_observables.push(observable);
	    return this._remove(observable);
	  };

	  Store.prototype._add = function(observable, obj, creator) {
	    var base, name;
	    creator || (creator = observable.constructor);
	    kb.utils.wrappedObject(observable, obj);
	    kb.utils.wrappedCreator(observable, creator);
	    return ((base = this.observable_records)[name = this._creatorId(creator)] || (base[name] = {}))[this._cid(obj)] = observable;
	  };

	  Store.prototype._remove = function(observable) {
	    var creator, current_observable, obj;
	    creator = kb.utils.wrappedCreator(observable) || observable.constructor;
	    if (current_observable = this.find(obj = kb.utils.wrappedObject(observable), creator)) {
	      if (current_observable === observable) {
	        delete this.observable_records[this._creatorId(creator)][this._cid(obj)];
	      }
	    }
	    kb.utils.wrappedObject(observable, null);
	    return kb.utils.wrappedCreator(observable, null);
	  };

	  Store.prototype._creator = function(obj, options) {
	    var creator;
	    if (options.creator) {
	      return options.creator;
	    }
	    if (creator = kb.utils.inferCreator(obj, options.factory, options.path)) {
	      return creator;
	    }
	    if (kb.isModel(obj)) {
	      return kb.ViewModel;
	    }
	  };

	  return Store;

	})();


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	
	/*
	  knockback.js 1.0.0
	  Copyright (c)  2011-2014 Kevin Malakoff.
	  License: MIT (http://www.opensource.org/licenses/mit-license.php)
	  Source: https://github.com/kmalakoff/knockback
	  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
	  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
	 */
	var _, kb, ko, ref;

	ref = kb = __webpack_require__(2), _ = ref._, ko = ref.ko;

	kb.utils = (function() {
	  function utils() {}

	  utils.get = function(obj, key, default_value) {
	    if (!obj.__kb || !obj.__kb.hasOwnProperty(key)) {
	      return default_value;
	    } else {
	      return obj.__kb[key];
	    }
	  };

	  utils.set = function(obj, key, value) {
	    return (obj.__kb || (obj.__kb = {}))[key] = value;
	  };

	  utils.orSet = function(obj, key, value) {
	    if (!(obj.__kb || (obj.__kb = {})).hasOwnProperty(key)) {
	      obj.__kb[key] = value;
	    }
	    return obj.__kb[key];
	  };

	  utils.has = function(obj, key) {
	    return obj.__kb && obj.__kb.hasOwnProperty(key);
	  };

	  utils.wrappedObservable = function(obj, value) {
	    if (arguments.length === 1) {
	      return kb.utils.get(obj, 'observable');
	    } else {
	      return kb.utils.set(obj, 'observable', value);
	    }
	  };

	  utils.wrappedObject = function(obj, value) {
	    if (arguments.length === 1) {
	      return kb.utils.get(obj, 'object');
	    } else {
	      return kb.utils.set(obj, 'object', value);
	    }
	  };

	  utils.wrappedCreator = function(obj, value) {
	    if (arguments.length === 1) {
	      return kb.utils.get(obj, 'creator');
	    } else {
	      return kb.utils.set(obj, 'creator', value);
	    }
	  };

	  utils.wrappedModel = function(obj, value) {
	    if (arguments.length === 1) {
	      if (_.isUndefined(value = kb.utils.get(obj, 'object'))) {
	        return obj;
	      } else {
	        return value;
	      }
	    } else {
	      return kb.utils.set(obj, 'object', value);
	    }
	  };

	  utils.wrappedStore = function(obj, value) {
	    if (arguments.length === 1) {
	      return kb.utils.get(obj, 'store');
	    } else {
	      return kb.utils.set(obj, 'store', value);
	    }
	  };

	  utils.wrappedStoreIsOwned = function(obj, value) {
	    if (arguments.length === 1) {
	      return kb.utils.get(obj, 'store_is_owned');
	    } else {
	      return kb.utils.set(obj, 'store_is_owned', value);
	    }
	  };

	  utils.wrappedFactory = function(obj, value) {
	    if (arguments.length === 1) {
	      return kb.utils.get(obj, 'factory');
	    } else {
	      return kb.utils.set(obj, 'factory', value);
	    }
	  };

	  utils.wrappedEventWatcher = function(obj, value) {
	    if (arguments.length === 1) {
	      return kb.utils.get(obj, 'event_watcher');
	    } else {
	      return kb.utils.set(obj, 'event_watcher', value);
	    }
	  };

	  utils.wrappedEventWatcherIsOwned = function(obj, value) {
	    if (arguments.length === 1) {
	      return kb.utils.get(obj, 'event_watcher_is_owned');
	    } else {
	      return kb.utils.set(obj, 'event_watcher_is_owned', value);
	    }
	  };

	  utils.wrappedDestroy = __webpack_require__(21);

	  utils.valueType = function(observable) {
	    if (!observable) {
	      return kb.TYPE_UNKNOWN;
	    }
	    if (observable.__kb_is_o) {
	      return observable.valueType();
	    }
	    if (observable.__kb_is_co || (observable instanceof kb.Collection)) {
	      return kb.TYPE_COLLECTION;
	    }
	    if ((observable instanceof kb.ViewModel) || (observable instanceof kb.Model)) {
	      return kb.TYPE_MODEL;
	    }
	    if (_.isArray(observable)) {
	      return kb.TYPE_ARRAY;
	    }
	    return kb.TYPE_SIMPLE;
	  };

	  utils.pathJoin = function(path1, path2) {
	    return (path1 ? (path1[path1.length - 1] !== '.' ? path1 + "." : path1) : '') + path2;
	  };

	  utils.optionsPathJoin = function(options, path) {
	    return _.defaults({
	      path: this.pathJoin(options.path, path)
	    }, options);
	  };

	  utils.inferCreator = function(value, factory, path) {
	    var creator;
	    if (factory && (creator = factory.creatorForPath(value, path))) {
	      return creator;
	    }
	    if (!value) {
	      return null;
	    }
	    if (value instanceof kb.Model) {
	      return kb.ViewModel;
	    }
	    if (value instanceof kb.Collection) {
	      return kb.CollectionObservable;
	    }
	    return null;
	  };

	  utils.createFromDefaultCreator = function(obj, options) {
	    if (kb.isModel(obj)) {
	      return kb.viewModel(obj, options);
	    }
	    if (kb.isCollection(obj)) {
	      return kb.collectionObservable(obj, options);
	    }
	    if (_.isArray(obj)) {
	      return ko.observableArray(obj);
	    }
	    return ko.observable(obj);
	  };

	  utils.collapseOptions = __webpack_require__(22);

	  utils.unwrapModels = __webpack_require__(23);

	  utils.resolveModel = function(model) {
	    if (model && kb.Backbone && kb.Backbone.ModelRef && model instanceof kb.Backbone.ModelRef) {
	      return model.model();
	    } else {
	      return model;
	    }
	  };

	  return utils;

	})();


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	
	/*
	  knockback.js 1.0.0
	  Copyright (c)  2011-2014 Kevin Malakoff.
	  License: MIT (http://www.opensource.org/licenses/mit-license.php)
	  Source: https://github.com/kmalakoff/knockback
	  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
	  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
	 */
	var _, wrappedDestroy;

	_ = __webpack_require__(2)._;

	module.exports = wrappedDestroy = function(obj) {
	  var __kb, store_references;
	  if (!obj.__kb) {
	    return;
	  }
	  if (obj.__kb.event_watcher) {
	    obj.__kb.event_watcher.releaseCallbacks(obj);
	  }
	  __kb = obj.__kb;
	  obj.__kb = null;
	  if (__kb.observable) {
	    __kb.observable.destroy = __kb.observable.release = null;
	    wrappedDestroy(__kb.observable);
	    __kb.observable = null;
	  }
	  __kb.factory = null;
	  if (__kb.event_watcher_is_owned) {
	    __kb.event_watcher.destroy();
	  }
	  __kb.event_watcher = null;
	  if (__kb.store_is_owned) {
	    __kb.store.destroy();
	  }
	  __kb.store = null;
	  if (__kb.stores_references) {
	    while (store_references = __kb.stores_references.pop()) {
	      if (!store_references.store.__kb_released) {
	        store_references.store.release(obj);
	      }
	    }
	  }
	};


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	
	/*
	  knockback.js 1.0.0
	  Copyright (c)  2011-2014 Kevin Malakoff.
	  License: MIT (http://www.opensource.org/licenses/mit-license.php)
	  Source: https://github.com/kmalakoff/knockback
	  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
	  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
	 */
	var _, _keyArrayToObject, _mergeArray, _mergeObject, _mergeOptions;

	_ = __webpack_require__(2)._;

	_mergeArray = function(result, key, value) {
	  result[key] || (result[key] = []);
	  if (!_.isArray(value)) {
	    value = [value];
	  }
	  result[key] = result[key].length ? _.union(result[key], value) : value;
	  return result;
	};

	_mergeObject = function(result, key, value) {
	  result[key] || (result[key] = {});
	  return _.extend(result[key], value);
	};

	_keyArrayToObject = function(value) {
	  var i, item, len, result;
	  result = {};
	  for (i = 0, len = value.length; i < len; i++) {
	    item = value[i];
	    result[item] = {
	      key: item
	    };
	  }
	  return result;
	};

	_mergeOptions = function(result, options) {
	  var key, value;
	  if (!options) {
	    return result;
	  }
	  for (key in options) {
	    value = options[key];
	    switch (key) {
	      case 'internals':
	      case 'requires':
	      case 'excludes':
	      case 'statics':
	        _mergeArray(result, key, value);
	        break;
	      case 'keys':
	        if ((_.isObject(value) && !_.isArray(value)) || (_.isObject(result[key]) && !_.isArray(result[key]))) {
	          if (!_.isObject(value)) {
	            value = [value];
	          }
	          if (_.isArray(value)) {
	            value = _keyArrayToObject(value);
	          }
	          if (_.isArray(result[key])) {
	            result[key] = _keyArrayToObject(result[key]);
	          }
	          _mergeObject(result, key, value);
	        } else {
	          _mergeArray(result, key, value);
	        }
	        break;
	      case 'factories':
	        if (_.isFunction(value)) {
	          result[key] = value;
	        } else {
	          _mergeObject(result, key, value);
	        }
	        break;
	      case 'static_defaults':
	        _mergeObject(result, key, value);
	        break;
	      case 'options':
	        break;
	      default:
	        result[key] = value;
	    }
	  }
	  return _mergeOptions(result, options.options);
	};

	module.exports = function(options) {
	  return _mergeOptions({}, options);
	};


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	
	/*
	  knockback.js 1.0.0
	  Copyright (c)  2011-2014 Kevin Malakoff.
	  License: MIT (http://www.opensource.org/licenses/mit-license.php)
	  Source: https://github.com/kmalakoff/knockback
	  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
	  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
	 */
	var _, unwrapModels;

	_ = __webpack_require__(2)._;

	module.exports = unwrapModels = function(obj) {
	  var key, result, value;
	  if (!obj) {
	    return obj;
	  }
	  if (obj.__kb) {
	    return (obj.__kb.hasOwnProperty('object') ? obj.__kb.object : obj);
	  }
	  if (_.isArray(obj)) {
	    return _.map(obj, function(test) {
	      return unwrapModels(test);
	    });
	  }
	  if (_.isObject(obj) && (obj.constructor === {}.constructor)) {
	    result = {};
	    for (key in obj) {
	      value = obj[key];
	      result[key] = unwrapModels(value);
	    }
	    return result;
	  }
	  return obj;
	};


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	
	/*
	  knockback.js 1.0.0
	  Copyright (c)  2011-2014 Kevin Malakoff.
	  License: MIT (http://www.opensource.org/licenses/mit-license.php)
	  Source: https://github.com/kmalakoff/knockback
	  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
	  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
	 */
	var KEYS_OPTIONS, _, assignViewModelKey, createObservable, createStaticObservables, kb, ko, ref;

	ref = kb = __webpack_require__(2), _ = ref._, ko = ref.ko;

	assignViewModelKey = function(vm, key) {
	  var vm_key;
	  vm_key = vm.__kb.internals && _.contains(vm.__kb.internals, key) ? "_" + key : key;
	  if (vm.__kb.view_model.hasOwnProperty(vm_key)) {
	    return;
	  }
	  vm.__kb.view_model[vm_key] = null;
	  return vm_key;
	};

	createObservable = function(vm, model, key, create_options) {
	  var vm_key;
	  if (vm.__kb.excludes && _.contains(vm.__kb.excludes, key)) {
	    return;
	  }
	  if (vm.__kb.statics && _.contains(vm.__kb.statics, key)) {
	    return;
	  }
	  if (!(vm_key = assignViewModelKey(vm, key))) {
	    return;
	  }
	  return vm[vm_key] = vm.__kb.view_model[vm_key] = kb.observable(model, key, create_options, vm);
	};

	createStaticObservables = function(vm, model) {
	  var i, key, len, ref1, vm_key;
	  ref1 = vm.__kb.statics;
	  for (i = 0, len = ref1.length; i < len; i++) {
	    key = ref1[i];
	    if (vm_key = assignViewModelKey(vm, key)) {
	      if (model.has(vm_key)) {
	        vm[vm_key] = vm.__kb.view_model[vm_key] = model.get(vm_key);
	      } else if (vm.__kb.static_defaults && vm_key in vm.__kb.static_defaults) {
	        vm[vm_key] = vm.__kb.view_model[vm_key] = vm.__kb.static_defaults[vm_key];
	      } else {
	        delete vm.__kb.view_model[vm_key];
	      }
	    }
	  }
	};

	KEYS_OPTIONS = ['keys', 'internals', 'excludes', 'statics', 'static_defaults'];

	kb.ViewModel = (function() {
	  ViewModel.extend = kb.extend;

	  function ViewModel(model, options, view_model) {
	    var args;
	    if (options == null) {
	      options = {};
	    }
	    args = Array.prototype.slice.call(_.isArguments(model) ? model : arguments);
	    return kb.ignore((function(_this) {
	      return function() {
	        var _model, arg, event_watcher, i, j, key, len, len1;
	        !(model = args.shift()) || kb.isModel(model) || kb._throwUnexpected(_this, 'not a model');
	        if (_.isArray(args[0])) {
	          args[0] = {
	            keys: args[0]
	          };
	        }
	        _this.__kb || (_this.__kb = {});
	        _this.__kb.view_model = (args.length > 1 ? args.pop() : _this);
	        options = {};
	        for (i = 0, len = args.length; i < len; i++) {
	          arg = args[i];
	          _.extend(options, arg);
	        }
	        options = kb.utils.collapseOptions(options);
	        for (j = 0, len1 = KEYS_OPTIONS.length; j < len1; j++) {
	          key = KEYS_OPTIONS[j];
	          if (options.hasOwnProperty(key)) {
	            _this.__kb[key] = options[key];
	          }
	        }
	        kb.Store.useOptionsOrCreate(options, model, _this);
	        _this.__kb.path = options.path;
	        kb.Factory.useOptionsOrCreate(options, _this, options.path);
	        _model = kb.utils.set(_this, '_model', ko.observable());
	        _this.model = ko.computed({
	          read: function() {
	            return ko.utils.unwrapObservable(_model);
	          },
	          write: function(new_model) {
	            return kb.ignore(function() {
	              if ((kb.utils.wrappedObject(_this) === new_model) || kb.wasReleased(_this) || !event_watcher) {
	                return;
	              }
	              _this.__kb.store.reuse(_this, kb.utils.resolveModel(new_model));
	              event_watcher.emitter(new_model);
	              _model(event_watcher.ee);
	              return !event_watcher.ee || _this.createObservables(event_watcher.ee);
	            });
	          }
	        });
	        event_watcher = kb.utils.wrappedEventWatcher(_this, new kb.EventWatcher(model, _this, {
	          emitter: _this._model,
	          update: (function() {
	            return kb.ignore(function() {
	              return !(event_watcher != null ? event_watcher.ee : void 0) || _this.createObservables(event_watcher != null ? event_watcher.ee : void 0);
	            });
	          })
	        }));
	        kb.utils.wrappedObject(_this, model = event_watcher.ee);
	        _model(event_watcher.ee);
	        _this.__kb.create_options = {
	          store: kb.utils.wrappedStore(_this),
	          factory: kb.utils.wrappedFactory(_this),
	          path: _this.__kb.path,
	          event_watcher: kb.utils.wrappedEventWatcher(_this)
	        };
	        !options.requires || _this.createObservables(model, options.requires);
	        !_this.__kb.internals || _this.createObservables(model, _this.__kb.internals);
	        !options.mappings || _this.createObservables(model, options.mappings);
	        !_this.__kb.statics || createStaticObservables(_this, model);
	        _this.createObservables(model, _this.__kb.keys);
	        !kb.statistics || kb.statistics.register('ViewModel', _this);
	        return _this;
	      };
	    })(this));
	  }

	  ViewModel.prototype.destroy = function() {
	    var vm_key;
	    this.__kb_released = true;
	    if (this.__kb.view_model !== this) {
	      for (vm_key in this.__kb.vm_keys) {
	        this.__kb.view_model[vm_key] = null;
	      }
	    }
	    this.__kb.view_model = this.__kb.create_options = null;
	    kb.releaseKeys(this);
	    kb.utils.wrappedDestroy(this);
	    return !kb.statistics || kb.statistics.unregister('ViewModel', this);
	  };

	  ViewModel.prototype.shareOptions = function() {
	    return {
	      store: kb.utils.wrappedStore(this),
	      factory: kb.utils.wrappedFactory(this)
	    };
	  };

	  ViewModel.prototype.createObservables = function(model, keys) {
	    var i, j, key, len, len1, mapping_info, ref1, rel_keys, vm_key;
	    if (!keys) {
	      if (this.__kb.keys || !model) {
	        return;
	      }
	      for (key in model.attributes) {
	        createObservable(this, model, key, this.__kb.create_options);
	      }
	      if (rel_keys = (ref1 = kb.orm) != null ? typeof ref1.keys === "function" ? ref1.keys(model) : void 0 : void 0) {
	        for (i = 0, len = rel_keys.length; i < len; i++) {
	          key = rel_keys[i];
	          createObservable(this, model, key, this.__kb.create_options);
	        }
	      }
	    } else if (_.isArray(keys)) {
	      for (j = 0, len1 = keys.length; j < len1; j++) {
	        key = keys[j];
	        createObservable(this, model, key, this.__kb.create_options);
	      }
	    } else {
	      for (key in keys) {
	        mapping_info = keys[key];
	        if (!(vm_key = assignViewModelKey(this, key))) {
	          continue;
	        }
	        if (!_.isString(mapping_info)) {
	          mapping_info.key || (mapping_info.key = vm_key);
	        }
	        this[vm_key] = this.__kb.view_model[vm_key] = kb.observable(model, mapping_info, this.__kb.create_options, this);
	      }
	    }
	  };

	  return ViewModel;

	})();

	kb.viewModel = function(model, options, view_model) {
	  return new kb.ViewModel(arguments);
	};


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	
	/*
	  knockback.js 1.0.0
	  Copyright (c)  2011-2014 Kevin Malakoff.
	  License: MIT (http://www.opensource.org/licenses/mit-license.php)
	  Source: https://github.com/kmalakoff/knockback
	  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
	  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
	 */
	var KEYS_PUBLISH, _, kb, ko, ref;

	ref = kb = __webpack_require__(2), _ = ref._, ko = ref.ko;

	__webpack_require__(26);

	KEYS_PUBLISH = ['destroy', 'setToDefault'];

	module.exports = kb.DefaultObservable = (function() {
	  function DefaultObservable(target_observable, dv) {
	    var observable;
	    this.dv = dv;
	    observable = kb.utils.wrappedObservable(this, ko.computed({
	      read: (function(_this) {
	        return function() {
	          var current_target;
	          current_target = ko.utils.unwrapObservable(target_observable());
	          if (_.isNull(current_target) || _.isUndefined(current_target)) {
	            return ko.utils.unwrapObservable(_this.dv);
	          } else {
	            return current_target;
	          }
	        };
	      })(this),
	      write: function(value) {
	        return target_observable(value);
	      }
	    }));
	    kb.publishMethods(observable, this, KEYS_PUBLISH);
	    return observable;
	  }

	  DefaultObservable.prototype.destroy = function() {
	    return kb.utils.wrappedDestroy(this);
	  };

	  DefaultObservable.prototype.setToDefault = function() {
	    return kb.utils.wrappedObservable(this)(this.dv);
	  };

	  return DefaultObservable;

	})();

	kb.defaultObservable = function(target, default_value) {
	  return new kb.DefaultObservable(target, default_value);
	};

	kb.observableDefault = kb.defaultObservable;


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	
	/*
	  knockback.js 1.0.0
	  Copyright (c)  2011-2014 Kevin Malakoff.
	  License: MIT (http://www.opensource.org/licenses/mit-license.php)
	  Source: https://github.com/kmalakoff/knockback
	  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
	  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
	 */
	var _, kb, ko, ref;

	ref = kb = __webpack_require__(2), _ = ref._, ko = ref.ko;

	kb.Observable.prototype.setToDefault = function() {
	  var ref1;
	  if ((ref1 = this.__kb_value) != null) {
	    if (typeof ref1.setToDefault === "function") {
	      ref1.setToDefault();
	    }
	  }
	};

	kb.ViewModel.prototype.setToDefault = function() {
	  var ref1, vm_key;
	  for (vm_key in this.__kb.vm_keys) {
	    if ((ref1 = this[vm_key]) != null) {
	      if (typeof ref1.setToDefault === "function") {
	        ref1.setToDefault();
	      }
	    }
	  }
	};

	kb.utils.setToDefault = function(obj) {
	  var key, value;
	  if (!obj) {
	    return;
	  }
	  if (ko.isObservable(obj)) {
	    if (typeof obj.setToDefault === "function") {
	      obj.setToDefault();
	    }
	  } else if (_.isObject(obj)) {
	    for (key in obj) {
	      value = obj[key];
	      if (value && (ko.isObservable(value) || (typeof value !== 'function')) && ((key[0] !== '_') || key.search('__kb'))) {
	        this.setToDefault(value);
	      }
	    }
	  }
	  return obj;
	};


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	
	/*
	  knockback.js 1.0.0
	  Copyright (c)  2011-2014 Kevin Malakoff.
	  License: MIT (http://www.opensource.org/licenses/mit-license.php)
	  Source: https://github.com/kmalakoff/knockback
	  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
	  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
	 */
	var _, arraySlice, kb, ko, ref;

	ref = kb = __webpack_require__(2), _ = ref._, ko = ref.ko;

	arraySlice = Array.prototype.slice;

	kb.toFormattedString = function(format) {
	  var arg, args, index, parameter_index, result, value;
	  result = format.slice();
	  args = arraySlice.call(arguments, 1);
	  for (index in args) {
	    arg = args[index];
	    value = ko.utils.unwrapObservable(arg);
	    if (_.isUndefined(value) || _.isNull(value)) {
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

	kb.parseFormattedString = function(string, format) {
	  var count, format_indices_to_matched_indices, index, match_index, matches, parameter_count, parameter_index, positions, regex, regex_string, result, results, sorted_positions;
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
	    result = [];
	    while (count-- > 0) {
	      result.push('');
	    }
	    return result;
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

	module.exports = kb.FormattedObservable = (function() {
	  function FormattedObservable(format, args) {
	    var observable, observable_args;
	    if (_.isArray(args)) {
	      format = format;
	      observable_args = args;
	    } else {
	      observable_args = arraySlice.call(arguments, 1);
	    }
	    observable = kb.utils.wrappedObservable(this, ko.computed({
	      read: function() {
	        var arg, i, len;
	        args = [ko.utils.unwrapObservable(format)];
	        for (i = 0, len = observable_args.length; i < len; i++) {
	          arg = observable_args[i];
	          args.push(ko.utils.unwrapObservable(arg));
	        }
	        return kb.toFormattedString.apply(null, args);
	      },
	      write: function(value) {
	        var index, matches, max_count;
	        matches = kb.parseFormattedString(value, ko.utils.unwrapObservable(format));
	        max_count = Math.min(observable_args.length, matches.length);
	        index = 0;
	        while (index < max_count) {
	          observable_args[index](matches[index]);
	          index++;
	        }
	      }
	    }));
	    return observable;
	  }

	  FormattedObservable.prototype.destroy = function() {
	    return kb.utils.wrappedDestroy(this);
	  };

	  return FormattedObservable;

	})();

	kb.formattedObservable = function(format, args) {
	  return new kb.FormattedObservable(format, arraySlice.call(arguments, 1));
	};

	kb.observableFormatted = kb.formattedObservable;


/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	
	/*
	  knockback.js 1.0.0
	  Copyright (c)  2011-2014 Kevin Malakoff.
	  License: MIT (http://www.opensource.org/licenses/mit-license.php)
	  Source: https://github.com/kmalakoff/knockback
	  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
	  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
	 */
	var KEYS_PUBLISH, _, kb, ko, ref;

	ref = kb = __webpack_require__(2), _ = ref._, ko = ref.ko;

	KEYS_PUBLISH = ['destroy', 'observedValue', 'resetToCurrent'];

	kb.locale_manager || (kb.locale_manager = void 0);

	module.exports = kb.LocalizedObservable = (function() {
	  LocalizedObservable.extend = kb.extend;

	  function LocalizedObservable(value1, options, vm) {
	    var observable, value;
	    this.value = value1;
	    this.vm = vm;
	    options || (options = {});
	    this.vm || (this.vm = {});
	    this.read || kb._throwMissing(this, 'read');
	    kb.locale_manager || kb._throwMissing(this, 'kb.locale_manager');
	    this.__kb || (this.__kb = {});
	    this.__kb._onLocaleChange = _.bind(this._onLocaleChange, this);
	    this.__kb._onChange = options.onChange;
	    if (this.value) {
	      value = ko.utils.unwrapObservable(this.value);
	    }
	    this.vo = ko.observable(!value ? null : this.read(value, null));
	    observable = kb.utils.wrappedObservable(this, ko.computed({
	      read: (function(_this) {
	        return function() {
	          if (_this.value) {
	            ko.utils.unwrapObservable(_this.value);
	          }
	          _this.vo();
	          return _this.read(ko.utils.unwrapObservable(_this.value));
	        };
	      })(this),
	      write: (function(_this) {
	        return function(value) {
	          _this.write || kb._throwUnexpected(_this, 'writing to read-only');
	          _this.write(value, ko.utils.unwrapObservable(_this.value));
	          _this.vo(value);
	          if (_this.__kb._onChange) {
	            return _this.__kb._onChange(value);
	          }
	        };
	      })(this),
	      owner: this.vm
	    }));
	    kb.publishMethods(observable, this, KEYS_PUBLISH);
	    kb.locale_manager.bind('change', this.__kb._onLocaleChange);
	    if (options.hasOwnProperty('default')) {
	      observable = kb.DefaultObservable && ko.defaultObservable(observable, options["default"]);
	    }
	    return observable;
	  }

	  LocalizedObservable.prototype.destroy = function() {
	    kb.locale_manager.unbind('change', this.__kb._onLocaleChange);
	    this.vm = null;
	    return kb.utils.wrappedDestroy(this);
	  };

	  LocalizedObservable.prototype.resetToCurrent = function() {
	    var current_value, observable;
	    observable = kb.utils.wrappedObservable(this);
	    current_value = this.value ? this.read(ko.utils.unwrapObservable(this.value)) : null;
	    if (observable() === current_value) {
	      return;
	    }
	    return observable(current_value);
	  };

	  LocalizedObservable.prototype.observedValue = function(value) {
	    if (arguments.length === 0) {
	      return this.value;
	    }
	    this.value = value;
	    this._onLocaleChange();
	  };

	  LocalizedObservable.prototype._onLocaleChange = function() {
	    var value;
	    value = this.read(ko.utils.unwrapObservable(this.value));
	    this.vo(value);
	    if (this.__kb._onChange) {
	      return this.__kb._onChange(value);
	    }
	  };

	  return LocalizedObservable;

	})();

	kb.localizedObservable = function(value, options, view_model) {
	  return new kb.LocalizedObservable(value, options, view_model);
	};

	kb.observableLocalized = kb.localizedObservable;


/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	
	/*
	  knockback.js 1.0.0
	  Copyright (c)  2011-2014 Kevin Malakoff.
	  License: MIT (http://www.opensource.org/licenses/mit-license.php)
	  Source: https://github.com/kmalakoff/knockback
	  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
	  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
	 */
	var KEYS_PUBLISH, _, kb, ko, ref;

	ref = kb = __webpack_require__(2), _ = ref._, ko = ref.ko;

	KEYS_PUBLISH = ['destroy'];

	module.exports = kb.TriggeredObservable = (function() {
	  function TriggeredObservable(emitter, event_selector1) {
	    var observable;
	    this.event_selector = event_selector1;
	    emitter || kb._throwMissing(this, 'emitter');
	    this.event_selector || kb._throwMissing(this, 'event_selector');
	    this.vo = ko.observable();
	    observable = kb.utils.wrappedObservable(this, ko.computed((function(_this) {
	      return function() {
	        return _this.vo();
	      };
	    })(this)));
	    kb.publishMethods(observable, this, KEYS_PUBLISH);
	    kb.utils.wrappedEventWatcher(this, new kb.EventWatcher(emitter, this, {
	      emitter: _.bind(this.emitter, this),
	      update: _.bind(this.update, this),
	      event_selector: this.event_selector
	    }));
	    return observable;
	  }

	  TriggeredObservable.prototype.destroy = function() {
	    return kb.utils.wrappedDestroy(this);
	  };

	  TriggeredObservable.prototype.emitter = function(new_emitter) {
	    if ((arguments.length === 0) || (this.ee === new_emitter)) {
	      return this.ee;
	    }
	    if ((this.ee = new_emitter)) {
	      return this.update();
	    }
	  };

	  TriggeredObservable.prototype.update = function() {
	    if (!this.ee) {
	      return;
	    }
	    if (this.vo() !== this.ee) {
	      return this.vo(this.ee);
	    } else {
	      return this.vo.valueHasMutated();
	    }
	  };

	  return TriggeredObservable;

	})();

	kb.triggeredObservable = function(emitter, event_selector) {
	  return new kb.TriggeredObservable(emitter, event_selector);
	};

	kb.observableTriggered = kb.triggeredObservable;


/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	
	/*
	  knockback.js 1.0.0
	  Copyright (c)  2011-2014 Kevin Malakoff.
	  License: MIT (http://www.opensource.org/licenses/mit-license.php)
	  Source: https://github.com/kmalakoff/knockback
	  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
	  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
	 */
	var $, _, callOrGet, kb, ko, ref;

	ref = kb = __webpack_require__(2), _ = ref._, ko = ref.ko, $ = ref.$;

	__webpack_require__(31);

	callOrGet = function(value) {
	  value = ko.utils.unwrapObservable(value);
	  if (typeof value === 'function') {
	    return value.apply(null, Array.prototype.slice.call(arguments, 1));
	  } else {
	    return value;
	  }
	};

	module.exports = kb.Validation = (function() {
	  function Validation() {}

	  return Validation;

	})();

	kb.valueValidator = function(value, bindings, validation_options) {
	  if (validation_options == null) {
	    validation_options = {};
	  }
	  (validation_options && !(typeof validation_options === 'function')) || (validation_options = {});
	  return ko.computed(function() {
	    var active_index, current_value, disabled, identifier, identifier_index, priorities, results, validator;
	    results = {
	      $error_count: 0
	    };
	    current_value = ko.utils.unwrapObservable(value);
	    !('disable' in validation_options) || (disabled = callOrGet(validation_options.disable));
	    !('enable' in validation_options) || (disabled = !callOrGet(validation_options.enable));
	    priorities = validation_options.priorities || [];
	    _.isArray(priorities) || (priorities = [priorities]);
	    active_index = priorities.length + 1;
	    for (identifier in bindings) {
	      validator = bindings[identifier];
	      results[identifier] = !disabled && callOrGet(validator, current_value);
	      if (results[identifier]) {
	        results.$error_count++;
	        (identifier_index = _.indexOf(priorities, identifier) >= 0) || (identifier_index = priorities.length);
	        if (results.$active_error && identifier_index < active_index) {
	          results.$active_error = identifier;
	          active_index = identifier_index;
	        } else {
	          results.$active_error || (results.$active_error = identifier, active_index = identifier_index);
	        }
	      }
	    }
	    results.$enabled = !disabled;
	    results.$disable = !!disabled;
	    results.$valid = results.$error_count === 0;
	    return results;
	  });
	};

	kb.inputValidator = function(view_model, el, validation_options) {
	  var $input_el, bindings, identifier, input_name, options, ref1, result, type, validator, validators;
	  if (validation_options == null) {
	    validation_options = {};
	  }
	  (validation_options && !(typeof validation_options === 'function')) || (validation_options = {});
	  validators = kb.valid;
	  $input_el = $(el);
	  if ((input_name = $input_el.attr('name')) && !_.isString(input_name)) {
	    input_name = null;
	  }
	  if (!(bindings = $input_el.attr('data-bind'))) {
	    return null;
	  }
	  options = (new Function("sc", "with(sc[0]) { return { " + bindings + " } }"))([view_model]);
	  if (!(options && options.value)) {
	    return null;
	  }
	  (!options.validation_options) || (_.defaults(options.validation_options, validation_options), validation_options = options.validation_options);
	  bindings = {};
	  (!validators[type = $input_el.attr('type')]) || (bindings[type] = validators[type]);
	  (!$input_el.attr('required')) || (bindings.required = validators.required);
	  if (options.validations) {
	    ref1 = options.validations;
	    for (identifier in ref1) {
	      validator = ref1[identifier];
	      bindings[identifier] = validator;
	    }
	  }
	  result = kb.valueValidator(options.value, bindings, validation_options);
	  (!input_name && !validation_options.no_attach) || (view_model["$" + input_name] = result);
	  return result;
	};

	kb.formValidator = function(view_model, el) {
	  var $root_el, bindings, form_name, i, input_el, len, name, options, ref1, results, validation_options, validator, validators;
	  results = {};
	  validators = [];
	  $root_el = $(el);
	  if ((form_name = $root_el.attr('name')) && !_.isString(form_name)) {
	    form_name = null;
	  }
	  if ((bindings = $root_el.attr('data-bind'))) {
	    options = (new Function("sc", "with(sc[0]) { return { " + bindings + " } }"))([view_model]);
	    validation_options = options.validation_options;
	  }
	  validation_options || (validation_options = {});
	  validation_options.no_attach = !!form_name;
	  ref1 = $root_el.find('input');
	  for (i = 0, len = ref1.length; i < len; i++) {
	    input_el = ref1[i];
	    if (!(name = $(input_el).attr('name'))) {
	      continue;
	    }
	    validator = kb.inputValidator(view_model, input_el, validation_options);
	    !validator || validators.push(results[name] = validator);
	  }
	  results.$error_count = ko.computed(function() {
	    var error_count, j, len1;
	    error_count = 0;
	    for (j = 0, len1 = validators.length; j < len1; j++) {
	      validator = validators[j];
	      error_count += validator().$error_count;
	    }
	    return error_count;
	  });
	  results.$valid = ko.computed(function() {
	    return results.$error_count() === 0;
	  });
	  results.$enabled = ko.computed(function() {
	    var enabled, j, len1;
	    enabled = true;
	    for (j = 0, len1 = validators.length; j < len1; j++) {
	      validator = validators[j];
	      enabled &= validator().$enabled;
	    }
	    return enabled;
	  });
	  results.$disabled = ko.computed(function() {
	    return !results.$enabled();
	  });
	  if (form_name) {
	    view_model["$" + form_name] = results;
	  }
	  return results;
	};


/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	
	/*
	  knockback.js 1.0.0
	  Copyright (c)  2011-2014 Kevin Malakoff.
	  License: MIT (http://www.opensource.org/licenses/mit-license.php)
	  Source: https://github.com/kmalakoff/knockback
	  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
	  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
	 */
	var $, EMAIL_REGEXP, NUMBER_REGEXP, URL_REGEXP, _, kb, ko, ref;

	ref = kb = __webpack_require__(2), _ = ref._, ko = ref.ko, $ = ref.$;

	URL_REGEXP = /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/;

	EMAIL_REGEXP = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;

	NUMBER_REGEXP = /^\s*(\-|\+)?(\d+|(\d*(\.\d*)))\s*$/;

	kb.valid = {
	  required: function(value) {
	    return !value;
	  },
	  url: function(value) {
	    return !URL_REGEXP.test(value);
	  },
	  email: function(value) {
	    return !EMAIL_REGEXP.test(value);
	  },
	  number: function(value) {
	    return !NUMBER_REGEXP.test(value);
	  }
	};

	kb.hasChangedFn = function(model) {
	  var attributes, m;
	  m = null;
	  attributes = null;
	  return function() {
	    var current_model;
	    if (m !== (current_model = ko.utils.unwrapObservable(model))) {
	      m = current_model;
	      attributes = (m ? m.toJSON() : null);
	      return false;
	    }
	    if (!(m && attributes)) {
	      return false;
	    }
	    return !_.isEqual(m.toJSON(), attributes);
	  };
	};

	kb.minLengthFn = function(length) {
	  return function(value) {
	    return !value || value.length < length;
	  };
	};

	kb.uniqueValueFn = function(model, key, collection) {
	  return function(value) {
	    var c, k, m;
	    m = ko.utils.unwrapObservable(model);
	    k = ko.utils.unwrapObservable(key);
	    c = ko.utils.unwrapObservable(collection);
	    if (!(m && k && c)) {
	      return false;
	    }
	    return !!_.find(c.models, (function(_this) {
	      return function(test) {
	        return (test !== m) && test.get(k) === value;
	      };
	    })(this));
	  };
	};

	kb.untilTrueFn = function(stand_in, fn, model) {
	  var was_true;
	  was_true = false;
	  if (model && ko.isObservable(model)) {
	    model.subscribe(function() {
	      return was_true = false;
	    });
	  }
	  return function(value) {
	    var f, result;
	    if (!(f = ko.utils.unwrapObservable(fn))) {
	      return ko.utils.unwrapObservable(stand_in);
	    }
	    was_true |= !!(result = f(ko.utils.unwrapObservable(value)));
	    return (was_true ? result : ko.utils.unwrapObservable(stand_in));
	  };
	};

	kb.untilFalseFn = function(stand_in, fn, model) {
	  var was_false;
	  was_false = false;
	  if (model && ko.isObservable(model)) {
	    model.subscribe(function() {
	      return was_false = false;
	    });
	  }
	  return function(value) {
	    var f, result;
	    if (!(f = ko.utils.unwrapObservable(fn))) {
	      return ko.utils.unwrapObservable(stand_in);
	    }
	    was_false |= !(result = f(ko.utils.unwrapObservable(value)));
	    return (was_false ? result : ko.utils.unwrapObservable(stand_in));
	  };
	};


/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	
	/*
	  knockback.js 1.0.0
	  Copyright (c)  2011-2014 Kevin Malakoff.
	  License: MIT (http://www.opensource.org/licenses/mit-license.php)
	  Source: https://github.com/kmalakoff/knockback
	  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
	  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
	 */
	var i, kb, key, len, ref;

	module.exports = kb = __webpack_require__(2);

	kb.configure = __webpack_require__(8);

	kb.modules = {
	  underscore: kb._,
	  backbone: kb.Parse || kb.Backbone,
	  knockout: kb.ko
	};

	if (typeof window !== "undefined" && window !== null) {
	  ref = ['_', 'Backbone', 'Parse', 'ko', '$'];
	  for (i = 0, len = ref.length; i < len; i++) {
	    key = ref[i];
	    if (kb[key] && !Object.prototype.hasOwnProperty.call(window, key)) {
	      window[key] = kb[key];
	    }
	  }
	}


/***/ }
/******/ ])
});
;