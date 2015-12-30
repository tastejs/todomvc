/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.commons.Accordion.
sap.ui.define(['jquery.sap.global', './library', 'sap/ui/core/Control', 'sap/ui/thirdparty/jqueryui/jquery-ui-core', 'sap/ui/thirdparty/jqueryui/jquery-ui-widget', 'sap/ui/thirdparty/jqueryui/jquery-ui-mouse', 'sap/ui/thirdparty/jqueryui/jquery-ui-sortable'],
	function(jQuery, library, Control) {
	"use strict";



	/**
	 * Constructor for a new Accordion.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * Contains N sections, acting as containers for any library control
	 * @extends sap.ui.core.Control
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @alias sap.ui.commons.Accordion
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var Accordion = Control.extend("sap.ui.commons.Accordion", /** @lends sap.ui.commons.Accordion.prototype */ { metadata : {

		library : "sap.ui.commons",
		properties : {

			/**
			 * When the specified width is less than the width of a section content, a horizontal scroll bar is provided.
			 */
			width : {type : "sap.ui.core.CSSSize", group : "Misc", defaultValue : '200px'},

			/**
			 * Section IDs that are opened by default at application start
			 */
			openedSectionsId : {type : "string", group : "Misc", defaultValue : null}
		},
		defaultAggregation : "sections",
		aggregations : {

			/**
			 * Empty container used to display any library control
			 */
			sections : {type : "sap.ui.commons.AccordionSection", multiple : true, singularName : "section"}
		},
		events : {

			/**
			 * Event is triggered when the user opens a section.
			 */
			sectionOpen : {
				parameters : {

					/**
					 * ID of the opened section
					 */
					openSectionId : {type : "string"},

					/**
					 * IDs of the sections to be closed. Can be initial in the case of no previously opened section.
					 */
					closeSectionIds : {type : "string[]"}
				}
			},

			/**
			 * Event is triggered when the user closes a section.
			 */
			sectionClose : {
				parameters : {

					/**
					 * ID of the closed section
					 */
					closeSectionId : {type : "string"}
				}
			},

			/**
			 * Event is triggered when the user changes the position of a section.
			 */
			sectionsReorder : {
				parameters : {

					/**
					 * ID of the moved section
					 */
					movedSectionId : {type : "string"},

					/**
					 * New index of the moved section
					 */
					newIndex : {type : "int"}
				}
			}
		}
	}});


	/***************************************************
	* ACCORDION CONTROL - JAVASCRIPT FUNCTIONS
	*
	* An accordion is a control that applications can use
	* to define N sections in which they can display N
	* elements of X types. One section can be opened at
	* once and one section is always opened. If the application
	* does not provide a default section to be opened,
	* the first enabled section is opened by default.
	****************************************************/

	//*"*************************************************
	//* CONSTANTS DECLARATION - CLASS ATTRIBUTES
	//***************************************************
	Accordion.CARD_1   = 1;
	Accordion.CARD_0_1 = 2;

	Accordion.aAccordions = [];

	//***************************************************
	//* INITIALIZATION
	//***************************************************
	/**
	* Initialization of the Accordion control
	* @private
	*/
	Accordion.prototype.init = function(){

	   this.bInitialRendering = true;

	   // By default, only one section is opened
	   this.activationMode = Accordion.CARD_1;

	   // Get messagebundle.properties for sap.ui.commons
	   this.rb = sap.ui.getCore().getLibraryResourceBundle("sap.ui.commons");

	   // Array used to store all section titles
	   this.aSectionTitles = [];

	   Accordion.aAccordions.push(this);

	};

	/***********************************************************************************
	* KEYBOARD NAVIGATION
	* Two mechanisms are used to support all key combinations.
	* First, for control activation (open/close sections), UI5 pseudo-events are
	* called before the browser event. These events all start with onsap_xyz.
	* For other navigation purposes, such as next/previous element, itemNavigation is used.
	* To enter the section's content, one needs to use the TAB key which
	* will take the browser's default behavior.
	***********************************************************************************/

	/**
	 * SPACE key behavior
	 * Opens the section or activates the UI element on SPACE key
	 * @param {jQuery.Event} oEvent Browser event
	 * @private
	 */
	Accordion.prototype.onsapspace = function(oEvent){

		this.onclick(oEvent);

	};

	/**
	 * PAGE DOWN key behavior
	 * Limitation: This key combination is used by Firefox 3.6 to navigate between the opened tabs in the browser.
	 * Opens the next section and focuses on the header
	 * @param {jQuery.Event} oEvent Browser event
	 * @private
	 */
	Accordion.prototype.onsappagedownmodifiers = function(oEvent){

		// Get all the sections
		var target = jQuery(oEvent.target);
		var aParents = target.parentsUntil('.sapUiAcd');

		// Get the next section
		var oDOMSection = aParents[aParents.length - 1];
		var oNextSection = jQuery(oDOMSection).next();

		// Skip all disabled sections
		while (!this.getCorrespondingSection(oNextSection[0]).getEnabled()) {
			oNextSection = oNextSection.next();
		}
		oNextSection = oNextSection[0];


		// Open the next enabled section
		this.openSection(oNextSection.id);

		// Ensure the focus is on the right section
		var aSections = this.getSections();
		aSections[this.__idxOfSec(oNextSection.id)].focus();

		// Stop the event
		oEvent.preventDefault();
		oEvent.stopPropagation();

	};

	/**
	 * PAGE UP key behavior
	 * Limitation: This key combination is used by Firefox 3.6 to navigate between the opened TABS in the browser.
	 * Opens the previous section and focuses on the header
	 * @param {jQuery.Event} oEvent Browser event
	 * @private
	 */
	Accordion.prototype.onsappageupmodifiers = function(oEvent){

		// Get all the sections
		var target = jQuery(oEvent.target);
		var aParents = target.parentsUntil('.sapUiAcd');

		// Get the previous section
		var oSection = aParents[aParents.length - 1];
		var oNextSection = jQuery(oSection).prev();

		// Skip all disabled sections
		while (!this.getCorrespondingSection(oNextSection[0]).getEnabled()) {
			oNextSection = oNextSection.prev();
		}
		oNextSection = oNextSection[0];

		// Open the previously enabled section
		this.openSection(oNextSection.id);

		// Ensure the focus is on the right section
		var aSections = this.getSections();
		aSections[this.__idxOfSec(oNextSection.id)].focus();

		// Stop the event
		oEvent.preventDefault();
		oEvent.stopPropagation();

	};

	Accordion.prototype.onsapupmodifiers = function(oEvent){

		// Stop the event
		oEvent.preventDefault();
		oEvent.stopPropagation();

		// Get the section to move
		var aParents	= jQuery(oEvent.target).parentsUntil('.sapUiAcd');
		var oDomSection = aParents[aParents.length - 1];

		// Is the section if the first one. if so, no up possible!
		if (this.__idxOfSec(oDomSection.id) === 0) {
			return;
		}

		var oDomTargetSection = jQuery(oDomSection).prev().first()[0];
		var bInsertFirst = false;
		if (this.__idxOfSec(oDomTargetSection.id) === 0) {
			bInsertFirst = true;
		}

		this.dropSection(oDomSection,oDomTargetSection,bInsertFirst);

		// Ensure the focus is on the right section
		var aSections = this.getSections();
		aSections[this.__idxOfSec(oDomSection.id)].focus();

	};

	Accordion.prototype.onsapdownmodifiers = function(oEvent){

		// Stop the event
		oEvent.preventDefault();
		oEvent.stopPropagation();

		//Get the section to move
		var aParents	= jQuery(oEvent.target).parentsUntil('.sapUiAcd');
		var oDomSection = aParents[aParents.length - 1];

		//Is the section if the first one. if so, no up possible!
		if (this.__idxOfSec(oDomSection.id) == this.getSections().length - 1) {
			return;
		}

		var oDomTargetSection = jQuery(oDomSection).next().first()[0];
		this.dropSection(oDomSection,oDomTargetSection,false);

		//Ensure the focus is on the right section
		var aSections = this.getSections();
		aSections[this.__idxOfSec(oDomSection.id)].focus();

	};

	/**
	 * Called when the user presses the UP arrow key
	 * @param {jQuery.Event} oEvent The event triggered by the user
	 * @private
	 */
	Accordion.prototype.onsapprevious = function(oEvent){

		if (oEvent.srcControl.getMetadata().getName() != "sap.ui.commons.AccordionSection" ) {
			return;
		}

		// Stop the event
		oEvent.preventDefault();
		oEvent.stopPropagation();

		//Get the current section
		var oCurrentSection = this.getCurrentSection(oEvent.target),
			oNextFocusableElement = null;

		//Extra check to see of we are on the first section, if yes, set the focus on this one
		if (oCurrentSection.id == this.getSections()[0].getId()) {
			oNextFocusableElement = jQuery(oCurrentSection).find("div.sapUiAcdSectionHdr");
			if (oNextFocusableElement) {
				oNextFocusableElement.focus();
			}
		}

		//Simply set the focus on the next section if any
		if (oCurrentSection) {

			//Get the previous section that is enabled, disregard disabled sections
			var oPreviousSection = jQuery(oCurrentSection).prev();
			while (oPreviousSection && jQuery(oPreviousSection).hasClass("sapUiAcdSectionDis")) {
				oPreviousSection = jQuery(oPreviousSection).prev();
			}
			if (oPreviousSection) {
				oNextFocusableElement = jQuery(oPreviousSection).find("div.sapUiAcdSectionHdr");
				if (oNextFocusableElement) {
					oNextFocusableElement.focus();
				}
			}
		}

	};

	/**
	 * Called when the user presses the DOWN arrow key
	 * @param {jQuery.Event} oEvent The event triggered by the user
	 * @private
	 */
	Accordion.prototype.onsapnext = function(oEvent){

		if (oEvent.srcControl.getMetadata().getName() != "sap.ui.commons.AccordionSection" ) {
			return;
		}

		// Stop the event
		oEvent.preventDefault();
		oEvent.stopPropagation();

		//Get the current section
		var oCurrentSection = this.getCurrentSection(oEvent.target);

		//Simply set the focus on the next section if any
		if (oCurrentSection) {

			//Get the next section that is enabled, disregard disabled sections
			var oNextSection = jQuery(oCurrentSection).next();
			while (oNextSection && jQuery(oNextSection).hasClass("sapUiAcdSectionDis")) {
				oNextSection = jQuery(oNextSection).next();
			}
			if (oNextSection) {
				var oNextFocusableElement = jQuery(oNextSection).find("div.sapUiAcdSectionHdr");
				if (oNextFocusableElement) {
					oNextFocusableElement.focus();
				}
			}
		}

	};

	/**
	 * Called when the user presses the HOME key
	 * @param {jQuery.Event} oEvent The event triggered by the user
	 * @private
	 */
	Accordion.prototype.onsaphome = function(oEvent){

		// Stop the event
		oEvent.preventDefault();
		oEvent.stopPropagation();

		//Get the current first section id
		var oFocusableSection = this.getSections()[0].getDomRef();

		//If the section is disabled, get the next section that is enabled, disregard disabled sections
		if (jQuery(oFocusableSection).hasClass("sapUiAcdSectionDis")) {
			oFocusableSection = jQuery(oFocusableSection).next();
			while (oFocusableSection && jQuery(oFocusableSection).hasClass("sapUiAcdSectionDis")) {
				oFocusableSection = jQuery(oFocusableSection).next();
			}
		}

		//We found one focusable section
		if (oFocusableSection) {
			var oNextFocusableElement = jQuery(oFocusableSection).find("div.sapUiAcdSectionHdr");
			if (oNextFocusableElement) {
				oNextFocusableElement.focus();
			}
		}

	};

	/**
	 * Called when the user presses the END key
	 * @param {jQuery.Event} oEvent The event triggered by the user
	 * @private
	 */
	Accordion.prototype.onsapend = function(oEvent){

		// Stop the event
		oEvent.preventDefault();
		oEvent.stopPropagation();

		//Get the last section
		var iNbSections = this.getSections().length;
		var oFocusableSection = this.getSections()[iNbSections - 1].getDomRef();

		//If the section is disabled, get the previous section that is enabled, disregard disabled sections
		if (jQuery(oFocusableSection).hasClass("sapUiAcdSectionDis")) {
			oFocusableSection = jQuery(oFocusableSection).prev();
			while (oFocusableSection && jQuery(oFocusableSection).hasClass("sapUiAcdSectionDis")) {
				oFocusableSection = jQuery(oFocusableSection).prev();
			}
		}

		//We found one focusable section
		if (oFocusableSection) {
			var oNextFocusableElement = jQuery(oFocusableSection).find("div.sapUiAcdSectionHdr");
			if (oNextFocusableElement) {
				oNextFocusableElement.focus();
			}
		}

	};

	/**
	 * Utility to get the current section
	 * @param {Element} oDomElement The current DOM element from which an event is triggered
	 * @return The current AccordionSection as an object
	 * @private
	 */
	Accordion.prototype.getCurrentSection = function(oDomElement){

		//Use jQuery to get the parent section
		var oCurrentSection = oDomElement;
		while (!jQuery(oCurrentSection).hasClass("sapUiAcdSection")) {
			oCurrentSection = jQuery(oCurrentSection).parent();
		}
		return oCurrentSection[0];

	};

	/***********************************************************************************
	 * DRAG AND DROP
	 * Drag and drop is used to move a single section up or down in the accordion
	 * This can be achieved with a mouse click and dragging up or down or a mouse click and key combinations CTRL + UP
	 * or CTRL + DOWN
	 ***********************************************************************************/
	/**
	 * Drops a section to a new index
	 * @param {Element} oDomSection	Section to drop to a new index
	 * @param {Element} oDomTargetSection Section after which to drop the section
	 * @param {boolean} bDropFirst If true, drop at first place
	 * @private
	 */
	Accordion.prototype.dropSection = function(oDomSection, oDomTargetSection, bDropFirst){

		//Get accordion DOM object
		var oDomAccordion = jQuery(oDomSection).parent()[0];

		//We substract 1 as the first child is the drop target and the should not be considered
		var aChildren = jQuery(oDomAccordion).children(".sapUiAcdSection").toArray();
		var iIndexToInsert = jQuery.inArray(oDomTargetSection, aChildren);

		if (bDropFirst) {
			iIndexToInsert -= 1;
		}

		//Update accordion with the change
		this.moveSection(oDomSection.id,iIndexToInsert);

	};

	/**
	 * Moves one section to a given new index by adjusting all internal information
	 * @param {string} sSectionId The current section ID being moved
	 * @param {int} iTargetIndex Where the section is dropped
	 * @private
	 */
	Accordion.prototype.moveSection = function(sSectionId, iTargetIndex){

		//Get previous index
		var iOldIndex = this.__idxOfSec(sSectionId);


		if (iTargetIndex == iOldIndex) {
			 //Nothing to do
			 return;
		}


		/****Remove section from arrays*********************************/

		//Remove title for the list
		var sSectionTitle = this.aSectionTitles[iOldIndex];
		this.aSectionTitles.splice(iOldIndex,1);

		//Remove section aggregation
		var aSections = this.getSections();
		var oSection = aSections[iOldIndex];
		this.removeSection(iOldIndex, true);


		/****Add section to new index*********************************/
		if (iTargetIndex != -1) {
			this.aSectionTitles.splice(iTargetIndex,0,sSectionTitle);
		} else {
			this.aSectionTitles.splice(0,0,sSectionTitle);
		}

		//Update aggregation
		this.insertSection(oSection,iTargetIndex, true);

		//Trigger event for application to react
		this.fireSectionsReorder({movedSectionId:sSectionId, newIndex:iTargetIndex});

	};

	Accordion.prototype._onSortChange = function(oEvent, oUi){

		oEvent.preventDefault();
		oEvent.stopPropagation();

		var oDomSection = oUi.item[0];
		var SectionId = oUi.item[0].getAttribute("Id");

		//Get accordion DOM object
		var oDomAccordion = jQuery(oDomSection).parent()[0];

		var aChildren = jQuery(oDomAccordion).children(".sapUiAcdSection").toArray();
		var iIndexToInsert = jQuery.inArray(oDomSection, aChildren);

		this.moveSection(SectionId,iIndexToInsert);
	};

	/***********************************************************************************
	 * Public control API
	 * Available API in the Accordion:
	 * - Open a section
	 * - Close a section
	 ***********************************************************************************/

	/**
	 * Activation of a focused section - opens or closes a section.
	 * If the focus is on a collapsed section, it closes the currently open section and opens the focused one.
	 * If the focus is on an expanded section, it collapses it and opens the default one.
	 * This function is called using onClick with the mouse, or with pressing ENTER or SPACE keys
	 * @param {jQuery.Event} oEvent Browser event
	 * @private
	 */
	Accordion.prototype.onclick = function(oEvent){

		//Click on the accordion itself are not considered
		if (oEvent.srcControl.getId() ==  this.getId()) {
			return;
		}

		//Move up in the DOM to get the section (click occurs on the arrow which is an inner html element)
		var target = jQuery(oEvent.target);

		//Disable the possibility to click on the content to open/close a section
		if (target.hasClass("sapUiAcdSectionCont")) {
			return;
		}

		if ( !(jQuery(oEvent.target).control(0) instanceof sap.ui.commons.AccordionSection) ) {
			return;
		}

		var oDomSection = oEvent.srcControl.getDomRef();

		//If the section is disabled, we cannot open/close it.
		var oSection = this.getCorrespondingSection(oDomSection);
		if (oSection && !oSection.getEnabled()) {
			return;
		}

		//If the section is closed, open it
		if (oEvent.srcControl.getCollapsed()) {
			this.openSection(oDomSection.id);
		} else {
			this.closeSection(oDomSection.id);
		}

		//Stop the event here
		oEvent.preventDefault();
		oEvent.stopPropagation();

		//Ensure the focus is on the right section
		var aSections = this.getSections();
		aSections[this.__idxOfSec(oDomSection.id)].focus();

	};

	/**
	 * Opens a section
	 *
	 * @param {string} sSectionId
	 *         Id of the section that is being opened
	 * @type void
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) design time meta model
	 */
	Accordion.prototype.openSection = function(sSectionId){

		//Map the section ID to its internal index
		var iIndex = this.__idxOfSec(sSectionId);

		//Get all accordion's sections
		var aSections = this.getSections(),
			aClosedSections = [];

		//Close all sections currently opened
		if (this.activationMode == Accordion.CARD_0_1 || this.activationMode == Accordion.CARD_1) {
		  aClosedSections = this.closeOpenedSections();
		}

		//Open the section with the index retrieved from the importing section ID
		aSections[iIndex]._setCollapsed(false);

		//Trigger event for application to react
		this.fireSectionOpen({openSectionId:sSectionId, closeSectionIds:aClosedSections});

	};

	/**
	 * Closes a section and opens the default one
	 *
	 * @param {string} sSectionId
	 *         Id of the section that is being closed
	 * @type void
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) design time meta model
	 */
	Accordion.prototype.closeSection = function(sSectionId){

		//Get the corresponding mapping index
		var iIndex = this.__idxOfSec(sSectionId);

		//Get all accordion's sections
		var aSections = this.getSections();

		//Close the given section
		aSections[iIndex]._setCollapsed(true);

		//Trigger event for application to react
		this.fireSectionClose({closeSectionId:sSectionId});

	};

	/**
	 * Closes all opened sections
	 * @return {Array} Returns an array of all closed sections
	 * @private
	 */
	Accordion.prototype.closeOpenedSections = function(){

		var aClosedSections = [];
		var aSections = this.getSections();

		//Simply loop and close the sections already opened
		for (var i = 0;i < aSections.length;i++) {
			if (!aSections[i].getCollapsed()) {
				aSections[i]._setCollapsed(true);
				aClosedSections.push(aSections[i].getId());
			}
		}

		//Return all sections that were closed
		return aClosedSections;

	};

	/**
	 * Opens the default section; Consider activationMode
	 * @private
	 */
	Accordion.prototype.openDefaultSections = function(){

		//Get all accordion's sections
		var aSections = this.getSections();

		//Loop trough all defaulted opened section and open them
		var aDefaultSections = this.getOpenedSectionsId().split(",");
		for (var i = 0 ; i < aDefaultSections.length ; i++) {
		  //From the default section ID to open, we retrieve the index
		  var oActiveSection = aSections[this.__idxOfSec(aDefaultSections[i])];
		  oActiveSection._setCollapsed(false);
		}

	};

	/**
	 * Returns the number of currently open sections
	 * @return {int} The number of currently open sections
	 * @private
	 */
	Accordion.prototype.getNumberOfOpenedSections = function(){

		//Initialize the return parameter
		var openedSections  = 0;

		//Get all accordion's sections
		var aSections = this.getSections();

		//Loop and sum up all opened sections
		for (var i = 0;i < aSections.length;i++) {
			if ( aSections[i].getCollapsed() == false ) {
				openedSections++;
			}
		}
		return openedSections;
	};


	//*************************************************************************************
	// * UTILITIES FUNCTIONS
	// * List of all Javascript utilities functions needed to achieve the required behavior
	// ************************************************************************************

	Accordion.prototype.addSection = function(oSection) {

		this.addAggregation("sections", oSection);

		//Add a default opened section id
		if ( (this.getOpenedSectionsId() == null || this.getOpenedSectionsId() == "" ) && oSection.getEnabled()) {
			this.setOpenedSectionsId(oSection.getId());
		}

		this.aSectionTitles.push(oSection.getTitle());

	};

	/**
	 * Returns the index of the given section or Id of a section.
	 * @param {sap.ui.commons.AccordionSection} oSection . The current section being processed
	 * @return The index of the given section
	 * @private
	 */
	Accordion.prototype.__idxOfSec = function(oSection){
		if (typeof (oSection) == "string") {
			oSection = sap.ui.getCore().byId(oSection);
		}
		return this.indexOfSection(oSection);
	};

	/**
	 * Redefinition of the method to add additional handling
	 *
	 * @param {string} sOpenedSectionsId  New value for property openedSectionsId
	 * @return {sap.ui.commons.Accordion} 'this' to allow method chaining
	 * @public
	 */
	Accordion.prototype.setOpenedSectionsId = function(sOpenedSectionsId) {

		var aSections = this.getSections();

		var aDefaultSections = sOpenedSectionsId.split(",");


		if (aDefaultSections.length == 1) {
			//it can be that the method is called from method AddSection. We don't want to interfere with those call.
			if (this.__idxOfSec(sOpenedSectionsId) < 0) {
				this.setProperty("openedSectionsId", sOpenedSectionsId);
				return this;
			}

			if (aSections[this.__idxOfSec(sOpenedSectionsId)].getEnabled()) {
				//If the provided section is enabled
				this.setProperty("openedSectionsId", sOpenedSectionsId);
			} else {

				//If the provided section is disabled, the open section will be the first enable section starting for the top
				for (var i = 0;i < aSections.length;i++) {
					if (aSections[i].getEnabled()) {
						this.setProperty("openedSectionsId", aSections[i].getId());
						return this;
					}
				}
			}


		} else if (aDefaultSections.length == 0) {
			//If the empty string is provided, we keep the automatically selected section(as selected in method AddSection).
			return this;

		} else { //Several sections were provided, but some can be disabled. Check each of them
			var sCheckIndices;

			for (var i = 0;i < aDefaultSections.length;i++) {
				if (aSections[this.__idxOfSec(aDefaultSections[i])].getEnabled()) {

					if (sCheckIndices) {
						sCheckIndices += "," + aDefaultSections[i];

						//only one section should be opened at once, so return after the first is set
						//return;
					} else {
						sCheckIndices = aDefaultSections[i];
					}

				}
			}

			if (sCheckIndices) {
				//If at least one section remains
				this.setProperty("openedSectionsId", sCheckIndices);
			}


		}

		return this;

	};


	/**
	 * Returns AccordionSection Object corresponding to a given Section DOM Object
	 * @param oDomSection The section in a DOM representation object
	 * @return The current section control
	 * @private
	 */
	Accordion.prototype.getCorrespondingSection = function (oDomSection) {

		//Look for section index within accordion
		if (jQuery(oDomSection).hasClass("sapUiAcdSection") ) {
			var aAccordion	= jQuery(oDomSection).parent();
			var oAccordion  = aAccordion[0];
			var aSections	= jQuery(oAccordion).children();
			var iIndex		= aSections.index( oDomSection );
			var aoSections	= this.getSections();
			//Remove 1 as we have the target div as first child
			return aoSections[iIndex - 1];
		}

	};

	/**
	 * Returns true if the current section that is processed is the last one of the Accordion
	 * @param oSection The current section that is processed
	 * @return true If the current section that is processed is the last one of the Accordion
	 * @private
	 */
	Accordion.prototype.isLastSection = function(oSection) {
		var aSections = this.getSections();
		//Simply check in our internal array containing all titles
		return (jQuery.inArray(oSection, aSections) === aSections.length - 1);
	};

	/**
	 * Once the Accordion is rendered, it builds the list of active controls that are included
	 * in the item navigation object. This supports arrow keys navigation.
	 * @private
	 */
	Accordion.prototype.onAfterRendering = function() {

		// Collect the dom references of the items
		var accordion = this.getDomRef();
		var leftBorder = "0px";
		var rightBorder = "0px";
		//need to make sure IE8 does not deliver medium if no border width is set
		if (jQuery(accordion).css("borderLeftStyle") !== "none") {
			leftBorder = jQuery(accordion).css("border-left-width");
		}
		if (jQuery(accordion).css("borderRightStyle") !== "none") {
			rightBorder = jQuery(accordion).css("border-right-width");
		}
		var borderTotal = parseFloat(leftBorder.substring(0, leftBorder.indexOf("px"))) + parseFloat(rightBorder.substring(0, rightBorder.indexOf("px")));
		accordion.style.height = accordion.offsetHeight - borderTotal - 7 + "px";

		this.$().sortable({
			handle: "> div.sapUiAcdSectionHdr > div",
			stop: jQuery.proxy(this._onSortChange, this)
		});
	};


	return Accordion;

}, /* bExport= */ true);
