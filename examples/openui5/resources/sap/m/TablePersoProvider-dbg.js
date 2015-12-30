/*
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides TablePersoProvider
sap.ui.define(['jquery.sap.global', 'sap/ui/base/ManagedObject'],
	function(jQuery, ManagedObject) {
	"use strict";


	
	/**
	 * This is an abstract TablePersoProvider, describing the interface for a real
	 * TablePersoProvider.
	 *
	 * @public
	 *
	 * @class Table Personalization Provider
	 * @extends sap.ui.base.ManagedObject
	 * @abstract
	 * @author SAP
	 * @version 1.32.9
	 * @alias sap.m.TablePersoProvider
	 */
	var TablePersoProvider = ManagedObject.extend("sap.m.TablePersoProvider", /** @lends sap.m.TablePersoProvider */
	
	{
		constructor: function(sId, mSettings) {
	
			ManagedObject.apply(this, arguments);
	
		},
	
		metadata: {
			"abstract": true,
			library: "sap.m"
		}
	
	});
	
	
	/**
	 * Initializes the TablePersoProvider instance after creation.
	 *
	 * @protected
	 */
	TablePersoProvider.prototype.init = function() {
	
		jQuery.sap.log.warning("This is the abstract base class for a TablePersoProvider. Do not create instances of this class, but use a concrete sub class instead.");
		jQuery.sap.log.debug("TablePersoProvider init");
	
	};
	
	/**
	 * Retrieves the personalization bundle. 
	 * This must return a jQuery promise (see http://api.jquery.com/promise/)
	 * @public
	 */
	TablePersoProvider.prototype.getPersData = function() {
	
		jQuery.sap.log.debug("TablePersoProvider getPersData");
	
	};
	
	/**
	 * Stores the personalization bundle, overwriting any
	 * previous bundle completely
	 * This must return a jQuery promise (see http://api.jquery.com/promise/)
	 * @param {object} oBundle
	 * @public
	 */
	TablePersoProvider.prototype.setPersData = function(oBundle) {
	
		jQuery.sap.log.debug("TablePersoProvider setPersData");
	
	};
	
	/**
	 * Removes the personalization bundle
	 * This must return a jQuery promise (see http://api.jquery.com/promise/)
	 * @public
	 */
	TablePersoProvider.prototype.delPersData = function() {
	
		jQuery.sap.log.debug("TablePersoProvider delPersData");
	
	};
	
	/**
	 * Callback function which can be used to determine the title of a given column
	 * within the TablePersoDialog. As a default, the column header controls are
	 * asked for their 'text' or 'title' property. This works in most cases, for example
	 * if the header control is a sap.m.Label (has 'text' property) or a sap.m.ObjectListItem
	 * (has 'title' property). 
	 * 
	 * If the header control used in a column has neither 'text' nor 'title' property, or if you would like to 
	 * display a modified column name for a certain column, this callback function can be used.
	 * 
	 * If the callback delivers null for a column (which is the default implementation), the default
	 * texts described above are displayed for that column in the TablePersoDialog. 
	 * 
	 * In case neither the callback delivers null and neither 'text' nor ' title' property are at hand,
	 * the TablePersoDialog will display the column id and a warning message is logged.
	 * 
	 * @param {sap.m.Column} oColumn column whose caption shall be determined
	 * @public
	 */
	TablePersoProvider.prototype.getCaption = function(oColumn) {
		return null;
	};
	
	/**
	 * Callback function which can be used to determine the group of a given column
	 * within the TablePersoDialog. As a default, the columns are not assigned to a group. 
	 * 
	 * This information is used to group the columns within the TablePersoDialog if the TablePersoController's
	 * 'group' flag is set, otherwise, the groups are ignored. 
	 * 
	 * @param {sap.m.Column} oColumn column whose group shall be determined
	 * @public
	 */
	TablePersoProvider.prototype.getGroup = function(oColumn) {
		return null;
	};
	
	
	/**
	* Resets user’s personalization for a given table so that ‘getPersData’ will
	* deliver its initial state. If no table is specified, all personalizations
	* of the currently logged on user are reset.
	*
	* This must return a jQuery promise (see http://api.jquery.com/promise/)
	 * @public
	*/
	TablePersoProvider.prototype.resetPersData = function() {
	
		jQuery.sap.log.debug("TablePersoProvider resetPersData");
	
	};
	
	

	return TablePersoProvider;

}, /* bExport= */ true);
