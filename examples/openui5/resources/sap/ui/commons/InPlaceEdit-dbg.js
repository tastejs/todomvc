/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.commons.InPlaceEdit.
sap.ui.define(['jquery.sap.global', './TextField', './TextView', './library', 'sap/ui/core/Control', 'sap/ui/core/ValueStateSupport', 'sap/ui/core/theming/Parameters'],
	function(jQuery, TextField, TextView, library, Control, ValueStateSupport, Parameters) {
	"use strict";

	/**
	 * Constructor for a new InPlaceEdit.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * The InPlaceEdit is a functionality to have text in display mode that can be changed in place.
	 * @extends sap.ui.core.Control
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @since 1.8.0
	 * @alias sap.ui.commons.InPlaceEdit
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var InPlaceEdit = Control.extend("sap.ui.commons.InPlaceEdit", /** @lends sap.ui.commons.InPlaceEdit.prototype */ { metadata : {

		library : "sap.ui.commons",
		properties : {

			/**
			 * Visualizes warnings or errors related to the InPlaceEdit. Possible values: Warning, Error, Success.
			 * If the content control has a own valueState property this will be used.
			 */
			valueState : {type : "sap.ui.core.ValueState", group : "Data", defaultValue : sap.ui.core.ValueState.None},

			/**
			 * If undo is enabled after changing the text an undo button appears.
			 */
			undoEnabled : {type : "boolean", group : "Misc", defaultValue : true},

			/**
			 * Defines the visual appearance of the control.
			 * Currently this is not supported for Labels.
			 * @since 1.9.0
			 */
			design : {type : "sap.ui.commons.TextViewDesign", group : "Data", defaultValue : sap.ui.commons.TextViewDesign.Standard}
		},
		defaultAggregation : "content",
		aggregations : {

			/**
			 * Content control of the InPlaceEdit.
			 * The following controls are allowed:
			 * TextField, ComboBox, DropdownBox and Link
			 */
			content : {type : "sap.ui.core.Control", multiple : false}
		},
		events : {

			/**
			 * Event is fired when the text in the field has changed AND the focus leaves the InPlaceEdit or the Enter key is pressed.
			 */
			change : {
				parameters : {

					/**
					 * The new / changed value of the InPlaceEdit.
					 */
					newValue : {type : "string"}
				}
			},

			/**
			 * This event if fired during typing into the InPlaceEdit and returns the currently entered value. This is not the content of the value property. The value property is only updated by ENTER and by leaving the control.
			 * @since 1.16.5
			 */
			liveChange : {
				parameters : {

					/**
					 * Current value of the Textfield.
					 */
					liveValue : {type : "string"}
				}
			}
		}
	}});

	/**
	 * This file defines behavior for the control,
	 */

	/*
	 * On focus the InplaceEdit automatically switches to edit mode. Only for Links it stays in display mode to allow link-clicking.
	 * When the focus is set outside the control is switches back to display mode. So for styling it is clear that edit mode
	 * is always focused. The focusout handling must be done with a delay because in ComboBoxes the click of the expand button fires a focusout event too.
	 * So it must be checked if the focus is still inside the control.
	 * As the content controls don't bubble their property changes the _change event is handled. Because the InPlaceEdit have to react on content-changes.
	 * Changing the content needs a rerendering of the InPlaceEdit. Toggling edit mode also rerenders the control.
	 * The focusDomRef is in display mode the display control, in edit mode the edit control.
	 * So as the control often rerenders and changes the focusDomRef be careful if you put the control in an ItemNavigation. (Update the DomRefs!)
	 */

	(function() {

		InPlaceEdit.prototype.init = function(){

			this._bEditMode = false;

		};

		InPlaceEdit.prototype.exit = function(){

			this._bEditMode = undefined;
			this._oDisplayControl = undefined;
			this._oEditControl = undefined;
			this._sOldText = undefined;
			this._sOldTextAvailable = undefined;
			this._bUseEditButton = undefined;
			this._iHeight = undefined;

			if (this._oTextView) {
				this._oTextView.destroy();
				delete this._oTextView;
			}

			if (this._oTextField) {
				this._oTextField.destroy();
				delete this._oTextField;
			}

			if (this._oUndoButton) {
				this._oUndoButton.destroy();
				delete this._oUndoButton;
			}

			if (this._oEditButton) {
				this._oEditButton.destroy();
				delete this._oEditButton;
			}

			var oContent = this.getContent();
			if (oContent) {
				oContent.detachEvent("_change", handleContentInvalidate, this);
				if (oContent instanceof TextField) {
					oContent.detachEvent("change", handleContentChange, this);
					oContent.detachEvent("liveChange", handleContentLiveChange, this);
				}
			}
		};

		InPlaceEdit.prototype.onBeforeRendering = function(){

			var that = this;

			updateControls(that);

			createUndoButton(that); // create here, because if created onfocusin there are focus errors

			// set right parent for RichTooltip
			var oTooltip = this.getTooltip();
			if (oTooltip instanceof sap.ui.core.TooltipBase) {
				if (this._bEditMode) {
					oTooltip._currentControl = this._oEditControl;
				} else {
					oTooltip._currentControl = this._oDisplayControl;
				}
			}

		};

		InPlaceEdit.prototype.onAfterRendering = function(){
			//
			// Warning: This method is called several times, for example after the child controls
			//          are (re-)rendered.
			//

			// if TextView is rendered make it not focusable (only InPlaceEdit is focused)
			if (!this._bEditMode && this.getEditable() && this._oTextView && this._oTextView.getDomRef()) {
				this._oTextView.$().attr("tabindex", "0");
			}

			var $Control = this.$();
			var iInnerHeight;
			var iOuterHeight;
			// In edit mode use 100% width for edit control, because width is set outside
			if (this._bEditMode) {
				this._oEditControl.$().css("width", "100%");
				if (this._iHeight > 0) {
					// Control is in display mode higher than in edit mode
					// add margins to center edit control
					iOuterHeight = $Control.height();
					var iDelta = this._iHeight - iOuterHeight;
					// check if already margins added and add them
					var iMargins = $Control.outerHeight(true) - $Control.outerHeight(false);
					iDelta = iDelta + iMargins;
					var iMarginTop = Math.floor(iDelta / 2);
					var iMarginBottom = iDelta - iMarginTop;
					$Control.css("margin-top", iMarginTop + "px").css("margin-bottom", iMarginBottom + "px");
				}
			} else if (this._oDisplayControl.getMetadata().getName() == "sap.ui.commons.Link") {
				// edit icon should be directly next to link
				this._oDisplayControl.$().css("width", "auto").css("max-width", "100%");
			} else {
				var $DisplayControl = this._oDisplayControl.$();
				$DisplayControl.css("width", "100%");
				if (!this._iHeight && this._iHeight != 0 && this.getDesign() != sap.ui.commons.TextViewDesign.Standard) {
					// check if TextView is higher than inPlaceEdits standards height (Header design) ->
					// set to this new height even in edit mode to avoid flickering
					// special case: standard TextView has line height of textFields height in most themes
					// but font size fits. in this case the height should not be changed.
					iInnerHeight = $DisplayControl.outerHeight(true);
					iOuterHeight = $Control.innerHeight();
					if (iOuterHeight < iInnerHeight) {
						// because of box-sizing: border-box add borders to height
						var iOffset = $Control.outerHeight() - $Control.innerHeight();
						this._iHeight = iInnerHeight + iOffset;
					} else {
						this._iHeight = 0;
					}
				}
				if (this._iHeight > 0) {
					$Control.css("height", this._iHeight + "px");
				}
			}

			// if undo button is rendered remove it from tab-chain
			if (this._sOldTextAvailable && this._oUndoButton && this._oUndoButton.getDomRef()) {
				this._oUndoButton.$().attr("tabindex", "-1");
			}
			if (this._oEditButton && this._oEditButton.getDomRef()) {
				this._oEditButton.$().attr("tabindex", "-1");
			}

			if (this._delayedCallId) {
				jQuery.sap.clearDelayedCall(this._delayedCallId);
				this._delayedCallId = null;
			}

			if (this.getValueState() == sap.ui.core.ValueState.Success) {
				this._delayedCallId = jQuery.sap.delayedCall(3000, this, "removeValidVisualization");
			}

		};

		InPlaceEdit.prototype.removeValidVisualization = function() {

			var oDomRef = this.$();
			if (oDomRef) {
				oDomRef.removeClass("sapUiIpeSucc");
			}

		};


		/**
		 * Clear the old text after a change to disable the undo functionality. If undoEnabled is false this has no effect.
		 *
		 * @public
		 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
		 */
		InPlaceEdit.prototype.clearOldText = function(){

			if (!this.getUndoEnabled()) {
				return;
			}

			if (this._bEditMode) {
				this._sOldText = this._oEditControl.getValue();
				this._sOldTextAvailable = true; // because "" can be a valid text so check for sOldText will not work in this case
			} else {
				this._sOldText = undefined;
				this._sOldTextAvailable = false;
			}
			this.rerender();

		};

	/*
	 * If a label is assigned to the InPlaceEdit it need to know if it's required
	 * So check the content for required
	 * @public
	 */
		InPlaceEdit.prototype.getRequired = function(){

			if (this.getContent() && this.getContent().getRequired) {
				return this.getContent().getRequired();
			} else {
				return false;
			}

		};

		InPlaceEdit.prototype.getEditable = function(){

			var oContent = this.getContent();

			if (!oContent || (oContent.getEditable && !oContent.getEditable()) || (oContent.getEnabled && !oContent.getEnabled())) {
				// readOnly or disabled -> only display mode
				return false;
			} else {
				return true;
			}

		};

		InPlaceEdit.prototype.onsapescape = function(oEvent){

			if (this.getUndoEnabled()) {
				// Escape fires no keypress in webkit
				// In Firefox value can not be changed in keydown (onsapescape) event
				// So the escape event is stored in this._bEsc and the value in this._sValue
				if (!sap.ui.Device.browser.firefox) {
					var that = this;
					undoTextChange(that);
				} else {
					this._bEsc = true;
				}
				if (this.$().hasClass("sapUiIpeUndo")) {
					// undo is possible -> do not propagate escape (not close popup)
					oEvent.stopPropagation();
				}
				// delete TextFields escape information, because native ESC-logic not needed
				this._oEditControl._bEsc = undefined;
				this._oEditControl._sValue = undefined;
			}

		};

		InPlaceEdit.prototype.onkeypress = function(oEvent){

			// Firefox escape logic
			if (this._bEsc) {
				var that = this;
				this._bEsc = undefined;
				undoTextChange(that);
			}

		};

		InPlaceEdit.prototype.onkeydown = function(oEvent){

			if (oEvent.keyCode == jQuery.sap.KeyCodes.F2 && !this._bEditMode) {
				var that = this;
				switchToEditMode(that);
				this.$().addClass("sapUiIpeFocus");
			}

		};

		InPlaceEdit.prototype.onfocusin = function(oEvent){

			// in display mode focus is on displayControl -> simulate focus on outer DIV
			if (!this._bEditMode) {
				if (!this._bUseEditButton && oEvent.target.id != this.getId() + "--X") {
					// if not a link and not clicked on undo button -> directly switch to edit mode
					var that = this;
					switchToEditMode(that);
				}
				this.$().addClass("sapUiIpeFocus");
			} else if (this._focusDelay) {
				// foucusout handling not finished and focus again in control -> just stay in edit mode
				jQuery.sap.clearDelayedCall(this._focusDelay);
				this._focusDelay = null;
			}

		};

		InPlaceEdit.prototype.ontap = function(oEvent){

			// on iOS no focusin event is fired
			if (sap.ui.Device.os.name == "iOS") {
				this.onfocusin(oEvent);
			}

		};

		InPlaceEdit.prototype.onfocusout = function(oEvent){

			if (this._focusDelay) {
				jQuery.sap.clearDelayedCall(this._focusDelay);
				this._focusDelay = null;
			}
			this._focusDelay = jQuery.sap.delayedCall(200, this, "_handleFocusOut", arguments); // check delayed because click of ComboBox Expander (shorter than 200 sometimes don't work)

		};

		InPlaceEdit.prototype._handleFocusOut = function(oEvent){

			var oFocusedDom = document.activeElement;
			if (!jQuery.sap.containsOrEquals(this.getDomRef(), oFocusedDom)) {
				// focus is not inside of the InPlaceEdit
				// in display mode focus is on displayControl -> simulate focus on outer DIV
				if (!this._bEditMode) {
					this.$().removeClass("sapUiIpeFocus");
				}
				var that = this;
				switchToDisplayMode(that);
			}
			this._focusDelay = undefined;

		};

		InPlaceEdit.prototype.setContent = function(oContent){

			var oOldContent = this.getContent();
			if (oOldContent) {
				oOldContent.detachEvent("_change", handleContentInvalidate, this);
				if (oOldContent instanceof TextField) {
					oOldContent.detachEvent("change", handleContentChange, this);
					oOldContent.detachEvent("liveChange", handleContentLiveChange, this);
					oOldContent._propagateEsc = undefined;
				}
			}
			this._sOldText = undefined;
			this._sOldTextAvailable = false;
			this._oDisplayControl = undefined;
			this._oEditControl = undefined;

			this.setAggregation("content", oContent);

			if (oContent) {
				// As controls don't bubble their invalidate we have to use the _change event
				oContent.attachEvent("_change", handleContentInvalidate, this);
				if (oContent instanceof TextField) {
					oContent.attachEvent("change", handleContentChange, this);
					oContent.attachEvent("liveChange", handleContentLiveChange, this);
					oContent._propagateEsc = true;
				}
			}

			var that = this;
			updateControls(that);

		};

		// since some Properties and the change event are not available on all controls (Link)
		// have it as property on InPlaceEdit too. If Content-control has the property too just forward it to
		// the content control
		// ! what's about setting property before adding content? !
		InPlaceEdit.prototype.setValueState = function(oValueState) {

			var oContent = this.getContent();

			if (oContent && oContent.setValueState) {
				oContent.setValueState(oValueState);
			} else if (this._oEditControl && this._oEditControl.setValueState) {
				this._oEditControl.setValueState(oValueState);
				handleContentInvalidate.call(this);
			} else {
				this.setProperty("valueState", oValueState);
			}

		};

		InPlaceEdit.prototype.getValueState = function(){

			var oContent = this.getContent();

			if (oContent && oContent.getValueState) {
				return oContent.getValueState();
			} else if (this._oEditControl && this._oEditControl.getValueState) {
				return this._oEditControl.getValueState();
			} else {
				return this.getProperty("valueState");
			}

		};

	/**
	 * Sets a new tooltip for this InPlaceEdit. The tooltip can either be a simple string
	 * (which in most cases will be rendered as the <code>title</code> attribute of this
	 * Element) or an instance of {@link sap.ui.core.TooltipBase}.
	 *
	 * If a new tooltip is set, any previously set tooltip is deactivated.
	 *
	 * If a content control is assigned to the InPlaceEdit the tooltip of this control
	 * is used. A directly set tooltip to the InPlaceEdit is ignored in this case.
	 *
	 * @param {string|sap.ui.core.TooltipBase} oTooltip Tooltip as string or RichTooltip.
	 * @return {sap.ui.commons.InPlaceEdit} <code>this</code> to allow method chaining
	 * @public
	 */
		InPlaceEdit.prototype.setTooltip = function(oTooltip) {

			var oContent = this.getContent();

			if (oContent) {
				oContent.setTooltip(oTooltip);
			} else {
				this._refreshTooltipBaseDelegate(oTooltip);
				this.setAggregation("tooltip", oTooltip);
			}

			return this;

		};

	/**
	 * Returns the tooltip for this InPlaceEdit if any or an undefined value.
	 * The tooltip can either be a simple string or a subclass of
	 * {@link sap.ui.core.TooltipBase}.
	 *
	 * Callers that are only interested in tooltips of type string (e.g. to render
	 * them as a <code>title</code> attribute), should call the convenience method
	 * {@link #getTooltip_AsString} instead. If they want to get a tooltip text no
	 * matter where it comes from (be it a string tooltip or the text from a TooltipBase
	 * instance) then they could call {@link #getTooltip_Text} instead.
	 *
	 * If a content control is assigned to the InPlaceEdit the tooltip of this control
	 * is used. A directly set tooltip to the InPlaceEdit is ignored in this case.
	 *
	 * @return {string|sap.ui.core.TooltipBase} The tooltip for this Element.
	 * @public
	 */
		InPlaceEdit.prototype.getTooltip = function(){

			var oContent = this.getContent();

			if (oContent) {
				return oContent.getTooltip();
			} else {
				return this.getAggregation("tooltip");
			}

		};

		InPlaceEdit.prototype.setDesign = function(sDesign) {

			this.setProperty("design", sDesign);
			this._iHeight = undefined;

		};

		InPlaceEdit.prototype.clone = function(){

			// on clone don't clone event handler
			var oContent = this.getContent();
			if (oContent) {
				oContent.detachEvent("_change", handleContentInvalidate, this);
				if (oContent instanceof TextField) {
					oContent.detachEvent("change", handleContentChange, this);
					oContent.detachEvent("liveChange", handleContentLiveChange, this);
				}
			}

			var oClone = Control.prototype.clone.apply(this, arguments);

			if (oContent) {
				oContent.attachEvent("_change", handleContentInvalidate, this);
				if (oContent instanceof TextField) {
					oContent.attachEvent("change", handleContentChange, this);
					oContent.attachEvent("liveChange", handleContentLiveChange, this);
				}
			}

			return oClone;

		};

		InPlaceEdit.prototype.getFocusDomRef = function(){

			if (!this.getDomRef()) {
				// not rendered
				return undefined;
			}

			// focus is on inner control (display or edit)
			if (this._bEditMode) {
				return this._oEditControl.getFocusDomRef();
			} else {
				return this._oDisplayControl.getFocusDomRef();
			}

		};

		InPlaceEdit.prototype.getIdForLabel = function () {

			// point the label to the edit control because on tabbing in its in edit mode
			// only link must get label on it self

			if (this._oDisplayControl && this._oDisplayControl.getMetadata().getName() == "sap.ui.commons.Link") {
				return this._oDisplayControl.getId();
			} else if (this._oEditControl) {
				return this._oEditControl.getId();
			} else {
				return this.getId();
			}

		};

		InPlaceEdit.prototype.onThemeChanged = function (oEvent) {

			var that = this;
			iconForUndoButton(that);
			iconForEditButton(that);

			this._iHeight = undefined;
			if (this.getDomRef() && !this._bEditMode) {
				// if already rendered and in display mode - rerender to calculate height new
				this.rerender();
			}

		};


		// Private variables

		/**
		 * Delegate object for listening to the child elements' events.
		 * WARNING: this is set to the InPlaceEdit-instance. This is done by setting it as the second 
		 *          parameter of the addDelegate call. (See updateControls())
		 * @private
		 */
		var contentDelegate = {
			onAfterRendering : function() {
				this.onAfterRendering(); // WARNING: this means the InPlaceEdit instance
			}
		};


		// Private functions

		function updateControls(oInPlaceEdit){

			var oContent = oInPlaceEdit.getContent();
			if (!oContent) {
				return;
			}

			var oTooltip = oContent.getTooltip();

			switch (oContent.getMetadata().getName()) { // do not check with instanceof because then all classes must be loaded
			case "sap.ui.commons.TextField":
			case "sap.ui.commons.ComboBox":
			case "sap.ui.commons.DropdownBox":
				// use TextView for display
				if (!oInPlaceEdit._oTextView) {
					oInPlaceEdit._oTextView = new TextView(oInPlaceEdit.getId() + "--TV",{
						wrapping: false});
					oInPlaceEdit._oTextView.setParent(oInPlaceEdit);
					// Make sure the delegate is not there twice
					oInPlaceEdit._oTextView.removeDelegate(contentDelegate);
					oInPlaceEdit._oTextView.addDelegate(contentDelegate, oInPlaceEdit);
					oInPlaceEdit._oTextView.getTooltip = function(){
						return this.getParent().getTooltip();
					};
				}
				oInPlaceEdit._oTextView.setText(oContent.getValue());
				oInPlaceEdit._oTextView.setEnabled(oContent.getEnabled());
				oInPlaceEdit._oTextView.setTextDirection(oContent.getTextDirection());
				oInPlaceEdit._oTextView.setVisible(oContent.getVisible());
				oInPlaceEdit._oTextView.setWidth("100%"); // width is set on the outer DIV
				oInPlaceEdit._oTextView.setTextAlign(oContent.getTextAlign());
				oInPlaceEdit._oTextView.setDesign(oInPlaceEdit.getDesign());
				oInPlaceEdit._oTextView.setHelpId(oContent.getHelpId());
				oInPlaceEdit._oTextView.setAccessibleRole(oContent.getAccessibleRole());

				if (oInPlaceEdit._oTextView._oTooltip && oInPlaceEdit._oTextView._oTooltip != oTooltip) {
					oInPlaceEdit._oTextView.removeDelegate(oInPlaceEdit._oTextView._oTooltip);
					oInPlaceEdit._oTextView._oTooltip = undefined;
				}
				if (oTooltip instanceof sap.ui.core.TooltipBase) {
					if (!oInPlaceEdit._oTextView._oTooltip || oInPlaceEdit._oTextView._oTooltip != oTooltip) {
						oInPlaceEdit._oTextView.addDelegate(oTooltip);
						oInPlaceEdit._oTextView._oTooltip = oTooltip;
					}
				}

				oInPlaceEdit._oDisplayControl = oInPlaceEdit._oTextView;

				// use oContent for edit
				oInPlaceEdit._oEditControl = oContent;
				oInPlaceEdit._bUseEditButton = false;
				break;

			case "sap.ui.commons.Link":
				// use Link for display
				oInPlaceEdit._oDisplayControl = oContent;

				// Make sure the delegate is not there twice
				oInPlaceEdit._oDisplayControl.removeDelegate(contentDelegate);
				oInPlaceEdit._oDisplayControl.addDelegate(contentDelegate, oInPlaceEdit);

				// use TextField for edit
				if (oInPlaceEdit._oTextField) {
					oInPlaceEdit._oTextField.setValue(oContent.getText());
					oInPlaceEdit._oTextField.setWidth("100%");

					oInPlaceEdit._oEditControl = oInPlaceEdit._oTextField;

					if (oInPlaceEdit._oTextField._oTooltip && oInPlaceEdit._oTextField._oTooltip != oTooltip) {
						oInPlaceEdit._oTextField.removeDelegate(oInPlaceEdit._oTextField._oTooltip);
						oInPlaceEdit._oTextField._oTooltip = undefined;
					}
					if (oTooltip instanceof sap.ui.core.TooltipBase) {
						if (!oInPlaceEdit._oTextField._oTooltip || oInPlaceEdit._oTextField._oTooltip != oTooltip) {
							oInPlaceEdit._oTextField.addDelegate(oTooltip);
							oInPlaceEdit._oTextField._oTooltip = oTooltip;
						}
					}
				}

				// for link an edit button is needed to allow the link click
				createEditButton(oInPlaceEdit);
				oInPlaceEdit._bUseEditButton = true;
				break;

			default:
				throw new Error("Control not supported for InPlaceEdit");
			}

		}

		function switchToEditMode(oInPlaceEdit){

			if (!oInPlaceEdit._bEditMode && oInPlaceEdit.getEditable()) {
				// switch to edit mode
				if (!oInPlaceEdit._oEditControl && oInPlaceEdit.getContent().getMetadata().getName() == "sap.ui.commons.Link") {
					// for Link - create TextField (Only on first edit mode to do not have it if not needed)
					var sValueState = oInPlaceEdit.getValueState(); // initially get ValueState from property, after this its stored on the TextField
					oInPlaceEdit._oTextField = new TextField(oInPlaceEdit.getId() + "--input",{
						valueState: sValueState});
					oInPlaceEdit._oTextField.setParent(oInPlaceEdit);
					oInPlaceEdit._oTextField.attachEvent('change', handleTextFieldChange, oInPlaceEdit); // attach event this way to have the right this-reference in handler
					oInPlaceEdit._oTextField.attachEvent('liveChange', handleContentLiveChange, oInPlaceEdit); // attach event this way to have the right this-reference in handler
					oInPlaceEdit._oTextField._propagateEsc = true;
					oInPlaceEdit._oTextField.getTooltip = function(){
						return this.getParent().getTooltip();
					};
				}

				if (!oInPlaceEdit._sOldTextAvailable && oInPlaceEdit.getUndoEnabled()) {
					// only remember original text, not by toggling between edit and display
					oInPlaceEdit._sOldText = getContentText(oInPlaceEdit);
					oInPlaceEdit._sOldTextAvailable = true;
				}
				oInPlaceEdit._bEditMode = true;
				oInPlaceEdit.rerender();
				oInPlaceEdit._oEditControl.focus();
			}

		}

		function switchToDisplayMode(oInPlaceEdit){

			if (oInPlaceEdit._bEditMode && oInPlaceEdit.getEditable()) {
				// switch to edit mode
				oInPlaceEdit._bEditMode = false;
				if (oInPlaceEdit._sOldText == getContentText(oInPlaceEdit)) {
					// nothing changed
					oInPlaceEdit._sOldText = undefined;
					oInPlaceEdit._sOldTextAvailable = false;
				}
				oInPlaceEdit.rerender();
			}

		}

		function getContentText(oInPlaceEdit){

			var oContent = oInPlaceEdit.getContent();
			if (!oContent) {
				return undefined;
			}

			if (oContent.getValue) {
				return oContent.getValue();
			} else if (oContent.getText) {
				return oContent.getText();
			}

		}

		function createUndoButton(oInPlaceEdit){

			if (!oInPlaceEdit._oUndoButton && oInPlaceEdit.getUndoEnabled()) {
				oInPlaceEdit._oUndoButton = new sap.ui.commons.Button(oInPlaceEdit.getId() + "--X",{
					lite: true
				}).setParent(oInPlaceEdit);
				iconForUndoButton(oInPlaceEdit);
				oInPlaceEdit._oUndoButton.attachEvent('press', handleUndoButtonPress, oInPlaceEdit); // attach event this way to have the right this-reference in handler
			}

			if (oInPlaceEdit._oUndoButton) {
				// disable undoButton if field is disabled or readonly
				oInPlaceEdit._oUndoButton.setEnabled(oInPlaceEdit.getEditable());
			}

		}

		function iconForUndoButton(oInPlaceEdit){

			if (oInPlaceEdit._oUndoButton) {
				var sIcon = Parameters.get('sapUiIpeUndoImageURL');
				var sIconHovered = Parameters.get('sapUiIpeUndoImageDownURL');
				var sThemeModuleName = "sap.ui.commons.themes." + sap.ui.getCore().getConfiguration().getTheme();
				if (sIcon) {
					sIcon = jQuery.sap.getModulePath(sThemeModuleName, sIcon);
				} else {
					sIcon = "sap-icon://decline";
				}
				if (sIconHovered) {
					sIconHovered = jQuery.sap.getModulePath(sThemeModuleName, sIconHovered);
				}
				oInPlaceEdit._oUndoButton.setIcon(sIcon);
				oInPlaceEdit._oUndoButton.setIconHovered(sIconHovered);
			}

		}

		function handleUndoButtonPress(oEvent){

			var that = this;
			undoTextChange(that);

			if (this._bEditMode) {
				this._oEditControl.focus();
				this.$().removeClass("sapUiIpeUndo");
			}

		}

		function undoTextChange(oInPlaceEdit){

			// change text back to old value (only if value changed -> undo button visible)
			if (oInPlaceEdit.getUndoEnabled() && oInPlaceEdit._sOldTextAvailable) {
				var oContent = oInPlaceEdit.getContent();
				if (!oContent) {
					return;
				}

				if (oContent.setValue) {
					oContent.setValue(oInPlaceEdit._sOldText);
				} else if (oContent.setText) {
					oContent.setText(oInPlaceEdit._sOldText);
				}
				if (oInPlaceEdit._bEditMode) {
					// to be sure that text is updated in edit mode (e.g. Link case) - update edit control
					oInPlaceEdit._oEditControl.setValue(oInPlaceEdit._sOldText);
					oInPlaceEdit._oEditControl.fireChange({newValue:oInPlaceEdit._sOldText});
				}else if (oContent.fireChange) {
					// fire change event
					oContent.fireChange({newValue:oInPlaceEdit._sOldText});
				} else {
					// fire InPlaceEdit change event
					oInPlaceEdit.fireChange({newValue:oInPlaceEdit._sOldText});
				}

				if (!oInPlaceEdit._bEditMode) {
					oInPlaceEdit._sOldText = undefined;
					oInPlaceEdit._sOldTextAvailable = false;
				}
			}

		}

		function createEditButton(oInPlaceEdit){

			if (!oInPlaceEdit._oEditButton) {
				oInPlaceEdit._oEditButton = new sap.ui.commons.Button(oInPlaceEdit.getId() + "--Edit",{
					lite: true
				}).setParent(oInPlaceEdit);
				oInPlaceEdit._oEditButton.addStyleClass("sapUiIpeEBtn");
				iconForEditButton(oInPlaceEdit);
				oInPlaceEdit._oEditButton.attachEvent('press', handleEditButtonPress, oInPlaceEdit); // attach event this way to have the right this-reference in handler
			}

		}

		function iconForEditButton(oInPlaceEdit){

			if (oInPlaceEdit._oEditButton) {
				var sIcon = Parameters.get('sapUiIpeEditImageURL');
				var sIconHovered = Parameters.get('sapUiIpeEditImageDownURL');
				var sThemeModuleName = "sap.ui.commons.themes." + sap.ui.getCore().getConfiguration().getTheme();
				if (sIcon) {
					sIcon = jQuery.sap.getModulePath(sThemeModuleName, sIcon);
				} else {
					sIcon = "sap-icon://edit";
				}
				if (sIconHovered) {
					sIconHovered = jQuery.sap.getModulePath(sThemeModuleName, sIconHovered);
				}
				oInPlaceEdit._oEditButton.setIcon(sIcon);
				oInPlaceEdit._oEditButton.setIconHovered(sIconHovered);
			}

		}

		function handleEditButtonPress(oEvent){

			var that = this;
			switchToEditMode(that);
			this.$().addClass("sapUiIpeFocus");

		}

		function handleTextFieldChange(oEvent){

			var oContent = this.getContent();

			if (oContent.setText) {
				var sNewValue = oEvent.getParameter("newValue");
				oContent.setText(sNewValue);
				handleContentChange.apply(this, arguments);
			}

		}

		function handleContentChange(oEvent){

			if (this._sOldText != oEvent.getParameter("newValue") && this.getUndoEnabled()) {
				this.$().addClass("sapUiIpeUndo");
			} else {
				this.$().removeClass("sapUiIpeUndo");
			}

			this.fireChange(oEvent.getParameters());

		}

		function handleContentLiveChange(oEvent){

			if (this._sOldText != oEvent.getParameter("liveValue") && this.getUndoEnabled()) {
				this.$().addClass("sapUiIpeUndo");
			} else {
				this.$().removeClass("sapUiIpeUndo");
			}

			this.fireLiveChange({liveValue:oEvent.getParameter("liveValue")});

		}

		function handleContentInvalidate(){

			if (!this._bEditMode) {
				//in edit mode TextField change must only checked by switch do display mode
				this.invalidate();
			} else {
				//if valueState changes -> class must be adopted on outer DIV but do not rerender
				switch (this.getValueState()) {
				case (sap.ui.core.ValueState.Error) :
					if (!this.$().hasClass('sapUiIpeErr')) {
						this.$().addClass('sapUiIpeErr');
						this.$().removeClass('sapUiIpeWarn');
						this.$().removeClass('sapUiIpeSucc');
					}
				break;
				case (sap.ui.core.ValueState.Success) :
					if (!this.$().hasClass('sapUiIpeSucc')) {
						this.$().addClass('sapUiIpeSucc');
						this.$().removeClass('sapUiIpeErr');
						this.$().removeClass('sapUiIpeWarn');
					}
				break;
				case (sap.ui.core.ValueState.Warning) :
					if (!this.$().hasClass('sapUiIpeWarn')) {
						this.$().addClass('sapUiIpeWarn');
						this.$().removeClass('sapUiIpeErr');
						this.$().removeClass('sapUiIpeSucc');
					}
				break;
				default:
					this.$().removeClass('sapUiIpeWarn');
					this.$().removeClass('sapUiIpeErr');
					this.$().removeClass('sapUiIpeSucc');
				break;
				}
			}

		}

	}());

	return InPlaceEdit;

}, /* bExport= */ true);
