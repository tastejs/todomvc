/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.core.search.OpenSearchProvider.
sap.ui.define(['jquery.sap.global', 'sap/ui/core/library', './SearchProvider', 'jquery.sap.encoder'],
	function(jQuery, library, SearchProvider/* , jQuerySap */) {
	"use strict";


	
	/**
	 * Constructor for a new search/OpenSearchProvider.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * A SearchProvider which uses the OpenSearch protocol (either JSON or XML).
	 * @extends sap.ui.core.search.SearchProvider
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @alias sap.ui.core.search.OpenSearchProvider
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var OpenSearchProvider = SearchProvider.extend("sap.ui.core.search.OpenSearchProvider", /** @lends sap.ui.core.search.OpenSearchProvider.prototype */ { metadata : {
	
		library : "sap.ui.core",
		properties : {
	
			/**
			 * The URL for suggestions of the search provider. As placeholder for the concrete search queries '{searchTerms}' must be used. For cross domain requests maybe a proxy must be used.
			 */
			suggestUrl : {type : "sap.ui.core.URI", group : "Misc", defaultValue : null},
	
			/**
			 * The type of data which is provided by the given suggestUrl: either 'json' or 'xml'.
			 */
			suggestType : {type : "string", group : "Misc", defaultValue : 'json'}
		}
	}});
	
	
	/**
	 * Call this function to get suggest values from the search provider.
	 * The given callback function is called with the suggest value (type 'string', 1st parameter)
	 * and an array of the suggestions (type '[string]', 2nd parameter).
	 *
	 * @param {string} sValue The value for which suggestions are requested.
	 * @param {function} fCallback The callback function which is called when the suggestions are available.
	 * @type void
	 * @public
	 */
	OpenSearchProvider.prototype.suggest = function(sValue, fCallback) {
		var sUrl = this.getSuggestUrl();
		if (!sUrl) {
			return;
		}
		sUrl = sUrl.replace("{searchTerms}", jQuery.sap.encodeURL(sValue));
	
		var sType = this.getSuggestType();
		var fSuccess;
		if (sType && sType.toLowerCase() === "xml") {
			//Docu: http://msdn.microsoft.com/en-us/library/cc891508%28v=vs.85%29.aspx
			sType = "xml";
			fSuccess = function(data){
				var jXMLDocument = jQuery(data);
				var jItems = jXMLDocument.find("Text");
				var aSuggestions = [];
				jItems.each(function(){
					aSuggestions.push(jQuery(this).text());
				});
				fCallback(sValue, aSuggestions);
			};
		} else {
			//Docu: http://www.opensearch.org/Specifications/OpenSearch/Extensions/Suggestions/1.1#Response_format
			sType = "json";
			fSuccess = function(data){
				fCallback(sValue, data[1]);
			};
		}
	
		jQuery.ajax({
			url: sUrl,
			dataType: sType,
			success: fSuccess,
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				jQuery.sap.log.fatal("The following problem occurred: " + textStatus, XMLHttpRequest.responseText + ","
						+ XMLHttpRequest.status);
			}
		});
	};
	

	return OpenSearchProvider;

});
