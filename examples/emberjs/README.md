# Ember.js TodoMVC Example using Ember 5.3

> A framework for creating ambitious web applications.

> _[Ember.js - emberjs.com](http://emberjs.com)_

\*Ember is not an MVC framework.

## Note for people updating this app.

The `index.html` and the `assets` folder in the parent folder as simlinks into the items with the same names inside `dist`. The `dist` folder has to be checked in git and built for production.

You can develop this project as a standard Ember application:

```bash
$ cd todomvc
$ pnpm install
$ pnpm start
```
Build Ember TodoMVC for production:

```bash
$ pnpm build 
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

