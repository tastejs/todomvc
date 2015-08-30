# DUEL • [TodoMVC](http://todomvc.com)

> DUEL is a dual-side templating engine using HTML for layout and 100% pure JavaScript as the binding language. The same views may be executed both directly in the browser (client-side template) and on the server (server-side template).


## Resources

- [Website](http://duelengine.org)
- [Documentation](http://bitbucket.org/mckamey/duel/wiki/Home)
- [Syntax](https://bitbucket.org/mckamey/duel/wiki/Syntax)
- [Examples](https://bitbucket.org/mckamey/duel/wiki/Examples)
- [Source](https://bitbucket.org/mckamey/duel/src)

*Let us [know](https://github.com/tastejs/todomvc/issues) if you discover anything worth sharing.*


## Implementation

[DUEL](http://duelengine.org) is a duel-sided template engine. Views written as markup get precompiled into both JavaScript (client-side templates) and Java (server-side templates).

The client-side templates are executed as functions directly from JavaScript. The result can be rendered as either text markup or as DOM objects. This example generates DOM objects for views.

This particular example only uses the server-side templates for debugging. They have been generated into the `target/generated-sources/duel/` directory.


## Building

This example requires [Apache Maven 3](http://maven.apache.org/download.html) to build.

To run a standard Maven build command in the directory that contains the `pom.xml`:

	mvn clean package

Maven will download any dependencies, clean out any previously built files, and generate a new static app in the `www/` directory.


## Running

To run a debug-able version using Tomcat 7 as the web server, use this Maven command:

	mvn tomcat7:run

Then navigate your browser to <http://localhost:8080/>

## Credit

Created by [Stephen McKamey](http://mck.me)
