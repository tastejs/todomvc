// ==========================================
// Copyright 2013 Twitter, Inc
// Licensed under The MIT License
// http://opensource.org/licenses/MIT
// ==========================================

"use strict";

define(

  [
    './advice',
    './utils',
    './compose',
    './base',
    './registry',
    './logger',
    './debug'
  ],

  function(advice, utils, compose, withBase, registry, withLogging, debug) {

    var functionNameRegEx = /function (.*?)\s?\(/;

    //teardown for all instances of this constructor
    function teardownAll() {
      var componentInfo = registry.findComponentInfo(this);

      componentInfo && Object.keys(componentInfo.instances).forEach(function(k) {
        var info = componentInfo.instances[k];
        info.instance.teardown();
      });
    }

    function checkSerializable(type, data) {
      try {
        window.postMessage(data, '*');
      } catch(e) {
        console.log('unserializable data for event',type,':',data);
        throw new Error(
          ["The event", type, "on component", this.toString(), "was triggered with non-serializable data"].join(" ")
        );
      }
    }

    function attachTo(selector/*, options args */) {
      // unpacking arguments by hand benchmarked faster
      var l = arguments.length;
      var args = new Array(l - 1);
      for (var i = 1; i < l; i++) args[i - 1] = arguments[i];

      if (!selector) {
        throw new Error("Component needs to be attachTo'd a jQuery object, native node or selector string");
      }

      var options = utils.merge.apply(utils, args);

      $(selector).each(function(i, node) {
        var rawNode = node.jQuery ? node[0] : node;
        var componentInfo = registry.findComponentInfo(this)
        if (componentInfo && componentInfo.isAttachedTo(rawNode)) {
          //already attached
          return;
        }

        (new this).initialize(node, options);
      }.bind(this));
    }

    // define the constructor for a custom component type
    // takes an unlimited number of mixin functions as arguments
    // typical api call with 3 mixins: define(timeline, withTweetCapability, withScrollCapability);
    function define(/*mixins*/) {
      // unpacking arguments by hand benchmarked faster
      var l = arguments.length;
      var mixins = new Array(l + 3); //add three for common mixins
      for (var i = 0; i < l; i++) mixins[i] = arguments[i];

      var Component = function() {};

      Component.toString = Component.prototype.toString = function() {
        var prettyPrintMixins = mixins.map(function(mixin) {
          if (mixin.name == null) {
            //function name property not supported by this browser, use regex
            var m = mixin.toString().match(functionNameRegEx);
            return (m && m[1]) ? m[1] : "";
          } else {
            return (mixin.name != "withBase") ? mixin.name : "";
          }
        }).filter(Boolean).join(', ');
        return prettyPrintMixins;
      };

      if (debug.enabled) {
        Component.describe = Component.prototype.describe = Component.toString();
      }

      //'options' is optional hash to be merged with 'defaults' in the component definition
      Component.attachTo = attachTo;
      Component.teardownAll = teardownAll;

      // prepend common mixins to supplied list, then mixin all flavors
      if (debug.enabled) {
        mixins.unshift(withLogging);
      }
      mixins.unshift(withBase, advice.withAdvice, registry.withRegistration);
      compose.mixin(Component.prototype, mixins);

      return Component;
    }

    define.teardownAll = function() {
      registry.components.slice().forEach(function(c) {
        c.component.teardownAll();
      });
      registry.reset();
    };

    return define;
  }
);
