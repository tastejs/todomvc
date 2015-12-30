/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./library','sap/ui/core/Item','sap/ui/core/IconPool'],function(q,l,I){"use strict";var V=I.extend("sap.m.ViewSettingsCustomTab",{metadata:{library:"sap.m",properties:{icon:{type:"sap.ui.core.URI",group:"Misc",defaultValue:"sap-icon://competitor"},title:{type:"string",defaultValue:""}},aggregations:{content:{type:"sap.ui.core.Control",multiple:true,singularName:"content"}}}});V.prototype.init=function(){this._oTabButton=null;this._aTabContents=[];};V.prototype.exit=function(){if(this._oTabButton){this._oTabButton.destroy();delete this._oTabButton;}this._aTabContents.forEach(function(c,i){c.destroy();delete this._aTabContents[i];},this);};V.prototype.getTabButton=function(o){if(this._oTabButton===null){o=o||{};var i=o['idPrefix']||'custom-tab-';this._oTabButton=new sap.m.Button({id:i+this.getId(),icon:this.getIcon(),tooltip:this.getTooltip()});}return this._oTabButton;};return V;},true);
