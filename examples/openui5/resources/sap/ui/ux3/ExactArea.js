/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','sap/ui/commons/Toolbar','sap/ui/core/Control','./library'],function(q,T,C,l){"use strict";var E=C.extend("sap.ui.ux3.ExactArea",{metadata:{library:"sap.ui.ux3",properties:{toolbarVisible:{type:"boolean",group:"Appearance",defaultValue:true}},defaultAggregation:"content",aggregations:{content:{type:"sap.ui.core.Control",multiple:true,singularName:"content"},toolbarItems:{type:"sap.ui.commons.ToolbarItem",multiple:true,singularName:"toolbarItem"}}}});(function(){sap.ui.core.Element.extend("sap.ui.ux3.ExactAreaToolbarTitle",{metadata:{interfaces:["sap.ui.commons.ToolbarItem"],properties:{text:{name:"text",type:"string",group:"Appearance",defaultValue:''}}}});}());return E;},true);
