/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add("dataschema-array",function(e,t){var n=e.Lang,r={apply:function(e,t){var i=t,s={results:[],meta:{}};return n.isArray(i)?e&&n.isArray(e.resultFields)?s=r._parseResults.call(this,e.resultFields,i,s):s.results=i:s.error=new Error("Array schema parse failure"),s},_parseResults:function(t,r,i){var s=[],o,u,a,f,l,c,h,p;for(h=r.length-1;h>-1;h--){o={},u=r[h],a=n.isObject(u)&&!n.isFunction(u)?2:n.isArray(u)?1:n.isString(u)?0:-1;if(a>0)for(p=t.length-1;p>-1;p--)f=t[p],l=n.isUndefined(f.key)?f:f.key,c=n.isUndefined(u[l])?u[p]:u[l],o[l]=e.DataSchema.Base.parse.call(this,c,f);else a===0?o=u:o=null;s[h]=o}return i.results=s,i}};e.DataSchema.Array=e.mix(r,e.DataSchema.Base)},"3.7.3",{requires:["dataschema-base"]});
