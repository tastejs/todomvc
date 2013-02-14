/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add("substitute",function(e,t){var n=e.Lang,r="dump",i=" ",s="{",o="}",u=/(~-(\d+)-~)/g,a=/\{LBRACE\}/g,f=/\{RBRACE\}/g,l=function(t,l,c,h){var p,d,v,m,g,y,b=[],w,E,S=t.length;for(;;){p=t.lastIndexOf(s,S);if(p<0)break;d=t.indexOf(o,p);if(p+1>=d)break;w=t.substring(p+1,d),m=w,y=null,v=m.indexOf(i),v>-1&&(y=m.substring(v+1),m=m.substring(0,v)),g=l[m],c&&(g=c(m,g,y)),n.isObject(g)?e.dump?n.isArray(g)?g=e.dump(g,parseInt(y,10)):(y=y||"",E=y.indexOf(r),E>-1&&(y=y.substring(4)),g.toString===Object.prototype.toString||E>-1?g=e.dump(g,parseInt(y,10)):g=g.toString()):g=g.toString():n.isUndefined(g)&&(g="~-"+b.length+"-~",b.push(w)),t=t.substring(0,p)+g+t.substring(d+1),h||(S=p-1)}return t.replace(u,function(e,t,n){return s+b[parseInt(n,10)]+o}).replace(a,s).replace(f,o)};e.substitute=l,n.substitute=l},"3.7.3",{requires:["yui-base"],optional:["dump"]});
