/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.layout.form.Form.
sap.ui.define(['jquery.sap.global', 'sap/ui/core/Control', 'sap/ui/layout/library'],
	function(jQuery, Control, library) {
	"use strict";

	/**
	 * Constructor for a new sap.ui.layout.form.Form.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * Form control.
	 * A <code>Form</code> is structured into <code>FormContainers</code>. Each <code>FormContainer</code> consists of <code>FormElements</code>.
	 * The <code>FormElements</code> consists of a label and the form fields.
	 * A <code>Form</code> doesn't render its content by itself. The rendering is done by the assigned <code>FormLayout</code>.
	 * This is so that the rendering can be adopted to new UI requirements without changing the Form itself.
	 *
	 * For the content of a <code>Form</code>, <code>VariantLayoutData</code> are supported to allow simple switching of the <code>FormLayout</code>.
	 * <code>LayoutData</code> on the content can be used to overwrite the default layout of the code>Form</code>.
	 *
	 * @extends sap.ui.core.Control
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @since 1.16.0
	 * @alias sap.ui.layout.form.Form
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var Form = Control.extend("sap.ui.layout.form.Form", /** @lends sap.ui.layout.form.Form.prototype */ { metadata : {

		library : "sap.ui.layout",
		properties : {

			/**
			 * Width of the <code>Form</code>.
			 */
			width : {type : "sap.ui.core.CSSSize", group : "Dimension", defaultValue : null},

			/**
			 * Applies a device and theme specific line-height to the form rows if the form has editable content.
			 * If set, all (not only the editable) rows of the form will get the line height of editable fields.
			 * The accessibility aria-readonly attribute is set according to this property.
			 * <b>Note:</b> The setting of the property has no influence on the editable functionality of the form's content.
			 * @since 1.20.0
			 */
			editable : {type : "boolean", group : "Misc", defaultValue : false}
		},
		defaultAggregation : "formContainers",
		aggregations : {

			/**
			 * Containers with the content of the form. A <code>FormContainer</code> represents a group inside the <code>Form</code>.
			 */
			formContainers : {type : "sap.ui.layout.form.FormContainer", multiple : true, singularName : "formContainer"}, 

			/**
			 * Title of the <code>Form</code>. Can either be a <code>Title</code> object, or a string.
			 * If a <code>Title</code> object it used, the style of the title can be set.
			 */
			title : {type : "sap.ui.core.Title", altTypes : ["string"], multiple : false},

			/**
			 * Layout of the <code>Form</code>. The assigned <code>Layout</code> renders the <code>Form</code>.
			 * We suggest using the <code>ResponsiveGridLayout</code> for rendering a <code>Form</code>, as its responsiveness allows the available space to be used in the best way possible.
			 */
			layout : {type : "sap.ui.layout.form.FormLayout", multiple : false}
		},
		associations: {

			/**
			 * Association to controls / IDs that label this control (see WAI-ARIA attribute aria-labelledby).
			 * @since 1.28.0
			 */
			ariaLabelledBy: { type: "sap.ui.core.Control", multiple: true, singularName: "ariaLabelledBy" }
		},
		designTime : true
	}});

	/**
	 * This file defines behavior for the control,
	 */

	(function() {

	//	sap.ui.commons.Form.prototype.init = function(){
	//	// do something for initialization...
	//	};

		Form.prototype.toggleContainerExpanded = function(oContainer){

			var oLayout = this.getLayout();
			if (oLayout) {
				oLayout.toggleContainerExpanded(oContainer);
			}

		};

		/*
		 * If onAfterRendering of a field is processed the layout might need to change it.
		 */
		Form.prototype.contentOnAfterRendering = function(oFormElement, oControl){

			// call function of the layout
			var oLayout = this.getLayout();
			if (oLayout && oLayout.contentOnAfterRendering) {
				oLayout.contentOnAfterRendering( oFormElement, oControl);
			}

		};

		/*
		 * If LayoutData changed on control this may need changes on the layout. So bubble to the Layout
		 */
		Form.prototype.onLayoutDataChange = function(oEvent){

			// call function of the layout
			var oLayout = this.getLayout();
			if (oLayout && oLayout.onLayoutDataChange) {
				oLayout.onLayoutDataChange(oEvent);
			}

		};

		Form.prototype.onBeforeFastNavigationFocus = function(oEvent){
			var oLayout = this.getLayout();
			if (oLayout && oLayout.onBeforeFastNavigationFocus) {
				oLayout.onBeforeFastNavigationFocus(oEvent);
			}
		};

		Form.prototype.setEditable = function(bEditable) {

			var bOldEditable = this.getEditable();
			this.setProperty("editable", bEditable, true);

			if (bEditable != bOldEditable && this.getDomRef()) {
				if (bEditable) {
					this.$().addClass("sapUiFormEdit").addClass("sapUiFormEdit-CTX");
					this.$().removeAttr("aria-readonly");
				} else {
					this.$().removeClass("sapUiFormEdit").removeClass("sapUiFormEdit-CTX");
					this.$().attr("aria-readonly", "true");
				}
			}

			return this;

		};

		/*
		 * Overwrite of INVALIDATE
		 * do not invalidate Form during rendering. Because there the Layout may update the content
		 * otherwise the Form will render twice
		*/
		Form.prototype.invalidate = function(oOrigin) {

			if (!this._bNoInvalidate) {
				Control.prototype.invalidate.apply(this, arguments);
			}

		};

		/**
		 * As Elements must not have a DOM reference it is not sure if one exists
		 * If the <code>FormContainer</code> has a DOM representation this function returns it,
		 * independent from the ID of this DOM element
		 * @param {sap.ui.layout.form.FormContainer} oContainer <code>FormContainer</code>
		 * @return {Element} The Element's DOM representation or null
		 * @private
		 */
		Form.prototype.getContainerRenderedDomRef = function(oContainer) {

			var oLayout = this.getLayout();
			if (oLayout && oLayout.getContainerRenderedDomRef) {
				return oLayout.getContainerRenderedDomRef(oContainer);
			}else {
				return null;
			}

		};

		/**
		 * As Elements must not have a DOM reference it is not sure if one exists
		 * If the <code>FormElement</code> has a DOM representation this function returns it,
		 * independent from the ID of this DOM element
		 * @param {sap.ui.layout.form.FormElement} oElement <code>FormElement</code>
		 * @return {Element} The Element's DOM representation or null
		 * @private
		 */
		Form.prototype.getElementRenderedDomRef = function(oElement) {

			var oLayout = this.getLayout();
			if (oLayout && oLayout.getElementRenderedDomRef) {
				return oLayout.getElementRenderedDomRef(oElement);
			}else {
				return null;
			}

		};

	}());

	return Form;

}, /* bExport= */ true);
