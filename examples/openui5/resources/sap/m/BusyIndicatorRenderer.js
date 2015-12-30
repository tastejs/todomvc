/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global'],function(q){"use strict";var B={};B.render=function(r,b){this.startBusyIndicator(r,b);this.renderBusyIndication(r,b);this.renderLabel(r,b);this.endBusyIndicator(r);};B.startBusyIndicator=function(r,b){var a={role:"progressbar",valuemin:"0",valuemax:"100"};r.write("<div");r.writeControlData(b);r.addClass("sapMBusyIndicator");r.writeClasses();r.addStyle("font-size",b.getSize());r.writeStyles();r.writeAccessibilityState(b,a);this.renderTooltip(r,b.getTooltip_AsString());r.write(">");};B.renderTooltip=function(r,t){if(t){r.writeAttributeEscaped("title",t);}};B.renderBusyIndication=function(r,b){if(b.getCustomIcon()){r.renderControl(b._iconImage);}else{r.write("<div class='sapMBusyIndicatorBusyArea'");r.writeAttribute("id",b.getId()+"-busy-area");r.write("></div>");}};B.renderLabel=function(r,b){if(b.getText()){r.renderControl(b._busyLabel);}};B.endBusyIndicator=function(r){r.write("</div>");};return B;},true);
