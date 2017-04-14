/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add("datasource-jsonschema",function(e,t){var n=function(){n.superclass.constructor.apply(this,arguments)};e.mix(n,{NS:"schema",NAME:"dataSourceJSONSchema",ATTRS:{schema:{}}}),e.extend(n,e.Plugin.Base,{initializer:function(e){this.doBefore("_defDataFn",this._beforeDefDataFn)},_beforeDefDataFn:function(t){var n=t.data&&(t.data.responseText||t.data),r=this.get("schema"),i=t.details[0];return i.response=e.DataSchema.JSON.apply.call(this,r,n)||{meta:{},results:n},this.get("host").fire("response",i),new e.Do.Halt("DataSourceJSONSchema plugin halted _defDataFn")}}),e.namespace("Plugin").DataSourceJSONSchema=n},"3.7.3",{requires:["datasource-local","plugin","dataschema-json"]});
