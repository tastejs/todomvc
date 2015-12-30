/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides class sap.ui.dt.ElementOverlay.
sap.ui.define([
	'jquery.sap.global',
	'sap/ui/dt/Overlay',
	'sap/ui/dt/ControlObserver',
	'sap/ui/dt/ManagedObjectObserver',
	'sap/ui/dt/DesignTimeMetadata',
	'sap/ui/dt/AggregationOverlay',
	'sap/ui/dt/OverlayRegistry',
	'sap/ui/dt/ElementUtil',
	'sap/ui/dt/OverlayUtil',
	'sap/ui/dt/DOMUtil'
],
function(jQuery, Overlay, ControlObserver, ManagedObjectObserver, DesignTimeMetadata, AggregationOverlay, OverlayRegistry, ElementUtil, OverlayUtil, DOMUtil) {
	"use strict";

	/**
	 * Constructor for an ElementOverlay.
	 *
	 * @param {string} [sId] id for the new object, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new object
	 *
	 * @class
	 * The ElementOverlay allows to create an absolute positioned DIV above the associated element.
	 * It also creates AggregationOverlays for every public aggregation of the associated element.
	 * @extends sap.ui.core.Control
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @private
	 * @since 1.30
	 * @alias sap.ui.dt.ElementOverlay
	 * @experimental Since 1.30. This class is experimental and provides only limited functionality. Also the API might be changed in future.
	 */
	var ElementOverlay = Overlay.extend("sap.ui.dt.ElementOverlay", /** @lends sap.ui.dt.ElementOverlay.prototype */ {
		metadata : {

			// ---- object ----

			// ---- control specific ----
			library : "sap.ui.dt",
			properties : {
				/**
				 * Whether the overlay and it's descendants should be visible on a screen
				 * We are overriding Control's property to prevent RenderManager from rendering of an invisible placeholder
				 */
				visible : {
					type : "boolean",
					defaultValue : true
				},
				/**
				 * Whether the ElementOverlay is selected
				 */
				selected : {
					type : "boolean",
					defaultValue : false
				},
				/**
				 * Whether the ElementOverlay is selectable
				 */
				selectable : {
					type : "boolean",
					defaultValue : false
				},
				/**
				 * Whether the ElementOverlay is draggable
				 */
				draggable : {
					type : "boolean",
					defaultValue : false
				},
				/**
				 * Whether the ElementOverlay is editable
				 */
				editable : {
					type : "boolean",
					defaultValue : false
				}
			},
			aggregations : {
				/**
				 * DesignTime metadata for the associated Element
				 */
				designTimeMetadata : {
					type : "sap.ui.dt.DesignTimeMetadata",
					multiple : false
				},
				/**
				 * AggregationOverlays for the public aggregations of the associated Element
				 */
				aggregationOverlays : {
					type : "sap.ui.dt.AggregationOverlay",
					multiple : true
				}
			},
			events : {
				/**
				 * Event fired when the property "Selection" is changed
				 */
				selectionChange : {
					parameters : {
						selected : { type : "boolean" }
					}
				},
				/**
				 * Event fired when the property "Draggable" is changed
				 */
				draggableChange : {
					parameters : {
						draggable : { type : "boolean" }
					}
				},
				/**
				 * Event fired when the property "Selectable" is changed
				 */
				selectableChange : {
					parameters : {
						selectable : { type : "boolean" }
					}
				},
				/**
				 * Event fired when the property "Editable" is changed
				 */
				editableChange : {
					parameters : {
						selected : {
							editable : "boolean"
						}
					}
				},
				/**
				 * Event fired when the associated Element is modified
				 */
				elementModified : {
					parameters : {
						type : { type : "string" },
						value : { type : "any" },
						oldValue : { type : "any" },
						target : { type : "sap.ui.core.Element" }
					}
				}
			}
		}
	});

	/**
	 * Called when the ElementOverlay is initialized
	 * @protected
	 */
	ElementOverlay.prototype.init = function() {
		Overlay.prototype.init.apply(this, arguments);

		this._oDefaultDesignTimeMetadata = null;
		this.placeAt(Overlay.getOverlayContainer());

		// this is needed to prevent UI5 renderManager from removing overlay's node from DOM in a rendering phase
		// see RenderManager.js "this._fPutIntoDom" function
		var oUIArea = this.getUIArea();
		oUIArea._onChildRerenderedEmpty = function() {
			return true;
		};

		this._bVisible = null;
	};

	/**
	 * Called when the ElementOverlay is destroyed
	 * @protected
	 */
	ElementOverlay.prototype.exit = function() {
		Overlay.prototype.exit.apply(this, arguments);

		this._destroyDefaultDesignTimeMetadata();

		var oElement = this.getElementInstance();
		if (oElement) {
			OverlayRegistry.deregister(oElement);
			this._unobserve(oElement);
		} else {
			// element can be destroyed before
			OverlayRegistry.deregister(this._elementId);
		}

		if (!OverlayRegistry.hasOverlays()) {
			Overlay.removeOverlayContainer();
		}

		delete this._bVisible;
		delete this._elementId;
	};

	/**
	 * Sets an associated Element to create an overlay for
	 * @param {string|sap.ui.core.Element} vElement element or element's id
	 * @returns {sap.ui.dt.ElementOverlay} returns this
	 * @public
	 */
	ElementOverlay.prototype.setElement = function(vElement) {
		var oOldElement = this.getElementInstance();
		if (oOldElement instanceof sap.ui.core.Element) {
			OverlayRegistry.deregister(oOldElement);
			this._unobserve(oOldElement);
		}

		this.destroyAggregation("aggregationOverlays");
		this._destroyDefaultDesignTimeMetadata();
		delete this._elementId;

		this.setAssociation("element", vElement);
		// TODO: designTimeMetadata aggregation is NOT ready in this moment... how we can make it consistent?
		this._createAggregationOverlays();

		var oElement = this.getElementInstance();

		this._elementId = oElement.getId();
		OverlayRegistry.register(oElement, this);
		this._observe(oElement);

		var oParentElementOverlay = OverlayUtil.getClosestOverlayFor(oElement);
		if (oParentElementOverlay) {
			oParentElementOverlay.sync();
		}

		return this;
	};

	/**
	 * Returns a DOM reference for the associated Element or null, if it can't be found
	 * @return {Element} DOM element or null
	 * @public
	 */
	ElementOverlay.prototype.getAssociatedDomRef = function() {
		return ElementUtil.getDomRef(this.getElementInstance());
	};

	/**
	 * Returns wether the ElementOverlay is visible
	 * @return {boolean} if the ElementOverlay is visible
	 * @public
	 */
	ElementOverlay.prototype.getVisible = function() {
		if (this._bVisible === null) {
			return this.getDesignTimeMetadata().isVisible();
		} else {
			return this.getProperty("visible");
		}
	};

	/**
	 * Sets wether the ElementOverlay is visible
	 * @param {boolean} bVisible if the ElementOverlay is visible
	 * @returns {sap.ui.dt.ElementOverlay} returns this
	 * @public
	 */
	ElementOverlay.prototype.setVisible = function(bVisible) {
		this.setProperty("visible", bVisible);
		this._bVisible = bVisible;

		return this;
	};

	/**
	 * Sets wether the ElementOverlay is selectable
	 * @param {boolean} bSelectable if the ElementOverlay is selectable
	 * @returns {sap.ui.dt.ElementOverlay} returns this
	 * @public
	 */
	ElementOverlay.prototype.setSelectable = function(bSelectable) {
		if (bSelectable !== this.isSelectable()) {

			if (!bSelectable) {
				this.setSelected(false);
			}

			this.toggleStyleClass("sapUiDtOverlaySelectable", bSelectable);
			this.setProperty("selectable", bSelectable);
			this.fireSelectableChange({selectable : bSelectable});
		}

		return this;
	};

	/**
	 * Sets wether the ElementOverlay is selected and toggles corresponding css class
	 * @param {boolean} bSelected if the ElementOverlay is selected
	 * @param {boolean} bSuppressEvent (internal use only) supress firing "selectionChange" event
	 * @returns {sap.ui.dt.ElementOverlay} returns this
	 * @public
	 */
	ElementOverlay.prototype.setSelected = function(bSelected, bSuppressEvent) {
		if (this.isSelectable() && bSelected !== this.isSelected()) {
			this.setProperty("selected", bSelected);
			this.toggleStyleClass("sapUiDtOverlaySelected", bSelected);

			if (!bSuppressEvent) {
				this.fireSelectionChange({
					selected : bSelected
				});
			}
		}

		return this;
	};

	/**
	 * Sets whether the ElementOverlay is draggable and toggles corresponding css class
	 * @param {boolean} bDraggable if the ElementOverlay is draggable
	 * @returns {sap.ui.dt.ElementOverlay} returns this
	 * @public
	 */
	ElementOverlay.prototype.setDraggable = function(bDraggable) {
		if (this.getDraggable() !== bDraggable) {
			this.toggleStyleClass("sapUiDtOverlayDraggable", bDraggable);

			this.setProperty("draggable", bDraggable);
			this.fireDraggableChange({draggable : bDraggable});
		}

		return this;
	};

	/**
	 * Sets whether the ElementOverlay is editable and toggles corresponding css class
	 * @param {boolean} bEditable if the ElementOverlay is editable
	 * @returns {sap.ui.dt.ElementOverlay} returns this
	 * @public
	 */
	ElementOverlay.prototype.setEditable = function(bEditable) {
		if (this.getEditable() !== bEditable) {
			this.toggleStyleClass("sapUiDtOverlayEditable", bEditable);

			this.setProperty("editable", bEditable);
			this.fireEditableChange({editable : bEditable});
		}

		return this;
	};

	/**
	 * Returns the DesignTime metadata of this ElementOverlay, if no DT metadata exists, creates and returns the default DT metadata object
	 * @return {sap.ui.DesignTimeMetadata} DT metadata of the ElementOverlay
	 * @public
	 */
	ElementOverlay.prototype.getDesignTimeMetadata = function() {
		var oDesignTimeMetadata = this.getAggregation("designTimeMetadata");
		if (!oDesignTimeMetadata && !this._oDefaultDesignTimeMetadata) {
			this._oDefaultDesignTimeMetadata = new DesignTimeMetadata({
				data : ElementUtil.getDesignTimeMetadata(this.getElementInstance())
			});
		}
		return oDesignTimeMetadata || this._oDefaultDesignTimeMetadata;
	};

	/**
	 * Syncs all AggregationOverlays children of this ElementOverlay
	 * To sync an AggregationOverlay means to find all ElementOverlays registered for public children of the associated aggregation
	 * and to add them inside of the AggregationOverlay
	 * @public
	 */
	ElementOverlay.prototype.sync = function() {
		var that = this;
		var aAggregationOverlays = this.getAggregationOverlays();
		aAggregationOverlays.forEach(function(oAggregationOverlay) {
			that._syncAggregationOverlay(oAggregationOverlay);
		});
	};

	/**
	 * @private
	 */
	ElementOverlay.prototype._createAggregationOverlays = function() {
		var oElement = this.getElementInstance();
		var oDesignTimeMetadata = this.getDesignTimeMetadata();

		if (oElement) {
			var that = this;
			ElementUtil.iterateOverAllPublicAggregations(oElement, function(oAggregation, aAggregationElements) {
				var sAggregationName = oAggregation.name;
				var oAggregationOverlay = new AggregationOverlay({
					aggregationName : sAggregationName,
					element : oElement,
					visible : oDesignTimeMetadata.isAggregationVisible(sAggregationName)
				});

				that._syncAggregationOverlay(oAggregationOverlay);

				that.addAggregation("aggregationOverlays", oAggregationOverlay);
			});
		}
	};

	/**
	 * @private
	 */
	ElementOverlay.prototype._destroyDefaultDesignTimeMetadata = function() {
		if (this._oDefaultDesignTimeMetadata) {
			this._oDefaultDesignTimeMetadata.destroy();
			this._oDefaultDesignTimeMetadata = null;
		}
	};

	/**
	 * @param {sap.ui.core.Element} oElement The element to observe
	 * @private
	 */
	ElementOverlay.prototype._observe = function(oElement) {
		if (oElement instanceof sap.ui.core.Control) {
			this._oObserver = new ControlObserver({
				target : oElement
			});
			this._oObserver.attachDomChanged(this._onElementDomChanged, this);
		} else {
			this._oObserver = new ManagedObjectObserver({
				target : oElement
			});
		}
		this._oObserver.attachModified(this._onElementModified, this);
		this._oObserver.attachDestroyed(this._onElementDestroyed, this);
	};

	/**
	 * @param {sap.ui.core.Element} oElement The element to unobserve
	 * @private
	 */
	ElementOverlay.prototype._unobserve = function(oElement) {
		this._oObserver.destroy();
	};

	/**
	 * @param {sap.ui.dt.AggregationOverlay} oAggregationOverlay to sync
	 * @private
	 */
	ElementOverlay.prototype._syncAggregationOverlay = function(oAggregationOverlay) {
		var sAggregationName = oAggregationOverlay.getAggregationName();
		var aAggregationElements = ElementUtil.getAggregation(this.getElementInstance(), sAggregationName);

		aAggregationElements.forEach(function(oAggregationElement) {
			var oChildElementOverlay = OverlayRegistry.getOverlay(oAggregationElement);
			if (oChildElementOverlay) {
				oAggregationOverlay.addChild(oChildElementOverlay);
			}
		});
	};

	/**
	 * @param {sap.ui.baseEvent} oEvent event object
	 * @private
	 */
	ElementOverlay.prototype._onElementModified = function(oEvent) {
		this.sync();
		this.invalidate();
		this.fireElementModified(oEvent.getParameters());
	};

	/**
	 * @private
	 */
	ElementOverlay.prototype._onElementDomChanged = function() {
		this.invalidate();
	};

	/**
	 * @private
	 */
	ElementOverlay.prototype._onElementDestroyed = function() {
		this.destroy();
	};

	/**
	 * Returns AggregationOverlays created for the public aggregations of the associated Element
	 * @return {sap.ui.dt.AggregationOverlay[]} array of the AggregationOverlays
	 * @public
	 */
	ElementOverlay.prototype.getAggregationOverlays = function() {
		return this.getAggregation("aggregationOverlays") || [];
	};

	/**
	 * @override
	 */
	ElementOverlay.prototype.getChildren = function() {
		return this.getAggregationOverlays();
	};

	/**
	 * Returns AggregationOverlay the public aggregations of the associated Element by aggregation name
	 * @param {string} sAggregationName name of the aggregation
	 * @return {sap.ui.dt.AggregationOverlay} AggregationOverlays for the aggregation
	 * @public
	 */
	ElementOverlay.prototype.getAggregationOverlay = function(sAggregationName) {
		var aAggregationOverlaysWithName = this.getAggregationOverlays().filter(function(oAggregationOverlay) {
			return oAggregationOverlay.getAggregationName() === sAggregationName;
		});
		if (aAggregationOverlaysWithName.length) {
			return aAggregationOverlaysWithName[0];
		}
	};

	/**
	 * Returns closest ElementOverlay ancestor of this ElementOverlay or undefined, if no parent ElementOverlay exists
	 * @return {sap.ui.dt.ElementOverlay} ElementOverlay parent
	 * @public
	 */
	ElementOverlay.prototype.getParentElementOverlay = function() {
		var oParentAggregationOverlay = this.getParentAggregationOverlay();
		if (oParentAggregationOverlay) {
			return oParentAggregationOverlay.getParent();
		}
	};

	/**
	 * Returns closest AggregationOverlay ancestor of this ElementOverlay or null, if no parent AggregationOverlay exists
	 * @return {sap.ui.dt.AggregationOverlay} AggregationOverlay parent, which contains this ElementOverlay
	 * @public
	 */
	ElementOverlay.prototype.getParentAggregationOverlay = function() {
		var oParentAggregationOverlay = this.getParent();
		return oParentAggregationOverlay instanceof sap.ui.dt.AggregationOverlay ? oParentAggregationOverlay : null;
	};

	/**
	 * Returns if the ElementOverlay is selected
	 * @public
	 * @return {boolean} if the ElementOverlay is selected
	 */
	ElementOverlay.prototype.isSelected = function() {
		return this.getSelected();
	};

	/**
	 * Returns if the ElementOverlay is selectable
	 * @public
	 * @return {boolean} if the ElementOverlay is selectable
	 */
	ElementOverlay.prototype.isSelectable = function() {
		return this.getSelectable();
	};

	/**
	 * Returns if the ElementOverlay is draggable
	 * @public
	 * @return {boolean} if the ElementOverlay is draggable
	 */
	ElementOverlay.prototype.isDraggable = function() {
		return this.getDraggable();
	};

	/**
	 * Returns if the ElementOverlay is editable
	 * @public
	 * @return {boolean} if the ElementOverlay is editable
	 */
	ElementOverlay.prototype.isEditable = function() {
		return this.getEditable();
	};

	/**
	 * Returns if the ElementOverlay is visible
	 * @public
	 * @return {boolean} if the ElementOverlay is visible
	 */
	ElementOverlay.prototype.isVisible = function() {
		return this.getVisible();
	};

	return ElementOverlay;
}, /* bExport= */ true);
