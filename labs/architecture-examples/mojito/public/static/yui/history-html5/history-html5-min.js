/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add("history-html5",function(e,t){function a(){a.superclass.constructor.apply(this,arguments)}var n=e.HistoryBase,r=e.Lang,i=e.config.win,s=e.config.useHistoryHTML5,o="popstate",u=n.SRC_REPLACE;e.extend(a,n,{_init:function(t){var n=i.history.state;e.Object.isEmpty(n)&&(n=null),t||(t={}),t.initialState&&r.type(t.initialState)==="object"&&r.type(n)==="object"?this._initialState=e.merge(t.initialState,n):this._initialState=n,e.on("popstate",this._onPopState,i,this),a.superclass._init.apply(this,arguments)},_storeState:function(t,n,r){t!==o&&i.history[t===u?"replaceState":"pushState"](n,r.title||e.config.doc.title||"",r.url||null),a.superclass._storeState.apply(this,arguments)},_onPopState:function(e){this._resolveChanges(o,e._event.state||null)}},{NAME:"historyhtml5",SRC_POPSTATE:o}),e.Node.DOM_EVENTS.popstate||(e.Node.DOM_EVENTS.popstate=1),e.HistoryHTML5=a;if(s===!0||s!==!1&&n.html5)e.History=a},"3.7.3",{optional:["json"],requires:["event-base","history-base","node-base"]});
