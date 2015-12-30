/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global', 'sap/ui/base/EventProvider'],
	function($, EventProvider) {
		"use strict";

		/**
		 * Provides a convenient way for placing views into the correct containers of your application.<br/>
		 * The main benefit of Targets is lazy loading: you do not have to create the views until you really need them.<br/>
		 * <b>Don't call this constructor directly</b>, use {@link sap.ui.core.routing.Targets} instead, it will create instances of a Target.<br/>
		 * If you are using the mobile library, please use the {@link sap.m.routing.Targets} constructor, please read the documentation there.<br/>
		 *
		 * @class
		 * @param {object} oOptions all of the parameters defined in {@link sap.m.routing.Targets#constructor} are accepted here, except for children you need to specify the parent.
		 * @param {sap.ui.core.routing.Views} oViews All views required by this target will get created by the views instance using {@link sap.ui.core.routing.Views#getView}
		 * @param {sap.ui.core.routing.Target} [oParent] the parent of this target. Will also get displayed, if you display this target. In the config you have the fill the children property {@link sap.m.routing.Targets#constructor}
		 * @public
		 * @since 1.28.1
		 * @extends sap.ui.base.EventProvider
		 * @alias sap.ui.core.routing.Target
		 */
		var oTarget = EventProvider.extend("sap.ui.core.routing.Target", /** @lends sap.ui.core.routing.Target.prototype */ {

			constructor : function(oOptions, oViews) {
				this._oOptions = oOptions;
				this._oViews = oViews;
				EventProvider.apply(this, arguments);
			},

			/**
			 * Destroys the target, will be called by {@link sap.m.routing.Targets} don't call this directly.
			 *
			 * @protected
			 * @returns { sap.ui.core.routing.Target } this for chaining.
			 */
			destroy : function () {
				this._oParent = null;
				this._oOptions = null;
				this._oViews = null;
				EventProvider.prototype.destroy.apply(this, arguments);
				this.bIsDestroyed = true;

				return this;
			},

			/**
			 * Creates a view and puts it in an aggregation of a control that has been defined in the {@link #constructor}.
			 *
			 * @param {*} [vData] an object that will be passed to the display event in the data property. If the target has parents, the data will also be passed to them.
			 * @public
			 */
			display : function (vData) {
				var oParentInfo;

				if (this._oParent) {
					oParentInfo = this._oParent.display(vData);
				}

				return this._place(oParentInfo, vData);
			},

			/**
			 * Will be fired when a target is displayed
			 *
			 * Could be triggered by calling the display function or by the @link sap.ui.core.routing.Router when a target is referenced in a matching route.
			 *
			 * @param {object} oEvent
			 * @param {object} oEvent.getParameters
			 * @param {object} oEvent.getParameters.view The view that got displayed.
			 * @param {object} oEvent.getParameters.control The control that now contains the view in the controlAggregation
			 * @param {object} oEvent.getParameters.config The options object passed to the constructor {@link sap.ui.core.routing.Target#constuctor}
			 * @param {object} oEvent.getParameters.data The data passed into the {@link sap.ui.core.routing.Target#display} function
			 * @event
			 * @public
			 */

			/**
			 * Attach event-handler <code>fnFunction</code> to the 'display' event of this <code>sap.ui.core.routing.Target</code>.<br/>
			 * @param {object} [oData] The object, that should be passed along with the event-object when firing the event.
			 * @param {function} fnFunction The function to call, when the event occurs. This function will be called on the
			 * oListener-instance (if present) or in a 'static way'.
			 * @param {object} [oListener] Object on which to call the given function.
			 *
			 * @return {sap.ui.core.routing.Target} <code>this</code> to allow method chaining
			 * @public
			 */
			attachDisplay : function(oData, fnFunction, oListener) {
				return this.attachEvent(this.M_EVENTS.DISPLAY, oData, fnFunction, oListener);
			},

			/**
			 * Detach event-handler <code>fnFunction</code> from the 'display' event of this <code>sap.ui.core.routing.Target</code>.<br/>
			 *
			 * The passed function and listener object must match the ones previously used for event registration.
			 *
			 * @param {function} fnFunction The function to call, when the event occurs.
			 * @param {object} oListener Object on which the given function had to be called.
			 * @return {sap.ui.core.routing.Target} <code>this</code> to allow method chaining
			 * @public
			 */
			detachDisplay : function(fnFunction, oListener) {
				return this.detachEvent(this.M_EVENTS.DISPLAY, fnFunction, oListener);
			},

			/**
			 * Fire event created to attached listeners.
			 *
			 * @param {object} [mArguments] the arguments to pass along with the event.
			 * @return {sap.ui.core.routing.Target} <code>this</code> to allow method chaining
			 * @protected
			 */
			fireDisplay : function(mArguments) {
				return this.fireEvent(this.M_EVENTS.DISPLAY, mArguments);
			},

			_getEffectiveViewName : function (sViewName) {
				var sViewPath = this._oOptions.viewPath;

				if (sViewPath) {
					sViewName = sViewPath + "." + sViewName;
				}

				return sViewName;
			},

			/**
			 * Here the magic happens - recursion + placement + view creation needs to be refactored
			 *
			 * @param oParentInfo
			 * @param vData
			 * @returns {{oTargetParent: *, oTargetControl: *}|undefined}
			 * @private
			 */
			_place : function (oParentInfo, vData) {
				var oOptions = this._oOptions;
				oParentInfo = oParentInfo || {};

				var oView,
					oControl = oParentInfo.oTargetControl,
					oViewContainingTheControl = oParentInfo.oTargetParent;

				// validate config and log errors if necessary
				if (!this._isValid(oParentInfo, true)) {
					return;
				}

				//no parent view - see if there is a targetParent in the config
				if (!oViewContainingTheControl && oOptions.rootView) {
					oViewContainingTheControl = sap.ui.getCore().byId(oOptions.rootView);

					if (!oViewContainingTheControl) {
						$.sap.log.error("Did not find the root view with the id " + oOptions.rootView, this);
						return;
					}
				}

				// Find the control in the parent
				if (oOptions.controlId) {

					if (oViewContainingTheControl) {
						//controlId was specified - ask the parents view for it
						oControl = oViewContainingTheControl.byId(oOptions.controlId);
					}

					if (!oControl) {
						//Test if control exists in core (without prefix) since it was not found in the parent or root view
						oControl =  sap.ui.getCore().byId(oOptions.controlId);
					}

					if (!oControl) {
						$.sap.log.error("Control with ID " + oOptions.controlId + " could not be found", this);
						return;
					}

				}

				var oAggregationInfo = oControl.getMetadata().getJSONKeys()[oOptions.controlAggregation];

				if (!oAggregationInfo) {
					$.sap.log.error("Control " + oOptions.controlId + " does not has an aggregation called " + oOptions.controlAggregation, this);
					return;
				}

				//Set view for content
				var sViewName = this._getEffectiveViewName(oOptions.viewName);

				var oViewOptions = {
					viewName : sViewName,
					type : oOptions.viewType,
					id : oOptions.viewId
				};

				// Hook in the route for deprecated global view id, it has to be supported to stay compatible
				if (this._bUseRawViewId) {
					oView = this._oViews._getViewWithGlobalId(oViewOptions);
				} else {
					// Target way of getting the view
					oView = this._oViews._getView(oViewOptions);
				}

				if (oOptions.clearControlAggregation === true) {
					oControl[oAggregationInfo._sRemoveAllMutator]();
				}

				$.sap.log.info("Did place the view '" + sViewName + "' with the id '" + oView.getId() + "' into the aggregation '" + oOptions.controlAggregation + "' of a control with the id '" + oControl.getId() + "'", this);
				oControl[oAggregationInfo._sMutator](oView);

				setTimeout(function() {
					this.fireDisplay({
						view : oView,
						control : oControl,
						config : this._oOptions,
						data: vData
					});
				}.bind(this), 0);

				// TODO: all of this needs to be async later
				return {
					oTargetParent : oView,
					oTargetControl : oControl
				};
			},

			/**
			 * Validates the target options, will also be called from the route but route will not log errors
			 *
			 * @param oParentInfo
			 * @param bLog
			 * @returns {boolean}
			 * @private
			 */
			_isValid : function (oParentInfo, bLog) {
				var oOptions = this._oOptions,
					oControl = oParentInfo && oParentInfo.oTargetControl,
					bHasTargetControl = (oControl || oOptions.controlId),
					bIsValid = true,
					sLogMessage = "";

				if (!bHasTargetControl) {
					sLogMessage = "The target " + oOptions.name + " has no controlId set and no parent so the target cannot be displayed.";
					bIsValid = false;
				}

				if (!oOptions.controlAggregation) {
					sLogMessage = "The target " + oOptions.name + " has a control id or a parent but no 'controlAggregation' was set, so the target could not be displayed.";
					bIsValid = false;
				}

				if (!oOptions.viewName) {
					sLogMessage = "The target " + oOptions.name + " no viewName defined.";
					bIsValid = false;
				}

				if (bLog && sLogMessage) {
					$.sap.log.error(sLogMessage, this);
				}

				return bIsValid;
			},

			M_EVENTS : {
				DISPLAY : "display"
			}
		});

		return oTarget;

	});
