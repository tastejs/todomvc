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
    './registry'
  ],

  function(advice, utils, compose, registry) {

    var functionNameRegEx = /function (.*?)\s?\(/;
    var spaceCommaRegEx = /\s\,/g;

    function teardownInstance(instanceInfo){
      instanceInfo.events.slice().forEach(function(event) {
        var args = [event.type];

        event.element && args.unshift(event.element);
        (typeof event.callback == 'function') && args.push(event.callback);

        this.off.apply(this, args);
      }, instanceInfo.instance);
    }


    function teardown() {
      this.trigger("componentTearDown");
      teardownInstance(registry.findInstanceInfo(this));
    }

    //teardown for all instances of this constructor
    function teardownAll() {
      var componentInfo = registry.findComponentInfo(this);

      componentInfo && componentInfo.instances.slice().forEach(function(info) {
        info.instance.teardown();
      });
    }

    //common mixin allocates basic functionality - used by all component prototypes
    //callback context is bound to component
    function withBaseComponent() {

      // delegate trigger, bind and unbind to an element
      // if $element not supplied, use component's node
      // other arguments are passed on
      this.trigger = function() {
        var $element, type, data;
        var args = utils.toArray(arguments);

        if (typeof args[args.length - 1] != "string") {
          data = args.pop();
        }

        $element = (args.length == 2) ? $(args.shift()) : this.$node;
        type = args[0];

        if (window.DEBUG && window.postMessage) {
          try {
            window.postMessage(data, '*');
          } catch(e) {
            console.log('unserializable data for event',type,':',data);
            throw new Error(
              ["The event", event.type, "on component", this.describe, "was triggered with non-serializable data"].join(" ")
            );
          }
        }

        if (typeof this.attr.eventData === 'object') {
          data = $.extend(true, {}, this.attr.eventData, data);
        }

        return $element.trigger(type, data);
      };

      this.on = function() {
        var $element, type, callback, originalCb;
        var args = utils.toArray(arguments);

        if (typeof args[args.length - 1] == "object") {
          //delegate callback
          originalCb = utils.delegate(
            this.resolveDelegateRules(args.pop())
          );
        } else {
          originalCb = args.pop();
        }

        $element = (args.length == 2) ? $(args.shift()) : this.$node;
        type = args[0];

        if (typeof originalCb != 'function' && typeof originalCb != 'object') {
          throw new Error("Unable to bind to '" + type + "' because the given callback is not a function or an object");
        }

        callback = originalCb.bind(this);
        callback.target = originalCb;

        // if the original callback is already branded by jQuery's guid, copy it to the context-bound version
        if (originalCb.guid) {
          callback.guid = originalCb.guid;
        }

        $element.on(type, callback);

        // get jquery's guid from our bound fn, so unbinding will work
        originalCb.guid = callback.guid;

        return callback;
      };

      this.off = function() {
        var $element, type, callback;
        var args = utils.toArray(arguments);

        if (typeof args[args.length - 1] == "function") {
          callback = args.pop();
        }

        $element = (args.length == 2) ? $(args.shift()) : this.$node;
        type = args[0];

        return $element.off(type, callback);
      };

      this.resolveDelegateRules = function(ruleInfo) {
        var rules = {};

        Object.keys(ruleInfo).forEach(
          function(r) {
            if (!this.attr.hasOwnProperty(r)) {
              throw new Error('Component "' + this.describe + '" wants to listen on "' + r + '" but no such attribute was defined.');
            }
            rules[this.attr[r]] = ruleInfo[r];
          },
          this
        );

        return rules;
      };

      this.defaultAttrs = function(defaults) {
        utils.push(this.defaults, defaults, true) || (this.defaults = defaults);
      };

      this.select = function(attributeKey) {
        return this.$node.find(this.attr[attributeKey]);
      };

      this.initialize = $.noop;
      this.teardown = teardown;
    }

    function attachTo(selector/*, options args */) {
      if (!selector) {
        throw new Error("Component needs to be attachTo'd a jQuery object, native node or selector string");
      }

      var options = utils.merge.apply(utils, utils.toArray(arguments, 1));

      $(selector).each(function(i, node) {
        new this(node, options);
      }.bind(this));
    }

    // define the constructor for a custom component type
    // takes an unlimited number of mixin functions as arguments
    // typical api call with 3 mixins: define(timeline, withTweetCapability, withScrollCapability);
    function define(/*mixins*/) {
      var mixins = utils.toArray(arguments);

      Component.toString = function() {
        var prettyPrintMixins = mixins.map(function(mixin) {
          if ($.browser.msie) {
            var m = mixin.toString().match(functionNameRegEx);
            return (m && m[1]) ? m[1] : "";
          } else {
            return mixin.name;
          }
        }).join(', ').replace(spaceCommaRegEx,'');//weed out no-named mixins

        return prettyPrintMixins;
      };

      Component.describe = Component.toString();

      //'options' is optional hash to be merged with 'defaults' in the component definition
      function Component(node, options) {
        var fnCache = {}, uuid = 0;

        if (!node) {
          throw new Error("Component needs a node");
        }

        if (node.jquery) {
          this.node = node[0];
          this.$node = node;
        } else {
          this.node = node;
          this.$node = $(node);
        }

        this.describe = this.constructor.describe;

        this.bind = function(func) {
          var bound;

          if (func.uuid && (bound = fnCache[func.uuid])) {
            return bound;
          }

          var bindArgs = utils.toArray(arguments, 1);
          bindArgs.unshift(this); //prepend context

          bound = func.bind.apply(func, bindArgs);
          bound.target = func;
          func.uuid = uuid++;
          fnCache[func.uuid] = bound;

          return bound;
        };

        //merge defaults with supplied options
        this.attr = utils.merge(this.defaults, options);
        this.defaults && Object.keys(this.defaults).forEach(function(key) {
          if (this.defaults[key] === null && this.attr[key] === null) {
            throw new Error('Required attribute "' + key + '" not specified in attachTo for component "' + this.describe + '".');
          }
        }, this);

        this.initialize.call(this, options || {});

        this.trigger('componentInitialized');
      }

      Component.attachTo = attachTo;
      Component.teardownAll = teardownAll;

      // prepend common mixins to supplied list, then mixin all flavors
      mixins.unshift(withBaseComponent, advice.withAdvice, registry.withRegistration);

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
