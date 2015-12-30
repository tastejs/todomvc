/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/base/Object','sap/ui/model/Filter','sap/ui/model/FilterOperator'],function(B,F,a){"use strict";var O=B.extend("sap.ui.model.odata.Filter",{constructor:function(p,v,A){if(typeof p==="object"){var f=p;p=f.path;v=f.values;A=f.and;}this.sPath=p;this.aValues=v;this.bAND=A==undefined?true:A;},convert:function(){var f=[];for(var i=0,l=this.aValues&&this.aValues.length||0;i<l;i++){f.push(new F({path:this.sPath,operator:this.aValues[i].operator,value1:this.aValues[i].value1,value2:this.aValues[i].value2}));}if(f.length>1){var o=new F({filters:f,and:this.bAND});return o;}else{return f[0];}}});return O;});
