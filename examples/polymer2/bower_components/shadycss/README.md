# ShadyCSS

ShadyCSS provides a library to simulate ShadowDOM style encapsulation (ScopingShim), a shim for the proposed CSS mixin `@apply` styntax (ApplyShim), and a library to integrate document-level stylesheets with both of the former libraries (CustomStyleInterface).

## Requirements
ShadyCSS requires support for the `<template>` element, ShadowDOM, MutationObserver, Promise, and Object.assign

## Loading

ShadyCSS can be used by loading the ScopingShim, ApplyShim, CustomStyleInterface, or any combination of those.

The most-supported loading order is:
1. ScopingShim
1. ApplyShim
1. CustomStyleInterface

All libraries will expose an object on `window` named `ShadyCSS` with the following interface:

```js
ShadyCSS = {
  prepareTemplate(templateElement, elementName, elementExtension){},
  styleElement(element){},
  styleSubtree(element, overrideProperties){},
  styleDocument(overrideProperties){},
  getComputedStyleValue(element, propertyName){
    return // style value for property name on element
  },
  nativeCss: Boolean,
  nativeShadow: Boolean
}
```

## About ScopingShim

ScopingShim provides simulated ShadyDOM style encapsulation, and a shim for CSS Custom Properties.

ScopingShim works by rewriting style contents and transforming selectors to enforce scoping.
Additionally, if CSS Custom Properties is not detected, ScopingShim will replace CSS Custom Property usage with realized values.

### Example:
Here's an example of a custom element when Scoping Shim is not needed.

```html
<my-element>
  <!-- shadow-root -->
  <style>
  :host {
    display: block;
  }
  #container slot::slotted(*) {
    color: gray;
  }
  #foo {
    color: black;
  }
  </style>
  <div id="foo">Shadow</div>
  <div id="container">
    <slot>
      <!-- span distributed here -->
    </slot>
  </div>
  <!-- /shadow-root -->
  <span>Light</span>
</my-element>
```

becomes:

```html
<style scope="my-element">
my-element {
  display: block;
}
#container.my-element > * {
  color: gray;
}
#foo.my-element {
  color: black;
}
</style>
<my-element>
<div id="foo">Shadow</div>
<div id="container">
  <span>Light</span>
</div>
</my-element>
```

## About ApplyShim

ApplyShim provides a shim for the `@apply` syntax proposed at https://tabatkins.github.io/specs/css-apply-rule/, which expands the definition CSS Custom Properties to include objects that can be applied as a block.

This is done by transforming the block definition into a set of CSS Custom Properties, and replacing uses of `@apply` with consumption of those custom properties.

### Example:

Here we define a block called `--mixin` at the document level, and apply that block to `my-element` somewhere in the page.

```css
html {
  --mixin: {
    border: 2px solid black;
    background-color: green;
  }
}

my-element {
  border: 1px dotted orange;
  @apply --mixin;
}
```

becomes:

```css
html {
  --mixin_-_border: 2px solid black;
  --mixin_-_background-color: green;
}

my-element {
  border: var(--mixin_-_border, 1px dotted orange);
  background-color: var(--mixin_-_background-color);
}
```

## About CustomStyleInterface

CustomStyleInterface provides API to process `<style>` elements that are not inside of
ShadowRoots, and simulate upper-boundary style scoping for ShadyDOM.

To add document-level styles to ShadyCSS, one can call `CustomStyleInterface.addCustomStyle(styleElement)` or `CustomStyleInterface.addCustomStyle({getStyle: () => styleElement})`

An example usage of the document-level styling api can be found in `examples/document-style-lib.js`, and another example that uses a custom element wrapper can be found in `examples/custom-style-element.js`

### Example:

```html
<style class="document-style">
html {
  --content-color: brown;
}
</style>
<my-element>This text will be brown!</my-element>
<script>
CustomStyleInterface.addCustomStyle(document.querySelector('style.document-style'));
</script>
```

Another example with a wrapper `<custom-style>` element

```html
<custom-style>
  <style>
  html {
    --content-color: brown;
  }
  </style>
</custom-style>
<script>
class CustomStyle extends HTMLElement {
  constructor() {
    CustomStyleInterface.addCustomStyle(this);
  }
  getStyle() {
    return this.querySelector('style');
  }
}
</script>
<my-element>This this text will be brown!</my-element>
```

Another example with a function that produces style elements

```html
<my-element>This this text will be brown!</my-element>
<script>
CustomStyleInterface.addCustomStyle({
  getStyle() {
    const s = document.createElement('style');
    s.textContent = 'html{ --content-color: brown }';
    return s;
  }
});
</script>
```

## Usage

To use ShadyCSS:

1. First, call `ShadyCSS.prepareTemplate(template, name)` on a
`<template>` element that will be imported into a `shadowRoot`.

2. When the element instance is connected, call `ShadyCSS.styleElement(element)`

3. Create and stamp the element's shadowRoot

4. Whenever dynamic updates are required, call `ShadyCSS.styleSubtree(element)`.

5. If a styling change is made that may affect the whole document, call
`ShadyCSS.styleDocument()`.

The following example uses ShadyCSS and ShadyDOM to define a custom element.

```html
<template id="myElementTemplate">
  <style>
    :host {
      display: block;
      padding: 8px;
    }

    #content {
      background-color: var(--content-color);
    }

    .slot-container ::slotted(*) {
      border: 1px solid steelblue;
      margin: 4px;
    }
  </style>
  <div id="content">Content</div>
  <div class="slot-container">
    <slot></slot>
  </div>
</template>
<script>
  ShadyCSS.prepareTemplate(myElementTemplate, 'my-element');
  class MyElement extends HTMLElement {
    connectedCallback() {
      ShadyCSS.styleElement(this);
      if (!this.shadowRoot) {
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(
          document.importNode(myElementTemplate.content, true));
      }
    }
  }

  customElements.define('my-element', MyElement);
</script>
```

## Type Extension elements

ShadyCSS can also be used with type extension elements by supplying the base
element name to `prepareTemplate` as a third argument.

### Example

```html
<template id="myElementTemplate">
  <style>
    :host {
      display: block;
      padding: 8px;
    }

    #content {
      background-color: var(--content-color);
    }

    .slot-container ::slotted(*) {
      border: 1px solid steelblue;
      margin: 4px;
    }
  </style>
  <div id="content">Content</div>
  <div class="slot-container">
    <slot></slot>
  </div>
</template>
<script>
  ShadyCSS.prepareTemplate(myElementTemplate, 'my-element', 'div');
  class MyElement extends HTMLDivElement {
    connectedCallback() {
      ShadyCSS.styleElement(this);
      if (!this.shadowRoot) {
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(
          document.importNode(myElementTemplate.content, true));
      }
    }
  }

  customElements.define('my-element', MyElement, {extends: 'div'});
</script>
```

## Imperative values for Custom properties

To set the value of a CSS Custom Property imperatively, `ShadyCSS.styleSubtree`
and `ShadyCSS.styleDocument` support an additional argument of an object mapping
variable name to value.

When using ApplyShim, defining new mixins or new values for current mixins imperatively is not
supported.

### Example
```html
<my-element id="a">Text</my-element>
<my-element>Text</my-element>
<script>
let el = document.querySelector('my-element#a');
// Set the color of all my-element instances to 'green'
ShadyCSS.styleDocument({'--content-color' : 'green'});
// Set the color my-element#a's text to 'red'
ShadyCSS.styleSubtree(el, {'--content-color' : 'red'});
</script>
```

## Limitations

### Selector scoping

You must have a selector to the left of the `::slotted`
pseudo-element.

### Custom properties and `@apply`

Dynamic changes are not automatically applied. If elements change such that they
conditionally match selectors they did not previously, `ShadyCSS.styleDocument()`
must be called.

For a given element's shadowRoot, only 1 value is allowed per custom properties.
Properties cannot change from parent to child as they can under native custom
properties; they can only change when a shadowRoot boundary is crossed.

To receive a custom property, an element must directly match a selector that
defines the property in its host's stylesheet.

### `<custom-style>` Flash of unstyled content

If `ShadyCss.applyStyle` is never called, `<custom-style>` elements will process
after HTML Imports have loaded, after the document loads, or after the next paint.
This means that there may be a flash of unstyled content on the first load.

### Mixins do not cascade throught `<slot>`

Crawling the DOM and updating styles is very expensive, and we found that trying to
update mixins through `<slot>` insertion points to be too expensive to justify for both
polyfilled CSS Mixins and polyfilled CSS Custom Properties.