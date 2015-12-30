/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global'],function(q){"use strict";var F={};F.render=function(r,c){var a=r;a.write("<div ");a.writeControlData(c);a.addClass("sapUiUx3FFLst");a.writeClasses();a.writeAttribute("style","width:"+c.sWidth);a.write(">");a.write("<header id=\""+c.getId()+"-head\"  class=\"sapUiUx3FFLstHead\"");if(c.getTooltip_AsString()){a.writeAttributeEscaped("title",c.getTooltip_AsString());}a.write(">");a.write("<h3 id=\""+c.getId()+"-head-txt\"  class=\"sapUiUx3FFLstHeadTxt\">");if(c.getTitle()){a.writeEscaped(c.getTitle());}a.write("</h3>");a.write("</header>");a.renderControl(c._oListBox);a.write("</div>");};return F;},true);
