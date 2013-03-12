# halo

Client-side MVC framework based on [Addy Osmani's talks][auraTalks] about [Aura][aura].

Halo can be found on [GitHub][halo].

[auraTalks]: http://addyosmani.com/futureproofjs/
[aura]: https://github.com/aurajs/aura
[halo]: https://github.com/Ensighten/Halo

## Case for Halo
Halo does one thing really well: modularlity. It was built on it and eats it day and night.

By not providing HTML helpers on the JavaScript level, but providing an extensible view build it encourages abstracting common view patterns. This also allows for a flat hierarchy for views since everything acts as a mixin.

Additionally, the controllers allow for easy breaking out and down of finer logic into its own module.

Halo doesn't handle models [at the time of writing][models] but that is because it was designed to let that heavy work to be handled by an API.

[models]: https://github.com/Ensighten/Halo/issues/21

## TodoMVC implementation

We followed the [TodoMVC specification][todomvc-spec] as close as possible except for one case. For routing, instead of using [Flatiron Director as specified][routing], routing was done by hand.

The case for this change is we believe that routes should be dictated by the state of the application and not vice versa. As a result, we implemented a [state model][state-model] which handles any complex case since it is catered to the application.

Additionally, it is preferred to use a [URLON][urlon] format for URLs over RESTful as it simplifies serialization and parsing.

[todomvc-spec]: https://github.com/addyosmani/todomvc/wiki/App-Specification
[routing]: https://github.com/addyosmani/todomvc/wiki/App-Specification#routing

[state-model]: models/state.js
[urlon]: http://blog.vjeux.com/2011/javascript/urlon-url-object-notation.html