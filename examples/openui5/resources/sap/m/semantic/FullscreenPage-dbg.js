/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/m/semantic/ShareMenuPage", "sap/m/semantic/SemanticConfiguration", "sap/m/semantic/SemanticPageRenderer", "sap/m/PagingButton"], function(ShareMenuPage, SemanticConfiguration, SemanticPageRenderer, PagingButton) {
	"use strict";

	/**
	 * Constructor for a new FullscreenPage
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * A FullscreenPage is a {@link sap.m.semantic.ShareMenuPage} that supports semantic content of the following types:
	 *
	 * <ul>
	 *  <li>{@link sap.m.semantic.AddAction}</li>
	 * 	<li>{@link sap.m.semantic.MainAction}</li>
	 * 	<li>{@link sap.m.semantic.PositiveAction}</li>
	 * 	<li>{@link sap.m.semantic.NegativeAction}</li>
	 * 	<li>{@link sap.m.semantic.ForwardAction}</li>
	 * 	<li>{@link sap.m.semantic.EditAction}</li>
	 * 	<li>{@link sap.m.semantic.SaveAction}</li>
	 * 	<li>{@link sap.m.semantic.CancelAction}</li>
	 * 	<li>{@link sap.m.semantic.FlagAction}</li>
	 * 	<li>{@link sap.m.semantic.FavoriteAction}</li>
	 * 	<li>{@link sap.m.semantic.OpenInAction}</li>
	 * 	<li>{@link sap.m.semantic.DiscussInJamAction}</li>
	 * 	<li>{@link sap.m.semantic.ShareInJamAction}</li>
	 * 	<li>{@link sap.m.semantic.SendEmailAction}</li>
	 * 	<li>{@link sap.m.semantic.SendMessageAction}</li>
	 * 	<li>{@link sap.m.semantic.PrintAction}</li>
	 * 	<li>{@link sap.m.semantic.MessagesIndicator}</li>
	 * 	<li>{@link sap.m.DraftIndicator}</li>
	 * </ul>
	 *
	 * @extends sap.m.semantic.ShareMenuPage
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @since 1.30.0
	 * @alias sap.m.semantic.FullscreenPage
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var FullscreenPage = ShareMenuPage.extend("sap.m.semantic.FullscreenPage", /** @lends sap.m.semantic.FullscreenPage.prototype */ {
		metadata: {
			aggregations: {
				/**
				 * Add action
				 */
				addAction: {
					type: "sap.m.semantic.AddAction",
					multiple: false
				},
				/**
				 * Main action
				 */
				mainAction: {
					type: "sap.m.semantic.MainAction",
					multiple: false
				},
				/**
				 * Positive action
				 */
				positiveAction: {
					type: "sap.m.semantic.PositiveAction",
					multiple: false
				},
				/**
				 * Negative action
				 */
				negativeAction: {
					type: "sap.m.semantic.NegativeAction",
					multiple: false
				},
				/**
				 * Negative action
				 */
				forwardAction: {
					type: "sap.m.semantic.ForwardAction",
					multiple: false
				},
				/**
				 * Edit action
				 */
				editAction: {
					type: "sap.m.semantic.EditAction",
					multiple: false
				},
				/**
				 * Save action
				 */
				saveAction: {
					type: "sap.m.semantic.SaveAction",
					multiple: false
				},
				/**
				 * Cancel action
				 */
				cancelAction: {
					type: "sap.m.semantic.CancelAction",
					multiple: false
				},
				/**
				 * Flag action
				 */
				flagAction: {
					type: "sap.m.semantic.FlagAction",
					multiple: false
				},
				/**
				 * Favorite action
				 */
				favoriteAction: {
					type: "sap.m.semantic.FavoriteAction",
					multiple: false
				},
				/**
				 * OpenIn action
				 */
				openInAction: {
					type: "sap.m.semantic.OpenInAction",
					multiple: false
				},
				/**
				 * DiscussInJam action
				 */
				discussInJamAction: {
					type: "sap.m.semantic.DiscussInJamAction",
					multiple: false
				},
				/**
				 * ShareInJam action
				 */
				shareInJamAction: {
					type: "sap.m.semantic.ShareInJamAction",
					multiple: false
				},
				/**
				 * SendEmail action
				 */
				sendEmailAction: {
					type: "sap.m.semantic.SendEmailAction",
					multiple: false
				},
				/**
				 * SendMessage action
				 */
				sendMessageAction: {
					type: "sap.m.semantic.SendMessageAction",
					multiple: false
				},
				/**
				 * Print action
				 */
				printAction: {
					type: "sap.m.semantic.PrintAction",
					multiple: false
				},
				/**
				 * MessagesIndicator
				 */
				messagesIndicator: {
					type: "sap.m.semantic.MessagesIndicator",
					multiple: false
				},
				/**
				 * SaveAsTile button
				 */
				saveAsTileAction: {
					type: "sap.m.Button",
					multiple: false
				},
				/**
				 * Paging action
				 */
				pagingAction: {
					type: "sap.m.PagingButton",
					multiple: false
				},
				/**
				 * DraftIndicator
				 */
				draftIndicator: {
					type: "sap.m.DraftIndicator",
					multiple: false
				}
			}
		},
		renderer: SemanticPageRenderer.render
	});

	/*
	Overwrite to proxy saveAsTile/pagingAction content into the respective child control aggregation
	 */
	FullscreenPage.prototype.setAggregation = function(sAggregationName, oObject, bSuppressInvalidate) {

		if ((sAggregationName === "saveAsTileAction")
				|| (sAggregationName === "pagingAction")
				|| (sAggregationName === "draftIndicator")) {

			var oPrivateReferenceName = '_' + sAggregationName;

			if (oObject) {
				this._addToInnerAggregation(oObject,
						SemanticConfiguration.getPositionInPage(sAggregationName),
						SemanticConfiguration.getSequenceOrderIndex(sAggregationName),
						bSuppressInvalidate);
				this[oPrivateReferenceName] = oObject;
			} else {//removing
				if (this[oPrivateReferenceName]) {
					this._removeFromInnerAggregation(this[oPrivateReferenceName], SemanticConfiguration.getPositionInPage(sAggregationName), bSuppressInvalidate);
					this[oPrivateReferenceName] = null;
				}
			}
			return;
		}

		ShareMenuPage.prototype.setAggregation.call(this, sAggregationName, oObject, bSuppressInvalidate);
	};

	FullscreenPage.prototype.getAggregation = function(sAggregationName, oObject, bSuppressInvalidate) {

		if ((sAggregationName === "saveAsTileAction")
				|| (sAggregationName === "pagingAction")
				|| (sAggregationName === "draftIndicator")) {

				return this['_' + sAggregationName];
		}

		return ShareMenuPage.prototype.getAggregation.call(this, sAggregationName, oObject, bSuppressInvalidate);
	};

	FullscreenPage.prototype.destroyAggregation = function(sAggregationName, bSuppressInvalidate) {

		if ((sAggregationName === "saveAsTileAction")
			|| (sAggregationName === "pagingAction")
			|| (sAggregationName === "draftIndicator")) {

			var oPrivateReferenceName = '_' + sAggregationName;

			if (this[oPrivateReferenceName]) {
				this._removeFromInnerAggregation(this[oPrivateReferenceName], SemanticConfiguration.getPositionInPage(sAggregationName), bSuppressInvalidate);
				this[oPrivateReferenceName].destroy();
				this[oPrivateReferenceName] = null;
			}
			return this;
		}

		return ShareMenuPage.prototype.destroyAggregation.call(this, sAggregationName, bSuppressInvalidate);
	};

	return FullscreenPage;
}, /* bExport= */ true);
