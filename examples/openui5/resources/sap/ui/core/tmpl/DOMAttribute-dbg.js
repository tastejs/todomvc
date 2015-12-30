/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.core.tmpl.DOMAttribute.
sap.ui.define(['sap/ui/core/Element', 'sap/ui/core/library'],
	function(Element, library) {
	"use strict";


	
	/**
	 * Constructor for a new tmpl/DOMAttribute.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * Represents a DOM attribute of a DOM element.
	 * @extends sap.ui.core.Element
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @experimental Since version 1.15. 
	 * The templating might be changed in future versions.
	 * @alias sap.ui.core.tmpl.DOMAttribute
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var DOMAttribute = Element.extend("sap.ui.core.tmpl.DOMAttribute", /** @lends sap.ui.core.tmpl.DOMAttribute.prototype */ { metadata : {
	
		library : "sap.ui.core",
		properties : {
	
			/**
			 * Name of the DOM attribute
			 */
			name : {type : "string", group : "Data", defaultValue : null},
	
			/**
			 * Value of the DOM attribute
			 */
			value : {type : "string", group : "Data", defaultValue : null}
		}
	}});
	
	DOMAttribute.prototype.setValue = function(sValue) {
		this.setProperty("value", sValue, true); // no re-rendering!
		// do DOM modification to avoid re-rendering
		var oParent = this.getParent(),
			$this = oParent && oParent.$();
		if ($this && $this.length > 0) {
			$this.attr(this.getName(), this.getProperty("value"));
		}
		return this;
	};
	

	return DOMAttribute;

});
