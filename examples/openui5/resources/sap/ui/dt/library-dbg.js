/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

/**
 * Initialization Code and shared classes of library sap.ui.dt.
 */
sap.ui.define([
    'jquery.sap.global', 
	'sap/ui/core/library'
], // library dependency
function(jQuery) {

	"use strict";

	/**
	 * DesignTime library.
	 *
	 * @namespace
	 * @name sap.ui.dt
	 * @author SAP SE
	 * @version 1.32.9
	 * @private
	 */
	
	// delegate further initialization of this library to the Core
	sap.ui.getCore().initLibrary({
		name : "sap.ui.dt",
		version: "1.32.9",
		dependencies : ["sap.ui.core"],
		types: [
			"sap.ui.dt.SelectionMode"
		],
		interfaces: [],
		controls: [],
		elements: []
	});

	/**
	 * Selection mode of the tree
	 *
	 * @enum {string}
	 * @public
	 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
	 */
	sap.ui.dt.SelectionMode = {
	
		/**
		 * Select multiple overlays at a time.
		 * @public
		 */
		Multi : "Multi",
	
		/**
		 * Select one overlay at a time.
		 * @public
		 */
		Single : "Single"
	
	};

	return sap.ui.dt;

});
