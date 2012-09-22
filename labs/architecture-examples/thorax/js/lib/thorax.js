// Copyright (c) 2011-2012 @WalmartLabs
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
// DEALINGS IN THE SOFTWARE.
// 
(function() {

var Thorax;

//support zepto.forEach on jQuery
if (!$.fn.forEach) {
  $.fn.forEach = function(iterator, context) {
    $.fn.each.call(this, function(index) {
      iterator.call(context || this, this, index);
    });
  }
}

if (typeof exports !== 'undefined') {
  Thorax = exports;
} else {
  Thorax = this.Thorax = {};
}

Thorax.VERSION = '2.0.0b3';

var handlebarsExtension = 'handlebars',
    handlebarsExtensionRegExp = new RegExp('\\.' + handlebarsExtension + '$'),
    viewNameAttributeName = 'data-view-name',
    viewCidAttributeName = 'data-view-cid',
    viewPlaceholderAttributeName = 'data-view-tmp',
    viewHelperAttributeName = 'data-view-helper',
    elementPlaceholderAttributeName = 'data-element-tmp';

_.extend(Thorax, {
  templatePathPrefix: '',
  //view instances
  _viewsIndexedByCid: {},
  templates: {},
  //view classes
  Views: {},
  //certain error prone pieces of code (on Android only it seems)
  //are wrapped in a try catch block, then trigger this handler in
  //the catch, with the name of the function or event that was
  //trying to be executed. Override this with a custom handler
  //to debug / log / etc
  onException: function(name, err) {
    throw err;
  }
});

Thorax.Util = {
  createRegistryWrapper: function(klass, hash) {
    var $super = klass.extend;
    klass.extend = function() {
      var child = $super.apply(this, arguments);
      if (child.prototype.name) {
        hash[child.prototype.name] = child;
      }
      return child;
    };
  },
  registryGet: function(object, type, name, ignoreErrors) {
    if (type === 'templates') {
      //append the template path prefix if it is missing
      var pathPrefix = Thorax.templatePathPrefix;
      if (pathPrefix && pathPrefix.length && name && name.substr(0, pathPrefix.length) !== pathPrefix) {
        name = pathPrefix + name;
      }
    }
    var target = object[type],
        value;
    if (name.match(/\./)) {
      var bits = name.split(/\./);
      name = bits.pop();
      bits.forEach(function(key) {
        target = target[key];
      });
    } else {
      value = target[name];
    }
    if (!target && !ignoreErrors) {
      throw new Error(type + ': ' + name + ' does not exist.');
    } else {
      var value = target[name];
      if (type === 'templates' && typeof value === 'string') {
        value = target[name] = Handlebars.compile(value);
      }
      return value;
    }
  },
  getViewInstance: function(name, attributes) {
    attributes['class'] && (attributes.className = attributes['class']);
    attributes.tag && (attributes.tagName = attributes.tag);
    if (typeof name === 'string') {
      var klass = Thorax.Util.registryGet(Thorax, 'Views', name, false);
      return klass.cid ? _.extend(klass, attributes || {}) : new klass(attributes);
    } else if (typeof name === 'function') {
      return new name(attributes);
    } else {
      return name;
    }
  },
  getValue: function (object, prop) {
    if (!(object && object[prop])) {
      return null;
    }
    return _.isFunction(object[prop])
      ? object[prop].apply(object, Array.prototype.slice.call(arguments, 2))
      : object[prop];
  },
  //'selector' is not present in $('<p></p>')
  //TODO: investigage a better detection method
  is$: function(obj) {
    return typeof obj === 'object' && ('length' in obj);
  },
  expandToken: function(input, scope) {
    
    if (input && input.indexOf && input.indexOf('{' + '{') >= 0) {
      var re = /(?:\{?[^{]+)|(?:\{\{([^}]+)\}\})/g,
          match,
          ret = [];
      function deref(token, scope) {
        var segments = token.split('.'),
            len = segments.length;
        for (var i = 0; scope && i < len; i++) {
          if (segments[i] !== 'this') {
            scope = scope[segments[i]];
          }
        }
        return scope;
      }
      while (match = re.exec(input)) {
        if (match[1]) {
          var params = match[1].split(/\s+/);
          if (params.length > 1) {
            var helper = params.shift();
            params = params.map(function(param) { return deref(param, scope); });
            if (Handlebars.helpers[helper]) {
              ret.push(Handlebars.helpers[helper].apply(scope, params));
            } else {
              // If the helper is not defined do nothing
              ret.push(match[0]);
            }
          } else {
            ret.push(deref(params[0], scope));
          }
        } else {
          ret.push(match[0]);
        }
      }
      input = ret.join('');
    }
    return input;
  },
  tag: function(attributes, content, scope) {
    var htmlAttributes = _.clone(attributes),
        tag = htmlAttributes.tag || htmlAttributes.tagName || 'div';
    if (htmlAttributes.tag) {
      delete htmlAttributes.tag;
    }
    if (htmlAttributes.tagName) {
      delete htmlAttributes.tagName;
    }
    return '<' + tag + ' ' + _.map(htmlAttributes, function(value, key) {
      if (typeof value === 'undefined') {
        return '';
      }
      var formattedValue = value;
      if (scope) {
        formattedValue = Thorax.Util.expandToken(value, scope);
      }
      return key + '="' + Handlebars.Utils.escapeExpression(formattedValue) + '"';
    }).join(' ') + '>' + (typeof content === 'undefined' ? '' : content) + '</' + tag + '>';
  },
  htmlAttributesFromOptions: function(options) {
    var htmlAttributes = {};
    if (options.tag) {
      htmlAttributes.tag = options.tag;
    }
    if (options.tagName) {
      htmlAttributes.tagName = options.tagName;
    }
    if (options['class']) {
      htmlAttributes['class'] = options['class'];
    }
    if (options.id) {
      htmlAttributes.id = options.id;
    }
    return htmlAttributes;
  },
  _cloneEvents: function(source, target, key) {
    source[key] = _.clone(target[key]);
    //need to deep clone events array
    _.each(source[key], function(value, _key) {
      if (_.isArray(value)) {
        target[key][_key] = _.clone(value);
      }
    });
  }
};

Thorax.View = Backbone.View.extend({
  constructor: function() {
    var response = Thorax.View.__super__.constructor.apply(this, arguments);
    
  if (this.model) {
    //need to null this.model so setModel will not treat
    //it as the old model and immediately return
    var model = this.model;
    this.model = null;
    this.setModel(model);
  }

    return response;
  },
  _configure: function(options) {
    
  this._modelEvents = [];

  this._collectionEvents = [];


    Thorax._viewsIndexedByCid[this.cid] = this;
    this.children = {};
    this._renderCount = 0;

    //this.options is removed in Thorax.View, we merge passed
    //properties directly with the view and template context
    _.extend(this, options || {});

    //compile a string if it is set as this.template
    if (typeof this.template === 'string') {
      this.template = Handlebars.compile(this.template);
    } else if (this.name && !this.template) {
      //fetch the template 
      this.template = Thorax.Util.registryGet(Thorax, 'templates', this.name, true);
    }
    
  //HelperView will not have mixins so need to check
  this.constructor.mixins && _.each(this.constructor.mixins, applyMixin, this);
  this.mixins && _.each(this.mixins, applyMixin, this);

  //_events not present on HelperView
  this.constructor._events && this.constructor._events.forEach(function(event) {
    this.on.apply(this, event);
  }, this);
  if (this.events) {
    _.each(Thorax.Util.getValue(this, 'events'), function(handler, eventName) {
      this.on(eventName, handler, this);
    }, this);
  }

  },

  _ensureElement : function() {
    Backbone.View.prototype._ensureElement.call(this);
    if (this.name) {
      this.$el.attr(viewNameAttributeName, this.name);
    }
    this.$el.attr(viewCidAttributeName, this.cid);      
  },

  _addChild: function(view) {
    this.children[view.cid] = view;
    if (!view.parent) {
      view.parent = this;
    }
    return view;
  },

  destroy: function(options) {
    options = _.defaults(options || {}, {
      children: true
    });
    this.trigger('destroyed');
    delete Thorax._viewsIndexedByCid[this.cid];
    _.each(this.children, function(child) {
      if (options.children) {
        child.parent = null;
        child.destroy();
      }
    });
    if (options.children) {
      this.children = {};
    }
  },

  render: function(output) {
    if (typeof output === 'undefined' || (!_.isElement(output) && !Thorax.Util.is$(output) && !(output && output.el) && typeof output !== 'string' && typeof output !== 'function')) {
      if (!this.template) {
        //if the name was set after the view was created try one more time to fetch a template
        if (this.name) {
          this.template = Thorax.Util.registryGet(Thorax, 'templates', this.name, true);
        }
        if (!this.template) {
          throw new Error('View ' + (this.name || this.cid) + '.render() was called with no content and no template set on the view.');
        }
      }
      output = this.renderTemplate(this.template);
    } else if (typeof output === 'function') {
      output = this.renderTemplate(output);
    }
    //accept a view, string, Handlebars.SafeString or DOM element
    this.html((output && output.el) || (output && output.string) || output);
    ++this._renderCount;
    this.trigger('rendered');
    return output;
  },

  context: function() {
    return this;
  },

  _getContext: function(attributes) {
    var data = _.extend({}, Thorax.Util.getValue(this, 'context'), attributes || {}, {
      cid: _.uniqueId('t'),
      yield: function() {
        return data.fn && data.fn(data);
      },
      _view: this
    });
    return data;
  },

  renderTemplate: function(file, data, ignoreErrors) {
    var template;
    data = this._getContext(data);
    if (typeof file === 'function') {
      template = file;
    } else {
      template = this._loadTemplate(file);
    }
    if (!template) {
      if (ignoreErrors) {
        return ''
      } else {
        throw new Error('Unable to find template ' + file);
      }
    } else {
      return template(data);
    }
  },
  
  _loadTemplate: function(file, ignoreErrors) {
    return Thorax.Util.registryGet(Thorax, 'templates', file, ignoreErrors);
  },

  ensureRendered: function() {
    !this._renderCount && this.render();
  },
  
  html: function(html) {
    if (typeof html === 'undefined') {
      return this.el.innerHTML;
    } else {
      var element = this.$el.html(html);
      this._appendViews();
      this._appendElements();
      return element;
    }
  }
});

Thorax.View.extend = function() {
  var child = Backbone.View.extend.apply(this, arguments);
  
  child.mixins = _.clone(this.mixins);

  Thorax.Util._cloneEvents(this, child, '_events');

  Thorax.Util._cloneEvents(this, child, '_modelEvents');

  Thorax.Util._cloneEvents(this, child, '_collectionEvents');

  return child;
};

Thorax.Util.createRegistryWrapper(Thorax.View, Thorax.Views);

//helpers
Handlebars.registerHelper('super', function() {
  var parent = this._view.constructor && this._view.constructor.__super__;
  if (parent) {
    var template = parent.template;
    if (!template) { 
      if (!parent.name) {
        throw new Error('Cannot use super helper when parent has no name or template.');
      }
      template = Thorax.Util.registryGet(Thorax, 'templates', parent.name, false);
    }
    if (typeof template === 'string') {
      template = Handlebars.compile(template);
    }
    return new Handlebars.SafeString(template(this));
  } else {
    return '';
  }
});

Handlebars.registerHelper('template', function(name, options) {
  var context = _.extend({fn: options && options.fn}, this, options ? options.hash : {});
  var output = Thorax.View.prototype.renderTemplate.call(this._view, name, context);
  return new Handlebars.SafeString(output);
});

//view helper
var viewTemplateOverrides = {};
Handlebars.registerHelper('view', function(view, options) {
  if (arguments.length === 1) {
    options = view;
    view = Thorax.View;
  }
  var instance = Thorax.Util.getViewInstance(view, options ? options.hash : {}),
      placeholder_id = instance.cid + '-' + _.uniqueId('placeholder');
  this._view._addChild(instance);
  this._view.trigger('child', instance);
  if (options.fn) {
    viewTemplateOverrides[placeholder_id] = options.fn;
  }
  var htmlAttributes = Thorax.Util.htmlAttributesFromOptions(options.hash);
  htmlAttributes[viewPlaceholderAttributeName] = placeholder_id;
  return new Handlebars.SafeString(Thorax.Util.tag.call(this, htmlAttributes));
});

Thorax.HelperView = Thorax.View.extend({
  _ensureElement: function() {
    Thorax.View.prototype._ensureElement.apply(this, arguments);
    this.$el.attr(viewHelperAttributeName, this._helperName);
  },
  context: function() {
    return this.parent.context.apply(this.parent, arguments);
  }
});

//ensure nested inline helpers will always have this.parent
//set to the view containing the template
function getParent(parent) {
  while (parent._helperName) {
    parent = parent.parent;
  }
  return parent;
}

Handlebars.registerViewHelper = function(name, viewClass, callback) {
  if (arguments.length === 2) {
    options = {};
    callback = arguments[1];
    viewClass = Thorax.HelperView;
  }
  Handlebars.registerHelper(name, function() {
    var args = _.toArray(arguments),
        options = args.pop(),
        viewOptions = {
          template: options.fn,
          inverse: options.inverse,
          options: options.hash,
          parent: getParent(this._view),
          _helperName: name
        };
    options.hash.id && (viewOptions.id = options.hash.id);
    options.hash['class'] && (viewOptions.className = options.hash['class']);
    options.hash.className && (viewOptions.className = options.hash.className);
    options.hash.tag && (viewOptions.tagName = options.hash.tag);
    options.hash.tagName && (viewOptions.tagName = options.hash.tagName);
    var instance = new viewClass(viewOptions);
    args.push(instance);
    this._view.children[instance.cid] = instance;
    this._view.trigger.apply(this._view, ['helper', name].concat(args));
    this._view.trigger.apply(this._view, ['helper:' + name].concat(args));
    var htmlAttributes = Thorax.Util.htmlAttributesFromOptions(options.hash);
    htmlAttributes[viewPlaceholderAttributeName] = instance.cid;
    callback.apply(this, args);
    return new Handlebars.SafeString(Thorax.Util.tag(htmlAttributes, ''));
  });
  var helper = Handlebars.helpers[name];
  return helper;
};
  
//called from View.prototype.html()
Thorax.View.prototype._appendViews = function(scope, callback) {
  (scope || this.$el).find('[' + viewPlaceholderAttributeName + ']').forEach(function(el) {
    var placeholder_id = el.getAttribute(viewPlaceholderAttributeName),
        cid = placeholder_id.replace(/\-placeholder\d+$/, ''),
        view = this.children[cid];
    //if was set with a helper
    if (_.isFunction(view)) {
      view = view.call(this._view);
    }
    if (view) {
      //see if the view helper declared an override for the view
      //if not, ensure the view has been rendered at least once
      if (viewTemplateOverrides[placeholder_id]) {
        view.render(viewTemplateOverrides[placeholder_id](view._getContext()));
      } else {
        view.ensureRendered();
      }
      $(el).replaceWith(view.el);
      //TODO: jQuery has trouble with delegateEvents() when
      //the child dom node is detached then re-attached
      if (typeof jQuery !== 'undefined' && $ === jQuery) {
        if (this._renderCount > 1) {
          view.delegateEvents();
        }
      }
      callback && callback(view.el);
    }
  }, this);
};

//element helper
Handlebars.registerHelper('element', function(element, options) {
  var cid = _.uniqueId('element'),
      htmlAttributes = Thorax.Util.htmlAttributesFromOptions(options.hash);
  htmlAttributes[elementPlaceholderAttributeName] = cid;
  this._view._elementsByCid || (this._view._elementsByCid = {});
  this._view._elementsByCid[cid] = element;
  return new Handlebars.SafeString(Thorax.Util.tag.call(this, htmlAttributes));
});

Thorax.View.prototype._appendElements = function(scope, callback) {
  (scope || this.$el).find('[' + elementPlaceholderAttributeName + ']').forEach(function(el) {
    var cid = el.getAttribute(elementPlaceholderAttributeName),
        element = this._elementsByCid[cid];
    if (_.isFunction(element)) {
      element = element.call(this._view);
    }
    $(el).replaceWith(element);
    callback && callback(element);
  }, this);
};

//$(selector).view() helper
$.fn.view = function(options) {
  options = _.defaults(options || {}, {
    helper: true
  });
  var selector = '[' + viewCidAttributeName + ']';
  if (!options.helper) {
    selector += ':not([' + viewHelperAttributeName + '])';
  }
  var el = $(this).closest(selector);
  return (el && Thorax._viewsIndexedByCid[el.attr(viewCidAttributeName)]) || false;
};





_.extend(Thorax.View, {
  mixins: [],
  mixin: function(mixin) {
    this.mixins.push(mixin);
  }
});

function applyMixin(mixin) {
  if (_.isArray(mixin)) {
    this.mixin.apply(this, mixin);
  } else {
    this.mixin(mixin);
  }
}

var _destroy = Thorax.View.prototype.destroy,
    _on = Thorax.View.prototype.on,
    _delegateEvents = Thorax.View.prototype.delegateEvents;





_.extend(Thorax.View, {
  _events: [],
  on: function(eventName, callback) {
    
  if (eventName === 'model' && typeof callback === 'object') {
    return addEvents(this._modelEvents, callback);
  }

  if (eventName === 'collection' && typeof callback === 'object') {
    return addEvents(this._collectionEvents, callback);
  }

    //accept on({"rendered": handler})
    if (typeof eventName === 'object') {
      _.each(eventName, function(value, key) {
        this.on(key, value);
      }, this);
    } else {
      //accept on({"rendered": [handler, handler]})
      if (_.isArray(callback)) {
        callback.forEach(function(cb) {
          this._events.push([eventName, cb]);
        }, this);
      //accept on("rendered", handler)
      } else {
        this._events.push([eventName, callback]);
      }
    }
    return this;
  }
});

_.extend(Thorax.View.prototype, {
  freeze: function(options) {
    
  this.model && this._unbindModelEvents();

    options = _.defaults(options || {}, {
      dom: true,
      children: true
    });
    this._eventArgumentsToUnbind && this._eventArgumentsToUnbind.forEach(function(args) {
      args[0].off(args[1], args[2], args[3]);
    });
    this._eventArgumentsToUnbind = [];
    this.off();
    if (options.dom) {
      this.undelegateEvents();
    }
    this.trigger('freeze');
    if (options.children) {
      _.each(this.children, function(child, id) {
        child.freeze(options);
      }, this);
    }
  },
  destroy: function() {
    var response = _destroy.apply(this, arguments);
    this.freeze();
    return response;
  },
  on: function(eventName, callback, context) {
    
  if (eventName === 'model' && typeof callback === 'object') {
    return addEvents(this._modelEvents, callback);
  }

  if (eventName === 'collection' && typeof callback === 'object') {
    return addEvents(this._collectionEvents, callback);
  }

    if (typeof eventName === 'object') {
      //accept on({"rendered": callback})
      if (arguments.length === 1) {
        _.each(eventName, function(value, key) {
          this.on(key, value, this);
        }, this);
      //events on other objects to auto dispose of when view frozen
      //on(targetObj, 'eventName', callback, context)
      } else if (arguments.length > 1) {
        if (!this._eventArgumentsToUnbind) {
          this._eventArgumentsToUnbind = [];
        }
        var args = Array.prototype.slice.call(arguments);
        this._eventArgumentsToUnbind.push(args);
        args[0].on.apply(args[0], args.slice(1));
      }
    } else {
      //accept on("rendered", callback, context)
      //accept on("click a", callback, context)
      (_.isArray(callback) ? callback : [callback]).forEach(function(callback) {
        var params = eventParamsFromEventItem.call(this, eventName, callback, context || this);
        if (params.type === 'DOM') {
          //will call _addEvent during delegateEvents()
          if (!this._eventsToDelegate) {
            this._eventsToDelegate = [];
          }
          this._eventsToDelegate.push(params);
        } else {
          this._addEvent(params);
        }
      }, this);
    }
    return this;
  },
  delegateEvents: function(events) {
    this.undelegateEvents();
    if (events) {
      if (_.isFunction(events)) {
        events = events.call(this);
      }
      this._eventsToDelegate = [];
      this.on(events);
    }
    this._eventsToDelegate && this._eventsToDelegate.forEach(this._addEvent, this);
  },
  //params may contain:
  //- name
  //- originalName
  //- selector
  //- type "view" || "DOM"
  //- handler
  _addEvent: function(params) {
    if (params.type === 'view') {
      params.name.split(/\s+/).forEach(function(name) {
        _on.call(this, name, bindEventHandler.call(this, 'view-event:' + params.name, params.handler), params.context || this);
      }, this);
    } else {
      var boundHandler = containHandlerToCurentView(bindEventHandler.call(this, 'dom-event:' + params.name, params.handler), this.cid);
      if (params.selector) {
        //TODO: determine why collection views and some nested views
        //need defered event delegation
        var name = params.name + '.delegateEvents' + this.cid;
        if (typeof jQuery !== 'undefined' && $ === jQuery) {
          _.defer(_.bind(function() {
            this.$el.on(name, params.selector, boundHandler);
          }, this));
        } else {
          this.$el.on(name, params.selector, boundHandler);
        }
      } else {
        this.$el.on(name, boundHandler);
      }
    }
  }
});

var eventSplitter = /^(\S+)(?:\s+(.+))?/;

var domEvents = [
  'mousedown', 'mouseup', 'mousemove', 'mouseover', 'mouseout',
  'touchstart', 'touchend', 'touchmove',
  'click', 'dblclick',
  'keyup', 'keydown', 'keypress',
  'submit', 'change',
  'focus', 'blur'
  
];
var domEventRegexp = new RegExp('^(' + domEvents.join('|') + ')');

function containHandlerToCurentView(handler, cid) {
  return function(event) {
    var view = $(event.target).view({helper: false});
    if (view && view.cid == cid) {
      handler(event);
    }
  }
}

function bindEventHandler(eventName, callback) {
  var method = typeof callback === 'function' ? callback : this[callback];
  if (!method) {
    throw new Error('Event "' + callback + '" does not exist ' + (this.name || this.cid) + ':' + eventName);
  }
  return _.bind(function() {
    try {
      method.apply(this, arguments);
    } catch (e) {
      Thorax.onException('thorax-exception: ' + (this.name || this.cid) + ':' + eventName, e);
    }
  }, this);
}

function eventParamsFromEventItem(name, handler, context) {
  var params = {
    originalName: name,
    handler: typeof handler === 'string' ? this[handler] : handler
  };
  if (name.match(domEventRegexp)) {
    var match = eventSplitter.exec(name);
    params.name = match[1];
    params.type = 'DOM';
    params.selector = match[2];
  } else {
    params.name = name;
    params.type = 'view';
  }
  params.context = context;
  return params;
}

var modelCidAttributeName = 'data-model-cid',
    modelNameAttributeName = 'data-model-name';

Thorax.Model = Backbone.Model.extend({
  isEmpty: function() {
    return this.isPopulated();
  },
  isPopulated: function() {
    // We are populated if we have attributes set
    var attributes = _.clone(this.attributes);
    var defaults = _.isFunction(this.defaults) ? this.defaults() : (this.defaults || {});
    for (var default_key in defaults) {
      if (attributes[default_key] != defaults[default_key]) {
        return true;
      }
      delete attributes[default_key];
    }
    var keys = _.keys(attributes);
    return keys.length > 1 || (keys.length === 1 && keys[0] !== 'id');
  }
});

Thorax.Models = {};
Thorax.Util.createRegistryWrapper(Thorax.Model, Thorax.Models);











Thorax.View._modelEvents = [];

function addEvents(target, source) {
  _.each(source, function(callback, eventName) {
    if (_.isArray(callback)) {
      callback.forEach(function(cb) {
        target.push([eventName, cb]);
      }, this);
    } else {
      target.push([eventName, callback]);
    }
  });
}

_.extend(Thorax.View.prototype, {
  context: function() {
    return _.extend({}, this, (this.model && this.model.attributes) || {});
  },
  _bindModelEvents: function() {
    bindModelEvents.call(this, this.constructor._modelEvents);
    bindModelEvents.call(this, this._modelEvents);
  },
  _unbindModelEvents: function() {
    this.model.trigger('freeze');
    unbindModelEvents.call(this, this.constructor._modelEvents);
    unbindModelEvents.call(this, this._modelEvents);
  },
  setModel: function(model, options) {
    var oldModel = this.model;
    if (model === oldModel) {
      return this;
    }
    oldModel && this._unbindModelEvents();
    if (model) {
      this.$el.attr(modelCidAttributeName, model.cid);
      if (model.name) {
        this.$el.attr(modelNameAttributeName, model.name);
      }
      this.model = model;
      this._setModelOptions(options);
      this._bindModelEvents(options);
      this.model.trigger('set', this.model, oldModel);
      if (Thorax.Util.shouldFetch(this.model, this._modelOptions)) {
        var success = this._modelOptions.success;
        this._loadModel(this.model, this._modelOptions);
      } else {
        //want to trigger built in event handler (render() + populate())
        //without triggering event on model
        this._onModelChange();
      }
    } else {
      this._modelOptions = false;
      this.model = false;
      this._onModelChange();
      this.$el.removeAttr(modelCidAttributeName);
      this.$el.attr(modelNameAttributeName);
    }
    return this;
  },
  _onModelChange: function() {
    if (!this._modelOptions || (this._modelOptions && this._modelOptions.render)) {
      this.render();
    }
  },
  _loadModel: function(model, options) {
    model.fetch(options);
  },
  _setModelOptions: function(options) {
    if (!this._modelOptions) {
      this._modelOptions = {
        fetch: true,
        success: false,
        render: true,
        errors: true
      };
    }
    _.extend(this._modelOptions, options || {});
    return this._modelOptions;
  }
});

function getEventCallback(callback, context) {
  if (typeof callback === 'function') {
    return callback;
  } else {
    return context[callback];
  }
}

function bindModelEvents(events) {
  events.forEach(function(event) {
    //getEventCallback will resolve if it is a string or a method
    //and return a method
    this.model.on(event[0], getEventCallback(event[1], this), event[2] || this);
  }, this);
}

function unbindModelEvents(events) {
  events.forEach(function(event) {
    this.model.off(event[0], getEventCallback(event[1], this), event[2] || this);
  }, this);
}

Thorax.View.on({
  model: {
    error: function(model, errors){
      if (this._modelOptions.errors) {
        this.trigger('error', errors);
      }
    },
    change: function() {
      this._onModelChange();
    }
  }
});

Thorax.Util.shouldFetch = function(modelOrCollection, options) {
  var getValue = Thorax.Util.getValue,
      isCollection = !modelOrCollection.collection && modelOrCollection._byCid && modelOrCollection._byId;
      url = (
        (!modelOrCollection.collection && getValue(modelOrCollection, 'urlRoot')) ||
        (modelOrCollection.collection && getValue(modelOrCollection.collection, 'url')) ||
        (isCollection && getValue(modelOrCollection, 'url'))
      );
  return url && options.fetch && !(
    (modelOrCollection.isPopulated && modelOrCollection.isPopulated()) ||
    (isCollection
      ? Thorax.Collection && Thorax.Collection.prototype.isPopulated.call(modelOrCollection)
      : Thorax.Model.prototype.isPopulated.call(modelOrCollection)
    )
  );
};

$.fn.model = function() {
  var $this = $(this),
      modelElement = $this.closest('[' + modelCidAttributeName + ']'),
      modelCid = modelElement && modelElement.attr(modelCidAttributeName);
  if (modelCid) {
    var view = $this.view();
    if (view && view.model && view.model.cid === modelCid) {
      return view.model || false;
    }
    var collection = $this.collection(view);
    if (collection) {
      return collection._byCid[modelCid] || false;
    }
  }
  return false;
};

var _fetch = Backbone.Collection.prototype.fetch,
    _reset = Backbone.Collection.prototype.reset,
    collectionCidAttributeName = 'data-collection-cid',
    collectionNameAttributeName = 'data-collection-name',
    collectionEmptyAttributeName = 'data-collection-empty',
    modelCidAttributeName = 'data-model-cid',
    modelNameAttributeName = 'data-model-name',
    ELEMENT_NODE_TYPE = 1;

Thorax.Collection = Backbone.Collection.extend({
  model: Thorax.Model || Backbone.Model,
  isEmpty: function() {
    if (this.length > 0) {
      return false;
    } else {
      return this.length === 0 && this.isPopulated();
    }
  },
  isPopulated: function() {
    return this._fetched || this.length > 0 || (!this.length && !Thorax.Util.getValue(this, 'url'));
  },
  fetch: function(options) {
    options = options || {};
    var success = options.success;
    options.success = function(collection, response) {
      collection._fetched = true;
      success && success(collection, response);
    };
    return _fetch.apply(this, arguments);
  },
  reset: function(models, options) {
    this._fetched = !!models;
    return _reset.call(this, models, options);
  }
});

Thorax.Collections = {};
Thorax.Util.createRegistryWrapper(Thorax.Collection, Thorax.Collections);







Thorax.View._collectionEvents = [];

//collection view is meant to be initialized via the collection
//helper but can alternatively be initialized programatically
//constructor function handles this case, no logic except for
//super() call will be exectued when initialized via collection helper

Thorax.CollectionView = Thorax.HelperView.extend({
  constructor: function(options) {
    Thorax.CollectionView.__super__.constructor.call(this, options);
    //collection helper will initialize this.options, so need to mimic
    this.options || (this.options = {});
    this.collection && this.setCollection(this.collection);
    Thorax.CollectionView._optionNames.forEach(function(optionName) {
      options[optionName] && (this.options[optionName] = options[optionName]);
    }, this);
  },
  _setCollectionOptions: function(collection, options) {
    return _.extend({
      fetch: true,
      success: false,
      errors: true
    }, options || {});
  },
  setCollection: function(collection, options) {
    this.collection = collection;
    if (collection) {
      collection.cid = collection.cid || _.uniqueId('collection');
      this.$el.attr(collectionCidAttributeName, collection.cid);
      if (collection.name) {
        this.$el.attr(collectionNameAttributeName, collection.name);
      }
      this.options = this._setCollectionOptions(collection, _.extend({}, this.options, options));
      bindCollectionEvents.call(this, collection, this.parent._collectionEvents);
      bindCollectionEvents.call(this, collection, this.parent.constructor._collectionEvents);
      collection.trigger('set', collection);
      if (Thorax.Util.shouldFetch(collection, this.options)) {
        this._loadCollection(collection);
      } else {
        //want to trigger built in event handler (render())
        //without triggering event on collection
        this.reset();
      }
    }
    return this;
  },
  _loadCollection: function(collection) {
    collection.fetch(this.options);
  },
  //appendItem(model [,index])
  //appendItem(html_string, index)
  //appendItem(view, index)
  appendItem: function(model, index, options) {
    //empty item
    if (!model) {
      return;
    }
    var itemView;
    options = options || {};
    //if index argument is a view
    if (index && index.el) {
      index = this.$el.children().indexOf(index.el) + 1;
    }
    //if argument is a view, or html string
    if (model.el || typeof model === 'string') {
      itemView = model;
      model = false;
    } else {
      index = index || this.collection.indexOf(model) || 0;
      itemView = this.renderItem(model, index);
    }
    if (itemView) {
      if (itemView.cid) {
        this._addChild(itemView);
      }
      //if the renderer's output wasn't contained in a tag, wrap it in a div
      //plain text, or a mixture of top level text nodes and element nodes
      //will get wrapped
      if (typeof itemView === 'string' && !itemView.match(/^\s*\</m)) {
        itemView = '<div>' + itemView + '</div>'
      }
      var itemElement = itemView.el ? [itemView.el] : _.filter($(itemView), function(node) {
        //filter out top level whitespace nodes
        return node.nodeType === ELEMENT_NODE_TYPE;
      });
      if (model) {
        $(itemElement).attr(modelCidAttributeName, model.cid);
      }
      var previousModel = index > 0 ? this.collection.at(index - 1) : false;
      if (!previousModel) {
        this.$el.prepend(itemElement);
      } else {
        //use last() as appendItem can accept multiple nodes from a template
        var last = this.$el.find('[' + modelCidAttributeName + '="' + previousModel.cid + '"]').last();
        last.after(itemElement);
      }
      this._appendViews(null, function(el) {
        el.setAttribute(modelCidAttributeName, model.cid);
      });
      this._appendElements(null, function(el) {
        el.setAttribute(modelCidAttributeName, model.cid);
      });
      if (!options.silent) {
        this.parent.trigger('rendered:item', this, this.collection, model, itemElement, index);
      }
      applyItemVisiblityFilter.call(this, model);
    }
    return itemView;
  },
  //updateItem only useful if there is no item view, otherwise
  //itemView.render() provideds the same functionality
  updateItem: function(model) {
    this.removeItem(model);
    this.appendItem(model);
  },
  removeItem: function(model) {
    var viewEl = this.$('[' + modelCidAttributeName + '="' + model.cid + '"]');
    if (!viewEl.length) {
      return false;
    }
    var viewCid = viewEl.attr(viewCidAttributeName);
    if (this.children[viewCid]) {
      delete this.children[viewCid];
    }
    viewEl.remove();
    return true;
  },
  reset: function() {
    this.render();
  },
  render: function() {
    this.$el.empty();
    if (this.collection) {
      if (this.collection.isEmpty()) {
        this.$el.attr(collectionEmptyAttributeName, true);
        this.appendEmpty();
      } else {
        this.$el.removeAttr(collectionEmptyAttributeName);
        this.collection.forEach(function(item, i) {
          this.appendItem(item, i);
        }, this);
      }
      this.parent.trigger('rendered:collection', this, this.collection);
      applyVisibilityFilter.call(this);
    }
    ++this._renderCount;
  },
  renderEmpty: function() {
    var viewOptions = {};
    if (this.options['empty-view']) {
      if (this.options['empty-context']) {
        viewOptions.context = _.bind(function() {
          return (_.isFunction(this.options['empty-context'])
            ? this.options['empty-context']
            : this.parent[this.options['empty-context']]
          ).call(this.parent);
        }, this);
      }
      var view = Thorax.Util.getViewInstance(this.options['empty-view'], viewOptions);
      if (this.options['empty-template']) {
        view.render(this.renderTemplate(this.options['empty-template'], viewOptions.context ? viewOptions.context() : {}));
      } else {
        view.render();
      }
      return view;
    } else {
      var emptyTemplate = this.options['empty-template'] || (this.parent.name && this._loadTemplate(this.parent.name + '-empty', true));
      var context;
      if (this.options['empty-context']) {
        context = (_.isFunction(this.options['empty-context'])
          ? this.options['empty-context']
          : this.parent[this.options['empty-context']]
        ).call(this.parent);
      } else {
        context = {};
      }
      return emptyTemplate && this.renderTemplate(emptyTemplate, context);
    }
  },
  renderItem: function(model, i) {
    if (this.options['item-view']) {
      var viewOptions = {
        model: model
      };
      //itemContext deprecated
      if (this.options['item-context']) {
        viewOptions.context = _.bind(function() {
          return (_.isFunction(this.options['item-context'])
            ? this.options['item-context']
            : this.parent[this.options['item-context']]
          ).call(this.parent, model, i);
        }, this);
      }
      if (this.options['item-template']) {
        viewOptions.template = this.options['item-template'];
      }
      var view = Thorax.Util.getViewInstance(this.options['item-view'], viewOptions);
      view.ensureRendered();
      return view;
    } else {
      var itemTemplate = this.options['item-template'] || (this.parent.name && this.parent._loadTemplate(this.parent.name + '-item', true));
      if (!itemTemplate) {
        throw new Error('collection helper in View: ' + (this.parent.name || this.parent.cid) + ' requires an item template.');
      }
      var context;
      if (this.options['item-context']) {
        context = (_.isFunction(this.options['item-context'])
          ? this.options['item-context']
          : this.parent[this.options['item-context']]
        ).call(this.parent, model, i);
      } else {
        context = model.attributes;
      }
      return this.renderTemplate(itemTemplate, context);
    }
  },
  appendEmpty: function() {
    this.$el.empty();
    var emptyContent = this.renderEmpty();
    emptyContent && this.appendItem(emptyContent, 0, {
      silent: true
    });
    this.parent.trigger('rendered:empty', this, this.collection);
  }
});

Thorax.CollectionView._optionNames = [
  'item-template',
  'empty-template',
  'item-view',
  'empty-view',
  'item-context',
  'empty-context',
  'filter'
];

function bindCollectionEvents(collection, events) {
  events.forEach(function(event) {
    this.on(collection, event[0], function() {
      //getEventCallback will resolve if it is a string or a method
      //and return a method
      var args = _.toArray(arguments);
      args.unshift(this);
      return getEventCallback(event[1], this.parent).apply(this.parent, args);
    }, this);
  }, this);
}

function applyVisibilityFilter() {
  if (this.options.filter) {
    this.collection.forEach(function(model) {
      applyItemVisiblityFilter.call(this, model);
    }, this);
  }
}

function applyItemVisiblityFilter(model) {
  if (this.options.filter) {
    $('[' + modelCidAttributeName + '="' + model.cid + '"]')[itemShouldBeVisible.call(this, model) ? 'show' : 'hide']();
  }
}

function itemShouldBeVisible(model, i) {
  return (typeof this.options.filter === 'string'
    ? this.parent[this.options.filter]
    : this.options.filter).call(this.parent, model, this.collection.indexOf(model))
  ;
}

function handleChangeFromEmptyToNotEmpty() {
  if (this.collection.length === 1) {
    if(this.$el.length) {
      this.$el.removeAttr(collectionEmptyAttributeName);
      this.$el.empty();
    }
  }
}

function handleChangeFromNotEmptyToEmpty() {
  if (this.collection.length === 0) {
    if (this.$el.length) {
      this.$el.attr(collectionEmptyAttributeName, true);
      this.appendEmpty();
    }
  }
}

Thorax.View.on({
  collection: {
    filter: function(collectionView) {
      applyVisibilityFilter.call(collectionView);
    },
    change: function(collectionView, model) {
      //if we rendered with item views, model changes will be observed
      //by the generated item view but if we rendered with templates
      //then model changes need to be bound as nothing is watching
      if (!collectionView.options['item-view']) {
        collectionView.updateItem(model);
      }
      applyItemVisiblityFilter.call(collectionView, model);
    },
    add: function(collectionView, model, collection) {
      handleChangeFromEmptyToNotEmpty.call(collectionView);
      if (collectionView.$el.length) {
        var index = collection.indexOf(model);
        collectionView.appendItem(model, index);
      }
    },
    remove: function(collectionView, model, collection) {
      collectionView.$el.find('[' + modelCidAttributeName + '="' + model.cid + '"]').remove();
      for (var cid in collectionView.children) {
        if (collectionView.children[cid].model && collectionView.children[cid].model.cid === model.cid) {
          collectionView.children[cid].destroy();
          delete collectionView.children[cid];
          break;
        }
      }
      handleChangeFromNotEmptyToEmpty.call(collectionView);
    },
    reset: function(collectionView, collection) {
      collectionView.reset();
    },
    error: function(collectionView, message) {
      if (collectionView.options.errors) {
        collectionView.trigger('error', message);
        this.trigger('error', message);
      }
    }
  }
});

Handlebars.registerViewHelper('collection', Thorax.CollectionView, function(collection, view) {
  if (arguments.length === 1) {
    view = collection;
    collection = this._view.collection;
  }
  if (collection) {
    //item-view and empty-view may also be passed, but have no defaults
    _.extend(view.options, {
      'item-template': view.template && view.template !== Handlebars.VM.noop ? view.template : view.options['item-template'],
      'empty-template': view.inverse && view.inverse !== Handlebars.VM.noop ? view.inverse : view.options['empty-template'],
      'item-context': view.options['item-context'] || view.parent.itemContext,
      'empty-context': view.options['empty-context'] || view.parent.emptyContext,
      filter: view.options['filter']
    });
    view.setCollection(collection);
  }
});

//empty helper
Handlebars.registerViewHelper('empty', function(collection, view) {
  var empty, noArgument;
  if (arguments.length === 1) {
    view = collection;
    collection = false;
    noArgument = true;
  }

  var _render = view.render;
  view.render = function() {
    if (noArgument) {
      empty = !this.parent.model || (this.parent.model && !this.parent.model.isEmpty());
    } else if (!collection) {
      empty = true;
    } else {
      empty = collection.isEmpty();
    }
    if (empty) {
      this.parent.trigger('rendered:empty', this, collection);
      return _render.call(this, this.template);
    } else {
      return _render.call(this, this.inverse);
    }
  };

  //no model binding is necessary as model.set() will cause re-render
  if (collection) {
    function collectionRemoveCallback() {
      if (collection.length === 0) {
        view.render();
      }
    }
    function collectionAddCallback() {
      if (collection.length === 1) {
        view.render();
      }
    }
    function collectionResetCallback() {
      view.render();
    }

    view.on(collection, 'remove', collectionRemoveCallback);
    view.on(collection, 'add', collectionAddCallback);
    view.on(collection, 'reset', collectionResetCallback);
  }
  
  view.render();
});

//$(selector).collection() helper
$.fn.collection = function(view) {
  var $this = $(this),
      collectionElement = $this.closest('[' + collectionCidAttributeName + ']'),
      collectionCid = collectionElement && collectionElement.attr(collectionCidAttributeName);
  if (collectionCid) {
    view = view || $this.view();
    if (view) {
      return view.collection;
    }
  }
  return false;
};

var paramMatcher = /:(\w+)/g,
    callMethodAttributeName = 'data-call-method';

Handlebars.registerHelper('url', function(url) {
  var matches = url.match(paramMatcher),
      context = this;
  if (matches) {
    url = url.replace(paramMatcher, function(match, key) {
      return context[key] ? Thorax.Util.getValue(context, key) : match;
    });
  }
  url = Thorax.Util.expandToken(url, context);
  return (Backbone.history._hasPushState ? Backbone.history.options.root : '#') + url;
});

Handlebars.registerHelper('button', function(method, options) {
  options.hash.tag = options.hash.tag || options.hash.tagName || 'button';
  options.hash[callMethodAttributeName] = method;
  return new Handlebars.SafeString(Thorax.Util.tag.call(this, options.hash, options.fn ? options.fn(this) : '', this));
});

Handlebars.registerHelper('link', function(url, options) {
  options.hash.tag = options.hash.tag || options.hash.tagName || 'a';
  options.hash.href = Handlebars.helpers.url.call(this, url);
  options.hash[callMethodAttributeName] = '_anchorClick';
  return new Handlebars.SafeString(Thorax.Util.tag.call(this, options.hash, options.fn ? options.fn(this) : '', this));
});

$(function() {
  $(document).on('click', '[' + callMethodAttributeName + ']', function(event) {
    var target = $(event.target),
        view = target.view({helper: false}),
        methodName = target.attr(callMethodAttributeName);
    view[methodName].call(view, event);
  });
});

Thorax.View.prototype._anchorClick = function(event) {
  var target = $(event.currentTarget),
      href = target.attr('href');
  // Route anything that starts with # or / (excluding //domain urls)
  if (href && (href[0] === '#' || (href[0] === '/' && href[1] !== '/'))) {
    Backbone.history.navigate(href, {
      trigger: true
    });
    event.preventDefault();
  }
};

if (Thorax.View.prototype._setModelOptions) {
  (function() {
    var _onModelChange = Thorax.View.prototype._onModelChange,
      _setModelOptions = Thorax.View.prototype._setModelOptions;
    _.extend(Thorax.View.prototype, {
      _onModelChange: function() {
        var response = _onModelChange.call(this);
        if (this._modelOptions.populate) {
          this.populate(this.model.attributes);
        }
        return response;
      },
      _setModelOptions: function(options) {
        if (!options) {
          options = {};
        }
        if (!('populate' in options)) {
          options.populate = true;
        }
        return _setModelOptions.call(this, options);
      }
    });
  })();
}

_.extend(Thorax.View.prototype, {
  //serializes a form present in the view, returning the serialized data
  //as an object
  //pass {set:false} to not update this.model if present
  //can pass options, callback or event in any order
  serialize: function() {
    var callback, options, event;
    //ignore undefined arguments in case event was null
    for (var i = 0; i < arguments.length; ++i) {
      if (typeof arguments[i] === 'function') {
        callback = arguments[i];
      } else if (typeof arguments[i] === 'object') {
        if ('stopPropagation' in arguments[i] && 'preventDefault' in arguments[i]) {
          event = arguments[i];
        } else {
          options = arguments[i];
        }
      }
    }

    if (event && !this._preventDuplicateSubmission(event)) {
      return;
    }

    options = _.extend({
      set: true,
      validate: true
    },options || {});

    var attributes = options.attributes || {};
    
    //callback has context of element
    var view = this;
    var errors = [];
    eachNamedInput.call(this, options, function() {
      var value = view._getInputValue(this, options, errors);
      if (typeof value !== 'undefined') {
        objectAndKeyFromAttributesAndName.call(this, attributes, this.name, {mode: 'serialize'}, function(object, key) {
          if (!object[key]) {
            object[key] = value;
          } else if (_.isArray(object[key])) {
            object[key].push(value);
          } else {
            object[key] = [object[key], value];
          }
        });
      }
    });

    this.trigger('serialize', attributes, options);

    if (options.validate) {
      var validateInputErrors = this.validateInput(attributes);
      if (validateInputErrors && validateInputErrors.length) {
        errors = errors.concat(validateInputErrors);
      }
      this.trigger('validate', attributes, errors, options);
      if (errors.length) {
        this.trigger('error', errors);
        return;
      }
    }

    if (options.set && this.model) {
      if (!this.model.set(attributes, {silent: true})) {
        return false;
      };
    }
    
    callback && callback.call(this, attributes, _.bind(resetSubmitState, this));
    return attributes;
  },

  _preventDuplicateSubmission: function(event, callback) {
    event.preventDefault();

    var form = $(event.target);
    if ((event.target.tagName || '').toLowerCase() !== 'form') {
      // Handle non-submit events by gating on the form
      form = $(event.target).closest('form');
    }

    if (!form.attr('data-submit-wait')) {
      form.attr('data-submit-wait', 'true');
      if (callback) {
        callback.call(this, event);
      }
      return true;
    } else {
      return false;
    }
  },

  //populate a form from the passed attributes or this.model if present
  populate: function(attributes) {
    var value, attributes = attributes || this._getContext(this.model);
    //callback has context of element
    eachNamedInput.call(this, {}, function() {
      objectAndKeyFromAttributesAndName.call(this, attributes, this.name, {mode: 'populate'}, function(object, key) {
        if (object && typeof (value = object[key]) !== 'undefined') {
          //will only execute if we have a name that matches the structure in attributes
          if (this.type === 'checkbox' && _.isBoolean(value)) {
            this.checked = value;
          } else if (this.type === 'checkbox' || this.type === 'radio') {
            this.checked = value == this.value;
          } else {
            this.value = value;
          }
        }
      });
    });

    this.trigger('populate', attributes);
  },

  //perform form validation, implemented by child class
  validateInput: function(attributes, options, errors) {},

  _getInputValue: function(input, options, errors) {
    if (input.type === 'checkbox' || input.type === 'radio') {
      if (input.checked) {
        return input.value;
      }
    } else if (input.multiple === true) {
      var values = [];
      $('option',input).each(function(){
        if (this.selected) {
          values.push(this.value);
        }
      });
      return values;
    } else {
      return input.value;
    }
  }
});

Thorax.View.on({
  error: function() {  
    resetSubmitState.call(this);
  
    // If we errored with a model we want to reset the content but leave the UI
    // intact. If the user updates the data and serializes any overwritten data
    // will be restored.
    if (this.model && this.model.previousAttributes) {
      this.model.set(this.model.previousAttributes(), {
        silent: true
      });
    }
  },
  deactivated: function() {
    resetSubmitState.call(this);
  }
})

function eachNamedInput(options, iterator, context) {
  var i = 0;
  this.$('select,input,textarea', options.root || this.el).each(function() {
    if (this.type !== 'button' && this.type !== 'cancel' && this.type !== 'submit' && this.name && this.name !== '') {
      iterator.call(context || this, i, this);
      ++i;
    }
  });
}

//calls a callback with the correct object fragment and key from a compound name
function objectAndKeyFromAttributesAndName(attributes, name, options, callback) {
  var key, i, object = attributes, keys = name.split('['), mode = options.mode;
  for(i = 0; i < keys.length - 1; ++i) {
    key = keys[i].replace(']','');
    if (!object[key]) {
      if (mode == 'serialize') {
        object[key] = {};
      } else {
        return callback.call(this, false, key);
      }
    }
    object = object[key];
  }
  key = keys[keys.length - 1].replace(']', '');
  callback.call(this, object, key);
}

function resetSubmitState() {
  this.$('form').removeAttr('data-submit-wait');
}

//Router
function initializeRouter() {
  Backbone.history || (Backbone.history = new Backbone.History);
  Backbone.history.on('route', onRoute, this);
  //router does not have a built in destroy event
  //but ViewController does
  this.on('destroyed', function() {
    Backbone.history.off('route', onRoute, this);
  });
}

Thorax.Router = Backbone.Router.extend({
  constructor: function() {
    var response = Thorax.Router.__super__.constructor.apply(this, arguments);
    initializeRouter.call(this);
    return response;
  },
  route: function(route, name, callback) {
    //add a route:before event that is fired before the callback is called
    return Backbone.Router.prototype.route.call(this, route, name, function() {
      this.trigger.apply(this, ['route:before', name].concat(Array.prototype.slice.call(arguments)));
      return callback.apply(this, arguments);
    });
  }
});

Thorax.Routers = {};
Thorax.Util.createRegistryWrapper(Thorax.Router, Thorax.Routers);

function onRoute(router, name) {
  if (this === router) {
    this.trigger.apply(this, ['route'].concat(Array.prototype.slice.call(arguments, 1)));
  }
}

//layout
var layoutCidAttributeName = 'data-layout-cid';

Thorax.LayoutView = Thorax.View.extend({
  render: function(output) {
    //TODO: fixme, lumbar inserts templates after JS, most of the time this is fine
    //but Application will be created in init.js (unlike most views)
    //so need to put this here so the template will be picked up
    var layoutTemplate;
    if (this.name) {
      layoutTemplate = Thorax.Util.registryGet(Thorax, 'templates', this.name, true);
    }
    //a template is optional in a layout
    if (output || this.template || layoutTemplate) {
      //but if present, it must have embedded an element containing layoutCidAttributeName 
      var response = Thorax.View.prototype.render.call(this, output || this.template || layoutTemplate);
      ensureLayoutViewsTargetElement.call(this);
      return response;
    } else {
      ensureLayoutCid.call(this);
    }
  },
  setView: function(view, options) {
    options = _.extend({
      scroll: true,
      destroy: true
    }, options || {});
    if (typeof view === 'string') {
      view = new (Thorax.Util.registryGet(Thorax, 'Views', view, false));
    }
    this.ensureRendered();
    var oldView = this._view;
    if (view == oldView){
      return false;
    }
    if (options.destroy && view) {
      view._shouldDestroyOnNextSetView = true;
    }
    this.trigger('change:view:start', view, oldView, options);
    oldView && oldView.trigger('deactivated', options);
    view && view.trigger('activated', options);
    if (oldView && oldView.el && oldView.el.parentNode) {
      oldView.$el.remove();
    }
    //make sure the view has been rendered at least once
    view && this._addChild(view);
    view && view.ensureRendered();
    view && getLayoutViewsTargetElement.call(this).appendChild(view.el);
    this._view = view;
    oldView && (delete this.children[oldView.cid]);
    oldView && oldView._shouldDestroyOnNextSetView && oldView.destroy();
    this._view && this._view.trigger('ready', options);
    this.trigger('change:view:end', view, oldView, options);
    return view;
  },

  getView: function() {
    return this._view;
  }
});

Handlebars.registerHelper('layout', function(options) {
  options.hash[layoutCidAttributeName] = this._view.cid;
  return new Handlebars.SafeString(Thorax.Util.tag.call(this, options.hash, '', this));
});

function ensureLayoutCid() {
  ++this._renderCount;
  //set the layoutCidAttributeName on this.$el if there was no template
  this.$el.attr(layoutCidAttributeName, this.cid);
}

function ensureLayoutViewsTargetElement() {
  if (!this.$('[' + layoutCidAttributeName + '="' + this.cid + '"]')[0]) {
    throw new Error('No layout element found in ' + (this.name || this.cid));
  }
}

function getLayoutViewsTargetElement() {
  return this.$('[' + layoutCidAttributeName + '="' + this.cid + '"]')[0] || this.el[0] || this.el;
}

//ViewController
Thorax.ViewController = Thorax.LayoutView.extend({
  constructor: function() {
    var response = Thorax.ViewController.__super__.constructor.apply(this, arguments);
    this._bindRoutes();
    initializeRouter.call(this);
    //set the ViewController as the view on the parent
    //if a parent was specified
    this.on('route:before', function(router, name) {
      if (this.parent && this.parent.getView) {
        if (this.parent.getView() !== this) {
          this.parent.setView(this, {
            destroy: false
          });
        }
      }
    }, this);
    return response;
  }
});
_.extend(Thorax.ViewController.prototype, Thorax.Router.prototype);

var loadStart = 'load:start',
    loadEnd = 'load:end',
    rootObject;

Thorax.setRootObject = function(obj) {
  rootObject = obj;
};

Thorax.loadHandler = function(start, end) {
  return function(message, background, object) {
    var self = this;

    function startLoadTimeout() {
      clearTimeout(self._loadStart.timeout);
      self._loadStart.timeout = setTimeout(function() {
          try {
            self._loadStart.run = true;
            start.call(self, self._loadStart.message, self._loadStart.background, self._loadStart);
          } catch(e) {
            Thorax.onException('loadStart', e);
          }
        },
        loadingTimeout*1000);
    }

    if (!self._loadStart) {
      var loadingTimeout = self._loadingTimeoutDuration;
      if (loadingTimeout === void 0) {
        // If we are running on a non-view object pull the default timeout
        loadingTimeout = Thorax.View.prototype._loadingTimeoutDuration;
      }

      self._loadStart = _.extend({
        events: [],
        timeout: 0,
        message: message,
        background: !!background
      }, Backbone.Events);
      startLoadTimeout();
    } else {
      clearTimeout(self._loadStart.endTimeout);

      self._loadStart.message = message;
      if (!background && self._loadStart.background) {
        self._loadStart.background = false;
        startLoadTimeout();
      }
    }

    self._loadStart.events.push(object);
    object.bind(loadEnd, function endCallback() {
      object.off(loadEnd, endCallback);

      var loadingEndTimeout = self._loadingTimeoutEndDuration;
      if (loadingEndTimeout === void 0) {
        // If we are running on a non-view object pull the default timeout
        loadingEndTimeout = Thorax.View.prototype._loadingTimeoutEndDuration;
      }

      var events = self._loadStart.events,
          index = events.indexOf(object);
      if (index >= 0) {
        events.splice(index, 1);
      }
      if (!events.length) {
        self._loadStart.endTimeout = setTimeout(function() {
          try {
            if (!events.length) {
              var run = self._loadStart.run;
  
              if (run) {
                // Emit the end behavior, but only if there is a paired start
                end.call(self, self._loadStart.background, self._loadStart);
                self._loadStart.trigger(loadEnd, self._loadStart);
              }
  
              // If stopping make sure we don't run a start
              clearTimeout(self._loadStart.timeout);
              self._loadStart = undefined;
            }
          } catch(e) {
            Thorax.onException('loadEnd', e);
          }
        }, loadingEndTimeout * 1000);
      }
    });
  };
};

/**
 * Helper method for propagating load:start events to other objects.
 *
 * Forwards load:start events that occur on `source` to `dest`.
 */
Thorax.forwardLoadEvents = function(source, dest, once) {
  function load(message, backgound, object) {
    if (once) {
      source.off(loadStart, load);
    }
    dest.trigger(loadStart, message, backgound, object);
  }
  source.on(loadStart, load);
  return {
    off: function() {
      source.off(loadStart, load);
    }
  };
};

//
// Data load event generation
//

/**
 * Mixing for generating load:start and load:end events.
 */
Thorax.mixinLoadable = function(target, useParent) {
  _.extend(target, {  
    //loading config
    _loadingClassName: 'loading',
    _loadingTimeoutDuration: 0.33,
    _loadingTimeoutEndDuration: 0.10,
  
    // Propagates loading view parameters to the AJAX layer
    onLoadStart: function(message, background, object) {
      var that = useParent ? this.parent : this;
      if (!that.nonBlockingLoad && !background && rootObject) {
        rootObject.trigger(loadStart, message, background, object);
      }
      $(that.el).addClass(that._loadingClassName);
      //used by loading helpers
      if (that._loadingCallbacks) {
        that._loadingCallbacks.forEach(function(callback) {
          callback();
        });
      }
    },
    onLoadEnd: function(background, object) {
      var that = useParent ? this.parent : this;
      $(that.el).removeClass(that._loadingClassName);
      //used by loading helpers
      if (that._loadingCallbacks) {
        that._loadingCallbacks.forEach(function(callback) {
          callback();
        });
      }
    }
  });
};

Thorax.mixinLoadableEvents = function(target, useParent) {
  _.extend(target, {
    loadStart: function(message, background) {
      var that = useParent ? this.parent : this;
      that.trigger(loadStart, message, background, that);
    },
    loadEnd: function() {
      var that = useParent ? this.parent : this;
      that.trigger(loadEnd, that);
    }
  });
};

Thorax.mixinLoadable(Thorax.View.prototype);
Thorax.mixinLoadableEvents(Thorax.View.prototype);

Thorax.sync = function(method, dataObj, options) {
  var self = this,
      complete = options.complete;

  options.complete = function() {
    self._request = undefined;
    self._aborted = false;

    complete && complete.apply(this, arguments);
  };
  this._request = Backbone.sync.apply(this, arguments);

  // TODO : Reevaluate this event... Seems too indepth to expose as an API
  this.trigger('request', this._request);
  return this._request;
};

function bindToRoute(callback, failback) {
  var fragment = Backbone.history.getFragment(),
      completed;

  function finalizer(isCanceled) {
    var same = fragment === Backbone.history.getFragment();

    if (completed) {
      // Prevent multiple execution, i.e. we were canceled but the success callback still runs
      return;
    }

    if (isCanceled && same) {
      // Ignore the first route event if we are running in newer versions of backbone
      // where the route operation is a postfix operation.
      return;
    }

    completed = true;
    Backbone.history.off('route', resetLoader);

    var args = Array.prototype.slice.call(arguments, 1);
    if (!isCanceled && same) {
      callback.apply(this, args);
    } else {
      failback && failback.apply(this, args);
    }
  }

  var resetLoader = _.bind(finalizer, this, true);
  Backbone.history.on('route', resetLoader);

  return _.bind(finalizer, this, false);
}

function loadData(callback, failback, options) {
  if (this.isPopulated()) {
    return callback(this);
  }

  if (arguments.length === 2 && typeof failback !== 'function' && _.isObject(failback)) {
    options = failback;
    failback = false;
  }

  this.fetch(_.defaults({
    success: bindToRoute(callback, failback && _.bind(failback, this, false)),
    error: failback && _.bind(failback, this, true)
  }, options));
}

function fetchQueue(options, $super) {
  if (options.resetQueue) {
    // WARN: Should ensure that loaders are protected from out of band data
    //    when using this option
    this.fetchQueue = undefined;
  }

  if (!this.fetchQueue) {
    // Kick off the request
    this.fetchQueue = [options];
    options = _.defaults({
      success: flushQueue(this, this.fetchQueue, 'success'),
      error: flushQueue(this, this.fetchQueue, 'error'),
      complete: flushQueue(this, this.fetchQueue, 'complete')
    }, options);
    $super.call(this, options);
  } else {
    // Currently fetching. Queue and process once complete
    this.fetchQueue.push(options);
  }
}

function flushQueue(self, fetchQueue, handler) {
  return function() {
    var args = arguments;

    // Flush the queue. Executes any callback handlers that
    // may have been passed in the fetch options.
    fetchQueue.forEach(function(options) {
      if (options[handler]) {
        options[handler].apply(this, args);
      }
    }, this);

    // Reset the queue if we are still the active request
    if (self.fetchQueue === fetchQueue) {
      self.fetchQueue = undefined;
    }
  }
}

var klasses = [];
Thorax.Model && klasses.push(Thorax.Model);
Thorax.Collection && klasses.push(Thorax.Collection);

_.each(klasses, function(DataClass) {
  var $fetch = DataClass.prototype.fetch;
  Thorax.mixinLoadableEvents(DataClass.prototype, false);
  _.extend(DataClass.prototype, {
    sync: Thorax.sync,

    fetch: function(options) {
      options = options || {};

      var self = this,
          complete = options.complete;

      options.complete = function() {
        complete && complete.apply(this, arguments);
        self.loadEnd();
      };
      self.loadStart(undefined, options.background);
      return fetchQueue.call(this, options || {}, $fetch);
    },

    load: function(callback, failback, options) {
      if (arguments.length === 2 && typeof failback !== 'function') {
        options = failback;
        failback = false;
      }
      options = options || {};
      if (!options.background && !this.isPopulated() && rootObject) {
        // Make sure that the global scope sees the proper load events here
        // if we are loading in standalone mode
        Thorax.forwardLoadEvents(this, rootObject, true);
      }

      var self = this;
      loadData.call(this, callback,
        function(isError) {
          // Route changed, kill it
          if (!isError) {
            if (self._request) {
              self._aborted = true;
              self._request.abort();
            }
          }

          failback && failback.apply && failback.apply(this, arguments);
        },
        options);
    }
  });
});

Thorax.Util.bindToRoute = bindToRoute;

if (Thorax.Router) {
  Thorax.Router.bindToRoute = Thorax.Router.prototype.bindToRoute = bindToRoute;
}

//
// View load event handling
//

if (Thorax.Model) {
  (function() {
    // Propagates loading view parameters to the AJAX layer
    var _setModelOptions = Thorax.View.prototype._setModelOptions;
    Thorax.View.prototype._setModelOptions = function(options) {
      return _setModelOptions.call(this, _.defaults({
        ignoreErrors: this.ignoreFetchError,
        background: this.nonBlockingLoad
      }, options || {}));
    };
  })();

  Thorax.View.prototype._loadModel = function(model, options) {
    if (model.load) {
      model.load(function() {
        options.success && options.success(model);
      }, options);
    } else {
      model.fetch(options);
    }
  };
}

if (Thorax.Collection) {
  Thorax.mixinLoadable(Thorax.CollectionView.prototype);
  Thorax.mixinLoadableEvents(Thorax.CollectionView.prototype);

  // Propagates loading view parameters to the AJAX layer
  var _setCollectionOptions = Thorax.CollectionView.prototype._setCollectionOptions;
  Thorax.CollectionView.prototype._setCollectionOptions = function(collection, options) {
    return _setCollectionOptions.call(this, collection, _.defaults({
      ignoreErrors: this.ignoreFetchError,
      background: this.nonBlockingLoad
    }, options || {}));
  };

  Thorax.CollectionView.prototype._loadCollection = function(collection, options) {
    if (collection.load) {
      collection.load(function(){
        options.success && options.success(collection);
      }, options);
    } else {
      collection.fetch(options);
    }
  };
}

Thorax.View.on({
  'load:start': Thorax.loadHandler(
      function(message, background, object) {
        this.onLoadStart(message, background, object);
      },
      function(background, object) {
        this.onLoadEnd(object);
      }),

  collection: {
    'load:start': function(collectionView, message, background, object) {
      //this refers to the collection view, we want to trigger on
      //the parent view which originally bound the collection
      this.trigger(loadStart, message, background, object);
    }
  },
  model: {
    'load:start': function(message, background, object) {
      this.trigger(loadStart, message, background, object);
    }
  }
});

// Helpers

Handlebars.registerViewHelper('loading', function(view) {
  _render = view.render;
  view.render = function() {
    if (view.parent.$el.hasClass(view.parent._loadingClassName)) {
      return _render.call(this, view.fn);
    } else {
      return _render.call(this, view.inverse);
    }
  };
  var callback = _.bind(view.render, view);
  view.parent._loadingCallbacks = view.parent._loadingCallbacks || [];
  view.parent._loadingCallbacks.push(callback);
  view.on('freeze', function() {
    view.parent._loadingCallbacks = _.without(view.parent._loadingCallbacks, callback);
  });
  view.render();
});

//add "loading-view" and "loading-template" options to collection helper
Thorax.View.on('helper:collection', function(view) {
  if (arguments.length === 2) {
    view = arguments[1];
  }
  if (!view.collection) {
    view.collection = view.parent.collection;
  }
  if (view.options['loading-view'] || view.options['loading-template']) {
    var item;
    var callback = Thorax.loadHandler(_.bind(function() {
      if (view.collection.length === 0) {
        view.$el.empty();
      }
      if (view.options['loading-view']) {
        var instance = Thorax.Util.getViewInstance(view.options['loading-view'], {
          collection: view.collection
        });
        view._addChild(instance);
        if (view.options['loading-template']) {
          instance.render(view.options['loading-template']);
        } else {
          instance.render();
        }
        item = instance;
      } else {
        item = view.renderTemplate(view.options['loading-template'], {
          collection: view.collection
        });
      }
      view.appendItem(item, view.collection.length);
      view.$el.children().last().attr('data-loading-element', view.collection.cid);
    }, this), _.bind(function() {
      view.$el.find('[data-loading-element="' + view.collection.cid + '"]').remove();
    }, this));
    view.on(view.collection, 'load:start', callback);
  }
});

if (Thorax.CollectionView) {
  Thorax.CollectionView._optionNames.push('loading-template');
  Thorax.CollectionView._optionNames.push('loading-view');
}



})();
