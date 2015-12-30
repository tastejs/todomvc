/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global', 'sap/ui/base/EventProvider', './Target'],
	function($, EventProvider, Target) {
		"use strict";

		/**
		 * Provides a convenient way for placing views into the correct containers of your application.
		 * The main benefit of Targets is lazy loading: you do not have to create the views until you really need them.
		 * If you are using the mobile library, please use {@link sap.m.routing.Targets} instead of this class.
		 *
		 * @class
		 * @extends sap.ui.base.EventProvider
		 * @param {object} oOptions
		 * @param {sap.ui.core.routing.Views} oOptions.views the views instance will create the views of all the targets defined, so if 2 targets have the same viewName, the same instance of the view will be displayed.
		 * @param {object} [oOptions.config] this config allows all the values oOptions.targets.anyName allows, these will be the default values for properties used in the target.<br/>
		 * For example if you are only using xmlViews in your app you can specify viewType="XML" so you don't have to repeat this in every target.<br/>
		 * If a target specifies viewType="JS", the JS will be stronger than the XML here is an example.
		 *
		 * <pre>
		 * <code>
		 * {
		 *     config: {
		 *         viewType : "XML"
		 *     }
		 *     targets : {
		 *         xmlTarget : {
		 *             ...
		 *         },
		 *         jsTarget : {
		 *             viewType : "JS"
		 *             ...
		 *         }
		 *     }
		 * }
		 * </code>
		 * </pre>
		 * Then the effective config that will be used looks like this:
		 * <pre>
		 * <code>
		 * {
		 *     xmlTarget : {
		 *         // coming from the defaults
		 *         viewType : "XML"
		 *         ...
		 *     },
		 *     jsTarget : {
		 *        // XML is overwritten by the "JS" of the targets property
		 *        viewType : "JS"
		 *       ...
		 *     }
		 * }
		 * </code>
		 * </pre>
		 *
		 * @param {string} [oOptions.config.rootView]
		 * The id of the rootView - This should be the id of the view that contains the control with the controlId
		 * since the control will be retrieved by calling the {@link sap.ui.core.mvc.View#byId} function of the rootView.
		 * If you are using a component and add the routing.targets <b>do not set this parameter</b>,
		 * since the component will set the rootView to the view created by the {@link sap.ui.core.UIComponent.html#createContent} function.
		 * If you specify the "parent" property of a target, the control will not be searched in the root view but in the view Created by the parent (see parent documentation).
		 *
		 * @param {object} oOptions.targets One or multiple targets in a map.
		 * @param {object} oOptions.targets.anyName a new target, the key severs as a name. An example:
		 * <pre>
		 * <code>
		 * {
		 *     targets: {
		 *         welcome: {
		 *             viewName: "Welcome",
		 *             viewType: "XML",
		 *             ....
		 *             // Other target parameters
		 *         },
		 *         goodbye: {
		 *             viewName: "Bye",
		 *             viewType: "JS",
		 *             ....
		 *             // Other target parameters
		 *         }
		 *     }
		 * }
		 * </code>
		 * </pre>
		 *
		 * This will create two targets named 'welcome' and 'goodbye' you can display both of them or one of them using the {@link #display} function.
		 *
		 * @param {string} oOptions.targets.anyName.viewName The name of a view that will be created.
		 * To place the view into a Control use the controlAggregation and controlId. Views will only be created once per viewName.
		 * <pre>
		 * <code>
		 * {
		 *     targets: {
		 *         // If display("masterWelcome") is called, the master view will be placed in the 'MasterPages' of a control with the id splitContainter
		 *         masterWelcome: {
		 *             viewName: "Welcome",
		 *             controlId: "splitContainer",
		 *             controlAggregation: "masterPages"
		 *         },
		 *         // If display("detailWelcome") is called after the masterWelcome, the view will be removed from the master pages and added to the detail pages, since the same instance is used. Also the controls inside of the view will have the same state.
		 *         detailWelcome: {
		 *             // same view here, that's why the same instance is used
		 *             viewName: "Welcome",
		 *             controlId: "splitContainer",
		 *             controlAggregation: "detailPages"
		 *         }
		 *     }
		 * }
		 * </code>
		 * </pre>
		 *
		 * If you want to have a second instance of the welcome view you can use the following:
		 *
		 *
		 *
		 * <pre>
		 * <code>
		 * // Some code you execute before you display the taget named 'detailWelcome':
		 * var oView = sap.ui.view(({ viewName : "Welcome", type : sap.ui.core.mvc.ViewType.XML});
		 * oTargets.getViews().setView("WelcomeWithAlias", oView)
		 *
		 * {
		 *     targets: {
		 *         // If display("masterWelcome") is called, the master viewName will be placed in the 'MasterPages' of a control with the id splitContainter
		 *         masterWelcome: {
		 *             viewName: "Welcome",
		 *             controlId: "splitContainer",
		 *             controlAggregation: "masterPages"
		 *         },
		 *         // If display("detailWelcome") is called after the masterWelcome, a second instance with an own controller instance will be added in the detail pages.
		 *         detailWelcome: {
		 *             // same viewName here, that's why the same instance is used
		 *             viewName: "WelcomeWithAlias",
		 *             controlId: "splitContainer",
		 *             controlAggregation: "detailPages"
		 *         }
		 *     }
		 * }
		 * </code>
		 * </pre>
		 *
		 *
		 * @param {string} [oOptions.targets.anyName.viewType]
		 * The type of the view that is going to be created. These are the supported types: {@link sap.ui.core.mvc.ViewType}.
		 * You always have to provide a viewType except if you are using {@link sap.ui.core.routing.Views#setView}.
		 * @param {string} [oOptions.targets.anyName.viewPath]
		 * A prefix that will be prepended in front of the viewName.<br/>
		 * <b>Example:</b> viewName is set to "myView" and viewPath is set to "myApp" - the created viewName will be "myApp.myView".
		 * @param {string} [oOptions.targets.anyName.viewId] The id of the created view.
		 * This is will be prefixed with the id of the component set to the views instance provided in oOptions.views. For details see {@link sap.ui.core.routing.Views#getView}.
		 * @param {string} [oOptions.targets.anyName.targetParent]
		 * The id of the parent of the controlId - This should be the id of the view that contains your controlId,
		 * since the target control will be retrieved by calling the {@link sap.ui.core.mvc.View#byId} function of the targetParent. By default,
		 * this will be the view created by a component, so you do not have to provide this parameter.
		 * If you are using children, the view created by the parent of the child is taken.
		 * You only need to specify this, if you are not using a Targets instance created by a component
		 * and you should give the id of root view of your application to this property.
		 * @param {string} [oOptions.targets.anyName.controlId] The id of the control where you want to place the view created by this target.
		 * The view of the target will be put into this container Control, using the controlAggregation property. You have to specify both properties or the target will not be able to place itself.
		 * An example for containers are {@link sap.ui.ux3.Shell} with the aggregation 'content' or a {@link sap.m.NavContainer} with the aggregation 'pages'.
		 *
		 * @param {string} [oOptions.targets.anyName.controlAggregation] The name of an aggregation of the controlId, that contains views.
		 * Eg: a {@link sap.m.NavContainer} has an aggregation 'pages', another Example is the {@link sap.ui.ux3.Shell} it has 'content'.
		 * @param {boolean} [oOptions.targets.anyName.clearAggregation] Defines a boolean that can be passed to specify if the aggregation should be cleared
		 * - all items will be removed - before adding the View to it.
		 * When using a {@link sap.ui.ux3.Shell} this should be true. For a {@link sap.m.NavContainer} it should be false. When you use the {@link sap.m.routing.Router} the default will be false.
		 * @param {string} [oOptions.targets.parent] A reference to another target, using the name of the target.
		 * If you display a target that has a parent, the parent will also be displayed.
		 * Also the control you specify with the controlId parameter, will be searched inside of the view of the parent not in the rootView, provided in the config.
		 * The control will be searched using the byId function of a view. When it is not found, the global id is checked.
		 * <br/>
		 * The main usecase for the parent property is placing a view inside a smaller container of a view, which is also created by targets.
		 * This is useful for lazy loading views, only if the user really navigates to this part of your application.
		 * <br/>
		 * <b>Example:</b>
		 * Our aim is to lazy load a tab of an IconTabBar (a control that displays a view initially and when a user clicks on it the view changes).
		 * It's a perfect candidate to lazy load something inside of it.
		 * <br/>
		 * <b>Example app structure:</b><br/>
		 * We have a rootView that is returned by the createContent function of our UIComponent. This view contains a sap.m.App control with the id 'myApp'
		 * <pre>
		 * <code>
		 * &lt;View xmlns="sap.m"&gt;
		 *     &lt;App id="myApp"/&gt;
		 * &lt;/View&gt;
		 * </code>
		 * </pre>
		 * an xml view called 'Detail'
		 * <pre>
		 * <code>
		 * &lt;View xmlns="sap.m"&gt;
		 *     &lt;IconTabBar&gt;
		 *         &lt;items&gt;
		 *             &lt;IconTabFilter&gt;
		 *                 &lt;!-- content of our first tab --&gt;
		 *             &lt;IconTabFilter&gt;
		 *             &lt;IconTabFilter id="mySecondTab"&gt;
		 *                 &lt;!-- nothing here, since we will lazy load this one with a target --&gt;
		 *             &lt;IconTabFilter&gt;
		 *         &lt;/items&gt;
		 *     &lt;/IconTabBar&gt;
		 * &lt;/View&gt;
		 * </code>
		 * </pre>
		 * and a view called 'SecondTabContent', this one contains our content we want to have lazy loaded.
		 * Now we need to create our Targets instance with a config matching our app:
		 * <pre>
		 * <code>
		 *     new Targets({
		 *         //Creates our views except for root, we created this one before - when using a component you
		 *         views: new Views(),
		 *         config: {
		 *             // all of our views have that type
		 *             viewType: 'XML',
		 *             // a reference to the app control in the rootView created by our UIComponent
		 *             controlId: 'myApp',
		 *             // An app has a pages aggregation where the views need to be put into
		 *             controlAggregation: 'pages'
		 *         },
		 *         targets: {
		 *             detail: {
		 *                 viewName: 'Detail'
		 *             },
		 *             secondTabContent: {
		 *                 // A reference to the detail target defined above
		 *                 parent: 'detail',
		 *                 // A reference to the second Tab container in the Detail view. Here the target does not look in the rootView, it looks in the Parent view (Detail).
		 *                 controlId: 'mySecondTab',
		 *                 // An IconTabFilter has an aggregation called content so we need to overwrite the pages set in the config as default.
		 *                 controlAggregation: 'content',
		 *                 // A view containing the content
		 *                 viewName: 'SecondTabContent'
		 *             }
		 *         }
		 *     });
		 * </code>
		 * </pre>
		 *
		 * Now if we call <code> oTargets.display("secondTabContent") </code>, 2 views will be created: Detail and SecondTabContent.
		 * The 'Detail' view will be put into the pages aggregation of the App. And afterwards the 'SecondTabContent' view will be put into the content Aggregation of the second IconTabFilter.
		 * So a parent will always be created before the target referencing it.
		 *
		 * @since 1.28.1
		 * @public
		 * @alias sap.ui.core.routing.Targets
		 */
		var Targets = EventProvider.extend("sap.ui.core.routing.Targets", /** @lends sap.ui.core.routing.Targets.prototype */ {

			constructor : function(oOptions) {
				var sTargetOptions,
					sTargetName;

				EventProvider.apply(this);
				this._mTargets = {};
				this._oConfig = oOptions.config;
				this._oViews = oOptions.views;

				for (sTargetOptions in oOptions.targets) {
					if (oOptions.targets.hasOwnProperty(sTargetOptions)) {
						this._createTarget(sTargetOptions, oOptions.targets[sTargetOptions]);
					}
				}

				for (sTargetName in this._mTargets) {
					if (this._mTargets.hasOwnProperty(sTargetName)) {
						this._addParentTo(this._mTargets[sTargetName]);
					}
				}

			},

			/**
			 * Destroys the targets instance an all created targets. Does not destroy the views instance passed to the constructor. It has to be destroyed separately.
			 * @public
			 * @returns { sap.ui.core.routing.Targets } this for chaining.
			 */
			destroy : function () {
				var sTargetName;
				EventProvider.prototype.destroy.apply(this);

				for (sTargetName in this._mTargets) {
					if (this._mTargets.hasOwnProperty(sTargetName)) {
						this._mTargets[sTargetName].destroy();
					}
				}

				this._mTargets = null;
				this._oViews = null;
				this._oConfig = null;
				this.bIsDestroyed = true;

				return this;
			},

			/**
			 * Creates a view and puts it in an aggregation of the specified control.
			 *
			 * @param {string|string[]} vTargets the key of the target as specified in the {@link #constructor}. To display multiple targets you may also pass an array of keys.
			 * @param {any} [vData] an object that will be passed to the display event in the data property. If the target has parents, the data will also be passed to them.
			 * @public
			 * @returns {sap.ui.core.routing.Targets} this pointer for chaining
			 */
			display : function (vTargets, vData) {
				this._display(vTargets, vData);
			},

			/**
			 * Returns the views instance passed to the constructor
			 *
			 * @return {sap.ui.core.routing.Views} the views instance
			 */
			getViews : function () {
				return this._oViews;
			},

			/**
			 * Returns a target by its name (if you pass myTarget: { view: "myView" }) in the config myTarget is the name.
			 *
			 * @param {string|string[]} vName the name of a single target or the name of multiple targets
			 * @return {sap.ui.core.routing.Target|undefined|sap.ui.core.routing.Target[]} The target with the coresponding name or undefined. If an array way passed as name this will return an array with all found targets. Non existing targets will not be returned but will log an error.
			 */
			getTarget : function (vName) {
				var that = this,
					aResult = [];

				if ($.isArray(vName)) {
					$.each(vName, function (i, sName) {
						var oTarget = that._mTargets[sName];

						if (oTarget) {
							aResult.push(oTarget);
						} else {
							$.sap.log.error("The target you tried to get \"" + sName + "\" does not exist!", that);
						}
					});
					return aResult;
				}

				return this._mTargets[vName];
			},

			/**
			 * Will be fired when a target is displayed
			 *
			 * Could be triggered by calling the display function or by the {@link sap.ui.core.routing.Router} when a target is referenced in a matching route.
			 *
			 * @param {object} oEvent
			 * @param {object} oEvent.getParameters
			 * @param {object} oEvent.getParameters.view The view that got displayed.
			 * @param {object} oEvent.getParameters.control The control that now contains the view in the controlAggregation
			 * @param {object} oEvent.getParameters.config The options object passed to the constructor {@link sap.ui.core.routing.Targets#constuctor}
			 * @param {object} oEvent.getParameters.name The name of the target firing the event
			 * @param {object} oEvent.getParameters.data The data passed into the {@link sap.ui.core.routing.Targets#display} function
			 * @event
			 * @public
			 */

			/**
			 * Attach event-handler <code>fnFunction</code> to the 'display' event of this <code>sap.ui.core.routing.Targets</code>.<br/>
			 * @param {object} [oData] The object, that should be passed along with the event-object when firing the event.
			 * @param {function} fnFunction The function to call, when the event occurs. This function will be called on the
			 * oListener-instance (if present) or in a 'static way'.
			 * @param {object} [oListener] Object on which to call the given function.
			 *
			 * @return {sap.ui.core.routing.Targets} <code>this</code> to allow method chaining
			 * @public
			 */
			attachDisplay : function(oData, fnFunction, oListener) {
				return this.attachEvent(this.M_EVENTS.DISPLAY, oData, fnFunction, oListener);
			},

			/**
			 * Detach event-handler <code>fnFunction</code> from the 'display' event of this <code>sap.ui.core.routing.Targets</code>.<br/>
			 *
			 * The passed function and listener object must match the ones previously used for event registration.
			 *
			 * @param {function} fnFunction The function to call, when the event occurs.
			 * @param {object} oListener Object on which the given function had to be called.
			 * @return {sap.ui.core.routing.Targets} <code>this</code> to allow method chaining
			 */
			detachDisplay : function(fnFunction, oListener) {
				return this.detachEvent(this.M_EVENTS.DISPLAY, fnFunction, oListener);
			},

			/**
			 * Fire event created to attached listeners.
			 *
			 * @param {object} [mArguments] the arguments to pass along with the event.
			 * @return {sap.ui.core.routing.Targets} <code>this</code> to allow method chaining
			 */
			fireDisplay : function(mArguments) {
				return this.fireEvent(this.M_EVENTS.DISPLAY, mArguments);
			},

			M_EVENTS : {
				DISPLAY : "display"
			},

			/**
			 * created all targets
			 *
			 * @param {string} sName
			 * @param {object} oTargetOptions
			 * @private
			 */
			_createTarget : function (sName, oTargetOptions) {
				var oTarget,
					oOptions;

				oOptions = $.extend(true, { name: sName }, this._oConfig, oTargetOptions);
				oTarget = this._constructTarget(oOptions);
				oTarget.attachDisplay(function (oEvent) {
					var oParameters = oEvent.getParameters();

					this.fireDisplay({
						name : sName,
						view : oParameters.view,
						control : oParameters.control,
						config : oParameters.config,
						data: oParameters.data
					});
				}, this);
				this._mTargets[sName] = oTarget;
			},

			/**
			 * @param oTarget
			 * @private
			 */
			_addParentTo : function (oTarget) {
				var oParentTarget,
					sParent = oTarget._oOptions.parent;

				if (!sParent) {
					return;
				}

				oParentTarget = this._mTargets[sParent];

				if (!oParentTarget) {
					$.sap.log.error("The target '" + oTarget._oOptions.name + " has a parent '" + sParent + "' defined, but it was not found in the other targets", this);
					return;
				}

				oTarget._oParent = oParentTarget;
			},

			/**
			 * Hook for the mobile library
			 * @private
 			 */
			_constructTarget : function (oOptions, oParent) {
				return new Target(oOptions, this._oViews, oParent);
			},

			/**
			 * hook to distinguish between the router and an application calling this
			 * @private
			 */
			_display : function (vTargets, vData) {
				var that = this;

				if ($.isArray(vTargets)) {
					$.each(vTargets, function (i, sTarget) {
						that._displaySingleTarget(sTarget, vData);
					});
				} else {
					this._displaySingleTarget(vTargets, vData);
				}

				return this;
			},

			/**
			 *
			 * @param sName name of the single target
			 * @param vData event data
			 * @private
			 */
			_displaySingleTarget : function (sName, vData) {
				var oTarget = this.getTarget(sName);

				if (oTarget !== undefined) {
					oTarget.display(vData);
				} else {
					$.sap.log.error("The target with the name \"" + sName + "\" does not exist!", this);
				}
			},

			/**
			 * Called by the UIComponent since the rootView id is not known in the constructor
			 *
			 * @param sId
			 * @private
			 */
			_setRootViewId: function (sId) {
				var sTargetName,
					oTargetOptions;

				for (sTargetName in this._mTargets) {
					if (this._mTargets.hasOwnProperty(sTargetName)) {
						oTargetOptions = this._mTargets[sTargetName]._oOptions;
						if (oTargetOptions.rootView === undefined) {
							oTargetOptions.rootView = sId;
						}
					}
				}
			}

		});

		return Targets;

	});
