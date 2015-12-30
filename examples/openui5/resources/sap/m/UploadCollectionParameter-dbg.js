/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.m.UploadCollectionParameter.
sap.ui.define(['jquery.sap.global', './library', 'sap/ui/core/Element'],
	function(jQuery, library, Element) {
	"use strict";


	
	/**
	 * Constructor for a new UploadCollectionParameter.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * Represents a parameter for the UploadCollection.
	 * @extends sap.ui.core.Element
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @alias sap.m.UploadCollectionParameter
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var UploadCollectionParameter = Element.extend("sap.m.UploadCollectionParameter", /** @lends sap.m.UploadCollectionParameter.prototype */ { metadata : {
	
		library : "sap.m",
		properties : {

			/**
			 * Specifies the name of the parameter.
			 * @since 1.12.2
			 */
			name : {type : "string", group : "Data", defaultValue : null},

			/**
			 * Specifies the value of the parameter.
			 * @since 1.12.2
			 */
			value : {type : "string", group : "Data", defaultValue : null}
		}
	}});

	return UploadCollectionParameter;

}, /* bExport= */ true);
