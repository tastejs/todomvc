/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/dt/Plugin'],function(P){"use strict";var M=P.extend("sap.ui.dt.plugin.MouseSelection",{metadata:{library:"sap.ui.dt",properties:{},associations:{},events:{}}});M.prototype.init=function(){P.prototype.init.apply(this,arguments);this._mEventDelegate={"onclick":this._onClick};};M.prototype.registerOverlay=function(o){o.setSelectable(true);o.addEventDelegate(this._mEventDelegate,o);};M.prototype.deregisterOverlay=function(o){o.removeEventDelegate(this._mEventDelegate,o);};M.prototype._onClick=function(e){this.setSelected(!this.getSelected());e.preventDefault();e.stopPropagation();};return M;},true);
