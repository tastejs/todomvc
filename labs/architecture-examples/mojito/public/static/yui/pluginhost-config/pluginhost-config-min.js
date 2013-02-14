/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add("pluginhost-config",function(e,t){var n=e.Plugin.Host,r=e.Lang;n.prototype._initConfigPlugins=function(t){var n=this._getClasses?this._getClasses():[this.constructor],r=[],i={},s,o,u,a,f;for(o=n.length-1;o>=0;o--)s=n[o],a=s._UNPLUG,a&&e.mix(i,a,!0),u=s._PLUG,u&&e.mix(r,u,!0);for(f in r)r.hasOwnProperty(f)&&(i[f]||this.plug(r[f]));t&&t.plugins&&this.plug(t.plugins)},n.plug=function(t,n,i){var s,o,u,a;if(t!==e.Base){t._PLUG=t._PLUG||{},r.isArray(n)||(i&&(n={fn:n,cfg:i}),n=[n]);for(o=0,u=n.length;o<u;o++)s=n[o],a=s.NAME||s.fn.NAME,t._PLUG[a]=s}},n.unplug=function(t,n){var i,s,o,u;if(t!==e.Base){t._UNPLUG=t._UNPLUG||{},r.isArray(n)||(n=[n]);for(s=0,o=n.length;s<o;s++)i=n[s],u=i.NAME,t._PLUG[u]?delete t._PLUG[u]:t._UNPLUG[u]=i}}},"3.7.3",{requires:["pluginhost-base"]});
