/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global'],function(q){"use strict";var D={};D.render=function(r,e){r.write("<");r.write(e.getTag());r.writeControlData(e);q.each(e.getAttributes(),function(i,a){var n=a.getName().toLowerCase();if(n==="class"){var c=a.getValue().split(" ");q.each(c,function(i,C){var C=C.trim();if(C){r.addClass(C);}});}else if(n==="style"){var s=a.getValue().split(";");q.each(s,function(i,S){var i=S.indexOf(":");if(i!=-1){var k=S.substring(0,i).trim();var v=S.substring(i+1).trim();r.addStyle(k,v);}});}else{r.writeAttributeEscaped(a.getName(),a.getValue());}});r.writeClasses();r.writeStyles();var E=e.getElements(),h=!!e.getText()||E.length>0;if(!h){r.write("/>");}else{r.write(">");if(e.getText()){r.writeEscaped(e.getText());}q.each(E,function(i,c){r.renderControl(c);});r.write("</");r.write(e.getTag());r.write(">");}};return D;},true);
