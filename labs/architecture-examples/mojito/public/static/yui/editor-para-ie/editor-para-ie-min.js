/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add("editor-para-ie",function(e,t){var n=function(){n.superclass.constructor.apply(this,arguments)},r="host",i="nodeChange",s="p";e.extend(n,e.Plugin.EditorParaBase,{_onNodeChange:function(e){var t=this.get(r),n=t.getInstance(),i=n.EditorSelection.DEFAULT_BLOCK_TAG,o,u=":last-child",a,f,l,c,h,p=!1;switch(e.changedType){case"enter-up":a=this._lastPara?this._lastPara:e.changedNode,f=a.one("br.yui-cursor"),this._lastPara&&delete this._lastPara,f&&(f.previous()||f.next())&&f.ancestor(s)&&f.remove(),a.test(i)||(l=a.ancestor(i),l&&(a=l,l=null));if(a.test(i)){o=a.previous();if(o){c=o.one(u);while(!p)c?(h=c.one(u),h?c=h:p=!0):p=!0;c&&t.copyStyles(c,a)}}break;case"enter":e.changedNode.test("br")?e.changedNode.remove():e.changedNode.test("p, span")&&(f=e.changedNode.one("br.yui-cursor"),f&&f.remove())}},initializer:function(){var t=this.get(r);if(t.editorBR){e.error("Can not plug EditorPara and EditorBR at the same time.");return}t.on(i,e.bind(this._onNodeChange,this))}},{NAME:"editorPara",NS:"editorPara",ATTRS:{host:{value:!1}}}),e.namespace("Plugin"),e.Plugin.EditorPara=n},"3.7.3",{requires:["editor-para-base"]});
