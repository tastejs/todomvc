/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global'],function(q){"use strict";var M={};M.render=function(r,c){var a=r;a.write('<ul class="sapUiMsgList"');a.writeControlData(c);a.write(">");for(var i=c.aMessages.length-1;i>=0;i--){a.write('<li class="sapUiMsgListLi">');a.renderControl(c.aMessages[i]);a.write("</li>");}a.write("</ul>");};return M;},true);
