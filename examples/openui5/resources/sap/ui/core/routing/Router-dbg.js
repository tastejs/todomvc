/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(['jquery.sap.global', 'sap/ui/base/EventProvider', './HashChanger', './Route', './Views', './Targets', 'sap/ui/thirdparty/crossroads'],
	function($, EventProvider, HashChanger, Route, Views, Targets, crossroads) {
	"use strict";

		var oRouters = {};

		/**
		 * Instantiates a SAPUI5 Router
		 *
		 * @class
		 * @extends sap.ui.base.EventProvider
		 *
		 * @param {object|object[]} [oRoutes] may contain many Route configurations as {@link sap.ui.core.routing.Route#constructor}.<br/>
		 * Each of the routes contained in the array/object will be added to the router.<br/>
		 *
		 * One way of defining routes is an array:
		 * <pre>
		 * [
		 *     //Will create a route called 'firstRouter' you can later use this name in navTo to navigate to this route
		 *     {
		 *         name: "firstRoute"
		 *         pattern : "usefulPattern"
		 *     },
		 *     //Will create a route called 'anotherRoute'
		 *     {
		 *         name: "anotherRoute"
		 *         pattern : "anotherPattern"
		 *     }
		 * ]
		 * </pre>
		 *
		 * The alternative way of defining routes is an Object.
		 * If you choose this way, the name attribute is the name of the property.
		 * <pre>
		 * {
		 *     //Will create a route called 'firstRouter' you can later use this name in navTo to navigate to this route
		 *     firstRoute : {
		 *         pattern : "usefulPattern"
		 *     },
		 *     //Will create a route called 'anotherRoute'
		 *     anotherRoute : {
		 *         pattern : "anotherPattern"
		 *     }
		 * }
		 * </pre>
		 * The values that may be provided are the same as in {@link sap.ui.core.routing.Route#constructor}
		 *
		 * @param {object} [oConfig] Default values for route configuration - also takes the same parameters as {@link sap.ui.core.routing.Target#constructor}.<br/>
		 * This config will be used for routes and for targets, used in the router<br/>
		 * Eg: if the config object specifies :
		 * <pre>
		 * <code>
		 * {
		 *     viewType : "XML"
		 * }
		 * </code>
		 * </pre>
		 * The targets look like this:
		 * <pre>
		 * {
		 *     xmlTarget : {
		 *         ...
		 *     },
		 *     jsTarget : {
		 *         viewType : "JS"
		 *         ...
		 *     }
		 * }
		 * </pre>
		 * Then the effective config will look like this:
		 * <pre>
		 * {
		 *     xmlTarget : {
		 *         viewType : "XML"
		 *         ...
		 *     },
		 *     jsTarget : {
		 *         viewType : "JS"
		 *         ...
		 *     }
		 * }
		 * </pre>
		 *
		 * Since the xmlTarget does not specify its viewType, XML is taken from the config object. The jsTarget is specifying it, so the viewType will be JS.
		 * @param {string|string[]} [oConfig.bypassed.target] Since 1.28. One or multiple names of targets that will be displayed, if no route of the router is matched.<br/>
		 * A typical use case is a not found page.<br/>
		 * The current hash will be passed to the display event of the target.<br/>
		 * <b>Example:</b>
		 * <pre>
		 * <code>
		 *     new Router(
		 *     // Routes
		 *     [
		 *         // Any route here
		 *     ],
		 *     {
		 *         bypassed: {
		 *             // you will find this name in the target config
		 *             target: "notFound"
		 *         }
		 *     },
		 *     // You should only use this constructor when you are not using a router with a component. Please use the metadata of a component to define your routes and targets. The documentation can be found here: {@link sap.ui.core.UIComponent#.extend}.
		 *     null,
		 *     // Target config
		 *     {
		 *          //same name as in the config.bypassed.target
		 *          notFound: {
		 *              viewName: "notFound",
		 *              ...
		 *              // more properties to place the view in the correct container
		 *          }
		 *     });
		 * </code>
		 * </pre>
		 * @param {sap.ui.core.UIComponent} [oOwner] the Component of all the views that will be created by this Router,<br/>
		 * will get forwarded to the {@link sap.ui.core.routing.Views#contructor}.<br/>
		 * If you are using the componentMetadata to define your routes you should skip this parameter.
		 * @param {object} [oTargetsConfig]
		 * available @since 1.28 the target configuration, see {@link sap.ui.core.Targets#constructor} documentation (the options object).<br/>
		 * You should use Targets to create and display views. Since 1.28 the route should only contain routing relevant properties.<br/>
		 * <b>Example:</b>
		 * <pre>
		 * <code>
		 *     new Router(
		 *     // Routes
		 *     [
		 *         {
		 *             // no view creation related properties are in the route
		 *             name: "startRoute",
		 *             //no hash
		 *             pattern: "",
		 *             // you can find this target in the targetConfig
		 *             target: "welcome"
		 *         }
		 *     ],
		 *     // Default values shared by routes and Targets
		 *     {
		 *         viewNamespace: "my.application.namespace",
		 *         viewType: "XML"
		 *     },
		 *     // You should only use this constructor when you are not using a router with a component.
		 *     // Please use the metadata of a component to define your routes and targets.
		 *     // The documentation can be found here: {@link sap.ui.core.UIComponent#.extend}.
		 *     null,
		 *     // Target config
		 *     {
		 *          //same name as in the route called 'startRoute'
		 *          welcome: {
		 *              // All properties for creating and placing a view go here or in the config
		 *              viewName: "Welcome",
		 *              controlId: "app",
		 *              controlAggregation: "pages"
		 *          }
		 *     })
		 * </code>
		 * </pre>
		 * @public
		 * @alias sap.ui.core.routing.Router
		 */
		var Router = EventProvider.extend("sap.ui.core.routing.Router", /** @lends sap.ui.core.routing.Router.prototype */ {

			constructor : function(oRoutes, oConfig, oOwner, oTargetsConfig) {
				EventProvider.apply(this);

				this._oConfig = oConfig || {};
				this._oRouter = crossroads.create();
				this._oRouter.ignoreState = true;
				this._oRoutes = {};
				this._oOwner = oOwner;
				this._oViews = new Views({component : oOwner});

				if (oTargetsConfig) {
					this._oTargets = this._createTargets(oConfig, oTargetsConfig);
				}

				var that = this,
					aRoutes;

				if (!oRoutes) {
					oRoutes = {};
				}

				if ($.isArray(oRoutes)) {
					//Convert route object
					aRoutes = oRoutes;
					oRoutes = {};
					$.each(aRoutes, function(iRouteIndex, oRouteConfig) {
						oRoutes[oRouteConfig.name] = oRouteConfig;
					});
				}

				$.each(oRoutes, function(sRouteName, oRouteConfig) {
					if (oRouteConfig.name === undefined) {
						oRouteConfig.name = sRouteName;
					}
					that.addRoute(oRouteConfig);
				});

				this._oRouter.bypassed.add($.proxy(this._onBypassed, this));
			},

			/**
			 * Adds a route to the router
			 *
			 * @param {object} oConfig configuration object for the route @see sap.ui.core.routing.Route#constructor
			 * @param {sap.ui.core.routing.Route} oParent The parent route - if a parent route is given, the routeMatched event of this route will also trigger the route matched of the parent and it will also create the view of the parent (if provided).
			 * @public
			 */
			addRoute : function (oConfig, oParent) {
				if (!oConfig.name) {
					$.sap.log.error("A name has to be specified for every route", this);
				}

				if (this._oRoutes[oConfig.name]) {
					$.sap.log.error("Route with name " + oConfig.name + " already exists", this);
				}
				this._oRoutes[oConfig.name] = new Route(this, oConfig, oParent);
			},

			/**
			 * Will trigger routing events + place targets for routes matching the string
			 *
			 * @param {string} sNewHash a new hash
			 * @protected
			 */
			parse : function (sNewHash) {
				if (this._oRouter) {
					this._oRouter.parse(sNewHash);
				} else {
					$.sap.log.warning("This router has been destroyed while the hash changed. No routing events where fired by the destroyed instance.", this);
				}
			},

			/**
			 * Attaches the router to the hash changer @see sap.ui.core.routing.HashChanger
			 *
			 * @public
			 * @returns {sap.ui.core.routing.Router} this for chaining.
			 */
			initialize : function () {
				var that = this,
					oHashChanger = this.oHashChanger = HashChanger.getInstance();

				if (this._bIsInitialized) {
					$.sap.log.warning("Router is already initialized.", this);
					return this;
				}

				this._bIsInitialized = true;

				this.fnHashChanged = function(oEvent) {
					that.parse(oEvent.getParameter("newHash"), oEvent.getParameter("oldHash"));
				};

				if (!oHashChanger) {
					$.sap.log.error("navTo of the router is called before the router is initialized. If you want to replace the current hash before you initialize the router you may use getUrl and use replaceHash of the Hashchanger.", this);
					return;
				}

				oHashChanger.attachEvent("hashChanged", this.fnHashChanged);

				if (!oHashChanger.init()) {
					this.parse(oHashChanger.getHash());
				}

				return this;
			},


			/**
			 * Stops to listen to the hashChange of the browser.</br>
			 * If you want the router to start again, call initialize again.
			 * @returns { sap.ui.core.routing.Router } this for chaining.
			 * @public
			 */
			stop : function () {

				if (!this._bIsInitialized) {
					$.sap.log.warning("Router is not initialized. But it got stopped", this);
				}

				if (this.fnHashChanged) {
					this.oHashChanger.detachEvent("hashChanged", this.fnHashChanged);
				}

				this._bIsInitialized = false;

				return this;

			},


			/**
			 * Removes the router from the hash changer @see sap.ui.core.routing.HashChanger
			 *
			 * @public
			 * @returns { sap.ui.core.routing.Router } this for chaining.
			 */
			destroy : function () {
				EventProvider.prototype.destroy.apply(this);

				if (!this._bIsInitialized) {
					$.sap.log.info("Router is not initialized, but got destroyed.", this);
				}

				if (this.fnHashChanged) {
					this.oHashChanger.detachEvent("hashChanged", this.fnHashChanged);
				}

				//will remove all the signals attached to the routes - all the routes will not be useable anymore
				this._oRouter.removeAllRoutes();
				this._oRouter = null;

				$.each(this._oRoutes, function(iRouteIndex, oRoute) {
					oRoute.destroy();
				});
				this._oRoutes = null;
				this._oConfig = null;

				if (this._oTargets) {
					this._oTargets.destroy();
					this._oTargets = null;
				}

				this.bIsDestroyed = true;

				return this;
			},

			/**
			 * Returns the URL for the route and replaces the placeholders with the values in oParameters
			 *
			 * @param {string} sName Name of the route
			 * @param {object} oParameters Parameters for the route
			 * @return {string} the unencoded pattern with interpolated arguments
			 * @public
			 */
			getURL : function (sName, oParameters) {
				if (oParameters === undefined) {
					//even if there are only optional parameters crossroads cannot navigate with undefined
					oParameters = {};
				}

				var oRoute = this.getRoute(sName);
				if (!oRoute) {
					$.sap.log.warning("Route with name " + sName + " does not exist", this);
					return;
				}
				return oRoute.getURL(oParameters);
			},

			/**
			 * Returns the Route with a name, if no route is found undefined is returned
			 *
			 * @param {string} sName Name of the route
			 * @return {sap.ui.core.routing.Route} the route with the provided name or undefined.
			 * @public
			 * @since 1.25.1
			 */
			getRoute : function (sName){
				return this._oRoutes[sName];
			},

			/**
			 * Returns the views instance created by the router
			 *
			 * @return {sap.ui.core.routing.Views} the Views instance
			 * @public
			 * @since 1.28
			 */
			getViews : function () {
				return this._oViews;
			},

			_createTargets : function (oConfig, oTargetsConfig) {
				return new Targets({
					views: this._oViews,
					config: oConfig,
					targets: oTargetsConfig
				});
			},

			/**
			 * Returns a cached view for a given name or creates it if it does not yet exists
			 *
			 * @deprecated @since 1.28.1 use {@link #getViews} instead.
			 * @param {string} sViewName Name of the view
			 * @param {string} sViewType Type of the view
			 * @param {string} sViewId Optional view id
			 * @return {sap.ui.core.mvc.View} the view instance
			 * @public
			 */
			getView : function (sViewName, sViewType, sViewId) {
				var oView = this._oViews._getViewWithGlobalId({
					viewName: sViewName,
					type: sViewType,
					id: sViewId
				});

				this.fireViewCreated({
					view: oView,
					viewName: sViewName,
					type: sViewType
				});

				return oView;
			},

			/**
			 * Adds or overwrites a view in the viewcache of the router, the viewname serves as a key
			 *
			 * @deprecated @since 1.28 use {@link #getViews} instead.
			 * @param {string} sViewName Name of the view
			 * @param {sap.ui.core.mvc.View} oView the view instance
			 * @since 1.22
			 * @public
			 * @returns {sap.ui.core.routing.Router} @since 1.28 the this pointer for chaining
			 */
			setView : function (sViewName, oView) {
				this._oViews.setView(sViewName, oView);
				return this;
			},

			/**
			 * Navigates to a specific route defining a set of parameters. The Parameters will be URI encoded - the characters ; , / ? : @ & = + $ are reserved and will not be encoded.
			 * If you want to use special characters in your oParameters, you have to encode them (encodeURIComponent).
			 *
			 * @param {string} sName Name of the route
			 * @param {object} oParameters Parameters for the route
			 * @param {boolean} bReplace Defines if the hash should be replaced (no browser history entry) or set (browser history entry)
			 * @public
			 * @returns {sap.ui.core.routing.Router} this for chaining.
			 */
			navTo : function (sName, oParameters, bReplace) {
				if (bReplace) {
					this.oHashChanger.replaceHash(this.getURL(sName, oParameters));
				} else {
					this.oHashChanger.setHash(this.getURL(sName, oParameters));
				}

				return this;
			},

			/**
			 * Returns the instance of Targets, if you pass a targets config to the router
			 *
			 * @public
			 * @returns {sap.ui.core.routing.Targets|undefined} The instance of targets, the router uses to place views or undefined if you did not specify the targets parameter in the router's constructor.
			 */
			getTargets : function () {
				return this._oTargets;
			},

			/**
			 * Returns a target by its name (if you pass myTarget: { view: "myView" }) in the config myTarget is the name.
			 * See {@link sap.ui.core.Targets#getTarget}
			 *
			 * @param {string|string[]} vName the name of a single target or the name of multiple targets
			 * @return {sap.ui.core.routing.Target|undefined|sap.ui.core.routing.Target[]} The target with the coresponding name or undefined. If an array way passed as name this will return an array with all found targets. Non existing targets will not be returned but will log an error.
			 */
			getTarget :  function(vName) {
				return this._oTargets.getTarget(vName);
			},

			/**
			 * Attach event-handler <code>fnFunction</code> to the 'routeMatched' event of this <code>sap.ui.core.routing.Router</code>.<br/>
			 *
			 *
			 * @param {object} [oData] The object, that should be passed along with the event-object when firing the event.
			 * @param {function} fnFunction The function to call, when the event occurs. This function will be called on the
			 *            oListener-instance (if present) or in a 'static way'.
			 * @param {object} [oListener] Object on which to call the given function. If empty, this Model is used.
			 *
			 * @return {sap.ui.core.routing.Router} <code>this</code> to allow method chaining
			 * @public
			 */
			attachRouteMatched : function(oData, fnFunction, oListener) {
				this.attachEvent("routeMatched", oData, fnFunction, oListener);
				return this;
			},

			/**
			 * Detach event-handler <code>fnFunction</code> from the 'routeMatched' event of this <code>sap.ui.core.routing.Router</code>.<br/>
			 *
			 * The passed function and listener object must match the ones previously used for event registration.
			 *
			 * @param {function} fnFunction The function to call, when the event occurs.
			 * @param {object} oListener Object on which the given function had to be called.
			 * @return {sap.ui.core.routing.Router} <code>this</code> to allow method chaining
			 * @public
			 */
			detachRouteMatched : function(fnFunction, oListener) {
				this.detachEvent("routeMatched", fnFunction, oListener);
				return this;
			},

			/**
			 * Fire event routeMatched to attached listeners.
			 *
			 * @param {object} [mArguments] the arguments to pass along with the event.
			 *
			 * @return {sap.ui.core.routing.Router} <code>this</code> to allow method chaining
			 * @protected
			 */
			fireRouteMatched : function(mArguments) {
				this.fireEvent("routeMatched", mArguments);
				return this;
			},

			/**
			 * Attach event-handler <code>fnFunction</code> to the 'viewCreated' event of this <code>sap.ui.core.routing.Router</code>.<br/>
			 * @param {object} [oData] The object, that should be passed along with the event-object when firing the event.
			 * @param {function} fnFunction The function to call, when the event occurs. This function will be called on the
			 * oListener-instance (if present) or in a 'static way'.
			 * @param {object} [oListener] Object on which to call the given function. If empty, this Model is used.
			 *
			 * @deprecated @since 1.28 use {@link #getViews} instead.
			 * @return {sap.ui.core.routing.Router} <code>this</code> to allow method chaining
			 * @public
			 */
			attachViewCreated : function(oData, fnFunction, oListener) {
				this.attachEvent("viewCreated", oData, fnFunction, oListener);
				return this;
			},

			/**
			 * Detach event-handler <code>fnFunction</code> from the 'viewCreated' event of this <code>sap.ui.core.routing.Router</code>.<br/>
			 *
			 * The passed function and listener object must match the ones previously used for event registration.
			 *
			 * @deprecated @since 1.28 use {@link #getViews} instead.
			 * @param {function} fnFunction The function to call, when the event occurs.
			 * @param {object} oListener Object on which the given function had to be called.
			 * @return {sap.ui.core.routing.Router} <code>this</code> to allow method chaining
			 * @public
			 */
			detachViewCreated : function(fnFunction, oListener) {
				this.detachEvent("viewCreated", fnFunction, oListener);
				return this;
			},

			/**
			 * Fire event viewCreated to attached listeners.
			 *
			 * @deprecated @since 1.28 use {@link #getViews} instead.
			 * @param {object} [mArguments] the arguments to pass along with the event.
			 *
			 * @return {sap.ui.core.routing.Router} <code>this</code> to allow method chaining
			 * @protected
			 */
			fireViewCreated : function(mArguments) {
				this.fireEvent("viewCreated", mArguments);
				return this;
			},

			/**
			 * Attach event-handler <code>fnFunction</code> to the 'routePatternMatched' event of this <code>sap.ui.core.routing.Router</code>.<br/>
			 * This event is similar to route matched. But it will only fire for the route that has a matching pattern, not for its parent Routes <br/>
			 *
			 * @param {object} [oData] The object, that should be passed along with the event-object when firing the event.
			 * @param {function} fnFunction The function to call, when the event occurs. This function will be called on the
			 *            oListener-instance (if present) or in a 'static way'.
			 * @param {object} [oListener] Object on which to call the given function. If empty, this Model is used.
			 *
			 * @return {sap.ui.core.routing.Router} <code>this</code> to allow method chaining
			 * @public
			 */
			attachRoutePatternMatched : function(oData, fnFunction, oListener) {
				this.attachEvent("routePatternMatched", oData, fnFunction, oListener);
				return this;
			},

			/**
			 * Detach event-handler <code>fnFunction</code> from the 'routePatternMatched' event of this <code>sap.ui.core.routing.Router</code>.<br/>
			 * This event is similar to route matched. But it will only fire for the route that has a matching pattern, not for its parent Routes <br/>
			 *
			 * The passed function and listener object must match the ones previously used for event registration.
			 *
			 * @param {function} fnFunction The function to call, when the event occurs.
			 * @param {object} oListener Object on which the given function had to be called.
			 * @return {sap.ui.core.routing.Router} <code>this</code> to allow method chaining
			 * @public
			 */
			detachRoutePatternMatched : function(fnFunction, oListener) {
				this.detachEvent("routePatternMatched", fnFunction, oListener);
				return this;
			},

			/**
			 * Fire event routePatternMatched to attached listeners.
			 * This event is similar to route matched. But it will only fire for the route that has a matching pattern, not for its parent Routes <br/>
			 *
			 * @param {object} [mArguments] the arguments to pass along with the event.
			 *
			 * @return {sap.ui.core.routing.Router} <code>this</code> to allow method chaining
			 * @protected
			 */
			fireRoutePatternMatched : function(mArguments) {
				this.fireEvent("routePatternMatched", mArguments);
				return this;
			},

			/**
			 * If no route of the router matches, the bypassed event will be fired.
			 *
			 * @name sap.ui.core.routing.Router#bypassed
			 * @event
			 * @param {sap.ui.base.Event} oEvent have a look at the @link {sap.ui.base.EventProvider} for details about getSource and getParameters
			 * @param {sap.ui.base.EventProvider} oEvent.getSource
			 * @param {object} oEvent.getParameters
			 * @param {string} oEvent.getParameters.hash the hash that did not match any route.
			 */

			/**
			 * Attach event-handler <code>fnFunction</code> to the 'bypassed' event of this <code>sap.ui.core.routing.Router</code>.<br/>
			 * The event will get fired, if none of the routes of the routes is matching. <br/>
			 *
			 * @param {object} [oData] The object, that should be passed along with the event-object when firing the event.
			 * @param {function} fnFunction The function to call, when the event occurs. This function will be called on the
			 *            oListener-instance (if present) or in a 'static way'.
			 * @param {object} [oListener] Object on which to call the given function. If empty, this Model is used.
			 *
			 * @return {sap.ui.core.routing.Router} <code>this</code> to allow method chaining
			 * @public
			 */
			attachBypassed : function(oData, fnFunction, oListener) {
				return this.attachEvent(Router.M_EVENTS.Bypassed, oData, fnFunction, oListener);
			},

			/**
			 * Detach event-handler <code>fnFunction</code> from the 'bypassed' event of this <code>sap.ui.core.routing.Router</code>.<br/>
			 * The event will get fired, if none of the routes of the routes is matching. <br/>
			 *
			 * The passed function and listener object must match the ones previously used for event registration.
			 *
			 * @param {function} fnFunction The function to call, when the event occurs.
			 * @param {object} oListener Object on which the given function had to be called.
			 * @return {sap.ui.core.routing.Router} <code>this</code> to allow method chaining
			 * @public
			 */
			detachBypassed : function(fnFunction, oListener) {
				return this.detachEvent(Router.M_EVENTS.Bypassed, fnFunction, oListener);
			},

			/**
			 * Fire event bypassed to attached listeners.
			 * The event will get fired, if none of the routes of the routes is matching. <br/>
			 *
			 * @param {object} [mArguments] the arguments to pass along with the event.
			 *
			 * @return {sap.ui.core.routing.Router} <code>this</code> to allow method chaining
			 * @protected
			 */
			fireBypassed : function(mArguments) {
				return this.fireEvent(Router.M_EVENTS.Bypassed, mArguments);
			},

			/**
			 * Registers the router to access it from another context. Use sap.ui.routing.Router.getRouter() to receive the instance
			 *
			 * @param {string} sName Name of the router
			 * @public
			 */
			register : function (sName) {
				oRouters[sName] = this;
				return this;
			},

			_onBypassed : function (sHash) {
				if (this._oConfig.bypassed) {
					this._oTargets.display(this._oConfig.bypassed.target, { hash : sHash});
				}

				this.fireBypassed({
					hash: sHash
				});
			},

			metadata : {
				publicMethods: ["initialize", "getURL", "register", "getRoute"]
			}

		});

		Router.M_EVENTS = {
			RouteMatched : "routeMatched",
			RoutePatternMatched : "routePatternMatched",
			ViewCreated : "viewCreated",
			Bypassed: "bypassed"
		};

		/**
		 * Get a registered router
		 *
		 * @param {string} sName Name of the router
		 * @return {sap.ui.core.routing.Router} The router with the specified name, else undefined
		 * @public
		 */
		Router.getRouter = function (sName) {
			return oRouters[sName];
		};

	return Router;

});
