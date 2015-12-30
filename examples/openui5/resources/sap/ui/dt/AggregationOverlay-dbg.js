/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides class sap.ui.dt.AggregationOverlay.
sap.ui.define([
	'jquery.sap.global',
	'sap/ui/dt/Overlay',
	'sap/ui/dt/DOMUtil',
	'sap/ui/dt/ElementUtil',
	'sap/ui/dt/OverlayUtil'
],
function(jQuery, Overlay, DOMUtil, ElementUtil, OverlayUtil) {
	"use strict";


	/**
	 * Constructor for an AggregationOverlay.
	 *
	 * @param {string} [sId] id for the new object, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new object
	 *
	 * @class
	 * The AggregationOverlay allows to create an absolute positioned DIV above the aggregation
	 * of an element.
	 * @extends sap.ui.core.Overlay
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @private
	 * @since 1.30
	 * @alias sap.ui.dt.AggregationOverlay
	 * @experimental Since 1.30. This class is experimental and provides only limited functionality. Also the API might be changed in future.
	 */
	var AggregationOverlay = Overlay.extend("sap.ui.dt.AggregationOverlay", /** @lends sap.ui.dt.AggregationOverlay.prototype */ {
		metadata : {
			// ---- object ----

			// ---- control specific ----
			library : "sap.ui.dt",
			properties : {
				/** 
				 * Name of aggregation to create the AggregationOverlay for
				 */				
				aggregationName : {
					type : "string"
				},
				/** 
				 * Whether the AggregationOverlay and it's descendants should be visible on a screen
				 * We are overriding Control's property to prevent RenderManager from rendering the invisible placeholder
				 */	
				visible : {
					type : "boolean",
					defaultValue : true
				},
				/** 
				 * Whether the AggregationOverlay is a drop target
				 */
				droppable : {
					type : "boolean",
					defaultValue : false
				}
			}, 
			aggregations : {
				/**
				 * Overlays for the elements, which are public children of this aggregation
				 */
				children : {
					type : "sap.ui.dt.Overlay",
					multiple : true
				}
			},
			events : {
				/**
				 * Event fired when the property "droppable" was changed
				 */
				droppableChange : {
					parameters : {
						droppable : { type : "boolean" }
					}
				}
			}
		}
	});

	/** 
	 * Returns a DOM representation for an aggregation, associated with this AggregationOverlay, if it can be found or undefined
	 * Representation is searched in DOM based on DesignTimeMetadata defined for the parent Overlay
	 * @return {Element} Associated with this AggregationOverlay DOM Element or null, if it can't be found
	 * @public
	 */
	AggregationOverlay.prototype.getAssociatedDomRef = function() {
		var oOverlay = this.getParent();
		var oElement = this.getElementInstance();
		var sAggregationName = this.getAggregationName();

		var oElementDomRef = ElementUtil.getDomRef(oElement);
		if (oElementDomRef) {
			var oDesignTimeMetadata = oOverlay.getDesignTimeMetadata();
			var vAggregationDomRef = oDesignTimeMetadata.getAggregationDomRef(sAggregationName);
			if (typeof vAggregationDomRef === "function") {
				return vAggregationDomRef.call(oElement, sAggregationName);
			} else if (typeof vAggregationDomRef === "string") {
				return DOMUtil.getDomRefForCSSSelector(oElementDomRef, vAggregationDomRef);
			}
		}
	};	

	/** 
	 * Sets a property "droppable", toggles a CSS class for the DomRef based on a property's value and fires "droppableChange" event
	 * @param {boolean} bDroppable state to set
	 * @returns {sap.ui.dt.AggregationOverlay} returns this	 	 
	 * @public
	 */
	AggregationOverlay.prototype.setDroppable = function(bDroppable) {
		if (this.getDroppable() !== bDroppable) {
			this.setProperty("droppable", bDroppable);
			this.toggleStyleClass("sapUiDtOverlayDroppable", bDroppable);

			this.fireDroppableChange({droppable : bDroppable});
		}

		return this;
	};		
	
	/** 
	 * Returns if the AggregationOverlay is droppable
	 * @public
	 * @return {boolean} if the AggregationOverlay is droppable
	 */
	AggregationOverlay.prototype.isDroppable = function() {
		return this.getDroppable();
	};	

	/** 
	 * Returns if the AggregationOverlay is visible
	 * @return {boolean} if the AggregationOverlay is visible
	 * @public
	 */
	AggregationOverlay.prototype.isVisible = function() {
		return this.getVisible();
	};	

	/** 
	 * Returns an array with Overlays for the public children of the aggregation, associated with this AggregationOverlay
	 * @return {sap.ui.dt.Overlay[]} children Overlays
	 * @public
	 */
	AggregationOverlay.prototype.getChildren = function() {
		return this.getAggregation("children") || [];
	};	

	return AggregationOverlay;
}, /* bExport= */ true);
