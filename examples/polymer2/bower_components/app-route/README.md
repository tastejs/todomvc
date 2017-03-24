
<!---

This README is automatically generated from the comments in these files:
app-location.html  app-route-converter-behavior.html  app-route-converter.html  app-route.html

Edit those files, and our readme bot will duplicate them over here!
Edit this file, and the bot will squash your changes :)

The bot does some handling of markdown. Please file a bug if it does the wrong
thing! https://github.com/PolymerLabs/tedium/issues

-->

[![Build status](https://travis-ci.org/PolymerElements/app-route.svg?branch=master)](https://travis-ci.org/PolymerElements/app-route)


##&lt;app-route&gt;

`app-route` is an element that enables declarative, self-describing routing
for a web app.

> *n.b. app-route is still in beta. We expect it will need some changes. We're counting on your feedback!*

In its typical usage, a `app-route` element consumes an object that describes
some state about the current route, via the `route` property. It then parses
that state using the `pattern` property, and produces two artifacts: some `data`
related to the `route`, and a `tail` that contains the rest of the `route` that
did not match.

Here is a basic example, when used with `app-location`:

```html
<app-location route="{{route}}"></app-location>
<app-route
    route="{{route}}"
    pattern="/:page"
    data="{{data}}"
    tail="{{tail}}">
</app-route>
```

In the above example, the `app-location` produces a `route` value. Then, the
`route.path` property is matched by comparing it to the `pattern` property. If
the `pattern` property matches `route.path`, the `app-route` will set or update
its `data` property with an object whose properties correspond to the parameters
in `pattern`. So, in the above example, if `route.path` was `'/about'`, the value
of `data` would be `{"page": "about"}`.

The `tail` property represents the remaining part of the route state after the
`pattern` has been applied to a matching `route`.

Here is another example, where `tail` is used:

```html
<app-location route="{{route}}"></app-location>
<app-route
    route="{{route}}"
    pattern="/:page"
    data="{{routeData}}"
    tail="{{subroute}}">
</app-route>
<app-route
    route="{{subroute}}"
    pattern="/:id"
    data="{{subrouteData}}">
</app-route>
```

In the above example, there are two `app-route` elements. The first
`app-route` consumes a `route`. When the `route` is matched, the first
`app-route` also produces `routeData` from its `data`, and `subroute` from
its `tail`. The second `app-route` consumes the `subroute`, and when it
matches, it produces an object called `subrouteData` from its `data`.

So, when `route.path` is `'/about'`, the `routeData` object will look like
this: `{ page: 'about' }`

And `subrouteData` will be null. However, if `route.path` changes to
`'/article/123'`, the `routeData` object will look like this:
`{ page: 'article' }`

And the `subrouteData` will look like this: `{ id: '123' }`

`app-route` is responsive to bi-directional changes to the `data` objects
they produce. So, if `routeData.page` changed from `'article'` to `'about'`,
the `app-route` will update `route.path`. This in-turn will update the
`app-location`, and cause the global location bar to change its value.



##&lt;app-location&gt;

`app-location` is an element that provides synchronization between the
browser location bar and the state of an app. When created, `app-location`
elements will automatically watch the global location for changes. As changes
occur, `app-location` produces and updates an object called `route`. This
`route` object is suitable for passing into a `app-route`, and other similar
elements.

An example of the public API of a route object that describes the URL
`https://elements.polymer-project.org/elements/app-location`:

```css
{
  prefix: '',
  path: '/elements/app-location'
}
```

Example Usage:

```html
<app-location route="{{route}}"></app-location>
<app-route route="{{route}}" pattern="/:page" data="{{data}}"></app-route>
```

As you can see above, the `app-location` element produces a `route` and that
property is then bound into the `app-route` element. The bindings are two-
directional, so when changes to the `route` object occur within `app-route`,
they automatically reflect back to the global location.

### Hashes vs Paths

By default `app-location` routes using the pathname portion of the URL. This has
broad browser support but it does require cooperation of the backend server. An
`app-location` can be configured to use the hash part of a URL instead using
the `use-hash-as-path` attribute, like so:

```html
<app-location route="{{route}}" use-hash-as-path></app-location>
```

### Integrating with other routing code

There is no standard event that is fired when window.location is modified.
`app-location` fires a `location-changed` event on `window` when it updates the
location. It also listens for that same event, and re-reads the URL when it's
fired. This makes it very easy to interop with other routing code.

So for example if you want to navigate to `/new_path` imperatively you could
call `window.location.pushState` or `window.location.replaceState` followed by
firing a `location-changed` event on `window`. i.e.

```javascript
window.history.pushState({}, null, '/new_path');
window.dispatchEvent(new CustomEvent('location-changed'));
```



##&lt;app-route-converter&gt;

`app-route-converter` provides a means to convert a path and query
parameters into a route object and vice versa. This produced route object
is to be fed into route-consuming elements such as `app-route`.

> n.b. This element is intended to be a primitive of the routing system and for
creating bespoke routing solutions from scratch. To simply include routing in
an app, please refer to [app-location](https://github.com/PolymerElements/app-route/blob/master/app-location.html)
and [app-route](https://github.com/PolymerElements/app-route/blob/master/app-route.html).

An example of a route object that describes
`https://elements.polymer-project.org/elements/app-route-converter?foo=bar&baz=qux`
and should be passed to other `app-route` elements:

```css
{
  prefix: '',
  path: '/elements/app-route-converter',
  __queryParams: {
    foo: 'bar',
    baz: 'qux'
  }
}
```

`__queryParams` is private to discourage directly data-binding to it. This is so
that routing elements like `app-route` can intermediate changes to the query
params and choose whether to propagate them upstream or not. `app-route` for
example will not propagate changes to its `queryParams` property if it is not
currently active. A public queryParams object will also be produced in which you
should perform data-binding operations.

Example Usage:

```html
<iron-location path="{{path}}" query="{{query}}"></iron-location>
<iron-query-params
    params-string="{{query}}"
    params-object="{{queryParams}}">
</iron-query-params>
<app-route-converter
    path="{{path}}"
    query-params="{{queryParams}}"
    route="{{route}}">
</app-route-converter>
<app-route route='{{route}}' pattern='/:page' data='{{data}}'>
</app-route>
```

This is a simplified implementation of the `app-location` element. Here the
`iron-location` produces a path and a query, the `iron-query-params` consumes
the query and produces a queryParams object, and the `app-route-converter`
consumes the path and the query params and converts it into a route which is in
turn is consumed by the `app-route`.



##Polymer.AppRouteConverterBehavior

Provides bidirectional mapping between `path` and `queryParams` and a
app-route compatible `route` object.

For more information, see the docs for `app-route-converter`.


