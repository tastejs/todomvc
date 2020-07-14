# PurgeCSS

[![Build Status](https://travis-ci.org/FullHuman/purgecss.svg?branch=master)](https://travis-ci.org/FullHuman/purgecss)
[![CircleCi](https://circleci.com/gh/FullHuman/purgecss/tree/master.svg?style=shield)]()
[![dependencies Status](https://david-dm.org/fullhuman/purgecss/status.svg)](https://david-dm.org/fullhuman/purgecss)
[![devDependencies Status](https://david-dm.org/fullhuman/purgecss/dev-status.svg)](https://david-dm.org/fullhuman/purgecss?type=dev)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/2f2f3fb0a5c541beab2018483e62a828)](https://www.codacy.com/app/FullHuman/purgecss?utm_source=github.com&utm_medium=referral&utm_content=FullHuman/purgecss&utm_campaign=Badge_Grade)
[![Codacy Badge](https://api.codacy.com/project/badge/Coverage/2f2f3fb0a5c541beab2018483e62a828)](https://www.codacy.com/app/FullHuman/purgecss?utm_source=github.com&utm_medium=referral&utm_content=FullHuman/purgecss&utm_campaign=Badge_Coverage)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![npm](https://img.shields.io/npm/v/purgecss.svg)](https://www.npmjs.com/package/purgecss)
[![license](https://img.shields.io/github/license/fullhuman/purgecss.svg)]() [![Greenkeeper badge](https://badges.greenkeeper.io/FullHuman/purgecss.svg)](https://greenkeeper.io/)

<p align="center">
	<img src="./.assets/logo.png" height="200" width="200" alt="PurgeCSS logo"/>
</p>

## What is PurgeCSS?

When you are building a website, chances are that you are using a css framework
like Bootstrap, Materializecss, Foundation, etc... But you will only use a small
set of the framework and a lot of unused css styles will be included.

This is where PurgeCSS comes into play. PurgeCSS analyzes your content and your
css files. Then it matches the selectors used in your files with the one in your
content files. It removes unused selectors from your css, resulting in smaller
css files.

## Documentation

You can find the PurgeCSS documentation
[on this website](https://www.purgecss.com).

* [Configuration](https://www.purgecss.com/configuration)
* [CLI](https://www.purgecss.com/cli)
* [Javascript API](https://www.purgecss.com/javascript-api)
* [Webpack plugin](https://www.purgecss.com/with-webpack)
* [Gulp plugin](https://www.purgecss.com/with-gulp)
* [Grunt plugin](https://www.purgecss.com/with-grunt)
* [Rollup plugin](https://www.purgecss.com/with-rollup)
* [Whitelisting](https://www.purgecss.com/whitelisting)
* [Extractors](https://www.purgecss.com/extractors)
* [Comparison](https://www.purgecss.com/comparison)
* Guides
  * [React](https://www.purgecss.com/guides/react)
  * [Vue](https://www.purgecss.com/guides/vue)
  * [Nuxt](https://www.purgecss.com/guides/nuxt)
  * [Wordpress](https://www.purgecss.com/guides/wordpress)

## Getting Started

#### Installation

```
npm i --save-dev purgecss
```

## Usage

```js
import Purgecss from 'purgecss'
const purgeCss = new Purgecss({
  content: ['**/*.html'],
  css: ['**/*.css']
})
const result = purgeCss.purge()
```

With a custom extractor:

```js
import Purgecss from 'purgecss'
import purgeHtml from 'purgecss-from-html'
const purgeCss = new Purgecss({
  content: ['**/*.html'],
  css: ['**/*.css'],
  extractors: [
    {
      extractor: purgeHtml,
      extensions: ['html']
    }
  ]
})
const result = purgeCss.purge()
```

### Build Plugin

<div align="center">
	  <a href="https://github.com/FullHuman/purgecss-webpack-plugin">
    	<img width="200" heigth="200" src="https://webpack.js.org/assets/icon-square-big.svg">
  	</a>
	  <a href="https://github.com/FullHuman/gulp-purgecss">
    	<img height="200" width="89" src="https://raw.githubusercontent.com/gulpjs/artwork/master/gulp-2x.png">
  	</a>
    <a href="https://github.com/FullHuman/grunt-purgecss">
    	<img height="200" width="200" src="https://gruntjs.com/img/grunt-logo-no-wordmark.svg">
  	</a>
  	<a href="https://github.com/FullHuman/rollup-plugin-purgecss">
  		<img height="200" width="200" src="https://rollupjs.org/logo.svg"/>
	  </a>
</div>

* [Webpack](https://www.purgecss.com/with-webpack)
* [Gulp](https://www.purgecss.com/with-gulp)
* [Grunt](https://www.purgecss.com/with-grunt)
* [Rollup](https://www.purgecss.com/with-rollup)

## Contributing

Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for details on our code of
conduct, and the process for submitting pull requests to us.

## Versioning

PurgeCSS use [SemVer](http://semver.org/) for versioning.

## Acknowledgment

PurgeCSS was originally thought as the v2 of purifycss. And because of it, it is
greatly inspired by it.\
Some of the plugins such as purgecss-webpack-plugin are based on the purifycss plugin.\
Below is the list of the purifycss repositories:

* [purifycss](https://github.com/purifycss/purifycss)
* [gulp-purifycss](https://github.com/purifycss/gulp-purifycss)
* [purifycss-webpack](https://github.com/webpack-contrib/purifycss-webpack)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file
for details.

## Troubleshooting

#### Wrong extractor is selected

The extractors needs to be defined from the more specific to the less specific.
Meaning that you need to define `js` extractor after `ejs`. So the `js`
extractor will not be selected for ejs files.

> You can specified extensions like `.es.js`.
