/*
Evento version 0 - JavaScript libraries for working with the observer pattern
Copyright (c) 2012, Peter Michaux
All rights reserved.
Licensed under the Simplified BSD License.
https://github.com/petermichaux/evento/blob/master/LICENSE
*/
var evento=evento||{};evento.EventTarget=function(){};(function(){function hasOwnProperty(o,p){return Object.prototype.hasOwnProperty.call(o,p);}
var create=(function(){function F(){}
return function(o){F.prototype=o;return new F();};}());evento.EventTarget.prototype.addEventListener=function(type,listener){hasOwnProperty(this,'_evento_listeners')||(this._evento_listeners={});hasOwnProperty(this._evento_listeners,type)||(this._evento_listeners[type]=[]);var listeners=this._evento_listeners[type];for(var i=0,ilen=listeners.length;i<ilen;i++){if(listeners[i]===listener){return;}}
listeners.push(listener);};evento.EventTarget.prototype.removeEventListener=function(type,listener){if(hasOwnProperty(this,'_evento_listeners')&&hasOwnProperty(this._evento_listeners,type)){var listeners=this._evento_listeners[type];for(var i=0,ilen=listeners.length;i<ilen;i++){if(listeners[i]===listener){listeners.splice(i,1);return;}}}};evento.EventTarget.prototype.addParentEventTarget=function(parent){if(typeof parent.dispatchEvent!=='function'){throw new TypeError('evento.EventTarget.prototype.addParentEventTarget: Parents must have dispatchEvent method.');}
hasOwnProperty(this,'_evento_parents')||(this._evento_parents=[]);var parents=this._evento_parents;for(var i=0,ilen=parents.length;i<ilen;i++){if(parents[i]===parent){return;}}
parents.push(parent);};evento.EventTarget.prototype.removeParentEventTarget=function(parent){if(hasOwnProperty(this,'_evento_parents')){var parents=this._evento_parents;for(var i=0,ilen=parents.length;i<ilen;i++){if(parents[i]===parent){parents.splice(i,1);return;}}}};evento.EventTarget.prototype.dispatchEvent=function(evt){evt=create(evt);('target'in evt)||(evt.target=this);evt.currentTarget=this;evt._propagationStopped=('bubbles'in evt)?!evt.bubbles:false;evt.stopPropagation=function(){evt._propagationStopped=true;};if(hasOwnProperty(this,'_evento_listeners')&&hasOwnProperty(this._evento_listeners,evt.type)){var listeners=this._evento_listeners[evt.type].slice(0);for(var i=0,ilen=listeners.length;i<ilen;i++){var listener=listeners[i];if(typeof listener==='function'){listener.call(this,evt);}
else{listener.handleEvent(evt);}}}
if(hasOwnProperty(this,'_evento_parents')&&!evt._propagationStopped){for(var i=0,ilen=this._evento_parents.length;i<ilen;i++){this._evento_parents[i].dispatchEvent(evt);}}};evento.EventTarget.call(evento.EventTarget.prototype);evento.EventTarget.mixin=function(obj){var pt=evento.EventTarget.prototype;for(var p in pt){if(hasOwnProperty(pt,p)&&(typeof pt[p]==='function')){obj[p]=pt[p];}}
evento.EventTarget.call(obj);};}());(function(){function createBundle(element,type,listener,auxArg){var bundle={element:element,type:type,listener:listener};if(arguments.length>3){bundle.auxArg=auxArg;}
if(typeof listener==='function'){var thisObj=arguments.length>3?auxArg:element;bundle.wrappedHandler=function(evt){listener.call(thisObj,evt);};}
else if(typeof auxArg==='function'){bundle.wrappedHandler=function(evt){auxArg.call(listener,evt);};}
else{var methodName=arguments.length>3?auxArg:'handleEvent';bundle.wrappedHandler=function(evt){listener[methodName](evt);};}
return bundle;}
function bundlesAreEqual(a,b){return(a.element===b.element)&&(a.type===b.type)&&(a.listener===b.listener)&&((!a.hasOwnProperty('auxArg')&&!b.hasOwnProperty('auxArg'))||(a.hasOwnProperty('auxArg')&&b.hasOwnProperty('auxArg')&&(a.auxArg===b.auxArg)));}
function indexOfBundle(bundles,bundle){for(var i=0,ilen=bundles.length;i<ilen;i++){if(bundlesAreEqual(bundles[i],bundle)){return i;}}
return-1;}
evento.addEventListener=function(element,type,listener,auxArg){var bundle=createBundle.apply(null,arguments);if(listener._evento_bundles){if(indexOfBundle(listener._evento_bundles,bundle)>=0){return;}}
else{listener._evento_bundles=[];}
if(typeof bundle.element.addEventListener==='function'){bundle.element.addEventListener(bundle.type,bundle.wrappedHandler,false);}
else if((typeof bundle.element.attachEvent==='object')&&(bundle.element.attachEvent!==null)){bundle.element.attachEvent('on'+bundle.type,bundle.wrappedHandler);}
else{throw new Error('evento.addEventListener: Supported EventTarget interface not found.');}
listener._evento_bundles.push(bundle);};var remove=evento.removeEventListener=function(element,type,listener,auxArg){if(listener._evento_bundles){var i=indexOfBundle(listener._evento_bundles,createBundle.apply(null,arguments));if(i>=0){var bundle=listener._evento_bundles[i];if(typeof bundle.element.removeEventListener==='function'){bundle.element.removeEventListener(bundle.type,bundle.wrappedHandler,false);}
else if((typeof bundle.element.detachEvent==='object')&&(bundle.element.detachEvent!==null)){bundle.element.detachEvent('on'+bundle.type,bundle.wrappedHandler);}
else{throw new Error('evento.removeEventListener: Supported EventTarget interface not found.');}
listener._evento_bundles.splice(i,1);}}};evento.purgeEventListener=function(listener){if(listener._evento_bundles){var bundles=listener._evento_bundles.slice(0);for(var i=0,ilen=bundles.length;i<ilen;i++){var bundle=bundles[i];if(bundle.hasOwnProperty('auxArg')){remove(bundle.element,bundle.type,bundle.listener,bundle.auxArg);}
else{remove(bundle.element,bundle.type,bundle.listener);}}}};}());