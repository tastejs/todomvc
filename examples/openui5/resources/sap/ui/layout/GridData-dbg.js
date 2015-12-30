/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.layout.GridData.
sap.ui.define(['jquery.sap.global', 'sap/ui/core/LayoutData', './library'],
	function(jQuery, LayoutData, library) {
	"use strict";


	
	/**
	 * Constructor for a new GridData.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * Grid layout data
	 * @extends sap.ui.core.LayoutData
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @since 1.15.0
	 * @alias sap.ui.layout.GridData
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var GridData = LayoutData.extend("sap.ui.layout.GridData", /** @lends sap.ui.layout.GridData.prototype */ { metadata : {
	
		library : "sap.ui.layout",
		properties : {
	
			/**
			 * A string type that represents Grid's span values for large, medium and small screens. Allowed values are separated by space Letters L, M or S followed by number of columns from 1 to 12 that the container has to take, for example: "L2 M4 S6", "M12", "s10" or "l4 m4". Note that the parameters has to be provided in the order large medium small.
			 */
			span : {type : "sap.ui.layout.GridSpan", group : "Behavior", defaultValue : null},
			
			/**
			 * Optional. Defines a span value for extra large screens. This value overwrites the value for extra large screens defined in the parameter "span".
			 */
			spanXL : {type : "int", group : "Behavior", defaultValue : null},
			
			/**
			 * Optional. Defines a span value for large screens. This value overwrites the value for large screens defined in the parameter "span".
			 */
			spanL : {type : "int", group : "Behavior", defaultValue : null},
	
			/**
			 * Optional. Defines a span value for medium size screens. This value overwrites the value for medium screens defined in the parameter "span".
			 */
			spanM : {type : "int", group : "Behavior", defaultValue : null},
	
			/**
			 * Optional. Defines a span value for small screens. This value overwrites the value for small screens defined in the parameter "span".
			 */
			spanS : {type : "int", group : "Behavior", defaultValue : null},
	
			/**
			 * A string type that represents Grid's span values for large, medium and small screens. Allowed values are separated by space Letters L, M or S followed by number of columns from 1 to 12 that the container has to take, for example: "L2 M4 S6", "M12", "s10" or "l4 m4". Note that the parameters has to be provided in the order large medium small.
			 */
			indent : {type : "sap.ui.layout.GridIndent", group : "Behavior", defaultValue : null},
	
			/**
			 * Optional. Defines a span value for extra large screens. This value overwrites the value for extra large screens defined in the parameter "indent".
			 */
			indentXL : {type : "int", group : "Behavior", defaultValue : null},
			
			/**
			 * Optional. Defines a span value for large screens. This value overwrites the value for large screens defined in the parameter "indent".
			 */
			indentL : {type : "int", group : "Behavior", defaultValue : null},
	
			/**
			 * Optional. Defines a span value for medium size screens. This value overwrites the value for medium screens defined in the parameter "indent".
			 */
			indentM : {type : "int", group : "Behavior", defaultValue : null},
	
			/**
			 * Optional. Defines a span value for small screens. This value overwrites the value for small screens defined in the parameter "indent".
			 */
			indentS : {type : "int", group : "Behavior", defaultValue : null},
	
			/**
			 * Defines if this Control is visible on XL - extra Large screens.
			 */
			visibleXL : {type : "boolean", group : "Behavior", defaultValue : true},
			
			/**
			 * Defines if this Control is visible on Large screens.
			 */
			visibleL : {type : "boolean", group : "Behavior", defaultValue : true},
	
			/**
			 * Defines if this Control is visible on Medium size screens.
			 */
			visibleM : {type : "boolean", group : "Behavior", defaultValue : true},
	
			/**
			 * Defines if this Control is visible on small screens.
			 */
			visibleS : {type : "boolean", group : "Behavior", defaultValue : true},
	
			/**
			 * Optional. Moves a cell backwards so many columns as specified.
			 */
			moveBackwards : {type : "sap.ui.layout.GridIndent", group : "Misc", defaultValue : null},
	
			/**
			 * Optional. Moves a cell forwards so many columns as specified.
			 */
			moveForward : {type : "sap.ui.layout.GridIndent", group : "Misc", defaultValue : null},
	
			/**
			 * Optional. If this property is set to true, the control on all-size screens causes a line break within the Grid and becomes the first within the next line.
			 */
			linebreak : {type : "boolean", group : "Misc", defaultValue : false},
	
			/**
			 * Optional. If this property is set to true, the control on extra large screens causes a line break within the Grid and becomes the first within the next line.
			 */
			linebreakXL : {type : "boolean", group : "Misc", defaultValue : false},
			
			/**
			 * Optional. If this property is set to true, the control on large screens causes a line break within the Grid and becomes the first within the next line.
			 */
			linebreakL : {type : "boolean", group : "Misc", defaultValue : false},
	
			/**
			 * Optional. If this property is set to true, the control on medium sized screens causes a line break within the Grid and becomes the first within the next line.
			 */
			linebreakM : {type : "boolean", group : "Misc", defaultValue : false},
	
			/**
			 * Optional. If this property is set to true, the control on small screens causes a line break within the Grid and becomes the first within the next line.
			 */
			linebreakS : {type : "boolean", group : "Misc", defaultValue : false},
	
			/**
			 * Deprecated. Defines a span value for large screens. This value overwrites the value for large screens defined in the parameter "span".
			 * @deprecated Since version 1.17.1. 
			 * Use spanL instead.
			 */
			spanLarge : {type : "int", group : "Behavior", defaultValue : null, deprecated: true},
	
			/**
			 * Deprecated. Defines a span value for medium size screens. This value overwrites the value for medium screens defined in the parameter "span".
			 * @deprecated Since version 1.17.1. 
			 * Use spanM instead.
			 */
			spanMedium : {type : "int", group : "Behavior", defaultValue : null, deprecated: true},
	
			/**
			 * Deprecated. Defines a span value for small screens. This value overwrites the value for small screens defined in the parameter "span".
			 * @deprecated Since version 1.17.1. 
			 * Use spanS instead.
			 */
			spanSmall : {type : "int", group : "Behavior", defaultValue : null, deprecated: true},
	
			/**
			 * Deprecated. Defines a span value for large screens. This value overwrites the value for large screens defined in the parameter "indent".
			 * @deprecated Since version 1.17.1. 
			 * Use indentL instead.
			 */
			indentLarge : {type : "int", group : "Behavior", defaultValue : null, deprecated: true},
	
			/**
			 * Deprecated. Defines a span value for medium size screens. This value overwrites the value for medium screens defined in the parameter "indent".
			 * @deprecated Since version 1.17.1. 
			 * Use indentM instead.
			 */
			indentMedium : {type : "int", group : "Behavior", defaultValue : null, deprecated: true},
	
			/**
			 * Deprecated. Defines a span value for small screens. This value overwrites the value for small screens defined in the parameter "indent".
			 * @deprecated Since version 1.17.1. 
			 * Use indentS instead.
			 */
			indentSmall : {type : "int", group : "Behavior", defaultValue : null, deprecated: true},
	
			/**
			 * Deprecated. Defines if this Control is visible on Large screens.
			 * @deprecated Since version 1.17.1. 
			 * Use visibleL instead.
			 */
			visibleOnLarge : {type : "boolean", group : "Behavior", defaultValue : true, deprecated: true},
	
			/**
			 * Deprecated. Defines if this Control is visible on Medium size screens.
			 * @deprecated Since version 1.17.1. 
			 * Use visibleM instead.
			 */
			visibleOnMedium : {type : "boolean", group : "Behavior", defaultValue : true, deprecated: true},
	
			/**
			 * Deprecated. Defines if this Control is visible on small screens.
			 * @deprecated Since version 1.17.1. 
			 * Use visibleS instead.
			 */
			visibleOnSmall : {type : "boolean", group : "Behavior", defaultValue : true, deprecated: true}
		}
	}});
	
	/**
	 * This file defines behavior for the control
	 */
	(function() {
		
		GridData.prototype._setStylesInternal = function(sStyles) {
			if (sStyles && sStyles.length > 0) {
				this._sStylesInternal = sStyles;
			} else {
				this._sStylesInternal = undefined;
			}
		};
	
		/*
		 * Get span information for the large screens
		 * @return {int} the value of the span 
		 * @private
		 */
		GridData.prototype._getEffectiveSpanXLarge = function() {
	
			var iSpan = this.getSpanXL();
			if (iSpan && (iSpan > 0) && (iSpan < 13)) {
				return iSpan;
			}
			
			var SPANPATTERN = /XL([1-9]|1[0-2])(?:\s|$)/i;
	
			var aSpan = SPANPATTERN.exec(this.getSpan());
	
			if (aSpan) {
				var span = aSpan[0];
				if (span) {
					span = span.toUpperCase();
					if (span.substr(0,2) === "XL") {
						return parseInt(span.substr(1), 10);
					}
				}
			}
			return undefined;
		};
		
		
		/*
		 * Get span information for the large screens
		 * @return {int} the value of the span 
		 * @private
		 */
		GridData.prototype._getEffectiveSpanLarge = function() {
	
			var iSpan = this.getSpanL();
			if (iSpan && (iSpan > 0) && (iSpan < 13)) {
				return iSpan;
			}
			
			var SPANPATTERN = /L([1-9]|1[0-2])(?:\s|$)/i;
	
			var aSpan = SPANPATTERN.exec(this.getSpan());
	
			if (aSpan) {
				var span = aSpan[0];
				if (span) {
					span = span.toUpperCase();
					if (span.substr(0,1) === "L") {
						return parseInt(span.substr(1), 10);
					}
				}
			}
			return undefined;
		};
		
		/*
		 * Get span information for the medium screens 
		 * @return {int} the value of the span 
		 * @private
		 */
		GridData.prototype._getEffectiveSpanMedium = function() {
			var iSpan = this.getSpanM();
			if (iSpan && (iSpan > 0) && (iSpan < 13)) {
				return iSpan;
			}
					
			var SPANPATTERN = /M([1-9]|1[0-2])(?:\s|$)/i;
	
			var aSpan = SPANPATTERN.exec(this.getSpan());
	
			if (aSpan) {
				var span = aSpan[0];
				if (span) {
					span = span.toUpperCase();
					if (span.substr(0,1) === "M") {
						return parseInt(span.substr(1), 10);
					}
				}
			}
			return undefined;
		};
		
		/*
		 * Get span information for the small screens
		 * @return {int} the value of the span 
		 * @private
		 */
		GridData.prototype._getEffectiveSpanSmall = function() {
			var iSpan = this.getSpanS();
			if (iSpan && (iSpan > 0) && (iSpan < 13)) {
				return iSpan;
			}
			
			
			var SPANPATTERN = /S([1-9]|1[0-2])(?:\s|$)/i;
	
			var aSpan = SPANPATTERN.exec(this.getSpan());
	
			if (aSpan) {
				var span = aSpan[0];
				if (span) {
					span = span.toUpperCase();
					if (span.substr(0,1) === "S") {
						return parseInt(span.substr(1), 10);
					}
				}
			}
			return undefined;
		};
		
		// Identifier for explicit changed line break property for XL size
		var _bLinebreakXLChanged = false;
		
		// Finds out if the line break for XL was explicitly set
		GridData.prototype.setLinebreakXL = function(bLinebreak) {
			//set property XL
			this.setProperty("linebreakXL", bLinebreak);
			_bLinebreakXLChanged = true;
		};
		
		// Internal function. Informs the Grid Renderer if the line break property for XL size was changed explicitly
		GridData.prototype._getLinebreakXLChanged = function(bLinebreak) {
			return _bLinebreakXLChanged;
		};
			
		// Deprecated properties handling
		//Setter
		GridData.prototype.setSpanLarge = function(iSpan) {
			this.setSpanL(iSpan);
			jQuery.sap.log.warning("Deprecated property spanLarge is used, please use spanL instead.");
		};
		
		GridData.prototype.setSpanMedium = function(iSpan) {
			this.setSpanM(iSpan);
			jQuery.sap.log.warning("Deprecated property spanMedium is used, please use spanM instead.");
		};
		
		GridData.prototype.setSpanSmall = function(iSpan) {
			this.setSpanS(iSpan);
			jQuery.sap.log.warning("Deprecated property spanSmall is used, please use spanS instead.");
		};
		
		GridData.prototype.setIndentLarge = function(iIndent) {
			this.setIndentL(iIndent);
			jQuery.sap.log.warning("Deprecated property indentLarge is used, please use indentL instead.");
		};
		
		GridData.prototype.setIndentMedium = function(iIndent) {
			this.setIndentM(iIndent);
			jQuery.sap.log.warning("Deprecated property indentMedium is used, please use indentM instead.");
		};
		
		GridData.prototype.setIndentSmall = function(iIndent) {
			this.setIndentS(iIndent);
			jQuery.sap.log.warning("Deprecated property indentSmall is used, please use indentS instead.");
		};
		
		GridData.prototype.setVisibleOnLarge = function(bVisible) {
			this.setVisibleL(bVisible);
			jQuery.sap.log.warning("Deprecated property visibleOnLarge is used, please use visibleL instead.");
		};
		
		GridData.prototype.setVisibleOnMedium = function(bVisible) {
			this.setVisibleM(bVisible);
			jQuery.sap.log.warning("Deprecated property visibleOnMedium is used, please use visibleM instead.");
		};
		
		GridData.prototype.setVisibleOnSmall = function(bVisible) {
			this.setVisibleS(bVisible);
			jQuery.sap.log.warning("Deprecated property visibleOnSmall is used, please use visibleS instead.");
		};
		
		
		// Getter 
		GridData.prototype.getSpanLarge = function() {
			jQuery.sap.log.warning("Deprecated property spanLarge is used, please use spanL instead.");
			return this.getSpanL();
		};
		
		GridData.prototype.getSpanMedium = function() {
			jQuery.sap.log.warning("Deprecated property spanMedium is used, please use spanM instead.");
			return this.getSpanM();
		};
		
		GridData.prototype.getSpanSmall = function() {
			jQuery.sap.log.warning("Deprecated property spanSmall is used, please use spanS instead.");
			return this.getSpanS();
		};
		
		GridData.prototype.getIndentLarge = function() {
			jQuery.sap.log.warning("Deprecated property indentLarge is used, please use indentL instead.");
			return this.getIndentL();
		};
		
		GridData.prototype.getIndentMedium = function() {
			jQuery.sap.log.warning("Deprecated property indentMedium is used, please use indentM instead.");
			return this.getIndentM();
		};
		
		GridData.prototype.getIndentSmall = function() {
			jQuery.sap.log.warning("Deprecated property indentSmall is used, please use indentS instead.");
			return this.getIndentS();
		};
		
		GridData.prototype.getVisibleOnLarge = function() {
			jQuery.sap.log.warning("Deprecated property visibleOnLarge is used, please use visibleL instead.");
			return this.getVisibleL();
		};
		
		GridData.prototype.getVisibleOnMedium = function() {
			jQuery.sap.log.warning("Deprecated property visibleOnMedium is used, please use visibleM instead.");
			return this.getVisibleM();
		};
		
		GridData.prototype.getVisibleOnSmall = function() {
			jQuery.sap.log.warning("Deprecated property visibleOnSmall is used, please use visibleS instead.");
			return this.getVisibleS();
		};
		
	}());
	

	return GridData;

}, /* bExport= */ true);
