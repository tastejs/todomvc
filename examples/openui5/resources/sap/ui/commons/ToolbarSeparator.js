/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./library','sap/ui/core/Element'],function(q,l,E){"use strict";var T=E.extend("sap.ui.commons.ToolbarSeparator",{metadata:{interfaces:["sap.ui.commons.ToolbarItem"],library:"sap.ui.commons",properties:{displayVisualSeparator:{type:"boolean",group:"Appearance",defaultValue:true},design:{type:"sap.ui.commons.ToolbarSeparatorDesign",group:"Misc",defaultValue:null}}}});T.prototype.getFocusDomRef=function(){return undefined;};return T;},true);
