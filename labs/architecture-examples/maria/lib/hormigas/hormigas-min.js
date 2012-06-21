/*
Hormigas version 1
Copyright (c) 2012, Peter Michaux
All rights reserved.
Licensed under the Simplified BSD License.
https://github.com/petermichaux/hormigas/blob/master/LICENSE
*/

var hormigas=hormigas||{};(function(){var nextId=0;function getId(){return nextId++;}
function initSet(set){set._hormigas_ObjectSet_elements={};set.length=0;}
hormigas.ObjectSet=function(){initSet(this);for(var i=0,ilen=arguments.length;i<ilen;i++){this.add(arguments[i]);}};hormigas.ObjectSet.prototype.has=function(element){return Object.prototype.hasOwnProperty.call(element,'_hormigas_ObjectSet_id')&&Object.prototype.hasOwnProperty.call(this._hormigas_ObjectSet_elements,element._hormigas_ObjectSet_id);};hormigas.ObjectSet.prototype.add=function(element){if(this.has(element)){return false;}
else{var id;if(!Object.prototype.hasOwnProperty.call(element,'_hormigas_ObjectSet_id')){element._hormigas_ObjectSet_id=getId();}
this._hormigas_ObjectSet_elements[element._hormigas_ObjectSet_id]=element;this.length++;return true;}};hormigas.ObjectSet.prototype['delete']=function(element){if(this.has(element)){delete this._hormigas_ObjectSet_elements[element._hormigas_ObjectSet_id];this.length--;return true;}
else{return false;}};hormigas.ObjectSet.prototype.empty=function(){if(this.length>0){initSet(this);return true;}
else{return false;}};hormigas.ObjectSet.prototype.toArray=function(){var elements=[];for(var p in this._hormigas_ObjectSet_elements){if(Object.prototype.hasOwnProperty.call(this._hormigas_ObjectSet_elements,p)){elements.push(this._hormigas_ObjectSet_elements[p]);}}
return elements;};hormigas.ObjectSet.prototype.forEach=function(callbackfn){var thisArg=arguments[1];for(var p in this._hormigas_ObjectSet_elements){if(Object.prototype.hasOwnProperty.call(this._hormigas_ObjectSet_elements,p)){callbackfn.call(thisArg,this._hormigas_ObjectSet_elements[p],this);}}};hormigas.ObjectSet.prototype.every=function(callbackfn){var thisArg=arguments[1];for(var p in this._hormigas_ObjectSet_elements){if(Object.prototype.hasOwnProperty.call(this._hormigas_ObjectSet_elements,p)&&!callbackfn.call(thisArg,this._hormigas_ObjectSet_elements[p],this)){return false;}}
return true;};hormigas.ObjectSet.prototype.some=function(callbackfn){var thisArg=arguments[1];for(var p in this._hormigas_ObjectSet_elements){if(Object.prototype.hasOwnProperty.call(this._hormigas_ObjectSet_elements,p)&&callbackfn.call(thisArg,this._hormigas_ObjectSet_elements[p],this)){return true;}}
return false;};hormigas.ObjectSet.prototype.reduce=function(callbackfn){var elements=this.toArray();var i=0;var ilen=elements.length;var accumulator;if(arguments.length>1){accumulator=arguments[1];}
else if(ilen<1){throw new TypeError('reduce of empty set with no initial value');}
else{i=1;accumulator=elements[0];}
while(i<ilen){accumulator=callbackfn.call(undefined,accumulator,elements[i],this);i++;}
return accumulator;};hormigas.ObjectSet.prototype.map=function(callbackfn){var thisArg=arguments[1];var result=[];for(var p in this._hormigas_ObjectSet_elements){if(Object.prototype.hasOwnProperty.call(this._hormigas_ObjectSet_elements,p)){result.push(callbackfn.call(thisArg,this._hormigas_ObjectSet_elements[p],this));}}
return result;};hormigas.ObjectSet.prototype.filter=function(callbackfn){var thisArg=arguments[1];var result=[];for(var p in this._hormigas_ObjectSet_elements){if(Object.prototype.hasOwnProperty.call(this._hormigas_ObjectSet_elements,p)){var element=this._hormigas_ObjectSet_elements[p];if(callbackfn.call(thisArg,element,this)){result.push(element);}}}
return result;};}());hormigas.ObjectSet.call(hormigas.ObjectSet.prototype);hormigas.ObjectSet.mixin=function(obj){for(var p in hormigas.ObjectSet.prototype){if(Object.prototype.hasOwnProperty.call(hormigas.ObjectSet.prototype,p)&&(typeof hormigas.ObjectSet.prototype[p]==='function')){obj[p]=hormigas.ObjectSet.prototype[p];}}
hormigas.ObjectSet.call(obj);};