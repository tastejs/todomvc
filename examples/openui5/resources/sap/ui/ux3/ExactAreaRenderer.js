/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global'],function(q){"use strict";var E={};E.render=function(r,c){var a=r;a.write("<div");a.writeControlData(c);a.addClass("sapUiUx3ExactArea");a.writeClasses();a.write(">");if(c.getToolbarVisible()){a.write("<div id=\""+c.getId()+"-tb\" class=\"sapUiTb sapUiTbDesignFlat sapUiTbStandalone\" role=\"toolbar\">");a.write("<div class=\"sapUiTbCont\"><div class=\"sapUiTbInner\">");var t=c.getToolbarItems();for(var i=0;i<t.length;i++){var T=t[i];if(T instanceof sap.ui.commons.ToolbarSeparator){sap.ui.commons.ToolbarRenderer.renderSeparator(a,T);}else if(T instanceof sap.ui.ux3.ExactAreaToolbarTitle){a.write("<div class=\"sapUiUx3ExactAreaTbTitle\">"+q.sap.encodeHTML(T.getText())+"</div>");}else{a.renderControl(T);}}a.write("</div></div></div>");}a.write("<div id=\""+c.getId()+"-ct\" class=\"sapUiUx3ExactAreaCont\">");var C=c.getContent();for(var i=0;i<C.length;i++){a.renderControl(C[i]);}a.write("</div>");a.write("</div>");};return E;},true);
