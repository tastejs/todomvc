# grapheme-breaker
A JavaScript implementation of the Unicode grapheme cluster breaking algorithm ([UAX #29](http://www.unicode.org/reports/tr29/#Grapheme_Cluster_Boundaries))

> It is important to recognize that what the user thinks of as a “character”—a basic unit of a writing system for a 
> language—may not be just a single Unicode code point. Instead, that basic unit may be made up of multiple Unicode 
> code points. To avoid ambiguity with the computer use of the term character, this is called a user-perceived character. 
> For example, “G” + acute-accent is a user-perceived character: users think of it as a single character, yet is actually 
> represented by two Unicode code points. These user-perceived characters are approximated by what is called a grapheme cluster, 
> which can be determined programmatically.

## Installation

You can install via npm

    npm install grapheme-breaker

## Example

```javascript
var GraphemeBreaker = require('grapheme-breaker');

// break a string into an array of grapheme clusters


GraphemeBreaker.break('Z͑ͫ̓ͪ̂ͫ̽͏̴̙̤̞͉͚̯̞̠͍A̴̵̜̰͔ͫ͗͢L̠ͨͧͩ͘G̴̻͈͍͔̹̑͗̎̅͛́Ǫ̵̹̻̝̳͂̌̌͘!͖̬̰̙̗̿̋ͥͥ̂ͣ̐́́͜͞') // => ['Z͑ͫ̓ͪ̂ͫ̽͏̴̙̤̞͉͚̯̞̠͍', 'A̴̵̜̰͔ͫ͗͢', 'L̠ͨͧͩ͘', 'G̴̻͈͍͔̹̑͗̎̅͛́', 'Ǫ̵̹̻̝̳͂̌̌͘', '!͖̬̰̙̗̿̋ͥͥ̂ͣ̐́́͜͞']


// or just count the number of grapheme clusters in a string


GraphemeBreaker.countBreaks('Z͑ͫ̓ͪ̂ͫ̽͏̴̙̤̞͉͚̯̞̠͍A̴̵̜̰͔ͫ͗͢L̠ͨͧͩ͘G̴̻͈͍͔̹̑͗̎̅͛́Ǫ̵̹̻̝̳͂̌̌͘!͖̬̰̙̗̿̋ͥͥ̂ͣ̐́́͜͞') // => 6


// use nextBreak and previousBreak to get break points starting 
// from anywhere in the string
GraphemeBreaker.nextBreak('😜🇺🇸👍', 3) // => 6
GraphemeBreaker.previousBreak('😜🇺🇸👍', 3) // => 2
```

## Development Notes

In order to use the library, you shouldn't need to know this, but if you're interested in
contributing or fixing bugs, these things might be of interest.

* The `src/classes.coffee` file is automatically generated from `GraphemeBreakProperty.txt` in the Unicode 
  database by `src/generate_data.coffee`. It should be rare that you need to run this, but
  you may if, for instance, you want to change the Unicode version.
  
* You can run the tests using `npm test`. They are written using `mocha`, and generated from
  `GraphemeBreakTest.txt` from the Unicode database, which is included in the repository for performance
  reasons while running them.

## License

MIT
