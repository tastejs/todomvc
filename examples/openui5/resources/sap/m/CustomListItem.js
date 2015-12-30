/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./ListItemBase','./library'],function(q,L,l){"use strict";var C=L.extend("sap.m.CustomListItem",{metadata:{library:"sap.m",defaultAggregation:"content",aggregations:{content:{type:"sap.ui.core.Control",multiple:true,singularName:"content",bindable:"bindable"}}}});return C;},true);
