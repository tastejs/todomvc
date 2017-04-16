
Lava.define(
'Lava.mixin.Observable',
/**
 * Provides support for events
 * @lends Lava.mixin.Observable#
 */
{

	/**
	 * Indicates that this class is inherited from Observable and supports events
	 * @const
	 */
	isObservable: true,

	/**
	 * The hash of listeners for each event
	 * @type {Object.<string, Array.<_tListener>>}
	 */
	_listeners: {},

	/**
	 * Add listener for event `event_name`
	 *
	 * @param {string} event_name Name of the event to listen to
	 * @param {function} fn The callback
	 * @param {Object} context The context for callback execution (an object, to which the callback belongs)
	 * @param {*} [listener_args] Static listener arguments. May be usable when one callback responds to different events
	 * @returns {_tListener} Listener structure, which later may be suspended, or removed via call to {@link Lava.mixin.Observable#removeListener}
	 */
	on: function(event_name, fn, context, listener_args) {

		return this._addListener(event_name, fn, context, listener_args, this._listeners)

	},

	/**
	 * Create the listener construct and push it into the listeners array for given event name
	 *
	 * @param {string} event_name The name of event
	 * @param {function} fn The callback
	 * @param {Object} context The owner of the callback
	 * @param {*} listener_args Static listener arguments
	 * @param {Object.<string, Array.<_tListener>>} listeners_by_event {@link Lava.mixin.Observable#_listeners} or {@link Lava.mixin.Properties#_property_listeners}
	 * @returns {_tListener} Listener structure
	 */
	_addListener: function(event_name, fn, context, listener_args, listeners_by_event) {

		// otherwise, listener would be called on window object
		if (Lava.schema.DEBUG && !context) Lava.t('Listener was created without a context');

		// note 1: member count for a plain object like this must not exceed 8
		// otherwise, chrome will slow down greatly (!)
		// note 2: there is no 'remove()' method inside the listener, cause depending on implementation,
		// it may either slow down script execution or lead to memory leaks
		var listener = {
			event_name: event_name,
			fn: fn,
			fn_original: fn,
			context: context,
			listener_args: listener_args
		};

		if (listeners_by_event[event_name] != null) {

			listeners_by_event[event_name].push(listener);

		} else {

			listeners_by_event[event_name] = [listener];

		}

		return listener;

	},

	/**
	 * Remove the given listener object from event listeners array
	 * @param {_tListener} listener Structure, which was returned by {@link Lava.mixin.Observable#on} method
	 */
	removeListener: function(listener) {

		this._removeListener(listener, this._listeners);

	},

	/**
	 * Perform removal of the listener structure
	 * @param {_tListener} listener Structure, which was returned by {@link Lava.mixin.Observable#on} method
	 * @param {Object.<string, Array.<_tListener>>} listeners_by_event {@link Lava.mixin.Observable#_listeners} or {@link Lava.mixin.Properties#_property_listeners}
	 */
	_removeListener: function(listener, listeners_by_event) {

		var list = listeners_by_event[listener.event_name],
			index;

		if (list) {
			index = list.indexOf(listener);
			if (index != -1) {
				list.splice(index, 1);
				if (list.length == 0) {
					listeners_by_event[listener.event_name] = null;
				}
			}
		}

	},

	/**
	 * Fire an event
	 * @param {string} event_name The name of event
	 * @param {*} [event_args] Dynamic event arguments. Anything, that may be needed by listener
	 */
	_fire: function(event_name, event_args) {

		if (Lava.schema.DEBUG && typeof(event_name) == "undefined") Lava.t();

		if (this._listeners[event_name] != null) {

			this._callListeners(this._listeners[event_name], event_args);

		}

	},

	/**
	 * Perform fire - call listeners of an event
	 * @param {Array.<_tListener>} listeners An array with listener structures
	 * @param {*} event_args Dynamic event arguments
	 */
	_callListeners: function(listeners, event_args) {

		var copy = listeners.slice(), // cause they may be removed during the fire cycle
			i = 0,
			count = listeners.length,
			listener;

		for (; i < count; i++) {

			listener = copy[i];
			listener.fn.call(listener.context, this, event_args, listener.listener_args);

		}

	},

	/**
	 * Does this object have any listeners for given event, including suspended instances
	 * @param {string} event_name The name of event
	 * @returns {boolean} True, if there are listeners
	 */
	_hasListeners: function(event_name) {

		return this._listeners[event_name] != null;

	}

});

/**
 * Property has changed
 * @event Lava.mixin.Properties#property_changed
 * @type {Object}
 * @property {string} name The name of the changed property
 */

Lava.define(
'Lava.mixin.Properties',
/**
 * Provides the `get()` and `set()` methods, and fires property changed events
 * @lends Lava.mixin.Properties#
 * @extends Lava.mixin.Observable
 */
{

	Extends: 'Lava.mixin.Observable',

	/**
	 * To signal other classes that this class implements Properties
	 * @const
	 */
	isProperties: true,

	/**
	 * Hash with property values
	 * @type {Object.<name, *>}
	 */
	_properties: {},
	/**
	 * Separate listeners hash for property changed events, same as {@link Lava.mixin.Observable#_listeners}
	 * @type {Object.<string, Array.<_tListener>>}
	 */
	_property_listeners: {},

	/**
	 * Allows the mixin to be used as full-featured class
	 * @param {Object.<string, *>} properties Initial properties
	 */
	init: function(properties) {

		for (var name in properties) {

			this._properties[name] = properties[name];

		}

	},

	/**
	 * Get property
	 * @param {string} name Property name
	 * @returns {*} Property value
	 */
	get: function(name) {

		return this._properties[name];

	},

	/**
	 * Returns <kw>true</kw> if property exists, even if it's null/undefined
	 * @param {string} name Property name
	 * @returns {boolean} True, if property exists
	 */
	isset: function(name) {

		return name in this._properties;

	},

	/**
	 * Set property
	 * @param {string} name Property name
	 * @param {*} value New property value
	 */
	set: function(name, value) {

		if (this._properties[name] !== value) {
			this._set(name, value);
		}

	},

	/**
	 * Perform the set operation
	 * @param {string} name Property name
	 * @param {*} value New property value
	 */
	_set: function(name, value) {
		this._properties[name] = value;
		this.firePropertyChangedEvents(name);
	},

	/**
	 * Set multiple properties at once
	 * @param {Object.<string, *>} properties_object A hash with new property values
	 */
	setProperties: function(properties_object) {

		if (Lava.schema.DEBUG && properties_object && properties_object.isProperties) Lava.t("setProperties expects a plain JS object as an argument, not a class");

		for (var name in properties_object) {

			this.set(name, properties_object[name]);

		}

	},

	/**
	 * Return a copy of the properties hash
	 * @returns {Object.<name, *>} Copy of `_properties` object
	 */
	getProperties: function() {

		var result = {};
		Firestorm.extend(result, this._properties);
		return result;

	},

	/**
	 * Fire the 'property_changed' event for Observable interface, and Properties' native {@link Lava.mixin.Properties#onPropertyChanged} event
	 * @param {string} property_name The name of the changed property
	 */
	firePropertyChangedEvents: function(property_name) {

		this._fire('property_changed', {name: property_name});
		this._firePropertyChanged(property_name);

	},

	/**
	 * The same, as {@link Lava.mixin.Observable#on}, but returns listener to `property_name` instead of `event_name`
	 *
	 * @param {string} property_name Name of the property to listen for changes
	 * @param {function} fn The callback
	 * @param {Object} context The context for callback execution (an object, to which the callback belongs)
	 * @param {*} [listener_args] May be usable when one callback responds to changes of different properties
	 * @returns {_tListener} Listener construct, which may be removed or suspended later
	 */
	onPropertyChanged: function(property_name, fn, context, listener_args) {

		return this._addListener(property_name, fn, context, listener_args, this._property_listeners);

	},

	/**
	 * Removes listeners added with {@link Lava.mixin.Properties#onPropertyChanged}
	 * @param {_tListener} listener The listener structure, returned from {@link Lava.mixin.Properties#onPropertyChanged}
	 */
	removePropertyListener: function(listener) {

		this._removeListener(listener, this._property_listeners);

	},

	/**
	 * Same as {@link Lava.mixin.Observable#_fire}, but for property listeners
	 * @param {string} property_name Name of the changed property
	 */
	_firePropertyChanged: function(property_name) {

		if (Lava.schema.DEBUG && property_name == null) Lava.t("firePropertyChanged: property_name is null");

		if (this._property_listeners[property_name] != null) {

			this._callListeners(this._property_listeners[property_name]);

		}

	}

});

Lava.define(
'Lava.mixin.Refreshable',
/**
 * Auxiliary class for the scope refresh system. Allows to build hierarchy of dependent scopes
 * @lends Lava.mixin.Refreshable#
 * @extends Lava.mixin.Observable
 */
{

	Extends: 'Lava.mixin.Observable',
	/**
	 * Tell other classes that this instance is inherited from Refreshable
	 * @type {boolean}
	 * @const
	 */
	isRefreshable: true,
	/**
	 * Indicates the priority of this scope in the hierarchy. Scopes with lower priority are refreshed first
	 * @type {number}
	 * @readonly
	 */
	level: 0,

	/**
	 * The object, which is given by {@link Lava.ScopeManager} when the scope is added into the refresh queue
	 * @type {Object}
	 */
	_refresh_ticket: null,

	/**
	 * Each time the scope is refreshed - it's assigned the id of the current refresh loop
	 * @type {number}
	 */
	_last_refresh_id: 0,
	/**
	 * How many times this scope was refreshed during current refresh loop
	 * @type {number}
	 */
	_refresh_cycle_count: 0,
	/**
	 * Scope's value
	 * @type {*}
	 */
	_value: null,

	/**
	 * Called by {@link Lava.ScopeManager} during refresh loop. You should not call this method directly.
	 * Warning: violates code style with multiple return statements.
	 *
	 * @param {number} refresh_id The id of current refresh loop
	 * @param {boolean} [is_safe] Internal switch used to control infinite refresh loop exceptions
	 * @returns {boolean} <kw>true</kw> in case of infinite loop, and <kw>false</kw> in case of normal refresh
	 */
	refresh: function(refresh_id, is_safe) {

		// first, refresh ticket must be cleared, cause otherwise scope may stay dirty forever
		this._refresh_ticket = null;

		if (this._last_refresh_id == refresh_id) {

			this._refresh_cycle_count++;
			if (this._refresh_cycle_count > Lava.schema.system.REFRESH_INFINITE_LOOP_THRESHOLD && !is_safe) {

				return true; // infinite loop exception

			}

		} else {

			this._last_refresh_id = refresh_id;
			this._refresh_cycle_count = 0;

		}

		this._doRefresh();
		return false;

	},

	/**
	 * Must be overridden in classes that implement Refreshable to perform the actual refresh logic
	 */
	_doRefresh: function() {

		// may be overridden in inherited classes

	},

	/**
	 * Ensure that this scope will participate in the next refresh cycle
	 */
	_queueForRefresh: function() {

		if (!this._refresh_ticket) {

			this._refresh_ticket = Lava.ScopeManager.scheduleScopeRefresh(this, this.level);

		}

	},

	/**
	 * Internal debug assertion, called to verify that the scope does not need to be refreshed
	 */
	debugAssertClean: function() {

		if (this._refresh_ticket) Lava.t("Refreshable::debugAssertClean() failed");

	},

	/**
	 * Will the scope be refreshed in the next refresh cycle
	 * @returns {boolean} <kw>true</kw>, if scope is in refresh queue, and <kw>false</kw> otherwise
	 */
	isWaitingRefresh: function() {

		return !!this._refresh_ticket;

	},

	/**
	 * Cancel the current refresh ticket and ignore next refresh cycle. Does not destroy the Refreshable instance
	 */
	suspendRefreshable: function() {

		if (this._refresh_ticket) {
			Lava.ScopeManager.cancelScopeRefresh(this._refresh_ticket, this.level);
			this._refresh_ticket = null;
		}

	}

});
Lava.define(
'Lava.animator.Integer',
/**
 * Animate integer units, like pixels
 * @lends Lava.animator.Integer#
 * @implements _iAnimator
 */
{

	/**
	 * Property to animate, like 'width' or 'height'
	 * @type {string}
	 */
	property_name: null,
	/**
	 * Starting property value
	 * @type {number}
	 */
	from: 0,
	/**
	 * End property value
	 * @type {number}
	 */
	delta: 0,
	/**
	 * CSS unit for animated property, like 'px'
	 */
	unit: null,

	/**
	 * Create the animator instance
	 * @param {_cAnimator_Integer} config
	 */
	init: function(config) {

		this.property_name = config.property;
		this.from = config.from || 0;
		this.delta = config.delta;
		this.unit = config.unit || 'px';

	},

	/**
	 * Perform animation
	 * @param {HTMLElement} element
	 * @param {number} transition_value Value of animation. Usually between 0 and 1, but sometimes it may cross the bounds
	 */
	animate: function(element, transition_value) {

		var raw_result = this.from + this.delta * transition_value;

		Firestorm.Element.setStyle(
			element,
			this.property_name,
			Math.floor(raw_result) + this.unit
		);

	}

});
Lava.define(
'Lava.animator.Color',
/**
 * Animate colors
 * @lends Lava.animator.Color#
 * @implements _iAnimator
 */
{

	/**
	 * Property to animate, like 'background-color'
	 * @type {string}
	 */
	property_name: null,
	/**
	 * Starting color
	 * @type {Array.<number>}
	 */
	from: null,
	/**
	 * End color
	 * @type {Array.<number>}
	 */
	to: null,
	/**
	 * Computed difference between starting and the end color
	 * @type {Array.<number>}
	 */
	delta: null,

	/**
	 * Create the animator instance
	 * @param {_cAnimator_Color} config
	 */
	init: function(config) {

		this.property_name = config.property;
		this.from = config.from || [0,0,0];
		this.to = config.to || [0,0,0];
		this.delta = [this.to[0] - this.from[0], this.to[1] - this.from[1], this.to[2] - this.from[2]];

	},

	/**
	 * Perform animation
	 * @param {HTMLElement} element
	 * @param {number} transition_value Value of animation. Usually between 0 and 1, but sometimes it may cross the bounds
	 */
	animate: function(element, transition_value) {

		var current_value = [
			Math.floor(this.from[0] + this.delta[0] * transition_value),
			Math.floor(this.from[1] + this.delta[1] * transition_value),
			Math.floor(this.from[2] + this.delta[2] * transition_value)
		];

		Firestorm.Element.setStyle(
			element,
			this.property_name,
			'rgb(' + current_value.join(',') + ')'
		);

	}

});

/**
 * Animation has ended
 * @event Lava.animation.Abstract#complete
 */

Lava.define(
'Lava.animation.Abstract',
/**
 * Animation changes properties of HTML elements over time
 * @lends Lava.animation.Abstract#
 * @extends Lava.mixin.Observable
 */
{

	Extends: 'Lava.mixin.Observable',

	/**
	 * The time when animation was started, in milliseconds
	 * @type {number}
	 */
	_started_time: 0,
	/**
	 * The time animation ends (or has ended), in milliseconds
	 * @type {number}
	 */
	_end_time: 0,
	/**
	 * Animation duration, in milliseconds
	 * @type {number}
	 */
	_duration: 0,
	/**
	 * Usually, a HTML Element, properties of which this animation changes
	 * @type {*}
	 */
	_target: null,
	/**
	 * Is it currently running
	 * @type {boolean}
	 */
	_is_running: false,
	/**
	 * Does it run in reversed direction
	 * @type {boolean}
	 */
	_is_reversed: false,
	/**
	 * The settings for this instance
	 * @readonly
	 * @type {_cAnimation}
	 */
	_config: null,

	/**
	 * Transition is a function, which takes current elapsed time (in percent, from 0 to 1) and returns current animation position (also in percent)
	 * @type {_tTransitionCallback}
	 */
	_transition: null,
	/**
	 * Instance global unique identifier
	 * @type {_tGUID}
	 */
	guid: null,

	/**
	 * Constructs the class instance
	 * @param {_cAnimation} config Settings, `this._config`
	 * @param {*} target `this._target`
	 */
	init: function(config, target) {

		this.guid = Lava.guid++;
		if (config.duration) {
			this._duration = config.duration;
		}
		this._target = target;
		this._transition = config.transition || Lava.transitions[config.transition_name || 'linear'];
		this._config = config;

	},

	/**
	 * Called by Cron. Assigned in constructor
	 * @param {number} now The current time (=new Date().getTime())
	 */
	onTimer: function(now) {

		Lava.t("This method is assigned dynamically in constructor");

	},

	/**
	 * Set the animation state to 'not running' and fire the {@link Lava.animation.Abstract#event:complete} event
	 */
	_finish: function() {

		this._is_running = false;
		this._fire('complete');

	},

	/**
	 * Start only if it's not already running
	 * @param [started_time] Optionally, you can pass the time when animation has actually started.
	 *      Otherwise, the current system time will be taken
	 */
	safeStart: function(started_time) {

		if (!this._is_running) {

			this.start(started_time);

		}

	},

	/**
	 * If animation is running forwards - reverse it to backwards direction
	 */
	reverseDirection: function() {

		if (!this._is_reversed) {

			this._mirror();

		}

	},

	/**
	 * If animation is running backwards - reverse it to normal direction
	 */
	resetDirection: function() {

		if (this._is_reversed) {

			this._mirror();

		}

	},

	/**
	 * Reverse animation direction
	 */
	_mirror: function() {

		this._is_reversed = !this._is_reversed;

		if (this._is_running) {

			var now = new Date().getTime(),
				new_end = 2 * now - this._started_time;

			// it's possible in case of script lags. Must not allow negative transition values.
			if (now > this._end_time) {

				this._started_time = this._end_time;
				this._end_time = this._started_time + this._duration;

			} else {

				this._end_time = new_end;
				this._started_time = new_end - this._duration;

			}

			this._afterMirror(now);

		}

	},

	/**
	 * Callback to execute after `_mirror` is done
	 * @param {number} now The current time in milliseconds
	 */
	_afterMirror: function(now) {

	},

	/**
	 * Get `_is_running`
	 * @returns {boolean}
	 */
	isRunning: function() {

		return this._is_running;

	},

	/**
	 * Get `_started_time`
	 * @returns {number}
	 */
	getStartedTime: function() {

		return this._started_time;

	},

	/**
	 * Get `_end_time`
	 * @returns {number}
	 */
	getEndTime: function() {

		return this._end_time;

	},

	/**
	 * Get `_duration`
	 * @returns {number}
	 */
	getDuration: function() {

		return this._duration;

	},

	/**
	 * Get `_is_reversed`
	 * @returns {boolean}
	 */
	isReversed: function() {

		return this._is_reversed;

	},

	/**
	 * Get `_target`
	 * @returns {*}
	 */
	getTarget: function() {

		return this._target;

	},

	/**
	 * Set `_target`
	 * @param target
	 */
	setTarget: function(target) {

		this._target = target;

	}

});

Lava.define(
'Lava.animation.Standard',
/**
 * Common JavaScript-driven animation. Uses {@link Lava.Cron}
 * @lends Lava.animation.Standard#
 * @extends Lava.animation.Abstract
 */
{

	Extends: 'Lava.animation.Abstract',

	Shared: '_shared',

	/**
	 * Shared data
	 */
	_shared: {
		// pre-generated variants of this._callAnimators function
		call_animators: [
			function(transition_value) {},
			function(transition_value) {
				this._animators[0].animate(this._target, transition_value);
			},
			function(transition_value) {
				this._animators[0].animate(this._target, transition_value);
				this._animators[1].animate(this._target, transition_value);
			},
			function(transition_value) {
				this._animators[0].animate(this._target, transition_value);
				this._animators[1].animate(this._target, transition_value);
				this._animators[2].animate(this._target, transition_value);
			},
			function(transition_value) {
				this._animators[0].animate(this._target, transition_value);
				this._animators[1].animate(this._target, transition_value);
				this._animators[2].animate(this._target, transition_value);
				this._animators[3].animate(this._target, transition_value);
			}
		]
	},

	/**
	 * Current animation percent, between 0 and 1
	 * @type {number}
	 */
	_percent: 0,

	/**
	 * Animator instances
	 * @type {Array.<_iAnimator>}
	 */
	_animators: [],

	init: function(config, target) {

		this.Abstract$init(config, target);

		var i = 0,
			count = 0,
			animator_config;

		if ('animators' in config) {

			count = config.animators.length;

			for (; i < count; i++) {

				animator_config = config.animators[i];
				this._animators.push(new Lava.animator[animator_config.type](animator_config));

			}

		}

		if (this._shared.call_animators.length <= count) {

			this._callAnimators = this._shared.call_animators[count];

		}

		this.onTimer = this._animateDirect;

	},

	/**
	 * Calls all animator instances.
	 * This function may be substituted with pre-generated version from `_shared`
	 *
	 * @param {number} transition_value The current percent of animation
	 */
	_callAnimators: function(transition_value) {

		for (var i = 0, count = this._animators.length; i < count; i++) {

			this._animators[i].animate(this._target, transition_value);

		}

	},

	/**
	 * Perform animation in normal direction
	 * @param {number} now The current global time in milliseconds
	 */
	_animateDirect: function(now) {

		if (now < this._end_time) {

			this._callAnimators(this._transition((now - this._started_time) / this._duration));

		} else {

			this._callAnimators(this._transition(1));
			this._finish();

		}

	},

	/**
	 * Perform animation in reversed direction
	 * @param {number} now The current global time in milliseconds
	 */
	_animateReverse: function(now) {

		if (now < this._end_time) {

			this._callAnimators(this._transition(1 - (now - this._started_time) / this._duration));

		} else {

			this._callAnimators(this._transition(0));
			this._finish();

		}

	},

	/**
	 * Start animating
	 * @param {number} [started_time] The global system time in milliseconds when animation has started.
	 *  May be used to synchronize multiple animations
	 */
	start: function(started_time) {

		var now = new Date().getTime();
		this._started_time = started_time || now;
		this._end_time = this._started_time + this._duration;

		if (now < this._end_time) {

			this._is_running = true;
			Lava.Cron.acceptTask(this);
			this.onTimer(now);

		} else {

			this.onTimer(this._end_time);

		}

	},

	/**
	 * Stop animation immediately where it is. Do not fire {@link Lava.animation.Abstract#event:complete}
	 */
	stop: function() {

		this._is_running = false;

	},

	_mirror: function() {

		this.onTimer = this._is_reversed ? this._animateDirect : this._animateReverse;
		this.Abstract$_mirror();

	},

	/**
	 * Act like the animation has ended naturally:
	 * apply the end state to the target and fire {@link Lava.animation.Abstract#event:complete}
	 */
	finish: function() {

		if (this._is_running) {

			this.onTimer(this._end_time);

		}

	},

	/**
	 * Set animation duration
	 * @param {number} duration New duration, in milliseconds
	 */
	setDuration: function(duration) {

		this._duration = duration;
		this._end_time = this._started_time + duration;

	}

});

Lava.define(
'Lava.animation.Collapse',
/**
 * Expand (forwards) and collapse (backwards) an element. May operate with either height (default) or width property.
 * Adjusts animation duration dynamically, depending on distance
 *
 * @lends Lava.animation.Collapse#
 * @extends Lava.animation.Standard
 */
{

	Extends: 'Lava.animation.Standard',

	/**
	 * Animation config
	 */
	_shared: {
		default_config: {
			// duration is set dynamically
			transition_name: 'outQuad',
			animators: [{
				type: 'Integer',
				property: 'height',
				delta: 0 // actual height will be set at run time
			}]
		}
	},

	/**
	 * Property to animate
	 * @type {string}
	 */
	_property: 'height',

	/**
	 * Minimal animation duration, milliseconds
	 * @type {number}
	 * @const
	 */
	DURATION_BIAS: 200,

	init: function(config, target) {

		var new_config = {};
		Firestorm.extend(new_config, this._shared.default_config);
		Firestorm.extend(new_config, config);

		// assuming that the first animator is Integer
		if (Lava.schema.DEBUG && !new_config.animators[0].property) Lava.t("Collapse: malformed animation config");
		this._property = new_config.animators[0].property;

		this.Standard$init(new_config, target);

	},

	start: function(started_time) {

		// in case we are starting from collapsed state
		Firestorm.Element.setStyle(this._target, this._property, 'auto');
		// assuming that target is element
		var property_value = Firestorm.Element.getSize(this._target)[(this._property == 'width') ? 'x' : 'y'];
		this._animators[0].delta = property_value;
		this.setDuration(this.DURATION_BIAS + Math.floor(property_value)); // time depends on distance, to make it smoother

		this.Standard$start(started_time);

	},

	_finish: function() {

		if (!this._is_reversed) {

			// animation has expanded the container, height (or width) must be unlocked to allow element to adapt it's dimensions
			// (otherwise, if children nodes are added or removed - height will remain the same)
			Firestorm.Element.setStyle(this._target, this._property, 'auto');

		}

		this.Standard$_finish();

	}

});

Lava.define(
'Lava.animation.Toggle',
/**
 * Primary purpose of this class: emulate animation support in cases when it's not enabled
 * (and leave the same code, that works with animations)
 *
 * @lends Lava.animation.Toggle#
 * @extends Lava.animation.Standard
 */
{

	Extends: 'Lava.animation.Standard',

	_finish: function() {

		Firestorm.Element.setStyle(this._target, 'display', this._is_reversed ? 'none' : 'block');
		this.Standard$_finish();

	}

});

Lava.define(
'Lava.animation.Emulated',
/**
 * Used to animate with CSS transitions. Does not use {@link Lava.Cron}, has a single timeout event
 * @lends Lava.animation.Emulated#
 * @extends Lava.animation.Abstract
 */
{

	Extends: 'Lava.animation.Abstract',

	/**
	 * Tell other classes that this is instance of Lava.animation.Emulated
	 */
	isEmulated: true,

	/**
	 * Window timeout id
	 * @type {?number}
	 */
	_timeout: null,

	init: function(config, target) {

		this.Abstract$init(config, target);

		var self = this;
		this.onTimer = function() {
			self._onTimeout();
		}

	},

	/**
	 * Callback for window timeout event
	 */
	_onTimeout: function() {

		this._timeout = null;
		this._end();
		this._finish();

	},

	/**
	 * Apply the ended state to the target
	 */
	_end: function() {

	},

	/**
	 * Clear old timeout, if it exists
	 */
	_cancelTimeout: function() {
		if (this._timeout) {
			window.clearTimeout(this._timeout);
			this._timeout = null;
		}
	},

	/**
	 * Start animation
	 */
	start: function() {

		if (this._is_running) {
			this.stop();
		}

		this._is_running = true;
		this._start();
		this._timeout = window.setTimeout(this.onTimer, this._duration);

	},

	/**
	 * Apply the started state to the target
	 */
	_start: function() {

	},

	/**
	 * Stop animation immediately where it is. Do not fire {@link Lava.animation.Abstract#event:complete}
	 */
	stop: function() {

		if (this._is_running) {
			this._is_running = false;
			this._cancelTimeout();
		}

	},

	_mirror: function() {

		if (this._is_running) {
			this.stop();
			this._reverse();
			this._is_running = true;
			// any CSS transition takes fixed amount of time
			this._timeout = window.setTimeout(this.onTimer, this._duration);
		}

		this._is_reversed = !this._is_reversed;

	},

	/**
	 * Actions to reverse Emulated animation while it's still running
	 */
	_reverse: function() {

	},

	/**
	 * End the animation and Apply the end state to target
	 */
	finish: function() {

		if (this._is_running) {
			this._cancelTimeout();
			this._onTimeout();
		}

	}

});

Lava.define(
'Lava.animation.BootstrapCollapse',
/**
 * Expand and collapse an element using browser transitions from Bootstrap CSS framework
 *
 * @lends Lava.animation.BootstrapCollapse#
 * @extends Lava.animation.Emulated
 */
{

	Extends: 'Lava.animation.Emulated',

	/**
	 * Fixed duration from CSS rules
	 * @type {number}
	 */
	_duration: 350,
	/**
	 * 'width' or 'height'
	 * @type {string}
	 */
	_property: 'height',
	/**
	 * The value of width (or height) of the element. Updated every time the animation starts
	 * @type {number}
	 */
	_property_value: 0,

	init: function(config, target) {

		this.Emulated$init(config, target);

		if (config.property) {
			this._property = config.property;
		}

	},

	_start: function() {

		var Element = Firestorm.Element;

		if (this._is_reversed) { // collapse an element that is currently expanded

			// explicitly set the height/width on the element to make transition happen
			this._property_value = Element.getSize(this._target)[(this._property == 'width') ? 'x' : 'y'];
			Element.setStyle(this._target, this._property, '' + this._property_value);
			this._target.offsetHeight; // force redraw to bypass browser optimizations
			Element.addClass(this._target, 'collapsing');
			Element.removeClasses(this._target, ['collapse', 'in']);
			Element.setStyle(this._target, this._property, '0');

		} else { // expand a collapsed element

			Element.removeClass(this._target, 'collapse');
			Element.setStyle(this._target, this._property, 'auto');
			this._property_value = Element.getSize(this._target)[(this._property == 'width') ? 'x' : 'y'];
			Element.setStyle(this._target, this._property, '0');
			this._target.offsetHeight; // force redraw to bypass browser optimizations
			Element.addClass(this._target, 'collapsing');
			Element.setStyle(this._target, this._property, '' + this._property_value);

		}

	},

	_end: function() {

		var Element = Firestorm.Element;

		if (this._is_reversed) {

			Element.removeClass(this._target, 'collapsing');
			Element.addClass(this._target, 'collapse');

		} else {

			Element.removeClass(this._target, 'collapsing');
			Element.addClasses(this._target, ['collapse', 'in']);
			Element.setStyle(this._target, this._property, 'auto');

		}

	},

	_reverse: function() {

		if (this._is_reversed) {

			Firestorm.Element.setStyle(this._target, this._property, '' + this._property_value);

		} else {

			Firestorm.Element.setStyle(this._target, this._property, '0');

		}

	}

});

Lava.define(
'Lava.system.Serializer',
/**
 * Pretty-print any JavaScript object into string, which can be eval()'ed to reconstruct original object
 * @lends Lava.system.Serializer#
 */
{

	Shared: ['_complex_types', '_callback_map'],

	/**
	 * Used to pretty-print values in objects
	 * @type {Object.<string, true>}
	 */
	_complex_types: {
		array: true,
		'object': true,
		'function': true,
		regexp: true
	},

	/**
	 * Concrete serializers for each value type
	 * @type {Object.<string, string>}
	 */
	_callback_map: {
		string: '_serializeString',
		array: '_serializeArray',
		'object': '_serializeObject',
		'function': '_serializeFunction',
		boolean: '_serializeBoolean',
		number: '_serializeNumber',
		regexp: '_serializeRegexp',
		'null': '_serializeNull',
		'undefined': '_serializeUndefined'
	},

	/**
	 * If you know that you serialize objects with only valid property names (all characters are alphanumeric),
	 * you may turn this off
	 * @define {boolean}
	 */
	_check_property_names: true,

	/**
	 * String, used to pad serialized objects for pretty-printing
	 * @type {string}
	 */
	_pad: '\t',

	/**
	 * Create Serializer instance
	 * @param {?_cSerializer} config
	 */
	init: function(config) {

		if (config) {
			if (config.check_property_names === false) this._check_property_names = false;
		}

		this._serializeFunction = (config && config.pretty_print_functions)
			? this._serializeFunction_PrettyPrint
			: this._serializeFunction_Normal

	},

	/**
	 * Serialize any value
	 * @param {*} value
	 * @returns {string}
	 */
	serialize: function(value) {

		return this._serializeValue(value, '');

	},

	/**
	 * Perform value serialization
	 * @param {*} value
	 * @param {string} padding The initial padding for JavaScript code
	 * @returns {string}
	 */
	_serializeValue: function(value, padding) {

		var type = Firestorm.getType(value),
			result;

		if (Lava.schema.DEBUG && !(type in this._callback_map)) Lava.t("Unsupported type for serialization: " + type);

		result = this[this._callback_map[type]](value, padding);

		return result;

	},

	/**
	 * Perform serialization of an array
	 * @param {Array} data
	 * @param {string} padding
	 * @returns {string}
	 */
	_serializeArray: function(data, padding) {

		var tempResult = [],
			i = 0,
			count = data.length,
			child_padding = padding + "\t",
			result;

		if (count == 0) {

			result = '[]';

		} else if (count == 1) {

			result = '[' + this._serializeValue(data[i], padding) + ']';

		} else {

			for (; i < count; i++) {

				tempResult.push(this._serializeValue(data[i], child_padding));

			}

			result = '[' + "\n\t" + padding + tempResult.join(",\n\t" + padding) + "\n" + padding + ']';

		}

		return result;

	},

	/**
	 * Turn a string into it's JavaScript representation
	 * @param {string} data
	 * @returns {string}
	 */
	_serializeString: function(data) {

		return Firestorm.String.quote(data);

	},

	/**
	 * Serialize an object
	 * @param {Object} data
	 * @param {string} padding
	 * @returns {string}
	 */
	_serializeObject: function(data, padding) {

		var tempResult = [],
			child_padding = padding + "\t",
			name,
			type,
			result,
			is_complex = false,
			only_key = null,
			is_empty = true;

		// this may be faster than using Object.keys(data), but I haven't done speed comparison yet.
		// Purpose of the following code:
		// 1) if object has something in it then 'is_empty' will be set to false
		// 2) if there is only one property in it, then 'only_key' will contain it's name
		for (name in data) {
			if (only_key !== null) { // strict comparison - in case the key is valid, but evaluates to false
				only_key = null;
				break;
			}
			is_empty = false;
			only_key = name;
		}

		if (only_key) {

			type = Firestorm.getType(data[only_key]);

			if (type in this._complex_types) {
				is_complex = true;
			}

		}

		if (is_empty) {

			result = '{}';

		} else if (only_key && !is_complex) {

			// simple values can be written in one line
			result = '{' + this._serializeObjectProperty(only_key, data[only_key], child_padding) + '}';

		} else {

			for (name in data) {

				tempResult.push(
					this._serializeObjectProperty(name, data[name], child_padding)
				);

			}

			result = '{' + "\n\t" + padding + tempResult.join(",\n\t" + padding) + "\n" + padding + '}';

		}

		return result;

	},

	/**
	 * Serialize one key-value pair in an object
	 * @param {string} name
	 * @param {*} value
	 * @param {string} padding
	 * @returns {string}
	 */
	_serializeObjectProperty: function(name, value, padding) {

		var type = Firestorm.getType(value);

		// if you serialize only Lava configs, then most likely you do not need this check,
		// cause the property names in configs are always valid.
		if (this._check_property_names && (!Lava.VALID_PROPERTY_NAME_REGEX.test(name) || Lava.JS_KEYWORDS.indexOf(name) != -1)) {

			name = Firestorm.String.quote(name);

		}

		return name + ': ' + this[this._callback_map[type]](value, padding);

	},

	/**
	 * Serialize a function. Default method, which is replaced in constructor.
	 * @param {function} data
	 * @returns {string}
	 */
	_serializeFunction: function(data) {

		Lava.t();

	},

	/**
	 * Serialize a function with exact source code.
	 * @param {function} data
	 * @returns {string}
	 */
	_serializeFunction_Normal: function(data) {

		var result = data + '';

		// when using new Function() constructor, it's automatically named 'anonymous' in Chrome && Firefox
		if (result.substr(0, 18) == 'function anonymous') {
			result = 'function' + result.substr(18);
		}

		return result;

	},

	/**
	 * Serialize function, then pad it's source code. Is not guaranteed to produce correct results,
	 * so may be used only for pretty-printing of source code for browser.
	 *
	 * @param {function} data
	 * @param {string} padding
	 * @returns {string}
	 */
	_serializeFunction_PrettyPrint: function(data, padding) {

		var result = this._serializeFunction_Normal(data),
			lines = result.split(/\r?\n/),
			last_line = lines[lines.length - 1],
			tabs,
			num_tabs,
			i = 1,
			count = lines.length;

		if (/^\t*\}$/.test(last_line)) {
			if (last_line.length > 1) { // if there are tabs
				tabs = last_line.substr(0, last_line.length - 1);
				num_tabs = tabs.length;
				for (; i < count; i++) {
					if (lines[i].indexOf(tabs) == 0) {
						lines[i] = lines[i].substr(num_tabs);
					}
				}
			}
			lines.pop();
			result = lines.join('\r\n\t' + padding) + '\r\n' + padding + last_line;
		}

		return result;

	},

	/**
	 * Turn a boolean into string
	 * @param {boolean} data
	 * @returns {string}
	 */
	_serializeBoolean: function(data) {

		return data.toString();

	},

	/**
	 * Turn a number into string
	 * @param {number} data
	 * @returns {string}
	 */
	_serializeNumber: function(data) {

		return data.toString();

	},

	/**
	 * Turn a regexp into string
	 * @param {RegExp} data
	 * @returns {string}
	 */
	_serializeRegexp: function(data) {

		return data.toString();

	},

	/**
	 * Return <str>"null"</str>
	 * @returns {string}
	 */
	_serializeNull: function() {

		return 'null';

	},

	/**
	 * Return <str>"undefined"</str>
	 * @returns {string}
	 */
	_serializeUndefined: function() {

		return 'undefined';

	}

});

/**
 * Values were removed from collection
 * @event Lava.system.CollectionAbstract#items_removed
 * @type {Object}
 * @property {Array.<number>} uids Unique IDs of values, internal to this instance
 * @property {array.<*>} values Values, that were removed
 * @property {Array.<string>} names Names (keys) of values that were removed
 */

/**
 * Fires when either content or order of items in collection changes
 * @event Lava.system.Enumerable#collection_changed
 */

Lava.define('Lava.system.CollectionAbstract',
/**
 * Base class for Enumerable, containing all methods, that do not require UID generation
 * @lends Lava.system.CollectionAbstract#
 * @extends Lava.mixin.Properties#
 */
{

	Extends: 'Lava.mixin.Properties',

	/**
	 * To tell other classes that this is instance of Enumerable
	 * @const
	 */
	isCollection: true,

	/**
	 * Unique identifiers for values, internal to this instance of enumerable. Note: they are not globally unique, just to this instance
	 * @type {Array.<number>}
	 */
	_data_uids: [],
	/**
	 * Values, stored in this Enumerable
	 * @type {Array.<*>}
	 */
	_data_values: [],
	/**
	 * Holds object keys, when Enumerable was constructed from object. Each name corresponds to it's value
	 * @type {Array.<string>}
	 */
	_data_names: [],
	/**
	 * Count of items in Enumerable instance
	 * @type {number}
	 */
	_count: 0,

	/**
	 * Global unique identifier of this instance
	 * @type {_tGUID}
	 */
	guid: null,

	/**
	 * Used in editing operations to set `_count` and fire changed events for <str>"length"</str> property
	 * @param {number} new_length
	 */
	_setLength: function(new_length) {

		this._count = new_length;
		this.firePropertyChangedEvents('length');

	},

	/**
	 * Does it have any items
	 * @returns {boolean} True if there are no items in collection
	 */
	isEmpty: function() {

		return this._count == 0;

	},

	/**
	 * Get current item count
	 * @returns {number} Get `_count`
	 */
	getCount: function() {

		return this._count;

	},

	/**
	 * The only supported property is <str>"length"</str>
	 * @param {string} name
	 * @returns {number} Returns `_count` for <str>"length"</str> property
	 */
	get: function(name) {

		return (name == 'length') ? this._count : null;

	},

	/**
	 * Get a copy of local UIDs array
	 * @returns {Array.<number>} `_data_uids`
	 */
	getUIDs: function() {

		// we need to copy the local array, to protect it from being altered outside of the class
		return this._data_uids.slice();

	},

	/**
	 * Get a copy of local values array
	 * @returns {Array.<*>} `_data_values`
	 */
	getValues: function() {

		return this._data_values.slice();

	},

	/**
	 * Get a copy of local names array
	 * @returns {Array.<string>} `_data_names`
	 */
	getNames: function() {

		return this._data_names.slice();

	},

	/**
	 * Create an object with [uid] => value structure
	 * @returns {Object.<number, *>} Object with local UIDs as keys and corresponding values
	 */
	getValuesHash: function() {

		var result = {},
			i = 0;

		for (; i < this._count; i++) {

			result[this._data_uids[i]] = this._data_values[i];

		}

		return result;

	},

	/**
	 * Get an object with local UIDs as keys and their indices in local array as values.
	 * The result map is valid until any modification to Enumerable
	 * @returns {Object.<number, number>} An object with keys being collection's internal UIDs and their indices as values
	 */
	getUIDToIndexMap: function() {

		var result = {},
			i = 0;

		for (; i < this._count; i++) {

			result[this._data_uids[i]] = i;

		}

		return result;

	},

	/**
	 * Get the value, that corresponds to given UID
	 * @param {number} uid
	 * @returns {*}
	 */
	getValueByLocalUID: function(uid) {

		var index = this._data_uids.indexOf(uid);

		return (index != -1) ? this._data_values[index] : null;

	},

	/**
	 * Get UID at given `index`
	 * @param {number} index
	 * @returns {number} Requested UID
	 */
	getUIDAt: function(index) {

		return this._data_uids[index];

	},

	/**
	 * Get value at given `index`
	 * @param {number} index
	 * @returns {*} Requested value
	 */
	getValueAt: function(index) {

		return this._data_values[index];

	},

	/**
	 * Get name at given `index`
	 * @param {number} index
	 * @returns {string}
	 */
	getNameAt: function(index) {

		return this._data_names[index];

	},

	/**
	 * Does collection contain the `value`
	 * @param {*} value Value to search for
	 * @returns {boolean} <kw>true</kw>, if collection has given value
	 */
	containsValue: function(value) {

		return this._data_values.indexOf(value) != -1;

	},

	/**
	 * Does collection contain the given `uid`
	 * @param {number} uid
	 * @returns {boolean} <kw>true</kw>, if collection has given UID
	 */
	containsLocalUID: function(uid) {

		return this._data_uids.indexOf(uid) != -1;

	},

	/**
	 * Get index of given `value` in collection
	 * @param {*} value Value to search for
	 * @returns {number} Zero-based index of value in Enumerable, or -1, if value is not in array
	 */
	indexOfValue: function(value) {

		return this._data_values.indexOf(value);

	},

	/**
	 * Get index of given `uid` in the collection
	 * @param {number} uid Local UID to search for
	 * @returns {number} Zero-based index of uid in Enumerable, or -1, if uid is not in array
	 */
	indexOfUID: function(uid) {

		return this._data_uids.indexOf(uid);

	},

	/**
	 * Will throw exception. You can not set any properties to Enumerable instance
	 */
	set: function() {

		Lava.t('set on Enumerable is not permitted');

	},

	/**
	 * Remove a value from the end of the collection
	 * @returns {*} Removed value
	 */
	pop: function() {

		var old_uid = this._data_uids.pop(),
			old_value = this._data_values.pop(),
			old_name = this._data_names.pop(),
			count = this._count - 1;

		this._setLength(count);

		this._fire('items_removed', {
			uids: [old_uid],
			values: [old_value],
			names: [old_name]
		});

		this._fire('collection_changed');

		return old_value;
	},

	/**
	 * Removes the first occurrence of value within collection
	 *
	 * @param {*} value
	 * @returns {boolean} <kw>true</kw>, if the value existed
	 */
	removeValue: function(value) {

		var result = false,
			index = this._data_values.indexOf(value);

		if (index != -1) {
			this.removeAt(index);
			result = true;
		}

		return result;

	},

	/**
	 * Swap values, names and UIDs at given index. Does not generate {@link Lava.system.CollectionAbstract#event:items_removed}
	 * and {@link Lava.system.Enumerable#event:items_added} events, just {@link Lava.system.Enumerable#event:collection_changed}
	 * @param {number} index_a First index to swap
	 * @param {number} index_b Second index to swap
	 */
	swap: function(index_a, index_b) {

		if (index_a > this._count || index_b > this._count) Lava.t("Index is out of range (2)");

		var swap = Firestorm.Array.swap;

		swap(this._data_uids, index_a, index_b);
		swap(this._data_values, index_a, index_b);
		swap(this._data_names, index_a, index_b);

		this._fire('collection_changed');

	},

	/**
	 * Execute the `callback` for each item in collection
	 * @param {_tEnumerableEachCallback} callback
	 */
	each: function(callback) {

		// everything is copied in case the collection is modified during the cycle
		var values = this._data_values.slice(),
			uids = this._data_uids.slice(),
			names = this._data_names.slice(),
			i = 0,
			count = this._count;

		for (; i < count; i++) {

			if (callback(values[i], names[i], uids[i], i) === false) {
				break;
			}

		}

	},

	/**
	 * Pass each value to callback and leave only those, for which it has returned <kw>true</kw>.
	 * Remove the others
	 *
	 * @param {_tEnumerableFilterCallback} callback
	 */
	filter: function(callback) {

		var i = 0,
			count = this._count,
			result = this._createHelperStorage(),
			removed = this._createHelperStorage();

		for (; i < count; i++) {

			if (callback(this._data_values[i], this._data_names[i], this._data_uids[i], i)) {

				result.push(this._data_uids[i], this._data_values[i], this._data_names[i]);

			} else {

				removed.push(this._data_uids[i], this._data_values[i], this._data_names[i]);

			}

		}

		this._assignStorage(result);
		this._setLength(this._data_uids.length);

		removed.uids.length && this._fire('items_removed', removed.getObject());

		this._fire('collection_changed');

	},

	/**
	 * Sort items in collection
	 * @param {_tLessCallback} less A callback to compare items
	 * @param {string} [algorithm_name] The name of the sorting method from Lava.algorithms.sorting
	 */
	sort: function(less, algorithm_name) {

		this._sort(less || Lava.DEFAULT_LESS, this._data_values, algorithm_name);

	},

	/**
	 * Sort items by the array of names
	 * @param {_tLessCallback} less A callback to compare items
	 * @param {string} [algorithm_name] The name of the sorting method from {@link Lava.algorithms.sorting}
	 */
	sortByNames: function(less, algorithm_name) {

		this._sort(less || Lava.DEFAULT_LESS, this._data_names, algorithm_name);

	},

	/**
	 * Perform sorting
	 * @param {_tLessCallback} less A callback to compare items
	 * @param {Array} values
	 * @param {string} [algorithm_name]
	 */
	_sort: function(less, values, algorithm_name) {

		var indices = [],
			i = 0,
			_less;

		_less = function(a, b) {

			// a and b are indices, not actual values
			return less(values[a], values[b]);

		};

		for (; i < this._count; i++) {

			indices.push(i);

		}

		indices = Lava.algorithms.sorting[algorithm_name || Lava.schema.DEFAULT_STABLE_SORT_ALGORITHM](indices, _less);

		this.reorder(indices);

	},

	/**
	 * Sort items by premade array of new item indices
	 * @param {Array.<number>} new_indices
	 */
	reorder: function(new_indices) {

		var i = 0,
			result = this._createHelperStorage(),
			index,
			verification = {};

		if (Lava.schema.DEBUG && new_indices.length != this._count) throw "reorder: new item count is less than current";

		for (; i < this._count; i++) {

			index = new_indices[i];
			result.push(this._data_uids[index], this._data_values[index], this._data_names[index]);

			if (Lava.schema.DEBUG) {
				// duplicate UIDs may break a lot of functionality, in this class and outside
				if (index in verification) Lava.t("Malformed index array");
				verification[index] = null;
			}

		}

		this._assignStorage(result);
		this._fire('collection_changed');

	},

	/**
	 * Remove range of indices from collection and return removed values
	 * @param {number} start_index
	 * @param {number} count
	 * @returns {Array} Removed values
	 */
	removeRange: function(start_index, count) {

		if (count <= 0) Lava.t("Invalid item count supplied for removeRange");
		if (start_index + count >= this._count + 1) Lava.t("Index is out of range");

		var removed_uids = this._data_uids.splice(start_index, count),
			removed_values = this._data_values.splice(start_index, count),
			removed_names = this._data_names.splice(start_index, count);

		this._setLength(this._count - count);

		this._fire('items_removed', {
			uids: removed_uids,
			values: removed_values,
			names: removed_names
		});

		this._fire('collection_changed');

		return removed_values;

	},

	/**
	 * Remove all values and return them
	 * @returns {Array} Values that were in collection
	 */
	removeAll: function() {

		return (this._count > 0) ? this.removeRange(0, this._count) : [];

	},

	/**
	 * Remove value at `index`
	 * @param {number} index Index to remove
	 * @returns {*} The removed value
	 */
	removeAt: function(index) {

		return this.removeRange(index, 1)[0];

	},

	/**
	 * Remove value from the beginning of collection
	 * @returns {*} The removed value
	 */
	shift: function() {

		return this.removeRange(0, 1)[0];

	},

	/**
	 * Create an internal helper object, which allows to write less code
	 * @returns {_cEnumerableHelperStorage} Helper object
	 */
	_createHelperStorage: function() {

		return {
			uids: [],
			values: [],
			names: [],
			push: function(uid, value, name) {
				this.uids.push(uid);
				this.values.push(value);
				this.names.push(name);
			},
			getObject: function() {
				return {
					uids: this.uids,
					values: this.values,
					names: this.names
				}
			}
		}

	},

	/**
	 * Take the temporary helper object, returned from {@link Lava.system.Enumerable#_createHelperStorage}
	 * and assign it's corresponding arrays to local arrays
	 * @param {_cEnumerableHelperStorage} storage Temporary helper object
	 */
	_assignStorage: function(storage) {

		this._data_uids = storage.uids;
		this._data_values = storage.values;
		this._data_names = storage.names;

	},

	/**
	 * Free resources and make this instance unusable
	 */
	destroy: function() {

		this._fire('destroy');

	}

});

/**
 * Values were added to collection
 * @event Lava.system.Enumerable#items_added
 * @type {Object}
 * @property {Array.<number>} uids Internal unique IDs that were generated for added values
 * @property {array.<*>} values Values, that were added
 * @property {Array.<string>} names Names (keys) of values that were added
 */

Lava.define(
'Lava.system.Enumerable',
/**
 * Array-like collection of elements, suitable for scope binding
 *
 * @lends Lava.system.Enumerable#
 * @extends Lava.system.CollectionAbstract#
 */
{

	Extends: 'Lava.system.CollectionAbstract',

	/**
	 * To tell other classes that this is instance of Enumerable
	 * @const
	 */
	isEnumerable: true,

	/**
	 * Counter for next internal UID
	 * @type {number}
	 */
	_uid: 1,

	/**
	 * Creates Enumerable instance and fills initial data from `data_source`
	 * @param {(Array|Object|Lava.mixin.Properties|Lava.system.Enumerable)} data_source
	 */
	init: function(data_source) {

		this.guid = Lava.guid++;

		if (data_source) {

			var count = 0,
				i = 0,
				name;

			if (Array.isArray(data_source)) {

				for (count = data_source.length; i < count; i++) {

					this._push(this._uid++, data_source[i], null);

				}

			} else if (data_source.isCollection) {

				this._data_names = data_source.getNames();
				this._data_values = data_source.getValues();
				for (count = this._data_values.length; i < count; i++) {

					this._data_uids.push(this._uid++);

				}

			} else {

				if (data_source.isProperties) {

					data_source = data_source.getProperties();

				}

				for (name in data_source) {

					this._push(this._uid++, data_source[name], name);

				}

			}

			this._count = this._data_uids.length;

		}

	},

	/**
	 * Update the collection from `data_source`
	 * @param {(Array|Object|Lava.mixin.Properties|Lava.system.Enumerable)} data_source
	 */
	refreshFromDataSource: function(data_source) {

		if (Lava.schema.DEBUG && typeof(data_source) != 'object') Lava.t("Wrong argument passed to updateFromSourceObject");

		if (Array.isArray(data_source)) {

			this._updateFromArray(data_source, []);

		} else if (data_source.isCollection) {

			this._updateFromEnumerable(data_source);

		} else {

			this._updateFromObject(data_source.isProperties ? data_source.getProperties() : data_source);

		}

	},

	/**
	 * Remove all current values and add values from array
	 * @param {Array} source_array
	 * @param {Array.<string>} names
	 */
	_updateFromArray: function(source_array, names) {

		var i = 0,
			count = source_array.length,
			items_removed_argument = {
				uids: this._data_uids,
				values: this._data_values,
				names: this._data_names
			};

		this._data_uids = [];
		this._data_values = [];
		this._data_names = [];

		for (; i < count; i++) {
			this._push(this._uid++, source_array[i], names[i] || null);
		}

		this._setLength(count);

		this._fire('items_removed', items_removed_argument);

		this._fire('items_added', {
			uids: this._data_uids.slice(),
			values: this._data_values.slice(),
			names: this._data_names.slice()
		});

		this._fire('collection_changed');

	},

	/**
	 * Same as `_updateFromArray`, but uses names from `data_source`
	 * @param {Lava.system.Enumerable} data_source
	 */
	_updateFromEnumerable: function(data_source) {

		this._updateFromArray(data_source.getValues(), data_source.getNames());

	},

	/**
	 * Compares item names with object keys, removing values without names and values that do not match.
	 * Adds new values from `source_object`
	 * @param {Object} source_object
	 */
	_updateFromObject: function(source_object) {

		var i = 0,
			name,
			uid,
			result = this._createHelperStorage(),
			removed = this._createHelperStorage(),
			added = this._createHelperStorage();

		for (; i < this._count; i++) {

			name = this._data_names[i];
			if (name != null && (name in source_object)) {

				if (source_object[name] === this._data_values[i]) {

					result.push(this._data_uids[i], this._data_values[i], this._data_names[i]);

				} else {

					// Attention: the name has NOT changed, but it will be present in both added and removed names!
					removed.push(this._data_uids[i], this._data_values[i], name);
					uid = this._uid++;
					result.push(uid, source_object[name], name);
					added.push(uid, source_object[name], name);

				}

			} else {

				removed.push(this._data_uids[i], this._data_values[i], this._data_names[i]);

			}

		}

		for (name in source_object) {

			if (this._data_names.indexOf(name) == -1) {

				uid = this._uid++;
				result.push(uid, source_object[name], name);
				added.push(uid, source_object[name], name);

			}

		}

		this._assignStorage(result);
		this._setLength(this._data_uids.length);

		removed.uids.length && this._fire('items_removed', removed.getObject());
		added.uids.length && this._fire('items_added', added.getObject());
		this._fire('collection_changed');

	},

	/**
	 * Append the given uid, value and name to corresponding instance arrays: `_data_uids`, `_data_values` and `_data_names`
	 * @param {number} uid
	 * @param {*} value
	 * @param {string} name
	 */
	_push: function(uid, value, name) {

		this._data_uids.push(uid);
		this._data_values.push(value);
		this._data_names.push(name);

	},

	/**
	 * Replace the corresponding `value` and `name` at specified `index`, generating a new UID
	 * @param {number} index Index of value in Enumerable
	 * @param {*} value New value for given index
	 * @param {number} [name] New name for the value
	 */
	replaceAt: function(index, value, name) {

		if (index > this._count) Lava.t("Index is out of range");

		var old_uid = this._data_uids[index],
			old_value = this._data_values[index],
			old_name = this._data_names[index],
			new_uid = this._uid++;

		this._data_uids[index] = new_uid;
		this._data_values[index] = value;
		if (name) {
			this._data_names[index] = name;
		}

		this._fire('items_removed', {
			uids: [old_uid],
			values: [old_value],
			names: [old_name]
		});

		this._fire('items_added', {
			uids: [new_uid],
			values: [value],
			names: [this._data_names[index]]
		});

		this._fire('collection_changed');

	},

	/**
	 * Add the name/value pair to the end of the collection, generating a new UID
	 * @param {*} value New value to add
	 * @param {string} [name] New name
	 * @returns {number} New collection `_count`
	 */
	push: function(value, name) {

		var count = this._count,
			new_uid = this._uid++;

		this._push(new_uid, value, name || null);

		this._setLength(count + 1);

		this._fire('items_added', {
			uids: [new_uid],
			values: [value],
			names: [name || null]
		});

		this._fire('collection_changed');

		return this._count; // after _setLength() this was incremented by one

	},

	/**
	 * If value does not exist - push it into collection
	 * @param {*} value New value
	 * @param {string} [name] New name
	 * @returns {boolean} <kw>true</kw>, if value did not exist and was included
	 */
	includeValue: function(value, name) {

		var result = false,
			index = this._data_values.indexOf(value);

		if (index == -1) {
			this.push(value, name);
			result = true;
		}

		return result;

	},

	/**
	 * Insert a sequence of values into collection
	 * @param {number} start_index Index of the beginning of new values. Must be less or equal to collection's `_count`
	 * @param {Array.<*>} values New values
	 * @param [names] Names that correspond to each value
	 */
	insertRange: function(start_index, values, names) {

		if (start_index >= this._count) Lava.t("Index is out of range");

		var i = 0,
			count = values.length,
			added_uids = [],
			added_names = [];

		if (names) {

			if (count != names.length) Lava.t("If names array is provided, it must be equal length with values array.");
			added_names = names;

		} else {

			for (; i < count; i++) {

				added_names.push(null);

			}

		}

		for (; i < count; i++) {

			added_uids.push(this._uid++);

		}

		if (start_index == 0) {

			// prepend to beginning
			this._data_uids = added_uids.concat(this._data_uids);
			this._data_values = values.concat(this._data_values);
			this._data_names = added_names.concat(this._data_names);

		} else if (start_index == this._count - 1) {

			// append to the end
			this._data_uids = this._data_uids.concat(added_uids);
			this._data_values = this._data_values.concat(values);
			this._data_names = this._data_names.concat(added_names);

		} else {

			this._data_uids = this._data_uids.slice(0, start_index).concat(added_uids).concat(this._data_uids.slice(start_index));
			this._data_values = this._data_values.slice(0, start_index).concat(values).concat(this._data_values.slice(start_index));
			this._data_names = this._data_names.slice(0, start_index).concat(added_names).concat(this._data_names.slice(start_index));

		}

		this._setLength(this._count + count);

		this._fire('items_added', {
			uids: added_uids,
			values: values,
			names: added_names
		});

		this._fire('collection_changed');

	},

	/**
	 * Append new values to the end of the collection
	 * @param {Array.<*>} values New values
	 * @param {Array.<string>} [names] Corresponding names
	 */
	append: function(values, names) {

		this.insertRange(this._count, values, names);

	},

	/**
	 * Insert a value at index
	 * @param {number} index Index to insert at
	 * @param {*} value New value
	 * @param {string} [name] New name
	 */
	insertAt: function(index, value, name) {

		this.insertRange(index, [value], [name]);

	},

	/**
	 * Put the value at the beginning of collection
	 * @param {*} value New value
	 * @param {string} [name] New name
	 */
	unshift: function(value, name) {

		this.insertRange(0, [value], [name]);

	}

});

Lava.define(
'Lava.system.DataView',
/**
 * Holds a subset of values from {@link Lava.system.Enumerable}, preserving item UIDs.
 * Can remove, filter and sort existing values, but can't be used to add new values.
 *
 * @lends Lava.system.DataView#
 * @extends Lava.system.CollectionAbstract#
 */
{

	Extends: 'Lava.system.CollectionAbstract',

	/**
	 * To tell other classes that this is instance of Enumerable
	 * @type {boolean}
	 * @const
	 */
	isDataView: true,

	/**
	 * The existing collection, which provides data for this instance
	 * @type {Lava.system.CollectionAbstract}
	 */
	_data_source: null,

	/**
	 * Create DataView instance
	 * @param {Lava.system.CollectionAbstract} data_source
	 */
	init: function(data_source) {

		this.guid = Lava.guid++;
		data_source && this.refreshFromDataSource(data_source);

	},

	/**
	 * Refresh the DataView from it's Enumerable
	 */
	refresh: function() {

		this._data_names = this._data_source.getNames();
		this._data_values = this._data_source.getValues();
		this._data_uids = this._data_source.getUIDs();
		this._count = this._data_uids.length;
		this._fire('collection_changed');

	},

	/**
	 * Set new `_data_source`
	 * @param {Lava.system.CollectionAbstract} data_source
	 */
	setDataSource: function(data_source) {

		if (Lava.schema.DEBUG && !data_source.isCollection) Lava.t("Wrong argument supplied for DataView constructor");
		this._data_source = data_source;

	},

	/**
	 * Set `_data_source` and refresh from it
	 * @param {Lava.system.CollectionAbstract} data_source
	 */
	refreshFromDataSource: function (data_source) {

		this.setDataSource(data_source);
		this.refresh();

	},

	/**
	 * Get `_data_source`
	 * @returns {Lava.system.CollectionAbstract}
	 */
	getDataSource: function() {

		return this._data_source;

	}

});

Lava.define(
'Lava.system.Template',
/**
 * Renderable collection of views and strings
 *
 * @lends Lava.system.Template#
 * @implements _iViewHierarchyMember
 */
{

	Shared: ['_block_handlers_map'],

	/**
	 * This class is instance of Lava.system.Template
	 */
	isTemplate: true,

	/**
	 * The nearest widget in hierarchy
	 * @type {Lava.widget.Standard}
	 */
	_widget: null,
	/**
	 * The owner (parent) view
	 * @type {Lava.view.Abstract}
	 */
	_parent_view: null,
	/**
	 * Instance config
	 * @type {_tTemplate}
	 */
	_config: null,
	/**
	 * Count of renderable elements in template instance
	 * @type {number}
	 */
	_count: 0,
	/**
	 * The renderable items, constructed from `_config`
	 * @type {Array.<_tRenderable>}
	 */
	_content: [],
	/**
	 * Is the template currently in DOM
	 * @type {boolean}
	 */
	_is_inDOM: false,
	/**
	 * Global unique ID of the instance
	 * @type {_tGUID}
	 */
	guid: null,

	/**
	 * When creating content: handlers for every item type in `_config`
	 * @type {Object.<string, string>}
	 */
	_block_handlers_map: {
		'string': '_createDirect',
		view: '_createView',
		widget: '_createView',
		include: '_createInclude',
		static_value: '_createStaticValue',
		static_eval: '_createStaticEval',
		static_tag: '_createStaticTag'
	},

	/**
	 * Create an instance of Template. Create content from config
	 *
	 * @param {_tTemplate} template_config Config for content
	 * @param {Lava.widget.Standard} widget Nearest widget in hierarchy
	 * @param {Lava.view.Abstract} parent_view Owner (parent) view
	 * @param {Object} [child_properties] The properties to set to child views
	 */
	init: function(template_config, widget, parent_view, child_properties) {

		this.guid = Lava.guid++;
		this._parent_view = parent_view;
		this._widget = widget;
		this._config = template_config;

		this._createChildren(this._content, template_config, [], child_properties);
		this._count = this._content.length;

	},

	/**
	 * Create items from config and put them in `result`
	 * @param {Array.<_tRenderable>} result Where to put created items
	 * @param {_tTemplate} children_config Config for the Template
	 * @param {Array.<string>} include_name_stack Used to protect from recursive includes
	 * @param {Object} properties The properties for child views
	 */
	_createChildren: function(result, children_config, include_name_stack, properties) {

		var i = 0,
			count = children_config.length,
			childConfig,
			type;

		for (; i < count; i++) {

			childConfig = children_config[i];
			type = typeof(childConfig);
			if (type == 'object') type = childConfig.type;

			if (Lava.schema.DEBUG && !(type in this._block_handlers_map)) Lava.t("Unsupported template item type: " + type);
			this[this._block_handlers_map[type]](result, childConfig, include_name_stack, properties);

		}

	},

	/**
	 * Handler for strings: push it into result
	 * @param {Array.<_tRenderable>} result Created items
	 * @param {string} childConfig String from Template config
	 */
	_createDirect: function(result, childConfig) {

		result.push(childConfig);

	},

	/**
	 * Handler for views. Create a view and push it into result
	 * @param {Array.<_tRenderable>} result
	 * @param {(_cView|_cWidget)} childConfig Config vor the view
	 * @param {Array.<string>} include_name_stack Used to protect from recursive includes
	 * @param {Object} properties Properties for that view
	 */
	_createView: function(result, childConfig, include_name_stack, properties) {

		var constructor = Lava.ClassManager.getConstructor(childConfig['class'], 'Lava.view'),
			view = new constructor(
				childConfig,
				this._widget,
				this._parent_view,
				this, // template
				properties
			);

		view.template_index = result.push(view) - 1;

	},

	/**
	 * Handler for includes. Get include from widget, then create and append all items from include
	 * @param {Array.<_tRenderable>} result
	 * @param {_cInclude} child_config
	 * @param {Array.<string>} include_name_stack
	 * @param {Object} properties
	 */
	_createInclude: function(result, child_config, include_name_stack, properties) {

		if (include_name_stack.indexOf(child_config.name) != -1) Lava.t("Infinite include recursion");
		var include = Lava.view_manager.getInclude(this._parent_view, child_config);
		if (Lava.schema.DEBUG && include == null) Lava.t("Include not found: " + child_config.name);

		include_name_stack.push(child_config.name);
		this._createChildren(result, include, include_name_stack, properties);
		include_name_stack.pop();

	},

	/**
	 * Handler for static_value: get the value from widget resources and push it into result
	 * @param {Array.<_tRenderable>} result
	 * @param {_cStaticValue} childConfig
	 */
	_createStaticValue: function(result, childConfig) {

		var resource_id = childConfig.resource_id,
			resource_owner = Lava.view_manager.locateTarget(this._widget, resource_id.locator_type, resource_id.locator),
			resource_value,
			type;

		if (!Lava.schema.RESOURCES_ENABLED) Lava.t("static_value: resources are disabled");
		if (Lava.schema.DEBUG && !resource_owner) Lava.t("Resource owner not found: " + resource_id.locator_type + '=' + resource_id.locator);

		resource_value = resource_owner.getResource(resource_id.name);
		if (Lava.schema.DEBUG && !resource_value) Lava.t("static_value: resource not found: " + resource_id.locator_type + '=' + resource_id.locator);
		if (Lava.schema.DEBUG && ['string', 'number', 'boolean'].indexOf(Firestorm.getType(resource_value.value)) == -1) Lava.t("static_value: resource has wrong type");

		result.push(resource_value.value);

	},

	/**
	 * Handler for static_eval: evaluate the given Argument config and append evaluation result
	 * @param {Array.<_tRenderable>} result
	 * @param {_cStaticEval} childConfig
	 */
	_createStaticEval: function(result, childConfig) {

		var argument = new Lava.scope.Argument(childConfig.argument, this._view, this._widget);
		// if this happens - then you are probably doing something wrong
		if (argument.isWaitingRefresh()) {
			if (Lava.schema.DEBUG) Lava.t("static_eval wrong usage: created argument is dirty");
			Lava.logError("static_eval wrong usage: created argument is dirty");
		}
		result.push(argument.getValue + '');
		argument.destroy();

	},

	/**
	 * Handler for static tags: resolve it's resources, serialize it into string and push parts into result.
	 * The content of the tag is processed recursively
	 * @param {Array.<_tRenderable>} result
	 * @param {_cStaticTag} child_config
	 * @param {Array.<string>} include_name_stack
	 * @param {Object} properties
	 */
	_createStaticTag: function(result, child_config, include_name_stack, properties) {

		var resource_id = child_config.resource_id,
			resource_owner,
			container_resources,
			serialized_tag = '<' + child_config.name,
			result_styles = [],
			name,
			is_void = Lava.isVoidTag(child_config.name),

			static_properties,
			static_classes,
			static_styles;

		if (Lava.schema.RESOURCES_ENABLED) {
			resource_owner = Lava.view_manager.locateTarget(this._widget, resource_id.locator_type, resource_id.locator);
			if (Lava.schema.DEBUG && !resource_owner) Lava.t("Resource owner not found: " + resource_id.locator_type + '=' + resource_id.locator);
			container_resources = resource_owner.getResource(resource_id.name);
		}

		if (Lava.schema.DEBUG && !Lava.schema.RESOURCES_ENABLED) Lava.t("Unable to render a static container: resources are disabled");
		if (Lava.schema.DEBUG && !container_resources) Lava.t("Static container, resources not found: " + resource_id.name);
		if (Lava.schema.DEBUG && container_resources.type != 'container') Lava.t("Malformed/invalid container resource: " + resource_id.locator_type + '=' + resource_id.locator);

		static_properties = container_resources.value['static_properties'];
		static_classes = container_resources.value['static_classes'];
		static_styles = container_resources.value['static_styles'];

		if (static_properties) {
			serialized_tag += Lava.parsers.Common.renderTagAttributes(static_properties);
		}

		if (static_classes) {
			serialized_tag += ' class="' + static_classes.join(' ') + '"';
		}

		if (static_styles) {

			for (name in static_styles) {

				result_styles.push(name + ':' + static_styles);

			}

			serialized_tag += ' style="' + result_styles.join(';') + '"';

		}

		if (child_config.template) {

			if (Lava.schema.DEBUG && is_void) Lava.t();

			result.push(serialized_tag + '>');
			this._createChildren(result, child_config.template, include_name_stack, properties);
			result.push('</' + child_config.name + '>');

		} else {

			serialized_tag += is_void ? '/>' : '></' + child_config.name + '>';
			result.push(serialized_tag);

		}

	},

	/**
	 * Perform broadcast
	 * @param {string} function_name
	 */
	_broadcast: function(function_name) {

		for (var i = 0; i < this._count; i++) {

			if (this._content[i].isView) {

				this._content[i][function_name]();

			}

		}

	},

	/**
	 * Render template
	 * @returns {string} Rendered HTML
	 */
	render: function() {

		var buffer = '',
			i = 0,
			content = this._content;

		for (; i < this._count; i++) {

			if (typeof(content[i]) == 'string') {

				buffer += content[i];

			} else if (typeof(content[i]) == 'function') {

				Lava.t("Not implemented");

			} else {

				buffer += content[i].render();

			}

		}

		return buffer;

	},

	/**
	 * Broadcast <str>"broadcastRemove"</str> to instance content
	 */
	broadcastRemove: function() {

		if (this._is_inDOM) {

			this._is_inDOM = false;
			this._broadcast('broadcastRemove');

		}

	},

	/**
	 * Broadcast <str>"broadcastInDOM"</str> to instance content
	 */
	broadcastInDOM: function() {

		this._is_inDOM = true;
		this._broadcast('broadcastInDOM');

	},

	/**
	 * Set this property to all views inside `_content`
	 * @param {string} name Property name
	 * @param {*} value Property value
	 */
	batchSetProperty: function(name, value) {

		for (var i = 0; i < this._count; i++) {

			if (this._content[i].isView) {

				this._content[i].set(name, value);

			}

		}

	},

	/**
	 * Set properties to all views inside `_content`
	 * @param {Object} properties_object
	 */
	batchSetProperties: function(properties_object) {

		for (var i = 0; i < this._count; i++) {

			if (this._content[i].isView) {

				this._content[i].setProperties(properties_object);

			}

		}

	},

	/**
	 * Find first view in `_content` and return it
	 * @returns {Lava.view.Abstract} First view
	 */
	getFirstView: function() {

		return this._seekForwards(0);

	},

	/**
	 * Find last view in `_content` and return it
	 * @returns {Lava.view.Abstract} Last view
	 */
	getLastView: function() {

		return this._seekBackwards(this._count - 1);

	},

	/**
	 * Find a view, preceding the given one
	 * @param {Lava.view.Abstract} view Current view
	 * @returns {Lava.view.Abstract} Previous view
	 */
	getPreviousView: function(view) {

		return this._seekBackwards(view.template_index - 1);

	},

	/**
	 * Find next view
	 * @param {Lava.view.Abstract} view Current view
	 * @returns {Lava.view.Abstract} Next view
	 */
	getNextView: function(view) {

		return this._seekForwards(view.template_index + 1);

	},

	/**
	 * Algorithm to find next view
	 * @returns {Lava.view.Abstract} Next view from index `i`
	 */
	_seekForwards: function(i) {

		var result = null;

		while (i < this._count) {
			if (this._content[i].isView) {
				result = this._content[i];
				break;
			}
			i++;
		}

		return result;

	},

	/**
	 * Algorithm to find previous view
	 * @returns {Lava.view.Abstract} Previous view to index `i`
	 */
	_seekBackwards: function(i) {

		var result = null;

		while (i >= 0) {
			if (this._content[i].isView) {
				result = this._content[i];
				break;
			}
			i--;
		}

		return result;

	},

	/**
	 * Search `_content` and find all views with given label
	 * @param {string} label Label to search for
	 * @returns {Array.<Lava.view.Abstract>} Views with given label
	 */
	getViewsByLabel: function(label) {

		var result = [],
			i = 0;

		for (; i < this._count; i++) {

			if (this._content[i].isView && this._content[i].label == label) {

				result.push(this._content[i]);

			}

		}

		return result;

	},

	/**
	 * Find all widgets with given name inside `_content`
	 * @param {string} name Name to search for
	 * @returns {Array.<Lava.widget.Standard>} Found widgets
	 */
	getWidgetsByName: function(name) {

		var result = [],
			i = 0;

		for (; i < this._count; i++) {

			if (this._content[i].isWidget && this._content[i].name == name) {

				result.push(this._content[i]);

			}

		}

		return result;

	},

	/**
	 * Get `_count`
	 * @returns {number} `_count`
	 */
	getCount: function() {

		return this._count;

	},

	/**
	 * Return an item from `_content` at given index
	 * @param {number} index Index in `_content`
	 * @returns {_tRenderable} Requested item
	 */
	getAt: function(index) {

		return this._content[index];

	},

	/**
	 * Get `_is_inDOM`
	 * @returns {boolean}
	 */
	isInDOM: function() {

		return this._is_inDOM;

	},

	/**
	 * Free resources and make this instance unusable
	 */
	destroy: function() {

		this._broadcast('destroy');
		this._content = null;

	}

});
/**
 * Each time a DOM event is received, ViewManager assembles an array from the element, which is source of the event, and all it's parents.
 * "EVENTNAME" is replaced with actual event name, like "mouseover_stack_changed".
 * You must not modify the the argument of this event, but you can slice() it.
 *
 * @event Lava.system.ViewManager#EVENTNAME_stack_changed
 * @type {Array.<HTMLElement>}
 * @lava-type-description List of elements, with the first item in array being the event source,
 *  and all it's parents. Readonly.
 */

Lava.define(
'Lava.system.ViewManager',
/**
 * Refreshes views and routes view events and roles
 *
 * @lends Lava.system.ViewManager#
 * @extends Lava.mixin.Observable
 */
{

	Extends: 'Lava.mixin.Observable',

	/**
	 * Views and widgets, sorted by depth level
	 * @type {Array.<Array.<Lava.view.Abstract>>}
	 */
	_dirty_views: [],
	/**
	 * View refresh loop is in progress
	 * @type {boolean}
	 */
	_is_refreshing: false,

	/**
	 * Hash of all views with user-defined ID
	 * @type {Object.<string, Lava.view.Abstract>}
	 */
	_views_by_id: {},
	/**
	 * Hash of all views by their GUID
	 * @type {Object.<*, Lava.view.Abstract>}
	 */
	_views_by_guid: {},

	/**
	 * Global user-assigned handlers for unhandled roles. <role_name> => [widgets_that_will_handle_it]
	 * @type {Object.<string, Array.<Lava.widget.Standard>>}
	 */
	_global_role_targets: {},
	/**
	 * Global user-assigned handlers for unhandled events
	 * @type {Object.<string, Array.<Lava.widget.Standard>>}
	 */
	_global_event_targets: {},

	/**
	 * Used in mouse events processing algorithm
	 * @type {HTMLElement}
	 */
	_old_mouseover_target: null,
	/**
	 * Parents of `_old_mouseover_target` (and `_old_mouseover_target` itself)
	 * @type {Array.<HTMLElement>}
	 */
	_old_mouseover_view_stack: [],
	/**
	 * Used in mouse events processing algorithm
	 * @type {HTMLElement}
	 */
	_new_mouseover_target: null,
	/**
	 * Parents of `_new_mouseover_target` (and `_new_mouseover_target` itself)
	 * @type {Array.<HTMLElement>}
	 */
	_new_mouseover_view_stack: [],

	/**
	 * Counters for event consumers
	 * @type {Object.<string, number>}
	 */
	_event_usage_counters: {},
	/**
	 * Listeners from {@link Lava.Core} for each DOM event
	 * @type {Object.<string, _tListener>}
	 */
	_events_listeners: {
		mouseover: null,
		mouseout: null
	},

	/**
	 * Whether to cancel bubbling of current event or role
	 * @type {boolean}
	 */
	_cancel_bubble: false,

	/**
	 * How many dispatch cycles are currently running
	 * @type {number}
	 */
	_nested_dispatch_count: 0,
	/**
	 * Number of the current refresh loop
	 * @type {number}
	 */
	_refresh_id: 0,

	/**
	 * Create an instance of the class, acquire event listeners
	 */
	init: function() {

		var default_events = Lava.schema.system.DEFAULT_EVENTS,
			i = 0,
			count = default_events.length;

		for (; i < count; i++) {

			this._event_usage_counters[default_events[i]] = 1;
			this._initEvent(default_events[i]);

		}

	},

	/**
	 * Place a view into queue for refresh
	 * @param {Lava.view.Abstract} view
	 */
	scheduleViewRefresh: function(view) {

		if (view.depth in this._dirty_views) {

			this._dirty_views[view.depth].push(view);

		} else {

			this._dirty_views[view.depth] = [view];

		}

	},

	/**
	 * View refresh cycle. Call {@link Lava.view.Abstract#refresh} of all views in the queue, starting from the root views
	 */
	refresh: function() {

		if (Lava.Core.isProcessingEvent()) {
			Lava.logError("ViewManager::refresh() must not be called inside event listeners");
			return;
		}

		if (this._is_refreshing) {
			Lava.logError("ViewManager: recursive call to refresh()");
			return;
		}

		Lava.ScopeManager.refresh();

		if (this._dirty_views.length) {

			this._is_refreshing = true;
			Lava.ScopeManager.lock();
			this._refresh_id++;

			do {
				var dirty_views = this._dirty_views,
					has_exceptions;
				this._dirty_views = [];
				has_exceptions = this._refreshCycle(dirty_views);
			} while (this._dirty_views.length && !has_exceptions);

			Lava.ScopeManager.unlock();
			this._is_refreshing = false;

		}

	},

	/**
	 * Repeatable callback, that performs refresh of dirty views
	 * @param {Array.<Array.<Lava.view.Abstract>>} dirty_views
	 */
	_refreshCycle: function(dirty_views) {

		var level = 0,
			deepness,
			views_list,
			has_exceptions = false,
			i,
			count;

		deepness = dirty_views.length; // this line must be after ScopeManager#refresh()

		for (; level < deepness; level++) {

			if (level in dirty_views) {

				views_list = dirty_views[level];

				for (i = 0, count = views_list.length; i < count; i++) {

					if (views_list[i].refresh(this._refresh_id)) {
						Lava.logError("ViewManager: view was refreshed several times in one refresh loop. Aborting.");
						has_exceptions = true;
					}

				}

			}

		}

		return has_exceptions;

	},

	/**
	 * Get `_is_refreshing`
	 * @returns {boolean}
	 */
	isRefreshing: function() {

		return this._is_refreshing;

	},

	/**
	 * Add a newly created view to local collections: `_views_by_guid` and `_views_by_id`
	 * @param {Lava.view.Abstract} instance
	 */
	registerView: function(instance) {

		this._views_by_guid[instance.guid] = instance;

		if (instance.id) {

			if (Lava.schema.DEBUG && (instance.id in this._views_by_id)) Lava.t("Duplicate view id: " + instance.id);
			this._views_by_id[instance.id] = instance;

		}

	},

	/**
	 * Remove a destroyed view from local collections
	 * @param {Lava.view.Abstract} instance
	 */
	unregisterView: function(instance) {

		delete this._views_by_guid[instance.guid];

		if (instance.id) {

			delete this._views_by_id[instance.id];

		}

	},

	/**
	 * Get a view with given user-defined ID
	 * @param {string} id
	 * @returns {Lava.view.Abstract}
	 */
	getViewById: function(id) {

		return this._views_by_id[id];

	},

	/**
	 * Get view by global unique identifier
	 * @param {_tGUID} guid
	 * @returns {Lava.view.Abstract}
	 */
	getViewByGuid: function(guid) {

		return this._views_by_guid[guid];

	},

	/**
	 * Get widget by id. Does not take hierarchy into account
	 * @param {Lava.widget.Standard} starting_widget
	 * @param {string} id
	 * @returns {Lava.view.Abstract}
	 */
	_locateWidgetById: function(starting_widget, id) {

		if (Lava.schema.DEBUG && !id) Lava.t();

		return this._views_by_id[id];

	},

	/**
	 * Get widget by GUID. Does not consider hierarchy
	 * @param {Lava.widget.Standard} starting_widget
	 * @param {_tGUID} guid
	 * @returns {Lava.view.Abstract}
	 */
	_locateWidgetByGuid: function(starting_widget, guid) {

		if (Lava.schema.DEBUG && !guid) Lava.t();

		return this._views_by_guid[guid];

	},

	/**
	 * Find first widget with given name among parents of the given widget (including widget itself)
	 * @param {Lava.widget.Standard} widget Starting widget
	 * @param {string} name Name to search for
	 * @returns {?Lava.widget.Standard}
	 */
	_locateWidgetByName: function(widget, name) {

		if (Lava.schema.DEBUG && !name) Lava.t();

		while (widget && widget.name != name) {

			widget = widget.getParentWidget();

		}

		return widget;

	},

	/**
	 * Find first widget with given label among parents of the given widget (including widget itself)
	 *
	 * @param {Lava.widget.Standard} widget Starting widget
	 * @param {string} label
	 * @returns {?Lava.widget.Standard}
	 */
	_locateWidgetByLabel: function(widget, label) {

		if (Lava.schema.DEBUG && !label) Lava.t();

		// Targets are different from view locators, there must be no hardcoded '@widget' label, like in views
		// ('@widget' label may be very harmful in this case. Use widget names instead!)

		if (label == 'root') {

			while (widget.getParentWidget()) {

				widget = widget.getParentWidget();

			}

		} else {

			while (widget && widget.label != label) {

				widget = widget.getParentWidget();

			}

		}

		return widget;

	},

	/**
	 * Get a widget from hierarchy by given route
	 * @param {Lava.widget.Standard} starting_widget The child widget to start search
	 * @param {_eViewLocatorType} locator_type
	 * @param {string} locator Locator argument
	 * @returns {?Lava.widget.Standard}
	 */
	locateTarget: function(starting_widget, locator_type, locator) {

		return this['_locateWidgetBy' + locator_type](starting_widget, locator);

	},

	/**
	 * Dispatch events and roles to their targets.
	 * Warning! Violates codestyle with multiple return statements
	 *
	 * @param {Lava.view.Abstract} view The source of events or roles
	 * @param {Array.<_cTarget>} targets The target routes
	 * @param {function} callback The ViewManager callback that will perform dispatching
	 * @param {*} callback_arguments Will be passed to `callback`
	 * @param {Object.<string, Array>} global_targets_object Either {@link Lava.system.ViewManager#_global_role_targets}
	 *  or {@link Lava.system.ViewManager#_global_event_targets}
	 */
	_dispatchCallback: function(view, targets, callback, callback_arguments, global_targets_object) {

		var i = 0,
			count = targets.length,
			target,
			target_name,
			widget,
			template_arguments,
			bubble_index = 0,
			bubble_targets_copy,
			bubble_targets_count;

		this._nested_dispatch_count++;

		for (; i < count; i++) {

			target = targets[i];
			target_name = target.name;
			template_arguments = ('arguments' in target) ? this._evalTargetArguments(view, target) : null;
			widget = null;

			if ('locator_type' in target) {

				/*
				 Note: there is similar view location mechanism in view.Abstract, but the algorithms are different:
				 when ViewManager seeks by label - it searches only for widgets, while view checks all views in hierarchy.
				 Also, hardcoded labels differ.
				 */
				widget = this['_locateWidgetBy' + target.locator_type](view.getWidget(), target.locator);

				if (!widget) {

					Lava.logError('ViewManager: callback target (widget) not found. Type: ' + target.locator_type + ', locator: ' + target.locator);

				} else if (!widget.isWidget) {

					Lava.logError('ViewManager: callback target is not a widget');

				} else if (!callback(widget, target_name, view, template_arguments, callback_arguments)) {

					Lava.logError('ViewManager: targeted widget did not handle the role or event: ' + target_name);

				}

				// ignore possible call to cancelBubble()
				this._cancel_bubble = false;

			} else {

				// bubble
				widget = view.getWidget();

				do {

					callback(widget, target_name, view, template_arguments, callback_arguments);
					widget = widget.getParentWidget();

				} while (widget && !this._cancel_bubble);

				if (this._cancel_bubble) {
					this._cancel_bubble = false;
					continue;
				}

				if (target_name in global_targets_object) {

					// cause target can be removed inside event handler
					bubble_targets_copy = global_targets_object[target_name].slice();
					for (bubble_targets_count = bubble_targets_copy.length; bubble_index < bubble_targets_count; bubble_index++) {

						callback(
							bubble_targets_copy[bubble_index],
							target_name,
							view,
							template_arguments,
							callback_arguments
						);

						if (this._cancel_bubble) {
							this._cancel_bubble = false;
							break;
						}

					}

				}

			}

		}

		this._nested_dispatch_count--;

	},

	/**
	 * Callback for dispatching roles: call widget's role handler
	 *
	 * @param {Lava.widget.Standard} widget
	 * @param {string} target_name
	 * @param {Lava.view.Abstract} view
	 * @param {Array.<*>} template_arguments
	 * @returns {boolean}
	 */
	_callRegisterViewInRole: function(widget, target_name, view, template_arguments) {

		return widget.handleRole(target_name, view, template_arguments);

	},

	/**
	 * Dispatch roles
	 * @param {Lava.view.Abstract} view
	 * @param {Array.<_cTarget>} targets
	 */
	dispatchRoles: function(view, targets) {

		this._dispatchCallback(
			view,
			targets,
			this._callRegisterViewInRole,
			null,
			this._global_role_targets
		);

	},

	/**
	 * Callback for dispatching events: call the widget's event handler
	 * @param {Lava.widget.Standard} widget
	 * @param {string} target_name
	 * @param {Lava.view.Abstract} view
	 * @param {Array.<*>} template_arguments
	 * @param {Object} callback_arguments
	 * @returns {boolean}
	 */
	_callHandleEvent: function(widget, target_name, view, template_arguments, callback_arguments) {

		return widget.handleEvent(
			callback_arguments.event_name,
			callback_arguments.event_object,
			target_name,
			view,
			template_arguments
		);

	},

	/**
	 * Helper method which checks for events presence on container and dispatches them
	 * @param {Lava.view.Abstract} view
	 * @param {string} event_name
	 * @param {Object} event_object
	 */
	_dispatchViewEvent: function(view, event_name, event_object) {

		var targets = view.getContainer().getEventTargets(event_name);

		if (targets) {

			this.dispatchEvent(view, event_name, event_object, targets);

		}

	},

	/**
	 * Dispatch DOM events to targets
	 *
	 * @param {Lava.view.Abstract} view View, that owns the container, which raised the events
	 * @param {string} event_name
	 * @param {Object} event_object DOM event object
	 * @param {Array.<_cTarget>} targets
	 */
	dispatchEvent: function(view, event_name, event_object, targets) {

		this._dispatchCallback(
			view,
			targets,
			this._callHandleEvent,
			{
				event_name: event_name,
				event_object: event_object
			},
			this._global_event_targets
		);

	},

	/**
	 * Evaluate template arguments
	 * @param {Lava.view.Abstract} view
	 * @param {_cTarget} target
	 * @returns {Array.<*>}
	 */
	_evalTargetArguments: function(view, target) {

		var result = [];

		for (var i = 0, count = target.arguments.length; i < count; i++) {

			if (target.arguments[i].type == Lava.TARGET_ARGUMENT_TYPES.VALUE) {

				result.push(target.arguments[i].data);

			} else {

				if (target.arguments[i].type != Lava.TARGET_ARGUMENT_TYPES.BIND) Lava.t();

				result.push(view.evalPathConfig(target.arguments[i].data));

			}

		}

		return result;

	},

	/**
	 * Get include from widget
	 * @param {Lava.view.Abstract} starting_view
	 * @param {_cInclude} config
	 * @returns {_tTemplate}
	 */
	getInclude: function(starting_view, config) {

		var widget = starting_view.getWidget(),
			template_arguments = ('arguments' in config) ? this._evalTargetArguments(starting_view, config) : null;

		if ('locator_type' in config) {

			widget = this['_locateWidgetBy' + config.locator_type](widget, config.locator);

			if (!widget || !widget.isWidget) Lava.t();

		}

		return widget.getInclude(config.name, template_arguments);

	},

	/**
	 * Add a widget which will globally handle bubbling events
	 * @param {string} callback_name
	 * @param {Lava.widget.Standard} widget
	 */
	addGlobalEventTarget: function(callback_name, widget) {

		this._addTarget(this._global_event_targets, callback_name, widget);

	},

	/**
	 * Remove a widget, added with {@link Lava.system.ViewManager#addGlobalEventTarget}
	 * @param {string} callback_name
	 * @param {Lava.widget.Standard} widget
	 */
	removeGlobalEventTarget: function(callback_name, widget) {

		this._removeTarget(this._global_event_targets, callback_name, widget);

	},

	/**
	 * Add a widget which will globally handle bubbling roles
	 * @param {string} callback_name
	 * @param {Lava.widget.Standard} widget
	 */
	addGlobalRoleTarget: function(callback_name, widget) {

		this._addTarget(this._global_role_targets, callback_name, widget);

	},

	/**
	 * Remove widget added with {@link Lava.system.ViewManager#addGlobalRoleTarget}
	 * @param {string} callback_name
	 * @param {Lava.widget.Standard} widget
	 */
	removeGlobalRoleTarget: function(callback_name, widget) {

		this._removeTarget(this._global_role_targets, callback_name, widget);

	},

	/**
	 * Perform {@link Lava.system.ViewManager#addGlobalEventTarget} or {@link Lava.system.ViewManager#addGlobalRoleTarget}
	 * @param {Object} storage
	 * @param {string} name
	 * @param {Lava.widget.Standard} widget
	 */
	_addTarget: function(storage, name, widget) {

		if (name in storage) {

			if (storage[name].indexOf(widget) == -1) {

				storage[name].push(widget);

			} else {

				Lava.logError('[ViewManager] Duplicate target: ' + name);

			}

		} else {

			storage[name] = [widget];

		}

	},

	/**
	 * Remove widget, added with {@link Lava.system.ViewManager#_addTarget}
	 * @param {Object} storage
	 * @param {string} name
	 * @param {Lava.widget.Standard} widget
	 */
	_removeTarget: function(storage, name, widget) {

		if (!(name in storage)) Lava.t("Trying to remove a global event target for nonexistent event");

		var index = storage[name].indexOf(widget);

		if (index !== -1) {

			storage[name].splice(index, 1);

		}

	},

	/**
	 * Get the view, the container of which owns the given element
	 * @param {HTMLElement} element
	 * @returns {Lava.view.Abstract}
	 */
	getViewByElement: function(element) {

		var id = Firestorm.Element.getProperty(element, 'id'),
			result = null;

		if (id) {

			if (id.indexOf(Lava.ELEMENT_ID_PREFIX) == 0) {

				result = this.getViewByGuid(id.substr(Lava.ELEMENT_ID_PREFIX.length));

			}

		}

		return result;

	},

	/**
	 * Filter all created views and find those with `label`. Slow!
	 * @param {string} label
	 * @returns {Array.<Lava.view.Abstract>}
	 */
	getViewsByLabel: function(label) {

		var result = [];

		for (var guid in this._views_by_guid) {

			if (this._views_by_guid[guid].label == label) {

				result.push(this._views_by_guid[guid]);

			}

		}

		return result;

	},

	/**
	 * Algorithm for dispatching of mouseenter, mouseleave, mouseover and mouseout events to views.
	 * Maintains stack of elements under cursor, dispatches {@link Lava.system.ViewManager#event:EVENTNAME_stack_changed}
	 * @param {string} event_name
	 * @param {Object} event_object
	 */
	handleMouseMovement:  function(event_name, event_object) {

		var new_mouseover_target = (event_name == 'mouseover') ? event_object.target : event_object.relatedTarget,
			new_mouseover_element_stack = new_mouseover_target ? this._buildElementStack(new_mouseover_target) : [],
			new_mouseover_view_stack = [],
			view,
			container,
			i,
			count;

		if (this._new_mouseover_target !== new_mouseover_target) {

			// Warning! You must not modify `new_mouseover_element_stack` array!
			this._fire('mouseover_stack_changed', new_mouseover_element_stack);

			if (new_mouseover_target) { // moved from one element to another or entered the window

				for (i = 0, count = new_mouseover_element_stack.length; i < count; i++) {
					view = this.getViewByElement(new_mouseover_element_stack[i]);
					if (view) {
						container = view.getContainer();
						if (container.isElementContainer) {
							new_mouseover_view_stack.push(view);
						}
					}
				}

			}

			this._old_mouseover_target = this._new_mouseover_target;
			this._new_mouseover_target = new_mouseover_target;
			this._old_mouseover_view_stack = this._new_mouseover_view_stack;
			this._new_mouseover_view_stack = new_mouseover_view_stack;

		}

		if (event_name == 'mouseout') {

			for (i = 0, count = this._old_mouseover_view_stack.length; i < count; i++) {

				if (this._new_mouseover_view_stack.indexOf(this._old_mouseover_view_stack[i]) == -1) {

					this._dispatchViewEvent(this._old_mouseover_view_stack[i], 'mouseleave', event_object);

				}

				this._dispatchViewEvent(this._old_mouseover_view_stack[i], 'mouseout', event_object);

			}

		} else {

			for (i = 0, count = this._new_mouseover_view_stack.length; i < count; i++) {

				this._dispatchViewEvent(this._new_mouseover_view_stack[i], 'mouseover', event_object);

				if (this._old_mouseover_view_stack.indexOf(this._new_mouseover_view_stack[i]) == -1) {

					this._dispatchViewEvent(this._new_mouseover_view_stack[i], 'mouseenter', event_object);

				}

			}

		}

	},

	/**
	 * Create an array from element and all it's parents
	 * @param {HTMLElement} element
	 * @returns {Array.<HTMLElement>}
	 */
	_buildElementStack: function(element) {

		// note: target of some events can be the root html tag (for example, mousedown on a scroll bar)
		var document_ref = window.document, // document > html > body > ...
			result = [];

		while (element && element != document_ref) {

			result.push(element);
			element = element.parentNode;

		}

		// you must not modify the returned array, but you can slice() it
		if (Lava.schema.DEBUG && Object.freeze) {
			Object.freeze(result);
		}

		return result;

	},

	/**
	 * Dispatch DOM events to views
	 * @param {string} event_name
	 * @param {Object} event_object
	 */
	onDOMEvent: function(event_name, event_object) {

		var target = event_object.target,
			view,
			container,
			stack_changed_event_name = event_name + '_stack_changed',
			stack = target ? this._buildElementStack(target) : [],
			i = 0,
			count = stack.length;

		// Warning! You must not modify the `stack` array!
		this._fire(stack_changed_event_name, stack);

		for (; i < count; i++) {
			view = this.getViewByElement(stack[i]);
			if (view) {
				container = view.getContainer();
				if (container.isElementContainer) {
					if (container.getEventTargets(event_name)) {
						this.dispatchEvent(view, event_name, event_object, container.getEventTargets(event_name));
					}
				}
			}
		}

	},

	/**
	 * Register an event consumer and start routing that event
	 * @param {string} event_name
	 */
	lendEvent: function(event_name) {

		if (Lava.schema.DEBUG && ['mouseenter', 'mouseleave', 'mouseover', 'mouseout'].indexOf(event_name) != -1)
			Lava.t("The following events: mouseenter, mouseleave, mouseover and mouseout are served by common alias - mouse_events");

		if (this._event_usage_counters[event_name]) {

			this._event_usage_counters[event_name]++;

		} else {

			this._event_usage_counters[event_name] = 1;
			this._initEvent(event_name);

		}

	},

	/**
	 * Start listening to an event
	 * @param {string} event_name
	 */
	_initEvent: function(event_name) {

		if (event_name == 'mouse_events') {

			this._events_listeners['mouseover'] =
				Lava.Core.addGlobalHandler('mouseover', this.handleMouseMovement, this);
			this._events_listeners['mouseout'] =
				Lava.Core.addGlobalHandler('mouseout', this.handleMouseMovement, this);

		} else {

			this._events_listeners[event_name] =
				Lava.Core.addGlobalHandler(event_name, this.onDOMEvent, this);

		}

	},

	/**
	 * Inform that event consumer does not need that event anymore
	 * @param {string} event_name
	 */
	releaseEvent: function(event_name) {

		if (this._event_usage_counters[event_name] == 0) {
			Lava.logError("ViewManager: trying to release an event with zero usage.");
			return;
		}

		this._event_usage_counters[event_name]--;

		if (this._event_usage_counters[event_name] == 0) {

			this._shutdownEvent(event_name);

		}

	},

	/**
	 * Is event routed to views (routing starts with a call to `lendEvent`)
	 * @param {string} event_name Event name
	 * @returns {boolean}
	 */
	isEventRouted: function(event_name) {

		return this._event_usage_counters[event_name] > 0;

	},

	/**
	 * Stop listening to an event
	 * @param {string} event_name
	 */
	_shutdownEvent: function(event_name) {

		if (event_name == 'mouse_events') {

			Lava.Core.removeGlobalHandler(this._events_listeners['mouseover']);
			this._events_listeners['mouseover'] = null;
			Lava.Core.removeGlobalHandler(this._events_listeners['mouseout']);
			this._events_listeners['mouseout'] = null;

		} else {

			Lava.Core.removeGlobalHandler(this._events_listeners[event_name]);
			this._events_listeners[event_name] = null;

		}

	},

	/**
	 * Stop bubbling current event or role
	 */
	cancelBubble: function() {

		if (!this._nested_dispatch_count) {
			Lava.logError("Call to cancelBubble outside of dispatch cycle");
			return;
		}
		this._cancel_bubble = true;

	},

	/**
	 * Free resources and make this instance unusable
	 */
	destroy: function() {

		for (var name in this._events_listeners) {

			if (this._events_listeners[name]) {

				Lava.Core.removeGlobalHandler(this._events_listeners[name]);
				this._events_listeners[name] = null;
				this._event_usage_counters[name] = 0;

			}

		}

	}

});

Lava.define(
'Lava.system.App',
/**
 * Place for user-defined business-logic
 *
 * @lends Lava.system.App#
 * @extends Lava.mixin.Observable
 */
{

	Extends: 'Lava.mixin.Observable',

	/**
	 * Global named modules
	 * @type {Object.<string, Lava.data.Module>}
	 */
	_modules: {},

	/**
	 * Get a global named module instance
	 * @param {string} name Module name
	 * @returns {Lava.data.Module}
	 */
	getModule: function(name) {

		if (!(name in this._modules)) {

			var config = Lava.schema.modules[name],
				className = config.type || Lava.schema.data.DEFAULT_MODULE_CLASS,
				constructor = Lava.ClassManager.getConstructor(className, 'Lava.data');

			// construction is split into two phases, cause initFields() may reference other modules
			// - this will result in recursive call to getModule().
			// In case of circular dependency, the first module must be already constructed.
			this._modules[name] = new constructor(this, config, name);
			this._modules[name].initFields();

		}

		return this._modules[name];

	},

	/**
	 * Allow user to fire an event from application's instance
	 * @param {string} event_name
	 * @param {*} event_args
	 */
	fireGlobalEvent: function(event_name, event_args) {

		this._fire(event_name, event_args);

	},

	/**
	 * Destroy this App instance and all modules
	 */
	destroy:  function() {

		for (var name in this._modules) {
			this._modules[name].destroy();
		}

	}

});

Lava.define(
'Lava.system.Sugar',
/**
 * Parser syntax extension for widgets
 *
 * @lends Lava.system.Sugar#
 */
{

	/**
	 * Handlers for root types, {@link _eSugarRootContentType}
	 * @type {Object.<string, string>}
	 */
	_root_map: {
		include: '_parseInclude',
		storage: '_parseStorage',
		union: '_parseUnion',
		storage_object: '_parseStorageObject'
	},

	/**
	 * Tag types, allowed to be inside {@link _eSugarRootContentType|_eSugarRootContentType.union}
	 * (except storage tags, which are processed separately)
	 * @type {Object.<string, string>}
	 */
	_union_handlers: {
		include: '_parseInclude'
	},

	/**
	 * The types of attributes that can be on root object, type => handler_name
	 * @type {Object.<string, string>}
	 */
	_root_attributes_handlers: {
		expressions_option: '_parseRootExpressionsOptionAttribute',
		targets_option: '_parseRootTargetsOptionAttribute',
		property: '_parseRootPropertyAttribute',
		'switch': '_parseRootSwitchAttribute',
		option: '_parseRootOptionAttribute',
		id: '_parseRootIdAttribute'
	},

	/**
	 * Parse raw tag as a widget
	 * @param {_cSugar} schema
	 * @param {_cRawTag} raw_tag
	 * @param {string} parent_title
	 */
	parse: function(schema, raw_tag, parent_title) {

		var widget_config = Lava.parsers.Common.createDefaultWidgetConfig(),
			tags,
			name,
			x = raw_tag.x;

		widget_config['extends'] = parent_title;

		if (raw_tag.content) {

			// Lava.isVoidTag is a workaround for <x:attach_directives>
			// It's highly discouraged to make sugar from void tags
			if (Lava.isVoidTag(raw_tag.name) || !schema.content_schema) {

				tags = Lava.parsers.Common.asBlocks(raw_tag.content);
				tags = this._applyTopDirectives(tags, widget_config);
				if (Lava.schema.DEBUG && tags.length) Lava.t("Widget is not allowed to have any content: " + raw_tag.name);

			} else {

				if (Lava.schema.DEBUG && !(schema.content_schema.type in this._root_map)) Lava.t("Unknown type of content in sugar: " + schema.content_schema.type);
				this[this._root_map[schema.content_schema.type]](schema.content_schema, raw_tag, widget_config, schema.content_schema.name);

			}

		}

		if (raw_tag.attributes) {

			this._parseRootAttributes(schema, raw_tag, widget_config);

		}

		if (x) {

			if (Lava.schema.DEBUG && x) {
				for (name in x) {
					if (['label', 'roles', 'resource_id', 'controller'].indexOf(name) == -1) Lava.t("Control attribute is not allowed on sugar: " + name);
				}
			}

			if ('label' in x) this.setViewConfigLabel(widget_config, x.label);
			if ('roles' in x) widget_config.roles = Lava.parsers.Common.parseTargets(x.roles);
			if ('resource_id' in x) widget_config.resource_id = Lava.parsers.Common.parseResourceId(x.resource_id);
			if ('controller' in x) widget_config.real_class = x.controller;

		}

		return widget_config;

	},

	/**
	 * Inside sugar tag there may be directives at the top. Apply them to widget config and cut away
	 * @param {_tRawTemplate} raw_blocks The content inside widget's sugar tag
	 * @param {_cWidget} widget_config The config of the widget being parsed
	 * @returns {_tRawTemplate} New content without directives
	 */
	_applyTopDirectives: function(raw_blocks, widget_config) {

		var i = 0,
			count = raw_blocks.length,
			result = [];

		for (; i < count; i++) {

			if (raw_blocks[i].type == 'directive') {
				if (Lava.parsers.Directives.processDirective(raw_blocks[i], widget_config, true)) Lava.t("Directive inside sugar has returned a value: " + raw_blocks[i].name);
			} else {
				result = raw_blocks.slice(i);
				break;
			}

		}

		return result;

	},

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// root parsers

	/**
	 * Parse widget's tag content as include
	 * @param {_cSugarContent} content_schema
	 * @param {_cRawTag} raw_tag Widget's tag
	 * @param {_cWidget} widget_config
	 * @param {string} name Include name
	 */
	_parseInclude: function(content_schema, raw_tag, widget_config, name) {

		if (Lava.schema.DEBUG && !name) Lava.t('Sugar: name for include is not provided');
		Lava.store(
			widget_config,
			'includes',
			name,
			raw_tag.content ? Lava.parsers.Common.compileTemplate(raw_tag.content, widget_config) : []
		);

	},

	/**
	 * Parse widget's tag content as {@link _cWidget#storage}
	 * @param {_cSugarContent} content_schema
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} widget_config
	 */
	_parseStorage: function(content_schema, raw_tag, widget_config) {

		var tags = Lava.parsers.Common.asBlocks(raw_tag.content);
		tags = this._applyTopDirectives(tags, widget_config);
		if (tags.length) {
			Lava.parsers.Storage.parse(widget_config, tags);
		}

	},

	/**
	 * The content of `raw_tag` is storage tags, mixed with includes
	 * @param {_cSugarContent} content_schema
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} widget_config
	 */
	_parseUnion: function(content_schema, raw_tag, widget_config) {

		var tags = Lava.parsers.Common.asBlocks(raw_tag.content),
			i = 0,
			count,
			tag_roles_map = content_schema.tag_roles,
			tag_schema,
			storage_tags = [];

		tags = this._applyTopDirectives(tags, widget_config);
		count = tags.length;

		for (; i < count; i++) {

			if (tags[i].name in tag_roles_map) {

				tag_schema = tag_roles_map[tags[i].name];
				this[this._union_handlers[tag_schema.type]](tag_schema, tags[i], widget_config, tag_schema.name || tags[i].name);

			} else {

				storage_tags.push(tags[i]);

			}

		}

		if (storage_tags.length) {

			Lava.parsers.Storage.parse(widget_config, storage_tags);

		}

	},

	/**
	 * Tags inside `raw_tag` represent properties in an object in storage
	 * @param {_cSugarContent} content_schema
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} widget_config
	 */
	_parseStorageObject: function(content_schema, raw_tag, widget_config) {

		var tags = Lava.parsers.Common.asBlocks(raw_tag.content);
		tags = this._applyTopDirectives(tags, widget_config);
		if (tags.length) {
			Lava.parsers.Storage.parse(widget_config, [{
				type: 'tag',
				name: content_schema.name,
				content: tags
			}]);
		}

	},

	// end: root parsers
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	/**
	 * Parse attributes of the widget's `raw_tag` into `widget_config`
	 * @param {_cSugar} schema
	 * @param {_cRawTag} raw_tag
	 * @param {_cWidget} widget_config
	 */
	_parseRootAttributes: function(schema, raw_tag, widget_config) {

		var name,
			descriptor,
			unknown_attributes = {};

		for (name in raw_tag.attributes) {

			if (Lava.schema.DEBUG && name != 'id' && !schema.attribute_mappings) Lava.t('Sugar schema is missing attribute mappings for: ' + name);

			descriptor = (name == 'id') ? {type: 'id'} : schema.attribute_mappings[name];

			if (descriptor) {
				this[this._root_attributes_handlers[descriptor.type]](widget_config, raw_tag.attributes[name], descriptor, descriptor.name || name);
			} else {
				unknown_attributes[name] = raw_tag.attributes[name];
			}

		}

		if (!Firestorm.Object.isEmpty(unknown_attributes)) {

			if (Lava.schema.DEBUG && !schema.root_resource_name) Lava.t("Sugar: unknown attribute: " + name + ", for widget: " + raw_tag.name);
			this._storeAttributesAsResource(widget_config, unknown_attributes, schema.root_resource_name);

		}

	},

	/**
	 * Store root attributes that are not described in Sugar config as 'container_stack' resource
	 * @param {_cWidget} widget_config
	 * @param {Object} unknown_attributes
	 * @param {string} resource_name
	 */
	_storeAttributesAsResource: function(widget_config, unknown_attributes, resource_name) {

		var value = {
				type: 'container_stack',
				value: []
			},
			operations_stack = value.value;

		if (!widget_config.resources) {

			widget_config.resources = {};

		}

		if (!widget_config.resources['default']) {

			widget_config.resources['default'] = {};

		}

		if ('class' in unknown_attributes) {

			operations_stack.push({
				name: 'add_classes',
				value: unknown_attributes['class'].trim().split(/\s+/)
			});
			delete unknown_attributes['class'];

		}

		if ('style' in unknown_attributes) {

			operations_stack.push({
				name: 'add_styles',
				value: Lava.parsers.Common.parseStyleAttribute(unknown_attributes.style)
			});
			delete  unknown_attributes.style;

		}

		if (!Firestorm.Object.isEmpty(unknown_attributes)) {

			operations_stack.push({
				name: 'add_properties',
				value: Firestorm.Object.copy(unknown_attributes) // copying to reduce possible slowdowns (object may contain deleted values)
			});

		}

		Lava.resources.putResourceValue(widget_config.resources['default'], resource_name, value);

	},

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// root attribute actions

	/**
	 * Store 'id' attribute on root tag into {@link _cView#id}
	 * @param {_cWidget} widget_config
	 * @param {string} attribute_value
	 */
	_parseRootIdAttribute: function(widget_config, attribute_value) {

		if (Lava.schema.DEBUG && (!Lava.isValidId(attribute_value) || ('id' in widget_config))) Lava.t();
		widget_config.id = attribute_value;

	},

	/**
	 * Evaluate attribute value and store it in {@link _cView#options}
	 * @param {_cWidget} widget_config
	 * @param {string} attribute_value
	 * @param {_cSugarRootAttribute} descriptor
	 * @param {string} name
	 */
	_parseRootOptionAttribute: function(widget_config, attribute_value, descriptor, name) {

		Lava.store(widget_config, 'options', name, Lava.valueToType(descriptor, attribute_value));

	},

	/**
	 * Same as 'option', but empty value is treated as boolean TRUE, to allow value-less (void) attributes
	 * @param {_cWidget} widget_config
	 * @param {string} attribute_value
	 * @param {_cSugarRootAttribute} descriptor
	 * @param {string} name
	 */
	_parseRootSwitchAttribute: function(widget_config, attribute_value, descriptor, name) {

		Lava.store(widget_config, 'options',  name, (attribute_value == '') ? true : Lava.types.Boolean.fromString(attribute_value));

	},

	/**
	 * Store attribute as property into {@link _cWidget#properties}
	 * @param {_cWidget} widget_config
	 * @param {string} attribute_value
	 * @param {_cSugarRootAttribute} descriptor
	 * @param {string} name
	 */
	_parseRootPropertyAttribute: function(widget_config, attribute_value, descriptor, name) {

		Lava.store(widget_config, 'properties', name, Lava.valueToType(descriptor, attribute_value));

	},

	/**
	 * Parse attribute value via {@link Lava.parsers.Common#parseTargets} and store it as an option
	 * @param {_cWidget} widget_config
	 * @param {string} attribute_value
	 * @param {_cSugarRootAttribute} descriptor
	 * @param {string} name
	 */
	_parseRootTargetsOptionAttribute: function(widget_config, attribute_value, descriptor, name) {

		Lava.store(widget_config, 'options', name, Lava.parsers.Common.parseTargets(attribute_value));

	},

	/**
	 * Parse attribute value as expression and store it as an option
	 * @param {_cWidget} widget_config
	 * @param {string} attribute_value
	 * @param {_cSugarRootAttribute} descriptor
	 * @param {string} name
	 */
	_parseRootExpressionsOptionAttribute: function(widget_config, attribute_value, descriptor, name) {

		Lava.store(
			widget_config,
			'options',
			name,
			Lava.ExpressionParser.parse(attribute_value, Lava.ExpressionParser.SEPARATORS.SEMICOLON)
		);

	}

	// end: root attribute actions
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

});


Lava.define(
'Lava.system.PopoverManager',
/**
 * Shows and positions popups and tooltips
 * @lends Lava.system.PopoverManager#
 */
{

	/**
	 * Listener for {@link Lava.system.ViewManager#event:EVENTNAME_stack_changed}
	 * @type {_tListener}
	 */
	_mouseover_stack_changed_listener: null,

	/**
	 * The mouseover element with tooltip
	 * @type {HTMLElement}
	 */
	_tooltip_target: null,

	/**
	 * The attribute with tooltip text
	 * @type {string}
	 */
	_attribute_name: 'data-tooltip',

	/**
	 * Listener for the mousemove DOM event
	 * @type {_tListener}
	 */
	_mousemove_listener: null,

	/**
	 * Instance of the Tooltip widget
	 * @type {Lava.widget.Standard}
	 */
	_tooltip: null,

	/**
	 * Name of the widget that will show up as a tooltip
	 * @type {string}
	 */
	DEFAULT_TOOLTIP_WIDGET: 'Tooltip',

	/**
	 * Create tooltip widget instance and start listening to mouse events
	 */
	enable: function() {

		if (!this._mouseover_stack_changed_listener) {
			Lava.view_manager.lendEvent('mouse_events');
			this._mouseover_stack_changed_listener = Lava.view_manager.on('mouseover_stack_changed', this._onMouseoverStackChanged, this);
			if (!this._tooltip) this._tooltip = Lava.createWidget(this.DEFAULT_TOOLTIP_WIDGET);
			this._tooltip.inject(document.body, 'Bottom');
		}

	},

	/**
	 * Remove tooltip widget from DOM and stop responding to events
	 */
	disable: function() {

		if (this._mouseover_stack_changed_listener) {
			Lava.view_manager.releaseEvent('mouse_events');
			Lava.view_manager.removeListener(this._mouseover_stack_changed_listener);
			this._mouseover_stack_changed_listener = null;
			if (this._mousemove_listener) {
				Lava.Core.removeGlobalHandler(this._mousemove_listener);
				this._mousemove_listener = null;
			}
			this._tooltip.set('is_visible', false);
			this._tooltip.remove();
		}

	},

	/**
	 * Does it listen to mouse movements and show tooltips?
	 * @returns {boolean}
	 */
	isEnabled: function() {

		return this._mouseover_stack_changed_listener != null;

	},

	/**
	 * Mouse has crossed an element boundary. Find new element with tooltip and show new content
	 * @param {Lava.system.ViewManager} view_manager
	 * @param {Array.<HTMLElement>} stack
	 */
	_onMouseoverStackChanged: function(view_manager, stack) {

		var new_tooltip_target = null,
			html;

		for (var i = 0, count = stack.length; i < count; i++) {

			if (Firestorm.Element.hasAttribute(stack[i], this._attribute_name)) {

				new_tooltip_target = stack[i];
				break;

			}

		}

		if (new_tooltip_target != this._tooltip_target) {

			if (!this._tooltip_target) { // if there was no tooltip

				if (Lava.schema.DEBUG && this._mousemove_listener) Lava.t();
				this._mousemove_listener = Lava.Core.addGlobalHandler('mousemove', this._onMouseMove, this);
				this._tooltip.set('is_visible', true);

			} else if (!new_tooltip_target) { // if there was a tooltip, and now it should be hidden

				Lava.Core.removeGlobalHandler(this._mousemove_listener);
				this._mousemove_listener = null;
				this._tooltip.set('is_visible', false);

			}

			if (new_tooltip_target) {

				html = Firestorm.Element.getAttribute(new_tooltip_target, this._attribute_name).replace(/\r?\n/g, '<br/>');
				this._tooltip.set('html', html);
				this._tooltip.set('is_visible', !!(html || !Lava.schema.popover_manager.HIDE_EMPTY_TOOLTIPS));

			}

			this._tooltip_target = new_tooltip_target;

		}

	},

	/**
	 * Mouse has changed position. Move tooltip accordingly
	 * @param {string} event_name
	 * @param {Object} event_object
	 */
	_onMouseMove: function(event_name, event_object) {

		this._tooltip.set('x', event_object.page.x); // left
		this._tooltip.set('y', event_object.page.y); // top

	},

	/**
	 * Destroy PopoverManager instance
	 */
	destroy: function() {

		this.isEnabled() && this.disable();

	}

});

/**
 * Virtual focus target has changed
 * @event Lava.system.FocusManager#focus_target_changed
 * @type {Lava.widget.Standard}
 * @lava-type-description New widget that owns the virtual focus
 */

Lava.define(
'Lava.system.FocusManager',
/**
 * Tracks current focused element and widget, delegates keyboard navigation events. [Alpha, work in progress]
 * @lends Lava.system.FocusManager#
 * @extends Lava.mixin.Observable#
 */
{
	Extends: 'Lava.mixin.Observable',

	/**
	 * DOM element, which holds the focus
	 * @type {HTMLElement}
	 */
	_focused_element: null,

	/**
	 * Virtual focus target
	 * @type {Lava.widget.Standard}
	 */
	_focus_target: null,

	/**
	 * Listener for global "focus_acquired" event
	 * @type {_tListener}
	 */
	_focus_acquired_listener: null,
	/**
	 * Listener for global "focus_lost" event
	 * @type {_tListener}
	 */
	_focus_lost_listener: null,
	/**
	 * Listener for Core "focus" event
	 * @type {_tListener}
	 */
	_focus_listener: null,
	/**
	 * Listener for Core "blur" event
	 * @type {_tListener}
	 */
	_blur_listener: null,

	/**
	 * Start listening to global focus-related events
	 */
	enable: function () {

		if (!this._focus_acquired_listener) {
			this._focus_acquired_listener = Lava.app.on('focus_acquired', this._onFocusTargetAcquired, this);
			this._focus_lost_listener = Lava.app.on('focus_lost', this.clearFocusedTarget, this);
			this._focus_listener = Lava.Core.addGlobalHandler('blur', this._onElementBlurred, this);
			this._blur_listener = Lava.Core.addGlobalHandler('focus', this._onElementFocused, this);
		}

	},

	/**
	 * Stop listening to all focus-related events
	 */
	disable: function() {

		if (this._focus_acquired_listener) {
			Lava.app.removeListener(this._focus_acquired_listener);
			Lava.app.removeListener(this._focus_lost_listener);
			Lava.Core.removeGlobalHandler(this._focus_listener);
			Lava.Core.removeGlobalHandler(this._blur_listener);
			this._focus_acquired_listener
				= this._focused_element
				= this._focus_target
				= null;
		}

	},

	/**
	 * Does it listen to focus changes and sends navigation events
	 * @returns {boolean}
	 */
	isEnabled: function() {

		return this._focus_acquired_listener != null;

	},

	/**
	 * Get `_focus_target`
	 * @returns {Lava.widget.Standard}
	 */
	getFocusedTarget: function() {

		return this._focus_target;

	},

	/**
	 * Get `_focused_element`
	 * @returns {HTMLElement}
	 */
	getFocusedElement: function() {

		return this._focused_element;

	},

	/**
	 * Replace old virtual focus target widget with the new one. Fire "focus_target_changed"
	 * @param new_target
	 */
	_setTarget: function(new_target) {

		// will be implemented later
		//if (this._focus_target && this._focus_target != new_target) {
		//	this._focus_target.informFocusLost();
		//}

		if (this._focus_target != new_target) {
			this._focus_target = new_target;
			this._fire('focus_target_changed', new_target);
		}

	},

	/**
	 * Clear old virtual focus target and `_focused_element`
	 */
	_onElementBlurred: function() {

		this._setTarget(null);
		this._focused_element = null;

	},

	/**
	 * Clear old virtual focus target and set new `_focused_element`.
	 * @param event_name
	 * @param event_object
	 */
	_onElementFocused: function(event_name, event_object) {

		if (this._focused_element != event_object.target) {
			this._setTarget(null);
			this._focused_element = event_object.target;
		}

	},

	/**
	 * Set new virtual focus target and `_focused_element`
	 * @param app
	 * @param event_args
	 */
	_onFocusTargetAcquired: function(app, event_args) {

		this._setTarget(event_args.target);
		this._focused_element = event_args.element;

	},

	/**
	 * Clear old virtual focus target
	 */
	clearFocusedTarget: function() {

		this._setTarget(null);

	},

	/**
	 * Blur currently focused DOM element and clear virtual focus target
	 */
	blur: function() {

		if (this._focused_element) {
			this._focused_element.blur();
			this._focused_element = document.activeElement || null;
		}
		this._setTarget(null);

	},

	/**
	 * Destroy FocusManager instance
	 */
	destroy: function() {

		this.isEnabled() && this.disable();

	}

});

/**
 * Field's value has changed in a record instance
 * @event Lava.data.field.Abstract#changed
 * @type {Object}
 * @property {Lava.data.Record} record The record with changed field
 */

Lava.define(
'Lava.data.field.Abstract',
/**
 * Base class for all record fields
 *
 * @lends Lava.data.field.Abstract#
 * @extends Lava.mixin.Observable
 */
{

	Extends: 'Lava.mixin.Observable',

	/**
	 * Field's name
	 * @type {string}
	 */
	_name: null,
	/**
	 * Field's module
	 * @type {Lava.data.ModuleAbstract}
	 */
	_module: null,
	/**
	 * Field's config
	 * @type {_cField}
	 */
	_config: null,
	/**
	 * Reference to object from module with properties of all records
	 * @type {Object.<_tGUID, Object>}
	 */
	_properties_by_guid: null,
	/**
	 * May this field be assigned a <kw>null</kw> value
	 * @type {boolean}
	 */
	_is_nullable: false,

	/**
	 * Create the instance of a field
	 * @param {Lava.data.Module} module
	 * @param {string} name Field name
	 * @param {_cField} config
	 * @param {object} module_storage Reference to object from module with properties of all records
	 */
	init: function(module, name, config, module_storage) {

		this._module = module;
		this._name = name;
		this._config = config;
		this._properties_by_guid = module_storage;
		if ('is_nullable' in config) this._is_nullable = config.is_nullable;

	},

	/**
	 * Module calls this method when all field objects are already created,
	 * and passes the object which will become default properties for all records.
	 * Common purpose of this method is to set this field's default value and attach listeners to other fields
	 */
	onModuleFieldsCreated: function(default_properties) {},

	/**
	 * Is the given `value` valid for assignment to this field
	 * @param {*} value
	 * @returns {boolean} True, if value is valid
	 */
	isValidValue: function(value) {

		return typeof(value) != 'undefined' && (value !== null || this._is_nullable);

	},

	/**
	 * Unlike {@link Lava.data.field.Abstract#isValidValue}, this is slow version of validity check,
	 * which returns a message in case the value is invalid
	 * @param {*} value
	 * @returns {?string}
	 */
	getInvalidReason: function(value) {

		var reason = null;

		if (typeof(value) == 'undefined') {

			reason = "Undefined is not a valid value";

		} else if (value == null && !this._is_nullable) {

			reason = "Cannot assign null to non-nullable field";

		}

		return reason;

	},

	/**
	 * Get `_is_nullable`
	 * @returns {boolean}
	 */
	isNullable: function() {

		return this._is_nullable;

	},

	/**
	 * Records are either loaded from existing data, or created with default properties.
	 * Here a field may perform initialization of new records, for example: generate an id
	 */
	initNewRecord: function(record, properties) {},

	/**
	 * Initialize a field from server-side data
	 * @param {Lava.data.Record} record
	 * @param {Object} properties
	 * @param {Object} raw_properties
	 */
	'import': function(record, properties, raw_properties) {},

	/**
	 * Export the field's value back to server-side data
	 * @param {Lava.data.Record} record
	 * @param {Object} destination_object Object with exported data
	 */
	'export': function(record, destination_object) {
		Lava.t("Abstract function call: export");
	},

	/**
	 * Get this field's value from a record's properties
	 * @param {Lava.data.Record} record
	 * @param {Object} properties
	 */
	getValue: function(record, properties) {
		Lava.t("Abstract function call: getValue");
	},

	/**
	 * Set this field's value to record's properties
	 * @param {Lava.data.Record} record
	 * @param {Object} properties
	 * @param {*} value
	 */
	setValue: function(record, properties, value) {
		Lava.t("Abstract function call: setValue");
	},

	/**
	 * Emit {@link Lava.data.field.Abstract#event:changed} and fire the changed events from record instance
	 * @param {Lava.data.Record} record
	 */
	_fireFieldChangedEvents: function(record) {

		this._fire('changed', {record: record});
		record.firePropertyChangedEvents(this._name);

	},

	/**
	 * Helper method for importing values from server-side data. Performs validation
	 * @param {Object} properties
	 * @param {Object} raw_properties
	 * @returns {*}
	 */
	_getImportValue: function(properties, raw_properties) {

		if (Lava.schema.data.VALIDATE_IMPORT_DATA && !this.isValidValue(raw_properties[this._name]))
			Lava.t('Invalid value in import data (' + this._name + '): ' + raw_properties[this._name]);

		return raw_properties[this._name];

	},

	/**
	 * Compare values of this field in two records
	 * @param {Lava.data.Record} record_a
	 * @param {Lava.data.Record} record_b
	 * @returns {boolean} True, in case the value of this field in `record_a` is less than value in `record_b`
	 */
	isLess: function(record_a, record_b) {

		return this._properties_by_guid[record_a.guid][this._name] < this._properties_by_guid[record_b.guid][this._name];

	},

	/**
	 * Compare values of this field in two records
	 * @param record_a
	 * @param record_b
	 * @returns {boolean} True, in case values are equal
	 */
	isEqual: function(record_a, record_b) {

		return this._properties_by_guid[record_a.guid][this._name] == this._properties_by_guid[record_b.guid][this._name];

	},

	/**
	 * Free resources and make this instance unusable
	 */
	destroy: function() {

		this._properties_by_guid = this._module = null;

	}

});

Lava.define(
'Lava.data.field.Basic',
/**
 * Field with no restrictions on value type
 *
 * @lends Lava.data.field.Basic#
 * @extends Lava.data.field.Abstract
 */
{

	Extends: 'Lava.data.field.Abstract',

	/**
	 * Field's default value from config
	 * @type {*}
	 */
	_default: null,

	init: function(module, name, config, module_storage) {

		this.Abstract$init(module, name, config, module_storage);

		if ('default' in config) {

			this._default = config['default'];

		}

		if (!this._is_nullable && this._default == null) {

			// the default value could be provided in derived classes
			Lava.t("Non-nullable Basic fields must have a default value");

		}

		if (Lava.schema.DEBUG && !this.isValidValue(this._default))
			Lava.t("Field was configured with invalid default value. Module: " + this._module.getName() + ", field name: " + this._name);

	},

	onModuleFieldsCreated: function(default_properties) {

		default_properties[this._name] = this._default;

	},

	'import': function(record, properties, raw_properties) {

		if (this._name in raw_properties) {

			properties[this._name] = this._getImportValue(properties, raw_properties);

		}

	},

	'export': function(record, destination_object) {

		destination_object[this._name] = this._properties_by_guid[record.guid][this._name];

	},

	getValue: function(record, properties) {

		return properties[this._name];

	},

	setValue: function(record, properties, value) {

		if (properties[this._name] !== value) {

			if (!this.isValidValue(value)) Lava.t('[Field name=' + this._name + '] Invalid field value: '
				+ value + ". Reason: " + this.getInvalidReason(value));

			properties[this._name] = value;
			this._fireFieldChangedEvents(record);

		}

	}

});

Lava.define(
'Lava.data.field.Collection',
/**
 * Field, that holds collection of records (usually, from another module)
 * @lends Lava.data.field.Collection#
 * @extends Lava.data.field.Abstract
 */
{

	Extends: 'Lava.data.field.Abstract',

	/**
	 * Instance belongs to Collection field
	 * @type {boolean}
	 * @const
	 */
	isCollectionField: true,

	/**
	 * Collection field holds array of records from this module instance
	 * @type {Lava.data.Module}
	 */
	_target_module: null,

	/**
	 * The mirror {@link Lava.data.field.Record} field name
	 * @type {string}
	 */
	_target_record_field_name: null,
	/**
	 * Each Collection field has corresponding Record field, they always come in pairs, like 'parent' (Record) and 'children' (Collection)
	 * @type {Lava.data.field.Record}
	 */
	_target_record_field: null,

	/**
	 * Listener for {@link Lava.data.field.Record#event:removed_child}
	 * @type {_tListener}
	 */
	_record_removed_listener: null,
	/**
	 * Listener for {@link Lava.data.field.Record#event:added_child}
	 * @type {_tListener}
	 */
	_record_added_listener: null,

	/**
	 * Collections of foreign records that belong to local record
	 * @type {Object.<string, Lava.system.Enumerable>}
	 */
	_collections_by_record_guid: {},
	/**
	 * Listeners for each Enumerable from `_collections_by_record_guid`
	 * @type {Object}
	 */
	_collection_listeners_by_guid: {},
	/**
	 * Hash of global unique identifiers of Enumerables from `_collections_by_record_guid` to their owner record (local)
	 * @type {Object.<_tGUID, Lava.data.Record>}
	 */
	_collection_guid_to_record: {},

	/**
	 * @param module
	 * @param name
	 * @param {_cCollectionField} config
	 * @param module_storage
	 */
	init: function(module, name, config, module_storage) {

		this.Abstract$init(module, name, config, module_storage);

		if (Lava.schema.DEBUG && !config.record_field)
			Lava.t("Missing corresponding Record field. Record fields are used by Collection fields.");

		this._target_record_field_name = config.record_field;

	},

	onModuleFieldsCreated: function(default_properties) {

		this._target_module = (this._config.module == 'this') ? this._module : this._module.getApp().getModule(this._config.module);
		this._target_record_field = this._target_module.getField(this._target_record_field_name);
		this._record_removed_listener = this._target_record_field.on('removed_child', this._onRecordRemoved, this);
		this._record_added_listener = this._target_record_field.on('added_child', this._onRecordAdded, this);

		if (!this._target_record_field.isRecordField) Lava.t('CollectionField: mirror field is not Record field');

		if (this._target_record_field.getReferencedModule() !== this._module)
			Lava.t("CollectionField: module mismatch with mirror Record field");

	},

	/**
	 * Record was removed from collection by setting it's related Record field. Update local collection
	 * @param {Lava.data.field.Record} field
	 * @param {Lava.data.field.Record#event:removed_child} event_args
	 */
	_onRecordRemoved: function(field, event_args) {

		var local_record = event_args.collection_owner;
		if (local_record.guid in this._collections_by_record_guid) {
			Lava.suspendListener(this._collection_listeners_by_guid[local_record.guid].removed);
			this._collections_by_record_guid[local_record.guid].removeValue(event_args.child);
			Lava.resumeListener(this._collection_listeners_by_guid[local_record.guid].removed);
		}

	},

	/**
	 * Record was added to collection by setting it's related Record field. Update local collection
	 * @param {Lava.data.field.Record} field
	 * @param {Lava.data.field.Record#event:removed_child} event_args
	 */
	_onRecordAdded: function(field, event_args) {

		var local_record = event_args.collection_owner;
		if (local_record.guid in this._collections_by_record_guid) {
			Lava.suspendListener(this._collection_listeners_by_guid[local_record.guid].added);
			this._collections_by_record_guid[local_record.guid].includeValue(event_args.child);
			Lava.suspendListener(this._collection_listeners_by_guid[local_record.guid].added);
		}

	},

	isValidValue: function() {

		return false;

	},

	getInvalidReason: function() {

		return  'Collection field does not support setValue';

	},

	'import': function(record, properties, raw_properties) {

		if (raw_properties[this._name]) {

			if (Lava.schema.data.VALIDATE_IMPORT_DATA && !Array.isArray(raw_properties[this._name]))
				Lava.t('Invalid value in import data');

			var i = 0,
				records = this._target_module.loadRecords(raw_properties[this._name]),
				count = records.length;

			for (; i < count; i++) {

				records[i].set(this._target_record_field_name, record);

			}

		}

	},

	'export': function(record, destination_object) {

	},

	getValue: function(record, properties) {

		var guid = record.guid,
			collection;

		if (!(guid in this._collections_by_record_guid)) {

			collection = new Lava.system.Enumerable(this._target_record_field.getCollection(record));
			this._collections_by_record_guid[guid] = collection;
			this._collection_listeners_by_guid[guid] = {
				added: collection.on('items_added', this._onCollectionRecordsAdded, this),
				removed: collection.on('items_removed', this._onCollectionRecordsRemoved, this)
			};
			this._collection_guid_to_record[collection.guid] = record;

		}

		return this._collections_by_record_guid[guid];

	},

	/**
	 * When directly adding records to collection - their related Record field must be set to correct collection owner
	 * @param {Lava.system.Enumerable} collection Collection of records that belong to local record ("children")
	 * @param {Lava.system.Enumerable#event:items_added} event_args
	 */
	_onCollectionRecordsAdded: function(collection, event_args) {

		this._setCollectionOwner(event_args.values, this._collection_guid_to_record[collection.guid]);

	},

	/**
	 * When directly removing records from collection - their related Record field must be set to null
	 * @param {Lava.system.Enumerable} collection Collection of records that belong to local record ("children")
	 * @param {Lava.system.CollectionAbstract#event:items_removed} event_args
	 */
	_onCollectionRecordsRemoved: function(collection, event_args) {

		this._setCollectionOwner(event_args.values, null);

	},

	/**
	 * Set the related {@link Lava.data.field.Record} field of the `records` array to `new_value`
	 * @param {Array.<Lava.data.Record>} records
	 * @param {?Lava.data.Record} new_value
	 */
	_setCollectionOwner: function(records, new_value) {

		var i = 0,
			count = records.length,
			record;

		for (; i < count; i++) {

			record = records[i];
			// everything else will be done by the Record field
			// also, it will raise an event to remove the record from Enumerable
			record.set(this._target_record_field_name, new_value);

		}

	},

	/**
	 * Get count of items in record's collection of this field
	 * @param {Lava.data.Record} record
	 * @param {Object} properties
	 * @returns {Number}
	 */
	getCount: function(record, properties) {

		return this._target_record_field.getCollectionCount(record);

	},

	setValue: function() {

		Lava.t('Trying to set Collection field value');

	},

	isLess: function(record_a, record_b) {

		return this._target_record_field.getCollectionCount(record_a) < this._target_record_field.getCollectionCount(record_b);

	},

	isEqual: function(record_a, record_b) {

		return this._target_record_field.getCollectionCount(record_a) == this._target_record_field.getCollectionCount(record_b);

	},

	destroy: function() {

		var guid;

		for (guid in this._collections_by_record_guid) {

			this._collections_by_record_guid[guid].destroy();

		}

		this._target_record_field.removeListener(this._record_removed_listener);
		this._target_record_field.removeListener(this._record_added_listener);

		this._target_module
			= this._collections_by_record_guid
			= this._collection_listeners_by_guid
			= this._collection_guid_to_record
			= this._target_record_field = null;

		this.Abstract$destroy();

	}

});

Lava.define(
'Lava.data.field.Integer',
/**
 * Holds integer values
 * @lends Lava.data.field.Integer#
 * @extends Lava.data.field.Basic
 */
{

	Extends: 'Lava.data.field.Basic',

	/**
	 * Numbers, consisting of digits and optionally a sign
	 * @type {RegExp}
	 */
	VALID_VALUE_REGEX: /^(\-|\+)?([1-9]\d*|0)$/,

	isValidValue: function(value) {

		return (value === null && this._is_nullable) || (typeof(value) == 'number' && this.VALID_VALUE_REGEX.test(value));

	},

	getInvalidReason: function(value) {

		var reason = this.Basic$getInvalidReason(value);

		if (!reason) {

			if (typeof(value) != 'number') {

				reason = "Value is not a number";

			} else if (this.VALID_VALUE_REGEX.test(value)) {

				reason = "Value is not an integer";

			}

		}

		return reason;

	}

});

Lava.define(
'Lava.data.field.Id',
/**
 * Holds server-side IDs from database table, does NOT generate id's automatically.
 * Currently supports only positive integers as IDs
 *
 * @lends Lava.data.field.Id#
 * @extends Lava.data.field.Abstract
 */
{

	Extends: 'Lava.data.field.Abstract',

	/**
	 * Numbers, consisting of digits, not zero
	 * @type {RegExp}
	 */
	VALID_VALUE_REGEX: /^[1-9]\d*$/,

	/**
	 * ID may be null for new records, which are not saved into database yet
	 */
	_is_nullable: true,

	init: function(module, name, config, module_storage) {

		if (Lava.schema.DEBUG && (('is_nullable' in config) || ('default' in config)))
			Lava.t("Standard ID field can not be configured as nullable or have a default value");

		this.Abstract$init(module, name, config, module_storage);

	},

	onModuleFieldsCreated: function(default_properties) {

		default_properties[this._name] = null;

	},

	isValidValue: function(value) {

		return (value === null && this._is_nullable) || (typeof(value) == 'number' && this.VALID_VALUE_REGEX.test(value));

	},

	getInvalidReason: function(value) {

		var reason = this.Abstract$getInvalidReason(value);

		if (!reason) {

			if (typeof(value) != 'number') {

				reason = "Value is not a number";

			} else if (this.VALID_VALUE_REGEX.test(value)) {

				reason = "Valid values for ID field are positive integers";

			}

		}

		return reason;

	},

	'import': function(record, properties, raw_properties) {

		if (this._name in raw_properties) {

			properties[this._name] = this._getImportValue(properties, raw_properties);

		} else {

			Lava.t("Import record must have an ID");

		}

	},

	'export': function(record, destination_object) {

		destination_object[this._name] = this._properties_by_guid[record.guid][this._name];

	},

	getValue: function(record, properties) {

		return properties[this._name];

	},

	/**
	 * Throws an error
	 */
	setValue: function() {

		Lava.t("Standard id field must not be set");

	}

});

Lava.define(
'Lava.data.field.ForeignKey',
/**
 * Represents a field that references ID field of another record (often from another modules). Maintains collections
 * of local records, grouped by their referenced "parent"
 * @lends Lava.data.field.ForeignKey#
 * @extends Lava.data.field.Basic
 */
{

	Extends: 'Lava.data.field.Basic',

	/**
	 * Instance belongs to ForeignKey field
	 * @type {boolean}
	 * @const
	 */
	isForeignKey: true,

	/**
	 * Local records, grouped by foreign field
	 * @type {Object.<string, Array.<Lava.data.Record>>}
	 */
	_collections_by_foreign_id: {},

	/**
	 * Default foreign id (0 means that no record is referenced)
	 * @type {number}
	 */
	_default: 0,

	initNewRecord: function(record, properties) {

		this._registerByForeignKey(record, properties[this._name]);
		this.Basic$initNewRecord(record, properties);

	},

	'import': function(record, properties, raw_properties) {

		this._registerByForeignKey(record, raw_properties[this._name] || properties[this._name]);// it may have a default
		this.Basic$import(record, properties, raw_properties);

	},

	/**
	 * Add record to local collection of records, grouped by this field
	 * @param {Lava.data.Record} record
	 * @param {string} foreign_key
	 */
	_registerByForeignKey: function(record, foreign_key) {

		if (foreign_key in this._collections_by_foreign_id) {

			this._collections_by_foreign_id[foreign_key].push(record);

		} else {

			this._collections_by_foreign_id[foreign_key] = [record];

		}

	},

	setValue: function(record, properties, new_foreign_key) {

		Firestorm.Array.exclude(this._collections_by_foreign_id[properties[this._name]], record);
		this._registerByForeignKey(record, new_foreign_key);

		this.Basic$setValue(record, properties, new_foreign_key);

	},

	/**
	 * Get local records with given `foreign_key` value
	 * @param {string} foreign_key
	 * @returns {Array.<Lava.data.Record>}
	 */
	getCollection: function(foreign_key) {

		return (foreign_key in this._collections_by_foreign_id) ? this._collections_by_foreign_id[foreign_key].slice() : [];

	},

	destroy: function() {

		this._collections_by_foreign_id = null;
		this.Basic$destroy();

	}

});
/**
 * Fired, when the field's value changes: local record (`child`) now references the `collection_owner`
 * @event Lava.data.field.Record#added_child
 * @type {Object}
 * @property {Lava.data.Record} collection_owner New referenced record
 * @property {Lava.data.Record} child Referencing record from local module
 */

/**
 * Fired, when the field's value changes: local record (`child`) no longer references the `collection_owner`
 * @event Lava.data.field.Record#removed_child
 * @type {Object}
 * @property {Lava.data.Record} collection_owner Old referenced record
 * @property {Lava.data.Record} child Referencing record from local module
 */

Lava.define(
'Lava.data.field.Record',
/**
 * References a record (usually from another module).
 * Also maintains collections of records, grouped by this field (used by mirror Collection field)
 * and synchronizes it's state with accompanying ForeignKey field
 *
 * @lends Lava.data.field.Record#
 * @extends Lava.data.field.Abstract
 */
{

	Extends: 'Lava.data.field.Abstract',

	/**
	 * This class is instance of a Record field
	 * @type {boolean}
	 * @const
	 */
	isRecordField: true,

	/**
	 * Owner module for the records of this field
	 * @type {Lava.data.Module}
	 */
	_referenced_module: null,

	/**
	 * Records, grouped by this field. Serves as a helper for mirror Collection field.
	 * Key is GUID of the foreign record, value is collection of records from local module
	 * @type {Object.<string, Array.<Lava.data.Record>>}
	 */
	_collections_by_foreign_guid: {},

	/**
	 * Name of accompanying {@link Lava.data.field.ForeignKey} field from local module. Example: 'parent_id'
	 * @type {string}
	 */
	_foreign_key_field_name: null,
	/**
	 * Local field with ID of the record in external module
	 * @type {Lava.data.field.ForeignKey}
	 */
	_foreign_key_field: null,
	/**
	 * Listener for {@link Lava.data.field.Abstract#event:changed} in `_foreign_key_field`
	 * @type {_tListener}
	 */
	_foreign_key_changed_listener: null,

	/**
	 * The {@link Lava.data.field.Id} field in external module
	 * @type {Lava.data.field.Abstract}
	 */
	_external_id_field: null,
	/**
	 * The listener for external ID creation event ({@link Lava.data.field.Abstract#event:changed} in `_external_id_field` field)
	 * @type {_tListener}
	 */
	_external_id_changed_listener: null,
	/**
	 * Listener for {@link Lava.data.Module#event:records_loaded} in external module
	 * @type {_tListener}
	 */
	_external_records_loaded_listener: null,

	/**
	 * The foreign ID value, when there is no referenced record
	 * @const
	 */
	EMPTY_FOREIGN_ID: 0,

	_is_nullable: true,

	/**
	 * @param module
	 * @param name
	 * @param {_cRecordField} config
	 * @param module_storage
	 */
	init: function(module, name, config, module_storage) {

		this.Abstract$init(module, name, config, module_storage);
		this._referenced_module = (config.module == 'this') ? module : module.getApp().getModule(config.module);

	},

	onModuleFieldsCreated: function(default_properties) {

		if (this._config.foreign_key_field) {

			if (Lava.schema.DEBUG && !this._referenced_module.hasField('id')) Lava.t("field/Record: the referenced module must have an ID field");

			this._foreign_key_field_name = this._config.foreign_key_field;
			this._foreign_key_field = this._module.getField(this._foreign_key_field_name);
			if (Lava.schema.DEBUG && !this._foreign_key_field.isForeignKey) Lava.t();
			this._foreign_key_changed_listener = this._foreign_key_field.on('changed', this._onForeignKeyChanged, this);
			this._external_id_field = this._referenced_module.getField('id');
			this._external_id_changed_listener = this._external_id_field.on('changed', this._onExternalIdCreated, this);
			this._external_records_loaded_listener = this._referenced_module.on('records_loaded', this._onReferencedModuleRecordsLoaded, this);

		}

		// this field stores the referenced record
		default_properties[this._name] = null;

	},

	/**
	 * There may be local records that reference external records, which are not yet loaded (by ForeignKey).
	 * This field is <kw>null</kw> for them.
	 * When referenced records are loaded - local records must update this field with the newly loaded instances
	 * @param {Lava.data.Module} module
	 * @param {Lava.data.Module#event:records_loaded} event_args
	 */
	_onReferencedModuleRecordsLoaded: function(module, event_args) {

		var records = event_args.records,
			count = records.length,
			i = 0,
			local_records,
			local_count,
			local_index,
			local_record;

		for (; i < count; i++) {

			local_records = this._foreign_key_field.getCollection(records[i].get('id'));

			// these records belong to this module and have this field null.
			// Now, as the foreign record is loaded - the field can be updated.
			for (local_count = local_records.length, local_index = 0; local_index < local_count; local_index++) {
				local_record = local_records[local_index];
				this._properties_by_guid[local_record.guid][this._name] = records[i];
				this._fireFieldChangedEvents(local_record);
			}

		}

	},

	/**
	 * A record was saved to the database and assigned an id. Need to assign foreign keys for local records
	 * @param {Lava.data.field.Id} foreign_module_id_field
	 * @param {Lava.data.field.Abstract#event:changed} event_args
	 */
	_onExternalIdCreated: function(foreign_module_id_field, event_args) {

		var referenced_record = event_args.record, // record belongs to foreign module
			new_referenced_id = referenced_record.get('id'),
			collection,
			i = 0,
			count;

		if (referenced_record.guid in this._collections_by_foreign_guid) {

			collection = this._collections_by_foreign_guid[referenced_record.guid];

			// Set the value of foreign ID field in all local records that reference this foreign record.
			// Situation: there is a new record, which was created in the browser, and some records that reference it
			// (either new or loaded from database). It's new, so there are no records on server that reference it.
			if (this._foreign_key_field) {

				Lava.suspendListener(this._foreign_key_changed_listener);

				for (count = collection.length; i < count; i++) {

					collection[i].set(this._foreign_key_field_name, new_referenced_id);

				}

				Lava.resumeListener(this._foreign_key_changed_listener);

			}

		}

	},

	/**
	 * Fires, when local record's foreign id field is assigned a new value.
	 * Example:
	 * ```javascript
	 * record.set('category_id', 123); // 'record' is from local module, 123 - id of foreign record
	 * ```
	 * @param {Lava.data.field.ForeignKey} foreign_key_field
	 * @param {Lava.data.field.Abstract#event:changed} event_args
	 */
	_onForeignKeyChanged: function(foreign_key_field, event_args) {

		var record = event_args.record, // record belongs to this module
			properties = this._properties_by_guid[record.guid];

		if (properties[this._name] != null) {

			// remove old record from collection
			this._unregisterRecord(record, properties[this._name]);

		}

		if (properties[this._foreign_key_field_name]) {

			this._registerByReferencedId(record, properties, properties[this._foreign_key_field_name]);

		} else {

			properties[this._name] = null;

		}

		this._fireFieldChangedEvents(record);

	},

	isValidValue: function(new_record) {

		return (
				(new_record === null && this._is_nullable)
				|| (typeof(new_record) != 'undefined'
					&& new_record.isRecord
					&& new_record.getModule() === this._referenced_module)
			);

	},

	getInvalidReason: function(value) {

		var reason = this.Abstract$getInvalidReason(value);

		if (!reason) {

			if (!value.isRecord) {

				reason = "Value is not record";

			} else if (value.getModule() === this._referenced_module) {

				reason = "Value is from different module than this field refers to";

			}

		}

		return reason;

	},

	initNewRecord: function(record, properties) {

		if (this._foreign_key_field && properties[this._foreign_key_field_name]) {

			this._registerByReferencedId(record, properties, properties[this._foreign_key_field_name]);

		}

	},

	'import': function(record, properties, raw_properties) {

		var foreign_id;

		if (this._foreign_key_field) {

			// if foreign id is in import - then it will replace the default value (if foreign kay has default)
			foreign_id = raw_properties[this._foreign_key_field_name] || properties[this._foreign_key_field_name];
			if (foreign_id) {
				this._registerByReferencedId(record, properties, foreign_id);
			}

		}

	},

	/**
	 * Update value of this field in local `record` and add the record to field's internal collections
	 * @param {Lava.data.Record} record The local record
	 * @param {Object} properties The properties of local record
	 * @param {string} referenced_record_id The id of foreign record, which it belongs to
	 */
	_registerByReferencedId: function(record, properties, referenced_record_id) {

		properties[this._name] = this._referenced_module.getRecordById(referenced_record_id) || null;

		if (properties[this._name]) {

			this._registerRecord(record, properties[this._name]);

		}

	},

	'export': function(record, destination_object) {

	},

	getValue: function(record, properties) {

		return properties[this._name];

	},

	setValue: function(record, properties, new_ref_record) {

		if (!this.isValidValue(new_ref_record))
			Lava.t("Field/Record: assigned value is not valid. Reason: " + this.getInvalidReason(new_ref_record));

		if (properties[this._name] != null) {

			// remove from the old record's collection
			this._unregisterRecord(record, properties[this._name]);

		}

		properties[this._name] = new_ref_record;
		if (new_ref_record != null) {

			this._registerRecord(record, new_ref_record)

		}

		if (this._foreign_key_field) {

			Lava.suspendListener(this._foreign_key_changed_listener);

			if (new_ref_record != null) {

				// if this module has foreign_key_field then foreign module must have an ID column
				record.set(this._foreign_key_field_name, new_ref_record.get('id'));

			} else {

				record.set(this._foreign_key_field_name, this.EMPTY_FOREIGN_ID);

			}

			Lava.resumeListener(this._foreign_key_changed_listener);

		}

		this._fireFieldChangedEvents(record);

	},

	/**
	 * Remove `local_record` from field's internal collection referenced by `referenced_record`
	 * @param {Lava.data.Record} local_record
	 * @param {Lava.data.Record} referenced_record
	 */
	_unregisterRecord: function(local_record, referenced_record) {

		if (!Firestorm.Array.exclude(this._collections_by_foreign_guid[referenced_record.guid], local_record)) Lava.t();
		this._fire('removed_child', {
			collection_owner: referenced_record,
			child: local_record
		});

	},

	/**
	 * Add `local_record` to field's internal collection of records from local module, referenced by `referenced_record`
	 * @param {Lava.data.Record} local_record
	 * @param {Lava.data.Record} referenced_record The collection owner
	 */
	_registerRecord: function(local_record, referenced_record) {

		var referenced_guid = referenced_record.guid;

		if (referenced_guid in this._collections_by_foreign_guid) {

			if (Lava.schema.DEBUG && this._collections_by_foreign_guid[referenced_guid].indexOf(local_record) != -1)
				Lava.t("Duplicate record");
			this._collections_by_foreign_guid[referenced_guid].push(local_record);

		} else {

			this._collections_by_foreign_guid[referenced_guid] = [local_record];

		}

		this._fire('added_child', {
			collection_owner: referenced_record,
			child: local_record
		});

	},

	/**
	 * API for {@link Lava.data.field.Collection} field. Get all local records, which reference `referenced_record`
	 * @param {Lava.data.Record} referenced_record The collection's owner record from referenced module
	 * @returns {Array} All records
	 */
	getCollection: function(referenced_record) {

		return (referenced_record.guid in this._collections_by_foreign_guid)
			? this._collections_by_foreign_guid[referenced_record.guid].slice()
			: []; // fast operation: array of objects

	},

	/**
	 * API for {@link Lava.data.field.Collection} field. Get count of local records, which reference the `referenced_record`
	 * @param {Lava.data.Record} referenced_record The collection's owner record from referenced module
	 * @returns {Number}
	 */
	getCollectionCount: function(referenced_record) {

		var collection = this._collections_by_foreign_guid[referenced_record.guid];
		return collection ? collection.length : 0;

	},

	/**
	 * Get `_referenced_module`
	 * @returns {Lava.data.Module}
	 */
	getReferencedModule: function() {

		return this._referenced_module;

	},

	/**
	 * Get field's value equivalent for comparison
	 * @param {Lava.data.Record} record
	 * @returns {string}
	 */
	_getComparisonValue: function(record) {

		if (Lava.schema.DEBUG && !(record.guid in this._properties_by_guid)) Lava.t("isLess: record does not belong to this module");
		var ref_record_a = this._properties_by_guid[record.guid][this._name];
		// must return undefined, cause comparison against nulls behaves differently
		return ref_record_a ? ref_record_a.get('id') : void 0;

	},

	isLess: function(record_a, record_b) {

		return this._getComparisonValue(record_a) < this._getComparisonValue(record_b);

	},

	isEqual: function(record_a, record_b) {

		return this._getComparisonValue(record_a) == this._getComparisonValue(record_b);

	},

	destroy: function() {

		if (this._config.foreign_key_field) {

			this._foreign_key_field.removeListener(this._foreign_key_changed_listener);
			this._external_id_field.removeListener(this._external_id_changed_listener);

		}

		this._referenced_module.removeListener(this._external_records_loaded_listener);

		this._referenced_module
			= this._collections_by_foreign_guid
			= this._foreign_key_field
			= this._external_id_field
			= null;

		this.Abstract$destroy();

	}

});

Lava.define(
'Lava.data.field.Boolean',
/**
 * Field that holds boolean values (<kw>true</kw> or <kw>false</kw>)
 * @lends Lava.data.field.Boolean#
 * @extends Lava.data.field.Basic
 */
{

	Extends: 'Lava.data.field.Basic',

	/**
	 * @type {boolean}
	 */
	_default: false,

	isValidValue: function(value) {

		return (value === null && this._is_nullable) || (typeof(value) == 'boolean');

	},

	getInvalidReason: function(value) {

		var reason = this.Basic$getInvalidReason(value);

		if (!reason && typeof(value) != 'boolean') {

			reason = "Value is not boolean type";

		}

		return reason;

	}

});

Lava.define(
'Lava.data.field.Guid',
/**
 * Returns record's `guid` property
 * @lends Lava.data.field.Guid#
 * @extends Lava.data.field.Abstract
 */
{

	Extends: 'Lava.data.field.Abstract',

	'export': function(record, destination_object) {

		destination_object['guid'] = record.guid;

	},

	/**
	 * Get record's `guid` property
	 * @param record
	 * @param properties
	 * @returns {_tGUID}
	 */
	getValue: function(record, properties) {

		return record.guid;

	},

	/**
	 * Throws an error
	 */
	setValue: function(record, properties, value) {

		Lava.t('Guid field is read only');

	}

});

Lava.define(
'Lava.data.ModuleAbstract',
/**
 * Base class for modules
 *
 * @lends Lava.data.ModuleAbstract#
 * @extends Lava.mixin.Observable
 */
{

	Extends: 'Lava.mixin.Observable',

	/**
	 * Module's config
	 * @type {(_cModule|_cMetaStorage)}
	 */
	_config: null,
	/**
	 * Module's field instances
	 * @type {Object.<string, Lava.data.field.Abstract>}
	 */
	_fields: {},
	/**
	 * All records in this module
	 * @type {Array.<Lava.data.Record>}
	 */
	_records: [],
	/**
	 * Records by their global unique identifiers
	 * @type {Object.<string, Lava.data.Record>}
	 */
	_records_by_guid: {},
	/**
	 * Record's properties by their global unique identifiers
	 * @type {Object.<string, Lava.data.Record>}
	 */
	_properties_by_guid: {},
	/**
	 * Cached record class constructor
	 * @type {function}
	 */
	_record_constructor: null,

	/**
	 * Create field instances and return the default record properties object
	 * @param {(_cModule|_cMetaStorage)} config
	 * @returns {Object} Default record properties object with initial values for each field
	 */
	_createFields: function(config) {

		var field_name,
			type,
			constructor;

		for (field_name in config.fields) {

			type = config.fields[field_name].type || Lava.schema.data.DEFAULT_FIELD_TYPE;
			constructor = Lava.ClassManager.getConstructor(type, 'Lava.data.field');
			this._fields[field_name] = new constructor(
				this,
				field_name,
				config.fields[field_name],
				this._properties_by_guid
			);

		}

	},

	/**
	 * Called by App instance. Do not call this function directly.
	 */
	initFields: function() {

		var default_properties = {},
			field_name;

		for (field_name in this._fields) {

			this._fields[field_name].onModuleFieldsCreated(default_properties);

		}

		this._createRecordProperties = new Function(
			"return " + Lava.serializer.serialize(default_properties)
		);

	},

	/**
	 * Returns an object with record's initial properties. This function is generated in constructor
	 * @returns {Object}
	 */
	_createRecordProperties: function() {

		Lava.t('Module requires initialization');

	},

	/**
	 * Return a copy of local `_records` array
	 * @returns {Array.<Lava.data.Record>}
	 */
	getAllRecords: function() {

		return this._records.slice();

	},

	/**
	 * Get number of records in the module
	 * @returns {number}
	 */
	getCount: function() {

		return this._records.length;

	},

	/**
	 * Free resources and make this instance unusable
	 */
	destroy: function() {

		var name;
			//i = 0,
			//count = this._records.length;

		/*for (; i < count; i++) {

			this._records[i].destroy();

		}*/

		for (name in this._fields) {

			this._fields[name].destroy();

		}

		this._records = this._records_by_guid = this._properties_by_guid = this._fields = null;

	}

});

/**
 * Records have been loaded from server
 * @event Lava.data.Module#records_loaded
 * @type {Object}
 * @property {Array.<Lava.data.Record>} records The loaded record instances
 */

/**
 * New records have been created
 * @event Lava.data.Module#records_created
 * @type {Object}
 * @property {Array.<Lava.data.Record>} records The new record instances
 */

Lava.define(
'Lava.data.Module',
/**
 * Module represents a server-side database table
 *
 * @lends Lava.data.Module#
 * @extends Lava.data.ModuleAbstract
 */
{

	Extends: 'Lava.data.ModuleAbstract',

	/**
	 * Application instance reference
	 * @type {Lava.system.App}
	 */
	_app: null,
	/**
	 * Module name
	 * @type {string}
	 */
	_name: null,

	/**
	 * All records by their unique ID key (if module has an ID field)
	 * @type {Object.<string, Lava.data.Record>}
	 */
	_records_by_id: {},

	/**
	 * Does this module have an ID field
	 * @type {boolean}
	 */
	_has_id: false,

	/**
	 * Create a Module instance, init fields, generate the method that returns initial record properties
	 * @param {Lava.system.App} lava_app Application instance
	 * @param {_cModule} config
	 * @param {string} name Module's name
	 */
	init: function(lava_app, config, name) {

		this._app = lava_app;
		this._config = config;
		this._name = name;

		this._createFields(config);

		this._record_constructor = Lava.ClassManager.getConstructor(
			config.record_class || Lava.schema.data.DEFAULT_RECORD_CLASS,
			'Lava.data'
		);

		if ('id' in this._fields) {

			this._has_id = true;
			this._fields['id'].on('changed', this._onRecordIdChanged, this);

		}

	},

	/**
	 * Record's ID has been created (ID fields never change). Need to update local `_records_by_id` hash
	 * @param {Lava.data.field.Abstract} id_field
	 * @param {Lava.data.field.Abstract#event:changed} event_args
	 */
	_onRecordIdChanged: function(id_field, event_args) {

		var id = event_args.record.get('id');
		if (id in this._records_by_id) Lava.t("Duplicate record id in module " + this._name);
		this._records_by_id[id] = event_args.record;

	},

	/**
	 * Does this module have an ID field with given name
	 * @param {string} name
	 * @returns {boolean}
	 */
	hasField: function(name) {

		return name in this._fields;

	},

	/**
	 * Get field instance
	 * @param {string} name
	 * @returns {Lava.data.field.Abstract}
	 */
	getField: function(name) {

		return this._fields[name];

	},

	/**
	 * Get a record by it's ID field
	 * @param {string} id
	 * @returns {Lava.data.Record}
	 */
	getRecordById: function(id) {

		return this._records_by_id[id];

	},

	/**
	 * Get a record by it's global unique identifier
	 * @param {_tGUID} guid
	 * @returns {Lava.data.Record}
	 */
	getRecordByGuid: function(guid) {

		return this._records_by_guid[guid];

	},

	/**
	 * Get `_app`
	 * @returns {Lava.system.App}
	 */
	getApp: function() {

		return this._app;

	},

	/**
	 * Load record only if it has not been already loaded. `raw_properties` must have an ID
	 * @param {Object} raw_properties Serialized record fields from server
	 * @returns {Lava.data.Record} Newly loaded record instance, or the old one
	 */
	safeLoadRecord: function(raw_properties) {

		var result;

		if (Lava.schema.DEBUG && !raw_properties.id) Lava.t('safeLoadRecord: import data must have an id');

		if (raw_properties.id in this._records_by_id) {

			result = this._records_by_id[raw_properties.id];

		} else {

			result = this.loadRecord(raw_properties);

		}

		return result;

	},

	/**
	 * Initialize a module record from server-side data
	 * @param {Object} raw_properties Serialized record fields from server
	 * @returns {Lava.data.Record} Loaded record instance
	 */
	loadRecord: function(raw_properties) {

		var record = this._createRecordInstance(raw_properties);
		this._fire('records_loaded', {records: [record]});
		return record;

	},

	/**
	 * Create a new record instance
	 * @returns {Lava.data.Record}
	 */
	createRecord: function() {

		var record = this._createRecordInstance();
		this._fire('records_created', {records: [record]});
		return record;

	},

	/**
	 * Perform creation of a new record instance (either with server-side data, or without it)
	 * @param {Object} raw_properties
	 * @returns {Lava.data.Record}
	 */
	_createRecordInstance: function(raw_properties) {

		var properties = this._createRecordProperties(),
			record = new this._record_constructor(this, this._fields, properties, raw_properties);

		if (properties.id) {

			if (properties.id in this._records_by_id) Lava.t("Duplicate record id in module " + this._name);
			this._records_by_id[properties.id] = record;

		}

		this._records.push(record);
		this._properties_by_guid[record.guid] = properties;
		this._records_by_guid[record.guid] = record;
		return record;

	},

	/**
	 * Initialize module records from server-side data
	 * @param {Array.<Object>} raw_records_array Server-side data for the records
	 * @returns {Array.<Lava.data.Record>} Loaded record instances
	 */
	loadRecords: function(raw_records_array) {

		var i = 0,
			count = raw_records_array.length,
			records = [];

		for (; i < count; i++) {

			records.push(this._createRecordInstance(raw_records_array[i]));

		}

		this._fire('records_loaded', {records: records});

		return records;

	},

	destroy: function() {

		this._records_by_id = null;
		this.ModuleAbstract$destroy();

	}

});

Lava.define(
'Lava.data.Record',
/**
 * Standard module record
 *
 * @lends Lava.data.Record#
 * @extends Lava.mixin.Properties
 */
{

	Implements: 'Lava.mixin.Properties',
	/**
	 * To tell other classes that this is instance of Record
	 * @type {boolean}
	 * @const
	 */
	isRecord: true,
	/**
	 * Record's `_properties` are assigned in constructor, so here we replace the default value (empty object)
	 * to save some time on garbage collection
	 * @type {Object}
	 */
	_properties: null,
	/**
	 * Record's module
	 * @type {Lava.data.ModuleAbstract}
	 */
	_module: null,
	/**
	 * Reference to module's fields
	 * @type {Object.<string, Lava.data.field.Abstract>}
	 */
	_fields: null,
	/**
	 * Global unique identifier
	 * @type {_tGUID}
	 */
	guid: null,

	/**
	 * Create record instance
	 * @param {Lava.data.ModuleAbstract} module Records module
	 * @param {Object.<string, Lava.data.field.Abstract>} fields Object with module's fields
	 * @param {Object} properties_ref Reference to an object with record's properties
	 * @param {Object} raw_properties Object with record field values from server
	 */
	init: function(module, fields, properties_ref, raw_properties) {

		this.guid = Lava.guid++;
		this._module = module;
		this._fields = fields;
		this._properties = properties_ref;

		var field;

		if (typeof(raw_properties) != 'undefined') {

			for (field in fields) {

				fields[field]['import'](this, properties_ref, raw_properties);

			}

		} else {

			for (field in fields) {

				fields[field].initNewRecord(this, properties_ref);

			}

		}

	},

	get: function(name) {

		if (Lava.schema.DEBUG && !(name in this._fields)) Lava.t('[Record] No such field: ' + name);
		return this._fields[name].getValue(this, this._properties);

	},

	set: function(name, value) {

		if (Lava.schema.DEBUG && !(name in this._fields)) Lava.t('[Record] No such field: ' + name);
		this._fields[name].setValue(this, this._properties, value);

	},

	/**
	 * Get `_module`
	 * @returns {Lava.data.ModuleAbstract}
	 */
	getModule: function() {

		return this._module;

	},

	/**
	 * Export record back into plain JavaScript object for sending to server
	 * @returns {Object}
	 */
	'export': function() {

		var export_record = {};

		for (var field in this._fields) {

			this._fields[field]['export'](this, export_record);

		}

		return export_record;

	}

});

Lava.define(
'Lava.data.MetaRecord',
/**
 * Record for {@link Lava.data.MetaStorage} module
 * @lends Lava.data.MetaRecord#
 * @extends Lava.data.Record
 */
{

	Extends: 'Lava.data.Record',

	/**
	 * Instance belongs to MetaRecord class
	 * @type {boolean}
	 * @const
	 */
	isMetaRecord: true,

	/**
	 * GUID of external record (or object), to which this instance is attached
	 * @type {number}
	 * @readonly
	 */
	ext_guid: 0,
	/**
	 * Optional external record instance, which owns `ext_guid`
	 * @type {Object}
	 */
	_original_record: null,

	/**
	 * @param module
	 * @param fields
	 * @param properties_ref
	 * @param raw_properties
	 * @param {Object} original_record Optional external record instance, to which this record is attached
	 */
	init: function(module, fields, properties_ref, raw_properties, original_record) {

		this.Record$init(module, fields, properties_ref, raw_properties);

		if (original_record) {

			this._original_record = original_record;

		}

	},

	/**
	 * Get `_original_record`
	 * @returns {?Object}
	 */
	getOriginalRecord: function() {

		return this._original_record;

	}

});

Lava.define(
'Lava.data.MetaStorage',
/**
 * Module that is designed to extend normal modules with additional fields. Cannot have an ID field
 * @lends Lava.data.MetaStorage#
 * @extends Lava.data.ModuleAbstract
 * @extends Lava.mixin.Properties
 */
{

	Extends: 'Lava.data.ModuleAbstract',
	Implements: 'Lava.mixin.Properties',

	/**
	 * Create an instance of MetaStorage
	 * @param {_cMetaStorage} config
	 */
	init: function(config) {

		if ('id' in config.fields) Lava.t("Id field in MetaStorage is not permitted");

		this._config = config;
		this._createFields(config);
		this.initFields(); // MetaStorage is constructed directly, not via App class

		var field;

		if (Lava.schema.DEBUG) {
			for (field in this._fields) {
				if (this._fields[field].isCollectionField || this._fields[field].isRecordField)
					Lava.t("Standard Collection and Record fields will not work inside the MetaStorage");
			}
		}

		this._record_constructor = Lava.ClassManager.getConstructor('MetaRecord', 'Lava.data');

	},

	/**
	 * Get an extension record by GUID of normal record
	 * @param {_tGUID} ext_guid
	 * @returns {Lava.data.MetaRecord}
	 * @lava-param-renamed name -> ext_guid
	 */
	get: function(ext_guid) {

		return this._properties[ext_guid];

	},

	/**
	 * Throws an error
	 */
	set: function() {

		Lava.t("MetaStorage: set operation is not permitted");

	},

	/**
	 * Create a new MetaRecord instance
	 * @param {_tGUID} ext_guid GUID of the external record, to which this MetaRecord will be attached
	 * @param {Object} raw_properties Initial field values
	 * @param {Object} [original_record] Original record, which will be saved in MetaRecord instance
	 * @returns {Lava.data.MetaRecord}
	 */
	createMetaRecord: function(ext_guid, raw_properties, original_record) {

		if (ext_guid in this._properties) Lava.t("MetaRecord already exists");

		var properties = this._createRecordProperties(),
			record = new this._record_constructor(this, this._fields, properties, raw_properties, original_record);

		record.ext_guid = ext_guid;
		this._records.push(record);
		this._properties_by_guid[record.guid] = properties;
		this._records_by_guid[record.guid] = record;

		this._properties[ext_guid] = record;
		this.firePropertyChangedEvents(ext_guid);

		return record;

	}

});
Lava.define(
'Lava.scope.Abstract',
/**
 * Abstract class for data binding
 * @lends Lava.scope.Abstract#
 * @extends Lava.mixin.Refreshable
 */
{

	Extends: 'Lava.mixin.Refreshable',

	/**
	 * Instance belongs to scope/Abstract
	 * @type {boolean}
	 * @const
	 */
	isValueContainer: true,

	/**
	 * Scopes, bound to properties of the value of this container
	 * @type {Object.<string, Lava.scope.DataBinding>}
	 */
	_data_bindings_by_property: {},

	/**
	 * Segments, bound to properties of the value of this container.
	 * [name_source_guid} => Segment
	 * @type {Object.<_tGUID, Lava.scope.Segment>}
	 */
	_data_segments: {},

	/**
	 * Get a scope, which is bound to property of the value of this container
	 * @param {string} property_name
	 * @returns {Lava.scope.DataBinding}
	 */
	getDataBinding: function(property_name) {

		if (!(property_name in this._data_bindings_by_property)) {

			this._data_bindings_by_property[property_name] = new Lava.scope.DataBinding(this, property_name);

		}

		return this._data_bindings_by_property[property_name];

	},

	/**
	 * Get a {@link Lava.scope.Segment}, which is bound to property of the value of this container
	 * @param {(Lava.scope.PropertyBinding|Lava.scope.DataBinding)} name_source_scope
	 * @returns {Lava.scope.Segment}
	 */
	getSegment: function(name_source_scope) {

		if (Lava.schema.DEBUG && !name_source_scope.guid) Lava.t("Only PropertyBinding and DataBinding may be used as name source for segments");

		if (!(name_source_scope.guid in this._data_segments)) {

			this._data_segments[name_source_scope.guid] = new Lava.scope.Segment(this, name_source_scope);

		}

		return this._data_segments[name_source_scope.guid];

	},

	/**
	 * Free resources and make this instance unusable
	 */
	destroy: function() {

		var name;

		for (name in this._data_bindings_by_property) {

			this._data_bindings_by_property[name].destroy();

		}

		for (name in this._data_segments) {

			this._data_segments[name].destroy();

		}

		this.suspendRefreshable();

	}

});

/**
 * Argument's value has changed
 * @event Lava.scope.Argument#changed
 * @type {Object}
 * @property {*} old_value Optional: old value of the argument
 */

Lava.define(
'Lava.scope.Argument',
/**
 * Evaluates expression in context of it's view
 *
 * @lends Lava.scope.Argument#
 * @extends Lava.mixin.Refreshable
 * @implements _iValueContainer
 */
{

	Extends: 'Lava.mixin.Refreshable',
	/**
	 * Sign that this instance implements {@link _iValueContainer}
	 * @type {boolean}
	 * @const
	 */
	isValueContainer: true,

	/**
	 * Owner view
	 * @type {Lava.view.Abstract}
	 */
	_view: null,
	/**
	 * Nearest widget in hierarchy
	 * @type {Lava.widget.Standard}
	 */
	_widget: null,
	/**
	 * Generated method that is called in context of Argument instance and produces the argument's result
	 * @type {function}
	 */
	_evaluator: null,
	/**
	 * Global unique identifier
	 * @type {_tGUID}
	 */
	guid: null,

	/**
	 * Scopes that provide operands for the `_evaluator`
	 * @type {Array.<_iValueContainer>}
	 */
	_binds: [],
	/**
	 * Length of `_binds` array
	 * @type {number}
	 */
	_binds_count: 0,
	/**
	 * Listeners for <str>"changed"</str> events
	 * @type {Array.<_tListener>}
	 */
	_bind_changed_listeners: [],

	/**
	 * Objects with a reference to modifier's widget (it's cached to speed up calling) and modifier name
	 * @type {Array.<Object>}
	 */
	_modifier_descriptors: [],

	// Alpha version. Not used
	//_active_modifiers: [],

	/**
	 * Create an Argument instance. Acquire binds, find modifier sources, apply correct state
	 * @param {_cArgument} config
	 * @param {Lava.view.Abstract} view Argument's view
	 * @param {Lava.widget.Standard} widget Nearest widget in hierarchy
	 */
	init: function(config, view, widget) {

		this.guid = Lava.guid++;
		this._view = view;
		this._widget = widget;
		this._evaluator = config.evaluator;

		var i = 0,
			count,
			bind,
			binds = config.binds;

		if (binds) {

			for (count = binds.length; i < count; i++) {

				if (binds[i].isDynamic) {

					bind = view.locateViewByPathConfig(binds[i]).getDynamicScope(view, binds[i]);

				} else {

					bind = view.getScopeByPathConfig(binds[i]);

				}

				this._binds.push(bind);
				this._bind_changed_listeners.push(bind.on('changed', this.onBindingChanged, this));

				if (this.level < bind.level) {

					this.level = bind.level;

				}

			}

			this.level++;

		}

		if ('modifiers' in config) {

			for (i = 0, count = config.modifiers.length; i < count; i++) {

				this._modifier_descriptors.push({
					widget: this.getWidgetByModifierConfig(config.modifiers[i]),
					callback_name: config.modifiers[i].callback_name
				});

			}

		}

		/*if ('active_modifiers' in config) {

			for (i = 0, count = config.active_modifiers.length; i < count; i++) {

				this._active_modifiers.push({
					widget: this.getWidgetByModifierConfig(config.active_modifiers[i]),
					callback_name: config.active_modifiers[i].callback_name
				});

			}

		}*/

		this._binds_count = this._binds.length;
		this._value = this._evaluate();

	},

	/**
	 * Get widget, that will be used to call a modifier
	 * @param {_cKnownViewLocator} path_config Route to the widget
	 * @returns {Lava.widget.Standard}
	 */
	getWidgetByModifierConfig: function(path_config) {

		var widget = this._widget.locateViewByPathConfig(path_config);
		if (Lava.schema.DEBUG && !widget.isWidget) Lava.t("Tried to call a modifier from non-widget view");

		return /** @type {Lava.widget.Standard} */ widget;

	},

	/**
	 * One of evaluator's operands has changed. Instance is now dirty
	 */
	onBindingChanged: function() {

		this._queueForRefresh();

	},

	/**
	 * Execute `_evaluator` and return
	 * @returns {*} The Argument's result
	 */
	_evaluate: function() {

		var result = null;

		// in production - wrap evaluation into try/catch block
		if (Lava.schema.DEBUG) {

			result = this._evaluator();

		} else {

			try {

				result = this._evaluator();

			} catch (e) {

				Lava.logException(e);

			}

		}

		return result;

	},

	/**
	 * Get `_value`
	 * @returns {*}
	 */
	getValue: function() {

		return this._value;

	},

	/**
	 * Refresh `_value` and fire {@link Lava.scope.Argument#event:changed}
	 * @private
	 */
	_doRefresh: function() {

		var new_value = this._evaluate(),
			event_args;

		if (new_value !== this._value) {

			event_args = {old_value: this._value};
			this._value = new_value;
			this._fire('changed', event_args);

		}

	},

	/**
	 * Call a modifier from widget
	 * @param {number} index
	 * @param {?Array.<*>} arguments_array
	 * @returns {*}
	 */
	_callModifier: function(index, arguments_array) {

		return this._modifier_descriptors[index].widget.callModifier(this._modifier_descriptors[index].callback_name, arguments_array);

	},

	/**
	 * Alpha. Not used
	 * @param index
	 * @param arguments_array
	 * @returns {*}
	 */
	_callActiveModifier: function(index, arguments_array) {

	},

	/**
	 * Calls a global function from {@link Lava.modifiers}
	 * @param {string} name The function's name
	 * @param {?Array.<*>} arguments_array Evaluator's arguments
	 * @returns {*}
	 */
	_callGlobalModifier: function(name, arguments_array) {

		if (Lava.schema.DEBUG && !(name in Lava.modifiers)) Lava.t("Unknown global modifier: " + name);
		return Lava.modifiers[name].apply(Lava.modifiers, arguments_array);

	},

	/**
	 * Free resources and make this instance unusable
	 */
	destroy: function() {

		for (var i = 0, count = this._bind_changed_listeners.length; i < count; i++) {

			this._binds[i].removeListener(this._bind_changed_listeners[i]);

		}

		this._bind_changed_listeners = null;
		this.suspendRefreshable();

	}

});
Lava.define(
'Lava.scope.Binding',
/**
 * Two-way binding between a widget property and a scope path
 * @lends Lava.scope.Binding#
 */
{

	/**
	 * The scope, which is bound to property of the widget
	 * @type {_iValueContainer}
	 */
	_scope: null,
	/**
	 * Widget with bound property
	 * @type {Lava.widget.Standard}
	 */
	_widget: null,
	/**
	 * Bound property name in widget
	 * @type {string}
	 */
	_property_name: null,

	/**
	 * Listener for "changed" event
	 * @type {_tListener}
	 */
	_scope_changed_listener: null,
	/**
	 * Listener for onPropertyChanged in `_widget`
	 * @type {_tListener}
	 */
	_widget_property_changed_listener: null,

	/**
	 * Create Binding instance. Refresh widget's property value
	 * @param {_cBinding} config
	 * @param {Lava.widget.Standard} widget
	 */
	init: function(config, widget) {

		this._widget = widget;
		this._property_name = config.property_name;
		this._scope = widget.getScopeByPathConfig(config.path_config);

		if (config.from_widget) {

			this._scope.setValue(this._widget.get(this._property_name));

		} else {

			this._widget.set(this._property_name, this._scope.getValue());
			this._scope_changed_listener = this._scope.on('changed', this.onScopeChanged, this);

		}

		if (!this._scope.isSetValue) Lava.t("Binding: bound scope does not implement setValue");
		this._widget_property_changed_listener = widget.onPropertyChanged(this._property_name, this.onWidgetPropertyChanged, this);

	},

	/**
	 * Scope, which is bound to widget property, has changed. Refresh widget property value
	 */
	onScopeChanged: function() {

		// avoid setting nulls to non-nullable fields.
		if (this._scope.isConnected()) {

			// turning off both of them to avoid infinite loop. From architect's point of view, better solution would be
			// to hang up developer's browser, but if it happens in production - it may have disastrous consequences.
			Lava.suspendListener(this._widget_property_changed_listener);
			this._scope_changed_listener && Lava.suspendListener(this._scope_changed_listener);
			this._widget.set(this._property_name, this._scope.getValue());
			Lava.resumeListener(this._widget_property_changed_listener);
			this._scope_changed_listener && Lava.resumeListener(this._scope_changed_listener);

		}

	},

	/**
	 * Widget property has changed. Refresh bound scope value
	 */
	onWidgetPropertyChanged: function() {

		Lava.suspendListener(this._widget_property_changed_listener);
		this._scope_changed_listener && Lava.suspendListener(this._scope_changed_listener);
		this._scope.setValue(this._widget.get(this._property_name));
		Lava.resumeListener(this._widget_property_changed_listener);
		this._scope_changed_listener && Lava.resumeListener(this._scope_changed_listener);

	},

	destroy: function() {

		this._scope_changed_listener && this._scope.removeListener(this._scope_changed_listener);
		this._widget.removePropertyListener(this._widget_property_changed_listener);

	}

});

/**
 * Value of this DataBinding instance has changed
 * @event Lava.scope.DataBinding#changed
 */

Lava.define(
'Lava.scope.DataBinding',
/**
 * Binding to a property of a JavaScript object with special support for {@link Lava.mixin.Properties}
 * and {@link Lava.system.Enumerable} instances
 *
 * @lends Lava.scope.DataBinding#
 * @extends Lava.scope.Abstract
 * @implements _iValueContainer
 */
{

	Extends: 'Lava.scope.Abstract',
	/**
	 * This instance supports two-way data binding
	 * @type {boolean}
	 * @const
	 */
	isSetValue: true,
	/**
	 * Global unique identifier of this instance
	 * @type {_tGUID}
	 */
	guid: null,

	/**
	 * The name of property to which this scope is bound
	 * @type {string}
	 */
	_property_name: null,

	/**
	 * Scope, that provides data source for this instance
	 * @type {_iValueContainer}
	 */
	_value_container: null,
	/**
	 * Listener for "changed" event in `_value_container`
	 * @type {_tListener}
	 */
	_container_changed_listener: null,

	/**
	 * Listener for onPropertyChanged in data source of this scope (if data source is instance of {@link Lava.mixin.Properties})
	 * @type {_tListener}
	 */
	_property_changed_listener: null,
	/**
	 * Listener for {@link Lava.system.Enumerable#event:collection_changed} in data source of this scope
	 * (if data source is instance of {@link Lava.system.Enumerable})
	 * @type {_tListener}
	 */
	_enumerable_changed_listener: null,
	/**
	 * Data source for this scope, from which this scope gets it's value. Also, value of the `_value_container`
	 * @type {*}
	 */
	_property_container: null,

	/**
	 * Is `_property_container` an existing object, or this scope is not bound to an existing value
	 * @type {boolean}
	 */
	_is_connected: false,

	/**
	 * Create DataBinding instance
	 * @param {_iValueContainer} value_container The scope, which provides the data source for this instance
	 * @param {string} property_name
	 */
	init: function(value_container, property_name) {

		this.guid = Lava.guid++;
		this._value_container = value_container;
		this._property_name = property_name;
		this.level = value_container.level + 1;
		this._container_changed_listener = value_container.on('changed', this.onParentDataSourceChanged, this);
		this._refreshValue();

		Lava.schema.DEBUG && Lava.ScopeManager.debugTrackScope(this);

	},

	/**
	 * Get `_property_container` from `_value_container`, and get `_property_name` from `_property_container`
	 */
	_refreshValue: function() {

		var property_container = this._value_container.getValue(),
			value = null,
			is_connected = false;

		if (property_container != null) {

			// Collection implements Properties, so if _property_name is not a number - then `get` will be called
			if (property_container.isCollection && /^\d+$/.test(this._property_name)) {

				if (this._enumerable_changed_listener == null) {

					this._enumerable_changed_listener = property_container.on('collection_changed', this.onValueChanged, this);
					this._property_container = property_container;

				}

				value = property_container.getValueAt(+this._property_name);

			} else if (property_container.isProperties) {

				if (this._property_changed_listener == null) {

					this._property_changed_listener = property_container.onPropertyChanged(this._property_name, this.onValueChanged, this);
					this._property_container = property_container;

				}

				value = property_container.get(this._property_name);

			} else {

				value = property_container[this._property_name];

			}

			is_connected = true;

		}

		if (value !== this._value || this._is_connected != is_connected) {

			this._value = value;
			this._is_connected = is_connected;

			this._fire('changed');

		}

	},

	/**
	 * Get `_is_connected`
	 * @returns {boolean}
	 */
	isConnected: function() {

		return this._is_connected;

	},

	/**
	 * Data source for this instance has changed. Remove listeners to old data source and schedule refresh
	 */
	onParentDataSourceChanged: function() {

		if (this._property_changed_listener && (this._value_container.getValue() != this._property_container)) {

			// currently listening to the parent's old data source
			this._property_changed_listener && this._property_container.removePropertyListener(this._property_changed_listener);
			this._enumerable_changed_listener && this._property_container.removeListener(this._enumerable_changed_listener);
			this._property_changed_listener = null;
			this._enumerable_changed_listener = null;
			this._property_container = null;

		}

		this._queueForRefresh();

	},

	_doRefresh: function() {

		this._refreshValue();

	},

	/**
	 * Data source remains the same, but it's property has changed (property we are currently bound to)
	 */
	onValueChanged: function() {

		this._queueForRefresh();

	},

	/**
	 * If this instance is bound to existing object - set object's property value
	 * @param {*} value
	 */
	setValue: function(value) {

		var property_container = this._value_container.getValue();

		if (property_container) {

			if (this._property_changed_listener) {

				Lava.suspendListener(this._property_changed_listener);
				property_container.set(this._property_name, value);
				Lava.resumeListener(this._property_changed_listener);

			} else if (this._enumerable_changed_listener) {

				Lava.suspendListener(this._enumerable_changed_listener);
				property_container.replaceAt(+this._property_name, value);
				Lava.resumeListener(this._enumerable_changed_listener);

			} else if (property_container.isProperties) {

				property_container.set(this._property_name, value);

			} else {

				property_container[this._property_name] = value;

			}

			this._queueForRefresh();

		}

	},

	getValue: function() {

		return this._value;

	},

	destroy: function() {

		this._value_container.removeListener(this._container_changed_listener);

		this._property_changed_listener && this._property_container.removePropertyListener(this._property_changed_listener);
		this._enumerable_changed_listener && this._property_container.removeListener(this._enumerable_changed_listener);
		this._property_container = null;

		Lava.schema.DEBUG && Lava.ScopeManager.debugStopTracking(this);
		this.Abstract$destroy();

	}

});

/**
 * Content of scope's enumerable has changed
 * @event Lava.scope.Foreach#changed
 */

/**
 * Scope has created a new Enumerable instance. All old UIDs are now invalid
 * @event Lava.scope.Foreach#new_enumerable
 */

/**
 * Scope has refreshed it's value from argument.
 * This event is fired before 'changed' event and may be used to sort and filter data in Foreach views.
 * @event Lava.scope.Foreach#after_refresh
 */

Lava.define(
'Lava.scope.Foreach',
/**
 * Designed to serve data to Foreach view. Transforms value of Argument into Enumerable
 *
 * @lends Lava.scope.Foreach#
 * @extends Lava.mixin.Refreshable
 * @implements _iValueContainer
 */
{

	Extends: 'Lava.mixin.Refreshable',
	/**
	 * Sign that this instance implements {@link _iValueContainer}
	 * @type {boolean}
	 * @const
	 */
	isValueContainer: true,

	/**
	 * Scope's argument
	 * @type {Lava.scope.Argument}
	 */
	_argument: null,
	/**
	 * Listener for {@link Lava.scope.Argument#event:changed}
	 * @type {_tListener}
	 */
	_argument_changed_listener: null,

	/**
	 * The owner Foreach view
	 * @type {Lava.view.Foreach}
	 */
	_view: null,
	/**
	 * The nearest widget in hierarchy
	 * @type {Lava.widget.Standard}
	 */
	_widget: null,
	/**
	 * Global unique identifier
	 * @type {_tGUID}
	 */
	guid: null,

	/**
	 * Listens to changes in `_observable`. Event name varies
	 * @type {_tListener}
	 */
	_observable_listener: null,
	/**
	 * Holds argument value, when it's instance of Observable. Used to remove listener
	 * @type {Lava.mixin.Observable}
	 */
	_observable: null,
	/**
	 * Has this instance created a new Enumerable instance to serve data, or is it using the instance
	 * which was returned from `_argument`
	 * @type {boolean}
	 */
	_own_collection: false,
	/**
	 * Scope options
	 * @type {?_cScopeForeach}
	 */
	_config: null,
	/**
	 * Scopes, on which this one depends. When they change - this scope is refreshed.
	 * @type {Array.<_iValueContainer>}
	 */
	_binds: null,
	/**
	 * Listeners for `_binds`
	 * @type {?Array.<_tListener>}
	 */
	_bind_changed_listeners: null,

	/**
	 * Create an instance of the Foreach scope. Refresh value
	 *
	 * @param {Lava.scope.Argument} argument
	 * @param {Lava.view.Foreach} view
	 * @param {Lava.widget.Standard} widget
	 * @param {?_cScopeForeach} config
	 */
	init: function(argument, view, widget, config) {

		var i = 0,
			count,
			depends,
			bind;

		this.guid = Lava.guid++;
		this._argument = argument;
		this._view = view;
		this._widget = widget;
		this.level = argument.level + 1;

		if (config) {

			if (Lava.schema.DEBUG && ['Enumerable', 'DataView'].indexOf(config['own_enumerable_mode']) == -1) Lava.t('Unknown value in own_enumerable_mode option: ' + config['own_enumerable_mode']);

			if (config['own_enumerable_mode'] == "DataView") {
				this._refreshDataSource = this._refreshDataSource_DataView;
				this._value = new Lava.system.DataView();
			} else {
				this._refreshDataSource = this._refreshDataSource_Enumerable;
				this._value = new Lava.system.Enumerable();
			}

			this._own_collection = true;

			if (config['depends']) {

				depends = config['depends'];
				this._binds = [];
				this._bind_changed_listeners = [];

				for (count = depends.length; i < count; i++) {

					if (depends[i].isDynamic) {

						bind = view.locateViewByPathConfig(depends[i]).getDynamicScope(view, depends[i]);

					} else {

						bind = view.getScopeByPathConfig(depends[i]);

					}

					this._binds.push(bind);
					this._bind_changed_listeners.push(bind.on('changed', this._onDependencyChanged, this));

				}

			}

		}

		this._argument_changed_listener = this._argument.on('changed', this.onDataSourceChanged, this);
		this.refreshDataSource();

	},

	/**
	 * One of scopes from `_binds` has changed, place this scope into refresh queue
	 */
	_onDependencyChanged: function() {

		this._queueForRefresh();

	},

	/**
	 * Perform refresh in regular mode (without "own_enumerable_mode" option)
	 * @param {(object|Array|Lava.mixin.Properties|Lava.system.Enumerable)} argument_value value, received from argument
	 */
	_refreshDataSource: function(argument_value) {

		if (argument_value.isCollection) {

			if (this._own_collection) {

				this._value.destroy();
				this._own_collection = false;
				this._value = null;

			}

			if (this._value != argument_value) {
				this._value = argument_value;
				this._fire('new_enumerable');
			}

		} else if (this._own_collection) {

			this._value.refreshFromDataSource(argument_value);

		} else {

			this._createCollection(argument_value);

		}

	},

	_refreshDataSource_Enumerable: function(argument_value) {

		if (Lava.schema.DEBUG && !argument_value.isCollection) Lava.t("Argument result must be Enumerable");
		// unlike DataView, Enumerable does not copy UIDs, so there is no need to fire "new_enumerable"
		this._value.refreshFromDataSource(argument_value);

	},

	_refreshDataSource_DataView: function(argument_value) {

		if (Lava.schema.DEBUG && !argument_value.isCollection) Lava.t("Argument result must be Enumerable");

		if (this._value.getDataSource() != argument_value) {
			// DataView copies UIDs from original Enumerable instance
			this._fire('new_enumerable');
		}

		this._value.refreshFromDataSource(argument_value);

	},

	/**
	 * Get new value from the `_argument`, and create a new instance of local Enumerable, or update the content of the old one
	 */
	refreshDataSource: function() {

		var argument_value = this._argument.getValue();

		if (argument_value) {

			this._refreshDataSource(argument_value);

			if (this._observable_listener == null) {

				if (argument_value.isCollection) {

					this._observable_listener = argument_value.on('collection_changed', this._onObservableChanged, this);
					this._observable = argument_value;

				} else if (argument_value.isProperties) {

					this._observable_listener = argument_value.on('property_changed', this._onObservableChanged, this);
					this._observable = argument_value;

				}

			}

		} else if (this._own_collection) {

			this._value.removeAll();

		} else {

			// will be called only when "own_enumerable_mode" is off, cause otherwise this._own_collection is always true
			this._createCollection(null);

		}

		this._fire('after_refresh');
		this._fire('changed');

	},

	createsOwnEnumerable: function() {

		return this._config['own_enumerable_mode'];

	},

	/**
	 * Create the local instance of Enumerable
	 * @param {*} argument_value
	 */
	_createCollection: function(argument_value) {

		this._value = new Lava.system.Enumerable(argument_value);
		this._own_collection = true;
		this._fire('new_enumerable');

	},

	/**
	 * Get rid of old Observable and it's listener (argument result has changed)
	 */
	_flushObservable: function() {

		this._observable.removeListener(this._observable_listener);
		this._observable_listener = null;
		this._observable = null;

	},

	/**
	 * Argument has changed
	 */
	onDataSourceChanged: function() {

		if (this._observable_listener) this._flushObservable();
		this._queueForRefresh();

	},

	/**
	 * Argument's result has not changed (the same object), but that object itself has changed
	 */
	_onObservableChanged: function() {

		this._queueForRefresh();

	},

	/**
	 * Update value from argument
	 */
	_doRefresh: function() {

		this.refreshDataSource();

	},

	/**
	 * Get scope's value
	 * @returns {Lava.system.Enumerable}
	 */
	getValue: function() {

		return this._value;

	},

	/**
	 * Free resources and make this instance unusable
	 */
	destroy: function() {

		if (this._binds) {

			for (var i = 0, count = this._binds.length; i < count; i++) {
				this._binds[i].removeListener(this._bind_changed_listeners[i]);
			}

			this._binds = this._bind_changed_listeners = null;

		}

		this._argument.removeListener(this._argument_changed_listener);
		this._observable_listener && this._flushObservable();

		if (this._own_collection) {

			this._value.destroy();

		}

		this.suspendRefreshable();

	}

});

/**
 * Value of this PropertyBinding instance has changed
 * @event Lava.scope.PropertyBinding#changed
 */

Lava.define(
'Lava.scope.PropertyBinding',
/**
 * Scope, that is designed to bind to a property of a view
 * @lends Lava.scope.PropertyBinding#
 * @extends Lava.scope.Abstract
 * @implements _iValueContainer
 */
{

	Extends: 'Lava.scope.Abstract',
	/**
	 * This instance supports two-way data binding
	 * @type {boolean}
	 * @const
	 */
	isSetValue: true,
	/**
	 * Global unique identifier of this instance
	 * @type {_tGUID}
	 */
	guid: null,

	/**
	 * View's property name, to which this instance is bound
	 * @type {string}
	 */
	_property_name: null,

	/**
	 * Scope's bound view (also the scope's owner view, which created the instance)
	 * @type {Lava.view.Abstract}
	 */
	_view: null,
	/**
	 * Listener for onPropertyChanged in bound view
	 * @type {_tListener}
	 */
	_property_changed_listener: null,

	/**
	 * PropertyBinding supports "assigns" - one-way binding of widget's property to any {@link Lava.scope.Argument} value
	 * @type {Lava.scope.Argument}
	 */
	_assign_argument: null,

	/**
	 * Create the PropertyBinding instance. Refresh value from view's property or set value from assign
	 * @param {Lava.view.Abstract} view Scope's owner view, to which it's bound
	 * @param {string} property_name
	 * @param {_cAssign} assign_config Config for the Argument, in case this scope is created in "assign" mode
	 */
	init: function(view, property_name, assign_config) {

		this.guid = Lava.guid++;
		this._view = view;
		this._property_name = property_name;

		if (assign_config) {

			this._assign_argument = new Lava.scope.Argument(assign_config, view, view.getWidget());
			this._assign_argument.on('changed', this.onAssignChanged, this);
			this._value = this._assign_argument.getValue();
			view.set(this._property_name, this._value);
			this.level = this._assign_argument.level + 1;

		} else {

			// this is needed to order implicit inheritance
			// (in custom widget property setters logic and in view.Foreach, while refreshing children).
			// Zero was added to simplify examples from site documentation - it's not needed by framework
			this.level = view.depth || 0;

			this._value = view.get(this._property_name);
			this._property_changed_listener = view.onPropertyChanged(property_name, this.onContainerPropertyChanged, this);

		}

		Lava.schema.DEBUG && Lava.ScopeManager.debugTrackScope(this);

	},

	/**
	 * PropertyBinding is always bound to it's view
	 * @returns {boolean} Always returns <kw>true</kw>
	 */
	isConnected: function() {

		return true;

	},

	/**
	 * Value of "assign" argument has changed. Set view's property and schedule refresh
	 */
	onAssignChanged: function() {

		this._view.set(this._property_name, this._assign_argument.getValue());
		this._queueForRefresh();

	},

	/**
	 * View's property has changed. Schedule refresh
	 */
	onContainerPropertyChanged: function() {

		this._queueForRefresh();

	},

	/**
	 * Get `_value`
	 * @returns {*}
	 */
	getValue: function() {

		return this._value;

	},

	/**
	 * Set property value to the bound view
	 * @param {*} value
	 */
	setValue: function(value) {

		Lava.suspendListener(this._property_changed_listener);
		this._view.set(this._property_name, value);
		Lava.resumeListener(this._property_changed_listener);

		this._queueForRefresh();

	},

	_doRefresh: function() {

		var new_value = this._view.get(this._property_name);

		if (new_value !== this._value) {

			this._value = new_value;

			this._fire('changed');

		}

	},

	destroy: function() {

		if (this._assign_argument) {

			this._assign_argument.destroy();

		} else {

			this._view.removePropertyListener(this._property_changed_listener);

		}

		Lava.schema.DEBUG && Lava.ScopeManager.debugStopTracking(this);

		this.Abstract$destroy();

	}

});

/**
 * Value of this Segment instance has changed
 * @event Lava.scope.Segment#changed
 */

Lava.define(
'Lava.scope.Segment',
/**
 * Scope, that can change name of it's bound property dynamically
 * @lends Lava.scope.Segment#
 * @extends Lava.scope.Abstract
 * @implements _iValueContainer
 */
{

	Extends: 'Lava.scope.Abstract',
	/**
	 * This instance supports two-way data binding
	 * @type {boolean}
	 * @const
	 */
	isSetValue: true,

	/**
	 * Either view or a scope with `getDataBinding()` - will be used to construct `_data_binding`
	 * @type {(Lava.view.Abstract|Lava.scope.Abstract)}
	 */
	_container: null,

	/**
	 * The scope, which provides the name of the property for the Segment
	 * @type {(Lava.scope.PropertyBinding|Lava.scope.DataBinding)}
	 */
	_name_source_container: null,
	/**
	 * Listener for "changed" event in `_name_source_container`
	 * @type {_tListener}
	 */
	_name_source_changed_listener: null,

	/**
	 * The name of the property, which this Segment is bound to
	 * @type {string}
	 */
	_property_name: null,
	/**
	 * Scope, which is bound to the `_property_name`. Serves as source of value for the Segment
	 * @type {(Lava.scope.DataBinding|Lava.scope.PropertyBinding)}
	 */
	_data_binding: null,
	/**
	 * Listener for "changed" event in `_data_binding`
	 * @type {_tListener}
	 */
	_data_binding_changed_listener: null,

	/**
	 * Create Segment instance. Refresh `_property_name`, `_data_binding` and get value
	 * @param {(Lava.view.Abstract|Lava.scope.Abstract)} container
	 * @param {(Lava.scope.PropertyBinding|Lava.scope.DataBinding)} name_source_container
	 */
	init: function(container, name_source_container) {

		if (Lava.schema.DEBUG && !name_source_container.isValueContainer) Lava.t();
		if (Lava.schema.DEBUG && !name_source_container.guid) Lava.t("Name source for segments must be either PropertyBinding or DataBinding");

		this._container = container;
		this._property_name = name_source_container.getValue();

		this._refreshDataBinding();

		if (container.isRefreshable) {
			this.level = container.level;
		}
		this.level = this.level > name_source_container.level ? this.level : name_source_container.level;
		this.level++;

		this._name_source_container = name_source_container;
		this._name_source_changed_listener = name_source_container.on('changed', this.onPropertyNameChanged, this);
		this._value = this._data_binding.getValue();
		Lava.schema.DEBUG && Lava.ScopeManager.debugTrackScope(this);

	},

	/**
	 * Return <kw>true</kw>, if the Segment is bound to existing object
	 * @returns {boolean}
	 */
	isConnected: function() {

		if (!this._data_binding) Lava.t();
		return this._data_binding.isConnected();

	},

	/**
	 * Create `_data_binding` and it's "changed" listener
	 */
	_refreshDataBinding: function() {

		this._data_binding = this._container.getDataBinding(this._property_name);
		this._data_binding_changed_listener = this._data_binding.on('changed', this.onDataBindingChanged, this);

	},

	/**
	 * Destroy `_data_binding` and it's "changed" listener
	 */
	_destroyDataBinding: function() {

		this._data_binding.removeListener(this._data_binding_changed_listener);
		this._data_binding = null;
		this._data_binding_changed_listener = null;

	},

	/**
	 * The value of bound scope has changed. Schedule refresh
	 */
	onDataBindingChanged: function() {

		this._queueForRefresh();

	},

	_doRefresh: function() {

		if (this._data_binding == null) {

			this._refreshDataBinding();

		}

		var new_value = this._data_binding.getValue();

		if (new_value !== this._value) {

			this._value = new_value;

			this._fire('changed');

		}

	},

	/**
	 * Segment must bind to new property name. Destroy old `_data_binding` and schedule refresh
	 */
	onPropertyNameChanged: function() {

		this._property_name = this._name_source_container.getValue();

		this._destroyDataBinding();
		this._queueForRefresh();

	},

	/**
	 * Get `_value`
	 * @returns {*}
	 */
	getValue: function() {

		return this._value;

	},

	/**
	 * Set `_property_name` of the bound object
	 * @param {*} value
	 */
	setValue: function(value) {

		if (this._data_binding) {
			this._data_binding.setValue(value);
		}

	},

	destroy: function() {

		this._name_source_container.removeListener(this._name_source_changed_listener);
		this._data_binding_changed_listener && this._data_binding.removeListener(this._data_binding_changed_listener);

		Lava.schema.DEBUG && Lava.ScopeManager.debugStopTracking(this);
		this.Abstract$destroy();

	}

});

Lava.define(
'Lava.view.container.Element',
/**
 * Container, that represents a DOM element
 * @lends Lava.view.container.Element#
 * @implements _iContainer
 */
{

	/**
	 * This instance belongs to Element container
	 * @type {boolean}
	 * @const
	 */
	isElementContainer: true,

	/**
	 * ID of DOM element that belongs to this container
	 * @type {string}
	 */
	_id: null,
	/**
	 * iew that owns the container
	 * @type {Lava.view.Abstract}
	 */
	_view: null,
	/**
	 * Settings for this instance
	 * @type {_cElementContainer}
	 */
	_config: null,
	/**
	 * Nearest widget in hierarchy
	 * @type {Lava.widget.Standard}
	 */
	_widget: null,
	/**
	 * Tag name of the DOM element
	 * @type {string}
	 */
	_tag_name: null,

	/**
	 * List of static CSS classes, that are not bound to expressions
	 * @type {Array.<string>}
	 */
	_static_classes: [],
	/**
	 * Arguments, that produce dynamic class names. Keys are sequential numbers
	 * @type {!Object.<string, Lava.scope.Argument>}
	 */
	_class_bindings: null,
	/**
	 * Value of each argument from `_class_bindings`, split into array of class names
	 * @type {Object.<string, Array.<string>>}
	 */
	_class_bindings_values: {},

	/**
	 * Styles, that are not bound to expressions
	 * @type {Object.<string, string>}
	 */
	_static_styles: {},
	/**
	 * Arguments, that produce style values dynamically. Keys are names of CSS styles
	 * @type {!Object.<string, Lava.scope.Argument>}
	 */
	_style_bindings: null,

	/**
	 * Properties, that are not bound to an argument
	 * @type {Object.<string, string>}
	 */
	_static_properties: {}, // name => value
	/**
	 * Arguments, that produce property values. Keys are names of properties
	 * @type {!Object.<string, Lava.scope.Argument>}
	 */
	_property_bindings: null,

	/**
	 * Targets for DOM events, routed by {@link Lava.system.ViewManager}
	 * @type {Object.<string, Array.<_cTarget>>}
	 */
	_events: {},

	/**
	 * Is container's html element in DOM
	 * @type {boolean}
	 */
	_is_inDOM: false,
	/**
	 * Reference to the real DOM element, that belongs to this container
	 * @type {HTMLElement}
	 */
	_element: null,
	/**
	 * Is container's element void? (does not require closing tag)
	 * @type {boolean}
	 */
	_is_void: false,
	/**
	 * Element container can control an existing element on page. <kw>true</kw>, if container was rendered and inserted
	 * as new element, and <kw>false</kw>, if this instance was ordered to capture an existing DOM element on page
	 * @type {boolean}
	 */
	_is_element_owner: true,

	/**
	 * One-time static constructor, which modifies container's prototype and replaces itself with correct version
	 *
	 * @param {Lava.view.Abstract} view
	 * @param {_cElementContainer} config
	 * @param {Lava.widget.Standard} widget
	 */
	init: function(view, config, widget) {

		// About IOS bugfixes:
		// http://www.quirksmode.org/blog/archives/2010/09/click_event_del.html
		// http://www.quirksmode.org/blog/archives/2010/10/click_event_del_1.html

		var needs_shim = Firestorm.Environment.platform == "ios";
		Lava.ClassManager.patch(this, "Element", "addEventTarget", needs_shim ? "addEventTarget_IOS" : "addEventTarget_Normal");
		Lava.ClassManager.patch(this, "Element", "informInDOM", needs_shim ? "informInDOM_IOS" : "informInDOM_Normal");

		this.init_Normal(view, config, widget);
		Lava.ClassManager.patch(this, "Element", "init", "init_Normal");

	},

	/**
	 * Real constructor
	 *
	 * @param {Lava.view.Abstract} view
	 * @param {_cElementContainer} config
	 * @param {Lava.widget.Standard} widget
	 */
	init_Normal: function(view, config, widget) {

		var name,
			resource_owner,
			container_resources,
			static_classes,
			static_properties,
			static_styles;

		this._id = Lava.ELEMENT_ID_PREFIX + view.guid;

		this._view = view;
		this._config = config;
		this._widget = widget;
		this._tag_name = config.tag_name;
		this._is_void = Lava.isVoidTag(this._tag_name);

		if (Lava.schema.RESOURCES_ENABLED && config.resource_id) {

			resource_owner = Lava.view_manager.locateTarget(widget, config.resource_id.locator_type, config.resource_id.locator);
			if (Lava.schema.DEBUG && !resource_owner) Lava.t("[Element container] resource owner not found: " + config.resource_id.locator_type + "=" + config.resource_id.locator);
			container_resources = resource_owner.getResource(config.resource_id.name);

		}

		if (Lava.schema.RESOURCES_ENABLED && container_resources) {

			if (Lava.schema.DEBUG && container_resources.type != 'container') Lava.t("Element container: received resource type is not container: " + container_resources.type);
			static_classes = container_resources.value['static_classes'];
			static_properties = container_resources.value['static_properties'];
			static_styles = container_resources.value['static_styles'];

		} else {

			static_classes = config['static_classes'];
			static_properties = config['static_properties'];
			static_styles = config['static_styles'];

		}

		if (Lava.schema.DEBUG && static_properties && ('id' in static_properties))
			Lava.t("Element container: id must not be set via resources or be in config.static_properties");

		// Must clone everything, cause additional statics can be added to the element at run time
		if (static_classes) this._static_classes = static_classes.slice();
		for (name in static_styles) {
			this._static_styles[name] = static_styles[name];
		}
		for (name in static_properties) {
			this._static_properties[name] = static_properties[name];
		}

		for (name in config.events) {
			this._events[name] = Firestorm.clone(config.events[name]); // Object.<string, Array.<_cTarget>>
		}

		this._property_bindings = this._createArguments(config.property_bindings, view, this._onPropertyBindingChanged);
		this._style_bindings = this._createArguments(config.style_bindings, view, this._onStyleBindingChanged);
		// note: class_bindings is also an object. TemplateParser names properties numerically, starting from zero.
		this._class_bindings = this._createArguments(config.class_bindings, view, this._onClassBindingChanged);

		for (name in this._class_bindings) {

			this._class_bindings_values[name] = this._toClassNames(this._class_bindings[name].getValue() || '');

		}

	},

	/**
	 * Get target routes for dom event
	 * @param {string} event_name
	 * @returns {Array.<_cTarget>}
	 */
	getEventTargets: function(event_name) {

		return this._events[event_name];

	},

	/**
	 * Add a route for DOM event
	 * @param {string} event_name
	 * @param {_cTarget} target
	 */
	addEventTarget: function(event_name, target) {

		Lava.t();

	},

	/**
	 * Add a route for DOM event - IOS bugfix version
	 * @param {string} event_name
	 * @param {_cTarget} target
	 */
	addEventTarget_IOS: function(event_name, target) {

		if (this._is_inDOM && event_name == 'click' && !(event_name in this._events)) {
			this.getDOMElement().onclick = Lava.noop;
		}
		this.addEventTarget_Normal(event_name, target)

	},

	/**
	 * Add a route for DOM event - normal version
	 * @param {string} event_name
	 * @param {_cTarget} target
	 */
	addEventTarget_Normal: function(event_name, target) {

		if (!(event_name in this._events)) {

			this._events[event_name] = [target];

		} else {

			this._events[event_name].push(target);

		}

	},

	/**
	 * Add a property to `_static_properties` and synchronize it with DOM element
	 * @param {string} name
	 * @param {string} value
	 */
	setProperty: function(name, value) {

		this.storeProperty(name, value);
		if (this._is_inDOM) this.syncProperty(name);

	},

	/**
	 * Set static property to the container, but do not synchronize it with DOM element
	 * @param {string} name
	 * @param {string} value
	 */
	storeProperty: function(name, value) {

		if (Lava.schema.DEBUG && name == 'id') Lava.t();
		if (Lava.schema.DEBUG && (name in this._property_bindings)) Lava.t("Property is bound to an argument and cannot be set directly: " + name);

		this._static_properties[name] = value;

	},

	/**
	 * Get static property
	 * @param {string} name Property name
	 * @returns {string}
	 */
	getProperty: function(name) {

		return this._static_properties[name];

	},

	/**
	 * Set locally stored property value into element
	 * @param {string} name
	 */
	syncProperty: function(name) {

		Firestorm.Element.setProperty(this.getDOMElement(), name, this._static_properties[name]);

	},

	/**
	 * Add static CSS class
	 * @param {string} class_name
	 * @param {boolean} cancel_sync If <kw>true</kw> - do not add that class to DOM element, just to local `_static_classes` array
	 */
	addClass: function(class_name, cancel_sync) {

		if (Lava.schema.DEBUG && (!class_name || class_name.indexOf(' ') != -1)) Lava.t("addClass: expected one class name, got: " + class_name);

		if (Firestorm.Array.include(this._static_classes, class_name)) {

			if (this._is_inDOM && !cancel_sync) Firestorm.Element.addClass(this.getDOMElement(), class_name);

		}

	},

	/**
	 * Remove a static CSS class
	 * @param {string} class_name
	 * @param {boolean} cancel_sync If <kw>true</kw> - do not remove the class from DOM element, just from local `_static_classes` array
	 */
	removeClass: function(class_name, cancel_sync) {

		if (Firestorm.Array.exclude(this._static_classes, class_name)) {

			if (this._is_inDOM && !cancel_sync) Firestorm.Element.removeClass(this.getDOMElement(), class_name);

		}

	},

	/**
	 * Add a list of static classes to the instance
	 * @param {Array.<string>} class_names
	 * @param {boolean} cancel_sync If <kw>true</kw> - do not add that classes to DOM element, just to local `_static_classes` array
	 */
	addClasses: function(class_names, cancel_sync) {

		if (Lava.schema.DEBUG && typeof(class_names) == 'string') Lava.t();

		for (var i = 0, count = class_names.length; i < count; i++) {

			this.addClass(class_names[i], cancel_sync);

		}

	},

	/**
	 * Does this instance have the given static class
	 * @param class_name Name of CSS class to search for
	 * @returns {boolean} <kw>true</kw>, if class exists in `_static_classes`
	 */
	hasStaticClass: function(class_name) {

		return this._static_classes.indexOf(class_name) != -1;

	},

	/**
	 * Refresh CSS classes on DOM element, including bound classes
	 */
	syncClasses: function() {

		Firestorm.Element.setClass(this.getDOMElement(), this._renderClasses());

	},

	/**
	 * Set static style value
	 * @param {string} name CSS property name
	 * @param {string} value CSS property value
	 * @param cancel_sync If <kw>true</kw> - do not add that style to DOM element, just to local `_static_styles` object
	 */
	setStyle: function(name, value, cancel_sync) {

		if (value == null) {

			this.removeStyle(name, cancel_sync);

		} else {

			this._static_styles[name] = value;
			if (this._is_inDOM && !cancel_sync) Firestorm.Element.setStyle(this.getDOMElement(), name, value);

		}

	},

	/**
	 * Remove static CSS style
	 * @param {string} name CSS style name
	 * @param {boolean} cancel_sync If <kw>true</kw> - do not remove that style from DOM element, just from local `_static_styles` object
	 */
	removeStyle: function(name, cancel_sync) {

		if (name in this._static_styles) {
			delete this._static_styles[name];
			if (this._is_inDOM && !cancel_sync) Firestorm.Element.setStyle(this.getDOMElement(), name, null);
		}

	},

	/**
	 * Get CSS style value
	 * @param {string} name
	 * @returns {string}
	 */
	getStyle: function(name) {

		return this._static_styles[name];

	},

	/**
	 * Refresh the "style" attribute on DOM element
	 */
	syncStyles: function() {

		Firestorm.Element.setProperty(this.getDOMElement(), 'style', this._renderStyles());

	},

	/**
	 * Helper method to create style, class and property bindings
	 * @param {?Object.<string, _cArgument>} configs
	 * @param {Lava.view.Abstract} view
	 * @param {!function} fn
	 * @returns {!Object.<string, Lava.scope.Argument>}
	 */
	_createArguments: function(configs, view, fn) {

		var result = {},
			argument;

		for (var name in configs) {

			argument = new Lava.scope.Argument(configs[name], view, this._widget);
			result[name] = argument;
			argument.on('changed', fn, this, {name: name})

		}

		return result;

	},

	/**
	 * Argument value for property binding has changed. If container's element is in DOM - update it's property value
	 * @param {Lava.scope.Argument} argument
	 * @param event_args
	 * @param listener_args
	 */
	_onPropertyBindingChanged: function(argument, event_args, listener_args) {

		if (this._is_inDOM) {

			// note: escape will be handled by framework
			var value = argument.getValue();

			if (value != null && value !== false) {

				if (value === true) {
					value = listener_args.name;
				}

				Firestorm.Element.setProperty(this.getDOMElement(), listener_args.name, value);

			} else {

				Firestorm.Element.removeProperty(this.getDOMElement(), listener_args.name);

			}

		}

	},

	/**
	 * Argument value for style binding has changed. If container's element is in DOM - update it's style
	 * @param {Lava.scope.Argument} argument
	 * @param event_args
	 * @param listener_args
	 */
	_onStyleBindingChanged: function(argument, event_args, listener_args) {

		var value = this._style_bindings[listener_args.name].getValue() || '';
		if (this._is_inDOM) Firestorm.Element.setStyle(this.getDOMElement(), listener_args.name, value.toString().trim());

	},

	/**
	 * Split a string into array of class names
	 * @param {string} classes_string
	 * @returns {Array}
	 */
	_toClassNames: function(classes_string) {

		var classes = [];

		if (Lava.schema.view.VALIDATE_CLASS_NAMES) {
			this.assertClassStringValid(classes_string);
		}

		if (classes_string != '') {

			classes = classes_string.split(/\s+/);

		}

		return classes;

	},

	/**
	 * Class binding argument has changed it's value. Refresh internal class values and element's classes
	 * @param {Lava.scope.Argument} argument
	 * @param event_args
	 * @param listener_args
	 */
	_onClassBindingChanged: function(argument, event_args, listener_args) {

		var new_classes = this._toClassNames(argument.getValue().toString().trim());

		if (this._is_inDOM) {

			Firestorm.Element.removeClasses(this.getDOMElement(), this._class_bindings_values[listener_args.name]);
			Firestorm.Element.addClasses(this.getDOMElement(), new_classes);

		}

		this._class_bindings_values[listener_args.name] = new_classes;

	},

	/**
	 * Assert, that style string does not contain any special characters, that can break HTML markup
	 * @param value
	 */
	assertStyleValid: function(value) {
		if (/\"\<\>/.test(value))
			Lava.t("Invalid symbols in style value: " + value + ". Please, use single quotes for string values and manually escape special characters.");
	},

	/**
	 * Assert, that class string does not contain any special characters
	 * @param value
	 */
	assertClassStringValid: function(value) {

		if (/\'\"\<\>\&\./.test(value)) Lava.t("Invalid class names: " + value);

	},

	/**
	 * Render value of the "class" attribute, including bound classes
	 * @returns {string}
	 */
	_renderClasses: function() {

		var resultClasses = this._static_classes.clone(),
			name,
			value;

		for (name in this._class_bindings) {

			// do not need to check or convert, cause join() will convert everything to string, and nulls to empty string
			resultClasses.push(
				this._class_bindings[name].getValue()
			);

		}

		value = resultClasses.join(' ');

		if (Lava.schema.view.VALIDATE_CLASS_NAMES) {
			this.assertClassStringValid(value);
		}

		return value;

	},

	/**
	 * Render content of the "style" attribute, including bound styles
	 * @returns {string}
	 */
	_renderStyles: function() {

		var result_styles = [],
			name,
			value;

		for (name in this._static_styles) {

			result_styles.push(name + ':' + this._static_styles[name]);

		}

		for (name in this._style_bindings) {

			value = this._style_bindings[name].getValue();
			if (value != null) {
				result_styles.push(name + ':' + value.toString().trim());
			}

		}

		value = result_styles.join(';');

		if (Lava.schema.view.VALIDATE_STYLES) {
			this.assertStyleValid(value);
		}

		return value;

	},

	/**
	 * Render one attribute
	 * @param {string} name
	 * @param {boolean|null|string} value
	 * @returns {string}
	 */
	_renderAttribute: function(name, value) {

		var result = '';

		if (value === true) {

			result = ' ' + name + '="' + name + '"';

		} else if (value != null && value !== false) {

			result = ' ' + name + '="' + this.escapeAttributeValue(value + '') + '"';

		}

		return result;

	},

	/**
	 * Render the opening HTML tag, including all attributes
	 * @returns {string}
	 */
	_renderOpeningTag: function() {

		var classes = this._renderClasses(),
			style = this._renderStyles(),
			properties_string = '',
			name;

		// see informInDOM_Normal
		// this._element = null;

		for (name in this._static_properties) {

			properties_string += this._renderAttribute(name, this._static_properties[name]);

		}

		for (name in this._property_bindings) {

			properties_string += this._renderAttribute(name, this._property_bindings[name].getValue());

		}

		if (classes) {

			properties_string += ' class="' + classes + '"';

		}

		if (style) {

			properties_string += ' style="' + style + '"';

		}

		return "<" + this._tag_name + " id=\"" + this._id + "\" "
			// + this._writeEvents()
			+ properties_string; //+ ">"

	},

	/**
	 * Render tag and wrap given HTML code inside it
	 * @param {string} html
	 * @returns {string}
	 */
	wrap: function(html) {

		if (Lava.schema.DEBUG && this._is_void) Lava.t('Trying to wrap content in void tag');
		// _element is cleared in _renderOpeningTag
		return this._renderOpeningTag() + ">" + html + "</" + this._tag_name + ">";

	},

	/**
	 * Render the tag as void tag
	 * @returns {string}
	 */
	renderVoid: function() {

		if (Lava.schema.DEBUG && !this._is_void) Lava.t('Trying to render non-void container as void');
		// _element is cleared in _renderOpeningTag
		return this._renderOpeningTag() + "/>";

	},

	/**
	 * Set innerHTML of container's element. Container must be in DOM
	 * @param {string} html
	 */
	setHTML: function(html) {

		if (!this._is_inDOM) Lava.t("setHTML: element is not in DOM");
		if (this._is_void) Lava.t('setHTML on void tag');

		Firestorm.Element.setProperty(this.getDOMElement(), 'html', html);

	},

	/**
	 * Insert given HTML markup at the bottom of container's DOM element
	 * @param {string} html
	 */
	appendHTML: function(html) {

		Firestorm.DOM.insertHTMLBottom(this.getDOMElement(), html);

	},

	/**
	 * Insert given HTML markup at the top of container's DOM element
	 * @param {string} html
	 */
	prependHTML: function(html) {

		Firestorm.DOM.insertHTMLTop(this.getDOMElement(), html);

	},

	/**
	 * Insert HTML markup after container's DOM element
	 * @param {string} html
	 */
	insertHTMLAfter: function(html) {

		Firestorm.DOM.insertHTMLAfter(this.getDOMElement(), html);

	},

	/**
	 * Insert HTML markup before container's DOM element
	 * @param {string} html
	 */
	insertHTMLBefore: function(html) {

		Firestorm.DOM.insertHTMLBefore(this.getDOMElement(), html);

	},

	/**
	 * Call this method, when container has been rendered and inserted into DOM
	 * Note: does not need to be called after capture
	 */
	informInDOM: function() {

		Lava.t();

	},

	/**
	 * Version of informInDOM with IOS bugfixes
	 */
	informInDOM_IOS: function() {

		this.informInDOM_Normal();
		this.getDOMElement().onclick = Lava.noop;

	},

	/**
	 * Normal version of informInDOM
	 */
	informInDOM_Normal: function() {

		this._is_inDOM = true;
		// if <input> which is already in DOM is re-rendered and inserted back
		// - then "changed" event will fire in Chrome.
		// During the event - the DOM element may be retrieved by widget,
		// so at the moment, when informInDOM is called - it's already set.
		// if (Lava.schema.DEBUG && this._element) Lava.t();
		this._element = null;

	},

	/**
	 * Call this method before removing container's element from DOM
	 */
	informRemove: function() {

		this._is_inDOM = false;
		this._element = null;

	},

	/**
	 * Get current container's element from DOM
	 * @returns {HTMLElement}
	 */
	getDOMElement: function() {

		if (!this._element && this._is_inDOM) {

			this._element = Firestorm.getElementById(this._id);

		}

		return this._element;

	},

	/**
	 * For Element container this returns it's DOM element
	 * @returns {HTMLElement}
	 */
	getStartElement: function() {

		return this.getDOMElement();

	},

	/**
	 * For Element container this returns it's DOM element
	 * @returns {HTMLElement}
	 */
	getEndElement: function() {

		return this.getDOMElement();

	},

	/**
	 * Get `_id`
	 * @returns {string}
	 */
	getId: function() { return this._id; },

	/**
	 * Get `_is_inDOM`
	 * @returns {boolean}
	 */
	isInDOM: function() { return this._is_inDOM; },

	/**
	 * Get `_is_void`
	 * @returns {boolean}
	 */
	isVoid: function() { return this._is_void; },

	/**
	 * Clear internal reference to container's DOM element
	 */
	release: function() {

		this._element = null;

	},

	/**
	 * Call a method of all binding arguments
	 * @param {string} callback_name Method to call
	 * @param {*} callback_argument Argument for the method
	 */
	_withArguments: function(callback_name, callback_argument) {

		var name;

		for (name in this._property_bindings) this._property_bindings[name][callback_name](callback_argument);

		for (name in this._style_bindings) this._style_bindings[name][callback_name](callback_argument);

		for (name in this._class_bindings) this._class_bindings[name][callback_name](callback_argument);

	},

	/**
	 * Bind container to existing DOM element. Apply new styles, classes and properties
	 * @param {HTMLElement} element
	 */
	captureExistingElement: function(element) {

		var Element = Firestorm.Element,
			name;

		if (this._is_inDOM) Lava.t("Can not set duplicate id attribute on elements");
		// there must not be ID attribute
		if (Element.getProperty(element, 'id')) Lava.t("Target element already has an ID, and could be owned by another container");
		if (Element.getProperty(element, 'tag').toLowerCase() != this._tag_name) Lava.t("Captured tag name differs from the container's tag name");

		Element.setProperty(element, 'id', this._id);

		this._is_inDOM = true;
		this._element = element;

		for (name in this._static_properties) {

			// note: escaping must be handled by framework
			Element.setProperty(element, name, this._static_properties[name]);

		}

		for (name in this._property_bindings) {

			Element.setProperty(element, name, this._property_bindings[name].getValue());

		}

		this.syncClasses();
		this.syncStyles();
		this._is_element_owner = false;

	},

	/**
	 * Release an element after call to `captureExistingElement`. Does not clear any attributes, except ID
	 */
	releaseElement: function() {

		// keep original container in DOM
		this.setHTML('');
		Firestorm.Element.removeProperty(this.getDOMElement(), 'id');
		this.informRemove();
		this._is_element_owner = true;

	},

	/**
	 * Get `_is_element_owner`
	 * @returns {boolean}
	 */
	isElementOwner: function() {

		return this._is_element_owner;

	},

	/**
	 * Perform escaping of an attribute value while rendering
	 * @param {string} string
	 * @returns {string}
	 */
	escapeAttributeValue: function(string) {

		return Firestorm.String.escape(string, Firestorm.String.ATTRIBUTE_ESCAPE_REGEX);

	},

	/**
	 * Remove container's element from DOM
	 */
	remove: function() {

		if (!this._is_inDOM) Lava.t("remove: container is not in DOM");
		Firestorm.Element.destroy(this.getDOMElement());

	},

	/**
	 * Free resources and make this instance unusable
	 */
	destroy: function() {

		var name;

		for (name in this._property_bindings) {

			this._property_bindings[name].destroy();

		}

		for (name in this._style_bindings) {

			this._style_bindings[name].destroy();

		}

		for (name in this._class_bindings) {

			this._class_bindings[name].destroy();

		}

	}

});

Lava.define(
'Lava.view.container.CheckboxElement',
/**
 * Container for checkbox input, which implements fixes for IE and other defect browsers.
 * Fires custom ViewManager event "compatible_changed"
 *
 * @lends Lava.view.container.CheckboxElement#
 * @extends Lava.view.container.Element#
 */
{
	Extends: "Lava.view.container.Element",

	/**
	 * When running inside IE: bound "click" event handler
	 * @type {function}
	 */
	_IE_click_callback: null,

	init: function(view, config, widget) {

		var needs_shim = (Firestorm.Environment.browser_name == 'ie'),
			new_init_name = needs_shim ? "init_IE" : "Element$init";

		Lava.ClassManager.patch(this, "CheckboxElement", "informInDOM", needs_shim ? "informInDOM_IE" : "Element$informInDOM");
		Lava.ClassManager.patch(this, "CheckboxElement", "informRemove", needs_shim ? "informRemove_IE" : "Element$informRemove");

		this[new_init_name](view, config, widget);
		Lava.ClassManager.patch(this, "CheckboxElement", "init", new_init_name);

	},

	/**
	 * Constructor for IE environment
	 *
	 * @param view
	 * @param config
	 * @param widget
	 */
	init_IE: function(view, config, widget) {

		this.Element$init(view, config, widget);

		var self = this;

		this._IE_click_callback = function() {
			if (self._events['compatible_changed']) {
				Lava.view_manager.dispatchEvent(self._view, 'compatible_changed', null, self._events['compatible_changed']);
			}
		};

	},

	/**
	 * Dummy method, which will be replaced in static constructor
	 */
	informInDOM: function() {

		Lava.t();

	},

	/**
	 * Dummy method, which will be replaced in static constructor
	 */
	informRemove: function() {

		Lava.t();

	},

	/**
	 * IE version of `informInDOM` - applies IE fixes.
	 * IE 10, 11 and maybe other versions don't fire "change" when indeterminate state is cleared
	 */
	informInDOM_IE: function() {

		this.Element$informInDOM();

		var input_element = this.getDOMElement();
		Firestorm.Element.addListener(input_element, "click", this._IE_click_callback);

	},

	/**
	 * IE version of `informRemove` - clears IE fixes
	 */
	informRemove_IE: function() {

		var input_element = this.getDOMElement();
		Firestorm.Element.removeListener(input_element, "click", this._IE_click_callback);

		this.Element$informRemove();

	}

});

Lava.define(
'Lava.view.container.TextInputElement',
/**
 * Container for "text" and "password" inputs, which implements fixes for IE and other defect browsers.
 * Fires custom ViewManager event "compatible_changed".
 *
 * @lends Lava.view.container.TextInputElement#
 * @extends Lava.view.container.Element#
 */
{
	Extends: "Lava.view.container.Element",

	/**
	 * For IE8-9: input element listener callback, bound to this instance
	 * @type {function}
	 */
	_OldIE_refresh_callback: null,
	/**
	 * For IE8-9: `onpropertychange` callback, bound to this instance
	 * @type {function}
	 */
	_OldIE_property_change_callback: null,

	init: function(view, config, widget) {

		var needs_shim = Firestorm.Environment.capabilities[Firestorm.CAPABILITY_NAMES.NEEDS_INPUT_EVENT_SHIM],
			new_init_name = needs_shim ? "init_IE" : "Element$init";

		Lava.ClassManager.patch(this, "TextInputElement", "informInDOM", needs_shim ? "informInDOM_OldIE" : "Element$informInDOM");
		Lava.ClassManager.patch(this, "TextInputElement", "informRemove", needs_shim ? "informRemove_OldIE" : "Element$informRemove");

		this[new_init_name](view, config, widget);
		Lava.ClassManager.patch(this, "TextInputElement", "init", new_init_name);

	},

	/**
	 * Constructor for IE environment
	 *
	 * @param {Lava.view.Abstract} view
	 * @param {_cElementContainer} config
	 * @param {Lava.widget.Standard} widget
	 */
	init_IE: function(view, config, widget) {

		this.Element$init(view, config, widget);

		var self = this;

		this._OldIE_refresh_callback = function() {
			self._sendRefreshValue();
		};
		this._OldIE_property_change_callback = function(e) {
			if (e.propertyName == "value") {
				self._sendRefreshValue();
			}
		};

	},

	/**
	 * Dummy method, which will be replaced in static constructor
	 */
	informInDOM: function() {

		Lava.t();

	},

	/**
	 * Dummy method, which will be replaced in static constructor
	 */
	informRemove: function() {

		Lava.t();

	},

	/**
	 * Applies additional listeners for IE8-9 to track value changes.
	 * See http://benalpert.com/2013/06/18/a-near-perfect-oninput-shim-for-ie-8-and-9.html
	 */
	informInDOM_OldIE: function() {

		this.Element$informInDOM();

		var input_element = this.getDOMElement();
		Firestorm.Element.addListener(input_element, "onpropertychange", this._OldIE_property_change_callback);
		Firestorm.Element.addListener(input_element, "selectionchange", this._OldIE_refresh_callback);
		Firestorm.Element.addListener(input_element, "keyup", this._OldIE_refresh_callback);
		Firestorm.Element.addListener(input_element, "keydown", this._OldIE_refresh_callback);

	},

	/**
	 * Removes IE listeners
	 */
	informRemove_OldIE: function() {

		var input_element = this.getDOMElement();
		Firestorm.Element.removeListener(input_element, "onpropertychange", this._OldIE_property_change_callback);
		Firestorm.Element.removeListener(input_element, "selectionchange", this._OldIE_refresh_callback);
		Firestorm.Element.removeListener(input_element, "keyup", this._OldIE_refresh_callback);
		Firestorm.Element.removeListener(input_element, "keydown", this._OldIE_refresh_callback);

		this.Element$informRemove();

	},

	/**
	 * Dispatches custom ViewManager "compatible_changed" event
	 */
	_sendRefreshValue: function() {

		if (this._events['compatible_changed']) {
			Lava.view_manager.dispatchEvent(this._view, 'compatible_changed', null, this._events['compatible_changed']);
		}

	}

});

Lava.define(
'Lava.view.container.Morph',
/**
 * Container, that represents two &lt;script&gt; tags with content between them
 * @lends Lava.view.container.Morph#
 * @implements _iContainer
 *
 * Credits:
 * based on https://github.com/tomhuda/metamorph.js/
 */
{

	/**
	 * Instance belongs to Morph container
	 * @type {boolean}
	 * @const
	 */
	isMorphContainer: true,

	/**
	 * View, that owns this instance of container
	 * @type {Lava.view.Abstract}
	 */
	_view: null,
	/**
	 * Settings for the Morph container
	 * @type {Object}
	 */
	//_config: null,

	/**
	 * Nearest widget in hierarchy
	 * @type {Lava.widget.Standard}
	 */
	_widget: null,

	/**
	 * Is this instance currently in DOM
	 * @type {boolean}
	 */
	_is_inDOM: false,
	/**
	 * ID of the first &lt;script&gt; tag
	 * @type {string}
	 */
	_start_script_id: null,
	/**
	 * ID of the second &lt;script&gt; tag
	 * @type {string}
	 */
	_end_script_id: null,

	/**
	 * Reference to the first &lt;script&gt; tag as DOM element
	 * @type {HTMLElement}
	 */
	_start_element: null,
	/**
	 * Reference to the second &lt;script&gt; tag as DOM element
	 * @type {HTMLElement}
	 */
	_end_element: null,

	/**
	 * Create Morph container instance
	 * @param {Lava.view.Abstract} view
	 * @param {Object} config
	 * @param {Lava.widget.Standard} widget
	 */
	init: function(view, config, widget) {

		this._view = view;
		//this._config = config;
		this._widget = widget;

		this._start_script_id = 'c' + view.guid + 's';
		this._end_script_id = 'c' + view.guid + 'e';

	},

	/**
	 * Retrieve both &lt;script&gt; tags from DOM into local references,
	 * at the same time applying fixes for old browsers
	 */
	_getElements: function() {

		var start_element = document.getElementById(this._start_script_id),
			end_element = document.getElementById(this._end_script_id);

		/**
		 * In some cases, Internet Explorer can create an anonymous node in
		 * the hierarchy with no tagName. You can create this scenario via:
		 *
		 *     div = document.createElement("div");
		 *     div.innerHTML = "<table>&shy<script></script><tr><td>hi</td></tr></table>";
		 *     div.firstChild.firstChild.tagName //=> ""
		 *
		 * If our script markers are inside such a node, we need to find that
		 * node and use *it* as the marker.
		 **/
		while (start_element.parentNode.tagName === "") {

			start_element = start_element.parentNode;

		}

		/**
		 * When automatically adding a tbody, Internet Explorer inserts the
		 * tbody immediately before the first <tr>. Other browsers create it
		 * before the first node, no matter what.
		 *
		 * This means the the following code:
		 *
		 *     div = document.createElement("div");
		 *     div.innerHTML = "<table><script id='first'></script><tr><td>hi</td></tr><script id='last'></script></table>
		 *
		 * Generates the following DOM in IE:
		 *
		 *     + div
		 *       + table
		 *         - script id='first'
		 *         + tbody
		 *           + tr
		 *             + td
		 *               - "hi"
		 *           - script id='last'
		 *
		 * Which means that the two script tags, even though they were
		 * inserted at the same point in the hierarchy in the original
		 * HTML, now have different parents.
		 *
		 * This code reparents the first script tag by making it the tbody's
		 * first child.
		 **/
		if (start_element.parentNode !== end_element.parentNode) {

			end_element.parentNode.insertBefore(start_element, end_element.parentNode.firstChild);

		}

		this._start_element = start_element;
		this._end_element = end_element;

	},

	/**
	 * Get `_start_element`
	 * @returns {HTMLElement}
	 */
	getStartElement: function() {

		if (this._start_element == null) {
			this._getElements();
		}

		return this._start_element;

	},

	/**
	 * Get `_end_element`
	 * @returns {HTMLElement}
	 */
	getEndElement: function() {

		if (this._end_element == null) {
			this._getElements();
		}

		return this._end_element;

	},

	/**
	 * Render the container with `html` inside
	 * @param {string} html
	 * @returns {string}
	 */
	wrap: function(html) {

		this._start_element = this._end_element = null;

		/*
		 * We replace chevron by its hex code in order to prevent escaping problems.
		 * Check this thread for more explaination:
		 * http://stackoverflow.com/questions/8231048/why-use-x3c-instead-of-when-generating-html-from-javascript
		 */
		return "<script id='" + this._start_script_id + "' type='x'>\x3C/script>"
			+ html
			+ "<script id='" + this._end_script_id + "' type='x'>\x3C/script>";

	},

	/**
	 * Replace the content between container's tags. Requires container to be in DOM
	 * @param {string} html
	 */
	setHTML: function(html) {

		if (!this._is_inDOM) Lava.t("setHTML: container is not in DOM");

		Firestorm.DOM.clearInnerRange(this.getStartElement(), this.getEndElement());
		Firestorm.DOM.insertHTMLBefore(this.getEndElement(), html);

	},

	/**
	 * Remove container's content and it's tags from DOM
	 */
	remove: function() {

		if (!this._is_inDOM) Lava.t("remove: container is not in DOM");
		Firestorm.DOM.clearOuterRange(this.getStartElement(), this.getEndElement());

	},

	/**
	 * Insert html before the second &lt;script&gt; tag
	 * @param {string} html
	 */
	appendHTML: function(html) {

		Firestorm.DOM.insertHTMLBefore(this.getEndElement(), html);

	},

	/**
	 * Insert html after the first &lt;script&gt; tag
	 * @param {string} html
	 */
	prependHTML: function(html) {

		Firestorm.DOM.insertHTMLAfter(this.getStartElement(), html);

	},

	/**
	 * Insert html after the second &lt;script&gt; tag
	 * @param {string} html
	 */
	insertHTMLAfter: function(html) {

		Firestorm.DOM.insertHTMLAfter(this.getEndElement(), html);

	},

	/**
	 * Insert html before the first &lt;script&gt; tag
	 * @param {string} html
	 */
	insertHTMLBefore: function(html) {

		Firestorm.DOM.insertHTMLBefore(this.getStartElement(), html);

	},

	/**
	 * Call this method after inserting rendered container into DOM
	 */
	informInDOM: function() { this._is_inDOM = true; },

	/**
	 * Call this method before removing container from DOM
	 */
	informRemove: function() {

		this._start_element = this._end_element = null;
		this._is_inDOM = false;

	},

	/**
	 * Forget references to both DOM &lt;script&gt; elements
	 */
	release: function() {

		this._start_element = this._end_element = null;

	},

	/** Does nothing */
	refresh: function() {},

	/**
	 * Get `_is_inDOM`
	 * @returns {boolean}
	 */
	isInDOM: function() { return this._is_inDOM; },
	/**
	 * Get `_widget`
	 * @returns {Lava.widget.Standard}
	 */
	getWidget: function() { return this._widget; },
	/**
	 * Get `_view`
	 * @returns {Lava.view.Abstract}
	 */
	getView: function() { return this._view; },

	/** Free resources and make this instance unusable */
	destroy: function() {}

});

Lava.define(
'Lava.view.container.Emulated',
/**
 * Virtual container that can simulate behaviour of Element and Morph containers
 * @lends Lava.view.container.Emulated#
 * @implements _iContainer
 */
{

	/**
	 * Instance belongs to Emulated container
	 * @type {boolean}
	 * @const
	 */
	isEmulatedContainer: true,

	/**
	 * View that owns this instance
	 * @type {Lava.view.Abstract}
	 */
	_view: null,
	/**
	 * Container's settings
	 * @type {Object}
	 */
	//_config: null,

	/**
	 * Nearest widget in hierarchy
	 * @type {Lava.widget.Standard}
	 */
	_widget: null,

	/**
	 * Is instance in DOM
	 * @type {boolean}
	 */
	_is_inDOM: false,

	/**
	 * Create Emulated container instance
	 * @param {Lava.view.Abstract} view
	 * @param {_cEmulatedContainer} config
	 * @param {Lava.widget.Standard} widget
	 */
	init: function(view, config, widget) {

		this._view = view;
		//this._config = config;
		this._widget = widget;

		if (('options' in config)) {

			if ('appender' in config.options) {
				if (Lava.schema.DEBUG && !this['_append' + config.options.appender]) Lava.t('[Emulated container] wrong appender: ' + config.options.appender);
				this.appendHTML = this['_append' + config.options.appender]
			}

			if ('prepender' in config.options) {
				if (Lava.schema.DEBUG && !this['_append' + config.options.prepender]) Lava.t('[Emulated container] wrong prepender: ' + config.options.prepender);
				this.prependHTML = this['_append' + config.options.prepender]
			}

		}

	},

	/**
	 * Return `html` without modifications
	 * @param {string} html
	 * @returns {string} Returns argument as-is
	 */
	wrap: function(html) { return html; },

	/**
	 * Throws exception. May be overridden by user to provide exact method of inserting content
	 * @param {string} html
	 */
	setHTML: function(html) {

		if (!this._is_inDOM) Lava.t("setHTML: container is not in DOM");

		Lava.t('call to setHTML() in emulated container');

	},

	/**
	 * Throws exception. May be overridden by user to provide exact way of removing content
	 */
	remove: function() {

		if (!this._is_inDOM) Lava.t("remove: container is not in DOM");

		Lava.t('call to remove() in emulated container');

	},

	/**
	 * Append `html` to the bottom of parent container
	 * @param {string} html
	 */
	_appendBottom: function(html) {

		this._view.getParentView().getContainer().appendHTML(html);

	},

	/**
	 * Prepend `html` to the top of parent container
	 * @param {string} html
	 */
	_appendTop: function(html) {

		this._view.getParentView().getContainer().prependHTML(html);

	},

	/**
	 * Append `html` after previous view in template
	 * @param {string} html
	 */
	_appendAfterPrevious: function(html) {

		this._view.getTemplate().getPreviousView(this._view).getContainer().insertHTMLAfter(html);

	},

	/**
	 * Append `html` before next view in template
	 * @param {string} html
	 */
	_appendBeforeNext: function(html) {

		this._view.getTemplate().getNextView(this._view).getContainer().insertHTMLBefore(html);

	},

	/**
	 * Inserts `html` to where the bottom of container should be.
	 * Note: this method is replaced in constructor with exact algorithm
	 * @param {string} html
	 */
	appendHTML: function(html) {

		Lava.t("appendHTML is not supported or not configured");

	},

	/**
	 * Inserts `html` to where the top of container should be.
	 * Note: this method is replaced in constructor with exact algorithm
	 * @param {string} html
	 */
	prependHTML: function(html) {

		Lava.t("prependHTML is not supported or not configured");

	},

	/**
	 * Same as `prependHTML`
	 * @param {string} html
	 */
	insertHTMLBefore: function(html) {

		this.prependHTML(html);

	},

	/**
	 * Same as `appendHTML`
	 * @param {string} html
	 */
	insertHTMLAfter: function(html) {

		this.appendHTML(html);

	},

	/**
	 * Call this method immediately after content of the container has been inserted into DOM
	 */
	informInDOM: function() { this._is_inDOM = true; },

	/**
	 * Call this method before removing container's content from DOM
	 */
	informRemove: function() { this._is_inDOM = false; },

	/** Does nothing */
	refresh: function() {},

	/**
	 * Get `_is_inDOM`
	 * @returns {boolean}
	 */
	isInDOM: function() { return this._is_inDOM; },
	/**
	 * Get `_widget`
	 * @returns {Lava.widget.Standard}
	 */
	getWidget: function() { return this._widget; },
	/**
	 * Get `_view`
	 * @returns {Lava.view.Abstract}
	 */
	getView: function() { return this._view; },

	/** Does nothing */
	release: function() {},

	/**
	 * Free resources and make this instance unusable
	 */
	destroy: function() {}

});

/**
 * Animation has ended and template was removed from DOM
 * @event Lava.view.refresher.Standard#removal_complete
 * @type {Lava.system.Template}
 * @lava-type-description Template, that was removed
 */

/**
 * Animation has expanded the template
 * @event Lava.view.refresher.Standard#insertion_complete
 * @type {Lava.system.Template}
 * @lava-type-description Template, that was inserted
 */

Lava.define(
'Lava.view.refresher.Standard',
/**
 * Base class for animation support in views. Standard refresher does not animate templates, but inserts and removes them separately
 * @lends Lava.view.refresher.Standard#
 * @extends Lava.mixin.Observable
 */
{

	Extends: 'Lava.mixin.Observable',

	/**
	 * Settings for this instance
	 * @type {_cRefresher}
	 */
	_config: null,
	/**
	 * View, that owns this refresher instance
	 * @type {Lava.view.Abstract}
	 */
	_view: null,
	/**
	 * View's container
	 * @type {_iContainer}
	 */
	_container: null,
	/**
	 * Temporary storage for templates which were removed during current refresh cycle
	 * @type {Object.<_tGUID, Lava.system.Template>}
	 */
	_remove_queue: {},
	/**
	 * Templates, that are currently in DOM
	 * @type {Object.<_tGUID, Lava.system.Template>}
	 */
	_current_templates: [],

	/**
	 * Create refresher instance
	 * @param {_cRefresher} config
	 * @param {Lava.view.Abstract} view
	 * @param {_iContainer} container
	 */
	init: function(config, view, container) {

		this._config = config;
		this._view = view;
		this._container = container;

		if (config.get_start_element_callback) {

			this._getStartElement = config.get_start_element_callback;

		}

		if (config.get_end_element_callback) {

			this._getEndElement = config.get_end_element_callback;

		}

	},

	/**
	 * Queue templates for removal
	 * @param {Array.<Lava.system.Template>} templates
	 */
	prepareRemoval: function(templates) {

		for (var i = 0, count = templates.length; i < count; i++) {

			this._remove_queue[templates[i].guid] = templates[i];

		}

	},

	/**
	 * Insert new templates into DOM and remove those, which are queued for removal. Reorder existing templates
	 * @param {Array.<Lava.system.Template>} current_templates Templates, that refresher must render and insert into DOM.
	 *  Some of them can be already in DOM.
	 */
	refresh: function(current_templates) {

		var i = 1,
			count = current_templates.length,
			guid,
			previous_template = current_templates[0];

		if (previous_template) { // if list is not empty

			delete this._remove_queue[previous_template.guid];

			// handle first template separately from others
			if (!previous_template.isInDOM()) {

				this._insertFirstTemplate(previous_template);
				this._fire('insertion_complete', previous_template);

			}

			for (; i < count; i++) {

				delete this._remove_queue[current_templates[i].guid];

				if (current_templates[i].isInDOM()) {

					this._moveTemplate(current_templates[i], previous_template, current_templates);

				} else {

					this._insertTemplate(current_templates[i], previous_template, i);
					this._fire('insertion_complete', current_templates[i]);

				}

				previous_template = current_templates[i];

			}

		}

		for (guid in this._remove_queue) {

			if (this._remove_queue[guid].isInDOM()) {

				this._removeTemplate(this._remove_queue[guid]);
				this._fire('removal_complete', this._remove_queue[guid]);

			}

		}

		this._remove_queue = {};

	},

	/**
	 * Insert template at the top of view's container
	 * @param {Lava.system.Template} template
	 */
	_insertFirstTemplate: function(template) {

		this._view.getContainer().prependHTML(template.render());
		template.broadcastInDOM();
		this._current_templates.unshift(template);

	},

	/**
	 * Move `template` after `previous_template` (both are in DOM)
	 * @param {Lava.system.Template} template
	 * @param {Lava.system.Template} new_previous_template
	 * @param {Array.<Lava.system.Template>} current_templates
	 */
	_moveTemplate: function (template, new_previous_template, current_templates) {

		var current_previous_index = this._current_templates.indexOf(template) - 1,
			current_previous_template = null;

		if (Lava.schema.DEBUG && current_previous_index == -2) Lava.t();

		// skip removed templates
		while (current_previous_index > -1 && current_templates.indexOf(this._current_templates[current_previous_index]) == -1) {
			current_previous_index--;
		}

		if (current_previous_index > -1) {
			current_previous_template = this._current_templates[current_previous_index];
		}

		if (new_previous_template != current_previous_template) {

			Firestorm.DOM.moveRegionAfter(
				this._getEndElement(new_previous_template),
				this._getStartElement(template),
				this._getEndElement(template)
			);

			// move it in local _current_templates array
			Firestorm.Array.exclude(this._current_templates, template);

			var previous_index = this._current_templates.indexOf(new_previous_template);
			if (Lava.schema.DEBUG && previous_index == -1) Lava.t();
			this._current_templates.splice(previous_index + 1, 0, template);

		}

	},

	/**
	 * Get top element of a template
	 * @param {Lava.system.Template} template
	 * @returns {HTMLElement}
	 */
	_getStartElement: function(template) {

		return template.getFirstView().getContainer().getDOMElement();

	},

	/**
	 * Get bottom element of a template
	 * @param template
	 * @returns {HTMLElement}
	 */
	_getEndElement: function(template) {

		return template.getLastView().getContainer().getDOMElement();

	},

	/**
	 * View's render callback
	 * @param {Array.<Lava.system.Template>} current_templates Templates that must be in DOM
	 */
	render: function(current_templates) {

		var i = 0,
			count = current_templates.length,
			guid;

		// from templates, which are prepared for removal, filter out those, which should be in DOM
		for (; i < count; i++) {

			delete this._remove_queue[current_templates[i].guid];

		}

		for (guid in this._remove_queue) {

			if (this._remove_queue[guid].isInDOM()) {

				this._remove_queue[guid].broadcastRemove();
				this._fire('removal_complete', this._remove_queue[guid]);

			}

		}

		this._current_templates = current_templates;
		this._remove_queue = {};

		return this._render();

	},

	/**
	 * Render current templates
	 * @returns {string}
	 */
	_render: function() {

		var buffer = '',
			i = 0,
			count = this._current_templates.length;

		for (; i < count; i++) {

			buffer += this._current_templates[i].render();

		}

		return buffer;

	},

	/**
	 * Insert template into DOM
	 * @param {Lava.system.Template} template
	 * @param {Lava.system.Template} previous_template
	 * @param {number} index Index of this template in list of all active templates
	 */
	_insertTemplate: function(template, previous_template, index) {

		Firestorm.DOM.insertHTMLAfter(this._getEndElement(previous_template), template.render());
		template.broadcastInDOM();

		var previous_index = this._current_templates.indexOf(previous_template);
		if (Lava.schema.DEBUG && previous_index == -1) Lava.t();
		this._current_templates.splice(previous_index + 1, 0, template);

	},

	/**
	 * Remove template from DOM
	 * @param {Lava.system.Template} template
	 */
	_removeTemplate: function(template) {

		// save, cause we can not retrieve container's DOM elements after broadcastRemove
		var start_element = this._getStartElement(template),
			end_element = this._getEndElement(template);

		// first, we must inform the template, that it's going to be removed: to allow it's child views to interact
		// with nodes while they are still in DOM
		template.broadcastRemove();

		if (start_element == end_element) {

			Firestorm.Element.destroy(start_element);

		} else {

			// remove everything between tags and tags themselves
			Firestorm.DOM.clearOuterRange(start_element, end_element);

		}

		Firestorm.Array.exclude(this._current_templates, template);

	},

	/**
	 * Are there any active animations
	 * @returns {boolean}
	 */
	hasAnimations: function() {

		return false;

	},

	/**
	 * Is insertion or removal animation enabled
	 * @returns {boolean} <kw>false</kw>
	 */
	isAnimationEnabled: function() {

		return false;

	},

	/**
	 * Actions to take after the view was rendered and inserted into DOM
	 */
	broadcastInDOM: function() {

		this._broadcast('broadcastInDOM');

	},

	/**
	 * Actions to take before owner view is removed from DOM
	 */
	broadcastRemove: function() {

		this._broadcast('broadcastRemove');

	},

	/**
	 * Broadcast callback to children
	 * @param {string} function_name
	 */
	_broadcast: function(function_name) {

		for (var i = 0, count = this._current_templates.length; i < count; i++) {

			this._current_templates[i][function_name]();

		}

	},

	/**
	 * Free resources and make this instance unusable
	 */
	destroy: function() {

		this._current_templates = this._remove_queue = null;

	}

});

Lava.define(
'Lava.view.refresher.Animated',
/**
 * Base class for refreshers, which support animation
 * @lends Lava.view.refresher.Animated#
 * @extends Lava.view.refresher.Standard
 */
{

	Extends: 'Lava.view.refresher.Standard',

	/**
	 * Whether to perform template insertion and removal animations
	 * @type {boolean}
	 */
	_is_animation_enabled: true,
	/**
	 * Animation instances for each template
	 * @type {Object.<_tGUID, Lava.animation.Standard>}
	 */
	_animations_by_template_guid: {},
	/**
	 * Template of each animation
	 * @type {Object.<_tGUID, Lava.system.Template>}
	 */
	_templates_by_animation_guid: {},

	refresh: function(current_templates) {

		if (this.isAnimationEnabled()) {

			this._refreshAnimated(current_templates);

		} else {

			this.Standard$refresh(current_templates);

		}

	},

	/**
	 * Version of `refresh()`, which animates insertion and removal of templates
	 * @param {Array.<Lava.system.Template>} current_templates
	 */
	_refreshAnimated: function(current_templates) {

		var i = 0,
			count = current_templates.length,
			previous_template = null,
			guid;

		for (; i < count; i++) {

			delete this._remove_queue[current_templates[i].guid];
			this._animateInsertion(current_templates[i], previous_template, i, current_templates);
			previous_template = current_templates[i];

		}

		for (guid in this._remove_queue) {

			this._animateRemoval(this._remove_queue[guid]);

		}

		this._remove_queue = {};

	},

	/**
	 * View's render callback
	 * @param {Array.<Lava.system.Template>} current_templates
	 */
	render: function(current_templates) {

		this._finishAnimations();
		return this.Standard$render(current_templates);

	},

	/**
	 * Set `_is_animation_enabled` to <kw>true</kw>
	 */
	enableAnimation: function() {

		this._is_animation_enabled = true;

	},

	/**
	 * Set `_is_animation_enabled` to <kw>false</kw> and stop all animations
	 */
	disableAnimation: function() {

		this._is_animation_enabled = false;
		this._finishAnimations();

	},

	/**
	 * Get `_is_animation_enabled`
	 * @returns {boolean}
	 */
	isAnimationEnabled: function() {

		return this._is_animation_enabled;

	},

	/**
	 * Finish all active animations (rewind to end and raise "completed" events)
	 */
	_finishAnimations: function() {

		for (var guid in this._animations_by_template_guid) {

			// you can not just stop() them, cause you need onComplete events to fire
			this._animations_by_template_guid[guid].finish();

		}

		this._animations_by_template_guid = {};
		this._templates_by_animation_guid = {};

	},

	hasAnimations: function() {

		return !Firestorm.Object.isEmpty(this._animations_by_template_guid);

	},

	/**
	 * Insert the template into DOM and apply corresponding animation
	 * @param {Lava.system.Template} template
	 * @param {Lava.system.Template} previous_template
	 * @param {number} index Index of this template in list of all active templates
	 * @param {Array.<Lava.system.Template>} current_templates
	 */
	_animateInsertion: function(template, previous_template, index, current_templates) {

		var animation = this._animations_by_template_guid[template.guid];

		if (Lava.schema.DEBUG && animation && !template.isInDOM()) Lava.t();

		if (template.isInDOM()) {

			// first template does not require moving
			previous_template && this._moveTemplate(template, previous_template, current_templates);

		} else {

			if (previous_template) {

				this._insertTemplate(template, previous_template, index);

			} else {

				this._insertFirstTemplate(template);

			}

			animation = this._createAnimation(template, index);

		}

		if (animation) {

			animation.resetDirection();
			animation.safeStart();

		}

	},

	/**
	 * Apply template removal animation and remove element from DOM in the end of it
	 * @param {Lava.system.Template} template
	 */
	_animateRemoval: function(template) {

		var animation = this._animations_by_template_guid[template.guid];

		if (!animation && template.isInDOM()) {

			animation = this._createAnimation(template);

		}

		if (animation) {

			animation.reverseDirection();
			animation.safeStart();

		}

	},

	/**
	 * Cleanup animation instance and update state of it's template
	 * @param {Lava.animation.Abstract} animation
	 */
	_onAnimationComplete: function(animation) {

		var template = this._templates_by_animation_guid[animation.guid];

		if (animation.isReversed()) {

			this._onRemovalComplete(animation, template);
			this._fire('removal_complete', template);

		} else {

			this._onInsertionComplete(animation, template);
			this._fire('insertion_complete', template);

		}

		delete this._templates_by_animation_guid[animation.guid];
		delete this._animations_by_template_guid[template.guid];

	},

	/**
	 * Get the element of the template, that will be animated
	 * @param {Lava.system.Template} template
	 * @returns {HTMLElement}
	 */
	_getAnimationTarget: function(template) {

		// get the only element inside the template
		return template.getFirstView().getContainer().getDOMElement();

	},

	/**
	 * Removal animation has ended. Remove template from DOM
	 * @param {Lava.animation.Abstract} animation
	 * @param {Lava.system.Template} template
	 */
	_onRemovalComplete: function(animation, template) {

		this._removeTemplate(template);

	},

	/**
	 * Insertion animation has ended. Update state of the template
	 * @param {Lava.animation.Abstract} animation
	 * @param {Lava.system.Template} template
	 */
	_onInsertionComplete: function(animation, template) {



	},

	/**
	 * Create animation instance
	 * @param {Lava.system.Template} template
	 * @param {number} index Index of the template in the list of all active templates
	 */
	_createAnimation: function(template, index) {

		Lava.t("Abstract function call: _createAnimation");

	},

	broadcastRemove: function() {

		this._finishAnimations();
		this.Standard$broadcastRemove();

	},

	destroy: function() {

		this._finishAnimations();
		this.Standard$destroy();

	}

});

Lava.define(
'Lava.view.refresher.Collapse',
/**
 * Animation that expands and collapses elements in one direction
 * @lends Lava.view.refresher.Collapse#
 * @extends Lava.view.refresher.Animated
 */
{

	Extends: 'Lava.view.refresher.Animated',

	/**
	 * Animation class to use when expanding and collapsing templates
	 * @type {string}
	 * @readonly
	 */
	ANIMATION_NAME: 'Lava.animation.Collapse',

	_createAnimation: function(template, index) {

		var element = this._getAnimationTarget(template),
			constructor,
			animation;

		constructor = Lava.ClassManager.getConstructor(this.ANIMATION_NAME, 'Lava.animation');
		animation = new constructor({}, element);
		animation.on('complete', this._onAnimationComplete, this);

		this._templates_by_animation_guid[animation.guid] = template;
		this._animations_by_template_guid[template.guid] = animation;

		return animation;

	}

});

/**
 * View has been destroyed and became unusable. You must not call any methods of a destroyed instance
 * @event Lava.view.Abstract#destroy
 */

Lava.define(
'Lava.view.Abstract',
/**
 * Base class for all views and widgets
 *
 * @lends Lava.view.Abstract#
 * @extends Lava.mixin.Properties#
 * @implements _iViewHierarchyMember
 */
{

	Extends: 'Lava.mixin.Properties',
	/**
	 * Indicate that this class is instance of Lava.view.Abstract
	 * @type {boolean}
	 * @const
	 */
	isView: true,
	/**
	 * Global unique identifier
	 * @type {_tGUID}
	 * @readonly
	 */
	guid: null,
	/**
	 * Global unique user-assigned view's ID. Views can be retrieved by their ID from {@link Lava.system.ViewManager};
	 * and referenced in expressions. Note: this is not the same as "id" attribute of DOM element of view's container.
	 *
	 * Do not set this property directly! Use appropriate setter.
	 * @type {?string}
	 * @readonly
	 */
	id: null,
	/**
	 * Labels are used to find views when routing events and roles, or manually.
	 * Label is part of template config, so must be considered readonly
	 * @type {?string}
	 * @readonly
	 */
	label: null,
	/**
	 * How many parents does it have (until the root widget, which does not have a parent)
	 * @type {number}
	 * @readonly
	 */
	depth: 0,

	/**
	 * View's index in {@link Lava.system.Template#_content|_content} array of parent template
	 * @type {number}
	 * @readonly
	 */
	template_index: 0,

	/**
	 * Nearest widget in hierarchy of view's parents
	 * @type {Lava.widget.Standard}
	 */
	_widget: null,

	/**
	 * The owner (parent) view of this instance
	 * @type {Lava.view.Abstract}
	 */
	_parent_view: null,

	/**
	 * Nearest parent view with it's own container
	 * @type {Lava.view.Abstract}
	 */
	_parent_with_container: null,

	/**
	 * View's container
	 * @type {_iContainer}
	 */
	_container: null,

	/**
	 * Settings for this instance
	 * @type {_cView}
	 */
	_config: null,

	/**
	 * The {@link Lava.system.Template} that owns the view
	 */
	_template: null,

	/**
	 * Is this view currently in DOM
	 * @type {boolean}
	 */
	_is_inDOM: false,
	/**
	 * Does this view need refresh
	 * @type {boolean}
	 */
	_is_dirty: false,
	/**
	 * Will it be refreshed by ViewManager
	 * @type {boolean}
	 */
	_is_queued_for_refresh: false,

	/**
	 * Bindings to properties of this view
	 * @type {Object.<string, Lava.scope.PropertyBinding>}
	 */
	_property_bindings_by_property: {},

	/**
	 * Segments, built over bindings to properties of this view (see {@link Lava.scope.Segment})
	 * @type {Object.<_tGUID, Lava.scope.Segment>}
	 */
	_data_segments: {},

	/**
	 * Each time the view is refreshed - it's assigned the id of the current refresh loop
	 * @type {number}
	 */
	_last_refresh_id: 0,
	/**
	 * How many times this view was refreshed during current refresh loop.
	 * Used for infinite loops protection.
	 * @type {number}
	 */
	_refresh_cycle_count: 0,

	/**
	 * Create an instance of the view, including container and assigns; dispatch roles
	 * @param {_cView} config
	 * @param {Lava.widget.Standard} widget
	 * @param {Lava.view.Abstract} parent_view
	 * @param {Lava.system.Template} template
	 * @param {Object} properties
	 */
	init: function(config, widget, parent_view, template, properties) {

		var name,
			argument,
			constructor;

		this.guid = Lava.guid++;
		if (Lava.schema.DEBUG && config.id && !Lava.isValidId(config.id)) Lava.t();
		if ('id' in config) {
			this.id = config.id;
		}
		if ('label' in config) {
			this.label = config.label;
		}

		Lava.view_manager.registerView(this);

		this._config = config;
		this._widget = widget;
		this._template = template;

		if (parent_view) {

			this._parent_view = parent_view;
			this._parent_with_container = parent_view.getContainer() ? parent_view : parent_view.getParentWithContainer();
			this.depth = parent_view.depth + 1;

		}

		this._initMembers(properties);

		for (name in config.assigns) {

			if (config.assigns[name].once) {

				argument = new Lava.scope.Argument(config.assigns[name], this, this._widget);
				this.set(name, argument.getValue());
				argument.destroy();

			} else {

				if (name in this._property_bindings_by_property) Lava.t("Error initializing assign: property binding already created");

				this._property_bindings_by_property[name] = new Lava.scope.PropertyBinding(this, name, config.assigns[name]);

			}

		}

		if ('container' in config) {

			constructor = Lava.ClassManager.getConstructor(config.container['type'], 'Lava.view.container');
			this._container = new constructor(this, config.container, widget);

		}

		this._postInit();

		if ('roles' in  config) Lava.view_manager.dispatchRoles(this, config.roles);

	},

	/**
	 * Get `_container`
	 * @returns {_iContainer}
	 */
	getContainer: function() { return this._container; },

	/**
	 * Get `_parent_with_container`
	 * @returns {Lava.view.Abstract}
	 */
	getParentWithContainer: function() { return this._parent_with_container; },

	/**
	 * Get `_parent_view`
	 * @returns {Lava.view.Abstract}
	 */
	getParentView: function() { return this._parent_view; },

	/**
	 * Get `_widget`
	 * @returns {Lava.widget.Standard}
	 */
	getWidget: function() { return this._widget; },

	/**
	 * Get `_is_inDOM`
	 * @returns {boolean}
	 */
	isInDOM: function() { return this._is_inDOM; },

	/**
	 * Get `_template`
	 * @returns {Lava.system.Template}
	 */
	getTemplate: function() { return this._template; },

	/**
	 * Setter for the {@link Lava.view.Abstract#id} property
	 * @param {string} new_id
	 */
	setId: function(new_id) {

		if (Lava.schema.DEBUG && !Lava.isValidId(new_id)) Lava.t();
		Lava.view_manager.unregisterView(this);
		this.id = new_id;
		Lava.view_manager.registerView(this);

	},

	/**
	 * Set properties, that were passed to constructor
	 * @param {Object} properties
	 */
	_initMembers: function(properties) {

		for (var name in properties) {

			this.set(name, properties[name]);

		}

	},

	/**
	 * Called before registering roles
	 */
	_postInit: function() {

	},

	/**
	 * Get N'th parent of the view
	 * @param {number} depth The number of view's parent you want to get
	 * @returns {Lava.view.Abstract}
	 */
	getViewByDepth: function(depth) {

		var root = this;

		while (depth > 0) {

			root = root.getParentView();

			if (!root) Lava.t("Error evaluating depth: parent view does not exist");

			depth--;

		}

		return root;

	},

	/**
	 * This view needs to be refreshed. If it has a container - then it can refresh itself independently,
	 * but views without container must ask their parents to refresh them
	 */
	trySetDirty: function() {

		if (this._is_inDOM) {

			if (this._container) {

				this._is_dirty = true;

				if (!this._is_queued_for_refresh) {

					Lava.view_manager.scheduleViewRefresh(this);
					this._is_queued_for_refresh = true;

				}

			} else if (this._parent_with_container) {

				this._parent_with_container.trySetDirty();

			}

		}

	},

	/**
	 * Execute some state changing function on each child of the view
	 * Must be overridden in child classes (in those, that have children)
	 * @param {string} function_name
	 */
	_broadcastToChildren: function(function_name) {},

	/**
	 * Inform that this view is already in DOM. Now it can access it's container's elements
	 */
	broadcastInDOM: function() {

		this._is_inDOM = true;
		this._is_dirty = false;
		this._container && this._container.informInDOM();

		this._broadcastToChildren('broadcastInDOM');

	},

	/**
	 * Inform that this view is now going to be removed from DOM. It must suspend it's bindings,
	 * detach element listeners and stop animations, etc.
	 */
	broadcastRemove: function() {

		if (this._is_inDOM) {

			this._is_inDOM = false;
			this._is_dirty = false;
			this._container && this._container.informRemove();

			this._broadcastToChildren('broadcastRemove');

		}

	},

	/**
	 * Render the view, including container and all it's inner content
	 * @returns {string} The HTML representation of the view
	 */
	render: function() {

		var buffer = this._renderContent(),
			result;

		if (this._container) {

			result = this._container.wrap(buffer);

		} else {

			result = buffer;

		}

		return result;

	},

	/**
	 * Render the inner hierarchy
	 */
	_renderContent: function() {

		Lava.t("_renderContent must be overridden in inherited classes");

	},

	/**
	 * Refresh the view, if it's dirty (render the view's content and replace old content with the fresh version).
	 * This method is called by ViewManager, you should not call it directly.
	 *
	 * Warning: violates code style with multiple return statements
	 */
	refresh: function(refresh_id) {

		if (Lava.schema.DEBUG && !this._container) Lava.t("Refresh on a view without container");

		this._is_queued_for_refresh = false;

		if (this._is_inDOM && this._is_dirty) {

			if (this._last_refresh_id == refresh_id) {

				this._refresh_cycle_count++;
				if (this._refresh_cycle_count > Lava.schema.system.REFRESH_INFINITE_LOOP_THRESHOLD) {

					// schedule this view for refresh in the next refresh loop
					Lava.view_manager.scheduleViewRefresh(this);
					this._is_queued_for_refresh = true;
					// when refresh returns true - it means an infinite loop exception,
					// it stops current refresh loop.
					return true;

				}

			} else {

				this._last_refresh_id = refresh_id;
				this._refresh_cycle_count = 0;

			}

			this._refresh();
			this._is_dirty = false;

		}

		return false;

	},

	/**
	 * Perform refresh
	 */
	_refresh: function() {

		this._container.setHTML(this._renderContent());
		this._broadcastToChildren('broadcastInDOM');

	},

	/**
	 * Find a view with given label in hierarchy of view's parents. Recognizes some predefined labels, like:
	 * - "root" - the root widget (topmost widget with no parents)
	 * - "parent" - this view's parent view
	 * - "widget" - parent widget of this view
	 * - "this" - this view
	 * @param {string} label Label to search for
	 * @returns {Lava.view.Abstract} View with given label
	 */
	locateViewByLabel: function(label) {

		if (Lava.schema.DEBUG && !label) Lava.t();

		var result = this;

		if (label == 'root') {

			result = this._widget;

			while (result.getParentWidget()) {

				result = result.getParentWidget();

			}

		} else if (label == 'parent') {

			result = this._parent_view;

		} else if (label == 'widget') {

			result = this._widget;

		} else if (label != 'this') {

			while (result && result.label != label) {

				result = result.getParentView();

			}

		}

		return result;

	},

	/**
	 * Find a <b>widget</b> with given name in hierarchy of this view's parents
	 *
	 * @param {string} name Name of the widget
	 * @returns {Lava.widget.Standard}
	 */
	locateViewByName: function(name) {

		if (Lava.schema.DEBUG && !name) Lava.t();

		var result = this._widget;

		while (result && result.name != name) {

			result = result.getParentWidget();

		}

		return result;

	},

	/**
	 * Get a view with given user-defined id
	 * @param {string} id
	 * @returns {Lava.view.Abstract}
	 */
	locateViewById: function(id) {

		if (Lava.schema.DEBUG && !id) Lava.t();

		return Lava.view_manager.getViewById(id);

	},

	/**
	 * Get a view by GUID
	 * @param {_tGUID} guid
	 * @returns {Lava.view.Abstract}
	 */
	locateViewByGuid: function(guid) {

		if (Lava.schema.DEBUG && !guid) Lava.t();

		return Lava.view_manager.getViewByGuid(guid);

	},

	/**
	 * Find a view in hierarchy of parents by the given route
	 * @param {_cScopeLocator|_cKnownViewLocator} path_config
	 * @returns {Lava.view.Abstract}
	 */
	locateViewByPathConfig: function(path_config) {

		var result = this['locateViewBy' + path_config.locator_type](path_config.locator);

		if (Lava.schema.DEBUG && !result) Lava.t("View not found. " + path_config.locator_type + ':' + path_config.locator);

		if ('depth' in path_config) {

			result = result.getViewByDepth(path_config.depth);

		}

		return result;

	},

	/**
	 * Get a parent with property `name` defined
	 * @param {string} name
	 * @returns {Lava.view.Abstract}
	 */
	locateViewWithProperty: function(name) {

		var view = this;

		while (view && !view.isset(name)) {

			view = view.getParentView();

		}

		return view;

	},

	/**
	 * Get a scope or property binding by the given route
	 * @param {_cScopeLocator} path_config
	 * @returns {_iValueContainer}
	 */
	getScopeByPathConfig: function(path_config) {

		var view,
			i = 0,
			count,
			result,
			tail = path_config.tail;

		if ('property_name' in path_config) {

			view = ('locator_type' in path_config) ? this.locateViewByPathConfig(path_config) : this;

			view = view.locateViewWithProperty(path_config.property_name);

			if (Lava.schema.DEBUG && !view) Lava.t("Property not found: " + path_config.property_name);

			result = view.getDataBinding(path_config.property_name);

		} else {

			if (Lava.schema.DEBUG && !('locator_type' in path_config)) Lava.t("Malformed scope path (1)");
			if (Lava.schema.DEBUG && !tail) Lava.t("Malformed scope path (2)");

			result = this.locateViewByPathConfig(path_config);

			if (Lava.schema.DEBUG && !result) Lava.t("View not found. "
				+ path_config.locator_type + ": " + path_config.locator + ", depth:" + path_config.depth);

		}

		if (tail) {

			for (count = tail.length; i < count; i++) {

				result = (typeof(tail[i]) == 'object')
					? result.getSegment(this.getScopeByPathConfig(tail[i]))
					: result.getDataBinding(tail[i]);

			}

		}

		return result;

	},

	/**
	 * Get value of the route without creating scopes
	 * @param {_cScopeLocator} path_config
	 * @returns {*}
	 */
	evalPathConfig: function(path_config) {

		var view,
			i = 0,
			count,
			result,
			tail = path_config.tail,
			property_name;

		if ('property_name' in path_config) {

			view = ('locator_type' in path_config) ? this.locateViewByPathConfig(path_config) : this;

			view = view.locateViewWithProperty(path_config.property_name);

			result = view.get(path_config.property_name);

		} else {

			if (Lava.schema.DEBUG && !('locator_type' in path_config)) Lava.t("Malformed scope path (1)");
			if (Lava.schema.DEBUG && !tail) Lava.t("Malformed scope path (2)");

			result = this.locateViewByPathConfig(path_config);

			if (Lava.schema.DEBUG && !result) Lava.t("View not found. "
				+ path_config.locator_type + ": " + path_config.locator + ", depth:" + path_config.depth);

		}

		if (tail) {

			for (count = tail.length; i < count; i++) {

				property_name = (typeof(tail[i]) == 'object') ? this.evalPathConfig(tail[i]) : tail[i];

				if (result.isCollection && /^\d+$/.test(property_name)) {

					result = result.getValueAt(+property_name);

				} else if (result.isProperties) {

					result = result.get(property_name);

				} else {

					result = result[property_name];

				}

				if (!result) {

					break;

				}

			}

		}

		return result;

	},

	/**
	 * Get a binding to this view's property
	 * @param {string} property_name
	 * @returns {Lava.scope.PropertyBinding}
	 */
	getDataBinding: function(property_name) {

		if (!(property_name in this._property_bindings_by_property)) {

			this._property_bindings_by_property[property_name] = new Lava.scope.PropertyBinding(this, property_name);

		}

		return this._property_bindings_by_property[property_name];

	},

	/**
	 * Get a {@link Lava.scope.Segment}, bound to view's property
	 * @param {(Lava.scope.PropertyBinding|Lava.scope.DataBinding)} name_source_scope
	 * @returns {Lava.scope.Segment}
	 */
	getSegment: function(name_source_scope) {

		if (Lava.schema.DEBUG && !name_source_scope.guid) Lava.t("Only PropertyBinding and DataBinding may be used as name source for segments");

		if (!(name_source_scope.guid in this._data_segments)) {

			this._data_segments[name_source_scope.guid] = new Lava.scope.Segment(this, name_source_scope);

		}

		return this._data_segments[name_source_scope.guid];

	},

	/**
	 * Free resources and make this instance unusable
	 */
	destroy: function() {

		var name;

		this._fire('destroy');

		Lava.view_manager.unregisterView(this);

		if (this._container) this._container.destroy();

		for (name in this._property_bindings_by_property) {

			this._property_bindings_by_property[name].destroy();

		}

		for (name in this._data_segments) {

			this._data_segments[name].destroy();

		}

		this._is_inDOM = false; // to prevent refresh

	}

});

Lava.define(
'Lava.view.View',
/**
 * A view, which can have a container and inner template. The only kind of view, which can have a void tag as container
 *
 * @lends Lava.view.View#
 * @extends Lava.view.Abstract#
 * @implements _iViewHierarchyMember
 */
{

	Extends: 'Lava.view.Abstract',

	/**
	 * The content of the view
	 * @type {Lava.system.Template}
	 */
	_content: null,

	_postInit: function() {

		if (
			Lava.schema.DEBUG
			&& (('argument' in this._config) || ('else_template' in this._config) || ('elseif_arguments' in this._config))
		) {
			Lava.t("Standard View does not support arguments and elseif/else blocks");
		}

	},

	render: function() {

		var result;

		if (this._container) {

			// This is the only view, that can have void element containers.
			// Check is done to speed up the rendering process.
			result = (this._container.isElementContainer && this._container.isVoid())
				? this._container.renderVoid()
				: this._container.wrap(this._renderContent());

		} else {

			result = this._renderContent();

		}

		return result;

	},

	_refresh: function() {

		if (!this._container.isVoid()) {
			this._container.setHTML(this._renderContent());
			this._broadcastToChildren('broadcastInDOM');
		}

	},

	_renderContent: function() {

		return this._getContent().render();

	},

	/**
	 * @param {string} function_name
	 */
	_broadcastToChildren: function(function_name) {

		if (this._content != null) {

			this._content[function_name]();

		}

	},

	/**
	 * Get `_content`. Create, if needed
	 * @returns {Lava.system.Template}
	 */
	_getContent: function() {

		if (this._content == null) {

			this._content = new Lava.system.Template(this._config.template || [], this._widget, this)

		}

		return this._content;

	},

	destroy: function() {

		if (this._content) {
			this._content.destroy();
			this._content = null;
		}

		this.Abstract$destroy();

	}

});

Lava.define(
'Lava.view.Expression',
/**
 * View that displays result of an Argument
 *
 * @lends Lava.view.Expression#
 * @extends Lava.view.Abstract
 * @implements _iViewHierarchyMember
 */
{

	Extends: 'Lava.view.Abstract',
	/**
	 * Argument that returns a string
	 * @type {Lava.scope.Argument}
	 */
	_argument: null,
	/**
	 * Listener for {@link Lava.scope.Argument#event:changed}
	 * @type {_tListener}
	 */
	_argument_changed_listener: null,

	/**
	 * Should the view escape HTML entities in argument's value. May be turned off via config switch
	 * @type {boolean}
	 */
	_escape: true,

	_postInit: function() {

		if (Lava.schema.DEBUG && !('argument' in this._config)) Lava.t("Expression view requires an argument");
		this._escape = !this._config.escape_off;
		this._argument = new Lava.scope.Argument(this._config.argument, this, this._widget);
		this._argument_changed_listener = this._argument.on('changed', this._onValueChanged, this);

	},

	/**
	 * Argument's value has changed, schedule refresh
	 */
	_onValueChanged: function() {

		this.trySetDirty();

	},

	_renderContent: function() {

		if (Lava.schema.DEBUG && this._argument.isWaitingRefresh()) Lava.t("Rendering a view in dirty state");

		var result = '',
			new_value = this._argument.getValue();

		if (new_value != null && typeof(new_value) != 'undefined') {

			result = this._escape
				? this.escapeArgumentValue(new_value.toString())
				: new_value.toString();

		}

		return result;

	},

	/**
	 * Perform escaping of HTML entities in argument's value
	 * @param {string} string Argument's value
	 * @returns {string} Escaped value
	 */
	escapeArgumentValue: function(string) {

		return Firestorm.String.escape(string, Firestorm.String.HTML_ESCAPE_REGEX);

	},

	destroy: function() {

		this._argument.destroy();
		this._argument = null;

		this.Abstract$destroy();

	}

});

Lava.define(
'Lava.view.Foreach',
/**
 * Iterate over a sequence of items and render a template for each item
 *
 * @lends Lava.view.Foreach#
 * @extends Lava.view.Abstract
 * @implements _iViewHierarchyMember
 */
{

	Extends: 'Lava.view.Abstract',

	/**
	 * Argument, that returns an array or Enumerable
	 * @type {Lava.scope.Argument}
	 */
	_argument: null,
	/**
	 * Scope, that is preparing results from argument
	 * @type {Lava.scope.Foreach}
	 */
	_foreach_scope: null,
	/**
	 * Listener for {@link Lava.scope.Foreach#event:changed} event
	 * @type {_tListener}
	 */
	_foreach_scope_changed_listener: null,

	/**
	 * Equals to `_current_uids.length`
	 * @type {number}
	 */
	_current_count: 0,
	/**
	 * Unique IDs, received from Enumerable, that was returned from Foreach scope
	 * @type {Array.<number>}
	 */
	_current_uids: [],
	/**
	 * Enumerable UID => Template
	 * @type {Object.<string, Lava.system.Template>}
	 */
	_current_hash: {},

	/**
	 * Templates that correspond to each item in Enumerable
	 * @type {Array.<Lava.system.Template>}
	 */
	_current_templates: [],

	/**
	 * The name of variable, holding the concrete record in child views
	 * @type {string}
	 */
	_as: null,

	/**
	 * Refreshers animate insertion and removal of templates.
	 * They can also insert and remove templates independently of each other
	 * @type {Lava.view.refresher.Standard}
	 */
	_refresher: null,

	_properties: {
		/**
		 * Number of items in Foreach
		 */
		count: 0
	},

	/**
	 * Set each time when scope changes - sign to refresh child templates in `refresh()` or `render()`
	 * @type {boolean}
	 */
	_requires_refresh_children: true,

	init: function(config, widget, parent_view, template, properties) {

		this.Abstract$init(config, widget, parent_view, template, properties);

		// setting count after roles registration, cause scope can be filtered
		this.set('count', this._foreach_scope.getValue().getCount());

	},

	_initMembers: function(properties) {

		if (Lava.schema.DEBUG && !('argument' in this._config)) Lava.t("Foreach view requires an argument");
		if (Lava.schema.DEBUG && !this._config.as) Lava.t("Foreach view requires 'as' hash parameter");
		if (Lava.schema.DEBUG && !this._config.template) Lava.t("Foreach view must not be empty");

		this.Abstract$_initMembers(properties);

		this._argument = new Lava.scope.Argument(this._config.argument, this, this._widget);
		this._foreach_scope = new Lava.scope.Foreach(this._argument, this, this._widget, this._config.scope);
		this._foreach_scope_changed_listener = this._foreach_scope.on('changed', this._onDataSourceChanged, this);
		this._foreach_scope.on('new_enumerable', this._onEnumerableChanged, this);
		this._as = this._config.as;

	},

	_postInit: function() {

		if (this._config.refresher) {
			this.createRefresher(this._config.refresher);
		}

	},

	/**
	 * Can be called during roles registration (at the time of `init()`), before children are created.
	 * Initializes a refresher instance with custom config.
	 *
	 * @param {_cRefresher} refresher_config
	 */
	createRefresher: function(refresher_config) {

		if (Lava.schema.DEBUG && (this._refresher || this._current_count)) Lava.t("Foreach: refresher is already created or createRefresher() was called outside of init()");
		if (Lava.schema.DEBUG && !this._container) Lava.t('View/Foreach: refresher needs container to work');

		var constructor = Lava.ClassManager.getConstructor(refresher_config['type'], 'Lava.view.refresher');
		this._refresher = /** @type {Lava.view.refresher.Standard} */ new constructor(refresher_config, this, this._container);

		this._refresher.on('removal_complete', this._onRemovalComplete, this);
		this._refresh = this._refresh_Refresher;
		this._removeTemplates = this._removeTemplates_Refresher;
		this._renderContent = this._renderContent_Refresher;
		this._broadcastToChildren = this._broadcastToChildren_Refresher;

	},

	/**
	 * Get `_refresher`
	 * @returns {Lava.view.refresher.Standard}
	 */
	getRefresher: function() {

		return this._refresher;

	},

	/**
	 * Scope has created a new instance of Enumerable.
	 * Now all UIDs belong to the old enumerable, so must get rid of all templates
	 */
	_onEnumerableChanged: function() {

		var i = 0,
			removed_templates = [];

		for (; i < this._current_count; i++) {

			removed_templates.push(this._current_hash[this._current_uids[i]]);

		}

		removed_templates.length && this._removeTemplates(removed_templates);

		this._current_count = 0;
		this._current_hash = {};
		this._current_uids = [];
		this._current_templates = [];
		this.set('count', 0);

	},

	/**
	 * Callback that removes templates for removed Enumerable items.
	 * Version without Refresher support.
	 * @param {Array.<Lava.system.Template>} removed_templates
	 */
	_removeTemplates: function(removed_templates) {

		for (var i = 0, removed_count = removed_templates.length; i < removed_count; i++) {

			removed_templates[i].destroy();

		}

	},

	/**
	 * Callback that removes templates for removed Enumerable items.
	 * Version with Refresher support.
	 * @param {Array.<Lava.system.Template>} removed_templates
	 */
	_removeTemplates_Refresher: function(removed_templates) {

		this._refresher.prepareRemoval(removed_templates);

	},

	/**
	 * Remove old templates, create new
	 */
	_refreshChildren: function() {

		var data_source = this._foreach_scope.getValue(),
			new_uids = data_source.getUIDs(),
			new_uid_to_index_map = data_source.getUIDToIndexMap(),
			count = data_source.getCount(),
			i = 0,
			uid,
			template,
			removed_templates = [],
			child_properties,
			current_templates = [];

		for (; i < this._current_count; i++) {

			uid = this._current_uids[i];

			if (!(uid in new_uid_to_index_map)) {

				removed_templates.push(this._current_hash[uid]);
				delete this._current_hash[uid];

			}

		}

		for (i = 0; i < count; i++) {

			uid = new_uids[i];

			child_properties = {
				foreach_index: i,
				foreach_name: data_source.getNameAt(new_uid_to_index_map[uid])
			};
			child_properties[this._as] = data_source.getValueAt(new_uid_to_index_map[uid]);

			if (uid in this._current_hash) {

				template = this._current_hash[uid];
				template.batchSetProperties(child_properties);

			} else {

				template = new Lava.system.Template(this._config.template, this._widget, this, child_properties);
				this._current_hash[uid] = template;

			}

			current_templates.push(template);

		}

		removed_templates.length && this._removeTemplates(removed_templates);

		this._current_count = count;
		this._current_uids = new_uids;
		this._current_templates = current_templates;
		this._requires_refresh_children = false;

	},

	/**
	 * Callback for {@link Lava.scope.Foreach#event:changed} event
	 */
	_onDataSourceChanged: function() {

		this.set('count', this._foreach_scope.getValue().getCount());
		this._requires_refresh_children = true;
		this.trySetDirty();

	},

	/**
	 * Animation has ended and refresher has removed the `template` from DOM
	 * @param {Lava.view.refresher.Standard} refresher
	 * @param {Lava.system.Template} template
	 */
	_onRemovalComplete: function(refresher, template) {

		template.destroy();

	},

	_renderContent: function() {

		if (Lava.schema.DEBUG && (this._argument.isWaitingRefresh() || this._foreach_scope.isWaitingRefresh())) Lava.t("Rendering a view in dirty state");

		var buffer = '',
			i = 0;

		this._requires_refresh_children && this._refreshChildren();

		for (; i < this._current_count; i++) {

			buffer += this._current_templates[i].render();

		}

		return buffer;

	},

	/**
	 * Version of `_renderContent` for usage with refresher instance
	 * @returns {string}
	 */
	_renderContent_Refresher: function() {

		if (Lava.schema.DEBUG && (this._argument.isWaitingRefresh() || this._foreach_scope.isWaitingRefresh())) Lava.t("Rendering a view in dirty state");
		this._requires_refresh_children && this._refreshChildren();
		return this._refresher.render(this._current_templates);

	},

	_refresh: function() {

		this._requires_refresh_children && this._refreshChildren();
		this._container.setHTML(this._renderContent());
		this._broadcastToChildren('broadcastInDOM');

	},

	/**
	 * Version of `_refresh` for usage with created refresher instance
	 */
	_refresh_Refresher: function() {

		this._requires_refresh_children && this._refreshChildren();
		this._refresher.refresh(this._current_templates);

	},

	_broadcastToChildren: function(function_name) {

		for (var name in this._current_hash) {

			this._current_hash[name][function_name]();

		}

	},

	/**
	 * Version of _broadcastToChildren for usage with created refresher instance
	 * @param {string} function_name
	 */
	_broadcastToChildren_Refresher: function(function_name) {

		this._refresher[function_name]();

	},

	/**
	 * Get `_foreach_scope`. Can be used to sort and filter items.
	 * @returns {Lava.scope.Foreach}
	 */
	getScope: function() {

		return this._foreach_scope;

	},

	destroy: function() {

		var name;

		this._refresher && this._refresher.destroy();

		for (name in this._current_hash) {

			this._current_hash[name].destroy();

		}

		this._foreach_scope.destroy();
		this._argument.destroy();

		this.Abstract$destroy();

		// to speed up garbage collection and break this object forever (destroyed objects must not be used!)
		this._refresher = this._current_templates = this._current_hash = this._foreach_scope = this._argument = null;

	}

});

Lava.define(
'Lava.view.If',
/**
 * Display content depending on condition
 *
 * @lends Lava.view.If#
 * @extends Lava.view.Abstract
 * @implements _iViewHierarchyMember
 */
{

	Extends: 'Lava.view.Abstract',

	/**
	 * One argument for each if/elseif section
	 * @type {Array.<Lava.scope.Argument>}
	 */
	_arguments: [],
	/**
	 * For each argument: it's {@link Lava.scope.Argument#event:changed} listener
	 * @type {Array.<_tListener>}
	 */
	_argument_changed_listeners: [],
	/**
	 * Total number of if/elseif sections
	 * @type {number}
	 */
	_count_arguments: 0,
	/**
	 * Currently active if/elseif section id
	 * @type {number}
	 */
	_active_argument_index: -1,
	/**
	 * Content of each if/elseif section
	 * @type {Array.<Lava.system.Template>}
	 */
	_content: [],
	/**
	 * Template to display when all if/elseif conditions are <kw>false</kw>
	 * @type {Lava.system.Template}
	 */
	_else_content: null,

	/**
	 * Refreshers animate insertion and removal of templates.
	 * They can also insert and remove templates independently of each other
	 * @type {(Lava.view.refresher.Standard)}
	 */
	_refresher: null,
	/**
	 * Currently active Template instance, including the 'else' template
	 * @type {Lava.system.Template}
	 */
	_active_template: null,

	_postInit: function() {

		if (Lava.schema.DEBUG && !('argument' in this._config)) Lava.t("If view requires an argument");

		var i = 0,
			count,
			argument = new Lava.scope.Argument(this._config.argument, this, this._widget);

		this._argument_changed_listeners.push(argument.on('changed', this._onArgumentChanged, this));
		this._arguments.push(argument);

		if ('elseif_arguments' in this._config) {

			for (count = this._config.elseif_arguments.length; i < count; i++) {

				argument = new Lava.scope.Argument(this._config.elseif_arguments[i], this, this._widget);
				this._argument_changed_listeners.push(argument.on('changed', this._onArgumentChanged, this));
				this._arguments.push(argument);

			}

		}

		this._count_arguments = this._arguments.length;
		this._refreshActiveArgumentIndex();

		if (this._config.refresher) {
			this.createRefresher(this._config.refresher);
		}

	},

	/**
	 * Can be called during roles registration (at the time of `init()`), before children are created.
	 * Initializes a refresher instance with custom config.
	 *
	 * @param {_cRefresher} refresher_config
	 */
	createRefresher: function(refresher_config) {

		if (Lava.schema.DEBUG && (this._refresher || this._current_count)) Lava.t("If: refresher is already created or createRefresher() was called outside of init()");
		if (Lava.schema.DEBUG && !this._container) Lava.t('View/If: refresher needs container to work');

		var constructor = Lava.ClassManager.getConstructor(refresher_config['type'], 'Lava.view.refresher');
		this._refresher = /** @type {Lava.view.refresher.Standard} */ new constructor(refresher_config, this, this._container);

		this._refresher.on('removal_complete', this._onRemovalComplete, this);
		this._refresh = this._refresh_Refresher;
		this._removeTemplate = this._removeTemplate_Refresher;
		this._renderContent = this._renderContent_Refresher;
		this._broadcastToChildren = this._broadcastToChildren_Refresher;

	},

	/**
	 * Animation has ended and template was removed from DOM. Destroy it.
	 * @param {Lava.view.refresher.Standard} refresher
	 * @param {Lava.system.Template} template
	 */
	_onRemovalComplete: function(refresher, template) {

		this._destroyTemplate(template);

	},

	/**
	 * Get `_refresher`
	 * @returns {Lava.view.refresher.Standard}
	 */
	getRefresher: function() {

		return this._refresher;

	},

	/**
	 * Get index of the first argument which evaluates to <kw>true</kw>
	 * @returns {?number} Zero-based argument index, or <kw>null</kw>, if all arguments evaluate to <kw>false</kw>
	 */
	_refreshActiveArgumentIndex: function() {

		this._active_argument_index = -1;

		for (var i = 0; i < this._count_arguments; i++) {

			if (!!this._arguments[i].getValue()) {

				this._active_argument_index = i;
				break;

			}

		}

	},

	/**
	 * Get template that corresponds to argument that evaluates to <kw>true</kw>
	 * (or 'else' template, if there are no active arguments)
	 * @returns {?Lava.system.Template}
	 */
	_getActiveTemplate: function() {

		var result = null,
			index = this._active_argument_index;

		if (index != -1) {

			if (!this._content[index]) {

				this._content[index] = (index == 0)
					? new Lava.system.Template(this._config.template || [], this._widget, this, {if_index: index})
					: new Lava.system.Template(this._config.elseif_templates[index - 1] || [], this._widget, this, {if_index: index});

			}

			result = this._content[index];

		} else if ('else_template' in this._config) {

			if (this._else_content == null) {

				this._else_content = new Lava.system.Template(this._config.else_template || [], this._widget, this);

			}

			result = this._else_content;

		}

		return result;

	},

	/**
	 * Listener for argument's {@link Lava.scope.Argument#event:changed} event
	 */
	_onArgumentChanged: function() {

		var old_active_argument_index = this._active_argument_index;
		this._refreshActiveArgumentIndex();

		if (this._active_argument_index != old_active_argument_index) {

			if (this._active_template && this._is_inDOM) {

				this._removeTemplate(this._active_template);

			}

			this.trySetDirty();
			this._active_template = null;

		}

	},

	/**
	 * Branches that are not in DOM are destroyed
	 * @param {Lava.system.Template} template
	 */
	_destroyTemplate: function(template) {

		var index = this._content.indexOf(template);

		if (index == -1) {
			if (Lava.schema.DEBUG && template != this._else_content) Lava.t();
			this._else_content = null;
		} else {
			this._content[index] = null;
		}

		template.destroy();

	},

	/**
	 * Destroys branches, that are removed from DOM
	 * @param {Lava.system.Template} template
	 */
	_removeTemplate: function(template) {

		this._destroyTemplate(template);

	},

	/**
	 * Removes branches from DOM using a refresher instance
	 * @param {Lava.system.Template} template
	 */
	_removeTemplate_Refresher: function(template) {

		this._refresher.prepareRemoval([template]);

	},

	/**
	 * Render the currently active if/elseif section
	 * @returns {string}
	 */
	_renderContent: function() {

		if (Lava.schema.DEBUG) {

			for (var i = 0; i < this._count_arguments; i++) {

				this._arguments[i].isWaitingRefresh() && Lava.t("Rendering a view in dirty state");

			}

		}

		this._active_template = this._getActiveTemplate();
		return this._active_template ? this._active_template.render() : '';

	},

	/**
	 * Version of `_renderContent` which uses created refresher instance
	 * @returns {string}
	 */
	_renderContent_Refresher: function() {

		if (Lava.schema.DEBUG && this._active_argument_index != -1 && this._arguments[this._active_argument_index].isWaitingRefresh()) Lava.t();
		this._active_template = this._getActiveTemplate();
		return this._refresher.render(this._active_template ? [this._active_template] : []);

	},

	/**
	 * Broadcast to currently active if/elseif template
	 * @param {string} function_name
	 */
	_broadcastToChildren: function(function_name) {

		this._active_template && this._active_template[function_name]();

	},

	/**
	 * Version of `_broadcastToChildren` for use with refresher instance
	 * @param {string} function_name
	 */
	_broadcastToChildren_Refresher: function(function_name) {

		this._refresher[function_name]();

	},

	_refresh: function() {

		this._container.setHTML(this._renderContent());
		this._broadcastToChildren('broadcastInDOM');

	},

	/**
	 * Version of `_refresh` for use with refresher instance
	 */
	_refresh_Refresher: function() {

		if (!this._active_template) {
			this._active_template = this._getActiveTemplate();
		}
		this._refresher.refresh(this._active_template ? [this._active_template] : []);

	},

	destroy: function() {

		var i = 0;

		this._refresher && this._refresher.destroy();

		for (; i < this._count_arguments; i++) {

			this._arguments[i].destroy();
			this._content[i] && this._content[i].destroy();

		}

		this._else_content && this._else_content.destroy();

		// to speed up garbage collection and break this object forever (destroyed objects must not be used!)
		this._refresher = this._content = this._else_content = this._arguments = this._active_template
			= this._argument_changed_listeners = null;

		this.Abstract$destroy();

	}

});
Lava.define(
'Lava.view.Include',
/**
 * View, that displays a template, returned by an argument
 *
 * @lends Lava.view.Include#
 * @extends Lava.view.Abstract
 * @implements _iViewHierarchyMember
 */
{

	Extends: 'Lava.view.Abstract',
	/**
	 * Argument that returns a template config
	 * @type {Lava.scope.Argument}
	 */
	_argument: null,
	/**
	 * Listener for {@link Lava.scope.Argument#event:changed}
	 * @type {_tListener}
	 */
	_argument_changed_listener: null,
	/**
	 * Child template
	 * @type {Lava.system.Template}
	 */
	_content: null,

	_postInit: function() {

		if (Lava.schema.DEBUG && !('argument' in this._config)) Lava.t("Include view requires an argument");
		this._argument = new Lava.scope.Argument(this._config.argument, this, this._widget);
		this._argument_changed_listener = this._argument.on('changed', this._onValueChanged, this);

	},

	/**
	 * Argument's value has changed. Old content in not valid.
	 */
	_onValueChanged: function() {

		this._content && this._content.destroy();
		this._content = null;
		this.trySetDirty();

	},

	render: function() {

		if (Lava.schema.DEBUG && this._argument.isWaitingRefresh()) Lava.t("Rendering a view in dirty state");

		var result;

		if (this._container) {

			result = this._container.wrap(this._renderContent());

		} else {

			result = this._renderContent();

		}

		return result;

	},

	_renderContent: function() {

		return this._getContent().render();

	},

	_refresh: function() {

		this._container.setHTML(this._renderContent());
		this._broadcastToChildren('broadcastInDOM');

	},

	/**
	 * @param {string} function_name
	 */
	_broadcastToChildren: function(function_name) {

		if (this._content != null) {

			this._content[function_name]();

		}

	},

	/**
	 * Get `_content`. Create, if needed
	 * @returns {Lava.system.Template}
	 */
	_getContent: function() {

		if (this._content == null) {

			var argument_value = this._argument.getValue();
			if (Lava.schema.DEBUG && argument_value && !Array.isArray(argument_value)) Lava.t("Include view expects to receive a template from it's argument");

			this._content = new Lava.system.Template(
				this._argument.getValue() || this._config.template || [],
				this._widget,
				this
			)

		}

		return this._content;

	},

	destroy: function() {

		this._content && this._content.destroy();
		this._argument.destroy();
		this._argument_changed_listener
			= this._argument
			= this._content
			= null;

		this.Abstract$destroy();

	}

});

Lava.define(
'Lava.widget.Standard',
/**
 * Base class for all widgets
 * @lends Lava.widget.Standard#
 * @extends Lava.view.View#
 * @implements _iViewHierarchyMember
 */
{

	Extends: 'Lava.view.View',
	Shared: ['_property_descriptors', '_event_handlers', '_role_handlers', '_include_handlers', '_modifiers'],

	/**
	 * Instance is widget
	 * @type {boolean}
	 * @const
	 */
	isWidget: true,
	/**
	 * Widget's name for referencing from templates. Each kind of widget should have it's own unique name
	 * @readonly
	 */
	name: 'widget',

	/**
	 * Rules for accessing widget's properties
	 * @type {Object.<string, _cPropertyDescriptor>}
	 */
	_property_descriptors: {},

	/**
	 * List of non-default template events, to which this widget responds
	 * @type {Array.<string>}
	 */
	_acquired_events: [],
	/**
	 * Map of template event handlers
	 * @type {Object.<string, string>}
	 */
	_event_handlers: {},
	/**
	 * Map of template role handlers
	 * @type {Object.<string, string>}
	 */
	_role_handlers: {},
	/**
	 * Map of template include handlers
	 * @type {Object.<string, string>}
	 */
	_include_handlers: {},

	/**
	 * Two-way bindings to properties of this widget
	 * @type {Object.<string, Lava.scope.Binding>}
	 */
	_bindings: {},
	/**
	 * Resources from widget config
	 * @type {Object}
	 */
	_resources: {},
	/**
	 * Nearest parent widget in hierarchy
	 * @type {?Lava.widget.Standard}
	 */
	_parent_widget: null,

	/**
	 * Map of template callbacks. Called in context of the widget
	 * @type {Object.<string, string>}
	 */
	_modifiers: {
		translate: 'translate',
		ntranslate: 'ntranslate'
	},

	/**
	 * Create widget instance
	 * @param {_cWidget} config
	 * @param {Lava.widget.Standard} widget
	 * @param {Lava.view.Abstract} parent_view
	 * @param {Lava.system.Template} template
	 * @param {Object} properties
	 */
	init: function(config, widget, parent_view, template, properties) {

		var name,
			count,
			i;

		if (Lava.schema.DEBUG && !config.is_extended) Lava.t("Widget was created with partial (unextended) config");

		if (Lava.schema.DEBUG) {
			for (name in this._property_descriptors) {
				if (!(name in this._properties)) Lava.t("All widget properties must have a default value");
			}
			if (config.default_events) {
				for (i = 0, count = config.default_events.length; i < count; i++) {
					if (!Lava.view_manager.isEventRouted(config.default_events[i])) Lava.t('Event is not routed: ' + config.default_events[i]);
				}
			}
		}

		this._parent_widget = widget;

		this.View$init(config, this, parent_view, template, properties);

		for (name in config.bindings) {

			this._bindings[name] = new Lava.scope.Binding(config.bindings[name], this);

		}

	},

	_initMembers: function(properties) {

		this.View$_initMembers(properties);

		for (var name in this._config.properties) {

			this.set(name, this._config.properties[name]);

		}

		if (Lava.schema.RESOURCES_ENABLED) {

			this._initResources(this._config);

		}

	},

	/**
	 * Get, merge and prepare resources for this widget
	 * @param {_cWidget} config
	 */
	_initResources: function(config) {

		var locale = Lava.schema.LOCALE,
			resource_owner,
			component_resource,
			resources;

		if ('resources_cache' in config) {

			resources = config.resources_cache[locale];

		}

		if ('resource_id' in config) {

			resource_owner = this['locateViewBy' + config.resource_id.locator_type](config.resource_id.locator);
			if (Lava.schema.DEBUG && (!resource_owner || !resource_owner.isWidget))
				Lava.t("Resource root not found: " + config.resource_id.locator_type + '=' + config.resource_id.locator);
			component_resource = resource_owner.getResource(config.resource_id.name, Lava.schema.LOCALE);

			if (component_resource) {

				if (Lava.schema.DEBUG && component_resource.type != 'component') Lava.t("resource value is not a component");

				resources = resources
					? Lava.resources.mergeResources(component_resource.value, resources)
					: component_resource.value;

			}

		}

		if (resources) {
			this._resources[locale] = resources;
			Lava.resources.mergeRootContainerStacks(resources);
		}

	},

	/**
	 * Get view's include
	 * @param {string} name Include name
	 * @param {Array} template_arguments Evaluated argument values from view's template
	 * @returns {?_tTemplate}
	 */
	getInclude: function(name, template_arguments) {

		var result = null;

		if (name in this._include_handlers) {

			result = this[this._include_handlers[name]](template_arguments);

		} else {

			result = this._config.includes[name];

		}

		return result;

	},

	/**
	 * Respond to DOM event, routed by {@link Lava.system.ViewManager}
	 * @param {string} dom_event_name
	 * @param dom_event Browser event object, wrapped by the framework
	 * @param {string} target_name Template event name
	 * @param {Lava.view.Abstract} view View, that is the source for this event
	 * @param {Array.<*>} template_arguments Evaluated argument values from view's template
	 * @returns {boolean} <kw>true</kw>, if event was handled, and <kw>false</kw> otherwise
	 */
	handleEvent: function(dom_event_name, dom_event, target_name, view, template_arguments) {

		var result = false;

		if (target_name in this._event_handlers) {

			this[this._event_handlers[target_name]](dom_event_name, dom_event, view, template_arguments);
			result = true;

		}

		return result;

	},

	/**
	 * Render and insert the widget instance into DOM
	 * @param {HTMLElement} element
	 * @param {_eInsertPosition} position
	 */
	inject: function(element, position) {

		if (this._is_inDOM) Lava.t("inject: widget is already in DOM");
		if (Lava.schema.DEBUG && this._parent_view) Lava.t("Widget: only top-level widgets can be inserted into DOM");
		if (Lava.schema.DEBUG && !this._container) Lava.t("Widget: root widgets must have a container");

		// Otherwise, if you assign data to a widget, that was removed from DOM,
		// and then render it - it will render with old data.
		Lava.ScopeManager.refresh();

		// lock, cause render operation can change data. Although it's not recommended to change data in render().
		Lava.ScopeManager.lock();
		Firestorm.DOM.insertHTML(element, this.render(), position || 'Top');
		Lava.ScopeManager.unlock();
		this.broadcastInDOM();

	},

	/**
	 * The target element becomes container for this widget.
	 * Primary usage: inject a widget into the &lt;body&gt; element
	 * @param element
	 */
	injectIntoExistingElement: function(element) {

		if (this._is_inDOM) Lava.t("inject: widget is already in DOM");
		if (Lava.schema.DEBUG && this._parent_view) Lava.t("Widget: only top-level widgets can be inserted into DOM");
		if (Lava.schema.DEBUG && !this._container) Lava.t("Widget: root widgets must have a container");
		if (Lava.schema.DEBUG && !this._container.isElementContainer) Lava.t("injectIntoExistingElement expects an element containers");

		Lava.ScopeManager.refresh();

		Lava.ScopeManager.lock();
		this._container.captureExistingElement(element);
		this._container.setHTML(this._renderContent());
		Lava.ScopeManager.unlock();

		// rewritten broadcastInDOM - without this._container.informInDOM()
		this._is_inDOM = true;
		this._is_dirty = false;
		this._broadcastToChildren('broadcastInDOM');

	},

	/**
	 * Remove widget from DOM. Only `inject()`'ed (root) widgets may be removed this way
	 */
	remove: function() {

		if (!this._is_inDOM) Lava.t("remove: widget is not in DOM");
		if (Lava.schema.DEBUG && !this._container) Lava.t("remove: widget doesn't have a container");

		this._is_inDOM = false;
		this._is_dirty = false;
		this._broadcastToChildren('broadcastRemove');

		if (this._container.isElementContainer && !this._container.isElementOwner()) {

			this._container.releaseElement();

		} else {

			this._container.remove()

		}

	},

	/**
	 * Call a template method
	 * @param {string} name Modifier name
	 * @param {Array} arguments_array Evaluated template arguments
	 * @returns {*}
	 */
	callModifier: function(name, arguments_array) {

		if (Lava.schema.DEBUG && !(name in this._modifiers)) Lava.t("Unknown widget modifier: " + name);

		return this[this._modifiers[name]].apply(this, arguments_array);

	},

	/**
	 * Deprecated
	 * @param {string} name
	 * @param {Array} arguments_array
	 * @returns {*}
	 */
	callActiveModifier: function(name, arguments_array) {

		Lava.t("Alpha version. This functionality may be removed later.");

	},

	/**
	 * Get `_parent_widget`
	 * @returns {Lava.widget.Standard}
	 */
	getParentWidget: function() {

		return this._parent_widget;

	},

	/**
	 * Handle a view with a role in this widget
	 * @param {string} role Role name
	 * @param {Lava.view.Abstract} view
	 * @param {Array.<*>} template_arguments
	 * @returns {boolean} <kw>true</kw>, if the role was handled, and <kw>false</kw> otherwise
	 */
	handleRole: function(role, view, template_arguments) {

		var result = false;

		if (role in this._role_handlers) {

			this[this._role_handlers[role]](view, template_arguments);
			result = true;

		}

		return result;

	},

	set: function(name, value) {

		var descriptor;

		if (name in this._property_descriptors) {

			descriptor = this._property_descriptors[name];

			if (Lava.schema.DEBUG && descriptor.is_readonly) Lava.t("Trying to set readonly property: " + name);

			if (Lava.schema.widget.VALIDATE_PROPERTY_TYPES) {

				if (value === null) {

					if (!descriptor.is_nullable) Lava.t("Trying to assign NULL to non-nullable property");

				} else if (descriptor.type && !Lava.types[descriptor.type].isValidValue(value, descriptor)) {

					Lava.t("Assigned value does not match the property type: " + descriptor.type);

				}

			}

		}

		if (this._properties[name] !== value) {

			if (descriptor && descriptor.setter) {

				// you are forced to make setters private, cause type-checking will not work if setter is called directly.
				if (Lava.schema.DEBUG && descriptor.setter[0] != '_') Lava.t("Widget property setters must not be public: " + descriptor.setter);
				this[descriptor.setter](value, name);

			} else {

				this._set(name, value);

			}

		}

	},

	get: function(name) {

		return ((name in this._property_descriptors) && this._property_descriptors[name].getter)
			? this[this._property_descriptors[name].getter](name)
			: this.View$get(name);

	},

	/**
	 * Get constructor of a class, which is part of this widget
	 * @param {string} path Path suffix
	 * @returns {Function} Class constructor
	 */
	getPackageConstructor: function(path) {

		return Lava.ClassManager.getPackageConstructor(this.Class.path, path);

	},

	/**
	 * Get a resource object by it's name
	 * @param {string} resource_name
	 * @param {string} locale
	 * @returns {*}
	 */
	getResource: function(resource_name, locale) {

		locale = locale || Lava.schema.LOCALE;

		return ((locale in this._resources) && (resource_name in this._resources[locale]))
			? this._resources[locale][resource_name]
			: null;

	},

	/**
	 * Get a scope instance
	 * @param {Lava.view.Abstract} view
	 * @param {_cDynamicScope} config
	 */
	getDynamicScope: function(view, config) {

		Lava.t('Not implemented: getDynamicScope');

	},

	/**
	 * (modifier) Translate a string from resources. If `arguments_list` is present - then also replaces
	 * `{&lt;number&gt;}` sequences with corresponding value from array.
	 * @param {string} resource_name
	 * @param {Array} arguments_list
	 * @param {string} locale
	 * @returns {string}
	 */
	translate: function(resource_name, arguments_list, locale) {

		var string_descriptor = /** @type {_cTranslatableString} */ this.getResource(resource_name, locale || Lava.schema.LOCALE),
			result;

		if (string_descriptor) {

			if (Lava.schema.DEBUG && string_descriptor.type != 'string') Lava.t("[translate] resource is not a string: " + resource_name);

			if (arguments_list) {

				result = string_descriptor.value.replace(/\{(\d+)\}/g, function(dummy, index) {
					return arguments_list[index] || '';
				});

			} else {

				result = string_descriptor.value;

			}

		} else {

			result = '';
			Lava.logError("Resource string not found: " + resource_name);

		}

		return result;

	},

	/**
	 * (modifier) Translate a plural string from resources. If `arguments_list` is present - then also replaces
	 * `{&lt;number&gt;}` sequences with corresponding value from array.
	 * @param {string} string_name
	 * @param {number} n
	 * @param {Array} arguments_list
	 * @param {string} locale
	 * @returns {string}
	 */
	ntranslate: function(string_name, n, arguments_list, locale) {

		var string_descriptor = /** @type {_cTranslatablePlural} */ this.getResource(string_name, locale || Lava.schema.LOCALE),
			form_index = Lava.locales[Lava.schema.LOCALE].pluralize(n || 0),
			pluralform,
			result;

		if (string_descriptor) {

			if (Lava.schema.DEBUG && string_descriptor.type != 'plural_string') Lava.t("[ntranslate] resource is not a plural_string: " + string_name);
			pluralform = string_descriptor.value[form_index];
			if (Lava.schema.DEBUG && pluralform == null) Lava.t("[ntranslate] requested plural string is missing one of it's plural forms:" + string_name);

			if (arguments_list) {

				result = pluralform.replace(/\{(\d+)\}/g, function(dummy, index) {
					return arguments_list[index] || '';
				});

			} else {

				result = pluralform;

			}

		} else {

			result = '';
			Lava.logError("Resource string not found: " + string_name);

		}

		return result;

	},

	destroy: function() {

		var name;

		for (name in this._bindings) {

			this._bindings[name].destroy();

		}

		this._bindings = this._resources = null;

		this.View$destroy();

	}

});
