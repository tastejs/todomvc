/*
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides TablePersoController
sap.ui.define(['jquery.sap.global', './TablePersoDialog', 'sap/ui/base/ManagedObject'],
	function(jQuery, TablePersoDialog, ManagedObject) {
	"use strict";



	/**
	 * The TablePersoController can be used to connect a table that you want to provide
	 * a personalization dialog for, with a persistence service such as one provided by
	 * the unified shell.
	 *
	 * @param {string}
	 *			[sId] optional id for the new control; generated automatically if
	 *			no non-empty id is given Note: this can be omitted, no matter
	 *			whether <code>mSettings</code> will be given or not!
	 * @param {object}
	 *			[mSettings] optional map/JSON-object with initial settings for the
	 *			new component instance
	 * @public
	 *
	 * @class Table Personalization Controller
	 * @extends sap.ui.base.ManagedObject
	 * @author SAP
	 * @version 1.32.9
	 * @alias sap.m.TablePersoController
	 */
	var TablePersoController = ManagedObject.extend("sap.m.TablePersoController", /** @lends sap.m.TablePersoController */

	{
		constructor: function(sId, mSettings) {

			ManagedObject.apply(this, arguments);

		},

		metadata: {
			properties: {
				"contentWidth": {type: "sap.ui.core.CSSSize"},
				"contentHeight": {type: "sap.ui.core.CSSSize", defaultValue: "20rem", since: "1.22"},
				/**
				 * Available options for the text direction are LTR and RTL. By default the control inherits the text direction from its parent control.
				 */
				"componentName": {type: "string", since: "1.20.2"},
				"hasGrouping": {type: "boolean", defaultValue: false, since: "1.22"},
				"showSelectAll": {type: "boolean", defaultValue: true, since: "1.22"},
				"showResetAll": {type: "boolean", defaultValue: true, since: "1.22"}
			},
			aggregations: {
				"_tablePersoDialog": {
					type: "sap.m.TablePersoDialog",
					multiple: false,
					visibility: "hidden"
				},
				"persoService": {
					type: "Object",
					multiple: false
				}
			},
			associations: {
				"table": {
					type: "sap.m.Table",
					multiple: false
				},
				/**
				 * Also several tables may be personalized at once given they have same columns.
				 */
				"tables": {
					type: "sap.m.Table",
					multiple: true
				}
			},
			events: {
				personalizationsDone: {}
			},
			library: "sap.m"
		}

	});


	/**
	 * Initializes the TablePersoController instance after creation.
	 *
	 * @protected
	 */
	TablePersoController.prototype.init = function() {

		// Table Personalization schema
		this._schemaProperty = "_persoSchemaVersion";
		this._schemaVersion = "1.0";

		// To store the intermediate personalization data
		this._oPersonalizations = null;
		//Initialize delegate map
		this._mDelegateMap = {};
		//Initialize table personalization map
		this._mTablePersMap = {};
		//Initialize map to contain initial states of all tables
		this._mInitialTableStateMap = {};
		//Internal flag which may be checked by clients which
		//have workaround for missing event in place
		/*eslint-disable */
		this._triggersPersDoneEvent = true;
		/*eslint-enable */

	};

	/**
	 * Do some clean up: remove event delegates, etc
	 *
	 * @protected
	 */
	TablePersoController.prototype.exit = function() {

		// Clean up onBeforRendering delegates
		this._callFunctionForAllTables(jQuery.proxy(function(oTable){
			oTable.removeDelegate(this._mDelegateMap[oTable]);
		}, this));

		delete this._mDelegateMap;
		delete this._mTablePersMap;
		delete this._mInitialTableStateMap;
	};

	/**
	 * Activates the controller, i.e. tries to retrieve existing persisted
	 * personalizations, creates a TablePersoDialog for the associated
	 * table and attaches a close handler to apply the personalizations to
	 * the table and persist them.
	 *
	 * This method should be called when the table to be personalized knows
	 * its columns. Usually, this is when that table's view has set its model,
	 * which is typically done in the corresponding controller's init method.
	 * For example
	 * <pre><code>
	 *  onInit: function () {
	 *
	 *		// set explored app's demo model on this sample
	 *		var oModel = new JSONModel(jQuery.sap.getModulePath("sap.ui.demo.mock", "/products.json"));
	 *		var oGroupingModel = new JSONModel({ hasGrouping: false});
	 *		this.getView().setModel(oModel);
	 *		this.getView().setModel(oGroupingModel, 'Grouping');
	 *
	 *		// init and activate controller
	 *		this._oTPC = new TablePersoController({
	 *			table: this.getView().byId("productsTable"),
	 *			//specify the first part of persistence ids e.g. 'demoApp-productsTable-dimensionsCol'
	 *			componentName: "demoApp",
	 *			persoService: DemoPersoService,
	 *		}).activate();
	 *	}
	 *</code></pre>
	 *
	 *
	 * @public
	 * @return {TablePersoController} the TablePersoController instance.
	 */
	TablePersoController.prototype.activate = function() {

		//Remember initial table columns states before personalization
		this._callFunctionForAllTables(this._rememberInitialTableStates);
		// Add 'onBeforeRendering' delegates to all tables
		this._callFunctionForAllTables(this._createAndAddDelegateForTable);

		return this;
	};

	/**
	 * Returns a  _tablePersoDialog instance if available. It can be NULL if
	 * the controller has not been activated yet.
	 *
	 * This function makes a private aggregate publicly accessable. This is
	 * necessary for downward compatibility reasons: in the first versions
	 * of the tablePersoProvider developers still worked with the TablePersoDialog
	 * directly, which is now not necessary any longer.
	 *
	 * @public
	 * @return {TablePersoDialog} the TablePersoDialog instance.
	 */
	TablePersoController.prototype.getTablePersoDialog = function() {
		return this.getAggregation("_tablePersoDialog");
	};


	/**
	 * Applies the personalizations by getting the existing personalizations
	 * and adjusting to the table.
	 *
	 * @param {sap.m.Table} oTable the table to be personalized.
	 * @public
	 */
	TablePersoController.prototype.applyPersonalizations = function(oTable) {
		var oReadPromise = this.getPersoService().getPersData();
		var that = this;
		oReadPromise.done(function(oPersData) {
			if (!!oPersData) {
				that._adjustTable(oPersData, oTable);
			}
		});
		oReadPromise.fail(function() {
			//SUGGESTED IMPROVEMENT: User should get some visual feedback as well
			jQuery.sap.log.error("Problem reading persisted personalization data.");
		});
	};

	/**
	 * Creates 'onBeforeRendering' delegate for given table and adds it to the controller'
	 * '_mDelegateMap'
	 *
	 * @param {sap.m.Table} oTable the table to be personalized.
	 * @private
	 */
	TablePersoController.prototype._createAndAddDelegateForTable = function(oTable) {
		if (!this._mDelegateMap[oTable]) {
			// Use 'jQuery.proxy' to conveniently use 'this' within the
			// delegate function
			var oTableOnBeforeRenderingDel = {onBeforeRendering : jQuery.proxy(function () {
				// Try to retrieve existing persisted personalizations
				// and adjust the table
				// SUGGESTED IMPROVEMENT: column order and visibility does not need to be set
				// whenever the table is re-rendered. It should suffice to do this when
				// personalizations is activated and when personalization data changes.
				// So instead of listening to 'beforeRendering', this delegate should be used
				// to listen to a change event triggered by the persoService
				this.applyPersonalizations(oTable);
				// This function will be called whenever its table is rendered or
				// re-rendered. The TablePersoDialog only needs to be created once, though!
				if (!this.getAggregation("_tablePersoDialog")) {
					// The TablePersoDialog is created for the FIRST table whose onBeforeRendering
					// callback is executed. The asssumption here is that it does not matter which
					// table it is since they should all have the same columns.
					this._createTablePersoDialog(oTable);
				}
			}, this)};
			// By adding our function as a delegate to the table's 'beforeRendering' event,
			// this._fnTableOnBeforeRenderingDel will be executed whenever the table is
			// rendered or re-rendered

			oTable.addDelegate(oTableOnBeforeRenderingDel);
			// Finally add delegate to map to enable proper housekeeping, i.e. cleaning
			// up delegate when TablePersoController instance is destroyed
			this._mDelegateMap[oTable] = oTableOnBeforeRenderingDel;
		}
	};

	/**
	 * Creation of the TablePersoDialog based on the content of oTable and
	 * save the personalizations.
	 *
	 * @param {sap.m.Table} oTable the table to be personalized.
	 * @private
	 */
	TablePersoController.prototype._createTablePersoDialog = function(oTable) {
		// Create a new TablePersoDialog control for the associated table.
		// SUGGESTED IMPROVEMENT: the dialog gets created once, when 'activate'
		// is called. Changes to the table after that are not reflected in the
		// TablePersoDialog, in such a case 'refresh' must be called.
		// Would be better if table perso dialog was up to date automatically
		var oTablePersoDialog = new TablePersoDialog({
				persoDialogFor: oTable,
				persoMap : this._getPersoColumnMap(oTable),
				// make sure _tableColumnInfo's 'this' refers to the controller,
				// not the dialog to be able to access controller's persoService
				columnInfoCallback: this._tableColumnInfo.bind(this),
				initialColumnState : this._mInitialTableStateMap[oTable],
				contentWidth: this.getContentWidth(),
				contentHeight: this.getContentHeight(),
				hasGrouping: this.getHasGrouping(),
				showSelectAll: this.getShowSelectAll(),
				showResetAll: this.getShowResetAll()
		});

		// Link to this new TablePersoDialog via the aggregation
		this.setAggregation("_tablePersoDialog", oTablePersoDialog);

		// When the TablePersoDialog closes, we want to retrieve the personalizations
		// made, amend the table, and also persist them
		oTablePersoDialog.attachConfirm(jQuery.proxy(function() {
			this._oPersonalizations = oTablePersoDialog.retrievePersonalizations();
			this._callFunctionForAllTables(this._personalizeTable);
			this.savePersonalizations();
			this.firePersonalizationsDone();
		}, this));

	};

	/**
	 * Adjusts the table by getting the existing personalizations
	 * and applying them to the table.
	 *
	 * @param {Object} oData the new persoanlization settings
	 * @param {sap.m.Table} oTable the table to be personalized.
	 *
	 * @private
	 */
	TablePersoController.prototype._adjustTable = function(oData, oTable) {
		if (oData && oData.hasOwnProperty(this._schemaProperty) && oData[this._schemaProperty] === this._schemaVersion) {
			this._oPersonalizations = oData;
			if (!!oTable) {
				this._personalizeTable(oTable);
			} else {
				this._callFunctionForAllTables(this._personalizeTable);
			}

		}
	};


	/**
	 * Personalizes the table, i.e. sets column order and visibility
	 * according to the stored personalization settings.
	 *
	 * Includes automatic migration of 'old' persistence id. These contain generated
	 * parts and may change over time (example: __xmlview0--idColor). If such
	 * and id is found, the personalization values of the corresponding column
	 * are saved by the new key which has the format
	 * 		<componentName>-<tableIdSuffix>-<columnIDSuffix>
	 * where tableIdSuffix and columnIdSuffix are 'final' ids that do not change.
	 *
	 * @param {sap.m.Table} oTable the table to be personalized.
	 * @private
	 */
	TablePersoController.prototype._personalizeTable = function(oTable) {
		var mPersoMap = this._getPersoColumnMap(oTable);

		// mPersoMap may be null if oTable's id is not static
		// or if any of the column ids is not static
		if (!!mPersoMap && !!this._oPersonalizations) {
			var bDoSaveMigration = false;
			// Set order and visibility
			for ( var c = 0, cl = this._oPersonalizations.aColumns.length; c < cl; c++) {
				var oNewSetting = this._oPersonalizations.aColumns[c];
				var oTableColumn = mPersoMap[oNewSetting.id];
				if (!oTableColumn) {
					//Fallback for deprecated personalization procedure
					oTableColumn = sap.ui.getCore().byId(oNewSetting.id);
					if (!!oTableColumn) {
						// migrate old persistence id which still contain generated column ids, example: __xmlview0--idColor
						jQuery.sap.log.info("Migrating personalization persistence id of column " + oNewSetting.id );
						oNewSetting.id = mPersoMap[oTableColumn];
						bDoSaveMigration = true;
					}
				}

				if (oTableColumn) {
					oTableColumn.setVisible(oNewSetting.visible);
					oTableColumn.setOrder(oNewSetting.order);
				} else {
					jQuery.sap.log.warning("Personalization could not be applied to column " + oNewSetting.id + " - not found!");
				}
			}

			// Id 'old' persistence ids have been returned by perso provider, they are updated
			if (bDoSaveMigration) {
				this.savePersonalizations();
			}

			// Force re-rendering of Table for column reorder
			// SUGGESTED IMPROVEMENT: this is probably obsolete by now: changing one of
			// the table column's visibility or order should suffice to trigger table's rerendering
			oTable.invalidate();
		}
	};


	/**
	 * Persist the personalizations
	 *
	 * @public
	 */
	TablePersoController.prototype.savePersonalizations = function() {

		var oBundle = this._oPersonalizations;

		// Add schema version to bundle
		oBundle[this._schemaProperty] = this._schemaVersion;

		// Commit to backend service
		var oWritePromise = this.getPersoService().setPersData(oBundle);
		oWritePromise.done(function() {
			// all OK
		});
		oWritePromise.fail(function() {
			// SUGGESTED IMPROVEMENT: User should get some visual feedback as well
			jQuery.sap.log.error("Problem persisting personalization data.");
		});

	};


	/**
	 * Refresh the personalizations: reloads the personalization information from the table perso
	 * provider, applies it to the controller's table and updates the controller's table perso dialog.
	 *
	 * Use case for a 'refresh' call would be that the table which si personalized changed its columns
	 * during runtime, after personalization has been activated.
	 *
	 * @public
	 */
	TablePersoController.prototype.refresh = function() {
		var fnRefreshTable = function(oTable) {
			// Clear the table perso map to have it repopulated by
			// the 'onBeforeRendering' delegates (see '_createAndAddDelegateForTable')
			this._mTablePersMap = {};
			// This triggers a rerendering
			oTable.invalidate();
		};

		this._callFunctionForAllTables(fnRefreshTable);
		var oTablePersoDialog = this.getAggregation("_tablePersoDialog");
		if (!!oTablePersoDialog) {
			// Need to refresh the map which contains columns and personalizations
			// columns may have been removed or added. (CSN 0120031469 0000415411 2014)
			oTablePersoDialog.setPersoMap(this._getPersoColumnMap(sap.ui.getCore().byId(oTablePersoDialog.getPersoDialogFor())));
		}
	};


	/**
	 * Opens the TablePersoDialog, stores the personalized settings on close,
	 * modifies the table columns, and sends them to the persistence service
	 *
	 * @public
	 */
	TablePersoController.prototype.openDialog = function() {
		var oTablePersoDialog = this.getAggregation("_tablePersoDialog");
		if (!!oTablePersoDialog) {
			// 'syncStyleClass' call because dialogs need to be informed of 'sapUISizeCompact'
			// They do not get this information automatically
			jQuery.sap.syncStyleClass("sapUiSizeCompact", oTablePersoDialog.getPersoDialogFor(), oTablePersoDialog._oDialog);
			oTablePersoDialog.open();
		} else {
			// SUGGESTED IMPROVEMENT: User should get some visual feedback as well
			jQuery.sap.log.warning("sap.m.TablePersoController: trying to open TablePersoDialog before TablePersoService has been activated.");
		}
	};

	/**
	 * Reflector for the controller's 'contentWidth' property.
	 * @param {sap.ui.core.CSSSize} sWidth the new width of the tablePersoDialog
	 * @return {TablePersoController} the TablePersoController instance.
	 * @public
	 */
	TablePersoController.prototype.setContentWidth = function(sWidth) {
		this.setProperty("contentWidth", sWidth, true);
		var oTablePersoDialog = this.getAggregation("_tablePersoDialog");
		if (!!oTablePersoDialog) {
			oTablePersoDialog.setContentWidth(sWidth);
		}
		return this;
	};

	/**
	 * Reflector for the controller's 'contentHeight' property.
	 * @param {sap.ui.core.CSSSize} sHeight the new height of the TablePersoDialog.
	 * @return {TablePersoController} the TablePersoController instance.
	 * @public
	 */
	TablePersoController.prototype.setContentHeight = function(sHeight) {
		this.setProperty("contentHeight", sHeight, true);
		var oTablePersoDialog = this.getAggregation("_tablePersoDialog");
		if (!!oTablePersoDialog) {
			oTablePersoDialog.setContentHeight(sHeight);
		}
		return this;
	};

	/**
	 * Reflector for the controller's 'hasGrouping' property.
	 * @param {boolean} bHasGrouping is the tablePersoDialog displayed in grouping mode or not.
	 * @return {TablePersoController} the TablePersoController instance.
	 * @public
	 */
	TablePersoController.prototype.setHasGrouping = function(bHasGrouping) {
		this.setProperty("hasGrouping", bHasGrouping, true);
		var oTablePersoDialog = this.getAggregation("_tablePersoDialog");
		if (!!oTablePersoDialog) {
			oTablePersoDialog.setHasGrouping(bHasGrouping);
		}
		return this;
	};

	/**
	 * Reflector for the controller's 'showSelectAll' property.
	 * @param {boolean} bShowSelectAll is the tablePersoDialog's 'Display All' checkbox displayed or not.
	 * @return {TablePersoController} the TablePersoController instance.
	 * @public
	 */
	TablePersoController.prototype.setShowSelectAll = function(bShowSelectAll) {
		this.setProperty("showSelectAll", bShowSelectAll, true);
		var oTablePersoDialog = this.getAggregation("_tablePersoDialog");
		if (!!oTablePersoDialog) {
			oTablePersoDialog.setShowSelectAll(bShowSelectAll);
		}
		return this;
	};

	/**
	 * Reflector for the controller's 'showResetAll' property.
	 * @param {boolean} bShowResetAll is the tablePersoDialog's 'UndoPersonalization' button displayed or not.
	 * @return {TablePersoController} the TablePersoController instance.
	 * @public
	 */
	TablePersoController.prototype.setShowResetAll = function(bShowResetAll) {
		this.setProperty("showResetAll", bShowResetAll, true);
		var oTablePersoDialog = this.getAggregation("_tablePersoDialog");
		if (!!oTablePersoDialog) {
			oTablePersoDialog.setShowResetAll(bShowResetAll);
		}
		return this;
	};

	/**
	 * Using this method, the first part of tablePerso persistence ids can be
	 * provided, in case the table's app does not provide that part itself.
	 *
	 * If a component name is set using this method, it will be used, regardless of
	 * whether the table's app has a different component name or not.
	 *
	 * @param {string} sCompName the new component name.
	 * @return {TablePersoController} the TablePersoController instance.
	 * @public
	 */
	TablePersoController.prototype.setComponentName = function(sCompName) {
		// SUGGESTED IMPROVEMENT: setter for component name seems to have
		// been overwritten to prevent unnecessary rerendering. Since TablePersoController
		// does not have a visual repersentation, this is probably superfluous
		// and this method may be removed.
		this.setProperty("componentName", sCompName, true);
		return this;
	};

	/**
	 * Returns the controller's component name set via 'setComponentName' if present, otherwise it
	 * delivers the given oControl's component name by recursive asking its
	 * parents for their component name. If none of oControl's ancestors has a component
	 * name, the function returns 'empty_component'.
	 *
	 * @param {object} oControl used to determine the component name.
	 * @return {string} the component name.
	 *
	 * @private
	 */
	TablePersoController.prototype._getMyComponentName = function(oControl) {
		if (this.getComponentName()) {
			return this.getComponentName();
		}

		if (oControl === null) {
			return "empty_component";
		}
		var oMetadata = oControl.getMetadata();
		if (oControl.getMetadata().getStereotype() === "component") {
			return oMetadata._sComponentName;
		}
		return this._getMyComponentName(oControl.getParent());
	};

	/**
	 * Takes a function and calls it for all table, specified in the controller's
	 * 'table' or 'tables' association. The passed in function must take
	 * a table as first parameter!
	 *
	 * @param {function} fnToCall function to be called
	 *
	 * @private
	 */
	TablePersoController.prototype._callFunctionForAllTables = function(fnToCall) {
		var oTable = sap.ui.getCore().byId(this.getAssociation("table"));
		if (!!oTable) {
			fnToCall.call(this, oTable);
		}
		var aTables = this.getAssociation("tables");
		if (aTables) {
			for ( var i = 0, iLength = this.getAssociation("tables").length; i < iLength; i++) {
				oTable = sap.ui.getCore().byId(this.getAssociation("tables")[i]);
				fnToCall.call(this, oTable);
			}
		}
	};

	/**
	 * Simple heuristic to determine if an ID is generated or static
	 *
	 * @param {string} sId id under test.
	 * @return {boolean} static id or not.
	 * @private
	 */
	TablePersoController.prototype._isStatic = function (sId) {
		// SUGGESTED IMPROVEMENT: make this an inline function of '_getPersoColumnMap'
		// it is only used there
		var sUidPrefix = sap.ui.getCore().getConfiguration().getUIDPrefix();
		var rGeneratedPrefix = new RegExp("^" + sUidPrefix);
		return !rGeneratedPrefix.test(sId);
	};


	/**
	 * Lazy instantiation of private member _mPersMap
	 * This is a map containg key value pairs of the following kind:
	 * 		- key: a table column object
	 * 		- value: column personalization identifier of the form
	 * 		  <componentName>-<tableIdSuffix>-<columnIDSuffix>
	 * and vice versa! This map is created once, before the corresponding
	 * table is rendered for the first time.
	 *
	 * Personalization requires that table id and all column ids are 'static', i.e. they
	 * are specified by the app developer and do not change. This is necessary since
	 * generated ids may change and can therefore not be used to link persisted
	 * personalization information.
	 *
	 * If table id or any column id is generated (id starts with configured UIDPrefix,
	 * which is usually '__'), the map is not generated and this method returns 'null'.
	 *
	 * @param {sap.m.Table} oTable the table for whose columns shall be the resulting map's keys.
	 * @return {object] the table's personalization map.
	 * @private
	 */
	TablePersoController.prototype._getPersoColumnMap = function(oTable) {
		var mResult = this._mTablePersMap[oTable];
		if (!mResult) {
			mResult = {};
			// Convenience function to extract last part of an id
			// need this for columns and table
			var fnExtractIdSuffix = function(sId) {
				var iLastDashIndex = sId.lastIndexOf("-");
				// if no dash was found 'substring' will still work:
				// it returns the entire string, which should not happen
				// but would be ok in that case
				return sId.substring(iLastDashIndex + 1);
			};

			var sTableIdSuffix = fnExtractIdSuffix.call(this, oTable.getId());

			// Check table id. Must be static
			if (!this._isStatic(sTableIdSuffix)) {
				// Table id is generated and can therefore not be used.
				// SUGGESTED IMPROVEMENT: personalization does not take place in this case.
				// User should get some visual feedback
				jQuery.sap.log.error("Table " + oTable.getId() + " must have a static id suffix. Otherwise personalization can not be persisted.");
				//Invalidate persoMap
				mResult = null;
				return null;
			}
			var sNextPersoColumnIdentifier;
			var sComponentName = this._getMyComponentName(oTable);


			var that = this;

			oTable.getColumns().forEach(function(oNextColumn) {
				// Check if result has been invalidated by a previous iteration
				if (!!mResult) {
					// 'this' refers to the current table column
					var sNextColumnId = oNextColumn.getId();
					var sNextColumnIdSuffix = fnExtractIdSuffix.call(that, sNextColumnId);
					// columns must have static IDs for personalization to be stable
					if (!that._isStatic(sNextColumnIdSuffix)) {
						// Table id is generated and can therefore not be used.
						// SUGGESTED IMPROVEMENT: personalization does not take place in this case.
						// User should get some visual feedback
						jQuery.sap.log.error("Suffix " + sNextColumnIdSuffix + " of table column " + sNextColumnId + " must be static. Otherwise personalization can not be persisted for its table.");
						// Invalidate persoMap
						mResult = null;
						return null;
					}
					// concatenate the parts
					sNextPersoColumnIdentifier = sComponentName + "-" + sTableIdSuffix + "-" + sNextColumnIdSuffix;
					// add column as key and identifier as value
					// this is needed to automatically migrate generated
					// persistence ids (see '_personalizeTable')
					mResult[oNextColumn] = sNextPersoColumnIdentifier;
					//add vice versa as well
					mResult[sNextPersoColumnIdentifier] = oNextColumn;
				}
			});
			this._mTablePersMap[oTable] = mResult;
		}
		return mResult;
	};

	/**
	 * Store's the given table's initial state in the controller's initial state map.
	 * This state will be used by the TablePersoDialog to undo the personalization.
	 *
	 * @param {sap.m.Table} oTable the table for which initial state shall be remembered.
	 * @private
	 */
	TablePersoController.prototype._rememberInitialTableStates = function (oTable) {
		this._mInitialTableStateMap[oTable] = this._tableColumnInfo(oTable, this._getPersoColumnMap(oTable));
	};

	/**
	 * Returns table column settings (header text, order, visibility) for a table
	 *
	 * @param {sap.m.Table} oTable the table for which column settings should be returned
	 * @param {object} oPersoMap the table's personalization map
	 * @return {object} the table's personlization settings.
	 * @private
	 */
	TablePersoController.prototype._tableColumnInfo = function (oTable, oPersoMap) {

		// Check if persoMap has been passed into the dialog.
		// Otherwise, personalization is not possible.
		if (!!oPersoMap) {
			var aColumns = oTable.getColumns(),
				aColumnInfo = [],
				oPersoService = this.getPersoService();
			aColumns.forEach(function(oColumn){
				var sCaption = null;
				if (oPersoService.getCaption) {
					sCaption = oPersoService.getCaption(oColumn);
				}

				var sGroup = null;
				if (oPersoService.getGroup) {
					sGroup = oPersoService.getGroup(oColumn);
				}

				if (!sCaption) {
					var oColHeader = oColumn.getHeader();
					// Check if header control has either text or 'title' property
					if (oColHeader.getText && oColHeader.getText()) {
						sCaption = oColHeader.getText();
					} else if (oColHeader.getTitle && oColHeader.getTitle()) {
						sCaption = oColHeader.getTitle();
					}

					if (!sCaption) {
						// Fallback: use column id and issue warning to let app developer know to add captions to columns
						sCaption = oColumn.getId();
						jQuery.sap.log.warning("Please 'getCaption' callback implentation in your TablePersoProvider for column " +
							oColumn + ". Table personalization uses column id as fallback value.");
					}
				}

				// In this case, oColumn is one of our controls. Therefore, sap.ui.core.Element.toString()
				// is called which delivers something like 'Element sap.m.Column#<sId>' where sId is the column's sId property
				aColumnInfo.push({
					text : sCaption,
					order : oColumn.getOrder(),
					visible : oColumn.getVisible(),
					id: oPersoMap[oColumn],
					group : sGroup
				});
			});

			// Sort to make sure they're presented in the right order
			aColumnInfo.sort(function(a, b) { return a.order - b.order; });

			return aColumnInfo;
		}
		return null;
	};



	return TablePersoController;

}, /* bExport= */ true);
