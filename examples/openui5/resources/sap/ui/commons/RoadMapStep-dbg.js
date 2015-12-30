/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.commons.RoadMapStep.
sap.ui.define(['jquery.sap.global', './library', 'sap/ui/core/Element'],
	function(jQuery, library, Element) {
	"use strict";


	
	/**
	 * Constructor for a new RoadMapStep.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * Step used within a RoadMap Control.
	 * @extends sap.ui.core.Element
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @alias sap.ui.commons.RoadMapStep
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var RoadMapStep = Element.extend("sap.ui.commons.RoadMapStep", /** @lends sap.ui.commons.RoadMapStep.prototype */ { metadata : {
	
		library : "sap.ui.commons",
		properties : {
	
			/**
			 * Label of the step
			 */
			label : {type : "string", group : "Misc", defaultValue : null},
	
			/**
			 * Specifies whether the user shall be allowed to click a step, or not
			 */
			enabled : {type : "boolean", group : "Misc", defaultValue : true},
	
			/**
			 * This property is only relevant when using sub steps.
			 * @deprecated Since version 1.10.5. 
			 * Note that sub steps will not be supported in future. This feature might be removed in one of the next releases.
			 */
			expanded : {type : "boolean", group : "Misc", defaultValue : false, deprecated: true},
	
			/**
			 * Step is visible
			 */
			visible : {type : "boolean", group : "Misc", defaultValue : true}
		},
		defaultAggregation : "subSteps",
		aggregations : {
	
			/**
			 * Sub steps for the current step. Will be displayed only in the case that the step is expanded. Otherwise, special arrows show the availability
			 * of sub steps. One level of sub steps supported.
			 * @deprecated Since version 1.10.5. 
			 * Sub steps will not be supported in future. This feature might be removed in one of the next releases.
			 */
			subSteps : {type : "sap.ui.commons.RoadMapStep", multiple : true, singularName : "subStep", deprecated: true}
		}
	}});
	
	(function() {
	
	//Setter for property label which suppresses rerendering if possible -> Comment generated automatically
	RoadMapStep.prototype.setLabel = function(sLabel) {
		setProperty(this, "label", sLabel, function(){
			sap.ui.commons.RoadMapRenderer.setStepLabel(this, sLabel);
			this.setProperty("label", sLabel, true);
			sap.ui.commons.RoadMapRenderer.addEllipses(this);
			return true;
		});
		return this;
	};
	
	
	//Setter for property enabled which suppresses rerendering if possible -> Comment generated automatically
	RoadMapStep.prototype.setEnabled = function(bEnabled) {
		var bOldEnabled = this.getEnabled();
		if ((bEnabled && bOldEnabled) || (!bEnabled && !bOldEnabled)) {
			return this;
		}
		setProperty(this, "enabled", bEnabled, function(){
			var oRoadMap = getRoadMap(this);
			var bWasSelected = sap.ui.commons.RoadMapRenderer.setStepEnabled(oRoadMap, this, bEnabled);
			if (bWasSelected) {
				oRoadMap.setProperty("selectedStep", "", true);
			}
			if (!bEnabled) {
				this.setExpanded(false);
			}
			return false;
		});
		return this;
	};
	
	
	//Setter for property expanded which suppresses rerendering if possible -> Comment generated automatically
	RoadMapStep.prototype.setExpanded = function(bExpanded) {
		var bOldExpanded = this.getExpanded();
		if ((bExpanded && bOldExpanded) || (!bExpanded && !bOldExpanded)) {
			return this;
		}
		setProperty(this, "expanded", bExpanded, function(){
			if (isSubStep(this) || this.getSubSteps().length == 0 || !this.getEnabled() || !bExpanded) {
				this.setProperty("expanded", false, true);
				if (!isSubStep(this) && this.getSubSteps().length > 0 && this.getEnabled()) {
					sap.ui.commons.RoadMapRenderer.selectStep(getRoadMap(this), this, false, true, null, true);
				}
			} else {
				this.setProperty("expanded", true, true);
				sap.ui.commons.RoadMapRenderer.selectStep(getRoadMap(this), this, false, true, null, true);
			}
			return true;
		});
		return this;
	};
	
	
	//Setter for property visible which suppresses rerendering if possible -> Comment generated automatically
	RoadMapStep.prototype.setVisible = function(bVisible) {
		var bOldVisible = this.getVisible();
		if ((bVisible && bOldVisible) || (!bVisible && !bOldVisible)) {
			return this;
		}
		setProperty(this, "visible", bVisible, function(){
			var oRoadMap = getRoadMap(this);
			var bWasSelected = sap.ui.commons.RoadMapRenderer.setStepVisible(oRoadMap, this, isSubStep(this), bVisible);
			if (bWasSelected) {
				oRoadMap.setProperty("selectedStep", "", true);
			}
			this.setProperty("visible", bVisible, true);
			sap.ui.commons.RoadMapRenderer.updateStepArea(oRoadMap);
			sap.ui.commons.RoadMapRenderer.updateStepAria(this);
			return true;
		});
		return this;
	};
	
	
	/**
	 * Returns the dom reference that should get the focus
	 * @type DOMNode
	 * @return Returns the dom reference that should get the focus
	 */
	RoadMapStep.prototype.getFocusDomRef = function () {
		return jQuery.sap.byId(this.getFocusInfo().id).get(0) || null;
	};
	
	
	/**
	 * Returns an object representing the serialized focus information
	 * @type object
	 * @return an object representing the serialized focus information
	 * @private
	 */
	RoadMapStep.prototype.getFocusInfo = function () {
		return {id: this.getId() + "-box"};
	};
	
	
	/**
	 * Behavior implementation which is executed when the user clicks the step.
	 *
	 * @param {jQuery.Event} oEvent
	 * @private
	 */
	RoadMapStep.prototype.onclick = function(oEvent){
		this.handleSelect(oEvent);
	};
	
	
	/**
	 * Behavior implementation which is executed when the user presses the space or enter key.
	 *
	 * @param {jQuery.Event} oEvent
	 * @private
	 */
	RoadMapStep.prototype.onsapselect = function(oEvent){
		this.handleSelect(oEvent);
	};
	
	
	/**
	 * Handler which is called when the step is selected.
	 *
	 * @param {jQuery.Event} oEvent
	 * @private
	 */
	RoadMapStep.prototype.handleSelect = function(oEvent, bIgnoreDomCheck){
		oEvent.stopPropagation();
		oEvent.preventDefault();
	
		if (!bIgnoreDomCheck && !jQuery.sap.containsOrEquals(this.getDomRef(), oEvent.target)) {
			return;
		}
	
		if (this.getEnabled()) {
			var oRoadMap = getRoadMap(this);
			var that = this;
			sap.ui.commons.RoadMapRenderer.selectStep(oRoadMap, this, isSubStep(this), false, function(sType){
				var bWasAlreadySelected = oRoadMap.getSelectedStep() == that.getId();
				oRoadMap.setProperty("selectedStep", that.getId(), true);
				that.focus();
				if (sType != "selected") {
					that.setProperty("expanded", sType == "expanded", true);
					oRoadMap.fireStepExpanded({stepId: that.getId()});
				}
				if (!bWasAlreadySelected) {
					oRoadMap.fireStepSelected({stepId: that.getId()});
				}
			});
		} else {
			this.focus();
		}
	};
	
	
	//********* Private *********
	
	
	//Returns the corresponding Roadmap control
	var getRoadMap = function(oThis){
		var oRoadMap = oThis.getParent();
		if (isSubStep(oThis)) {
			oRoadMap = oRoadMap.getParent();
		}
		return oRoadMap;
	};
	
	
	//Returns true if the parent of this step is not of type sap.ui.commons.RoadMap
	var isSubStep = function(oThis){
		return !(oThis.getParent() instanceof sap.ui.commons.RoadMap);
	};
	
	
	//Helper function to set a property without rerendering (see overridden setter functions)
	var setProperty = function(oThis, sName, oValue, fDomAdaptationCallback){
		if (!oThis.getDomRef()) {
			oThis.setProperty(sName, oValue);
			return;
		}
		var bSkipUpdate = fDomAdaptationCallback.apply(oThis, []);
		if (!bSkipUpdate) {
			oThis.setProperty(sName, oValue, true);
		}
	};
	
	}());

	return RoadMapStep;

}, /* bExport= */ true);
