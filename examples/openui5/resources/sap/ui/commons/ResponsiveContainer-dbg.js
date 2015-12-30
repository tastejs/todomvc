/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.commons.ResponsiveContainer.
sap.ui.define(['jquery.sap.global', './library', 'sap/ui/core/Control', 'sap/ui/core/ResizeHandler'],
	function(jQuery, library, Control, ResizeHandler) {
	"use strict";


	
	/**
	 * Constructor for a new ResponsiveContainer.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * Is used to provide a container, which can show different content depending on its current width. It fires an event, whenever a new range is reached. In addition the content of the new range is automatically shown, if it is set.
	 * @extends sap.ui.core.Control
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @alias sap.ui.commons.ResponsiveContainer
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var ResponsiveContainer = Control.extend("sap.ui.commons.ResponsiveContainer", /** @lends sap.ui.commons.ResponsiveContainer.prototype */ { metadata : {
	
		library : "sap.ui.commons",
		properties : {
	
			/**
			 * The width of the responsive container.
			 */
			width : {type : "sap.ui.core.CSSSize", group : "Dimension", defaultValue : '100%'},
	
			/**
			 * The width of the responsive container.
			 */
			height : {type : "sap.ui.core.CSSSize", group : "Dimension", defaultValue : '100%'}
		},
		aggregations : {
	
			/**
			 * The ranges defined for this container
			 */
			ranges : {type : "sap.ui.commons.ResponsiveContainerRange", multiple : true, singularName : "range"}, 
	
			/**
			 * The currently shown content, either the default content or content of a range
			 */
			content : {type : "sap.ui.core.Control", multiple : false, visibility : "hidden"}
		},
		associations : {
	
			/**
			 * The default content to show, in case the range does not provide content
			 */
			defaultContent : {type : "sap.ui.core.Control", multiple : false}
		},
		events : {
	
			/**
			 * The event is fired the width of the container reaches a new range.
			 */
			rangeSwitch : {
				parameters : {
	
					/**
					 * The current range
					 */
					currentRange : {type : "sap.ui.commons.ResponsiveContainerRange"}
				}
			}
		}
	}});
	
	
	/**
	 * Control Initialization
	 * @private
	 */
	ResponsiveContainer.prototype.init = function(){
		this.oCurrentRange = null;
	};
	
	/**
	 * Destructor
	 * @private
	 */
	ResponsiveContainer.prototype.exit = function (){
		// Cleanup resize event registration on exit
		if (this.sResizeListenerId) {
			ResizeHandler.deregister(this.sResizeListenerId);
			this.sResizeListenerId = null;
		}
	};
	
	/**
	 * Before rendering
	 */
	ResponsiveContainer.prototype.onBeforeRendering = function() {
		// Cleanup resize event registration before re-rendering
		if (this.sResizeListenerId) {
			ResizeHandler.deregister(this.sResizeListenerId);
			this.sResizeListenerId = null;
		}
		if (!this.getAggregation("content")) {
			var oDefaultContent = sap.ui.getCore().byId(this.getDefaultContent());
			this.setAggregation("content", oDefaultContent);
		}
	};
	
	/**
	 * After rendering
	 */
	ResponsiveContainer.prototype.onAfterRendering = function() {
		var fnResizeHandler = jQuery.proxy(this.onresize, this);
		this.sResizeListenerId = ResizeHandler.register(this.getDomRef(), fnResizeHandler);
		this.refreshRangeDimensions();
		if (!this.oCurrentRange) {
			setTimeout(fnResizeHandler, 0);
		}
	};
	
	/**
	 * Resize handling
	 */
	ResponsiveContainer.prototype.onresize = function(oEvent) {
		var oRange = this.findMatchingRange(),
			sContentId = oRange && oRange.getContent(),
			oNewContent;
		if (this.oCurrentRange != oRange) {
			this.oCurrentRange = oRange;
			if (!oRange) {
				sContentId = this.getDefaultContent();
			}
			oNewContent = sap.ui.getCore().byId(sContentId);
			this.setAggregation("content", oNewContent);
			this.fireRangeSwitch({
				currentRange: this.oCurrentRange
			});
		}
	};
	
	/**
	 * Refresh ranges, updates the range sizes from the DOM.
	 * Loop through all the rendered divs for the ranges and read their width and height
	 * for later comparison with the current container size
	 */
	ResponsiveContainer.prototype.refreshRangeDimensions = function() {
		var aRanges = this.getRanges(),
			aRangeDimensions = [],
			$Range;
		jQuery.each(aRanges, function(i, oRange) {
			$Range = oRange.$();
			aRangeDimensions.push({
				range: oRange,
				width: $Range.width(),
				height: $Range.height()
			});
		});
		this.aRangeDimensions = aRangeDimensions;
	};
	
	/**
	 * Find best matching range, finds the range which best fills the available space.
	 * Reads the current width and height of the container and compares to the stored range
	 * dimensions to find the best match.
	 */
	ResponsiveContainer.prototype.findMatchingRange = function() {
		var $Container = this.$(),
			iWidth = $Container.width(),
			iHeight = $Container.height(),
			iRangeWidth, iRangeHeight,
			aRangeDimensions = this.aRangeDimensions,
			oMatch = null;
		jQuery.each(aRangeDimensions, function(i, oRangeDim) {
			iRangeWidth = oRangeDim.width || iWidth;
			iRangeHeight = oRangeDim.height || iHeight;
			if (iRangeWidth <= iWidth && iRangeHeight <= iHeight) {
				oRangeDim.area = iRangeWidth * iRangeHeight;
				if (!oMatch || oMatch.area < oRangeDim.area) {
					oMatch = oRangeDim;
				}
			}
		});
		return oMatch && oMatch.range;
	};
	
	

	return ResponsiveContainer;

}, /* bExport= */ true);
