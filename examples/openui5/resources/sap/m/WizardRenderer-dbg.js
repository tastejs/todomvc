/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define([], function () {
	"use strict";

	var WizardRenderer = {};

	WizardRenderer.render = function (oRm, oWizard) {
		this.startWizard(oRm, oWizard);
		this.renderProgressNavigator(oRm, oWizard);
		this.renderWizardSteps(oRm, oWizard);
		this.renderNextButton(oRm, oWizard);
		this.endWizard(oRm);
	};

	WizardRenderer.startWizard = function (oRm, oWizard) {
		oRm.write("<article");
		oRm.writeControlData(oWizard);
		oRm.addClass("sapMWizard");
		oRm.writeClasses();
		oRm.addStyle("width", oWizard.getWidth());
		oRm.addStyle("height", oWizard.getHeight());
		oRm.writeStyles();
		oRm.write(">");
	};

	WizardRenderer.renderProgressNavigator = function (oRm, oWizard) {
		oRm.write("<header class='sapMWizardHeader'>");
		oRm.renderControl(oWizard.getAggregation("_progressNavigator"));
		oRm.write("</header>");
	};

	WizardRenderer.renderWizardSteps = function (oRm, oWizard) {
		oRm.write("<section class='sapMWizardStepContainer'");
		oRm.writeAttribute("id", oWizard.getId() + "-step-container");
		oRm.write(">");

		oWizard.getSteps().forEach(oRm.renderControl);

		oRm.write("</section>");
	};

	WizardRenderer.renderNextButton = function (oRm, oWizard) {
		oRm.renderControl(oWizard.getAggregation("_nextButton"));
	};

	WizardRenderer.endWizard = function (oRm) {
		oRm.write("</article>");
	};

	return WizardRenderer;

}, /* bExport= */ true);
