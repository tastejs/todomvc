/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/base/Object'],function(B){"use strict";var C=B.extend("sap.ui.model.Context",{constructor:function(m,p){B.apply(this);this.oModel=m;this.sPath=p;},metadata:{"abstract":true,publicMethods:["getModel","getPath","getProperty","getObject"]}});C.prototype.getModel=function(){return this.oModel;};C.prototype.getPath=function(p){return this.sPath+(p?"/"+p:"");};C.prototype.getProperty=function(p){return this.oModel.getProperty(p,this);};C.prototype.getObject=function(p){return this.oModel.getObject(p,this);};C.prototype.toString=function(){return this.sPath;};return C;});
