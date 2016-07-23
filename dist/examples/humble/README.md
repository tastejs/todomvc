# Humble + GopherJS • [TodoMVC](http://todomvc.com)

> Humble is a collection of loosely-coupled tools designed to build client-side
> and hybrid web applications using GopherJS, which compiles Go code to
> JavaScript.
>
> [Humble - github.com/go-humble/humble](https://github.com/go-humble/humble) 


## Resources

- [Website](https://github.com/go-humble/humble)
- [Documentation](https://github.com/go-humble) (Each package is
  documented separately)

### Support

- [GopherJS on StackOverflow](http://stackoverflow.com/search?q=gopherjs)
- [GopherJS Google Group](https://groups.google.com/forum/#!forum/gopherjs)

*Let us [know](https://github.com/go-humble/humble/issues) if you discover anything worth sharing.*


## Demo

A [Live Demo](http://d3cqowlbjfdjrm.cloudfront.net/) of the application is
available online.

## Implementation

[GopherJS](https://github.com/gopherjs/gopherjs) compiles Go to JavaScript code
which can run in the browser. [Humble](https://github.com/go-humble/humble) is
a collection of tools written in Go designed to be compatible with GopherJS.

The following Humble packages are used:

- [router](https://github.com/go-humble/router) for handling the `/active` and
	`/completed` routes.
- [locstor](https://github.com/go-humble/locstor) for saving todos to
	localStorage.
- [temple](https://github.com/go-humble/temple) for managing Go templates and
	packaging them so they can run in the browser.
- [view](https://github.com/go-humble/view) for organizing views, doing basic
	DOM manipulation, and delegating events.

The full TodoMVC spec is implemented, including routes.

### Getting up and Running

First, [install Go](https://golang.org/dl/). You will also need to setup your
[Go workspace](https://golang.org/doc/code.html). It is important that you have
an environment variable called `GOPATH` which points to the directory where all
your Go code resides.

To download and install this repository, run
`go get github.com/go-humble/examples`, which will place the project in
`$GOPATH/src/github.com/go-humble/examples` on your machine.

You will also need to install GopherJS with
`go get -u github.com/gopherjs/gopherjs`. The `-u` flag gets the latest version,
which is recommended.

The project uses [temple](https://github.com/go-humble/temple) to precompile
templates. Install temple with `go get -u github.com/go-humble/temple`.

Then run `go generate ./...` to compile the templates and compile the Go code
to JavaScript.

Finally, serve the project directory with `go run serve.go` and visit
[localhost:8000](http://localhost:8000) in your browser.


## Credit

Created by [Alex Browne](http://www.alexbrowne.info)
