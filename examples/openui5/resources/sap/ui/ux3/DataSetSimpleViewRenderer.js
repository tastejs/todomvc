/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global'],function(q){"use strict";var D={};D.render=function(r,c){var a=r;a.write("<div");a.writeControlData(c);a.addClass("sapUiUx3DSSV");if(c.getFloating()){if(c.getResponsive()){a.addClass("sapUiUx3DSSVResponsive");}else{a.addClass("sapUiUx3DSSVFloating");}}else{a.addClass("sapUiUx3DSSVSingleRow");}if(c.getHeight()){a.addStyle("height",c.getHeight());a.addClass("sapUiUx3DSSVSA");}a.writeClasses();a.writeStyles();a.write(">");if(c.items){for(var i=0;i<c.items.length;i++){this.renderItem(a,c,c.items[i]);}}a.write("</div>");};D.renderItem=function(r,c,i){r.write("<div");r.addClass("sapUiUx3DSSVItem");if(c.getFloating()){r.addClass("sapUiUx3DSSVFlow");if(c.getItemMinWidth()>0){r.writeAttribute("style","min-width:"+c.getItemMinWidth()+"px");}}if(c.isItemSelected(i)){r.addClass("sapUiUx3DSSVSelected");}r.writeClasses();r.writeElementData(i);r.write(">");r.renderControl(i.getAggregation("_template"));r.write("</div>");};return D;},true);
