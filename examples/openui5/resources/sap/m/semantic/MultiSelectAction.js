/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/m/semantic/SemanticToggleButton'],function(S){"use strict";var M=S.extend("sap.m.semantic.MultiSelectAction",{});M.prototype._PRESSED_STATE_TO_ICON_MAP={"true":"sap-icon://sys-cancel","false":"sap-icon://multi-select"};M.prototype._setPressed=function(p,s){var i=M.prototype._PRESSED_STATE_TO_ICON_MAP[p];this._getControl().setIcon(i);};return M;},true);
