/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.m.GrowingList.
sap.ui.define(['jquery.sap.global', './List', './library'],
	function(jQuery, List, library) {
	"use strict";


	
	/**
	 * Constructor for a new GrowingList.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * sap.m.GrowingList control is the container for all list items and inherits from sap.m.List control. Everything like the selection, deletion, unread states and inset style are also maintained here. In addition the control provides a loading mechanism to request data from the model and append the list items to the list. The request is started manually by tapping on the trigger at the end of the list.
	 * @extends sap.m.List
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @deprecated Since version 1.16. 
	 * Instead use "List" or "Table" control with setting "growing" property to "true"
	 * @alias sap.m.GrowingList
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var GrowingList = List.extend("sap.m.GrowingList", /** @lends sap.m.GrowingList.prototype */ { metadata : {
	
		deprecated : true,
		library : "sap.m",
		properties : {
	
			/**
			 * Number of items requested from the server. To activate this you should set growing property to "true"
			 * @since 1.16
			 */
			threshold : {type : "int", group : "Misc", defaultValue : 20},
	
			/**
			 * Text which is displayed on the trigger at the end of the list. The default is a translated text ("Load More Data") coming from the messagebundle properties.
			 * This property can be used only if growing property is set "true" and scrollToLoad property is set "false".
			 * @since 1.16
			 */
			triggerText : {type : "string", group : "Appearance", defaultValue : null},
	
			/**
			 * If you set this property to true then user needs to scroll end to trigger loading a new page. Default value is false which means user needs to scroll end and then click button to load new page.
			 * NOTE: This property can be set true, if growing property is set "true" and if you only have one instance of this control inside the scroll container(e.g Page).
			 * @since 1.16
			 */
			scrollToLoad : {type : "boolean", group : "Behavior", defaultValue : false}
		}
	}});
	
	
	// checks if control is not compatible anymore
	GrowingList.prototype._isIncompatible = function() {
		return sap.ui.getCore().getConfiguration().getCompatibilityVersion("sapMGrowingList").compareTo("1.16") >= 0;
	};
	
	//sets growing property to true on init
	GrowingList.prototype.init = function() {
		sap.m.ListBase.prototype.init.call(this);
		if (!this._isIncompatible()) {
			this.setGrowing();
		}
	};
	
	// sets growing feature always to true
	GrowingList.prototype.setGrowing = function() {
		return sap.m.ListBase.prototype.setGrowing.call(this, true);
	};
	
	// not to break add getters and setters for old properties
	!(function(oGL, oLB) {
		["Threshold", "TriggerText", "ScrollToLoad"].forEach(function(property) {
			oGL["set" + property] = oLB["setGrowing" + property];
			oGL["get" + property] = oLB["getGrowing" + property];
		});
	}(GrowingList.prototype, sap.m.ListBase.prototype));

	return GrowingList;

}, /* bExport= */ true);
