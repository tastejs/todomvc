/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./ListItemBase','./library','sap/ui/core/EnabledPropagator'],function(q,L,l,E){"use strict";var A=L.extend("sap.m.ActionListItem",{metadata:{library:"sap.m",properties:{text:{type:"string",group:"Misc",defaultValue:null}}}});A.prototype.init=function(){this.setType(sap.m.ListType.Active);L.prototype.init.apply(this,arguments);};A.prototype.getMode=function(){return sap.m.ListMode.None;};A.prototype.onsapspace=A.prototype.onsapenter;return A;},true);
