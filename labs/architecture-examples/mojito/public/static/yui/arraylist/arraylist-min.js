/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add("arraylist",function(e,t){function s(t){t!==undefined?this._items=e.Lang.isArray(t)?t:n(t):this._items=this._items||[]}var n=e.Array,r=n.each,i;i={item:function(e){return this._items[e]},each:function(e,t){return r(this._items,function(n,r){n=this.item(r),e.call(t||n,n,r,this)},this),this},some:function(e,t){return n.some(this._items,function(n,r){return n=this.item(r),e.call(t||n,n,r,this)},this)},indexOf:function(e){return n.indexOf(this._items,e)},size:function(){return this._items.length},isEmpty:function(){return!this.size()},toJSON:function(){return this._items}},i._item=i.item,e.mix(s.prototype,i),e.mix(s,{addMethod:function(e,t){t=n(t),r(t,function(t){e[t]=function(){var e=n(arguments,0,!0),i=[];return r(this._items,function(n,r){n=this._item(r);var s=n[t].apply(n,e);s!==undefined&&s!==n&&(i[r]=s)},this),i.length?i:this}})}}),e.ArrayList=s},"3.7.3",{requires:["yui-base"]});
