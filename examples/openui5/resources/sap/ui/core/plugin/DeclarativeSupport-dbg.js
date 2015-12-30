/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides class sap.ui.core.plugin.DeclarativeSupport
sap.ui.define(['jquery.sap.global', 'sap/ui/core/Core', 'sap/ui/core/DeclarativeSupport'],
	function(jQuery, Core, DeclarativeSupport1) {
	"use strict";


	
	/**
	 * Creates an instance of the class <code>sap.ui.core.plugin.DeclarativeSupport</code>
	 * The plugin uses the <code>sap.ui.core.DeclarativeSupport</code>.
	 *
	 * @author Peter Muessig, Tino Butz
	 * @see sap.ui.core.DeclarativeSupport
	 * @public
	 * @since 1.7.0
	 * @version 1.32.9
	 * @alias sap.ui.core.plugin.DeclarativeSupport
	 */
	var DeclarativeSupport = function() {
	};
	
	
	/**
	 * Will be invoked by <code>sap.ui.core.Core</code> to notify the plugin to start.
	 *
	 * @param {sap.ui.core.Core} oCore reference to the Core
	 * @param {boolean} [bOnInit] whether the hook is called during core initialization
	 * @public
	 */
	DeclarativeSupport.prototype.startPlugin = function(oCore, bOnInit) {
		jQuery.sap.log.info("Starting DeclarativeSupport plugin.");
		this.oCore = oCore;
		this.oWindow = window;
		DeclarativeSupport1.compile(document.body);
	};
	
	/**
	 * Will be invoked by <code>sap.ui.core.Core</code> to notify the plugin to start
	 * @param {sap.ui.core.Core} oCore reference to the Core
	 * @public
	 */
	DeclarativeSupport.prototype.stopPlugin = function() {
		jQuery.sap.log.info("Stopping DeclarativeSupport plugin.");
		this.oCore = null;
	};
	
	
	/**
	 * Create the <code>sap.ui.core.plugin.DeclarativeSupport</code> plugin and
	 * register it within the <code>sap.ui.core.Core</code>.
	 */
	(function(){
		var oThis = new DeclarativeSupport();
		sap.ui.getCore().registerPlugin(oThis);
	}());

	return DeclarativeSupport;

}, /* bExport= */ true);
