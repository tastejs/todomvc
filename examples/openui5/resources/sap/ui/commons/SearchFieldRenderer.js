/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global'],function(q){"use strict";var S={};S.render=function(r,c){var a=r;a.write("<div");a.writeControlData(c);a.addClass("sapUiSearchField");if(!c.getEditable()||!c.getEnabled()){a.addClass("sapUiSearchFieldDsbl");}if(!c.hasListExpander()){a.addClass("sapUiSearchFieldNoExp");}if(c.getEnableClear()){a.addClass("sapUiSearchFieldClear");}if(c.getWidth()){a.addStyle("width",c.getWidth());}if(c.getValue()){a.addClass("sapUiSearchFieldVal");}a.writeClasses();a.writeStyles();a.write(">");a.renderControl(c._ctrl);if(c.getShowExternalButton()){a.renderControl(c._btn);}var b=sap.ui.getCore().getLibraryResourceBundle("sap.ui.commons");a.write("<span id='",c.getId(),"-label' style='display:none;' aria-hidden='true'>");a.writeEscaped(b.getText("SEARCHFIELD_BUTTONTEXT"));a.write("</span>");a.write("</div>");};return S;},true);
