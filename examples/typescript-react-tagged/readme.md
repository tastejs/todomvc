# TypeScript & React & Tagged Unions & Readonly TodoMVC Example

## Yet another TypeScript & React Example

Sure, there's already a [TypeScript & React Example](https://github.com/tastejs/todomvc/tree/master/examples/typescript-react)
in the wonderful TodoMVC example space, but there are still many, many, other ways to attack the problem.

This is another one of those ways.

## TypeScript 2.0

Why types?  Compile time error checking is nice, but a good test harness can replace that.  But with types also comes
code completion, which is really nice.  Big red lights shining on your typos really seems to find bugs more efficienctly
than tests.  The more you can prevent problems, the less they can propagate.

Single page applications are now playing with all kinds of global immutable state mechanisms.  
[Flux](http://facebook.github.io/flux), [Redux](http://redux.js.org/), [Relay](http://facebook.github.io/relay/), many others.
It's a good idea.  But rarely a TypeScript friendly idea.

With TypeScript you can roll your own.  Using [Discriminated (or Tagged) Unions](https://github.com/Microsoft/TypeScript/wiki/What's-new-in-TypeScript#tagged-union-types)
and [readonly properties](https://github.com/Microsoft/TypeScript/wiki/What's-new-in-TypeScript#read-only-properties-and-index-signatures) 
you can have all the benefits of TypeScript with no comprimises.  

Add [React](http://facebook.github.io/react/docs/getting-started.html) with it's excellent TypeScript support and you're ready to go.

## What makes Unions so useful

A quick example of a TypeScript Discriminated Unions
```TypeScript
type Action = 
  | { name: "todoAdd", readonly title: string }
  | { name: "toggleAll", readonly checked: boolean }
  | { name: "init" }
...
```

Our application state
```TypeScript
interface AppProps {
  controller(action: Action): void;
  filter: TodoFilter;
...
```

And our controller implementation 
```TypeScript
interface ControllerResult { (s: AppProps): AppProps; }

function controller(action: Action): ControllerResult {
  const a = action;
  switch (a.name) {
    case "filter":
      return funcHelper(s => s.filter = a.filter);
    case "toggleAll":
      return funcHelper(s => s.todos = s.todos.map(x => createToDo(x.id, x.title, a.checked)));
...
```

Yes, this more more simplistic that those big state stacks.  However, there's very little repetition,
type safety, code complete, you control the design.  I've used this structure in several production projects
and hope it will inspire others in their programs. 

## Building

There is no need for a server, we use webpack to make a standalone web example.

Simply type:
```
npm install
npm run build
```

Then look in the ./build directory and view index.html in your favorite browser.

## Testing

Updated some versions and types.

Adjusted to lint rule. Which I profoundly disagree with, tabs bad.  However, it passed the test.



