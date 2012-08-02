var Montage = require("montage").Montage,
    Converter = require("montage/core/converter/converter").Converter;

exports.ItemCountConverter = Montage.create(Converter, {

    convert: {
        value: function(itemCount) {
            return (1 === itemCount) ? "item" : "items";
        }
    }

});
