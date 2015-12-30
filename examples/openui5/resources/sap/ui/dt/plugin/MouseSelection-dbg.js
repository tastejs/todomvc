/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides class sap.ui.dt.plugin.MouseSelection.
sap.ui.define([
	'sap/ui/dt/Plugin'
],
function(Plugin) {
	"use strict";

	/**
	 * Constructor for a new MouseSelection.
	 *
	 * @param {string} [sId] id for the new object, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new object
	 *
	 * @class
	 * The MouseSelection allows to select the Overlays with a mouse click
	 * @extends sap.ui.dt.Plugin
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @private
	 * @since 1.30
	 * @alias sap.ui.dt.plugin.MouseSelection
	 * @experimental Since 1.30. This class is experimental and provides only limited functionality. Also the API might be changed in future.
	 */
	var MouseSelection = Plugin.extend("sap.ui.dt.plugin.MouseSelection", /** @lends sap.ui.dt.plugin.MouseSelection.prototype */ {		
		metadata : {
			// ---- object ----

			// ---- control specific ----
			library : "sap.ui.dt",
			properties : {
			},
			associations : {
			},
			events : {
			}
		}
	});

	/*
	 * @private
	 */
	MouseSelection.prototype.init = function() {
		Plugin.prototype.init.apply(this, arguments);
		this._mEventDelegate = {
			"onclick" : this._onClick
		};
	};

	/*
	 * @override
	 */
	MouseSelection.prototype.registerOverlay = function(oOverlay) {
		oOverlay.setSelectable(true);
		oOverlay.addEventDelegate(this._mEventDelegate, oOverlay);
	};

	
	//  * @override
	 
	MouseSelection.prototype.deregisterOverlay = function(oOverlay) {
		oOverlay.removeEventDelegate(this._mEventDelegate, oOverlay);
	};

	/*
	 * @private
	 */
	 MouseSelection.prototype._onClick = function(oEvent) {
		this.setSelected(!this.getSelected());

		oEvent.preventDefault();
		oEvent.stopPropagation();
	};

	return MouseSelection;
}, /* bExport= */ true);