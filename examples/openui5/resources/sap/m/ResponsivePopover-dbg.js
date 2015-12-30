/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.m.ResponsivePopover.
sap.ui.define(['jquery.sap.global', './Dialog', './Popover', './library', 'sap/ui/core/Control', 'sap/ui/core/IconPool'],
	function(jQuery, Dialog, Popover, library, Control, IconPool) {
	"use strict";



	/**
	 * Constructor for a new ResponsivePopover.
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * This control acts responsively to the type of device. It acts as a sap.m.Popover on desktop and tablet, while on phone it acts as a sap.m.Dialog with stretch set to true.
	 * @extends sap.ui.core.Control
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @since 1.15.1
	 * @alias sap.m.ResponsivePopover
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var ResponsivePopover = Control.extend("sap.m.ResponsivePopover", /** @lends sap.m.ResponsivePopover.prototype */ { metadata : {

		library : "sap.m",
		properties : {

			/**
			 * This property only takes effect on desktop or tablet. Please see the documentation sap.m.Popover#placement.
			 */
			placement : {type : "sap.m.PlacementType", group : "Misc", defaultValue : sap.m.PlacementType.Right},

			/**
			 * This property is supported by both variants. Please see the documentation on sap.m.Popover#showHeader and sap.m.Dialog#showHeader
			 */
			showHeader : {type : "boolean", group : "Misc", defaultValue : true},

			/**
			 * This property is supported by both variants. Please see the documentation on sap.m.Popover#title and sap.m.Dialog#title
			 */
			title : {type : "string", group : "Misc", defaultValue : null},

			/**
			 * This property only takes effect  on phone. Please see the documentation sap.m.Dialog#icon.
			 */
			icon : {type : "sap.ui.core.URI", group : "Misc", defaultValue : null},

			/**
			 * This property only takes effect on desktop or tablet. Please see the documentation sap.m.Popover#modal.
			 */
			modal : {type : "boolean", group : "Misc", defaultValue : null},

			/**
			 * This property only takes effect on desktop or tablet. Please see the documentation sap.m.Popover#offsetX.
			 */
			offsetX : {type : "int", group : "Misc", defaultValue : null},

			/**
			 * This property only takes effect on desktop or tablet. Please see the documentation sap.m.Popover#offsetY.
			 */
			offsetY : {type : "int", group : "Misc", defaultValue : null},

			/**
			 * This property is supported by both variants. Please see the documentation on sap.m.Popover#contentWidth and sap.m.Dialog#contentWidth
			 */
			contentWidth : {type : "sap.ui.core.CSSSize", group : "Misc", defaultValue : null},

			/**
			 * This property is supported by both variants. Please see the documentation on sap.m.Popover#contentHeight and sap.m.Dialog#contentHeight
			 */
			contentHeight : {type : "sap.ui.core.CSSSize", group : "Misc", defaultValue : null},

			/**
			 * This property is supported by both variants. Please see the documentation on sap.m.Popover#horizontalScrolling and sap.m.Dialog#horizontalScrolling
			 */
			horizontalScrolling : {type : "boolean", group : "Misc", defaultValue : true},

			/**
			 * This property is supported by both variants. Please see the documentation on sap.m.Popover#verticalScrolling and sap.m.Dialog#verticalScrolling
			 */
			verticalScrolling : {type : "boolean", group : "Misc", defaultValue : true},

			/**
			 * Determines if a close button should be inserted into the dialog's header dynamically to close the dialog. This property only takes effect on phone.
			 */
			showCloseButton : {type : "boolean", group : "Misc", defaultValue : true}
		},
		aggregations : {

			/**
			 * Content is supported by both variants. Please see the documentation on sap.m.Popover#content and sap.m.Dialog#content
			 */
			content : {type : "sap.ui.core.Control", multiple : true, singularName : "content"},

			/**
			 * CustomHeader is supported by both variants. Please see the documentation on sap.m.Popover#customHeader and sap.m.Dialog#customHeader
			 */
			customHeader : {type : "sap.m.IBar", multiple : false},

			/**
			 * SubHeader is supported by both variants. Please see the documentation on sap.m.Popover#subHeader and sap.m.Dialog#subHeader
			 */
			subHeader : {type : "sap.m.IBar", multiple : false},

			/**
			 * BeginButton is supported by both variants. It is always show in the left part (right part in RTL mode) of the footer which is located at the bottom of the ResponsivePopover. If buttons need to be displayed in header, please use customHeader instead.
			 */
			beginButton : {type : "sap.m.Button", multiple : false},

			/**
			 * EndButton is supported by both variants. It is always show in the right part (left part in RTL mode) of the footer which is located at the bottom of the ResponsivePopover. If buttons need to be displayed in header, please use customHeader instead.
			 */
			endButton : {type : "sap.m.Button", multiple : false},

			/**
			 * The internal popup instance which is either a dialog on phone or a popover on the rest of platforms
			 */
			_popup : {type : "sap.ui.core.Control", multiple : false, visibility : "hidden"}
		},
		associations : {

			/**
			 * InitialFocus is supported by both variants. Please see the documentation on sap.m.Popover#initialFocus and sap.m.Dialog#initialFocus
			 */
			initialFocus : {type : "sap.ui.core.Control", multiple : false},

			/**
			 * Association to controls / IDs which describe this control (see WAI-ARIA attribute aria-describedby).
			 */
			ariaDescribedBy : {type : "sap.ui.core.Control", multiple : true, singularName : "ariaDescribedBy"}
		},
		events : {

			/**
			 * Event is fired before popover or dialog is open.
			 */
			beforeOpen : {
				parameters : {

					/**
					 *
					 * This parameter contains the control which is passed as the parameter when calling openBy method. When runs on the phone, this parameter is undefined.
					 */
					openBy : {type : "sap.ui.core.Control"}
				}
			},

			/**
			 * Event is fired after popover or dialog is open.
			 */
			afterOpen : {
				parameters : {

					/**
					 *
					 * This parameter contains the control which is passed as the parameter when calling openBy method. When runs on the phone, this parameter is undefined.
					 */
					openBy : {type : "sap.ui.core.Control"}
				}
			},

			/**
			 * Event is fired before popover or dialog is closed.
			 */
			beforeClose : {
				parameters : {

					/**
					 *
					 * This parameter contains the control which is passed as the parameter when calling openBy method. When runs on the phone, this parameter is undefined.
					 */
					openBy : {type : "sap.ui.core.Control"},

					/**
					 *
					 * This parameter contains the control which triggers the close of the ResponsivePopover. This parameter is undefined when runs on desktop or tablet.
					 */
					origin : {type : "sap.m.Button"}
				}
			},

			/**
			 * Event is fired after popover or dialog is closed.
			 */
			afterClose : {
				parameters : {

					/**
					 *
					 * This parameter contains the control which is passed as the parameter when calling openBy method. When runs on the phone, this parameter is undefined.
					 */
					openBy : {type : "sap.ui.core.Control"},

					/**
					 *
					 * This parameter contains the control which triggers the close of the ResponsivePopover. This parameter is undefined when runs on desktop or tablet.
					 */
					origin : {type : "sap.m.Button"}
				}
			}
		}
	}});


	/**
	 * Closes the ResponsivePopover.
	 *
	 * @name sap.m.ResponsivePopover#close
	 * @function
	 * @type sap.ui.core.Control
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */


	/**
	 * Checks whether the ResponsivePopover is currently open.
	 *
	 * @name sap.m.ResponsivePopover#isOpen
	 * @function
	 * @type sap.ui.core.Control
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */


	ResponsivePopover.prototype.init = function(){
		var that = this;

		this._bAppendedToUIArea = false;

		var settings = {
			beforeOpen: function(oEvent){
				that.fireBeforeOpen({openBy: oEvent.getParameter('openBy')});
			},
			afterOpen: function(oEvent){
				that.fireAfterOpen({openBy: oEvent.getParameter('openBy')});
			},
			beforeClose: function(oEvent){
				that.fireBeforeClose({openBy: oEvent.getParameter('openBy'), origin: oEvent.getParameter('origin')});
			},
			afterClose: function(oEvent){
				that.fireAfterClose({openBy: oEvent.getParameter('openBy'), origin: oEvent.getParameter('origin')});
			}
		};
		if (sap.ui.Device.system.phone) {
			this._aNotSupportedProperties = ["placement", "modal", "offsetX", "offsetY", "showCloseButton"];
			settings.stretch = true;
			settings.type = sap.m.DialogType.Standard;
			this._oControl = new Dialog(this.getId() + "-dialog", settings);
		} else {
			this._aNotSupportedProperties = ["icon", "showCloseButton"];
			this._oControl = new Popover(this.getId() + "-popover", settings);
		}

		this.setAggregation("_popup", this._oControl);

		this._oControl.addStyleClass("sapMResponsivePopover");

		this._oDelegate = {
			onBeforeRendering: function(){
				var bShowCloseButton = this.getShowCloseButton(),
					oHeader = this._oControl._getAnyHeader(),
					oNavContent, oPage, oRealPage;

				if (!bShowCloseButton ||  !sap.ui.Device.system.phone) {
					this._removeCloseButton(oHeader);
					return;
				}

				if (!this._bContentChanged) {
					return;
				}

				this._bContentChanged = false;

				if (oHeader) {
					this._insertCloseButton(oHeader);
				} else {
					oNavContent = this._getSingleNavContent();
					if (!oNavContent) {
						return;
					}
					//insert the close button to current page's header
					oPage = oNavContent.getCurrentPage();
					oRealPage = this._getRealPage(oPage);
					if (oRealPage && (oHeader = oRealPage._getAnyHeader())) {
						this._insertCloseButton(oHeader);
					}

					//register to the navigation inside navcontainer to insert the closebutton to the page which is being navigated to
					oNavContent.attachEvent("navigate", this._fnOnNavigate , this);
				}
			}
		};

		this._oPageDelegate = {
			onAfterShow: function(){
				var oRealPage = that._getRealPage(this),
					oHeader;
				if (oRealPage && (oHeader = oRealPage._getAnyHeader())) {
					that._insertCloseButton(oHeader);
				}
			}
		};

		this._fnOnNavigate = function(oEvent){
			var oPage = oEvent.getParameter("to");
			if (oPage) {
				oPage.addEventDelegate(this._oPageDelegate, oPage);
			}
		};

		this._oControl.addEventDelegate(this._oDelegate, this);

		//overwrite the _removeChild to detach event listener and remove delegate when the navcontainer is removed from this responsive popover
		this._oControl._removeChild = function(oChild, sAggregationName, bSuppressInvalidate){
			var aPages, i;
			if ((sAggregationName === "content") && (oChild instanceof sap.m.NavContainer)) {
				aPages = oChild.getPages();
				for (i = 0 ; i < aPages.length ; i++) {
					aPages[i].removeEventDelegate(that._oPageDelegate);
				}
				oChild.detachEvent("navigate", that._fnOnNavigate, that);
			}
			Control.prototype._removeChild.apply(this, arguments);
		};
	};


	/**
	 * Opens the ResponsivePopover. The ResponsivePopover is positioned relatively to the control parameter on tablet or desktop and is full screen on phone. Therefore the control parameter is only used on tablet or desktop and is ignored on phone.
	 *
	 * @param {object} oControl
	 *
	 *         When this control is displayed on tablet or desktop, the ResponsivePopover is positioned relatively to this control.
	 * @type sap.ui.core.Control
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	ResponsivePopover.prototype.openBy = function(oParent){
		if (!this._bAppendedToUIArea && !this.getParent()) {
			var oStatic = sap.ui.getCore().getStaticAreaRef();
			oStatic = sap.ui.getCore().getUIArea(oStatic);
			oStatic.addContent(this, true);
			this._bAppendedToUIArea = true;
		}

		if (sap.ui.Device.system.phone) {
			return this._oControl.open();
		} else {
			return this._oControl.openBy(oParent);
		}
	};

	ResponsivePopover.prototype.exit = function(){
		if (this._oCloseButton) {
			this._oCloseButton.destroy();
			this._oCloseButton = null;
		}

		if (this._oControl) {
			this._oControl.removeEventDelegate(this._oDelegate);
			this._oControl.destroy();
			this._oControl = null;
		}
	};

	/**
	 * Getter for closeButton. If there is no closeButton a new one is created
	 * @returns {sap.m.Button} A button with close icon
	 * @private
	 */
	ResponsivePopover.prototype._getCloseButton = function(){
		if (!this._oCloseButton) {
			var that = this;
			this._oCloseButton = new sap.m.Button(this.getId() + "-closeButton", {
				icon: IconPool.getIconURI("decline"),
				press: function() {
					that._oControl._oCloseTrigger = this;
					that.close();
				}
			});
		}
		return this._oCloseButton;
	};

	/**
	 * Adds content to the ResponsivePopover
	 * @param {sap.ui.core.Control} oControl - The control to be added to the content
	 * @public
	 */
	ResponsivePopover.prototype.addContent = function(oControl){
		this._bContentChanged = true;
		this.addAggregation("content", oControl);
	};

	/**
	 * Creates a new instance of ResponsivePopover with the same settings as the ResponsivePopover on which the method is called
	 * @returns {sap.m.ResponsivePopover} New instance of ResponsivePopover
	 * @public
	 */
	ResponsivePopover.prototype.clone = function(){
		var oClone = Control.prototype.clone.apply(this, arguments),
			aContent = this.getAggregation('_popup').getContent();

		for (var i = 0; i < aContent.length; i++) {
			oClone.addContent(aContent[i].clone());
		}

		return oClone;
	};

	ResponsivePopover.prototype._getSingleNavContent = function(){
		var aContent = this.getContent();

		while (aContent.length === 1 && aContent[0] instanceof sap.ui.core.mvc.View) {
			aContent = aContent[0].getContent();
		}

		if (aContent.length === 1 && aContent[0] instanceof sap.m.NavContainer) {
			return aContent[0];
		} else {
			return null;
		}
	};

	ResponsivePopover.prototype._getRealPage = function(oPage){
		var oReturn = oPage, aContent;

		while (oReturn) {
			if (oReturn instanceof sap.m.Page) {
				return oReturn;
			}
			if (oReturn instanceof sap.ui.core.mvc.View) {
				aContent = oReturn.getContent();
				if (aContent.length === 1) {
					oReturn = aContent[0];
					continue;
				}
			}
			oReturn = null;
		}
		return oReturn;
	};

	/**
	 * Inserts closeButton aggregation in the header's contentRight aggregation
	 * @param {sap.m.IBar} oHeader - The header in which the closeButton will be inserted
	 * @private
	 */
	ResponsivePopover.prototype._insertCloseButton = function(oHeader){
		var oCloseButton = this._getCloseButton(),
			iIndex;
		if (oHeader) {
			iIndex = oHeader.getAggregation("contentRight", []).length;
			oHeader.insertAggregation("contentRight", oCloseButton, iIndex);
		}
	};

	/**
	 * Removes closeButton aggregation from header's contentRight aggregation
	 * @param {sap.m.IBar} oHeader - The header from which the closeButton will be removed
	 * @private
	 */
	ResponsivePopover.prototype._removeCloseButton = function(oHeader) {
		var oCloseButton = this._getCloseButton();

		if (oHeader) {
			oHeader.removeAggregation("contentRight", oCloseButton);
		}
	};

	/**
	 * Returns a string whose first letter is uppercase
	 * @param {string} sValue - A string
	 * @returns {string} String whose first letter is uppercase
	 * @private
	 */
	ResponsivePopover.prototype._firstLetterUpperCase = function(sValue){
		return sValue.charAt(0).toUpperCase() + sValue.slice(1);
	};

	/**
	 * Returns the last index of an uppercase letter in a string
	 * @param {string} sValue - A string
	 * @returns {number} Position on which an uppercase letter is found or -1 if there are no uppercase letters found
	 * @private
	 */
	ResponsivePopover.prototype._lastIndexOfUpperCaseLetter = function(sValue){
		var i, sChar;
		for (i = sValue.length - 1 ; i >= 0; i--) {
			sChar = sValue.charAt(i);
			if (sChar === sChar.toUpperCase()) {
				return i;
			}
		}
		return -1;
	};

	ResponsivePopover.prototype._oldSetProperty = ResponsivePopover.prototype.setProperty;
	ResponsivePopover.prototype.setProperty = function(sPropertyName, oValue, bSuppressInvalidate){
		this._oldSetProperty(sPropertyName, oValue, true);
		if (jQuery.inArray(sPropertyName, this._aNotSupportedProperties) === -1) {
			this._oControl["set" + this._firstLetterUpperCase(sPropertyName)](oValue);
		}
		return this;
	};

	ResponsivePopover.prototype._oldSetModel = ResponsivePopover.prototype.setModel;
	ResponsivePopover.prototype.setModel = function(oModel, sName){
		this._oControl.setModel(oModel, sName);
		return this._oldSetModel(oModel, sName);
	};

	/**
	 * Creates a sap.m.Toolbar for a footer of the ResponsivePopover
	 * @returns {sap.m.Toolbar} Toolbar with ToolbarSpacer in the content aggregation
	 * @private
	 */
	ResponsivePopover.prototype._createButtonFooter = function(){
		if (this._oFooter) {
			return this._oFooter;
		}

		this._oFooter = new sap.m.Toolbar(this.getId() + "-footer", {
			content: [new sap.m.ToolbarSpacer()]
		});

		return this._oFooter;
	};

	ResponsivePopover.prototype._setButton = function(sPos, oButton){
		if (this._oControl instanceof Popover) {
			var sGetterName = "get" + this._firstLetterUpperCase(sPos) + "Button",
				oOldButton = this[sGetterName](),
				oFooter = this._createButtonFooter(),
				sPrivateName = "_o" + this._firstLetterUpperCase(sPos) + "Button",
				iIndex = (sPos.toLowerCase() === "begin" ? 0 : 1),
				sOtherGetterName = (sPos.toLowerCase() === "begin" ? "getEndButton" : "getBeginButton");

			if (oOldButton) {
				oFooter.removeContent(oOldButton);
			}
			if (oButton) {
				if (!oFooter.getParent()) {
					this._oControl.setFooter(oFooter);
				}
				oFooter.insertContent(oButton, iIndex + 1);
			} else {
				var oOtherButton = this[sOtherGetterName]();
				if (!oOtherButton) {
					oFooter.destroy();
					this._oFooter = null;
				}
			}

			this[sPrivateName] = oButton;
			return this;
		} else {
			var sAggregationName = sPos.toLowerCase() + "Button";
			return this.setAggregation(sAggregationName, oButton);
		}
	};

	/**
	 * Returns the status of the step locking mechanism
	 * @param {string} sPos - Defines if begin or end button will be returned
	 * @returns {sap.m.Button} The button that is set to beginButton or endButton aggregation
	 * @private
	 */
	ResponsivePopover.prototype._getButton = function(sPos){
		if (this._oControl instanceof Popover) {
			var sPrivateName = "_o" + this._firstLetterUpperCase(sPos) + "Button";
			return this[sPrivateName];
		} else {
			var sGetterName = "get" + this._firstLetterUpperCase(sPos) + "Button";
			return this[sGetterName]();
		}
	};

	/**
	 * Setter for beginButton aggregation
	 * @param {sap.m.Button} oButton - The button that will be set as an aggregation
	 * @returns {sap.m.ResponsivePopover} Pointer to the control instance for chaining
	 * @public
	 */
	ResponsivePopover.prototype.setBeginButton = function(oButton){
		oButton.setType(sap.m.ButtonType.Transparent);
		this._oControl.setBeginButton(oButton);
		return this._setButton("begin", oButton);
	};

	/**
	 * Setter for endButton aggregation
	 * @param {sap.m.Button} oButton - The button that will be set as an aggregation
	 * @returns {sap.m.ResponsivePopover} Pointer to the control instance for chaining
	 * @public
	 */
	ResponsivePopover.prototype.setEndButton = function(oButton){
		oButton.setType(sap.m.ButtonType.Transparent);
		this._oControl.setEndButton(oButton);
		return this._setButton("end", oButton);
	};

	/**
	 * Determines if the close button to the ResponsivePopover is shown or not. Works only when ResponsivePopover is used as a dialog
	 * @param {boolean} bShowCloseButton - Defines whether the close button is shown
	 * @returns {sap.m.ResponsivePopover} Pointer to the control instance for chaining
	 * @public
	 */
	ResponsivePopover.prototype.setShowCloseButton = function(bShowCloseButton) {
		var oHeader = this._oControl._getAnyHeader();
		if (bShowCloseButton) {
			this._insertCloseButton(oHeader);
		} else {
			this._removeCloseButton(oHeader);
		}

		this.setProperty("showCloseButton", bShowCloseButton, true);

		return this;
	};

	/**
	 * Getter for beginButton aggregation
	 * @returns {sap.m.Button} The button that is set as a beginButton aggregation
	 * @public
	 */
	ResponsivePopover.prototype.getBeginButton = function(){
		return this._getButton("begin");
	};

	/**
	 * Getter for endButton aggregation
	 * @returns {sap.m.Button} The button that is set as a endButton aggregation
	 * @public
	 */
	ResponsivePopover.prototype.getEndButton = function(){
		return this._getButton("end");
	};

	// forward all aggregation methods to the inner instance, either the popover or the dialog.
	["bindAggregation", "validateAggregation", "setAggregation", "getAggregation", "indexOfAggregation", "insertAggregation",
		"addAggregation", "removeAggregation", "removeAllAggregation", "destroyAggregation", "setAssociation", "getAssociation",
		"addAssociation", "removeAssociation", "removeAllAssociation"].forEach(function(sName){
			ResponsivePopover.prototype[sName] = function(){
				var iLastUpperCase = this._lastIndexOfUpperCaseLetter(sName),
					sMethodName, res;
				if (jQuery.type(arguments[0]) === "string") {
					if (iLastUpperCase !== -1) {
						sMethodName = sName.substring(0, iLastUpperCase) + this._firstLetterUpperCase(arguments[0]);
						//_oControl can be already destroyed in exit method
						if (this._oControl && this._oControl[sMethodName]) {
							res = this._oControl[sMethodName].apply(this._oControl, Array.prototype.slice.call(arguments, 1));
							return res === this._oControl ? this : res;
						} else {
							return Control.prototype[sName].apply(this, arguments);
						}
					}
				}
				res = this._oControl[sName].apply(this._oControl, arguments);
				return res === this._oControl ? this : res;
			};
	});

	// forward the other necessary methods to the inner instance, but do not check the existence of generated methods like (addItem)
	["invalidate", "close", "isOpen", "addStyleClass", "removeStyleClass", "toggleStyleClass", "hasStyleClass",
		"setBindingContext", "getBindingContext", "getBinding", "getBindingInfo", "getBindingPath", "getDomRef", "setBusy", "getBusy", "setBusyIndicatorDelay", "getBusyIndicatorDelay"].forEach(function(sName){
			ResponsivePopover.prototype[sName] = function() {
				if (this._oControl && this._oControl[sName]) {
					var res = this._oControl[sName].apply(this._oControl ,arguments);
					return res === this._oControl ? this : res;
				}
			};
	});

	return ResponsivePopover;

}, /* bExport= */ true);
