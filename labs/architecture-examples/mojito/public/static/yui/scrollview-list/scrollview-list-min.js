/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add("scrollview-list",function(e,t){function l(){l.superclass.constructor.apply(this,arguments)}var n=e.ClassNameManager.getClassName,r="scrollview",i=n(r,"list"),s=n(r,"item"),o="contentBox",u="rendered",a="renderUI",f="host";l.NAME="pluginList",l.NS="list",l.ATTRS={isAttached:{value:!1,validator:e.Lang.isBoolean}},e.namespace("Plugin").ScrollViewList=e.extend(l,e.Plugin.Base,{initializer:function(){this._host=this.get(f),this.afterHostEvent("render",this._addClassesToList)},_addClassesToList:function(){if(!this.get("isAttached")){var e=this._host.get(o),t,n;e.hasChildNodes()&&(t=e.all("> ul"),n=e.all("> ul > li"),t.each(function(e){e.addClass(i)}),n.each(function(e){e.addClass(s)}),this.set("isAttached",!0),this._host.syncUI())}}})},"3.7.3",{requires:["plugin","classnamemanager"],skinnable:!0});
