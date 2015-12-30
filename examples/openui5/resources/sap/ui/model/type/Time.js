/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['./Date','sap/ui/core/format/DateFormat'],function(D,a){"use strict";var T=D.extend("sap.ui.model.type.Time",{constructor:function(){D.apply(this,arguments);this.sName="Time";}});T.prototype._createFormats=function(){this.oOutputFormat=a.getTimeInstance(this.oFormatOptions);if(this.oFormatOptions.source){this.oInputFormat=a.getTimeInstance(this.oFormatOptions.source);}};return T;});
