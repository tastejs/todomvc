/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides class sap.ui.dt.plugin.DragDrop.
sap.ui.define([
	'sap/ui/dt/Plugin',
	'sap/ui/dt/DOMUtil'
],
function(Plugin, DOMUtil) {
	"use strict";

	/**
	 * Constructor for a new DragDrop.
	 *
	 * @param {string} [sId] id for the new object, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new object
	 *
	 * @class
	 * The DragDrop plugin is an abstract plugin to enable drag and drop functionallity of the Overlays
	 * This Plugin should be overriden by the D&D plugin implementations, the abstract functions should be ussed to performe actions
	 * @extends sap.ui.dt.plugin.Plugin
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @private
	 * @since 1.30
	 * @alias sap.ui.dt.plugin.DragDrop
	 * @experimental Since 1.30. This class is experimental and provides only limited functionality. Also the API might be changed in future.
	 */
	var DragDrop = Plugin.extend("sap.ui.dt.plugin.DragDrop", /** @lends sap.ui.dt.plugin.DragDrop.prototype */ {		
		metadata : {
			"abstract" : true,
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
	DragDrop.prototype.init = function() {
		Plugin.prototype.init.apply(this, arguments);

		this._oOverlayDelegate = {
			"onAfterRendering" : this._checkDraggable
		};
	};

	/**
	 * @override
	 * @param {sap.ui.dt.Overlay} an Overlay which should be registered
	 */
	DragDrop.prototype.registerOverlay = function(oOverlay) {
		oOverlay.addEventDelegate(this._oOverlayDelegate, this);

		oOverlay.attachEvent("draggableChange", this._onDraggableChange, this);

		if (oOverlay.isDraggable()) {		
			this._attachDragEvents(oOverlay);
		}

		oOverlay.attachBrowserEvent("dragover", this._onDragOver, this);
		oOverlay.attachBrowserEvent("dragenter", this._onDragEnter, this);
	};


	/**
	 * @override
	 */
	DragDrop.prototype.registerAggregationOverlay = function(oAggregationOverlay) {
		oAggregationOverlay.attachDroppableChange(this._onAggregationDroppableChange, this);
	};

	/**
	 * @override
	 */
	DragDrop.prototype.deregisterOverlay = function(oOverlay) {
		oOverlay.removeEventDelegate(this._oOverlayDelegate, this);

		oOverlay.detachEvent("draggableChange", this._onDraggableChange, this);

		this._detachDragEvents(oOverlay);

		oOverlay.detachBrowserEvent("dragover", this._onDragOver, this);
		oOverlay.detachBrowserEvent("dragenter", this._onDragEnter, this);

	};	

	/**
	 * @override
	 */
	DragDrop.prototype.deregisterAggregationOverlay = function(oAggregationOverlay) {
		oAggregationOverlay.detachDroppableChange(this._onAggregationDroppableChange, this);
	};


	/**
	 * @private
	 * @param {sap.ui.dt.Overlay} an Overlay to attach events to
	 */
	DragDrop.prototype._attachDragEvents = function(oOverlay) {
		oOverlay.attachBrowserEvent("dragstart", this._onDragStart, this);
		oOverlay.attachBrowserEvent("drag", this._onDrag, this);	
		oOverlay.attachBrowserEvent("dragend", this._onDragEnd, this);
	};

	/**
	 * @private
	 * @param {sap.ui.dt.Overlay} an Overlay to detach events from
	 */
	DragDrop.prototype._detachDragEvents = function(oOverlay) {
		oOverlay.detachBrowserEvent("dragstart", this._onDragStart, this);
		oOverlay.detachBrowserEvent("dragend", this._onDragEnd, this);
		oOverlay.detachBrowserEvent("drag", this._onDrag, this);
	};	

	/**
	 * @protected
	 */
	DragDrop.prototype.onDraggableChange = function(oEvent) { };

	/**
	 * @protected
	 */
	DragDrop.prototype.onDragStart = function(oDraggedOverlay, oEvent) { };

	/**
	 * @protected
	 */
	DragDrop.prototype.onDragEnd = function(oDraggedOverlay, oEvent) { };

	/**
	 * @protected
	 */
	DragDrop.prototype.onDrag = function(oDraggedOverlay, oEvent) { };

	/**
	 * @return {boolean} return true to omit event.preventDefault
	 * @protected
	 */
	DragDrop.prototype.onDragEnter = function(oOverlay, oEvent) { };

	/**
	 * @return {boolean} return true to omit event.preventDefault
	 * @protected
	 */
	DragDrop.prototype.onDragOver = function(oOverlay, oEvent) { };

	/**
	 * @protected
	 */
	DragDrop.prototype.onAggregationDragEnter = function(oAggregationOverlay, oEvent) { };

	/**
	 * @protected
	 */
	DragDrop.prototype.onAggregationDragOver = function(oAggregationOverlay, oEvent) { };

	/**
	 * @protected
	 */
	DragDrop.prototype.onAggregationDragLeave = function(oAggregationOverlay, oEvent) { };

	/**
	 * @protected
	 */
	DragDrop.prototype.onAggregationDrop = function(oAggregationOverlay, oEvent) { };

	/**
	 * @private
	 */
	DragDrop.prototype._checkDraggable = function(oEvent) {
		var oOverlay = oEvent.srcControl;
		if (oOverlay.isDraggable()) {
			DOMUtil.setDraggable(oOverlay.$(), true);
		}
	};

	/**
	 * @private
	 */
	DragDrop.prototype._onDraggableChange = function(oEvent) {
		var oOverlay = oEvent.getSource();
		if (oOverlay.isDraggable()) {
			this._attachDragEvents(oOverlay);
		} else {
			this._detachDragEvents(oOverlay);
		}

		this.onDraggableChange(oOverlay, oEvent);
	};
	/**
	 * @private
	 */
	DragDrop.prototype._onDragStart = function(oEvent) {
		var oOverlay = sap.ui.getCore().byId(oEvent.currentTarget.id);
		this._oDraggedOverlay = oOverlay;

		oEvent.stopPropagation();

		// Fix for Firfox - Firefox only fires drag events when data is set
		if (sap.ui.Device.browser.firefox && oEvent && oEvent.originalEvent && oEvent.originalEvent.dataTransfer && oEvent.originalEvent.dataTransfer.setData) {
			oEvent.originalEvent.dataTransfer.setData('text/plain', '');		
		}

		this.showGhost(oOverlay, oEvent);		
		this.onDragStart(oOverlay, oEvent);
	};

	/**
	 * @protected
	 */
	DragDrop.prototype.showGhost = function(oOverlay, oEvent) {
		var that = this;

		// not supported in IE10+
		if (oEvent && oEvent.originalEvent && oEvent.originalEvent.dataTransfer && oEvent.originalEvent.dataTransfer.setDragImage) {
			this._$ghost = this.createGhost(oOverlay, oEvent);

			// ghost should be visible to set it as dragImage
			this._$ghost.appendTo("body");
			// if ghost will be removed without timeout, setDragImage won't work
			setTimeout(function() {
				that._removeGhost();
			}, 0);
			oEvent.originalEvent.dataTransfer.setDragImage(
				this._$ghost.get(0),
				oEvent.originalEvent.pageX - this.getDraggedOverlay().$().offset().left,
				oEvent.originalEvent.pageY - this.getDraggedOverlay().$().offset().top
			);
		}
	};

	/**
	 * @private
	 */
	DragDrop.prototype._removeGhost = function() {
		this.removeGhost();
		delete this._$ghost;
	};

	/**
	 * @protected
	 */
	DragDrop.prototype.removeGhost = function() {
		var $ghost = this.getGhost();
		if ($ghost) {
			$ghost.remove();
		}
	};

	/**
	 * @protected
	 */
	DragDrop.prototype.createGhost = function(oOverlay) {
		var oGhostDom = oOverlay.getAssociatedDomRef();
		var $ghost;
		if (!oGhostDom) {
			oGhostDom = this._getAssociatedDomCopy(oOverlay);
			$ghost = jQuery(oGhostDom);
		} else {
			$ghost = jQuery("<div></div>");
			DOMUtil.cloneDOMAndStyles(oGhostDom, $ghost);
		}

		var $ghostWrapper = jQuery("<div></div>").addClass("sapUiDtDragGhostWrapper");
		return $ghostWrapper.append($ghost.addClass("sapUiDtDragGhost"));
	};

	/**
	 * @private
	 */
	DragDrop.prototype._getAssociatedDomCopy = function(oOverlay) {
		var that = this;

		var $DomCopy = jQuery("<div></div>");

		oOverlay.getAggregationOverlays().forEach(function(oAggregationOverlay) {
			oAggregationOverlay.getChildren().forEach(function(oChildOverlay) {
				var oChildDom = oChildOverlay.getAssociatedDomRef();
				if (oChildDom) {
					DOMUtil.cloneDOMAndStyles(oChildDom, $DomCopy);
				} else {
					DOMUtil.cloneDOMAndStyles(that._getAssociatedDomCopy(oChildOverlay), $DomCopy);
				}
			});
		});

		return $DomCopy.get(0);
	};

	/**
	 * @protected
	 * @return {jQuery} jQuery object drag ghost
	 */
	DragDrop.prototype.getGhost = function() {
		return this._$ghost;
	};

	/**
	 * returns the dragged overlay (only during drag&drop)
	 * @public
	 * @return {sap.ui.dt.Overlay} overlays which is dragged
	 */
	DragDrop.prototype.getDraggedOverlay = function() {
		return this._oDraggedOverlay;
	};


	/**
	 * @private
	 */
	DragDrop.prototype._onDragEnd = function(oEvent) {
		var oOverlay = sap.ui.getCore().byId(oEvent.currentTarget.id);
		this._removeGhost();

		this.onDragEnd(oOverlay, oEvent);

		delete this._oDraggedOverlay;
		oEvent.stopPropagation();
	};

	/**
	 * @private
	 */
	DragDrop.prototype._onDrag = function(oEvent) {
		var oOverlay = sap.ui.getCore().byId(oEvent.currentTarget.id);

		this.onDrag(oOverlay, oEvent);

		oEvent.stopPropagation();
	};

	/**
	 * @private
	 */
	DragDrop.prototype._onDragEnter = function(oEvent) {
		var oOverlay = sap.ui.getCore().byId(oEvent.currentTarget.id);
		var oAggregationOverlay = oOverlay.getParent();
		var bInDroppableAggregation = oAggregationOverlay && oAggregationOverlay.isDroppable && oAggregationOverlay.isDroppable();
		if (bInDroppableAggregation) {
			//if "true" returned, propagation won't be canceled
			if (!this.onDragEnter(oOverlay, oEvent)) {
				oEvent.stopPropagation();
			}
		}

		oEvent.preventDefault();
	};

	/**
	 * @private
	 */
	DragDrop.prototype._onDragOver = function(oEvent) {
		var oOverlay = sap.ui.getCore().byId(oEvent.currentTarget.id);
		var oAggregationOverlay = oOverlay.getParent();
		var bInDroppableAggregation = oAggregationOverlay && oAggregationOverlay.isDroppable && oAggregationOverlay.isDroppable();
		if (bInDroppableAggregation) {
			//if "true" returned, propagation won't be canceled
			if (!this.onDragOver(oOverlay, oEvent)) {
				oEvent.stopPropagation();
			}
		}

		oEvent.preventDefault();
	};

	/**
	 * @private
	 */
	DragDrop.prototype._onAggregationDroppableChange = function(oEvent) {
		var oAggregationOverlay = oEvent.getSource();
		var bDroppable = oEvent.getParameter("droppable");

		if (bDroppable) {
			this._attachAggregationOverlayEvents(oAggregationOverlay);
		} else {
			this._detachAggregationOverlayEvents(oAggregationOverlay);
		}

	};

	/**
	 * @private
	 */
	DragDrop.prototype._attachAggregationOverlayEvents = function(oAggregationOverlay) {

		oAggregationOverlay.attachBrowserEvent("dragenter", this._onAggregationDragEnter, this);
		oAggregationOverlay.attachBrowserEvent("dragover", this._onAggregationDragOver, this);
		oAggregationOverlay.attachBrowserEvent("dragleave", this._onAggregationDragLeave, this);
		oAggregationOverlay.attachBrowserEvent("drop", this._onAggregationDrop, this);
	};		

	/**
	 * @private
	 */
	DragDrop.prototype._detachAggregationOverlayEvents = function(oAggregationOverlay) {
		oAggregationOverlay.detachBrowserEvent("dragenter", this._onAggregationDragEnter, this);
		oAggregationOverlay.detachBrowserEvent("dragover", this._onAggregationDragOver, this);
		oAggregationOverlay.detachBrowserEvent("dragleave", this._onAggregationDragLeave, this);
		oAggregationOverlay.detachBrowserEvent("drop", this._onAggregationDrop, this);
	};		


	/**
	 * @private
	 */
	DragDrop.prototype._onAggregationDragEnter = function(oEvent) {
		var oAggregationOverlay = sap.ui.getCore().byId(oEvent.currentTarget.id);
		this.onAggregationDragEnter(oAggregationOverlay, oEvent);

		oEvent.preventDefault();
		oEvent.stopPropagation();
	};

	/**
	 * @private
	 */
	DragDrop.prototype._onAggregationDragOver = function(oEvent) {
		var oAggregationOverlay = sap.ui.getCore().byId(oEvent.currentTarget.id);
		this.onAggregationDragOver(oAggregationOverlay, oEvent);

		oEvent.preventDefault();
		oEvent.stopPropagation();
	};

	/**
	 * @private
	 */
	DragDrop.prototype._onAggregationDragLeave = function(oEvent) {
		var oAggregationOverlay = sap.ui.getCore().byId(oEvent.currentTarget.id);
		this.onAggregationDragLeave(oAggregationOverlay, oEvent);

		oEvent.preventDefault();
		oEvent.stopPropagation();
	};

	/**
	 * @private
	 */
	DragDrop.prototype._onAggregationDrop = function(oEvent) {
		var oAggregationOverlay = sap.ui.getCore().byId(oEvent.currentTarget.id);
		this.onAggregationDrop(oAggregationOverlay, oEvent);

		oEvent.stopPropagation();
	};

	return DragDrop;
}, /* bExport= */ true);