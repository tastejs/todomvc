/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global'],function(q){"use strict";var C={};C.render=function(r,c){r.write("<div");r.writeControlData(c);r.writeClasses();r.write(">");r.renderControl(c.oMatrix);r.write("</div>");};return C;},true);
