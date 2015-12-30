/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides class sap.ui.dt.Selection.
sap.ui.define([
	'sap/ui/base/ManagedObject',
	'./library'
],
function(ManagedObject) {
	"use strict";

	/**
	 * Constructor for a new Selection.
	 *
	 * @param {string} [sId] id for the new object, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new object
	 *
	 * @class
	 * The Selection allows to create a set of Overlays above the root elements and
	 * theire public children and manage their events.
	 * @extends sap.ui.dt.ManagedObject
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @private
	 * @since 1.30
	 * @alias sap.ui.dt.Selection
	 * @experimental Since 1.30. This class is experimental and provides only limited functionality. Also the API might be changed in future.
	 */
	var Selection = ManagedObject.extend("sap.ui.dt.Selection", /** @lends sap.ui.dt.Selection.prototype */ {
		metadata : {
			// ---- object ----

			// ---- control specific ----
			library : "sap.ui.dt",
			properties : {
				"mode" : {
					type : "sap.ui.dt.SelectionMode",
					defaultValue : sap.ui.dt.SelectionMode.Single
				}				
			},
			associations : {},
			aggregations : {},
			events : {
				"change" : {
					parameters : {
						selection : { type : "sap.ui.dt.Overlay[]" }
					}
				}
			}
		}
	});

	/**
	 * @override
	 */
	Selection.prototype.init = function() {
		this._aSelection = [];
	};

	/**
	 * @override
	 */
	Selection.prototype.exit = function() {
		delete this._aSelection;
	};

	/**
	 * @public
	 * @return {sap.ui.dt.Overlay[]} selected overlays
	 */
	Selection.prototype.getSelection = function() {
		return this._aSelection;
	};

	/**
	 * @public
	 */
	Selection.prototype.set = function(oOverlay, bSelected) {
		if (bSelected) {
			this.add(oOverlay);
		} else {
			this.remove(oOverlay);
		}
	};	

	/**
	 * @public
	 */
	Selection.prototype.add = function(oOverlay) {
		this._syncSelectionWithMode();

		this._aSelection.push(oOverlay);
		this.fireChange({
			selection : this.getSelection()
		});
	};		

	/**
	 * @public
	 */
	Selection.prototype.remove = function(oOverlay) {
		this._syncSelectionWithMode();

		var iIndex = this._aSelection.indexOf(oOverlay);
		if (iIndex !== -1) {
			this._aSelection.splice(iIndex, 1);
		}
		this.fireChange({
			selection : this.getSelection()
		});
	};	

	/**
	 * @private
	 */
	Selection.prototype._isSingleMode = function() {
		return this.getMode() === sap.ui.dt.SelectionMode.Single;
	};	


	Selection.prototype._syncSelectionWithMode = function() {
		if (this._isSingleMode()) {
			this._aSelection.forEach(function(oOverlay) {
				oOverlay.setSelected(false, true);
			});
			this._aSelection = [];
		}
	};

	return Selection;
}, /* bExport= */ true);