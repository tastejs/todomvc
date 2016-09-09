# ngBackbone 1.0 RC3

[![NPM](https://nodei.co/npm/ng-backbone.png)](https://nodei.co/npm/ng-backbone/)

[![Build Status](https://travis-ci.org/dsheiko/ng-backbone.png)](https://travis-ci.org/dsheiko/ng-backbone)
[![Join the chat at https://gitter.im/dsheiko/ng-backbone](https://badges.gitter.im/dsheiko/ng-backbone.svg)](https://gitter.im/dsheiko/ng-backbone?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)


`ngBackbone` is a small extension of [Backbone.js](http://backbonejs.org/) that unlocks Angular-like programming experience

Well, I love old good Backbone for its simplicity and flexibility. However after working with such frameworks as Angular and React, I see that Backbone app requires much more code. Yet I don't want to ditch Backbone and deal with some 20K LOC framework codebase. I just want a minimal modular extension that will improve my programming experience and maintainability of my code.
And that is how I came up with `ngBackbone`

<a href="https://www.gitbook.com/book/dsheiko/ng-backbone/"><img src="./doc/ng-backbone-book.png" alt="Read ngBackbone.Book" /></a>

## Motivation
* Angular inspired live templates via [ngTemplate](https://github.com/dsheiko/ng-template)
* Separation of declarative (@Component + template) and imperative programming
* [1-way](https://dsheiko.gitbooks.io/ng-backbone/content/data_binding.html) and [2-way](https://dsheiko.gitbooks.io/ng-backbone/content/formview.html) binding
* [Testable views](https://dsheiko.gitbooks.io/ng-backbone/content/testing_components.html)
* [Control over nested views](https://dsheiko.gitbooks.io/ng-backbone/content/nesting_components.html)
* [Asynchronous form validators](https://dsheiko.gitbooks.io/ng-backbone/content/formview.html) (e.g. server-side validation)
* Debauncable form validators
* Fluent TypeScript programming experience


## What does it do?

`ngBackbone` extends the base with:

* @Component decorator encapsulates declarative from imperative part of the view
* View module binds specified models/collections to the view template (makes the template reacting on data events)
* FormView creates state models for controls per a specified group and binds them to input/change event. FormView keeps these models in sync with [element ValidityState](https://www.w3.org/TR/html5/forms.html#the-constraint-validation-api) and can run custom validators on input events.


`Ng.Backbone` does not depend on jQuery or Underscore, meaning you can use on an optimized build of Backbone. For example,
my preferred  build consists of [Exoskeleton](https://github.com/paulmillr/exoskeleton) (Backbone decoupled from Underscore), [Backbone.NativeView](https://github.com/akre54/Backbone.NativeView) (Backbone View decoupled from jQuery) and
[Backbone.Fetch](https://github.com/akre54/Backbone.Fetch) (Backbone.sync leveraging Feth API instead of XHR)
Though `Ng.Backbone` works fine with canonical Backbone bundle (Backbone + jQuery + Underscore)

* [Live Demo](https://dsheiko.github.io/ng-backbone/demo.html)

## What does it look like?


```javascript
import { Component, FormView } from "backbone-ng/core";
import { HeroPowers } from "./Collection/HeroPowers";

@Component({
  el: "ng-hero",
  events: {
    "submit form": "onSubmitForm"
  },
  collections: {
    powers: new HeroPowers()
  },
  template: `
    <form data-ng-group="hero" novalidate>
      <div class="form-group">
        <label for="name">Name</label>
        <input id="name" name="name" type="text" class="form-control" required >
        <div class="alert alert-danger" data-ng-if="hero.name.valueMissing">
          Name is required
        </div>
      </div>
      <div class="form-group">
        <label for="power">Hero Power</label>
        <select id="power" name="power" class="form-control" pattern=".{2}">
          <option data-ng-for="let p of powers" data-ng-text="p.name" >Nothing here</option>
        </select>
        <div class="alert alert-danger" data-ng-if="hero.power.dirty && !hero.power.valid">
          Power is required
        </div>
      </div>
       <button type="submit" class="btn btn-default" data-ng-prop="'disabled', !hero.group.valid">Submit</button>\n\
    </form>
`
})

export class HeroView extends FormView {
  el: HTMLElement;
  models: ngBackbone.ModelMap;

  initialize() {
    this.models.get( "powers" ).fetch();
    this.render();
  }

  onSubmitForm( e:Event ){
    e.preventDefault();
    alert( "Form submitted" )
  }

}

```

# How to

* [Getting Started](./doc/getting-started.md)
* [Template syntax](./doc/template.md)
* [@Component Decorator](./doc/view.md)
* [View Module](./doc/view.md)
  * [View Options](./doc/view/options.md)
  * [Subviews](./doc/view/subviews.md)
  * [Logging Events](./doc/view/logger.md)
* [FormView Module](./doc/formview.md)


## Contributing

`ngBackbone` welcomes maintainers. There is plenty of work to do. No big commitment required,
if all you do is review a single Pull Request, you are a maintainer.


### How to set up

```
npm install
```


### How to run tests

```
npm run test
```