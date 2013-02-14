/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add("querystring-parse",function(e,t){var n=e.namespace("QueryString"),r=function(t){return function r(i,s){var o,u,a,f,l;return arguments.length!==2?(i=i.split(t),r(n.unescape(i.shift()),n.unescape(i.join(t)))):(i=i.replace(/^\s+|\s+$/g,""),e.Lang.isString(s)&&(s=s.replace(/^\s+|\s+$/g,""),isNaN(s)||(u=+s,s===u.toString(10)&&(s=u))),o=/(.*)\[([^\]]*)\]$/.exec(i),o?(f=o[2],a=o[1],f?(l={},l[f]=s,r(a,l)):r(a,[s])):(l={},i&&(l[i]=s),l))}},i=function(t,n){return t?e.Lang.isArray(t)?t.concat(n):!e.Lang.isObject(t)||!e.Lang.isObject(n)?[t].concat(n):s(t,n):n},s=function(e,t){for(var n in t)n&&t.hasOwnProperty(n)&&(e[n]=i(e[n],t[n]));return e};n.parse=function(t,n,s){return e.Array.reduce(e.Array.map(t.split(n||"&"),r(s||"=")),{},i)},n.unescape=function(e){return decodeURIComponent(e.replace(/\+/g," "))}},"3.7.3",{requires:["yui-base","array-extras"]});
