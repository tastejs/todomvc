/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides the render manager sap.ui.core.RenderManager
sap.ui.define([
		'jquery.sap.global',
		'../base/Interface', '../base/Object', 'sap/ui/core/LabelEnablement',
		'jquery.sap.act', 'jquery.sap.encoder', 'jquery.sap.dom', 'jquery.sap.trace'
	], function(jQuery, Interface, BaseObject, LabelEnablement /* , jQuerySap1, jQuerySap */) {

	"use strict";

	var aCommonMethods = ["renderControl", "write", "writeEscaped", "translate", "writeAcceleratorKey", "writeControlData", "writeInvisiblePlaceholderData",
						  "writeElementData", "writeAttribute", "writeAttributeEscaped", "addClass", "writeClasses",
						  "addStyle", "writeStyles", "writeAccessibilityState", "writeIcon",
						  "getConfiguration", "getHTML", "cleanupControlWithoutRendering"];
	var aNonRendererMethods = ["render", "flush", "destroy"];

	/**
	 * Creates an instance of the RenderManager.
	 *
	 * @class RenderManager that will take care for rendering Controls.
	 *
	 * The RenderManager will be available from the sap.ui.core.Core instance (available via <code>sap.ui.getCore()</code>).<br/>It
	 * can be used to render Controls and Control-Trees.
	 *
	 * The convention for renderers belonging to some controls is the following:
	 * <ul>
	 * <li>for a Control e.g. <code>sap.ui.controls.InputField</code> there shall be </li>
	 * <li>a renderer named <code>sap.ui.controls.InputFieldRenderer</code></li>
	 * <ul>
	 *
	 * @see sap.ui.core.Core
	 * @see sap.ui.getCore()
	 *
	 * @extends sap.ui.base.Object
	 * @author Jens Pflueger
	 * @version 1.32.9
	 * @constructor
	 * @alias sap.ui.core.RenderManager
	 * @public
	 */
	var RenderManager = BaseObject.extend("sap.ui.core.RenderManager", /** @lends sap.ui.core.RenderManager.prototype */ {

		constructor : function() {
			BaseObject.apply(this, arguments);
			this.aBuffer = [];
			this.aRenderedControls = [];
			this.aStyleStack = [{}];
		},

		metadata : {
			publicMethods : aCommonMethods.concat(aNonRendererMethods)
		}

	});

	/**
	 * Returns the public interface of the RenderManager which can be used by Renderers.
	 *
	 * @return {sap.ui.base.Interface} the interface
	 * @private
	 */
	RenderManager.prototype.getRendererInterface = function() {
		// see sap.ui.base.Object.getInterface for reference
		var oInterface = new Interface(this, aCommonMethods);
		this.getRendererInterface = jQuery.sap.getter(oInterface);
		return oInterface;
	};

	/**
	 * Cleans up the resources associated with this instance.
	 * After the instance has been destroyed, it must not be used anymore.
	 * Applications should call this function if they don't need the instance any longer.
	 *
	 * @public
	 */
	RenderManager.prototype.destroy = function() {
		this.aBuffer = [];
		this.aRenderedControls = [];
		this.aStyleStack = [{}];
	};

	/**
	 * Returns the configuration object
	 * Shortcut for <code>sap.ui.getCore().getConfiguration()</code>
	 * @return {sap.ui.core.Configuration} the configuration object
	 * @public
	 */
	RenderManager.prototype.getConfiguration = function() {
		return sap.ui.getCore().getConfiguration();
	};

	/**
	 * Returns the renderer class for a given control instance
	 *
	 * @param {sap.ui.core.Control} oControl the control that should be rendered
	 * @return the renderer class for a given control instance
	 * @public
	 */
	RenderManager.prototype.getRenderer = function(oControl) {
		jQuery.sap.assert(oControl && oControl instanceof sap.ui.core.Control, "oControl must be a sap.ui.core.Control");
		return RenderManager.getRenderer(oControl);
	};

	/**
	 * Sets the focus handler to be used by the RenderManager.
	 *
	 * @param {sap.ui.core.FocusHandler} oFocusHandler the focus handler to be used.
	 * @private
	 */
	RenderManager.prototype._setFocusHandler = function(oFocusHandler) {
		jQuery.sap.assert(oFocusHandler && oFocusHandler instanceof sap.ui.core.FocusHandler, "oFocusHandler must be a sap.ui.core.FocusHandler");
		this.oFocusHandler = oFocusHandler;
	};

	//Triggers the BeforeRendering event on the given Control
	var triggerBeforeRendering = function(oRM, oControl){
		oRM._bLocked = true;
		try {
			var oEvent = jQuery.Event("BeforeRendering");
			// store the element on the event (aligned with jQuery syntax)
			oEvent.srcControl = oControl;
			oControl._handleEvent(oEvent);
		} finally {
			oRM._bLocked = false;
		}
	};

	/**
	 * Cleans up the rendering state of the given control with rendering it.
	 *
	 * A control is responsible for the rendering of all its child controls.
	 * But in some cases it makes sense that a control does not render all its
	 * children based on a filter condition. For example a Carousel control only renders
	 * the current visible parts (and maybe some parts before and after the visible area)
	 * for performance reasons.
	 * If a child was rendered but should not be rendered anymore because the filter condition
	 * does not apply anymore this child must be cleaned up correctly (e.g deregistering eventhandlers, ...).
	 *
	 * The following example shows how renderControl and cleanupControlWithoutRendering should
	 * be used:
	 *
	 * render = function(rm, ctrl){
	 *   //...
	 *   var aAggregatedControls = //...
	 *   for(var i=0; i<aAgrregatedControls.length; i++){
	 *   	if(//... some filter expression){
	 *         rm.renderControl(aAggregatedControls[i]);
	 *      }else{
	 *         rm.cleanupControlWithoutRendering(aAggregatedControls[i]);
	 *      }
	 *   }
	 *   //...
	 * }
	 *
	 * Note:
	 * The method does not remove DOM of the given control. The callee of this method has to take over the
	 * responsibility to cleanup the DOM of the control afterwards.
	 * For parents which are rendered with the normal mechanism as shown in the example above this requirement
	 * is fulfilled, because the control is not added to the rendering buffer (renderControl is not called) and
	 * the DOM is replaced when the rendering cycle is finalized.
	 *
	 * @param {sap.ui.core.Control} oControl the control that should be cleaned up
	 * @public
	 * @since 1.22.9
	 */
	RenderManager.prototype.cleanupControlWithoutRendering = function(oControl) {
		jQuery.sap.assert(!oControl || oControl instanceof sap.ui.core.Control, "oControl must be a sap.ui.core.Control or empty");
		if (!oControl || !oControl.getDomRef()) {
			return;
		}

		//Call beforeRendering to allow cleanup
		triggerBeforeRendering(this, oControl);

		oControl.bOutput = false;
	};

	/**
	 * Turns the given control into its HTML representation and appends it to the
	 * rendering buffer.
	 *
	 * If the given control is undefined or null, then nothing is rendered.
	 *
	 * @param {sap.ui.core.Control} oControl the control that should be rendered
	 * @public
	 */
	RenderManager.prototype.renderControl = function(oControl) {
		jQuery.sap.assert(!oControl || oControl instanceof sap.ui.core.Control, "oControl must be a sap.ui.core.Control or empty");
		// don't render a NOTHING
		if (!oControl) {
			return;
		}

		// create stack to determine rendered parent
		if (!this.aRenderStack) {
			this.aRenderStack = [];
		}
		// stop the measurement of parent
		if (this.aRenderStack && this.aRenderStack.length > 0) {
			jQuery.sap.measure.pause(this.aRenderStack[0] + "---renderControl");
		} else if (oControl.getParent() && oControl.getParent().getMetadata().getName() == "sap.ui.core.UIArea") {
			jQuery.sap.measure.pause(oControl.getParent().getId() + "---rerender");
		}
		this.aRenderStack.unshift(oControl.getId());
		// start performance measurement
		jQuery.sap.measure.start(oControl.getId() + "---renderControl","Rendering of " + oControl.getMetadata().getName(), ["rendering","control"]);

		//Remember the current buffer size to check later whether the control produced output
		var iBufferLength = this.aBuffer.length;

		var oControlStyles = {};
		if (oControl.aCustomStyleClasses && oControl.aCustomStyleClasses.length > 0) {
			oControlStyles.aCustomStyleClasses = oControl.aCustomStyleClasses; //cleared again in the writeClasses function
		}

		this.aStyleStack.push(oControlStyles);

		jQuery.sap.measure.pause(oControl.getId() + "---renderControl");
		// don't measure getRenderer because if Load needed its measured in Ajax call
		// but start measurement before is to see general rendering time including loading time

		// Either render the control normally, or invoke the InvisibleRenderer in case the control
		// uses the default visible property
		var oRenderer;
		var oMetadata = oControl.getMetadata();
		var bVisible = oControl.getVisible();
		if (bVisible) {
			// If the control is visible, return its renderer (Should be the default case, just like before)
			oRenderer = oMetadata.getRenderer();
		} else {
			// If the control is invisible, find out whether it uses its own visible implementation
			var oVisibleProperty = oMetadata.getProperty("visible");

			var bUsesDefaultVisibleProperty =
				   oVisibleProperty
				&& oVisibleProperty._oParent
				&& oVisibleProperty._oParent.getName() == "sap.ui.core.Control";

			oRenderer = bUsesDefaultVisibleProperty
				// If the control inherited its visible property from sap.ui.core.Control, use
				// the default InvisibleRenderer to render a placeholder instead of the real
				// control HTML
				? InvisibleRenderer
				// If the control has their own visible property or one not inherited from
				// sap.ui.core.Control, return the real renderer
				: oMetadata.getRenderer();
		}

		jQuery.sap.measure.resume(oControl.getId() + "---renderControl");

		triggerBeforeRendering(this, oControl);

		// unbind any generically bound browser event handlers
		var aBindings = oControl.aBindParameters;
		if (aBindings && aBindings.length > 0) { // if we have stored bind calls...
			var jDomRef = jQuery(oControl.getDomRef());
			if (jDomRef && jDomRef[0]) { // ...and we have a DomRef
				for (var i = 0; i < aBindings.length; i++) {
					var oParams = aBindings[i];
					jDomRef.unbind(oParams.sEventType, oParams.fnProxy);
				}
			}
		}

		//Render the control using the RenderManager interface
		if (oRenderer && typeof oRenderer.render === "function") {
			oRenderer.render(this.getRendererInterface(), oControl);
		} else {
			jQuery.sap.log.error("The renderer for class " + oMetadata.getName() + " is not defined or does not define a render function! Rendering of " + oControl.getId() + " will be skipped!");
		}

		this.aStyleStack.pop();

		//Remember the rendered control
		this.aRenderedControls.push(oControl);

		// let the UIArea know that this control has been rendered
		// FIXME: RenderManager (RM) should not need to know about UIArea. Maybe UIArea should delegate rendering to RM
		if ( oControl.getUIArea && oControl.getUIArea() ) {
			oControl.getUIArea()._onControlRendered(oControl);
		}

		//Check whether the control has produced HTML
		// Special case: If an invisible placeholder was rendered, use a non-boolean value
		oControl.bOutput = this.aBuffer.length != iBufferLength;
		if (oRenderer === InvisibleRenderer) {
			oControl.bOutput = "invisible"; // Still evaluates to true, but can be checked for the special case
		}

		// end performance measurement
		jQuery.sap.measure.end(oControl.getId() + "---renderControl");
		this.aRenderStack.shift();
		// resume the measurement of parent
		if (this.aRenderStack && this.aRenderStack.length > 0) {
			jQuery.sap.measure.resume(this.aRenderStack[0] + "---renderControl");
		} else if (oControl.getParent() && oControl.getParent().getMetadata().getName() == "sap.ui.core.UIArea") {
			jQuery.sap.measure.resume(oControl.getParent().getId() + "---rerender");
		}
	};

	/**
	 * Renders the given {@link sap.ui.core.Control} and finally returns
	 * the content of the rendering buffer.
	 * Ensures the buffer is restored to the state before calling this method.
	 *
	 * @param {sap.ui.core.Control}
	 *            oControl the Control whose HTML should be returned.
	 * @return {string} the resulting HTML of the provided control
	 * @deprecated Since version 0.15.0. Use <code>flush()</code> instead render content outside the rendering phase.
	 * @public
	 */
	RenderManager.prototype.getHTML = function(oControl) {
		jQuery.sap.assert(oControl && oControl instanceof sap.ui.core.Control, "oControl must be a sap.ui.core.Control");

		var tmp = this.aBuffer;
		var aResult = this.aBuffer = [];
		this.renderControl(oControl);
		this.aBuffer = tmp;
		return aResult.join("");
	};

	(function() {

		//Does everything needed after the rendering (restore focus, calling "onAfterRendering", initialize event binding)
		var finalizeRendering = function(oRM, aRenderedControls, oStoredFocusInfo){

			var i, size = aRenderedControls.length;

			for (i = 0; i < size; i++) {
				aRenderedControls[i]._sapui_bInAfterRenderingPhase = true;
			}
			oRM._bLocked = true;

			try {

				// Notify the behavior object that the controls will be attached to DOM
				for (i = 0; i < size; i++) {
					var oControl = aRenderedControls[i];
					if (oControl.bOutput && oControl.bOutput !== "invisible") {
						var oEvent = jQuery.Event("AfterRendering");
						// store the element on the event (aligned with jQuery syntax)
						oEvent.srcControl = oControl;
						// start performance measurement
						jQuery.sap.measure.start(oControl.getId() + "---AfterRendering","AfterRendering of " + oControl.getMetadata().getName(), ["rendering","after"]);
						oControl._handleEvent(oEvent);
						// end performance measurement
						jQuery.sap.measure.end(oControl.getId() + "---AfterRendering");
					}
				}

			} finally {
				for (i = 0; i < size; i++) {
					delete aRenderedControls[i]._sapui_bInAfterRenderingPhase;
				}
				oRM._bLocked = false;
			}

			//finally restore focus
			try {
				oRM.oFocusHandler.restoreFocus(oStoredFocusInfo);
			} catch (e) {
				jQuery.sap.log.warning("Problems while restoring the focus after rendering: " + e, null, oRM);
			}

			// Re-bind any generically bound browser event handlers (must happen after restoring focus to avoid focus event)
			for (i = 0; i < size; i++) {
				var oControl = aRenderedControls[i],
					aBindings = oControl.aBindParameters;

				if (aBindings && aBindings.length > 0) { // if we have stored bind calls...
					var jDomRef = jQuery(oControl.getDomRef());
					if (jDomRef && jDomRef[0]) { // ...and we have a DomRef - TODO: this check should not be required right after rendering...
						for (var j = 0; j < aBindings.length; j++) {
							var oParams = aBindings[j];
							jDomRef.bind(oParams.sEventType, oParams.fnProxy);
						}
					}
				}
			}
		};

		/**
		 * Renders the content of the rendering buffer into the provided DOMNode.
		 *
		 * This function must not be called within control renderers.
		 *
		 * Usage:
		 * <pre>
		 * // Create a new instance of the RenderManager
		 * var rm = sap.ui.getCore().createRenderManager();
		 * // Use the writer API to fill the buffers
		 * rm.write(...);
		 * rm.renderControl(oControl);
		 * rm.write(...);
		 * ...
		 * // Finally flush the buffer into the provided DOM node (The current content is removed)
		 * rm.flush(oDomNode);
		 * // If the instance is not needed anymore, destroy it
		 * rm.destroy();
		 * </pre>
		 *
		 * @param {Element} oTargetDomNode The node in the dom where the buffer should be flushed into.
		 * @param {boolean} bDoNotPreserve flag, whether to not preserve (true) the content or to preserve it (false).
		 * @param {boolean|int} vInsert flag, whether to append (true) or replace (false) the buffer of the target dom node or to insert at a certain position (int)
		 * @public
		 */
		RenderManager.prototype.flush = function(oTargetDomNode, bDoNotPreserve, vInsert) {
			jQuery.sap.assert((typeof oTargetDomNode === "object") && (oTargetDomNode.ownerDocument == document), "oTargetDomNode must be a DOM element");
			if (this.bRendererMode) {
				jQuery.sap.log.info("Flush must not be called from control renderers. Call ignored.", null, this);
				return;
			}

			// preserve HTML content before flushing HTML into target DOM node
			if (!bDoNotPreserve && (typeof vInsert !== "number") && !vInsert) { // expression mimics the conditions used below
				RenderManager.preserveContent(oTargetDomNode);
			}

			var oStoredFocusInfo = this.oFocusHandler ? this.oFocusHandler.getControlFocusInfo() : null;

			var sHTML = this.aBuffer.join("");

			if (this._fPutIntoDom) {
				//Case when render function was called
				this._fPutIntoDom(oTargetDomNode, sHTML);
			} else {
				for (var i = 0; i < this.aRenderedControls.length; i++) {
					//TODO It would be enough to loop over the controls for which renderControl was initially called but for this
					//we have to manage an additional array. Rethink about later.
					var oldDomNode = this.aRenderedControls[i].getDomRef();
					if (oldDomNode && !RenderManager.isPreservedContent(oldDomNode)) {
						if (RenderManager.isInlineTemplate(oldDomNode)) {
							jQuery(oldDomNode).empty();
						} else {
							jQuery(oldDomNode).remove();
						}
					}
				}
				if (typeof vInsert === "number") {
					if (vInsert <= 0) { // new HTML should be inserted at the beginning
						jQuery(oTargetDomNode).prepend(sHTML);
					} else { // new element should be inserted at a certain position > 0
						var $predecessor = jQuery(oTargetDomNode).children().eq(vInsert - 1); // find the element which should be directly before the new one
						if ($predecessor.length === 1) {
							// element found - put the HTML in after this element
							$predecessor.after(sHTML);
						} else {
							// element not found (this should not happen when properly used), append the new HTML
							jQuery(oTargetDomNode).append(sHTML);
						}
					}
				} else if (!vInsert) {
					jQuery(oTargetDomNode).html(sHTML); // Put the HTML into the given DOM Node
				} else {
					jQuery(oTargetDomNode).append(sHTML); // Append the HTML into the given DOM Node
				}
			}

			finalizeRendering(this, this.aRenderedControls, oStoredFocusInfo);

			this.aRenderedControls = [];
			this.aBuffer = [];
			this.aStyleStack = [{}];

			jQuery.sap.act.refresh();

			jQuery.sap.interaction.notifyStepEnd();
		};

		/**
		 * Renders the given control to the provided DOMNode.
		 *
		 * If the control is already rendered in the provided DOMNode the DOM of the control is replaced. If the control
		 * is already rendered somewhere else the current DOM of the control is removed and the new DOM is appended
		 * to the provided DOMNode.
		 *
		 * This function must not be called within control renderers.
		 *
		 * @param {sap.ui.core.Control} oControl the Control that should be rendered.
		 * @param {Element} oTargetDomNode The node in the DOM where the result of the rendering should be inserted.
		 * @public
		 */
		RenderManager.prototype.render = function(oControl, oTargetDomNode) {
			jQuery.sap.assert(oControl && oControl instanceof sap.ui.core.Control, "oControl must be a control");
			jQuery.sap.assert(typeof oTargetDomNode === "object" && oTargetDomNode.ownerDocument == document, "oTargetDomNode must be a DOM element");
			if (this.bRendererMode) {
				jQuery.sap.log.info("Render must not be called from control renderers. Call ignored.", null, this);
				return;
			}
			if (this._bLocked) {
				jQuery.sap.log.error("Render must not be called within Before or After Rendering Phase. Call ignored.", null, this);
				return;
			}

			// Reset internal state before rendering
			this.aRenderedControls = [];
			this.aBuffer = [];
			this.aStyleStack = [{}];

			// Retrieve the markup (the rendering phase)
			this.renderControl(oControl);

			// FIXME: MULTIPLE ROOTS
			// The implementation of this method doesn't support multiple roots for a control.
			// Affects all places where 'oldDomNode' is used
			this._fPutIntoDom = function(oTarget, sHTML){

				if (oControl && oTargetDomNode) {

					var oldDomNode = oControl.getDomRef();
					if ( RenderManager.isPreservedContent(oldDomNode) ) {
						// use placeholder instead
						oldDomNode = jQuery.sap.byId(sap.ui.core.RenderPrefixes.Dummy + oControl.getId())[0] || oldDomNode;
					}
					if (!oldDomNode) {
						// In case no old DOM node was found, search for the invisible placeholder
						oldDomNode = jQuery.sap.domById(sap.ui.core.RenderPrefixes.Invisible + oControl.getId());
					}

					var bNewTarget = oldDomNode && oldDomNode.parentNode != oTargetDomNode;

					var fAppend = function(){
						var jTarget = jQuery(oTargetDomNode);
						if (oTargetDomNode.innerHTML == "") {
							jTarget.html(sHTML);
						} else {
							jTarget.append(sHTML);
						}
					};

					if (bNewTarget) { //Control was rendered already and is now moved to different location

						if (!RenderManager.isPreservedContent(oldDomNode)) {
							if (RenderManager.isInlineTemplate(oldDomNode)) {
								jQuery(oldDomNode).empty();
							} else {
								jQuery(oldDomNode).remove();
							}
						}

						if (sHTML) {
							fAppend();
						}

					} else { //Control either rendered initially or rerendered at the same location

						if (sHTML) {
							if (oldDomNode) {
								if (RenderManager.isInlineTemplate(oldDomNode)) {
									jQuery(oldDomNode).html(sHTML);
								} else if (this._isDomPathingEnabled()) {
									jQuery.sap.replaceDOM(oldDomNode, sHTML, true);
								} else {
									jQuery(oldDomNode).replaceWith(sHTML);
								}
							} else {
								fAppend();
							}
						} else {
							if (RenderManager.isInlineTemplate(oldDomNode)) {
								jQuery(oldDomNode).empty();
							} else {
								// give parent control a chance to handle emptied children properly (e.g. XMLView)
								if ( !oControl.getParent()
										 || !oControl.getParent()._onChildRerenderedEmpty
										 || !oControl.getParent()._onChildRerenderedEmpty(oControl, oldDomNode) ) {
									jQuery(oldDomNode).remove();
								}
							}

						}

					}

				}

			};

			this.flush(oTargetDomNode, true);

			this._fPutIntoDom = null;
		};

	}());


	//#################################################################################################
	// Static Methods
	//#################################################################################################

	/**
	 * Returns the renderer class for a given control instance
	 *
	 * @param {sap.ui.core.Control}
	 *            oControl the control that should be rendered
	 * @type function
	 * @return the renderer class for a given control instance
	 * @static
	 * @public
	 */
	RenderManager.getRenderer = function(oControl) {
		jQuery.sap.assert(oControl && oControl instanceof sap.ui.core.Control, "oControl must be a sap.ui.core.Control");

		return oControl.getMetadata().getRenderer();
	};

	/**
	 * Helper to enforce a repaint for a given dom node.
	 *
	 * Introduced to fix repaint issues in Webkit browsers, esp. Chrome.
	 * @param {Element} vDomNode a DOM node or ID of a DOM node
	 *
	 * @private
	 */
	RenderManager.forceRepaint = function(vDomNode) {
		var oDomNode = typeof vDomNode == "string" ? jQuery.sap.domById(vDomNode) : vDomNode;
		if ( oDomNode ) {
			jQuery.sap.log.debug("forcing a repaint for " + (oDomNode.id || String(oDomNode)));
			var sOriginalDisplay = oDomNode.style.display;
			var oActiveElement = document.activeElement;
			oDomNode.style.display = "none";
			oDomNode.offsetHeight;
			oDomNode.style.display = sOriginalDisplay;
			if (document.activeElement !== oActiveElement) {
				jQuery.sap.focus(oActiveElement);
			}
		}
	};

	/**
	 * Creates the ID to be used for the invisible Placeholder DOM element.
	 * This method can be used to get direct access to the placeholder DOM element.
	 * Also statically available as RenderManager.createInvisiblePlaceholderId()
	 *
	 * @param {sap.ui.core.Element} oElement - The Element instance for which to create the placeholder ID
	 * @returns {string} The ID used for the invisible Placeholder of this element
	 * @static
	 * @protected
	 */
	RenderManager.createInvisiblePlaceholderId = function(oElement) {
		return sap.ui.core.RenderPrefixes.Invisible + oElement.getId();
	};


	//#################################################################################################
	// Methods for preserving HTML content
	//#################################################################################################

	(function() {

		var ID_PRESERVE_AREA = "sap-ui-preserve",
			ID_STATIC_AREA = "sap-ui-static", // to be kept in sync with Core!
			ATTR_PRESERVE_MARKER = "data-sap-ui-preserve",
			ATTR_UI_AREA_MARKER = "data-sap-ui-area";

		function getPreserveArea() {
			var $preserve = jQuery.sap.byId(ID_PRESERVE_AREA);
			if ($preserve.length === 0) {
				$preserve = jQuery("<DIV/>",{"aria-hidden":"true",id:ID_PRESERVE_AREA}).
					addClass("sapUiHidden").addClass("sapUiForcedHidden").css("width", "0").css("height", "0").css("overflow", "hidden").
					appendTo(document.body);
			}
			return $preserve;
		}

		/**
		 * Create a placeholder node for the given node (which must have an ID) and insert it before the node
		 */
		function makePlaceholder(node) {
			jQuery("<DIV/>", { id: sap.ui.core.RenderPrefixes.Dummy + node.id}).addClass("sapUiHidden").insertBefore(node);
		}

		/**
		 * Collects descendants of the given root node that need to be preserved before the root node
		 * is wiped out. The "to-be-preserved" nodes are moved to a special, hidden 'preserve' area.
		 *
		 * A node is declared "to-be-preserved" when it has the <code>data-sap-ui-preserve</code>
		 * attribute set. When the optional parameter <code>bPreserveNodesWithId</code> is set to true,
		 * then nodes with an id are preserved as well and their <code>data-sap-ui-preserve</code> attribute
		 * is set automatically. This option is used by UIAreas when they render for the first time and
		 * simplifies the handling of predefined HTML content in a web page.
		 *
		 * The "to-be-preserved" nodes are searched with a depth first search and moved to the 'preserve'
		 * area in the order that they are found. So for direct siblings the order should be stable.
		 *
		 * @param {Element} oRootNode to search for "to-be-preserved" nodes
		 * @param {boolean} [bPreserveRoot=false] whether to preserve the root itself
		 * @param {boolean} [bPreserveNodesWithId=false] whether to preserve nodes with an id as well
		 * @public
		 * @static
		 */
		RenderManager.preserveContent = function(oRootNode, bPreserveRoot, bPreserveNodesWithId) {
			jQuery.sap.assert(typeof oRootNode === "object" && oRootNode.ownerDocument == document, "oRootNode must be a DOM element");

			sap.ui.getCore().getEventBus().publish("sap.ui","__preserveContent", { domNode : oRootNode});

			var $preserve = getPreserveArea();

			function check(candidate) {

				// don't process the preserve area or the static area
				if ( candidate.id === ID_PRESERVE_AREA || candidate.id === ID_STATIC_AREA ) {
					return;
				}

				if ( candidate.hasAttribute(ATTR_PRESERVE_MARKER) )  { // node is marked with the preserve marker
					// when the current node is the root node then we're doing a single control rerendering
					if ( candidate === oRootNode ) {
						makePlaceholder(candidate);
					}
					$preserve.append(candidate);
				} else if ( bPreserveNodesWithId && candidate.id ) {
					RenderManager.markPreservableContent(jQuery(candidate), candidate.id);
					$preserve.append(candidate);
					return;
				}

				// don't dive into nested UIAreas. They are preserved together with any preserved parent (e.g. HTML control)
				if ( !candidate.hasAttribute(ATTR_UI_AREA_MARKER) ) {
					var next = candidate.firstChild;
					while ( next ) {
						// determine nextSibiling before checking the candidate because
						// a move to the preserveArea will modify the sibling relationship!
						candidate = next;
						next = next.nextSibling;
						if ( candidate.nodeType === 1 /* Node.ELEMENT */ ) {
							check(candidate);
						}
					}
				}

			}

			jQuery.sap.measure.start(oRootNode.id + "---preserveContent","preserveContent for " + oRootNode.id, ["rendering","preserve"]);
			if ( bPreserveRoot ) {
				check(oRootNode);
			} else {
				jQuery(oRootNode).children().each(function(i,oNode) {
					check(oNode);
				});
			}
			jQuery.sap.measure.end(oRootNode.id + "---preserveContent");
		};

		/**
		 * Searches "to-be-preserved" nodes for the given control id.
		 *
		 * @param {string} sId control id to search content for.
		 * @return {jQuery} a jQuery collection representing the found content
		 * @public
		 * @static
		 */
		RenderManager.findPreservedContent = function(sId) {
			jQuery.sap.assert(typeof sId === "string", "sId must be a string");
			var $preserve = getPreserveArea(),
				$content = $preserve.children("[" + ATTR_PRESERVE_MARKER + "='" + sId.replace(/(:|\.)/g,'\\$1') + "']");
			return $content;
		};

		/**
		 * Marks the given content as "to-be-preserved" for a control with the given id.
		 * When later on the content has been preserved, it can be found by giving the same id.
		 *
		 * @param {jQuery} $content a jQuery collection of DOM objects to be marked
		 * @param {string} sId id of the control to associate the content with
		 * @static
		 */
		RenderManager.markPreservableContent = function($content, sId) {
			$content.attr(ATTR_PRESERVE_MARKER, sId);
		};

		/**
		 * Checks whether the given DOM node is part of the 'preserve' area.
		 *
		 * @param {Element} oDomNode
		 * @return {boolean} whether node is part of 'preserve' area
		 * @private
		 * @static
		 */
		RenderManager.isPreservedContent = function(oDomNode) {
			return ( oDomNode && oDomNode.getAttribute(ATTR_PRESERVE_MARKER) && oDomNode.parentNode && oDomNode.parentNode.id == ID_PRESERVE_AREA );
		};

		/**
		 * Returns the hidden area reference belonging to this window instance.
		 *
		 * @return {Element} the hidden area reference belonging to this core instance.
		 * @public
		 * @static
		 */
		RenderManager.getPreserveAreaRef = function() {
			return getPreserveArea()[0];
		};

		var ATTR_INLINE_TEMPLATE_MARKER = "data-sap-ui-template";

		/**
		 * Marks the given content as "inline template".
		 *
		 * @param {jQuery} $content a jQuery collection of DOM objects to be marked
		 * @private
		 * @static
		 */
		RenderManager.markInlineTemplate = function($content) {
			$content.attr(ATTR_INLINE_TEMPLATE_MARKER, "");
		};

		/**
		 * Checks whether the given DOM node is an 'inline template' area.
		 *
		 * @param {Element} oDomNode
		 * @return {boolean} whether node is an 'inline template' area
		 * @private
		 * @static
		 */
		RenderManager.isInlineTemplate = function(oDomNode) {
			return ( oDomNode && oDomNode.hasAttribute(ATTR_INLINE_TEMPLATE_MARKER) );
		};

	}());


	//#################################################################################################
	// Methods for 'Buffered writer' functionality... (all public)
	// i.e. used methods in render-method of Renderers
	//#################################################################################################

	/**
	 * Write the given texts to the buffer
	 * @param {...string|number} sText (can be a number too)
	 * @return {sap.ui.core.RenderManager} this render manager instance to allow chaining
	 * @public
	 * @SecSink {*|XSS}
	 */
	RenderManager.prototype.write = function(/** string|number */ sText /* ... */) {
		jQuery.sap.assert(( typeof sText === "string") || ( typeof sText === "number"), "sText must be a string or number");
		this.aBuffer.push.apply(this.aBuffer, arguments);
		return this;
	};

	/**
	 * Escape text for HTML and write it to the buffer
	 * @param {string} sText
	 * @param {boolean} bLineBreaks Whether to convert linebreaks into <br> tags
	 * @return {sap.ui.core.RenderManager} this render manager instance to allow chaining
	 * @public
	 */
	RenderManager.prototype.writeEscaped = function(/** string */ sText, bLineBreaks) {
		jQuery.sap.assert( typeof sText === "string", "sText must be a string");
		sText = jQuery.sap.encodeHTML(sText);
		if (bLineBreaks) {
			sText = sText.replace(/&#xa;/g, "<br>");
		}
		this.aBuffer.push(sText);
		return this;
	};


	/**
	 * @param {string} sKey
	 * @deprecated Not implemented - DO NOT USE
	 * @public
	 */
	RenderManager.prototype.translate = function(sKey) {
		// TODO
	};

	/**
	 * @deprecated Not implemented - DO NOT USE
	 * @return {sap.ui.core.RenderManager} this render manager instance to allow chaining
	 * @public
	 */
	RenderManager.prototype.writeAcceleratorKey = function() {
		/*
		if (bAlt && !bCtrl && !bArrowKey) {
			// Keyboard helper provides means for visualizing access keys.
			// keydown modifies some CSS rule for showing underlines
			// <span><u class="sapUiAccessKey">H</u>elp me</span>
			UCF_KeyboardHelper.showAccessKeys();
		}
		*/
		return this;
	};

	/**
	 * Adds a style property to the style collection if the value is not empty or null
	 * The style collection is flushed if it is written to the buffer using {@link #writeStyle}
	 *
	 * @param {string} sName name of the CSS property to write
	 * @param {string|float|int} value value to write
	 * @return {sap.ui.core.RenderManager} this render manager instance to allow chaining
	 * @public
	 * @SecSink {0 1|XSS} Styles are written to HTML without validation
	 */
	RenderManager.prototype.addStyle = function(sName, value) {
		jQuery.sap.assert(typeof sName === "string", "sName must be a string");
		if (value !== undefined && value !== null) {
			jQuery.sap.assert((typeof value === "string" || typeof value === "number"), "value must be a string or number");
			var oStyle = this.aStyleStack[this.aStyleStack.length - 1];
			if (!oStyle.aStyle) {
				oStyle.aStyle = [];
			}
			oStyle.aStyle.push(sName + ":" + value);
		}
		return this;
	};

	/**
	 * Writes and flushes the style collection
	 * @return {sap.ui.core.RenderManager} this render manager instance to allow chaining
	 * @public
	 */
	RenderManager.prototype.writeStyles = function() {
		var oStyle = this.aStyleStack[this.aStyleStack.length - 1];
		if (oStyle.aStyle) {
			this.write(" style=\"" + oStyle.aStyle.join(";") + "\" ");
		}
		oStyle.aStyle = null;
		return this;
	};

	/**
	 * Adds a class to the class collection if the name is not empty or null.
	 * The class collection is flushed if it is written to the buffer using {@link #writeClasses}
	 *
	 * @param {string} sName name of the class to be added; null values are ignored
	 * @return {sap.ui.core.RenderManager} this render manager instance to allow chaining
	 * @public
	 * @SecSink {0|XSS} Classes are written to HTML without validation
	 */
	RenderManager.prototype.addClass = function(sName) {
		if (sName) {
			jQuery.sap.assert(typeof sName === "string", "sName must be a string");
			var oStyle = this.aStyleStack[this.aStyleStack.length - 1];
			if (!oStyle.aClasses) {
				oStyle.aClasses = [];
			}
			oStyle.aClasses.push(sName);
		}
		return this;
	};

	/**
	 * Writes and flushes the class collection (all CSS classes added by "addClass()" since the last flush).
	 * Also writes the custom style classes added by the application with "addStyleClass(...)". Custom classes are
	 * added by default from the currently rendered control. If an oElement is given, this Element's custom style
	 * classes are added instead. If oElement === false, no custom style classes are added.
	 *
	 * @param {sap.ui.core.Element | boolean} [oElement] an Element from which to add custom style classes (instead of adding from the control itself)
	 * @return {sap.ui.core.RenderManager} this render manager instance to allow chaining
	 * @public
	 */
	RenderManager.prototype.writeClasses = function(oElement) {
		jQuery.sap.assert(!oElement || typeof oElement === "boolean" || oElement instanceof sap.ui.core.Element, "oElement must be empty, a boolean, or a sap.ui.core.Element");
		var oStyle = this.aStyleStack[this.aStyleStack.length - 1];

		// Custom classes are added by default from the currently rendered control. If an oElement is given, this Element's custom style
		// classes are added instead. If oElement === false, no custom style classes are added.
		var aCustomClasses;
		if (oElement) {
			aCustomClasses = oElement.aCustomStyleClasses;
		} else if (oElement === false) {
			aCustomClasses = [];
		} else {
			aCustomClasses = oStyle.aCustomStyleClasses;
	}

		if (oStyle.aClasses || aCustomClasses) {
			var aClasses = [].concat(oStyle.aClasses || [], aCustomClasses || []);
			aClasses.sort();
			aClasses = jQuery.map(aClasses, function(n, i){
				return (i == 0 || n != aClasses[i - 1]) ? n : null;
			});
			this.write(" class=\"", aClasses.join(" "), "\" ");
		}

		if (!oElement) {
			oStyle.aCustomStyleClasses = null;
		}
		oStyle.aClasses = null;
		return this;
	};

	/**
	 * Writes the controls data into the HTML.
	 * Control Data consists at least of the id of a control
	 * @param {sap.ui.core.Control} oControl the control whose identifying information should be written to the buffer
	 * @return {sap.ui.core.RenderManager} this render manager instance to allow chaining
	 * @public
	 */
	RenderManager.prototype.writeControlData = function(oControl) {
		jQuery.sap.assert(oControl && oControl instanceof sap.ui.core.Control, "oControl must be a sap.ui.core.Control");
		this.writeElementData(oControl);
		return this;
	};

	/**
	 * Writes necessary invisible control/element placeholder data into the HTML.
	 *
	 * Controls should only use this method if they can't live with the standard 'visible=false' implementation of the RenderManager which
	 * renders dummy HTMLSpanElement for better re-rendering performance. Even though HTML5 error tolerance accepts this for most of the cases and
	 * these dummy elements are not in the render tree of the Browser, controls may need to generate a valid and semantic HTML output when the
	 * rendered HTMLSpanElement is not an allowed element(e.g. &lt;span&gt; element within the &lt;tr&gt; or &lt;li&gt; group).
	 *
	 * The caller needs to start an opening HTML tag, then call this method, then complete the opening and closing tag.
	 * <pre>
	 * oRenderManager.write("<tr");
	 * oRenderManager.writeInvisiblePlaceholderData(oControl);
	 * oRenderManager.write("></tr>");
	 * </pre>
	 *
	 * @param {sap.ui.core.Element} oElement an instance of sap.ui.core.Element
	 * @return {sap.ui.core.RenderManager} this render manager instance to allow chaining
	 * @protected
	 */
	RenderManager.prototype.writeInvisiblePlaceholderData = function(oElement) {
		jQuery.sap.assert(oElement instanceof sap.ui.core.Element, "oElement must be an instance of sap.ui.core.Element");

		var sPlaceholderId = RenderManager.createInvisiblePlaceholderId(oElement),
			sPlaceholderHtml = ' ' +
				'id="' + sPlaceholderId + '" ' +
				'class="sapUiHiddenPlaceholder" ' +
				'data-sap-ui="' + sPlaceholderId + '" ' +
				'style="display: none;"' +
				'aria-hidden="true" ';

		this.write(sPlaceholderHtml);
		return this;
	};

	/**
	 * Writes the elements data into the HTML.
	 * Element Data consists at least of the id of a element
	 * @param {sap.ui.core.Element} oElement the element whose identifying information should be written to the buffer
	 * @return {sap.ui.core.RenderManager} this render manager instance to allow chaining
	 * @public
	 */
	RenderManager.prototype.writeElementData = function(oElement) {
		jQuery.sap.assert(oElement && oElement instanceof sap.ui.core.Element, "oElement must be a sap.ui.core.Element");
		var sId = oElement.getId();
		if (sId) {
			this.writeAttribute("id", sId).writeAttribute("data-sap-ui", sId);
		}
		var aData = oElement.getCustomData();
		var l = aData.length;
		for (var i = 0; i < l; i++) {
			var oCheckResult = aData[i]._checkWriteToDom(oElement);
			if (oCheckResult) {
				this.writeAttributeEscaped(oCheckResult.key, oCheckResult.value);
			}
		}
		return this;
	};

	/**
	 * Writes the attribute and its value into the HTML
	 * @param {string} sName the name of the attribute
	 * @param {string | number | boolean} value the value of the attribute
	 * @return {sap.ui.core.RenderManager} this render manager instance to allow chaining
	 * @public
	 * @SecSink {0 1|XSS} Attributes are written to HTML without validation
	 */
	RenderManager.prototype.writeAttribute = function(sName, value) {
		jQuery.sap.assert(typeof sName === "string", "sName must be a string");
		jQuery.sap.assert(typeof value === "string" || typeof value === "number" || typeof value === "boolean", "value must be a string, number or boolean");
		this.write(" ", sName, "=\"", value, "\"");
		return this;
	};

	/**
	 * Writes the attribute and its value into the HTML
	 *
	 * The value is properly escaped to avoid XSS attacks.
	 *
	 * @param {string} sName the name of the attribute
	 * @param {any} vValue the value of the attribute
	 * @return {sap.ui.core.RenderManager} this render manager instance to allow chaining
	 * @public
	 * @SecSink {0|XSS}
	 */
	RenderManager.prototype.writeAttributeEscaped = function(sName, vValue) {
		// writeAttribute asserts
		this.writeAttribute(sName, jQuery.sap.encodeHTML(String(vValue)));
		return this;
	};

	/**
	 * Writes the accessibility state (see WAI-ARIA specification) of the provided element into the HTML
	 * based on the element's properties and associations.
	 *
	 * The ARIA properties are only written when the accessibility feature is activated in the UI5 configuration.
	 *
	 * The following properties/values to ARIA attribute mappings are done (if the element does have such properties):
	 * <code>editable===false</code> => <code>aria-readonly="true"</code>
	 * <code>enabled===false</code> => <code>aria-disabled="true"</code>
	 * <code>visible===false</code> => <code>aria-hidden="true"</code>
	 * <code>required===true</code> => <code>aria-required="true"</code>
	 * <code>selected===true</code> => <code>aria-selected="true"</code>
	 * <code>checked===true</code> => <code>aria-checked="true"</code>
	 *
	 * In case of the required attribute also the Label controls which referencing the given element in their 'for' relation
	 * are taken into account to compute the <code>aria-required</code> attribute.
	 *
	 * Additionally the association <code>ariaDescribedBy</code> and <code>ariaLabelledBy</code> are used to write
	 * the id lists of the ARIA attributes <code>aria-describedby</code> and <code>aria-labelledby</code>.
	 *
	 * Label controls which referencing the given element in their 'for' relation are automatically added to the
	 * <code>aria-labelledby</code> attributes.
	 *
	 * Note: This function is only a heuristic of a control property to ARIA attribute mapping. Control developers
	 * have to check whether it fullfills their requirements. In case of problems (for example the RadioButton has a
	 * <code>selected</code> property but must provide an <code>aria-checked</code> attribute) the auto-generated
	 * result of this function can be influenced via the parameter <code>mProps</code> as described below.
	 *
	 * The parameter <code>mProps</code> can be used to either provide additional attributes which should be added and/or
	 * to avoid the automatic generation of single ARIA attributes. The 'aria-' prefix will be prepended automatically to the keys
	 * (Exception: Attribute 'role' does not get the prefix 'aria-').
	 *
	 * Examples:
	 * <code>{hidden : true}</code> results in <code>aria-hidden="true"</code> independent of the precense or absence of
	 * the visibility property.
	 * <code>{hidden : null}</code> ensures that no <code>aria-hidden</code> attribute is written independent of the precense
	 * or absence of the visibility property.
	 * The function behaves in the same way for the associations <code>ariaDescribedBy</code> and <code>ariaLabelledBy</code>.
	 * To append additional values to the auto-generated <code>aria-describedby</code> and <code>aria-labelledby</code> attributes
	 * the following format can be used:
	 * <code>{describedby : {value: "id1 id2", append: true}}</code> => <code>aria-describedby="ida idb id1 id2"</code> (assuming that "ida idb"
	 * is the auto-generated part based on the association <code>ariaDescribedBy</code>).
	 *
	 * @param {sap.ui.core.Element}
	 *            [oElement] the element whose accessibility state should be rendered
	 * @param {Object}
	 *            [mProps] a map of properties that should be added additionally or changed.
	 * @return {sap.ui.core.RenderManager} this render manager instance to allow chaining
	 * @public
	 */
	RenderManager.prototype.writeAccessibilityState = function(oElement, mProps) {
		if (!sap.ui.getCore().getConfiguration().getAccessibility()) {
			return this;
		}

		if (arguments.length == 1 && !(oElement instanceof sap.ui.core.Element)) {
			mProps = oElement;
			oElement = null;
		}

		var mAriaProps = {};

		if (oElement != null) {
			var oMetadata = oElement.getMetadata();

			var addACCForProp = function(sElemProp, sACCProp, oVal){
				var oProp = oMetadata.getProperty(sElemProp);
				if (oProp && oElement[oProp._sGetter]() === oVal) {
					mAriaProps[sACCProp] = "true";
				}
			};

			var addACCForAssoc = function(sElemAssoc, sACCProp){
				var oAssoc = oMetadata.getAssociation(sElemAssoc);
				if (oAssoc && oAssoc.multiple) {
					var aIds = oElement[oAssoc._sGetter]();
					if (sElemAssoc == "ariaLabelledBy") {
						var aLabelIds = sap.ui.core.LabelEnablement.getReferencingLabels(oElement);
						var iLen = aLabelIds.length;
						if (iLen) {
							var aFilteredLabelIds = [];
							for (var i = 0; i < iLen; i++) {
								if (jQuery.inArray(aLabelIds[i], aIds) < 0) {
									aFilteredLabelIds.push(aLabelIds[i]);
								}
							}
							aIds = aFilteredLabelIds.concat(aIds);
						}
					}

					if (aIds.length > 0) {
						mAriaProps[sACCProp] = aIds.join(" ");
					}
				}
			};

			addACCForProp("editable", "readonly", false);
			addACCForProp("enabled", "disabled", false);
			addACCForProp("visible", "hidden", false);
			if (sap.ui.core.LabelEnablement.isRequired(oElement)) {
				mAriaProps["required"] = "true";
			}
			addACCForProp("selected", "selected", true);
			addACCForProp("checked", "checked", true);
			addACCForAssoc("ariaDescribedBy", "describedby");
			addACCForAssoc("ariaLabelledBy", "labelledby");
		}

		if (mProps) {
			var checkValue = function(v){
				var type = typeof (v);
				return v === null || v === "" || type === "number" || type === "string" || type === "boolean";
			};

			var prop = {};
			var x, val, autoVal;

			for (x in mProps) {
				val = mProps[x];
				if (checkValue(val)) {
					prop[x] = val;
				} else if (typeof (val) === "object" && checkValue(val.value)) {
					autoVal = "";
					if (val.append && (x === "describedby" || x === "labelledby")) {
						autoVal = mAriaProps[x] ? mAriaProps[x] + " " : "";
					}
					prop[x] = autoVal + val.value;
				}
			}

			//The auto-generated values above can be overridden or reset (via null)
			jQuery.extend(mAriaProps, prop);
		}

		// allow parent (e.g. FormElement) to overwrite or enhance aria attributes
		if (oElement instanceof sap.ui.core.Element && oElement.getParent() && oElement.getParent().enhanceAccessibilityState) {
			oElement.getParent().enhanceAccessibilityState(oElement, mAriaProps);
		}

		for (var p in mAriaProps) {
			if (mAriaProps[p] != null && mAriaProps[p] !== "") { //allow 0 and false but no null, undefined or empty string
				this.writeAttributeEscaped(p === "role" ? p : "aria-" + p, mAriaProps[p]);
			}
		}

		return this;
	};


	/**
	 * Writes either an img tag for normal URI or an span tag with needed properties for icon URI.
	 *
	 * Additional classes and attributes can be added to the tag by given the second and third parameter.
	 * All of the given attributes are escaped for security consideration.
	 *
	 * when img tag is rendered, the following two attributes are added by default which can be overwritten by the provided mAttributes parameter:
	 * 1. role: presentation
	 * 2. alt: ""
	 *
	 * @param {sap.ui.core.URI} sURI is the URI of an image or an icon registered in sap.ui.core.IconPool.
	 * @param {array|string} aClasses are additional classes that are added to the rendered tag.
	 * @param {object} mAttributes are additional attributes that are added to the rendered tag.
	 * @returns {sap.ui.core.RenderManager} this render manager instance to allow chaining
	 */
	RenderManager.prototype.writeIcon = function(sURI, aClasses, mAttributes){
		jQuery.sap.require("sap.ui.core.IconPool");

		var bIconURI = sap.ui.core.IconPool.isIconURI(sURI),
			sStartTag = bIconURI ? "<span " : "<img ",
			sClasses, sProp, oIconInfo, mDefaultAttributes;

		if (typeof aClasses === "string") {
			aClasses = [aClasses];
		}

		if (bIconURI) {
			oIconInfo = sap.ui.core.IconPool.getIconInfo(sURI);

			if (!oIconInfo) {
				jQuery.sap.log.error("An unregistered icon: " + sURI + " is used in sap.ui.core.RenderManager's writeIcon method.");
				return this;
			}

			if (!aClasses) {
				aClasses = [];
			}
			aClasses.push("sapUiIcon");
			if (!oIconInfo.suppressMirroring) {
				aClasses.push("sapUiIconMirrorInRTL");
			}
		}

		this.write(sStartTag);

		if (jQuery.isArray(aClasses) && aClasses.length) {
			sClasses = aClasses.join(" ");
			this.write("class=\"" + sClasses + "\" ");
		}

		if (bIconURI) {
			mDefaultAttributes = {
				"data-sap-ui-icon-content": oIconInfo.content,
				"role": "presentation",
				"aria-label": oIconInfo.text || oIconInfo.name,
				"title": oIconInfo.text || oIconInfo.name
			};

			this.write("style=\"font-family: " + oIconInfo.fontFamily + ";\" ");
		} else {
			mDefaultAttributes = {
				role: "presentation",
				alt: "",
				src: sURI
			};
		}

		mAttributes = jQuery.extend(mDefaultAttributes, mAttributes);

		if (typeof mAttributes === "object") {
			for (sProp in mAttributes) {
				if (mAttributes.hasOwnProperty(sProp) && mAttributes[sProp] !== null) {
					this.writeAttributeEscaped(sProp, mAttributes[sProp]);
				}
			}
		}

		this.write(bIconURI ? "></span>" : "/>");

		return this;
	};

	/**
	 * Determines whether Dom Patching is enabled or not
	 * @returns {Boolean}
	 * @private
	 */
	RenderManager.prototype._isDomPathingEnabled = function() {
		if (this._bDomPathing === undefined) {
			this._bDomPathing = this.getConfiguration().getDomPatching();
			if (this._bDomPathing) {
				jQuery.sap.log.warning("DOM Patching is enabled: This feature should be used only for the testing purposes!");
			}
		}

		return this._bDomPathing;
	};

	/**
	 * Renders an invisible dummy element for controls that have set their visible-property to
	 * false. In case the control has its own visible property, it has to handle rendering itself.
	 */
	var InvisibleRenderer = {
		/**
		 * Renders the invisible dummy element
		 *
		 * @param {sap.ui.core.RenderManager} [oRm] The RenderManager instance
		 * @param {sap.ui.core.Control} [oControl] The instance of the invisible control
		 */
		render: function(oRm, oControl) {
			oRm.write("<span");
			oRm.writeInvisiblePlaceholderData(oControl);
			oRm.write("></span>");
		}
	};


	return RenderManager;

});
