/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["jquery.sap.global","./library","sap/ui/core/Item"],function(q,l,I){"use strict";var M=I.extend("sap.m.MessagePopoverItem",{metadata:{library:"sap.m",properties:{type:{type:"sap.ui.core.MessageType",group:"Appearance",defaultValue:sap.ui.core.MessageType.Error},title:{type:"string",group:"Appearance",defaultValue:""},description:{type:"string",group:"Appearance",defaultValue:""},markupDescription:{type:"boolean",group:"Appearance",defaultValue:false},longtextUrl:{type:"sap.ui.core.URI",group:"Behavior",defaultValue:null}}}});M.prototype.setDescription=function(d){if(typeof d==='undefined'){d='';}if(this.getMarkupDescription()){d=q.sap._sanitizeHTML(d);}this.setProperty("description",d,true);return this;};return M;},true);
