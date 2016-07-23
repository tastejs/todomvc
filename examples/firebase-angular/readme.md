# Firebase & AngularJS TodoMVC Example

> Firebase is a scalable realtime backend that lets you build apps fast without managing servers.

> _[Firebase - firebase.com](https://www.firebase.com)_


## Learning Firebase

The [Firebase website](https://www.firebase.com) is a great resource for getting started.

Here are some links you may find helpful:

* [Tutorial](https://www.firebase.com/tutorial/)
* [Documentation & Examples](https://www.firebase.com/docs/)
* [API Reference](https://www.firebase.com/docs/web)
* [Blog](https://www.firebase.com/blog/)
* [Firebase on Github](http://firebase.github.io)
* [AngularJS bindings for Firebase](https://www.firebase.com/docs/web/libraries/angular/)

Get help from other AngularJS users:

* [Firebase on StackOverflow](http://stackoverflow.com/questions/tagged/firebase)
* [Google Groups mailing list](https://groups.google.com/forum/?fromgroups#!forum/firebase-talk)
* [Firebase on Twitter](https://twitter.com/Firebase)
* [Firebase on Facebook](https://facebook.com/Firebase)
* [Firebase on Google +](https://plus.google.com/115330003035930967645/posts)

_If you have other helpful links to share, or find any of the links above no longer work, please [let us know](https://github.com/tastejs/todomvc/issues)._

## Implementation

Firebase provides a realtime persistence layer for JSON data. In this example,
we combine Firebase with AngularJS to create a collaborative TODO app where
the TODO items are persisted and updated in realtime.

There is very little difference between this app and the vanilla AngularJS
TODO app in how AngularJS is used. The only significant difference is the
use of [AngularFire](http://github.com/firebase/angularFire), which provides
an AngularJS service for persisting and updating TODO items in realtime.
