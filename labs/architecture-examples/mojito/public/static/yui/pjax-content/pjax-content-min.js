/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add("pjax-content",function(e,t){function n(){}n.prototype={getContent:function(t){var n={},r=this.get("contentSelector"),i=e.Node.create(t||""),s=this.get("titleSelector"),o;return r?n.node=i.all(r).toFrag():n.node=i,s&&(o=i.one(s),o&&(n.title=o.get("text"))),n},loadContent:function(t,n,r){var i=t.url;this._request&&this._request.abort(),this.get("addPjaxParam")&&(i=i.replace(/([^#]*)(#.*)?$/,function(e,t,n){return t+=(t.indexOf("?")>-1?"&":"?")+"pjax=1",t+(n||"")})),this._request=e.io(i,{arguments:{route:{req:t,res:n,next:r},url:i},context:this,headers:{"X-PJAX":"true"},timeout:this.get("timeout"),on:{complete:this._onPjaxIOComplete,end:this._onPjaxIOEnd}})},_onPjaxIOComplete:function(e,t,n){var r=this.getContent(t.responseText),i=n.route,s=i.req,o=i.res;s.ioURL=n.url,o.content=r,o.ioResponse=t,i.next()},_onPjaxIOEnd:function(){this._request=null}},n.ATTRS={addPjaxParam:{value:!0},contentSelector:{value:null},titleSelector:{value:"title"},timeout:{value:3e4}},e.PjaxContent=n},"3.7.3",{requires:["io-base","node-base","router"]});
