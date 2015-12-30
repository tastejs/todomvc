/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides class sap.ui.dt.plugin.ControlDragDrop.
sap.ui.define([
	'sap/ui/dt/plugin/DragDrop',
	'sap/ui/dt/ElementUtil',
	'sap/ui/dt/DOMUtil'
],
function(DragDrop, ElementUtil, DOMUtil) {
	"use strict";

	/**
	 * Constructor for a new ControlDragDrop.
	 *
	 * @param {string} [sId] id for the new object, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new object
	 *
	 * @class
	 * The ControlDragDrop enables D&D functionallity for the overlays based on aggregation types
	 * @extends sap.ui.dt.plugin.DragDrop"
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @private
	 * @since 1.30
	 * @alias sap.ui.dt.plugin.ControlDragDrop
	 * @experimental Since 1.30. This class is experimental and provides only limited functionality. Also the API might be changed in future.
	 */
	var ControlDragDrop = DragDrop.extend("sap.ui.dt.plugin.ControlDragDrop", /** @lends sap.ui.dt.plugin.ControlDragDrop.prototype */ {		
		metadata : {
			// ---- object ----

			// ---- control specific ----
			library : "sap.ui.dt",
			properties : {
				draggableTypes : {
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

	/**
	 * @override
	 */
	ControlDragDrop.prototype.registerOverlay = function(oOverlay) {
		DragDrop.prototype.registerOverlay.apply(this, arguments);
		var oElement = oOverlay.getElementInstance();
		if (this.isDraggableType(oElement) && this.checkDraggable(oOverlay)) {
			oOverlay.setDraggable(true);
		}

		if (this.oDraggedElement) {
			this._activateValidDroppablesFor(oOverlay);
		}
	};
	
	/**
	 * @private
	 */
	ControlDragDrop.prototype._getDraggableTypes = function() {
		return this.getProperty("draggableTypes") || [];
	};

	/**
	 * @public
	 */
	ControlDragDrop.prototype.isDraggableType = function(oElement) {
		var aDraggableTypes = this._getDraggableTypes();

		return aDraggableTypes.some(function(sType) {
			return  ElementUtil.isInstanceOf(oElement, sType);
		});
	};

	/**
	 * @protected
	 */
	ControlDragDrop.prototype.checkDraggable = function(oOverlay) {
		return true;
	};

	/**
	 * @override
	 */
	ControlDragDrop.prototype.deregisterOverlay = function(oOverlay) {
		DragDrop.prototype.deregisterOverlay.apply(this, arguments);
		oOverlay.setDraggable(false);

		if (this.oDraggedElement) {
			this._deactivateDroppablesFor(oOverlay);
		}
	};

	/**
	 * @override
	 */
	ControlDragDrop.prototype.onDragStart = function(oOverlay, oEvent) {
		this._activateAllValidDroppables();
	};

	/**
	 * @override
	 */
	ControlDragDrop.prototype.onDragEnd = function(oOverlay) {
		delete this._oPreviousTarget;

		this._deactivateAllDroppables();
	};

	/**
	 * @override
	 */
	ControlDragDrop.prototype.onDragEnter = function(oTargetOverlay, oEvent) {
		if (oTargetOverlay.getElementInstance() !== this.getDraggedOverlay().getElementInstance() && oTargetOverlay !== this._oPreviousTarget) {
			this._repositionOn(oTargetOverlay);
		}
		this._oPreviousTarget = oTargetOverlay;
	};

	/**
	 * @override
	 */
	ControlDragDrop.prototype.onAggregationDragEnter = function(oAggregationOverlay) {
		delete this._oPreviousTarget;

		var oTargetParentElement = oAggregationOverlay.getElementInstance();

		var oDraggedElement = this.getDraggedOverlay().getElementInstance();
		var oSourceParentOverlay = this.getDraggedOverlay().getParentElementOverlay();
		var oSourceParentElement;
		if (oSourceParentOverlay) {
			oSourceParentElement = oSourceParentOverlay.getElementInstance();
		}

		if (oTargetParentElement !== oSourceParentElement) {
			var sAggregationName = oAggregationOverlay.getAggregationName();
			ElementUtil.addAggregation(oTargetParentElement, sAggregationName, oDraggedElement);
		}
	};

	/*
	 * @private
	 */
	ControlDragDrop.prototype._activateAllValidDroppables = function() {
		this._iterateAllAggregations(this._activateValidDroppable.bind(this));
	};

	/**
	 * @private
	 */
	ControlDragDrop.prototype._activateValidDroppable = function(oAggregationOverlay) {
		if (this.checkDroppable(oAggregationOverlay)) {
			oAggregationOverlay.setDroppable(true);
		}
	};

	/**
	 * @protected
	 */
	ControlDragDrop.prototype.checkDroppable = function(oAggregationOverlay) {
		var oParentElement = oAggregationOverlay.getElementInstance();
		var oDraggedElement = this.getDraggedOverlay().getElementInstance();
		var sAggregationName = oAggregationOverlay.getAggregationName();

		if (ElementUtil.isValidForAggregation(oParentElement, sAggregationName, oDraggedElement)) {
			return true;
		}
	};

	/**
	 * @private
	 */
	ControlDragDrop.prototype._deactivateDroppable = function(oAggregationOverlay) {
		oAggregationOverlay.setDroppable(false);
	};

	/**
	 * @private
	 */
	ControlDragDrop.prototype._activateValidDroppablesFor = function(oOverlay) {
		this._iterateOverlayAggregations(oOverlay, this._activateValidDroppable.bind(this));
	};

	/**
	 * @private
	 */
	ControlDragDrop.prototype._deactivateDroppablesFor = function(oOverlay) {
		this._iterateOverlayAggregations(oOverlay, this._deactivateDroppable.bind(this));
	};

	/**
	 * @private
	 */
	ControlDragDrop.prototype._deactivateAllDroppables = function() {
		this._iterateAllAggregations(function(oAggregationOverlay) {
				oAggregationOverlay.setDroppable(false);
		});
	};
	
	/**
	 * @private
	 */
	ControlDragDrop.prototype._iterateAllAggregations = function(fnStep) {	
		var that = this;

		var oDesignTime = ElementUtil.getElementInstance(this.getDesignTime());
		var aOverlays = oDesignTime.getOverlays();
		aOverlays.forEach(function(oOverlay) {
			that._iterateOverlayAggregations(oOverlay, fnStep);
		});
	};
	
	/**
	 * @private
	 */
	ControlDragDrop.prototype._iterateOverlayAggregations = function(oOverlay, fnStep) {	
		var aAggregationOverlays = oOverlay.getAggregationOverlays();
		aAggregationOverlays.forEach(function(oAggregationOverlay) {
			fnStep(oAggregationOverlay);
		});
	};

	/**
	 * @private
	 */
	ControlDragDrop.prototype._repositionOn = function(oTargetOverlay) {
		var oDraggedElement = this.getDraggedOverlay().getElementInstance();

		var oTargetElement = oTargetOverlay.getElementInstance();
		var oPublicParent = oTargetOverlay.getParentElementOverlay().getElementInstance();
		var sPublicParentAggregationName = oTargetOverlay.getParentAggregationOverlay().getAggregationName();

		var aChildren = ElementUtil.getAggregation(oPublicParent, sPublicParentAggregationName);
		var iIndex = aChildren.indexOf(oTargetElement);

		if (iIndex !== -1) {
			ElementUtil.insertAggregation(oPublicParent, sPublicParentAggregationName, oDraggedElement, iIndex);
		}
	};

	return ControlDragDrop;
}, /* bExport= */ true);