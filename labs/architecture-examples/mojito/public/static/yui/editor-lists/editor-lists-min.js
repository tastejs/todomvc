/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add("editor-lists",function(e,t){var n=function(){n.superclass.constructor.apply(this,arguments)},r="li",i="ol",s="ul",o="host";e.extend(n,e.Base,{_onNodeChange:function(t){var u=this.get(o).getInstance(),a,f,l,c,h=!1,p,d=!1;t.changedType==="tab"&&(t.changedNode.test(r+", "+r+" *")&&(t.changedEvent.halt(),t.preventDefault(),a=t.changedNode,l=t.changedEvent.shiftKey,c=a.ancestor(i+","+s),p=s,c.get("tagName").toLowerCase()===i&&(p=i),a.test(r)||(a=a.ancestor(r)),l?a.ancestor(r)&&(a.ancestor(r).insert(a,"after"),h=!0,d=!0):a.previous(r)&&(f=u.Node.create("<"+p+"></"+p+">"),a.previous(r).append(f),f.append(a),h=!0)),h&&(a.test(r)||(a=a.ancestor(r)),a.all(n.REMOVE).remove(),e.UA.ie&&(a=a.append(n.NON).one(n.NON_SEL)),(new u.EditorSelection).selectNode(a,!0,d)))},initializer:function(){this.get(o).on("nodeChange",e.bind(this._onNodeChange,this))}},{NON:'<span class="yui-non">&nbsp;</span>',NON_SEL:"span.yui-non",REMOVE:"br",NAME:"editorLists",NS:"lists",ATTRS:{host:{value:!1}}}),e.namespace("Plugin"),e.Plugin.EditorLists=n},"3.7.3",{requires:["editor-base"]});
