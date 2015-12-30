/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides object sap.ui.dt.ElementUtil.
sap.ui.define([
	'jquery.sap.global'
],
function(jQuery) {
	"use strict";

	/**
	 * Class for ElementUtil.
	 *
	 * @class
	 * Utility functionality to work with élements, e.g. iterate through aggregations, find parents, ...
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @private
	 * @static
	 * @since 1.30
	 * @alias sap.ui.dt.ElementUtil
	 * @experimental Since 1.30. This class is experimental and provides only limited functionality. Also the API might be changed in future.
	 */

	var ElementUtil = {};

	/**
	 *
	 */
	ElementUtil.iterateOverAllPublicAggregations = function(oElement, fnCallback) {
		var mAggregations = oElement.getMetadata().getAllAggregations();
		if (!mAggregations) {
			fnCallback();
		}
		for ( var sName in mAggregations) {
			var oAggregation = mAggregations[sName];
			var oValue = this.getAggregation(oElement, sName);

			fnCallback(oAggregation, oValue);
		}
	};

	/**
	 *
	 */
	ElementUtil.getElementInstance = function(vElement) {
		if (typeof vElement === "string") {
			return sap.ui.getCore().byId(vElement);
		} else {
			return vElement;
		}
	};

	/**
	 *
	 */
	ElementUtil.hasAncestor = function(oElement, oAncestor) {
		var oParent = oElement;
		while (oParent && oParent !== oAncestor) {
			oParent = oParent.getParent();
		}

		return !!oParent;
	};

	/**
	 *
	 */
	ElementUtil.findAllPublicElements = function(oElement) {
		var aFoundElements = [];
		var that = this;
		var oCore = sap.ui.core;

		function internalFind(oElement) {
			if (!(oElement instanceof oCore.Element)) {
				return;
			}

			if (oElement.getMetadata().getClass() === oCore.ComponentContainer) {
				//This happens when the compontentConainer has not been rendered yet
				if (!oElement.getComponentInstance()) {
					return;
				}
				internalFind(oElement.getComponentInstance().getAggregation("rootControl"));
			} else {
				aFoundElements.push(oElement);
				that.iterateOverAllPublicAggregations(oElement, function(oAggregation, vElements) {
					if (vElements && vElements.length) {
						for (var i = 0; i < vElements.length; i++) {
							var oObj = vElements[i];
							internalFind(oObj);
						}
					} else if (vElements instanceof oCore.Element) {
						internalFind(vElements);
					}
				});
			}
		}
		internalFind(oElement);

		return aFoundElements;

	};

	/**
	 *
	 */
	ElementUtil.getDomRef = function(oElement) {
		if (oElement) {
			var oDomRef;
			if (oElement.getDomRef) {
				oDomRef = oElement.getDomRef();
			}
			if (!oDomRef && oElement.getRenderedDomRef) {
				oDomRef = oElement.getRenderedDomRef();
			}
			return oDomRef;
		}
	};

	/**
	 *
	 */
	ElementUtil.findAllPublicChildren = function(oElement) {
		var aFoundElements = this.findAllPublicElements(oElement);
		var iIndex = aFoundElements.indexOf(oElement);
		if (iIndex > -1) {
			aFoundElements.splice(iIndex, 1);
		}
		return aFoundElements;

	};

	/**
	 *
	 */
	ElementUtil.isElementFiltered = function(oControl, aType) {
		var that = this;

		aType = aType || this.getControlFilter();
		var bFiltered = false;

		aType.forEach(function(sType) {
			bFiltered = that.isInstanceOf(oControl, sType);
			if (bFiltered) {
				return false;
			}
		});

		return bFiltered;
	};

	/**
	 *
	 */
	ElementUtil.findClosestControlInDom = function(oNode) {
		if (oNode && oNode.getAttribute("data-sap-ui")) {
			return sap.ui.getCore().byId(oNode.getAttribute("data-sap-ui"));
		} else {
			if (oNode.parentNode) {
				this.findClosestControlInDom(oNode.parentNode);
			} else {
				return null;
			}
		}
	};

	/**
	 *
	 */
	ElementUtil.getAggregationMutators = function(oElement, sAggregationName) {
		var oMetadata = oElement.getMetadata();
		oMetadata.getJSONKeys();
		var oAggregationMetadata = oMetadata.getAggregation(sAggregationName);
		return {
			get : oAggregationMetadata._sGetter,
			add : oAggregationMetadata._sMutator,
			remove : oAggregationMetadata._sRemoveMutator,
			insert : oAggregationMetadata._sInsertMutator
		};
	};

	/**
	 *
	 */
	ElementUtil.getAggregation = function(oElement, sAggregationName) {
		var sGetMutator = this.getAggregationMutators(oElement, sAggregationName).get;
		var oValue = oElement[sGetMutator]();
		//ATTENTION:
		//under some unknown circumstances the return oValue looks like an Array but jQuery.isArray() returned undefined => false
		//that is why we use array ducktyping with a null check!
		//reproducible with Windows and Chrome (currently 35), when creating a project and opening WYSIWYG editor afterwards on any file
		//sap.m.Panel.prototype.getHeaderToolbar() returns a single object but an array
		/*eslint-disable no-nested-ternary */
		oValue = oValue && oValue.splice ? oValue : (oValue ? [oValue] : []);
		/*eslint-enable no-nested-ternary */
		return oValue;
	};

	/**
	 *
	 */
	ElementUtil.addAggregation = function(oParent, sAggregationName, oElement) {
		if (this.hasAncestor(oParent, oElement)) {
			throw new Error("Trying to add an element to itself or its successors");
		}
		var sAggregationAddMutator = this.getAggregationMutators(oParent, sAggregationName).add;
		oParent[sAggregationAddMutator](oElement);
	};

	/**
	 *
	 */
	ElementUtil.removeAggregation = function(oParent, sAggregationName, oElement) {
		var sAggregationRemoveMutator = this.getAggregationMutators(oParent, sAggregationName).remove;
		oParent[sAggregationRemoveMutator](oElement);
	};

	/**
	 *
	 */
	ElementUtil.insertAggregation = function(oParent, sAggregationName, oElement, iIndex) {
		if (this.hasAncestor(oParent, oElement)) {
			throw new Error("Trying to add an element to itself or its successors");
		}
		if (this.getAggregation(oParent, sAggregationName).indexOf(oElement) !== -1) {
			// ManagedObject.insertAggregation won't reposition element, if it's already inside of same aggregation
			// therefore we need to remove the element and then insert it again. To prevent ManagedObjectObserver from firing
			// setParent event with parent null, private flag is set.
			oElement.__bSapUiDtSupressParentChangeEvent = true;
			try {
				// invalidate should be supressed, because if the controls have some checks and sync on invalidate,
				// internal structure can be also removed (SimpleForm invalidate destroyed all content temporary)
				oParent.removeAggregation(sAggregationName, oElement, true);
			} finally {
				delete oElement.__bSapUiDtSupressParentChangeEvent;
			}
		}
		var sAggregationInsertMutator = this.getAggregationMutators(oParent, sAggregationName).insert;
		oParent[sAggregationInsertMutator](oElement, iIndex);
	};

	/**
	 *
	 */
	ElementUtil.isValidForAggregation = function(oParent, sAggregationName, oElement) {
		// Make sure that the parent is not inside of the element, or is not the element itself,
		// e.g. insert a layout inside it's content aggregation.
		// This check needed as UI5 will have a maximum call stack error otherwise.
		if (this.hasAncestor(oParent, oElement)) {
			return false;
		}

		var oAggregationMetadata = oParent.getMetadata().getAggregation(sAggregationName);

		// TODO : test altTypes
		return this.isInstanceOf(oElement, oAggregationMetadata.type);
	};

	/**
	 *
	 */
	ElementUtil.isInstanceOf = function(oElement, sType) {
		var oInstance = jQuery.sap.getObject(sType);
		if (typeof oInstance === "function") {
			return oElement instanceof oInstance;
		} else {
			return false;
		}
	};

	/**
	 *
	 */
	ElementUtil.getDesignTimeMetadata = function(oElement) {
		var oDTMetadata = oElement ? oElement.getMetadata().getDesignTime() : {};
		return oDTMetadata || {};
	};



	return ElementUtil;
}, /* bExport= */ true);
