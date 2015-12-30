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
	 * ValidateException class
	 *
	 * This exception is thrown, when a validation error occurs while checking the
	 * defined constraints for a type.
	 * @alias sap.ui.model.ValidateException
	 * @public
	 */
	var ValidateException = function(message, violatedConstraints) {
		this.name = "ValidateException";
		this.message = message;
		this.violatedConstraints = violatedConstraints;
	};
	ValidateException.prototype = jQuery.sap.newObject(Exception.prototype);
	

	return ValidateException;

}, /* bExport= */ true);
