/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

/**
 * Initialization Code and shared classes of library sap.ui.ux3.
 */
sap.ui.define(['jquery.sap.global', 
	'sap/ui/core/library', // library dependency
	'sap/ui/commons/library'], // library dependency
	function(jQuery) {

	"use strict";

	/**
	 * Controls that implement the SAP User Experience (UX) Guidelines 3.0
	 *
	 * @namespace
	 * @name sap.ui.ux3
	 * @author SAP SE
	 * @version 1.32.9
	 * @public
	 */
	
	// delegate further initialization of this library to the Core
	sap.ui.getCore().initLibrary({
		name : "sap.ui.ux3",
		version: "1.32.9",
		dependencies : ["sap.ui.core","sap.ui.commons"],
		types: [
			"sap.ui.ux3.ActionBarSocialActions",
			"sap.ui.ux3.ExactOrder",
			"sap.ui.ux3.FeederType",
			"sap.ui.ux3.FollowActionState",
			"sap.ui.ux3.NotificationBarStatus",
			"sap.ui.ux3.ShellDesignType",
			"sap.ui.ux3.ShellHeaderType",
			"sap.ui.ux3.ThingViewerHeaderType",
			"sap.ui.ux3.VisibleItemCountMode"
		],
		interfaces: [
			"sap.ui.ux3.DataSetView"
		],
		controls: [
			"sap.ui.ux3.ActionBar",
			"sap.ui.ux3.CollectionInspector",
			"sap.ui.ux3.DataSet",
			"sap.ui.ux3.DataSetSimpleView",
			"sap.ui.ux3.Exact",
			"sap.ui.ux3.ExactArea",
			"sap.ui.ux3.ExactBrowser",
			"sap.ui.ux3.ExactList",
			"sap.ui.ux3.FacetFilter",
			"sap.ui.ux3.FacetFilterList",
			"sap.ui.ux3.Feed",
			"sap.ui.ux3.FeedChunk",
			"sap.ui.ux3.Feeder",
			"sap.ui.ux3.NavigationBar",
			"sap.ui.ux3.NotificationBar",
			"sap.ui.ux3.Overlay",
			"sap.ui.ux3.OverlayContainer",
			"sap.ui.ux3.OverlayDialog",
			"sap.ui.ux3.QuickView",
			"sap.ui.ux3.Shell",
			"sap.ui.ux3.ThingInspector",
			"sap.ui.ux3.ThingViewer",
			"sap.ui.ux3.ToolPopup"
		],
		elements: [
			"sap.ui.ux3.Collection",
			"sap.ui.ux3.DataSetItem",
			"sap.ui.ux3.ExactAttribute",
			"sap.ui.ux3.NavigationItem",
			"sap.ui.ux3.Notifier",
			"sap.ui.ux3.ThingAction",
			"sap.ui.ux3.ThingGroup"
		]
	});
	
	
	/**
	 * Enumeration of available standard actions for 'sap.ui.ux3.ActionBar'. To be used as parameters for function 'sap.ui.ux3.ActionBar.getSocialAction'.
	 *
	 * @enum {string}
	 * @public
	 * @experimental Since version 1.2. 
	 * API is not yet finished and might change completely
	 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
	 */
	sap.ui.ux3.ActionBarSocialActions = {
	
		/**
		 * Standard action 'Create an update' (Feed)
		 * @public
		 */
		Update : "Update",
	
		/**
		 * Standard action 'Follow/Unfollow'
		 * @public
		 */
		Follow : "Follow",
	
		/**
		 * Standard action 'Mark for Follow up'
		 * @public
		 */
		Flag : "Flag",
	
		/**
		 * Standards action 'Mark as Favorite'
		 * @public
		 */
		Favorite : "Favorite",
	
		/**
		 * Standard action 'Open Thing Inspector'
		 * @public
		 */
		Open : "Open"
	
	};
	/**
	 * 
	 *   		Marker interface for controls which are suitable as view rendering for a DataSet.
	 *   	
	 *
	 * @author SAP SE
	 * @name sap.ui.ux3.DataSetView
	 * @interface
	 * @public
	 * @ui5-metamodel This interface also will be described in the UI5 (legacy) designtime metamodel
	 */
	
	
	/**
	 * Defines the order of the sub lists of a list in the ExactBrowser.
	 *
	 * @author SAP SE
	 * @enum {string}
	 * @public
	 * @since 1.7.1
	 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
	 */
	sap.ui.ux3.ExactOrder = {
	
		/**
		 * The order of the sub lists is defined by the selection order of the user.
		 * @public
		 */
		Select : "Select",
	
		/**
		 * The order of the sub lists is defined by order of the defined sub attributes.
		 * @public
		 */
		Fixed : "Fixed"
	
	};
	
	
	/**
	 * Type of an Feeder.
	 *
	 * @enum {string}
	 * @public
	 * @experimental Since version 1.2. 
	 * The whole Feed/Feeder API is still under discussion, significant changes are likely. Especially text presentation (e.g. @-references and formatted text) is not final. Also the Feed model topic is still open.
	 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
	 */
	sap.ui.ux3.FeederType = {
	
		/**
		 * large Feeder
		 * @public
		 */
		Large : "Large",
	
		/**
		 * medium feeder
		 * @public
		 */
		Medium : "Medium",
	
		/**
		 * comment feeder (small)
		 * @public
		 */
		Comment : "Comment"
	
	};
	
	
	/**
	 * Defines the states of the follow action
	 *
	 * @enum {string}
	 * @public
	 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
	 */
	sap.ui.ux3.FollowActionState = {
	
		/**
		 * follow state
		 * @public
		 */
		Follow : "Follow",
	
		/**
		 * hold state
		 * @public
		 */
		Hold : "Hold",
	
		/**
		 * default state
		 * @public
		 */
		Default : "Default"
	
	};
	
	
	/**
	 * This entries are used to set the visibility status of a NotificationBar
	 *
	 * @author SAP
	 * @enum {string}
	 * @public
	 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
	 */
	sap.ui.ux3.NotificationBarStatus = {
	
		/**
		 * Default height for the bar
		 * @public
		 */
		Default : "Default",
	
		/**
		 * Bar should be minimized
		 * @public
		 */
		Min : "Min",
	
		/**
		 * Bar should be maximized
		 * @public
		 */
		Max : "Max",
	
		/**
		 * Bar should not be visible
		 * @public
		 */
		None : "None"
	
	};
	
	
	/**
	 * Available shell design types.
	 *
	 * @author SAP SE
	 * @enum {string}
	 * @public
	 * @since 1.12.0
	 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
	 */
	sap.ui.ux3.ShellDesignType = {
	
		/**
		 * The standard Shell design (dark).
		 * @public
		 */
		Standard : "Standard",
	
		/**
		 * 
		 * A lighter design. Should be used in combination with the Standard header
		 * type.
		 * 
		 * @public
		 */
		Light : "Light",
	
		/**
		 * 
		 * An even lighter design. It borrows most of its properties from the Light
		 * design and just changes a few details like the header colors in order to
		 * have a blue design within gold reflection.
		 * 
		 * @public
		 */
		Crystal : "Crystal"
	
	};
	
	
	/**
	 * Available shell header display types.
	 *
	 * @author SAP SE
	 * @enum {string}
	 * @public
	 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
	 */
	sap.ui.ux3.ShellHeaderType = {
	
		/**
		 * The standard Shell header.
		 * @public
		 */
		Standard : "Standard",
	
		/**
		 * Only the branding area is visible. Top-level navigation bar, header items, title and icon are not shown.
		 * @public
		 */
		BrandOnly : "BrandOnly",
	
		/**
		 * Like the Standard Area but without top-level navigation bar.
		 * @public
		 */
		NoNavigation : "NoNavigation",
	
		/**
		 * Like the Standard Area but with a leaner top-level navigation bar.
		 * @public
		 */
		SlimNavigation : "SlimNavigation"
	
	};
	
	
	/**
	 * Available ThingViewer header display types.
	 *
	 * @author SAP SE
	 * @enum {string}
	 * @public
	 * @since 1.16.3
	 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
	 */
	sap.ui.ux3.ThingViewerHeaderType = {
	
		/**
		 * The standard ThingViewer header.
		 * @public
		 */
		Standard : "Standard",
	
		/**
		 * The header content is displayed horizontally above the facet content
		 * @public
		 */
		Horizontal : "Horizontal"
	
	};
	
	
	/**
	 * VisibleItemCountMode of the FacetFilter defines if the FacetFilter takes the whole available height (Auto) in the surrounding container, or is so high as needed to show 5 Items ("Fixed " - default).
	 *
	 * @enum {string}
	 * @public
	 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
	 */
	sap.ui.ux3.VisibleItemCountMode = {
	
		/**
		 * The FacetFilter always has as many items in the FacetFilterList as defined in the visibleItemCount property.
		 * @public
		 */
		Fixed : "Fixed",
	
		/**
		 * The FacetFilter automatically fills the height of the surrounding container. The visibleItemCount property is automatically changed accordingly.
		 * @public
		 */
		Auto : "Auto"
	
	};

	return sap.ui.ux3;

});
