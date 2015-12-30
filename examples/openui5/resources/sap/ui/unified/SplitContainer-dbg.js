/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.unified.SplitContainer.
sap.ui.define(['jquery.sap.global', 'sap/ui/core/Control', 'sap/ui/core/theming/Parameters', './library'],
	function(jQuery, Control, Parameters, library) {
	"use strict";


	
	/**
	 * Constructor for a new SplitContainer.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * Provides a main content and a secondary content area
	 * @extends sap.ui.core.Control
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @since 1.15.0
	 * @experimental Since version 1.15.0. 
	 * API is not yet finished and might change completely
	 * @alias sap.ui.unified.SplitContainer
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var SplitContainer = Control.extend("sap.ui.unified.SplitContainer", /** @lends sap.ui.unified.SplitContainer.prototype */ { metadata : {
	
		library : "sap.ui.unified",
		properties : {
	
			/**
			 * Shows / Hides the secondary area.
			 */
			showSecondaryContent : {type : "boolean", group : "Appearance", defaultValue : null},
	
			/**
			 * The width if the secondary content. The height is always 100%.
			 */
			secondaryContentSize : {type : "sap.ui.core.CSSSize", group : "Appearance", defaultValue : '250px'},
	
			/**
			 * Do not use. Use secondaryContentSize instead.
			 * @deprecated Since version 1.22. 
			 * 
			 * Only available for backwards compatibility.
			 */
			secondaryContentWidth : {type : "sap.ui.core.CSSSize", group : "Appearance", defaultValue : '250px', deprecated: true},
	
			/**
			 * Whether to show the secondary content on the left ("Horizontal", default) or on the top ("Vertical").
			 * @since 1.22.0
			 */
			orientation : {type : "sap.ui.core.Orientation", group : "Appearance", defaultValue : sap.ui.core.Orientation.Horizontal}
		},
		defaultAggregation : "content",
		aggregations : {
	
			/**
			 * The content to appear in the main area.
			 */
			content : {type : "sap.ui.core.Control", multiple : true, singularName : "content"}, 
	
			/**
			 * The content to appear in the secondary area.
			 */
			secondaryContent : {type : "sap.ui.core.Control", multiple : true, singularName : "secondaryContent"}
		}
	}});
	
	(function(window) {
	
	
	////////////////////////////////////////// Public Methods //////////////////////////////////////////
	
	SplitContainer.prototype.init = function(){
		this.bRtl  = sap.ui.getCore().getConfiguration().getRTL();
		
		this._paneRenderer = new sap.ui.unified._ContentRenderer(this, this.getId() + "-panecntnt", "secondaryContent");
		this._canvasRenderer = new sap.ui.unified._ContentRenderer(this, this.getId() + "-canvascntnt", "content");
		
	// Design decided that content does not need to be handled differently depending on device - remove 
	// comments if needed again...
	//	sap.ui.Device.media.attachHandler(
	//		this._handleMediaChange, this, sap.ui.Device.media.RANGESETS.SAP_STANDARD
	//	);
	
		// By default move the content when the secondaryContent is shown
		this._moveContent = true;
	};
	
	SplitContainer.prototype.exit = function(){
		this._paneRenderer.destroy();
		delete this._paneRenderer;
		this._canvasRenderer.destroy();
		delete this._canvasRenderer;
	
		if (this._closeContentDelayId) {
			jQuery.sap.clearDelayedCall(this._closeContentDelayId);
			delete this._closeContentDelayId;
		}
		delete this._contentContainer;
		delete this._secondaryContentContainer;
	};
	
	
	////////////////////////////////////////// onEvent Methods /////////////////////////////////////////
	
	SplitContainer.prototype.onAfterRendering = function() {
		// Shortcuts to the main DOM containers
		this._contentContainer 			= this.$("canvas");
		this._secondaryContentContainer = this.$("pane");
	
	// Design decided that content does not need to be handled differently depending on device - remove 
	// comments if needed again...
	//	this._lastDeviceName = "";
	//	this._handleMediaChange(
	//		sap.ui.Device.media.getCurrentRange(sap.ui.Device.media.RANGESETS.SAP_STANDARD)
	//	);
		
		this._applySecondaryContentSize();
	};
	
	
	////////////////////////////////////////// Private Methods /////////////////////////////////////////
	
	// Design decided that content does not need to be handled differently depending on device - remove 
	// comments if needed again...
	///**
	// * This method is called whenever the size of the document changes into a different range of values
	// * that represent different devices (Desktop/Tablet/Phone).
	// * 
	// * @private
	// */
	//sap.ui.unified.SplitContainer.prototype._handleMediaChange = function(mParams) {
	//	var sDeviceName = mParams.name;
	//	
	//	// By default, move the content to the right, there should be enough space
	//	this._moveContent = true;
	//
	//	if (sDeviceName == "Phone") {
	//		// On phones, do not move the main content as it does not have enough
	//		// space as it is
	//		this._moveContent = false;
	//	}
	//
	//	// Only write changes if something actually changed
	//	if (this._lastDeviceName !== sDeviceName) {
	//		this._applySecondaryContentSize();
	//	}
	//	this._lastDeviceName = sDeviceName;
	//};
	
	/**
	 * Applies the current status to the content areas (CSS left and width properties).
	 * 
	 * @private
	 */
	SplitContainer.prototype._applySecondaryContentSize = function(){
		// Only set if rendered...
		if (this.getDomRef()) {
			var bVertical = this.getOrientation() == sap.ui.core.Orientation.Vertical;
			var sSize, sOtherSize;
			var sDir, sOtherDir;
			var sSizeValue = this.getSecondaryContentSize();
			var bShow = this.getShowSecondaryContent();
	
			if (bVertical) {
				// Vertical mode
				sSize = "height";
				sOtherSize =  "width";
				sDir = "top";
				sOtherDir = this.bRtl ? "right" : "left";
			} else {
				// Horizontal mode
				sSize = "width";
				sOtherSize =  "height";
				sDir = this.bRtl ? "right" : "left";
				sOtherDir = "top";
			}
			
			if (this._closeContentDelayId) {
				jQuery.sap.clearDelayedCall(this._closeContentDelayId);
				delete this._closeContentDelayId;
			}
			
			this._secondaryContentContainer.css(sSize, sSizeValue);
			this._secondaryContentContainer.css(sOtherSize, "");
			this._secondaryContentContainer.css(sDir, bShow ? "0" : "-" + sSizeValue);
			this._secondaryContentContainer.css(sOtherDir, "");
			
			// Move main content if it should be completely visible. @see _handleMediaChange()
			if (this._moveContent) {
				this._contentContainer.css(sDir, bShow ? sSizeValue : "0");
			} else {
				this._contentContainer.css(sDir, "0");
			}
			
			if (!bShow) {
				// The theming parameter is something along the lines of "500ms", the "ms"-part is
				// ignored by parseInt.
				// TODO: Cache the value.
				var iHideDelay = parseInt(
					Parameters.get("sapUiUfdSplitContAnimationDuration"),
					10
				);
				// Maybe we could also allow "s"-values and then multiply everything below 20 with 1000...?
	
				this._closeContentDelayId = jQuery.sap.delayedCall(iHideDelay, this, function() {
					this._secondaryContentContainer.toggleClass("sapUiUfdSplitContSecondClosed", true);
				});
			} else {
				this._secondaryContentContainer.toggleClass("sapUiUfdSplitContSecondClosed", false);
			}
			
		}
	};
	
	
	
	/**
	 * Optimization method that prevents the normal render from rerendering the whole control.
	 * See _ContentRenderer in file shared.js for details.
	 * 
	 * @param {function} fMod Method that is called to perform the requested change
	 * @param {sap.ui.core.Renderer} oDoIfRendered Renderer Instance
	 * @returns {any} the return value from the first parameter
	 * 
	 * @private
	 */
	SplitContainer.prototype._mod = function(fMod, oDoIfRendered){
		var bRendered = !!this.getDomRef();
		var res = fMod.apply(this, [bRendered]);
		if (bRendered && oDoIfRendered) {
			oDoIfRendered.render();
		}
		return res;
	};
	
	
	//////////////////////////////////////// Overridden Methods ////////////////////////////////////////
	
	    //////////////////////////// Property "showSecondaryContent" ///////////////////////////////
	
	SplitContainer.prototype.setShowSecondaryContent = function(bShow){
		var bRendered = this.getDomRef();
		this.setProperty("showSecondaryContent", !!bShow, bRendered);
		
		this._applySecondaryContentSize();
		return this;
	};
	
	
		///////////////////////////// Property "secondaryContentSize" /////////////////////////////
	
	SplitContainer.prototype.setSecondaryContentSize = function(sSize) {
		this.setProperty("secondaryContentSize", sSize, true);
		this._applySecondaryContentSize();
		return this;
	};
	
	// Backwards compatibility with old property name

	SplitContainer.prototype.getSecondaryContentWidth = function() {
		jQuery.sap.log.warning(
			"SplitContainer: Use of deprecated property \"SecondaryContentWidth\", please use " +
			"\"SecondaryContentSize\" instead."
		);
		return this.getSecondaryContentSize.apply(this, arguments);
	};
		
	SplitContainer.prototype.setSecondaryContentWidth = function() {
		jQuery.sap.log.warning(
			"SplitContainer: Use of deprecated property \"SecondaryContentWidth\", please use " +
			"\"SecondaryContentSize\" instead."
		);
		return this.setSecondaryContentSize.apply(this, arguments);
	};
	
	
	
		/////////////////////////////////// Aggregation "content" //////////////////////////////////
	
	SplitContainer.prototype.insertContent = function(oContent, iIndex) {
		return this._mod(function(bRendered){
			return this.insertAggregation("content", oContent, iIndex, bRendered);
		}, this._canvasRenderer);
	};
	SplitContainer.prototype.addContent = function(oContent) {
		return this._mod(function(bRendered){
			return this.addAggregation("content", oContent, bRendered);
		}, this._canvasRenderer);
	};
	SplitContainer.prototype.removeContent = function(vIndex) {
		return this._mod(function(bRendered){
			return this.removeAggregation("content", vIndex, bRendered);
		}, this._canvasRenderer);
	};
	SplitContainer.prototype.removeAllContent = function() {
		return this._mod(function(bRendered){
			return this.removeAllAggregation("content", bRendered);
		}, this._canvasRenderer);
	};
	SplitContainer.prototype.destroyContent = function() {
		return this._mod(function(bRendered){
			return this.destroyAggregation("content", bRendered);
		}, this._canvasRenderer);
	};
	
	
	    ////////////////////////////// Aggregation "secondaryContent" //////////////////////////////
	
	SplitContainer.prototype.insertSecondaryContent = function(oContent, iIndex) {
		return this._mod(function(bRendered){
			return this.insertAggregation("secondaryContent", oContent, iIndex, bRendered);
		}, this._paneRenderer);
	};
	SplitContainer.prototype.addSecondaryContent = function(oContent) {
		return this._mod(function(bRendered){
			return this.addAggregation("secondaryContent", oContent, bRendered);
		}, this._paneRenderer);
	};
	SplitContainer.prototype.removeSecondaryContent = function(vIndex) {
		return this._mod(function(bRendered){
			return this.removeAggregation("secondaryContent", vIndex, bRendered);
		}, this._paneRenderer);
	};
	SplitContainer.prototype.removeAllSecondaryContent = function() {
		return this._mod(function(bRendered){
			return this.removeAllAggregation("secondaryContent", bRendered);
		}, this._paneRenderer);
	};
	SplitContainer.prototype.destroySecondaryContent = function() {
		return this._mod(function(bRendered){
			return this.destroyAggregation("secondaryContent", bRendered);
		}, this._paneRenderer);
	};
	
	
	})(window);
	

	return SplitContainer;

}, /* bExport= */ true);
