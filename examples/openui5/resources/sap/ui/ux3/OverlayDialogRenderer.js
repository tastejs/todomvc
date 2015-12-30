/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','sap/ui/core/Renderer','./OverlayRenderer'],function(q,R,O){"use strict";var a=R.extend(O);a.renderContent=function(r,c){var b=r;b.write("<div role='Main' class='sapUiUx3ODContent' id='"+c.getId()+"-content'>");var d=c.getContent();for(var i=0;i<d.length;i++){var e=d[i];b.renderControl(e);}b.write("</div>");};a.addRootClasses=function(r,c){var b=r;b.addClass("sapUiUx3OD");};a.addOverlayClasses=function(r,c){var b=r;b.addClass("sapUiUx3ODOverlay");};return a;},true);
