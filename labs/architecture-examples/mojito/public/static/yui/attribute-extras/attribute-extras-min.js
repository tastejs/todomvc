/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add("attribute-extras",function(e,t){function o(){}var n="broadcast",r="published",i="initValue",s={readOnly:1,writeOnce:1,getter:1,broadcast:1};o.prototype={modifyAttr:function(e,t){var i=this,o,u;if(i.attrAdded(e)){i._isLazyAttr(e)&&i._addLazyAttr(e),u=i._state;for(o in t)s[o]&&t.hasOwnProperty(o)&&(u.add(e,o,t[o]),o===n&&u.remove(e,r))}},removeAttr:function(e){this._state.removeAll(e)},reset:function(t){var n=this;return t?(n._isLazyAttr(t)&&n._addLazyAttr(t),n.set(t,n._state.get(t,i))):e.each(n._state.data,function(e,t){n.reset(t)}),n},_getAttrCfg:function(t){var n,r=this._state;return t?n=r.getAll(t)||{}:(n={},e.each(r.data,function(e,t){n[t]=r.getAll(t)})),n}},e.AttributeExtras=o},"3.7.3",{requires:["oop"]});
