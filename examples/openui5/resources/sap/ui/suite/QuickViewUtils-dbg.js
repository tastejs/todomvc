/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

 // Provides 
sap.ui.define(['jquery.sap.global'],
	function(jQuery) {
	"use strict";

	/**
	 * Create a Quickview Instance. This Method is only working with the UI2 QuickView service.
	 * 
	 * @param {string} sServiceUrl
	 * @param {string} sConfigName
	 * @param {string} sThingKey
	 * @returns {sap.ui.ux3.QuickView}
	 */
		
	var QuickViewUtils = {
		/* create a QV instance with content */
		createQuickView: function(sServiceUrl,sConfigName,sThingKey,mFormatter) {
			var oModel = new sap.ui.model.odata.ODataModel(sServiceUrl,false);
			
			var oQV = new sap.ui.ux3.QuickView({firstTitle: "{title}", firstTitleHref: "{titleLinkURL}", type:"{Thing/text}", icon:"{imageURL}"});
			oQV.setModel(oModel);
			oQV.bindObject("/QuickviewConfigs(name='" + sConfigName + "',thingKey='" + sThingKey + "')",{expand:"Thing,QVAttributes/Attribute,QVActions/Action"});
			
			var oMQVC = new sap.ui.suite.hcm.QvContent();
			oMQVC.bindAggregation("items",{path:"QVAttributes",factory: function(sId, oContext) {
				var oQVItem = new sap.ui.suite.hcm.QvItem(sId, {label:"{Attribute/label}",link: "{valueLinkURL}",order:"{order}"});
				oQVItem.bindProperty("value","value",mFormatter && mFormatter[oContext.getProperty("Attribute/name")]);
				return oQVItem;
			}});
			oQV.addContent(oMQVC);
			return oQV;
		},
		/* add content to an existing QV */
		createQuickViewData: function(oQV,sServiceUrl,sConfigName,sThingKey,mFormatter) {
			var oModel = new sap.ui.model.odata.ODataModel(sServiceUrl,false);
			oQV.removeAllContent();
			oQV.setModel(oModel);
			oQV.bindProperty("firstTitle", "title");
			oQV.bindProperty("firstTitleHref", "titleLinkURL");
			oQV.bindProperty("type", "Thing/text");
			oQV.bindProperty("icon", "imageURL");
			oQV.bindObject("/QuickviewConfigs(name='" + sConfigName + "',thingKey='" + sThingKey + "')",{expand:"Thing,QVAttributes/Attribute,QVActions/Action"});
			
			var oMQVC = new sap.ui.suite.hcm.QvContent();
			oMQVC.bindAggregation("items",{path:"QVAttributes",factory: function(sId, oContext) {
				var oQVItem = new sap.ui.suite.hcm.QvItem(sId, {label:"{Attribute/label}",link: "{valueLinkURL}",order:"{order}"});
				oQVItem.bindProperty("value","value",mFormatter && mFormatter[oContext.getProperty("Attribute/name")]);
				return oQVItem;
			}});
			oQV.addContent(oMQVC);
		},
		/* create a QV instance with dataset content */
		createDataSetQuickView: function(sServiceUrl, sCollection, sType, mProperties, iSizeLimit) {
			var oModel = new sap.ui.model.odata.ODataModel(sServiceUrl,false);
			if (iSizeLimit) {
				oModel.setSizeLimit(iSizeLimit);
			}
			var oQV = new sap.ui.ux3.QuickView({type:sType, showActionBar:false});
			oQV.setModel(oModel);
			oQV.addContent(this._createDSContent(oQV,sCollection,mProperties));
			return oQV;
		},
		/* add dataset content to an existing QV */
		createDataSetQuickViewData: function(oQV,sServiceUrl, sCollection, sType, mProperties, iSizeLimit) {
			var oModel = new sap.ui.model.odata.ODataModel(sServiceUrl,false);
			if (iSizeLimit) {
				oModel.setSizeLimit(iSizeLimit);
			}
			oQV.removeAllContent();
			oQV.setType(sType);
			oQV.setShowActionBar(false);
			oQV.setModel(oModel);
			oQV.addContent(this._createDSContent(oQV,sCollection,mProperties));
		},
		
		_createDSContent: function(oQV,sCollection,mProperties) {
			var oContent = new sap.ui.commons.layout.MatrixLayout();
			var oRow = new sap.ui.commons.layout.MatrixLayoutRow();
			jQuery.each(mProperties, function(i,oProperty){
				var oControl;
				if (oProperty.href) {
					oControl = new sap.ui.commons.Link({text : oProperty.value, href: oProperty.href});
				} else {
					oControl = new sap.ui.commons.TextView({text : oProperty.value});
				}
				var oCell = new sap.ui.commons.layout.MatrixLayoutCell({content:[oControl]});
				oCell.addStyleClass("quickViewDS");
				oRow.addCell(oCell);
			});
			oContent.bindAggregation("rows",sCollection,oRow);
			return oContent;
		}
	};
	
	sap.ui.core.Element.extend("sap.ui.suite.hcm.QvItem", {
		metadata : {
			properties: {
				label: "string",
				value: "string",
				link: "string",
				order: "string",
				type : "string"
			}
		}
	});
	
	sap.ui.core.Control.extend("sap.ui.suite.hcm.QvContent", {
		metadata : {
			aggregations: {
				   "items" : {type : "sap.ui.suite.hcm.QvItem", multiple : true}
			}
		},
		init: function() {
			this._sorted = false;
		},
		exit: function() {
			if (this._oML) {
				this._oML.destroy();
			}
		},
		renderer : function(oRm, oControl) {      // the part creating the HTML
			oRm.write("<div");
			oRm.writeControlData(oControl);
			oRm.write(">");
			oRm.renderControl(oControl._createQVContent(oControl));
			oRm.write("</div>");
		},
		_createQVContent: function(oControl) {
				var oML = new sap.ui.commons.layout.MatrixLayout({widths:["75px"]}),
					aItems = oControl.getItems(),
					oMLRow, oMLCell, oLabel, oTxtView, oLink;
			
			if (this._oML) {
				this._oML.destroy();
			}
			oControl._sortItems(oControl);
			for ( var i = 0; i < aItems.length; i++) {
				oMLRow = new sap.ui.commons.layout.MatrixLayoutRow();
				oMLCell = new sap.ui.commons.layout.MatrixLayoutCell({vAlign:'Top'});
				oLabel  = new sap.ui.commons.Label({text:aItems[i].getLabel() + ':'});
				oMLCell.addContent(oLabel);
				oMLRow.addCell(oMLCell);
				oMLCell = new sap.ui.commons.layout.MatrixLayoutCell();
				if (aItems[i].getLink()) {
					oLink = new sap.ui.commons.Link({text:aItems[i].getValue(), href:aItems[i].getLink()});
					oMLCell.addContent(oLink);
				} else {
					oTxtView = new sap.ui.commons.TextView({text:aItems[i].getValue()});
					oMLCell.addContent(oTxtView);
				}
				oMLRow.addCell(oMLCell);
				oML.addRow(oMLRow);
			}
			this._oML = oML;
			return oML;
		},
		_sortItems: function(oControl) {
				if (!oControl._sorted) {
					var aItems = oControl.removeAllAggregation("items", true);
					aItems.sort(function(a, b) {
						return (parseInt(a.getOrder(), 10) - parseInt(b.getOrder(), 10));
					});
					jQuery.each(aItems, function(i,oItem) {oControl.addAggregation("items",oItem,false);});
					oControl._sorted = true;
				}
		}
	});

	return QuickViewUtils;

}, /* bExport= */ true);
