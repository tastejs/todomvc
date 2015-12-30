/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global'],function(q){"use strict";var P={};P.render=function(r,c){r.write("<section");r.writeControlData(c);r.addClass("sapMFilterPanel");r.writeClasses();r.writeStyles();r.write(">");r.write("<div");r.addClass("sapMFilterPanelContent");r.addClass("sapMFilterPanelBG");r.writeClasses();r.write(">");var C=c.getAggregation("content");var l=C.length;for(var i=0;i<l;i++){r.renderControl(C[i]);}r.write("</div>");r.write("</section>");};return P;},true);
