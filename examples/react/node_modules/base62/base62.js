module.exports = (function (Base62) {
    var DEFAULT_CHARACTER_SET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

    Base62.encode = function(integer){
        if (integer === 0) {return '0';}
        var s = '';
        while (integer > 0) {
            s = Base62.characterSet[integer % 62] + s;
            integer = Math.floor(integer/62);
        }
        return s;
    };

    Base62.decode = function(base62String){
        var val = 0, base62Chars = base62String.split("").reverse();
        base62Chars.forEach(function(character, index){
            val += Base62.characterSet.indexOf(character) * Math.pow(62, index);
        });
        return val;
    };

    Base62.setCharacterSet = function(chars) {
        var arrayOfChars = chars.split(""), uniqueCharacters = [];

        if(arrayOfChars.length != 62) throw Error("You must supply 62 characters");

        arrayOfChars.forEach(function(char){
            if(!~uniqueCharacters.indexOf(char)) uniqueCharacters.push(char);
        });

        if(uniqueCharacters.length != 62) throw Error("You must use unique characters.");

        Base62.characterSet = arrayOfChars;
    };

    Base62.setCharacterSet(DEFAULT_CHARACTER_SET);
    return Base62;
}({}));
