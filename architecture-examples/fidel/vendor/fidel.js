/*!
  * Fidel - A javascript controller
  * v1.2.2
  * https://github.com/jgallen23/fidel
  * copyright JGA 2011
  * MIT License
  */

!function (name, definition) {
  if (typeof module != 'undefined' && module.exports) module.exports = definition();
  else if (typeof define == 'function' && typeof define.amd == 'object') define(definition);
  else this[name] = definition();
}('Fidel', function() {

var context = this;
var Fidel = {};
Fidel.guid = function(){
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  }).toUpperCase();      
};
Fidel.extend = function() {
  throw new Error("Fidel.extend is deprecated, please use Fidel.ViewController.extend");
};

var o = context.Fidel;
Fidel.noConflict = function() {
  context.Fidel = o;
  return this;
};

var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
// The base Class implementation (does nothing)
Fidel.Class = function(){};

// Create a new Class that inherits from this class
Fidel.Class.extend = function(prop) {
  var _super = this.prototype;
  
  // Instantiate a base class (but only create the instance,
  // don't run the init constructor)
  initializing = true;
  var prototype = new this();
  initializing = false;
  
  // Copy the properties over onto the new prototype
  for (var name in prop) {
    // Check if we're overwriting an existing function
    prototype[name] = typeof prop[name] == "function" && 
      typeof _super[name] == "function" && fnTest.test(prop[name]) ?
      (function(name, fn){
        return function() {
          var tmp = this._super;
          
          // Add a new ._super() method that is the same method
          // but on the super-class
          this._super = _super[name];
          
          // The method only need to be bound temporarily, so we
          // remove it when we're done executing
          var ret = fn.apply(this, arguments);        
          this._super = tmp;
          
          return ret;
        };
      })(name, prop[name]) :
      prop[name];
  }
  
  // The dummy class constructor
  function Class(opt) {
    // All construction is actually done in the init method
    if (!initializing) {
      if (this.defaults) {
        for (var key in this.defaults) {
          if (typeof opt !== 'object' || !opt[key]) this[key] = this.defaults[key];
        }
      }
      if (typeof opt === 'object') {
        for (var okey in opt) {
          this[okey] = opt[okey];
        }
      }
      if (!this.guid) this.guid = Fidel.guid();
      if (this._initialize) this._initialize.apply(this, arguments);
      if (this.init) this.init.apply(this, arguments);
    }
  }
  
  // Populate our constructed prototype object
  Class.prototype = prototype;
  Class.prototype.proxy = function(func) {
    var thisObject = this;
    return(function(){ 
      if (!func) return;
      return func.apply(thisObject, arguments); 
    });
  };
  
  // Enforce the constructor to be what we expect
  Class.constructor = Class;

  // And make this class extendable
  Class.extend = arguments.callee;
  
  return Class;
};

var cache = {}; //check for "c_" cache for unit testing
//publish("/some/topic", ["a","b","c"]);
Fidel.publish = function(topic, args){

  var subs = cache[topic], len = subs ? subs.length : 0;

  //can change loop or reverse array if the order matters
  while(len--){
    subs[len].apply(this, args || []);
  }
};
//subscribe("/some/topic", function(a, b, c){ /* handle data */ });
Fidel.subscribe = function(topic, callback){
  if(!cache[topic]){
          cache[topic] = [];
  }
  cache[topic].push(callback);
  return [topic, callback]; // Array
};
//var handle = subscribe("/some/topic", function(){});
//unsubscribe(handle);
Fidel.unsubscribe = function(handle){
  var subs = cache[handle[0]],
            callback = handle[1],
            len = subs ? subs.length : 0;

  while(len--){
    if(subs[len] === callback){
    subs.splice(len, 1);
    }
  }
};


Fidel.Class.prototype.on = Fidel.Class.prototype.bind = function(name, callback) {
  return Fidel.subscribe(this.guid+"."+name, this.proxy(callback));
};
Fidel.Class.prototype.emit = Fidel.Class.prototype.trigger = function(name, data) {
  Fidel.publish(this.guid+"."+name, data);
  Fidel.publish(name, data);
};
Fidel.Class.prototype.removeListener = Fidel.Class.prototype.unbind = function(handle) {
  Fidel.unsubscribe(handle);
};

!function() {
  var templateCache = {};
  Fidel.template = function tmpl(template, data) {
    var fn = !/\W/.test(template) ?
    templateCache[template] = templateCache[template] ||
      tmpl(template) :
    new Function("obj",
      "var p=[],print=function(){p.push.apply(p,arguments);};" +
      "with(obj){p.push('" +
      template
      .replace(/[\r\t\n]/g, "")
      .split("{!").join("\t")
      .replace(/((^|!})[^\t]*)'/g, "$1\r")
      .replace(/\t=(.*?)!}/g, "',$1,'")
      .split("\t").join("');")
      .split("!}").join("p.push('")
      .split("\r").join("\\'")
    + "');}return p.join('');");
    return data ? fn( data ) : fn;
  };
}();

var eventSplitter = /^(\w+)\s*(.*)$/;

var ViewController = Fidel.Class.extend({
  _initialize: function(options) {

    if (!this.el) throw "el is required";
    
    this._subscribeHandles = {};
    if (this.events) this.delegateEvents();
    if (this.elements) this.refreshElements();
    if (this.templates) this.loadTemplates();
    if (!this.actionEvent) this.actionEvent = "click";
    if (this.subscribe) this.bindSubscriptions();
    this.delegateActions();
    this.getDataElements();
  },
  template: Fidel.template,
  delegateEvents: function() {
    for (var key in this.events) {
      var methodName = this.events[key];
      var match = key.match(eventSplitter);
      var eventName = match[1], selector = match[2];

      var method = this.proxy(this[methodName]);

      if (selector === '') {
        this.el.bind(eventName, method);
      } else {
        this.el.delegate(selector, eventName, method);
      }
    }
  },
  delegateActions: function() {
    var self = this;
    this.el.delegate('[data-action]', this.actionEvent, function(e) {
      var el = $(this);
      var methodName = el.attr('data-action');
      if (self[methodName]) self[methodName].call(self, el, e);
    });
  },
  refreshElements: function() {
    for (var key in this.elements) {
      this[key] = this.find(this.elements[key]);
    }
  },
  getDataElements: function() {
    var self = this;
    var elements = this.find("[data-element]");
    for (var i = 0, c = elements.length; i < c; i++) {
      var name = elements[i].getAttribute('data-element');
      if (!self[name]) {
        var elem = this.find('[data-element="'+name+'"]');
        self[name] = elem;
      }
    }
  },
  bindSubscriptions: function() {
    for (var key in this.subscribe) {
      this._subscribeHandles[key] = Fidel.subscribe(key, this.proxy(this[this.subscribe[key]]));
    }
  },
  loadTemplates: function() {
    for (var name in this.templates) {
      this.templates[name] = $(this.templates[name]).html();
    }
  },
  find: function(selector) {
    return $(selector, this.el[0]);
  },
  render: function(templateName, data, selector) {
    if (arguments.length == 1) {
      data = templateName;
      templateName = this.primaryTemplate;
    }
    template = this.templates[templateName];
    if (!template) return;
    var tmp = this.template(template, data);
    selector = (selector)?$(selector):this.el;
    selector.html(tmp);
  },
  destroy: function() {
    for (var key in this._subscribeHandles) {
      Fidel.unsubscribe(this._subscribeHandles[key]);
    }
    this.el.undelegate('[data-action]', this.actionEvent);
    this.el = null;
  }
});
Fidel.ViewController = ViewController;

  return Fidel;
});
