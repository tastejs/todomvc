/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','sap/ui/core/Element','./library'],function(q,E){"use strict";var T=E.extend("sap.ui.ux3.ThingGroup",{metadata:{library:"sap.ui.ux3",properties:{title:{type:"string",group:"Misc",defaultValue:null},colspan:{type:"boolean",group:"Misc",defaultValue:false}},defaultAggregation:"content",aggregations:{content:{type:"sap.ui.core.Control",multiple:true,singularName:"content"},actions:{type:"sap.ui.ux3.ThingGroup",multiple:true,singularName:"action"}}}});return T;},true);
