/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add("pjax",function(e,t){var n=["loadContent","_defaultRoute"],r="error",i="load";e.Pjax=e.Base.create("pjax",e.Router,[e.PjaxBase,e.PjaxContent],{initializer:function(){this.publish(r,{defaultFn:this._defCompleteFn}),this.publish(i,{defaultFn:this._defCompleteFn})},_defaultRoute:function(e,t,n){var s=t.ioResponse,o=s.status,u=o>=200&&o<300?i:r;this.fire(u,{content:t.content,responseText:s.responseText,status:o,url:e.ioURL}),n()},_defCompleteFn:function(t){var n=this.get("container"),r=t.content;n&&r.node&&n.setHTML(r.node),r.title&&e.config.doc&&(e.config.doc.title=r.title)}},{ATTRS:{container:{value:null,setter:e.one},routes:{value:[{path:"*",callbacks:n}]}},defaultRoute:n})},"3.7.3",{requires:["pjax-base","pjax-content"]});
