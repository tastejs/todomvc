/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(function () {

	"use strict";

	var WizardStepRenderer = {};

	WizardStepRenderer.render = function (oRm, oStep) {
		this.startWizardStep(oRm, oStep);
		this.renderWizardStepTitle(oRm, oStep.getTitle());
		this.renderContent(oRm, oStep.getContent());
		this.endWizardStep(oRm);
	};

	WizardStepRenderer.startWizardStep = function (oRm, oStep) {
		oRm.write("<article");
		oRm.writeControlData(oStep);
		oRm.addClass("sapMWizardStep");
		oRm.writeClasses();
		oRm.write(">");
	};

	WizardStepRenderer.renderWizardStepTitle = function (oRm, sTitle) {
		oRm.write("<h3 class='sapMWizardStepTitle'>");
		oRm.writeEscaped(sTitle);
		oRm.write("</h3>");
	};

	WizardStepRenderer.renderContent = function (oRm, aChildren) {
		aChildren.forEach(oRm.renderControl);
	};

	WizardStepRenderer.endWizardStep = function (oRm) {
		oRm.write("</article>");
	};

	return WizardStepRenderer;

}, /* bExport= */ true);
