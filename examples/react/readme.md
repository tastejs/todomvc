# React TodoMVC Example

> React is a JavaScript library for creating user interfaces. Its core principles are declarative code, efficiency, and flexibility. Simply specify what your component looks like and React will keep it up-to-date when the underlying data changes.

> _[React - facebook.github.io/react](http://facebook.github.io/react)_


## Learning React

The [React getting started documentation](http://facebook.github.io/react/docs/getting-started.html) is a great way to get started.

Here are some links you may find helpful:

* [Documentation](http://facebook.github.io/react/docs/getting-started.html)
* [API Reference](http://facebook.github.io/react/docs/reference.html)
* [Blog](http://facebook.github.io/react/blog/)
* [React on GitHub](https://github.com/facebook/react)
* [Support](http://facebook.github.io/react/support.html)

Articles and guides from the community:

* [How is Facebook's React JavaScript library](http://www.quora.com/React-JS-Library/How-is-Facebooks-React-JavaScript-library)
* [React: Under the hood](http://www.quora.com/Pete-Hunt/Posts/React-Under-the-Hood)

Get help from other React users:

* [React on StackOverflow](http://stackoverflow.com/questions/tagged/reactjs)
* [Discussion Forum](https://discuss.reactjs.org/)

_If you have other helpful links to share, or find any of the links above no longer work, please [let us know](https://github.com/tastejs/todomvc/issues)._


## Running

The app is built with [JSX](http://facebook.github.io/react/docs/jsx-in-depth.html) and compiled at runtime for a lighter and more fun code reading experience. As stated in the link, JSX is not mandatory.

To run the app, spin up an HTTP server (e.g. `python -m SimpleHTTPServer`) and visit http://localhost/.../myexample/.

# Sunit's Implementation

- Fork and clone repo

- run: npm install --global gulp-cli

- updated devDependencies in root directory to "gulp": "^4.0.0",

- run: npm install

- Updated gulp to latest version 4.0.2

- Modified gulpfile in root directory to use gulp.series() (modfication required because old code was deprecated)

- Run: npm start to start gulp test-server on port 8000 (localhost:8000)

- Click "react" which will take you to: http://localhost:8000/examples/react/#/

- CSS modified at ~/react/node_modules/todomvc-app-css/index.css

# Notes/Ideas for adding tags feature

- in todoModel.js add a "tags" property to the todos object when they are created. tags: ["funny", "green", "etc"]

- in app.jsx use the shownTodos variable to filter based on tag (currently filtering based on completed or not)

## Possible areas of improvement

- Update React syntax to ES6 or use React Hooks

- Add abiltiy to edit or remove existing tags

- Add multiple tags (separated by commas or spaces)

- Create a separate component for "tag" and maybe "tagInput" for better separation of concerns

- Add ability to filter by selecting numerous tags at once