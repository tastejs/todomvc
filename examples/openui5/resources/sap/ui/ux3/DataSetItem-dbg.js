/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.ux3.DataSetItem.
sap.ui.define(['jquery.sap.global', 'sap/ui/core/Element', './library'],
	function(jQuery, Element, library) {
	"use strict";


	
	/**
	 * Constructor for a new DataSetItem.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * DataSet Item
	 * @extends sap.ui.core.Element
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @alias sap.ui.ux3.DataSetItem
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var DataSetItem = Element.extend("sap.ui.ux3.DataSetItem", /** @lends sap.ui.ux3.DataSetItem.prototype */ { metadata : {
	
		library : "sap.ui.ux3",
		properties : {
	
			/**
			 * image
			 */
			iconSrc : {type : "sap.ui.core.URI", group : "Misc", defaultValue : null},
	
			/**
			 * title
			 */
			title : {type : "string", group : "Misc", defaultValue : 'Title'},
	
			/**
			 * checkable
			 */
			checkable : {type : "boolean", group : "Misc", defaultValue : true},
	
			/**
			 * subtitle
			 */
			subtitle : {type : "string", group : "Misc", defaultValue : 'Subtitle'}
		},
		aggregations : {
	
			/**
			 * The template control currently aggregated by this item and managed by the DataSet
			 */
			_template : {type : "sap.ui.core.Control", multiple : false, visibility : "hidden"}
		},
		events : {
	
			/**
			 * Event Fired when Datset item is selected.
			 */
			selected : {
				parameters : {
	
					/**
					 * Id of the selected Datset item
					 */
					itemId : {type : "string"}
				}
			}
		}
	}});
	
	/**
	 * Handle onclick event. Fires selected Event.
	 * @param {sap.ui.base.Event} oEvent click event
	 * @private
	 */
	DataSetItem.prototype.onclick = function(oEvent) {
		oEvent.stopPropagation();
		
		// determine modifier keys
		var bShift = oEvent.shiftKey;
		var bCtrl = !!(oEvent.metaKey || oEvent.ctrlKey);
		
		this.fireSelected({
			itemId: this.getId(),
			shift:  bShift,
			ctrl:   bCtrl
		});
	};
	DataSetItem.prototype.ondblclick = function(oEvent) {
		this.onclick(oEvent);
	};

	return DataSetItem;

}, /* bExport= */ true);
