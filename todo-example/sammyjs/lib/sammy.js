// name: sammy
// version: 0.5.1

(function($) {
  
  var Sammy,
      PATH_REPLACER = "([^\/]+)",
      PATH_NAME_MATCHER = /:([\w\d]+)/g,
      QUERY_STRING_MATCHER = /\?([^#]*)$/,
      _decode = decodeURIComponent,
      _routeWrapper = function(verb) {
        return function(path, callback) { return this.route.apply(this, [verb, path, callback]); };
      },
      loggers = [];
  
  
  // <tt>Sammy</tt> (also aliased as $.sammy) is not only the namespace for a 
  // number of prototypes, its also a top level method that allows for easy
  // creation/management of <tt>Sammy.Application</tt> instances. There are a
  // number of different forms for <tt>Sammy()</tt> but each returns an instance
  // of <tt>Sammy.Application</tt>. When a new instance is created using
  // <tt>Sammy</tt> it is added to an Object called <tt>Sammy.apps</tt>. This
  // provides for an easy way to get at existing Sammy applications. Only one
  // instance is allowed per <tt>element_selector</tt> so when calling
  // <tt>Sammy('selector')</tt> multiple times, the first time will create 
  // the application and the following times will extend the application
  // already added to that selector.
  //
  // === Example
  //
  //      // returns the app at #main or a new app
  //      Sammy('#main') 
  //
  //      // equivilent to "new Sammy.Application", except appends to apps
  //      Sammy();
  //      Sammy(function() { ... }); 
  //
  //      // extends the app at '#main' with function.
  //      Sammy('#main', function() { ... });
  //
  Sammy = function() {
    var args = $.makeArray(arguments), 
        app, selector;
    Sammy.apps = Sammy.apps || {};
    if (args.length === 0 || args[0] && $.isFunction(args[0])) { // Sammy()
      return Sammy.apply(Sammy, ['body'].concat(args));
    } else if (typeof (selector = args.shift()) == 'string') { // Sammy('#main')
      app = Sammy.apps[selector] || new Sammy.Application();
      app.element_selector = selector;
      if (args.length > 0) {
        $.each(args, function(i, plugin) {
          app.use(plugin);
        });
      }
      // if the selector changes make sure the refrence in Sammy.apps changes
      if (app.element_selector != selector) {
        delete Sammy.apps[selector];
      }
      Sammy.apps[app.element_selector] = app;
      return app;
    }
  };
  
  Sammy.VERSION = '0.5.1';
    
  // Add to the global logger pool. Takes a function that accepts an 
  // unknown number of arguments and should print them or send them somewhere
  // The first argument is always a timestamp.
  Sammy.addLogger = function(logger) {
    loggers.push(logger);
  };
  
  // Sends a log message to each logger listed in the global
  // loggers pool. Can take any number of arguments.
  // Also prefixes the arguments with a timestamp.
  Sammy.log = function()	{
    var args = $.makeArray(arguments);
    args.unshift("[" + Date() + "]");
    $.each(loggers, function(i, logger) {
      logger.apply(Sammy, args);
    });
	};
	
	if (typeof window.console != 'undefined') {
	  if ($.isFunction(console.log.apply)) {
      Sammy.addLogger(function() {
        window.console.log.apply(console, arguments);
      });
    } else {
      Sammy.addLogger(function() {
        window.console.log(arguments);
      });
    }
  } else if (typeof console != 'undefined') {
    Sammy.addLogger(function() {
      console.log.apply(console, arguments);
    });
  }
    
  // Sammy.Object is the base for all other Sammy classes. It provides some useful 
  // functionality, including cloning, iterating, etc.
  Sammy.Object = function(obj) { // constructor
    return $.extend(this, obj || {});
  };
        
  $.extend(Sammy.Object.prototype, {    
            
    // Returns a copy of the object with Functions removed.
    toHash: function() {
      var json = {}; 
      $.each(this, function(k,v) {
        if (!$.isFunction(v)) {
          json[k] = v;
        }
      });
      return json;
    },
    
    // Renders a simple HTML version of this Objects attributes.
    // Does not render functions.
    // For example. Given this Sammy.Object:
    //    
    //    var s = new Sammy.Object({first_name: 'Sammy', last_name: 'Davis Jr.'});
    //    s.toHTML() //=> '<strong>first_name</strong> Sammy<br /><strong>last_name</strong> Davis Jr.<br />'
    //
    toHTML: function() {
      var display = "";
      $.each(this, function(k, v) {
        if (!$.isFunction(v)) {
          display += "<strong>" + k + "</strong> " + v + "<br />";
        }
      });
      return display;
    },
    
    // Generates a unique identifing string. Used for application namespaceing.
    uuid: function() {
      if (typeof this._uuid == 'undefined' || !this._uuid) {
        this._uuid = (new Date()).getTime() + '-' + parseInt(Math.random() * 1000, 10);
      }
      return this._uuid;
    },
    
    // Returns an array of keys for this object. If <tt>attributes_only</tt> 
    // is true will not return keys that map to a <tt>function()</tt>
    keys: function(attributes_only) {
      var keys = [];
      for (var property in this) {
        if (!$.isFunction(this[property]) || !attributes_only) {
          keys.push(property);
        }
      }
      return keys;
    },
    
    // Checks if the object has a value at <tt>key</tt> and that the value is not empty
    has: function(key) {
      return this[key] && $.trim(this[key].toString()) != '';
    },
        
    // convenience method to join as many arguments as you want 
    // by the first argument - useful for making paths
    join: function() {
      var args = $.makeArray(arguments);
      var delimiter = args.shift();
      return args.join(delimiter);
    },
    
    // Shortcut to Sammy.log
    log: function() {
      Sammy.log.apply(Sammy, arguments);
    },
    
    // Returns a string representation of this object. 
    // if <tt>include_functions</tt> is true, it will also toString() the 
    // methods of this object. By default only prints the attributes.
    toString: function(include_functions) {
      var s = [];
      $.each(this, function(k, v) {
		    if (!$.isFunction(v) || include_functions) {
          s.push('"' + k + '": ' + v.toString());
		    }
      });
      return "Sammy.Object: {" + s.join(',') + "}"; 
    }
  });
  
  // The HashLocationProxy is the default location proxy for all Sammy applications.
  // A location proxy is a prototype that conforms to a simple interface. The purpose
  // of a location proxy is to notify the Sammy.Application its bound to when the location
  // or 'external state' changes. The HashLocationProxy considers the state to be
  // changed when the 'hash' (window.location.hash / '#') changes. It does this in two
  // different ways depending on what browser you are using. The newest browsers 
  // (IE, Safari > 4, FF >= 3.6) support a 'onhashchange' DOM event, thats fired whenever
  // the location.hash changes. In this situation the HashLocationProxy just binds
  // to this event and delegates it to the application. In the case of older browsers
  // a poller is set up to track changes to the hash. Unlike Sammy 0.3 or earlier,
  // the HashLocationProxy allows the poller to be a global object, eliminating the
  // need for multiple pollers even when thier are multiple apps on the page.
  Sammy.HashLocationProxy = function(app, run_interval_every) {
    this.app = app;
    
    // check for native hash support
    if ('onhashchange' in window) {
      Sammy.log('native hash change exists, using');
      this.is_native = true;
    } else {
      Sammy.log('no native hash change, falling back to polling');
      this.is_native = false;
      this._startPolling(run_interval_every);
    }
  };
  
  Sammy.HashLocationProxy.prototype = {
    // bind the proxy events to the current app.
    bind: function() {
      var app = this.app;
      $(window).bind('hashchange.' + this.app.eventNamespace(), function() {
        app.trigger('location-changed');
      });
    },
    // unbind the proxy events from the current app
    unbind: function() {
      $(window).die('hashchange.' + this.app.eventNamespace());
    },
    // get the current location from the hash.
    getLocation: function() {
     // Bypass the `window.location.hash` attribute.  If a question mark
      // appears in the hash IE6 will strip it and all of the following
      // characters from `window.location.hash`.
      var matches = window.location.toString().match(/^[^#]*(#.+)$/);
      return matches ? matches[1] : '';
    },
    // set the current location to <tt>new_location</tt>
    setLocation: function(new_location) {
      return (window.location = new_location);
    },
    
    _startPolling: function(every) {
      // set up interval
      var proxy = this;
      if (!Sammy.HashLocationProxy._interval) {
        if (!every) { every = 10; }
        var hashCheck = function() {
          current_location = proxy.getLocation();
          // Sammy.log('getLocation', current_location);
          if (!Sammy.HashLocationProxy._last_location || 
            current_location != Sammy.HashLocationProxy._last_location) {
            setTimeout(function() {
              $(window).trigger('hashchange');
            }, 1);
          }
          Sammy.HashLocationProxy._last_location = current_location;
        };
        hashCheck();
        Sammy.HashLocationProxy._interval = setInterval(hashCheck, every);
        $(window).bind('beforeunload', function() {
          clearInterval(Sammy.HashLocationProxy._interval);
        });
      }
    }
  };
  
  // The DataLocationProxy is an optional location proxy prototype. As opposed to
  // the <tt>HashLocationProxy</tt> it gets its location from a jQuery.data attribute
  // tied to the application's element. You can set the name of the attribute by
  // passing a string as the second argument to the constructor. The default attribute
  // name is 'sammy-location'. To read more about location proxies, check out the 
  // documentation for <tt>Sammy.HashLocationProxy</tt>
  Sammy.DataLocationProxy = function(app, data_name) {
    this.app = app;
    this.data_name = data_name || 'sammy-location';
  };
  
  Sammy.DataLocationProxy.prototype = {
    bind: function() {
      var proxy = this;
      this.app.$element().bind('setData', function(e, key) {
        if (key == proxy.data_name) {
          proxy.app.trigger('location-changed');
        }
      });
    },
    
    unbind: function() {
      this.app.$element().die('setData');
    },
    
    getLocation: function() {
      return this.app.$element().data(this.data_name);
    },
    
    setLocation: function(new_location) {
      return this.app.$element().data(this.data_name, new_location);
    }
  };
  
  // Sammy.Application is the Base prototype for defining 'applications'.
  // An 'application' is a collection of 'routes' and bound events that is
  // attached to an element when <tt>run()</tt> is called.
  // The only argument an 'app_function' is evaluated within the context of the application.
  Sammy.Application = function(app_function) {
    var app = this;
    this.routes            = {};
    this.listeners         = new Sammy.Object({});
    this.arounds           = [];
    this.befores           = [];
    this.namespace         = this.uuid();
    this.context_prototype = function() { Sammy.EventContext.apply(this, arguments); };
    this.context_prototype.prototype = new Sammy.EventContext();

    if ($.isFunction(app_function)) {
      app_function.apply(this, [this]);
    }
    // set the location proxy if not defined to the default (HashLocationProxy)
    if (!this.location_proxy) {
      this.location_proxy = new Sammy.HashLocationProxy(app, this.run_interval_every);
    }
    if (this.debug) {
      this.bindToAllEvents(function(e, data) {
        app.log(app.toString(), e.cleaned_type, data || {});
      });
    }
  };
  
  Sammy.Application.prototype = $.extend({}, Sammy.Object.prototype, {
    
    // the four route verbs
    ROUTE_VERBS: ['get','post','put','delete'],
    
    // An array of the default events triggered by the 
    // application during its lifecycle
    APP_EVENTS: ['run','unload','lookup-route','run-route','route-found','event-context-before','event-context-after','changed','error','check-form-submission','redirect'],
    
    _last_route: null,
    _running: false,
        
    // Defines what element the application is bound to. Provide a selector 
    // (parseable by <tt>jQuery()</tt>) and this will be used by <tt>$element()</tt>
    element_selector: 'body',
    
    // When set to true, logs all of the default events using <tt>log()</tt>
    debug: false,
    
    // When set to true, and the error() handler is not overriden, will actually
    // raise JS errors in routes (500) and when routes can't be found (404)
    raise_errors: false,
    
    // The time in milliseconds that the URL is queried for changes
    run_interval_every: 50, 
    
    // The location proxy for the current app. By default this is set to a new
    // <tt>Sammy.HashLocationProxy</tt> on initialization. However, you can set
    // the location_proxy inside you're app function to give youre app a custom
    // location mechanism
    location_proxy: null,
    
    // The default template engine to use when using <tt>partial()</tt> in an 
    // <tt>EventContext</tt>. <tt>template_engine</tt> can either be a string that 
    // corresponds to the name of a method/helper on EventContext or it can be a function
    // that takes two arguments, the content of the unrendered partial and an optional
    // JS object that contains interpolation data. Template engine is only called/refered
    // to if the extension of the partial is null or unknown. See <tt>partial()</tt>
    // for more information
    template_engine: null,
        
    // //=> Sammy.Application: body
    toString: function() {
      return 'Sammy.Application:' + this.element_selector;
    },
    
    // returns a jQuery object of the Applications bound element.
    $element: function() {
      return $(this.element_selector);
    },
    
    // <tt>use()</tt> is the entry point for including Sammy plugins.
    // The first argument to use should be a function() that is evaluated 
    // in the context of the current application, just like the <tt>app_function</tt>
    // argument to the <tt>Sammy.Application</tt> constructor.
    //
    // Any additional arguments are passed to the app function sequentially.
    //
    // For much more detail about plugins, check out: 
    // http://code.quirkey.com/sammy/doc/plugins.html
    // 
    // === Example
    //
    //      var MyPlugin = function(app, prepend) {
    //
    //        this.helpers({
    //          myhelper: function(text) {
    //            alert(prepend + " " + text);
    //          }
    //        });
    //  
    //      };
    //
    //      var app = $.sammy(function() {
    // 
    //        this.use(MyPlugin, 'This is my plugin');
    //  
    //        this.get('#/', function() {
    //          this.myhelper('and dont you forget it!'); 
    //          //=> Alerts: This is my plugin and dont you forget it!
    //        });
    //
    //      });
    //
    use: function() {
      // flatten the arguments
      var args = $.makeArray(arguments);
      var plugin = args.shift();
      try {
        args.unshift(this);
        plugin.apply(this, args);
      } catch(e) {
        if (typeof plugin == 'undefined') {
          this.error("Plugin Error: called use() but plugin is not defined", e);
        } else if (!$.isFunction(plugin)) {
          this.error("Plugin Error: called use() but '" + plugin.toString() + "' is not a function", e);
        } else {
          this.error("Plugin Error", e);
        }
      }
      return this;
    },
    
    // <tt>route()</tt> is the main method for defining routes within an application.
    // For great detail on routes, check out: http://code.quirkey.com/sammy/doc/routes.html
    //
    // This method also has aliases for each of the different verbs (eg. <tt>get()</tt>, <tt>post()</tt>, etc.)
    //
    // === Arguments
    //
    // +verb+::     A String in the set of ROUTE_VERBS or 'any'. 'any' will add routes for each
    //              of the ROUTE_VERBS. If only two arguments are passed, 
    //              the first argument is the path, the second is the callback and the verb
    //              is assumed to be 'any'.
    // +path+::     A Regexp or a String representing the path to match to invoke this verb.
    // +callback+:: A Function that is called/evaluated whent the route is run see: <tt>runRoute()</tt>.
    //              It is also possible to pass a string as the callback, which is looked up as the name
    //              of a method on the application.
    //
    route: function(verb, path, callback) {
      var app = this, param_names = [], add_route;
      
      // if the method signature is just (path, callback)
      // assume the verb is 'any'
      if (!callback && $.isFunction(path)) {
        path = verb;
        callback = path;
        verb = 'any';
      }
      
      verb = verb.toLowerCase(); // ensure verb is lower case
      
      // if path is a string turn it into a regex
      if (path.constructor == String) {
        
        // Needs to be explicitly set because IE will maintain the index unless NULL is returned,
        // which means that with two consecutive routes that contain params, the second set of params will not be found and end up in splat instead of params
        // https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/RegExp/lastIndex        
        PATH_NAME_MATCHER.lastIndex = 0;
        
        // find the names
        while ((path_match = PATH_NAME_MATCHER.exec(path)) !== null) {
          param_names.push(path_match[1]);
        }
        // replace with the path replacement
        path = new RegExp("^" + path.replace(PATH_NAME_MATCHER, PATH_REPLACER) + "$");
      }
      // lookup callback
      if (typeof callback == 'string') {
        callback = app[callback];
      }
      
      add_route = function(with_verb) {
        var r = {verb: with_verb, path: path, callback: callback, param_names: param_names};
        // add route to routes array
        app.routes[with_verb] = app.routes[with_verb] || [];
        // place routes in order of definition
        app.routes[with_verb].push(r);
      };
      
      if (verb === 'any') {
        $.each(this.ROUTE_VERBS, function(i, v) { add_route(v); });
      } else {
        add_route(verb);
      }
      
      // return the app
      return this;
    },
    
    // Alias for route('get', ...)
    get: _routeWrapper('get'),
    
    // Alias for route('post', ...)
    post: _routeWrapper('post'),

    // Alias for route('put', ...)
    put: _routeWrapper('put'),
    
    // Alias for route('delete', ...)
    del: _routeWrapper('delete'),
    
    // Alias for route('any', ...)
    any: _routeWrapper('any'),
    
    // <tt>mapRoutes</tt> takes an array of arrays, each array being passed to route()
    // as arguments, this allows for mass definition of routes. Another benefit is
    // this makes it possible/easier to load routes via remote JSON.
    //
    // === Example
    //
    //    var app = $.sammy(function() {
    //      
    //      this.mapRoutes([
    //          ['get', '#/', function() { this.log('index'); }],
    //          // strings in callbacks are looked up as methods on the app
    //          ['post', '#/create', 'addUser'],
    //          // No verb assumes 'any' as the verb
    //          [/dowhatever/, function() { this.log(this.verb, this.path)}];
    //        ]);
    //    })
    //
    mapRoutes: function(route_array) {
      var app = this;
      $.each(route_array, function(i, route_args) {
        app.route.apply(app, route_args);
      });
      return this;
    },
    
    // A unique event namespace defined per application.
    // All events bound with <tt>bind()</tt> are automatically bound within this space.
    eventNamespace: function() {
      return ['sammy-app', this.namespace].join('-');
    },
    
    // Works just like <tt>jQuery.fn.bind()</tt> with a couple noteable differences.
    //
    // * It binds all events to the application element
    // * All events are bound within the <tt>eventNamespace()</tt>
    // * Events are not actually bound until the application is started with <tt>run()</tt>
    // * callbacks are evaluated within the context of a Sammy.EventContext
    //
    // See http://code.quirkey.com/sammy/docs/events.html for more info.
    //
    bind: function(name, data, callback) {
      var app = this;
      // build the callback
      // if the arity is 2, callback is the second argument
      if (typeof callback == 'undefined') { callback = data; }
      var listener_callback =  function() {
        // pull off the context from the arguments to the callback
        var e, context, data; 
        e       = arguments[0];
        data    = arguments[1];        
        if (data && data.context) {
          context = data.context;
          delete data.context;
        } else {
          context = new app.context_prototype(app, 'bind', e.type, data);
        }
        e.cleaned_type = e.type.replace(app.eventNamespace(), '');
        callback.apply(context, [e, data]);
      };
      
      // it could be that the app element doesnt exist yet
      // so attach to the listeners array and then run()
      // will actually bind the event.
      if (!this.listeners[name]) { this.listeners[name] = []; }
      this.listeners[name].push(listener_callback);
      if (this.isRunning()) {
        // if the app is running
        // *actually* bind the event to the app element
        this._listen(name, listener_callback);
      }
      return this;
    },
    
    // Triggers custom events defined with <tt>bind()</tt>
    //
    // === Arguments
    // 
    // +name+::     The name of the event. Automatically prefixed with the <tt>eventNamespace()</tt>
    // +data+::     An optional Object that can be passed to the bound callback.
    // +context+::  An optional context/Object in which to execute the bound callback. 
    //              If no context is supplied a the context is a new <tt>Sammy.EventContext</tt>
    //
    trigger: function(name, data) {
      this.$element().trigger([name, this.eventNamespace()].join('.'), [data]);
      return this;
    },
    
    // Reruns the current route
    refresh: function() {
      this.last_location = null;
      this.trigger('location-changed');
      return this;
    },
    
    // Takes a single callback that is pushed on to a stack.
    // Before any route is run, the callbacks are evaluated in order within 
    // the current <tt>Sammy.EventContext</tt>
    //
    // If any of the callbacks explicitly return false, execution of any 
    // further callbacks and the route itself is halted.
    // 
    // You can also provide a set of options that will define when to run this
    // before based on the route it proceeds. 
    //
    // === Example
    //
    //      var app = $.sammy(function() {
    //        
    //        // will run at #/route but not at #/
    //        this.before('#/route', function() {
    //          //...
    //        });
    //        
    //        // will run at #/ but not at #/route
    //        this.before({except: {path: '#/route'}}, function() {
    //          this.log('not before #/route');
    //        });
    //        
    //        this.get('#/', function() {});
    //        
    //        this.get('#/route', function() {});
    //        
    //      });
    //      
    // See <tt>contextMatchesOptions()</tt> for a full list of supported options
    //
    before: function(options, callback) {
      if ($.isFunction(options)) {
        callback = options;
        options = {};
      }
      this.befores.push([options, callback]);
      return this;
    },
    
    // A shortcut for binding a callback to be run after a route is executed.
    // After callbacks have no guarunteed order.
    after: function(callback) {
      return this.bind('event-context-after', callback);
    },
    
    
    // Adds an around filter to the application. around filters are functions
    // that take a single argument <tt>callback</tt> which is the entire route 
    // execution path wrapped up in a closure. This means you can decide whether
    // or not to proceed with execution by not invoking <tt>callback</tt> or, 
    // more usefuly wrapping callback inside the result of an asynchronous execution.
    //
    // === Example
    //
    // The most common use case for around() is calling a _possibly_ async function
    // and executing the route within the functions callback:
    //
    //      var app = $.sammy(function() {
    //        
    //        var current_user = false;
    //        
    //        function checkLoggedIn(callback) {
    //          // /session returns a JSON representation of the logged in user 
    //          // or an empty object
    //          if (!current_user) {
    //            $.getJSON('/session', function(json) {
    //              if (json.login) {
    //                // show the user as logged in
    //                current_user = json;
    //                // execute the route path
    //                callback();
    //              } else {
    //                // show the user as not logged in
    //                current_user = false;
    //                // the context of aroundFilters is an EventContext
    //                this.redirect('#/login');
    //              }
    //            });
    //          } else {
    //            // execute the route path
    //            callback();
    //          }
    //        };
    //        
    //        this.around(checkLoggedIn);
    //        
    //      });
    //
    around: function(callback) {
      this.arounds.push(callback);
      return this;
    },
    
    // Returns a boolean of weather the current application is running.
    isRunning: function() {
      return this._running;
    },
    
    // Helpers extends the EventContext prototype specific to this app.
    // This allows you to define app specific helper functions that can be used
    // whenever you're inside of an event context (templates, routes, bind).
    // 
    // === Example
    //
    //    var app = $.sammy(function() {
    //      
    //      helpers({
    //        upcase: function(text) {
    //         return text.toString().toUpperCase();
    //        }
    //      });
    //      
    //      get('#/', function() { with(this) {
    //        // inside of this context I can use the helpers
    //        $('#main').html(upcase($('#main').text());
    //      }});
    //      
    //    });
    //
    //    
    // === Arguments
    // 
    // +extensions+:: An object collection of functions to extend the context.
    //  
    helpers: function(extensions) {
      $.extend(this.context_prototype.prototype, extensions);
      return this;
    },
    
    // Helper extends the event context just like <tt>helpers()</tt> but does it
    // a single method at a time. This is especially useful for dynamically named 
    // helpers
    // 
    // === Example
    //     
    //     // Trivial example that adds 3 helper methods to the context dynamically
    //     var app = $.sammy(function(app) {
    //       
    //       $.each([1,2,3], function(i, num) {
    //         app.helper('helper' + num, function() {
    //           this.log("I'm helper number " + num);
    //         }); 
    //       });
    //       
    //       this.get('#/', function() {
    //         this.helper2(); //=> I'm helper number 2
    //       });
    //     });
    //     
    // === Arguments
    // 
    // +name+:: The name of the method
    // +method+:: The function to be added to the prototype at <tt>name</tt>
    //
    helper: function(name, method) {
      this.context_prototype.prototype[name] = method;
      return this;
    },
    
    // Actually starts the application's lifecycle. <tt>run()</tt> should be invoked
    // within a document.ready block to ensure the DOM exists before binding events, etc.
    //
    // === Example
    // 
    //    var app = $.sammy(function() { ... }); // your application
    //    $(function() { // document.ready
    //        app.run();
    //     });
    //
    // === Arguments
    //
    // +start_url+::  "value", Optionally, a String can be passed which the App will redirect to 
    //                after the events/routes have been bound.
    run: function(start_url) {
      if (this.isRunning()) { return false; }
      var app = this;
      
      // actually bind all the listeners
      $.each(this.listeners.toHash(), function(name, callbacks) {
        $.each(callbacks, function(i, listener_callback) {
          app._listen(name, listener_callback);
        });
      });
      
      this.trigger('run', {start_url: start_url});
      this._running = true;
      // set last location
      this.last_location = null;
      if (this.getLocation() == '' && typeof start_url != 'undefined') {
        this.setLocation(start_url);
      } 
      // check url
      this._checkLocation();
      this.location_proxy.bind();
      this.bind('location-changed', function() {
        app._checkLocation();
      });
      
      // bind to submit to capture post/put/delete routes
      this.bind('submit', function(e) {
        var returned = app._checkFormSubmission($(e.target).closest('form'));
        return (returned === false) ? e.preventDefault() : false;
      });

      // bind unload to body unload
      $(window).bind('beforeunload', function() {
        app.unload();
      });
      
      // trigger html changed
      return this.trigger('changed');
    },
    
    // The opposite of <tt>run()</tt>, un-binds all event listeners and intervals
    // <tt>run()</tt> Automaticaly binds a <tt>onunload</tt> event to run this when
    // the document is closed.
    unload: function() {
      if (!this.isRunning()) { return false; }
      var app = this;
      this.trigger('unload');
      // clear interval
      this.location_proxy.unbind();
      // unbind form submits
      this.$element().unbind('submit').removeClass(app.eventNamespace());
      // unbind all events
      $.each(this.listeners.toHash() , function(name, listeners) {
        $.each(listeners, function(i, listener_callback) {
          app._unlisten(name, listener_callback);
        });
      });
      this._running = false;
      return this;
    },
    
    // Will bind a single callback function to every event that is already 
    // being listened to in the app. This includes all the <tt>APP_EVENTS</tt>
    // as well as any custom events defined with <tt>bind()</tt>.
    // 
    // Used internally for debug logging.
    bindToAllEvents: function(callback) {
      var app = this;
      // bind to the APP_EVENTS first
      $.each(this.APP_EVENTS, function(i, e) {
        app.bind(e, callback);
      });
      // next, bind to listener names (only if they dont exist in APP_EVENTS)
      $.each(this.listeners.keys(true), function(i, name) {
        if (app.APP_EVENTS.indexOf(name) == -1) {
          app.bind(name, callback);
        }
      });
      return this;
    },

    // Returns a copy of the given path with any query string after the hash
    // removed.
    routablePath: function(path) {
      return path.replace(QUERY_STRING_MATCHER, '');
    },
    
    // Given a verb and a String path, will return either a route object or false
    // if a matching route can be found within the current defined set. 
    lookupRoute: function(verb, path) {
      var app = this, routed = false;
      this.trigger('lookup-route', {verb: verb, path: path});
      if (typeof this.routes[verb] != 'undefined') {
        $.each(this.routes[verb], function(i, route) {
          if (app.routablePath(path).match(route.path)) {
            routed = route;
            return false;
          }
        });
      }
      return routed;
    },

    // First, invokes <tt>lookupRoute()</tt> and if a route is found, parses the 
    // possible URL params and then invokes the route's callback within a new
    // <tt>Sammy.EventContext</tt>. If the route can not be found, it calls 
    // <tt>notFound()</tt>. If <tt>raise_errors</tt> is set to <tt>true</tt> and 
    // the <tt>error()</tt> has not been overriden, it will throw an actual JS
    // error. 
    //
    // You probably will never have to call this directly.
    //
    // === Arguments
    // 
    // +verb+:: A String for the verb.
    // +path+:: A String path to lookup.
    // +params+:: An Object of Params pulled from the URI or passed directly.
    //
    // === Returns
    //
    // Either returns the value returned by the route callback or raises a 404 Not Found error.
    //
    runRoute: function(verb, path, params) {
      var app = this, 
          route = this.lookupRoute(verb, path),
          context, 
          wrapped_route, 
          arounds, 
          around, 
          befores, 
          before, 
          callback_args, 
          final_returned;

      this.log('runRoute', [verb, path].join(' '));
      this.trigger('run-route', {verb: verb, path: path, params: params});
      if (typeof params == 'undefined') { params = {}; }

      $.extend(params, this._parseQueryString(path));
      
      if (route) {
        this.trigger('route-found', {route: route});
        // pull out the params from the path
        if ((path_params = route.path.exec(this.routablePath(path))) !== null) {
          // first match is the full path
          path_params.shift();
          // for each of the matches
          $.each(path_params, function(i, param) {
            // if theres a matching param name
            if (route.param_names[i]) {
              // set the name to the match
              params[route.param_names[i]] = _decode(param);
            } else {
              // initialize 'splat'
              if (!params.splat) { params.splat = []; }
              params.splat.push(_decode(param));
            }
          });
        }
        
        // set event context
        context  = new this.context_prototype(this, verb, path, params);
        // ensure arrays
        arounds = this.arounds.slice(0);  
        befores = this.befores.slice(0);
        // set the callback args to the context + contents of the splat
        callback_args = [context].concat(params.splat);
        // wrap the route up with the before filters
        wrapped_route = function() {
          var returned;
          while (befores.length > 0) {
            before = befores.shift();
            // check the options
            if (app.contextMatchesOptions(context, before[0])) {
              returned = before[1].apply(context, [context]);
              if (returned === false) { return false; }
            }
          }
          app.last_route = route;
          context.trigger('event-context-before', {context: context});
          returned = route.callback.apply(context, callback_args);
          context.trigger('event-context-after', {context: context});
          return returned;
        };
        $.each(arounds.reverse(), function(i, around) {
          var last_wrapped_route = wrapped_route;
          wrapped_route = function() { return around.apply(context, [last_wrapped_route]); };
        });
        try {
          final_returned = wrapped_route();
        } catch(e) {
          this.error(['500 Error', verb, path].join(' '), e);
        }
        return final_returned;
      } else {
        return this.notFound(verb, path);
      }
    },
    
    // Matches an object of options against an <tt>EventContext</tt> like object that
    // contains <tt>path</tt> and <tt>verb</tt> attributes. Internally Sammy uses this
    // for matching <tt>before()</tt> filters against specific options. You can set the 
    // object to _only_ match certain paths or verbs, or match all paths or verbs _except_
    // those that match the options.
    //
    // === Example
    //   
    //     var app = $.sammy(),
    //         context = {verb: 'get', path: '#/mypath'};
    //     
    //     // match against a path string
    //     app.contextMatchesOptions(context, '#/mypath'); //=> true
    //     app.contextMatchesOptions(context, '#/otherpath'); //=> false
    //     // equivilent to
    //     app.contextMatchesOptions(context, {only: {path:'#/mypath'}}); //=> true
    //     app.contextMatchesOptions(context, {only: {path:'#/otherpath'}}); //=> false
    //     // match against a path regexp
    //     app.contextMatchesOptions(context, /path/); //=> true
    //     app.contextMatchesOptions(context, /^path/); //=> false
    //     // match only a verb
    //     app.contextMatchesOptions(context, {only: {verb:'get'}}); //=> true
    //     app.contextMatchesOptions(context, {only: {verb:'post'}}); //=> false
    //     // match all except a verb
    //     app.contextMatchesOptions(context, {except: {verb:'post'}}); //=> true
    //     app.contextMatchesOptions(context, {except: {verb:'get'}}); //=> false
    //     // match all except a path
    //     app.contextMatchesOptions(context, {except: {path:'#/otherpath'}}); //=> true
    //     app.contextMatchesOptions(context, {except: {path:'#/mypath'}}); //=> false
    //   
    contextMatchesOptions: function(context, match_options, positive) {
      // empty options always match
      var options = match_options;
      if (typeof options === 'undefined' || options == {}) {
        return true;
      }
      if (typeof positive === 'undefined') {
        positive = true;
      }
      // normalize options
      if (typeof options === 'string' || $.isFunction(options.test)) {
        options = {path: options};
      }
      if (options.only) {
        return this.contextMatchesOptions(context, options.only, true);
      } else if (options.except) {
        return this.contextMatchesOptions(context, options.except, false);  
      }
      var path_matched = true, verb_matched = true;
      if (options.path) {
        // wierd regexp test
        if ($.isFunction(options.path.test)) {
          path_matched = options.path.test(context.path);
        } else {
          path_matched = (options.path.toString() === context.path);
        }
      }
      if (options.verb) {
        verb_matched = options.verb === context.verb;
      }
      return positive ? (verb_matched && path_matched) : !(verb_matched && path_matched);
    },
    

    // Delegates to the <tt>location_proxy</tt> to get the current location.
    // See <tt>Sammy.HashLocationProxy</tt> for more info on location proxies.
    getLocation: function() {
      return this.location_proxy.getLocation();
    },
    
    // Delegates to the <tt>location_proxy</tt> to set the current location.
    // See <tt>Sammy.HashLocationProxy</tt> for more info on location proxies.
    //
    // === Arguments
    // 
    // +new_location+:: A new location string (e.g. '#/')
    //
    setLocation: function(new_location) {
      return this.location_proxy.setLocation(new_location);
    },
    
    // Swaps the content of <tt>$element()</tt> with <tt>content</tt>
    // You can override this method to provide an alternate swap behavior
    // for <tt>EventContext.partial()</tt>.
    // 
    // === Example
    //
    //    var app = $.sammy(function() {
    //      
    //      // implements a 'fade out'/'fade in'
    //      this.swap = function(content) {
    //        this.$element().hide('slow').html(content).show('slow');
    //      }
    //      
    //      get('#/', function() {
    //        this.partial('index.html.erb') // will fade out and in
    //      });
    //      
    //    });
    //
    swap: function(content) {
      return this.$element().html(content);
    },
    
    // This thows a '404 Not Found' error by invoking <tt>error()</tt>. 
    // Override this method or <tt>error()</tt> to provide custom
    // 404 behavior (i.e redirecting to / or showing a warning)
    notFound: function(verb, path) {
      var ret = this.error(['404 Not Found', verb, path].join(' '));
      return (verb === 'get') ? ret : true;
    },
    
    // The base error handler takes a string <tt>message</tt> and an <tt>Error</tt>
    // object. If <tt>raise_errors</tt> is set to <tt>true</tt> on the app level,
    // this will re-throw the error to the browser. Otherwise it will send the error
    // to <tt>log()</tt>. Override this method to provide custom error handling
    // e.g logging to a server side component or displaying some feedback to the
    // user.
    error: function(message, original_error) {
      if (!original_error) { original_error = new Error(); }
      original_error.message = [message, original_error.message].join(' ');
      this.trigger('error', {message: original_error.message, error: original_error});
      if (this.raise_errors) {
        throw(original_error);
      } else {
        this.log(original_error.message, original_error);
      }
    },
    
    _checkLocation: function() {
      var location, returned;
      // get current location
      location = this.getLocation();
      // compare to see if hash has changed
      if (location != this.last_location) {
        // lookup route for current hash
        returned = this.runRoute('get', location);
      }
      // reset last location
      this.last_location = location;
      return returned;
    },
    
    _checkFormSubmission: function(form) {
      var $form, path, verb, params, returned;
      this.trigger('check-form-submission', {form: form});
      $form = $(form);
      path  = $form.attr('action');
      verb  = $.trim($form.attr('method').toString().toLowerCase());
      if (!verb || verb == '') { verb = 'get'; }
      this.log('_checkFormSubmission', $form, path, verb);
      params = $.extend({}, this._parseFormParams($form), {'$form': $form});
      returned = this.runRoute(verb, path, params);
      return (typeof returned == 'undefined') ? false : returned;
    },
    
    _parseFormParams: function($form) {
      var params = {};
      $.each($form.serializeArray(), function(i, field) {
        if (params[field.name]) {
          if ($.isArray(params[field.name])) {
            params[field.name].push(field.value);
          } else {
            params[field.name] = [params[field.name], field.value];
          }
        } else {
          params[field.name] = field.value;
        }
      });
      return params;
    },
    
    _parseQueryString: function(path) {
      var query = {}, parts, pairs, pair, i;

      parts = path.match(QUERY_STRING_MATCHER);
      if (parts) {
        pairs = parts[1].split('&');
        for (i = 0; i < pairs.length; i += 1) {
          pair = pairs[i].split('=');
          query[pair[0]] = _decode(pair[1]);
        }
      }

      return query;
    },
    
    _listen: function(name, callback) {
      return this.$element().bind([name, this.eventNamespace()].join('.'), callback);
    },
    
    _unlisten: function(name, callback) {
      return this.$element().unbind([name, this.eventNamespace()].join('.'), callback);
    }

  });
  
  // <tt>Sammy.EventContext</tt> objects are created every time a route is run or a 
  // bound event is triggered. The callbacks for these events are evaluated within a <tt>Sammy.EventContext</tt>
  // This within these callbacks the special methods of <tt>EventContext</tt> are available.
  // 
  // === Example
  //
  //  $.sammy(function() { with(this) {
  //    // The context here is this Sammy.Application
  //    get('#/:name', function() { with(this) {
  //      // The context here is a new Sammy.EventContext
  //      if (params['name'] == 'sammy') {
  //        partial('name.html.erb', {name: 'Sammy'});
  //      } else {
  //        redirect('#/somewhere-else')
  //      }
  //    }});
  //  }});
  //
  // Initialize a new EventContext
  //
  // === Arguments
  //
  // +app+::    The <tt>Sammy.Application</tt> this event is called within.
  // +verb+::   The verb invoked to run this context/route.
  // +path+::   The string path invoked to run this context/route.
  // +params+:: An Object of optional params to pass to the context. Is converted
  //            to a <tt>Sammy.Object</tt>.
  Sammy.EventContext = function(app, verb, path, params) {
    this.app    = app;
    this.verb   = verb;
    this.path   = path;
    this.params = new Sammy.Object(params);
  };
   
  Sammy.EventContext.prototype = $.extend({}, Sammy.Object.prototype, {
    
    // A shortcut to the app's <tt>$element()</tt>
    $element: function() {
      return this.app.$element();
    },
            
    // Used for rendering remote templates or documents within the current application/DOM.
    // By default Sammy and <tt>partial()</tt> know nothing about how your templates
    // should be interpeted/rendered. This is easy to change, though. <tt>partial()</tt> looks
    // for a method in <tt>EventContext</tt> that matches the extension of the file you're
    // fetching (e.g. 'myfile.template' will look for a template() method, 'myfile.haml' => haml(), etc.)
    // If no matching render method is found it just takes the file contents as is. 
    // 
    // If you're templates have different (or no) extensions, and you want to render them all
    // through the same engine, you can set the default/fallback template engine on the app level
    // by setting <tt>app.template_engine</tt> to the name of the engine or a <tt>function() {}</tt>
    //
    // === Caching
    //
    // If you use the <tt>Sammy.Cache</tt> plugin, remote requests will be automatically cached unless
    // you explicitly set <tt>cache_partials</tt> to <tt>false</tt>
    //
    // === Example
    //
    // There are a couple different ways to use <tt>partial()</tt>:
    // 
    //      partial('doc.html');
    //      //=> Replaces $element() with the contents of doc.html
    //
    //      use(Sammy.Template); 
    //      //=> includes the template() method
    //      partial('doc.template', {name: 'Sammy'}); 
    //      //=> Replaces $element() with the contents of doc.template run through <tt>template()</tt>
    //
    //      partial('doc.html', function(data) {
    //        // data is the contents of the template.
    //        $('.other-selector').html(data); 
    //      });
    //
    // === Iteration/Arrays
    //
    // If the data object passed to <tt>partial()</tt> is an Array, <tt>partial()</tt> 
    // will itterate over each element in data calling the callback with the 
    // results of interpolation and the index of the element in the array.
    // 
    //    use(Sammy.Template);
    //    // item.template => "<li>I'm an item named <%= name %></li>"
    //    partial('item.template', [{name: "Item 1"}, {name: "Item 2"}])
    //    //=> Replaces $element() with: 
    //    // <li>I'm an item named Item 1</li><li>I'm an item named Item 2</li>
    //    partial('item.template', [{name: "Item 1"}, {name: "Item 2"}], function(rendered, i) {
    //      rendered; //=> <li>I'm an item named Item 1</li> // for each element in the Array
    //      i; // the 0 based index of the itteration
    //    });
    // 
    partial: function(path, data, callback) {
      var file_data, 
          wrapped_callback,
          engine,
          data_array,
          cache_key = 'partial:' + path,
          context = this;

      // engine setup
      if ((engine = path.match(/\.([^\.]+)$/))) { engine = engine[1]; }
      // set the engine to the default template engine if no match is found
      if ((!engine || !$.isFunction(context[engine])) && this.app.template_engine) {
        engine = this.app.template_engine;
      }
      if (engine && !$.isFunction(engine) && $.isFunction(context[engine])) { 
        engine = context[engine]; 
      }
      if (!callback && $.isFunction(data)) {
        // callback is in the data position
        callback = data;
        data = {};
      }
      data_array = ($.isArray(data) ? data : [data || {}]);
      wrapped_callback = function(response) {
        var new_content = response,
            all_content =  "";
        $.each(data_array, function(i, idata) {
          // extend the data object with the context
          $.extend(idata, context);        
          if ($.isFunction(engine)) {
            new_content = engine.apply(context, [response, idata]);
          } 
          // collect the content
          all_content += new_content;
          // if callback exists call it for each iteration
          if (callback) { 
            // return the result of the callback 
            // (you can bail the loop by returning false)
            return callback.apply(context, [new_content, i]); 
          }
        });
        if (!callback) { context.swap(all_content); }
        context.trigger('changed');
      };
      if (this.app.cache_partials && this.cache(cache_key)) {
        // try to load the template from the cache
        wrapped_callback.apply(context, [this.cache(cache_key)]);
      } else {
        // the template wasnt cached, we need to fetch it
        $.get(path, function(response) {
          if (context.app.cache_partials) { context.cache(cache_key, response); }
          wrapped_callback.apply(context, [response]);
        });
      }
    },
    
    // Changes the location of the current window. If <tt>to</tt> begins with 
    // '#' it only changes the document's hash. If passed more than 1 argument
    // redirect will join them together with forward slashes.
    //
    // === Example
    //
    //      redirect('#/other/route');
    //      // equivilent to
    //      redirect('#', 'other', 'route');
    //
    redirect: function() {
      var to, args = $.makeArray(arguments), 
          current_location = this.app.getLocation();
      if (args.length > 1) {
        args.unshift('/');
        to = this.join.apply(this, args);
      } else {
        to = args[0];
      }
      this.trigger('redirect', {to: to});
      this.app.last_location = this.path;
      this.app.setLocation(to);
      if (current_location == to) {
        this.app.trigger('location-changed');
      }
    },
    
    // Triggers events on <tt>app</tt> within the current context.
    trigger: function(name, data) {
      if (typeof data == 'undefined') { data = {}; }
      if (!data.context) { data.context = this; }
      return this.app.trigger(name, data);
    },
    
    // A shortcut to app's <tt>eventNamespace()</tt>
    eventNamespace: function() {
      return this.app.eventNamespace();
    },
    
    // A shortcut to app's <tt>swap()</tt>
    swap: function(contents) {
      return this.app.swap(contents);
    },
    
    // Raises a possible <tt>notFound()</tt> error for the current path.
    notFound: function() {
      return this.app.notFound(this.verb, this.path);
    },
    
    // //=> Sammy.EventContext: get #/ {}
    toString: function() {
      return "Sammy.EventContext: " + [this.verb, this.path, this.params].join(' ');
    }
        
  });
  
  // An alias to Sammy
  $.sammy = window.Sammy = Sammy;
  
})(jQuery);