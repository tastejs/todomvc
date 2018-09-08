# jQuery TodoMVC Example

> jQuery is a fast, small, and feature-rich JavaScript library. It makes things like HTML document traversal and manipulation, event handling, animation, and Ajax much simpler with an easy-to-use API that works across a multitude of browsers. With a combination of versatility and extensibility, jQuery has changed the way that millions of people write JavaScript.

> _[jQuery - jquery.com](http://jquery.com)_


## Learning jQuery

The [jQuery website](http://jquery.com) is a great resource for getting started.

Here are some links you may find helpful:

* [Learning Center](http://learn.jquery.com/)
* [API Reference](http://api.jquery.com)
* [Plugins](http://plugins.jquery.com)
* [Browser Support](http://jquery.com/browser-support)
* [Blog](http://blog.jquery.com)

Articles and guides from the community:

* [Try jQuery](http://try.jquery.com)
* [jQuery Annotated Source](http://github.com/robflaherty/jquery-annotated-source)
* [10 Things I Learned From the jQuery Source](http://paulirish.com/2010/10-things-i-learned-from-the-jquery-source)

Get help from other jQuery users:

* [jQuery on StackOverflow](http://stackoverflow.com/questions/tagged/jquery)
* [Forums](http://forum.jquery.com)
* [jQuery on Twitter](http://twitter.com/jquery)
* [jQuery on Google +](https://plus.google.com/102828491884671003608/posts)

_If you have other helpful links to share, or find any of the links above no longer work, please [let us know](https://github.com/tastejs/todomvc/issues)._


----------



# How to Read Source Code

## Why it’s important

1. Most of your time will be spent reading, not writing.
2. Simulates working at a company or open source project.
3. Fastest way to learn.
4. Reading makes you a better writer (just like English).
5. Learn how to ignore large parts of a codebase and get a piece-by-piece understanding.

## Before you start

1. Read the docs (if they exist).
2. Run the code.
3. Play with the app to see what the code is supposed to do.
4. Think about how the code might be implemented.
5. Get the code into an editor.

## The process

1. Look at the file structure.
2. Get a sense for the vocabulary.
3. Keep a note of unfamiliar concepts that you'll need to research later.
4. Do a quick read-through without diving into concepts from #3.
5. Test one feature with the debugger.
6. Document and add comments to confusing areas.
7. Research items in #3 only if required.
8. Repeat.

## Next level

1. Replicate parts of the app by hand (in the console).
2. Make small changes and see what happens.
3. Add a new feature.
4. Unfamiliar concepts

### Unfamiliar Concepts

- [x] jquery .closest() - an element type is passed to the method and it traverses the DOM to find the nearest matching parent element
- [x] jquery .data() - data is passed a label. this method returns the value of that label
- [x] $ - it's a global variable === jQuery
- [x] .target - tells you which DOM element initiated the event
- [x] .val - gets the value of the 1st element in a set of matched elements; often used to get input from a form ie. input, select, form area
- [x] .trim - removes any whitespace at beginning or end of string
- [x] .which - tells you which key was pressed
- [x] ENTER_KEY = a variable saved with all caps is commonly used for global variables
- [x] blur? - if an element is blurred it loses focus
- [x] abort? - the input field has a label called abort with a boolean value. I believe this tells the input to escape any new data changes if the boolean is set to true.
- [x] prop() - gets the value of the property passed to it by the element  ie. check-box.prop("clicked") will get the valued of the clicked property on the check-box element.
- [ ] what are bind events?
- [ ] what's a keyup?
- [ ] what is bind?
- [ ] pipe |
- [ ] ? in an evaluation
- [ ] & in an evaluation
- [ ] .toString(16) - what does the 16 mean?


- [ ] what is util?
- [ ] what is local storage?
- [ ] what is the role of base.js
- [ ] what is the role of director.js
- [ ] handlebars
- [ ] uuid
- [ ] pluralize
- [ ] JSON

#### Questions

- [ ] confirm !val within the if statement of the create method - I believe it means to accept more input as long as the current key is still not being pressed
- [ ] what does the | mean?
