/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global'],function(q){"use strict";var M={};M.render=function(r,c){var a=r;a.write('<div class="sapUiMsg" tabindex="0">');a.write('<div class="sapUiMsgIcon sapUiMsgIcon'+c.getType()+'"></div>');if(typeof c.fnCallBack==="function"){a.write('<span class="sapUiMsgLnk">');if(!c.oLink){c.oLink=new sap.ui.commons.Link();var b=sap.ui.getCore().getLibraryResourceBundle("sap.ui.commons");c.oLink.setText(b.getText("MSGLIST_DETAILS"));c.oLink.attachPress(function(){c.openDetails();});}a.renderControl(c.oLink);a.write(' - </span>');}a.write('<span class="sapUiMsgTxt">');a.writeEscaped(c.getText());a.write('</span>');a.write('</div>');};return M;},true);
