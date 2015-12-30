/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides object sap.ui.dt.OverlayUtil.
sap.ui.define([
	'jquery.sap.global',
	'sap/ui/dt/OverlayRegistry',
	'sap/ui/dt/ElementUtil'
],
function(jQuery, OverlayRegistry, ElementUtil) {
	"use strict";

	/**
	 * Class for Overlay Util.
	 * 
	 * @class
	 * Utility functionality to work with overlays
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @private
	 * @static
	 * @since 1.30
	 * @alias sap.ui.dt.OverlayUtil
	 * @experimental Since 1.30. This class is experimental and provides only limited functionality. Also the API might be changed in future.
	 */

	var OverlayUtil = {};

	/**
	 * 
	 */
	OverlayUtil.getClosestOverlayFor = function(oElement) {
		if (!oElement || !oElement.getParent) {
			return null;
		}
		var oParent = oElement.getParent();
		var oParentOverlay = OverlayRegistry.getOverlay(oParent);
		while (oParent && !oParentOverlay) {
			oParent = oParent.getParent();
			oParentOverlay = OverlayRegistry.getOverlay(oParent);
		}

		return oParentOverlay;
	};

	/**
	 * 
	 */
	OverlayUtil.getGeometry = function(aGeometry) {
		var minLeft, maxRight, minTop, maxBottom;
		aGeometry.forEach(function(oElementGeometry) {
			if (oElementGeometry) {
				if (!minLeft || oElementGeometry.position.left < minLeft) {
					minLeft = oElementGeometry.position.left;
				}
				if (!minTop || oElementGeometry.position.top < minTop) {
					minTop = oElementGeometry.position.top;
				}

				var iRight = oElementGeometry.position.left + oElementGeometry.size.width;
				if (!maxRight || iRight > maxRight) {
					maxRight = iRight;
				}
				var iBottom = oElementGeometry.position.top + oElementGeometry.size.height;
				if (!maxBottom || iBottom > maxBottom) {
					maxBottom = iBottom;
				}
			}
		});

		if (typeof minLeft === "number") {
			return {
				size : {
					width : maxRight - minLeft,
					height : maxBottom - minTop
				},
				position : {
					left : minLeft,
					top : minTop
				}
			};
		}		
	};

	/**
	 * 
	 */
	OverlayUtil.getClosestOverlayForType = function(sType, oOverlay) {
		while (oOverlay && !ElementUtil.isInstanceOf(oOverlay.getElementInstance(), sType)) {
			oOverlay = oOverlay.getParentElementOverlay();
		}

		return oOverlay;
	};

	/**
	 * 
	 */
	OverlayUtil.getClosestScrollable = function(oOverlay) {
		if (!oOverlay) {
			return;
		}
		
		oOverlay = oOverlay.getParent();
		while (oOverlay && oOverlay.isScrollable && !oOverlay.isScrollable()) {
			oOverlay = oOverlay.getParent();
		}

		return oOverlay && oOverlay.isScrollable ? oOverlay : null;
	};

	/**
	 * 
	 */
	OverlayUtil.getFirstChildOverlay = function(oOverlay) {
		if (!oOverlay) {
			return;
		}
		
		var aAggregationOverlays = oOverlay.getAggregationOverlays();
		if (aAggregationOverlays.length > 0) {
			for (var i = 0; i < aAggregationOverlays.length; i++) {
				var oAggregationOverlay = aAggregationOverlays[i];
				var aChildren = oAggregationOverlay.getChildren();
				if (aChildren.length) {
					return aChildren[0];
				}
			}
		}
	};

	/**
	 * 
	 */
	OverlayUtil.getLastChildOverlay = function(oOverlay) {
		if (!oOverlay) {
			return;
		}
		
		var aAggregationOverlays = oOverlay.getAggregationOverlays();
		if (aAggregationOverlays.length > 0) {
			for (var i = aAggregationOverlays.length - 1; i >= 0 ; i--) {
				var oAggregationOverlay = aAggregationOverlays[i];
				var aChildren = oAggregationOverlay.getChildren();
				if (aChildren.length) {
					return aChildren[aChildren.length - 1];
				}
			}
		}
	};

	/**
	 * 
	 */
	OverlayUtil.getNextSiblingOverlay = function(oOverlay) {
		if (!oOverlay) {
			return;
		}

		var oParentAggregationOverlay = oOverlay.getParentAggregationOverlay();
		if (oParentAggregationOverlay) {
			var aAggregationOverlays = oParentAggregationOverlay.getChildren();
			var iIndex = aAggregationOverlays.indexOf(oOverlay);
			// get next sibling in the same aggregation
			if (iIndex !== aAggregationOverlays.length - 1) {
				return aAggregationOverlays[iIndex + 1];
			} else {
				//get next sibling from next aggregation in the same parent
				if (iIndex === aAggregationOverlays.length - 1) {
					var oParent = oOverlay.getParentElementOverlay();
					aAggregationOverlays = oParent.getAggregationOverlays();
					for (iIndex = aAggregationOverlays.indexOf(oParentAggregationOverlay) + 1; iIndex < aAggregationOverlays.length; iIndex++) {
						var aOverlays = aAggregationOverlays[iIndex].getChildren();
						if (aOverlays.length) {
							return aOverlays[0];
						}
					}
				}
			}
		}
	};

	/**
	 * 
	 */
	OverlayUtil.getPreviousSiblingOverlay = function(oOverlay) {
		if (!oOverlay) {
			return;
		}
		
		var oParentAggregationOverlay = oOverlay.getParentAggregationOverlay();
		if (oParentAggregationOverlay) {
			var aAggregationOverlays = oParentAggregationOverlay.getChildren();
			var iIndex = aAggregationOverlays.indexOf(oOverlay);
			//get previous sibling from the same aggregation
			if (iIndex > 0) {
				return aAggregationOverlays[iIndex - 1];
			} else {
				//get previous sibling from previous aggregation in the same parent
				if (iIndex === 0) {
					var oParent = oOverlay.getParentElementOverlay();
					aAggregationOverlays = oParent.getAggregationOverlays();
					for (iIndex = aAggregationOverlays.indexOf(oParentAggregationOverlay) - 1; iIndex >= 0; iIndex--) {
						var aOverlays = aAggregationOverlays[iIndex].getChildren();
						if (aOverlays.length) {
							return aOverlays[aOverlays.length - 1];
						}
					}
				}
			}
		}
	};

	/**
	 * 
	 */
	OverlayUtil.getNextOverlay = function(oOverlay) {
		if (!oOverlay) {
			return;
		}

		var oFirstChildOverlay = this.getFirstChildOverlay(oOverlay);
		if (oFirstChildOverlay) {
			return oFirstChildOverlay;
		}

		var oNextSiblingOverlay = this.getNextSiblingOverlay(oOverlay);
		if (oNextSiblingOverlay) {
			return oNextSiblingOverlay;
		}

		do {
			oOverlay = oOverlay.getParentElementOverlay();
			oNextSiblingOverlay = this.getNextSiblingOverlay(oOverlay);
		} while (oOverlay && !oNextSiblingOverlay);

		return oNextSiblingOverlay;
	};

	/**
	 * 
	 */
	OverlayUtil.getPreviousOverlay = function(oOverlay) {
		if (!oOverlay) {
			return;
		}

		var oParentAggregationOverlay = oOverlay.getParentAggregationOverlay();
		if (!oParentAggregationOverlay) {
			return;
		}

		var oPreviousSiblingOverlay = this.getPreviousSiblingOverlay(oOverlay);
		if (oPreviousSiblingOverlay) {
			var oLastChildOverlay = oPreviousSiblingOverlay;
			do {
				oPreviousSiblingOverlay = oLastChildOverlay;
				oLastChildOverlay = this.getLastChildOverlay(oPreviousSiblingOverlay);
			} while (oLastChildOverlay);

			return oPreviousSiblingOverlay;
		}

		return oOverlay.getParentElementOverlay();
	};

	/**
	 * 
	 */
	OverlayUtil.getRootOverlay = function(oOverlay) {
		var oParentOverlay = oOverlay;
		do {
			oOverlay = oParentOverlay;
			oParentOverlay = oOverlay.getParentElementOverlay();
		} while (oParentOverlay);

		return oOverlay;
	};

	return OverlayUtil;
}, /* bExport= */ true);
