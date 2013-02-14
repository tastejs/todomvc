/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add("datasource-io",function(e,t){var n=function(){n.superclass.constructor.apply(this,arguments)};e.mix(n,{NAME:"dataSourceIO",ATTRS:{io:{value:e.io,cloneDefaultValue:!1},ioConfig:{value:null}}}),e.extend(n,e.DataSource.Local,{initializer:function(e){this._queue={interval:null,conn:null,requests:[]}},successHandler:function(t,n,r){var i=this.get("ioConfig"),s=r.details[0];delete e.DataSource.Local.transactions[r.tId],s.data=n,this.fire("data",s),i&&i.on&&i.on.success&&i.on.success.apply(i.context||e,arguments)},failureHandler:function(t,n,r){var i=this.get("ioConfig"),s=r.details[0];delete e.DataSource.Local.transactions[r.tId],s.error=new Error("IO data failure"),s.data=n,this.fire("data",s),i&&i.on&&i.on.failure&&i.on.failure.apply(i.context||e,arguments)},_queue:null,_defRequestFn:function(t){var n=this.get("source"),r=this.get("io"),i=this.get("ioConfig"),s=t.request,o=e.merge(i,t.cfg,{on:e.merge(i,{success:this.successHandler,failure:this.failureHandler}),context:this,arguments:t});return e.Lang.isString(s)&&(o.method&&o.method.toUpperCase()==="POST"?o.data=o.data?o.data+s:s:n+=s),e.DataSource.Local.transactions[t.tId]=r(n,o),t.tId}}),e.DataSource.IO=n},"3.7.3",{requires:["datasource-local","io-base"]});
