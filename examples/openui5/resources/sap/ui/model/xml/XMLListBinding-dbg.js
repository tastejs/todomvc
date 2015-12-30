/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides the XML model implementation of a list binding
sap.ui.define(['jquery.sap.global', 'sap/ui/model/ChangeReason', 'sap/ui/model/ClientListBinding'],
	function(jQuery, ChangeReason, ClientListBinding) {
	"use strict";


	
	/**
	 *
	 * @class
	 * List binding implementation for XML format
	 *
	 * @param {sap.ui.model.xml.XMLModel} oModel
	 * @param {string} sPath
	 * @param {sap.ui.model.Context} oContext
	 * @param {sap.ui.model.Sorter|sap.ui.model.Sorter[]} [aSorters] initial sort order (can be either a sorter or an array of sorters)
	 * @param {sap.ui.model.Filter|sap.ui.model.Filter[]} [aFilters] predefined filter/s (can be either a filter or an array of filters)
	 * @param {object} [mParameters]
	 * @alias sap.ui.model.xml.XMLListBinding
	 * @extends sap.ui.model.ListBinding
	 */
	var XMLListBinding = ClientListBinding.extend("sap.ui.model.xml.XMLListBinding");
	
	/**
	 * Return contexts for the list or a specified subset of contexts
	 * @param {int} [iStartIndex=0] the startIndex where to start the retrieval of contexts
	 * @param {int} [iLength=length of the list] determines how many contexts to retrieve beginning from the start index.
	 * Default is the whole list length.
	 *
	 * @return {sap.ui.model.Context[]} the contexts array
	 * @protected
	 */
	XMLListBinding.prototype.getContexts = function(iStartIndex, iLength) {
		this.iLastStartIndex = iStartIndex;
		this.iLastLength = iLength;
		
		if (!iStartIndex) {
			iStartIndex = 0;
		}
		if (!iLength) {
			iLength = Math.min(this.iLength, this.oModel.iSizeLimit);
		}
	
		var aContexts = this._getContexts(iStartIndex, iLength),
			oContextData = {};
		
		if (this.bUseExtendedChangeDetection) {
			for (var i = 0; i < aContexts.length; i++) {
				oContextData[aContexts[i].getPath()] = this.oModel._getObject(aContexts[i].getPath())[0];
			}
	
			//Check diff
			if (this.aLastContexts && iStartIndex < this.iLastEndIndex) {
				var that = this;
				var aDiff = jQuery.sap.arrayDiff(this.aLastContexts, aContexts, function(oOldContext, oNewContext) {
					var oOldNode =  that.oLastContextData &&  that.oLastContextData[oOldContext.getPath()];
					var oNewNode = oContextData && oContextData[oNewContext.getPath()];
					if (oOldNode && oNewNode) {
						return jQuery.sap.isEqualNode(oOldNode, oNewNode);
					}
					return false;
				});
				aContexts.diff = aDiff;
			}
		
			this.iLastEndIndex = iStartIndex + iLength;
			this.aLastContexts = aContexts.slice(0);
			this.oLastContextData = {};
			var that = this;
			jQuery.each(oContextData, function(sKey, oNode) {
				that.oLastContextData[sKey] = oNode.cloneNode(true);
			});
		}
	
		return aContexts;
	};
	
	XMLListBinding.prototype.getCurrentContexts = function() {
		if (this.bUseExtendedChangeDetection) {
			return this.aLastContexts || [];
		} else {
			return this.getContexts(this.iLastStartIndex, this.iLastLength);
		}
	};
	
	/**
	 * Update the list, indices array and apply sorting and filtering
	 * @private
	 */
	XMLListBinding.prototype.update = function(){
		var oList = this.oModel._getObject(this.sPath, this.oContext);
		if (oList) {
			this.oList = [];
			var that = this;
			if (this.bUseExtendedChangeDetection) {
				jQuery.each(oList, function(sKey, oNode) {
					that.oList.push(oNode.cloneNode(true));
				});
			} else {
				this.oList = oList.slice(0);
			}
			this.updateIndices();
			this.applyFilter();
			this.applySort();
			this.iLength = this._getLength();
		} else {
			this.oList = [];
			this.aIndices = [];
			this.iLength = 0;
		}
	};
	
	/**
	 * Check whether this Binding would provide new values and in case it changed,
	 * inform interested parties about this.
	 * 
	 * @param {boolean} bForceupdate
	 * 
	 */
	XMLListBinding.prototype.checkUpdate = function(bForceupdate){
		
		if (this.bSuspended && !this.bIgnoreSuspend) {
			return;
		}
		 
		if (!this.bUseExtendedChangeDetection) {
			var oList = this.oModel._getObject(this.sPath, this.oContext);
			if (!this.oList || !oList || oList.length != this.oList.length || bForceupdate) {
				// TODO does not work currently, so so old behavior
				//if (!jQuery.sap.equal(this.oList, oList)) {
				this.update();
				this._fireChange({reason: ChangeReason.Change});
			}
		} else {
			var bChangeDetected = false;
			var that = this;
			
			//If the list has changed we need to update the indices first
			var oList = this.oModel._getObject(this.sPath, this.oContext);
			if (oList && this.oList.length != oList.length) {
				bChangeDetected = true;
			}
			if (!jQuery.sap.equal(this.oList, oList)) {
				this.update();
			}
			
			//Get contexts for visible area and compare with stored contexts
			var aContexts = this._getContexts(this.iLastStartIndex, this.iLastLength);
			if (this.aLastContexts) {
				if (this.aLastContexts.length != aContexts.length) {
					bChangeDetected = true;
				} else {
					jQuery.each(this.aLastContexts, function(iIndex, oContext) {
						var oNewNode = aContexts[iIndex].getObject();
						var oOldNode = that.oLastContextData && that.oLastContextData[oContext.getPath()];
						if (oNewNode && oOldNode && !oOldNode.isEqualNode(oNewNode)) {
							bChangeDetected = true;
							return false;
						}
					});
				}
			} else {
				bChangeDetected = true;
			}
			if (bChangeDetected || bForceupdate) {
				this._fireChange({reason: ChangeReason.Change});
			}
		}
	};
	

	return XMLListBinding;

});
