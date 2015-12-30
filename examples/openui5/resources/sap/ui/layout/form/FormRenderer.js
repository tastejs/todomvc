/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global'],function(q){"use strict";var F={};F.render=function(r,f){var a=r;var l=f.getLayout();a.write("<div");a.writeControlData(f);a.addClass("sapUiForm");a.writeAttribute("data-sap-ui-customfastnavgroup","true");var c=sap.ui.layout.form.FormHelper.addFormClass();if(c){a.addClass(c);}if(f.getEditable()){a.addClass("sapUiFormEdit");a.addClass("sapUiFormEdit-CTX");}if(f.getWidth()){a.addStyle("width",f.getWidth());}if(f.getTooltip_AsString()){a.writeAttributeEscaped('title',f.getTooltip_AsString());}a.writeClasses();a.writeStyles();var A={role:"form"};var t=f.getTitle();if(t){var i="";if(typeof t=="string"){i=f.getId()+"--title";}else{i=t.getId();}A["labelledby"]={value:i,append:true};}a.writeAccessibilityState(f,A);a.write(">");if(l){a.renderControl(l);}else{q.sap.log.warning("Form \""+f.getId()+"\" - Layout missing!","Renderer","Form");}a.write("</div>");};return F;},true);
