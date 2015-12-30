/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.layout.form.FormLayout.
sap.ui.define(['jquery.sap.global', 'sap/ui/core/Control', './Form', 'sap/ui/layout/library'],
	function(jQuery, Control, Form, library) {
	"use strict";

	/**
	 * Constructor for a new sap.ui.layout.form.FormLayout.
	 *
	 * @param {string} [sId] Id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * Base layout to render a <code>Form</code>.
	 * Other layouts to render a <code>Form</code> must inherit from this one.
	 * <b>Note:</b> This control must not be used to render a <code>Form</code> in productive applications as it does not fulfill any
	 * design guidelines and usability standards.
	 * @extends sap.ui.core.Control
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @since 1.16.0
	 * @alias sap.ui.layout.form.FormLayout
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var FormLayout = Control.extend("sap.ui.layout.form.FormLayout", /** @lends sap.ui.layout.form.FormLayout.prototype */ { metadata : {

		library : "sap.ui.layout"
	}});

	/**
	 * This file defines behavior for the control,
	 */


	(function() {
		/* eslint-disable no-lonely-if */

		FormLayout.prototype.contentOnAfterRendering = function(oFormElement, oControl){

			if (sap.ui.layout.form.FormHelper.bArrowKeySupport) {
				jQuery(oControl.getFocusDomRef()).data("sap.InNavArea", true);
			}

		};

		FormLayout.prototype.toggleContainerExpanded = function(oContainer){

			var bExpanded = oContainer.getExpanded();
			if (this.getDomRef()) {
				if (bExpanded) {
					//show content
					oContainer.$("content").css("display", "");
				} else {
					//hide content
					oContainer.$("content").css("display", "none");
				}
			}

		};

		/*
		 * gets the layout data of a element (container, control...) for the needed layout data type
		 */
		FormLayout.prototype.getLayoutDataForElement = function(oElement, sType){

			var oLayoutData = oElement.getLayoutData();

			var oClass = jQuery.sap.getObject(sType);

			if (!oLayoutData) {
				return undefined;
			} else if (oLayoutData instanceof oClass) {
				return oLayoutData;
			} else if (oLayoutData.getMetadata().getName() == "sap.ui.core.VariantLayoutData") {
				// multiple LayoutData available - search here
				var aLayoutData = oLayoutData.getMultipleLayoutData();
				for ( var i = 0; i < aLayoutData.length; i++) {
					var oLayoutData2 = aLayoutData[i];
					if (oLayoutData2 instanceof oClass) {
						return oLayoutData2;
					}
				}
			}

		};

		/* Keyboard handling
		 * In the FormLayout just a basic keyboard handling is implemented.
		 * This must be enhanced in the other Layouts if needed.
		 *
		 * The main idea is to navigate via arrow keys from control to control
		 * using Tab only the editable/active controls are reached. So the tab-chain is short
		 * Via F6 the navigation goes to the next container
		 * There is an "edit mode" to allow arrow key navigation inside of controls.
		 * For mobile application the Arrow-key navigation should be disabled
		 */

		FormLayout.prototype.onsapright = function(oEvent){

			if (sap.ui.layout.form.FormHelper.bArrowKeySupport) {
				var bRtl = sap.ui.getCore().getConfiguration().getRTL();
				var that = this;

				if (!bRtl) {
					this.navigateForward(oEvent, that);
				} else {
					this.navigateBack(oEvent, that);
				}
			}

		};

		FormLayout.prototype.onsapleft = function(oEvent){

			if (sap.ui.layout.form.FormHelper.bArrowKeySupport) {
				var bRtl = sap.ui.getCore().getConfiguration().getRTL();
				var that = this;

				if (!bRtl) {
					this.navigateBack(oEvent, that);
				} else {
					this.navigateForward(oEvent, that);
				}
			}

		};

		FormLayout.prototype.onsapdown = function(oEvent){

			if (sap.ui.layout.form.FormHelper.bArrowKeySupport) {
				var oControl = oEvent.srcControl;
				var oNewDomRef;
				var oRoot = this.findElement(oControl);
				var oElement = oRoot.element;
				oControl = oRoot.rootControl;
				if (oElement && oElement instanceof sap.ui.layout.form.FormElement) {
					oNewDomRef = this.findFieldBelow(oControl, oElement);
				} else if (oElement && oElement instanceof sap.ui.layout.form.FormContainer) {
					// current control is not inside an Element - maybe a title or expander?
					oNewDomRef = this.findFirstFieldOfNextElement(oElement, 0);
				}

				if (oNewDomRef) {
					jQuery.sap.focus(oNewDomRef);
					oEvent.preventDefault(); // to avoid moving cursor in next field
				}
			}

		};

		FormLayout.prototype.onsapup = function(oEvent){

			if (sap.ui.layout.form.FormHelper.bArrowKeySupport) {
				var oControl = oEvent.srcControl;
				var iCurrentIndex = 0;
				var oNewDomRef;
				var oRoot = this.findElement(oControl);
				var oElement = oRoot.element;
				oControl = oRoot.rootControl;
				if (oElement && oElement instanceof sap.ui.layout.form.FormElement) {
					oNewDomRef = this.findFieldAbove(oControl, oElement);
				} else if (oElement && oElement instanceof sap.ui.layout.form.FormContainer) {
					// current control is not inside an Element - maybe a title or expander?
					var oForm = oElement.getParent();
					iCurrentIndex = oForm.indexOfFormContainer(oElement);
					oNewDomRef = this.findLastFieldOfLastElementInPrevContainer(oForm, iCurrentIndex - 1);
				}

				if (oNewDomRef) {
					jQuery.sap.focus(oNewDomRef);
					oEvent.preventDefault(); // to avoid moving cursor in next field
				}
			}

		};

		FormLayout.prototype.onsaphome = function(oEvent){

			if (sap.ui.layout.form.FormHelper.bArrowKeySupport) {
				var oControl = oEvent.srcControl;
				var iCurrentIndex = 0;
				var oNewDomRef;
				var oRoot = this.findElement(oControl);
				var oElement = oRoot.element;
				var oContainer = oElement.getParent();
				var oForm = oContainer.getParent();

				iCurrentIndex = oForm.indexOfFormContainer(oContainer);
				// actually it's within the same container
				oNewDomRef = this.findFirstFieldOfFirstElementInNextContainer(oForm, iCurrentIndex);

				if (oNewDomRef) {
					jQuery.sap.focus(oNewDomRef);
					oEvent.preventDefault(); // to avoid moving cursor in next field
				}
			}

		};

		FormLayout.prototype.onsaptop = function(oEvent){

			if (sap.ui.layout.form.FormHelper.bArrowKeySupport) {
				var oControl = oEvent.srcControl;
				var oRoot = this.findElement(oControl);
				var oElement = oRoot.element;
				var oNewDomRef;
				var oContainer;

				if (oElement && oElement instanceof sap.ui.layout.form.FormElement) {
					oContainer = oElement.getParent();
				} else if (oElement && oElement instanceof sap.ui.layout.form.FormContainer) {
					// current control is not inside an Element - maybe a title or expander?
					oContainer = oElement;
				}
				var oForm = oContainer.getParent();

				oNewDomRef = this.findFirstFieldOfForm(oForm);

				if (oNewDomRef) {
					jQuery.sap.focus(oNewDomRef);
					oEvent.preventDefault(); // to avoid moving cursor in next field
				}
			}

		};

		FormLayout.prototype.onsapend = function(oEvent){

			if (sap.ui.layout.form.FormHelper.bArrowKeySupport) {
				var oControl = oEvent.srcControl;
				var iCurrentIndex = 0;
				var oNewDomRef;
				var oRoot = this.findElement(oControl);
				var oElement = oRoot.element;
				var oContainer = oElement.getParent();
				var oForm = oContainer.getParent();

				iCurrentIndex = oForm.indexOfFormContainer(oContainer);
				oNewDomRef = this.findLastFieldOfLastElementInPrevContainer(oForm, iCurrentIndex);

				if (oNewDomRef) {
					jQuery.sap.focus(oNewDomRef);
					oEvent.preventDefault(); // to avoid moving cursor in next field
				}
			}

		};

		FormLayout.prototype.onsapbottom = function(oEvent){

			if (sap.ui.layout.form.FormHelper.bArrowKeySupport) {
				var oControl = oEvent.srcControl;
				var oRoot = this.findElement(oControl);
				var oElement = oRoot.element;
				var oNewDomRef;
				var oContainer;

				if (oElement && oElement instanceof sap.ui.layout.form.FormElement) {
					oContainer = oElement.getParent();
				} else if (oElement && oElement instanceof sap.ui.layout.form.FormContainer) {
					// current control is not inside an Element - maybe a title or expander?
					oContainer = oElement;
				}
				var oForm = oContainer.getParent();

				var aContainers = oForm.getFormContainers();
				var iLength = aContainers.length;

				oNewDomRef = this.findLastFieldOfLastElementInPrevContainer(oForm, iLength - 1);

				if (oNewDomRef) {
					jQuery.sap.focus(oNewDomRef);
					oEvent.preventDefault(); // to avoid moving cursor in next field
				}
			}

		};

		FormLayout.prototype.onsapexpand = function(oEvent){

			var oControl = oEvent.srcControl;
			var oRoot = this.findElement(oControl);
			var oElement = oRoot.element;
			var oContainer = oElement.getParent();

			if (oContainer.getExpandable()) {
				oContainer.setExpanded(true);
			}
		};

		FormLayout.prototype.onsapcollapse = function(oEvent){

			var oControl = oEvent.srcControl;
			var oRoot = this.findElement(oControl);
			var oElement = oRoot.element;
			var oContainer = oElement.getParent();

			if (oContainer.getExpandable()) {
				oContainer.setExpanded(false);
			}
		};

		FormLayout.prototype.onsapskipforward = function(oEvent){

			var oControl = oEvent.srcControl;
			var oRoot = this.findElement(oControl);
			var oElement = oRoot.element;
			oControl = oRoot.rootControl;
			var oNewDomRef;
			var oContainer;

			if (oElement && oElement instanceof sap.ui.layout.form.FormElement) {
				oContainer = oElement.getParent();
			} else if (oElement && oElement instanceof sap.ui.layout.form.FormContainer) {
				// current control is not inside an Element - maybe a title or expander?
				oContainer = oElement;
			}
			var oForm = oContainer.getParent();
			var iCurrentIndex = oForm.indexOfFormContainer(oContainer);

			// goto next container
			oNewDomRef = this.findFirstFieldOfFirstElementInNextContainer(oForm, iCurrentIndex + 1);

			if (oNewDomRef) {
				jQuery.sap.focus(oNewDomRef);
				oEvent.preventDefault(); // to avoid moving cursor in next field
			}

		};

		FormLayout.prototype.onsapskipback = function(oEvent){

			var oControl = oEvent.srcControl;
			var oRoot = this.findElement(oControl);
			var oElement = oRoot.element;
			oControl = oRoot.rootControl;
			var oNewDomRef;
			var oContainer;

			if (oElement && oElement instanceof sap.ui.layout.form.FormElement) {
				oContainer = oElement.getParent();
			} else if (oElement && oElement instanceof sap.ui.layout.form.FormContainer) {
				// current control is not inside an Element - maybe a title or expander?
				oContainer = oElement;
			}
			var oForm = oContainer.getParent();
			var aContainers = oForm.getFormContainers();
			var iCurrentIndex = oForm.indexOfFormContainer(oContainer);

			// goto previous container
			while (!oNewDomRef && iCurrentIndex >= 0) {
				var oPrevContainer = aContainers[iCurrentIndex - 1];
				if (!oPrevContainer.getExpandable() || oPrevContainer.getExpanded()) {
					oNewDomRef = this.findFirstFieldOfFirstElementInPrevContainer(oForm, iCurrentIndex - 1);
				}
				iCurrentIndex = iCurrentIndex - 1;
			}

			if (oNewDomRef) {
				jQuery.sap.focus(oNewDomRef);
				oEvent.preventDefault(); // to avoid moving cursor in next field
			}

		};

		FormLayout.prototype.onBeforeFastNavigationFocus = function(oEvent){
			if (jQuery.contains(this.getDomRef(), oEvent.source)) {
				oEvent.srcControl = jQuery(oEvent.source).control(0);
				if (oEvent.forward) {
					this.onsapskipforward(oEvent);
				} else {
					this.onsapskipback(oEvent);
				}
			} else {
				var oNewDomRef = oEvent.forward ? this.findFirstFieldOfForm(this.getParent()) : this.findFirstFieldOfLastContainerOfForm(this.getParent());
				if (oNewDomRef) {
					jQuery.sap.focus(oNewDomRef);
					oEvent.preventDefault();
				}
			}
		};

		FormLayout.prototype.findElement = function(oControl){
			// since the source control can be part of a child control or layout we have to look in the control tree
			// to find the FormElement where the control is assigned

			var oElement = oControl.getParent();
			var oRootControl = oControl;

			while (oElement && !(oElement instanceof sap.ui.layout.form.FormElement) &&
					!(oElement && oElement instanceof sap.ui.layout.form.FormContainer) &&
					!(oElement && oElement instanceof Form)) {
				oRootControl = oElement;
				oElement = oElement.getParent();
			}

			return ({rootControl: oRootControl, element: oElement});

		};

		FormLayout.prototype.navigateForward = function(oEvent){

			var oControl = oEvent.srcControl;
			var iCurrentIndex = 0;
			var oNewDomRef;
			var oRoot = this.findElement(oControl);
			var oElement = oRoot.element;
			oControl = oRoot.rootControl;

			if (oElement && oElement instanceof sap.ui.layout.form.FormElement) {
				if (oControl == oElement.getLabelControl()) {
					iCurrentIndex = -1;
				} else {
					iCurrentIndex = oElement.indexOfField(oControl);
				}
				oNewDomRef = this.findNextFieldOfElement(oElement, iCurrentIndex + 1);

				if (!oNewDomRef) {
					// use 1st field of next Element
					var oContainer = oElement.getParent();
					iCurrentIndex = oContainer.indexOfFormElement(oElement);
					oNewDomRef = this.findFirstFieldOfNextElement(oContainer, iCurrentIndex + 1);

					if (!oNewDomRef) {
						// no next element -> look in next container
						var oForm = oContainer.getParent();
						iCurrentIndex = oForm.indexOfFormContainer(oContainer);
						oNewDomRef = this.findFirstFieldOfFirstElementInNextContainer(oForm, iCurrentIndex + 1);
					}
				}
			} else if (oElement && oElement instanceof sap.ui.layout.form.FormContainer) {
				// current control is not inside an Element - maybe a title or expander?
				oNewDomRef = this.findFirstFieldOfNextElement(oElement, 0);
			}

			if (oNewDomRef) {
				jQuery.sap.focus(oNewDomRef);
				oEvent.preventDefault(); // to avoid moving cursor in next field
			}

		};

		FormLayout.prototype.tabForward = function(oEvent){

			var oForm;
			var oControl = oEvent.srcControl;
			var iCurrentIndex = 0;
			var oNewDomRef;
			var oRoot = this.findElement(oControl);
			var oElement = oRoot.element;
			oControl = oRoot.rootControl;

			if (oElement && oElement instanceof sap.ui.layout.form.FormElement) {
				if (oControl == oElement.getLabelControl()) {
					iCurrentIndex = -1;
				} else {
					iCurrentIndex = oElement.indexOfField(oControl);
				}
				oNewDomRef = this.findNextFieldOfElement(oElement, iCurrentIndex + 1, true);

				if (!oNewDomRef) {
					// use 1st field of next Element
					var oContainer = oElement.getParent();
					iCurrentIndex = oContainer.indexOfFormElement(oElement);
					oNewDomRef = this.findFirstFieldOfNextElement(oContainer, iCurrentIndex + 1, true);

					if (!oNewDomRef) {
						// no next element -> look in next container
						oForm = oContainer.getParent();
						iCurrentIndex = oForm.indexOfFormContainer(oContainer);
						oNewDomRef = this.findFirstFieldOfFirstElementInNextContainer(oForm, iCurrentIndex + 1, true);
					}
				}
			} else if (oElement && oElement instanceof sap.ui.layout.form.FormContainer) {
				// current control is not inside an Element - maybe a title or expander?
				oNewDomRef = this.findFirstFieldOfNextElement(oElement, 0, true);
				if (!oNewDomRef) {
					// no next element -> look in next container
					oForm = oElement.getParent();
					iCurrentIndex = oForm.indexOfFormContainer(oElement);
					oNewDomRef = this.findFirstFieldOfFirstElementInNextContainer(oForm, iCurrentIndex + 1, true);
				}
			}

			if (oNewDomRef) {
				jQuery.sap.focus(oNewDomRef);
				oEvent.preventDefault(); // to avoid moving cursor in next field
			}

		};

		FormLayout.prototype.findNextFieldOfElement = function(oElement, iStartIndex, bTabOver){

			var aFields = oElement.getFields();
			var iLength = aFields.length;
			var oNewDomRef;

			for ( var i = iStartIndex; i < iLength; i++) {
				// find the next enabled control thats rendered
				var oField = aFields[i];
				var oDomRef = this._getDomRef(oField);
				if (bTabOver == true) {
					if ((!oField.getEditable || oField.getEditable()) && (!oField.getEnabled || oField.getEnabled()) && oDomRef) {
						oNewDomRef = oDomRef;
						break;
					}
				} else {
					if ((!oField.getEnabled || oField.getEnabled()) && oDomRef) {
						oNewDomRef = oDomRef;
						break;
					}
				}
			}

			return oNewDomRef;

		};

		FormLayout.prototype.findFirstFieldOfNextElement = function(oContainer, iStartIndex, bTabOver){

			var aElements = oContainer.getFormElements();
			var iLength = aElements.length;
			var oNewDomRef;
			var i = iStartIndex;

			while (!oNewDomRef && i < iLength) {
				var oElement = aElements[i];
				if (bTabOver == true) {
					oNewDomRef = this.findNextFieldOfElement(oElement, 0, true);
				} else {
					oNewDomRef = this.findNextFieldOfElement(oElement, 0);
				}
				i++;
			}

			return oNewDomRef;

		};

		FormLayout.prototype.findFirstFieldOfForm = function(oForm){
			var aContainers = oForm.getFormContainers();
			var oNewDomRef;
			var oContainer = aContainers[0];
			if (!oContainer.getExpandable() || oContainer.getExpanded()) {
				oNewDomRef = this.findFirstFieldOfNextElement(oContainer, 0);
			}

			return oNewDomRef;

		};

		FormLayout.prototype.findFirstFieldOfLastContainerOfForm = function(oForm){
			var oNewDomRef;
			var aContainers = oForm.getFormContainers();
			var iCurrentIndex = aContainers.length;
			// goto previous container
			while (!oNewDomRef && iCurrentIndex >= 0) {
				var oPrevContainer = aContainers[iCurrentIndex - 1];
				if (!oPrevContainer.getExpandable() || oPrevContainer.getExpanded()) {
					oNewDomRef = this.findFirstFieldOfFirstElementInPrevContainer(oForm, iCurrentIndex - 1);
				}
				iCurrentIndex = iCurrentIndex - 1;
			}
			return oNewDomRef;
		};

		FormLayout.prototype.findFirstFieldOfFirstElementInNextContainer = function(oForm, iStartIndex, bTabOver){

			var aContainers = oForm.getFormContainers();
			var iLength = aContainers.length;
			var oNewDomRef;
			var i = iStartIndex;

			while (!oNewDomRef && i < iLength) {
				var oContainer = aContainers[i];
				if (oContainer.getExpandable() && bTabOver) {
					oNewDomRef = oContainer._oExpandButton.getFocusDomRef();
					if (oNewDomRef) {
						break;
					}
				}
				if (!oContainer.getExpandable() || oContainer.getExpanded()) {
					if (bTabOver == true) {
						oNewDomRef = this.findFirstFieldOfNextElement(oContainer, 0, true);
					} else {
						oNewDomRef = this.findFirstFieldOfNextElement(oContainer, 0);
					}
				}
				i++;
			}

			return oNewDomRef;

		};

		FormLayout.prototype.findFirstFieldOfFirstElementInPrevContainer = function(oForm, iStartIndex){

			var aContainers = oForm.getFormContainers();
			var iLength = aContainers.length;
			var oNewDomRef;
			var i = iStartIndex;

			while (!oNewDomRef && i < iLength && i >= 0) {
				var oContainer = aContainers[i];
				if (!oContainer.getExpandable() || oContainer.getExpanded()) {
					oNewDomRef = this.findFirstFieldOfNextElement(oContainer, 0);
				}
				i++;
			}

			return oNewDomRef;

		};

		FormLayout.prototype.navigateBack = function(oEvent){

			var oForm;
			var oControl = oEvent.srcControl;
			var iCurrentIndex = 0;
			var oNewDomRef;
			var oRoot = this.findElement(oControl);
			var oElement = oRoot.element;
			oControl = oRoot.rootControl;

			if (oElement && oElement instanceof sap.ui.layout.form.FormElement) {
				if (oControl == oElement.getLabelControl()) {
					iCurrentIndex = 0;
				} else {
					iCurrentIndex = oElement.indexOfField(oControl);
				}
				oNewDomRef = this.findPrevFieldOfElement(oElement, iCurrentIndex - 1);

				if (!oNewDomRef) {
					// use 1st field of next Element
					var oContainer = oElement.getParent();
					iCurrentIndex = oContainer.indexOfFormElement(oElement);
					oNewDomRef = this.findLastFieldOfPrevElement(oContainer, iCurrentIndex - 1);

					if (!oNewDomRef) {
						// no next element -> look in next container
						oForm = oContainer.getParent();
						iCurrentIndex = oForm.indexOfFormContainer(oContainer);
						oNewDomRef = this.findLastFieldOfLastElementInPrevContainer(oForm, iCurrentIndex - 1);
					}
				}
			} else if (oElement && oElement instanceof sap.ui.layout.form.FormContainer) {
				// current control is not inside an Element - maybe a title or expander?
				oForm = oElement.getParent();
				iCurrentIndex = oForm.indexOfFormContainer(oElement);
				oNewDomRef = this.findLastFieldOfLastElementInPrevContainer(oForm, iCurrentIndex - 1);
			}

			if (oNewDomRef) {
				jQuery.sap.focus(oNewDomRef);
				oEvent.preventDefault(); // to avoid moving cursor in next field
			}

		};

		FormLayout.prototype.tabBack = function(oEvent){

			var oForm;
			var oControl = oEvent.srcControl;
			var iCurrentIndex = 0;
			var oNewDomRef;
			var oRoot = this.findElement(oControl);
			var oElement = oRoot.element;
			oControl = oRoot.rootControl;

			if (oElement && oElement instanceof sap.ui.layout.form.FormElement) {
				if (oControl == oElement.getLabelControl()) {
					iCurrentIndex = 0;
				} else {
					iCurrentIndex = oElement.indexOfField(oControl);
				}
				oNewDomRef = this.findPrevFieldOfElement(oElement, iCurrentIndex - 1, true);

				if (!oNewDomRef) {
					// use 1st field of next Element
					var oContainer = oElement.getParent();
					iCurrentIndex = oContainer.indexOfFormElement(oElement);
					oNewDomRef = this.findLastFieldOfPrevElement(oContainer, iCurrentIndex - 1, true);

					if (!oNewDomRef) {
						// no next element -> look in next container
						oForm = oContainer.getParent();
						iCurrentIndex = oForm.indexOfFormContainer(oContainer);
						if (oContainer.getExpandable()) {
							oNewDomRef = oContainer._oExpandButton.getFocusDomRef();
						}
						if (!oNewDomRef) {
							oNewDomRef = this.findLastFieldOfLastElementInPrevContainer(oForm, iCurrentIndex - 1, true);
						}
					}
				}
			} else if (oElement && oElement instanceof sap.ui.layout.form.FormContainer) {
				// current control is not inside an Element - maybe a title or expander?
				oForm = oElement.getParent();
				iCurrentIndex = oForm.indexOfFormContainer(oElement);
				oNewDomRef = this.findLastFieldOfLastElementInPrevContainer(oForm, iCurrentIndex - 1, true);
			}

			if (oNewDomRef) {
				jQuery.sap.focus(oNewDomRef);
				oEvent.preventDefault(); // to avoid moving cursor in next field
			}

		};

		FormLayout.prototype.findPrevFieldOfElement = function(oElement, iStartIndex, bTabOver){

			var aFields = oElement.getFields();
			var oNewDomRef;

			for ( var i = iStartIndex; i >= 0; i--) {
				// find the next enabled control thats rendered
				var oField = aFields[i];
				var oDomRef = this._getDomRef(oField);
				if (bTabOver == true) {
					if ((!oField.getEditable || oField.getEditable()) && (!oField.getEnabled || oField.getEnabled()) && oDomRef) {
						oNewDomRef = oDomRef;
						break;
					}
				} else {
					if ((!oField.getEnabled || oField.getEnabled()) && oDomRef) {
						oNewDomRef = oDomRef;
						break;
					}
				}
			}

			return oNewDomRef;

		};

		FormLayout.prototype.findLastFieldOfPrevElement = function(oContainer, iStartIndex, bTabOver){

			var aElements = oContainer.getFormElements();
			var oNewDomRef;
			var i = iStartIndex;

			while (!oNewDomRef && i >= 0) {
				var oElement = aElements[i];
				var iLength = oElement.getFields().length;

				if (bTabOver == true) {
					oNewDomRef = this.findPrevFieldOfElement(oElement, iLength - 1, true);
				} else {
					oNewDomRef = this.findPrevFieldOfElement(oElement, iLength - 1);
				}
				i--;
			}

			return oNewDomRef;

		};

		FormLayout.prototype.findLastFieldOfLastElementInPrevContainer = function(oForm, iStartIndex, bTabOver){

			var aContainers = oForm.getFormContainers();
			var oNewDomRef;
			var i = iStartIndex;

			while (!oNewDomRef && i >= 0) {
				var oContainer = aContainers[i];
				if (oContainer.getExpandable() && !oContainer.getExpanded() && bTabOver) {
					oNewDomRef = oContainer._oExpandButton.getFocusDomRef();
					if (oNewDomRef) {
						break;
					}
				}
				if (!oContainer.getExpandable() || oContainer.getExpanded()) {
					var iLength = oContainer.getFormElements().length;
					if (bTabOver == true) {
						oNewDomRef = this.findLastFieldOfPrevElement(oContainer, iLength - 1, true);
					} else {
						oNewDomRef = this.findLastFieldOfPrevElement(oContainer, iLength - 1, 0);
					}
				}
				i--;
			}

			return oNewDomRef;

		};

		FormLayout.prototype.findFieldBelow = function(oControl, oElement){

			var oContainer = oElement.getParent();
			var iCurrentIndex = oContainer.indexOfFormElement(oElement);
			var oNewDomRef = this.findFirstFieldOfNextElement(oContainer, iCurrentIndex + 1);

			if (!oNewDomRef) {
				// no next element -> look in next container
				var oForm = oContainer.getParent();
				iCurrentIndex = oForm.indexOfFormContainer(oContainer);
				oNewDomRef = this.findFirstFieldOfFirstElementInNextContainer(oForm, iCurrentIndex + 1);
			}

			return oNewDomRef;

		};

		FormLayout.prototype.findFieldAbove = function(oControl, oElement){

			var oContainer = oElement.getParent();
			var iCurrentIndex = oContainer.indexOfFormElement(oElement);

			var aElements = oContainer.getFormElements();
			var oNewDomRef;
			var i = iCurrentIndex - 1;

			while (!oNewDomRef && i >= 0) {
				var oMyElement = aElements[i];
				oNewDomRef = this.findPrevFieldOfElement(oMyElement, 0);
				i--;
			}

			if (!oNewDomRef) {
				// no next element -> look in previous container
				var oForm = oContainer.getParent();
				iCurrentIndex = oForm.indexOfFormContainer(oContainer);
				oNewDomRef = this.findLastFieldOfLastElementInPrevContainer(oForm, iCurrentIndex - 1);
			}

			return oNewDomRef;

		};

		FormLayout.prototype._getDomRef = function( oControl ){

			// get focusDOMRef of the control, but only if it's focusable
			var oDomRef = oControl.getFocusDomRef();
			if (!jQuery(oDomRef).is(":sapFocusable")) {
				oDomRef = undefined;
			}

			return oDomRef;

		};

		/**
		 * As Elements must not have a DOM reference it is not sure if one exists
		 * In this basic <code>FormLayout</code> each <code>FormContainer</code> has its own DOM.
		 * @param {sap.ui.layout.form.FormContainer} oContainer <code>FormContainer</code>
		 * @return {Element} The Element's DOM representation or null
		 * @private
		 */
		FormLayout.prototype.getContainerRenderedDomRef = function(oContainer) {

			if (this.getDomRef()) {
				return jQuery.sap.domById(oContainer.getId());
			}else {
				return null;
			}

		};

		/**
		 * As Elements must not have a DOM reference it is not sure if one exists
		 * In this basic <code>FormLayout</code> each <code>FormElement</code> has its own DOM.
		 * @param {sap.ui.layout.form.FormElement} oElement <code>FormElement</code>
		 * @return {Element} The Element's DOM representation or null
		 * @private
		 */
		FormLayout.prototype.getElementRenderedDomRef = function(oElement) {

			if (this.getDomRef()) {
				return jQuery.sap.domById(oElement.getId());
			}else {
				return null;
			}

		};

	}());


	return FormLayout;

}, /* bExport= */ true);
