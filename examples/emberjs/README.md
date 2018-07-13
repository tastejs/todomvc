# Ember.js TodoMVC Example using Ember CLI v3.2

> A framework for creating ambitious web applications.

> _[Ember.js - emberjs.com](http://emberjs.com)_
> _[Ember CLI - ember-cli.com](http://ember-cli.com)_

## Note for people updating this app.

The `index.html` and the `assets` folder in the parent folder as simlinks into the items with the same names inside `dist`. The `dist` folder has to be checked in git and built for production.

You can develop this project as a standard Ember CLI application:

```bash
$ cd todomvc
$ npm install
$ ember server
```

Update to the latest Ember with `ember-cli-update` and with the latest codemods:

```bash
$ cd todomvc
$ npx ember-cli-update
$ git commit -m 'Update Ember with ember-cli-update' -a
$ npx ember-cli-update --run-codemods
$ git commit -m 'Update TodoMVC with codemods' -a
```

Build Ember TodoMVC for production:

```bash
$ ember build --prod
```

Run Cypress Test:

```bash
# Run this command from the root folder of this repository
$ npm install
$ npm run server

# Run in a separated terminal
$ CYPRESS_framework=emberjs npm run cy:open
```

### Ember Notes

* The `rootURL` param in `config/environment.js` should keep as empty string.

