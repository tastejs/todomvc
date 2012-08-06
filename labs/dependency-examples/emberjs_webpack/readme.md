# Ember.js + webpack • [TodoMVC](http://todomvc.com)


## Create the bundle with [grunt.js](http://gruntjs.com)

You need to have `node.js` and `grunt` installed.
See [grunt.js](http://gruntjs.com). `npm install grunt -g`

First install the devDepenencies with:

```
cd dependency-examples/emberjs_webpack
npm install
```

Then run grunt with `grunt` (windows: `grunt.cmd`).

For debugging run `grunt debug` (windows: `grunt.cmd debug`). This includes debugging infos and do not minimize.





## Running tests

To fire specs runner, append `#specs` to the url in address bar, and reload the webpage.


## Credit

Initial release by @tomdale.

Refactoring and maintenance by @stas.

Converting to CommonJs and webpack template by @sokra.