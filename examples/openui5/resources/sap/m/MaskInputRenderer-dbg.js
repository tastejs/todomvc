/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(['sap/ui/core/Renderer', './InputBaseRenderer'], function(Renderer, InputBaseRenderer) {
	"use strict";

	/**
	 * MaskInputRenderer renderer.
	 * @namespace
	 */
	var MaskInputRenderer = Renderer.extend(InputBaseRenderer);

	return MaskInputRenderer;

}, /* bExport= */ true);
