/*
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/base/EventProvider'],function(E){"use strict";var D=E.extend("sap.ui.core.util.serializer.delegate.Delegate",{constructor:function(){E.apply(this);}});D.prototype.start=function(c,a,i){return"";};D.prototype.middle=function(c,a,i){return"";};D.prototype.end=function(c,a,i){return"";};D.prototype.startAggregation=function(c,a){return"";};D.prototype.endAggregation=function(c,a){return"";};return D;});
