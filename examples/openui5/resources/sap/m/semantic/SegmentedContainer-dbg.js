/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

/**
 * SemanticPage base classes
 *
 * @namespace
 * @name sap.m.semantic
 */

// Provides class sap.m.semantic.SegmentedContainer
sap.ui.define(['jquery.sap.global', 'sap/m/semantic/Segment', 'sap/ui/base/Metadata'], function(jQuery, Segment, Metadata) {
	"use strict";


	/**
	 * Constructor for a sap.m.semantic.SegmentedContainer.
	 *
	 * @class text
	 * @version 1.32.9
	 * @private
	 * @since 1.30.0
	 * @alias sap.m.semantic.SegmentedContainer
	 */
	var SegmentedContainer = Metadata.createClass("sap.m.semantic.SegmentedContainer", {

		constructor : function(oContainer, sContainerAggregationName) {
			if (!oContainer) {
				jQuery.sap.log.error("missing argumment: constructor expects a container reference", this);
				return;
			}

			this._oContainer = oContainer;
			
			sContainerAggregationName || (sContainerAggregationName = "content");
			
			this._sContainerAggregationName = sContainerAggregationName;

			this._aSegments = [];
		}
	});

	SegmentedContainer.prototype.addSection = function (options) {
		if (!options || !options.sTag) {
			jQuery.sap.log.error("missing argumment: section options expected", this);
			return;
		}

		if (options.aContent) {
			var aContent = options.aContent;
			var iLength = aContent.length;

			for (var i = 0; i < iLength; i++) {
				this._oContainer.addAggregation(this._sContainerAggregationName, aContent[i]);
			}
		}

		var oSegment = new Segment(aContent, this._oContainer, this._sContainerAggregationName, options.fnSortFunction);
		oSegment.sTag = options.sTag;
		var aSegments = this._aSegments;
		oSegment.getStartIndex = function () {

			var iStartIndex = 0;
			var iSectionIndex = jQuery.inArray(this, aSegments);
			if (iSectionIndex > 0) {
				var iPreviousSectionIndex = iSectionIndex - 1;
				while (iPreviousSectionIndex >= 0) {
					iStartIndex += aSegments[iPreviousSectionIndex].getContent().length;
					iPreviousSectionIndex--;
				}
			}

			return iStartIndex;
		};

		this._aSegments.push(oSegment);
	};

	SegmentedContainer.prototype.getSection = function (sTag) {

		var aSegment;
		this._aSegments.forEach(function(aSection) {
			if (aSection.sTag === sTag) {
				aSegment = aSection;
			}
		});

		return aSegment;
	};

	SegmentedContainer.prototype.destroy = function (bSuppressInvalidate) {
		this._oContainer.destroy(bSuppressInvalidate);
		this.aSegments = null;
	};

	return SegmentedContainer;

}, /* bExport= */ false);
