/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.commons.TextField.
sap.ui.define(['jquery.sap.global', './library', 'sap/ui/core/Control', 'sap/ui/core/ValueStateSupport'],
	function(jQuery, library, Control, ValueStateSupport) {
	"use strict";

	/**
	 * Constructor for a new TextField.
	 *
	 * @param {string} [sID] id for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * Renders a input field for text input.
	 * @extends sap.ui.core.Control
	 * @implements sap.ui.commons.ToolbarItem
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @alias sap.ui.commons.TextField
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var TextField = Control.extend("sap.ui.commons.TextField", /** @lends sap.ui.commons.TextField.prototype */ { metadata : {

		interfaces : [
			"sap.ui.commons.ToolbarItem"
		],
		library : "sap.ui.commons",
		properties : {

			/**
			 * Text inside the <code>TextField</code>
			 * @SecSource {return} The <code>value</code> property of the TextField control and its subclasses represents unfiltered user input.
			 * Applications must ensure that the data is either validated / cleansed or that it is not used in a context which is sensible to XSS attacks.
			 */
			value : {type : "string", group : "Data", defaultValue : '', bindable : "bindable"},

			/**
			 * Direction of the text. Possible values: "rtl", "ltr".
			 */
			textDirection : {type : "sap.ui.core.TextDirection", group : "Appearance", defaultValue : sap.ui.core.TextDirection.Inherit},

			/**
			 * Switches enabled state of the control. Disabled fields have different colors, and can not be focused.
			 */
			enabled : {type : "boolean", group : "Behavior", defaultValue : true},

			/**
			 * Switches edit state of the control. Read-only fields have different colors, depending on theme setting.
			 */
			editable : {type : "boolean", group : "Behavior", defaultValue : true},

			/**
			 * Depending on theme the <code>TextField</code> is shown as required.
			 * If a <code>Label</code> is assigned to the <code>TextField</code> it will visualize the requires state too.
			 */
			required : {type : "boolean", group : "Appearance", defaultValue : false},

			/**
			 * Width of text field. When it is set (CSS-size such as % or px), this is the exact size. When left blank, the text field length defines the width.
			 */
			width : {type : "sap.ui.core.CSSSize", group : "Dimension", defaultValue : null},

			/**
			 * Maximum number of characters. Value '0' means the feature is switched off.
			 */
			maxLength : {type : "int", group : "Behavior", defaultValue : 0},

			/**
			 * Visualizes warnings or errors related to the text field. Possible values: Warning, Error, Success.
			 */
			valueState : {type : "sap.ui.core.ValueState", group : "Data", defaultValue : sap.ui.core.ValueState.None},

			/**
			 * Sets the horizontal alignment of the text.
			 */
			textAlign : {type : "sap.ui.core.TextAlign", group : "Appearance", defaultValue : sap.ui.core.TextAlign.Begin},

			/**
			 * State of the Input Method Editor (IME).
			 */
			imeMode : {type : "sap.ui.core.ImeMode", group : "Behavior", defaultValue : sap.ui.core.ImeMode.Auto},

			/**
			 * Font type. valid values are Standard and Monospace.
			 */
			design : {type : "sap.ui.core.Design", group : "Appearance", defaultValue : sap.ui.core.Design.Standard},

			/**
			 * Unique identifier used for help service.
			 */
			helpId : {type : "string", group : "Behavior", defaultValue : ''},

			/**
			 * Accessibility role for the text field.
			 */
			accessibleRole : {type : "sap.ui.core.AccessibleRole", group : "Accessibility", defaultValue : sap.ui.core.AccessibleRole.Textbox},

			/**
			 * The <code>name</code> property to be used in the HTML code (e.g. for HTML forms that send data to the server via 'submit').
			 */
			name : {type : "string", group : "Misc", defaultValue : null},

			/**
			 * Placeholder for the text field.
			 * @since 1.14.0
			 */
			placeholder : {type : "string", group : "Appearance", defaultValue : null}
		},
		associations : {

			/**
			 * Association to controls / IDs which describe this control (see WAI-ARIA attribute aria-describedby).
			 */
			ariaDescribedBy : {type : "sap.ui.core.Control", multiple : true, singularName : "ariaDescribedBy"}, 

			/**
			 * Association to controls / IDs which label this control (see WAI-ARIA attribute aria-labelledby).
			 */
			ariaLabelledBy : {type : "sap.ui.core.Control", multiple : true, singularName : "ariaLabelledBy"}
		},
		events : {

			/**
			 * Event is fired when the text in the field has changed AND the focus leaves the TextField or the Enter key is pressed.
			 */
			change : {
				parameters : {

					/**
					 * The new / changed value of the <code>TextField</code>.
					 */
					newValue : {type : "string"}
				}
			},

			/**
			 * This event if fired during typing into the <code>TextField</code> and returns the currently entered value.
			 * <b>Note:</b> This is not the content of the value property.
			 * The value property is only updated by ENTER and by leaving the control.
			 */
			liveChange : {
				parameters : {

					/**
					 * Current visible value of the <code>TextField</code>.
					 */
					liveValue : {type : "string"}
				}
			}
		}
	}});

	TextField.prototype.init = function() {

		// currently empty but defined to add on Child controls (ComboBox...)
		// for later use.

	};

	TextField.prototype.onAfterRendering = function() {

		if (sap.ui.Device.browser.internet_explorer) {
			// as IE fires oninput event directly after rendering if value contains special characters (like Ü,Ö,Ä)
			// compare first value in first oninput event with rendered one
			var $input = jQuery(this.getInputDomRef());
			this._sRenderedValue = $input.val();
		}

	};

	/**
	 * Event handler called when control is receiving the focus
	 *
	 * @param {jQuery.Event} oEvent The event object.
	 * @protected
	 */
	TextField.prototype.onfocusin = function(oEvent) {

		if (this.getEditable() && this.getEnabled() && this.getRenderer().onfocus) {
			this.getRenderer().onfocus(this);
		}

	};

	/**
	 * Event handler called when control is losing the focus
	 *
	 * @param {jQuery.Event} oEvent The event object.
	 * @protected
	 */
	TextField.prototype.onsapfocusleave = function(oEvent) {

		// restore old value in case of escape key (not possible in onsapescape in firefox)
		// happens e.g. in table because focus is set outside TextField
		this._doOnEscape(oEvent);

		this._checkChange(oEvent);

		if (this.getEditable() && this.getEnabled() && this.getRenderer().onblur) {
			this.getRenderer().onblur(this);
		}

		// if control is left action mode is ended
		var $FocusDomRef = jQuery(this.getFocusDomRef());
		if ($FocusDomRef.data("sap.InNavArea") === false) { // check for false to avoid undefined
			$FocusDomRef.data("sap.InNavArea", true);
		}

	};

	/**
	 * Event handler called when enter key is pressed.
	 * @param {jQuery.Event} oEvent The event object.
	 * @see sap.ui.commons.TextField#onfocusout
	 * @protected
	 */
	TextField.prototype.onsapenter = function(oEvent) {
		this._checkChange(oEvent);
	};

	/**
	 * Compares the previous value with the current value and fires the change event
	 * if the TextField is editable and the value has changed.
	 *
	 * @param {jQuery.Event} oEvent The event object.
	 * @protected
	 */
	TextField.prototype._checkChange = function(oEvent) {
		var oInput = this.getInputDomRef(),
			newVal = oInput && oInput.value,
			oldVal = this.getValue();

		if (this.getEditable() && this.getEnabled() && (oldVal != newVal)) {
			this.setProperty("value", newVal, true); // suppress rerendering
			this.fireChange({newValue:newVal}); // oldValue is not that easy in ComboBox and anyway not in API... thus skip it
		}
	};

	/**
	 * Event handler called when text selection starts.
	 * When the text field is disabled, the text should not be selectable, so cancel the event.
	 *
	 * @param {jQuery.Event} oEvent The event object.
	 * @protected
	 */
	TextField.prototype.onselectstart = function(oEvent) {
		if (!this.getEnabled()) {
			oEvent.preventDefault();
			oEvent.stopPropagation();
		}
	};

	//******************************************
	//Special handling for TextFields in ItemNavigation

	TextField.prototype._checkCursorPosForNav = function(oEvent, bForward) {
		var bRtl = sap.ui.getCore().getConfiguration().getRTL();
		var bBack = bForward ? bRtl : !bRtl;
		var $input = jQuery(this.getInputDomRef());
		var iPos = $input.cursorPos();
		var iLen = $input.val().length;
		if (bRtl) {
			iPos = iLen - iPos;
		}
		if ((!bBack && iPos != iLen) || (bBack && iPos != 0)) {
			oEvent.stopPropagation();
		}
	};

	TextField.prototype.onsapnext = function(oEvent) {

		if (oEvent.keyCode != jQuery.sap.KeyCodes.ARROW_DOWN) { //Only interested in left / right
			if (jQuery(this.getFocusDomRef()).data("sap.InNavArea") && oEvent.keyCode != jQuery.sap.KeyCodes.END) {
				// parent handles arrow navigation
				oEvent.preventDefault();
				return;
			}

			this._checkCursorPosForNav(oEvent, true);
		}

	};

	TextField.prototype.onsapprevious = function(oEvent) {
		if (oEvent.keyCode != jQuery.sap.KeyCodes.ARROW_UP) { //Only interested in left / right
			if (jQuery(this.getFocusDomRef()).data("sap.InNavArea") && oEvent.keyCode != jQuery.sap.KeyCodes.HOME) {
				// parent handles arrow navigation
				oEvent.preventDefault();
				return;
			}

			this._checkCursorPosForNav(oEvent, false);
		}
	};

	TextField.prototype.onsapnextmodifiers = TextField.prototype.onsapnext;
	TextField.prototype.onsappreviousmodifiers = TextField.prototype.onsapprevious;
	TextField.prototype.onsapend = TextField.prototype.onsapnext;
	TextField.prototype.onsaphome = TextField.prototype.onsapprevious;

	TextField.prototype.onsapexpand = function(oEvent){

		// as Form handles this to expand or collapse containers it must be prevented in TextField
		// to allow usage of numpad + and -
		var bInNavArea = jQuery(this.getFocusDomRef()).data("sap.InNavArea");
		if (bInNavArea || bInNavArea === false) {
			// parent handles arrow navigation
			oEvent.stopPropagation();
			return;
		}

	};

	TextField.prototype.onsapcollapse = TextField.prototype.onsapexpand;

	//******************************************

	/*
	 * Escape fires no keypress in webkit
	 * In Firefox value can not be changed in keydown (onsapescape) event
	 * So the escape event is stored in this._bEsc and the value in this._sValue
	 * Onkeypress and onfocusout the value is reseted. (focusout e.g. needed in table)
	 * the value must be set to the old one before the changes
	 * @protected
	 */
	TextField.prototype.onsapescape = function(oEvent) {

		var sValue = this.getProperty("value");
		this._bEsc = true;
		this._sValue = sValue;

		// as value change is handled in firefox in onkeypress the escape event must be directly stopped here
		var oInput = this.getInputDomRef();
		if (oInput && oInput.value !== sValue && !this._propagateEsc) {
			// if TextField is on a popup, don't close the popup if the value is just reseted
			// in InPlaceEdit propagation is needed
			oEvent.stopPropagation();
		}

		if (!sap.ui.Device.browser.firefox) {
			this._doOnEscape(oEvent);
		}

	};

	TextField.prototype.onkeydown = function(oEvent) {

		if (oEvent.which == jQuery.sap.KeyCodes.Z && oEvent.ctrlKey && !oEvent.altKey) {
			// prevent browsers standard history logic because different in different browsers
			oEvent.preventDefault();
		}

	};

	/*
	 * Event handler for keypress
	 * in Firefox the escape value must be reseted here
	 * (if on keyup there while pressing the escape key an old value is displayed)
	 * fire the liveChange event
	 * @protected
	 */
	TextField.prototype.onkeypress = function(oEvent) {

		this._doOnEscape(oEvent);

		var iKC = oEvent.which;
		// in FireFox keypress is fired for all keys, in other browsers only for characters. But in IE also for ESC

		if ( iKC > 0 && iKC !== jQuery.sap.KeyCodes.ESCAPE ) {
			// if text is edited -> switch to action mode
			var $FocusDomRef = jQuery(this.getFocusDomRef());
			if ($FocusDomRef.data("sap.InNavArea")) {
				$FocusDomRef.data("sap.InNavArea", false);
			}
		}

	};

	/*
	 * sets the old value after escape
	 * if in edit mode -> switch back to navigation mode
	 * @private
	 */
	TextField.prototype._doOnEscape = function(oEvent) {

		if (this._bEsc) {
			// restore old value in case of escape key (not possible in onsapescape in Firefox)
			// in Edit mode switch back to navigation mode
			var oInput = this.getInputDomRef();
			if (oInput) {
				if (oInput.value !== this._sValue) {
					jQuery(oInput).val(this._sValue);
				}
				var $FocusDomRef = jQuery(this.getFocusDomRef());
				if ($FocusDomRef.data("sap.InNavArea") === false) { // check for false to avoid undefined
					$FocusDomRef.data("sap.InNavArea", true);
				}
			}
			this._fireLiveChange(oEvent);
			this._bEsc = undefined;
			this._sValue = undefined;
		}

	};

	/**
	 * Event handler for keyup.
	 * fire the liveChange event
	 * @param {jQuery.Event} oEvent The event object.
	 * @protected
	 */
	TextField.prototype.onkeyup = function(oEvent) {

		if (oEvent.keyCode == jQuery.sap.KeyCodes.F2) {
			// toggle action mode
			var $FocusDomRef = jQuery(this.getFocusDomRef());
			if ($FocusDomRef.data("sap.InNavArea")) {
				$FocusDomRef.data("sap.InNavArea", false);
			} else if ($FocusDomRef.data("sap.InNavArea") === false) { // check for false to avoid undefined
				$FocusDomRef.data("sap.InNavArea", true);
			}
		} else if ((sap.ui.Device.browser.msie && sap.ui.Device.browser.version < 10) &&
					(oEvent.which === jQuery.sap.KeyCodes.DELETE || oEvent.which === jQuery.sap.KeyCodes.BACKSPACE)) {
			this._fireLiveChange(oEvent);
		}else if ((sap.ui.Device.browser.msie && sap.ui.Device.browser.version < 9) &&
		          (oEvent.keyCode != jQuery.sap.KeyCodes.TAB && oEvent.keyCode != jQuery.sap.KeyCodes.ENTER
		           && oEvent.keyCode != jQuery.sap.KeyCodes.F4)) {
			// as IE8 has no oninput event
			this._fireLiveChange(oEvent);
		}

	};

	TextField.prototype.oninput = function(oEvent) {

		if (!this._realOninput(oEvent)) {
			return;
		}

		this._fireLiveChange(oEvent);

	};

	TextField.prototype._realOninput = function(oEvent) {

		if (sap.ui.Device.browser.internet_explorer) {
			// as IE fires oninput event directly after rendering if value contains special characters (like Ü,Ö,Ä)
			// compare first value in first oninput event with rendered one
			var $input = jQuery(this.getInputDomRef());
			var sRenderedValue = this._sRenderedValue;
			this._sRenderedValue = undefined;
			if (sRenderedValue == $input.val()) {
				return false;
			}
		}

		return true;

	};

	/**
	 * Handler for live change
	 * reads the current content and fires the liveChange event
	 * @param {jQuery.Event} oEvent The event object.
	 * @private
	 */
	TextField.prototype._fireLiveChange = function(oEvent) {

		if (this.getEnabled() && this.getEditable()) {
			var sLiveValue = jQuery(this.getInputDomRef()).val();
			this.fireLiveChange({liveValue:sLiveValue});
		}

	};

	/* Overwrite of generated function - no new JS-doc.
	 * Property setter for the ValueState
	 *
	 * @param {sap.ui.core.ValueState} oValueState
	 * @return {sap.ui.commons.TextField} <code>this</code> to allow method chaining
	 * @public
	 */
	TextField.prototype.setValueState = function(oValueState) {

		var oldValueState = this.getValueState();
		this.setProperty("valueState", oValueState, true); // do not render again
		oValueState = this.getValueState();

		if ( oldValueState == oValueState ) {
			return this;
		}

		if (!this.getDomRef()) {
			//not already rendered.
			return this;
		}

		if (this.getRenderer().setValueState) {
			this.getRenderer().setValueState(this, oldValueState, oValueState);
		}

		if (this.delayedCallId) {
			jQuery.sap.clearDelayedCall(this.delayedCallId);
			this.delayedCallId = null;
		}
		if (sap.ui.core.ValueState.Success == oValueState) {
			this.delayedCallId = jQuery.sap.delayedCall(3000, this, "removeValidVisualization");
		}

		return this;
	};

	TextField.prototype.removeValidVisualization = function() {
		if (this.getRenderer().removeValidVisualization) {
			this.getRenderer().removeValidVisualization(this);
		}
	};

	/* Overwrite of generated function - no new JS-doc.
	 * Property setter for the editable state
	 *
	 * @param bEditable
	 * @return {sap.ui.commons.TextField} <code>this</code> to allow method chaining
	 * @public
	 */
	TextField.prototype.setEditable = function(bEditable) {

		var bOldEditable = this.getEditable();
		this.setProperty('editable', bEditable, true); // No re-rendering
		bEditable = this.getEditable();

		if (bOldEditable != bEditable) {
			if (this.getDomRef() && this.getRenderer().setEditable) {
				this.getRenderer().setEditable(this, bEditable);
			}
		}

		return this;
	};

	/* Overwrite of generated function - no new JS-doc.
	 * Property setter for the enabled state
	 *
	 * @param bEnabled
	 * @return {sap.ui.commons.TextField} <code>this</code> to allow method chaining
	 * @public
	 */
	TextField.prototype.setEnabled = function(bEnabled) {

		var bOldEnabled = this.getEnabled();
		this.setProperty('enabled', bEnabled, true); // No re-rendering
		bEnabled = this.getEnabled();

		if (bOldEnabled != bEnabled) {
			if (this.getDomRef() && this.getRenderer().setEnabled) {
				this.getRenderer().setEnabled(this, bEnabled);
			}
		}

		return this;
	};

	/* Overwrite of generated function - no new JS-doc.
	 * Property setter for the Required-State
	 *
	 * @param bRequired:
	 * @return {sap.ui.commons.TextField} <code>this</code> to allow method chaining
	 * @public
	 */
	TextField.prototype.setRequired = function(bRequired) {

		var bOldRequired = this.getRequired();
		this.setProperty('required', bRequired, true); // No re-rendering
		bRequired = this.getRequired();

		if (bOldRequired != bRequired) {
			if (this.getDomRef()) {
				// If already rendered, adapt rendered control without complete re-rendering
				if (this.getRenderer().setRequired) {
					this.getRenderer().setRequired(this, bRequired);
				}
			}

			// fire internal event to inform Label about the change
			this.fireEvent("requiredChanged", {required: bRequired});
		}

		return this;
	};

	/* Overwrite of generated function - no new JS-doc.
	 * Property setter for the Design
	 *
	 * @param sDesign:
	 * @return {sap.ui.commons.TextField} <code>this</code> to allow method chaining
	 * @public
	 */
	TextField.prototype.setDesign = function(sDesign) {

		var sOldDesign = this.getDesign();
		this.setProperty('design', sDesign, true); // No re-rendering
		sDesign = this.getDesign();

		if (sOldDesign != sDesign) {
			if (this.getDomRef()) {
				// If already rendered, adapt rendered control without complete re-rendering
				if (this.getRenderer().setDesign) {
					this.getRenderer().setDesign(this, sDesign);
				}
			}
		}

		return this;
	};

	/* Overwrite of generated function - no new JS-doc.
	 * Property setter for the Value
	 *
	 * @param sValue:
	 * @return {sap.ui.commons.TextField} <code>this</code> to allow method chaining
	 * @public
	 */
	TextField.prototype.setValue = function(sValue) {
		var newValue = sValue;
		if ( newValue && newValue.length > this.getMaxLength() && this.getMaxLength() > 0) {
			newValue = newValue.substring(0,this.getMaxLength());
		}

		this.setProperty("value", newValue, true); // no re-rendering!
		newValue = this.getValue(); // to use validated value
		var oInput = this.getInputDomRef();
		if (oInput && oInput.value !== newValue) {
			if (!sap.ui.Device.support.input.placeholder) {
				if (newValue) {
					this.$().removeClass('sapUiTfPlace');
					oInput.value = newValue;
				} else if (document.activeElement !== oInput) {
					this.$().addClass('sapUiTfPlace');
					var sPlaceholder = this.getPlaceholder();
					if (this.getRenderer().convertPlaceholder) {
						sPlaceholder = this.getRenderer().convertPlaceholder(this);
					}
					oInput.value = sPlaceholder;
				} else {
					oInput.value = "";
				}
			} else {
				oInput.value =  newValue;
			}
			this._sRenderedValue = newValue;
		}

		return this;
	};

	/* Overwrite of generated function - no new JS-doc.
	 * Property setter for the Tooltip
	 *
	 * @param oTooltip:
	 * @return {sap.ui.commons.TextField} <code>this</code> to allow method chaining
	 * @public
	 */
	TextField.prototype.setTooltip = function(oTooltip) {
		this._refreshTooltipBaseDelegate(oTooltip);
		this.setAggregation("tooltip", oTooltip, true);
		var oInputDomRef = this.getInputDomRef();

		if (oInputDomRef) {
			var sTooltip = ValueStateSupport.enrichTooltip(this, this.getTooltip_AsString());
			jQuery(oInputDomRef).attr("title", sTooltip || "");

			if (this._getRenderOuter()) {
				// if InputDomRef exits DomRef must exist too
				jQuery(this.getDomRef()).attr("title", sTooltip || "");
			}
		}

		return this;
	};

	/**
	 * Method for accessing the DOM Ref of the input element.
	 * @return {object} DOM reference or null
	 * @protected
	 */
	TextField.prototype.getInputDomRef = function(){

		if (!this._getRenderOuter()) {
			return this.getDomRef() || null;
		} else {
			return this.getDomRef("input") || null;
		}

	};

	/**
	 * Applies the focus info
	 * overwrite of the Element method because in IE8 on rerendering focus is lost
	 * @param {object} oFocusInfo Focus information
	 * @return {object} reference to this
	 * @protected
	 */
	TextField.prototype.applyFocusInfo = function (oFocusInfo) {

		if (!!sap.ui.Device.browser.internet_explorer && sap.ui.Device.browser.version == 8) {
			var oPos = this.getValue().length;
			var that = this;
			setTimeout(function(){
				that.focus();
				that._restoreUnsavedUserInput(oFocusInfo.userinput);
				jQuery(that.getFocusDomRef()).cursorPos(oPos);
			}, 0);
		} else {
			this.focus();
			this._restoreUnsavedUserInput(oFocusInfo.userinput);
		}
		return this;
	};

	/**
	 * Returns an object representing the serialized focus information
	 * @return {object} an object representing the serialized focus information
	 * @protected
	 * @function
	 */
	TextField.prototype.getFocusInfo = function () {
		return {id: this.getId(), userinput: this._getUnsavedUserInputInfo()};
	};

	/**
	 * Returns the current value of the <code>TextField</code>.
	 * In case of editing the <code>TextField</code> you can access the current value via this method.
	 * The validated value is accessible via the property value.
	 *
	 * @return {string} live value
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	TextField.prototype.getLiveValue = function() {
		var oIDomRef = this.getInputDomRef();
		if (oIDomRef) {
			return jQuery(oIDomRef).val();
		} else {
			return this.getValue();
		}
	};

	TextField.prototype.ondrop = function(oEvent) {

		if (sap.ui.Device.browser.firefox) {
			this.focus();
		}

	};

	/*
	 * check if outer content is rendered
	 * @private
	 */
	TextField.prototype._getRenderOuter = function () {

		if (this.bRenderOuter == undefined) {
			var oRenderer = this.getRenderer();
			if (oRenderer.renderOuterAttributes || oRenderer.renderOuterContentBefore || oRenderer.renderOuterContent) {
				this.bRenderOuter = true;
			} else {
				this.bRenderOuter = false;
			}
		}
		return this.bRenderOuter;

	};

	/*
	 * Overwrites default implementation
	 * the label must point to the input tag
	 * @public
	 */
	TextField.prototype.getIdForLabel = function () {

		if (!this._getRenderOuter()) {
			return this.getId();
		} else {
			return this.getId() + '-input';
		}

	};

	/*
	 * Overwrites default implementation
	 * the focus is always on the input field
	 * @public
	 */
	TextField.prototype.getFocusDomRef = function() {

		return this.getInputDomRef();

	};


	TextField.prototype._getUnsavedUserInputInfo = function() {
		var $tf = this.$();
		if ($tf.length && $tf.hasClass("sapUiTfFoc") && !$tf.hasClass("sapUiTfPlace") && this.getEnabled() && this.getEditable()){
			var sVal = jQuery(this.getInputDomRef()).val();
			var sValue = this.getValue();
			if (sVal != sValue){
				return {userinput: sVal, value: sValue};
			}
		}
		return null;
	};

	TextField.prototype._restoreUnsavedUserInput = function(oUnsavedUserInputInfo) {
		if (oUnsavedUserInputInfo && this.getEnabled() && this.getEditable() && this.getValue() == oUnsavedUserInputInfo.value){
			var sVal = oUnsavedUserInputInfo.userinput;
			if ( sVal && sVal.length > this.getMaxLength() && this.getMaxLength() > 0) {
				sVal = sVal.substring(0,this.getMaxLength());
			}

			jQuery(this.getInputDomRef()).val(sVal);
		}
	};


	return TextField;

}, /* bExport= */ true);
