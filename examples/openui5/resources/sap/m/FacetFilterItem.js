/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./ListItemBase','./library'],function(q,L,l){"use strict";var F=L.extend("sap.m.FacetFilterItem",{metadata:{library:"sap.m",properties:{key:{type:"string",group:"Data",defaultValue:null},text:{type:"string",group:"Misc",defaultValue:null},count:{type:"int",group:"Misc",defaultValue:null,deprecated:true}}}});F.prototype.setCount=function(c){this.setProperty("count",c);this.setProperty("counter",c);};F.prototype.setCounter=function(c){this.setProperty("count",c);this.setProperty("counter",c);};F.prototype.init=function(){L.prototype.init.apply(this);this.addStyleClass("sapMFFLI");};return F;},true);
