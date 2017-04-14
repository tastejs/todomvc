/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add("datasource-arrayschema",function(e,t){var n=function(){n.superclass.constructor.apply(this,arguments)};e.mix(n,{NS:"schema",NAME:"dataSourceArraySchema",ATTRS:{schema:{}}}),e.extend(n,e.Plugin.Base,{initializer:function(e){this.doBefore("_defDataFn",this._beforeDefDataFn)},_beforeDefDataFn:function(t){var n=e.DataSource.IO&&this.get("host")instanceof e.DataSource.IO&&e.Lang.isString(t.data.responseText)?t.data.responseText:t.data,r=e.DataSchema.Array.apply.call(this,this.get("schema"),n),i=t.details[0];return r||(r={meta:{},results:n}),i.response=r,this.get("host").fire("response",i),new e.Do.Halt("DataSourceArraySchema plugin halted _defDataFn")}}),e.namespace("Plugin").DataSourceArraySchema=n},"3.7.3",{requires:["datasource-local","plugin","dataschema-array"]});
