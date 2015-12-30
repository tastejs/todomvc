/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global'],function(q){"use strict";var S={};S.render=function(r,c){c._bChangedByMe=true;r.write("<div");r.writeControlData(c);r.addClass("sapUiSimpleForm");if(c.getWidth()){r.addStyle("width",c.getWidth());}r.writeStyles();r.writeClasses();r.write(">");var f=c.getAggregation("form");r.renderControl(f);r.write("</div>");c._bChangedByMe=false;};return S;},true);
