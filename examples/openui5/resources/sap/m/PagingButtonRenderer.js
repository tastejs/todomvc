/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global'],function(q){"use strict";var P={};P.render=function(r,c){var n=c._getNextButton(),p=c._getPreviousButton();r.write("<div");r.writeControlData(c);r.addClass("sapMPagingButton");r.writeClasses();r.write(">");r.renderControl(p);r.renderControl(n);r.write("</div>");};return P;},true);
