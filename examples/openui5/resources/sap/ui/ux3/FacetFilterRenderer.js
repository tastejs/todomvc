/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global'],function(q){"use strict";var F={};F.render=function(r,c){var a=r;var f=(c.getVisibleItemCountMode()===sap.ui.ux3.VisibleItemCountMode.Auto);a.write("<div");a.writeControlData(c);a.addClass("sapUiUx3FacetFilter");a.writeClasses();if(f){a.writeAttribute("style","height:100%");}a.write(">");var l=c.getLists();if(l){for(var i=0;i<l.length;i++){l[i].sWidth=100/l.length+"%";l[i].bFullHeight=f;a.renderControl(l[i]);}}a.write("</div>");};return F;},true);
