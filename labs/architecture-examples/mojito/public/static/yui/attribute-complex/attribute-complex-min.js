/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add("attribute-complex",function(e,t){var n=e.Object,r=".";e.Attribute.Complex=function(){},e.Attribute.Complex.prototype={_normAttrVals:function(e){var t={},n={},i,s,o,u;if(e){for(u in e)e.hasOwnProperty(u)&&(u.indexOf(r)!==-1?(i=u.split(r),s=i.shift(),o=n[s]=n[s]||[],o[o.length]={path:i,value:e[u]}):t[u]=e[u]);return{simple:t,complex:n}}return null},_getAttrInitVal:function(e,t,r){var i=t.value,s=t.valueFn,o,u=!1,a,f,l,c,h,p,d;!t.readOnly&&r&&(a=r.simple,a&&a.hasOwnProperty(e)&&(i=a[e],u=!0)),s&&!u&&(s.call||(s=this[s]),s&&(o=s.call(this,e),i=o));if(!t.readOnly&&r){f=r.complex;if(f&&f.hasOwnProperty(e)&&i!==undefined&&i!==null){d=f[e];for(l=0,c=d.length;l<c;++l)h=d[l].path,p=d[l].value,n.setValue(i,h,p)}}return i}},e.mix(e.Attribute,e.Attribute.Complex,!0,null,1),e.AttributeComplex=e.Attribute.Complex},"3.7.3",{requires:["attribute-base"]});
