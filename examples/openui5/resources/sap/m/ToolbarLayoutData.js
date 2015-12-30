/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./library','sap/ui/core/LayoutData'],function(q,l,L){"use strict";var T=L.extend("sap.m.ToolbarLayoutData",{metadata:{library:"sap.m",properties:{shrinkable:{type:"boolean",group:"Behavior",defaultValue:false},minWidth:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:null},maxWidth:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:null}}}});T.prototype.getParentStyle=function(){var p=this.getParent();if(!p||!p.getDomRef){return{};}var d=p.getDomRef();return d?d.style:{};};T.prototype.applyProperties=function(){var s=this.getParentStyle();s.minWidth=this.getMinWidth();s.maxWidth=this.getMaxWidth();return this;};return T;},true);
