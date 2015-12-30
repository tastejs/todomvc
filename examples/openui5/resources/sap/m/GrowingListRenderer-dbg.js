/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(['jquery.sap.global', './ListRenderer', 'sap/ui/core/Renderer'],
	function(jQuery, ListRenderer, Renderer) {
	"use strict";


	
	/**
	 * GrowingList renderer.
	 * @namespace
	 */
	var GrowingListRenderer = Renderer.extend(ListRenderer);
	
	GrowingListRenderer.render = function(rm, oControl) {
		/**
		 * For backwards compatibility we can't remove GrowingList control
		 * However, if the compatibility version is 1.16 or higher then
		 * we stop rendering to force using List control with growing feature
		 */
		if (oControl._isIncompatible()) {
			jQuery.sap.log.warning("Does not render sap.m.GrowingList#" + oControl.getId() + " when compatibility version is 1.16 or higher. Instead use sap.m.List/Table control with growing feature!");
		} else {
			ListRenderer.render.call(this, rm, oControl);
		}
	};
	

	return GrowingListRenderer;

}, /* bExport= */ true);
