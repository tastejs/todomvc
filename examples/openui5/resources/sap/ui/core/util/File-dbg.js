/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides class sap.ui.core.util.File
sap.ui.define(['jquery.sap.global', 'sap/ui/Device'],
	function(jQuery, Device) {
	'use strict';

	/**
	 * Utility class to handle files.
	 *
	 * @class Utility class to handle files
	 * @author SAP SE
	 * @version 1.32.9
	 * @static
	 *
	 * @public
	 * @since 1.22.0
	 * @alias sap.ui.core.util.File
	 */
	var File = {

		/**
		 * <p>Triggers a download / save action of the given file.</p>
		 *
		 * <p>There are limitations for this feature in some browsers:<p>
		 *
		 * <p><b>Internet Explorer 8 / 9</b><br>
		 * Some file extensions on some operating systems are not working due to a bug in IE.
		 * Therefore 'txt' will be used as file extension if the problem is occurring.</p>
		 *
		 * <p><b>Safari (OS X / iOS)</b><br>
		 * A new window/tab will be opened. In OS X the user has to manually save the file (CMD + S), choose "page source" and specify a filename.
		 * In iOS the content can be opened in another app (Mail, Notes, ...) or copied to the clipboard.
		 * In case the popup blocker prevents this action, an error will be thrown which can be used to notify the user to disable it.</p>
		 *
		 * <p><b>Android Browser</b><br>
		 * Not supported</p>
		 *
		 * @param {string} sData file content
		 * @param {string} sFileName file name
		 * @param {string} sFileExtension file extension
		 * @param {string} sMimeType file mime-type
		 * @param {string} sCharset file charset
		 *
		 * @public
		 */
		save: function(sData, sFileName, sFileExtension, sMimeType, sCharset) {
			var sFullFileName = sFileName + '.' + sFileExtension;

			// prepend utf-8 byte-order-mark (BOM) to prevent encoding issues in .csv files
			if (sCharset === 'utf-8' && sFileExtension === 'csv') {
				sData = '\ufeff' + sData;
			}

			if (window.Blob) {
				var sType = 'data:' + sMimeType;
				if (sCharset) {
					sType += ';charset=' + sCharset;
				}
				var oBlob = new window.Blob([ sData ], { type: sType });

				// IE 10+ (native saveAs FileAPI)
				if (window.navigator.msSaveOrOpenBlob) {
					window.navigator.msSaveOrOpenBlob(oBlob, sFullFileName);
				} else {
					var oURL = window.URL || window.webkitURL;
					var sBlobUrl = oURL.createObjectURL(oBlob);

					var oLink = window.document.createElement('a');
					if ('download' in oLink) {
						// use an anchor link with download attribute for download
						var $body = jQuery(document.body);
						var $link = jQuery(oLink).attr({
							download: sFullFileName,
							href: sBlobUrl,
							style: 'display:none'
						});
						$body.append($link);
						$link.get(0).click();

						$link.remove();
					} else {
						// remove utf-8 byte-order-mark (BOM) again to prevent an exception when using btoa
						if (sData && sCharset === 'utf-8' && sFileExtension === 'csv') {
							sData = sData.substr(1);
						}
						// Safari (user has to save the file manually)
						var oWindow = window.open(sType + ";base64," + window.btoa(sData));
						if (!oWindow) {
							throw new Error("Could not download file. A popup blocker might be active.");
						}
					}
				}
			} else if (Device.browser.internet_explorer && Device.browser.version <= 9) {
				// iframe fallback for IE 8/9
				var $body = jQuery(document.body);
				var $iframe = jQuery('<iframe/>', {
					style: 'display:none'
				});
				$body.append($iframe);
				var oDocument = $iframe.get(0).contentWindow.document;
				// open the document to be able to modify it
				oDocument.open(sMimeType, 'replace');
				// set charset (e.g. utf-8) if given
				if (sCharset) {
					oDocument.charset = sCharset;
				}
				// write content to iframe
				oDocument.write(sData);
				oDocument.close();

				// open the file-save dialog
				// measure the time that the execCommand takes to detect an
				// IE bug with some file extensions on some OS (e.g. Windows Server 2008 E2 Enterprise SP1) in all IE versions:
				// http://stackoverflow.com/questions/2515791/execcommandsaveas-null-file-csv-is-not-working-in-ie8
				var oTime = new Date();
				var bSuccess = oDocument.execCommand('SaveAs', false, sFullFileName);
				if (!bSuccess && new Date() - oTime < 10) {
					// execCommand returns false either when the user clicks on cancel or
					// when the bug mentioned above is occurring, so the time is measured
					// to detect the cancel action

					// .txt as file extension will work on all systems
					oDocument.execCommand('SaveAs', false, sFullFileName + '.txt');
				}

				// cleanup
				$iframe.remove();
			}
		}
	};

	return File;
}, /* bExport= */ true);
