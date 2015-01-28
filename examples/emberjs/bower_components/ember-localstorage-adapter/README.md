Ember Data Local Storage Adapter
================================

[![Build
Status](https://travis-ci.org/kurko/ember-localstorage-adapter.svg?branch=master)](https://travis-ci.org/kurko/ember-localstorage-adapter)

Store your ember application data in localStorage.

Compatible with Ember Data 1.0.beta.14.1.

**NOTE**: New versions of the `localStorage` adapter are no longer compatible
with older versions of Ember Data. For older versions, checkout the `pre-beta`
branch.

Usage
-----

Include `localstorage_adapter.js` in your app and then like all adapters:

```js
App.ApplicationSerializer = DS.LSSerializer.extend();
App.ApplicationAdapter = DS.LSAdapter.extend({
    namespace: 'yournamespace'
});
```

If you are using Ember Localstorage Adapter within an Ember CLI project you can install it as an addon with the following command:

```sh
npm install --save-dev ember-localstorage-adapter
```

Then in Brocfile.js import it before module.exports:

```js
app.import('bower_components/ember-localstorage-adapter/localstorage_adapter.js');

module.exports = app.toTree();
```

### Local Storage Namespace

All of your application data lives on a single `localStorage` key, it defaults to `DS.LSAdapter` but if you supply a `namespace` option it will store it there:

```js
DS.LSAdapter.create({
  namespace: 'my app'
});
```

### Models

Whenever the adapter returns a record, it'll also return all
relationships, so __do not__ use `{async: true}` in you model definitions.

#### Namespace

If your model definition has a `url` property, the adapter will store the data on that namespace. URL is a weird term in this context, but it makes swapping out adapters simpler by not requiring additional properties on your models.

```js
var List = DS.Model.extend({
  // ...
});
List.reopen({
  url: '/some/url'
});
```

### Quota Exceeded Handler

Browser's `localStorage` has limited space, if you try to commit application data and the browser is out of space, then the adapter will trigger the `QUOTA_EXCEEDED_ERR` event.

```js
App.store.adapter.on('QUOTA_EXCEEDED_ERR', function(records){
  // do stuff
});

App.store.commit();
```

Todo
----

- Make the repo nicer to work with long-term (do something more intelligent with dependencies found in `vendor`, etc.)

Tests
-----

If you don't have bower, install it with

    npm install bower -g

Then install the dependencies with

    bower install

Open `test/index.html` in a browser. If you have `phantomjs` installed,
run

    phantomjs test/runner.js test/index.html

License & Copyright
-------------------

Copyright (c) 2012 Ryan Florence
MIT Style license. http://opensource.org/licenses/MIT
