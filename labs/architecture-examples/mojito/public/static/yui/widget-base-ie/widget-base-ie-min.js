/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add("widget-base-ie",function(e,t){var n="boundingBox",r="contentBox",i="height",s="offsetHeight",o="",u=e.UA.ie,a=u<7,f=e.Widget.getClassName("tmp","forcesize"),l=e.Widget.getClassName("content","expanded");e.Widget.prototype._uiSizeCB=function(e){var t=this.get(n),c=this.get(r),h=this._bbs;h===undefined&&(this._bbs=h=!(u&&u<8&&t.get("ownerDocument").get("compatMode")!="BackCompat")),h?c.toggleClass(l,e):e?(a&&t.addClass(f),c.set(s,t.get(s)),a&&t.removeClass(f)):c.setStyle(i,o)}},"3.7.3",{requires:["widget-base"]});
