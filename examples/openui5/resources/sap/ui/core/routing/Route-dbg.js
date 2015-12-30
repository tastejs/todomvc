/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(['jquery.sap.global', 'sap/ui/base/EventProvider', 'sap/ui/core/routing/Target', 'sap/ui/core/Component'],
	function($, EventProvider, Target, Component) {
	"use strict";

		/**
		 * Instantiates a SAPUI5 Route
		 *
		 * @class
		 * @param {sap.ui.core.routing.Router} The router instance, the route will be added to.
		 * @param {object} oConfig configuration object for the route
		 * @param {string} oConfig.name the name of the route - it will be used to retrieve the route from the router, it needs to be unique per router instance.</li>
		 * @param {string} [oConfig.pattern] the url pattern where it needs to match again. A pattern may consist of the following:
		 * <ul>
		 * <li>
		 * hardcoded parts: "pattern" : "product/settings" - this pattern will only match if the hash of the browser is product/settings and no arguments will be passed to the events of the route.</br>
		 * </li>
		 * <li>
		 * mandatory parameters: "pattern" : "product/{id}" - {id} is a mandatory parameter, e. g. the following hashes would match: product/5, product/3. The pattenMatched event will get 5 or 3 passed as id in its arguments.The hash product/ will not match.</br>
		 * </li>
		 * <li>
		 * optional parameters: "pattern" : "product/{id}/detail/:detailId:" - :detailId: is an optional parameter, e. g. the following hashes would match: product/5/detail, product/3/detail/2</br>
		 * </li>
		 * <li>
		 * query parameters: "pattern" : "product{?query}" // {?query} allows you to pass queries with any parameters, e. g. the following hashes would match: product?first=firstValue, product?first=firstValue&second=secondValue</br>
		 * </li>
		 * <li>
		 * rest as string parameters: "pattern" : ":all*:" - this pattern will define an optional variable that will pass the whole hash as string to the routing events. It may be used to define a catchall route, e. g. the following hashes would match: foo, product/5/3, product/5/detail/3/foo. You can also combine it with the other variables but make sure a variable with a * is the last one.</br>
		 * </ul>
		 * @param {boolean} [oConfig.greedy] @since 1.27: default: false - By default only the first route matching the hash, will fire events. If greedy is turned on for a route its events will be fired even if another route has already matched.
		 * @param {String} [oConfig.parent] @since 1.32 This property contains the information about the route which nests this route in the form: "[componentName:]routeName". The nesting routes pattern will be prefixed to this routes pattern and hence the nesting route also matches if this one matches.
		 * @param {string|string[]} [oConfig.target] one or multiple name of targets {@link sap.ui.core.routing.Targets}. As soon as the route matches, the target will be displayed. All the deprecated parameters are ignored, if a target is used.
		 * @param {string} [oConfig.view] @deprecated since 1.28 - use target.viewName. The name of a view that will be created, the first time this route will be matched. To place the view into a Control use the targetAggregation and targetControl. Views will only be created once per Router.</li>
		 * @param {string} [oConfig.viewType] @deprecated since 1.28 - use target.viewType. The type of the view that is going to be created. eg: "XML", "JS"</li>
		 * @param {string} [oConfig.viewPath] @deprecated since 1.28 - use target.viewPath. A prefix that will be prepended in front of the view eg: view is set to "myView" and viewPath is set to "myApp" - the created view will be "myApp.myView".</li>
		 * @param {string} [oConfig.targetParent] @deprecated since 1.28 - use config.rootView (only available in the config). the id of the parent of the targetControl - This should be the id view your targetControl is located in. By default, this will be the view created by a component, or if the Route is a subroute the view of the parent route is taken. You only need to specify this, if you are not using a router created by a component on your top level routes.</li>
		 * @param {string} [oConfig.targetControl] @deprecated since 1.28 - use target.controlId. Views will be put into a container Control, this might be a {@link sap.ui.ux3.Shell} control or a {@link sap.m.NavContainer} if working with mobile, or any other container. The id of this control has to be put in here.</li>
		 * @param {string} [oConfig.targetAggregation] @deprecated since 1.28 - use target.controlAggregation. The name of an aggregation of the targetControl, that contains views. Eg: a {@link sap.m.NavContainer} has an aggregation "pages", another Example is the {@link sap.ui.ux3.Shell} it has "content".</li>
		 * @param {boolean} [oConfig.clearTarget] @deprecated since 1.28 - use target.clearControlAggregation. Default is false. Defines a boolean that can be passed to specify if the aggregation should be cleared before adding the View to it. When using a {@link sap.ui.ux3.Shell} this should be true. For a {@link sap.m.NavContainer} it should be false.</li>
		 * @param {object} [oConfig.subroutes] @deprecated since 1.28 - use targets.parent. one or multiple routeconfigs taking all of these parameters again. If a subroute is hit, it will fire tge routeMatched event for all its parents. The routePatternMatched event will only be fired for the subroute not the parents. The routing will also display all the targets of the subroutes and its parents.
		 * @param {sap.ui.core.routing.Route} [oParent] The parent route - if a parent route is given, the routeMatched event of this route will also trigger the route matched of the parent and it will also create the view of the parent(if provided).
		 *
		 * @public
		 * @alias sap.ui.core.routing.Route
		 */
		var Route = EventProvider.extend("sap.ui.core.routing.Route", /** @lends sap.ui.core.routing.Route.prototype */ {

			metadata : {
				publicMethods: ["getURL", "getPattern"]
			},

			constructor : function(oRouter, oConfig, oParent) {
				EventProvider.apply(this, arguments);
				if (!oConfig.name) {
					$.sap.log.error("A name has to be specified for every route", this);
				}

				var that = this,
					vRoute = oConfig.pattern,
					aSubRoutes;

				this._aPattern = [];
				this._aRoutes = [];
				this._oParent = oParent;
				this._oConfig = oConfig;
				this._oRouter = oRouter;

				if (!$.isArray(vRoute)) {
					vRoute = [vRoute];
				}

				if (oConfig.parent) {
					var oRoute = this._getParentRoute(oConfig.parent);
					if (!oRoute) {
						$.sap.log.error("No parent route with '" + oConfig.parent + "' could be found", this);
					} else if (oRoute._aPattern.length > 1) {
						$.sap.log.error("Routes with multiple patterns cannot be used as parent for nested routes", this);
						return;
					} else {
						this._oNestingParent = oRoute;
						vRoute.forEach(function(sRoute, i) {
							var sNestingRoute = oRoute._aPattern[0];
							sNestingRoute = sNestingRoute.charAt(sNestingRoute.length) === "/" ? sNestingRoute : sNestingRoute + "/";
							vRoute[i] = sNestingRoute + sRoute;
						});
					}
				}

				if ($.isArray(oConfig.subroutes)) {
					//Convert subroutes
					aSubRoutes = oConfig.subroutes;
					oConfig.subroutes = {};
					$.each(aSubRoutes, function(iSubrouteIndex, oSubRoute) {
						oConfig.subroutes[oSubRoute.name] = oSubRoute;
					});
				}


				if (!oConfig.target) {
					// create a new target for this route
					this._oTarget = new Target(oConfig, oRouter._oViews, oParent && oParent._oTarget);
					this._oTarget._bUseRawViewId = true;
				}

				// recursively add the subroutes to this route
				if (oConfig.subroutes) {
					$.each(oConfig.subroutes, function(sRouteName, oSubRouteConfig) {
						if (oSubRouteConfig.name === undefined) {
							oSubRouteConfig.name = sRouteName;
						}
						oRouter.addRoute(oSubRouteConfig, that);
					});
				}

				if (oConfig.pattern === undefined) {
					//this route has no pattern - it will not get a matched handler. Or a crossroads route
					return;
				}

				$.each(vRoute, function(iIndex, sRoute) {

					that._aPattern[iIndex] = sRoute;

					that._aRoutes[iIndex] = oRouter._oRouter.addRoute(sRoute);
					that._aRoutes[iIndex].greedy = oConfig.greedy;

					that._aRoutes[iIndex].matched.add(function() {
						var oArguments = {};
						$.each(arguments, function(iArgumentIndex, sArgument) {
							oArguments[that._aRoutes[iIndex]._paramsIds[iArgumentIndex]] = sArgument;
						});
						that._routeMatched(oArguments, true);
					});
				});
			},


			/**
			 * Destroys a route
			 *
			 * @public
			 * @returns { sap.ui.core.routing.Route } this for chaining.
			 */
			destroy : function () {
				EventProvider.prototype.destroy.apply(this);

				this._aPattern = null;
				this._aRoutes = null;
				this._oParent = null;
				this._oConfig = null;

				this.bIsDestroyed = true;

				return this;
			},

			/**
			 * Returns the URL for the route and replaces the placeholders with the values in oParameters
			 *
			 * @param {object} oParameters Parameters for the route
			 * @return {string} the unencoded pattern with interpolated arguments
			 * @public
			 */
			getURL : function (oParameters) {
				return this._aRoutes[0].interpolate(oParameters);
			},

			/**
			 * Return the pattern of the route. If there are multiple patterns, the first pattern is returned
			 *
			 * @return {string} the routes pattern
			 * @public
			 */
			getPattern : function() {
				return this._aPattern[0];
			},

			/**
			 * Attach event-handler <code>fnFunction</code> to the 'matched' event of this <code>sap.ui.core.routing.Route</code>.<br/>
			 *
			 *
			 * @param {object} [oData] The object, that should be passed along with the event-object when firing the event.
			 * @param {function} fnFunction The function to call, when the event occurs. This function will be called on the
			 *            oListener-instance (if present) or in a 'static way'.
			 * @param {object} [oListener] Object on which to call the given function. If empty, this Model is used.
			 *
			 * @return {sap.ui.core.routing.Route} <code>this</code> to allow method chaining
			 * @public
			 * @since 1.25.1
			 */
			attachMatched : function(oData, fnFunction, oListener) {
				return this.attachEvent("matched", oData, fnFunction, oListener);
			},

			/**
			 * Detach event-handler <code>fnFunction</code> from the 'matched' event of this <code>sap.ui.core.routing.Route</code>.<br/>
			 *
			 * The passed function and listener object must match the ones previously used for event registration.
			 *
			 * @param {function} fnFunction The function to call, when the event occurs.
			 * @param {object} oListener Object on which the given function had to be called.
			 * @return {sap.ui.core.routing.Route} <code>this</code> to allow method chaining
			 * @public
			 * @since 1.25.1
			 */
			detachMatched : function(fnFunction, oListener) {
				return this.detachEvent("matched", fnFunction, oListener);
			},

			/**
			 * Attach event-handler <code>fnFunction</code> to the 'patternMatched' event of this <code>sap.ui.core.routing.Route</code>.<br/>
			 *
			 *
			 * @param {object} [oData] The object, that should be passed along with the event-object when firing the event.
			 * @param {function} fnFunction The function to call, when the event occurs. This function will be called on the
			 *            oListener-instance (if present) or in a 'static way'.
			 * @param {object} [oListener] Object on which to call the given function. If empty, this Model is used.
			 *
			 * @return {sap.ui.core.routing.Route} <code>this</code> to allow method chaining
			 * @public
			 * @since 1.25.1
			 */
			attachPatternMatched : function(oData, fnFunction, oListener) {
				return this.attachEvent("patternMatched", oData, fnFunction, oListener);
			},

			/**
			 * Detach event-handler <code>fnFunction</code> from the 'patternMatched' event of this <code>sap.ui.core.routing.Route</code>.<br/>
			 *
			 * The passed function and listener object must match the ones previously used for event registration.
			 *
			 * @param {function} fnFunction The function to call, when the event occurs.
			 * @param {object} oListener Object on which the given function had to be called.
			 * @return {sap.ui.core.routing.Route} <code>this</code> to allow method chaining
			 * @public
			 * @since 1.25.1
			 */
			detachPatternMatched : function(fnFunction, oListener) {
				return this.detachEvent("patternMatched", fnFunction, oListener);
			},

			/**
			 * Executes the behaviour when route is matched
			 *
			 * @private
			 * @function
			 */
			_routeMatched : function(oArguments, bInital, oNestingChild) {
				var oRouter = this._oRouter,
					oParentPlaceInfo,
					oPlaceInfo,
					oTarget,
					oConfig,
					oEventData,
					oView = null,
					oTargetControl = null;

				// Recursively fire matched event and display views of this routes parents
				if (this._oParent) {
					oParentPlaceInfo = this._oParent._routeMatched(oArguments);
				} else if (this._oNestingParent) {
					// pass child for setting the flag in event parameter of parent
					this._oNestingParent._routeMatched(oArguments, false, this);
				}

				oConfig =  $.extend({}, oRouter._oConfig, this._oConfig);

				oEventData = {
					name: oConfig.name,
					arguments: oArguments,
					config : oConfig
				};

				if (oNestingChild) {
					// setting the event parameter of nesting child
					oEventData.nestedRoute = oNestingChild;
				}

				// Route is defined without target in the config - use the internally created target to place the view
				if (this._oTarget) {
					oTarget = this._oTarget;
					// update the targets config so defaults are taken into account - since targets cannot be added in runtime they don't merge configs like routes do
					oTarget._oOptions = this._convertToTargetOptions(oConfig);

					// validate if it makes sense to display the target (Route does not have all params required) - no error logging will be done during validation
					if (oTarget._isValid(oParentPlaceInfo, false)) {
						oPlaceInfo = oTarget._place(oParentPlaceInfo);
					}

					oPlaceInfo = oPlaceInfo || {};

					oView = oPlaceInfo.oTargetParent;
					oTargetControl = oPlaceInfo.oTargetControl;

					// Extend the event data with view and targetControl
					oEventData.view = oView;
					oEventData.targetControl = oTargetControl;
				} else {
					// let targets do the placement + the events
					oRouter._oTargets._display(this._oConfig.target, oArguments);
				}

				if (oConfig.callback) {
					//Targets don't pass TargetControl and view since there might be multiple
					oConfig.callback(this, oArguments, oConfig, oTargetControl, oView);
				}

				setTimeout(function(){
					this.fireEvent("matched", oEventData);
					oRouter.fireRouteMatched(oEventData);
				}.bind(this), 0);

				// skip this event in the recursion
				if (bInital) {
					setTimeout(function(){
						$.sap.log.info("The route named '" + oConfig.name + "' did match with its pattern", this);
						this.fireEvent("patternMatched", oEventData);
						oRouter.fireRoutePatternMatched(oEventData);
					}.bind(this), 0);
				}

				return oPlaceInfo;
			},

			_convertToTargetOptions: function (oOptions) {
				return $.extend(true,
					{},
					oOptions,
					{
						rootView: oOptions.targetParent,
						controlId: oOptions.targetControl,
						controlAggregation: oOptions.targetAggregation,
						clearControlAggregation: oOptions.clearTarget,
						viewName: oOptions.view,
						// no rename here
						viewType: oOptions.viewType,
						viewId: oOptions.viewId
					});
			},

			_getParentRoute: function (sParent) {
				var aParts = sParent.split(":");
				if (aParts.length === 1 || (aParts.length === 2 && !aParts[0]))  {
					return this._oRouter.getRoute(aParts[aParts.length - 1]);
				} else {
					$.sap.assert(this._oRouter._oOwner, "No owner component for " + this._oRouter._oOwner.getId());
					var oOwnerComponent = Component.getOwnerComponentFor(this._oRouter._oOwner);
					while (oOwnerComponent) {
						if (oOwnerComponent.getMetadata().getName() === aParts[0]) {
							var oRouter = oOwnerComponent.getRouter();
							return oRouter.getRoute(aParts[1]);
						}
						oOwnerComponent = Component.getOwnerComponentFor(oOwnerComponent);
					}
					return null;
				}
			}
		});


		Route.M_EVENTS = {
			Matched : "matched",
			PatternMatched : "patternMatched"
		};

		return Route;

});
