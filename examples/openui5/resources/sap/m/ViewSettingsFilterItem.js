/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./ViewSettingsItem','./library'],function(q,V,l){"use strict";var a=V.extend("sap.m.ViewSettingsFilterItem",{metadata:{library:"sap.m",properties:{multiSelect:{type:"boolean",group:"Behavior",defaultValue:true}},aggregations:{items:{type:"sap.m.ViewSettingsItem",multiple:true,singularName:"item"}}}});return a;},true);
