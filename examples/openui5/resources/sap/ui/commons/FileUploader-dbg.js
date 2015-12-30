/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.commons.FileUploader.
sap.ui.define(['jquery.sap.global', './library', 'sap/ui/unified/FileUploader'],
	function(jQuery, library, UnifiedFileUploader) {
	"use strict";

	/**
	 * Constructor for a new FileUploader.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * The framework generates an input field and a button with text "Browse ...". The API supports features such as on change uploads (the upload starts immediately after a file has been selected), file uploads with explicit calls, adjustable control sizes, text display after uploads, or tooltips containing complete file paths.
	 * @extends sap.ui.unified.FileUploader
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @deprecated Since version 1.21.0. 
	 * Please use the control sap.ui.unified.FileUploader of the library sap.ui.unified instead.
	 * @alias sap.ui.commons.FileUploader
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var FileUploader = UnifiedFileUploader.extend("sap.ui.commons.FileUploader", /** @lends sap.ui.commons.FileUploader.prototype */ { metadata : {
	
		deprecated : true,
		library : "sap.ui.commons"
	}});

	try {
		sap.ui.getCore().loadLibrary("sap.ui.unified");
	} catch (e) {
		jQuery.sap.log.error("The control 'sap.ui.commons.FileUploader' needs library 'sap.ui.unified'.");
		throw (e);
	}
	
	return FileUploader;

}, /* bExport= */ true);
