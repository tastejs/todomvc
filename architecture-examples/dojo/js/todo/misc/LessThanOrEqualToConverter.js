define({
	// summary:
	//		A dojox/mvc data converter, that does one-way conversion that returns whether we have less than n todo items in a specific state, where n is the given number in data converter options.
	//		Data converter options can be specified by setting constraints property in one of data binding endpoints.
	//		See data converter section of dojox/mvc/sync library's documentation for more details.

	format: function(/*Number*/ value, /*Object*/ constraints){
		// summary:
		//		Returns whether given value is less than or equal to the given number in data converter options (default zero).

		return value <= (constraints.lessThanOrEqualTo || 0);
	},

	parse: function(/*Boolean*/ value){
		// summary:
		//		This functions throws an error so that the new value won't be reflected.

		throw new Error();
	}
});
