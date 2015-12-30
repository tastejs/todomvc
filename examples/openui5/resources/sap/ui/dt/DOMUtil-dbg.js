/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides object sap.ui.dt.DOMUtil.
sap.ui.define([
	'jquery.sap.global',
	'sap/ui/dt/ElementUtil'
],
function(jQuery, ElementUtil) {
	"use strict";

	/**
	 * Class for DOM Utils.
	 * 
	 * @class
	 * Utility functionality for DOM
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @private
	 * @static
	 * @since 1.30
	 * @alias sap.ui.dt.DOMUtil
	 * @experimental Since 1.30. This class is experimental and provides only limited functionality. Also the API might be changed in future.
	 */

	var DOMUtil = {};

	/**
	 * 
	 */
	DOMUtil.getSize = function(oDomRef) {
		return {
			width : oDomRef.offsetWidth,
			height : oDomRef.offsetHeight
		};
	};

	/**
	 * 
	 */
	DOMUtil.getOffsetFromParent = function(oPosition, mParentOffset, scrollTop, scrollLeft) {
		var mOffset = {
			left : oPosition.left,
			top : oPosition.top
		};
		
		if (mParentOffset) {
			mOffset.left -= (mParentOffset.left - (scrollLeft ? scrollLeft : 0));
			mOffset.top -= (mParentOffset.top - (scrollTop ? scrollTop : 0));
		}
		return mOffset;
	};

	/**
	 * 
	 */
	DOMUtil.getZIndex = function(oDomRef) {
		var zIndex;
		var $ElementDomRef = jQuery(oDomRef);
		if ($ElementDomRef.length) {
			zIndex = $ElementDomRef.zIndex() || $ElementDomRef.css("z-index");
		}
		return zIndex;
	};

	/**
	 * 
	 */
	DOMUtil.getOverflows = function(oDomRef) {
		var oOverflows;
		var $ElementDomRef = jQuery(oDomRef);
		if ($ElementDomRef.length) {
			oOverflows = {};
			oOverflows.overflowX = $ElementDomRef.css("overflow-x");
			oOverflows.overflowY = $ElementDomRef.css("overflow-y");
		}
		return oOverflows;
	};

	/**
	 * 
	 */
	DOMUtil.getGeometry = function(oDomRef) {
		if (oDomRef) {
			return {
				domRef : oDomRef,
				size : this.getSize(oDomRef),
				position :  jQuery(oDomRef).offset()
			};
		}
	};

	/**
	 * 
	 */
	DOMUtil.syncScroll = function(oSourceDom, oTargetDom) {
		var $target = jQuery(oTargetDom);
		var oTargetScrollTop = $target.scrollTop();
		var oTargetScrollLeft = $target.scrollLeft();
		
		var $source = jQuery(oSourceDom);
		var oSourceScrollTop = $source.scrollTop();
		var oSourceScrollLeft = $source.scrollLeft();

		if (oSourceScrollTop !== oTargetScrollTop) {
			$target.scrollTop(oSourceScrollTop);
		}
		if (oSourceScrollLeft !== oTargetScrollLeft) {
			$target.scrollLeft(oSourceScrollLeft);
		}
	};

	/**
	 * 
	 */
	DOMUtil.getDomRefForCSSSelector = function(oDomRef, sCSSSelector) {
		if (!sCSSSelector) {
			return false;
		}

		if (sCSSSelector === ":sap-domref") {
			return oDomRef;
		}
		// ":sap-domref > sapMPage" scenario
		if (sCSSSelector.indexOf(":sap-domref") > -1) {
			return document.querySelector(sCSSSelector.replace(":sap-domref", "#" + this.getEscapedString(oDomRef.id)));
		}
		return oDomRef ? oDomRef.querySelector(sCSSSelector) : undefined;
	};

	/**
	 * 
	 */
	DOMUtil.getEscapedString = function(sString) {
		return sString.replace(/([;&,\.\+\*\~':"\!\^#$%@\[\]\(\)=>\|])/g, '\\$1');
	};

	/**
	 * 
	 */
	DOMUtil.setDraggable = function($element, bValue) {
		$element.attr("draggable", bValue);
	};

	/**
	 * 
	 */
	DOMUtil.getComputedStyles = function(oElem) {
		var mComputedStyle;

		if ( typeof oElem.currentStyle != 'undefined' ) {
			mComputedStyle = oElem.currentStyle;
		} else {
			mComputedStyle = document.defaultView.getComputedStyle(oElem);
		}

		return mComputedStyle;
	};

	/**
	 * 
	 */
	DOMUtil.copyComputedStyle = function(oSrc, oDest) {
		var mStyles = this.getComputedStyles(oSrc);
		for ( var sStyle in mStyles ) {
			try {
				// Do not use `hasOwnProperty`, nothing will get copied
				if ( typeof sStyle == "string" && sStyle != "cssText" && !/\d/.test(sStyle) && sStyle.indexOf("margin") === -1 ) {
					oDest.style[sStyle] = mStyles[sStyle];
					// `fontSize` comes before `font` If `font` is empty, `fontSize` gets
					// overwritten.  So make sure to reset this property. (hackyhackhack)
					// Other properties may need similar treatment
					if ( sStyle == "font" ) {
						oDest.style.fontSize = mStyles.fontSize;
					}
				}
			/*eslint-disable no-empty */
			} catch (exc) {
				// readonly properties must not through an error
			}
			/*eslint-enable no-empty */
		}
	};

	/**
	 * 
	 */
	DOMUtil.copyComputedStylesForDOM = function(oSrc, oDest) {
		this.copyComputedStyle(oSrc, oDest);
		for (var i = 0; i < oSrc.children.length; i++) {
			this.copyComputedStylesForDOM(oSrc.children[i], oDest.children[i]);
		}
	};

	/**
	 * 
	 */
	DOMUtil.cloneDOMAndStyles = function(oNode, oTarget) {
		var oCopy = oNode.cloneNode(true);
		this.copyComputedStylesForDOM(oNode, oCopy);

		var $copy = jQuery(oCopy);

		jQuery(oTarget).append($copy);

		var oPosition = $copy.position();
		if (oPosition.left) {
			$copy.css("cssText", "margin-left : " + -oPosition.left + "px !important");
		}
		if (oPosition.top) {
			$copy.css("cssText", "margin-top : " + -oPosition.top + "px !important");
		}
	};

	return DOMUtil;
}, /* bExport= */ true);