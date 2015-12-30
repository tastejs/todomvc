/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides a (modifiable) list of properties for a given control
sap.ui.define('sap/ui/debug/PropertyList', ['jquery.sap.global', 'sap/ui/base/DataType', 'sap/ui/base/EventProvider', 'sap/ui/core/Element', 'sap/ui/core/ElementMetadata', 'jquery.sap.strings', 'jquery.sap.encoder'],
	function(jQuery, DataType, EventProvider, Element, ElementMetadata/* , jQuerySap */) {
	"use strict";


	/**
	 * Constructs the class <code>sap.ui.debug.PropertyList</code>.
	 *
	 * @class HTML Property list for a <code>sap.ui.core.Control</code> in the
	 * Debug Environment
	 *
	 * @extends sap.ui.base.EventProvider
	 * @author Martin Schaus
	 * @version 1.32.9
	 *
	 * @param {sap.ui.core.Core}
	 *            oCore the core instance to use for analysis
	 * @param {Window}
	 *            oWindow reference to the window object
	 * @param {object}
	 *            oParentDomRef reference to the parent DOM element
	 *
	 * @constructor
	 * @alias sap.ui.debug.PropertyList
	 * @private
	 */
	var PropertyList = EventProvider.extend("sap.ui.debug.PropertyList", /** @lends sap.ui.debug.PropertyList.prototype */ {
		constructor: function(oCore, oWindow, oParentDomRef) {
			EventProvider.apply(this,arguments);
			this.oWindow = oWindow;
			this.oParentDomRef = oParentDomRef;
		//	this.oCore = oWindow.sap.ui.getCore();
			this.oCore = oCore;
			this.bEmbedded = top.window == oWindow; // check only with ==, not === as the test otherwise fails on IE8
			this.mProperties = {};
			var that = this;
			jQuery(oParentDomRef).bind("click",function(evt) {
				that.onclick(evt);
			})
			.bind("focusin",function(evt) {
				that.onfocus(evt);
			})
			.bind("keydown",function(evt) {
				that.onkeydown(evt);
			});
			if ( !this.bEmbedded ) {
				jQuery(oParentDomRef).bind("mouseover",function(evt) {
					that.onmouseover(evt);
				})
				.bind("mouseout",function(evt) {
					that.onmouseout(evt);
				});
			}
			//this.oParentDomRef.style.backgroundColor = "#e0e0e0";
			this.oParentDomRef.style.border = "solid 1px gray";
			this.oParentDomRef.style.padding = "2px";
		
		}
	});
	
	/**
	 * TODO: missing internal JSDoc... @author please update
	 * @private
	 */
	PropertyList.prototype.exit = function() {
		jQuery(this.oParentDomRef).unbind();
	};
	
	/**
	 * TODO: missing internal JSDoc... @author please update
	 * @private
	 */
	PropertyList.prototype.update = function(oParams) {
		var sControlId = oParams.getParameter("controlId");
		this.oParentDomRef.innerHTML = "";
	
		var oControl = this.oCore.byId(sControlId);
		if (!oControl) {
			this.oParentDomRef.innerHTML = "Please select a valid control";
			return;
		}
		if (!oControl.getMetadata || !oControl.getMetadata()) {
			this.oParentDomRef.innerHTML = "Control does not provide Metadata.";
			return;
		}
		this.mProperties = {};
		var oMetadata = oControl.getMetadata(),
			aHTML = [];
		aHTML.push("<span data-sap-ui-quickhelp='" + this._calcHelpId(oMetadata) + "'>Type : " + oMetadata.getName() + "</span><br >");
		aHTML.push("Id : " + oControl.getId() + "<br >");
		aHTML.push("<button id='sap-debug-propertylist-apply' sap-id='" + sControlId + "' style='border:solid 1px gray;background-color:#d0d0d0;font-size:8pt;'>Apply Changes</button>");
		if ( !this.bEmbedded ) {
			aHTML.push("<div id='sap-ui-quickhelp' style='position:fixed;display:none;padding:5px;background-color:rgb(200,220,231);border:1px solid gray;overflow:hidden'>Help</div>");
		}
		aHTML.push("<div style='border-bottom:1px solid gray'>&nbsp;</div><table cellspacing='1' style='font-size:8pt;width:100%;table-layout:fixed'>");
	
		while ( oMetadata instanceof ElementMetadata ) {
			var mProperties = oMetadata.getProperties();
			var bHeaderCreated = false;
			if ( !jQuery.isEmptyObject(mProperties) ) {
				if ( !bHeaderCreated && oMetadata !== oControl.getMetadata() ) {
					aHTML.push("<tr><td colspan=\"2\">BaseType: ");
					aHTML.push(oMetadata.getName());
					aHTML.push("</td></tr>");
					bHeaderCreated = true;
				}
				this.printProperties(aHTML, oControl, mProperties);
			}
			var mProperties = this.getAggregationsAsProperties(oMetadata);
			if ( !jQuery.isEmptyObject(mProperties) ) {
				if ( !bHeaderCreated && oMetadata !== oControl.getMetadata() ) {
					aHTML.push("<tr><td colspan=\"2\">BaseType: ");
					aHTML.push(oMetadata.getName());
					aHTML.push("</td></tr>");
					bHeaderCreated = true;
				}
				this.printProperties(aHTML, oControl, mProperties);
			}
			oMetadata = oMetadata.getParent();
		}
	
		aHTML.push("</table>");
		this.oParentDomRef.innerHTML = aHTML.join("");
		this.mHelpDocs = {};
	};
	
	PropertyList.prototype.getAggregationsAsProperties = function(oMetadata) {
	
		function isSimpleType(sType) {
			if ( !sType ) {
				return false;
			}
	
			if ( sType.indexOf("[]") > 0 ) {
				sType = sType.substring(sType.indexOf("[]"));
			}
	
			if ( sType === "boolean" || sType === "string" || sType === "int" || sType === "float" ) {
				return true;
			}
	
			if ( sType === "void" ) {
				return false;
			}
	
			// TODO check for enum
	
			return false;
		}
	
		var oResult = {};
		for (var sAggrName in oMetadata.getAggregations() ) {
			var oAggr = oMetadata.getAggregations()[sAggrName];
			if ( oAggr.altTypes && oAggr.altTypes[0] && isSimpleType(oAggr.altTypes[0]) ) {
				oResult[sAggrName] = { name : sAggrName, type : oAggr.altTypes[0], _oParent : oAggr._oParent };
			}
		}
		return oResult;
	
	};
	
	/**
	 * TODO: missing internal JSDoc... @author please update
	 * @private
	 */
	PropertyList.prototype.printProperties = function(aHTML, oControl, mProperties, bAggregation) {
		for (var i in mProperties) {
			var sName = i,
				sType = mProperties[i].type,
				oMethod =  oControl["get" + sName];
			if (!oMethod) {
				sName = jQuery.sap.charToUpperCase(sName,0);
			}
			var oValue = oControl["get" + sName]();
			aHTML.push("<tr><td>");
			this.mProperties[sName] = sType;
			aHTML.push("<span data-sap-ui-quickhelp='", this._calcHelpId(mProperties[i]._oParent, i), "' >", sName, '</span>');
			aHTML.push("</td><td>");
			var sTitle = "";
			if (sType == "string" || sType == "int" || sType == "float" || jQuery.sap.endsWith(sType, "[]")) {
				var sColor = '';
				if ( oValue === null ) {
					sColor = 'color:#a5a5a5;';
					oValue = '(null)';
				} else if ( oValue  instanceof Element ) {
					sColor = 'color:#a5a5a5;';
					if (jQuery.isArray(oValue)) {
						// array type (copied from primitive values above and modified the value to string / comma separated)
						oValue = oValue.join(", ");
					} else {
						oValue = oValue.toString();
					}
					sTitle = ' title="This aggregation currently references an Element. You can set a ' + sType +  ' value instead"';
				}
				aHTML.push("<input type='text' style='width:100%;font-size:8pt;background-color:#f5f5f5;" + sColor + "' value='" + jQuery.sap.encodeHTML("" + oValue) + "'" + sTitle + " sap-name='" + sName + "'/>");
			} else if (sType == "boolean") {
				aHTML.push("<input type='checkbox' sap-name='" + sName + "' ");
				if (oValue == true) {
					aHTML.push("checked='checked'");
				}
				aHTML.push("/>");
			} else if (sType != "void") {
				//Enum or Custom Type
				var oEnum = jQuery.sap.getObject(sType);
				if (!oEnum || oEnum instanceof DataType) {
					aHTML.push("<input type='text' style='width:100%;font-size:8pt;background-color:#f5f5f5;' value='" + jQuery.sap.encodeHTML("" + oValue) + "'" + sTitle + " sap-name='" + sName + "'/>");
				} else {
					aHTML.push("<select style='width:100%;font-size:8pt;background-color:#f5f5f5;' sap-name='" + sName + "'>");
					sType = sType.replace("/",".");
					for (var n in oEnum) {
						aHTML.push("<option ");
						if (n == oValue) {
							aHTML.push(" selected ");
						}
						aHTML.push("value='" + sType + "." + n + "'>");
						aHTML.push(n);
						aHTML.push("</option>");
					}
					aHTML.push("</select>");
				}
			} else {
				aHTML.push("&nbsp;");
			}
			aHTML.push("</td></tr>");
		}
	};
	
	/**
	 * TODO: missing internal JSDoc... @author please update
	 * @private
	 */
	PropertyList.prototype.onkeydown = function(oEvent) {
		if (oEvent.keyCode == 13) {
			this.applyChanges("sap-debug-propertylist-apply");
		}
	};
	
	/**
	 * TODO: missing internal JSDoc... @author please update
	 * @private
	 */
	PropertyList.prototype.onclick = function(oEvent) {
		var oSource = oEvent.target;
		if (oSource.id == "sap-debug-propertylist-apply") {
			this.applyChanges("sap-debug-propertylist-apply");
		}
	};
	
	/**
	 * TODO: missing internal JSDoc... @author please update
	 * @private
	 */
	PropertyList.prototype.onfocus = function(oEvent) {
		var oSource = oEvent.target;
		if (oSource.tagName === "INPUT" && oSource.getAttribute("sap-name") ) {
			if ( oSource.style.color === '#a5a5a5' /* && oSource.value === '(null)' */ ) {
				oSource.style.color = '';
				oSource.value = '';
			}
		}
	};
	
	/**
	 * TODO: missing internal JSDoc... @author please update
	 * @private
	 */
	PropertyList.prototype.applyChanges = function(sId) {
		var oSource = this.oParentDomRef.ownerDocument.getElementById(sId),
			sControlId = oSource.getAttribute("sap-id"),
			oControl = this.oCore.byId(sControlId),
			aInput = oSource.parentNode.getElementsByTagName("INPUT"),
			aSelect = oSource.parentNode.getElementsByTagName("SELECT"),
			oMethod;
	
		for (var i = 0; i < aInput.length; i++) {
			var oInput = aInput[i],
				sName = oInput.getAttribute("sap-name");
				oMethod = oControl["set" + sName];
			if (!oMethod) {
				sName = jQuery.sap.charToUpperCase(sName,0);
			}
			if (oControl["set" + sName]) {
				var oType = DataType.getType(this.mProperties[sName]);
				var vValue = this.mProperties[sName] === "boolean" ? oInput.checked : oType.parseValue(oInput.value);
				if (oType.isValid(vValue) && vValue !== "(null)" ) {
					oControl["set" + sName](vValue);
				}
			}
		}
		for (var i = 0; i < aSelect.length; i++) {
			var oSelect = aSelect[i],
				sName = oSelect.getAttribute("sap-name");
			oMethod = oControl["set" + sName];
			if (!oMethod) {
				sName = jQuery.sap.charToUpperCase(sName,0);
			}
			var oValue = null;
			if (oSelect.value) {
				/*eslint-disable no-eval */
				eval("oValue = " + oSelect.value);
				oControl["set" + sName](oValue);
				/*eslint-enable no-eval */
			}
		}
		this.oCore.applyChanges();
	};
	
	PropertyList.prototype.showQuickHelp = function(oSource) {
		if ( this.oQuickHelpTimer ) {
			clearTimeout(this.oQuickHelpTimer);
			this.oQuickHelpTimer = undefined;
		}
		var oTooltipDomRef = this.oParentDomRef.ownerDocument.getElementById("sap-ui-quickhelp");
		if ( oTooltipDomRef ) {
			this.sCurrentHelpId = oSource.getAttribute("data-sap-ui-quickhelp");
			var oRect = jQuery(oSource).rect();
			oTooltipDomRef.style.left = (oRect.left + 40 + 10) + "px";
			oTooltipDomRef.style.top = (oRect.top - 40) + "px";
			oTooltipDomRef.style.display = 'block';
			oTooltipDomRef.style.opacity = '0.2';
			oTooltipDomRef.style.filter = 'progid:DXImageTransform.Microsoft.Alpha(opacity=20)';
			if ( this.mHelpDocs[this.sCurrentHelpId] ) {
				this.updateQuickHelp(this.mHelpDocs[this.sCurrentHelpId], 2000);
			} else {
				oTooltipDomRef.innerHTML = "<b>Quickhelp</b> for " + this.sCurrentHelpId + " is being retrieved...";
				this.sCurrentHelpDoc = this.sCurrentHelpId;
				this.sCurrentHelpDocPart = undefined;
				if ( this.sCurrentHelpId.indexOf('#') >= 0 ) {
					this.sCurrentHelpDoc = this.sCurrentHelpId.substring(0, this.sCurrentHelpId.indexOf('#'));
					this.sCurrentHelpDocPart = this.sCurrentHelpId.substring(this.sCurrentHelpId.indexOf('#') + 1);
				}
				var sUrl = this.oWindow.jQuery.sap.getModulePath(this.sCurrentHelpDoc, ".control");
				var that = this;
				jQuery.ajax({
					async: true,
					url : sUrl,
					dataType : 'xml',
					error : function(xhr,status) {
						that.receiveQuickHelp(undefined);
					},
					success : function(data) {
						that.receiveQuickHelp(data);
					}
				});
				this.oQuickHelpTimer = setTimeout(function () {
					that.hideQuickHelp();
				}, 2000);
			}
		}
	};
	
	// ---- Quickhelp ----
	
	PropertyList.prototype.receiveQuickHelp = function(oDocument) {
		if ( oDocument ) {
			var oControlNode = oDocument.getElementsByTagName("control")[0];
			if ( oControlNode ) {
				// debugger;
				var get = function(oXMLNode, sName) {
					var result = [];
					var oCandidate = oXMLNode.firstChild;
					while ( oCandidate ) {
						if ( sName === oCandidate.nodeName ) {
							result.push(oCandidate);
						}
						oCandidate = oCandidate.nextSibling;
					}
					return result;
				};
				var aName = get(oControlNode, "name");
				var sName = '';
				if ( aName[0] ) {
					sName = aName[0].text || aName[0].textContent;
				}
				var aDocumentation = get(oControlNode, "documentation");
				if ( aDocumentation[0] ) {
					if ( sName && aDocumentation[0] ) {
						var doc = [];
						doc.push("<div style='font-size:10pt;font-weight:bold;padding:5px 0px;margin-bottom:5px;border-bottom:1px solid gray'>", sName.replace('/', '.'), "</div>");
						doc.push("<div style='padding:2px 0px;'>", aDocumentation[0].text || aDocumentation[0].textContent, "</div>");
						this.mHelpDocs[this.sCurrentHelpDoc] = doc.join("");
					}
				}
				var aProperties = get(oControlNode, "properties");
				if ( aProperties[0] ) {
					aProperties = get(aProperties[0], "property");
				}
				for (var i = 0, l = aProperties.length; i < l; i++) {
					var oProperty = aProperties[i];
					var sName = oProperty.getAttribute("name");
					var sType = oProperty.getAttribute("type") || "string";
					var sDefaultValue = oProperty.getAttribute("defaultValue") || "empty/undefined";
					var aDocumentation = get(oProperty, "documentation");
					if ( sName && aDocumentation[0] ) {
						var doc = [];
						doc.push("<div style='font-size:10pt;font-weight:bold;padding:3px 0px;margin-bottom:3px;border-bottom:1px solid gray'>", sName, "</div>");
						doc.push("<div style='padding:2px 0px;'><i><strong>Type</strong></i>: ", sType, "</div>");
						doc.push("<div style='padding:2px 0px;'>", aDocumentation[0].text || aDocumentation[0].textContent, "</div>");
						doc.push("<div style='padding:2px 0px;'><i><strong>Default Value</strong></i>: ", sDefaultValue, "</div>");
						this.mHelpDocs[this.sCurrentHelpDoc + "#" + sName] = doc.join("");
					}
				}
				var aProperties = get(oControlNode, "aggregations");
				if ( aProperties[0] ) {
					aProperties = get(aProperties[0], "aggregation");
				}
				for (var i = 0, l = aProperties.length; i < l; i++) {
					var oProperty = aProperties[i];
					var sName = oProperty.getAttribute("name");
					var sType = oProperty.getAttribute("type") || "sap.ui.core/Control";
					var sDefaultValue = oProperty.getAttribute("defaultValue") || "empty/undefined";
					var aDocumentation = get(oProperty, "documentation");
					if ( sName && aDocumentation[0] && !this.mHelpDocs[this.sCurrentHelpDoc + "#" + sName]) {
						var doc = [];
						doc.push("<div style='font-size:10pt;font-weight:bold;padding:3px 0px;margin-bottom:3px;border-bottom:1px solid gray'>", sName, "</div>");
						doc.push("<div style='padding:2px 0px;'><i><strong>Type</strong></i>: ", sType, "</div>");
						doc.push("<div style='padding:2px 0px;'>", aDocumentation[0].text || aDocumentation[0].textContent, "</div>");
						doc.push("<div style='padding:2px 0px;'><i><strong>Default Value</strong></i>: ", sDefaultValue, "</div>");
						this.mHelpDocs[this.sCurrentHelpDoc + "#" + sName] = doc.join("");
					}
				}
			}
			if ( this.mHelpDocs[this.sCurrentHelpId] ) {
				this.updateQuickHelp(this.mHelpDocs[this.sCurrentHelpId], 2000);
			} else {
				this.updateQuickHelp(undefined, 0);
			}
		} else {
			this.updateQuickHelp(undefined, 0);
		}
	};
	
	PropertyList.prototype.updateQuickHelp = function(sNewContent, iTimeout) {
		if ( this.oQuickHelpTimer ) {
			clearTimeout(this.oQuickHelpTimer);
			this.oQuickHelpTimer = undefined;
		}
		var oTooltipDomRef = this.oParentDomRef.ownerDocument.getElementById("sap-ui-quickhelp");
		if ( oTooltipDomRef ) {
			if ( !sNewContent ) {
				oTooltipDomRef.innerHTML = "<i>No quick help...</i>";
				oTooltipDomRef.style.display = 'none';
			} else {
				oTooltipDomRef.innerHTML = sNewContent;
				var that = this;
				this.oQuickHelpTimer = setTimeout(function () {
					that.hideQuickHelp();
				}, iTimeout);
			}
		}
	};
	
	PropertyList.prototype.hideQuickHelp = function() {
		var oTooltipDomRef = this.oParentDomRef.ownerDocument.getElementById("sap-ui-quickhelp");
		if ( oTooltipDomRef ) {
			oTooltipDomRef.style.display = 'none';
		}
		this.bMovedOverTooltip = false;
	};
	
	PropertyList.prototype._calcHelpId = function(oMetadata, sName) {
		var sHelpId = oMetadata.getName();
		if ( sName ) {
			sHelpId = sHelpId + "#" + sName;
		}
		return sHelpId;
	};
	
	PropertyList.prototype._isChildOfQuickHelp = function(oDomRef) {
		while ( oDomRef ) {
			if ( oDomRef.id === "sap-ui-quickhelp" ) {
				return true;
			}
			oDomRef = oDomRef.parentNode;
		}
		return false;
	};
	
	/**
	 * TODO: missing internal JSDoc... @author please update
	 * @private
	 */
	PropertyList.prototype.onmouseover = function(oEvent) {
		var oSource = oEvent.target;
		if ( this._isChildOfQuickHelp(oSource) ) {
			// if the user enteres the tooltip with the mouse, we don't close it automatically
			if ( this.oQuickHelpTimer ) {
				clearTimeout(this.oQuickHelpTimer);
				this.oQuickHelpTimer = undefined;
			}
			this.bMovedOverTooltip = true;
			var oTooltipDomRef = this.oParentDomRef.ownerDocument.getElementById("sap-ui-quickhelp");
			if ( oTooltipDomRef ) {
				oTooltipDomRef.style.opacity = '';
				oTooltipDomRef.style.filter = '';
			}
		} else if ( oSource.getAttribute("data-sap-ui-quickhelp") ) {
			this.showQuickHelp(oSource);
		}
	};
	
	/**
	 * TODO: missing internal JSDoc... @author please update
	 * @private
	 */
	PropertyList.prototype.onmouseout = function(oEvent) {
		var oSource = oEvent.target;
		if ( this._isChildOfQuickHelp(oSource) ) {
			if ( this.oQuickHelpTimer ) {
				clearTimeout(this.oQuickHelpTimer);
				this.oQuickHelpTimer = undefined;
			}
			this.bMovedOverTooltip = false;
			var that = this;
			this.oQuickHelpTimer = setTimeout(function () {
				that.hideQuickHelp();
			}, 50);
		} else if (oSource.getAttribute("data-sap-ui-quickhelp")) {
			if ( this.oQuickHelpTimer ) {
				clearTimeout(this.oQuickHelpTimer);
				this.oQuickHelpTimer = undefined;
			}
			if ( !this.bMovedOverTooltip ) {
				var that = this;
				this.oQuickHelpTimer = setTimeout(function () {
					that.hideQuickHelp();
				}, 800);
			}
		}
	};

	return PropertyList;

});
