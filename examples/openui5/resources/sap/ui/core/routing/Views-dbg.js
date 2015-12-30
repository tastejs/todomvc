/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global', 'sap/ui/base/EventProvider', 'sap/ui/core/UIComponent', 'sap/ui/core/mvc/View'],
	function($, EventProvider, UIComponent, View) {
		"use strict";

		/**
		 * Instantiates a view repository that creates and caches views. If it is destroyed, all the Views it created are destroyed.
		 * Usually you do not have to create instances of this class, it is used by the {@link sap.ui.core.routing.Router}.
		 * If you are using {@link sap.ui.core.routing.Targets} without using a {@link sap.ui.core.UIComponent} you have to create an instance of this class.
		 * They will create an instance on their own, or if they are used with a {@link sap.ui.core.UIComponent} they will share the same instance of Views.
		 *
		 * @class
		 * @extends sap.ui.base.EventProvider
		 * @public
		 * @since 1.28.1
		 * @param {object} oOptions
		 * @param {sap.ui.core.UIComponent} [oOptions.component] the owner of all the views that will be created by this Instance.
		 * @alias sap.ui.core.routing.Views
		 */
		var Views = EventProvider.extend("sap.ui.core.routing.Views", /** @lends sap.ui.core.routing.Views.prototype */ {

			constructor : function (oOptions) {
				if (!oOptions) {
					oOptions = {};
				}

				this._oViews = {};

				this._oComponent = oOptions.component;
				if (this._oComponent) {
					$.sap.assert(this._oComponent instanceof UIComponent, this + ' - the component passed to the constructor needs to be an instance of UIComponent');
				}

				EventProvider.apply(this, arguments);
			},

			metadata : {
				publicMethods: ["getView", "setView"]
			},

			/**
			 * Returns a cached view, for a given name. If it does not exist yet, it will create the view with the provided options.
			 * If you provide a viewId, it will be prefixed with the viewId of the component.
			 *
			 * @param {object} oOptions see {@link sap.ui.view} for the documentation.
			 * The viewId you pass into the options will be prefixed with the id of the component you pass into the constructor.
			 * So you can retrieve the view later by calling the {@link sap.ui.core.UIComponent#byId} function of the UIComponent.
			 *
			 * @param {string} oOptions.viewName If you do not use setView please see {@link sap.ui.view} for the documentation. This is used as a key in the cache of the Views instance. If you want to retrieve a view that has been given an alternative name in {@link #setView} you need to provide the same name here and you can skip all the other viewOptions.
			 * @return {Window.Promise} A promise that is resolved when the view is loaded. The view instance will be passed to the promise.
			 */
			getView : function (oOptions) {
				return new Promise(function (fnSuccess) {
					fnSuccess(this._getView(oOptions));
				}.bind(this));
			},

			/**
			 * Adds or overwrites a view in the cache of the Views instance. The viewName serves as a key for caching.
			 *
			 * @param {string} sViewName Name of the view, may differ from the actual viewName of the oView parameter provided, since you can retrieve this view per {@link getView}.
			 * @param {sap.ui.core.mvc.View} oView the view instance
			 * @returns {sap.ui.core.routing.Views} this for chaining.
			 */
			setView : function (sViewName, oView) {
				this._checkViewName(sViewName);

				this._oViews[sViewName] = oView;
				return this;
			},

			/**
			 * Destroys all the views created by this instance.
			 *
			 * @returns {sap.ui.core.routing.Views} this for chaining.
			 */
			destroy : function () {
				var sProperty;

				EventProvider.prototype.destroy.apply(this);

				for (sProperty in this._oViews) {
					if (this._oViews.hasOwnProperty(sProperty)) {
						this._oViews[sProperty].destroy();
					}
				}

				this._oViews = undefined;
				this.bIsDestroyed = true;

				return this;
			},

			/**
			 * If a view is created the event will be fired.
			 * It will not be fired, if a view was read from the cache of the Views object.
			 *
			 * @name sap.ui.core.routing.Views#created
			 * @event
			 * @param {sap.ui.base.Event} oEvent have a look at the @link {sap.ui.base.EventProvider} for details about getSource and getParameters
			 * @param {sap.ui.base.EventProvider} oEvent.getSource
			 * @param {object} oEvent.getParameters
			 * @param {sap.ui.core.mvc.View} oEvent.getParameters.view the instance of the created view.
			 * @param {object} oEvent.getParameters.viewOptions The view options passed to {@link sap.ui.view}
			 */

			/**
			 * Attach event-handler <code>fnFunction</code> to the 'created' event of this <code>sap.ui.core.routing.Views</code>.<br/>
			 * @param {object} [oData] The object, that should be passed along with the event-object when firing the event.
			 * @param {function} fnFunction The function to call, when the event occurs. This function will be called on the
			 * oListener-instance (if present) or in a 'static way'.
			 * @param {object} [oListener] Object on which to call the given function.
			 *
			 * @return {sap.ui.core.routing.Views} <code>this</code> to allow method chaining
			 * @public
			 */
			attachCreated : function(oData, fnFunction, oListener) {
				return this.attachEvent("created", oData, fnFunction, oListener);
			},

			/**
			 * Detach event-handler <code>fnFunction</code> from the 'created' event of this <code>sap.ui.core.routing.Views</code>.<br/>
			 *
			 * The passed function and listener object must match the ones previously used for event registration.
			 *
			 * @param {function} fnFunction The function to call, when the event occurs.
			 * @param {object} oListener Object on which the given function had to be called.
			 * @return {sap.ui.core.routing.Views} <code>this</code> to allow method chaining
			 * @public
			 */
			detachCreated : function(fnFunction, oListener) {
				return this.detachEvent("created", fnFunction, oListener);
			},

			/**
			 * Fire event created to attached listeners.
			 *
			 * @param {object} [mArguments] the arguments to pass along with the event.
			 * @return {sap.ui.core.routing.Views} <code>this</code> to allow method chaining
			 * @protected
			 */
			fireCreated : function(mArguments) {
				return this.fireEvent("created", mArguments);
			},

			/*
			 * Privates
			 */

			/**
			 * Hook for retrieving views synchronous way since Targets and router are not doing this yet
			 * @param oOptions
			 * @returns {*}
			 * @private
			 */
			_getView: function (oOptions) {
				if (this._oComponent && oOptions.id) {
					oOptions = $.extend({}, oOptions, { id : this._oComponent.createId(oOptions.id) });
				}

				return this._getViewWithGlobalId(oOptions);
			},

			/**
			 * hook for the deprecated property viewId on the route, will not prefix the id with the component
			 *
			 * @returns {*}
			 * @private
			 */
			_getViewWithGlobalId : function (oOptions) {
				function fnCreateView() {
					return sap.ui.view(oOptions);
				}

				if (!oOptions) {
					$.sap.log.error("the oOptions parameter of getView is mandatory", this);
				}

				var oView,
					sViewName = oOptions.viewName;

				this._checkViewName(sViewName);
				oView = this._oViews[sViewName];

				if (oView) {
					return oView;
				}

				if (this._oComponent) {
					oView = this._oComponent.runAsOwner(fnCreateView);
				} else {
					oView = fnCreateView();
				}

				this._oViews[sViewName] = oView;

				this.fireCreated({
					view: oView,
					viewOptions: oOptions
				});

				return oView;
			},

			/**
			 * @param {string} sViewName logs an error if it is empty or undefined
			 * @private
			 */
			_checkViewName : function (sViewName) {

				if (!sViewName) {
					$.sap.log.error("A name for the view has to be defined", this);
				}

			}
		});

		return Views;

	});
