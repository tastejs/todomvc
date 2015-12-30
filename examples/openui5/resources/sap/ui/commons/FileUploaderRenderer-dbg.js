/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides default renderer for control sap.ui.commons.FileUploader
sap.ui.define(['jquery.sap.global', 'sap/ui/core/Renderer', 'sap/ui/unified/FileUploaderRenderer'],
	function(jQuery, Renderer, FileUploaderRenderer1) {
	"use strict";


	var FileUploaderRenderer = Renderer.extend(FileUploaderRenderer1);

	return FileUploaderRenderer;

}, /* bExport= */ true);
