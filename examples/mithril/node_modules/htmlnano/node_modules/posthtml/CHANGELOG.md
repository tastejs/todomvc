# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.12.3](https://github.com/posthtml/posthtml/compare/v0.12.2...v0.12.3) (2020-04-21)

### [0.12.2](https://github.com/posthtml/posthtml/compare/v0.12.1...v0.12.2) (2020-04-16)

### [0.12.1](https://github.com/posthtml/posthtml/compare/v0.12.0...v0.12.1) (2020-04-14)

## [0.12.0](https://github.com/posthtml/posthtml/compare/v0.11.6...v0.12.0) (2019-10-11)


### Features

* **index:** tree fromString/toString, close [#242](https://github.com/posthtml/posthtml/issues/242) ([2647d53](https://github.com/posthtml/posthtml/commit/2647d53f07cbb850004b259b9272946b56fa434a))


### Bug Fixes

* **index:** example for parser/render ([d25743f](https://github.com/posthtml/posthtml/commit/d25743fbc383cdd867159703263a8b7ec5943e7b))
* **index:** forgot change methods name ([72a8640](https://github.com/posthtml/posthtml/commit/72a8640ed0e28898601ea196c4908f55e3082fd0))
* **index:** remove static method because not return class constructor ([7825559](https://github.com/posthtml/posthtml/commit/7825559cdec47d50788633031d56c0c6938b10d7))

### [0.11.6](https://github.com/posthtml/posthtml/compare/v0.11.5...v0.11.6) (2019-08-30)


### Bug Fixes

* typings ([97d89ad](https://github.com/posthtml/posthtml/commit/97d89ad))


### Features

* **typings:** Type-inference for node.prototype.match ([90d3c48](https://github.com/posthtml/posthtml/commit/90d3c48))

### [0.11.5](https://github.com/posthtml/posthtml/compare/v0.11.4...v0.11.5) (2019-08-27)

### Perf
* **perf:** Add TypeScript typings ([89bf763](https://github.com/posthtml/posthtml/commit/89bf763q))

### Plugins
* **plugin:** Add posthtml-minify-classnames ([9844a08](https://github.com/posthtml/posthtml/commit/9844a08))
* **plugin:** Add posthtml-pseudo ([8b86f58](https://github.com/posthtml/posthtml/commit/8b86f58))
* **plugin:** Add posthtml-lazyload ([1009bff](https://github.com/posthtml/posthtml/commit/1009bff))
* **plugin:** Add posthtml-link-noreferrer ([1009bff](https://github.com/posthtml/posthtml/commit/1009bff))

### [0.11.4](https://github.com/posthtml/posthtml/compare/v0.11.3...v0.11.4) (2019-05-06)


### Bug Fixes

* **index:** if tree not object ([3fd9548](https://github.com/posthtml/posthtml/commit/3fd9548))
* **readme:** adds missing bracket ([ff3102f](https://github.com/posthtml/posthtml/commit/ff3102f))
* **test/options:** incorrect transfer option for the process ([c5fd774](https://github.com/posthtml/posthtml/commit/c5fd774))


### Build System

* remove pkg lock ([5c9b45a](https://github.com/posthtml/posthtml/commit/5c9b45a))
* update build system, close [#279](https://github.com/posthtml/posthtml/issues/279) ([ca77e4a](https://github.com/posthtml/posthtml/commit/ca77e4a))
* update depDev ([c975225](https://github.com/posthtml/posthtml/commit/c975225))


### Tests

* update init for mocha ([be634f6](https://github.com/posthtml/posthtml/commit/be634f6))
* **message:** add test for extending from prevent tree ([6cb238a](https://github.com/posthtml/posthtml/commit/6cb238a))
* **options:** if tree not object ([dcdb3e7](https://github.com/posthtml/posthtml/commit/dcdb3e7))



<a name="0.11.3"></a>
## [0.11.3](https://github.com/posthtml/posthtml/compare/v0.11.2...v0.11.3) (2018-02-16)


### Bug Fixes

* **index:** instance new api between files, close [#250](https://github.com/posthtml/posthtml/issues/250) ([25120a9](https://github.com/posthtml/posthtml/commit/25120a9))
* **index:** if tree not object ([3fd9548](https://github.com/posthtml/posthtml/commit/3fd9548))
* **test/options:** incorrect transfer option for the process ([c5fd774](https://github.com/posthtml/posthtml/commit/c5fd774))


### Performance Improvements

* **api:** rewrite to constructor, close [#258](https://github.com/posthtml/posthtml/issues/258) ([89238cb](https://github.com/posthtml/posthtml/commit/89238cb))
* **api:** api is not a place for concatenation. ([f428425](https://github.com/posthtml/posthtml/commit/f428425))
* **api:** inherit from the previous tree ([4e69577](https://github.com/posthtml/posthtml/commit/4e69577))
* **api:** move message to posthtml constructor ([c51e40f](https://github.com/posthtml/posthtml/commit/c51e40f))
* **api:** rename api to extendApi ([846e386](https://github.com/posthtml/posthtml/commit/846e386))
* **index:** set the previous tree as the context value for api ([21170c7](https://github.com/posthtml/posthtml/commit/21170c7))
* made a repetitive design in a private function ([fabeef4](https://github.com/posthtml/posthtml/commit/fabeef4))

### Reverts

* **api:** return export api methods ([90e3565](https://github.com/posthtml/posthtml/commit/90e3565))



<a name="0.11.2"></a>
## [0.11.2](https://github.com/posthtml/posthtml/compare/v0.11.1...v0.11.2) (2018-01-19)



<a name="0.11.1"></a>
## [0.11.1](https://github.com/posthtml/posthtml/compare/v0.11.0...v0.11.1) (2018-01-16)


### Bug Fixes

* **index:** don't throw on empty tree () ([c66f9e2](https://github.com/posthtml/posthtml/commit/c66f9e2))



<a name="0.11.0"></a>
# [0.11.0](https://github.com/posthtml/posthtml/compare/v0.10.1...v0.11.0) (2017-12-12)


### Bug Fixes

* **readme:** typo in webpack config, close [#222](https://github.com/posthtml/posthtml/issues/222) ([92b0261](https://github.com/posthtml/posthtml/commit/92b0261))


### Features

* **index:** add support for `messages` (`result.messages`) ([e38bb9b](https://github.com/posthtml/posthtml/commit/e38bb9b))



<a name="0.10.1"></a>
## [0.10.1](https://github.com/posthtml/posthtml/compare/v0.10.0...v0.10.1) (2017-11-24)


### Bug Fixes

* **index:** did not pass options for parser ([b8cd535](https://github.com/posthtml/posthtml/commit/b8cd535))



<a name="0.10.0"></a>
# [0.10.0](https://github.com/posthtml/posthtml/compare/v0.9.2...v0.10.0) (2017-11-23)

* **docs** add directives description ([876315e](https://github.com/posthtml/posthtml/pull/231/commits/876315e))
* **chore** update posthtml-parser ([0e767d8](https://github.com/posthtml/posthtml/pull/231/commits/0e767d8))
* **test** for option directives ([015433f](https://github.com/posthtml/posthtml/pull/231/commits/015433f))
* **test** update title ([5ea4023](https://github.com/posthtml/posthtml/pull/231/commits/5ea4023))
* **test** fix not support string template old nodes ([3f07e1c](https://github.com/posthtml/posthtml/pull/231/commits/3f07e1c))
* **test** fix typo ([32e29e3](https://github.com/posthtml/posthtml/pull/231/commits/32e29e3))

<a name="0.9.2"></a>
## [0.9.2](https://github.com/posthtml/posthtml/compare/v0.9.1...v0.9.2) (2017-01-20)


### Bug Fixes

* Cannot read property 'length' of undefined ([03da01e](https://github.com/posthtml/posthtml/commit/03da01e))
* **index:** trailing space ([3cd00b7](https://github.com/posthtml/posthtml/commit/3cd00b7))
* **index:** typo in require method ([088c9e3](https://github.com/posthtml/posthtml/commit/088c9e3))
* **test:** fix tree for test options set ([03286ea](https://github.com/posthtml/posthtml/commit/03286ea))



<a name="0.9.1"></a>
## [0.9.1](https://github.com/posthtml/posthtml/compare/v0.9.0...v0.9.1) (2016-09-29)



<a name="0.9.0"></a>
# [0.9.0](https://github.com/posthtml/posthtml/compare/v0.8.7...v0.9.0) (2016-07-06)


### Bug Fixes

* fix run jscs after version update ([124f857](https://github.com/posthtml/posthtml/commit/124f857))


### Features

* make parser configurable ([bfa3e6d](https://github.com/posthtml/posthtml/commit/bfa3e6d))
* **lib:** make use method variadic ([43d6a6b](https://github.com/posthtml/posthtml/commit/43d6a6b))



<a name="0.8.7"></a>
## [0.8.7](https://github.com/posthtml/posthtml/compare/v0.8.6...v0.8.7) (2016-05-04)


### Performance Improvements

* **lib:** on demand html rendering ([4ef0df9](https://github.com/posthtml/posthtml/commit/4ef0df9))



<a name="0.8.6"></a>
## [0.8.6](https://github.com/posthtml/posthtml/compare/v0.8.5...v0.8.6) (2016-04-26)


### Bug Fixes

* **api:** report true for boolean attrs ([70cec9d](https://github.com/posthtml/posthtml/commit/70cec9d))
* **docs:** correct typo ([b5133f5](https://github.com/posthtml/posthtml/commit/b5133f5))



<a name="0.8.5"></a>
## [0.8.5](https://github.com/posthtml/posthtml/compare/v0.8.4...v0.8.5) (2016-03-31)


### Bug Fixes

* **README:** fix style in Readme ([9944446](https://github.com/posthtml/posthtml/commit/9944446))

### Performance Improvements

* **api:** remove extra slice call ([8a3ff11](https://github.com/posthtml/posthtml/commit/8a3ff11))



<a name="0.8.4"></a>
## [0.8.4](https://github.com/posthtml/posthtml/compare/v0.8.3...v0.8.4) (2016-03-30)


### Bug Fixes

* promise check and tests ([79bcff9](https://github.com/posthtml/posthtml/commit/79bcff9))

### Features

* **docs:** update README, add docs folder ([619a97c](https://github.com/posthtml/posthtml/commit/619a97c))



<a name="0.8.3"></a>
## [0.8.3](https://github.com/posthtml/posthtml/compare/v0.8.2...v0.8.3) (2016-02-26)


### Bug Fixes

* promise check and tests ([0162f97](https://github.com/posthtml/posthtml/commit/0162f97))



<a name="0.8.2"></a>
## [0.8.2](https://github.com/posthtml/posthtml/compare/v0.8.1...v0.8.2) (2016-02-05)


### Features

* remove compilations. Support for NodeJS v0.10 ([ac437b7](https://github.com/posthtml/posthtml/commit/ac437b7))



<a name"0.8.1"></a>
### 0.8.1 (2016-01-08)


#### Bug Fixes

* **api:** fix binds tree for import API ([a8f25007](https://github.com/posthtml/posthtml/commit/a8f25007))
* **docs:** fix readme ([cd61bc11](https://github.com/posthtml/posthtml/commit/cd61bc11))


#### Features

* **docs:**
  * add more plugins in plugin list ([52bfcad2](https://github.com/posthtml/posthtml/commit/52bfcad2))
  * add Gitter chat badge ([97ba9847](https://github.com/posthtml/posthtml/commit/97ba9847))
  * add new plugins link & add plugin boilerplate link ([40644039](https://github.com/posthtml/posthtml/commit/40644039))


<a name"0.8.0"></a>
## 0.8.0 (2015-11-24)


#### Bug Fixes

* **docs:** delete parse section ([16511096](https://github.com/posthtml/posthtml/commit/16511096))


#### Features

* ***:** upd nodejs deps in travis.yml ([481378db](https://github.com/posthtml/posthtml/commit/481378db))
* **api:** chaining ([03080a6e](https://github.com/posthtml/posthtml/commit/03080a6e))
* **docs:** upd plugin sections in Readme ([c69bc2b9](https://github.com/posthtml/posthtml/commit/c69bc2b9))


<a name"0.7.0"></a>
## 0.7.0 (2015-10-21)


#### Features

* ***:** new dependencies·for posthtml-parser posthtml-render ([a5bc312b](https://github.com/posthtml/posthtml/commit/a5bc312b))
* **api:** delete matchClass method ([912f72ad](https://github.com/posthtml/posthtml/commit/912f72ad))
* **docs:** add dependency info to readme ([6c3419cf](https://github.com/posthtml/posthtml/commit/6c3419cf))


<a name"0.6.0"></a>
## 0.6.0 (2015-10-17)


#### Features

* ***:** fix code style ([7a743f78](https://github.com/posthtml/posthtml/commit/7a743f78))
* **api:** Support RegExp in matcher Object ([e3bd9918](https://github.com/posthtml/posthtml/commit/e3bd9918))
* **docs:** add matchClass deprecated info ([14f1757e](https://github.com/posthtml/posthtml/commit/14f1757e))


<a name"0.5.0"></a>
## 0.5.0 (2015-10-10)


#### Features

* **api:** support RegExp matchers ([783c5663](https://github.com/posthtml/posthtml/commit/783c5663))
* **docs:**
  * add project-stub link. Fix long titles. Upd PostHTMLTree example ([57f48334](https://github.com/posthtml/posthtml/commit/57f48334))
  * add posthtml-retext info & upd links ([541dbc03](https://github.com/posthtml/posthtml/commit/541dbc03))
  * add license info to readme ([32300239](https://github.com/posthtml/posthtml/commit/32300239))
  * add posthtml-bem plugin in readme ([2eea4b19](https://github.com/posthtml/posthtml/commit/2eea4b19))


<a name"0.4.1"></a>
### 0.4.1 (2015-10-04)


#### Bug Fixes

* **posthtml:** fix build ES2015 ([829ba49c](https://github.com/posthtml/posthtml/commit/829ba49c))


<a name"0.4.0"></a>
## 0.4.0 (2015-10-03)


#### Bug Fixes

* **lint:** fix jscsrc ([a534e0a0](https://github.com/posthtml/posthtml/commit/a534e0a0))
* **posthtml:**
  * extend new object with api methods on each plugin call ([82e096ea](https://github.com/posthtml/posthtml/commit/82e096ea))
  * code style fix ([d1b3484d](https://github.com/posthtml/posthtml/commit/d1b3484d))
  * code style fix ([26e6d7e3](https://github.com/posthtml/posthtml/commit/26e6d7e3))


#### Features

* **api:** handle array matchers ([335b5aac](https://github.com/posthtml/posthtml/commit/335b5aac))
* **docs:**
  * write array matchers example in jsdocs/readme ([a14b7675](https://github.com/posthtml/posthtml/commit/a14b7675))
  * add logo to readme ([78740c34](https://github.com/posthtml/posthtml/commit/78740c34))
* **lint:** upd jscs ([cef42d5d](https://github.com/posthtml/posthtml/commit/cef42d5d))
* **posthtml:** implement truly sync and async modes, and tests for them ([337243f5](https://github.com/posthtml/posthtml/commit/337243f5))


<a name"0.3.0"></a>
## 0.3.0 (2015-09-25)


#### Features

* **parser:** skip template if tag === false ([3cc9e59f](https://github.com/posthtml/posthtml/commit/3cc9e59f))


<a name"0.2.1"></a>
### 0.2.1 (2015-09-24)


#### Features

* **api:** optimize matchClass func ([b0311cd7](https://github.com/posthtml/posthtml/commit/b0311cd7))
* **docs:**
  * Write example Gulp plugin for PostHTML in docs ([b9c8ceff](https://github.com/posthtml/posthtml/commit/b9c8ceff))
  * Add Textr plugin to Readme ([bdd3270b](https://github.com/posthtml/posthtml/commit/bdd3270b))


<a name"0.2.0"></a>
## 0.2.0 (2015-09-23)


#### Bug Fixes

* **test:** fix typo & cleanup ([e33ba7fa](https://github.com/posthtml/posthtml/commit/e33ba7fa))


#### Features

* **api:**
  * rename eachClass to matchClass ([efc9b349](https://github.com/posthtml/posthtml/commit/efc9b349))
  * use options in plugin ([0d8c4555](https://github.com/posthtml/posthtml/commit/0d8c4555))
* **docs:** `options` docs write in readme ([d72c2741](https://github.com/posthtml/posthtml/commit/d72c2741))
* **lint:** own jscs config ([74332ab8](https://github.com/posthtml/posthtml/commit/74332ab8))
* **parser:**
  * toHtml tests ([789ee545](https://github.com/posthtml/posthtml/commit/789ee545))
  * own render html func ([1520e5ff](https://github.com/posthtml/posthtml/commit/1520e5ff))


<a name"0.1.0"></a>
## 0.1.0 (2015-09-14)


#### Features

* **api:** base API ([096654a6](https://github.com/posthtml/posthtml/commit/096654a6))


<a name"0.0.4"></a>
### 0.0.4 (2015-09-13)


#### Bug Fixes

* **lib:** fix option declare ([db95e066](https://github.com/posthtml/posthtml/commit/db95e066))


#### Features

* ***:** upd deps ([054bd94c](https://github.com/posthtml/posthtml/commit/054bd94c))
* **lib:** delete getOptions method ([931a03a0](https://github.com/posthtml/posthtml/commit/931a03a0))
* **parser:**
  * no skip parse text simbols ([42b4d156](https://github.com/posthtml/posthtml/commit/42b4d156))
  * Own parser html to tree ([748d8f1e](https://github.com/posthtml/posthtml/commit/748d8f1e))
  * init ([1ca1b39b](https://github.com/posthtml/posthtml/commit/1ca1b39b))
* **readme:** add tree example ([e46e9bc2](https://github.com/posthtml/posthtml/commit/e46e9bc2))


<a name"0.0.3"></a>
### 0.0.3 (2015-08-13)

* ***:** upd dependencies ([b1f4f2664106034d6fd530962a4f9bd9c378d17a](https://github.com/posthtml/posthtml/commit/b1f4f2664106034d6fd530962a4f9bd9c378d17a))

#### Features

* **lint:** use jshint ([504f3c06](https://github.com/posthtml/posthtml/commit/504f3c06))


<a name"0.0.2"></a>
### 0.0.2 (2015-07-02)


#### Features

* ***:**
  * add-travis-and-coverage ([92c9ee81](https://github.com/posthtml/posthtml/commit/92c9ee81))
  * changelog build ([044fd58d](https://github.com/posthtml/posthtml/commit/044fd58d))
  * deep results objects #13 ([96b86c90](https://github.com/posthtml/posthtml/commit/96b86c90))
  * add skipParse options ([45eeb9e3](https://github.com/posthtml/posthtml/commit/45eeb9e3))
* **gulp:** refactor config ([2fe4ecb2](https://github.com/posthtml/posthtml/commit/2fe4ecb2))


<a name"0.0.1"></a>
### 0.0.1
init
