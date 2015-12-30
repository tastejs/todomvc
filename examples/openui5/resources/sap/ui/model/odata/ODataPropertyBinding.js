/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','sap/ui/model/ChangeReason','sap/ui/model/PropertyBinding'],function(q,C,P){"use strict";var O=P.extend("sap.ui.model.odata.ODataPropertyBinding",{constructor:function(m,p,c,a){P.apply(this,arguments);this.bInitial=true;this.oValue=this._getValue();}});O.prototype.initialize=function(){if(this.oModel.oMetadata.isLoaded()&&this.bInitial){this.checkUpdate(true);this.bInitial=false;}};O.prototype.getValue=function(){return this.oValue;};O.prototype._getValue=function(){return this.oModel._getObject(this.sPath,this.oContext);};O.prototype.setValue=function(v){if(!q.sap.equal(v,this.oValue)){if(this.oModel.setProperty(this.sPath,v,this.oContext,true)){this.oValue=v;}}};O.prototype.setContext=function(c){if(this.oContext!=c){this.oContext=c;if(this.isRelative()){this.checkUpdate();}}};O.prototype.checkUpdate=function(f){var v=this._getValue();if(!q.sap.equal(v,this.oValue)||f){this.oValue=v;this._fireChange({reason:C.Change});}};return O;});
