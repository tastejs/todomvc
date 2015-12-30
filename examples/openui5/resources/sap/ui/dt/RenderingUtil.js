/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global'],function(q){"use strict";var R={};R.renderOverlay=function(r,o,c){if(o.getDomRef()){this._triggerOnAfterRenderingWithoutRendering(r,o);return;}r.addClass("sapUiDtOverlay");r.addClass(c);r.write("<div");r.writeControlData(o);var a=o.getAggregationName&&o.getAggregationName();if(a){r.write("data-sap-ui-dt-aggregation='"+o.getAggregationName()+"'");}else{r.write("data-sap-ui-dt-for='"+o.getElementInstance().getId()+"'");}r.writeClasses();r.writeStyles();r.write(">");this._renderChildren(r,o);r.write("</div>");};R._renderChildren=function(r,o){var c=o.getChildren();c.forEach(function(C){r.renderControl(C);});};R._triggerOnAfterRenderingWithoutRendering=function(r,o){r.write("");this._renderChildren(r,o);};return R;},true);
