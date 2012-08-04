# Batman TodoMVC app

A todo app built using [Batman](http://batmanjs.org)


## Run

Spin up an HTTP server and visit http://localhost/labs/architecture-examples/batman/


## Persistence

A quick note: This app uses `Batman.LocalStorage` to persist the Todo records across page reloads. Batman's `localStorage` engine sticks each record under it's own key in `localStorage`, which is a departure from the TodoMVC application specification, which asks that all the records are stored under one key as a big blob. Batman stores records this way so that the whole set doesn't need to be parsed just to find one record or check if that record exists.


## Build

This app is written in CoffeeScript, so to make changes, please edit `js/app.coffee` and rebuild the JavaScript with the `coffee` compiler.
