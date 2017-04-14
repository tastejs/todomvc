/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add("datasource-cache",function(e,t){function r(t){var n=t&&t.cache?t.cache:e.Cache,r=e.Base.create("dataSourceCache",n,[e.Plugin.Base,e.Plugin.DataSourceCacheExtension]),i=new r(t);return r.NS="tmpClass",i}var n=function(){};e.mix(n,{NS:"cache",NAME:"dataSourceCacheExtension"}),n.prototype={initializer:function(e){this.doBefore("_defRequestFn",this._beforeDefRequestFn),this.doBefore("_defResponseFn",this._beforeDefResponseFn)},_beforeDefRequestFn:function(t){var n=this.retrieve(t.request)||null,r=t.details[0];if(n&&n.response)return r.cached=n.cached,r.response=n.response,r.data=n.data,this.get("host").fire("response",r),new e.Do.Halt("DataSourceCache extension halted _defRequestFn")},_beforeDefResponseFn:function(e){e.response&&!e.cached&&this.add(e.request,e.response)}},e.namespace("Plugin").DataSourceCacheExtension=n,e.mix(r,{NS:"cache",NAME:"dataSourceCache"}),e.namespace("Plugin").DataSourceCache=r},"3.7.3",{requires:["datasource-local","plugin","cache-base"]});
