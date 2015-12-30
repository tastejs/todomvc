/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global'],function(q){"use strict";var Q={};Q.render=function(r,o){var p=o._createPageContent();r.write("<div");r.addClass("sapMQuickViewPage");r.writeControlData(o);r.writeClasses();r.write(">");if(p.header){r.renderControl(p.header);}r.renderControl(p.form);r.write("</div>");};return Q;},true);
