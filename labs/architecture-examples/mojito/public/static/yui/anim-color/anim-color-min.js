/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add("anim-color",function(e,t){var n=Number;e.Anim.getUpdatedColorValue=function(t,r,i,s,o){return t=e.Color.re_RGB.exec(e.Color.toRGB(t)),r=e.Color.re_RGB.exec(e.Color.toRGB(r)),(!t||t.length<3||!r||r.length<3)&&e.error("invalid from or to passed to color behavior"),"rgb("+[Math.floor(o(i,n(t[1]),n(r[1])-n(t[1]),s)),Math.floor(o(i,n(t[2]),n(r[2])-n(t[2]),s)),Math.floor(o(i,n(t[3]),n(r[3])-n(t[3]),s))].join(", ")+")"},e.Anim.behaviors.color={set:function(t,n,r,i,s,o,u){t._node.setStyle(n,e.Anim.getUpdatedColorValue(r,i,s,o,u))},get:function(e,t){var n=e._node.getComputedStyle(t);return n=n==="transparent"?"rgb(255, 255, 255)":n,n}},e.each(["backgroundColor","borderColor","borderTopColor","borderRightColor","borderBottomColor","borderLeftColor"],function(t,n){e.Anim.behaviors[t]=e.Anim.behaviors.color})},"3.7.3",{requires:["anim-base"]});
