/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add("button-plugin",function(e,t){function n(e){n.superclass.constructor.apply(this,arguments)}e.extend(n,e.ButtonCore,{_afterNodeGet:function(t){var n=this.constructor.ATTRS,r=n[t]&&n[t].getter&&this[n[t].getter];if(r)return new e.Do.AlterReturn("get "+t,r.call(this))},_afterNodeSet:function(e,t){var n=this.constructor.ATTRS,r=n[e]&&n[e].setter&&this[n[e].setter];r&&r.call(this,t)},_initNode:function(t){var n=t.host;this._host=n,e.Do.after(this._afterNodeGet,n,"get",this),e.Do.after(this._afterNodeSet,n,"set",this)},destroy:function(){}},{ATTRS:e.merge(e.ButtonCore.ATTRS),NAME:"buttonPlugin",NS:"button"}),n.createNode=function(t,n){var r;return t&&!n&&!t.nodeType&&!t.getDOMNode&&typeof t!="string"&&(n=t,t=n.srcNode),n=n||{},r=n.template||e.Plugin.Button.prototype.TEMPLATE,t=t||n.srcNode||e.DOM.create(r),e.one(t).plug(e.Plugin.Button,n)},e.namespace("Plugin").Button=n},"3.7.3",{requires:["button-core","cssbutton","node-pluginhost"]});
