function AppViewController(delegateRef, inViewId) {
	var my 					= this;
	var delegate 			= delegateRef || null;
	var rootViewId			= inViewId;

	var itemCollection		= new ItemCollection(my);

	/* ---++---     ---++---     ---++---     ---++---     ---++---
	 *	 P R O T O C O L
	 *	 (implement these)
	 */
	var delegateCallbacks 	= {

	};


	/* ---++---     ---++---     ---++---     ---++---     ---++---
	 *	 I N I T I A L I Z E
	 */
	var initialize 			= function () {

		internals.attachUserActionHandlers();

		internals.loadData();

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

		TOGGLE_ALL_ID		: 'toggle-all',
		ITEM_LIST_ID		: 'todo-list',
		FOOTER_ID			: 'footer',
		CLEAR_COMPLETED_ID	: 'clear-completed',
		NEW_TODO_FIELD_ID	: 'new-todo',
		TOTAL_COUNT_ID		: 'todo-count'

	};

	var constants 	= {
		ENTER_KEY			: 13,
		SAVED_DATA_ID		: 'todos-SOOJS'
	};

	var classes 	= {

	};

	var objects 	= {

		getRootViewObject 			: function () {
			return $('#' + rootViewId);
		},

		getToggleAllButton			: function () {
			return $('#' + viewIds.TOGGLE_ALL_ID);
		},

		getClearCompletedButton		: function () {
			return $('#' + viewIds.CLEAR_COMPLETED_ID);
		},

		getNewTodoField				: function () {
			return $('#' + viewIds.NEW_TODO_FIELD_ID);
		},

		getItemList					: function () {
			return $('#' + viewIds.ITEM_LIST_ID);
		},

		getFooter					: function () {
			return $('#' + viewIds.FOOTER_ID);
		},

		getTotalCount				: function () {
			return $('#' + viewIds.TOTAL_COUNT_ID);
		}

	};


	/* ---++---     ---++---     ---++---     ---++---     ---++---
	 *	 R E Q U E S T S
	 */
	var requests = {

	};


	/* ---++---     ---++---     ---++---     ---++---     ---++---
	 *	 U S E R
	 *   A C T I O N S
	 */
	var userActions = {

		toggleAllPressed 			: function () {
			logIf(options.debug, 'Toggle All was pressed');
		},

		clearCompletedPressed 		: function () {
			logIf(options.debug, 'Clear completed was pressed');
			itemCollection.requests.removeCompletedItems();
			drawers.redraw();
		},

		newTodoFieldKeyPressed 		: function (event) {

			var keyCode			= event.keyCode;

			// ENTER PRESSED
			if (keyCode === constants.ENTER_KEY ) {

				var title 		= objects.getNewTodoField().val();

				// HAS A TITLE
				if ( ! MMU.isNoE(title) ) {
					logIf(options.debug, 'New item created');
					internals.addNewTodo(title);
					drawers.redraw();

					objects.getNewTodoField().val('');
				}

				else {
					logIf(options.debug, 'You must enter a title to create an item');
				}
			}
		}

	};


	/* ---++---     ---++---     ---++---     ---++---     ---++---
	 *	 D R A W E R S
	 */
	var drawers = {

		redraw						: function () {

			drawers.redrawList();
			drawers.redrawFooter();
		},

		redrawList					: function () {
			// CLEAR LIST
			var itemList			= objects.getItemList();
			itemList.empty();

			var collection			= itemCollection.requests.getCollection();
			for ( var i = 0; i < collection.length; i++ ) {
				var item 			= collection[i];

				var itemView		= new ItemViewController(my.callbackHandlers, item);
				itemList.append(itemView.requests.getViewObject());
			}

		},

		redrawFooter				: function () {
			var footer				= objects.getFooter();

			// HIDE FOOTER (no data)
			if ( itemCollection.requests.getTotal() < 1 ) {
			    footer.hide();
			}

			// SHOW FOOTER (when there is data)
			else {
				footer.show();

				drawers.redrawActiveItemsRemaining();
				drawers.redrawClearCompletedButton();
			}

		},

		redrawActiveItemsRemaining			: function () {
			var totalCount			= objects.getTotalCount();
			var count				= itemCollection.requests.getTotalActive();

			if ( count < 1 ) {
				totalCount.html('');
			}

			else if ( count === 1 ) {
				totalCount.html('<strong>1</strong> item left');
			}

			else {
				totalCount.html('<strong>' + count + '</strong> items left');
			}

		},

		redrawClearCompletedButton			: function () {
			var button				= objects.getClearCompletedButton();
			var count				= itemCollection.requests.getTotalCompleted();

			if ( count < 1 ) {
				button.hide();
			}

			else {
				button.show();
			}

			button.html('Clear completed ('+count+')');

		}

	};


	/* ---++---     ---++---     ---++---     ---++---     ---++---
	 *		I N T E R N A L
	 *		F U N C T I O N S
	 */
	var internals = {

		attachUserActionHandlers 	: function () {
			objects.getToggleAllButton().bind('click', userActions.toggleAllPressed);
			objects.getClearCompletedButton().bind('click', userActions.clearCompletedPressed);
			objects.getNewTodoField().bind('keypress', userActions.newTodoFieldKeyPressed);
		},

		loadData	 				: function () {
			itemCollection.requests.loadFromDisk();

			logIf(options.debug, 'data loaded from disk:', itemCollection.requests.getCollection());
		},

		addNewTodo					: function (title) {
			// CREATE ITEM FROM IT
			var item				= new ItemVO(title, (new Date()).getTime(), false);
			itemCollection.requests.addItem(item);

			logIf(options.debug, 'Added item:', item);
		}

	};


	/* ---++---     ---++---     ---++---     ---++---     ---++---
	 *	 C A L L B A C K
	 *	 H A N D L E R S
	 */
	var callbackHandlers = {
		itemViewUpdated				: function (viewController) {
			itemCollection.requests.saveToDisk();
			drawers.redraw();
		},

		itemViewRemoved 			: function (viewController) {
			itemCollection.requests.removeItem(viewController.requests.getItem());
			drawers.redraw();
		}
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