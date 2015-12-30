/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global'],function(q){"use strict";var S={};S.render=function(r,c){var a=r,b=sap.ui.getCore().getLibraryResourceBundle("sap.ui.commons"),t=b.getText("SEGMENTEDBUTTON_ARIA_SELECT");a.write("<span");a.writeControlData(c);a.addClass("sapUiSegmentedButton");a.writeClasses();a.write(">");a.write('<span id="'+c.getId()+'-radiogroup"');a.writeAccessibilityState(c,{role:"radiogroup",disabled:!c.getEnabled()});if(c.getEnabled()){a.writeAttribute("tabIndex","0");}else{a.writeAttribute("tabIndex","-1");}a.write(">");this.renderButtons(a,c);a.write("</span>");a.write('<span id="'+c.getId()+'-label" style="visibility: hidden; display: none;">');a.writeEscaped(t);a.write('</span>');a.write("</span>");};S.renderButtons=function(r,c){var a=r,b=c.getButtons();q.each(b,function(i,B){a.renderControl(B);});};return S;},true);
