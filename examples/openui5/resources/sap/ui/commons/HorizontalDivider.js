/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./library','sap/ui/core/Control'],function(q,l,C){"use strict";var H=C.extend("sap.ui.commons.HorizontalDivider",{metadata:{library:"sap.ui.commons",properties:{width:{type:"sap.ui.core.CSSSize",group:"Appearance",defaultValue:'100%'},type:{type:"sap.ui.commons.HorizontalDividerType",group:"Appearance",defaultValue:sap.ui.commons.HorizontalDividerType.Area},height:{type:"sap.ui.commons.HorizontalDividerHeight",group:"Appearance",defaultValue:sap.ui.commons.HorizontalDividerHeight.Medium}}}});return H;},true);
