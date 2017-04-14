/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add("datasource-textschema",function(e,t){var n=function(){n.superclass.constructor.apply(this,arguments)};e.mix(n,{NS:"schema",NAME:"dataSourceTextSchema",ATTRS:{schema:{}}}),e.extend(n,e.Plugin.Base,{initializer:function(e){this.doBefore("_defDataFn",this._beforeDefDataFn)},_beforeDefDataFn:function(t){var n=this.get("schema"),r=t.details[0],i=t.data.responseText||t.data;return r.response=e.DataSchema.Text.apply.call(this,n,i)||{meta:{},results:i},this.get("host").fire("response",r),new e.Do.Halt("DataSourceTextSchema plugin halted _defDataFn")}}),e.namespace("Plugin").DataSourceTextSchema=n},"3.7.3",{requires:["datasource-local","plugin","dataschema-text"]});
