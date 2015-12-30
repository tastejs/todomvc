/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['./Matcher'],function(m){return m.extend("sap.ui.test.matchers.AggregationLengthEquals",{metadata:{publicMethods:["isMatching"],properties:{name:{type:"string"},length:{type:"int"}}},isMatching:function(c){var a=this.getName(),A=c["get"+jQuery.sap.charToUpperCase(a,0)];if(!A){jQuery.sap.log.error("Control "+c.sId+" does not have an aggregation called: "+a);return false;}var i=A.call(c).length===this.getLength();jQuery.sap.log.info("Control "+c.sId+" has an aggregation '"+a+"' and its length "+A.call(c).length+(i?" matches.":" does not match."));return i;}});},true);
