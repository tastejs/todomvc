# AngularJS Expressions TodoMVC Example

## What?
- Perhaps one of the unusual AngularJS examples out there.
- Literally no JavaScript, apart from 2 tiny helper directives. 
- No controllers!
- Everything is inside HTML done with [Angular Expressions](https://docs.angularjs.org/guide/expression).

## Why?
- I wanted a proof of concept demonstrating the power of Angular Expressions. With some of the recent critics of Angular's apparent shortcummings, Angular's great and powerful parts become sidelined. HTML is the language of the Web, and AngularJS extends its capabilities. 
- Angular's power comes with no overheads of dealing with any external tools. That makes it friendly for beginners and newcomers. At the same time, many modern tools provide support for Angular. 

## Angular Expressions
Angular Expressions is one of those Angular's powerful features.
They can seriously reduce your code and cut down its comlexity.
They have important limitations though, that one should not forget, most notably:

- No control flow loops.
- No function declarations.

However, limitations may not necessarily be a bad thing:

- They force you to think harder about your code architecture, its building pieces aka components, their responsibilities and communications in-between. JavaScript, in contrast, being much powerful language, is tempting to get abused with over-engineered architectures, unnecessary complexity, tight coupling etc. 
- As Angular is attaching a scope hierarchy to your DOM, you are forced to think in terms of components and their scopes and their inheritance. In Angular's early days, that scope inheritance caused some pain, when being over-used with jungles of controllers and their "scope soups". It does, however, shine when used in a single template, where scope properties are instantly visible. For instance, nothing beats in simplicity this fully functional one-liner app: 

```html
<imput ng-model="text">Your typed: {{text}}
```

- Many apparent limitations can be easily overcome as demonstated in this implementation. The `if-then` flow can be easily replaced by the ternary operator `(a ? b : c)` or connecting expressions with `&&` and `||`. Even non-trivial array iterations [can be performed using hidden DOM elements](https://github.com/dmitriz/todomvc/blob/angularjs-expr/examples/angularjs-expr/index.html#L144). Functions and services, even when cannot be used inside Angular Expressions directly, can be separately defined and [injected via dedicated directives](https://github.com/dmitriz/todomvc/blob/angularjs-expr/examples/angularjs-expr/js/directives/todoImportDirective.js).

### A warning
If those ways to overcome the limitations feel like "dirty hacks" or "anti-patterns", it is because they are or can be :-). In no way I want to recommend (over-)using them. My goal here is a mere proof of concept. They look clean and manageable in this simple app. It doesn't mean they will be so in different situations, obviously.

## But aren't Angular Expression hard to test?
Yes and no. They can be perfectly tested with End-to-end tools such as [Protractor](http://angular.github.io/protractor). What does appear harder, are the unit tests e.g. with [Karma runner](http://karma-runner.github.io/0.13/index.html). My feeling though, it is more due to the lack of convenient libraries, then anything more fundamental. All it really needs, is to select an element from your HTML template and `$compile` it against a `scope` to be fully testable. This is really no different than testing Angular Directive. Speaking of which, using directives to encapsulate your more complicated expressions, and testing the directive instead would be a more scalable appoach.
[See more here on the differences between Protractor and Karma](http://stackoverflow.com/a/29619467/1614973).


## Implementation
- The main part of the code by far is contained inside `index.html`, with some extensive in-line comments explaining the main logic. The component architecture is well visible by closely resembling the HTML hierarchy. Since there are no controllers, the only scopes are the main `$rootScope` and the iterator scopes created by `ng-repeat`. All data needed in the outer scope, are stored in the `state` property [ng-inspector](http://ng-inspector.org/). They are used for communication with inner components.
- Comparing to the official implementation, two-way-binding via `ng-model` is sometimes replaced by separate one-way-bindings via `ng-checked` and `ng-click` for fine-grained control.
- Routing is implemented by simply importing Angular's `$location` service via the general purpose `todo-import` directive. This is far from being recommended for large-scale apps, but works just fine for the app of this size.
- Persistent storage is also implemented by importing the storage service directly to the scope. Again, not necessarily recommended for huge apps, but clean and transparent enough to cut down the clutter.
- The `todo-focus` directive is exactly the same as in the [main AngularJS example](https://github.com/tastejs/todomvc/tree/master/examples/angularjs).