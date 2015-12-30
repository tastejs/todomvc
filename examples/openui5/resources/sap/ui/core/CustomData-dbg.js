/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.core.CustomData.
sap.ui.define(['jquery.sap.global', './Element', './library'],
	function(jQuery, Element, library) {
	"use strict";


	
	/**
	 * Constructor for a new CustomData.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * Contains a single key/value pair of custom data attached to an Element. See method data().
	 * @extends sap.ui.core.Element
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @alias sap.ui.core.CustomData
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var CustomData = Element.extend("sap.ui.core.CustomData", /** @lends sap.ui.core.CustomData.prototype */ { metadata : {
	
		library : "sap.ui.core",
		properties : {
	
			/**
			 * The key of the data in this CustomData object.
			 * When the data is just stored, it can be any string, but when it is to be written to HTML (writeToDom == true) then it must also be a valid HTML attribute name (it must conform to the sap.ui.core.ID type and may contain no colon) to avoid collisions, it also may not start with "sap-ui". When written to HTML, the key is prefixed with "data-".
			 * If any restriction is violated, a warning will be logged and nothing will be written to the DOM.
			 */
			key : {type : "string", group : "Data", defaultValue : null},
	
			/**
			 * The data stored in this CustomData object.
			 * When the data is just stored, it can be any JS type, but when it is to be written to HTML (writeToDom == true) then it must be a string.
			 * If this restriction is violated, a warning will be logged and nothing will be written to the DOM.
			 */
			value : {type : "any", group : "Data", defaultValue : null},
	
			/**
			 * If set to "true" and the value is of type "string" and the key conforms to the documented restrictions, this custom data is written to the HTML root element of the control as a "data-*" attribute.
			 * If the key is "abc" and the value is "cde", the HTML will look as follows:
			 * &lt;SomeTag ... data-abc="cde" ... &gt;
			 * Thus the application can provide stable attributes by data binding which can be used for styling or identification purposes.
			 * ATTENTION: use carefully to not create huge attributes or a large number of them.
			 * @since 1.9.0
			 */
			writeToDom : {type : "boolean", group : "Data", defaultValue : false}
		}
	}});
	
	CustomData.prototype.setValue = function(oValue) {
		this.setProperty("value", oValue, true);
		
		var oControl = this.getParent();
		if (oControl && oControl.getDomRef()) {
			var oCheckResult = this._checkWriteToDom(oControl);
			if (oCheckResult) {
				// update DOM directly
				oControl.$().attr(oCheckResult.key, oCheckResult.value);
			}
		}
		return this;
	};
	
	CustomData.prototype._checkWriteToDom = function(oRelated) {
		if (!this.getWriteToDom()) {
			return null;
		}
		
		var key = this.getKey();
		var value = this.getValue();
		
		if (typeof value != "string") {
			jQuery.sap.log.error("CustomData with key " + key + " should be written to HTML of " + oRelated + " but the value is not a string.");
			return null;
		}
		
		if (!(sap.ui.core.ID.isValid(key)) || (key.indexOf(":") != -1)) {
			jQuery.sap.log.error("CustomData with key " + key + " should be written to HTML of " + oRelated + " but the key is not valid (must be a valid sap.ui.core.ID without any colon).");
			return null;
		}
		
		if (key == jQuery.sap._FASTNAVIGATIONKEY) {
			value = /^\s*(x|true)\s*$/i.test(value) ? "true" : "false"; // normalize values
		} else if (key.indexOf("sap-ui") == 0) {
			jQuery.sap.log.error("CustomData with key " + key + " should be written to HTML of " + oRelated + " but the key is not valid (may not start with 'sap-ui').");
			return null;
		}
		
		return {key: "data-" + key, value: value};
		
	};
	

	return CustomData;

});
