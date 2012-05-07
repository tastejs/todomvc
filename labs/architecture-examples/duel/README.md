TodoMVC implemented in DUEL
===========================

Prerequisites
-------------

This example requires [Apache Maven 3](http://maven.apache.org/download.html) to build.

About DUEL
----------

[DUEL](http://duelengine.org) is a duel-sided template engine. Views written as markup get precompiled into both
JavaScript (client-side templates) and Java (server-side templates).

The client-side templates are executed as functions directly from JavaScript. The result
can be rendered as either text markup or as DOM objects. This example generates DOM objects for views.

This particular example only uses the server-side templates for debugging. They have been generated into
the `target/generated-sources/duel/` directory.

How to build
------------

Run a standard Maven build command in the directory that contains the `pom.xml`:

	mvn clean package

Maven will download any dependencies, clean out any previously built files, and generate a new static app in the `www/` directory.

How to run debug version
------------------------

To run a debug-able version using Tomcat 7 as the web server, use this Maven command:

	mvn tomcat7:run

Then navigate your browser to: http://127.0.0.1:8080/
