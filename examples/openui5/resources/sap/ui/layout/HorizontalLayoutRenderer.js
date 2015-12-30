/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global'],function(q){"use strict";var H={};H.render=function(r,c){var a=r;var n=!c.getAllowWrapping();a.write("<div");a.writeControlData(c);a.addClass("sapUiHLayout");if(n){a.addClass("sapUiHLayoutNoWrap");}a.writeClasses();a.write(">");var C=c.getContent();for(var i=0;i<C.length;i++){if(n){a.write("<div class='sapUiHLayoutChildWrapper'>");}a.renderControl(C[i]);if(n){a.write("</div>");}}a.write("</div>");};return H;},true);
