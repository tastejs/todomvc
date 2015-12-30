/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(['jquery.sap.global'],
	function(jQuery) {
	"use strict";


	/**
	 * SearchField renderer.
	 * @namespace
	 */
	var SearchFieldRenderer = {
	};
	
	/**
	 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} rm the RenderManager that can be used for writing to the Render-Output-Buffer
	 * @param {sap.ui.core.Control} oSF an object representation of the control that should be rendered
	 */
	SearchFieldRenderer.render = function(rm, oSF){
		// render nothing if control is invisible
		if (!oSF.getVisible()) {
			return;
		}
	
		var sPlaceholder = oSF.getPlaceholder(),
			sValue = oSF.getValue(),
			sWidth = oSF.getProperty("width"),
			sId = oSF.getId(),
			bShowRefreshButton = oSF.getShowRefreshButton(),
			bShowSearchBtn = oSF.getShowSearchButton(),
			oAccAttributes = {}; // additional accessibility attributes
	
		// container
		rm.write("<div");
		rm.writeControlData(oSF);
		if (sWidth) { rm.writeAttribute("style", "width:" + sWidth + ";"); }
	
		rm.addClass("sapMSF");
	
		if (sValue) {
			rm.addClass("sapMSFVal");
		}
		if (!oSF.getEnabled()) {
			rm.addClass("sapMSFDisabled");
		}
	
		rm.writeClasses();
		var sTooltip = oSF.getTooltip_AsString();
		if (sTooltip) {
			rm.writeAttributeEscaped("title", sTooltip);
		}
		rm.write(">");
	
			// 1. Input type="search".
			//    Enclose input into a <form> to show a correct keyboard
			//    method="post" to prevent unneeded "?" at the end of URL
			rm.write('<form method="post" action="javascript:void(0);"');
			rm.addClass('sapMSFF');
			if (!bShowSearchBtn) {
				rm.addClass("sapMSFNS"); //no search button
			} else if (bShowRefreshButton) {
				rm.addClass('sapMSFReload');
			}
			rm.writeClasses();
			rm.write('>');
		
			// self-made placeholder
			if (!oSF._hasPlacehoder && sPlaceholder) {
				rm.write("<label ");
				rm.writeAttribute("id", sId + "-P");
				rm.writeAttribute("for", sId + "-I");
		
				rm.addClass("sapMSFPlaceholder");
				rm.writeClasses();
				rm.write(">");
				rm.writeEscaped(sPlaceholder);
				rm.write("</label>");
			}
		
			rm.write('<input type="search" autocorrect="off" autocomplete="off"');
			rm.writeAttribute("id", oSF.getId() + "-I");
		
			rm.addClass("sapMSFI");
		
			if (sap.ui.Device.os.android && sap.ui.Device.os.version >= 4 && sap.ui.Device.os.version < 4.1 ) {
				rm.addClass("sapMSFIA4"); // specific CSS layout for Android 4.0x
			}
		
			rm.writeClasses();
		
			if (!oSF.getEnabled()) { rm.writeAttribute("disabled","disabled"); }
			if (sPlaceholder) { rm.writeAttributeEscaped("placeholder", sPlaceholder); }
			if (oSF.getMaxLength()) { rm.writeAttribute("maxLength", oSF.getMaxLength()); }
			if (sValue) { rm.writeAttributeEscaped("value", sValue); }

			//ARIA attributes
			if (oSF.getEnabled() && bShowRefreshButton) {
				oAccAttributes.describedby = {
					value: oSF._sAriaF5LabelId,
					append: true
				};
			}
			rm.writeAccessibilityState(oSF, oAccAttributes);

			rm.write(">");
		
			if (oSF.getEnabled()) {
				// 2. Reset button
				rm.write("<div");
				rm.writeAttribute("id", oSF.getId() + "-reset");
				rm.addClass("sapMSFR"); // reset
				rm.addClass("sapMSFB"); // button
				if (sap.ui.Device.browser.firefox) {
					rm.addClass("sapMSFBF"); // firefox, active state by peventDefault
				}
				if (!bShowSearchBtn) {
					rm.addClass("sapMSFNS"); //no search button
				}
				rm.writeClasses();
				rm.write("></div>");
		
				// 3. Search/Refresh button
				if (bShowSearchBtn) {
					rm.write("<div");
					rm.writeAttribute("id", oSF.getId() + "-search");
					rm.addClass("sapMSFS"); // search
					rm.addClass("sapMSFB"); // button
					if (sap.ui.Device.browser.firefox) {
						rm.addClass("sapMSFBF"); // firefox, active state by peventDefault
					}
					rm.writeClasses();
					if (oSF.getRefreshButtonTooltip()) {
						rm.writeAttributeEscaped("title", oSF.getRefreshButtonTooltip());
					}
					rm.write( "></div>");
				}
			}
		
			rm.write("</form>");
	
		rm.write("</div>");
	
	};
	

	return SearchFieldRenderer;

}, /* bExport= */ true);
