/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add("dataschema-text",function(e,t){var n=e.Lang,r=n.isString,i=n.isUndefined,s={apply:function(e,t){var n=t,i={results:[],meta:{}};return r(t)&&e&&r(e.resultDelimiter)?i=s._parseResults.call(this,e,n,i):i.error=new Error("Text schema parse failure"),i},_parseResults:function(t,n,s){var o=t.resultDelimiter,u=r(t.fieldDelimiter)&&t.fieldDelimiter,a=t.resultFields||[],f=[],l=e.DataSchema.Base.parse,c,h,p,d,v,m,g,y,b;n.slice(-o.length)===o&&(n=n.slice(0,-o.length)),c=n.split(t.resultDelimiter);if(u)for(y=c.length-1;y>=0;--y){p={},d=c[y],h=d.split(t.fieldDelimiter);for(b=a.length-1;b>=0;--b)v=a[b],m=i(v.key)?v:v.key,g=i(h[m])?h[b]:h[m],p[m]=l.call(this,g,v);f[y]=p}else f=c;return s.results=f,s}};e.DataSchema.Text=e.mix(s,e.DataSchema.Base)},"3.7.3",{requires:["dataschema-base"]});
