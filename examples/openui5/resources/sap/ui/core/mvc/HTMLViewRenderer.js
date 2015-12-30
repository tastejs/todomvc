/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./ViewRenderer'],function(q,V){"use strict";var H={};H.render=function(r,c){var a=r;a.write("<div");a.writeControlData(c);a.addClass("sapUiView");a.addClass("sapUiHTMLView");V.addDisplayClass(a,c);if(c.getWidth()){a.addStyle("width",c.getWidth());}if(c.getHeight()){a.addStyle("height",c.getHeight());}a.writeStyles();a.writeClasses();a.write(">");if(c._oTemplate){var h=c._oTemplate.innerHTML;var b=c.getContent();var d=[];var e=function(c){var t=H._getHTML(a,c,h);if(t){h=t;}else{d.push(c);}};if(b){if(q.isArray(b)){for(var i=0;i<b.length;i++){e(b[i]);}}else if(b){e(b);}}a.write(h);for(var i=0;i<d.length;i++){a.renderControl(d[i]);}}a.write("</div>");};H._getHTML=function(r,c,h){var i=c.getId();h=h.replace(/(<div)/gi,"\n$1");var a=new RegExp('<div.*?data-sap-ui-id="'+i+'".*?></div>',"gi");var m=a.exec(h);if(m){h=h.replace(m[0],r.getHTML(c));return h;}else{return"";}};return H;},true);
