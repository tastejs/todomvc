/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(["./library", "sap/ui/core/Control", "sap/ui/core/delegate/ItemNavigation", "jquery.sap.global"],
function (library, Control, ItemNavigation, jQuery) {
	"use strict";

	/**
	 * Constructor for a new WizardProgressNavigator.
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * The WizardProgressNavigator is used mainly for displaying the number of steps in the Wizard control.
	 * It provides a way to navigate between those steps by clicking on each separate step.
	 * Note: This is a private control that is instatiated and controlled by the Wizard control.
	 * @extends sap.ui.core.Control
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @private
	 * @since 1.30
	 * @alias sap.m.WizardProgressNavigator
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var WizardProgressNavigator = Control.extend("sap.m.WizardProgressNavigator", { metadata: {
		properties: {

			/**
			 * Sets the total number of steps.
			 * Minimum number of steps is 3.
			 * Maximum number of steps is 8.
			 */
			stepCount: {type: "int", group: "Data", defaultValue: 3},

			/**
			 * Sets a title to be displayed for each step.
			 * The title for each step is visible on hover.
			 */
			stepTitles: {type: "string[]", group: "Appearance", defaultValue: []},

			/**
			 * Sets an icon to be displayed for each step.
			 * The icon for each step is directly visible in the WizardProgressNavigator.
			 * <b>Note:</b> The number of icons should equal the number of steps,
			 * otherwise no icons will be rendered.
			 */
			stepIcons: {type: "sap.ui.core.URI[]", group: "Appearance", defaultValue: []},

			/**
			* Indicates that number of steps can vary.
			* A dashed line is displayed after the last concrete step (set by the <code>stepCount</code> property).
			*/
			varyingStepCount: {type: "boolean", group: "Appearance", defaultValue: false}
		},
		events: {

			/**
			 * This event is fired when the current step changes.
			 */
			stepChanged: {
				parameters: {

					/**
					* The number of the previous step. One-based.
					*/
					previous: {type: "int"},

					/**
					* The number of the current step. One-based.
					*/
					current: {type: "int"}
				}
			},

			/**
			 * This event is fired when a new step is activated.
			 */
			stepActivated: {
				parameters: {

					/**
					* The number of the activated step. One-based.
					*/
					index: {type: "int"}
				}
			}
		}
	}});

	WizardProgressNavigator.CONSTANTS = {
		MINIMUM_STEPS: 3,
		MAXIMUM_STEPS: 8
	};

	WizardProgressNavigator.CLASSES = {
		NAVIGATION: "sapMWizardProgressNav",
		LIST: "sapMWizardProgressNavList",
		STEP: "sapMWizardProgressNavStep",
		ANCHOR: "sapMWizardProgressNavAnchor",
		SEPARATOR: "sapMWizardProgressNavSeparator",
		ICON: "sapMWizardProgressNavIcon"
	};

	WizardProgressNavigator.ATTRIBUTES = {
		STEP: "data-sap-ui-wpn-step",
		STEP_COUNT: "data-sap-ui-wpn-step-count",
		CURRENT_STEP: "data-sap-ui-wpn-step-current",
		ACTIVE_STEP: "data-sap-ui-wpn-step-active",
		OPEN_SEPARATOR: "data-sap-ui-wpn-separator-open",
		ARIA_LABEL: "aria-label",
		ARIA_DISABLED: "aria-disabled"
	};

	WizardProgressNavigator.TEXT = {
		SELECTED: "WIZARD_PROG_NAV_SELECTED",
		PROCESSED: "WIZARD_PROG_NAV_PROCESSED",
		STEP: "WIZARD_PROG_NAV_STEP_TITLE"
	};

	WizardProgressNavigator.prototype.init = function () {
		this._currentStep = 1;
		this._activeStep = 1;
		this._cachedSteps = null;
		this._cachedSeparators = null;
		this._resourceBundle = sap.ui.getCore().getLibraryResourceBundle("sap.m");
		this._createAnchorNavigation();
	};

	WizardProgressNavigator.prototype.onBeforeRendering = function () {
		// show no icons if an icon is not defined for each step
		if (this.getStepCount() !== this.getStepIcons().filter(String).length) {
			this.setStepIcons([]);
		}
	};

	WizardProgressNavigator.prototype.onAfterRendering = function () {
		var zeroBasedActiveStep = this._activeStep - 1,
			zeroBasedCurrentStep = this._currentStep - 1;

		this._cacheDOMElements();
		this._updateStepZIndex();
		this._updateSeparatorsOpenAttribute();

		this._updateAnchorNavigation(zeroBasedActiveStep);
		this._updateStepActiveAttribute(zeroBasedActiveStep);
		this._removeAnchorAriaDisabledAttribute(zeroBasedActiveStep);

		this._updateStepCurrentAttribute(zeroBasedCurrentStep);
		this._updateAnchorAriaLabelAttribute(zeroBasedCurrentStep);
	};

	/**
	 * Returns the number of the currently selected step. One-based.
	 * @returns {number} The currently selected step.
	 * @public
	 */
	WizardProgressNavigator.prototype.getCurrentStep = function () {
		return this._currentStep;
	};

	/**
	 * Moves the selection backwards by one step.
	 * @returns {sap.m.WizardProgressNavigator} Pointer to the control instance for chaining.
	 * @public
	 */
	WizardProgressNavigator.prototype.previousStep = function () {
		var currentStep = this.getCurrentStep();

		if (currentStep < 2) {
			return this;
		}

		return this._moveToStep(currentStep - 1);
	};

	/**
	 * Moves the selection forwards by one step.
	 * @returns {sap.m.WizardProgressNavigator} Pointer to the control instance for chaining.
	 * @public
	 */
	WizardProgressNavigator.prototype.nextStep = function () {
		return this._moveToStep(this.getCurrentStep() + 1);
	};

	/**
	 * Moves the selection forwards to the next step that requires input.
	 * @returns {sap.m.WizardProgressNavigator} Pointer to the control instance for chaining.
	 * @public
	 */
	WizardProgressNavigator.prototype.incrementProgress = function () {
		return this._moveToStep(this.getProgress() + 1);
	};

	/**
	 * Returns the number of the last step that still requires input.
	 * @returns {number} The last step that still requires input.
	 * @public
	 */
	WizardProgressNavigator.prototype.getProgress = function () {
		return this._activeStep;
	};

	/**
	 * Discards all input done after the step which is being edited.
	 * @param {number} index - The index after which all input will be discarded. One-based.
	 * @returns {void}
	 * @public
	 */
	WizardProgressNavigator.prototype.discardProgress = function (index) {
		if (index <= 0 || index > this._activeStep) {
			return this;
		}

		this._updateCurrentStep(index, this._currentStep);

		this._updateStepActiveAttribute(index - 1, this._activeStep - 1);
		this._addAnchorAriaDisabledAttribute(index - 1);
		this._updateAnchorNavigation(index - 1);

		this._currentStep = index;
		this._activeStep = index;
	};

	WizardProgressNavigator.prototype._setOnEnter = function (fnCallback) {
		this._onEnter = fnCallback;
	};

	WizardProgressNavigator.prototype.ontap = function (event) {
		if (!(this._isIcon(event.target) || this._isAnchor(event.target)) ||
			!this._isActiveStep(this._getStepNumber(event.target))) {
			return;
		}

		this._updateCurrentStep(this._getStepNumber(event.target));
	};

	WizardProgressNavigator.prototype.onsapspace = function (event) {
		if (this._onEnter) {
			this._onEnter(event, this._anchorNavigation.getFocusedIndex());
		}
		this.ontap(event);
	};

	WizardProgressNavigator.prototype.onsapenter = WizardProgressNavigator.prototype.onsapspace;

	WizardProgressNavigator.prototype.exit = function () {
		this.removeDelegate(this._anchorNavigation);
		this._anchorNavigation.destroy();
		this._anchorNavigation = null;
		this._currentStep = null;
		this._activeStep = null;
		this._cachedSteps = null;
		this._cachedSeparators = null;
	};

	/**
	 * Creates an ItemNavigation delegate for navigating between active anchors.
	 * @private
	 */
	WizardProgressNavigator.prototype._createAnchorNavigation = function () {
		var that = this;
		this._anchorNavigation = new ItemNavigation();
		this._anchorNavigation.setCycling(false);
		this._anchorNavigation.attachEvent("AfterFocus", function (params) {
			var event = params.mParameters.event;
			if (!event || !event.relatedTarget || jQuery(event.relatedTarget).hasClass(WizardProgressNavigator.CLASSES.ANCHOR)) {
				return;
			}

			that._anchorNavigation.focusItem(that._currentStep - 1);
		});
		this.addDelegate(this._anchorNavigation);
	};

	/**
	 * Caches a reference to the DOM elements which represent the steps and the separators.
	 * Cached reference is in the form of static NodeList retrieved using querySelectorAll method.
	 * @returns {void}
	 * @private
	 */
	WizardProgressNavigator.prototype._cacheDOMElements = function () {
		var domRef = this.getDomRef();

		this._cachedSteps = domRef.querySelectorAll("." + WizardProgressNavigator.CLASSES.STEP);
		this._cachedSeparators = domRef.querySelectorAll("." + WizardProgressNavigator.CLASSES.SEPARATOR);
	};

	/**
	 * Sets z-index to all steps so that they stack in the correct order on phone.
	 * The leftmost step after the current step is with the highest z-index
	 * while the rightmost is with the lowest z-index.
	 * @returns {void}
	 * @private
	 */
	WizardProgressNavigator.prototype._updateStepZIndex = function () {
		var zeroBasedCurrentStep = this._currentStep - 1,
			stepsLength = this._cachedSteps.length,
			zIndex = WizardProgressNavigator.CONSTANTS.MAXIMUM_STEPS;

		for (var i = 0; i < stepsLength; i++) {
			if (i <= zeroBasedCurrentStep) {
				this._cachedSteps[i].style.zIndex = 0;
			} else {
				this._cachedSteps[i].style.zIndex = zIndex;
				zIndex -= 1;
			}
		}
	};

	/**
	 * Sets the data-sap-ui-wpn-separator-open attribute to true based on the current step.
	 * For step 1 we need 3 open separators after it.
	 * For steps 2 to the penultimate step we need 1 open separator before and 2 after the step.
	 * For the penultimate and ultimate step we need the last 3 separators open.
	 * @returns {void}
	 * @private
	 */
	WizardProgressNavigator.prototype._updateSeparatorsOpenAttribute = function () {
		var separatorsLength = this._cachedSeparators.length,
			startIndex,
			endIndex;

		if (this._currentStep === 1) {
			startIndex = 0;
			endIndex = 2;
		} else if (this._currentStep > 1 && this._currentStep < separatorsLength) {
			startIndex = this._currentStep - 2;
			endIndex = this._currentStep;
		} else {
			startIndex = separatorsLength - 3;
			endIndex = separatorsLength - 1;
		}

		for (var i = 0; i < separatorsLength; i++) {
			if (startIndex <= i && i <= endIndex) {
				this._cachedSeparators[i]
					.setAttribute(WizardProgressNavigator.ATTRIBUTES.OPEN_SEPARATOR, true);
			} else {
				this._cachedSeparators[i]
					.removeAttribute(WizardProgressNavigator.ATTRIBUTES.OPEN_SEPARATOR);
			}
		}
	};

	/**
	 * Allows focus on active anchors.
	 * @param  {number} index The index of the last focusable anchor. Zero-based.
	 * @private
	 */
	WizardProgressNavigator.prototype._updateAnchorNavigation = function (index) {
		var navDomRef = this.getDomRef(),
			focusableAnchors = [];

		for (var i = 0; i <= index; i++) {
			focusableAnchors.push(this._cachedSteps[i].children[0]);
		}

		this._anchorNavigation.setRootDomRef(navDomRef);
		this._anchorNavigation.setItemDomRefs(focusableAnchors);
		this._anchorNavigation.setPageSize(index);
		this._anchorNavigation.setFocusedIndex(index);
	};

	/**
	 * Updates the step active attribute in the DOM structure of the Control.
	 * @param {number} newIndex The new index at which the attribute should be set. Zero-based.
	 * @param {number} oldIndex The old index at which the attribute was set. Zero-based.
	 * @returns {void}
	 * @private
	 */
	WizardProgressNavigator.prototype._updateStepActiveAttribute = function (newIndex, oldIndex) {
		if (oldIndex !== undefined) {
			this._cachedSteps[oldIndex]
				.removeAttribute(WizardProgressNavigator.ATTRIBUTES.ACTIVE_STEP);
		}

		this._cachedSteps[newIndex]
			.setAttribute(WizardProgressNavigator.ATTRIBUTES.ACTIVE_STEP, true);
	};

	/**
	 * Updates the step current attribute in the DOM structure of the Control.
	 * @param {number} newIndex The new index at which the attribute should be set. Zero-based.
	 * @param {number} oldIndex The old index at which the attribute was set. Zero-based.
	 * @returns {void}
	 * @private
	 */
	WizardProgressNavigator.prototype._updateStepCurrentAttribute = function (newIndex, oldIndex) {
		if (oldIndex !== undefined) {
			this._cachedSteps[oldIndex]
				.removeAttribute(WizardProgressNavigator.ATTRIBUTES.CURRENT_STEP);
		}

		this._cachedSteps[newIndex]
			.setAttribute(WizardProgressNavigator.ATTRIBUTES.CURRENT_STEP, true);
	};

	/**
	 * Adds aria-disabled attribute to all anchors after the specified index.
	 * @param {number} index The index from which to add aria-disabled=true. Zero-based.
	 * @returns {void}
	 * @private
	 */
	WizardProgressNavigator.prototype._addAnchorAriaDisabledAttribute = function (index) {
		var stepsLength = this._cachedSteps.length,
			anchor;

		for (var i = index + 1; i < stepsLength; i++) {
			anchor = this._cachedSteps[i].children[0];

			anchor.setAttribute(WizardProgressNavigator.ATTRIBUTES.ARIA_DISABLED, true);
			anchor.removeAttribute(WizardProgressNavigator.ATTRIBUTES.ARIA_LABEL);
		}
	};

	/**
	 * Removes the anchor aria-disabled attribute from the DOM structure of the Control.
	 * @param {number} index The index at which the attribute should be removed. Zero-based.
	 * @returns {void}
	 * @private
	 */
	WizardProgressNavigator.prototype._removeAnchorAriaDisabledAttribute = function (index) {
		this._cachedSteps[index].children[0]
			.removeAttribute(WizardProgressNavigator.ATTRIBUTES.ARIA_DISABLED);
	};

	/**
	 * Updates the anchor aria-label attribute in the DOM structure of the Control.
	 * @param {number} newIndex The new index at which the attribute should be set. Zero-based.
	 * @param {number} oldIndex The old index at which the attribute was set. Zero-based.
	 * @returns {void}
	 * @private
	 */
	WizardProgressNavigator.prototype._updateAnchorAriaLabelAttribute = function (newIndex, oldIndex) {
		if (oldIndex !== undefined) {
			this._cachedSteps[oldIndex].children[0]
				.setAttribute(
					WizardProgressNavigator.ATTRIBUTES.ARIA_LABEL,
					this._resourceBundle.getText(WizardProgressNavigator.TEXT.PROCESSED));
		}

		this._cachedSteps[newIndex].children[0]
			.setAttribute(
				WizardProgressNavigator.ATTRIBUTES.ARIA_LABEL,
				this._resourceBundle.getText(WizardProgressNavigator.TEXT.SELECTED));
	};

	/**
	 * Move to the specified step while updating the current step and active step.
	 * @param {number} newStep The step number to which current step will be set. Non zero-based.
	 * @returns {sap.m.WizardProgressNavigator} Pointer to the control instance for chaining.
	 * @private
	 */
	WizardProgressNavigator.prototype._moveToStep = function (newStep) {
		var	stepCount = this.getStepCount(),
			oldStep = this.getCurrentStep();

		if (newStep > stepCount) {
			return this;
		}

		if (newStep > this._activeStep) {
			this._updateActiveStep(newStep);
		}

		return this._updateCurrentStep(newStep, oldStep);
	};

	/**
	 * Updates the active step in the control instance as well as the DOM structure.
	 * @param {number} newStep The step number to which active step will be set. Non zero-based.
	 * @param {number} oldStep The step number to which active step was set. Non zero-based.
	 * @returns {sap.m.WizardProgressNavigator} Pointer to the control instance for chaining.
	 * @private
	 */
	WizardProgressNavigator.prototype._updateActiveStep = function (newStep, oldStep) {
		var zeroBasedNewStep = newStep - 1,
			zeroBasedOldStep = (oldStep || this._activeStep) - 1;

		this._activeStep = newStep;
		this._updateAnchorNavigation(zeroBasedNewStep);
		this._removeAnchorAriaDisabledAttribute(zeroBasedNewStep);
		this._updateStepActiveAttribute(zeroBasedNewStep, zeroBasedOldStep);

		return this.fireStepActivated({index: newStep});
	};

	/**
	 * Updates the current step in the control instance as well as the DOM structure.
	 * @param {number} newStep The step number to which current step will be set. Non zero-based.
	 * @param {number} oldStep The step number to which current step was set. Non zero-based.
	 * @returns {sap.m.WizardProgressNavigator} Pointer to the control instance for chaining.
	 * @private
	 */
	WizardProgressNavigator.prototype._updateCurrentStep = function (newStep, oldStep) {
		var zeroBasedNewStep = newStep - 1,
			zeroBasedOldStep = (oldStep || this.getCurrentStep()) - 1;

		this._currentStep = newStep;
		this._updateStepZIndex();
		this._updateSeparatorsOpenAttribute();
		this._updateStepCurrentAttribute(zeroBasedNewStep, zeroBasedOldStep);
		this._updateAnchorAriaLabelAttribute(zeroBasedNewStep, zeroBasedOldStep);

		return this.fireStepChanged({
			previous: oldStep,
			current: newStep
		});
	};

	/**
	 * Checks whether the argument has sapMWizardProgressNavAnchor class present.
	 * @param {HTMLElement} domTarget The target of the click/tap event.
	 * @returns {boolean} Returns true when sapMWizardProgressNavAnchor class is present, false otherwise.
	 * @private
	 */
	WizardProgressNavigator.prototype._isAnchor = function (domTarget) {
		return domTarget.className.indexOf(WizardProgressNavigator.CLASSES.ANCHOR) !== -1;
	};

	/**
	 * Checks whether the argument has sapMWizardProgressNavIcon class present.
	 * @param {HTMLElement} domTarget The target of the click/tap event.
	 * @returns {boolean} Returns true when sapMWizardProgressNavIcon class is present, false otherwise.
	 * @private
	 */
	WizardProgressNavigator.prototype._isIcon = function (domTarget) {
		return domTarget.className.indexOf(WizardProgressNavigator.CLASSES.ICON) !== -1;
	};

	/**
	 * Checks whether the step is active.
	 * @param {number} iStep The step number to be checked.
	 * @returns {boolean} Returns true when the step number has been activated, false otherwise.
	 * @private
	 */
	WizardProgressNavigator.prototype._isActiveStep = function (stepNumber) {
		return stepNumber <= this._activeStep;
	};

	/**
	 * Extracts the step attribute from the argument.
	 * @param {HTMLElement} domAnchor The dom element which represents the anchor tag in each step.
	 * @returns {number} Returns parsed step number.
	 * @private
	 */
	WizardProgressNavigator.prototype._getStepNumber = function (domAnchor) {
		var stepNumber = jQuery(domAnchor)
						.closest("." + WizardProgressNavigator.CLASSES.STEP)
						.attr(WizardProgressNavigator.ATTRIBUTES.STEP);

		return parseInt(stepNumber, 10);
	};

	return WizardProgressNavigator;

});
