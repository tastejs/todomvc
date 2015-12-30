/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['./Matcher'],function(m){return m.extend("sap.ui.test.matchers.PropertyStrictEquals",{metadata:{publicMethods:["isMatching"],properties:{name:{type:"string"},value:{type:"any"}}},isMatching:function(c){var p=this.getName(),P=c["get"+jQuery.sap.charToUpperCase(p,0)];if(!P){jQuery.sap.log.error("Control "+c.sId+" does not have a property called: "+p);return false;}return P.call(c)===this.getValue();}});},true);
