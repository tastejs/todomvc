/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides class sap.ui.model.odata.TreeBindingAdapter
sap.ui.define(['jquery.sap.global', 'sap/ui/model/TreeBinding', 'sap/ui/model/ClientTreeBinding', 'sap/ui/table/TreeAutoExpandMode', 'sap/ui/model/ChangeReason', 'sap/ui/model/TreeBindingUtils'],
	function(jQuery, TreeBinding, ClientTreeBinding, TreeAutoExpandMode, ChangeReason, TreeBindingUtils) {
		"use strict";

		/**
		 * Adapter for TreeBindings to add the ListBinding functionality and use the
		 * tree structure in list based controls.
		 *
		 * This module is only for experimental and internal use!
		 *
		 * @alias sap.ui.model.TreeBindingCompatibilityAdapter
		 * @class
		 * @protected
		 */
		var TreeBindingCompatibilityAdapter = function (oBinding, oTable) {
			// Code necessary for ClientTreeBinding
			var that = oTable;
			jQuery.extend(oBinding, {
				_init: function(bExpandFirstLevel) {
					this._bExpandFirstLevel = bExpandFirstLevel;
					// load the root contexts and create the context info map
					this.mContextInfo = {};
					this._initContexts();
					// expand the first level if required
					if (bExpandFirstLevel && !this._bFirstLevelExpanded) {
						this._expandFirstLevel();
					}
				},

				_initContexts: function(bSkipFirstLevelLoad) {
					// load the root contexts and create the context info map entry (if missing)
					this.aContexts = this.getRootContexts(0, Number.MAX_VALUE);
					for (var i = 0, l = this.aContexts.length; i < l; i++) {
						var oldContextInfo = this._getContextInfo(this.aContexts[i]);
						this._setContextInfo({
							oContext: this.aContexts[i],
							iLevel: 0,
							bExpanded: oldContextInfo ? oldContextInfo.bExpanded : false
						});
					}

					if (this._bExpandFirstLevel && !this._bFirstLevelExpanded) {
						this._expandFirstLevel(bSkipFirstLevelLoad);
					}
				},

				_expandFirstLevel: function (bSkipFirstLevelLoad) {
					var that = this;
					if (this.aContexts && this.aContexts.length > 0) {
						jQuery.each(this.aContexts.slice(), function(iIndex, oContext) {
							if (!bSkipFirstLevelLoad) {
								that._loadChildContexts(oContext);
							}
							that._getContextInfo(oContext).bExpanded = true;
						});

						this._bFirstLevelExpanded = true;
					}
				},

				_fnFireFilter: oBinding._fireFilter,
				_fireFilter: function() {
					this._fnFireFilter.apply(this, arguments);
					this._initContexts(true);
					this._restoreContexts(this.aContexts);
				},
				_fnFireChange: oBinding._fireChange,
				_fireChange: function() {
					this._fnFireChange.apply(this, arguments);
					this._initContexts(true);
					this._restoreContexts(this.aContexts);
				},
				_restoreContexts: function(aContexts) {
					var that = this;
					var aNewChildContexts = [];
					jQuery.each(aContexts.slice(), function(iIndex, oContext) {
						var oContextInfo = that._getContextInfo(oContext);
						if (oContextInfo && oContextInfo.bExpanded) {
							aNewChildContexts.push.apply(aNewChildContexts, that._loadChildContexts(oContext));
						}
					});
					if (aNewChildContexts.length > 0) {
						this._restoreContexts(aNewChildContexts);
					}
				},
				_loadChildContexts: function(oContext) {
					var oContextInfo = this._getContextInfo(oContext);
					var iIndex = jQuery.inArray(oContext, this.aContexts);
					var aNodeContexts = this.getNodeContexts(oContext, 0, Number.MAX_VALUE);
					for (var i = 0, l = aNodeContexts.length; i < l; i++) {
						this.aContexts.splice(iIndex + i + 1, 0, aNodeContexts[i]);
						var oldContextInfo = this._getContextInfo(aNodeContexts[i]);
						this._setContextInfo({
							oParentContext: oContext,
							oContext: aNodeContexts[i],
							iLevel: oContextInfo.iLevel + 1,
							bExpanded: oldContextInfo ? oldContextInfo.bExpanded : false
						});
					}
					return aNodeContexts;
				},
				_getContextInfo: function(oContext) {
					return oContext ? this.mContextInfo[oContext.getPath()] : undefined;
				},
				_setContextInfo: function(mData) {
					if (mData && mData.oContext) {
						this.mContextInfo[mData.oContext.getPath()] = mData;
					}
				},
				getLength: function() {
					return this.aContexts ? this.aContexts.length : 0;
				},
				getContexts: function(iStartIndex, iLength) {
					return this.aContexts.slice(iStartIndex, iStartIndex + iLength);
				},
				getContextByIndex: function (iRowIndex) {
					return this.aContexts[iRowIndex];
				},
				getLevel: function(oContext) {
					var oContextInfo = this._getContextInfo(oContext);
					return oContextInfo ? oContextInfo.iLevel : -1;
				},
				isExpanded: function(iRowIndex) {
					var oContext = this.getContextByIndex(iRowIndex);
					var oContextInfo = this._getContextInfo(oContext);
					return oContextInfo ? oContextInfo.bExpanded : false;
				},
				expandContext: function(oContext) {
					var oContextInfo = this._getContextInfo(oContext);
					if (oContextInfo && !oContextInfo.bExpanded) {
						this.storeSelection();
						this._loadChildContexts(oContext);
						oContextInfo.bExpanded = true;
						this._fireChange();
						this.restoreSelection();
					}
				},
				expand: function (iRowIndex) {
					this.expandContext(this.getContextByIndex(iRowIndex));
				},
				collapseContext: function(oContext, bSupressChanges) {
					var oContextInfo = this._getContextInfo(oContext);
					if (oContextInfo && oContextInfo.bExpanded) {
						this.storeSelection();
						for (var i = this.aContexts.length - 1; i > 0; i--) {
							if (this._getContextInfo(this.aContexts[i]).oParentContext === oContext) {
								this.aContexts.splice(i, 1);
							}
						}
						oContextInfo.bExpanded = false;
						if (!bSupressChanges) {
							this._fireChange();
						}
						this.restoreSelection();
					}
				},
				collapse: function (iRowIndex) {
					this.collapseContext(this.getContextByIndex(iRowIndex));
				},
				collapseToLevel: function (iLevel) {
					if (!iLevel || iLevel < 0) {
						iLevel = 0;
					}

					var aContextsCopy = this.aContexts.slice();
					for (var i = aContextsCopy.length - 1; i >= 0; i--) {
						var iContextLevel = this.getLevel(aContextsCopy[i]);
						if (iContextLevel != -1 && iContextLevel >= iLevel) {
							this.collapseContext(aContextsCopy[i], true);
						}
					}

					this._fireChange();
				},
				toggleContext: function(oContext) {
					var oContextInfo = this._getContextInfo(oContext);
					if (oContextInfo) {
						if (oContextInfo.bExpanded) {
							this.collapseContext(oContext);
						} else {
							this.expandContext(oContext);
						}
					}
				},
				toggleIndex: function (iRowIndex) {
					this.toggleContext(this.getContextByIndex(iRowIndex));
				},
				storeSelection: function() {
					var aSelectedIndices = that.getSelectedIndices();
					var aSelectedContexts = [];
					jQuery.each(aSelectedIndices, function(iIndex, iValue) {
						aSelectedContexts.push(that.getContextByIndex(iValue));
					});
					this._aSelectedContexts = aSelectedContexts;
				},
				restoreSelection: function() {
					that.clearSelection();
					var _aSelectedContexts = this._aSelectedContexts;
					jQuery.each(this.aContexts, function(iIndex, oContext) {
						if (jQuery.inArray(oContext, _aSelectedContexts) >= 0) {
							that.addSelectionInterval(iIndex, iIndex);
						}
					});
					this._aSelectedContexts = undefined;
				},
				attachSelectionChanged: function() {
					// for compatibility reasons (OData Tree Binding)
					return undefined;
				},
				clearSelection: function () {
					that._oSelection.clearSelection();
				},
				attachSort: function() {},
				detachSort: function() {}
			});
			// initialize the binding
			oBinding._init(oTable.getExpandFirstLevel());

		};

		return TreeBindingCompatibilityAdapter;
	}, true);