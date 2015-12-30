/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(['jquery.sap.global', 'sap/ui/core/Renderer', './ListBaseRenderer'],
	function(jQuery, Renderer, ListBaseRenderer) {
	"use strict";


	/**
	 * List renderer.
	 *
	 * ListRenderer extends the ListBaseRenderer
	 * @namespace
	 * @alias sap.m.ListRenderer
	 */
	var ListRenderer = Renderer.extend(ListBaseRenderer);
	
	ListRenderer.render = function(rm, oControl) {
		// if "columns" aggregation is not in use then we do not need backwards compatibility
		if (!oControl.getColumns().length) {
			ListBaseRenderer.render.call(this, rm, oControl);
			return;
		}
		
		/*
		 * For backwards compatibility we need to render List with columns
		 * However, if the compatibility version is 1.16 or higher then
		 * we stop rendering to force using Table control with columns
		 */
		if (oControl._isColumnsIncompatible()) {
			jQuery.sap.log.warning("Does not render sap.m.List#" + oControl.getId() + " with columns aggregation when compatibility version is 1.16 or higher. Instead use sap.m.Table control!");
			return;
		}
		
		/*
		 * FIXME: Here to support old API if columns are set
		 * We are trying to extend renderer to render list as table
		 * This is so ugly and we need to get rid of it ASAP
		 */
		jQuery.sap.require("sap.m.TableRenderer");
		var oRenderer = jQuery.extend({}, this, sap.m.TableRenderer);
		ListBaseRenderer.render.call(oRenderer, rm, oControl);
	};
	
	

	return ListRenderer;

}, /* bExport= */ true);
