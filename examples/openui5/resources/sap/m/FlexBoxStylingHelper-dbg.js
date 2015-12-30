/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global', './FlexBoxCssPropertyMap'],
	function(jQuery, FlexBoxCssPropertyMap) {
	"use strict";

	if (jQuery.support.useFlexBoxPolyfill) {
		// TODO: how to properly handle conditional requires with sap.ui.define?
		jQuery.sap.require("sap.ui.thirdparty.flexie");
	}

	/**
	 * FlexBox styling helper
	 * @namespace
	 */
	var FlexBoxStylingHelper = {};
	
	/**
	 * Goes through applicable styles and calls function to sets them on the given control.
	 *
	 * @param {sap.ui.core.RenderManager} oRm the RenderManager that can be used for writing to the render output buffer
	 * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
	 */
	FlexBoxStylingHelper.setFlexBoxStyles = function(oRm, oControl) {
		var sDisplay;
	
		// Prepare values by converting camel-case to dash and lower-casing
		var bInline = oControl.getDisplayInline();
		var sDirection = oControl.getDirection().replace(/\W+/g, "-").replace(/([a-z\d])([A-Z])/g, "$1-$2").toLowerCase();
		var bFitContainer = oControl.getFitContainer();
		var sJustifyContent = oControl.getJustifyContent().replace(/\W+/g, "-").replace(/([a-z\d])([A-Z])/g, "$1-$2").toLowerCase();
		var sAlignItems = oControl.getAlignItems().replace(/\W+/g, "-").replace(/([a-z\d])([A-Z])/g, "$1-$2").toLowerCase();
	
		if (bInline) {
			sDisplay = "inline-flex";
		} else {
			sDisplay = "flex";
		}
	
		// Set width and height for outermost FlexBox only if FitContainer is set
		if (bFitContainer && !(oControl.getParent() instanceof sap.m.FlexBox)) {
			oRm.addStyle("width", "auto");
			oRm.addStyle("height", "100%");
		}
	
		// Add flex prefix to start and end values
		if (sJustifyContent === "start" || sJustifyContent === "end") {
			sJustifyContent = "flex-" + sJustifyContent;
		}
	
		if (sAlignItems === "start" || sAlignItems === "end") {
			sAlignItems = "flex-" + sAlignItems;
		}
	
		// Set values (if different from default)
		FlexBoxStylingHelper.setStyle(oRm, oControl, "display", sDisplay);
		if (sDirection !== "row") {
			FlexBoxStylingHelper.setStyle(oRm, oControl, "flex-direction", sDirection);
		}
	
		if (sJustifyContent !== "flex-start") {
			FlexBoxStylingHelper.setStyle(oRm, oControl, "justify-content", sJustifyContent);
		}
		if (sAlignItems !== "stretch") {
			FlexBoxStylingHelper.setStyle(oRm, oControl, "align-items", sAlignItems);
		}
	//	if(jQuery.support.newFlexBoxLayout) {
	//		var sWrap = oControl.getWrap().replace(/\W+/g, "-").replace(/([a-z\d])([A-Z])/g, "$1-$2").toLowerCase();
	//		var sAlignContent = oControl.getAlignContent().replace(/\W+/g, "-").replace(/([a-z\d])([A-Z])/g, "$1-$2").toLowerCase();
	//
	//		if(sWrap !== "nowrap") {
	//			sap.m.FlexBoxStylingHelper.setStyle(oRm, oControl, "flex-wrap", sWrap);
	//		}
	//		if(sAlignContent === "start" || sAlignContent === "end") {
	//			sAlignContent = "flex-" + sAlignContent;
	//		}
	//		if(sAlignContent !== "stretch") {
	//			sap.m.FlexBoxStylingHelper.setStyle(oRm, oControl, "align-content", sAlignContent);
	//		}
	//	}
	};
	
	/**
	 * Goes through applicable item styles and sets them on the given control.
	 *
	 * @param {sap.ui.core.RenderManager} oRm the RenderManager that can be used for writing to the render output buffer
	 * @param {sap.m.FlexItemData} oLayoutData an object representation of the layout data
	 */
	FlexBoxStylingHelper.setFlexItemStyles = function(oRm, oLayoutData, oControl) {
		oRm = oRm || null;
		oControl = oControl || null;

		// Set values if different from default
		var order = oLayoutData.getOrder();
		if (order) {
			FlexBoxStylingHelper.setStyle(oRm, oControl, "order", order);
		}
	
		var growFactor = oLayoutData.getGrowFactor();
		if (growFactor !== undefined) {
			FlexBoxStylingHelper.setStyle(oRm, oControl, "flex-grow", growFactor);
		}
	
		var alignSelf = oLayoutData.getAlignSelf().toLowerCase();
	
		// Add flex prefix to start and end values to create CSS value
		if (alignSelf === "start" || alignSelf === "end") {
			alignSelf = "flex-" + alignSelf;
		}
	
		if (alignSelf && alignSelf !== "auto") {
			FlexBoxStylingHelper.setStyle(oRm, oControl, "align-self", alignSelf);
		}
	
		if (jQuery.support.newFlexBoxLayout || jQuery.support.ie10FlexBoxLayout) {
			var shrinkFactor = oLayoutData.getShrinkFactor();
			if (shrinkFactor !== 1) {
				FlexBoxStylingHelper.setStyle(oRm, oControl, "flex-shrink", shrinkFactor);
			}
	
			var baseSize = oLayoutData.getBaseSize().toLowerCase();
			if (baseSize !== undefined) {
				sap.m.FlexBoxStylingHelper.setStyle(oRm, oControl, "flex-basis", baseSize);
			}
		}
	};
	
	/**
	 * Sets style (including fall-back styles) to the given control, using the provided {@link sap.ui.core.RenderManager}.
	 * This method does NOT apply a polyfill in browsers that don't support flex box natively.
	 *
	 * @param {sap.ui.core.RenderManager} oRm the RenderManager that can be used for writing to the render output buffer
	 * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
	 * @param sProperty name of the property
	 * @param sValue value of the property
	 */
	FlexBoxStylingHelper.setStyle = function(oRm, oControl, sProperty, sValue) {
		if (typeof (sValue) === "string") {
			sValue = sValue.toLowerCase();
		}
	
		// Determine vendor prefix
		var sVendorPrefix = "";
	
		if (jQuery.support.flexBoxPrefixed) {
			if (sap.ui.Device.browser.webkit) {
				sVendorPrefix = "-webkit-";
			} else if (sap.ui.Device.browser.mozilla) {
				sVendorPrefix = "-moz-";
			} else if (sap.ui.Device.browser.internet_explorer) {
				sVendorPrefix = "-ms-";
			}
		}
	
		// Choose flex box styling method
		if (jQuery.support.newFlexBoxLayout) {
			// New spec
			FlexBoxStylingHelper.setFinalSpecStyle(oRm, oControl, sProperty, sValue, sVendorPrefix);
		} else if (jQuery.support.flexBoxLayout || jQuery.support.ie10FlexBoxLayout) {
			// Old spec
			FlexBoxStylingHelper.setOldSpecStyle(oRm, oControl, sProperty, sValue, sVendorPrefix);
		}
	};
	
	/**
	 * Sets style for the FINAL flex box spec to the given control, using the provided {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} oRm the RenderManager that can be used for writing to the render output buffer
	 * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
	 * @param sProperty name of the property
	 * @param sValue value of the property
	 * @param sVendorPrefix vendor prefix
	 */
	FlexBoxStylingHelper.setFinalSpecStyle = function(oRm, oControl, sProperty, sValue, sVendorPrefix) {
		if (jQuery.support.flexBoxPrefixed) {
			// With vendor prefix
			FlexBoxStylingHelper.writeStyle(oRm, oControl, sProperty, sValue, sVendorPrefix);
		}
	
		// Pure standard
		FlexBoxStylingHelper.writeStyle(oRm, oControl, sProperty, sValue);
	};
	
	/**
	 * Sets style for the OLD or the IE10 flex box spec to the given control, using the provided {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} oRm the RenderManager that can be used for writing to the render output buffer
	 * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
	 * @param sProperty name of the property
	 * @param sValue value of the property
	 * @param sVendorPrefix vendor prefix
	 */
	FlexBoxStylingHelper.setOldSpecStyle = function(oRm, oControl, sProperty, sValue, sVendorPrefix) {
		// Choose specification
		var sSpec = "";
		if (sVendorPrefix == "-ms-") {
			sSpec = "specie10"; // IE10 specification
		} else {
			sSpec = "spec0907";	// old specification
		}
	
		// Nothing to do if final standard is supported or property doesn't exist in this spec or is the same as standard
		// Else map to old property
		if (FlexBoxCssPropertyMap[sSpec][sProperty] !== null && FlexBoxCssPropertyMap[sSpec][sProperty] !== "<idem>") {
			// Prepare mapped properties and values
			var mLegacyMap = null;
			if (typeof (FlexBoxCssPropertyMap[sSpec][sProperty]) === "object") {
				if (FlexBoxCssPropertyMap[sSpec][sProperty]["<number>"]) {
					mLegacyMap = {};
					for (var key in FlexBoxCssPropertyMap[sSpec][sProperty]["<number>"]) {
						// Check if the target is also a number, otherwise assume it's a literal
						if (FlexBoxCssPropertyMap[sSpec][sProperty]["<number>"][key] === "<number>") {
							mLegacyMap[key] = sValue;
						} else {
							mLegacyMap[key] = FlexBoxCssPropertyMap[sSpec][sProperty]["<number>"][key];
						}
					}
				} else {
					mLegacyMap = FlexBoxCssPropertyMap[sSpec][sProperty][sValue];
				}
			} else {
				mLegacyMap = FlexBoxCssPropertyMap[sSpec][sProperty][sValue];
			}
	
			// Nothing to do if value doesn't exist or is the same as standard
			if (mLegacyMap !== null && mLegacyMap !== "<idem>") {
				if (typeof (mLegacyMap) === "object") {
					for (var sLegacyProperty in mLegacyMap) {
						// Write property/value to control
						FlexBoxStylingHelper.writeStyle(oRm, oControl, sLegacyProperty, mLegacyMap[sLegacyProperty], sVendorPrefix);
					}
				}
			}
		}
	};
	
	/**
	 * Writes the style to the given control, using the provided {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} oRm the RenderManager that can be used for writing to the render output buffer
	 * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
	 * @param sProperty name of the property
	 * @param sValue value of the property
	 * @param sVendorPrefix vendor prefix
	 */
	FlexBoxStylingHelper.writeStyle = function(oRm, oControl, sProperty, sValue, sVendorPrefix) {
		var sPropertyPrefix = "";
		var sValuePrefix = "";
		sVendorPrefix = typeof sVendorPrefix !== "undefined" ? sVendorPrefix : "";	// default: empty string
	
		// Set prefix to value for display property
		// As display is a long-standing standard property the values are vendor-prefixed instead of the property name
		if (sProperty !== "display") {
			sPropertyPrefix = sVendorPrefix;
		} else {
			sValuePrefix = sVendorPrefix;
		}
	
		// Finally write property value to control using either renderer or element directly
		if (oRm) {
			oRm.addStyle(sPropertyPrefix + sProperty, sValuePrefix + sValue);
		} else {
			jQuery(oControl).css(sPropertyPrefix + sProperty, sValuePrefix + sValue);
		}
	};
	
	/**
	 * Applies flex box polyfill styling to the given DOM element and its children (if polyfill is being used at all)
	 *
	 * @param sId DOM ID of the control that should be turned into a flex box
	 * @param oSettings object holding the flex box settings
	 */
	FlexBoxStylingHelper.applyFlexBoxPolyfill = function(sId, oSettings) {
		// Return if polyfill is not being used
		if (!jQuery.support.useFlexBoxPolyfill) {
			jQuery.sap.log.warning("FlexBox Polyfill is not being used");
			return;
		}
		var justifyContent = {
			Start: "start",
			Center: "center",
			End: "end",
			SpaceBetween : "justify"
		};
		var alignItems = {
			Start: "start",
			Center: "center",
			End: "end",
			Stretch : "stretch"
		};
		
		var orient = "";
		var direction = "";
		
		switch (oSettings.direction) {
			case "Column" :
				orient = "vertical";
				direction = "normal";
				break;
			case "RowReverse" :
				orient = "horizontal";
				direction = "reverse";
				break;
			case "ColumnReverse" :
				orient = "vertical";
				direction = "reverse";
				break;
			case "Row" :
			default:
				orient = "horizontal";
				direction = "normal";
		}
	
		var box = new window.Flexie.box({
			target : document.getElementById(sId),
			orient : orient,
			align : alignItems[oSettings.alignItems],
			direction : direction,
			pack : justifyContent[oSettings.justifyContent],
			flexMatrix : oSettings.flexMatrix,
			ordinalMatrix : oSettings.ordinalMatrix,
		    dynamic: true
		});
		
		return box;
	};

	return FlexBoxStylingHelper;

}, /* bExport= */ true);
