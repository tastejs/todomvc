/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.core.Message.
sap.ui.define(['jquery.sap.global', './Element', './library'],
	function(jQuery, Element, library) {
	"use strict";


	/**
	 * Constructor for a new Message.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * This element used to provide messages. Rendering must be done within the control that uses this kind of element.
	 * 
	 * Its default level is none.
	 * @extends sap.ui.core.Element
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @alias sap.ui.core.Message
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var Message = Element.extend("sap.ui.core.Message", /** @lends sap.ui.core.Message.prototype */ { metadata : {
	
		library : "sap.ui.core",
		properties : {
	
			/**
			 * Message text
			 */
			text : {type : "string", group : "Misc", defaultValue : null},
	
			/**
			 * Message's timestamp. It is just a simple String that will be used without any transformation. So the application that uses messages needs to format the timestamp to its own needs.
			 */
			timestamp : {type : "string", group : "Misc", defaultValue : null},
	
			/**
			 * A possible icon URI of the message
			 */
			icon : {type : "sap.ui.core.URI", group : "Misc", defaultValue : null},
	
			/**
			 * Setting the message's level.
			 */
			level : {type : "sap.ui.core.MessageType", group : "Misc", defaultValue : sap.ui.core.MessageType.None},
	
			/**
			 * Determines whether the message should be read only. This helps the application to handle a message a different way if the application differentiates between read-only and common messages.
			 * @since 1.19.0
			 */
			readOnly : {type : "boolean", group : "Misc", defaultValue : false}
		}
	}});
	
	
	/**
	 * Returns the icon's default URI depending on given size. 
	 * 
	 * There are default icons for messages available that can be used this way. If no 
	 * parameter is given, the size will be 16x16 per default. If larger icons are needed, 
	 * the parameter "32x32" might be given.
	 *
	 * @param {string} sSize
	 *         If parameter is not set the default icon's size will be 16x16. If parameter 
	 *         is set to "32x32" the icon size will be 32x32.
	 * @return {sap.ui.core.URI} URI of the default icon.
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	Message.prototype.getDefaultIcon = function(sSize) {
		var sModulePath = jQuery.sap.getModulePath("sap.ui.core.themes." + sap.ui.getCore().getConfiguration().getTheme());

		var sImagesPath = sModulePath + "/img/message/";
		if (sSize && sSize == "32x32") {
			sImagesPath += "32x32/";
		} else {
			sImagesPath += "16x16/";
		}
		var sUrl = "";
	
		switch (this.getProperty("level")) {
		case sap.ui.core.MessageType.Error:
			sUrl = sImagesPath + "Message_Icon_Error.png";
			break;
	
		case sap.ui.core.MessageType.Information:
			sUrl = sImagesPath
					+ "Message_Icon_Information.png";
			break;
	
		case sap.ui.core.MessageType.Warning:
			sUrl = sImagesPath + "Message_Icon_Warning.png";
			break;
	
		case sap.ui.core.MessageType.Success:
			sUrl = sImagesPath + "Message_Icon_Success.png";
			break;
	
		case sap.ui.core.MessageType.None:
		default:
			sUrl = this.getProperty("icon");
			break;
		}
	
		return sUrl;
	};
	
	/**
	 * Compares the given message with <code>this</code> message. The types of
	 * {@link sap.ui.core.MessageType} are ordered from "Error" > "Warning" > "Success" >
	 * "Information" > "None".
	 * 
	 * See  {@link sap.ui.core.Message.compareByType}
	 *
	 * @param {sap.ui.core.Message} oOther message to compare with this one
	 * @return {int} returns <code>0</code> if both messages are at
	 *         the same level. <code>-1</code> if <code>this</code>
	 *         message has a lower level. <code>1</code> if <code>this</code>
	 *         message has a higher level.
	 * @public
	 */
	Message.prototype.compareByType = function(oOther) {
		return Message.compareByType(this, oOther);
	};
	
	/**
	 * Compares two given messages with each other. 
	 *
	 * The types of {@link sap.ui.core.MessageType} are ordered from "Error" > "Warning" > "Success" >
	 * "Information" > "None".
	 * 
	 * @param {sap.ui.core.Message} oMessage1 first message to compare 
	 * @param {sap.ui.core.Message} oMessage2 second message to compare
	 * @return {int} returns <code>0</code> if both messages are at
	 *         the same level. <code>-1</code> if <code>this</code>
	 *         message has a lower level. <code>1</code> if <code>this</code>
	 *         message has a higher level.
	 * @static
	 * @public
	 */
	Message.compareByType = function(oMessage1, oMessage2) {
		if (!oMessage1 && !oMessage2) {
			return 0;
		}
		if (oMessage1 && !oMessage2) {
			return 1;
		}
		if (!oMessage1 && oMessage2) {
			return -1;
		}
	
		var sLvl1 = oMessage1.getLevel();
		var sLvl2 = oMessage2.getLevel();
		var t = sap.ui.core.MessageType;
	
		if (sLvl1 === sLvl2) {
			return 0;
		}
	
		switch (sLvl1) {
		case t.Error:
			return 1;
	
		case t.Warning:
			return sLvl2 === t.Error ? -1 : 1;
	
		case t.Success:
			return sLvl2 === t.Error || sLvl2 === t.Warning ? -1 : 1;
	
		case t.Information:
			return sLvl2 === t.None ? 1 : -1;
	
		case t.None:
			return -1;
	
		default:
			jQuery.sap.log.error("Comparison error", this);
			return 0;
		}
	};

	return Message;

});
