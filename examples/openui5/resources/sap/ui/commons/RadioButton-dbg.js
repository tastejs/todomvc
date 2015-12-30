/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.commons.RadioButton.
sap.ui.define(['jquery.sap.global', './library', 'sap/ui/core/Control'],
	function(jQuery, library, Control) {
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
	 * Usually, RadioButton is used in a group with other RadioButtons (with the groupName property or by using
	 * sap.ui.commons.RadioButtonGroup), thus providing a limited choice for the user. An event is triggered when
	 * the user makes a change of the selection.
	 * 
	 * @extends sap.ui.core.Control
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @alias sap.ui.commons.RadioButton
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var RadioButton = Control.extend("sap.ui.commons.RadioButton", /** @lends sap.ui.commons.RadioButton.prototype */ { metadata : {
	
		library : "sap.ui.commons",
		properties : {
	
			/**
			 * Defines the text displayed next to the RadioButton.
			 */
			text : {type : "string", group : "Data", defaultValue : null},
	
			/**
			 * 
			 * Displays the disabled controls in another color, depending on the customer settings.
			 */
			enabled : {type : "boolean", group : "Behavior", defaultValue : true},
	
			/**
			 * Specifies whether the user can select the RadioButton.
			 */
			editable : {type : "boolean", group : "Behavior", defaultValue : true},
	
			/**
			 * Specifies the select state of the RadioButton.
			 */
			selected : {type : "boolean", group : "Data", defaultValue : false},
	
			/**
			 * 
			 * Enumeration sap.ui.core.ValueState provides state values Error, Success, Warning and None.
			 */
			valueState : {type : "sap.ui.core.ValueState", group : "Data", defaultValue : sap.ui.core.ValueState.None},
	
			/**
			 * Determines the control width. By default, it depends on the text length. Alternatively, CSS sizes in % or px can be set.
			 */
			width : {type : "sap.ui.core.CSSSize", group : "Dimension", defaultValue : null},
	
			/**
			 * 
			 * Defines the text direction - options are left-to-right (LTR) and right-to-left (RTL). Alternatively, the control can 
			 * inherit the text direction from its parent container.
			 */
			textDirection : {type : "sap.ui.core.TextDirection", group : "Appearance", defaultValue : sap.ui.core.TextDirection.Inherit},
	
			/**
			 * Defines the name of the RadioButtonGroup, in which the current RadioButton belongs to. You can define a new name for 
			 * the group. If no new name is specified, the default is sapUiRbDefaultGroup. By default, when one of the RadioButtons 
			 * in a group is selected, all others are unselected.
			 */
			groupName : {type : "string", group : "Behavior", defaultValue : 'sapUiRbDefaultGroup'},
	
			/**
			 * Can be used for subsequent actions.
			 */
			key : {type : "string", group : "Data", defaultValue : null}
		},
		associations : {
	
			/**
			 * Association to controls / IDs, which describe this control (see WAI-ARIA attribute aria-describedby).
			 */
			ariaDescribedBy : {type : "sap.ui.core.Control", multiple : true, singularName : "ariaDescribedBy"}, 
	
			/**
			 * Association to controls / IDs, which label this control (see WAI-ARIA attribute aria-labelledby).
			 */
			ariaLabelledBy : {type : "sap.ui.core.Control", multiple : true, singularName : "ariaLabelledBy"}
		},
		events : {
	
			/**
			 * Triggers when the user makes a change on the RadioButton.
			 */
			select : {}
		}
	}});
	
	/**
	 * Event handler called, when the RadioButton is clicked.
	 *
	 * @param {jQuery.Event} oEvent
	 * @private
	 */
	RadioButton.prototype.onclick = function(oEvent) {
	
		if (this.getEnabled() && oEvent.target.id == (this.getId() + "-RB")) {
			this.focus();
		}
	
		if (!!sap.ui.Device.browser.internet_explorer && (/*!this.getEditable() ||*/ !this.getEnabled())) { //According to CSN2581852 2012 a readonly CB should be in the tabchain 
			// in IE tabindex = -1 hides focus, so in readOnly case tabindex must be set to 0
			// as long as RadioButton is clicked on
			this.$().attr("tabindex", 0).toggleClass("sapUiRbFoc");
		}
	
		this.userSelect(oEvent);
	};

	RadioButton.prototype._groupNames = {};
	
	/**
	 * Event handler called, when the space key is pressed.
	 *
	 * @param {jQuery.Event} oEvent
	 * @private
	 */
	RadioButton.prototype.onsapspace = function(oEvent) {
	
		if (this.getEnabled() && oEvent.target.id == (this.getId() + "-RB")) {
			this.focus();
		}
		this.userSelect(oEvent);
	};
	
	/**
	 * Event handler, called when the focus is set on a RadioButton.
	 * Problem in HCB: Focus is set in IE8 to bullet, and not to the whole control.
	 *
	 * @param {jQuery.Event} oEvent
	 * @private
	 */
	RadioButton.prototype.onsaptabnext = function(oEvent) {
	
		if (!!sap.ui.Device.browser.internet_explorer) {
			this.bTabPressed = true;
			var that = this;
			window.setTimeout(function(){that.bTabPressed = false;}, 100);
		}
	};
	
	/**
	 * Event handler called when the radio button is focused.
	 * Problem in HCB: Focus is sometimes set in IE8 to bullet, and not to the whole control.
	 *
	 * @param {jQuery.Event} oEvent
	 * @private
	 */
	RadioButton.prototype.onfocusin = function(oEvent) {
	
		if (this.getEnabled() && oEvent.target.id == (this.getId() + "-RB")) {
			if (this.bTabPressed) {
				// this only occurs in IE in HCB mode
				var aFocusableElements = jQuery(":sapFocusable"),
					bFound = false;
				for (var i = 0; i < aFocusableElements.length; i++) {
					if (bFound && aFocusableElements[i].parentNode != oEvent.target && aFocusableElements[i].tabIndex != "-1") {
						aFocusableElements[i].focus();
						oEvent.preventDefault();
						break;
					}
					if (oEvent.target == aFocusableElements[i]) {
						bFound = true;
					}
				}
			} else {
				this.focus();
			}
		}
	};
	
	/**
	 * Event handler, called when the focus is moved out of the RadioButton.
	 * Problem in IE: Tabindex must be set back to -1.
	 *
	 * @param {jQuery.Event} oEvent
	 * @private
	 */
	RadioButton.prototype.onfocusout = function(oEvent) {
	
		if (!!sap.ui.Device.browser.internet_explorer && (/*!this.getEditable() ||*/ !this.getEnabled())) { //According to CSN2581852 2012 a readonly CB should be in the tabchain 
			// in IE tabindex = -1 hides focus, so in readOnly case tabindex must be set to 0
			// as long as RadioButton is clicked on
			this.$().attr("tabindex", -1).toggleClass("sapUiRbFoc");
		}
	
	};
	/**
	 * Handles event cancellation and fires the select event.
	 * Used only internally, whenever the user selects the RadioButton.
	 *
	 * @param {jQuery.Event} oEvent
	 * @private
	 */
	RadioButton.prototype.userSelect = function(oEvent) {
	//	oEvent.preventDefault();
		// the control should not stop browser event propagation
		// Example: table control needs to catch and handle the event as well
		//oEvent.stopPropagation();
	
		if (this.getEnabled() && this.getEditable()) {
			var selected = this.getSelected();
			if (!selected) {
				this.setSelected(true);
				this.fireSelect({/* no parameters */});
			}
		} else {
			// readOnly or disabled -> don't allow browser to switch RadioButton on
			oEvent.preventDefault();
		}
	};
	
	// #############################################################################
	// Overwritten methods that are also generated in RadioButton.API.js
	// #############################################################################
	
	/*
	 * Overwrites the definition from RadioButton.API.js
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
					oControl.setSelected(false);
				}
			}
		}

		if ((bSelectedOld != bSelected) && this.getDomRef() && this.getRenderer().setSelected) {
			this.getRenderer().setSelected(this, bSelected);
		}

		return this;
	};

	RadioButton.prototype.setGroupName = function(sGroupName) {
		this._changeGroupName(sGroupName, this.getGroupName());

		return this.setProperty("groupName", sGroupName, false);
	};
	
	RadioButton.prototype.getTooltipDomRefs = function() {
		return this.$().children();
	};

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
