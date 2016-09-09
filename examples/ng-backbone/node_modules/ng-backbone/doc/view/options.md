# View Options

## Interface
```javascript
interface ngBackbone.ViewOptions extends Backbone.ViewOptions<Backbone.Model> {
  models?: Models | {}; // injected shared model map
  collections?: Collections | {}; // injected shared collection map
  formValidators?: { [key: string]: Function; }; // form validator map
  logger?: LoggerOption; // subscribe for logging events
  views?: Views; // constructors for nested views
}
```

As you can see from the `ViewOptions` interface, we can create once option/model map and pass it into view. It makes possible to have shared models and collections across the views. When any of shared model/collection changes, all the related views synchronize:

```javascript
let heroes = new HeroCollection();

new HeroView({ collections: { heroes: heroes } });
new HeroListView({ collections: { heroes: heroes } });
```

