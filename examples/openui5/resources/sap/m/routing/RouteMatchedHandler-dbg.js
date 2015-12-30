/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global', 'sap/ui/base/Object', 'sap/ui/core/routing/History', 'sap/ui/core/routing/Router', './TargetHandler', './Router'],
	function(jQuery, BaseObject, History, Router, TargetHandler, MobileRouter) {
	"use strict";


	/**
	 * Instantiates a RouteMatchedHandler.
	 *
	 * @class
	 * This class will attach to the Events of a provided router and add the views created by it to a  {@link sap.m.SplitContainer} or a {@link sap.m.NavContainer} Control, if this is the target control of the route.</br>
	 * If the targetControl is no {@link sap.m.SplitContainer} or a {@link sap.m.NavContainer}, It will only close the dialogs, according to the property value.</br>
	 * </br>
	 * When a navigation is triggered, this class will try to determine the transition of the pages based on the history.</br>
	 * Eg: if a user presses browser back, it will show a backwards animation.</br>
	 * </br>
	 * The navigation on the container takes place in the RoutePatternMatched event of the Router. If you register on the RouteMatched event of the Router, the visual navigation did not take place yet.</br>
	 * </br>
	 * Since it is hard to detect if a user has pressed browser back, this transitions will not be reliable, for example if someone bookmarked a detail page, and wants to navigate to a masterPage.</br>
	 * If you want this case to always show a backwards transition, you should specify a "viewLevel" property on your Route.</br>
	 * The viewLevel has to be an integer. The Master should have a lower number than the detail.</br>
	 * These levels should represent the user process of your application and they do not have to match the container structure of your Routes.</br>
	 * If the user navigates between views with the same viewLevel, the history is asked for the direction.</br>
	 * </br>
	 * You can specify a property "transition" in a route to define which transition will be applied when navigating. If it is not defined, the nav container will take its default transition.
	 * </br>
	 * You can also specify "transitionParameters" on a Route, to give the transition parameters.</br>
	 * </br>
	 * preservePageInSplitContainer is deprecated since 1.28 since Targets make this parameter obsolete.
	 * If you want to preserve the current view when navigating, but you want to navigate to it when nothing is displayed in the navContainer, you can set preservePageInSplitContainer = true</br>
	 * When the route that has this flag directly matches the pattern, the view will still be switched by the splitContainer.
	 * </br>
	 * @see sap.m.NavContainer
	 *
	 *
	 * @deprecated @since 1.28 use {@link sap.m.routing.Router} or {@link sap.m.routing.Targets} instead. The functionality of the routematched handler is built in into these two classes, there is no need to create this anymore.
	 * @param {sap.ui.core.routing.Router} router - A router that creates views</br>
	 * @param {boolean} closeDialogs - the default is true - will close all open dialogs before navigating, if set to true. If set to false it will just navigate without closing dialogs.
	 * @public
	 * @alias sap.m.routing.RouteMatchedHandler
	 */
	var RouteMatchedHandler = BaseObject.extend("sap.m.routing.RouteMatchedHandler", {
		constructor : function (oRouter, bCloseDialogs) {
			if (oRouter instanceof MobileRouter) {
				jQuery.sap.log.warning("A sap.m.routing.Router is used together with a sap.m.routing.RouteMatchedHandler (deprecated)." +
					"The RoutematchedHandler is not taking over triggering the navigations, the Router will do it.", this);
				return;
			}

			this._oTargetHandler = new TargetHandler(bCloseDialogs);

			// Route matched is thrown for each container in the route hierarchy
			oRouter.attachRouteMatched(this._onHandleRouteMatched, this);
			// Route Pattern Matched is thrown only once for the end point of the current navigation
			oRouter.attachRoutePatternMatched(this._handleRoutePatternMatched, this);

			this._oTargets = oRouter.getTargets();

			if (this._oTargets) {
				this._oTargets.attachDisplay(this._onHandleDisplay, this);
			}

			this._oRouter = oRouter;
		}
	});

	/* =================================
	 * public
	 * =================================*/

	/**
	 * Removes the routeMatchedHandler from the Router
	 *
	 * @public
	 * @returns {sap.m.routing.RouteMatchedHandler} for chaining
	 */
	RouteMatchedHandler.prototype.destroy = function () {
		if (this._oRouter) {
			this._oRouter.detachRouteMatched(this._onHandleRouteMatched, this);
			this._oRouter.detachRoutePatternMatched(this._handleRoutePatternMatched, this);
			this._oRouter = null;
		}

		if (this._oTargets) {
			this._oTargets.detachDisplay(this._onHandleRouteMatched, this);
			this._oTargets = null;
		}

		return this;
	};

	/**
	 * Sets if a navigation should close dialogs
	 *
	 * @param {boolean} bCloseDialogs close dialogs if true
	 * @public
	 * @returns {sap.m.routing.RouteMatchedHandler} for chaining
	 */
	RouteMatchedHandler.prototype.setCloseDialogs = function (bCloseDialogs) {
		this._oTargetHandler.setCloseDialogs(bCloseDialogs);
		return this;
	};


	/**
	 * Gets if a navigation should close dialogs
	 *
	 * @public
	 * @returns {boolean} a flag indication if dialogs will be closed
	 */
	RouteMatchedHandler.prototype.getCloseDialogs = function () {
		return this._oTargetHandler.getCloseDialogs();
	};


	/* =================================
	 * private
	 * =================================
	*/

	/**
	 * Handling of navigation event:
	 * Order of navigation events is first all RouteMatched events then the single RoutePatternMatched event.
	 * We collect all RouteMatched events in a queue (one for each container) as soon as the RoutePatternMatched
	 * is reached the direction of the navigation is derived by _handleRoutePatternMatched. This direction is
	 * forwarded to the route's view container (done in _handleRouteMatched)
	 * @param {object} oEvent The routePatternMatched event
	 * @private
	 */
	RouteMatchedHandler.prototype._handleRoutePatternMatched = function(oEvent) {
		var iTargetViewLevel = +oEvent.getParameter("config").viewLevel;

		this._oTargetHandler.navigate({
			viewLevel: iTargetViewLevel,
			navigationIdentifier : oEvent.getParameter("name"),
			askHistory: true
		});
	};

	/**
	 * queues up calls
	 * @param {object} oEvent The routeMatched event
	 * @private
	 */
	RouteMatchedHandler.prototype._onHandleRouteMatched = function(oEvent) {
		var oParameters = oEvent.getParameters(),
			oConfig = oParameters.config;

		// Route is using targets so the display event will handle this navigation
		if (!this._oRouter.getRoute(oParameters.name)._oTarget) {
			return;
		}

		this._oTargetHandler.addNavigation({
			targetControl : oParameters.targetControl,
			eventData : oParameters.arguments,
			view : oParameters.view,
			navigationIdentifier : oParameters.name,
			transition: oConfig.transition,
			transitionParameters: oConfig.transitionParameters,
			preservePageInSplitContainer: oConfig.preservePageInSplitContainer
		});
	};

	/**
	 * queues up calls
	 * @param {object} oEvent The routeMatched event
	 * @private
	 */
	RouteMatchedHandler.prototype._onHandleDisplay = function(oEvent) {
		var oParameters = oEvent.getParameters(),
			oConfig = oParameters.config;

		this._oTargetHandler.addNavigation({
			targetControl : oParameters.control,
			eventData : oParameters.data,
			view : oParameters.view,
			navigationIdentifier : oParameters.name,
			transition: oConfig.transition,
			transitionParameters: oConfig.transitionParameters,
			preservePageInSplitContainer: oConfig.preservePageInSplitContainer
		});
	};

	return RouteMatchedHandler;

}, /* bExport= */ true);
