/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides enumeration sap.ui.model.CountMode
sap.ui.define(function() {
	"use strict";


	/**
	* @class
	* Different modes for retrieving the count of collections
	*
	* @static
	* @public
	* @alias sap.ui.model.odata.CountMode
	*/
	var CountMode = {
			/**
			 * Count is retrieved by sending a separate $count request, before requesting data
			 * @public
			 */
			Request: "Request",
	
			/**
			 * Count is retrieved by adding $inlinecount=allpages and is included in the data request
			 * @public
			 */
			Inline: "Inline",
	
			/**
			 * Count is retrieved by adding $inlinecount=allpages and is included in every data request
			 * @public
			 */
			InlineRepeat: "InlineRepeat",
	
			/**
			 * Count is retrieved by a separate request upfront and inline with each data request
			 * @public
			 */
			Both: "Both",
	
			/**
			 * Count is not requested from the server
			 * @public
			 */
			None: "None"
	};

	return CountMode;

}, /* bExport= */ true);
