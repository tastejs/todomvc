/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.commons.ApplicationHeader.
sap.ui.define(['jquery.sap.global', './library', 'sap/ui/core/Control', './Image', './TextView', './Button'],
	function(jQuery, library, Control, Image, TextView, Button) {
	"use strict";



	/**
	 * Constructor for a new ApplicationHeader.
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * The application header control stands on the top of any application page. It consists of 4 areas: Logo area, Function area provided by application, Search area, Logout area.
	 * @extends sap.ui.core.Control
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @alias sap.ui.commons.ApplicationHeader
	 * @ui5-metamodel This control/element also will be described in the UI5 design-time metamodel
	 */
	var ApplicationHeader = Control.extend("sap.ui.commons.ApplicationHeader", /** @lends sap.ui.commons.ApplicationHeader.prototype */ { metadata : {

		library : "sap.ui.commons",
		properties : {

			/**
			 * Path (src) to the logo icon to be displayed in the application header.
			 */
			logoSrc : {type : "sap.ui.core.URI", group : "Misc", defaultValue : null},

			/**
			 * The text that will be displayed beside the logo in the application header. This property is optional.
			 */
			logoText : {type : "string", group : "Misc", defaultValue : null},

			/**
			 * Determines if the logoff area will be displayed at the right hand side of the application header.
			 */
			displayLogoff : {type : "boolean", group : "Misc", defaultValue : true},

			/**
			 * User name that will be displayed beside the welcome text
			 */
			userName : {type : "string", group : "Misc", defaultValue : null},

			/**
			 * Determines if the welcome text is displayed
			 */
			displayWelcome : {type : "boolean", group : "Misc", defaultValue : true}
		},
		events : {

			/**
			 * Fires an event to log off the user from the application.
			 * No parameters.
			 */
			logoff : {}
		}
	}});

	/**
	 * Initializes the control
	 *
	 * @override
	 * @private
	 */
	ApplicationHeader.prototype.init = function(){
		this.initializationDone = false;
	};

	/**
	 * Called when the control is destroyed
	 *
	 * @private
	 */
	ApplicationHeader.prototype.exit = function() {
		this.oLogo && this.oLogo.destroy();
		this.oLogoText && this.oLogoText.destroy();
		this.oLogoffBtn && this.oLogoffBtn.destroy();
	};

	/**
	 * Create the composite parts out of the current settings.
	 * Called by the renderer just before rendering
	 * @private
	 */
	ApplicationHeader.prototype.initControls = function() {

		//Application header to build sub-controls ids
		var appHeaderId = this.getId();

		//Get the texts from the resources bundle
		var rb = sap.ui.getCore().getLibraryResourceBundle("sap.ui.commons");

		//Create the logo image control and the title (textView) control
		this.oLogo && this.oLogo.destroy();
		this.oLogo = new Image(appHeaderId + "-logoImg");
		this.oLogo.setTooltip(rb.getText("APPHDR_LOGO_TOOLTIP"));
		this.oLogo.setParent(this);
		this.oLogoText && this.oLogoText.destroy();
		this.oLogoText = new TextView(appHeaderId + "-logoText");
		this.oLogoText.setAccessibleRole(sap.ui.core.AccessibleRole.Heading);
		this.oLogoText.setParent(this);

		//Log off button
		this.oLogoffBtn && this.oLogoffBtn.destroy();
		this.oLogoffBtn = new Button(appHeaderId + "-logoffBtn");
		var sLogOffText = rb.getText("APPHDR_LOGOFF");
		this.oLogoffBtn.setText(sLogOffText);
		this.oLogoffBtn.setTooltip(sLogOffText);
		this.oLogoffBtn.attachPress(this.logoff,this);
		this.oLogoffBtn.setParent(this);
		this.oLogoffBtn.setLite(true);
	}


	/**
	*  This event is fired when the user clicks on the Log Off button
	*  @param oEvent The event triggered
	*  @private
	*/;
	ApplicationHeader.prototype.logoff = function(oEvent){
		this.fireLogoff();
	};


	// ---- Overwritten property setters to make sure the full area is rerendered correctly ----

	ApplicationHeader.prototype.setLogoSrc = function(sLogoSrc) {
		this.initializationDone = false;
		this.setProperty("logoSrc", sLogoSrc);
		return this;
	};

	ApplicationHeader.prototype.setLogoText = function(sLogoText) {
		this.initializationDone = false;
		this.setProperty("logoText", sLogoText);
		return this;
	};

	ApplicationHeader.prototype.setUserName = function(sUserName){
		this.initializationDone = false;
		this.setProperty("userName", sUserName);
		return this;
	};

	ApplicationHeader.prototype.setDisplayWelcome = function(bDisplayWelcome) {
		this.initializationDone = false;
		this.setProperty("displayWelcome", bDisplayWelcome);
		return this;
	};

	ApplicationHeader.prototype.setDisplayLogoff = function(bDisplayLogoff) {
		this.initializationDone = false;
		this.setProperty("displayLogoff", bDisplayLogoff);
		return this;
	};

	return ApplicationHeader;

}, /* bExport= */ true);
