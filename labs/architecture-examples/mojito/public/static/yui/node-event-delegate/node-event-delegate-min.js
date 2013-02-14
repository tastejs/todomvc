/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add("node-event-delegate",function(e,t){e.Node.prototype.delegate=function(t){var n=e.Array(arguments,0,!0),r=e.Lang.isObject(t)&&!e.Lang.isArray(t)?1:2;return n.splice(r,0,this._node),e.delegate.apply(e,n)}},"3.7.3",{requires:["node-base","event-delegate"]});
