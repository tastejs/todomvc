/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','sap/ui/core/Renderer','./OverlayRenderer'],function(q,R,O){"use strict";var T=R.extend(O);T.renderContent=function(r,c){var a=r;a.write("<div role='Main' class='sapUiUx3TIContent' id='"+c.getId()+"-content'>");a.renderControl(c._oThingViewer);a.write("</div>");};T.addRootClasses=function(r,c){var a=r;a.addClass("sapUiUx3TI");};T.addOverlayClasses=function(r,c){var a=r;a.addClass("sapUiUx3TIOverlay");};return T;},true);
