/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

/*
 * Provides convenience functions for synchronous communication, based on the jQuery.ajax() function.
 */
sap.ui.define(['jquery.sap.global'],
	function(jQuery) {
	"use strict";

	jQuery.sap.sjaxSettings = {
		/**
		 * Whether to return an object consisting of data and status and error codes or only the simple data
		 */
		complexResult: true,

		/**
		 * fallback value when complexResult is set to false and an error occurred. Then fallback will be returned.
		 */
		fallback: undefined
	};

	/**
	 * Convenience wrapper around <code>jQuery.ajax()</code> that avoids the need for callback functions when
	 * synchronous calls are made. If the setting <code>complexResult</code> is true (default), then the return value
	 * is an object with the following properties
	 * <ul>
	 * <li><code>success</code> boolean whether the call succeeded or not
	 * <li><code>data</code> any the data returned by the call. For dataType 'text' this is a string,
	 *                       for JSON it is an object, for XML it is a document. When the call failed, then data is not defined
	 * <li><code>status</code> string a textual status ('success,', 'error', 'timeout',...)
	 * <li><code>statusCode</code> string the HTTP status code of the request
	 * <li><code>error</code> Error an error object (exception) in case an error occurred
	 * <li><code>errorText</code> string an error message in case an error occurred
	 * </ul>
	 *
	 * When <code>complexResult</code> is false, then in the case of success, only 'data' is returned, in case of an error the
	 * 'fallback' setting is returned (defaults to undefined).
	 *
	 * Note that async=false is always enforced by this method.
	 *
	 * @param {string} oOrigSettings the ajax() settings
	 * @return result, see above
	 *
	 * @public
	 * @since 0.9.0
	 * @SecSink {0|PATH} Parameter is used for future HTTP requests
	 */
	jQuery.sap.sjax = function sjax(oOrigSettings) {

		var s = jQuery.extend(true, {}, jQuery.sap.sjaxSettings, oOrigSettings,

			// the following settings are enforced as this is the rightmost object in the extend call
			{
				async: false,
				success : function(data, textStatus, xhr) {
//					oResult = { success : true, data : data, status : textStatus, statusCode : xhr.status };
					oResult = { success : true, data : data, status : textStatus, statusCode : xhr && xhr.status };
				},
				error : function(xhr, textStatus, error) {
					oResult = { success : false, data : undefined, status : textStatus, error : error, statusCode : xhr.status, errorResponse :  xhr.responseText};
				}
			});

		var oResult;

		jQuery.ajax(s);

		if (!s.complexResult) {
			return oResult.success ? oResult.data : s.fallback;
		}

		return oResult;
	};

	/**
	 * Convenience wrapper that checks whether a given web resource could be accessed.
	 * @SecSink {0|PATH} Parameter is used for future HTTP requests
	 * @SecSource {return} Returned value is under control of an external resource
	 */
	jQuery.sap.syncHead = function(sUrl) {
		return jQuery.sap.sjax({type:'HEAD', url: sUrl}).success;
	};

	/**
	 * Convenience wrapper for {@link jQuery.sap.sjax} that enforeces the Http method GET and defaults the
	 * data type of the result to 'text'.
	 *
	 * @param {string} sUrl the URL
	 * @param {string|object} data request parameters in the format accepted by jQuery.ajax()
	 * @param {string} [sDataType='text'] the type of data expected from the server, default is "text"
	 * @return result @see jQuery.sap.sjax
	 *
	 * @public
	 * @since 0.9.0
	 * @SecSink {0 1|PATH} Parameter is used for future HTTP requests
	 * @SecSource {return} Returned value is under control of an external resource
	 */
	jQuery.sap.syncGet = function syncGet(sUrl, data, sDataType) {
		return jQuery.sap.sjax({
			url: sUrl,
			data: data,
			type: 'GET',
			dataType: sDataType || 'text'
		});
	};

	/**
	 * Convenience wrapper for {@link jQuery.sap.sjax} that enforces the Http method POST and defaults the
	 * data type of the result to 'text'.
	 *
	 * @param {string} sUrl the URL
	 * @param {string|object} data request parameters in the format accepted by jQuery.ajax()
	 * @param {string} [sDataType='text'] the type of data expected from the server, default is "text"
	 * @return result @see jQuery.sap.sjax
	 *
	 * @public
	 * @since 0.9.0
	 * @SecSink {0 1|PATH} Parameter is used for future HTTP requests
	 * @SecSource {return} Returned value is under control of an external resource
	 */
	jQuery.sap.syncPost = function syncPost(sUrl, data, sDataType) {
		return jQuery.sap.sjax({
			url: sUrl,
			data: data,
			type: 'POST',
			dataType: sDataType || 'text'
		});
	};

	/**
	 * Convenience wrapper for {@link jQuery.sap.sjax} that enforces the Http method GET and the data type 'text'.
	 * If a fallback value is given, the function simply returns the response as a text or - if some error occurred -
	 * the fallback value. This is useful for applications that don't require detailed error diagnostics.
	 *
	 * If applications need to know about occurring errors, they can either call <code>sjax()</code> directly
	 * or they can omit the fallback value (providing only two parameters to syncGetText()).
	 * They then receive the same complex result object as for the sjax() call.
	 *
	 * @param {string} sUrl the URL
	 * @param {string|object} data request parameters in the format accepted by jQuery.ajax()
	 * @param {string} [fallback] if set, only data is returned (and this fallback instead in case of errors); if unset, a result structure is returned
	 * @return  result @see jQuery.sap.sjax
	 *
	 * @public
	 * @since 0.9.0
	 * @SecSink {0 1|PATH} Parameter is used for future HTTP requests
	 */
	jQuery.sap.syncGetText = function syncGetText(sUrl, data, fallback) {
		return jQuery.sap.sjax({
			url: sUrl,
			data: data,
			type: 'GET',
			dataType: 'text',
			fallback: fallback,
			complexResult : (arguments.length < 3)
		});
	};

	/**
	 * Convenience wrapper for {@link jQuery.sap.sjax} that enforces the Http method GET and the data type 'json'.
	 * If a fallback value is given, the function simply returns the response as an object or - if some error occurred -
	 * the fallback value. This is useful for applications that don't require detailed error diagnostics.
	 *
	 * If applications need to know about occurring errors, they can either call <code>sjax()</code> directly
	 * or they can omit the fallback value (providing only two parameters to syncGetJSON()).
	 * They then receive the same complex result object as for the sjax() call.
	 *
	 * Note that providing "undefined" or "null" as a fallback is different from omitting the fallback (complex result).
	 *
	 * @param {string} sUrl the URL
	 * @param {string|object} data request parameters in the format accepted by jQuery.ajax()
	 * @param {object} [fallback] if set, only data is returned (and this fallback instead in case of errors); if unset, a result structure is returned
	 * @return result @see jQuery.sap.sjax
	 *
	 * @public
	 * @since 0.9.0
	 * @SecSink {0 1|PATH} Parameter is used for future HTTP requests
	 */
	jQuery.sap.syncGetJSON = function syncGetJSON(sUrl, data, fallback) {
		return jQuery.sap.sjax({
			url: sUrl,
			data: data || null,
			type: 'GET',
			dataType: 'json',
			fallback: fallback,
			complexResult : (arguments.length < 3)
		});
	};

	return jQuery;

});
