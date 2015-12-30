/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./Interface','./Metadata'],function(q,I,M){"use strict";var B=M.createClass("sap.ui.base.Object",{constructor:function(){if(!(this instanceof B)){throw Error("Cannot instantiate object: \"new\" is missing!");}}});B.prototype.destroy=function(){};B.prototype.getInterface=function(){var i=new I(this,this.getMetadata().getAllPublicMethods());this.getInterface=q.sap.getter(i);return i;};B.defineClass=function(c,s,F){var m=new(F||M)(c,s);var C=m.getClass();C.getMetadata=C.prototype.getMetadata=q.sap.getter(m);if(!m.isFinal()){C.extend=function(S,o,f){return M.createClass(C,S,o,f||F);};}q.sap.log.debug("defined class '"+c+"'"+(m.getParent()?" as subclass of "+m.getParent().getName():""));return m;};return B;},true);
