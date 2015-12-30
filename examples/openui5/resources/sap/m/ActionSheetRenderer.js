/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global'],function(q){"use strict";var A={};A.render=function(r,c){var a=c._getAllButtons(),i,m,b;for(i=0;i<a.length;i++){b=a[i];if(b.getIcon()){m=true;}else{b.addStyleClass("sapMActionSheetButtonNoIcon");}}r.write("<div");r.writeControlData(c);r.addClass("sapMActionSheet");if(m){r.addClass("sapMActionSheetMixedButtons");}r.writeClasses();var t=c.getTooltip_AsString();if(t){r.writeAttributeEscaped("title",t);}r.write(">");for(i=0;i<a.length;i++){r.renderControl(a[i].addStyleClass("sapMActionSheetButton"));}if(sap.ui.Device.system.phone&&c.getShowCancelButton()){r.renderControl(c._getCancelButton());}r.write("</div>");};return A;},true);
