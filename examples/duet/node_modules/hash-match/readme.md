# hash-match

hash-match makes it easier to match window.location.hash with a router like [wayfarer](https://github.com/yoshuawuyts/wayfarer).

## install

```bash
npm i --save hash-match
```

## usage

```js
var match = require('hash-match');
match('#weeee');
// returns "/weeee"

match('#/weeee');
// returns "/weeee"
```

So it's only really interesting if you use it like this:

```js
match(window.location.hash);
// returns whatever the hash is
```

You can optionally set a prefix:

```js
match(window.location.hash, '/hmm')
```

and if the hash looks like `'#/hmm/whatever'` or `'#hmm/whatever'` then  you'll get `'/whatever'` in return.

## ok but why

For feeding the output of hash-match into a router like [wayfarer](https://github.com/yoshuawuyts/wayfarer).

Here's an example:

```js
var hashMatch = require('hash-match');
var router = require('wayfarer')({ default: '/' });

router.on('/', function () {
  console.log('root route')
})

router.on('/wat', function () {
  console.log('wat')
})

// Here's where hashMatch does its thing:
router.match(hashMatch(window.location.hash));
```

Now when you navigate to `example.com/#/wat` or `example.com/#wat` the `/wat` route will execute.

And if you want you can listen for the `hashchange` event to update the router:

```js
window.addEventListener('hashchange', function (e) {
  router.match(hashMatch(window.location.hash));
});
```
