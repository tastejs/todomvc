/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add("node-load",function(e,t){e.Node.prototype._ioComplete=function(t,n,r){var i=r[0],s=r[1],o,u;n&&n.responseText&&(u=n.responseText,i&&(o=e.DOM.create(u),u=e.Selector.query(i,o)),this.setContent(u)),s&&s.call(this,t,n)},e.Node.prototype.load=function(t,n,r){typeof n=="function"&&(r=n,n=null);var i={context:this,on:{complete:this._ioComplete},arguments:[n,r]};return e.io(t,i),this}},"3.7.3",{requires:["node-base","io-base"]});
