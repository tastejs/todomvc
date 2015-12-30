/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["jquery.sap.global","sap/ui/base/Object"],function(q,O){"use strict";var M=O.extend("sap.ui.core.message.MessageParser",{metadata:{publicMethods:["parse","setProcessor"]},constructor:function(){this._processor=null;}});M.prototype.setProcessor=function(p){this._processor=p;return this;};M.prototype.getProcessor=function(){return this._processor;};M.prototype.parse=function(r){q.sap.log.error("MessageParser: parse-method must be implemented in the specific parser class. Messages "+"have been ignored.");};return M;});
