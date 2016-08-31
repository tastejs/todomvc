# Knockout SPA • [TodoMVC] [![Code Climate](https://codeclimate.com/github/onlyurei/todomvc-knockout-spa/badges/gpa.svg)](https://codeclimate.com/github/onlyurei/todomvc-knockout-spa)

[knockout-spa](https://github.com/onlyurei/knockout-spa)
> A mini but full-fledged SPA framework and boilerplate to build SPAs fast and scalable.


## Resources

- [Demo/Documentation](http://knockout-spa.mybluemix.net/)
- [Project on GitHub](https://github.com/onlyurei/knockout-spa)
- [Learn Knockout](http://learn.knockoutjs.com/)
- [knockout-es5-option4 (Vanilla Javascript powered by Knockout)](https://github.com/nathanboktae/knockout-es5-option4)

### Support

- [Gitter Room](https://gitter.im/onlyurei/knockout-spa)


*Let us [know](https://github.com/tastejs/todomvc/issues) if you discover anything worth sharing.*


## Implementation

* Object-oriented design that's highly composable and reusable; small footprint of framework flavored opinionated code.
* **Provide [Knockout ES5 POJO style viewModel/binding option](https://github.com/nathanboktae/knockout-es5-option4) to help you write cleaner code and make it easier to replace Knockout with other MVVM libraries in the future.**
* **Using Knockout 3.4.0+ so ready for [Knockout's flavor of web component and custom tags](http://knockoutjs.com/documentation/component-overview.html).**
    * Component files (html, js, css) are [loaded dynamically on-demand](http://knockoutjs.com/documentation/component-loaders.html): only when the component is in the view. 
* Use [`require-css`](https://github.com/guybedford/require-css) and [`require-text`](https://github.com/requirejs/text) AMD plugins to load CSS and HTML templates dynamically on-demand along with the JS modules requiring them; these CSS and HTML template files will be inlined and minified into the corresponding JS modules for production build. This allows the app to scale to very large - not doing a lump-sum load of giant bundled files for the entire app on first page load - only the needed parts of the page, and common dependencies of all modules will be loaded. As user navigates to other parts of the app, the needed files (js, css, html) are lazy loaded. This is important for the app to be performant especially on mobile devices, since the lump-sum bundle files are not only slower to download due to size, but also slower to parse.
* **No any grunt/gulp/watcher/transpiler/build tasks required during development - you debug directly the exact same JS/CSS/HTML/Any file you edit in the IDE. Changes made to a file will be immediately reflected upon refreshing the browser (or use [Chrome devtools workspace](https://developer.chrome.com/devtools/docs/workspaces) or similar tool to have the changes live-rerendered without having to refresh the page).** Nowadays it seems that the frontend world is depending too much on tooling especially build tools. Ironically almost all frontend file types (js, css, html) don't need to be compiled during development. Before ES6 modules loader implementations are mature, AMD/RequireJS is still the de facto best self-sufficient module definition and loader available today. 
  * The only build task required for production is the RequireJS r.js optimizer task that's already predefined in `build.js`. Just run `npm run build` and figure out a config-based way to serve the assets from `/build` folder for production.
* Organized folder structure to help you stay sane for organizing and reusing modules/files. Not using the file type folder structure such as `/js`, `/css`, `/html`, `/template`, etc, as files belonging to the same module/component are easier to navigate when grouped together under the same folder. If a part of the app should be removed, in theory you just need to delete the corresponding module/component folder, and touch very few other places.
* All documentation are in the major dependencies' own homepages, so that you don't need to completely learn a new framework (**learn and practice general and reusable frontend development skills, not specific giant framework and tooling skills**):
  * [Knockout](http://knockoutjs.com) (MVVM)
  * [Require](http://requirejs.org) (Module Organizer/Loader/Optimizer)
  * [Director](https://github.com/flatiron/director) (Router)
  * [Sugar](http://sugarjs.com) (Native Objects Utilities)


## Credit

Created by [Cheng Fan](https://github.com/onlyurei)
