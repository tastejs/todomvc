/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

/**
 * Initialization Code and shared classes of library sap.m.
 */
sap.ui.define(['jquery.sap.global', 'sap/ui/Device',
	'sap/ui/core/library', // library dependency
	'jquery.sap.mobile', // referenced here in case the Core decides to throw it out - shall always be available when using the mobile lib.
	'./Support'], // referenced here to enable the Support feature
	function(jQuery, Device) {

	"use strict";


	/**
	 * SAPUI5 library with controls specialized for mobile devices.
	 *
	 * @namespace
	 * @name sap.m
	 * @author SAP SE
	 * @version 1.32.9
	 * @public
	 */

	// delegate further initialization of this library to the Core
	sap.ui.getCore().initLibrary({
		name : "sap.m",
		version: "1.32.9",
		dependencies : ["sap.ui.core"],
		types: [
			"sap.m.BackgroundDesign",
			"sap.m.BarDesign",
			"sap.m.ButtonType",
			"sap.m.DateTimeInputType",
			"sap.m.DialogType",
			"sap.m.DraftIndicatorState",
			"sap.m.FacetFilterListDataType",
			"sap.m.FacetFilterType",
			"sap.m.FlexAlignItems",
			"sap.m.FlexAlignSelf",
			"sap.m.FlexDirection",
			"sap.m.FlexJustifyContent",
			"sap.m.FlexRendertype",
			"sap.m.HeaderLevel",
			"sap.m.IBarHTMLTag",
			"sap.m.IconTabFilterDesign",
			"sap.m.ImageMode",
			"sap.m.InputType",
			"sap.m.LabelDesign",
			"sap.m.ListHeaderDesign",
			"sap.m.ListMode",
			"sap.m.ListSeparators",
			"sap.m.ListType",
			"sap.m.OverflowToolbarPriority",
			"sap.m.P13nPanelType",
			"sap.m.PageBackgroundDesign",
			"sap.m.PlacementType",
			"sap.m.PopinDisplay",
			"sap.m.QuickViewGroupElementType",
			"sap.m.RatingIndicatorVisualMode",
			"sap.m.ScreenSize",
			"sap.m.SelectType",
			"sap.m.SplitAppMode",
			"sap.m.StandardTileType",
			"sap.m.SwipeDirection",
			"sap.m.SwitchType",
			"sap.m.ToolbarDesign",
			"sap.m.VerticalPlacementType"
		],
		interfaces: [
			"sap.m.IBar",
			"sap.m.IconTab",
			"sap.m.semantic.IGroup",
			"sap.m.semantic.IFilter",
			"sap.m.semantic.ISort",
			"sap.m.ObjectHeaderContainer"
		],
		controls: [
			"sap.m.ActionListItem",
			"sap.m.ActionSelect",
			"sap.m.ActionSheet",
			"sap.m.App",
			"sap.m.Bar",
			"sap.m.BusyDialog",
			"sap.m.BusyIndicator",
			"sap.m.Button",
			"sap.m.Carousel",
			"sap.m.CheckBox",
			"sap.m.ColumnListItem",
			"sap.m.ComboBox",
			"sap.m.ComboBoxBase",
			"sap.m.CustomListItem",
			"sap.m.CustomTile",
			"sap.m.DatePicker",
			"sap.m.DateRangeSelection",
			"sap.m.DateTimeInput",
			"sap.m.Dialog",
			"sap.m.DisplayListItem",
			"sap.m.DraftIndicator",
			"sap.m.FacetFilter",
			"sap.m.FacetFilterItem",
			"sap.m.FacetFilterList",
			"sap.m.FeedInput",
			"sap.m.FeedListItem",
			"sap.m.FlexBox",
			"sap.m.GroupHeaderListItem",
			"sap.m.GrowingList",
			"sap.m.HBox",
			"sap.m.IconTabBar",
			"sap.m.IconTabHeader",
			"sap.m.Image",
			"sap.m.Input",
			"sap.m.InputBase",
			"sap.m.InputListItem",
			"sap.m.Label",
			"sap.m.Link",
			"sap.m.List",
			"sap.m.ListBase",
			"sap.m.ListItemBase",
			"sap.m.MaskInput",
			"sap.m.MessagePage",
			"sap.m.MessagePopover",
			"sap.m.MessageStrip",
			"sap.m.MultiComboBox",
			"sap.m.MultiInput",
			"sap.m.NavContainer",
			"sap.m.PagingButton",
			"sap.m.ObjectAttribute",
			"sap.m.ObjectHeader",
			"sap.m.ObjectIdentifier",
			"sap.m.ObjectListItem",
			"sap.m.ObjectNumber",
			"sap.m.ObjectStatus",
			"sap.m.OverflowToolbar",
			"sap.m.OverflowToolbarButton",
			"sap.m.P13nColumnsItem",
			"sap.m.P13nColumnsPanel",
			"sap.m.P13nConditionPanel",
			"sap.m.P13nDialog",
			"sap.m.P13nFilterPanel",
			"sap.m.P13nPanel",
			"sap.m.P13nSortPanel",
			"sap.m.Page",
			"sap.m.Panel",
			"sap.m.Popover",
			"sap.m.ProgressIndicator",
			"sap.m.PullToRefresh",
			"sap.m.QuickView",
			"sap.m.QuickViewCard",
			"sap.m.QuickViewPage",
			"sap.m.QuickViewGroup",
			"sap.m.QuickViewGroupElement",
			"sap.m.RadioButton",
			"sap.m.RadioButtonGroup",
			"sap.m.RatingIndicator",
			"sap.m.ResponsivePopover",
			"sap.m.ScrollContainer",
			"sap.m.SearchField",
			"sap.m.SegmentedButton",
			"sap.m.Select",
			"sap.m.SelectDialog",
			"sap.m.SelectList",
			"sap.m.Shell",
			"sap.m.Slider",
			"sap.m.SplitApp",
			"sap.m.SplitContainer",
			"sap.m.StandardListItem",
			"sap.m.StandardTile",
			"sap.m.Switch",
			"sap.m.Table",
			"sap.m.TableSelectDialog",
			"sap.m.Text",
			"sap.m.TextArea",
			"sap.m.Tile",
			"sap.m.TileContainer",
			"sap.m.TimePicker",
			"sap.m.Title",
			"sap.m.ToggleButton",
			"sap.m.Token",
			"sap.m.Tokenizer",
			"sap.m.Toolbar",
			"sap.m.ToolbarSpacer",
			"sap.m.ToolbarSeparator",
			"sap.m.UploadCollection",
			"sap.m.VBox",
			"sap.m.ViewSettingsDialog",
			"sap.m.semantic.DetailPage",
			"sap.m.semantic.FullscreenPage",
			"sap.m.semantic.MasterPage",
			"sap.m.Wizard",
			"sap.m.WizardStep"
		],
		elements: [
			"sap.m.Column",
			"sap.m.FlexItemData",
			"sap.m.IconTabFilter",
			"sap.m.IconTabSeparator",
			"sap.m.OverflowToolbarLayoutData",
			"sap.m.MaskInputRule",
			"sap.m.MessagePopoverItem",
			"sap.m.P13nFilterItem",
			"sap.m.P13nItem",
			"sap.m.P13nSortItem",
			"sap.m.SegmentedButtonItem",
			"sap.m.ToolbarLayoutData",
			"sap.m.UploadCollectionItem",
			"sap.m.UploadCollectionParameter",
			"sap.m.ViewSettingsCustomItem",
			"sap.m.ViewSettingsCustomTab",
			"sap.m.ViewSettingsFilterItem",
			"sap.m.ViewSettingsItem",
			"sap.m.semantic.SemanticButton",
			"sap.m.semantic.SemanticSelect"
		]
	});


	/**
	 * Available Background Design.
	 *
	 * @enum {string}
	 * @public
	 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
	 */
	sap.m.BackgroundDesign = {

		/**
		 * A solid background color dependent on the theme.
		 * @public
		 */
		Solid : "Solid",

		/**
		 * Transparent background.
		 * @public
		 */
		Transparent : "Transparent",

		/**
		 * A translucent background depending on the opacity value of the theme.
		 * @public
		 */
		Translucent : "Translucent"

	};


	/**
	 * Types of the Bar design
	 *
	 * @enum {string}
	 * @public
	 * @since 1.20
	 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
	 */
	sap.m.BarDesign = {

		/**
		 * The Bar can be inserted into other controls and if the design is "Auto" then it inherits the design from parent control.
		 * @public
		 */
		Auto : "Auto",

		/**
		 * The bar will be styled like a header of the page.
		 * @public
		 */
		Header : "Header",

		/**
		 * The bar will be styled like a subheader of the page.
		 * @public
		 */
		SubHeader : "SubHeader",

		/**
		 * The bar will be styled like a footer of the page.
		 * @public
		 */
		Footer : "Footer"

	};


	/**
	 * Different types for a button (predefined types)
	 *
	 * @enum {string}
	 * @public
	 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
	 */
	sap.m.ButtonType = {

		/**
		 * default type (no special styling)
		 * @public
		 */
		Default : "Default",

		/**
		 * back type (back navigation button for header)
		 * @public
		 */
		Back : "Back",

		/**
		 * accept type (blue button)
		 * @public
		 */
		Accept : "Accept",

		/**
		 * reject style (red button)
		 * @public
		 */
		Reject : "Reject",

		/**
		 * transparent type
		 * @public
		 */
		Transparent : "Transparent",

		/**
		 * up type (up navigation button for header)
		 * @public
		 */
		Up : "Up",

		/**
		 * Unstyled type (no styling)
		 * @public
		 */
		Unstyled : "Unstyled",

		/**
		 * emphasized type
		 * @public
		 */
		Emphasized : "Emphasized"

	};


	/**
	 * A subset of DateTimeInput types that fit to a simple API returning one string.
	 *
	 * @enum {string}
	 * @public
	 * @deprecated Since version 1.32.8. Instead, use dedicated <code>sap.m.DatePicker</code> and/or <code>sap.m.TimePicker</code> controls. 
	 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
	 */
	sap.m.DateTimeInputType = {

		/**
		 * An input control for specifying a date value. The user can select a month, day of the month, and year.
		 * @public
		 * @deprecated Since version 1.22.0. Instead, use dedicated <code>sap.m.DatePicker</code> control.
		 */
		Date : "Date",

		/**
		 * An input control for specifying a date and time value. The user can select a month, day of the month, year, and time of day.
		 * @public
		 * @deprecated Since version 1.32.8. Instead, use dedicated <code>sap.m.DatePicker</code> and <code>sap.m.TimePicker</code> controls.
		 */
		DateTime : "DateTime",

		/**
		 * An input control for specifying a time value. The user can select the hour, minute, and optionally AM or PM.
		 * @public
		 * @deprecated Since version 1.32.8. Instead, use dedicated <code>sap.m.TimePicker</code> control.
		 */
		Time : "Time"

	};


	/**
	 * Enum for the type of sap.m.Dialog control.
	 *
	 * @enum {string}
	 * @public
	 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
	 */
	sap.m.DialogType = {

		/**
		 * This is the default value for Dialog type. Stardard dialog in iOS has a header on the top and the left, right buttons are put inside the header. In android, the left, right buttons are put to the bottom of the Dialog.
		 * @public
		 */
		Standard : "Standard",

		/**
		 * Dialog with type Message looks the same as the Stardard Dialog in Android. And it puts the left, right buttons to the bottom of the Dialog in iOS.
		 * @public
		 */
		Message : "Message"

	};
	
	/**
	 * Enum for the state of sap.m.DraftIndicator control.
	 *
	 * @enum {string}
	 * @public
	 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
	 */
	sap.m.DraftIndicatorState = {

		/**
		 * This is the default value for DraftIndicatorState type. This state has no visual information displayed.
		 * @public
		 */
		Clear: "Clear",
		
		/**
		 * Indicates that the draft currently is being saved
		 * @public
		 */
		Saving: "Saving",

		/**
		 * Indicates that the draft is already saved
		 * @public
		 */
		Saved: "Saved"

	};

	
	/**
	 * FacetFilterList data types.
	 *
	 * @enum {string}
	 * @public
	 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
	 */
	sap.m.FacetFilterListDataType = {

		/**
		 * An input control for specifying a date value. The user can select a month, day of the month, and year.
		 * @public
		 */
		Date : "Date",

		/**
		 * An input control for specifying a date and time value. The user can select a month, day of the month, year, and time of day.
		 * @public
		 */
		DateTime : "DateTime",

		/**
		 * An input control for specifying a time value. The user can select the hour, minute, and optionally AM or PM.
		 * @public
		 */
		Time : "Time",

		/**
		 * >An input control for specifying a Integer value
		 * @public
		 */
		Integer : "Integer",

		/**
		 * >An input control for specifying a Float value
		 * @public
		 */
		Float : "Float",

		/**
		 * >An input control for specifying a String value
		 * @public
		 */
		String : "String",

		/**
		 * >An input control for specifying a Boolean value
		 * @public
		 */
		Boolean : "Boolean"

	};


	/**
	 * Used by the FacetFilter control to adapt its design according to type.
	 *
	 *
	 * @enum {string}
	 * @public
	 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
	 */
	sap.m.FacetFilterType = {

		/**
		 * Forces FacetFilter to display facet lists as a row of buttons, one button per facet. The FacetFilter will automatically adapt to the Light type when it detects smart phone sized displays.
		 * @public
		 */
		Simple : "Simple",

		/**
		 * Forces FacetFilter to display in light mode.
		 * @public
		 */
		Light : "Light"

	};


	/**
	 * Available options for the layout of all elements along the cross axis of the flexbox layout.
	 *
	 * @enum {string}
	 * @public
	 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
	 */
	sap.m.FlexAlignItems = {

		/**
		 * The cross-start margin edges of the box items are placed flush with the cross-start edge of the line.
		 * @public
		 */
		Start : "Start",

		/**
		 * The cross-start margin edges of the box items are placed flush with the cross-end edge of the line.
		 * @public
		 */
		End : "End",

		/**
		 * The box items' margin boxes are centered in the cross axis within the line.
		 * @public
		 */
		Center : "Center",

		/**
		 * If the box items' inline axes are the same as the cross axis, this value is identical to ?start?. Otherwise, it participates in baseline alignment: all participating box items on the line are aligned such that their baselines align, and the item with the largest distance between its baseline and its cross-start margin edge is placed flush against the cross-start edge of the line.
		 * @public
		 */
		Baseline : "Baseline",

		/**
		 * Make the cross size of the items' margin boxes as close to the same size as the line as possible.
		 * @public
		 */
		Stretch : "Stretch",

		/**
		 * Inherits the value from its parent.
		 * @public
		 */
		Inherit : "Inherit"

	};


	/**
	 * Available options for the layout of individual elements along the cross axis of the flexbox layout overriding the default alignment.
	 *
	 * @enum {string}
	 * @public
	 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
	 */
	sap.m.FlexAlignSelf = {

		/**
		 * Takes up the value of alignItems from the parent FlexBox
		 * @public
		 */
		Auto : "Auto",

		/**
		 * The cross-start margin edges of the box item is placed flush with the cross-start edge of the line.
		 * @public
		 */
		Start : "Start",

		/**
		 * The cross-start margin edges of the box item is placed flush with the cross-end edge of the line.
		 * @public
		 */
		End : "End",

		/**
		 * The box item's margin box is centered in the cross axis within the line.
		 * @public
		 */
		Center : "Center",

		/**
		 * If the box item's inline axis is the same as the cross axis, this value is identical to ?start?. Otherwise, it participates in baseline alignment: all participating box items on the line are aligned such that their baselines align, and the item with the largest distance between its baseline and its cross-start margin edge is placed flush against the cross-start edge of the line.
		 * @public
		 */
		Baseline : "Baseline",

		/**
		 * Make the cross size of the item's margin box as close to the same size as the line as possible.
		 * @public
		 */
		Stretch : "Stretch",

		/**
		 * Inherits the value from its parent.
		 * @public
		 */
		Inherit : "Inherit"

	};


	/**
	 * Available directions for flex layouts.
	 *
	 * @enum {string}
	 * @public
	 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
	 */
	sap.m.FlexDirection = {

		/**
		 * Elements are layed out along the direction of the inline axis (text direction).
		 * @public
		 */
		Row : "Row",

		/**
		 * Elements are layed out along the direction of the block axis (usually top to bottom).
		 * @public
		 */
		Column : "Column",

		/**
		 * Elements are layed out along the reverse direction of the inline axis (against the text direction).
		 * @public
		 */
		RowReverse : "RowReverse",

		/**
		 * Elements are layed out along the reverse direction of the block axis (usually bottom to top).
		 * @public
		 */
		ColumnReverse : "ColumnReverse",

		/**
		 * Inherits the value from its parent.
		 * @public
		 */
		Inherit : "Inherit"

	};


	/**
	 * Available options for the layout of elements along the main axis of the flexbox layout.
	 *
	 * @enum {string}
	 * @public
	 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
	 */
	sap.m.FlexJustifyContent = {

		/**
		 * Box items are packed toward the start of the line.
		 * @public
		 */
		Start : "Start",

		/**
		 * Box items are packed toward the end of the line.
		 * @public
		 */
		End : "End",

		/**
		 * Box items are packed toward the center of the line.
		 * @public
		 */
		Center : "Center",

		/**
		 * Box items are evenly distributed in the line.
		 * @public
		 */
		SpaceBetween : "SpaceBetween",

		/**
		 * Box items are evenly distributed in the line, with half-size spaces on either end.
		 * <b>Note:</b> This value behaves like SpaceBetween in Internet Explorer 10.
		 * @public
		 */
		SpaceAround : "SpaceAround",

		/**
		 * Inherits the value from its parent.
		 * @public
		 */
		Inherit : "Inherit"

	};


	/**
	 * Determines the type of HTML elements used for rendering controls.
	 *
	 * @enum {string}
	 * @public
	 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
	 */
	sap.m.FlexRendertype = {

		/**
		 * DIV elements are used for rendering
		 * @public
		 */
		Div : "Div",

		/**
		 * Unordered lists are used for rendering.
		 * @public
		 */
		List : "List"

	};


	/**
	 * Different levels for headers
	 *
	 * @enum {string}
	 * @public
	 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
	 */
	sap.m.HeaderLevel = {

		/**
		 * Header level 1
		 * @public
		 */
		H1 : "H1",

		/**
		 * Header level 2
		 * @public
		 */
		H2 : "H2",

		/**
		 * Header level 3
		 * @public
		 */
		H3 : "H3",

		/**
		 * Header level 4
		 * @public
		 */
		H4 : "H4",

		/**
		 * Header level 5
		 * @public
		 */
		H5 : "H5",

		/**
		 * Header level 6
		 * @public
		 */
		H6 : "H6"

	};


	/**
	 *
	 *   Interface for controls which are suitable as a Header, Subheader or Footer of a Page.
	 *   If the control does not want to get a context base style class, it has to implement the isContextSensitive method and return false
	 *
	 *
	 * @since 1.22
	 * @name sap.m.IBar
	 * @interface
	 * @public
	 * @ui5-metamodel This interface also will be described in the UI5 (legacy) designtime metamodel
	 */


	/**
	 * Allowed tags for the implementation of the IBar interface.
	 *
	 * @enum {string}
	 * @public
	 * @since 1.22
	 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
	 */
	sap.m.IBarHTMLTag = {

		/**
		 * Renders as a div element.
		 * @public
		 */
		Div : "Div",

		/**
		 * Renders as a header element.
		 * @public
		 */
		Header : "Header",

		/**
		 * Renders as a footer element.
		 * @public
		 */
		Footer : "Footer"

	};


	/**
	 *
	 *   Marker interface for controls which are suitable as items for the IconTabBar.
	 *   These controls must implement a method isSelectable().
	 *
	 *
	 * @name sap.m.IconTab
	 * @interface
	 * @public
	 * @ui5-metamodel This interface also will be described in the UI5 (legacy) designtime metamodel
	 */


	/**
	 *
	 *   Marker interface for controls which are suitable as items of the group aggregation of sap.m.Semantic.MasterPage.
	 *
	 *
	 * @name sap.m.semantic.IGroup
	 * @interface
	 * @public
	 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
	 */


	/**
	 *
	 *   Marker interface for controls which are suitable as items of the filter aggregation of sap.m.Semantic.MasterPage.
	 *
	 *
	 * @name sap.m.semantic.IFilter
	 * @interface
	 * @public
	 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
	 */


	/**
	 *
	 *   Marker interface for controls which are suitable as items of the sort aggregation of sap.m.Semantic.MasterPage.
	 *
	 *
	 * @name sap.m.semantic.ISort
	 * @interface
	 * @public
	 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
	 */


		/**
	 * Available Filter Item Design.
	 *
	 * @enum {string}
	 * @public
	 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
	 */
	sap.m.IconTabFilterDesign = {

		/**
		 * A horizontally layouted design providing more space for texts.
		 * @public
		 */
		Horizontal : "Horizontal",

		/**
		 * A vertically layouted design using minimum horizontal space.
		 * @public
		 */
		Vertical : "Vertical"

	};

	/**
	* Determines how the source image is used on the output DOM element.
	*
	* @enum {string}
	* @public
	* @since 1.30.0
	* @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
	*/
	sap.m.ImageMode = {

		/**
		* The image is rendered with 'img' tag and the 'src' property is set to the src attribute on the output DOM element.
		* @public
		*/
		Image: "Image",

		/**
		* The image is rendered with 'span' tag and the 'src' property is set to the 'background-image' CSS style on the output DOM element
		* @public
		*/
		Background: "Background"

	};

	/**
	 * A subset of input types that fit to a simple API returning one string.
	 * Not available on purpose: button, checkbox, hidden, image, password, radio, range, reset, search, submit.
	 *
	 * @enum {string}
	 * @public
	 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
	 */
	sap.m.InputType = {

		/**
		 * default (text)
		 * @public
		 */
		Text : "Text",

		/**
		 * An input control for specifying a date value. The user can select a month, day of the month, and year.
		 * @public
		 * @deprecated Since version 1.9.1.
		 * Please use sap.m.DateTimeInput control with type "Date" to create date input.
		 */
		Date : "Date",

		/**
		 * An input control for specifying a date and time value. The user can select a month, day of the month, year, and time of day.
		 * @public
		 * @deprecated Since version 1.9.1.
		 * Please use dedicated sap.m.DateTimeInput control with type "DateTime" to create date-time input.
		 */
		Datetime : "Datetime",

		/**
		 * An input control for specifying a date and time value where the format depends on the locale.
		 * @public
		 * @deprecated Since version 1.9.1.
		 * Please use dedicated sap.m.DateTimeInput control with type "DateTime" to create date-time input.
		 */
		DatetimeLocale : "DatetimeLocale",

		/**
		 * A text field for specifying an email address. Brings up a keyboard optimized for email address entry.
		 * @public
		 */
		Email : "Email",

		/**
		 * An input control for selecting a month.
		 * @public
		 * @deprecated Since version 1.9.1.
		 * There is no cross-platform support. Please do not use this Input type.
		 */
		Month : "Month",

		/**
		 * A text field for specifying a number. Brings up a number pad keyboard. Specifying an input type of \d* or [0-9]* is equivalent to using this type.
		 * @public
		 */
		Number : "Number",

		/**
		 * A text field for specifying a phone number. Brings up a phone pad keyboard.
		 * @public
		 */
		Tel : "Tel",

		/**
		 * An input control for specifying a time value. The user can select the hour, minute, and optionally AM or PM.
		 * @public
		 * @deprecated Since version 1.9.1.
		 * Please use dedicated sap.m.DateTimeInput control with type "Time" to create time input.
		 */
		Time : "Time",

		/**
		 * A text field for specifying a URL. Brings up a keyboard optimized for URL entry.
		 * @public
		 */
		Url : "Url",

		/**
		 * An input control for selecting a week.
		 * @public
		 * @deprecated Since version 1.9.1.
		 * There is no cross-platform support. Please do not use this Input type.
		 */
		Week : "Week",

		/**
		 * Password input where the user entry cannot be seen.
		 * @public
		 */
		Password : "Password"

	};


	/**
	 * Available label display modes.
	 *
	 * @enum {string}
	 * @public
	 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
	 */
	sap.m.LabelDesign = {

		/**
		 * Displays the label in bold.
		 * @public
		 */
		Bold : "Bold",

		/**
		 * Displays the label in normal mode.
		 * @public
		 */
		Standard : "Standard"

	};


	/**
	 * Defines the different header styles.
	 *
	 * @enum {string}
	 * @public
	 * @deprecated Since version 1.16.
	 * Has no functionality since 1.16.
	 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
	 */
	sap.m.ListHeaderDesign = {

		/**
		 * Standard header style
		 * @public
		 */
		Standard : "Standard",

		/**
		 * Plain header style
		 * @public
		 */
		Plain : "Plain"

	};


	/**
	 * Defines the mode of the list.
	 *
	 * @enum {string}
	 * @public
	 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
	 */
	sap.m.ListMode = {

		/**
		 * Default mode (no selection).
		 * @public
		 */
		None : "None",

		/**
		 * Right-positioned single selection mode (only one list item can be selected).
		 * @public
		 */
		SingleSelect : "SingleSelect",

		/**
		 * Left-positioned single selection mode (only one list item can be selected).
		 * @public
		 */
		SingleSelectLeft : "SingleSelectLeft",

		/**
		 * Selected item is highlighted but no selection control is visible (only one list item can be selected).
		 * @public
		 */
		SingleSelectMaster : "SingleSelectMaster",

		/**
		 * Multi selection mode (more than one list item can be selected).
		 * @public
		 */
		MultiSelect : "MultiSelect",

		/**
		 * Delete mode (only one list item can be deleted via provided delete button)
		 * @public
		 */
		Delete : "Delete"

	};


	/**
	 * Defines which separator style will be applied for the items.
	 *
	 * @enum {string}
	 * @public
	 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
	 */
	sap.m.ListSeparators = {

		/**
		 * Separators between the items including the last and the first one.
		 * @public
		 */
		All : "All",

		/**
		 * Separators between the items.
		 * <b>Note:</b> This enumeration depends on the theme.
		 * @public
		 */
		Inner : "Inner",

		/**
		 * No item separators.
		 * @public
		 */
		None : "None"

	};


	/**
	 * Defines the visual indication and behaviour of the list items.
	 *
	 * @enum {string}
	 * @public
	 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
	 */
	sap.m.ListType = {

		/**
		 * Indicates the list item does not have any active feedback when item is pressed.
		 * <b>Note:</b> <code>Inactive</code> type cannot be used to disable list items.
		 * @public
		 */
		Inactive : "Inactive",

		/**
		 * Enables detail button of the list item that fires <code>detailPress</code> event.
		 * Also see {@link sap.m.ListBase#attachDetailPress}.
		 * @public
		 */
		Detail : "Detail",

		/**
		 * Indicates the list item is navigable to show extra information about the item.
		 * @public
		 */
		Navigation : "Navigation",

		/**
		 * Indicates that the item is clickable via active feedback when item is pressed.
		 * @public
		 */
		Active : "Active",

		/**
		 * Enables {@link sap.m.ListType#Detail} and {@link sap.m.ListType#Active} enumerations together.
		 * @public
		 */
		DetailAndActive : "DetailAndActive"

	};

	/**
	 * Defines the priorities of the controls within sap.m.OverflowToolbar
	 *
	 * @enum {string}
	 * @public
	 * @since 1.32
	 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
	 */
	sap.m.OverflowToolbarPriority = {

		/**
		 * NeverOverflow priority forces OverflowToolbar items to remain always in the toolbar
		 * @public
		 */
		NeverOverflow : "Never",

		/**
		 * High priority OverflowToolbar items overflow after the items with lower priority
		 * @public
		 */
		High : "High",

		/**
		 * Low priority  OverflowToolbar items overflow before the items with higher priority such as High priority items
		 * @public
		 */
		Low : "Low",

		/**
		 * Disappear priority  OverflowToolbar items overflow before the items with higher priority such as Low and High priority items and remain hidden in the overflow area
		 * @public
		 */
		Disappear : "Disappear",

		/**
		 * AlwaysOverflow priority forces OverflowToolbar items to remain always in the overflow area
		 * @public
		 */
		AlwaysOverflow : "Always"

	};

	/**
	 * Marker interface for controls which are suitable as items for the ObjectHeader.
	 *
	 * @name sap.m.ObjectHeaderContainer
	 * @interface
	 * @public
	 * @ui5-metamodel This interface also will be described in the UI5 (legacy) designtime metamodel
	 */


	/**
	 * Type of Panels used on the Personalization Dialog
	 *
	 * @enum {string}
	 * @public
	 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
	 */
	sap.m.P13nPanelType = {

		/**
		 * Panel type for sorting
		 * @public
		 */
		sort : "sort",

		/**
		 * Panel type for filtering
		 * @public
		 */
		filter : "filter",

		/**
		 * Panel type for grouping
		 * @public
		 */
		group : "group",

		/**
		 * Panel type for columns setting
		 * @public
		 */
		columns : "columns"

	};


	/**
	 * Available Page Background Design.
	 *
	 * @enum {string}
	 * @public
	 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
	 */
	sap.m.PageBackgroundDesign = {

		/**
		 * Standard Page background color.
		 * @public
		 */
		Standard : "Standard",

		/**
		 * Page background color when a List is set as the Page content.
		 * @public
		 */
		List : "List",

		/**
		 * A solid background color dependent on the theme.
		 * @public
		 */
		Solid : "Solid",

		/**
		 * Transparent background for the page.
		 * @public
		 */
		Transparent : "Transparent"

	};

	/**
	 * Types for the placement of popover control.
	 *
	 * @enum {string}
	 * @public
	 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
	 */
	sap.m.PlacementType = {

		/**
		 * Popover will be placed at the left side of the reference control.
		 * @public
		 */
		Left : "Left",

		/**
		 * Popover will be placed at the right side of the reference control.
		 * @public
		 */
		Right : "Right",

		/**
		 * Popover will be placed at the top of the reference control.
		 * @public
		 */
		Top : "Top",

		/**
		 * Popover will be placed at the bottom of the reference control.
		 * @public
		 */
		Bottom : "Bottom",

		/**
		 * Popover will be placed at the top or bottom of the reference control.
		 * @public
		 */
		Vertical : "Vertical",

		/**
		 * Popover will be placed at the top or bottom of the reference control but will try to position on the
		 * top side if the space is greater than the Popover's height.
		 * @public
		 * @since 1.29
		 */
		VerticalPreferedTop : "VerticalPreferedTop",

		/**
		 * Popover will be placed at the top or bottom of the reference control but will try to position on the
		 * bottom side if the space is greater than the Popover's height.
		 * @public
		 * @since 1.29
		 */
		VerticalPreferedBottom : "VerticalPreferedBottom",

		/**
		 * Popover will be placed at the right or left side of the reference control.
		 * @public
		 */
		Horizontal : "Horizontal",

		/**
		 * Popover will be placed at the right or left side of the reference control but will try to position on the
		 * right side if the space is greater than the Popover's width.
		 * @public
		 * @since 1.29
		 */
		HorizontalPreferedRight : "HorizontalPreferedRight",

		/**
		 * Popover will be placed at the right or left side of the reference control but will try to position on the
		 * left side if the space is greater than the Popover's width.
		 * @public
		 * @since 1.29
		 */
		HorizontalPreferedLeft : "HorizontalPreferedLeft",

		/**
		 * Popover will be placed automatically at the reference control.
		 * @public
		 */
		Auto : "Auto"

	};

	/**
	 * QuickViewGroupElement is a combination of one label and another control (Link or Text) associated to this label
	 *
	 * @enum {string}
	 * @public
	 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
	 */
	sap.m.QuickViewGroupElementType = {

		/**
		 * Displays a phone number link for direct dialing
		 * @public
		 */
		phone : "phone",

		/**
		 * Displays a phone number link for direct dialing and an icon for sending a text message
		 * @public
		 */
		mobile : "mobile",

		/**
		 * Displays an e-mail link
		 * @public
		 */
		email : "email",

		/**
		 * Displayes a regular HTML link
		 * @public
		 */
		link : "link",

		/**
		 * Dislpays text
		 * @public
		 */
		text : "text",

		/**
		 * Dislpays a link for navigating to another QuickViewPage
		 * @public
		 */
		pageLink : "pageLink"

	};

	/**
	* Types for the placement of message popover control.
	*
	* @enum {string}
	* @public
	* @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
	*/
	sap.m.VerticalPlacementType = {

		/**
		* Popover will be placed at the top of the reference control.
		* @public
		*/
		Top : "Top",

		/**
		* Popover will be placed at the bottom of the reference control.
		* @public
		*/
		Bottom : "Bottom",

		/**
		* Popover will be placed at the top or bottom of the reference control.
		* @public
		*/
		Vertical : "Vertical"
	};

	/**
	 * Defines the display of table pop-ins
	 *
	 * @enum {string}
	 * @public
	 * @since 1.13.2
	 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
	 */
	sap.m.PopinDisplay = {

		/**
		 * Inside the table popin, header is displayed at the first line and cell content is displayed at the next line.
		 * @public
		 */
		Block : "Block",

		/**
		 * Inside the table popin, cell content is displayed next to the header in the same line. Note: If there is not enough space for the cell content then it jumps to the next line.
		 * @public
		 */
		Inline : "Inline",


		/**
		 * Inside the table popin, only the cell content will be visible.
		 * @public
		 * @since 1.28
		 */
		WithoutHeader : "WithoutHeader"
	};


	/**
	 * Possible values for the visualization of float values in the RatingIndicator Control.
	 *
	 * @enum {string}
	 * @public
	 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
	 */
	sap.m.RatingIndicatorVisualMode = {

		/**
		 * Values are rounded to the nearest integer value (e.g. 1.7 -> 2).
		 * @public
		 */
		Full : "Full",

		/**
		 * Values are rounded to the nearest half value (e.g. 1.7 -> 1.5).
		 * @public
		 */
		Half : "Half"

	};


	/**
	 * Breakpoint names for different screen sizes.
	 *
	 * @enum {string}
	 * @public
	 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
	 */
	sap.m.ScreenSize = {

		/**
		 * 240px wide
		 * @public
		 */
		Phone : "Phone",

		/**
		 * 600px wide
		 * @public
		 */
		Tablet : "Tablet",

		/**
		 * 1024px wide
		 * @public
		 */
		Desktop : "Desktop",

		/**
		 * 240px wide
		 * @public
		 */
		XXSmall : "XXSmall",

		/**
		 * 320px wide
		 * @public
		 */
		XSmall : "XSmall",

		/**
		 * 480px wide
		 * @public
		 */
		Small : "Small",

		/**
		 * 560px wide
		 * @public
		 */
		Medium : "Medium",

		/**
		 * 768px wide
		 * @public
		 */
		Large : "Large",

		/**
		 * 960px wide
		 * @public
		 */
		XLarge : "XLarge",

		/**
		 * 1120px wide
		 * @public
		 */
		XXLarge : "XXLarge"

	};


	/**
	 * Enumeration for different Select types.
	 *
	 * @enum {string}
	 * @public
	 * @since 1.16
	 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
	 */
	sap.m.SelectType = {

		/**
		 * Will show the text.
		 * @public
		 */
		Default : "Default",

		/**
		 * Will show only the specified icon.
		 * @public
		 */
		IconOnly : "IconOnly"

	};


	/**
	 * The mode of SplitContainer or SplitApp control to show/hide the master area.
	 *
	 * @enum {string}
	 * @public
	 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
	 */
	sap.m.SplitAppMode = {

		/**
		 * Master will automatically be hidden in portrait mode.
		 * @public
		 */
		ShowHideMode : "ShowHideMode",

		/**
		 * Master will always be shown but in a compressed version when in portrait mode.
		 * @public
		 */
		StretchCompressMode : "StretchCompressMode",

		/**
		 * Master will be shown inside a Popover when in portrait mode
		 * @public
		 */
		PopoverMode : "PopoverMode",

		/**
		 * Master area is hidden initially both in portrait and landscape. Master area can be opened by clicking on the top left corner button or swiping right. Swipe is only enabled on mobile devices. Master will keep the open state when changing the orientation of the device.
		 * @public
		 */
		HideMode : "HideMode"

	};


	/**
	 * Types for StandardTile
	 *
	 * @enum {string}
	 * @public
	 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
	 */
	sap.m.StandardTileType = {

		/**
		 * Tile representing that something needs to be created
		 * @public
		 */
		Create : "Create",

		/**
		 * Monitor tile
		 * @public
		 */
		Monitor : "Monitor",

		/**
		 * Default type
		 * @public
		 */
		None : "None"

	};


	/**
	 * Directions for swipe event.
	 *
	 * @enum {string}
	 * @public
	 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
	 */
	sap.m.SwipeDirection = {

		/**
		 * Swipe from left to right
		 * @public
		 */
		LeftToRight : "LeftToRight",

		/**
		 * Swipe from right to left.
		 * @public
		 */
		RightToLeft : "RightToLeft",

		/**
		 * Both directions (left to right or right to left)
		 * @public
		 */
		Both : "Both"

	};


	/**
	 * Enumaration for different switch types.
	 *
	 * @enum {string}
	 * @public
	 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
	 */
	sap.m.SwitchType = {

		/**
		 * Will show "ON" and "OFF" translated to the current language or the custom text if provided
		 * @public
		 */
		Default : "Default",

		/**
		 * Switch with accept and reject icons
		 * @public
		 */
		AcceptReject : "AcceptReject"

	};


	/**
	 * Types of the Toolbar Design.
	 *
	 * @enum {string}
	 * @public
	 * @since 1.16.8
	 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
	 */
	sap.m.ToolbarDesign = {

		/**
		 * The toolbar can be inserted into other controls and if the design is "Auto" then it inherits the design from parent control.
		 * @public
		 */
		Auto : "Auto",

		/**
		 * The toolbar and its content will be displayed transparent.
		 * @public
		 */
		Transparent : "Transparent",

		/**
		 * The toolbar appears smaller than the regular size to show information(e.g: text, icon).
		 * @public
		 */
		Info : "Info",

		/**
		 * The toolbar has a solid background. Its content will be rendered in a standard way.
		 * @public
		 * @since 1.22
		 */
		Solid : "Solid"

	};
	/*global Element: true */


	//lazy imports for MessageToast
	sap.ui.lazyRequire("sap.m.MessageToast", "show");

	// requires for routing
	sap.ui.lazyRequire("sap.m.routing.RouteMatchedHandler");
	sap.ui.lazyRequire("sap.m.routing.Router");
	sap.ui.lazyRequire("sap.m.routing.Target");
	sap.ui.lazyRequire("sap.m.routing.TargetHandler");
	sap.ui.lazyRequire("sap.m.routing.Targets");

	//enable ios7 support
	if (Device.os.ios && Device.os.version >= 7 && Device.os.version < 8 && Device.browser.name === "sf") {
		jQuery.sap.require("sap.m.ios7");
	}

	//Internal: test the whole page with compact design
	if (/sap-ui-xx-formfactor=compact/.test(location.search)) {
		jQuery("html").addClass("sapUiSizeCompact");
		sap.m._bSizeCompact = true;
	}

	//Internal: test the whole page with compact design
	if (/sap-ui-xx-formfactor=condensed/.test(location.search)) {
		jQuery("html").addClass("sapUiSizeCondensed");
		sap.m._bSizeCondensed = true;
	}

	// central mobile functionality that should not go into the UI5 Core can go from here
	// ----------------------------------------------------------------------------------

	!(function(oLib) {

		/**
		 * Returns invalid date value of UI5
		 *
		 * @deprecated Since 1.12 UI5 returns null for invalid date
		 * @returns {null}
		 * @public
		 * @since 1.10
		 * @name sap.m#getInvalidDate
		 * @function
		 */
		oLib.getInvalidDate = function() {
			return null;
		};


		/**
		 * Finds default locale settings once and returns always the same.
		 * We should not need to create new instance to get same locale settings
		 * This method keep the locale instance in the scope and returns the same after first run
		 *
		 * @return {Object} sap.ui.core.Locale instane
		 * @public
		 * @since 1.10
		 * @name sap.m#getLocale
		 * @function
		 */
		oLib.getLocale = function() {
			var oConfig = sap.ui.getCore().getConfiguration(),
				sLocale = oConfig.getFormatSettings().getFormatLocale().toString(),
				oLocale = new sap.ui.core.Locale(sLocale);

			oConfig = sLocale = null; //maybe helps GC
			oLib.getLocale = function() {
				return oLocale;
			};

			return oLocale;
		};

		/**
		 * Finds default locale data once and returns always the same
		 *
		 * @return {Object} sap.ui.core.LocaleData instance
		 * @public
		 * @since 1.10
		 * @name sap.m#getLocaleData
		 * @function
		 */
		oLib.getLocaleData = function() {
			jQuery.sap.require("sap.ui.model.type.Date");
			var oLocaleData = sap.ui.core.LocaleData.getInstance(oLib.getLocale());

			oLib.getLocaleData = function() {
				return oLocaleData;
			};

			return oLocaleData;
		};

		/**
		 * Checks if the given parameter is a valid JsDate Object
		 *
		 * @param {any} value Any variable to test.
		 * @return {boolean}
		 * @public
		 * @since 1.10
		 * @name sap.m#isDate
		 * @function
		 */
		oLib.isDate = function(value) {
			return value && Object.prototype.toString.call(value) == "[object Date]" && !isNaN(value);
		};


		/**
		 * Search given control's parents and try to find iScroll
		 *
		 * @param {sap.ui.core.Control} oControl
		 * @return {iScroll|undefined} iScroll reference or undefined if cannot find
		 * @name sap.m#getIScroll
		 * @public
		 * @since 1.11
		 */
		oLib.getIScroll = function(oControl) {
			if (typeof window.iScroll != "function" || !(oControl instanceof sap.ui.core.Control)) {
				return;
			}

			var parent, scroller;
			/*eslint-disable no-cond-assign */
			for (parent = oControl; parent = parent.oParent;) {
				scroller = parent.getScrollDelegate ? parent.getScrollDelegate()._scroller : null;
				if (scroller && scroller instanceof window.iScroll) {
					return scroller;
				}
			}
			/*eslint-enable no-cond-assign */
		};


		/**
		 * Search given control's parents and try to find ScrollDelegate
		 *
		 * @param {sap.ui.core.Control} oControl
		 * @return {Object|undefined} ScrollDelegate or undefined if cannot find
		 * @name sap.m#getScrollDelegate
		 * @public
		 * @since 1.11
		 */
		oLib.getScrollDelegate = function(oControl) {
			if (!(oControl instanceof sap.ui.core.Control)) {
				return;
			}

			/*eslint-disable no-cond-assign */
			for (var parent = oControl; parent = parent.oParent;) {
				if (typeof parent.getScrollDelegate == "function") {
					return parent.getScrollDelegate();
				}
			}
			/*eslint-enable no-cond-assign */
		};

		/**
		 * screen size definitions in pixel
		 * if you change any value here, please also change
		 * 	1. the documentation of sap.m.ScreenSize
		 *  2. media queries in list.css
		 *
		 * @private
		 * @since 1.12
		 * @name sap.m#ScreenSizes
		 */
		oLib.ScreenSizes = {
			phone : 240,
			tablet : 600,
			desktop : 1024,
			xxsmall : 240,
			xsmall : 320,
			small : 480,
			medium : 560,
			large : 768,
			xlarge : 960,
			xxlarge : 1120
		};

		/**
		 * Base font-size
		 * @private
		 * @since 1.12
		 * @name sap.m#BaseFontSize
		 */
		oLib.BaseFontSize = jQuery(document.documentElement).css("font-size");

		/**
		 * Hide the soft keyboard
		 *
		 * @name sap.m#closeKeyboard
		 * @public
		 * @since 1.20
		 */
		oLib.closeKeyboard = function() {
			var activeElement = document.activeElement;
			if (!Device.system.desktop && activeElement && /(INPUT|TEXTAREA)/i.test(activeElement.tagName)) {
				activeElement.blur();
			}
		};

	}(sap.m));


	/**
	 * Touch helper.
	 *
	 * @namespace
	 * @name sap.m.touch
	 * @public
	 **/

	if (sap.m && !sap.m.touch) {

		sap.m.touch = {};
	}

	/**
	 * Given a list of touch objects, find the touch that matches the given one.
	 *
	 * @param {TouchList} oTouchList The list of touch objects to search.
	 * @param {Touch | number} oTouch A touch object to find or a Touch.identifier that uniquely identifies the current finger in the touch session.
	 * @return {object | undefined} The touch matching if any.
	 * @public
	 * @name sap.m.touch.find
	 * @function
	*/
	sap.m.touch.find = function(oTouchList, oTouch) {
		var i,
			iTouchListLength;

		if (!oTouchList) {
			return;
		}

		if (oTouch && typeof oTouch.identifier !== "undefined") {
			oTouch = oTouch.identifier;
		} else if (typeof oTouch !== "number") {
			jQuery.sap.assert(false, 'sap.m.touch.find(): oTouch must be a touch object or a number');
			return;
		}

		iTouchListLength = oTouchList.length;

		// A TouchList is an object not an array, so we shouldn't use
		// Array.prototype.forEach, etc.
		for (i = 0; i < iTouchListLength; i++) {
			if (oTouchList[i].identifier === oTouch) {
				return oTouchList[i];
			}
		}

		// if the given touch object or touch identifier is not found in the touches list, then return undefined
	};

	/**
	 * Given a list of touches, count the number of touches related with the given element.
	 *
	 * @param {TouchList} oTouchList The list of touch objects to search.
	 * @param {jQuery | Element | string} vElement A jQuery element or an element reference or an element id.
	 * @return {number} The number of touches related with the given element.
	 * @public
	 * @name sap.m.touch.countContained
	 * @function
	*/
	sap.m.touch.countContained = function(oTouchList, vElement) {
		var i,
			iTouchCount = 0,
			iTouchListLength,
			iElementChildrenL,
			$TouchTarget;

		if (!oTouchList) {
			return 0;
		}

		if (vElement instanceof Element) {
			vElement = jQuery(vElement);
		} else if (typeof vElement === "string") {
			vElement = jQuery.sap.byId(vElement);
		} else if (!(vElement instanceof jQuery)) {
			jQuery.sap.assert(false, 'sap.m.touch.countContained(): vElement must be a jQuery object or Element reference or a string');
			return 0;
		}

		iElementChildrenL = vElement.children().length;
		iTouchListLength = oTouchList.length;

		// A TouchList is an object not an array, so we shouldn't use
		// Array.prototype.forEach, etc.
		for (i = 0; i < iTouchListLength; i++) {
			$TouchTarget = jQuery(oTouchList[i].target);

			//	If the current target have only one HTML element or
			//	have a HTML element antecessor that match with the given element id.
			if ((iElementChildrenL === 0  && $TouchTarget.is(vElement)) ||
				(vElement[0].contains($TouchTarget[0]))) {

				iTouchCount++;
			}
		}

		return iTouchCount;
	};

	/**
	 * <pre>
	 * URL(Uniform Resource Locator) Helper
	 * This helper can be used to trigger a native application (e.g. email, sms, phone) from the browser.
	 * That means we are restricted of browser or application implementation. e.g.
	 *  - Some browsers do not let you to pass more than 2022 characters in the URL
	 *  - MAPI (Outlook) limit is 2083, max. path under Internet Explorer it is 2048
	 *  - Different Internet Explorer versions have a different limitation (IE9 approximately 1000 characters)
	 *  - MS mail app under Windows 8 cuts mail links after approximately 100 characters
	 *  - Safari gets a confirmation from user before opening a native application and can block other triggers if the user cancels it
	 *  - Some mail applications(Outlook) do not respect all encodings(e.g. Cyrillic texts are not encoded correctly)
	 *
	 * Note: all the given limitation lengths are for encoded text(e.g space character will be encoded to "%20")
	 * </pre>
	 *
	 * @namespace
	 * @name sap.m.URLHelper
	 * @since 1.10
	 * @public
	 */
	sap.m.URLHelper = (function($, window) {

		function isValidString(value) {
			return value && Object.prototype.toString.call(value) == "[object String]";
		}

		function formatTel(sTel) {
			if (!isValidString(sTel)) {
				return "";
			}
			return sTel.replace(/[^0-9\+\*#]/g, "");
		}

		function formatMessage(sText) {
			if (!isValidString(sText)) {
				return "";
			}
			// line breaks in the  body of a message MUST be encoded with "%0D%0A"
			// space character in the  body of a message MUST be encoded with "%20"
			// see http://www.ietf.org/rfc/rfc2368.txt for details
			sText = sText.split(/\r\n|\r|\n/g).join("\r\n");
			return window.encodeURIComponent(sText);
		}

		return $.extend(new sap.ui.base.EventProvider(), {
			/**
			 * Sanitizes the given telephone number and returns a telephone URI scheme.
			 *
			 * @param {String} [sTel] Telephone number
			 * @return {String} Telephone URI scheme
			 * @public
			 * @name sap.m.URLHelper#normalizeTel
			 * @function
			 */
			normalizeTel : function(sTel) {
				return "tel:" + formatTel(sTel);
			},

			/**
			 * Sanitizes the given telephone number and returns SMS URI scheme.
			 *
			 * @param {String} [sTel] Telephone number
			 * @return {String} SMS URI scheme
			 * @public
			 * @name sap.m.URLHelper#normalizeSms
			 * @function
			 */
			normalizeSms : function(sTel) {
				return "sms:" + formatTel(sTel);
			},

			/**
			 * Builds Email URI from given parameter.
			 * Trims spaces from email addresses.
			 *
			 * @param {String} [sEmail] Destination email address
			 * @param {String} [sSubject] Subject of the email address
			 * @param {String} [sBody] Default message text
			 * @param {String} [sCC] Carbon Copy email address
			 * @param {String} [sBCC] Blind carbon copy email address
			 * @return {String} Email URI scheme
			 * @public
			 * @name sap.m.URLHelper#normalizeEmail
			 * @function
			 */
			normalizeEmail : function(sEmail, sSubject, sBody, sCC, sBCC) {
				var aParams = [],
					sURL = "mailto:",
					encode = window.encodeURIComponent;

				// Within mailto URLs, the characters "?", "=", "&" are reserved
				isValidString(sEmail) && (sURL += encode($.trim(sEmail)));
				isValidString(sSubject) && aParams.push("subject=" + encode(sSubject));
				isValidString(sBody) && aParams.push("body=" + formatMessage(sBody));
				isValidString(sBCC) && aParams.push("bcc=" + encode($.trim(sBCC)));
				isValidString(sCC) && aParams.push("cc=" + encode($.trim(sCC)));

				if (aParams.length) {
					sURL += "?" + aParams.join("&");
				}
				return sURL;
			},

			/**
			 * Redirects to the given URL.
			 * This method fires "redirect" event before opening the URL.
			 *
			 * @param {String} sURL Uniform resource locator
			 * @param {boolean} [bNewWindow] Opens URL in a new browser window or tab. Please note that, opening a new window/tab can be ignored by browsers(e.g. on Windows Phone) or by popup blockers.
			 * @public
			 * @name sap.m.URLHelper#redirect
			 * @function
			 */
			redirect : function (sURL, bNewWindow) {
				$.sap.assert(isValidString(sURL), this + "#redirect: URL must be a string" );

				this.fireEvent("redirect", sURL);
				if (!bNewWindow) {
					window.location.href = sURL;
				} else {
					var oWindow = window.open(sURL, "_blank");
					if (!oWindow) {
						$.sap.log.error(this + "#redirect: Could not open " + sURL);
					}
				}
			},

			/**
			 * Adds an event registration for redirect.
			 *
			 * @param {Function} fnFunction The function to call, when the event occurs.
			 * @param {Object} [oListener] The object, that wants to be notified, when the event occurs.
			 * @return {Object} sap.m.URLHelper instance
			 * @public
			 * @name sap.m.URLHelper#attachRedirect
			 * @function
			 */
			attachRedirect : function (fnFunction, oListener) {
				return this.attachEvent("redirect", fnFunction, oListener);
			},

			/**
			 * Detach already registered redirect event.
			 *
			 * @param {Function} fnFunction The function to call, when the event occurs.
			 * @param {Object} [oListener] The object, that wants to be notified, when the event occurs.
			 * @return {Object} sap.m.URLHelper instance
			 * @public
			 * @name sap.m.URLHelper#detachRedirect
			 * @function
			 */
			detachRedirect : function (fnFunction, oListener) {
				return this.detachEvent("redirect", fnFunction, oListener);
			},

			/**
			 * Trigger telephone to call given telephone number.
			 *
			 * @param {String} [sTel] Telephone number
			 * @public
			 * @name sap.m.URLHelper#triggerTel
			 * @function
			 */
			triggerTel : function(sTel) {
				this.redirect(this.normalizeTel(sTel));
			},

			/**
			 * Trigger SMS application to send SMS to given telephone number.
			 *
			 * @param {String} [sTel] Telephone number
			 * @public
			 * @name sap.m.URLHelper#triggerSms
			 * @function
			 */
			triggerSms : function(sTel) {
				this.redirect(this.normalizeSms(sTel));
			},

			/**
			 * Trigger email application to send email.
			 * Trims spaces from email addresses.
			 *
			 * @param {String} [sEmail] Destination email address
			 * @param {String} [sSubject] Subject of the email address
			 * @param {String} [sBody] Default message text
			 * @param {String} [sCC] Carbon Copy email address
			 * @param {String} [sBCC] Blind carbon copy email address
			 * @public
			 * @name sap.m.URLHelper#triggerEmail
			 * @function
			 */
			triggerEmail : function(sEmail, sSubject, sBody, sCC, sBCC) {
				this.redirect(this.normalizeEmail.apply(0, arguments));
			},

			toString : function() {
				return "sap.m.URLHelper";
			}
		});

	}(jQuery, window));


	/**
	 * Helper for rendering themable background
	 *
	 * @namespace
	 * @name sap.m.BackgroundHelper
	 * @since 1.12
	 * @protected
	 */
	sap.m.BackgroundHelper = (function($, window) {

		return {
			/**
			 * Adds CSS classes and styles to the given RenderManager, depending on the given configuration for background color and background image.
			 * To be called by control renderers supporting the global themable background image within their root tag, before they call writeClasses() and writeStyles().
			 *
			 * @param {sap.ui.core.RenderManager} rm the RenderManager
			 * @param {String} [sBgColor] a configured custom background color for the control, if any
			 * @param {sap.ui.core.URI} [sBgImgUrl] the configured custom background image for the control, if any
			 *
			 * @protected
			 * @name sap.m.BackgroundHelper#addBackgroundColorStyles
			 * @function
			 */
			addBackgroundColorStyles: function(rm, sBgColor, sBgImgUrl, sCustomBGClass) {
				rm.addClass(sCustomBGClass || "sapUiGlobalBackgroundColor");

				if (sBgColor || sBgImgUrl) { // when an image or color is configured, the gradient needs to be removed, so the color can be seen behind the image
					rm.addStyle("background-image", "none");
					rm.addStyle("filter", "none");
				}
				if (sBgColor) {
					rm.addStyle("background-color", jQuery.sap.encodeHTML(sBgColor));
				}
			},


			/**
			 * @protected
			 * @returns
			 */
			/* currently not needed
			isThemeBackgroundImageModified: function() {
				jQuery.sap.require("sap.ui.core.theming.Parameters");
				var sBgImgUrl = sap.ui.core.theming.Parameters.get('sapUiGlobalBackgroundImage'); // the global background image from the theme
				if (sBgImgUrl && sBgImgUrl !== "''") {
					var sBgImgUrlDefault = sap.ui.core.theming.Parameters.get('sapUiGlobalBackgroundImageDefault');
					if (sBgImgUrl !== sBgImgUrlDefault) {
						return true;
					}
				}
				return false;
			},
			*/

			/**
			 * Renders an HTML tag into the given RenderManager which carries the background image which is either configured and given or coming from the current theme.
			 * Should be called right after the opening root tag has been completed, so this is the first child element inside the control.
			 *
			 * @param rm the RenderManager
			 * @param {sap.ui.core.Control} oControl the control within which the tag will be rendered; its ID will be used to generate the element ID
			 * @param {String|String[]}  vCssClass a css class or an array of css classes to add to the element
			 * @param {sap.ui.core.URI}  [sBgImgUrl] the image of a configured background image; if this is not given, the theme background will be used and also the other settings are ignored.
			 * @param {boolean} [bRepeat] whether the background image should be repeated/tiled (or stretched)
			 * @param {float}   [fOpacity] the background image opacity, if any
			 *
			 * @protected
			 * @name sap.m.BackgroundHelper#renderBackgroundImageTag
			 * @function
			 */
			renderBackgroundImageTag: function(rm, oControl, vCssClass, sBgImgUrl, bRepeat, fOpacity) {
				rm.write("<div id='" + oControl.getId() + "-BG' ");

				if (jQuery.isArray(vCssClass)) {
					for (var i = 0; i < vCssClass.length; i++) {
						rm.addClass(vCssClass[i]);
					}
				} else {
					rm.addClass(vCssClass);
				}

				rm.addClass("sapUiGlobalBackgroundImage"); // this adds the background image from the theme

				if (sBgImgUrl) { // use the settings only if a background image is configured
					rm.addStyle("display", "block"); // enforce visibility even if a parent has also a background image
					rm.addStyle("background-image", "url(" + jQuery.sap.encodeHTML(sBgImgUrl) + ")");

					rm.addStyle("background-repeat", bRepeat ? "repeat" : "no-repeat");
					if (!bRepeat) {
						rm.addStyle("background-size", "cover");
						rm.addStyle("background-position", "center");
					} else { // repeat
						rm.addStyle("background-position", "left top");
					}

				} //else {
					// the theme defines the background
				//}

				if (fOpacity !== 1) {
					if (fOpacity > 1) { // greater than 1 enforces 1
						fOpacity = 1;
					}
					rm.addStyle("opacity", fOpacity);
				}

				// no custom class from the control's custom class
				// If a class is added using addStyleClass, this class will be output to this background image div without the 'false' param.
				rm.writeClasses(false);
				rm.writeStyles();
				rm.write("></div>");
			}
		};
	}(jQuery, window));

	/**
	 * Helper for Images
	 *
	 * @namespace
	 * @name sap.m.ImageHelper
	 * @since 1.12
	 * @protected
	 */
	sap.m.ImageHelper = (function($, window) {

		/**
		 * Checks if value is not undefined, in which case the
		 * setter function for a given property is called.
		 * Returns true if value is set, false otherwise.
		 *
		 * @private
		 */
		function checkAndSetProperty(oControl, property, value) {
			if (value !== undefined) {
				var fSetter = oControl['set' + jQuery.sap.charToUpperCase(property)];
				if (typeof (fSetter) === "function") {
					fSetter.call(oControl, value);
					return true;
				}
			}
			return false;
		}

		return {
			/**
			 * Creates or updates an image control.
			 *
			 * @param {string} sImgId id of the image to be dealt with.
			 * @param {sap.m.Image} oImageControl the image to update. If undefined, a new image will be created.
			 * @param {sap.ui.core.Control} oParent oImageControl's parentControl.
			 * @param {Map} mProperties map object that contains key value pairs if image propeties. The 'src' property
			 * MUST be contained. Also the map's keys must be names of image properties
			 * @param {Array} aCssClassesToAdd array of css classes which will be added if the image needs to be created.
			 * @param {Array} aCssClassesToRemove all css clases that oImageControl has and which are contained in this array
			 * are removed bevore adding the css classes listed in aCssClassesToAdd.
			 * @returns the new or updated image control
			 *
			 * @protected
			 * @name sap.m.ImageHelper#getImageControl
			 * @function
			 */
			getImageControl: function(sImgId, oImageControl, oParent, mProperties, aCssClassesToAdd, aCssClassesToRemove) {
				jQuery.sap.assert( !!mProperties['src'] , "sap.m.ImageHelper.getImageControl: mProperties do not contain 'src'");

				// make sure, image is rerendered if icon source has changed
				if (oImageControl && (oImageControl.getSrc() != mProperties['src'])) {
					oImageControl.destroy();
					oImageControl = undefined;
				}
				// update or create image control
				var oImage = oImageControl;
				if (!!oImage && (oImage instanceof sap.m.Image || oImage instanceof sap.ui.core.Icon)) {
					//Iterate through properties
					for (var key in mProperties) {
						checkAndSetProperty(oImage, key,  mProperties[key]);
					}
				} else {
					if (!sap.m.Image) {
						jQuery.sap.require("sap.m.Image");
					}
					var mSettings = mProperties;
					//add 'id' to properties. This is required by utility
					//method 'createControlByURI'
					mSettings['id'] = sImgId;
					oImage = sap.ui.core.IconPool.createControlByURI(
							mSettings, sap.m.Image);
					//Set the parent so the image gets re-rendered, when the parent is
					oImage.setParent(oParent, null, true);
				}

				//Remove existing style classes which are contained in aCssClassesToRemove
				//(the list of css classes allowed for deletion) to have them updated later on
				//Unfortunately, there is no other way to do this but remove
				//each class individually
				if (!!aCssClassesToRemove) {
					for (var l = 0, removeLen = aCssClassesToRemove.length; l !== removeLen; l++) {
						oImage.removeStyleClass(aCssClassesToRemove[l]);
					}
				}
				//Add style classes if necessary
				if (!!aCssClassesToAdd) {
					for (var k = 0, len = aCssClassesToAdd.length; k !== len; k++) {
						oImage.addStyleClass(aCssClassesToAdd[k]);
					}
				}
				oImageControl = oImage;
				return oImageControl;
			}
		};
	}(jQuery, window));

	/**
	 * Helper for Popups
	 *
	 * @namespace
	 * @name sap.m.PopupHelper
	 * @since 1.16.7
	 * @protected
	 */
	sap.m.PopupHelper = (function(){
		return {
			/**
			 * This methods converts the percentage value to an absolute number based on the given base number.
			 *
			 * @param {string} sPercentage A percentage value in string format, for example "25%"
			 * @param {float} fBaseSize A float number which the calculation is based on.
			 * @returns The calculated size string with "px" as unit or null when the format of given parameter is wrong.
			 *
			 * @protected
			 * @name sap.m.PopupHelper.calcPercentageSize
			 * @function
			 */
			calcPercentageSize: function(sPercentage, fBaseSize){
				if (typeof sPercentage !== "string") {
					jQuery.sap.log.warning("sap.m.PopupHelper: calcPercentageSize, the first parameter" + sPercentage + "isn't with type string");
					return null;
				}

				if (sPercentage.indexOf("%") <= 0) {
					jQuery.sap.log.warning("sap.m.PopupHelper: calcPercentageSize, the first parameter" + sPercentage + "is not a percentage string (for example '25%')");
					return null;
				}

				var fPercent = parseFloat(sPercentage) / 100,
					fParsedBaseSize = parseFloat(fBaseSize);

				return Math.floor(fPercent * fParsedBaseSize) + "px";
			}
		};
	}());

	/**
	 * Suggestion helper for sap.m.Input fields: Creates a multi column suggest list for a sap.m.Input field based on a ValueList
	 * annotation. The ValueList annotation will be resolved via the binding information of the Input field.
	 *
	 * If the annotation describes multiple input parameter the suggest provider will resolve all of these relative to the
	 * context of the Input filed and use them for the suggestion query. The suggest provider will write all values that are
	 * described as output parameters back to the model (relative to the context of the Input field). This can only be done if
	 * the model runs in "TwoWay" binding mode. Both features can be switched of via the bResolveInput/bResolveOutput parameter
	 * of the suggest function:
	 *
	 * @param {event} oEvent
	 * @param {boolean} bResolveInput SuggestProvider resolves all input parameters for the data query
	 * @param {boolean} bResolveOutput SuggestProvider writes back all output parameters.
	 * @param {int} iLength If iLength is provided only these number of entries will be requested.
	 *
	 * @name sap.m.InputODataSuggestProvider
	 * @since 1.21.2
	 *
	 * @public
	 *
	 */
	sap.m.InputODataSuggestProvider = (function(){
		var _fnSuggestionItemSelected = function(oEvent) {
			var oCtrl = oEvent.getSource();
			var mValueListAnnotation = oCtrl.data(oCtrl.getId() + "-#valueListAnnotation");
			var oModel = oCtrl.getModel();
			var oInputBinding = oCtrl.getBinding("value");
			var sInputPath = oModel.resolve(oInputBinding.getPath(), oInputBinding.getContext());

			if (!mValueListAnnotation) {
				return;
			}
			var oRow = oEvent.getParameter("selectedRow");
			jQuery.each(oRow.getCells(), function(iIndex, oCell) {
				var oCellBinding =  oCell.getBinding("text");
				jQuery.each(mValueListAnnotation.outParameters, function(sKey, oObj) {
					if (!oObj.displayOnly && oObj.value == oCellBinding.getPath()) {
						var oValue = oCellBinding.getValue();
						var sValuePath = oModel.resolve(sKey, oInputBinding.getContext());
						if (oValue && sValuePath !== sInputPath) {
							oModel.setProperty(sValuePath, oValue);
						}
					}
				});
			});
			return true;
		};
		var _setValueListAnnotationData = function(oCtrl, bResolveOutput) {
			var oModel = oCtrl.getModel();
			var oMetadata = oModel.oMetadata;

			var sPath = oModel.resolve(oCtrl.getBindingPath("value"), oCtrl.getBindingContext());

			var mValueListAnnotation = {};
			mValueListAnnotation.searchSupported = false;
			mValueListAnnotation.collectionPath = "";
			mValueListAnnotation.outParameters = {};
			mValueListAnnotation.inParameters = {};
			mValueListAnnotation.selection = [];

			var oAnnotation = oModel.getProperty(sPath + "/#com.sap.vocabularies.Common.v1.ValueList");
			if (!oAnnotation) {
				return false;
			}
			var sProperty = sPath.substr(sPath.lastIndexOf('/') + 1);
			mValueListAnnotation.inProperty = sProperty;

			jQuery.each(oAnnotation.record, function(i, aPropertyValues){
				jQuery.each(aPropertyValues, function(j, oPropertyValue){
					if (oPropertyValue.property === "SearchSupported" && oPropertyValue.bool) {
						mValueListAnnotation.searchSupported = true;
					}
					if (oPropertyValue.property === "CollectionPath") {
						mValueListAnnotation.collectionPath = oPropertyValue.string;
					}
					if (oPropertyValue.property === "Parameters") {
						jQuery.each(oPropertyValue.collection.record, function(k, oRecord) {
							if (oRecord.type === "com.sap.vocabularies.Common.v1.ValueListParameterIn") {
								var sLocalProperty;
								jQuery.each(oRecord.propertyValue, function(m, oPropVal) {
									if (oPropVal.property === "LocalDataProperty") {
										sLocalProperty = oPropVal.propertyPath;
									}
								});
								jQuery.each(oRecord.propertyValue, function(m, oPropVal) {
									if (oPropVal.property === "ValueListProperty") {
										mValueListAnnotation.inParameters[sLocalProperty] = {value:oPropVal.string};
									}
								});
							} else if (oRecord.type === "com.sap.vocabularies.Common.v1.ValueListParameterInOut") {
								var sLocalProperty;
								jQuery.each(oRecord.propertyValue, function(m, oPropVal) {
									if (oPropVal.property === "LocalDataProperty") {
										sLocalProperty = oPropVal.propertyPath;
									}
								});
								jQuery.each(oRecord.propertyValue, function(m, oPropVal) {
									if (oPropVal.property === "ValueListProperty") {
										mValueListAnnotation.outParameters[sLocalProperty] = {value:oPropVal.string};
										mValueListAnnotation.inParameters[sLocalProperty] = {value:oPropVal.string};
									}
								});
							} else if (oRecord.type === "com.sap.vocabularies.Common.v1.ValueListParameterOut") {
								var sLocalProperty;
								jQuery.each(oRecord.propertyValue, function(m, oPropVal) {
									if (oPropVal.property === "LocalDataProperty") {
										sLocalProperty = oPropVal.propertyPath;
									}
								});
								jQuery.each(oRecord.propertyValue, function(m, oPropVal) {
									if (oPropVal.property === "ValueListProperty") {
										mValueListAnnotation.outParameters[sLocalProperty] = {value:oPropVal.string};
									}
								});
							} else if (oRecord.type === "com.sap.vocabularies.Common.v1.ValueListParameterDisplayOnly") {
								var sLocalProperty;
								jQuery.each(oRecord.propertyValue, function(m, oPropVal) {
									if (oPropVal.property === "ValueListProperty") {
										mValueListAnnotation.outParameters[oPropVal.string] = {value:oPropVal.string, displayOnly:true};
									}
								});
							}
						});
					}
				});
			});
			mValueListAnnotation.resultEntity = oMetadata._getEntityTypeByPath("/" + mValueListAnnotation.collectionPath);
			mValueListAnnotation.listItem = new sap.m.ColumnListItem();
			jQuery.each(mValueListAnnotation.outParameters, function(sKey, oObj) {
				mValueListAnnotation.listItem.addCell(new sap.m.Text({text:"{" + oObj.value + "}", wrapping:false}));
				oCtrl.addSuggestionColumn(new sap.m.Column({header: new sap.m.Text({text:"{/#" + mValueListAnnotation.resultEntity.name + "/" + oObj.value + "/@sap:label}", wrapping:false})}));
				mValueListAnnotation.selection.push(oObj.value);
			});
			oCtrl.data(oCtrl.getId() + "-#valueListAnnotation",mValueListAnnotation);
			if (bResolveOutput) {
				oCtrl.attachSuggestionItemSelected(_fnSuggestionItemSelected);
			}
		};
		return {
			suggest: function(oEvent, bResolveInput, bResolveOutput, iLength){
				var mValueListAnnotation,
					oCtrl = oEvent.getSource();

				bResolveInput = bResolveInput === undefined ? true : bResolveInput;
				bResolveOutput = bResolveOutput === undefined ? true : bResolveOutput;

				if (!oCtrl.data(oCtrl.getId() + "-#valueListAnnotation")) {
					_setValueListAnnotationData(oCtrl, bResolveOutput);
				}
				mValueListAnnotation = oCtrl.data(oCtrl.getId() + "-#valueListAnnotation");

				if (!mValueListAnnotation) {
					return;
				}
				var _fnButtonHandler = function(oEvent) {
					var iBindingLength = this.getLength();
					if (iBindingLength && iBindingLength <= iLength) {
						oCtrl.setShowTableSuggestionValueHelp(false);
					} else {
						oCtrl.setShowTableSuggestionValueHelp(true);
					}
				};
				if (mValueListAnnotation.searchSupported) {
					var aFilters = [];
					var sSearchFocus, oCustomParams = {};
					if (bResolveInput) {
						jQuery.each(mValueListAnnotation.inParameters, function(sKey, oObj) {
							if (sKey == mValueListAnnotation.inProperty) {
								sSearchFocus = oObj.value;
							} else if (bResolveInput) {
								var oValue = oCtrl.getModel().getProperty(sKey,oCtrl.getBinding("value").getContext());
								if (oValue) {
									aFilters.push(new sap.ui.model.Filter(oObj.value, sap.ui.model.FilterOperator.StartsWith,oValue));
								}
							}
						});
					}
					oCustomParams.search = oEvent.getParameter("suggestValue");

					if (mValueListAnnotation.inParameters.length) {
						if (sSearchFocus) {
							oCustomParams["search-focus"] = sSearchFocus;
						} else {
							jQuery.sap.assert(false, 'no search-focus defined');
						}
					}

					oCtrl.bindAggregation("suggestionRows",{
						path:"/" + mValueListAnnotation.collectionPath,
						length: iLength,
						filters: aFilters,
						parameters: {
							select: mValueListAnnotation.selection.join(','),
							custom: oCustomParams
						},
						events: {
							dataReceived: _fnButtonHandler
						},
						template: mValueListAnnotation.listItem
					});
				} else {
					//create filter array
					var aFilters = [];
					jQuery.each(mValueListAnnotation.inParameters, function(sKey, oObj) {
						if (sKey == mValueListAnnotation.inProperty) {
							aFilters.push(new sap.ui.model.Filter(oObj.value, sap.ui.model.FilterOperator.StartsWith,oEvent.getParameter("suggestValue")));
						} else if (bResolveInput) {
							var oValue = oCtrl.getModel().getProperty(sKey,oCtrl.getBinding("value").getContext());
							if (oValue) {
								aFilters.push(new sap.ui.model.Filter(oObj.value, sap.ui.model.FilterOperator.StartsWith,oValue));
							}
						}
					});
					oCtrl.bindAggregation("suggestionRows",{
						path:"/" + mValueListAnnotation.collectionPath,
						filters: aFilters,
						template: mValueListAnnotation.listItem,
						length: iLength,
						parameters: {
							select: mValueListAnnotation.selection.join(',')
						},
						events: {
							dataReceived: _fnButtonHandler
						}
					});
				}
			}
		};
	}());

	// implement Form helper factory with m controls
	// possible is set before layout lib is loaded.
	jQuery.sap.setObject("sap.ui.layout.form.FormHelper", {
		createLabel: function(sText){
			return new sap.m.Label({text: sText});
		},
		createButton: function(sId, fPressFunction, oThis){
			var oButton = new sap.m.Button(sId);
			oButton.attachEvent('press', fPressFunction, oThis); // attach event this way to have the right this-reference in handler
			return oButton;
		},
		setButtonContent: function(oButton, sText, sTooltip, sIcon, sIconHovered){
			oButton.setText(sText);
			oButton.setTooltip(sTooltip);
			oButton.setIcon(sIcon);
			oButton.setActiveIcon(sIconHovered);
		},
		addFormClass: function(){ return "sapUiFormM"; },
		bArrowKeySupport: false, /* disables the keyboard support for arrow keys */
		bFinal: true
	});

	//implement FileUploader helper factory with m controls
	jQuery.sap.setObject("sap.ui.unified.FileUploaderHelper", {
		createTextField: function(sId){
			var oTextField = new sap.m.Input(sId);
			return oTextField;
		},
		setTextFieldContent: function(oTextField, sWidth){
			oTextField.setWidth(sWidth);
		},
		createButton: function(){
			var oButton = new sap.m.Button();
			return oButton;
		},
		addFormClass: function(){ return "sapUiFUM"; },
		bFinal: true
	});

	//implement table helper factory with m controls
	//possible is set before layout lib is loaded.
	jQuery.sap.setObject("sap.ui.table.TableHelper", {
		createLabel: function(mConfig){
			return new sap.m.Label(mConfig);
		},
		createTextView: function(mConfig){
			return new sap.m.Label(mConfig);
		},
		createTextField: function(mConfig){
			return new sap.m.Input(mConfig);
		},
		createImage: function(mConfig){
			var oImage = new sap.m.Image(mConfig);
			oImage.setDensityAware(false); // by default we do not have density aware images in the Table
			return oImage;
		},
		addTableClass: function() { return "sapUiTableM"; },
		bFinal: true
	});


	/* Android and Blackberry browsers do not scroll a focused input into the view correctly after resize */
	if (sap.ui.Device.os.blackberry || sap.ui.Device.os.android && sap.ui.Device.os.version >= 4) {
		jQuery(window).on("resize", function(){
			var oActive = document.activeElement;
			var sTagName = oActive ? oActive.tagName : "";
			if (sTagName == "INPUT" || sTagName == "TEXTAREA") {
				window.setTimeout(function(){
					oActive.scrollIntoViewIfNeeded();
				}, 0);
			}
		});
	}

	return sap.m;

});
