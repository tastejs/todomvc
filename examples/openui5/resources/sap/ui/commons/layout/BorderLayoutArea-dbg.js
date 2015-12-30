/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.commons.layout.BorderLayoutArea.
sap.ui.define(['jquery.sap.global', 'sap/ui/commons/library', 'sap/ui/core/CustomStyleClassSupport', 'sap/ui/core/Element'],
	function(jQuery, library, CustomStyleClassSupport, Element) {
	"use strict";


	
	/**
	 * Constructor for a new layout/BorderLayoutArea.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * The BorderLayoutArea represents one area of a BorderLayout
	 * @extends sap.ui.core.Element
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @alias sap.ui.commons.layout.BorderLayoutArea
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var BorderLayoutArea = Element.extend("sap.ui.commons.layout.BorderLayoutArea", /** @lends sap.ui.commons.layout.BorderLayoutArea.prototype */ { metadata : {
	
		library : "sap.ui.commons",
		properties : {
	
			/**
			 * Defines which area the element represents: top, begin, center, end, bottom
			 * @deprecated Since version 1.3.3. 
			 * Redundant to the aggregation by the parent border layout.
			 */
			areaId : {type : "sap.ui.commons.layout.BorderLayoutAreaTypes", group : "Identification", defaultValue : sap.ui.commons.layout.BorderLayoutAreaTypes.top, deprecated: true},
	
			/**
			 * The overflow mode of the area in horizontal direction as CSS value
			 */
			overflowX : {type : "string", group : "Misc", defaultValue : 'auto'},
	
			/**
			 * The overflow mode of the area in vertical direction as CSS value
			 */
			overflowY : {type : "string", group : "Misc", defaultValue : 'auto'},
	
			/**
			 * The content alignment as CSS value
			 */
			contentAlign : {type : "string", group : "Misc", defaultValue : 'left'},
	
			/**
			 * Defines the height or the width. Is not used when the area element is in Center.
			 */
			size : {type : "sap.ui.core.CSSSize", group : "Misc", defaultValue : '100px'},
	
			/**
			 * Invisible controls are not rendered
			 */
			visible : {type : "boolean", group : "Misc", defaultValue : true}
		},
		defaultAggregation : "content",
		aggregations : {
	
			/**
			 * Controls within the area
			 */
			content : {type : "sap.ui.core.Control", multiple : true, singularName : "content"}
		}
	}});
	
	CustomStyleClassSupport.apply(BorderLayoutArea.prototype);
	
	BorderLayoutArea.prototype.getAreaId = function() {
		var oParent = this.getParent();
		return (oParent && oParent instanceof sap.ui.commons.layout.BorderLayout) ? this.sParentAggregationName : undefined;
	};
	
	BorderLayoutArea.prototype.setVisible = function(bVisible, oBorderLayout) {
		var sAreaId = this.getAreaId();
		
		// if the current area is the center or if no BorderLayout is provided, no animation will be shown
		if (sAreaId === "center" || !oBorderLayout) {
			this.setProperty("visible", bVisible);
			return this;
		}
		
		// with animation
		this.setProperty("visible", bVisible, true);
		this.getParent().getMetadata().getRenderer().animate(this, bVisible);
		
		return this;
	};
	
	
	

	return BorderLayoutArea;

}, /* bExport= */ true);
