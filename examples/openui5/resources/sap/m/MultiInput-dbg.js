/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.m.MultiInput.
sap.ui.define(['jquery.sap.global', './Input', './Token', './library', 'sap/ui/core/Item'],
	function(jQuery, Input, Token, library, Item) {
	"use strict";


	
	/**
	 * Constructor for a new MultiInput.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * MultiInput provides functionality to add / remove / enter tokens
	 * @extends sap.m.Input
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @alias sap.m.MultiInput
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var MultiInput = Input.extend("sap.m.MultiInput", /** @lends sap.m.MultiInput.prototype */ { metadata : {
	
		library : "sap.m",		
		properties : {
			
			/**
			 * If set to true, the MultiInput will be displayed in multi-line display mode. 
			 * In multi-line display mode, all tokens can be fully viewed and easily edited in the MultiInput.
			 * The default value is false.
			 * @since 1.28
			 */
			enableMultiLineMode : {type : "boolean", group : "Behavior", defaultValue : false}
		},
		aggregations : {
	
			/**
			 * the currently displayed tokens
			 */
			tokens : {type : "sap.m.Token", multiple : true, singularName : "token"}, 
	
			/**
			 * the tokenizer which displays the tokens
			 */
			tokenizer : {type : "sap.m.Tokenizer", multiple : false, visibility : "hidden"}
		},
		events : {
	
			/**
			 * fired when the tokens aggregation changed (add / remove token)
			 */
			tokenChange : {
				parameters : {
					
					/**
					 * type of tokenChange event. 
					 * There are four TokenChange types: "added", "removed", "removedAll", "tokensChanged".
					 * Use Tokenizer.TokenChangeType.Added for "added",	Tokenizer.TokenChangeType.Removed for "removed", Tokenizer.TokenChangeType.RemovedAll for "removedAll" and Tokenizer.TokenChangeType.TokensChanged for "tokensChanged".
					 */
					type: { type : "string"},
					
					/**
					 * the added token or removed token. 
					 * This parameter is used when tokenChange type is "added" or "removed".
					 */
					token: { type: "sap.m.Token"},
					
					/**
					 * the array of removed tokens. 
					 * This parameter is used when tokenChange type is "removedAll".
					 */
					tokens: { type: "sap.m.Token[]"},
					
					/**
					 * the array of tokens that are added.
					 * This parameter is used when tokenChange type is "tokenChanged".
					 */
					addedTokens :  { type: "sap.m.Token[]"},
					
					/**
					 * the array of tokens that are removed.
					 * This parameter is used when tokenChange type is "tokenChanged".
					 */
					removedTokens :  { type: "sap.m.Token[]"}
				}
			}
		}
	}});
	
	var oRb = sap.ui.getCore().getLibraryResourceBundle("sap.m");

	// create an ARIA announcement and remember its ID for later use in the renderer:
	MultiInput.prototype._sAriaMultiInputContainTokenId = new sap.ui.core.InvisibleText({
		text: oRb.getText("MULTIINPUT_ARIA_CONTAIN_TOKEN")
	}).toStatic().getId();
	
	// **
	// * This file defines behavior for the control,
	// */
	MultiInput.prototype.init = function() {
		var that = this;
		this._oRb = sap.ui.getCore().getLibraryResourceBundle("sap.m");
		
		Input.prototype.init.call(this);
	
		this._bIsValidating = false;
		this._tokenizer = new sap.m.Tokenizer();
	
		this.setAggregation("tokenizer", this._tokenizer);
		this._tokenizer.attachTokenChange(function(args) {
	
			that.fireTokenChange(args.getParameters());
			that.invalidate();
			
			if (that._bUseDialog && that._tokenizerInPopup && that._tokenizer.getParent() instanceof sap.m.Dialog) {
				that._showAllTokens(that._tokenizerInPopup);
				return;
			} else {
				
				that._setContainerSizes();
				
				// check if active element is part of MultiInput
				var bFocusOnMultiInput = jQuery.sap.containsOrEquals(that.getDomRef(), document.activeElement);
				if (args.getParameter("type") === "tokensChanged" && args.getParameter("removedTokens").length > 0 && bFocusOnMultiInput) {
					that.focus();
				}
				
				if (args.getParameter("type") === "removed" && that._isMultiLineMode ) {
					
					var iLength = that.getTokens().length;
					if (iLength > 1) {
						that.getTokens()[iLength - 1].setVisible(true);
					} else {
						//all tokens are deleted, indicator do not show
						that._showAllTokens(that._tokenizer);
					}
				}
				
			}
		});
	
		this.setShowValueHelp(true);
		this.setShowSuggestion(true);
	
		this.addStyleClass("sapMMultiInput");
	
		this.attachSuggestionItemSelected(function(eventArgs) {
			var item = null;
			var token = null;
			if (this._hasTabularSuggestions()) {
				item = eventArgs.getParameter("selectedRow");
			} else {
				item = eventArgs.getParameter("selectedItem");
				if (item) {
					token = new Token({
						text : item.getText(),
						key : item.getKey()
					});
				}
			}
			
			//length of tokens before validating 
			var iOldLength = that._tokenizer.getTokens().length;
			
			if (item) {
				var text = this.getValue();
				that._tokenizer.addValidateToken({
					text : text,
					token : token,
					suggestionObject : item,
					validationCallback : function(validated) {
						if (validated) {
							that.setValue("");
						}
					}
				});			
			}
			
			//dialog opens
			if (that._bUseDialog && that._tokenizerInPopup && that._tokenizerInPopup.getParent() instanceof sap.m.Dialog) {
				//clone newly added token to tokenizerinpopup to display in popup
				var iNewLength = that._tokenizer.getTokens().length;
				if ( iOldLength < iNewLength ) {
					var oNewToken = that._tokenizer.getTokens()[iNewLength - 1];
					that._updateTokenizerInPopup(oNewToken);
					that.setValue("");
				}
				
				if (that._tokenizerInPopup.getVisible() === false){
					that._tokenizerInPopup.setVisible(true);
				}
				
				that._setAllTokenVisible(that._tokenizerInPopup);

				if (that._oList instanceof sap.m.Table) {
					// CSN# 1421140/2014: hide the table for empty/initial results to not show the table columns
					that._oList.addStyleClass("sapMInputSuggestionTableHidden");
				} else {
					that._oList.destroyItems();
				}

				var oScroll = that._oSuggestionPopup.getScrollDelegate();
				if (oScroll) {
					oScroll.scrollTo(0, 0, 0);
				}
				

				that._oPopupInput.focus();
				
			}
		});
	
		this.attachLiveChange(function(eventArgs) {
			that._tokenizer.removeSelectedTokens();
			
			if (that._bUseDialog && that._isMultiLineMode) {
				var sValue = eventArgs.getParameter("newValue");
				
				// hide tokens while typing when there is suggestions
				if ( that._oSuggestionPopup && that._oSuggestionPopup.getContent().length > 1 && sValue.length > 0) {
					that._tokenizerInPopup.setVisible(false);
				} else {
					that._tokenizerInPopup.setVisible(true);
					that._setAllTokenVisible(that._tokenizerInPopup);
				}
			} else {
				that._setContainerSizes();
				that._tokenizer.scrollToStart();
			}
			
		});
	
		sap.ui.Device.orientation.attachHandler(this._onOrientationChange, this);
		
		this._sResizeHandlerId = sap.ui.core.ResizeHandler.register(this, function() {
			// we could have more or less space to our disposal, thus calculate size of input again
			that._setContainerSizes();
		});
	
		if (!(this._bUseDialog && this._oSuggestionPopup)) {
			// attach SuggestionItemSelected event to set value after item selected, not after popup is closed.
			this.attachSuggestionItemSelected(function() {	
				setTimeout(function() {
					that._tokenizer.scrollToEnd();
				}, 0);
			});
		}
	};
	
	/**
	 * Update tokens in tokenizer which is created in suggestion popup in multi-line mode.
	 *
	 * @param {sap.m.Token} token that needed added to tokenizer in popup.
	 * @since 1.28
	 * @private
	 */
	MultiInput.prototype._updateTokenizerInPopup = function(oToken) {
		//addToken to tokenizerInPopup, just to display tokens in popup, the actual token is still in multiinput._tokenizer
		var oNewTokenInPopup = oToken.clone();
		oNewTokenInPopup.attachDelete(this._tokenizerInPopup._onDeleteToken, this._tokenizerInPopup);
		oNewTokenInPopup.attachPress(this._tokenizerInPopup._onTokenPress, this._tokenizerInPopup);
		this._tokenizerInPopup.insertToken(oNewTokenInPopup, 0);
	};
	
	/**
	 * Update tokens in tokenizer which is child of MultiInput, to sync with the tokenizer in popup in multi-line mode
	 *
	 * @since 1.28
	 * @private
	 */
	MultiInput.prototype._updateTokenizerInMultiInput = function() {
		var iTokenizerLength =  this._tokenizer.getTokens().length;
		var iTokenizerInPopupLength = this._tokenizerInPopup.getTokens().length;
		var i = 0, aRemoveTokens = [];
		
		for ( i = 0; i < iTokenizerLength; i++ ){
			var oToken = this._tokenizer.getTokens()[i];
			var j = 0;
			while ( j < iTokenizerInPopupLength && this._tokenizerInPopup.getTokens()[j].getId().indexOf(oToken.getId()) < 0 ){
				j++;
			}
			if ( j === iTokenizerInPopupLength) {
				aRemoveTokens.push(oToken);
			}
			
		}
		
		if (aRemoveTokens.length > 0) {
			for ( i = 0; i < aRemoveTokens.length; i++ ){
				this._tokenizer.removeToken(aRemoveTokens[i]);
			}
			
			this.fireTokenChange({
				addedTokens : [],
				removedTokens : [aRemoveTokens],
				type : sap.m.Tokenizer.TokenChangeType.TokensChanged
			});
		}
		
	};
	
	/**
	 * Set all tokens in tokenizer visible in multi-line mode.
	 *
	 * @since 1.28
	 * @private
	 */
	MultiInput.prototype._setAllTokenVisible = function(oTokenizer) {
		if (oTokenizer.getVisible() === false){
			oTokenizer.setVisible(true);
		}
		
		var aTokens = oTokenizer.getTokens();
		if ( aTokens.length > 0 ) {
			var i = 0;
			for (i = 0; i < aTokens.length; i++) {
				aTokens[i].setVisible(true);
			} 
		}
	};
	
	/**
	 * Set all tokens in tokenizer invisible in multi-line mode.
	 *
	 * @since 1.28
	 * @private
	 */
	MultiInput.prototype._setAllTokenInvisible = function() {

		var aTokens = this.getTokens();
		if ( aTokens.length > 0 ) {
			var i = 0;
			for (i = 0; i < aTokens.length; i++) {
				aTokens[i].setVisible(false);
			} 
		}
	};
	
	/**
	 * Show indicator in multi-line mode
	 *
	 * @since 1.28
	 * @private
	 */
	MultiInput.prototype._showIndicator = function() {
		
		var aTokens = this.getTokens(),
		    iToken = aTokens.length;
		
		this._tokenizer.setVisible(true);

		if (iToken > 1) {
			
			// no value is allowed to show in the input when multiline is closed. Rollback to 1.30 temporarily for sFIN demo
			if (this.getValue() !== "") {
				this.setValue() === "";
			}
			var i = 0;
			for ( i = 0; i < iToken - 1; i++ ) {
				aTokens[i].setVisible(false);
			}
			
			var oMessageBundle = sap.ui.getCore().getLibraryResourceBundle("sap.m");
			var sSpanText = "<span class=\"sapMMultiInputIndicator\">" + oMessageBundle.getText("MULTIINPUT_SHOW_MORE_TOKENS", iToken - 1) + "</span>";
			
			this.$().find(".sapMTokenizer").after(sSpanText);
		}

		this._bShowIndicator = true;
	};
	
	/**
	 * Show all tokens in multi-line mode
	 *
	 * @since 1.28
	 * @private
	 */
	MultiInput.prototype._showAllTokens = function(oTokenizer) {
		
		this._setAllTokenVisible(oTokenizer);
		this._removeIndicator();
	};
	
	/**
	 * Remove tokenizer indicator
	 *
	 * @since 1.30
	 * @private
	 */
	MultiInput.prototype._removeIndicator = function() {
		this.$().find(".sapMMultiInputIndicator").remove();
		this._bShowIndicator = false;

	};
	
	/**
	 * Setter for property <code>enableMultiLineMode</code>.
	 *
	 * @since 1.28
	 * @public
	 */
	MultiInput.prototype.setEnableMultiLineMode = function(bMultiLineMode) {
		this.setProperty("enableMultiLineMode", bMultiLineMode, true);
		
		this.closeMultiLine();
		var that = this;
		
		//only show multiline mode in phone mode
		if (this._bUseDialog) {
			bMultiLineMode = true;
		}
		
		if (bMultiLineMode){
			
			this._showIndicator();
			this._isMultiLineMode = true;
			
			if (this.getDomRef()) {
				setTimeout(function() {
					that._setContainerSizes();
				}, 0);
			}
			
		} else {
			this._isMultiLineMode = false;
			
			this._showAllTokens(this._tokenizer);
			this.setValue("");
			
			if (this.getDomRef()) {
				setTimeout(function() {
					that._setContainerSizes();
					that._scrollAndFocus();
				}, 0);
			}
		}
		
		return this;
	};
	
	/**
	 * Expand multi-line MultiInput in multi-line mode 
	 *
	 * @since 1.28
	 * @public
	 */
	MultiInput.prototype.openMultiLine = function(){
		
		this.$("border").addClass("sapMMultiInputMultiModeBorder");
		if (this._$input) {
			this._$input.parent().addClass("sapMMultiInputMultiModeInputContainer");
		}

		//need this attribute to enable value help icon focusable
		this.$().find(".sapMInputValHelp").attr("tabindex","-1");

		// necessary to display expanded MultiInput which is inside layout
		var oParent = this.getParent();
		this._originalOverflow = null;
		if (oParent && oParent.$ && oParent.$().css("overflow") === "hidden") {
			this._originalOverflow = oParent.$().css("overflow");
			oParent.$().css("overflow", "visible");
		}
		
		// necessary to display expanded MultiInput which is inside SimpleForm
		var $Parent;
		if (this.$().parent('[class*="sapUiRespGridSpan"]')) {
			$Parent = this.$().parent('[class*="sapUiRespGridSpan"]');
		} else if (this.$().parents(".sapUiRFLContainer")) {
			$Parent = this.$().parents(".sapUiRFLContainer");
		}
		
		if ($Parent && $Parent.length > 0 && $Parent.css("overflow") === "hidden") {
			$Parent.css("overflow", "visible");
		}

	};
	
	/**
	 * close multi-line MultiInput in multi-line mode 
	 *
	 * @since 1.28
	 * @public
	 */
	MultiInput.prototype.closeMultiLine = function(){
			this.$("border").removeClass("sapMMultiInputMultiModeBorder");
			if (this._$input) {
				this._$input.parent().removeClass("sapMMultiInputMultiModeInputContainer");
			}

			//remove this attribute to set value help icon back not focusable
			this.$().find(".sapMInputValHelp").removeAttr("tabindex");

			// set overflow back
			if (this._originalOverflow) {
				var oParent = this.getParent();
				oParent.$().css("overflow", this._originalOverflow);
			}
	};

	/**
	 * Function gets called when orientation of mobile devices changes, triggers recalculation of layout
	 *
	 * @private
	 * 
	 */
	MultiInput.prototype._onOrientationChange = function() {
		this._setContainerSizes();
	};
	
	/**
	 * Returns the sap.ui.core.ScrollEnablement delegate which is used with this control.
	 *
	 * @private
	 */
	MultiInput.prototype.getScrollDelegate = function() {
		return this._tokenizer._oScroller;
	};
	
	/**
	 * Function cleans up registered eventhandlers
	 * 
	 * @private
	 */
	MultiInput.prototype.exit = function() {
		if (this._sResizeHandlerId) {
			sap.ui.core.ResizeHandler.deregister(this._sResizeHandlerId);
			delete this._sResizeHandlerId;
		}
	
		Input.prototype.exit.apply(this, arguments);
	};
	
	/**
	 * Function calculates and sets width of tokenizer and input field
	 * 
	 * @private
	 *
	 */
	MultiInput.prototype._setContainerSizes = function() {
	
		var thisDomRef = this.getDomRef();
		if (!thisDomRef) {
			return;
		}
		var $this = this.$();

		if (this.getTokens().length > 0) {
			$this.find(".sapMMultiInputBorder").addClass("sapMMultiInputNarrowBorder");
		} else {
			$this.find(".sapMMultiInputBorder").removeClass("sapMMultiInputNarrowBorder");
		}
			
			
		jQuery($this.find(".sapMInputBaseInner")[0]).removeAttr("style");
		
		// we go to the sapMMultiInputBorder child elements, this makes the computations easier
		var availableWidth = $this.find(".sapMMultiInputBorder").width();
		
		// calculate minimal needed width for input field
		var shadowDiv = $this.children(".sapMMultiInputShadowDiv")[0];
		var $indicator = $this.find(".sapMMultiInputBorder").find(".sapMMultiInputIndicator");
		
		jQuery(shadowDiv).text(this.getValue());
		 
		var inputWidthMinimalNeeded = jQuery(shadowDiv).width();
		var iIndicatorWidth = jQuery($indicator).width();
		
		var tokenizerWidth = this._tokenizer.getScrollWidth();
		
			
		// the icon
		var iconWidth = $this.find(".sapMInputValHelp").outerWidth(true);
		
		if (iIndicatorWidth !== null && this._isMultiLineMode && this._bShowIndicator) {
			inputWidthMinimalNeeded = iIndicatorWidth;
		}
		
		var totalNeededWidth = tokenizerWidth + inputWidthMinimalNeeded + iconWidth;
		var inputWidth;
		var additionalWidth = 1;
			
		if (!this._bUseDialog && this._isMultiLineMode && !this._bShowIndicator && this.$().find(".sapMMultiInputBorder").length > 0) {
			
			var $border = this.$().find(".sapMMultiInputBorder"),
				iMaxHeight = parseInt(($border.css("max-height") || 0), 10),
				iScrollHeight = $border[0].scrollHeight,
				iTokenizerWidth = availableWidth - iconWidth;
					
			if (iMaxHeight < iScrollHeight) {
				//if scroll height exceeds maxHeight, scroll bar also takes width
				iTokenizerWidth = iTokenizerWidth - 17; // 17px is scroll bar width
			}
				
			this._tokenizer.setPixelWidth(iTokenizerWidth); // 17px is scroll bar width
			this.$("inner").css("width", iTokenizerWidth + "px");

		} else {
			if (totalNeededWidth < availableWidth) {
				inputWidth = inputWidthMinimalNeeded + availableWidth - totalNeededWidth;
			} else {
				if (tokenizerWidth === 0 && inputWidthMinimalNeeded > availableWidth) {
				//if there is no token in multiinput, the innerinput width should not exceed multiinput width
					inputWidth = availableWidth;
				} else {
					inputWidth = inputWidthMinimalNeeded + additionalWidth;
					tokenizerWidth = availableWidth - inputWidth - iconWidth;
				}
				
			}
			
			
			jQuery($this.find(".sapMInputBaseInner")[0]).css("width", inputWidth + "px");
				
			this._tokenizer.setPixelWidth(tokenizerWidth);
		}
		
		
		if (this.getPlaceholder()) {
			this._sPlaceholder = this.getPlaceholder();
		}
	
		if (this.getTokens().length > 0) {
			this.setPlaceholder("");
		} else {
			this.setPlaceholder(this._sPlaceholder);
		}
		
		//truncate token in multi-line mode
		if (this._bUseDialog 
				&& this._isMultiLineMode
					&& this._oSuggestionPopup
						&& this._oSuggestionPopup.isOpen() 
							&& this._tokenizerInPopup 
								&& this._tokenizerInPopup.getTokens().length > 0) {
			
			var iPopupTokens = this._tokenizerInPopup.getTokens().length,
				oLastPopupToken = this._tokenizerInPopup.getTokens()[iPopupTokens - 1],
				$oLastPopupToken = oLastPopupToken.$(),
				iTokenWidth = oLastPopupToken.$().outerWidth(),
				iPopupContentWidth = this._oSuggestionPopup.$().find(".sapMDialogScrollCont").width(),
				iBaseFontSize = parseFloat(sap.m.BaseFontSize) || 16,
				iTokenizerWidth = iPopupContentWidth - 2 * iBaseFontSize; //padding left and right 
			
			if (iTokenizerWidth < iTokenWidth) {
				$oLastPopupToken.outerWidth(iTokenizerWidth, true);
				$oLastPopupToken.css("overflow", "hidden");
				$oLastPopupToken.css("text-overflow", "ellipsis");
				$oLastPopupToken.css("white-space", "nowrap");
			}
			
		}
	
	};
	
	/**
	 * Called after the control is rendered.
	 *
	 * @private
	 */
	MultiInput.prototype.onAfterRendering = function() {
	
		Input.prototype.onAfterRendering.apply(this, arguments);
	
		if (!(this._bUseDialog && this._isMultiLineMode)) {
			this._setContainerSizes();
		}
	};
	
	/**
	 * Function adds an validation callback called before any new token gets added to the tokens aggregation
	 *
	 * @param {function} fValidator
	 * @public
	 */
	MultiInput.prototype.addValidator = function(fValidator) {
		this._tokenizer.addValidator(fValidator);
	};	
	
	/**
	 * Function removes an validation callback
	 *
	 * @param {function} fValidator
	 * @public
	 */
	MultiInput.prototype.removeValidator = function(fValidator) {
		this._tokenizer.removeValidator(fValidator);
	};
	
	/**
	 * Function removes all validation callbacks
	 *
	 * @public
	 */
	MultiInput.prototype.removeAllValidators = function() {
		this._tokenizer.removeAllValidators();
	};

	/**
	 * Called when the user presses the down arrow key
	 * @param {jQuery.Event} oEvent The event triggered by the user
	 * @private
	 */
	MultiInput.prototype.onsapnext = function(oEvent) {
	
		if (oEvent.isMarked()) {
			return;
		}
	
		// find focused element
		var oFocusedElement = jQuery(document.activeElement).control()[0];
	
		if (!oFocusedElement) {
			// we cannot rule out that the focused element does not correspond to a SAPUI5 control in which case oFocusedElement
			// is undefined
			return;
		}
	
		if (this._tokenizer === oFocusedElement || this._tokenizer.$().find(oFocusedElement.$()).length > 0) {
			// focus is on the tokenizer or on some descendant of the tokenizer and the event was not handled ->
			// we therefore handle the event and focus the input element
			this._scrollAndFocus();
		}
	
	};
	
	/**
	 * Function is called on keyboard backspace, if cursor is in front of an token, token gets selected and deleted
	 * 
	 * @private
	 * @param {jQuery.event}
	 *          oEvent
	 */
	MultiInput.prototype.onsapbackspace = function(oEvent) {
		if (this.getCursorPosition() > 0 || !this.getEditable() || this.getValue().length > 0) {
			// deleting characters, not
			return;
		}
	
		sap.m.Tokenizer.prototype.onsapbackspace.apply(this._tokenizer, arguments);
	
		oEvent.preventDefault();
		oEvent.stopPropagation();
	};
	
	/**
	 * Function is called on delete keyboard input, deletes selected tokens
	 * 
	 * @private
	 * @param {jQuery.event}
	 *          oEvent
	 */
	MultiInput.prototype.onsapdelete = function(oEvent) {
		if (!this.getEditable()) {
			return;
		}
	
		if (this.getValue() && !this._completeTextIsSelected()) { // do not return if everything is selected
			return;
		}
	
		sap.m.Tokenizer.prototype.onsapdelete.apply(this._tokenizer, arguments);
	};
	
	/**
	 * Handle the key down event for Ctrl + A
	 *
	 * @param {jQuery.Event}
	 *            oEvent - the occuring event
	 * @private
	 */
	MultiInput.prototype.onkeydown = function(oEvent) {
		
		if (oEvent.ctrlKey || oEvent.metaKey) {

			if (oEvent.which === jQuery.sap.KeyCodes.A) {
				var sValue = this.getValue();
				
				if (document.activeElement === this._$input[0]) {
					
					if (this._$input.getSelectedText() !== sValue){
						
						// if text are not selected, then selected all text
						this.selectText(0, sValue.length);
					} else if (this._tokenizer){
						
						// if text are selected, then selected all tokens
						if (!sValue && this._tokenizer.getTokens().length) {
							this._tokenizer.focus();
						}
						this._tokenizer.selectAllTokens(true);
					}
				} else if (document.activeElement === this._tokenizer.$()[0]) {
					
					// if the tokens were not selected before select all in tokenizer was called, then let tokenizer select all tokens.
					if (this._tokenizer._iSelectedToken === this._tokenizer.getTokens().length) {

						// if tokens are all selected, then select all tokens
						this.selectText(0, sValue.length);
					}
				}
				 
				oEvent.preventDefault();
			}
		
		}
		
	};
	
	/**
	 * Handle the paste event
	 *
	 * @param {jQuery.Event}
	 *            oEvent - the occurring event
	 * @private
	 */
	MultiInput.prototype.onpaste = function (oEvent) {

		var sOriginalText;
		// for the purpose to copy from column in excel and paste in MultiInput/MultiComboBox
		if (window.clipboardData) {
			//IE
			sOriginalText = window.clipboardData.getData("Text");
		} else {
			// Chrome, Firefox, Safari
			sOriginalText =  oEvent.originalEvent.clipboardData.getData('text/plain');
		}

		var aSeparatedText = this._tokenizer._parseString(sOriginalText);
		setTimeout(function() {
			if (aSeparatedText) {
				var i = 0;
				for ( i = 0; i < aSeparatedText.length; i++) {
					this.setValue(aSeparatedText[i]);
					this._validateCurrentText();
				
				}
				this.cancelPendingSuggest();
			}
		}.bind(this), 0);

	};
	
	/**
	 * Handle the backspace button, gives backspace to tokenizer if text cursor was on first character
	 *
	 * @param {jQuery.Event}
	 *            oEvent - the occurring event
	 * @private
	 */
	MultiInput.prototype.onsapprevious = function(oEvent) {
	
		if (this._getIsSuggestionPopupOpen()) {
			return;
		}
	
		if (this.getCursorPosition() === 0) {
			if (oEvent.srcControl === this) {
				sap.m.Tokenizer.prototype.onsapprevious.apply(this._tokenizer, arguments);
	
				// we need this otherwise navigating with the left arrow key will trigger a scroll an the Tokens
				oEvent.preventDefault();
			}
		}
	};
	
	/**
	 * Function scrolls the tokens to the end and focuses the input field.
	 * 
	 * @private
	 */
	MultiInput.prototype._scrollAndFocus = function() {
		this._tokenizer.scrollToEnd();
		// we set the focus back via jQuery instead of this.focus() since the latter on phones lead to unwanted opening of the
		// suggest popup
		this.$().find("input").focus();
	};
	
	/**
	 * Handle the home button, gives control to tokenizer to move to first token
	 *
	 * @param {jQuery.Event}
	 *            oEvent - the occuring event
	 * @private
	 */
	MultiInput.prototype.onsaphome = function(oEvent) {
		sap.m.Tokenizer.prototype.onsaphome.apply(this._tokenizer, arguments);
	};
	
	/**
	 * Handle the end button, gives control to tokenizer to move to last token
	 *
	 * @param {jQuery.Event}
	 *            oEvent - the occuring event
	 * @private
	 */
	MultiInput.prototype.onsapend = function(oEvent) {
		sap.m.Tokenizer.prototype.onsapend.apply(this._tokenizer, arguments);
	
		oEvent.preventDefault();
	};
	
	/**
	 * Function is called on keyboard enter, if possible, adds entered text as new token
	 * 
	 * @private
	 * @param {jQuery.event}
	 *          oEvent
	 */
	MultiInput.prototype.onsapenter = function(oEvent) {
		this._validateCurrentText();
		
		if (Input.prototype.onsapenter) {
			Input.prototype.onsapenter.apply(this, arguments);
		}
		
		this.focus();
	};

	
	/**
	 * Checks whether the MultiInput or one of its internal DOM elements has the focus.
	 * 
	 * @private
	 */
	MultiInput.prototype._checkFocus = function() {
		return this.getDomRef() && jQuery.sap.containsOrEquals(this.getDomRef(), document.activeElement);
	};
	
	/**
	 * Event handler called when control is losing the focus, checks if token validation is necessary 
	 *
	 * @param {jQuery.Event}
	 * 			oEvent
	 * @private
	 */
	MultiInput.prototype.onsapfocusleave = function(oEvent) {
		var oPopup = this._oSuggestionPopup;
		var bNewFocusIsInSuggestionPopup = false;
		var bNewFocusIsInTokenizer = false;
		var bNewFocusIsInMultiInput = this._checkFocus();
		if (oPopup instanceof sap.m.Popover) {
			if (oEvent.relatedControlId) {
				bNewFocusIsInSuggestionPopup = jQuery.sap.containsOrEquals(oPopup.getFocusDomRef(), sap.ui.getCore().byId(
						oEvent.relatedControlId).getFocusDomRef());
				bNewFocusIsInTokenizer = jQuery.sap.containsOrEquals(this._tokenizer.getFocusDomRef(), sap.ui.getCore().byId(
						oEvent.relatedControlId).getFocusDomRef());
			}
		}

		// setContainerSize of multi-line mode in the end
		if (!bNewFocusIsInTokenizer && !bNewFocusIsInSuggestionPopup && !this._isMultiLineMode) {
			this._setContainerSizes();
			this._tokenizer.scrollToEnd();
		}
	
		if (this._bIsValidating) { // an asynchronous validation is running, no need to trigger validation again
			if (Input.prototype.onsapfocusleave) {
				Input.prototype.onsapfocusleave.apply(this, arguments);
			}
			return;
		}
	
		if (Input.prototype.onsapfocusleave) {
			Input.prototype.onsapfocusleave.apply(this, arguments);
		}
	
		if (!this._bUseDialog && !bNewFocusIsInSuggestionPopup && oEvent.relatedControlId !== this.getId()
				&& oEvent.relatedControlId !== this._tokenizer.getId() && !bNewFocusIsInTokenizer
					&& !(this._isMultiLineMode && this._bShowIndicator) 
					) { // leaving control, validate latest text, not validate the indicator		
				this._validateCurrentText(true);
		}

		if (!this._bUseDialog && this._isMultiLineMode && !this._bShowIndicator) {
			
			if (bNewFocusIsInMultiInput || bNewFocusIsInSuggestionPopup) {
				return;				
			}

			this.closeMultiLine();
			this._showIndicator();
			
			var that = this;
			setTimeout(function() {
				that._setContainerSizes();
			}, 0);
		} 
		
		sap.m.Tokenizer.prototype.onsapfocusleave.apply(this._tokenizer, arguments);

		if (!this._bUseDialog && this._isMultiLineMode && this._bShowIndicator) {
			var $multiInputScroll = this.$().find(".sapMMultiInputBorder");
			$multiInputScroll.scrollTop(0);
		}
	};
	
	
	
	MultiInput.prototype.cloneTokenizer = function(oTokenizer) {
		var oClone = new sap.m.Tokenizer();

		var aTokens = oTokenizer.getTokens();
		if (aTokens.length > 0) {
			for (var i = aTokens.length - 1; i >= 0; i--){
				var newToken = aTokens[i].clone();
				oClone.addToken(newToken);
			}
		}

		return oClone;
	};

	/**
	 * Process multi-line display in edit mode. This function is used when MultiInput gets focus.
	 *
	 * @param {jQuery.Event}
	 * 			oEvent
	 * @private
	 */
	MultiInput.prototype._processMultiLine = function(oEvent) {
			if ( this._bUseDialog ) {
				
				if ( oEvent.target === this._$input[0] 
					||  oEvent.target.className.indexOf("sapMToken") > -1 && oEvent.target.className.indexOf("sapMTokenIcon") < 0
						||  oEvent.target.className.indexOf("sapMTokenText") > -1) {
					
					this._removeIndicator();
					this._oSuggestionPopup.open();
					this._tokenizerInPopup = this.cloneTokenizer(this._tokenizer);
					this._setAllTokenVisible(this._tokenizerInPopup);
					this._tokenizerInPopup._oScroller.setHorizontal(false);
					this._tokenizerInPopup.addStyleClass("sapMTokenizerMultiLine");
					
					//add token when no suggestion item
					if (this._oSuggestionTable.getItems().length === 0) {
						var that = this;
						this._oPopupInput.onsapenter = function(oEvent){
							
							that._validateCurrentText();
							that.setValue("");
						};
					}
					
					this._oSuggestionPopup.insertContent(this._tokenizerInPopup, 0);
				}
				
			} else {
					//desktop and click on input field
					if ( oEvent.target === this._$input[0] 
							||  oEvent.target.className.indexOf("sapMToken") > -1 && oEvent.target.className.indexOf("sapMTokenIcon") < 0
								||  oEvent.target.className.indexOf("sapMTokenText") > -1){
						
						this.openMultiLine();
						this._showAllTokens(this._tokenizer);
						
						var that = this;
						setTimeout(function() {
							that._setContainerSizes();
							that._tokenizer.scrollToStart();
						}, 0);
					}
			}
	};
	
	
	/**
	 * when tap on text field, deselect all tokens
	 * @public
	 * @param {jQuery.Event} oEvent
	 */
	MultiInput.prototype.ontap = function(oEvent) {
		//deselect tokens when focus is on text field
		if (document.activeElement === this._$input[0]) {
			this._tokenizer.selectAllTokens(false);
		}

		Input.prototype.ontap.apply(this, arguments);
	};
	
	
	/**
	 * focus is on MultiInput
	 * @public
	 * @param {jQuery.Event} oEvent
	 */
	MultiInput.prototype.onfocusin = function(oEvent) {
		
		if ( this._isMultiLineMode ) {
			this._processMultiLine(oEvent);
		}
		
		if ( oEvent.target === this.getFocusDomRef() ){
			Input.prototype.onfocusin.apply(this, arguments);
		}
		
	};
	
	
	/**
	 * when press ESC, deselect all tokens and all texts
	 * @public
	 * @param {jQuery.Event} oEvent
	 */
	MultiInput.prototype.onsapescape = function(oEvent) {
		
		//deselect everything
		this._tokenizer.selectAllTokens(false);
		this.selectText(0, 0);
		
		Input.prototype.onsapescape.apply(this, arguments);
	};
	
	
	/**
	 * Function tries to turn current text into a token
	 * 
	 * @private
	 */
	MultiInput.prototype._validateCurrentText = function(bExactMatch) {
		var iOldLength = this._tokenizer.getTokens().length;
		var text = this.getValue();
		if (!text || !this.getEditable()) {
			return;
		}
	
		text = text.trim();
	
		if (!text) {
			return;
		}
	
		var item = null;
	
	
	
		if (bExactMatch || this._getIsSuggestionPopupOpen()) { // only take item from suggestion list if popup is open, otherwise it can be
			if (this._hasTabularSuggestions()) {
				//if there is suggestion table, select the correct item, to avoid selecting the wrong item but with same text.
				item = this._oSuggestionTable._oSelectedItem;
			} else {
				// impossible to enter other text
				item = this._getSuggestionItem(text, bExactMatch);
			}
		}
	
		var token = null;
		if (item && item.getText && item.getKey) {
			token = new Token({
				text : item.getText(),
				key : item.getKey()
			});
		}
	
		var that = this;
	
		this._bIsValidating = true;
		this._tokenizer.addValidateToken({
			text : text,
			token : token,
			suggestionObject : item,
			validationCallback : function(validated) {
				that._bIsValidating = false;
				if (validated) {
					that.setValue("");
					if (that._bUseDialog && that._isMultiLineMode && that._oSuggestionTable.getItems().length === 0) {
						var iNewLength = that._tokenizer.getTokens().length;
						if ( iOldLength < iNewLength ) {
							var oNewToken = that._tokenizer.getTokens()[iNewLength - 1];
							that._updateTokenizerInPopup(oNewToken);
							that._oPopupInput.setValue("");
						}
						if (that._tokenizerInPopup.getVisible() === false){
							that._tokenizerInPopup.setVisible(true);
						}
						that._setAllTokenVisible(that._tokenizerInPopup);
					}

				}
			}
		});
	};
	
	/**
	 * Functions returns the current input field's cursor position
	 * 
	 * @private
	 * @return {integer} the cursor position
	 */
	MultiInput.prototype.getCursorPosition = function() {
		return this._$input.cursorPos();
	};
	
	/**
	 * Functions returns true if the input's text is completely selected
	 * 
	 * @private
	 * @return {boolean} true if text is selected, otherwise false,
	 */
	MultiInput.prototype._completeTextIsSelected = function() {
		var input = this._$input[0];
		if (input.selectionStart !== 0) {
			return false;
		}
	
		if (input.selectionEnd !== this.getValue().length) {
			return false;
		}
	
		return true;
	};
	
	/**
	 * Functions selects the complete input text
	 * 
	 * @private
	 * @return {sap.m.MultiInput} this - for chaining
	 */
	MultiInput.prototype._selectAllInputText = function() {
		var input = this._$input[0];
		input.selectionStart = 0;
		input.selectionEnd = this.getValue().length;
		return this;
	};
	
	/**
	 * Functions returns true if the suggestion popup is currently open
	 * 
	 * @private
	 */
	MultiInput.prototype._getIsSuggestionPopupOpen = function() {
		return this._oSuggestionPopup && this._oSuggestionPopup.isOpen();
	};
	
	MultiInput.prototype.setEditable = function(bEditable) {
		if (bEditable === this.getEditable()) {
			return this;
		}
	
		if (Input.prototype.setEditable) {
			Input.prototype.setEditable.apply(this, arguments);
		}
	
		this._tokenizer.setEditable(bEditable);
	
		if (bEditable) {
			this.removeStyleClass("sapMMultiInputNotEditable");
		} else {
			this.addStyleClass("sapMMultiInputNotEditable");
		}
	
		return this;
	};
	
	/**
	 * Function returns an item which's text starts with the given text within the given items array
	 * 
	 * @private
	 * @param {string}
	 *          sText
	 * @param {array}
	 *          aItems
	 * @param {boolean}
	 *          bExactMatch
	 * @param {function}
	 *          fGetText - function to extract text from a single item
	 * @return {object} a found item or null
	 */
	MultiInput.prototype._findItem = function(sText, aItems, bExactMatch, fGetText) {
		if (!sText) {
			return;
		}
	
		if (!(aItems && aItems.length)) {
			return;
		}
	
		sText = sText.toLowerCase();
	
		var length = aItems.length;
		for (var i = 0; i < length; i++) {
			var item = aItems[i];
			var compareText = fGetText(item);
			if (!compareText) {
				continue;
			}
	
			compareText = compareText.toLowerCase();
			if (compareText === sText) {
				return item;
			}
			
			if (!bExactMatch && compareText.indexOf(sText) === 0) {
				return item;
			}
		}
	};
	
	/**
	 * Function searches for an item with the given text within the suggestion items
	 * 
	 * @private
	 * @param {string}
	 *          sText
	 * @param {boolean}
	 *          bExactMatch - if true, only items will be returned which exactly matches the text
	 * @return {sap.ui.core.Item} a found item or null
	 */
	MultiInput.prototype._getSuggestionItem = function(sText, bExactMatch) {
		var items = null;
		var item = null;
		if (this._hasTabularSuggestions()) {
			items = this.getSuggestionRows();
			item = this._findItem(sText, items, bExactMatch, function(oRow) {
				var cells = oRow.getCells();
				var foundText = null;
				if (cells) {
					var i;
					for (i = 0; i < cells.length; i++) {
						if (cells[i].getText) {
							foundText = cells[i].getText();
							break;
						}
					}
				}
				return foundText;
			});
		} else {
			items = this.getSuggestionItems();
			item = this._findItem(sText, items, bExactMatch, function(item) {
				return item.getText();
			});
		}
		return item;
	};
	
	MultiInput.prototype.addToken = function(oToken) {
		return this._tokenizer.addToken(oToken);
	};
	
	MultiInput.prototype.removeToken = function(oToken) {
		return this._tokenizer.removeToken(oToken);
	};
	
	MultiInput.prototype.removeAllTokens = function() {
		return this._tokenizer.removeAllTokens();
	};
	
	MultiInput.prototype.getTokens = function() {
		return this._tokenizer.getTokens();
	};
	
	MultiInput.prototype.insertToken = function(oToken, iIndex) {
		return this._tokenizer.insertToken(oToken, iIndex);
	};
	
	MultiInput.prototype.indexOfToken = function(oToken) {
		return this._tokenizer.indexOfToken(oToken);
	};
	
	MultiInput.prototype.destroyTokens = function() {
		return this._tokenizer.destroyTokens();
	};	
	
	/**
	 * Function overwrites clone function to add tokens to MultiInput
	 * 
	 * @public
	 * @return {sap.ui.core.Element} reference to the newly created clone
	 */
	MultiInput.prototype.clone = function() {
        var oClone = Input.prototype.clone.apply(this, arguments);
        
        var aTokens = this.getTokens();
        var i;
        for (i = 0; i < aTokens.length; i++){
              var newToken = aTokens[i].clone();
              oClone.addToken(newToken);
        }
        
        return oClone;
  };
	
	/**
	 * Function returns domref which acts as reference point for the opening suggestion menu
	 * 
	 * @public
	 * @returns {domRef}
	 *          the domref at which to open the suggestion menu
	 */
	MultiInput.prototype.getPopupAnchorDomRef = function(){
		return this.getDomRef("border");
	};	
	
	/**
	 * Function sets an array of tokens, existing tokens will get overridden
	 *
	 * @param {sap.m.Token[]}
	 *          aTokens - the new token set
	 * @public
	 */
	MultiInput.prototype.setTokens = function(aTokens) {
		this._tokenizer.setTokens(aTokens);
	};
	
	MultiInput.TokenChangeType = {
		Added : "added",
		Removed : "removed",
		RemovedAll : "removedAll",
		TokensChanged : "tokensChanged"
	};
	
	MultiInput.WaitForAsyncValidation = "sap.m.Tokenizer.WaitForAsyncValidation";
	
	/**
	 * get the reference element which the message popup should dock to
	 *
	 * @return {DOMRef} Dom Element which the message popup should dock to
	 * @protected
	 * @function
	 */
	MultiInput.prototype.getDomRefForValueStateMessage = MultiInput.prototype.getPopupAnchorDomRef;
	

	return MultiInput;

}, /* bExport= */ true);
