# React / Redux • [TodoMVC](http://todomvc.com)

> React is a JavaScript library for creating user interfaces. Its core principles are declarative code, efficiency, and flexibility. Simply specify what your component looks like and React will keep it up-to-date when the underlying data changes.

> Redux is a predictable state container for JavaScript apps. It helps you write applications that behave consistently, run in different environments (client, server, and native), and are easy to test. On top of that, it provides a great developer experience, such as live code editing combined with a time traveling debugger.

## Resources
- [React Website](https://facebook.github.io/react/)
- [Redux Website](http://redux.js.org/)

### Articles
- [Getting Started with React](https://facebook.github.io/react/docs/getting-started.html)
- [Getting Started with Redux](https://egghead.io/courses/getting-started-with-redux)
- [Building React Applications with Idiomatic Redux](https://egghead.io/courses/building-react-applications-with-idiomatic-redux)

### Support
- [React Stack Overflow](http://stackoverflow.com/questions/tagged/react)
- [Redux Stack Overflow](http://stackoverflow.com/questions/tagged/redux)

## Implementation
This is an implementation of the [Redux Todo app example](https://github.com/reactjs/redux/tree/master/examples/todomvc).
In order to show React and Redux in a simple way, some cool features that are not directly related to React/Redux like multiple environments, a development server, CSS loading with webpack, etc, were not included.
Also, some [todomvc.com](http://todomvc.com) features (eg: clear completed) were implemented in order to comply with the app specs.


You can check it with any static web server (eg: `python -m SimpleHTTPServer`). The index.html file uses the bundled version by Babel created with `npm run dist` under the `dist` folder, but this bundle contains source maps to the JS source code located under the `js` folder, so developers can see and debug the application with the original code.

## Credit
Created by [paguillama](https://github.com/paguillama)
