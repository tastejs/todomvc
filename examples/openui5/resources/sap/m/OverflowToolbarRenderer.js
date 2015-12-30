/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/core/Renderer','./ToolbarRenderer'],function(R,T){"use strict";var O=R.extend(T);O.renderBarContent=function(r,t){t._getVisibleContent().forEach(function(c){sap.m.BarInPageEnabler.addChildClassTo(c,t);r.renderControl(c);});if(t._getOverflowButtonNeeded()){O.renderOverflowButton(r,t);}};O.renderOverflowButton=function(r,t){var o=t._getOverflowButton();sap.m.BarInPageEnabler.addChildClassTo(o,t);r.renderControl(o);};return O;},true);
