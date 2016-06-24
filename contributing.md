# Contribute

We're happy to accept contributions in the form of new apps, bug fixes, issues and so on. If you want to help out, add a comment on the issue you want to work on and hack away! Before starting work on an app intended for submission, please open an issue to discuss it with the team. This will allow us to review the framework being used to determine if a spec-compatible app is likely to be accepted.

Please note that this project is released with a [Contributor Code of Conduct](code-of-conduct.md). By participating in this project you agree to abide by its terms.


## Considerations before submitting a new app

TodoMVC is a curation, not a collection. We want to make it easier for people to
find a base for their web applications, not harder. This is why we can't accept
every submission. However, we're always open to looking at novel ways to solve
existing problems.

It doesn't matter whether your app is written in plain JavaScript and HTML or is cross-compiled to
something a modern browser can execute. We care about bold ideas
that bring something truly new to the table, but minor variations of existing
frameworks or languages only add to [Front-end Choice
Paralysis](http://addyosmani.com/blog/front-end-choice-paralysis/).

Please bear in mind that your project should have reached a certain level of
maturity before we can include it. If you haven't settled on a relatively stable
API, you should probably wait a bit longer before submitting your example.


## Code Style

We think it's best for the project if the code you write looks like the code the last developer wrote, so we've put together [some guidelines we ask that you follow](https://github.com/tastejs/todomvc/blob/master/codestyle.md). We greatly appreciate your cooperation and contribution.


## Pull Request Guidelines

- Develop in a topic branch (not `master`) and submit against the `examples` folder in the default `master` branch.
- Squash your commits.
- Write a convincing description of your PR and why we should land it and what the framework or library you are proposing does differently.


## Submitting a New App

- **Read the [App Specification](app-spec.md) thoroughly**
- Use the [automated browser tests](/tests) to ensure that your app meets the app specification requirements. For bonus points add the test output to your pull request!
- Make sure it hasn't already been submitted or declined by searching the issue tracker
- Looking at our most recent [reference app](https://github.com/tastejs/todomvc/tree/master/examples/backbone)

One of us will be happy to review your submission and discuss any changes that may be required before it can be included.

Please think about the fact that contributing a new app means more than just a one-off pull request submitting the app. When the app gets included on the site, you will need to help us maintain the app and help us to solve issues with the implementation.
If the app breaks for a decent amount of time, we will (temporarily) remove it from the site, until somebody opens a PR to fix the raised issues and if somebody volunteers to help us keep it up to date.

## Browser Compatibility

Modern browser (latest: Chrome, Firefox, Opera, Safari, IE9)


## Unit Tests

At present, due to a large number of apps in the TodoMVC suite we haven't been mandating that unit tests be written in order for an application to be accepted.

We do, however, plan on addressing this in a future release as we feel it would both help further ensure consistency and provide developers with a reference for writing tests for each framework.

If you are a library author or contributor wishing to start work on writing tests for an implementation, we'll happily consider including them in the future. This may change based on how we specify unit tests must be structured and so on post 1.0.


## A Final Note

Note that due to the current number of MVC/MVVM/MV* frameworks in circulation, it's not always possible to include each one in TodoMVC, but we'll definitely discuss the merits of any framework prior to making a decision. :)

For applications that we feel don't quite match the goals of the project, but which we feel still offer value, we're happy to include references to them in our official [wiki](https://github.com/tastejs/todomvc/wiki/Other-implementations).
