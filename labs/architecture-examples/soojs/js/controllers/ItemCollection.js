function ItemCollection(delegateRef) {
	var my 				= this;
	var delegate 		= delegateRef || null;
	var collection		= [];

	/* ---++---     ---++---     ---++---     ---++---     ---++---
	 *	 P R O T O C O L
	 *	 (implement these)
	 */
	var delegateCallbacks 	= {

		aControllerCallback1 			: function () {
			if(delegate && delegate.aControllerCallback1) {
				delegate.aControllerCallback1();
			}
		}

	};


	/* ---++---     ---++---     ---++---     ---++---     ---++---
	 *	 I N I T I A L I Z E
	 */
	var initialize 			= function () {

	};



	/* ---++---     ---++---     ---++---     ---++---     ---++---
	 *	 O P T I O N S
	 */
	var options 	= {

		debug				: false

	};

	var constants 	= {
		SAVED_DATA_ID		: 'todos-SOOJS'
	};


	/* ---++---     ---++---     ---++---     ---++---     ---++---
	 *	 R E Q U E S T S
	 */
	var requests = {

		getCollection		: function () {
			return collection;
		},

		clearCollection		: function () {
			// CLEAR COLLECTION
			collection.length		= 0;

			// SAVE
			requests.saveToDisk();
		},

		removeCompletedItems		: function () {
			for ( var i = 0; i < collection.length; i++ ) {
				var tItem = collection[i];
				if ( tItem.isCompleted ) {
					collection.splice(i, 1);
					i--;
				}
			}

			// SAVE
			requests.saveToDisk();
		},

		addItem				: function (item) {
			collection.push(item);
			requests.saveToDisk();
		},

		removeItem				: function (item) {
			for ( var i = 0; i < collection.length; i++ ) {
				var tItem = collection[i];
				if ( item === tItem ) {
				   collection.splice(i, 1);
				}
			}
			requests.saveToDisk();
		},

		getTotal			: function () {
			return collection.length;
		},

		getTotalActive	: function () {
			var count		= 0;
			for ( var i = 0; i < collection.length; i++ ) {
				var item = collection[i];
				if ( ! item.isCompleted ) {
					count++;
				}
			}
			return count;
		},

		getTotalCompleted	: function () {
			var count		= 0;
			for ( var i = 0; i < collection.length; i++ ) {
				var item = collection[i];
				if ( item.isCompleted ) {
					count++;
				}
			}
			return count;
		},

		loadFromDisk		: function () {
			var diskData	= DiskConnector.loadJsonObjectWithKey(constants.SAVED_DATA_ID);
			internals.populateFromJSON(diskData);
		},

		saveToDisk			: function () {
			// SAVE
			if (collection.length > 0) {
				DiskConnector.saveJsonObjectWithKey(collection, constants.SAVED_DATA_ID);
			}

			// REMOVE
			else {
				DiskConnector.removeKey(constants.SAVED_DATA_ID);
			}
		}

	};


	/* ---++---     ---++---     ---++---     ---++---     ---++---
	 *		I N T E R N A L
	 *		F U N C T I O N S
	 */
	var internals = {
		populateFromJSON		: function (jsonObject) {

			// CLEAR COLLECTION
			collection.length		= 0;

			// WE HAVE SOME DATA
			if ( jsonObject != null && jsonObject.length > 0 ) {

				// WALK EACH ITEM
				for ( var i = 0; i < jsonObject.length; i++ ) {
					var itemJSON 	= jsonObject[i];
					var item		= new ItemVO(itemJSON.title, itemJSON.id, itemJSON.isCompleted);
					collection.push(item);
				}
			}
		}
	};


	/* ---++---     ---++---     ---++---     ---++---     ---++---
	 *	 C A L L B A C K
	 *	 H A N D L E R S
	 */
	var callbackHandlers = {

		objectIAmDelegateOfCallback 		: function () {
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