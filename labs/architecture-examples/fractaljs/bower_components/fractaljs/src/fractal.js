(function(window){
  var Fractal = function(arg1, arg2){
    var callback = null;
    if (typeof(arg1) === 'function') { // register a onReady callback
      callback = arg1
    } else if (typeof(arg1) === 'string' && typeof(arg2) === 'function') { // add a component
      var name = arg1, component = arg2;
      callback = function(){ Fractal.Components[name] = component; };
    }
    if (!callback) return;
    if (Fractal.__ready) return callback();
    if (!Fractal.__startup) Fractal.__startup = [];
    Fractal.__startup.push(callback);
  };
  window.Fractal = Fractal;
  window.F = Fractal; // alias

  Fractal.ready =  function(){
    Fractal.ready = null;
    Fractal.__ready = true;
    if (Fractal.__startup) {
      Fractal.__startup.forEach(function(v){ v(); });
      Fractal.__startup = [];
    }
  };
  // Settings
  Fractal.API_ROOT = window.location.pathname.split("/").slice(0, -1).join("/") + "/";
  Fractal.SOURCE_ROOT = Fractal.API_ROOT;
  var protocol = window.location.protocol == "file:" ? "http:" : window.location.protocol;
  Fractal.DOM_PARSER = protocol + "//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min.js";
  Fractal.TEMPLATE_ENGINE = protocol + "//cdnjs.cloudflare.com/ajax/libs/hogan.js/3.0.0/hogan.js";
  Fractal.TOPIC = {
    COMPONENT_LOADED_MYSELF: "Fractal.component.loaded.myself",
    COMPONENT_LOADED_CHILDREN: "Fractal.component.loaded.children",
  };
  Fractal.PREFIX = {}; // component, template
  Fractal.Compile = function(templateText) { return Hogan.compile(templateText); };
  Fractal.Render = function(template, data, options) { return template.render(data, options); };

  var Seq = {
    __seq: 1,
    __last: (+new Date),
    get: function(){ return Seq.__seq; },
    increment: function(){
      var now = +new Date;
      if (now - Seq.__last > 100) {
        ++Seq.__seq;
        Seq.__last = now;
      }
    },
  };
  // get external resources
  Fractal.require = (function(){
    var byAddingElement = function(element, callback) {
      var __myTimer = setTimeout(function(){
        console.error("Timeout: adding " + element.src);
        callback(true, false); // err, result
      }, 10000);
      var done = false;
      element.onload = element.onreadystatechange = function(){
        if ( !done && (!this.readyState ||
                       this.readyState == "loaded" || this.readyState == "complete") ) {
          done = true;
          clearTimeout(__myTimer);
          callback(false, true); // err, result
          element.onload = element.onreadystatechange = null;
        }
      };
      var container = document.getElementsByTagName("head")[0];
      container.appendChild(element);
    };
    var byAjax = function(url, options, callback){
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      var xhr = new XMLHttpRequest();
      xhr.open("GET", url, true);
      xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
          if ((xhr.status == 200 || xhr.status == 0) && xhr.responseText) {
            callback(false, xhr.responseText);
          } else {
            console.error("unexpected server resposne: " + xhr.status + " " + url);
            callback(true, false);
          }
        }
      }
      if (options && options.contentType)
        xhr.setRequestHeader("Accept" , options.contentType);
      xhr.send("");
    };
    var getType = (function(){
      var ExtType = { "js": "script", "css": "css", "tmpl": "template" };
      return function(resourceId) {
        var ext = resourceId.split('.').pop();
        return ExtType[ext] || "ajax";
      };
    })();
    var getUrl = function(type, name) {
      if (name.indexOf("http") === 0 || name.indexOf("//") === 0) return name;
      if (name.indexOf(".") === 0) return window.location.pathname + name;
      var base = (type === "ajax") ? Fractal.API_ROOT : Fractal.SOURCE_ROOT;
      if (name.indexOf("/") === 0) return base + name.slice(1);
      return base + (Fractal.PREFIX[type] || "") + name;
    };
    var Type2Getter = {
      "script": (function(){
        var cache = {};
        return function(url, callback) {
          if (url in cache) return callback(false, true);
          cache[url] = true;
          var el = document.createElement("script");
          el.src = url;
          byAddingElement(el, callback);
        };
      })(),
      "css": (function(){
        var cache = {};
        return function(url, callback) {
          if (url in cache) return callback(false, true);
          cache[url] = true;
          var el = document.createElement("link");
          el.rel="stylesheet";
          el.href = url;
          // NOTE not using byAddingElement,
          //      some broswers dont fire onreadystatechange event for css ...
          var container = document.getElementsByTagName("head")[0];
          container.appendChild(el);
          callback(false, true);
        };
      })(),
      "template": (function(){
        var cache = {};
        return function(url, options, callback) {
          if (url in cache) return callback(false, cache[url]);
          byAjax(url, options, function(err, result){
            if (!err) cache[url] = result;
            callback(err, result);
          });
        };
      })(),
      "ajax": (function(){
        var cache = {};
        return function(url, callback, options){
          options = options || {};
          var forced = !!options.forced;
          if (!forced && url in cache && cache[url].seq >= Seq.get()) {
            console.debug("require from cache", url);
            return callback(false, cache[url].data);
          }
          var contentType = options.contentType || "application/json";
          console.debug("require new", url, forced, cache[url] ? cache[url].seq : "-1", Seq.get());
          byAjax(url, {contentType: contentType}, function(err, responseText){
            if (err) return callback(err, responseText);
            var data = null;
            if (contentType === "application/json") {
              try {
                data = JSON.parse(responseText);
              } catch (e) {
                console.error("failed to parse responseText, url: " + url + ", res: " + responseText);
                callback(true, false);
              }
            } else {
              data = responseText;
            }
            cache[url] = { seq: Seq.get(), data: data };
            callback(false, data);
          });
        };
      })(),
    };
    var requireDefault = (function(){
      var listeners = {};
      return function(resource, options, callback) {
        if (resource in listeners) {
          listeners[resource].push(callback);
          return;
        }
        listeners[resource] = [callback];
        var type = (options && options.contentType) ? "ajax" : getType(resource);
        var url = getUrl(type, resource);
        Type2Getter[type](url, function(err, data) {
          var callbackList = listeners[resource].map(function(v){return v;});
          delete listeners[resource];
          callbackList.forEach(function(v){v(data);});
        }, options);
      };
    })();

    return function(resourceList, options, callback) {
      if (typeof(options) === "function") {
        callback = options;
        options = null;
      }
      var wantarray = true;
      if (typeof(resourceList) === "string") {
        wantarray = false;
        resourceList = [resourceList];
      } else {
        if (!resourceList.length) {
          if (callback) callback({});
          return;
        }
      }
      var total = resourceList.length;
      var complete = 0;
      var retData = {};
      resourceList.forEach(function(v){
        requireDefault(v, options, function(data){
          retData[v] = data;
          if (callback && (++complete) === total) {
            callback(wantarray ? retData : retData[resourceList[0]]);
          }
        });
      });
    };
  })();
  // Objects
  Fractal.Class = (function(){
    /* Simple JavaScript Inheritance
     * By John Resig http://ejohn.org/
     * MIT Licensed.
     */
    // Inspired by base2 and Prototype
    var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
    var Class = function(){};
    Class.extend = function(prop) {
      var _super = this.prototype;

      initializing = true;
      var prototype = new this();
      initializing = false;

      for (var name in prop) {
        prototype[name] = typeof prop[name] == "function" &&
          typeof _super[name] == "function" && fnTest.test(prop[name]) ?
          (function(name, fn){
            return function() {
              var tmp = this._super;
              this._super = _super[name];

              var ret = fn.apply(this, arguments);
              this._super = tmp;

              return ret;
            };
          })(name, prop[name]) :
        prop[name];
      }

      function Class() {
        if ( !initializing && this.init )
          this.init.apply(this, arguments);
      }

      Class.prototype = prototype;
      Class.prototype.constructor = Class;

      Class.extend = arguments.callee;

      return Class;
    };

    return Class;
  })();
  Fractal.getTemplate = (function(){
    var __get = function(templateName, callback){
      var $template = $('script[type="text/template"][id="template-' + templateName + '"]');
      if ($template.length > 0) {
        callback(Fractal.Compile($template.html()));
      } else {
        Fractal.require(templateName + ".tmpl", function(template){
          callback(Fractal.Compile(template));
        });
      }
    };
    return function(templateNames, callback){
      if (typeof(templateNames) === "string") return __get(templateNames, callback);
      var results = {}, total = templateNames.length, complete = 0;
      templateNames.forEach(function(v){
        __get(v, function(data){
          results[v] = data;
          if (++complete === total) callback(results);
        });
      });
    };
  })();
  Fractal.Component = (function(){
    var ComponentFilter = '[data-role=component]';
    var getComponentJS = function(name) { return Fractal.PREFIX.component + name + ".js"; };

    var setLoad = function(self, next) {
      if (!next) return;
      if (!self.__load){
        self.__load = next;
        return;
      }
      var temp = self.__load;
      self.__load = function(callback, param) {
        temp.bind(self)(function(){
          next.bind(self)(callback, param);
        }, param);
      };
    };

    var Component = {};
    Component.init = function(name, $container){
      this.name = name;
      this.$container = $container;
      this.$ = this.$container.find.bind(this.$container);
      var resetDisplay = this.$container.data("display");
      if (resetDisplay) this.$container.css("display", resetDisplay);
      this.loadOnce = this.loadOnce || (!!this.$container.attr("load-once"));
      if (!this.loadOnce) {
        this.$container.on("destroyed", this.unload.bind(this));
      }

      this.rendered = false;
      this.subscribeList = {};
      this.earlyRecieved = [];
      // // TODO implement if needed
      // self.children = [];
      // self.parent = null;
      this.templateName = this.templateName || self.name;
      if (typeof(this.template) === "string") this.template = Fractal.Compile(this.template);

      setLoad(this, this.getData);
      setLoad(this, this.getTemplate);
      setLoad(this, this.render);
      setLoad(this, this.afterRender);
      setLoad(this, this.onMyselfLoaded);
      if (!this.loadMyselfOnly)
        setLoad(this, this.loadChildren);
      setLoad(this, this.onAllLoaded);
    };
    Component.setTemplate = function(name) {
      this.templateName = name;
      this.template = null;
    };
    Component.load = function(param, callback){
      Seq.increment();
      this.__load(function(){
        if (callback) callback();
      }, param);
    };
    Component.__load = null;
    Component.getData = null;
    Component.getTemplate = function(callback) {
      var self = this;
      if (self.template) return callback();
      Fractal.getTemplate(self.templateName || self.name, function(template){
        self.template = template;
        callback();
      });
    };
    Component.render = function(callback){
      var contents = Fractal.Render(this.template, this.data, this.partials);
      if (this.loadOnce) {
        this.$contents = $($.parseHTML(contents));
        this.$container.replaceWith(this.$contents);
      } else {
        this.$container.html(contents);
        this.$contents = this.$container.contents();
      }
      callback();
    };
    Component.afterRender = null;
    Component.onMyselfLoaded = function(callback){
      this.rendered = true;
      while (this.earlyRecieved.length > 0) {
        var v = this.earlyRecieved.pop();
        v.callback(v.topic, v.data);
      }
      if (this.loadOnce) this.load = null;
      Fractal.Pubsub.publish(Fractal.TOPIC.COMPONENT_LOADED_MYSELF, {name: this.name});
      callback();
    };
    Component.loadChildren = function(callback, param){
      var self = this;

      var __initComponent = function(name, $container, callback) {
        if (name in Fractal.Components) {
          var component = new Fractal.Components[name](name, $container);
          component.__load(function(){callback(false, name);}, param);
        } else {
          var js = getComponentJS(name);
          Fractal.require(js, function(){ // create <script> and wait util ready
            if (name in Fractal.Components) {
              __initComponent(name, $container, callback);
            } else {
              callback("object not found in: " + js, name); // TODO mark this as a failed load
            }
          });
        }
      }

      if (!self.$contents) self.$contents = self.$container.contents();
      $subComponents = self.$contents.find(ComponentFilter).andSelf().filter(ComponentFilter);
      var len = $subComponents.length;
      if (len == 0) {
        Fractal.Pubsub.publish(Fractal.TOPIC.COMPONENT_LOADED_CHILDREN, {name: self.name});
        if (callback) callback();
        return;
      }
      // start to load children
      var finished = 0;
      $subComponents.each(function(){
        var $subContainer = $(this);
        var name = $subContainer.data("name");
        __initComponent(name, $subContainer, function(err, name) {
          if (err) console.error("Failed to load component: " + name + " reason: " + err);
          if (++finished === len) {
            Fractal.Pubsub.publish(Fractal.TOPIC.COMPONENT_LOADED_CHILDREN, {name: self.name});
            if (callback) callback();
          }
        });
      });
    },
    Component.onAllLoaded = null;
    Component.unload = function(){ this.unsubscribe(); };

    Component.publish = function(topic, data) { Fractal.Pubsub.publish(topic, data); };
    Component.subscribe = function(topic, callback){
      var self = this;
      self.subscribeList[topic] = Fractal.Pubsub.subscribe(topic, function(topic, data){
        if (self.rendered) callback(topic, data);
        else self.earlyRecieved.push({topic: topic, data: data, callback: callback});
      });
    };
    Component.unsubscribe = function(topic) {
      if (!topic) {
        for (var i in this.subscribeList) Fractal.Pubsub.unsubscribe(i, this.subscribeList[i]);
      } else {
        if (topic in this.subscribeList) Fractal.Pubsub.unsubscribe(topic, this.subscribeList[topic]);
      }
    };
    Fractal.Components = {};
    return Fractal.Class.extend(Component);
  })();
  Fractal.construct = function(callback){
    Fractal.require([Fractal.DOM_PARSER, Fractal.TEMPLATE_ENGINE], function(){
      $.event.special.destroyed = {
        remove: function(o) {
          if (o.handler) o.handler();
        }
      }
      var c = new Fractal.Component("__ROOT__", $(document));
      c.loadChildren(callback);
    });
  };
  // pub-sub
  Fractal.Pubsub = (function() {
    var Stock = function(){
      this.arrived = {};
      this.buffer = {};
    };
    var count = function(){
      var count = 0;
      for (var i in this.buffer) ++count;
      return count;
    };
    Stock.prototype.add = function(topic, data) {
      if (count.bind(this)() >= 10 && !(topic in this.buffer)) {
        var oldest = new Data();
        var oldestTopic = "";
        for (var i in this.arrived) {
          if (this.arrived[i] < oldest) {
            oldest = this.arrived[i];
            oldestTopic = i;
          }
        }
        delete this.buffer[oldestTopic];
        delete this.arrived[oldestTopic];
      }
      this.buffer[topic] = data;
      this.arrived[topic] = new Date();
    };
    Stock.prototype.get = function(topic) {
      if (topic in this.buffer) {
        var data = this.buffer[topic];
        delete this.buffer[topic];
        delete this.arrived[topic];
        return data;
      }
      return null;
    };

    var topics = {};
    var seq = 0;
    var stock = new Stock();
    return {
      publish: function(topic, data) {
        if (!topics[topic]) {
          stock.add(topic, data);
          return;
        }
        var subscribers = topics[topic];
        for (var i in subscribers) subscribers[i].callback(topic, data);
      },
      subscribe: function(topic, callback) {
        if (!topics[topic]) topics[topic] = [];
        var token = ++seq;
        topics[topic].push({
          token: token,
          callback: callback
        });
        var data = stock.get(topic);
        if (data) callback(topic, data);
        return token;
      },
      unsubscribe: function(topic, token) {
        if (!(topic in topics)) return;
        var subscribers = topics[topic];
        for (var i in subscribers) {
          if (subscribers[i].token === token) {
            subscribers.splice(i, 1);
            break;
          }
        }
        if (subscribers.length === 0) delete topics[topic];
      },
    };
  }());

  Fractal.ready();
})(window);
