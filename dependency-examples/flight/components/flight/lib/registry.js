// ==========================================
// Copyright 2013 Twitter, Inc
// Licensed under The MIT License
// http://opensource.org/licenses/MIT
// ==========================================

"use strict";

define(

  [
    './utils'
  ],

  function (util) {

    function parseEventArgs(instance, args) {
      var element, type, callback;

      args = util.toArray(args);

      if (typeof args[args.length-1] === 'function') {
        callback = args.pop();
      }

      if (typeof args[args.length-1] === 'object') {
        args.pop();
      }

      if (args.length == 2) {
        element = args[0];
        type = args[1];
      } else {
        element = instance.node;
        type = args[0];
      }

      return {
        element: element,
        type: type,
        callback: callback
      };
    }

    function matchEvent(a, b) {
      return (
        (a.element == b.element) &&
        (a.type == b.type) &&
        (b.callback == null || (a.callback == b.callback))
      );
    }

    function Registry() {

      var registry = this;

      (this.reset = function() {
        this.components = [];
        this.allInstances = [];
        this.events = [];
      }).call(this);

      function ComponentInfo(component) {
        this.component = component;
        this.instances = [];

        this.addInstance = function(instance) {
          this.throwIfInstanceExistsOnNode(instance);

          var instanceInfo = new InstanceInfo(instance);
          this.instances.push(instanceInfo);

          return instanceInfo;
        }

        this.throwIfInstanceExistsOnNode = function(instance) {
          this.instances.forEach(function (instanceInfo) {
            if (instanceInfo.instance.$node[0] === instance.$node[0]) {
              throw new Error('Instance of ' + instance.constructor + ' already exists on node ' + instance.$node[0]);
            }
          });
        }

        this.removeInstance = function(instance) {
          var instanceInfo = this.instances.filter(function(instanceInfo) {
            return instanceInfo.instance == instance;
          })[0];

          var index = this.instances.indexOf(instanceInfo);

          (index > -1)  && this.instances.splice(index, 1);

          if (!this.instances.length) {
            //if I hold no more instances remove me from registry
            registry.removeComponentInfo(this);
          }
        }
      }

      function InstanceInfo(instance) {
        this.instance = instance;
        this.events = [];

        this.addTrigger = function() {};

        this.addBind = function(event) {
          this.events.push(event);
          registry.events.push(event);
        };

        this.removeBind = function(event) {
          for (var i = 0, e; e = this.events[i]; i++) {
            if (matchEvent(e, event)) {
              this.events.splice(i, 1);
            }
          }
        }
      }

      this.addInstance = function(instance) {
        var component = this.findComponentInfo(instance);

        if (!component) {
          component = new ComponentInfo(instance.constructor);
          this.components.push(component);
        }

        var inst = component.addInstance(instance);

        this.allInstances.push(inst);

        return component;
      };

      this.removeInstance = function(instance) {
        var index, instInfo = this.findInstanceInfo(instance);

        //remove from component info
        var componentInfo = this.findComponentInfo(instance);
        componentInfo.removeInstance(instance);

        //remove from registry
        var index = this.allInstances.indexOf(instInfo);
        (index > -1)  && this.allInstances.splice(index, 1);
      };

      this.removeComponentInfo = function(componentInfo) {
        var index = this.components.indexOf(componentInfo);
        (index > -1)  && this.components.splice(index, 1);
      };

      this.findComponentInfo = function(which) {
        var component = which.attachTo ? which : which.constructor;

        for (var i = 0, c; c = this.components[i]; i++) {
          if (c.component === component) {
            return c;
          }
        }

        return null;
      };

      this.findInstanceInfo = function(which) {
        var testFn;

        if (which.node) {
          //by instance (returns matched instance)
          testFn = function(inst) {return inst.instance === which};
        } else {
          //by node (returns array of matches)
          testFn = function(inst) {return inst.instance.node === which};
        }

        var matches = this.allInstances.filter(testFn);
        if (!matches.length) {
          return which.node ? null : [];
        }
        return which.node ? matches[0] : matches;
      };

      this.trigger = function() {
        var event = parseEventArgs(this, arguments),
            instance = registry.findInstanceInfo(this);

        if (instance) {
          instance.addTrigger(event);
        }
      };

      this.on = function(componentOn) {
        var otherArgs = util.toArray(arguments, 1);
        var instance = registry.findInstanceInfo(this);
        var boundCallback;

        if (instance) {
          boundCallback = componentOn.apply(null, otherArgs);
          if(boundCallback) {
            otherArgs[otherArgs.length-1] = boundCallback;
          }
          var event = parseEventArgs(this, otherArgs);
          instance.addBind(event);
        }
      };

      this.off = function(el, type, callback) {
        var event = parseEventArgs(this, arguments),
            instance = registry.findInstanceInfo(this);

        if (instance) {
          instance.removeBind(event);
        }
      };

      this.teardown = function() {
        registry.removeInstance(this);
      };

      this.withRegistration = function() {
        this.before('initialize', function() {
          registry.addInstance(this);
        });

        this.after('trigger', registry.trigger);
        this.around('on', registry.on);
        this.after('off', registry.off);
        this.after('teardown', {obj:registry, fnName:'teardown'});
      };

    }

    return new Registry;
  }
);
