/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides (optional) base class for all renderers
sap.ui.define(['jquery.sap.global', 'sap/ui/core/library'],
	function(jQuery, sapUiCore) {
	"use strict";

	// create shortcuts for enums from sap.ui.core
	var TextAlign = sapUiCore.TextAlign,
		TextDirection = sapUiCore.TextDirection;

	/**
	 * @classdesc Base Class for a Renderer.
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 * @namespace
	 * @public
	 * @alias sap.ui.core.Renderer
	 */
	var Renderer = {
	};

	/**
	 * Helper to create an extend function for the given renderer class.
	 * @param {object} oBaseRenderer the base renderer for which the extend method should be created.
	 * @returns {object} new static renderer class
	 * @private
	 */
	function createExtendFunction(oBaseRenderer) {
		
		return function(sName, oRendererInfo) {
			jQuery.sap.assert(typeof sName === 'string' && sName, 'Renderer.extend must be called with a non-empty name for the new renderer');
			jQuery.sap.assert(oRendererInfo == null || typeof oRendererInfo === 'object', 'oRendererInfo must be an object or can be omitted');
			
			var oChildRenderer = jQuery.sap.newObject(oBaseRenderer);
			oChildRenderer.extend = createExtendFunction(oChildRenderer);
			if ( oRendererInfo ) {
				jQuery.extend(oChildRenderer, oRendererInfo);
			}
			
			// expose the renderer globally 
			jQuery.sap.setObject(sName, oChildRenderer);

			return oChildRenderer;
		};
		
	} 

	/**
	 * New style 'extend' function that will be used to create a subclass of 
	 * Renderer whenever the new signature variant is used for Renderer.extend().
	 * @see sap.ui.core.Renderer.extend
	 * @private
	 */
	var extend = createExtendFunction(Renderer);

	/**
	 * Creates a new static renderer class that extends a given renderer.
	 * 
	 * This method can be used with two signatures that are explained below. 
	 * In both variants, the returned renderer class inherits all properties (methods, fields) 
	 * from the given parent renderer class. Both variants also add an 'extend' method to the 
	 * created renderer class that behaves like the new signature of this <code>Renderer.extend</code> 
	 * method, but creates subclasses of the new class, not of <code>sap.ui.core.Renderer</code>. 
	 * 
	 * <b>New Signature</b><br>
	 * In the new signature variant, two parameters must be given: a qualified name 
	 * for the new renderer (its class name), and an optional object literal that contains 
	 * methods or fields to be added to the new renderer class.
	 *  
	 * This signature has been designed to resemble the class extension mechanism as
	 * provided by {@link sap.ui.base.Object.extend Object.extend}. 
	 * 
	 * <pre>
	 * sap.ui.define(['sap/ui/core/Renderer'], 
	 *     function(Renderer) {
	 *     "use strict";
	 *     
	 *     var LabelRenderer = Renderer.extend('sap.m.LabelRenderer', {
	 *         renderer: function(oRM, oControl) {
	 *             
	 *             renderPreamble(oRM, oControl);
	 *             
	 *             // implementation core renderer logic here
	 *             
	 *             renderPreamble(oRM, oControl);
	 *             
	 *         },
	 *         
	 *         renderPreamble : function(oRM, oControl) {
	 *         ...
	 *         },
	 *         
	 *         renderPostamble : function(oRM, oControl) {
	 *         ...
	 *         }
	 *         
	 *     });
	 *     
	 *     return LabelRenderer;
	 * });
	 * </pre>
	 * 
	 * The extension of Renderers works across multiple levels. A FancyLabelRenderer can
	 * extend the above LabelRenderer:
	 * 
	 * <pre>
	 * sap.ui.define(['sap/m/LabelRenderer'], 
	 *     function(LabelRenderer) {
	 *     "use strict";
	 *
	 *     var FancyLabelRenderer = LabelRenderer.extend('sap.mylib.FancyLabelRenderer', {
	 *         renderer: function(oRM, oControl) {
	 *
	 *             // call base renderer
	 *             LabelRenderer.renderPreamble(oRM, oControl);
	 *
	 *             // ... do your own fancy rendering here
	 *
	 *             // call base renderer again
	 *             LabelRenderer.renderPostamble(oRM, oControl);
	 *         }
	 *     });
	 *
	 *     return FancyLabelRenderer;
	 * });
	 * </pre>
	 * 
	 * <b>Note:</b> the new signature no longer requires the <code>bExport</code> flag to be set for 
	 * the enclosing {@link sap.ui.define} call. The Renderer base classes takes care of the necessary 
	 * global export of the render. This allows Non-SAP developers to write a renderer that complies with 
	 * the documented restriction for <code>sap.ui.define</code> (no use of bExport = true outside 
	 * sap.ui.core projects).
	 * 
	 * <b>Deprecated Signature</b><br>
	 * The deprecated old signature expects just one parameter: a renderer that should be extended.
	 * With that signature the renderer can't be exported globally as the name of the renderer class
	 * is not known. 
	 * 
	 * For compatibility reasons, the class created by the deprecated signature contains a property 
	 * <code>_super</code> that references the parent class. It shouldn't be used by applications / control 
	 * developers as it doesn't work reliably for deeper inheritance chains: if the old variant of 
	 * <code>Renderer.extend</code> is used on two or more levels of the inheritance hierarchy, the 
	 * <code>_super</code> property of the resulting renderer class will always point to the implementation 
	 * of the base renderer of the last call to extend. Instead of using <code>this._super</code>, renderer 
	 * implementations should use the new signature variant and access the base implementation of a method 
	 * via the AMD reference to the base renderer (as shown in the FancyLabelRenderer example above).
	 * 
	 * @param {string|object} vName either the name of the new renderer class (new signature) or the base 
	 *                              renderer to extend (deprecated signature)
	 * @param {object} [oRendererInfo] methods and/or properties that should be added to the new renderer class
	 * @return {object} a new static renderer class that can be enriched further
	 * @public
	 */
	Renderer.extend = function(vName, oRendererInfo) {
		if ( typeof vName === 'string' ) {
			// new call variant with name: create static 'subclass' 
			return extend(vName, oRendererInfo);
		} else {
			// old variant without name: create static 'subclass' of Renderer itself 
			var oChildRenderer = jQuery.sap.newObject(vName);
			oChildRenderer._super = vName;
			oChildRenderer.extend = createExtendFunction(oChildRenderer);
			return oChildRenderer;
		}
	};

	/**
	 * Returns the TextAlignment for the provided configuration.
	 *
	 * @param {sap.ui.core.TextAlign} oTextAlign the text alignment of the Control
	 * @param {sap.ui.core.TextDirection} oTextDirection the text direction of the Control
	 * @returns {string} the actual text alignment that must be set for this environment
	 * @private
	 */
	Renderer.getTextAlign = function(oTextAlign, oTextDirection) {
		var sTextAlign = "",
			bRTL = sap.ui.getCore().getConfiguration().getRTL();

		switch (oTextAlign) {
		case TextAlign.End:
			switch (oTextDirection) {
			case TextDirection.LTR:
				sTextAlign = "right";
				break;
			case TextDirection.RTL:
				sTextAlign = "left";
				break;
			default:
				// this is really only influenced by the SAPUI5 configuration. The browser does not change alignment with text-direction
				sTextAlign = bRTL ? "left" : "right";
				break;
			}
			break;
		case TextAlign.Begin:
			switch (oTextDirection) {
			case TextDirection.LTR:
				sTextAlign = "left";
				break;
			case TextDirection.RTL:
				sTextAlign = "right";
				break;
			default:
				sTextAlign = bRTL ? "right" : "left";
				break;
			}
			break;
		case TextAlign.Right:
			if (!bRTL || oTextDirection == TextDirection.LTR) {
				sTextAlign = "right";
			}
			break;
		case TextAlign.Center:
			sTextAlign = "center";
			break;
		case TextAlign.Left:
			if (bRTL || oTextDirection == TextDirection.RTL) {
				sTextAlign = "left";
			}
			break;
		// no default
		}
		return sTextAlign;
	};

	return Renderer;

}, /* bExport= */ true);
