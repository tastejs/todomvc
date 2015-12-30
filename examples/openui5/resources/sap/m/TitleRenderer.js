/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','sap/ui/Device'],function(q,D){"use strict";var T={};T.render=function(r,t){var a=t._getTitle(),l=(a?a.getLevel():t.getLevel())||sap.ui.core.TitleLevel.Auto,A=l==sap.ui.core.TitleLevel.Auto,s=A?"div":l;r.write("<",s);r.writeControlData(t);r.addClass("sapMTitle");r.addClass("sapMTitleStyle"+(t.getTitleStyle()||sap.ui.core.TitleLevel.Auto));r.addClass("sapMTitleNoWrap");r.addClass("sapUiSelectable");var w=t.getWidth();if(!w){r.addClass("sapMTitleMaxWidth");}else{r.addStyle("width",w);}var b=t.getTextAlign();if(b&&b!=sap.ui.core.TextAlign.Initial){r.addClass("sapMTitleAlign"+b);}if(t.getParent()instanceof sap.m.Toolbar){r.addClass("sapMTitleTB");}var c=a?a.getTooltip_AsString():t.getTooltip_AsString();if(c){r.writeAttributeEscaped("title",c);}if(A){r.writeAttribute("role","heading");}r.writeClasses();r.writeStyles();r.write("><span>");r.writeEscaped(a?a.getText():t.getText());r.write("</span></",s,">");};return T;},true);
