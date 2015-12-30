/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides enumeration sap.ui.model.UpdateMethod
sap.ui.define(function() {
	"use strict";


	/**
	* @class
	* Different methods for update operations
	*
	* @static
	* @public
	* @alias sap.ui.model.odata.UpdateMethod
	*/
	var UpdateMethod = {
			/**
			 * MERGE method will send update requests in a MERGE request
			 * @public
			 */
			Merge: "MERGE",
			
			/**
			 * PUT method will send update requests in a PUT request
			 * @public
			 */
			Put: "PUT"
	};

	return UpdateMethod;

}, /* bExport= */ true);
