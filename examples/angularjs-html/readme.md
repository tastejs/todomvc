# AngularJS HTML Only TodoMVC Example

## What?
- Perhaps one of the unusual AngularJS examples out there.
- Literally no JavaScript, apart from 2 tiny helper directives. 
- No controllers!
- Everything is inside HTML done with [Angular Expressions](https://docs.angularjs.org/guide/expression).

## Why?
- I wanted a proof of concept demonstrating the power of Angular Expressions. With some of the recent critics of Angular's apparent shortcommings, Angular's great and powerful parts become sidelined. HTML is the language of the Web, and AngularJS extends its capabilities.
- HTML files with maximum preserved structure may look friendlier to a designer or maintainer who just wants to make few text/style changes without getting deep into the code.
- The code can be smaller and faster to prototype.
- HTML can be a more natural place to put some logic, side-by-side with HTML-native accessibility and fallback support.

> It is very tempting to do everything in JavaScript, but it is not needed.
> When everything else fails, HTML is the thing users get - let's not deprive them of that.

> _[Chris Heilmann, The principles of a vanilla web diet](http://vanillawebdiet.com/)_

## Angular Expressions
Angular Expressions is one of those Angular's powerful features.
They can seriously reduce your code and cut down its complexity.
They have important **limitations** though, that one should not forget, most notably:

- No control flow loops.
- No function declarations.

However, limitations may not necessarily be a bad thing:

- They force you to think harder about your code architecture, its building pieces aka components, their responsibilities and communications in-between. JavaScript, in contrast, being much more powerful language, is tempting to get abused with over-engineered architectures, unnecessary complexity, tight coupling etc. 
- As Angular is attaching a scope hierarchy to your DOM, you are forced to think in terms of components and their scopes and their inheritance. In Angular's early days, that scope inheritance caused some pain, when being over-used with jungles of controllers and their ["scope soups"](http://www.technofattie.com/2014/03/21/five-guidelines-for-avoiding-scope-soup-in-angular.html). It does, however, shine when used in a single template, where scope properties are instantly visible. For instance, nothing beats in simplicity this fully functional one-liner app: 

```html
<imput ng-model="text">Your typed: {{text}}
```

- Many apparent limitations can be easily overcome as demonstated in this implementation. The `if-then` flow can be easily replaced by the ternary operator `(a ? b : c)` or connecting expressions with `&&` and `||`. Even non-trivial array iterations can be performed using hidden DOM elements (see `index.html`). Functions and services, even if cannot be used inside Angular Expressions directly, can be separately defined and injected via dedicated directives as implemented here.

### A warning
If these ways mentioned here to overcome the limitations feel like "dirty hacks" or "anti-patterns", it is because they are or can be :-). In no way I want to recommend (over-)using them. My goal here is a mere proof of concept. They look reasonably clean and manageable in this simple app. They may not in different situations, obviously. Being "hacky" and harder to implement, they don't get you into temptation to over-use them, which is a good thing. ;-)

## But aren't AngularJS Expressions hard to test?
Yes and no. They can be perfectly tested with End-to-end tools such as [Protractor](http://angular.github.io/protractor). What does appear harder, are the unit tests e.g. with [Karma runner](http://karma-runner.github.io/0.13/index.html). My feeling though, it is more due to the lack of convenient libraries, then anything more fundamental. All it really needs, is to select an element from your HTML template and `$compile` it against a `scope` to be fully testable. This is really no different than testing Angular Directives. Speaking of which, using directives to encapsulate your more complicated expressions, and testing the directive instead would be a more scalable appoach.
[See more here on the differences between Protractor and Karma](http://stackoverflow.com/a/29619467/1614973).

## Implementation
- The main logic is all inside `index.html`, see in-line comments for explanations. The component architecture is implicit resembling the HTML tree hierarchy. Since there are no controllers, the only scopes are the main `$rootScope` and the iterator child scopes created by `ng-repeat`. 
- All data needed in the outer scope, are stored in the `state` property, and can be conveniently viewed e.g. by the great [ng-inspector](http://ng-inspector.org/) Chrome extension. They are used for communication with inner components.
- Comparing to the official implementation, two-way-binding via `ng-model` is in parts replaced by separate one-way-bindings via `ng-checked` and `ng-click` for better fine-grained control.
- Routing is implemented by simply importing Angular's `$location` service via the general purpose `todo-import` directive. This is far from being recommended for large-scale apps, but works just fine for the app of this size.
- Persistent storage is also implemented by importing the storage service `todoStorage` directly into the scope. Again, not necessarily recommended for huge apps, but clean and transparent enough to cut down the clutter. In more serious apps you would inject the same services into other Angular Components (controllers, services, directives, filters etc.).

## AngularJS Scope best practices
Angular scope inheritance had been criticised for its apparent unpredictability. Yet it closely resembles JavaScript's own prototypical inheritance (which also has been criticised, so nothing new here :-).

When you have nested functions in JavaScript and write `var myNewVariable`, you have to pay attention to which function's scope you are using. If you need to access a higher parent scope, you use an object container sitting in that scope. With Angular's scope, it is exactly the same!

What does make it appear hard in Angular, is that additinal child scopes can be created without you noticing that. Then your variable may get caught inside the wrong scope. It is like placing a closure function around a code block.

What to do about it? Expect this and don't write a fragile breakable code in first place. Put every variable in proper containers, then it won't matter. Follow the (in)famous "dot rule":

- Use variables with dots inside Angular expressions.

To demonstrate this, inside `index.html`, I have added `header` container to this parent element:

```html
<header id="header" ng-init="header = {}">
```
Then inside header I can write `ng-model="header.todoTitle"`. However, in reality, there is no child scope for the header, so the `header` object ends up sitting on the `$rootScope`. So what? The behavior is exactly the same, and moreover, it will survive any code modifications adding new scopes above the header. 

But ... `$rootScope` ... hm ... isn't it leaky? It surely is, and to "protect" your `header` container from "outside invasions", all you need is to wrap into into a ~~wall~~ scope-creating directive. 

Finally in doubt what scopes are there - [ng-inspector](http://ng-inspector.org/) is your friend!

## AngularJS Resources
See the [main official example](https://github.com/tastejs/todomvc/tree/master/examples/angularjs).
