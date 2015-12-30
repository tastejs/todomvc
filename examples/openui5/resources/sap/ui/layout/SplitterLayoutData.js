/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','sap/ui/core/LayoutData','./library'],function(q,L,l){"use strict";var S=L.extend("sap.ui.layout.SplitterLayoutData",{metadata:{library:"sap.ui.layout",properties:{resizable:{type:"boolean",group:"Behavior",defaultValue:true},size:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:'auto'},minSize:{type:"int",group:"Dimension",defaultValue:0}}}});return S;},true);
