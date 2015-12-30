/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/model/odata/type/Int'],function(I){"use strict";var r={minimum:-32768,maximum:32767};var a=I.extend("sap.ui.model.odata.type.Int16",{constructor:function(){I.apply(this,arguments);}});a.prototype.getName=function(){return"sap.ui.model.odata.type.Int16";};a.prototype.getRange=function(){return r;};return a;});
