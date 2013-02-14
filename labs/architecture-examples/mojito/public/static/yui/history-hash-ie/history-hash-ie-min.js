/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add("history-hash-ie",function(e,t){if(e.UA.ie&&!e.HistoryBase.nativeHashChange){var n=e.Do,r=YUI.namespace("Env.HistoryHash"),i=e.HistoryHash,s=r._iframe,o=e.config.win;i.getIframeHash=function(){if(!s||!s.contentWindow)return"";var e=i.hashPrefix,t=s.contentWindow.location.hash.substr(1);return e&&t.indexOf(e)===0?t.replace(e,""):t},i._updateIframe=function(e,t){var n=s&&s.contentWindow&&s.contentWindow.document,r=n&&n.location;if(!n||!r)return;t?r.replace(e.charAt(0)==="#"?e:"#"+e):(n.open().close(),r.hash=e)},n.before(i._updateIframe,i,"replaceHash",i,!0),s||e.on("domready",function(){var t=i.getHash();s=r._iframe=e.Node.getDOMNode(e.Node.create('<iframe src="javascript:0" style="display:none" height="0" width="0" tabindex="-1" title="empty"/>')),e.config.doc.documentElement.appendChild(s),i._updateIframe(t||"#"),e.on("hashchange",function(e){t=e.newHash,i.getIframeHash()!==t&&i._updateIframe(t)},o),e.later(50,null,function(){var e=i.getIframeHash();e!==t&&i.setHash(e)},null,!0)})}},"3.7.3",{requires:["history-hash","node-base"]});
