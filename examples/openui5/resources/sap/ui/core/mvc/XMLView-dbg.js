/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.core.mvc.XMLView.
sap.ui.define(['jquery.sap.global', 'sap/ui/core/XMLTemplateProcessor', 'sap/ui/core/library', './View', 'sap/ui/model/resource/ResourceModel', 'sap/ui/base/ManagedObject', 'sap/ui/core/Control', 'jquery.sap.xml'],
	function(jQuery, XMLTemplateProcessor, library, View, ResourceModel, ManagedObject, Control/* , jQuerySap */) {
	"use strict";

	/**
	 * Constructor for a new mvc/XMLView.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * A View defined using (P)XML and HTML markup.
	 * @extends sap.ui.core.mvc.View
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @alias sap.ui.core.mvc.XMLView
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var XMLView = View.extend("sap.ui.core.mvc.XMLView", /** @lends sap.ui.core.mvc.XMLView.prototype */ { metadata : {

		library : "sap.ui.core",

		specialSettings : {
			/**
			 * If an XMLView instance is used to represent a HTML subtree of another XMLView,
			 * then that other XMLView is provided with this setting to be able to delegate
			 * View functionality (createId, getController) to that 'real' view.
			 */
			containingView : true,
			/**
			 * If an XMLView instance is used to represent a HTML subtree of another XMLView,
			 * that subtree is provided with this setting.
			 */
			xmlNode : true
		}
	}});

		/**
		 * Instantiates an XMLView of the given name and with the given id.
		 *
		 * The <code>viewName</code> must either correspond to an XML module that can be loaded
		 * via the module system (viewName + suffix ".view.xml") and which defines the view or it must
		 * be a configuration object for a view.
		 * The configuration object can have a viewName, viewContent and a controller property. The viewName
		 * behaves as described above. ViewContent is optional and can hold a view description as XML string or as
		 * already parsed XML Document. If not given, the view content definition is loaded by the module system.
		 *
		 * <strong>Note</strong>: if a Document is given, it might be modified during view construction.
		 *
		 * The controller property can hold an controller instance. If a controller instance is given,
		 * it overrides the controller defined in the view.
		 *
		 * Like with any other control, id is optional and one will be created automatically.
		 *
		 * @param {string} [sId] id of the newly created view
		 * @param {string | object} vView name of the view or a view configuration object as described above.
		 * @param {string} [vView.viewName] name of the view resource in module name notation (without suffix)
		 * @param {string|Document} [vView.viewContent] XML string or XML document that defines the view.
		 * @param {boolean} [vView.async] defines how the view source is loaded and rendered later on
		 * @param {sap.ui.core.mvc.Controller} [vView.controller] Controller instance to be used for this view
		 * @public
		 * @static
		 * @return {sap.ui.core.mvc.XMLView} the created XMLView instance
		 */
		sap.ui.xmlview = function(sId, vView) {
			return sap.ui.view(sId, vView, sap.ui.core.mvc.ViewType.XML);
		};

		/**
		 * The type of the view used for the <code>sap.ui.view</code> factory
		 * function. This property is used by the parsers to define the specific
		 * view type.
		 * @private
		 */
		XMLView._sType = sap.ui.core.mvc.ViewType.XML;

		/**
		 * Flag for feature detection of asynchronous loading/rendering
		 * @public
		 * @since 1.30
		 */
		XMLView.asyncSupport = true;

		/**
 		* This function initialized the view settings.
 		*
 		* @param {object} mSettings with view settings
 		* @return {Promise|null} [oMyPromise] will be returned if running in async mode
 		*/
		XMLView.prototype.initViewSettings = function(mSettings) {
			var that = this;

			this._oContainingView = mSettings.containingView || this;

			var fnProcessView = function() {

				// extract the properties of the view from the XML element
				if ( !that.isSubView() ) {
					// for a real XMLView, we need to parse the attributes of the root node
					XMLTemplateProcessor.parseViewAttributes(that._xContent, that, mSettings);
				} else {
					// when used as fragment: prevent connection to controller, only top level XMLView must connect
					delete mSettings.controller;
				}

				if ((that._resourceBundleName || that._resourceBundleUrl) && (!mSettings.models || !mSettings.models[that._resourceBundleAlias])) {
					var model = new ResourceModel({bundleName:that._resourceBundleName, bundleUrl:that._resourceBundleUrl, bundleLocale:that._resourceBundleLocale});
					that.setModel(model,that._resourceBundleAlias);
				}

				// Delegate for after rendering notification before onAfterRendering of child controls
				that.oAfterRenderingNotifier = new sap.ui.core.mvc.XMLAfterRenderingNotifier();
				that.oAfterRenderingNotifier.addDelegate({
					onAfterRendering: function() {
						that.onAfterRenderingBeforeChildren();
					}
				});
			};

			if (!mSettings) {
				throw new Error("mSettings must be given");
			}

			if (this._oAsyncState) {
				// suppress rendering of preserve content
				this._oAsyncState.suppressPreserve = true;
			}

			// View template handling - either template name or XML node is given
			if (mSettings.viewName && mSettings.viewContent) {
				throw new Error("View name and view content are given. There is no point in doing this, so please decide.");
			} else if ((mSettings.viewName || mSettings.viewContent) && mSettings.xmlNode) {
				throw new Error("View name/content AND an XML node are given. There is no point in doing this, so please decide.");
			} else if (!(mSettings.viewName || mSettings.viewContent) && !mSettings.xmlNode) {
				throw new Error("Neither view name/content nor an XML node is given. One of them is required.");
			}

			if (mSettings.viewName) {
				var sResourceName = jQuery.sap.getResourceName(mSettings.viewName, ".view.xml");
				if (mSettings.async) {
					return jQuery.sap.loadResource(sResourceName, {async: true})
						.then(function(oData) {
							that._xContent = oData.documentElement; // result is the document node
							return that.runPreprocessor("xml", that._xContent);
						})
						.then(function(xContent) {
							that._xContent = xContent;
							fnProcessView();
						});
					// end of loadResource
				} else {
					this._xContent = jQuery.sap.loadResource(sResourceName).documentElement;
				}
			} else if (mSettings.viewContent) {
				// keep the content as a pseudo property to make cloning work but without supporting mutation
				// TODO model this as a property as soon as write-once-during-init properties become available
				this.mProperties["viewContent"] = mSettings.viewContent;
				this._xContent = jQuery.sap.parseXML(mSettings.viewContent);
				if (this._xContent.parseError.errorCode !== 0) {
					var oParseError = this._xContent.parseError;
					throw new Error("The following problem occurred: XML parse Error for " + oParseError.url + " code: " + oParseError.errorCode + " reason: " +
							oParseError.reason +  " src: " + oParseError.srcText + " line: " +  oParseError.line +  " linepos: " + oParseError.linepos +  " filepos: " + oParseError.filepos);
				} else {
					this._xContent = this._xContent.documentElement;
				}
			} else if (mSettings.xmlNode) {
				this._xContent = mSettings.xmlNode;
			} // else does not happen, already checked

			if (mSettings.async) {
				return this.runPreprocessor("xml", this._xContent)
					.then(function(xContent) {
						that._xContent = xContent;
						fnProcessView();
					});
			} else {
				this._xContent = this.runPreprocessor("xml", this._xContent, true);
				fnProcessView();
			}
		};

		XMLView.prototype.exit = function() {
			if (this.oAfterRenderingNotifier) {
				this.oAfterRenderingNotifier.destroy();
			}
			View.prototype.exit.apply(this, arguments);
		};

		XMLView.prototype.onControllerConnected = function(oController) {
			var that = this;
			// unset any preprocessors (e.g. from an enclosing JSON view)
			ManagedObject.runWithPreprocessors(function() {
				// parse the XML tree
				that._aParsedContent = XMLTemplateProcessor.parseTemplate(that._xContent, that);
				// allow rendering of preserve content
				if (that._oAsyncState) {
					delete that._oAsyncState.suppressPreserve;
				}
			}, {
				settings: this._fnSettingsPreprocessor
			});
		};

		XMLView.prototype.getControllerName = function() {
			return this._controllerName;
		};


		XMLView.prototype.isSubView = function() {
			return this._oContainingView != this;
		};

		/**
		 * If the HTML doesn't contain own content, it tries to reproduce existing content
		 * This is executed before the onAfterRendering of the child controls, to ensure that
		 * the HTML is already at its final position, before additional operations are executed.
		 */
		XMLView.prototype.onAfterRenderingBeforeChildren = function() {

			if ( this._$oldContent.length !== 0 ) {
				// jQuery.sap.log.debug("after rendering for " + this);

				// move DOM of children into correct place in preserved DOM
				var aChildren = this.getAggregation("content");
				if ( aChildren ) {
					for (var i = 0; i < aChildren.length; i++) {
						if (aChildren[i].getDomRef() === null) {
							// Do not replace if there is no dom to replace it with...
							continue;
						}
						var $childDOM = aChildren[i].$();
						// jQuery.sap.log.debug("replacing placeholder for " + aChildren[i] + " with content");
						jQuery.sap.byId(sap.ui.core.RenderPrefixes.Dummy + aChildren[i].getId(), this._$oldContent).replaceWith($childDOM);
					}
				}
				// move preserved DOM into place
				// jQuery.sap.log.debug("moving preserved dom into place for " + this);
				jQuery.sap.byId(sap.ui.core.RenderPrefixes.Dummy + this.getId()).replaceWith(this._$oldContent);
			}
			this._$oldContent = undefined;
		};

		XMLView.prototype._onChildRerenderedEmpty = function(oControl, oElement) {
			// when the render manager notifies us about an empty child rendering, we replace the old DOM with a dummy
			jQuery(oElement).replaceWith('<div id="' + sap.ui.core.RenderPrefixes.Dummy + oControl.getId() + '" class="sapUiHidden"/>');
			return true; // indicates that we have taken care
		};

		/**
		* Register a preprocessor for all views of a specific type.
		*
		* The preprocessor can be registered for several stages of view initialization, which are
		* dependant from the view type, e.g. "raw", "xml" or already initialized "controls". For each
		* type one preprocessor is executed. If there is a preprocessor passed to or activated at the
		* view instance already, that one is used.
		*
		* It can be either a module name as string of an implementation of {@link sap.ui.core.mvc.View.Preprocessor} or a
		* function with a signature according to {@link sap.ui.core.mvc.View.Preprocessor.process}.
		*
		* <strong>Note</strong>: Preprocessors work only in async views and will be ignored when the view is instantiated
		* in sync mode by default, as this could have unexpected side effects. You may override this behaviour by setting the
		* bSyncSupport flag to true.
		*
		* @public
		* @static
		* @param {string} sType
		* 		the type of content to be processed
		* @param {string|function} vPreprocessor
		* 		module path of the preprocessor implementation or a preprocessor function
		* @param {boolean} bSyncSupport
		* 		declares if the vPreprocessor ensures safe sync processing. This means the preprocessor will be executed
		* 		also for sync views. Please be aware that any kind of async processing (like Promises, XHR, etc) may
		* 		break the view initialization and lead to unexpected results.
		* @param {boolean} [bOnDemand]
		* 		ondemand preprocessor which enables developers to quickly activate the preprocessor for a view,
		* 		by setting <code>preprocessors : { xml }</code>, for example.
		* @param {object} [mSettings]
		* 		optional configuration for preprocessor
		*/
		XMLView.registerPreprocessor = function(sType, vPreprocessor, bSyncSupport, bOnDemand, mSettings) {
			if (sType == "xml" || sType == "controls") {
				sap.ui.core.mvc.View.registerPreprocessor(sType, vPreprocessor, this.getMetadata().getClass()._sType, bSyncSupport, bOnDemand, mSettings);
			} else {
				jQuery.sap.log.error("Preprocessor could not be registered due to unknown sType \"" + sType + "\"", this.getMetadata().getName());
			}
		};

		/**
		 * Dummy control for after rendering notification before onAfterRendering of
		 * child controls of the XMLView is called
		 */
		Control.extend("sap.ui.core.mvc.XMLAfterRenderingNotifier", {
			renderer: function(oRM, oControl) {
				oRM.write(""); // onAfterRendering is only called if control produces output
			}
		});

		// Register OpenUI5 default preprocessor for templating
		XMLView.registerPreprocessor("xml", "sap.ui.core.util.XMLPreprocessor", true, true);

	return XMLView;

});
