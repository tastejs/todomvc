/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global'],function(q){"use strict";var E={};E.render=function(r,c){var a=r;a.write("<div");a.writeControlData(c);a.addClass("sapUiUx3Exact");a.writeClasses();var t=c.getTooltip_AsString();if(t){a.writeAttributeEscaped("title",t);}a.write(">");a.renderControl(c._searchArea);if(c._bDetailsVisible){a.renderControl(c._browser);a.renderControl(c._resultText);a.renderControl(c._resultArea);}a.write("</div>");};return E;},true);
