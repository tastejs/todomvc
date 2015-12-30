/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.m.PagingButton.
sap.ui.define(['jquery.sap.global', './Button', 'sap/ui/core/Control', 'sap/ui/core/IconPool'],
	function (jQuery, Button, Control, IconPool) {
		"use strict";

		/**
		 * Constructor for a new PagingButton.
		 *
		 * @param {string} [sId] id for the new control, generated automatically if no id is given
		 * @param {object} [mSettings] initial settings for the new control
		 *
		 * @class
		 * Enables users to navigate between items/entities.
		 * @extends sap.ui.core.Control
		 *
		 * @author SAP SE
		 * @version 1.32.9
		 *
		 * @constructor
		 * @public
		 * @since 1.30
		 * @alias sap.m.PagingButton
		 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
		 */
		var PagingButton = Control.extend("sap.m.PagingButton", {

			metadata: {
				library: "sap.m",
				properties: {

					/**
					 * The total count of items/entities that the control navigates through.
					 * Minimum number of items/entities is 1.
					 */
					count: {type: "int", group: "Data", defaultValue: 1},

					/**
					 * The current position in the items/entities that the control navigates through. One-based.
					 * Minimum position number is 1.
					 */
					position: {type: "int", group: "Data", defaultValue: 1}
				},
				aggregations: {
					previousButton: {type: "sap.m.Button", multiple: false, visibility: "hidden"},
					nextButton: {type: "sap.m.Button", multiple: false, visibility: "hidden"}
				},
				events: {

					/**
					 * This event is fired when the current position is changed
					 */
					positionChange: {
						parameters: {

							/**
							 * The number of the new position. One-based.
							 */
							newPosition: {type: "int"},

							/**
							 * The number of the old position. One-based.
							 */
							oldPosition: {type: "int"}
						}
					}
				}
			}
		});

		PagingButton.prototype.init = function () {
			this._attachPressEvents();
		};

		PagingButton.prototype.onBeforeRendering = function () {
			this._enforceValidPosition(this.getPosition());
			this._updateButtonState();
		};

		/**
		 * This function lazily retrieves the nextButton
		 * @returns {sap.m.Button}
		 */
		PagingButton.prototype._getNextButton = function () {
			if (!this.getAggregation("nextButton")) {
				this.setAggregation("nextButton", new sap.m.Button({
					icon: IconPool.getIconURI("slim-arrow-down"),
					enabled: false,
					id: this.getId() + "-nextButton"
				}));
			}

			return this.getAggregation("nextButton");
		};

		/**
		 * This function lazily retrieves the previousButton
		 * @returns {sap.m.Button}
		 */
		PagingButton.prototype._getPreviousButton = function () {
			if (!this.getAggregation("previousButton")) {
				this.setAggregation("previousButton", new sap.m.Button({
					icon: IconPool.getIconURI("slim-arrow-up"),
					enabled: false,
					id: this.getId() + "-previousButton"
				}));
			}

			return this.getAggregation("previousButton");
		};

		PagingButton.prototype._attachPressEvents = function () {
			this._getPreviousButton().attachPress(this._handlePositionChange.bind(this, false));
			this._getNextButton().attachPress(this._handlePositionChange.bind(this, true));
		};

		/**
		 * This function handles the position change
		 * @params {boolean} bIncrease - Indicates the direction of the change of position
		 * @returns {sap.m.PagingButton} Reference to the control instance for chaining
		 */
		PagingButton.prototype._handlePositionChange = function (bIncrease) {
			var iOldPosition = this.getPosition(),
				iNewPosition = bIncrease ? iOldPosition + 1 : iOldPosition - 1;

			this.setPosition(iNewPosition);
			this.firePositionChange({newPosition: iNewPosition, oldPosition: iOldPosition});
			this._updateButtonState();
			return this;
		};

		/**
		 * Sets the appropriate state (enabled/disabled) for the buttons based on the total count / position
		 * @returns {sap.m.PagingButton} Reference to the control instance for chaining
		 */
		PagingButton.prototype._updateButtonState = function () {
			var iTotalCount = this.getCount(),
				iCurrentPosition = this.getPosition();

			this._getPreviousButton().setEnabled(iCurrentPosition > 1);
			this._getNextButton().setEnabled(iCurrentPosition < iTotalCount);
			return this;
		};

		PagingButton.prototype.setPosition = function (iPosition) {
			return this._validateProperty("position", iPosition);
		};

		PagingButton.prototype.setCount = function (iCount) {
			return this._validateProperty("count", iCount);
		};

		/**
		 * Validate both the count/position properties and ensure they are correct
		 * @params {string} sProperty - The property to be checked, {number} iValue - The value to be checked
		 * @returns {sap.m.PagingButton} Reference to the control instance for chaining
		 */
		PagingButton.prototype._validateProperty = function (sProperty, iValue) {
			if (iValue < 1) {
				jQuery.sap.log.warning("Property '" + sProperty + "' must be greater or equal to 1", this);
				return this;
			}

			return this.setProperty(sProperty, iValue);
		};

		/**
		 * Validates the position property to ensure that it's not set higher than the total count
		 * @params {number} iPosition
		 * @returns {sap.m.PagingButton} Reference to the control instance for chaining
		 */
		PagingButton.prototype._enforceValidPosition = function (iPosition) {
			var iCount = this.getCount();

			if (iPosition > iCount) {
				jQuery.sap.log.warning("Property position must be less or equal to the total count");
				this.setPosition(iCount);
			}

			return this;
		};

		return PagingButton;

	}, /* bExport= */ true);