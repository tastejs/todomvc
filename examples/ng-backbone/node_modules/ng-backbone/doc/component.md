# @Component Decorator

## Interface
```javascript
@Component({

  // Backbone view options
  el?: any,
  events?: Backbone.EventsHash,
  id?: string,
  className?: string,
  tagName?: string,

  // ngBackbone options
  template: string; // string that compiles to the template
  models?: Models | {}; // a map of all models that we bind to template scope
  collections?: Collections | {}; // a map of all collections that we bind to template scope
  views?: Views; // constructors for nested views
  formValidators?: { [key: string]: Function; } | FormValidators; //
});
```

`View` gets nicely along with `@Component` decorator (like in Angular 2). `@Component` overtakes the declarative part of the view.
Actually it  injects the specified properties into the `View.prototype`.

## Example 1
Here we pass though `@Component` Backbone view options

```javascript
import { Component, View } from "../ng-backbone/core";

@Component({
  el: "ng-hello",
  template: `Hello World!`
})

class HelloView extends View {
}

let hello = new HelloView();
hello.render();
```

## Example 2
In the example below we bind a collection to the component under the name of `worlds`

```javascript
import { Component, View, Model, Collection } from "../ng-backbone/core";

@Component({
  el: "ng-hello",
  collections: {
    worlds: new Collection([
      new Model({ name: "Post-Crisis Earth" }),
      new Model({ name: "Red Son" }),
      new Model({ name: "The Fourth World" }),
      new Model({ name: "The Dakotaverse" })
    ])
  },
  template: `<h1 data-ng-for="let world of worlds">
    Hello <i data-ng-text="world.name"></i>!
  </h1>
  `
})

class HelloView extends View {
}

let hello = new HelloView();
hello.render();

```