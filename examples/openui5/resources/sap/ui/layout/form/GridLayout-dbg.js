/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.layout.form.GridLayout.
sap.ui.define(['jquery.sap.global', './FormLayout', './GridContainerData', './GridElementData', 'sap/ui/layout/library'],
	function(jQuery, FormLayout, GridContainerData, GridElementData, library) {
	"use strict";

	/**
	 * Constructor for a new sap.ui.layout.form.GridLayout.
	 *
	 * @param {string} [sId] Id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * This <code>FormLayout</code> renders a <code>Form</code> using a HTML-table based grid.
	 * This can be a 16 column grid or an 8 column grid. The grid is stable, so the alignment of the fields is the same for all screen sizes or widths of the <code>Form</code>.
	 * Only the width of the single grid columns depends on the available width.
	 *
	 * To adjust the appearance inside the <code>GridLayout</code>, you can use <code>GridContainerData</code> for <code>FormContainers</code>
	 * and <code>GridElementData</code> for content fields.
	 *
	 * <b>Note:</b> If content fields have a <code>width</code> property this will be ignored, as the width of the controls is set by the grid cells.
	 *
	 * This control cannot be used stand alone, it only renders a <code>Form</code>, so it must be assigned to a <code>Form</code>.
	 * @extends sap.ui.layout.form.FormLayout
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @since 1.16.0
	 * @alias sap.ui.layout.form.GridLayout
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var GridLayout = FormLayout.extend("sap.ui.layout.form.GridLayout", /** @lends sap.ui.layout.form.GridLayout.prototype */ { metadata : {

		library : "sap.ui.layout",
		properties : {

			/**
			 * If set, the grid renders only one <code>FormContainer</code> per column. That means one <code>FormContainer</code> is below the other. The whole grid has 8 cells per row.
			 *
			 * If not set, <code>FormContainer</code> can use the full width of the grid or two <code>FormContainers</code> can be placed beside each other. In this case the whole grid has 16 cells per row.
			 */
			singleColumn : {type : "boolean", group : "Misc", defaultValue : false}
		}
	}});

	/**
	 * This file defines behavior for the control
	 */

	(function() {

		GridLayout.prototype.toggleContainerExpanded = function(oContainer){

			// rerendering of the form is needed
			this.invalidate();

		};

		GridLayout.prototype.onAfterRendering = function(){

			// set tabindex of expander buttons to -1 to prevent tabbing from outside the Form
			// directly to the expander
			var oForm = this.getParent();
			if (oForm) {
				var aContainers = oForm.getFormContainers();
				for ( var i = 0; i < aContainers.length; i++) {
					var oContainer = aContainers[i];
					if (oContainer.getExpandable()) {
						oContainer._oExpandButton.$().attr("tabindex", "-1");
					}
				}
			}

		};

		/*
		 * If onAfterRendering of a field is processed the width must be set to 100%
		 */
		GridLayout.prototype.contentOnAfterRendering = function(oFormElement, oControl){

			FormLayout.prototype.contentOnAfterRendering.apply(this, arguments);

			if (oControl.getMetadata().getName() != "sap.ui.commons.Image" ) {
				oControl.$().css("width", "100%");
			}

		};

		/*
		 * If LayoutData changed on one control this needs to rerender the whole table
		 * because it may influence other rows and columns
		 */
		GridLayout.prototype.onLayoutDataChange = function(oEvent){

			if (this.getDomRef()) {
				// only if already rendered
				this.rerender();
			}

		};

		GridLayout.prototype.onsaptabnext = function(oEvent){

			this.tabForward(oEvent);

		};

		GridLayout.prototype.onsaptabprevious = function(oEvent){

			this.tabBack(oEvent);

		};

		GridLayout.prototype.findFieldOfElement = function(oElement, iStartIndex, iLeft){

			if (!iLeft) {
				return FormLayout.prototype.findPrevFieldOfElement.apply(this, arguments);
			}

			if (!oElement.getVisible()) {
				return null;
			}

			var aFields = oElement.getFields();
			var oNewDomRef;

			var iIndex = aFields.length;
			iStartIndex = iIndex - 1;


			for ( var i = iStartIndex; i >= 0; i--) {
				// find the next enabled control thats rendered
				var oField = aFields[i];
				var iLeftnew = oField.$().offset().left;
				if (iLeft < iLeftnew && i != 0) {
					continue;
				}
				var oDomRef = this._getDomRef(oField);
				if ((!oField.getEnabled || oField.getEnabled()) && oDomRef) {
					oNewDomRef = oDomRef;
					break;
				}
			}

			return oNewDomRef;

		};

		GridLayout.prototype.findFieldBelow = function(oControl, oElement){

			var oContainer = oElement.getParent();
			var iCurrentIndex = oContainer.indexOfFormElement(oElement);
			var oNewDomRef;

			if (oContainer.getVisible()) {
				var aElements = oContainer.getFormElements();
				var iMax = aElements.length;
				var i = iCurrentIndex + 1;
				var iLeft = oControl.$().offset().left;

				while (!oNewDomRef && i < iMax) {
					var oNewElement = aElements[i];
					oNewDomRef = this.findFieldOfElement(oNewElement, 0, iLeft);
					i++;
				}
			}

			if (!oNewDomRef) {
				// no next element -> look in next container
				var oForm = oContainer.getParent();
				iCurrentIndex = oForm.indexOfFormContainer(oContainer);
				oNewDomRef = this.findFirstFieldOfFirstElementInNextContainer(oForm, iCurrentIndex + 1);
			}

			return oNewDomRef;

		};

		GridLayout.prototype.findFieldAbove = function(oControl, oElement){

			var oContainer = oElement.getParent();
			var iCurrentIndex = oContainer.indexOfFormElement(oElement);
			var oNewDomRef;

			if (oContainer.getVisible()) {
				var aElements = oContainer.getFormElements();
				var i = iCurrentIndex - 1;
				var iLeft = oControl.$().offset().left;

				while (!oNewDomRef && i >= 0) {
					var oNewElement = aElements[i];
					oNewDomRef = this.findFieldOfElement(oNewElement, 0, iLeft);
					i--;
				}
			}

			if (!oNewDomRef) {
				// no next element -> look in previous container
				var oForm = oContainer.getParent();
				iCurrentIndex = oForm.indexOfFormContainer(oContainer);
				oNewDomRef = this.findLastFieldOfLastElementInPrevContainer(oForm, iCurrentIndex - 1);
			}

			return oNewDomRef;

		};

		/**
		 * As Elements must not have a DOM reference it is not sure if one exists
		 * In <code>GridLayout</code> a <code>FormContainer</code> can't have a surrounding DOM element,
		 * so it always returns null
		 * @param {sap.ui.layout.form.FormContainer} oContainer <code>FormContainer</code>
		 * @return {Element} The Element's DOM representation or null
		 * @private
		 */
		GridLayout.prototype.getContainerRenderedDomRef = function(oContainer) {

			return null;

		};

		/**
		 * As Elements must not have a DOM reference it is not sure if one exists.
		 * In this layout a <code>FormElement</code> only has a DOM representation if its <code>FormContainer</code>
		 * has the whole width
		 * @param {sap.ui.layout.form.FormElement} oElement <code>FormElement</code>
		 * @return {Element} The Element's DOM representation or null
		 * @private
		 */
		GridLayout.prototype.getElementRenderedDomRef = function(oElement) {

			if (this.getDomRef()) {
				var bSingleColumn = this.getSingleColumn();
				var oContainer = oElement.getParent();
				var oContainerData = this.getLayoutDataForElement(oContainer, "sap.ui.layout.form.GridContainerData");
				var that = this;

				if ((bSingleColumn || !oContainerData || !oContainerData.getHalfGrid()) && !this.getRenderer().checkFullSizeElement(that, oElement) ) {
					return jQuery.sap.domById(oElement.getId());
				}
			}

			return null;

		};

	}());

	return GridLayout;

}, /* bExport= */ true);
