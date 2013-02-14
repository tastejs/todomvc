/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add("pluginhost-base",function(e,t){function r(){this._plugins={}}var n=e.Lang;r.prototype={plug:function(e,t){var r,i,s;if(n.isArray(e))for(r=0,i=e.length;r<i;r++)this.plug(e[r]);else e&&!n.isFunction(e)&&(t=e.cfg,e=e.fn),e&&e.NS&&(s=e.NS,t=t||{},t.host=this,this.hasPlugin(s)?this[s].setAttrs&&this[s].setAttrs(t):(this[s]=new e(t),this._plugins[s]=e));return this},unplug:function(e){var t=e,r=this._plugins;if(e)n.isFunction(e)&&(t=e.NS,t&&(!r[t]||r[t]!==e)&&(t=null)),t&&(this[t]&&(this[t].destroy&&this[t].destroy(),delete this[t]),r[t]&&delete r[t]);else for(t in this._plugins)this._plugins.hasOwnProperty(t)&&this.unplug(t);return this},hasPlugin:function(e){return this._plugins[e]&&this[e]},_initPlugins:function(e){this._plugins=this._plugins||{},this._initConfigPlugins&&this._initConfigPlugins(e)},_destroyPlugins:function(){this.unplug()}},e.namespace("Plugin").Host=r},"3.7.3",{requires:["yui-base"]});
