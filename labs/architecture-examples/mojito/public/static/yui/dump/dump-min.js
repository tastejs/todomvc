/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add("dump",function(e,t){var n=e.Lang,r="{...}",i="f(){...}",s=", ",o=" => ",u=function(e,t){var u,a,f=[],l=n.type(e);if(!n.isObject(e))return e+"";if(l=="date")return e;if(e.nodeType&&e.tagName)return e.tagName+"#"+e.id;if(e.document&&e.navigator)return"window";if(e.location&&e.body)return"document";if(l=="function")return i;t=n.isNumber(t)?t:3;if(l=="array"){f.push("[");for(u=0,a=e.length;u<a;u+=1)n.isObject(e[u])?f.push(t>0?n.dump(e[u],t-1):r):f.push(e[u]),f.push(s);f.length>1&&f.pop(),f.push("]")}else if(l=="regexp")f.push(e.toString());else{f.push("{");for(u in e)if(e.hasOwnProperty(u))try{f.push(u+o),n.isObject(e[u])?f.push(t>0?n.dump(e[u],t-1):r):f.push(e[u]),f.push(s)}catch(c){f.push("Error: "+c.message)}f.length>1&&f.pop(),f.push("}")}return f.join("")};e.dump=u,n.dump=u},"3.7.3",{requires:["yui-base"]});
