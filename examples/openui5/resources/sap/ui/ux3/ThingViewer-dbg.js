/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.ux3.ThingViewer.
sap.ui.define(['jquery.sap.global', 'sap/ui/core/Control', './library'],
	function(jQuery, Control) {
	"use strict";



	/**
	 * Constructor for a new ThingViewer.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * ThingViewer: Same as ThingInspector but decoupled from the Overlay and the ActionBar.
	 * The control can be added to a Parent container that has a defined width. The ThingViewer fill the whole container. If the parent container has no width defined the control will not work properly.
	 * @extends sap.ui.core.Control
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @since 1.9.1
	 * @alias sap.ui.ux3.ThingViewer
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var ThingViewer = Control.extend("sap.ui.ux3.ThingViewer", /** @lends sap.ui.ux3.ThingViewer.prototype */ { metadata : {

		library : "sap.ui.ux3",
		properties : {

			/**
			 * Title of the Thing Inspector
			 */
			title : {type : "string", group : "Misc", defaultValue : null},

			/**
			 * Thing type
			 */
			type : {type : "string", group : "Misc", defaultValue : null},

			/**
			 * Thing Icon Url
			 */
			icon : {type : "sap.ui.core.URI", group : "Misc", defaultValue : null},

			/**
			 * Subtitle of the Thing Inspector
			 */
			subtitle : {type : "string", group : "Misc", defaultValue : null},

			/**
			 * Width of the ThingViewer
			 */
			width : {type : "sap.ui.core.CSSSize", group : "Misc", defaultValue : '100%'},

			/**
			 * Height of the ThingViewer
			 */
			height : {type : "sap.ui.core.CSSSize", group : "Misc", defaultValue : '100%'},

			/**
			 * Defines which header type should be used.
			 * @since 1.16.3
			 */
			headerType : {type : "sap.ui.ux3.ThingViewerHeaderType", group : "Misc", defaultValue : sap.ui.ux3.ThingViewerHeaderType.Standard}
		},
		aggregations : {

			/**
			 * ThingGroups for the header content
			 */
			headerContent : {type : "sap.ui.ux3.ThingGroup", multiple : true, singularName : "headerContent"},

			/**
			 * Thing Inspector facets
			 */
			facets : {type : "sap.ui.ux3.NavigationItem", multiple : true, singularName : "facet"},

			/**
			 * ThingGroups for content of the selected facet
			 */
			facetContent : {type : "sap.ui.ux3.ThingGroup", multiple : true, singularName : "facetContent"},

			/**
			 * An ActionBar can be given
			 */
			actionBar : {type : "sap.ui.ux3.ActionBar", multiple : false},

			/**
			 * NavigationBar that is managed by this ThingViewer
			 */
			navBar : {type : "sap.ui.ux3.NavigationBar", multiple : false, visibility : "hidden"}
		},
		associations : {

			/**
			 * The Facet that is currently selected.
			 */
			selectedFacet : {type : "sap.ui.ux3.NavigationItem", multiple : false}
		},
		events : {

			/**
			 * Event for facet selection. The application is responsible for displaying the correct content for the selected one. The ThingInspector will currently always mark the first facet as selected.
			 */
			facetSelected : {allowPreventDefault : true,
				parameters : {

					/**
					 * Id of selected NavigationItem
					 */
					id : {type : "string"},

					/**
					 * The selected NavigationItem
					 */
					item : {type : "sap.ui.ux3.NavigationItem"},

					/**
					 * Key of selected NavigationItem
					 */
					key : {type : "string"}
				}
			}
		}
	}});

	(function() {
		/**
		 * Initialization hook for the ThingViewer. It creates the instance of the
		 * Popup helper service and does some basic configuration for it.
		 *
		 * @private
		 */
		ThingViewer.prototype.init = function() {
			var that = this;
			this._oNavBar = new sap.ui.ux3.NavigationBar();
			this.setAggregation("navBar",this._oNavBar);
			// attach NavBar selection
			this._oNavBar.attachSelect(function(oControlEvent) {
				var item = oControlEvent.getParameters().item;
				if (that.fireFacetSelected({id:item.getId(), key:item.getKey(),item:item})) {
					that.setSelectedFacet(item);
				} else {
					 oControlEvent.preventDefault();
				}
			});
		};

		/*
		 * Set size of TI after rendering: If running in Shell we sync with shell
		 * canvas. The size will then be set by the shell.
		 */
		ThingViewer.prototype.onAfterRendering = function() {
			// register resize handler
			this._resize = false;
			if (this.getActionBar()) {
				this._adjustStyles();
			}
			if (this.$().find(".sapUiUx3TVFacetContent").length <= 0) {
				return;
			}
			this._resizeListenerId = sap.ui.core.ResizeHandler.register(this.$().find(".sapUiUx3TVFacetContent")[0], jQuery.proxy(this._onresize, this));

			// initial resize handling
			this._setTriggerValue();
			this._setHeaderPosition();
			this._onresize();
		};

		ThingViewer.prototype.onBeforeRendering = function() {
			if (this._resizeListenerId) {
				sap.ui.core.ResizeHandler.deregister(this._resizeListenerId);
				this._resizeListenerId = null;
			}
		};

		ThingViewer.prototype._setHeaderPosition = function() {
			if (this.getHeaderType() === sap.ui.ux3.ThingViewerHeaderType.Standard) {
				var $typeContainer = this.$().find(".sapUiUx3TVHeaderContainerIdentifier"),
				    $scrollContainer = this.$().find(".sapUiUx3TVHeaderGroupScrollContainer");
				$scrollContainer.css("top", $typeContainer.outerHeight());
			}
		};

		/**
		 * Resize handler listening to the facet content area. If the area will be
		 * resized and the blocks will be rearranged to one column the width will be set
		 * to 100%. After resize to a width greater than two times the minimum width of
		 * a single block the size will be set back to 50%
		 *
		 * @private
		 */
		ThingViewer.prototype._onresize = function(oEvent) {
			var width;
			if (oEvent) {
				width = jQuery(oEvent.target).width();
			}
			if (!width) {
				width = jQuery(this.$().find(".sapUiUx3TVFacetContent")[0]).width();
			}
			if (width < this._triggerValue && this._resize == false) {
				var facetGroups = this.$().find(".sapUiUx3TVFacetThingGroup");
				for ( var i = 0; i < facetGroups.length; i++) {
					jQuery(facetGroups[i]).animate({
						width : "100%"
					}, "fast");
				}
				this._resize = true;
			} else if (width > this._triggerValue && this._resize == true) {
				var facetGroups = this.$().find(".sapUiUx3TVFacetThingGroup");
				for ( var i = 0; i < facetGroups.length; i++) {
					jQuery(facetGroups[i]).animate({
						width : "50%"
					}, "fast");
				}
				this._resize = false;
			}
			if (this.getActionBar()) {
				var minWidth = this.getActionBar().getActionBarMinWidth(),
					minWidthTI = minWidth;
				if (this._bShell) {
					minWidth += 36;
					minWidthTI  = minWidth + 60;
				}
				this.$().find(".sapUiUx3TV").css("min-width",minWidthTI + "px");
				this.$().find(".sapUiUx3TVContent").css("min-width",minWidth + "px");
			}
		};

		/**
		 * Destroys this instance of ThingViewer, called by Element#destroy()
		 *
		 * @private
		 */
		ThingViewer.prototype.exit = function() {
			this._oNavBar.destroy();
			if (this._resizeListenerId) {
				sap.ui.core.ResizeHandler.deregister(this._resizeListenerId);
				this._resizeListenerId = null;
			}
		};

		/**
		 * get Navigation Bar control
		 *
		 * @private
		 */
		ThingViewer.prototype._getNavBar = function() {
			return this._oNavBar;
		};

		/**
		 * setDefault NavBar selection and fire SelectedItem Event
		 *
		 * @private
		 */
		ThingViewer.prototype._selectDefault = function() {
			var navBarItems = this._oNavBar.getItems();
			if (navBarItems.length && !this._oNavBar.getSelectedItem()) {
				if (!this.getSelectedFacet()) {
					this.setSelectedFacet(navBarItems[0]);
				}
				var itemID = this._oNavBar.getSelectedItem(),
					item = sap.ui.getCore().byId(itemID);
				this.fireFacetSelected({
					id : item.getId(),
					key : item.getKey(),
					item : item
				});
			}
		};

		/**
		 * equal Columns
		 *
		 * @private
		 */
		ThingViewer.prototype._equalColumns = function() {
			var headerColumn = this.$().find(".sapUiUx3TVHeader"),
			    facetsColumn = this.$().find(".sapUiUx3TVFacets"),
			    scrollContainer = this.$().find(".sapUiUx3TVContentScrollContainer"),
				scrollContainerColumnHeight = scrollContainer.get(0).scrollHeight;
			facetsColumn.height(scrollContainerColumnHeight);
			headerColumn.height(scrollContainerColumnHeight);
		};

		/**
		 * Rerender Header
		 *
		 * @private
		 */
		ThingViewer.prototype._rerenderHeader = function() {
			var $content = this.$("header");
			if ($content.length > 0) {
				var rm = sap.ui.getCore().createRenderManager();
				sap.ui.ux3.ThingViewerRenderer.renderHeader(rm, this);
				rm.flush($content[0]);
				rm.destroy();
			}
		};

		/**
		 * Rerender Header Content
		 *
		 * @private
		 */
		ThingViewer.prototype._rerenderHeaderContent = function() {
			var $content = this.$("headerContent");
			if ($content.length > 0) {
				var rm = sap.ui.getCore().createRenderManager();
				sap.ui.ux3.ThingViewerRenderer.renderHeaderContent(rm, this);
				rm.flush($content[0]);
				rm.destroy();
			}
		};

		/**
		 * Rerender Toolbar
		 *
		 * @private
		 */
		ThingViewer.prototype._rerenderToolbar = function() {
			var $content = this.$("toolbar");
			if ($content.length > 0) {
				var rm = sap.ui.getCore().createRenderManager();
				sap.ui.ux3.ThingViewerRenderer.renderToolbar(rm, this);
				rm.flush($content[0]);
				rm.destroy();
			}
		};

		/**
		 * Rerender Facet Content
		 *
		 * @private
		 */
		ThingViewer.prototype._rerenderFacetContent = function() {
			var $content = this.$("facetContent");
			if ($content.length > 0) {
				var rm = sap.ui.getCore().createRenderManager();
				sap.ui.ux3.ThingViewerRenderer.renderFacetContent(rm, this);
				rm.flush($content[0]);
				rm.destroy();
				this._resize = false;
				this._setTriggerValue();
				this._onresize();
			}
		};

		/**
		 * set trigger value for resize handler
		 *
		 * @private
		 */
		ThingViewer.prototype._setTriggerValue = function() {
			var facetGroups,
				minWidth,
				$content = this.$("facetContent");

			// get triggerValue for facet content resize handler
			if ($content.length > 0) {
				facetGroups = this.$().find(".sapUiUx3TVFacetThingGroup");
				minWidth = jQuery(facetGroups[0]).css("min-width");
				if (minWidth) {
					this._triggerValue = parseInt(minWidth, 10) * 2;
				}
			}
		};

		/* Redefinition of generated API methods */

		// Implementation of API method
		ThingViewer.prototype.getFacets = function() {
			return this._oNavBar.getItems();
		};

		// Implementation of API method insertFacet
		ThingViewer.prototype.insertFacet = function(oFacet, iIndex) {
			this._oNavBar.insertItem(oFacet, iIndex);
			return this;
		};

		// Implementation of API method
		ThingViewer.prototype.addFacet = function(oFacet) {
			this._oNavBar.addItem(oFacet);
			return this;
		};

		// Implementation of API method
		ThingViewer.prototype.removeFacet = function(vElement) {
			return this._oNavBar.removeItem(vElement);
		};

		// Implementation of API method
		ThingViewer.prototype.removeAllFacets = function() {
			return this._oNavBar.removeAllItems();
		};

		// Implementation of API method
		ThingViewer.prototype.destroyFacets = function() {
			this._oNavBar.destroyItems();
			return this;
		};

		// Implementation of API method
		ThingViewer.prototype.setIcon = function(oIcon) {
			this.setProperty("icon", oIcon);
			if (this.getActionBar()) {
				this.getActionBar().setThingIconURI(oIcon);
			}
			this._rerenderHeader();
			return this;
		};

		// Implementation of API method
		ThingViewer.prototype.insertFacetContent = function(oFacetContent, iIndex) {
			this.insertAggregation("facetContent", oFacetContent, iIndex, true);
			this._rerenderFacetContent();
			return this;
		};
		// Implementation of API method
		ThingViewer.prototype.addFacetContent = function(oFacetContent) {
			this.addAggregation("facetContent", oFacetContent, true);
			this._rerenderFacetContent();
			return this;
		};
		// Implementation of API method
		ThingViewer.prototype.removeFacetContent = function(vFacetContent) {
			var result = this.removeAggregation("facetContent", vFacetContent, true);
			this._rerenderFacetContent();
			return result;
		};
		// Implementation of API method
		ThingViewer.prototype.removeAllFacetContent = function() {
			var result = this.removeAllAggregation("facetContent", true);
			this._rerenderFacetContent();
			return result;
		};
		// Implementation of API method
		ThingViewer.prototype.destroyFacetContent = function() {
			this.destroyAggregation("facetContent", true);
			this._rerenderFacetContent();
			return this;
		};
		// Implementation of API method
		ThingViewer.prototype.insertHeaderContent = function(oHeaderContent, iIndex) {
			this.insertAggregation("headerContent", oHeaderContent, iIndex, true);
			this._rerenderHeaderContent();
			return this;
		};
		// Implementation of API method
		ThingViewer.prototype.addHeaderContent = function(oHeaderContent) {
			this.addAggregation("headerContent", oHeaderContent, true);
			this._rerenderHeaderContent();
			return this;
		};
		// Implementation of API method
		ThingViewer.prototype.removeHeaderContent = function(vHeaderContent) {
			var result = this.removeAggregation("headerContent", vHeaderContent, true);
			this._rerenderHeaderContent();
			return result;
		};
		// Implementation of API method
		ThingViewer.prototype.removeAllHeaderContent = function() {
			var result = this.removeAllAggregation("headerContent", true);
			this._rerenderHeaderContent();
			return result;
		};
		// Implementation of API method
		ThingViewer.prototype.destroyHeaderContent = function() {
			this.destroyAggregation("headerContent", true);
			this._rerenderHeaderContent();
			return this;
		};
		// Implementation of API method
		ThingViewer.prototype.setSelectedFacet = function(selectedFacet) {
			var oldSelectedFacet = this.getSelectedFacet();
			this.setAssociation("selectedFacet", selectedFacet, true);
			var newSelectedFacet = this.getSelectedFacet();

			if (oldSelectedFacet != newSelectedFacet) {
				this._oNavBar.setSelectedItem(newSelectedFacet);
			}
		};
		//Implementation of API method
		ThingViewer.prototype.setTitle = function(sTitle) {
			this.setProperty("title", sTitle, true);
			this._rerenderHeader();
		};
		//Implementation of API method
		ThingViewer.prototype.setSubtitle = function(sTitle) {
			this.setProperty("subtitle", sTitle, true);
			this._rerenderHeader();
		};
		// Implementation of API method
		ThingViewer.prototype.setActionBar = function(oActionBar) {
			this.setAggregation("actionBar", oActionBar, true);
			if (this.getIcon() && this.getActionBar()) {
				this.getActionBar().setThingIconURI(this.getIcon());
			}
			this._rerenderToolbar();
			this._adjustStyles();
			return this;
		};
		ThingViewer.prototype._adjustStyles = function() {
			var $header = this.$().find(".sapUiUx3TVHeader"),
			    $facets = this.$().find(".sapUiUx3TVFacets");
			if ($header.length > 0) {
				$header.addClass("sapUiUx3TVActionBar");
				$header.removeClass("sapUiUx3TVNoActionBar");
			}
			if ($facets.length > 0) {
				$facets.addClass("sapUiUx3TVActionBar");
				$facets.removeClass("sapUiUx3TVNoActionBar");
			}
		};
	}());

	return ThingViewer;

}, /* bExport= */ true);
