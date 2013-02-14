/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add("yql-nodejs",function(e,t){var n=require("request");e.YQLRequest.prototype._send=function(e,t){n(e,{method:"GET",timeout:t.timeout||3e4},function(e,n){e?t.on.success({error:e}):t.on.success(JSON.parse(n.body))})}},"3.7.3");
