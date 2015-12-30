/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.core.mvc.TemplateView.
sap.ui.define(['jquery.sap.global', 'sap/ui/core/library', './View'],
	function(jQuery, library, View) {
	"use strict";


	
	/**
	 * Constructor for a new mvc/TemplateView.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * A view defined in a template.
	 * @extends sap.ui.core.mvc.View
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @since 1.16.0
	 * @alias sap.ui.core.mvc.TemplateView
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var TemplateView = View.extend("sap.ui.core.mvc.TemplateView", /** @lends sap.ui.core.mvc.TemplateView.prototype */ { metadata : {
	
		library : "sap.ui.core"
	}});
	
	(function(){
		
		/**
		 * Defines or creates an instance of a template view.
		 *
		 * The behavior of this method depends on the signature of the call and on the current context.
		 *
		 * <ul>
		 * <li>View Definition <code>sap.ui.templateview(sId, vView)</code>: Defines a view of the given name with the given
		 * implementation. sId must be the views name, vView must be an object and can contain
		 * implementations for any of the hooks provided by templateview</li>
		 * <li>View Instantiation <code>sap.ui.templateview(sId?, vView)</code>: Creates an instance of the view with the given name (and id)</li>.
		 * </ul>
		 *
		 * Any other call signature will lead to a runtime error. If the id is omitted in the second variant, an id will
		 * be created automatically.
		 *
		 * @param {string} [sId] id of the newly created view, only allowed for instance creation
		 * @param {string | object} vView name or implementation of the view.
		 * @public
		 * @static
		 * @return {sap.ui.core.mvc.TemplateView | undefined} the created TemplateView instance in the creation case, otherwise undefined
		 */
		sap.ui.templateview = function(sId, vView) {
			return sap.ui.view(sId, vView, sap.ui.core.mvc.ViewType.Template);
		};
	
		/**
		 * The type of the view used for the <code>sap.ui.view</code> factory 
		 * function. This property is used by the parsers to define the specific 
		 * view type.
		 * @private
		 */
		TemplateView._sType = sap.ui.core.mvc.ViewType.Template;
		
		/**
		 * Abstract method implementation. Returns the name of the controller.
		 * @return {string} the name of the set controller. Returns undefined when no controller is set.
		 * @private
		 */
		TemplateView.prototype.getControllerName = function() {
			return this._sControllerName;
		};
	
	
		/**
		 * Returns the view URL for a given template name in respect of the module path.
		 * 
		 * @param {string} sTemplateName The name of the template
		 * @return {string} the view url
		 * @private
		 * @static
		 */
		TemplateView._getViewUrl = function(sTemplateName) {
			return jQuery.sap.getModulePath(sTemplateName, ".view.tmpl");
		};
	
		/**
		 * Abstract method implementation.
		 * 
		 * @see sap.ui.core.mvc.View#initViewSettings
		 * 
		 * @private
		 */
		TemplateView.prototype.initViewSettings = function (mSettings) {
			if (!mSettings) {
				throw new Error("mSettings must be given");
			}
	
			// View template handling - no Tmpl template given
			if (!mSettings.viewName) {
				throw new Error("No view name is given.");
			}
			
			this._oTemplate = sap.ui.template({
				id: this.getId(),
				src: TemplateView._getViewUrl(mSettings.viewName)
			});
			this._sControllerName = this._oTemplate._sControllerName;
			this._oTemplate = this._oTemplate.createControl(undefined, undefined, this);
			this.addContent(this._oTemplate);
		};
	
	}());

	return TemplateView;

});
