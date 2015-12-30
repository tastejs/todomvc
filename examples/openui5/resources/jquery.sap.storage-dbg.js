/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

/*
 * Provides methods to store and retrieve data based on Web Storage API.
 */
sap.ui.define(['jquery.sap.global'],
	function(jQuery) {
	"use strict";

	/**
	 * Check whether the current environment supports JSON.parse and JSON stringify.
	 * @private
	 */
	var bSupportJSON = !!(window.JSON && JSON.parse && JSON.stringify);
	
	/**
	 * Prefix added to all storage keys (typically IDs) passed by the applications
	 * when they are calling state storage methods. The goal of such prefix is to
	 * leave space for saving data (with the same key) also scenarios other than
	 * state saving.
	 * @private
	 */
	var sStateStorageKeyPrefix = "state.key_";

	/**
	 * @interface A Storage API for JavaScript.
	 *
	 * Provides methods to store data on the client using Web Storage API support by the browser. The data
	 * received by this API must be already serialized, in string format. Similarly, the API returns the retrieved
	 * data in serialized string format, so it is the responsibility of the caller to de-serialize it, if applicable.
	 * 
	 * Attention: The Web Storage API stores the data on the client. Therefore do not use this API for confidential information. 
	 * 
	 * One can get access to the 'default' storage by using {@link jQuery.sap.storage} directly
	 * or alternatively via factory functionality available as <code>jQuery.sap.storage(jQuery.sap.storage.Type.session)</code>
	 * returning an object implementing this interface.
	 *
	 * A typical intended usage of this API is the storage of a string representing the state of a control.
	 * In such usage, the data is stored in the browser session, and
	 * the methods to be used are {@link #put} and {@link #get}.
	 * The method {@link #remove} can be used to delete the previously saved state.
	 *
	 * In sake of completeness, the method {@link #clear} is available.
	 * However, it should be called only in very particular situations,
	 * when a global erasing of data is required. If only keys with certain prefix
	 * should be deleted the method {@link #removeAll} should be used.
	 *
	 * @author SAP SE
	 * @version 1.32.9
	 * @since 0.11.0
	 * @public
	 * @name jQuery.sap.storage.Storage
	 */

	/** 
	 * 
	 * Constructor for an instance of jQuery.sap.storage.Storage
	 *
	 * @param {jQuery.sap.storage.Type | Storage} [pStorage=jQuery.sap.storage.Type.session] the type this storage should be of or an Object implementing the typical Storage API for direct usage.
	 * @param {string} [sStorageKeyPrefix='state.key_'] the prefix to use in this storage.
	 * 
	 * @private
	 */
	var fnStorage = function(pStorage, sStorageKeyPrefix){
		var sType = "unknown",
			sPrefix = sStorageKeyPrefix || sStateStorageKeyPrefix;
		sPrefix += "-";
		var sTestKey = sPrefix + "___sapui5TEST___",
			oStorage;
		

		if (!pStorage || typeof (pStorage) === "string") {
			sType = pStorage || "session";
			try {
				oStorage = window[sType + "Storage"];
			} catch (e) {
				oStorage = null;
			}
			try { // Test for QUOTA_EXCEEDED_ERR (Happens e.g. in mobile Safari when private browsing active)
				if (oStorage) {
					oStorage.setItem(sTestKey, "1");
					oStorage.removeItem(sTestKey);
				}
			} catch (e) {
				oStorage = null;
			}
		} else if (typeof (pStorage) === "object") {
			sType = pStorage.getType ? pStorage.getType() : "unknown";
			oStorage = pStorage;
		}
		var bStorageAvailable = !!oStorage;
		
		
		/**
		 * Returns whether the given storage is suppported.
		 *
		 * @return {boolean} true if storage is supported, false otherwise (e.g. due to browser security settings)
		 * @public
		 * @name jQuery.sap.storage.Storage#isSupported
		 * @function
		 */
		this.isSupported = function(){
			if (!bStorageAvailable) { //No storage available at all or not accessible
				return false;
			}
			if (typeof (oStorage.isSupported) == "function") { //Possibility to define for custom storage
				return oStorage.isSupported();
			}
			return true;
		};

		/**
		 * Stores the passed state string in the session, under the key
		 * sStorageKeyPrefix + sId.
		 * 
		 * sStorageKeyPrefix is the id prefix defined for the storage instance (@see jQuery.sap#storage)
		 *
		 * @param {string} sId Id for the state to store
		 * @param {string} sStateToStore content to store
		 * @return {boolean} true if the data were successfully stored, false otherwise
		 * @public
		 * @name jQuery.sap.storage.Storage#put
		 * @function
		 */
		this.put = function(sId, sStateToStore) {
			//precondition: non-empty sId and available storage feature
			jQuery.sap.assert(typeof sId === "string" && sId, "sId must be a non-empty string");
			jQuery.sap.assert(typeof sStateToStore === "string" || bSupportJSON, "sStateToStore must be string or JSON must be supported");
			if (this.isSupported() && sId) {
				try {
					oStorage.setItem(sPrefix + sId, bSupportJSON ? JSON.stringify(sStateToStore) : sStateToStore);
					return true;
				} catch (e) {
					return false;
				}
			} else {
				return false;
			}
		};

		/**
		 * Retrieves the state string stored in the session under the key
		 * sStorageKeyPrefix + sId.
		 * 
		 * sStorageKeyPrefix is the id prefix defined for the storage instance (@see jQuery.sap#storage)
		 *
		 * @param {string} sId Id for the state to retrieve
		 * @return {string} the string from the storage, if the retrieval
		 * was successful, and null otherwise
		 * @public
		 * @name jQuery.sap.storage.Storage#get
		 * @function
		 */
		this.get = function(sId) {
			//precondition: non-empty sId and available storage feature
			jQuery.sap.assert(typeof sId === "string" && sId, "sId must be a non-empty string");
			if (this.isSupported() && sId ) {
				try {
					var sItem = oStorage.getItem(sPrefix + sId);
					return bSupportJSON ? JSON.parse(sItem) : sItem;
				} catch (e) {
					return null;
				}
			} else {
				return null;
			}
		};

		/**
		 * Deletes the state string stored in the session under the key
		 * sStorageKeyPrefix + sId.s
		 * 
		 * sStorageKeyPrefix is the id prefix defined for the storage instance (@see jQuery.sap#storage)
		 *
		 * @param {string} sId Id for the state to delete
		 * @return {boolean} true if the deletion
		 * was successful or the data doesn't exist under the specified key,
		 * and false if the feature is unavailable or a problem occurred
		 * @public
		 * @name jQuery.sap.storage.Storage#remove
		 * @function
		 */
		this.remove = function(sId) {
			//precondition: non-empty sId and available storage feature
			jQuery.sap.assert(typeof sId === "string" && sId, "sId must be a non-empty string");
			if (this.isSupported() && sId) {
				try {
					oStorage.removeItem(sPrefix + sId);
					return true;
				} catch (e) {
					return false;
				}
			} else {
				return false;
			}
		};
		
		/**
		 * Deletes all state strings stored in the session under the key prefix 
		 * sStorageKeyPrefix + sIdPrefix.
		 * 
		 * sStorageKeyPrefix is the id prefix defined for the storage instance (@see jQuery.sap#storage)
		 * 
		 * @param {string} sIdPrefix Id prefix for the states to delete
		 * @return {boolean} true if the deletion
		 * was successful or the data doesn't exist under the specified key,
		 * and false if the feature is unavailable or a problem occurred
		 * @since 1.13.0
		 * @public
		 * @name jQuery.sap.storage.Storage#removeAll
		 * @function
		 */
		this.removeAll = function(sIdPrefix) {
			//precondition: available storage feature (in case of IE8 typeof native functions returns "object")
			if (this.isSupported() && oStorage.length && (document.addEventListener ? /function/ : /function|object/).test(typeof (oStorage.key))) {
				try {
					var len = oStorage.length;
					var aKeysToRemove = [];
					var key, i;
					var p = sPrefix + (sIdPrefix || "");
					for (i = 0; i < len; i++) {
						key = oStorage.key(i);
						if (key && key.indexOf(p) == 0) {
							aKeysToRemove.push(key);
						}
					}
					
					for (i = 0; i < aKeysToRemove.length; i++) {
						oStorage.removeItem(aKeysToRemove[i]);
					}
					
					return true;
				} catch (e) {
					return false;
				}
			} else {
				return false;
			}
		};

		/**
		 * Deletes all the entries saved in the session (Independent of the current Storage instance!).
		 * 
		 * CAUTION: This method should be called only in very particular situations,
		 * when a global erasing of data is required. Given that the method deletes
		 * the data saved under any ID, it should not be called when managing data
		 * for specific controls.
		 *
		 * @return {boolean} true if execution of removal
		 * was successful or the data to remove doesn't exist,
		 * and false if the feature is unavailable or a problem occurred
		 * @public
		 * @name jQuery.sap.storage.Storage#clear
		 * @function
		 */
		this.clear = function() {
			//precondition: available storage feature
			if (this.isSupported()) {
				try {
					oStorage.clear();
					return true;
				} catch (e) {
					return false;
				}
			} else {
				return false;
			}
		};

		/**
		 * Returns the type of the storage.
		 * @returns {jQuery.sap.storage.Type | string} the type of the storage or "unknown"
		 * @public
		 * @name jQuery.sap.storage.Storage#getType
		 * @function
		 */
		this.getType = function(){
			return sType;
		};
	};


	/**
	 * A map holding instances of different 'standard' storages.
	 * Used to limit number of created storage objects.
	 * @private
	 */
	var mStorages = {};

	/**
	 * Returns a {@link jQuery.sap.storage.Storage Storage} object for a given HTML5 storage (type) and,
	 * as a convenience, provides static functions to access the default (session) storage.
	 *  
	 * When called as a function, it returns an instance of {@link jQuery.sap.storage.Storage}, providing access 
	 * to the storage of the given {@link jQuery.sap.storage.Type} or to the given HTML5 Storage object.
	 * 
	 * The default session storage can be easily accessed with methods {@link jQuery.sap.storage.get}, 
	 * {@link jQuery.sap.storage.put}, {@link jQuery.sap.storage.remove}, {@link jQuery.sap.storage.clear},
	 * {@link jQuery.sap.storage.getType} and {@link jQuery.sap.storage.removeAll}
	 *
	 * @param {jQuery.sap.storage.Type | Storage} 
	 *     oStorage the type specifying the storage to use or an object implementing the browser's Storage API.
	 * @param {string} [sIdPrefix] Prefix used for the Ids. If not set a default prefix is used.    
	 * @returns {jQuery.sap.storage.Storage}
	 * 
	 * @version 1.32.9
	 * @since 0.11.0
	 * @namespace
	 * @type Function
	 * @public
	 * 
	 * @borrows jQuery.sap.storage.Storage#get as get
	 * @borrows jQuery.sap.storage.Storage#put as put
	 * @borrows jQuery.sap.storage.Storage#remove as remove
	 * @borrows jQuery.sap.storage.Storage#clear as clear
	 * @borrows jQuery.sap.storage.Storage#getType as getType
	 * @borrows jQuery.sap.storage.Storage#removeAll as removeAll
	 * @borrows jQuery.sap.storage.Storage#isSupported as isSupported
	 */
	jQuery.sap.storage = function(oStorage, sIdPrefix){
		// if nothing or the default was passed in, simply return ourself
		if (!oStorage) {
			oStorage = jQuery.sap.storage.Type.session;
		}

		if (typeof (oStorage) === "string" && jQuery.sap.storage.Type[oStorage]) {
			var sKey = oStorage;
			if (sIdPrefix && sIdPrefix != sStateStorageKeyPrefix) {
				sKey = oStorage + "_" + sIdPrefix;
			}
			
			return mStorages[sKey] || (mStorages[sKey] = new fnStorage(oStorage, sIdPrefix));
		}

		// OK, tough but probably good for issue identification. As something was passed in, let's at least ensure our used API is fulfilled.
		jQuery.sap.assert(oStorage instanceof Object && oStorage.clear && oStorage.setItem && oStorage.getItem && oStorage.removeItem, "storage: duck typing the storage");
		return new fnStorage(oStorage, sIdPrefix);
	};

	/**
	 * Enumeration of the storage types supported by {@link jQuery.sap.storage.Storage}
	 * @class
	 * @static
	 * @public
	 * @version 1.32.9
	 * @since 0.11.0
	 */
	jQuery.sap.storage.Type = {
			/**
			 * Indicates usage of the browser's localStorage feature
			 * @public
			 */
			local: "local",
			/**
			 * Indicates usage of the browser's sessionStorage feature
			 * @public
			 */
			session: "session",
			/**
			 * Indicates usage of the browser's globalStorage feature
			 * @public
			 */
			global: "global"
	};

	// ensure the storage constructor applied to our storage object
	fnStorage.apply(jQuery.sap.storage);
	mStorages[jQuery.sap.storage.Type.session] = jQuery.sap.storage;
	
	return jQuery;
	
});
