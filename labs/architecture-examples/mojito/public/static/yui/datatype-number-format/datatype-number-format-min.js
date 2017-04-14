/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add("datatype-number-format",function(e,t){var n=e.Lang;e.mix(e.namespace("Number"),{format:function(e,t){if(n.isNumber(e)){t=t||{};var r=e<0,i=e+"",s=t.decimalPlaces,o=t.decimalSeparator||".",u=t.thousandsSeparator,a,f,l,c;n.isNumber(s)&&s>=0&&s<=20&&(i=e.toFixed(s)),o!=="."&&(i=i.replace(".",o));if(u){a=i.lastIndexOf(o),a=a>-1?a:i.length,f=i.substring(a);for(l=0,c=a;c>0;c--)l%3===0&&c!==a&&(!r||c>1)&&(f=u+f),f=i.charAt(c-1)+f,l++;i=f}return i=t.prefix?t.prefix+i:i,i=t.suffix?i+t.suffix:i,i}return n.isValue(e)&&e.toString?e.toString():""}}),e.namespace("DataType"),e.DataType.Number=e.Number},"3.7.3");
