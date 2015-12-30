/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.m.OverflowToolbar.
sap.ui.define(['jquery.sap.global', './library', 'sap/m/ToggleButton', 'sap/ui/core/InvisibleText', 'sap/m/Toolbar', 'sap/m/ToolbarSpacer', 'sap/m/OverflowToolbarLayoutData', 'sap/m/OverflowToolbarAssociativePopover', 'sap/m/OverflowToolbarAssociativePopoverControls', 'sap/m/OverflowToolbarPriority','sap/ui/core/IconPool','sap/m/SearchField'],
	function(jQuery, library, ToggleButton, InvisibleText, Toolbar, ToolbarSpacer, OverflowToolbarLayoutData, OverflowToolbarAssociativePopover, OverflowToolbarAssociativePopoverControls, OverflowToolbarPriority, IconPool, SearchField) {
		"use strict";



		/**
		 * Constructor for a new Overflow Toolbar
		 *
		 * @param {string} [sId] ID for the new control, generated automatically if no id is given
		 * @param {object} [mSettings] Initial settings for the new control
		 *
		 * @class
		 * The OverflowToolbar control is a container based on sap.m.Toolbar, that provides overflow when its content does not fit in the visible area.
		 *
		 * Note: It is recommended that you use OverflowToolbar over {@link sap.m.Toolbar}, unless you want to avoid overflow in favor of shrinking.
		 * @extends sap.ui.core.Toolbar
		 *
		 * @author SAP SE
		 * @version 1.32.9
		 *
		 * @constructor
		 * @public
		 * @since 1.28
		 * @alias sap.m.OverflowToolbar
		 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
		 *
		 */
		var OverflowToolbar = Toolbar.extend("sap.m.OverflowToolbar", {
			metadata: {
				aggregations: {
					_overflowButton : {type : "sap.m.ToggleButton", multiple : false, visibility: "hidden"},
					_popover : {type : "sap.m.Popover", multiple : false, visibility: "hidden"}
				}
			}
		});

		/**
		 * A shorthand for calling Toolbar.prototype methods
		 * @param sFuncName - the name of the method
		 * @param aArguments - the arguments to pass in the form of array
		 * @returns {*}
		 * @private
		 */
		OverflowToolbar.prototype._callToolbarMethod = function(sFuncName, aArguments) {
			return Toolbar.prototype[sFuncName].apply(this, aArguments);
		};

		/**
		 * Initializes the control
		 * @private
		 * @override
		 */
		OverflowToolbar.prototype.init = function() {
			this._callToolbarMethod("init", arguments);

			// Used to store the previous width of the control to determine if a resize occurred
			this._iPreviousToolbarWidth = null;

			// When set to true, the overflow button will be rendered
			this._bOverflowButtonNeeded = false;

			// When set to true, changes to the controls in the toolbar will trigger a recalculation
			this._bListenForControlPropertyChanges = false;

			// When set to true, controls widths, etc... will not be recalculated, because they are already cached
			this._bControlsInfoCached = false;

			// When set to true, the recalculation algorithm will bypass an optimization to determine if anything moved from/to the action sheet
			this._bSkipOptimization = false;

			// Init static hidden text for ARIA
			if (!OverflowToolbar._sAriaOverflowButtonLabelId) {

				// Load the resources, needed for the text of the overflow button
				var oCoreResourceBundle = sap.ui.getCore().getLibraryResourceBundle("sap.ui.core");

				// Use Icon-Font text
				OverflowToolbar._sAriaOverflowButtonLabelId = new InvisibleText({
					text: oCoreResourceBundle.getText("Icon.overflow")
				}).toStatic().getId();

			}

		};

		/**
		 * Called after the control is rendered
		 */
		OverflowToolbar.prototype.onAfterRendering = function() {
			// If a control of the toolbar was focused, and we're here, then the focused control overflowed, so set the focus to the overflow button
			if (this._bControlWasFocused) {
				this._getOverflowButton().focus();
				this._bControlWasFocused = false;
			}

			// If before invalidation the overflow button was focused, and it's not visible any more, focus the last focusable control
			if (this._bOverflowButtonWasFocused && !this._getOverflowButtonNeeded()) {
				this.$().lastFocusableDomRef().focus();
				this._bOverflowButtonWasFocused = false;
			}

			// TODO: refactor with addEventDelegate for onAfterRendering for both overflow button and its label
			this._getOverflowButton().$().attr("aria-haspopup", "true");

			// Unlike toolbar, we don't set flexbox classes here, we rather set them on a later stage only if needed
			this._doLayout();
		};


		/*********************************************LAYOUT*******************************************************/


		/**
		 * For the OverflowToolbar, we need to register resize listeners always, regardless of Flexbox support
		 * @override
		 * @private
		 */


		OverflowToolbar.prototype._doLayout = function() {
			var iWidth = this.$().width();

			// Stop listening for control changes while calculating the layout to avoid an infinite loop scenario
			this._bListenForControlPropertyChanges = false;

			// Deregister the resize handler to avoid multiple instances of the same code running at the same time
			this._deregisterToolbarResize();

			// Polyfill the flexbox support, if necessary
			this._polyfillFlexboxSupport();

			if (iWidth > 0) {

				// Cache controls widths and other info, if not done already
				if (!this._bControlsInfoCached) {
					this._cacheControlsInfo();
				}

				// A resize occurred (or was simulated by setting previous width to null to trigger a recalculation)
				if (this._iPreviousToolbarWidth !== iWidth) {
					this._iPreviousToolbarWidth = iWidth;
					this._setControlsOverflowAndShrinking(iWidth);
				}

			}

			// Register the resize handler again after all calculations are done and it's safe to do so
			// Note: unlike toolbar, we don't call registerResize, but rather registerToolbarResize here, because we handle content change separately
			this._registerToolbarResize();

			// Start listening for property changes on the controls once again
			this._bListenForControlPropertyChanges = true;
		};

		/**
		 * If the client does not support the latest flexbox spec, run some polyfill code
		 * @private
		 */
		OverflowToolbar.prototype._polyfillFlexboxSupport = function() {
			// Modern clients have flexbox natively, do nothing
			if (Toolbar.hasNewFlexBoxSupport) {
				return;
			}

			// Old flexbox polyfill
			if (Toolbar.hasFlexBoxSupport) {
				var $This = this.$();
				var oDomRef = $This[0] || {};
				$This.removeClass("sapMTBOverflow");
				var bOverflow = oDomRef.scrollWidth > oDomRef.clientWidth;
				bOverflow && $This.addClass("sapMTBOverflow");
			// IE - run the polyfill
			} else {
				Toolbar.flexie(this.$());
			}
		};


		/**
		 * Stores the sizes and other info of controls so they don't need to be recalculated again until they change
		 * @private
		 */
		OverflowToolbar.prototype._cacheControlsInfo = function() {
			var sPriority,
				bCanMoveToOverflow,
				bAlwaysStaysInOverflow;

			this._aMovableControls = []; // Controls that can be in the toolbar or action sheet
			this._aToolbarOnlyControls = []; // Controls that can't go to the action sheet (inputs, labels, buttons with special layout, etc...)
			this._aActionSheetOnlyControls = []; // Controls that are forced to stay in the action sheet (buttons with layout)
			this._aControlSizes = {}; // A map of control id -> control *optimal* size in pixels; the optimal size is outerWidth for most controls and min-width for spacers
			this._iContentSize = 0; // The total *optimal* size of all controls in the toolbar

			this.getContent().forEach(function (oControl) {

				sPriority = OverflowToolbar._getControlPriority(oControl);

				bCanMoveToOverflow = sPriority !== OverflowToolbarPriority.NeverOverflow;
				bAlwaysStaysInOverflow = sPriority === OverflowToolbarPriority.AlwaysOverflow;

				var iControlSize = OverflowToolbar._getOptimalControlWidth(oControl);
				this._aControlSizes[oControl.getId()] = iControlSize;

				if (OverflowToolbarAssociativePopoverControls.supportsControl(oControl) && bAlwaysStaysInOverflow) {
					this._aActionSheetOnlyControls.push(oControl);
				} else {
					// Only add up the size of controls that can be shown in the toolbar, hence this addition is here
					this._iContentSize += iControlSize;

					if (OverflowToolbarAssociativePopoverControls.supportsControl(oControl) && bCanMoveToOverflow) {
						this._aMovableControls.push(oControl);
					} else {
						this._aToolbarOnlyControls.push(oControl);
					}
				}
			}, this);

			// If the system is a phone sometimes due to specificity in the flex the content can be rendered 1px larger that it should be.
			// This causes a overflow of the last element/button
			if (sap.ui.Device.system.phone) {
				this._iContentSize -= 1;
			}

			this._bControlsInfoCached = true;
		};

		/**
		 * Moves controls from/to the action sheet
		 * Sets/removes flexbox css classes to/from controls
		 * @private
		 */
		OverflowToolbar.prototype._setControlsOverflowAndShrinking = function(iToolbarSize) {
			var iContentSize = this._iContentSize,// total optimal control width in pixels, cached in _cacheControlsInfo and used until invalidated
				aButtonsToMoveToActionSheet = [], // buttons that must go to the action sheet
				sIdsHash,
				i,
				aAggregatedMovableControls,
				fnFlushButtonsToActionSheet = function(aButtons) { // helper: moves the buttons in the array to the action sheet
					aButtons.forEach(function(oControl) {
						this._moveButtonToActionSheet(oControl);
					}, this);
				},
				fnInvalidateIfHashChanged = function(sHash) { // helper: invalidate the toolbar if the signature of the action sheet changed (i.e. buttons moved)
					if (typeof sHash === "undefined" || this._getPopover()._getContentIdsHash() !== sHash) {
						this.invalidate();

						// Preserve focus info
						if (this._getControlsIds().indexOf(sap.ui.getCore().getCurrentFocusedControlId()) !== -1) {
							this._bControlWasFocused = true;
						}
						if (sap.ui.getCore().getCurrentFocusedControlId() === this._getOverflowButton().getId()) {
							this._bOverflowButtonWasFocused = true;
						}
					}
				},
				fnAddOverflowButton = function(iContentSize) { // helper: show the overflow button and increase content size accordingly, if not shown already
					if (!this._getOverflowButtonNeeded()) {
						iContentSize += this._getOverflowButtonSize();
						this._setOverflowButtonNeeded(true);
					}
					return iContentSize;
				},
				// Aggregate the controls from this array of elements [el1, el2, el3] to an array of arrays and elements [el1, [el2, el3]].
				// This is needed because groups of elements and single elements share same overflow logic
				// In order to sort elements and group arrays there are _index and _priority property to group array.
				fnAggregateMovableControls = function(aMovableControls) {
					var oGroups =  {},
						aAggregatedControls = [];

					aMovableControls.forEach(function (oControl) {
						var iControlGroup = OverflowToolbar._getControlGroup(oControl),
							oPriorityOrder = OverflowToolbar._oPriorityOrder,
							sControlPriority, iControlIndex, aGroup;

						if (iControlGroup) {
							sControlPriority = OverflowToolbar._getControlPriority(oControl);
							iControlIndex = OverflowToolbar._getControlIndex(oControl);

							oGroups[iControlGroup] = oGroups[iControlGroup] || [];
							aGroup = oGroups[iControlGroup];
							aGroup.push(oControl);

							// The overall group priority is the max priority of its elements
							if (!aGroup._priority || oPriorityOrder[aGroup._priority] < oPriorityOrder[sControlPriority]) {
								aGroup._priority = sControlPriority;
							}
							// The overall group index is the max index of its elements
							if (!aGroup._index || aGroup._index < iControlIndex) {
								aGroup._index = iControlIndex;
							}
						} else {
							aAggregatedControls.push(oControl);
						}
					});

					// combine not grouped elements with group arrays
					Object.keys(oGroups).forEach(function (key) {
						aAggregatedControls.push(oGroups[key]);
					});

					return aAggregatedControls;
				},
				fnExtractControlsToMoveToOverflow = function (vMovableControl) {
					// when vMovableControl is group array
					if (vMovableControl.length) {
						vMovableControl.forEach(fnAddToActionSheetArrAndUpdateContentSize, this);
					} else { // when vMovableControl is a single element
						fnAddToActionSheetArrAndUpdateContentSize.call(this, vMovableControl);
					}

					if (iContentSize <= iToolbarSize) {
						return true;
					}
				},
				// vControlA or vControlB can be control or group array(array of controls) they share same sorting logic
				fnSortByPriorityAndIndex = function(vControlA, vControlB) {
					var oPriorityOrder = OverflowToolbar._oPriorityOrder,
						sControlAPriority = OverflowToolbar._getControlPriority(vControlA),
						sControlBPriority = OverflowToolbar._getControlPriority(vControlB),
						iPriorityCompare = oPriorityOrder[sControlAPriority] - oPriorityOrder[sControlBPriority];

					if (iPriorityCompare !== 0) {
						return iPriorityCompare;
					} else {
						return OverflowToolbar._getControlIndex(vControlB) - OverflowToolbar._getControlIndex(vControlA);
					}
				},
				fnAddToActionSheetArrAndUpdateContentSize = function (oControl) {
					aButtonsToMoveToActionSheet.unshift(oControl);
					iContentSize -= this._aControlSizes[oControl.getId()];
				};

			// If _bSkipOptimization is set to true, this means that no controls moved from/to the overflow, but they rather changed internally
			// In this case we can't rely on the action sheet hash to determine whether to skip one invalidation
			if (this._bSkipOptimization) {
				this._bSkipOptimization = false;
			} else {
				sIdsHash = this._getPopover()._getContentIdsHash(); // Hash of the buttons in the action sheet, f.e. "__button1.__button2.__button3"
			}

			// Clean up the action sheet, hide the overflow button, remove flexbox css from controls
			this._resetToolbar();

			// If there are any action sheet only controls, move them to the action sheet first
			if (this._aActionSheetOnlyControls.length) {
				for (i = this._aActionSheetOnlyControls.length - 1; i >= 0; i--) {
					aButtonsToMoveToActionSheet.unshift(this._aActionSheetOnlyControls[i]);
				}

				// At least one control will be in the action sheet, so the overflow button is needed
				iContentSize = fnAddOverflowButton.call(this, iContentSize);
			}

			// If all content fits - put the buttons from the previous step (if any) in the action sheet and stop here
			if (iContentSize <= iToolbarSize) {
				fnFlushButtonsToActionSheet.call(this, aButtonsToMoveToActionSheet);
				fnInvalidateIfHashChanged.call(this, sIdsHash);
				return;
			}

			// Not all content fits
			// If there are buttons that can be moved, start moving them to the action sheet until there is no more overflow left
			if (this._aMovableControls.length) {

				// There is at least one button that will go to the action sheet - add the overflow button, but only if it wasn't added already
				iContentSize = fnAddOverflowButton.call(this, iContentSize);
				aAggregatedMovableControls = fnAggregateMovableControls(this._aMovableControls);

				// Define the overflow order, depending on items` priority and index.
				aAggregatedMovableControls.sort(fnSortByPriorityAndIndex);

				// Hide controls or groups while iContentSize <= iToolbarSize/
				aAggregatedMovableControls.some(fnExtractControlsToMoveToOverflow, this);
			}

			// At this point all that could be moved to the action sheet, was moved (action sheet only buttons, some/all movable buttons)
			fnFlushButtonsToActionSheet.call(this, aButtonsToMoveToActionSheet);

			// If content still doesn't fit despite moving all movable items to the action sheet, set the flexbox classes
			if (iContentSize > iToolbarSize) {
				this._checkContents(); // This function sets the css classes to make flexbox work, despite its name
			}

			fnInvalidateIfHashChanged.call(this, sIdsHash);
		};

		/**
		 * Resets the toolbar by removing all special behavior from controls, returning it to its default natural state:
		 * - all buttons removed from the action sheet and put back to the toolbar
		 * - the overflow button is removed
		 * - all flexbox classes are removed from items
		 * @private
		 */
		OverflowToolbar.prototype._resetToolbar = function () {

			// 1. Close the action sheet and remove everything from it (reset overflow behavior)
			// Note: when the action sheet is closed because of toolbar invalidation, we don't want the animation in order to avoid flickering
			this._getPopover().close();
			this._getPopover()._getAllContent().forEach(function (oButton) {
				this._restoreButtonInToolbar(oButton);
			}, this);

			// 2. Hide the overflow button
			this._setOverflowButtonNeeded(false);

			// 3 Remove flex classes (reset shrinking behavior)
			this.getContent().forEach(function(oControl) {
				oControl.removeStyleClass(Toolbar.shrinkClass);
			});
		};

		/**
		 * Called for any button that overflows
		 * @param oButton
		 * @private
		 */
		OverflowToolbar.prototype._moveButtonToActionSheet = function(oButton) {
			this._getPopover().addAssociatedContent(oButton);
		};

		/**
		 * Called when a button can fit in the toolbar and needs to be restored there
		 * @param vButton
		 * @private
		 */
		OverflowToolbar.prototype._restoreButtonInToolbar = function(vButton) {
			if (typeof vButton === "object") {
				vButton = vButton.getId();
			}
			this._getPopover().removeAssociatedContent(vButton);
		};

		/**
		 * Closes the action sheet, resets the toolbar, and re-initializes variables to force a full layout recalc
		 * @param bHardReset - skip the optimization, described in _setControlsOverflowAndShrinking
		 * @private
		 */
		OverflowToolbar.prototype._resetAndInvalidateToolbar = function (bHardReset) {

			this._resetToolbar();

			this._bControlsInfoCached = false;
			this._iPreviousToolbarWidth = null;
			if (bHardReset) {
				this._bSkipOptimization = true;
			}

			this.invalidate();
		};



		/****************************************SUB-COMPONENTS*****************************************************/


		/**
		 * Returns all controls from the toolbar that are not in the action sheet
		 * @returns {*|Array.<T>}
		 */
		OverflowToolbar.prototype._getVisibleContent = function () {
			var aToolbarContent = this.getContent(),
				aActionSheetContent = this._getPopover()._getAllContent();

			return aToolbarContent.filter(function(oControl) {
				return aActionSheetContent.indexOf(oControl) === -1;
			});
		};

		/**
		 * Lazy loader for the overflow button
		 * @returns {sap.m.Button}
		 * @private
		 */
		OverflowToolbar.prototype._getOverflowButton = function() {
			var oOverflowButton;

			if (!this.getAggregation("_overflowButton")) {

				// Create the overflow button
				// A tooltip will be used automatically by the button
				// using to the icon-name provided
				oOverflowButton = new ToggleButton({
					icon: IconPool.getIconURI("overflow"),
					press: this._overflowButtonPressed.bind(this),
					ariaLabelledBy: this._sAriaOverflowButtonLabelId,
					type: sap.m.ButtonType.Transparent
				});

				this.setAggregation("_overflowButton", oOverflowButton, true);

			}

			return this.getAggregation("_overflowButton");
		};

		/**
		 * Shows the action sheet
		 * @param oEvent
		 * @private
		 */
		OverflowToolbar.prototype._overflowButtonPressed = function(oEvent) {
			var oPopover = this._getPopover(),
				sBestPlacement = this._getBestActionSheetPlacement();

			if (oPopover.getPlacement() !== sBestPlacement) {
				oPopover.setPlacement(sBestPlacement);
			}

			if (oPopover.isOpen()) {
				oPopover.close();
			} else {
				oPopover.openBy(oEvent.getSource());
			}
		};

		/**
		 * Lazy loader for the popover
		 * @returns {sap.m.Popover}
		 * @private
		 */
		OverflowToolbar.prototype._getPopover = function() {
			var oPopover;

			if (!this.getAggregation("_popover")) {

				// Create the Popover
				oPopover = new OverflowToolbarAssociativePopover(this.getId() + "-popover", {
					showHeader: false,
					showArrow: sap.ui.Device.system.phone ? false : true,
					modal: false,
					horizontalScrolling: sap.ui.Device.system.phone ? false : true,
					contentWidth: sap.ui.Device.system.phone ? "100%" : "auto"
				});
				if (sap.ui.Device.system.phone) {

					// This will trigger when the toolbar is in the header/footer, because the the position is known in advance (strictly top/bottom)
					oPopover.attachBeforeOpen(this._shiftPopupShadow, this);

					// This will trigger when the toolbar is not in the header/footer, when the actual calculation is ready (see the overridden _calcPlacement)
					oPopover.attachAfterOpen(this._shiftPopupShadow, this);
				}

				// This will set the toggle button to "off"
				oPopover.attachAfterClose(this._popOverClosedHandler, this);

				this.setAggregation("_popover", oPopover, true);
			}

			return this.getAggregation("_popover");
		};

		/**
		 * On mobile, remove the shadow from the top/bottom, depending on how the popover was opened
		 * If the popup is placed on the bottom, remove the top shadow
		 * If the popup is placed on the top, remove the bottom shadow
		 * If the popup placement is not calculated yet, do nothing
		 * @private
		 */
		OverflowToolbar.prototype._shiftPopupShadow = function() {
			var oPopover = this._getPopover(),
				sPos = oPopover.getCurrentPosition();

			if (sPos === sap.m.PlacementType.Bottom) {
				oPopover.addStyleClass("sapMOTAPopoverNoShadowTop");
				oPopover.removeStyleClass("sapMOTAPopoverNoShadowBottom");
			} else if (sPos === sap.m.PlacementType.Top) {
				oPopover.addStyleClass("sapMOTAPopoverNoShadowBottom");
				oPopover.removeStyleClass("sapMOTAPopoverNoShadowTop");
			}
		};

		/**
		 * Ensures that the overflowButton is no longer pressed when its popOver closes
		 * @private
		 */
		OverflowToolbar.prototype._popOverClosedHandler = function () {
			this._getOverflowButton().setPressed(false); // Turn off the toggle button
			this._getOverflowButton().$().focus(); // Focus the toggle button so that keyboard handling will work

			// On IE/sometimes other browsers, if you click the toggle button again to close the popover, onAfterClose is triggered first, which closes the popup, and then the click event on the toggle button reopens it
			// To prevent this behaviour, disable the overflow button till the end of the current javascript engine's "tick"
			this._getOverflowButton().setEnabled(false);
			jQuery.sap.delayedCall(0, this, function() {
				this._getOverflowButton().setEnabled(true);

				// In order to restore focus, we must wait another tick here to let the renderer enable it first
				jQuery.sap.delayedCall(0, this, function() {
					this._getOverflowButton().$().focus();
				});
			});
		};

		/**
		 * @returns {boolean|*}
		 * @private
		 */
		OverflowToolbar.prototype._getOverflowButtonNeeded = function() {
			return this._bOverflowButtonNeeded;
		};

		/**
		 *
		 * @param bValue
		 * @returns {OverflowToolbar}
		 * @private
		 */
		OverflowToolbar.prototype._setOverflowButtonNeeded = function(bValue) {
			if (this._bOverflowButtonNeeded !== bValue) {
				this._bOverflowButtonNeeded = bValue;
			}
			return this;
		};

		/***************************************AGGREGATIONS AND LISTENERS******************************************/


		OverflowToolbar.prototype.onLayoutDataChange = function() {
			this._resetAndInvalidateToolbar(true);
		};

		OverflowToolbar.prototype.addContent = function(oControl) {
			this._registerControlListener(oControl);
			this._preProcessControl(oControl);
			this._resetAndInvalidateToolbar(false);
			return this._callToolbarMethod("addContent", arguments);
		};


		OverflowToolbar.prototype.insertContent = function(oControl, iIndex) {
			this._registerControlListener(oControl);
			this._preProcessControl(oControl);
			this._resetAndInvalidateToolbar(false);
			return this._callToolbarMethod("insertContent", arguments);
		};


		OverflowToolbar.prototype.removeContent = function(oControl) {
			var vContent = this._callToolbarMethod("removeContent", arguments);
			this._resetAndInvalidateToolbar(false);

			this._postProcessControl(vContent);
			this._deregisterControlListener(vContent);

			return vContent;
		};


		OverflowToolbar.prototype.removeAllContent = function() {
			var aContents = this._callToolbarMethod("removeAllContent", arguments);

			aContents.forEach(function (oControl) {
				this._deregisterControlListener(oControl);
				this._postProcessControl(oControl);
			}, this);
			this._resetAndInvalidateToolbar(false);

			return aContents;
		};

		OverflowToolbar.prototype.destroyContent = function() {
			this._resetAndInvalidateToolbar(false);

			jQuery.sap.delayedCall(0, this, function() {
				this._resetAndInvalidateToolbar(false);
			});

			return this._callToolbarMethod("destroyContent", arguments);
		};

		/**
		 * Every time a control is inserted in the toolbar, it must be monitored for size/visibility changes
		 * @param oControl
		 * @private
		 */
		OverflowToolbar.prototype._registerControlListener = function(oControl) {
			if (oControl) {
				oControl.attachEvent("_change", this._onContentPropertyChangedOverflowToolbar, this);
			}
		};

		/**
		 * Each time a control is removed from the toolbar, detach listeners
		 * @param oControl
		 * @private
		 */
		OverflowToolbar.prototype._deregisterControlListener = function(oControl) {
			if (oControl) {
				oControl.detachEvent("_change", this._onContentPropertyChangedOverflowToolbar, this);
			}
		};

		/**
		 * Changing a property that affects toolbar content width should trigger a recalculation
		 * This function is triggered on any property change, but will ignore some properties that are known to not affect width/visibility
		 * @param oEvent
		 * @private
		 */
		OverflowToolbar.prototype._onContentPropertyChangedOverflowToolbar = function(oEvent) {

			// Listening for property changes is turned off during layout recalculation to avoid infinite loops
			if (!this._bListenForControlPropertyChanges) {
				return;
			}

			var sSourceControlClass = oEvent.getSource().getMetadata().getName();
			var oControlConfig = OverflowToolbarAssociativePopoverControls.getControlConfig(sSourceControlClass);
			var sParameterName = oEvent.getParameter("name");

			// Do nothing if the changed property is in the blacklist above
			if (typeof oControlConfig !== "undefined" &&
				oControlConfig.noInvalidationProps.indexOf(sParameterName) !== -1) {
				return;
			}

			// Trigger a recalculation
			this._resetAndInvalidateToolbar(true);
		};


		/**
		 * Returns the size of the overflow button - hardcoded, because it cannot be determined before rendering it
		 * @returns {number}
		 * @private
		 */
		OverflowToolbar.prototype._getOverflowButtonSize = function() {
			var iBaseFontSize = parseInt(sap.m.BaseFontSize, 10),
				fCoefficient = this.$().parents().hasClass('sapUiSizeCompact') ? 2.5 : 3;

			return parseInt(iBaseFontSize * fCoefficient, 10);
		};


		/**
		 * Determines the optimal placement of the action sheet depending on the position of the toolbar in the page
		 * For footer and header tags, the placement is hard-coded, for other tags - automatically detected
		 * @returns {sap.m.PlacementType}
		 * @private
		 */
		OverflowToolbar.prototype._getBestActionSheetPlacement = function() {
			var sHtmlTag = this.getHTMLTag();

			// Always open above
			if (sHtmlTag === "Footer") {
				return sap.m.PlacementType.Top;
			// Always open below
			} else if (sHtmlTag === "Header") {
				return sap.m.PlacementType.Bottom;
			}

			return sap.ui.Device.system.phone ? sap.m.PlacementType.Vertical : sap.m.PlacementType.Auto;
		};

		/**
		 * Returns an array of the ids of all controls in the overflow toolbar
		 * @returns {*|Array}
		 * @private
		 */
		OverflowToolbar.prototype._getControlsIds = function() {
			return this.getContent().map(function(item) {
				return item.getId();
			});
		};


		/**
		 * Make changes to certain controls before entering the overflow toolbar
		 * SearchField - always keep selectOnFocus to false while inside the toolbar
		 * @param oControl
		 * @private
		 */
		OverflowToolbar.prototype._preProcessControl = function (oControl) {
			if (!(oControl instanceof SearchField)) {
				return;
			}

			if (oControl.getSelectOnFocus()) {
				oControl.setProperty("selectOnFocus", false, true);
				oControl._origSelectOnFocus = true;
			}
		};

		/**
		 * Restore changes to controls when removing them from the overflow toolbar
		 * @param oControl
		 * @private
		 */
		OverflowToolbar.prototype._postProcessControl = function (oControl) {
			if (!(oControl instanceof SearchField)) {
				return;
			}

			if (typeof oControl._origSelectOnFocus !== "undefined") {
				oControl.setProperty("selectOnFocus", oControl._origSelectOnFocus, true);
				delete oControl._origSelectOnFocus;
			}
		};

		/************************************************** STATIC ***************************************************/


		/**
		 * Returns the optimal width of an element for the purpose of calculating the content width of the OverflowToolbar
		 * so that spacers f.e. don't expand too aggressively and take up the whole space
		 * @param oControl
		 * @returns {*}
		 * @private
		 */
		OverflowToolbar._getOptimalControlWidth = function(oControl) {
			var iOptimalWidth;

			// For spacers, get the min-width + margins
			if (oControl instanceof ToolbarSpacer) {
				iOptimalWidth = parseInt(oControl.$().css('min-width'), 10) || 0  + oControl.$().outerWidth(true) - oControl.$().outerWidth();
			// For other elements, get the outer width
			} else {
				iOptimalWidth = oControl.$().outerWidth(true);
			}

			return iOptimalWidth;
		};

		/**
		 * Returns the control priority based on the layout data (old values are converted) or the priority of the group, which is defined by the max priority of its items.
		 * @static
		 * @param vControl array of controls or single control
		 * @private
		 */
		OverflowToolbar._getControlPriority = function(vControl) {
			if (vControl.length) {
				return vControl._priority;
			}

			var oLayoutData = vControl.getLayoutData && vControl.getLayoutData();

			if (oLayoutData && oLayoutData instanceof OverflowToolbarLayoutData) {

				if (oLayoutData.getMoveToOverflow() === false) {
					return OverflowToolbarPriority.NeverOverflow;
				}

				if (oLayoutData.getStayInOverflow() === true) {
					return OverflowToolbarPriority.AlwaysOverflow;
				}

				return oLayoutData.getPriority();
			}

			return OverflowToolbarPriority.High;
		};

		/**
		 * Returns the control index in the OverflowToolbar content aggregation or the index of a group, which is defined by the rightmost item in the group.
		 * @static
		 * @param vControl array of controls or single control
		 * @private
		 */
		OverflowToolbar._getControlIndex = function(vControl) {
			return vControl.length ? vControl._index : vControl.getParent().indexOfContent(vControl);
		};

		/**
		 * Returns the control group based on the layout data
		 * @static
		 * @param oControl
		 * @private
		 */
		OverflowToolbar._getControlGroup = function(oControl) {
			var oLayoutData = oControl.getLayoutData();

			if (oLayoutData instanceof OverflowToolbarLayoutData) {
				return oLayoutData.getGroup();
			}
		};

		/**
		 * Object that holds the numeric representation of priorities
		 * @static
		 * @private
		 */
		OverflowToolbar._oPriorityOrder = (function () {
			var oPriorityOrder = {};

			oPriorityOrder[OverflowToolbarPriority.Disappear] = 1;
			oPriorityOrder[OverflowToolbarPriority.Low] = 2;
			oPriorityOrder[OverflowToolbarPriority.High] = 3;

			return oPriorityOrder;
		})();

		return OverflowToolbar;

	}, /* bExport= */ true);
