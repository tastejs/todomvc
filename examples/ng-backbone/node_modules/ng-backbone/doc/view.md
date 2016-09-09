# View Module

## Interface

```javascript
interface View extends Backbone.NativeView {

  // bounding element
  el: HTMLElement;
  // models to bind to the template
  models: NgBackbone.ModelMap;
  // collections to bind to the template
  collections: NgBackbone.CollectionMap;
  // array of subviews
  views: ViewMap;
  // instance of NgTemplate
  template: NgTemplate.NgTemplate;
  // constructor options getting available across the prototype
  options?: NgBackbone.ViewOptions;
  // template errors/warnings
  errors?: string[];
  // is this view ever rendered
  didComponentMount: boolean;
  // link to parent view in subview
  parent: NgBackbone.View;

  // constructor accepts extended map of options - see 'View Options' section
  constructor(options?: ngBackbone.ViewOptions);

  // Update the component (normally doesn't require manual invocation)
  render(): View;

  // Helper to subscribing `listenTo` way by a map
  listenToMap( eventEmitter: Backbone.Events, event: ngBackbone.DataMap ): View;

  // Before removing the view calls this method on every subview
  remove(): View;

  // LIFECYCLE METHODS

  // Override this method when you want to plug in straight before bounding el populated from the template
  componentWillMount(): void;

  // Override this method when you want to plug in straight after bounding el populated from the template
  componentDidMount(): void;

  // Override this method when you want to control manually if the template requires an update
  shouldComponentUpdate( nextScope: NgBackbone.DataMap<any> ): boolean;

  // Override this method when you need preparation before an template update occurs
  componentWillUpdate( nextScope: NgBackbone.DataMap<any> ): void;

  // Override this method when you need to operate on the DOM after template update
  componentDidUpdate( prevScope: NgBackbone.DataMap<any> ): void;
}

```
## Events

* `component-will-update` - fires straight before bounding el populated from the template
* `component-did-update` - fires straight after bounding el populated from the template
* `component-will-mount` - fires straight before bounding el populated from the template
* `component-did-mount` - fires straight after bounding el populated from the template


`View` creates an instance of ngTemplate based on specified bounding element and template code. It binds models/collections of the given maps to the template. E.g. models: `{ foo: new Model() }` becomes available in the template scope as `foo`. As soon the model changes (`this.models.get("foo").set("bar", "value")`) the template responds (`foo.bar === "value"`);

```javascript
import { Component, View, Model, Collection } from "ng-backbone";

@Component({
  el: "ng-hero",
  models: {
    hero: new Model({
      "name": "Superman"
    })
  },
  collections: {
    powers: new Collection([
      { name: "Superhuman strength" },
      { name: "Flight" }
      { name: "Freezing breath" }
    ])
  },

  template: `
    <p><strong data-ng-text="hero.title"></strong> has powers:</p>
    <dl data-ng-for="let p of powers">
      <dt data-ng-text="p.name"></dt>
    </dl>
`
})

export class HeroView extends FormView {

  initialize() {
    this.render();
  }

}

```
We can specify collection getters by adding method named as "getCamelCase". When collection has such methods
they are invoked for values during passing data to view template:

```javascript
import { Component, View, Collection } from "ng-backbone";

class PowerCollection extends Collection {
  getSize(){
    return this.length;
  }
  getFavorite(){
    return this.filter(( model: any ) => {
      return model.get( "name" ).startsWith( "F" );
    });
  }
}

@Component({
  el: "ng-hero",

  collections: {
    powers: new PowerCollection([
      { name: "Superhuman strength" },
      { name: "Flight" }
      { name: "Freezing breath" }
    ])
  },

  template: `
    <p><strong data-ng-text="hero.title"></strong> has
      <i data-ng-text="powers.size"></i> powers, use but
      can use only <i data-ng-text="powers.favorite"></i>
    </p>
`
})

export class HeroView extends FormView {

  initialize() {
    this.render();
  }

}

```

* [View Options](./view/options.md)
* [Subviews](./view/subviews.md)
* [Logging Events](./view/logger.md)

