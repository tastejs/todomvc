var Montage = require('montage').Montage;
var Converter = require('montage/core/converter/converter').Converter;

exports.ItemCountConverter = Montage.create(Converter, {
	convert: {
		value: function (itemCount) {
			return itemCount === 1 ? 'item' : 'items';
		}
	}
});
