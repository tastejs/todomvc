/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides an abstraction for list bindings
sap.ui.define(['jquery.sap.global', './Binding', './Filter', './Sorter'],
	function(jQuery, Binding, Filter, Sorter) {
	"use strict";


	/**
	 * Constructor for ListBinding
	 *
	 * @class
	 * The ListBinding is a specific binding for lists in the model, which can be used
	 * to populate Tables or ItemLists.
	 *
	 * @param {sap.ui.model.Model} oModel
	 * @param {string} sPath
	 * @param {sap.ui.model.Context} oContext
	 * @param {array} [aSorters] initial sort order (can be either a sorter or an array of sorters)
	 * @param {array} [aFilters] predefined filter/s (can be either a filter or an array of filters)
	 * @param {object} [mParameters]
	 *
	 * @public
	 * @alias sap.ui.model.ListBinding
	 * @extends sap.ui.model.Binding
	 */
	var ListBinding = Binding.extend("sap.ui.model.ListBinding", /** @lends sap.ui.model.ListBinding.prototype */ {

		constructor : function(oModel, sPath, oContext, aSorters, aFilters, mParameters){
			Binding.call(this, oModel, sPath, oContext, mParameters);

			this.aSorters = aSorters;
			if (!jQuery.isArray(this.aSorters) && this.aSorters instanceof Sorter) {
				this.aSorters = [this.aSorters];
			} else if (!jQuery.isArray(this.aSorters)) {
				this.aSorters = [];
			}
			this.aFilters = [];
			if (!jQuery.isArray(aFilters) && aFilters instanceof Filter) {
				aFilters = [aFilters];
			} else if (!jQuery.isArray(aFilters)) {
				aFilters = [];
			}
			this.aApplicationFilters = aFilters;
			this.bUseExtendedChangeDetection = false;
		},

		metadata : {
			"abstract" : true,

			publicMethods : [
				// methods
				"getContexts", "getCurrentContexts", "sort", "attachSort", "detachSort", "filter", "attachFilter", "detachFilter", "getDistinctValues", "isGrouped", "getLength", "isLengthFinal"
			]
		}

	});


	// the 'abstract methods' to be implemented by child classes
	/**
	 * Returns an array of binding contexts for the bound target list.
	 *
	 * <strong>Note:</strong>The public usage of this method is deprecated, as calls from outside of controls will lead
	 * to unexpected side effects. For avoidance use {@link sap.ui.model.ListBinding.prototype.getCurrentContexts}
	 * instead.
	 *
	 * @function
	 * @name sap.ui.model.ListBinding.prototype.getContexts
	 * @param {int} [iStartIndex=0] the startIndex where to start the retrieval of contexts
	 * @param {int} [iLength=length of the list] determines how many contexts to retrieve beginning from the start index.
	 * @return {sap.ui.model.Context[]} the array of contexts for each row of the bound list
	 *
	 * @protected
	 */

	/**
	 * Filters the list according to the filter definitions
	 *
	 * @function
	 * @name sap.ui.model.ListBinding.prototype.filter
	 * @param {object[]} aFilters Array of filter objects
	 * @param {sap.ui.model.FilterType} sFilterType Type of the filter which should be adjusted, if it is not given, the standard behaviour applies
	 * @return {sap.ui.model.ListBinding} returns <code>this</code> to facilitate method chaining
	 *
	 * @public
	 */

	/**
	 * Sorts the list according to the sorter object
	 *
	 * @function
	 * @name sap.ui.model.ListBinding.prototype.sort
	 * @param {sap.ui.model.Sorter|Array} aSorters the Sorter object or an array of sorters which defines the sort order
	 * @return {sap.ui.model.ListBinding} returns <code>this</code> to facilitate method chaining
	 * @public
	 */

	/**
	 * Returns an array of currently used binding contexts of the bound control
	 *
	 * This method does not trigger any data requests from the backend or delta calculation, but just returns the context
	 * array as last requested by the control. This can be used by the application to get access to the data currently
	 * displayed by a list control.
	 *
	 * @return {sap.ui.model.Context[]} the array of contexts for each row of the bound list
	 * @since 1.28
	 * @public
	 */
	ListBinding.prototype.getCurrentContexts = function() {
		return this.getContexts();
	};

	/**
	 * Returns the number of entries in the list. This might be an estimated or preliminary length, in case
	 * the full length is not known yet, see method isLengthFinal().
	 *
	 * @return {int} returns the number of entries in the list
	 * @since 1.24
	 * @public
	 */
	ListBinding.prototype.getLength = function() {
		return 0;
	};

	/**
	 * Returns whether the length which can be retrieved using getLength() is a known, final length,
	 * or an preliminary or estimated length which may change if further data is requested.
	 *
	 * @return {boolean} returns whether the length is final
	 * @since 1.24
	 * @public
	 */
	ListBinding.prototype.isLengthFinal = function() {
		return true;
	};

	// base methods, may be overridden by child classes
	/**
	 * Returns list of distinct values for the given relative binding path
	 *
	 * @param {string} sPath the relative binding path
	 * @return {Array} the array of distinct values.
	 *
	 * @public
	 */
	ListBinding.prototype.getDistinctValues = function(sPath) {
		return null;
	};

	//Eventing and related
	/**
	 * Attach event-handler <code>fnFunction</code> to the 'sort' event of this <code>sap.ui.model.ListBinding</code>.<br/>
	 * @param {function} fnFunction The function to call, when the event occurs.
	 * @param {object} [oListener] object on which to call the given function.
	 * @protected
	 * @deprecated use the change event. It now contains a parameter (reason : "sort") when a sorter event is fired.
	 */
	ListBinding.prototype.attachSort = function(fnFunction, oListener) {
		this.attachEvent("sort", fnFunction, oListener);
	};

	/**
	 * Detach event-handler <code>fnFunction</code> from the 'sort' event of this <code>sap.ui.model.ListBinding</code>.<br/>
	 * @param {function} fnFunction The function to call, when the event occurs.
	 * @param {object} [oListener] object on which to call the given function.
	 * @protected
	 * @deprecated use the change event.
	 */
	ListBinding.prototype.detachSort = function(fnFunction, oListener) {
		this.detachEvent("sort", fnFunction, oListener);
	};

	/**
	 * Fire event _sort to attached listeners.
	 * @param {Map} [mArguments] the arguments to pass along with the event.
	 * @private
	 * @deprecated use the change event. It now contains a parameter (reason : "sort") when a sorter event is fired.
	 */
	ListBinding.prototype._fireSort = function(mArguments) {
		this.fireEvent("sort", mArguments);
	};

	/**
	 * Attach event-handler <code>fnFunction</code> to the 'filter' event of this <code>sap.ui.model.ListBinding</code>.<br/>
	 * @param {function} fnFunction The function to call, when the event occurs.
	 * @param {object} [oListener] object on which to call the given function.
	 * @protected
	 * @deprecated use the change event. It now contains a parameter (reason : "filter") when a filter event is fired.
	 */
	ListBinding.prototype.attachFilter = function(fnFunction, oListener) {
		this.attachEvent("filter", fnFunction, oListener);
	};

	/**
	 * Detach event-handler <code>fnFunction</code> from the 'filter' event of this <code>sap.ui.model.ListBinding</code>.<br/>
	 * @param {function} fnFunction The function to call, when the event occurs.
	 * @param {object} [oListener] object on which to call the given function.
	 * @protected
	 * @deprecated use the change event.
	 */
	ListBinding.prototype.detachFilter = function(fnFunction, oListener) {
		this.detachEvent("filter", fnFunction, oListener);
	};

	/**
	 * Fire event _filter to attached listeners.
	 * @param {Map} [mArguments] the arguments to pass along with the event.
	 * @private
	 * @deprecated use the change event. It now contains a parameter (reason : "filter") when a filter event is fired.
	 */
	ListBinding.prototype._fireFilter = function(mArguments) {
		this.fireEvent("filter", mArguments);
	};

	/**
	 * Indicates whether grouping is enabled for the binding.
	 * Grouping is enabled for a list binding, if at least one sorter exists on the binding and the first sorter
	 * is a grouping sorter.
	 * @public
	 * @returns {boolean} whether grouping is enabled
	 */
	ListBinding.prototype.isGrouped = function() {
		return !!(this.aSorters && this.aSorters[0] && this.aSorters[0].fnGroup);
	};

	/**
	 * Gets the group for the given context.
	 * Must only be called if isGrouped() returns that grouping is enabled for this binding. The grouping will be 
	 * performed using the first sorter (in case multiple sorters are defined).
	 * @param {sap.ui.model.Context} oContext the binding context
	 * @public
	 * @returns {object} the group object containing a key property and optional custom properties
	 * @see sap.ui.model.Sorter.getGroup
	 */
	ListBinding.prototype.getGroup = function(oContext) {
		return this.aSorters[0].getGroup(oContext);
	};

	/**
	 * Enable extended change detection
	 * @private
	 */
	ListBinding.prototype.enableExtendedChangeDetection = function( ) {
		this.bUseExtendedChangeDetection  = true;
		if (this.update) {
			this.update();
		}
	};


	return ListBinding;

});
