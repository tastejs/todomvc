define('troopjs-widget/version',[], { 'toString': function () { return ; } });

/**
 * @license MIT http://troopjs.mit-license.org/
 */
define('troopjs-widget/config',[
  "troopjs-dom/config",
  "module",
  "mu-merge/main"
], function (config, module, merge) {
  

  /**
   * @class widget.config.widget
   * @enum
   * @private
   */
  var WIDGET = {
    /**
     * Property of the widget where the **weft** resides.
     */
    "$weft": "$weft",
    /**
     * Attribute name of the element where the **weave** resides.
     */
    "weave": "data-weave",
    /**
     * Attribute name of the element where the **unweave** resides.
     */
    "unweave": "data-unweave",
    /**
     * Attribute name of the element where the **woven** resides.
     */
    "woven": "data-woven"
  };

  /**
   * Provides configuration for the widget package
   * @class widget.config
   * @extends dom.config
   * @private
   * @alias feature.config
   */

  return merge.call({}, config, {
    /**
     * Widget related configuration
     * @cfg {widget.config.widget}
     * @protected
     */
    "widget": WIDGET
  }, module.config());
});

/**
 * @license MIT http://troopjs.mit-license.org/
 */
define('troopjs-widget/weave',[
  "./config",
  "troopjs-core/component/signal/start",
  "require",
  "when/when",
  "jquery",
  "mu-getargs/main"
], function (config, start, parentRequire, when, $, getargs) {
  

  /**
   * @class widget.weave
   * @mixin widget.config
   * @mixin Function
   * @static
   */

  var UNDEFINED;
  var NULL = null;
  var ARRAY_PROTO = Array.prototype;
  var ARRAY_MAP = ARRAY_PROTO.map;
  var ARRAY_PUSH = ARRAY_PROTO.push;
  var DEFERRED = "deferred";
  var MODULE = "module";
  var LENGTH = "length";
  var $WEFT = config.widget.$weft;
  var ATTR_WEAVE = config.widget.weave;
  var ATTR_WOVEN = config.widget.woven;
  var RE_SEPARATOR = /[\s,]+/;

  /**
   * Weaves `$element`
   * @param {String} weave_attr
   * @param {Array} constructor_args
   * @return {Promise}
   * @ignore
   */
  function $weave (weave_attr, constructor_args) {
    /*eslint consistent-this:0*/

    // Let `$element` be `this`
    var $element = this;
    // Get all data from `$element`
    var $data = $element.data();
    // Let `$weft` be `$data[$WEFT]` or `$data[$WEFT] = []`
    var $weft = $data.hasOwnProperty($WEFT)
      ? $data[$WEFT]
      : $data[$WEFT] = [];
    // Scope `weave_re` locally since we use the `g` flag
    var weave_re = /[\s,]*(((?:\w+!)?([\w\/\.\-]+)(?:#[^(\s]+)?)(?:\((.*?)\))?)/g;
    // Let `weave_args` be `[]`
    var weave_args = [];
    var weave_arg;
    var args;
    var matches;

    /**
     * Maps `value` to `$data[value]`
     * @param {*} value
     * @return {*}
     * @private
     */
    function $map (value) {
      return $data.hasOwnProperty(value)
        ? $data[value]
        : value;
    }

    // Iterate while `weave_re` matches
    // matches[1] : max widget name with args - "mv!widget/name#1.x(1, 'string', false)"
    // matches[2] : max widget name - "mv!widget/name#1.x"
    // matches[3] : min widget name - "widget/name"
    // matches[4] : widget arguments - "1, 'string', false"
    while ((matches = weave_re.exec(weave_attr)) !== NULL) {
      // Let `weave_arg` be [ $element, widget display name ].
      // Push `weave_arg` on `weave_args`
      ARRAY_PUSH.call(weave_args, weave_arg = [ $element, matches[3] ]);

      // Let `weave_arg[MODULE]` be `matches[2]`
      weave_arg[MODULE] = matches[2];
      // If there were additional arguments ...
      if ((args = matches[4]) !== UNDEFINED) {
        // .. parse them using `getargs`, `.map` the values with `$map` and push to `weave_arg`
        ARRAY_PUSH.apply(weave_arg, getargs.call(args).map($map));
      }

      // Let `weave_arg[DEFERRED]` be `when.defer()`
      // Push `weave_arg[DEFERRED].promise` on `$weft`
      ARRAY_PUSH.call($weft, (weave_arg[DEFERRED] = when.defer()).promise);

      // Push `constructor_args` on `weave_arg`
      ARRAY_PUSH.apply(weave_arg, constructor_args);
    }

    // Start async promise chain
    return when
      // Require, instantiate and start
      .map(weave_args, function (widget_args) {
        // Let `deferred` be `widget_args[DEFERRED]`
        var deferred = widget_args[DEFERRED];

        // Extract `resolve`, `reject` and `promise` from `deferred`
        var resolve = deferred.resolve;
        var reject = deferred.reject;

        // Require `weave_arg[MODULE]`
        parentRequire([ widget_args[MODULE] ], function (Widget) {
          var $deferred;

          // Create widget instance
          var widget = Widget.apply(Widget, widget_args);

          // TroopJS <= 1.x (detect presence of ComposeJS)
          if (widget.constructor._getBases) {
            // Let `$deferred` be `$.Deferred()`
            $deferred = $.Deferred();

            // Get trusted promise
            when($deferred)
              // Yield
              .yield(widget)
              // Link
              .then(resolve, reject);

            // Start widget
            widget.start($deferred);
          }
          // TroopJS >= 2.x
          else {
            // Start widget
            start.call(widget)
              // Yield
              .yield(widget)
              // Link
              .then(resolve, reject);
          }
        }, reject);

        // Return `deferred.promise`
        return deferred.promise;
      })
      // Update `ATTR_WOVEN`
      .tap(function (widgets) {
        // Bail fast if no widgets were woven
        if (widgets[LENGTH] === 0) {
          return;
        }

        // Map `Widget[]` to `String[]`
        var woven = widgets.map(function (widget) {
          return widget.toString();
        });

        // Update `$element` attribute `ATTR_WOVEN`
        $element.attr(ATTR_WOVEN, function (index, attr) {
          // Split `attr` and concat with `woven`
          var values = (attr === UNDEFINED ? ARRAY_PROTO : attr.split(RE_SEPARATOR)).concat(woven);
          // If `values[LENGTH]` is not `0` ...
          return values[LENGTH] !== 0
            // ... return `values.join(" ")`
            ? values.join(" ")
            // ... otherwise return `NULL` to remove the attribute
            : NULL;
        });
      });
  }

  /**
   * Instantiate all {@link widget.component widgets}  specified in the `data-weave` attribute
   * of this element, and to signal the widget for start with the arguments.
   *
   * The weaving will result in:
   *
   *  - Updates the `data-woven` attribute with the created widget instances names.
   *  - The `$weft` data property will reference the widget instances.
   *
   * @localdoc
   *
   * It also lives as a jquery plugin as {@link $#method-weave}.
   *
   * **Note:** It's not commonly to use this method directly, use instead {@link $#method-weave jQuery.fn.weave}.
   *
   * 	// Create element for weaving
   * 	var $el = $('<div data-weave="my/widget(option)"></div>')
   * 	// Populate `data`
   * 	.data("option",{"foo":"bar"})
   * 	// Instantiate the widget defined in "my/widget" module, with one param read from the element's custom data.
   * 	.weave();
   *
   * @method constructor
   * @param {...*} [args] Arguments that will be passed to the {@link core.component.signal.start start} signal
   * @return {Promise} Promise for the completion of weaving all widgets.
   */
  return function () {
    // Let `constructor_args` be `arguments`
    var constructor_args = arguments;

    // Wait for map (sync) and weave (async)
    return when.all(ARRAY_MAP.call(this, function (element) {
      // Bless `$element` with `$`
      var $element = $(element);
      // Get ATTR_WEAVE attribute or default to `""`
      var weave_attr = $element.attr(ATTR_WEAVE) || "";
      // Make sure to remove ATTR_WEAVE asap in case someone else tries to `weave` again
      $element.removeAttr(ATTR_WEAVE);
      // Attempt weave
      return $weave.call($element, weave_attr, constructor_args);
    }));
  };
});

/**
 * @license MIT http://troopjs.mit-license.org/
 */
define('troopjs-widget/unweave',[
  "./config",
  "troopjs-core/component/signal/finalize",
  "when/when",
  "jquery"
], function (config, finalize, when, $) {
  

  /**
   * @class widget.unweave
   * @mixin widget.config
   * @mixin Function
   * @static
   */
  var UNDEFINED;
  var NULL = null;
  var ARRAY_PROTO = Array.prototype;
  var ARRAY_MAP = ARRAY_PROTO.map;
  var LENGTH = "length";
  var $WEFT = config.widget.$weft;
  var ATTR_WOVEN = config.widget.woven;
  var ATTR_UNWEAVE = config.widget.unweave;
  var RE_SEPARATOR = /[\s,]+/;

  /**
   * Unweaves `$element`
   * @param {String} unweave_attr
   * @param {Array} finalize_args
   * @return {Promise}
   * @ignore
   */
  function $unweave (unweave_attr, finalize_args) {
    /*eslint consistent-this:0*/

    // Let `$element` be `this`
    var $element = this;
    // Get all data from `$element`
    var $data = $element.data();
    // Let `$weft` be `$data[$WEFT]` or `$data[$WEFT] = []`
    var $weft = $data.hasOwnProperty($WEFT)
      ? $data[$WEFT]
      : $data[$WEFT] = [];
    // Scope `unweave_re` locally since we use the `g` flag
    var unweave_re = /[\s,]*([\w\/\.\-]+)(?:@(\d+))?/g;
    var unweave_res = [];
    var unweave_res_length = 0;
    var matches;

    // Iterate unweave_attr (while unweave_re matches)
    // matches[1] : widget name - "widget/name"
    // matches[2] : widget instance id - "123"
    while ((matches = unweave_re.exec(unweave_attr)) !== NULL) {
      unweave_res[unweave_res_length++] = "^" + matches[1] + "@" + (matches[2] || "\\d+") + "$";
    }

    // Redefine `unweave_re` as a combined regexp
    unweave_re = new RegExp(unweave_res.join("|"));

    // Start async promise chain
    return when
      // Filter $weft
      .filter($weft, function (widget, index) {
        // Bail fast if we don't want to unweave
        if (!unweave_re.test(widget.toString())) {
          return false;
        }

        // Let `deferred` be `when.defer()`
        var deferred = when.defer();
        // Extract `resolve`, `reject` from `deferred`
        var resolve = deferred.resolve;
        var reject = deferred.reject;
        // Let `$weft[index]` be `deferred.promise`
        // Let `promise` be `$weft[index]`
        var promise = $weft[index] = deferred.promise;
        var $deferred;

        // TroopJS <= 1.x
        if (widget.trigger) {
          // Let `$deferred` be `$.Deferred()`
          $deferred = $.Deferred();

          // Get trusted promise
          when($deferred)
            // Yield
            .yield(widget)
            // Link
            .then(resolve, reject);

          // Stop widget
          widget.stop($deferred);
        }
        // TroopJS >= 2.x
        else {
          // Finalize widget
          finalize.apply(widget, finalize_args)
            // Yield
            .yield(widget)
            // Link
            .then(resolve, reject);
        }

        return promise
          // Make sure to remove the promise from `$weft`
          .tap(function () {
            delete $weft[index];
          })
          .yield(true);
      })
      .tap(function (widgets) {
        // Bail fast if no widgets were unwoven
        if (widgets[LENGTH] === 0) {
          return;
        }

        // Let `unwoven` be a combined regexp of unwoven `widget.toString()`
        var unwoven = new RegExp(
          widgets
            .map(function (widget) {
              return "^" + widget.toString() + "$";
            })
            .join("|")
        );

        /**
         * Filters values using `unwoven`
         * @param {String} value
         * @return {boolean}
         * @ignore
         */
        function filter (value) {
          return !unwoven.test(value);
        }

        // Update `$element` attribute `ATTR_WOVEN`
        $element.attr(ATTR_WOVEN, function (index, attr) {
          // Split `attr` and filter with `filter`
          var values = (attr === UNDEFINED ? ARRAY_PROTO : attr.split(RE_SEPARATOR)).filter(filter);
          // If `values[LENGTH]` is not `0` ...
          return values[LENGTH] !== 0
            // ... return `values.join(" ")`
            ? values.join(" ")
            // ... otherwise return `NULL` to remove the attribute
            : NULL;
        });
      });
  }

  /**
   * Destroy all {@link widget.component widget} instances living on this element, that are created
   * by {@link widget.weave}, it is also to clean up the attributes
   * and data references to the previously instantiated widgets.
   *
   * @localdoc
   *
   * It also lives as a jquery plugin as {@link $#method-unweave}.
   *
   * @method constructor
   * @param {...*} [args] Arguments that will be passed to the {@link core.component.signal.finalize finalize} signal
   * @return {Promise} Promise to the completion of unweaving all woven widgets.
   */
  return function () {
    // Let `finalize_args` be `arguments`
    var finalize_args = arguments;

    // Wait for map (sync) and weave (async)
    return when.all(ARRAY_MAP.call(this, function (element) {
      // Bless `$element` with `$`
      var $element = $(element);
      // Get ATTR_WEAVE attribute or default to `""`
      var unweave_attr = $element.attr(ATTR_UNWEAVE) || "";
      // Make sure to remove ATTR_UNWEAVE asap in case someone else tries to `unweave` again
      $element.removeAttr(ATTR_UNWEAVE);
      // Attempt weave
      return $unweave.call($element, unweave_attr, finalize_args);
    }));
  };
});

/**
 * @license MIT http://troopjs.mit-license.org/
 */
define('troopjs-widget/woven',[
  "./config",
  "when/when",
  "jquery"
], function (config, when, $) {
  

  /**
   * @class widget.woven
   * @mixin widget.config
   * @mixin Function
   * @static
   */

  var NULL = null;
  var ARRAY_MAP = Array.prototype.map;
  var LENGTH = "length";
  var $WEFT = config.widget.$weft;
  var RE_ANY = /.*/;
  var RE_WIDGET = /([\w\/\.\-]+)(?:@(\d+))?/;

  /**
   * Retrieve all or specific {@link widget.component widget} instances living on this element, that are
   * created by {@link widget.weave}.
   *
   * It also lives as a jquery plugin as {@link $#method-woven}.
   * @method constructor
   * @param {...String} [selector] One or more widget selectors to narrow down the returned ones.
   *
   *   * (empty string) retrieves all woven widgets
   *   * `module/name` retrieves widgets matching module name
   *   * `module/name@instance` retrieves widgets matching both module name and instance id
   * @return {Promise} Promise to the completion of retrieving the woven widgets array.
   */
  return function () {
    var woven_re = arguments[LENGTH] > 0
      ? new RegExp(
        ARRAY_MAP
          .call(arguments, function (arg) {
            var matches;

            // matches[1] : widget name - "widget/name"
            // matches[2] : widget instance id - "123"
            return (matches = RE_WIDGET.exec(arg)) !== NULL
              ? "^" + matches[1] + "@" + (matches[2] || "\\d+") + "$"
              : NULL;
          })
          .filter(function (arg) {
            return arg !== NULL;
          })
          .join("|")
      )
      : RE_ANY;

    return when.all(ARRAY_MAP.call(this, function (element) {
      return when.filter($.data(element, $WEFT) || false, function (widget) {
        return woven_re.test(widget);
      });
    }));
  };
});

/**
 * @license MIT http://troopjs.mit-license.org/
 */
define('troopjs-widget/component',[
  "troopjs-dom/component",
  "./config",
  "./weave",
  "./unweave",
  "./woven"
], function (Component, config, weave, unweave, woven) {
  

  /**
   * @class widget.component
   * @extend dom.component
   * @alias feature.component
   * @mixin widget.config
   * @localdoc Adds functionality for working with the loom
   */

  var ARRAY_SLICE = Array.prototype.slice;
  var $ELEMENT = "$element";
  var SELECTOR_WEAVE = "[" + config.widget.weave + "]";
  var SELECTOR_WOVEN = "[" + config.widget.woven + "]";
  var FINALIZE = config.phase.finalize;

  /**
   * @method constructor
   * @inheritdoc
   */
  return Component.extend({
    "displayName": "widget/component",

    /**
     * Handles component render
     * @handler
     * @inheritdoc
     * @localdoc Calls {@link #method-weave} to ensure newly rendered html is woven
     */
    "sig/render": function ($target) {
      return weave.apply($target.find(SELECTOR_WEAVE).addBack(SELECTOR_WEAVE), ARRAY_SLICE.call(arguments, 1));
    },

    /**
     * @handler
     * @inheritdoc
     * @localdoc Calls {@link #method-unweave} to ensure this element is unwoven
     */
    "dom/destroy": function () {
      if (this.phase !== FINALIZE) {
        unweave.call(this[$ELEMENT]);
      }
    },

    /**
     * @method
     * @inheritdoc widget.weave#constructor
     */
    "weave": function () {
      return weave.apply(this[$ELEMENT].find(SELECTOR_WEAVE), ARRAY_SLICE.call(arguments));
    },

    /**
     * @inheritdoc widget.unweave#constructor
     */
    "unweave": function () {
      return unweave.apply(this[$ELEMENT].find(SELECTOR_WOVEN), arguments);
    },

    /**
     * @inheritdoc widget.woven#constructor
     */
    "woven": function () {
      return woven.apply(this[$ELEMENT].find(SELECTOR_WOVEN), arguments);
    }
  });
});

/**
 * @license MIT http://troopjs.mit-license.org/
 */
define('troopjs-hub/config',[
  "troopjs-core/config",
  "module",
  "mu-merge/main"
], function (config, module, merge) {
  

  /**
   * @class hub.config.emitter
   * @extends core.config.emitter
   * @private
   */
  var EMITTER = {
    /**
     * Property name for `memory`
     */
    "memory": "memory"
  };

  /**
   * HUB component configuration
   * @class hub.config
   * @extends core.config
   * @private
   * @alias feature.config
   */

  return merge.call({}, config, {
     /**
     * @cfg {hub.config.emitter}
     * @inheritdoc
     * @protected
     */
    "emitter": EMITTER
  }, module.config());
});

/**
 * @license MIT http://troopjs.mit-license.org/
 */
define('troopjs-hub/executor',[
  "./config",
  "when/when"
], function (config, when) {
  

  /**
   * @class hub.executor
   * @mixin Function
   * @private
   * @static
   * @alias feature.executor
   */

  var UNDEFINED;
  var OBJECT_TOSTRING = Object.prototype.toString;
  var ARRAY_SLICE = Array.prototype.slice;
  var TOSTRING_ARGUMENTS = "[object Arguments]";
  var TOSTRING_ARRAY = "[object Array]";
  var SKIP = config.phase.skip;
  var SCOPE = config.emitter.scope;
  var CALLBACK = config.emitter.callback;
  var HEAD = config.emitter.head;
  var NEXT = config.emitter.next;
  var MEMORY = config.emitter.memory;
  var PHASE = "phase";

  /**
   * @method constructor
   * @inheritdoc core.emitter.executor#constructor
   * @localdoc
   * - Skips handlers who's scope.{@link core.component.emitter#property-phase phase} matches {@link core.config.phase#skip}.
   * - Executes handlers passing each handler the result from the previous.
   * - If a handler returns `undefined` the result from the previous is used.
   * - When all handlers are completed the end result is memorized on `handlers`
   *
   * @return {Promise} Promise for `[*]`
   */
  return function (event, handlers, args) {
    var _handlers = [];
    var _handlersCount = 0;
    var scope = event[SCOPE];
    var callback = event[CALLBACK];
    var handler;

    // Iterate handlers
    for (handler = handlers[HEAD]; handler !== UNDEFINED; handler = handler[NEXT]) {
      if (callback && handler[CALLBACK] !== callback) {
        continue;
      }

      if (scope && handler[SCOPE] !== scope) {
        continue;
      }

      _handlers[_handlersCount++] = handler;
    }

    return when
      // Reduce `_handlers`
      .reduce(_handlers, function (current, _handler) {
        // Let `_scope` be `handler[SCOPE]`
        var _scope = _handler[SCOPE];

        // Return early if `_scope[PHASE]` matches a blocked phase
        if (_scope !== UNDEFINED && SKIP.test(_scope[PHASE])) {
          return current;
        }

        // Run `handler` passing `args`
        // Pass to `when` to (potentially) update `result`
        return when(_handler.handle(current), function (result) {
          // If `result` is `UNDEFINED` ...
          if (result === UNDEFINED) {
            // ... return `current` ...
            return current;
          }

          // Detect `result` type
          switch (OBJECT_TOSTRING.call(result)) {
            // `arguments` should be converted to an array
            case TOSTRING_ARGUMENTS:
              return ARRAY_SLICE.call(result);

            // `array` can be passed as-is
            case TOSTRING_ARRAY:
              return result;

            // everything else should be wrapped in an array
            default:
              return [ result ];
          }
        });
      }, args)
      // Memorize
      .tap(function (result) {
        // Store `result` in `handlers[MEMORY]`
        handlers[MEMORY] = result;
      });
  };
});

/**
 * @license MIT http://troopjs.mit-license.org/
 */
define('troopjs-hub/emitter',[
  "troopjs-core/emitter/composition",
  "./config",
  "./executor"
], function (Emitter, config, executor) {
  

  /**
   * A static version of {@link core.emitter.composition} with memorization.
   *
   * ## Memorized emitting
   *
   * A emitter event will memorize the "current" value of each event. Each executor may have it's own interpretation
   * of what "current" means.
   *
   * @class hub.emitter
   * @extend core.emitter.composition
   * @mixin hub.config
   * @inheritdoc
   * @singleton
   */

  /**
   * @method create
   * @static
   * @hide
   */

  /**
   * @method extend
   * @static
   * @hide
   */

  /**
   * @method constructor
   * @hide
   */

  var UNDEFINED;
  var MEMORY = config.emitter.memory;
  var HANDLERS = config.emitter.handlers;
  var EXECUTOR = config.emitter.executor;

  return Emitter.create(function (key, value) {
    var me = this;
    me[key] = value;
    return me;
  }.call({
    "displayName": "hub/emitter",

    /**
     * Returns value in handlers MEMORY
     * @param {String} type event type to peek at
     * @param {*} [value] Value to use _only_ if no memory has been recorder
     * @return {*} Value in MEMORY
     */
    "peek": function (type, value) {
      var handlers;

      return (handlers = this[HANDLERS][type]) === UNDEFINED || !handlers.hasOwnProperty(MEMORY)
        ? value
        : handlers[MEMORY];
    }
  }, EXECUTOR, executor));
});

/**
 * @license MIT http://troopjs.mit-license.org/
 */
define('troopjs-widget/application',[
  "./component",
  "troopjs-core/component/signal/initialize",
  "troopjs-core/component/signal/start",
  "troopjs-core/component/signal/stop",
  "troopjs-core/component/signal/finalize",
  "troopjs-hub/emitter",
  "when/when"
], function (Widget, initialize, start, stop, finalize, hub, when) {
  

  /**
   * The application widget serves as a container for all troop components that bootstrap the page.
   * @class widget.application
   * @extend widget.component
   * @alias widget.application
   */

  /**
   * Application start event
   * @event hub/application/start
   * @param {widget.application} application The started application
   */

  /**
   * Application stop event
   * @event hub/application/stop
   * @param {widget.application} application The stopped application
   */

  var ARRAY_SLICE = Array.prototype.slice;
  var COMPONENTS = "components";

  /**
   * @method constructor
   * @inheritdoc
   * @param {jQuery|HTMLElement} $element The element that this widget should be attached to
   * @param {String} displayName A friendly name for this widget
   * @param {...core.component.emitter} component List of components to start before starting the application.
   */
  return Widget.extend(function () {
    /**
     * Application components
     * @private
     * @readonly
     * @property {core.component.emitter[]} components
     */
    this[COMPONENTS] = ARRAY_SLICE.call(arguments, 2);
  }, {
    "displayName": "widget/application",

    /**
     * @handler
     * @localdoc Initialize all registered components (widgets and services) that are passed in from the {@link #method-constructor}.
     * @inheritdoc
     */
    "sig/initialize": function () {
      var args = arguments;

      return when.map(this[COMPONENTS], function (component) {
        return initialize.apply(component, args);
      });
    },

    /**
     * @handler
     * @localdoc weave this and all widgets that are within this element.
     * @fires hub/application/start
     * @inheritdoc
     */
    "sig/start": function () {
      var me = this;
      var args = arguments;

      return when
        .map(me[COMPONENTS], function (component) {
          return start.apply(component, args);
        })
        .then(function () {
          return me.weave.apply(me, args);
        })
        .then(function () {
          return hub.emit("application/start", me);
        });
    },

    /**
     * @handler
     * @localdoc stop this and all woven widgets that are within this element.
     * @fires hub/application/stop
     * @inheritdoc
     */
    "sig/stop": function () {
      var me = this;
      var args = arguments;

      return me
        .unweave.apply(me, args).then(function () {
          return when.map(me[COMPONENTS], function (child) {
            return stop.apply(child, args);
          });
        })
        .then(function () {
          return hub.emit("application/stop", me);
        });
    },

    /**
     * @handler
     * @localdoc finalize all registered components (widgets and services) that are registered from the {@link #method-constructor}.
     * @inheritdoc
     */
    "sig/finalize": function () {
      var args = arguments;

      return when.map(this[COMPONENTS], function (component) {
        return finalize.apply(component, args);
      });
    },

    /**
     * Start the component life-cycle, sends out {@link #event-sig/initialize} and then {@link #event-sig/start}.
     * @param {...*} [args] arguments
     * @return {Promise}
     * @fires sig/initialize
     * @fires sig/start
     */
    "start": start,

    /**
     * Stops the component life-cycle, sends out {@link #event-sig/stop} and then {@link #event-sig/finalize}.
     * @param {...*} [args] arguments
     * @return {Promise}
     * @fires sig/stop
     * @fires sig/finalize
     */
    "stop": finalize
  });
});

/**
 * @license MIT http://troopjs.mit-license.org/
 */
define('troopjs-widget/plugin',[
  "jquery",
  "when/when",
  "./config",
  "./weave",
  "./unweave",
  "./woven"
], function ($, when, config, weave, unweave, woven) {
  

  /**
   * Extends {@link jQuery} with:
   *
   *  - {@link $#property-woven} property
   *  - {@link $#method-weave}, {@link $#method-unweave} and {@link $#method-woven} methods
   *
   * @class widget.plugin
   * @static
   * @alias plugin.jquery
   */

  var UNDEFINED;
  var $FN = $.fn;
  var $EXPR = $.expr;
  var WEAVE = "weave";
  var UNWEAVE = "unweave";
  var WOVEN = "woven";
  var ATTR_WOVEN = config.widget.woven;

  /**
   * Tests if element has a data-woven attribute
   * @param element to test
   * @return {boolean}
   * @ignore
   */
  function hasDataWovenAttr (element) {
    return $(element).attr(ATTR_WOVEN) !== UNDEFINED;
  }

  /**
   * @class $
   */

  /**
   * jQuery `:woven` expression
   * @property woven
   */
  $EXPR[":"][WOVEN] = $EXPR.createPseudo(function (widgets) {
    // If we don't have widgets to test, quick return optimized expression
    if (widgets === UNDEFINED) {
      return hasDataWovenAttr;
    }

    // Scope `woven_re` locally since we use the `g` flag
    var woven_re = /[\s,]*([\w\d_\/\.\-]+)(?:@(\d+))?/g;
    var woven_res = [];
    var woven_res_length = 0;
    var matches;

    // Iterate `widgets` (while woven_re matches)
    // matches[1] : widget name - "widget/name"
    // matches[2] : widget instance id - "123"
    while ((matches = woven_re.exec(widgets)) !== null) {
      woven_res[woven_res_length++] = "(?:^|[\\s,]+)" + matches[1] + "@" + (matches[2] || "\\d+") + "($|[\\s,]+)";
    }

    // Redefine `woven_re` as a combined regexp
    woven_re = new RegExp(woven_res.join("|"));

    // Return expression
    return function (element) {
      var attr_woven = $.attr(element, ATTR_WOVEN);

      // Check that attr_woven is not UNDEFINED, and that widgets test against a processed attr_woven
      return attr_woven !== UNDEFINED && woven_re.test(attr_woven);
    };
  });

  /**
   * @method weave
   * @inheritdoc widget.weave#constructor
   */
  $FN[WEAVE] = weave;

  /**
   * @method unweave
   * @inheritdoc widget.unweave#constructor
   */
  $FN[UNWEAVE] = unweave;

  /**
   * @method woven
   * @inheritdoc widget.woven#constructor
   */
  $FN[WOVEN] = woven;
});

define(['troopjs-widget/version'], function (version) {
  return version;
});