/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add("swfdetect",function(e,t){function c(e){return parseInt(e,10)}function h(e){i.isNumber(c(e[0]))&&(r.flashMajor=e[0]),i.isNumber(c(e[1]))&&(r.flashMinor=e[1]),i.isNumber(c(e[2]))&&(r.flashRev=e[2])}var n=0,r=e.UA,i=e.Lang,s="ShockwaveFlash",o,u,a,f,l;if(r.gecko||r.webkit||r.opera){if(o=navigator.mimeTypes["application/x-shockwave-flash"])if(u=o.enabledPlugin)a=u.description.replace(/\s[rd]/g,".").replace(/[A-Za-z\s]+/g,"").split("."),h(a)}else if(r.ie){try{f=new ActiveXObject(s+"."+s+".6"),f.AllowScriptAccess="always"}catch(p){f!==null&&(n=6)}if(n===0)try{l=new ActiveXObject(s+"."+s),a=l.GetVariable("$version").replace(/[A-Za-z\s]+/g,"").split(","),h(a)}catch(d){}}e.SWFDetect={getFlashVersion:function(){return String(r.flashMajor)+"."+String(r.flashMinor)+"."+String(r.flashRev)},isFlashVersionAtLeast:function(e,t,n){var i=c(r.flashMajor),s=c(r.flashMinor),o=c(r.flashRev);return e=c(e||0),t=c(t||0),n=c(n||0),e===i?t===s?n<=o:t<s:e<i}}},"3.7.3",{requires:["yui-base"]});
