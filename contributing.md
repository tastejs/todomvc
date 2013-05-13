# Contribute

We're happy to accept contributions in the form of new apps, bug fixes, issues, etc. If you want to help out, add a comment on the issue you want to work on and start hacking. Please open an issue for discussion before submitting framework combinations (eg. Backbone + RequireJS).


## Code Style

We think it's best for the project if the code you write looks like the code the last developer wrote, so we've put together [some guidelines we ask that you follow](https://github.com/tastejs/todomvc/tree/gh-pages/codestyle.md). We greatly appreciate your cooperation and contribution.


## Pull Request Guidelines

- Develop in a topic branch (not `master`) and submit against the `labs` folder in the default `gh-pages` branch
- Squash your commits
- Write a convincing description of your PR and why we should land it


## Submitting a New App

- **Read the [App Specification](https://github.com/tastejs/todomvc/wiki/App-Specification) thoroughly**
- Make sure it hasn't already been submitted or declined by searching the issue tracker
- Looking at our most recent [reference app](https://github.com/tastejs/todomvc/tree/gh-pages/architecture-examples/backbone)

One of us will be happy to review your submission and discuss any changes that may be required before it can be included. Apps will typically land first in Labs, reaching the 'stable' mark once we and the community are happy with it.


## Browser Compatibility

Modern browser (latest: Chrome, Firefox, Opera, Safari, IE9)


## Unit Tests

At present, due to the large number of apps in the TodoMVC suite we haven't been mandating that unit tests be written in order for an application to be accepted.

We do however plan on addressing this in a future release as we feel it would both help further ensure consistency and provide developers with a reference for writing tests for each framework.

If you are a library author or contributor wishing to start work on writing tests for an implementation, we'll happily consider including them in the future. This may change based on how we specify unit tests must be structured and so on post 1.0.


## A Final Note

Note that due to the current number of MVC/MVVM/MV* frameworks in circulation, it's not always possible to include each one in TodoMVC, but we'll definitely discuss the merits of any framework prior to making a decision :)

For applications that we feel don't quite match the goals of the project, but which we feel still offer value, we're happy to include references to them in our official [wiki](https://github.com/tastejs/todomvc/wiki/Other-implementations).
