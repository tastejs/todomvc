/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides useful string operations not available in pure JavaScript.
sap.ui.predefine('jquery.sap.strings',['jquery.sap.global'],
	function(jQuery) {
	"use strict";

	/**
	 * Checks whether a given sString ends with sEndString
	 * respecting the case of the strings.
	 *
	 * @param {string} sString The string to be checked
	 * @param {string} sEndString The end string to be searched
	 * @return True if sString ends with sEndString
	 * @type {boolean}
	 * @see jQuery.sap.endsWithIgnoreCase
	 * @public
	 */
	jQuery.sap.endsWith = function endsWith(sString, sEndString) {
		if (typeof (sEndString) != "string" || sEndString == "") {
			return false;
		}
		var iPos = sString.lastIndexOf(sEndString);
		return iPos >= 0 && iPos == sString.length - sEndString.length;
	};

	/**
	 * Checks whether a given sString ends with sEndString
	 * ignoring the case of the strings.
	 *
	 * @param {string} sString the string to be checked
	 * @param {string} sEndString the end string to be searched
	 * @return true if sString ends with sEndString
	 * @type {boolean}
	 * @see jQuery.sap.endsWith
	 * @public
	 */
	jQuery.sap.endsWithIgnoreCase = function endsWithIgnoreCase(sString, sEndString) {
		if (typeof (sEndString) != "string" || sEndString == "") {
			return false;
		}
		sString = sString.toUpperCase();
		sEndString = sEndString.toUpperCase();
		return jQuery.sap.endsWith(sString,sEndString);
	};

	/**
	 * Checks whether a given sString starts with sStartString
	 * respecting the case of the strings.
	 *
	 * @param {string} sString The string to be checked
	 * @param {string} sStartString The start string to be searched
	 * @return True if sString ends with sEndString
	 * @type {boolean}
	 * @see jQuery.sap.startsWithIgnoreCase
	 * @public
	 */
	jQuery.sap.startsWith = function startsWith(sString, sStartString) {
		if (typeof (sStartString) != "string" || sStartString == "") {
			return false;
		}
		if (sString == sStartString) {
			return true;
		}
		return sString.indexOf(sStartString) == 0;
	};

	/**
	 * Checks whether a given sString starts with sStartString
	 * ignoring the case of the strings.
	 *
	 * @param {string} sString The string to be checked
	 * @param {string} sStartString The start string to be searched
	 * @return True if sString ends with sEndString
	 * @type {boolean}
	 * @see jQuery.sap.startsWith
	 * @public
	 */
	jQuery.sap.startsWithIgnoreCase = function startsWithIgnoreCase(sString, sStartString) {
		if (typeof (sStartString) != "string" || sStartString == "") {
			return false;
		}
		sString = sString.toUpperCase();
		sStartString = sStartString.toUpperCase();
		return jQuery.sap.startsWith(sString,sStartString);
	};

	/**
	 * Converts a character of the string to upper case.<br/>
	 * If no pos is defined as second parameter or pos is negative or greater than sString the first character will be
	 * converted into upper case. the first char position is 0.
	 *
	 * @param {string} sString The string to be checked
	 * @param {int} iPos the position of the character that will be uppercase
	 * @return The string with the firstletter in upper case
	 * @type {string}
	 * @public
	 * @SecPassthrough {0|return}
	 */
	jQuery.sap.charToUpperCase = function charToUpperCase(sString,iPos) {
		if (!sString) {
			return sString;
		}
		if (!iPos || isNaN(iPos) || iPos <= 0 || iPos >= sString.length) {
			iPos = 0;
		}
		var sChar = sString.charAt(iPos).toUpperCase();
		if (iPos > 0) {
			return sString.substring(0,iPos) + sChar + sString.substring(iPos + 1);
		}
		return sChar + sString.substring(iPos + 1);
	};

	/**
	 * Pads a string on the left side until is has the given length.<br/>
	 *
	 * @param {string} sString The string to be padded
	 * @param {string} sPadChar The char to use for the padding
	 * @param {int} iLength the target length of the string
	 * @return The padded string
	 * @type {string}
	 * @public
	 * @SecPassthrough {0 1|return}
	 */
	jQuery.sap.padLeft = function padLeft(sString, sPadChar, iLength) {
		if (!sString) {
			sString = "";
		}
		while (sString.length < iLength) {
			sString = sPadChar + sString;
		}
		return sString;
	};

	/**
	 * Pads a string on the right side until is has the given length.<br/>
	 *
	 * @param {string} sString The string to be padded
	 * @param {string} sPadChar The char to use for the padding
	 * @param {int} iLength the target length of the string
	 * @return The padded string
	 * @type {string}
	 * @public
	 * @SecPassthrough {0 1|return}
	 */
	jQuery.sap.padRight = function padRight(sString, sPadChar, iLength) {
		if (!sString) {
			sString = "";
		}
		while (sString.length < iLength) {
			sString = sString + sPadChar;
		}
		return sString;
	};


	var rCamelCase = /-(.)/ig;

	/**
	 * Transforms a hyphen separated string to an camel case string. 
	 *
	 * @param {string} sString Hyphen separated string
	 * @return The transformed string
	 * @type {string}
	 * @since 1.7.0
	 * @public
	 * @SecPassthrough {0|return}
	 */
	jQuery.sap.camelCase = function camelCase(sString) {
		return sString.replace( rCamelCase, function( sMatch, sChar ) {
			return sChar.toUpperCase();
		});
	};

	
	var rHyphen = /([A-Z])/g;
	
	/**
	 * Transforms a camel case string into a hyphen separated string.
	 * 
	 * @param {string} sString camel case string
	 * @return The transformed string
	 * @type {string}
	 * @since 1.15.0
	 * @public
	 * @SecPassthrough {0|return}
	 */
	jQuery.sap.hyphen = function hyphen(sString) {
		return sString.replace( rHyphen, function(sMatch, sChar) {
			return "-" + sChar.toLowerCase();
		});
	};

	
	var rEscapeRegExp = /[-[\]{}()*+?.,\\^$|#\s]/g;

	/**
	 * This function escapes the reserved letters in Regular Expression
	 * @param {string} sString string to escape
	 * @return The escaped string
	 * @type {string}
	 * @since 1.9.3
	 * @public
	 * @SecPassthrough {0|return}
	 */
	jQuery.sap.escapeRegExp = function escapeRegExp(sString) {
		return sString.replace(rEscapeRegExp, "\\$&");
	};

	/**
	 * Creates a string from a pattern by replacing placeholders with concrete values.
	 *
	 * The syntax of the pattern is inspired by (but not fully equivalent to) the 
	 * java.util.MessageFormat.
	 *
	 * Placeholders have the form <code>{ integer }</code>, where any occurrence of 
	 * <code>{0}</code> is replaced by the value with index 0 in <code>aValues</code>,
	 * <code>{1}</code> y the value with index 1 in <code>aValues</code> etc.
	 *
	 * To avoid interpretation of curly braces as placeholders, any non-placeholder fragment 
	 * of the pattern can be enclosed in single quotes. The surrounding single quotes will be 
	 * omitted from the result. Single quotes that are not meant to escape a fragment and 
	 * that should appear in the result, need to be doubled. In the result, only a single 
	 * single quote will occur.
	 *
	 * Example Pattern Strings:
	 * <pre>
	 *   jQuery.sap.formatMessage("Say {0}", ["Hello"]) -> "Say Hello"  // normal use case
	 *   jQuery.sap.formatMessage("Say '{0}'", ["Hello"]) -> "Say {0}"  // escaped placeholder
	 *   jQuery.sap.formatMessage("Say ''{0}''", ["Hello"]) -> "Say 'Hello'" // doubled single quote 
	 *   jQuery.sap.formatMessage("Say '{0}'''", ["Hello"]) -> "Say {0}'" // doubled single quote in quoted fragment
	 * </pre>
	 * 
	 * In contrast to java.util.MessageFormat, format types or format styles are not supported. 
	 * Everything after the argument index and up to the first closing curly brace is ignored.
	 * Nested placeholders (as supported by java.lang.MessageFormat for the format type choice)
	 * are not ignored but reported as a parse error. 
	 *
	 * This method throws an Error when the pattern syntax is not fulfilled (e.g. unbalanced curly 
	 * braces, nested placeholders or a non-numerical argument index).
	 *
	 * This method can also be used as a formatter within a binding. The first part of a composite binding 
	 * will be used as pattern, the following parts as aValues. If there is only one value and this
	 * value is an array it will be handled like the default described above.
	 *  
	 * @param {string} sPattern A pattern string in the described syntax 
	 * @param {any[]} [aValues=[]] The values to be used instead of the placeholders.
	 * 										 
	 * @return {string} The formatted result string 
	 * @since 1.12.5
	 * @SecPassthrough {*|return}
	 * @public
	 */
	jQuery.sap.formatMessage = function formatMessage(sPattern, aValues) {
		jQuery.sap.assert(typeof sPattern === "string" || sPattern instanceof String, "pattern must be string");
		if (arguments.length > 2 || (aValues != null && !jQuery.isArray(aValues))) {
			aValues = Array.prototype.slice.call(arguments,1);
		}
		aValues = aValues || [];
		return sPattern.replace(rMessageFormat, function($0,$1,$2,$3,offset) {
			if ( $1 ) {
				// a doubled single quote in a normal string fragment 
				//   --> emit a single quote
				return "'";
			} else if ( $2 ) {
				// a quoted sequence of chars, potentially containing doubled single quotes again 
				//   --> emit with doubled single quotes replaced by a single quote 
				return $2.replace(/''/g, "'");
			} else if ( $3 ) {
				// a welformed curly brace
				//   --> emit the argument but ignore other parameters 
				return String(aValues[parseInt($3, 10)]);
			}
			// e.g. malformed curly braces 
			//   --> throw Error 
			throw new Error("formatMessage: pattern syntax error at pos. " + offset);
		});
	};
	
	/**
	 * Pattern to analyze MessageFormat strings.
	 * 
	 * Group 1: captures doubled single quotes within the string
	 * Group 2: captures quoted fragments within the string. 
	 *            Note that java.util.MessageFormat silently forgives a missing single quote at 
	 *            the end of a pattern. This special case is handled by the RegEx as well.  
	 * Group 3: captures placeholders
	 *            Checks only for numerical argument index, any remainder is ignored up to the next 
	 *            closing curly brace. Nested placeholdes are not accepted!
	 * Group 4: captures any remaining curly braces and indicates syntax errors
	 *
	 *                    [-1] [----- quoted string -----] [------ placeholder ------] [--]
	 * @private
	 */
	var rMessageFormat = /('')|'([^']+(?:''[^']*)*)(?:'|$)|\{([0-9]+(?:\s*,[^{}]*)?)\}|[{}]/g;

	return jQuery;

});
/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides a helper that can highlight a given control
sap.ui.predefine('sap/ui/debug/Highlighter', ['jquery.sap.global', 'jquery.sap.dom', 'jquery.sap.script'],
	function(jQuery/* , jQuerySap, jQuerySap1 */) {
	"use strict";


	/**
	 * Creates a new highlighter object without displaying it.
	 *
	 * The DOM node is not created until the first call to method {@link #highlight}.
	 *
	 * @param {string} [sId] id that is used by the new highlighter
	 * @param {boolean} [bFilled] whether the box of the highlighter is partially opaque (20%), defaults to false
	 * @param {string} [sColor] the CSS color of the border and the box (defaults to blue)
	 * @param {int} [iBorderWidth] the width of the border
	 *
	 * @class Helper class to display a colored rectangle around and above a given DOM node
	 * @author Frank Weigel
	 * @since 0.8.7
	 * @public
	 * @alias sap.ui.debug.Highlighter
	 */
	var Highlighter = function(sId, bFilled, sColor, iBorderWidth) {
		this.sId = sId || jQuery.sap.uid();
		this.bFilled = (bFilled == true);
		this.sColor = sColor || 'blue';
		if ( isNaN(iBorderWidth ) ) {
			this.iBorderWidth = 2;
		} else if ( iBorderWidth <= 0 ) {
			this.iBorderWidth = 0;
		} else {
			this.iBorderWidth = iBorderWidth;
		}
	};
	
	/**
	 * Shows a rectangle/box that surrounds the given DomRef.
	 *
	 * If this is the first call to {@link #highlight} for this instance, then
	 * a DOM node for the highlighter is created in the same document as the given <code>oDomRef</code>.
	 *
	 * <b>Note:</b> As the DOM node is reused across multiple calls, the highlighter must only be used
	 * within a single document.
	 */
	Highlighter.prototype.highlight = function(oDomRef) {
		if (!oDomRef || !oDomRef.parentNode) {
			return;
		}
	
		var oHighlightRect = jQuery.sap.domById(this.sId);
		if (!oHighlightRect) {
			oHighlightRect = oDomRef.ownerDocument.createElement("DIV");
			oHighlightRect.setAttribute("id", this.sId);
			oHighlightRect.style.position = "absolute";
			oHighlightRect.style.border = this.iBorderWidth + "px solid " + this.sColor;
			oHighlightRect.style.display = "none";
			oHighlightRect.style.margin = "0px";
			oHighlightRect.style.padding = "0px";
			if ( this.bFilled ) {
				oHighlightRect.innerHTML = "<div style='background-color:" + this.sColor + ";opacity:0.2;filter:progid:DXImageTransform.Microsoft.Alpha(opacity=20);height:100%;width:100%'>&nbsp;</div>";
			}
			oDomRef.ownerDocument.body.appendChild(oHighlightRect);
		}
		var oRect = jQuery(oDomRef).rect();
		oHighlightRect.style.top = (oRect.top - this.iBorderWidth) + "px";
		oHighlightRect.style.left = (oRect.left - this.iBorderWidth) + "px";
		oHighlightRect.style.width = (oRect.width) + "px";
		oHighlightRect.style.height = (oRect.height) + "px";
		oHighlightRect.style.display = "block";
	};
	
	/**
	 * Hides the rectangle/box if it is currently shown.
	 */
	Highlighter.prototype.hide = function() {
		var oHighlightRect = jQuery.sap.domById(this.sId);
		if (!oHighlightRect) {
			return;
		}
		oHighlightRect.style.display = "none";
	};

	return Highlighter;

}, /* bExport= */ true);
/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides a control tree to be used in the Eclipse preview editor
sap.ui.predefine('sap/ui/test/ControlTree',['jquery.sap.global', 'sap/ui/core/Element', 'jquery.sap.strings'],
	function(jQuery, Element/* , jQuerySap */) {
	"use strict";


	
	/*global addProperty, callback, restoreLockState, restoreTreeCallback,supplySelectedTheme, *///declare unusual global vars for JSLint/SAPUI5 validation
	
	/**
	 * Constructs the class <code>sap.ui.test.ControlTree</code> and registers
	 * to the <code>sap.ui.core.Core</code> for UI change events.
	 *
	 * @class Control Tree used for the Test Environment
	 * @author SAPUI5 Designtime
	 * @version 1.32.9
	 *
	 * @param {sap.ui.core.Core}
	 *            oCore the core instance to use for analysis
	 * @param {Window}
	 *            oWindow reference to the window object
	 *
	 * @constructor
	 * @private
	 * @name sap.ui.test.ControlTree
	 */
	var ControlTree = function(oCore, oWindow) {
		this.oWindow = oWindow;
		this.oCore = oCore;
		this.oCore.attachUIUpdated(this.renderDelayed, this);
		this.renderDelayed(); // additionally necessary due to first UI update
	};
	
	/**
	 * TODO: missing internal JSDoc... @author please update
	 * @private
	 * @name sap.ui.test.ControlTree#renderDelayed
	 * @function
	 */
	ControlTree.prototype.renderDelayed = function() {
		if (this.oTimer) {
			this.oWindow.jQuery.sap.clearDelayedCall(this.oTimer);
		}
		this.oTimer = this.oWindow.jQuery.sap.delayedCall(500,this,"initDT");
		//Provide a callback when the UI is updated
		restoreLockState(this);
		supplySelectedTheme(this.oCore.getConfiguration().getTheme());
	};
	
	/**
	 * TODO: missing internal JSDoc... @author please update
	 * @private
	 * @name sap.ui.test.ControlTree#initDT
	 * @function
	 */
	ControlTree.prototype.initDT = function() {
		//Make a Callback to reset the Outline Tree
		restoreTreeCallback();
	
		var oUIArea = null,
			oUIAreas = this.oCore.mUIAreas;
			//alert("initcontrol tree");
		for (var i in oUIAreas) {
			var oUIArea = oUIAreas[i];
	
			var aRootControls = oUIArea.getContent();
			for (var i = 0, l = aRootControls.length; i < l; i++) {
				this.renderNodeDT(aRootControls[i],0);
			}
		}
	};
	
	/**
	 * TODO: missing internal JSDoc... @author please update
	 * @private
	 * @name sap.ui.test.ControlTree#createTreeNodeDT
	 * @function
	 */
	ControlTree.prototype.createTreeNodeDT = function(sId,iLevel,sType) {
		callback(sId,iLevel,sType);
	};
	
	ControlTree.prototype.createAssocTreeNodeDT = function(sId,iLevel,sType,srcCntrlId,trgtCntrlId) {
		callback(sId,iLevel,sType,srcCntrlId,trgtCntrlId);
	};
	
	/**
	 * TODO: missing internal JSDoc... @author please update
	 * @private
	 * @name sap.ui.test.ControlTree#renderNodeDT
	 * @function
	 */
	ControlTree.prototype.renderNodeDT = function(oControl,iLevel) {
	
		if (!oControl) {
			return;
		}
	
		var oMetadata = oControl.getMetadata();
	
		var mProperties = oMetadata.getAllProperties();
		for (var sPropertyName in mProperties) {
			var oMethod =  oControl["get" + sPropertyName];
			var sName = sPropertyName;
			if (!oMethod) {
				sName = jQuery.sap.charToUpperCase(sName,0);
			}
			var oValue = oControl["get" + sName]();
			addProperty(oControl.getId(), sPropertyName, mProperties[sPropertyName].type, oValue != null ? oValue : "");
		}
	
		var mAggregations = oMetadata.getAllAggregations();
		for (var n in mAggregations) {
			// Ensure to analyze the actual element/control instance, not just its metadata!
			var oAggregation = oControl.getAggregation(mAggregations[n].name);
			if (oAggregation && oAggregation.length) {
				for (var i = 0;i < oAggregation.length;i++) {
					var o = oAggregation[i];
					if (o instanceof Element) {
						this.renderNodeDT(oAggregation[i],iLevel + 1);
					}
				}
			} else if (oAggregation instanceof Element) {
				this.renderNodeDT(oAggregation,iLevel + 1);
			}
		}
	
	
		//Get all the associations
		var mAssociations = oMetadata.getAllAssociations();
		for (var m in mAssociations) {
			var oAssociation = oControl.getAssociation(mAssociations[m].name);//Returns the association Name
	
			if (oAssociation != null) {
				//Construct the Association Name
				var assocId = mAssociations[m].name + oAssociation;
				this.createAssocTreeNodeDT(assocId,iLevel + 2,"Association",oControl.getId(),oAssociation);
				//Add the properties of the association here
				addProperty(assocId,mAssociations[m].name,"assoc_type",oAssociation);
				addProperty(assocId, "Name", "string", mAssociations[m].name);
	
			}
		}
	};

	return ControlTree;

}, /* bExport= */ true);
/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides a bridge between the SAPUI5 runtime and the SAPUI5 Eclipse Tooling.
sap.ui.predefine('sap/ui/test/TestEnv',['jquery.sap.global', 'sap/ui/debug/Highlighter', './ControlTree'],
	function(jQuery, Highlighter, ControlTree) {
	"use strict";


	/*global selectControl *///declare unusual global vars for JSLint/SAPUI5 validation
	
	/**
	 * Creates an instance of the class <code>sap.ui.debug.TestEnv</code>
	 *
	 * @class Central Class for the Test Environment
	 *
	 * @author SAPUI5 Designtime
	 * @version 1.32.9
	 * @constructor
	 * @private
	 * @name sap.ui.test.TestEnv
	 */
	var TestEnv = function() {
	};
	
	/**
	 * Will be invoked by <code>sap.ui.core.Core</code> to notify the plugin to start
	 * @param {sap.ui.core.Core} oCore reference to the Core
	 * @public
	 * @name sap.ui.test.TestEnv#startPlugin
	 * @function
	 */
	TestEnv.prototype.startPlugin = function(oCore) {
		this.oCoreOther = oCore;
		this.oCore = oCore;
		this.oCore.attachControlEvent(this.onControlEvent, this);
		this.oWindow = window;
		this.oControlTree = new ControlTree(this.oCore, window);
	};
	
	/**
	 * Will be invoked by <code>sap.ui.core.Core</code> to notify the plugin to start
	 * @param {sap.ui.core.Core} oCore reference to the Core
	 * @public
	 * @name sap.ui.test.TestEnv#stopPlugin
	 * @function
	 */
	TestEnv.prototype.stopPlugin = function() {
		this.oCore.detachControlEvent(this.onControlEvent, this);
		this.oCore = null;
	};
	
	
	/**
	 * Callback method for listening to any event
	 * @param {sap.ui.base.Event} oEvent event object
	 * @private
	 * @name sap.ui.test.TestEnv#onControlEvent
	 * @function
	 */
	TestEnv.prototype.onControlEvent = function(oEvent) {
	
		// logging for testing!
	//	jQuery.sap.log.info(oEvent.getParameter("browserEvent").getName() + " - " + this.oCore.isLocked());
	
		// special handling only if the Core is locked
		if (this.oCore.isLocked()) {
	
			// get the ref to the browser event
			var oBrowserEvent = oEvent.getParameter("browserEvent");
	
			// only act for click events
			if (oBrowserEvent.type == "click") {
	
				// determine the clicked element
				var oElement = oBrowserEvent.srcControl;
				if (oElement) {
	
	//				// show the dimension rect and select the control
					var oSelectionHighlighter = new Highlighter('sap-ui-testsuite-SelectionHighlighter');
					oSelectionHighlighter.highlight(oElement.getDomRef());
	
					// (TODO: function selectControl needs to be implemented by DesignTime!)
					if (selectControl) {
						selectControl(oElement.getId());
					}
	
				}
	
			}
	
		}
	
	};
	
	/**
	 * Create the <code>sap.ui.test.TestEnv</code> plugin and register
	 * it within the <code>sap.ui.core.Core</code>.
	 */
	(function(){
		var oThis = new TestEnv();
		sap.ui.getCore().registerPlugin(oThis);
	}());

	return TestEnv;

}, /* bExport= */ true);
jQuery.sap.require("sap.ui.test.TestEnv");
