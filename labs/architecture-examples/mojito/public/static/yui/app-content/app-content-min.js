/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add("app-content",function(e,t){function r(){n.apply(this,arguments)}var n=e.PjaxContent;r.route=["loadContent","_contentRoute"],r.prototype={showContent:function(t,n,r){t=e.one(t),typeof n=="function"&&(n={callback:n},r=null),n=e.merge({render:!1},n);var i=n.view||"",s=typeof i=="string"?i:i.name,o=typeof i!="string"?i.config:{},u=this.getViewInfo(s),a,f,l,c;return delete n.view,t&&t.isFragment()&&t.get("childNodes").size()===1&&(t=t.get("firstChild")),t&&t.get("nodeType")===1?a=t:(l=u&&u.type||e.View,c=typeof l=="string"?e.Object.getValue(e,l.split(".")):l,f=c.prototype.containerTemplate,a=e.Node.create(f),a.append(t)),o=e.merge(o,{container:a}),this.showView(s,o,n,r)},_contentRoute:function(t,n,r){var i=n.content,s=e.config.doc,o;if(!i||!i.node)return r();i.title&&s&&(o=this.onceAfter("activeViewChange",function(){s.title=i.title})),this.showContent(i.node),o&&o.detach(),r()}},e.mix(r,n),e.mix(r,n,!1,null,1),e.App.Content=r,e.Base.mix(e.App,[r])},"3.7.3",{requires:["app-base","pjax-content"]});
