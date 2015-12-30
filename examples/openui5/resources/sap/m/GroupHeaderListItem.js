/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./ListItemBase','./library'],function(q,L,l){"use strict";var G=L.extend("sap.m.GroupHeaderListItem",{metadata:{library:"sap.m",properties:{title:{type:"string",group:"Data",defaultValue:null},count:{type:"string",group:"Data",defaultValue:null},upperCase:{type:"boolean",group:"Appearance",defaultValue:true},titleTextDirection:{type:"sap.ui.core.TextDirection",group:"Appearance",defaultValue:sap.ui.core.TextDirection.Inherit}}}});G.prototype.getMode=function(){return sap.m.ListMode.None;};G.prototype.shouldClearLastValue=function(){return true;};G.prototype.getTable=function(){var p=this.getParent();if(p instanceof sap.m.Table){return p;}if(p&&p.getMetadata().getName()=="sap.m.Table"){return p;}};G.prototype.onBeforeRendering=function(){var p=this.getParent();if(p&&sap.m.Table&&p instanceof sap.m.Table){p.getColumns().forEach(function(c){c.clearLastValue();});}};return G;},true);
