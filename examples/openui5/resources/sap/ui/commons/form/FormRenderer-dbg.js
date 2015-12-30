/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(['jquery.sap.global', 'sap/ui/core/Renderer', 'sap/ui/layout/form/FormRenderer'],
	function(jQuery, Renderer, FormRenderer1) {
	"use strict";


	var FormRenderer = Renderer.extend(FormRenderer1);

	return FormRenderer;

}, /* bExport= */ true);
