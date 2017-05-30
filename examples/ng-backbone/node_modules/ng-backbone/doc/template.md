
# Template Syntax

[ngTemplate](https://github.com/dsheiko/ng-template) is a light-weight DOM-based template engine, inspired by AngularJS.


## Template expressions

Template expressions are a JavaScript code that `NgTempplate` evaluates in the data scope (models/collections). So we can simply address a variable `<i data-ng-text="world.name"></i>` or run an expression  `<i data-ng-if="world.counter > 10"></i>`

Expressions evaluate in the context of the target element, so we can access the element with `this`:
```
data-ng-if="foo && this.checked"
```

> :exclamation: NOTE: In order to gain better performance keep to primitive expressions especially in cyclic directives e.g. `data-ng-text="foo.bar.baz"`,
> `data-ng-text="!foo.bar.baz"`, `data-ng-text="'string here'"`, `data-ng-if="foo.bar > baz.quiz"`, `data-ng-text="foo + 10`,
> `data-ng-if="true"`, `data-ng-prop="'disabled', true || false"`, `data-ng-data="foo || bar, baz"`.
> Such expressions are being evaluated without use of `eval()` and therefore the process takes much less time and resources.
> You can check how the parser treats your expressions by studying content of `template.report().tokens` array


## Directives
We use HTML-compliant `data-ng-*` custom attributes to tell the template how exactly we want to bind the scope data to the element

### NgText

We use `NgText` to modify element's `textNode`

```html
<i data-ng-text="foo"></i>
```


### NgProp

We use `NgProp` to modify element's properties

```html
<button data-ng-prop="'disabled', isDisabled"></button>
```

### NgAttr

We use `NgAttr` to modify element's attributes

```html
<input data-ng-prop="'required', isRequired">
```


### NgData

We use `NgData` to modify element's dataset

```html
<div data-ng-data="'dateOfBirth', value"></div>
```


### NgClass

We use `NgClass` to modify element's `classList`

```html
<i data-ng-class="'is-hidden', isHidden"></i>
```


### NgIf

We use `NgFor` to toggle visibility of an element (subtree) within the DOM

```html
<i data-ng-if="toggle">Hello!</i>
```


### NgFor

We use `NgFor` when we need to generate a list of elements (subtrees)

```html
<i data-ng-for="let row of rows" data-ng-text="row"></i>
```


### NgSwitch

We use `NgSwitch` when we need to display on element (subtree) of a set of available options.

```html
<div data-ng-switch="theCase">
    <i data-ng-switch-case="1">FOO</i>
    <i data-ng-switch-case="2">BAR</i>
    <i data-ng-switch-case-default>BAZ</i>
  </div>
```


### NgEl

We use `NgEl` to modify element properties

> NOTE: Using `NgEl` is rather discouraging as it cannot be cached and every model sync will
cause the DOM modification even if the expression of `NgEl` wasn't changed

```html
<i data-ng-el="this.textNode = mymodel.foo"></i>
<i data-ng-el="this.setAttribute( 'name', mymodel.foo )"></i>
<i data-ng-el="this.disabled = state.isVisible"></i>
<i data-ng-el="this.classList.toggle('name', model.foo)"></i>
```