/*
Hijos version 0 - JavaScript classes for building tree structures and the composite design pattern
Copyright (c) 2012, Peter Michaux
All rights reserved.
Licensed under the Simplified BSD License.
https://github.com/petermichaux/hijos/blob/master/LICENSE
*/
var hijos=hijos||{};hijos.Leaf=function(){this.parentNode=null;this.previousSibling=null;this.nextSibling=null;};hijos.Leaf.prototype.destroy=function(){this.parentNode=null;this.previousSibling=null;this.nextSibling=null;};hijos.Leaf.call(hijos.Leaf.prototype);hijos.Leaf.mixin=function(obj){obj.destroy=hijos.Leaf.prototype.destroy;hijos.Leaf.call(obj);};hijos.Node=function(){hijos.Leaf.call(this);this.childNodes=[];this.firstChild=null;this.lastChild=null;};hijos.Leaf.mixin(hijos.Node.prototype);hijos.Node.prototype.destroy=function(){var children=this.childNodes.slice(0);for(var i=0,ilen=children.length;i<ilen;i++){children[i].destroy();}
hijos.Leaf.prototype.destroy.call(this);this.childNodes=null;this.firstChild=null;this.lastChild=null;};hijos.Node.prototype.hasChildNodes=function(){return this.childNodes.length>0;};hijos.Node.prototype.insertBefore=function(newChild,oldChild){if(arguments.length<2){throw new Error('hijos.Node.prototype.insertBefore: not enough arguments.');}
if(oldChild===undefined){oldChild=null;}
if((newChild===oldChild)||(oldChild&&(oldChild.previousSibling===newChild))||((oldChild===null)&&this.lastChild===newChild)){return;}
var node=this;while(node){if(node===newChild){throw new Error('hijos.Node.prototype.insertBefore: Node cannot be inserted at the specified point in the hierarchy.');}
node=node.parentNode;}
var children=this.childNodes;var indexForNewChild;if(oldChild===null){indexForNewChild=children.length;}
else{for(var i=0,ilen=children.length;i<ilen;i++){if(children[i]===oldChild){indexForNewChild=i;break;}}
if(typeof indexForNewChild!=='number'){throw new Error('hijos.Node.prototype.insertBefore: Node was not found.');}}
var parent=newChild.parentNode;if(parent){parent.removeChild(newChild);}
children.splice(indexForNewChild,0,newChild);this.firstChild=children[0];this.lastChild=children[children.length-1];newChild.parentNode=this;var previousSibling=newChild.previousSibling=(children[indexForNewChild-1]||null);if(previousSibling){previousSibling.nextSibling=newChild;}
var nextSibling=newChild.nextSibling=(children[indexForNewChild+1]||null);if(nextSibling){nextSibling.previousSibling=newChild;}};hijos.Node.prototype.appendChild=function(newChild){if(arguments.length<1){throw new Error('hijos.Node.prototype.appendChild: not enough arguments.');}
this.insertBefore(newChild,null);};hijos.Node.prototype.replaceChild=function(newChild,oldChild){if(arguments.length<2){throw new Error('hijos.Node.prototype.replaceChild: not enough arguments.');}
if(!oldChild){throw new Error('hijos.Node.prototype.replaceChild: oldChild must not be falsy.');}
if(newChild===oldChild){return;}
this.insertBefore(newChild,oldChild);this.removeChild(oldChild);};hijos.Node.prototype.removeChild=function(oldChild){if(arguments.length<1){throw new Error('hijos.Node.prototype.removeChild: not enough arguments.');}
var children=this.childNodes;for(var i=0,ilen=children.length;i<ilen;i++){if(children[i]===oldChild){var previousSibling=children[i-1];if(previousSibling){previousSibling.nextSibling=oldChild.nextSibling;}
var nextSibling=children[i+1];if(nextSibling){nextSibling.previousSibling=oldChild.previousSibling;}
oldChild.parentNode=null;oldChild.previousSibling=null;oldChild.nextSibling=null;children.splice(i,1);this.firstChild=children[0]||null;this.lastChild=children[children.length-1]||null;return;}}
throw new Error('hijos.Node.prototype.removeChild: node not found.');};hijos.Node.call(hijos.Node.prototype);hijos.Node.mixin=function(obj){for(var p in hijos.Node.prototype){if(Object.prototype.hasOwnProperty.call(hijos.Node.prototype,p)&&(typeof hijos.Node.prototype[p]==='function')){obj[p]=hijos.Node.prototype[p];}}
hijos.Node.call(obj);};