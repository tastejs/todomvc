function ItemViewController(delegateRef, inItem) {
	var my 				= this;
	var delegate 		= delegateRef || null;

	var item			= inItem;
	var viewObject		= null;

	/* ---++---     ---++---     ---++---     ---++---     ---++---
	 *	 P R O T O C O L
	 *	 (implement these)
	 */
	var delegateCallbacks 	= {

		itemViewUpdated 			: function (viewController) {
			if (delegate && delegate.itemViewUpdated) {
				delegate.itemViewUpdated(viewController);
			}
		},

		itemViewRemoved 			: function (viewController) {
			if (delegate && delegate.itemViewRemoved) {
				delegate.itemViewRemoved(viewController);
			}
		}

	};


	/* ---++---     ---++---     ---++---     ---++---     ---++---
	 *	 I N I T I A L I Z E
	 */
	var initialize 			= function () {
		internals.createViewObject();
		internals.attachUserActionHandlers();
		drawers.redraw();
	};



	/* ---++---     ---++---     ---++---     ---++---     ---++---
	 *	 V I E W
	 *	 W O R K E R S
	 */
	var options 	= {

		debug				: false

	};

	var viewIds 	= {

	};

	var classes 	= {

	};

	var objects 	= {

		getListItem				: function () {
			return viewObject;
		},

		getCompletedCheckbox	: function () {
			return viewObject.find('input').first();
		},

		getRemoveButton			: function () {
			return viewObject.find('button').first();
		},

		getTitle				: function () {
			return viewObject.find('label').first();
		},

		getEditField			: function () {
			return viewObject.find('.edit');
		}

	};

	var constants 	= {
		ENTER_KEY			: 13
	};

	/* ---++---     ---++---     ---++---     ---++---     ---++---
	 *	 R E Q U E S T S
	 */
	var requests = {

		getViewObject				: function () {
			return viewObject;
		},

		getItem						: function () {
			return item;
		}

	};


	/* ---++---     ---++---     ---++---     ---++---     ---++---
	 *	 U S E R
	 *   A C T I O N S
	 */
	var userActions = {
		enterEditMode				: function () {
			logIf(options.debug, 'enter edit mode', item.title);
			objects.getEditField().val(item.title);
			objects.getListItem().addClass('editing');
			objects.getEditField().focus();
		},

		editKeyPressed				: function (event) {
			logIf(options.debug, 'key pressed', item.title);
			var keyCode			= event.keyCode;
			// ENTER PRESSED
			if (keyCode === constants.ENTER_KEY ) {
				internals.exitEditModeAndApplyChanges();
			}
		},

		checkboxPressed				: function () {
			logIf(options.debug, 'checkbox pressed', item.title);
			item.isCompleted		= ! item.isCompleted;
			drawers.redraw();
			delegateCallbacks.itemViewUpdated(my);
		},

		removePressed				: function () {
			logIf(options.debug, 'remove pressed', item.title);
			internals.removeItem();
		},

		editFieldLostFocus				: function () {
			logIf(options.debug, 'editFieldLostFocus', item.title);
			internals.exitEditModeAndApplyChanges();
		}

	};


	/* ---++---     ---++---     ---++---     ---++---     ---++---
	 *	 D R A W E R S
	 */
	var drawers = {

		redraw						: function () {
			objects.getTitle().html(item.title);

			// COMPLETED
			if ( item.isCompleted ) {
				objects.getListItem().addClass('completed');
				objects.getCompletedCheckbox().prop('checked', true);
			}

			// ACTIVE
			else {
				objects.getListItem().removeClass('completed');
				objects.getCompletedCheckbox().prop('checked', false);
			}
		}

	};


	/* ---++---     ---++---     ---++---     ---++---     ---++---
	 *		I N T E R N A L
	 *		F U N C T I O N S
	 */
	var internals = {

		attachUserActionHandlers 	: function () {
			viewObject.bind("dblclick", userActions.enterEditMode);
			objects.getCompletedCheckbox().bind("click", userActions.checkboxPressed);
			objects.getRemoveButton().bind("click", userActions.removePressed);

			objects.getEditField().bind('keypress', userActions.editKeyPressed);
			objects.getEditField().bind('blur', userActions.editFieldLostFocus);
		},

		createViewObject			: function () {
			viewObject			= $('<li>' +
										'<div class="view">' +
											'<input class="toggle" type="checkbox">' +
											'<label>' + item.title + '</label>' +
											'<button class="destroy"></button>' +
										'</div>' +
										'<input class="edit" value="' + item.title + '">' +
									'</li>');
			viewObject.attr('id', item.id);
		},

		exitEditModeAndApplyChanges	: function () {
			item.title			= objects.getEditField().val().trim();

			objects.getListItem().removeClass('editing');

			// HAS A TITLE -- save
			if ( ! MMU.isNoE(item.title) ) {
				delegateCallbacks.itemViewUpdated(my);
			}

			// NO TITLE -- remove
			else {
				internals.removeItem();
			}

		},

		removeItem				: function () {
			delegateCallbacks.itemViewRemoved(my);
		}

	};


	/* ---++---     ---++---     ---++---     ---++---     ---++---
	 *	 C A L L B A C K
	 *	 H A N D L E R S
	 */
	var callbackHandlers = {

	};


	/* ---++---     ---++---     ---++---     ---++---     ---++---
	 *	 D E F I N E
	 *	 P U B L I C
	 */
	my.requests 			= requests || null;
	my.options 				= options || null;
	my.callbackHandlers 	= callbackHandlers || null;
	my.delegateCallbacks 	= delegateCallbacks || null;


	// ---++---     ---++---     ---++---     ---++---     ---++---
	// * RUN UPON SETUP
	initialize();



}