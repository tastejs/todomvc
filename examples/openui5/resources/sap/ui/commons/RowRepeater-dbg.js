/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.commons.RowRepeater.
sap.ui.define(['jquery.sap.global', './library', 'sap/ui/core/Control'],
	function(jQuery, library, Control) {
	"use strict";


	
	/**
	 * Constructor for a new RowRepeater.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * This control displays items in a stacked list format, allowing the user to page in order to see more items or to use the offered filtering and sorting capabilities in order to manipulate the displayed data.
	 * @extends sap.ui.core.Control
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @alias sap.ui.commons.RowRepeater
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var RowRepeater = Control.extend("sap.ui.commons.RowRepeater", /** @lends sap.ui.commons.RowRepeater.prototype */ { metadata : {
	
		library : "sap.ui.commons",
		properties : {
			/**
			 * Number of rows displayed.
			 */
			numberOfRows : {type : "int", group : "Dimension", defaultValue : 5},
	
			/**
			 * The index of the page currently displayed. The index starts at 1.
			 */
			currentPage : {type : "int", group : "Data", defaultValue : 1},
	
			/**
			 * Step size used to increase the numberOfRows value. This feature is only active if value is greater than 0. This will deactivate the paging feature.
			 */
			showMoreSteps : {type : "int", group : "Behavior", defaultValue : 0},
	
			/**
			 * Row height adapts to rendered content. If a fixed height is specified the cells have a maximum height and the overflow will be hidden.
			 */
			fixedRowHeight : {type : "sap.ui.core.CSSSize", group : "Appearance", defaultValue : ''},
	
			/**
			 * The visual design of the control.
			 */
			design : {type : "sap.ui.commons.RowRepeaterDesign", group : "Appearance", defaultValue : sap.ui.commons.RowRepeaterDesign.Standard},
	
			/**
			 * Threshold to fetch the next chunk of data. The minimal threshold can be the numberOfRows of the RR.
			 */
			threshold : {type : "int", defaultValue : null}
		},
		defaultAggregation : "rows",
		aggregations : {
	
			/**
			 * Rows to be repeated.
			 */
			rows : {type : "sap.ui.core.Control", multiple : true, singularName : "row", bindable : "bindable"}, 
	
			/**
			 * Title to be displayed in top left corner. Either text or icon.
			 */
			title : {type : "sap.ui.core.Title", multiple : false}, 
	
			/**
			 * Filters to be provided in toolbar.
			 */
			filters : {type : "sap.ui.commons.RowRepeaterFilter", multiple : true, singularName : "filter"}, 
	
			/**
			 * Sorters to be provided in secondary toolbar.
			 */
			sorters : {type : "sap.ui.commons.RowRepeaterSorter", multiple : true, singularName : "sorter"}, 
	
			/**
			 * This control is shown, in case there is no data available to be displayed in the RowRepeater.
			 */
			noData : {type : "sap.ui.core.Control", multiple : false}, 
	
			/**
			 * A Toolbar which used internally by the RowRepeater
			 */
			filterToolbar : {type : "sap.ui.commons.Toolbar", multiple : false, visibility : "hidden"}, 
	
			/**
			 * A Toolbar which used internally by the RowRepeater
			 */
			sorterToolbar : {type : "sap.ui.commons.Toolbar", multiple : false, visibility : "hidden"}, 
	
			/**
			 * A Button which used internally by the RowRepeater
			 */
			headerShowMoreButton : {type : "sap.ui.commons.Button", multiple : false, visibility : "hidden"}, 
	
			/**
			 * A Button which used internally by the RowRepeater
			 */
			footerShowMoreButton : {type : "sap.ui.commons.Button", multiple : false, visibility : "hidden"}, 
	
			/**
			 * A Paginator which used internally by the RowRepeater
			 */
			footerPager : {type : "sap.ui.commons.Paginator", multiple : false, visibility : "hidden"}
		},
		events : {
	
			/**
			 * This event is triggered when a filter is set.
			 */
			filter : {
				parameters : {
	
					/**
					 * The ID of the filter that has just been applied.
					 */
					filterId : {type : "string"}
				}
			}, 
	
			/**
			 * This event is triggered when a sorting is applied.
			 */
			sort : {
				parameters : {
	
					/**
					 * The ID of the sorter that has just been applied.
					 */
					sorterId : {type : "string"}
				}
			}, 
	
			/**
			 * This event is triggered when paging was executed.
			 */
			page : {
				parameters : {
	
					/**
					 * The value of the currentPage property after the change.
					 */
					currentPage : {type : "int"}, 
	
					/**
					 * The value of the currentPage property before the change.
					 */
					previousPage : {type : "int"}
				}
			}, 
	
			/**
			 * This event is triggered when the number of rows was changed.
			 */
			resize : {
				parameters : {
	
					/**
					 * The value of the numberOfRows property after the change.
					 */
					numberOfRows : {type : "int"}, 
	
					/**
					 * The value of the numberOfRows property before the change.
					 */
					previousNumberOfRows : {type : "int"}
				}
			}
		}
	}});
	
	
	/**
	 * This value of the paging mode boolean is true if the showMoreSteps
	 * property is not set. This value is updated whenever the value
	 * of showMoreSteps is changed.
	 *
	 * @private
	 */
	RowRepeater.prototype.bPagingMode = true;
	
	/**
	 * All animations of the RowRepeater control can be centrally switched
	 * off by setting the <code>bShowAnimation</code> flag to <code>false</code>.
	 *
	 * @private
	 */
	RowRepeater.prototype.bShowAnimation = true;
	
	
	/* animation constants */
	RowRepeater.SHOW_MORE = "show_more";
	RowRepeater.RESIZE = "resize";
	RowRepeater.FIRST_PAGE = "first_page";
	RowRepeater.LAST_PAGE = "last_page";
	RowRepeater.PREVIOUS_PAGE = "previous_page";
	RowRepeater.NEXT_PAGE = "next_page";
	RowRepeater.GOTO_PAGE = "goto_page";
	
	RowRepeater.prototype.init = function() {
	
		// local variables
		var sId = this.getId();
	
		// get reference to resource bundle
		this.oResourceBundle = sap.ui.getCore().getLibraryResourceBundle("sap.ui.commons");
	
		// initialize animation and queuing variables
		this.sCurrentAnimation = null;
		this.aAnimationQueue = [];
		this.aRemoveBuffer = [];
	
		// previous page and numberOfRows animation
		this.iPreviousPage = this.getCurrentPage();
		this.iPreviousNumberOfRows = this.getNumberOfRows();
	
		// create filter and sorter toolbar control and add as aggregation
		this.setAggregation("filterToolbar", new sap.ui.commons.Toolbar(sId + "-ftb", {
			standalone: false, 
			design: sap.ui.commons.ToolbarDesign.Transparent
		}));
		this.setAggregation("sorterToolbar", new sap.ui.commons.Toolbar(sId + "-stb", {
			standalone: false
		}));
	
		// create pager controls and their event handlers, add them as aggregations
		var oPager = new sap.ui.commons.Paginator(sId + "-fp",{page:[this.paging,this]});
		this.setAggregation("footerPager",oPager);
	
		// create show more buttons and add them as aggregation
		var sShowMoreText = this.oResourceBundle.getText("SHOW_MORE");
		this.setAggregation("headerShowMoreButton", new sap.ui.commons.Button(sId + "-hsm", {
			text: sShowMoreText,
			tooltip: sShowMoreText,
			press: [this.triggerShowMore, this]
		}));
		this.setAggregation("footerShowMoreButton", new sap.ui.commons.Button(sId + "-fsm", {
			text: sShowMoreText,
			tooltip: sShowMoreText,
			press: [this.triggerShowMore, this]
		}));
	
		this._bSecondPage = false;
		
	};
	
	
	/*
	 * PUBLIC API METHODS
	 */
	/**
	 * The <code>triggerShowMore</code> function increments the number of rows by the
	 * value of <code>showMoreSteps</code>.
	 * 
	 * This method will only trigger a showMore if the property showMoreSteps is set.
	 *
	 * @return {sap.ui.commons.RowRepeater} <code>this</code> to allow method chaining
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	RowRepeater.prototype.triggerShowMore = function() {
	
		// execute only if showMoreSteps is bigger than 0
		if (this.getShowMoreSteps() <= 0) {
			return this;
		}
	
		// local variables
		var iShowMoreSteps = this.getShowMoreSteps();
		var iNumberOfRows = this.getNumberOfRows();
	
		// verify that the new value is not larger than number of rows available
		var iNewNumberOfRows = Math.min(this._getRowCount(),iNumberOfRows + iShowMoreSteps);
	
		// exit if value remains the same
		if (iNumberOfRows === iNewNumberOfRows) {
			return this;
		}
	
		// start animation or just set the property
		if (this.getDomRef() && this.bShowAnimation) {
	
			// check if animation is running before starting a new animation
			if ( this.sCurrentAnimation !== null ) {
				this.aAnimationQueue.push({	name:RowRepeater.SHOW_MORE,
					animationFunction:this.triggerShowMore,
					args:arguments});
				return this;
			} else {
				this.sCurrentAnimation = RowRepeater.SHOW_MORE;
			}
	
			// set property and animate
			this.iPreviousNumberOfRows = iNumberOfRows;
			this.setProperty("numberOfRows",iNewNumberOfRows,true);
			this.startResizeAnimation();
	
		} else {
	
			// set property and invalidate
			this.setNumberOfRows(iNewNumberOfRows);
	
		}
	
		// fire page event
		this.fireResize({numberOfRows:iNewNumberOfRows,previousNumberOfRows:iNumberOfRows});
	
		// return instance for chaining
		return this;
	
	};
	

	/**
	 * Resizes the row repeater by changing the number of displayed rows. This method will only resize the RowRepeater if the property showMoreSteps is set.
	 *
	 * @param {int} iNumberOfRows
	 *         The new value of number of rows displayed.
	 * @type void
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	RowRepeater.prototype.resize = function(numberOfRows) {
	
		// execute only if showMoreSteps is bigger than 0
		if (this.getShowMoreSteps() <= 0) {
			return this;
		}
	
		// local variables
		var iNumberOfRows = this.getNumberOfRows();
		
		// exit if new value is not in range or equals to old value
		if (numberOfRows <= 0 || numberOfRows > this._getRowCount() || numberOfRows === iNumberOfRows ) {
			return this;
		}
		
		// start animation or just set the property
		if (this.getDomRef() && this.bShowAnimation) {
	
			// check if animation is running before starting a new animation
			if ( this.sCurrentAnimation !== null ) {
				this.aAnimationQueue.push({	name:RowRepeater.RESIZE,
					animationFunction:this.resize,
					args:arguments});
				return this;
			} else {
				this.sCurrentAnimation = RowRepeater.RESIZE;
			}
	
			// set property and animate
			this.iPreviousNumberOfRows = iNumberOfRows;
			this.setProperty("numberOfRows",numberOfRows,true);
			this.startResizeAnimation();
	
		} else {
	
			// set property and invalidate
			this.setNumberOfRows(numberOfRows);
	
		}
	
		// fire page event
		this.fireResize({numberOfRows:numberOfRows,previousNumberOfRows:iNumberOfRows});
	
		// return instance for chaining
		return this;
	
	};
	

	/**
	 * Applies a filter.
	 *
	 * @param {string} sId
	 *         The ID if the filter.
	 * @type void
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	RowRepeater.prototype.applyFilter = function(id) {
	
		// local variables
		var aFilters = this.getFilters();
		var oListBinding = this.getBinding("rows");
		var oFilter, n;
	
		// exit directly if there are no filters or no binding defined
		if (aFilters.length === 0 || oListBinding === null) {
			return this;
		}
	
		// try to read the filter defined by the ID, unfortunately by looping
		for ( n = 0; n < aFilters.length; n++ ) {
			if (aFilters[n].getId() === id) {
				// we found the requested filter
				oFilter = aFilters[n];
				break;
			}
		}
	
		// don't do anything if we can't find the filter
		if (oFilter) {
	
			// apply the filter assigned to filter item
			oListBinding.filter(oFilter.getFilters(), sap.ui.model.FilterType.Control);
	
			// fire the filter
			this.fireFilter({filterId:id});
	
			// goto first page via public API method (i.e. animated)
			this.firstPage();
	
		}
	
		// return instance to allow chaining
		return this;
	
	};
	

	/**
	 * Sort the data.
	 *
	 * @param {string} sId
	 *         The ID of the sorter.
	 * @type void
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	RowRepeater.prototype.triggerSort = function(id) {
	
		// local variables
		var aSorters = this.getSorters();
		var oListBinding = this.getBinding("rows");
		var oSorter, n;
	
		// exit directly if there are no sorters or no binding defined
		if (aSorters.length === 0 || oListBinding === null) {
			return this;
		}
	
		// try to read the sorter defined by the ID, unfortunately by looping
		for ( n = 0; n < aSorters.length; n++ ) {
			if (aSorters[n].getId() === id) {
				// we found the requested filter
				oSorter = aSorters[n];
				break;
			}
		}
	
		// don't do anything if we can't find the sorter
		if (oSorter) {
	
			// trigger the sorter assigned to sorter item
			oListBinding.sort(oSorter.getSorter());
	
			// fire sort event
			this.fireSort({sorterId:id});
	
			// goto first page via public API method (i.e. animated)
			this.firstPage();
	
		}
	
		// return instance to allow chaining
		return this;
	
	};
	

	/**
	 * Switch to first page.
	 *
	 * @type void
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	RowRepeater.prototype.firstPage = function() {
	
		// only execute if showMoreSteps is not bigger than 0
		if (this.getShowMoreSteps() > 0) {
			return this;
		}
	
		// local variable
		var iCurrentPage = this.getCurrentPage();
	
		// don't do anything if we are on the first page
		if (iCurrentPage === 1) {
			return this;
		}
	
		// keep pagers in sync
		this.getAggregation("footerPager").setCurrentPage(1);
	
		// start animation or just set the property
		if (this.getDomRef() && this.bShowAnimation) {
	
			// check if animation is running before starting a new animation
			if ( this.sCurrentAnimation !== null ) {
				this.aAnimationQueue.push({	name:RowRepeater.FIRST_PAGE,
					animationFunction:this.firstPage,
					args:arguments});
				return this;
			} else {
				this.sCurrentAnimation = RowRepeater.FIRST_PAGE;
			}
	
			// set property and animate
			this.iPreviousPage = iCurrentPage;
			this.setProperty("currentPage",1,true);
			this.startPagingAnimation();
	
		} else {
	
			// set property and invalidate
			this.setCurrentPage(1);
	
		}
	
		// fire page event
		this.firePage({currentPage:1,previousPage:iCurrentPage});
	
		// return instance for chaining
		return this;
	
	};
	

	/**
	 * Switch to last page.
	 *
	 * @type void
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	RowRepeater.prototype.lastPage = function() {
	
		// only execute if showMoreSteps is not bigger than 0
		if (this.getShowMoreSteps() > 0) {
			return this;
		}
	
		// local variable
		var iCurrentPage = this.getCurrentPage();
		var iLastPage = Math.ceil(this._getRowCount() / this.getNumberOfRows());
	
		// don't do anything if we are on the last page
		if (iCurrentPage === iLastPage) {
			return this;
		}
	
		// keep pagers in sync
		this.getAggregation("footerPager").setCurrentPage(iLastPage);
	
		// start animation or just set the property
		if (this.getDomRef() && this.bShowAnimation) {
	
			// check if animation is running before starting a new animation
			if ( this.sCurrentAnimation !== null ) {
				this.aAnimationQueue.push({	name:RowRepeater.LAST_PAGE,
					animationFunction:this.lastPage,
					args:arguments});
				return this;
			} else {
				this.sCurrentAnimation = RowRepeater.LAST_PAGE;
			}
	
			// set property and animate
			this.iPreviousPage = iCurrentPage;
			this.setProperty("currentPage",iLastPage,true);
			this.startPagingAnimation();
	
		} else {
	
			// set property and invalidate
			this.setCurrentPage(iLastPage);
	
		}
	
		// fire page event
		this.firePage({currentPage:iLastPage,previousPage:iCurrentPage});
	
		// return instance for chaining
		return this;
	
	};
	

	/**
	 * Switch to previous page.
	 *
	 * @type void
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	RowRepeater.prototype.previousPage = function() {
	
		// only execute if showMoreSteps is not bigger than 0
		if (this.getShowMoreSteps() > 0) {
			return this;
		}
	
		// local variable
		var iCurrentPage = this.getCurrentPage();
	
		// don't do anything if we are on the first page or even below
		if (iCurrentPage <= 1) {
			return this;
		}
	
		// keep pagers in sync
		this.getAggregation("footerPager").setCurrentPage(iCurrentPage - 1);
	
		// start animation or just set the property
		if (this.getDomRef() && this.bShowAnimation) {
	
			// check if animation is running before starting a new animation
			if ( this.sCurrentAnimation !== null ) {
				this.aAnimationQueue.push({	name:RowRepeater.PREVIOUS_PAGE,
					animationFunction:this.previousPage,
					args:arguments});
				return this;
			} else {
				this.sCurrentAnimation = RowRepeater.PREVIOUS_PAGE;
			}
	
			// set property and animate
			this.iPreviousPage = iCurrentPage;
			this.setProperty("currentPage",iCurrentPage - 1,true);
			this.startPagingAnimation();
	
		} else {
	
			// set property and invalidate
			this.setCurrentPage(iCurrentPage - 1);
	
		}
	
		// fire page event
		this.firePage({currentPage:iCurrentPage - 1,previousPage:iCurrentPage});
	
		// return instance for chaining
		return this;
	
	};
	

	/**
	 * Switch to next page.
	 *
	 * @type void
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	RowRepeater.prototype.nextPage = function() {
	
		// only execute if showMoreSteps is not bigger than 0
		if (this.getShowMoreSteps() > 0) {
			return this;
		}
	
		// local variable
		var iCurrentPage = this.getCurrentPage();
		var iLastPage = Math.ceil(this._getRowCount() / this.getNumberOfRows());
	
		// don't do anything if we are on the last page or even further
		if (iCurrentPage >= iLastPage) {
			return this;
		}
	
		// keep pagers in sync
		this.getAggregation("footerPager").setCurrentPage(iCurrentPage + 1);
	
		// start animation or just set the property
		if (this.getDomRef() && this.bShowAnimation) {
	
			// check if animation is running before starting a new animation
			if ( this.sCurrentAnimation !== null ) {
				this.aAnimationQueue.push({	name:RowRepeater.NEXT_PAGE,
					animationFunction:this.nextPage,
					args:arguments});
				return this;
			} else {
				this.sCurrentAnimation = RowRepeater.NEXT_PAGE;
			}
	
			// set property and animate
			this.iPreviousPage = iCurrentPage;
			this.setProperty("currentPage",iCurrentPage + 1,true);
			this.startPagingAnimation();
	
		} else {
	
			// set property and invalidate
			this.setCurrentPage(iCurrentPage + 1);
	
		}
	
		// fire page event
		this.firePage({currentPage:iCurrentPage + 1,previousPage:iCurrentPage});
	
		// return instance for chaining
		return this;
	
	};
	

	/**
	 * Switch to specified page.
	 *
	 * @param {int} iPageNumber
	 *         The index of the page to go to.
	 * @type void
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	RowRepeater.prototype.gotoPage = function(iPageNumber) {
	
		// only execute if showMoreSteps is not bigger than 0
		if (this.getShowMoreSteps() > 0) {
			return this;
		}
	
		// local variable
		var iCurrentPage = this.getCurrentPage();
		var iLastPage = Math.ceil(this._getRowCount() / this.getNumberOfRows());
	
		// don't do anything if page if not in range or same as before
		if (iPageNumber < 1 || iPageNumber > iLastPage || iCurrentPage === iPageNumber) {
			return this;
		}
	
		// keep pagers in sync
		this.getAggregation("footerPager").setCurrentPage(iPageNumber);
	
		// start animation or just set the property
		if (this.getDomRef() && this.bShowAnimation) {
	
			// check if animation is running before starting a new animation
			if ( this.sCurrentAnimation !== null ) {
				this.aAnimationQueue.push({	name:RowRepeater.GOTO_PAGE,
					animationFunction:this.gotoPage,
					args:arguments});
				return this;
			} else {
				this.sCurrentAnimation = RowRepeater.GOTO_PAGE;
			}
	
			// set property and animate
			this.iPreviousPage = iCurrentPage;
			this.setProperty("currentPage",iPageNumber,true);
			this.startPagingAnimation();
	
		} else {
	
			// set property and invalidate
			this.setCurrentPage(iPageNumber);
	
		}
	
		// fire page event
		this.firePage({currentPage:iPageNumber,previousPage:iCurrentPage});
	
		// return instance for chaining
		return this;
	
	};
	
	
	
	/*
	 * OVERRIDE OF SETTERS
	 */
	
	/**
	 * Setter for property <code>numberOfRows</code>.
	 *
	 * Default value is <code>5</code>
	 *
	 * @param {int} iNumberOfRows  new value for property <code>numberOfRows</code>
	 * @return {sap.ui.commons.RowRepeater} <code>this</code> to allow method chaining
	 * @public
	 */
	RowRepeater.prototype.setNumberOfRows = function(iNumberOfRows) {
	
		// change property without setting suppress rendering flag
		this.setProperty("numberOfRows", iNumberOfRows);
	
		// update the rows (maybe only when becoming visible?)
		if (this.getBinding("rows")) {
			this.updateRows(true);
		}
	
		// child controls might need a re-render after this change
		this.updateChildControls();
	
		// return instance to allow chaining
		return this;
	
	};
	
	/**
	 * Setter for property <code>currentPage</code>.
	 *
	 * @param {int} iCurrentPage  new value for property <code>currentPage</code>
	 * @return {sap.ui.commons.RowRepeater} <code>this</code> to allow method chaining
	 * @public
	 */
	RowRepeater.prototype.setCurrentPage = function(iCurrentPage) {
		
		if (this.getCurrentPage() != iCurrentPage) {
			// invalidate with this update
			this.setProperty("currentPage", iCurrentPage);
		
			// update the rows (maybe only when becoming visible?)
			if (this.getBinding("rows")) {
				this.updateRows(true);
			}
			
			// child controls might need a re-render after this change
			this.updateChildControls();
		}
	
		// return instance to allow chaining
		return this;
	
	};
	
	/**
	 * Override the default behavior of <code>setShowMoreSteps</code> to update the
	 * paging mode flag. Any change to the paging mode flag will result in the current
	 * page being set to the first page.
	 *
	 * @param {int} iShowMoreSteps  new value for property <code>showMoreSteps</code>
	 * @return {sap.ui.commons.RowRepeater} <code>this</code> to allow method chaining
	 * @public
	 */
	RowRepeater.prototype.setShowMoreSteps = function(iShowMoreSteps) {
	
		// calculate new paging mode by looking at step size
		var bNewPagingMode = iShowMoreSteps > 0 ? false : true,
				oBinding = this.getBinding("rows");
	
		// the state is to be reset if the mode changes
		if (bNewPagingMode !== this.bPagingMode) {
			this.bPagingMode = bNewPagingMode;
			this.setCurrentPage(1);
		}
	
		// set the property allowing a re-rendering of the row repeater
		this.setProperty("showMoreSteps", iShowMoreSteps);
		
		// in case of data binding we need to update the rows
		if (oBinding) {
			this._bSecondPage = false;
			this.updateRows(true);
		}
		
		return this;
	
	};
	
	
	/* refer to generated documentation */
	RowRepeater.prototype.insertRow = function(oRow, iIndex) {
		this.insertAggregation("rows", oRow, iIndex);
		this.updateChildControls();
		return this;
	};
	
	
	/* refer to generated documentation */
	RowRepeater.prototype.addRow = function(oRow) {
		this.addAggregation("rows", oRow);
		this.updateChildControls();
		return this;
	};
	
	
	/* refer to generated documentation */
	RowRepeater.prototype.removeRow = function(vElement) {
		this.removeAggregation("rows", vElement);
		this.updateChildControls();
		return this;
	};
	
	
	/* refer to generated documentation */
	RowRepeater.prototype.removeAllRows = function() {
		this.removeAllAggregation("rows");
		this.updateChildControls();
		return this;
	};
	
	
	/* refer to generated documentation */
	RowRepeater.prototype.destroyRows = function() {
		this.destroyAggregation("rows");
		this.updateChildControls();
		return this;
	};
	
	/* refer to generated documentation */
	RowRepeater.prototype.setThreshhold = function(iThreshold) {
		this.setProperty("threshold", iThreshold, true);
		return this;
	};
	
	/* refer to generated documentation */
	RowRepeater.prototype.insertFilter = function(oFilter, iIndex) {
	
		// insert a button into the filter toolbar's aggregation
		var oToolbar = this.getAggregation("filterToolbar");
		var sFilterId = oFilter.getId();
		var oButton = new sap.ui.commons.Button({text:oFilter.getText(),icon:oFilter.getIcon(),tooltip:oFilter.getTooltip(),press:[function(){this.applyFilter(sFilterId);},this]});
		oToolbar.insertItem(oButton,iIndex);
	
		this.insertAggregation("filters", oFilter, iIndex);
		return this;
	
	};
	
	
	/* refer to generated documentation */
	RowRepeater.prototype.addFilter = function(oFilter) {
	
		// add a button to the filter toolbar's aggregation
		var oToolbar = this.getAggregation("filterToolbar");
		var sFilterId = oFilter.getId();
		var oButton = new sap.ui.commons.Button({text:oFilter.getText(),icon:oFilter.getIcon(),tooltip:oFilter.getTooltip(),press:[function(){this.applyFilter(sFilterId);},this]});
		oToolbar.addItem(oButton);
	
		this.addAggregation("filters", oFilter);
		return this;
	};
	
	
	/* refer to generated documentation */
	RowRepeater.prototype.removeFilter = function(vElement) {
	
		// remove button from toolbar
		var oToolbar = this.getAggregation("filterToolbar");
		oToolbar.removeItem(vElement);
	
		return this.removeAggregation("filters", vElement);
	};
	
	
	/* refer to generated documentation */
	RowRepeater.prototype.removeAllFilters = function() {
	
		// remove all buttons from toolbar
		var oToolbar = this.getAggregation("filterToolbar");
		oToolbar.removeAllItems();
	
		return this.removeAllAggregation("filters");
	};
	
	
	/* refer to generated documentation */
	RowRepeater.prototype.destroyFilters = function() {
	
		// remove all buttons from toolbar
		var oToolbar = this.getAggregation("filterToolbar");
		oToolbar.removeAllItems();
	
		this.destroyAggregation("filters");
		return this;
	};
	
	
	/* refer to generated documentation */
	RowRepeater.prototype.insertSorter = function(oSorter, iIndex) {
	
		// add a button to the sorter toolbar's aggregation
		var oToolbar = this.getAggregation("sorterToolbar");
		var sSorterId = oSorter.getId();
		var oButton = new sap.ui.commons.Button({text:oSorter.getText(),icon:oSorter.getIcon(),tooltip:oSorter.getTooltip(),press:[function(){this.triggerSort(sSorterId);},this]});
		oToolbar.insertItem(oButton,iIndex);
	
		this.insertAggregation("sorters", oSorter, iIndex);
		return this;
	};
	
	
	/* refer to generated documentation */
	RowRepeater.prototype.addSorter = function(oSorter) {
	
		// add a button to the sorter toolbar's aggregation
		var oToolbar = this.getAggregation("sorterToolbar");
		var sSorterId = oSorter.getId();
		var oButton = new sap.ui.commons.Button({text:oSorter.getText(),icon:oSorter.getIcon(),tooltip:oSorter.getTooltip(),press:[function(){this.triggerSort(sSorterId);},this]});
		oToolbar.addItem(oButton);
	
		this.addAggregation("sorters", oSorter);
		return this;
	};
	
	
	/* refer to generated documentation */
	RowRepeater.prototype.removeSorter = function(vElement) {
	
		// remove button from toolbar
		var oToolbar = this.getAggregation("sorterToolbar");
		oToolbar.removeItem(vElement);
	
		return this.removeAggregation("sorters", vElement);
	};
	
	
	/* refer to generated documentation */
	RowRepeater.prototype.removeAllSorters = function() {
	
		// remove all buttons from toolbar
		var oToolbar = this.getAggregation("sorterToolbar");
		oToolbar.removeAllItems();
	
		return this.removeAllAggregation("sorters");
	};
	
	
	/* refer to generated documentation */
	RowRepeater.prototype.destroySorters = function() {
	
		// remove all buttons from toolbar
		var oToolbar = this.getAggregation("sorterToolbar");
		oToolbar.removeAllItems();
	
		this.destroyAggregation("sorters");
		return this;
	};
	
	
	/*
	 * ANIMATION METHODS
	 */
	
	RowRepeater.prototype.startPagingAnimation = function() {
	
		// local variables
		var oCore = sap.ui.getCore(),
		    oRenderManager = oCore.getRenderManager(),
		    sId = this.getId(),
		    iPageFrom = this.iPreviousPage,
		    iPageTo = this.getCurrentPage(),
		    iNumberOfRows = this.getNumberOfRows(),
		    iStartIndex = (iPageTo - 1) * iNumberOfRows,
		    aRows = this.getRows(),
		    iCurrentVisibleRows = this._getRowCount() > iNumberOfRows * iPageTo ? iNumberOfRows : this._getRowCount() - iNumberOfRows * (iPageTo - 1),
		    n,
		    oBinding = this.getBinding("rows");
	
		// DOM elements
		var oDomCurrentLI,
		    oJQDomULFrom = this.$("page_" + iPageFrom),
		    oDomBodyDIV = this.getDomRef("body"),
		    oJQDomBodyDIV = jQuery(oDomBodyDIV);
	
		// fix the height on the body DIV to allow an animated height change
		oJQDomBodyDIV.css("height",oJQDomBodyDIV.outerHeight());
	
		// create UL for new page
		var sDirection;
		if (sap.ui.getCore() && sap.ui.getCore().getConfiguration() && sap.ui.getCore().getConfiguration().getRTL()) {
			sDirection = (iPageTo < iPageFrom) ? "left" : "right";
		} else {
			sDirection = (iPageTo < iPageFrom) ? "right" : "left";
		}
	
		// load the required contexts
		if (oBinding) {
			// update the rows aggregation
			this._bSecondPage = !this._bSecondPage;
			this.updateRows(true);
			aRows = this.getRows();
			iStartIndex = (this._bSecondPage ? 1 : 0) * iNumberOfRows;
		}
	
		// create the rows where we navigate to in the DOM
		var sStyleString = "\"top:-" + oJQDomULFrom.outerHeight(true) + "px;" + sDirection + ":" + oJQDomULFrom.outerWidth(true) + "px;\"";
		jQuery("<ul id=\"" + sId + "-page_" + iPageTo + "\" class=\"sapUiRrPage\" style=" + sStyleString + "/>").appendTo(oDomBodyDIV);
		var oDomULTo = oDomBodyDIV.lastChild;
		var oJQDomULTo = jQuery(oDomULTo);
		for ( n = iStartIndex; n < iStartIndex + iCurrentVisibleRows; n++ ) {
			jQuery("<li id=\"" + sId + "-row_" + n + "\" class=\"sapUiRrRow\"/>").appendTo(oDomULTo);
			oDomCurrentLI =  oDomULTo.lastChild;
			oRenderManager.render(aRows[n], oDomCurrentLI);
		}
	
		// animate the paging effect
		if (sDirection === "right") {
			oJQDomULFrom.animate({right: -oJQDomULFrom.outerWidth(true)},"slow");
			oJQDomULTo.animate({right:0},"slow");
		} else {
			oJQDomULFrom.animate({left: -oJQDomULFrom.outerWidth(true)},"slow");
			oJQDomULTo.animate({left:0},"slow");
		}
	
		// animate the height change if number of displayed rows changes
		oJQDomBodyDIV.animate({height:oJQDomULTo.outerHeight(true)},"slow",jQuery.proxy(this.endPagingAnimation,this));
	
	};
	
	
	RowRepeater.prototype.endPagingAnimation = function() {
	
		// local variables
		// get all needed DOM objects
		var oDomDIV = this.getDomRef("body");
		var oDomOldUL = this.getDomRef("page_" + this.iPreviousPage);
		var oDomCurrentUL = this.getDomRef("page_" + this.getCurrentPage());
		var oJQDomCurrentUL = jQuery(oDomCurrentUL);
	
		// un-fix the height on DIV
		jQuery(oDomDIV).css("height","");
	
		// remove the old UL from DOM
		jQuery(oDomOldUL).remove();
	
		// remove positioning from new UL
		var sDirection;
		if (sap.ui.getCore() && sap.ui.getCore().getConfiguration() && sap.ui.getCore().getConfiguration().getRTL()) {
			sDirection = (this.getCurrentPage() < this.iPreviousPage) ? "left" : "right";
		} else {
			sDirection = (this.getCurrentPage() < this.iPreviousPage) ? "right" : "left";
		}
		oJQDomCurrentUL.css("top","");
		oJQDomCurrentUL.css(sDirection,"");
	
		// reset animation indicator
		this.sCurrentAnimation = null;
	
		// start new animation
		this.nextQueuedAnimation();
	
	};
	
	
	RowRepeater.prototype.startResizeAnimation = function() {
	
		// variables
		var oRenderManager = sap.ui.getCore().getRenderManager(),
		    iNewNumberOfRows = this.getNumberOfRows(),
		    iOldNumberOfRows = this.iPreviousNumberOfRows,
		    sId = this.getId(),
		    iSizeDelta = 0,
		    aRows,
		    oBinding = this.getBinding("rows");
	
		// dom elements
		var oDomCurrentLI,
		    oDomBodyDIV = this.getDomRef("body"),
		    oJQDomBodyDIV = jQuery(oDomBodyDIV),
		    oDomPageUL = this.getDomRef("page_" + this.getCurrentPage());
	
		// fix the height
		oJQDomBodyDIV.css("height",oJQDomBodyDIV.outerHeight());
	
		// update the rows aggregation
		if (oBinding) {
			this.updateRows(true);
		}
		aRows = this.getRows();
		
		// check if control is growing or shrinking
		if (iNewNumberOfRows > iOldNumberOfRows) {
	
			// create all newly visible child elements, if size grows
			for (var n = iOldNumberOfRows; n < iNewNumberOfRows; n++) {
				jQuery("<li id=\"" + sId + "-row_" + n + "\" class=\"sapUiRrRow\"/>").appendTo(oDomPageUL);
				oDomCurrentLI = oDomPageUL.lastChild;
				oRenderManager.render(aRows[n], oDomCurrentLI);
			}
	
		} else {
	
			// measure controls to be removed and store them in array for later removal
			for (var n = iNewNumberOfRows; n < iOldNumberOfRows; n++) {
				oDomCurrentLI = this.getDomRef("row_" + n);
				iSizeDelta -= jQuery(oDomCurrentLI).outerHeight(true);
				this.aRemoveBuffer.push(oDomCurrentLI);
			}
	
		}
	
		// animate resize of container
		oJQDomBodyDIV.animate({height:jQuery(oDomPageUL).outerHeight(true) + iSizeDelta},"slow",jQuery.proxy(this.endResizeAnimation,this));
	
	};
	
	
	RowRepeater.prototype.endResizeAnimation = function() {
	
		// get body DIV
		var oDomBodyDIV = this.getDomRef("body");
	
		// remove LI element after shrinking
		while ( this.aRemoveBuffer.length > 0 ) {
			jQuery(this.aRemoveBuffer.pop()).remove();
		}
	
		// un-fix the height on DIV
		jQuery(oDomBodyDIV).css("height","");
	
		// reset animation indicator
		this.sCurrentAnimation = null;
	
		// start new animation
		this.nextQueuedAnimation();
	
	};
	
	
	RowRepeater.prototype.nextQueuedAnimation = function() {
	
		// local variables
		var oNextAnimation, oLastQueuedAnimation;
		var iCounter = 1;
		var aQueue = this.aAnimationQueue;
		var iPageNumber, iNumberOfRows;
	
		// get first one
		if (aQueue.length > 0) {
			oNextAnimation = aQueue.shift();
		}
	
		// if there are more in the queue of same name we try to summarize
		if (oNextAnimation && aQueue.length > 0) {
	
			// remove all upcoming animations with same name
			while (aQueue[0] && aQueue[0].name === oNextAnimation.name) {
				iCounter++;
				oLastQueuedAnimation = aQueue.shift();
			}
	
			// reaction depends of animation name
			if (iCounter > 0) {
				switch (oNextAnimation.name) {
				case RowRepeater.SHOW_MORE:
					// replace with resize of summarized size
					iNumberOfRows = Math.min(this._getRowCount(),this.getNumberOfRows() + this.getShowMoreSteps() * iCounter);
					oNextAnimation = {	name:RowRepeater.RESIZE,
							animationFunction:this.resize,
							args:[iNumberOfRows]};
					break;
				case RowRepeater.RESIZE:
					// execute the last one and skip the ones before
					oNextAnimation = oLastQueuedAnimation;
					break;
				case RowRepeater.FIRST_PAGE:
					// the animations are duplicates and can be droppped
					break;
				case RowRepeater.LAST_PAGE:
					// the animations are duplicates and can be droppped
					break;
				case RowRepeater.PREVIOUS_PAGE:
					// replace with goto page
					iPageNumber = Math.max(1,this.getCurrentPage() - iCounter);
					oNextAnimation = {	name:RowRepeater.GOTO_PAGE,
							animationFunction:this.gotoPage,
							args:[iPageNumber]};
					break;
				case RowRepeater.NEXT_PAGE:
					// replace with goto page
					iPageNumber = Math.min(Math.ceil(this._getRowCount() / this.getNumberOfRows()),this.getCurrentPage() + iCounter);
					oNextAnimation = {	name:RowRepeater.GOTO_PAGE,
							animationFunction:this.gotoPage,
							args:[iPageNumber]};
					break;
				case RowRepeater.GOTO_PAGE:
					// execute the last one and skip the ones before
					oNextAnimation = oLastQueuedAnimation;
					break;
				}
			}
	
		}
	
		// finally execute
		if (oNextAnimation) {
			oNextAnimation.animationFunction.apply(this,oNextAnimation.args);
		}
	
	};
	
	
	/*
	 * INTERNAL METHODS
	 */
	
	/**
	 * Handle paging events from the Paginator(s)
	 *
	 * @private
	 */
	 RowRepeater.prototype.paging = function(oEvent) {
	
		 switch (oEvent.getParameter("type")) {
			 case sap.ui.commons.PaginatorEvent.First:
				 this.firstPage();
				 break;
			 case sap.ui.commons.PaginatorEvent.Last:
				 this.lastPage();
				 break;
			 case sap.ui.commons.PaginatorEvent.Previous:
				 this.previousPage();
				 break;
			 case sap.ui.commons.PaginatorEvent.Next:
				 this.nextPage();
				 break;
			 case sap.ui.commons.PaginatorEvent.Goto:
				 this.gotoPage(oEvent.getParameter("targetPage"));
				 break;
		 }
	
	 }
	
	/**
	 * Update the state of aggregated child controls inside this row repeater.
	 *
	 * @private
	 */;
	RowRepeater.prototype.updateChildControls = function() {
	
		// local referenced to controls
		var oShowMoreButton, oPager;
	
		// local variables
		var bShowMoreEnabled;
	
		// only care about pagers if we are in paging mode, otherwise it is the showMore buttons
		if (this.bPagingMode) {
	
			// the pager is itself responsible for activation, just update the page info
			var iCurrentPage = this.getCurrentPage();
			var iLastPage = Math.ceil( this._getRowCount() / this.getNumberOfRows() );
			if (this._getRowCount() == 0) {
				iLastPage = 1;
			}
			
			// update header pager
			oPager = this.getAggregation("footerPager");
			if (oPager) {
				oPager.setCurrentPage( iCurrentPage );
				oPager.setNumberOfPages( iLastPage );
			}
	
		} else {
	
			// show more buttons are only active if there are more lines to show
			bShowMoreEnabled = this._getRowCount() > this.getNumberOfRows();
	
			// update header showMore button
			oShowMoreButton = this.getAggregation("headerShowMoreButton");
			if (oShowMoreButton) {
				oShowMoreButton.setEnabled(bShowMoreEnabled);
			}
	
			// update footer showMore button
			oShowMoreButton = this.getAggregation("footerShowMoreButton");
			if (oShowMoreButton) {
				oShowMoreButton.setEnabled(bShowMoreEnabled);
			}
	
		}
	
	};
	
	
	/**
	 * Verify if the rows aggregation of this control is bound.
	 */
	RowRepeater.prototype.isBound = function(sName) {
		return sap.ui.core.Element.prototype.isBound.call(this, sName || "rows");
	};
	
	/**
	 * Returns the row count. If aggregation rows is bound the count will be the length of the binding,
	 * otherwise the count of the rows aggregation will be returned 
	 * @private
	 */
	RowRepeater.prototype._getRowCount = function() {
		var oBinding = this.getBinding("rows");
		if (oBinding) {
			return oBinding.getLength();
		} else {
			return this.getRows().length;
		}
	};
	
	/**
	 * Override unbindAggregation to clean up the "rows" aggregation 
	 * @private
	 */
	RowRepeater.prototype.unbindAggregation = function(sName) {
		sap.ui.core.Element.prototype.unbindAggregation.apply(this, arguments);
		if (sName === "rows") {
			this.destroyRows();
		}
		return this;
	};

	/**
	* Override refreshRows to enable paging
	* @private
	*/
	RowRepeater.prototype.refreshRows = function() {

		// collect the relevant informations
		var oBindingInfo = this.getBindingInfo("rows"),
			oBinding = oBindingInfo.binding,
			iRowCount = this._getRowCount(),
			iNumberOfRows = this.getNumberOfRows(),
			iNewRowCount = Math.min(iRowCount, iNumberOfRows),
			iThreshold = this.getThreshold();

		// Reset current page
		this.setProperty("currentPage", 1, true);

		// call getContext to trigger data load
		oBinding.getContexts(0, iNewRowCount, iThreshold);

	};

	/**
	 * Override updateRows to enable paging 
	 * @private
	 */
	RowRepeater.prototype.updateRows = function(bViaAPI) {
		
		// collect the relevant informations
		var oBindingInfo = this.getBindingInfo("rows"),
		    fnFactory = oBindingInfo.factory,
		    oBinding = oBindingInfo.binding,
		    iShowMoreSteps = this.getShowMoreSteps(),
		    bShowMore = iShowMoreSteps > 0,
		    iCurrentPage = this.getCurrentPage(),
		    iRowCount = this._getRowCount(),
		    iNumberOfRows = this.getNumberOfRows(),
		    iNewRowCount = Math.min(iRowCount, iNumberOfRows),
		    iLastPage = Math.ceil(iRowCount / iNumberOfRows) || 1;
		    
		// boundary check for the current page to avoid invalid pages
		if (iCurrentPage > iLastPage) {
			iCurrentPage = iLastPage;
			this.setProperty("currentPage", iCurrentPage);
			this._bSecondPage = false;
		}
	
		// collect the binding relevant information
		var iFirstRow = bShowMore ? 0 : (iCurrentPage - 1) * iNewRowCount,
		    iRowsOffset = (this._bSecondPage ? 1 : 0) * iNewRowCount,
		    iThreshold = this.getThreshold(), // || (bShowMore ? Math.min(iRowCount, iNewRowCount + iShowMoreSteps) : iNewRowCount * 2),
		    aContexts = oBinding ? oBinding.getContexts(iFirstRow, iNewRowCount, iThreshold) : [];
		
		if (bViaAPI !== true) {
	
			// if not called internally via API we create the rows aggregation
			// because then this function is called after the connection between the 
			// control and the model has been established!
			this._bSecondPage = false;
			this.destroyRows();
			for (var i = 0, l = iNewRowCount; i < l; i++) {
				var sId = this.getId() + "-" + i,
				    oClone = fnFactory(sId, aContexts[i]);
				oClone.setBindingContext(aContexts[i], oBindingInfo.model);
				this.addRow(oClone);
			}
			
			// TODO: in future we might think about a performance improvement to render
			// only those lines where the factory returns another template and the rest
			// is simply adopted by applying a new context. For now in case of the 
			// model loads additional data we simply rerender the complete row-repeater
			// or when the binding is changed!
			
		} else {
		
			// if called via API we need to only create the additional rows (paging) 
			// and bind them properly by updating their binding contexts
			this._bSuppressInvalidate = true;
		
			for (var i = 0, l = iNewRowCount; i < l; i++) {
				var iIndex = iRowsOffset + i;
				var oRow = this.getRows()[iIndex];
				// when paging we remove the row again because we need to recreate it via 
				// the factory function to make sure to react on data specific rendering
				if (!bShowMore) {
					if (oRow) {
						this.removeAggregation("rows", oRow, true);
						oRow.destroy();
					}
					oRow = undefined;
				}
				// if the row doesn't exist yet, we recreate the row and insert it into
				// the rows aggregation and afterwards we bind the context
				if (!oRow) {
					var sId = this.getId() + "-" + iIndex;
					oRow = fnFactory(sId, aContexts[i]);
					oRow.setBindingContext(aContexts[i], oBindingInfo.model);
					this.insertAggregation("rows", oRow, iIndex, true);
				} else {
					oRow.setBindingContext(aContexts[i], oBindingInfo.model);
				}
			}
			
			this._bSuppressInvalidate = false;
			
		}
		
		// update the child controls
		this.updateChildControls();
		
	};
	
	RowRepeater.prototype.invalidate = function(oOrigin) {
		// if we do not suppress the invalidation, the first time another page
		// is displayed the complete row repeater gets invalidated and rerendered
		// because a property of a not renderered control is changed via setting the
		// databinding context.
		if (this._bSuppressInvalidate) {
			return; // suppress the invalidation of the rows (when exchanging the binding contexts)
		}
		Control.prototype.invalidate.apply(this, arguments);
	};
	

	return RowRepeater;

}, /* bExport= */ true);
