/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add("intl",function(e,t){var n={},r="yuiRootLang",i="yuiActiveLang",s=[];e.mix(e.namespace("Intl"),{_mod:function(e){return n[e]||(n[e]={}),n[e]},setLang:function(e,t){var n=this._mod(e),s=n[i],o=!!n[t];return o&&t!==s&&(n[i]=t,this.fire("intl:langChange",{module:e,prevVal:s,newVal:t===r?"":t})),o},getLang:function(e){var t=this._mod(e)[i];return t===r?"":t},add:function(e,t,n){t=t||r,this._mod(e)[t]=n,this.setLang(e,t)},get:function(t,n,r){var s=this._mod(t),o;return r=r||s[i],o=s[r]||{},n?o[n]:e.merge(o)},getAvailableLangs:function(t){var n=e.Env._loader,r=n&&n.moduleInfo[t],i=r&&r.lang;return i?i.concat():s}}),e.augment(e.Intl,e.EventTarget),e.Intl.publish("intl:langChange",{emitFacade:!0})},"3.7.3",{requires:["intl-base","event-custom"]});
