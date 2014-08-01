Fractal(function(){
  Fractal.decodeParam = function(queryString){
    if (!queryString) return {};
    var match,
    pl     = /\+/g,  // Regex for replacing addition symbol with a space
    search = /([^&=]+)=?([^&]*)/g,
    decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
    myEnv = {};

    while (m = search.exec(queryString)) {
      if (!m[2] && !myEnv.page) {
        m[2] = m[1];
        m[1] = "page";
      }
      myEnv[decode(m[1])] = decode(m[2]);
    }
    return myEnv;
  };
  Fractal.encodeParam = function(data) {
    var kvp = [];
    for (var i in data) {
      kvp.push([i, data[i]]);
    }
    return kvp.map(function(v){
      return encodeURIComponent(v[0]) + "=" + encodeURIComponent(v[1]);
    }).join("&");
  };
  __ignoreEnvChange = {};
  Fractal.navigate = function(page, params, ignoreEnvChange) {
    params = params || {};
    var hash = "#" + page + "&" + Fractal.encodeParam(params);
    if (window.location.hash !== hash) {
      if (ignoreEnvChange) {
        __ignoreEnvChange[hash] = true;
      }
      window.location.hash = hash;
    }
  };
  Fractal.env = (function(){
    Fractal.TOPIC.ENV_CHANGED = "Fractal.env.changed";
    var env = {};

    function parse() {
      var queryString = window.location.search.substring(1);
      queryString += "&";
      queryString += window.location.hash.substring(1);

      console.log("queryString", queryString);

      var decoded = Fractal.decodeParam(queryString);
      var changed = {};
      for (var i in decoded) {
        if (env[i] !== decoded[i]) changed[i] = [env[i], decoded[i]];
        env[i] = decoded[i];
      }
      var removeList = [];
      for (var i in env) {
        if (!(i in decoded)) {
          changed[i] = [env[i], undefined];
          removeList.push(i);
        }
      }
      removeList.forEach(function(v){
        delete env[v];
      });
      return changed;
    }

    window.onpopstate = function(){
      if (__ignoreEnvChange[window.location.hash]) {
        delete __ignoreEnvChange[window.location.hash];
      } else {
        var changed = parse();
        for (var i in changed) { // check if changed is empty
          Fractal.Pubsub.publish(Fractal.TOPIC.ENV_CHANGED, changed);
          break;
        }
      }
    };
    parse();

    return env;
  })();

  Fractal.Components.Router = Fractal.Component.extend({
    getComponentName: function(changedEnv, callback) { throw new Error("to be extended"); },
    template: '<div data-role="component" data-name="{{componentName}}" />',
    init: function(name, $container) {
      var self = this;
      self._super(name, $container);
      self.subscribe(Fractal.TOPIC.ENV_CHANGED, function(topic, data){
        self.getComponentName(data, function(componentName){
          if (!componentName) return;
          if (self.data && self.data.componentName !== componentName) {
            self.data = { componentName: componentName };
            self.load();
          }
        });
      });
    },
    getData: function(callback) {
      var self = this;
      if (!self.data) {
        self.getComponentName({}, function(componentName){
          self.data = { componentName: componentName };
          callback();
        });
      } else {
        callback();
      }
    }
  });

  Fractal.platform = (function(){
    if (window.location.href.indexOf("http") == 0) {
      return "www";
    }
    var isAndroid = !!(navigator.userAgent.match(/Android/i));
    var isIOS     = !!(navigator.userAgent.match(/iPhone|iPad|iPod/i));

    if (isAndroid) return "android";
    else if (isIOS) return "ios";
    else return "www";
  })();

  Fractal.App = (function(){
    var App = {};
    App.onSetup = function(){};
    App.setup = function(callback){
      var self = this;
      if (self.DOM_PARSER) Fractal.DOM_PARSER = self.DOM_PARSER;
      if (self.TEMPLATE_ENGINE) Fractal.TEMPLATE_ENGINE = self.TEMPLATE_ENGINE;
      if (self.SOURCE_ROOT) Fractal.SOURCE_ROOT = self.SOURCE_ROOT;
      if (self.API_ROOT) Fractal.API_ROOT = self.API_ROOT;
      if (self.PREFIX) for (var i in self.PREFIX) Fractal.PREFIX[i] = self.PREFIX[i];
      Fractal.require([Fractal.DOM_PARSER, Fractal.TEMPLATE_ENGINE], function(){
        $(function(){
          self.REQUIRE_LIST = self.REQUIRE_LIST || [];
          Fractal.require(self.REQUIRE_LIST, callback);
        });
      });
    };
    App.start = function(callback){
      var self = this;

      function onDeviceReady(callback){
        self.setup(function(){
          self.onSetup();
          Fractal.construct(callback);
        });
      }

      if (Fractal.platform == "www") {
        onDeviceReady(callback);
      } else {
        Fractal.require("phonegap.js", function(){
          document.addEventListener("deviceready", function(){
            onDeviceReady(callback);
          }, false);
        });
      }
    };

    return Fractal.Class.extend(App);
  })();
});

