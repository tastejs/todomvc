/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.commons.Title.
sap.ui.define(['jquery.sap.global', './library', 'sap/ui/core/Title'],
	function(jQuery, library, Title1) {
	"use strict";


	
	/**
	 * Constructor for a new Title.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * Represents a title element that can be used for aggregation with other controls
	 * @extends sap.ui.core.Title
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @deprecated Since version 1.16.0. 
	 * moved to sap.ui.core library. Please use this one.
	 * @alias sap.ui.commons.Title
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var Title = Title1.extend("sap.ui.commons.Title", /** @lends sap.ui.commons.Title.prototype */ { metadata : {
	
		deprecated : true,
		library : "sap.ui.commons"
	}});
	
	/* Overwrite to have right "since" in there */
	
	/**
	* Getter for property <code>level</code>.
	* Defines the level of the title. If set to auto the level of the title is chosen by the control rendering the title.
	*
	* Currently not all controls using the Title.control supporting this property.
	*
	* Default value is <code>Auto</code>
	*
	* @return {sap.ui.commons.TitleLevel} the value of property <code>level</code>
	* @public
	* @since 1.9.1
	* @name sap.ui.commons.Title#getLevel
	* @function
	*/
	/**
	* Setter for property <code>level</code>.
	*
	* Default value is <code>Auto</code>
	*
	* @param {sap.ui.commons.TitleLevel} oLevel new value for property <code>level</code>
	* @return {sap.ui.commons.Title} <code>this</code> to allow method chaining
	* @public
	* @since 1.9.1
	* @name sap.ui.commons.Title#setLevel
	* @function
	*/

	return Title;

}, /* bExport= */ true);
