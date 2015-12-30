/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides the Design Time Metadata for the sap.ui.layout.form.Form control
sap.ui.define([],
	function() {
	"use strict";
	
	return {
		aggregations : {
			formContainers : {
				getAggregationDomRef : function(sAggregationName) {
					if (this.getLayout() instanceof sap.ui.layout.form.GridLayout) {
						return ":sap-domref tbody";
					} else {
						return ":sap-domref > div";
					}
				}
			}
		},
		name: "{name}",
		description: "{description}"
	};
	
}, /* bExport= */ true);