//
//  ____  _                           _
// / ___|| |_ __ _ _ __   ___  ___   (_)___  (*)
// \___ \| __/ _` | '_ \ / _ \/ __|  | / __|
//  ___) | || (_| | |_) |  __/\__ \_ | \__ \
// |____/ \__\__,_| .__/ \___||___(_)/ |___/
//              |_|              |__/
//
// (*) a (really) tiny Javascript MVC microframework
//
// (c) Hay Kranen < hay@bykr.org >
// Released under the terms of the MIT license
// < http://en.wikipedia.org/wiki/MIT_License >
//
// Stapes.js : http://hay.github.com/stapes
(function(){function j(a,b,d){var f={},i;"string"===typeof a?(i=d||!1,f[a]=b):(i=b||!1,f=a);c.each(f,c.bind(function(a,b){var d=b.split(" ");c.each(d,c.bind(function(b){var d=this._guid,c=i;e._eventHandlers[d][b]||(e._eventHandlers[d][b]=[]);e._eventHandlers[d][b].push({guid:d,handler:a,scope:c,type:b})},this))},this))}function h(a,b,d,f){d=d||!1;f=f||this._guid;c.each(e._eventHandlers[f][a],c.bind(function(a){var c=a.scope?a.scope:this;d&&(a.type=d);a.scope=c;a.handler.call(a.scope,b,a)},this))}
function g(a,b){var d=this.has(a),c=e._attributes[this._guid][a];b!==c&&(e._attributes[this._guid][a]=b,this.emit("change",a),this.emit("change:"+a,b),c={key:a,newValue:b,oldValue:c||null},this.emit("mutate",c),this.emit("mutate:"+a,c),d=d?"update":"create",this.emit(d,a),this.emit(d+":"+a,b))}function k(a,b){var d=this.get(a),d=b(c.clone(d));g.call(this,a,d)}var c={bind:function(a,b){return Function.prototype.bind?a.bind(b):function(){return a.apply(b,arguments)}},clone:function(a){if(c.isArray(a))return a.slice();
if(c.isObject(a)){var b={};c.each(a,function(a,c){b[c]=a});return b}return a},create:function(a){if("function"===typeof Object.create)a=Object.create(a);else{var b=function(){};b.prototype=a;a=new b}a._guid=m++;e._attributes[a._guid]={};e._eventHandlers[a._guid]={};return a},each:function(a,b){if(c.isArray(a))if(Array.prototype.forEach)a.forEach(b);else for(var d=0,e=a.length;d<e;d++)b(a[d],d);else for(d in a)b(a[d],d)},isArray:function(a){return"[object Array]"===Object.prototype.toString.call(a)},
isObject:function(a){return"object"===typeof a&&!c.isArray(a)&&null!==a},makeUuid:function(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(a){var b=16*Math.random()|0;return("x"==a?b:b&3|8).toString(16)})},toArray:function(a){return c.isObject(a)?c.values(a):Array.prototype.slice.call(a,0)},values:function(a){var b=[];c.each(a,function(a){b.push(a)});return b}},m=1,l={create:function(){return c.create(this)},emit:function(a,b){b="undefined"===typeof b?null:b;c.each(a.split(" "),
c.bind(function(a){e._eventHandlers[-1].all&&h.call(this,"all",b,a,-1);e._eventHandlers[-1][a]&&h.call(this,a,b,a,-1);"number"===typeof this._guid&&(e._eventHandlers[this._guid].all&&h.call(this,"all",b,a),e._eventHandlers[this._guid][a]&&h.call(this,a,b))},this))},extend:function(a,b){var d=b?a:this;c.each(b?b:a,function(a,b){d[b]=a});return this},filter:function(a){var b=[];c.each(e._attributes[this._guid],function(c){a(c)&&b.push(c)});return b},get:function(a){if("string"===typeof a)return this.has(a)?
e._attributes[this._guid][a]:null;if("function"===typeof a)return a=this.filter(a),a.length?a[0]:!1},getAll:function(){return c.clone(e._attributes[this._guid])},getAllAsArray:function(){var a=[];c.each(e._attributes[this._guid],function(b,d){c.isObject(b)&&(b.id=d);a.push(b)});return c.clone(a)},has:function(a){return"undefined"!==typeof e._attributes[this._guid][a]},init:function(){this.emit("ready");return this},on:function(){j.apply(this,arguments)},push:function(a){c.isArray(a)?c.each(a,c.bind(function(a){g.call(this,
c.makeUuid(),a)},this)):g.call(this,c.makeUuid(),a)},remove:function(a){"function"===typeof a?c.each(e._attributes[this._guid],c.bind(function(b,c){a(b)&&(delete e._attributes[this._guid][c],this.emit("remove change"))},this)):("string"===typeof a&&(a=[a]),c.each(c.toArray(a),c.bind(function(a){this.has(a)&&(delete e._attributes[this._guid][a],this.emit("remove change"))},this)))},set:function(a,b){c.isObject(a)?c.each(a,c.bind(function(a,b){g.call(this,b,a)},this)):g.call(this,a,b)},update:function(a,
b){"string"===typeof a?k.call(this,a,b):"function"===typeof a&&c.each(this.getAll(),c.bind(function(b,c){k.call(this,c,a)},this))}},e={_attributes:{},_eventHandlers:{"-1":{}},_guid:-1,create:function(){return c.create(l)},extend:function(a){c.each(a,function(a,c){l[c]=a})},on:function(){j.apply(this,arguments)},version:"0.4pre"};"undefined"!==typeof exports?("undefined"!==typeof module&&module.exports&&(exports=module.exports=e),exports.Stapes=e):"function"===typeof define&&define.amd?define(function(){return e}):
window.Stapes=e})();
