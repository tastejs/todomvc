# ADR 001: Organize the CSSK as one source

## Context

While we were considering how to ship the CSSK, the question of how it
should be organized came up several times. The crux of the issue was
whether the more reusable parts (for example, the event dispatch bits)
should be separated into a library, or whether it should all just live
in one big pile of code. Currently, the CSSK is organized in the
latter manner.

Separating the infrastructure code out into a separate library would
make it more obvious which parts of the code are intended to be edited
by the developer. Right now, it’s not immediately obvious where to
make changes, and what bits are there to support the development
experience.

Separating the infrastructure code out into a separate library would
also make it far more inconvenient to make changes to it. Developers
would need to update the lib, possibly creating their own fork, and
then ensure that the app code was using the appropriate version. This
is extremely likely to happen because the infrastructure code is
neither comprehensive nor mature.

## Decision

We have decided to keep it all together, but clearly separate the
“library” code from the “app” code by using separate directories for
those two types of code: “lib” and “app”.

## Status

Accepted (by technical team).

## Consequences

* It becomes more obvious where the developer should be working
* It allows end-user developers to make changes to the
  infrastructure/library code more easily
* It may slow evolution of the infrastructure code somewhat, as people
  are less incented to contribute improvements back to the community -
  they can simply make the change to their fork.
