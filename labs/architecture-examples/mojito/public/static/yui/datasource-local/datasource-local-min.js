/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add("datasource-local",function(e,t){var n=e.Lang,r=function(){r.superclass.constructor.apply(this,arguments)};e.mix(r,{NAME:"dataSourceLocal",ATTRS:{source:{value:null}},_tId:0,transactions:{},issueCallback:function(e,t){var n=e.on||e.callback,r=n&&n.success,i=e.details[0];i.error=e.error||e.response.error,i.error&&(t.fire("error",i),r=n&&n.failure),r&&r(i)}}),e.extend(r,e.Base,{initializer:function(e){this._initEvents()},_initEvents:function(){this.publish("request",{defaultFn:e.bind("_defRequestFn",this),queuable:!0}),this.publish("data",{defaultFn:e.bind("_defDataFn",this),queuable:!0}),this.publish("response",{defaultFn:e.bind("_defResponseFn",this),queuable:!0})},_defRequestFn:function(e){var t=this.get("source"),r=e.details[0];n.isUndefined(t)&&(r.error=new Error("Local source undefined")),r.data=t,this.fire("data",r)},_defDataFn:function(e){var t=e.data,r=e.meta,i={results:n.isArray(t)?t:[t],meta:r?r:{}},s=e.details[0];s.response=i,this.fire("response",s)},_defResponseFn:function(e){r.issueCallback(e,this)},sendRequest:function(e){var t=r._tId++,n;return e=e||{},n=e.on||e.callback,this.fire("request",{tId:t,request:e.request,on:n,callback:n,cfg:e.cfg||{}}),t}}),e.namespace("DataSource").Local=r},"3.7.3",{requires:["base"]});
