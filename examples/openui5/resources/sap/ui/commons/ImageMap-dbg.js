/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.commons.ImageMap.
sap.ui.define(['jquery.sap.global', './library', 'sap/ui/core/Control', 'sap/ui/core/delegate/ItemNavigation'],
	function(jQuery, library, Control, ItemNavigation) {
	"use strict";


	
	/**
	 * Constructor for a new ImageMap.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * Combination of image areas where at runtime these areas are starting points for hyperlinks or actions
	 * @extends sap.ui.core.Control
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @alias sap.ui.commons.ImageMap
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var ImageMap = Control.extend("sap.ui.commons.ImageMap", /** @lends sap.ui.commons.ImageMap.prototype */ { metadata : {
	
		library : "sap.ui.commons",
		properties : {
	
			/**
			 * Name for the image that serves as reference
			 */
			name : {type : "string", group : "Misc", defaultValue : null}
		},
		aggregations : {
	
			/**
			 * Area representing the reference to the target location
			 */
			areas : {type : "sap.ui.commons.Area", multiple : true, singularName : "area"}
		},
		events : {
	
			/**
			 * Event for the areas that can be clicked in an ImageMap
			 */
			press : {
				parameters : {
	
					/**
					 * Id of clicked Area.
					 */
					areaId : {type : "string"}
				}
			}
		}
	}});
	
	
	/**
	 * Adds areas to the Image Map. 
	 * 
	 * Each argument must be either a JSon object or a list of objects or the area element or elements.
	 *
	 * @param {any} content Area content to add 
	 * @return {sap.ui.commons.ImageMap} <code>this</code> to allow method chaining
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	ImageMap.prototype.createArea = function() {
		var oArea = new sap.ui.commons.Area();
	
		for ( var i = 0; i < arguments.length; i++) {
			var oContent = arguments[i];
			var oArea;
			if (oContent instanceof sap.ui.commons.Area) {
				oArea = oContent;
			} else {
				oArea = new sap.ui.commons.Area(oContent);
			}
			this.addArea(oArea);
		}
		return this;
	};
	
	/**
	 * Used for after-rendering initialization.
	 *
	 * @private
	 */
	ImageMap.prototype.onAfterRendering = function() {
	
		this.oDomRef = this.getDomRef();
	
		// Initialize the ItemNavigation if does not exist yet
		if (!this.oItemNavigation) {
			this.oItemNavigation = new ItemNavigation();
		}
	
		if (!!sap.ui.Device.browser.internet_explorer) {
	
			var that = this;
			var aImageControls = [];
			this.oItemNavigation.setTabIndex0();
	
			// Find the Image control and add delegate to it
			var $Images = jQuery("img[useMap=#" + this.getName() + "]");
			$Images.each(function(i, image) {
				var id = image.getAttribute("id");
				var imageControl = sap.ui.getCore().byId(id);
				imageControl.addDelegate(that.oItemNavigation);
				that.oItemNavigation.setRootDomRef(image);
				aImageControls.push(imageControl);
			});
	
			this.aImageControls = aImageControls;
		} else {
	
			this.addDelegate(this.oItemNavigation);
			this.oItemNavigation.setRootDomRef(this.oDomRef);
		}
	
		// Set navigations items = Areas inside of Image map
		var aItemDomRefs = [];
		var aAllAreas = this.getAreas();
		for ( var i = 0; i < aAllAreas.length; i++) {
			var oDomRef = aAllAreas[i].getFocusDomRef();
			if (oDomRef) { // separators return null here
				aItemDomRefs.push(oDomRef);
			}
		}
	
		this.oItemNavigation.setItemDomRefs(aItemDomRefs);
		this.oItemNavigation.setCycling(true);
		this.oItemNavigation.setSelectedIndex( -1);
		this.oItemNavigation.setFocusedIndex( -1);
	
	};
	
	/**
	 * Does all the cleanup when the Image Map is to be destroyed. Called from the
	 * element's destroy() method.
	 *
	 * @private
	 */
	ImageMap.prototype.exit = function() {
		// Remove the item navigation delegate
		if (this.oItemNavigation) {
			if (!!sap.ui.Device.browser.internet_explorer) {
				for ( var i = 0; i < this.aImageControls.length; i++) {
					this.aImageControls[i].removeDelegate(this.oItemNavigation);
				}
			} else {
				this.removeDelegate(this.oItemNavigation);
			}
			this.oItemNavigation.destroy();
			delete this.oItemNavigation;
		}
	
		// No super.exit() to call
	};

	return ImageMap;

}, /* bExport= */ true);
