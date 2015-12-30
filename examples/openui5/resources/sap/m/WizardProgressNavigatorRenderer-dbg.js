/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(function () {
	"use strict";

	var CLASSES = sap.m.WizardProgressNavigator.CLASSES,
		ATTRIBUTES = sap.m.WizardProgressNavigator.ATTRIBUTES,
		WizardProgressNavigatorRenderer = {};

	WizardProgressNavigatorRenderer.render = function (oRm, oControl) {
		this.startNavigator(oRm, oControl);

		this.renderList(oRm, oControl);

		this.endNavigator(oRm);
	};

	WizardProgressNavigatorRenderer.startNavigator = function (oRm, oControl) {
		oRm.write("<nav");
		oRm.writeControlData(oControl);
		oRm.writeAttribute("class", CLASSES.NAVIGATION);
		oRm.writeAttribute(ATTRIBUTES.STEP_COUNT, oControl.getStepCount());
		oRm.write(">");
	};

	WizardProgressNavigatorRenderer.renderList = function (oRm, oControl) {
		this.startList(oRm);
		this.renderSteps(oRm, oControl);

		if (oControl.getVaryingStepCount()) {
			this.renderSeparator(oRm);
		}

		this.endList(oRm);
	};

	WizardProgressNavigatorRenderer.startList = function (oRm) {
		oRm.write("<ul");
		oRm.writeAttribute("class", CLASSES.LIST);
		oRm.write(">");
	};

	WizardProgressNavigatorRenderer.renderSteps = function (oRm, oControl) {
		var iStepCount = oControl.getStepCount(),
			aStepTitles = oControl.getStepTitles(),
			aStepIcons = oControl.getStepIcons();

		for (var i = 1; i <= iStepCount; i++) {
			this.startStep(oRm, i);
			this.renderAnchor(oRm, i, aStepTitles[i - 1], aStepIcons[i - 1]);
			this.endStep(oRm);

			if (i < iStepCount) {
				this.renderSeparator(oRm);
			}
		}
	};

	WizardProgressNavigatorRenderer.startStep = function (oRm, iStepNumber) {
		oRm.write("<li");
		oRm.writeAttribute("class", CLASSES.STEP);
		oRm.writeAttribute(ATTRIBUTES.STEP, iStepNumber);
		oRm.write(">");
	};

	WizardProgressNavigatorRenderer.renderAnchor = function (oRm, iStepNumber, sStepTitle, sIconUri) {
		oRm.write("<a tabindex='-1' aria-disabled='true'");
		oRm.writeAttribute("class", CLASSES.ANCHOR);
		oRm.writeAttributeEscaped("title", sStepTitle);
		oRm.write(">");

		if (sIconUri) {
			oRm.writeIcon(sIconUri, [CLASSES.ICON], {title: null});
		} else {
			oRm.write(iStepNumber);
		}

		oRm.write("</a>");
	};

	WizardProgressNavigatorRenderer.endStep = function (oRm) {
		oRm.write("</li>");
	};

	WizardProgressNavigatorRenderer.renderSeparator = function (oRm) {
		oRm.write("<li");
		oRm.writeAttribute("class", CLASSES.SEPARATOR);
		oRm.write("></li>");
	};

	WizardProgressNavigatorRenderer.endList = function (oRm) {
		oRm.write("</ul>");
	};

	WizardProgressNavigatorRenderer.endNavigator = function (oRm) {
		oRm.write("</nav>");
	};

	return WizardProgressNavigatorRenderer;

}, /* bExport= */ true);
