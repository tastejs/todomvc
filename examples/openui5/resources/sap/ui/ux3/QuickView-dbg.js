/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.ux3.QuickView.
sap.ui.define(['jquery.sap.global', 'sap/ui/commons/CalloutBase', 'sap/ui/core/delegate/ItemNavigation', './ActionBar', './library'],
	function(jQuery, CalloutBase, ItemNavigation, ActionBar, library) {
	"use strict";


	
	/**
	 * Constructor for a new QuickView.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * QuickView is a small popup with a short overview of a Thing.
	 * QuickView is shown when a user holds the mouse pointer over a related screen element.
	 * @extends sap.ui.commons.CalloutBase
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @alias sap.ui.ux3.QuickView
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var QuickView = CalloutBase.extend("sap.ui.ux3.QuickView", /** @lends sap.ui.ux3.QuickView.prototype */ { metadata : {
	
		library : "sap.ui.ux3",
		properties : {
	
			/**
			 * Thing type (mandatory) like Account, Material, Employee etc. is displayed in a header at the top part of the QuickView.
			 */
			type : {type : "string", group : "Misc", defaultValue : null},
	
			/**
			 * Thing name shown in the header of the QuickView
			 */
			firstTitle : {type : "string", group : "Misc", defaultValue : null},
	
			/**
			 * URI to Thing Inspector
			 */
			firstTitleHref : {type : "string", group : "Misc", defaultValue : null},
	
			/**
			 * Optional short text shown under the firstTitle
			 */
			secondTitle : {type : "string", group : "Misc", defaultValue : null},
	
			/**
			 * URI of the Thing icon image (mandatory). The image is scaled down to the maximal size of 32 pixel (vertical or horizontal).
			 */
			icon : {type : "sap.ui.core.URI", group : "Misc", defaultValue : null},
	
			/**
			 * Control width as common CSS-size (px or % as unit, for example).
			 */
			width : {type : "sap.ui.core.CSSSize", group : "Dimension", defaultValue : null},
	
			/**
			 * Show Action Bar
			 */
			showActionBar : {type : "boolean", group : "Misc", defaultValue : true},
	
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
			 * Open Thing action enabled/disabled. If disabled the action will be invisible.
			 */
			openActionEnabled : {type : "boolean", group : "Misc", defaultValue : true}
		},
		aggregations : {
	
			/**
			 * Body content of the QuickView
			 */
			content : {type : "sap.ui.core.Element", multiple : true, singularName : "content"}, 
	
			/**
			 * Actions of a Thing
			 */
			actions : {type : "sap.ui.ux3.ThingAction", multiple : true, singularName : "action"}, 
	
			/**
			 * ActionBar. If no actionBar is set a default ActionBar will be created.
			 * In any case, ActionBar is displayed only when the showActionBar property is set to true.
			 */
			actionBar : {type : "sap.ui.ux3.ActionBar", multiple : false}
		},
		events : {
	
			/**
			 * Action is selected in Action Bar
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
					action : {type : "sap.ui.ux3.ThingAction"}, 
	
					/**
					 * New State of the selected action. Only filled if the respective action maintains a state property, for example 'FollowUp' or 'Favorite'
					 */
					newState : {type : "string"}
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
			}, 
	
			/**
			 * Event is fired when a user clicks on the firstTitle link. Call the preventDefault method of the event object to cancel browser navigation.
			 */
			navigate : {allowPreventDefault : true,
				parameters : {
	
					/**
					 * URI of the Thing Inspector application.
					 */
					href : {type : "string"}
				}
			}
		}
	}});
	
	///**
	// * This file defines behavior for the QuickView control,
	// */
	
	
	/**
	 * Initialization of the QuickView control.
	 * 
	 * @private
	 */
	QuickView.prototype.init = function(){
	
		var oActionBar;
	
		// react on the ActionSelected event of the ActionBar
		function onActionSelected(oControlEvent){
			var parameters = oControlEvent.getParameters();
			this.fireActionSelected(parameters);
		}
	
		// react on the FeedSubmit event of the ActionBar
		function onFeedSubmit(oControlEvent){
			var parameters = oControlEvent.getParameters();
			this.fireFeedSubmit(parameters);
		}
	
		// Initialize CalloutBase
		CalloutBase.prototype.init.call(this);
	
		if (!this.getActionBar()) {
			oActionBar = new ActionBar();
	
			oActionBar.attachActionSelected(jQuery.proxy(onActionSelected, this));
	
			oActionBar.attachFeedSubmit(jQuery.proxy(onFeedSubmit, this));
			this.setAggregation("actionBar", oActionBar, true);
		}
	};
	
	/**
	* Handle the mouseover event
	* @param {jQuery.EventObject} oEvent The event that occurred on the QuickView link
	* @private
	 */
	QuickView.prototype.onmouseover = function(oEvent) {
		//jQuery.sap.log.debug("QuickView: mouseover");
		var oPopup = this._getPopup();
		// do not close my pop-up if it was opened already
		if (oPopup.isOpen() && oPopup.getContent() == this) {
			if (this.sCloseNowTimeout) {
				jQuery.sap.clearDelayedCall(this.sCloseNowTimeout);
				this.sCloseNowTimeout = null;
			}
			return;
		}
	
		sap.ui.core.TooltipBase.prototype.onmouseover.call(this, oEvent);
	};
	
	/**
	 * Organize header fields navigation with help of arrow keys.
	 * 
	 * @private
	 */
	QuickView.prototype.onAfterRendering = function(){
		// Collect the DOM references of items that are accessible via keyboard arrow keys
	
		var oFocusRef = this.getDomRef(),
			aDomRefs = [];
	
		// Title
		var oRef = this.$("title");
		aDomRefs.push(oRef);
	
		// Name
		oRef = this.$("link");
		if (!oRef.length) {oRef = this.$("name"); } // when no link, navigate to -name
		if (!oRef.length) { return; } // do nothing if we have a title only
		aDomRefs.push(oRef);
	
		// Description
		oRef = this.$("descr");
		if (oRef.length) {aDomRefs.push(oRef);}
	
		// initialize item navigation
		if (!this.oItemNavigation) {
			this.oItemNavigation = new ItemNavigation(null, null, false);
			this.addDelegate(this.oItemNavigation);
		}
		this.oItemNavigation.setRootDomRef(oFocusRef);
		this.oItemNavigation.setItemDomRefs(aDomRefs);
		this.oItemNavigation.setCycling(false);
		this.oItemNavigation.setSelectedIndex(1); // UX3 requirement: the Name field must be focused first
		this.oItemNavigation.setPageSize(aDomRefs.length);
	};
	
	/**
	 * Function is called when the Control is clicked.
	 * If one of the links on the form is clicked, fire a "navigate" event, otherwise ignore the click.
	 * If one of the "navigate" event handlers calls <code>preventDefault()</code>,
	 * prevent the original event too (cancel browser navigation).
	 *
	 * @param {jQuery.Event} oEvent
	 * @private
	 */
	QuickView.prototype.onclick = function(oEvent) {
	
		var oTarget = oEvent.target;
		// react only on clicks over links:
		if (!oTarget || !oTarget.hasAttribute("href") ) { return; }
	
		// fire the "navigate" event and prevent browser navigation if the application requests this
		if (!this.fireEvent("navigate", {href:oTarget.href}, true, false)) {
			oEvent.preventDefault();
		}
	};
	
	/**
	 * Clean up on exit.
	 * 
	 * @private
	 */
	QuickView.prototype.exit = function() {
		if (this.oItemNavigation) {
			this.removeDelegate(this.oItemNavigation);
			this.oItemNavigation.destroy();
			delete this.oItemNavigation;
		}
	};
	
	// Interface method to ActionBar API
	QuickView.prototype.insertAction = function(oAction, iIndex) {
		if (this.getActionBar()) {
			this.getActionBar().insertBusinessAction(oAction, iIndex);
		}
		return this;
	};
	
	// Interface method to ActionBar API
	QuickView.prototype.addAction = function(oAction) {
		if (this.getActionBar()) {
			this.getActionBar().addBusinessAction(oAction);
		}
		return this;
	};
	
	// Interface method to ActionBar API
	QuickView.prototype.removeAction = function(oAction) {
		if (this.getActionBar()) {
			this.getActionBar().removeBusinessAction(oAction);
		}
		return this;
	};
	
	// Interface method to ActionBar API
	QuickView.prototype.removeAllActions = function() {
		if (this.getActionBar()) {
			this.getActionBar().removeAllBusinessActions();
		}
		return this;
	};
	
	// Interface method to ActionBar API
	QuickView.prototype.getActions = function() {
		if (this.getActionBar()) {
			this.getActionBar().getBusinessActions();
		}
		return this;
	};
	
	// Interface method to ActionBar API
	QuickView.prototype.destroyActions = function() {
		if (this.getActionBar()) {
			this.getActionBar().destroyBusinessActions();
		}
		return this;
	};
	
	// Interface method to ActionBar API
	QuickView.prototype.setFollowState = function(oFollowState) {
		if (this.getActionBar()) {
			this.getActionBar().setFollowState(oFollowState);
		}
		return this;
	};
	
	// Interface method to ActionBar API
	QuickView.prototype.getFollowState = function() {
		var result = null;
		if (this.getActionBar()) {
			result = this.getActionBar().getFollowState();
		}
		return result;
	};
	
	// Interface method to ActionBar API
	QuickView.prototype.setFlagState = function(oFlagState) {
		if (this.getActionBar()) {
			this.getActionBar().setFlagState(oFlagState);
		}
		return this;
	};
	
	// Interface method to ActionBar API
	QuickView.prototype.getFlagState = function() {
		var result = null;
		if (this.getActionBar()) {
			result = this.getActionBar().getFlagState();
		}
		return result;
	};
	
	// Interface method to ActionBar API
	QuickView.prototype.setFavoriteState = function(oFavoriteState) {
		if (this.getActionBar()) {
			this.getActionBar().setFavoriteState(oFavoriteState);
		}
		return this;
	};
	
	// Interface method to ActionBar API
	QuickView.prototype.getFavoriteState = function() {
		var result = null;
		if (this.getActionBar()) {
			result = this.getActionBar().getFavoriteState();
		}
		return result;
	};
	
	// Interface method to ActionBar API
	QuickView.prototype.setFavoriteActionEnabled = function(bEnabled) {
		if (this.getActionBar()) {
			this.getActionBar().setShowFavorite(bEnabled);
		}
		return this;
	};
	
	// Interface method to ActionBar API
	QuickView.prototype.getFavoriteActionEnabled = function() {
		var result;
		if (this.getActionBar()) {
			result = this.getActionBar().getShowFavorite();
		}
		return result;
	};
	
	// Interface method to ActionBar API
	QuickView.prototype.setFlagActionEnabled = function(bEnabled) {
		if (this.getActionBar()) {
			this.getActionBar().setShowFlag(bEnabled);
		}
		return this;
	};
	
	// Interface method to ActionBar API
	QuickView.prototype.getFlagActionEnabled = function() {
		var result;
		if (this.getActionBar()) {
			result = this.getActionBar().getShowFlag();
		}
		return result;
	};
	
	// Interface method to ActionBar API
	QuickView.prototype.setUpdateActionEnabled = function(bEnabled) {
		if (this.getActionBar()) {
			this.getActionBar().setShowUpdate(bEnabled);
		}
		return this;
	};
	
	// Interface method to ActionBar API
	QuickView.prototype.getUpdateActionEnabled = function() {
		var result;
		if (this.getActionBar()) {
			result = this.getActionBar().getShowUpdate();
		}
		return result;
	};
	
	// Interface method to ActionBar API
	QuickView.prototype.setFollowActionEnabled = function(bEnabled) {
		if (this.getActionBar()) {
			this.getActionBar().setShowFollow(bEnabled);
		}
		return this;
	};
	
	// Interface method to ActionBar API
	QuickView.prototype.getFollowActionEnabled = function() {
		var result;
		if (this.getActionBar()) {
			result = this.getActionBar().getShowFollow();
		}
		return result;
	};
	
	// Interface method to ActionBar API
	QuickView.prototype.setOpenActionEnabled = function(bEnabled) {
		if (this.getActionBar()) {
			this.getActionBar().setShowOpen(bEnabled);
		}
		return this;
	};
	
	// Interface method to ActionBar API
	QuickView.prototype.getOpenActionEnabled = function() {
		var result;
		if (this.getActionBar()) {
			result = this.getActionBar().getShowOpen();
		}
		return result;
	};
	
	// Implementation of API method
	QuickView.prototype.setIcon = function(oIcon) {
		this.setProperty("icon", oIcon);
		if (this.getActionBar()) {
			this.getActionBar().setThingIconURI(oIcon);
		}
		return this;
	};
	
	// Implementation of API method
	QuickView.prototype.setActionBar = function(oActionBar) {
		this.setAggregation("actionBar", oActionBar, true);
		if (this.getIcon() && this.getActionBar()) {
			this.getActionBar().setThingIconURI(this.getIcon());
		}
		return this;
	};
	

	return QuickView;

}, /* bExport= */ true);
