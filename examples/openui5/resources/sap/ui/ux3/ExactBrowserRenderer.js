/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global'],function(q){"use strict";var E={};E.render=function(r,c){var a=r;a.write("<div");a.writeControlData(c);a.addClass("sapUiUx3ExactBrwsr");a.writeClasses();a.writeAttribute("role","region");if(c.getShowHeader()){a.writeAttribute("aria-labelledby",c.getId()+"-hdtitle");}if(c.getFollowUpControl()){a.writeAttribute("aria-controls",c.getFollowUpControl());}var t=c.getTooltip_AsString();if(t){a.writeAttributeEscaped("title",t);}a.write(">");if(c.getShowHeader()){a.write("<div class=\"sapUiUx3ExactBrwsrHd\"><h2 id=\""+c.getId()+"-hdtitle\">");a.write(q.sap.encodeHTML(c.getHeaderTitle()));a.write("</h2><div class=\"sapUiUx3ExactBrwsrHdTool\" role=\"toolbar\">");if(c.getEnableSave()){a.renderControl(c._saveButton);}if(c.getEnableReset()){a.renderControl(c._resetButton);}a.write("</div></div>");}a.renderControl(c._rootList);a.write("</div>");};return E;},true);
