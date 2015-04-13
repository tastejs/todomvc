/*!
 *   ____ .     ____  ____  ____    ____.
 *   \   (/_\___\  (__\  (__\  (\___\  (/
 *   / ._/  ( . _   \  . /   . /  . _   \_
 * _/    ___/   /____ /  \_ /  \_    ____/
 * \   _/ \____/   \____________/   /
 *  \_t:_____r:_______o:____o:___p:/ [ troopjs - 3.0.0-rc+726cd7f ]
 *
 * @license http://troopjs.mit-license.org/ © Mikael Karon, Garry Yao, Eyal Arubas
 */
define('troopjs/version',[], { 'toString': function () { return "3.0.0-rc+726cd7f"; } });

/**
 * @license MIT http://troopjs.mit-license.org/
 */
define('troopjs-compose/decorator',[],function () {
  

  /**
   * Decorator provides customized way to add properties/methods to object created by {@link compose.factory}.
   * @class compose.decorator
   * @protected
   */

  /**
   * Creates a new decorator
   * @method constructor
   * @param {Function} decorate Function that defines how to override the original one.
   * @param {Object} decorate.descriptor The object descriptor that is the current property.
   * @param {String} decorate.name The property name.
   * @param {Object} decorate.descriptors List of all property descriptors of the host object.
   */
  return function (decorate) {

    // Define properties
    Object.defineProperties(this, {
      /**
       * Function that decides what decoration is to make.
       * @method decorate
       * @param {Object} descriptor The object descriptor that is the current property.
       * @param {String} name The property name.
       * @param {Object} descriptors List of all property descriptors of the host object.
       */
      "decorate": {
        "value": decorate
      }
    });
  };
});

/**
 * @license MIT http://troopjs.mit-license.org/
 */
define('troopjs-compose/decorator/after',[ "../decorator" ], function (Decorator) {
  

  /**
   * @class compose.decorator.after
   * @static
   * @alias feature.decorator
   */

  var UNDEFINED;
  var VALUE = "value";

  /**
   * Create a decorator method that is to add code that will be executed after the original method.
   * @method constructor
   * @param {Function} func The decorator function which receives the arguments of the original, it's return value (if
   * not undefined) will be the used as the new return value.
   * @return {compose.decorator}
   */
  return function (func) {
    return new Decorator(function (descriptor) {
      var previous = descriptor[VALUE];

      descriptor[VALUE] = previous
        ? function () {
          var me = this;
          var retval = previous.apply(me, arguments);
          var newRet = func.apply(me, arguments);
          return newRet !== UNDEFINED ? newRet : retval;
        }
        : func;

      return descriptor;
    });
  };
});

/**
 * @license MIT http://troopjs.mit-license.org/
 */
define('troopjs-compose/decorator/around',[ "../decorator" ], function (Decorator) {
  

  /**
   * @class compose.decorator.around
   * @static
   * @alias feature.decorator
   */

  var VALUE = "value";
  var NOP = function () {};

  /**
   * Create a decorator that is to override an existing method.
   * @method constructor
   * @param {Function} func The decorator function which receives the original function as parameter and is supposed to
   * return a function that is to replace the original.
   * @return {compose.decorator}
   */
  return function (func) {
    return new Decorator(function (descriptor) {
      descriptor[VALUE] = func(descriptor[VALUE] || NOP);
      return descriptor;
    });
  };
});

/**
 * @license MIT http://troopjs.mit-license.org/
 */
define('troopjs-compose/decorator/before',[ "../decorator" ], function (Decorator) {
  

  /**
   * @class compose.decorator.before
   * @static
   * @alias feature.decorator
   */

  var UNDEFINED;
  var VALUE = "value";

  /**
   * Create a decorator method that is to add code that will be executed before the original method.
   * @method constructor
   * @param {Function} func The decorator function which receives the same arguments as with the original, it's return
   * value (if not undefined) will be send as the arguments of original function.
   * @return {compose.decorator}
   */
  return function (func) {
    return new Decorator(function (descriptor) {
      var next = descriptor[VALUE];

      descriptor[VALUE] = next
        ? function () {
          var me = this;
          var retval = func.apply(me, arguments);

          return next.apply(me, retval !== UNDEFINED ? retval : arguments);
        }
        : func;

      return descriptor;
    });
  };
});

/**
 * @license MIT http://troopjs.mit-license.org/
 */
define('troopjs-compose/decorator/extend',[
  "../decorator",
  "mu-merge/main"
], function (Decorator, merge) {
  

  /**
   * @class compose.decorator.extend
   * @static
   * @alias feature.decorator
   */

  var UNDEFINED;
  var VALUE = "value";
  var ARRAY_CONCAT = Array.prototype.concat;

  /**
   * Create a decorator that is to augment an existing Object property.
   * @method constructor
   * @param {Function|Object...} ext One or more objects to merge into this property, or a function that returns a new object to be used.
   * @return {compose.decorator}
   */
  return function (ext) {
    var args = arguments;

    return new Decorator(function (descriptor, name, descriptors) {
      var previous = descriptors[name][VALUE];
      var val;

      if (typeof ext === "function") {
        val = ext(previous);
      }
      else if (previous !== UNDEFINED) {
        val = merge.apply({}, ARRAY_CONCAT.apply([ previous ], args));
      }

      descriptor[VALUE] = val;

      return descriptor;
    });
  };
});

/**
 * @license MIT http://troopjs.mit-license.org/
 */
define('troopjs-compose/decorator/from',[ "../decorator" ], function (Decorator) {
  

  /**
   * @class compose.decorator.from
   * @static
   * @alias feature.decorator
   */

  var UNDEFINED;
  var VALUE = "value";
  var PROTOTYPE = "prototype";

  /**
   * Create a decorator that is to lend from a particular property from this own or the other factory.
   * @method constructor
   * @param {Function} [which] The other class from which to borrow the method, otherwise to borrow from the host class.
   * @param {String} [prop] The property name to borrow from, otherwise to borrow the same property name.
   * @return {compose.decorator}
   */
  return function (which, prop) {
    // Shifting arguments.
    if (typeof which === "string") {
      prop = which;
      which = UNDEFINED;
    }

    return new Decorator(function (descriptor, name, descriptors) {
      // To override a specified property, otherwise simply this property.
      name = prop || name;

      // Property is from the the other's prototype, otherwise from own descriptor.
      descriptor[VALUE] = which
        ? which[PROTOTYPE][name]
        : descriptors[name][VALUE];

      return descriptor;
    });
  };
});

/**
 * @license MIT http://troopjs.mit-license.org/
 */
define('troopjs-compose/config',[
  "module",
  "mu-merge/main"
], function (module, merge) {
  

  /**
   * Pragma interface.
   * @class compose.config.pragma
   * @interface
   * @private
   */
  /**
   * @property {RegExp} pattern Matching pattern
   */
  /**
   * @property {String|Function} replace Replacement String or function
   */

  /**
   * Provides configuration for the {@link compose.factory}
   * @class compose.config
   * @private
   * @alias feature.config
   */

  return merge.call({
    /**
     * @cfg {compose.config.pragma[]}
     * Pragmas used to rewrite methods before processing
     * @protected
     */
    "pragmas": [],


    /**
     * @cfg {RegExp}
     * Regular Expression used parse 'specials'.
     * ````
     * <special>/<type>[(<arguments>)]
     * ````
     * @protected
     */
    "specials": /^([^\/]+)\/(.+?)(?:\((.*)\))?$/
  }, module.config());
});

/**
 * @license MIT http://troopjs.mit-license.org/
 */
define('troopjs-core/config',[
  "module",
  "troopjs-compose/config",
  "mu-emitter/config",
  "mu-merge/main"
], function (module, config, emitterConfig, merge) {
  

  /**
   * @class core.config.emitter
   * @enum {String}
   * @private
   */
  /**
   * @property handlers Property name for `handlers`
   */
  /**
   * @property emitter Property name for `emitter`
   */
  /**
   * @property type Property name for `type`
   */
  /**
   * @property callback Property name for `callback`
   */
  /**
   * @property data Property name for `data`
   */
  /**
   * @property scope Property name for `scope`
   */
  /**
   * @property executor Property name for `executor`
   */
  /**
   * @property head Property name for `head`
   */
  /**
   * @property tail Property name for `tail`
   */
  /**
   * @property next Property name for `next`
   */
  /**
   * @property count Property name for `count`
   */
  /**
   * @property limit Property name for `limit`
   */
  /**
   * @property on Property name for `on`
   */
  /**
   * @property off Property name for `off`
   */

  /**
   * @class core.config.phase
   * @enum
   * @private
   */
  var PHASE = {
    /**
     * Protected phases
     */
    "skip": /^(?:initi|fin)alized?$/,
    /**
     * Phase while component is initializing.
     */
    "initialize": "initialize",
    /**
     * Phase when component is initialized.
     */
    "initialized": "initialized",
    /**
     * Phase while component is starting.
     */
    "start": "start",
    /**
     * Phase when component is started.
     */
    "started": "started",
    /**
     * Phase while component is stopping.
     */
    "stop": "stop",
    /**
     * Phase when component is stopped.
     */
    "stopped": "stopped",
    /**
     * Phase while component is finalizing.
     */
    "finalize": "finalize",
    /**
     * Phase when component is finalized.
     */
    "finalized": "finalized"
  };

  /**
   * @class core.config.signal
   * @enum {String}
   * @private
   */
  var SIGNAL = {
    /**
     * Signal emitted first time an event handler is added.
     */
    "setup": "sig/setup",
    /**
     * Signal emitted before each time an event handler is added.
     */
    "add": "sig/add",
    /**
     * Signal emitted each time an event handler is added.
     */
    "added": "sig/added",
    /**
     * Signal emitted before each time an event handler is removed.
     */
    "remove": "sig/remove",
    /**
     * Signal emitted each time an event handler is removed.
     */
    "removed": "sig/removed",
    /**
     * Signal emitted last time an event handler is removed.
     */
    "teardown": "sig/teardown",
    /**
     * Signal emitted when component initializes.
     */
    "initialize": "sig/initialize",
    /**
     * Signal emitted when component starts.
     */
    "start": "sig/start",
    /**
     * Signal emitted when component stops.
     */
    "stop": "sig/stop",
    /**
     * Signal emitted when component finalizes.
     */
    "finalize": "sig/finalize",
    /**
     * Signal emitted during registration.
     */
    "register": "sig/register",
    /**
     * Signal emitted during un-registeration.
     */
    "unregister": "sig/unregister",
    /**
     * Signal emitted when component starts a task.
     */
    "task": "sig/task"
  };

  /**
   * Component configuration
   * @class core.config
   * @extends compose.config
   * @private
   * @alias feature.config
   */

  return merge.call({}, config, {
    /**
     * Component signals
     * @cfg {core.config.signal}
     * @protected
     */
    "signal": SIGNAL,

    /**
     * Component phases
     * @cfg {core.config.phase}
     * @protected
     */
    "phase": PHASE,

    /**
     * Emitter properties
     * @cfg {core.config.emitter}
     * @protected
     */
    "emitter": emitterConfig
  }, module.config());
});

/**
 * @license MIT http://troopjs.mit-license.org/
 */
define('troopjs-core/component/signal/initialize',[
  "../../config",
  "when/when"
], function (config, when) {
  

  var UNDEFINED;
  var ARRAY_PUSH = Array.prototype.push;
  var PHASE = "phase";
  var INITIALIZE = config.phase.initialize;
  var INITIALIZED = config.phase.initialized;
  var SIG_INITIALIZE = config.signal.initialize;

  /**
   * @class core.component.signal.initialize
   * @implement core.component.signal
   * @mixin core.config
   * @static
   * @alias feature.signal
   * @private
   */

  /**
   * @method constructor
   * @inheritdoc
   * @localdoc Transitions the component {@link core.component.emitter#property-phase} to `initialized`
   */

  return function () {
    var me = this;
    var args = arguments;

    return when(me[PHASE], function (phase) {
      var _args;

      if (phase === UNDEFINED) {
        // Let `me[PHASE]` be `INITIALIZE`
        me[PHASE] = INITIALIZE;

        // Let `_args` be `[ SIG_INITIALIZE ]`
        // Push `args` on `_args`
        ARRAY_PUSH.apply(_args = [ SIG_INITIALIZE ], args);

        return me
          .emit.apply(me, _args)
          .then(function () {
            /*eslint no-return-assign:0*/

            // Let `me[PHASE]` be `INITIALIZED`
            return me[PHASE] = INITIALIZED;
          });
      }
      else {
        return phase;
      }
    });
  };
});

/**
 * @license MIT http://troopjs.mit-license.org/
 */
define('troopjs-core/component/signal/start',[
  "./initialize",
  "../../config",
  "when/when"
], function (initialize, config, when) {
  

  var ARRAY_PUSH = Array.prototype.push;
  var PHASE = "phase";
  var INITIALIZED = config.phase.initialized;
  var START = config.phase.start;
  var STARTED = config.phase.started;
  var SIG_START = config.signal.start;

  /**
   * @class core.component.signal.start
   * @implement core.component.signal
   * @mixin core.config
   * @static
   * @alias feature.signal
   * @private
   */

  /**
   * @method constructor
   * @inheritdoc
   * @localdoc Transitions the component {@link core.component.emitter#property-phase} to `started`
   */

  return function () {
    var me = this;
    var args = arguments;

    return when(initialize.apply(me, args), function (phase) {
      var _args;

      if (phase === INITIALIZED) {
        // Let `me[PHASE]` be `START`
        me[PHASE] = START;

        // Let `_args` be `[ SIG_START ]`
        // Push `args` on `_args`
        ARRAY_PUSH.apply(_args = [ SIG_START ], args);

        return me
          .emit.apply(me, _args)
          .then(function () {
            /*eslint no-return-assign:0*/

            // Let `me[PHASE]` be `STARTED`
            return me[PHASE] = STARTED;
          });
      }
      else {
        return phase;
      }
    });
  };
});

/**
 * @license MIT http://troopjs.mit-license.org/
 */
define('troopjs-core/component/signal/stop',[
  "./start",
  "../../config",
  "when/when"
], function (start, config, when) {
  

  var ARRAY_PUSH = Array.prototype.push;
  var PHASE = "phase";
  var STARTED = config.phase.started;
  var STOP = config.phase.stop;
  var STOPPED = config.phase.stopped;
  var SIG_STOP = config.signal.stop;

  /**
   * @class core.component.signal.stop
   * @implement core.component.signal
   * @mixin core.config
   * @static
   * @alias feature.signal
   * @private
   */

  /**
   * @method constructor
   * @inheritdoc
   * @localdoc Transitions the component {@link core.component.emitter#property-phase} to `stopped`
   */

  return function () {
    var me = this;
    var args = arguments;

    return when(start.apply(me, args), function (phase) {
      var _args;

      if (phase === STARTED) {
        // Let `me[PHASE]` be `"stop"`
        me[PHASE] = STOP;

        // Let `_args` be `[ SIG_STOP ]`
        // Push `args` on `_args`
        ARRAY_PUSH.apply(_args = [ SIG_STOP ], args);

        return me
          .emit.apply(me, _args)
          .then(function () {
            /*eslint no-return-assign:0*/
            // Let `me[PHASE]` be `STOPPED`
            return me[PHASE] = STOPPED;
          });
      }
      else {
        return phase;
      }
    });
  };
});

/**
 * @license MIT http://troopjs.mit-license.org/
 */
define('troopjs-core/component/signal/finalize',[
  "./stop",
  "../../config",
  "when/when"
], function (stop, config, when) {
  

  var ARRAY_PUSH = Array.prototype.push;
  var PHASE = "phase";
  var STOPPED = config.phase.stopped;
  var FINALIZE = config.phase.finalize;
  var FINALIZED = config.phase.finalized;
  var SIG_FINALIZE = config.signal.finalize;

  /**
   * @class core.component.signal.finalize
   * @implement core.component.signal
   * @mixin core.config
   * @static
   * @alias feature.signal
   * @private
   */

  /**
   * @method constructor
   * @inheritdoc
   * @localdoc Transitions the component {@link core.component.emitter#property-phase} to `finalized`
   */
  return function () {
    var me = this;
    var args = arguments;

    return when(stop.apply(me, args), function (phase) {
      var _args;

      if (phase === STOPPED) {
        // Let `me[PHASE]` be `FINALIZE`
        me[PHASE] = FINALIZE;

        // Let `_args` be `[ SIG_FINALIZE ]`
        // Push `args` on `_args`
        ARRAY_PUSH.apply(_args = [ SIG_FINALIZE ], args);

        return me
          .emit.apply(me, _args)
          .then(function () {
            /*eslint no-return-assign:0*/

            // Let `me[PHASE]` be `FINALIZED`
            return me[PHASE] = FINALIZED;
          });
      }
      else {
        return phase;
      }
    });
  };
});

/**
 * @license MIT http://troopjs.mit-license.org/
 */
define('troopjs-compose/factory',[
  "./config",
  "./decorator",
  "mu-getargs/main"
], function (config, Decorator, getargs) {
  

  /**
   * The factory module establishes the fundamental object composition in TroopJS:
   *
   *  - **First-class mixin** based on prototype, that supports deterministic multiple inheritance that:
   *    - Eliminating the frustrating issues from multi-tiered, single-rooted ancestry;
   *    - Avoid occasionally unexpected modification from prototype chain, from the prototype-based inheritance;
   *    - Reduced the function creation overhead in classical inheritance pattern;
   *  - **Advice decorator** for method overriding without the need for super call;
   *  - **Declarative** "special" functions that never overrides parent ones reserved for event emission
   *
   * Basically Factory takes objects or constructors as arguments and returns a new constructor, the arguments are
   * composed from left to right, later arguments taken precedence (overriding) former arguments,
   * and any functions be executed on construction from left to right.
   *
   *  		// Define the constructor.
   *  		var MyClass = Factory(function() {
   *  			// initialize the object...
   *  			this.baz = "quz";
   *  		},
   *  		{
   *  			foo: "bar",
   *  			do: function(){
   *  				return "work";
   *  			},
   *
   *  			// a special handler for "signal" type with value "foo".
   *  			"signal/foo": function() {}
   *
   *  		});
   *
   *  		var MyBehavior =  Factory({
   *  			somethingElse: function(){}
   *  		});
   *
   *  		// SubClass extends from MyClass and mixin MyBehavior
   *  		var SubClass = MyClass.extend(function() {
   *  			// initialize the object...
   *  		},
   *
   *  		MyBehavior,
   *  		{
   *  			// Overwrite parent.
   *  			foo: "baz",
   *
   *  			// Override parent with after call.
   *  			do: Factory.after(function(retval) {
   *  				return retval + "," + "play";
   *  			}),
   *
   *  			move: function(){}
   *  		});
   *
   *  		// Instantiate the subClass.
   *  		var instance = SubClass.create({
   *  			evenMore: function(){}
   *  		});
   *
   *  		// "baz"
   *  		instance.foo;
   *
   *  		// "quz"
   *  		instance.baz;
   *
   *  		// "work play"
   *  		instance.do();
   *
   *  		instance.somethingElse();
   *  		instance.evenMore();
   *
   * @class compose.factory
   * @mixin compose.config
   * @static
   */

  var UNDEFINED;
  var NULL = null;
  var PROTOTYPE = "prototype";
  var TOSTRING = "toString";
  var ARRAY_PROTO = Array[PROTOTYPE];
  var ARRAY_PUSH = ARRAY_PROTO.push;
  var ARRAY_UNSHIFT = ARRAY_PROTO.unshift;
  var ARRAY_SLICE = ARRAY_PROTO.slice;
  var OBJECT_TOSTRING = Object[PROTOTYPE][TOSTRING];
  var TYPEOF_FUNCTION = "function";
  var DISPLAYNAME = "displayName";
  var LENGTH = "length";
  var EXTEND = "extend";
  var CREATE = "create";
  var DECORATE = "decorate";
  var CONSTRUCTOR = "constructor";
  var CONSTRUCTORS = "constructors";
  var SPECIALS = "specials";
  var GROUP = "group";
  var VALUE = "value";
  var ARGS = "args";
  var TYPE = "type";
  var TYPES = "types";
  var NAME = "name";
  var PRAGMAS = config.pragmas;
  var PATTERN = config[SPECIALS];

  /**
   * Instantiate immediately after extending this constructor from multiple others constructors/objects.
   * @method create
   * @static
   * @param {...(Function|Object)} composition One or more constructors or objects to be mixed in.
   * @return {compose.composition} Object instance created out of the composition of constructors and objects.
   */
  function create () {
    return extend.apply(this, arguments)();
  }

  function extend () {
    var args = [ this ];
    ARRAY_PUSH.apply(args, arguments);
    return Factory.apply(NULL, args);
  }

  function unique () {
    /*eslint no-labels:0, block-scoped-var:0, no-return-assign:0*/
    var me = this;
    var o;
    var i;
    var j;
    var k;
    var length;

    outer: for (i = k = 0, length = me[LENGTH]; i < length; i++) {
      o = me[i];

      for (j = 0; j < i; j++) {
        if (o === me[j]) {
          continue outer;
        }
      }

      me[k++] = o;
    }

    return me[LENGTH] = k;
  }

  function ConstructorToString () {
    var me = this;
    var prototype = me[PROTOTYPE];

    return DISPLAYNAME in prototype
      ? prototype[DISPLAYNAME]
      : OBJECT_TOSTRING.call(me);
  }

  /**
   * Create a new constructor or to extend an existing one from multiple others constructors/objects.
   * @method constructor
   * @static
   * @param {...(Function|Object)} composition One or more constructors or objects to be mixed in.
   * @return {compose.composition} Object class created out of the composition of constructors and objects.
   */
  function Factory () {
    var special;
    var specials = [];
    var specialsLength;
    var arg;
    var args = ARRAY_SLICE.call(arguments);
    var argsLength = args[LENGTH];
    var constructors = [];
    var constructorsLength;
    var name;
    var nameRaw;
    var names;
    var namesLength;
    var i;
    var j;
    var k;
    var pragma;
    var replace;
    var groups = specials[TYPES] = [];
    var group;
    var types;
    var type;
    var matches;
    var value;
    var descriptor;
    var prototype = {};
    var prototypeDescriptors = {};
    var constructorDescriptors = {};

    // Iterate arguments
    for (i = 0; i < argsLength; i++) {
      // Get arg
      arg = args[i];

      // If this is a function we're going to add it as a constructor candidate
      if (typeof arg === TYPEOF_FUNCTION) {
        // If this is a synthetic constructor then add (child) constructors
        if (CONSTRUCTORS in arg) {
          ARRAY_PUSH.apply(constructors, arg[CONSTRUCTORS]);
        }
        // Otherwise add as usual
        else {
          ARRAY_PUSH.call(constructors, arg);
        }

        // If we have SPECIALS then unshift arg[SPECIALS] onto specials
        if (SPECIALS in arg) {
          ARRAY_UNSHIFT.apply(specials, arg[SPECIALS]);
        }

        // Continue if this is a dead cause
        if (arg === arg[PROTOTYPE][CONSTRUCTOR]) {
          continue;
        }

        // Arg is now arg prototype
        arg = arg[PROTOTYPE];
      }

      // Get arg names
      names = Object.getOwnPropertyNames(arg);

      // Iterate names
      for (j = 0, namesLength = names[LENGTH]; j < namesLength; j++) {
        // Get name
        name = nameRaw = names[j];

        // Iterate PRAGMAS
        for (k = 0; k < PRAGMAS[LENGTH]; k++) {
          // Get pragma
          pragma = PRAGMAS[k];

          // Process name with pragma, break if replacement occurred
          if ((name = name.replace(pragma.pattern, typeof (replace = pragma.replace) === TYPEOF_FUNCTION ? replace.bind(arg) : replace)) !== nameRaw) {
            break;
          }
        }

        // Check if this matches a SPECIAL signature
        if ((matches = PATTERN.exec(name)) !== NULL) {
          // Create special
          special = {};

          // Set special properties
          special[GROUP] = group = matches[1];
          // An optional type.
          if ((type = matches[2]) !== UNDEFINED) {
            special[TYPE] = type;
          }
          special[NAME] = group + (type ? "/" + type : "");
          special[ARGS] = getargs.call(matches[3] || "");

          // If the VALUE of the special does not duck-type Function, we should not store it
          if (OBJECT_TOSTRING.call(special[VALUE] = arg[nameRaw]) !== "[object Function]") {
            continue;
          }

          // Unshift special onto specials
          ARRAY_UNSHIFT.call(specials, special);
        }
        // Otherwise just add to prototypeDescriptors
        else {
          // Get descriptor for arg
          descriptor = Object.getOwnPropertyDescriptor(arg, nameRaw);

          // Get value
          value = descriptor[VALUE];

          // If value is instanceof Advice, we should re-describe, otherwise just use the original descriptor
          prototypeDescriptors[name] = value instanceof Decorator
            ? value[DECORATE](prototypeDescriptors[name] || {
              "enumerable": true,
              "configurable": true,
              "writable": true
            }, name, prototypeDescriptors)
            : descriptor;
        }
      }
    }

    // Define properties on prototype
    Object.defineProperties(prototype, prototypeDescriptors);

    // Reduce constructors to unique values
    constructorsLength = unique.call(constructors);

    // Reduce specials to unique values
    specialsLength = unique.call(specials);

    // Iterate specials
    for (i = 0; i < specialsLength; i++) {
      // Get special
      special = specials[i];

      // Get special properties
      group = special[GROUP];
      type = special[TYPE];
      name = special[NAME];

      // Get or create group object
      group = group in specials
        ? specials[group]
        : specials[groups[groups[LENGTH]] = group] = [];

      // Create an index for each type.
      // TODO: In the future we might want to index each nested sub type.
      if (type) {
        // Get or create types object
        types = TYPES in group
                  ? group[TYPES]
                  : group[TYPES] = [];

        // Get or create type object
        type = type in group
                 ? group[type]
                 : group[types[types[LENGTH]] = type] = specials[name] = [];

        type[type[LENGTH]] = special;
      }

      // Store special in group/type
      group[group[LENGTH]] = special;
    }

    function Constructor () {
      // Allow to be created either via 'new' or direct invocation
      var instance = this instanceof Constructor
        ? this
        : Object.create(prototype);

      var _args = arguments;
      var _i;

      // Set the constructor on instance
      Object.defineProperty(instance, CONSTRUCTOR, {
        "value": Constructor
      });

      // Iterate constructors
      for (_i = 0; _i < constructorsLength; _i++) {
        // Capture result as _args to pass to next constructor
        _args = constructors[_i].apply(instance, _args) || _args;
      }

      return instance;
    }

    // Add PROTOTYPE to constructorDescriptors
    constructorDescriptors[PROTOTYPE] = {
      "value": prototype
    };

    // Add CONSTRUCTORS to constructorDescriptors
    constructorDescriptors[CONSTRUCTORS] = {
      "value": constructors
    };

    // Add SPECIALS to constructorDescriptors
    constructorDescriptors[SPECIALS] = {
      "value": specials
    };

    constructorDescriptors[TOSTRING] = {
      "value": ConstructorToString
    };

    // Add EXTEND to constructorDescriptors
    constructorDescriptors[EXTEND] = {
      "value": extend
    };

    // Add CREATE to constructorDescriptors
    constructorDescriptors[CREATE] = {
      "value": create
    };

    // Define prototypeDescriptors on Constructor
    Object.defineProperties(Constructor, constructorDescriptors);

    // Return Constructor
    return Constructor;
  }

  // Add CREATE to factoryDescriptors
  Object.defineProperty(Factory, CREATE, {
    "value": function () {
      return Factory.apply(NULL, arguments)();
    }
  });

  return Factory;
});

/**
 * @license MIT http://troopjs.mit-license.org/
 */
define('troopjs-core/composition',[ "troopjs-compose/factory" ], function (Factory) {
  

  var INSTANCE_COUNTER = 0;
  var INSTANCE_COUNT = "instanceCount";

  /**
   * Base composition with instance count.
   * @class core.composition
   * @implement compose.composition
   */

  /**
   * Instance counter
   * @private
   * @readonly
   * @property {Number} instanceCount
   */

  /**
   * @method create
   * @static
   * @inheritable
   * @inheritdoc
   * @return {core.composition} Instance of this class
   */

  /**
   * @method extend
   * @static
   * @inheritable
   * @inheritdoc
   * @return {core.composition} The extended subclass
   */

  /**
   * Creates a new component instance
   * @method constructor
   */
  return Factory(function () {
    this[INSTANCE_COUNT] = ++INSTANCE_COUNTER;
  }, {
    /**
     * The hierarchical namespace for this component that indicates it's functionality.
     * @protected
     * @readonly
     * @property {String}
     */
    "displayName": "core/composition",

    /**
     * Gives string representation of this component instance.
     * @return {String} {@link #displayName}`@`{@link #instanceCount}
     * @protected
     */
    "toString": function () {
      var me = this;

      return me.displayName + "@" + me[INSTANCE_COUNT];
    }
  });
});

/**
 * @license MIT http://troopjs.mit-license.org/
 */
define('troopjs-core/emitter/executor',[
  "../config",
  "when/when"
], function (config, when) {
  

  /**
   * @class core.emitter.executor
   * @mixin Function
   * @private
   * @static
   * @alias feature.executor
   */

  var UNDEFINED;
  var CALLBACK = config.emitter.callback;
  var SCOPE = config.emitter.scope;
  var HEAD = config.emitter.head;
  var NEXT = config.emitter.next;

  /**
   * Executes an emission
   * @method constructor
   * @param {Object} event Event object
   * @param {Object} handlers List of handlers
   * @param {*[]} [args] Handler arguments
   * @localdoc
   * - Executes event handlers asynchronously passing each handler `args`.
   *
   * @return {*} Array of handler results
   */
  return function (event, handlers, args) {
    var _handlers = [];
    var _handlersCount = 0;
    var callback = event[CALLBACK];
    var scope = event[SCOPE];
    var handler;

    for (handler = handlers[HEAD]; handler !== UNDEFINED; handler = handler[NEXT]) {
      if (callback && handler[CALLBACK] !== callback) {
        continue;
      }

      if (scope && handler[SCOPE] !== scope) {
        continue;
      }

      _handlers[_handlersCount++] = handler;
    }

    return when.reduce(_handlers, function (results, _handler, index) {
      return when(_handler.handle(args), function (result) {
        results[index] = result;
      })
        .yield(results);
    }, _handlers);
  };
});

/**
 * @license MIT http://troopjs.mit-license.org/
 */
define('troopjs-core/emitter/composition',[
  "mu-emitter/main",
  "../composition",
  "../config",
  "./executor",
  "troopjs-compose/decorator/from",
  "when/when"
], function (Emitter, Composition, config, executor, from) {
  

  /**
   * This event module is heart of all TroopJS event-based whistles, from the API names it's aligned with Node's events module,
   * while behind the regularity it's powered by a highly customizable **event executor** mechanism.
   *
   * @class core.emitter.composition
   * @extend core.composition
   */

  var EXECUTOR = config.emitter.executor;
  var HANDLERS = config.emitter.handlers;

  /**
   * Event executor
   * @private
   * @readonly
   * @property {core.emitter.executor} executor
   */

  /**
   * Event handlers
   * @protected
   * @readonly
   * @property {Object} handlers Object where the key represents the event type and the value is a list of {@link core.emitter.handler handlers} for that type.
   */

  /**
   * @method constructor
   * @inheritdoc
   */
  return Composition.extend(function () {
    this[HANDLERS] = {};
  }, function (key, value) {
    var me = this;
    me[key] = value;
    return me;
  }.call({
    "displayName": "core/emitter/composition",

    /**
     * Adds a listener for the specified event type.
     * @method
     * @param {String} type The event type to subscribe to.
     * @param {Function|Object} callback The event callback to add. If callback is a function defaults from below will be used:
     * @param {Function} callback.callback Callback method.
     * @param {Object} [callback.scope=this] Callback scope.
     * @param {Number} [callback.limit=0] Callback limit.
     * @param {*} [data] Handler data
     * @returns {core.emitter.handler} Handler that was added.
     */
    "on": from(Emitter),

    /**
     * Remove callback(s) from a subscribed event type, if no callback is specified,
     * remove all callbacks of this type.
     * @method
     * @param {String} type The event type subscribed to
     * @param {Function|Object} [callback] The event callback to remove. If callback is a function scope will be this, otherwise:
     * @param {Function} [callback.callback] Callback method to match.
     * @param {Object} [callback.scope=this] Callback scope to match.
     * @returns {core.emitter.handler[]} Handlers that were removed.
     */
    "off": from(Emitter),

    /**
     * Adds a listener for the specified event type exactly once.
     * @method
     * @inheritdoc #on
     */
    "one": from(Emitter),

    /**
     * Trigger an event which notifies each of the listeners of their subscribing,
     * optionally pass data values to the listeners.
     *
     *  A sequential runner, is the default runner for this module, in which all handlers are running
     *  with the same argument data specified by the {@link #emit} function.
     *  Each handler will wait for the completion for the previous one if it returns a promise.
     *
     * @method
     * @param {String|Object} event The event type to emit, or an event object
     * @param {String} [event.type] The event type name.
     * @param {Function} [event.runner] The runner function that determinate how the handlers are executed, overrides the
     * default behaviour of the event emitting.
     * @param {...*} [args] Data params that are passed to the listener function.
     * @return {*} Result returned from runner.
     */
    "emit": from(Emitter)
  }, EXECUTOR, executor));
});

/**
 * @license MIT http://troopjs.mit-license.org/
 */
define('troopjs-core/component/executor',[ "../config" ], function (config) {
  

  /**
   * @class core.component.executor
   * @mixin Function
   * @private
   * @static
   * @alias feature.executor
   */

  var UNDEFINED;
  var FALSE = false;
  var HEAD = config.emitter.head;
  var NEXT = config.emitter.next;
  var CALLBACK = config.emitter.callback;
  var SCOPE = config.emitter.scope;

  /**
   * @method constructor
   * @inheritdoc core.emitter.executor#constructor
   * @localdoc
   * - Executes event handlers synchronously passing each handler `args`.
   * - Anything returned from a handler except `undefined` will be stored as `result`
   * - If a handler returns `undefined` the current `result` will be kept
   * - If a handler returns `false` no more handlers will be executed.
   *
   * @return {*} Stored `result`
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

    // Reduce and return
    return _handlers.reduce(function (current, _handler) {
      var result = current !== FALSE
        ? _handler.handle(args)
        : current;

      return result === UNDEFINED
        ? current
        : result;
    }, UNDEFINED);
  };
});

/**
 * @license MIT http://troopjs.mit-license.org/
 */
define('troopjs-core/registry/emitter',[
  "../emitter/composition",
  "../config",
  "../component/executor"
], function (Emitter, config, executor) {
  

  /**
   * A light weight implementation to register key/value pairs by key and index
   * @class core.registry.emitter
   * @extend core.emitter.composition
   */

  var LENGTH = "length";
  var INDEX = "index";
  var OBJECT_TOSTRING = Object.prototype.toString;
  var TOSTRING_REGEXP = "[object RegExp]";
  var SIG_REGISTER = config.signal.register;
  var SIG_UNREGISTER = config.signal.unregister;
  var EXECUTOR = config.emitter.executor;

  /**
   * Register signal
   * @event sig/register
   * @localdoc Triggered when something is registered via {@link #register}.
   * @since 3.0
   * @param {String} key
   * @param {*} value
   */

  /**
   * Un-register signal
   * @event sig/unregister
   * @localdoc Triggered when something is un-registered via {@link #unregister}.
   * @since 3.0
   * @param {String} key
   * @param {*} value
   */

  /**
   * @method constructor
   * @inheritdoc
   */
  return Emitter.extend(function () {
    /**
     * Registry index
     * @private
     * @readonly
     */
    this[INDEX] = {};
  }, function (key, value) {
    var me = this;
    me[key] = value;
    return me;
  }.call({
    "displayName": "core/registry/emitter",

    /**
     * Gets value by key
     * @param {String|RegExp} [key] key to filter by
     *  - If `String` get value exactly registered for key.
     *  - If `RegExp` get value where key matches.
     *  - If not provided all values registered are returned
     * @return {*|*[]} result(s)
     */
    "get": function (key) {
      var index = this[INDEX];
      var result;

      if (arguments[LENGTH] === 0) {
        result = Object
          .keys(index)
          .map(function (_key) {
            return index[_key];
          });
      }
      else if (OBJECT_TOSTRING.call(key) === TOSTRING_REGEXP) {
        result = Object
          .keys(index)
          .filter(function (_key) {
            return key.test(_key);
          }).map(function (_key) {
            return index[_key];
          });
      }
      else {
        result = index[key];
      }

      return result;
    },

    /**
     * Registers value with key
     * @param {String} key Key
     * @param {*} value Value
     * @fires sig/register
     * @return {*} value registered
     */
    "register": function (key, value) {
      var me = this;
      var index = me[INDEX];

      if (index[key] !== value) {

        if (index.hasOwnProperty(key)) {
          me.unregister(key);
        }

        me.emit(SIG_REGISTER, key, index[key] = value);
      }

      return value;
    },

    /**
     * Un-registers key
     * @param {String} key Key
     * @fires sig/unregister
     * @return {*} value unregistered
     */
    "unregister": function (key) {
      var me = this;
      var index = me[INDEX];
      var value;

      if (index.hasOwnProperty(key)) {

        value = index[key];

        if (delete index[key]) {
          me.emit(SIG_UNREGISTER, key, value);
        }
      }

      return value;
    }
  }, EXECUTOR, executor));
});

/**
 * @license MIT http://troopjs.mit-license.org/
 */
define('troopjs-core/component/registry',[ "../registry/emitter" ], function (Registry) {
  

  /**
   * @class core.component.registry
   * @extend core.registry.emitter
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

  return Registry.create({
    "displayName": "core/component/registry"
  });
});

/**
 * @license MIT http://troopjs.mit-license.org/
 */
define('troopjs-core/task/registry',[ "../registry/emitter" ], function (Registry) {
  

  /**
   * @class core.task.registry
   * @extend core.registry.emitter
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

  return Registry.create({
    "displayName": "core/task/registry"
  });
});

/**
 * @license MIT http://troopjs.mit-license.org/
 */
define('troopjs-core/task/factory',[
  "./registry",
  "when/when"
], function (registry, when) {
  

  /**
   * @class core.task.factory
   * @mixin Function
   * @static
   */

  var TASK_COUNTER = 0;

  /**
   * Creates and registers a task
   * @method constructor
   * @param {Promise|Function} promiseOrResolver The task resolver.
   * @param {String} [name=task] Task name
   * @return {Promise}
   */
  return function (promiseOrResolver, name) {
    // Get promise
    var promise = when.isPromiseLike(promiseOrResolver)
      ? when(promiseOrResolver)
      : when.promise(promiseOrResolver);

    // Create key
    var key = (name || "task") + "@" + ++TASK_COUNTER;

    // Ensure un-registration
    // Register task
    // Return
    return registry.register(key, promise.ensure(function () {
      registry.unregister(key);
    }));
  };
});

/**
 * @license MIT http://troopjs.mit-license.org/
 */
define('troopjs-core/component/emitter',[
  "../emitter/composition",
  "../config",
  "./registry",
  "./executor",
  "../task/factory",
  "mu-merge/main",
  "troopjs-compose/decorator/around"
], function (Emitter, config, registry, executor, taskFactory, merge, around) {
  

  /**
   * Component emitter
   * @class core.component.emitter
   * @extend core.emitter.composition
   * @mixin core.config
   * @alias feature.component
   */

  var UNDEFINED;
  var FALSE = false;
  var EXECUTOR = config.emitter.executor;
  var HANDLERS = config.emitter.handlers;
  var HEAD = config.emitter.head;
  var TAIL = config.emitter.tail;
  var SIG_SETUP = config.signal.setup;
  var SIG_ADD = config.signal.add;
  var SIG_ADDED = config.signal.added;
  var SIG_REMOVE = config.signal.remove;
  var SIG_REMOVED = config.signal.removed;
  var SIG_TEARDOWN = config.signal.teardown;
  var SIG_TASK = config.signal.task;
  var PHASE = "phase";
  var NAME = "name";
  var TYPE = "type";
  var VALUE = "value";
  var ON = "on";
  var ONE = "one";
  var SIG = "sig";
  var SIG_PATTERN = new RegExp("^" + SIG + "/(.+)");

  /**
   * Current lifecycle phase
   * @protected
   * @readonly
   * @property {core.config.phase} phase
   */

  /**
   * Setup signal
   * @event sig/setup
   * @localdoc Triggered when the first event handler of a particular type is added via {@link #method-on}.
   * @since 3.0
   * @preventable
   * @param {Object} handlers
   * @param {String} type
   * @param {Function} callback
   * @param {*} [data]
   */

  /**
   * Add signal
   * @event sig/add
   * @localdoc Triggered before an event handler of a particular type is added via {@link #method-on}.
   * @since 3.0
   * @preventable
   * @param {Object} handlers
   * @param {String} type
   * @param {Function} callback
   * @param {*} [data]
   */

  /**
   * Added signal
   * @event sig/added
   * @localdoc Triggered when a event handler of a particular type is added via {@link #method-on}.
   * @since 3.0
   * @param {Object} handlers The list of handlers the handler was added to.
   * @param {core.emitter.handler} handler The handler that was just added.
   */

  /**
   * Remove signal
   * @event sig/remove
   * @localdoc Triggered before an event handler of a particular type is removed via {@link #method-off}.
   * @since 3.0
   * @preventable
   * @param {Object} handlers
   * @param {String} type
   * @param {Function} callback
   */

  /**
   * Removed signal
   * @event sig/removed
   * @localdoc Triggered when a event handler of a particular type is removed via {@link #method-off}.
   * @since 3.0
   * @param {Object} handlers The list of handlers the handler was removed from.
   * @param {core.emitter.handler} handler The handler that was just removed.
   */

  /**
   * Teardown signal
   * @event sig/teardown
   * @localdoc Triggered when the last event handler of type is removed for a particular type via {@link #method-off}.
   * @since 3.0
   * @preventable
   * @param {Object} handlers
   * @param {String} type
   * @param {Function} callback
   */

  /**
   * Initialize signal
   * @event sig/initialize
   * @localdoc Triggered when this component enters the initialize {@link #property-phase}
   * @param {...*} [args] Initialize arguments
   */

  /**
   * Start signal
   * @event sig/start
   * @localdoc Triggered when this component enters the start {@link #property-phase}
   * @param {...*} [args] Initialize arguments
   */

  /**
   * Stop signal
   * @event sig/stop
   * @localdoc Triggered when this component enters the stop {@link #property-phase}
   * @param {...*} [args] Stop arguments
   */

  /**
   * Finalize signal
   * @event sig/finalize
   * @localdoc Triggered when this component enters the finalize {@link #property-phase}
   * @param {...*} [args] Finalize arguments
   */

  /**
   * Task signal
   * @event sig/task
   * @localdoc Triggered when this component starts a {@link #method-task}.
   * @param {Promise} task Task
   * @param {String} name Task name
   * @return {Promise}
   */

  /**
   * Handles the component start
   * @handler sig/start
   * @inheritdoc #event-sig/start
   * @template
   * @return {Promise}
   */

  /**
   * Handles the component stop
   * @handler sig/stop
   * @inheritdoc #event-sig/stop
   * @template
   * @return {Promise}
   */

  /**
   * Handles an event setup
   * @handler sig/setup
   * @inheritdoc #event-sig/setup
   * @template
   * @return {*|Boolean}
   */

  /**
   * Handles an event add
   * @handler sig/add
   * @inheritdoc #event-sig/add
   * @template
   * @return {*|Boolean}
   */

  /**
   * Handles an event remove
   * @handler sig/remove
   * @inheritdoc #event-sig/remove
   * @template
   * @return {*|Boolean}
   */

  /**
   * Handles an event teardown
   * @handler sig/teardown
   * @inheritdoc #event-sig/teardown
   * @template
   * @return {*|Boolean}
   */

  /**
   * @method one
   * @inheritdoc
   * @localdoc Adds support for {@link #event-sig/setup} and {@link #event-sig/add}.
   * @fires sig/setup
   * @fires sig/add
   */

  /**
   * @method constructor
   * @inheritdoc
   */
  return Emitter.extend(function () {
    var me = this;
    var specials = me.constructor.specials;

    // Set initial phase to `UNDEFINED`
    me[PHASE] = UNDEFINED;

    // Iterate SIG specials
    if (specials.hasOwnProperty(SIG)) {
      specials[SIG].forEach(function (special) {
        me.on(special[NAME], special[VALUE]);
      });
    }
  }, {
    "displayName": "core/component/base",

    /**
     * Handles the component initialization.
     * @inheritdoc #event-sig/initialize
     * @localdoc Registers event handlers declared ON specials
     * @handler
     * @return {Promise}
     */
    "sig/initialize": function () {
      var me = this;
      var specials = me.constructor.specials;

      // Register component
      registry.register(me.toString(), me);

      // Initialize ON specials
      if (specials.hasOwnProperty(ON)) {
        specials[ON].forEach(function (special) {
          me.on(special[TYPE], special[VALUE]);
        });
      }

      // Initialize ONE specials
      if (specials.hasOwnProperty(ONE)) {
        specials[ONE].forEach(function (special) {
          me.one(special[TYPE], special[VALUE]);
        });
      }
    },

    /**
     * Handles the component finalization.
     * @inheritdoc #event-sig/finalize
     * @localdoc Un-registers all handlers
     * @handler
     * @return {Promise}
     */
    "sig/finalize": function () {
      var me = this;

      // Un-register component
      registry.unregister(me.toString(), me);

      // Finalize all handlers
      Object
        .keys(me[HANDLERS])
        .forEach(function (type) {
          me.off(type);
        });
    },

    /**
     * @method
     * @inheritdoc
     * @localdoc Adds support for {@link #event-sig/setup}, {@link #event-sig/add} and {@link #event-sig/added}.
     * @fires sig/setup
     * @fires sig/add
     * @fires sig/added
     */
    "on": around(function (fn) {
      return function (type, callback, data) {
        var me = this;
        var handlers = me[HANDLERS];
        var event;
        var result;
        var _handlers;

        // If this type is NOT a signal we don't have to event try ...
        if (!SIG_PATTERN.test(type)) {
          // Get or initialize the handlers for this type
          if (handlers.hasOwnProperty(type)) {
            _handlers = handlers[type];
          }
          else {
            _handlers = {};
            _handlers[TYPE] = type;
          }

          // Initialize event
          event = {};
          event[EXECUTOR] = executor;

          // If this is the first handler signal SIG_SETUP
          if (!_handlers.hasOwnProperty(HEAD)) {
            event[TYPE] = SIG_SETUP;
            result = me.emit(event, _handlers, type, callback, data);
          }

          // If we were not interrupted
          if (result !== FALSE) {
            // Signal SIG_ADD
            event[TYPE] = SIG_ADD;
            result = me.emit(event, _handlers, type, callback, data);

            // If we were not interrupted
            if (result !== FALSE) {
              // If `type` is not in `handlers` put it there
              if (!handlers.hasOwnProperty(type)) {
                handlers[type] = _handlers;
              }

              // Call `super.on`
              result = fn.call(me, type, callback, data);

              // Signal SIG_ADDED
              event[TYPE] = SIG_ADDED;
              me.emit(event, _handlers, result);
            }
          }
        }
        // .. just call `super.on`
        else {
          result = fn.call(me, type, callback, data);
        }

        // Return `result`
        return result;
      };
    }),

    /**
     * @method
     * @inheritdoc
     * @localdoc Adds support for {@link #event-sig/remove}, {@link #event-sig/removed} and {@link #event-sig/teardown}.
     * @fires sig/remove
     * @fires sig/removed
     * @fires sig/teardown
     */
    "off": around(function (fn) {
      return function (type, callback) {
        var me = this;
        var handlers = me[HANDLERS];
        var event;
        var result;
        var _handlers;

        if (!SIG_PATTERN.test(type)) {
          // Get or initialize the handlers for this type
          if (handlers.hasOwnProperty(type)) {
            _handlers = handlers[type];
          }
          else {
            _handlers = {};
            _handlers[TYPE] = type;
          }

          // Initialize event
          event = {};
          event[EXECUTOR] = executor;

          // Signal SIG_REMOVE
          event[TYPE] = SIG_REMOVE;
          result = me.emit(event, _handlers, type, callback);

          // If we were not interrupted
          if (result !== FALSE) {
            // If this is the last handler signal SIG_TEARDOWN
            if (_handlers[HEAD] === _handlers[TAIL]) {
              event[TYPE] = SIG_TEARDOWN;
              result = me.emit(event, _handlers, type, callback);
            }

            // If we were not interrupted
            if (result !== FALSE) {
              // If `type` is not in `handlers` put it there
              if (!handlers.hasOwnProperty(type)) {
                handlers[type] = _handlers;
              }

              // Call `super.off`
              result = fn.call(me, type, callback);

              // Signal SIG_REMOVED
              event[TYPE] = SIG_REMOVED;
              result.forEach(function (handler) {
                me.emit(event, _handlers, handler);
              });
            }
          }
        }
        // ... just call `super.off`
        else {
          result = fn.call(me, type, callback);
        }

        // Return `result`
        return result;
      };
    }),

    /**
     * @inheritdoc core.task.factory#constructor
     * @fires sig/task
     */
    "task": function (promiseOrResolver, name) {
      var me = this;

      // Create task
      var task = taskFactory.call(me, promiseOrResolver, name);

      // Signal `SIG_TASK` and yield `task`
      return me.emit(SIG_TASK, task, name).yield(task);
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

        // Return early if `_scope` has `PHASE` _and_ `_scope[PHASE]` is `UNDEFINED` or matches a skipped phase
        if (_scope.hasOwnProperty(PHASE) && (_scope[PHASE] === UNDEFINED || SKIP.test(_scope[PHASE]))) {
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
define('troopjs-hub/component',[
  "troopjs-core/component/emitter",
  "./config",
  "./emitter",
  "when/when"
], function (Emitter, config, emitter, when) {
  

  /**
   * Component that provides hub features.
   * @class hub.component
   * @extend core.component.emitter
   * @mixin hub.config
   * @alias feature.component
   */

  var UNDEFINED;
  var NULL = null;
  var TRUE = true;
  var DATA = config.emitter.data;
  var ARGS = "args";
  var NAME = "name";
  var TYPE = "type";
  var VALUE = "value";
  var HUB = "hub";
  var RE = new RegExp("^" + HUB + "/(.+)");

  /**
   * @handler sig/start
   * @localdoc Triggers memorized values on HUB specials
   * @inheritdoc
   */

  /**
   * @handler sig/added
   * @localdoc Registers subscription on the {@link hub.emitter hub emitter} for matching callbacks
   * @inheritdoc #event-sig/added
   */

  /**
   * @handler sig/removed
   * @localdoc Removes remote subscription from the {@link hub.emitter hub emitter} that was previously registered in {@link #handler-sig/added}
   * @inheritdoc #event-sig/removed
   */

  /**
   * @method constructor
   * @inheritdoc
   */
  return Emitter.extend(function () {
    var me = this;
    var memorized = [];

    // Intercept added handlers
    me.on("sig/added", function (handlers, handler) {
      var _empty = {};
      var _matches;
      var _type;
      var _memory;

      // If we've added a HUB handler ...
      if ((_matches = RE.exec(handler[TYPE])) !== NULL) {
        // Let `_type` be `_matches[1]`
        _type = _matches[1];

        // Let `handler[HUB]` be `_type`
        handler[HUB] = _type;

        // Subscribe to the hub
        emitter.on(_type, handler);

        // If re-emit was requested ...
        if (handler[DATA] === TRUE) {
          // If memorization is "open"
          if (memorized !== UNDEFINED) {
            memorized.push(handler);
          }
          // .. otherwise try to `emit` if `emitter` memory for `_type` is not `_empty`
          else if ((_memory = emitter.peek(_type, _empty)) !== _empty) {
            me.emit.apply(me, [ handler ].concat(_memory));
          }
        }
      }
    });

    // Intercept removed handlers
    me.on("sig/removed", function (handlers, handler) {
      var _matches;

      // If we've removed a HUB callback ...
      if ((_matches = RE.exec(handler[TYPE])) !== NULL) {

        // Unsubscribe from the hub
        emitter.off(_matches[1], handler);

        // If re-emit was requested and there are `memorized` callbacks ...
        if (handler[DATA] === TRUE && memorized !== UNDEFINED) {
          // TODO in place filtering for performance
          // Filter matching `_handler`
          memorized = memorized.filter(function (_handler) {
            return _handler !== handler;
          });
        }
      }
    });

    // Intercept component start
    me.on("sig/start", function () {
      return when
        // Map `memorized` ...
        .map(memorized, function (_handler) {
          var _memory;
          var _empty = {};

          // If `emitter` memory for `_handler[HUB]` is not `_empty` re-emit ...
          return (_memory = emitter.peek(_handler[HUB], _empty)) !== _empty
            ? me.emit.apply(me, [ _handler ].concat(_memory))
            : UNDEFINED;
        })
        // ... and reset to `UNDEFINED`
        .tap(function () {
          memorized = UNDEFINED;
        });
    });

  }, {
    "displayName": "hub/component",

    /**
     * @inheritdoc
     * @localdoc Registers event handlers declared HUB specials
     * @handler
     */
    "sig/initialize": function () {
      var me = this;
      var specials = me.constructor.specials;

      if (specials.hasOwnProperty(HUB)) {
        specials[HUB].forEach(function (special) {
          me.on(special[NAME], special[VALUE], special[ARGS][0]);
        });
      }
    }
  });
});

/**
 * @license MIT http://troopjs.mit-license.org/
 */
define('troopjs-dom/config',[
  "troopjs-core/config",
  "module",
  "mu-merge/main"
], function (config, module, merge) {
  

  /**
   * @class dom.config.signal
   * @extends core.config.signal
   * @private
   */
  var SIGNAL = {
    /**
     * Signal emitted when component renders.
     */
    "render": "sig/render"
  };

  /**
   * DOM component configuration
   * @class dom.config
   * @extends core.config
   * @private
   * @alias feature.config
   */

  return merge.call({}, config, {
     /**
     * @cfg {dom.config.signal}
     * @inheritdoc
     * @protected
     */
    "signal": SIGNAL
  }, module.config());
});

/**
 * @license MIT http://troopjs.mit-license.org/
 */
define('troopjs-dom/executor',[
  "mu-selector-set/main",
  "jquery"
], function (SelectorSet, $) {
  

  /**
   * @class dom.executor
   * @mixin Function
   * @private
   * @static
   * @alias feature.executor
   */

  var UNDEFINED;
  var FALSE = false;
  var LEFT_BUTTON = 0;

  function map (match) {
    return match[1];
  }

  // Use `$.find.matchesSelector` for wider browser support
  SelectorSet.prototype.matchesSelector = $.find.matchesSelector;

  /**
   * @method constructor
   * @inheritdoc core.emitter.executor#constructor
   * @localdoc
   * - Executes handlers synchronously passing each handler `args`.
   * - If a handler returns `false` no more handlers will be executed.
   * - If a handler stops propagation no more handlers will be executed.
   *
   * @return {*} Result from last handler
   */
  return function (event, handlers, args) {
    var result = UNDEFINED;
    var direct = handlers.direct;
    var delegated = handlers.delegated;

    var $event = args[0];
    var $delegate = $event.delegateTarget;
    var $target = $event.target;
    var $document = $target.ownerDocument;
    var $notClick = $event.type !== "click";

    // Bubble the event up the dom if
    // ... this is not a black-holed element (jQuery #13180)
    // ... and this is the left button or it's a not a click event (jQuery #3861)
    var $bubble = $target.nodeType !== UNDEFINED && ($event.button === LEFT_BUTTON || $notClick);


    function reduce (_result, handler) {
      // If immediate propagation is stopped we should just return last _result
      if ($event.isImmediatePropagationStopped()) {
        return _result;
      }

      // If the previous handler return false we should stopPropagation and preventDefault
      if (_result === FALSE) {
        $event.stopPropagation();
        $event.preventDefault();
      }

      return handler.handle(args);
    }

    // Loop ...
    do {
      // Don't process clicks on disabled elements (jQuery #6911, #8165, #11382, #11764)
      if ($target.disabled !== true || $notClick) {
        // Run delegated handlers which match this element
        result = delegated
          .matches($event.currentTarget = $target)
          .map(map)
          .reduce(reduce, result);
      }

      // Bubble if ...
      $bubble = $bubble
        // ... we were not told to stop propagation
        && !$event.isPropagationStopped()
        // ... we are not at the delegate element
        && $target !== $delegate
        // ... we have a parent node
        && ($target = $target.parentNode) !== null
        // ... the new target is not the document
        && $target !== $document;
    }
    // ... while we are still bubbling
    while ($bubble);

    // Run all the direct (non-delegated) handlers of the root element
    if (result !== FALSE) {
      result = direct.reduce(reduce, result);
    }

    return result;
  };
});

/**
 * @license MIT http://troopjs.mit-license.org/
 */
define('troopjs-dom/error',[ "mu-error/factory" ], function (Factory) {
  

  /**
   * DOM error
   * @class dom.error
   * @extend Error
   * @alias feature.error
   */

  return Factory("DOMError");
});

/**
 * @license MIT http://troopjs.mit-license.org/
 */
define('troopjs-dom/component',[
  "troopjs-core/component/emitter",
  "./config",
  "./executor",
  "./error",
  "troopjs-compose/decorator/before",
  "jquery",
  "when/when",
  "mu-selector-set/main",
  "mu-jquery-destroy/main"
], function (Component, config, executor, DOMError, before, $, when, SelectorSet) {
  

  /**
   * Component that manages all DOM manipulation and integration.
   * @class dom.component
   * @extend core.component.emitter
   * @mixin dom.config
   * @alias feature.component
   */

  var UNDEFINED;
  var NULL = null;
  var OBJECT_TOSTRING = Object.prototype.toString;
  var TOSTRING_FUNCTION = "[object Function]";
  var $ELEMENT = "$element";
  var LENGTH = "length";
  var PROXY = "proxy";
  var DOM = "dom";
  var ARGS = "args";
  var NAME = "name";
  var VALUE = "value";
  var TYPE = config.emitter.type;
  var EXECUTOR = config.emitter.executor;
  var SCOPE = config.emitter.scope;
  var DATA = config.emitter.data;
  var DIRECT = "direct";
  var DELEGATED = "delegated";
  var SIG_RENDER = config.signal.render;
  var RE = new RegExp("^" + DOM + "/(.+)");

  function $render ($element, method, args) {
    var me = this;
    var length = args[LENGTH];

    return when(args[0], function (content) {
      var _length;
      var _args;

      // If `content` is a string we can return fast
      if (OBJECT_TOSTRING.call(content) !== TOSTRING_FUNCTION) {
        return content;
      }

      // Initialize `_length` and `_args`
      _length = length;
      _args = new Array(_length - 1);

      // Copy `args` to `_args`
      while (_length-- > 1) {
        _args[_length - 1] = args[_length];
      }

      // Return result of applying `content` on `$element` with `_args`
      return content.apply($element, _args);
    })
    .then(function (content) {
      // Let `args[0]` be `$(content)`
      // Let `$content` be `args[0]`
      var $content = args[0] = $(content);
      // Initialize `_length` and `_args`
      var _length = length;
      var _args = new Array(_length + 1);

      // Let `_args[0]` be `SIG_RENDER`
      _args[0] = SIG_RENDER;

      // Copy `args` to `_args`
      while (_length-- > 0) {
        _args[_length + 1] = args[_length];
      }

      // Determine direction of manipulation\
      switch (method) {
        case "appendTo":
        case "prependTo":
          $content[method]($element);
          break;

        default:
          $element[method]($content);
      }

      // Emit `_args`
      // Yield `args`
      return me.emit
        .apply(me, _args)
        .yield(args);
    });
  }

  /**
   * Render signal
   * @event sig/render
   * @localdoc Triggered after {@link #before}, {@link #after}, {@link #html}, {@link #text}, {@link #append}, {@link #appendTo}, {@link #prepend} and {@link #prependTo}
   * @since 3.0
   * @param {jQuery} $target Element rendered into
   * @param {...*} [args] Render arguments
   */

  /**
   * Handles component render
   * @handler sig/render
   * @template
   * @inheritdoc #event-sig/render
   * @return {Promise}
   */

  /**
   * Destroy DOM event
   * @localdoc Triggered when {@link #$element} of this widget is removed from the DOM tree.
   * @event dom/destroy
   * @param {jQuery} $event jQuery event object
   * @param {...*} [args] Event arguments
   * @preventable
   */

  /**
   * Handles widget destruction from a DOM perspective
   * @handler dom/destroy
   * @template
   * @inheritdoc #event-dom/destroy
   * @localdoc Triggered when this widget is removed from the DOM
   */

  /**
   * Renders content and replaces {@link #$element} html contents
   * @method html
   * @param {Function|String|Promise} [contentOrPromise] Contents to render or a Promise for contents
   * @param {...*} [args] Template arguments
   * @fires sig/render
   * @return {String|Promise} The returned content string or promise of rendering.
   */

  /**
   * Renders content and replaces {@link #$element} text contents
   * @method text
   * @inheritdoc #html
   * @fires sig/render
   */

  /**
   * Renders content and inserts it before {@link #$element}
   * @method before
   * @inheritdoc #html
   * @fires sig/render
   * @return {Promise} The promise of rendering.
   */

  /**
   * Renders content and inserts it after {@link #$element}
   * @method after
   * @inheritdoc #html
   * @fires sig/render
   */

  /**
   * Renders content and appends it to {@link #$element}
   * @method append
   * @inheritdoc #html
   * @fires sig/render
   */

  /**
   * Renders content and appends it to the provided $element
   * @method appendTo
   * @param {jQuery} $element Target element
   * @param {Function|String|Promise} [contentOrPromise] Contents to render or a Promise for contents
   * @param {...*} [args] Template arguments
   * @fires sig/render
   * @return {Promise} The promise of rendering.
   */

  /**
   * Renders content and prepends it to {@link #$element}
   * @method prepend
   * @inheritdoc #html
   * @fires sig/render
   */


  /**
   * Renders content and prepends it to the provided $element
   * @method prependTo
   * @inheritdoc #appendTo
   * @fires sig/render
   */
  /**
   * Creates a new component that attaches to a specified (jQuery) DOM element.
   * @method constructor
   * @param {jQuery|HTMLElement} $element The element that this component should be attached to
   * @param {String} [displayName] A friendly name for this component
   * @throws {dom.error} If no $element is provided
   */
  return Component.extend(
    function ($element, displayName) {
      var me = this;
      var length = arguments[LENGTH];
      var args = new Array(length);
      var $get;

      // No $element
      if ($element === UNDEFINED || $element === NULL) {
        throw new DOMError("No '$element' provided");
      }

      // Let `args` be `ARRAY_SLICE.call(arguments)` without deop
      while (length-- > 0) {
        args[length] = arguments[length];
      }

      // Is _not_ a jQuery element
      if (!$element.jquery) {
        // Let `$element` be `$($element)`
        // Let `args[0]` be `$element`
        args[0] = $element = $($element);
      }
      // From a different jQuery instance
      else if (($get = $element.get) !== $.fn.get) {
        // Let `$element` be `$($get.call($element, 0))`
        // Let `args[0]` be `$element`
        args[0] = $element = $($get.call($element, 0));
      }

      /**
       * jQuery element this widget is attached to
       * @property {jQuery} $element
       * @readonly
       */
      me[$ELEMENT] = $element;

      // Update `me.displayName` if `displayName` was supplied
      if (displayName !== UNDEFINED) {
        me.displayName = displayName;
      }

      // Return potentially modified `args`
      return args;
    },

    {
      "displayName": "dom/component",

      /**
       * @handler
       * @localdoc Registers event handlers that are declared as DOM specials.
       * @inheritdoc
       */
      "sig/initialize": function () {
        var me = this;
        var specials = me.constructor.specials;

        if (specials.hasOwnProperty(DOM)) {
          specials[DOM].forEach(function (special) {
            me.on(special[NAME], special[VALUE], special[ARGS][0]);
          });
        }
      },

      /**
       * @handler
       * @localdoc Registers DOM event proxies on {@link #$element}.
       * @inheritdoc
       */
      "sig/setup": function (handlers, type) {
        var me = this;
        var matches;

        // Check that this is a DOM handler
        if ((matches = RE.exec(type)) !== NULL) {
          // Create delegated and direct event stores
          handlers[DIRECT] = [];
          handlers[DELEGATED] = new SelectorSet();

          // `$element.on` `handlers[PROXY]`
          me[$ELEMENT].on(matches[1], NULL, me, handlers[PROXY] = function () {
            var length = arguments[LENGTH];
            var args = new Array(length + 1);
            var _args = args[0] = {};
            _args[TYPE] = type;
            _args[EXECUTOR] = executor;
            _args[SCOPE] = me;

            while (length > 0) {
              args[length] = arguments[--length];
            }

            // Return result of emit
            return me.emit.apply(me, args);
          });
        }
      },

      /**
       * @handler
       * @localdoc Adds handler to `handlers[DELEGATED]` or `handlers[DIRECT]` depending on `handler[DATA]`.
       * @inheritdoc #event-sig/added
       */
      "sig/added": function (handlers, handler) {
        var data;

        // Check that this is a DOM handler
        if (RE.test(handler[TYPE])) {
          data = handler[DATA];

          if (data !== UNDEFINED) {
            handlers[DELEGATED].add(data, handler);
          }
          else {
            handlers[DIRECT].push(handler);
          }
        }
      },

      /**
       * @handler
       * @localdoc Removes the DOM event proxies that are registered on {@link #$element}.
       * @inheritdoc
       */
      "sig/teardown": function (handlers, type) {
        var me = this;
        var matches;

        // Check that this is a DOM handler
        if ((matches = RE.exec(type)) !== NULL) {
          // $element.off handlers[PROXY]
          me[$ELEMENT].off(matches[1], NULL, handlers[PROXY]);
        }
      },

      /**
       * @handler
       * @localdoc Removes handle from `handlers[DELEGATED]` or `handlers[DIRECT]` depending on `handler[DATA]`.
       * @inheritdoc #event-sig/removed
       */
      "sig/removed": function (handlers, handler) {
        var data;

        // Check that this is a DOM handler
        if (RE.test(handler[TYPE])) {
          data = handler[DATA];

          if (data !== UNDEFINED) {
            handlers[DELEGATED].remove(data, handler);
          }
          else {
            handlers[DIRECT] = handlers[DIRECT].filter(function (_handler) {
              return _handler !== handler;
            });
          }
        }
      }
    },

    // Create spec for render methods targeting `me[$ELEMENT]` that can be executed without args
    [ "html", "text" ].reduce(function (spec, method) {
      // Create `spec[method]`
      spec[method] = function () {
        var me = this;
        var $element = me[$ELEMENT];
        var length = arguments[LENGTH];
        var args;
        var result;

        // If there were no arguments ...
        if (length === 0) {
          // ... call `$element[method]` without arguments ...
          result = $element[method]();
        }
        // ... otherwise ...
        else {
          // Create `args`
          args = new Array(length);

          // Let `args` be `ARRAY_SLICE.call(arguments)` without deop
          while (length-- > 0) {
            args[length] = arguments[length];
          }

          result = $render.call(me, $element, method, args);
        }

        return result;
      };

      // Return spec for next iteration
      return spec;
    }, {}),

    // Create spec for render methods targeting `me[$ELEMENT]`
    [ "before", "after", "append", "prepend" ].reduce(function (spec, method) {
      // Create `spec[method]`
      spec[method] = function () {
        var me = this;
        var length = arguments[LENGTH];
        var args = new Array(length);

        // Let `args` be `ARRAY_SLICE.call(arguments)` without deop
        while (length-- > 0) {
          args[length] = arguments[length];
        }

        return $render.call(me, me[$ELEMENT], method, args);
      };

      // Return spec for next iteration
      return spec;
    }, {}),

    // Create spec for render methods targeting provided `$element`
    [ "appendTo", "prependTo" ].reduce(function (spec, method) {
      // Create `spec[method]`
      spec[method] = function ($element) {
        var length = arguments[LENGTH];
        var args = new Array(length - 1);

        // Let `args` be `ARRAY_SLICE.call(arguments, 1)` without deop
        while (length-- > 1) {
          args[length - 1] = arguments[length];
        }

        return $render.call(this, $element, method, args);
      };

      // Return spec for next iteration
      return spec;
    }, {})
  );
});

define(['troopjs/version'], function (version) {
  return version;
});