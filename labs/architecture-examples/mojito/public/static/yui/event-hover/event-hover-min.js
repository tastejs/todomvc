/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add("event-hover",function(e,t){var n=e.Lang.isFunction,r=function(){},i={processArgs:function(e){var t=n(e[2])?2:3;return n(e[t])?e.splice(t,1)[0]:r},on:function(e,t,n,r){var i=t.args?t.args.slice():[];i.unshift(null),t._detach=e[r?"delegate":"on"]({mouseenter:function(e){e.phase="over",n.fire(e)},mouseleave:function(e){var n=t.context||this;i[0]=e,e.type="hover",e.phase="out",t._extra.apply(n,i)}},r)},detach:function(e,t,n){t._detach.detach()}};i.delegate=i.on,i.detachDelegate=i.detach,e.Event.define("hover",i)},"3.7.3",{requires:["event-mouseenter"]});
