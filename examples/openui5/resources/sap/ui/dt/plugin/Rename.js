/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/dt/Plugin','sap/ui/dt/ElementUtil'],function(P,E){"use strict";var R=P.extend("sap.ui.dt.plugin.Rename",{metadata:{library:"sap.ui.dt",properties:{editableTypes:{type:"string[]",defaultValue:["sap.ui.core.Element"]}},associations:{},events:{}}});R.prototype.init=function(){P.prototype.init.apply(this,arguments);};R.prototype.isEditableType=function(e){var a=this._getEditableTypes();return a.some(function(t){return E.isInstanceOf(e,t);});};R.prototype._getEditableTypes=function(){return this.getProperty("editableTypes")||[];};R.prototype.checkEditable=function(o){return true;};R.prototype.registerOverlay=function(o){var e=o.getElementInstance();if(this.isEditableType(e)&&this.checkEditable(o)){o.setEditable(true);}};return R;},true);
