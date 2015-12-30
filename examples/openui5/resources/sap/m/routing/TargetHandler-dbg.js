/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global', 'sap/m/InstanceManager', 'sap/m/NavContainer', 'sap/m/SplitContainer', 'sap/ui/base/Object', 'sap/ui/core/routing/History', 'sap/ui/core/routing/Router'],
	function($, InstanceManager, NavContainer, SplitContainer, BaseObject, History, Router) {
		"use strict";


		/**
		 * Instantiates a TargetHandler, a class used for closing dialogs and showing transitions in NavContainers when targets are displayed.<br/>
		 * <b>You should not create an own instance of this class.</b> It will be created when using {@link sap.m.routing.Router} or {@link sap.m.routing.Targets}.
		 * You may use the {@link #setCloseDialogs} function to specify if dialogs should be closed on displaying other views.
		 *
		 * @class
		 * @param {boolean} closeDialogs - the default is true - will close all open dialogs before navigating, if set to true. If set to false it will just navigate without closing dialogs.
		 * @public
		 * @since 1.28.1
		 * @alias sap.m.routing.TargetHandler
		 */
		var TargetHandler = BaseObject.extend("sap.m.routing.TargetHandler", {
			constructor : function (bCloseDialogs) {
				//until we reverse the order of events fired by router we need to queue handleRouteMatched
				this._aQueue = [];

				if (bCloseDialogs === undefined) {
					this._bCloseDialogs = true;
				} else {
					this._bCloseDialogs = !!bCloseDialogs;
				}
			}
		});

		/* =================================
		 * public
		 * =================================*/

		/**
		 * Sets if a navigation should close dialogs
		 *
		 * @param {boolean} bCloseDialogs close dialogs if true
		 * @public
		 * @returns {sap.m.routing.TargetHandler} for chaining
		 */
		TargetHandler.prototype.setCloseDialogs = function (bCloseDialogs) {
			this._bCloseDialogs = !!bCloseDialogs;
			return this;
		};


		/**
		 * Gets if a navigation should close dialogs
		 *
		 * @public
		 * @returns {boolean} a flag indication if dialogs will be closed
		 */
		TargetHandler.prototype.getCloseDialogs = function () {
			return this._bCloseDialogs;
		};

		TargetHandler.prototype.addNavigation = function(oParameters) {
			this._aQueue.push(oParameters);
		};

		TargetHandler.prototype.navigate = function(oDirectionInfo) {
			var aResultingNavigations = this._createResultingNavigations(oDirectionInfo.navigationIdentifier),
				bCloseDialogs = false,
				bBack = this._getDirection(oDirectionInfo),
				bNavigationOccurred;

			while (aResultingNavigations.length) {
				bNavigationOccurred = this._applyNavigationResult(aResultingNavigations.shift().oParams, bBack);
				bCloseDialogs = bCloseDialogs || bNavigationOccurred;
			}

			if (bCloseDialogs) {
				this._closeDialogs();
			}
		};

		/* =================================
		 * private
		 * =================================
		 */

		/**
		 * @private
		 */
		TargetHandler.prototype._getDirection = function(oDirectionInfo) {
			var iTargetViewLevel = oDirectionInfo.viewLevel,
				oHistory = History.getInstance(),
				bBack = false;

			if (oDirectionInfo.direction === "Backwards") {
				bBack = true;
			} else if (isNaN(iTargetViewLevel) || isNaN(this._iCurrentViewLevel) || iTargetViewLevel === this._iCurrentViewLevel) {
				if (oDirectionInfo.askHistory) {
					bBack = oHistory.getDirection() === "Backwards";
				}
			} else {
				bBack = iTargetViewLevel < this._iCurrentViewLevel;
			}

			this._iCurrentViewLevel = iTargetViewLevel;

			return bBack;
		};

		/**
		 * Goes through the queue and adds the last Transition for each container in the queue
		 * In case of a navContainer or phone mode, only one transition for the container is allowed.
		 * In case of a splitContainer in desktop mode, two transitions are allowed, one for the master and one for the detail.
		 * Both transitions will be the same.
		 * @returns {array} a queue of navigations
		 * @private
		 */
		TargetHandler.prototype._createResultingNavigations = function(sNavigationIdentifier) {
			var i,
				bFoundTheCurrentNavigation,
				oCurrentParams,
				oCurrentContainer,
				oCurrentNavigation,
				aResults = [],
				oView,
				bIsSplitContainer,
				bIsNavContainer,
				bPreservePageInSplitContainer,
				oResult;

			while (this._aQueue.length) {
				bFoundTheCurrentNavigation = false;
				oCurrentParams = this._aQueue.shift();
				oCurrentContainer = oCurrentParams.targetControl;
				bIsSplitContainer = oCurrentContainer instanceof SplitContainer;
				bIsNavContainer = oCurrentContainer instanceof NavContainer;
				oView = oCurrentParams.view;
				oCurrentNavigation = {
					oContainer : oCurrentContainer,
					oParams : oCurrentParams,
					bIsMasterPage : (bIsSplitContainer && !!oCurrentContainer.getMasterPage(oView.getId()))
				};
				bPreservePageInSplitContainer = bIsSplitContainer &&
					oCurrentParams.preservePageInSplitContainer &&
					//only switch the page if the container has a page in this aggregation
					oCurrentContainer.getCurrentPage(oCurrentNavigation.bIsMasterPage)
					&& sNavigationIdentifier !== oCurrentParams.navigationIdentifier;

				//Skip no nav container controls
				if (!(bIsNavContainer || bIsSplitContainer) || !oView) {
					continue;
				}

				for (i = 0; i < aResults.length; i++) {
					oResult = aResults[i];

					//The result targets a different container
					if (oResult.oContainer !== oCurrentContainer) {
						continue;
					}

					//Always override the navigation when its a navContainer, and if its a splitContainer - in the mobile case it behaves like a nav container
					if (bIsNavContainer || sap.ui.Device.system.phone) {
						aResults.splice(i, 1);
						aResults.push(oCurrentNavigation);
						bFoundTheCurrentNavigation = true;
						break;
					}

					//We have a desktop SplitContainer and need to add to transitions if necessary
					//The page is in the same aggregation - overwrite the previous transition
					if (oResult.bIsMasterPage === oCurrentNavigation.bIsMasterPage) {
						if (bPreservePageInSplitContainer) {
							//the view should be preserved, check the next navigation
							break;
						}

						aResults.splice(i, 1);
						aResults.push(oCurrentNavigation);
						bFoundTheCurrentNavigation = true;
						break;
					}
				}

				if (oCurrentContainer instanceof SplitContainer && !sap.ui.Device.system.phone) {
					//We have a desktop SplitContainer and need to add to transitions if necessary
					oCurrentNavigation.bIsMasterPage = !!oCurrentContainer.getMasterPage(oView.getId());
				}

				//A new Nav container was found
				if (!bFoundTheCurrentNavigation) {
					if (!!oCurrentContainer.getCurrentPage(oCurrentNavigation.bIsMasterPage) && bPreservePageInSplitContainer) {
						//the view should be preserved, check the next navigation
						continue;
					}
					aResults.push(oCurrentNavigation);
				}
			}

			return aResults;
		};


		/**
		 * Triggers all navigation on the correct containers with the transition direction.
		 *
		 * @param {object} oParams the navigation parameters
		 * @param {boolean} bBack forces the nav container to show a backwards transition
		 * @private
		 * @returns {boolean} if an navigation occured - if the page is already displayed false is returned
		 */
		TargetHandler.prototype._applyNavigationResult = function(oParams, bBack) {
			var oTargetControl = oParams.targetControl,
				oPreviousPage,
			//Parameters for the nav Container
				oArguments = oParams.eventData,
			//Nav container does not work well if you pass undefined as transition
				sTransition = oParams.transition || "",
				oTransitionParameters = oParams.transitionParameters,
				sViewId = oParams.view.getId(),
			//this is only necessary if the target control is a Split container since the nav container only has a pages aggregation
				bNextPageIsMaster = oTargetControl instanceof SplitContainer && !!oTargetControl.getMasterPage(sViewId);

			//It is already the current page, no need to navigate
			if (oTargetControl.getCurrentPage(bNextPageIsMaster).getId() === sViewId) {
				$.sap.log.info("navigation to view with id: " + sViewId + " is skipped since it already is displayed by its targetControl", "sap.m.routing.TargetHandler");
				return false;
			}

			$.sap.log.info("navigation to view with id: " + sViewId + " the targetControl is " + oTargetControl.getId() + " backwards is " + bBack);

			if (bBack) {
				// insert previous page if not in nav container yet
				oPreviousPage = oTargetControl.getPreviousPage(bNextPageIsMaster);

				if (!oPreviousPage || oPreviousPage.getId() !== sViewId) {
					oTargetControl.insertPreviousPage(sViewId, sTransition , oArguments);
				}

				oTargetControl.backToPage(sViewId, oArguments, oTransitionParameters);

			} else {
				oTargetControl.to(sViewId, sTransition, oArguments, oTransitionParameters);
			}

			return true;
		};


		/**
		 * Closes all dialogs if the closeDialogs property is set to true.
		 *
		 * @private
		 */
		TargetHandler.prototype._closeDialogs = function() {
			if (!this._bCloseDialogs) {
				return;
			}

			// close open popovers
			if (InstanceManager.hasOpenPopover()) {
				InstanceManager.closeAllPopovers();
			}

			// close open dialogs
			if (InstanceManager.hasOpenDialog()) {
				InstanceManager.closeAllDialogs();
			}
		};



		return TargetHandler;

	}, /* bExport= */ true);
