/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global'],function(q){"use strict";var H={};H.render=function(r,c){var a=r;a.write("<hr");a.writeControlData(c);a.writeAttribute("role","separator");if(c.getWidth()){a.writeAttribute("style","width:"+c.getWidth()+";");}a.addClass("sapUiCommonsHoriDiv");a.addClass(c.getType()=="Page"?"sapUiCommonsHoriDivTypePage":"sapUiCommonsHoriDivTypeArea");switch(c.getHeight()){case"Ruleheight":a.addClass("sapUiCommonsHoriDivHeightR");break;case"Small":a.addClass("sapUiCommonsHoriDivHeightS");break;case"Large":a.addClass("sapUiCommonsHoriDivHeightL");break;default:a.addClass("sapUiCommonsHoriDivHeightM");}a.writeClasses();a.write("/>");};return H;},true);
