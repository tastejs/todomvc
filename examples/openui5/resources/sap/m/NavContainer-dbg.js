/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.m.NavContainer.
sap.ui.define(['jquery.sap.global', './library', 'sap/ui/core/Control', 'sap/ui/core/PopupSupport'],
	function(jQuery, library, Control, PopupSupport) {
	"use strict";



	/**
	 * Constructor for a new NavContainer.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * The NavContainer control handles hierarchic navigation between Pages or other fullscreen controls.
	 *
	 * All children of this control will receive navigation events like {@link sap.m.NavContainerChild#beforeShow beforeShow}, they are documented in the pseudo interface {@link sap.m.NavContainerChild sap.m.NavContainerChild}
	 * @extends sap.ui.core.Control
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @alias sap.m.NavContainer
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var NavContainer = Control.extend("sap.m.NavContainer", /** @lends sap.m.NavContainer.prototype */ { metadata : {

		library : "sap.m",
		properties : {

			/**
			 * Determines whether the initial focus is set automatically on first rendering and after navigating to a new page.
			 * This is useful when on touch devices the keyboard pops out due to the focus being automatically set on an input field.
			 * If necessary the "afterShow" event can be used to focus another element.
			 * @since 1.30.8
			 */
			autoFocus: {type: "boolean", group: "Behavior", defaultValue: true},

			/**
			 * The height of the NavContainer. Can be changed when the NavContainer should not cover the whole available area.
			 */
			height : {type : "sap.ui.core.CSSSize", group : "Dimension", defaultValue : '100%'},

			/**
			 * The width of the NavContainer. Can be changed when the NavContainer should not cover the whole available area.
			 */
			width : {type : "sap.ui.core.CSSSize", group : "Dimension", defaultValue : '100%'},

			/**
			 * Whether the NavContainer is visible.
			 */
			visible : {type : "boolean", group : "Appearance", defaultValue : true},

			/**
			 * The type of the transition/animation to apply when "to()" is called without defining a transition type to use. The default is "slide". Other options are: "fade", "flip" and "show" - and the names of any registered custom transitions.
			 * @since 1.7.1
			 */
			defaultTransitionName : {type : "string", group : "Appearance", defaultValue : "slide"}
		},
		defaultAggregation : "pages",
		aggregations : {

			/**
			 * The content entities between which this NavContainer navigates. These can be of type sap.m.Page, sap.ui.core.View, sap.m.Carousel or any other control with fullscreen/page semantics.
			 *
			 * These aggregated controls will receive navigation events like {@link sap.m.NavContainerChild#beforeShow beforeShow}, they are documented in the pseudo interface {@link sap.m.NavContainerChild sap.m.NavContainerChild}
			 */
			pages : {type : "sap.ui.core.Control", multiple : true, singularName : "page"}
		},
		associations : {

			/**
			 * This association can be used to define which page is displayed initially. If the given page does not exist or no page is given, the first page which has been added is considered as initial page.
			 * This value should be set initially and not set/modified while the application is running.
			 *
			 * This could be used not only for the initial display, but also if the user wants to navigate "up to top", so this page serves as a sort of "home/root page".
			 */
			initialPage : {type : "sap.ui.core.Control", multiple : false}
		},
		events : {

			/**
			 * The event is fired when navigation between two pages has been triggered. The transition (if any) to the new page has not started yet.
			 * This event can be aborted by the application with preventDefault(), which means that there will be no navigation.
			 * @since 1.7.1
			 */
			navigate : {allowPreventDefault : true,
				parameters : {

					/**
					 * The page which was shown before the current navigation.
					 */
					from : {type : "sap.ui.core.Control"},

					/**
					 * The ID of the page which was shown before the current navigation.
					 */
					fromId : {type : "string"},

					/**
					 * The page which will be shown after the current navigation.
					 */
					to : {type : "sap.ui.core.Control"},

					/**
					 * The ID of the page which will be shown after the current navigation.
					 */
					toId : {type : "string"},

					/**
					 * Whether the "to" page (more precisely: a control with the ID of the page which is currently navigated to) has not been shown/navigated to before.
					 */
					firstTime : {type : "boolean"},

					/**
					 * Whether this is a forward navigation, triggered by "to()".
					 */
					isTo : {type : "boolean"},

					/**
					 * Whether this is a back navigation, triggered by "back()".
					 */
					isBack : {type : "boolean"},

					/**
					 * Whether this is a navigation to the root page, triggered by "backToTop()".
					 */
					isBackToTop : {type : "boolean"},

					/**
					 * Whether this was a navigation to a specific page, triggered by "backToPage()".
					 * @since 1.7.2
					 */
					isBackToPage : {type : "boolean"},

					/**
					 * How the navigation was triggered, possible values are "to", "back", "backToPage", and "backToTop".
					 */
					direction : {type : "string"}
				}
			},

			/**
			 * The event is fired when navigation between two pages has completed. In case of animated transitions this event is fired with some delay after the "navigate" event.
			 * @since 1.7.1
			 */
			afterNavigate : {
				parameters : {

					/**
					 * The page which had been shown before navigation.
					 */
					from : {type : "sap.ui.core.Control"},

					/**
					 * The ID of the page which had been shown before navigation.
					 */
					fromId : {type : "string"},

					/**
					 * The page which is now shown after navigation.
					 */
					to : {type : "sap.ui.core.Control"},

					/**
					 * The ID of the page which is now shown after navigation.
					 */
					toId : {type : "string"},

					/**
					 * Whether the "to" page (more precisely: a control with the ID of the page which has been navigated to) had not been shown/navigated to before.
					 */
					firstTime : {type : "boolean"},

					/**
					 * Whether was a forward navigation, triggered by "to()".
					 */
					isTo : {type : "boolean"},

					/**
					 * Whether this was a back navigation, triggered by "back()".
					 */
					isBack : {type : "boolean"},

					/**
					 * Whether this was a navigation to the root page, triggered by "backToTop()".
					 */
					isBackToTop : {type : "boolean"},

					/**
					 * Whether this was a navigation to a specific page, triggered by "backToPage()".
					 * @since 1.7.2
					 */
					isBackToPage : {type : "boolean"},

					/**
					 * How the navigation was triggered, possible values are "to", "back", "backToPage", and "backToTop".
					 */
					direction : {type : "string"}
				}
			}
		}
	}});


	NavContainer.prototype.init = function() {
		this._pageStack = [];
		this._aQueue = [];
		this._mVisitedPages = {};
		this._mFocusObject = {};
		this._iTransitionsCompleted = 0; // to track proper callback at the end of transitions
		this._bNeverRendered = true;
		this._bNavigating = false;
	};


	NavContainer.prototype.exit = function() {
		this._mFocusObject = null; // allow partial garbage collection when app code leaks the NavContainer (based on a real scenario)
	};


	NavContainer.prototype.onBeforeRendering = function() {
		var pageToRenderFirst = this.getCurrentPage();
		// for the very first rendering
		if (this._bNeverRendered && pageToRenderFirst) { // will be set to false after rendering

			// special handling for the page which is the first one which is rendered in this NavContainer
			var pageId = pageToRenderFirst.getId();

			if (!this._mVisitedPages[pageId]) { // events could already be fired by initial "to()" call
				this._mVisitedPages[pageId] = true;

				var oNavInfo = {
						from:null,
						fromId:null,
						to:pageToRenderFirst,
						toId:pageId,
						firstTime:true,
						isTo:false,
						isBack:false,
						isBackToPage:false,
						isBackToTop:false,
						direction:"initial"
				};

				var oEvent = jQuery.Event("BeforeFirstShow", oNavInfo);
				oEvent.srcControl = this;
				oEvent.data = this._oToDataBeforeRendering || {};
				oEvent.backData = {};
				pageToRenderFirst._handleEvent(oEvent);

				oEvent = jQuery.Event("BeforeShow", oNavInfo);
				oEvent.srcControl = this;
				oEvent.data = this._oToDataBeforeRendering || {};
				oEvent.backData = {};
				pageToRenderFirst._handleEvent(oEvent);
			}
		}
	};

	NavContainer.prototype.onAfterRendering = function() {
		var pageToRenderFirst = this.getCurrentPage(),
			bIsInsideAPopup = !!this.$().closest('[data-sap-ui-area="sap-ui-static"]').length,
			focusObject, oNavInfo, pageId, oEvent;

		// for the very first rendering
		if (this._bNeverRendered && pageToRenderFirst) {
			this._bNeverRendered = false;
			delete this._bNeverRendered;

			// special handling for the page which is the first one which is rendered in this NavContainer
			pageId = pageToRenderFirst.getId();

			// set focus to first focusable object
			// when NavContainer is inside a popup, the focus is managed by the popup and shouldn't be set here
			if (!bIsInsideAPopup && this.getAutoFocus()) {
				focusObject = NavContainer._applyAutoFocusTo(pageId);
				if (focusObject) {
					this._mFocusObject[pageId] = focusObject;
				}
			}

			oNavInfo = {
					from:null,
					fromId:null,
					to:pageToRenderFirst,
					toId:pageId,
					firstTime:true,
					isTo:false,
					isBack:false,
					isBackToTop:false,
					isBackToPage:false,
					direction:"initial"
			};

			oEvent = jQuery.Event("AfterShow", oNavInfo);
			oEvent.srcControl = this;
			oEvent.data = this._oToDataBeforeRendering || {};
			oEvent.backData = {};
			pageToRenderFirst._handleEvent(oEvent);
		}
	};

	/**
	 * Returns the page that should act as initial page - either the one designated as such, or, if it does not exist,
	 * the first page (index 0 in the aggregation). Returns null if no page is aggregated.
	 *
	 * @private
	 */
	NavContainer.prototype._getActualInitialPage = function() {
		var pageId = this.getInitialPage();
		if (pageId) {
			var page = sap.ui.getCore().byId(pageId);
			if (page) {
				return page;
			} else {
				jQuery.sap.log.error("NavContainer: control with ID '" + pageId + "' was set as 'initialPage' but was not found as a DIRECT child of this NavContainer (number of current children: " + this.getPages().length + ").");
			}
		}
		var pages = this.getPages();
		return (pages.length > 0 ? pages[0] : null);
	};


	//*** API methods ***


	/**
	 * Returns the control with the given ID from the "pages" aggregation (if available).
	 *
	 * @param {string} sId
	 *         The ID of the aggregated control to find.
	 * @type sap.ui.core.Control
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	NavContainer.prototype.getPage = function(pageId) {
		var aPages = this.getPages();
		for (var i = 0; i < aPages.length; i++) {
			if (aPages[i] && (aPages[i].getId() == pageId)) {
				return aPages[i];
			}
		}
		return null;
	};

	NavContainer.prototype._ensurePageStackInitialized = function() {
		if (this._pageStack.length === 0) {
			var page = this._getActualInitialPage(); // TODO: with bookmarking / deep linking this is the initial, but not the "home"/root page
			if (page) {
				this._pageStack.push({id:page.getId(), mode:"initial", data:{}});
			}
		}
		return this._pageStack;
	};


	/**
	 * Returns the currently displayed page-level control. Note: it is not necessarily an instance of sap.m.Page, but it could also be a sap.ui.core.View, sap.m.Carousel, or whatever is aggregated.
	 *
	 * Returns undefined if no page has been added yet.
	 *
	 * @type sap.ui.core.Control
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	NavContainer.prototype.getCurrentPage = function() {
		var stack = this._ensurePageStackInitialized();

		if (stack.length >= 1) {
			return this.getPage(stack[stack.length - 1].id);
		} else {
			jQuery.sap.log.warning(this + ": page stack is empty but should have been initialized - application failed to provide a page to display");
			return undefined;
		}
	};


	/**
	 * Returns the previous page (the page from which the user drilled down to the current page with "to()").
	 * Note: this is not the page which the user has seen before, but the page which is the target of the next "back()" navigation.
	 * If there is no previous page, "undefined" is returned.
	 *
	 * @type sap.ui.core.Control
	 * @public
	 * @since 1.7.1
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	NavContainer.prototype.getPreviousPage = function() {
		var stack = this._ensurePageStackInitialized();

		if (stack.length > 1) {
			return this.getPage(stack[stack.length - 2].id);

		} else if (stack.length == 1) { // the current one is the only page on the stack
			return undefined;

		} else {
			jQuery.sap.log.warning(this + ": page stack is empty but should have been initialized - application failed to provide a page to display");
		}
	};


	/**
	 * Returns whether the current page is the top/initial page.
	 *
	 * Note: going to the initial page again with a row of "to" navigations causes the initial page to be displayed again, but logically one is not at the top level, so this method returns "false" in this case.
	 *
	 * @type boolean
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	NavContainer.prototype.currentPageIsTopPage = function() {
		var stack = this._ensurePageStackInitialized();
		return (stack.length === 1);
	};



	/**
	 * Inserts the page/control with the specified ID into the navigation history stack of the NavContainer.
	 *
	 * This can be used for deep-linking when the user directly reached a drilldown detail page using a bookmark and then wants to navigate up in the drilldown hierarchy. Normally such a back navigation would not be possible because there is no previous page in the NavContainer's history stack.
	 *
	 * @param {string} sPageId
	 *         The ID of the control/page/screen which is inserted into the history stack. The respective control must be aggregated by the NavContainer, otherwise this will cause an error.
	 * @param {string} [sTransitionName]
	 *         The type of the transition/animation which would have been used to navigate from the (inserted) previous page to the current page. When navigating back, the inverse animation will be applied.
	 *         This parameter can be omitted; then the default is "slide" (horizontal movement from the right).
	 * @param {object} [oData]
	 *         This optional object can carry any payload data which would have been given to the inserted previous page if the user would have done a normal forward navigation to it.
	 * @type sap.m.NavContainer
	 * @public
	 * @since 1.16.1
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	NavContainer.prototype.insertPreviousPage = function(pageId, transitionName, data) {
		var stack = this._ensurePageStackInitialized();
		if (this._pageStack.length > 0) {
			var index = stack.length - 1;
			var pageInfo = {id:pageId,mode:transitionName,data:data};
			if (index === 0) {
				pageInfo.mode = "initial";
				delete stack[stack.length - 1].mode;
			}
			stack.splice(index, 0, pageInfo);
		} else {
			jQuery.sap.log.warning(this + ": insertPreviousPage called with empty page stack; ignoring");
		}

		return this;
	};

	NavContainer._applyAutoFocusTo = function (sId) {
		var focusSubjectDomRef = jQuery.sap.byId(sId).firstFocusableDomRef();
		if (focusSubjectDomRef) {
			jQuery.sap.focus(focusSubjectDomRef);
		}

		return focusSubjectDomRef;
	};

	NavContainer.prototype._applyAutoFocus = function (oNavInfo) {
		var sPageId = oNavInfo.toId,
			domRefRememberedFocusSubject,
			bAutoFocus = this.getAutoFocus(),
			bNavigatingBackToPreviousLocation = oNavInfo.isBack || oNavInfo.isBackToPage || oNavInfo.isBackToTop;

		// check navigation type (backward or forward)
		if (bNavigatingBackToPreviousLocation) {
			// set focus to the remembered focus object if available
			// if no focus was set set focus to first focusable object in "to page"
			domRefRememberedFocusSubject = this._mFocusObject[sPageId];
			if (domRefRememberedFocusSubject) {
				jQuery.sap.focus(domRefRememberedFocusSubject);
			} else if (bAutoFocus){
				NavContainer._applyAutoFocusTo(sPageId);
			}
		} else if (oNavInfo.isTo && bAutoFocus) {
			// set focus to first focusable object in "to page"
			NavContainer._applyAutoFocusTo(sPageId);
		}
	};

	NavContainer.prototype._afterTransitionCallback = function(oNavInfo, oData, oBackData) {
		var oEvent = jQuery.Event("AfterShow", oNavInfo);
		oEvent.data = oData || {};
		oEvent.backData = oBackData || {};
		oEvent.srcControl = this; // store the element on the event (aligned with jQuery syntax)
		oNavInfo.to._handleEvent(oEvent);

		oEvent = jQuery.Event("AfterHide", oNavInfo);
		oEvent.srcControl = this; // store the element on the event (aligned with jQuery syntax)
		oNavInfo.from._handleEvent(oEvent);

		this._iTransitionsCompleted++;
		this._bNavigating = false;
		this._applyAutoFocus(oNavInfo);
		this.fireAfterNavigate(oNavInfo);
		// TODO: destroy HTML? Remember to destroy ALL HTML of several pages when backToTop has been called

		jQuery.sap.log.info(this + ": _afterTransitionCallback called, to: " + oNavInfo.toId);

		if (oNavInfo.to.hasStyleClass("sapMNavItemHidden")) {
			jQuery.sap.log.warning(this.toString() + ": target page '" + oNavInfo.toId + "' still has CSS class 'sapMNavItemHidden' after transition. This should not be the case, please check the preceding log statements.");
			oNavInfo.to.removeStyleClass("sapMNavItemHidden");
		}

		if (this._aQueue.length > 0) {
			var fnNavigate = this._aQueue.shift();
			fnNavigate();
		}
	};


	/**
	 * Navigates to the next page (with drill-down semantic) with the given (or default) animation. This creates a new history item inside the NavContainer and allows going back.
	 *
	 * Note that any modifications to the target page (like setting its title, or anything else that could cause a re-rendering) should be done BEFORE calling to(), in order to avoid unwanted side effects, e.g. related to the page animation.
	 *
	 * Available transitions currently include "slide" (default), "fade", "flip", and "show". None of these is currently making use of any given transitionParameters.
	 *
	 * Calling this navigation method triggers first the (cancelable) "navigate" event on the NavContainer, then the "beforeHide" pseudo event on the source page and "beforeFirstShow" (if applicable) and"beforeShow" on the target page. Later - after the transition has completed - the "afterShow" pseudo event is triggered on the target page and "afterHide" on the page which has been left. The given data object is available in the "beforeFirstShow", "beforeShow" and "afterShow" event object as "data" property.
	 *
	 * @param {string} sPageId
	 *         The screen to which drilldown should happen. The ID or the control itself can be given.
	 * @param {string} [sTransitionName]
	 *         The type of the transition/animation to apply. This parameter can be omitted; then the default is "slide" (horizontal movement from the right).
	 *         Other options are: "fade", "flip", and "show" and the names of any registered custom transitions.
	 *
	 *         None of the standard transitions is currently making use of any given transition parameters.
	 * @param {object} [oData]
	 *         Since version 1.7.1. This optional object can carry any payload data which should be made available to the target page. The "beforeShow" event on the target page will contain this data object as "data" property.
	 *
	 *         Use case: in scenarios where the entity triggering the navigation can or should not directly initialize the target page, it can fill this object and the target page itself (or a listener on it) can take over the initialization, using the given data.
	 *
	 *         When the "transitionParameters" object is used, this "data" object must also be given (either as object or as null) in order to have a proper parameter order.
	 * @param {object} [oTransitionParameters]
	 *         Since version 1.7.1. This optional object can contain additional information for the transition function, like the DOM element which triggered the transition or the desired transition duration.
	 *
	 *         For a proper parameter order, the "data" parameter must be given when the "transitionParameters" parameter is used. (it can be given as "null")
	 *
	 *         NOTE: it depends on the transition function how the object should be structured and which parameters are actually used to influence the transition.
	 *         The "show", "slide" and "fade" transitions do not use any parameter.
	 * @type sap.m.NavContainer
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	NavContainer.prototype.to = function(pageId, transitionName, data, oTransitionParameters) {
		if (pageId instanceof Control) {
			pageId = pageId.getId();
		}

		// fix parameters
		if (typeof (transitionName) !== "string") {
			// transitionName is omitted, shift parameters
			oTransitionParameters = data;
			data = transitionName;
		}
		transitionName = transitionName || this.getDefaultTransitionName();
		oTransitionParameters = oTransitionParameters || {};
		data = data || {};

		// make sure the initial page is on the stack
		this._ensurePageStackInitialized();

		//add to the queue before checking the current page, because this might change
		if (this._bNavigating) {
			jQuery.sap.log.info(this.toString() + ": Cannot navigate to page " + pageId + " because another navigation is already in progress. - navigation will be executed after the previous one");

			this._aQueue.push(jQuery.proxy( function() {
				this.to(pageId, transitionName, data, oTransitionParameters);
			},this));

			return this;
		}

		// If to is called before rendering, remember the data so we can pass it to the events as soon as the navContainer gets rendered
		if (this._bNeverRendered) {
			this._oToDataBeforeRendering = data;
		}

		var oFromPage = this.getCurrentPage();
		if (oFromPage && (oFromPage.getId() === pageId)) { // cannot navigate to the page that is already current
			jQuery.sap.log.warning(this.toString() + ": Cannot navigate to page " + pageId + " because this is the current page.");
			return this;
		}

		var oToPage = this.getPage(pageId);

		if (oToPage && oFromPage) {

			// remember the focused object in "from page"
			this._mFocusObject[oFromPage.getId()] = document.activeElement;

			var oNavInfo = {
					from:oFromPage,
					fromId:oFromPage.getId(),
					to:oToPage,
					toId:pageId,
					firstTime:!this._mVisitedPages[pageId],
					isTo:true,
					isBack:false,
					isBackToTop:false,
					isBackToPage:false,
					direction:"to"
			};
			var bContinue = this.fireNavigate(oNavInfo);
			if (bContinue) { // ok, let's do the navigation

				sap.m.closeKeyboard();

				// TODO: let one of the pages also cancel navigation?
				var oEvent = jQuery.Event("BeforeHide", oNavInfo);
				oEvent.srcControl = this; // store the element on the event (aligned with jQuery syntax)
				// no data needed for hiding
				oFromPage._handleEvent(oEvent);

				if (!this._mVisitedPages[pageId]) { // if this page has not been shown before
					oEvent = jQuery.Event("BeforeFirstShow", oNavInfo);
					oEvent.srcControl = this;
					oEvent.data = data || {};
					oEvent.backData = {};
					oToPage._handleEvent(oEvent);
				}

				oEvent = jQuery.Event("BeforeShow", oNavInfo);
				oEvent.srcControl = this;
				oEvent.data = data || {};
				oEvent.backData = {};
				oToPage._handleEvent(oEvent);


				this._pageStack.push({id:pageId,mode:transitionName,data:data}); // this actually causes/is the navigation
				jQuery.sap.log.info(this.toString() + ": navigating to page '" + pageId + "': " + oToPage.toString());
				this._mVisitedPages[pageId] = true;

				if (!this.getDomRef()) { // the wanted animation has been recorded, but when the NavContainer is not rendered, we cannot animate, so just return
					jQuery.sap.log.info("'Hidden' 'to' navigation in not-rendered NavContainer " + this.toString());
					return this;
				}

				// render the page that should get visible
				var oToPageDomRef;

				if (!(oToPageDomRef = oToPage.getDomRef()) || oToPageDomRef.parentNode != this.getDomRef() || sap.ui.core.RenderManager.isPreservedContent(oToPageDomRef)) {
					oToPage.addStyleClass("sapMNavItemRendering");
					jQuery.sap.log.debug("Rendering 'to' page '" + oToPage.toString() + "' for 'to' navigation");
					var rm = sap.ui.getCore().createRenderManager();
					rm.render(oToPage, this.getDomRef());
					rm.destroy();
					oToPage.addStyleClass("sapMNavItemHidden").removeStyleClass("sapMNavItemRendering");
				}

				var oTransition = NavContainer.transitions[transitionName] || NavContainer.transitions["slide"];

				// Track proper invocation of the callback  TODO: only do this during development?
				var iCompleted = this._iTransitionsCompleted;
				var that = this;
				window.setTimeout(function(){
					if (that && (that._iTransitionsCompleted < iCompleted + 1)) {
						jQuery.sap.log.warning("Transition '" + transitionName + "' 'to' was triggered five seconds ago, but has not yet invoked the end-of-transition callback.");
					}
				}, 5000);

				this._bNavigating = true;
				oTransition.to.call(this, oFromPage, oToPage, jQuery.proxy(function(){this._afterTransitionCallback(oNavInfo, data);}, this), oTransitionParameters); // trigger the transition

			} else {
				jQuery.sap.log.info("Navigation to page with ID '" + pageId + "' has been aborted by the application");
			}

		} else {
			jQuery.sap.log.warning("Navigation triggered to page with ID '" + pageId + "', but this page is not known/aggregated by " + this);
		}
		return this;
	};



	/**
	 * Navigates back one level. If already on the initial page and there is no place to go back, nothing happens.
	 *
	 * Calling this navigation method triggers first the (cancelable) "navigate" event on the NavContainer, then the "beforeHide" pseudo event on the source page and "beforeFirstShow" (if applicable) and"beforeShow" on the target page. Later - after the transition has completed - the "afterShow" pseudo event is triggered on the target page and "afterHide" on the page which has been left. The given backData object is available in the "beforeFirstShow", "beforeShow" and "afterShow" event object as "data" property. The original "data" object from the "to" navigation is also available in these event objects.
	 *
	 * @param {object} [oBackData]
	 *         Since version 1.7.1. This optional object can carry any payload data which should be made available to the target page of the back navigation. The event on the target page will contain this data object as "backData" property. (The original data from the "to()" navigation will still be available as "data" property.)
	 *
	 *         In scenarios where the entity triggering the navigation can or should not directly initialize the target page, it can fill this object and the target page itself (or a listener on it) can take over the initialization, using the given data.
	 *         For back navigation this can be used e.g. when returning from a detail page to transfer any settings done there.
	 *
	 *         When the "transitionParameters" object is used, this "data" object must also be given (either as object or as null) in order to have a proper parameter order.
	 * @param {object} [oTransitionParameters]
	 *         Since version 1.7.1. This optional object can give additional information to the transition function, like the DOM element which triggered the transition or the desired transition duration.
	 *         The animation type can NOT be selected here - it is always the inverse of the "to" navigation.
	 *
	 *         In order to use the "transitionParameters" property, the "data" property must be used (at least "null" must be given) for a proper parameter order.
	 *
	 *         NOTE: it depends on the transition function how the object should be structured and which parameters are actually used to influence the transition.
	 * @type sap.m.NavContainer
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	NavContainer.prototype.back = function(backData, oTransitionParameters) {
		this._backTo("back", backData, oTransitionParameters);
		return this;
	};


	/**
	 * Navigates back to the nearest previous page in the NavContainer history with the given ID. If there is no such page among the previous pages, nothing happens.
	 * The transition effect which had been used to get to the current page is inverted and used for this navigation.
	 *
	 * Calling this navigation method triggers first the (cancelable) "navigate" event on the NavContainer, then the "beforeHide" pseudo event on the source page and "beforeFirstShow" (if applicable) and"beforeShow" on the target page. Later - after the transition has completed - the "afterShow" pseudo event is triggered on the target page and "afterHide" on the page which has been left. The given backData object is available in the "beforeFirstShow", "beforeShow" and "afterShow" event object as "data" property. The original "data" object from the "to" navigation is also available in these event objects.
	 *
	 * @param {string} sPageId
	 *         The ID of the screen to which back navigation should happen. The ID or the control itself can be given. The nearest such page among the previous pages in the history stack will be used.
	 * @param {object} [oBackData]
	 *         This optional object can carry any payload data which should be made available to the target page of the "backToPage" navigation. The event on the target page will contain this data object as "backData" property.
	 *
	 *         When the "transitionParameters" object is used, this "data" object must also be given (either as object or as null) in order to have a proper parameter order.
	 * @param {object} [oTransitionParameters]
	 *         This optional object can give additional information to the transition function, like the DOM element which triggered the transition or the desired transition duration.
	 *         The animation type can NOT be selected here - it is always the inverse of the "to" navigation.
	 *
	 *         In order to use the "transitionParameters" property, the "data" property must be used (at least "null" must be given) for a proper parameter order.
	 *
	 *         NOTE: it depends on the transition function how the object should be structured and which parameters are actually used to influence the transition.
	 * @type sap.m.NavContainer
	 * @public
	 * @since 1.7.2
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	NavContainer.prototype.backToPage = function(pageId, backData, oTransitionParameters) {
		this._backTo("backToPage", backData, oTransitionParameters, pageId);
		return this;
	};


	/**
	 * Navigates back to the initial/top level (this is the element aggregated as "initialPage", or the first added element). If already on the initial page, nothing happens.
	 * The transition effect which had been used to get to the current page is inverted and used for this navigation.
	 *
	 * Calling this navigation method triggers first the (cancelable) "navigate" event on the NavContainer, then the "beforeHide" pseudo event on the source page and "beforeFirstShow" (if applicable) and"beforeShow" on the target page. Later - after the transition has completed - the "afterShow" pseudo event is triggered on the target page and "afterHide" on the page which has been left. The given backData object is available in the "beforeFirstShow", "beforeShow" and "afterShow" event object as "data" property.
	 *
	 * @param {object} [oBackData]
	 *         This optional object can carry any payload data which should be made available to the target page of the "backToTop" navigation. The event on the target page will contain this data object as "backData" property.
	 *
	 *         When the "transitionParameters" object is used, this "data" object must also be given (either as object or as null) in order to have a proper parameter order.
	 * @param {object} [oTransitionParameters]
	 *         This optional object can give additional information to the transition function, like the DOM element which triggered the transition or the desired transition duration.
	 *         The animation type can NOT be selected here - it is always the inverse of the "to" navigation.
	 *
	 *         In order to use the "transitionParameters" property, the "data" property must be used (at least "null" must be given) for a proper parameter order.
	 *
	 *         NOTE: it depends on the transition function how the object should be structured and which parameters are actually used to influence the transition.
	 * @type sap.m.NavContainer
	 * @public
	 * @since 1.7.1
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	NavContainer.prototype.backToTop = function(backData, oTransitionParameters) {
		this._backTo("backToTop", backData, oTransitionParameters);
		return this;
	};


	NavContainer.prototype._backTo = function(sType, backData, oTransitionParameters, sRequestedPageId) {
		if (this._bNavigating) {
			jQuery.sap.log.warning(this.toString() + ": Cannot navigate back because another navigation is already in progress. - navigation will be executed after the previous one");


			this._aQueue.push(jQuery.proxy( function() {
				this._backTo(sType, backData, oTransitionParameters, sRequestedPageId);
			},this));

			return this;
		}

		if (this._pageStack.length <= 1) {
			// there is no place to go back

			// but then the assumption is that the only page on the stack is the initial one and has not been navigated to. Check this:
			if (this._pageStack.length === 1 && this._pageStack[0].mode != "initial") {
				throw new Error("Initial page not found on the stack. How did this happen?");
			}
			return this;

		} else { // normal back navigation

			if (sRequestedPageId instanceof Control) {
				sRequestedPageId = sRequestedPageId.getId();
			}

			var oFromPageInfo = this._pageStack[this._pageStack.length - 1];
			var mode = oFromPageInfo.mode;
			var oFromPage = this.getPage(oFromPageInfo.id);
			var oToPage;
			var oToPageData;

			if (sType === "backToTop") {
				oToPage = this._getActualInitialPage();
				oToPageData = null;

			} else if (sType === "backToPage") {
				var info = this._findClosestPreviousPageInfo(sRequestedPageId);
				if (!info) {
					jQuery.sap.log.error(this.toString() + ": Cannot navigate backToPage('" + sRequestedPageId + "') because target page was not found among the previous pages.");
					return this;
				}
				oToPage = sap.ui.getCore().byId(info.id);
				if (!oToPage) {
					jQuery.sap.log.error(this.toString() + ": Cannot navigate backToPage('" + sRequestedPageId + "') because target page does not exist anymore.");
					return this;
				}
				oToPageData = info.data;

			} else { // normal "back"
				oToPage = this.getPreviousPage();
				oToPageData = this._pageStack[this._pageStack.length - 2].data;
			}

			if (!oToPage) {
				jQuery.sap.log.error("NavContainer back navigation: target page is not defined or not aggregated by this NavContainer. Aborting navigation.");
				return;
			}

			var oToPageId = oToPage.getId();
			backData = backData || {};
			oTransitionParameters = oTransitionParameters || {};

			var oNavInfo = {
				from:oFromPage,
				fromId:oFromPage.getId(),
				to:oToPage,
				toId:oToPageId,
				firstTime:!this._mVisitedPages[oToPageId],
				isTo:false,
				isBack:(sType === "back"),
				isBackToPage:(sType === "backToPage"),
				isBackToTop:(sType === "backToTop"),
				direction:sType
			};
			var bContinue = this.fireNavigate(oNavInfo);
			if (bContinue) { // ok, let's do the navigation

				sap.m.closeKeyboard();

				var oEvent = jQuery.Event("BeforeHide", oNavInfo);
				oEvent.srcControl = this; // store the element on the event (aligned with jQuery syntax)
				// no data needed for hiding
				oFromPage._handleEvent(oEvent);

				if (!this._mVisitedPages[oToPageId]) { // if this page has not been shown before
					oEvent = jQuery.Event("BeforeFirstShow", oNavInfo);
					oEvent.srcControl = this;
					oEvent.backData = backData || {};
					// the old data from the forward navigation should not exist because there was never a forward navigation
					oEvent.data = {};
					oToPage._handleEvent(oEvent);
				}

				oEvent = jQuery.Event("BeforeShow", oNavInfo);
				oEvent.srcControl = this;
				oEvent.backData = backData || {};
				oEvent.data =  oToPageData || {}; // the old data from the forward navigation
				oToPage._handleEvent(oEvent);

				this._pageStack.pop(); // this actually causes/is the navigation
				jQuery.sap.log.info(this.toString() + ": navigating back to page " + oToPage.toString());
				this._mVisitedPages[oToPageId] = true;

				if (sType === "backToTop") { // if we should navigate to top, just clean up the whole stack
					this._pageStack = [];
					jQuery.sap.log.info(this.toString() + ": navigating back to top");
					this.getCurrentPage(); // this properly restores the initial page on the stack

				} else if (sType === "backToPage") {
					var aPages = [], interimPage;
					while (this._pageStack[this._pageStack.length - 1].id !== sRequestedPageId) { // by now it is guaranteed that we will find it
						interimPage = this._pageStack.pop();
						aPages.push(interimPage.id);
					}
					jQuery.sap.log.info(this.toString() + ": navigating back to specific page " + oToPage.toString() + " across the pages: " + aPages.join(", "));
				}

				if (!this.getDomRef()) { // the wanted animation has been recorded, but when the NavContainer is not rendered, we cannot animate, so just return
					jQuery.sap.log.info("'Hidden' back navigation in not-rendered NavContainer " + this.toString());
					return this;
				}

				var oTransition = NavContainer.transitions[mode] || NavContainer.transitions["slide"];

				// Track proper invocation of the callback  TODO: only do this during development?
				var iCompleted = this._iTransitionsCompleted;
				var that = this;
				window.setTimeout(function(){
					if (that && (that._iTransitionsCompleted < iCompleted + 1)) {
						jQuery.sap.log.warning("Transition '" + mode + "' 'back' was triggered five seconds ago, but has not yet invoked the end-of-transition callback.");
					}
				}, 5000);

				this._bNavigating = true;

				// make sure the to-page is rendered
				var oToPageDomRef;
				if (!(oToPageDomRef = oToPage.getDomRef()) || oToPageDomRef.parentNode != this.getDomRef() || sap.ui.core.RenderManager.isPreservedContent(oToPageDomRef)) {
					oToPage.addStyleClass("sapMNavItemRendering");
					jQuery.sap.log.debug("Rendering 'to' page '" + oToPage.toString() + "' for back navigation");
					var rm = sap.ui.getCore().createRenderManager();
					var childPos = this.$().children().index(oFromPage.getDomRef());
					rm.renderControl(oToPage);
					rm.flush(this.getDomRef(), false, childPos);
					rm.destroy();
					oToPage.addStyleClass("sapMNavItemHidden").removeStyleClass("sapMNavItemRendering");
				}

				//if the from page and to page are identical, the transition is skipped.
				if (oFromPage.getId() === oToPage.getId()) {
					jQuery.sap.log.info("Transition is skipped when navigating back to the same page instance" + oToPage.toString());
					this._afterTransitionCallback(oNavInfo, oToPageData, backData);
					return this;
				}

				// trigger the transition
				oTransition.back.call(this, oFromPage, oToPage, jQuery.proxy(function(){this._afterTransitionCallback(oNavInfo, oToPageData, backData);}, this), oTransitionParameters); // trigger the transition
			}
		}
		return this;
	};

	NavContainer.prototype._findClosestPreviousPageInfo = function(sRequestedPreviousPageId) {
		for (var i = this._pageStack.length - 2; i >= 0; i--) {
			var info = this._pageStack[i];
			if (info.id === sRequestedPreviousPageId) {
				return info;
			}
		}
		return null;
	};


	NavContainer.transitions = NavContainer.transitions || {}; // make sure the object exists


	//*** SHOW Transition ***

	NavContainer.transitions["show"] = {
		to: function(oFromPage, oToPage, fCallback /*, oTransitionParameters is unused */) {
			oToPage.removeStyleClass("sapMNavItemHidden"); // remove the "hidden" class which has been added by the NavContainer before the transition was called
			oFromPage && oFromPage.addStyleClass("sapMNavItemHidden");
			fCallback();
		},

		back: function(oFromPage, oToPage, fCallback /*, oTransitionParameters is unused */) {
			oToPage.removeStyleClass("sapMNavItemHidden");
			oFromPage && oFromPage.addStyleClass("sapMNavItemHidden"); // instantly hide the previous page
			fCallback();
		}
	};


	//*** SLIDE Transition ***

	if (jQuery.support.cssTransitions) {
		NavContainer.transitions["slide"] = {

			to: function(oFromPage, oToPage, fCallback /*, oTransitionParameters is unused */) {
				oFromPage.addStyleClass("sapMNavItemCenter");
				window.setTimeout(function(){ // iPhone seems to need a zero timeout here, otherwise the to page is black (and may suddenly become visible when the DOM is touched)

					// set the style classes that represent the initial state
					oToPage.addStyleClass("sapMNavItemRight");     // the page to navigate to should be placed just right of the visible area
					oToPage.removeStyleClass("sapMNavItemHidden"); // remove the "hidden" class now which has been added by the NavContainer before the animation was called


					// iPhone needs some time... there is no animation without waiting
					window.setTimeout(function(){

						var bOneTransitionFinished = false;
						var bTransitionEndPending = true;
						var fAfterTransition = null; // make Eclipse aware that this variable is defined
						fAfterTransition = function() {
							jQuery(this).unbind("webkitTransitionEnd transitionend");
							if (!bOneTransitionFinished) {
								// the first one of both transitions finished
								bOneTransitionFinished = true;
							} else {
								// the second transition now also finished => clean up the style classes
								bTransitionEndPending = false;
								oToPage.removeStyleClass("sapMNavItemSliding").removeStyleClass("sapMNavItemCenter");
								oFromPage.removeStyleClass("sapMNavItemSliding").addStyleClass("sapMNavItemHidden").removeStyleClass("sapMNavItemLeft");

								// notify the NavContainer that the animation is complete
								fCallback();
							}
						};

						oFromPage.$().bind("webkitTransitionEnd transitionend", fAfterTransition);
						oToPage.$().bind("webkitTransitionEnd transitionend", fAfterTransition);

						// set the new style classes that represent the end state (and thus start the transition)
						oToPage.addStyleClass("sapMNavItemSliding").addStyleClass("sapMNavItemCenter").removeStyleClass("sapMNavItemRight");
						oFromPage.addStyleClass("sapMNavItemSliding").removeStyleClass("sapMNavItemCenter").addStyleClass("sapMNavItemLeft");

						window.setTimeout(function(){ // in case rerendering prevented the fAfterTransition call
							if (bTransitionEndPending) {
								bOneTransitionFinished = true;
								fAfterTransition.apply(oFromPage.$().add(oToPage.$()));
							}
						}, 400);

					}, 60); // this value has been found by testing on actual devices; with "10" there are frequent "no-animation" issues, with "100" there are none, with "50" there are very few

				},0); // iPhone seems to need a zero timeout here, otherwise the to page is black (and may suddenly become visible when the DOM is touched)
			},

			back: function(oFromPage, oToPage, fCallback /*, oTransitionParameters is unused */) {
				// set the style classes that represent the initial state
				oToPage.addStyleClass("sapMNavItemLeft");     // the page to navigate back to should be placed just left of the visible area
				oToPage.removeStyleClass("sapMNavItemHidden"); // remove the "hidden" class now which has been added by the NavContainer before the animation was called
				oFromPage.addStyleClass("sapMNavItemCenter");

				// iPhone needs some time... there is no animation without waiting
				window.setTimeout(function() {

					var bOneTransitionFinished = false;
					var bTransitionEndPending = true;
					var fAfterTransition = null; // make Eclipse aware that this variable is defined
					fAfterTransition = function() {
						jQuery(this).unbind("webkitTransitionEnd transitionend");
						if (!bOneTransitionFinished) {
							// the first one of both transitions finished
							bOneTransitionFinished = true;
						} else {
							// the second transition now also finished => clean up the style classes
							bTransitionEndPending = false;
							oToPage.removeStyleClass("sapMNavItemSliding").removeStyleClass("sapMNavItemCenter");
							oFromPage.removeStyleClass("sapMNavItemSliding").addStyleClass("sapMNavItemHidden").removeStyleClass("sapMNavItemRight");

							// notify the NavContainer that the animation is complete
							fCallback();
						}
					};

					oFromPage.$().bind("webkitTransitionEnd transitionend", fAfterTransition);
					oToPage.$().bind("webkitTransitionEnd transitionend", fAfterTransition);

					// workaround for bug in current webkit versions: in slided-in elements the z-order may be wrong and will be corrected once a re-layout is enforced
					// see http://code.google.com/p/chromium/issues/detail?id=246965  - still an issue in iOS 6.1.3 as of 03/2015
					if (sap.ui.Device.browser.webkit) {
						window.setTimeout(function(){
							oToPage.$().css("box-shadow", "0em 1px 0em rgba(128, 128, 1280, 0.1)"); // add box-shadow
							window.setTimeout(function(){
								oToPage.$().css("box-shadow", ""); // remove it again
							},50);
						},0);
					}

					// set the new style classes that represent the end state (and thus start the transition)
					oToPage.addStyleClass("sapMNavItemSliding").addStyleClass("sapMNavItemCenter").removeStyleClass("sapMNavItemLeft"); // transition from left position to normal/center position starts now
					oFromPage.addStyleClass("sapMNavItemSliding").removeStyleClass("sapMNavItemCenter").addStyleClass("sapMNavItemRight"); // transition from normal position to right position starts now

					window.setTimeout(function(){ // in case rerendering prevented the fAfterTransition call
						if (bTransitionEndPending) {
							bOneTransitionFinished = true;
							fAfterTransition.apply(oFromPage.$().add(oToPage.$()));
						}
					}, 400);

				}, 100); // this value has been found by testing on actual devices; with "10" there are frequent "no-animation" issues, with "100" there are none, with "50" there are very few
			}
		};

	} else { // no CSS transitions, IE9 support
		NavContainer.transitions["slide"] = {
			to: function(oFromPage, oToPage, fCallback /*, oTransitionParameters is unused */) {
				var $ToPage = oToPage.$();
				$ToPage.css("left", "100%");
				oToPage.removeStyleClass("sapMNavItemHidden"); // remove the "hidden" class which has been added by the NavContainer before the transition was called

				$ToPage.animate({left: "0%"}, 300);
				var $FromPage = oFromPage.$();
				$FromPage.animate({left: "-100%"}, 300, function(){
					oFromPage.addStyleClass("sapMNavItemHidden");
					$FromPage.css("left", "0");
					fCallback();
				});
			},

			back: function(oFromPage, oToPage, fCallback /*, oTransitionParameters is unused */) {
				var $ToPage = oToPage.$();
				$ToPage.css("left", "-100%");
				oToPage.removeStyleClass("sapMNavItemHidden");

				$ToPage.animate({left: "0%"}, 300);
				var $FromPage = oFromPage.$();
				$FromPage.animate({left: "100%"}, 300, function(){
					oFromPage.addStyleClass("sapMNavItemHidden");
					$FromPage.css("left", "0");
					fCallback();
				});
			}
		};
	}


	//*** FADE Transition ***

	if (jQuery.support.cssTransitions) {
		NavContainer.transitions["fade"] = {

				to: function(oFromPage, oToPage, fCallback /*, oTransitionParameters is unused */) {
					// set the style classes that represent the initial state
					oToPage.addStyleClass("sapMNavItemTransparent");
					oToPage.removeStyleClass("sapMNavItemHidden");

					// iPhone needs some time for rendering, there is no animation without waiting
					window.setTimeout(function(){

						// the code to be executed after the new page has completed fading in
						var fAfterTransition = null; // make Eclipse aware that this variable is defined
						var bTransitionEndPending = true;
						fAfterTransition = function() {
							jQuery(this).unbind("webkitTransitionEnd transitionend");
							// clean up the style classes
							bTransitionEndPending = false;
							oFromPage.addStyleClass("sapMNavItemHidden");
							oToPage.removeStyleClass("sapMNavItemFading").removeStyleClass("sapMNavItemOpaque");

							// notify the NavContainer that the animation is complete
							fCallback();
						};

						oToPage.$().bind("webkitTransitionEnd transitionend", fAfterTransition);

						// set the new style classes that represent the end state (and thus start the transition)
						oToPage.addStyleClass("sapMNavItemFading").removeStyleClass("sapMNavItemTransparent").addStyleClass("sapMNavItemOpaque");

						window.setTimeout(function(){ // in case rerendering prevented the fAfterTransition call
							if (bTransitionEndPending) {
								fAfterTransition.apply(oToPage.$());
							}
						}, 600);

					}, 10);
				},

				back: function(oFromPage, oToPage, fCallback /*, oTransitionParameters is unused */) {
					// set the style classes that represent the initial state
					oFromPage.addStyleClass("sapMNavItemOpaque");
					oToPage.removeStyleClass("sapMNavItemHidden");

					// iPhone needs some time for rendering, there is no animation without waiting
					window.setTimeout(function() {

						// the code to be executed after the new page has completed fading in
						var fAfterTransition = null; // make Eclipse aware that this variable is defined
						var bTransitionEndPending = true;
						fAfterTransition = function() {
							jQuery(this).unbind("webkitTransitionEnd transitionend");
							// clean up the style classes
							bTransitionEndPending = false;
							oFromPage.removeStyleClass("sapMNavItemFading").addStyleClass("sapMNavItemHidden"); // TODO: destroy HTML?
							oFromPage.removeStyleClass("sapMNavItemTransparent");

							// notify the NavContainer that the animation is complete
							fCallback();
						};

						oFromPage.$().bind("webkitTransitionEnd transitionend", fAfterTransition);

						// set the new style classes that represent the end state (and thus start the transition)
						oFromPage.addStyleClass("sapMNavItemFading").removeStyleClass("sapMNavItemOpaque");
						oFromPage.addStyleClass("sapMNavItemTransparent");

						window.setTimeout(function(){ // in case rerendering prevented the fAfterTransition call
							if (bTransitionEndPending) {
								fAfterTransition.apply(oToPage.$());
							}
						}, 600);

					}, 10);
				}
		};

	} else { // no CSS transitions, IE9 support
		NavContainer.transitions["fade"] = {
			to: function(oFromPage, oToPage, fCallback /*, oTransitionParameters is unused */) {
				var $ToPage = oToPage.$();
				$ToPage.css("opacity", "0");
				oToPage.removeStyleClass("sapMNavItemHidden"); // remove the "hidden" class which has been added by the NavContainer before the transition was called

				$ToPage.animate({opacity: "1"}, 500, function(){
					oFromPage.addStyleClass("sapMNavItemHidden");
					fCallback();
				});
			},

			back: function(oFromPage, oToPage, fCallback /*, oTransitionParameters is unused */) {
				var $FromPage = oFromPage.$();
				oToPage.removeStyleClass("sapMNavItemHidden"); // remove the "hidden" class which has been added by the NavContainer before the transition was called

				$FromPage.animate({opacity: "0"}, 500, function(){
					oFromPage.addStyleClass("sapMNavItemHidden");
					$FromPage.css("opacity", "1");
					fCallback();
				});
			}
		};
	}


	//*** FLIP Transition ***

	if (jQuery.support.cssTransitions) {
		NavContainer.transitions["flip"] = {

			to: function(oFromPage, oToPage, fCallback /*, oTransitionParameters is unused */) {
				var that = this;
				window.setTimeout(function(){ // iPhone seems to need a zero timeout here, otherwise the to page is black (and may suddenly become visible when the DOM is touched)

					that.$().addClass("sapMNavFlip");

					// set the style classes that represent the initial state
					oToPage.addStyleClass("sapMNavItemFlipNext");     // the page to navigate to should be placed just right of the visible area
					oToPage.removeStyleClass("sapMNavItemHidden"); // remove the "hidden" class now which has been added by the NavContainer before the animation was called

					// iPhone needs some time... there is no animation without waiting
					window.setTimeout(function(){

						var bOneTransitionFinished = false;
						var bTransitionEndPending = true;
						var fAfterTransition = null; // make Eclipse aware that this variable is defined
						fAfterTransition = function() {
							jQuery(this).unbind("webkitTransitionEnd transitionend");
							if (!bOneTransitionFinished) {
								// the first one of both transitions finished
								bOneTransitionFinished = true;
							} else {
								// the second transition now also finished => clean up the style classes
								bTransitionEndPending = false;
								oToPage.removeStyleClass("sapMNavItemFlipping");
								oFromPage.removeStyleClass("sapMNavItemFlipping").addStyleClass("sapMNavItemHidden").removeStyleClass("sapMNavItemFlipPrevious");
								that.$().removeClass("sapMNavFlip");

								// notify the NavContainer that the animation is complete
								fCallback();
							}
						};

						oFromPage.$().bind("webkitTransitionEnd transitionend", fAfterTransition);
						oToPage.$().bind("webkitTransitionEnd transitionend", fAfterTransition);

						// set the new style classes that represent the end state (and thus start the transition)
						oToPage.addStyleClass("sapMNavItemFlipping").removeStyleClass("sapMNavItemFlipNext");
						oFromPage.addStyleClass("sapMNavItemFlipping").addStyleClass("sapMNavItemFlipPrevious");

						window.setTimeout(function(){ // in case rerendering prevented the fAfterTransition call
							if (bTransitionEndPending) {
								bOneTransitionFinished = true;
								fAfterTransition.apply(oFromPage.$().add(oToPage.$()));
							}
						}, 600);

					}, 60); // this value has been found by testing on actual devices; with "10" there are frequent "no-animation" issues, with "100" there are none, with "50" there are very few#
				}, 0);
			},

			back: function(oFromPage, oToPage, fCallback /*, oTransitionParameters is unused */) {
				var that = this;

				that.$().addClass("sapMNavFlip");

				// set the style classes that represent the initial state
				oToPage.addStyleClass("sapMNavItemFlipPrevious");     // the page to navigate back to should be placed just left of the visible area
				oToPage.removeStyleClass("sapMNavItemHidden"); // remove the "hidden" class now which has been added by the NavContainer before the animation was called

				// iPhone needs some time... there is no animation without waiting
				window.setTimeout(function() {

					var bOneTransitionFinished = false;
					var bTransitionEndPending = true;
					var fAfterTransition = null; // make Eclipse aware that this variable is defined
					fAfterTransition = function() {
						jQuery(this).unbind("webkitTransitionEnd transitionend");
						if (!bOneTransitionFinished) {
							// the first one of both transitions finished
							bOneTransitionFinished = true;
						} else {
							// the second transition now also finished => clean up the style classes
							bTransitionEndPending = false;
							oToPage.removeStyleClass("sapMNavItemFlipping");
							oFromPage.removeStyleClass("sapMNavItemFlipping").addStyleClass("sapMNavItemHidden").removeStyleClass("sapMNavItemFlipNext");
							that.$().removeClass("sapMNavFlip");

							// notify the NavContainer that the animation is complete
							fCallback();
						}
					};

					oFromPage.$().bind("webkitTransitionEnd transitionend", fAfterTransition);
					oToPage.$().bind("webkitTransitionEnd transitionend", fAfterTransition);

					// set the new style classes that represent the end state (and thus start the transition)
					oToPage.addStyleClass("sapMNavItemFlipping").removeStyleClass("sapMNavItemFlipPrevious"); // transition from left position to normal/center position starts now
					oFromPage.addStyleClass("sapMNavItemFlipping").addStyleClass("sapMNavItemFlipNext"); // transition from normal position to right position starts now

					window.setTimeout(function(){ // in case rerendering prevented the fAfterTransition call
						if (bTransitionEndPending) {
							bOneTransitionFinished = true;
							fAfterTransition.apply(oFromPage.$().add(oToPage.$()));
						}
					}, 600);

				}, 60); // this value has been found by testing on actual devices; with "10" there are frequent "no-animation" issues, with "100" there are none, with "50" there are very few
			}
		};

	} else { // no CSS transitions, IE9 support
		NavContainer.transitions["flip"] = NavContainer.transitions["slide"];
	}


	//*** DOOR Transition ***

	if (jQuery.support.cssTransitions) {
		NavContainer.transitions["door"] = {

			to: function(oFromPage, oToPage, fCallback /*, oTransitionParameters is unused */) {
				var that = this;
				window.setTimeout(function(){ // iPhone seems to need a zero timeout here, otherwise the to page is black (and may suddenly become visible when the DOM is touched)

					that.$().addClass("sapMNavDoor");

					// set the style classes that represent the initial state
					oToPage.addStyleClass("sapMNavItemDoorInNext");     // the page to navigate to should be placed just right of the visible area
					oToPage.removeStyleClass("sapMNavItemHidden"); // remove the "hidden" class now which has been added by the NavContainer before the animation was called

					// iPhone needs some time... there is no animation without waiting
					window.setTimeout(function(){

						var bOneTransitionFinished = false;
						var bTransitionEndPending = true;
						var fAfterTransition = null; // make Eclipse aware that this variable is defined
						fAfterTransition = function() {
							jQuery(this).unbind("webkitAnimationEnd animationend");
							if (!bOneTransitionFinished) {
								// the first one of both transitions finished
								bOneTransitionFinished = true;
							} else {
								// the second transition now also finished => clean up the style classes
								bTransitionEndPending = false;
								oToPage.removeStyleClass("sapMNavItemDooring").removeStyleClass("sapMNavItemDoorInNext");
								oFromPage.removeStyleClass("sapMNavItemDooring").addStyleClass("sapMNavItemHidden").removeStyleClass("sapMNavItemDoorInPrevious");
								that.$().removeClass("sapMNavDoor");

								// notify the NavContainer that the animation is complete
								fCallback();
							}
						};

						oFromPage.$().bind("webkitAnimationEnd animationend", fAfterTransition);
						oToPage.$().bind("webkitAnimationEnd animationend", fAfterTransition);

						// set the new style classes that represent the end state (and thus start the transition)
						oToPage.addStyleClass("sapMNavItemDooring");
						oFromPage.addStyleClass("sapMNavItemDooring").addStyleClass("sapMNavItemDoorInPrevious");

						window.setTimeout(function(){ // in case rerendering prevented the fAfterTransition call
							if (bTransitionEndPending) {
								bOneTransitionFinished = true;
								fAfterTransition.apply(oFromPage.$().add(oToPage.$()));
							}
						}, 1000);

					}, 60); // this value has been found by testing on actual devices; with "10" there are frequent "no-animation" issues, with "100" there are none, with "50" there are very few#
				}, 0);
			},

			back: function(oFromPage, oToPage, fCallback /*, oTransitionParameters is unused */) {
				var that = this;

				that.$().addClass("sapMNavDoor");

				// set the style classes that represent the initial state
				oToPage.addStyleClass("sapMNavItemDoorOutNext");     // the page to navigate back to should be placed just left of the visible area
				oToPage.removeStyleClass("sapMNavItemHidden"); // remove the "hidden" class now which has been added by the NavContainer before the animation was called

				// iPhone needs some time... there is no animation without waiting
				window.setTimeout(function() {

					var bOneTransitionFinished = false;
					var bTransitionEndPending = true;
					var fAfterTransition = null; // make Eclipse aware that this variable is defined
					fAfterTransition = function() {
						jQuery(this).unbind("webkitAnimationEnd animationend");
						if (!bOneTransitionFinished) {
							// the first one of both transitions finished
							bOneTransitionFinished = true;
						} else {
							// the second transition now also finished =>  clean up the style classes
							bTransitionEndPending = false;
							oToPage.removeStyleClass("sapMNavItemDooring").removeStyleClass("sapMNavItemDoorOutNext");
							oFromPage.removeStyleClass("sapMNavItemDooring").addStyleClass("sapMNavItemHidden").removeStyleClass("sapMNavItemDoorOutPrevious");
							that.$().removeClass("sapMNavDoor");

							// notify the NavContainer that the animation is complete
							fCallback();
						}
					};

					oFromPage.$().bind("webkitAnimationEnd animationend", fAfterTransition);
					oToPage.$().bind("webkitAnimationEnd animationend", fAfterTransition);

					// set the new style classes that represent the end state (and thus start the transition)
					oToPage.addStyleClass("sapMNavItemDooring"); // transition from left position to normal/center position starts now
					oFromPage.addStyleClass("sapMNavItemDooring").addStyleClass("sapMNavItemDoorOutPrevious"); // transition from normal position to right position starts now

					window.setTimeout(function(){ // in case rerendering prevented the fAfterTransition call
						if (bTransitionEndPending) {
							bOneTransitionFinished = true;
							fAfterTransition.apply(oFromPage.$().add(oToPage.$()));
						}
					}, 1000);

				}, 60); // this value has been found by testing on actual devices; with "10" there are frequent "no-animation" issues, with "100" there are none, with "50" there are very few
			}
		};

	} else { // no CSS transitions, IE9 support
		NavContainer.transitions["door"] = NavContainer.transitions["slide"];
	}



	/**
	 * Adds a custom transition to the NavContainer type (not to a particular instance!). The transition is identified by a "name". Make sure to only use names that will not collide with transitions which may be added to the NavContainer later. A suggestion is to use the prefix "c_" or "_" for your custom transitions to ensure this.
	 *
	 * "to" and "back" are the transition functions for the forward and backward navigation.
	 * Both will be called with the following parameters:
	 * - oFromPage: the Control which is currently being displayed by the NavContainer
	 * - oToPage: the Control which should be displayed by the NavContainer after the transition
	 * - fCallback: a function which MUST be called when the transition has completed
	 * - oTransitionParameters: a data object that can be given by application code when triggering the transition by calling to() or back(); this object could give additional information to the transition function, like the DOM element which triggered the transition or the desired transition duration
	 *
	 * The contract for "to" and "back" is that they may do an animation of their choice, but it should not take "too long". At the beginning of the transition the target page "oToPage" does have the CSS class "sapMNavItemHidden" which initially hides the target page (visibility:hidden). The transition can do any preparation (e.g. move that page out of the screen or make it transparent) and then should remove this CSS class.
	 * After the animation the target page "oToPage" should cover the entire screen and the source page "oFromPage" should not be visible anymore. This page should then have the CSS class "sapMNavItemHidden".
	 * For adding/removing this or other CSS classes, the transition can use the addStyleClass/removeStyleClass method:
	 * oFromPage.addStyleClass("sapMNavItemHidden");
	 * When the transition is complete, it MUST call the given fCallback method to inform the NavContainer that navigation has finished!
	 *
	 * Hint: if the target page of your transition stays black on iPhone, try wrapping the animation start into a
	 * setTimeout(..., 0)
	 * block (delayed, but without waiting).
	 *
	 * This method can be called on any NavContainer instance or statically on the sap.m.NavContainer type. However, the transition will always be registered for the type (and ALL instances), not for the single instance on which this method was invoked.
	 *
	 * Returns the sap.m.NavContainer type if called statically, or "this" (to allow method chaining) if called on a particular NavContainer instance.
	 *
	 * @param {string} sName
	 *         The name of the transition. This name can be used by the application to choose this transition when navigating "to()" or "back()": the "transitionName" parameter of "NavContainer.to()" corresponds to this name, the back() navigation will automatically use the same transition.
	 *
	 *         Make sure to only use names that will not collide with transitions which may be added to the NavContainer later. A suggestion is to use the prefix "c_" or "_" for your custom transitions to ensure this.
	 * @param {object} oTo
	 *         The function which will be called by the NavContainer when the application navigates "to()", using this animation's name. The NavContainer instance is the "this" context within the animation function.
	 *
	 *         See the documentation of NavContainer.addCustomTransitions for more details about this function.
	 * @param {object} oBack
	 *         The function which will be called by the NavContainer when the application navigates "back()" from a page where it had navigated to using this animation's name. The NavContainer instance is the "this" context within the animation function.
	 *
	 *         See the documentation of NavContainer.addCustomTransitions for more details about this function.
	 * @type sap.m.NavContainer
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	NavContainer.prototype.addCustomTransition = function(sName, fTo, fBack) {
		if (NavContainer.transitions[sName]) {
			jQuery.sap.log.warning("Transition with name " + sName + " already exists in " + this + ". It is now being replaced by custom transition.");
		}

		NavContainer.transitions[sName] = {to:fTo, back:fBack};
		return this;
	};
	NavContainer.addCustomTransition = NavContainer.prototype.addCustomTransition;



	// ----------------- code for tracking and avoiding invalidation --------------------------

	/**
	 * Forces invalidation and rerendering (.invalidate() is disabled)
	 * @private
	 */
	NavContainer.prototype.forceInvalidation = NavContainer.prototype.invalidate;

	NavContainer.prototype.invalidate = function(oSource) {

		/*eslint-disable no-empty */
		if (oSource == this) {
		/*eslint-enable no-empty */
			// does not happen because the source is only given when propagating to a parent

		} else if (!oSource) {
			// direct invalidation of the NavContainer; this means a property has been modified
			this.forceInvalidation(); // let invalidation occur

		} else if (oSource instanceof Control) {
			// an aggregated control is invalidated
			var bIsInPages = false,
				aPages = this.getPages(),
				l = aPages.length;

			for (var i = 0; i < l; i++) {
				if (aPages[i] === oSource) {
					bIsInPages = true;
					break;
				}
			}

			if (!bIsInPages || oSource.getId() === this.getCurrentPage()) {
				// TODO: there will be more cases where invalidation is not required...
				this.forceInvalidation();
			} // else : the invalidation source is a non-current page, so do not rerender anything

		} else {
			// TODO: which cases are ending up here?
			this.forceInvalidation();

		}
	};

	NavContainer.prototype.removePage = function(oPage) {
		oPage = this.removeAggregation("pages", oPage);

		this._onPageRemoved(oPage);

		return oPage;
	};

	NavContainer.prototype._onPageRemoved = function (oPage) {
		if (!oPage) {
			return;
		}

		// remove the dom because if you remove the hidden class, the page will get visible until the rerendering of the navContainer - causes a flickering
		oPage.$().remove();

		// remove the style classes that might be added by the navContainer
		oPage.removeStyleClass("sapMNavItemHidden");
		oPage.removeStyleClass("sapMNavItem");

		var aStack = this._ensurePageStackInitialized();
		// Remove all occurences from the stack
		this._pageStack = aStack.filter(function (oPageStackInfo) {
			return oPage.getId() !== oPageStackInfo.id;
		});

	};

	NavContainer.prototype.removeAllPages = function() {
		var aPages = this.getPages();
		if (!aPages) {
			return [];
		}

		for (var i = 0; i < aPages.length; i++) {
			this._onPageRemoved(aPages[i]);
		}

		return this.removeAllAggregation("pages");
	};

	NavContainer.prototype.addPage = function(oPage) {
		var aPages = this.getPages();
		// Routing often adds an already existing page. ManagedObject would remove and re-add it because the order is affected,
		// but here the order does not matter, so just ignore the call in this case.
		if (jQuery.inArray(oPage, aPages) > -1) {
			return this;
		}

		this.addAggregation("pages", oPage, true);

		// sapMNavItem must be added after addAggregation is called because addAggregation can lead
		// to a removePage-call where the class is removed again.
		oPage.addStyleClass("sapMNavItem");
		var iPreviousPageCount = aPages.length;

		if (iPreviousPageCount === 0 && /* get the NEW pages count */ this.getPages().length === 1 && this.getDomRef()) { // the added page is the first and only page and has been newly added
			this._ensurePageStackInitialized();
			this.rerender();
		}

		return this;
	};

	NavContainer.prototype.insertPage = function(oPage, iIndex) {
		this.insertAggregation("pages", oPage, iIndex, true);

		// sapMNavItem must be added after addAggregation is called because addAggregation can lead
		// to a removePage-call where the class is removed again.
		oPage.addStyleClass("sapMNavItem");
		var iPreviousPageCount = this.getPages().length;

		if (iPreviousPageCount === 0 && this.getPages().length === 1 && this.getDomRef()) { // the added page is the first and only page and has been newly added
			this._ensurePageStackInitialized();
			this.rerender();
		}

		return this;
	};



	// documentation of the pseudo events (beforeShow, afterShow, beforeHide etc.)

	/**
	 * sap.m.NavContainerChild is an artificial interface with the only purpose to bear the documentation of
	 * pseudo events triggered by sap.m.NavContainer on its child controls when navigation occurs and child controls are displayed/hidden.
	 *
	 * Interested parties outside the child control can listen to one or more of these events by registering a Delegate:
	 * <pre>
	 * page1.addEventDelegate({
	 *    onBeforeShow: function(evt) {
	 *       // page1 is about to be shown; act accordingly - if required you can read event information from the evt object
	 *    },
	 *    onAfterHide: function(evt) {
	 *       // ...
	 *    }
	 * });
	 * </pre>
	 *
	 * @name sap.m.NavContainerChild
	 * @interface
	 * @public
	*/


	/**
	 * This event is fired before the NavContainer shows this child control for the first time.
	 * @event
	 * @param {sap.ui.core.Control} oEvent.srcControl the NavContainer firing the event
	 * @param {object} oEvent.data the data object which has been passed with the "to" navigation, or an empty object
	 * @param {object} oEvent.backData the data object which has been passed with the back navigation, or an empty object
	 * @name sap.m.NavContainerChild.prototype.BeforeFirstShow
	 * @public
	*/

	/**
	 * This event is fired every time before the NavContainer shows this child control. In case of animated transitions this
	 * event is fired before the transition starts.
	 * @event
	 * @param {sap.ui.core.Control} oEvent.srcControl the NavContainer firing the event
	 * @param {object} oEvent.data the data object which has been passed with the "to" navigation, or an empty object
	 * @param {object} oEvent.backData the data object which has been passed with the back navigation, or an empty object
	 * @name sap.m.NavContainerChild.prototype.BeforeShow
	 * @public
	*/

	/**
	 * This event is fired every time when the NavContainer has made this child control visible. In case of animated transitions this
	 * event is fired after the transition finishes. This control is now being displayed and not animated anymore.
	 * @event
	 * @param {sap.ui.core.Control} oEvent.srcControl the NavContainer firing the event
	 * @param {object} oEvent.data the data object which has been passed with the "to" navigation, or an empty object
	 * @param {object} oEvent.backData the data object which has been passed with the back navigation, or an empty object
	 * @name sap.m.NavContainerChild.prototype.AfterShow
	 * @public
	*/

	/**
	 * This event is fired every time before the NavContainer hides this child control. In case of animated transitions this
	 * event is fired before the transition starts.
	 * @event
	 * @param {sap.ui.core.Control} oEvent.srcControl the NavContainer firing the event
	 * @name sap.m.NavContainerChild.prototype.BeforeHide
	 * @public
	*/

	/**
	 * This event is fired every time when the NavContainer has made this child control invisible. In case of animated transitions this
	 * event is fired after the transition finishes. This control is now no longer being displayed and not animated anymore.
	 * @event
	 * @param {sap.ui.core.Control} oEvent.srcControl the NavContainer firing the event
	 * @name sap.m.NavContainerChild.prototype.AfterHide
	 * @public
	*/


	return NavContainer;

}, /* bExport= */ true);
