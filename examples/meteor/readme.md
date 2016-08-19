# Meteor • [TodoMVC](http://todomvc.com)

> Meteor is a full-stack JavaScript platform for developing modern web and mobile applications. Meteor includes a key set of technologies for building connected-client reactive applications, a build tool, and a curated set of packages from the Node.js and general JavaScript community.


## Setup

Make sure you have Meteor installed, if not do:
```bash
curl https://install.meteor.com/ | sh
```

Then:
```bash
cd examples/meteor
meteor npm install
meteor
```

Now you can go to [localhost:3000](http://localhost:3000)

## Resources

- [Website](http://meteor.com)
- [Documentation](http://docs.meteor.com/#/full/)
- [Guide](https://guide.meteor.com/)
- [Tutorials](https://www.meteor.com/tutorials)
- [Showcases](https://www.meteor.com/showcase)
- [Blog](http://info.meteor.com/blog)
- [FAQ](https://www.meteor.com/meteor-faq)

### Books & Learning Resources

- [Discover Meteor](https://www.discovermeteor.com/)
- [Meteor Tips: Your first meteor application](http://meteortips.com/)
- [Meteor In Action](http://www.meteorinaction.com/)

### 3rd Party Community Sites

- [Meteor Weekly](http://meteorweekly.com/)
- [Kadira Voice](https://voice.kadira.io/)
- [Meteor Chef](https://themeteorchef.com/)
- [Podcast: Meteor Transmission](https://transmission.simplecast.fm/)
- [Awesome Meteor](https://github.com/Urigo/awesome-meteor)

### Support

- [Stack Overflow](http://stackoverflow.com/questions/tagged/meteor)
- [Twitter](http://twitter.com/meteor)
- [Gitter](https://gitter.im/meteor/meteor)
- [Slack](http://slack.themeteorchef.com/)

*Let us [know](https://github.com/tastejs/todomvc/issues) if you discover anything worth sharing.*


## Implementation

This example follows most recent practices described by Meteor Team in official guide.

It uses few additional packages:
- `reactive-dict` together with `tracker` - For managing state in templates in reactive manner
- `kadira:flow-router` - Very simple router for Meteor. It does routing for client-side apps and does not handle rendering itself.
- `zimme:active-route` - This package provide helpers for figuring out if some route or path is or isn't the currently active route.
How was the app created? Anything worth sharing about the process of creating the app? Any spec violations?


## Credit

Created by [Michał Sajnóg](http://github.com/michalsnik)
