/*!
DeftJS 0.8.1-pre

Copyright (c) 2012 [DeftJS Framework Contributors](http://deftjs.org)
Open source under the [MIT License](http://en.wikipedia.org/wiki/MIT_License).
*/

/**
* DeftJS Class-related static utility methods.
* @private
*/

Ext.define('Deft.core.Class', {
  alternateClassName: ['Deft.Class'],
  statics: {
    /**
		Register a new pre-processor to be used during the class creation process.
		(Normalizes API differences between the various Sencha frameworks and versions.)
    */

    registerPreprocessor: function(name, fn, position, relativeTo) {
      if (Ext.getVersion('extjs') && Ext.getVersion('core').isLessThan('4.1.0')) {
        Ext.Class.registerPreprocessor(name, function(Class, data, callback) {
          return fn.call(this, Class, data, data, callback);
        }).setDefaultPreprocessorPosition(name, position, relativeTo);
      } else {
        Ext.Class.registerPreprocessor(name, function(Class, data, hooks, callback) {
          return fn.call(this, Class, data, hooks, callback);
        }, [name], position, relativeTo);
      }
    },
    hookOnClassCreated: function(hooks, fn) {
      if (Ext.getVersion('extjs') && Ext.getVersion('core').isLessThan('4.1.0')) {
        Ext.Function.interceptBefore(hooks, 'onClassCreated', fn);
      } else {
        Ext.Function.interceptBefore(hooks, 'onCreated', fn);
      }
    },
    hookOnClassExtended: function(data, fn) {
      var onClassExtended;
      if (Ext.getVersion('extjs') && Ext.getVersion('core').isLessThan('4.1.0')) {
        onClassExtended = function(Class, data) {
          return fn.call(this, Class, data, data);
        };
      } else {
        onClassExtended = fn;
      }
      if (data.onClassExtended != null) {
        Ext.Function.interceptBefore(data, 'onClassExtended', onClassExtended);
      } else {
        data.onClassExtended = onClassExtended;
      }
    },
    /**
		* Returns true if the passed class name is a superclass of the passed Class reference.
    */

    extendsClass: function(className, currentClass) {
      try {
        if (Ext.getClassName(currentClass) === className) {
          return true;
        }
        if (currentClass != null ? currentClass.superclass : void 0) {
          if (Ext.getClassName(currentClass.superclass) === className) {
            return true;
          } else {
            return Deft.Class.extendsClass(className, Ext.getClass(currentClass.superclass));
          }
        } else {
          return false;
        }
      } catch (error) {
        return false;
      }
    }
  }
});
/**
Copyright (c) 2012 [DeftJS Framework Contributors](http://deftjs.org)
Open source under the [MIT License](http://en.wikipedia.org/wiki/MIT_License).
*/

/**
* Logger used by DeftJS. Output is shown in the console when using ext-dev/ext-all-dev.
* @private
*/

Ext.define('Deft.log.Logger', {
  alternateClassName: ['Deft.Logger'],
  singleton: true,
  log: function(message, priority) {
    if (priority == null) {
      priority = 'info';
    }
  },
  error: function(message) {
    this.log(message, 'error');
  },
  info: function(message) {
    this.log(message, 'info');
  },
  verbose: function(message) {
    this.log(message, 'verbose');
  },
  warn: function(message) {
    this.log(message, 'warn');
  },
  deprecate: function(message) {
    this.log(message, 'deprecate');
  }
}, function() {
  var _ref;
  if (Ext.getVersion('extjs') != null) {
    this.log = function(message, priority) {
      if (priority == null) {
        priority = 'info';
      }
      if (priority === 'verbose') {
        priority === 'info';
      }
      if (priority === 'deprecate') {
        priority = 'warn';
      }
      Ext.log({
        msg: message,
        level: priority
      });
    };
  } else {
    if (Ext.isFunction((_ref = Ext.Logger) != null ? _ref.log : void 0)) {
      this.log = Ext.bind(Ext.Logger.log, Ext.Logger);
    }
  }
});
/**
Copyright (c) 2012 [DeftJS Framework Contributors](http://deftjs.org)
Open source under the [MIT License](http://en.wikipedia.org/wiki/MIT_License).
*/

/**
* Common utility functions used by DeftJS.
*/

Ext.define('Deft.util.Function', {
  alternateClassName: ['Deft.Function'],
  statics: {
    /**
		* Creates a new wrapper function that spreads the passed Array over the target function arguments.
    */

    spread: function(fn, scope) {
      return function(array) {
        if (!Ext.isArray(array)) {
          Ext.Error.raise({
            msg: "Error spreading passed Array over target function arguments: passed a non-Array."
          });
        }
        return fn.apply(scope, array);
      };
    },
    /**
		* Returns a new wrapper function that caches the return value for previously processed function argument(s).
    */

    memoize: function(fn, scope, hashFn) {
      var memo;
      memo = {};
      return function(value) {
        var key;
        key = Ext.isFunction(hashFn) ? hashFn.apply(scope, arguments) : value;
        if (!(key in memo)) {
          memo[key] = fn.apply(scope, arguments);
        }
        return memo[key];
        /**
			* Retrieves the value for the specified object key and removes the pair from the object.
        */

      };
    },
    extract: function(object, key) {
      var value;
      value = object[key];
      delete object[key];
      return value;
    }
  }
});
/*
Copyright (c) 2012 [DeftJS Framework Contributors](http://deftjs.org)
Open source under the [MIT License](http://en.wikipedia.org/wiki/MIT_License).
*/

/**
* Event listener for events fired via the Deft.event.LiveEventBus.
* @private
*/

Ext.define('Deft.event.LiveEventListener', {
  alternateClassName: ['Deft.LiveEventListener'],
  requires: ['Ext.ComponentQuery'],
  constructor: function(config) {
    var component, components, _i, _len;
    Ext.apply(this, config);
    this.components = [];
    components = Ext.ComponentQuery.query(this.selector, this.container);
    for (_i = 0, _len = components.length; _i < _len; _i++) {
      component = components[_i];
      this.components.push(component);
      component.on(this.eventName, this.fn, this.scope, this.options);
    }
  },
  destroy: function() {
    var component, _i, _len, _ref;
    _ref = this.components;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      component = _ref[_i];
      component.un(this.eventName, this.fn, this.scope);
    }
    this.components = null;
  },
  register: function(component) {
    if (this.matches(component)) {
      this.components.push(component);
      component.on(this.eventName, this.fn, this.scope, this.options);
    }
  },
  unregister: function(component) {
    var index;
    index = Ext.Array.indexOf(this.components, component);
    if (index !== -1) {
      component.un(this.eventName, this.fn, this.scope);
      Ext.Array.erase(this.components, index, 1);
    }
  },
  matches: function(component) {
    if (this.selector === null && this.container === component) {
      return true;
    }
    if (this.container === null && Ext.Array.contains(Ext.ComponentQuery.query(this.selector), component)) {
      return true;
    }
    if (component.isDescendantOf(this.container) && Ext.Array.contains(this.container.query(this.selector), component)) {
      return true;
    }
    return false;
  }
});
/*
Copyright (c) 2012 [DeftJS Framework Contributors](http://deftjs.org)
Open source under the [MIT License](http://en.wikipedia.org/wiki/MIT_License).
*/

/**
* Event bus for live component selectors.
*/

Ext.define('Deft.event.LiveEventBus', {
  alternateClassName: ['Deft.LiveEventBus'],
  requires: ['Ext.Component', 'Ext.ComponentManager', 'Deft.event.LiveEventListener'],
  singleton: true,
  constructor: function() {
    this.listeners = [];
  },
  destroy: function() {
    var listener, _i, _len, _ref;
    _ref = this.listeners;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      listener = _ref[_i];
      listener.destroy();
    }
    this.listeners = null;
  },
  addListener: function(container, selector, eventName, fn, scope, options) {
    var listener;
    listener = Ext.create('Deft.event.LiveEventListener', {
      container: container,
      selector: selector,
      eventName: eventName,
      fn: fn,
      scope: scope,
      options: options
    });
    this.listeners.push(listener);
  },
  removeListener: function(container, selector, eventName, fn, scope) {
    var listener;
    listener = this.findListener(container, selector, eventName, fn, scope);
    if (listener != null) {
      Ext.Array.remove(this.listeners, listener);
      listener.destroy();
    }
  },
  on: function(container, selector, eventName, fn, scope, options) {
    return this.addListener(container, selector, eventName, fn, scope, options);
  },
  un: function(container, selector, eventName, fn, scope) {
    return this.removeListener(container, selector, eventName, fn, scope);
  },
  findListener: function(container, selector, eventName, fn, scope) {
    var listener, _i, _len, _ref;
    _ref = this.listeners;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      listener = _ref[_i];
      if (listener.container === container && listener.selector === selector && listener.eventName === eventName && listener.fn === fn && listener.scope === scope) {
        return listener;
      }
    }
    return null;
  },
  register: function(component) {
    component.on('added', this.onComponentAdded, this);
    component.on('removed', this.onComponentRemoved, this);
  },
  unregister: function(component) {
    component.un('added', this.onComponentAdded, this);
    component.un('removed', this.onComponentRemoved, this);
  },
  onComponentAdded: function(component, container, eOpts) {
    var listener, _i, _len, _ref;
    _ref = this.listeners;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      listener = _ref[_i];
      listener.register(component);
    }
  },
  onComponentRemoved: function(component, container, eOpts) {
    var listener, _i, _len, _ref;
    _ref = this.listeners;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      listener = _ref[_i];
      listener.unregister(component);
    }
  }
}, function() {
  if (Ext.getVersion('touch') != null) {
    Ext.define('Deft.Component', {
      override: 'Ext.Component',
      setParent: function(newParent) {
        var oldParent, result;
        oldParent = this.getParent();
        result = this.callParent(arguments);
        if (oldParent === null && newParent !== null) {
          this.fireEvent('added', this, newParent);
        } else if (oldParent !== null && newParent !== null) {
          this.fireEvent('removed', this, oldParent);
          this.fireEvent('added', this, newParent);
        } else if (oldParent !== null && newParent === null) {
          this.fireEvent('removed', this, oldParent);
        }
        return result;
      },
      isDescendantOf: function(container) {
        var ancestor;
        ancestor = this.getParent();
        while (ancestor != null) {
          if (ancestor === container) {
            return true;
          }
          ancestor = ancestor.getParent();
        }
        return false;
      }
    });
  }
  Ext.Function.interceptAfter(Ext.ComponentManager, 'register', function(component) {
    Deft.event.LiveEventBus.register(component);
  });
  Ext.Function.interceptAfter(Ext.ComponentManager, 'unregister', function(component) {
    Deft.event.LiveEventBus.unregister(component);
  });
});
/*
Copyright (c) 2012 [DeftJS Framework Contributors](http://deftjs.org)
Open source under the [MIT License](http://en.wikipedia.org/wiki/MIT_License).
*/

/**
* Used by Deft.ioc.Injector.
* @private
*/

Ext.define('Deft.ioc.DependencyProvider', {
  requires: ['Deft.log.Logger'],
  config: {
    identifier: null,
    /**
		Class to be instantiated, by either full name, alias or alternate name, to resolve this dependency.
    */

    className: null,
    /**
		Optional arguments to pass to the class' constructor when instantiating a class to resolve this dependency.
    */

    parameters: null,
    /**
		Factory function to be executed to obtain the corresponding object instance or value to resolve this dependency.

		NOTE: For lazily instantiated dependencies, this function will be passed the object instance for which the dependency is being resolved.
    */

    fn: null,
    /**
		Value to use to resolve this dependency.
    */

    value: void 0,
    /**
		Indicates whether this dependency should be resolved as a singleton, or as a transient value for each resolution request.
    */

    singleton: true,
    /**
		Indicates whether this dependency should be 'eagerly' instantiated when this provider is defined, rather than 'lazily' instantiated when later requested.

		NOTE: Only valid when either a factory function or class is specified as a singleton.
    */

    eager: false
  },
  constructor: function(config) {
    var classDefinition;
    this.initConfig(config);
    if ((config.value != null) && config.value.constructor === Object) {
      this.setValue(config.value);
    }
    if (this.getEager()) {
      if (this.getValue() != null) {
        Ext.Error.raise({
          msg: "Error while configuring '" + (this.getIdentifier()) + "': a 'value' cannot be created eagerly."
        });
      }
      if (!this.getSingleton()) {
        Ext.Error.raise({
          msg: "Error while configuring '" + (this.getIdentifier()) + "': only singletons can be created eagerly."
        });
      }
    }
    if (this.getClassName() != null) {
      classDefinition = Ext.ClassManager.get(this.getClassName());
      if (!(classDefinition != null)) {
        Deft.Logger.warn("Synchronously loading '" + (this.getClassName()) + "'; consider adding Ext.require('" + (this.getClassName()) + "') above Ext.onReady.");
        Ext.syncRequire(this.getClassName());
        classDefinition = Ext.ClassManager.get(this.getClassName());
      }
      if (!(classDefinition != null)) {
        Ext.Error.raise({
          msg: "Error while configuring rule for '" + (this.getIdentifier()) + "': unrecognized class name or alias: '" + (this.getClassName()) + "'"
        });
      }
    }
    if (!this.getSingleton()) {
      if (this.getClassName() != null) {
        if (Ext.ClassManager.get(this.getClassName()).singleton) {
          Ext.Error.raise({
            msg: "Error while configuring rule for '" + (this.getIdentifier()) + "': singleton classes cannot be configured for injection as a prototype. Consider removing 'singleton: true' from the class definition."
          });
        }
      }
      if (this.getValue() != null) {
        Ext.Error.raise({
          msg: "Error while configuring '" + (this.getIdentifier()) + "': a 'value' can only be configured as a singleton."
        });
      }
    } else {
      if ((this.getClassName() != null) && (this.getParameters() != null)) {
        if (Ext.ClassManager.get(this.getClassName()).singleton) {
          Ext.Error.raise({
            msg: "Error while configuring rule for '" + (this.getIdentifier()) + "': parameters cannot be applied to singleton classes. Consider removing 'singleton: true' from the class definition."
          });
        }
      }
    }
    return this;
  },
  /**
	Resolve a target instance's dependency with an object instance or value generated by this dependency provider.
  */

  resolve: function(targetInstance) {
    var instance, parameters;
    Deft.Logger.log("Resolving '" + (this.getIdentifier()) + "'.");
    if (this.getValue() !== void 0) {
      return this.getValue();
    }
    instance = null;
    if (this.getFn() != null) {
      Deft.Logger.log("Executing factory function.");
      instance = this.getFn().call(null, targetInstance);
    } else if (this.getClassName() != null) {
      if (Ext.ClassManager.get(this.getClassName()).singleton) {
        Deft.Logger.log("Using existing singleton instance of '" + (this.getClassName()) + "'.");
        instance = Ext.ClassManager.get(this.getClassName());
      } else {
        Deft.Logger.log("Creating instance of '" + (this.getClassName()) + "'.");
        parameters = this.getParameters() != null ? [this.getClassName()].concat(this.getParameters()) : [this.getClassName()];
        instance = Ext.create.apply(this, parameters);
      }
    } else {
      Ext.Error.raise({
        msg: "Error while configuring rule for '" + (this.getIdentifier()) + "': no 'value', 'fn', or 'className' was specified."
      });
    }
    if (this.getSingleton()) {
      this.setValue(instance);
    }
    return instance;
  }
});
/*
Copyright (c) 2012 [DeftJS Framework Contributors](http://deftjs.org)
Open source under the [MIT License](http://en.wikipedia.org/wiki/MIT_License).
*/

/**
A lightweight IoC container for dependency injection.

## <u>[Basic Configuration](https://github.com/deftjs/DeftJS/wiki/Basic-Application-and-IoC-Configuration)</u>

    // Common configuration, using dependency provider name and class.
    Deft.Injector.configure({
      companyStore: "DeftQuickStart.store.CompanyStore",
      companyService: "DeftQuickStart.store.CompanyService"
    });

In the IoC configuration above, we have created two **dependency providers**, one named `companyStore` and one named `companyService`. By default, DeftJS uses lazy instantiation to create singleton instances of the `CompanyStore` and `CompanyService` classes. This means that a singleton won't be created until an object in your application specifies one of these dependency providers as an injected dependency.

## <u>[Singleton vs. Prototype Dependency Providers](https://github.com/deftjs/DeftJS/wiki/Singleton-vs.-Prototype-Dependency-Providers)</u>

By default, the dependency providers set up with the DeftJS `Injector` are singletons. This means that only one instance of that dependency will be created, and the same instance will be injected into all objects that request that dependency.

For cases where this is not desired, you can create non-singleton (prototype) dependency providers like this:

    Deft.Injector.configure({
      editHistory: {
        className: "MyApp.util.EditHistory",
        singleton: false
      }
    });

## <u>[Lazy vs. Eager Dependency Creation](https://github.com/deftjs/DeftJS/wiki/Eager-vs.-Lazy-Instantiation)</u>

By default, dependency providers are created **lazily**. This means that the dependency will not be created by DeftJS until another object is created which specifies that dependency as an injection.

In cases where lazy instantiation is not desired, you can set up a dependency provider to be created immediately upon application startup by using the `eager` configuration:

    Deft.Injector.configure({
      notificationService: {
        className: "MyApp.service.NotificationService",
        eager: true
      }
    });

> **NOTE: Only singleton dependency providers can be eagerly instantiated.** This means that specifying `singleton: false` and `eager: true` for a dependency provider won't work. The reason may be obvious: DeftJS can't do anything with a prototype object that is eagerly created, since by definition each injection of a prototype dependency must be a new instance!

## <u>[Constructor Parameters](https://github.com/deftjs/DeftJS/wiki/Constructor-Parameters)</u>

If needed, constructor parameters can be specified for a dependency provider. These parameters will be passed into the constructor of the target object when it is created. Constructor parameters can be configured in the following way:

    Deft.Injector.configure({
      contactStore: {
        className: 'MyApp.store.ContactStore',

        // Specify an array of params to pass into ContactStore constructor
        parameters: [{
          proxy: {
            type: 'ajax',
            url: '/contacts.json',
            reader: {
              type: 'json',
              root: 'contacts'
            }
          }
        }]
      }
    });

## <u>[Constructor Parameters](https://github.com/deftjs/DeftJS/wiki/Factory-Functions)</u>

A dependency provider can also specify a function to use to create the object that will be injected:

    Deft.Injector.configure({

      contactStore: {
        fn: function() {
          if (useMocks) {
            return Ext.create("MyApp.mock.store.ContactStore");
          } else {
            return Ext.create("MyApp.store.ContactStore");
          }
        },
        eager: true
      },

      contactManager: {
        // The factory function will be passed a single argument:
        // The object instance that the new object will be injected into
        fn: function(instance) {
          if (instance.session.getIsAdmin()) {
            return Ext.create("MyApp.manager.admin.ContactManager");
          } else {
            return Ext.create("MyApp.manager.user.ContactManager");
          }
        },
        singleton: false
      }

    });

When the Injector is called to resolve dependencies for these identifiers, the factory function is called and the dependency is resolved with the return value.

As shown above, a lazily instantiated factory function can optionally accept a parameter, corresponding to the instance for which the Injector is currently injecting dependencies.

Factory function dependency providers can be configured as singletons or prototypes and can be eagerly or lazily instantiated.

> **NOTE: Only singleton factory functions can be eagerly instantiated.** This means that specifying `singleton: false` and `eager: true` for a dependency provider won't work. The reason may be obvious: DeftJS can't do anything with a prototype object that is eagerly created, since by definition each injection of a prototype dependency must be a new instance!
*/

Ext.define('Deft.ioc.Injector', {
  alternateClassName: ['Deft.Injector'],
  requires: ['Ext.Component', 'Deft.log.Logger', 'Deft.ioc.DependencyProvider'],
  singleton: true,
  constructor: function() {
    this.providers = {};
    this.injectionStack = [];
    return this;
  },
  /**
	Configure the Injector.
  */

  configure: function(configuration) {
    var newProviders;
    Deft.Logger.log('Configuring the injector.');
    newProviders = {};
    Ext.Object.each(configuration, function(identifier, config) {
      var provider;
      Deft.Logger.log("Configuring dependency provider for '" + identifier + "'.");
      if (Ext.isString(config)) {
        provider = Ext.create('Deft.ioc.DependencyProvider', {
          identifier: identifier,
          className: config
        });
      } else {
        provider = Ext.create('Deft.ioc.DependencyProvider', Ext.apply({
          identifier: identifier
        }, config));
      }
      this.providers[identifier] = provider;
      newProviders[identifier] = provider;
    }, this);
    Ext.Object.each(newProviders, function(identifier, provider) {
      if (provider.getEager()) {
        Deft.Logger.log("Eagerly creating '" + (provider.getIdentifier()) + "'.");
        provider.resolve();
      }
    }, this);
  },
  /**
	Reset the Injector.
  */

  reset: function() {
    Deft.Logger.log('Resetting the injector.');
    this.providers = {};
  },
  /**
	Indicates whether the Injector can resolve a dependency by the specified identifier with the corresponding object instance or value.
  */

  canResolve: function(identifier) {
    var provider;
    provider = this.providers[identifier];
    return provider != null;
  },
  /**
	Resolve a dependency (by identifier) with the corresponding object instance or value.

	Optionally, the caller may specify the target instance (to be supplied to the dependency provider's factory function, if applicable).
  */

  resolve: function(identifier, targetInstance) {
    var provider;
    provider = this.providers[identifier];
    if (provider != null) {
      return provider.resolve(targetInstance);
    } else {
      Ext.Error.raise({
        msg: "Error while resolving value to inject: no dependency provider found for '" + identifier + "'."
      });
    }
  },
  /**
	Inject dependencies (by their identifiers) into the target object instance.
  */

  inject: function(identifiers, targetInstance, targetInstanceIsInitialized) {
    var injectConfig, name, originalInitConfigFunction, setterFunctionName, stackMessage, targetClass, value;
    if (targetInstanceIsInitialized == null) {
      targetInstanceIsInitialized = true;
    }
    targetClass = Ext.getClassName(targetInstance);
    if (Ext.Array.contains(this.injectionStack, targetClass)) {
      stackMessage = this.injectionStack.join(" -> ");
      this.injectionStack = [];
      Ext.Error.raise({
        msg: "Error resolving dependencies for '" + targetClass + "'. A circular dependency exists in its injections: " + stackMessage + " -> *" + targetClass + "*"
      });
      return null;
    }
    this.injectionStack.push(targetClass);
    injectConfig = {};
    if (Ext.isString(identifiers)) {
      identifiers = [identifiers];
    }
    Ext.Object.each(identifiers, function(key, value) {
      var identifier, resolvedValue, targetProperty;
      targetProperty = Ext.isArray(identifiers) ? value : key;
      identifier = value;
      resolvedValue = this.resolve(identifier, targetInstance);
      if (targetProperty in targetInstance.config) {
        Deft.Logger.log("Injecting '" + identifier + "' into '" + targetProperty + "' config.");
        injectConfig[targetProperty] = resolvedValue;
      } else {
        Deft.Logger.log("Injecting '" + identifier + "' into '" + targetProperty + "' property.");
        targetInstance[targetProperty] = resolvedValue;
      }
    }, this);
    this.injectionStack = [];
    if (targetInstanceIsInitialized) {
      for (name in injectConfig) {
        value = injectConfig[name];
        setterFunctionName = 'set' + Ext.String.capitalize(name);
        targetInstance[setterFunctionName].call(targetInstance, value);
      }
    } else {
      if ((Ext.getVersion('extjs') != null) && targetInstance instanceof Ext.ClassManager.get('Ext.Component')) {
        targetInstance.injectConfig = injectConfig;
      } else if (Ext.isFunction(targetInstance.initConfig)) {
        originalInitConfigFunction = targetInstance.initConfig;
        targetInstance.initConfig = function(config) {
          var result;
          result = originalInitConfigFunction.call(this, Ext.Object.merge({}, config || {}, injectConfig));
          return result;
        };
      }
    }
    return targetInstance;
  }
}, function() {
  if (Ext.getVersion('extjs') != null) {
    if (Ext.getVersion('core').isLessThan('4.1.0')) {
      Ext.Component.override({
        constructor: function(config) {
          config = Ext.Object.merge({}, config || {}, this.injectConfig || {});
          delete this.injectConfig;
          return this.callOverridden([config]);
        }
      });
    } else {
      Ext.define('Deft.InjectableComponent', {
        override: 'Ext.Component',
        constructor: function(config) {
          config = Ext.Object.merge({}, config || {}, this.injectConfig || {});
          delete this.injectConfig;
          return this.callParent([config]);
        }
      });
    }
  }
});
/*
Copyright (c) 2012 [DeftJS Framework Contributors](http://deftjs.org)
Open source under the [MIT License](http://en.wikipedia.org/wiki/MIT_License).
*/

/**
* A mixin that marks a class as participating in dependency injection. Used in conjunction with Deft.ioc.Injector.
* @deprecated 0.8 Injections are now done automatically using class preprocessors.
*/

Ext.define('Deft.mixin.Injectable', {
  requires: ['Deft.core.Class', 'Deft.ioc.Injector', 'Deft.log.Logger'],
  /**
	@private
  */

  onClassMixedIn: function(targetClass) {
    Deft.Logger.deprecate('Deft.mixin.Injectable has been deprecated and can now be omitted - simply use the \'inject\' class annotation on its own.');
  }
}, function() {
  var createInjectionInterceptor;
  if (Ext.getVersion('extjs') && Ext.getVersion('core').isLessThan('4.1.0')) {
    createInjectionInterceptor = function() {
      return function() {
        if (!this.$injected) {
          Deft.Injector.inject(this.inject, this, false);
          this.$injected = true;
        }
        return this.callOverridden(arguments);
      };
    };
  } else {
    createInjectionInterceptor = function() {
      return function() {
        if (!this.$injected) {
          Deft.Injector.inject(this.inject, this, false);
          this.$injected = true;
        }
        return this.callParent(arguments);
      };
    };
  }
  Deft.Class.registerPreprocessor('inject', function(Class, data, hooks, callback) {
    var dataInjectObject, identifier, _i, _len, _ref;
    if (Ext.isString(data.inject)) {
      data.inject = [data.inject];
    }
    if (Ext.isArray(data.inject)) {
      dataInjectObject = {};
      _ref = data.inject;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        identifier = _ref[_i];
        dataInjectObject[identifier] = identifier;
      }
      data.inject = dataInjectObject;
    }
    Deft.Class.hookOnClassCreated(hooks, function(Class) {
      Class.override({
        constructor: createInjectionInterceptor()
      });
    });
    Deft.Class.hookOnClassExtended(data, function(Class, data, hooks) {
      var _ref1;
      Deft.Class.hookOnClassCreated(hooks, function(Class) {
        Class.override({
          constructor: createInjectionInterceptor()
        });
      });
      if ((_ref1 = data.inject) == null) {
        data.inject = {};
      }
      Ext.applyIf(data.inject, Class.superclass.inject);
    });
  }, 'before', 'extend');
});
/*
Copyright (c) 2012 [DeftJS Framework Contributors](http://deftjs.org)
Open source under the [MIT License](http://en.wikipedia.org/wiki/MIT_License).
*/

/**
* @private
* Used by Deft.mvc.ViewController to handle events fired from injected objects.
*/

Ext.define('Deft.mvc.Observer', {
  requires: ['Deft.core.Class', 'Ext.util.Observable', 'Deft.util.Function'],
  statics: {
    /**
		* Merges child and parent observers into a single object. This differs from a normal object merge because
		* a given observer target and event can potentially have multiple handlers declared in different parent or
		* child classes. It transforms an event handler value into an array of values, and merges the arrays of handlers
		* from child to parent. This maintains the handlers even if both parent and child classes have handlers for the
		* same target and event.
    */

    mergeObserve: function(originalParentObserve, originalChildObserve) {
      var childEvent, childEvents, childHandler, childHandlerArray, childObserve, childTarget, convertConfigArray, eventOptionNames, parentEvent, parentEvents, parentHandler, parentHandlerArray, parentObserve, parentTarget, _ref, _ref1;
      if (!Ext.isObject(originalParentObserve)) {
        parentObserve = {};
      } else {
        parentObserve = Ext.clone(originalParentObserve);
      }
      if (!Ext.isObject(originalChildObserve)) {
        childObserve = {};
      } else {
        childObserve = Ext.clone(originalChildObserve);
      }
      eventOptionNames = ["buffer", "single", "delay", "element", "target", "destroyable"];
      convertConfigArray = function(observeConfig) {
        var handlerConfig, newObserveEvents, observeEvents, observeTarget, thisEventOptionName, thisObserveEvent, _i, _j, _len, _len1, _results;
        _results = [];
        for (observeTarget in observeConfig) {
          observeEvents = observeConfig[observeTarget];
          if (Ext.isArray(observeEvents)) {
            newObserveEvents = {};
            for (_i = 0, _len = observeEvents.length; _i < _len; _i++) {
              thisObserveEvent = observeEvents[_i];
              if (Ext.Object.getSize(thisObserveEvent) === 1) {
                Ext.apply(newObserveEvents, thisObserveEvent);
              } else {
                handlerConfig = {};
                if ((thisObserveEvent != null ? thisObserveEvent.fn : void 0) != null) {
                  handlerConfig.fn = thisObserveEvent.fn;
                }
                if ((thisObserveEvent != null ? thisObserveEvent.scope : void 0) != null) {
                  handlerConfig.scope = thisObserveEvent.scope;
                }
                for (_j = 0, _len1 = eventOptionNames.length; _j < _len1; _j++) {
                  thisEventOptionName = eventOptionNames[_j];
                  if ((thisObserveEvent != null ? thisObserveEvent[thisEventOptionName] : void 0) != null) {
                    handlerConfig[thisEventOptionName] = thisObserveEvent[thisEventOptionName];
                  }
                }
                newObserveEvents[thisObserveEvent.event] = [handlerConfig];
              }
            }
            _results.push(observeConfig[observeTarget] = newObserveEvents);
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      };
      convertConfigArray(parentObserve);
      convertConfigArray(childObserve);
      for (childTarget in childObserve) {
        childEvents = childObserve[childTarget];
        for (childEvent in childEvents) {
          childHandler = childEvents[childEvent];
          if (Ext.isString(childHandler)) {
            childObserve[childTarget][childEvent] = childHandler.replace(' ', '').split(',');
          }
          if (!(parentObserve != null ? parentObserve[childTarget] : void 0)) {
            parentObserve[childTarget] = {};
          }
          if (!(parentObserve != null ? (_ref = parentObserve[childTarget]) != null ? _ref[childEvent] : void 0 : void 0)) {
            parentObserve[childTarget][childEvent] = childObserve[childTarget][childEvent];
            delete childObserve[childTarget][childEvent];
          }
        }
      }
      for (parentTarget in parentObserve) {
        parentEvents = parentObserve[parentTarget];
        for (parentEvent in parentEvents) {
          parentHandler = parentEvents[parentEvent];
          if (Ext.isString(parentHandler)) {
            parentObserve[parentTarget][parentEvent] = parentHandler.split(',');
          }
          if (childObserve != null ? (_ref1 = childObserve[parentTarget]) != null ? _ref1[parentEvent] : void 0 : void 0) {
            childHandlerArray = childObserve[parentTarget][parentEvent];
            parentHandlerArray = parentObserve[parentTarget][parentEvent];
            parentObserve[parentTarget][parentEvent] = Ext.Array.unique(Ext.Array.insert(parentHandlerArray, 0, childHandlerArray));
          }
        }
      }
      return parentObserve;
    }
  },
  /**
	* Expects a config object with properties for host, target, and events.
  */

  constructor: function(config) {
    var eventName, events, handler, handlerArray, host, options, references, scope, target, _i, _len;
    this.listeners = [];
    host = config != null ? config.host : void 0;
    target = config != null ? config.target : void 0;
    events = config != null ? config.events : void 0;
    if (host && target && (this.isPropertyChain(target) || this.isTargetObservable(host, target))) {
      for (eventName in events) {
        handlerArray = events[eventName];
        if (Ext.isString(handlerArray)) {
          handlerArray = handlerArray.replace(' ', '').split(',');
        }
        for (_i = 0, _len = handlerArray.length; _i < _len; _i++) {
          handler = handlerArray[_i];
          scope = host;
          options = null;
          if (Ext.isObject(handler)) {
            options = Ext.clone(handler);
            if (options != null ? options.event : void 0) {
              eventName = Deft.util.Function.extract(options, "event");
            }
            if (options != null ? options.fn : void 0) {
              handler = Deft.util.Function.extract(options, "fn");
            }
            if (options != null ? options.scope : void 0) {
              scope = Deft.util.Function.extract(options, "scope");
            }
          }
          references = this.locateReferences(host, target, handler);
          if (references) {
            references.target.on(eventName, references.handler, scope, options);
            this.listeners.push({
              targetName: target,
              target: references.target,
              event: eventName,
              handler: references.handler,
              scope: scope
            });
            Deft.Logger.log("Created observer on '" + target + "' for event '" + eventName + "'.");
          } else {
            Deft.Logger.warn("Could not create observer on '" + target + "' for event '" + eventName + "'.");
          }
        }
      }
    } else {
      Deft.Logger.warn("Could not create observers on '" + target + "' because '" + target + "' is not an Ext.util.Observable");
    }
    return this;
  },
  /**
	* Returns true if the passed host has a target that is Observable.
	* Checks for an isObservable=true property, observable mixin, or if the class extends Observable.
  */

  isTargetObservable: function(host, target) {
    var hostTarget, hostTargetClass, _ref;
    hostTarget = this.locateTarget(host, target);
    if (!(hostTarget != null)) {
      return false;
    }
    if ((hostTarget.isObservable != null) || (((_ref = hostTarget.mixins) != null ? _ref.observable : void 0) != null)) {
      return true;
    } else {
      hostTargetClass = Ext.ClassManager.getClass(hostTarget);
      return Deft.Class.extendsClass('Ext.util.Observable', hostTargetClass) || Deft.Class.extendsClass('Ext.mixin.Observable', hostTargetClass);
    }
  },
  /**
	* Attempts to locate an observer target given the host object and target property name.
	* Checks for both host[ target ], and host.getTarget().
  */

  locateTarget: function(host, target) {
    var result;
    if (Ext.isFunction(host['get' + Ext.String.capitalize(target)])) {
      result = host['get' + Ext.String.capitalize(target)].call(host);
      return result;
    } else if ((host != null ? host[target] : void 0) != null) {
      result = host[target];
      return result;
    } else {
      return null;
    }
  },
  /**
	* Returns true if the passed target is a string containing a '.', indicating that it is referencing a nested property.
  */

  isPropertyChain: function(target) {
    return Ext.isString(target) && target.indexOf('.') > -1;
  },
  /**
	* Given a host object, target property name, and handler, return object references for the final target and handler function.
	* If necessary, recurse down a property chain to locate the final target object for the event listener.
  */

  locateReferences: function(host, target, handler) {
    var handlerHost, propertyChain;
    handlerHost = host;
    if (this.isPropertyChain(target)) {
      propertyChain = this.parsePropertyChain(host, target);
      if (!propertyChain) {
        return null;
      }
      host = propertyChain.host;
      target = propertyChain.target;
    }
    if (Ext.isFunction(handler)) {
      return {
        target: this.locateTarget(host, target),
        handler: handler
      };
    } else if (Ext.isFunction(handlerHost[handler])) {
      return {
        target: this.locateTarget(host, target),
        handler: handlerHost[handler]
      };
    } else {
      return null;
    }
  },
  /**
	* Given a target property chain and a property host object, recurse down the property chain and return
	* the final host object from the property chain, and the final object that will accept the event listener.
  */

  parsePropertyChain: function(host, target) {
    var propertyChain;
    if (Ext.isString(target)) {
      propertyChain = target.split('.');
    } else if (Ext.isArray(target)) {
      propertyChain = target;
    } else {
      return null;
    }
    if (propertyChain.length > 1 && (this.locateTarget(host, propertyChain[0]) != null)) {
      return this.parsePropertyChain(this.locateTarget(host, propertyChain[0]), propertyChain.slice(1));
    } else if (this.isTargetObservable(host, propertyChain[0])) {
      return {
        host: host,
        target: propertyChain[0]
      };
    } else {
      return null;
    }
  },
  /**
	* Iterate through the listeners array and remove each event listener.
  */

  destroy: function() {
    var listenerData, _i, _len, _ref;
    _ref = this.listeners;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      listenerData = _ref[_i];
      Deft.Logger.log("Removing observer on '" + listenerData.targetName + "' for event '" + listenerData.event + "'.");
      listenerData.target.un(listenerData.event, listenerData.handler, listenerData.scope);
    }
    this.listeners = [];
  }
});
/*
Copyright (c) 2012 [DeftJS Framework Contributors](http://deftjs.org)
Open source under the [MIT License](http://en.wikipedia.org/wiki/MIT_License).
*/

/**
* Manages live events attached to component selectors. Used by Deft.mvc.ComponentSelector.
* @private
*/

Ext.define('Deft.mvc.ComponentSelectorListener', {
  requires: ['Deft.event.LiveEventBus'],
  constructor: function(config) {
    var component, _i, _len, _ref;
    Ext.apply(this, config);
    if (this.componentSelector.live) {
      Deft.LiveEventBus.addListener(this.componentSelector.view, this.componentSelector.selector, this.eventName, this.fn, this.scope, this.options);
    } else {
      _ref = this.componentSelector.components;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        component = _ref[_i];
        component.on(this.eventName, this.fn, this.scope, this.options);
      }
    }
    return this;
  },
  destroy: function() {
    var component, _i, _len, _ref;
    if (this.componentSelector.live) {
      Deft.LiveEventBus.removeListener(this.componentSelector.view, this.componentSelector.selector, this.eventName, this.fn, this.scope);
    } else {
      _ref = this.componentSelector.components;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        component = _ref[_i];
        component.un(this.eventName, this.fn, this.scope);
      }
    }
  }
});
/*
Copyright (c) 2012 [DeftJS Framework Contributors](http://deftjs.org)
Open source under the [MIT License](http://en.wikipedia.org/wiki/MIT_License).
*/

/**
* @private
* Models a component selector used by Deft.mvc.ViewController to locate view components and attach event listeners.
*/

Ext.define('Deft.mvc.ComponentSelector', {
  requires: ['Ext.ComponentQuery', 'Deft.log.Logger', 'Deft.mvc.ComponentSelectorListener'],
  constructor: function(config) {
    var eventName, fn, listener, options, scope, _ref;
    Ext.apply(this, config);
    if (!this.live) {
      this.components = this.selector != null ? Ext.ComponentQuery.query(this.selector, this.view) : [this.view];
    }
    this.selectorListeners = [];
    if (Ext.isObject(this.listeners)) {
      _ref = this.listeners;
      for (eventName in _ref) {
        listener = _ref[eventName];
        fn = listener;
        scope = this.scope;
        options = null;
        if (Ext.isObject(listener)) {
          options = Ext.apply({}, listener);
          if (options.fn != null) {
            fn = options.fn;
            delete options.fn;
          }
          if (options.scope != null) {
            scope = options.scope;
            delete options.scope;
          }
        }
        if (Ext.isString(fn) && Ext.isFunction(scope[fn])) {
          fn = scope[fn];
        }
        if (!Ext.isFunction(fn)) {
          Ext.Error.raise({
            msg: "Error adding '" + eventName + "' listener: the specified handler '" + fn + "' is not a Function or does not exist."
          });
        }
        this.addListener(eventName, fn, scope, options);
      }
    }
    return this;
  },
  destroy: function() {
    var selectorListener, _i, _len, _ref;
    _ref = this.selectorListeners;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      selectorListener = _ref[_i];
      selectorListener.destroy();
    }
    this.selectorListeners = [];
  },
  /**
	Add an event listener to this component selector.
  */

  addListener: function(eventName, fn, scope, options) {
    var selectorListener;
    if (this.findListener(eventName, fn, scope) != null) {
      Ext.Error.raise({
        msg: "Error adding '" + eventName + "' listener: an existing listener for the specified function was already registered for '" + this.selector + "."
      });
    }
    Deft.Logger.log("Adding '" + eventName + "' listener to '" + this.selector + "'.");
    selectorListener = Ext.create('Deft.mvc.ComponentSelectorListener', {
      componentSelector: this,
      eventName: eventName,
      fn: fn,
      scope: scope,
      options: options
    });
    this.selectorListeners.push(selectorListener);
  },
  /**
	Remove an event listener from this component selector.
  */

  removeListener: function(eventName, fn, scope) {
    var selectorListener;
    selectorListener = this.findListener(eventName, fn, scope);
    if (selectorListener != null) {
      Deft.Logger.log("Removing '" + eventName + "' listener from '" + this.selector + "'.");
      selectorListener.destroy();
      Ext.Array.remove(this.selectorListeners, selectorListener);
    }
  },
  findListener: function(eventName, fn, scope) {
    var selectorListener, _i, _len, _ref;
    _ref = this.selectorListeners;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      selectorListener = _ref[_i];
      if (selectorListener.eventName === eventName && selectorListener.fn === fn && selectorListener.scope === scope) {
        return selectorListener;
      }
    }
    return null;
  }
});
/*
Copyright (c) 2012 [DeftJS Framework Contributors](http://deftjs.org)
Open source under the [MIT License](http://en.wikipedia.org/wiki/MIT_License).
*/

/**
A lightweight MVC view controller. Full usage instructions in the [DeftJS documentation](https://github.com/deftjs/DeftJS/wiki/ViewController).

First, specify a ViewController to attach to a view:

    Ext.define("DeftQuickStart.view.MyTabPanel", {
      extend: "Ext.tab.Panel",
      controller: "DeftQuickStart.controller.MainController",
      ...
    });

Next, define the ViewController:

    Ext.define("DeftQuickStart.controller.MainController", {
      extend: "Deft.mvc.ViewController",

      init: function() {
        return this.callParent(arguments);
      }

    });

## Inject dependencies using the <u>[`inject` property](https://github.com/deftjs/DeftJS/wiki/Injecting-Dependencies)</u>:

    Ext.define("DeftQuickStart.controller.MainController", {
      extend: "Deft.mvc.ViewController",
      inject: ["companyStore"],

      config: {
        companyStore: null
      },

      init: function() {
        return this.callParent(arguments);
      }

    });

## Define <u>[references to view components](https://github.com/deftjs/DeftJS/wiki/Accessing-Views)</u> and <u>[add view listeners](https://github.com/deftjs/DeftJS/wiki/Handling-View-Events)</u> with the `control` property:

    Ext.define("DeftQuickStart.controller.MainController", {
      extend: "Deft.mvc.ViewController",

      control: {

        // Most common configuration, using an itemId and listener
        manufacturingFilter: {
          change: "onFilterChange"
        },

        // Reference only, with no listeners
        serviceIndustryFilter: true,

        // Configuration using selector, listeners, and event listener options
        salesFilter: {
          selector: "toolbar > checkbox",
          listeners: {
            change: {
              fn: "onFilterChange",
              buffer: 50,
              single: true
            }
          }
        }
      },

      init: function() {
        return this.callParent(arguments);
      }

      // Event handlers or other methods here...

    });

## Dynamically monitor view to attach listeners to added components with <u>[live selectors](https://github.com/deftjs/DeftJS/wiki/ViewController-Live-Selectors)</u>:

    control: {
      manufacturingFilter: {
        live: true,
        listeners: {
          change: "onFilterChange"
        }
      }
    };

## Observe events on injected objects with the <u>[`observe` property](https://github.com/deftjs/DeftJS/wiki/ViewController-Observe-Configuration)</u>:

    Ext.define("DeftQuickStart.controller.MainController", {
      extend: "Deft.mvc.ViewController",
      inject: ["companyStore"],

      config: {
        companyStore: null
      },

      observe: {
        // Observe companyStore for the update event
        companyStore: {
          update: "onCompanyStoreUpdateEvent"
        }
      },

      init: function() {
        return this.callParent(arguments);
      },

      onCompanyStoreUpdateEvent: function(store, model, operation, fieldNames) {
        // Do something when store fires update event
      }

    });
*/

Ext.define('Deft.mvc.ViewController', {
  alternateClassName: ['Deft.ViewController'],
  requires: ['Deft.core.Class', 'Deft.log.Logger', 'Deft.mvc.ComponentSelector', 'Deft.mvc.Observer'],
  config: {
    /**
		* View controlled by this ViewController.
    */

    view: null
  },
  /**
	* Observers automatically created and removed by this ViewController.
  */

  observe: {},
  constructor: function(config) {
    if (config == null) {
      config = {};
    }
    if (config.view) {
      this.controlView(config.view);
    }
    this.initConfig(config);
    if (Ext.Object.getSize(this.observe) > 0) {
      this.createObservers();
    }
    return this;
  },
  /**
	* @protected
  */

  controlView: function(view) {
    if (view instanceof Ext.ClassManager.get('Ext.Component')) {
      this.setView(view);
      this.registeredComponentReferences = {};
      this.registeredComponentSelectors = {};
      if (Ext.getVersion('extjs') != null) {
        if (this.getView().rendered) {
          this.onViewInitialize();
        } else {
          this.getView().on('afterrender', this.onViewInitialize, this, {
            single: true
          });
        }
      } else {
        if (this.getView().initialized) {
          this.onViewInitialize();
        } else {
          this.getView().on('initialize', this.onViewInitialize, this, {
            single: true
          });
        }
      }
    } else {
      Ext.Error.raise({
        msg: 'Error constructing ViewController: the configured \'view\' is not an Ext.Component.'
      });
    }
  },
  /**
	* Initialize the ViewController
  */

  init: function() {},
  /**
	* Destroy the ViewController
  */

  destroy: function() {
    var id, selector;
    for (id in this.registeredComponentReferences) {
      this.removeComponentReference(id);
    }
    for (selector in this.registeredComponentSelectors) {
      this.removeComponentSelector(selector);
    }
    this.removeObservers();
    return true;
  },
  /**
	* @private
  */

  onViewInitialize: function() {
    var config, id, listeners, live, originalViewDestroyFunction, selector, self, _ref;
    if (Ext.getVersion('extjs') != null) {
      this.getView().on('beforedestroy', this.onViewBeforeDestroy, this);
    } else {
      self = this;
      originalViewDestroyFunction = this.getView().destroy;
      this.getView().destroy = function() {
        if (self.destroy()) {
          originalViewDestroyFunction.call(this);
        }
      };
    }
    _ref = this.control;
    for (id in _ref) {
      config = _ref[id];
      selector = null;
      if (id !== 'view') {
        if (Ext.isString(config)) {
          selector = config;
        } else if (config.selector != null) {
          selector = config.selector;
        } else {
          selector = '#' + id;
        }
      }
      listeners = null;
      if (Ext.isObject(config.listeners)) {
        listeners = config.listeners;
      } else {
        if (!((config.selector != null) || (config.live != null))) {
          listeners = config;
        }
      }
      live = (config.live != null) && config.live;
      this.addComponentReference(id, selector, live);
      this.addComponentSelector(selector, listeners, live);
    }
    this.init();
  },
  /**
	* @private
  */

  onViewBeforeDestroy: function() {
    if (this.destroy()) {
      this.getView().un('beforedestroy', this.onViewBeforeDestroy, this);
      return true;
    }
    return false;
  },
  /**
	* Add a component accessor method the ViewController for the specified view-relative selector.
  */

  addComponentReference: function(id, selector, live) {
    var getterName, matches;
    if (live == null) {
      live = false;
    }
    Deft.Logger.log("Adding '" + id + "' component reference for selector: '" + selector + "'.");
    if (this.registeredComponentReferences[id] != null) {
      Ext.Error.raise({
        msg: "Error adding component reference: an existing component reference was already registered as '" + id + "'."
      });
    }
    if (id !== 'view') {
      getterName = 'get' + Ext.String.capitalize(id);
      if (this[getterName] == null) {
        if (live) {
          this[getterName] = Ext.Function.pass(this.getViewComponent, [selector], this);
        } else {
          matches = this.getViewComponent(selector);
          if (matches == null) {
            Ext.Error.raise({
              msg: "Error locating component: no component(s) found matching '" + selector + "'."
            });
          }
          this[getterName] = function() {
            return matches;
          };
        }
        this[getterName].generated = true;
      }
    }
    this.registeredComponentReferences[id] = true;
  },
  /**
	* Remove a component accessor method the ViewController for the specified view-relative selector.
  */

  removeComponentReference: function(id) {
    var getterName;
    Deft.Logger.log("Removing '" + id + "' component reference.");
    if (this.registeredComponentReferences[id] == null) {
      Ext.Error.raise({
        msg: "Error removing component reference: no component reference is registered as '" + id + "'."
      });
    }
    if (id !== 'view') {
      getterName = 'get' + Ext.String.capitalize(id);
      if (this[getterName].generated) {
        this[getterName] = null;
      }
    }
    delete this.registeredComponentReferences[id];
  },
  /**
	* Get the component(s) corresponding to the specified view-relative selector.
  */

  getViewComponent: function(selector) {
    var matches;
    if (selector != null) {
      matches = Ext.ComponentQuery.query(selector, this.getView());
      if (matches.length === 0) {
        return null;
      } else if (matches.length === 1) {
        return matches[0];
      } else {
        return matches;
      }
    } else {
      return this.getView();
    }
  },
  /**
	* Add a component selector with the specified listeners for the specified view-relative selector.
  */

  addComponentSelector: function(selector, listeners, live) {
    var componentSelector, existingComponentSelector;
    if (live == null) {
      live = false;
    }
    Deft.Logger.log("Adding component selector for: '" + selector + "'.");
    existingComponentSelector = this.getComponentSelector(selector);
    if (existingComponentSelector != null) {
      Ext.Error.raise({
        msg: "Error adding component selector: an existing component selector was already registered for '" + selector + "'."
      });
    }
    componentSelector = Ext.create('Deft.mvc.ComponentSelector', {
      view: this.getView(),
      selector: selector,
      listeners: listeners,
      scope: this,
      live: live
    });
    this.registeredComponentSelectors[selector] = componentSelector;
  },
  /**
	* Remove a component selector with the specified listeners for the specified view-relative selector.
  */

  removeComponentSelector: function(selector) {
    var existingComponentSelector;
    Deft.Logger.log("Removing component selector for '" + selector + "'.");
    existingComponentSelector = this.getComponentSelector(selector);
    if (existingComponentSelector == null) {
      Ext.Error.raise({
        msg: "Error removing component selector: no component selector registered for '" + selector + "'."
      });
    }
    existingComponentSelector.destroy();
    delete this.registeredComponentSelectors[selector];
  },
  /**
	* Get the component selectorcorresponding to the specified view-relative selector.
  */

  getComponentSelector: function(selector) {
    return this.registeredComponentSelectors[selector];
  },
  /**
	* @protected
  */

  createObservers: function() {
    var events, target, _ref;
    this.registeredObservers = {};
    _ref = this.observe;
    for (target in _ref) {
      events = _ref[target];
      this.addObserver(target, events);
    }
  },
  addObserver: function(target, events) {
    var observer;
    observer = Ext.create('Deft.mvc.Observer', {
      host: this,
      target: target,
      events: events
    });
    return this.registeredObservers[target] = observer;
  },
  /**
	* @protected
  */

  removeObservers: function() {
    var observer, target, _ref;
    _ref = this.registeredObservers;
    for (target in _ref) {
      observer = _ref[target];
      observer.destroy();
      delete this.registeredObservers[target];
    }
  }
}, function() {
  /**
	* Preprocessor to handle merging of 'observe' objects on parent and child classes.
  */
  return Deft.Class.registerPreprocessor('observe', function(Class, data, hooks, callback) {
    Deft.Class.hookOnClassExtended(data, function(Class, data, hooks) {
      var _ref;
      if (Class.superclass && ((_ref = Class.superclass) != null ? _ref.observe : void 0) && Deft.Class.extendsClass('Deft.mvc.ViewController', Class)) {
        data.observe = Deft.mvc.Observer.mergeObserve(Class.superclass.observe, data.observe);
      }
    });
  }, 'before', 'extend');
});
/*
Copyright (c) 2012 [DeftJS Framework Contributors](http://deftjs.org)
Open source under the [MIT License](http://en.wikipedia.org/wiki/MIT_License).
*/

/**
* A lightweight Application template class.
*/

Ext.define('Deft.mvc.Application', {
  alternateClassName: ['Deft.Application'],
  /**
	* Indicates whether this Application instance has been initialized.
  */

  initialized: false,
  /**
	* @param {Object} [config] Configuration object.
  */

  constructor: function(config) {
    if (config == null) {
      config = {};
    }
    this.initConfig(config);
    Ext.onReady(function() {
      this.init();
      this.initialized = true;
    }, this);
    return this;
  },
  /**
	* Initialize the Application
  */

  init: function() {}
});
/*
Copyright (c) 2012 [DeftJS Framework Contributors](http://deftjs.org)
Open source under the [MIT License](http://en.wikipedia.org/wiki/MIT_License).
*/

/**
* A mixin that creates and attaches the specified view controller(s) to the target view. Used in conjunction with Deft.mvc.ViewController.
* @deprecated 0.8 ViewController attachemnt is now done automatically using class preprocessors.
*/

Ext.define('Deft.mixin.Controllable', {
  requires: ['Ext.Component', 'Deft.core.Class', 'Deft.log.Logger'],
  /**
	@private
  */

  onClassMixedIn: function(targetClass) {
    Deft.Logger.deprecate('Deft.mixin.Controllable has been deprecated and can now be omitted - simply use the \'controller\' class annotation on its own.');
  }
}, function() {
  var createControllerInterceptor;
  if (Ext.getVersion('extjs') && Ext.getVersion('core').isLessThan('4.1.0')) {
    createControllerInterceptor = function() {
      return function(config) {
        var controller;
        if (config == null) {
          config = {};
        }
        if (this instanceof Ext.ClassManager.get('Ext.Component') && !this.$controlled) {
          try {
            controller = Ext.create(this.controller, config.controllerConfig || this.controllerConfig || {});
          } catch (error) {
            Deft.Logger.warn("Error initializing view controller: an error occurred while creating an instance of the specified controller: '" + this.controller + "'.");
            throw error;
          }
          if (this.getController === void 0) {
            this.getController = function() {
              return controller;
            };
          }
          this.$controlled = true;
          this.callOverridden(arguments);
          controller.controlView(this);
          return this;
        }
        return this.callOverridden(arguments);
      };
    };
  } else {
    createControllerInterceptor = function() {
      return function(config) {
        var controller;
        if (config == null) {
          config = {};
        }
        if (this instanceof Ext.ClassManager.get('Ext.Component') && !this.$controlled) {
          try {
            controller = Ext.create(this.controller, config.controllerConfig || this.controllerConfig || {});
          } catch (error) {
            Deft.Logger.warn("Error initializing view controller: an error occurred while creating an instance of the specified controller: '" + this.controller + "'.");
            throw error;
          }
          if (this.getController === void 0) {
            this.getController = function() {
              return controller;
            };
          }
          this.$controlled = true;
          this.callParent(arguments);
          controller.controlView(this);
          return this;
        }
        return this.callParent(arguments);
      };
    };
  }
  Deft.Class.registerPreprocessor('controller', function(Class, data, hooks, callback) {
    var self;
    Deft.Class.hookOnClassCreated(hooks, function(Class) {
      Class.override({
        constructor: createControllerInterceptor()
      });
    });
    Deft.Class.hookOnClassExtended(data, function(Class, data, hooks) {
      Deft.Class.hookOnClassCreated(hooks, function(Class) {
        Class.override({
          constructor: createControllerInterceptor()
        });
      });
    });
    self = this;
    Ext.require([data.controller], function() {
      if (callback != null) {
        callback.call(self, Class, data, hooks);
      }
    });
    return false;
  }, 'before', 'extend');
});
/*
Copyright (c) 2012 [DeftJS Framework Contributors](http://deftjs.org)
Open source under the [MIT License](http://en.wikipedia.org/wiki/MIT_License).

Promise.when(), all(), any(), some(), map() and reduce() methods adapted from:
[when.js](https://github.com/cujojs/when)
Copyright (c) B Cavalier & J Hann
Open source under the [MIT License](http://en.wikipedia.org/wiki/MIT_License).
*/

/**
* A Promise represents the result of a future value that has not been defined yet, typically because it is created asynchronously. Used in conjunction with Deft.promise.Deferred.
*/

Ext.define('Deft.promise.Promise', {
  alternateClassName: ['Deft.Promise'],
  statics: {
    /**
		* Returns a new {@link Deft.promise.Promise} that:
		* - resolves immediately for the specified value, or
		* - resolves, rejects, updates or cancels when the specified {@link Deft.promise.Deferred} or {@link Deft.promise.Promise} is resolved, rejected, updated or cancelled.
    */

    when: function(promiseOrValue) {
      var deferred;
      if (promiseOrValue instanceof Ext.ClassManager.get('Deft.promise.Promise') || promiseOrValue instanceof Ext.ClassManager.get('Deft.promise.Deferred')) {
        return promiseOrValue.then();
      } else if (Ext.isObject(promiseOrValue) && Ext.isFunction(promiseOrValue.then)) {
        deferred = Ext.create('Deft.promise.Deferred');
        promiseOrValue.then(function(value) {
          deferred.resolve(value);
        }, function(error) {
          deferred.reject(error);
        });
        return deferred.then();
      } else {
        deferred = Ext.create('Deft.promise.Deferred');
        deferred.resolve(promiseOrValue);
        return deferred.then();
      }
    },
    /**
		* Returns a new {@link Deft.promise.Promise} that will only resolve once all the specified `promisesOrValues` have resolved.
		* The resolution value will be an Array containing the resolution value of each of the `promisesOrValues`.
    */

    all: function(promisesOrValues) {
      return this.when(promisesOrValues).then({
        success: function(promisesOrValues) {
          var cancelFunction, canceller, complete, createSuccessFunction, deferred, failureFunction, index, progressFunction, promiseOrValue, rejecter, resolvedCount, resolvedValues, resolver, total, updater, _i, _len;
          deferred = Ext.create('Deft.promise.Deferred');
          total = promisesOrValues.length;
          resolvedValues = new Array(promisesOrValues);
          resolvedCount = 0;
          updater = function(progress) {
            deferred.update(progress);
            return progress;
          };
          resolver = function(index, value) {
            resolvedValues[index] = value;
            resolvedCount++;
            if (resolvedCount === total) {
              complete();
              deferred.resolve(resolvedValues);
            }
            return value;
          };
          rejecter = function(error) {
            complete();
            deferred.reject(error);
            return error;
          };
          canceller = function(reason) {
            complete();
            deferred.cancel(reason);
            return reason;
          };
          complete = function() {
            return updater = resolver = rejecter = canceller = Ext.emptyFn;
          };
          createSuccessFunction = function(index) {
            return function(value) {
              return resolver(index, value);
            };
          };
          failureFunction = function(value) {
            return rejecter(value);
          };
          progressFunction = function(value) {
            return updater(value);
          };
          cancelFunction = function(value) {
            return canceller(value);
          };
          for (index = _i = 0, _len = promisesOrValues.length; _i < _len; index = ++_i) {
            promiseOrValue = promisesOrValues[index];
            if (index in promisesOrValues) {
              this.when(promiseOrValue).then({
                success: createSuccessFunction(index),
                failure: failureFunction,
                progress: progressFunction,
                cancel: cancelFunction
              });
            }
          }
          return deferred.getPromise();
        },
        scope: this
      });
    },
    /**
		* Initiates a competitive race, returning a new {@link Deft.promise.Promise} that will resolve when any one of the supplied `promisesOrValues`
		* have resolved, or will reject when all `promisesOrValues` have rejected or cancelled.
		* The resolution value will the first value of `promisesOrValues` to resolve.
    */

    any: function(promisesOrValues) {
      return this.some(promisesOrValues, 1).then({
        success: function(values) {
          return values[0];
        }
      });
    },
    /**
		* Initiates a competitive race, returning a new {@link Deft.promise.Promise} that will resolve when `howMany` of the supplied `promisesOrValues`
		* have resolved, or will reject when it becomes impossible for `howMany` to resolve.
		* The resolution value will be an Array of the first `howMany` values of `promisesOrValues` to resolve.
    */

    some: function(promisesOrValues, howMany) {
      return this.when(promisesOrValues).then({
        success: function(promisesOrValues) {
          var cancelFunction, canceller, complete, deferred, errorMessage, failureFunction, index, progressFunction, promiseOrValue, rejecter, remainingToReject, remainingToResolve, resolver, successFunction, updater, values, _i, _len;
          values = [];
          remainingToResolve = howMany;
          remainingToReject = (promisesOrValues.length - remainingToResolve) + 1;
          deferred = Ext.create('Deft.promise.Deferred');
          if (promisesOrValues.length < howMany) {
            deferred.reject(new Error('Too few Promises or values were supplied to obtain the requested number of resolved values.'));
          } else {
            errorMessage = howMany === 1 ? 'No Promises were resolved.' : 'Too few Promises were resolved.';
            updater = function(progress) {
              deferred.update(progress);
              return progress;
            };
            resolver = function(value) {
              values.push(value);
              remainingToResolve--;
              if (remainingToResolve === 0) {
                complete();
                deferred.resolve(values);
              }
              return value;
            };
            rejecter = function(error) {
              remainingToReject--;
              if (remainingToReject === 0) {
                complete();
                deferred.reject(new Error(errorMessage));
              }
              return error;
            };
            canceller = function(reason) {
              remainingToReject--;
              if (remainingToReject === 0) {
                complete();
                deferred.reject(new Error(errorMessage));
              }
              return reason;
            };
            complete = function() {
              return updater = resolver = rejecter = canceller = Ext.emptyFn;
            };
            successFunction = function(value) {
              return resolver(value);
            };
            failureFunction = function(value) {
              return rejecter(value);
            };
            progressFunction = function(value) {
              return updater(value);
            };
            cancelFunction = function(value) {
              return canceller(value);
            };
            for (index = _i = 0, _len = promisesOrValues.length; _i < _len; index = ++_i) {
              promiseOrValue = promisesOrValues[index];
              if (index in promisesOrValues) {
                this.when(promiseOrValue).then({
                  success: successFunction,
                  failure: failureFunction,
                  progress: progressFunction,
                  cancel: cancelFunction
                });
              }
            }
          }
          return deferred.getPromise();
        },
        scope: this
      });
    },
    /**
		* Returns a new function that wraps the specified function and caches the results for previously processed inputs.
		* Similar to `Deft.util.Function::memoize()`, except it allows input to contain promises and/or values.
    */

    memoize: function(fn, scope, hashFn) {
      var memoizedFn;
      memoizedFn = Deft.util.Function.memoize(fn, scope, hashFn);
      return Ext.bind(function() {
        return this.all(Ext.Array.toArray(arguments)).then(function(values) {
          return memoizedFn.apply(scope, values);
        });
      }, this);
    },
    /**
		* Traditional map function, similar to `Array.prototype.map()`, that allows input to contain promises and/or values.
		* The specified map function may return either a value or a promise.
    */

    map: function(promisesOrValues, mapFunction) {
      var createCallback;
      createCallback = function(index) {
        return function(value) {
          return mapFunction(value, index, promisesOrValues);
        };
      };
      return this.when(promisesOrValues).then({
        success: function(promisesOrValues) {
          var index, promiseOrValue, results, _i, _len;
          results = new Array(promisesOrValues.length);
          for (index = _i = 0, _len = promisesOrValues.length; _i < _len; index = ++_i) {
            promiseOrValue = promisesOrValues[index];
            if (index in promisesOrValues) {
              results[index] = this.when(promiseOrValue).then(createCallback(index));
            }
          }
          return this.reduce(results, this.reduceIntoArray, results);
        },
        scope: this
      });
    },
    /**
		* Traditional reduce function, similar to `Array.reduce()`, that allows input to contain promises and/or values.
    */

    reduce: function(promisesOrValues, reduceFunction, initialValue) {
      var initialValueSpecified;
      initialValueSpecified = arguments.length === 3;
      return this.when(promisesOrValues).then({
        success: function(promisesOrValues) {
          var reduceArguments, whenFunction;
          whenFunction = this.when;
          reduceArguments = [
            function(previousValueOrPromise, currentValueOrPromise, currentIndex) {
              return whenFunction(previousValueOrPromise).then(function(previousValue) {
                return whenFunction(currentValueOrPromise).then(function(currentValue) {
                  return reduceFunction(previousValue, currentValue, currentIndex, promisesOrValues);
                });
              });
            }
          ];
          if (initialValueSpecified) {
            reduceArguments.push(initialValue);
          }
          return this.when(this.reduceArray.apply(promisesOrValues, reduceArguments));
        },
        scope: this
      });
    },
    /**
		* Fallback implementation when Array.reduce is not available.
		* @private
    */

    reduceArray: function(reduceFunction, initialValue) {
      var args, array, index, length, reduced;
      index = 0;
      array = Object(this);
      length = array.length >>> 0;
      args = arguments;
      if (args.length <= 1) {
        while (true) {
          if (index in array) {
            reduced = array[index++];
            break;
          }
          if (++index >= length) {
            throw new TypeError();
          }
        }
      } else {
        reduced = args[1];
      }
      while (index < length) {
        if (index in array) {
          reduced = reduceFunction(reduced, array[index], index, array);
        }
        index++;
      }
      return reduced;
    },
    /**
		* @private
    */

    reduceIntoArray: function(previousValue, currentValue, currentIndex) {
      previousValue[currentIndex] = currentValue;
      return previousValue;
    }
  },
  id: null,
  constructor: function(config) {
    this.id = config.id;
    this.deferred = config.deferred;
    return this;
  },
  /**
	* Returns a new {@link Deft.promise.Promise} with the specified callbacks registered to be called when this {@link Deft.promise.Promise} is resolved, rejected, updated or cancelled.
  */

  then: function(callbacks) {
    return this.deferred.then.apply(this.deferred, arguments);
  },
  /**
	* Returns a new {@link Deft.promise.Promise} with the specified callback registered to be called when this {@link Deft.promise.Promise} is rejected.
  */

  otherwise: function(callback, scope) {
    return this.deferred.otherwise.apply(this.deferred, arguments);
  },
  /**
	* Returns a new {@link Deft.promise.Promise} with the specified callback registered to be called when this {@link Deft.promise.Promise} is resolved, rejected or cancelled.
  */

  always: function(callback, scope) {
    return this.deferred.always.apply(this.deferred, arguments);
  },
  /**
	* Cancel this {@link Deft.promise.Promise} and notify relevant callbacks.
  */

  cancel: function(reason) {
    return this.deferred.cancel(reason);
  },
  /**
	* Get this {@link Deft.promise.Promise}'s current state.
  */

  getState: function() {
    return this.deferred.getState();
  },
  /**
	* Returns a text representation of this {@link Deft.promise.Promise}, including its optional id.
  */

  toString: function() {
    if (this.id != null) {
      return "Promise " + this.id;
    }
    return "Promise";
  }
}, function() {
  if (Array.prototype.reduce != null) {
    this.reduceArray = Array.prototype.reduce;
  }
});
/*
Copyright (c) 2012 [DeftJS Framework Contributors](http://deftjs.org)
Open source under the [MIT License](http://en.wikipedia.org/wiki/MIT_License).
*/

/**
* A Deferred manages the state of an asynchronous process that will eventually be exposed to external code via a Deft.promise.Promise.
*/

Ext.define('Deft.promise.Deferred', {
  alternateClassName: ['Deft.Deferred'],
  requires: ['Deft.log.Logger', 'Deft.promise.Promise'],
  statics: {
    /**
		* Enables logging for Promises. Defaults to true.
    */

    enableLogging: true,
    /**
		* Adds a log message if {Deft.promise.Deferred.enableLogging} is set to true.
    */

    logMessage: function(message) {
      if (Deft.promise.Deferred.enableLogging) {
        return Deft.Logger.log(message);
      }
    }
  },
  id: null,
  constructor: function(config) {
    if (config == null) {
      config = {};
    }
    this.id = config.id;
    this.state = 'pending';
    this.progress = void 0;
    this.value = void 0;
    this.progressCallbacks = [];
    this.successCallbacks = [];
    this.failureCallbacks = [];
    this.cancelCallbacks = [];
    this.promise = Ext.create('Deft.Promise', {
      id: this.id ? "of " + this.id : null,
      deferred: this
    });
    return this;
  },
  /**
	* Returns a new {@link Deft.promise.Promise} with the specified callbacks registered to be called when this {@link Deft.promise.Deferred} is resolved, rejected, updated or cancelled.
  */

  then: function(callbacks) {
    var callback, cancelCallback, deferred, failureCallback, progressCallback, scope, successCallback, _i, _len, _ref;
    if (Ext.isObject(callbacks)) {
      successCallback = callbacks.success, failureCallback = callbacks.failure, progressCallback = callbacks.progress, cancelCallback = callbacks.cancel, scope = callbacks.scope;
    } else {
      successCallback = arguments[0], failureCallback = arguments[1], progressCallback = arguments[2], cancelCallback = arguments[3], scope = arguments[4];
    }
    _ref = [successCallback, failureCallback, progressCallback, cancelCallback];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      callback = _ref[_i];
      if (!(Ext.isFunction(callback) || callback === null || callback === void 0)) {
        Ext.Error.raise({
          msg: "Error while registering callback with " + this + ": a non-function specified."
        });
      }
    }
    deferred = Ext.create('Deft.promise.Deferred', {
      id: "transformed result of " + this
    });
    this.register(this.wrapCallback(deferred, successCallback, scope, 'success', 'resolve'), this.successCallbacks, 'resolved', this.value);
    this.register(this.wrapCallback(deferred, failureCallback, scope, 'failure', 'reject'), this.failureCallbacks, 'rejected', this.value);
    this.register(this.wrapCallback(deferred, cancelCallback, scope, 'cancel', 'cancel'), this.cancelCallbacks, 'cancelled', this.value);
    this.register(this.wrapProgressCallback(deferred, progressCallback, scope), this.progressCallbacks, 'pending', this.progress);
    Deft.promise.Deferred.logMessage("Returning " + (deferred.getPromise()) + ".");
    return deferred.getPromise();
  },
  /**
	* Returns a new {@link Deft.promise.Promise} with the specified callback registered to be called when this {@link Deft.promise.Deferred} is rejected.
  */

  otherwise: function(callback, scope) {
    var _ref;
    if (Ext.isObject(callback)) {
      _ref = callback, callback = _ref.fn, scope = _ref.scope;
    }
    return this.then({
      failure: callback,
      scope: scope
    });
  },
  /**
	* Returns a new {@link Deft.promise.Promise} with the specified callback registered to be called when this {@link Deft.promise.Deferred} is either resolved, rejected, or cancelled.
  */

  always: function(callback, scope) {
    var _ref;
    if (Ext.isObject(callback)) {
      _ref = callback, callback = _ref.fn, scope = _ref.scope;
    }
    return this.then({
      success: callback,
      failure: callback,
      cancel: callback,
      scope: scope
    });
  },
  /**
	* Update progress for this {@link Deft.promise.Deferred} and notify relevant callbacks.
  */

  update: function(progress) {
    Deft.promise.Deferred.logMessage("" + this + " updated with progress: " + progress);
    if (this.state === 'pending') {
      this.progress = progress;
      this.notify(this.progressCallbacks, progress);
    } else {
      if (this.state !== 'cancelled') {
        Ext.Error.raise({
          msg: "Error: this " + this + " has already been completed and cannot be modified."
        });
      }
    }
  },
  /**
	* Resolve this {@link Deft.promise.Deferred} and notify relevant callbacks.
  */

  resolve: function(value) {
    Deft.promise.Deferred.logMessage("" + this + " resolved with value: " + value);
    this.complete('resolved', value, this.successCallbacks);
  },
  /**
	* Reject this {@link Deft.promise.Deferred} and notify relevant callbacks.
  */

  reject: function(error) {
    Deft.promise.Deferred.logMessage("" + this + " rejected with error: " + error);
    this.complete('rejected', error, this.failureCallbacks);
  },
  /**
	* Cancel this {@link Deft.promise.Deferred} and notify relevant callbacks.
  */

  cancel: function(reason) {
    Deft.promise.Deferred.logMessage("" + this + " cancelled with reason: " + reason);
    this.complete('cancelled', reason, this.cancelCallbacks);
  },
  /**
	* Get this {@link Deft.promise.Deferred}'s associated {@link Deft.promise.Promise}.
  */

  getPromise: function() {
    return this.promise;
  },
  /**
	* Get this {@link Deft.promise.Deferred}'s current state.
  */

  getState: function() {
    return this.state;
  },
  /**
	* Returns a text representation of this {@link Deft.promise.Deferred}, including its optional id.
  */

  toString: function() {
    if (this.id != null) {
      return "Deferred " + this.id;
    }
    return "Deferred";
  },
  /**
	* Wraps a success, failure or cancel callback.
	* @private
  */

  wrapCallback: function(deferred, callback, scope, callbackType, action) {
    var self;
    self = this;
    if (callback != null) {
      Deft.promise.Deferred.logMessage("Registering " + callbackType + " callback for " + self + ".");
    }
    return function(value) {
      var result;
      if (Ext.isFunction(callback)) {
        try {
          Deft.promise.Deferred.logMessage("Calling " + callbackType + " callback registered for " + self + ".");
          result = callback.call(scope, value);
          if (result instanceof Ext.ClassManager.get('Deft.promise.Promise') || result instanceof Ext.ClassManager.get('Deft.promise.Deferred')) {
            Deft.promise.Deferred.logMessage("" + (deferred.getPromise()) + " will be completed based on the " + result + " returned by the " + callbackType + " callback.");
            result.then(Ext.bind(deferred.resolve, deferred), Ext.bind(deferred.reject, deferred), Ext.bind(deferred.update, deferred), Ext.bind(deferred.cancel, deferred));
          } else {
            Deft.promise.Deferred.logMessage("" + (deferred.getPromise()) + " resolved with the value returned by the " + callbackType + " callback: " + result + ".");
            deferred.resolve(result);
          }
        } catch (error) {
          if (Ext.Array.contains(['RangeError', 'ReferenceError', 'SyntaxError', 'TypeError'], error.name)) {
            Deft.Logger.error("Error: " + callbackType + " callback for " + self + " threw: " + (error.stack != null ? error.stack : error));
          } else {
            Deft.promise.Deferred.logMessage("" + (deferred.getPromise()) + " rejected with the Error returned by the " + callbackType + " callback: " + error);
          }
          deferred.reject(error);
        }
      } else {
        Deft.promise.Deferred.logMessage("" + (deferred.getPromise()) + " resolved with the value: " + value + ".");
        deferred[action](value);
      }
    };
  },
  /**
	* Wraps a success, failure or cancel callback.
	* @private
  */

  wrapProgressCallback: function(deferred, callback, scope) {
    var self;
    self = this;
    if (callback != null) {
      Deft.promise.Deferred.logMessage("Registering progress callback for " + self + ".");
    }
    return function(value) {
      var result;
      if (Ext.isFunction(callback)) {
        try {
          Deft.promise.Deferred.logMessage("Calling progress callback registered for " + self + ".");
          result = callback.call(scope, value);
          Deft.promise.Deferred.logMessage("" + (deferred.getPromise()) + " updated with progress returned by the progress callback: " + result + ".");
          deferred.update(result);
        } catch (error) {
          Deft.Logger.error("Error: progress callback registered for " + self + " threw: " + (error.stack != null ? error.stack : error));
        }
      } else {
        Deft.promise.Deferred.logMessage("" + (deferred.getPromise()) + " updated with progress: " + value);
        deferred.update(value);
      }
    };
  },
  /**
	* Register a callback for this {@link Deft.promise.Deferred} for the specified callbacks and state, immediately notifying with the specified value (if applicable).
	* @private
  */

  register: function(callback, callbacks, state, value) {
    if (Ext.isFunction(callback)) {
      if (this.state === 'pending') {
        callbacks.push(callback);
        if (this.state === state && value !== void 0) {
          this.notify([callback], value);
        }
      } else {
        if (this.state === state) {
          this.notify([callback], value);
        }
      }
    }
  },
  /**
	* Complete this {@link Deft.promise.Deferred} with the specified state and value.
	* @private
  */

  complete: function(state, value, callbacks) {
    if (this.state === 'pending') {
      this.state = state;
      this.value = value;
      this.notify(callbacks, value);
      this.releaseCallbacks();
    } else {
      if (this.state !== 'cancelled') {
        Ext.Error.raise({
          msg: "Error: this " + this + " has already been completed and cannot be modified."
        });
      }
    }
  },
  /**
	* Notify the specified callbacks with the specified value.
	* @private
  */

  notify: function(callbacks, value) {
    var callback, _i, _len;
    for (_i = 0, _len = callbacks.length; _i < _len; _i++) {
      callback = callbacks[_i];
      callback(value);
    }
  },
  /**
	* Release references to all callbacks registered with this {@link Deft.promise.Deferred}.
	* @private
  */

  releaseCallbacks: function() {
    this.progressCallbacks = null;
    this.successCallbacks = null;
    this.failureCallbacks = null;
    this.cancelCallbacks = null;
  }
});
/*
Copyright (c) 2012 [DeftJS Framework Contributors](http://deftjs.org)
Open source under the [MIT License](http://en.wikipedia.org/wiki/MIT_License).

sequence(), parallel(), pipeline() methods adapted from:
[when.js](https://github.com/cujojs/when)
Copyright (c) B Cavalier & J Hann
Open source under the [MIT License](http://en.wikipedia.org/wiki/MIT_License).
*/

/**
* Utility class with static methods to create chains of Deft.promise.Promises objects.
*/

Ext.define('Deft.promise.Chain', {
  alternateClassName: ['Deft.Chain'],
  requires: ['Deft.promise.Promise'],
  statics: {
    /**
		* Execute an Array (or Deferred/Promise of an Array) of functions sequentially.
		* The specified functions may optionally return their results as Promises.
		* Returns a Promise of an Array of results for each function call (in the same order).
    */

    sequence: function(fns, scope) {
      return Deft.Promise.reduce(fns, function(results, fn) {
        return Deft.Promise.when(fn.call(scope)).then(function(result) {
          results.push(result);
          return results;
        });
      }, []);
    },
    /**
		* Execute an Array (or Deferred/Promise of an Array) of functions in parallel.
		* The specified functions may optionally return their results as Promises.
		* Returns a Promise of an Array of results for each function call (in the same order).
    */

    parallel: function(fns, scope) {
      return Deft.Promise.map(fns, function(fn) {
        return fn.call(scope);
      });
    },
    /**
		* Execute an Array (or Deferred/Promise of an Array) of functions as a pipeline, where each function's result is passed to the subsequent function as input.
		* The specified functions may optionally return their results as Promises.
		* Returns a Promise of the result value for the final function in the pipeline.
    */

    pipeline: function(fns, scope, initialValue) {
      return Deft.Promise.reduce(fns, function(value, fn) {
        return fn.call(scope, value);
      }, initialValue);
    }
  }
});
