/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','sap/ui/core/LayoutData','sap/ui/layout/library'],function(q,L,l){"use strict";var G=L.extend("sap.ui.layout.form.GridElementData",{metadata:{library:"sap.ui.layout",properties:{hCells:{type:"sap.ui.layout.form.GridElementCells",group:"Appearance",defaultValue:'auto'},vCells:{type:"int",group:"Appearance",defaultValue:1}}}});return G;},true);
