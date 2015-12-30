/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.ux3.ExactArea.
sap.ui.define(['jquery.sap.global', 'sap/ui/commons/Toolbar', 'sap/ui/core/Control', './library'],
	function(jQuery, Toolbar, Control, library) {
	"use strict";


	
	/**
	 * Constructor for a new ExactArea.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * Consists of two sections: A tool bar and a content area where arbitrary controls can be added.
	 * The ExactArea is intended to be used for the Exact design approach but alternatively also in a stand alone version.
	 * @extends sap.ui.core.Control
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @experimental Since version 1.6. 
	 * API is not yet finished and might change completely
	 * @alias sap.ui.ux3.ExactArea
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var ExactArea = Control.extend("sap.ui.ux3.ExactArea", /** @lends sap.ui.ux3.ExactArea.prototype */ { metadata : {
	
		library : "sap.ui.ux3",
		properties : {
	
			/**
			 * Specifies whether the tool bar shall be visible
			 */
			toolbarVisible : {type : "boolean", group : "Appearance", defaultValue : true}
		},
		defaultAggregation : "content",
		aggregations : {
	
			/**
			 * Arbitrary child controls of the content area
			 */
			content : {type : "sap.ui.core.Control", multiple : true, singularName : "content"}, 
	
			/**
			 * Tool bar items which shall be shown in the tool bar.
			 */
			toolbarItems : {type : "sap.ui.commons.ToolbarItem", multiple : true, singularName : "toolbarItem"}
		}
	}});
	
	
	(function() {
	
	//*************************************************************
	//Define a private element to enable titles tin the toolbar
	//*************************************************************
	
	sap.ui.core.Element.extend("sap.ui.ux3.ExactAreaToolbarTitle", {
	  
	  metadata: {
	    interfaces : ["sap.ui.commons.ToolbarItem"],
	    properties : {
	      text : {name : "text", type : "string", group : "Appearance", defaultValue : ''}
	    }
	  }
	
	});
	
	//*************************************************************
	
	}());

	return ExactArea;

}, /* bExport= */ true);
