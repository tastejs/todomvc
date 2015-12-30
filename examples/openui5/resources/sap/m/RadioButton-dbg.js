/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.m.RadioButton.
sap.ui.define(['jquery.sap.global', './library', 'sap/ui/core/Control', 'sap/ui/core/EnabledPropagator'],
	function(jQuery, library, Control, EnabledPropagator) {
	"use strict";



	/**
	 * Constructor for a new RadioButton.
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * RadioButton is a control similar to CheckBox, but it allows the user to choose only one of the predefined set of options.
	 *
	 * Usually, RadioButton is used in a group with other RadioButtons (with the groupName property or by using sap.m.RadioButtonGroup), thus providing a limited choice for the user.
	 * An event is triggered when the user makes a change of the selection.
	 * @extends sap.ui.core.Control
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @alias sap.m.RadioButton
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var RadioButton = Control.extend("sap.m.RadioButton", /** @lends sap.m.RadioButton.prototype */ { metadata : {

		library : "sap.m",
		properties : {

			/**
			 * Specifies if the radio button is disabled.
			 */
			enabled : {type : "boolean", group : "Behavior", defaultValue : true},

			/**
			 * Specifies the select state of the radio button
			 */
			selected : {type : "boolean", group : "Data", defaultValue : false},

			/**
			 * Name of the radio button group the current radio button belongs to. You can define a new name for the group.
			 * If no new name is specified, this radio button belongs to the sapMRbDefaultGroup per default. Default behavior of a radio button in a group is that when one of the radio buttons in a group is selected, all others are unselected.
			 */
			groupName : {type : "string", group : "Behavior", defaultValue : 'sapMRbDefaultGroup'},

			/**
			 * Specifies the text displayed next to the RadioButton
			 */
			text : {type : "string", group : "Appearance", defaultValue : null},

			/**
			 * Options for the text direction are RTL and LTR. Alternatively, the control can inherit the text direction from its parent container.
			 */
			textDirection : {type : "sap.ui.core.TextDirection", group : "Appearance", defaultValue : sap.ui.core.TextDirection.Inherit},

			/**
			 * Width of the Label
			 */
			width : {type : "sap.ui.core.CSSSize", group : "Dimension", defaultValue : ''},

			/**
			 * This is a flag to switch on activeHandling. When it is switched off,
			 * there will not be visual changes on active state. Default value is 'true'
			 */
			activeHandling : {type : "boolean", group : "Appearance", defaultValue : true},

			/**
			 * Specifies whether the user can select the radio button.
			 * @since 1.25
			 */
			editable : {type : "boolean", group : "Behavior", defaultValue : true},

			/**
			 *
			 * Enumeration sap.ui.core.ValueState provides state values Error, Success, Warning, None
			 * @since 1.25
			 */
			valueState : {type : "sap.ui.core.ValueState", group : "Data", defaultValue : sap.ui.core.ValueState.None},

			/**
			 * Specifies the alignment of the radio button. Available alignment settings are "Begin", "Center", "End", "Left", and "Right".
			 * @since 1.28
			 */
			textAlign : {type : "sap.ui.core.TextAlign", group : "Appearance", defaultValue : sap.ui.core.TextAlign.Begin}
		},
		events : {

			/**
			 * Event is triggered when the user makes a change on the radio button (selecting or unselecting it).
			 */
			select : {
				parameters : {

					/**
					 * Checks whether the RadioButton is active or not.
					 */
					selected : {type : "boolean"}
				}
			}
		},
		associations : {

			/**
			 * Association to controls / IDs which describe this control (see WAI-ARIA attribute aria-describedby).
			 */
			ariaDescribedBy : {type : "sap.ui.core.Control", multiple : true, singularName : "ariaDescribedBy"},

			/**
			 * Association to controls / IDs which label this control (see WAI-ARIA attribute aria-labelledby).
			 */
			ariaLabelledBy : {type : "sap.ui.core.Control", multiple : true, singularName : "ariaLabelledBy"}
		}
	}});


	/**
	 * Method to set a RadioButton's state to active or inactive.
	 *
	 * @name sap.m.RadioButton#setActiveState
	 * @function
	 * @param {boolean} bActive - Sets the active state to true or false
	 * @type void
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */

	/**
	 * This file defines behavior for the control,
	 */

	EnabledPropagator.call(RadioButton.prototype);

	RadioButton.prototype._groupNames = {};

	/**
	 * Function is called when radiobutton is tapped.
	 *
	 * @private
	 */
	RadioButton.prototype.ontap = function() {

		if (!this.getEnabled() || !this.getEditable()) {
			return;
		}

		this.applyFocusInfo();

		if (!this.getSelected()) {
			this.setSelected(true);

			var that = this;
			setTimeout(function() {
				that.fireSelect({selected: true});
			}, 0);

		}
	};

	/**
	 * Function is called when radiobutton is being touched. Only necessary for Android/Blackberry.
	 *
	 * @private
	 */
	RadioButton.prototype.ontouchstart = function(oEvent) {

		//for control who need to know if they should handle events from the CheckBox control
		oEvent.originalEvent._sapui_handledByControl = true;
		if (this.getEnabled() && this.getActiveHandling()) {
			this.$().toggleClass("sapMRbBTouched", true);
		}
	};

	RadioButton.prototype.ontouchend = function(oEvent) {

		this.$().toggleClass("sapMRbBTouched", false);
	};

	// #############################################################################
	// Keyboard Handling Events
	// #############################################################################
	/**
	* Pseudo event for pseudo 'select' event... space, enter, ... without modifiers (Ctrl, Alt or Shift)
	* @param {object} oEvent - provides information for the event
	* @public
	*/
	RadioButton.prototype.onsapselect = function(oEvent) {

		oEvent.preventDefault();
		this.ontap(oEvent);
	};

	// #############################################################################
	// Overwritten methods that are also generated in RadioButton.API.js
	// #############################################################################

	/**
	 * Sets the state of the RadioButton to selected.
	 * @param {boolean} bSelected - defines if the radio button is selected
	 * @returns {sap.m.RadioButton} Reference to the control instance for chaining
	 * @public
	 */
	RadioButton.prototype.setSelected = function(bSelected) {
		var oControl,
			bSelectedOld = this.getSelected(),
			sGroupName = this.getGroupName(),
			aControlsInGroup = this._groupNames[sGroupName],
			iLength = aControlsInGroup && aControlsInGroup.length;
			
		this.setProperty("selected", bSelected, true); // No re-rendering
		this._changeGroupName(this.getGroupName());

		if (bSelected && sGroupName && sGroupName !== "") { // If this radio button is selected and groupName is set, explicitly deselect the other radio buttons of the same group
			for (var i = 0; i < iLength; i++) {
				oControl = aControlsInGroup[i];

				if (oControl instanceof RadioButton && oControl !== this && oControl.getSelected()) {
					oControl.fireSelect({ selected: false });
					oControl.setSelected(false);
				}
			}
		}

		if ((bSelectedOld !== bSelected) && this.getDomRef()) {
			this.$().toggleClass('sapMRbSel', bSelected);

			if (bSelected) {
				this.$().attr('aria-checked', 'true');
				this.getDomRef("RB").checked = true;
				this.getDomRef("RB").setAttribute('checked', 'checked');
			} else {
				this.$().removeAttr('aria-checked'); // aria-checked=false is default value and need not be set explicitly
				this.getDomRef("RB").checked = false;
				this.getDomRef("RB").removeAttribute('checked');
			}
		}

		return this;
	};

	/**
	 * Sets the text for the RadioButton's label.
	 * @param {string} sText - The text to be set
	 * @returns {sap.m.RadioButton} Reference to the control instance for chaining
	 * @public
	 */
	RadioButton.prototype.setText = function(sText) {

		this.setProperty("text", sText, true);
		if (this._oLabel) {
			this._oLabel.setText(this.getText());
		} else {
			this._createLabel("text", this.getText());
		}
		this.addStyleClass("sapMRbHasLabel");
		return this;
	};

	/**
	 * Sets the width for the RadioButton's label.
	 * @param {string} sWidth - CSS size to be set as width of the label
	 * @returns {sap.m.RadioButton} Reference to the control instance for chaining
	 * @public
	 */
	RadioButton.prototype.setWidth = function(sWidth) {

		this.setProperty("width", sWidth, true);
		if (this._oLabel) {
			this._oLabel.setWidth(this.getWidth());
		} else {
			this._createLabel("width", this.getWidth());
		}
		return this;
	};

	/**
	 * Sets the text direction for the RadioButton's label.
	 * @param {string} sDirection - Text direction to be set to RadioButton's label
	 * @returns {sap.m.RadioButton} Reference to the control instance for chaining
	 * @public
	 */
	RadioButton.prototype.setTextDirection = function(sDirection) {

		this.setProperty("textDirection", sDirection, true);
		if (this._oLabel) {
			this._oLabel.setTextDirection(this.getTextDirection());
		} else {
			this._createLabel("textDirection", this.getTextDirection());
		}
		return this;
	};

	/**
	 * Sets RadioButton's groupName. Only one radioButton from the same group can be selected
	 * @param {string} sGroupName - Name of the group to which the RadioButton will belong.
	 * @returns {sap.m.RadioButton} Reference to the control instance for chaining
	 * @public
	 */
	RadioButton.prototype.setGroupName = function(sGroupName) {
		this._changeGroupName(sGroupName, this.getGroupName());

		return this.setProperty("groupName", sGroupName, true);
	};

	/**
	 * Destroys all related objects to the RadioButton
	 * @public
	 */
	RadioButton.prototype.exit = function() {
		var sGroupName = this.getGroupName(),
			aControlsInGroup = this._groupNames[sGroupName],
			iGroupNameIndex = aControlsInGroup && aControlsInGroup.indexOf(this);

		delete this._iTabIndex;
		if (this._oLabel) {
			this._oLabel.destroy();
		}

		if (iGroupNameIndex && iGroupNameIndex !== -1) {
			aControlsInGroup.splice(iGroupNameIndex, 1);
		}
	};

	/**
	 * Creates label and sets a property to it.
	 * @param {string} prop - Property to be set to the new label.
	 * @param {string} value - Value of the property which will be set.
	 * @private
	 */
	RadioButton.prototype._createLabel = function(prop, value) {
		this._oLabel = new sap.m.Label(this.getId() + "-label").addStyleClass("sapMRbBLabel").setParent(this, null, true);
		this._oLabel.setProperty(prop, value, false);
	};

	/*
	 * Sets the tab index of the control
	 *
	 * @param {int} iTabIndex - Greater than or equal to -1
	 * @return {sap.m.RadioButton}
	 * @since 1.16
	 * @protected
	 */
	RadioButton.prototype.setTabIndex = function(iTabIndex) {

		this._iTabIndex = iTabIndex;
		this.$("Button").attr("tabindex", iTabIndex);
		return this;
	};

	RadioButton.prototype.getFocusDomRef = function() {

		//set the focus on the radio button wrapper
		return this.getDomRef("Button");
	};

	RadioButton.prototype.applyFocusInfo = function() {

		this.$().focus();
	};

	/*
	 * Sets the textAlign to the internal label
	 * @param {string} sAlign
	 * @return {sap.m.RadioButton}
	 * @since 1.28
	 * @public
	 */
	RadioButton.prototype.setTextAlign = function(sAlign) {
		this.setProperty("textAlign", sAlign, true);
		if (this._oLabel) {
			this._oLabel.setTextAlign(this.getTextAlign());
		} else {
			this._createLabel("textAlign", this.getTextAlign());
		}
		return this;
	};

	/**
	 * Changes the groupname of a RadioButton.
	 * @param {string} sNewGroupName - Name of the new group.
	 * @param {string} sOldGroupName - Name of the old group.
	 * @private
	 */
	RadioButton.prototype._changeGroupName = function(sNewGroupName, sOldGroupName) {
		var aNewGroup = this._groupNames[sNewGroupName],
			aOldGroup = this._groupNames[sOldGroupName];

		if (!aNewGroup) {
			aNewGroup = this._groupNames[sNewGroupName] = [];
		}

		if (aNewGroup.indexOf(this) === -1) {
			aNewGroup.push(this);
		}

		if (aOldGroup && aOldGroup.indexOf(this) !== -1) {
			aOldGroup.splice(aOldGroup.indexOf(this), 1);
		}
	};

	return RadioButton;

}, /* bExport= */ true);
