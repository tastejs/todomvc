/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add("datasource-xmlschema",function(e,t){var n=function(){n.superclass.constructor.apply(this,arguments)};e.mix(n,{NS:"schema",NAME:"dataSourceXMLSchema",ATTRS:{schema:{}}}),e.extend(n,e.Plugin.Base,{initializer:function(e){this.doBefore("_defDataFn",this._beforeDefDataFn)},_beforeDefDataFn:function(t){var n=this.get("schema"),r=t.details[0],i=e.XML.parse(t.data.responseText)||t.data;return r.response=e.DataSchema.XML.apply.call(this,n,i)||{meta:{},results:i},this.get("host").fire("response",r),new e.Do.Halt("DataSourceXMLSchema plugin halted _defDataFn")}}),e.namespace("Plugin").DataSourceXMLSchema=n},"3.7.3",{requires:["datasource-local","plugin","datatype-xml","dataschema-xml"]});
