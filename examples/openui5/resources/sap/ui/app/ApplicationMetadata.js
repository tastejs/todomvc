/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','sap/ui/core/ComponentMetadata'],function(q,C){"use strict";var A=function(c,o){C.apply(this,arguments);};A.prototype=q.sap.newObject(C.prototype);A.preprocessClassInfo=function(c){if(c&&typeof c.metadata==="string"){c.metadata={_src:c.metadata};}return c;};A.prototype.applySettings=function(c){var s=c.metadata;C.prototype.applySettings.call(this,c);if(s._src){q.sap.log.warning("The metadata of the application "+this.getName()+" is loaded from file "+s._src+". This is a design time feature and not for productive usage!");var p=this.getName().replace(/\.\w+?$/,"");var u=q.sap.getModulePath(p,"/"+s._src);var r=q.sap.syncGetJSON(u);if(r.success){q.extend(s,r.data);}else{q.sap.log.error("Failed to load application metadata from \""+s._src+"\"! Reason: "+r.error);}}this._mRootComponent=s.rootComponent||null;};A.prototype.getRootComponent=function(){return this._mRootComponent;};return A;},true);
