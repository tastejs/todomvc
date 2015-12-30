/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides base class for controllers (part of MVC concept)
sap.ui.define(['jquery.sap.global', 'sap/ui/base/EventProvider', 'sap/ui/base/ManagedObject'],
	function(jQuery, EventProvider, ManagedObject) {
	"use strict";



		var mRegistry = {};

		/**
		 * Instantiates a (MVC-style) Controller. Consumers should call the constructor only in the
		 * typed controller scenario. In the generic controller use case, they should use
		 * {@link sap.ui.controller} instead.
		 *
		 * @class A generic controller implementation for the UI5 Model View controller concept.
		 *
		 * Can either be used as a generic controller which is enriched on the fly with methods
		 * and properties (see {@link sap.ui.controller}) or  as a base class for typed controllers.
		 *
		 * @param {string|object[]} sName The name of the Controller to instantiate. If a Controller is defined as real sub-class,
		 *                                   the "arguments" of the sub-class constructor should be given instead.
		 * @public
		 * @alias sap.ui.core.mvc.Controller
		 */
		var Controller = EventProvider.extend("sap.ui.core.mvc.Controller", /** @lends sap.ui.core.mvc.Controller.prototype */ {

			constructor : function(sName) {
				var oToExtend = null;
				if (typeof (sName) == "string") {
					/* TODO the whole if block is unnecessary, if constructor is really private (as documented) */
					if (!mRegistry[sName]) {
						jQuery.sap.require({modName: sName, type: "controller"}); // maybe there is a controller definition, but it has not been loaded yet -> try to load

						if (!mRegistry[sName]) {
							throw new Error("Controller type " + sName + " is still undefined after trying to load it.");
						}
					}
					oToExtend = mRegistry[sName];
				}

				EventProvider.apply(this,arguments);

				if (oToExtend) {
					jQuery.extend(this, mRegistry[sName]);
				}

			}

		});

		// define call order of lifecycle methods for extensions
		// "true" means original before, "false" means original afterwards
		var mControllerLifecycleMethods = {
			"onInit": true,
			"onExit": false,
			"onBeforeRendering": false,
			"onAfterRendering": true
		};

		function extendIfRequired(oController, sName) {
			var oCustomControllerDef;

			var CustomizingConfiguration = sap.ui.require('sap/ui/core/CustomizingConfiguration');
			if (CustomizingConfiguration) {
				var controllerExtensionConfig = CustomizingConfiguration.getControllerExtension(sName, ManagedObject._sOwnerId);
				if (controllerExtensionConfig) {
					var sExtControllerName = controllerExtensionConfig.controllerName;
					
					// create a list of controller names which will be used to extend this controller 
					var aControllerNames = controllerExtensionConfig.controllerNames || [];
					if (sExtControllerName) {
						sExtControllerName && aControllerNames.unshift(sExtControllerName);
					}
					
					for (var i = 0, l = aControllerNames.length; i < l; i++) {
						var sControllerName = aControllerNames[i];
						
						// avoid null values for controllers to be handled here!
						if (typeof sControllerName === "string") {
							
							jQuery.sap.log.info("Customizing: Controller '" + sName + "' is now extended by '" + sControllerName + "'");

							// load controller definition if required; first check whether already available...
							if ( !mRegistry[sControllerName] && !jQuery.sap.getObject(sControllerName) ) {
								// ...if not, try to load an external controller definition module
								jQuery.sap.require({modName: sControllerName, type: "controller"});
							}
							if ( !mRegistry[sControllerName] && !jQuery.sap.getObject(sControllerName) ) {
								// still not defined? this means there was not the correct controller in the file
								jQuery.sap.log.error("Attempt to load Extension Controller " + sControllerName + " was not successful - is the Controller correctly defined in its file?");
							}

							if ((oCustomControllerDef = mRegistry[sControllerName]) !== undefined) { //variable init, not comparison!
								/*eslint-disable no-loop-func */
								for (var memberName in oCustomControllerDef) { // TODO: check whether it is a function? This does not happen until now, so rather not.

									if (mControllerLifecycleMethods[memberName] !== undefined) {
										// special handling for lifecycle methods
										var fnOri = oController[memberName];
										if (fnOri && typeof fnOri === "function") {
											// use closure to keep correct values inside overridden function
											(function(fnCust, fnOri, bOriBefore){
												oController[memberName] = function() {
													// call original function before or after the custom one
													// depending on the lifecycle method (see mControllerLifecycleMethods object above)
													if (bOriBefore) {
														fnOri.apply(oController, arguments);
														fnCust.apply(oController, arguments);
													} else {
														fnCust.apply(oController, arguments);
														fnOri.apply(oController, arguments);
													}
												};
											})(oCustomControllerDef[memberName], fnOri, mControllerLifecycleMethods[memberName]);
										} else {
											oController[memberName] = oCustomControllerDef[memberName];
										}

									} else {
										// other methods just override the original implementation
										oController[memberName] = oCustomControllerDef[memberName];
									}
								}
								/*eslint-enable no-loop-func */
							}// else {
								// FIXME: what to do for typed controllers?
							//}
						
						}
						
					}

				} else {
					jQuery.sap.log.debug("Customizing: no Controller extension found for Controller '" + sName + "'.");
				}
			}
			return oController;
		}

		/**
		 * Defines a controller class or creates an instance of an already defined controller class.
		 *
		 * When a name and a controller implementation object is given, a new controller class
		 * of the given name is created. The members of the implementation object will be copied
		 * into each new instance of that controller class (shallow copy).
		 * <b>Note</b>: as the members are shallow copied, controller instances will share all object values.
		 * This might or might not be what applications expect.
		 *
		 * If only a name is given, a new instance of the named Controller class is returned.
		 *
		 * @param {string} sName The Controller name
		 * @param {object} [oControllerImpl] An object literal defining the methods and properties of the Controller
		 * @return {void | sap.ui.core.mvc.Controller} void or the new controller instance, depending on the use case
		 * @public
		 */
		sap.ui.controller = function(sName, oControllerImpl) {
			if (!sName) {
				throw new Error("Controller name ('sName' parameter) is required");
			}

			if (!oControllerImpl) {
				// controller *instantiation*

				// check if controller is available, either anonymous or typed
				if ( !mRegistry[sName] && !jQuery.sap.getObject(sName) ) {
					// if not, try to load an external controller definition module
					jQuery.sap.require({modName: sName, type: "controller"});
				}

				if ( mRegistry[sName] ) {
					// anonymous controller
					var oController = new Controller(sName);
					oController = extendIfRequired(oController, sName);
					return oController;

				} else {
					var CTypedController = jQuery.sap.getObject(sName);
					if ( typeof CTypedController === "function" && CTypedController.prototype instanceof Controller ) {
						// typed controller
						var oController = new CTypedController();
						oController = extendIfRequired(oController, sName);
						return oController;
					}
				}
				throw new Error("Controller " + sName + " couldn't be instantiated");

			} else {
				// controller *definition*
				mRegistry[sName] = oControllerImpl;
			}

		};

		/**
		 * Returns the view associated with this controller or undefined.
		 * @return {sap.ui.core.mvc.View} View connected to this controller.
		 * @public
		 */
		Controller.prototype.getView = function() {
			return this.oView;
		};

		/**
		 * Returns an Element of the connected view with the given local Id.
		 *
		 * Views automatically prepend their own id as a prefix to created Elements
		 * to make the ids unique even in the case of multiple view instances.
		 * This method helps to find an element by its local id only.
		 *
		 * If no view is connected or if the view doesn't contain an element with
		 * the given local id, undefined is returned.
		 *
		 * @param {string} sId The view-local id
		 * @return {sap.ui.core.Element} Element by its (view local) id
		 * @public
		 */
		Controller.prototype.byId = function(sId) {
			return this.oView ? this.oView.byId(sId) : undefined;
		};


		/**
		 * Converts a view local id to a globally unique one by prepending
		 * the view id.
		 *
		 * If no view is connected, undefined is returned.
		 *
		 * @param {string} sId The view-local id
		 * @return {string} The prefixed id
		 * @public
		 */
		Controller.prototype.createId = function(sId) {
			return this.oView ? this.oView.createId(sId) : undefined;
		};

		/**
		 * Gets the component of the Controllers view
		 *
		 * If there is no Component connected to the view or the view is not connected to the controller,
		 * undefined is returned.
		 *
		 * @return {sap.ui.core.Component} The Component instance
		 * @since 1.23.0
		 * @public
		 */
		Controller.prototype.getOwnerComponent = function () {
			jQuery.sap.require("sap.ui.core.Component");
			return sap.ui.core.Component.getOwnerComponentFor(this.getView());
		};


		Controller.prototype.connectToView = function(oView) {
			this.oView = oView;

			if (this.onInit) {
				oView.attachAfterInit(this.onInit, this);
			}
			if (this.onExit) {
				oView.attachBeforeExit(this.onExit, this);
			}
			if (this.onAfterRendering) {
				oView.attachAfterRendering(this.onAfterRendering, this);
			}
			if (this.onBeforeRendering) {
				oView.attachBeforeRendering(this.onBeforeRendering, this);
			}
			//oView.addDelegate(this);
		};



	return Controller;

});
