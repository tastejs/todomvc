/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides default renderer for the sap.ui.ux3.FeedChunk
sap.ui.define(['jquery.sap.global'],
	function(jQuery) {
	"use strict";


	/**
	 * FeedChunk renderer.
	 * @namespace
	 */
	var FeedChunkRenderer = {
	};

	/**
	 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} oRenderManager the RenderManager that can be used for writing to the Render-Output-Buffer
	 * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
	 */
	FeedChunkRenderer.render = function(oRenderManager, oControl){
		// convenience variable
		var rm = oRenderManager;
		var oChunk = oControl;
		// check if chunk is a comment (child) of an other chunk
		if (oChunk.getParent() instanceof sap.ui.ux3.FeedChunk) {
			oChunk.bComment = true;
		} else {
			oChunk.bComment = false;
		}
		var sMyId = oChunk.getId();

		rm.write('<ARTICLE');
		rm.writeControlData(oChunk);
		rm.addClass('sapUiFeedChunk');
		if (oChunk.bComment) {
			rm.addClass('sapUiFeedChunkComment');
		}

		rm.writeClasses();
		rm.write('>');

		// thumbnail
		rm.write('<img id=' + sMyId + '-thumb');
		var sThumbnail = oChunk.getThumbnailSrc();
		if (!sThumbnail) {
			sThumbnail = jQuery.sap.getModulePath("sap.ui.ux3.themes." + sap.ui.getCore().getConfiguration().getTheme(), sap.ui.core.theming.Parameters.get('sapUiFeedPersonPlaceholder'));
		}
		rm.writeAttributeEscaped('src', sThumbnail);
		rm.writeAttributeEscaped('alt', oChunk.getSender());
		rm.writeClasses();
		rm.write('>');

		// text (starting with sender)
		rm.write('<DIV class= "sapUiFeedChunkText" >');
		rm.write('<a id=' + sMyId + '-sender ');
		/* eslint-disable no-script-url */
		rm.writeAttribute('href', 'javascript:void(0);');
		/* eslint-enable no-script-url */
		rm.write('>');
		rm.writeEscaped(oChunk.getSender());
		rm.write('</a> ');

		// HCM action MenuButton
		if (oChunk.oHCMMenuButton) {
			rm.renderControl(oChunk.oHCMMenuButton);
		}

		this.renderText(rm, oChunk);
		rm.write('</DIV>');

		// status icons
		if (!oChunk.bComment) {
			rm.write('<UL class= "sapUiFeedChunkStatusIcons" >');
			if (oChunk.getFlagged()) {
				rm.write('<LI class= "sapUiFeedChunkFlagged" title="' + oChunk.rb.getText('FEED_FLAGGED') + '" >&#9873</LI>');
			}
			if (oChunk.getFavorite()) {
				rm.write('<LI class= "sapUiFeedChunkFavorite" title="' + oChunk.rb.getText('FEED_FAVORITE') + '" >&#9733</LI>');
			}
			if (oChunk.getShared()) {
				rm.write('<LI class= "sapUiFeedChunkShared" title="' + oChunk.rb.getText('FEED_SHARED') + '" >&#8635</LI>');
			}
			rm.write('</UL>');
		}

		// date
		rm.write('<SPAN class= "sapUiFeedChunkByline" >');
		rm.writeEscaped(oChunk.getTimestamp());
		rm.write('</SPAN>');

		if (!oChunk.bComment) {
			// action buttons (only if exists)
			if (oChunk.oToolsButton) {
				rm.renderControl(oChunk.oToolsButton);
			}
			if (oChunk.getEnableShare()) {
				rm.write('<BUTTON type = "button" id=' + sMyId + '-ActShare class= "sapUiFeedChunkAct sapUiFeedChunkActShare" title="' + oChunk.rb.getText('FEED_ACT_SHARE') + '" >&#8635</BUTTON>');
			}
			if (oChunk.getEnableInspect()) {
				rm.write('<BUTTON type = "button" id=' + sMyId + '-ActInspect class= "sapUiFeedChunkAct sapUiFeedChunkActInspect" title="' + oChunk.rb.getText('FEED_ACT_INSPECT') + '" >i</BUTTON>');
			}
			if (oChunk.getEnableFavorite()) {
				rm.write('<BUTTON type = "button" id=' + sMyId + '-ActFavorite class= "sapUiFeedChunkAct sapUiFeedChunkActFavorite" title="' + oChunk.rb.getText('FEED_ACT_FAVORITE') + '" >&#9733</BUTTON>');
			}
			if (oChunk.getEnableFlag()) {
				rm.write('<BUTTON type = "button" id=' + sMyId + '-ActFlag class= "sapUiFeedChunkAct sapUiFeedChunkActFlag" title="' + oChunk.rb.getText('FEED_ACT_FLAG') + '" >&#9873</BUTTON>');
			}
			if (oChunk.getEnableComment()) {
				rm.write('<BUTTON type = "button" id=' + sMyId + '-ActComment class= "sapUiFeedChunkAct sapUiFeedChunkActComment" title="' + oChunk.rb.getText('FEED_ACT_COMMENT') + '" >C</BUTTON>');
			}
		}

		// delete button
		if (oChunk.getDeletionAllowed() && oChunk.bComment) {
			rm.write('<BUTTON type = "button" id=' + sMyId + '-delete class= "sapUiFeedChunkDel" title="' + oChunk.rb.getText('FEED_DELETE') + '" >X</BUTTON>');
		}

		// comments
		if (oChunk.getComments().length > 0 || oChunk.showCommentFeeder) {
			rm.write("<SECTION>");
			this.renderComments(rm, oChunk);
			rm.write("</SECTION>");
		}

		rm.write('</ARTICLE>');
	};

	/*
	 *	Render text with @References
	 */
	FeedChunkRenderer.renderText = function(rm, oChunk){

		var sText = oChunk.getText();
		var i = 0;
		var iPos = 0;

		do {
			iPos = sText.search(/\s/);
			var sSpace = "",
				sWord = "";

			if (iPos < 0) {
				// only 1 word
				sWord = sText;
			} else {
				sWord = sText.slice(0, iPos);
				sSpace = sText.slice(iPos, iPos + 1);
				sText = sText.slice(iPos + 1);
			}

			// check for special strings
			if (/^@/.test(sWord)) {
				// @-reference
				rm.write('<a id=' + oChunk.getId() + '-Ref' + i);
				/* eslint-disable no-script-url */
				rm.writeAttribute('href', 'javascript:void(0);');
				/* eslint-enable no-script-url */
				rm.write('>');
				rm.writeEscaped(sWord, true);
				rm.write('</a>', sSpace);
				i++;
			} else if (/^(https?|ftp):\/\//i.test(sWord) && jQuery.sap.validateUrl(sWord)) {
				// web link - valid URL
				rm.write('<a');
				rm.writeAttribute('href', jQuery.sap.encodeHTML(sWord));
				rm.write('>');
				rm.writeEscaped(sWord, true);
				rm.write('</a>',sSpace);
			} else if (/^(www\.)/i.test(sWord) && jQuery.sap.validateUrl("http://" + sWord)) {
				// web link without protocol -> use HTTP - valid URL
				rm.write('<a');
				rm.writeAttribute('href', jQuery.sap.encodeHTML("http://" + sWord));
				rm.write('>');
				rm.writeEscaped(sWord, true);
				rm.write('</a>',sSpace);
			} else if (/^[\w\.=-]+@[\w\.-]+\.[\w]{2,5}$/.test(sWord)) {
				//email - not 100% validity check and validation missing
				rm.write('<a');
				rm.writeAttribute('href', "mailto:" + jQuery.sap.encodeHTML(sWord));
				rm.write('>');
				rm.writeEscaped(sWord, true);
				rm.write('</a>',sSpace);
			} else {
				// normal word
				rm.writeEscaped(sWord + sSpace, true);
			}
		}while (iPos >= 0);

	};

	/*
	 *	Render comment section content
	 */
	FeedChunkRenderer.renderComments = function(rm, oChunk){

		var oComments = oChunk.getComments();
		var iLength = oComments.length;

		// number of comments
		rm.write('<HEADER class= "sapUiFeedChunkComments" >');
		if (oChunk.rb) {
			rm.write(oChunk.rb.getText('FEED_NO_COMMENTS', [iLength]));

			if (iLength > oChunk.maxComments) {
				rm.write('<a id=' + oChunk.getId() + '-all ');
				/* eslint-disable no-script-url */
				rm.writeAttribute('href', 'javascript:void(0);');
				/* eslint-enable no-script-url */
				rm.write('>');
				if (!oChunk.allComments) {
					rm.write(oChunk.rb.getText('FEED_ALL_COMMENTS'));
				} else {
					rm.write(oChunk.rb.getText('FEED_MAX_COMMENTS'));
				}
				rm.write('</a>');
			}
		}
		rm.write("</HEADER>");

		// comments are sorted from old to new. Newest comment is on the bottom
		var iNumberChunks = iLength;
		if (!oChunk.allComments && oChunk.maxComments < iNumberChunks) {
			iNumberChunks = oChunk.maxComments;
		}

		for ( var i = 0; i < iNumberChunks; i++) {
			rm.renderControl(oComments[iLength - iNumberChunks + i]);
		}

		// comment feeder
		if (oChunk.oCommentFeeder) {
			rm.renderControl(oChunk.oCommentFeeder);
		}

	};

	/*
	 *	Render expand button
	 */
	FeedChunkRenderer.renderExpander = function(oChunk){

		if (oChunk.expanded) {
			return "<button id= '" + oChunk.getId() + "-exp' class='sapUiFeedChunkCollapse' title='" + oChunk.rb.getText("FEED_COLLAPS") + "'>&#9660</button>";
		} else {
			return "<button id= '" + oChunk.getId() + "-exp' class='sapUiFeedChunkExpand' title='" + oChunk.rb.getText("FEED_EXPAND") + "'>&#9660</button>";
		}

	};

	return FeedChunkRenderer;

}, /* bExport= */ true);
