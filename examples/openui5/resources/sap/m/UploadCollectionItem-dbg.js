/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.m.UploadCollectionItem.
sap.ui.define(['jquery.sap.global', './library', 'sap/ui/core/Element', 'sap/m/ObjectAttribute', 'sap/m/ObjectStatus'],
	function(jQuery, library, Element, ObjectAttribute, ObjectStatus) {
	"use strict";

	/**
	 * Constructor for a new UploadCollectionItem
	 *
	 * @param {string} [sId] ID for the new control, will be generated automatically if no ID is provided.
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * Items provide information about the uploaded files.
	 * @extends sap.ui.core.Element
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @since 1.26
	 * @alias sap.m.UploadCollectionItem
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var UploadCollectionItem = Element.extend("sap.m.UploadCollectionItem", /** @lends sap.m.UploadCollectionItem.prototype */ {
		metadata : {

			library : "sap.m",
			properties : {

				/**
				 * Specifies the name of the user who uploaded the file.
				 * @deprecated since version 1.30. This property is deprecated; use the aggregation attributes instead.
				 * However, if the property is filled, it is displayed as an attribute. To make sure the title does not appear twice, do not use the property.
				 */
				contributor : {
					type : "string",
					group : "Data",
					defaultValue : null
				},

				/**
				 * Specifies a unique identifier of the file (created by the application).
				 */
				documentId : {
					type : "string",
					group : "Misc",
					defaultValue : null
				},

				/**
				 * Specifies the name of the uploaded file.
				 */
				fileName : {
					type : "string",
					group : "Misc",
					defaultValue : null
				},

				/**
				 * Specifies the size of the uploaded file (in megabytes).
				 * @deprecated since version 1.30. This property is deprecated; use the aggregation attributes instead.
				 */
				fileSize : {
					type : "float",
					group : "Misc",
					defaultValue : null
				},

				/**
				 * Specifies the MIME type of the file.
				 */
				mimeType : {
					type : "string",
					group : "Misc",
					defaultValue : null
				},

				/**
				 * Specifies the URL where the thumbnail of the file is located.
				 */
				thumbnailUrl : {
					type : "string",
					group : "Misc",
					defaultValue : null
				},

				/**
				 * Specifies the date on which the file was uploaded. 
				 * The application has to define the date format.
				 * @deprecated since version 1.30. This property is deprecated; use the aggregation attributes instead.
				 */
				uploadedDate : {
					type : "string",
					group : "Misc",
					defaultValue : null
				},

				/**
				 * Specifies the URL where the file is located.
				 */
				url : {
					type : "string",
					group : "Misc",
					defaultValue : null
				},

				/**
				 * Enables/Disables the Edit button.
				 * If the value is true, the Edit button is enabled and the edit function can be used.
				 * If the value is false, the edit function is not available.
				 */
				enableEdit : {
					type : "boolean",
					group : "Behavior",
					defaultValue : true
				},

				/**
				 * Enables/Disables the Edit button.
				 * If the value is true, the Edit button is enabled and the edit function can be used.
				 * If the value is false, the edit function is not available.
				 */
				enableDelete : {
					type : "boolean",
					group : "Behavior",
					defaultValue : true
				},

				/**
				 * Show/Hide the Edit button.
				 * If the value is true, the Edit button is visible.
				 * If the value is false, the Edit button is not visible.
				 */
				visibleEdit : {
					type : "boolean",
					group : "Behavior",
					defaultValue : true
				},

				/**
				 * Show/Hide the Delete button.
				 * If the value is true, the Delete button is visible.
				 * If the value is false, the Delete button is not visible.
				 */
				visibleDelete : {
					type : "boolean",
					group : "Behavior",
					defaultValue : true
				},

				/**
				 * Aria label for the icon (or for the image).
				 * @experimental since version 1.30. The behavior of the property might change in the next version.
				 */
				ariaLabelForPicture : {type : "string",
					group : "Accessibility",
					defaultValue : null
				}
			},
			defaultAggregation : "attributes",
			aggregations : {
				/**
				 * Attributes of an uploaded item, for example, 'Uploaded By', 'Uploaded On', 'File Size'
				 * Attributes are displayed after an item has been uploaded.
				 * The Active property of sap.m.ObjectAttribute is not supported.
				 * Note that if one of the deprecated properties contributor, fileSize or UploadedDate is filled in addition to this attribute, two attributes with the same title
				 * are displayed as these properties get displayed as an attribute.
				 * Example: An application passes the property ‘contributor’ with the value ‘A’ and the aggregation attributes ‘contributor’: ‘B’. As a result, the attributes
				 * ‘contributor’:’A’ and ‘contributor’:’B’ are displayed. To make sure the title does not appear twice, check if one of the properties is filled.
				 * @since 1.30
				 */
				attributes : {
					type : "sap.m.ObjectAttribute",
					multiple : true
				},
				/**
				 * Hidden aggregation for the attributes created from the deprecated properties uploadedDate, contributor and fileSize
				 * @since 1.30
				 */
				_propertyAttributes : {
					type : "sap.m.ObjectAttribute",
					multiple : true,
					visibility : "hidden"
				},
				/**
				 * Statuses of an uploaded item
				 * Statuses will be displayed after an item has been uploaded
				 * @since 1.30
				 */
				statuses : {
					type : "sap.m.ObjectStatus",
					multiple : true
				}
			},

			associations : {
				/**
				 * ID of the FileUploader instance
				 * since version 1.30
				 */
				fileUploader : {
					type : "sap.ui.unified.FileUploader",
					group : "misc",
					multiple : false
				}
			}
		}
	});

	UploadCollectionItem.prototype.init = function() {
		this._mDeprecatedProperties = {};
	};

	/**
	 * @description Setter of the deprecated contributor property. The property is mapped to the aggregation attributes.
	 * @deprecated since version 1.30
	 * @public
	 */
	UploadCollectionItem.prototype.setContributor = function(sContributor) {
		this.setProperty("contributor", sContributor, false);
		this._updateDeprecatedProperties();
		return this;
	};

	/**
	 * @description Setter of the deprecated uploadedDate property. The property is mapped to the aggregation attributes.
	 * @deprecated since version 1.30
	 * @public
	 */
	UploadCollectionItem.prototype.setUploadedDate = function(sUploadedDate) {
		this.setProperty("uploadedDate", sUploadedDate, false);
		this._updateDeprecatedProperties();
		return this;
	};

	/**
	 * @description Setter of the deprecated fileSize property. The property is mapped to the aggregation attributes.
	 * @deprecated since version 1.30
	 * @public
	 */
	UploadCollectionItem.prototype.setFileSize = function(sFileSize) {
		this.setProperty("fileSize", sFileSize, false);
		this._updateDeprecatedProperties();
		return this;
	};

	/**
	 * @description Update deprecated properties aggregation
	 * @private
	 * @since 1.30.
	 */
	UploadCollectionItem.prototype._updateDeprecatedProperties = function() {
		var aProperties = ["uploadedDate", "contributor", "fileSize"];
		this.removeAllAggregation("_propertyAttributes", true);
		jQuery.each(aProperties, function(i, sName) {
			var sValue = this.getProperty(sName),
					oAttribute = this._mDeprecatedProperties[sName];
			if (jQuery.type(sValue) === "number" && !!sValue  || !!sValue) {
				if (!oAttribute) {
					oAttribute = new ObjectAttribute({
						active : false
					});
					this._mDeprecatedProperties[sName] = oAttribute;
					this.addAggregation("_propertyAttributes", oAttribute, true);
					oAttribute.setText(sValue);
				} else {
					oAttribute.setText(sValue);
					this.addAggregation("_propertyAttributes", oAttribute, true);
				}
			} else if (oAttribute) {
				oAttribute.destroy();
				delete this._mDeprecatedProperties[sName];
			}
		}.bind(this));
		this.invalidate();
	};

	/**
	 * @description Return all attributes, the deprecated property attributes and the aggregated attributes in one array
	 * @private
	 * @since 1.30.
	 */
	UploadCollectionItem.prototype.getAllAttributes = function() {
		return this.getAggregation("_propertyAttributes", []).concat(this.getAttributes());
	};

	return UploadCollectionItem;

}, /* bExport= */true);
