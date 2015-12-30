/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/model/PropertyBinding'],function(P){"use strict";var C=P.extend("sap.ui.model.control.ControlPropertyBinding",{constructor:function(m,p,c){P.apply(this,arguments);this.oValue=this._getValue();}});C.prototype.getValue=function(){return this.oValue;};C.prototype.setValue=function(v){this.oValue=v;this.oContext.setProperty(this.sPath,v);};C.prototype._getValue=function(){return this.oContext.getProperty(this.sPath);};C.prototype.setContext=function(c){this.oContext=c;this.checkUpdate();};C.prototype.checkUpdate=function(){var v=this._getValue();if(v!==this.oValue){this.oValue=v;this._fireChange();}};return C;});
