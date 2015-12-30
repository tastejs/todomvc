/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global'],function(q){"use strict";var M={};M.render=function(r,m){r.write("<div");r.writeControlData(m);r.addClass("sapMMessagePage");r.writeClasses();r.write(">");r.renderControl(m.getAggregation("_page"));r.write("</div>");};return M;},true);
