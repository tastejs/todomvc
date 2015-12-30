/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/core/routing/Target'],function(T){"use strict";var M=T.extend("sap.m.routing.Target",{constructor:function(o,v,p,t){this._oTargetHandler=t;T.prototype.constructor.apply(this,arguments);},_place:function(p,d){var r=T.prototype._place.apply(this,arguments);this._oTargetHandler.addNavigation({navigationIdentifier:this._oOptions.name,transition:this._oOptions.transition,transitionParameters:this._oOptions.transitionParameters,eventData:d,targetControl:r.oTargetControl,view:r.oTargetParent,preservePageInSplitContainer:this._oOptions.preservePageInSplitContainer});return r;}});return M;},true);
