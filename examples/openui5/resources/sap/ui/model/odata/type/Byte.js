/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/model/odata/type/Int'],function(I){"use strict";var r={minimum:0,maximum:255};var B=I.extend("sap.ui.model.odata.type.Byte",{constructor:function(){I.apply(this,arguments);}});B.prototype.getName=function(){return"sap.ui.model.odata.type.Byte";};B.prototype.getRange=function(){return r;};return B;});
