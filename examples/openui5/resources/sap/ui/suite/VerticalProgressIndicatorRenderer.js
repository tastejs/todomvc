/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global'],function(q){"use strict";var V={};V.render=function(r,c){var a=r;var b=c.getPercentage();if(b<0||b==Number.NaN){b=0;}if(b>100){b=100;}var P=Math.round(b*58/100);var d=58-P;var e=b.toString();a.write("<DIV");a.writeControlData(c);a.writeAttribute('tabIndex','0');if(c.getTooltip_AsString()){a.writeAttributeEscaped("title",c.getTooltip_AsString());}else{a.writeAttributeEscaped("title",e);}if(sap.ui.getCore().getConfiguration().getAccessibility()){a.writeAttribute('role','progressbar');a.writeAccessibilityState(c,{valuemin:'0%'});a.writeAccessibilityState(c,{valuemax:'100%'});a.writeAccessibilityState(c,{valuenow:b+'%'});}a.writeAttribute("class","sapUiVerticalProgressOuterContainer");a.write(">");a.write("<DIV");a.writeAttribute('id',c.getId()+'-bar');a.writeAttribute("class","sapUiVerticalProgressInnerContainer");a.addStyle("top",d+"px");a.addStyle("height",P+"px");a.writeClasses();a.writeStyles();a.write(">");a.write("</DIV>");a.write("</DIV>");};return V;},true);
