/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global'],function(q){"use strict";var N={};N.render=function(r,c){if(!c.getVisible()){return;}r.write("<div");r.writeControlData(c);r.addClass("sapMNav");if(c.getWidth()){r.addStyle("width",c.getWidth());}var h=c.getHeight();if(h&&h!="100%"){r.addStyle("height",h);}if(this.renderAttributes){this.renderAttributes(r,c);}r.writeClasses();r.writeStyles();var t=c.getTooltip_AsString();if(t){r.writeAttributeEscaped("title",t);}r.write(">");if(this.renderBeforeContent){this.renderBeforeContent(r,c);}var C=c.getCurrentPage();if(C){C.removeStyleClass("sapMNavItemHidden");r.renderControl(C);}r.write("</div>");};return N;},true);
