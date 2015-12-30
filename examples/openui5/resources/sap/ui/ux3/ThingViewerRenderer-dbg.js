/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
 
sap.ui.define(['jquery.sap.global'],
	function(jQuery) {
	"use strict";


	/**
	 * Thing renderer. 
	 * @namespace
	 */
	var ThingViewerRenderer = {
	};
	
	
	/**
	 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
	 * 
	 * @param {sap.ui.core.RenderManager} oRenderManager the RenderManager that can be used for writing to the Render-Output-Buffer
	 * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
	 */
	ThingViewerRenderer.render = function(oRenderManager, oControl){
	    // convenience variable
		var rm = oRenderManager;
		
		rm.write("<div");
		rm.writeControlData(oControl);
		rm.writeAttributeEscaped("style", "width:" + oControl.getWidth() + "; height:" + oControl.getHeight());
		rm.addClass('sapUiUx3TV');
		rm.writeClasses();
		rm.write(">");
		this.renderContent(rm,oControl);
		rm.write("</div>");
	};
	
	ThingViewerRenderer.renderContent = function(oRenderManager, oControl) {
	// convenience variable
		var rm = oRenderManager,
			headerType = oControl.getHeaderType();
	
		rm.write("<div role='Main' class='sapUiUx3TVContent' id='" + oControl.getId() + "-content'>");
		//render Header
		//rm.write("<div class='sapUiUx3TVHeader sapUiUx3TVNoActionBar'>");
		rm.write("<div class='sapUiUx3TVHeader sapUiUx3TVNoActionBar");
		if (oControl.getHeaderType() === sap.ui.ux3.ThingViewerHeaderType.Standard) {
			rm.write("'>");
		} else {
			rm.write(" sapUiUx3TVhorizontal'>");
		}
		rm.write("<div class='sapUiUx3TVHeaderContainerIdentifier'>");
		rm.write("<span role='heading' aria-level='1' class='sapUiUx3TVIdentifier'");
		rm.writeAttributeEscaped("title", oControl.getType());
		rm.write(">");
		rm.writeEscaped(oControl.getType());
		rm.write("</span>");
		rm.write("</div>");
	
		if (headerType === sap.ui.ux3.ThingViewerHeaderType.Standard) {
			rm.write("<div class='sapUiUx3TVHeaderGroupScrollContainer'>");
			rm.write("<div id='" + oControl.getId() + "-header' class='sapUiUx3TVHeaderContainer'>");
			this.renderHeader(rm,oControl);
			rm.write("</div>");
		} else {
			rm.write("<div id='" + oControl.getId() + "-header' class='sapUiUx3TVHeaderContainer'>");
			this.renderHeader(rm,oControl);
			rm.write("</div>");
			rm.write("<div class='sapUiUx3TVHeaderGroupScrollContainer sapUiUx3TVhorizontal'>");
		}
		// render Header Content
		rm.write("<div id='" + oControl.getId() + "-headerContent'");
		if (headerType === sap.ui.ux3.ThingViewerHeaderType.Standard) {
			rm.write(">");
		} else {
			rm.write("style='height:100%; white-space:nowrap'>");
		}
		this.renderHeaderContent(rm, oControl);
		rm.write("</div>");
	
		rm.write("</div>");
		rm.write("</div>");
	
		// render Facets
		rm.write("<div class='sapUiUx3TVFacets sapUiUx3TVNoActionBar");
		if (headerType === sap.ui.ux3.ThingViewerHeaderType.Standard) {
			rm.write("'>");
		} else {
			rm.write(" sapUiUx3TVhorizontal'>");
		}
		rm.write("<div role='Navigation' class='sapUiUx3TVFacetBar'>");
		rm.renderControl(oControl._getNavBar());
		rm.write("</div>");
		rm.write("<div id='" + oControl.getId() + "-facetContent' class='sapUiUx3TVFacetContent sapUiBodyBackground'>");
	
		// render Facet Content
		this.renderFacetContent(rm, oControl);
	
		rm.write("</div>");
		rm.write("</div>");
		this.renderToolbar(rm, oControl);
		rm.write("</div>");
	};
	
	/**
	 * Add root class to Thing
	 *
	 * @param {sap.ui.core.RenderManager}
	 *            oRenderManager the RenderManager that can be used for writing to
	 *            the Render-Output-Buffer
	 * @param {sap.ui.core.Control}
	 *            oControl an object representation of the control that should be
	 *            rendered
	 */
	ThingViewerRenderer.addRootClasses = function(oRenderManager, oControl) {
		var rm = oRenderManager;
		rm.addClass("sapUiUx3TV");
	};
	
	/**
	 * Add class to Thing
	 *
	 * @param {sap.ui.core.RenderManager}
	 *            oRenderManager the RenderManager that can be used for writing to
	 *            the Render-Output-Buffer
	 * @param {sap.ui.core.Control}
	 *            oControl an object representation of the control that should be
	 *            rendered
	 */
	ThingViewerRenderer.addOverlayClasses = function(oRenderManager, oControl) {
		var rm = oRenderManager;
		rm.addClass("sapUiUx3TVOverlay");
	};
	
	/**
	 * Renders the HTML for Thing Header
	 *
	 * @param {sap.ui.core.RenderManager}
	 *            oRenderManager the RenderManager that can be used for writing to
	 *            the Render-Output-Buffer
	 * @param {sap.ui.core.Control}
	 *            oControl an object representation of the control that should be
	 *            rendered
	 */
	ThingViewerRenderer.renderHeader = function(oRenderManager, oControl) {
		var rm = oRenderManager;
	
		rm.write("<div class='sapUiUx3TVIconBar'>");
		rm.writeIcon(oControl.getIcon(),["sapUiUx3TVIcon"],{
			role: 'presentation',
			id: oControl.getId() + '-swatch',
			title: null // prevent default icon tooltip
		});
		rm.write("<div class='sapUiUx3TVTitle'>");
		rm.write("<span role='heading' aria-level='2' class='sapUiUx3TVTitleFirst'");
		rm.writeAttributeEscaped("title", oControl.getTitle());
		rm.write(">");
		rm.writeEscaped(oControl.getTitle());
		rm.write("</span><br/>");
		rm.write("</div><div class='sapUiUx3TVTitle'>");
		rm.write("<span role='heading' aria-level='3' class='sapUiUx3TVTitleSecond'");
		rm.writeAttributeEscaped("title", oControl.getSubtitle());
		rm.write(">");
		rm.writeEscaped(oControl.getSubtitle());
		rm.write("</span>");
		rm.write("</div>");
		rm.write("</div>");
	};
	 
	 
	/**
	 * Renders the HTML for Thing Toolbar
	 *
	 * @param {sap.ui.core.RenderManager}
	 *            oRenderManager the RenderManager that can be used for writing to
	 *            the Render-Output-Buffer
	 * @param {sap.ui.core.Control}
	 *            oControl an object representation of the control that should be
	 *            rendered
	 */
	ThingViewerRenderer.renderToolbar = function(rm, oControl) {
		// render Toolbar
		if (oControl.getActionBar()) {
			rm.write("<div id='" + oControl.getId() + "-toolbar' class='sapUiUx3TVToolbar'>");
			rm.renderControl(oControl.getActionBar());
			rm.write("</div>");
		}
	};
	
	/**
	 * Renders the HTML for Thing Header content
	 *
	 * @param {sap.ui.core.RenderManager}
	 *            oRenderManager the RenderManager that can be used for writing to
	 *            the Render-Output-Buffer
	 * @param {sap.ui.core.Control}
	 *            oControl an object representation of the control that should be
	 *            rendered
	 */
	ThingViewerRenderer.renderHeaderContent = function(rm, oControl) {
		var headerContentList = oControl.getHeaderContent(),
			headerType = oControl.getHeaderType();
			
		for ( var i = 0; i < headerContentList.length; i++) {
			var headerContent = headerContentList[i];
			if (headerType === sap.ui.ux3.ThingViewerHeaderType.Standard) {
				rm.write("<hr class='sapUiUx3TVHRWhite'>");
			}
			rm.write("<div class='sapUiUx3TVHeaderContainer");
			if (headerType === sap.ui.ux3.ThingViewerHeaderType.Standard) {
				rm.write("' role='form'>");
			} else {
				rm.write(" sapUiUx3TVhorizontal' role='form'>");
			}
			if (headerContent.getTitle()) {
				rm.write("<div class='sapUiUx3TVHeaderGroupTitle'");
				rm.writeAttributeEscaped("title", headerContent.getTooltip_AsString() ? headerContent.getTooltip_AsString() : headerContent.getTitle());
				rm.write("><span role='heading' aria-level='4'>");
				rm.writeEscaped(headerContent.getTitle());
				rm.write("</span>");
				rm.write("</div>");
			}
			rm.write("<div class='sapUiUx3TVHeaderGroupContent'>");
			var childContent = headerContent.getContent();
			for ( var j = 0; j < childContent.length; j++) {
				var childControl = childContent[j];
				rm.renderControl(childControl);
			}
			rm.write("</div>");
			rm.write("</div>");
		}
	};
	
	/**
	 * Renders the HTML for Thing Facet content
	 *
	 * @param {sap.ui.core.RenderManager}
	 *            oRenderManager the RenderManager that can be used for writing to
	 *            the Render-Output-Buffer
	 * @param {sap.ui.core.Control}
	 *            oControl an object representation of the control that should be
	 *            rendered
	 */
	ThingViewerRenderer.renderFacetContent = function(rm, oControl) {
		var facetContent = oControl.getFacetContent();
		var bTitle = true;
	
		if (facetContent.length == 1 )  {
			bTitle = false;
		}
	
		for ( var i = 0; i < facetContent.length; i++) {
			var group = facetContent[i];
			if (group.getColspan()) {
				rm.write("<div class='sapUiUx3TVFacetThingGroupSpan' role='form'>");
			} else {
				rm.write("<div class='sapUiUx3TVFacetThingGroup' role='form'>");
			}
			if (bTitle) {
				rm.write("<div class='sapUiUx3TVFacetThingGroupContentTitle'");
				rm.writeAttributeEscaped("title", group.getTooltip_AsString() ? group.getTooltip_AsString() : group.getTitle());
				rm.write("><span role='heading'>");
				rm.writeEscaped(group.getTitle());
				rm.write("</span></div>");
			}
			rm.write("<div class='sapUiUx3TVFacetThingGroupContent'>");
			var groupContent = group.getContent();
			for ( var j = 0; j < groupContent.length; j++) {
				rm.renderControl(groupContent[j]);
			}
			rm.write("</div></div>");
		}
	};

	return ThingViewerRenderer;

}, /* bExport= */ true);
