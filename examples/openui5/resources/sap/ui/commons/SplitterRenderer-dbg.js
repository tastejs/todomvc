/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides default renderer for control sap.ui.commons.Splitter
sap.ui.define(['jquery.sap.global'],
	function(jQuery) {
	"use strict";


	/**
	 * @namespace
	 */
	var SplitterRenderer = {};
	
	/**
	 * Renders the HTML for the Splitter, using the provided {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} oRenderManager The RenderManager that can be used for writing to the Render-Output-Buffer
	 * @param {sap.ui.core.Control} oControl An object representation of the control that should be rendered
	 */
	SplitterRenderer.render = function(oRenderManager, oControl) {
		var rm = oRenderManager;
		var orientation = oControl.getSplitterOrientation();
		var position = oControl.getSplitterPosition();
		var dimensionSecPane;
		var oControls;
		var iLength;
		var i;
		/*
		 * dimension (height or width) of the first pane is equal to the position of the splitter bar
		 * dimension of the second pane is the remaining available place after placing the first place
		 * 100 - position
		 * the splitter bar width/height is not taken into account since it has a fix width/height of 4px,
		 * it will be calculated after rendering
		 * it will be converted into percentage once we had the width/height of the splitter available area in px
		 */
		position = position.substring(0, position.length - 1);
		dimensionSecPane = 100 - position;
	
		/* Opening Splitter Wrapper DIV*/
		rm.write("<div ");
		rm.writeControlData(oControl);
		rm.addClass("sapUiSplitter");
	
		rm.addStyle("width",  oControl.getWidth());
		rm.addStyle("height",  oControl.getHeight());
		rm.writeStyles();
		rm.writeClasses();
		rm.write(">");
	
		/*rendering the first pane*/
		rm.write("<div id=\"" + oControl.getId() + "_firstPane\" ");
		if (oControl.getShowScrollBars()) {
			rm.addStyle("overflow", "auto");
		} else {
			rm.addStyle("overflow", "hidden");
		}
		if (orientation == sap.ui.core.Orientation.Vertical) {
			rm.addClass("sapUiVSplitterFirstPane");
			rm.addStyle("width", position + "%");
		} else if (orientation == sap.ui.core.Orientation.Horizontal) {
			rm.addClass("sapUiHSplitterFirstPane");
			rm.addStyle("height", position + "%");
		}
	
		rm.writeClasses();
		rm.writeStyles();
		rm.write(">");
	
		/*First content (child controls)*/
		oControls = oControl.getFirstPaneContent();
		iLength = oControls.length;
		for (i = 0; i < iLength; i++) {
			rm.renderControl(oControls[i]);
		}
		rm.write("</div>");
	
		/*rendering the splitter bar*/
		rm.write("<div  id=\"" + oControl.getId() + "_SB\" tabIndex=\"0\" role=\"separator\" title=\"" + oControl.getText("SPLITTER_MOVE") + "\"");
		if (orientation == sap.ui.core.Orientation.Vertical) {
			if (oControl.getSplitterBarVisible()) {
				rm.addClass("sapUiVerticalSplitterBar");
			} else {
				rm.addClass("sapUiVerticalSplitterBarHidden");
			}
			rm.addStyle("width", 0 + "%");
		} else if (orientation == sap.ui.core.Orientation.Horizontal) {
			if (oControl.getSplitterBarVisible()) {
				rm.addClass("sapUiHorizontalSplitterBar");
			} else {
				rm.addClass("sapUiHorizontalSplitterBarHidden");
			}
			rm.addStyle("height", 0 + "%");
		}
		rm.writeClasses();
		rm.writeStyles();
		rm.write(">");
		rm.write("</div>");
	
		/*rendering the second pane*/
		rm.write("<div id=\"" + oControl.getId() + "_secondPane\" ");
		if (oControl.getShowScrollBars()) {
			rm.addStyle("overflow", "auto");
		} else {
			rm.addStyle("overflow", "hidden");
		}
		if (orientation == sap.ui.core.Orientation.Vertical) {
			rm.addClass("sapUiVSplitterSecondPane");
			rm.addStyle("width", dimensionSecPane + '%');
		} else if (orientation == sap.ui.core.Orientation.Horizontal) {
			rm.addClass("sapUiHSplitterSecondPane");
			rm.addStyle("height", dimensionSecPane + '%');
		}
		rm.writeClasses();
		rm.writeStyles();
		rm.write(">");
	
		/*Second content (child controls)*/
		oControls = oControl.getSecondPaneContent();
		iLength = oControls.length;
		for (i = 0; i < iLength; i++) {
			rm.renderControl(oControls[i]);
		}
		rm.write("</div>");
	
		/* Closing the Splitter Wrapper DIV*/
		rm.write("</div>");
	};

	return SplitterRenderer;

}, /* bExport= */ true);
