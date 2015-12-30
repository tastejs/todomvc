/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides class sap.ui.core.plugin.TemplatingSupport
sap.ui.define(['jquery.sap.global', 'sap/ui/core/Core', 'sap/ui/core/tmpl/Template'],
	function(jQuery, Core, Template) {
	"use strict";


	
	/**
	 * Creates an instance of the class <code>sap.ui.core.plugin.TemplatingSupport</code>
	 * The plugin uses the <code>sap.ui.core.tmpl.Template</code>.
	 *
	 * @author Peter Muessig
	 * @public
	 * @since 1.15.0
	 * @version 1.32.9
	 * @alias sap.ui.core.plugin.TemplatingSupport
	 */
	var TemplatingSupport = function() {
	};
	
	
	/**
	 * Will be invoked by <code>sap.ui.core.Core</code> to notify the plugin to start.
	 *
	 * @param {sap.ui.core.Core} oCore reference to the Core
	 * @param {boolean} [bOnInit] whether the hook is called during core initialization
	 * @public
	 */
	TemplatingSupport.prototype.startPlugin = function(oCore, bOnInit) {
		jQuery.sap.log.info("Starting TemplatingSupport plugin.");
		this.oCore = oCore;
		sap.ui.template();
	};
	
	/**
	 * Will be invoked by <code>sap.ui.core.Core</code> to notify the plugin to start
	 * @param {sap.ui.core.Core} oCore reference to the Core
	 * @public
	 */
	TemplatingSupport.prototype.stopPlugin = function() {
		jQuery.sap.log.info("Stopping TemplatingSupport plugin.");
		this.oCore = null;
	};
	
	
	/**
	 * Create the <code>sap.ui.core.plugin.TemplatingSupport</code> plugin and
	 * register it within the <code>sap.ui.core.Core</code>.
	 */
	(function(){
		var oThis = new TemplatingSupport();
		sap.ui.getCore().registerPlugin(oThis);
	}());

	return TemplatingSupport;

}, /* bExport= */ true);
