/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.layout.form.SimpleForm.
sap.ui.define(['jquery.sap.global', 'sap/ui/core/Control', 'sap/ui/layout/ResponsiveFlowLayoutData', './Form', './FormContainer', './FormElement', './FormLayout', 'sap/ui/layout/library'],
	function(jQuery, Control, ResponsiveFlowLayoutData, Form, FormContainer, FormElement, FormLayout, library) {
	"use strict";

	/**
	 * Constructor for a new sap.ui.layout.form.SimpleForm.
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * The <code>SimpleForm</code> provides an easy to use API to create simple forms.
	 * Inside a <code>SimpleForm</code>, a <code>Form</code> control is created along with its <code>FormContainers</code> and <code>FormElements</code>, but the complexity in the API is removed.
	 * <ul>
	 * <li>A new title starts a new group (<code>FormContainer</code>) in the form.</li>
	 * <li>A new label starts a new row (<code>FormElement</code>) in the form.</li>
	 * <li>All other controls will be assigned to the row (<code>FormElement</code>) started with the last label.</li>
	 * </ul>
	 * Use <code>LayoutData</code> to influence the layout for special cases in the Input/Display controls.
	 * <b>Note:</b> If a more complex form is needed, use <code>Form</code> instead.
	 * @extends sap.ui.core.Control
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @since 1.16.0
	 * @alias sap.ui.layout.form.SimpleForm
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var SimpleForm = Control.extend("sap.ui.layout.form.SimpleForm", /** @lends sap.ui.layout.form.SimpleForm.prototype */ { metadata : {

		library : "sap.ui.layout",
		properties : {

			/**
			 * The maximum amount of groups (<code>FormContainers</code>) per row that is used before a new row is started.
			 * <b>Note:</b> If a <code>ResponsiveGridLayout</code> is used as a layout, this property is not used. Please use the properties <code>ColumnsL</code> and <code>ColumnsM</code> in this case.
			 */
			maxContainerCols : {type : "int", group : "Appearance", defaultValue : 2},

			/**
			 * The overall minimum width in pixels that is used for the <code>SimpleForm</code>. If the available width is below the given minWidth the SimpleForm will create a new row for the next group (<code>FormContainer</code>).
			 * The default value is -1, meaning that inner groups (<code>FormContainers</code>) will be stacked until maxCols is reached, irrespective of whether a maxWidth is reached or the available parents width is reached.
			 * <b>Note:</b> This property is only used if a <code>ResponsiveLayout</code> is used as a layout.
			 */
			minWidth : {type : "int", group : "Appearance", defaultValue : -1},

			/**
			 * Width of the form.
			 * @since 1.28.0
			 */
			width : {type : "sap.ui.core.CSSSize", group : "Dimension", defaultValue : null},

			/**
			 * Applies a device-specific and theme-specific line-height to the form rows if the form has editable content.
			 * If set, all (not only the editable) rows of the form will get the line height of editable fields.
			 * The accessibility aria-readonly attribute is set according to this property.
			 * <b>Note:</b> The setting of the property has no influence on the editable functionality of the form's content.
			 */
			editable : {type : "boolean", group : "Misc", defaultValue : null},

			/**
			 * Specifies the min-width in pixels of the label in all form containers.
			 * <b>Note:</b> This property is only used if a <code>ResponsiveLayout</code> is used as a layout.
			 */
			labelMinWidth : {type : "int", group : "Misc", defaultValue : 192},

			/**
			 * The <code>FormLayout</code> that is used to render the <code>SimpleForm</code>.
			 * We suggest using the <code>ResponsiveGridLayout</code> for rendering a <code>SimpleForm</code>, as its responsiveness uses the space available in the best way possible.
			 */
			layout : {type : "sap.ui.layout.form.SimpleFormLayout", group : "Misc", defaultValue : sap.ui.layout.form.SimpleFormLayout.ResponsiveLayout},

			/**
			 * Default span for labels in large size.
			 * This span is only used if more than 1 group (<code>FormContainer</code>) is in one row. If only 1 group (<code>FormContainer</code>) is in the row the <code>labelSpanM</code> value is used.
			 * <b>Note:</b> This property is only used if a <code>ResponsiveGridLayout</code> is used as a layout.
			 * @since 1.16.3
			 */
			labelSpanL : {type : "int", group : "Misc", defaultValue : 4},

			/**
			 * Default span for labels in medium size.
			 * This property is used for full-size groups (<code>FormContainers</code>). If more than one group (<code>FormContainer</code>) is in one line, <code>labelSpanL</code> is used.
			 * <b>Note:</b> This property is only used if a <code>ResponsiveGridLayout</code> is used as a layout.
			 * @since 1.16.3
			 */
			labelSpanM : {type : "int", group : "Misc", defaultValue : 2},

			/**
			 * Default span for labels in small size.
			 * <b>Note:</b> This property is only used if a <code>ResponsiveGridLayout</code> is used as a layout.
			 * @since 1.16.3
			 */
			labelSpanS : {type : "int", group : "Misc", defaultValue : 12},

			/**
			 * Number of grid cells that are empty at the end of each line on large size.
			 * <b>Note:</b> This property is only used if a <code>ResponsiveGridLayout</code> is used as a layout.
			 * @since 1.16.3
			 */
			emptySpanL : {type : "int", group : "Misc", defaultValue : 0},

			/**
			 * Number of grid cells that are empty at the end of each line on medium size.
			 * <b>Note:</b> This property is only used if a <code>ResponsiveGridLayout</code> is used as a layout.
			 * @since 1.16.3
			 */
			emptySpanM : {type : "int", group : "Misc", defaultValue : 0},

			/**
			 * Number of grid cells that are empty at the end of each line on small size.
			 * <b>Note:</b> This property is only used if a <code>ResponsiveGridLayout</code> is used as a layout.
			 * @since 1.16.3
			 */
			emptySpanS : {type : "int", group : "Misc", defaultValue : 0},

			/**
			 * Form columns for large size.
			 * The number of columns for large size must not be smaller than the number of columns for medium size.
			 * <b>Note:</b> This property is only used if a <code>ResponsiveGridLayout</code> is used as a layout.
			 * @since 1.16.3
			 */
			columnsL : {type : "int", group : "Misc", defaultValue : 2},

			/**
			 * Form columns for medium size.
			 * <b>Note:</b> This property is only used if a <code>ResponsiveGridLayout</code> is used as a layout.
			 * @since 1.16.3
			 */
			columnsM : {type : "int", group : "Misc", defaultValue : 1},

			/**
			 * Breakpoint between Medium size and Large size.
			 * <b>Note:</b> This property is only used if a <code>ResponsiveGridLayout</code> is used as a layout.
			 * @since 1.16.3
			 */
			breakpointL : {type : "int", group : "Misc", defaultValue : 1024},

			/**
			 * Breakpoint between Small size and Medium size.
			 * <b>Note:</b> This property is only used if a <code>ResponsiveGridLayout</code> is used as a layout.
			 * @since 1.16.3
			 */
			breakpointM : {type : "int", group : "Misc", defaultValue : 600}
		},
		defaultAggregation : "content",
		aggregations : {

			/**
			 * The content of the form is structured in the following way:
			 * <ul>
			 * <li>Add a <code>Title</code> control to start a new group (<code>FormContainer</code>).</li>
			 * <li>Add a <code>Label</code> control to start a new row (<code>FormElement</code>).</li>
			 * <li>Add controls as input fields, text fields or other as needed.</li>
			 * <li>Use <code>LayoutData</code> to influence the layout for special cases in the single controls.
			 * For example, if a <code>ResponsiveLayout</code> is used as a layout, the form content is weighted using weight 3 for the labels and weight 5 for the fields part. By default the label column is 192 pixels wide.
			 * If your input controls should influence their width, you can add <code>sap.ui.layout.ResponsiveFlowLayoutData</code> to them via <code>setLayoutData</code> method.
			 * Ensure that the sum of the weights in the <code>ResponsiveFlowLayoutData</code> is not more than 5, as this is the total width of the input control part of each form row.</li>
			 * </ul>
			 * Example for a row where the <code>TextField</code> takes 4 and the <code>TextView</code> takes 1 weight (using <code>ResponsiveLayout</code>):
			 * <pre>
			 * new sap.ui.commons.Label({text:"Label"});
			 * new sap.ui.commons.TextField({value:"Weight 4",
			 * layoutData:new sap.ui.layout.ResponsiveFlowLayoutData({weight:4})}),
			 * new sap.ui.commons.TextView({text:"Weight 1",
			 * layoutData: new sap.ui.layout.ResponsiveFlowLayoutData({weight:1})}),
			 * </pre>
			 */
			content : {type : "sap.ui.core.Element", multiple : true, singularName : "content"}, 

			/**
			 * Hidden, for internal use only.
			 */
			form : {type : "sap.ui.layout.form.Form", multiple : false, visibility : "hidden"}, 

			/**
			 * Title element of the <code>SimpleForm</code>. Can either be a <code>Title</code> control, or a string.
			 * @since 1.16.3
			 */
			title : {type : "sap.ui.core.Title", altTypes : ["string"], multiple : false}
		},
		associations: {

			/**
			 * Association to controls / IDs which label this control (see WAI-ARIA attribute aria-labelledby).
			 * @since 1.32.0
			 */
			ariaLabelledBy: { type: "sap.ui.core.Control", multiple: true, singularName: "ariaLabelledBy" }
		}
	}});

	///**
	//* This file defines behavior for the control,
	//*/

	(function() {

		SimpleForm.prototype.init = function() {

			this._iMaxWeight = 8;
			this._iLabelWeight = 3;
			this._iCurrentWidth = 0;
			var oForm = new Form(this.getId() + "--Form");
			// use title of SimpleForm in Form
			oForm.getTitle = function(){
				return this.getParent().getTitle();
			};
			oForm._origInvalidate = oForm.invalidate;
			oForm.invalidate = function(oOrigin) {
				this._origInvalidate(arguments);
				if (this._bIsBeingDestroyed) {
					return;
				}
				var oSimpleForm = this.getParent();
				if (oSimpleForm) {
					oSimpleForm._formInvalidated(oOrigin);
				}
			};

			oForm.getAriaLabelledBy = function(){
				var oSimpleForm = this.getParent();
				if (oSimpleForm) {
					return oSimpleForm.getAriaLabelledBy();
				}else {
					return null;
				}
			};

			this.setAggregation("form",oForm);
			this._aElements = null;
			this._aLayouts = [];
			this._changedFormContainers = [];
			this._changedFormElements = [];

		};

		SimpleForm.prototype.exit = function() {

			var oForm = this.getAggregation("form");
			oForm.invalidate = oForm._origInvalidate;

			if (this._sResizeListenerId) {
				sap.ui.core.ResizeHandler.deregister(this._sResizeListenerId);
				this._sResizeListenerId = null;
			}
			for (var i = 0;i < this._aLayouts.length;i++) {
				var oLayout = sap.ui.getCore().byId(this._aLayouts[i]);
				if (oLayout && oLayout.destroy) {
					oLayout.destroy();
				}
			}
			this._aLayouts = [];
			this._aElements = null;
			this._changedFormContainers = [];
			this._changedFormElements = [];

		};

		/*
		 * Update FormContainers, FormElements and LayoutData before controls are rendered
		 */
		SimpleForm.prototype.onBeforeRendering = function() {

			this._bChangedByMe = true;
			//unregister resize
			if (this._sResizeListenerId) {
				sap.ui.core.ResizeHandler.deregister(this._sResizeListenerId);
				this._sResizeListenerId = null;
			}
			var that = this;

			var oForm = this.getAggregation("form");
			if (!oForm.getLayout()) {
				_setFormLayout(that);
			}

			_updateFormContainers(that);
			this._bChangedByMe = false;

		};

		SimpleForm.prototype.onAfterRendering = function() {

			if (this.getLayout() == sap.ui.layout.form.SimpleFormLayout.ResponsiveLayout) {
				this._bChangedByMe = true;
				this.$().css("visibility", "hidden"); //avoid that a wrong layouting is visible
				this._applyLinebreaks();

				//attach the resize handler
				this._sResizeListenerId = sap.ui.core.ResizeHandler.register(this.getDomRef(),  jQuery.proxy(this._resize, this));
				this._bChangedByMe = false;
			}

		};

		SimpleForm.prototype.setEditable = function(bEditable) {

			this._bChangedByMe = true;
			this.setProperty("editable", bEditable, true);

			var oForm = this.getAggregation("form");
			oForm.setEditable(bEditable);

			this._bChangedByMe = false;
			return this;

		};

		/*
		 * Overwrite generated functions to use internal array to look for aggregation
		 */
		SimpleForm.prototype.indexOfContent = function(oObject) {

			var aChildren = this._aElements;
			if (aChildren) {
				for (var i = 0; i < aChildren.length; i++) {
					if (aChildren[i] == oObject) {
						return i;
					}
				}
			}
			return -1;

		};

		SimpleForm.prototype.addContent = function(oElement) {

			this._bChangedByMe = true;
			oElement = this.validateAggregation("content", oElement, /* multiple */ true);

			if (!this._aElements) {
				this._aElements = [];
			}

			// try to find corresponding FormElement and FormContainer to update them
			var iLength = this._aElements.length;
			var oLastElement;
			var oForm = this.getAggregation("form");
			var oFormContainer;
			var oFormElement;
			var oParent;
			var oLayoutData;

			if (oElement instanceof sap.ui.core.Title) {
				//start a new container with a title
				oFormContainer = _createFormContainer(this, oElement);
				oForm.addFormContainer(oFormContainer);
				this._changedFormContainers.push(oFormContainer);
			} else if (oElement.getMetadata().isInstanceOf("sap.ui.core.Label")) { // if the control implements the label interface
				// new label -> create new FormElement
				// determine Container from last Content element
				if (iLength > 0) {
					oLastElement = this._aElements[iLength - 1];
					oParent = oLastElement.getParent();
					if (oParent instanceof FormElement) {
						oFormContainer = oParent.getParent();
					} else if (oParent instanceof FormContainer) {
						oFormContainer = oParent;
					}
				}
				if (!oFormContainer) {
					oFormContainer = _createFormContainer(this);
					oForm.addFormContainer(oFormContainer);
					this._changedFormContainers.push(oFormContainer);
				}

				oFormElement = _addFormElement(this, oFormContainer, oElement);
			} else {
				// new Field -> add to last FormElement
				if (iLength > 0) {
					oLastElement = this._aElements[iLength - 1];
					oParent = oLastElement.getParent();
					if (oParent instanceof FormElement) {
						oFormContainer = oParent.getParent();
						oFormElement = oParent;
						oLayoutData = _getFieldLayoutData(this, oElement);
						if (oLayoutData instanceof ResponsiveFlowLayoutData && !_isMyLayoutData(this, oLayoutData)) {
							if (oLayoutData.getLinebreak()) {
								oFormElement = _addFormElement(this, oFormContainer);
							}
						}
					} else if (oParent instanceof FormContainer) {
						oFormContainer = oParent;
						oFormElement = _addFormElement(this, oFormContainer);
					}
				} else {
					// no FormContainer and FormElement exists
					oFormContainer = _createFormContainer(this);
					oForm.addFormContainer(oFormContainer);
					this._changedFormContainers.push(oFormContainer);
					oFormElement = _addFormElement(this, oFormContainer);
				}

				_createFieldLayoutData(this, oElement, 5, false, true);

				oFormElement.addField(oElement);
				_markFormElementForUpdate(this._changedFormElements, oFormElement);
			}

			this._aElements.push(oElement);
			oElement.attachEvent("_change", _handleContentChange, this);
			this.invalidate();
			this._bChangedByMe = false;
			return this;

		};

		SimpleForm.prototype.insertContent = function(oElement, iIndex) {

			oElement = this.validateAggregation("content", oElement, /* multiple */ true);

			if (!this._aElements) {
				this._aElements = [];
			}

			var iLength = this._aElements.length;
			var iNewIndex;
			if (iIndex < 0) {
				iNewIndex = 0;
			} else if (iIndex > iLength) {
				iNewIndex = iLength;
			} else {
				iNewIndex = iIndex;
			}
			if (iNewIndex !== iIndex) {
				jQuery.sap.log.warning("SimpleForm.insertContent: index '" + iIndex + "' out of range [0," + iLength + "], forced to " + iNewIndex);
			}

			if (iNewIndex == iLength) {
				// just added to the end -> use add function
				this.addContent(oElement);
				return this;
			}

			this._bChangedByMe = true;
			var oOldElement = this._aElements[iNewIndex];
			var oForm = this.getAggregation("form");
			var oFormContainer;
			var oFormElement;
			var oOldFormContainer;
			var oOldFormElement;
			var iContainerIndex;
			var iElementIndex = 0;
			var iFieldIndex;
			var aFields;
			var aFormElements;
			var aFormContainers;
			var i = 0;
			var oField;

			if (oElement instanceof sap.ui.core.Title) {
				//start a new container with a title
				if (iIndex == 0 && !(oOldElement instanceof sap.ui.core.Title)) {
					// special case - index==0 and first container has no title -> just add title to Container
					oFormContainer = oOldElement.getParent().getParent();
					oFormContainer.setTitle(oElement);
				} else {
					oFormContainer = _createFormContainer(this, oElement);
					if (oOldElement instanceof sap.ui.core.Title) {
						// insert before old container
						oOldFormContainer = oOldElement.getParent();
						iContainerIndex = oForm.indexOfFormContainer(oOldFormContainer);
					} else {
						// insert after old container
						oOldFormElement = oOldElement.getParent();
						oOldFormContainer = oOldFormElement.getParent();
						iContainerIndex = oForm.indexOfFormContainer(oOldFormContainer) + 1;
						iElementIndex = oOldFormContainer.indexOfFormElement(oOldFormElement);

						// check if old FormElement must be splited
						if (!oOldElement.getMetadata().isInstanceOf("sap.ui.core.Label")) {
							iFieldIndex = oOldFormElement.indexOfField(oOldElement);
							if (iFieldIndex > 0 || oOldFormElement.getLabel()) {
								// split FormElement
								oFormElement = _addFormElement(this, oFormContainer);
								this._changedFormElements.push(oFormElement);
								_markFormElementForUpdate(this._changedFormElements, oOldFormElement);
								// move all Fields after index into new FormElement
								aFields = oOldFormElement.getFields();
								for ( i = iFieldIndex; i < aFields.length; i++) {
									oField = aFields[i];
									oFormElement.addField(oField);
								}
								iElementIndex++;
							}
						}
						// move all FormElements after the new content into the new container
						aFormElements = oOldFormContainer.getFormElements();
						for ( i = iElementIndex; i < aFormElements.length; i++) {
							oFormContainer.addFormElement(aFormElements[i]);
						}
					}
					oForm.insertFormContainer(oFormContainer, iContainerIndex);
				}
				this._changedFormContainers.push(oFormContainer);
			} else if (oElement.getMetadata().isInstanceOf("sap.ui.core.Label")) {
				if (oOldElement instanceof sap.ui.core.Title) {
					// add new FormElement to previous container
					oOldFormContainer = oOldElement.getParent();
					iContainerIndex = oForm.indexOfFormContainer(oOldFormContainer);
					aFormContainers = oForm.getFormContainers();
					oFormContainer = aFormContainers[iContainerIndex - 1];
					oFormElement = _addFormElement(this, oFormContainer, oElement);
				} else if (oOldElement.getMetadata().isInstanceOf("sap.ui.core.Label")) {
					// insert new form element before this one
					oOldFormContainer = oOldElement.getParent().getParent();
					iElementIndex = oOldFormContainer.indexOfFormElement(oOldElement.getParent());
					oFormElement = _insertFormElement(this, oOldFormContainer, oElement, iElementIndex);
				} else {
					// split FormElement
					oOldFormElement = oOldElement.getParent();
					oOldFormContainer = oOldFormElement.getParent();
					iElementIndex = oOldFormContainer.indexOfFormElement(oOldFormElement) + 1;
					iFieldIndex = oOldFormElement.indexOfField(oOldElement);

					if (iFieldIndex == 0 && !oOldFormElement.getLabel()) {
						// special case: Form Element has no label and inserted before first Field
						oFormElement = oOldFormElement;
						oFormElement.setLabel(oElement);
						_createFieldLayoutData(this, oElement, this._iLabelWeight, false, true, this.getLabelMinWidth());
					} else {
						oFormElement = _insertFormElement(this, oOldFormContainer, oElement, iElementIndex);
						_markFormElementForUpdate(this._changedFormElements, oOldFormElement);

						// move all Fields after index into new FormElement
						aFields = oOldFormElement.getFields();
						for ( i = iFieldIndex; i < aFields.length; i++) {
							oField = aFields[i];
							oFormElement.addField(oField);
						}
					}
				}
				this._changedFormElements.push(oFormElement);
			} else { // new field
				if (oOldElement instanceof sap.ui.core.Title) {
					// add new Field to last FormElement of previous FormContainer
					oOldFormContainer = oOldElement.getParent();
					iContainerIndex = oForm.indexOfFormContainer(oOldFormContainer);

					if (iContainerIndex == 0) {
						// it's the first container - insert new container before
						oFormContainer = _createFormContainer(this);
						oForm.insertFormContainer(oFormContainer, iContainerIndex);
						this._changedFormContainers.push(oFormContainer);
					} else {
						aFormContainers = oForm.getFormContainers();
						oFormContainer = aFormContainers[iContainerIndex - 1];
					}

					aFormElements = oFormContainer.getFormElements();
					if (aFormElements.length == 0) {
						// container has no FormElements -> create one
						oFormElement = _addFormElement(this, oFormContainer);
					} else {
						oFormElement = aFormElements[aFormElements.length - 1];
					}

					oFormElement.addField(oElement);
				} else if (oOldElement.getMetadata().isInstanceOf("sap.ui.core.Label")) {
					// add new field to previous FormElement
					oOldFormElement = oOldElement.getParent();
					oFormContainer = oOldFormElement.getParent();
					iElementIndex = oFormContainer.indexOfFormElement(oOldFormElement);

					if (iElementIndex == 0) {
						// it's already the first FormElement -> insert a new one before
						oFormElement = _insertFormElement(this, oFormContainer, null, 0);
					} else {
						aFormElements = oFormContainer.getFormElements();
						oFormElement = aFormElements[iElementIndex - 1];
					}
					oFormElement.addField(oElement);
				} else {
					// insert new field into same FormElement before old field
					oFormElement = oOldElement.getParent();
					iFieldIndex = oFormElement.indexOfField(oOldElement);
					oFormElement.insertField(oElement, iFieldIndex);
				}
				_markFormElementForUpdate(this._changedFormElements, oFormElement);

				_createFieldLayoutData(this, oElement, 5, false, true);
			}

			this._aElements.splice(iNewIndex, 0, oElement);
			oElement.attachEvent("_change", _handleContentChange, this);
			this.invalidate();
			this._bChangedByMe = false;
			return this;

		};

		SimpleForm.prototype.removeContent = function(vElement) {

			var oElement = null;
			var iIndex = -1;
			var i = 0;

			if (this._aElements) {

				if (typeof (vElement) == "string") { // ID of the element is given
					vElement = sap.ui.getCore().byId(vElement);
				}

				if (typeof (vElement) == "object") { // the element itself is given or has just been retrieved
					for (i = 0; i < this._aElements.length; i++) {
						if (this._aElements[i] == vElement) {
							vElement = i;
							break;
						}
					}
				}

				if (typeof (vElement) == "number") { // "vElement" is the index now
					if (vElement < 0 || vElement >= this._aElements.length) {
						jQuery.sap.log.warning("Element.removeAggregation called with invalid index: Items, " + vElement);
					} else {
						iIndex = vElement;
						oElement = this._aElements[iIndex];
					}
				}
			}
			if (oElement) {
				this._bChangedByMe = true;
				var oForm = this.getAggregation("form");
				var oFormContainer;
				var oFormElement;
				var aFormElements;
				var aFields;

				if (oElement instanceof sap.ui.core.Title) {
					oFormContainer = oElement.getParent();
					oFormContainer.setTitle(null);
					if (iIndex > 0) {
						// if it's the first container -> just remove title
						// remove container and add content to previous container
						aFormElements = oFormContainer.getFormElements();
						var iContainerIndex = oForm.indexOfFormContainer(oFormContainer);
						var oPrevFormContainer = oForm.getFormContainers()[iContainerIndex - 1];
						if (aFormElements.length > 0 && !aFormElements[0].getLabel()) {
							// first Form Element has no label -> add its fields to last Form Element of previous container
							var aPrevFormElements = oPrevFormContainer.getFormElements();
							var oLastFormElement = aPrevFormElements[aPrevFormElements.length - 1];
							aFields = aFormElements[0].getFields();
							for (i = 0; i < aFields.length; i++) {
								oLastFormElement.addField(aFields[i]);
							}
							_markFormElementForUpdate(this._changedFormElements, oLastFormElement);
							oFormContainer.removeFormElement(aFormElements[0]);
							aFormElements[0].destroy();
							aFormElements.splice(0,1);
						}
						for (i = 0; i < aFormElements.length; i++) {
							oPrevFormContainer.addFormElement(aFormElements[i]);
						}
						_markFormElementForUpdate(this._changedFormContainers, oPrevFormContainer);
						oForm.removeFormContainer(oFormContainer);
						oFormContainer.destroy();
					}
				} else if (oElement.getMetadata().isInstanceOf("sap.ui.core.Label")) {
					oFormElement = oElement.getParent();
					oFormContainer = oFormElement.getParent();
					oFormElement.setLabel(null);
					var iElementIndex = oFormContainer.indexOfFormElement(oFormElement);
					if (iElementIndex == 0) {
						// its the first Element of the container -> just remove label
						if (!oFormElement.getFields()) {
							// FormElement has no fields -> just delete
							oFormContainer.removeFormElement(oFormElement);
							oFormElement.destroy();
						} else {
							_markFormElementForUpdate(this._changedFormElements, oFormElement);
						}
					} else {
						// add fields to previous FormElement
						aFormElements = oFormContainer.getFormElements();
						var oPrevFormElement = aFormElements[iElementIndex - 1];
						aFields = oFormElement.getFields();
						for (i = 0; i < aFields.length; i++) {
							oPrevFormElement.addField(aFields[i]);
						}
						_markFormElementForUpdate(this._changedFormElements, oPrevFormElement);
						oFormContainer.removeFormElement(oFormElement);
						oFormElement.destroy();
					}
				} else { // remove field
					oFormElement = oElement.getParent();
					oFormElement.removeField(oElement);
					if (!oFormElement.getFields() && !oFormElement.getLabel()) {
						// FormElement has no more fields and no label -> just delete
						oFormContainer = oFormElement.getParent();
						oFormContainer.removeFormElement(oFormElement);
						oFormElement.destroy();
					} else {
						_markFormElementForUpdate(this._changedFormElements, oFormElement);
					}
				}

				this._aElements.splice(iIndex, 1);
				oElement.setParent(null);
				oElement.detachEvent("_change", _handleContentChange, this);
				_removeLayoutData(this, oElement);

				this.invalidate();
				this._bChangedByMe = false;
				return oElement;
			}
			return null;

		};

		SimpleForm.prototype.removeAllContent = function() {

			var i = 0;

			if (this._aElements) {
				this._bChangedByMe = true;
				var oForm = this.getAggregation("form");
				var aFormContainers = oForm.getFormContainers();
				for (i = 0; i < aFormContainers.length; i++) {
					var oFormContainer = aFormContainers[i];
					oFormContainer.setTitle(null);
					var aFormElements = oFormContainer.getFormElements();
					for ( var j = 0; j < aFormElements.length; j++) {
						var oFormElement = aFormElements[j];
						oFormElement.setLabel(null);
						oFormElement.removeAllFields();
					}
					oFormContainer.destroyFormElements();
				}
				oForm.destroyFormContainers();

				for (i = 0; i < this._aElements.length; i++) {
					var oElement = this._aElements[i];
					_removeLayoutData(this, oElement);
					oElement.detachEvent("_change", _handleContentChange, this);
				}
				var aElements = this._aElements;
				this._aElements = null;
				this.invalidate();
				this._bChangedByMe = false;
				return aElements;
			} else {
				return [];
			}

		};

		SimpleForm.prototype.destroyContent = function() {

			var aElements = this.removeAllContent();

			if (aElements) {
				this._bChangedByMe = true;
				for (var i = 0; i < aElements.length; i++) {
					aElements[i].destroy();
				}
				this.invalidate();
				this._bChangedByMe = false;
			}
			return this;

		};

		SimpleForm.prototype.getContent = function() {

			if (!this._aElements) {
				this._aElements = this.getAggregation("content", []);
			}
			return this._aElements;

		};

	/*
	 * Set the FormLayout to the Form. If a FormLayout is already set, just set a new one.
	 */
		SimpleForm.prototype.setLayout = function(sLayout) {

			this._bChangedByMe = true;
			var sOldLayout = this.getLayout();
			this.setProperty("layout", sLayout);

			if (sLayout != sOldLayout) {
				var that = this;
				_setFormLayout(that);

				// update LayoutData for Containers, Elements and Fields
				var oForm = this.getAggregation("form");
				var aContainers = oForm.getFormContainers();
				var aElements;
				var aFields;
				var oLayoutData;

				for ( var i = 0; i < aContainers.length; i++) {
					var oContainer = aContainers[i];
					this._changedFormContainers.push(oContainer);
					oLayoutData = oContainer.getLayoutData();
					if (oLayoutData) {
						oLayoutData.destroy();
					}
					_createContainerLayoutData(this, oContainer);
					aElements = oContainer.getFormElements();
					for ( var j = 0; j < aElements.length; j++) {
						var oElement = aElements[j];
						_markFormElementForUpdate(this._changedFormElements, oElement);
						oLayoutData = oElement.getLayoutData();
						if (oLayoutData) {
							oLayoutData.destroy();
						}
						_createElementLayoutData(this, oElement);
						var oLabel = oElement.getLabel();
						if (oLabel) {
							_removeLayoutData(this, oLabel);
							_createFieldLayoutData(this, oLabel, this._iLabelWeight, false, true, this.getLabelMinWidth());
						}
						aFields = oElement.getFields();
						for ( var k = 0; k < aFields.length; k++) {
							var oField = aFields[k];
							_removeLayoutData(this, oField);
							_createFieldLayoutData(this, oField, 5, false, true);
						}
					}
				}
			}

			this._bChangedByMe = false;
			return this;

		};

		/*
		 * Overwrite the clone function because content will not be cloned in default one
		 */
		SimpleForm.prototype.clone = function(sIdSuffix) {

			this._bChangedByMe = true;
			var oClone = Control.prototype.clone.apply(this, arguments);
			var aContent = this.getContent();

			for ( var i = 0; i < aContent.length; i++) {
				var oElement = aContent[i];
				var oLayoutData = oElement.getLayoutData();
				var oElementClone = oElement.clone(sIdSuffix);
				if (oLayoutData) {
					// mark private LayoutData
					if (oLayoutData.getMetadata().getName() == "sap.ui.core.VariantLayoutData") {
						var aLayoutData = oLayoutData.getMultipleLayoutData();
						for ( var j = 0; j < aLayoutData.length; j++) {
							if (_isMyLayoutData(this, aLayoutData[j])) {
								oClone._aLayouts.push(oElementClone.getLayoutData().getMultipleLayoutData()[j].getId());
							}
						}
					} else if (_isMyLayoutData(this, oLayoutData)) {
						oClone._aLayouts.push(oElementClone.getLayoutData().getId());
					}
				}
				oClone.addContent(oElementClone);
			}

			this._bChangedByMe = false;
			return oClone;

		};

		function _setFormLayout(oThis) {

				var oForm = oThis.getAggregation("form");
				var oLayout = oForm.getLayout();
				if (oLayout) {
					oLayout.destroy();
				}

				switch (oThis.getLayout()) {
				case sap.ui.layout.form.SimpleFormLayout.ResponsiveLayout:
					jQuery.sap.require("sap.ui.layout.form.ResponsiveLayout");
					oForm.setLayout(new sap.ui.layout.form.ResponsiveLayout(oThis.getId() + "--Layout"));
					break;
				case sap.ui.layout.form.SimpleFormLayout.GridLayout:
					jQuery.sap.require("sap.ui.layout.form.GridLayout");
					jQuery.sap.require("sap.ui.layout.form.GridContainerData");
					jQuery.sap.require("sap.ui.layout.form.GridElementData");
					oForm.setLayout(new sap.ui.layout.form.GridLayout(oThis.getId() + "--Layout"));
					break;
				case sap.ui.layout.form.SimpleFormLayout.ResponsiveGridLayout:
					jQuery.sap.require("sap.ui.layout.form.ResponsiveGridLayout");
					jQuery.sap.require("sap.ui.layout.GridData");
					oForm.setLayout(new sap.ui.layout.form.ResponsiveGridLayout(oThis.getId() + "--Layout"));
					break;

				default:
					break;
				}

		}

		/*
		 * Updates the FormContainers of the simple form.
		 */
		function _updateFormContainers(oThis) {

			oThis._changedFormContainers = [];

			var sLayout = oThis.getLayout();
			var oLayout;

			switch (sLayout) {
			case sap.ui.layout.form.SimpleFormLayout.ResponsiveLayout:
				// set the default values for linebreakes to avoid flickering for default case
				oThis._applyLinebreaks();
				break;
			case sap.ui.layout.form.SimpleFormLayout.GridLayout:
				_applyContainerSize(oThis);
				break;
			case sap.ui.layout.form.SimpleFormLayout.ResponsiveGridLayout:
				oLayout = oThis.getAggregation("form").getLayout();
				oLayout.setLabelSpanL(oThis.getLabelSpanL());
				oLayout.setLabelSpanM(oThis.getLabelSpanM());
				oLayout.setLabelSpanS(oThis.getLabelSpanS());
				oLayout.setEmptySpanL(oThis.getEmptySpanL());
				oLayout.setEmptySpanM(oThis.getEmptySpanM());
				oLayout.setEmptySpanS(oThis.getEmptySpanS());
				oLayout.setColumnsL(oThis.getColumnsL());
				oLayout.setColumnsM(oThis.getColumnsM());
				oLayout.setBreakpointL(oThis.getBreakpointL());
				oLayout.setBreakpointM(oThis.getBreakpointM());
				break;
			default:
				break;
			}

			for ( var i = 0; i < oThis._changedFormElements.length; i++) {
				var oFormElement = oThis._changedFormElements[i];

				switch (sLayout) {
				case sap.ui.layout.form.SimpleFormLayout.ResponsiveLayout:
					_applyFieldWeight(oThis, oFormElement);
					break;
				case sap.ui.layout.form.SimpleFormLayout.GridLayout:
					break;
				default:
					break;
				}

				_updateVisibility(oThis, oFormElement);
			}
			oThis._changedFormElements = [];

		}

		/*
		 * Checks whether the given LayoutData is created and added by this Simple Form
		 * @param { sap.ui.layout.ResponsiveFlowLayoutData} optional (interface) The layout data
		 * @returns {boolean} Whether the given layout was created by this Simple Form
		 * @private
		 */
		function _isMyLayoutData(oThis, oLayoutData) {

			var sId = oLayoutData.getId(),
			sLayouts = " " + oThis._aLayouts.join(" ") + " ";
			return sLayouts.indexOf(" " + sId + " ") >  -1;

		}

		/*
		 * Creates new sap.ui.layout.ResponsiveFlowLayoutData with the given parameters
		 * @param {int} iWeight the weight for the layout data
		 * @param {boolean} bLinebreak Whether the layout data has a linebreak
		 * @param {boolean} bLinebreakable Whether the layout data is linebreakable
		 * @returns {sap.ui.layout.ResponsiveFlowLayoutData} The newly created ResponsiveFlowLayoutData
		 * @private
		 */
		function _createRFLayoutData(oThis, iWeight, bLinebreak, bLinebreakable, iMinWidth) {

			var oLayout = new ResponsiveFlowLayoutData({weight:iWeight,linebreak:bLinebreak === true,linebreakable: bLinebreakable === true});
			if (iMinWidth) {
				oLayout.setMinWidth(iMinWidth);
			}
			oThis._aLayouts.push(oLayout.getId());
			return oLayout;

		}

		/*
		 * There may be VariantLayoutData used -> so get the right one for the used Layout
		 */
		function _getFieldLayoutData(oThis, oField){

			var oLayoutData;

			switch (oThis.getLayout()) {
			case sap.ui.layout.form.SimpleFormLayout.ResponsiveLayout:
				oLayoutData = FormLayout.prototype.getLayoutDataForElement(oField, "sap.ui.layout.ResponsiveFlowLayoutData");
				break;
			case sap.ui.layout.form.SimpleFormLayout.GridLayout:
				oLayoutData = FormLayout.prototype.getLayoutDataForElement(oField, "sap.ui.layout.form.GridElementData");
				break;
			case sap.ui.layout.form.SimpleFormLayout.ResponsiveGridLayout:
				oLayoutData = FormLayout.prototype.getLayoutDataForElement(oField, "sap.ui.layout.GridData");
				break;

			default:
				break;
			}

			return oLayoutData;

		}

		function _createFieldLayoutData(oThis, oField, iWeight, bLinebreak, bLinebreakable, iMinWidth) {

			var oLayoutData;

			switch (oThis.getLayout()) {
			case sap.ui.layout.form.SimpleFormLayout.ResponsiveLayout:
				oLayoutData = _getFieldLayoutData(oThis, oField);
				if (!oLayoutData || !_isMyLayoutData(oThis, oLayoutData)) {
					oLayoutData = oField.getLayoutData();
					if (oLayoutData && oLayoutData.getMetadata().getName() == "sap.ui.core.VariantLayoutData") {
						oLayoutData.addMultipleLayoutData(_createRFLayoutData(oThis, iWeight, bLinebreak, bLinebreakable, iMinWidth));
					} else if (!oLayoutData) {
						oField.setLayoutData(_createRFLayoutData(oThis, iWeight, bLinebreak, bLinebreakable, iMinWidth));
					} else {
						jQuery.sap.log.warning("ResponsiveFlowLayoutData can not be set on Field " + oField.getId(), "_createFieldLayoutData", "SimpleForm");
					}
				}
				break;
			case sap.ui.layout.form.SimpleFormLayout.GridLayout:
				// no default LayoutData needed"
				break;

			default:
				break;
			}

		}

		function _createElementLayoutData(oThis, oElement) {

			switch (oThis.getLayout()) {
			case sap.ui.layout.form.SimpleFormLayout.ResponsiveLayout:
				oElement.setLayoutData(new ResponsiveFlowLayoutData({linebreak:true, margin:false}));
				break;
			case sap.ui.layout.form.SimpleFormLayout.GridLayout:
				// no default LayoutData needed"
				break;

			default:
				break;
			}

		}

		function _createContainerLayoutData(oThis, oContainer) {

			switch (oThis.getLayout()) {
			case sap.ui.layout.form.SimpleFormLayout.ResponsiveLayout:
				oContainer.setLayoutData(new ResponsiveFlowLayoutData({minWidth:280}));
				break;
			case sap.ui.layout.form.SimpleFormLayout.GridLayout:
				if (oThis.getMaxContainerCols() > 1) {
					oContainer.setLayoutData(new sap.ui.layout.form.GridContainerData({halfGrid: true}));
				} else {
					oContainer.setLayoutData(new sap.ui.layout.form.GridContainerData({halfGrid: false}));
				}
				break;

			default:
				break;
			}

		}

		function _removeLayoutData(oThis, oElement) {

			var oLayout = _getFieldLayoutData(oThis, oElement);
			if (oLayout) {
				var sLayoutId = oLayout.getId();

				for ( var i = 0; i < oThis._aLayouts.length; i++) {
					var sId = oThis._aLayouts[i];
					if (sLayoutId == sId) {
						oLayout.destroy(); // is removed from parent during destroy
						oThis._aLayouts.splice(i, 1);
						break;
					}
				}
			}

		}

		/*
		 * Adds a new form element to the given FormContainer and adds the given label to it.
		 * @param {sap.ui.layout.form.FormContainer} The form container
		 * @param {sap.ui.core.Label} optional (interface) The label of the element
		 * @returns {sap.ui.layout.form.FormElement} The newly created FormElement
		 * @private
		 */
		function _addFormElement(oThis, oFormContainer, oLabel) {

			var oElement = _createFormElement(oThis, oLabel);
			oFormContainer.addFormElement(oElement);
			return oElement;

		}

		function _insertFormElement(oThis, oFormContainer, oLabel, iIndex) {

			var oElement = _createFormElement(oThis, oLabel);
			oFormContainer.insertFormElement(oElement, iIndex);
			return oElement;

		}

		function _createFormElement(oThis, oLabel) {

			var oElement = new FormElement();
			_createElementLayoutData(oThis, oElement);
			if (oLabel) {
				oLabel.addStyleClass("sapUiFormLabel-CTX");
				oElement.setLabel(oLabel);
				if (!_getFieldLayoutData(oThis, oLabel)) {
					_createFieldLayoutData(oThis, oLabel, oThis._iLabelWeight, false, true, oThis.getLabelMinWidth());
				}
			}
			oElement.setVisible(false);
			return oElement;

		}

		/*
		 * Creates a new form container and adds the given title to it.
		 * @param {sap.ui.core.Title} optional The title of the container
		 * @returns {sap.ui.layout.form.FormContainer} The newly created FormContainer
		 * @private
		 */
		function _createFormContainer(oThis, oTitle) {

			var oContainer = new FormContainer();
			_createContainerLayoutData(oThis, oContainer);
			if (oTitle) {
				oContainer.setTitle(oTitle);
			}
			return oContainer;

		}

		/*
		 * Applies the weight property for the fields in the responsive layout.
		 * @param {sap.ui.layout.form.FormElement} oElement The FormElement where the weight is applied.
		 * @private
		 */
		function _applyFieldWeight(oThis, oElement){

			var iMaxWeight = oThis._iMaxWeight;
			var aFields = oElement.getFields();
			var oField;
			var iLength = aFields.length;
			var oLabel = oElement.getLabel();
			var oLayoutData;
			var i = 0;

			if (oLabel && _getFieldLayoutData(oThis, oLabel)) {
				iMaxWeight = iMaxWeight - _getFieldLayoutData(oThis, oLabel).getWeight();
			}

			// determine weights set from application
			for (i = 0; i < aFields.length; i++) {
				oField = aFields[i];
				oLayoutData = _getFieldLayoutData(oThis, oField);
				if (oLayoutData instanceof ResponsiveFlowLayoutData && !_isMyLayoutData(oThis, oLayoutData)) {
					iMaxWeight = iMaxWeight - oLayoutData.getWeight();
					iLength--;
				}
			}

			var iWeight = Math.floor(iMaxWeight / iLength);
			var iRest = iMaxWeight % iLength;

			for (i = 0; i < aFields.length; i++) {
				oField = aFields[i];
				oLayoutData = _getFieldLayoutData(oThis, oField);
				var iCurrentWeight = iWeight;

				if (!oLayoutData) {
					_createFieldLayoutData(oThis, oField, iCurrentWeight, false, i == 0);
				} else if (_isMyLayoutData(oThis, oLayoutData) && oLayoutData instanceof ResponsiveFlowLayoutData) {
					// devide rest to first fields (not only to last one) (fist because to ignore manual set weigths)
					if (iRest > 0) {
						iCurrentWeight++;
						iRest--;
					}
					oLayoutData.setWeight(iCurrentWeight);
				}
			}

		}

		function _updateVisibility(oThis, oElement){

			var aFields = oElement.getFields();
			var bVisible = false;

			for (var i = 0; i < aFields.length; i++) {
				var oField = aFields[i];
				if (!oField.getVisible || oField.getVisible()) {
					// at least one Field is visible
					bVisible = true;
					break;
				}
			}

			if (oElement.getVisible() != bVisible) {
				// set visibility of FormElement
				oElement.setVisible(bVisible);
			}

		}

		/*
		 * Applies the linebreaks of form containers according to the minWidth and maxContainerCol settings of the SimpleForm
		 * @private
		 */
		SimpleForm.prototype._applyLinebreaks = function(){

			var oForm = this.getAggregation("form"),
			aContainers = oForm.getFormContainers();
			// set line break on every container if Form is smaller than getMinWidth pixel
			// and reset it if it's larger
			var oDomRef = this.getDomRef();
			var o$ = this.$();
			for (var i = 1; i < aContainers.length; i++) {
				var oContainer = aContainers[i],
				oLayoutData = oContainer.getLayoutData();
				if (!oDomRef || o$.outerWidth(true) > this.getMinWidth()) {
					// if not already rendered use default values according to column number
					if (i % this.getMaxContainerCols() == 0) {
						oLayoutData.setLinebreak(true);
					} else {
						oLayoutData.setLinebreak(false);
					}
				} else {
					oLayoutData.setLinebreak(true);
				}
			}
			if (oDomRef && o$.css("visibility") == "hidden") {
				var that = this;
				setTimeout(function() {
					if (that.getDomRef()) {
						that.$().css("visibility", "");
					}
				},10);
			}

		};

		/*
		 * Applies size of the containers in GridLayout: if only one container is in the last line -> make it full size
		 * @private
		 */
		function _applyContainerSize(oThis){

			var oForm = oThis.getAggregation("form");
			var aContainers = oForm.getFormContainers();
			var iLength = aContainers.length;
			if (iLength % 2 > 0) {
				aContainers[iLength - 1].getLayoutData().setHalfGrid(false);
			}
		}

		/*
		 * Handles the resize event
		 * @private
		 */
		SimpleForm.prototype._resize = function(){

			this._bChangedByMe = true;
			if (this._iCurrentWidth == this.$().outerWidth()) {
				return;
			}
			this._iCurrentWidth = this.$().outerWidth();
			this._applyLinebreaks();
			this._bChangedByMe = false;

		};

		function _markFormElementForUpdate(aFormElements, oFormElement){

			var bFound = false;
			for ( var i = 0; i < aFormElements.length; i++) {
				var oChangedFormElement = aFormElements[i];
				if (oChangedFormElement == oFormElement) {
					bFound = true;
					break;
				}
			}
			if (!bFound) {
				aFormElements.push(oFormElement);
			}

		}

		function _handleContentChange(oEvent) {
			if (oEvent.getParameter("name") == "visible") {
				var oFormElement = oEvent.oSource.getParent();
				_updateVisibility(this, oFormElement);
			}
		}

		function _getFormContent(oForm) {

			var aElements = [];
			var aFormContainers = oForm.getFormContainers();

			for ( var i = 0; i < aFormContainers.length; i++) {
				var oFormContainer = aFormContainers[i];
				var oTitle = oFormContainer.getTitle();
				if (oTitle) {
					aElements.push(oTitle);
				}

				var aFormElements = oFormContainer.getFormElements();
				for ( var j = 0; j < aFormElements.length; j++) {
					var oFormElement = aFormElements[j];
					var oLabel = oFormElement.getLabel();
					if (oLabel) {
						aElements.push(oLabel);
					}
					var aFields = oFormElement.getFields();
					for (var k = 0; k < aFields.length; k++) {
						var oField = aFields[k];
						aElements.push(oField);
					}
				}
			}

			return aElements;

		}

		SimpleForm.prototype._formInvalidated = function(oOrigin){

			if (!this._bChangedByMe) {
				// check if content is still the same like in array
				// maybe ca Control was destroyed or removed without using the SimpleForm API
				// as invalidate is fired for every single object only one object can be changed
				var aContent = _getFormContent(this.getAggregation("form"));
				var i = 0;
				var j = 0;
				var bCreateNew = false;

				if (aContent.length < this._aElements.length) {
					// at least one element must be removed -> create completely new,
					// because for deleted controls it's hard to find out the old parent.
					bCreateNew = true;
				} else {
					for (i = 0; i < aContent.length; i++) {
						var oElement1 = aContent[i];
						var oElement2 = this._aElements[j];
						if (oElement1 === oElement2) {
							j++;
						} else {
							// check if Element1 is new
							var oElementNext = aContent[i + 1];
							if (oElementNext === oElement2) {
								this.insertContent(oElement1, i);
								break;
							}

							// check if Element2 is removed
							oElementNext = this._aElements[j + 1];
							if (oElementNext === oElement1) {
								// difficult to find out old Formelement or FormContainer -> create content completely new.
								bCreateNew = true;
								break;
							}

							break;
						}
					}
				}

				if (bCreateNew) {
					this.removeAllContent();
					for (i = 0; i < aContent.length; i++) {
						var oElement = aContent[i];
						this.addContent(oElement);
					}
				}
			}

		};

	}());

	return SimpleForm;

}, /* bExport= */ true);
