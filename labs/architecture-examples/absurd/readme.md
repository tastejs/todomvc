# AbsurdJS TodoMVC Example

> AbsurdJS is a JavaScript library available for [Node.js and the browser](http://absurdjs.com/pages/builds). It acts as a [CSS](http://absurdjs.com/pages/css-preprocessing) and [HTML](http://absurdjs.com/pages/html-preprocessing) preprocessor. There are a lot of build-in [mixins](http://absurdjs.com/pages/css-preprocessing/variables-and-mixins) called [atoms](http://absurdjs.com/pages/css-preprocessing/organic-css/atoms/) and [molecules](http://absurdjs.com/pages/css-preprocessing/organic-css/molecules/). Having both, CSS and HTML preprocessing, you are able to create cutting edge [web components](http://absurdjs.com/pages/client-side-components/). All for JavaScript and JavaScript for all.

> _[AbsurdJS - absurdjs.com](http://absurdjs.com)_

## Learning AbsurdJS

The [AbsurdJS site](http://absurdjs.com) is a great resource for getting started.

Here are some links you may find helpful:

* [Documentation](http://absurdjs.com/pages/documentation/)
* [API Reference](http://absurdjs.com/pages/api/)
* [Blog](http://krasimirtsonev.com/blog/search?search_for=absurdjs)
* [AbsurdJS on GitHub](https://github.com/krasimir/absurd)

Articles and guides from the community:

* [AbsurdJS fundamentals](http://krasimirtsonev.com/blog/article/AbsurdJS-fundamentals)
* [Write Your CSS with JavaScript](http://davidwalsh.name/write-css-javascript)
* [AbsurdJS or Why I Wrote My Own CSS Preprocessor](http://code.tutsplus.com/tutorials/absurdjs-or-why-i-wrote-my-own-css-preprocessor--net-36003)

Get help from the AbsurdJS users:

* [AbsurdJS GitHub issues](https://github.com/krasimir/absurd/issues)

## Implementation

The application is build on top of [AbsurdJS components](http://absurdjs.com/pages/client-side-components/). The views(controllers) are placed in `/js/views`. There is one model defined in `/js/model/model.js`. The entry point of the example is the component called `Application` saved in `/js/app.js`. The routing is also defined there. AbsurdJS doesn't have internal mechanisms handling the local storage. There is vanilla JavaScript class registered as dependency for injecting. It's again in `app.js` file.

## Running

To run the app, spin up an HTTP server and visit folder of the example.

## Credit

This TodoMVC application was created by [Krasimir Tsonev](http://krasimirtsonev.com/).
