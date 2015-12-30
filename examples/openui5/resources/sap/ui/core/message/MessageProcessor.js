/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','sap/ui/base/EventProvider'],function(q,E){"use strict";var M=E.extend("sap.ui.core.message.MessageProcessor",{constructor:function(){E.apply(this,arguments);this.mMessages=null;this.id=q.sap.uid();sap.ui.getCore().getMessageManager().registerMessageProcessor(this);},metadata:{"abstract":true,publicMethods:["getId","setMessages","attachMessageChange","detachMessageChange"]}});M.M_EVENTS={messageChange:"messageChange"};M.prototype.attachMessageChange=function(d,f,l){this.attachEvent("messageChange",d,f,l);return this;};M.prototype.detachMessageChange=function(f,l){this.detachEvent("messageChange",f,l);return this;};M.prototype.fireMessageChange=function(a){this.fireEvent("messageChange",a);return this;};M.prototype.getId=function(){return this.id;};M.prototype.destroy=function(){sap.ui.getCore().getMessageManager().unregisterMessageProcessor(this);E.prototype.destroy.apply(this,arguments);};return M;});
