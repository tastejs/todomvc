/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides a filter for list bindings
sap.ui.define(['jquery.sap.global', 'sap/ui/base/Exception'],
	function(jQuery, Exception) {
	"use strict";


	/**
	 * ParseException class
	 *
	 * This exception is thrown, when a parse error occurs while converting a
	 * string value to a specific property type in the model.
	 * @alias sap.ui.model.ParseException
	 * @public
	 */
	var ParseException = function(message) {
		this.name = "ParseException";
		this.message = message;
	};
	ParseException.prototype = jQuery.sap.newObject(Exception.prototype);

	return ParseException;

}, /* bExport= */ true);
