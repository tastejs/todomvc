/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.commons.Button.
sap.ui.define(['jquery.sap.global', './library', 'sap/ui/core/Control', 'sap/ui/core/EnabledPropagator', 'sap/ui/core/IconPool'],
	function(jQuery, library, Control, EnabledPropagator, IconPool) {
	"use strict";


	
	/**
	 * Constructor for a new Button.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * Enables users to trigger actions such as save or print. For the button UI, you can define some text or an icon, or both.
	 * @extends sap.ui.core.Control
	 * @implements sap.ui.commons.ToolbarItem
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @alias sap.ui.commons.Button
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var Button = Control.extend("sap.ui.commons.Button", /** @lends sap.ui.commons.Button.prototype */ { metadata : {
	
		interfaces : [
			"sap.ui.commons.ToolbarItem"
		],
		library : "sap.ui.commons",
		properties : {
	
			/**
			 * 
			 * Button text displayed at runtime.
			 */
			text : {type : "string", group : "Appearance", defaultValue : ''},
	
			/**
			 * 
			 * Boolean property to enable the control (default is true). Buttons that are disabled have other colors than enabled ones, depending on custom settings.
			 */
			enabled : {type : "boolean", group : "Behavior", defaultValue : true},
	
			/**
			 * 
			 * Control width as common CSS-size (px or % as unit, for example)
			 */
			width : {type : "sap.ui.core.CSSSize", group : "Dimension", defaultValue : null},
	
			/**
			 * 
			 * Unique identifier used for help service
			 */
			helpId : {type : "string", group : "Behavior", defaultValue : ''},
	
			/**
			 * Icon to be displayed as graphical element within the button.
			 * This can be an URI to an image or an icon font URI.
			 */
			icon : {type : "sap.ui.core.URI", group : "Appearance", defaultValue : ''},
	
			/**
			 * Icon to be displayed as graphical element within the button when it is hovered (only if also a base icon was specified). If not specified the base icon is used.
			 * If a icon font icon is used, this property is ignored.
			 */
			iconHovered : {type : "sap.ui.core.URI", group : "Appearance", defaultValue : ''},
	
			/**
			 * Icon to be displayed as graphical element within the button when it is selected (only if also a base icon was specified). If not specified the base or hovered icon is used.
			 * If a icon font icon is used, this property is ignored.
			 */
			iconSelected : {type : "sap.ui.core.URI", group : "Appearance", defaultValue : ''},
	
			/**
			 * 
			 * If set to true (default), the display sequence is 1. icon 2. control text .
			 */
			iconFirst : {type : "boolean", group : "Appearance", defaultValue : true},
	
			/**
			 * Specifies the button height. If this property is set, the height which is specified by the underlying theme is not used any longer.
			 */
			height : {type : "sap.ui.core.CSSSize", group : "Dimension", defaultValue : null},
	
			/**
			 * Indicates if the button is styled. If not it is rendered as native HTML-button. In this case a custom styling can be added usig addStyleClass.
			 */
			styled : {type : "boolean", group : "Appearance", defaultValue : true},
	
			/**
			 * The button is rendered as lite button.
			 */
			lite : {type : "boolean", group : "Appearance", defaultValue : false},
	
			/**
			 * Style of the button.
			 * (e.g. emphasized)
			 */
			style : {type : "sap.ui.commons.ButtonStyle", group : "Appearance", defaultValue : sap.ui.commons.ButtonStyle.Default}
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
			 * Event is fired when the user presses the control.
			 */
			press : {}
		}
	}});
	
	
	/**
	 * Puts the focus to the button.
	 *
	 * @name sap.ui.commons.Button#focus
	 * @function
	 * @type void
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	
	
	EnabledPropagator.call(Button.prototype);
	
	/**
	 * Function is called when button is clicked.
	 *
	 * @param {jQuery.Event} oEvent
	 * @private
	 */
	Button.prototype.onclick = function(oEvent) {
		if (this.getEnabled()) {
			this.firePress({/* no parameters */});
		}
	
		oEvent.preventDefault();
		oEvent.stopPropagation();
	};
	
	/**
	 * Handles the sapenter event does not bubble
	 *
	 * @param {jQuery.Event} oEvent
	 * @private
	 */
	Button.prototype.onsapenter = function(oEvent) {
		oEvent.stopPropagation();
	};
	
	/**
	 * Function is called when mouse key is clicked down. The button style classes
	 * are replaced then.
	 *
	 * @param {jQuery.Event} oEvent
	 * @private
	 */
	Button.prototype.onmousedown = function(oEvent) {
		this.handleMouseDown(oEvent, true);
	};
	
	/**
	 * Function to handle the mouse down event.
	 *
	 * @param {jQuery.Event} oEvent The causing event.
	 * @param {boolean} [bFocus=false] Whether to set the focus on the selected element in a delayed call.
	 * @private
	 */
	Button.prototype.handleMouseDown = function(oEvent, bFocus) {
		if (this.getEnabled() && this.getRenderer().onactive) {
			this.getRenderer().onactive(this);
		}
		// webkit && firefox on mac does not focus a Button on click, it even unfocuses it onmousedown!
		if (bFocus && (!!sap.ui.Device.browser.webkit || (!!sap.ui.Device.browser.firefox && navigator.platform.indexOf("Mac") === 0))) {
			if (sap.ui.Device.browser.mobile && !!sap.ui.Device.browser.webkit) {
				//In mobile Webkit Browsers (IPad) the focus must be set immediately to ensure that a focusout happens whereever the
				//focus currently is. The deleayedCall below is still needed due to the reason described above. (CSN 2536817 2012)
				this.focus();
			}
			jQuery.sap.delayedCall(0, this, function(){
				this.focus();
			});
		}
	};
	
	/**
	 * When mouse key is up again, reset the background images to normal.
	 *
	 * @param {jQuery.Event} oEvent
	 * @private
	 */
	Button.prototype.onmouseup = function(oEvent) {
		if (this.getEnabled() && this.getRenderer().ondeactive) {
			this.getRenderer().ondeactive(this);
		}
	};
	
	/**
	 * When mouse is going out of the control, reset the background images to normal.
	 *
	 * @param {jQuery.Event} oEvent
	 * @private
	 */
	Button.prototype.onmouseout = function(oEvent) {
		if (this.getEnabled() && this.getRenderer().onmouseout) {
			this.getRenderer().onmouseout(this);
		}
	};
	
	/**
	 * When mouse is going over the control a hover effect is done.
	 *
	 * @param {jQuery.Event} oEvent
	 * @private
	 */
	Button.prototype.onmouseover = function(oEvent) {
		if (this.getEnabled() && this.getRenderer().onmouseover) {
			this.getRenderer().onmouseover(this);
		}
	};
	
	/**
	 * When the button looses the focus, this method is called.
	 *
	 * @param {jQuery.Event} oEvent
	 * @private
	 */
	Button.prototype.onfocusout = function(oEvent) {
		if (this.getEnabled() && this.getRenderer().onblur) {
			this.getRenderer().onblur(this);
		}
	};
	
	/**
	 * When the button gets the focus, this method is called.
	 *
	 * @param {jQuery.Event} oEvent
	 * @private
	 */
	Button.prototype.onfocusin = function(oEvent) {
		if (this.getEnabled() && this.getRenderer().onfocus) {
			this.getRenderer().onfocus(this);
		}
	};
	
	/*
	 * If Icon has just changed don't rerender.
	 */
	Button.prototype.setIcon = function(sIcon) {
	
		this._setIcon(sIcon, "icon");
	
		return this;
	
	};
	
	Button.prototype.setIconHovered = function(sIcon) {
	
		this._setIcon(sIcon, "iconHovered");
	
		return this;
	
	};
	
	Button.prototype.setIconSelected = function(sIcon) {
	
		this._setIcon(sIcon, "iconSelected");
	
		return this;
	
	};
	
	/*
	 * helper function to set different icons
	 */
	Button.prototype._setIcon = function(sIcon, sProperty) {
	
		var sIconOld = this.getProperty(sProperty);
	
		if (sIconOld == sIcon) {
			// icon not changed -> nothing to do
			return;
		}
	
		var bUseIconFontOld = false;
		if (IconPool.isIconURI(sIconOld)) {
			bUseIconFontOld = true;
		}
	
		var bUseIconFontNew = false;
		if (IconPool.isIconURI(sIcon)) {
			bUseIconFontNew = true;
		}
	
		var bSupressRerender = true;
		if ((!sIconOld && sIcon) || (sIconOld && !sIcon) || (bUseIconFontOld != bUseIconFontNew)) {
			// Icon new added or removed -> need to rerender
			bSupressRerender = false;
		}
	
		this.setProperty(sProperty, sIcon, bSupressRerender);
	
		if (bSupressRerender == true && this.getDomRef() && this.getRenderer().changeIcon) {
			this.getRenderer().changeIcon(this);
		}
	
	};
	

	return Button;

}, /* bExport= */ true);
