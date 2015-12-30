/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.ux3.FeedChunk.
sap.ui.define(['jquery.sap.global', 'sap/ui/commons/MenuButton', 'sap/ui/core/Control', 'sap/ui/core/theming/Parameters', './Feeder', './library'],
	function(jQuery, MenuButton, Control, Parameters, Feeder, library) {
	"use strict";


	
	/**
	 * Constructor for a new FeedChunk.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given 
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * The unit that is embedded - single-wise or in a multiple way - into a Feed control.
	 * The control provides a set of properties for text, sender information, time stamp,
	 * comments, and functions such as flagging the entry to be favorite, shared, or flagged.
	 * @extends sap.ui.core.Control
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 *
	 * @constructor
	 * @public
	 * @experimental Since version 1.2. 
	 * The whole Feed/Feeder API is still under discussion, significant changes are likely. Especially text presentation (e.g. @-references and formatted text) is not final. Also the Feed model topic is still open.
	 * @alias sap.ui.ux3.FeedChunk
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var FeedChunk = Control.extend("sap.ui.ux3.FeedChunk", /** @lends sap.ui.ux3.FeedChunk.prototype */ { metadata : {
	
		library : "sap.ui.ux3",
		properties : {
	
			/**
			 * URL to the thumbnail image.
			 */
			thumbnailSrc : {type : "sap.ui.core.URI", group : "Data", defaultValue : null},
	
			/**
			 * The FeedChunk text. @References are supported.
			 */
			text : {type : "string", group : "Data", defaultValue : null},
	
			/**
			 * Sender of the chunk
			 */
			sender : {type : "string", group : "Data", defaultValue : null},
	
			/**
			 * Format is ISO 8601 YYYY-MM-DDThh:mm:ss.sZ, Z meaning the time is in UTC time zone
			 */
			timestamp : {type : "string", group : "Data", defaultValue : null},
	
			/**
			 * Flag if the deletion of the chunk shall be allowed
			 */
			deletionAllowed : {type : "boolean", group : "Behavior", defaultValue : false},
	
			/**
			 * This flag changes a FeedChunk into a CommentChunk. In this case, it can not have own comments,
			 * furthermore it must be assigned to a FeedChunk.
			 * @deprecated Since version 1.4.0. 
			 * Not longer used. If a chunk is a comment is determined from hierarchy. If the parent is a chunk it's automatically a comment.
			 */
			commentChunk : {type : "boolean", group : "Appearance", defaultValue : false, deprecated: true},
	
			/**
			 * URL to the thumbnail image for the comment feeder.
			 * This property is optional if the chunk is a sub-control of a feed control. In this case the value of the feed control is used if it's not set. So it must be only set once on the feed control.
			 */
			feederThumbnailSrc : {type : "sap.ui.core.URI", group : "Data", defaultValue : null},
	
			/**
			 * Sender for the comment feeder
			 * This property is optional if the chunk is a sub-control of a feed control. In this case the value of the feed control is used if it's not set. So it must be only set once on the feed control.
			 */
			feederSender : {type : "string", group : "Data", defaultValue : null},
	
			/**
			 * Defines whether the entry is flagged. This property is not supported for comment chunks.
			 */
			flagged : {type : "boolean", group : "Data", defaultValue : false},
	
			/**
			 * Defines whether the entry shall be displayed as favorite. This property is not supported for comment chunks.
			 */
			favorite : {type : "boolean", group : "Data", defaultValue : null},
	
			/**
			 * Defines whether the entry shall be shared. This property is not supported for comment chunks.
			 */
			shared : {type : "boolean", group : "Data", defaultValue : false},
	
			/**
			 * If true the flag action is enabled.
			 */
			enableFlag : {type : "boolean", group : "Appearance", defaultValue : true},
	
			/**
			 * If true the share action is enabled.
			 */
			enableShare : {type : "boolean", group : "Appearance", defaultValue : true},
	
			/**
			 * If true the comment action is enabled.
			 */
			enableComment : {type : "boolean", group : "Appearance", defaultValue : true},
	
			/**
			 * If true the inspect action is enabled.
			 */
			enableInspect : {type : "boolean", group : "Appearance", defaultValue : true},
	
			/**
			 * If true the favorite action is enabled.
			 */
			enableFavorite : {type : "boolean", group : "Appearance", defaultValue : true}
		},
		aggregations : {
	
			/**
			 * Comments on this chunk
			 */
			comments : {type : "sap.ui.ux3.FeedChunk", multiple : true, singularName : "comment", bindable : "bindable"}, 
	
			/**
			 * MenuItems to open when there is a click on the action menu button
			 */
			actionMenuItems : {type : "sap.ui.commons.MenuItem", multiple : true, singularName : "actionMenuItem", bindable : "bindable"}
		},
		events : {
	
			/**
			 * Event is fired when the deletion button is pressed.
			 */
			deleted : {}, 
	
			/**
			 * Event is raised when a comment is added to the entry. This event is not supported for comment chunks.
			 */
			commentAdded : {
				parameters : {
	
					/**
					 * New comment chunk
					 */
					comment : {type : "sap.ui.ux3.FeedChunk"}
				}
			}, 
	
			/**
			 * Event is raised when the user clicks to flag the entry. This event is not supported for comment chunks.
			 */
			toggleFlagged : {
				parameters : {
	
					/**
					 * Current flagged state
					 */
					flagged : {type : "boolean"}
				}
			}, 
	
			/**
			 * Event is fired when the thumbnail or the name of the sender is clicked.
			 */
			senderClicked : {}, 
	
			/**
			 * Click on a @-reference
			 */
			referenceClicked : {
				parameters : {
	
					/**
					 * Text of the @-reference
					 */
					text : {type : "string"}
				}
			}, 
	
			/**
			 * Event is raised when the user clicks to set the entry as favorite. This event is not supported for comment chunks.
			 */
			toggleFavorite : {
				parameters : {
	
					/**
					 * Current favorite state
					 */
					favorite : {type : "boolean"}
				}
			}, 
	
			/**
			 * Event is fired when the inspect button was pressed
			 */
			inspect : {}, 
	
			/**
			 * Event is raised when the user clicks to share the entry. This event is not supported for comment chunks.
			 */
			toggleShared : {
				parameters : {
	
					/**
					 * Current shared state
					 */
					shareed : {type : "boolean"}
				}
			}, 
	
			/**
			 * Event is fired when an item from the action menu button was selected.
			 */
			actionItemSelected : {
				parameters : {
	
					/**
					 * The Id of the selected item
					 */
					itemId : {type : "string"}, 
	
					/**
					 * The selected item
					 */
					item : {type : "sap.ui.unified.MenuItemBase"}
				}
			}
		}
	}});
	
	
	///**
	// * This file defines behavior for the control,
	// */
	
	FeedChunk.prototype.init = function(){
	   this.maxComments = 2; // max. number of comments displayed initially
	   this.allComments = false; // initially render only maxComments
	   this.rb = sap.ui.getCore().getLibraryResourceBundle("sap.ui.ux3");
	   this.expanded = false;
	};
	
	FeedChunk.prototype.initCommentFeeder = function(){
	
		// create comment feeder if needed
		if (!this.oCommentFeeder) {
			this.oCommentFeeder = new Feeder( this.getId() + '-CommentFeeder', {
				type: sap.ui.ux3.FeederType.Comment
			}).setParent(this);
			this.oCommentFeeder.attachEvent('submit', this.handleCommentFeederSubmit, this); // attach event this way to have the right this-reference in handler
			this.showCommentFeeder = true;
		}
	
	};
	
	FeedChunk.prototype.initToolsButton = function(){
	
		if (!this.oToolsButton) {
			this.oToolsButton = new MenuButton( this.getId() + '-toolsButton', {
				tooltip: this.rb.getText('FEED_TOOLS'),
				lite: true,
				menu: new sap.ui.commons.Menu(this.getId() + '-toolsMenu')
			}).setParent(this);
			this.oToolsButton.attachEvent('itemSelected', this.handleToolsButtonSelected, this); // attach event this way to have the right this-reference in handler
	
			var sIcon = Parameters.get('sap.ui.ux3.Feed:sapUiFeedToolsIconUrl');
			var sIconHover = Parameters.get('sap.ui.ux3.Feed:sapUiFeedToolsIconHoverUrl');
			var sThemeModulePath = "sap.ui.ux3.themes." + sap.ui.getCore().getConfiguration().getTheme();
			if (sIcon) {
				this.oToolsButton.setProperty('icon', jQuery.sap.getModulePath(sThemeModulePath, sIcon), true);
			}
			if (sIconHover) {
				this.oToolsButton.setProperty('iconHovered', jQuery.sap.getModulePath(sThemeModulePath, sIconHover), true);
			}
		}
	
	};
	
	FeedChunk.prototype.exit = function(){
	
		if (this.oCommentFeeder) {
			this.oCommentFeeder.destroy();
			delete this.oCommentFeeder;
		}
		if (this.oToolsButton) {
			this.oToolsButton.destroy();
			delete this.oToolsButton;
		}
		this.rb = undefined;
		this.showCommentFeeder = undefined;
		this.expanded = undefined;
		this.oText = undefined;
		if (this.oHCMMenuButton) {
			this.oHCMMenuButton.destroy();
			delete this.oHCMMenuButton;
		}
	
	};
	
	FeedChunk.prototype.onAfterRendering = function(){
	
		// if text is cut show expand button
		this.oText = this.$().children(".sapUiFeedChunkText").get(0);
		if (this.oText.clientHeight < this.oText.scrollHeight) {
			// if tags are rendered put button in tag-DIV
			var oFather = this.$().children(".sapUiFeedChunkByline").get(0);
			jQuery(oFather).append(sap.ui.ux3.FeedChunkRenderer.renderExpander(this));
	
			if (this.expanded) {
				// expanded
				jQuery(this.oText).css('height', 'auto');
			}
		}
	
	};
	
	/**
	 * handler for click event
	 *
	 * @private
	 */
	FeedChunk.prototype.onclick = function(oEvent){
	
		var sTargetId = oEvent.target.getAttribute( 'ID' );
	
		if (sTargetId) {
			switch ( sTargetId ) {
			case ( this.getId() + '-delete' ):
				// Click on delete button
				this.fireDeleted();
			break;
			case ( this.getId() + '-sender'):
				// Click on sender
				this.fireSenderClicked();
			break;
			case ( this.getId() + '-thumb' ):
				// Click on sender
				this.fireSenderClicked();
			break;
			case ( this.getId() + '-exp' ):
				// Click on expand/collapse button
				var sNewTitle = '';
				if (this.expanded) {
					// collapse
					jQuery(this.oText).css('height', '');
					sNewTitle = this.rb.getText("FEED_EXPAND");
					this.expanded = false;
				} else {
					// expand
					jQuery(this.oText).css('height', 'auto');
					sNewTitle = this.rb.getText("FEED_COLLAPSE");
					this.expanded = true;
				}
				jQuery.sap.byId(sTargetId).attr('title',sNewTitle).toggleClass('sapUiFeedChunkExpand sapUiFeedChunkCollapse');
			break;
			case ( this.getId() + '-all' ):
				// Click on sender
				this.showAllComments();
			break;
			case ( this.getId() + '-ActComment' ):
				// Click Add comment button
				if (!this.showCommentFeeder) {
					this.initCommentFeeder();
					this.rerender();
				}
			break;
			case ( this.getId() + '-ActFlag' ):
				// Click flag button
				this.setFlagged(!this.getFlagged());
				this.fireToggleFlagged({flagged: this.getFlagged()});
			break;
			case ( this.getId() + '-ActFavorite' ):
				// Click favorite button
				this.setFavorite(!this.getFavorite());
				this.fireToggleFavorite({favorite: this.getFavorite()});
			break;
			case ( this.getId() + '-ActInspect' ):
				// Click inspect button
				this.fireInspect();
			break;
			case ( this.getId() + '-ActShare' ):
				// Click favorite button
				this.setShared(!this.getShared());
				this.fireToggleShared({shared: this.getShared()});
			break;
			default:
				//Reference
				if (sTargetId.search(this.getId() + '-Ref') != -1) {
					this.fireReferenceClicked({text: jQuery(oEvent.target).text()});
				}
	
			break;
			}
		}
	
		oEvent.stopPropagation(); //to prevent comment chunks to propagate event to parentChunk
	
	};
	
	/**
	 * show all comments
	 * rerender comment section
	 *
	 * @private
	 */
	FeedChunk.prototype.showAllComments = function(){
	
		this.allComments = !this.allComments;
	
		var $commentSection = jQuery.sap.byId(this.getId() + " > section"); // use sap function instead of jQuery child selector because of escaping ID
		if ($commentSection.length > 0) {
			var rm = sap.ui.getCore().createRenderManager();
			this.getRenderer().renderComments(rm, this);
			rm.flush($commentSection[0]);
			rm.destroy();
		}
	
	};
	
	/**
	 * Handler for Comment feeder submit event
	 *
	 * @private
	 */
	FeedChunk.prototype.handleCommentFeederSubmit = function(oEvent){
	
		var oDate = new Date();
	//	var sDate = String(oDate.getFullYear()) + String(oDate.getMonth()) + String(oDate.getDate()) + String(oDate.getHours()) + String(oDate.getMinutes()) + String(oDate.getSeconds());
		var sDate = String(oDate);
	
		var oNewComment = new FeedChunk(this.getId() + '-new-' + this.getComments().length, {
			text: oEvent.getParameter('text'),
			commentChunk: true,
			deletionAllowed: true,
			timestamp: sDate,
			sender: this.getFeederSender(),
			thumbnailSrc: this.getFeederThumbnailSrc()
		});
	
		// new comments are shown at the bottom
		this.addComment(oNewComment);
		this.fireCommentAdded({comment: oNewComment});
	
	};
	
	/**
	 * Handler for tools menu button item selection
	 *
	 * @private
	 */
	FeedChunk.prototype.handleToolsButtonSelected = function(oEvent){
	
		if (oEvent.getParameter('itemId') == this.getId() + '-actDelete') {
			this.fireDeleted();
		} else {
			// just forward event
			this.fireActionItemSelected(oEvent.mParameters);
		}
	
	};
	
	/*
	 * Overwrite generated function
	 */
	FeedChunk.prototype.insertComment = function(oComment, iIndex) {
	
		this.insertAggregation("comments", oComment, iIndex);
		this.initCommentFeeder();
		return this;
	
	};
	
	FeedChunk.prototype.addComment = function(oComment) {
	
		this.addAggregation("comments", oComment);
		this.initCommentFeeder();
		return this;
	
	};
	
	FeedChunk.prototype.setDeletionAllowed = function(bDeletionAllowed) {
	
		if (bDeletionAllowed == this.getDeletionAllowed()) {
			// nothing to do
			return this;
		}
	
		this.setProperty("deletionAllowed", bDeletionAllowed);
		if (bDeletionAllowed) {
			this.initToolsButton();
			//add deletion item from menu
			this.oToolsButton.getMenu().insertItem(new sap.ui.commons.MenuItem(this.getId() + '-actDelete',{text: this.rb.getText('FEED_DELETE')}), 0);
		} else {
			//remove deletion item from menu
			if (this.oToolsButton) {
				this.oToolsButton.getMenu().removeItem(this.getId() + '-actDelete');
			}
		}
	
		return this;
	
	};
	
	// connect ActionMenuItems to MenuButtons menu
	FeedChunk.prototype.getActionMenuItems = function() {
	
		if (this.oToolsButton) {
			// as parent of items is the menu use menus aggregation
			var aItems = this.oToolsButton.getMenu().getItems();
			// remove delete item
			if (aItems.length > 0 && aItems[0].getId() == (this.getId() + '-actDelete')) {
				aItems.shift();
			}
			return aItems;
		}
	
	};
	
	FeedChunk.prototype.insertActionMenuItem = function(oActionMenuItem, iIndex) {
	
		this.initToolsButton();
		// if there is a delete item adjust index
		var aItems = this.oToolsButton.getMenu().getItems();
		if (aItems.length > 0 && aItems[0].getId() == (this.getId() + '-actDelete')) {
			iIndex++;
		}
		this.oToolsButton.getMenu().insertItem(oActionMenuItem, iIndex);
		return this;
	
	};
	
	FeedChunk.prototype.addActionMenuItem = function(oActionMenuItem) {
	
		this.initToolsButton();
		// as parent of items is the menu use menus aggregation
		this.oToolsButton.getMenu().addItem(oActionMenuItem);
		return this;
	
	};
	
	FeedChunk.prototype.removeActionMenuItem = function(vActionMenuItem) {
	
		if (this.oToolsButton) {
			return this.oToolsButton.getMenu().removeItem(vActionMenuItem);
		}
	
	};
	
	FeedChunk.prototype.removeAllActionMenuItems = function() {
	
		if (this.oToolsButton) {
			// if there is a delete item do not remove it
			var aItems = this.oToolsButton.getMenu().getItems();
			if (aItems.length > 0 && aItems[0].getId() == (this.getId() + '-actDelete')) {
				aItems.shift();
				for ( var i = 0; i < aItems.length; i++) {
					this.oToolsButton.getMenu().removeItem(aItems[i]);
				}
				return aItems;
			} else {
				return this.oToolsButton.getMenu().removeAllItems();
			}
		}
	
	};
	
	FeedChunk.prototype.indexOfActionMenuItem = function(oActionMenuItem) {
	
		if (this.oToolsButton) {
			var iIndex = this.oToolsButton.getMenu().indexOfItem(oActionMenuItem);
			// if there is a delete item adjust index
			var aItems = this.oToolsButton.getMenu().getItems();
			if (aItems.length > 0 && aItems[0].getId() == (this.getId() + '-actDelete')) {
				iIndex--;
			}
			return iIndex;
		}
	
	};
	
	FeedChunk.prototype.destroyActionMenuItems = function() {
	
		if (this.oToolsButton) {
			// if there is a delete item only remove all other items
			var aItems = this.oToolsButton.getMenu().getItems();
			if (aItems.length > 0 && aItems[0].getId() == (this.getId() + '-actDelete')) {
				this.removeAllActionMenuItems();
			} else {
				this.oToolsButton.getMenu().destroyItems();
			}
		}
	
		return this;
	
	};
	
	FeedChunk.prototype.bindActionMenuItems = function(sPath, oTemplate, oSorter, aFilters) {
	
		this.initToolsButton();
		// as parent of items is the menu use menus aggregation
		this.oToolsButton.getMenu().bindItems(sPath, oTemplate, oSorter, aFilters);
	
		return this;
	
	};
	
	FeedChunk.prototype.unbindActionMenuItems = function() {
	
		if (this.oToolsButton) {
			this.oToolsButton.getMenu().unbindItems();
		}
	
		return this;
	
	};
	
	/*
	 * Overwrite standard getter for feeder thumbnail source:
	 * If not set and feedChunk is child of a Feed or FeedChunk use the thumbnailsource of the parent
	 * So it must not be set manual for each sub-control and is always synchron
	 */
	FeedChunk.prototype.getFeederThumbnailSrc = function() {
		var sThumbnailSrc =  this.getProperty("feederThumbnailSrc");
	
		if (!sThumbnailSrc || sThumbnailSrc == "") {
			var oParent = this.getParent();
			if (oParent && (oParent instanceof sap.ui.ux3.Feed || oParent instanceof FeedChunk)) {
				sThumbnailSrc = oParent.getFeederThumbnailSrc();
			}
		}
	
		return sThumbnailSrc;
	};
	
	/*
	 * Overwrite standard getter for feeder sender:
	 * If not set and feedChunk is child of a Feed or FeedChunk use the feederSender of the parent
	 * So it must not be set manual for each sub-control and is always synchron
	 */
	FeedChunk.prototype.getFeederSender = function() {
		var sSender =  this.getProperty("feederSender");
	
		if (!sSender || sSender == "") {
			var oParent = this.getParent();
			if (oParent && (oParent instanceof sap.ui.ux3.Feed || oParent instanceof FeedChunk)) {
				sSender = oParent.getFeederSender();
			}
		}
	
		return sSender;
	};
	
	FeedChunk.prototype.initHCMMenuButton = function(){
	
		if (!this.oHCMMenuButton) {
			this.oHCMMenuButton = new MenuButton(this.getId() + "-HCMMenu",{
				lite: true
			}).setParent(this);
			this.oHCMMenuButton.attachEvent('itemSelected', this.handleHCMMenuButtonSelected, this); // attach event this way to have the right this-reference in handler
		}
	
	};
	
	/**
	 * Sets the MenuButton for HCM applications
	 * This is NOT an official API method and must be only uses with approval of SAPUI5 team
	 * @param(sap.ui.commons.Menu) oMenu Menu control
	 * @private
	 */
	FeedChunk.prototype.setHCMMenu = function(oMenu) {
	
		this.initHCMMenuButton();
		this.oHCMMenuButton.setMenu(oMenu);
	
		return this;
	
	};
	
	/**
	 * Handler for HCM menu button item selection
	 *
	 * @private
	 */
	FeedChunk.prototype.handleHCMMenuButtonSelected = function(oEvent){
	
		this.fireEvent("HCMMenuItemSelected", oEvent.mParameters);
	
	};

	return FeedChunk;

}, /* bExport= */ true);
