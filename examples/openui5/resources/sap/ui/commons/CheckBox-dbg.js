/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.commons.CheckBox.
sap.ui.define(['jquery.sap.global', './library', 'sap/ui/core/Control'],
	function(jQuery, library, Control) {
	"use strict";


	
	/**
	 * Constructor for a new CheckBox.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * 
	 * Provides a box which can be flagged, the box has a label. A check box can either stand alone, or in a group with other check boxes. As an option, the boxes can initially be set to status 'Not Editable'.
	 * @extends sap.ui.core.Control
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @alias sap.ui.commons.CheckBox
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var CheckBox = Control.extend("sap.ui.commons.CheckBox", /** @lends sap.ui.commons.CheckBox.prototype */ { metadata : {
	
		library : "sap.ui.commons",
		properties : {
	
			/**
			 * Contains the state of the control whether it is flagged with a check mark, or not
			 */
			checked : {type : "boolean", group : "Data", defaultValue : false, bindable : "bindable"},
	
			/**
			 * Defines the text displayed next to the check box
			 */
			text : {type : "string", group : "Appearance", defaultValue : null},
	
			/**
			 * Using this property, the control could be disabled, if required.
			 */
			enabled : {type : "boolean", group : "Behavior", defaultValue : true},
	
			/**
			 * Specifies whether the user shall be allowed to select the check box.
			 */
			editable : {type : "boolean", group : "Behavior", defaultValue : true},
	
			/**
			 * Accepts the core enumeration ValueState.type that supports 'None', 'Error', 'Warning' and 'Success'.
			 */
			valueState : {type : "sap.ui.core.ValueState", group : "Data", defaultValue : sap.ui.core.ValueState.None},
	
			/**
			 * The width can be set to an absolute value. If no value is set, the control width results from the text length.
			 */
			width : {type : "sap.ui.core.CSSSize", group : "Dimension", defaultValue : null},
	
			/**
			 * The value can be set to LTR or RTL. Otherwise, the control inherits the text direction from its parent control.
			 */
			textDirection : {type : "sap.ui.core.TextDirection", group : "Appearance", defaultValue : sap.ui.core.TextDirection.Inherit},
	
			/**
			 * The 'name' property to be used in the HTML code, for example for HTML forms that send data to the server via submit.
			 */
			name : {type : "string", group : "Misc", defaultValue : null}
		},
		associations : {
	
			/**
			 * Association to controls / ids which describe this control (see WAI-ARIA attribute aria-describedby).
			 */
			ariaDescribedBy : {type : "sap.ui.core.Control", multiple : true, singularName : "ariaDescribedBy"}, 
	
			/**
			 * Association to controls / ids which label this control (see WAI-ARIA attribute aria-labelledby).
			 */
			ariaLabelledBy : {type : "sap.ui.core.Control", multiple : true, singularName : "ariaLabelledBy"}
		},
		events : {
	
			/**
			 * 
			 * Event is triggered when the control status is changed by the user by flagging or unflagging the checkbox.
			 */
			change : {
				parameters : {
	
					/**
					 * 
					 * Checks whether the box is flagged or not flagged.
					 */
					checked : {type : "boolean"}
				}
			}
		}
	}});
	
	
	/**
	 * Event handler called when the check box is clicked.
	 *
	 * @param {jQuery.Event} oEvent
	 * @private
	 */
	CheckBox.prototype.onclick = function(oEvent) {
		//According to CSN2581852 2012 a readonly CB should be in the tabchain
		// This changed in 2013 back to not in the tabchain: see CSN 0002937527 2013
		// Let's see how often this will be changed back and forth in the future... Accessibility fun! :-D
		// End of 2013 is have to be again in the tabchain.
		// But not in the Form. But this is handled in the FromLayout control
		// Let's see what happens 2014... ;-)
		if (!!sap.ui.Device.browser.internet_explorer && !this.getEnabled()) {
			// in IE tabindex = -1 hides focus, so in readOnly/disabled case tabindex must be temporarily set to 0
			// as long as CheckBox is focused
			this.$().attr("tabindex", 0).addClass("sapUiCbFoc"); // the CSS class itself is not used, but IE only draws the standard focus outline when it is added
		}
	
		this.userToggle(oEvent);
	};
	
	/**
	 * @param {jQuery.Event} oEvent
	 * @private
	 */
	CheckBox.prototype.onfocusout = function(oEvent) {
		//According to CSN2581852 2012 a readonly CB should be in the tabchain
		// This changed in 2013 back to not in the tabchain: see CSN 0002937527 2013
		// Let's see how often this will be changed back and forth in the future... Accessibility fun! :-D
		// End of 2013 is have to be again in the tabchain.
		// But not in the Form. But this is handled in the FromLayout control
		// Let's see what happens 2014... ;-)
		if (!!sap.ui.Device.browser.internet_explorer && !this.getEnabled()) {
			// in IE tabindex = -1 hides focus, so in readOnly/disabled case tabindex must be temporarily set to 0
			// as long as CheckBox is focused - now unset this again
			this.$().attr("tabindex", -1).removeClass("sapUiCbFoc");
		}
	};
	
	/**
	 * Event handler called when the space key is pressed.
	 *
	 * @param {jQuery.Event} oEvent
	 * @private
	 */
	CheckBox.prototype.onsapspace = function(oEvent) {
		this.userToggle(oEvent);
	};
	
	/**
	 * This method is used internally whenever the user toggles the check box value.
	 * Purpose: Event cancellation and change event firing.
	 * @param {jQuery.Event} oEvent
	 * @private
	 */
	CheckBox.prototype.userToggle = function(oEvent) {
		oEvent.preventDefault();
		if (this.getEnabled() && this.getEditable()) {
			this.toggle();
			this.fireChange({checked: this.getChecked()});
		} else {
			// CheckBox has been activated by the user, but value cannot be changed
			// do nothing, but restore the focus to the complete control, as the user might have clicked the <input> element which also can get the focus
			this.getDomRef().focus();
		}
	};
	
	// implement public method toggle()

	/**
	 * 
	 * Inverts the current value of the control.
	 *
	 * @type sap.ui.commons.CheckBox
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	CheckBox.prototype.toggle = function() {
		this.setChecked(!this.getChecked());
		return this;
	};
	

	return CheckBox;

}, /* bExport= */ true);
