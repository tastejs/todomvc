/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global'],function(q){"use strict";var C={};C.render=function(r,c){var i=c.getId();var a=c.getAnimation();if(!sap.ui.getCore().getConfiguration().getAnimation()){a=sap.ui.unified.ContentSwitcherAnimation.None;}var A=c.getActiveContent();r.write("<div");r.writeControlData(c);r.addClass("sapUiUfdCSwitcher");r.addClass("sapUiUfdCSwitcherAnimation"+q.sap.encodeHTML(a));r.writeClasses();r.write(">");r.write("<section id=\""+i+"-content1\" class=\"sapUiUfdCSwitcherContent sapUiUfdCSwitcherContent1"+(A==1?" sapUiUfdCSwitcherVisible":"")+"\">");this.renderContent(r,c.getContent1());r.write("</section>");r.write("<section id=\""+i+"-content2\" class=\"sapUiUfdCSwitcherContent sapUiUfdCSwitcherContent2"+(A==2?" sapUiUfdCSwitcherVisible":"")+"\">");this.renderContent(r,c.getContent2());r.write("</section>");r.write("</div>");};C.renderContent=function(r,c){for(var i=0;i<c.length;++i){r.renderControl(c[i]);}};return C;},true);
