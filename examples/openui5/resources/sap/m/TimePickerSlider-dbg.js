/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(['jquery.sap.global', 'sap/ui/core/Control', './TimePickerSliderRenderer', 'sap/ui/core/IconPool'],
	function(jQuery, Control, TimePickerSliderRenderer, IconPool) {
		"use strict";

		/**
		 * Constructor for a new TimePickerSlider.
		 *
		 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
		 * @param {object} [mSettings] Initial settings for the new control
		 *
		 * @class
		 * TimePickerSlider is a picker list control used inside a {@link sap.m.TimePicker} to choose a value.
		 * @extends sap.ui.core.Control
		 *
		 * @author SAP SE
		 * @version 1.32.9
		 *
		 * @constructor
		 * @public
		 * @since 1.32
		 * @alias sap.m.TimePickerSlider
		 */
		var TimePickerSlider = Control.extend("sap.m.TimePickerSlider", /** @lends sap.m.TimePickerSlider.prototype */ {
			metadata: {
				library: "sap.m",
				properties: {
					/**
					 * The key of the currently selected value of the slider.
					 */
					selectedValue: {type: "string", defaultValue: null},
					/**
					 * Indicates whether the slider supports cyclic scrolling.
					 */
					isCyclic: {type: "boolean", defaultValue: true},
					/**
					 * Defines the descriptive text for the slider, placed as a label above it.
					 */
					label: {type: "string", defaultValue: null},
					/**
					 * Indicates whether the slider is currently expanded.
					 */
					isExpanded: {type: "boolean", defaultValue: false}
				},
				aggregations: {
					/**
					 * Aggregation that contains the items of the slider.
					 */
					items: {type: "sap.ui.core.Item", multiple: true, singularName: "item"},

					/**
					 * Aggregation that contains the up arrow.
					 */
					_arrowUp: {type: "sap.ui.core.Icon", multiple: false, visibility: "hidden" },

					/**
					 * Aggregation that contains the down arrow.
					 */
					_arrowDown: {type: "sap.ui.core.Icon", multiple: false, visibility: "hidden" }
				},
				events: {
					/**
					 * Fires when the slider is expanded.
					 */
					expanded: {}
				}
			},
			renderer: TimePickerSliderRenderer.render
		});


		TimePickerSlider.MIN_ITEMS = 50;

		/**
		 * Initializes the control.
		 *
		 * @public
		 */
		TimePickerSlider.prototype.init = function() {
			this._bIsDrag = null;
			this._selectionOffset = 0;
			this._mousedown = false;
			this._dragSession = null;
			this._iSelectedItemIndex = -1;
			this._animatingSnap = false;
			this._iSelectedIndex = -1;
			this._contentRepeat = null;
			this._animating = false;
			this._intervalId = null;
			this._maxScrollTop = null;
			this._minScrollTop = null;
			this._marginTop = null;
			this._marginBottom = null;
			this._bOneTimeValueSelectionAnimation = false;

			this._initArrows();
		};

		/**
		 * Called after the control is rendered.
		 */
		TimePickerSlider.prototype.onAfterRendering = function () {
			if (sap.ui.Device.system.phone) { //the layout still 'moves' at this point - dialog and its content, so wait a little
				jQuery.sap.delayedCall(0, this, this._afterExpandCollapse);
			} else {
				this._afterExpandCollapse();
			}
			this._attachEvents();
		};

		/**
		 * Handles the themeChanged event.
		 *
		 * Does a re-rendering of the control.
		 * @param {jQuery.Event} oEvent Event object
		 */
		TimePickerSlider.prototype.onThemeChanged = function(oEvent) {
			this.rerender();
		};

		/**
		 * Handles the tap event.
		 *
		 * Expands or selects the taped element.
		 * @param {jQuery.Event} oEvent Event object
		 */
		TimePickerSlider.prototype.fireTap = function(oEvent) {
			//expand column with a click
			if (!this.getIsExpanded()) {
				if (sap.ui.Device.system.desktop) {
					this.focus();
				} else {
					this.setIsExpanded(true);
				}
			} else { //or select an element from the list
				var oScrElement = oEvent.srcElement || oEvent.originalTarget,
					sItemText,
					sItemKey;

				if (oScrElement.tagName.toLowerCase() === "li") {
					sItemText = jQuery(oScrElement).text();
					sItemKey  = fnFindKeyByText.call(this, sItemText);

					this._bOneTimeValueSelectionAnimation = true;
					this.setSelectedValue(sItemKey);
				} else { //if no selection is happening, return the selected style which was removed ontouchstart
					this._addSelectionStyle();
				}
			}
		};

		/**
		 * Sets the currently selected value with an item key.
		 *
		 * @override
		 * @param {string} sValue The key of the new selected value
		 * @returns {*|boolean|void|sap.ui.base.ManagedObject}
		 * @public
		 */
		TimePickerSlider.prototype.setSelectedValue = function(sValue) {
			var iIndexOfValue = findIndexInArray(this.getItems(), function(oElement) {
				return oElement.getKey() === sValue;
			}),
					that = this;
			if (iIndexOfValue === -1) {
				return;
			}

			//scroll
			if (this.getDomRef()) {
				var iIndex;
				//list items' values are repeated, so find the one nearest to the middle of the list
				if (iIndexOfValue * this._getItemHeightInPx() >= this._selectionOffset) {
					iIndex = this.getItems().length * Math.floor(this._getContentRepeat() / 2) + iIndexOfValue;
				} else {
					iIndex = this.getItems().length * Math.ceil(this._getContentRepeat() / 2) + iIndexOfValue;
				}

				if (this._bOneTimeValueSelectionAnimation) {
					this._animatingSnap = true;
					this._getSliderContainerDomRef().animate({scrollTop: iIndex * this._getItemHeightInPx() - this._selectionOffset}, 200, 'linear', function () {
						that._getSliderContainerDomRef().clearQueue();
						that._animatingSnap = false;
						that._bOneTimeValueSelectionAnimation = false;
					});
				} else {
					this._getSliderContainerDomRef().scrollTop(iIndex * this._getItemHeightInPx() - this._selectionOffset);
				}

				this._removeSelectionStyle();
				this._iSelectedItemIndex = iIndex; //because we repeated content / values

				this._addSelectionStyle();
			}

			return this.setProperty("selectedValue", sValue, true); // no rerendering
		};

		/**
		 * Sets the <code>isExpanded</code> property of the slider.
		 *
		 * @override
		 * @param {boolean} bValue True or false
		 * @param {boolean} suppressEvent Whether to suppress event firing
		 * @returns {sap.m.TimePickerSlider} this instance, used for chaining
		 * @public
		 */
		TimePickerSlider.prototype.setIsExpanded = function(bValue, suppressEvent) {
			this.setProperty("isExpanded", bValue, true);

			if (this.getDomRef()) {
				var $This = this.$();

				if (bValue) {
					if (!$This.hasClass("sapMTPSliderExpanded")) {
						$This.addClass("sapMTPSliderExpanded");
					}

					if (sap.ui.Device.system.phone) {
						jQuery.sap.delayedCall(0, this, function() {
							this._updateSelectionFrameLayout();
							if (!suppressEvent) {
								this.fireExpanded({ctrl: this});
							}
						});
					} else {
						this._updateSelectionFrameLayout();
						if (!suppressEvent) {
							this.fireExpanded({ctrl: this});
						}
					}
				} else {
					this._stopAnimation();
					//stop snap animation also
					if (this._animatingSnap === true) {
						this._animatingSnap = false;
						this._getSliderContainerDomRef().stop(true);
						//be careful not to invoke this method twice (the first time is on animate finish callback)
						this._scrollerSnapped(this._iSelectedIndex);
					}

					$This.removeClass("sapMTPSliderExpanded");

					if (sap.ui.Device.system.phone) {
						jQuery.sap.delayedCall(0, this, this._afterExpandCollapse);
					} else {
						this._afterExpandCollapse();
					}
				}
			}

			return this;
		};

		/**
		 * Handles the focusin event.
		 *
		 * Expands the focused slider.
		 * @param {jQuery.Event} oEvent Event object
		 */
		TimePickerSlider.prototype.onfocusin = function(oEvent) {
			if (sap.ui.Device.system.desktop && !this.getIsExpanded()) {
				this.setIsExpanded(true);
			}
		};

		/**
		 * Handles the focusout event.
		 *
		 * Make sure the blurred slider is collapsed on desktop.
		 * @param {jQuery.Event} oEvent Event object
		 */
		TimePickerSlider.prototype.onfocusout = function(oEvent) {

			var sFocusedElementId = oEvent.relatedTarget ? oEvent.relatedTarget.id : null,
				aArrowsIds = [this.getAggregation("_arrowUp").getId(), this.getAggregation("_arrowDown").getId()];

			// Do not close, if any of the arrows is clicked
			if (sFocusedElementId && aArrowsIds.indexOf(sFocusedElementId) !== -1) {
				return;
			}


			if (sap.ui.Device.system.desktop && this.getIsExpanded()) {
				this.setIsExpanded(false);
			}
		};

		/**
		 * Handles the pageup event.
		 *
		 * Selects the first item value.
		 * @param {jQuery.Event} oEvent Event object
		 */
		TimePickerSlider.prototype.onsappageup = function(oEvent) {
			if (this.getIsExpanded()) {
				var iFirstItem = this.getItems()[0];
				this.setSelectedValue(iFirstItem.getKey());
			}
		};

		/**
		 * Handles the pagedown event.
		 *
		 * Selects the last item value.
		 * @param {jQuery.Event} oEvent Event object
		 */
		TimePickerSlider.prototype.onsappagedown = function(oEvent) {
			if (this.getIsExpanded()) {
				var iLastItem = this.getItems()[this.getItems().length - 1];
				this.setSelectedValue(iLastItem.getKey());
			}
		};

		/**
		 * Handles the arrowup event.
		 *
		 * Selects the previous item value.
		 * @param {jQuery.Event} oEvent Event object
		 */
		TimePickerSlider.prototype.onsapup = function(oEvent) {
			if (this.getIsExpanded()) {
				this._offsetValue(-1);
			}
		};

		/**
		 * Handles the arrowdown event.
		 *
		 * Selects the next item value.
		 * @param {jQuery.Event} oEvent Event object
		 */
		TimePickerSlider.prototype.onsapdown = function(oEvent) {
			if (this.getIsExpanded()) {
				this._offsetValue(1);
			}
		};

		/**
		 * Finds the slider's container in the DOM.
		 *
		 * @returns {object} Slider container's jQuery object
		 * @private
		 */
		TimePickerSlider.prototype._getSliderContainerDomRef = function() {
			return this.$().find(".sapMTimePickerSlider");
		};

		/**
		 * Calculates how many times the slider content should be repeated so that it fills the space.
		 *
		 * The method is called only when isCyclic property is set to true.
		 * @returns {number} Content repetitions needed
		 * @private
		 */
		TimePickerSlider.prototype._getContentRepeat = function() {
			//how many times the content is repeated?
			//we target to get at least TimePickerSlider.MIN_ITEMS items in the list,
			//so repeat the content as many times as it is needed to get that number
			//but repeat the content at least 3 times to ensure cyclic visibility
			if (!this._contentRepeat) {
				if (this.getIsCyclic()) {
					this._contentRepeat = Math.ceil(TimePickerSlider.MIN_ITEMS / this.getItems().length);
					this._contentRepeat = Math.max(this._contentRepeat, 3);
				} else {
					this._contentRepeat = 1;
				}
			}

			return this._contentRepeat;
		};

		/**
		 * Calculates the index of the border frame based on its slider items.
		 *
		 * @returns {number} The index of the frameBorder
		 * @private
		 */
		TimePickerSlider.prototype._getSelectionFrameIndex = function() {
			//zero based
			var iSliderHeight = this._getSliderContainerDomRef().height(),
				iItemHeight = this._getItemHeightInPx(),
				iCellsInSlider,
				iFrameIndex,
				bAdjustFrameIndex,
				bCompactMode = this.$().parents().hasClass("sapUiSizeCompact");

			//Android 4.1 - 4.3, native browser snap fix - the height should be 100% - 2rem, but it's 100%
			if (iSliderHeight === this.$().height()) {
				iSliderHeight -= jQuery(".sapMTimePickerLabel").height();
			}

			iCellsInSlider = iSliderHeight / iItemHeight;
			iFrameIndex = Math.floor(iSliderHeight / (2 * iItemHeight));

			/*  The bAdjustFrameIndex bellow is a dirty fix for a wrong DOM element height, resulting in wrong
			    calculations - consider fixing the root cause (and all the problems deriving from such a fix)
			    and removing the hack in the future */

			/*  If the slider is that big so that it can hold an exact even number or just a bit more than an exact
				even number of cells, the iFrameIndex needs adjustment. The magic number 0.20 is limiting exactly how much the slider should be bigger to produce wrong result - It is caused by the way the layout is build. */
			bAdjustFrameIndex = (!(Math.floor(iCellsInSlider) % 2)) && ((iCellsInSlider - Math.floor(iCellsInSlider)) < 0.20);

			if (bAdjustFrameIndex && !bCompactMode) {
				/*  Adjusting the index is necessary, as the slider has a variable height ratio on different
					viewports (it's not visible as it goes into a hidden overflow *sigh*), thus sometimes
					resulting in a slightly bigger slider than visually perceived - which produces wrong calculation
					about where the target frame is located */
				iFrameIndex -= 1;
			}

			return iFrameIndex;
		};

		/**
		 * Gets the CSS height of a list item.
		 *
		 * @returns {number} CSS height in pixels
		 * @private
		 */
		TimePickerSlider.prototype._getItemHeightInPx = function() {
			return this.$("content").find("li").outerHeight();
		};

		/**
		 * Calculates the center of the column and places the border frame.
		 * @private
		 */
		TimePickerSlider.prototype._updateSelectionFrameLayout = function() {
			var $Frame,
				iFrameTopPosition,
				topPadding;

			if (this.getDomRef()) {
				$Frame = this.$().find(".sapMTPPickerSelectionFrame");
				topPadding = this.$().parents(".sapUiSizeCompact").length > 0 ? 8 : 16; //depends if we are in compact mode

				//the frame is absolutly positioned in the middle of its container
				//its height is the same as the list items' height
				//so the top of the middle === container.height/2 - item.height/2
				//corrected with the top padding
				iFrameTopPosition = (this.$().height() - this._getItemHeightInPx()) / 2 + topPadding;

				$Frame.css("top", iFrameTopPosition);

				if (sap.ui.Device.system.phone) {
					jQuery.sap.delayedCall(0, this, this._afterExpandCollapse);
				} else {
					this._afterExpandCollapse();
				}
			}
		};

		/**
		 * Calculates the top offset of the border frame relative to its container.
		 * @private
		 * @returns {number} Top offset of the border frame
		 */
		TimePickerSlider.prototype._getSelectionFrameTopOffset = function() {
			var $Frame = this._getSliderContainerDomRef().find(".sapMTPPickerSelectionFrame"),
				oFrameOffset = $Frame.offset();
			return oFrameOffset.top;
		};

		/**
		 * Animates slider scrolling.
		 *
		 * @private
		 * @param iSpeed {number} Animating speed
		 */
		TimePickerSlider.prototype._animateScroll = function(iSpeed) {
			var iPreviousScrollTop = this._getSliderContainerDomRef().scrollTop(),
				that = this,
				frameFrequencyMs = 25, //milliseconds - 40 frames per second; 1000ms / 40frames === 25
				$ContainerHeight = that._getSliderContainerDomRef().height(),
				$ContentHeight = that.$("content").height(),
				//increase the distance that the slider can be dragged before reaching one end of the list
				//because we do not do updates of list offset while dragging,
				//we have to keep that distance long at least while animating
				iDragMarginBuffer = 200,
				iDragMargin = $ContainerHeight + iDragMarginBuffer,
				iContentRepeat = that._getContentRepeat(),
				bCycle = that.getIsCyclic(),
				fDecelerationCoefficient = 0.9,
				fStopSpeed = 0.05,
				iSnapDuration = 200;

			that._intervalId = setInterval(function() {
				that._animating = true;
				//calculate the new scroll offset by subtracting the distance
				iPreviousScrollTop = iPreviousScrollTop - iSpeed * frameFrequencyMs;
				if (bCycle) {
					iPreviousScrollTop = that._getUpdatedCycleScrollTop($ContainerHeight, $ContentHeight, iPreviousScrollTop, iDragMargin, iContentRepeat);
				} else {
					if (iPreviousScrollTop > that._maxScrollTop) {
						iPreviousScrollTop = that._maxScrollTop;
						iSpeed = 0;
					}

					if (iPreviousScrollTop < that._minScrollTop) {
						iPreviousScrollTop = that._minScrollTop;
						iSpeed = 0;
					}
				}
				that._getSliderContainerDomRef().scrollTop(iPreviousScrollTop);

				iSpeed *= fDecelerationCoefficient;
				if (Math.abs(iSpeed) < fStopSpeed) {  // px/milliseconds
					//snapping
					var iItemHeight = that._getItemHeightInPx();
					var iOffset = that._selectionOffset ? (that._selectionOffset % iItemHeight) : 0;
					var iSnapScrollTop = Math.ceil(iPreviousScrollTop / iItemHeight) * iItemHeight - iOffset;

					clearInterval(that._intervalId);
					that._animating = null; //not animating
					that._iSelectedIndex = Math.floor(iPreviousScrollTop / iItemHeight);

					that._animatingSnap = true;
					that._getSliderContainerDomRef().animate({ scrollTop: iSnapScrollTop}, iSnapDuration, 'linear', function() {
						that._getSliderContainerDomRef().clearQueue();
						that._animatingSnap = false;
						that._scrollerSnapped(that._iSelectedIndex);
					});
				}
			}, frameFrequencyMs);
		};

		/**
		 * Stops the scrolling animation.
		 *
		 * @private
		 */
		TimePickerSlider.prototype._stopAnimation = function() {
			if (this._animating) {
				clearInterval(this._intervalId);
				this._animating = null;
			}
		};

		/**
		 * Starts scroll session.
		 *
		 * @param {number} iPageY The starting y-coordinate of the target
		 * @private
		 */
		TimePickerSlider.prototype._startDrag = function(iPageY) {
			//start collecting touch coordinates
			if (!this._dragSession) {
				this._dragSession = {};
				this._dragSession.positions = [];
			}

			this._dragSession.pageY = iPageY;
			this._dragSession.startTop = this._getSliderContainerDomRef().scrollTop();
		};

		/**
		 * Performs vertical scroll.
		 *
		 * @param {number} iPageY The current y-coordinate of the target to scroll to
		 * @param {date} dTimeStamp Timestamp of the event
		 * @private
		 */
		TimePickerSlider.prototype._doDrag = function(iPageY, dTimeStamp) {
			if (this._dragSession) {
				//calculate the distance between the start of the drag and the current touch
				this._dragSession.offsetY = iPageY - this._dragSession.pageY;

				this._dragSession.positions.push({pageY: iPageY, timeStamp: dTimeStamp});
				//to calculate speed we only need the last touch positions
				if (this._dragSession.positions.length > 20) {
					this._dragSession.positions.splice(0, 10);
				}

				//while dragging update the list position inside its container
				this._getSliderContainerDomRef().scrollTop(this._dragSession.startTop - this._dragSession.offsetY);
			}
		};

		/**
		 * Finishes scroll session.
		 *
		 * @param {number} iPageY The last y-coordinate of the target to scroll to
		 * @param {date} dTimeStamp Timestamp of the event
		 * @private
		 */
		TimePickerSlider.prototype._endDrag = function(iPageY, dTimeStamp) {
			if (this._dragSession) {
				var iOffsetTime, iOffsetY;
				//get only the offset calculated including the touches in the last 100ms
				for (var i = this._dragSession.positions.length - 1; i >= 0; i--) {
					iOffsetTime = dTimeStamp - this._dragSession.positions[i].timeStamp;
					iOffsetY = iPageY - this._dragSession.positions[i].pageY;
					if (iOffsetTime > 100) {
						break;
					}
				}

				var fSpeed = (iOffsetY / iOffsetTime);   // px/ms

				if (this._animating) {
					clearInterval(this._intervalId);
					this._intervalId = null;
					this._animating = null;
				}

				this._dragSession = null;
				this._animateScroll(fSpeed);
			}
		};

		/**
		 * Calculates the slider's selection y-offset and margins and selects the corresponding list value.
		 *
		 * @private
		 */
		TimePickerSlider.prototype._afterExpandCollapse = function () {
			var sSelectedValue = this.getSelectedValue();
			//calculate the offset from the top of the list container to the selection frame
			this._selectionOffset =  this._getSelectionFrameTopOffset() - this._getSliderContainerDomRef().offset().top;

			if (!this.getIsCyclic()) {
				var $Slider = this._getSliderContainerDomRef();
				var $List = this.$("content");

				//if we do not cycle the items, we fill the remaining space with margins
				if (this.getIsExpanded()) {
					this._minScrollTop = 0;
					//top margin is as wide as the selection offset
					this._marginTop = this._getSelectionFrameTopOffset() - this._getSliderContainerDomRef().offset().top;
					this._maxScrollTop = this._getItemHeightInPx() * (this.getItems().length - 1);
					//bottom margin allows the bottom of the last item when scrolled down
					//to be aligned with the selection frame - one item offset
					this._marginBottom = $Slider.height() - this._marginTop - this._getItemHeightInPx();
					if (this._marginBottom < 0) { //android native
						this._marginBottom = this.$().height() - this._marginTop - this._getItemHeightInPx();
					}

					//update top,bottom margins
					$List.css("margin-top", this._marginTop);
					//bottom margin leaves
					$List.css("margin-bottom", this._marginBottom);
				} else {
					$List.css("margin-top", 0);
					this._marginBottom = this.$().height() - this._getItemHeightInPx();
					$List.css("margin-bottom", this._marginBottom);
					//increase the bottom margin so the list can scroll to its last value
				}

				this._selectionOffset = 0;
			}

			if (!this.getIsExpanded()) {
				this._selectionOffset = 0;
			}

			this.setSelectedValue(sSelectedValue);
		};

		/**
		 * Handles the cycle effect of the slider's list items.
		 *
		 * @param iContainerHeight {number} Height of the slider container
		 * @param iContentHeight {number} Height of the slider content
		 * @param iTop {number} Current top position
		 * @param fDragMargin {number} Remaining scroll limit
		 * @param iContentRepeatNumber {number} Content repetition counter
		 * @returns {number} Newly calculated top position
		 * @private
		 */
		TimePickerSlider.prototype._getUpdatedCycleScrollTop = function(iContainerHeight, iContentHeight, iTop, fDragMargin, iContentRepeatNumber) {
			if (this._bIsDrag) {
				var fContentHeight = iContentHeight - iTop - iContainerHeight;

				if (fContentHeight < fDragMargin) {
					iTop = iTop - iContentHeight / iContentRepeatNumber;
				}

				//they are not exclusive, we depend on a content long enough
				if (iTop < fDragMargin) {
					iTop = iTop + iContentHeight / iContentRepeatNumber;
				}
			}

			return iTop;
		};

		/**
		 * Calculates the index of the snapped element and selects it.
		 *
		 * @param iCurrentItem {number} Index of the selected item
		 * @private
		 */
		TimePickerSlider.prototype._scrollerSnapped = function(iCurrentItem) {
			var iSelectedItemIndex = iCurrentItem + this._getSelectionFrameIndex(),
				sNewValue;

			while (iSelectedItemIndex >= this.getItems().length) {
				iSelectedItemIndex = iSelectedItemIndex - this.getItems().length;
			}

			if (!this.getIsCyclic()) {
				iSelectedItemIndex = iCurrentItem;
			}

			sNewValue = this.getItems()[iSelectedItemIndex].getKey();

			this.setSelectedValue(sNewValue);
		};

		/**
		 * Updates the scrolltop value to be on the center of the slider.
		 *
		 * @private
		 */
		TimePickerSlider.prototype._updateScroll = function() {
			var sSelectedValue = this.getSelectedValue();
			if (sSelectedValue !== this.getItems()[0].getKey()
				&& this._getSliderContainerDomRef().scrollTop() + (this._selectionOffset ? this._selectionOffset : 0) === 0) {
				this.setSelectedValue(sSelectedValue);
			}
		};

		/**
		 * Adds CSS class to the selected slider item.
		 *
		 * @private
		 */
		TimePickerSlider.prototype._addSelectionStyle = function() {
			var $aItems = this.$("content").find("li"),
				sSelectedItemText = $aItems.eq(this._iSelectedItemIndex).text(),
				sAriaLabel = fnFindKeyByText.call(this, sSelectedItemText);

			$aItems.eq(this._iSelectedItemIndex).addClass("sapMTimePickerItemSelected").attr("aria-selected", "true");
			//WAI-ARIA region
			document.getElementById(this.getId() + "-valDescription").setAttribute("aria-label", sAriaLabel);
		};

		/**
		 * Removes CSS class to the selected slider item.
		 *
		 * @private
		 */
		TimePickerSlider.prototype._removeSelectionStyle = function() {
			var $aItems = this.$("content").find("li");
			$aItems.eq(this._iSelectedItemIndex).removeClass("sapMTimePickerItemSelected").attr("aria-selected", "false");
		};

		/**
		 * Attaches all needed events to the slider.
		 *
		 * @private
		 */
		TimePickerSlider.prototype._attachEvents = function () {
			var oElement = this._getSliderContainerDomRef()[0],
				oDevice = sap.ui.Device;

			if (oDevice.support.touch) {
				//Attach touch events
				oElement.addEventListener("touchstart", jQuery.proxy(onTouchStart, this), false);
				oElement.addEventListener("touchmove", jQuery.proxy(onTouchMove, this), false);
				document.addEventListener("touchend", jQuery.proxy(onTouchEnd, this), false);
			} else {
				//Attach mouse events
				oElement.addEventListener("mousedown", jQuery.proxy(onMouseDown, this), false);
				document.addEventListener("mousemove", jQuery.proxy(onMouseMove, this), false);
				document.addEventListener("mouseup", jQuery.proxy(onMouseUp, this), false);
			}
		};

		/**
		 * Detaches all attached events to the slider.
		 *
		 * @private
		 */
		TimePickerSlider.prototype._detachEvents = function () {
			var oElement = this.getDomRef(),
				oDevice = sap.ui.Device;

			if (oDevice.support.touch) {
				//Detach touch events
				oElement.removeEventListener("touchstart", jQuery.proxy(onTouchStart, this), false);
				oElement.removeEventListener("touchmove", jQuery.proxy(onTouchMove, this), false);
				document.removeEventListener("touchend", jQuery.proxy(onTouchEnd, this), false);
			} else {
				//Detach mouse events
				oElement.removeEventListener("mousedown", jQuery.proxy(onMouseDown, this), false);
				oElement.removeEventListener("mousemove", jQuery.proxy(onMouseMove, this), false);
				document.removeEventListener("mouseup", jQuery.proxy(onMouseUp, this), false);
			}
		};

		/**
		 * Helper function which enables selecting a slider item with an index offset.
		 *
		 * @param iIndexOffset {number} The index offset to be scrolled to
		 * @private
		 */
		TimePickerSlider.prototype._offsetValue = function(iIndexOffset) {
			var iScrollTop = this._getSliderContainerDomRef().scrollTop(),
				iItemHeight = this._getItemHeightInPx(),
				iSnapScrollTop = iScrollTop + iIndexOffset * iItemHeight,
				bCycle = this.getIsCyclic(),
				oThat = this,
				iSelIndex,
				iSnapAnimationDuration = 200; //ms

			if (!bCycle) {
				if (iSnapScrollTop > this._maxScrollTop) {
					iSnapScrollTop = this._maxScrollTop;
				}

				if (iSnapScrollTop < this._minScrollTop) {
					iSnapScrollTop = this._minScrollTop;
				}
			}

			iSelIndex = this._iSelectedItemIndex + iIndexOffset - this._getSelectionFrameIndex();

			if (!this.getIsCyclic()) {
				iSelIndex = this._iSelectedItemIndex + iIndexOffset;

				if (iSelIndex < 0 || iSelIndex >= this.getItems().length) {
					return;
				}
			}

			this._animatingSnap = true;
			this._getSliderContainerDomRef().animate({ scrollTop: iSnapScrollTop}, iSnapAnimationDuration, 'linear', function() {
				oThat._getSliderContainerDomRef().clearQueue();
				oThat._animatingSnap = false;
				oThat._scrollerSnapped(iSelIndex);
			});
		};

		TimePickerSlider.prototype._initArrows = function() {
			var that = this, oArrowUp, oArrowDown;

			oArrowUp = new sap.ui.core.Icon({
				src: IconPool.getIconURI("slim-arrow-up"),
				press: function (oEvent) {
					that._offsetValue(-1);
				}
			});
			oArrowUp.addEventDelegate({
				onAfterRendering: function () {
					oArrowUp.$().attr("tabindex", -1);
				}
			});

			this.setAggregation("_arrowUp", oArrowUp);

			oArrowDown = new sap.ui.core.Icon({
				src: IconPool.getIconURI("slim-arrow-down"),
				press: function (oEvent) {
					that._offsetValue(1);
				}
			});

			oArrowDown.addStyleClass("sapMTimePickerItemArrowDown");
			oArrowDown.addEventDelegate({
				onAfterRendering: function () {
					oArrowDown.$().attr("tabindex", -1);
				}
			});

			this.setAggregation("_arrowDown", oArrowDown);
		};

		/**
		 * Finds the index of an element, satisfying provided predicate.
		 *
		 * @param {array} aArray The array to be predicted
		 * @param {function} fnPredicate Testing function
		 * @returns {number} The index in the array, if an element in the array satisfies the provided testing function
		 * @private
		 */
		function findIndexInArray(aArray, fnPredicate) {
			if (aArray == null) {
				throw new TypeError('findIndex called with null or undefined array');
			}
			if (typeof fnPredicate !== 'function') {
				throw new TypeError('predicate must be a function');
			}

			var iLength = aArray.length;
			var fnThisArg = arguments[1];
			var vValue;

			for (var iIndex = 0; iIndex < iLength; iIndex++) {
				vValue = aArray[iIndex];
				if (fnPredicate.call(fnThisArg, vValue, iIndex, aArray)) {
					return iIndex;
				}
			}
			return -1;
		}

		/**
		 * Default onTouchStart handler.
		 * @param oEvent {jQuery.Event} Event object
		 */
		var onTouchStart = function(oEvent) {
			this._bIsDrag = false;

			if (!this.getIsExpanded()) {
				return;
			}

			this._removeSelectionStyle();
			this._stopAnimation();
			this._startDrag(oEvent.touches[0].pageY);

			oEvent.preventDefault();
			this._mousedown = true;
		};

		/**
		 * Default onTouchMove handler.
		 * @param oEvent {jQuery.Event} Event object
		 */
		var onTouchMove = function(oEvent) {
			if (!this._mousedown || !this.getIsExpanded()) {
				return;
			}

			//galaxy s5 android 5.0 fires touchmove every time - so see if it's far enough to call it a drag
			if (!this._bIsDrag && this._dragSession && this._dragSession.positions.length) {
				//there is a touch at least 5px away vertically from the initial touch
				var bFarEnough = this._dragSession.positions.some(function(pos) {
					return Math.abs(pos.pageY - oEvent.touches[0].pageY) > 5;
				});

				if (bFarEnough) {
					this._bIsDrag = true;
				}
			}

			this._doDrag(oEvent.touches[0].pageY, oEvent.timeStamp);

			this._mousedown = true;
		};

		/**
		 * Default onTouchEnd handler.
		 * @param oEvent {jQuery.Event} Event object
		 */
		var onTouchEnd = function(oEvent) {
			if (this._bIsDrag === false) {
				this.fireTap(oEvent);
				this._dragSession = null;
			}

			this._bIsDrag = true;

			if (!this.getIsExpanded()) {
				this._dragSession = null;
				return;
			}

			this._endDrag(oEvent.changedTouches[0].pageY, oEvent.timeStamp);

			this._mousedown = false;
		};

		/**
		 * Default onMouseDown handler.
		 * @param oEvent {jQuery.Event} Event object
		 */
		var onMouseDown = function(oEvent) {
			this._bIsDrag = false;

			if (!this.getIsExpanded()) {
				return;
			}


			this._removeSelectionStyle();
			this._stopAnimation();
			this._startDrag(oEvent.pageY);

			this._mousedown = true;
		};

		/**
		 * Default onMouseMove handler.
		 * @param oEvent {jQuery.Event} Event object
		 */
		var onMouseMove = function(oEvent) {
			if (!this._mousedown || !this.getIsExpanded()) {
				return;
			}

			if (!this._bIsDrag && this._dragSession && this._dragSession.positions.length) {
				var bFarEnough = this._dragSession.positions.some(function(pos) {
					return Math.abs(pos.pageY - oEvent.pageY) > 5;
				});

				if (bFarEnough) {
					this._bIsDrag = true;
				}
			}

			this._doDrag(oEvent.pageY, oEvent.timeStamp);

			this._mousedown = true;
		};

		/**
		 * Default onMouseUp handler.
		 * @param oEvent {jQuery.Event} Event object
		 */
		var onMouseUp = function(oEvent) {
			if (this._bIsDrag === false) {
				this.fireTap(oEvent);
				this._dragSession = null;
			}

			this._bIsDrag = true;

			if (!this.getIsExpanded()) {
				this._dragSession = null;
				return;
			}

			this._endDrag(oEvent.pageY, oEvent.timeStamp);

			this._mousedown = false;
		};

		var fnFindKeyByText = function(sText) {
			var aItems = this.getItems();

			var index = findIndexInArray(aItems, function(el) {
				return el.getText() === sText;
			});

			return aItems[index].getKey();
		};

		return TimePickerSlider;

	}, /* bExport= */ false);
