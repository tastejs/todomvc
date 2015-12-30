/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.ux3.ExactBrowser.
sap.ui.define(['jquery.sap.global', 'sap/ui/commons/Button', 'sap/ui/commons/Menu', 'sap/ui/core/Control', './ExactAttribute', './ExactList', './library'],
	function(jQuery, Button, Menu, Control, ExactAttribute, ExactList, library) {
	"use strict";


	
	/**
	 * Constructor for a new ExactBrowser.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * Attribute browse area used within the Exact pattern. The main benefit of this control is the high flexibility when large data amounts shall be displayed
	 * in the form of structured data sets with a high or low interdependency level. From lists - which can be nested according to the defined attributes - the user can choose
	 * entries and thereby trigger the display of further information, depending on the chosen entry/entries (multiple selection supported).
	 * @extends sap.ui.core.Control
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @alias sap.ui.ux3.ExactBrowser
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var ExactBrowser = Control.extend("sap.ui.ux3.ExactBrowser", /** @lends sap.ui.ux3.ExactBrowser.prototype */ { metadata : {
	
		library : "sap.ui.ux3",
		properties : {
	
			/**
			 * Title text in the list area of the Exact Browser. The title is not shown when the property showTopList is set to false.
			 */
			title : {type : "string", group : "Misc", defaultValue : null},
	
			/**
			 * Title text in the header of the Exact Browser.
			 */
			headerTitle : {type : "string", group : "Misc", defaultValue : null},
	
			/**
			 * The order how the sublists of the top level list should be displayed.
			 * @since 1.7.1
			 */
			topListOrder : {type : "sap.ui.ux3.ExactOrder", defaultValue : sap.ui.ux3.ExactOrder.Select},
	
			/**
			 * Enables the close icons of the displayed lists.
			 */
			enableListClose : {type : "boolean", group : "Misc", defaultValue : false},
	
			/**
			 * The height of the list area in px.
			 */
			listHeight : {type : "int", group : "Appearance", defaultValue : 290},
	
			/**
			 * Whether the header area of the ExactBrowser should be shown.
			 */
			showHeader : {type : "boolean", group : "Misc", defaultValue : false},
	
			/**
			 * Whether the top list of the ExactBrowser should be shown. When the property is set to false the
			 * application must ensure to select top level attributes appropriately.
			 * @since 1.7.0
			 */
			showTopList : {type : "boolean", group : "Misc", defaultValue : true},
	
			/**
			 * Whether the reset functionality should be available in the header area.
			 */
			enableReset : {type : "boolean", group : "Misc", defaultValue : true},
	
			/**
			 * Whether the save button should be available in the header area.
			 * @since 1.9.2
			 */
			enableSave : {type : "boolean", group : "Misc", defaultValue : false},
	
			/**
			 * Specifies the width of the top list in pixels. The value must be between 70 and 500.
			 * @since 1.7.0
			 */
			topListWidth : {type : "int", group : "Misc", defaultValue : 168}
		},
		defaultAggregation : "attributes",
		aggregations : {
	
			/**
			 * The attributes which shall be available.
			 */
			attributes : {type : "sap.ui.ux3.ExactAttribute", multiple : true, singularName : "attribute"}, 
	
			/**
			 * Menu with options. The menu can not used when the property showTopList is set to false.
			 */
			optionsMenu : {type : "sap.ui.commons.Menu", multiple : false}, 
	
			/**
			 * Controls managed by this ExactBrowser
			 */
			controls : {type : "sap.ui.core.Control", multiple : true, singularName : "control", visibility : "hidden"}, 
	
			/**
			 * root attribute managed by this ExactBrowser
			 */
			rootAttribute : {type : "sap.ui.core.Element", multiple : false, visibility : "hidden"}
		},
		associations : {
	
			/**
			 * The successor control of the Exact Browser. The id of this control is used in the ARIA description of the control.
			 */
			followUpControl : {type : "sap.ui.core.Control", multiple : false}
		},
		events : {
	
			/**
			 * Event is fired when an attribute is selected or unselected.
			 */
			attributeSelected : {
				parameters : {
	
					/**
					 * The attribute which was selected or unselected recently
					 */
					attribute : {type : "sap.ui.ux3.ExactAttribute"}, 
	
					/**
					 * Array of all selected ExactAttributes
					 */
					allAttributes : {type : "object"}
				}
			}, 
	
			/**
			 * Event is fired when an attribute is selected or unselected.
			 */
			save : {}
		}
	}});
	
	
	
	
	
	(function() {
		
		/**
		 * Does the setup when the ExactBrowser is created.
		 * @private
		 */
		ExactBrowser.prototype.init = function(){
			var that = this;
			
			this.data("sap-ui-fastnavgroup", "true", true); // Define group for F6 handling
	
			this._rb = sap.ui.getCore().getLibraryResourceBundle("sap.ui.ux3");
	
			//Create a root node for the attributes tree
			this._attributeRoot = new ExactAttribute();
			this.setAggregation("rootAttribute",this._attributeRoot);
			//Init the used subcontrols
			this._rootList = new ExactList(this.getId() + "-rootlist");
			this._rootList.setData(this._attributeRoot);
			this.addAggregation("controls", this._rootList);
	
			this._resetButton = new Button(this.getId() + "-RstBtn", {text: this._rb.getText("EXACT_BRWSR_RESET"), lite: true});
			this._resetButton.addStyleClass("sapUiUx3ExactBrwsrReset");
			this.addAggregation("controls", this._resetButton);
			this._resetButton.attachPress(function(){
				that.reset();
			});
	
			this._saveButton = new Button(this.getId() + "-SvBtn", {text: this._rb.getText("EXACT_BRWSR_SAVE"), lite: true});
			this._saveButton.addStyleClass("sapUiUx3ExactBrwsrSave");
			this.addAggregation("controls", this._saveButton);
			this._saveButton.attachPress(function(){
				that.fireSave();
			});
	
			this._rootList.attachAttributeSelected(function(oEvent){
				that.fireAttributeSelected({attribute: oEvent.getParameter("attribute"), allAttributes: oEvent.getParameter("allAttributes")});
			});
			this._rootList.attachEvent("_headerPress", function(oEvent){
				var oMenu = that.getOptionsMenu();
				if (oMenu) {
					var oDomRef = oEvent.getParameter("domRef");
					oMenu.open(oEvent.getParameter("keyboard"), oDomRef, sap.ui.core.Popup.Dock.BeginTop, sap.ui.core.Popup.Dock.BeginBottom, oDomRef);
				}
			});
		};
	
	
		/**
		 * Does all the cleanup when the ExactBrowser is to be destroyed.
		 * Called from Element's destroy() method.
		 * @private
		 */
		ExactBrowser.prototype.exit = function(){
			this._rootList.destroy();
			this._attributeRoot.destroy();
			this._rootList = null;
			this._attributeRoot = null;
			this._resetButton = null;
			this._saveButton = null;
			this._saveDialog = null;
			this._saveTextField = null;
			this._rb = null;
		};
		
		
		/**
		 * Called when the theme is changed.
		 * @private
		 */
		ExactBrowser.prototype.onThemeChanged = function(oEvent) {
			if (this.getDomRef()) {
				this.invalidate();
			}
		};
	
	
		//*** Overridden API functions ***
	
		ExactBrowser.prototype.getTitle = function() {
			return this._rootList.getTopTitle();
		};
	
	
		ExactBrowser.prototype.setTitle = function(sTitle) {
			this._rootList.setTopTitle(sTitle);
			return this;
		};
		
		
		ExactBrowser.prototype.setTopListOrder = function(sListOrder) {
			this.setProperty("topListOrder", sListOrder, true);
			this._attributeRoot.setListOrder(sListOrder);
			return this;
		};
		
		
		ExactBrowser.prototype.getTopListWidth = function() {
			return this._attributeRoot.getWidth();
		};
	
	
		ExactBrowser.prototype.setTopListWidth = function(iWidth) {
			this._attributeRoot.setWidth(iWidth);
			return this;
		};
	
	
		ExactBrowser.prototype.getHeaderTitle = function() {
			var sTitle = this.getProperty("headerTitle");
			return sTitle ? sTitle : this._rb.getText("EXACT_BRWSR_TITLE");
		};
	
	
		ExactBrowser.prototype.getEnableListClose = function() {
			return this._rootList.getShowClose();
		};
	
	
		ExactBrowser.prototype.setEnableListClose = function(bEnableListClose) {
			this._rootList.setShowClose(bEnableListClose);
			return this;
		};
	
	
		ExactBrowser.prototype.getListHeight = function() {
			return this._rootList.getTopHeight();
		};
	
	
		ExactBrowser.prototype.setListHeight = function(iListHeight) {
			this._rootList.setTopHeight(iListHeight);
			return this;
		};
	
	
		ExactBrowser.prototype.getAttributes = function() {
			return this._attributeRoot.getAttributesInternal();
		};
	
	
		ExactBrowser.prototype.insertAttribute = function(oAttribute, iIndex) {
			this._attributeRoot.insertAttribute(oAttribute, iIndex);
			return this;
		};
	
	
		ExactBrowser.prototype.addAttribute = function(oAttribute) {
			this._attributeRoot.addAttribute(oAttribute);
			return this;
		};
	
	
		ExactBrowser.prototype.removeAttribute = function(vElement) {
			return this._attributeRoot.removeAttribute(vElement);
		};
	
	
		ExactBrowser.prototype.removeAllAttributes = function() {
			return this._attributeRoot.removeAllAttributes();
		};
	
	
		ExactBrowser.prototype.indexOfAttribute = function(oAttribute) {
			return this._attributeRoot.indexOfAttribute(oAttribute);
		};
	
	
		ExactBrowser.prototype.destroyAttributes = function() {
			this._attributeRoot.destroyAttributes();
			return this;
		};
	
	

		/**
		 * Deselects all currently selected attributes and closes all attribute lists.
		 *
		 * @type void
		 * @public
		 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
		ExactBrowser.prototype.reset = function() {
			this._rootList._closeAll();
		};
	
	
		//*** Private helper functions ***
		
		ExactBrowser.prototype.hasOptionsMenu = function() {
			return !!this.getOptionsMenu();
		};
	
	/*	//Closes the save dialog and triggers the save event
		function doSave(oExactBrowser, bSkip) {
			oExactBrowser._saveDialog.close();
			if(!bSkip){
				alert("Save: "+oExactBrowser._saveTextField.getValue());
			}
		}
	
	
		//Opens the save dialog
		function openSaveDialog(oExactBrowser) {
			if(!oExactBrowser._saveDialog){
				jQuery.sap.require("sap.ui.ux3.ToolPopup");
				jQuery.sap.require("sap.ui.commons.TextField");
				jQuery.sap.require("sap.ui.commons.Label");
				oExactBrowser._saveTextField = new sap.ui.commons.TextField(oExactBrowser.getId()+"-SvDlgTf");
				var label = new sap.ui.commons.Label({text: oExactBrowser._rb.getText("EXACT_BRWSR_DLG_LABEL")}).setLabelFor(oExactBrowser._saveTextField);
				oExactBrowser._saveDialog = new sap.ui.ux3.ToolPopup(oExactBrowser.getId()+"-SvDlg", {
					content:[label, oExactBrowser._saveTextField],
					buttons: [
						new sap.ui.commons.Button(oExactBrowser.getId()+"-SvDlgSvBtn", {
							text: oExactBrowser._rb.getText("EXACT_BRWSR_DLG_SAVE"),
							press: function(){
								doSave(oExactBrowser);
							}
						}),
						new sap.ui.commons.Button(oExactBrowser.getId()+"-SvDlgCnclBtn", {
							text: oExactBrowser._rb.getText("EXACT_BRWSR_DLG_CANCEL"),
							press: function(){
								doSave(oExactBrowser, true);
							}
						})
					]
				});
				oExactBrowser._saveDialog.addStyleClass("sapUiUx3ExactBrwsrSaveDlg");
				oExactBrowser.addAggregation("controls", oExactBrowser._saveDialog);
			}
			oExactBrowser._saveDialog.setPosition(sap.ui.core.Popup.Dock.EndTop, sap.ui.core.Popup.Dock.EndBottom, oExactBrowser._saveButton.getDomRef(), "0 13", "none");
			oExactBrowser._saveDialog.open();
		}
	*/
	
	}());

	return ExactBrowser;

}, /* bExport= */ true);
