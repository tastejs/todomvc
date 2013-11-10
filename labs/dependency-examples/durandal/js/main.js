/*global requirejs, define, ko */
(function () {
	'use strict';

	requirejs.config({
		paths: {
			'text': 'bower_components/requirejs-text/text',
			'jquery': 'bower_components/jquery/jquery',
			'durandal':'bower_components/durandal/js',
			'plugins' : 'bower_components/durandal/js/plugins',
			'transitions' : 'bower_components/durandal/js/transitions'
		},
		baseUrl: './'
	});

	define('knockout', ko);

	var ENTER_KEY = 13;
	var ESCAPE_KEY = 27;

	// a custom binding to handle the enter key (could go in a separate library)
	ko.bindingHandlers.enterKey = {
		init: function (element, valueAccessor, allBindingsAccessor, data) {
			var wrappedHandler, newValueAccessor;

			// wrap the handler with a check for the enter key
			wrappedHandler = function (data, event) {
				if (event.keyCode === ENTER_KEY) {
					valueAccessor().call(this, data, event);
				}
			};

			// create a valueAccessor with the options that we would want to pass to the event binding
			newValueAccessor = function () {
				return {
					keyup: wrappedHandler
				};
			};

			// call the real event binding's init function
			ko.bindingHandlers.event.init(element, newValueAccessor, allBindingsAccessor, data);
		}
	};

	// a custom binding to handle the enter key (could go in a separate library)
	ko.bindingHandlers.escKey = {
		init: function (element, valueAccessor, allBindingsAccessor, data) {
			var wrappedHandler, newValueAccessor;

			// wrap the handler with a check for the enter key
			wrappedHandler = function (data, event) {
				if (event.keyCode === ESCAPE_KEY) {
					valueAccessor().call(this, data, event);
				}
			};

			// create a valueAccessor with the options that we would want to pass to the event binding
			newValueAccessor = function () {
				return {
					keyup: wrappedHandler
				};
			};

			// call the real event binding's init function
			ko.bindingHandlers.event.init(element, newValueAccessor, allBindingsAccessor, data);
		}
	};

	// wrapper to hasfocus that also selects text and applies focus async
	ko.bindingHandlers.selectAndFocus = {
		init: function (element, valueAccessor, allBindingsAccessor) {
			ko.bindingHandlers.hasfocus.init(element, valueAccessor, allBindingsAccessor);
			ko.utils.registerEventHandler(element, 'focus', function () {
				element.focus();
			});
		},
		update: function (element, valueAccessor) {
				ko.utils.unwrapObservable(valueAccessor()); // for dependency
				// ensure that element is visible before trying to focus
				setTimeout(function () {
					ko.bindingHandlers.hasfocus.update(element, valueAccessor);
				}, 0);
			}
	};

	define(['durandal/app', 
		'durandal/viewLocator',
		'durandal/system',
		],
		function (app, viewLocator, system) {

		system.debug(true);

		// this ensures that the title is simply the caption provided on the route
		app.title = undefined;

		app.configurePlugins({
	        router:true,
	        dialog: true,
	        widget: true
	    });

		app.start().then(function () {
			viewLocator.useConvention();
			app.setRoot('js/viewmodels/shell');
		});
	});
}());