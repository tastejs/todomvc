var DiskConnector = {


	/* ---++---     ---++---     ---++---     ---++---     ---++---
	 *	 R E Q U E S T S
	 */
	saveStringWithKey : function(stringObject, key) {
		localStorage.setItem(key, stringObject);
	},

	saveJsonObjectWithKey : function(jsonObject, key) {
		localStorage.setItem(key, JSON.stringify(jsonObject));
	},

	removeKey : function(key) {
		localStorage.removeItem(key);
	},

	loadStringWithKey : function(key) {
		return localStorage.getItem(key);
	},

	loadJsonObjectWithKey : function(key) {
		var objString               = localStorage.getItem(key);
		// NOT ON DISK
		if (MMU.isNoE(objString)) {
			return null;
		}
		try {
			var result                  = JSON.parse(objString);
			return result;
		}

		catch (ex) {
		}

		return null;
	}
};











