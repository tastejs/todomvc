/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./library','sap/ui/core/Element'],function(q,l,E){"use strict";var I=E.extend("sap.m.IconTabSeparator",{metadata:{interfaces:["sap.m.IconTab"],library:"sap.m",properties:{icon:{type:"sap.ui.core.URI",group:"Misc",defaultValue:''},iconDensityAware:{type:"boolean",group:"Appearance",defaultValue:true}}}});I.prototype._getImageControl=function(c,p){var P={src:this.getIcon(),densityAware:this.getIconDensityAware(),useIconTooltip:false};this._oImageControl=sap.m.ImageHelper.getImageControl(this.getId()+"-icon",this._oImageControl,p,P,c);return this._oImageControl;};I.prototype.exit=function(e){if(this._oImageControl){this._oImageControl.destroy();}if(sap.ui.core.Item.prototype.exit){sap.ui.core.Item.prototype.exit.call(this,e);}};return I;},true);
