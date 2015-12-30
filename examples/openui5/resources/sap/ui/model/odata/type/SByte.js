/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/model/odata/type/Int'],function(I){"use strict";var r={minimum:-128,maximum:127};var S=I.extend("sap.ui.model.odata.type.SByte",{constructor:function(){I.apply(this,arguments);}});S.prototype.getName=function(){return"sap.ui.model.odata.type.SByte";};S.prototype.getRange=function(){return r;};return S;});
