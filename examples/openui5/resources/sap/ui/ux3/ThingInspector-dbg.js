/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.ux3.ThingInspector.
sap.ui.define(['jquery.sap.global', './ActionBar', './Overlay', './ThingViewer', './library'],
	function(jQuery, ActionBar, Overlay, ThingViewer) {
	"use strict";



	/**
	 * Constructor for a new ThingInspector.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * Thing Inspector
	 * @extends sap.ui.ux3.Overlay
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @alias sap.ui.ux3.ThingInspector
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var ThingInspector = Overlay.extend("sap.ui.ux3.ThingInspector", /** @lends sap.ui.ux3.ThingInspector.prototype */ { metadata : {

		library : "sap.ui.ux3",
		properties : {

			/**
			 * First Line of the Thing Inspector Title
			 */
			firstTitle : {type : "string", group : "Misc", defaultValue : null},

			/**
			 * Thing type
			 */
			type : {type : "string", group : "Misc", defaultValue : null},

			/**
			 * Thing Icon Url
			 */
			icon : {type : "sap.ui.core.URI", group : "Misc", defaultValue : null},

			/**
			 * Second Line of the Thing Inspector Title
			 */
			secondTitle : {type : "string", group : "Misc", defaultValue : null},

			/**
			 * Follow State of a Thing
			 */
			followState : {type : "sap.ui.ux3.FollowActionState", group : "Misc", defaultValue : sap.ui.ux3.FollowActionState.Default},

			/**
			 * State of Flag Action
			 */
			flagState : {type : "boolean", group : "Misc", defaultValue : false},

			/**
			 * State Of favorite Action
			 */
			favoriteState : {type : "boolean", group : "Misc", defaultValue : false},

			/**
			 * Favorite action enabled/disabled. If disabled the action will be invisible.
			 */
			favoriteActionEnabled : {type : "boolean", group : "Misc", defaultValue : true},

			/**
			 * Update action enabled/disabled. If disabled the action will be invisible.
			 */
			updateActionEnabled : {type : "boolean", group : "Misc", defaultValue : true},

			/**
			 * Follow action enabled/disabled. If disabled the action will be invisible.
			 */
			followActionEnabled : {type : "boolean", group : "Misc", defaultValue : true},

			/**
			 * Flag action enabled/disabled. If disabled the action will be invisible.
			 */
			flagActionEnabled : {type : "boolean", group : "Misc", defaultValue : true},

			/**
			 * Defines which header type should be used.
			 * @since 1.16.3
			 */
			headerType : {type : "sap.ui.ux3.ThingViewerHeaderType", group : "Misc", defaultValue : sap.ui.ux3.ThingViewerHeaderType.Standard}
		},
		aggregations : {

			/**
			 * Actions of a Thing
			 */
			actions : {type : "sap.ui.ux3.ThingAction", multiple : true, singularName : "action"},

			/**
			 * ThingGroups for the header content
			 */
			headerContent : {type : "sap.ui.ux3.ThingGroup", multiple : true, singularName : "headerContent"},

			/**
			 * Thing Inspector facets
			 */
			facets : {type : "sap.ui.ux3.NavigationItem", multiple : true, singularName : "facet"},

			/**
			 * ThingGroups for content of the selected facet
			 */
			facetContent : {type : "sap.ui.ux3.ThingGroup", multiple : true, singularName : "facetContent"},

			/**
			 * ActionBar. If no actionBar is set a default ActionBar will be created.
			 */
			actionBar : {type : "sap.ui.ux3.ActionBar", multiple : false},

			/**
			 * The ThingViewer managed by this ThingInspector
			 */
			thingViewer : {type : "sap.ui.ux3.ThingViewer", multiple : false, visibility : "hidden"}
		},
		associations : {

			/**
			 * The Facet that is currently selected.
			 */
			selectedFacet : {type : "sap.ui.ux3.NavigationItem", multiple : false}
		},
		events : {

			/**
			 * Further thing related Action selected
			 */
			actionSelected : {
				parameters : {

					/**
					 * Id of selected ThingAction
					 */
					id : {type : "string"},

					/**
					 * Selected ThingAction
					 */
					action : {type : "sap.ui.ux3.ThingAction"}
				}
			},

			/**
			 * Event for facet selection. The application is responsible for displaying the correct content for the selected one. The ThingInspector will currently always mark the first facet as selected.
			 */
			facetSelected : {allowPreventDefault : true,
				parameters : {

					/**
					 * Id of selected NavigationItem
					 */
					id : {type : "string"},

					/**
					 * The selected NavigationItem
					 */
					item : {type : "sap.ui.ux3.NavigationItem"},

					/**
					 * Key of selected NavigationItem
					 */
					key : {type : "string"}
				}
			},

			/**
			 * Fired when a new feed entry is submitted.
			 */
			feedSubmit : {
				parameters : {

					/**
					 * Feed text
					 */
					text : {type : "string"}
				}
			}
		}
	}});


	(function() {
		/**
		 * Initialization hook for the Thinginspector. It creates the instance of the
		 * Popup helper service and does some basic configuration for it.
		 *
		 * @private
		 */
		ThingInspector.prototype.init = function() {
			var oActionBar, that = this;
			Overlay.prototype.init.apply(this);
			this._oThingViewer = new ThingViewer(this.getId() + "-thingViewer");
			this.setAggregation("thingViewer",this._oThingViewer);
			this._oThingViewer.attachFacetSelected(function(oEvent) {
				var item = oEvent.getParameters().item;
				if (that.fireFacetSelected({id:item.getId(), key:item.getKey(),item:item})) {
					that.setSelectedFacet(item);
				} else {
					 oEvent.preventDefault();
				}
			});
			this._oSocialActions = {};
			if (this.getActionBar() == null) {
				oActionBar = new ActionBar(this.getId() + "-actionBar");
				oActionBar.setShowOpen(false);
				oActionBar.setAlwaysShowMoreMenu(false);
				oActionBar.setDividerWidth("252px");
				oActionBar.attachActionSelected(function (oEvent) {
					var sActionID = oEvent.getParameters().id,
						oBarAction = oEvent.getParameters().action,
						oThingAction;

					if (sActionID.indexOf(sap.ui.ux3.ActionBarSocialActions.Favorite) !== -1 ||
						sActionID.indexOf(sap.ui.ux3.ActionBarSocialActions.Follow) !== -1 ||
						sActionID.indexOf(sap.ui.ux3.ActionBarSocialActions.Flag) !== -1) {
						if (that._oSocialActions[sActionID]) {
							oThingAction = that._oSocialActions[sActionID];
						} else {
							oThingAction =  new sap.ui.ux3.ThingAction({
								id: that.getId() + "-" + sActionID.toLowerCase(),
								text: oBarAction.text,
								enabled: oBarAction.enabled
							});
							that._oSocialActions[sActionID] = oThingAction;
						}
						that.fireActionSelected({
							id : sActionID.toLowerCase(),
							action : oThingAction
						});
					} else {
						that.fireActionSelected({
							id : oEvent.getParameters().id,
							action : oEvent.getParameters().action
						});
					}
				});
				oActionBar.attachFeedSubmit(function (oEvent) {
					that.fireFeedSubmit({
						text : oEvent.getParameters().text
					});
				});
				this.setActionBar(oActionBar);
			}
		};

		/*
		 * Set size of TI after rendering: If running in Shell we sync with shell
		 * canvas. The size will then be set by the shell.
		 */
		ThingInspector.prototype.onAfterRendering = function() {
			Overlay.prototype.onAfterRendering.apply(this,arguments);
			var oShell = this._getShell();
			this._bShell = !!oShell;
			if (!oShell) {
				this._applyChanges({showOverlay:false});
			}
		};

		ThingInspector.prototype.onBeforeRendering = function() {
			Overlay.prototype.onBeforeRendering.apply(this,arguments);
		};

		/**
		 * Destroys this instance of ThingInspector, called by Element#destroy()
		 *
		 * @private
		 */
		ThingInspector.prototype.exit = function() {
			this._oThingViewer.exit(arguments);
			this._oThingViewer.destroy();
			this._oThingViewer = null;
			Overlay.prototype.exit.apply(this,arguments);
		};

		/**
		 * Opens this instance of ThingIspector
		 *
		 * @param {string} [initialFocusId]
		 * @public
		 */
		ThingInspector.prototype.open = function(initialFocusId) {
			if (this.getDomRef()) {
				this.rerender();
			}
			Overlay.prototype.open.apply(this,arguments);
			this._selectDefault();
		};

		/**
		 * get Navigation Bar control
		 *
		 * @private
		 */
		ThingInspector.prototype._getNavBar = function() {
			return this._oThingViewer._oNavBar;
		};

		/**
		 * setDefault NavBar selection and fire SelectedItem Event
		 *
		 * @private
		 */
		ThingInspector.prototype._selectDefault = function() {
			this._oThingViewer._selectDefault();
		};

		/**
		 * equal Columns
		 *
		 * @private
		 */
		ThingInspector.prototype._equalColumns = function() {
			this._oThingViewer._equalColumns();
		};

		/**
		 * set trigger value for resize handler
		 *
		 * @private
		 */
		ThingInspector.prototype._setTriggerValue = function() {
			this._oThingViewer._setTriggerValue();
		};

		/**
		 * Focus Last Element
		 *
		 * @private
		 */
		ThingInspector.prototype._setFocusLast = function() {
			var oFocus = this.$("thingViewer-toolbar").lastFocusableDomRef();
			if (!oFocus && this.getCloseButtonVisible() && this.$("close").is(":sapFocusable")) {
				oFocus = this.getDomRef("close");
			} else if (!oFocus && this.getOpenButtonVisible() && this.$("openNew").is(":sapFocusable")) {
				oFocus = this.getDomRef("openNew");
			}
			jQuery.sap.focus(oFocus);
		};

		/**
		 * Focus First Element
		 *
		 * @private
		 */
		ThingInspector.prototype._setFocusFirst = function() {
			if (this.getOpenButtonVisible() && this.$("openNew").is(":sapFocusable")) {
				jQuery.sap.focus(this.getDomRef("openNew"));
			} else if (this.getCloseButtonVisible() && this.$("close").is(":sapFocusable")) {
				jQuery.sap.focus(this.getDomRef("close"));
			} else {
				jQuery.sap.focus(this.$("thingViewer-content").firstFocusableDomRef());
			}
		};

		/* Redefinition of generated API methods */

		// Implementation of API method insertAction
		ThingInspector.prototype.insertAction = function(oAction, iIndex) {
			if (this.getActionBar()) {
				this.getActionBar().insertBusinessAction(oAction, iIndex);
			}
			return this;
		};

		// Implementation of API method addAction
		ThingInspector.prototype.addAction = function(oAction) {
			if (this.getActionBar()) {
				this.getActionBar().addBusinessAction(oAction);
			}
			return this;
		};

		// Implementation of API method removeAction
		ThingInspector.prototype.removeAction = function(oAction) {
			var result;
			if (this.getActionBar()) {
				result = this.getActionBar().removeBusinessAction(oAction);
			}
			return result;
		};

		// Implementation of API method removeAllActions
		ThingInspector.prototype.removeAllActions = function() {
			var result;
			if (this.getActionBar()) {
				result = this.getActionBar().removeAllBusinessActions();
			}
			return result;
		};

		// Implementation of API method getActions
		ThingInspector.prototype.getActions = function() {
			var result;
			if (this.getActionBar()) {
				result = this.getActionBar().getBusinessActions();
			}
			return result;
		};

		// Implementation of API method destroyActions
		ThingInspector.prototype.destroyActions = function() {
			if (this.getActionBar()) {
				this.getActionBar().destroyBusinessActions();
			}
			return this;
		};

		ThingInspector.prototype.indexOfAction = function(oAction) {
			var result = -1;
			if (this.getActionBar()) {
				result = this.getActionBar().indexOfBusinessAction(oAction);
			}
			return result;
		};


		// Implementation of API method
		ThingInspector.prototype.getFacets = function() {
			return this._oThingViewer.getFacets();
		};

		// Implementation of API method insertFacet
		ThingInspector.prototype.insertFacet = function(oFacet, iIndex) {
			this._oThingViewer.insertFacet(oFacet, iIndex);
			return this;
		};

		// Implementation of API method
		ThingInspector.prototype.addFacet = function(oFacet) {
			this._oThingViewer.addFacet(oFacet);
			return this;
		};

		// Implementation of API method
		ThingInspector.prototype.removeFacet = function(vElement) {
			return this._oThingViewer.removeFacet(vElement);
		};

		// Implementation of API method
		ThingInspector.prototype.removeAllFacets = function() {
			return this._oThingViewer.removeAllFacets();
		};

		// Implementation of API method
		ThingInspector.prototype.destroyFacets = function() {
			this._oThingViewer.destroyFacets();
			return this;
		};

		ThingInspector.prototype.indexOfFacet = function(oFacet) {
			return this._oThingViewer.indexOfFacet(oFacet);
		};


		// Implementation of API method
		ThingInspector.prototype.setFollowState = function(oFollowState) {
			if (this.getActionBar()) {
				this.getActionBar().setFollowState(oFollowState);
			}
			return this;
		};
		// Implementation of API method
		ThingInspector.prototype.getFollowState = function() {
			var result = null;
			if (this.getActionBar()) {
				result = this.getActionBar().getFollowState();
			}
			return result;
		};
		// Implementation of API method
		ThingInspector.prototype.setFlagState = function(oFlagState) {
			if (this.getActionBar()) {
				this.getActionBar().setFlagState(oFlagState);
			}
			return this;
		};
		// Implementation of API method
		ThingInspector.prototype.getFlagState = function() {
			var result = null;
			if (this.getActionBar()) {
				result = this.getActionBar().getFlagState();
			}
			return result;
		};
		// Implementation of API method
		ThingInspector.prototype.setFavoriteState = function(oFavoriteState) {
			if (this.getActionBar()) {
				this.getActionBar().setFavoriteState(oFavoriteState);
			}
			return this;
		};
		// Implementation of API method
		ThingInspector.prototype.getFavoriteState = function() {
			var result = null;
			if (this.getActionBar()) {
				result = this.getActionBar().getFavoriteState();
			}
			return result;
		};

		// Implementation of API method
		ThingInspector.prototype.setIcon = function(oIcon) {
			this._oThingViewer.setIcon(oIcon);
			if (this.getActionBar()) {
				this.getActionBar().setThingIconURI(oIcon);
			}
			return this;
		};

		// Implementation of API method
		ThingInspector.prototype.getIcon = function() {
			return this._oThingViewer.getIcon();
		};

		// Implementation of API method
		ThingInspector.prototype.setType = function(sType) {
			this._oThingViewer.setType(sType);
			return this;
		};

		// Implementation of API method
		ThingInspector.prototype.getType = function() {
			return this._oThingViewer.getType();
		};

		// Implementation of API method
		ThingInspector.prototype.insertFacetContent = function(oFacetContent, iIndex) {
			this._oThingViewer.insertFacetContent(oFacetContent, iIndex);
			return this;
		};
		// Implementation of API method
		ThingInspector.prototype.addFacetContent = function(oFacetContent) {
			this._oThingViewer.addFacetContent(oFacetContent);
			return this;
		};
		// Implementation of API method
		ThingInspector.prototype.removeFacetContent = function(vFacetContent) {
			var result = this._oThingViewer.removeFacetContent(vFacetContent);
			return result;
		};
		// Implementation of API method
		ThingInspector.prototype.removeAllFacetContent = function() {
			var result = this._oThingViewer.removeAllFacetContent();
			return result;
		};
		// Implementation of API method
		ThingInspector.prototype.destroyFacetContent = function() {
			this._oThingViewer.destroyFacetContent();
			return this;
		};
		// Implementation of API method
		ThingInspector.prototype.getFacetContent = function() {
			return this._oThingViewer.getFacetContent();
		};

		ThingInspector.prototype.indexOfFacetContent = function(oFacetContent) {
			return this._oThingViewer.indexOfFacetContent(oFacetContent);
		};


		// Implementation of API method
		ThingInspector.prototype.setActionBar = function(oActionBar) {
			this._oThingViewer.setActionBar(oActionBar);
			return this;
		};
		// Implementation of API method
		ThingInspector.prototype.getActionBar = function() {
			return this._oThingViewer.getActionBar();
		};
		// Implementation of API method
		ThingInspector.prototype.destroyActionBar = function() {
			this._oThingViewer.destroyActionBar();
		};
		// Implementation of API method
		ThingInspector.prototype.insertHeaderContent = function(oHeaderContent, iIndex) {
			this._oThingViewer.insertHeaderContent(oHeaderContent, iIndex);
			return this;
		};
		// Implementation of API method
		ThingInspector.prototype.addHeaderContent = function(oHeaderContent) {
			this._oThingViewer.addHeaderContent(oHeaderContent);
			return this;
		};
		// Implementation of API method
		ThingInspector.prototype.getHeaderContent = function() {
			return this._oThingViewer.getHeaderContent();
		};
		// Implementation of API method
		ThingInspector.prototype.removeHeaderContent = function(vHeaderContent) {
			var result = this._oThingViewer.removeHeaderContent(vHeaderContent);
			return result;
		};
		// Implementation of API method
		ThingInspector.prototype.removeAllHeaderContent = function() {
			var result = this._oThingViewer.removeAllHeaderContent();
			return result;
		};
		// Implementation of API method
		ThingInspector.prototype.destroyHeaderContent = function() {
			this._oThingViewer.destroyHeaderContent();
			return this;
		};

		ThingInspector.prototype.indexOfHeaderContent = function(oHeaderContent) {
			return this._oThingViewer.indexOfHeaderContent(oHeaderContent);
		};


		// Implementation of API method
		ThingInspector.prototype.setSelectedFacet = function(selectedFacet) {
			this._oThingViewer.setSelectedFacet(selectedFacet);
		};
		// Implementation of API method
		ThingInspector.prototype.getSelectedFacet = function(selectedFacet) {
			return this._oThingViewer.getSelectedFacet();
		};
		//Implementation of API method
		ThingInspector.prototype.setFavoriteActionEnabled = function(bEnabled) {
			if (this.getActionBar()) {
				this.getActionBar().setShowFavorite(bEnabled);
			}
			return this;
		};
		// Implementation of API method
		ThingInspector.prototype.getFavoriteActionEnabled = function() {
			var result;
			if (this.getActionBar()) {
				result = this.getActionBar().getShowFavorite();
			}
			return result;
		};

		//Implementation of API method
		ThingInspector.prototype.setFlagActionEnabled = function(bEnabled) {
			if (this.getActionBar()) {
				this.getActionBar().setShowFlag(bEnabled);
			}
			return this;
		};
		// Implementation of API method
		ThingInspector.prototype.getFlagActionEnabled = function() {
			var result;
			if (this.getActionBar()) {
				result = this.getActionBar().getShowFlag();
			}
			return result;
		};

		//Implementation of API method
		ThingInspector.prototype.setUpdateActionEnabled = function(bEnabled) {
			if (this.getActionBar()) {
				this.getActionBar().setShowUpdate(bEnabled);
			}
			return this;
		};
		// Implementation of API method
		ThingInspector.prototype.getUpdateActionEnabled = function() {
			var result;
			if (this.getActionBar()) {
				result = this.getActionBar().getShowUpdate();
			}
			return result;
		};

		//Implementation of API method
		ThingInspector.prototype.setFollowActionEnabled = function(bEnabled) {
			if (this.getActionBar()) {
				this.getActionBar().setShowFollow(bEnabled);
			}
			return this;
		};
		//Implementation of API method
		ThingInspector.prototype.getFollowActionEnabled = function() {
			var result;
			if (this.getActionBar()) {
				result = this.getActionBar().getShowFollow();
			}
			return result;
		};
		//Implementation of API method
		ThingInspector.prototype.setFirstTitle = function(sTitle) {
			this._oThingViewer.setTitle(sTitle);
		};

		//Implementation of API method
		ThingInspector.prototype.getFirstTitle = function() {
			return this._oThingViewer.getTitle();
		};

		//Implementation of API method
		ThingInspector.prototype.setSecondTitle = function(sTitle) {
			this._oThingViewer.setSubtitle(sTitle);
		};

		//Implementation of API method
		ThingInspector.prototype.getSecondTitle = function() {
			return this._oThingViewer.getSubtitle();
		};
		ThingInspector.prototype.setHeaderType = function(vHeaderType) {
			this._oThingViewer.setHeaderType(vHeaderType);
			return this;
		};
		ThingInspector.prototype.getHeaderType = function() {
			var result = this._oThingViewer.getHeaderType();
			return result;
		};

		ThingInspector.prototype._applyChanges = function(oChanges) {
			this.oChanges = oChanges;
			if ( oChanges.showOverlay ) {
				this.$().removeClass("sapUiUx3TINoFrame");
			} else {
				this.$().addClass("sapUiUx3TINoFrame");
			}
			return this;
		};
	}());


	return ThingInspector;

}, /* bExport= */ true);
