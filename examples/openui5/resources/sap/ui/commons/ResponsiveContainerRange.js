/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./library','sap/ui/core/Control'],function(q,l,C){"use strict";var R=C.extend("sap.ui.commons.ResponsiveContainerRange",{metadata:{library:"sap.ui.commons",properties:{width:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:''},height:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:''},key:{type:"string",group:"Misc",defaultValue:''}},associations:{content:{type:"sap.ui.core.Control",multiple:false}}}});return R;},true);
