# Animations

- [Technology choices](#technology-choices)
- [Animation on element creation](#animation-on-element-creation)
- [Animation on element removal](#animation-on-element-removal)
- [Performance](#performance)

---

### Technology choices

Animations are often used to make applications come alive. Nowadays, browsers have good support for CSS animations, and there are [various](https://greensock.com/gsap) [libraries](https://velocityjs.org/) that provide fast JavaScript-based animations. There's also an upcoming [Web API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API/Using_the_Web_Animations_API) and a [polyfill](https://github.com/web-animations/web-animations-js) if you like living on the bleeding edge.

Mithril does not provide any animation APIs per se, since these other options are more than sufficient to achieve rich, complex animations. Mithril does, however, offer hooks to make life easier in some specific cases where it's traditionally difficult to make animations work.

---

### Animation on element creation

Animating an element via CSS when the element is created couldn't be simpler. Just add an animation to a CSS class normally:

```css
.fancy {animation:fade-in 0.5s;}
@keyframes fade-in {
	from {opacity:0;}
	to {opacity:1;}
}
```

```javascript
var FancyComponent = {
	view: function() {
		return m(".fancy", "Hello world")
	}
}

m.mount(document.body, FancyComponent)
```

---

### Animation on element removal

The problem with animating before removing an element is that we must wait until the animation is complete before we can actually remove the element. Fortunately, Mithril offers the [`onbeforeremove`](lifecycle-methods.md#onbeforeremove) hook that allows us to defer the removal of an element.

Let's create an `exit` animation that fades `opacity` from 1 to 0.

```css
.exit {animation:fade-out 0.5s;}
@keyframes fade-out {
	from {opacity:1;}
	to {opacity:0;}
}
```

Now let's create a contrived component that shows and hides the `FancyComponent` we created in the previous section:

```javascript
var on = true

var Toggler = {
	view: function() {
		return [
			m("button", {onclick: function() {on = !on}}, "Toggle"),
			on ? m(FancyComponent) : null,
		]
	}
}
```

Next, let's modify `FancyComponent` so that it fades out when removed:

```javascript
var FancyComponent = {
	onbeforeremove: function(vnode) {
		vnode.dom.classList.add("exit")
		return new Promise(function(resolve) {
			vnode.dom.addEventListener("animationend", resolve)
		})
	},
	view: function() {
		return m(".fancy", "Hello world")
	}
}
```

`vnode.dom` points to the root DOM element of the component (`<div class="fancy">`). We use the classList API here to add an `exit` class to `<div class="fancy">`.

Then we return a [Promise](promise.md) that resolves when the `animationend` event fires. When we return a promise from `onbeforeremove`, Mithril waits until the promise is resolved and only then it removes the element. In this case, it waits for the exit animation to finish.

We can verify that both the enter and exit animations work by mounting the `Toggler` component:

```javascript
m.mount(document.body, Toggler)
```

Note that the `onbeforeremove` hook only fires on the element that loses its `parentNode` when an element gets detached from the DOM. This behavior is by design and exists to prevent a potential jarring user experience where every conceivable exit animation on the page would run on a route change. If your exit animation is not running, make sure to attach the `onbeforeremove` handler as high up the tree as it makes sense to ensure that your animation code is called.

---

### Performance

When creating animations, it's recommended that you only use the `opacity` and `transform` CSS rules, since these can be hardware-accelerated by modern browsers and yield better performance than animating `top`, `left`, `width`, and `height`.

It's also recommended that you avoid the `box-shadow` rule and selectors like `:nth-child`, since these are also resource intensive options. If you want to animate a `box-shadow`, consider [putting the `box-shadow` rule on a pseudo element, and animate that element's opacity instead](https://tobiasahlin.com/blog/how-to-animate-box-shadow/). Other things that can be expensive include large or dynamically scaled images and overlapping elements with different `position` values (e.g. an absolute positioned element over a fixed element).
