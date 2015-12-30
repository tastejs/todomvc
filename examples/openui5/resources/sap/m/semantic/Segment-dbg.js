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

// Provides class sap.m.semantic.Segment
sap.ui.define(['jquery.sap.global', 'sap/ui/base/Metadata'], function(jQuery, Metadata) {
	"use strict";

	/**
	 * Constructor for a sap.m.semantic.Segment.
	 *
	 * @class Abstraction for a segment in a SegmentedContainer
	 * @version 1.32.9
	 * @private
	 * @since 1.30.0
	 * @alias sap.m.semantic.Segment
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */

	var Segment = Metadata.createClass("sap.m.semantic.Segment", {

		constructor : function(aContent, oContainer, sContainerAggregationName, fnSortFunction) {
			if (!oContainer) {
				jQuery.sap.log.error("missing argumment: constructor expects a container reference", this);
				return;
			}

			aContent || (aContent = []);

			this._aContent = aContent;
			this._oContainer = oContainer;
			this._sContainerAggregationName = sContainerAggregationName;
			this._fnSortFunction = fnSortFunction;
		}

	});

	Segment.prototype.getStartIndex = function () {

		return 0;
	};

	Segment.prototype.getEndIndex = function () {

		return this.getStartIndex() + this._aContent.length;
	};

	Segment.prototype.getContent = function () {

		return this._aContent;
	};

	Segment.prototype.indexOfContent = function (oControl) {

		return jQuery.inArray( oControl, this._aContent );
	};

	Segment.prototype.addContent = function (oControl, bSuppressInvalidate) {

		if (this._fnSortFunction) {
			var iInsertIndex = this._matchSortToInsertIndex(oControl);
			if (typeof iInsertIndex !== 'undefined') {
				this._insertContent(oControl, iInsertIndex, bSuppressInvalidate);
				return oControl;
			}
		}

		var iContainerInsertIndex = this.getEndIndex();
		var iLocalInsertIndex = this._aContent.length;

		this._oContainer.insertAggregation(this._sContainerAggregationName, oControl, iContainerInsertIndex, bSuppressInvalidate);
		this._aContent.splice(iLocalInsertIndex, 0, oControl);

		return oControl;
	};

	Segment.prototype.insertContent = function (oControl, iIndex, bSuppressInvalidate) {

		if (this._fnSortFunction) {
			var iInsertIndex = this._matchSortToInsertIndex(oControl);
			if (typeof iInsertIndex !== 'undefined') {
				this._insertContent(oControl, iInsertIndex, bSuppressInvalidate);
				return oControl;
			}
		}

		return this._insertContent(oControl, iIndex, bSuppressInvalidate);
	};

	Segment.prototype.removeContent = function (oControl, bSuppressInvalidate) {

		var iLocalIndex = jQuery.inArray(oControl, this._aContent);
		if (iLocalIndex > -1) {
			this._aContent.splice(iLocalIndex, 1);

			return this._oContainer.removeAggregation(this._sContainerAggregationName, oControl, bSuppressInvalidate);
		}
	};

	Segment.prototype.removeAllContent = function (bSuppressInvalidate) {

		var aRemovedContent = [],
			aGlobalContent = this._oContainer.getAggregation(this._sContainerAggregationName),
			iStartIndex = this.getStartIndex(),
			iEndIndex = this.getEndIndex();

		for (var i = iStartIndex; i < iEndIndex; i++) {
			var oItem = this._oContainer.removeAggregation(this._sContainerAggregationName, aGlobalContent[i], bSuppressInvalidate); //TODO: test index consistency upon iteration+removal
			if (oItem) {
				aRemovedContent.push(oItem);
			}
		}

		this._aContent = []; //remove from local index

		return aRemovedContent;
	};

	Segment.prototype.destroy = function (bSuppressInvalidate) {
		var aRemovedContent = this.removeAllContent(bSuppressInvalidate);
		for (var i = 0; i < aRemovedContent.length; i++) {
			aRemovedContent[i].destroy(bSuppressInvalidate);
		}
	};

	Segment.prototype._insertContent = function (oControl, iIndex, bSuppressInvalidate) {

		var iInsertIndexInContainer = Math.min(this.getStartIndex() + iIndex, this.getEndIndex());
		iInsertIndexInContainer = Math.max(iInsertIndexInContainer, 0);

		this._oContainer.insertAggregation(this._sContainerAggregationName, oControl, iInsertIndexInContainer, bSuppressInvalidate);
		this._aContent.splice(iIndex, 0, oControl);

		return oControl;
	};

	Segment.prototype._matchSortToInsertIndex = function(oControl) {

		for (var i = 0; i < this._aContent.length; i++) {
			if (this._fnSortFunction(oControl, this._aContent[i]) <= 0) { //oControl is smaller
				return i;
			}
		}
	};

	return Segment;

}, /* bExport= */ false);
