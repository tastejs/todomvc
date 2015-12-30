/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['./Matcher'],function(m){return m.extend("sap.ui.test.matchers.AggregationContainsPropertyEqual",{metadata:{publicMethods:["isMatching"],properties:{aggregationName:{type:"string"},propertyName:{type:"string"},propertyValue:{type:"any"}}},isMatching:function(c){var a,A=this.getAggregationName(),p=this.getPropertyName(),P=this.getPropertyValue(),f=c["get"+jQuery.sap.charToUpperCase(A,0)];if(!f){jQuery.sap.log.error("Control "+c.sId+" does not have an aggregation called: "+A);return false;}a=f.call(c);return a.some(function(v){var b=v["get"+jQuery.sap.charToUpperCase(p,0)];if(!b){return false;}return b.call(v)===P;});}});},true);
