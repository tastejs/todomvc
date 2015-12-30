/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','sap/ui/model/ChangeReason','sap/ui/model/ClientPropertyBinding'],function(q,C,a){"use strict";var J=a.extend("sap.ui.model.json.JSONPropertyBinding");J.prototype.setValue=function(v){if(!q.sap.equal(this.oValue,v)){if(this.oModel.setProperty(this.sPath,v,this.oContext,true)){this.oValue=v;}}};J.prototype.checkUpdate=function(f){var v=this._getValue();if(!q.sap.equal(v,this.oValue)||f){this.oValue=v;this._fireChange({reason:C.Change});}};return J;});
