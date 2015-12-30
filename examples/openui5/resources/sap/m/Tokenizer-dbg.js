/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.m.Tokenizer.
sap.ui.define(['jquery.sap.global', './library', 'sap/ui/core/Control', 'sap/ui/core/delegate/ScrollEnablement'],
	function(jQuery, library, Control, ScrollEnablement) {
	"use strict";


	
	/**
	 * Constructor for a new Tokenizer.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * Tokenizer displays multiple tokens
	 * @extends sap.ui.core.Control
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @alias sap.m.Tokenizer
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var Tokenizer = Control.extend("sap.m.Tokenizer", /** @lends sap.m.Tokenizer.prototype */ { metadata : {
	
		library : "sap.m",
		properties : {
	
			/**
			 * true if tokens shall be editable otherwise false
			 */
			editable : {type : "boolean", group : "Misc", defaultValue : true},
	
			/**
			 * Defines the width of the Tokenizer.
			 */
			width : {type : "sap.ui.core.CSSSize", group : "Dimension", defaultValue : null}
		},
		defaultAggregation : "tokens",
		aggregations : {
	
			/**
			 * the currently displayed tokens
			 */
			tokens : {type : "sap.m.Token", multiple : true, singularName : "token"}
		},
		associations : {

			/**
			 * Association to controls / ids which describe this control (see WAI-ARIA attribute aria-describedby).
			 */
			ariaDescribedBy: {type: "sap.ui.core.Control", multiple: true, singularName: "ariaDescribedBy"},

			/**
			 * Association to controls / ids which label this control (see WAI-ARIA attribute aria-labelledby).
			 */
			ariaLabelledBy: {type: "sap.ui.core.Control", multiple: true, singularName: "ariaLabelledBy"}
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
	Tokenizer.prototype._sAriaTokenizerLabelId = new sap.ui.core.InvisibleText({
		text: oRb.getText("TOKENIZER_ARIA_LABEL")
	}).toStatic().getId();

	///**
	// * This file defines behavior for the control,
	// */
	
	Tokenizer.prototype.init = function() {
		//if bScrollToEndIsActive === true, than tokenizer will keep last token visible
		this._bScrollToEndIsActive = false;
		
		this._aTokenValidators = [];
		
		this._oScroller = new ScrollEnablement(this, this.getId() + "-scrollContainer", {
			horizontal : true,
			vertical : false,
			nonTouchScrolling : true
		});
	};
	
	/**
	 * Function returns the internally used scroll delegate
	 * 
	 * @public
	 * @returns {sap.ui.core.delegate.ScrollEnablement}
	 */
	Tokenizer.prototype.getScrollDelegate = function() {
		return this._oScroller;
	};
	
	/**
	 * Function scrolls the tokens to the end
	 * 
	 * @public
	 * @param {boolean}
	 *          bInitialize indicates if we should reset the 'scroll-to-end-pending' flag; if true we would reset this flag
	 */
	Tokenizer.prototype.scrollToEnd = function() {
		
		if (!this._bScrollToEndIsActive) {
			this._bScrollToEndIsActive = true;
			
			var that = this;
			var domRef = this.getDomRef();
			if (domRef) {
				this._sResizeHandlerId = sap.ui.core.ResizeHandler.register(domRef, function() {
					that._doScrollToEnd();
				});
			}
		}
		
		this._doScrollToEnd();
	};
	
	
	Tokenizer.prototype.setWidth = function(sWidth) {
		this.setProperty("width", sWidth, true);
		this.$().css("width", this.getWidth());
		return this;
	};
	
	/**
	 * Function sets the tokenizer's width in pixels
	 * 
	 * @public
	 * @param {number}
	 *          nWidth - the new width in pixels
	 */
	Tokenizer.prototype.setPixelWidth = function(nWidth){
		
		this._truncateLastToken(nWidth);
		
		var sWidth = (nWidth / parseFloat(sap.m.BaseFontSize)) + "rem";
		this.$().css("width", sWidth);
		
		if (this._oScroller) {
			this._oScroller.refresh();
		}
		
	};
	
	/**
	 * Function if the last token is wider than the given tokenizer width, the token gets truncated
	 * 
	 * @private
	 * @param {number}
	 *          nWidth - the new width in pixels
	 */
	Tokenizer.prototype._truncateLastToken = function(nWidth){
		var lastToken = this._removeLastTokensTruncation();
		if (lastToken === null) {
			 return;
		}
		
		var that = this;
		var $LastToken = lastToken.$();
		
		// when token selected we no longer truncate; thereby the delete icon is visible
		var fSelectHandler = null;
		fSelectHandler = function() {
			lastToken.removeStyleClass("sapMTokenTruncate");
			this.$().removeAttr("style");
			this.detachSelect(fSelectHandler);
			that.scrollToEnd();
		};
	
		
		var widthOfLastToken = $LastToken.width();
		if (!lastToken.getSelected() && nWidth >= 0 && widthOfLastToken >= 0 && nWidth < widthOfLastToken) {
			// truncate last token if not selected and not completely visible
			$LastToken.outerWidth(nWidth, true);
			lastToken.addStyleClass("sapMTokenTruncate");
			lastToken.attachSelect(fSelectHandler);
		} else {
		  // last token is completely visible
			lastToken.detachSelect(fSelectHandler);
		}
		
		this.scrollToEnd();
	};
	
	/**
	 * Function scrolls the tokens to the end by setting the scrollWidth to the scroll dom container
	 * 
	 * @private
	 */
	Tokenizer.prototype._doScrollToEnd = function(){
		var thisDomRef = this.getDomRef();
		if (!thisDomRef) {
			return;
		}
	
		var $this = this.$();
		var scrollDiv = $this.find(".sapMTokenizerScrollContainer")[0];
		$this[0].scrollLeft = scrollDiv.scrollWidth;
	};
	
	/**
	 * Function scrolls the tokens to the start
	 * 
	 * @public
	 * 
	 */
	Tokenizer.prototype.scrollToStart = function() {
		this._deactivateScrollToEnd();
		
		var thisDomRef = this.getDomRef();
	
		if (!thisDomRef) {
			return;
		}
	
		var jMultiInput = jQuery(thisDomRef);
		jMultiInput[0].scrollLeft = 0;
	};
	
	Tokenizer.prototype._deactivateScrollToEnd = function(){
		this._deregisterResizeHandler();
		this._bScrollToEndIsActive = false;
	};
	
	/**
	 * Function removes the truncation from the last token, by clearing the style attribute
	 * 
	 * @private
	 * 
	 * @returns
	 * 	(sap.m.Token) - the last token
	 */
	Tokenizer.prototype._removeLastTokensTruncation = function(){
		var aTokens = this.getTokens();
		var oLastToken = null;
		if (aTokens.length > 0) {
			oLastToken = aTokens[aTokens.length - 1];
			var $LastToken = oLastToken.$();
			if ($LastToken.length > 0) {
				$LastToken[0].style.cssText = "";
			}
		}
		
		return oLastToken;
	};
	
	/**
	 * Function returns the tokens' width
	 * 
	 * @public
	 * 
	 * @returns
	 * 	the complete tokens' width
	 */
	Tokenizer.prototype.getScrollWidth = function(){
		//if the last token is truncated, the scrollWidth will be incorrect
		this._removeLastTokensTruncation();
		
		return this.$().children(".sapMTokenizerScrollContainer")[0].scrollWidth;
	};

	Tokenizer.prototype.onBeforeRendering = function() {
		this._deregisterResizeHandler();
	};
	
	/**
	 * Called after the control is rendered.
	 *
	 * @private
	 */
	Tokenizer.prototype.onAfterRendering = function() {
	
		if (Control.prototype.onAfterRendering) {
			Control.prototype.onAfterRendering.apply(this, arguments);
		}
		
		var that = this;
	
		if (this._bScrollToEndIsActive) {
			this._sResizeHandlerId = sap.ui.core.ResizeHandler.register(this.getDomRef(), function() {
					that._doScrollToEnd();
			});
		}
		
		if (this._bCopyToClipboardSupport) {
			this.$().on("copy", function(oEvent){
				that.oncopy(oEvent);
			});
		}
	};
	
	/**
	 * Handles the copy event
	 *
	 * @param {jQuery.Event}
	 *            oEvent - the occuring event
	 * @private
	 */
	Tokenizer.prototype.oncopy = function(oEvent) {
		var aSelectedTokens = this.getSelectedTokens();
		var sSelectedText = "";
		for (var i = 0; i < aSelectedTokens.length; i++) {
			sSelectedText = sSelectedText + (i > 0 ? "\r\n" : "") + aSelectedTokens[i].getText();
		}
		
		if (!sSelectedText) {
			return;
		}
		
		if (window.clipboardData) {
			window.clipboardData.setData("text", sSelectedText);
		} else {
			oEvent.originalEvent.clipboardData.setData('text/plain', sSelectedText);
		}
		oEvent.preventDefault();
	};
	
	/**
	 * Handle the focus leave event, deselects token
	 *
	 * @param {jQuery.Event}
	 *            oEvent - the occuring event
	 * @private
	 */
	Tokenizer.prototype.onsapfocusleave = function(oEvent) {
		//when focus goes to token, keep the select status, otherwise deselect all tokens
		if (!this._checkFocus()) {
			this.selectAllTokens(false);
		}
	};
	
	/**
	 * Handle the tab key event, deselects token
	 *
	 * @param {jQuery.Event}
	 *            oEvent - the occuring event
	 * @private
	 */
	Tokenizer.prototype.saptabnext = function(oEvent) {
		this.selectAllTokens(false);
	};
	
	/**
	 * check if all tokens in the tokenizer are selected.
	 *
	 * @private
	 */
	Tokenizer.prototype.isAllTokenSelected = function() {
		if (this.getTokens().length === this.getSelectedTokens().length) {
			
			return true;
		}
		return false;
	
	};
	
	/**
	 * Handle the key down event for Ctrl+ a
	 *
	 * @param {jQuery.Event}
	 *            oEvent - the occuring event
	 * @private
	 */
	Tokenizer.prototype.onkeydown = function(oEvent) {
		
		if (oEvent.which === jQuery.sap.KeyCodes.TAB) {
			this.selectAllTokens(false);
		}
		
		if ((oEvent.ctrlKey || oEvent.metaKey) && oEvent.which === jQuery.sap.KeyCodes.A) { //metaKey for MAC command
			
			//to check how many tokens are selected before Ctrl + A in MultiInput
			this._iSelectedToken = this.getSelectedTokens().length;
			
			if (this.getTokens().length > 0) {
				this.focus();
				this.selectAllTokens(true);
				oEvent.preventDefault();
			}
			
		}

	};
	
	/**
	 * Function is called on keyboard backspace, deletes selected tokens
	 * 
	 * @private
	 * @param {jQuery.event}
	 *          oEvent
	 */
	
	Tokenizer.prototype.onsapbackspace = function(oEvent) {
		if (this.getSelectedTokens().length === 0) {
			this.onsapprevious(oEvent);
		} else if (this.getEditable()) {
			this.removeSelectedTokens();
		}
	
		oEvent.preventDefault();
		oEvent.stopPropagation();
	};
	
	/**
	 * Function is called on keyboard delete, deletes token
	 * 
	 * @private
	 * @param {jQuery.event}
	 *          oEvent
	 */
	
	Tokenizer.prototype.onsapdelete = function(oEvent) {
		if (this.getEditable()) {
			this.removeSelectedTokens();
		}
	};
	
	/**
	 * Called when the user presses the right arrow key, selects next token
	 * @param {jQuery.Event} oEvent The event triggered by the user
	 * @private
	 */
	Tokenizer.prototype.onsapnext = function(oEvent) {
		if (oEvent.which === jQuery.sap.KeyCodes.ARROW_DOWN) {
			return;
	  }
		
		var iLength = this.getTokens().length;
	
		if (iLength === 0) {
			return;
		}
	
		this.selectAllTokens(false);
	
		var oFocusedElement = jQuery(document.activeElement).control()[0];
		if (oFocusedElement === this) {
			// focus is on tokenizer itself - we do not handle this event and let it bubble
			return;
		}
	
		// oFocusedElement could be undefined since the focus element might not correspond to a SAPUI5 Control
		var index = oFocusedElement ? this.getTokens().indexOf(oFocusedElement) : -1;
	
		if (index < iLength - 1) {
			var oNextToken = this.getTokens()[index + 1];
			oNextToken.setSelected(true);
			this._ensureTokenVisible(oNextToken);

			oEvent.preventDefault();
		} else if (index === iLength - 1) {
			// focus is on last token - we do not handle this event and let it bubble
			this.scrollToEnd();
			return;
		}
	
		this._deactivateScrollToEnd();
		
		oEvent.setMarked();
	
	};

	/**
	 * Adjusts the scrollLeft so that the given token is visible from its left side
	 * @param {sap.m.Token} oToken The token that will be fully visible
	 * @private
	*/
	Tokenizer.prototype._ensureTokenVisible = function(oToken) {
		var iTokenizerLeftOffset = this.$().offset().left,
			iTokenLeftOffset = oToken.$().offset().left;

		if (iTokenLeftOffset < iTokenizerLeftOffset) {
			this.$().scrollLeft(this.$().scrollLeft() - iTokenizerLeftOffset + iTokenLeftOffset);
		}
	};

	/**
	 * Called when the user presses the left arrow key, selects previous token
	 * @param {jQuery.Event} oEvent The event triggered by the user
	 * @private
	 */
	Tokenizer.prototype.onsapprevious = function(oEvent) {
		if (oEvent.which === jQuery.sap.KeyCodes.ARROW_UP) {
			return;
		}
		
		if (this.getSelectedTokens().length === this.getTokens().length) {
			// select all situation
			return;
		}
	
		if (this.getTokens().length === 0) {
			return;
		}
		
		var oFocusedElement = sap.ui.getCore().byId(jQuery(document.activeElement).attr("id"));
	
		// oFocusedElement could be undefined since the focus element might not correspond to a SAPUI5 Control
		var index = oFocusedElement ? this.getTokens().indexOf(oFocusedElement) : -1;
	
		if (index > 0) {
			var oPrevToken = this.getTokens()[index - 1];
			oPrevToken.setSelected(true);
			this._ensureTokenVisible(oPrevToken);
		} else if (index === -1) {
			this.getTokens()[this.getTokens().length - 1].setSelected(true);
		}
	
		this._deactivateScrollToEnd();
		
	};
	
	/**
	 * Function adds an validation callback called before any new token gets added to the tokens aggregation
	 * 
	 * @public
	 * @param {function}
	 *          fValidator
	 */
	Tokenizer.prototype.addValidator = function(fValidator) {
		if (typeof (fValidator) === "function") {
			this._aTokenValidators.push(fValidator);
		}
	};
	
	/**
	 * Function removes an validation callback
	 * 
	 * @public
	 * @param {function}
	 *          fValidator
	 */
	Tokenizer.prototype.removeValidator = function(fValidator) {
		var i = this._aTokenValidators.indexOf(fValidator);
		if (i !== -1) {
			this._aTokenValidators.splice(i, 1);
		}
	};
	
	/**
	 * Function removes all validation callbacks
	 * 
	 * @public
	 */
	Tokenizer.prototype.removeAllValidators = function() {
		this._aTokenValidators = [];
	};
	
	/**
	 * Function validates a given token using the set validators
	 * 
	 * @private
	 * @param {object}
	 *          oParameters - parameter bag containing fields for text, token, suggestionObject and validation callback
	 * @param {function[]}
	 *          [optional] aValidator - all validators to be used
	 * @returns {sap.m.Token} - a valid token or null
	 */
	Tokenizer.prototype._validateToken = function(oParameters, aValidators) {
		var oToken = oParameters.token;
		var sText;
		
		if (oToken && oToken.getText()) {
			sText = oToken.getText();
		} else {
			sText = oParameters.text;
		}

		var fValidateCallback = oParameters.validationCallback;
		var oSuggestionObject = oParameters.suggestionObject;
	
		var i, validator, length;
	
		if (!aValidators) {
			aValidators = this._aTokenValidators;
		}
	
		length = aValidators.length;
		if (length === 0) { // no custom validators, just return given token
			if (!oToken && fValidateCallback) {
				fValidateCallback(false);
			}
			return oToken;
		}
	
		for (i = 0; i < length; i++) {
			validator = aValidators[i];

			oToken = validator({
				text : sText,
				suggestedToken : oToken,
				suggestionObject : oSuggestionObject,
				asyncCallback : this._getAsyncValidationCallback(aValidators, i, sText, oSuggestionObject, fValidateCallback)
			});
	
			if (!oToken) {
				if (fValidateCallback) {
					fValidateCallback(false);
				}
				return null;
			}
	
			if (oToken === Tokenizer.WaitForAsyncValidation) {
				return null;
			}
		}
	
		return oToken;
	};
	
	/**
	 * Function returns a callback function which is used for executing validators after an asynchronous validator was triggered
	 * @param {array} aValidators
	 * 					the validators
	 * @param {integer} iValidatorIndex
	 * 						current validator index
	 * @param {string} sInitialText
	 * 					initial text used for validation
	 * @param {object} oSuggestionObject
	 * 					a pre-validated token or suggestion item
	 * @param {function} fValidateCallback
	 * 						callback after validation has finished
	 * @private
	 */
	Tokenizer.prototype._getAsyncValidationCallback = function(aValidators, iValidatorIndex, sInitialText,
			oSuggestionObject, fValidateCallback) {
		var that = this;
		return function(oToken) {
			if (oToken) { // continue validating
				aValidators = aValidators.slice(iValidatorIndex + 1);
				oToken = that._validateToken({
					text : sInitialText,
					token : oToken,
					suggestionObject : oSuggestionObject,
					validationCallback : fValidateCallback
				}, aValidators);
				that._addUniqueToken(oToken, fValidateCallback);
			} else {
				if (fValidateCallback) {
					fValidateCallback(false);
				}
			}
		};
	};
	
	/**
	 * Function validates the given text and adds a new token if validation was successful
	 * 
	 * @public
	 * @param {object}
	 *          oParameters - parameter bag containing following fields: {sap.m.String} text - the source text {sap.m.Token}
	 *          [optional] token - a suggested token {object} [optional] suggestionObject - any object used to find the
	 *          suggested token {function} [optional] validationCallback - callback which gets called after validation has
	 *          finished
	 */
	Tokenizer.prototype.addValidateToken = function(oParameters) {
		var oToken = this._validateToken(oParameters);
		this._addUniqueToken(oToken, oParameters.validationCallback);
	};
	/**
	 * Function adds token if it does not already exist
	 * 
	 * @private
	 * @param {sap.m.Token}
	 *          token
	 * @param {function}
	 *          [optional] fValidateCallback
	 */
	Tokenizer.prototype._addUniqueToken = function(oToken, fValidateCallback) {
		if (!oToken) {
			return;
		}
	
		var tokenExists = this._tokenExists(oToken);
		if (tokenExists) {
			return;
		}
	
		this.addToken(oToken);
	
		if (fValidateCallback) {
			fValidateCallback(true);
		}
		
		this.fireTokenChange({
			addedTokens : [oToken],
			removedTokens : [],
			type : Tokenizer.TokenChangeType.TokensChanged
		});
	};
	
	/**
	 * Function parses given text, and text is separated by line break 
	 * 
	 * @private
	 * @param {String} string needed parsed
	 * @return {Array} array of string after parsing
	 */
	Tokenizer.prototype._parseString = function(sString) {
		
		// for the purpose to copy from column in excel and paste in MultiInput/MultiComboBox
		// delimiter is line break
		return sString.split(/\r\n|\r|\n/g);
	};
	
	/**
	 * Checks whether the Tokenizer or one of its internal DOM elements has the focus.
	 * 
	 * @private
	 */
	Tokenizer.prototype._checkFocus = function() {
		return this.getDomRef() && jQuery.sap.containsOrEquals(this.getDomRef(), document.activeElement);
	};
	
	
	/**
	 * Function checks if a given token already exists in the tokens aggregation based on their keys
	 * 
	 * @private
	 * @param {sap.m.Token}
	 *          Token
	 * @return {boolean} true if it exists, otherwise false
	 */
	Tokenizer.prototype._tokenExists = function(oToken) {
		var tokens = this.getTokens();
	
		if (!(tokens && tokens.length)) {
			return false;
		}
	
		var key = oToken.getKey();
		if (!key) {
			return false;
		}
	
		var length = tokens.length;
		for (var i = 0; i < length; i++) {
			var currentToken = tokens[i];
			var currentKey = currentToken.getKey();
	
			if (currentKey === key) {
				return true;
			}
		}
	
		return false;
	};
	
	Tokenizer.prototype.addToken = function(oToken, bSuppressInvalidate) {
		this.addAggregation("tokens", oToken, bSuppressInvalidate);
		oToken.attachDelete(this._onDeleteToken, this);
		oToken.attachPress(this._onTokenPress, this);
		
		oToken.setEditable = function (bEnabled) {
			//ReadOnly css is handled by Token, using overwrite for further developing 
			//in case the token in tokenizer has different design for editable property
			sap.m.Token.prototype.setEditable.apply(oToken, arguments);
		};
		
		this._bScrollToEndIsActive = true; //Ensure scroll to end is active after rendering
	
		this.fireTokenChange({
			token : oToken,
			type : Tokenizer.TokenChangeType.Added
		});
	};

	Tokenizer.prototype.removeToken = function(oToken) {
		oToken = this.removeAggregation("tokens", oToken);
		if (oToken) {
			oToken.detachDelete(this._onDeleteToken, this);
			oToken.detachPress(this._onTokenPress, this);
		}
		
		this._bScrollToEndIsActive = true; //Ensure scroll to end is active after rendering
	
		this.fireTokenChange({
			token : oToken,
			type : Tokenizer.TokenChangeType.Removed
		});
	
		return oToken;
	};

	Tokenizer.prototype.setTokens = function(aTokens) {
		var oldTokens = this.getTokens();
		this.removeAllTokens(false);
	
		var i;
		for (i = 0; i < aTokens.length; i++) {
			this.addToken(aTokens[i], true);
		}
	
		this.invalidate();
		this._bScrollToEndIsActive = true; //Ensure scroll to end is active after rendering
		
		this.fireTokenChange({
			addedTokens : aTokens,
			removedTokens : oldTokens,
			type : Tokenizer.TokenChangeType.TokensChanged
		});
	};
	
	Tokenizer.prototype.removeAllTokens = function(bFireEvent) {
		var i, length, token, tokens;
		tokens = this.getTokens();
		length = tokens.length;
		for (i = 0; i < length; i++) {
			token = tokens[i];
			token.detachDelete(this._onDeleteToken, this);
			token.detachPress(this._onTokenPress, this);
		}
	
		this.removeAllAggregation("tokens");
	
		if (typeof (bFireEvent) === "boolean" && !bFireEvent) {
			return;
		}
	
		this.fireTokenChange({
			addedTokens : [],
			removedTokens : tokens,
			type : Tokenizer.TokenChangeType.TokensChanged
		});
	
		this.fireTokenChange({
			tokens : tokens,
			type : Tokenizer.TokenChangeType.RemovedAll
		});
	};
	
	/**
	 * Function removes all selected tokens
	 * 
	 * @public
	 * @returns {sap.m.Tokenizer} - this for chaining
	 */
	Tokenizer.prototype.removeSelectedTokens = function() {
		var tokensToBeDeleted = this.getSelectedTokens();
		var token, i, length;
		length = tokensToBeDeleted.length;
		if (length === 0) {
			return this;
		}
	
		for (i = 0; i < length; i++) {
			token = tokensToBeDeleted[i];
			this.removeToken(token);
		}
	
		this.scrollToEnd();
		
		this.fireTokenChange({
			addedTokens : [],
			removedTokens : tokensToBeDeleted,
			type : Tokenizer.TokenChangeType.TokensChanged
		});
		
		this._doSelect();
	
		return this;
	};
	
	/**
	 * Function selects all tokens
	 * 
	 * @public
	 * @param {boolean}
	 *          [optional] bSelect - true for selecting, false for deselecting
	 * @returns {sap.m.Tokenizer} - this for chaining
	 */
	Tokenizer.prototype.selectAllTokens = function(bSelect) {
		if (bSelect === undefined) {
			bSelect = true;
		}
	
		var tokens = this.getTokens();
		var token, i, length;
		length = tokens.length;
		for (i = 0; i < length; i++) {
			token = tokens[i];
			token.setSelected(bSelect, true);
		}
		
		this._doSelect();
	
		return this;
	};
	
	/**
	 * Function returns all currently selected tokens
	 * 
	 * @public
	 * @returns {sap.m.Token[]} - array of selected tokens or empty array
	 */
	Tokenizer.prototype.getSelectedTokens = function() {
		var aSelectedTokens = [];
		var i, length, token, tokens;
		tokens = this.getTokens();
		length = tokens.length;
		for (i = 0; i < length; i++) {
			token = tokens[i];
			if (token.getSelected()) {
				aSelectedTokens.push(token);
			}
		}
		return aSelectedTokens;
	};
	
	/**
	 * Function is called when token's delete icon was pressed function destroys token from Tokenizer's aggregation
	 * 
	 * @private
	 * @param oEvent
	 */
	Tokenizer.prototype._onDeleteToken = function(oEvent) {
		var token = oEvent.getParameter("token");
		if (token) {
			token.destroy();
			this.fireTokenChange({
				addedTokens : [],
				removedTokens : [token],
				type : Tokenizer.TokenChangeType.TokensChanged
			});
			
			if (this.getParent() &&  this.getParent() instanceof sap.m.MultiInput && !this.getParent()._bUseDialog) {
				// not set focus to MultiInput in phone mode 
				var $oParent = this.getParent().$();
				$oParent.find("input").focus();
			}

		}
	
	};
	
	/**
	 * Function is called when token is pressed, toggles the token's selection state depending on ctrl key state, deselectes
	 * other tokens. Currently handled by sap.m.Token#ontap
	 * 
	 * @private
	 * @param {jQuery.Event}
	 *          oEvent
	 */
	Tokenizer.prototype._onTokenPress = function(oEvent) {};
	
	Tokenizer.prototype.setEditable = function(bEditable) {
		this.setProperty("editable", bEditable);
		
		var tokens = this.getTokens();
		var length = tokens.length;
		for (var i = 0; i < length; i++) {
			var currentToken = tokens[i];
			currentToken.setEditable(bEditable);
		}

		return this;

	};
	
	/**
	 * Handle the home button, scrolls to the first token
	 *
	 * @param {jQuery.Event}
	 *            oEvent - the occuring event
	 * @private
	 */
	Tokenizer.prototype.onsaphome = function(oEvent) {
		this.scrollToStart();
	};
	
	/**
	 * Handle the end button, scrolls to the last token
	 *
	 * @param {jQuery.Event}
	 *            oEvent - the occuring event
	 * @private
	 */
	Tokenizer.prototype.onsapend = function(oEvent) {
		this.scrollToEnd();
	};
	
	/**
	 * Function cleans up registered eventhandlers
	 * 
	 * @private
	 */
	Tokenizer.prototype.exit = function() {
		this._deregisterResizeHandler();
	};
	
	/**
	 * Function deregisters eventhandlers
	 * 
	 * @private
	 */
	Tokenizer.prototype._deregisterResizeHandler = function(){
		if (this._sResizeHandlerId) {
			sap.ui.core.ResizeHandler.deregister(this._sResizeHandlerId);
			delete this._sResizeHandlerId;
		}
	};
	
	/**
	 * Selects the hidden clip div to enable copy to clipboad.
	 * 
	 * @private
	 */
	Tokenizer.prototype._doSelect = function(){
		if (this._checkFocus() && this._bCopyToClipboardSupport) {
			var oFocusRef = document.activeElement;
			var oSelection = window.getSelection();
			oSelection.removeAllRanges();
			if (this.getSelectedTokens().length) {
				var oRange = document.createRange();
				oRange.selectNodeContents(this.getDomRef("clip"));
				oSelection.addRange(oRange);
			}
			if (window.clipboardData && document.activeElement.id == this.getId() + "-clip") {
				jQuery.sap.focus(oFocusRef.id == this.getId() + "-clip" ? this.getDomRef() : oFocusRef);
			}
		}
	};
	
	Tokenizer.TokenChangeType = {
		Added : "added",
		Removed : "removed",
		RemovedAll : "removedAll",
		TokensChanged : "tokensChanged"
	};
	
	Tokenizer.WaitForAsyncValidation = "sap.m.Tokenizer.WaitForAsyncValidation";
	

	return Tokenizer;

}, /* bExport= */ true);
