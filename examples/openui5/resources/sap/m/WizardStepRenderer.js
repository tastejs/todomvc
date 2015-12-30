/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(function(){"use strict";var W={};W.render=function(r,s){this.startWizardStep(r,s);this.renderWizardStepTitle(r,s.getTitle());this.renderContent(r,s.getContent());this.endWizardStep(r);};W.startWizardStep=function(r,s){r.write("<article");r.writeControlData(s);r.addClass("sapMWizardStep");r.writeClasses();r.write(">");};W.renderWizardStepTitle=function(r,t){r.write("<h3 class='sapMWizardStepTitle'>");r.writeEscaped(t);r.write("</h3>");};W.renderContent=function(r,c){c.forEach(r.renderControl);};W.endWizardStep=function(r){r.write("</article>");};return W;},true);
