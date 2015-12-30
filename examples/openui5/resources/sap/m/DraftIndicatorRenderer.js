/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global'],function(q){"use strict";var D={};D.render=function(r,c){r.write("<div");r.writeControlData(c);r.addClass("sapMDraftIndicator");r.writeClasses();r.write(">");var l=c._getLabel();r.renderControl(l);r.write("</div>");};return D;},true);
