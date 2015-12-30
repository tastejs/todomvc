/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./ViewRenderer'],function(q,V){"use strict";var J={};J.render=function(r,c){var a=r;a.write("<div");a.writeControlData(c);a.addClass("sapUiView");a.addClass("sapUiJSView");V.addDisplayClass(a,c);if(c.getWidth()){a.addStyle("width",c.getWidth());}if(c.getHeight()){a.addStyle("height",c.getHeight());}a.writeStyles();a.writeClasses();a.write(">");var b=c.getContent();if(b){if(q.isArray(b)){for(var i=0;i<b.length;i++){a.renderControl(b[i]);}}else if(b){a.renderControl(b);}}a.write("</div>");};return J;},true);
