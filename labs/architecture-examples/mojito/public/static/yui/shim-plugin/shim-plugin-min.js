/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add("shim-plugin",function(e,t){function n(e){this.init(e)}n.CLASS_NAME="yui-node-shim",n.TEMPLATE='<iframe class="'+n.CLASS_NAME+'" frameborder="0" title="Node Stacking Shim"'+'src="javascript:false" tabindex="-1" role="presentation"'+'style="position:absolute; z-index:-1;"></iframe>',n.prototype={init:function(e){this._host=e.host,this.initEvents(),this.insert(),this.sync()},initEvents:function(){this._resizeHandle=this._host.on("resize",this.sync,this)},getShim:function(){return this._shim||(this._shim=e.Node.create(n.TEMPLATE,this._host.get("ownerDocument")))},insert:function(){var e=this._host;this._shim=e.insertBefore(this.getShim(),e.get("firstChild"))},sync:function(){var e=this._shim,t=this._host;e&&e.setAttrs({width:t.getStyle("width"),height:t.getStyle("height")})},destroy:function(){var e=this._shim;e&&e.remove(!0),this._resizeHandle.detach()}},n.NAME="Shim",n.NS="shim",e.namespace("Plugin"),e.Plugin.Shim=n},"3.7.3",{requires:["node-style","node-pluginhost"]});
