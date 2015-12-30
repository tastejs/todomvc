/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.unified.FileUploader.
sap.ui.define(['jquery.sap.global', 'sap/ui/core/Control', './library'],
	function(jQuery, Control, library) {
	"use strict";



	/**
	 * Constructor for a new FileUploader.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * The framework generates an input field and a button with text "Browse ...". The API supports features such as on change uploads (the upload starts immediately after a file has been selected), file uploads with explicit calls, adjustable control sizes, text display after uploads, or tooltips containing complete file paths.
	 * @extends sap.ui.core.Control
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @alias sap.ui.unified.FileUploader
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var FileUploader = Control.extend("sap.ui.unified.FileUploader", /** @lends sap.ui.unified.FileUploader.prototype */ { metadata : {

		library : "sap.ui.unified",
		properties : {

			/**
			 * Value of the path for file upload.
			 */
			value : {type : "string", group : "Data", defaultValue : ''},

			/**
			 * Disabled controls have different colors, depending on customer settings.
			 */
			enabled : {type : "boolean", group : "Behavior", defaultValue : true},

			/**
			 * Used when URL address is on a remote server.
			 */
			uploadUrl : {type : "sap.ui.core.URI", group : "Data", defaultValue : ''},

			/**
			 * Unique control name for identification on the server side after sending data to the server.
			 */
			name : {type : "string", group : "Data", defaultValue : null},

			/**
			 * Specifies the displayed control width.
			 */
			width : {type : "sap.ui.core.CSSSize", group : "Misc", defaultValue : ''},

			/**
			 * If set to "true", the upload immediately starts after file selection. With the default setting, the upload needs to be explicitly triggered.
			 */
			uploadOnChange : {type : "boolean", group : "Behavior", defaultValue : false},

			/**
			 * Additional data that is sent to the back end service. Data will be transmitted as value of a hidden input where the name is derived from the name property with suffix -data.
			 */
			additionalData : {type : "string", group : "Data", defaultValue : null},

			/**
			 * If the FileUploader is configured to upload the file directly after the file is selected it is not allowed to upload a file with the same name again. If a user should be allowed to upload a file with the same name again this parameter has to be "true". A typical use case would be if the files have different paths.
			 */
			sameFilenameAllowed : {type : "boolean", group : "Behavior", defaultValue : false},

			/**
			 * The Button text can be overwritten using this property.
			 */
			buttonText : {type : "string", group : "Misc", defaultValue : null},

			/**
			 * The chosen files will be checked against an array of file types. If at least one file does not fit the file type restriction the upload is prevented.
			 * Example: ["jpg", "png", "bmp"].
			 */
			fileType : {type : "string[]", group : "Data", defaultValue : null},

			/**
			 * Allows multiple files to be chosen and uploaded from the same folder. This property is not supported by Internet Explorer 9.
			 */
			multiple : {type : "boolean", group : "Behavior", defaultValue : false},

			/**
			 * A file size limit in megabytes which prevents the upload if at least one file exceeds it. This property is not supported by Internet Explorer 9.
			 */
			maximumFileSize : {type : "float", group : "Data", defaultValue : null},

			/**
			 * The chosen files will be checked against an array of mime types. If at least one file does not fit the mime type restriction the upload is prevented. This property is not supported by Internet Explorer 9.
			 * Example: mimeType ["image/png", "image/jpeg"].
			 */
			mimeType : {type : "string[]", group : "Data", defaultValue : null},

			/**
			 * If set to "true", the request will be sent as XHR request instead of a form submit. This property is not supported by Internet Explorer 9.
			 */
			sendXHR : {type : "boolean", group : "Behavior", defaultValue : false},

			/**
			 * Placeholder for the text field.
			 */
			placeholder : {type : "string", group : "Appearance", defaultValue : null},

			/**
			 * Style of the button. "Transparent, "Accept", "Reject", or "Emphasized" is allowed.
			 */
			style : {type : "string", group : "Appearance", defaultValue : null},

			/**
			 * If set to "true", the FileUploader will be rendered as Button only, without showing the InputField.
			 */
			buttonOnly : {type : "boolean", group : "Appearance", defaultValue : false},

			/**
			 * If set to "false", the request will be sent as file only request instead of a multipart/form-data request. Only one file could be uploaded using this type of request. Required for sending such a request is to set the property "sendXHR" to "true". This property is not supported by Internet Explorer 9.
			 */
			useMultipart : {type : "boolean", group : "Behavior", defaultValue : true},

			/**
			 * The maximum length of a filename which the FileUploader will accept. If the maximum filename length is exceeded, the corresponding Event 'filenameLengthExceed' is fired.
			 * @since 1.24.0
			 */
			maximumFilenameLength : {type : "int", group : "Data", defaultValue : null},

			/**
			 * Visualizes warnings or errors related to the text field. Possible values: Warning, Error, Success, None.
			 * @since 1.24.0
			 */
			valueState : {type : "sap.ui.core.ValueState", group : "Data", defaultValue : sap.ui.core.ValueState.None},

			/**
			 * Icon to be displayed as graphical element within the button.
			 * This can be an URI to an image or an icon font URI.
			 * @since 1.26.0
			 */
			icon : {type : "sap.ui.core.URI", group : "Appearance", defaultValue : ''},

			/**
			 * Icon to be displayed as graphical element within the button when it is hovered (only if also a base icon was specified). If not specified the base icon is used.
			 * If a icon font icon is used, this property is ignored.
			 * @since 1.26.0
			 */
			iconHovered : {type : "sap.ui.core.URI", group : "Appearance", defaultValue : ''},

			/**
			 * Icon to be displayed as graphical element within the button when it is selected (only if also a base icon was specified). If not specified the base or hovered icon is used.
			 * If a icon font icon is used, this property is ignored.
			 * @since 1.26.0
			 */
			iconSelected : {type : "sap.ui.core.URI", group : "Appearance", defaultValue : ''},

			/**
			 * If set to true (default), the display sequence is 1. icon 2. control text.
			 * @since 1.26.0
			 */
			iconFirst : {type : "boolean", group : "Appearance", defaultValue : true},

			/**
			 * If set to true, the button is displayed without any text.
			 * @since 1.26.0
			 */
			iconOnly : {type : "boolean", group : "Appearance", defaultValue : false}
		},
		aggregations : {

			/**
			 * The parameters for the FileUploader which are rendered as a hidden inputfield.
			 * @since 1.12.2
			 */
			parameters : {type : "sap.ui.unified.FileUploaderParameter", multiple : true, singularName : "parameter"},

			/**
			 * The header parameters for the FileUploader which are only submitted with XHR requests. Header parameters are not supported by Internet Explorer 9.
			 */
			headerParameters : {type : "sap.ui.unified.FileUploaderParameter", multiple : true, singularName : "headerParameter"}
		},
		events : {

			/**
			 * Event is fired when the value of the file path has been changed.
			 */
			change : {
				parameters : {

					/**
					 * New file path value.
					 */
					newValue : {type : "string"},

					/**
					 * Files.
					 */
					files : {type : "object[]"}
				}
			},

			/**
			 * Event is fired as soon as the upload request is completed (either successful or unsuccessful). To see if the upload request was successful, check the 'state' parameter for a value 2xx.
			 * The uploads actual progress can be retrieved via the 'uploadProgress' Event.
			 * However this covers only the client side of the Upload process and does not give any success status from the server.
			 */
			uploadComplete : {
				parameters : {

					/**
					 * The name of a file to be uploaded.
					 */
					fileName : {type : "string"},

					/**
					 * Response message which comes from the server. On the server side this response has to be put within the &quot;body&quot; tags of the response document of the iFrame.
					 * It can consist of a return code and an optional message. This does not work in cross-domain scenarios.
					 */
					response : {type : "string"},

					/**
					 * ReadyState of the XHR request. Required for receiving a readyState is to set the property "sendXHR" to "true". This property is not supported by Internet Explorer 9.
					 */
					readyStateXHR : {type : "string"},

					/**
					 * Status of the XHR request. Required for receiving a status is to set the property "sendXHR" to "true". This property is not supported by Internet Explorer 9.
					 */
					status : {type : "string"},

					/**
					 * Http-Response which comes from the server. Required for receiving "responseRaw" is to set the property "sendXHR" to true. This property is not supported by Internet Explorer 9.
					 */
					responseRaw : {type : "string"},

					/**
					 * Http-Response-Headers which come from the server. provided as a JSON-map, i.e. each header-field is reflected by a property in the header-object, with the property value reflecting the header-field's content.
					 * Required for receiving "header" is to set the property "sendXHR" to true.
					 * This property is not supported by Internet Explorer 9.
					 */
					headers : {type : "object"},

					/**
					 * Http-Request-Headers. Required for receiving "header" is to set the property "sendXHR" to true. This property is not supported by Internet Explorer 9.
					 */
					requestHeaders : {type : "object[]"}
				}
			},

			/**
			 * Event is fired when the type of a file does not match the mimeType or fileType property.
			 */
			typeMissmatch : {
				parameters : {

					/**
					 * The name of a file to be uploaded.
					 */
					fileName : {type : "string"},

					/**
					 * The file ending of a file to be uploaded.
					 */
					fileType : {type : "string"},

					/**
					 * The MIME type of a file to be uploaded.
					 */
					mimeType : {type : "string"}
				}
			},

			/**
			 * Event is fired when the size of a file is above the maximumFileSize property.
			 * This event is not supported by Internet Explorer 9 (same restriction as for the property maximumFileSize).
			 */
			fileSizeExceed : {
				parameters : {

					/**
					 * The name of a file to be uploaded.
					 */
					fileName : {type : "string"},

					/**
					 * The size in MB of a file to be uploaded.
					 */
					fileSize : {type : "string"}
				}
			},

			/**
			 * Event is fired when the file is allowed for upload on client side.
			 */
			fileAllowed : {},

			/**
			 * Event is fired after the upload has started and before the upload is completed and contains progress information related to the running upload.
			 * Depending on file size, band width and used browser the event is fired once or multiple times.
			 * This is event is only supported with property sendXHR set to true, i.e. the event is not supported in Internet Explorer 9.
			 * @since 1.24.0
			 */
			uploadProgress : {
				parameters : {

					/**
					 * Indicates whether or not the relative upload progress can be calculated out of loaded and total.
					 */
					lengthComputable : {type : "boolean"},

					/**
					 * The number of bytes of the file which have been uploaded by to the time the event was fired.
					 */
					loaded : {type : "float"},

					/**
					 * The total size of the file to be uploaded in byte.
					 */
					total : {type : "float"},

					/**
					 * The name of a file to be uploaded.
					 */
					fileName : {type : "string"},

					/**
					 * Http-Request-Headers. Required for receiving "header" is to set the property "sendXHR" to true.
					 * This property is not supported by Internet Explorer 9.
					 */
					requestHeaders : {type : "object[]"}
				}
			},

			/**
			 * Event is fired after the current upload has been aborted.
			 * This is event is only supported with property sendXHR set to true, i.e. the event is not supported in Internet Explorer 9.
			 * @since 1.24.0
			 */
			uploadAborted : {
				parameters : {

					/**
					 * The name of a file to be uploaded.
					 */
					fileName : {type : "string"},

					/**
					 * Http-Request-Headers. Required for receiving "header" is to set the property "sendXHR" to true.
					 * This property is not supported by Internet Explorer 9.
					 */
					requestHeaders : {type : "object[]"}
				}
			},

			/**
			 * Event is fired, if the filename of a chosen file is longer than the value specified with the maximumFilenameLength property.
			 * @since 1.24.0
			 */
			filenameLengthExceed : {
				parameters : {

					/**
					 * The filename, which is longer than specified by the value of the property maximumFilenameLength.
					 */
					fileName : {type : "string"}
				}
			},

			/**
			 * Event is fired before an upload is started.
			 * @since 1.30.0
			 */
			uploadStart : {
				parameters : {

					/**
					 * The name of a file to be uploaded.
					 */
					fileName : {type : "string"},

					/**
					 * Http-Request-Headers. Required for receiving "header" is to set the property "sendXHR" to true.
					 * This property is not supported by Internet Explorer 9.
					 */
					requestHeaders : {type : "object[]"}
				}
			}
		}
	}});


	/**
	 * Initializes the control.
	 * It is called from the constructor.
	 * @private
	 */
	FileUploader.prototype.init = function(){

		// load the respective UI-Elements from the FileUploaderHelper
		this.oFilePath = sap.ui.unified.FileUploaderHelper.createTextField(this.getId() + "-fu_input");
		this.oBrowse = sap.ui.unified.FileUploaderHelper.createButton();
		this.oFilePath.setParent(this);
		this.oBrowse.setParent(this);

		this.oFileUpload = null;

		// check if sap.m library is used
		this.bMobileLib = this.oBrowse.getMetadata().getName() == "sap.m.Button";

		//retrieving the default browse button text from the resource bundle
		if (!this.getIconOnly()) {
			this.oBrowse.setText(this.getBrowseText());
		}else {
			this.oBrowse.setTooltip(this.getBrowseText());
		}

		if (sap.ui.getCore().getConfiguration().getAccessibility()) {
			if (!FileUploader.prototype._sAccText) {
				var rb = sap.ui.getCore().getLibraryResourceBundle("sap.ui.unified");
				FileUploader.prototype._sAccText = rb.getText("FILEUPLOAD_ACC");
			}
			if (this.oBrowse.addAriaDescribedBy) {
				this.oBrowse.addAriaDescribedBy(this.getId() + "-AccDescr");
			}
		}

	};

	FileUploader.prototype.setButtonText = function(sText) {
		this.setProperty("buttonText", sText, false);
		if (!this.getIconOnly()) {
			this.oBrowse.setText(sText || this.getBrowseText());
		}else {
			this.oBrowse.setTooltip(sText || this.getBrowseText());
		}
		return this;
	};

	FileUploader.prototype.setIcon = function(sIcon) {
		this.oBrowse.setIcon(sIcon);
		this.setProperty("icon", sIcon, false);
		return this;
	};

	FileUploader.prototype.setIconHovered = function(sIconHovered) {
		this.setProperty("iconHovered", sIconHovered, false);
		if (this.oBrowse.setIconHovered) {
			this.oBrowse.setIconHovered(sIconHovered);
		}
		return this;
	};

	FileUploader.prototype.setIconSelected = function(sIconSelected) {
		this.setProperty("iconSelected", sIconSelected, false);
		if (this.oBrowse.setIconSelected) {
			this.oBrowse.setIconSelected(sIconSelected);
		} else {
			this.oBrowse.setActiveIcon(sIconSelected);
		}
		return this;
	};

	FileUploader.prototype.setIconFirst = function(bIconFirst) {
		this.oBrowse.setIconFirst(bIconFirst);
		this.setProperty("iconFirst", bIconFirst, false);
		return this;
	};

	FileUploader.prototype.setIconOnly = function(bIconOnly) {
		this.setProperty("iconOnly", bIconOnly, false);
		if (bIconOnly) {
			this.oBrowse.setText("");
			this.oBrowse.setTooltip(this.getButtonText() || this.getBrowseText());
		}else {
			this.oBrowse.setText(this.getButtonText() || this.getBrowseText());
			this.oBrowse.setTooltip("");
		}
		return this;
	};

	FileUploader.prototype.getIdForLabel = function () {
		return this.oBrowse.getId();
	};

	FileUploader.prototype.setFileType = function(vTypes) {
		// Compatibility issue: converting the given types to an array in case it is a string
		var aTypes = this._convertTypesToArray(vTypes);
		this.setProperty("fileType", aTypes, false);
		return this;
	};

	FileUploader.prototype.setMimeType = function(vTypes) {
		// Compatibility issue: converting the given types to an array in case it is a string
		var aTypes = this._convertTypesToArray(vTypes);
		this.setProperty("mimeType", aTypes, false);
		return this;
	};

	FileUploader.prototype.setTooltip = function(oTooltip) {
		this._refreshTooltipBaseDelegate(oTooltip);
		this.setAggregation("tooltip", oTooltip, true);
		if (this.oFileUpload) {
			if (typeof oTooltip  === "string") {
				jQuery(this.oFileUpload).attr("title", jQuery.sap.encodeHTML(oTooltip));
			}
		}
		return this;
	};

	/**
	 * Helper to ensure, that the types (file or mime) are inside an array.
	 * The FUP also accepts comma-separated strings for its fileType and mimeType property.
	 * @private
	 */
	FileUploader.prototype._convertTypesToArray = function (vTypes) {
		if (typeof vTypes === "string") {
			if (vTypes === "") {
				return [];
			} else {
				return vTypes.split(",");
			}
		}
		return vTypes;
	};

	/**
	 * Terminates the control when it has been destroyed.
	 * @private
	 */
	FileUploader.prototype.exit = function(){

		// destroy the nested controls
		this.oFilePath.destroy();
		this.oBrowse.destroy();

		// remove the IFRAME
		if (this.oIFrameRef) {
			jQuery(this.oIFrameRef).unbind();
			sap.ui.getCore().getStaticAreaRef().removeChild(this.oIFrameRef);
			this.oIFrameRef = null;
		}

	};

	/**
	 * Clean up event listeners before rendering
	 * @private
	 */
	FileUploader.prototype.onBeforeRendering = function() {

		// store the file uploader outside in the static area
		var oStaticArea = sap.ui.getCore().getStaticAreaRef();
		jQuery(this.oFileUpload).appendTo(oStaticArea);

		// unbind the custom event handlers
		jQuery(this.oFileUpload).unbind();

	};

	/**
	 * Prepare the upload processing, establish the change handler for the
	 * pure html input object.
	 * @private
	 */
	FileUploader.prototype.onAfterRendering = function() {

		// prepare the file upload control and the upload iframe
		this.prepareFileUploadAndIFrame();

		// event listener registration for change event
		jQuery(this.oFileUpload).change(jQuery.proxy(this.handlechange, this));

		if (!this.bMobileLib) {
			this.oFilePath.$().attr("tabindex", "-1");
		} else {
			this.oFilePath.$().find('input').attr("tabindex", "-1");
		}
		// in case of IE9 we prevent the browse button from being focused because the
		// native file uploader requires the focus for catching the keyboard events
		if ((!!sap.ui.Device.browser.internet_explorer && sap.ui.Device.browser.version == 9)) {
			this.oBrowse.$().attr("tabindex", "-1");
		}
		jQuery.sap.delayedCall(0, this, this._recalculateWidth);

		this.oFilePath.$().find('input').removeAttr("role").attr("aria-live", "polite");

		if (this.getValueState() == sap.ui.core.ValueState.Error) {
			this.oBrowse.$().attr("aria-invalid", "true");
		}

	};

	FileUploader.prototype.onfocusin = function(oEvent) {

		this.openValueStateMessage();

	};

	FileUploader.prototype.onsapfocusleave = function(oEvent) {

		if (!oEvent.relatedControlId || !jQuery.sap.containsOrEquals(this.getDomRef(), sap.ui.getCore().byId(oEvent.relatedControlId).getFocusDomRef())) {
			this.closeValueStateMessage();
		}

	};

	FileUploader.prototype._recalculateWidth = function() {
		// calculation of the width of the overlay for the original file upload
		// !sap.ui.Device.browser.internet_explorer check: only for non IE browsers since there we need
		// the button in front of the fileuploader
		if (this.getWidth()) {
			if (this.getButtonOnly() && this.oBrowse.getDomRef()) {
				this.oBrowse.getDomRef().style.width = this.getWidth();
			}
			// Recalculate the textfield width...
			this._resizeDomElements();
		}
	};

	/**
	 * Returns the DOM element that should be focused when focus is set onto the control.
	 */
	FileUploader.prototype.getFocusDomRef = function() {
		return this.$("fu").get(0);
	};

	FileUploader.prototype._resizeDomElements = function() {
		var sId = this.getId();
		this._oBrowseDomRef = this.oBrowse.getDomRef();
		var $b = jQuery(this._oBrowseDomRef);
		var _buttonWidth = $b.parent().outerWidth(true);
		this._oFilePathDomRef = this.oFilePath.getDomRef();
		var oDomRef = this._oFilePathDomRef;
		var sWidth = this.getWidth();

		if (sWidth.substr( -1) == "%" && oDomRef) {
			// Special case - if the width is not in px, we only change the top element

			// Resize all elements from the input field up to the control element itself.
			while (oDomRef.id != sId) {
				oDomRef.style.width = "100%";
				oDomRef = oDomRef.parentNode;
			}

			oDomRef.style.width = sWidth;
		} else {
			if (oDomRef) {
				oDomRef.style.width = sWidth;

				// Now make sure the field including the button has the correct size
				var $fp = jQuery(this._oFilePathDomRef);
				var _newWidth = $fp.outerWidth() - _buttonWidth;
				if (_newWidth < 0) {
					this.oFilePath.getDomRef().style.width = "0px";
					if (!sap.ui.Device.browser.internet_explorer) {
						this.oFileUpload.style.width = $b.outerWidth(true);
					}
				} else {
					this.oFilePath.getDomRef().style.width = _newWidth + "px";
				}
			}
		}
	};

	FileUploader.prototype.onresize = function() {
		this._recalculateWidth();
	};

	FileUploader.prototype.onThemeChanged = function() {
		this._recalculateWidth();
	};

	FileUploader.prototype.setEnabled = function(bEnabled){
		this.setProperty("enabled", bEnabled, true);
		this.oFilePath.setEnabled(bEnabled);
		this.oBrowse.setEnabled(bEnabled);
		if (bEnabled) {
			jQuery(this.oFileUpload).removeAttr('disabled');
		} else {
			jQuery(this.oFileUpload).attr('disabled', 'disabled');
		}
		return this;
	};

	FileUploader.prototype.setValueState = function(sValueState) {

		this.setProperty("valueState", sValueState, true);
		//as of 1.23.1 oFilePath can be a sap.ui.commons.TextField or a sap.m.Input, which both have a valueState
		if (this.oFilePath.setValueState) {
			this.oFilePath.setValueState(sValueState);
		}

		if (this.oBrowse.getDomRef()) {
			if (sValueState == sap.ui.core.ValueState.Error) {
				this.oBrowse.$().attr("aria-invalid", "true");
			}else {
				this.oBrowse.$().removeAttr("aria-invalid");
			}
		}

		if (jQuery.sap.containsOrEquals(this.getDomRef(), document.activeElement)) {
			switch (sValueState) {
				case sap.ui.core.ValueState.Error:
				case sap.ui.core.ValueState.Warning:
				case sap.ui.core.ValueState.Success:
					this.openValueStateMessage();
					break;
				default:
					this.closeValueStateMessage();
			}
		}

		return this;

	};

	FileUploader.prototype.setUploadUrl = function(sValue, bFireEvent) {
		this.setProperty("uploadUrl", sValue, true);
		var $uploadForm = this.$("fu_form");
		$uploadForm.attr("action", this.getUploadUrl());
		return this;
	};

	FileUploader.prototype.setPlaceholder = function(sPlaceholder) {
		this.setProperty("placeholder", sPlaceholder, true);
		this.oFilePath.setPlaceholder(sPlaceholder);
		return this;
	};

	FileUploader.prototype.setStyle = function(sStyle) {
		this.setProperty("style", sStyle, true);
		if (sStyle == "Transparent") {
			if (this.oBrowse.setLite) {
				this.oBrowse.setLite(true);
			} else {
				this.oBrowse.setType("Transparent");
			}
		} else {
			if (this.oBrowse.setType) {
				this.oBrowse.setType(sStyle);
			} else {
				if (sStyle == "Emphasized") {
					sStyle = "Emph";
				}
				this.oBrowse.setStyle(sStyle);
			}
		}
		return this;
	};

	FileUploader.prototype.setValue = function(sValue, bFireEvent, bSupressFocus) {
		var oldValue = this.getValue();
		if ((oldValue != sValue) || this.getSameFilenameAllowed()) {
			// only upload when a valid value is set
			var bUpload = this.getUploadOnChange() && sValue;
			// when we do not upload we re-render (cause some browsers don't like
			// to change the value of file uploader INPUT elements)
			this.setProperty("value", sValue, bUpload);
			if (this.oFilePath) {
				this.oFilePath.setValue(sValue);
				//refocus the Button, except bSupressFocus is set
				if (this.oBrowse.getDomRef() && !bSupressFocus && jQuery.sap.containsOrEquals(this.getDomRef(), document.activeElement)) {
					this.oBrowse.focus();
				}
			}
			var oForm = this.getDomRef("fu_form"),
				sapMInnerInput = this.getDomRef("fu_input-inner");
			//reseting the input fields if setValue("") is called, also for undefined and null
			if (this.oFileUpload && /* is visible: */ oForm && !sValue) {
				// some browsers do not allow to clear the value of the fileuploader control
				// therefore we utilize the form and reset the values inside this form and
				// apply the additionalData again afterwards
				oForm.reset();
				this.getDomRef("fu_input").value = "";
				//if the sap.m library is used, we also need to clear the inner input-field of sap.m.Input
				if (sapMInnerInput) {
					sapMInnerInput.value = "";
				}
				//keep the additional data on the form
				this.$("fu_data").val(this.getAdditionalData());
			}
			// only fire event when triggered by user interaction
			if (bFireEvent) {
				if (window.File) {
					var oFiles = jQuery.sap.domById(this.getId() + "-fu").files;
				}
				if (!this.getSameFilenameAllowed() || sValue) {
					this.fireChange({id:this.getId(), newValue:sValue, files:oFiles});
				}
			}
			if (bUpload) {
				this.upload();
			}
		}
		return this;
	};


	/**
	 * Clears the content of the FileUploader. The attached additional data however is retained.
	 *
	 * @type void
	 * @public
	 * @since 1.25.0
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	FileUploader.prototype.clear = function () {
		var uploadForm = this.getDomRef("fu_form");
		if (uploadForm) {
			uploadForm.reset();
		}
		//clear the value, don't fire change event, and supress the refocusing of the file input field
		return this.setValue("", false, true);
	};

	FileUploader.prototype.onmousedown = function(oEvent) {
		if (!this.bMobileLib) {
			this.oBrowse.onmousedown(oEvent);
		}
	};

	FileUploader.prototype.onmouseup = function(oEvent) {
		if (!this.bMobileLib) {
			this.oBrowse.onmouseup(oEvent);
		}
	};

	FileUploader.prototype.onmouseover = function (oEvent) {
		if (!this.bMobileLib) {
			jQuery(this.oBrowse.getDomRef()).addClass('sapUiBtnStdHover');
			this.oBrowse.onmouseover(oEvent);
		}
	};

	FileUploader.prototype.onmouseout = function (oEvent) {
		if (!this.bMobileLib) {
			jQuery(this.oBrowse.getDomRef()).removeClass('sapUiBtnStdHover');
			this.oBrowse.onmouseout(oEvent);
		}
	};

	FileUploader.prototype.setAdditionalData = function(sAdditionalData) {
		// set the additional data in the hidden input
		this.setProperty("additionalData", sAdditionalData, true);
		var oAdditionalData = this.getDomRef("fu_data");
		if (oAdditionalData) {
			var sAdditionalData = this.getAdditionalData() || "";
			oAdditionalData.value = sAdditionalData;
		}
		return this;
	};

	FileUploader.prototype.sendFiles = function(aXhr, aFiles, iIndex) {

		var that = this;

		if (iIndex >= aFiles.length) {
			if (this.getSameFilenameAllowed() && this.getUploadOnChange()) {
				that.setValue("", true);
			}
			return;
		}

		var oXhr = aXhr[iIndex];
		var sFilename = aFiles[iIndex].name;

		if (sap.ui.Device.browser.internet_explorer && aFiles[iIndex].type && oXhr.xhr.readyState != 0) {
			var sContentType = aFiles[iIndex].type;
			oXhr.xhr.setRequestHeader("Content-Type", sContentType);
			oXhr.requestHeaders.push({name: "Content-Type", value: sContentType});
		}

		var oRequestHeaders = oXhr.requestHeaders;

		var fnProgressListener = function(oProgressEvent) {
			var oProgressData = {
				lengthComputable: !!oProgressEvent.lengthComputable,
				loaded: oProgressEvent.loaded,
				total: oProgressEvent.total
			};
			that.fireUploadProgress({
				"lengthComputable": oProgressData.lengthComputable,
				"loaded": oProgressData.loaded,
				"total": oProgressData.total,
				"fileName": sFilename,
				"requestHeaders": oRequestHeaders
			});
		};

		var fnAbordListerner = function(oAbortEvent) {
			that.fireUploadAborted({
				"fileName": sFilename,
				"requestHeaders": oRequestHeaders
			});
		};

		oXhr.xhr.upload.addEventListener("progress", fnProgressListener);

		//relay the abort event, if the xhr was aborted manually
		oXhr.xhr.upload.addEventListener("abort", fnAbordListerner);

		oXhr.xhr.onreadystatechange = function() {

			var sResponse;
			var sResponseRaw;
			var mHeaders = {};
			var sPlainHeader;
			var aHeaderLines;
			var iHeaderIdx;
			var sReadyState;
			sReadyState = oXhr.xhr.readyState;
			var sStatus = oXhr.xhr.status;

			if (oXhr.xhr.readyState == 4) {
				//this check is needed, because (according to the xhr spec) the readyState is set to OPEN (4)
				//as soon as the xhr is aborted. Only after the progress events are fired, the state is set to UNSENT (0)
				if (oXhr.xhr.responseXML) {
					sResponse = oXhr.xhr.responseXML.documentElement.textContent;
				}
				sResponseRaw = oXhr.xhr.response;

				//Parse the http-header into a map
				sPlainHeader = oXhr.xhr.getAllResponseHeaders();
				if (sPlainHeader) {
					aHeaderLines = sPlainHeader.split("\u000d\u000a");
					for (var i = 0; i < aHeaderLines.length; i++) {
						if (aHeaderLines[i]) {
							iHeaderIdx = aHeaderLines[i].indexOf("\u003a\u0020");
							mHeaders[aHeaderLines[i].substring(0, iHeaderIdx)] = aHeaderLines[i].substring(iHeaderIdx + 2);
						}
					}
				}
				that.fireUploadComplete({
					"fileName": sFilename,
					"headers": mHeaders,
					"response": sResponse,
					"responseRaw": sResponseRaw,
					"readyStateXHR": sReadyState,
					"status": sStatus,
					"requestHeaders": oRequestHeaders
				});
			}
			that._bUploading = false;
		};
		if (oXhr.xhr.readyState == 0){
			iIndex++;
			that.sendFiles(aXhr, aFiles, iIndex);
		} else {
			oXhr.xhr.send(aFiles[iIndex]);
			iIndex++;
			that.sendFiles(aXhr, aFiles, iIndex);
		}
	};


	/**
	 * Starts the upload (as defined by uploadUrl)
	 *
	 * @type void
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	FileUploader.prototype.upload = function() {
		//supress Upload if the FileUploader is not enabled
		if (!this.getEnabled()) {
			return;
		}
		var uploadForm = this.getDomRef("fu_form");

		try {
			if (uploadForm) {
				this._bUploading = true;
				if (this.getSendXHR() && window.File) {
					var aFiles = jQuery.sap.domById(this.getId() + "-fu").files;
					if (aFiles.length > 0) {
						if (this.getUseMultipart()) {
							//one xhr request for all files
							var iFiles = 1;
						} else {
							//several xhr requests for every file
							var iFiles = aFiles.length;
						}
						this._aXhr = [];
						for (var j = 0; j < iFiles; j++) {
							//keep a reference on the current upload xhr
							this._uploadXHR = new window.XMLHttpRequest();
							this._aXhr.push({
								xhr: this._uploadXHR,
								requestHeaders: []
							});
							this._aXhr[j].xhr.open("POST", this.getUploadUrl(), true);
							if (this.getHeaderParameters()) {
								var aHeaderParams = this.getHeaderParameters();
								for (var i = 0; i < aHeaderParams.length; i++) {
									var sHeader = aHeaderParams[i].getName();
									var sValue = aHeaderParams[i].getValue();
									this._aXhr[j].requestHeaders.push({
										name: sHeader, 
										value: sValue
									});
								}
							}
							var sFilename = aFiles[j].name;
							var aRequestHeaders = this._aXhr[j].requestHeaders;
							this.fireUploadStart({
								"fileName": sFilename,
								"requestHeaders": aRequestHeaders
							});
							for (var i = 0; i < aRequestHeaders.length; i++) {
								// Check if request is still open in case abort() was called.
								if (this._aXhr[j].xhr.readyState === 0) {
									break;
								}
								var sHeader = aRequestHeaders[i].name;
								var sValue = aRequestHeaders[i].value;
								this._aXhr[j].xhr.setRequestHeader(sHeader, sValue);
							}
						}
						if (this.getUseMultipart()) {
							var formData = new window.FormData();
							var name = jQuery.sap.domById(this.getId() + "-fu").name;
							for (var i = 0; i < aFiles.length; i++) {
								formData.append(name, aFiles[i]);
							}
							formData.append("_charset_", "UTF-8");
							var data = jQuery.sap.domById(this.getId() + "-fu_data").name;
							if (this.getAdditionalData()) {
								var sData = this.getAdditionalData();
								formData.append(data, sData);
							} else {
								formData.append(data, "");
							}
							if (this.getParameters()) {
								var oParams = this.getParameters();
								for (var i = 0; i < oParams.length; i++) {
									var sName = oParams[i].getName();
									var sValue = oParams[i].getValue();
									formData.append(sName, sValue);
								}
							}
							this.sendFiles(this._aXhr, [formData], 0);
						} else {
							this.sendFiles(this._aXhr, aFiles, 0);
						}
						this._bUploading = false;
					}
				} else {
					uploadForm.submit();
				}
				jQuery.sap.log.info("File uploading to " + this.getUploadUrl());
				if (this.getSameFilenameAllowed() && this.getUploadOnChange() && this.getUseMultipart()) {
					this.setValue("", true);
				}
			}
		} catch (oException) {
			jQuery.sap.log.error("File upload failed:\n" + oException.message);
		}
	};

	/**
	 * Aborts the currently running upload.
	 *
	 * @type void
	 * @public
	 * @since 1.24.0
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	FileUploader.prototype.abort = function(sHeaderCheck, sValueCheck) {
		if (!this.getUseMultipart()) {
			for (var i = 0; i < this._aXhr.length; i++) {
				if (sHeaderCheck && sValueCheck) {
					for (var j = 0; j < this._aXhr[i].requestHeaders.length; j++) {
						var sHeader = this._aXhr[i].requestHeaders[j].name;
						var sValue = this._aXhr[i].requestHeaders[j].value;
						if (sHeader == sHeaderCheck && sValue == sValueCheck) {
							this._aXhr[i].xhr.abort();
							jQuery.sap.log.info("File upload aborted.");
						}
					}
				} else {
					this._aXhr[i].xhr.abort();
				}
			}
		} else if (this._uploadXHR && this._uploadXHR.abort) {
			//fires a progress event 'abort' on the _uploadXHR
			this._uploadXHR.abort();
		}
	};

	FileUploader.prototype.onkeypress = function(oEvent) {
		this.onkeydown(oEvent);
	};

	FileUploader.prototype.onclick = function(oEvent) {
		if (this.getSameFilenameAllowed()) {
			this.setValue("", true);
		}
		//refocus the Button, except bSupressFocus is set
		if (this.oBrowse.getDomRef() && jQuery.sap.containsOrEquals(this.getDomRef(), document.activeElement)) {
			this.oBrowse.focus();
		}
	};

	//
	//Event Handling
	//
	FileUploader.prototype.onkeydown = function(oEvent) {
		if (!this.getEnabled()) {
			return;
		}
		if (this.getSameFilenameAllowed() && this.getUploadOnChange()) {
			this.setValue("", true);
		}
		var iKeyCode = oEvent.keyCode,
			eKC = jQuery.sap.KeyCodes;
		if (iKeyCode == eKC.DELETE || iKeyCode == eKC.BACKSPACE) {
			if (this.oFileUpload) {
				this.setValue("", true);
			}
		} else if (iKeyCode == eKC.SPACE || iKeyCode == eKC.ENTER) {
			// this does not work for IE9 and downwards! TODO: check with IE10/11
			// consider to always put the focus on the hidden file uploader
			// and let the fileuploader manager the keyboard interaction
			if (!(!!sap.ui.Device.browser.internet_explorer && sap.ui.Device.browser.version <= 9) && this.oFileUpload) {
				this.oFileUpload.click();
				oEvent.preventDefault();
				oEvent.stopPropagation();
			}
		} else if (iKeyCode != eKC.TAB &&
					iKeyCode != eKC.SHIFT &&
					iKeyCode != eKC.F6 &&
					iKeyCode != eKC.PAGE_UP &&
					iKeyCode != eKC.PAGE_DOWN &&
					iKeyCode != eKC.END &&
					iKeyCode != eKC.HOME &&
					iKeyCode != eKC.ARROW_LEFT &&
					iKeyCode != eKC.ARROW_UP &&
					iKeyCode != eKC.ARROW_RIGHT &&
					iKeyCode != eKC.ARROW_DOWN) {
			oEvent.preventDefault();
			oEvent.stopPropagation();
		}
	};

	/**
	 * Helper function to check if the given filename is longer than the specified 'maximumFilenameLength'.
	 * @param {string} [sFilename] the filename which should be tested
	 * @param {boolean} [bFireEvent] if necessary, this flag triggers that a filenameLengthExceed event is fired 
	 * @returns {boolean} whether the filename is too long or not
	 * @private
	 */
	FileUploader.prototype._isFilenameTooLong = function (sFilename) {
		var iMaxFilenameLength = this.getMaximumFilenameLength();
		if (iMaxFilenameLength !== 0 && sFilename.length > iMaxFilenameLength) {
			jQuery.sap.log.info("The filename of " + sFilename + " (" + sFilename.length + " characters)  is longer than the maximum of " + iMaxFilenameLength + " characters.");
			return true;
		}

		return false;
	};

	FileUploader.prototype.handlechange = function(oEvent) {
		if (this.oFileUpload && this.getEnabled()) {

			var fMaxSize = this.getMaximumFileSize();

			var aFileTypes = this.getFileType();
			var aMimeTypes = this.getMimeType();

			var sFileString = '';

			var uploadForm = this.getDomRef("fu_form");

			if (window.File) {
				var aFiles = oEvent.target.files;

				for (var i = 0; i < aFiles.length; i++) {
					var sName = aFiles[i].name;
					var sType = aFiles[i].type;
					if (!sType) {
						sType = "unknown";
					}
					var fSize = ((aFiles[i].size / 1024) / 1024);
					if (fMaxSize && (fSize > fMaxSize)) {
						jQuery.sap.log.info("File: " + sName + " is of size " + fSize + " MB which exceeds the file size limit of " + fMaxSize + " MB.");
						this.fireFileSizeExceed({
							fileName:sName,
							fileSize:fSize
						});
						uploadForm.reset();
						this.setValue("", true, true);
						return;
					}
					//check if the filename is too long and fire the corresponding event if necessary
					if (this._isFilenameTooLong(sName)) {
						this.fireFilenameLengthExceed({
							fileName: sName
						});
						uploadForm.reset();
						this.setValue("", true, true);
						return;
					}
					//check allowed mime-types for potential mismatches
					if (aMimeTypes && aMimeTypes.length > 0) {
						var bWrongMime = true;
						for (var j = 0; j < aMimeTypes.length; j++) {
							if (sType == aMimeTypes[j] || aMimeTypes[j] == "*/*" || sType.match(aMimeTypes[j])) {
								bWrongMime = false;
							}
						}
						if (bWrongMime) {
							jQuery.sap.log.info("File: " + sName + " is of type " + sType + ". Allowed types are: "  + aMimeTypes + ".");
							this.fireTypeMissmatch({
								fileName:sName,
								mimeType:sType
							});
							uploadForm.reset();
							this.setValue("", true, true);
							return;
						}
					}
					//check allowed file-types for potential mismatches
					if (aFileTypes && aFileTypes.length > 0) {
						var bWrongType = true;
						var iIdx = sName.lastIndexOf(".");
						var sFileEnding = sName.substring(iIdx + 1);
						for (var k = 0; k < aFileTypes.length; k++) {
							if (sFileEnding.toLowerCase() == aFileTypes[k].toLowerCase()) {
								bWrongType = false;
							}
						}
						if (bWrongType) {
							jQuery.sap.log.info("File: " + sName + " is of type " + sFileEnding + ". Allowed types are: "  + aFileTypes + ".");
							this.fireTypeMissmatch({
								fileName:sName,
								fileType:sFileEnding
							});
							uploadForm.reset();
							this.setValue("", true, true);
							return;
						}
					}
					sFileString = sFileString + '"' + aFiles[i].name + '" ';
				}
				if (sFileString) {
					this.fireFileAllowed();
				}
			} else if (aFileTypes && aFileTypes.length > 0) {
				// This else case is executed if the File-API is not supported by the browser (especially IE9).
				// Check if allowed file types match the chosen file from the oFileUpload IFrame Workaround.
				var bWrongType = true;
				var sName = this.oFileUpload.value || "";
				var iIdx = sName.lastIndexOf(".");
				var sFileEnding = sName.substring(iIdx + 1);
				for (var k = 0; k < aFileTypes.length; k++) {
					if (sFileEnding == aFileTypes[k]) {
						bWrongType = false;
					}
				}
				if (bWrongType) {
					jQuery.sap.log.info("File: " + sName + " is of type " + sFileEnding + ". Allowed types are: "  + aFileTypes + ".");
					this.fireTypeMissmatch({
						fileName:sName,
						fileType:sFileEnding
					});
					uploadForm.reset();
					this.setValue("", true, true);
					return;
				}
				//check if the filename is too long and fire the corresponding event if necessary
				if (this._isFilenameTooLong(sName)) {
					this.fireFilenameLengthExceed({
						fileName: sName
					});
					uploadForm.reset();
					this.setValue("", true, true);
					return;
				}
				if (sName) {
					this.fireFileAllowed();
				}
			}

			// due to new security mechanism modern browsers simply
			// append a fakepath in front of the filename instead of
			// returning the filename only - we strip this path now
			var sValue = this.oFileUpload.value || "";
			var iIndex = sValue.lastIndexOf("\\");
			if (iIndex >= 0) {
				sValue = sValue.substring(iIndex + 1);
			}
			if (this.getMultiple()) {
				//multiple is not supported in IE <= 9
				if (!(sap.ui.Device.browser.internet_explorer && sap.ui.Device.browser.version <= 9)) {
					sValue = sFileString;
				}
			}

			//sValue has to be filled to avoid clearing the FilePath by pressing cancel
			if (sValue || sap.ui.Device.browser.chrome) { // in Chrome the file path has to be cleared as the upload will be avoided
				this.setValue(sValue, true);
			}
		}
	};

	//
	// Private
	//

	/**
	 * Helper to retrieve the I18N texts for a button
	 * @private
	 */
	FileUploader.prototype.getBrowseText = function() {

		// as the text is the same for all FileUploaders, get it only once
		if (!FileUploader.prototype._sBrowseText) {
			var rb = sap.ui.getCore().getLibraryResourceBundle("sap.ui.unified");
			FileUploader.prototype._sBrowseText = rb.getText("FILEUPLOAD_BROWSE");
		}

		return FileUploader.prototype._sBrowseText ? FileUploader.prototype._sBrowseText : "Browse...";

	};

	/**
	 * Getter for shortened value.
	 * @private
	 * @deprecated the value now is the short value (filename only)!
	 */
	FileUploader.prototype.getShortenValue = function() {
		return this.getValue();
	};

	/**
	 * Prepares the hidden IFrame for uploading the file (in static area).
	 * @private
	 */
	FileUploader.prototype.prepareFileUploadAndIFrame = function() {

		if (!this.oFileUpload) {

			// create the file uploader markup
			var aFileUpload = [];
			aFileUpload.push('<input ');
			aFileUpload.push('type="file" ');
			aFileUpload.push('aria-hidden="true" ');
			if (this.getName()) {
				if (this.getMultiple()) {
					//multiple is not supported in IE <= 9
					if (!(sap.ui.Device.browser.internet_explorer && sap.ui.Device.browser.version <= 9)) {
						aFileUpload.push('name="' + this.getName() + '[]" ');
					}
				} else {
					aFileUpload.push('name="' + this.getName() + '" ');
				}
			} else {
				if (this.getMultiple()) {
					//multiple is not supported in IE <= 9
					if (!(sap.ui.Device.browser.internet_explorer && sap.ui.Device.browser.version <= 9)) {
						aFileUpload.push('name="' + this.getId() + '[]" ');
					}
				} else {
					aFileUpload.push('name="' + this.getId() + '" ');
				}
			}
			aFileUpload.push('id="' + this.getId() + '-fu" ');
			if (!(!!sap.ui.Device.browser.internet_explorer && sap.ui.Device.browser.version == 9)) {
				// for IE9 the file uploader itself gets the focus to make sure that the
				// keyboard interaction works and there is no security issue - unfortunately
				// this has the negative side effect that 2 tabs are required.
				aFileUpload.push('tabindex="-1" ');
			}
			aFileUpload.push('size="1" ');
			if (this.getTooltip_AsString() ) {
				aFileUpload.push('title="' + jQuery.sap.encodeHTML(this.getTooltip_AsString()) + '" ');
			//} else if (this.getTooltip() ) {
				// object tooltip, do nothing - tooltip will be displayed
			} else if (this.getValue() != "") {
				// only if there is no tooltip, then set value as fallback
				aFileUpload.push('title="' + jQuery.sap.encodeHTML(this.getValue()) + '" ');
			}
			if (!this.getEnabled()) {
				aFileUpload.push('disabled="disabled" ');
			}
			if (this.getMultiple()) {
				//multiple is not supported in IE <= 9
				if (!(sap.ui.Device.browser.internet_explorer && sap.ui.Device.browser.version <= 9)) {
					aFileUpload.push('multiple ');
				}
			}
			if (this.getMimeType() && window.File) {
				var aMimeTypes = this.getMimeType();
				var sMimeTypes = aMimeTypes.join(",");
				aFileUpload.push('accept="' + sMimeTypes + '" ');
			}
			aFileUpload.push('>');

			// add it into the control markup
			this.oFileUpload = jQuery(aFileUpload.join("")).prependTo(this.$().find(".sapUiFupInputMask")).get(0);

		} else {

			// move the file uploader from the static area to the control markup
			jQuery(this.oFileUpload).prependTo(this.$().find(".sapUiFupInputMask"));

		}

		if (!this.oIFrameRef) {

			// create the upload iframe
			var oIFrameRef = document.createElement("iframe");
			oIFrameRef.style.display = "none";
			/*eslint-disable no-script-url */
			oIFrameRef.src = "javascript:''";
			/*eslint-enable no-script-url */
			oIFrameRef.id = this.sId + "-frame";
			sap.ui.getCore().getStaticAreaRef().appendChild(oIFrameRef);
			oIFrameRef.contentWindow.name = this.sId + "-frame";

			// sink the load event of the upload iframe
			var that = this;
			this._bUploading = false; // flag for uploading
			jQuery(oIFrameRef).load(function(oEvent) {
				if (that._bUploading) {
					jQuery.sap.log.info("File uploaded to " + that.getUploadUrl());
					var sResponse;
					try {
						sResponse = that.oIFrameRef.contentDocument.body.innerHTML;
					} catch (ex) {
						// in case of cross-domain submit we get a permission denied exception
						// when we try to access the body of the IFrame document
					}
					that.fireUploadComplete({"response": sResponse});
					that._bUploading = false;
				}
			});

			// keep the reference
			this.oIFrameRef = oIFrameRef;

		}
	};

	FileUploader.prototype.openValueStateMessage = function() {

		if (this.oFilePath.openValueStateMessage) {
			this.oFilePath.openValueStateMessage();
			this.oBrowse.$().addAriaDescribedBy(this.oFilePath.getId() + "-message");
		}

	};

	FileUploader.prototype.closeValueStateMessage = function() {

		if (this.oFilePath.closeValueStateMessage) {
			this.oFilePath.closeValueStateMessage();
			this.oBrowse.$().removeAriaDescribedBy(this.oFilePath.getId() + "-message");
		}

	};

	return FileUploader;

}, /* bExport= */ true);
