/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/model/PropertyBinding','sap/ui/model/ChangeReason'],function(P,C){"use strict";var R=P.extend("sap.ui.model.resource.ResourcePropertyBinding",{constructor:function(m,p){P.apply(this,arguments);this.oValue=this.oModel.getProperty(p);}});R.prototype.getValue=function(){return this.oValue;};R.prototype.checkUpdate=function(f){if(!this.bSuspended){var v=this.oModel.getProperty(this.sPath);if(f||v!=this.oValue){this.oValue=v;this._fireChange({reason:C.Change});}}};return R;});
