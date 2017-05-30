# Subviews

When subview are specified in `@Component`, ngBackbone binds them gracefully on "component-did-update" event.
> Once successfully bound subview object stays untouched, but whenever new nodes coming up within parent view match a subview selector the new view instance gets created and attached to parent `this.views` map
> ngBackbone allows subview selector to match mutiple element. In this case it creates a subview per matched element

We can make our view to create automatically nested views by specifying a list of view constructors:

```javascript
 @Component({
    views: {
      foo: FooView,
      bar: BarView
    }
  })
```
In this case nested view expects `el` view option filled with a selector relative to the parent view.  `View` object calls subview constructors after the first rendering. So it has inner DOM subtree already available and can bind subviews in there.  After subviews instantiated we can find them within `this.view` map of the parent view. If destroy a view with `this.remove()`, it automatically destroys every subview.

When we need passing options to subview constructor, we can use the following syntax:

```javascript
 @Component({
    views: {
      foo: [ FooView, { id: "foo" }],
      bar: [ BarView, { id: "bar" }]
    }
  })
```

Within parent component child ones are available in views map. You can access the instance of a sub-component as `this.views.get( "name" )`. Thus we obtain the control over child component from the parent:

```javascript
@Component({
  el: "ng-hello",
  events: {
    "click [data-bind=toggleFoo]" : "toggleFoo",
    "click [data-bind=toggleBar]" : "toggleBar"
  },
  views: {
    foo: FooView,
    bar: BarView
  },
  template: `
  <button data-bind="toggleFoo">Show Foo</button>
  <button data-bind="toggleBar">Show Bar</button>
  <ng-foo></ng-foo> <ng-bar></ng-bar>`
})

class AppView extends View {
  toggleFoo(){
    this.views.get( "foo" ).toogle();
  }
  toggleBar(){
    this.views.get( "bar" ).toogle();
  }
}
```

And conversely you can communicate from child to parent

```javascript
class FooView extends View {
  toggle(){
   // toggle view
   this.el.classList.toggle( "is-hidden", !this.el.classList.contains( "is-hidden" ) );
   // communicate back to parent
   this.parent.trigger( "my-custom-event" )l
  }
}
```


# Maintaining bindings on parent view change

Let's say we have an imaginary task. We have to create a list where every item has own view. So as for items the example view may look like:
```javascript

  @Component({
    el: "ng-item",
    template: "it's item"
  })
  class ItemView extends View {
    initialize(){
      this.render();
    }
  }
```

The parent (list) view has a bound collection named `items` and a subview named also `items`. AS you remember we expect subview binding to `ng-item` element.

```javascript
  let items = new Collection([ new Model() ]);
  @Component({
    tagName: "ng-list",
    template: "<ng-item data-ng-for=\"let item of items\"></ng-item>",
    collections: {
      items: items
    },
    views: {
      items: ItemView
    }
  })
  class ListView extends View {
    initialize(){
      this.render();
    }
  }
```

Initially the collection has just a single element and on render we have `<ng-list><ng-item>it's item</ng-item></ng-list>`

```javascript
  let list = new ListView();
  list.views.getAll( "foo" ).length; // 1
  list.views.get( "foo" ); // ItemView
```

With method `list.views.getAll( "foo" )` we can access the array of bound ItemView instances. Here it consists of one element.
However let's see what happens if we change the collection:

```javascript
  items.add([ new Model() ]);
  view.on( "component-did-update", () => {
    list.views.getAll( "foo" ).length; // 2
    list.views.get( "foo", 0 ); // ItemView
    list.views.get( "foo", 1 ); // ItemView
    done();
  });
```

The method `list.views.getAll( "foo" )` indicates that we have now 2 subview instances matching `ng-item` element.
We can access a particular instance like `list.views.get( "foo", index )`
