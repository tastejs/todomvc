/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides default renderer for the sap.m.FeedListItem
sap.ui.define(['jquery.sap.global', './ListItemBaseRenderer', 'sap/ui/core/Renderer'],
	function(jQuery, ListItemBaseRenderer, Renderer) {
	"use strict";


	/**
	 * FeedListItem renderer.
	 * @namespace
	 */
	var FeedListItemRenderer = Renderer.extend(ListItemBaseRenderer);
	
	/**
	 * Make sure that parent li is displayed as a horizontal webkit-box.
	 *
	 * @param {sap.ui.core.RenderManager}
	 *          rm the RenderManager that can be used for writing to the Render-Output-Buffer
	 * @param {sap.ui.core.Control}
	 *          oFeedListItem an object representation of the feed list item that should be rendered
	 */
	FeedListItemRenderer.renderLIAttributes = function(rm, oFeedListItem) {
		rm.addClass("sapMFeedListItemTitleDiv");
		if (oFeedListItem._showSeparators === sap.m.ListSeparators.None) {
			rm.addClass("sapMFeedListShowSeparatorsNone");
		} else {
			rm.addClass("sapMFeedListShowSeparatorsAll");
		}
	
	};
	
	/**
	 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager}
	 *          rm the RenderManager that can be used for writing to the Render-Output-Buffer
	 * @param {sap.ui.core.Control}
	 *          oFeedListItem an object representation of the feed list item that should be rendered
	 */
	FeedListItemRenderer.renderLIContent = function(rm, oFeedListItem) {
		// convenience variable
		var sMyId = oFeedListItem.getId(), bIsPhone = sap.ui.Device.system.phone;
	
		rm.write('<div');
		rm.addClass('sapMFeedListItem');
	
		rm.writeClasses();
		rm.write('>');
	
		// icon
		if (!!oFeedListItem.getShowIcon()) {
			this._writeImageControl(rm, oFeedListItem, sMyId);
		}
	
		// text (starting with sender)
	
		if (bIsPhone) {
			rm.write('<div class= "sapMFeedListItemHeader ');
			if (!!oFeedListItem.getShowIcon()) {
				rm.write('sapMFeedListItemHasFigure ');
			}
			if (!!oFeedListItem.getSender() && !!oFeedListItem.getTimestamp()) {
				rm.write('sapMFeedListItemFullHeight');
			}
			rm.write('" >');
			if (!!oFeedListItem.getSender()) {
				rm.write('<p id="' + sMyId + '-name" class="sapMFeedListItemTextName">');
				rm.renderControl(oFeedListItem._getLinkSender(false));
				rm.write('</p>');
			}
			if (!!oFeedListItem.getTimestamp()) {
				// write date
				rm.write('<p class="sapMFeedListItemTimestamp">');
				rm.writeEscaped(oFeedListItem.getTimestamp());
				rm.write('</p>');
			}
	
			rm.write('</div>');
			rm.write('<p class="sapMFeedListItemText">');
			rm.write('<span id="' + sMyId + '-realtext" class="sapMFeedListItemText">');
			if (!!oFeedListItem._checkTextIsExpandable()) {
				this._writeCollapsedText(rm, oFeedListItem, sMyId);
			} else {
				rm.writeEscaped(oFeedListItem.getText(), true);
				rm.write('</span>');
			}
			rm.write('</p>');
			if (!!oFeedListItem.getInfo()) {
				// info
				rm.write('<p class="sapMFeedListItemFooter">');
				if (!!oFeedListItem.getInfo()) {
					rm.write('<span id="' + sMyId + '-info" class="sapMFeedListItemInfo">');
					rm.writeEscaped(oFeedListItem.getInfo());
					rm.write('</span>');
				}
				rm.write('</p>');
			}
		} else {
			rm.write('<div class= "sapMFeedListItemText ');
			if (!!oFeedListItem.getShowIcon()) {
				rm.write('sapMFeedListItemHasFigure ');
			}
			rm.write('" >');
			rm.write('<p id="' + sMyId + '-text" class="sapMFeedListItemTextText" >');
			if (!!oFeedListItem.getSender()) {
				rm.write('<span id="' + sMyId + '-name" class="sapMFeedListItemTextName">');
				rm.renderControl(oFeedListItem._getLinkSender(true));
				rm.write(' ');
				rm.write('</span>');
			}
			rm.write('<span id="' + sMyId + '-realtext" class="sapMFeedListItemTextString">');
			if (!!oFeedListItem._checkTextIsExpandable()) {
				this._writeCollapsedText(rm, oFeedListItem, sMyId);
			} else {
				rm.writeEscaped(oFeedListItem.getText(), true);
				rm.write('</span>');
			}
			rm.write('</p>');
			if (!!oFeedListItem.getInfo() || !!oFeedListItem.getTimestamp()) {
				// info and date
				rm.write('<p class="sapMFeedListItemFooter">');
				if (!sap.ui.getCore().getConfiguration().getRTL()) {
					if (!!oFeedListItem.getInfo()) {
						this._writeInfo(rm, oFeedListItem, sMyId);
						// Write Interpunct separator if necessary (with spaces before and after)
						if (!!oFeedListItem.getTimestamp()) {
							rm.write("<span>&#160&#160&#x00B7&#160&#160</span>");
						}
					}
					if (!!oFeedListItem.getTimestamp()) {
						this._writeTimestamp(rm, oFeedListItem, sMyId);
					}
				} else {
					if (!!oFeedListItem.getTimestamp()) {
						this._writeTimestamp(rm, oFeedListItem, sMyId);
					}
					if (!!oFeedListItem.getInfo()) {
						// Write Interpunct separator if necessary (with spaces before and after)
						if (!!oFeedListItem.getTimestamp()) {
							rm.write("<span>&#160&#160&#x00B7&#160&#160</span>");
						}
						this._writeInfo(rm, oFeedListItem, sMyId);
					}
	
				}
				rm.write('</p>');
			}
			rm.write('</div>');
		}
		rm.write('</div>');
	};
	
	FeedListItemRenderer._writeImageControl = function(rm, oFeedListItem, sMyId) {
		rm.write('<figure id="' + sMyId + '-figure"');
		rm.addClass('sapMFeedListItemFigure');
		if (!oFeedListItem.getIcon()) {
			rm.addClass('sapMFeedListItemIsDefaultIcon');
		}
		rm.writeClasses();
		rm.write('>');
		rm.renderControl(oFeedListItem._getImageControl());
		rm.write('</figure>');
	};
	
	FeedListItemRenderer._writeCollapsedText = function(rm, oFeedListItem, sMyId) {
		// 'oFeedListItem._bTextExpanded' is true if the text had been expanded and rendering needs to be done again.
		if (oFeedListItem._bTextExpanded) {
			rm.writeEscaped(oFeedListItem._sFullText, true);
			rm.write('</span>');
			rm.write('<span id="' + sMyId + '-threeDots" class ="sapMFeedListItemTextString">');
			rm.write("&#32"); // space
			rm.write('</span>');
		} else {
			rm.writeEscaped(oFeedListItem._getCollapsedText(), true);
			rm.write('</span>');
			rm.write('<span id="' + sMyId + '-threeDots" class ="sapMFeedListItemTextString">');
			rm.write("&#32&#46&#46&#46&#32"); // space + three dots + space
			rm.write('</span>');
		}
		var oLinkExpandCollapse = oFeedListItem._getLinkExpandCollapse();
		oLinkExpandCollapse.addStyleClass("sapMFeedListItemLinkExpandCollapse");
		rm.renderControl(oLinkExpandCollapse);
	};
	
	FeedListItemRenderer._writeTimestamp = function(rm, oFeedListItem, sMyId) {
		rm.write('<span id="' + sMyId + '-timestamp">');
		rm.writeEscaped(oFeedListItem.getTimestamp());
		rm.write('</span>');
	};
	
	FeedListItemRenderer._writeInfo = function(rm, oFeedListItem, sMyId) {
		rm.write('<span id="' + sMyId + '-info">');
		rm.writeEscaped(oFeedListItem.getInfo());
		rm.write('</span>');
	};
	

	return FeedListItemRenderer;

}, /* bExport= */ true);
