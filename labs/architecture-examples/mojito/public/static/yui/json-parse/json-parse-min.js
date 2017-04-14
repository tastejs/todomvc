/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add("json-parse",function(e,t){function n(t){var n=typeof global=="object"?global:undefined;return(e.UA.nodejs&&n?n:e.config.win||{})[t]}function d(e,t){return e==="ok"?!0:t}var r=n("JSON"),i=Object.prototype.toString.call(r)==="[object JSON]"&&r,s=!!i,o=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,u=/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,a=/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,f=/(?:^|:|,)(?:\s*\[)+/g,l=/[^\],:{}\s]/,c=function(e){return"\\u"+("0000"+(+e.charCodeAt(0)).toString(16)).slice(-4)},h=function(e,t){var n=function(e,r){var i,s,o=e[r];if(o&&typeof o=="object")for(i in o)o.hasOwnProperty(i)&&(s=n(o,i),s===undefined?delete o[i]:o[i]=s);return t.call(e,r,o)};return typeof t=="function"?n({"":e},""):e},p=function(e,t){e=e.replace(o,c);if(!l.test(e.replace(u,"@").replace(a,"]").replace(f,"")))return h(eval("("+e+")"),t);throw new SyntaxError("JSON.parse")};e.namespace("JSON").parse=function(t,n){return typeof t!="string"&&(t+=""),i&&e.JSON.useNativeParse?i.parse(t,n):p(t,n)};if(i)try{s=i.parse('{"ok":false}',d).ok}catch(v){s=!1}e.JSON.useNativeParse=s},"3.7.3",{requires:["yui-base"]});
