# Changelog

## 2.0

- Framework versions brought up to current stable lines (idiomatic code for each):
    - React 17 → 19 (createRoot, react-router 7, modern webpack stack)
    - Vue 3.3 → 3.5 (Vite 8, plugin-vue 6)
    - Angular 17 → 21 (new `@angular/build` builder, dropped karma)
    - Svelte 4 → 5 (full migration to runes: `$state`, `$derived`, `$effect`, `$props`)
    - Preact 10.13 → 10.29 (Rollup 4)
    - Lit 3.0-pre → 3.3.2 (proper stable release)
    - React Redux modernized to Redux Toolkit 2 + react-redux 9 (function components + hooks throughout)

- Test infrastructure modernized:
    - Replaced gulp 3 (broken on modern Node) with a small Express server
    - Cypress 3 → 15 with current config layout (`cypress.config.js`, `cypress/e2e/`)
    - Modernized the multi-app runner; default `npm run test:all` now sweeps the curated modern set, with `--all` for the full legacy sweep
    - Deleted dead Selenium scaffolding from 2014

- ~20 spec deviations caught and fixed across the maintained apps:
    - Hidden-when-empty: `<main>` and `<footer>` now stay in DOM and toggle `hidden` instead of returning null
    - Trim-on-save in headers and edit fields
    - Save-on-blur, Escape-to-cancel, with proper Mocha 10 / Cypress 12+ behavior
    - "Clear Completed" → "Clear completed" (spec-correct)
    - aria-label on edit inputs and destroy buttons (replacing always-rendered visually-hidden labels)
    - Toggle-all no longer starts checked on an empty list

- Site content refresh:
    - Updated framework descriptions in learn.json (React, Vue, Svelte, Lit, Angular, Preact, React Redux)
    - Removed dead Google+ widget and Universal Analytics snippet
    - Renamed "JavaScript ES6" example to "Modern JavaScript"
    - Updated Speedometer link to 3.1
    - Refreshed intro copy and "What's new" section for the 2026 ecosystem

## 1.4

- New examples:
    - Angular 17
    - Lit
    - Preact
    - React Redux
    - Svelte
    - Web Components

- Updated examples:
    - Backbone
    - Ember
    - jQuery
    - React
    - Vue
    - JavaScript ES5 (vanilla)
    - JavaScript ES6 (vanilla ES6)

- Removed examples:
    - Angular 2
    - Angular 2 / ES2015
    - Angular JS
    - Firebase Angular
    - Kotlin React
    - React Alt
    - React Backbone
    - React hooks
    - Scalajs React

- General updates:
    - remove `Router` badge on home page
    - add `New` badge for new / updated examples
    - update avatars in readme and on index page
    - pin node version to run locally

## 1.3.1

New since 1.3:
	- Kotlin-react

Updates since 1.3:
	- Ember 3.2
	- Backbone_marionette
	- Reagent
	- jQuery
	- Vanilla js
	- Add Microsoft Edge to supported browsers
	- New example guidlines
	- Use npm ci

Removed since 1.3:
	- Ampersand
	- Flight
	- Meteor
	- webrx
	- troop
	- atmajs
	- foam
	- rappid
	- serenadejs
	- somajs
	- puremvc
	- olives
	- humble
	- chaplin-brunch
	- ExtJS
	- DeftJS
	- Durandal

## 1.3 - TBD

- New since 1.2:
    - Durandal
    - Exoskeleton
    - Atma.js
    - ComponentJS
    - AngularDart

- Updates since 1.2:
    - VanillaJS refactored, tests, bug fixes
    - AngularJS perf
    - AngularJS
    - Ember
    - GWT
    - Spine
    - CanJS 2.0
    - CanJS 2.0 + RequireJS
    - knockoutjs_classBindingProvider example has been removed
    - Backbone 1.1
    - Backbone 1.1 + RequireJS
    - Dart 1.0
    - React graduated from Labs
    - Agility
    - jQuery

- Removed since 1.2:
    - Dermis.js
    - ExtJS

## 1.2 - 2013-08-06

- New since 1.1:
    - Polymer
    - Flight
    - DeftJS + ExtJS
    - Aria Templates
    - Enyo + Backbone.js
    - React
    - SAPUI5
    - AngularJS + Firebase

- Updates since 1.1:
    - Backbone 1.0
    - cujoJS got updated
    - Kendo UI Spring 2013 release
    - Maria graduated from labs
    - TroopJS 2.0

- The GWT example implemented routing
- The sammy.js example implemented routing
- Removed Ember.js + require.js example

## 1.1 - 2013-02-14

- We now have 18 stable apps and 36 in labs. New since 1.0.1:
    - Dart
    - TypeScript + Backbone.js
    - TypeScript + AngularJS
    - Serenade.js
    - CanJS + RequireJS
    - Chaplin + Brunch
    - Thorax + Lumbar
    - Kendo UI
    - CanJS replaced the JavaScriptMVC app
- Many app frameworks and libraries have been upgraded to the latest version
- XSS issues in several apps have been resolved
- The homepage got reorganized with new categories
- Various consistency fixes across all apps

## 1.0.1 - 2012-10-09

- All main apps have been completely rewritten for consistency
- Routing has been added to many of these
- We now have 30+ apps being worked on in Labs
- We're using a kick-ass new template
- Framework authors and contributors have been consulted to ensure our apps adhere to best practices
- We're helping AMD users by adding AMD versions of many apps
