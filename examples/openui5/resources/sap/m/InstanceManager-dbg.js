/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides class sap.m.InstanceManager
sap.ui.define(['jquery.sap.global'],
	function(jQuery) {
	"use strict";

/**
	 * Provides methods to manage instances. This is specifically designed for managing the opened Popover, Dialog, ActionSheet,
	 * and it's possible to close all of the opened Popover, Dialog, ActionSheet in history handling.
	 *
	 * As <code>InstanceManager</code> is a static class, a <code>jQuery.sap.require("sap.m.InstanceManager");</code> statement
	 * must be explicitly executed before the class can be used. Example:
	 * <pre>
	 *   jQuery.sap.require("sap.m.InstanceManager");
	 *   sap.m.InstanceManager.closeAllPopovers();
	 * </pre>
	 *
	 * @namespace
	 * @public
	 * @since 1.9.2
	 */
	var InstanceManager = {};
	
	(function() {
		var mRegistry = {},
			aEmptyArray = [];
		
		var sPopoverCategoryId = "_POPOVER_",
			sDialogCategoryId = "_DIALOG_";
	
		/**
		 * Adds an instance to the given category. If the instance is already added to the same category, it won't be added again.
		 *
		 * @param {string} sCategoryId The category's id.
		 * @param {object} oInstance The instance that will be added to the given category.
		 * @returns {sap.m.InstanceManager} Enable method chaining.
		 * @protected
		 * @function
		*/
		InstanceManager.addInstance = function(sCategoryId, oInstance) {
			jQuery.sap.assert(sCategoryId, "In sap.m.InstanceManager.addInstance method, the parameter sCategoryId can't be null or empty string");
			jQuery.sap.assert(oInstance instanceof Object, "In sap.m.InstanceManager.addInstance method, the parameter oInstance should be an object");
	
			if (!mRegistry[sCategoryId]) {
				mRegistry[sCategoryId] = [];
			}
	
			if (mRegistry[sCategoryId].indexOf(oInstance) === -1) {
				mRegistry[sCategoryId].push(oInstance);
			}
	
			return this;
		};
	
		/**
		 * Removes a managed instance from the given category.
		 *
		 * @param {string} sCategoryId The category's id.
		 * @param {object} oInstance The instance that will be removed from the given category.
		 * @returns The removed instance or null. If the instance isn't managed, this method returns null instead of the instance object.
		 * @protected
		 * @function
		*/
		InstanceManager.removeInstance = function(sCategoryId, oInstance) {
			var aCategory = mRegistry[sCategoryId],
				i;
	
			jQuery.sap.assert(sCategoryId, "In sap.m.InstanceManager.removeInstance method, the parameter sCategoryId can't be null or empty string");
			jQuery.sap.assert(oInstance instanceof Object, "In sap.m.InstanceManager.removeInstance method, the parameter oInstance should be an object");
	
			if (!aCategory) {
				jQuery.sap.log.warning("Can't remove control from a non-managed category id: " + sCategoryId);
				return null;
			}
	
			i = aCategory.indexOf(oInstance);
	
			return (i === -1) ? null : aCategory.splice(i, 1);
		};
	
		/**
		 * Returns an array of managed instances in the given category.
		 *
		 * @param {string} sCategoryId The category's id.
		 * @returns {object} Managed instances in the given category.
		 * @protected
		 * @function
		*/
		InstanceManager.getInstancesByCategoryId = function(sCategoryId) {
			jQuery.sap.assert(sCategoryId, "In sap.m.InstanceManager.getInstancesByCategoryId method, the parameter sCategoryId can't be null or empty string");
	
			return mRegistry[sCategoryId] || aEmptyArray;
		};
	
		/**
		 * Checks if an instance is managed under the given category.
		 * 
		 * @param {string} sCategoryId The category that the instance is supposed to be in.
		 * @param {object} oInstance The instance that needs to be checked.
		 * @returns {boolean} Whether the instance is managed in the given category.
		 * @protected
		 * @function
		 */
		InstanceManager.isInstanceManaged = function(sCategoryId, oInstance) {
			jQuery.sap.assert(sCategoryId, "In sap.m.InstanceManager.isInstanceManaged method, the parameter sCategoryId can't be null or empty string");
			jQuery.sap.assert(oInstance instanceof Object, "In sap.m.InstanceManager.isInstanceManaged method, the parameter oInstance should be an object");
	
			var aCategory = mRegistry[sCategoryId];
	
			if (!aCategory || !oInstance) {
				return false;
			}
	
			return aCategory.indexOf(oInstance) !== -1;
		};
	
		/**
		 * Returns if there's no managed instance in the given category.
		 *
		 * @param {string} sCategoryId The category's id.
		 * @returns {boolean} Whether the category is empty.
		 * @protected
		 * @function
		*/
		InstanceManager.isCategoryEmpty = function(sCategoryId) {
			jQuery.sap.assert(sCategoryId, "In sap.m.InstanceManager.isCategoryEmpty method, the parameter sCategoryId can't be null or empty string");
	
			var aCategory = mRegistry[sCategoryId];
	
			return !aCategory || aCategory.length === 0;
		};
	
		/**
		 * Adds a control to predefined popover category in instance manager.
		 *
		 * @param {sap.ui.core.Control} oPopover Popover to be added to instance manager. Custom popover which doesn't inherit from sap.m.Popover can also be added as long as it has a close method.
		 * @returns {sap.m.InstanceManager} Enable method chaining.
		 * @protected
		 * @function
		*/
		InstanceManager.addPopoverInstance = function(oPopover){
			if (typeof oPopover.close === "function") {
				InstanceManager.addInstance(sPopoverCategoryId, oPopover);
			} else {
				jQuery.sap.log.warning("In method addPopoverInstance: the parameter doesn't have a close method and can't be managed.");
			}
			return this;
		};
		
		/**
		 * Adds a control to predefined dialog category in instance manager.
		 *
		 * @param {sap.ui.core.Control} oDialog Dialog to be added to instance manager. Dialog which doesn't inherit from sap.m.Dialog can also be added as long as it has a close method.
		 * @returns {sap.m.InstanceManager} Enable method chaining.
		 * @protected
		 * @function
		*/
		InstanceManager.addDialogInstance = function(oDialog){
			if (typeof oDialog.close === "function" ) {
				InstanceManager.addInstance(sDialogCategoryId, oDialog);
			} else {
				jQuery.sap.log.warning("In method addDialogInstance: the parameter doesn't have a close method and can't be managed.");
			}
			return this;
		};
		
		/**
		 * Removes control from predefined popover category in instance manager.
		 *
		 * @param {sap.ui.core.Control} oPopover to be removed from instance manager.
		 * @returns The removed popover or null. If the popover isn't managed, this method returns null instead of the removed popover.
		 * @protected
		 * @function
		*/
		InstanceManager.removePopoverInstance = function(oPopover){
			return InstanceManager.removeInstance(sPopoverCategoryId, oPopover);
		};
		
		/**
		 * Removes control from predefined dialog category in instance manager.
		 *
		 * @param {sap.ui.core.Control} oDialog to be removed from instance manager.
		 * @returns The removed popover or null. If the popover isn't managed, this method returns null instead of the removed popover.
		 * @protected
		 * @function
		*/
		InstanceManager.removeDialogInstance = function(oDialog){
			return InstanceManager.removeInstance(sDialogCategoryId, oDialog);
		};
		
		/**
		 * Returns true if there's popover(s) managed in predefined popover category, otherwise it returns false.
		 *
		 * @returns {boolean} Whether there's popover(s) open.
		 * @public
		 * @function
		*/
		InstanceManager.hasOpenPopover = function(){
			return !InstanceManager.isCategoryEmpty(sPopoverCategoryId);
		};
		
		/**
		 * Returns true if there's dialog(s) managed in predefined dialog category, otherwise it returns false.
		 *
		 * @returns {boolean} Whether there's dialog(s) open.
		 * @public
		 * @function
		*/
		InstanceManager.hasOpenDialog = function(){
			return !InstanceManager.isCategoryEmpty(sDialogCategoryId);
		};
		
		/**
		 * Check if the given dialog instance is managed under the dialog category.
		 * For dialog instances, managed means the dialog is open.
		 * 
		 * This function is specially provided for customized controls which doesn't have the possibility to check whether it's open.
		 * If the given dialog is an instance of sap.m.Dialog, sap.m.ActionSheet, the isOpen() method on the instance is 
		 * preferred to be called than this function.
		 * 
		 * @param {sap.ui.core.Control} oDialog The dialog that is checked for the openness.
		 * @returns Whether the given dialog is open.
		 * @public
		 * @function
		 */
		InstanceManager.isDialogOpen = function(oDialog){
			return InstanceManager.isInstanceManaged(sDialogCategoryId, oDialog);
		};
		
		/**
		 * Check if the given popover instance is managed under the popover category.
		 * For popover instances, managed means the popover is open.
		 * 
		 * This function is specially provided for customized controls which doesn't have the possibility to check whether it's open. 
		 * If the given popover is an instance of sap.m.Popover, sap.m.ActionSheet, the isOpen() method on the instance is 
		 * preferred to be called than this function.
		 * 
		 * @param {sap.ui.core.Control} oPopover The popover that is checked for the openness.
		 * @returns Whether the given popover is open.
		 * @public
		 * @function
		 */
		InstanceManager.isPopoverOpen = function(oPopover){
			return InstanceManager.isInstanceManaged(sPopoverCategoryId, oPopover);
		};
		
		/**
		 * Gets all of the open popovers. If there's no popover open, it returns an empty array.
		 *
		 * @return {sap.ui.core.Control[]} The open popovers.
		 * @public
		 * @function
		*/
		InstanceManager.getOpenPopovers = function(){
			return InstanceManager.getInstancesByCategoryId(sPopoverCategoryId);
		};
		
		/**
		 * Gets all of the open dialogs. If there's no dialog open, it returns an empty array.
		 *
		 * @return {sap.ui.core.Control[]} The open dialogs.
		 * @public
		 * @function
		*/
		InstanceManager.getOpenDialogs = function(){
			return InstanceManager.getInstancesByCategoryId(sDialogCategoryId);
		};
		
		/**
		 * Closes all open popovers.
		 *
		 * @public
		 * @returns {sap.m.InstanceManager} Enable method chaining.
		 * @function
		*/
		InstanceManager.closeAllPopovers = function(){
			var aIntances = InstanceManager.getOpenPopovers(), i;
			for (i = 0 ; i < aIntances.length ; i++) {
				aIntances[i].close();
			}
			return this;
		};
		
		/**
		 * Closes all of the open dialogs.
		 *
		 * @param {Function} fnCallback
		 * @public
		 * @returns {sap.m.InstanceManager} Enable method chaining.
		 * @function
		*/
		InstanceManager.closeAllDialogs = function(fnCallback) {
			var oDeferred,
				aDeferred = [],
				aIntances = InstanceManager.getOpenDialogs(),
				dialog,
				i;
			
			for (i = 0 ; i < aIntances.length; i++) {
				dialog = aIntances[i];
				
				if (fnCallback) {
					oDeferred = new jQuery.Deferred().done();
					aDeferred.push(oDeferred);
	
					/*eslint-disable no-loop-func */
					dialog.attachEvent("afterClose", (function(def){
						return function() {
							def.resolve();
						};
					}(oDeferred)));
					/*eslint-enable no-loop-func */
	
				}
				
				dialog.close();
			}
			
			if (fnCallback) {
				jQuery.when.apply(this, aDeferred).then(fnCallback);
			}
	  
			return this;
		};
	}());

	return InstanceManager;

}, /* bExport= */ true);
