/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.m.MaskInput.
sap.ui.define(['jquery.sap.global', './InputBase', './MaskInputRule', 'sap/ui/core/Control'], function (jQuery, InputBase, MaskInputRule, Control) {
	"use strict";


	/**
	 * Constructor for a new MaskInput.
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * The <code>sap.m.MaskInput</code> control allows users to more easily enter data in a certain format (dates, times, phone numbers, credit cards, money, IP addresses, MAC addresses and so on) in a fixed width input.
	 *
	 * @author SAP SE
	 * @extends sap.m.InputBase
	 * @version 1.32.9
	 *
	 * @constructor
	 * @private
	 * @since 1.32.0
	 * @alias sap.m.MaskInput
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var MaskInput = InputBase.extend("sap.m.MaskInput", /** @lends sap.m.MaskInput.prototype */ {
		metadata: {
			library: "sap.m",
			properties: {

				/**
				 * Defines a placeholder symbol. Shown at the position where there is no user input yet.
				 */
				placeholderSymbol: {type: "string", group: "Misc", defaultValue: "_"},

				/**
				 * Mask, described by its characters type(thus its length respectively).
				 * You should have in mind the following important facts:
				 * 1. The mask characters usually should correspond to an existing rule (one rule per unique char).
				 * Characters which don't are considered to be immutable character (i.e. mask like "2099", where '9' corresponds to a rule
				 * for digits, has the characters '2' and '0' as immutable).
				 * 2. Adding a rule corresponding to the placeholderSymbol is not recommended and will lead to an unpredictable behaviour.
				 */
				mask: {type: "string", group: "Misc", defaultValue: null}
			},
			aggregations: {

				/**
				 * A list of validation rules(one rule per mask symbol).
				 */
				rules: {type: "sap.m.MaskInputRule", multiple: true, singularName: "rule"}
			}
		}
	});


	/**
	 * Initializes the control.
	 */
	MaskInput.prototype.init = function () {
		// Stores the caret timeout id for further manipulation (e.g Canceling the timeout)
		this._iCaretTimeoutId = null;
		// Stores the first placeholder replaceable position where the user can enter value (immutable characters are ignored)
		this._iUserInputStartPosition = null;
		//Stores the length of the mask
		this._iMaskLength = null;
		// The last input(dom) value of the MaskInput (includes input characters , placeholders and immutable characters)
		this._sOldInputValue = null;
		//Rules with regular expression tests corresponding to each character
		this._oRules = null;
		// char array for keeping the input value with the applied mask
		this._oTempValue = null;

		setDefaultRules.call(this);
		setupMaskVariables.call(this);
	};

	/**
	 * Called when the control is destroyed.
	 */
	MaskInput.prototype.exit = function () {
		this._iCaretTimeoutId = null;
		this._iUserInputStartPosition = null;
		this._iMaskLength = null;
		this._sOldInputValue = null;
		this._oRules = null;
		this._oTempValue = null;
	};

	/**
	 * Handles the internal event onBeforeRendering.
	 */
	MaskInput.prototype.onBeforeRendering = function () {
		/*We need to check if all properties and rules are valid (although current setters validates the input,
		 because not everything is verified - i.e. modifying an existing rule is not verified in the context of all rules*/
		var sValidationErrorMsg = validateDependencies.call(this);

		if (sValidationErrorMsg) {
			jQuery.sap.log.warning("Invalid mask input: " + sValidationErrorMsg);
		}
		InputBase.prototype.onBeforeRendering.apply(this, arguments);
	};

	/**
	 * Handles the internal event onAfterRendering.
	 */
	MaskInput.prototype.onAfterRendering = function () {
		InputBase.prototype.onAfterRendering.apply(this, arguments);
	};

	/**
	 * Handles focusin event.
	 * @param {object} oEvent The jQuery event
	 */
	MaskInput.prototype.onfocusin = function (oEvent) {
		this._sOldInputValue = this._getInputValue();
		InputBase.prototype.onfocusin.apply(this, arguments);
		applyMask.call(this);
		positionCaret.call(this, true);
	};

	/**
	 * Handles focusout event.
	 * @param {object} oEvent The jQuery event
	 */
	MaskInput.prototype.onfocusout = function (oEvent) {
		//The focusout should not be passed down to the InputBase as it will always generate onChange event.
		//For the sake of MaskInput, change event is decided inside inputCompletedHandler, the reset of the InputBase.onfocusout
		//follows
		this.bFocusoutDueRendering = this.bRenderingPhase;
		this.$().toggleClass("sapMFocus", false);
		// remove touch handler from document for mobile devices
		jQuery(document).off('.sapMIBtouchstart');

		// because dom is replaced during the rendering
		// onfocusout event is triggered probably focus goes to the document
		// so we ignore this event that comes during the rendering
		if (this.bRenderingPhase) {
			return;
		}

		//close value state message popup when focus is out of the input
		this.closeValueStateMessage();
		inputCompletedHandler.call(this);
	};

	/**
	 * Handles onInput event.
	 * @param {object} oEvent The jQuery event
	 */
	MaskInput.prototype.oninput = function (oEvent) {
		InputBase.prototype.oninput.apply(this, arguments);
		applyMask.call(this);
		positionCaret.call(this, false);
	};

	/**
	 * Handles keyPress event.
	 * @param {object} oEvent The jQuery event
	 */
	MaskInput.prototype.onkeypress = function (oEvent) {
		keyPressHandler.call(this, oEvent);
	};

	/**
	 * Handles keyDown event.
	 * @param {object} oEvent The jQuery event
	 */
	MaskInput.prototype.onkeydown = function (oEvent) {
		InputBase.prototype.onkeydown.apply(this, arguments);
		keyDownHandler.call(this, oEvent);
	};

	/**
	 * Handles enter key. Shell subclasses override this method, bare in mind that [Enter] is not really handled here, but in {@link sap.m.MaskInput.prototype#onkeydown}.
	 * @param {jQuery.Event} oEvent The event object.
	 */
	MaskInput.prototype.onsapenter = function(oEvent) {
		//Nothing to do, [Enter] is already handled in onkeydown part.
	};

	/**
	 * Handles the <code>sapfocusleave</code> event of the mask input.
	 * Shell subclasses override this method, bare in mind that <code>sapfocusleave</code> is handled by {@link sap.m.MaskInput.prototype#onfocusout}.
	 *
	 * @param {jQuery.Event} oEvent The event object.
	 * @private
	 */
	MaskInput.prototype.onsapfocusleave = function(oEvent) {
	};

	MaskInput.prototype.addAggregation = function (sAggregationName, oObject, bSuppressInvalidate) {
		if (sAggregationName === "rules") {
			if (!validateRegexAgainstPlaceHolderSymbol.call(this, oObject)) {
				return this;
			}
			// ensure there is no more than a single rule with the same mask format symbol
			removeRuleWithSymbol.call(this, oObject.getMaskFormatSymbol());
			Control.prototype.addAggregation.apply(this, arguments);
			setupMaskVariables.call(this);
			return this;
		} else {
			return Control.prototype.addAggregation.apply(this, arguments);
		}
	};

	MaskInput.prototype.insertAggregation = function (sAggregationName, oObject, iIndex, bSuppressInvalidate) {
		if (sAggregationName === "rules") {
			if (!validateRegexAgainstPlaceHolderSymbol.call(this, oObject)) {
				return this;
			}
			// ensure there is no more than a single rule with the same mask format symbol
			removeRuleWithSymbol.call(this, oObject.getMaskFormatSymbol());
			Control.prototype.insertAggregation.apply(this, arguments);
			setupMaskVariables.call(this);
			return this;
		} else {
			return Control.prototype.insertAggregation.apply(this, arguments);
		}
	};

	/**
	 * Validates that the rule does not include the currently set placeholder symbol as allowed mask character.
	 * @param {object} oRule List of regular expressions per mask symbol
	 * @returns {boolean} Whether the rule is valid.
	 * @private
	 */
	function validateRegexAgainstPlaceHolderSymbol(oRule) {
		if (new RegExp(oRule.getRegex()).test(this.getPlaceholderSymbol())) {
			jQuery.sap.log.error("Rejecting input mask rule because it includes the currently set placeholder symbol.");
			return false;
		}
		return true;
	}

	/**
	 * Overrides the method in order to validate the placeholder symbol.
	 * @param {String} sSymbol The placeholder symbol
	 * @override
	 * @returns {sap.ui.base.MaskInput} this pointer for chaining
	 */
	MaskInput.prototype.setPlaceholderSymbol = function (sSymbol) {
		var bSymbolFound = false;
		// make sure placeholder symbol is always a single regex supported character
		if (!/^.$/i.test(sSymbol)) {
			jQuery.sap.log.error("Invalid placeholder symbol string given");
			return this;
		}

		// make sure the placeholder symbol given is not part of any of the existing rules
		// as regex
		bSymbolFound = this.getRules().some(function(oRule){
			return new RegExp(oRule.getRegex()).test(sSymbol);
		});

		if (bSymbolFound) {
			jQuery.sap.log.error("Rejecting placeholder symbol because it is included as a regex in an existing mask input rule.");
		} else {
			this.setProperty("placeholderSymbol", sSymbol);
			setupMaskVariables.call(this);
		}
		return this;
	};

	/**
	 * Sets the mask for this instance.
	 * The mask is mandatory.
	 * @param {String} sMask The mask
	 * @returns {sap.m.MaskInput} this pointer for chaining
	 * @throws {Error} in case the input is not valid
	 */
	MaskInput.prototype.setMask = function (sMask) {
		if (!sMask) {
			var sErrorMsg = "Setting empty mask does not make sense. Make sure you set it with a non empty value.";
			jQuery.sap.log.warning(sErrorMsg);
			return this;
		}
		this.setProperty("mask", sMask, true);
		setupMaskVariables.call(this);
		return this;
	};

	/**
	 * Verifies whether a character at a given position is allowed according to its mask rule.
	 * @param {String} sChar The character
	 * @param {integer} iIndex The position of the character
	 * @protected
	 */
	MaskInput.prototype._isCharAllowed = function (sChar, iIndex) {
		return this._oRules.applyCharAt(sChar, iIndex);
	};

	/**
	 * Gets a replacement string for the character being placed in the input.
	 * Sub-classes may override this method in order to get some additional behavior. For instance, switch current input
	 * character with other for time input purposes like : in 12hours format if the user enters 2 the consumer may use
	 * this method to replace the input from "2" to "02".
	 * @param {String} sChar The current character from the input
	 * @param {integer} iPlacePosition The position the character should occupy
	 * @param {string} sCurrentInputValue The value currently inside the input field (may differ from the property value)
	 * @returns {String} A string that replaces the character.
	 * @protected
	 */
	MaskInput.prototype._feedReplaceChar = function (sChar, iPlacePosition, sCurrentInputValue) {
		return sChar;
	};

	/********************************************************************************************
	 ****************************** Private methods and classes *********************************
	 ********************************************************************************************/

	/**
	 * Encapsulates the work with a char array.
	 * @param {Array} aContent The char array
	 * @constructor
	 * @private
	 */
	var CharArray = function (aContent) {
		// Initial content
		this._aInitial = aContent.slice(0);
		//The real content
		this._aContent = aContent;
	};

	CharArray.prototype.setCharAt = function (sChar, iPosition) {
		this._aContent[iPosition] = sChar;
	};

	CharArray.prototype.charAt = function (iPosition) {
		return this._aContent[iPosition];
	};

	/**
	 * Converts the char array to a string representation.
	 * @returns {String} The char array converted to a string
	 * @private
	 */
	CharArray.prototype.toString = function () {
		return this._aContent.join('');
	};

	/**
	 * Checks whether the char array content differs from its original content.
	 * @returns {boolean} True if different content, false otherwise.
	 * @private
	 */
	CharArray.prototype.differsFromOriginal = function () {
		return this.differsFrom(this._aInitial);
	};

	/**
	 * Checks whether the char array content differs from given string
	 * @param {string | array} vValue the value to compare the char array with
	 * @returns {boolean} True if different content, false otherwise.
	 * @private
	 */
	CharArray.prototype.differsFrom = function (vValue) {
		var i = 0;
		if (vValue.length !== this._aContent.length) {
			return true;
		}
		for (i = 0; i < vValue.length; i++) {
			if (vValue[i] !== this._aContent[i]) {
				return true;
			}
		}
		return false;
	};

	/**
	 * Gets the size of the CharArray.
	 * @returns {int} Number of items in the char array.
	 * @private
	 */
	CharArray.prototype.getSize = function () {
		return this._aContent.length;
	};

	/**
	 * Encapsulates the work with test rules.
	 * @param aRules The test rules.
	 * @constructor
	 * @private
	 */
	var TestRules = function (aRules) {
		this._aRules = aRules;
	};

	/**
	 * Finds the next testable position.
	 * @param {int} iCurrentPos The current position next to which seeking start from (if omitted -1 will be assumed)
	 * @returns {int} The found position.
	 * @private
	 */
	TestRules.prototype.nextTo = function (iCurrentPos) {
		var iPosition = iCurrentPos;

		if (typeof iPosition === "undefined") {
			iPosition = -1; //this will make sure the 0 rule is also included in the search
		}
		do {
			iPosition++;
		} while (iPosition < this._aRules.length && !this._aRules[iPosition]);

		return iPosition;
	};

	/**
	 * Finds the previous testable position in the MaskInput.
	 * @param {int} iCurrentPos The current position before which seeking starts from
	 * @returns {int} The found position.
	 * @private
	 */
	TestRules.prototype.previous = function (iCurrentPos) {
		var iPosition = iCurrentPos;

		do {
			iPosition--;
		} while (!this._aRules[iPosition] && iPosition > 0);

		return iPosition;
	};

	/**
	 * Checks whether there is rule at given index.
	 * @param {int} iIndex The index of the rule
	 * @returns {boolean} Whether there is a rule at the specified index.
	 * @private
	 */
	TestRules.prototype.hasRuleAt = function (iIndex) {
		return !!this._aRules[iIndex];
	};

	/**
	 * Applies a given rule to a given char.
	 * @param {String} sChar The character to which a rule will be applied
	 * @param {integer} iIndex The rule index
	 * @returns {boolean} True if the char passes the validation rule, false otherwise.
	 * @private
	 */
	TestRules.prototype.applyCharAt = function (sChar, iIndex) {
		return this._aRules[iIndex].test(sChar);
	};

	/**
	 * Set up default mask rules.
	 * @private
	 */
	function setDefaultRules() {
		this.addRule(new sap.m.MaskInputRule({
			maskFormatSymbol: "a",
			regex: "[A-Za-z]"
		}));
		this.addRule(new sap.m.MaskInputRule({
			maskFormatSymbol: "9",
			regex: "[0-9]"
		}));
	}

	/**
	 * Checks if the dependent properties and aggregations are valid.
	 * @return {string | null} The errors if any, or false value if no errors.
	 * @private
	 */
	function validateDependencies() {
		var sPlaceholderSymbol = this.getPlaceholderSymbol(),
			aRules = this.getRules(),
			aMaskFormatSymbols = [],
			aErrMessages = [];

		if (!this.getMask()) {
			aErrMessages.push("Empty mask");
		}
		// Check if rules are valid (not duplicated and different from the placeholderSymbol)
		if (aRules.length) {
			aMaskFormatSymbols = [];
			aRules.every(function (oRule) {
				var sMaskFormatSymbol = oRule.getMaskFormatSymbol(),
					bCurrentDiffersFromPlaceholder = sMaskFormatSymbol !== sPlaceholderSymbol,
					bCurrentDiffersFromOthers;

				bCurrentDiffersFromOthers = !aMaskFormatSymbols.some(function (sSymbol) {
					return sMaskFormatSymbol === sSymbol;
				});
				aMaskFormatSymbols.push(sMaskFormatSymbol);

				if (!bCurrentDiffersFromPlaceholder) {
					aErrMessages.push("Placeholder symbol is the  same as the existing rule's mask format symbol");
				}
				if (!bCurrentDiffersFromOthers) {
					aErrMessages.push("Duplicated rule's maskFormatSymbol [" + sMaskFormatSymbol + "]");
				}

				return bCurrentDiffersFromPlaceholder && bCurrentDiffersFromOthers;
			});
		}

		return aErrMessages.length ? aErrMessages.join(". ") : null;
	}

	/**
	 * Removes any existing rules with a specific mask symbol.
	 * @param {string} sSymbol The symbol of MaskInputRule which is to be removed
	 * @private
	 */
	function removeRuleWithSymbol(sSymbol) {
		var oSearchRuleResult = findRuleBySymbol(sSymbol, this.getRules());
		if (oSearchRuleResult) {
			this.removeAggregation('rules', oSearchRuleResult.oRule);
		}
	}

	/**
	 * Searches for a particular MaskInputRule by a given symbol.
	 * @param {string} sMaskRuleSymbol The rule symbol to search for
	 * @param {array} aRules A collection of rules to search in
	 * @returns {null|object} Two key result (for example, { oRule: {MaskInputRule} The found rule, iIndex: {int} the index of it }).
	 * @private
	 */
	function findRuleBySymbol(sMaskRuleSymbol, aRules) {
		var oResult = null;

		if (typeof sMaskRuleSymbol !== "string" || sMaskRuleSymbol.length !== 1) {
			jQuery.sap.log.error(sMaskRuleSymbol + " does not appear to be a valid mask rule symbol");
			return null;
		}

		jQuery.each(aRules, function (iIndex, oRule) {
			if (oRule.getMaskFormatSymbol() === sMaskRuleSymbol) {
				oResult = {
					oRule: oRule,
					iIndex: iIndex
				};
				return false;
			}
		});

		return oResult;
	}

	/**
	 * Gets the position range of the selected text.
	 * @returns {object} An object that contains the start and end positions of the selected text (zero based).
	 * @private
	 */
	function getTextSelection() {
		var _$Input = jQuery(this.getFocusDomRef());

		if (!_$Input && (_$Input.length === 0 || _$Input.is(":hidden"))) {
			return;
		}

		return {
			iFrom: _$Input[0].selectionStart,
			iTo: _$Input[0].selectionEnd,
			bHasSelection: (_$Input[0].selectionEnd - _$Input[0].selectionStart !== 0)
		};
	}

	/**
	 * Places the cursor on a given position (zero based).
	 * @param {int} iPos The position the cursor to be placed on
	 * @returns {jQuery} The jQuery object of MaskInput
	 * @private
	 */
	function setCursorPosition(iPos) {
		var _$Input = jQuery(this.getFocusDomRef());
		return _$Input.cursorPos(iPos);
	}

	/**
	 * Gets the current position of the cursor.
	 * @returns {int} The current cursor position (zero based).
	 * @private
	 */
	function getCursorPosition() {
		var _$Input = jQuery(this.getFocusDomRef());
		return _$Input.cursorPos();
	}

	/**
	 * Setups the mask.
	 * @private
	 */
	function setupMaskVariables() {
		var aRules = this.getRules(),
			sMask = this.getMask(),
			aMask = sMask.split(""),
			sPlaceholderSymbol = this.getPlaceholderSymbol();

		var aValue = buildInitialArray(aMask, sPlaceholderSymbol, aRules);
		this._oTempValue = new CharArray(aValue);

		var aTests = buildRules(aMask, aRules);
		this._iMaskLength = aTests.length;

		this._oRules = new TestRules(aTests);
		this._iUserInputStartPosition = this._oRules.nextTo();
	}

	/**
	 * Applies the mask functionality to the input.
	 * @private
	 */
	function applyMask() {
		var sMaskInputValue = this._getInputValue();

		if (!this.getEditable()) {
			return;
		}
		applyAndUpdate.call(this, sMaskInputValue);
	}

	/**
	 * Performs left shifting starting from a specified position.
	 * @param {int} iFrom The most left position to shift
	 * @param {int} iTo The most right position to shift
	 * @private
	 */
	function shiftLeft(iFrom, iTo) {
		var iIndex,
				iNextApplicableRuleIndex,
				bCharPassesValidation,
				sChar,
				sPlaceholderSymbol = this.getPlaceholderSymbol();

		if (iFrom >= 0) {
			iNextApplicableRuleIndex = this._oRules.nextTo(iTo);
			for (iIndex = iFrom; iIndex < this._iMaskLength; iIndex++) {

				if (this._oRules.hasRuleAt(iIndex)) {
					sChar = this._oTempValue.charAt(iNextApplicableRuleIndex);
					bCharPassesValidation = this._oRules.applyCharAt(sChar,  iIndex);

					if (iNextApplicableRuleIndex < this._iMaskLength && bCharPassesValidation) {
						this._oTempValue.setCharAt(sPlaceholderSymbol, iNextApplicableRuleIndex);
						this._oTempValue.setCharAt(sChar, iIndex);
						iNextApplicableRuleIndex = this._oRules.nextTo(iNextApplicableRuleIndex);
					} else {
						this.updateDomValue(this._oTempValue.toString());
						setCursorPosition.call(this, Math.max(this._iUserInputStartPosition, iFrom));
						return;
					}
				}
			}
		}

	}

	/**
	 * Performs right shifting starting from a specified position.
	 * @param {int} iStartPosition The starting position
	 * @private
	 */
	function shiftRight(iStartPosition) {
		var iIndex,
			iNextApplicableRuleIndex,
			sTempChar,
			sPlaceholderSymbol = this.getPlaceholderSymbol(),
			sChar = sPlaceholderSymbol;

		for (iIndex = iStartPosition; iIndex < this._iMaskLength; iIndex++) {

			if (this._oRules.hasRuleAt(iIndex)) {
				this._oTempValue.setCharAt(sChar, iIndex);
				iNextApplicableRuleIndex = this._oRules.nextTo(iIndex);

				if (iNextApplicableRuleIndex >= this._iMaskLength) {
					return;
				}
				sTempChar = this._oTempValue.charAt(iIndex);

				if (!this._oRules.applyCharAt(sTempChar,  iNextApplicableRuleIndex)) {
					return;
				}

				sChar = sTempChar;
			}
		}
	}

	/**
	 * Resets the temp value with a given range.
	 * @param {int} iFrom The beginning position to start clearing (optional, zero based, default 0)
	 * @param {int} iTo The ending position to finish clearing (optional, zero based, defaults to last char array index)
	 * @private
	 */
	function resetTempValue(iFrom, iTo) {
		var iIndex,
			sPlaceholderSymbol = this.getPlaceholderSymbol();

		if (typeof iFrom === "undefined" || iFrom === null) {
			iFrom = 0;
			iTo = this._oTempValue.getSize() - 1;
		}

		for (iIndex = iFrom; iIndex <= iTo; iIndex++) {
			if (this._oRules.hasRuleAt(iIndex)) {
				this._oTempValue.setCharAt(sPlaceholderSymbol, iIndex);
			}
		}
	}

	/**
	 * Applies rules and updates the DOM input value.
	 * @param {String} sMaskInputValue MaskInputValue to be applied
	 * @private
	 */
	function applyAndUpdate(sMaskInputValue) {
		applyRules.call(this, sMaskInputValue);
		this.updateDomValue(this._oTempValue.toString());
	}

	/**
	 * Finds the first placeholder replaceable position.
	 * @returns {int} The first placeholder replaceable position (zero based)
	 * @private
	 */
	function findFirstPlaceholderPosition() {
		return this._iLastMatch;
	}

	/**
	 * Applies the rules to the given input string and updates char array with the result.
	 * @param {string} sInput The input string the rules will be applied to
	 * @private
	 */
	function applyRules(sInput) {
		var sCharacter,
				iInputIndex = 0,
				iMaskIndex,
				sPlaceholderSymbol = this.getPlaceholderSymbol(),
				bCharMatched;

		this._iLastMatch = -1;
		for (iMaskIndex = 0; iMaskIndex < this._iMaskLength; iMaskIndex++) {
			if (this._oRules.hasRuleAt(iMaskIndex)) {
				this._oTempValue.setCharAt(sPlaceholderSymbol, iMaskIndex);
				bCharMatched = false;

				if (sInput.length) {
					do {
						sCharacter = sInput.charAt(iInputIndex);
						iInputIndex++;

						if (this._oRules.applyCharAt(sCharacter, iMaskIndex)) {
							this._oTempValue.setCharAt(sCharacter, iMaskIndex);
							this._iLastMatch = iMaskIndex;
							bCharMatched = true;
						}
					} while (!bCharMatched && (iInputIndex < sInput.length));
				}

				// the input string is over ->reset the rest of the char array to the end
				if (!bCharMatched) {
					resetTempValue.call(this, iMaskIndex + 1, this._iMaskLength - 1);
					break;
				}
			} else {
				if (this._oTempValue.charAt(iMaskIndex) === sInput.charAt(iInputIndex)) {
					iInputIndex++;
				}
				this._iLastMatch = iMaskIndex;
			}
		}
	}

	/**
	 * Handles onKeyPress event.
	 * @param {jQuery.event} oEvent jQuery event object
	 * @private
	 */
	function keyPressHandler(oEvent) {
		if (!this.getEditable()) {
			return;
		}

		var oSelection = getTextSelection.call(this),
			iPosition,
			sCharReplacement,
			oKey = parseKeyBoardEvent(oEvent);

		if (oKey.bCtrlKey || oKey.bAltKey || oKey.bMetaKey || oKey.bBeforeSpace) {
			return;
		}

		if (!oKey.bEnter && !oKey.bShiftLeftOrRightArrow && !oKey.bHome && !oKey.bEnd &&
				!(oKey.bShift && oKey.bDelete) &&
				!(oKey.bCtrlKey && oKey.bInsert) &&
				!(oKey.bShift && oKey.bInsert)) {
			if (oSelection.bHasSelection) {
				resetTempValue.call(this, oSelection.iFrom, oSelection.iTo - 1);
				shiftLeft.call(this, oSelection.iFrom, oSelection.iTo - 1);
			}
			iPosition = this._oRules.nextTo(oSelection.iFrom - 1);

			if (iPosition < this._iMaskLength) {
				sCharReplacement = this._feedReplaceChar(oKey.sChar, iPosition, this._getInputValue());
				feedNextString.call(this, sCharReplacement, iPosition);
			}
			oEvent.preventDefault();
		}
	}

	/**
	 * Handles onKeyDown event.
	 * @param {jQuery.event} oEvent jQuery event object
	 * @private
	 */
	function keyDownHandler(oEvent) {
		var oSelection,
			iBegin,
			iEnd,
			iCursorPos,
			iNextCursorPos,
			oKey = parseKeyBoardEvent(oEvent);

		if (!this.getEditable()) {
			return;
		}

		if (!oKey.bShift && (oKey.bArrowRight || oKey.bArrowLeft)) {
			iCursorPos = getCursorPosition.call(this);
			iNextCursorPos = (oKey.bArrowRight ? this._oRules.nextTo(iCursorPos) : this._oRules.previous(iCursorPos));
			setCursorPosition.call(this, iNextCursorPos);
			oEvent.preventDefault();

		} else if (oKey.bEscape) {
			applyAndUpdate.call(this, this._sOldInputValue);
			positionCaret.call(this, true);//this.selectText(0, findFirstPlaceholderPosition.call(this) + 1);
			oEvent.preventDefault();

		} else if (oKey.bEnter) {
			inputCompletedHandler.call(this, oEvent);

		} else if ((oKey.bShift && oKey.bDelete) ||
				(oKey.bCtrlKey && oKey.bInsert) ||
				(oKey.bShift && oKey.bInsert)) {
			InputBase.prototype.onkeydown.apply(this, arguments);

		} else if (oKey.bDelete || oKey.bBackspace) {
			oSelection = getTextSelection.call(this);
			iBegin = oSelection.iFrom;
			iEnd = oSelection.iTo;

			if (!oSelection.bHasSelection) {
				if (oKey.bDelete) {
					iEnd = this._oRules.nextTo(iBegin - 1);
					iBegin = iEnd;
					iEnd = this._oRules.nextTo(iEnd);
				} else {
					iBegin = this._oRules.previous(iBegin);
				}
			}
			resetTempValue.call(this, iBegin, iEnd - 1);
			shiftLeft.call(this, iBegin, iEnd - 1);

			oEvent.preventDefault();
		}
	}

	function feedNextString(sNextString, iPos) {
		var iNextPos,
			bAtLeastOneSuccessfulCharPlacement = false,
			aNextChars = sNextString.split(""),
			sNextChar;

		while (aNextChars.length) {
			sNextChar = aNextChars.splice(0, 1)[0]; //get and remove the first element
			if (this._oRules.applyCharAt(sNextChar, iPos)) {
				bAtLeastOneSuccessfulCharPlacement = true;

				shiftRight.call(this, iPos);
				this._oTempValue.setCharAt(sNextChar, iPos);
				iPos = this._oRules.nextTo(iPos);
			}
		}

		if (bAtLeastOneSuccessfulCharPlacement) {
			iNextPos = iPos; //because the cycle above already found the next pos
			this.updateDomValue(this._oTempValue.toString());
			setCursorPosition.call(this, iNextPos);
		}
	}

	/**
	 * Handles completed user input.
	 * @private
	 */
	function inputCompletedHandler() {
		var sNewMaskInputValue = this._getInputValue(),
			bTempValueDiffersFromOriginal,
			sValue,
			bEmptyPreviousDomValue,
			bEmptyNewDomValue;

		if (this._oTempValue.differsFrom(sNewMaskInputValue)) {
			applyAndUpdate.call(this, sNewMaskInputValue);
		}

		bTempValueDiffersFromOriginal = this._oTempValue.differsFromOriginal();
		sValue = bTempValueDiffersFromOriginal ? this._oTempValue.toString() : "";
		bEmptyPreviousDomValue = !this._sOldInputValue;
		bEmptyNewDomValue = !sNewMaskInputValue;

		if (bEmptyPreviousDomValue && (bEmptyNewDomValue || !bTempValueDiffersFromOriginal)){
			this.updateDomValue("");
			return;
		}

		if (this._sOldInputValue !== this._oTempValue.toString()) {
			this.setValue(sValue);
			if (this.onChange && !this.onChange({value: sValue})) {//if the subclass didn't fire the "change" event by itself
				this.fireChangeEvent(sValue);
			}
		}
	}

	function buildInitialArray(aMask, sPlaceholderSymbol, aRules) {
		return aMask.map(function (sChar, iIndex) {
			return findRuleBySymbol(sChar, aRules) ? sPlaceholderSymbol : sChar;
		});
	}

	/**
	 * Builds the test rules according to the mask input rule's regex string.
	 * @private
	 */
	function buildRules(aMask, aRules) {
		var aTestRules = [];

		jQuery.each(aMask, function (iIndex, sChar) {
			var oSearchResult = findRuleBySymbol(sChar, aRules);
			aTestRules.push(oSearchResult ? new RegExp(oSearchResult.oRule.getRegex()) : null);
		});
		return aTestRules;
	}

	/**
	 * Parses the keyboard events.
	 * @param {object} oEvent
	 * @private
	 * @returns {object} Summary object with information about the pressed keys. For example: {{iCode: (*|oEvent.keyCode), sChar: (string|*), bCtrlKey: boolean, bAltKey: boolean, bMetaKey: boolean,
	 * bShift: boolean, bBackspace: boolean, bDelete: boolean, bEscape: boolean, bEnter: boolean, bIphoneEscape: boolean,
	 * bArrowRight: boolean, bArrowLeft: boolean, bHome: boolean, bEnd: boolean, bShiftLeftOrRightArrow: boolean,
	 * bBeforeSpace: boolean}}
	 */
	function parseKeyBoardEvent(oEvent) {
		var iPressedKey = oEvent.which || oEvent.keyCode,
			mKC = jQuery.sap.KeyCodes,
			bArrowRight = iPressedKey === mKC.ARROW_RIGHT,
			bArrowLeft = iPressedKey === mKC.ARROW_LEFT,
			bShift = oEvent.shiftKey;

		return {
			iCode: iPressedKey,
			sChar: String.fromCharCode(iPressedKey),
			bCtrlKey: oEvent.ctrlKey,
			bAltKey: oEvent.altKey,
			bMetaKey: oEvent.metaKey,
			bShift: bShift,
			bInsert: iPressedKey === jQuery.sap.KeyCodes.INSERT,
			bBackspace: iPressedKey === mKC.BACKSPACE,
			bDelete: iPressedKey === mKC.DELETE,
			bEscape: iPressedKey === mKC.ESCAPE,
			bEnter: iPressedKey === mKC.ENTER,
			bIphoneEscape: (sap.ui.Device.system.phone && sap.ui.Device.os.ios && iPressedKey === 127),
			bArrowRight: bArrowRight,
			bArrowLeft: bArrowLeft,
			bHome: iPressedKey === jQuery.sap.KeyCodes.HOME,
			bEnd:  iPressedKey === jQuery.sap.KeyCodes.END,
			bShiftLeftOrRightArrow: bShift && (bArrowLeft || bArrowRight),
			bBeforeSpace: iPressedKey < mKC.SPACE
		};
	}

	/**
	 * Positions the caret or selects the whole input.
	 * @param {boolean} bSelectAllIfInputIsCompleted If true selects the whole input if it is fully completed,
	 * otherwise always moves the caret to the first placeholder position
	 */
	function positionCaret(bSelectAllIfInputIsCompleted) {
		var sMask = this.getMask(),
			iEndSelectionIndex;

		clearTimeout(this._iCaretTimeoutId);
		iEndSelectionIndex = findFirstPlaceholderPosition.call(this);
		this._iCaretTimeoutId = jQuery.sap.delayedCall(0, this, function () {
			if (this.getFocusDomRef() !== document.activeElement) {
				return;
			}
			if (bSelectAllIfInputIsCompleted && (iEndSelectionIndex === (sMask.length - 1))) {
				this.selectText(0, iEndSelectionIndex + 1); //iEndSelectionIndex+1, because selectText end index is exclusive
			} else {
				setCursorPosition.call(this, iEndSelectionIndex + 1);
			}
		});
	}

	return MaskInput;

}, /* bExport= */ false);
