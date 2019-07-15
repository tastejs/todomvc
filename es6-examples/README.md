# Converting the TODO apps over to ES6

These are two examples that convert React and Backbone over to ES6.

These are not production ready examples and may also include some minor bugs.  They are only intended to be looked at as examples more than anything else.

Finally, these are _not_ *complete* todo app examples.  Rather, they are only partial examples.  This was done intentionally for the following reasons:
1. Allows developers to see how this type of thinking can be done (via creating simple, unsound solutions first - and _then_ creating a more solid architectural solution _after_)
2. Allows developers to attempt to get hands on experience actually attempting to solve the problems and write the code themselves - which encourages stronger learning techniques
3. Forces the developers to switch back to the framework, understand what it is doing, and then attempt to decypher and re-create it using ES6!

Share the wealth, and share your solutions!

## Evolving JS: from(Frameworks) => Pattern Adoption

This code originated from a presentation to the Indy JS Meetup on July 17, 2019.

It is understood that developers can't be expected to just say "no more frameworks - imma use their patterns".  Instead, the recommendation (which was covered in this talk) is to follow a simple set of rules:

1. Develop an understanding of frameworks *first*!
2. Get to know the patterns found in these frameworks
3. Start diving into and understanding ES6+ and what is available to you
4. When you're ready, start with attempting to recreate some logic in the framework using only Native JS
5. If the framework follows a pattern, try to recreate it on your own - *without* the framework.  For example:
	- a great start is to try recreating the Flux pattern in React
	- check out [Dan Abramov's Redux videos](https://egghead.io/courses/getting-started-with-redux) - he walks you through how to do exactly this!
6. Keep it Simple at first!
	- Remember, repetition is *good* and helps identify your *own* patterns that you need for the application
	- You shouldn't try to condense repetition until you're satisfied with the build - but go for it if that's what you absolutely _have_ to do =P  its your codebase after all..

Its as simple as that and is the basis for how this repo's source code works.

## Simple Guide to Applying Intentional Repetition
To help you understand what we mean by `repetition is good` (above), here is a short, simple rules that will help guide your way to understanding how to do this effectively:

1. **Don't** try to make big, architectural decisions up front
2. Pick something to solve, like:
	- Attach a `click` Event Handler to some elements
	- `fetch` some data from a route
3. copy/paste all the things that you will do over and over (repetition is *good* remember?)
4. refactor when any of the following are true:
	- your code begins to get complicated (don't mistake this for *big*)
	- you have finished solving the issue (there is nothing else left to do)
5. It becomes painful to maintain multiple repetitions of the logic

Following the above rules will actually result in the following outcomes:
1. The line number count in your files will be large
2. It will work but it could be done better
3. The structure of your code will be hard to read and follow

Note that the above is ok!!  We did this intentionally!  At this stage, we should be able to realize the following:
- The code feels like it is talking to us - almost screaming at us - that something needs to be done
- When refactoring the repetitions - it should be very easy and clear to not only see how it is used in 1 file, but all files!
- Once you refactor out the repetitions into reusable libraries/methods - you should be left with a decision:
  - a library is needed
  - a simple, reusable method is all that is needed

Hopefully, the thing that can be seen here is that the codebase is _telling us_ what we need.   What's more, we can now start to dive into how to fit these solutions into either our _own pattern_ or how we might take advantage of a framework's pattern.

If it is the later, you can then begin to figure out how to adopt the Framework's pattern and recreate it for your own personal gain.  Don't be afraid to adjust it however you deem fit!  The `libs/state-component.js` began as an attempt to recreate the `flux` pattern, and ended up as a mesh between `flux`, `backbone` and _something else_ entirely!  And that is great because the pattern it was built for was for the application's needs - not a holistic "solve it all now and forever" approach!

Remember: this approach is optional.  Its intention though is to teach you how to (not only) understand good refactoring techniques, but also how you can learn to adopt a framework's patterns into your own, Native ES6+ solutions.

### Additional Notes
I wrote both of these examples in a little under two hours so don't expect them to be beautiful.  Their intent is to explain how to use the patterns that these frameworks are providing to you, and to also expose how easy it is to recreate them with nothing more than Native ES6+ =)

Finally - if you use any of the source code found in this example - please, just give me a node.  It would be mad appreciated =)

### Some Additional Resources

- [Learning Javascript Design Patterns](https://addyosmani.com/resources/essentialjsdesignpatterns/book/) - Addy Osmani
- [Learning JS Patterns Instead of Frameworks](https://2014.jsconf.eu/speakers/sebastian-markbage-minimal-api-surface-area-learning-patterns-instead-of-frameworks.html) - Sebastian Markbage (Engineer @ Facebook, React)
- [JS: The Right Way](https://jstherightway.org/)
- [JSX-render](https://github.com/alecsgone/jsx-render) - Source code to learn from when wanting to create your own version of JSX using pure, native ES6 (and *without* React) via a custom jsx pragma!
