/*
YUI 3.7.3 (build 5687)
Copyright 2012 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/
YUI.add("datatype-date-parse",function(e,t){var n=e.Lang;e.mix(e.namespace("Date"),{parse:function(e){var t=null;return n.isDate(e)?t:(t=new Date(e),n.isDate(t)&&t!="Invalid Date"&&!isNaN(t)?t:null)}}),e.namespace("Parsers").date=e.Date.parse,e.namespace("DataType"),e.DataType.Date=e.Date},"3.7.3");
