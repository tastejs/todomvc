/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides class sap.ui.dt.plugin.Rename.
sap.ui.define([
	'sap/ui/dt/Plugin',
	'sap/ui/dt/ElementUtil'
],
function(Plugin, ElementUtil) {
	"use strict";

	/**
	 * Constructor for a new Rename.
	 *
	 * @param {string} [sId] id for the new object, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new object
	 *
	 * @class
	 * The Rename allows to select the Overlays with a mouse click
	 * @extends sap.ui.dt.Plugin
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @private
	 * @since 1.30
	 * @alias sap.ui.dt.plugin.Rename
	 * @experimental Since 1.30. This class is experimental and provides only limited functionality. Also the API might be changed in future.
	 */
	var Rename = Plugin.extend("sap.ui.dt.plugin.Rename", /** @lends sap.ui.dt.plugin.Rename.prototype */ {		
		metadata : {
			// ---- object ----

			// ---- control specific ----
			library : "sap.ui.dt",
			properties : {
				editableTypes : {
					type : "string[]",
					defaultValue : ["sap.ui.core.Element"]
				}
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
	Rename.prototype.init = function() {
		Plugin.prototype.init.apply(this, arguments);
	};

	/**
	 * @public
	 */
	Rename.prototype.isEditableType = function(oElement) {
		var aEditableTypes = this._getEditableTypes();

		return aEditableTypes.some(function(sType) {
			return ElementUtil.isInstanceOf(oElement, sType);
		});
	};
	
	/**
	 * @private
	 */
	Rename.prototype._getEditableTypes = function() {
		return this.getProperty("editableTypes") || [];
	};
	
	/**
	 * @protected
	 */
	Rename.prototype.checkEditable = function(oOverlay) {
		return true;
	};
	
	/*
	 * @override
	 */
	Rename.prototype.registerOverlay = function(oOverlay) {
		var oElement = oOverlay.getElementInstance();
		if (this.isEditableType(oElement) && this.checkEditable(oOverlay)) {
			oOverlay.setEditable(true);
		}
	};

	
	return Rename;
}, /* bExport= */ true);