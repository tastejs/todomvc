/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.commons.RoadMap.
sap.ui.define(['jquery.sap.global', './library', 'sap/ui/core/Control'],
	function(jQuery, library, Control) {
	"use strict";



	/**
	 * Constructor for a new RoadMap.
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * RoadMap is used to display step-by-step work flows of a clearly defined work process.
	 * @extends sap.ui.core.Control
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @alias sap.ui.commons.RoadMap
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var RoadMap = Control.extend("sap.ui.commons.RoadMap", /** @lends sap.ui.commons.RoadMap.prototype */ { metadata : {

		library : "sap.ui.commons",
		properties : {

			/**
			 * Total number of steps to be displayed at once
			 */
			numberOfVisibleSteps : {type : "int", group : "Misc", defaultValue : null},

			/**
			 * ID of the first step to be displayed
			 */
			firstVisibleStep : {type : "string", group : "Misc", defaultValue : null},

			/**
			 * ID of the step which is currently selected
			 */
			selectedStep : {type : "string", group : "Misc", defaultValue : null},

			/**
			 * Determines the control width in CSS size
			 */
			width : {type : "sap.ui.core.CSSSize", group : "Dimension", defaultValue : '100%'}
		},
		defaultAggregation : "steps",
		aggregations : {

			/**
			 * Steps that are composing the RoadMap
			 */
			steps : {type : "sap.ui.commons.RoadMapStep", multiple : true, singularName : "step"}
		},
		events : {

			/**
			 * Event is fired when the user selects a step.
			 */
			stepSelected : {
				parameters : {

					/**
					 * ID of the selected step
					 */
					stepId : {type : "string"}
				}
			},

			/**
			 * Event is fired when a given step is expanded or collapsed by user.
			 */
			stepExpanded : {
				parameters : {

					/**
					 * ID of the expanded/collapsed step
					 */
					stepId : {type : "string"}
				}
			}
		}
	}});

	(function() {

	/**
	 * Does the setup when the RoadMap is created.
	 * @private
	 */
	RoadMap.prototype.init = function(){
		this.iStepWidth = -1;
		this.sCurrentFocusedStepRefId = null;
	};

	/**
	 * Does all the cleanup when the RoadMap is to be destroyed.
	 * Called from Element's destroy() method.
	 * @private
	 */
	RoadMap.prototype.exit = function (){
		// Cleanup resize event registration
		if (this.sResizeListenerId) {
			sap.ui.core.ResizeHandler.deregister(this.sResizeListenerId);
			this.sResizeListenerId = null;
		}
	};


	//Setter for property numberOfVisibleSteps which suppresses rerendering if possible -> Comment generated automatically
	RoadMap.prototype.setNumberOfVisibleSteps = function(iNumberOfVisibleSteps) {
		var bIsRendered = this.getDomRef() ? true : false;
		this.setProperty("numberOfVisibleSteps", iNumberOfVisibleSteps, bIsRendered);
		if (bIsRendered) {
			sap.ui.commons.RoadMapRenderer.updateScrollArea(this, true);
		}
		return this;
	};


	//Setter for property firstVisibleStep which suppresses rerendering if possible -> Comment generated automatically
	RoadMap.prototype.setFirstVisibleStep = function(sFirstVisibleStep) {
		var bIsRendered = this.getDomRef() ? true : false;
		if (bIsRendered) {
			if (sFirstVisibleStep) {
				var oStep = sap.ui.getCore().byId(sFirstVisibleStep);
				if (oStep && oStep.getParent() && (oStep.getParent() === this || oStep.getParent().getParent() === this) && oStep.getVisible()) {
					this.setProperty("firstVisibleStep", sFirstVisibleStep, true);
					sap.ui.commons.RoadMapRenderer.updateScrollArea(this);
				}
			} else {
				this.setProperty("firstVisibleStep", "", true);
				sap.ui.commons.RoadMapRenderer.updateScrollArea(this);
			}
		} else {
			this.setProperty("firstVisibleStep", sFirstVisibleStep);
		}
		return this;
	};


	//Setter for property width which suppresses rerendering if possible -> Comment generated automatically
	RoadMap.prototype.setWidth = function(sWidth) {
		var bIsRendered = this.getDomRef() ? true : false;
		this.setProperty("width", sWidth, bIsRendered);
		if (bIsRendered) {
			sap.ui.commons.RoadMapRenderer.setRoadMapWidth(this, sWidth);
			sap.ui.commons.RoadMapRenderer.updateScrollArea(this, true);
		}
		return this;
	};


	//Setter for property selectedStep which suppresses rerendering if possible -> Comment generated automatically
	RoadMap.prototype.setSelectedStep = function(sSelectedStep) {
		var bIsRendered = this.getDomRef() ? true : false;
		if (bIsRendered) {
			if (sSelectedStep) {
				var oStep = sap.ui.getCore().byId(sSelectedStep);
				if (oStep && oStep.getParent() && (oStep.getParent() === this || oStep.getParent().getParent() === this)
					&& oStep.getEnabled() && oStep.getVisible()) {
					sap.ui.commons.RoadMapRenderer.selectStepWithId(this, sSelectedStep);
					this.setProperty("selectedStep", sSelectedStep, true);
				}
			} else {
				sap.ui.commons.RoadMapRenderer.selectStepWithId(this, "");
				this.setProperty("selectedStep", "", true);
			}
		} else {
			this.setProperty("selectedStep", sSelectedStep);
		}
		return this;
	};


	/**
	 * Called when the theme is changed.
	 * @private
	 */
	RoadMap.prototype.onThemeChanged = function(oEvent){
		this.iStepWidth = -1;
		if (this.getDomRef()) {
			this.invalidate();
		}
	};


	/**
	 * Called before rendering starts by the renderer
	 * (This is not the onBeforeRendering method which would be not called for the first rendering)
	 * @private
	 */
	RoadMap.prototype.doBeforeRendering = function(){
		//Bring the properties into a solid state
		var bIsValidSelectedStep = false;
		var bIsValidFirstStep = false;
		var aSteps = this.getSteps();
		for (var i = 0; i < aSteps.length; i++) {
			var oStep = aSteps[i];
			//expanded=true only possible if substeps available and enabled
			if (oStep.getSubSteps().length == 0 || !oStep.getEnabled()) {
				oStep.setProperty("expanded", false, true);
			}
			//A selected step must exist, be enabled and visible
			if (!oStep.getEnabled() && !oStep.getVisible() && this.getSelectedStep() == oStep.getId()) {
				this.setProperty("selectedStep", "", true);
			} else if (oStep.getEnabled() && oStep.getVisible() && this.getSelectedStep() == oStep.getId()) {
				bIsValidSelectedStep = true;
			}
			//A first step must exist and be visible
			if (oStep.getVisible() && this.getFirstVisibleStep() == oStep.getId()) {
				bIsValidFirstStep = true;
			}

			var aSubSteps = oStep.getSubSteps();
			for (var j = 0; j < aSubSteps.length; j++) {
				var oSubStep = aSubSteps[j];
				//expanded always false
				oSubStep.setProperty("expanded", false, true);
				//A selected step must exist, be enabled and visible
				if (!oSubStep.getEnabled() && !oSubStep.getVisible() && this.getSelectedStep() == oSubStep.getId()) {
					this.setProperty("selectedStep", "", true);
				} else if (oSubStep.getEnabled() && oSubStep.getVisible() && this.getSelectedStep() == oSubStep.getId()) {
					bIsValidSelectedStep = true;
				}
				//A first step must exist and be visible
				if (oSubStep.getVisible() && this.getFirstVisibleStep() == oSubStep.getId()) {
					bIsValidFirstStep = true;
				}
			}
		}

		if (!bIsValidSelectedStep) {
			this.setProperty("selectedStep", "", true);
		}
		if (!bIsValidFirstStep) {
			this.setProperty("firstVisibleStep", "", true);
		}

		// Cleanup resize event registration before re-rendering
		if (this.sResizeListenerId) {
			sap.ui.core.ResizeHandler.deregister(this.sResizeListenerId);
			this.sResizeListenerId = null;
		}
	};


	/**
	 * Called when the rendering is complete
	 * @private
	 */
	RoadMap.prototype.onAfterRendering = function(){

		var aSteps = this.getSteps();

		//Compute the step width
		if (this.iStepWidth == -1 && aSteps.length > 0) {
			var jRef = aSteps[0].$();
			this.iStepWidth = jRef.outerWidth();
		}

		//Adapt the step labels if needed
		for (var i = 0; i < aSteps.length; i++) {
			var oStep = aSteps[i];
			sap.ui.commons.RoadMapRenderer.addEllipses(oStep);
			var aSubSteps = oStep.getSubSteps();
			for (var j = 0; j < aSubSteps.length; j++) {
				sap.ui.commons.RoadMapRenderer.addEllipses(aSubSteps[j]);
			}
		}

		//Adapt the size of the scroll area
		sap.ui.commons.RoadMapRenderer.updateScrollArea(this);

		// Listen to resizing
		this.sResizeListenerId = sap.ui.core.ResizeHandler.register(this.getDomRef(), jQuery.proxy(this.onresize, this));
	};


	/**
	 * Called when the Roadmap is resized
	 * @private
	 */
	RoadMap.prototype.onresize = function(oEvent) {
		var fDoOnResize = function() {
			if (this.getDomRef()) {
				//Adapt the size of the scroll area
				sap.ui.commons.RoadMapRenderer.updateScrollArea(this, true);
				refreshFocus(this, "prev");
				this.sResizeInProgress = null;
			}
		};

		if (!!sap.ui.Device.browser.firefox) {
			fDoOnResize.apply(this, []);
		} else {
			if (!this.sResizeInProgress) {
				this.sResizeInProgress = jQuery.sap.delayedCall(300, this, fDoOnResize);
			}
		}
	};


	/**
	 * Behavior implementation which is executed when the user clicks the step.
	 *
	 * @param {jQuery.Event} oEvent
	 * @private
	 */
	RoadMap.prototype.onclick = function(oEvent){
		handleSelect(this, oEvent);
	};


	/**
	 * Behavior implementation which is executed when the user presses the space or enter key.
	 *
	 * @param {jQuery.Event} oEvent
	 * @private
	 */
	RoadMap.prototype.onsapselect = function(oEvent){
		handleSelect(this, oEvent);
	};


	/**
	 * Behavior implementation which is executed when the focus comes into the control or on one of its children.
	 *
	 * @param {jQuery.Event} oEvent
	 * @private
	 */
	RoadMap.prototype.onfocusin = function(oEvent){
		var jTarget = jQuery(oEvent.target);
		var jTargetId = jTarget.attr("id");
		/*eslint-disable no-empty */
		//TODO Rethink if empty block is needed
		if (jTargetId && jQuery.sap.endsWith(jTargetId, "-box")) {
			this.sCurrentFocusedStepRefId = jTargetId.substring(0, jTargetId.length - 4);
		} else if (jTargetId && (jQuery.sap.endsWith(jTargetId, "-Start") || jQuery.sap.endsWith(jTargetId, "-End"))) {
			//Keep the current focus
		} else {
			this.sCurrentFocusedStepRefId = sap.ui.commons.RoadMapRenderer.getFirstVisibleRef(this).attr("id");
			refreshFocus(this);
		}
		/*eslint-enable no-empty */
		//Remove the control from tab chain to make tab out working (see onfocusout)
		this.$().attr("tabindex", "-1");
	};


	/**
	 * Behavior implementation which is executed when the focus leaves the control or one of its children.
	 *
	 * @param {jQuery.Event} oEvent
	 * @private
	 */
	RoadMap.prototype.onfocusout = function(oEvent){
		//Add the control to tab chain again to make tab in working (see onfocusin)
		this.$().attr("tabindex", "0");
	};


	/**
	 * Behavior implementation which is executed when the user presses the arrow up or arrow left (RTL: arrow right) key.
	 *
	 * @param {jQuery.Event} oEvent
	 * @private
	 */
	RoadMap.prototype.onsapprevious = function(oEvent){
		focusStep(oEvent, this, "prev");
	};


	/**
	 * Behavior implementation which is executed when the user presses the arrow down or arrow right (RTL: arrow left) key.
	 *
	 * @param {jQuery.Event} oEvent
	 * @private
	 */
	RoadMap.prototype.onsapnext = function(oEvent){
		focusStep(oEvent, this, "next");
	};


	/**
	 * Behavior implementation which is executed when the user presses the home/pos1 key.
	 *
	 * @param {jQuery.Event} oEvent
	 * @private
	 */
	RoadMap.prototype.onsaphome = function(oEvent){
		focusStep(oEvent, this, "first");
	};


	/**
	 * Behavior implementation which is executed when the user presses the end key.
	 *
	 * @param {jQuery.Event} oEvent
	 * @private
	 */
	RoadMap.prototype.onsapend = function(oEvent){
		focusStep(oEvent, this, "last");
	};


	//********* Private *********


	//Called when either the Roadmap is clicked or the space or enter key is pressed
	var handleSelect = function(oThis, oEvent){
		oEvent.stopPropagation();
		oEvent.preventDefault();

		var jTarget = jQuery(oEvent.target);
		var sTargetId = jTarget.attr("id");

		if (!sTargetId) {
			return;
		}

		//Handle event for the end of an expandable step
		var iIdx = sTargetId.lastIndexOf("-expandend");
		if (iIdx != -1) {
			var oStep = sap.ui.getCore().byId(sTargetId.substring(0, iIdx));
			if (oStep && oThis.indexOfStep(oStep) >= 0) {
				oStep.handleSelect(oEvent, true);
				return;
			}
		}

		//Handle select on delimiter
		if (sTargetId == oThis.getId() + "-Start") {
			if (jTarget.hasClass("sapUiRoadMapStartScroll")) {
				scrollToNextStep(oThis, "prev", true);
			} else {
				refreshFocus(oThis);
			}
		} else if (sTargetId == oThis.getId() + "-End") {
			if (jTarget.hasClass("sapUiRoadMapEndScroll")) {
				scrollToNextStep(oThis, "next", true);
			} else {
				refreshFocus(oThis);
			}
		}
	};


	//Helper function to scroll to following step (optionally with updating the focus (see focusStep)).
	//Allowed directions are: next, prev, first, last.
	var scrollToNextStep = function(oThis, sDir, bUpdateFocus){
		sap.ui.commons.RoadMapRenderer.scrollToNextStep(oThis, sDir, function(sFirstVisibleNodeId){
			var iIdx = sFirstVisibleNodeId.lastIndexOf("-expandend");
			if (iIdx != -1) {
				sFirstVisibleNodeId = sFirstVisibleNodeId.substring(0, iIdx);
			}
			oThis.setProperty("firstVisibleStep", sFirstVisibleNodeId, true);

			if (bUpdateFocus) {
				refreshFocus(oThis, sDir);
			}
		});
	};


	//Helper function to focus the following step of the current focused step in the given direction.
	//Allowed directions are: next, prev, first, last. If this step is not visible an automatic scrolling is done.
	var focusStep = function(oEvent, oThis, sDir){
		if (oEvent) {
			oEvent.stopPropagation();
			oEvent.preventDefault();
		}
		if (!oThis.sCurrentFocusedStepRefId) {
			return;
		}

		var sFoo = sDir + "All";
		var bIsJumpToDelimiter = false;
		if (sDir == "first") {
			sFoo = "prevAll";
			bIsJumpToDelimiter = true;
		} else if (sDir == "last") {
			sFoo = "nextAll";
			bIsJumpToDelimiter = true;
		}

		var jCurrentFocusStep = jQuery.sap.byId(oThis.sCurrentFocusedStepRefId);
		var jFollowingSteps = jCurrentFocusStep[sFoo](":visible");
		var sFollowingFocusStepId = jQuery(jFollowingSteps.get(bIsJumpToDelimiter ? jFollowingSteps.length - 1 : 0)).attr("id");
		if (sFollowingFocusStepId) {
			if (!sap.ui.commons.RoadMapRenderer.isVisibleRef(oThis, sFollowingFocusStepId)) {
				scrollToNextStep(oThis, sDir);
			}

			jQuery.sap.byId(sFollowingFocusStepId + "-box").get(0).focus();
		}
	};


	//Sets the focus on the current focused step again. If the current focused step is not visible anymore
	//the following step in the given direction is focused. Allowed directions are: next, prev, first, last
	var refreshFocus = function(oThis, sDir){
		if (!oThis.sCurrentFocusedStepRefId) {
			return;
		}

		if (sDir && !sap.ui.commons.RoadMapRenderer.isVisibleRef(oThis, oThis.sCurrentFocusedStepRefId)) {
			focusStep(null, oThis, sDir);
		} else {
			jQuery.sap.byId(oThis.sCurrentFocusedStepRefId + "-box").get(0).focus();
		}
	};

	}());

	return RoadMap;

}, /* bExport= */ true);
