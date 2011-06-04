(function(){
  
  var Spine;
  if (typeof exports !== "undefined") {
    Spine = exports;
  } else {
    Spine = this.Spine = {};
  }
  
  Spine.version = "0.0.3";
  
  var $ = Spine.$ = this.jQuery || this.Zepto;
  
  var makeArray = Spine.makeArray = function(args){
    return Array.prototype.slice.call(args, 0);
  };
  
  // Shim Array, as these functions aren't in IE
  if (typeof Array.prototype.indexOf === "undefined")
    Array.prototype.indexOf = function(value){
      for ( var i = 0; i < this.length; i++ )
    		if ( this[ i ] === value )
    			return i;
    	return -1;
    };
  
  var Events = Spine.Events = {
    bind: function(ev, callback) {
      var evs   = ev.split(" ");
      var calls = this._callbacks || (this._callbacks = {});
      
      for (var i=0; i < evs.length; i++)
        (this._callbacks[evs[i]] || (this._callbacks[evs[i]] = [])).push(callback);

      return this;
    },

    trigger: function() {
      var args = makeArray(arguments);
      var ev   = args.shift();
            
      var list, calls, i, l;
      if (!(calls = this._callbacks)) return false;
      if (!(list  = this._callbacks[ev])) return false;
      
      for (i = 0, l = list.length; i < l; i++)
        if (list[i].apply(this, args) === false)
          break;

      return true;
    },
    
    unbind: function(ev, callback){
      if ( !ev ) {
        this._callbacks = {};
        return this;
      }
      
      var list, calls, i, l;
      if (!(calls = this._callbacks)) return this;
      if (!(list  = this._callbacks[ev])) return this;
      
      if ( !callback ) {
        delete this._callbacks[ev];
        return this;
      }
      
      for (i = 0, l = list.length; i < l; i++)
        if (callback === list[i]) {
          list.splice(i, 1);
          break;
        }
        
      return this;
    }
  };
  
  var Log = Spine.Log = {
    trace: true,
    
    logPrefix: "(App)",

    log: function(){
      if ( !this.trace ) return;
      if (typeof console == "undefined") return;
      var args = makeArray(arguments);
      if (this.logPrefix) args.unshift(this.logPrefix);
      console.log.apply(console, args);
      return this;
    }
  };
  
  // Classes (or prototypial inheritors)
  
  if (typeof Object.create !== "function")
      Object.create = function(o) {
        function F() {}
        F.prototype = o;
        return new F();
      };
      
  var moduleKeywords = ["included", "extended"];

  var Class = Spine.Class = {
    inherited: function(){},
    created: function(){},
    
    prototype: {
      initializer: function(){},
      init: function(){}
    },

    create: function(include, extend){
      var object = Object.create(this);
      object.parent    = this;
      object.prototype = object.fn = Object.create(this.prototype);

      if (include) object.include(include);
      if (extend)  object.extend(extend);

      object.created();
      this.inherited(object);
      return object;
    },

    init: function(){
      var initance = Object.create(this.prototype);
      initance.parent = this;

      initance.initializer.apply(initance, arguments);
      initance.init.apply(initance, arguments);
      return initance;
    },

    proxy: function(func){
      var thisObject = this;
      return(function(){ 
        return func.apply(thisObject, arguments); 
      });
    },
    
    proxyAll: function(){
      var functions = makeArray(arguments);
      for (var i=0; i < functions.length; i++)
        this[functions[i]] = this.proxy(this[functions[i]]);
    },

    include: function(obj){
      for(var key in obj)
        if (moduleKeywords.indexOf(key) == -1)
          this.fn[key] = obj[key];
      
      var included = obj.included;
      if (included) included.apply(this);
      return this;
    },

    extend: function(obj){
      for(var key in obj)
        if (moduleKeywords.indexOf(key) == -1)
          this[key] = obj[key];
      
      var extended = obj.extended;
      if (extended) extended.apply(this);
      return this;
    }
  };
  
  Class.prototype.proxy    = Class.proxy;
  Class.prototype.proxyAll = Class.proxyAll;
  Class.inst               = Class.init;
  Class.sub                = Class.create;

  // Models
  
  Spine.guid = function(){
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    }).toUpperCase();      
  };

  var Model = Spine.Model = Class.create();
  
  Model.extend(Events);

  Model.extend({
    setup: function(name, atts){
      var model = Model.sub();
      if (name) model.name = name;
      if (atts) model.attributes = atts;
      return model;
    },
    
    created: function(sub){
      this.records = {};
      this.attributes = [];

      this.bind("create",  this.proxy(function(record){ 
        this.trigger("change", "create", record);
      }));
      this.bind("update",  this.proxy(function(record){ 
        this.trigger("change", "update", record);
      }));
      this.bind("destroy", this.proxy(function(record){ 
        this.trigger("change", "destroy", record);
      }));
    },

    find: function(id){
      var record = this.records[id];
      if ( !record ) throw("Unknown record");
      return record.clone();
    },

    exists: function(id){
      try {
        return this.find(id);
      } catch (e) {
        return false;
      }
    },

    refresh: function(values){
      this.records = {};

      for (var i=0, il = values.length; i < il; i++) {    
        var record = this.init(values[i]);
        record.newRecord = false;
        this.records[record.id] = record;
      }

      this.trigger("refresh");
    },

    select: function(callback){
      var result = [];

      for (var key in this.records)
        if (callback(this.records[key]))
          result.push(this.records[key]);

      return this.cloneArray(result);
    },

    findByAttribute: function(name, value){
      for (var key in this.records)
        if (this.records[key][name] == value)
          return this.records[key].clone();
    },

    findAllByAttribute: function(name, value){
      return(this.select(function(item){
        return(item[name] == value);
      }));
    },

    each: function(callback){
      for (var key in this.records)
        callback(this.records[key]);
    },

    all: function(){
      return this.cloneArray(this.recordsValues());
    },

    first: function(){
      var record = this.recordsValues()[0];
      return(record && record.clone());
    },

    last: function(){
      var values = this.recordsValues()
      var record = values[values.length - 1];
      return(record && record.clone());
    },

    count: function(){
      return this.recordsValues().length;
    },

    deleteAll: function(){
      for (var key in this.records)
        delete this.records[key];
    },

    destroyAll: function(){
      for (var key in this.records)
        this.records[key].destroy();
    },

    update: function(id, atts){
      this.find(id).updateAttributes(atts);
    },

    create: function(atts){
      var record = this.init(atts);
      record.save();
      return record;
    },

    destroy: function(id){
      this.find(id).destroy();
    },

    sync: function(callback){
      this.bind("change", callback);
    },

    fetch: function(callback){
      callback ? this.bind("fetch", callback) : this.trigger("fetch");
    },

    toJSON: function(){
      return this.recordsValues();
    },
    
    fromJSON: function(objects){
      var self = this;
      if (typeof objects == "string")
        objects = JSON.parse(objects)
      if (typeof objects == "array")
        return($.map(objects, function(){
          return self.init(this);
        }));
      else
       return this.init(objects);
    },

    // Private

    recordsValues: function(){
      var result = [];
      for (var key in this.records)
        result.push(this.records[key]);
      return result;
    },

    cloneArray: function(array){
      var result = [];
      for (var i=0; i < array.length; i++)
        result.push(array[i].dup());
      return result;
    }
  });

  Model.include({
    model: true,
    newRecord: true,

    init: function(atts){
      if (atts) this.load(atts);
    },

    isNew: function(){
      return this.newRecord;
    },
    
    isValid: function(){
      return(!this.validate());
    },

    validate: function(){ },

    load: function(atts){
      for(var name in atts)
        this[name] = atts[name];
    },

    attributes: function(){
      var result = {};
      for (var i=0; i < this.parent.attributes.length; i++) {
        var attr = this.parent.attributes[i];
        result[attr] = this[attr];
      }
      result.id = this.id;
      return result;
    },

    eql: function(rec){
      return(rec && rec.id === this.id && 
             rec.parent === this.parent);
    },

    save: function(){
      var error = this.validate();
      if ( error ) {
        if ( !this.trigger("error", this, error) )
          throw("Validation failed: " + error);
      }
      
      this.trigger("beforeSave", this);
      this.newRecord ? this.create() : this.update();
      this.trigger("save", this);
      return this;
    },

    updateAttribute: function(name, value){
      this[name] = value;
      return this.save();
    },

    updateAttributes: function(atts){
      this.load(atts);
      return this.save();
    },

    destroy: function(){
      this.trigger("beforeDestroy", this);
      delete this.parent.records[this.id];
      this.trigger("destroy", this);
    },

    dup: function(){
      var result = this.parent.init(this.attributes());
      result.newRecord = this.newRecord;
      return result;
    },
    
    clone: function(){
      return Object.create(this);
    },

    reload: function(){
      if ( this.newRecord ) return this;
      var original = this.parent.find(this.id);
      this.load(original.attributes());
      return original;
    },

    toJSON: function(){
      return(this.attributes());
    },
    
    exists: function(){
      return(this.id && this.id in this.parent.records);
    },

    // Private

    update: function(){
      this.trigger("beforeUpdate", this);
      var records = this.parent.records;
      records[this.id].load(this.attributes());
      this.trigger("update", records[this.id].clone());
    },

    create: function(){
      this.trigger("beforeCreate", this);
      if ( !this.id ) this.id = Spine.guid();
      this.newRecord   = false;
      var records      = this.parent.records;
      records[this.id] = this.dup();
      this.trigger("create", records[this.id].clone());
    },
    
    bind: function(events, callback){
      return this.parent.bind(events, this.proxy(function(record){
        if ( record && this.eql(record) )
          callback.apply(this, arguments);
      }));
    },
    
    trigger: function(){
      return this.parent.trigger.apply(this.parent, arguments);
    }
  });
  
  // Controllers
  
  var eventSplitter = /^(\w+)\s*(.*)$/;
  
  var Controller = Spine.Controller = Class.create({
    tag: "div",
    
    initializer: function(options){
      this.options = options;

      for (var key in this.options)
        this[key] = this.options[key];

      if (!this.el) this.el = document.createElement(this.tag);
      this.el = $(this.el);

      if ( !this.events ) this.events = this.parent.events;
      if ( !this.elements ) this.elements = this.parent.elements;

      if (this.events) this.delegateEvents();
      if (this.elements) this.refreshElements();
      if (this.proxied) this.proxyAll.apply(this, this.proxied);
    },
        
    $: function(selector){
      return $(selector, this.el);
    },
        
    delegateEvents: function(){
      for (var key in this.events) {
        var methodName = this.events[key];
        var method     = this.proxy(this[methodName]);

        var match      = key.match(eventSplitter);
        var eventName  = match[1], selector = match[2];

        if (selector === '') {
          this.el.bind(eventName, method);
        } else {
          this.el.delegate(selector, eventName, method);
        }
      }
    },
    
    refreshElements: function(){
      for (var key in this.elements) {
        this[this.elements[key]] = this.$(key);
      }
    },
    
    delay: function(func, timeout){
      setTimeout(this.proxy(func), timeout || 0);
    }
  });
  
  Controller.include(Events);
  Controller.include(Log);
  
  Spine.App = Class.create();
  Spine.App.extend(Events)
  Controller.fn.App = Spine.App;
})();