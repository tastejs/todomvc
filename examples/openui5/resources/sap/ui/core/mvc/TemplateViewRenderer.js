/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['./ViewRenderer'],function(V){"use strict";var T={};T.render=function(r,c){var a=r;a.write("<div");a.writeControlData(c);a.addClass("sapUiView");a.addClass("sapUiTmplView");V.addDisplayClass(a,c);a.addStyle("width",c.getWidth());a.addStyle("height",c.getHeight());a.writeStyles();a.writeClasses();a.write(">");a.renderControl(c._oTemplate);a.write("</div>");};return T;},true);
