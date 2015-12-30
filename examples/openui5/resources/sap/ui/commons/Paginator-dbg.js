/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.commons.Paginator.
sap.ui.define(['jquery.sap.global', './library', 'sap/ui/core/Control'],
	function(jQuery, library, Control) {
	"use strict";



	/**
	 * Constructor for a new Paginator.
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * Provides navigation between pages within a list of numbered pages.
	 * @extends sap.ui.core.Control
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @alias sap.ui.commons.Paginator
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var Paginator = Control.extend("sap.ui.commons.Paginator", /** @lends sap.ui.commons.Paginator.prototype */ { metadata : {

		library : "sap.ui.commons",
		properties : {

			/**
			 * Represents the current page (first page has index 1, not 0, to match the visual number)
			 */
			currentPage : {type : "int", group : "Misc", defaultValue : 1},

			/**
			 * Represents the overall number of pages that are embedded into the parent control
			 */
			numberOfPages : {type : "int", group : "Misc", defaultValue : null}
		},
		events : {

			/**
			 * Event is fired when the user navigates to another page by selecting it directly, or by jumping forward/backward.
			 */
			page : {
				parameters : {

					/**
					 * The page which is the current one before the page event is fired (and another page is displayed)
					 */
					srcPage : {type : "int"},

					/**
					 * The page that shall be displayed next after the page event is fired.
					 *
					 * The page number is 1-based: the first page has index 1, not 0, to match the number visible in the UI.
					 */
					targetPage : {type : "int"},

					/**
					 * Provides the values 'First', 'Last', 'Next', 'Previous', 'Goto'. The event parameter informs the application
					 * how the user navigated to the new page: Whether the 'Next' button was used, or another button, or whether the page was directly
					 * selected
					 */
					type : {type : "sap.ui.commons.PaginatorEvent"}
				}
			}
		}
	}});

	/*
	 * All animations of the Paginator control can be centrally switched
	 * off by setting the <code>bShowAnimation</code> flag to <code>false</code>.
	 * @private
	 */

	// Constants declaration
	Paginator.MAX_NUMBER_PAGES = 5;

	/**
	 * Init function
	 * @private
	 */
	Paginator.prototype.init = function(){
		//Animations are set to true by default, then on control initialization, check the number of pages
		this.bShowAnimation = true;
	};


	/**
	 * When the user clicks on a page link, we navigate to that page, either with animation or with rerendering
	 * @param {jQuery.Event} oEvent The current event
	 * @private
	 */
	Paginator.prototype.onclick = function(oEvent){
		if (oEvent && oEvent.target) {

			// Supress triggering beforeunload in IE
			oEvent.preventDefault();

			// go up one node if unnamed element is the source
			var target = oEvent.target;
			if (!target.id) {
				target = target.parentNode;
			}

			if (target.id && target.id != this.getId() + "-pages") {

				// Retrieve from where the event originated
				var aArray = target.id.split("--");

				// only do something if relevant item has been clicked
				if (aArray.length > 1) {
					var lastPart = aArray[aArray.length - 1];

					// What type of event will be sent
					var sEventType = null;

					// Buffer the current page as the sourcePage
					var iSrcPage = this.getCurrentPage();
					var iTargetPage = iSrcPage; // will be changed below

					// we have a number - a page has been clicked
					if (lastPart.match(/^\d+$/)) {
						sEventType = sap.ui.commons.PaginatorEvent.Goto;
						iTargetPage = parseInt(lastPart, 10);

					} else if (lastPart == "firstPageLink") {
						sEventType = sap.ui.commons.PaginatorEvent.First;
						iTargetPage = 1;

					} else if (lastPart == "backLink") {
						sEventType = sap.ui.commons.PaginatorEvent.Previous;
						iTargetPage = Math.max(iSrcPage - 1, 1);

					} else if (lastPart == "forwardLink") {
						sEventType = sap.ui.commons.PaginatorEvent.Next;
						iTargetPage = Math.min(iSrcPage + 1, this.getNumberOfPages());

					} else if (lastPart == "lastPageLink") {
						sEventType = sap.ui.commons.PaginatorEvent.Last;
						iTargetPage = this.getNumberOfPages();

					} // else should not happen

					if (iTargetPage != iSrcPage) {
						if (this.bShowAnimation) {
							this.setCurrentPage(iTargetPage, true); // update current page without re-rendering...
							this.triggerPaginatorAnimation(); // ...and animate
						} else {
							this.setCurrentPage(iTargetPage); // includes re-rendering
						}

						// fire the "page" event
						this.firePage({srcPage:iSrcPage,targetPage:iTargetPage,type:sEventType});
					}
				}
			}
		}
	};

	Paginator.prototype.setCurrentPage = function(iTargetPage, bSuppressRerendering) {
		this.setProperty("currentPage", iTargetPage, bSuppressRerendering);
		if (this.getDomRef()) {
			sap.ui.commons.PaginatorRenderer.updateBackAndForward(this);
		}
	};

	/**
	 * When animation is set to true, this function will use jQuery to animate the paginator
	 * as if the page numbers were sliding left/right.
	 * @private
	 */
	Paginator.prototype.triggerPaginatorAnimation = function() {
		var aIndicesToHide = [];
		var aIndicesToShow = [];
		var paginatorId = this.getId();
		var aChildren = jQuery.sap.byId(paginatorId + "-pages").children();

		// Get the ranges we need to display before and after the animation
		var oNewRange = this._calculatePagesRange();
		var oOldRange;
		if (this._oOldRange) {
			oOldRange = this._oOldRange;
		} else {
			oOldRange = {};
			var aParts = aChildren[0].id.split("--");
			oOldRange.firstPage = parseInt(aParts[aParts.length - 1], 10);
			aParts = aChildren[aChildren.length - 1].id.split("--");
			oOldRange.lastPage = parseInt(aParts[aParts.length - 1], 10);
		}

		// the pages to be shown only after the animation are those to be rendered invisible, initially
		var i;
		for (i = oNewRange.firstPage; i <= oNewRange.lastPage; i++) {
			if (i < oOldRange.firstPage || i > oOldRange.lastPage) {
				aIndicesToShow.push(i);
			}
		}
		var oInvisibleRange = {
				firstPage:aIndicesToShow[0],
				lastPage:aIndicesToShow[aIndicesToShow.length - 1]
		};

		// the pages to be shown initially, but NOT after the animation, are those to fade out
		for (i = oOldRange.firstPage; i <= oOldRange.lastPage; i++) {
			if (i < oNewRange.firstPage || i > oNewRange.lastPage) {
				aIndicesToHide.push(i);
			}
		}

		// build the html for both the initially visible and still invisible pages
		var oldHtml = sap.ui.commons.PaginatorRenderer.getPagesHtml(this.getId(), oOldRange, this.getCurrentPage(), true);
		var newHtml = sap.ui.commons.PaginatorRenderer.getPagesHtml(this.getId(), oInvisibleRange, this.getCurrentPage(), false);
		if (oOldRange.firstPage < oInvisibleRange.firstPage) {
			newHtml = oldHtml + newHtml;
		} else {
			newHtml = newHtml + oldHtml;
		}


		// remember focus
		var focElem = document.activeElement;
		var focId = focElem ? focElem.id : undefined; // remember ID of focused element - it should still be focused after rendering

		this.getDomRef("pages").innerHTML = newHtml;

		// restore focus
		if (focId) {
			// Set focus on the previously focused element.
			// jQuery does not like document.activeElement, so we have to fetch it
			// from the DOM again.
			focElem = jQuery.sap.domById(focId);
		} else {
			// Set focus to active page link if no other element was active before
			focElem = jQuery.sap.domById("testPaginator-a--" + this.getCurrentPage());
		}

		jQuery.sap.focus(focElem);


		// Use jQuery hide/show to animate the paging
		var prefix = this.getId() + "-li--";

		this._oOldRange = oNewRange;

		function removeAfterAnimation(){ // remove the DOM elements after the animation
			var elem = jQuery.sap.domById(this.id);
			if (elem) {
				elem.parentNode.removeChild(elem);
			}
		}

		for (i = 0 ; i < aIndicesToHide.length; i++) {
			var id = prefix + aIndicesToHide[i];
			jQuery.sap.byId(id).hide(400, removeAfterAnimation);
		}

		for (i = 0 ; i < aIndicesToShow.length; i++) {
			jQuery.sap.byId(prefix + aIndicesToShow[i]).show(400);
		}
	};


	/**
	 * Calculates what is the first page and last page to display (The current range).
	 * Ensure that when we go over 5 pages, the current page will always be rendered centered
	 * In this case, middle -2 and middle + 2 to get to full 5 pages range
	 * @return {object} oPageRange object containing first page and last page to display
	 * @private
	 */
	Paginator.prototype._calculatePagesRange = function(){

		//Setting default values
		var iFirstPage = 1;
		var iLastPage = this.getNumberOfPages();
		var iCurrentPage = this.getCurrentPage();
		var iNbPages = this.getNumberOfPages();

		//From page 1 to page 5, we display 1 to 10 or less
		if ( iCurrentPage < 4 ) {

			iFirstPage = 1;

			//Check if last page does not go over 5 --> iLastPage is already set with nbPages above
			if (iLastPage > Paginator.MAX_NUMBER_PAGES) {
				iLastPage = Paginator.MAX_NUMBER_PAGES;
			}

			//Now, the current page is more than 3, so we need to shift the range
		} else if (iCurrentPage == iLastPage) { //Reached the last page
			//How many pages exist, if less than 5, simply substract the nb of pages from the last one (range is in this case 1 to max 5)
			if (iNbPages < 5) {
				iFirstPage = 1;
			} else { //More than 5 pages, substract 4 pages to have the 5 pages range
				iFirstPage = iLastPage - 4;
			}
		} else if ( iLastPage - iCurrentPage < 3 ) {
			//Last page - current page is below 3, substract 4 to always see the right range for the last 2 pages
			iFirstPage = iLastPage - 4;
		} else { //All other case, create the range from the current page +-2
			iFirstPage = iCurrentPage - 2;
			iLastPage = iCurrentPage + 2;
		}

		return { firstPage : iFirstPage, lastPage : iLastPage };
	};


	/**
	 * @param {jQuery.Event} oEvent the browser event
	 * @private
	 */
	Paginator.prototype.onkeydown = function(oEvent){

		//Get the event type and dispatch to the keyboard navigation manager
		var aEvents = oEvent.getPseudoTypes();

		//Tab
		if (jQuery.inArray("saptabnext", aEvents) != -1) {
			this.triggerTabbingNavigation(oEvent,false);
		} else if (jQuery.inArray("saptabprevious", aEvents) != -1) {
			//Shift/tab
			this.triggerTabbingNavigation(oEvent,true);
		} else if (jQuery.inArray("sapincrease", aEvents) != -1) {
			//Moves focus to the right (Right arrow key)
			this.triggerInternalNavigation(oEvent,"next");
		} else if (jQuery.inArray("sapdecrease", aEvents) != -1) {
			//Moves focus to the left (Left arrow key)
			this.triggerInternalNavigation(oEvent,"previous");
		}

	};


	/**
	 * This function will navigate left and right in the paginator, skipping non tabbable elements
	 * @param {jQuery.Event} oEvent the browser event
	 * @param {string} sDirection Navigation left or right
	 * @private
	 */
	Paginator.prototype.triggerInternalNavigation = function(oEvent,sDirection){

		var aFocusableElements = jQuery(this.getDomRef()).find(":sapFocusable");
		var iCurrentIndex = jQuery(aFocusableElements).index(oEvent.target);
		var iNextIndex, oNextElement;

		//Right key pressed
		if (sDirection == "next") {
			iNextIndex = iCurrentIndex + 1;
			if (jQuery(oEvent.target).hasClass("sapUiPagCurrentPage")) {
				iNextIndex = iNextIndex + 1;
			}
			oNextElement = aFocusableElements[iNextIndex];
			if (oNextElement) {
				jQuery(oNextElement).focus();
				oEvent.preventDefault();
				oEvent.stopPropagation();
			}
		} else if (sDirection == "previous" && aFocusableElements[iCurrentIndex - 1]) {
			//Left key pressed
			iNextIndex = iCurrentIndex - 1;
			oNextElement = aFocusableElements[iNextIndex];
			if (oNextElement && jQuery(oNextElement).hasClass("sapUiPagCurrentPage")) {
				oNextElement = aFocusableElements[iNextIndex - 1];
			}
			if (oNextElement) {
				jQuery(oNextElement).focus();
				oEvent.preventDefault();
				oEvent.stopPropagation();
			}
		}

	};

	/**
	 * This function will handle the TAB key in the paginator (simple group)
	 * @param {jQuery.Event} oEvent the browser event
	 * @param {boolean} shiftKeyPressed Tabbing or shift-Tabbing
	 * @private
	 */
	Paginator.prototype.triggerTabbingNavigation = function(oEvent,shiftKeyPressed){

		//Get all focusable elements
		var aFocusableElements = jQuery(this.getDomRef()).find(":sapFocusable");

		//Tabbing --> Focus the last active element then let the browser focus the next active element
		if (!shiftKeyPressed) {
			jQuery(aFocusableElements[aFocusableElements.length - 1]).focus();
		} else { //Shift/Tab keys pressed --> Focus the 2nd active element then let the browser focus the first active element

			//Which element triggered the event
			var iCurrentIndex = jQuery(aFocusableElements).index(oEvent.target);

			//If the focus is already on the first active element, let the browser move the focus
			if (iCurrentIndex != 0) {
				jQuery(aFocusableElements[0]).focus();
			}
		}
	};

	Paginator.prototype.getFocusInfo = function() {
		var sId = this.$().find(":focus").attr("id");
		if (sId) {
			return {customId: sId};
		} else {
			return sap.ui.core.Element.prototype.getFocusInfo.apply(this, arguments);
		}
	};

	Paginator.prototype.applyFocusInfo = function(mFocusInfo) {
		if (mFocusInfo && mFocusInfo.customId) {
			this.$().find("#" + mFocusInfo.customId).focus();
		} else {
			sap.ui.core.Element.prototype.getFocusInfo.apply(this, arguments);
		}
		return this;
	};




	return Paginator;

}, /* bExport= */ true);
