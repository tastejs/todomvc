/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides class sap.ui.dt.DesignTime.
sap.ui.define([
	'sap/ui/base/ManagedObject',
	'sap/ui/dt/ElementOverlay',
	'sap/ui/dt/OverlayRegistry',
	'sap/ui/dt/Selection',
	'sap/ui/dt/DesignTimeMetadata',
	'sap/ui/dt/ElementUtil',
	'./library'
],
function(ManagedObject, ElementOverlay, OverlayRegistry, Selection, DesignTimeMetadata, ElementUtil) {
	"use strict";

	/**
	 * Constructor for a new DesignTime.
	 *
	 * @param {string} [sId] id for the new object, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new object
	 *
	 * @class
	 * The DesignTime allows to create a set of Overlays above the root elements and
	 * their public children and manage theire events.
	 * @extends sap.ui.core.ManagedObject
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @private
	 * @since 1.30
	 * @alias sap.ui.dt.DesignTime
	 * @experimental Since 1.30. This class is experimental and provides only limited functionality. Also the API might be changed in future.
	 */
	var DesignTime = ManagedObject.extend("sap.ui.dt.DesignTime", /** @lends sap.ui.dt.DesignTime.prototype */ {
		metadata : {
			// ---- object ----

			// ---- control specific ----
			library : "sap.ui.dt",
			properties : {
				/**
				 * Selection mode which should be used for overlays selection
				 */
				selectionMode : {
					type : "sap.ui.dt.SelectionMode",
					defaultValue : sap.ui.dt.SelectionMode.Single
				},

				/**
				 * DesignTime metadata for classses to use with overlays (will overwrite default DTMetadata fields)
				 * should have a map structure { "sClassName" : oDTMetadata, ... }
				 */
				 designTimeMetadata : {
					type : "object"
				 }
			},
			associations : {
				/**
				 * Root elements to create overlays for
				 */
				rootElements : {
					type : "sap.ui.core.Element",
					multiple : true
				}
			},
			aggregations : {
				/**
				 * Plugins to use with a design time
				 */
				plugins : {
					type : "sap.ui.dt.Plugin",
					multiple : true
				}
			},
			events : {
				/**
				 * Event fired when an ElementOverlay is created
				 */
				overlayCreated : {
					parameters : {
						ElementOverlay : { type : "sap.ui.dt.ElementOverlay" }
					}
				},
				/**
				 * Event fired when an ElementOverlay is destroyed
				 */
				overlayDestroyed : {
					parameters : {
						ElementOverlay : { type : "sap.ui.dt.ElementOverlay" }
					}
				},
				/**
				 * Event fired when an overlays selection is changed
				 */
				selectionChange : {
					parameters : {
						selection : { type : "sap.ui.dt.ElementOverlay[]" }
					}
				}
			}
		}
	});

	/**
	 * Called when the DesignTime is initialized
	 * @protected
	 */
	DesignTime.prototype.init = function() {
		this._oSelection = this.createSelection();
		this._oSelection.attachEvent("change", function(oEvent) {
			this.fireSelectionChange({selection: oEvent.getParameter("selection")});
		}, this);
	};

	/**
	 * Called when the DesignTime is destroyed
	 * @protected
	 */
	DesignTime.prototype.exit = function() {
		this._destroyAllOverlays();
		this._oSelection.destroy();
	};

	/**
	 * Creates an instance of a Selection to handle the overlays selection inside of the DesignTime
	 * @return {sap.ui.dt.Selection} the instance of the Selection
	 * @protected
	 */
	DesignTime.prototype.createSelection = function() {
		return new Selection();
	};

	/**
	 * Returns array with current selected overlays
	 * @return {sap.ui.dt.ElementOverlay[]} selected overlays
	 * @public
	 */
	DesignTime.prototype.getSelection = function() {
		return this._oSelection.getSelection();
	};

	/**
	 * Sets selection mode to be used in the Selection inside of the DesignTime
	 * @param {sap.ui.dt.SelectionMode} oMode a selection mode to be used with the Selection
	 * @return {sap.ui.dt.DesignTime} this
	 * @public
	 */
	DesignTime.prototype.setSelectionMode = function(oMode) {
		this.setProperty("selectionMode", oMode);
		this._oSelection.setMode(oMode);

		return this;
	};

	/**
	 * Returns all plugins used with the DesignTime
	 * @return {sap.ui.dt.Plugin[]} an array of plugins
	 * @protected
	 */
	DesignTime.prototype.getPlugins = function() {
		return this.getAggregation("plugins") || [];
	};

	/**
	 * Adds new plugin to use with the DesignTime
	 * @param {sap.ui.dt.Plugin} oPlugin to add
	 * @return {sap.ui.dt.DesignTime} this
	 * @protected
	 */
	DesignTime.prototype.addPlugin = function(oPlugin) {
		oPlugin.setDesignTime(this);

		this.addAggregation("plugins", oPlugin);

		return this;
	};

	/**
	 * Inserts new plugin to use with the DesignTime at a defined position
	 * @param {sap.ui.dt.Plugin} oPlugin to insert
	 * @param {integer} iIndex a position to insert the plugin at
	 * @return {sap.ui.dt.DesignTime} this
	 * @protected
	 */
	DesignTime.prototype.insertPlugin = function(oPlugin, iIndex) {
		oPlugin.setDesignTime(this);

		this.insertAggregation("plugins", oPlugin, iIndex);

		return this;
	};

	/**
	 * Removes a plugin from the DesignTime
	 * @param {sap.ui.dt.Plugin} oPlugin to remove
	 * @return {sap.ui.dt.DesignTime} this
	 * @protected
	 */
	DesignTime.prototype.removePlugin = function(oPlugin) {
		this.getPlugins().forEach(function(oCurrentPlugin) {
			if (oCurrentPlugin === oPlugin) {
				oPlugin.setDesignTime(null);
				return;
			}
		});

		this.removeAggregation("plugins", oPlugin);

		return this;
	};

	/**
	 * Removes all plugins from the DesignTime
	 * @return {sap.ui.dt.DesignTime} this
	 * @protected
	 */
	DesignTime.prototype.removeAllPlugins = function() {
		this.getPlugins().forEach(function(oPlugin) {
			oPlugin.setDesignTime(null);
		});

		this.removeAllAggregation("plugins");

		return this;
	};

	/**
	 * Returns all root elements from the DesignTime
	 * @return {sap.ui.dt.ElementOverlay[]} selected overlays
	 * @protected
	 */
	DesignTime.prototype.getRootElements = function() {
		return this.getAssociation("rootElements") || [];
	};

	/**
	 * Returns a designTimeMetadata
	 * @return {object} designTimeMetadata
	 * @protected
	 */
	DesignTime.prototype.getDesignTimeMetadata = function() {
		return this.getProperty("designTimeMetadata") || {};
	};

	/**
	 * Returns a designTimeMetadata for the element or className
	 * @param {string|sap.ui.core.Element}
	 * @return {object} designTimeMetadata for a specific element or className
	 * @protected
	 */
	DesignTime.prototype.getDesignTimeMetadataFor = function(vElement) {
		var sClassName = vElement;
		var mDTMetadata = this.getDesignTimeMetadata();
		if (vElement.getMetadata) {
			sClassName = vElement.getMetadata()._sClassName;
		}
		return mDTMetadata[sClassName];
	};

	/**
	 * Adds a root element to the DesignTime and creates overlays for it and it's public descendants
	 * @param {string|sap.ui.core.Element} vRootElement element or elemet's id
	 * @return {sap.ui.dt.DesignTime} this
	 * @protected
	 */
	DesignTime.prototype.addRootElement = function(vRootElement) {
		this.addAssociation("rootElements", vRootElement);

		this.createOverlayFor(ElementUtil.getElementInstance(vRootElement));

		return this;
	};

	/**
	 * Removes a root element from the DesignTime and destroys overlays for it and it's public descendants
	 * @param {string|sap.ui.core.Element} vRootElement element or elemet's id
	 * @return {sap.ui.dt.DesignTime} this
	 * @protected
	 */
	DesignTime.prototype.removeRootElement = function(vRootElement) {
		this.removeAssociation("rootElements", vRootElement);

		this._destroyOverlaysForElement(ElementUtil.getElementInstance(vRootElement));

		return this;
	};

	/**
	 * Removes all root elements from the DesignTime and destroys overlays for them and theire public descendants
	 * @param {string|sap.ui.core.Element} element or elemet's id
	 * @return {sap.ui.dt.DesignTime} this
	 * @protected
	 */
	DesignTime.prototype.removeAllRootElement = function() {
		this.removeAssociation("rootElements");

		this._destroyAllOverlays();

		return this;
	};


	/**
	 * Creates and returns the created instance of ElementOverlay for an element
	 * @param {string|sap.ui.core.Element} oElement to create ElementOverlay for
	 * @param {object} oDTMetadata to create ElementOverlay with
	 * @return {sap.ui.dt.ElementOverlay} created ElementOverlay
	 * @protected
	 */
	DesignTime.prototype.createOverlay = function(oElement, oDTMetadata) {
		return new ElementOverlay({
			element : oElement,
			designTimeMetadata : oDTMetadata ? new DesignTimeMetadata({data : oDTMetadata}) : null
		});
	};

	/**
	 * Returns an array with all overlays created, registered and handled by the DeignTime
	 * @return {sap.ui.dt.ElementOverlay[]} all overlays created and handled by the DesignTime
	 * @public
	 */
	DesignTime.prototype.getOverlays = function() {
		var aOverlays = [];

		this._iterateAllElements(function(oElement) {
			var oOverlay = OverlayRegistry.getOverlay(oElement);
			if (oOverlay) {
				if (aOverlays.indexOf(oOverlay) === -1) {
					aOverlays.push(oOverlay);
				}
			}
		});

		return aOverlays;
	};

	/**
	 * @param {sap.ui.core.Element} oElement element
	 * @return {sap.ui.dt.ElementOverlay} created ElementOverlay
	 * @private
	 */
	DesignTime.prototype._createOverlay = function(oElement) {
		// check if ElementOverlay for the element already exists before creating the new one
		// (can happen when two aggregations returning the same elements)
		if (!OverlayRegistry.getOverlay(oElement)) {
			// merge the DTMetadata from the DesignTime and from UI5
			var oMetadataFromDesignTime = this.getDesignTimeMetadataFor(oElement);
			var oDTMetadata = ElementUtil.getDesignTimeMetadata(oElement);
			jQuery.extend(true, oDTMetadata, oMetadataFromDesignTime);
			oDTMetadata = oDTMetadata !== {} ? oDTMetadata : null;

			var oOverlay = this.createOverlay(oElement, oDTMetadata);
			oOverlay.attachEvent("elementModified", this._onElementModified, this);
			oOverlay.attachEvent("destroyed", this._onOverlayDestroyed, this);
			oOverlay.attachEvent("selectionChange", this._onOverlaySelectionChange, this);

			this.fireOverlayCreated({overlay : oOverlay});

			return oOverlay;
		}
	};

	/**
	 * Creates ElementOverlay for an element and all public children of the element
	 * @param {sap.ui.core.Element} oElement element
	 * @return {sap.ui.dt.ElementOverlay} created ElementOverlay
	 * @private
	 */
	DesignTime.prototype.createOverlayFor = function(oRootElement) {
		var that = this;
		var oRootOverlay;

		this._iterateRootElementPublicChildren(oRootElement, function(oElement) {
			var oOverlay = that._createOverlay(oElement);
			oRootOverlay = oRootOverlay || oOverlay;
		});

		return oRootOverlay;
	};

	/**
	 * @param {sap.ui.core.Element} oRootElement element
	 * @private
	 */
	DesignTime.prototype._destroyOverlaysForElement = function(oRootElement) {
		this._iterateRootElementPublicChildren(oRootElement, function(oElement) {
			var oOverlay = OverlayRegistry.getOverlay(oElement);
			if (oOverlay) {
				oOverlay.destroy();
			}
		});
	};

	/**
	 * @private
	 */
	DesignTime.prototype._destroyAllOverlays = function() {
		var that = this;

		this._iterateRootElements(function(oRootElement) {
			that._destroyOverlaysForElement(oRootElement);
		});
	};

	/**
	 * @param {sap.ui.baseEvent} oEvent event object
	 * @private
	*/
	DesignTime.prototype._onOverlayDestroyed = function(oEvent) {
		var oOverlay = oEvent.getSource();

		if (oOverlay.getSelected()) {
			this._oSelection.remove(oOverlay);
		}
		this.fireOverlayDestroyed({overlay : oOverlay});
	};

	/**
	 * @param {sap.ui.baseEvent} oEvent event object
	 * @private
	 */
	DesignTime.prototype._onOverlaySelectionChange = function(oEvent) {
		var oOverlay = oEvent.getSource();
		var bSelected = oEvent.getParameter("selected");

		this._oSelection.set(oOverlay, bSelected);
	};

	/**
	 * @param {sap.ui.baseEvent} oEvent event object
	 * @private
	 */
	DesignTime.prototype._onElementModified = function(oEvent) {
		var oParams = oEvent.getParameters();
		if (oParams.type === "addOrSetAggregation" || oParams.type === "insertAggregation") {
			this._onOverlayElementAddAggregation(oParams.value);
		} else if (oParams.type === "setParent") {
			this._onOverlayElementSetParent(oParams.target, oParams.value);
		}
	};

	/**
	 * @param {sap.ui.core.Element} oElement which was added
	 * @private
	 */
	DesignTime.prototype._onOverlayElementAddAggregation = function(oElement) {
		var oOverlay = OverlayRegistry.getOverlay(oElement);
		if (!oOverlay) {
			this.createOverlayFor(oElement);
		}
	};

	/**
	 * @param {sap.ui.core.Element} oElement which parent was changed
	 * @param {sap.ui.core.Element} oParent new parent
	 * @private
	 */
	DesignTime.prototype._onOverlayElementSetParent = function(oElement, oParent) {
		var oOverlay = OverlayRegistry.getOverlay(oElement);
		if (oOverlay && !this._isElementInRootElements(oElement) && !oElement.__bSapUiDtSupressOverlayDestroy) {
			oOverlay.destroy();
		}
	};

	/**
	 * @param {sap.ui.core.Element} oElement to check
	 * @return {boolean} returns if an element is a descendant of any of the root elements
	 * @private
	 */
	DesignTime.prototype._isElementInRootElements = function(oElement) {
		var bFoundAncestor = false;

		this._iterateRootElements(function(oRootElement) {
			if (ElementUtil.hasAncestor(oElement, oRootElement)) {
				bFoundAncestor = true;
				return false;
			}
		});

		return bFoundAncestor;
	};

	/**
	 * @param {function} fnStep function called with every root element
	 * @private
	 */
	DesignTime.prototype._iterateRootElements = function(fnStep) {
		var aRootElements = this.getRootElements();
		aRootElements.forEach(function(sRootElementId) {
			var oRootElement = ElementUtil.getElementInstance(sRootElementId);
			fnStep(oRootElement);
		});
	};

	/**
	 * @param {sap.ui.core.Element} oRootElement to iterate through
	 * @param {function} fnStep function called for an every element which is a descendant of the oRootElement
	 * @private
	 */
	DesignTime.prototype._iterateRootElementPublicChildren = function(oRootElement, fnStep) {
		var aAllPublicElements = ElementUtil.findAllPublicElements(oRootElement);
		aAllPublicElements.forEach(function(oElement) {
			fnStep(oElement);
		});
	};

	/**
	 * @param {function} fnStep function called with every element which is a descendant of any of the root elements
	 * @private
	 */
	DesignTime.prototype._iterateAllElements = function(fnStep) {
		var that = this;

		this._iterateRootElements(function(oRootElement) {
			that._iterateRootElementPublicChildren(oRootElement, fnStep);
		});
	};

	return DesignTime;
}, /* bExport= */ true);