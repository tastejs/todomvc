/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.m.SegmentedButton.
sap.ui.define(['jquery.sap.global', './library', 'sap/ui/core/Control', 'sap/ui/core/EnabledPropagator', 'sap/ui/core/delegate/ItemNavigation'],
	function(jQuery, library, Control, EnabledPropagator, ItemNavigation) {
	"use strict";



	/**
	 * Constructor for a new SegmentedButton.
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * SegmentedButton is a horizontal control made of multiple buttons, which can display a title or an image. It automatically resizes the buttons to fit proportionally within the control. When no width is set, the control uses the available width.
	 * @extends sap.ui.core.Control
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @alias sap.m.SegmentedButton
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var SegmentedButton = Control.extend("sap.m.SegmentedButton", /** @lends sap.m.SegmentedButton.prototype */ { metadata : {

		library : "sap.m",
		properties : {

			/**
			 * Defines the width of the SegmentedButton control. If not set, it uses the minimum required width to make all buttons inside of the same size (based on the biggest button).
			 *
			 */
			width : {type : "sap.ui.core.CSSSize", group : "Misc", defaultValue : null},

			/**
			 * Disables all the buttons in the SegmentedButton control. When disabled all the buttons look grey and you cannot focus or click on them.
			 */
			enabled : {type : "boolean", group : "Behavior", defaultValue : true},

			/**
			 * Key of the selected item. If no item to this key is found in the items aggregation, no changes will apply. Only the items aggregation is affected. If duplicate keys exist, the first item matching the key is used.
			 * @since 1.28.0
			 */
			selectedKey: { type: "string", group: "Data", defaultValue: "", bindable: "bindable" }
		},
		defaultAggregation : "buttons",
		aggregations : {

			/**
			 * The buttons of the SegmentedButton control. The items set in this aggregation are used as an interface for the buttons displayed by the control. Only the properties ID, icon, text, enabled and textDirections of the Button control are evaluated. Setting other properties of the button will have no effect. Alternatively, you can use the createButton method to add buttons.
			 * @deprecated Since 1.28.0 Instead use the "items" aggregation.
			 */
			buttons : {type : "sap.m.Button", multiple : true, singularName : "button"},

			/**
			 * Aggregation of items to be displayed. The items set in this aggregation are used as an interface for the buttons displayed by the control.
			 * The "items" and "buttons" aggregations should NOT be used simultaneously as it causes the control to work incorrectly.
			 * @since 1.28
			 */
			items : { type : "sap.m.SegmentedButtonItem", multiple : true, singularName : "item", bindable : "bindable" },

			/**
			 * Hidden aggregation that holds an instance of sap.m.Select to be used in some contexts as a representation of the segmented button (for example, in a popover with little space).
			 */
			_select: { type : "sap.m.Select", multiple : false, visibility : "hidden"}
		},
		associations : {

			/**
			 * A reference to the currently selected button control. By default or if the association is set to false (null, undefined, "", false), the first button will be selected.
			 * If the association is set to an invalid value (for example, an ID of a button that does not exist) the selection on the SegmentedButton will be removed.
			 */
			selectedButton : {type : "sap.m.Button", multiple : false},

			/**
			 * Association to controls / IDs, which describe this control (see WAI-ARIA attribute aria-describedby).
			 */
			ariaDescribedBy : {type : "sap.ui.core.Control", multiple : true, singularName : "ariaDescribedBy"},

			/**
			 * Association to controls / IDs, which label this control (see WAI-ARIA attribute aria-labelledby).
			 */
			ariaLabelledBy : {type : "sap.ui.core.Control", multiple : true, singularName : "ariaLabelledBy"}
		},
		events : {

			/**
			 * Fires when the user selects a button, which returns the ID and button object.
			 */
			select : {
				parameters : {

					/**
					 * Reference to the button, that has been selected.
					 */
					button : {type : "sap.m.Button"},

					/**
					 * ID of the button, which has been selected.
					 */
					id : {type : "string"},

					/**
					 * Key of the button, which has been selected. This property is only filled when the control is initiated with the items aggregation.
					 * @since 1.28.0
					 */
					key : {type : "string"}
				}
			}
		}
	}});


	EnabledPropagator.call(SegmentedButton.prototype);

	SegmentedButton.prototype.init = function () {
		if (sap.ui.Device.browser.internet_explorer && sap.ui.Device.browser.version <= 10) {
			this._isMie = true;
		}
		this._aButtonWidth = [];
		this._oGhostButton = null;

		//create the ghost button which is used to get the actual width of each button
		this._createGhostButton();

		// Delegate keyboard processing to ItemNavigation, see commons.SegmentedButton
		this._oItemNavigation = new ItemNavigation();
		this._oItemNavigation.setCycling(false);
		this.addDelegate(this._oItemNavigation);

		//Make sure when a button gets removed to reset the selected button
		this.removeButton = function (sButton) {
			SegmentedButton.prototype.removeButton.call(this, sButton);
			this.setSelectedButton(this.getButtons()[0]);
		};

		// Workaround for the sake of sap.m.ViewSettingsDialog(VSD), that should be removed once VSD page rendering
		// implementation is changed. If property set to true, the buttons will be rendered with their auto width
		// and no further width updates will occur.
		this._bPreventWidthRecalculationOnAfterRendering = false;
	};

	SegmentedButton.prototype._createGhostButton = function (oButton) {
		if (jQuery("#segMtBtn_calc").length == 0) {
			this._oGhostButton = document.createElement("ul");
			var $li = jQuery("<li>");
			$li.addClass("sapMBtnContent sapMSegBBtn");
			this._oGhostButton.setAttribute("id", "segMtBtn_calc");
			jQuery(this._oGhostButton).append($li).addClass("sapMSegBIcons sapMBtn sapMBtnDefault sapMBtnPaddingLeft");
			this._oGhostButton = jQuery(this._oGhostButton);
		} else {
			this._oGhostButton = jQuery("#segMtBtn_calc");
		}
	};

	SegmentedButton.prototype._setGhostButtonText = function (oButton) {
		var sText = oButton.getText(),
			sIcon = oButton.getIcon(),
			oImage,
			oIcon,
			sHtml,
			oRm,
			iGhostButtonWidth = 0,
			$ghostButton = jQuery("#segMtBtn_calc").find("li");

		$ghostButton.text(sText);

		if (sIcon.length > 0) {
			oRm = sap.ui.getCore().createRenderManager();
			oImage = oButton._getImage(null, oButton.getIcon());

			if (oImage instanceof sap.m.Image) {
				sHtml = oRm.getHTML(oImage);
				$ghostButton.prepend(sHtml);
			} else {
				oIcon = new sap.ui.core.Icon({src: sIcon});
				sHtml = oRm.getHTML(oIcon);
				$ghostButton.prepend(sHtml);
			}
			oRm.destroy();
		}

		if (oButton.getWidth().length === 0) {
			// CSN# 772017/2014: in arrabian languages the jQuery size calculation is wrong (sub-pixel rounding issue)
			if (sap.ui.getCore().getConfiguration().getLanguage() === "ar") {
				// we manually add 1px as a workaround to not run into text truncation
				iGhostButtonWidth = 1;
			}
			iGhostButtonWidth += $ghostButton.outerWidth();
			this._aButtonWidth.push(iGhostButtonWidth);
		} else {
			this._aButtonWidth.push(0);
		}

	};

	SegmentedButton.prototype._addGhostButton = function () {
		this._createGhostButton();
		if (jQuery("#segMtBtn_calc").length === 0) {
			var oStaticAreaDom = sap.ui.getCore().getStaticAreaRef();
			oStaticAreaDom.appendChild(this._oGhostButton[0]);
		}
	};

	SegmentedButton.prototype._removeGhostButton = function () {
		var that = this;
		sap.m.SegmentedButton._ghostTimer = window.setTimeout(function(){
			jQuery("#segMtBtn_calc").remove();
			that._oGhostButton = null;
			sap.m.SegmentedButton._ghostTimer = null;
		}, 1000);
	};

	SegmentedButton.prototype._getButtonWidths = function () {
		var aButtons = this.getButtons(),
			i = 0;

		if (this._oGhostButton && this._oGhostButton.length == 0) {
			return;
		} else {
			for (; i < aButtons.length; i++) {
				this._setGhostButtonText(aButtons[i]);
			}
		}
	};

	SegmentedButton.prototype.onBeforeRendering = function () {
		var oStaticAreaDom = sap.ui.getCore().getStaticAreaRef();

		this._aButtonWidth = [];

		if (this._sResizeListenerId) {
			sap.ui.core.ResizeHandler.deregister(this._sResizeListenerId);
			this._sResizeListenerId = null;
		}

		if (jQuery("#segMtBtn_calc").length === 0 && this._oGhostButton) {
			oStaticAreaDom.appendChild(this._oGhostButton[0]);
			this._removeGhostButton();
		}

		// Update the selectedKey because here we have all the aggregations loaded
		this.setSelectedKey(this.getProperty("selectedKey"));

		if (!this.getSelectedButton()) {
			this._selectDefaultButton();
		}
	};

	SegmentedButton.prototype.onAfterRendering = function () {
		//register resize listener on parent
		if (!this._sResizeListenerId) {
			var oParent = this.getParent(),
				oParentDom = null;

			if (oParent instanceof Control) {
				oParentDom = oParent.getDomRef();
			} else if (oParent instanceof sap.ui.core.UIArea) {
				oParentDom = oParent.getRootNode();
			}
			if (oParentDom) {
				this._sResizeListenerId = sap.ui.core.ResizeHandler.register(oParentDom,  jQuery.proxy(this._fHandleResize, this));
			}
		}
		//get the size of each button
		this._getButtonWidths();

		//Flag if control is inside a popup
		this._bInsidePopup = (this.$().closest(".sapMPopup-CTX").length > 0);

		//Flag if control is inside the bar. If inside bar the buttons always use the width they need.
		this._bInsideBar = (this.$().closest('.sapMIBar').length > 0) ? true : false;

		//Flag if control is inside a dialog
		this._bInsideDialog = (this.$().closest('.sapMDialogScrollCont').length > 0);

		var aButtons = this.getButtons();
		var bAllIcons = true;
		var that = this;
		for (var i = 0; i < aButtons.length; i++) {
			if (aButtons[i].getIcon() === "") {
				bAllIcons = false;
			}

			// update ARIA information of Buttons
			aButtons[i].$().attr("aria-posinset", i + 1).attr("aria-setsize", aButtons.length);
		}
		if (bAllIcons) {
			this.$().toggleClass("sapMSegBIcons", true);
		}
		if (this._isMie || this._bInsideDialog) {
			setTimeout(function () {
				that._fCalcBtnWidth();
			},0);
		} else {
			that._fCalcBtnWidth();
		}
		this.$().removeClass("sapMSegBHide");
		// Keyboard
		this._setItemNavigation();
	};

	/**
	 * Required for new width calculation, called after the theme has been switched.
	 * @private
	 */
	SegmentedButton.prototype.onThemeChanged = function (oEvent){
		//this._fCalcBtnWidth();
	};
	/**
	 * Called to manually set the width of each SegmentedButton button on the basis of the
	 * widest item after they have been rendered or an orientation change/theme change took place.
	 * @private
	 */
	SegmentedButton.prototype._fCalcBtnWidth = function () {
		if (this._bPreventWidthRecalculationOnAfterRendering) {
			return;
		}
		if (!sap.m.SegmentedButton._ghostTimer) {
			this._addGhostButton();
		} else {
			window.clearTimeout(sap.m.SegmentedButton._ghostTimer);
			sap.m.SegmentedButton._ghostTimer = null;
		}
		var iItm = this.getButtons().length;
		if (iItm === 0 || !this.$().is(":visible"))  {
			return;
		}
		var iMaxWidth = 5,
			$this = this.$(),
			iParentWidth = 0,
			iCntOutWidth = $this.outerWidth(true) - $this.width(),
			iBarContainerPadding = $this.closest('.sapMBarContainer').outerWidth() - $this.closest('.sapMBarContainer').width(),
			iBarContainerPaddingFix = 2,//Temporary solution to fix the segmentedButton with 100% width in dialog issue.
			iInnerWidth = $this.children('#' + this.getButtons()[0].getId()).outerWidth(true) - $this.children('#' + this.getButtons()[0].getId()).width(),
			oButtons = this.getButtons();
		// If parent width is bigger than actual screen width set parent width to screen width => android 2.3
		iParentWidth;

		if (jQuery(window).width() < $this.parent().outerWidth()) {
			iParentWidth = jQuery(window).width();
		} else if (this._bInsideBar) {
			iParentWidth = $this.closest('.sapMBar').width();
		} else {
			iParentWidth = $this.parent().width();
		}

		// fix: in 1.22 a padding was added to the bar container, we have to take this into account for the size calculations here
		if (this._bInsideBar && iBarContainerPadding > 0) {
			iParentWidth -= iBarContainerPadding + iBarContainerPaddingFix;
		}

		if (this.getWidth() && this.getWidth().indexOf("%") === -1) {
			iMaxWidth = parseInt(this.getWidth(), 10);
			var iCustomBtnWidths = iItm;
			for (var i = 0; i < iItm; i++) {
				var sWidth = this.getButtons()[i].getWidth();
				if (sWidth.length > 0 && sWidth.indexOf("%") === -1) {
					iMaxWidth = iMaxWidth - parseInt(sWidth, 10);
					iCustomBtnWidths--;
				}
			}
			iMaxWidth = iMaxWidth / iCustomBtnWidths;
			iMaxWidth = iMaxWidth - iInnerWidth;
		} else {
			iMaxWidth = Math.max.apply(null, this._aButtonWidth);
			// If buttons' total width is still less than the available space and
			// buttons shouldn't occupy the whole space (not set with 100%)
			if (!(((iParentWidth - iCntOutWidth) > iMaxWidth * iItm) && this.getWidth().indexOf("%") === -1)) {
				// otherwise each button gets the same size available
				iMaxWidth = (iParentWidth - iCntOutWidth) / iItm;
				iMaxWidth = iMaxWidth - iInnerWidth;
			}
		}
		iMaxWidth = Math.floor(iMaxWidth);

		for (var i = 0; i < iItm; i++) {
			var $button = oButtons[i].$(),
				sBtnWidth = oButtons[i].getWidth();
			if (!isNaN(iMaxWidth) && iMaxWidth > 0) {
				// Bug: +2px for IE9(10)
				// When segmentedButton is in popup, its size can't be increased because otherwise it triggers resize of the dialog again.
				iMaxWidth = this._isMie && !this._bInsidePopup ? iMaxWidth + 2 : iMaxWidth;
				// Use the given width of the button (when present)
				if (sBtnWidth.length > 0) {
					if (sBtnWidth.indexOf("%") === -1) {
						var iWidth = parseInt(sBtnWidth, 10) - iInnerWidth;
						$button.width(iWidth);
					} else {
						// BCP: 1580014462 When width of the button is in percent we need to remove the padding from the button
						$button.width(sBtnWidth).css("padding", 0);
					}
				} else {
					$button.width(iMaxWidth);
				}
			} else {
				var iWidth = sBtnWidth.indexOf("%") !== -1 ? iInnerWidth : sBtnWidth;
				$button.width(iWidth);
			}
		}
		this._removeGhostButton();
	};
	/**
	 * The orientation change event listener.
	 * @private
	 */
	SegmentedButton.prototype._fHandleResize = function () {
		this._fCalcBtnWidth();
	};

	SegmentedButton.prototype.exit = function () {
		if (this._sResizeListenerId) {
			sap.ui.core.ResizeHandler.deregister(this._sResizeListenerId);
			this._sResizeListenerId = null;
		}
		if (this._oGhostButton) {
			jQuery("#segMtBtn_calc").remove();
			this._oGhostButton = null;
		}

		if (this._oItemNavigation) {
			this.removeDelegate(this._oItemNavigation);
			this._oItemNavigation.destroy();
			delete this._oItemNavigation;
		}
	};

	SegmentedButton.prototype._setItemNavigation = function () {
		var aButtons,
			oDomRef = this.getDomRef();

		if (oDomRef) {
			this._oItemNavigation.setRootDomRef(oDomRef);
			aButtons = this.$().find(".sapMSegBBtn:not(.sapMSegBBtnDis)");
			this._oItemNavigation.setItemDomRefs(aButtons);
			this._focusSelectedButton();
		}
	};

	/**
	 * Adds a Button with a text as title, an URI for an icon, enabled and textDirection.
	 * Only one is allowed.
	 *
	 * @param {string} sText
	 *         Defines the title text of the newly created Button
	 * @param {sap.ui.core.URI} sURI
	 *         Icon to be displayed as graphical element within the Button.
	 *         Density related image will be loaded if image with density awareness name in format [imageName]@[densityValue].[extension] is provided.
	 * @param {boolean} bEnabled
	 *         Enables the control (default is true). Buttons that are disabled have other colors than enabled ones, depending on custom settings.
	 * @param {sap.ui.core.TextDirection} [sTextDirection]
	 *         Element's text directionality with enumerated options
	 *         @since 1.28.0
	 * @return {sap.m.Button} The created Button
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	SegmentedButton.prototype.createButton = function (sText, sURI, bEnabled, sTextDirection) {
		var oButton = new sap.m.Button();

		if (sText !== null) {
			oButton.setText(sText);
		}
		if (sURI !== null) {
			oButton.setIcon(sURI);
		}
		if (bEnabled || bEnabled === undefined) {
			oButton.setEnabled(true);
		} else {
			oButton.setEnabled(false);
		}
		if (sTextDirection) {
			oButton.setTextDirection(sTextDirection);
		}
		this.addButton(oButton);

		return oButton;
	};

	/**
	 * Private method to create a Button from an item.
	 *
	 * @param {sap.m.SegmentedButtonItem} oItem Item from the items aggregation
	 * @private
	 * @since 1.28
	 */
	SegmentedButton.prototype._createButtonFromItem = function (oItem) {
		var oButton = new sap.m.Button({
			text: oItem.getText(),
			icon: oItem.getIcon(),
			enabled: oItem.getEnabled(),
			textDirection: oItem.getTextDirection(),
			width: oItem.getWidth(),
			tooltip: oItem.getTooltip(),
			press: function () {
				oItem.firePress();
			}
		});
		oItem.oButton = oButton;
		this.addButton(oButton);
	};

	(function (){
		SegmentedButton.prototype.addButton = function (oButton) {
			if (oButton) {
				processButton(oButton, this);
				this.addAggregation('buttons', oButton);
				this._syncSelect();
				return this;
			}
		};

		SegmentedButton.prototype.insertButton = function (oButton, iIndex) {
			if (oButton) {
				processButton(oButton, this);
				this.insertAggregation('buttons', oButton, iIndex);
				this._syncSelect();
				return this;
			}
		};

		function processButton(oButton, oParent){
			oButton.attachPress(function (oEvent) {
				oParent._buttonPressed(oEvent);
			});

			oButton.attachEvent("_change", oParent._syncSelect, oParent);

			var fnOriginalSetEnabled = sap.m.Button.prototype.setEnabled;
			oButton.setEnabled = function (bEnabled) {
				oButton.$().toggleClass("sapMSegBBtnDis", !bEnabled)
					.toggleClass("sapMFocusable", bEnabled);

				fnOriginalSetEnabled.apply(oButton, arguments);
			};
		}

	})();

	/**
	 * Creates all the buttons from the items aggregation or
	 * replaces the current ones if the binding changes.
	 *
	 * Called whenever the binding of the items aggregation is changed.
	 *
	 * @param {sap.ui.model.ChangeReason} sReason Enumeration reason for the model update
	 * @private
	 * @override
	 * @since 1.28.0
	 */
	SegmentedButton.prototype.updateItems = function(sReason) {

		var oButtons = this.getButtons(),
			oItems = null,
			bUpdate = false,
			i = 0;

		/* Update aggregation only if an update reason is available */
		if (sReason !== undefined) {
			this.updateAggregation("items");
		}

		oItems = this.getAggregation("items");

		/* If the buttons are already rendered and items are initiated remove all created buttons */
		if (oItems && oButtons.length !== 0) {
			this.removeAllButtons();
			bUpdate = true;
		}

		/* Create buttons */
		for (; i < oItems.length; i++) {
			this._createButtonFromItem(oItems[i]);
		}

		// on update: recalculate width
		if (bUpdate) {
			this._fCalcBtnWidth();
		}

	};

	/**
	 * Gets the selectedKey and is usable only when the control is initiated with the items aggregation.
	 *
	 * @return {string} Current selected key
	 * @override
	 * @since 1.28.0
	 */
	SegmentedButton.prototype.getSelectedKey = function() {
		var aButtons = this.getButtons(),
			aItems = this.getItems(),
			sSelectedButtonId = this.getSelectedButton(),
			i = 0;

		if (aItems.length > 0) {
			for (; i < aButtons.length; i++) {
				if (aButtons[i] && aButtons[i].getId() === sSelectedButtonId) {
					this.setProperty("selectedKey", aItems[i].getKey(), true);
					return aItems[i].getKey();
				}
			}
		}
		return "";
	};

	/**
	 * Sets the selectedKey and is usable only when the control is initiated with the items aggregation.
	 *
	 * @param {string} sKey The key of the button to be selected
	 * @returns {sap.m.SegmentedButton} <code>this</code> this pointer for chaining
	 * @override
	 * @since 1.28.0
	 */
	SegmentedButton.prototype.setSelectedKey = function(sKey) {
		var aButtons = this.getButtons(),
			aItems = this.getItems(),
			i = 0;

		if (aButtons.length === 0 && aItems.length > 0) {
			this.updateItems();
		}

		if (aItems.length > 0 && aButtons.length > 0) {
			for (; i < aItems.length; i++) {
				if (aItems[i] && aItems[i].getKey() === sKey) {
					this.setSelectedButton(aButtons[i]);
					break;
				}
			}
		}
		this.setProperty("selectedKey", sKey, true);
		return this;
	};


	SegmentedButton.prototype.removeButton = function (oButton) {
		var oRemovedButton = this.removeAggregation("buttons", oButton);
		if (oRemovedButton) {
			delete oRemovedButton.setEnabled;
			oRemovedButton.detachEvent("_change", this._syncSelect, this);
			this._syncSelect();
		}
	};

	SegmentedButton.prototype.removeAllButtons = function () {
		var aButtons = this.getButtons();
		if (aButtons) {
			for ( var i = 0; i < aButtons.length; i++) {
				var oButton = aButtons[i];
				if (oButton) {
					delete oButton.setEnabled;
					this.removeAggregation("buttons", oButton);
					oButton.detachEvent("_change", this._syncSelect, this);
				}

			}
			this._syncSelect();
		}
	};

	/** Event handler for the internal button press events.
	 * @private
	 */
	SegmentedButton.prototype._buttonPressed = function (oEvent) {
		var oButtonPressed = oEvent.getSource();

		if (this.getSelectedButton() !== oButtonPressed.getId()) {
			// CSN# 0001429454/2014: remove class for all other items
			this.getButtons().forEach(function (oButton) {
				oButton.$().removeClass("sapMSegBBtnSel");
				oButton.$().attr("aria-checked", false);
			});
			oButtonPressed.$().addClass("sapMSegBBtnSel");
			oButtonPressed.$().attr("aria-checked", true);

			this.setAssociation('selectedButton', oButtonPressed, true);
			this.setProperty("selectedKey", this.getSelectedKey(), true);
			this.fireSelect({
				button: oButtonPressed,
				id: oButtonPressed.getId(),
				key: this.getSelectedKey()
			});
		}
	};

	/**
	 * Internal helper function that sets the association <code>selectedButton</code> to the first button.
	 * @private
	 */
	SegmentedButton.prototype._selectDefaultButton = function () {
		var aButtons = this.getButtons();

		// CSN# 0001429454/2014: when the id evaluates to false (null, undefined, "") the first button should be selected
		if (aButtons.length > 0) {
			this.setAssociation('selectedButton', aButtons[0], true);
		}
	};

	/**
	 * Setter for association <code>selectedButton</code>.
	 *
	 * @param {string | sap.m.Button | null | undefined} vButton New value for association <code>setSelectedButton</code>
	 *    A sap.m.Button instance which becomes the new target of this <code>selectedButton</code> association.
	 *    Alternatively, the ID of a sap.m.Button instance may be given as a string.
	 *    If the value of null, undefined, or an empty string is provided the first item will be selected.
	 * @returns {sap.m.SegmentedButton} <code>this</code> this pointer for chaining
	 * @public
	 */
	SegmentedButton.prototype.setSelectedButton = function (vButton) {
		var sSelectedButtonBefore = this.getSelectedButton(),
			oSelectedButton;

		// set the new value
		this.setAssociation("selectedButton", vButton, true);

		// CSN# 1143859/2014: update selection state in DOM when calling API method to change the selection
		if (sSelectedButtonBefore !== this.getSelectedButton()) {
			// CSN# 0001429454/2014: only update DOM when control is already rendered (otherwise it will be done in onBeforeRendering)
			if (this.$().length) {
				if (!this.getSelectedButton()) {
					this._selectDefaultButton();
				}
				oSelectedButton = sap.ui.getCore().byId(this.getSelectedButton());
				this.getButtons().forEach(function (oButton) {
					oButton.$().removeClass("sapMSegBBtnSel");
					oButton.$().attr("aria-checked", false);
				});
				if (oSelectedButton) {
					oSelectedButton.$().addClass("sapMSegBBtnSel");
					oSelectedButton.$().attr("aria-checked", true);
				}
				this._focusSelectedButton();
			}
		}

		this._syncSelect();
		return this;
	};

	SegmentedButton.prototype._focusSelectedButton = function () {
		var aButtons = this.getButtons(),
			selectedButtonId = this.getSelectedButton(),
			i = 0;

		for (; i < aButtons.length; i++) {
			if (aButtons[i] && aButtons[i].getId() === selectedButtonId) {
				this._oItemNavigation.setFocusedIndex(i);
				break;
			}
		}
	};

	SegmentedButton.prototype.onsappagedown = function(oEvent) {
		this._oItemNavigation.onsapend(oEvent);
	};

	SegmentedButton.prototype.onsappageup = function(oEvent) {
		this._oItemNavigation.onsaphome(oEvent);
	};




	/** Select form function **/

	/**
	 * Lazy loader for the select hidden aggregation.
	 * @private
	 */
	SegmentedButton.prototype._lazyLoadSelectForm = function() {
		var oSelect = this.getAggregation("_select");

		if (!oSelect) {
			oSelect = new sap.m.Select(this.getId() + "-select");
			oSelect.attachChange(this._selectChangeHandler, this);
			oSelect.addStyleClass("sapMSegBSelectWrapper");
			this.setAggregation("_select", oSelect, true);
		}
	};

	/**
	 * Called when the select is changed so that the SegmentedButton internals stay in sync.
	 * @param oEvent
	 * @private
	 */
	SegmentedButton.prototype._selectChangeHandler = function(oEvent) {
		var oSelectedItem = oEvent.getParameter("selectedItem"),
			sNewKey = parseInt(oSelectedItem.getKey(), 10),
			oButton = this.getButtons()[sNewKey],
			sButtonId = oButton.getId();

		this.setSelectedButton(sButtonId);
		this.fireSelect({
			button: oButton,
			id: sButtonId,
			key: sNewKey
		});
	};

	/**
	 * Builds/rebuilds the select from the buttons in the SegmentedButton.
	 * @private
	 */
	SegmentedButton.prototype._syncSelect = function() {
		var iKey = 0,
			iSelectedKey = 0,
			sButtonText,
			oSelect = this.getAggregation("_select");

		if (!oSelect) {
			return;
		}

		oSelect.destroyItems();
		this.getButtons().forEach(function (oButton) {
			sButtonText = oButton.getText();
			oSelect.addItem(new sap.ui.core.Item({
				key: iKey.toString(),
				text: sButtonText ? sButtonText : oButton.getTooltip_AsString(),
				enabled: oButton.getEnabled()
			}));
			if (oButton.getId() === this.getSelectedButton()) {
				iSelectedKey = iKey;
			}
			iKey++;
		}, this);
		oSelect.setSelectedKey(iSelectedKey.toString());
	};

	/**
	 * To be called to make the control go to select mode.
	 * @private
	 */
	SegmentedButton.prototype._toSelectMode = function() {
		this._bInOverflow = true;
		this.addStyleClass("sapMSegBSelectWrapper");
		this._lazyLoadSelectForm();
		this._syncSelect();
	};

	/**
	 * To be called to make the control go back to the default mode.
	 * @private
	 */
	SegmentedButton.prototype._toNormalMode = function() {
		delete this._bInOverflow;
		this.removeStyleClass("sapMSegBSelectWrapper");
		this.getAggregation("_select").removeAllItems();
		this.destroyAggregation("_select");
	};

	/**
	 * Image does not have an onload event but we need to recalculate the button sizes - after the image is loaded
	 * we override the onload method once and call the calculation method after the original method is called.
	 * @param {sap.m.Image} oImage instance of the image
	 * @private
	 */
	SegmentedButton.prototype._overwriteImageOnload = function (oImage) {
		var that = this;

		if (oImage.onload === sap.m.Image.prototype.onload) {
			oImage.onload = function () {
				if (sap.m.Image.prototype.onload) {
					sap.m.Image.prototype.onload.apply(this, arguments);
				}
				window.setTimeout(function() {
					that._fCalcBtnWidth();
				}, 20);
			};
		}
	};

	/**
	 * Gets native SAP icon name.
	 * @param {sap.ui.core.Icon} oIcon Icon object
	 * @returns {string} The generic name of the icon
	 * @private
	 */
	SegmentedButton.prototype._getIconAriaLabel = function (oIcon) {
		var oIconInfo = sap.ui.core.IconPool.getIconInfo(oIcon.getSrc()),
			sResult = "";
		if (oIconInfo && oIconInfo.name) {
			sResult = oIconInfo.name;
		}
		return sResult;
	};

	return SegmentedButton;

}, /* bExport= */ true);
