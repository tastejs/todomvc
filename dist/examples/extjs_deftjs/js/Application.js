'use strict';

/**
* DeftJS Application class for the TodoDeftJS application.
*/
Ext.define('TodoDeftJS.Application', {
	extend: 'Deft.mvc.Application',
	requires: ['TodoDeftJS.util.TemplateLoader', 'TodoDeftJS.store.TodoStore', 'TodoDeftJS.view.Viewport'],

	/**
	* init() runs when Ext.onReady() is called.
	*/
	init: function () {
		this.beforeInit();
		Deft.Injector.configure(this.buildInjectorConfiguration());
		return this.afterInit();
	},

	/**
	* @protected
	* Returns the configuration object to pass to Deft.Injector.configure(). Override in subclasses to alter the Injector configuration before returning the config object.
	* @return {Object} The Injector configuration object.
	*/
	buildInjectorConfiguration: function () {
		var config;
		config = {
			templateLoader: 'TodoDeftJS.util.TemplateLoader',
			todoStore: 'TodoDeftJS.store.TodoStore'
		};
		return config;
	},

	/**
	* @protected
	* Runs at the start of the init() method. Override in subclasses if needed.
	*/
	beforeInit: function () {},

	/**
	* @protected
	* Runs at the end of the init() method. Useful to create initial Viewport, start Jasmine tests, etc.
	*/
	afterInit: function () {
		Ext.tip.QuickTipManager.init();
		return Ext.create('TodoDeftJS.view.Viewport');
	}

});