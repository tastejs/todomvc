/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides default renderer for the sap.ui.ux3.Feeder
sap.ui.define(['jquery.sap.global'],
	function(jQuery) {
	"use strict";


	/**
	 * Feeder renderer.
	 * @namespace
	 */
	var FeederRenderer = {
	};
	
	
	/**
	 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} oRenderManager the RenderManager that can be used for writing to the Render-Output-Buffer
	 * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
	 */
	FeederRenderer.render = function(oRenderManager, oControl){
	    // convenience variable
		var rm = oRenderManager;
		var oFeeder = oControl;
	
		// write the HTML into the render manager
	    rm.write('<DIV');
	    rm.writeControlData(oFeeder);
		rm.addClass('sapUiFeeder');
	
		switch (oFeeder.getType()) {
		case sap.ui.ux3.FeederType.Medium:
			rm.addClass('sapUiFeederMedium');
		break;
		case sap.ui.ux3.FeederType.Comment:
			rm.addClass('sapUiFeederComment');
		break;
		default: // large feeder is default
			rm.addClass('sapUiFeederLarge');
		break;
		}
	
		rm.writeClasses();
	    rm.write('>');
	
	    // thumbnail
		rm.write('<img id=' + oFeeder.getId() + '-thumb');
		var sThumbnail = oFeeder.getThumbnailSrc();
		if (!sThumbnail) {
			sThumbnail = jQuery.sap.getModulePath("sap.ui.ux3.themes." + sap.ui.getCore().getConfiguration().getTheme(), sap.ui.core.theming.Parameters.get("sapUiFeedPersonPlaceholder"));
		}
		rm.writeAttributeEscaped('src', sThumbnail);
	
	//	rm.writeAttributeEscaped('alt', oChunk.getSender());
		rm.writeClasses();
		rm.write('>');
	
		// input area as editable DIV because of dynamic content
	    rm.write('<DIV id=' + oFeeder.getId() + '-input contenteditable="true" class="sapUiFeederInput" >');
	
	    // text
	    if (oFeeder.getText() == '') {
			rm.write(this.getEmptyTextInfo( oFeeder ));
	    } else {
			rm.writeEscaped(oFeeder.getText(), true);
	    }
	
	    rm.write('</DIV>');
	
	    //send button
	    oFeeder.initSendButton();
	    rm.renderControl(oFeeder.oSendButton);
	
	    rm.write('</DIV>');
	};
	
	FeederRenderer.getEmptyTextInfo = function( oFeeder ){
		return "<span class='sapUiFeederEmptyText'>" + jQuery.sap.encodeHTML(oFeeder.getPlaceholderText() || oFeeder.rb.getText("FEED_EMPTY_FEEDER")) + "</span>";
	};
	

	return FeederRenderer;

}, /* bExport= */ true);
