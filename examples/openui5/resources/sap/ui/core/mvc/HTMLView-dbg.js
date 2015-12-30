/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.core.mvc.HTMLView.
sap.ui.define(['jquery.sap.global', 'sap/ui/base/ManagedObject', 'sap/ui/core/DeclarativeSupport', 'sap/ui/core/library', './View'],
	function(jQuery, ManagedObject, DeclarativeSupport, library, View) {
	"use strict";



	/**
	 * Constructor for a new mvc/HTMLView.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * A view defined/constructed by declarative HTML.
	 * @extends sap.ui.core.mvc.View
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @since 1.9.2
	 * @alias sap.ui.core.mvc.HTMLView
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var HTMLView = View.extend("sap.ui.core.mvc.HTMLView", /** @lends sap.ui.core.mvc.HTMLView.prototype */ { metadata : {

		library : "sap.ui.core"
	}});



		/**
		 * Defines or creates an instance of a declarative HTML view.
		 *
		 * The behavior of this method depends on the signature of the call and on the current context.
		 *
		 * <ul>
		 * <li>View Definition <code>sap.ui.htmlview(sId, vView)</code>: Defines a view of the given name with the given
		 * implementation. sId must be the views name, vView must be an object and can contain
		 * implementations for any of the hooks provided by HTMLView</li>
		 * <li>View Instantiation <code>sap.ui.htmlview(sId?, vView)</code>: Creates an instance of the view with the given name (and id)</li>.
		 * </ul>
		 *
		 * Any other call signature will lead to a runtime error. If the id is omitted in the second variant, an id will
		 * be created automatically.
		 *
		 * @param {string} [sId] id of the newly created view, only allowed for instance creation
		 * @param {string | object} vView name or implementation of the view.
		 * @param {boolean} [vView.async] defines how the view source is loaded and rendered later on
		 * @public
		 * @static
		 * @return {sap.ui.core.mvc.HTMLView | undefined} the created HTMLView instance in the creation case, otherwise undefined
		 */
		sap.ui.htmlview = function(sId, vView) {
			return sap.ui.view(sId, vView, sap.ui.core.mvc.ViewType.HTML);
		};

		/**
		 * The type of the view used for the <code>sap.ui.view</code> factory
		 * function. This property is used by the parsers to define the specific
		 * view type.
		 * @private
		 */
		HTMLView._sType = sap.ui.core.mvc.ViewType.HTML;

		/**
		 * Flag for feature detection of asynchronous loading/rendering
		 * @public
		 * @since 1.30
		 */
		HTMLView.asyncSupport = true;

		/**
		 * The template cache. Templates are only loaded once.
		 *
		 * @private
		 * @static
		 */
		HTMLView._mTemplates = {};


		/**
		 * A map with the allowed settings for the view.
		 *
		 * @private
		 * @static
		 */
		HTMLView._mAllowedSettings = {
				"viewName" : true,
				"controller" : true,
				"viewContent" : true,
				"controllerName" : true,
				"resourceBundleName" : true,
				"resourceBundleUrl" : true,
				"resourceBundleLocale" : true,
				"resourceBundleAlias" : true
		};


		/**
		 * Loads and returns a template for the given template name. Templates are only loaded once {@link sap.ui.core.mvc.HTMLView._mTemplates}.
		 *
		 * @param {string} sTemplateName The name of the template
		 * @param {boolean} [mOptions.async=false] whether the action should be performed asynchronously
		 * @return {string|Promise} the template data, or a Promise resolving with it when async
		 * @private
		 * @static
		 */
		HTMLView._getTemplate = function(sTemplateName, mOptions) {
			var sUrl = this._getViewUrl(sTemplateName);
			var sHTML = this._mTemplates[sUrl];

			if (!sHTML) {
				sHTML = this._loadTemplate(sTemplateName, mOptions);
				// TODO discuss
				// a) why caching at all (more precise: why for HTMLView although we refused to do it for other view types - risk of a memory leak!)
				// b) why cached via URL instead of via name? Any special scenario in mind?
				if (mOptions && mOptions.async) {
					var that = this;
					return sHTML.then(function(_sHTML) {
						that._mTemplates[sUrl] = _sHTML;
						return Promise.resolve(_sHTML);
					});
				} else {
					this._mTemplates[sUrl] = sHTML;
				}
			}
			return mOptions.async ? Promise.resolve(sHTML) : sHTML;
		};


		/**
		 * Abstract method implementation. Returns the name of the controller.
		 * @return {string} the name of the set controller. Returns undefined when no controller is set.
		 * @private
		 */
		HTMLView.prototype.getControllerName = function() {
			return this._controllerName;
		};


		/**
		 * Returns the view URL for a given template name in respect of the module path.
		 *
		 * @param {string} sTemplateName The name of the template
		 * @return {string} the view url
		 * @private
		 * @static
		 */
		HTMLView._getViewUrl = function(sTemplateName) {
			return jQuery.sap.getModulePath(sTemplateName, ".view.html");
		};


		/**
		 * Loads and returns the template from a given URL.
		 *
		 * @param {string} sTemplateName The name of the template
		 * @param {boolean} [mOptions.async=false] whether the action should be performed asynchronously
		 * @return {string|Promise} the template data, or a Promise resolving with it when async
		 * @private
		 * @static
		 */
		HTMLView._loadTemplate = function(sTemplateName, mOptions) {
			var sResourceName = jQuery.sap.getResourceName(sTemplateName, ".view.html");
			return jQuery.sap.loadResource(sResourceName, mOptions);
		};


		/**
		 * Abstract method implementation.
		 *
		 * @see sap.ui.core.mvc.View#initViewSettings
		 *
		 * @private
		 */
		HTMLView.prototype.initViewSettings = function (mSettings) {
			if (!mSettings) {
				throw new Error("mSettings must be given");
			}

			// View template handling - no JSON template given
			if (mSettings.viewName && mSettings.viewContent) {
				throw new Error("View name and view content are given. There is no point in doing this, so please decide.");
			} else if (!mSettings.viewName && !mSettings.viewContent) {
				throw new Error("Neither view name nor view content is given. One of them is required.");
			}

			var that = this;
			function fnInitViewSettings() {
				that._oTemplate = document.createElement("div");

				if (typeof vHTML === "string") {
					that._oTemplate.innerHTML = vHTML;
				} else {
					var oNodeList = vHTML;
					var oFragment = document.createDocumentFragment();
					for (var i = 0; i < oNodeList.length;i++) {
						oFragment.appendChild(oNodeList.item(i));
					}
					that._oTemplate.appendChild(oFragment);
				}

				var oMetaElement = that._oTemplate.getElementsByTagName("template")[0];
				var oProperties = that.getMetadata().getAllProperties();

				if (oMetaElement) {
					jQuery.each(oMetaElement.attributes, function(iIndex, oAttr) {
						var sName = DeclarativeSupport.convertAttributeToSettingName(oAttr.name, that.getId());
						var sValue = oAttr.value;
						var oProperty = oProperties[sName];
						if (!mSettings[sName]) {
							if (oProperty) {
								mSettings[sName] = DeclarativeSupport.convertValueToType(DeclarativeSupport.getPropertyDataType(oProperty),sValue);
							} else if (HTMLView._mAllowedSettings[sName]) {
								mSettings[sName] = sValue;
							}
						}
					});
					that._oTemplate = oMetaElement;
				}

				// that is a fix for browsers that support web components
				if (that._oTemplate.content) {
					var oFragment = that._oTemplate.content;
					// Create a new template, as innerHTML would be empty for TemplateElements when the fragment is appended directly
					that._oTemplate = document.createElement("div");
					// Make the shadow DOM available in the DOM
					that._oTemplate.appendChild(oFragment);
				}

				if (mSettings.controllerName) {
				  that._controllerName = mSettings.controllerName;
				}
				if ((mSettings.resourceBundleName || mSettings.resourceBundleUrl) && (!mSettings.models || !mSettings.models[mSettings.resourceBundleAlias])) {
					var model = new sap.ui.model.resource.ResourceModel({bundleName:mSettings.resourceBundleName, bundleUrl:mSettings.resourceBundleUrl, bundleLocale:mSettings.resourceBundleLocale});
					that.setModel(model, mSettings.resourceBundleAlias);
				}
			}

			var vHTML = mSettings.viewContent;

			if (!vHTML) {
				// vHTML could be a promise if {async: true}
				vHTML = HTMLView._getTemplate(mSettings.viewName, {async: mSettings.async});
			}

			if (mSettings.async) {
				// return the promise
				return vHTML.then(function(_vHTML) {
						vHTML = _vHTML;
						fnInitViewSettings();
					});
			}

			fnInitViewSettings();
		};


		/**
		 * Abstract method implementation.
		 *
		 * @see sap.ui.core.mvc.View#onControllerConnected
		 *
		 * @private
		 */
		HTMLView.prototype.onControllerConnected = function(oController) {
			// unset any preprocessors (e.g. from an enclosing HTML view)
			var that = this;
			ManagedObject.runWithPreprocessors(function() {
				DeclarativeSupport.compile(that._oTemplate, that);
			}, {
				settings: this._fnSettingsPreprocessor
			});
		};


		/**
		 * Called when the control is destroyed. Use this one to free resources and finalize activities.
		 */
		HTMLView.prototype.exit = function() {
			this._oTemplate = null;
			View.prototype.exit.call(this);
			// Destroy all unassociated controls that are connected with the view
			if (this._connectedControls) {
				for (var i = 0; i < this._connectedControls.length; i++) {
					this._connectedControls[i].destroy();
				}
				this._connectedControls = null;
			}
		};


		/**
		 * Internal method to connect unassociated controls to the view. All controls will be destroyed when the view is destroyed.
		 *
		 * @param {sap.ui.core.Control} oControl reference to a Control
		 * @private
		 */
		 HTMLView.prototype.connectControl = function(oControl) {
			this._connectedControls = this._connectedControls || [];
			this._connectedControls.push(oControl);
		};


	return HTMLView;

});
