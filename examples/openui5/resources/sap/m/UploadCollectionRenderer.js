/*!
* UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
*/
sap.ui.define(['jquery.sap.global'],function(q){"use strict";var U={};U.render=function(r,c){r.write("<div");r.writeControlData(c);r.addClass("sapMUC");r.writeClasses();r.write(">");r.renderControl(c._oList);r.write("</div>");};return U;},true);
