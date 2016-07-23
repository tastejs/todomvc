/*!
 * CanJS - 2.0.7
 * http://canjs.us/
 * Copyright (c) 2014 Bitovi
 * Wed, 26 Mar 2014 16:12:27 GMT
 * Licensed MIT
 * Includes: CanJS default build
 * Download from: http://canjs.us/
 */
define(["can/util/library"], function (can) {
	/**
	 * @typedef {{bind:function():*,unbind:function():*}} can/util/bind
	 *
	 * Provides mixin-able bind and unbind methods. `bind()` calls `this._bindsetup`
	 * when the first bind happens and.  `unbind()` calls `this._bindteardown` when there
	 * are no more event handlers.
	 *
	 */
	// ## Bind helpers
	can.bindAndSetup = function () {
		// Add the event to this object
		can.addEvent.apply(this, arguments);
		// If not initializing, and the first binding
		// call bindsetup if the function exists.
		if (!this._init) {
			if (!this._bindings) {
				this._bindings = 1;
				// setup live-binding
				if (this._bindsetup) {
					this._bindsetup();
				}
			} else {
				this._bindings++;
			}
		}
		return this;
	};
	can.unbindAndTeardown = function (ev, handler) {
		// Remove the event handler
		can.removeEvent.apply(this, arguments);
		if (this._bindings === null) {
			this._bindings = 0;
		} else {
			this._bindings--;
		}
		// If there are no longer any bindings and
		// there is a bindteardown method, call it.
		if (!this._bindings && this._bindteardown) {
			this._bindteardown();
		}
		return this;
	};
	return can;
});