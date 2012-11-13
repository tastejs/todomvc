define({
	// summary:
	//		A dojox/mvc data converter, that runs between todo/ctrl/HashController and a widget having <a> tag as its DOM node.
	//		It does one-way conversion from URL hash to boolean state of whether the URL hash matches href attribute of the widget's DOM node.

	format: function(/*String*/ value){
		// summary:
		//		Returns whether given value matches href attribute of the widget's DOM node.

		return this.target.domNode.getAttribute("href").substr(1) == (value || "/");
	},

	parse: function(/*Boolean*/ value){
		// summary:
		//		This functions throws an error so that the new value won't be reflected.

		throw new Error();
	}
});
