/*!
 * CanJS - 2.0.7
 * http://canjs.us/
 * Copyright (c) 2014 Bitovi
 * Wed, 26 Mar 2014 16:12:27 GMT
 * Licensed MIT
 * Includes: CanJS default build
 * Download from: http://canjs.us/
 */
define(["can/util/library", "can/construct"], function (can) {
	// ## control.js
	// `can.Control`  
	// _Controller_

	// Binds an element, returns a function that unbinds.
	var bind = function (el, ev, callback) {

		can.bind.call(el, ev, callback);

		return function () {
			can.unbind.call(el, ev, callback);
		};
	},
		isFunction = can.isFunction,
		extend = can.extend,
		each = can.each,
		slice = [].slice,
		paramReplacer = /\{([^\}]+)\}/g,
		special = can.getObject("$.event.special", [can]) || {},

		// Binds an element, returns a function that unbinds.
		delegate = function (el, selector, ev, callback) {
			can.delegate.call(el, selector, ev, callback);
			return function () {
				can.undelegate.call(el, selector, ev, callback);
			};
		},

		// Calls bind or unbind depending if there is a selector.
		binder = function (el, ev, callback, selector) {
			return selector ?
				delegate(el, can.trim(selector), ev, callback) :
				bind(el, ev, callback);
		},

		basicProcessor;

	var Control = can.Control = can.Construct(
		/**
		 * @add can.Control
		 */
		//
		/** 
		 * @static
		 */
		{
			// Setup pre-processes which methods are event listeners.
			/**
			 * @hide
			 *
			 * Setup pre-process which methods are event listeners.
			 *
			 */
			setup: function () {

				// Allow contollers to inherit "defaults" from super-classes as it 
				// done in `can.Construct`
				can.Construct.setup.apply(this, arguments);

				// If you didn't provide a name, or are `control`, don't do anything.
				if (can.Control) {

					// Cache the underscored names.
					var control = this,
						funcName;

					// Calculate and cache actions.
					control.actions = {};
					for (funcName in control.prototype) {
						if (control._isAction(funcName)) {
							control.actions[funcName] = control._action(funcName);
						}
					}
				}
			},
			// Moves `this` to the first argument, wraps it with `jQuery` if it's an element
			_shifter: function (context, name) {

				var method = typeof name === "string" ? context[name] : name;

				if (!isFunction(method)) {
					method = context[method];
				}

				return function () {
					context.called = name;
					return method.apply(context, [this.nodeName ? can.$(this) : this].concat(slice.call(arguments, 0)));
				};
			},

			// Return `true` if is an action.
			/**
			 * @hide
			 * @param {String} methodName a prototype function
			 * @return {Boolean} truthy if an action or not
			 */
			_isAction: function (methodName) {

				var val = this.prototype[methodName],
					type = typeof val;
				// if not the constructor
				return (methodName !== 'constructor') &&
				// and is a function or links to a function
				(type === "function" || (type === "string" && isFunction(this.prototype[val]))) &&
				// and is in special, a processor, or has a funny character
				!! (special[methodName] || processors[methodName] || /[^\w]/.test(methodName));
			},
			// Takes a method name and the options passed to a control
			// and tries to return the data necessary to pass to a processor
			// (something that binds things).
			/**
			 * @hide
			 * Takes a method name and the options passed to a control
			 * and tries to return the data necessary to pass to a processor
			 * (something that binds things).
			 *
			 * For performance reasons, this called twice.  First, it is called when
			 * the Control class is created.  If the methodName is templated
			 * like: "{window} foo", it returns null.  If it is not templated
			 * it returns event binding data.
			 *
			 * The resulting data is added to this.actions.
			 *
			 * When a control instance is created, _action is called again, but only
			 * on templated actions.
			 *
			 * @param {Object} methodName the method that will be bound
			 * @param {Object} [options] first param merged with class default options
			 * @return {Object} null or the processor and pre-split parts.
			 * The processor is what does the binding/subscribing.
			 */
			_action: function (methodName, options) {

				// If we don't have options (a `control` instance), we'll run this 
				// later.  
				paramReplacer.lastIndex = 0;
				if (options || !paramReplacer.test(methodName)) {
					// If we have options, run sub to replace templates `{}` with a
					// value from the options or the window
					var convertedName = options ? can.sub(methodName, this._lookup(options)) : methodName;
					if (!convertedName) {
					
						return null;
					}
					// If a `{}` template resolves to an object, `convertedName` will be
					// an array
					var arr = can.isArray(convertedName),

						// Get the name
						name = arr ? convertedName[1] : convertedName,

						// Grab the event off the end
						parts = name.split(/\s+/g),
						event = parts.pop();

					return {
						processor: processors[event] || basicProcessor,
						parts: [name, parts.join(" "), event],
						delegate: arr ? convertedName[0] : undefined
					};
				}
			},
			_lookup: function (options) {
				return [options, window];
			},
			// An object of `{eventName : function}` pairs that Control uses to 
			// hook up events auto-magically.
			/**
			 * @property {Object.<can.Control.processor>} can.Control.processors processors
			 * @parent can.Control.static
			 *
			 * @description A collection of hookups for custom events on Controls.
			 *
			 * @body
			 * `processors` is an object that allows you to add new events to bind
			 * to on a control, or to change how existent events are bound. Each
			 * key-value pair of `processors` is a specification that pertains to
			 * an event where the key is the name of the event, and the value is
			 * a function that processes calls to bind to the event.
			 *
			 * The processor function takes five arguments:
			 *
			 * - _el_: The Control's element.
			 * - _event_: The event type.
			 * - _selector_: The selector preceding the event in the binding used on the Control.
			 * - _callback_: The callback function being bound.
			 * - _control_: The Control the event is bound on.
			 *
			 * Inside your processor function, you should bind _callback_ to the event, and
			 * return a function for can.Control to call when _callback_ needs to be unbound.
			 * (If _selector_ is defined, you will likely want to use some form of delegation
			 * to bind the event.)
			 *
			 * Here is a Control with a custom event processor set and two callbacks bound
			 * to that event:
			 *
			 * @codestart
			 * can.Control.processors.birthday = function(el, ev, selector, callback, control) {
			 *   if(selector) {
			 *     myFramework.delegate(ev, el, selector, callback);
			 *     return function() { myFramework.undelegate(ev, el, selector, callback); };
			 *   } else {
			 *     myFramework.bind(ev, el, callback);
			 *     return function() { myFramework.unbind(ev, el, callback); };
			 *   }
			 * };
			 *
			 * can.Control("EventTarget", { }, {
			 *   'birthday': function(el, ev) {
			 *     // do something appropriate for the occasion
			 *   },
			 *   '.grandchild birthday': function(el, ev) {
			 *     // do something appropriate for the occasion
			 *   }
			 * });
			 *
			 * var target = new EventTarget('#person');
			 * @codeend
			 *
			 * When `target` is initialized, can.Control will call `can.Control.processors.birthday`
			 * twice (because there are two event hookups for the _birthday_ event). The first
			 * time it's called, the arguments will be:
			 *
			 * - _el_: A NodeList that wraps the element with id 'person'.
			 * - _ev_: `'birthday'`
			 * - _selector_: `''`
			 * - _callback_: The function assigned to `' birthday'` in the prototype section of `EventTarget`'s
			 * definition.
			 * - _control_: `target` itself.
			 *
			 * The second time, the arguments are slightly different:
			 *
			 * - _el_: A NodeList that wraps the element with id 'person'.
			 * - _ev_: `'birthday'`
			 * - _selector_: `'.grandchild'`
			 * - _callback_: The function assigned to `'.grandchild birthday'` in the prototype section of `EventTarget`'s
			 * definition.
			 * - _control_: `target` itself.
			 *
			 * can.Control already has processors for these events:
			 *
			 *   - change
			 *   - click
			 *   - contextmenu
			 *   - dblclick
			 *   - focusin
			 *   - focusout
			 *   - keydown
			 *   - keyup
			 *   - keypress
			 *   - mousedown
			 *   - mouseenter
			 *   - mouseleave
			 *   - mousemove
			 *   - mouseout
			 *   - mouseover
			 *   - mouseup
			 *   - reset
			 *   - resize
			 *   - scroll
			 *   - select
			 *   - submit
			 */
			processors: {},
			// A object of name-value pairs that act as default values for a 
			// control instance
			defaults: {}
			/**
			 * @property {Object} can.Control.defaults defaults
			 * @parent can.Control.static
			 * @description Default values for the Control's options.
			 *
			 * @body
			 * `defaults` provides default values for a Control's options.
			 * Options passed into the constructor function will be shallowly merged
			 * into the values from defaults in [can.Control::setup], and
			 * the result will be stored in [can.Control::options this.options].
			 *
			 *     Message = can.Control.extend({
			 *       defaults: {
			 *         message: "Hello World"
			 *       }
			 *     }, {
			 *       init: function(){
			 *         this.element.text( this.options.message );
			 *       }
			 *     });
			 *
			 *     new Message( "#el1" ); //writes "Hello World"
			 *     new Message( "#el12", { message: "hi" } ); //writes hi
			 */
		}, {
			/**
			 * @prototype
			 */
			//
			/**
			 * @functioncan.Control.prototype.init init
			 * @parent can.Control.prototype
			 * @description instance init method required for most applications of [can.Control]
			 * @signature `control.init(element,options)`
			 * @param element The wrapped element passed to the control.
			 *		Control accepts a raw HTMLElement, a CSS selector, or a NodeList.
			 *		This is set as `this.element` on the control instance.
			 * @param options The second argument passed to new Control,
			 *		extended with the can.Control's static _defaults__.
			 *		This is set as `this.options` on the control instance.
			 *		Note that static is used formally to indicate that
			 *		_default values are shared across control instances_.
			 *
			 * @body
			 * Any additional arguments provided to the constructor will be passed as normal.
			 */
			// Sets `this.element`, saves the control in `data, binds event
			// handlers.
			/**
			 * @property {NodeList} can.Control.prototype.element element
			 * @parent can.Control.prototype
			 * @description The element associated with this control.
			 *
			 * @body
			 * The library-wrapped element this control is associated with,
			 * as passed into the constructor. If you want to change the element
			 * that a Control will attach to, you should do it in [can.Control::setup setup].
			 * If you change the element later, make sure to call [can.Control::on on]
			 * to rebind all the bindings.
			 *
			 * If `element` is removed from the DOM, [can.Control::destroy] will
			 * be called and the Control will be destroyed.
			 */
			//
			/**
			 * @function can.Control.prototype.setup setup
			 * @parent can.Control.prototype
			 * @description Perform pre-initialization logic.
			 * @signature `control.setup(element, options)`
			 * @param {HTMLElement|NodeList|String} element The element as passed to the constructor.
			 * @param {Object} [options] option values for the control.  These get added to
			 * this.options and merged with [can.Control.static.defaults defaults].
			 * @return {undefined|Array} return an array if you want to change what init is called with. By
			 * default it is called with the element and options passed to the control.
			 *
			 * @body
			 * Setup is where most of control's magic happens.  It does the following:
			 *
			 * ### Sets this.element
			 *
			 * The first parameter passed to new Control( el, options ) is expected to be
			 * an element.  This gets converted to a Wrapped NodeList element and set as
			 * [can.Control.prototype.element this.element].
			 *
			 * ### Adds the control's name to the element's className
			 *
			 * Control adds it's plugin name to the element's className for easier
			 * debugging.  For example, if your Control is named "Foo.Bar", it adds
			 * "foo_bar" to the className.
			 *
			 * ### Saves the control in $.data
			 *
			 * A reference to the control instance is saved in $.data.  You can find
			 * instances of "Foo.Bar" like:
			 *
			 *     $( '#el' ).data( 'controls' )[ 'foo_bar' ]
			 *
			 * ### Merges Options
			 * Merges the default options with optional user-supplied ones.
			 * Additionally, default values are exposed in the static [can.Control.static.defaults defaults]
			 * so that users can change them.
			 *
			 * ### Binds event handlers
			 *
			 * Setup does the event binding described in [can.Control].
			 */
			setup: function (element, options) {

				var cls = this.constructor,
					pluginname = cls.pluginName || cls._fullName,
					arr;

				// Want the raw element here.
				this.element = can.$(element);

				if (pluginname && pluginname !== 'can_control') {
					// Set element and `className` on element.
					this.element.addClass(pluginname);
				}
				arr = can.data(this.element, 'controls');
				if (!arr) {
					arr = [];
					can.data(this.element, 'controls', arr);
				}
				arr.push(this);

				// Option merging.
				/**
				 * @property {Object} can.Control.prototype.options options
				 * @parent can.Control.prototype
				 *
				 * @description
				 *
				 * Options used to configure a control.
				 *
				 * @body
				 *
				 * The `this.options` property is an Object that contains
				 * configuration data passed to a control when it is
				 * created (`new can.Control(element, options)`).
				 *
				 * In the following example, an options object with
				 * a message is passed to a `Greeting` control. The
				 * `Greeting` control changes the text of its [can.Control::element element]
				 * to the options' message value.
				 *
				 *     var Greeting = can.Control.extend({
				 *       init: function(){
				 *         this.element.text( this.options.message )
				 *       }
				 *     })
				 *
				 *     new Greeting("#greeting",{message: "I understand this.options"})
				 *
				 * The options argument passed when creating the control
				 * is merged with [can.Control.defaults defaults] in
				 * [can.Control.prototype.setup setup].
				 *
				 * In the following example, if no message property is provided,
				 * the defaults' message property is used.
				 *
				 *     var Greeting = can.Control.extend({
				 *       defaults: {
				 *         message: "Defaults merged into this.options"
				 *       }
				 *     },{
				 *       init: function(){
				 *         this.element.text( this.options.message )
				 *       }
				 *     })
				 *
				 *     new Greeting("#greeting")
				 *
				 */
				this.options = extend({}, cls.defaults, options);

				// Bind all event handlers.
				this.on();

				// Gets passed into `init`.
				/**
				 * @property {can.NodeList} can.Control.prototype.element element
				 *
				 * @description The element the Control is associated with.
				 *
				 * @parent can.Control.prototype
				 *
				 * @body
				 *
				 * The control instance's HTMLElement (or window) wrapped by the
				 * util library for ease of use. It is set by the first
				 * parameter to `new can.Construct( element, options )`
				 * in [can.Control::setup].  By default, a control listens to events on `this.element`.
				 *
				 * ### Quick Example
				 *
				 * The following `HelloWorld` control sets the control`s text to "Hello World":
				 *
				 *     HelloWorld = can.Control({
				 *       init: function(){
				 *		this.element.text( 'Hello World' );
				 *       }
				 *     });
				 *
				 *     // create the controller on the element
				 *     new HelloWorld( document.getElementById( '#helloworld' ) );
				 *
				 * ## Wrapped NodeList
				 *
				 * `this.element` is a wrapped NodeList of one HTMLELement (or window).  This
				 * is for convenience in libraries like jQuery where all methods operate only on a
				 * NodeList.  To get the raw HTMLElement, write:
				 *
				 *     this.element[0] //-> HTMLElement
				 *
				 * The following details the NodeList used by each library with
				 * an example of updating its text:
				 *
				 * __jQuery__ `jQuery( HTMLElement )`
				 *
				 *     this.element.text("Hello World")
				 *
				 * __Zepto__ `Zepto( HTMLElement )`
				 *
				 *     this.element.text("Hello World")
				 *
				 * __Dojo__ `new dojo.NodeList( HTMLElement )`
				 *
				 *     this.element.text("Hello World")
				 *
				 * __Mootools__ `$$( HTMLElement )`
				 *
				 *     this.element.empty().appendText("Hello World")
				 *
				 * __YUI__
				 *
				 *     this.element.set("text", "Hello World")
				 *
				 *
				 * ## Changing `this.element`
				 *
				 * Sometimes you don't want what's passed to `new can.Control`
				 * to be this.element.  You can change this by overwriting
				 * setup or by unbinding, setting this.element, and rebinding.
				 *
				 * ### Overwriting Setup
				 *
				 * The following Combobox overwrites setup to wrap a
				 * select element with a div.  That div is used
				 * as `this.element`. Notice how `destroy` sets back the
				 * original element.
				 *
				 *     Combobox = can.Control({
				 *       setup: function( el, options ) {
				 *          this.oldElement = $( el );
				 *          var newEl = $( '<div/>' );
				 *          this.oldElement.wrap( newEl );
				 *          can.Control.prototype.setup.call( this, newEl, options );
				 *       },
				 *       init: function() {
				 *          this.element //-> the div
				 *       },
				 *       ".option click": function() {
				 *         // event handler bound on the div
				 *       },
				 *       destroy: function() {
				 *          var div = this.element; //save reference
				 *          can.Control.prototype.destroy.call( this );
				 *          div.replaceWith( this.oldElement );
				 *       }
				 *     });
				 *
				 * ### unbinding, setting, and rebinding.
				 *
				 * You could also change this.element by calling
				 * [can.Control::off], setting this.element, and
				 * then calling [can.Control::on] like:
				 *
				 *     move: function( newElement ) {
				 *        this.off();
				 *        this.element = $( newElement );
				 *        this.on();
				 *     }
				 */
				return [this.element, this.options];
			},
			/**
			 * @function can.Control.prototype.on on
			 * @parent can.Control.prototype
			 *
			 * @description Bind an event handler to a Control, or rebind all event handlers on a Control.
			 *
			 * @signature `control.on([el,] selector, eventName, func)`
			 * @param {HTMLElement|jQuery collection|Object} [el=this.element]
			 * The element to be bound.  If no element is provided, the control's element is used instead.
			 * @param {CSSSelectorString} selector A css selector for event delegation.
			 * @param {String} eventName The event to listen for.
			 * @param {Function|String} func A callback function or the String name of a control function.  If a control
			 * function name is given, the control function is called back with the bound element and event as the first
			 * and second parameter.  Otherwise the function is called back like a normal bind.
			 * @return {Number} The id of the binding in this._bindings
			 *
			 * @body
			 * `on(el, selector, eventName, func)` binds an event handler for an event to a selector under the scope of the given element.
			 *
			 * @signature `control.on()`
			 *
			 * Rebind all of a control's event handlers.
			 *
			 * @return {Number} The number of handlers bound to this Control.
			 *
			 * @body
			 * `this.on()` is used to rebind
			 * all event handlers when [can.Control::options this.options] has changed.  It
			 * can also be used to bind or delegate from other elements or objects.
			 *
			 * ## Rebinding
			 *
			 * By using templated event handlers, a control can listen to objects outside
			 * `this.element`.  This is extremely common in MVC programming.  For example,
			 * the following control might listen to a task model's `completed` property and
			 * toggle a strike className like:
			 *
			 *     TaskStriker = can.Control({
			 *       "{task} completed": function(){
			 *			this.update();
			 *       },
			 *       update: function(){
			 *         if ( this.options.task.completed ) {
			 *			this.element.addClass( 'strike' );
			 *		} else {
			 *           this.element.removeClass( 'strike' );
			 *         }
			 *       }
			 *     });
			 *
			 *     var taskstriker = new TaskStriker({
			 *       task: new Task({ completed: 'true' })
			 *     });
			 *
			 * To update the `taskstriker`'s task, add a task method that updates
			 * this.options and rebinds the event handlers for the new task like:
			 *
			 *     TaskStriker = can.Control({
			 *       "{task} completed": function(){
			 *			this.update();
			 *       },
			 *       update: function() {
			 *         if ( this.options.task.completed ) {
			 *			this.element.addClass( 'strike' );
			 *		} else {
			 *           this.element.removeClass( 'strike' );
			 *         }
			 *       },
			 *       task: function( newTask ) {
			 *         this.options.task = newTask;
			 *         this.on();
			 *         this.update();
			 *       }
			 *     });
			 *
			 *     var taskstriker = new TaskStriker({
			 *       task: new Task({ completed: true })
			 *     });
			 *     taskstriker.task( new TaskStriker({
			 *       task: new Task({ completed: false })
			 *     }));
			 *
			 * ## Adding new events
			 *
			 * If events need to be bound to outside of the control and templated event handlers
			 * are not sufficient, you can call this.on to bind or delegate programmatically:
			 *
			 *     init: function() {
			 *        // calls somethingClicked( el, ev )
			 *        this.on( 'click', 'somethingClicked' );
			 *
			 *        // calls function when the window is clicked
			 *        this.on( window, 'click', function( ev ) {
			 *          //do something
			 *        });
			 *     },
			 *     somethingClicked: function( el, ev ) {
			 *
			 *     }
			 */
			on: function (el, selector, eventName, func) {
				if (!el) {

					// Adds bindings.
					this.off();

					// Go through the cached list of actions and use the processor 
					// to bind
					var cls = this.constructor,
						bindings = this._bindings,
						actions = cls.actions,
						element = this.element,
						destroyCB = can.Control._shifter(this, "destroy"),
						funcName, ready;

					for (funcName in actions) {
						// Only push if we have the action and no option is `undefined`
						if (actions.hasOwnProperty(funcName) &&
							(ready = actions[funcName] || cls._action(funcName, this.options))) {
							bindings.push(ready.processor(ready.delegate || element,
								ready.parts[2], ready.parts[1], funcName, this));
						}
					}

					// Setup to be destroyed...  
					// don't bind because we don't want to remove it.
					can.bind.call(element, "removed", destroyCB);
					bindings.push(function (el) {
						can.unbind.call(el, "removed", destroyCB);
					});
					return bindings.length;
				}

				if (typeof el === 'string') {
					func = eventName;
					eventName = selector;
					selector = el;
					el = this.element;
				}

				if (func === undefined) {
					func = eventName;
					eventName = selector;
					selector = null;
				}

				if (typeof func === 'string') {
					func = can.Control._shifter(this, func);
				}

				this._bindings.push(binder(el, eventName, func, selector));

				return this._bindings.length;
			},
			// Unbinds all event handlers on the controller.
			/**
			 * @hide
			 * Unbinds all event handlers on the controller. You should never
			 * be calling this unless in use with [can.Control::on].
			 */
			off: function () {
				var el = this.element[0];
				each(this._bindings || [], function (value) {
					value(el);
				});
				// Adds bindings.
				this._bindings = [];
			},
			// Prepares a `control` for garbage collection
			/**
			 * @description Remove a Control from an element and clean up the Control.
			 * @signature `control.destroy()`
			 *
			 * Prepares a control for garbage collection and is a place to
			 * reset any changes the control has made.
			 *
			 * @function can.Control.prototype.destroy destroy
			 * @parent can.Control.prototype
			 *
			 * @body
			 *
			 *
			 * ## Allowing Garbage Collection
			 *
			 * Destroy is called whenever a control's element is removed from the page using
			 * the library's standard HTML modifier methods.  This means that you
			 * don't have to call destroy yourself and it
			 * will be called automatically when appropriate.
			 *
			 * The following `Clicker` widget listens on the window for clicks and updates
			 * its element's innerHTML.  If we remove the element, the window's event handler
			 * is removed auto-magically:
			 *
			 *
			 *      Clickr = can.Control({
			 *       "{window} click": function() {
			 *			this.element.html( this.count ?
			 *			this.count++ : this.count = 0 );
			 *       }
			 *     });
			 *
			 *     // create a clicker on an element
			 *     new Clicker( "#clickme" );
			 *
			 *     // remove the element
			 *     $( '#clickme' ).remove();
			 *
			 *
			 * The methods you can use that will destroy controls automatically by library:
			 *
			 * __jQuery and Zepto__
			 *
			 *   - $.fn.remove
			 *   - $.fn.html
			 *   - $.fn.replaceWith
			 *   - $.fn.empty
			 *
			 * __Dojo__
			 *
			 *   - dojo.destroy
			 *   - dojo.empty
			 *   - dojo.place (with the replace option)
			 *
			 * __Mootools__
			 *
			 *   - Element.prototype.destroy
			 *
			 * __YUI__
			 *
			 *   - Y.Node.prototype.remove
			 *   - Y.Node.prototype.destroy
			 *
			 *
			 * ## Teardown in Destroy
			 *
			 * Sometimes, you want to reset a controlled element back to its
			 * original state when the control is destroyed.  Overwriting destroy
			 * lets you write teardown code of this manner.  __When overwriting
			 * destroy, make sure you call Control's base functionality__.
			 *
			 * The following example changes an element's text when the control is
			 * created and sets it back when the control is removed:
			 *
			 *     Changer = can.Control.extend({
			 *       init: function() {
			 *         this.oldText = this.element.text();
			 *         this.element.text( "Changed!!!" );
			 *       },
			 *       destroy: function() {
			 *         this.element.text( this.oldText );
			 *         can.Control.prototype.destroy.call( this );
			 *       }
			 *     });
			 *
			 *     // create a changer which changes #myel's text
			 *     var changer = new Changer( '#myel' );
			 *
			 *     // destroy changer which will reset it
			 *     changer.destroy();
			 *
			 * ## Base Functionality
			 *
			 * Control prepares the control for garbage collection by:
			 *
			 *   - unbinding all event handlers
			 *   - clearing references to this.element and this.options
			 *   - clearing the element's reference to the control
			 *   - removing it's [can.Control.pluginName] from the element's className
			 *
			 */
			destroy: function () {
				//Control already destroyed
				if (this.element === null) {
				
					return;
				}
				var Class = this.constructor,
					pluginName = Class.pluginName || Class._fullName,
					controls;

				// Unbind bindings.
				this.off();

				if (pluginName && pluginName !== 'can_control') {
					// Remove the `className`.
					this.element.removeClass(pluginName);
				}

				// Remove from `data`.
				controls = can.data(this.element, "controls");
				controls.splice(can.inArray(this, controls), 1);

				can.trigger(this, "destroyed"); // In case we want to know if the `control` is removed.

				this.element = null;
			}
		});

	var processors = can.Control.processors;
	// Processors do the binding.
	// They return a function that unbinds when called.
	//
	// The basic processor that binds events.
	basicProcessor = function (el, event, selector, methodName, control) {
		return binder(el, event, can.Control._shifter(control, methodName), selector);
	};

	// Set common events to be processed as a `basicProcessor`
	each(["change", "click", "contextmenu", "dblclick", "keydown", "keyup",
		"keypress", "mousedown", "mousemove", "mouseout", "mouseover",
		"mouseup", "reset", "resize", "scroll", "select", "submit", "focusin",
		"focusout", "mouseenter", "mouseleave",
		// #104 - Add touch events as default processors
		// TOOD feature detect?
		"touchstart", "touchmove", "touchcancel", "touchend", "touchleave"
	], function (v) {
		processors[v] = basicProcessor;
	});

	return Control;
});