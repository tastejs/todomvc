/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global'],function(q){"use strict";var V={};V.render=function(r,v){var a=r;a.write("<DIV");a.writeControlData(v);a.addClass("sapUiVlt");a.addClass("sapuiVlt");if(v.getWidth()&&v.getWidth()!=''){a.addStyle("width",v.getWidth());}a.writeStyles();a.writeClasses();a.write(">");var c=v.getContent();for(var i=0;i<c.length;i++){a.write("<DIV class=\"sapUiVltCell sapuiVltCell\">");a.renderControl(c[i]);a.write("</DIV>");}a.write("</DIV>");};return V;},true);
