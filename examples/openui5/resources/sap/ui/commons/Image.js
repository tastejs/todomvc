/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./library','sap/ui/core/Control'],function(q,l,C){"use strict";var I=C.extend("sap.ui.commons.Image",{metadata:{interfaces:["sap.ui.commons.ToolbarItem","sap.ui.commons.FormattedTextViewControl"],library:"sap.ui.commons",properties:{src:{type:"sap.ui.core.URI",group:"Data",defaultValue:null},width:{type:"sap.ui.core.CSSSize",group:"Appearance",defaultValue:null},height:{type:"sap.ui.core.CSSSize",group:"Appearance",defaultValue:null},decorative:{type:"boolean",group:"Accessibility",defaultValue:true},alt:{type:"string",group:"Accessibility",defaultValue:null},useMap:{type:"string",group:"Misc",defaultValue:null}},events:{press:{}}}});I.prototype.onclick=function(e){this.firePress({});};I.prototype.onsapenter=I.prototype.onclick;return I;},true);
