/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add("event-key",function(e,t){var n="+alt",r="+ctrl",i="+meta",s="+shift",o=e.Lang.trim,u={KEY_MAP:{enter:13,esc:27,backspace:8,tab:9,pageup:33,pagedown:34},_typeRE:/^(up|down|press):/,_keysRE:/^(?:up|down|press):|\+(alt|ctrl|meta|shift)/g,processArgs:function(t){var n=t.splice(3,1)[0],r=e.Array.hash(n.match(/\+(?:alt|ctrl|meta|shift)\b/g)||[]),i={type:this._typeRE.test(n)?RegExp.$1:null,mods:r,keys:null},s=n.replace(this._keysRE,""),u,a,f,l;if(s){s=s.split(","),i.keys={};for(l=s.length-1;l>=0;--l){u=o(s[l]);if(!u)continue;+u==u?i.keys[u]=r:(f=u.toLowerCase(),this.KEY_MAP[f]?(i.keys[this.KEY_MAP[f]]=r,i.type||(i.type="down")):(u=u.charAt(0),a=u.toUpperCase(),r["+shift"]&&(u=a),i.keys[u.charCodeAt(0)]=u===a?e.merge(r,{"+shift":!0}):r))}}return i.type||(i.type="press"),i},on:function(e,t,o,u){var a=t._extra,f="key"+a.type,l=a.keys,c=u?"delegate":"on";t._detach=e[c](f,function(e){var t=l?l[e.which]:a.mods;t&&(!t[n]||t[n]&&e.altKey)&&(!t[r]||t[r]&&e.ctrlKey)&&(!t[i]||t[i]&&e.metaKey)&&(!t[s]||t[s]&&e.shiftKey)&&o.fire(e)},u)},detach:function(e,t,n){t._detach.detach()}};u.delegate=u.on,u.detachDelegate=u.detach,e.Event.define("key",u,!0)},"3.7.3",{requires:["event-synthetic"]});
