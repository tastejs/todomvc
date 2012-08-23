(function() {

	if (typeof Spine === "undefined" || Spine === null) Spine = require('spine');

	var NS = 'spine';

	Spine.Model.Local = {
		extended: function() {
			this.change(this.saveLocal);
			return this.fetch(this.loadLocal);
		},
		saveLocal: function() {
			var result;
			result = JSON.stringify(this);
			return localStorage[NS + '-' + this.className] = result;
		},
		loadLocal: function() {
			var result;
			result = localStorage[NS + '-' + this.className];
			return this.refresh(result || [], {
				clear: true
			});
		}
	};

	if (typeof module !== "undefined" && module !== null) {
		module.exports = Spine.Model.Local;
	}

}).call(this);
