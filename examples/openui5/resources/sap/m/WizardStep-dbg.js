/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(["./library", "sap/ui/core/Control"],
	function (library, Control) {

	"use strict";

	/**
	 * Constructor for a new WizardStep.
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * The WizardStep is a container control which should be used mainly to aggregate user input controls.
	 * It gives the developer the ability to validate, invalidate the step and define subsequent steps.
	 * Note: The WizardStep control control is supposed to be used only as an aggregation of the Wizard control,
	 * and should not be used as a standalone one.
	 * @extends sap.ui.core.Control
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @since 1.30
	 * @alias sap.m.WizardStep
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var WizardStep = Control.extend("sap.m.WizardStep", /** @lends sap.m.Wizard.prototype */ {
		metadata: {
			properties: {
				/**
				 * Determines the title of the step.
				 * The title is visualized in the Wizard control.
				 */
				title: {type: "string", group: "appearance", defaultValue: ""},
				/**
				 * Determines the icon that is displayed for this step.
				 * The icon is visualized in the progress navigation part of the Wizard control.
				 * <b>Note:</b> In order for the icon to be displayed, each step in the Wizard should have
				 * this property defined, otherwise the default numbering will be displayed.
				 */
				icon: {type: "sap.ui.core.URI", group: "Appearance", defaultValue: ""},
				/**
				 * Indicates whether or not the step is validated.
				 * When a step is validated a Next button is visualized in the Wizard control.
				 */
				validated: {type: "boolean", group: "Behavior", defaultValue: true}
			},
			events: {
				/**
				 * This event is fired after the user presses the Next button in the Wizard,
				 * or on <code>nextStep</code> method call from the app developer.
				 */
				complete: {
					parameters: {}
				},
				/**
				 * This event is fired on next step activation from the Wizard.
				 */
				activate: {
					parameters: {}
				}
			},
			defaultAggregation: "content",
			aggregations: {
				/**
				 * The content of the Wizard Step.
				 */
				content: {type: "sap.ui.core.Control", multiple: true, singularName: "content"}
			},
			associations: {
				/**
				 * This association is used only when the <code>enableBranching</code> property of the Wizard is set to true.
				 * Use the association to store the next steps that are about to come after the current.
				 * If this is going to be a final step - leave this association empty.
				 */
				subsequentSteps : {type : "sap.m.WizardStep", multiple : true, singularName : "subsequentStep"},
				/**
				 * The next step to be taken after the step is completed.
				 * Set this association value in the complete event of the current WizardStep.
				 */
				nextStep : {type: "sap.m.WizardStep", multiple: false}
			}
		}
	});

	WizardStep.prototype.setValidated = function (validated) {
		this.setProperty("validated", validated, true);

		var parent = this._getWizardParent();
		if (parent === null) {
			return this;
		}

		if (validated) {
			parent.validateStep(this);
		} else {
			parent.invalidateStep(this);
		}

		return this;
	};

	WizardStep.prototype._isLeaf = function () {
		if ( this.getNextStep() === null && this.getSubsequentSteps().length === 0 ) {
			return true;
		}
		return false;
	};

	WizardStep.prototype._isBranched = function () {
		return this.getSubsequentSteps().length > 1;
	};


	WizardStep.prototype._getNextStepReference = function () {
		if (this.getNextStep() !== null) {
			return sap.ui.getCore().byId(this.getNextStep());
		}

		if (this.getSubsequentSteps().length === 1) {
			return sap.ui.getCore().byId(this.getSubsequentSteps[0]);
		}

		return null;
	};

	WizardStep.prototype._containsSubsequentStep = function (stepId) {
		return this.getSubsequentSteps().some(function (step) { return step === stepId; });
	};

	WizardStep.prototype._getWizardParent = function () {
		var parent = this.getParent();

		while (!(parent instanceof sap.m.Wizard)) {
			if (parent === null) {
				return null;
			}
			parent = parent.getParent();
		}

		return parent;
	};

	WizardStep.prototype._markAsLast = function () {
		this.addStyleClass("sapMWizardLastActivatedStep");
	};

	WizardStep.prototype._unMarkAsLast = function () {
		this.removeStyleClass("sapMWizardLastActivatedStep");
	};

	WizardStep.prototype._activate = function () {
		if (this.hasStyleClass("sapMWizardStepActivated")) {
			return;
		}

		this._markAsLast();
		this.addStyleClass("sapMWizardStepActivated");
		this.fireActivate();
	};

	WizardStep.prototype._deactivate = function () {
		this.removeStyleClass("sapMWizardStepActivated");
	};

	WizardStep.prototype._complete = function () {
		this._unMarkAsLast();
		this.fireComplete();
	};

	return WizardStep;

}, /* bExport= */ true);
