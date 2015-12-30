/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global'],function(q){"use strict";var Q={};Q.render=function(r,o){var c=o.getNavContainer();r.write("<div");r.addClass("sapMQuickViewCard");if(!o.getShowVerticalScrollBar()){r.addClass("sapMQuickViewCardNoScroll");}r.writeControlData(o);r.writeClasses();r.write(">");r.renderControl(c);r.write("</div>");};return Q;},true);
