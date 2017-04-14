/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add("highlight-accentfold",function(e,t){var n=e.Text.AccentFold,r=e.Escape,i={},s=e.mix(e.Highlight,{allFold:function(t,o,u){var a=s._TEMPLATE,f=[],l=0,c,h,p,d,v;u=e.merge({escapeHTML:!1,replacer:function(e,n,r,i){var s;if(n&&!/\s/.test(r))return e;s=r.length,f.push([t.substring(l,i),t.substr(i,s)]),l=i+s}},u||i),s.all(n.fold(t),n.fold(o),u),l<t.length&&f.push([t.substr(l)]);for(h=0,p=f.length;h<p;++h){c=r.html(f[h][0]);if(d=f[h][1])c+=a.replace(/\{s\}/g,r.html(d));f[h]=c}return f.join("")},startFold:function(e,t){return s.allFold(e,t,{startsWith:!0})},wordsFold:function(e,t){var i=s._TEMPLATE;return s.words(e,n.fold(t),{mapper:function(e,t){return t.hasOwnProperty(n.fold(e))?i.replace(/\{s\}/g,r.html(e)):r.html(e)}})}})},"3.7.3",{requires:["highlight-base","text-accentfold"]});
