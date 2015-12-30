/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.commons.Slider.
sap.ui.define(['jquery.sap.global', './library', 'sap/ui/core/Control', 'sap/ui/core/EnabledPropagator', 'sap/ui/core/ResizeHandler'],
	function(jQuery, library, Control, EnabledPropagator, ResizeHandler) {
	"use strict";



	/**
	 * Constructor for a new <code>Slider</code>.
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * The interactive control is displayed either as a horizontal or a vertical line with a pointer and units of measurement.
	 * Users can move the pointer along the line to change values with graphical support.
	 * @extends sap.ui.core.Control
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @alias sap.ui.commons.Slider
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var Slider = Control.extend("sap.ui.commons.Slider", /** @lends sap.ui.commons.Slider.prototype */ { metadata : {

		library : "sap.ui.commons",
		properties : {

			/**
			 * Width of the horizontal slider.
			 */
			width : {type : "sap.ui.core.CSSSize", group : "Dimension", defaultValue : '100%'},

			/**
			 * Minimal value of the slider.
			 *
			 * <b>Note:</b> If <code>min</code> is larger than <code>max</code> both values will be switched
			 */
			min : {type : "float", group : "Appearance", defaultValue : 0},

			/**
			 * Maximal value of the slider
			 *
			 * <b>Note:</b> If <code>min</code> is larger than <code>max</code> both values will be switched
			 */
			max : {type : "float", group : "Appearance", defaultValue : 100},

			/**
			 * Current value of the slider. (Position of the grip.)
			 *
			 * <b>Note:</b> If the value is not in the valid range (between <code>min</code> and <code>max</code>) it will be changed to be in the valid range.
			 */
			value : {type : "float", group : "Appearance", defaultValue : 50},

			/**
			 * The grip can only be moved in steps of this width.
			 */
			smallStepWidth : {type : "float", group : "Appearance", defaultValue : null},

			/**
			 * Number of units that are displayed by ticks. The PageUp and PageDown keys navigate according to these units.
			 */
			totalUnits : {type : "int", group : "Appearance", defaultValue : null},

			/**
			 * Display step numbers for the ticks on the slider.
			 */
			stepLabels : {type : "boolean", group : "Appearance", defaultValue : false},

			/**
			 * Using the slider interactively requires value "true".
			 */
			editable : {type : "boolean", group : "Behavior", defaultValue : true},

			/**
			 * Switches enabled state of the control. Disabled fields have different colors, and can not be focused.
			 */
			enabled : {type : "boolean", group : "Behavior", defaultValue : true},

			/**
			 * Labels to be displayed instead of numbers. Attribute totalUnits and label count should be the same
			 *
			 * <b>Note:</b> To show the labels <code>stepLabels</code> must be activated.
			 */
			labels : {type : "string[]", group : "Misc", defaultValue : null},

			/**
			 * Orientation of slider
			 * @since 1.7.1
			 */
			vertical : {type : "boolean", group : "Appearance", defaultValue : false},

			/**
			 * Height of the vertical slider.
			 * @since 1.7.1
			 */
			height : {type : "sap.ui.core.CSSSize", group : "Dimension", defaultValue : '100%'}
		},
		associations : {

			/**
			 * Association to controls / IDs which describe this control (see WAI-ARIA attribute aria-describedby).
			 */
			ariaDescribedBy : {type : "sap.ui.core.Control", multiple : true, singularName : "ariaDescribedBy"}, 

			/**
			 * Association to controls / IDs which label this control (see WAI-ARIA attribute aria-labelledby).
			 */
			ariaLabelledBy : {type : "sap.ui.core.Control", multiple : true, singularName : "ariaLabelledBy"}
		},
		events : {

			/**
			 * Value was changed. This event is fired if the value has changed by an user action.
			 */
			change : {
				parameters : {

					/**
					 * Current value of the slider after a change.
					 */
					value : {type : "float"}
				}
			},

			/**
			 * Value was changed. This event is fired during the mouse move. The normal change event is only fired by mouseup.
			 */
			liveChange : {
				parameters : {

					/**
					 * Current value of the slider after a change.
					 */
					value : {type : "float"}
				}
			}
		}
	}});


	EnabledPropagator.call(Slider.prototype);

	Slider.prototype.exit = function() {
		// Cleanup resize event registration on exit
		if (this.sResizeListenerId) {
			ResizeHandler.deregister(this.sResizeListenerId);
			this.sResizeListenerId = null;
		}
	};

	Slider.prototype.onBeforeRendering = function() {
		// Cleanup resize event registration before re-rendering
		if (this.sResizeListenerId) {
			ResizeHandler.deregister(this.sResizeListenerId);
			this.sResizeListenerId = null;
		}

		// Warning in the case of wrong properties
		var fMin = this.getMin();
		var fMax = this.getMax();
		if ( fMin > fMax ) {
			jQuery.sap.log.warning('Property wrong: Min:' + fMin + ' > Max:' + fMax + '; values switched', this);
			this.setMin(fMax);
			this.setMax(fMin);
			fMax = fMin;
			fMin = this.getMin();
		}

	};

	Slider.prototype.onAfterRendering = function () {

		this.oGrip = this.getDomRef("grip");
		this.oBar  = this.getDomRef("bar");
		this.oHiLi = this.getDomRef("hili");
		this.bRtl  = sap.ui.getCore().getConfiguration().getRTL();
		this.bAcc  = sap.ui.getCore().getConfiguration().getAccessibility();
		this.bTextLabels = (this.getLabels() && this.getLabels().length > 0);
		this.oMovingGrip = this.oGrip;

		if (this.bTextLabels && (this.getLabels().length - 1) != this.getTotalUnits()) {
			jQuery.sap.log.warning('label count should be one more than total units', this);
		}

		this.iDecimalFactor = this.calcDecimalFactor(this.getSmallStepWidth());

		// Get left shift for middle of grip. Use offsetWidth to include borders. Round to prevent calculation errors.
		this.iShiftGrip = Math.round(this.getOffsetWidth(this.oGrip) / 2);

		// Calculate grip position
		var fValue = this.getValue();
		var fMin = this.getMin();
		var fMax = this.getMax();
		if ( fValue > fMax ) {
			jQuery.sap.log.warning('Property wrong: value:' + fValue + ' > Max:' + fMax + '; value set to Max', this);
			fValue = fMax;
		} else if ( fValue < fMin ) {
			jQuery.sap.log.warning('Property wrong: value:' + fValue + ' < Min:' + fMin + '; value set to Min', this);
			fValue = fMin;
		}

		var iNewPos = ( fValue - this.getMin() ) / ( this.getMax() - this.getMin() ) * this.getBarWidth();

		if (this.bRtl || this.getVertical()) {
			iNewPos = this.getBarWidth() - iNewPos;
		}

		// Move grip to hit the point in the middle
		this.changeGrip(fValue, iNewPos, this.oGrip);

		this.repositionTicksAndLabels();

		// Disable text selection
		this.allowTextSelection(false);

		// Register resize event
		this.oDomRef = this.getDomRef();
		this.sResizeListenerId = ResizeHandler.register(this.oDomRef, jQuery.proxy(this.onresize, this));

	};

	/**
	 * Function is called when Slider is clicked.
	 *
	 * @param {jQuery.Event} oEvent The event object
	 * @private
	 */
	Slider.prototype.onclick = function(oEvent) {

		var oMovingGrip = this.oMovingGrip;

		if (this.getEditable() && this.getEnabled()) {

			var fMultiplicator;

			// Check for ID where the behavior depends on the clicked area.
			var sMyTargetId = oEvent.target.getAttribute( 'ID' );
			var fNewValue = this.getValue();
			var iNewPos   = this.getOffsetLeft(this.oGrip) + this.iShiftGrip;
			var iTickPos  = 0;
			var iOffsetBar = 0;
			var iOffsetMe  = 0;

			switch ( sMyTargetId ) {
				case ( this.oBar.id ):
				case ( this.oHiLi.id ):
					// Click on slide bar
					if (this.getVertical()) {
						fMultiplicator = this.getBarWidth() - this.getOffsetX(oEvent);
					} else {
						fMultiplicator = this.getOffsetX(oEvent);
					}
					if (sMyTargetId == this.oHiLi.id) {
						if (this.getVertical()) {
							fMultiplicator -= this.getOffsetLeft(this.oHiLi);
						} else {
							fMultiplicator += this.getOffsetLeft(this.oHiLi);
						}
					}
					fNewValue = this.convertRtlValue(this.getMin() + ( ( ( this.getMax() - this.getMin() )  / this.getBarWidth() ) * fMultiplicator ));
					iNewPos = this.getOffsetX(oEvent);
					if (sMyTargetId == this.oHiLi.id) {
						iNewPos += this.getOffsetLeft(this.oHiLi);
					}
					if (this.oStartTarget && this.targetIsGrip(this.oStartTarget.id)) {
						oMovingGrip = this.oStartTarget;
					} else if (this.targetIsGrip(sMyTargetId)) {
						oMovingGrip = oEvent.target;
					} else {
						oMovingGrip = this.getNearestGrip(iNewPos);
					}
					break;
				case ( this.getId() + '-left' ):
					// Click on left end
					iNewPos = 0;
					if (this.getVertical()) {
						fNewValue = this.getMax();
						oMovingGrip = this.getRightGrip();
					} else {
						fNewValue = this.getMin();
						oMovingGrip = this.getLeftGrip();
					}
					break;
				case ( this.getId() + '-right' ):
					// Click on right end
					iNewPos = this.getBarWidth();
					if (!this.getVertical()) {
						fNewValue = this.getMax();
						oMovingGrip = this.getRightGrip();
					} else {
						fNewValue = this.getMin();
						oMovingGrip = this.getLeftGrip();
					}
					break;
				default:
					//If target is grip return
					//Not implemented as case because RangeSlider has multiple grips, for which cases cannot be inserted afterwards
					if (this.targetIsGrip(sMyTargetId)) {
						return;
					}
					// Check whether tick is clicked
					iTickPos = sMyTargetId.search('-tick');
					if ( iTickPos >= 0) {
						var iTickNum = parseInt( sMyTargetId.slice( this.getId().length + 5), 10);
						iNewPos = this.fTickDist * iTickNum;
						var iTotalUnits;
						if (this.bTextLabels) {
							iTotalUnits = this.getLabels().length - 1;
						} else {
							iTotalUnits = this.getTotalUnits();
						}
						fNewValue = this.convertRtlValue(this.getMin() + ( ( ( this.getMax() - this.getMin() ) / iTotalUnits ) * iTickNum ));
						if (this.oStartTarget && this.targetIsGrip(this.oStartTarget.id)) {
							oMovingGrip = this.oStartTarget;
						} else if (this.targetIsGrip(sMyTargetId)) {
							oMovingGrip = oEvent.target;
						} else {
							oMovingGrip = this.getNearestGrip(iNewPos);
						}
						break;
					}

					// Outer DIV clicked -> ID given by caller. This is the case if all other DIVs are smaller,
					// or if tick text is clicked
					iOffsetBar = jQuery(this.oBar).offset();
					iOffsetMe  = jQuery(oEvent.target).offset();
					if (this.getVertical()) {
						iNewPos = this.getOffsetX(oEvent) - ( iOffsetBar.top - iOffsetMe.top );
					} else {
						iNewPos = this.getOffsetX(oEvent) - ( iOffsetBar.left - iOffsetMe.left );
					}
					/* eslint-disable no-lonely-if */
					if ( iNewPos <= 0 ) {
						iNewPos = 0;
						if (this.getVertical()) {
							fNewValue = this.getMax();
						} else {
							fNewValue = this.getMin();
						}
					} else {
						if ( iNewPos >= this.getBarWidth() ) {
							iNewPos = this.getBarWidth();
							if (this.getVertical()) {
								fNewValue = this.getMin();
							} else {
								fNewValue = this.getMax();
							}
						} else {
							if (this.getVertical()) {
								fMultiplicator = this.getBarWidth() - iNewPos;
							} else {
								fMultiplicator = iNewPos;
							}
							fNewValue = this.getMin() + ( ( ( this.getMax() - this.getMin() )  / this.getBarWidth() ) * fMultiplicator );
						}
					}
					fNewValue = this.convertRtlValue(fNewValue);
					if (this.oStartTarget && this.targetIsGrip(this.oStartTarget.id)) {
						oMovingGrip = this.oStartTarget;
					} else if (this.targetIsGrip(sMyTargetId)) {
						oMovingGrip = oEvent.target;
					} else {
						oMovingGrip = this.getNearestGrip(iNewPos);
					}
					break;
			}

			var validation = this.validateNewPosition(fNewValue, iNewPos, oMovingGrip, (this.getValueForGrip(oMovingGrip) > fNewValue));
			fNewValue = validation.fNewValue;
			iNewPos = validation.iNewPos;

			this.changeGrip(fNewValue, iNewPos, oMovingGrip);
			this.handleFireChange();
		}

		// Set focus to grip
		oMovingGrip.focus();
		this.oMovingGrip = oMovingGrip;
		this.oStartTarget = null;

	};

	/**
	 * Function is called when Slider is clicked
	 *
	 * @param {jQuery.Event} oEvent The event object
	 * @private
	 */
	Slider.prototype.onmousedown = function(oEvent) {

		if (this.getEditable() && this.getEnabled() && !this._cancelMousedown) {

			// Check for ID. This is only possible on the grip.
			var sMyTargetId = oEvent.target.getAttribute( 'ID' );

			if ( this.targetIsGrip(sMyTargetId) ) {
				this.bGripMousedown = true;

				// Remember start coordinates
				if (oEvent.targetTouches) {
					this.iStartDragX = oEvent.targetTouches[0].pageX;
					this.iStartDragY = oEvent.targetTouches[0].pageY;
				} else {
					this.iStartDragX = oEvent.pageX;
					this.iStartDragY = oEvent.pageY;
				}

				this.iStartLeft  = this.getOffsetLeft(oEvent.target) + this.iShiftGrip;

				this.oMovingGrip = oEvent.target;

				var that = this;
				this.handleMoveCall = function (event){
					that.handleMove(event);
				};
				this.preventSelect = function (event){
					return false;
				};

				if (!oEvent.targetTouches) {
					jQuery(window.document).bind('mousemove', this.handleMoveCall);
					jQuery(window.document).bind('selectstart', this.preventSelect);
					jQuery.sap.bindAnyEvent(jQuery.proxy(this.onAnyEvent, this));
				}
			}
			this.oStartTarget = null;
		}
	};

	Slider.prototype.ontouchstart = function(oEvent) {

		if ( (oEvent.originalEvent && jQuery.sap.startsWith(oEvent.originalEvent.type, "mouse")) ||
		     (oEvent.handleObj && jQuery.sap.startsWith(oEvent.handleObj.origType, "mouse"))) {
			// ignore simulated touch events (if mouse events are available use them)
			return;
		}

		this._cancelMousedown = false;

		this.onmousedown(oEvent);

		this._cancelMousedown = true;

	};

	/**
	 * Function is called when Slider is unclicked
	 *
	 * @param {jQuery.Event} oEvent The event object
	 * @private
	 */
	Slider.prototype.onmouseup = function(oEvent) {

		if (this.getEditable() && this.getEnabled()) {
			// Mouseup is handled on every div, not only on grip

			this.bGripMousedown = false;

			if (this.handleMoveCall) {
				jQuery(window.document).unbind('mousemove', this.handleMoveCall);
				jQuery(window.document).unbind('selectstart', this.preventSelect);
				jQuery.sap.unbindAnyEvent(this.onAnyEvent);

				if ( this.iStartLeft != ( this.getOffsetLeft(this.oMovingGrip) + this.iShiftGrip )) {
					// Only if position was changed
					// only fire change event because liveChange is already fired in handleMove
					this.handleFireChange(true); // without liveChange
				}

				this.handleMoveCall = null;
				this.iStartDragX    = null;
				this.iStartDragY    = null;
				this.iStartLeft     = null;
			}
		}

	};

	Slider.prototype.ontouchend = function(oEvent) {

		if ( (oEvent.originalEvent && jQuery.sap.startsWith(oEvent.originalEvent.type, "mouse")) ||
		     (oEvent.handleObj && jQuery.sap.startsWith(oEvent.handleObj.origType, "mouse"))) {
			// ignore simulated touch events (if mouse events are available use them)
			return;
		}

		this.onmouseup(oEvent);

	};

	/**
	 * Function is called when Slider is moved
	 *
	 * @param {DOM.Event} event The event object
	 * @returns {boolean} return value for event
	 * @private
	 */
	Slider.prototype.handleMove = function(event) {

		if (this.getEditable() && this.getEnabled() && this.bGripMousedown ) {

			event = event || window.event;

			// Move is handled on every div, not only on grip

			var iPageX, iPageY;
			if (event.targetTouches) {
				iPageX = event.targetTouches[0].pageX;
				iPageY = event.targetTouches[0].pageY;
			} else {
				iPageX = event.pageX;
				iPageY = event.pageY;
			}

			var iNewPos;
			var fNewValue;
			if (this.getVertical()) {
				iNewPos = this.iStartLeft + iPageY - this.iStartDragY;
			} else {
				iNewPos = this.iStartLeft + iPageX - this.iStartDragX;
			}

			/* eslint-disable no-lonely-if */
			if ( iNewPos <= 0 ) {
				iNewPos = 0;
				if (this.getVertical()) {
					fNewValue = this.getMax();
				} else {
					fNewValue = this.getMin();
				}
			} else {
				if ( iNewPos >= this.getBarWidth() ) {
					iNewPos = this.getBarWidth();
					if (this.getVertical()) {
						fNewValue = this.getMin();
					} else {
						fNewValue = this.getMax();
					}
				} else {
					var fMultiplicator;
					if (this.getVertical()) {
						fMultiplicator = this.getBarWidth() - iNewPos;
					} else {
						fMultiplicator = iNewPos;
					}
					fNewValue = this.getMin() + ( ( ( this.getMax() - this.getMin() )  / this.getBarWidth() ) * fMultiplicator );
				}
			}
			fNewValue = this.convertRtlValue(fNewValue);
			var fOldValue = this.getValueForGrip(this.oMovingGrip);

			var validation = this.validateNewPosition(fNewValue, iNewPos, this.oMovingGrip, (fOldValue > fNewValue));
			fNewValue = validation.fNewValue;
			iNewPos = validation.iNewPos;

			this.changeGrip(fNewValue, iNewPos, this.oMovingGrip);
			fNewValue = this.getValueForGrip(this.oMovingGrip); // get new value considering step width

			this.fireLiveChangeForGrip(this.oMovingGrip, fNewValue, fOldValue);
			this.oStartTarget = this.oMovingGrip;
		}

		event.cancelBubble = true;

		return false;

	};

	Slider.prototype.ontouchmove = function(oEvent) {

		if ( (oEvent.originalEvent && jQuery.sap.startsWith(oEvent.originalEvent.type, "mouse")) ||
		     (oEvent.handleObj && jQuery.sap.startsWith(oEvent.handleObj.origType, "mouse"))) {
			// ignore simulated touch events (if mouse events are available use them)
			return;
		}

		this.handleMove(oEvent);

		oEvent.preventDefault();

	};

	/**
	 * Function is called when Slider is moved
	 *
	 * @param {Element} oGrip DOM-Ref of grip
	 * @param {float} fNewValue new value
	 * @param {float} fOldValue old value
	 * @private
	 */
	Slider.prototype.fireLiveChangeForGrip = function (oGrip, fNewValue, fOldValue) {
		if (oGrip == this.oGrip) {
			if ( fOldValue != fNewValue ) {
				// fire event only if value changed
				this.fireLiveChange( { value: fNewValue } );
			}
		}
	};

	/**
	 * Handles all events that occur outside the Popup and
	 * dispatches it to the onOuterEvent
	 * @param {jQuery.EventObject} oEvent The event object of the ui.core framework
	 * @private
	 */
	Slider.prototype.onAnyEvent = function (oEvent) {

		jQuery.sap.log.info('onAnyEvent fired: "' + oEvent.type + '"');

		// Skip if not editable or no drag operation in progress
		if ((!this.getEditable()) || (!this.getEnabled()) || !this.bGripMousedown) {
			return;
		}

		// Check if outside of control
		var oSource = oEvent.target;
		if ((!jQuery.sap.containsOrEquals(this.oDomRef,oSource) || oSource.tagName == "BODY") && oEvent.type == 'mouseup') {
			this.onmouseup(oEvent);
		}

	};

	/**
	 * Function is called when right arrow is pressed
	 *
	 * @param {jQuery.Event} oEvent The event object
	 * @private
	 */
	Slider.prototype.onsapright = function(oEvent) {

		if (this.getEditable() && this.getEnabled()) {

			var fNewValue = this.convertRtlValue(this.getValueForGrip(this.oMovingGrip));
			var iNewPos   = this.getOffsetLeft(this.oMovingGrip) + this.iShiftGrip;

			if (this.getSmallStepWidth() > 0) {
				// Step defined -> shift grip one step; at least one pixel, if step < 1px
				var fStepPixel = this.getBarWidth() / ( this.getMax() - this.getMin() ) * this.getSmallStepWidth();

				if (fStepPixel > 1) {
					fNewValue = fNewValue + this.getSmallStepWidth();
					if (this.getVertical()) {
						iNewPos   = iNewPos - fStepPixel;
					} else {
						iNewPos   = iNewPos + fStepPixel;
					}
				} else {
					// Step < 1px -> shift grip to next step that is 1 pixel away
					fNewValue = fNewValue + ( 1 / fStepPixel * this.getSmallStepWidth() );
					if (this.getVertical()) {
						iNewPos   = iNewPos - 1;
					} else {
						iNewPos   = iNewPos + 1;
					}
				}
			} else {
				// No step defined -> shift grip 1 pixel
				fNewValue = fNewValue + ( ( this.getMax() - this.getMin() ) / this.getBarWidth() );
				if (this.getVertical()) {
					iNewPos   = iNewPos - 1;
				} else {
					iNewPos   = iNewPos + 1;
				}
			}
			fNewValue = this.convertRtlValue(fNewValue);

			var validation = this.validateNewPosition(fNewValue, iNewPos, this.oMovingGrip, !this.getVertical() && this.bRtl);
			fNewValue = validation.fNewValue;
			iNewPos = validation.iNewPos;

			this.changeGrip(fNewValue, iNewPos, this.oMovingGrip);
			this.handleFireChange();

		}

		oEvent.preventDefault();
		oEvent.stopPropagation();
	};

	/**
	 * Function is called when left arrow is pressed
	 *
	 * @param {jQuery.Event} oEvent The event object
	 * @private
	 */
	Slider.prototype.onsapleft = function(oEvent) {

		if (this.getEditable() && this.getEnabled()) {

			var fNewValue = this.convertRtlValue(this.getValueForGrip(this.oMovingGrip));
			var iNewPos   = this.getOffsetLeft(this.oMovingGrip) + this.iShiftGrip;

			if (this.getSmallStepWidth() > 0) {
				// Step defined -> shift grip one step (at least one pixel, if step < 1px)
				var fStepPixel = this.getBarWidth() / ( this.getMax() - this.getMin() ) * this.getSmallStepWidth();

				if (fStepPixel > 1) {
					fNewValue = fNewValue - this.getSmallStepWidth();
					if (this.getVertical()) {
						iNewPos   = iNewPos + fStepPixel;
					} else {
						iNewPos   = iNewPos - fStepPixel;
					}
				} else {
					fNewValue = fNewValue - ( 1 / fStepPixel * this.getSmallStepWidth() );
					if (this.getVertical()) {
						iNewPos   = iNewPos + 1;
					} else {
						iNewPos   = iNewPos - 1;
					}
				}
			} else {
				// No step defined -> shift grip one pixel
				fNewValue = fNewValue - ( ( this.getMax() - this.getMin() ) / this.getBarWidth() );
				if (this.getVertical()) {
					iNewPos   = iNewPos + 1;
				} else {
					iNewPos   = iNewPos - 1;
				}
			}
			fNewValue = this.convertRtlValue(fNewValue);

			var validation = this.validateNewPosition(fNewValue, iNewPos, this.oMovingGrip, this.getVertical() || !this.bRtl);
			fNewValue = validation.fNewValue;
			iNewPos = validation.iNewPos;

			this.changeGrip(fNewValue, iNewPos, this.oMovingGrip);
			this.handleFireChange();

		}

		oEvent.preventDefault();
		oEvent.stopPropagation();
	};

	/**
	 * Function is called when up arrow is pressed
	 *
	 * @param {jQuery.Event} oEvent The event object
	 * @private
	 */
	Slider.prototype.onsapup = function(oEvent) {
		if (this.bRtl && !this.getVertical()) {
			this.onsapleft(oEvent);
		} else {
			this.onsapright(oEvent);
		}
	};

	/**
	 * Function is called when DOWN arrow is pressed
	 *
	 * @param {jQuery.Event} oEvent The event object
	 * @private
	 */
	Slider.prototype.onsapdown = function(oEvent) {
		if (this.bRtl && !this.getVertical()) {
			this.onsapright(oEvent);
		} else {
			this.onsapleft(oEvent);
		}
	};

	/**
	 * Function is called when "+" is pressed
	 *
	 * @param {jQuery.Event} oEvent The event object
	 * @private
	 */
	Slider.prototype.onsapexpand = function(oEvent) {

		if (!this.bRtl) {
			// Normal case - "+" similar to right
			this.onsapright(oEvent);
		} else {
			// RTL case - "+" similar to left
			this.onsapleft(oEvent);
		}

	};

	/**
	 * Function is called when "-" is pressed
	 *
	 * @param {jQuery.Event} oEvent The event object
	 * @private
	 */
	Slider.prototype.onsapcollapse = function(oEvent) {

		if (!this.bRtl) {
			// Normal case - "-" similar to left
			this.onsapleft(oEvent);
		} else {
			// RTL case - "-" similar to right
			this.onsapright(oEvent);
		}

	};

	/**
	 * Function is called when Home key pressed
	 *
	 * @param {jQuery.Event} oEvent The event object
	 * @private
	 */
	Slider.prototype.onsaphome = function(oEvent) {

		if (this.getEditable() && this.getEnabled()) {
			var iNewPos = 0;
			if (this.getVertical() || (this.bRtl && !this.getVertical())) {
				iNewPos = this.getBarWidth();
			}

			this.changeGrip(this.getMin(), iNewPos, this.oMovingGrip);
			this.handleFireChange();
		}

		oEvent.preventDefault();
		oEvent.stopPropagation();
	};

	/**
	 * Function is called when End key pressed
	 *
	 * @param {jQuery.Event} oEvent The event object
	 * @private
	 */
	Slider.prototype.onsapend = function(oEvent) {

		if (this.getEditable() && this.getEnabled()) {
			var iNewPos = this.getBarWidth();
			if (this.getVertical() || (this.bRtl && !this.getVertical())) {
				iNewPos = 0;
			}

			this.changeGrip(this.getMax(), iNewPos, this.oMovingGrip);
			this.handleFireChange();
		}

		oEvent.preventDefault();
		oEvent.stopPropagation();
	};

	/**
	 * Function is called when Ctrl+right key pressed
	 *
	 * @param {jQuery.Event} oEvent The event object
	 * @private
	 */
	Slider.prototype.onsaprightmodifiers = function(oEvent) {

		if (this.getEditable() && this.getEnabled()) {

			if (!this.fPageSize) {
				if (this.getTotalUnits() > 0) {
					this.fPageSize = ( this.getMax() - this.getMin() ) / this.getTotalUnits();
				} else {
					this.fPageSize = ( this.getMax() - this.getMin() ) / 10;
				}
			}

			var fNewValue;
			if (!this.bRtl || this.getVertical()) {
				fNewValue = this.getValueForGrip(this.oMovingGrip) + this.fPageSize;
			} else {
				fNewValue = this.getValueForGrip(this.oMovingGrip) - this.fPageSize;
			}
			// Calculate iNewPos from fNewValue to prevent rounding errors after repeating pageUps
			var iNewPos   = ( fNewValue - this.getMin() ) / ( this.getMax() - this.getMin() ) * this.getBarWidth();
			if (this.bRtl && !this.getVertical()) {
				iNewPos = this.getBarWidth() - iNewPos;
			}

			if (this.getVertical()) {
				if (iNewPos > this.getBarWidth()) {
					iNewPos = this.getBarWidth();
				}
				iNewPos = this.getBarWidth() - iNewPos;
			}

			var validation = this.validateNewPosition(fNewValue, iNewPos, this.oMovingGrip, !this.getVertical() && this.bRtl);
			fNewValue = validation.fNewValue;
			iNewPos = validation.iNewPos;

			this.changeGrip(fNewValue, iNewPos, this.oMovingGrip);
			this.handleFireChange();
		}

		oEvent.preventDefault();
		oEvent.stopPropagation();
	};

	/**
	 * Function is called when Ctrl+left key pressed
	 *
	 * @param {jQuery.Event} oEvent The event object
	 * @private
	 */
	Slider.prototype.onsapleftmodifiers = function(oEvent) {

		if (this.getEditable() && this.getEnabled()) {

			if (!this.fPageSize) {
				if (this.getTotalUnits() > 0) {
					this.fPageSize = ( this.getMax() - this.getMin() ) / this.getTotalUnits();
				} else {
					this.fPageSize = ( this.getMax() - this.getMin() ) / 10;
				}
			}

			var fNewValue;
			if (!this.bRtl || this.getVertical()) {
				fNewValue = this.getValueForGrip(this.oMovingGrip) - this.fPageSize;
			} else {
				fNewValue = this.getValueForGrip(this.oMovingGrip) + this.fPageSize;
			}
			// Calculate iNewPos from fNewValue to prevent rounding errors after repeating pageDowns
			var iNewPos   = ( fNewValue - this.getMin() ) / ( this.getMax() - this.getMin() ) * this.getBarWidth();
			if (this.bRtl && !this.getVertical()) {
				iNewPos = this.getBarWidth() - iNewPos;
			}

			if (this.getVertical()) {
				if (iNewPos < 0) {
					iNewPos = 0;
				}
				iNewPos = this.getBarWidth() - iNewPos;
			}

			var validation = this.validateNewPosition(fNewValue, iNewPos, this.oMovingGrip, this.getVertical() || !this.bRtl);
			fNewValue = validation.fNewValue;
			iNewPos = validation.iNewPos;

			this.changeGrip(fNewValue, iNewPos, this.oMovingGrip);
			this.handleFireChange();
		}

		oEvent.preventDefault();
		oEvent.stopPropagation();
	};

	/**
	 * Function is called when Ctrl+down key pressed
	 *
	 * @param {jQuery.Event} oEvent The event object
	 * @private
	 */
	Slider.prototype.onsapdownmodifiers = function(oEvent) {
		if (this.bRtl && !this.getVertical()) {
			this.onsaprightmodifiers(oEvent);
		} else {
			this.onsapleftmodifiers(oEvent);
		}
	};

	/**
	 * Function is called when Ctrl+Up key pressed
	 *
	 * @param {jQuery.Event} oEvent The event object
	 * @private
	 */
	Slider.prototype.onsapupmodifiers = function(oEvent) {
		if (this.bRtl && !this.getVertical()) {
			this.onsapleftmodifiers(oEvent);
		} else {
			this.onsaprightmodifiers(oEvent);
		}
	};

	/**
	 * Function is called when window is resized
	 *
	 * @param {jQuery.Event} oEvent The event object
	 * @private
	 */
	Slider.prototype.onresize = function(oEvent) {

		if (!this.getDomRef()) {
			// slider is not renderes, maybe deleted from DOM -> deregister resize handler and do nothing
			// Cleanup resize event registration on exit
			if (this.sResizeListenerId) {
				ResizeHandler.deregister(this.sResizeListenerId);
				this.sResizeListenerId = null;
			}
			return;
		}

		// If width of control changed -> grip position must be newly calculated

		var fNewValue = this.getValue();

		var iNewPos   = ( fNewValue - this.getMin() ) / ( this.getMax() - this.getMin() ) * this.getBarWidth();
		if (this.getVertical() || this.bRtl) {
			iNewPos = this.getBarWidth() - iNewPos;
		}

		this.changeGrip(fNewValue, iNewPos, this.oGrip);

		this.repositionTicksAndLabels();

	};

	/*
	 * Resposition ticks and labels
	 *
	 * @private
	 */
	Slider.prototype.repositionTicksAndLabels = function() {
		var iTotalUnits;
		if (this.bTextLabels) {
			iTotalUnits = this.getLabels().length - 1;
		} else {
			iTotalUnits = this.getTotalUnits();
		}

		if (iTotalUnits > 0) {
			// Move ticks to correct position; put it in the middle.
			// Round value shift factor separately to have the same behavior like for the grip position.

			var oTick = null;
			var oText = null;

			this.fTickDist = this.getBarWidth() / iTotalUnits;

			for (var i = 0; i <= iTotalUnits; i++) {
				oTick = jQuery.sap.domById(this.getId() + '-tick' + i);
				var iLeft = 0;
				if (!this.bRtl || this.getVertical()) {
					iLeft = Math.round( this.fTickDist * i ) - Math.ceil( this.getOffsetWidth(oTick) / 2 );
				} else {
					iLeft = Math.round( this.fTickDist * i ) - Math.floor( this.getOffsetWidth(oTick) / 2 );
				}
				if (this.getVertical()) {
					iLeft = this.getBarWidth() - iLeft - this.getOffsetWidth(oTick);
				}
				this.setLeft(iLeft, oTick);

				if ( this.getStepLabels() && i > 0 && i < iTotalUnits) {
					oText = jQuery.sap.domById(this.getId() + '-text' + i);
					if (this.getSmallStepWidth() > 0 && this.iDecimalFactor > 0 && !this.bTextLabels) {
						jQuery(oText).text(Math.round( parseFloat(jQuery(oText).text()) * this.iDecimalFactor ) / this.iDecimalFactor);
					}
					if (!this.bRtl || this.getVertical()) {
						iLeft = Math.round( ( this.fTickDist * i)) - Math.round(( this.getOffsetWidth(oText) / 2) );
					} else {
						iLeft = Math.round( ( this.fTickDist * (iTotalUnits - i))) - Math.round(( this.getOffsetWidth(oText) / 2) );
					}
					if (this.getVertical()) {
						iLeft = this.getBarWidth() - iLeft - this.getOffsetWidth(oText);
					}
					this.setLeft(iLeft, oText);
				}
			}
		}

	};

	/**
	 * Called after the theme has been switched. Some adjustments required.
	 * @param {jQuery.Event} oEvent The event object
	 * @private
	 */
	Slider.prototype.onThemeChanged = function (oEvent) {

		if (this.getDomRef()) {
			// Get left shift for middle of grip. Use offsetWidth to include borders. Round to prevent calculation errors.
			this.iShiftGrip = Math.round(this.getOffsetWidth(this.oGrip) / 2);

			// Use resize function to adjust grip and ticks
			this.onresize();
		}

	};

	/**
	 * Function is called when grip position shall be changed
	 *
	 * @param {float} fNewValue new value
	 * @param {int} iNewPos new position
	 * @param {Element} oGrip DOM-Ref of grip
	 * @private
	 */
	Slider.prototype.changeGrip = function(fNewValue, iNewPos, oGrip) {
		// Only if position was changed
		if ( iNewPos != ( this.getOffsetLeft(oGrip) + this.iShiftGrip ) ) {

			if ( this.getSmallStepWidth() > 0 ) {
				// Move grip according to step-width
				var iStepNum   = parseInt( ( fNewValue - this.getMin() ) / this.getSmallStepWidth() , 10);
				var fLeftStep  = ( iStepNum * this.getSmallStepWidth() ) + this.getMin();
				var fRightStep = ( ( iStepNum + 1 ) * this.getSmallStepWidth() ) + this.getMin();

				if ( fRightStep > this.getMax() ) {
					fRightStep = this.getMax();
				}

				var fStepPixel = this.getBarWidth() / ( this.getMax() - this.getMin() ) * this.getSmallStepWidth();

				if ( ( fNewValue - fLeftStep ) < ( fRightStep - fNewValue ) ) {
					fNewValue = fLeftStep;
					iNewPos   = iStepNum * fStepPixel;
				} else {
					fNewValue = fRightStep;
					iNewPos   = ( iStepNum + 1 ) * fStepPixel;
					if ( iNewPos > this.getBarWidth() ) {
						iNewPos = this.getBarWidth();
					}
				}
				if (this.getVertical() || this.bRtl) {
					iNewPos = this.getBarWidth() - iNewPos;
				}
				// Round value because of calculation errors in JavaScript
				fNewValue = Math.round( fNewValue * this.iDecimalFactor ) / this.iDecimalFactor;
			}

			// Reduce position with half grip-width to center the grip. Round because Internet Explorer does not round automatically.

			var iLeft = Math.round(iNewPos - this.iShiftGrip);
			if (isNaN(iLeft)) {
				return;
			}

			//Output iShiftGrip to check if rendering issue occurs because of wrong value
			jQuery.sap.log.info("iNewPos: " + iNewPos + " - iLeft: " + iLeft + " - iShiftGrip: " + this.iShiftGrip);

			this.updateValueProperty(fNewValue, oGrip);

			if (this.bTextLabels) {
				oGrip.title = this.getNearestLabel(fNewValue);
			} else {
				oGrip.title = fNewValue;
			}

			this.setLeft(iLeft, oGrip);

			this.adjustHighlightBar(iNewPos, oGrip);

			if (this.bAcc) {
				this.setAriaState();
			}
		}

	};

	/**
	 * Function to update value property for grip
	 *
	 * @param {float} fNewValue new value
	 * @param {Element} oGrip DOM-Ref of grip
	 * @private
	 */
	Slider.prototype.updateValueProperty = function(fNewValue,oGrip) {
		this.setProperty( 'value', fNewValue, true ); // Do not render complete control again
	};

	/**
	 * Function to set width and position of highlight bar
	 *
	 * @param {int} iNewPos new position
	 * @param {Element} oGrip DOM-Ref of grip
	 * @private
	 */
	Slider.prototype.adjustHighlightBar = function(iNewPos,oGrip) {

		/* eslint-disable no-lonely-if */
		if (this.bRtl) {
			// In the case of RTL, highlight must be on right side
			if (this.getVertical()) {
				this.oHiLi.style.height = this.getBarWidth() - Math.round(iNewPos) + 'px';
			} else {
				this.oHiLi.style.width = this.getBarWidth() - Math.round(iNewPos) + 'px';
			}
		} else {
			if (this.getVertical()) {
				this.oHiLi.style.height = this.getBarWidth() - Math.round(iNewPos) + 'px';
			} else {
				this.oHiLi.style.width = Math.round(iNewPos) + 'px';
			}
		}
	};

	/**
	 * Function to calculate the decimals of a value
	 *
	 * Problem:  If the step-width has decimals in JavaScript, there are calculation errors.
	 *           e.g. 2.01*10= 20.099999999999998 instead of 20.1
	 *           This is not sufficient as result for the value of sliding step-wise.
	 *           Therefore the value is rounded with the numbers of decimals the step-width has.
	 *           This is not possible using the modulo or any other Math function because
	 *           of the mentioned calculation error.
	 * Solution: The idea is to search for the "." in the string and to calculate the rounding factor.
	 *
	 * @param {string} Value value
	 * @returns {int} decimal factor
	 * @private
	 */
	Slider.prototype.calcDecimalFactor = function(Value) {

		var iFactor = 1;

		if ( !( Value > 0 )) {
			return iFactor;
		}

		var sMyString = String( Value );
		var iMyExp = 0;

		/* eslint-disable no-lonely-if */
		if ( sMyString.indexOf( '.' ) >= 0 ) {
			// Number of decimals = length of all numbers after the "." Subtract the numbers before the "." and the "." itself.
			iMyExp = sMyString.length - sMyString.indexOf( '.' ) - 1;
		} else {
			if ( sMyString.indexOf( 'e-' ) >= 0 ) {
				// Floating point number -> number of decimals is number after "e-"
				iMyExp = sMyString.slice(sMyString.indexOf( 'e-' ) + 2);
			} else {
				return iFactor;
			}
		}

		for (var i = 1; i <= iMyExp; i++) {
			iFactor = iFactor * 10;
		}

		return iFactor;

	};

	/* Overwrite of generated function - no new JS-doc.
	 * Property setter for the editable state
	 *
	 * @param {boolean} bEditable Whether the Slider should be editable, or not (read-only then)
	 * @return {sap.ui.commons.Slider} <code>this</code> to allow method chaining
	 * @public
	 */
	Slider.prototype.setEditable = function(bEditable) {

		this.setProperty('editable', bEditable, true); // No re-rendering

		if (this.oDomRef && this.getEnabled()) {
			// If already rendered, adapt rendered control without complete re-rendering
			if (bEditable) {
				jQuery(this.oDomRef).removeClass('sapUiSliRo').addClass('sapUiSliStd');
				if (this.bAcc) {
					jQuery(this.oGrip).attr('aria-disabled', false);
				}
			} else {
				jQuery(this.oDomRef).removeClass('sapUiSliStd').addClass('sapUiSliRo');
				if (this.bAcc) {
					jQuery(this.oGrip).attr('aria-disabled', true);
				}
			}
		}

		return this;
	};

	/* Overwrite of generated function - no new JS-doc.
	 * Property setter for the enabled state
	 *
	 * @param bEnabled Whether the Slider should be ednabled, or not (disabled)
	 * @return {sap.ui.commons.Slider} <code>this</code> to allow method chaining
	 * @public
	 */
	Slider.prototype.setEnabled = function(bEnabled) {

		this.setProperty('enabled', bEnabled, true); // No re-rendering

		if (this.oDomRef) {
			// If already rendered, adapt rendered control without complete re-rendering
			jQuery(this.oDomRef).toggleClass('sapUiSliDsbl', !bEnabled);
			if ( bEnabled ) {
				jQuery(this.oGrip).attr('tabindex', '0');
				// set classes according editable state
				if (this.getEditable()) {
					jQuery(this.oDomRef).addClass('sapUiSliStd');
					if (this.bAcc) {
						jQuery(this.oGrip).attr('aria-disabled', false);
					}
				} else {
					jQuery(this.oDomRef).addClass('sapUiSliRo');
					if (this.bAcc) {
						jQuery(this.oGrip).attr('aria-disabled', true);
					}
				}
			} else {
				jQuery(this.oGrip).attr('tabindex', '-1').attr('aria-disabled', true);
				if (this.getEditable()) {
					jQuery(this.oDomRef).removeClass('sapUiSliStd');
				} else {
					jQuery(this.oDomRef).removeClass('sapUiSliRo');
				}
			}
		}

		return this;
	};

	/* Overwrite of generated function - no new JS-doc.
	 * Property setter for the totalUnits state
	 *
	 * @param iTotalUnits Number of the units (tick-spaces)
	 * @return {sap.ui.commons.Slider} <code>this</code> to allow method chaining
	 * @public
	 */
	Slider.prototype.setTotalUnits = function(iTotalUnits) {

		this.setProperty('totalUnits', iTotalUnits, false); // Do re-rendering

		// Clear this.fPageSize -> must be re-calculated
		this.fPageSize = false;

		return this;
	};

	/* Overwrite of generated function - no new JS-doc.
	 * Property setter for the value
	 * A new rendering is not necessary, only the grip must be moved.
	 *
	 * @param fValue
	 * @return {sap.ui.commons.Slider} <code>this</code> to allow method chaining
	 * @public
	 */
	Slider.prototype.setValue = function(fValue) {

		this.setProperty('value', fValue, true); // No re-rendering

		this._lastValue = fValue;

		// Check for number -> if NaN -> no change
		if ( isNaN(fValue) ) {
			return this;
		}

		if (!this.oBar) {
			// Not already rendered -> return and render
			return this;
		}

		var fNewValue = parseFloat( fValue );
		var iNewPos;

		if ( fNewValue >= this.getMax() ) {
			fNewValue   = this.getMax();
			if (this.getVertical()) {
				iNewPos = 0;
			} else {
				iNewPos = this.getBarWidth();
			}
		} else if ( fNewValue <= this.getMin() ) {
			fNewValue   = this.getMin();
			if (this.getVertical()) {
				iNewPos = this.getBarWidth();
			} else {
				iNewPos = 0;
			}
		} else {
			iNewPos = ( fNewValue - this.getMin() ) / ( this.getMax() - this.getMin() ) * this.getBarWidth();
		}

		if (this.bRtl && !this.getVertical()) {
			iNewPos = this.getBarWidth() - iNewPos;
		}

		this.changeGrip( fNewValue, iNewPos, this.oGrip );
		this._lastValue = fNewValue;

		return this;

	};

	/*
	 * fires the change event. The liveChange event must be fired too if the change event is fired.
	 *
	 * @param bNoLiveChange fire no LiveChange event
	 * @private
	 */
	Slider.prototype.handleFireChange = function(bNoLiveChange) {

		var iValue = this.getValue();

		if (iValue !== this._lastValue) {
			this.fireChange({value: iValue});
			if (!bNoLiveChange) {
				this.fireLiveChange({value: iValue});
			}
			this._lastValue = iValue;
		}

	};

	/*
	 * Updates the ARIA state initially and in case of changes.
	 *
	 * @private
	 */
	Slider.prototype.setAriaState = function() {

		var fValue = this.getValue();

		if (this.bTextLabels) {
			fValue = this.getNearestLabel(fValue);
		}

		this.oGrip.setAttribute('aria-valuenow', fValue);

	};

	/**
	 * Returns value for specified grip.
	 * This function is for reuse in other sliders like the range slider, which has multiple grips
	 *
	 * @private
	 * @param {Element} oGrip DOM-Ref of grip
	 * @return {float} Value for the grip, which was passed to this function
	 */
	Slider.prototype.getValueForGrip = function(oGrip) {
		return this.getValue();
	};

	/**
	 * Check if new position and new value are valid within the slider
	 *
	 * @private
	 * @param {float} fNewValue new value
	 * @param {int} iNewPos new position
	 * @param {Element} oGrip DOM-Ref of grip
	 * @param {boolean} bMin If true, checks if validation should be done with minimum values, else it uses maximum values
	 * @return {object} oCorrectedData Object with modified data, if validation was not successful
	 */
	Slider.prototype.validateNewPosition = function(fNewValue, iNewPos, oGrip, bMin) {

		/* eslint-disable no-lonely-if */
		if (!this.bRtl || this.getVertical()) {
			if (bMin) {
				if ( fNewValue <= this.getMin() || iNewPos <= 0 ) {
					fNewValue = this.getMin();
					if (this.getVertical()) {
						iNewPos   = this.getBarWidth();
					} else {
						iNewPos   = 0;
					}
				}
			} else {
				if ( fNewValue >= this.getMax() || iNewPos > this.getBarWidth() ) {
					fNewValue = this.getMax();
					if (!this.getVertical()) {
						iNewPos   = this.getBarWidth();
					} else {
						iNewPos   = 0;
					}
				}
			}
		} else {
			if (bMin) {
				if ( fNewValue <= this.getMin() || iNewPos > this.getBarWidth() ) {
					fNewValue = this.getMin();
					iNewPos   = this.getBarWidth();
				}
			} else {
				if ( fNewValue >= this.getMax() || iNewPos <= 0 ) {
					fNewValue = this.getMax();
					iNewPos   = 0;
				}
			}
		}
		return {fNewValue: fNewValue, iNewPos: iNewPos};
	};

	/**
	 * Gets the nearest label (realative to the specified value).
	 *
	 * @private
	 * @param {float} fValue value
	 * @return {string} Text for label
	 */
	Slider.prototype.getNearestLabel = function(fValue) {
		var iPos = Math.round((this.getLabels().length - 1) / (this.getMax() - this.getMin()) * (fValue - this.getMin()));
		if (this.bRtl) {
			iPos = this.getLabels().length - 1 - iPos;
		}
		return this.getLabels()[iPos];
	};

	/**
	 * Function returns nearest grip (if there is more than one grip). There is only one grip for the basic slider
	 *
	 * @private
	 * @param {int} iOffset Offset relative to Bar
	 * @returns {Element} DOM-Ref of grip
	 * 
	 */
	Slider.prototype.getNearestGrip = function(iOffset) {
		return this.oGrip;
	};

	/**
	 * Function returns grip which should by moved after a click on left side
	 *
	 * @returns {Element} DOM-Ref of grip
	 * @private
	 */
	Slider.prototype.getLeftGrip = function() {
		return this.oGrip;
	};

	/**
	 * Function returns grip which should by moved after a click on right side
	 *
	 * @returns {Element} DOM-Ref of grip
	 * @private
	 */
	Slider.prototype.getRightGrip = function() {
		return this.oGrip;
	};

	/**
	 * Set left/top for an object. Translates the value for vertical sldiers and RTL
	 *
	 * @private
	 * @param {int} iNewPos New left attribute for specified object
	 * @param {Element} oObject Dom-Ref
	 */
	Slider.prototype.setLeft = function(iNewPos, oObject) {
		if (oObject == undefined) {
			return;
		}
		if (this.getVertical()) {
			oObject.style.top = iNewPos + 'px';
		} else {
			oObject.style.left = iNewPos + 'px';
		}
	};

	/**
	 * Get offset width/height for specified object. Translates between vertical and horizontal slider
	 *
	 * @param {Element} oObject Dom-Ref
	 * @returns {int} offset height or width
	 * @private
	 */
	Slider.prototype.getOffsetWidth = function(oObject) {
		if (this.getVertical()) {
			return oObject.offsetHeight;
		} else {
			return oObject.offsetWidth;
		}
	};

	/**
	 * Get client width/height
	 *
	 * @returns {int} height or width
	 * @private
	 */
	Slider.prototype.getBarWidth = function() {
		if (this.getVertical()) {
			return this.oBar.clientHeight;
		} else {
			return this.oBar.clientWidth;
		}
	};

	/**
	 * Get offset left/top for specified object. Translates between vertical and horizontal slider
	 *
	 * @param {Element} oObject Dom-Ref
	 * @returns {int} offset
	 * @private
	 */
	Slider.prototype.getOffsetLeft = function(oObject) {
		if (this.getVertical()) {
			return oObject.offsetTop;
		} else {
			return oObject.offsetLeft;
		}
	};

	/**
	 * Get offset for specified event. Translates between vertical and horizontal slider
	 *
	 * @param {jQuery.Event} oEvent The event object
	 * @returns {int} offset
	 * @private
	 */
	Slider.prototype.getOffsetX = function(oEvent) {

		/* eslint-disable no-lonely-if */
		if (this.getVertical()) {
			return oEvent.getOffsetY();
		} else {
			if (this.bRtl) {
				return oEvent.getOffsetX();
			} else {
				return oEvent.getOffsetX();
			}
		}
	};

	/**
	 * convert fNewValue for RTL-Mode
	 *
	 * @param {float} fNewValue input value
	 * @returns {float} output value
	 * @private
	 */
	Slider.prototype.convertRtlValue = function(fNewValue) {
		if (this.bRtl && !this.getVertical()) {
			fNewValue = this.getMax() - fNewValue + this.getMin();
		}
		return fNewValue;
	};

	/**
	 * Check if a specified target is a valid grip
	 *
	 * @param {string} sMyTargetId taget ID
	 * @returns {boolean} flag if target is a valid grip
	 * @private
	 */
	Slider.prototype.targetIsGrip = function(sMyTargetId) {
		if ( sMyTargetId == this.oGrip.id ) {
			return true;
		}
		return false;
	};

	/*
	 * Overrides getFocusDomRef of base element class.
	 * @public
	 */
	Slider.prototype.getFocusDomRef = function() {
		return this.oGrip;
	};

	/*
	 * Overwrites default implementation
	 * the label must point to the grip
	 * @public
	 */
	Slider.prototype.getIdForLabel = function () {
		return this.getId() + '-grip';
	};

	return Slider;

}, /* bExport= */ true);
