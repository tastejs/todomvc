/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides class sap.ui.dt.Plugin.
sap.ui.define([
	'sap/ui/base/ManagedObject'
],
function(ManagedObject) {
	"use strict";

	/**
	 * Constructor for a new Plugin.
	 *
	 * @param {string} [sId] id for the new object, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new object
	 *
	 * @class
	 * The Plugin allows to handle the overlays and aggregation overlays from the DesignTime
	 * The Plugin should be overriden by the real plugin implementations, which define some actions through events attached to an overlays
	 * @extends sap.ui.core.ManagedObject
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @private
	 * @since 1.30
	 * @alias sap.ui.dt.Plugin
	 * @experimental Since 1.30. This class is experimental and provides only limited functionality. Also the API might be changed in future.
	 */

	var Plugin = ManagedObject.extend("sap.ui.dt.Plugin", /** @lends sap.ui.dt.Plugin.prototype */ {		
		metadata : {
			"abstract" : true,
			// ---- object ----

			// ---- control specific ----
			library : "sap.ui.dt",
			properties : {
				/**
				 * DesignTime where this plugin will be used
				 */
				designTime : { // its defined as a property because spa.ui.dt.designTime is a managed object and UI5 only allows associations for elements
					type : "sap.ui.dt.DesignTime",
					multiple : false
				}
			},
			associations : {
			},
			events : {
			}
		}
	});

	/**
	 * Called when the Plugin is initialized
	 * @protected
	 */
	Plugin.prototype.init = function() {};	

	/**
	 * Called when the Plugin is destroyed
	 * @protected
	 */
	Plugin.prototype.exit = function() {
		this.setDesignTime(null);
	};	

	/**
	 * Function is called initially for every overlay in the DesignTime and then when any new overlay is created inside of the DesignTime
	 * This function should be overriden by the plugins to handle the overlays (attach events and etc.)
	 * @function
	 * @name sap.ui.dt.Plugin.prototype.registerOverlay
	 * @param {sap.ui.dt.Overlay} an Overlay which should be registered
	 * @protected
	 */
	//Plugin.prototype.registerOverlay = function(oOverlay) {};

	/**
	 * Function is called for every overlay in the DesignTime when the Plugin is deactivated.
	 * This function should be overriden by the plugins to rollback the registration and cleanup attached event etc.
	 * @function
	 * @name sap.ui.dt.Plugin.prototype.deregisterOverlay
	 * @param {sap.ui.dt.Overlay} an Overlay which should be deregistered
	 * @protected
	 */
	//Plugin.prototype.deregisterOverlay = function(oOverlay) {};

	/**
	 * Function is called initially for every aggregation overlay in the DesignTime and then when any new aggregation overlay is created inside of the DesignTime
	 * This function should be overriden by the plugins to handle the aggregation overlays (attach events and etc.)
	 * @function
	 * @name sap.ui.dt.Plugin.prototype.registerAggregationOverlay
	 * @param {sap.ui.dt.AggregationOverlay} oAggregationOverlay which should be registered
	 * @protected
	 */
	//Plugin.prototype.registerAggregationOverlay = function(oAggregationOverlay) {};

	/**
	 * Function is called for every aggregation overlay in the DesignTime when the Plugin is deactivated.
	 * This function should be overriden by the plugins to rollback the registration and cleanup attached event etc.
	 * @function
	 * @name sap.ui.dt.Plugin.prototype.deregisterAggregationOverlay
	 * @param {sap.ui.dt.AggregationOverlay} oAggregationOverlay which should be deregistered
	 * @protected
	 */
	//Plugin.prototype.deregisterAggregationOverlay = function(oAggregationOverlay) {};

	/**
	 * Sets a DesignTime, where the plugin should be used. Automatically called by "addPlugin" into DesignTime
	 * @param {sap.ui.dt.DesignTime} oDesignTime to set
	 * @return {sap.ui.dt.Plugin} returns this
	 * @public
	 */
	Plugin.prototype.setDesignTime = function(oDesignTime) {
		var oOldDesignTime = this.getDesignTime();
		if (oOldDesignTime) {
			this._deregisterOverlays(oOldDesignTime);
			oOldDesignTime.detachEvent("overlayCreated", this._onOverlayCreated, this);
		}
		
		if (oDesignTime) {
			this._registerOverlays(oDesignTime);

			oDesignTime.attachEvent("overlayCreated", this._onOverlayCreated, this);
		}

		this.setProperty("designTime", oDesignTime);

		return this;
	};

	/** 
	 * @param {sap.ui.dt.DesignTime} oDesignTime to register overlays for
	 * @private
	 */
	Plugin.prototype._registerOverlays = function(oDesignTime) {
		if (this.registerOverlay || this.registerAggregationOverlay) {
			var aOverlays = oDesignTime.getOverlays();
			aOverlays.forEach(this._callOverlayRegistrationMethods.bind(this));
		}
	};

	/** 
	 * @param {sap.ui.dt.DesignTime} oDesignTime to register overlays for
	 * @private
	 */
	Plugin.prototype._deregisterOverlays = function(oDesignTime) {
		if (this.deregisterOverlay || this.deregisterAggregationOverlay) {
			var aOverlays = oDesignTime.getOverlays();
			aOverlays.forEach(this._callOverlayDeregestrationMethods.bind(this));
		}
	};

	/** 
	 * @param {sap.ui.dt.Overlay} oOverlay to call registration methods for
	 * @private
	 */
	Plugin.prototype._callOverlayRegistrationMethods = function(oOverlay) {
		if (this.registerOverlay) {
			this.registerOverlay(oOverlay);
		}

		if (this.registerAggregationOverlay) {
			var aAggregationOverlays = oOverlay.getAggregationOverlays();
			aAggregationOverlays.forEach(this.registerAggregationOverlay.bind(this));
		}
	};

	/** 
	 * @param {sap.ui.dt.Overlay} oOverlay to callde registration methods for
	 * @private
	 */
	Plugin.prototype._callOverlayDeregestrationMethods = function(oOverlay) {
		if (this.deregisterOverlay) {
			this.deregisterOverlay(oOverlay);
		}

		if (this.deregisterAggregationOverlay) {
			var aAggregationOverlays = oOverlay.getAggregationOverlays();
			aAggregationOverlays.forEach(this.deregisterAggregationOverlay.bind(this));
		}		
	};

	/** 
	 * @param {sap.ui.baseEvent} oEvent event object
	 * @private
	 */
	Plugin.prototype._onOverlayCreated = function(oEvent) {
		var oOverlay = oEvent.getParameter("overlay");

		this._callOverlayRegistrationMethods(oOverlay);
	};

	return Plugin;
}, /* bExport= */ true);