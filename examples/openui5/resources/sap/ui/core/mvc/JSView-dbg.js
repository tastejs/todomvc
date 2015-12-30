/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.core.mvc.JSView.
sap.ui.define(['jquery.sap.global', 'sap/ui/core/library', './View', 'sap/ui/base/ManagedObject'],
	function(jQuery, library, View, ManagedObject) {
	"use strict";



	/**
	 * Constructor for a new mvc/JSView.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * A View defined/constructed by JavaScript code.
	 * @extends sap.ui.core.mvc.View
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @alias sap.ui.core.mvc.JSView
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var JSView = View.extend("sap.ui.core.mvc.JSView", /** @lends sap.ui.core.mvc.JSView.prototype */ { metadata : {

		library : "sap.ui.core"
	}});

	(function(){
		var mRegistry = {};



		/**
		 * Flag for feature detection of asynchronous loading/rendering
		 * @public
		 * @since 1.30
		 */
		JSView.asyncSupport = true;

		/**
		 * Defines or creates an instance of a JavaScript view.
		 *
		 * The behavior of this method depends on the signature of the call and on the current context.
		 *
		 * <ul>
		 * <li>View Definition <code>sap.ui.jsview(sId, vView)</code>: Defines a view of the given name with the given
		 * implementation. sId must be the view's name, vView must be an object and can contain
		 * implementations for any of the hooks provided by JSView</li>
		 *
		 * <li>View Instantiation <code>sap.ui.jsview(sId?, vView)</code>: Creates an instance of the view with the given name (and id).
		 * If no view implementation has been defined for that view name, a JavaScript module with the same name and with suffix "view.js" will be loaded
		 * and executed. The module should contain a view definition (1st. variant above). </li>
		 * </ul>
		 *
		 * Any other call signature will lead to a runtime error. If the id is omitted in the second variant, an id will
		 * be created automatically.
		 *
		 * @param {string} [sId] id of the newly created view, only allowed for instance creation
		 * @param {string | object} vView name or implementation of the view.
		 * @param {boolean} [bAsync] defines how the view source is loaded and rendered later on (only relevant for instantiation, ignored for everything else)
		 * @public
		 * @static
		 * @return {sap.ui.core.mvc.JSView | undefined} the created JSView instance in the creation case, otherwise undefined
		 */
		sap.ui.jsview = function(sId, vView, bAsync) {
			var mSettings = {}, oView;

			if (vView && typeof (vView) == "string") { // instantiation sap.ui.jsview("id","name", [async])
				mSettings.viewName = vView;
				if (typeof arguments[2] == "boolean") {
					 mSettings.async = bAsync;
				} else if (typeof arguments[2] == "object") { // arguments[2] is somehow a controller
					mSettings.controller = arguments[2];
					mSettings.async = !!arguments[3]; // optional
				}
				oView = new JSView(sId, mSettings);
				return oView;

			} else if (vView && typeof (vView) == "object") { // definition sap.ui.jsview("name",definitionObject)
				// sId is not given, but contains the desired value of sViewName
				mRegistry[sId] = vView;
				jQuery.sap.declare({modName:sId,type:"view"}, false);

			} else if (arguments.length == 1 && typeof sId == "string" ||
				arguments.length == 2 && typeof arguments[0] == "string" && typeof arguments[1] == "boolean") { // instantiation sap.ui.jsview("name", [async])
				mSettings.viewName = arguments[0];
				mSettings.async = !!arguments[1]; // optional
				/*** STEP 1: create View ***/
				oView = mSettings.id ? new JSView(mSettings.id, mSettings) : new JSView(mSettings);
				/*** Step 3B and 4B (create and connect controller) happen in View ***/
				return oView;

			} else {
				throw new Error("Wrong arguments ('" + sId + "', '" + vView + "')! Either call sap.ui.jsview([sId,] sViewName) to instantiate a View or sap.ui.jsview(sViewName, oViewImpl) to define a View type.");
			}
		};

		JSView.prototype.initViewSettings = function (mSettings) {
			var oPromise;
			/*** require view definition if not yet done... ***/
			if (!mRegistry[mSettings.viewName] && mSettings.async) {
				oPromise = new Promise(function(resolve) {
					var sModuleName = jQuery.sap.getResourceName(mSettings.viewName, ".view");
					sap.ui.require([sModuleName], resolve);
				});
			} else if (!mRegistry[mSettings.viewName]) {
				jQuery.sap.require({modName: mSettings.viewName, type: "view"});
			}
			/*** Step 2: extend() ***/
			jQuery.extend(this, mRegistry[mSettings.viewName]);

			// return promise only in async mode
			if (mSettings.async) {
				return oPromise || Promise.resolve();
			}
		};

		JSView.prototype.onControllerConnected = function(oController) {
			var that = this;
			var oPreprocessors = {};
			// when auto prefixing is enabled we add the prefix
			if (this.getAutoPrefixId()) {
				oPreprocessors.id = function(sId) {
					return that.createId(sId);
				};
			}
			oPreprocessors.settings = this._fnSettingsPreprocessor;
			// unset any preprocessors (e.g. from an enclosing JSON view)
			ManagedObject.runWithPreprocessors(function() {
				that.applySettings({ content : that.createContent(oController) });
			}, oPreprocessors);
		};

		/**
		 * A method to be implemented by JSViews, returning the flag whether to prefix
		 * the IDs of controls automatically or not if the controls are created inside
		 * the {@link sap.ui.core.mvc.JSView#createContent} function. By default this
		 * feature is not activated.
		 *
		 * You can overwrite this function and return true to activate the automatic
		 * prefixing.
		 *
		 * @since 1.15.1
		 * @experimental Since 1.15.1. This feature might be changed in future.
		 * @return {boolean} true, if the controls IDs should be prefixed automatically
		 * @protected
		 */
		JSView.prototype.getAutoPrefixId = function() {
			return false;
		};

		/**
		 * A method to be implemented by JSViews, returning the View UI.
		 * While for declarative View types like XMLView or JSONView the user interface definition is declared in a separate file,
		 * JSViews programmatically construct the UI. This happens in the createContent method which every JSView needs to implement.
		 * The View implementation can construct the complete UI in this method - or only return the root control and create the rest of the UI lazily later on.
		 *
		 * @return {sap.ui.core.Control} a control or (typically) tree of controls representing the View user interface
		 * @public
		 * @name sap.ui.core.mvc.JSView#createContent
		 * @function
		 */

	}());


	return JSView;

});
