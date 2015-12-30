/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides the Design Time Metadata for the sap.m.Button control
sap.ui.define([],
	function() {
	"use strict";
	
	return {
		defaultSettings : {
			"text" : "Button",
			"width" : "100px"
		},
		properties : {
			icon : {
				bindable : false
			},
			iconFirst : {
				bindable : false
			}
		},
		categories : [ "Action" ],
		css: "Button.designtime.css",
		icon: "Button.png",
		name: "{name}",
		description: "{description}"
	};
	
}, /* bExport= */ false);
