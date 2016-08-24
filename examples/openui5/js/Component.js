/* global sap */

sap.ui.define([
	'sap/ui/core/UIComponent'
], function (UIComponent) {
	'use strict';

	return UIComponent.extend('ToDoMVC.Component', {

		metadata: {
			manifest: 'json'
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function () {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// create the views based on the url/hash
			this.getRouter().initialize();
		}

	});

});
