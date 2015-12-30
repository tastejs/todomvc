/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides the Design Time Metadata for the sap.ui.layout.VerticalLayout control
sap.ui.define([],
	function() {
	"use strict";

	return {
		defaultSettings : {
			width : "100%"
		},
		aggregations : {
			content : {
				cssSelector : ":sap-domref"
			}
		},
		name: "{name}",
		description: "{description}"
	};

}, /* bExport= */ false);