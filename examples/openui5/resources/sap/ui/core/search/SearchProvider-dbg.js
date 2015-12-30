/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.core.search.SearchProvider.
sap.ui.define(['jquery.sap.global', 'sap/ui/core/Element', 'sap/ui/core/library'],
	function(jQuery, Element, library) {
	"use strict";


	
	/**
	 * Constructor for a new search/SearchProvider.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * Abstract base class for all SearchProviders which can be e.g. attached to a SearchField. Do not create instances of this class, but use a concrete sub class instead.
	 * @extends sap.ui.core.Element
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @alias sap.ui.core.search.SearchProvider
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var SearchProvider = Element.extend("sap.ui.core.search.SearchProvider", /** @lends sap.ui.core.search.SearchProvider.prototype */ { metadata : {
	
		library : "sap.ui.core",
		properties : {
	
			/**
			 * Icon of the Search Provider
			 */
			icon : {type : "string", group : "Misc", defaultValue : null}
		}
	}});
	
	
	/**
	 * Call this function to get suggest values from the search provider.
	 * The given callback function is called with the suggest value (type 'string', 1st parameter)
	 * and an array of the suggestions (type '[string]', 2nd parameter).
	 *
	 * @param {string} sValue The value for which suggestions are requested.
	 * @param {function} fnCallback The callback function which is called when the suggestions are available.
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	SearchProvider.prototype.suggest = function(sValue, fnCallback) {
		jQuery.sap.log.warning("sap.ui.core.search.SearchProvider is the abstract base class for all SearchProviders. Do not create instances of this class, but use a concrete sub class instead.");
	};
	

	return SearchProvider;

});
