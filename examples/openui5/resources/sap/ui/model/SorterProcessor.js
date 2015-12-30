/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global'],function(q){"use strict";var S={};S.apply=function(d,s,g,G){var t=this,c=[],C=[],v,o;if(!s||s.length==0){return d;}function f(a,b){if(a==b){return 0;}if(b==null){return-1;}if(a==null){return 1;}if(typeof a=="string"&&typeof b=="string"){return a.localeCompare(b);}if(a<b){return-1;}if(a>b){return 1;}return 0;}for(var j=0;j<s.length;j++){o=s[j];C[j]=o.fnCompare;if(!C[j]){C[j]=f;}q.each(d,function(i,r){v=g(r,o.sPath);if(typeof v=="string"){v=v.toLocaleUpperCase();}if(!c[j]){c[j]=[];}if(G){r=G(r);}c[j][r]=v;});}d.sort(function(a,b){if(G){a=G(a);b=G(b);}var e=c[0][a],h=c[0][b];return t._applySortCompare(s,a,b,e,h,c,C,0);});return d;};S._applySortCompare=function(s,a,b,v,c,d,C,D){var o=s[D],f=C[D],r;r=f(v,c);if(o.bDescending){r=-r;}if(r==0&&s[D+1]){v=d[D+1][a];c=d[D+1][b];r=this._applySortCompare(s,a,b,v,c,d,C,D+1);}return r;};return S;});
