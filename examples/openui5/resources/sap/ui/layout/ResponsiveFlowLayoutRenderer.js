/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global'],function(q){"use strict";var R={};(function(){R.render=function(r,c){r.write("<div");r.writeControlData(c);r.addClass("sapUiRFL");r.writeClasses();var s=c._getAccessibleRole();var a;if(s){a={role:s};}r.writeAccessibilityState(c,a);r.write(">");r.write("</div>");};}());return R;},true);
