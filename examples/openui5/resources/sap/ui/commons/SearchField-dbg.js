/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.commons.SearchField.
sap.ui.define(['jquery.sap.global', './ComboBox', './ComboBoxRenderer', './ListBox', './TextField', './TextFieldRenderer', './library', 'sap/ui/core/Control', 'sap/ui/core/History', 'sap/ui/core/Renderer', 'jquery.sap.dom'],
	function(jQuery, ComboBox, ComboBoxRenderer, ListBox, TextField, TextFieldRenderer, library, Control, History, Renderer/*, DOM*/) {
	"use strict";


	
	/**
	 * Constructor for a new SearchField.
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * Allows the user to type search queries and to trigger the search. Optionally, suggestions can be added.
	 * @extends sap.ui.core.Control
	 * @implements sap.ui.commons.ToolbarItem
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @alias sap.ui.commons.SearchField
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var SearchField = Control.extend("sap.ui.commons.SearchField", /** @lends sap.ui.commons.SearchField.prototype */ { metadata : {
	
		interfaces : [
			"sap.ui.commons.ToolbarItem"
		],
		library : "sap.ui.commons",
		properties : {
	
			/**
			 * Defines whether a pop up list shall be provided for suggestions
			 */
			enableListSuggest : {type : "boolean", group : "Behavior", defaultValue : true},
	
			/**
			 * Defines whether the list expander shall be displayed in the case of an enabled list for suggestions. This feature is deactivated on mobile devices.
			 */
			showListExpander : {type : "boolean", group : "Behavior", defaultValue : true},
	
			/**
			 * Defines whether the clear functionality shall be active
			 */
			enableClear : {type : "boolean", group : "Behavior", defaultValue : false},
	
			/**
			 * Defines whether an additional search button shall be displayed
			 */
			showExternalButton : {type : "boolean", group : "Behavior", defaultValue : false},
	
			/**
			 * When list suggestion is enabled all suggestions are cached and no suggest event is fired.
			 * @since 1.10.3
			 */
			enableCache : {type : "boolean", group : "Behavior", defaultValue : true},
	
			/**
			 * Defines whether the search event should also be fired when the SearchField is empty (like a Filter field) and when the clear button (if activated) is pressed.
			 */
			enableFilterMode : {type : "boolean", group : "Behavior", defaultValue : false},
	
			/**
			 * Text that shall be displayed within the search field
			 */
			value : {type : "string", group : "Data", defaultValue : ''},
	
			/**
			 * Disabled fields have different colors, and they can not be focused.
			 */
			enabled : {type : "boolean", group : "Behavior", defaultValue : true},
	
			/**
			 * Non-editable controls have different colors, depending on custom settings
			 */
			editable : {type : "boolean", group : "Behavior", defaultValue : true},
	
			/**
			 * Control width in CSS-size
			 */
			width : {type : "sap.ui.core.CSSSize", group : "Dimension", defaultValue : null},
	
			/**
			 * Maximum number of characters. Value '0' means the feature is switched off.
			 */
			maxLength : {type : "int", group : "Behavior", defaultValue : 0},
	
			/**
			 * Visualizes warnings or errors related to the input field. Possible values: Warning, Error, Success, None.
			 * @since 1.32
			 */
			valueState: {type : "sap.ui.core.ValueState", group : "Appearance", defaultValue : sap.ui.core.ValueState.None},

			/**
			 * Placeholder for the input field.
			 * @since 1.32
			 */
			placeholder: {type : "string", group : "Appearance", defaultValue : ""},
			
			/**
			 * Sets the horizontal alignment of the text
			 */
			textAlign : {type : "sap.ui.core.TextAlign", group : "Appearance", defaultValue : sap.ui.core.TextAlign.Begin},
	
			/**
			 * 
			 * Defines the number of items in the suggestion list that shall be displayed at once. If the overall number of list items is higher than the setting,
			 * a scroll bar is provided.
			 */
			visibleItemCount : {type : "int", group : "Behavior", defaultValue : 20},
	
			/**
			 * 
			 * Minimum length of the entered string triggering the suggestion list.
			 */
			startSuggestion : {type : "int", group : "Behavior", defaultValue : 3},
	
			/**
			 * 
			 * Maximum number of suggestion items in the suggestion list.
			 */
			maxSuggestionItems : {type : "int", group : "Behavior", defaultValue : 10},
	
			/**
			 * Maximum number of history items in the suggestion list.
			 * 0 displays and stores no history. The history is locally stored on the client. Therefore do not activate this feature when this control handles confidential data.
			 */
			maxHistoryItems : {type : "int", group : "Behavior", defaultValue : 0}
		},
		aggregations : {
	
			/**
			 * Search provider instance which handles the suggestions for this SearchField (e.g. Open Search Protocol).
			 */
			searchProvider : {type : "sap.ui.core.search.SearchProvider", multiple : false}
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
			 * Event which is fired when the user triggers a search
			 */
			search : {
				parameters : {
	
					/**
					 * The search query
					 */
					query : {type : "string"}
				}
			}, 
	
			/**
			 * Event which is fired when new suggest values are required.
			 */
			suggest : {
				parameters : {
	
					/**
					 * The value for which suggestions are required.
					 */
					value : {type : "string"}
				}
			}
		}
	}});
	
	
	(function() {
	
	var _DEFAULT_VISIBLE_ITEM_COUNT = 20;
	
	//***********************************************
	// Internal control functions
	//***********************************************
	
	/**
	 * Does the setup when the control is created.
	 * @private
	 */
	SearchField.prototype.init = function(){
		_initChildControls(this, this.getEnableListSuggest());
		this._oHistory = new History(this.getId());
		this._clearTooltipText = getText("SEARCHFIELD_CLEAR_TOOLTIP");
	};
	
	
	/**
	 * Does all the cleanup when the control is to be destroyed.
	 * Called from Element's destroy() method.
	 * @private
	 */
	SearchField.prototype.exit = function(){
		if (this._ctrl) {
			this._ctrl.destroy();
		}
		if (this._lb) {
			this._lb.destroy();
		}
		if (this._btn) {
			this._btn.destroy();
		}
		this._ctrl = null;
		this._lb = null;
		this._btn = null;
		this._oHistory = null;
	};
	
	
	/**
	 * Called when the theme is changed.
	 * @private
	 */
	SearchField.prototype.onThemeChanged = function(oEvent){
		if (this.getDomRef()) {
			this.invalidate();
		}
	};
	
	
	/**
	 * Called when the rendering is complete.
	 * @private
	 */
	SearchField.prototype.onAfterRendering = function(){
		if (this.getShowExternalButton()) {
			var iButtonWidth = this._btn.$().outerWidth(true);
			this._ctrl.$().css(sap.ui.getCore().getConfiguration().getRTL() ? "left" : "right", iButtonWidth + "px");
	    }
		_setClearTooltip(this);
	};
	
	
	SearchField.prototype.getFocusDomRef = function() {
		return this._ctrl.getFocusDomRef();
	};
	
	
	SearchField.prototype.getIdForLabel = function () {
		return this._ctrl.getId() + '-input';
	};
	
	
	SearchField.prototype.onpaste = function (oEvent) {
		var that = this;
		setTimeout(function(){
			//Refresh suggestions on cut or paste
			that._ctrl._triggerValueHelp = true;
			that._ctrl.onkeyup();
		}, 0);
	};
	SearchField.prototype.oncut = SearchField.prototype.onpaste;
	
	
	SearchField.prototype.fireSearch = function(mArguments) {
		var sVal = jQuery(this._ctrl.getInputDomRef()).val();
		if (!this.getEditable() || !this.getEnabled()) {
			return this;
		}
		
		this.setValue(sVal);
		
		if (!sVal && !this.getEnableFilterMode()) {
			return this;
		}
		
		if (!mArguments) {
			mArguments = {};
		}
		
		if (!mArguments.noFocus) {
			sVal = this.getValue();
			this.focus();
			if (sVal && (this.getMaxHistoryItems() > 0)) {
				this._oHistory.add(sVal);
			}
			this.fireEvent("search", {query: sVal});
		}
		return this;
	};
	
	
	/**
	 * @private
	 */
	SearchField.prototype.hasListExpander = function(){
		return isMobile() ? false : this.getShowListExpander();
	};
	
	
	//***********************************************
	// Overridden getter und setter, API functions
	//***********************************************
	

	/**
	 * Clears the history of the control
	 *
	 * @type void
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	SearchField.prototype.clearHistory = function() {
		this._oHistory.clear();
	};
	
	

	/**
	 * Callback function used to provide the suggest values in the handler of the suggest event (only in list suggestion mode)
	 *
	 * @param {string} sSSuggestValue
	 *         The value which was provided in the corresponding suggest event (parameter 'value')
	 * @param {string[]} aASuggestions
	 *         The list of suggestions belonging to the suggest value
	 * @type void
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	SearchField.prototype.suggest = function(sSuggestValue, aSuggestions) {
		if (!this.getEnableListSuggest() || !sSuggestValue || !aSuggestions) {
			return;
		}
		this._ctrl.updateSuggestions(sSuggestValue, aSuggestions);
	};
	
	
	SearchField.prototype.setEnableListSuggest = function(bEnableListSuggest) {
		if ((this.getEnableListSuggest() && bEnableListSuggest) || (!this.getEnableListSuggest() && !bEnableListSuggest)) {
			return;
		}
		_initChildControls(this, bEnableListSuggest);
		this.setProperty("enableListSuggest", bEnableListSuggest);
		return this;
	};
	
	SearchField.prototype.getValue = function() {
		return _get(this, "Value");
	};
	
	SearchField.prototype.setValue = function(sValue) {
		var res = _set(this, "Value", sValue, !!this.getDomRef(), true);
		if (this.getEnableClear() && this.getDomRef()) {
			this.$().toggleClass("sapUiSearchFieldVal", !!sValue);
			_setClearTooltip(this);
		}
		return res;
	};
	
	SearchField.prototype.setEnableCache = function(bEnableCache) {
		return this.setProperty("enableCache", bEnableCache, true);
	};
	
	SearchField.prototype.getEnabled = function() {
		return _get(this, "Enabled");
	};
	
	SearchField.prototype.setEnabled = function(bEnabled) {
		if (this._btn) {
			this._btn.setEnabled(bEnabled && this.getEditable());
		}
		return _set(this, "Enabled", bEnabled, false, true);
	};
	
	SearchField.prototype.getEditable = function() {
		return _get(this, "Editable");
	};
	
	SearchField.prototype.setEditable = function(bEditable) {
		if (this._btn) {
			this._btn.setEnabled(bEditable && this.getEnabled());
		}
		return _set(this, "Editable", bEditable, false, true);
	};
	
	SearchField.prototype.getMaxLength = function() {
		return _get(this, "MaxLength");
	};
	
	SearchField.prototype.setMaxLength = function(iMaxLength) {
		return _set(this, "MaxLength", iMaxLength, false, true);
	};
	
	SearchField.prototype.getValueState = function() {
		return _get(this, "ValueState");
	};
	
	SearchField.prototype.setValueState = function(sValueState) {
		return _set(this, "ValueState", sValueState, false, true);
	};
	
	SearchField.prototype.getPlaceholder = function() {
		return _get(this, "Placeholder");
	};
	
	SearchField.prototype.setPlaceholder = function(sText) {
		return _set(this, "Placeholder", sText, false, true);
	};
	
	SearchField.prototype.getTextAlign = function() {
		return _get(this, "TextAlign");
	};
	
	SearchField.prototype.setTextAlign = function(oTextAlign) {
		return _set(this, "TextAlign", oTextAlign, false, true);
	};
	
	SearchField.prototype.getTooltip = function() {
		return _get(this, "Tooltip");
	};
	
	SearchField.prototype.setTooltip = function(oTooltip) {
		return _set(this, "Tooltip", oTooltip, true, false);
	};
	
	SearchField.prototype.getVisibleItemCount = function() {
		return _get(this, "MaxPopupItems");
	};
	
	SearchField.prototype.setVisibleItemCount = function(iVisibleItemCount) {
		return _set(this, "MaxPopupItems", iVisibleItemCount, false, true);
	};
	
	SearchField.prototype.setShowExternalButton = function(bShowExternalButton) {
		if (!this._btn) {
			jQuery.sap.require("sap.ui.commons.Button");
			var that = this;
			this._btn = new sap.ui.commons.Button(this.getId() + "-btn", {
				text: getText("SEARCHFIELD_BUTTONTEXT"),
				enabled: this.getEditable() && this.getEnabled(),
				press: function(){
					that.fireSearch();
				}
			});
			this._btn.setParent(this);
		}
		this.setProperty("showExternalButton", bShowExternalButton);
		return this;
	};
	
	
	SearchField.prototype.getAriaDescribedBy = function() {
		return this._ctrl.getAriaDescribedBy();
	};
	
	SearchField.prototype.getAriaLabelledBy = function() {
		return this._ctrl.getAriaLabelledBy();
	};
	
	SearchField.prototype.removeAllAriaDescribedBy = function() {
		return this._ctrl.removeAllAriaDescribedBy();
	};
	
	SearchField.prototype.removeAllAriaLabelledBy = function() {
		return this._ctrl.removeAllAriaLabelledBy();
	};
	
	SearchField.prototype.removeAriaDescribedBy = function(v) {
		return this._ctrl.removeAriaDescribedBy(v);
	};
	
	SearchField.prototype.removeAriaLabelledBy = function(v) {
		return this._ctrl.removeAriaLabelledBy(v);
	};
	
	SearchField.prototype.addAriaDescribedBy = function(v) {
		this._ctrl.addAriaDescribedBy(v);
		return this;
	};
	
	SearchField.prototype.addAriaLabelledBy = function(v) {
		this._ctrl.addAriaLabelledBy(v);
		return this;
	};
	
	
	//***********************************************
	// Private helper functions
	//***********************************************
	
	var _setClearTooltip = function(oThis){
		var $this = oThis.$(),
			$ico = oThis._ctrl.$("searchico");
		
		if ($this.hasClass("sapUiSearchFieldClear") && $this.hasClass("sapUiSearchFieldVal")) {
			$ico.attr("title", oThis._clearTooltipText);
		} else {
			$ico.removeAttr("title");
		}
	};
	
	var _set = function(oThis, sMutator, oVal, bSuppressRerendering, bUpdateModelProperty) {
		var oOldVal = _get(oThis, sMutator);
		oThis._ctrl["set" + sMutator](oVal);
		if (!bSuppressRerendering) {
			oThis.invalidate();
		}
		if (bUpdateModelProperty) {
			oThis.updateModelProperty(sMutator.toLowerCase(), oVal, oOldVal);
		}
		return oThis;
	};
	
	
	var _get = function(oThis, sGetter) {
		return oThis._ctrl["get" + sGetter]();
	};
	
	
	var _initChildControls = function(oThis, bEnableListSuggest) {
		if (!oThis._lb) {
			oThis._lb = new ListBox(oThis.getId() + "-lb");
		}
	
		var oOldControl = oThis._ctrl;
		var oNewControl = null;
		if (bEnableListSuggest) {
			oNewControl = new SearchField.CB(oThis.getId() + "-cb", {listBox: oThis._lb, maxPopupItems: _DEFAULT_VISIBLE_ITEM_COUNT});
			oNewControl.addDependent(oThis._lb);
		} else {
			oNewControl = new SearchField.TF(oThis.getId() + "-tf");
		}
		oNewControl.setParent(oThis);
		oNewControl.addEventDelegate({
			onAfterRendering: function(){
				_setClearTooltip(oThis);
				var $Focus = jQuery(oNewControl.getFocusDomRef());
				var sLabelledBy = $Focus.attr("aria-labelledby") || "";
				if (sLabelledBy) {
					sLabelledBy = " " + sLabelledBy;
				}
				$Focus.attr("aria-labelledby", oThis.getId() + "-label" + sLabelledBy);
			}
		});
		if (oOldControl) {
			oNewControl.setValue(oOldControl.getValue());
			oNewControl.setEnabled(oOldControl.getEnabled());
			oNewControl.setEditable(oOldControl.getEditable());
			oNewControl.setMaxLength(oOldControl.getMaxLength());
			oNewControl.setValueState(oOldControl.getValueState());
			oNewControl.setPlaceholder(oOldControl.getPlaceholder());
			oNewControl.setTextAlign(oOldControl.getTextAlign());
			oNewControl.setTooltip(oOldControl.getTooltip());
			oNewControl.setMaxPopupItems(oOldControl.getMaxPopupItems());
			
			var aAsso = oOldControl.getAriaDescribedBy();
			for (var i = 0; i < aAsso.length; i++) {
				oNewControl.addAriaDescribedBy(aAsso[i]);
			}
			oOldControl.removeAllAriaDescribedBy();
			
			aAsso = oOldControl.getAriaLabelledBy();
			for (var i = 0; i < aAsso.length; i++) {
				oNewControl.addAriaLabelledBy(aAsso[i]);
			}
			oOldControl.removeAllAriaLabelledBy();
			oOldControl.removeAllDependents();
			
			oOldControl.destroy();
		}
		oThis._ctrl = oNewControl;
	};
	
	
	var getText = function(sKey, aArgs) {
		var rb = sap.ui.getCore().getLibraryResourceBundle("sap.ui.commons");
		if (rb) {
			return rb.getText(sKey, aArgs);
		}
		return sKey;
	};
	
	
	var isMobile = function() {
		return sap.ui.Device.browser.mobile;
	};
	
	
	//***********************************************
	//***********************************************
	// Inner Controls
	//***********************************************
	
	var _renderSearchIcon = function(oRM, oCtrl){
		oRM.write("<div");
		oRM.writeAttributeEscaped('id', oCtrl.getId() + '-searchico');
		oRM.writeAttribute('unselectable', 'on');
		if (sap.ui.getCore().getConfiguration().getAccessibility()) {
			oRM.writeAttribute("role", "presentation");
		}
		oRM.addClass("sapUiSearchFieldIco");
		oRM.writeClasses();
		oRM.write("></div>");
	};
	
	
	//***********************************************
	// Inner Control "Search Textfield"
	//***********************************************
	
	TextField.extend("sap.ui.commons.SearchField.TF", {
	  
		metadata : {
			visibility : "hidden"
		},
		
	  constructor : function (sId, mSettings) {
			TextField.apply(this, arguments);
	  },
	
	  getInputDomRef : function() {
			return this.getDomRef("input");
	  },
	  
	  onkeyup : function(oEvent) {
			SearchField.CB.prototype.onkeyup.apply(this, arguments);
	  },
	  
	  _triggerSuggest : function(sCurrentValue) {
			this._sSuggest = null;
			if ((sCurrentValue && sCurrentValue.length >= this.getParent().getStartSuggestion()) || (!sCurrentValue && this.getParent().getStartSuggestion() == 0)) {
				this.getParent().fireSuggest({value: sCurrentValue});
			}
	  },
	  
	  _checkChange : function(oEvent, bDoNotFireSearch) {
			this.getParent().fireSearch({noFocus:bDoNotFireSearch});
	  },
	  
	  onsapfocusleave : function(oEvent) {
			if (this.getEditable() && this.getEnabled() && this.getRenderer().onblur && oEvent.relatedControlId != this.getId()) {
				this.getRenderer().onblur(this);
			}
			this._checkChange(oEvent, true);
	  },
	  
	  onclick : function(oEvent){
			if (oEvent.target === this.getDomRef("searchico")) {
				if (this.oPopup && this.oPopup.isOpen()) {
					this.oPopup.close();
				}
				if (this.getEditable() && this.getEnabled()) {
					this.focus();
				}
				if (!this.getParent().getEnableClear()) {
					this._checkChange(oEvent);
				} else {
					if (!jQuery(this.getInputDomRef()).val() || !this.getEditable() || !this.getEnabled()) {
					return;
				}
					this.setValue("");
					this._triggerValueHelp = true;
					this.onkeyup();
					if (this.getParent().getEnableFilterMode()) {
						jQuery(this.getInputDomRef()).val("");
						this.getParent().fireSearch();
					}
				}
			}
	  },
	  
	  getMaxPopupItems : function(){
			return this._iVisibleItemCount ? this._iVisibleItemCount : _DEFAULT_VISIBLE_ITEM_COUNT;
	  },
	  
	  setMaxPopupItems : function(iMaxPopupItems){
			this._iVisibleItemCount = iMaxPopupItems;
	  },
	
	  //  extend TextFieldRenderer
	  renderer : {
	    
	    renderOuterContentBefore :_renderSearchIcon,
	    
	    renderOuterAttributes : function(oRM, oCtrl) {
	      oRM.addClass("sapUiSearchFieldTf");
	    },
	    
	    renderInnerAttributes : function(oRM, oCtrl) {
				if (!sap.ui.Device.os.ios) { //on iOS the input is not focused if type search
					oRM.writeAttribute("type", "search");
				}
	      if (isMobile()) {
	        oRM.writeAttribute('autocapitalize', 'off');
	        oRM.writeAttribute('autocorrect', 'off');
	      }
	    }
	    
	  }
	});
	
	// TODO enhance Notepad controls to support such assignments (e.g. "a,b" : function () { ... } )
	SearchField.TF.prototype.getFocusDomRef = SearchField.TF.prototype.getInputDomRef;
	
	
	//***********************************************
	// Inner Control "Search Combo Box"
	//***********************************************
	
	ComboBox.extend("sap.ui.commons.SearchField.CB", {
	  
		metadata : {
			visibility : "hidden"
		},
		
		constructor: function(sId, mSettings) {
			ComboBox.apply(this, arguments);
			this._mSuggestions = {};
			this._aSuggestValues = [];
			this.mobile = false; // switch off native dropdown version
		},

		updateSuggestions: function(sSuggestVal, aSuggestions) {
			this._mSuggestions[sSuggestVal] = aSuggestions;
			if (this.getInputDomRef() && jQuery(this.getInputDomRef()).val() === sSuggestVal && this._hasSuggestValue(sSuggestVal)) {
				this._doUpdateList(sSuggestVal);
			}
		},

		applyFocusInfo: function(oFocusInfo) {
			jQuery(this.getInputDomRef()).val(oFocusInfo.sTypedChars);
			return this;
		},

		_getListBox: function() {
			return this.getParent()._lb;
		},

		_hasSuggestValue: function(sSuggestVal) {
			return this._aSuggestValues.length > 0 && sSuggestVal == this._aSuggestValues[this._aSuggestValues.length - 1];
		},

		_doUpdateList: function(sSuggestVal, bSkipOpen) {
			var bEmpty = this._updateList(sSuggestVal);
			this._aSuggestValues = [sSuggestVal];
			if ((!this.oPopup || !this.oPopup.isOpen()) && !bSkipOpen && !bEmpty) {
				this._open();
			} else if (this.oPopup && this.oPopup.isOpen() && bEmpty) {
				this._close();
			}

			if (!bEmpty && !this._lastKeyIsDel && sSuggestVal === jQuery(this.getInputDomRef()).val()) {
				this._doTypeAhead();
			}
		},
	  
		onclick: function(oEvent) {
			//this._forceOpen = true;
			ComboBox.prototype.onclick.apply(this, arguments);
			//this._forceOpen = false;
			if (oEvent.target === this.getDomRef("searchico")) {
				if (this.oPopup && this.oPopup.isOpen()) {
					this.oPopup.close();
				}
				if (!this.getParent().getEnableClear()) {
					this.getParent().fireSearch();
				} else if (jQuery(this.getInputDomRef()).val() && this.getEditable() && this.getEnabled()) {
					this.setValue("");
					this._triggerValueHelp = true;
					this.onkeyup();
					this._aSuggestValues = [];
					if (this.getParent().getEnableFilterMode()) {
						jQuery(this.getInputDomRef()).val("");
						this.getParent().fireSearch();
					}
				}
				if (this.getEditable() && this.getEnabled()) {
					this.focus();
				}
			} else if (jQuery.sap.containsOrEquals(this.getDomRef("providerico"), oEvent.target)) {
				if (this.getEditable() && this.getEnabled()) {
					this.focus();
				}
			}
		},

		onkeypress: SearchField.TF.prototype.onkeypress,

		onkeyup: function(oEvent) {
			var $Input = jQuery(this.getInputDomRef());
			var sVal = $Input.val();
			
			this.getParent().$().toggleClass("sapUiSearchFieldVal", !!sVal);
			_setClearTooltip(this.getParent());

			if (oEvent) {
				var oKC = jQuery.sap.KeyCodes;
				if (oEvent.keyCode === oKC.F2) {
					// toggle action mode
					var $FocusDomRef = jQuery(this.getFocusDomRef());
					var bDataInNavArea = $FocusDomRef.data("sap.InNavArea");
					if (typeof bDataInNavArea === "boolean") {
						$FocusDomRef.data("sap.InNavArea", !bDataInNavArea);
					}
				}

				if (ComboBox._isHotKey(oEvent) || oEvent.keyCode === oKC.F4 && oEvent.which === 0 /* this is the Firefox case and ensures 's' with same charCode is accepted */) {
					return;
				}
				
				if (sVal && sVal == $Input.getSelectedText()) {
					// When pressing Ctrl+A quite fast a keyup event for "A" is triggered without oEvent.ctrlKey flag.
					// But it behaves like Ctrl+A (Text is marked and A is not entered into the field) -> see BCP 1570032167
					return;
				}

				var iKC = oEvent.which || oEvent.keyCode;
				if (iKC !== oKC.ESCAPE || this instanceof SearchField.TF/* Textfield uses the same onkeyup function therefore check */) {
					this._triggerValueHelp = true;
					this._lastKeyIsDel = iKC == oKC.DELETE || iKC == oKC.BACKSPACE;
				}

			}

			if (this._triggerValueHelp) {
				this._triggerValueHelp = false;
				if (this._sSuggest) {
					jQuery.sap.clearDelayedCall(this._sSuggest);
					this._sSuggest = null;
				}
				var sCurrentValue = jQuery(this.getInputDomRef()).val();
				if ((sCurrentValue && sCurrentValue.length >= this.getParent().getStartSuggestion()) || (!sCurrentValue && this.getParent().getStartSuggestion() == 0)) {
					this._sSuggest = jQuery.sap.delayedCall(200, this, "_triggerSuggest", [sCurrentValue]);
				} else if (this._doUpdateList) { // Textfield uses the same onkeyup function -> therefore check existence of this function
					this._doUpdateList(sCurrentValue, true);
				}
			}
		},

		_triggerSuggest: function(sSuggestValue) {
			this._sSuggest = null;
			if (!this._mSuggestions[sSuggestValue] || !this.getParent().getEnableCache()) {
				this._aSuggestValues.push(sSuggestValue);
				var oSearchProvider = this.getParent().getSearchProvider();
				if (oSearchProvider) {
					var oSearchField = this.getParent();
					oSearchProvider.suggest(sSuggestValue, function(sValue, aSuggestions) {
						if (oSearchField) {
							oSearchField.suggest(sValue, aSuggestions);
						}
					});
				} else {
					this.getParent().fireSuggest({
						value: sSuggestValue
					});
				}
			} else {
				this._doUpdateList(sSuggestValue);
			}
		},

		_updateList: function(sSuggestVal) {
			var bEmpty = false;
			var oLb = this._getListBox();
			oLb.destroyAggregation("items", true);

			var addToListbox = function(oLb, aValues, iMax, bSeparatorBefore) {
				aValues = aValues ? aValues : [];
				var iCount = Math.min(aValues.length, iMax);

				if (bSeparatorBefore && iCount > 0) {
					oLb.addItem(new sap.ui.core.SeparatorItem());
				}

				for (var i = 0; i < iCount; i++) {
					// oLb.addAggregation("items", new sap.ui.core.ListItem({text: aSug[i]}), true);
					oLb.addItem(new sap.ui.core.ListItem({
						text: aValues[i]
					}));
				}
				return iCount;
			};

			var iHistoryCount = addToListbox(oLb, this.getParent()._oHistory.get(sSuggestVal), this.getParent().getMaxHistoryItems(), false);

			var iSuggestCount = addToListbox(oLb, sSuggestVal && sSuggestVal.length >= this.getParent().getStartSuggestion() ? this._mSuggestions[sSuggestVal] : [], this.getParent().getMaxSuggestionItems(), iHistoryCount > 0);

			if (iHistoryCount <= 0 && iSuggestCount == 0) {
				oLb.addItem(new sap.ui.core.ListItem({
					text: getText("SEARCHFIELD_NO_ITEMS"),
					enabled: false
				}));
				bEmpty = true;
			}

			var iItemsLength = oLb.getItems().length;
			var iMaxPopupItems = this.getMaxPopupItems();
			oLb.setVisibleItems(iMaxPopupItems < iItemsLength ? iMaxPopupItems : iItemsLength);
			oLb.setSelectedIndex(-1);
			oLb.setMinWidth(jQuery(this.getDomRef()).rect().width + "px");
			oLb.rerender();
			return bEmpty;
		},

		_prepareOpen: function() {},
	  

		_open: function() {
			ComboBox.prototype._open.apply(this, [0]);
		},

		_rerenderListBox: function() {
			return this._updateList(this._aSuggestValues.length > 0 ? this._aSuggestValues[this._aSuggestValues.length - 1] : null) && !this._forceOpen;
		},

		_checkChange: function(oEvent, bImmediate, bDoNotFireSearch) {
			this.getParent().fireSearch({
				noFocus: bDoNotFireSearch
			});
		},

		onsapfocusleave: function(oEvent) {
			if (oEvent.relatedControlId === this._getListBox().getId()) {
				this.focus();
				return;
			}
			this._checkChange(oEvent, true, true);
		},

		onfocusout: function(oEvent) {
			if (this.getEditable() && this.getEnabled() && this.getRenderer().onblur) {
				this.getRenderer().onblur(this);
			}
			this._checkChange(oEvent, true, true);
		},
	  

		onsapshow: function(oEvent) {
			if (this.getParent().hasListExpander()) {
				//this._forceOpen = true;
				ComboBox.prototype.onsapshow.apply(this, arguments);
				//this._forceOpen = false;
			} else {
				oEvent.preventDefault();
				oEvent.stopImmediatePropagation();
			}
		},

		_handleSelect: function(oControlEvent) {
			var oItem = ComboBox.prototype._handleSelect.apply(this, arguments);
			if (oItem && oItem.getEnabled()) {
				this.getParent().fireSearch();
			}
		},

		// extend ComboBoxRenderer
		renderer: {

			renderOuterContentBefore: function(oRM, oCtrl) {
				if (oCtrl.getParent().hasListExpander()) {
					ComboBoxRenderer.renderOuterContentBefore.apply(this, arguments);
				}
				_renderSearchIcon.apply(this, arguments);

				if (oCtrl.getParent().getSearchProvider() && oCtrl.getParent().getSearchProvider().getIcon()) {
					oRM.write("<div");
					oRM.writeAttributeEscaped('id', oCtrl.getId() + '-providerico');
					oRM.writeAttribute('unselectable', 'on');
					if (sap.ui.getCore().getConfiguration().getAccessibility()) {
						oRM.writeAttribute("role", "presentation");
					}
					oRM.addClass("sapUiSearchFieldProvIco");
					oRM.writeClasses();
					oRM.write("><img src=\"" + oCtrl.getParent().getSearchProvider().getIcon() + "\"/></div>");
				}
			},

			renderOuterAttributes: function(oRM, oCtrl) {
				ComboBoxRenderer.renderOuterAttributes.apply(this, arguments);
				oRM.addClass("sapUiSearchFieldCb");
				if (oCtrl.getParent().getSearchProvider() && oCtrl.getParent().getSearchProvider().getIcon()) {
					oRM.addClass("sapUiSearchFieldCbProv");
				}
			},

			renderInnerAttributes: function(oRM, oCtrl) {
				if (!sap.ui.Device.os.ios) { // on iOS the input is not focused if type search
					oRM.writeAttribute("type", "search");
				}
				if (isMobile()) {
					oRM.writeAttribute('autocapitalize', 'off');
					oRM.writeAttribute('autocorrect', 'off');
				}
			}

		}

	});
	
	}());
	

	return SearchField;

}, /* bExport= */ true);
