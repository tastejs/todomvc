/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global'],function(q){"use strict";var R=function(){};R.render=function(r,c){var o=r,C=c.getAggregation("content");o.write("<div ");o.writeControlData(c);o.addStyle("width",c.getWidth());o.addStyle("height",c.getHeight());o.writeStyles();o.write(">");if(C){o.renderControl(C);}o.write("<div ");o.addStyle("width","0px");o.addStyle("height","0px");o.addStyle("overflow","hidden");o.writeStyles();o.write(">");q.each(c.getRanges(),function(i,a){o.write("<div ");o.writeElementData(a);o.addStyle("width",a.getWidth());o.addStyle("height",a.getHeight());o.writeStyles();o.write("></div>");});o.write("</div>");o.write("</div>");};return R;},true);
