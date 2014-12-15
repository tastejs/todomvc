(function ($, kendo) {
	'use strict';

	var ENTER_KEY = 13;

	// Create a custom "enter" binding by extending the kendo.data.Binder
	// object with a custom init function that binds to the keyup event and,
	// if the enter key is pressed, will call a bound function.
	kendo.data.binders.enter = kendo.data.Binder.extend({
		init: function (widget, bindings, options) {
			// Call the "base" init method
			kendo.data.Binder.fn.init.call(this, widget, bindings, options);

			$(this.element).bind('keyup', function (e) {
				// If the keypressed is not the enter key, return
				if (e.which !== ENTER_KEY || !this.element.value.trim()) {
					return;
				}

				// Otherwise, call the function specified in the enter binding
				this.bindings['enter'].get();
			}.bind(this));
		},
		// The refresh function must be specified in a custom binding,
		// even when empty.
		refresh: function () {}
	});

	var ESCAPE_KEY = 27;

	// Create a custom "enter" binding by extending the kendo.data.Binder
	// object with a custom init function that binds to the keyup event and,
	// if the enter key is pressed, will call a bound function.
	kendo.data.binders.escape = kendo.data.Binder.extend({
		init: function (widget, bindings, options) {
			// Call the "base" init method
			kendo.data.Binder.fn.init.call(this, widget, bindings, options);

			$(this.element).bind('keyup', function (e) {
				// If the keypressed is not the escape key, return
				if (e.which !== ESCAPE_KEY) {
					return;
				}

				// Otherwise, call the function specified in the enter binding
				this.bindings['escape'].get();
			}.bind(this));
		},
		// The refresh function must be specified in a custom binding,
		// even when empty.
		refresh: function () {}
	});

})($, kendo);