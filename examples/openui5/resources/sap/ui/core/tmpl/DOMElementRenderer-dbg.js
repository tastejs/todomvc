/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// A renderer for the DOM element control
sap.ui.define(['jquery.sap.global'],
	function(jQuery) {
	"use strict";


	/**
	 * @class DOM element renderer.
	 * @static
	 * @alias sap.ui.core.tmpl.DOMElementRenderer
	 */
	var DOMElementRenderer = {};
	
	/**
	 * Renders the DOM element for the given control, using the provided
	 * {@link sap.ui.core.RenderManager}.
	 * 
	 * @param {sap.ui.core.RenderManager}
	 *            oRM RenderManager that can be used for writing to the
	 *            Render-Output-Buffer
	 * @param {sap.ui.core.Control}
	 *            oElement Object representation of the DOM element that should be
	 *            rendered
	 */
	DOMElementRenderer.render = function(oRM, oElement) {
			
		// opening tag incl. control data
		oRM.write("<");
		oRM.write(oElement.getTag());
		oRM.writeControlData(oElement);
		
		// add the attributes of the DOM element
		jQuery.each(oElement.getAttributes(), function(iIndex, oAttribute) {
			var sName = oAttribute.getName().toLowerCase();
			if (sName === "class") {
				// the class attribute will be splitted and added separately
				var aClasses = oAttribute.getValue().split(" ");
				jQuery.each(aClasses, function(iIndex, sClass) {
					var sClass = sClass.trim();
					if (sClass) {
						oRM.addClass(sClass);
					}
				});
			} else if (sName === "style") {
				// the style attribute will be splitted and added separately
				var aStyles = oAttribute.getValue().split(";");
				jQuery.each(aStyles, function(iIndex, sStyle) {
					var iIndex = sStyle.indexOf(":");
					if (iIndex != -1) {
						var sKey = sStyle.substring(0, iIndex).trim();
						var sValue = sStyle.substring(iIndex + 1).trim();
						oRM.addStyle(sKey, sValue);
					}
				});
			} else {
				oRM.writeAttributeEscaped(oAttribute.getName(), oAttribute.getValue());
			}
		});
		
		// support for custom classes and styles
		oRM.writeClasses();
		oRM.writeStyles();
		
		// create the nested structure (if required)
		var aElements = oElement.getElements(),
			bHasChildren = !!oElement.getText() || aElements.length > 0;
		
		if (!bHasChildren) {
			oRM.write("/>");
		} else {
			oRM.write(">");
			
			// append the text (do escaping)
			if (oElement.getText()) {
				oRM.writeEscaped(oElement.getText());
			}
			
			// append the nested DOM elements
			jQuery.each(aElements, function(iIndex, oChildElement) {
				oRM.renderControl(oChildElement);
			});
	
			// closing tag
			oRM.write("</");
			oRM.write(oElement.getTag());
			oRM.write(">");
		}
	};

	return DOMElementRenderer;

}, /* bExport= */ true);
