/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add("widget-locale",function(e,t){var n=!0,r="locale",i="initValue",s="-",o="",u=e.Widget;u.ATTRS[r]={value:"en"},u.ATTRS.strings.lazyAdd=!1,e.mix(u.prototype,{_setStrings:function(t,r){var i=this._strs;return r=r.toLowerCase(),i[r]||(i[r]={}),e.aggregate(i[r],t,n),i[r]},_getStrings:function(e){return this._strs[e.toLowerCase()]},getStrings:function(t){t=(t||this.get(r)).toLowerCase();var i=this.getDefaultLocale().toLowerCase(),u=this._getStrings(i),a=u?e.merge(u):{},f=t.split(s),l,c,h,p;if(t!==i||f.length>1){p=o;for(c=0,h=f.length;c<h;++c)p+=f[c],l=this._getStrings(p),l&&e.aggregate(a,l,n),p+=s}return a},getString:function(e,t){t=(t||this.get(r)).toLowerCase();var n=this.getDefaultLocale().toLowerCase(),i=this._getStrings(n)||{},o=i[e],u=t.lastIndexOf(s);if(t!==n||u!=-1)do{i=this._getStrings(t);if(i&&e in i){o=i[e];break}u=t.lastIndexOf(s),u!=-1&&(t=t.substring(0,u))}while(u!=-1);return o},getDefaultLocale:function(){return this._state.get(r,i)},_strSetter:function(e){return this._setStrings(e,this.get(r))},_strGetter:function(e){return this._getStrings(this.get(r))}},!0)},"3.7.3",{requires:["widget-base"]});
