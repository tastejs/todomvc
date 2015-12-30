/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.commons.form.Form.
sap.ui.define(['jquery.sap.global', 'sap/ui/commons/library', 'sap/ui/layout/form/Form'],
	function(jQuery, library, Form1) {
	"use strict";


	
	/**
	 * Constructor for a new form/Form.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * Form control.
	 * Holder for form control to be rendered in a specific form layout.
	 * A Form supports VariantLayoutData for it's conent to allow a simple switching of Layouts.
	 * @extends sap.ui.layout.form.Form
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @since 1.9.1
	 * @deprecated Since version 1.16.0. 
	 * moved to sap.ui.layout library. Please use this one.
	 * @alias sap.ui.commons.form.Form
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var Form = Form1.extend("sap.ui.commons.form.Form", /** @lends sap.ui.commons.form.Form.prototype */ { metadata : {
	
		deprecated : true,
		library : "sap.ui.commons"
	}});
	
	/**
	 * This file defines behavior for the control,
	 */
	
	/* Overwrite to have right "since" in there */
	
	/**
	* Getter for property <code>visible</code>.
	* Invisible Forms are not rendered.
	*
	* Default value is <code>true</code>
	*
	* @return {boolean} the value of property <code>visible</code>
	* @public
	* @since 1.12.0
	* @name sap.ui.commons.form.Form#getVisible
	* @function
	*/
	
	/**
	* Setter for property <code>visible</code>.
	*
	* Default value is <code>true</code>
	*
	* @param {boolean} bVisible new value for property <code>visible</code>
	* @return {sap.ui.commons.form.Form} <code>this</code> to allow method chaining
	* @public
	* @since 1.12.0
	* @name sap.ui.commons.form.Form#setVisible
	* @function
	*/

	return Form;

}, /* bExport= */ true);
