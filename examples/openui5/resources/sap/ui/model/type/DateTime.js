/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['./Date','sap/ui/core/format/DateFormat'],function(D,a){"use strict";var b=D.extend("sap.ui.model.type.DateTime",{constructor:function(){D.apply(this,arguments);this.sName="DateTime";}});b.prototype._createFormats=function(){this.oOutputFormat=a.getDateTimeInstance(this.oFormatOptions);if(this.oFormatOptions.source){this.oInputFormat=a.getDateTimeInstance(this.oFormatOptions.source);}};return b;});
