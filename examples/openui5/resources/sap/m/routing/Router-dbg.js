/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/core/routing/Router', './TargetHandler', './Targets'],
	function(Router, TargetHandler, Targets) {
		"use strict";

		/**
		 * Instantiates a SAPUI5 mobile Router see {@link sap.ui.core.routing.Router} for the constructor arguments
		 * The difference to the {@link sap.ui.core.routing.Router} are the properties viewLevel, transition and transitionParameters you can specify in every Route or Target created by this router.
		 *
		 * @class
		 * @extends sap.ui.core.routing.Router
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
		 * The alternative way of defining routes is an Object.<br/>
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
		 * { viewType : "XML" }
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
		 * Since the xmlTarget does not specify its viewType, XML is taken from the config object. The jsTarget is specifying it, so the viewType will be JS.<br/>
		 * @param {string|string[]} [oConfig.bypassed.target] One or multiple names of targets that will be displayed, if no route of the router is matched.<br/>
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
		 * If you are using the componentMetadata to define your routes you should skip this parameter.<br/>
		 * @param {object} [oTargetsConfig]
		 * the target configuration, see {@link sap.m.routing.Targets#constructor} documentation (the options object).<br/>
		 * You should use Targets to create and display views. The route should only contain routing relevant properties.<br/>
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
		 * @since 1.28.1
		 * @alias sap.m.routing.Router
		 */
		var MobileRouter = Router.extend("sap.m.routing.Router", /** @lends sap.m.routing.Router.prototype */ {

			constructor : function() {
				this._oTargetHandler = new TargetHandler();
				Router.prototype.constructor.apply(this, arguments);
			},

			destroy: function () {
				Router.prototype.destroy.apply(this, arguments);

				this._oTargetHandler.destroy();

				this._oTargetHandler = null;
			},

			/**
			 * Returns the TargetHandler instance.
			 *
			 * @return {sap.m.routing.TargetHandler} the TargetHandler instance
			 * @public
			 */
			getTargetHandler : function () {
				return this._oTargetHandler;
			},

			_createTargets : function (oConfig, oTargetsConfig) {
				return new Targets({
					views: this._oViews,
					config: oConfig,
					targets: oTargetsConfig,
					targetHandler: this._oTargetHandler
				});
			},

			fireRouteMatched : function (mArguments) {
				var oRoute = this.getRoute(mArguments.name),
					oTargetConfig;

				// only if a route has a private target and does not use the targets instance of the router we need to inform the targethandler
				if (oRoute._oTarget) {

					oTargetConfig = oRoute._oTarget._oOptions;

					this._oTargetHandler.addNavigation({
						navigationIdentifier : mArguments.name,
						transition: oTargetConfig.transition,
						transitionParameters: oTargetConfig.transitionParameters,
						eventData: mArguments.arguments,
						targetControl: mArguments.targetControl,
						view: mArguments.view,
						preservePageInSplitContainer: oTargetConfig.preservePageInSplitContainer
					});

				}

				return Router.prototype.fireRouteMatched.apply(this, arguments);
			},

			fireRoutePatternMatched : function (mArguments) {
				var sRouteName = mArguments.name,
					iViewLevel;

				if (this._oTargets && this._oTargets._oLastDisplayedTarget) {
					iViewLevel = this._oTargets._oLastDisplayedTarget._oOptions.viewLevel;
				}

				this._oTargetHandler.navigate({
					navigationIdentifier: sRouteName,
					viewLevel: iViewLevel,
					askHistory: true
				});


				return Router.prototype.fireRoutePatternMatched.apply(this, arguments);
			}

		});

		return MobileRouter;

	}, /* bExport= */ true);
