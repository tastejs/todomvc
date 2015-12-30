/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides default renderer for control sap.ui.commons.RoadMap
sap.ui.define(['jquery.sap.global'],
	function(jQuery) {
	"use strict";


	
	
	/**
	 * RoadMap renderer.
	 * @namespace
	 */
	var RoadMapRenderer = {
	};
	
	
	/**
	 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} oRenderManager the RenderManager that can be used for writing to the Render-Output-Buffer
	 * @param {sap.ui.core.Control} oRoadMap the Roadmap control for which the renderer action should be performed
	 * @private
	 */
	RoadMapRenderer.render = function(oRenderManager, oRoadMap){
		var rm = oRenderManager;
	
		oRoadMap.doBeforeRendering(); //Inform the Roadmap that the rendering starts

		rm.write("<div");
		rm.writeControlData(oRoadMap);
		rm.addClass("sapUiRoadMap");
		rm.writeClasses();
		rm.writeAttribute("tabIndex", "0");
	
		var sTooltip = oRoadMap.getTooltip_AsString();
		if (sTooltip) {
			rm.writeAttributeEscaped("title", sTooltip);
		}
	
		rm.writeAttribute("style", "width:" + (oRoadMap.getWidth() ? oRoadMap.getWidth() : "100%") + ";");
	
		rm.write(">");
	
		renderDelimiter(rm, oRoadMap, true);
	
		rm.write("<ul");
		rm.writeAttribute("id", oRoadMap.getId() + "-steparea");
		rm.addClass("sapUiRoadMapStepArea");
		rm.writeClasses();
	
		//ARIA
		if (sap.ui.getCore().getConfiguration().getAccessibility()) {
			rm.writeAttribute("role", "group");
			rm.writeAttributeEscaped("aria-label", getText("RDMP_DEFAULT_TOOLTIP", []));
			if (sTooltip) {
				rm.writeAttributeEscaped("title", sTooltip);
			}
		}
	
		rm.write(">");
	
		var aSteps = oRoadMap.getSteps();
		for (var i = 0; i < aSteps.length; i++) {
			var oStep = aSteps[i];
			if (oStep.getSubSteps().length > 0) { //is expandable?
				renderExpandableStep(rm, oRoadMap, oStep);
			} else {
				renderStep(rm, oRoadMap, oStep);
			}
		}
	
		rm.write("</ul>");
	
		renderDelimiter(rm, oRoadMap, false);
	
		rm.write("</div>");
	};
	
	
	/**
	 * Updates the CSS classes of the Roadmap to select a new step.
	 * (Attention: This function should only be called by the Roadmap control itself).
	 *
	 * @param {sap.ui.core.Control} oRoadMap the Roadmap control for which the renderer action should be performed
	 * @param {string} sId the ID of the step which should be selected.
	 * @private
	 */
	RoadMapRenderer.selectStepWithId = function(oRoadMap, sId){
		var sCurrentId = oRoadMap.getSelectedStep();
		if (sCurrentId) {
			jQuery.sap.byId(sCurrentId).removeClass("sapUiRoadMapSelected");
		}
		if (sId) {
			jQuery.sap.byId(sId).addClass("sapUiRoadMapSelected");
		}
		if (sap.ui.getCore().getConfiguration().getAccessibility()) {
			if (sCurrentId) {
				jQuery.sap.byId(sCurrentId + "-box").removeAttr("aria-checked");
			}
			if (sId) {
				jQuery.sap.byId(sId + "-box").attr("aria-checked", true);
			}
		}
	};
	
	
	/**
	 * Updates the CSS classes of the Roadmap when a step is selected. If the step is an
	 * expandable step the exapnd state is toggled.
	 * (Attention: This function should only be called by the Roadmap control itself).
	 *
	 * @see <code>sap.ui.commons.RoadMapRenderer.selectStepWithId</code>
	 *
	 * @param {sap.ui.core.Control} oRoadMap the Roadmap control for which the renderer action should be performed
	 * @param {sap.ui.core.Element} oStep the step which was selected.
	 * @param {boolean} bIsSubStep indicator whether the given step is a sub step or not.
	 * @param {boolean} bSkipAnim indicator whether animation should be used or not.
	 * @param {function} fEndCallBack callback function which is called in the end with a string parameter indicating the operation which was done ("expanded", "collapsed", "selected")
	 * @param {boolean} bSkipSelect indicator whether selection state should be switched or not.
	 * @private
	 */
	RoadMapRenderer.selectStep = function(oRoadMap, oStep, bIsSubStep, bSkipAnim, fEndCallBack, bSkipSelect){
		if (!bSkipSelect) {
			//Select the step
			RoadMapRenderer.selectStepWithId(oRoadMap, oStep.getId());
		}
		if (!bIsSubStep && oStep.getSubSteps().length > 0) {
			//Expandable step -> Toggle the expand state
	
			var aSteps = oStep.getSubSteps();
			var jDomRef = oStep.$();
			var bIsExpanded = jDomRef.hasClass("sapUiRoadMapExpanded"); //Get the current expand state
	
			var iCounter = 1; //Must be in the end 0 when all animations are done (see fDoOnAnimComplete)
	
			var fDoOnAnimComplete = function(){ //Function called when an animation is done
				iCounter--;
				if (iCounter > 0) {
					return;
				}
	
				//Only do something if the last animation finishs
				if (fEndCallBack) {
					fEndCallBack(!bIsExpanded ? "expanded" : "collapsed");
				}
				RoadMapRenderer.updateStepArea(oRoadMap);
			};
	
			//Animation function to hide / show a step (depending on the current expand state)
			var fAnim = function(sId, bOpen, fComplete){
				var jRef = jQuery.sap.byId(sId);
				if (!jQuery.fx.off && !bSkipAnim) { //Animation only if turned on globally and if should not be skipped
					jRef.width(bOpen ? "0px" : oRoadMap.iStepWidth);
					var oLabel = jQuery.sap.byId(sId + "-label");
					oLabel.addClass("sapUiRoadMapHidden");
					if (bOpen) {
						jRef.toggleClass("sapUiRoadMapHidden");
					}
					jRef.animate({width: bOpen ? oRoadMap.iStepWidth : "0px"}, "fast", function(){
						if (!bOpen) {
							jRef.toggleClass("sapUiRoadMapHidden");
						}
						jRef.width("");
						oLabel.removeClass("sapUiRoadMapHidden");
						if (fComplete) {
							fComplete();
						}
					});
				} else {
					jRef.toggleClass("sapUiRoadMapHidden");
					if (fComplete) {
						fComplete();
					}
				}
			};
	
			//Change the expand state of the step immediately
			jDomRef.toggleClass("sapUiRoadMapExpanded");
	
			if (sap.ui.getCore().getConfiguration().getAccessibility()) {
				var bExp = jDomRef.hasClass("sapUiRoadMapExpanded");
				oStep.$("box").attr("aria-expanded", bExp);
				oStep.$("expandend-box").attr("aria-expanded", bExp);
			}
	
			//Hide / Show the sub steps
			for (var i = 0; i < aSteps.length; i++) {
				if (aSteps[i].getVisible()) {
					iCounter++;
					fAnim(aSteps[i].getId(), !bIsExpanded, fDoOnAnimComplete);
				}
			}
			//Hide / Show the end step
			fAnim(oStep.getId() + "-expandend", !bIsExpanded, fDoOnAnimComplete);
		} else {
			if (fEndCallBack) {
				fEndCallBack("selected");
			}
		}
	};
	
	
	/**
	 * Recalculates the width of the step area and updates the delimiters.
	 * (Attention: This function should only be called by the Roadmap control itself).
	 *
	 * @param {sap.ui.core.Control} oRoadMap the Roadmap control for which the renderer action should be performed
	 * @private
	 */
	RoadMapRenderer.updateStepArea = function(oRoadMap){
		if (oRoadMap.iStepWidth != -1) {
			var jStepAreaRef = oRoadMap.$("steparea");
			var jStartDelimRef = oRoadMap.$("Start");
			var jEndDelimRef = oRoadMap.$("End");
			var jRoadMapRef = oRoadMap.$();
	
			var iScrollLeft = jStepAreaRef.scrollLeft();
	
			var iAvailableSpaceForSteps = jRoadMapRef.width() - jStartDelimRef.outerWidth(true) - jEndDelimRef.outerWidth(true);
			var iMaxVisibleSteps = oRoadMap.getNumberOfVisibleSteps();
			var iCurrentMaxVisibleSteps = getNumberOfPotentiallyVisibleSteps(oRoadMap);
			if (iMaxVisibleSteps < 1) {
				iMaxVisibleSteps = iCurrentMaxVisibleSteps;
			} else {
				iMaxVisibleSteps = Math.min(iMaxVisibleSteps, iCurrentMaxVisibleSteps);
			}
	
			var iPossibleSteps = Math.floor(iAvailableSpaceForSteps / oRoadMap.iStepWidth);
			var iNumberOfVisibleSteps = Math.min(iMaxVisibleSteps, iPossibleSteps);
			jStepAreaRef.width(iNumberOfVisibleSteps * oRoadMap.iStepWidth).scrollLeft(iScrollLeft);
	
			updateDelimiters(oRoadMap);
		}
	};
	
	
	/**
	 * Recalculates the width of the step area and updates the delimiters and sets the
	 * focus either to the specified first visible step of the Roadmap (if not exists the first visible
	 * step is focused).
	 * (Attention: This function should only be called by the Roadmap control itself).
	 *
	 * @see <code>sap.ui.commons.RoadMapRenderer.updateStepArea</code>
	 *
	 * @param {sap.ui.core.Control} oRoadMap the Roadmap control for which the renderer action should be performed
	 * @param {boolean} bSkipScrollState if false the function does the same as <code>sap.ui.commons.RoadMapRenderer.updateStepArea</code>
	 * @private
	 */
	RoadMapRenderer.updateScrollArea = function(oRoadMap, bSkipScrollState){
		RoadMapRenderer.updateStepArea(oRoadMap);
		if (!bSkipScrollState) {
			var jStepArea = oRoadMap.$("steparea");
			var oPos = getStepEndPosition(oRoadMap, false);
			if (oRoadMap.getFirstVisibleStep()) {
				var jStep = jQuery.sap.byId(oRoadMap.getFirstVisibleStep());
				if (jStep.length) {
					oPos = getPositionLeft(jStepArea, jStep);
				}
			}
			updateScrollState(oRoadMap, oPos + getRTLFactor() * jStepArea.scrollLeft(), true);
		}
	};
	
	
	/**
	 * Checks whether the step with the given Id is currently in the visible part of the scroll area.
	 * (Attention: This function should only be called by the Roadmap control itself).
	 *
	 * @param {sap.ui.core.Control} oRoadMap the Roadmap control for which the renderer action should be performed
	 * @param {string} sId the ID of the step which should be checked.
	 * @private
	 */
	RoadMapRenderer.isVisibleRef = function(oRoadMap, sId){
		var jStepArea = oRoadMap.$("steparea");
		var jStepAreaChildren = jStepArea.children(":visible");
		for (var i = 0; i < jStepAreaChildren.length; i++) {
			var jChild = jQuery(jStepAreaChildren.get(i));
			if (jChild.attr("id") == sId) {
				var iPos = getPositionLeft(jStepArea, jChild);
				return iPos >= 0 && iPos < jStepArea.width();
			}
		}
		return false;
	};
	
	
	/**
	 * Returns the Id of the first step in the visible part of the scroll area.
	 * (Attention: This function should only be called by the Roadmap control itself).
	 *
	 * @param {sap.ui.core.Control} oRoadMap the Roadmap control for which the renderer action should be performed
	 * @private
	 */
	RoadMapRenderer.getFirstVisibleRef = function(oRoadMap){
		var jStepArea = oRoadMap.$("steparea");
		var jStepAreaChildren = jStepArea.children(":visible");
		for (var i = 0; i < jStepAreaChildren.length; i++) {
			var jChild = jQuery(jStepAreaChildren.get(i));
			if (getPositionLeft(jStepArea, jChild) == 0) {
				return jChild;
			}
		}
		return null;
	};
	
	
	/**
	 * Updates the label text of the given step
	 * (Attention: This function should only be called by the Roadmap control itself).
	 *
	 * @param {sap.ui.core.Element} oStep the Step for which the label should be changed.
	 * @param {string} sLabel the new label.
	 * @private
	 */
	RoadMapRenderer.setStepLabel = function(oStep, sLabel){
		var l = sLabel ? jQuery.sap.encodeHTML(sLabel) : "";
		oStep.$("label").html(l);
		oStep.$("expandend-label").html(l);
		
		if (!sap.ui.getCore().getConfiguration().getAccessibility()) {
			return;
		}
		
		oStep.$("box").attr("aria-label", getAriaLabel(oStep, sLabel));
		oStep.$("expandend-box").attr("aria-label", getAriaLabel(oStep, sLabel));
	};
	
	
	/**
	 * Updates the enabled state of the given step
	 * (Attention: This function should only be called by the Roadmap control itself).
	 *
	 * @param {sap.ui.core.Control} oRoadMap the Roadmap control for which the renderer action should be performed
	 * @param {sap.ui.core.Element} oStep the Step for which the state should be changed.
	 * @param {boolean} bEnabled the enabled state.
	 * @private
	 */
	RoadMapRenderer.setStepEnabled = function(oRoadMap, oStep, bEnabled){
		var jRef = oStep.$();
		var jRef2 = oStep.$("expandend");
		if (bEnabled) {
			jRef.removeClass("sapUiRoadMapDisabled");
			jRef2.removeClass("sapUiRoadMapDisabled");
			if (sap.ui.getCore().getConfiguration().getAccessibility()) {
				oStep.$("box").removeAttr("aria-disabled");
				oStep.$("expandend-box").removeAttr("aria-disabled");
			}
			return false;
		} else {
			var bSelected = oRoadMap.getSelectedStep() == oStep.getId();
			if (bSelected) {
				jRef.removeClass("sapUiRoadMapSelected");
			}
			jRef.addClass("sapUiRoadMapDisabled");
			jRef2.addClass("sapUiRoadMapDisabled");
			if (sap.ui.getCore().getConfiguration().getAccessibility()) {
				var jRefBox = oStep.$("box");
				jRefBox.attr("aria-disabled", true);
				if (bSelected) {
					jRefBox.removeAttr("aria-checked");
				}
				oStep.$("expandend-box").attr("aria-disabled", true);
			}
			return bSelected;
		}
	};
	
	
	/**
	 * Updates the visible state of the given step
	 * (Attention: This function should only be called by the Roadmap control itself).
	 *
	 * @param {sap.ui.core.Control} oRoadMap the Roadmap control for which the renderer action should be performed
	 * @param {sap.ui.core.Element} oStep the Step for which the state should be changed.
	 * @param {boolean} bIsSubStep indicates whether the given step is a substep or not
	 * @param {boolean} bVisible the visible state.
	 * @private
	 */
	RoadMapRenderer.setStepVisible = function(oRoadMap, oStep, bIsSubStep, bVisible){
		var jRef = oStep.$();
		var jRef2 = oStep.$("expandend");
		var bSelected = oRoadMap.getSelectedStep() == oStep.getId();
	
		var oParent = oStep.getParent();
		if (bIsSubStep) {
			if (oParent.getEnabled() && oParent.getVisible() && oParent.getExpanded()) {
				if (bVisible) {
					jRef.removeClass("sapUiRoadMapHidden");
				} else {
					jRef.addClass("sapUiRoadMapHidden");
				}
			}
		} else {
			if (bVisible) {
				jRef.removeClass("sapUiRoadMapHidden");
			} else {
				jRef.addClass("sapUiRoadMapHidden");
			}
	
			var aSteps = oStep.getSubSteps();
			if (aSteps.length > 0 && oStep.getExpanded()) {
				if (bVisible) {
					jRef2.removeClass("sapUiRoadMapHidden");
				} else {
					jRef2.addClass("sapUiRoadMapHidden");
				}
	
				for (var i = 0; i < aSteps.length; i++) {
					if (aSteps[i].getVisible()) {
						var jRef3 = aSteps[i].$();
						if (oRoadMap.getSelectedStep() == aSteps[i].getId()) {
							bSelected = true;
							jRef3.removeClass("sapUiRoadMapSelected");
							aSteps[i].$("box").removeAttr("aria-checked");
						}
						if (bVisible) {
							jRef3.removeClass("sapUiRoadMapHidden");
						} else {
							jRef3.addClass("sapUiRoadMapHidden");
						}
					}
				}
			}
		}
	
		return bSelected;
	};
	
	
	/**
	 * Updates the width of the Roadmap
	 * (Attention: This function should only be called by the Roadmap control itself).
	 *
	 * @param {sap.ui.core.Control} oRoadMap the Roadmap control for which the renderer action should be performed
	 * @param {string} sWidth the new width.
	 * @private
	 */
	RoadMapRenderer.setRoadMapWidth = function(oRoadMap, sWidth){
		var jRef = oRoadMap.$();
		jRef.attr("style", "width:" + (sWidth ? sWidth : "100%") + ";");
	};
	
	
	/**
	 * Scrolls according to the given direction.
	 * (Attention: This function should only be called by the Roadmap control itself).
	 *
	 * @see <code>sap.ui.commons.RoadMapRenderer.getFirstVisibleRef</code>
	 *
	 * @param {sap.ui.core.Control} oRoadMap the Roadmap control for which the renderer action should be performed
	 * @param {string} sDir the scroll direction (allowed are "next", "prev", "first", "last")
	 * @param {function} fEndCallBack callback function which is called in the end with a string parameter indicating the id of the new first visible step
	 * @private
	 */
	RoadMapRenderer.scrollToNextStep = function(oRoadMap, sDir, fEndCallBack){
		var oPos = sDir;
		if (sDir == "first" || sDir == "last") {
			oPos = getStepEndPosition(oRoadMap, sDir == "last");
		}
		updateScrollState(oRoadMap, oPos, false, fEndCallBack);
	};
	
	
	/**
	 * Shortens the label of the given step and adds ellipses if necessary
	 * (Attention: This function should only be called by the Roadmap control itself).
	 *
	 * @param {sap.ui.core.Element} oStep the Step for which the label should be adapted
	 * @private
	 */
	RoadMapRenderer.addEllipses = function(oStep){
		if (!oStep) {
			return;
		}
	
		var jStepLabel = oStep.$("label");
		var sOriginalText = oStep.getLabel();
		var sText = sOriginalText + "";
	
		var jClone = jQuery("<label class=\"sapUiRoadMapTitle\" style=\"display:none;position:absolute;overflow:visible;font-weight:bold;height:auto\">" + sText + "</label>");
		jClone.width(jStepLabel.width());
		jQuery(sap.ui.getCore().getStaticAreaRef()).append(jClone);
	
		var bIsShortened = false;
		while (sText.length > 0 && jClone.height() > jStepLabel.height()) {
			//TODO: Do we need special RTL handling here?
			sText = sText.substr(0, sText.length - 1);
			jClone.html(jQuery.sap.encodeHTML(sText + "..."));
			bIsShortened = true;
		}
	
		if (bIsShortened) {
			jStepLabel.html("<span>" + jQuery.sap.encodeHTML(sText) + "</span>");
			jStepLabel.attr("title", oStep.getLabel());
		} else {
			jStepLabel.attr("title", getStepTooltip(oStep));
		}
	
		jClone.remove();
	};
	
	
	/**
	 * Updates the ARIA properties of the steps on the same level as the given step.
	 * (Attention: This function should only be called by the Roadmap control itself).
	 *
	 * @param {sap.ui.core.Element} oStep the Step.
	 * @private
	 */
	RoadMapRenderer.updateStepAria = function(oStep){
		if (!sap.ui.getCore().getConfiguration().getAccessibility()) {
			return;
		}
		var bIsTopLevel = oStep.getParent() instanceof sap.ui.commons.RoadMap;
		var aSteps = oStep.getParent()[bIsTopLevel ? "getSteps" : "getSubSteps"]();
		for (var i = 0; i < aSteps.length; i++) {
			var sPosInSet = getAriaPosInSet(aSteps[i]);
			var sSetSize = getAriaSetSize(aSteps[i]);
			var jStepBox = aSteps[i].$("box");
			jStepBox.attr("aria-posinset", sPosInSet);
			jStepBox.attr("aria-setsize", sSetSize);
			if (bIsTopLevel && aSteps[i].getSubSteps().length > 0) {
				jStepBox = aSteps[i].$("expandend-box");
				jStepBox.attr("aria-posinset", sPosInSet);
				jStepBox.attr("aria-setsize", sSetSize);
			}
		}
	};
	
	
	//********* Private *********
	
	
	//Writes the delimiter HTML into the rendermanger
	var renderDelimiter = function(rm, oRoadMap, bStart){
		var sType = bStart ? "Start" : "End";
		rm.write("<div");
		rm.writeAttribute("id", oRoadMap.getId() + "-" + sType);
		rm.writeAttribute("tabindex", "-1");
		var hasHiddenSteps = true; //Simply assume that there are hidden steps -> updated later (see function updateScrollState)
		rm.addClass(hasHiddenSteps ? "sapUiRoadMap" + sType + "Scroll" : "sapUiRoadMap" + sType + "Fixed");
		rm.addClass("sapUiRoadMapDelim");
		rm.addClass("sapUiRoadMapContent");
		rm.writeClasses();
		rm.write("></div>");
	};
	
	
	//Writes the step HTML into the rendermanger
	var renderStep = function(rm, oRoadMap, oStep, aAdditionalClasses, fAddAdditionalBoxContent, sId){
		rm.write("<li");
		if (sId) { //Write the given Id if available, otherwise use writeControlData
			rm.writeAttribute("id", sId);
		} else {
			rm.writeElementData(oStep);
		}
		var sStepName = getStepName(oRoadMap, oStep);
		oStep.__stepName = sStepName;
		var sTooltip = getStepTooltip(oStep);
	
		rm.addClass("sapUiRoadMapContent");
		rm.addClass("sapUiRoadMapStep");
		if (!oStep.getVisible()) {
			rm.addClass("sapUiRoadMapHidden");
		}
		if (oStep.getEnabled()) {
			if (oRoadMap.getSelectedStep() == oStep.getId()) {
				rm.addClass("sapUiRoadMapSelected");
			}
		} else {
			rm.addClass("sapUiRoadMapDisabled");
		}
		if (aAdditionalClasses) { //Write additional CSS classes if available
			for (var i = 0; i < aAdditionalClasses.length; i++) {
				rm.addClass(aAdditionalClasses[i]);
			}
		}
		rm.writeClasses();
	
		rm.write(">");
	
		renderAdditionalStyleElem(rm, sId ? sId : oStep.getId(), 1);
	
		rm.write("<div");
		rm.writeAttribute("id", (sId ? sId : oStep.getId()) + "-box");
		rm.writeAttribute("tabindex", "-1");
		rm.addClass("sapUiRoadMapStepBox");
		rm.writeClasses();
		rm.writeAttributeEscaped("title", sTooltip);
	
		writeStepAria(rm, oRoadMap, oStep, fAddAdditionalBoxContent ? true : false);
	
		rm.write("><span>");
		rm.write(sStepName);
		rm.write("</span>");
	
		//Call callback function to render additional content
		if (fAddAdditionalBoxContent) {
			fAddAdditionalBoxContent(rm, oRoadMap, oStep);
		}
	
		rm.write("</div>");
	
		rm.write("<label");
		rm.writeAttribute("id", (sId ? sId : oStep.getId()) + "-label");
		rm.addClass("sapUiRoadMapTitle");
		rm.writeAttributeEscaped("title", sTooltip);
		rm.writeClasses();
		rm.write(">");
		var sLabel = oStep.getLabel();
		if (sLabel) {
			rm.writeEscaped(sLabel);
		}
		rm.write("</label>");
	
		renderAdditionalStyleElem(rm, sId ? sId : oStep.getId(), 2);
	
		rm.write("</li>");
	};
	
	
	//Returns the tooltip of the given step
	var getStepTooltip = function(oStep){
		var sTooltip = oStep.getTooltip_AsString();
		if (!sTooltip && !oStep.getTooltip() && sap.ui.getCore().getConfiguration().getAccessibility()) {
			sTooltip = getText("RDMP_DEFAULT_STEP_TOOLTIP", [oStep.__stepName]);
		}
		return sTooltip || "";
	};
	
	
	//Writes the additonal style HTML into the rendermanger (see renderStep)
	var renderAdditionalStyleElem = function(rm, sId, iIdx){
		rm.write("<div");
		rm.writeAttribute("id", sId + "-add" + iIdx);
		rm.addClass("sapUiRoadMapStepAdd" + iIdx);
		rm.writeClasses();
		rm.write("></div>");
	};
	
	
	//Writes the ARIA properties of a step
	var writeStepAria = function(rm, oRoadMap, oStep, bIsExpandable){
		if (!sap.ui.getCore().getConfiguration().getAccessibility()) {
			return;
		}
	
		rm.writeAttribute("role", "treeitem");
	
		if (oStep.getEnabled()) {
			rm.writeAttribute("aria-checked", oRoadMap.getSelectedStep() == oStep.getId());
		} else {
			rm.writeAttribute("aria-disabled", true);
		}
		rm.writeAttribute("aria-haspopup", bIsExpandable);
		rm.writeAttribute("aria-level", oStep.getParent() instanceof sap.ui.commons.RoadMap ? 1 : 2);
		
		rm.writeAttribute("aria-posinset", getAriaPosInSet(oStep));
		rm.writeAttribute("aria-setsize", getAriaSetSize(oStep));
		rm.writeAttributeEscaped("aria-label", getAriaLabel(oStep, oStep.getLabel()));
	
		if (!bIsExpandable) {
			return;
		}
	
		rm.writeAttribute("aria-expanded", oStep.getExpanded());
	};
	
	
	//Computes how the aria-label property should be set for the given step
	var getAriaLabel = function(oStep, sLabel){
		var bIsExpandable = oStep.getParent() instanceof sap.ui.commons.RoadMap && oStep.getSubSteps().length > 0;
		
		var sResult = sLabel || "";
		if (oStep.getEnabled()) {
			sResult = getText(bIsExpandable ? "RDMP_ARIA_EXPANDABLE_STEP" : "RDMP_ARIA_STANDARD_STEP", [sResult]);
		}
		
		return sResult;
	};
	
	
	//Computes how the aria-posinset property should be set for the given step
	var getAriaPosInSet = function(oStep){
		var bIsTopLevel = oStep.getParent() instanceof sap.ui.commons.RoadMap;
		var iIdx = oStep.getParent()[bIsTopLevel ? "indexOfStep" : "indexOfSubStep"](oStep);
		var iCountInvisible = 0;
		var aSteps = oStep.getParent()[bIsTopLevel ? "getSteps" : "getSubSteps"]();
		for (var i = 0; i < iIdx; i++) {
			if (!aSteps[i].getVisible()) {
				iCountInvisible++;
			}
		}
		return iIdx + 1 - iCountInvisible;
	};
	
	
	//Computes how the aria-setsize property should be set for the given step
	var getAriaSetSize = function(oStep){
		var bIsTopLevel = oStep.getParent() instanceof sap.ui.commons.RoadMap;
		var aSteps = oStep.getParent()[bIsTopLevel ? "getSteps" : "getSubSteps"]();
		var iCount = aSteps.length;
		for (var i = 0; i < aSteps.length; i++) {
			if (!aSteps[i].getVisible()) {
				iCount--;
			}
		}
		return iCount;
	};
	
	
	//Writes the step HTML of the expandable step and its children into the rendermanger
	var renderExpandableStep = function(rm, oRoadMap, oStep){
		var fCreateIcon = function(rm, oRoadMap, sId, sIcon, sAdditonalClass){
			rm.write("<div");
			rm.writeAttribute("id", sId + "-ico");
			rm.addClass("sapUiRoadMapStepIco");
			if (sAdditonalClass) {
				rm.addClass(sAdditonalClass);
			}
			rm.writeClasses();
			rm.write("></div>");
		};
	
		var bIsExpanded = oStep.getExpanded();
	
		//Render the start step with an additional icon
		renderStep(rm, oRoadMap, oStep, bIsExpanded ? ["sapUiRoadMapExpanded"] : null, function(rm, oRoadMap, oStep){
			fCreateIcon(rm, oRoadMap, oStep.getId(), bIsExpanded ? "roundtripstart.gif" : "roundtrip.gif");
		});
	
		//Render the sub steps
		var aSteps = oStep.getSubSteps();
		for (var i = 0; i < aSteps.length; i++) {
			var aClasses = ["sapUiRoadMapSubStep"];
			if (!bIsExpanded && aSteps[i].getVisible()) {
				aClasses.push("sapUiRoadMapHidden");
			}
			renderStep(rm, oRoadMap, aSteps[i], aClasses);
		}
	
		//Render the end step with an additional icon
		aClasses = ["sapUiRoadMapExpanded", "sapUiRoadMapStepEnd"];
		if (!bIsExpanded) {
			aClasses.push("sapUiRoadMapHidden");
		}
		renderStep(rm, oRoadMap, oStep, aClasses, function(rm, oRoadMap, oStep){
			fCreateIcon(rm, oRoadMap, oStep.getId() + "-expandend", "roundtripend.gif");
		}, oStep.getId() + "-expandend");
	};
	
	
	//Returns the name of the step according to its index in the aggregation (like "1", "a", "aa")
	var getStepName = function(oRoadMap, oStep){
		var oParent = oStep.getParent();
		if (oParent === oRoadMap) {
			return oParent.indexOfStep(oStep) + 1;
		}
	
		var iIdx = oParent.indexOfSubStep(oStep);
	
		if (iIdx < 26) {
			return String.fromCharCode(97 + iIdx);
		} // Single character
	
		//Double characters Substeps name are formed of 2 letters (e.g. "aa"). -> so overall 702 substeps possible
		var firstCharIdx = Math.floor(iIdx / 26) - 1;
		var secondCharIdx = iIdx % 26;
		return String.fromCharCode(97 + firstCharIdx, 97 + secondCharIdx);
	};
	
	
	//Refreshs teh delimiters according to the current scroll state
	var updateDelimiters = function(oRoadMap){
		var iRTLFactor = getRTLFactor();
	
		var jStepArea = oRoadMap.$("steparea");
	
		var iScrollLeft = getScrollLeft(jStepArea);
	
		var jStartDelim = oRoadMap.$("Start");
		jStartDelim.removeClass("sapUiRoadMapStartScroll").removeClass("sapUiRoadMapStartFixed");
		jStartDelim.addClass(iRTLFactor * iScrollLeft >= oRoadMap.iStepWidth ? "sapUiRoadMapStartScroll" : "sapUiRoadMapStartFixed");
	
		var jEndDelim = oRoadMap.$("End");
		jEndDelim.removeClass("sapUiRoadMapEndScroll").removeClass("sapUiRoadMapEndFixed");
		var bEndReached = jStepArea.get(0).scrollWidth - iRTLFactor * iScrollLeft - jStepArea.width() < oRoadMap.iStepWidth;
		jEndDelim.addClass(bEndReached ? "sapUiRoadMapEndFixed" : "sapUiRoadMapEndScroll");
	};
	
	
	//Returns the translatable text according to the given key and arguments
	var getText = function(sKey, aArgs) {
		var rb = sap.ui.getCore().getLibraryResourceBundle("sap.ui.commons");
		if (rb) {
			return rb.getText(sKey, aArgs);
		}
		return sKey;
	};
	
	
	//Returns the number of steps which currently could be visible
	//(Must be visible and for substeps the parent must be expanded)
	var getNumberOfPotentiallyVisibleSteps = function(oRoadMap){
		var counter = 0;
		var aSteps = oRoadMap.getSteps();
		for (var i = 0; i < aSteps.length; i++) {
			if (aSteps[i].getVisible()) {
				counter++;
				if (aSteps[i].getExpanded()) {
					counter++; //End of Expanded Step
					var aSubSteps = aSteps[i].getSubSteps();
					for (var j = 0; j < aSubSteps.length; j++) {
						if (aSubSteps[j].getVisible()) {
							counter++;
						}
					}
				}
			}
		}
		return counter;
	};
	
	
	//Returns the position left attribute of the given step within the scroll area
	var getPositionLeft = function(jStepArea, jStep){
		var iPos = jStep.position().left;
		if (sap.ui.getCore().getConfiguration().getRTL()) { //Recompute in RTL case
			iPos = jStepArea.width() - iPos - jStep.outerWidth();
		}
		return iPos;
	};
	
	
	//Returns a factor which is needed in some browsers in RTL mode to make the position and scroll calculations running:
	//Scrolling in RTL is quite strange in the different browsers:
	//  -Firefox: right side has scrollleft=0, scrolling is indicated with negative values
	//  -IE:      right side has scrollleft=0, scrolling is indicated with positive values
	//  -Safari:  left side has scrollleft=0, scrolling is indicated with positive values
	var getRTLFactor = function(){
		return sap.ui.getCore().getConfiguration().getRTL() && !sap.ui.Device.browser.internet_explorer ? -1 : 1;
	};
	
	
	//Calculates the scroll left attribute (with fix for Safari in RTL mode) to make the position and scroll calculations running
	//(see comment on getRTLFactor for RTL behavior)
	var getScrollLeft = function(jStepArea){
		if (sap.ui.getCore().getConfiguration().getRTL() && !!sap.ui.Device.browser.webkit) {
			return ( -1) * (jStepArea.get(0).scrollWidth - jStepArea.scrollLeft() - jStepArea.width());
		}
		return jStepArea.scrollLeft();
	};
	
	
	//Calculates the position of the fisrt/last step (with fix for Safari in RTL mode) to make the position and scroll calculations running
	//(see comment on getRTLFactor for RTL behavior)
	var getStepEndPosition = function(oRoadMap, bLast){
		var iScrollWidth = oRoadMap.$("steparea").get(0).scrollWidth;
		if (sap.ui.getCore().getConfiguration().getRTL() && !!sap.ui.Device.browser.webkit) {
			return bLast ? 0 : ( -1) * iScrollWidth;
		}
		return bLast ? iScrollWidth : 0;
	};
	
	
	//Scrolls to the given position
	var updateScrollState = function(oRoadMap, iNewPos, bSkipAnim, fEndCallBack){
		var jStepArea = oRoadMap.$("steparea");
		jStepArea.stop(false, true);
	
		if (iNewPos == "next") {
			iNewPos = jStepArea.scrollLeft() + oRoadMap.iStepWidth * getRTLFactor();
		} else if (iNewPos == "prev") {
			iNewPos = jStepArea.scrollLeft() - oRoadMap.iStepWidth * getRTLFactor();
		} else if (iNewPos == "keep") {
			iNewPos = jStepArea.scrollLeft();
		} else {
			iNewPos = iNewPos * getRTLFactor();
		}
	
		var fDoAfterScroll = function(){
			updateDelimiters(oRoadMap);
	
			if (fEndCallBack) {
				var jFirstVisibleRef = RoadMapRenderer.getFirstVisibleRef(oRoadMap);
				fEndCallBack(jFirstVisibleRef.attr("id"));
			}
		};
	
		if (!jQuery.fx.off && !bSkipAnim) {
			jStepArea.animate({scrollLeft: iNewPos}, "fast", fDoAfterScroll);
		} else {
			jStepArea.scrollLeft(iNewPos);
			fDoAfterScroll();
		}
	};
	
	
	

	return RoadMapRenderer;

}, /* bExport= */ true);
