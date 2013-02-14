/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add("attribute-events",function(e,t){function o(){this._ATTR_E_FACADE={},n.call(this,{emitFacade:!0})}var n=e.EventTarget,r="Change",i="broadcast",s="published";o._ATTR_CFG=[i],o.prototype={set:function(e,t,n){return this._setAttr(e,t,n)},_set:function(e,t,n){return this._setAttr(e,t,n,!0)},setAttrs:function(e,t){return this._setAttrs(e,t)},_setAttrs:function(e,t){var n;for(n in e)e.hasOwnProperty(n)&&this.set(n,e[n],t);return this},_fireAttrChange:function(t,n,o,u,a){var f=this,l=t+r,c=f._state,h,p,d;c.get(t,s)||(d={queuable:!1,defaultTargetOnly:!0,defaultFn:f._defAttrChangeFn,silent:!0},p=c.get(t,i),p!==undefined&&(d.broadcast=p),f.publish(l,d),c.add(t,s,!0)),h=a?e.merge(a):f._ATTR_E_FACADE,h.attrName=t,h.subAttrName=n,h.prevVal=o,h.newVal=u,f.fire(l,h)},_defAttrChangeFn:function(e){this._setAttrVal(e.attrName,e.subAttrName,e.prevVal,e.newVal)?e.newVal=this.get(e.attrName):e.stopImmediatePropagation()}},e.mix(o,n,!1,null,1),e.AttributeEvents=o},"3.7.3",{requires:["event-custom"]});
