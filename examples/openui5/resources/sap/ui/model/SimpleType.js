/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/base/DataType','./FormatException','./ParseException','./Type','./ValidateException'],function(D,F,P,T,V){"use strict";var S=T.extend("sap.ui.model.SimpleType",{constructor:function(f,c){T.apply(this,arguments);this.setFormatOptions(f||{});this.setConstraints(c||{});this.sName="SimpleType";},metadata:{"abstract":true,publicMethods:["setConstraints","setFormatOptions","formatValue","parseValue","validateValue"]}});S.prototype.setConstraints=function(c){this.oConstraints=c;};S.prototype.setFormatOptions=function(f){this.oFormatOptions=f;};S.prototype.getPrimitiveType=function(i){switch(i){case"any":case"boolean":case"int":case"float":case"string":case"object":return i;default:var I=D.getType(i);return I&&I.getPrimitiveType().getName();}};return S;});
