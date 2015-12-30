/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.m.Title.
sap.ui.define(['jquery.sap.global', 'sap/ui/core/Control', 'sap/ui/Device', './library'],
	function(jQuery, Control, Device, library) {
	"use strict";
	
	/**
	 * Constructor for a new Title control.
	 *
	 * @param {string} [sId] Id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * The Title control represents a single line of text with explicit header / title semantics.
	 * @extends sap.ui.core.Control
	 * @implements sap.ui.core.IShrinkable
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 * @since 1.27.0
	 *
	 * @constructor
	 * @public
	 * @alias sap.m.Title
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var Title = Control.extend("sap.m.Title", /** @lends sap.m.Title.prototype */ { metadata : {
		
		library : "sap.m",
		interfaces : [
		     "sap.ui.core.IShrinkable"
		],
		properties : {
			
			/**
			 * Defines the text which should be displayed as a title.
			 */
			text : {type : "string", group : "Appearance", defaultValue : null},
	
			/**
			 * Defines the semantic level of the title.
			 * This information is e.g. used by assistive technologies like screenreaders to create a hierarchical site map for faster navigation.
			 * Depending on this setting either a HTML h1-h6 element is used or when using level <code>Auto</code> no explicit level information is written (HTML5 header element).
			 */
			level : {type : "sap.ui.core.TitleLevel", group : "Appearance", defaultValue : sap.ui.core.TitleLevel.Auto},
			
			/**
			 * Defines the style of the title.
			 * When using the <code>Auto</code> styling, the appearance of the title depends on the current position of the title and the defined level. 
			 * This automatism can be overridden by setting a different style explicitly.
			 * The actual appearance of the title and the different styles always depends on the theme being used.
			 */
			titleStyle : {type : "sap.ui.core.TitleLevel", group : "Appearance", defaultValue : sap.ui.core.TitleLevel.Auto},
			
			/**
			 * Defines the width of the title. 
			 */
			width : {type : "sap.ui.core.CSSSize", group : "Dimension", defaultValue : null},
	
			/**
			 * Defines the alignment of the text within the title. <b>Note:</b> This property only has an effect if the overall width of the title control is
			 * larger than the displayed text.
			 */
			textAlign : {type : "sap.ui.core.TextAlign", group : "Appearance", defaultValue : sap.ui.core.TextAlign.Initial}
			
		},
		associations : {

			/**
			 * Defines a relationship to a generic title description.
			 * If such a title element is associated, the properties text, level and tooltip (text only) of this element are consumed.
			 * The corresponding properties of the title control are ignored.
			 */
			title : {type : "sap.ui.core.Title", multiple : false}
		}
	
	}});
	
	// Returns the instance of the associated sap.ui.core.Title if exists
	Title.prototype._getTitle = function(){
		var sTitle = this.getTitle();
		
		if (sTitle) {
			var oTitle = sap.ui.getCore().byId(sTitle);
			if (oTitle && oTitle instanceof sap.ui.core.Title) {
				return oTitle;
			}
		}
		
		return null;
	};
	
	Title.prototype._onTitleChanged = function(){
		this.invalidate();
	};
	
	Title.prototype.setTitle = function(vTitle){
		var that = this;
		
		var oOldTitle = this._getTitle();
		if (oOldTitle) {
			oOldTitle.invalidate = oOldTitle.__sapui5_title_originvalidate;
			oOldTitle.exit = oOldTitle.__sapui5_title_origexit;
			delete oOldTitle.__sapui5_title_origexit;
			delete oOldTitle.__sapui5_title_originvalidate;
		}
		
		this.setAssociation("title", vTitle);
		
		var oNewTitle = this._getTitle();
		if (oNewTitle) {
			oNewTitle.__sapui5_title_originvalidate = oNewTitle.invalidate;
			oNewTitle.__sapui5_title_origexit = oNewTitle.exit;
			oNewTitle.exit = function() {
				that._onTitleChanged();
				if (this.__sapui5_title_origexit) {
					this.__sapui5_title_origexit.apply(this, arguments);
				}
			};
			oNewTitle.invalidate = function() {
				that._onTitleChanged();
				this.__sapui5_title_originvalidate.apply(this, arguments);
			};
		}
		
		return this;
	};

	
	return Title;

}, /* bExport= */ true);