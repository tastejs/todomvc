/*!

* UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.

*/
sap.ui.define(['jquery.sap.global'],function(q){"use strict";var T={};T.render=function(r,c){r.write("<div tabindex=\"-1\"");r.writeControlData(c);r.addClass("sapMToken");r.writeClasses();r.writeAttribute("role","listitem");r.writeAttribute("aria-readonly",!c.getEditable());r.writeAttribute("aria-selected",c.getSelected());if(c.getSelected()){r.addClass("sapMTokenSelected");}var t=c.getTooltip_AsString();if(t){r.writeAttributeEscaped("title",t);}var a={};a.describedby={value:c._sAriaTokenLabelId,append:true};if(c.getEditable()){a.describedby={value:c._sAriaTokenDeletableId,append:true};}r.writeAccessibilityState(c,a);r.write(">");T._renderInnerControl(r,c);if(c.getEditable()){r.renderControl(c._deleteIcon);}r.write("</div>");};T._renderInnerControl=function(r,c){var t=c.getTextDirection();r.write("<span");r.addClass("sapMTokenText");r.writeClasses();if(t!==sap.ui.core.TextDirection.Inherit){r.writeAttribute("dir",t.toLowerCase());}r.write(">");var a=c.getText();if(a){r.writeEscaped(a);}r.write("</span>");};return T;},true);
