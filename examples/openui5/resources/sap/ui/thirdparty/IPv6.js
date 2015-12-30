/*!
 * URI.js - Mutating URLs
 * IPv6 Support
 *
 * Version: 1.11.2
 *
 * Author: Rodney Rehm
 * Web: http://medialize.github.com/URI.js/
 *
 * Licensed under
 *   MIT License http://www.opensource.org/licenses/mit-license
 *   GPL v3 http://opensource.org/licenses/GPL-3.0
 *
 */
(function(r,f){if(typeof exports==='object'){module.exports=f();}else if(typeof define==='function'&&define.amd){define(f);}else{r.IPv6=f(r);}}(this,function(r){"use strict";var _=r&&r.IPv6;function b(a){var c=a.toLowerCase();var s=c.split(':');var l=s.length;var t=8;if(s[0]===''&&s[1]===''&&s[2]===''){s.shift();s.shift();}else if(s[0]===''&&s[1]===''){s.shift();}else if(s[l-1]===''&&s[l-2]===''){s.pop();}l=s.length;if(s[l-1].indexOf('.')!==-1){t=7;}var p;for(p=0;p<l;p++){if(s[p]===''){break;}}if(p<t){s.splice(p,1,'0000');while(s.length<t){s.splice(p,0,'0000');}l=s.length;}var d;for(var i=0;i<t;i++){d=s[i].split("");for(var j=0;j<3;j++){if(d[0]==='0'&&d.length>1){d.splice(0,1);}else{break;}}s[i]=d.join("");}var b=-1;var e=0;var f=0;var g=-1;var h=false;for(i=0;i<t;i++){if(h){if(s[i]==='0'){f+=1;}else{h=false;if(f>e){b=g;e=f;}}}else{if(s[i]=='0'){h=true;g=i;f=1;}}}if(f>e){b=g;e=f;}if(e>1){s.splice(b,e,"");}l=s.length;var k='';if(s[0]===''){beststr=":";}for(i=0;i<l;i++){k+=s[i];if(i===l-1){break;}k+=':';}if(s[l-1]===''){k+=":";}return k;};function n(){if(r.IPv6===this){r.IPv6=_;}return this;};return{best:b,noConflict:n};}));
