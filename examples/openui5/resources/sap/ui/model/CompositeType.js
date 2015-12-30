/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['./FormatException','./ParseException','./SimpleType','./ValidateException'],function(F,P,S,V){"use strict";var C=S.extend("sap.ui.model.CompositeType",{constructor:function(f,c){S.apply(this,arguments);this.sName="CompositeType";this.bUseRawValues=false;this.bParseWithValues=false;},metadata:{"abstract":true,publicMethods:[]}});C.prototype.getUseRawValues=function(){return this.bUseRawValues;};C.prototype.getParseWithValues=function(){return this.bParseWithValues;};return C;});
