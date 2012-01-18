// tokens.js
// 2009-05-17

// (c) 2006 Douglas Crockford

// Produce an array of simple token objects from a string.
// A simple token object contains these members:
//      type: 'name', 'string', 'number', 'operator'
//      value: string or number value of the token
//      from: index of first character of the token
//      to: index of the last character + 1

// Comments of the // type are ignored.

// Operators are by default single characters. Multicharacter
// operators can be made by supplying a string of prefix and
// suffix characters.
// characters. For example,
//      '<>+-&', '=>&:'
// will match any of these:
//      <=  >>  >>>  <>  >=  +: -: &: &&: &&



String.prototype.tokens = function (prefix, suffix) {
    var c;                      // The current character.
    var from;                   // The index of the start of the token.
    var i = 0;                  // The index of the current character.
    var length = this.length;
    var n;                      // The number value.
    var q;                      // The quote character.
    var str;                    // The string value.

    var result = [];            // An array to hold the results.
	var prereg = true;
    var make = function (type, value) {

// Make a token object.
		
		//prereg = i &&
        //            (('(,=:[!&|?{};'.indexOf(i.charAt(i.length - 1)) >= 0) ||
         //           i === 'return')
		//print(type+":"+value+"-")
        prereg = (type == 'operator' || type === 'name') &&
				 (value === 'return' ||   ('(,=:[!&|?{};'.indexOf(value.charAt(value.length - 1)) >= 0 ) )
		//print(type+" : "+value+" - "+prereg)
		return {
            type: type,
            value: value,
            from: from,
            to: i
        };
		
    };
	var has = function(thIs, before){
		var j = i+1;
        for (;;) {
            c = this.charAt(j);
            if(c === thIs){
				return true;
			}
			//print("|"+c+"|"+(c=="\n" || c=="\r"));
			if (before.test(c) || c === '') {
                return false;
            }
            j += 1;
        }
	}
	
// Begin tokenization. If the source string is empty, return nothing.

    if (!this) {
        return;
    }

// If prefix and suffix strings are not provided, supply defaults.

    if (typeof prefix !== 'string') {
        prefix = '<>+-&';
    }
    if (typeof suffix !== 'string') {
        suffix = '=>&:';
    }


// Loop through this text, one character at a time.

    c = this.charAt(i);
    while (c) {
        from = i;
		//print(c);
// Ignore whitespace.

        if (c <= ' ') {
            i += 1;
            c = this.charAt(i);

// name.

        } else if (c >= 'a' && c <= 'z' || c >= 'A' && c <= 'Z') {
            str = c;
            i += 1;
            for (;;) {
                c = this.charAt(i);
                if ((c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') ||
                        (c >= '0' && c <= '9') || c === '_') {
                    str += c;
                    i += 1;
                } else {
                    break;
                }
            }
			//print(str);
            result.push(make('name', str));

// number.

// A number cannot start with a decimal point. It must start with a digit,
// possibly '0'.

        } else if (c >= '0' && c <= '9') {
            str = c;
            i += 1;

// Look for more digits.

            for (;;) {
                c = this.charAt(i);
                if (c < '0' || c > '9') {
                    break;
                }
                i += 1;
                str += c;
            }

// Look for a decimal fraction part.

            if (c === '.') {
                i += 1;
                str += c;
                for (;;) {
                    c = this.charAt(i);
                    if (c < '0' || c > '9') {
                        break;
                    }
                    i += 1;
                    str += c;
                }
            }

// Look for an exponent part.

            if (c === 'e' || c === 'E') {
                i += 1;
                str += c;
                c = this.charAt(i);
                if (c === '-' || c === '+') {
                    i += 1;
                    str += c;
                    c = this.charAt(i);
                }
                if (c < '0' || c > '9') {
                    make('number', str).error("Bad exponent");
                }
                do {
                    i += 1;
                    str += c;
                    c = this.charAt(i);
                } while (c >= '0' && c <= '9');
            }

// Make sure the next character is not a letter.

            if (c >= 'a' && c <= 'z') {
                str += c;
                i += 1;
				print(this.substr(i-20,20))
				print(this.substr(i,20))				
                make('number', str).error("Bad number");
            }

// Convert the string value to a number. If it is finite, then it is a good
// token.

            n = +str;
            if (isFinite(n)) {
                result.push(make('number', n));
            } else {
                make('number', str).error("Bad number");
            }

// string

        } else if (c === '\'' || c === '"') {
            str = '';
            q = c;
            i += 1;
            //print("----")
			for (;;) {
                c = this.charAt(i);
				//print(this[i])
                if (c < ' ') {
					print(this.substr(i-20,20))
					print(this.substr(i,20))
                    make('string', str).error(c === '\n' || c === '\r' || c === '' ?
                        "Unterminated string." :
                        "Control character in string.", make('', str));
                }

// Look for the closing quote.

                if (c === q) {
                    break;
                }

// Look for escapement.

                if (c === '\\') {
                    i += 1;
                    if (i >= length) {
                        make('string', str).error("Unterminated string");
                    }
                    c = this.charAt(i);
                    switch (c) {
                    case 'b':
                        c = '\b';
                        break;
                    case 'f':
                        c = '\f';
                        break;
                    case 'n':
                        c = '\n';
                        break;
                    case 'r':
                        c = '\r';
                        break;
                    case 't':
                        c = '\t';
                        break;
                    case 'u':
                        if (i >= length) {
                            make('string', str).error("Unterminated string");
                        }
                        c = parseInt(this.substr(i + 1, 4), 16);
                        if (!isFinite(c) || c < 0) {
                            make('string', str).error("Unterminated string");
                        }
                        c = String.fromCharCode(c);
                        i += 4;
                        break;
                    }
                }
                str += c;
                i += 1;
            }
            i += 1;
			//print("str = "+str)
            result.push(make('string', str));
            c = this.charAt(i);

		
// comment.
		
        } else if (c === '/' && this.charAt(i + 1) === '*') {
            var str = c;
			i += 1;
            for (;;) {
                c = this.charAt(i);
				str += c;
                if (c === '*' && this.charAt(i+1) == "/") {
					i += 1;
					i += 1;
					str+= "/";
					result.push(make('comment', str));
                    break;
                }
                i += 1;
            }
		}  else if (c === '/' && this.charAt(i + 1) === '/') {
            i += 1;
            for (;;) {
                c = this.charAt(i);
                if (c === '\n' || c === '\r' || c === '') {
                    break;
                }
                i += 1;
            }
// regexp
		} else if (c === '/' && has.call(this, "/", /[\n\r]/) && prereg) { // what about /2
            //print('matcing regexp')
			i += 1;
			var str = c;
            for (;;) {
                c = this.charAt(i);
                if(c === "\\"){ //skip over \
					str += c;
                	i += 1;
					//print("adding "+c)
					c = this.charAt(i);
					
					str += c;
					//print("adding "+c)
                	i += 1;
					c = this.charAt(i);
					continue;
				}
				
				if (c === '/' ) {
					str += c;
					i += 1;
					c = this.charAt(i);
					while(/\w/.test(c)){ //get stuff after /a/m
						str += c;
						i += 1;
						c = this.charAt(i);
					}
					result.push(make('regexp', str));
					//print("regexp = "+str)
                    break;
                }
				str += c;
                i += 1;
            }
// combining
        } else if (prefix.indexOf(c) >= 0) {
            str = c;
            i += 1;
            while (i < length) {
                c = this.charAt(i);
                if (suffix.indexOf(c) < 0) {
                    break;
                }
                str += c;
                i += 1;
            }
            result.push(make('operator', str));

// single-character operator

        } else {
            i += 1;
            result.push(make('operator', c));
            c = this.charAt(i);
        }
    }
    return result;
};
