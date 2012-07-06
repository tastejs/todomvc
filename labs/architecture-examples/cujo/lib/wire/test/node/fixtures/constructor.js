function Constructor(val) {
	this.value = val;
}

Constructor.prototype = {
	setValue: function(value) {
		this.value = value;
	}
};

module.exports = Constructor;