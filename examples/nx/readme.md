# NX • [TodoMVC](http://todomvc.com)

> A next gen client-side framework, built with ES6 and Web Components.

## Learning NX

The [NX website](http://www.nx-framework.com/) is the best way to get started.
It includes lots of editable examples to help you with understanding the framework.

These are some other NX related links:

- [NX on GitHub](https://github.com/RisingStack/nx-framework)
- [NX on Gitter](https://gitter.im/nx-framework/general)
- [NX on Twitter](https://twitter.com/nxframework)
- [Article series about creating NX](https://blog.risingstack.com/writing-a-javascript-framework-project-structuring/)

## Implementation

These are the main differences from other implementations:

- Components are standard [Web Components](http://webcomponents.org/) internally.
- Data binding can be used with plain getters/setters. No computed properties required.
- URL path and query parameter routing is separated. I chose to use parameter routing for this case as it makes more sense.

## Important compatibility note

NX is still in Alpha phase and it doesn't support Safari and IE yet.
Safari support will arrive soon with the release of Safari 10, however IE
support will take some time to achieve.

## Credit

Created by [Bertalan Miklos](https://github.com/solkimicreb)
