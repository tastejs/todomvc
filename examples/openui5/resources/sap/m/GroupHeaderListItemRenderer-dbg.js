/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(['jquery.sap.global', './ListItemBaseRenderer', 'sap/ui/core/Renderer'],
	function(jQuery, ListItemBaseRenderer, Renderer) {
	"use strict";


	/**
	 * GroupHeaderListItem renderer.
	 * @namespace
	 */
	var GroupHeaderListItemRenderer = Renderer.extend(ListItemBaseRenderer);
	
	GroupHeaderListItemRenderer.openItemTag = function(rm, oLI) {
		rm.write(oLI.getTable() ? "<tr" : "<li");
	};

	GroupHeaderListItemRenderer.closeItemTag = function(rm, oLI) {
		rm.write(oLI.getTable() ? "</tr>" : "</li>");
	};
	
	GroupHeaderListItemRenderer.renderType = function(rm, oLI) {
		var oTable = oLI.getTable();
		
		// for table render navigation column always
		oTable && rm.write('<td role="gridcell" class="sapMListTblNavCol">');
		ListItemBaseRenderer.renderType.apply(this, arguments);
		oTable && rm.write('</td>');
	};
	
	// it is not necessary to handle non flex case
	GroupHeaderListItemRenderer.handleNoFlex = function(rm, oLI) {
	};
	
	// GroupHeaderListItem does not respect counter property of the LIB
	GroupHeaderListItemRenderer.renderCounter = function(rm, oLI) {
	};
	
	// Returns aria accessibility role
	GroupHeaderListItemRenderer.getAriaRole = function(oLI) {
		return oLI.getTable() ? "row" : "option";
	};
	
	// Returns the inner aria describedby ids for the accessibility
	GroupHeaderListItemRenderer.getAriaDescribedBy = function(oLI) {
		// announce group header first
		var sDescribedBy = this.getAriaAnnouncement("group_header"),
			sBaseDescribedBy = ListItemBaseRenderer.getAriaDescribedBy.call(this, oLI) || "";

		return sDescribedBy + " " + sBaseDescribedBy;
	};
	
	/**
	 * Renders the attributes for the given list item, using the provided
	 * {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager}
	 *          rm the RenderManager that can be used for writing to the
	 *          Render-Output-Buffer
	 * @param {sap.ui.core.Control}
	 *          oLI an object representation of the list item that should be
	 *          rendered
	 */
	GroupHeaderListItemRenderer.renderLIAttributes = function(rm, oLI) {
		rm.addClass("sapMGHLI");
		if (oLI.getUpperCase()) {
			rm.addClass("sapMGHLIUpperCase");
		}
	};
	
	
	/**
	 * Renders the List item content
	 *
	 * @param {sap.ui.core.RenderManager}
	 *          rm the RenderManager that can be used for writing to the
	 *          Render-Output-Buffer
	 * @param {sap.ui.core.Control}
	 *          oLI an object representation of the list item that should be
	 *          rendered
	 */
	GroupHeaderListItemRenderer.renderLIContentWrapper = function(rm, oLI) {
		var oTable = oLI.getTable();
		
		if (oTable) {
			rm.write('<td class="sapMGHLICell" role="gridcell"');
			rm.writeAttribute("colspan", oTable.getColSpan());
			rm.write(">");
		}
	
		ListItemBaseRenderer.renderLIContentWrapper.apply(this, arguments);
	
		if (oTable) {
			rm.write("</td>");
		}
	};
	
	GroupHeaderListItemRenderer.renderLIContent = function(rm, oLI) {
		var sTextDir = oLI.getTitleTextDirection();
		rm.write("<label class='sapMGHLITitle'");
		
		if (sTextDir != sap.ui.core.TextDirection.Inherit) {
			rm.writeAttribute("dir", sTextDir.toLowerCase());
		}
		rm.write(">");
		
		rm.writeEscaped(oLI.getTitle());
		
		var iCount = oLI.getCount();
		if (iCount) {
			rm.writeEscaped(" (" + iCount + ")");
		}

		rm.write("</label>");
	};

	GroupHeaderListItemRenderer.addLegacyOutlineClass = function(rm, oLI) {
		if (!oLI.getTable()) {
			ListItemBaseRenderer.addLegacyOutlineClass.apply(this, arguments);
		}
	};

	return GroupHeaderListItemRenderer;

}, /* bExport= */ true);
