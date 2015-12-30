/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides class sap.ui.dt.DesignTimeMetadata.
sap.ui.define([
	'jquery.sap.global',
	'sap/ui/base/ManagedObject'
],
function(jQuery, ManagedObject) {
	"use strict";


	/**
	 * Constructor for a new DesignTimeMetadata.
	 *
	 * @param {string} [sId] id for the new object, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new object
	 *
	 * @class
	 * The DesignTimeMetadata is a wrapper for the DesignTimeMetadata of the associated element
	 * @extends sap.ui.core.ManagedObject
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @private
	 * @since 1.30
	 * @alias sap.ui.dt.DesignTimeMetadata
	 * @experimental Since 1.30. This class is experimental and provides only limited functionality. Also the API might be changed in future.
	 */
	var DesignTimeMetadata = ManagedObject.extend("sap.ui.dt.DesignTimeMetadata", /** @lends sap.ui.dt.DesignTimeMetadata.prototype */ {
		metadata : {
			// ---- object ----

			// ---- control specific ----
			library : "sap.ui.dt",
			properties : {
				/**
				 * Data to be used as DT metadata
				 */
				data : {
					type : "object"
				}
			}
		}
	});

	/**
	 * Sets the data as DT metadata, uses default settings, if some fields are not defined in oData
	 * @param {object} oData to set
	 * @return {sap.ui.dt.DesignTimeMetadata} returns this
	 * @protected
	 */
	DesignTimeMetadata.prototype.setData = function(oData) {
		this.setProperty("data", this._ensureProperties(oData));
		return this;
	};

	/**
	 * @param {object} oData to set
	 * @return {object} data to use as a DT metadata
	 * @private
	 */
	DesignTimeMetadata.prototype._ensureProperties = function(oData) {
		return jQuery.extend(true, {
			defaultSettings : {},
			aggregations : {
				layout : {
					visible : false
				}
			},
			properties : {},
			associations : {},
			events : {},
			behavior : {
				constructor : null,
				resize : {
					stop : null,
					grid : null,
					start : null,
					minWidth : null,
					minHeight : null,
					maxWidth : null,
					maxHeight : null
				}
			},
			renderer : null,
			css : null,
			name : null,
			description : "",
			keywords : [],
			draggable : true,
			selectable : true,
			removable : true,
			resizable : true,
			visible : true,
			needDelegateFromParent : false
		}, oData);
	};	

	/**
	 * Returns a name defined in the DT metadata
	 * @return {string} returns DT metadata field "name"
	 * @public
	 */
	DesignTimeMetadata.prototype.getName = function() {
		return this.getData().name;
	};

	/**
	 * Returns if the DT metadata for an aggregation name exists
	 * @param {string} sAggregationName an aggregation name
	 * @return {boolean} returns if the field for an aggregation with a given name exists in DT metadata
	 * @public
	 */
	DesignTimeMetadata.prototype.hasAggregation = function(sAggregationName) {
		return !!this.getAggregations()[sAggregationName];
	};

	/**
	 * Returns the DT metadata for an aggregation name
	 * @param {string} sAggregationName an aggregation name
	 * @return {object} returns the DT metadata for an aggregation with a given name
	 * @public
	 */
	DesignTimeMetadata.prototype.getAggregation = function(sAggregationName) {
		return this.getAggregations()[sAggregationName] || {};
	};

	/**
	 * Returns the DT metadata for all aggregations
	 * @return {map} returns the DT metadata for all aggregations
	 * @public
	 */
	DesignTimeMetadata.prototype.getAggregations = function() {
		return this.getData().aggregations;
	};

	/**
	 * Returns property "visible" of the DT metadata
	 * @return {boolean} if is visible
	 * @public
	 */
	DesignTimeMetadata.prototype.isVisible = function() {
		return this.getData().visible !== false;
	};

	/**
	 * Returns property "visible" of the aggregation DT metadata for the given aggregation name
	 * @param {string} sAggregationName an aggregation name
	 * @return {boolean} if an aggregation is visible
	 * @public
	 */
	DesignTimeMetadata.prototype.isAggregationVisible = function(sAggregationName) {
		return this.getAggregation(sAggregationName).visible !== false;
	};

	/**
	 * Returns property "domRef" of the aggregation DT metadata for the given aggregation name
	 * @param {string} sAggregationName an aggregation name
	 * @return {object|string|function} domRef for the aggregation
	 * @public
	 */
	DesignTimeMetadata.prototype.getAggregationDomRef = function(sAggregationName) {
		return this.getAggregation(sAggregationName).domRef;
	};	

	return DesignTimeMetadata;
}, /* bExport= */ true);