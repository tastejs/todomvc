/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([],function(){"use strict";var W={};W.render=function(r,w){this.startWizard(r,w);this.renderProgressNavigator(r,w);this.renderWizardSteps(r,w);this.renderNextButton(r,w);this.endWizard(r);};W.startWizard=function(r,w){r.write("<article");r.writeControlData(w);r.addClass("sapMWizard");r.writeClasses();r.addStyle("width",w.getWidth());r.addStyle("height",w.getHeight());r.writeStyles();r.write(">");};W.renderProgressNavigator=function(r,w){r.write("<header class='sapMWizardHeader'>");r.renderControl(w.getAggregation("_progressNavigator"));r.write("</header>");};W.renderWizardSteps=function(r,w){r.write("<section class='sapMWizardStepContainer'");r.writeAttribute("id",w.getId()+"-step-container");r.write(">");w.getSteps().forEach(r.renderControl);r.write("</section>");};W.renderNextButton=function(r,w){r.renderControl(w.getAggregation("_nextButton"));};W.endWizard=function(r){r.write("</article>");};return W;},true);
