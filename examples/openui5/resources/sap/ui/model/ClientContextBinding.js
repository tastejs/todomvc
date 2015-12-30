/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['./ContextBinding'],function(C){"use strict";var a=C.extend("sap.ui.model.ClientContextBinding",{constructor:function(m,p,c,P,e){C.call(this,m,p,c,P,e);var t=this;m.createBindingContext(p,c,P,function(c){t.bInitial=false;t.oElementContext=c;});}});a.prototype.refresh=function(f){var t=this;this.oModel.createBindingContext(this.sPath,this.oContext,this.mParameters,function(c){if(t.oElementContext===c&&!f){t.oModel.checkUpdate(true,c);}else{t.oElementContext=c;t._fireChange();}},true);};a.prototype.initialize=function(){var t=this;this.oModel.createBindingContext(this.sPath,this.oContext,this.mParameters,function(c){t.oElementContext=c;t._fireChange();},true);};a.prototype.setContext=function(c){var t=this;if(this.oContext!=c){this.oContext=c;this.oModel.createBindingContext(this.sPath,this.oContext,this.mParameters,function(c){t.oElementContext=c;t._fireChange();});}};return a;});
