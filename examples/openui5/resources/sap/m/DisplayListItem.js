/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./ListItemBase','./library'],function(q,L,l){"use strict";var D=L.extend("sap.m.DisplayListItem",{metadata:{library:"sap.m",properties:{label:{type:"string",group:"Misc",defaultValue:null},value:{type:"string",group:"Data",defaultValue:null},valueTextDirection:{type:"sap.ui.core.TextDirection",group:"Appearance",defaultValue:sap.ui.core.TextDirection.Inherit}}}});return D;},true);
