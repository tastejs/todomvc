/*
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides TablePersoController
sap.ui.define(['jquery.sap.global', 'sap/ui/base/ManagedObject'],
	function(jQuery, ManagedObject) {
	"use strict";


	/**
	 * Constructor for a new TablePersoController.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * The TablePersoController can be used to connect a table with a persistence service.
	 * @extends sap.ui.base.ManagedObject
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 * @since 1.21.1
	 *
	 * @constructor
	 * @public
	 * @alias sap.ui.table.TablePersoController
	 */
	var TablePersoController = ManagedObject.extend("sap.ui.table.TablePersoController", /** @lends sap.ui.table.TablePersoController.prototype */ {
	
		constructor: function(sId, mSettings) {
			ManagedObject.apply(this, arguments);
		},
	
		metadata: {
			properties: {
				
				/**
				 * Auto save state
				 */
				"autoSave": {
					type: "boolean",
					defaultValue: true
				},
				
				/**
				 * Personalization Service object. Needs to have the following methods:
				 * <ul>
				 * <li>getPersData() : <code>jQuery Promise</code> (http://api.jquery.com/promise/)</li>
				 * <li>setPersData(oBundle) : <code>jQuery Promise</code> (http://api.jquery.com/promise/)</li>
				 * <li>delPersData() : <code>jQuery Promise</code> (http://api.jquery.com/promise/)</li>
				 * </ul>
				 */
				"persoService": {
					type: "any"
				},
				
				/**
				 * By defining a custom data key the <code>TablePersoController</code>
				 * will try to get the key for saving the perso data from the custom
				 * data of the Table and Column instead of creating it by concatenating 
				 * the ID of the Table and the Column. Basically this will be more stable 
				 * than using the auto IDs.
				 */
				"customDataKey": {
					type: "string",
					defaultValue: "persoKey"
				}
			},
			associations: {
				/**
				 * The target table of this controller.
				 */
				"table": {
					type: "sap.ui.table.Table",
					multiple: false
				}
			},
			library: "sap.ui.table"
		}
	
	});
	
	/**
	 * @private
	 */
	TablePersoController.prototype.init = function() {
	
		// Table Personalization schema
		this._schemaProperty = "_persoSchemaVersion";
		this._schemaVersion = "1.0";
	
		this._oInitialPersoData = null;
		
		this._aTableEvents = ["columnResize", "columnMove", "columnVisibility", "sort", "filter", "group"];
		this._aColumnProperties = ["visible", "width", "sorted", "sortOrder", "grouped", "summed"];
		
		this._bSaveFilters = false;
		if (this._bSaveFilters) {
			this._aTableEvents.push("filter");
			this._aColumnProperties.push("filtered");
			this._aColumnProperties.push("filterValue");
		}
		
	};
	
	/**
	 * @private
	 */
	TablePersoController.prototype.exit = function() {
	
		var oTable = this._getTable();
	
		if (oTable) {
			this._manageTableEventHandlers(oTable, false);
		}
	
		delete this._schemaProperty;
		delete this._schemaVersion;
	
		delete this._oInitialPersoData;
		
		delete this._oDialog;
	
	};
	
	TablePersoController.prototype.setPersoService = function(oService) {
		oService = this.validateProperty("persoService", oService);
		if (oService &&
			(!jQuery.isFunction(oService.getPersData) ||
			!jQuery.isFunction(oService.setPersData) ||
			!jQuery.isFunction(oService.delPersData))) {
			throw new Error("Value of property \"persoService\" needs to be null/undefined or an object that has the methods " +
					"\"getPersData\", \"setPersData\" and \"delPersData\".");
		}
	
		var oOldService = this.getPersoService();
		this.setProperty("persoService", oService, true);
		var oNewService = this.getPersoService();
	
		// refresh data using new service if there was a new service set and a table was set
		if (oNewService && oNewService !== oOldService && this._getTable() && (this.getAutoSave() || !oOldService )) {
			this.refresh();
		}
	
		return this;
	};
	
	TablePersoController.prototype.setAutoSave = function(bAutoSave) {
		var oOldValue = this.getAutoSave();
		this.setProperty("autoSave", bAutoSave, true);
		var oNewValue = this.getAutoSave();
	
		// save data if autoSave is turned from false to true
		if (oNewValue && !oOldValue) {
			this.savePersonalizations();
		}
	
		return this;
	};
	
	TablePersoController.prototype.setTable = function(vTable) {
		var oOldTable = this._getTable();
		if (oOldTable) {
			oOldTable._oPersoController = undefined; // remove the relationship to the controller
		}
		this.setAssociation("table", vTable, true);
		var oNewTable = this._getTable();
		if (oNewTable) {
			oNewTable._oPersoController = this; // set the relationship to controller (debugging & performance opts)
		}
	
		// detach handlers from old table
		if (oOldTable) {
			this._manageTableEventHandlers(oOldTable, false);
		}
	
		if (oNewTable && oNewTable !== oOldTable) {
	
			// save initial table configuration (incl. text for perso dialog)
			this._oInitialPersoData = this._getCurrentTablePersoData(true);
	
			// attach handlers to new table
			this._manageTableEventHandlers(oNewTable, true);
	
			// only refresh if there is a service set and autoSave is on or no table was set before
			if (this.getPersoService() && (this.getAutoSave() || !oOldTable )) {
				this.refresh();
			}
		} else if (!oNewTable) {
			// remove initial data if table is set to null
			this._oInitialPersoData = null;
		}
	
		return this;
	};
	
	TablePersoController.prototype.setCustomDataKey = function(sCustomDataKey) {
		var sOldValue = this.getCustomDataKey();
		this.setProperty("customDataKey", sCustomDataKey, true);
		var sNewValue = this.getCustomDataKey();
	
		// save data if the autosave is on and the perso key has been changed
		if (sOldValue !== sNewValue && this.getAutoSave()) {
			this.savePersonalizations();
		}
		
		return this;
	};
	
	TablePersoController.prototype._manageTableEventHandlers = function(oTable, bAttach) {
		// attach or detach the Table Event Handlers (necessary for autosave)
		for (var i = 0, l = this._aTableEvents.length; i < l; i++) {
			var fn = oTable[(bAttach ? "attachEvent" : "detachEvent")];
			fn.apply(oTable, [this._aTableEvents[i], this._tableEventHandler, this]);
		}
	};
	
	/**
	 * Refresh the personalizations (reloads data from service).
	 *
	 * @return {jQuery.Promise} <code>jQuery Promise</code> which is resolved once the refresh is finished
	 * @public
	 */
	TablePersoController.prototype.refresh = function() {
		var that = this;
	
		var oService = this.getPersoService();
		if (oService) {
			return oService.getPersData().done(function(oServiceData) {
				var oData = (oServiceData && jQuery.isArray(oServiceData.aColumns))
						? oServiceData
						: that._oInitialPersoData; // use initial column definitions
				that._adjustTable(oData);
			}).fail(function() {
				jQuery.sap.log.error("Problem reading persisted personalization data.");
			});
		} else {
			jQuery.sap.log.error("The Personalization Service is not available!");
			// return a dummy promise and reject it immediately
			var oDeferred = jQuery.Deferred();
			oDeferred.reject();
			return oDeferred.promise();
		}
	};
	
	/**
	 * Saves the current personalization state.
	 *
	 * @return {jQuery.Promise} <code>jQuery Promise</code> which is resolved once the save is finished
	 * @public
	 */
	TablePersoController.prototype.savePersonalizations = function() {
		var oService = this.getPersoService();
		if (oService) {
	
			var oData = this._getCurrentTablePersoData();
			oData[this._schemaProperty] = this._schemaVersion;
	
			return oService.setPersData(oData).fail(function() {
				jQuery.sap.log.error("Problem persisting personalization data.");
			});
			
		} else {
			jQuery.sap.log.error("The Personalization Service is not available!");
			// return a dummy promise and reject it immediately
			var oDeferred = jQuery.Deferred();
			oDeferred.reject();
			return oDeferred.promise();
		}
	};
	
	TablePersoController.prototype._adjustTable = function(oData) {
		var oTable = this._getTable();
		if (!oTable || !oData || !jQuery.isArray(oData.aColumns)) {
			return;
		}
	
		// create a persoKey to column map
		var mColumns = {}, aCols = oTable.getColumns();
		for (var i = 0, l = aCols.length; i < l; i++) {
			mColumns[this._getColumnPersoKey(aCols[i])] = aCols[i];
		}
		
		var aColumns = oData.aColumns;
	
		for (var i = 0, l = aColumns.length; i < l; i++) {
			var oColumnInfo = aColumns[i]; // P13N info object
			var oColumn = mColumns[oColumnInfo.id];
	
			// only if the column is available in the table 
			// e.g. if the Table has been removed or renamed => ignore!
			if (oColumn) {
				
				// apply the order
				if (oTable.indexOfColumn(oColumn) !== oColumnInfo.order) {
					oTable.removeColumn(oColumn);
					oTable.insertColumn(oColumn, oColumnInfo.order);
				}
	
				var oMetadata = oColumn.getMetadata();
				for (var j = 0, lj = this._aColumnProperties.length; j < lj; j++) {
					var sProperty = this._aColumnProperties[j];
					if (oColumnInfo[sProperty] !== undefined) {
						try {
							if (oMetadata.hasProperty(sProperty) && oColumn.getProperty(sProperty) != oColumnInfo[sProperty]) {
								oColumn.setProperty(sProperty, oColumnInfo[sProperty]);
							}
						} catch (ex) {
							jQuery.sap.log.error("sap.ui.table.TablePersoController: failed to apply the value \"" + oColumn[sProperty] + "\" for the property + \"" + sProperty + "\".");
						}
					}
				}
				
			}
	
		}
		
		if (typeof oTable._onPersoApplied === "function") {
			oTable._onPersoApplied();
		}
		
	};
	
	TablePersoController.prototype._tableEventHandler = function(oEvent) {
		if (this.getAutoSave() && !this._iTriggerSaveTimeout) {
			var that = this;
			this._iTriggerSaveTimeout = setTimeout(function() {
				that.savePersonalizations();
				that._iTriggerSaveTimeout = null;
			}, 0);
		}
	};
	
	TablePersoController.prototype._getCurrentTablePersoData = function(bForDialog) {
		var oTable = this._getTable(),
			aColumns = oTable.getColumns();
	
		var oData = {
			aColumns: []
		};
	
		for (var i = 0, l = aColumns.length; i < l; i++) {
			var oColumn = aColumns[i];
			var sPersoKey = this._getColumnPersoKey(oColumn);
			var oColumnInfo = {
				id: sPersoKey,
				order: i
			};
			var oMetadata = oColumn.getMetadata();
			for (var j = 0, lj = this._aColumnProperties.length; j < lj; j++) {
				var sProperty = this._aColumnProperties[j];
				if (oMetadata.hasProperty(sProperty)) {
					oColumnInfo[sProperty] = oColumn.getProperty(sProperty);
				}
			}
			if (bForDialog) {
				oColumnInfo.text = oColumn.getLabel() && oColumn.getLabel().getText() || sPersoKey;
			}
			oData.aColumns.push(oColumnInfo);
		}
	
		return oData;
	};
	
	TablePersoController.prototype._getTable = function() {
		return sap.ui.getCore().byId(this.getTable());
	};
	
	TablePersoController.prototype._getColumnPersoKey = function(oColumn) {
		return this._getPersoKey(this._getTable()) + "-" + this._getPersoKey(oColumn);
	};
	
	TablePersoController.prototype._getPersoKey = function(oControl) {
		var sPersoKey = oControl.data(this.getCustomDataKey());
		if (!sPersoKey) {
			sPersoKey = oControl.getId();
			if (sPersoKey.indexOf(sap.ui.getCore().getConfiguration().getUIDPrefix()) === 0) {
				jQuery.sap.log.warning("Generated IDs should not be used as personalization keys! The stability cannot be ensured! (Control: \"" + oControl.getId() + "\")");
			}
		}
		return sPersoKey;
	};
	
	/**
	 * Opens the personalization dialog for the Table to modify the visibility and
	 * the order of the columns.
	 * 
	 * <i>Using this functionality will require to load the sap.m library because the
	 * personalization dialog is only available in this library for now.</i>
	 * 
	 * @param {object} mSettings
	 * @public
	 * @experimental since 1.21.2 - API might change / feature requires the sap.m library!
	 */
	TablePersoController.prototype.openDialog = function(mSettings) {
	
		// include the mobile library to re-use the sap.m.TablePersoDialog
		sap.ui.getCore().loadLibrary("sap.m");
		jQuery.sap.require("sap.m.TablePersoDialog");
			
		// create and open the dialog
		if (!this._oDialog) {
			var that = this;
			this._oDialog = new sap.m.TablePersoDialog({
				persoService: this.getPersoService(),
				showSelectAll: true,
				showResetAll: true,
				grouping: false,
				contentWidth: mSettings && mSettings.contentWidth,
				contentHeight: mSettings && mSettings.contentHeight || "20rem",
				initialColumnState: this._oInitialPersoData.aColumns,
				columnInfoCallback: function(oTable, mPersoMap, oPersoService) {
					return that._getCurrentTablePersoData(true).aColumns;
				},
				confirm : function() {
					that._adjustTable(this.retrievePersonalizations());
					if (that.getAutoSave()) {
						that.savePersonalizations();
					}
				}
			});
			this._oDialog._oDialog.removeStyleClass("sapUiPopupWithPadding"); // otherwise height calculation doesn't work properly!
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this._getTable(), this._oDialog._oDialog);
		}
		
		this._oDialog.open();
		
	};
	

	return TablePersoController;

}, /* bExport= */ true);
