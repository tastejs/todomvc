/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.m.ActionSheet.
sap.ui.define(['jquery.sap.global', './Dialog', './Popover', './library', 'sap/ui/core/Control', 'sap/ui/core/delegate/ItemNavigation'],
	function(jQuery, Dialog, Popover, library, Control, ItemNavigation) {
	"use strict";



	/**
	 * Constructor for a new ActionSheet.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * ActionSheet is a special kind of control which contains one or more sap.m.Button(s) and the ActionSheet will be closed when one of the buttons is tapped. It looks similar as a sap.m.Dialog in iPhone and Android while as a sap.m.Popover in iPad.
	 * @extends sap.ui.core.Control
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @since 1.9.1
	 * @alias sap.m.ActionSheet
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var ActionSheet = Control.extend("sap.m.ActionSheet", /** @lends sap.m.ActionSheet.prototype */ { metadata : {

		library : "sap.m",
		properties : {

			/**
			 * The ActionSheet behaves as a sap.m.Popover in iPad and this property is the information about on which side will the popover be placed at. Possible values are sap.m.PlacementType.Left, sap.m.PlacementType.Right, sap.m.PlacementType.Top, sap.m.PlacementType.Bottom, sap.m.PlacementType.Horizontal, sap.m.PlacementType.HorizontalPreferedLeft, sap.m.PlacementType.HorizontalPreferedRight, sap.m.PlacementType.Vertical, sap.m.PlacementType.VerticalPreferedTop, sap.m.PlacementType.VerticalPreferedBottom. The default value is sap.m.PlacementType.Bottom.
			 */
			placement : {type : "sap.m.PlacementType", group : "Appearance", defaultValue : sap.m.PlacementType.Bottom},

			/**
			 * If this is set to true, there will be a cancel button shown below the action buttons. There won't be any cancel button shown in iPad regardless of this property. The default value is set to true.
			 */
			showCancelButton : {type : "boolean", group : "Appearance", defaultValue : true},

			/**
			 * This is the text displayed in the cancelButton. Default value is "Cancel", and it's translated according to the current locale setting. This property will be ignored when running either in iPad or showCancelButton is set to false.
			 */
			cancelButtonText : {type : "string", group : "Appearance", defaultValue : null},

			/**
			 * Title will be shown in the header area in iPhone and every Android devices. This property will be ignored in tablets and desktop browser.
			 */
			title : {type : "string", group : "Appearance", defaultValue : null}
		},
		aggregations : {

			/**
			 * These buttons are added to the content area in ActionSheet control. When button is tapped, the ActionSheet is closed before the tap event listener is called.
			 */
			buttons : {type : "sap.m.Button", multiple : true, singularName : "button"},

			/**
			 * The internally managed cancel button.
			 */
			_cancelButton : {type : "sap.m.Button", multiple : false, visibility : "hidden"}
		},
		events : {

			/**
			 * This event is fired when the cancelButton is tapped. For iPad, this event is also fired when showCancelButton is set to true, and Popover is closed by tapping outside.
			 * @deprecated Since version 1.20.0.
			 * This event is deprecated, use the cancelButtonPress event instead.
			 */
			cancelButtonTap : {deprecated: true},

			/**
			 * This event will be fired before the ActionSheet is opened.
			 */
			beforeOpen : {},

			/**
			 * This event will be fired after the ActionSheet is opened.
			 */
			afterOpen : {},

			/**
			 * This event will be fired before the ActionSheet is closed.
			 */
			beforeClose : {},

			/**
			 * This event will be fired after the ActionSheet is closed.
			 */
			afterClose : {},

			/**
			 * This event is fired when the cancelButton is clicked. For iPad, this event is also fired when showCancelButton is set to true, and Popover is closed by clicking outside.
			 */
			cancelButtonPress : {}
		}
	}});


	ActionSheet.prototype.init = function() {
		// this method is kept here empty in case some control inherits from it but forgets to check the existence of this function when chaining the call
	};

	ActionSheet.prototype.exit = function(){
		if (this._parent) {
			this._parent.destroy();
			this._parent = null;
		}
		if (this._oCancelButton) {
			this._oCancelButton.destroy();
			this._oCancelButton = null;
		}

		this._clearItemNavigation();
	};

	ActionSheet.prototype._clearItemNavigation = function() {
		if (this._oItemNavigation) {
			this.removeDelegate(this._oItemNavigation);
			this._oItemNavigation.destroy();
			delete this._oItemNavigation;
		}
	};

	// keyboard navigation
	ActionSheet.prototype._setItemNavigation = function() {
		var aButtons = this._getAllButtons(),
			aDomRefs = [],
			oDomRef = this.getDomRef();

		if (oDomRef) {
			this._oItemNavigation.setRootDomRef(oDomRef);
			for (var i = 0; i < aButtons.length; i++) {
				if (aButtons[i].getEnabled()) {
					aDomRefs.push(aButtons[i].getFocusDomRef());
				}
			}
			if (this._oCancelButton) {
				aDomRefs.push(this._oCancelButton.getFocusDomRef());
			}
			this._oItemNavigation.setItemDomRefs(aDomRefs);
			this._oItemNavigation.setSelectedIndex(0);
			this._oItemNavigation.setPageSize(5);
		}
	};

	ActionSheet.prototype.onBeforeRendering = function() {
		// The item navigation instance has to be destroyed and created again once the control is rerendered
		// because the intital tabindex setting is only done once inside the item navigation but we need it here
		// every time after the control is rerendered
		this._clearItemNavigation();
	};

	ActionSheet.prototype.onAfterRendering = function() {
		// delegate the keyboard handling to ItemNavigation
		this._oItemNavigation = new ItemNavigation();
		this._oItemNavigation.setCycling(false);
		this.addDelegate(this._oItemNavigation);
		this._setItemNavigation();
	};

	ActionSheet.prototype.sapfocusleave = function() {
		this.close();
	};


	/**
	 * Calling this method will make the ActionSheet visible on the screen.
	 *
	 * @param {object} oControl
	 *         The ActionSheet behaves as a sap.m.Popover in iPad and the control parameter is the object to which the popover will be placed. It can be not only a UI5 control, but also an existing dom reference. The side of the placement depends on the placement property set in the popover. In other platforms, ActionSheet behaves as a standard dialog and this parameter is ignored because dialog is aligned to the screen.
	 * @type void
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	ActionSheet.prototype.openBy = function(oControl){
		var that = this, iTop, sEndTransform;

		//Generate a translate3d string with the given y offset
		function genTransformCSS(y){
			return "translate3d(0px, " + (y > 0 ? y : 0) + "px, 0px)";
		}

		if (!this._parent) {
			var oOldParent = this.getParent();

			// ActionSheet may already have a parent for dependent aggregation.
			// This parent must be cleared before adding it to the popup instance, otherwise ActionSheet closes immediately after opening for the first time.
			// TODO: after ManagedObject.prototype._removeChild function is fixed for removing control from dependents aggregation, remove this.
			if (oOldParent) {
				this.setParent(null);
			}

			if (!sap.ui.Device.system.phone) {
			//create a Popover instance for iPad
				this._parent = new Popover({
					placement: this.getPlacement(),
					showHeader: false,
					content: [this],
					beforeOpen: function(){
						that.fireBeforeOpen();
					},
					afterOpen: function(){
						that.focus();
						that.fireAfterOpen();
					},
					beforeClose: function(){
						that.fireBeforeClose();
					},
					afterClose: function(){
						if (that.getShowCancelButton()) {
							that.fireCancelButtonTap(); // (This event is deprecated, use the "cancelButtonPress" event instead)
							that.fireCancelButtonPress();
						}
						that.fireAfterClose();
					}
				}).addStyleClass("sapMActionSheetPopover");

				if (sap.ui.Device.browser.internet_explorer) {
					this._parent._fnAdjustPositionAndArrow = jQuery.proxy(function(){
						Popover.prototype._adjustPositionAndArrow.apply(this);

						var $this = this.$(),
							fContentWidth = $this.children(".sapMPopoverCont")[0].getBoundingClientRect().width;
						jQuery.each($this.find(".sapMActionSheet > .sapMBtn"), function(index, oButtonDom){
							var $button = jQuery(oButtonDom),
								fButtonWidth;
							$button.css("width", "");
							fButtonWidth = oButtonDom.getBoundingClientRect().width;
							if (fButtonWidth <= fContentWidth) {
								$button.css("width", "100%");
							}
						});
					}, this._parent);
				}
			} else {
				//create a Dialog instance for the rest
				this._parent = new Dialog({
					title: this.getTitle(),
					type: sap.m.DialogType.Standard,
					content: [this],
					beforeOpen: function(){
						that.fireBeforeOpen();
					},
					afterOpen: function(){
						that.focus();
						that.fireAfterOpen();
					},
					beforeClose: function(oEvent){
						that.fireBeforeClose({
							origin: oEvent.getParameter("origin")
						});
					},
					afterClose: function(oEvent){
						that.fireAfterClose({
							origin: oEvent.getParameter("origin")
						});
					}
				}).addStyleClass("sapMActionSheetDialog");

				if (this.getTitle()) {
					this._parent.addStyleClass("sapMActionSheetDialogWithTitle");
				}

				if (!sap.ui.Device.system.phone) {
					this._parent.setBeginButton(this._getCancelButton());
				}

				//need to modify some internal methods of Dialog for phone, because
				//the actionsheet won't be sized full screen if the content is smaller than the whole screen.
				//Then the transform animation need to be set at runtime with some height calculation.
				if (sap.ui.Device.system.phone) {
					//remove the transparent property from blocklayer
					this._parent.oPopup.setModal(true);
					//doesn't need to react on content change because content is always 100%
					this._parent._registerResizeHandler = this._parent._deregisterResizeHandler = function() {};
					this._parent._setDimensions = function() {
						sap.m.Dialog.prototype._setDimensions.apply(this);
						var $this = this.$(),
							$content = this.$("cont");
						//CSS reset
						$this.css({
							"width": "100%",
							"max-width": "",
							"max-height": "100%",
							"left": "0px",
							"right": "",
							"bottom": ""
						});
						$content.css("max-height", "");
					};

					this._parent._openAnimation = function($this, iRealDuration, fnOpened){
						var $window = jQuery(window),
							iWindowHeight = $window.height(),
							sStartTransform = genTransformCSS(iWindowHeight);

						//need to set the transform css before its visible, in order to trigger the animation properly.
						$this.css({
							"top": "0px",
							"-webkit-transform": sStartTransform,
							"-moz-transform": sStartTransform,
							"transform": sStartTransform,
							"display": "block"
						});

						$this.bind("webkitTransitionEnd transitionend", function(){
							jQuery(this).unbind("webkitTransitionEnd transitionend");
							$this.removeClass("sapMDialogSliding");
							fnOpened();
							// replace the css transform with css top because div with css transform can scroll the whole page
							// on Android stock browser and blackberry browser
							setTimeout(function(){
								$this.css({
									"top": iTop + "px",
									"-webkit-transform": "",
									"-moz-transform": "",
									"transform": ""
								});
							}, 0);
						});

						//need a timeout to trigger the animation
						setTimeout(function(){
							iTop = iWindowHeight - $this.outerHeight();
							//calculation for the end point of the animation
							sEndTransform = genTransformCSS(iTop);
							$this.addClass("sapMDialogSliding") // Windows Phone: class should be added before CSS, otherwise no animation
								 .removeClass("sapMDialogHidden")
								 .css({
									"-webkit-transform": sEndTransform,
									"-moz-transform": sEndTransform,
									"transform": sEndTransform
								 });
						}, 0);
					};

					this._parent._closeAnimation = function($this, iRealDuration, fnClosed){
						var $window = jQuery(window),
							sTransform = genTransformCSS($window.height());
						$this.bind("webkitTransitionEnd transitionend", function(){
							jQuery(this).unbind("webkitTransitionEnd transitionend");
							$this.removeClass("sapMDialogSliding");
							fnClosed();
						});

						// set the css transform back before the real close animation
						$this.css({
							"-webkit-transform": sEndTransform,
							"-moz-transform": sEndTransform,
							"transform": sEndTransform,
							"top": 0
						});
						setTimeout(function() {
							$this.addClass("sapMDialogSliding") // Windows Phone: class should be added before CSS, otherwise no animation
								.css({
									"-webkit-transform": sTransform,
									"-moz-transform": sTransform,
									"transform": sTransform
								});
						}, 0);
					};

					//set the animation to the interal oPopup instance on Dialog
					this._parent.oPopup.setAnimations(jQuery.proxy(this._parent._openAnimation, this._parent), jQuery.proxy(this._parent._closeAnimation, this._parent));


					//also need to change the logic for adjusting scrollable area.
					this._parent._adjustScrollingPane = function(){
						var $this = this.$(),
							iHeight = $this.height(),
							$content = this.$("cont");

						$content.css("max-height", iHeight);
						if (this._oScroller) {
							this._oScroller.refresh();
						}
					};

					//only need to recalculate the transform offset when window resizes, doesn't need to reposition using Popup.js again for iPhone.
					this._parent._fnOrientationChange = jQuery.proxy(function(){
						this._setDimensions();

						var $window = jQuery(window),
							iWindowHeight = $window.height(),
							$this = this.$(),
							iTop = iWindowHeight - $this.outerHeight();

						$this.css({
							top: iTop + "px"
						});

						this._adjustScrollingPane();
					}, this._parent);
				}
			}

			// Check if this control has already a parent. If yes, add the _parent control into the dependents aggregation
			// to enable model propagation and lifecycle management.
			if (oOldParent) {
				oOldParent.addDependent(this._parent);
			}
		}

		//open the ActionSheet
		if (!sap.ui.Device.system.phone) {
			this._parent.openBy(oControl);
		} else {
			this._parent.open();
		}
	};



	/**
	 * Calling this method will make the ActionSheet disappear from the screen.
	 *
	 * @type void
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	ActionSheet.prototype.close = function(oControl){
		if (this._parent) {
			this._parent.close();
		}
	};



	/**
	 * The method checks if the ActionSheet is open. It returns true when the ActionSheet is currently open (this includes opening and closing animations), otherwise it returns false.
	 *
	 * @type boolean
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	ActionSheet.prototype.isOpen = function(oControl){
		return !!this._parent && this._parent.isOpen();
	};


	ActionSheet.prototype._createCancelButton = function(){
		if (!this._oCancelButton) {
			var sCancelButtonText = (this.getCancelButtonText()) ? this.getCancelButtonText() : sap.ui.getCore().getLibraryResourceBundle("sap.m").getText("ACTIONSHEET_CANCELBUTTON_TEXT"),
				that = this;
	//			var sButtonStyle = (sap.ui.Device.os.ios) ? sap.m.ButtonType.Unstyled : sap.m.ButtonType.Default;
			this._oCancelButton = new sap.m.Button(this.getId() + '-cancelBtn', {
				text: sCancelButtonText,
				type: sap.m.ButtonType.Reject,
				press : function() {
					if (sap.ui.Device.system.phone && that._parent) {
						that._parent._oCloseTrigger = this;
					}
					that.close();
					that.fireCancelButtonTap(); // (This event is deprecated, use the "cancelButtonPress" event instead)
					that.fireCancelButtonPress();
				}
			}).addStyleClass("sapMActionSheetButton sapMActionSheetCancelButton sapMBtnTransparent sapMBtnInverted");

			if (sap.ui.Device.system.phone) {
				this.setAggregation("_cancelButton", this._oCancelButton, true);
			}
		}
		return this;
	};

	ActionSheet.prototype._getCancelButton = function(){
		if (sap.ui.Device.system.phone && this.getShowCancelButton()) {
			this._createCancelButton();
			return this._oCancelButton;
		}
		return null;
	};

	ActionSheet.prototype.setCancelButtonText = function(sText) {
		this.setProperty("cancelButtonText", sText, true);
		if (this._oCancelButton) {
			this._oCancelButton.setText(sText);
		}
		return this;
	};

	ActionSheet.prototype._preProcessActionButton = function(oButton){
		var sType = oButton.getType();

		if (sType !== sap.m.ButtonType.Accept && sType !== sap.m.ButtonType.Reject) {
			oButton.setType(sap.m.ButtonType.Transparent);
		}
		oButton.addStyleClass("sapMBtnInverted"); // dark background

		this._parent && this._parent.invalidate();

		return this;
	};

	ActionSheet.prototype.setShowCancelButton = function(bValue){
		if (this._parent) {
			if (sap.ui.Device.system.phone) {
				//if iPhone, we need to rerender to show or hide the cancel button
				this.setProperty("showCancelButton", bValue, false);
			}
		} else {
			this.setProperty("showCancelButton", bValue, true);
		}
		return this;
	};

	ActionSheet.prototype.setTitle = function(sTitle){
		this.setProperty("title", sTitle, true);
		if (this._parent && sap.ui.Device.system.phone) {
			this._parent.setTitle(sTitle);
			this._parent.toggleStyleClass("sapMDialog-NoHeader", !sTitle);
		}

		if (this._parent) {
			if (sTitle) {
				this._parent.addStyleClass("sapMActionSheetDialogWithTitle");
			} else {
				this._parent.removeStyleClass("sapMActionSheetDialogWithTitle");
			}
		}
		return this;
	};

	ActionSheet.prototype.setPlacement = function(sPlacement){
		this.setProperty("placement", sPlacement, true);

		if (!sap.ui.Device.system.phone) {
			if (this._parent) {
				this._parent.setPlacement(sPlacement);
			}
		}
		return this;
	};

	ActionSheet.prototype._buttonSelected = function(){
		if (sap.ui.Device.system.phone && this._parent) {
			this._parent._oCloseTrigger = this;
		}
		this.close();
	};

	/* Override API methods */
	ActionSheet.prototype.addButton = function(oButton) {
		this.addAggregation("buttons",oButton, false);
		this._preProcessActionButton(oButton);
		oButton.attachPress(this._buttonSelected, this);
		return this;
	};
	ActionSheet.prototype.insertButton = function(oButton, iIndex) {
		this.insertAggregation("buttons",oButton, iIndex, false);
		this._preProcessActionButton(oButton);
		oButton.attachPress(this._buttonSelected, this);
		return this;
	};
	ActionSheet.prototype.removeButton = function(oButton) {
		var result = this.removeAggregation("buttons",oButton, false);
		if (result) {
			result.detachPress(this._buttonSelected, this);
		}
		return result;
	};
	ActionSheet.prototype.removeAllButtons = function() {
		var result = this.removeAllAggregation("buttons", false),
			that = this;
		jQuery.each(result, function(i, oButton) {
			oButton.detachPress(that._buttonSelected, that);
		});
		return result;
	};
	ActionSheet.prototype.clone = function() {

		var aButtons = this.getButtons();
		for ( var i = 0; i < aButtons.length; i++) {
			var oButton = aButtons[i];
			oButton.detachPress(this._buttonSelected, this);
		}

		var oClone = Control.prototype.clone.apply(this, arguments);

		for ( var i = 0; i < aButtons.length; i++) {
			var oButton = aButtons[i];
			oButton.attachPress(this._buttonSelected, this);
		}

		return oClone;
	};

	/**
	 * A hook for controls that extend action sheet to determine how the buttons array is formed
	 * @returns {sap.m.Button[]}
	 * @private
	 */
	ActionSheet.prototype._getAllButtons = function() {
		return this.getButtons();
	};

	return ActionSheet;

}, /* bExport= */ true);
