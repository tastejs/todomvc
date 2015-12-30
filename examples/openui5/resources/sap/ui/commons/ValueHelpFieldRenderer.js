/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./TextFieldRenderer'],function(q,T){"use strict";var V=sap.ui.core.Renderer.extend(T);V.renderOuterAttributes=function(r,c){r.addClass("sapUiTfCombo");r.writeAttribute("aria-owns",c.getId()+'-input '+c.getId()+'-icon');};V.renderOuterContent=function(r,c){var i=c.getIconURL();var C=[];var a={};a["id"]=c.getId()+"-icon";a["role"]="button";C.push("sapUiTfValueHelpIcon");if(i&&sap.ui.core.IconPool.isIconURI(i)){c.bIsIconURI=true;a.title=c.getTooltip_AsString();}else{c.bIsIconURI=false;if(c.getEnabled()&&c.getEditable()){C.push("sapUiTfValueHelpRegularIcon");}i=this.renderIcon(r,c,C);}r.writeIcon(i,C,a);};V.renderIcon=function(r,c,C){var i="";if(!c.getEnabled()){if(c.getIconDisabledURL()){c.sIconDsblUrl=c.getIconDisabledURL();}else if(c.getIconURL()){c.sIconDsblUrl=c.getIconURL();C.push('sapUiTfValueHelpDsblIcon');}i=c.sIconDsblUrl;}else{if(c.getIconURL()){c.sIconRegularUrl=c.getIconURL();}i=c.sIconRegularUrl;}return i;};return V;},true);
