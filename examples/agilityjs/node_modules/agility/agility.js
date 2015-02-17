/*

  Agility.js    
  Licensed under the MIT license
  Copyright (c) Artur B. Adib, 2011
  http://agilityjs.com

*/

// Sandboxed, so kids don't get hurt. Inspired by jQuery's code:
//   Creates local ref to window for performance reasons (as JS looks up local vars first)
//   Redefines undefined as it could have been tampered with
(function(window, undefined){

  if (!window.jQuery) {
    throw "agility.js: jQuery not found";
  }
  
  // Local references
  var document = window.document,
      location = window.location,
  
  // In case $ is being used by another lib
  $ = jQuery,

  // Main agility object builder
  agility,

  // Internal utility functions
  util = {},
  
  // Default object prototype
  defaultPrototype = {},
  
  // Global object counter
  idCounter = 0,
  
  // Constant
  ROOT_SELECTOR = '&';

  //////////////////////////////////////////////////////////////////////////
  //
  //  Modernizing old JS
  //

  // Modified from Douglas Crockford's Object.create()
  // The condition below ensures we override other manual implementations (most are not adequate)
  if (!Object.create || Object.create.toString().search(/native code/i)<0) {
    Object.create = function(obj){
      var Aux = function(){};
      $.extend(Aux.prototype, obj); // simply setting Aux.prototype = obj somehow messes with constructor, so getPrototypeOf wouldn't work in IE
      return new Aux();
    };
  }
  
  // Modified from John Resig's Object.getPrototypeOf()
  // The condition below ensures we override other manual implementations (most are not adequate)
  if (!Object.getPrototypeOf || Object.getPrototypeOf.toString().search(/native code/i)<0) {
    if ( typeof "test".__proto__ === "object" ) {
      Object.getPrototypeOf = function(object){
        return object.__proto__;
      };
    } else {
      Object.getPrototypeOf = function(object){
        // May break if the constructor has been tampered with
        return object.constructor.prototype;
      };
    }
  }  


  //////////////////////////////////////////////////////////////////////////
  //
  //  util.*
  //
  
  // Checks if provided obj is an agility object
  util.isAgility = function(obj){
   return obj._agility === true;
  };
  
  // Scans object for functions (depth=2) and proxies their 'this' to dest.
  // * To ensure it works with previously proxied objects, we save the original function as 
  //   a '._preProxy' method and when available always use that as the proxy source.
  // * To skip a given method, create a sub-method called '_noProxy'.
  util.proxyAll = function(obj, dest){
    if (!obj || !dest) {
      throw "agility.js: util.proxyAll needs two arguments";
    }
    for (var attr1 in obj) {
      var proxied = obj[attr1];
      // Proxy root methods
      if (typeof obj[attr1] === 'function') {
        proxied = obj[attr1]._noProxy ? obj[attr1] : $.proxy(obj[attr1]._preProxy || obj[attr1], dest);
        proxied._preProxy = obj[attr1]._noProxy ? undefined : (obj[attr1]._preProxy || obj[attr1]); // save original
        obj[attr1] = proxied;
      }
      // Proxy sub-methods (model.*, view.*, etc)
      else if (typeof obj[attr1] === 'object') {
        for (var attr2 in obj[attr1]) {
          var proxied2 = obj[attr1][attr2];
          if (typeof obj[attr1][attr2] === 'function') {
            proxied2 = obj[attr1][attr2]._noProxy ? obj[attr1][attr2] : $.proxy(obj[attr1][attr2]._preProxy || obj[attr1][attr2], dest);
            proxied2._preProxy = obj[attr1][attr2]._noProxy ? undefined : (obj[attr1][attr2]._preProxy || obj[attr1][attr2]); // save original
            proxied[attr2] = proxied2;
          }
        } // for attr2
        obj[attr1] = proxied;
      } // if not func
    } // for attr1
  }; // proxyAll
  
  // Reverses the order of events attached to an object
  util.reverseEvents = function(obj, eventType){
    var events = $(obj).data('events');
    if (events !== undefined && events[eventType] !== undefined){
      // can't reverse what's not there
      var reverseEvents = [];
      for (var e in events[eventType]){
        if (!events[eventType].hasOwnProperty(e)) continue;
        reverseEvents.unshift(events[eventType][e]);
      }
      events[eventType] = reverseEvents;
    }
  }; //reverseEvents
  
  // Determines # of attributes of given object (prototype inclusive)
  util.size = function(obj){
    var size = 0, key;
    for (key in obj) {
      size++;
    }
    return size;
  };
  
  // Find controllers to be extended (with syntax '~'), redefine those to encompass previously defined controllers
  // Example:
  //   var a = $$({}, '<button>A</button>', {'click &': function(){ alert('A'); }});
  //   var b = $$(a, {}, '<button>B</button>', {'~click &': function(){ alert('B'); }});
  // Clicking on button B will alert both 'A' and 'B'.
  util.extendController = function(object) {
    for (var controllerName in object.controller) {
      (function(){ // new scope as we need one new function handler per controller
        var matches, extend, eventName,
            previousHandler, currentHandler, newHandler;

        if (typeof object.controller[controllerName] === 'function') {
          matches = controllerName.match(/^(\~)*(.+)/); // 'click button', '~click button', '_create', etc
          extend = matches[1];
          eventName = matches[2];
        
          if (!extend) return; // nothing to do

          // Redefine controller:
          // '~click button' ---> 'click button' = previousHandler + currentHandler
          previousHandler = object.controller[eventName] ? (object.controller[eventName]._preProxy || object.controller[eventName]) : undefined;
          currentHandler = object.controller[controllerName];
          newHandler = function() {
            if (previousHandler) previousHandler.apply(this, arguments);
            if (currentHandler) currentHandler.apply(this, arguments);
          };

          object.controller[eventName] = newHandler;
          delete object.controller[controllerName]; // delete '~click button'
        } // if function
      })();
    } // for controllerName
  };
  
  //////////////////////////////////////////////////////////////////////////
  //
  //  Default object prototype
  //
  
  defaultPrototype = {
    
    _agility: true,
    
    //////////////////////////////////////////////////////////////////////////
    //
    //  _container
    //
    //    API and related auxiliary functions for storing child Agility objects.
    //    Not all methods are exposed. See 'shortcuts' below for exposed methods.
    //
    
    _container: {

      // Adds child object to container, appends/prepends/etc view, listens for child removal
      _insertObject: function(obj, selector, method){
        var self = this;
        if (!util.isAgility(obj)) {
          throw "agility.js: append argument is not an agility object";
        }
        this._container.children[obj._id] = obj; // children is *not* an array; this is for simpler lookups by global object id
        this.trigger(method, [obj, selector]);
        obj._parent = this;
        // ensures object is removed from container when destroyed:
        obj.bind('destroy', function(event, id){ 
          self._container.remove(id);
        });
        return this;
      },

      append: function(obj, selector) { 
          return this._container._insertObject.call(this, obj, selector, 'append'); 
      },

      prepend: function(obj, selector) { 
          return this._container._insertObject.call(this, obj, selector, 'prepend'); 
      },

      after: function(obj, selector) { 
          return this._container._insertObject.call(this, obj, selector, 'after'); 
      },

      before: function(obj, selector) { 
          return this._container._insertObject.call(this, obj, selector, 'before'); 
      },
      
      // Removes child object from container
      remove: function(id){
        delete this._container.children[id];
        this.trigger('remove', id);
        return this;
      },

      // Iterates over all child objects in container
      each: function(fn){
        $.each(this._container.children, fn);
        return this; // for chainable calls
      },
      
      // Removes all objects in container
      empty: function(){
        this.each(function(){
          this.destroy();
        });
        return this;
      },
      
      // Number of children
      size: function() {
        return util.size(this._container.children);
      }
      
    },

    //////////////////////////////////////////////////////////////////////////
    //
    //  _events
    //
    //    API and auxiliary functions for handling events. Not all methods are exposed.
    //    See 'shortcuts' below for exposed methods.
    //

    _events: {

      // Parses event string like:
      //    'event'          : custom event
      //    'event selector' : DOM event using 'selector'
      // Returns { type:'event' [, selector:'selector'] }
      parseEventStr: function(eventStr){
        var eventObj = { type:eventStr }, 
            spacePos = eventStr.search(/\s/);
        // DOM event 'event selector', e.g. 'click button'
        if (spacePos > -1) {
          eventObj.type = eventStr.substr(0, spacePos);
          eventObj.selector = eventStr.substr(spacePos+1);
        }
        return eventObj;
      },

      // Binds eventStr to fn. eventStr is parsed as per parseEventStr()
      bind: function(eventStr, fn){
        var eventObj = this._events.parseEventStr(eventStr);
        // DOM event 'event selector', e.g. 'click button'
        if (eventObj.selector) {
          // Manually override root selector, as jQuery selectors can't select self object
          if (eventObj.selector === ROOT_SELECTOR) {
            this.view.$().bind(eventObj.type, fn);
          }
          else {          
            this.view.$().delegate(eventObj.selector, eventObj.type, fn);
          }
        }
        // Custom event
        else {
          $(this._events.data).bind(eventObj.type, fn);
        }
        return this; // for chainable calls
      }, // bind

      // Triggers eventStr. Syntax for eventStr is same as that for bind()
      trigger: function(eventStr, params){
        var eventObj = this._events.parseEventStr(eventStr);
        // DOM event 'event selector', e.g. 'click button'
        if (eventObj.selector) {
          // Manually override root selector, as jQuery selectors can't select self object
          if (eventObj.selector === ROOT_SELECTOR) {
            this.view.$().trigger(eventObj.type, params);
          }
          else {          
            this.view.$().find(eventObj.selector).trigger(eventObj.type, params);
          }
        }
        // Custom event
        else {
          $(this._events.data).trigger('_'+eventObj.type, params);
          // fire 'pre' hooks in reverse attachment order ( last first )
          util.reverseEvents(this._events.data, 'pre:' + eventObj.type);
          $(this._events.data).trigger('pre:' + eventObj.type, params);
          // put the order of events back
          util.reverseEvents(this._events.data, 'pre:' + eventObj.type);
          $(this._events.data).trigger(eventObj.type, params);
          if(this.parent())
            this.parent().trigger((eventObj.type.match(/^child:/) ? '' : 'child:') + eventObj.type, params);
          $(this._events.data).trigger('post:' + eventObj.type, params);
        }
        return this; // for chainable calls
      } // trigger
      
    }, // _events

    //////////////////////////////////////////////////////////////////////////
    //
    //  Model
    //
    //    Main model API. All methods are exposed, but methods starting with '_'
    //    are meant to be used internally only.
    //
       
    model: {

      // Setter
      set: function(arg, params) {
        var self = this;
        var modified = []; // list of modified model attributes
        if (typeof arg === 'object') {
          var _clone = false;
          if (params && params.reset) {
            _clone = this.model._data; // hold on to data for change events
            this.model._data = $.extend({}, arg); // erases previous model attributes without pointing to object
          }
          else {
            $.extend(this.model._data, arg); // default is extend
          }
          for (var key in arg) {
            delete _clone[ key ]; // no need to fire change twice
            modified.push(key);
          }
          for (key in _clone) {
            modified.push(key);
          }
        }
        else {
          throw "agility.js: unknown argument type in model.set()";
        }

        // Events
        if (params && params.silent===true) return this; // do not fire events
        this.trigger('change');
        $.each(modified, function(index, val){
          self.trigger('change:'+val);
        });
        return this; // for chainable calls
      },
      
      // Getter
      get: function(arg){
        // Full model getter
        if (arg === undefined) {
          return this.model._data;
        }
        // Attribute getter
        if (typeof arg === 'string') {            
          return this.model._data[arg];
        }
        throw 'agility.js: unknown argument for getter';
      },
      
      // Resetter (to initial model upon object initialization)
      reset: function(){
        this.model.set(this.model._initData, {reset:true});
        return this; // for chainable calls
      },
      
      // Number of model properties
      size: function(){
        return util.size(this.model._data);
      },
      
      // Convenience function - loops over each model property
      each: function(fn){
        $.each(this.model._data, fn);
        return this; // for chainable calls
      }
      
    }, // model prototype
  
    //////////////////////////////////////////////////////////////////////////
    //
    //  View
    //
    //    Main view API. All methods are exposed, but methods starting with '_'
    //    are meant to be used internally only.
    //
  
    view: {
        
      // Defaults
      format: '<div/>',
      style: '',
      
      // Shortcut to view.$root or view.$root.find(), depending on selector presence
      $: function(selector){
        return (!selector || selector === ROOT_SELECTOR) ? this.view.$root : this.view.$root.find(selector);
      },
      
      // Render $root
      // Only function to access $root directly other than $()
      render: function(){
        // Without format there is no view
        if (this.view.format.length === 0) {
          throw "agility.js: empty format in view.render()";
        }                
        if (this.view.$root.size() === 0) {
          this.view.$root = $(this.view.format);
        }
        else {
          this.view.$root.html( $(this.view.format).html() ); // can't overwrite $root as this would reset its presence in the DOM and all events already bound, and 
        }
        // Ensure we have a valid (non-empty) $root
        if (this.view.$root.size() === 0) {
          throw 'agility.js: could not generate html from format';
        }
        return this;
      }, // render
  
      // Parse data-bind string of the type '[attribute][=] variable[, [attribute][=] variable ]...'
      // If the variable is not an attribute, it must occur by itself
      //   all pairs in the list are assumed to be attributes
      // Returns { key:'model key', attr: [ {attr : 'attribute', attrVar : 'variable' }... ] }
      _parseBindStr: function(str){
        var obj = {key:null, attr:[]},
            pairs = str.split(','),
            regex = /([a-zA-Z0-9_\-]+)(?:[\s=]+([a-zA-Z0-9_\-]+))?/,
            keyAssigned = false,
            matched;
        
        if (pairs.length > 0) {
          for (var i = 0; i < pairs.length; i++) {
            matched = pairs[i].match(regex);
            // [ "attribute variable", "attribute", "variable" ]
            // or [ "attribute=variable", "attribute", "variable" ]
            // or
            // [ "variable", "variable", undefined ]
            // in some IE it will be [ "variable", "variable", "" ]
            // or
            // null
            if (matched) {
              if (typeof(matched[2]) === "undefined" || matched[2] === "") {
                if (keyAssigned) {
                  throw new Error("You may specify only one key (" + 
                    keyAssigned + " has already been specified in data-bind=" + 
                    str + ")");
                } else {
                  keyAssigned = matched[1];
                  obj.key = matched[1];
                }
              } else {
                obj.attr.push({attr: matched[1], attrVar: matched[2]});
              }
            } // if (matched)
          } // for (pairs.length)
        } // if (pairs.length > 0)
        
        return obj;
      },
      
      // Apply two-way (DOM <--> Model) bindings to elements with 'data-bind' attributes
      bindings: function(){
        var self = this;
        var $rootNode = this.view.$().filter('[data-bind]');
        var $childNodes = this.view.$('[data-bind]');
        var createAttributePairClosure = function(bindData, node, i) {
          var attrPair = bindData.attr[i]; // capture the attribute pair in closure
          return function() {
            node.attr(attrPair.attr, self.model.get(attrPair.attrVar));
          };
        };
        $rootNode.add($childNodes).each(function(){
          var $node = $(this);
          var bindData = self.view._parseBindStr( $node.data('bind') );

          var bindAttributesOneWay = function() {
            // 1-way attribute binding
            if (bindData.attr) {
              for (var i = 0; i < bindData.attr.length; i++) {
                self.bind('_change:'+bindData.attr[i].attrVar,
                  createAttributePairClosure(bindData, $node, i));
              } // for (bindData.attr)
            } // if (bindData.attr)
          }; // bindAttributesOneWay()
          
          // <input type="checkbox">: 2-way binding
          if ($node.is('input:checkbox')) {
            // Model --> DOM
            self.bind('_change:'+bindData.key, function(){
              $node.prop("checked", self.model.get(bindData.key)); // this won't fire a DOM 'change' event, saving us from an infinite event loop (Model <--> DOM)
            });            
            // DOM --> Model
            $node.change(function(){
              var obj = {};
              obj[bindData.key] = $(this).prop("checked");
              self.model.set(obj); // not silent as user might be listening to change events
            });
            // 1-way attribute binding
            bindAttributesOneWay();
          }
          
          // <select>: 2-way binding
          else if ($node.is('select')) {
            // Model --> DOM
            self.bind('_change:'+bindData.key, function(){
              var nodeName = $node.attr('name');
              var modelValue = self.model.get(bindData.key);
              $node.val(modelValue);
            });            
            // DOM --> Model
            $node.change(function(){
              var obj = {};
              obj[bindData.key] = $node.val();
              self.model.set(obj); // not silent as user might be listening to change events
            });
            // 1-way attribute binding
            bindAttributesOneWay();
          }
          
          // <input type="radio">: 2-way binding
          else if ($node.is('input:radio')) {
            // Model --> DOM
            self.bind('_change:'+bindData.key, function(){
              var nodeName = $node.attr('name');
              var modelValue = self.model.get(bindData.key);
              $node.siblings('input[name="'+nodeName+'"]').filter('[value="'+modelValue+'"]').prop("checked", true); // this won't fire a DOM 'change' event, saving us from an infinite event loop (Model <--> DOM)
            });            
            // DOM --> Model
            $node.change(function(){
              if (!$node.prop("checked")) return; // only handles check=true events
              var obj = {};
              obj[bindData.key] = $node.val();
              self.model.set(obj); // not silent as user might be listening to change events
            });
            // 1-way attribute binding
            bindAttributesOneWay();
          }
          
          // <input type="search"> (model is updated after every keypress event)
          else if ($node.is('input[type="search"]')) {
            // Model --> DOM
            self.bind('_change:'+bindData.key, function(){
              $node.val(self.model.get(bindData.key)); // this won't fire a DOM 'change' event, saving us from an infinite event loop (Model <--> DOM)
            });
            // Model <-- DOM
            $node.keypress(function(){
              // Without timeout $node.val() misses the last entered character
              setTimeout(function(){
                var obj = {};
                obj[bindData.key] = $node.val();
                self.model.set(obj); // not silent as user might be listening to change events
              }, 50);
            });
            // 1-way attribute binding
            bindAttributesOneWay();
          }

          // <input type="text">, <input>, and <textarea>: 2-way binding
          else if ($node.is('input:text, textarea')) {
            // Model --> DOM
            self.bind('_change:'+bindData.key, function(){
              $node.val(self.model.get(bindData.key)); // this won't fire a DOM 'change' event, saving us from an infinite event loop (Model <--> DOM)
            });            
            // Model <-- DOM
            $node.change(function(){
              var obj = {};
              obj[bindData.key] = $(this).val();
              self.model.set(obj); // not silent as user might be listening to change events
            });
            // 1-way attribute binding
            bindAttributesOneWay();
          }
          
          // all other <tag>s: 1-way binding
          else {
            if (bindData.key) {
              self.bind('_change:'+bindData.key, function(){
                if (self.model.get(bindData.key)) {
                  $node.text(self.model.get(bindData.key).toString());
                } else {
                  $node.text('');
                }
              });
            }
            bindAttributesOneWay();
          }
        }); // nodes.each()
        return this;
      }, // bindings()
      
      // Triggers _change and _change:* events so that view is updated as per view.bindings()
      sync: function(){
        var self = this;
        // Trigger change events so that view is updated according to model
        this.model.each(function(key, val){
          self.trigger('_change:'+key);
        });
        if (this.model.size() > 0) {
          this.trigger('_change');
        }
        return this;
      },

      // Applies style dynamically
      stylize: function(){
        var objClass,
            regex = new RegExp(ROOT_SELECTOR, 'g');
        if (this.view.style.length === 0 || this.view.$().size() === 0) {
          return;
        }
        // Own style
        // Object gets own class name ".agility_123", and <head> gets a corresponding <style>
        if (this.view.hasOwnProperty('style')) {
          objClass = 'agility_' + this._id;
          var styleStr = this.view.style.replace(regex, '.'+objClass);
          $('head', window.document).append('<style type="text/css">'+styleStr+'</style>');
          this.view.$().addClass(objClass);
        }
        // Inherited style
        // Object inherits CSS class name from first ancestor to have own view.style
        else {
          // Returns id of first ancestor to have 'own' view.style
          var ancestorWithStyle = function(object) {
            while (object !== null) {
              object = Object.getPrototypeOf(object);
              if (object.view.hasOwnProperty('style'))
                return object._id;
            }
            return undefined;
          }; // ancestorWithStyle

          var ancestorId = ancestorWithStyle(this);
          objClass = 'agility_' + ancestorId;
          this.view.$().addClass(objClass);
        }
        return this;
      }
      
    }, // view prototype
  
    //////////////////////////////////////////////////////////////////////////
    //
    //  Controller
    //
    //    Default controllers, i.e. event handlers. Event handlers that start
    //    with '_' are of internal use only, and take precedence over any other
    //    handler without that prefix. (See trigger()).
    //
   
    controller: {
  
      // Triggered after self creation
      _create: function(event){
        this.view.stylize();
        this.view.bindings(); // Model-View bindings
        this.view.sync(); // syncs View with Model
      },
  
      // Triggered upon removing self
      _destroy: function(event){
        // destroy any appended agility objects
        this._container.empty();
        // destroy self
        this.view.$().remove();
      },

      // Triggered after child obj is appended to container
      _append: function(event, obj, selector){
        this.view.$(selector).append(obj.view.$());
      },

      // Triggered after child obj is prepended to container
      _prepend: function(event, obj, selector){
        this.view.$(selector).prepend(obj.view.$());
      },

      // Triggered after child obj is inserted in the container
      _before: function(event, obj, selector){
        if (!selector) throw 'agility.js: _before needs a selector';
        this.view.$(selector).before(obj.view.$());
      },

      // Triggered after child obj is inserted in the container
      _after: function(event, obj, selector){
        if (!selector) throw 'agility.js: _after needs a selector';
        this.view.$(selector).after(obj.view.$());
      },

      // Triggered after a child obj is removed from container (or self-removed)
      _remove: function(event, id){        
      },

      // Triggered after model is changed
      '_change': function(event){
      }
      
    }, // controller prototype

    //////////////////////////////////////////////////////////////////////////
    //
    //  Shortcuts
    //
        
    //
    // Self
    //    
    destroy: function() {
      this.trigger('destroy', this._id); // parent must listen to 'remove' event and handle container removal!
      // can't return this as it might not exist anymore!
    },
    parent: function(){
      return this._parent;
    },
    
    //
    // _container shortcuts
    //
    append: function(){
      this._container.append.apply(this, arguments);
      return this; // for chainable calls
    },
    prepend: function(){
      this._container.prepend.apply(this, arguments);
      return this; // for chainable calls
    },
    after: function(){
      this._container.after.apply(this, arguments);
      return this; // for chainable calls
    },
    before: function(){
      this._container.before.apply(this, arguments);
      return this; // for chainable calls
    },
    remove: function(){
      this._container.remove.apply(this, arguments);
      return this; // for chainable calls
    },
    size: function(){
      return this._container.size.apply(this, arguments);
    },
    each: function(){
      return this._container.each.apply(this, arguments);
    },
    empty: function(){
      return this._container.empty.apply(this, arguments);
    },

    //
    // _events shortcuts
    //
    bind: function(){
      this._events.bind.apply(this, arguments);
      return this; // for chainable calls
    },
    trigger: function(){
      this._events.trigger.apply(this, arguments);
      return this; // for chainable calls
    }
      
  }; // prototype
  
  //////////////////////////////////////////////////////////////////////////
  //
  //  Main object builder
  //
  
  // Main agility object builder
  agility = function(){
    
    // Real array of arguments
    var args = Array.prototype.slice.call(arguments, 0),
    
    // Object to be returned by builder
    object = {},
    
    prototype = defaultPrototype;
            
    //////////////////////////////////////////////////////////////////////////
    //
    //  Define object prototype
    //

    // Inherit object prototype
    if (typeof args[0] === "object" && util.isAgility(args[0])) {
      prototype = args[0];    
      args.shift(); // remaining args now work as though object wasn't specified
    } // build from agility object
    
    // Build object from prototype as well as the individual prototype parts
    // This enables differential inheritance at the sub-object level, e.g. object.view.format
    object = Object.create(prototype);
    object.model = Object.create(prototype.model);
    object.view = Object.create(prototype.view);
    object.controller = Object.create(prototype.controller);
    object._container = Object.create(prototype._container);
    object._events = Object.create(prototype._events);

    // Fresh 'own' properties (i.e. properties that are not inherited at all)
    object._id = idCounter++;
    object._parent = null;
    object._events.data = {}; // event bindings will happen below
    object._container.children = {};
    object.view.$root = $(); // empty jQuery object

    // Cloned own properties (i.e. properties that are inherited by direct copy instead of by prototype chain)
    // This prevents children from altering parents models
    object.model._data = prototype.model._data ? $.extend(true, {}, prototype.model._data) : {};
    object._data = prototype._data ? $.extend(true, {}, prototype._data) : {};

    //////////////////////////////////////////////////////////////////////////
    //
    //  Extend model, view, controller
    //

    // Just the default prototype
    if (args.length === 0) {
    }
  
    // Prototype differential from single {model,view,controller} object
    else if (args.length === 1 && typeof args[0] === 'object' && (args[0].model || args[0].view || args[0].controller) ) {
      for (var prop in args[0]) {
        if (prop === 'model') {
          $.extend(object.model._data, args[0].model);
        }
        else if (prop === 'view') {
          $.extend(object.view, args[0].view);
        }
        else if (prop === 'controller') {
          $.extend(object.controller, args[0].controller);
          util.extendController(object);
        }
        // User-defined methods
        else {
          object[prop] = args[0][prop];
        }
      }
    } // {model, view, controller} arg
    
    // Prototype differential from separate {model}, {view}, {controller} arguments
    else {
      
      // Model from string
      if (typeof args[0] === 'object') {
        $.extend(object.model._data, args[0]);
      }
      else if (args[0]) {
        throw "agility.js: unknown argument type (model)";
      }

      // View format from shorthand string (..., '<div>whatever</div>', ...)
      if (typeof args[1] === 'string') {
        object.view.format = args[1]; // extend view with .format
      }  
      // View from object (..., {format:'<div>whatever</div>'}, ...)
      else if (typeof args[1] === 'object') {
        $.extend(object.view, args[1]);
      }      
      else if (args[1]) {
        throw "agility.js: unknown argument type (view)";
      }
      
      // View style from shorthand string (..., ..., 'p {color:red}', ...)
      if (typeof args[2] === 'string') {
        object.view.style = args[2];
        args.splice(2, 1); // so that controller code below works
      }
      
      // Controller from object (..., ..., {method:function(){}})
      if (typeof args[2] === 'object') {
        $.extend(object.controller, args[2]);
        util.extendController(object);
      }
      else if (args[2]) {
        throw "agility.js: unknown argument type (controller)";
      }
      
    } // ({model}, {view}, {controller}) args
    
    //////////////////////////////////////////////////////////////////////////
    //
    //  Bootstrap: Bindings, initializations, etc
    //
    
    // Save model's initial state (so it can be .reset() later)
    object.model._initData = $.extend({}, object.model._data);

    // object.* will have their 'this' === object. This should come before call to object.* below.
    util.proxyAll(object, object);

    // Initialize $root, needed for DOM events binding below
    object.view.render();
  
    // Bind all controllers to their events

    var bindEvent = function(ev, handler){
      if (typeof handler === 'function') {
        object.bind(ev, handler);
      }
    };

    for (var eventStr in object.controller) {
      var events = eventStr.split(';');
      var handler = object.controller[eventStr];
      $.each(events, function(i, ev){
        ev = ev.trim();
        bindEvent(ev, handler);
      });
    }


    // Auto-triggers create event
    object.trigger('create');    
    
    return object;
    
  }; // agility
  
  //////////////////////////////////////////////////////////////////////////
  //
  //  Global objects
  //
  
  // $$.document is a special Agility object, whose view is attached to <body>
  // This object is the main entry point for all DOM operations
  agility.document = agility({
    view: {
      $: function(selector){ return selector ? $(selector, 'body') : $('body'); }
    },
    controller: {
      // Override default controller
      // (don't render, don't stylize, etc)
      _create: function(){}
    }
  });
  
  // Shortcut to prototype for plugins
  agility.fn = defaultPrototype;
  
  // isAgility test
  agility.isAgility = function(obj) {
    if (typeof obj !== 'object') return false;
    return util.isAgility(obj);
  };

  // Globals
  window.agility = window.$$ = agility;

  //////////////////////////////////////////////////////////////////////////
  //
  //  Bundled plugin: persist
  //
  
  // Main initializer
  agility.fn.persist = function(adapter, params){
    var id = 'id'; // name of id attribute
        
    this._data.persist = $.extend({adapter:adapter}, params);
    this._data.persist.openRequests = 0;
    if (params && params.id) {
      id = params.id;
    }

    // Creates persist methods
    
    // .save()
    // Creates new model or update existing one, depending on whether model has 'id' property
    this.save = function(){
      var self = this;
      if (this._data.persist.openRequests === 0) {
        this.trigger('persist:start');
      }
      this._data.persist.openRequests++;
      this._data.persist.adapter.call(this, {
        type: this.model.get(id) ? 'PUT' : 'POST', // update vs. create
        id: this.model.get(id),
        data: this.model.get(),
        complete: function(){
          self._data.persist.openRequests--;
          if (self._data.persist.openRequests === 0) {
            self.trigger('persist:stop');
          }
        },
        success: function(data, textStatus, jqXHR){
          if (data[id]) {
            // id in body
            self.model.set({id:data[id]}, {silent:true});
          }
          else if (jqXHR.getResponseHeader('Location')) {
            // parse id from Location
            self.model.set({ id: jqXHR.getResponseHeader('Location').match(/\/([0-9]+)$/)[1] }, {silent:true});
          }
          self.trigger('persist:save:success');
        },
        error: function(){
          self.trigger('persist:error');
          self.trigger('persist:save:error');
        }
      });
      
      return this; // for chainable calls
    }; // save()
  
    // .load()
    // Loads model with given id
    this.load = function(){
      var self = this;
      if (this.model.get(id) === undefined) throw 'agility.js: load() needs model id';
    
      if (this._data.persist.openRequests === 0) {
        this.trigger('persist:start');
      }
      this._data.persist.openRequests++;
      this._data.persist.adapter.call(this, {
        type: 'GET',
        id: this.model.get(id),
        complete: function(){
          self._data.persist.openRequests--;
          if (self._data.persist.openRequests === 0) {
            self.trigger('persist:stop');
          }
        },
        success: function(data, textStatus, jqXHR){
          self.model.set(data);
          self.trigger('persist:load:success');
        },      
        error: function(){
          self.trigger('persist:error');
          self.trigger('persist:load:error');
        }
      });      

      return this; // for chainable calls
    }; // load()

    // .erase()
    // Erases model with given id
    this.erase = function(){
      var self = this;
      if (this.model.get(id) === undefined) throw 'agility.js: erase() needs model id';
    
      if (this._data.persist.openRequests === 0) {
        this.trigger('persist:start');
      }
      this._data.persist.openRequests++;
      this._data.persist.adapter.call(this, {
        type: 'DELETE',
        id: this.model.get(id),
        complete: function(){
          self._data.persist.openRequests--;
          if (self._data.persist.openRequests === 0) {
            self.trigger('persist:stop');
          }
        },
        success: function(data, textStatus, jqXHR){
          self.destroy();
          self.trigger('persist:erase:success');
        },      
        error: function(){
          self.trigger('persist:error');
          self.trigger('persist:erase:error');
        }
      });            

      return this; // for chainable calls
    }; // erase()

    // .gather()
    // Loads collection and appends/prepends (depending on method) at selector. All persistence data including adapter comes from proto, not self
    this.gather = function(proto, method, selectorOrQuery, query){      
      var selector, self = this;
      if (!proto) throw "agility.js plugin persist: gather() needs object prototype";
      if (!proto._data.persist) throw "agility.js plugin persist: prototype doesn't seem to contain persist() data";

      // Determines arguments
      if (query) {
        selector = selectorOrQuery;        
      }
      else {
        if (typeof selectorOrQuery === 'string') {
          selector = selectorOrQuery;
        }
        else {
          selector = undefined;
          query = selectorOrQuery;
        }
      }

      if (this._data.persist.openRequests === 0) {
        this.trigger('persist:start');
      }
      this._data.persist.openRequests++;
      proto._data.persist.adapter.call(proto, {
        type: 'GET',
        data: query,
        complete: function(){
          self._data.persist.openRequests--;
          if (self._data.persist.openRequests === 0) {
            self.trigger('persist:stop');
          }
        },
        success: function(data){
          $.each(data, function(index, entry){
            var obj = $$(proto, entry);
            if (typeof method === 'string') {
              self[method](obj, selector);
            }
          });
          self.trigger('persist:gather:success', {data:data});
        },
        error: function(){
          self.trigger('persist:error');
          self.trigger('persist:gather:error');
        }
      });
    
      return this; // for chainable calls
    }; // gather()
  
    return this; // for chainable calls
  }; // fn.persist()
  
  // Persistence adapters
  // These are functions. Required parameters:
  //    {type: 'GET' || 'POST' || 'PUT' || 'DELETE'}
  agility.adapter = {};

  // RESTful JSON adapter using jQuery's ajax()
  agility.adapter.restful = function(_params){
    var params = $.extend({
      dataType: 'json',
      url: (this._data.persist.baseUrl || 'api/') + this._data.persist.collection + (_params.id ? '/'+_params.id : '')
    }, _params);
    $.ajax(params);
  };
  
})(window);
