/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.unified.FileUploaderParameter.
sap.ui.define(['jquery.sap.global', 'sap/ui/core/Element', './library'],
	function(jQuery, Element, library) {
	"use strict";


	
	/**
	 * Constructor for a new FileUploaderParameter.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * Represents a parameter for the FileUploader which is rendered as a hidden inputfield.
	 * @extends sap.ui.core.Element
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @alias sap.ui.unified.FileUploaderParameter
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var FileUploaderParameter = Element.extend("sap.ui.unified.FileUploaderParameter", /** @lends sap.ui.unified.FileUploaderParameter.prototype */ { metadata : {
	
		library : "sap.ui.unified",
		properties : {
	
			/**
			 * The name of the hidden inputfield.
			 * @since 1.12.2
			 */
			name : {type : "string", group : "Data", defaultValue : null},
	
			/**
			 * The value of the hidden inputfield.
			 * @since 1.12.2
			 */
			value : {type : "string", group : "Data", defaultValue : null}
		}
	}});
	
	

	return FileUploaderParameter;

}, /* bExport= */ true);
