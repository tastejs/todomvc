/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.ux3.ActionBar.
sap.ui.define(['jquery.sap.global', 'sap/ui/core/Control', 'sap/ui/core/delegate/ItemNavigation', './library'],
	function(jQuery, Control, ItemNavigation, library) {
	"use strict";


	
	/**
	 * Constructor for a new ActionBar.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * A special toolbar with predefined social actions which can be shown as needed. These are: Create an update (Feed), Follow, Mark for Follow Up, Mark as Favorite and Open Thing.
	 * 
	 * In addition business actions (ThingAction instances) can be added which are either displayed as MenuItems of the 'More' menu button or as individual tool bar buttons.
	 * 
	 * When using this control, please be aware that it fulfills rather specific requirements: it has been designed for and is used within composite controls QuickView and ThingInspector.
	 * @extends sap.ui.core.Control
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @alias sap.ui.ux3.ActionBar
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var ActionBar = Control.extend("sap.ui.ux3.ActionBar", /** @lends sap.ui.ux3.ActionBar.prototype */ { metadata : {
	
		library : "sap.ui.ux3",
		properties : {
	
			/**
			 * Keeps track of the actionBars Follow/Unfollow button’s state. Its value is one of
			 * - FollowActionState.Default
			 * - FollowActionState.Follow
			 * - FollowActionState.Hold
			 */
			followState : {type : "sap.ui.ux3.FollowActionState", group : "Misc", defaultValue : sap.ui.ux3.FollowActionState.Default},
	
			/**
			 * Indicates whether “Mark for Follow Up” is active
			 */
			flagState : {type : "boolean", group : "Misc", defaultValue : null},
	
			/**
			 * Indicates whether “Favorite” is active
			 */
			favoriteState : {type : "boolean", group : "Misc", defaultValue : null},
			
			/**
			 * Indicates whether “Update” is active
			 */
			updateState : {type : "boolean", group : "Misc", defaultValue : null},
	
			/**
			 * The thing icon uri. Icon will be displayed in Feeder
			 */
			thingIconURI : {type : "sap.ui.core.URI", group : "Misc", defaultValue : null},
	
			/**
			 * If true, business actions are rendered as menu items of the 'More' menu button. Otherwise, 'More' menu button is only displayed for overflow and business actions are rendered as inidividual buttons.
			 */
			alwaysShowMoreMenu : {type : "boolean", group : "Misc", defaultValue : true},
	
			/**
			 * Indicates whether social action “Update” is shown, default is ‘true’
			 */
			showUpdate : {type : "boolean", group : "Misc", defaultValue : true},
	
			/**
			 * Indicates whether social action “Follow” is shown, default is ‘true’
			 */
			showFollow : {type : "boolean", group : "Misc", defaultValue : true},
	
			/**
			 * Indicates whether social action “Mark for Follow Up” is shown, default is ‘true’
			 */
			showFlag : {type : "boolean", group : "Misc", defaultValue : true},
	
			/**
			 * Indicates whether social action “Favorite” is shown, default is ‘true’
			 */
			showFavorite : {type : "boolean", group : "Misc", defaultValue : true},
	
			/**
			 * Indicates whether social action “Open” is shown, default is ‘true’
			 */
			showOpen : {type : "boolean", group : "Misc", defaultValue : true},
	
			/**
			 * The minimum width of ActionBar's the social actions part: business action controls have to be rendered outside this area
			 */
			dividerWidth : {type : "sap.ui.core.CSSSize", group : "Misc", defaultValue : null}
		},
		aggregations : {
	
			/**
			 * Displayed on the actionBar's right hand-side, either as menu item under 'More' or as individual buttons
			 */
			businessActions : {type : "sap.ui.ux3.ThingAction", multiple : true, singularName : "businessAction"}, 
	
			/**
			 * Buttons for the business actions - managed by this ActionBar
			 */
			_businessActionButtons : {type : "sap.ui.commons.Button", multiple : true, singularName : "_businessActionButton", visibility : "hidden"}, 
	
			/**
			 * The social actions which are managed by this ActionBar
			 */
			_socialActions : {type : "sap.ui.ux3.ThingAction", multiple : true, singularName : "_socialAction", visibility : "hidden"}
		},
		events : {
	
			/**
			 * Fired when any of the social action’s toolbar buttons except ‘Update’ or any of the business action’s menu items resp. buttons is pressed. The selected action can be identified by its id and newState (the latter if applicable only)
			 * ‘Follow’ button + menu: id: follow, newState: Follow/Hold/Default
			 * ‘Mark for follow up’ button: id: flag, newState: true/false
			 * ‘Favorite’ button: id: favorite, newState: true/false
			 * ‘Open Thing Inspector’ button id: open
			 * Business Actions: id: the ThingAction id
			 * 
			 * For ‘Update’, please refer to event ‘feedSubmit’
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
					 * New State of the selected action.Only filled if the respective action maintains a state property, for example 'FollowUp' or 'Favorite'
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
			}
		}
	}});
	
	
	/**
	 * Initialization hook for the Actionbar. Creates the empty action map instance
	 * 'mActionMap' and provides the convenience member 'mActionKeys' to access static
	 * 'sap.ui.ux3.ActionBar.M_ACTION_KEYS'  
	 * 
	 * @private
	 */
	ActionBar.prototype.init = function(){
		//Initialize map which will contain the actually used ThingActions
		this.mActionMap = {};
		//Provide convenient access to the static array of action identifiers for "mActionMap"
		this.mActionKeys = sap.ui.ux3.ActionBarSocialActions;
		
		this.oRb = sap.ui.getCore().getLibraryResourceBundle("sap.ui.ux3");
		
		//Show social actions. No need to call the property setters because the prperties are true
		//by default, so there is no property change
		this._setShowSocialAction(this._getSocialAction(this.mActionKeys.Update), true);
		this._setShowSocialAction(this._getSocialAction(this.mActionKeys.Follow), true);
		this._setShowSocialAction(this._getSocialAction(this.mActionKeys.Flag), true);
		this._setShowSocialAction(this._getSocialAction(this.mActionKeys.Favorite), true);
		this._setShowSocialAction(this._getSocialAction(this.mActionKeys.Open), true);
		
		// Initialize the ItemNavigation if required
		if (!this._oItemNavigation) {
			this._oItemNavigation = new ItemNavigation();
			this.addDelegate(this._oItemNavigation);
		}
	};
	
	
	
	
	/**
	 * Destroys this instance of ActionBar, called by Element#destroy()
	 * 
	 * @private
	 */
	ActionBar.prototype.exit = function() {
		this.closePopups();
		
		if (this._oUpdatePopup) {
			this._oUpdatePopup.destroy();
			this._oUpdatePopup = null;
		}
		
		if (this._oMoreMenuButton) {
			this._oMoreMenuButton.destroy();
			this._oMoreMenuButton = null;
		}
		
		if (this._oMoreMenu) {
			this._oMoreMenu.destroy();
			this._oMoreMenu = null;
		}
		
		if (this._oHoldItem) {
			this._oHoldItem.destroy();
		}
		if (this._oUnFollowItem) {
			this._oUnFollowItem.destroy();
		}
		if (this._oUnHoldItem) {
			this._oUnHoldItem.destroy();
		}
		// cleanup the resize handler
		if (this._sResizeListenerId) {
			sap.ui.core.ResizeHandler.deregister(this._sResizeListenerId);
			this._sResizeListenerId = null;
		}
		
		this.mActionKeys = null;
		this.mActionKeys = null;
		this.oRb = null;
		
		this.destroyAggregation("_socialActions");
		this.destroyAggregation("_businessActionButtons");
	
		if (this._oItemNavigation) {
			this.removeDelegate(this._oItemNavigation);
			this._oItemNavigation.destroy();
			delete this._oItemNavigation;
		}
	};
	
	
	
	/**
	 * Checks whether the control is still valid (is in the DOM). ActionBar
	 * instance is rendered if and only if 'isActive' returns 'true'. This
	 * check is called implicitely by the rendere, MUST not be removed.
	 *
	 * @return {boolean} True if the control is still in the active DOM
	 * @protected
	 */
	ActionBar.prototype.isActive = function() {
		var bResult = this.getDomRef() != null;
		
		return bResult;
	};
		
		
	/**
	 * Load language dependent text for given resource bundle key and optional
	 * arguments, if the resource contains dynamic content
	 *
	 * @param sKey resource bundle key
	 * @param aArgs used to fill dynamic resource content 
	 * @return the resource if it was found in the bundle or 'sKey' if no matching
	 *		 resource was available. 
	 * @private
	 */
	ActionBar.prototype._getLocalizedText = function(sKey, aArgs) {
		var sText;
		if (this.oRb) {
			sText = this.oRb.getText(sKey);
		}
		if (sText && aArgs) {
			for (var index = 0; index < aArgs.length; index++) {
				sText = sText.replace("{" + index + "}", aArgs[index]);
			}
		}
		return sText ? sText : sKey;
	};
	
	
	/**
	 * Creates a new social action for the specified 'sActionId' or returns the 
	 * pooled instance of that social action. Assumes 
	 * that 'sActionId' taken from 'this.mActionKeys', otherwise
	 * a warning will be logged and 'undefined is returned'
	 * 
	 * @param sActionId
	 * @return new or pooled instance of the specified action or 'undefined'
	 */
	ActionBar.prototype._getSocialAction = function (sActionId) {
		
		var oResult = this.mActionMap[sActionId];
		if (!oResult) {
			//no instance of the social action created for this action bar instance so far
			oResult = new sap.ui.ux3.ThingAction({id : this.getId() + "-" + sActionId});
			switch (sActionId) {
				case this.mActionKeys.Update:
					oResult.name = this.mActionKeys.Update;
					oResult.tooltipKey = "ACTIONBAR_UPDATE_ACTION_TOOLTIP";
					oResult.cssClass = "sapUiUx3ActionBarUpdateAction";
					//prepares the feeder popup 
					oResult.fnInit = function ( oActionBar ) {
						oActionBar._oUpdatePopup = new sap.ui.ux3.ToolPopup({
						id : oActionBar.getId() + "-UpdateActionPopup"
						}).addStyleClass("sapUiUx3ActionBarUpdatePopup");
						oActionBar._oUpdatePopup._ensurePopup().setAutoClose(true);
						
						oActionBar._feeder = new sap.ui.ux3.Feeder({
							id: oActionBar.getId() + "-Feeder",
							type: sap.ui.ux3.FeederType.Comment,
							thumbnailSrc : oActionBar.getThingIconURI(),
							text: "",
							submit : jQuery.proxy(
							function(oEvent) {
								var feedText = oEvent.getParameter("text");
								this.fireFeedSubmit({
									text : feedText
								});
								this._oUpdatePopup.close();
							}, oActionBar)
						});
						oActionBar._feeder.addStyleClass("sapUiUx3ActionBarFeeder");
						oActionBar._oUpdatePopup.addContent(oActionBar._feeder);
					};
					//opens or closes the feeder popup
					oResult.fnActionSelected = function (oEvent, oActionBar) {
						oActionBar._setUpdateState(!oActionBar.getUpdateState());
						if (oActionBar._oUpdatePopup.isOpen()) {
							oActionBar._oUpdatePopup.close();
						} else {
							var oDomRef, iTIHeight, iContentHeight;
							
							oActionBar._oUpdatePopup.setPosition(sap.ui.core.Popup.Dock.BeginBottom, sap.ui.core.Popup.Dock.BeginTop, oEvent.getSource().getDomRef(), "-8 -13", "none");
							oActionBar._oUpdatePopup.open();
							oDomRef = jQuery(oActionBar._oUpdatePopup.getDomRef());
							iTIHeight = jQuery(window).height();
							iContentHeight = jQuery(oActionBar.getDomRef()).offset().top;
							oDomRef.css("top", "auto").css("bottom",(iTIHeight - iContentHeight + 7) + "px");
							jQuery.sap.delayedCall(1000, this, function() {
								jQuery.sap.focus(oActionBar._feeder.getFocusDomRef());
							});
							
						}
						oActionBar._updateSocialActionDomRef(oResult);
					};
					oResult.fnExit = function( oActionBar) {
						if (oActionBar._oUpdatePopup) {
							oActionBar._oUpdatePopup.destroy();
							oActionBar._oUpdatePopup = null;
						}
					};
					oResult.fnCalculateState = function ( oActionBar ) {
						var result = null;
						if (oActionBar.getUpdateState()) {
							result = "Selected";
						}
						return result;
					};
				break;
			case this.mActionKeys.Follow:
				var followAction = oResult;
				oResult.name = this.mActionKeys.Follow;
				oResult.tooltipKey = "ACTIONBAR_FOLLOW_ACTION_TOOLTIP_FOLLOW";
				oResult.cssClass = "sapUiUx3ActionBarFollowAction";
				oResult.isMenu = function(oActionBar) {
					return oActionBar.getFollowState() != sap.ui.ux3.FollowActionState.Default;
				};
				oResult.fnActionSelected = function (oEvent, oActionBar) {
					if (oActionBar.getFollowState() == sap.ui.ux3.FollowActionState.Default) {
							//set new follow state BEFORE firing the corresponding event
							oActionBar._setFollowState(sap.ui.ux3.FollowActionState.Follow);
							oActionBar.fireActionSelected({
								id : followAction.name,
								state : "followState",
								action : followAction
							});
							
							
							this._fnPrepareFollowMenu(oEvent, oActionBar);
							
						} else {
							var eDock = sap.ui.core.Popup.Dock;
							oActionBar._oMenu.open(false, followAction.getFocusDomRef(), eDock.BeginBottom, eDock.BeginTop, followAction.getDomRef());
						}
					};
				oResult.fnCalculateState = function ( oActionBar ) {
					return oActionBar.getFollowState();
				};
				//populates the menu of the 'Follow' actionBar button depending on the 'FollowState' property
				oResult._fnPrepareFollowMenu = function( oEvent, oActionBar ) {
					var imagePath = sap.ui.resource("sap.ui.ux3", "themes/" + sap.ui.getCore().getConfiguration().getTheme());
					if (oActionBar.mActionMap[oActionBar.mActionKeys.Follow]) {
						if (!oActionBar._oUnFollowItem) {
							oActionBar._oUnFollowItem = new sap.ui.commons.MenuItem({
								id : oActionBar.getId() + "-unfollowState",
								text : oActionBar._getLocalizedText("TI_FOLLOW_ACTION_MENU_TXT_UNFOLLOW"),
								icon : imagePath + "/img/menu_unlisten.png"
							});
						}
						if (!oActionBar._oHoldItem) {
							oActionBar._oHoldItem = new sap.ui.commons.MenuItem({
								id : oActionBar.getId() + "-holdState",
								text : oActionBar._getLocalizedText("TI_FOLLOW_ACTION_MENU_TXT_HOLD"),
								icon : imagePath + "/img/menu_hold.png"
							});
						}
						if (!oActionBar._oUnHoldItem) {
							oActionBar._oUnHoldItem = new sap.ui.commons.MenuItem({
								id : oActionBar.getId() + "-unholdState",
								text : oActionBar._getLocalizedText("TI_FOLLOW_ACTION_MENU_TXT_UNHOLD"),
								icon : imagePath + "/img/menu_follow.png"
							});
						}
						if (!oActionBar._oMenu) {
							oActionBar._oMenu = new sap.ui.commons.Menu({
								id : oActionBar.getId() + "-followActionMenu"
							});
							
							oActionBar._oMenu.attachItemSelect(jQuery.proxy(function(oControlEvent) {
								this._fnFollowMenuSelected(oControlEvent, oActionBar);
							}, this));
							oActionBar._oMenu.addItem(oActionBar._oHoldItem);
							oActionBar._oMenu.addItem(oActionBar._oUnHoldItem);
							oActionBar._oMenu.addItem(oActionBar._oUnFollowItem);
						}
						if (oActionBar.getFollowState() == sap.ui.ux3.FollowActionState.Default) {
							oActionBar.mActionMap[oActionBar.mActionKeys.Follow].setTooltip(oActionBar._getLocalizedText("TI_FOLLOW_ACTION_TOOLTIP_FOLLOW"));
							oActionBar._oHoldItem.setVisible(false);
							oActionBar._oUnFollowItem.setVisible(false);
							oActionBar._oUnHoldItem.setVisible(false);
						} else if (oActionBar.getFollowState() == sap.ui.ux3.FollowActionState.Follow) {
							oActionBar.mActionMap[oActionBar.mActionKeys.Follow].setTooltip(oActionBar._getLocalizedText("TI_FOLLOW_ACTION_TOOLTIP_STOPPAUSE_FOLLOW"));
							oActionBar._oHoldItem.setVisible(true);
							oActionBar._oUnFollowItem.setVisible(true);
							oActionBar._oUnHoldItem.setVisible(false);
						} else if (oActionBar.getFollowState() == sap.ui.ux3.FollowActionState.Hold) {
							oActionBar.mActionMap[oActionBar.mActionKeys.Follow].setTooltip(oActionBar._getLocalizedText("TI_FOLLOW_ACTION_TOOLTIP_STOPCONTINUE_FOLLOW"));
							oActionBar._oHoldItem.setVisible(false);
							oActionBar._oUnFollowItem.setVisible(true);
							oActionBar._oUnHoldItem.setVisible(true);
						}
						oActionBar._updateSocialActionDomRef(oResult);
					}
				};
				//takes care of selection events in the follow menu
				oResult._fnFollowMenuSelected = function(oEvent, oActionBar) {
					if (oActionBar.mActionMap[oActionBar.mActionKeys.Follow]) {
						var sId = oEvent.getParameters().item.getId();
						//set new follow state BEFORE firing the corresponding event
						if (sId == oActionBar.getId() + "-followState") {
							oActionBar._setFollowState(sap.ui.ux3.FollowActionState.Follow);
						} else if (sId == oActionBar.getId() + "-unfollowState") {
							oActionBar._setFollowState(sap.ui.ux3.FollowActionState.Default);
						} else if (sId == oActionBar.getId() + "-holdState") {
							oActionBar._setFollowState(sap.ui.ux3.FollowActionState.Hold);
						} else if (sId + "-unholdState") {
							oActionBar._setFollowState(sap.ui.ux3.FollowActionState.Follow);
						}
						
						oActionBar.fireActionSelected({
							id : followAction.name,
							state: sId,
							action : followAction
						});
						
						this._fnPrepareFollowMenu(oEvent, oActionBar);
					}
				};
				break;
			case this.mActionKeys.Favorite:
					var favoriteAction = oResult;
					oResult.name = this.mActionKeys.Favorite;
					oResult.tooltipKey = "ACTIONBAR_FAVORITE_ACTION_TOOLTIP";
				oResult.cssClass = "sapUiUx3ActionBarFavoriteAction";
				//toggles the 'FavoriteState' property
				oResult.fnActionSelected = function (oEvent, oActionBar) {
					if (oActionBar.getFavoriteState() == true) {
							oActionBar._setFavoriteState(false);
						} else {
							oActionBar._setFavoriteState(true);
						}
						oActionBar.fireActionSelected({
							id : favoriteAction.name,
							state: oActionBar.getFavoriteState(),
							action : favoriteAction
						});
						oActionBar._updateSocialActionDomRef(oResult);
					};
					oResult.fnCalculateState = function ( oActionBar ) {
						var result = null;
						if (oActionBar.getFavoriteState()) {
							result = "Selected";
						}
						return result;
					};
					break;
			case this.mActionKeys.Flag:
				var flagAction = oResult;
				oResult.name = this.mActionKeys.Flag;
				oResult.tooltipKey = "ACTIONBAR_FLAG_ACTION_TOOLTIP";
				oResult.cssClass = "sapUiUx3ActionBarFlagAction";
				//toggles the 'FlagState' property
				oResult.fnActionSelected = function (oEvent, oActionBar) {
					oActionBar._setFlagState(!oActionBar.getFlagState());
					oActionBar.fireActionSelected({
						id : flagAction.name,
						state : oActionBar.getFlagState(),
						action : flagAction
					});
					oActionBar._updateSocialActionDomRef(oResult);
				};
				oResult.fnCalculateState = function ( oActionBar ) {
					var result = null;
					if (oActionBar.getFlagState()) {
						result = "Selected";
					}
					return result;
				};
				break;
			case this.mActionKeys.Open:
				oResult.name = this.mActionKeys.Open;
				oResult.tooltipKey = "ACTIONBAR_OPEN_THING_ACTION_TOOLTIP";
				oResult.cssClass = "sapUiUx3ActionBarOpenThingAction";
				break;
			default:
				jQuery.sap.log.warning("Function \"sap.ui.ux3.ActionBar.prototype._getSocialAction\" was called with unknown action key \"" + sActionId +
					"\".\n\tNo action will not be rendered.");
				return undefined;
			}
		}
		return oResult;
	};
		
		
		
	/*=================================================================================
	 * Re-Rendering
	 * 
	 */
	
	/**    
	  * Updates css classes and aria description for a social action    
	  *    
	  * @param oSocialAction social action to be re-rendered    
	  * @private    
	  */
	ActionBar.prototype._updateSocialActionDomRef = function(oSocialAction) {
		
		var content = oSocialAction.$();
		if (content) {
			//Replace css classes with action's standard css
			content.attr("class", oSocialAction.cssClass);
			if (oSocialAction.fnCalculateState) {
				//add state specific css classes
				content.addClass("sapUiUx3ActionBarAction");
				content.addClass(oSocialAction.fnCalculateState(this));
			}
			if (oSocialAction.name == this.mActionKeys.Update || oSocialAction.name == this.mActionKeys.Flag || oSocialAction.name == this.mActionKeys.Favorite) {
				content.attr("aria-pressed", oSocialAction.fnCalculateState(this) == "Selected" ? "true" : "false");
			}
			if (oSocialAction.isMenu) {
				//Update aria description
				content.attr("aria-haspopup", oSocialAction.isMenu(this) ? "true" : "false");
			}
		}
	};
	
	 
	
		
	/**
	 * Re-renders all content of the '-socialActions' list
	 *
	 * @private
	 */
	ActionBar.prototype._rerenderSocialActions = function() {
		var content = this.$("socialActions");
		if (content.length > 0) {
			var rm = sap.ui.getCore().createRenderManager();
			sap.ui.ux3.ActionBarRenderer.renderSocialActions(rm, this);
			rm.flush(content[0]);
			rm.destroy();
		}
	};
	
	
	/**
	 * Re-renders single business action toolbar button.
	 *
	 * @param oButton business action button to be re-rendered.
	 * @private
	 */
	ActionBar.prototype._rerenderBusinessAction = function(oButton) {
		var content = oButton.$();
		if (content.length > 0) {
			var rm = sap.ui.getCore().createRenderManager();
			rm.renderControl(oButton);
			rm.flush(content[0].parentNode);
			rm.destroy();
		}
	};
	
	
	/**
	 * Re-renders all content of the '-businessActions' list
	 *
	 * @private
	 */
	ActionBar.prototype._rerenderBusinessActions = function() {
		if (!this.getAlwaysShowMoreMenu()) {
			var content = this.$("businessActions");
			if (content && content.length > 0) {
				var rm = sap.ui.getCore().createRenderManager();
				sap.ui.ux3.ActionBarRenderer.renderBusinessActionButtons(rm, this);
				rm.flush(content[0]);
				rm.destroy();
			}
		}
		//make sure that more menu button's visibility is up to date
		this._onresize();
	};
	
	/*=============================================================================
	 * Overwrite setter methods for show<SocialAction> properties
	 * - setShowUpdate 
	 * - setShowFollow
	 * - setShowFlag
	 * - setShowFavorite
	 * - setShowOpen
	 *
	 * Private method _setShowSocialActionProperty to be used within these setters
	 */
	
	/*
	 * Sets follow state and triggering re-rendering
	 *
	 * @param oFollowState new state
	 */
	ActionBar.prototype.setFollowState = function(oFollowState) {
		this.setProperty("followState", oFollowState);
		//CSS 0002094039 2013: Make sure that 'Follow' action menu is available
		//if the follow state is set via API
		if (!this._oMenu) {
			var oFollowAction = this._getSocialAction(this.mActionKeys.Follow);
			oFollowAction._fnPrepareFollowMenu(null, this);
		}
		return this;
	};
	
	
	 
	/*
	 * Shows or hides standard button 'Update' on toolbar
	 *
	 * @param bFlag show or hide this social action on the toolbar
	 */
	ActionBar.prototype.setShowUpdate = function(bFlag) {
		this._setShowSocialAction(this._getSocialAction(this.mActionKeys.Update), bFlag);
		// supress rerendering
		this.setProperty("showUpdate", bFlag, true);
		return this;
	};
	
	/*
	 * Shows or hides standard button 'Follow' on toolbar
	 *
	 * @param bFlag show or hide this social action on the toolbar
	 */
	ActionBar.prototype.setShowFollow = function(bFlag) {
		this._setShowSocialAction(this._getSocialAction(this.mActionKeys.Follow), bFlag);
		// supress rerendering
		this.setProperty("showFollow", bFlag, true);
		return this;
	};
	
	/*
	 * Shows or hides standard button 'Flag' on toolbar
	 *
	 * @param bFlag show or hide this social action on the toolbar
	 */
	ActionBar.prototype.setShowFlag = function(bFlag) {
		this._setShowSocialAction(this._getSocialAction(this.mActionKeys.Flag), bFlag);
		// supress rerendering
		this.setProperty("showFlag", bFlag, true);
		return this;
	};
	
	/*
	 * Shows or hides standard button 'Favorite' on toolbar
	 *
	 * @param {boolean} bFlag show or hide this social action on the toolbar
	 */
	ActionBar.prototype.setShowFavorite = function(bFlag) {
		this._setShowSocialAction(this._getSocialAction(this.mActionKeys.Favorite), bFlag);
		// supress rerendering
		this.setProperty("showFavorite", bFlag, true);
		return this;
	};
	
	/*
	 * Shows or hides standard button 'Open' on toolbar
	 *
	 * @param {boolean} bFlag show or hide this social action on the toolbar
	 */
	ActionBar.prototype.setShowOpen = function(bFlag) {
		this._setShowSocialAction(this._getSocialAction(this.mActionKeys.Open), bFlag);
		// supress rerendering
		this.setProperty("showOpen", bFlag, true);
		return this;
	};
	
	/**
	 * Sets follow state without triggering re-rendering
	 *
	 * @param oFollowState new state
	 * @private
	 */
	ActionBar.prototype._setFollowState = function(oFollowState) {
		// supress rerendering
		this.setProperty("followState", oFollowState, true);
		return this;
	};
	
	/**
	 * Sets flag state without triggering re-rendering
	 *
	 * @param oFlagState new state
	 * @private
	 */
	ActionBar.prototype._setFlagState = function(oFlagState) {
		// supress rerendering
		this.setProperty("flagState", oFlagState, true);
		return this;
	};
	
	/**
	 * Sets update state without triggering re-rendering
	 *
	 * @param oUpdateState new state
	 * @private
	 */
	ActionBar.prototype._setUpdateState = function(oUpdateState) {
		// supress rerendering
		this.setProperty("updateState", oUpdateState, true);
		return this;
	};
	/**
	 * Sets favorite state without triggering re-rendering
	 *
	 * @param oFavoriteState new state
	 * @private
	 */
	ActionBar.prototype._setFavoriteState = function(oFavoriteState) {
		// supress rerendering
		this.setProperty("favoriteState", oFavoriteState, true);
		return this;
	};
	
	// Implementation of API method
	ActionBar.prototype.setThingIconURI = function(oIcon) {
	    // supress rendering 
		this.setProperty("thingIconURI", oIcon, true);
		var oUpdateAction = this.mActionMap[this.mActionKeys.Update];
		if (oUpdateAction && this._feeder) {
			this._feeder.setThumbnailSrc(oIcon);
		} else {
			jQuery.sap.log.warning("Function \"sap.ui.ux3.ActionBar.setThingIconURI\": failed to set new icon \"" + oIcon +
				"\".\n\tReason: either updateAction " + oUpdateAction + " or feeder " + this._feeder + " is not defined."  );
		}
		return this;
	};
	
	/*
	 * Sets the minimum width of ActionBar's the social actions part: 
	 * business action controls have to be rendered outside this area
	 *
	 * @param oWidth the new width as CSSSize
	 */
	ActionBar.prototype.setDividerWidth = function(oWidth) {
		//Make sure that minim width of social actions part is re-calculated
		this._iSocActListWidth = null;
		//do not suppress rerendering
		this.setProperty("dividerWidth", oWidth);
		return this;
	};
	
	/*
	 * Renders business actions as menu items of the 'Other Actions' 
	 * toolbar button if 'bFlag' is true. Otherwise, 'Other Actions' toolbar button disappears and 
	 * business actions are rendered as individual buttons.
	 *
	 * @param {boolean} bFlag If true, business actions are rendered as menu items of the 'Other Actions' 
	 *        toolbar button. Otherwise, 'Other Actions' toolbar button disappears and 
	 *        business actions are rendered as individual buttons.
	 */
	ActionBar.prototype.setAlwaysShowMoreMenu = function(bFlag) {
		var bOldValue = this.getProperty("alwaysShowMoreMenu");
		var businessActionsList = this.getAggregation("businessActions", []);
		this.setProperty("alwaysShowMoreMenu", bFlag, true);
		
		if (bOldValue != bFlag && businessActionsList) {
			
			if (!bFlag) {
				for (var i = 0; i < businessActionsList.length; i++) {
					var oBusinessAction = businessActionsList[i];
					this._createButtonForAction(oBusinessAction,
						this._oMoreMenu._getMenuItemForAction(oBusinessAction));
				}
			} else {
				var actionButtons = this._getBusinessActionButtons();
				for (var iIndex = 0; iIndex < actionButtons.length; iIndex++) {
					if (actionButtons[iIndex].oMenuItem) {
						actionButtons[iIndex].oMenuItem.setVisible(true);
						actionButtons[iIndex].oMenuItem = null;
					}
				}
				this.destroyAggregation("_businessActionButtons");
			}
			this._styleMoreMenuButton();
		}
		this._bCallOnresize = true;
		this._rerenderBusinessActions();
		return this;
	};
	
	/**
	 * Closes all popups which might be opened as ActionBar children
	 * These are the more- and follow menu and the feeder popup
	 * @type void
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	ActionBar.prototype.closePopups = function() {
		if (this._oUpdatePopup) {
			this._oUpdatePopup.close();
		}
		if (this._oMoreMenu) {
			this._oMoreMenu.close();
		}
		if (this._oMenu) {
			this._oMenu.close();
		}
	};
	
	/*=============================================================================
	 * Methods for aggregation '_socialActions':
	 * 
	 */
	
	
		
	/**
	 * Removes the specified social action, if it was added before
	 * and re-renders the actionbar instance. 
	 * 
	 * @param oSocialAction social action to remove from the actionbar.
	 * @return the sap.ui.ux3.ActionBar instance if 'oSocialAction' was removed successfully,
	 * null otherwise.
	 * @private
	 */
	ActionBar.prototype._removeSocialAction = function(oSocialAction) {
		//check if oSocialAction to be removed is displayed at all
		var result = null;
		if (oSocialAction.name && this.mActionMap[oSocialAction.name]) {
			//Call action's clean up method which will in turn
			//destroy any controls created by the action
			if (this.mActionMap[oSocialAction.name].fnExit) {
				this.mActionMap[oSocialAction.name].fnExit(this);
			}
			result = this.removeAggregation("_socialActions", this.mActionMap[oSocialAction.name], true);
			this.mActionMap[oSocialAction.name].destroy();
			//remove both key and value from mActionMap
			delete this.mActionMap[oSocialAction.name];
			this._rerenderSocialActions();
			this._iSocActListWidth = null; //needs to be re-calculated
		}
		return result;
	};
	
	/**
	 * Removes all social actions and re-renders the actionbar instance. 
	 * 
	 * @return the sap.ui.ux3.ActionBar instance
	 * @private
	 */
	ActionBar.prototype._removeAllSocialActions = function() {
		//clear actionMap
		for (var key in this.mActionMap) {
			if (this.mActionMap[key] && this.mActionMap[key].fnExit) {
				this.mActionMap[key].fnExit(this);
			}
		}
		this.mActionMap = {};
		var result = this.removeAllAggregation("_socialActions", true);
		this._iSocActListWidth = null; //needs to be re-calculated
		this._rerenderSocialActions();
		return result;
	};
	
	
	/**
	 * Checks if given 'oSocialAction' has already been added. If not, it is passed on
	 * to private method 'sap.ui.ux3.ActionBar.prototype._prepareSocialAction'. After that,
	 * the action's 'fnInit' exit is called, if it is defined.
	 * 
	 * @param oSocialAction social action to add to the actionbar
	 * @param iIndex position at which new action shall be inserted. If not defined, new action will be appended
	 *		to the end od the aggregation.
	 * @return sap.ui.ux3.ActionBar the sap.ui.ux3.ActionBar instance if 'oSocialAction' was added successfully,
	 * null otherwise.
	 * @private
	 * @see sap.ui.ux3.ActionBar.prototype._prepareSocialAction 
	 */
	ActionBar.prototype._addSocialAction = function(oSocialAction, iIndex) {
		//make sure that each social action is only added once
		//duplicates are useless in this case
		var result = null;
		if (!this.mActionMap[oSocialAction.name]) {
			result = this._prepareSocialAction(oSocialAction, iIndex);
		
			if ( oSocialAction.fnInit ) {
				// call the action's 'fnInit' exit
				oSocialAction.fnInit(this);
			}
			this._iSocActListWidth = null; //needs to be re-calculated
		}
		if (result) {
			//Only if social action was actually added, the actionbar is 
			//rendered again 
			this._rerenderSocialActions();
		}
		return result;
	};
	
		
	/**
	 * Attaches a 'Select' listener to the passed in 'oSocialAction', which will call the
	 * actions 'fnActionSelected'. Uses the action's tooltip key to generate the i18n tooltip
	 * text of the action's button. Finally, adds 'oSocialAction' to the actionbar's 
	 * action map and its '_socialActions' aggregation.
	 *
	 * @param oSocialAction social action to add to the actionbar.
	 * @param iIndex position at which new action shall be inserted. If not defined, new action will be appended
	 *		to the end od the aggregation.
	 * @return sap.ui.ux3.ActionBar the sap.ui.ux3.ActionBar instance 
	 * @private
	 */
	ActionBar.prototype._prepareSocialAction = function(oSocialAction, iIndex) {
		
		// if 'Select' event is triggered on the action (this is done by a 'press' event
		// on the action's toolbar button'), the action's 'fnActionSelected' function is 
		// executed
		oSocialAction.attachSelect(jQuery.proxy(function(oControlEvent) {
			if (oSocialAction.fnActionSelected) {
				oSocialAction.fnActionSelected(oControlEvent, this);
			} else {
				this.fireActionSelected({
					id : oSocialAction.name,
					action : oSocialAction
				});
			}
		}, this));
		oSocialAction.setTooltip(this._getLocalizedText(oSocialAction.tooltipKey));
		this.mActionMap[oSocialAction.name] = oSocialAction;
		if (iIndex) {
			this.insertAggregation("_socialActions", oSocialAction, iIndex, true);
		} else {
			this.addAggregation("_socialActions", oSocialAction, true);
		}
		
		return oSocialAction;
	};
	
	/**
	 * Calls '_addSocialAction' or '_removeSocialAction' depending on 'bFlag'.
	 *
	 * @param oSocialAction social action to deal with.
	 * @param bFlag show the action or not.
	 * @return the sap.ui.ux3.ActionBar instance 
	 * @see sap.ui.ux3.ActionBar._addSocialAction
	 * @see sap.ui.ux3.ActionBar._removeSocialAction  
	 * @private
	 */
	ActionBar.prototype._setShowSocialAction = function (oSocialAction, bFlag) {
		return bFlag ? this._addSocialAction(oSocialAction) : this._removeSocialAction(oSocialAction);
	};
	
	/*=============================================================================
	 * Implementation of generated API methods for aggregation 'businessActions':
	 * - addBusinessAction 
	 * - insertBusinessAction
	 * - removeBusinessAction
	 * - removeAllBusinessActions
	 */
	
	/**
	 * Implementation of API method addBusinessAction.
	 * 
	 * @param oBusinessAction business action to be added 
	 * @return sap.ui.ux3.ActionBar the sap.ui.ux3.ActionBar instance 
	 */
	ActionBar.prototype.addBusinessAction = function(oBusinessAction) {
		return this._addBusinessAction(oBusinessAction);
	};
	
	/**
	 * Implementation of API method insertBusinessAction.
	 * 
	 * @param oBusinessAction business action to be added 
	 * @param iIndex position at which the business action is to be displayed amidst the 
	 *		other business actions 
	 * @return sap.ui.ux3.ActionBar the sap.ui.ux3.ActionBar instance 
	 */
	ActionBar.prototype.insertBusinessAction = function(oBusinessAction, iIndex) {
		return this._addBusinessAction(oBusinessAction, iIndex);
	};
	
	/**
	 * Implementation of API method removeBusinessAction.
	 * 
	 * @param oBusinessAction business action to be removed 
	 * @return sap.ui.ux3.ActionBar the sap.ui.ux3.ActionBar instance 
	 */
	ActionBar.prototype.removeBusinessAction = function(oBusinessAction) {
		return this._removeBusinessAction(oBusinessAction, true);
	};
	
	/**
	 * Removes oBusinessAction and cleans up corresponding menu item
	 * and buttons. Calls rerenderBusinessActions if param 'bRerender' is true
	 * 
	 * @param oBusinessAction business action to be removed 
	 * @param bRerender if this flag is set, business actions are re-rendered.
	 * @return sap.ui.ux3.ActionBar the sap.ui.ux3.ActionBar instance 
	 * @private
	 */
	ActionBar.prototype._removeBusinessAction = function(oBusinessAction, bRerender) {
			
		//Make sure that remove works for action Ids as well
		//CSN 0001948046 2013
		if (typeof oBusinessAction === "string") {
			var oCorrespondingAction;
			var sActionId = oBusinessAction;
			for (var i = 0; i < this.getBusinessActions().length; i++) {
				var oAction = this.getBusinessActions()[i];
				if (oAction.getId() === sActionId) {
					oCorrespondingAction = oAction;
					break;
				}
			}
			oBusinessAction = oCorrespondingAction;
		}
		
		if (this._oMoreMenu) {
			var oMenuItem = this._oMoreMenu._getMenuItemForAction(oBusinessAction);
			if (oMenuItem) {
				this._oMoreMenu.removeItem(oMenuItem);
				oMenuItem.destroy();
			}
			
			// Check if there are any menu items left. If not,
			// destroy the 'More' menu and corresponding menu button
			if (this._oMoreMenu.getItems().length == 0) {
				this._oMoreMenuButton.destroy();
				this._oMoreMenuButton = null;
				this._oMoreMenu.destroy();
				this._oMoreMenu = null;
			}
		}
		
		if (!this.getAlwaysShowMoreMenu()) {
			var oButton = this._getButtonForAction(oBusinessAction);
			if (oButton) {
				
				this.removeAggregation("_businessActionButtons", oButton, true);
				oButton.destroy();
			}
		}
		// do not use flag'bRerender' as parameter here since
		// only the businessActionButtons section shall be
		// rendered. This is taken care of at the end of this 
		// function
		var result = this.removeAggregation("businessActions", oBusinessAction, true);
		if (bRerender) {
			this._rerenderBusinessActions();
		}
		return result;
	};
	
	/**
	 * Implementation of API method removeAllBusinessAction.
	 * 
	 * @return sap.ui.ux3.ActionBar the ActionBar instance for method chaining 
	 */
	ActionBar.prototype.removeAllBusinessActions = function() {
		var businessActionsList = this.getAggregation("businessActions", []);
		if (businessActionsList) {
			for (var i = 0; i < businessActionsList.length; i++) {
				//Call '_removeBusinessAction' individually for each
				//action since that function contains the logic for cleaning
				//up menu items and menus
				//do not re-render inidividually but once and for all at the
				//method's end
				this._removeBusinessAction(businessActionsList[i], false);
			}
		}
		this._rerenderBusinessActions();
		var result = this.removeAllAggregation("businessActions", true);
		return result;
	};
	
	/**
	 * Implementation of API method destroyBusinessActions.
	 * 
	 * @return sap.ui.ux3.ActionBar the ActionBar instance for method chaining
	 */
	ActionBar.prototype.destroyBusinessActions = function() {
		
		var businessActionsList = this.getAggregation("businessActions", []);
		if (businessActionsList) {
			for (var i = 0; i < businessActionsList.length; i++) {
				//Call '_removeBusinessAction' individually for each
				//action since that function contains the logic for cleaning
				//up menu items and menus
				//do not re-render inidividually but once and for all at the
				//method's end
				var aChildren = this._removeBusinessAction(businessActionsList[i], false);
				//destroy each business action
				if (aChildren instanceof sap.ui.core.Element) {
					aChildren.destroy(true);
				}
			}
		}
		this._rerenderBusinessActions();
		var result = this.destroyAggregation("businessActions", true);
		return result;
	};
	
	/**
	 * Returns the aggregation for the business action buttons
	 * @private  
	 */
	ActionBar.prototype._getBusinessActionButtons = function() {
		return this.getAggregation("_businessActionButtons", []);
	};
	
	/**
	 * Checks if property 'showBusinessActionsMenu' is set. If so, it first checks if the 
	 * 'Other Actions' toolbar button is available and creates it if necessary. After that
	 * it adds the new business action as a menu item to the 'Other Actions' toolbar button.
	 * If the flag is not set, the a new '_businessActionButton' is created which is added to the
	 * private aggregation '_businessActionButtons'. If an 'iIndex' is present, it is taken into
	 * consideration in all of these cases.
	 * 
	 * @param oBusinessAction business action to be added 
	 * @param iIndex position at which new action shall be inserted. If not defined, new action will be appended
	 *		to the end of the aggregation.
	 * @return sap.ui.ux3.ActionBar the sap.ui.ux3.ActionBar instance 
	 * @private
	 */
	ActionBar.prototype._addBusinessAction = function(oBusinessAction, iIndex) {
		
		var result;
		
		if (!iIndex && iIndex != 0) {
			result = this.addAggregation("businessActions", oBusinessAction, true);
		} else {
			result = this.insertAggregation("businessActions", oBusinessAction, iIndex, true);
		}
		
		// Prepare the 'Other Actions' toolbar button and add business actions as menu items to the 
		// 'Other Actions' toolbar button
		if (!this._oMoreMenuButton) {
			this._oMoreMenuButton = new sap.ui.commons.MenuButton(this.getId() + "-MoreMenuButton");
			this._oMoreMenuButton.setText(this._getLocalizedText("ACTIONBAR_BUTTON_MORE_TEXT"));
			this._oMoreMenuButton.setTooltip(this._getLocalizedText("ACTIONBAR_BUTTON_MORE_TOOLTIP"));
			var eDock = sap.ui.core.Popup.Dock;
			
			//make sure menu is displayed OVER the more button and towards the inside of the containing
			//control
			this._oMoreMenuButton.setDockButton(eDock.EndTop);
			this._oMoreMenuButton.setDockMenu(eDock.EndBottom);
			
			this._styleMoreMenuButton();
			
			this._oMoreMenu = new sap.ui.commons.Menu(this.getId() + "-MoreMenu", {
				ariaDescription: this._getLocalizedText("ACTIONBAR_BUTTON_MORE_TOOLTIP")
			});
			
			this._oMoreMenu._getMenuItemForAction = function (oAction) {
				for (var i = 0; i < this.getItems().length; i++) {
					var oMenuItem = this.getItems()[i];
					if (oMenuItem.action == oAction) {
						return oMenuItem;
					}
				}
				return null;
			};
			
			this._oMoreMenuButton.setMenu(this._oMoreMenu);
		}
		var sMenuItemID = this._oMoreMenu.getId() + "-MenuItem-" + oBusinessAction.getId();
		var oMenuItem = new sap.ui.commons.MenuItem( sMenuItemID, {text: oBusinessAction.getText(), enabled: oBusinessAction.getEnabled()});
		oMenuItem.action = oBusinessAction;
		oMenuItem.attachSelect(jQuery.proxy(function (oControlEvent) {
			this.fireActionSelected({
				id : oBusinessAction.getId(),
				action : oBusinessAction
			});
		}, this));
		
		if (iIndex) {
			this._oMoreMenu.insertItem(oMenuItem, iIndex);
		} else {
			this._oMoreMenu.addItem(oMenuItem);
		}
		
		this._createButtonForAction(oBusinessAction, oMenuItem, iIndex);
		this._rerenderBusinessActions();
		return result;
	};
	
	/**
	 * Returns the "More" menu button or null, if it has not been created.
	 *
	 * @return the "More" menu button 
	 */
	ActionBar.prototype._getMoreMenuButton = function() {
		return this._oMoreMenuButton;
	};
	
	
	/**
	 * Will be called by the ResizeHandler listening to size changes of the actionBar
	 * control depending on the DOM element or window size changes.
	 * If the "alwaysShowMoreMenu" property is not set, this will check if there is
	 * enough room to render the business actions individually (it does so by checking the
	 * vertical offset of the businessActions' div).
	 * If there is not enough room, the "Other Actions" toolbar button is displayed even 
	 * though "alwaysShowMoreMenu" is not set
	 *
	 * @private  
	 */
	ActionBar.prototype._onresize = function(oEvent) {
	
		//set min width for action bar
		var oActionBarDomRef = this.$();
		
		if (oActionBarDomRef) {
			var sActionBarMinWidth = this.getActionBarMinWidth() + "px";
		
			if (oActionBarDomRef.css('minWidth') != sActionBarMinWidth) {
				oActionBarDomRef.css('minWidth', sActionBarMinWidth);
			}
		}
		
		if (!this.getAlwaysShowMoreMenu() && this._oMoreMenuButton ) {
			//Only show 'More' menu button if there is more than one business action
			var bShowMoreMenuButton = false;
			if ( this._getBusinessActionButtons().length > 1) {
				var iMoreMenuButtonWidth = this._oMoreMenuButton.$().outerWidth();
				
				var iMaxButtonsWidth = oActionBarDomRef.outerWidth()
					- this._getSocialActionListMinWidth()
					- iMoreMenuButtonWidth;
				var actionButtons = this._getBusinessActionButtons();
				
				var iButtonWidth = 0;
				
				for (var iIndex = 0; iIndex < actionButtons.length; iIndex++) {
					var oIthButtonDomRef = actionButtons[iIndex].$().parent();
					iButtonWidth += oIthButtonDomRef.outerWidth();
					if (iIndex == actionButtons.length - 1) {
						//special treatment for last button since it toggles with more menu button
						iButtonWidth -= iMoreMenuButtonWidth;
					}
					
					if (iButtonWidth >= iMaxButtonsWidth) {
						if (oIthButtonDomRef.length > 0) {
							oIthButtonDomRef.css('display', 'none');
							if (actionButtons[iIndex].oMenuItem) {
								actionButtons[iIndex].oMenuItem.setVisible(true);
							}
							//There is at least one business action whose button does not fit
							//so show the 'More' button
							bShowMoreMenuButton = true;
						}
					} else {
						if (oIthButtonDomRef.length > 0) {
							oIthButtonDomRef.css('display', '');
							//due to problems in ie8
							if (!!sap.ui.Device.browser.internet_explorer) {
								this._rerenderBusinessAction(actionButtons[iIndex]);
							}
							if (actionButtons[iIndex].oMenuItem) {
								actionButtons[iIndex].oMenuItem.setVisible(false);
							}
						}
					}
				}
				
				//if there is more business actions than action buttons, there is at least
				//one business action which shall only be displayed in the 'More' menu.
				//In that case, the 'More' menu button MUST be displayed
				bShowMoreMenuButton |= this.getAggregation("businessActions").length > actionButtons.length;
			}
			
			var oMoreMenuButtonDomRef = this._oMoreMenuButton.$().parent();
			if (oMoreMenuButtonDomRef.length > 0) {
				bShowMoreMenuButton ? oMoreMenuButtonDomRef.css('display', '') : oMoreMenuButtonDomRef.css('display', 'none');
			}
			if (!bShowMoreMenuButton && this._oMoreMenu) {
				this._oMoreMenu.close();
			}
		}
		this._setItemNavigation();
		
	};
	
	/**
	 * Rerendering handling
	 * @private
	 */
	ActionBar.prototype.onBeforeRendering = function() {
		sap.ui.core.ResizeHandler.deregister(this._sResizeListenerId);
		this._sResizeListenerId = null;
	};
	
	/**
	 * Rerendering handling
	 * @private
	 */
	ActionBar.prototype.onAfterRendering = function() {
		// listen to resize events of the browser (or surrounding DOM elements)
		this._sResizeListenerId = sap.ui.core.ResizeHandler.register(this.getDomRef(), jQuery.proxy(this._onresize, this));
		if (this._bCallOnresize) {
			this._onresize();
		}
		//make sure that buttons are ready for keyboard navigation
		//this is usually done within 'resize' but we have to make sure that '_setItemNavigation' called
		//at least once
		this._setItemNavigation();
	};
	
	
	/**
	 * Get the min width of the social action list
	 * @return min width of the social action list
	 * @private
	 */
	ActionBar.prototype._getSocialActionListMinWidth = function() {
		//determine minimum width for actionBar and socialActionsList
		
		if (!this._iSocActListWidth) {
			if (this.getDividerWidth()) {
				this._iSocActListWidth = parseInt(this.getDividerWidth(), 10);
			} else {
				// min width of the social actions part is determined by the number of 
				// actually displayed social actions
				
				var oSocialActions = this.getAggregation("_socialActions", []);
				var iActionCount = oSocialActions.length;
				this._iSocActListWidth = 24 * iActionCount + 12; //add some padding
			}
		}
		return this._iSocActListWidth;
	};
	
	/**
	 * Get the min width of the social action list and add the width of the "More" button
	 * @return min width of ActionBar
	 */
	ActionBar.prototype.getActionBarMinWidth = function() {
		
		var iResult = this._getSocialActionListMinWidth();
		var oRightControl = this._oMoreMenuButton;
		if (!this.getAlwaysShowMoreMenu() &&  this._getBusinessActionButtons().length == 1) {
			//If there is exactly one business action it is always displayed
			oRightControl = this._getBusinessActionButtons()[0];
		}
		if (oRightControl) {
			// use parent's outer width because the menu button's outer width
			// has turned out to change, depending on the speed in which you resize 
			// the browser window.
			var oParentDomRef =  oRightControl.$().parent();
			if (oParentDomRef) {
				iResult += oParentDomRef.outerWidth() - 3; //substract left padding
			}
		}
		return iResult;
	};
	
	/**
	 * Delivers action button for a specified action
	 * @param oAction the action for which the button should be found
	 * @return button for specified action
	 * @private
	 */
	ActionBar.prototype._getButtonForAction = function(oAction) {
		for (var i = 0; i < this._getBusinessActionButtons().length; i++) {
			var oButton = this._getBusinessActionButtons()[i];
			if (oButton.action == oAction) {
				return oButton;
			}
		}
		return null;
	};
	
	/**
	 * Creates an action button for a specified action if 
	 * @param oBusinessAction the action for which the button should be found
	 * @param oMenuItem menu item which corresponds to the button
	 * @param iIndex position at which button shall be shown
	 * @return new button for specified action
	 * @private
	 */
	ActionBar.prototype._createButtonForAction = function(oBusinessAction, oMenuItem, iIndex) {
		if (!this.getAlwaysShowMoreMenu() && !oBusinessAction.showInMoreMenu) {
			// Add business actions as individual buttons
			var oButton = new sap.ui.commons.Button({
				id : this.getId() + "-" + oBusinessAction.getId() + "Button",
				text : oBusinessAction.getText(),
				tooltip : oBusinessAction.getTooltip(),
				enabled : oBusinessAction.getEnabled()
			});
			
			oButton.attachPress(jQuery.proxy(function(oControlEvent) {
				this.fireActionSelected({
					id : oBusinessAction.getId(),
					action : oBusinessAction
				});
			}, this));
			//Link menu item to new button
			oButton.oMenuItem = oMenuItem;
			oButton.action = oBusinessAction;
			
			if (iIndex) {
				this.insertAggregation("_businessActionButtons", oButton, iIndex, true);
			} else {
				this.addAggregation("_businessActionButtons", oButton, true);
			}
			return oButton;
		}
		return null;
			
	};
	
	/**
	 * Changes css class of 'More' menu button depending on whether 'alwaysShowMoreMenu'
	 * property is set. If business actions are always displayed in the menu, 
	 * it should be rendered as a lite button.
	 * 
	 * @private
	 */
	ActionBar.prototype._styleMoreMenuButton = function() {
	    if (this._oMoreMenuButton) {
				if (this.getAlwaysShowMoreMenu()) {
				this._oMoreMenuButton.setLite(true);
				//button styling differs from standard lite button: normal font and black color
				this._oMoreMenuButton.addStyleClass("sapUiUx3ActionBarLiteMoreButton");
			}	else {
				this._oMoreMenuButton.setLite(false);
				this._oMoreMenuButton.removeStyleClass("sapUiUx3ActionBarLiteMoreButton");
			}
	    }
	};
	
	
	
	/**
	 * Add Social- and Business Actions to ItemNavigation
	 *
	 * @private
	 */
	ActionBar.prototype._setItemNavigation = function() {
	
		if (this.getDomRef()) {
			
			this._oItemNavigation.setRootDomRef(jQuery(this.getDomRef()).get(0));
			// only if already rendered, otherwise not DOM elements exists
			var aItemDomRefs = [];
			var oActions = this.getAggregation("_socialActions", []);
			for ( var i = 0; i < oActions.length; i++) {
				aItemDomRefs.push(oActions[i].getDomRef());
			}
			oActions = this.getAggregation("_businessActionButtons", []);
			for ( var i = 0; i < oActions.length; i++) {
				aItemDomRefs.push(oActions[i].getDomRef());
			}
			if (this._oMoreMenuButton && this._oMoreMenuButton.getDomRef()) {
				aItemDomRefs.push(this._oMoreMenuButton.getDomRef());
			}
			this._oItemNavigation.setItemDomRefs(aItemDomRefs);
		}
	};
	
	/**
	 * ActionBar invalidation: If ThingActions get invalidated the action buttons/items need to be updated 
	 *
	 * @private
	 */
	ActionBar.prototype.invalidate = function(oControl) {
		if (oControl instanceof sap.ui.ux3.ThingAction) {
			var oBusinessActionButton = sap.ui.getCore().byId(this.getId() + "-" + oControl.getId() + "Button");
			var oBusinessMenuItem = this._oMoreMenu && this._oMoreMenu._getMenuItemForAction(oControl);
			if (oBusinessActionButton) {
				oBusinessActionButton.setTooltip(oControl.getTooltip());
				oBusinessActionButton.setText(oControl.getText());
				oBusinessActionButton.setEnabled(oControl.getEnabled());
			}
			if (oBusinessMenuItem) {
				oBusinessMenuItem.setTooltip(oControl.getTooltip());
				oBusinessMenuItem.setText(oControl.getText());
				oBusinessMenuItem.setEnabled(oControl.getEnabled());
			}
			if (!oBusinessActionButton && !oBusinessMenuItem) {
				//the social actions are ThingActions too, but they need no special treatment
				Control.prototype.invalidate.apply(this,arguments);
			}
		}
		Control.prototype.invalidate.apply(this,arguments);
	};

	return ActionBar;

}, /* bExport= */ true);
