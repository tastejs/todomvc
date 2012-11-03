# Derby.js TodoMVC app

## Getting started

[NodeJS](http://nodejs.org) (>= 0.8.0) is required to run this app.

## Run the app
`make run`

This will install the dependencies locally, compile the coffeescript and run
the demo server for you.

## Play with the code
In one window, run `make` which will continue to compile the coffeescript as
you save changes. In a separate window run `node server.js` and open up the
shown URL.


## TODO
 * PROBLEM: Add ie.js - I've added the include to the template, but it
   obviously gets stripped out due to the comments, plus Nate mentioned that
   there's work needing to be done for ie < 10.
 * QUESTION: Check with derby folk whether there's a better way to do the filtering while still using a route, and other improvements.
