# Spyne js TodoMVC Example
<em>Spyne is a full-featured, reactive framework that creates ‘easy to reason about’ code</em>

### Spyne.js’ key features includes:

* Declarative style of coding with reactive and functional patterns
* Components are defined either as either a ViewStream object — the interactive-view layer, or as a Channel — the data layer.
* Events are first class citizens, and are streamed as data, in the form of Spyne Channels.
* ViewStreams and Channels communicate globally while remaining completely encapsulated.
* ViewStream instances exchange observables to creates smart DOM trees that reactively maintain state.
* Application Routing is based on a configurable map object.
* Has two dependencies, [RxJs](https://rxjs-dev.firebaseapp.com) and [ramda](https://ramdajs.com)

### Learning Spyne

- [Website](https://github.com/spynejs/spyne)
- [Documentation](https://spynejs.org)
- [Starter App](https://github.com/spynejs/spyne-example-app)


*Let us [know](https://github.com/spynejs/spyne/issues) if you discover anything worth sharing.*

**Spyne and the DCI Pattern**<br/>
Spyne is based on the [*Data Context Interaction*](https://en.wikipedia.org/wiki/Data,_context_and_interaction) pattern, where ViewStreams renders the proper *Context* of the app by broadcasting *Interactive* events that affect the *Data*, which cycles back to ViewStreams resyncing the site to the expected *Context*.




### Credit

Created by [Frank Batista](https://frankbatista.com)
