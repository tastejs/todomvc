/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','sap/ui/core/Renderer','./TableRenderer'],function(q,R,T){"use strict";var A=R.extend(T);A.getAriaAttributesForCell=function(t,f,r,c,C,o){var a=T.getAriaAttributesForCell.apply(this,arguments);if(a["aria-describedby"]){var d=a["aria-describedby"].value.split(" ");var i=d.indexOf(t.getId()+"-toggleedit");delete a["aria-describedby"];if(i>=0){d.splice(i);}if(d.length>0){a["aria-describedby"].value=d.join(" ");}}return a;};return A;},true);
