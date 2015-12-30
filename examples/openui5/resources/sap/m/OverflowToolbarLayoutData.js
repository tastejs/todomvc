/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/m/ToolbarLayoutData','sap/m/OverflowToolbarPriority'],function(T,O){"use strict";var a=T.extend("sap.m.OverflowToolbarLayoutData",{metadata:{properties:{moveToOverflow:{type:"boolean",defaultValue:true,deprecated:true},stayInOverflow:{type:"boolean",defaultValue:false,deprecated:true},priority:{type:"sap.m.OverflowToolbarPriority",group:"Behavior",defaultValue:sap.m.OverflowToolbarPriority.High},group:{type:"int",group:"Behavior",defaultValue:0}}}});a.prototype.invalidate=function(){var c=this.getPriority(),i=c===O.AlwaysOverflow||c===O.NeverOverflow;if(this.getGroup()&&i){jQuery.sap.log.error("It is not allowed to set AlwaysOverflow or NeverOverflow to a group items.");}return T.prototype.invalidate.call(this);};return a;},true);
